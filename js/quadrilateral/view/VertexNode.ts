// Copyright 2021-2022, University of Colorado Boulder

/**
 * A view component for one of the vertices of the Quadrilateral.
 *
 * @author Jesse Greenberg
 */

import { Circle, CircleOptions, DragListener, KeyboardDragListener, Path, SceneryEvent, Text, Voicing, VoicingOptions } from '../../../../scenery/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import quadrilateral from '../../quadrilateral.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vertex from '../model/Vertex.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import vibrationManager from '../../../../tappi/js/vibrationManager.js';
import VertexDescriber from './VertexDescriber.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';

// constants
const LABEL_TEXT_FONT = new PhetFont( { size: 16, weight: 'bold' } );

const POINTER_AREA_DILATION = 5;

type SelfOptions = {

  // a11y - for both PDOM and Voicing
  nameResponse?: null | string;
};

// VertexNode sets these properties explicitly from the nameResponse option
type VertexNodeOptions = SelfOptions & StrictOmit<ParentOptions, 'voicingNameResponse' | 'innerContent'> & PickRequired<CircleOptions, 'tandem'>;

type ParentOptions = VoicingOptions & CircleOptions;

class VertexNode extends Voicing( Circle ) {
  private readonly model: QuadrilateralModel;

  public constructor( vertex: Vertex, vertexLabel: string, model: QuadrilateralModel, modelViewTransform: ModelViewTransform2, providedOptions: VertexNodeOptions ) {
    const options = optionize<VertexNodeOptions, SelfOptions, ParentOptions>()( {
      fill: QuadrilateralColors.quadrilateralShapeColorProperty,
      stroke: QuadrilateralColors.quadrilateralShapeStrokeColorProperty,
      tagName: 'div',
      ariaRole: 'application',
      focusable: true,
      nameResponse: null
    }, providedOptions );

    const viewRadius = modelViewTransform.modelToViewBounds( vertex.modelBoundsProperty.value ).width / 2;
    super( viewRadius );

    this.voicingNameResponse = options.nameResponse;
    this.innerContent = options.nameResponse;

    const vertexDescriber = new VertexDescriber( vertex, model.quadrilateralShapeModel );

    this.model = model;

    const vertexLabelText = new Text( vertexLabel, {
      center: this.center,
      font: LABEL_TEXT_FONT,

      // i18n
      maxWidth: 12 // by inspection
    } );
    this.addChild( vertexLabelText );

    // Add hatch marks to make it easier to align a vertex with the background grid
    const hatchMarkShape = new Shape();
    let angle = 0;
    while ( angle <= 2 * Math.PI ) {
      hatchMarkShape.moveTo( Math.cos( angle ) * viewRadius * 3 / 4, Math.sin( angle ) * viewRadius * 3 / 4 );
      hatchMarkShape.lineTo( Math.cos( angle ) * viewRadius, Math.sin( angle ) * viewRadius );
      angle += Math.PI / 2;
    }
    const hatchMarkPath = new Path( hatchMarkShape, { stroke: 'black' } );
    this.addChild( hatchMarkPath );

    // hatch marks are only visible when the grid is visible since they are used to create aligned positions.
    model.gridVisibleProperty.link( visible => {
      hatchMarkPath.visible = visible;
    } );

    // Expand the pointer areas a bit so that it is difficult to accidentally pick up a side when near the vertex edge
    this.touchArea = Shape.circle( viewRadius + POINTER_AREA_DILATION );
    this.mouseArea = this.touchArea;

    vertex.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );

    model.vertexLabelsVisibleProperty.link( vertexLabelsVisible => {
      vertexLabelText.visible = vertexLabelsVisible;
    } );

    const largeViewDragDelta = modelViewTransform.modelToViewDeltaX( QuadrilateralQueryParameters.majorVertexInterval );
    const smallViewDragDelta = modelViewTransform.modelToViewDeltaX( QuadrilateralQueryParameters.minorVertexInterval );
    const keyboardDragListener = new KeyboardDragListener( {
      transform: modelViewTransform,
      drag: ( modelDelta: Vector2 ) => {
        const proposedPosition = vertex.positionProperty.value.plus( modelDelta );
        if ( model.isVertexPositionAllowed( vertex, proposedPosition ) ) {
          vertex.voicingObjectResponseDirty = true;
          vertex.positionProperty.value = proposedPosition;
        }
      },

      // velocity defined in view coordinates per second, assuming 60 fps
      dragBoundsProperty: vertex.dragBoundsProperty,

      dragDelta: largeViewDragDelta,
      shiftDragDelta: smallViewDragDelta,
      moveOnHoldDelay: 750,
      moveOnHoldInterval: 50,

      // It seems that press and hold doesn't always move by downDelta. Maybe it should or maybe
      // we need an option like this.
      // alwaysMoveByDownDelta: true,
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } );
    this.addInputListener( keyboardDragListener );

    const dragListener = new DragListener( {
      transform: modelViewTransform,
      start: () => {

        // TODO: See #130, I am not sure what should be spoken during interaction
        this.voicingSpeakFullResponse();
      },
      drag: ( event: SceneryEvent, listener: DragListener ) => {
        const pointerPoint = event.pointer.point;
        const parentPoint = this.globalToParentPoint( pointerPoint );
        const modelPoint = modelViewTransform.viewToModelPosition( parentPoint );

        // constrain to the allowable positions in the model along the grid
        const constrainedPosition = QuadrilateralModel.getClosestGridPosition( modelPoint );

        if ( model.isVertexPositionAllowed( vertex, constrainedPosition ) ) {
          vertex.positionProperty.value = constrainedPosition;
        }
      },

      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    // notify when this vertex is pressed
    dragListener.isPressedProperty.link( isPressed => vertex.isPressedProperty.set( isPressed ) );

    // I am not sure if the isPressedProperty should be set here, but it may not be necessary. It should probably be set by the
    // KeyboardDragListener on start/end drag, or the KeyboardDRagListener should
    // have its own isPressedProperty to match the API of the DragListener.
    this.addInputListener( {
      focus: () => {
        vertex.isPressedProperty.value = true;
      },
      blur: () => {
        vertex.isPressedProperty.value = false;
      }
    } );

    // voicing
    model.quadrilateralShapeModel.shapeChangedEmitter.addListener( () => {
      this.voicingObjectResponse = vertexDescriber.getVertexObjectResponse();
    } );
    this.voicingObjectResponse = vertexDescriber.getVertexObjectResponse();

    // vibration
    vertex.isPressedProperty.lazyLink( isPressed => {
      if ( navigator !== undefined && navigator.vibrate !== undefined ) {
        if ( isPressed ) {
          vibrationManager.startRepeatingVibrationPattern( [ 75, 75 ] );
        }
        else {
          vibrationManager.stopRepeatingVibrationPattern();
        }
      }
    } );

    this.mutate( options );
  }
}

quadrilateral.register( 'VertexNode', VertexNode );
export default VertexNode;
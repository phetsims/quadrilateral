// Copyright 2021-2022, University of Colorado Boulder

/**
 * A view component for one of the vertices of the Quadrilateral.
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import { Circle, DragListener, KeyboardDragListener, SceneryEvent, Text, Voicing } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vertex from '../model/Vertex.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

// constants
const LABEL_TEXT_FONT = new PhetFont( { size: 16, weight: 'bold' } );

class VertexNode extends Voicing( Circle, 1 ) {
  private readonly model: QuadrilateralModel;

  // TODO: Options pattern cannot be used yet because of the trait pattern
  constructor( vertex: Vertex, vertexLabel: string, model: QuadrilateralModel, modelViewTransform: ModelViewTransform2, options?: any ) {
    options = merge( {

      fill: QuadrilateralColors.quadrilateralShapeColorProperty,
      stroke: QuadrilateralColors.quadrilateralShapeStrokeColorProperty,

      // pdom
      tagName: 'div',
      ariaRole: 'application',
      focusable: true,

      // a11y - for both PDOM and Voicing
      nameResponse: null,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const viewRadius = modelViewTransform.modelToViewBounds( vertex.modelBoundsProperty.value ).width / 2;
    super( viewRadius );

    assert && assert( options.voicingNameResponse === undefined, 'VertexNode sets voicingNameResponse from nameResponse' );
    assert && assert( options.innerContent === undefined, 'VertexNode sets innerContent from nameResponse' );
    this.voicingNameResponse = options.nameResponse;
    this.innerContent = options.nameResponse;

    this.model = model;

    const vertexLabelText = new Text( vertexLabel, {
      center: this.center,
      font: LABEL_TEXT_FONT,

      // i18n
      maxWidth: 12 // by inspection
    } );
    this.addChild( vertexLabelText );

    vertex.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );

    model.vertexLabelsVisibleProperty.link( vertexLabelsVisible => {
      vertexLabelText.visible = vertexLabelsVisible;
    } );

    // A basic keyboard input listener.
    const largeViewDragDelta = modelViewTransform.modelToViewDeltaX( QuadrilateralModel.MAJOR_GRID_SPACING );
    const smallViewDragDelta = modelViewTransform.modelToViewDeltaX( QuadrilateralModel.MINOR_GRID_SPACING );
    const keyboardDragListener = new KeyboardDragListener( {
      transform: modelViewTransform,
      drag: ( modelDelta: Vector2 ) => {
        const proposedPosition = vertex.positionProperty.value.plus( modelDelta );

        if ( model.isVertexPositionAllowed( vertex, proposedPosition ) ) {
          vertex.positionProperty.value = proposedPosition;
        }
      },

      // velocity defined in view coordinates per second, assuming 60 fps
      dragVelocity: largeViewDragDelta * 60,
      shiftDragVelocity: smallViewDragDelta * 60,
      dragBoundsProperty: vertex.dragBoundsProperty,

      downDelta: largeViewDragDelta,
      shiftDownDelta: smallViewDragDelta,
      moveOnHoldDelay: 750,
      moveOnHoldInterval: 50,

      // It seems that press and hold doesn't always move by downDelta. Maybe it should or maybe
      // we need an option like this.
      // alwaysMoveByDownDelta: true,
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } );
    this.addInputListener( keyboardDragListener );

    // @private {DragListener}
    const dragListener = new DragListener( {
      transform: modelViewTransform,
      drag: ( event: SceneryEvent, listener: DragListener ) => {
        const pointerPoint = event.pointer.point;
        const parentPoint = this.globalToParentPoint( pointerPoint! );
        const modelPoint = modelViewTransform.viewToModelPosition( parentPoint );

        // constrain to the allowable positions in the model along the grid
        const constrainedPosition = QuadrilateralModel.getClosestMinorGridPosition( modelPoint );

        if ( model.isVertexPositionAllowed( vertex, constrainedPosition ) ) {
          vertex.positionProperty.value = constrainedPosition;
        }
      },

      // @ts-ignore - TODO: Need to come through and do options, see #27
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

    this.mutate( options );
  }
}

quadrilateral.register( 'VertexNode', VertexNode );
export default VertexNode;
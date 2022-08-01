// Copyright 2021-2022, University of Colorado Boulder

/**
 * A view component for one of the vertices of the Quadrilateral.
 *
 * @author Jesse Greenberg
 */

import { Circle, CircleOptions, DragListener, KeyboardDragListener, SceneryEvent, Text, Voicing, VoicingOptions } from '../../../../scenery/js/imports.js';
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
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';

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

class VertexNode extends Voicing( Circle, 1 ) {
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

    // Expand the pointer areas a bit so that it is difficult to accidentally pick up a side when near the vertex edge
    this.touchArea = Shape.circle( viewRadius + POINTER_AREA_DILATION );
    this.mouseArea = this.touchArea;

    vertex.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );

    model.vertexLabelsVisibleProperty.link( vertexLabelsVisible => {
      vertexLabelText.visible = vertexLabelsVisible;
    } );

    // From keyboard dragging, a Voicing Object Response is triggered every move. But we can't generate the description
    // until all Shape Properties have been updated, so we need to wait to describe until after the shapeChangedEmitter
    // emits. See QuadrilateralShapeModel.updateOrderDependentProperties for more information.
    // Keyboard presses should trigger a response every input. When using mouse/touch we will never hear this,
    // because with that form of input the less frequent rate of information from context responses is sufficient.
    let voiceNextShapeChange = false;

    // Voicing for the vertex describes changing values. Since it is triggered by input instead of a changing Property
    // we need to watch the previous values of angle and distance to describe the new value.
    const oppositeVertex = model.quadrilateralShapeModel.oppositeVertexMap.get( vertex )!;
    let previousOppositeDistance = QuadrilateralShapeModel.getDistanceBetweenVertices( vertex, oppositeVertex );
    let previousAngle = vertex.angleProperty.value;

    const largeViewDragDelta = modelViewTransform.modelToViewDeltaX( QuadrilateralModel.MAJOR_GRID_SPACING );
    const smallViewDragDelta = modelViewTransform.modelToViewDeltaX( QuadrilateralModel.MINOR_GRID_SPACING );
    const keyboardDragListener = new KeyboardDragListener( {
      transform: modelViewTransform,
      drag: ( modelDelta: Vector2 ) => {
        const proposedPosition = vertex.positionProperty.value.plus( modelDelta );
        if ( model.isVertexPositionAllowed( vertex, proposedPosition ) ) {
          voiceNextShapeChange = true;
          previousAngle = vertex.angleProperty.value;
          previousOppositeDistance = QuadrilateralShapeModel.getDistanceBetweenVertices( vertex, oppositeVertex );
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
    const inputResponseUtterance = new Utterance( {

      // higher than the Priority of context responses so that timed context responses do not interrupt these
      // object responses
      priority: QuadrilateralConstants.INPUT_OBJECT_RESPONSE_PRIORITY
    } );
    model.quadrilateralShapeModel.shapeChangedEmitter.addListener( () => {
      this.voicingObjectResponse = vertexDescriber.getVertexObjectResponse();

      if ( voiceNextShapeChange ) {
        assert && assert( previousAngle !== null, 'previous angle value must be available for Voicing' );
        const response = vertexDescriber.getKeyboardDragObjectResponse( previousAngle!, previousOppositeDistance );
        this.voicingSpeakResponse( {
          objectResponse: response,
          utterance: inputResponseUtterance
        } );

        // wait until further input to describe more changes
        voiceNextShapeChange = false;
      }
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
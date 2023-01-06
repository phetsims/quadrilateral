// Copyright 2021-2023, University of Colorado Boulder

/**
 * A view component for one of the vertices of the Quadrilateral.
 *
 * @author Jesse Greenberg
 */

import { Circle, CircleOptions, DragListener, KeyboardDragListener, KeyboardUtils, Path, SceneryEvent, Text, Voicing, VoicingOptions } from '../../../../scenery/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vertex from '../model/Vertex.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VertexDescriber from './VertexDescriber.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import grabHighPitch_mp3 from '../../../sounds/grabHighPitch_mp3.js';
import boundaryReached_mp3 from '../../../../tambo/sounds/boundaryReached_mp3.js';
import quadShapeCollision_mp3 from '../../../sounds/quadShapeCollision_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import quadrilateral from '../../quadrilateral.js';

// constants
const LABEL_TEXT_FONT = new PhetFont( { size: 16, weight: 'bold' } );

type SelfOptions = {

  // a11y - for both PDOM and Voicing
  nameResponse?: null | string;
};

// VertexNode sets these properties explicitly from the nameResponse option
type VertexNodeOptions = SelfOptions & StrictOmit<ParentOptions, 'voicingNameResponse' | 'innerContent'> & PickRequired<CircleOptions, 'tandem'>;

type ParentOptions = VoicingOptions & CircleOptions;

class VertexNode extends Voicing( Circle ) {
  private readonly model: QuadrilateralModel;
  private readonly vertex: Vertex;

  public constructor( vertex: Vertex, vertexLabel: string, model: QuadrilateralModel, modelViewTransform: ModelViewTransform2, providedOptions: VertexNodeOptions ) {
    const options = optionize<VertexNodeOptions, SelfOptions, ParentOptions>()( {
      cursor: 'pointer',
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

    this.vertex = vertex;

    const vertexDescriber = new VertexDescriber( vertex, model.quadrilateralShapeModel, model.markersVisibleProperty );

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
    this.touchArea = Shape.circle( viewRadius + QuadrilateralConstants.POINTER_AREA_DILATION );
    this.mouseArea = this.touchArea;

    vertex.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );

    model.vertexLabelsVisibleProperty.link( vertexLabelsVisible => {
      vertexLabelText.visible = vertexLabelsVisible;
    } );

    const keyboardDragListener = new KeyboardDragListener( {
      transform: modelViewTransform,
      drag: ( modelDelta: Vector2 ) => {
        const proposedPosition = model.getClosestGridPositionInDirection( vertex.positionProperty.value, modelDelta );

        // constrain to model bounds
        const inBoundsPosition = model.vertexDragBoundsProperty.value.closestPointTo( proposedPosition );
        const isAgainstBounds = !inBoundsPosition.equals( proposedPosition );

        const isPositionAllowed = model.isVertexPositionAllowed( vertex, inBoundsPosition );
        if ( isPositionAllowed ) {
          vertex.voicingObjectResponseDirty = true;
          vertex.positionProperty.value = inBoundsPosition;
        }

        this.updateBlockedState( !isPositionAllowed, isAgainstBounds );
      },

      // velocity defined in view coordinates per second, assuming 60 fps
      dragBoundsProperty: vertex.dragBoundsProperty,

      moveOnHoldDelay: 750,
      moveOnHoldInterval: 50,

      // It seems that press and hold doesn't always move by downDelta. Maybe it should or maybe
      // we need an option like this.
      // alwaysMoveByDownDelta: true,
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } );
    this.addInputListener( keyboardDragListener );

    // The user is able to control the interval for positioning each vertex, a "fine" control or default
    model.preferencesModel.reducedStepSizeProperty.link( reducedStepSize => {
      const largeModelDelta = reducedStepSize ? QuadrilateralConstants.MAJOR_REDUCED_SIZE_VERTEX_INTERVAL : QuadrilateralQueryParameters.majorVertexInterval;
      const smallModelDelta = reducedStepSize ? QuadrilateralConstants.MINOR_REDUCED_SIZE_VERTEX_INTERVAL : QuadrilateralQueryParameters.minorVertexInterval;

      const largeViewDragDelta = modelViewTransform.modelToViewDeltaX( largeModelDelta );
      const smallViewDragDelta = modelViewTransform.modelToViewDeltaX( smallModelDelta );

      keyboardDragListener.dragDelta = largeViewDragDelta;
      keyboardDragListener.shiftDragDelta = smallViewDragDelta;
    } );

    // Position on drag start, in model coordinate frame.
    let startPosition: Vector2;
    const dragListener = new DragListener( {
      transform: modelViewTransform,
      start: event => {
        const pointerPoint = event.pointer.point;
        const parentPoint = this.globalToParentPoint( pointerPoint );
        startPosition = modelViewTransform.viewToModelPosition( parentPoint );
      },
      drag: ( event: SceneryEvent, listener: DragListener ) => {
        const pointerPoint = event.pointer.point;
        const parentPoint = this.globalToParentPoint( pointerPoint );
        const modelPoint = modelViewTransform.viewToModelPosition( parentPoint );

        // constrain to model bounds
        const inBoundsPosition = model.vertexDragBoundsProperty.value.closestPointTo( modelPoint );
        const isAgainstBounds = !inBoundsPosition.equals( modelPoint );

        // constrain to the allowable positions in the model along the grid
        const constrainedPosition = model.getClosestGridPosition( inBoundsPosition );

        const isPositionAllowed = model.isVertexPositionAllowed( vertex, constrainedPosition );

        if ( isPositionAllowed ) {
          vertex.positionProperty.value = constrainedPosition;
        }

        this.updateBlockedState( !isPositionAllowed, isAgainstBounds );
      },
      end: event => {

        // event may be null if interupted or cancelled
        if ( event ) {
          const pointerPoint = event.pointer.point;
          const parentPoint = this.globalToParentPoint( pointerPoint );
          const endPosition = modelViewTransform.viewToModelPosition( parentPoint );

          if ( startPosition.equals( endPosition ) ) {
            this.voicingSpeakFullResponse();
          }
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

    // sound - The grab sound is played on press but there is no release sound for this component since there is
    // no behavioral relevance to the release. Uses a custom "higher pitch" sound to distinguish it from
    // sides.
    const pressedSoundPlayer = new SoundClip( grabHighPitch_mp3, {
      initialOutputLevel: 0.8
    } );
    soundManager.addSoundGenerator( pressedSoundPlayer );
    vertex.isPressedProperty.lazyLink( isPressed => {
      if ( isPressed ) {
        pressedSoundPlayer.play();
      }
    } );

    // sound - when the Vertex becomes blocked because of collision with model bounds, play a unique sound
    const blockedByBoundsSoundClip = new SoundClip( boundaryReached_mp3, {
      initialOutputLevel: 1.0
    } );
    soundManager.addSoundGenerator( blockedByBoundsSoundClip );
    vertex.movementBlockedByBoundsProperty.lazyLink( blocked => {
      if ( blocked ) {
        blockedByBoundsSoundClip.play();
      }
    } );

    // sound = when the Vertex becomes blocked because of a collision with the shape itself, play a unique sound
    const blockedByShapeSoundClip = new SoundClip( quadShapeCollision_mp3, {
      initialOutputLevel: 0.5
    } );
    soundManager.addSoundGenerator( blockedByShapeSoundClip );
    vertex.movementBlockedByShapeProperty.lazyLink( blocked => {
      if ( blocked ) {
        blockedByShapeSoundClip.play();
      }
    } );

    // voicing
    model.quadrilateralShapeModel.shapeChangedEmitter.addListener( () => {
      this.voicingObjectResponse = vertexDescriber.getVertexObjectResponse();
    } );

    // when corner guides are visible more information is also included in the object response
    model.markersVisibleProperty.link( visible => {
      this.voicingObjectResponse = vertexDescriber.getVertexObjectResponse();
    } );

    // Voicing - for debugging, speak the full response again on spacebar/enter
    // TODO: remove this
    this.addInputListener( {
      keydown: event => {
        if ( KeyboardUtils.isAnyKeyEvent( event.domEvent, [ KeyboardUtils.KEY_ENTER, KeyboardUtils.KEY_SPACE ] ) ) {
          this.voicingSpeakFullResponse();
        }
      }
    } );

    // vibration
    // vertex.isPressedProperty.lazyLink( isPressed => {
    //   if ( navigator !== undefined && navigator.vibrate !== undefined ) {
    //     if ( isPressed ) {
    //       vibrationManager.startRepeatingVibrationPattern( [ 75, 75 ] );
    //     }
    //     else {
    //       vibrationManager.stopRepeatingVibrationPattern();
    //     }
    //   }
    // } );

    this.mutate( options );
  }

  /**
   * Update Properties in response to input indicating that the Vertex was blocked from moving for some reason.
   */
  public updateBlockedState( isBlockedByShape: boolean, isBlockedByBounds: boolean ): void {
    this.vertex.movementBlockedByShapeProperty.value = isBlockedByShape;
    this.vertex.movementBlockedByBoundsProperty.value = isBlockedByBounds;
  }
}

quadrilateral.register( 'VertexNode', VertexNode );
export default VertexNode;
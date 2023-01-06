// Copyright 2021-2023, University of Colorado Boulder

/**
 * The node for a side of a quadrilateral. No graphical design has been done yet, but creating this node
 * to exercise input and manipulation of the quad shape. By dragging a side both vertices of the side will
 * extend in the direction of motion of the side.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { DragListener, KeyboardDragListener, KeyboardUtils, Line as LineNode, Path, PathOptions, SceneryEvent, Voicing, VoicingOptions } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import Side from '../model/Side.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vertex from '../model/Vertex.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import { Line, Shape } from '../../../../kite/js/imports.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import SideDescriber from './SideDescriber.js';
import Multilink from '../../../../axon/js/Multilink.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import release_mp3 from '../../../../tambo/sounds/release_mp3.js';
import boundaryReached_mp3 from '../../../../tambo/sounds/boundaryReached_mp3.js';
import quadShapeCollision_mp3 from '../../../sounds/quadShapeCollision_mp3.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import SideTicksNode from './SideTicksNode.js';

// The dilation around side shapes when drawing the focus highlight.
const FOCUS_HIGHLIGHT_DILATION = 15;

type SelfOptions = {

  // The "accessible name" for both PDOM and Voicing, sets both voicingNameResponse and PDOM's innerContent.
  nameResponse?: null | string;
};
type ParentOptions = StrictOmit<VoicingOptions, 'voicingNameResponse'> & StrictOmit<PathOptions, 'innerContent'>;
type SideNodeOptions = SelfOptions & ParentOptions;

class SideNode extends Voicing( Path ) {

  // A reference to the model component.
  private side: Side;

  // A reference to the equivalent side with the two relevant vertices in the scratch model.
  private scratchSide: Side;

  // A reference to the main model for the simulation.
  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;

  // A scratch model so we can test vertex positions before setting them with input
  private scratchShapeModel: QuadrilateralShapeModel;
  private quadrilateralModel: QuadrilateralModel;

  public constructor( quadrilateralModel: QuadrilateralModel, side: Side, scratchSide: Side, modelViewTransform: ModelViewTransform2, providedOptions?: SideNodeOptions ) {

    const options = optionize<SideNodeOptions, SelfOptions, ParentOptions>()( {
      fill: QuadrilateralColors.quadrilateralShapeColorProperty,
      stroke: QuadrilateralColors.quadrilateralShapeStrokeColorProperty,

      // pdom and Voicing
      nameResponse: null,

      // pdom
      tagName: 'div',
      ariaRole: 'application',
      focusable: true
    }, providedOptions );

    super( side.shapeProperty.value );

    this.voicingNameResponse = options.nameResponse;
    this.innerContent = options.nameResponse;

    this.cursor = 'pointer';

    this.side = side;
    this.scratchSide = scratchSide;
    this.quadrilateralModel = quadrilateralModel;
    this.quadrilateralShapeModel = quadrilateralModel.quadrilateralShapeModel;
    this.scratchShapeModel = quadrilateralModel.quadrilateralTestShapeModel;

    const ticksNode = new SideTicksNode( side, modelViewTransform );
    this.addChild( ticksNode );

    const markersVisibleProperty = quadrilateralModel.markersVisibleProperty;

    // Generates descriptions
    const sideDescriber = new SideDescriber( side, this.quadrilateralShapeModel, quadrilateralModel.markersVisibleProperty, modelViewTransform );

    // Reusable lineNode for calculating the shape of the focus highlight
    const lineNode = new LineNode( 0, 0, 0, 0 );

    // listeners
    Multilink.multilink( [ side.vertex1.positionProperty, side.vertex2.positionProperty, markersVisibleProperty ], ( vertex1Position, vertex2Position, markersVisible ) => {

      ticksNode.visible = markersVisible;

      // create a single line that will then be divided into segments
      const fullLine = new Line( vertex1Position, vertex2Position );

      // The Shape for our Path - drawn in model coordinates until a transform at the end
      const lineShape = new Shape();

      if ( markersVisible ) {

        // If markers are visible we need to draw each unit segment. Break the line into multiple segments.
        const lineSegments = [];

        // The length of a segment parametrically relative to the full line length
        const parametricSegmentLength = Side.SIDE_SEGMENT_LENGTH / fullLine.getArcLength();

        const numberOfFullSegments = Math.floor( 1 / parametricSegmentLength );
        let t = 0;
        for ( let i = 0; i < numberOfFullSegments && t < 1; i++ ) {
          const nextPosition = Math.min( t + parametricSegmentLength, 1 );
          lineSegments.push( new Line( fullLine.positionAt( t ), fullLine.positionAt( nextPosition ) ) );
          t = nextPosition;
        }

        // the final segment should be the remainder from 1 (parametric end) to the last full segment
        assert && assert( 1 - t >= 0, 'we cannot have gone beyond the end of the full line parametrically' );

        // Ad the remaining portion of a segment if there is one. t might not be exactly one but close enough
        // that line.positionAt produces a line with zero length, so we only add another segment if it is large enough.
        if ( 1 - t > 0.0005 ) {
          const remainderLine = new Line( fullLine.positionAt( t ), fullLine.positionAt( 1 ) );
          lineSegments.push( remainderLine );

          // ensure that t was large enough that we didnt create a zero-length line
          assert && assert( !remainderLine.start.equals( remainderLine.end ), 'Should be a non-zero length remainder for the line in this case' );
        }

        const rightStrokes: Line[] = [];
        const leftStrokes: Line[] = [];
        lineSegments.forEach( ( lineSegment, index ) => {

          // stroke functions divide width by two for us
          const strokeRight = lineSegment.strokeRight( Side.SIDE_WIDTH );
          const strokeLeft = lineSegment.strokeLeft( Side.SIDE_WIDTH );

          rightStrokes.push( strokeRight[ 0 ] );
          leftStrokes.push( strokeLeft[ 0 ] );
        } );

        rightStrokes.forEach( ( rightStroke, index ) => {
          lineShape.moveToPoint( rightStroke.start );
          lineShape.lineToPoint( rightStroke.end );
          lineShape.lineToPoint( leftStrokes[ index ].start );
          lineShape.lineToPoint( leftStrokes[ index ].end );

          // so that fill will fill each segment individually and so we see strokes in between each segment
          lineShape.close();
        } );

        // only to the redrawing work for ticks when they are visible
        ticksNode.redraw();
      }
      else {

        // just a rectangular path along the line with the width of SIDE_WIDTH
        const rightStroke = fullLine.strokeRight( Side.SIDE_WIDTH );
        const leftStroke = fullLine.strokeLeft( Side.SIDE_WIDTH );

        lineShape.moveToPoint( rightStroke[ 0 ].start );
        lineShape.lineToPoint( rightStroke[ 0 ].end );
        lineShape.lineToPoint( leftStroke[ 0 ].start );
        lineShape.lineToPoint( leftStroke[ 0 ].end );

        lineShape.close();
      }

      // transform shape to view coordinates
      this.shape = modelViewTransform.modelToViewShape( lineShape );

      // Draw the custom focus highlight so that the highlight surrounds the shape of the line
      const vertex1ViewPosition = modelViewTransform.modelToViewPosition( vertex1Position );
      const vertex2ViewPosition = modelViewTransform.modelToViewPosition( vertex2Position );
      lineNode.setLine( vertex1ViewPosition.x, vertex1ViewPosition.y, vertex2ViewPosition.x, vertex2ViewPosition.y );
      lineNode.lineWidth = modelViewTransform.modelToViewDeltaX( Side.SIDE_WIDTH ) + FOCUS_HIGHLIGHT_DILATION;
      this.focusHighlight = lineNode.getStrokedShape();
    } );

    const keyboardDragListener = new KeyboardDragListener( {
      transform: modelViewTransform,
      drag: ( vectorDelta: Vector2 ) => {
        this.moveVerticesFromModelDelta( vectorDelta );
      },

      moveOnHoldDelay: 750,
      moveOnHoldInterval: 50,

      tandem: options.tandem?.createTandem( 'keyboardDragListener' )
    } );
    this.addInputListener( keyboardDragListener );

    // The user is able to control the interval for positioning each vertex, a "fine" control or default
    quadrilateralModel.preferencesModel.reducedStepSizeProperty.link( reducedStepSize => {
      const largeModelDelta = reducedStepSize ? QuadrilateralQueryParameters.majorReducedSizeVertexInterval : QuadrilateralQueryParameters.majorVertexInterval;
      const smallModelDelta = reducedStepSize ? QuadrilateralQueryParameters.minorReducedStepSizeVertexInterval : QuadrilateralQueryParameters.minorVertexInterval;

      const largeViewDragDelta = modelViewTransform.modelToViewDeltaX( largeModelDelta );
      const smallViewDragDelta = modelViewTransform.modelToViewDeltaX( smallModelDelta );

      keyboardDragListener.dragDelta = largeViewDragDelta;
      keyboardDragListener.shiftDragDelta = smallViewDragDelta;
    } );

    // Vectors between the start position during drag and each vertex so that we can translate vertex positions
    // relative to a pointer position on a side.
    let vectorToVertex1: null | Vector2 = null;
    let vectorToVertex2: null | Vector2 = null;

    this.addInputListener( new DragListener( {
      transform: modelViewTransform,
      start: ( event, listener ) => {

        // FOR DEBUGGING, when the side is pressed, show debug areas
        side.isPressedProperty.value = true;

        // point in the coordinate frame of the play area, then in model coordinates
        assert && assert( event.pointer.point, 'How could there not be a point from an event?' );
        const parentPoint = this.globalToParentPoint( event.pointer.point );
        const modelPoint = modelViewTransform.viewToModelPosition( parentPoint );

        vectorToVertex1 = ( side.vertex1.positionProperty.value ).minus( modelPoint );
        vectorToVertex2 = ( side.vertex2.positionProperty.value ).minus( modelPoint );

        // TODO: See #130, I am not sure what should be spoken during interaction
        this.voicingSpeakFullResponse();
      },
      end: () => {

        // FOR DEBUGGING: When the side is released, hide debug areas
        side.isPressedProperty.value = false;
      },
      drag: ( event: SceneryEvent, listener: DragListener ) => {

        const vertex1Pressed = side.vertex1.isPressedProperty.value;
        const vertex2Pressed = side.vertex2.isPressedProperty.value;

        if ( !vertex1Pressed && !vertex2Pressed ) {

          // point in the coordinate frame of the play area, then in model coordinates
          const parentPoint = this.globalToParentPoint( event.pointer.point );
          const modelPoint = modelViewTransform.viewToModelPosition( parentPoint );

          assert && assert( vectorToVertex1, 'vectorToVertex1 should have been defined at start of drag' );
          assert && assert( vectorToVertex2, 'vectorToVertex1 should have been defined at start of drag' );
          const modelVertex1Position = modelPoint.plus( vectorToVertex1! );
          const modelVertex2Position = modelPoint.plus( vectorToVertex2! );

          // Absolute bounding box around the side - useful for determine allowable vertex positions while supporting
          // smooth dragging
          const sideBounds = new Bounds2( 0, 0, 0, 0 );
          sideBounds.addPoint( modelVertex1Position );
          sideBounds.addPoint( modelVertex2Position );

          // now shift the proposed positions by a delta that would keep the sideBounds within vertexDragBounds
          const vertexDragBounds = quadrilateralModel.vertexDragBoundsProperty.value;
          const correctingVector = new Vector2( 0, 0 );

          const inBounds = vertexDragBounds.containsBounds( sideBounds );
          if ( !inBounds ) {

            if ( sideBounds.maxY > vertexDragBounds.maxY ) {
              correctingVector.y = vertexDragBounds.maxY - sideBounds.maxY;
            }
            else if ( sideBounds.minY < vertexDragBounds.minY ) {
              correctingVector.y = vertexDragBounds.minY - sideBounds.minY;
            }

            if ( sideBounds.maxX > vertexDragBounds.maxX ) {
              correctingVector.x = vertexDragBounds.maxX - sideBounds.maxX;
            }
            else if ( sideBounds.minX < vertexDragBounds.minX ) {
              correctingVector.x = vertexDragBounds.minX - sideBounds.minX;
            }
          }

          const boundsConstrainedVertex1Position = modelVertex1Position.plus( correctingVector );
          const boundsConstrainedVertex2Position = modelVertex2Position.plus( correctingVector );

          // constrain each to the model grid
          const gridConstrainedVertex1Position = quadrilateralModel.getClosestGridPosition( boundsConstrainedVertex1Position );
          const gridConstrainedVertex2Position = quadrilateralModel.getClosestGridPosition( boundsConstrainedVertex2Position );

          // deltas for each Vertex must be the same for the side to not change tilt while dragging - update
          // both Vertices by the smallest translation vector so they move together
          const smallestDeltaVector = this.getSmallestTranslationVector( gridConstrainedVertex1Position, gridConstrainedVertex2Position );

          const proposedVertex1Position = side.vertex1.positionProperty.value.plus( smallestDeltaVector );
          const proposedVertex2Position = side.vertex2.positionProperty.value.plus( smallestDeltaVector );

          // only update positions if both are allowed
          const positionsAllowed = quadrilateralModel.areVertexPositionsAllowed( side.vertex1, proposedVertex1Position, side.vertex2, proposedVertex2Position );
          if ( positionsAllowed ) {
            this.quadrilateralShapeModel.setVertexPositions( [
              { vertex: side.vertex1, proposedPosition: proposedVertex1Position },
              { vertex: side.vertex2, proposedPosition: proposedVertex2Position }
            ] );
          }

          this.updateBlockedState( !positionsAllowed, !inBounds );
        }
        else if ( vertex1Pressed !== vertex2Pressed ) {

          // only one vertex is pressed, rotate around the pressed vertex
          if ( vertex1Pressed ) {
            this.rotateVertexAroundOther( side.vertex1, side.vertex2, listener.modelDelta );
          }
          else {
            this.rotateVertexAroundOther( side.vertex2, side.vertex1, listener.modelDelta );
          }
        }
      },

      tandem: options.tandem?.createTandem( 'dragListener' )
    } ) );

    this.mutate( options );

    // for debugging, set this Property when we receive focus so that the debugging shapes showing vertex drag areas
    // become visible
    this.addInputListener( {
      focus: () => {
        side.isPressedProperty.value = true;
      },
      blur: () => {
        side.isPressedProperty.value = false;
      }
    } );

    // sound - the grab sound is played on press but there is no release sound for this component since there is
    // no behavioral relevance to the release. The 'release' sound is used instead of 'grab' to distinguish sides
    // from vertices
    const pressedSoundPlayer = new SoundClip( release_mp3, {
      initialOutputLevel: 0.8
    } );
    soundManager.addSoundGenerator( pressedSoundPlayer );
    side.isPressedProperty.lazyLink( isPressed => {
      if ( isPressed ) {
        pressedSoundPlayer.play();
      }
    } );

    // sound - when the Vertex becomes blocked because of an intersection with model bounds, play a unique sound
    // TODO: Copy/paste with VertexNode, maybe a superclass for this, with the same Properties watching collision?
    const blockedSoundPlayer = new SoundClip( boundaryReached_mp3, {
      initialOutputLevel: 1.0
    } );
    soundManager.addSoundGenerator( blockedSoundPlayer );
    side.movementBlockedByBoundsProperty.lazyLink( blocked => {
      if ( blocked ) {
        blockedSoundPlayer.play();
      }
    } );

    // sound - when a vertex becomes blocked because of a collision with the shape itself, play a unique sound
    const blockedByShapeSoundClip = new SoundClip( quadShapeCollision_mp3, {
      initialOutputLevel: 0.5
    } );
    soundManager.addSoundGenerator( blockedByShapeSoundClip );
    side.movementBlockedByShapeProperty.lazyLink( blocked => {
      if ( blocked ) {
        blockedByShapeSoundClip.play();
      }
    } );

    // voicing - re-generate the voicing description when dependent Properties change
    this.quadrilateralShapeModel.shapeChangedEmitter.addListener( () => {
      this.voicingObjectResponse = sideDescriber.getSideObjectResponse();
    } );
    this.quadrilateralModel.markersVisibleProperty.link( () => {
      this.voicingObjectResponse = sideDescriber.getSideObjectResponse();
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
    // TODO: This code for vibration is a prototype, and only vibrates for a finite time.  It will need to be improved
    //       and finalized before publication.  See https://github.com/phetsims/quake/issues/13.
    // side.isPressedProperty.lazyLink( isPressed => {
    //
    //   if ( navigator !== undefined && navigator.vibrate !== undefined ) {
    //     if ( isPressed ) {
    //       vibrationManager.startVibrate( [ 200, 200 ] );
    //     }
    //     else {
    //       vibrationManager.stopVibrate();
    //     }
    //   }
    // } );
  }

  private getSmallestTranslationVector( proposedVertex1Position: Vector2, proposedVertex2Position: Vector2 ): Vector2 {
    const currentVertex1Position = this.side.vertex1.positionProperty.value;
    const currentVertex2Position = this.side.vertex2.positionProperty.value;

    // Each Vertex must move by the same amount so that the side does not tile during input. Find the smallest change
    // after constraining vertices to the grid, and we will move both vertices by that delta.
    return _.minBy( [
      proposedVertex1Position.minus( currentVertex1Position ),
      proposedVertex2Position.minus( currentVertex2Position )
    ], vector => vector.magnitude )!;
  }

  /**
   * Move both vertices of this side from the change in position specified by deltaVector.
   *
   * @param deltaVector - change of position in model coordinates
   */
  private moveVerticesFromModelDelta( deltaVector: Vector2 ): void {
    const currentVertex1Position = this.side.vertex1.positionProperty.value;
    const currentVertex2Position = this.side.vertex2.positionProperty.value;

    // constrain each Vertex position to the closest allowable grid position
    const closestVertex1Position = this.quadrilateralModel.getClosestGridPositionInDirection( currentVertex1Position, deltaVector );
    const closestVertex2Position = this.quadrilateralModel.getClosestGridPositionInDirection( currentVertex2Position, deltaVector );

    // Each Vertex must move by the same amount so that the side does not tile during input. Find the smallest change
    // after constraining vertices to the grid, and we will move both vertices by that delta.
    const smallestDeltaVector = this.getSmallestTranslationVector( closestVertex1Position, closestVertex2Position );

    const proposedVertex1Position = currentVertex1Position.plus( smallestDeltaVector );
    const proposedVertex2Position = currentVertex2Position.plus( smallestDeltaVector );

    const vertexDragBounds = this.quadrilateralModel.vertexDragBoundsProperty.value;
    const inBounds = vertexDragBounds.containsPoint( proposedVertex1Position ) && vertexDragBounds.containsPoint( proposedVertex2Position );

    // update the scratch model before setting proposed vertex positions
    this.scratchShapeModel.set( this.quadrilateralShapeModel );

    // Set the positions to the scratch model so that we can verify that this produces a valid shape. Since we are
    // moving two vertices at the same time we need to check the validity after both have moved, checking the shape
    // moving one vertex at a time may result in incorrect results since that is not the shape we are ultimately
    // going to create with this change.
    this.scratchShapeModel.setVertexPositions( [
      { vertex: this.scratchSide.vertex1, proposedPosition: proposedVertex1Position },
      { vertex: this.scratchSide.vertex2, proposedPosition: proposedVertex2Position }
    ] );

    const isShapeAllowed = this.scratchShapeModel.isQuadrilateralShapeAllowed();
    if ( isShapeAllowed ) {

      // signify to the Alerter that it will be time to generate a new object response from input
      this.side.voicingObjectResponseDirty = true;

      this.quadrilateralShapeModel.setVertexPositions( [
        { vertex: this.side.vertex1, proposedPosition: proposedVertex1Position },
        { vertex: this.side.vertex2, proposedPosition: proposedVertex2Position }
      ] );
    }

    this.updateBlockedState( !isShapeAllowed, !inBounds );
  }

  /**
   * Update Properties in response to input indicating that the Side was blocked from moving for some reason.
   * TODO: Reduce duplication with VertexNode, maybe a superclass?
   */
  public updateBlockedState( isBlockedByShape: boolean, isBlockedByBounds: boolean ): void {
    this.side.movementBlockedByShapeProperty.value = isBlockedByShape;
    this.side.movementBlockedByBoundsProperty.value = isBlockedByBounds;
  }

  /**
   * Rotate one vertex around another by moving the "arm" vertex as if it were being directly dragged while keeping the
   * pressed vertex locked in place.
   *
   * @param anchorVertex - Anchor vertex we are rotating around.
   * @param armVertex - Vertex being repositioned.
   * @param modelDelta - The amount of movement of the arm drag in model coordinates
   */
  private rotateVertexAroundOther( anchorVertex: Vertex, armVertex: Vertex, modelDelta: Vector2 ): void {
    const modelPosition = armVertex.positionProperty.get().plus( modelDelta );
    const proposedPosition = this.quadrilateralModel.getClosestGridPosition( modelPosition );
    if ( this.quadrilateralModel.isVertexPositionAllowed( armVertex, proposedPosition ) ) {
      armVertex.positionProperty.value = proposedPosition;
    }
  }
}

quadrilateral.register( 'SideNode', SideNode );
export default SideNode;

// Copyright 2021-2022, University of Colorado Boulder

/**
 * The node for a side of a quadrilateral. No graphical design has been done yet, but creating this node
 * to exercise input and manipulation of the quad shape. By dragging a side both vertices of the side will
 * extend in the direction of motion of the side.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import { DragListener, KeyboardDragListener, Path, SceneryEvent, Voicing } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import Side from '../model/Side.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vertex from '../model/Vertex.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import Line from '../../../../kite/js/segments/Line.js';
import Shape from '../../../../kite/js/Shape.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';

class SideNode extends Voicing( Path, 1 ) {
  private side: Side;
  private scratchSide: Side;
  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;
  private scratchShapeModel: QuadrilateralShapeModel;
  private quadrilateralModel: QuadrilateralModel;

  // TODO: Options pattern cannot be used yet because of Voicing trait
  public constructor( quadrilateralModel: QuadrilateralModel, side: Side, scratchSide: Side, modelViewTransform: ModelViewTransform2, options?: any ) {

    options = merge( {
      fill: QuadrilateralColors.quadrilateralShapeColorProperty,
      stroke: QuadrilateralColors.quadrilateralShapeStrokeColorProperty,

      // pdom
      tagName: 'div',
      focusable: true,

      // phet-io
      tandem: Tandem.OPTIONAL
    }, options );

    super( side.shapeProperty.value );

    // A reference to the model component.
    this.side = side;

    // A reference to the equivalent side with the two relevant vertices in the scratch model.
    this.scratchSide = scratchSide;

    // A reference to the main model for the simulation.
    this.quadrilateralModel = quadrilateralModel;

    // A reference to the main model for the simulation
    this.quadrilateralShapeModel = quadrilateralModel.quadrilateralShapeModel;

    // A scratch model so we can test vertex positions before setting them with input
    this.scratchShapeModel = quadrilateralModel.quadrilateralTestShapeModel;

    // Mutate options eagerly, but not in super because that doesn't work with the Voicing trait
    this.mutate( options );

    // listeners
    Property.multilink( [ side.vertex1.positionProperty, side.vertex2.positionProperty ], ( vertex1Position: Vector2, vertex2Position: Vector2 ) => {

      // create a single line that will then be divided into segments
      const fullLine = new Line( vertex1Position, vertex2Position );

      // break the viewLine into multiple lines that are of the segment length
      const lineSegments = [];

      // The length of a segment parametrically relative to the full line length
      const parametricSegmentLength = Side.SIDE_SEGMENT_LENGTH / fullLine.getArcLength();

      const numberOfFullSegments = Math.floor( 1 / parametricSegmentLength );
      let t = 0;
      for ( let i = 0; i < numberOfFullSegments; i++ ) {
        const nextPosition = t + parametricSegmentLength;
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

        // The "taper" effect has been removed, but this line makes each segment more narrow than the previous one
        // and is the reason for such complicated Shape/drawing code. It might be needed again so I am not removing it.
        // But for now a constant width was requested.
        // const segmentWidth = Math.max( Side.SIDE_WIDTH - index * Vertex.VERTEX_WIDTH * 0.05, 0 );
        const segmentWidth = Side.SIDE_WIDTH;

        // stroke functions divide width for us
        const strokeRight = lineSegment.strokeRight( segmentWidth );
        const strokeLeft = lineSegment.strokeLeft( segmentWidth );

        rightStrokes.push( strokeRight[ 0 ] );
        leftStrokes.push( strokeLeft[ 0 ] );
      } );

      const lineShape = new Shape();

      rightStrokes.forEach( ( rightStroke, index ) => {
        lineShape.moveToPoint( rightStroke.start );
        lineShape.lineToPoint( rightStroke.end );
        lineShape.lineToPoint( leftStrokes[ index ].start );
        lineShape.lineToPoint( leftStrokes[ index ].end );

        // so that fill will fill each segment individually and so we see strokes in between each segment
        lineShape.close();
      } );

      // transform shape to view coordinates
      this.shape = modelViewTransform.modelToViewShape( lineShape );
    } );

    // supports keyboard dragging, attempts to move both vertices in the direction of motion of the line
    const viewDragDelta = modelViewTransform.modelToViewDeltaX( QuadrilateralConstants.MOVEMENT_PER_KEY_PRESS );
    this.addInputListener( new KeyboardDragListener( {
      transform: modelViewTransform,
      drag: ( vectorDelta: Vector2 ) => {
        this.moveVerticesFromModelDelta( vectorDelta );
      },

      // velocity defined in view coordinates per second, assuming 60 fps
      dragVelocity: viewDragDelta * 60,
      shiftDragVelocity: ( viewDragDelta / 2 ) * 60,

      downDelta: viewDragDelta,
      shiftDownDelta: viewDragDelta / 2,
      moveOnHoldDelay: 750,
      moveOnHoldInterval: 50,
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } ) );

    this.addInputListener( new DragListener( {
      transform: modelViewTransform,
      start: event => {

        // FOR DEBUGGING, when the side is pressed, show debug areas
        side.isPressedProperty.value = true;
      },
      end: () => {

        // FOR DEBUGGING: When the side is released, hide debug areas
        side.isPressedProperty.value = false;
      },
      drag: ( event: SceneryEvent, listener: DragListener ) => {

        const vertex1Pressed = side.vertex1.isPressedProperty.value;
        const vertex2Pressed = side.vertex2.isPressedProperty.value;

        if ( !vertex1Pressed && !vertex2Pressed ) {

          // neither vertex is pressed, move both vertices together as you drag a side
          this.moveVerticesFromModelDelta( listener.modelDelta );
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

      tandem: options.tandem.createTandem( 'dragListener' )
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
  }

  /**
   * Move both vertices of this side from the change in position specified by deltaVector.
   *
   * @param deltaVector - change of position in model coordinates
   */
  private moveVerticesFromModelDelta( deltaVector: Vector2 ) {

    // vectorDelta is in model coordinates already since we provided a transform to the listener
    let proposedVertex1Position = this.side.vertex1.positionProperty.get().plus( deltaVector );
    let proposedVertex2Position = this.side.vertex2.positionProperty.get().plus( deltaVector );

    // constrain positions to the "grid" of the model
    proposedVertex1Position = QuadrilateralModel.getClosestMinorGridPosition( proposedVertex1Position );
    proposedVertex2Position = QuadrilateralModel.getClosestMinorGridPosition( proposedVertex2Position );

    // if the positions are outside of model bounds, the shape is not allowed
    // TODO: I am not sure how to put this in the isQuadrilateralShapeAllowed, because to set the shape
    // we change the vertex position Properties, which recomputes drag areas. The drag area algorithm requires
    // that vertex positions are within bounds so we are tyring to avoid reaching that. Perhaps allow infinite drag
    // shapes for the scratch model?
    if ( !this.quadrilateralModel.modelBoundsProperty.value?.containsPoint( proposedVertex1Position ) ||
         !this.quadrilateralModel.modelBoundsProperty.value?.containsPoint( proposedVertex2Position ) ) {
      return;
    }

    // update the scratch model before setting proposed vertex positions
    this.scratchShapeModel.set( this.quadrilateralShapeModel );

    // Set the positions to the scratch model so that we can verify that this produces a valid shape. Since we are
    // moving two vertices at the same time we need to check the validity after both have moved, checking the shape
    // moving one vertex at a time may result in incorrect results since that is not the shape we are ultimately
    // going to create with this change.
    this.scratchSide.vertex1.positionProperty.set( proposedVertex1Position );
    this.scratchSide.vertex2.positionProperty.set( proposedVertex2Position );

    if ( this.scratchShapeModel.isQuadrilateralShapeAllowed() ) {
      this.side.vertex1.positionProperty.set( proposedVertex1Position );
      this.side.vertex2.positionProperty.set( proposedVertex2Position );
    }
  }

  /**
   * Rotate one vertex around another by moving the "arm" vertex as if it were being directly dragged while keeping the
   * pressed vertex locked in place.
   * @private
   *
   * @param anchorVertex - Anchor vertex we are rotating around.
   * @param armVertex - Vertex being repositioned.
   * @param modelDelta - The amount of movement of the arm drag in model coordinates
   */
  private rotateVertexAroundOther( anchorVertex: Vertex, armVertex: Vertex, modelDelta: Vector2 ) {
    const proposedPosition = armVertex.positionProperty.get().plus( modelDelta );

    if ( this.quadrilateralShapeModel.isVertexPositionAllowed( armVertex, proposedPosition ) ) {
      armVertex.positionProperty.value = proposedPosition;
    }
  }
}

quadrilateral.register( 'SideNode', SideNode );
export default SideNode;

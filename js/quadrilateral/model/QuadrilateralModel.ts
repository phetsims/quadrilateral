// Copyright 2021, University of Colorado Boulder

/**
 * The base model class for Quadrilateral. Assembles all model components and responsible for managing Properties
 * that indicate the state of the whole Quadrilateral shape. Will probably also manage Properties that manage
 * the state of the Sim (UI element visibility and so on).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Ray2 from '../../../../dot/js/Ray2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Line from '../../../../kite/js/segments/Line.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import Side from './Side.js';
import Vertex from './Vertex.js';
import RayIntersection from '../../../../kite/js/util/RayIntersection.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';

// A useful type for calculations for the vertex Shapes which define where the Vertex can move depending on
// the positions of the other vertices. Lines are along the bounds of model space and RayIntersections
// are the intersections between rays formed by adjacent vertices and the Line. See createVertexAreas for
// more information.
type LineIntersectionPair = {
  line: Line;
  intersection: RayIntersection
}

// Bounds used for calculations, but a single instance to reduce garbage.
const SCRATCH_BOUNDS = new Bounds2( 0, 0, 0, 0 );

class QuadrilateralModel {
  public vertex1: Vertex;
  public vertex2: Vertex;
  public vertex3: Vertex;
  public vertex4: Vertex;

  public readonly vertices: Vertex[];

  public topSide: Side;
  public rightSide: Side;
  public bottomSide: Side;
  public leftSide: Side;

  public modelBoundsProperty: Property<Bounds2 | null>;
  public angleToleranceIntervalProperty: Property<number>;
  public readonly isParallelogramProperty: Property<boolean>;
  public resetNotInProgressProperty: BooleanProperty;

  public shapeChangedEmitter: Emitter<[]>;

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {

    // vertices of the quadrilateral
    this.vertex1 = new Vertex( new Vector2( -0.25, 0.25 ), tandem.createTandem( 'vertex1' ) );
    this.vertex2 = new Vertex( new Vector2( 0.25, 0.25 ), tandem.createTandem( 'vertex2' ) );
    this.vertex3 = new Vertex( new Vector2( 0.25, -0.25 ), tandem.createTandem( 'vertex3' ) );
    this.vertex4 = new Vertex( new Vector2( -0.25, -0.25 ), tandem.createTandem( 'vertex4' ) );

    // Collection of the vertices which should be easy to iterate over
    this.vertices = [ this.vertex1, this.vertex2, this.vertex3, this.vertex4 ];

    // create the sides of the quadrilateral
    this.topSide = new Side( this.vertex1, this.vertex2, tandem.createTandem( 'topSide' ), {
      offsetVectorForTiltCalculation: new Vector2( 0, 1 )
    } );
    this.rightSide = new Side( this.vertex2, this.vertex3, tandem.createTandem( 'rightSide' ) );
    this.bottomSide = new Side( this.vertex3, this.vertex4, tandem.createTandem( 'bottomSide' ), {
      offsetVectorForTiltCalculation: new Vector2( 0, -1 )
    } );
    this.leftSide = new Side( this.vertex4, this.vertex1, tandem.createTandem( 'leftSide' ), {
      offsetVectorForTiltCalculation: new Vector2( -1, 0 )
    } );

    this.modelBoundsProperty = new Property<Bounds2 | null>( null );

    // Whether or not a reset is currently in progress. Added for sound. If the model is actively resetting,
    // SoundManagers will disable so we don't play sounds for transient model states. It is a value for when
    // the reset is NOT in progress because that is most convenient to pass to SoundGenerator enableControlProperties.
    this.resetNotInProgressProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'resetNotInProgressProperty' )
    } );

    // Connect the sides, creating the shape and giving xvertices the information they need to determine their angles.
    this.rightSide.connectToSide( this.topSide );
    this.bottomSide.connectToSide( this.rightSide );
    this.leftSide.connectToSide( this.bottomSide );
    this.topSide.connectToSide( this.leftSide );

    // A value that controls the threshold for equality when determining if the quadrilateral forms a parallelogram.
    // Without a margin of error it would be exceedingly difficult to create a parallelogram shape. It is unclear
    // whether this need to change, but it seems useful now to be able to easily change this value during development.
    // The initial value is determined by query parameter while we sort out
    // https://github.com/phetsims/quadrilateral/issues/26
    this.angleToleranceIntervalProperty = new NumberProperty( QuadrilateralQueryParameters.angleToleranceInterval, {
      tandem: tandem.createTandem( 'angleToleranceIntervalProperty' ),
      range: new Range( 0, 2 * Math.PI )
    } );

    // Whether the quadrilateral is a parallelogram. This Property updates async in the step function! We need to
    // update this Property after all vertex positions and all vertex angles have been updated. When moving more than
    // one vertex at a time, only one vertex position updates synchronously in the code and in those transient states
    // the model may temporarily not be a parallelogram. Updating in step after all Properties and listeners are done
    // with this work resolves the problem.
    this.isParallelogramProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isParallelogramProperty' )
    } );

    // @public {Emitter} - Emits an event whenever the shape of the Quadrilateral changes
    this.shapeChangedEmitter = new Emitter<[]>();

    Property.multilink( [
        this.vertex1.positionProperty,
        this.vertex2.positionProperty,
        this.vertex3.positionProperty,
        this.vertex4.positionProperty ],
      ( position1: Vector2, position2: Vector2, position3: Vector2, position4: Vector2 ) => {
        this.shapeChangedEmitter.emit();

        if ( this.modelBoundsProperty.value ) {
          this.setVertexDragAreas();
        }
      }
    );

    this.modelBoundsProperty.link( modelBounds => {
      if ( modelBounds ) {
        this.setVertexDragAreas();
      }
    } );
  }

  /**
   * Returns whether or not the quadrilateral shape is a parallelogram, within the tolerance defined by
   * angleToleranceIntervalProperty.
   */
  public getIsParallelogram(): boolean {
    const angle1DiffAngle3 = Math.abs( this.vertex1.angleProperty!.value - this.vertex3.angleProperty!.value );
    const angle2DiffAngle4 = Math.abs( this.vertex2.angleProperty!.value - this.vertex4.angleProperty!.value );
    const epsilon = this.angleToleranceIntervalProperty.value;

    return angle1DiffAngle3 < epsilon && angle2DiffAngle4 < epsilon;
  }

  /**
   * Returns true if the provided Vertex is allowed to exist in the proposed position. The Vertex is not allowed
   * to overlap any other Vertex of the model. It also must be within the drag area that is defined by the positions
   * of other vertices in the model, which prevents the shape from becoming twisted.
   *
   * @param vertex - The vertex in question, so we don't compare it to itself
   * @param proposedPosition
   */
  public isVertexPositionAllowed( vertex: Vertex, proposedPosition: Vector2 ): boolean {
    let positionAllowed = true;

    SCRATCH_BOUNDS.setMinMax(
      proposedPosition.x - Vertex.VERTEX_BOUNDS.width / 2,
      proposedPosition.y - Vertex.VERTEX_BOUNDS.height / 2,
      proposedPosition.x + Vertex.VERTEX_BOUNDS.width / 2,
      proposedPosition.y + Vertex.VERTEX_BOUNDS.height / 2
    );

    // vertex cannot overlap any others
    for ( let i = 0; i < this.vertices.length; i++ ) {
      const otherVertex = this.vertices[ i ];
      if ( vertex !== otherVertex && otherVertex.boundsOverlapsVertex( SCRATCH_BOUNDS ) ) {
        positionAllowed = false;
        break;
      }
    }

    // if the position is still allowed, check to see if the position is within the valid shape of the
    // vertex
    if ( positionAllowed ) {
      assert && assert( vertex.dragAreaProperty.value, 'Drag area must be defined for the Vertex' );
      positionAllowed = vertex.dragAreaProperty.value!.containsPoint( proposedPosition );
    }

    return positionAllowed;
  }

  /**
   * Resets the model.
   */
  public reset(): void {

    // reset is in progress (not not in progress)
    this.resetNotInProgressProperty.value = false;

    this.vertex1.reset();
    this.vertex2.reset();
    this.vertex3.reset();
    this.vertex4.reset();
    this.angleToleranceIntervalProperty.reset();

    // Eagerly update isParallelogramProperty so that it is up to date before resetNotInProgressProperty is set back
    // to true. This is important for Sound so that isParallelogramProperty sounds do not play until after the
    // reset is complete.
    this.isParallelogramProperty.set( this.getIsParallelogram() );

    // reset is not in progress anymore
    this.resetNotInProgressProperty.value = true;
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {

    // the isParallelogramProperty needs to be set asynchronously, see the documentation for isParallelogramProperty
    this.isParallelogramProperty.set( this.getIsParallelogram() );
  }

  /**
   * Create the drag area for a vertex from the positions of the others. The vertex area
   * @private
   *
   * @param modelBounds - The bounds containing all vertices (entire model space)
   * @param vertexA - The vertex whose area we are determining
   * @param vertexB - the next vertex from vertexA, moving clockwise
   * @param vertexC - the next vertex from vertexB, moving clockwise
   * @param vertexD - the next vertex from vertexC, moving clockwise
   */
  createVertexArea( modelBounds: Bounds2, vertexA: Vertex, vertexB: Vertex, vertexC: Vertex, vertexD: Vertex ) {

    // Lines around the bounds to detect intersections - remember that for Bounds2 top and bottom
    // will be flipped relative to the model because Bounds2 matches scenery +y direction convention.
    const leftLine = new Line( modelBounds.leftTop, modelBounds.leftBottom );
    const topLine = new Line( modelBounds.leftBottom, modelBounds.rightBottom );
    const rightLine = new Line( modelBounds.rightBottom, modelBounds.rightTop );
    const bottomLine = new Line( modelBounds.rightTop, modelBounds.leftTop );

    // the lines collected here in clockwise order, segments have start/end points in clockwise order as well.
    // This way we can use them to update accordingly
    const directedLines: Line[] = [ leftLine, topLine, rightLine, bottomLine ];

    let firstRayDirection: null | Vector2 = null;
    let firstRay: null | Ray2 = null;

    let secondRayDirection: null | Vector2 = null;
    let secondRay: null | Ray2 = null;

    if ( vertexC.angleProperty!.value > Math.PI ) {

      // angle is greater than Math.PI so we have a concave shape and need to use a more constrained shape to
      // prevent crossed quadrilaterals
      firstRayDirection = vertexC.positionProperty.value.minus( vertexB.positionProperty.value ).normalized();
      firstRay = new Ray2( vertexB.positionProperty.value, firstRayDirection );

      secondRayDirection = vertexC.positionProperty.value.minus( vertexD.positionProperty.value ).normalized();
      secondRay = new Ray2( vertexD.positionProperty.value, secondRayDirection );
    }
    else {

      // with an angle less than Math.PI we can walk along rays that form a bisection between vertexB and vertexD
      firstRayDirection = vertexD.positionProperty.value.minus( vertexB.positionProperty.value ).normalized();
      firstRay = new Ray2( vertexD.positionProperty.value, firstRayDirection );

      secondRayDirection = vertexB.positionProperty.value.minus( vertexD.positionProperty.value ).normalized();
      secondRay = new Ray2( vertexB.positionProperty.value, secondRayDirection );
    }

    let firstRayIntersectionLinePair: null | LineIntersectionPair = null;
    let secondRayIntersectionLinePair: null | LineIntersectionPair = null;
    directedLines.forEach( line => {
      const firstLineIntersections = line.intersection( firstRay! );
      const secondLineIntersections = line.intersection( secondRay! );

      if ( firstLineIntersections.length > 0 ) {
        firstRayIntersectionLinePair = {
          line: line,
          intersection: firstLineIntersections[ 0 ]
        };
      }
      if ( secondLineIntersections.length > 0 ) {
        secondRayIntersectionLinePair = {
          line: line,
          intersection: secondLineIntersections[ 0 ]
        };
      }
    } );

    // An array of points that will create the final shape
    let points = [];

    if ( vertexC.angleProperty!.value > Math.PI ) {

      // angle is greater than Math.PI so we have a concave shape and need to use a more constrained shape to
      // prevent crossed quadrilaterals
      points.push( vertexC.positionProperty.value ); // start at the opposite vertex

      // The rays between vertexB and vertexC and vertexD and vertexC define the shape that will prevent twisted
      // quadrilaterals, so after starting at vertexC we just walk clockwise along the boundary points
      const intersectionAndBoundaryPoints = QuadrilateralModel.getPointsAlongBoundary( directedLines, firstRayIntersectionLinePair!, secondRayIntersectionLinePair! );
      points = points.concat( intersectionAndBoundaryPoints );
    }
    else {

      // We have a convex shape so we can allow a larger area of movement without creating a twisted shape. This shape
      // will walk between all other vertices and then close by walking clockwise around the bounds
      points.push( vertexC.positionProperty.value ); // start at the opposite vertex
      points.push( vertexD.positionProperty.value ); // walk to the next vertex

      const intersectionAndBoundaryPoints = QuadrilateralModel.getPointsAlongBoundary( directedLines, firstRayIntersectionLinePair!, secondRayIntersectionLinePair! );
      points = points.concat( intersectionAndBoundaryPoints );

      points.push( vertexB.positionProperty.value ); // walk back to vertexB
    }

    const shape = new Shape();
    shape.moveToPoint( points[ 0 ] );

    for ( let i = 1; i < points.length; i++ ) {
      shape.lineToPoint( points[ i ] );
    }

    // closing the shape after the last intersection should bring us back to vertexC
    shape.close();

    return shape;
  }


  /**
   * To create a bounding shape for a Vertex, walk along the boundary defined by directedLines until we traverse
   * between two points along the boundary. The directed lines are ordered and directed in a clockwise motion around
   * the entire model to assist in the traversal between intersection points. Graphically, what we are accomplishing
   * is this:
   *                        - firstLineIntersectionPair.intersection.point
   *   -------------------A--B
   *  |                      |
   *  |                      |
   *  |                      |
   *  |                      |
   *  |                      |
   *  ----D------------------C
   *       - secondLineIntersectionPair.intersection.point
   *
   * This function will return an array of points [A, B, C, D] to create a shape between the intersections on the lines.
   *
   * @param directedLines
   * @param firstLineIntersectionPair
   * @param secondLineIntersectionPair
   * @private
   */
  private static getPointsAlongBoundary( directedLines: Line[], firstLineIntersectionPair: LineIntersectionPair, secondLineIntersectionPair: LineIntersectionPair ): Vector2[] {
    const points = [];

    // walk to the first ray intersection with the bounds
    points.push( firstLineIntersectionPair.intersection.point );

    // a safety net to make sure that we don't get stuck in this while loop
    let iterations = 0;

    // walk along the bounds, adding corner points until we reach the same line as the secondLineIntersectionPair
    let nextLine = firstLineIntersectionPair!.line;
    while ( nextLine !== secondLineIntersectionPair!.line ) {
      points.push( nextLine.end );

      let nextIndex = directedLines.indexOf( nextLine ) + 1;
      nextIndex = nextIndex > ( directedLines.length - 1 ) ? 0 : nextIndex;

      nextLine = directedLines[ nextIndex ];
      assert && assert( nextLine );

      iterations++;
      assert && assert( iterations < 10, 'we should have closed the shape by now! Likely infinite loop' );
    }

    // we have walked to the same line as the second intersection point, finalize by including the second
    // intersection point
    points.push( secondLineIntersectionPair!.intersection.point );

    return points;
  }

  /**
   * Update the drag areas for all vertices.
   * @private
   */
  setVertexDragAreas() {
    this.vertex1.dragAreaProperty.set( this.createVertexArea( this.modelBoundsProperty.value!, this.vertex1, this.vertex2, this.vertex3, this.vertex4 ) );
    this.vertex2.dragAreaProperty.set( this.createVertexArea( this.modelBoundsProperty.value!, this.vertex2, this.vertex3, this.vertex4, this.vertex1 ) );
    this.vertex3.dragAreaProperty.set( this.createVertexArea( this.modelBoundsProperty.value!, this.vertex3, this.vertex4, this.vertex1, this.vertex2 ) );
    this.vertex4.dragAreaProperty.set( this.createVertexArea( this.modelBoundsProperty.value!, this.vertex4, this.vertex1, this.vertex2, this.vertex3 ) );
  }
}

quadrilateral.register( 'QuadrilateralModel', QuadrilateralModel );
export default QuadrilateralModel;
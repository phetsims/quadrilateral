// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Line, SegmentIntersection } from '../../../../kite/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';
import Side from './Side.js';
import Vertex from './Vertex.js';

type LineWithIntersection = {
  line: Line;
  intersection: SegmentIntersection;
};

class CollisionDetector {
  private readonly shapeModel: QuadrilateralShapeModel;

  public constructor( shapeModel: QuadrilateralShapeModel ) {
    this.shapeModel = shapeModel;
  }

  public checkProposedTranslation( translation: Vector2, movingObjects: ( Vertex | Side )[] ): Vector2 {

    let smallestAllowedTranslation = translation;

    if ( translation.magnitude > 0 ) {

      const leadingEdges = this.getLeadingEdges( translation, movingObjects );
      const constrainingEdges = this.getConstrainingEdges( movingObjects );

      constrainingEdges.forEach( constrainingEdge => {
        const constrainedTranslation = this.checkMotionAgainstConstraints( translation, leadingEdges, constrainingEdge );

        if ( !constrainedTranslation.equals( smallestAllowedTranslation ) ) {
          if ( constrainedTranslation.magnitude < smallestAllowedTranslation.magnitude ) {
            smallestAllowedTranslation = constrainedTranslation;
          }
        }
      } );
    }

    return smallestAllowedTranslation;
  }

  // For each leading edge, create a new line that goes from the start/end points of the leading edge to a new
  // point in the direction of the translation vector, with the magnitude of the translation vector. If those
  // lines intersect the constraining edge, there is a collision with the constraining edge. The translation
  // vector gets reduced to a magnitude of a line that is closest to the constraining edge.
  public checkMotionAgainstConstraints( translation: Vector2, leadingEdges: Line[], constrainingEdge: Line ): Vector2 {

    // create liens from the leading edges to the end point of the translation vector (with the same magnitude)
    const inspectionLines: Line[] = [];
    leadingEdges.forEach( leadingEdge => {
      inspectionLines.push( new Line( leadingEdge.start, leadingEdge.start.plus( translation ) ) );
      inspectionLines.push( new Line( leadingEdge.end, leadingEdge.end.plus( translation ) ) );
    } );

    // find intersections between inspection lines and the constraining edge
    const linesWithIntersections: LineWithIntersection[] = [];
    inspectionLines.forEach( inspectionLine => {
      const sectionLineIntersections = Line.intersectOther( inspectionLine, constrainingEdge );
      if ( sectionLineIntersections.length > 0 ) {

        // TODO: Would there ever be more than one?
        const firstIntersection = sectionLineIntersections[ 0 ];
        linesWithIntersections.push( { line: inspectionLine, intersection: firstIntersection } );
      }
    } );

    // the lowest parametric position of the intersection point is the smallest translation available
    const smallestLineWithIntersection = _.minBy(
      linesWithIntersections, lineWithIntersection => lineWithIntersection.intersection.aT
    );

    if ( smallestLineWithIntersection ) {

      // we have an intersection! Now we need to find the translation along the provided lines that produce
      // the best possible translation. That will be the sum of the vectors from the edge line to the intersection point
      // plus the projection of the remaining translation vector along the intersection line.
      const translationToEdge = smallestLineWithIntersection.intersection.point.minus( smallestLineWithIntersection.line.start );
      const translationRemaining = smallestLineWithIntersection.line.end.minus( smallestLineWithIntersection.intersection.point );

      // dot product to find projection - |a| * |b| * cos( theta )
      const constraintLineVector = constrainingEdge.start.minus( smallestLineWithIntersection.intersection.point );
      const angleBetween = translationRemaining.angleBetween( constraintLineVector );
      const projectionMagnitude = translationRemaining.magnitude * constraintLineVector.magnitude * Math.cos( angleBetween );
      const projectionVector = constraintLineVector.withMagnitude( projectionMagnitude );

      const finalTranslationVector = translationToEdge.plus( projectionVector ).plus( translationToEdge.negated().withMagnitude( 0.02 ) );

      if ( assert ) {
        // debugger;
        const resultantTranslationLine = new Line( smallestLineWithIntersection.line.start, smallestLineWithIntersection.line.start.plus( finalTranslationVector ) );

        // TODO: Maybe we have to handle this case!! IF the resultant arc length is 0 then the object is already
        // exactly on the edge and so it will not be a collision the next time we check. In this case
        // I am seeing a finalTranslationVector like Vector{x: 1.0408340855860843e-17, y: 1.2246467991473524e-19}
        // It is also happening because of the withMagnitude( 0.02 ) correction.
        if ( resultantTranslationLine.getArcLength() > 0 ) {
          const resultantTranslationIntersection = Line.intersectOther( resultantTranslationLine, constrainingEdge );
          assert( resultantTranslationIntersection.length === 0, 'The resultant translation still crosses over the constraint line' );
        }
      }

      window.freeze = true;
      return finalTranslationVector;
    }
    else {
      if ( window.freeze ) {
        // debugger
      }
      // no intersection detected
      return translation;
    }
  }

  /**
   * Get the 'leading' edges for all moving objects. These are teh edges that might
   * collide with another.
   */
  public getLeadingEdges( translation: Vector2, movingObjects: ( Vertex | Side )[] ): Line[] {
    const leadingEdges: Line[] = [];

    movingObjects.forEach( movingObject => {
      leadingEdges.push( ...movingObject.getLeadingEdges( translation ) );

      if ( movingObject instanceof Side ) {

        // a moving side can also find collisions at the vertices it is attached to
        leadingEdges.push( ...movingObject.vertex1.getLeadingEdges( translation ) );
        leadingEdges.push( ...movingObject.vertex2.getLeadingEdges( translation ) );
      }
    } );

    return leadingEdges;
  }

  public getConstrainingEdges( movingObjects: ( Vertex | Side )[] ): Line[] {

    const constrainingEdges: Line[] = [];
    for ( let i = 0; i < movingObjects.length; i++ ) {
      const movingObject = movingObjects[ i ];

      if ( movingObject instanceof Vertex ) {

        // a Vertex can potentially be constrained by every other Vertex
        this.shapeModel.vertices.forEach( vertex => {
          if ( vertex !== movingObject ) {
            constrainingEdges.push( ...vertex.getConstrainingEdges() );
          }
        } );

        // a Vertex can also potentially be constrained by the sides which are not
        // connected to it
        this.shapeModel.sides.forEach( side => {
          if ( side.vertex1 !== movingObject && side.vertex2 !== movingObject ) {
            constrainingEdges.push( ...side.getConstrainingEdges() );
          }
        } );
      }
      else if ( movingObject instanceof Side ) {

        // A moving side can be constrained only by its opposite side
        const oppositeSide = this.shapeModel.oppositeSideMap.get( movingObject )!;
        assert && assert( oppositeSide, 'no opposite side found for moving side' );
        constrainingEdges.push( ...oppositeSide.getConstrainingEdges() );

        // a moving side can also be constrained by the vertices on that opposite side
        constrainingEdges.push( ...oppositeSide.vertex1.getConstrainingEdges() );
        constrainingEdges.push( ...oppositeSide.vertex2.getConstrainingEdges() );
      }
    }

    return constrainingEdges;
  }
}

quadrilateral.register( 'CollisionDetector', CollisionDetector );
export default CollisionDetector;

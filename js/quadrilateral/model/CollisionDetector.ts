// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Ray2 from '../../../../dot/js/Ray2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line, RayIntersection, Segment, SegmentIntersection } from '../../../../kite/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';
import Side from './Side.js';
import Vertex from './Vertex.js';

type LineWithIntersection = {
  line: Line;
  intersection: SegmentIntersection;
};

type TranslationAndOffsetVectors = {
  translation: Vector2;
  offset: Vector2;
};

class CollisionDetector {
  private readonly shapeModel: QuadrilateralShapeModel;
  private readonly boundaryEdges: Line[];

  public constructor( shapeModel: QuadrilateralShapeModel, modelBoundsProperty: TReadOnlyProperty<Bounds2 | null> ) {
    this.shapeModel = shapeModel;

    this.boundaryEdges = [];
    const modelBoundsListener = ( modelBounds: Bounds2 | null ) => {
      if ( modelBounds ) {
        this.boundaryEdges.push( new Line( modelBounds.leftTop, modelBounds.rightTop ) );
        this.boundaryEdges.push( new Line( modelBounds.rightTop, modelBounds.rightBottom ) );
        this.boundaryEdges.push( new Line( modelBounds.rightBottom, modelBounds.leftBottom ) );
        this.boundaryEdges.push( new Line( modelBounds.leftBottom, modelBounds.leftTop ) );

        modelBoundsProperty.unlink( modelBoundsListener );
      }
    };
    modelBoundsProperty.link( modelBoundsListener );
  }

  public checkProposedTranslation( translation: Vector2, movingObjects: ( Vertex | Side )[] ): Vector2 {

    let smallestAllowedTranslation = translation;
    let smallestAllowedTranslationWithOffset: TranslationAndOffsetVectors = {
      translation: translation,
      offset: new Vector2( 0, 0 )
    };

    if ( translation.magnitude > 0 ) {

      const leadingEdges = this.getLeadingEdges( translation, movingObjects );
      const constrainingEdges = this.getConstrainingEdges( movingObjects );

      constrainingEdges.forEach( constrainingEdge => {
        const constrainedTranslationWithOffset = this.checkMotionAgainstConstraints( translation, leadingEdges, constrainingEdge );
        const constrainedTranslation = constrainedTranslationWithOffset.translation;

        if ( !constrainedTranslation.equals( smallestAllowedTranslation ) ) {
          if ( constrainedTranslation.magnitude < smallestAllowedTranslation.magnitude ||
               !constrainedTranslationWithOffset.offset.equals( Vector2.ZERO ) && smallestAllowedTranslationWithOffset.offset.equals( Vector2.ZERO ) ) {
            smallestAllowedTranslation = constrainedTranslation;
            smallestAllowedTranslationWithOffset = constrainedTranslationWithOffset;
          }
        }
      } );
    }

    // now that we have the smallest possible translation, return that corrected by the offset vector to push
    // the objects away by an appropriate amount
    return smallestAllowedTranslationWithOffset.translation.plus( smallestAllowedTranslationWithOffset.offset );
  }

  // For each leading edge, create a new line that goes from the start/end points of the leading edge to a new
  // point in the direction of the translation vector, with the magnitude of the translation vector. If those
  // lines intersect the constraining edge, there is a collision with the constraining edge. The translation
  // vector gets reduced to a magnitude of a line that is closest to the constraining edge.
  public checkMotionAgainstConstraints( translation: Vector2, leadingEdges: Line[], constrainingEdge: Line ): TranslationAndOffsetVectors {

    // create liens from the leading edges to the end point of the translation vector (with the same magnitude)
    const inspectionLines: Line[] = [];
    leadingEdges.forEach( leadingEdge => {
      inspectionLines.push( new Line( leadingEdge.start, leadingEdge.start.plus( translation ) ) );
      inspectionLines.push( new Line( leadingEdge.end, leadingEdge.end.plus( translation ) ) );
    } );

    // find intersections between inspection lines and the constraining edge
    const linesWithIntersections: LineWithIntersection[] = [];
    inspectionLines.forEach( inspectionLine => {
      const sectionLineIntersections = CollisionDetector.customLineSegmentIntersect( inspectionLine, constrainingEdge );
      if ( sectionLineIntersections.length > 0 ) {

        // TODO: Would there ever be more than one?
        const firstIntersection = sectionLineIntersections[ 0 ];
        linesWithIntersections.push( { line: inspectionLine, intersection: firstIntersection } );
      }
    } );

    // the lowest parametric position of the intersection point is the smallest translation available
    const smallestLineWithIntersection = _.minBy(
      // at - the parametric position where the collision is along the inspection line
      // bt - the parametric position where the collision is along the constraining edge
      linesWithIntersections, lineWithIntersection => lineWithIntersection.intersection.aT
    );

    let finalTranslationVector;
    let offsetVector = new Vector2( 0, 0 );
    if ( smallestLineWithIntersection ) {

      // we have an intersection! Now we need to find the translation along the provided lines that produce
      // the best possible translation. That will be the sum of the vectors from the edge line to the intersection point
      // plus the projection of the remaining translation vector along the intersection line.

      // from the intersection point to the start of the inspection line
      const translationToEdge = smallestLineWithIntersection.intersection.point.minus( smallestLineWithIntersection.line.start );

      // from the end of the inspection line to the intersectoin point
      const translationRemaining = smallestLineWithIntersection.line.end.minus( smallestLineWithIntersection.intersection.point );

      const translationVector = smallestLineWithIntersection.line.end.minus( smallestLineWithIntersection.line.start );
      const separatingVector = translationVector.negated().withMagnitude( 0.1 );
      offsetVector = separatingVector;

      const translationRemainingMagnitude = translationRemaining.magnitude;
      if ( translationRemainingMagnitude > 0 ) {

        // dot product to find projection - |a| * |b| * cos( theta )
        const constraintLineVector = constrainingEdge.start.minus( smallestLineWithIntersection.intersection.point );
        const angleBetween = translationRemaining.angleBetween( constraintLineVector );
        const projectionMagnitude = translationRemainingMagnitude * constraintLineVector.magnitude * Math.cos( angleBetween );
        const projectionVector = constraintLineVector.withMagnitude( projectionMagnitude );

        finalTranslationVector = translationToEdge.plus( projectionVector );

        if ( assert ) {
          const resultantTranslationLine = new Line( smallestLineWithIntersection.line.start, smallestLineWithIntersection.line.start.plus( finalTranslationVector ) );

          // TODO: Maybe we have to handle this case!! IF the resultant arc length is 0 then the object is already
          // exactly on the edge and so it will not be a collision the next time we check. In this case
          // I am seeing a finalTranslationVector like Vector{x: 1.0408340855860843e-17, y: 1.2246467991473524e-19}
          // It is also happening because of the withMagnitude( 0.02 ) correction.
          if ( resultantTranslationLine.getArcLength() > 0 ) {

            // For the purposes of this assertion an intersection exactly at the start of the resultantTranslationLine
            // should not be considered overlap
            const resultantTranslationIntersection = Line.intersectOther( resultantTranslationLine, constrainingEdge );
            if ( resultantTranslationIntersection.length > 0 ) {
              const testThing = CollisionDetector.customLineSegmentIntersect( resultantTranslationLine, constrainingEdge );
            }
            assert( resultantTranslationIntersection.length === 0, 'The resultant translation still crosses over the constraint line' );
          }
        }
      }
      else {
        console.log( 'hmmm', offsetVector );

        // We have a collision, but it is exactly on the constraining edge, so we cannot translate any further -
        // translationRemaining is a zero magniutude vector and so angleBetween will be undefined
        finalTranslationVector = translationRemaining;
      }
    }
    else {

      // no intersection detected
      finalTranslationVector = translation;
    }

    return {
      translation: finalTranslationVector,
      offset: offsetVector
    };
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

    // all objects are constrained by the boundary edges
    constrainingEdges.push( ...this.boundaryEdges );

    return constrainingEdges;
  }

  /**
   * Returns any intersections between a line segment and another type of segment.
   *
   * This should be more optimized than the general intersection routine of arbitrary segments.
   *
   * NOTE: other.intersection( ray ) returns NO intersections if the ray starts exactly on the segment. That can
   * often happen when our object rests exactly on the line. One way around this is to make sure that the first
   * argument is the constrainingEdge and the second argument is the inspection line.
   */
  public static customLineSegmentIntersect( line: Lineg1, other: Segment ): SegmentIntersection[] {

    // Set up a ray
    const delta = line.end.minus( line.start );
    const length = delta.magnitude;
    const ray = new Ray2( line.start, delta.normalize() );

    // Find the other segment's intersections with the ray
    // const rayIntersections = other.intersection( ray );
    const rayIntersections = CollisionDetector.segmentRayIntersection( other, ray );

    const results = [];
    for ( let i = 0; i < rayIntersections.length; i++ ) {
      const rayIntersection = rayIntersections[ i ];
      const lineT = rayIntersection.distance / length;

      // Exclude intersections that are outside our line segment - but allow intersections right on the boundary!
      if ( lineT >= 0 && lineT <= 1 ) {
        results.push( new SegmentIntersection( rayIntersection.point, lineT, rayIntersection.t ) );
      }
    }
    return results;
  }

  public static segmentRayIntersection( segment: Segment, ray: Ray2 ): RayIntersection[] {

    // We solve for the parametric line-line intersection, and then ensure the parameters are within both
    // the line segment and forwards from the ray.

    const result: RayIntersection[] = [];

    const start = segment.start;
    const end = segment.end;

    const diff = end.minus( start );

    if ( diff.magnitudeSquared === 0 ) {
      return result;
    }

    const denom = ray.direction.y * diff.x - ray.direction.x * diff.y;

    // If denominator is 0, the lines are parallel or coincident
    if ( denom === 0 ) {
      return result;
    }

    // linear parameter where start (0) to end (1)
    const t = ( ray.direction.x * ( start.y - ray.position.y ) - ray.direction.y * ( start.x - ray.position.x ) ) / denom;

    // check that the intersection point is between the line segment's endpoints
    if ( t < 0 || t >= 1 ) {
      return result;
    }

    // linear parameter where ray.position (0) to ray.position+ray.direction (1)
    const s = ( diff.x * ( start.y - ray.position.y ) - diff.y * ( start.x - ray.position.x ) ) / denom;

    // bail if it is behind our ray
    // NOTE: This is what is different from Kite's implementation. We need to look for collisions along our line where
    // s === 0
    if ( s < 0 ) {
      return result;
    }
    if ( s === 0 ) {
      // debugger;
    }

    // return the proper winding direction depending on what way our line intersection is "pointed"
    const perp = diff.perpendicular;

    const intersectionPoint = start.plus( diff.times( t ) );
    const normal = ( perp.dot( ray.direction ) > 0 ? perp.negated() : perp ).normalized();
    const wind = ray.direction.perpendicular.dot( diff ) < 0 ? 1 : -1;
    result.push( new RayIntersection( s, intersectionPoint, normal, wind, t ) );
    return result;
  }
}

quadrilateral.register( 'CollisionDetector', CollisionDetector );
export default CollisionDetector;

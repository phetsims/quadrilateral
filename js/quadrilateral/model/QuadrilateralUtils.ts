// Copyright 2022-2023, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Ray2 from '../../../../dot/js/Ray2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line, Shape } from '../../../../kite/js/imports.js';
import quadrilateral from '../../quadrilateral.js';

// A useful type for calculations for the vertex Shapes which define where the Vertex can move depending on
// the positions of the other vertices. Lines are along the bounds of model space and RayIntersections
// are the intersections between rays formed by adjacent vertices and the Line. See createVertexAreas for
// more information.
export type LineIntersectionPair = {
  line: Line;
  intersectionPoint: Vector2;
};

const QuadrilateralUtils = {

  /**
   * A workaround for https://github.com/phetsims/kite/issues/94. Shape.containsPoint implementation does not work
   * if both the provided point and one of the shape segment vertices lie along the test ray used in the
   * winding intersection algorithm. This function looks for a different ray to use in the test if that is the case.
   *
   * This solution has been proposed in https://github.com/phetsims/kite/issues/94. If it is absorbed or fixed a
   * different way in kite, this function could be removed and replaced with shape.containsPoint.
   */
  customShapeContainsPoint( shape: Shape, point: Vector2 ): boolean {
    const rayDirectionVector = new Vector2( 1, 0 ); // unit x Vector, but we may mutate it
    let ray = new Ray2( point, rayDirectionVector );

    // Put a limit on attempts so we don't try forever
    let count = 0;
    while ( count < 5 ) {
      count++;

      // Look for cases where the proposed ray will intersect with one of the vertices of a shape segment - in this case
      // the intersection in windingIntersection is not well-defined and won't be counted so we need to use a ray with
      // a different direction
      const rayIntersectsSegmentVertex = _.some( shape.subpaths, subpath => {
        return _.some( subpath.segments, segment => {
          return segment.start.minus( point ).normalize().equals( rayDirectionVector );
        } );
      } );

      if ( rayIntersectsSegmentVertex ) {

        // the proposed ray will not work because it intersects with a segment Vertex - try another one
        rayDirectionVector.rotate( dotRandom.nextDouble() );
      }
      else {

        // Should be safe to use this Ray for windingIntersection
        ray = new Ray2( point, rayDirectionVector );
        break;
      }
    }

    return shape.windingIntersection( ray ) !== 0;
  },

  /**
   * Returns true if the provided point lies on the ray.
   */
  isPointOnRay( ray: Ray2, point: Vector2 ): boolean {
    const directionToPoint = point.minus( ray.position ).normalized();
    return ray.direction.equalsEpsilon( directionToPoint, 1e-2 );
  },

  /**
   * Returns the start or end point of a Line if the ray goes through it. Assists with intersection detection since
   * Kite functions do not have a defined intersection if a ray goes through an endpoint of a line or segment.
   */
  getLinePositionAlongRay( ray: Ray2, line: Line ): Vector2 | null {
    return QuadrilateralUtils.isPointOnRay( ray, line.start ) ? line.start :
           QuadrilateralUtils.isPointOnRay( ray, line.end ) ? line.end :
           null;
  },

  /**
   * Returns one of the corner points of the Bounds2 if the provided ray goes exactly through that point. Works
   * around a limitation of Shape.intersects( Ray2 ) where if the ray intersects with a start/end point of a shape
   * segment, the intersection is not defined.
   */
  getBoundsCornerPositionAlongRay( ray: Ray2, bounds: Bounds2 ): Vector2 | null {
    return QuadrilateralUtils.isPointOnRay( ray, bounds.leftTop ) ? bounds.leftTop :
           QuadrilateralUtils.isPointOnRay( ray, bounds.rightTop ) ? bounds.rightTop :
           QuadrilateralUtils.isPointOnRay( ray, bounds.rightBottom ) ? bounds.rightBottom :
           QuadrilateralUtils.isPointOnRay( ray, bounds.leftBottom ) ? bounds.leftBottom :
           null;
  },

  /**
   * To create a bounding shape for a Vertex, walk along the boundary defined by directedLines until we traverse
   * between two points along the boundary. The directed lines are ordered and directed in a clockwise motion around
   * the entire model to assist in the traversal between intersection points. Graphically, what we are accomplishing
   * is this:
   *                        - firstLineIntersectionPair.intersection.point (A)
   *   -------------------A--B
   *  |                      |
   *  |                      |
   *  |                      |
   *  |                      |
   *  |                      |
   *  ----D------------------C
   *       - secondLineIntersectionPair.intersection.point (D)
   *
   * This function will return an array of points [A, B, C, D] to create a shape between the intersections on the lines.
   */
  getPointsAlongBoundary( directedLines: Line[], firstLineIntersectionPair: LineIntersectionPair, secondLineIntersectionPair: LineIntersectionPair ): Vector2[] {
    const points = [];

    // walk to the first ray intersection with the bounds
    points.push( firstLineIntersectionPair.intersectionPoint );

    // a safety net to make sure that we don't get stuck in this while loop
    let iterations = 0;

    // walk along the bounds, adding corner points until we reach the same line as the secondLineIntersectionPair
    let nextLine = firstLineIntersectionPair.line;
    while ( nextLine !== secondLineIntersectionPair.line ) {
      points.push( nextLine.end );

      let nextIndex = directedLines.indexOf( nextLine ) + 1;
      nextIndex = nextIndex > ( directedLines.length - 1 ) ? 0 : nextIndex;

      nextLine = directedLines[ nextIndex ];
      assert && assert( nextLine, 'No more lines in the traversal' );

      iterations++;
      assert && assert( iterations < 10, 'we should have closed the shape by now! Likely infinite loop' );
    }

    // we have walked to the same line as the second intersection point, finalize by including the second
    // intersection point
    points.push( secondLineIntersectionPair.intersectionPoint );

    return points;
  }
};

quadrilateral.register( 'QuadrilateralUtils', QuadrilateralUtils );
export default QuadrilateralUtils;

// Copyright 2022, University of Colorado Boulder

/**
 * Draws a diagonal line across the opposite pairs of vertex corners. Line extends across the model bounds.
 * Visibility is controlled by a checkbox in the control panel.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import { Line, Node } from '../../../../scenery/js/imports.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Ray2 from '../../../../dot/js/Ray2.js';
import { Shape } from '../../../../kite/js/imports.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import Vector2 from '../../../../dot/js/Vector2.js';

const LINE_NODE_OPTIONS = {
  lineWidth: 2,
  lineDash: [ 10, 2 ],
  stroke: QuadrilateralColors.diagonalGuidesStrokeColorProperty
};

class QuadrilateralDiagonalGuidesNode extends Node {
  public constructor(
    quadrilateralShapeModel: QuadrilateralShapeModel,
    boundsProperty: TReadOnlyProperty<Bounds2 | null>,
    visibleProperty: TReadOnlyProperty<boolean>,
    modelViewTransform: ModelViewTransform2
  ) {
    super();

    const lineNode1 = new Line( LINE_NODE_OPTIONS );
    this.addChild( lineNode1 );

    const lineNode2 = new Line( LINE_NODE_OPTIONS );
    this.addChild( lineNode2 );

    // Link visibility of the component to the Property controlled by the checkbox
    visibleProperty.link( visible => { this.visible = visible; } );

    Multilink.multilink(
      [ quadrilateralShapeModel.vertexA.positionProperty, quadrilateralShapeModel.vertexC.positionProperty, boundsProperty ],
      ( vertexAPosition, vertexCPosition, bounds ) => {
        assert && assert( vertexAPosition && vertexCPosition && bounds, 'positions need to be defined for diagonal guides' );
        QuadrilateralDiagonalGuidesNode.drawDiagonal( vertexAPosition, vertexCPosition, bounds!, modelViewTransform, lineNode1 );
      }
    );

    Multilink.multilink(
      [ quadrilateralShapeModel.vertexB.positionProperty, quadrilateralShapeModel.vertexD.positionProperty, boundsProperty ],
      ( vertexBPosition, vertexDPosition, bounds ) => {
        assert && assert( vertexBPosition && vertexDPosition && bounds, 'positions need to be defined for diagonal guides' );
        QuadrilateralDiagonalGuidesNode.drawDiagonal( vertexBPosition, vertexDPosition, bounds!, modelViewTransform, lineNode2 );
      }
    );
  }

  /**
   * Draws a line between the provided vertex positions. The line spans across the positions until it intersects
   * with model bounds. This could have been done with a clip area but that seemed excessive.
   */
  private static drawDiagonal( vertex1Position: Vector2, vertex2Position: Vector2, bounds: Bounds2, modelViewTransform: ModelViewTransform2, lineNode: Line ): void {

    const boundsShape = Shape.bounds( bounds );
    const p1 = QuadrilateralDiagonalGuidesNode.getBestIntersectionPoint( vertex1Position, vertex2Position, bounds, boundsShape );
    const p2 = QuadrilateralDiagonalGuidesNode.getBestIntersectionPoint( vertex2Position, vertex1Position, bounds, boundsShape );

    const p1View = modelViewTransform.modelToViewPosition( p1 );
    const p2View = modelViewTransform.modelToViewPosition( p2 );

    lineNode.setPoint1( p1View );
    lineNode.setPoint2( p2View );
  }

  /**
   * Creates a ray from vertex1Position to vertex2Position and returns the intersection point of that ray and the
   * provided bounds. This will be one of the end points for the Line created by this Node. This functions works around
   * a Kite limitation that an intersection is undefined if the Ray intersects exactly with a start/end point of a
   * shape segment.
   */
  private static getBestIntersectionPoint( vertex1Position: Vector2, vertex2Position: Vector2, bounds: Bounds2, boundsShape: Shape ): Vector2 {
    const rayDirection = vertex2Position.minus( vertex1Position ).normalized();
    const ray = new Ray2( vertex1Position, rayDirection );

    const intersections = boundsShape.intersection( ray );
    assert && assert( intersections.length < 2, 'There should be at most one intersection along bounds' );

    let point: Vector2;
    if ( intersections.length === 1 ) {
      point = intersections[ 0 ].point;
    }
    else {
      point = QuadrilateralDiagonalGuidesNode.getBoundsCornerPositionAlongRay( ray, bounds )!;
    }

    assert && assert( point, 'Could not find an intersection point for the ray within the bounds.' );
    return point;
  }

  /**
   * Returns one of the corner points of the Bounds2 if the provided ray goes exactly through that point. Works
   * around a limitation of Shape.intersects( Ray2 ) where if the ray intersects with a start/end point of a shape
   * segment, the intersection is not defined.
   */
  private static getBoundsCornerPositionAlongRay( ray: Ray2, bounds: Bounds2 ): Vector2 | null {
    return QuadrilateralDiagonalGuidesNode.isPointOnRay( ray, bounds.leftTop ) ? bounds.leftTop :
           QuadrilateralDiagonalGuidesNode.isPointOnRay( ray, bounds.rightTop ) ? bounds.rightTop :
           QuadrilateralDiagonalGuidesNode.isPointOnRay( ray, bounds.rightBottom ) ? bounds.rightBottom :
           QuadrilateralDiagonalGuidesNode.isPointOnRay( ray, bounds.leftBottom ) ? bounds.leftBottom :
           null;
  }

  /**
   * Returns true if the provided point lies on the ray.
   */
  private static isPointOnRay( ray: Ray2, point: Vector2 ): boolean {
    const directionToPoint = point.minus( ray.position ).normalized();
    return ray.direction.equalsEpsilon( directionToPoint, 1e-2 );
  }
}

quadrilateral.register( 'QuadrilateralDiagonalGuidesNode', QuadrilateralDiagonalGuidesNode );
export default QuadrilateralDiagonalGuidesNode;

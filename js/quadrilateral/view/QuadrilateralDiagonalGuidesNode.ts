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
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Ray2 from '../../../../dot/js/Ray2.js';
import { Shape } from '../../../../kite/js/imports.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import Vector2 from '../../../../dot/js/Vector2.js';

const LINE_NODE_OPTIONS = {
  lineWidth: 2,
  lineDash: [ 10, 5 ],
  stroke: QuadrilateralColors.diagonalGuidesStrokeColorProperty
};

class QuadrilateralDiagonalGuidesNode extends Node {
  public constructor(
    quadrilateralShapeModel: QuadrilateralShapeModel,
    boundsProperty: IReadOnlyProperty<Bounds2 | null>,
    visibleProperty: IReadOnlyProperty<boolean>,
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
        QuadrilateralDiagonalGuidesNode.drawDiagonal( vertexAPosition!, vertexCPosition!, bounds!, modelViewTransform, lineNode1 );
      }
    );

    Multilink.multilink(
      [ quadrilateralShapeModel.vertexB.positionProperty, quadrilateralShapeModel.vertexD.positionProperty, boundsProperty ],
      ( vertexBPosition, vertexDPosition, bounds ) => {
        assert && assert( vertexBPosition && vertexDPosition && bounds, 'positions need to be defined for diagonal guides' );
        QuadrilateralDiagonalGuidesNode.drawDiagonal( vertexBPosition!, vertexDPosition!, bounds!, modelViewTransform, lineNode2 );
      }
    );
  }

  /**
   * Draws a line between the provided vertex positions. The line spans across the vertex positions until the
   * intersection points with simulation bounds.
   */
  private static drawDiagonal( vertex1Position: Vector2, vertex2Position: Vector2, bounds: Bounds2, modelViewTransform: ModelViewTransform2, lineNode: Line ): void {

    // convert Bounds2 to a Shape so that we can find ray/bounds intersections
    const boundsShape = Shape.bounds( bounds! );

    const vertex1RayDirection = vertex2Position.minus( vertex1Position ).normalized();
    const vertex1Ray = new Ray2( vertex1Position, vertex1RayDirection );

    const vertex2RayDirection = vertex1Position.minus( vertex2Position ).normalized();
    const vertex2Ray = new Ray2( vertex2Position, vertex2RayDirection );

    const vertex1RayIntersections = boundsShape.intersection( vertex1Ray );
    const vertex2RayIntersections = boundsShape.intersection( vertex2Ray );

    assert && assert( vertex1RayIntersections.length === 1 && vertex2RayIntersections.length === 1,
      'There should be one and only one intersection for each ray from vertices within bounds' );

    // Intersection points along bounds so the line extends across the whole simulation bounds.
    const p1 = vertex1RayIntersections[ 0 ].point;
    const p2 = vertex2RayIntersections[ 0 ].point;

    const p1View = modelViewTransform.modelToViewPosition( p1 );
    const p2View = modelViewTransform.modelToViewPosition( p2 );

    lineNode.setPoint1( p1View );
    lineNode.setPoint2( p2View );
  }
}

quadrilateral.register( 'QuadrilateralDiagonalGuidesNode', QuadrilateralDiagonalGuidesNode );
export default QuadrilateralDiagonalGuidesNode;

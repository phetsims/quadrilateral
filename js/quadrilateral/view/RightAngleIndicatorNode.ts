// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Path } from '../../../../scenery/js/imports.js';
import Vertex from '../model/Vertex.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import { Line } from '../../../../kite/js/imports.js';
import Side from '../model/Side.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import Utils from '../../../../dot/js/Utils.js';
import quadrilateral from '../../quadrilateral.js';

// in model coordinates, length of a side of the indicator from the edge of a line between two vertices
const SIDE_LENGTH = 0.12;

class RightAngleIndicatorNode extends Path {

  private readonly shapeModel: QuadrilateralShapeModel;
  private readonly modelViewTransform: ModelViewTransform2;

  /**
   * @param vertex1 - The Vertex being represented, indicator will be visible when angle at this vertex is 90 degrees
   * @param vertex2 - Vertex with a side connected to vertexA in the clockwise direction
   * @param vertex3 - Vertex with a side connected to vertexB in the counterclockwise direction
   * @param shapeModel
   * @param modelViewTransform
   */
  public constructor( vertex1: Vertex, vertex2: Vertex, vertex3: Vertex, shapeModel: QuadrilateralShapeModel, modelViewTransform: ModelViewTransform2 ) {
    super( null, {
      stroke: QuadrilateralColors.rightAngleIndicatorStrokeColorProperty,
      lineWidth: 2
    } );

    this.shapeModel = shapeModel;
    this.modelViewTransform = modelViewTransform;

    // The indicators are only visible when all angles are 90 degrees (square or rectangle), but we need to draw
    // the shape every time the shape changes because we may be a square or rectangle within tolerances (angles
    // can adjust slightly). Linked to the shape name (instead of checking equality with 90 degrees) so that the
    // indicator visibility matches how we name shapes.
    const redrawShapeListener = () => {
      this.redrawShape( vertex1, vertex2, vertex3 );
    };
    shapeModel.shapeNameProperty.link( redrawShapeListener );
    shapeModel.shapeChangedEmitter.addListener( redrawShapeListener );
  }

  private redrawShape( vertex1: Vertex, vertex2: Vertex, vertex3: Vertex ): void {

    assert && assert( vertex1.angleProperty.value, 'Angle must be available to draw the indicator' );
    const angle = vertex1.angleProperty.value!;

    // It is possible that the angles are wildly different then Math.PI because of the dependency Properties. The
    // indicator is redrawn every angle change, and that may happen before the shape name is updated. So we could
    // run into cases where the angle is much less or greater than Math.PI / 2 and the drawing code breaks. At this
    // time I couldn't think of another way to only draw this when the shape has all angles right, but also
    // redraw this in those conditions whenever the angle changes. Using this value makes sure that the angle is
    // close enough to right for assumptions in the drawing code to be legitimate.
    const angleReasonable = Utils.equalsEpsilon( angle, Math.PI / 2, Math.PI / 4 );

    const shapeName = this.shapeModel.getShapeName();
    this.visible = ( shapeName === NamedQuadrilateral.SQUARE || shapeName === NamedQuadrilateral.RECTANGLE ) && angleReasonable;

    // if we have become visible, we need to redraw the shape
    if ( this.visible ) {

      // The line from vertexA to vertexB (clockwise connected side)
      const firstLine = new Line( vertex1.positionProperty.value, vertex2.positionProperty.value );

      // the line from vertexA to vertexC (counterclockwise connected side)
      const secondLine = new Line( vertex1.positionProperty.value, vertex3.positionProperty.value );

      // stroke right starts at the end point, we need to reverse it
      const firstInnerLine = firstLine.strokeRight( Side.SIDE_WIDTH )[ 0 ].reversed();
      const secondInnerLine = secondLine.strokeLeft( Side.SIDE_WIDTH )[ 0 ];

      // the intersection point of those lines is where we start drawing our indicator
      const cornerIntersectionSegments = Line.intersectOther( firstInnerLine, secondInnerLine );
      assert && assert( cornerIntersectionSegments.length === 1, 'Must be one and only one intersection between lines' );
      const intersectionPoint = cornerIntersectionSegments[ 0 ].point;

      const closestPointToIntersection = firstLine.explicitClosestToPoint( intersectionPoint )[ 0 ].closestPoint;

      const correctedLength = SIDE_LENGTH + intersectionPoint.distance( closestPointToIntersection );

      const t1 = Math.min( correctedLength / firstInnerLine.getArcLength(), 1 );
      const pointAlongFirstInnerLine = firstInnerLine.positionAt( t1 );

      const t2 = Math.min( correctedLength / secondLine.getArcLength(), 1 );
      const pointAlongSecondInnerLine = secondInnerLine.positionAt( t2 );

      const innerPoint = pointAlongSecondInnerLine.plus( pointAlongFirstInnerLine.minus( intersectionPoint ) );

      // We now have all points for our "square" shape
      const shape = new Shape();
      shape.moveToPoint( intersectionPoint );
      shape.lineToPoint( pointAlongFirstInnerLine );
      shape.lineToPoint( innerPoint );
      shape.lineToPoint( pointAlongSecondInnerLine );
      shape.close();

      this.shape = this.modelViewTransform.modelToViewShape( shape );
    }
  }
}

quadrilateral.register( 'RightAngleIndicatorNode', RightAngleIndicatorNode );

export default RightAngleIndicatorNode;

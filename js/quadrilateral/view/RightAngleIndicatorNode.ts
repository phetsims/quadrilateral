// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import { Path } from '../../../../scenery/js/imports.js';
import Vertex from '../model/Vertex.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import Line from '../../../../kite/js/segments/Line.js';
import Side from '../model/Side.js';
import Shape from '../../../../kite/js/Shape.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';

// in model coordinates, length of a side of the indicator from the edge of a line between two vertices
const SIDE_LENGTH = 0.05;

class RightAngleIndicatorNode extends Path {

  /**
   * @param vertex1 - The Vertex being represented, indicator will be visible when angle at this vertex is 90 degrees
   * @param vertex2 - Vertex with a side connected to vertex1 in the clockwise direction
   * @param vertex3 - Vertex with a side connected to vertex2 in the counterclockwise direction
   * @param shapeModel
   * @param modelViewTransform
   */
  constructor( vertex1: Vertex, vertex2: Vertex, vertex3: Vertex, shapeModel: QuadrilateralShapeModel, modelViewTransform: ModelViewTransform2 ) {

    super( null, {
      stroke: QuadrilateralColors.rightAngleIndicatorStrokeColorProperty,
      lineWidth: 2
    } );

    assert && assert( vertex1.angleProperty, 'angleProperty must be defined to draw indicator' );
    vertex1.angleProperty!.link( angle => {
      this.visible = shapeModel.isAngleEqualToOther( angle, Math.PI / 2 );

      // if we have become visible, we need to redraw the shape
      if ( this.visible ) {

        // The line from vertex1 to vertex2 (clockwise connected side)
        const firstLine = new Line( vertex1.positionProperty.value, vertex2.positionProperty.value );

        // the line from vertex1 to vertex3 (counterclockwise connected side)
        const secondLine = new Line( vertex1.positionProperty.value, vertex3.positionProperty.value );

        // stroke right starts at the end point, we need to reverse it
        const firstInnerLine = firstLine.strokeRight( Side.SIDE_WIDTH )[ 0 ].reversed();
        const secondInnerLine = secondLine.strokeLeft( Side.SIDE_WIDTH )[ 0 ];

        // the intersection point of those lines is where we start drawing our indicator
        const cornerIntersectionSegments = Line.intersectOther( firstInnerLine, secondInnerLine );
        assert && assert( cornerIntersectionSegments.length === 1, 'Must one one and only one intersection between lines' );
        const intersectionPoint = cornerIntersectionSegments[ 0 ].point;

        // @ts-ignore - Need Line.js in TypeScript
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

        this.shape = modelViewTransform.modelToViewShape( shape );
      }
    } );
  }
}

quadrilateral.register( 'RightAngleIndicatorNode', RightAngleIndicatorNode );
export default RightAngleIndicatorNode;

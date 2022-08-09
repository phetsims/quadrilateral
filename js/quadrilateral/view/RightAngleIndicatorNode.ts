// Copyright 2022, University of Colorado Boulder

/**
 * A representation of the angle when it is a right angle.
 *
 * TODO: The visibility of this component is now controlled by the "Corner Guides" checkbox. Since
 * the component has overlap with CornerGuideNode now, it might be best to move this to that Node
 * or add it as a child of that Node to simplify visibility control.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Path } from '../../../../scenery/js/imports.js';
import Vertex from '../model/Vertex.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import { Line, Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import quadrilateral from '../../quadrilateral.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// in model coordinates, length of a side of the indicator from the edge of a line between two vertices
const SIDE_LENGTH = 0.12;

class RightAngleIndicatorNode extends Path {
  private readonly shapeModel: QuadrilateralShapeModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly cornerGuideVisibleProperty: TReadOnlyProperty<boolean>;

  /**
   * @param vertex1 - The Vertex being represented, indicator will be visible when angle at this vertex is 90 degrees
   * @param vertex2 - Vertex with a side connected to vertexA in the clockwise direction
   * @param vertex3 - Vertex with a side connected to vertexB in the counterclockwise direction
   * @param cornerGuideVisibleProperty
   * @param shapeModel
   * @param modelViewTransform
   */
  public constructor( vertex1: Vertex, vertex2: Vertex, vertex3: Vertex, cornerGuideVisibleProperty: TReadOnlyProperty<boolean>, shapeModel: QuadrilateralShapeModel, modelViewTransform: ModelViewTransform2 ) {
    super( null, {
      stroke: QuadrilateralColors.rightAngleIndicatorStrokeColorProperty,
      lineWidth: 2
    } );

    this.shapeModel = shapeModel;
    this.modelViewTransform = modelViewTransform;
    this.cornerGuideVisibleProperty = cornerGuideVisibleProperty;

    // The indicators are only visible when all angles are 90 degrees (square or rectangle), but we need to draw
    // the shape every time the shape changes because we may be a square or rectangle within tolerances (angles
    // can adjust slightly). Linked to the shape name (instead of checking equality with 90 degrees) so that the
    // indicator visibility matches how we name shapes.
    const redrawShapeListener = () => {
      this.redrawShape( vertex1, vertex2, vertex3 );
    };
    shapeModel.shapeNameProperty.link( redrawShapeListener );
    shapeModel.shapeChangedEmitter.addListener( redrawShapeListener );
    cornerGuideVisibleProperty.link( redrawShapeListener );
  }

  private redrawShape( vertex1: Vertex, vertex2: Vertex, vertex3: Vertex ): void {

    assert && assert( vertex1.angleProperty.value, 'Angle must be available to draw the indicator' );
    const angle = vertex1.angleProperty.value!;

    this.visible = this.shapeModel.isRightAngle( angle ) && this.cornerGuideVisibleProperty.value;

    // if we have become visible, we need to redraw the shape
    if ( this.visible ) {

      // TODO: Clean this up, the implementation has changed such that variable names no longer accurately
      // describe what is happening. Got to a commit point for

      // The line from vertexA to vertexB (clockwise connected side)
      const firstLine = new Line( vertex1.positionProperty.value, vertex2.positionProperty.value );

      // the line from vertexA to vertexC (counterclockwise connected side)
      const secondLine = new Line( vertex1.positionProperty.value, vertex3.positionProperty.value );

      // stroke right starts at the end point, we need to reverse it
      const intersectionPoint = vertex1.positionProperty.value;

      const closestPointToIntersection = firstLine.explicitClosestToPoint( intersectionPoint )[ 0 ].closestPoint;

      const correctedLength = SIDE_LENGTH + intersectionPoint.distance( closestPointToIntersection );

      const t1 = Math.min( correctedLength / firstLine.getArcLength(), 1 );
      const pointAlongFirstInnerLine = firstLine.positionAt( t1 );

      const t2 = Math.min( correctedLength / secondLine.getArcLength(), 1 );
      const pointAlongSecondInnerLine = secondLine.positionAt( t2 );

      const innerPoint = pointAlongSecondInnerLine.plus( pointAlongFirstInnerLine.minus( intersectionPoint ) );

      // We now have all points for our "square" shape
      const shape = new Shape();
      shape.moveToPoint( pointAlongFirstInnerLine );
      shape.lineToPoint( innerPoint );
      shape.lineToPoint( pointAlongSecondInnerLine );

      this.shape = this.modelViewTransform.modelToViewShape( shape );
    }
  }
}

quadrilateral.register( 'RightAngleIndicatorNode', RightAngleIndicatorNode );

export default RightAngleIndicatorNode;

// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';

class ShapeSnapshot {
  public readonly topSideTilt: number;
  public readonly rightSideTilt: number;
  public readonly bottomSideTilt: number;
  public readonly leftSideTilt: number;
  public readonly isParallelogram: boolean;
  public readonly vertex1Position: Vector2;
  public readonly vertex2Position: Vector2;
  public readonly vertex3Position: Vector2;
  public readonly vertex4Position: Vector2;
  public readonly topSideLength: number;
  public readonly rightSideLength: number;
  public readonly leftSideLength: number;
  public readonly bottomSideLength: number;

  constructor( shapeModel: QuadrilateralShapeModel ) {
    this.topSideTilt = shapeModel.topSide.tiltProperty.value;
    this.rightSideTilt = shapeModel.rightSide.tiltProperty.value;
    this.bottomSideTilt = shapeModel.bottomSide.tiltProperty.value;
    this.leftSideTilt = shapeModel.leftSide.tiltProperty.value;
    this.isParallelogram = shapeModel.isParallelogramProperty.value;
    this.vertex1Position = shapeModel.vertex1.positionProperty.value;
    this.vertex2Position = shapeModel.vertex2.positionProperty.value;
    this.vertex3Position = shapeModel.vertex3.positionProperty.value;
    this.vertex4Position = shapeModel.vertex4.positionProperty.value;

    this.topSideLength = shapeModel.topSide.lengthProperty.value;
    this.rightSideLength = shapeModel.rightSide.lengthProperty.value;
    this.bottomSideLength = shapeModel.bottomSide.lengthProperty.value;
    this.leftSideLength = shapeModel.leftSide.lengthProperty.value;
  }
}

quadrilateral.register( 'ShapeSnapshot', ShapeSnapshot );
export default ShapeSnapshot;

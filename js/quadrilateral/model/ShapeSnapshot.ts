// Copyright 2021-2022, University of Colorado Boulder

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
  public readonly vertexAPosition: Vector2;
  public readonly vertexBPosition: Vector2;
  public readonly vertexCPosition: Vector2;
  public readonly vertexDPosition: Vector2;
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
    this.vertexAPosition = shapeModel.vertexA.positionProperty.value;
    this.vertexBPosition = shapeModel.vertexB.positionProperty.value;
    this.vertexCPosition = shapeModel.vertexC.positionProperty.value;
    this.vertexDPosition = shapeModel.vertexD.positionProperty.value;

    this.topSideLength = shapeModel.topSide.lengthProperty.value;
    this.rightSideLength = shapeModel.rightSide.lengthProperty.value;
    this.bottomSideLength = shapeModel.bottomSide.lengthProperty.value;
    this.leftSideLength = shapeModel.leftSide.lengthProperty.value;
  }
}

quadrilateral.register( 'ShapeSnapshot', ShapeSnapshot );
export default ShapeSnapshot;

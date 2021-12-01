// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from './QuadrilateralModel.js';
import Vector2 from '../../../../dot/js/Vector2.js';

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


  constructor( model: QuadrilateralModel ) {
    this.topSideTilt = model.topSide.tiltProperty.value;
    this.rightSideTilt = model.rightSide.tiltProperty.value;
    this.bottomSideTilt = model.bottomSide.tiltProperty.value;
    this.leftSideTilt = model.leftSide.tiltProperty.value;
    this.isParallelogram = model.isParallelogramProperty.value;
    this.vertex1Position = model.vertex1.positionProperty.value;
    this.vertex2Position = model.vertex2.positionProperty.value;
    this.vertex3Position = model.vertex3.positionProperty.value;
    this.vertex4Position = model.vertex4.positionProperty.value;

    this.topSideLength = model.topSide.lengthProperty.value;
    this.rightSideLength = model.rightSide.lengthProperty.value;
    this.bottomSideLength = model.bottomSide.lengthProperty.value;
    this.leftSideLength = model.leftSide.lengthProperty.value;
  }
}

quadrilateral.register( 'ShapeSnapshot', ShapeSnapshot );
export default ShapeSnapshot;

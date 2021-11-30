// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from './QuadrilateralModel.js';

class ShapeSnapshot {
  public readonly topSideTilt: number;
  public readonly rightSideTilt: number;
  public readonly bottomSideTilt: number;
  public readonly leftSideTilt: number;
  public readonly isParallelogram: boolean;

  constructor( model: QuadrilateralModel ) {
    this.topSideTilt = model.topSide.tiltProperty.value;
    this.rightSideTilt = model.rightSide.tiltProperty.value;
    this.bottomSideTilt = model.bottomSide.tiltProperty.value;
    this.leftSideTilt = model.leftSide.tiltProperty.value;
    this.isParallelogram = model.isParallelogramProperty.value;
  }
}

quadrilateral.register( 'ShapeSnapshot', ShapeSnapshot );
export default ShapeSnapshot;

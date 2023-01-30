// Copyright 2023, University of Colorado Boulder
import Utils from '../../../../dot/js/Utils.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';

/**
 *
 *
 */

class QuadrilateralSerialMessageController {
  private readonly shapeModel: QuadrilateralShapeModel;

  public constructor( quadrilateralShapeModel: QuadrilateralShapeModel ) {
    this.shapeModel = quadrilateralShapeModel;
  }

  /**
   * Returns a string of values in this order:
   *
   * '(topLength,rightLength,bottomLength,leftLength,topLeftAngle,bottomRightAngle)'
   */
  public sendModelValuesString(): void {
    const topLength = this.formatValue( this.shapeModel.topSide.lengthProperty.value );
    const rightLength = this.formatValue( this.shapeModel.rightSide.lengthProperty.value );
    const bottomLength = this.formatValue( this.shapeModel.bottomSide.lengthProperty.value );
    const leftLength = this.formatValue( this.shapeModel.leftSide.lengthProperty.value );

    const topLeftAngle = this.formatValue( this.shapeModel.vertexA.angleProperty.value! );
    const bottomRightAngle = this.formatValue( this.shapeModel.vertexC.angleProperty.value! );

    const valuesString = `(${topLength},${rightLength},${bottomLength},${leftLength},${topLeftAngle},${bottomRightAngle})`;

    const parent = window.parent;
    parent.postMessage( valuesString, '*' );
  }

  private formatValue( value: number ): number {
    return Utils.toFixedNumber( value, 2 );
  }
}

quadrilateral.register( 'QuadrilateralSerialMessageController', QuadrilateralSerialMessageController );
export default QuadrilateralSerialMessageController;
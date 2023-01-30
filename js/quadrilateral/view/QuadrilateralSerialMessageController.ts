// Copyright 2023, University of Colorado Boulder

/**
 * A class that will send a representation of the model to a parent iframe. This is used in a
 * "p5 serial connection" prototype.
 *
 * TODO: More documentation about this Prototype, how it works, and what is expected.
 */

import Utils from '../../../../dot/js/Utils.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';

class QuadrilateralSerialMessageController {
  private readonly shapeModel: QuadrilateralShapeModel;

  public constructor( quadrilateralShapeModel: QuadrilateralShapeModel ) {
    this.shapeModel = quadrilateralShapeModel;
  }

  /**
   * Sends a message to a parent window (p5.js wrapper) with model values. The p5.js wrapper forwards
   * the data to an actuated device with a serial connection.
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

  /**
   * Limits a model value to two decimal places to send a smaller string to the wrapper (and eventually to
   * the actuated tangible device). I don't know if this is necessary but it seems reasonable.
   */
  private formatValue( value: number ): number {
    return Utils.toFixedNumber( value, 2 );
  }
}

quadrilateral.register( 'QuadrilateralSerialMessageController', QuadrilateralSerialMessageController );
export default QuadrilateralSerialMessageController;
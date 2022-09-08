// Copyright 2022, University of Colorado Boulder

/**
 * A pair of sides that have some relationship. For example, they could be adjacent or opposite to each other
 * when assembled in the quadrilateral shape.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import Side from './Side.js';

class SidePair {
  public readonly side1: Side;
  public readonly side2: Side;

  public constructor( side1: Side, side2: Side ) {
    this.side1 = side1;
    this.side2 = side2;
  }

  public includesSide( side: Side ): boolean {
    return this.side1 === side || this.side2 === side;
  }
}

quadrilateral.register( 'SidePair', SidePair );
export default SidePair;
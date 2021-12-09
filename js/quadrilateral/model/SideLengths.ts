// Copyright 2021, University of Colorado Boulder

/**
 * A class that is a collection of side lengths at a snapshot in time. Used to compare how the collection of
 * side lengths has changed over time or between interactions.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';

class SideLengths {

  // This is a
  public readonly topSideLength: number;
  public readonly rightSideLength: number;
  public readonly bottomSideLength: number;
  public readonly leftSideLength: number;

  constructor( topSideLength: number, rightSideLength: number, bottomSideLength: number, leftSideLength: number ) {
    this.topSideLength = topSideLength;
    this.rightSideLength = topSideLength;
    this.bottomSideLength = topSideLength;
    this.leftSideLength = topSideLength;
  }
}

quadrilateral.register( 'SideLengths', SideLengths );
export default SideLengths;

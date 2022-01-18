// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import dotRandom from '../../../dot/js/dotRandom.js';
import quadrilateral from '../quadrilateral.js';

const QuadrilateralUtils = {

  /**
   * Returns a random color for debugging. Color is semi-transparent as we want to see the rest of the sim and possibly
   * other debugging colors under this.
   */
  getRandomColor(): string {
    return `rgba(${dotRandom.nextInt( 255 )},${dotRandom.nextInt( 255 )},${dotRandom.nextInt( 255 )},0.5)`;
  }
};

quadrilateral.register( 'QuadrilateralUtils', QuadrilateralUtils );
export default QuadrilateralUtils;

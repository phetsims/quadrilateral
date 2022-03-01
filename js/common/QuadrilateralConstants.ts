// Copyright 2021, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../quadrilateral.js';

const QuadrilateralConstants = {

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  MAJOR_GRID_SPACING: 0.05,
  MINOR_GRID_SPACING: 0.001,


  // {number} - The amount of movement per key press in model coordinates for vertices and sides.
  MOVEMENT_PER_KEY_PRESS: 0.05
};

quadrilateral.register( 'QuadrilateralConstants', QuadrilateralConstants );
export default QuadrilateralConstants;
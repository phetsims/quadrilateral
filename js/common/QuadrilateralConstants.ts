// Copyright 2021, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import quadrilateral from '../quadrilateral.js';

const QuadrilateralConstants = {

  // MODEL CONSTANTS

  // {number} - The amount of movement per key press in model coordinates for vertices and sides.
  MOVEMENT_PER_KEY_PRESS: 0.05,

  // VIEW CONSTANTS
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  SCREEN_TEXT_OPTIONS: {
    font: new PhetFont( { size: 14 } )
  },

  PANEL_LABEL_TEXT_OPTIONS: {
    font: new PhetFont( { size: 16 } )
  },

  PANEL_TITLE_TEXT_OPTIONS: {
    font: new PhetFont( { size: 16, weight: 'bold' } )
  }
};

quadrilateral.register( 'QuadrilateralConstants', QuadrilateralConstants );
export default QuadrilateralConstants;
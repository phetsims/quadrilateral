// Copyright 2021-2022, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Utterance from '../../../utterance-queue/js/Utterance.js';
import quadrilateral from '../quadrilateral.js';

const MAJOR_GRID_SPACING = 0.05;
const MINOR_GRID_SPACING = MAJOR_GRID_SPACING / 4;
const QuadrilateralConstants = {

  // MODEL CONSTANTS

  // {number} - The amount of movement per key press in model coordinates for vertices and sides.
  MOVEMENT_PER_KEY_PRESS: 0.05,

  // The spacing of the model "grid" along both x and y axes. The Quadrilateral vertex positions will be constrained to
  // intervals of these values in model coordinates.
  MAJOR_GRID_SPACING: MAJOR_GRID_SPACING,
  MINOR_GRID_SPACING: MINOR_GRID_SPACING,

  // VIEW CONSTANTS
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  // additional spacing in the view between components
  VIEW_SPACING: 15,

  // corner radius used in many rectangles in this sim
  CORNER_RADIUS: 5,

  // dilation frequently used for interactive components in this sim
  POINTER_AREA_DILATION: 5,

  // spacing between grouped controls
  CONTROLS_SPACING: 15,

  SCREEN_TEXT_OPTIONS: {
    font: new PhetFont( { size: 18 } )
  },

  PANEL_LABEL_TEXT_OPTIONS: {
    font: new PhetFont( { size: 16 } )
  },

  PANEL_TITLE_TEXT_OPTIONS: {
    font: new PhetFont( { size: 16, weight: 'bold' } )
  },

  SHAPE_NAME_TEXT_OPTIONS: {
    font: new PhetFont( { size: 22 } ),
    maxWidth: 250
  },

  // VOICING CONSTANTS
  // Object responses that are only triggered from input have a higher priority than context responses so that
  // they are spoken first, input interrupts older responses, and so that context responses always come after the
  // latest object response during interaction.
  INPUT_OBJECT_RESPONSE_PRIORITY: Utterance.MEDIUM_PRIORITY
};

quadrilateral.register( 'QuadrilateralConstants', QuadrilateralConstants );
export default QuadrilateralConstants;
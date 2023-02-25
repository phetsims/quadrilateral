// Copyright 2021-2023, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetFont from '../../scenery-phet/js/PhetFont.js';
import Range from '../../dot/js/Range.js';
import Utterance from '../../utterance-queue/js/Utterance.js';
import quadrilateral from './quadrilateral.js';

const QuadrilateralConstants = {

  //----------------------------------------------------------------------------------------------------------
  // MODEL CONSTANTS
  //----------------------------------------------------------------------------------------------------------

  // {number} - The amount of movement per key press in model coordinates for vertices and sides.
  MOVEMENT_PER_KEY_PRESS: 0.05,

  // Amount of spacing in model coordinates between grid lines in the visual grid.
  GRID_SPACING: 0.25,

  // Dimensions of model bounds.
  BOUNDS_WIDTH: 3.1,
  BOUNDS_HEIGHT: 2.1,

  // The "major" vertex interval when using ?reducedStepSize query parameter. Value is in model coordinates.
  MAJOR_REDUCED_SIZE_VERTEX_INTERVAL: 0.0625,

  // The "minor" vertex interval when the using ?reducedStepSize from Preferences. Value is in model coordinates.
  MINOR_REDUCED_SIZE_VERTEX_INTERVAL: 0.015625,

  //----------------------------------------------------------------------------------------------------------
  // VIEW CONSTANTS
  //----------------------------------------------------------------------------------------------------------
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  // spacing between different groups of components in the ScreenView
  VIEW_GROUP_SPACING: 45,

  // additional spacing in the ScreenView between components (generally in the same group)
  VIEW_SPACING: 15,

  // corner radius used in many rectangles in this sim
  CORNER_RADIUS: 5,

  // dilation frequently used for interactive components in this sim
  POINTER_AREA_DILATION: 5,

  // spacing between grouped controls
  CONTROLS_SPACING: 15,

  // horizontal spacing between a UI component and its label (such as between a checkbox and its label or a button
  // and its label)
  CONTROL_LABEL_SPACING: 10,

  SCREEN_TEXT_FONT: new PhetFont( { size: 18 } ),

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

  // sound constants
  // Range of output levels for individual sound clips under in a sound view.
  OUTPUT_LEVEL_RANGE: new Range( 0, 1 ),

  // VOICING CONSTANTS
  // Object responses that are only triggered from input have a higher priority than context responses so that
  // they are spoken first, input interrupts older responses, and so that context responses always come after the
  // latest object response during interaction.
  INPUT_OBJECT_RESPONSE_PRIORITY: Utterance.MEDIUM_PRIORITY
};

quadrilateral.register( 'QuadrilateralConstants', QuadrilateralConstants );
export default QuadrilateralConstants;
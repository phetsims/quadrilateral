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

const SCREEN_TEXT_FONT = new PhetFont( { size: 18 } );

const QuadrilateralConstants = {

  //----------------------------------------------------------------------------------------------------------
  // MODEL CONSTANTS
  //----------------------------------------------------------------------------------------------------------

  // Amount of spacing in model coordinates between grid lines in the visual grid.
  GRID_SPACING: 0.25,

  // Dimensions of model bounds.
  BOUNDS_WIDTH: 3.1,
  BOUNDS_HEIGHT: 2.1,

  // The "major" vertex interval when using ?reducedStepSize query parameter. Value is in model coordinates.
  MAJOR_REDUCED_SIZE_VERTEX_INTERVAL: 0.0625,

  // The "minor" vertex interval when the using ?reducedStepSize query parameter. Value is in model coordinates.
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

  // Font for text that appears on screen
  SCREEN_TEXT_FONT: SCREEN_TEXT_FONT,
  SCREEN_TEXT_OPTIONS: {
    font: SCREEN_TEXT_FONT
  },

  // Text options for titles for panels and dialogs.
  PANEL_TITLE_TEXT_OPTIONS: {
    font: new PhetFont( { size: 18, weight: 'bold' } )
  },

  // Text options for the "Shape Name" display.
  SHAPE_NAME_TEXT_OPTIONS: {
    font: new PhetFont( { size: 22 } ),
    maxWidth: 250
  }
};

quadrilateral.register( 'QuadrilateralConstants', QuadrilateralConstants );
export default QuadrilateralConstants;
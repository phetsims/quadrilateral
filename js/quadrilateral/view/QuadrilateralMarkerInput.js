// Copyright 2020-2021, University of Colorado Boulder

/**
 * This file adds mechamarkers as an input controller to Ratio and Proportion
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import MarkerInput from '../../../../tangible/js/MarkerInput.js';
import quadrilateral from '../../quadrilateral.js';

// constants
// Note marker 2 of original aruco doesn't work well when camera is flipped.
const BASE_MARKER = 4;
const RATIO_MARKER_LEFT = 2;
const RATIO_MARKER_RIGHT = 0;

class QuadrilateralMarkerInput extends MarkerInput {

  /**
   */
  constructor() {
    super();
  }

  /**
   * @public
   */
  step() {
    phet.log && phet.log( [
      RATIO_MARKER_LEFT, this.Beholder.getMarker( RATIO_MARKER_LEFT ).present, '\n',
      BASE_MARKER, this.Beholder.getMarker( BASE_MARKER ).present, '\n',
      RATIO_MARKER_RIGHT, this.Beholder.getMarker( RATIO_MARKER_RIGHT ).present, '\n'
    ] );
  }
}

quadrilateral.register( 'QuadrilateralMarkerInput', QuadrilateralMarkerInput );
export default QuadrilateralMarkerInput;
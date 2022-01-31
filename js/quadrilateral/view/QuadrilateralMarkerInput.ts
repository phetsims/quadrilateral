// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import MarkerInput from '../../../../tangible/js/MarkerInput.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

// constants
// Note marker 2 of original aruco doesn't work well when camera is flipped, so using 4 instead.
const BASE_MARKER = 4;

class QuadrilateralMarkerInput extends MarkerInput {
  private readonly rotationMarkerDetectedProperty: BooleanProperty;
  private readonly markerRotationProperty: NumberProperty;

  constructor( rotationMarkerDetectedProperty: BooleanProperty, markerRotationProperty: NumberProperty ) {
    super();
    this.rotationMarkerDetectedProperty = rotationMarkerDetectedProperty;
    this.markerRotationProperty = markerRotationProperty;
  }

  /**
   * Step, asking the Beholder global what the current state is and update Properties accordingly.
   * @param dt
   */
  public step( dt: number ): void {
    this.rotationMarkerDetectedProperty.value = this.Beholder.getMarker( BASE_MARKER ).present;
    this.markerRotationProperty.value = this.Beholder.getMarker( BASE_MARKER ).rotation;
  }
}

quadrilateral.register( 'QuadrilateralMarkerInput', QuadrilateralMarkerInput );
export default QuadrilateralMarkerInput;

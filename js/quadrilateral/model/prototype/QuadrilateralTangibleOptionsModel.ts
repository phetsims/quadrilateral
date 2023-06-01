// Copyright 2023, University of Colorado Boulder

/**
 * Model component for options related to control from the tangible. These Properties are controlled by UI components
 * in the Preferences dialog.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import quadrilateral from '../../../quadrilateral.js';
import Range from '../../../../../dot/js/Range.js';
import QuadrilateralQueryParameters from '../../QuadrilateralQueryParameters.js';
import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import MediaPipeQueryParameters from '../../../../../tangible/js/mediaPipe/MediaPipeQueryParameters.js';

export default class QuadrilateralTangibleOptionsModel {

  // How many values to save and use in the average for calculating new vertex positions. Higher value will reduce
  // noise but the sim will respond slower.
  public readonly smoothingLengthProperty = new NumberProperty( QuadrilateralQueryParameters.smoothingLength, {
    range: new Range( 1, 10 )
  } );

  // How frequently we update the simulation from input from the tangible device. See the query parameter documentation.
  public readonly bluetoothUpdateIntervalProperty = new NumberProperty( QuadrilateralQueryParameters.bluetoothUpdateInterval, {
    range: new Range( 0.01, 1 )
  } );

  // Controls the interval that vertex positions are constrained to when controlled from the tangible device.
  // Increasing this value helps reduce noise, but makes the motion more coarse.
  public readonly deviceGridSpacingProperty = new NumberProperty( QuadrilateralQueryParameters.deviceGridSpacing, {
    range: new Range( 0.0125, 0.25 )
  } );

  // Represents when the simulation is connected to some tangible device.
  public readonly deviceConnectedProperty = new BooleanProperty( QuadrilateralQueryParameters.deviceConnection );

  // Represents when the simulation is connected to Camera Input: Hands.
  public readonly cameraInputHandsConnectedProperty = new BooleanProperty( MediaPipeQueryParameters.cameraInput === 'hands' );

  // True when the simulation is connected to some tangible device or camera input hands.
  public readonly supportsInputOptions: boolean;

  public constructor() {
    this.supportsInputOptions = this.deviceConnectedProperty.value || this.cameraInputHandsConnectedProperty.value;
  }
}

quadrilateral.register( 'QuadrilateralTangibleOptionsModel', QuadrilateralTangibleOptionsModel );

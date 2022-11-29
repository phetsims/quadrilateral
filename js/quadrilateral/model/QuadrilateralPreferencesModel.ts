// Copyright 2022, University of Colorado Boulder

/**
 * A model component responsible for the Properties that can be controlled from the preferences dialog
 * in this simulation.
 *
 * NOTE: These Properties generally cannot be PhET-iO instrumented because the Property of NumberControl depends on
 * phet.joist.sim if it is instrumented and this model is constructed before the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSoundOptionsModel from './QuadrilateralSoundOptionsModel.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

import Range from '../../../../dot/js/Range.js';

class QuadrilateralPreferencesModel {

  // Sound preferences
  public readonly soundOptionsModel = new QuadrilateralSoundOptionsModel();

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

  // Controls the interval that Vertex positions are constrained to for typical simulation control. When true,
  // Vertices will be constrained to a finer grid for more precise motion. In general that is not necessary but some
  // users may want that amount of control.
  public readonly fineInputSpacingProperty = new BooleanProperty( false );
}

quadrilateral.register( 'QuadrilateralPreferencesModel', QuadrilateralPreferencesModel );
export default QuadrilateralPreferencesModel;

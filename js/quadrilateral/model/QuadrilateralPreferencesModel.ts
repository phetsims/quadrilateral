// Copyright 2022-2023, University of Colorado Boulder

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
import QuadrilateralTangibleOptionsModel from './QuadrilateralTangibleOptionsModel.js';

class QuadrilateralPreferencesModel {

  // Sound preferences
  public readonly soundOptionsModel = new QuadrilateralSoundOptionsModel();

  public readonly tangibleOptionsModel = new QuadrilateralTangibleOptionsModel();

  // Controls the interval that Vertex positions are constrained to for typical simulation control. When true,
  // Vertices will be constrained to a finer grid for more precise motion. In general that is not necessary but some
  // users may want that amount of control.
  // TODO: This could be removed from QuadrilateralPreferencesModel, it will never change at runtime now
  public readonly reducedStepSizeProperty = new BooleanProperty( QuadrilateralQueryParameters.reducedStepSize );
}

quadrilateral.register( 'QuadrilateralPreferencesModel', QuadrilateralPreferencesModel );
export default QuadrilateralPreferencesModel;

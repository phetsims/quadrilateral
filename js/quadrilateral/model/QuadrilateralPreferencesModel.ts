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

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSoundOptionsModel from './QuadrilateralSoundOptionsModel.js';
import QuadrilateralTangibleOptionsModel from './QuadrilateralTangibleOptionsModel.js';

class QuadrilateralPreferencesModel {
  public readonly soundOptionsModel = new QuadrilateralSoundOptionsModel();
  public readonly tangibleOptionsModel = new QuadrilateralTangibleOptionsModel();
}

quadrilateral.register( 'QuadrilateralPreferencesModel', QuadrilateralPreferencesModel );
export default QuadrilateralPreferencesModel;

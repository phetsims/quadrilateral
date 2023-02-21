// Copyright 2022-2023, University of Colorado Boulder

/**
 * A model component responsible for the Properties that can be controlled from the preferences dialog
 * in this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSoundOptionsModel from './QuadrilateralSoundOptionsModel.js';
import QuadrilateralTangibleOptionsModel from './QuadrilateralTangibleOptionsModel.js';

class QuadrilateralOptionsModel {
  public readonly soundOptionsModel = new QuadrilateralSoundOptionsModel();
  public readonly tangibleOptionsModel = new QuadrilateralTangibleOptionsModel();
}

quadrilateral.register( 'QuadrilateralOptionsModel', QuadrilateralOptionsModel );
export default QuadrilateralOptionsModel;

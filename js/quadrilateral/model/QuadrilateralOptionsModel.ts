// Copyright 2022-2026, University of Colorado Boulder

/**
 * A model component responsible for the Properties that can be controlled from the preferences dialog
 * in this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import QuadrilateralTangibleOptionsModel from './prototype/QuadrilateralTangibleOptionsModel.js';
import QuadrilateralSoundOptionsModel from './QuadrilateralSoundOptionsModel.js';

export default class QuadrilateralOptionsModel {
  public readonly soundOptionsModel = new QuadrilateralSoundOptionsModel();
  public readonly tangibleOptionsModel = new QuadrilateralTangibleOptionsModel();
}

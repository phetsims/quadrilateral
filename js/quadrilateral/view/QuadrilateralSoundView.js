// Copyright 2021, University of Colorado Boulder

/**
 * File responsible for the sound view of the quadrilateral.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuartetSoundView from './QuartetSoundView.js';

// constants

class QuadrilateralSoundView {

  /**
   * @param {QuadrilateralModel} model
   * @param {QuadrilateralSoundOptionsModel} soundOptionsModel
   */
  constructor( model, soundOptionsModel ) {

    const quartetSoundView = new QuartetSoundView( model, soundOptionsModel );

    // @private {*}
    this.activeSoundView = quartetSoundView;
  }

  /**
   * Step the sound view.
   * @public
   *
   * @param {number} dt - in seconds
   */
  step( dt ) {

    this.activeSoundView.step( dt );
  }

}

quadrilateral.register( 'QuadrilateralSoundView', QuadrilateralSoundView );
export default QuadrilateralSoundView;

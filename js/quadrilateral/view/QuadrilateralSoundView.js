// Copyright 2021, University of Colorado Boulder

/**
 * File responsible for the sound view of the quadrilateral.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';
import ParallelsVolumeSoundView from './ParallelsVolumeSoundView.js';
import QuartetSoundView from './QuartetSoundView.js';

// constants

class QuadrilateralSoundView {

  /**
   * @param {QuadrilateralModel} model
   * @param {QuadrilateralSoundOptionsModel} soundOptionsModel
   */
  constructor( model, soundOptionsModel ) {

    const quartetSoundView = new QuartetSoundView( model, soundOptionsModel );
    const parallelsVolumeSoundView = new ParallelsVolumeSoundView( model, soundOptionsModel );

    // @private {*}
    this.activeSoundView = null;

    soundOptionsModel.soundDesignProperty.link( soundDesign => {
      this.activeSoundView = soundDesign === QuadrilateralSoundOptionsModel.SoundDesign.QUARTET ? quartetSoundView :
                             parallelsVolumeSoundView;
    } );
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

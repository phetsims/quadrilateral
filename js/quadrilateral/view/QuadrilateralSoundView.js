// Copyright 2021, University of Colorado Boulder

/**
 * File responsible for the sound view of the quadrilateral.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';
import ParallelsStaccatoSoundView from './ParallelsStaccatoSoundView.js';
import ParallelsVolumeSoundView from './ParallelsVolumeSoundView.js';
import QuartetSoundView from './QuartetSoundView.js';

// constants

class QuadrilateralSoundView {

  /**
   * @param {QuadrilateralModel} model
   * @param {QuadrilateralSoundOptionsModel} soundOptionsModel
   */
  constructor( model, soundOptionsModel ) {

    // @private {*}
    this.activeSoundView = null;

    soundOptionsModel.soundDesignProperty.link( soundDesign => {
      this.activeSoundView && this.activeSoundView.dispose();

      if ( soundDesign === QuadrilateralSoundOptionsModel.SoundDesign.QUARTET ) {
        this.activeSoundView = new QuartetSoundView( model, soundOptionsModel );
      }
      else if ( soundDesign === QuadrilateralSoundOptionsModel.SoundDesign.PARALLELS_VOLUME ) {
        this.activeSoundView = new ParallelsVolumeSoundView( model, soundOptionsModel );
      }
      else if ( soundDesign === QuadrilateralSoundOptionsModel.SoundDesign.PARALLELS_STACCATO ) {
        this.activeSoundView = new ParallelsStaccatoSoundView( model, soundOptionsModel );
      }
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

// Copyright 2021, University of Colorado Boulder

/**
 * File responsible for the sound view of the quadrilateral.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';
import ParallelsStaccatoSoundView from './ParallelsStaccatoSoundView.js';
import ParallelsVolumeSoundView from './ParallelsVolumeSoundView.js';
import QuartetSoundView from './QuartetSoundView.js';
import SuccessSoundView from './SuccessSoundView.js';

// constants

class QuadrilateralSoundView {
  private activeSoundView: null | QuartetSoundView | ParallelsVolumeSoundView | ParallelsStaccatoSoundView | SuccessSoundView;

  /**
   * @param {QuadrilateralModel} model
   * @param {QuadrilateralSoundOptionsModel} soundOptionsModel
   */
  constructor( model: QuadrilateralModel, soundOptionsModel: QuadrilateralSoundOptionsModel ) {

    // The sound view that is currently "active" with playing sounds. The active sound view is chosen by user in the
    // Preferences dialog.
    this.activeSoundView = null;

    // @ts-ignore - TODO: How to do Enumeration? See #27
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
      else if ( soundDesign === QuadrilateralSoundOptionsModel.SoundDesign.SUCCESS_SOUNDS ) {
        this.activeSoundView = new SuccessSoundView( model, soundOptionsModel );
      }
    } );
  }

  /**
   * Step the sound view.
   *
   * @param dt - in seconds
   */
  public step( dt: number ): void {
    assert && assert( this.activeSoundView, 'There must be an active sound view to update sounds.' );
    this.activeSoundView!.step( dt );
  }

}

quadrilateral.register( 'QuadrilateralSoundView', QuadrilateralSoundView );
export default QuadrilateralSoundView;

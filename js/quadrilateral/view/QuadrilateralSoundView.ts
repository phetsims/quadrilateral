// Copyright 2021-2022, University of Colorado Boulder

/**
 * File responsible for the sound view of the quadrilateral.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralSoundOptionsModel, { SoundDesign } from '../model/QuadrilateralSoundOptionsModel.js';
import ParallelsStaccatoSoundView from './ParallelsStaccatoSoundView.js';
import ParallelsVolumeSoundView from './ParallelsVolumeSoundView.js';
import QuartetSoundView from './QuartetSoundView.js';
import SuccessSoundView from './SuccessSoundView.js';
import TracksBuildUpSoundView from './TracksBuildUpSoundView.js';
import TracksSoundView from './TracksSoundView.js';
import TracksVolumeEmphasisSoundView from './TracksVolumeEmphasisSoundView.js';
import TracksMelodySoundView from './TracksMelodySoundView.js';

// constants

class QuadrilateralSoundView {

  // The sound view that is currently "active" with playing sounds. The active sound view is chosen by user in the
  // Preferences dialog.
  private activeSoundView: null | QuartetSoundView | ParallelsVolumeSoundView | ParallelsStaccatoSoundView | SuccessSoundView | TracksSoundView = null;

  public constructor( model: QuadrilateralModel, soundOptionsModel: QuadrilateralSoundOptionsModel ) {

    soundOptionsModel.soundDesignProperty.link( soundDesign => {
      this.activeSoundView && this.activeSoundView.dispose();

      if ( soundDesign === SoundDesign.QUARTET ) {
        this.activeSoundView = new QuartetSoundView( model, soundOptionsModel );
      }
      else if ( soundDesign === SoundDesign.PARALLELS_VOLUME ) {
        this.activeSoundView = new ParallelsVolumeSoundView( model, soundOptionsModel );
      }
      else if ( soundDesign === SoundDesign.PARALLELS_STACCATO ) {
        this.activeSoundView = new ParallelsStaccatoSoundView( model, soundOptionsModel );
      }
      else if ( soundDesign === SoundDesign.SUCCESS_SOUNDS ) {
        this.activeSoundView = new SuccessSoundView( model, soundOptionsModel );
      }
      else if ( soundDesign === SoundDesign.MAINTENANCE_SOUNDS ) {
        this.activeSoundView = new SuccessSoundView( model, soundOptionsModel );
      }
      else if ( soundDesign === SoundDesign.TRACKS_BUILD_UP ) {
        this.activeSoundView = new TracksBuildUpSoundView( model.quadrilateralShapeModel, model.resetNotInProgressProperty, soundOptionsModel );
      }
      else if ( soundDesign === SoundDesign.TRACKS_VOLUME_EMPHASIS ) {
        this.activeSoundView = new TracksVolumeEmphasisSoundView( model.quadrilateralShapeModel, model.resetNotInProgressProperty, soundOptionsModel );
      }
      else if ( soundDesign === SoundDesign.TRACKS_MELODY ) {
        this.activeSoundView = new TracksMelodySoundView( model.quadrilateralShapeModel, model.resetNotInProgressProperty, soundOptionsModel );
      }
      else if ( soundDesign === SoundDesign.TRACKS_ARPEGGIO ) {
        this.activeSoundView = new TracksBuildUpSoundView( model.quadrilateralShapeModel, model.resetNotInProgressProperty, soundOptionsModel );
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

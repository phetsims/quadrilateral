// Copyright 2021-2022, University of Colorado Boulder

/**
 * File responsible for the sound view of the quadrilateral. There are two sound designs
 * that can be used. Controls the active view and is responsible for stepping it forward.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../../quadrilateral.js';
import QuadrilateralModel from '../../model/QuadrilateralModel.js';
import QuadrilateralSoundOptionsModel, { SoundDesign } from '../../model/QuadrilateralSoundOptionsModel.js';
import TracksBuildUpSoundView from './TracksBuildUpSoundView.js';
import TracksSoundView from './TracksSoundView.js';
import TracksVolumeEmphasisSoundView from './TracksVolumeEmphasisSoundView.js';

class QuadrilateralSoundView {

  // The sound view that is currently "active" with playing sounds. The active sound view is chosen by user in the
  // Preferences dialog.
  private activeSoundView: null | TracksSoundView = null;

  public constructor( model: QuadrilateralModel, soundOptionsModel: QuadrilateralSoundOptionsModel ) {

    soundOptionsModel.soundDesignProperty.link( soundDesign => {
      this.activeSoundView && this.activeSoundView.dispose();

      if ( soundDesign === SoundDesign.TRACKS_BUILD_UP_SIMPLE ) {
        this.activeSoundView = new TracksBuildUpSoundView( model.quadrilateralShapeModel, model.shapeSoundEnabledProperty, model.resetNotInProgressProperty, soundOptionsModel, {
          simple: true
        } );
      }
      else if ( soundDesign === SoundDesign.TRACKS_VOLUME_EMPHASIS ) {
        this.activeSoundView = new TracksVolumeEmphasisSoundView( model.quadrilateralShapeModel, model.shapeSoundEnabledProperty, model.resetNotInProgressProperty, soundOptionsModel );
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

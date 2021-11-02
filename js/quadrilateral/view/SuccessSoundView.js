// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';

const MAX_OUTPUT_LEVEL = 0.2;

class SuccessSoundView {

  /**
   * @param {QuadrilateralModel} model
   * @param {QuadrilateralSoundOptionsModel} soundOptionsModel
   */
  constructor( model, soundOptionsModel ) {

    this.successSoundClip = null;
    this.failureSoundClip = null;
    this.maintenanceSoundClip = null;

    this.model = model;

    this.remainingMaintenancePlayTime = 0;

    // link is called eagerly so that we have SoundClips to play in the following listeners
    soundOptionsModel.successSoundFileProperty.link( successSoundFile => {
      const successSoundCollection = QuadrilateralSoundOptionsModel.SUCCESS_SOUND_COLLECTION_MAP.get( successSoundFile );
      this.createSoundClips( successSoundCollection );
    } );

    model.isParallelogramProperty.lazyLink( ( isParallelogram, wasParallelogram ) => {

      // immediately stop playing the maintenance sounds to make room for the failure/success clips
      this.stopPlayingMaintenanceSoundClip();

      if ( isParallelogram ) {
        this.failureSoundClip.stop();
        this.successSoundClip.play();
      }
      else {
        this.successSoundClip.stop();
        this.failureSoundClip.play();
      }
    } );

    model.shapeChangedEmitter.addListener( () => {
      if ( model.isParallelogramProperty.value ) {
        this.startPlayingMaintenanceSoundClip();
      }
    } );
  }

  /**
   * Start playing the sound clips that are related to changing the quadrilateral
   * shape while it remains in parallelogram. This is only played if we are not already
   * playing any other sounds.
   * @private
   */
  startPlayingMaintenanceSoundClip() {
    this.isPlaying = true;
    this.remainingMaintenancePlayTime = 1;

    this.maintenanceSoundClip.setOutputLevel( MAX_OUTPUT_LEVEL );

    // when the model changes while it is a parallelogram, play the
    if (
      !this.maintenanceSoundClip.isPlayingProperty.value &&
      !this.successSoundClip.isPlayingProperty.value &&
      !this.failureSoundClip.isPlayingProperty.value
    ) {
      this.maintenanceSoundClip.play();
    }
  }

  /**
   * Stop playing all SoundClips related to maintaining the parallelogram state
   * while changing the quadrilateral.
   * @private
   */
  stopPlayingMaintenanceSoundClip() {

    this.isPlaying = false;
    this.remainingMaintenancePlayTime = 0;

    this.maintenanceSoundClip.setOutputLevel( 0, 0.1 );

    this.maintenanceSoundClip.stop();
  }

  /**
   * Create new sound clips for the collection of sounds. Not sure which (if any) we will use so to demonstrate
   * to the design team we are creating these options to play with.
   * @private
   *
   * @param {SuccessSoundCollection} successSoundCollection - See QuadrilateralSoundOptionsModel
   */
  createSoundClips( successSoundCollection ) {
    this.disposeSoundClips();

    this.successSoundClip = new SoundClip( successSoundCollection.successSound, {
      initialOutputLevel: MAX_OUTPUT_LEVEL
    } );
    soundManager.addSoundGenerator( this.successSoundClip );

    this.failureSoundClip = new SoundClip( successSoundCollection.failureSound, {
      initialOutputLevel: MAX_OUTPUT_LEVEL
    } );
    soundManager.addSoundGenerator( this.failureSoundClip );

    this.maintenanceSoundClip = new SoundClip( successSoundCollection.maintenanceSound, {
      loop: true,
      initialOutputLevel: MAX_OUTPUT_LEVEL
    } );
    soundManager.addSoundGenerator( this.maintenanceSoundClip );
  }

  /**
   * Dispose SoundClips and remove hem from the audioManager.
   * @private
   */
  disposeSoundClips() {
    if ( this.successSoundClip ) {
      soundManager.removeSoundGenerator( this.successSoundClip );
      this.successSoundClip.dispose();

      this.successSoundClip = null;
    }
    if ( this.failureSoundClip ) {
      soundManager.removeSoundGenerator( this.failureSoundClip );
      this.failureSoundClip.dispose();

      this.failureSoundClip = null;
    }
    if ( this.maintenanceSoundClip ) {
      soundManager.removeSoundGenerator( this.maintenanceSoundClip );
      this.maintenanceSoundClip.dispose();

      this.maintenanceSoundClip = null;
    }
  }

  /**
   * Required by the usage to implement. Maybe create a supertype with this.
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {

    if ( this.isPlaying ) {
      this.remainingMaintenancePlayTime -= dt;

      if ( this.remainingMaintenancePlayTime <= 0 ) {
        this.maintenanceSoundClip.setOutputLevel( 0, 0.1 );

        this.isPlaying = false;
      }
    }
  }

  /**
   * Dispose this SoundView, disposing Soundclips and removing them from the soundManager.
   * @public
   */
  dispose() {
    this.disposeSoundClips();
  }
}

quadrilateral.register( 'SuccessSoundView', SuccessSoundView );
export default SuccessSoundView;

// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralSoundOptionsModel, { SuccessSoundCollection } from '../model/QuadrilateralSoundOptionsModel.js';

const MAX_OUTPUT_LEVEL = 0.2;

class SuccessSoundView {
  private successSoundClip: null | SoundClip;
  private failureSoundClip: null | SoundClip;
  private maintenanceSoundClip: null | SoundClip;

  private readonly disposeSuccessSoundView: () => void;

  private model: QuadrilateralModel;
  private remainingMaintenancePlayTime: number;
  private maintenanceSoundClipPlaying: boolean;

  public constructor( model: QuadrilateralModel, soundOptionsModel: QuadrilateralSoundOptionsModel ) {

    this.model = model;

    // The SoundClips are null until a SuccessSoundFile is selected by the user. There are several to choose
    // from for now while we experiment with different prototypes, but we expect a single design at some point. At
    // that time the SoundClips can be created on construction.
    this.successSoundClip = null;
    this.failureSoundClip = null;
    this.maintenanceSoundClip = null;

    // The amount of time left to continue playing the "maintenance" sounds.
    this.remainingMaintenancePlayTime = 0;

    // Whether the maintenance sound clip is currently playing, so we know whether to decrement the
    // remainingMaintenancePlayTime or stop playing the maintenance sound.
    this.maintenanceSoundClipPlaying = false;

    // link is called eagerly so that we have SoundClips to play in the following listeners
    // @ts-ignore - TODO: How to do
    soundOptionsModel.successSoundFileProperty.link( successSoundFile => {
      const successSoundCollection = QuadrilateralSoundOptionsModel.SUCCESS_SOUND_COLLECTION_MAP.get( successSoundFile );
      this.createSoundClips( successSoundCollection );
    } );

    const isParallelogramListener = ( isParallelogram: boolean ) => {
      assert && assert( this.failureSoundClip, 'SoundClips must be created to play sounds' );
      assert && assert( this.successSoundClip, 'SoundClips must be created to play sounds' );
      const successSoundClip = this.successSoundClip!;
      const failureSoundClip = this.failureSoundClip!;

      // immediately stop playing the maintenance sounds to make room for the failure/success clips
      this.stopPlayingMaintenanceSoundClip();

      if ( isParallelogram ) {
        failureSoundClip.stop();
        successSoundClip.play();
      }
      else {
        successSoundClip.stop();
        failureSoundClip.play();
      }
    };
    model.isParallelogramProperty.lazyLink( isParallelogramListener );

    const vertices = [ model.vertex1, model.vertex2, model.vertex3, model.vertex4 ];
    const shapeListener = () => {

      // The maintenance sounds should only play when more than one vertex is moving at a time.
      // That will be the case when exactly one vertex is pressed. Otherwise, more than one vertex is moving
      // or a side is being dragged, or the shape is changing from some external device. The countObject will
      // have keys `true` and `false`, with values corresponding to the number of vertices that are currently
      // pressed.
      const countObject = _.countBy( vertices, vertex => {
        return vertex.isPressedProperty.value;
      } );

      // If testing equal lengths, the maintenance sound is only played when we stay a parallelogram but
      // maintain equal lengths through the interaction.
      if ( soundOptionsModel.maintenanceSoundRequiresEqualLengthsProperty.value ) {

        // In this mode, we will
        if ( model.isParallelogramProperty.value && countObject.true !== 1 && model.lengthsEqualToSavedProperty.value ) {
          this.startPlayingMaintenanceSoundClip();
        }
        else {
          this.stopPlayingMaintenanceSoundClip();
        }
      }
      else {
        if ( model.isParallelogramProperty.value && countObject.true !== 1 ) {
          this.startPlayingMaintenanceSoundClip();
        }
      }
    };
    model.shapeChangedEmitter.addListener( shapeListener );

    // Whenever a reset is complete (not in progress), stop playing all sound clips immediately.
    const resetNotInProgressListener = ( resetNotInProgress: boolean ) => {
      if ( resetNotInProgress ) {
        this.reset();
      }
    };
    model.resetNotInProgressProperty.link( resetNotInProgressListener );

    this.disposeSuccessSoundView = () => {
      model.shapeChangedEmitter.removeListener( shapeListener );
      model.isParallelogramProperty.unlink( isParallelogramListener );
      model.resetNotInProgressProperty.unlink( resetNotInProgressListener );
    };
  }

  /**
   * Start playing the sound clips that are related to changing the quadrilateral
   * shape while it remains in parallelogram. This is only played if we are not already
   * playing any other sounds.
   * @private
   */
  startPlayingMaintenanceSoundClip() {
    assert && assert( this.maintenanceSoundClip, 'maintenanceSoundClip must be constructed to play' );
    const maintenanceSoundClip = this.maintenanceSoundClip!;

    assert && assert( this.successSoundClip, 'successSoundClip must be constructed to play' );
    const successSoundClip = this.successSoundClip!;

    assert && assert( this.failureSoundClip, 'failureSoundClip must be constructed to play' );
    const failureSoundClip = this.failureSoundClip!;

    this.maintenanceSoundClipPlaying = true;
    this.remainingMaintenancePlayTime = 1;

    maintenanceSoundClip.setOutputLevel( MAX_OUTPUT_LEVEL );

    // when the model changes while it is a parallelogram, play the
    if (
      !maintenanceSoundClip.isPlayingProperty.value &&
      !successSoundClip.isPlayingProperty.value &&
      !failureSoundClip.isPlayingProperty.value
    ) {
      maintenanceSoundClip.play();
    }
  }

  /**
   * Stop playing all SoundClips related to maintaining the parallelogram state
   * while changing the quadrilateral.
   * @private
   */
  stopPlayingMaintenanceSoundClip() {
    assert && assert( this.maintenanceSoundClip, 'maintenanceSoundClip needs to be constructed before stopping play' );
    const maintenanceSoundClip = this.maintenanceSoundClip!;

    this.maintenanceSoundClipPlaying = false;
    this.remainingMaintenancePlayTime = 0;

    maintenanceSoundClip.setOutputLevel( 0, 0.1 );
    maintenanceSoundClip.stop();
  }

  /**
   * Reset this SoundView, stopping all sounds and resetting SoundClips.
   */
  public reset(): void {
    this.stopPlayingMaintenanceSoundClip();
  }

  /**
   * Create new sound clips for the collection of sounds. Not sure which (if any) we will use so to demonstrate
   * to the design team we are creating these options to play with.
   * @private
   *
   * @param {SuccessSoundCollection} successSoundCollection - See QuadrilateralSoundOptionsModel
   */
  createSoundClips( successSoundCollection: SuccessSoundCollection ) {
    this.disposeSoundClips();

    const soundClipOptions = {

      // so that success sounds do not play while reset is in progress
      enableControlProperties: [ this.model.resetNotInProgressProperty ],
      initialOutputLevel: MAX_OUTPUT_LEVEL
    };

    this.successSoundClip = new SoundClip( successSoundCollection.successSound, soundClipOptions );
    soundManager.addSoundGenerator( this.successSoundClip );

    this.failureSoundClip = new SoundClip( successSoundCollection.failureSound, soundClipOptions );
    soundManager.addSoundGenerator( this.failureSoundClip );

    this.maintenanceSoundClip = new SoundClip( successSoundCollection.maintenanceSound, merge( {}, soundClipOptions, {
      loop: true
    } ) );
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
   * @param dt - time step for the animation, in seconds
   */
  step( dt: number ) {
    if ( this.maintenanceSoundClipPlaying ) {
      this.remainingMaintenancePlayTime -= dt;

      if ( this.remainingMaintenancePlayTime <= 0 ) {
        assert && assert( this.maintenanceSoundClip, 'maintenanceSoundClip needs to be created to set output level in step' );
        this.maintenanceSoundClip!.setOutputLevel( 0, 0.1 );
        this.maintenanceSoundClipPlaying = false;
      }
    }
  }

  /**
   * Dispose this SoundView, disposing Soundclips and removing them from the soundManager.
   * @public
   */
  dispose() {
    this.disposeSuccessSoundView();
    this.disposeSoundClips();
  }
}

quadrilateral.register( 'SuccessSoundView', SuccessSoundView );
export default SuccessSoundView;

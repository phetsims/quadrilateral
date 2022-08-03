// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../../phet-core/js/merge.js';
import SoundClip from '../../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../../tambo/js/soundManager.js';
import quadrilateral from '../../../quadrilateral.js';
import QuadrilateralModel from '../../model/QuadrilateralModel.js';
import QuadrilateralSoundOptionsModel, { SoundDesign, SuccessSoundCollection, SuccessSoundFile } from '../../model/QuadrilateralSoundOptionsModel.js';
import ShapeIdentificationSoundView from './ShapeIdentificationSoundView.js';

const MAX_OUTPUT_LEVEL = 0.2;

// In seconds - after lengths are no longer equal to saved side lengths we have lost the "success" case
// for maintaining a parallelogram while keeping sides equal. We will wait this long before
const DELAY_FOR_MAINTENANCE_SOUND = 1.5;

// The delay between when the "in parallelogram" sound plays and the "maintenance" sound plays, when moving
// more than one vertex at a time. We want a little delay between the "maintenance" and "in parallelogram" sound
// so that we don't immediately start playing the "maintenance" sound when we enter parallelogram.
// NOTE: Another solution for this would be to only play the maintenance sound when we detect that two vertices
// are moving at the same time. "pressed" state is not enough, they both have to actually be moving. I think we need
// a Vertex velocityProperty for this. If we implement a velocity this delay can be removed, and we can improve
// the sound implementation.
const SUCCESS_MAINTENANCE_SOUND_DELAY = 0.5;

class SuccessSoundView {

  // The SoundClips are null until a SuccessSoundFile is selected by the user. There are several to choose
  // from for now while we experiment with different prototypes, but we expect a single design at some point. At
  // that time the SoundClips can be created on construction.
  private successSoundClip: null | SoundClip = null;
  private failureSoundClip: null | SoundClip = null;
  private maintenanceSoundClip: null | SoundClip = null;

  // A sound that plays specifically with the "Maintenance Sound" design paradigm. With this design,
  // the maintenanceSoundClip is played when the shape changes keeping a parallelogram and the
  // lengthMaintenanceSoundClip plays when changing the shape such that the parallelogram stays a parallelogram
  // AND has non-changing sides. In this paradigm this sound clip is not configurable. We use "Collection one" for
  // maintaining parallelogram adn "Collection four" for maintaining lengths.
  private lengthMaintenanceSoundClip: null | SoundClip = null;

  // Whether or not the length maintenance clip is currently playing, so we know whether to decrement the
  // counting variables for it.
  private lengthMaintenanceSoundClipPlaying = false;

  // The amount of time left to continue playing the "maintenance" sounds.
  private remainingLengthMaintenancePlayTime = 0;

  private readonly disposeSuccessSoundView: () => void;

  private model: QuadrilateralModel;

  // Amount of time left for the maintenance sound to play.
  private remainingMaintenancePlayTime = 0;

  // Whether the maintenance sound clip is currently playing, so we know whether to decrement the
  // remainingMaintenancePlayTime or stop playing the maintenance sound.
  private maintenanceSoundClipPlaying = true;

  // Amount of time that has passed in ms since the success sound played.
  private timeSinceSuccessSound = 0;

  // Amount of time remaining for the delay between playing the 'maintenance' sounds.
  private remainingDelayForMaintenanceSound = 0;

  // The sound view that plays an indication sound when we detect a new named shape
  private readonly shapeIdentificationSound: ShapeIdentificationSoundView;

  public constructor( model: QuadrilateralModel, soundOptionsModel: QuadrilateralSoundOptionsModel ) {
    this.model = model;
    const shapeModel = model.quadrilateralShapeModel;

    this.shapeIdentificationSound = new ShapeIdentificationSoundView( shapeModel, model.resetNotInProgressProperty, model.shapeIdentificationFeedbackEnabledProperty );

    // link is called eagerly so that we have SoundClips to play in the following listeners
    soundOptionsModel.successSoundFileProperty.link( successSoundFile => {
      const successSoundCollection = QuadrilateralSoundOptionsModel.SUCCESS_SOUND_COLLECTION_MAP.get( successSoundFile );

      assert && assert( successSoundCollection, 'No sound collection found for successSoundFile' );
      this.createSoundClips( successSoundCollection! );
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

        this.timeSinceSuccessSound = 0;
      }
      else {
        successSoundClip.stop();
        failureSoundClip.play();
      }
    };
    shapeModel.isParallelogramProperty.lazyLink( isParallelogramListener );

    const shapeListener = () => {

      // The maintenance sounds should only play when more than one vertex is moving at a time.
      // That will be the case when exactly one vertex is pressed. Otherwise, more than one vertex is moving
      // or a side is being dragged, or the shape is changing from some external device. The countObject will
      // have keys `true` and `false`, with values corresponding to the number of vertices that are currently
      // pressed.
      const countObject = _.countBy( shapeModel.vertices, vertex => {
        return vertex.isPressedProperty.value;
      } );

      // Condition to play a sound indicating that the shape is changing while quadrilateral side lengths do not change
      const lengthMaintenanceCondition = shapeModel.isParallelogramProperty.value &&
                                         countObject.true !== 1 && // don't play this sound when only moving a single vertex
                                         shapeModel.lengthsEqualToSavedProperty.value && // lengths must be remaining constant during interaction
                                         !shapeModel.anglesEqualToSavedProperty.value && // the angles must have changed from the angles saved when side lengths changed
                                         this.remainingDelayForMaintenanceSound < 0; // Must be moving for a certain amount of time to demonstrate dedicated movement

      if ( soundOptionsModel.maintenanceSoundRequiresEqualLengthsProperty.value ) {

        // If testing equal lengths, the maintenance sound is only played when we stay a parallelogram but
        // maintain equal lengths through the interaction.
        if ( lengthMaintenanceCondition ) {
          this.startPlayingMaintenanceSoundClip();
        }
        else {
          this.stopPlayingMaintenanceSoundClip();
        }
      }
      else if ( soundOptionsModel.soundDesignProperty.value === SoundDesign.MAINTENANCE_SOUNDS ) {

        // in this design we play the maintenance sound if we are in parallelogram and the lengthMaintenanceSoundClip
        // if we are maintaining equal lengths
        if ( lengthMaintenanceCondition ) {
          this.startPlayingLengthMaintenanceSoundClip();
          this.stopPlayingMaintenanceSoundClip();
        }
        else if ( shapeModel.isParallelogramProperty.value && countObject.true !== 1 ) {
          this.startPlayingMaintenanceSoundClip();
          this.stopPlayingLengthMaintenanceSoundClip();
        }
        else {
          this.stopPlayingMaintenanceSoundClip();
          this.stopPlayingLengthMaintenanceSoundClip();
        }
      }
      else {
        if ( shapeModel.isParallelogramProperty.value && countObject.true !== 1 ) {
          this.startPlayingMaintenanceSoundClip();
        }
      }
    };
    shapeModel.shapeChangedEmitter.addListener( shapeListener );

    // for when the maintenance sound requires constant lenghts (maintenanceSoundRequiresEqualLengthsProperty) -
    // reset the delay timing variable when we are no longer in the range of saved values.
    shapeModel.lengthsEqualToSavedProperty.link( equalToSaved => {
      if ( !equalToSaved ) {
        this.remainingDelayForMaintenanceSound = DELAY_FOR_MAINTENANCE_SOUND;
      }
    } );

    // Whenever a reset is complete (not in progress), stop playing all sound clips immediately.
    const resetNotInProgressListener = ( resetNotInProgress: boolean ) => {
      if ( resetNotInProgress ) {
        this.reset();
      }
    };
    model.resetNotInProgressProperty.link( resetNotInProgressListener );

    this.disposeSuccessSoundView = () => {
      shapeModel.shapeChangedEmitter.removeListener( shapeListener );
      shapeModel.isParallelogramProperty.unlink( isParallelogramListener );
      model.resetNotInProgressProperty.unlink( resetNotInProgressListener );
    };
  }

  /**
   * Start playing the sound clips that are related to changing the quadrilateral
   * shape while it remains in parallelogram. This is only played if we are not already
   * playing any other sounds.
   */
  private startPlayingMaintenanceSoundClip(): void {
    assert && assert( this.maintenanceSoundClip, 'maintenanceSoundClip must be constructed to play' );
    const maintenanceSoundClip = this.maintenanceSoundClip!;

    assert && assert( this.lengthMaintenanceSoundClip, 'lengthMaintenanceSoundClip must be constructed to play' );
    const lengthMaintenanceSoundClip = this.lengthMaintenanceSoundClip!;

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
      this.timeSinceSuccessSound > SUCCESS_MAINTENANCE_SOUND_DELAY &&
      !failureSoundClip.isPlayingProperty.value
    ) {

      // stop playing the "success" sound if we start playing the "maintenance" sound immediately after
      // reaching parallelogram
      successSoundClip.stop();

      // stop playing the "length" maintenance sound since we are playing this sound clip isntead
      lengthMaintenanceSoundClip.stop();

      maintenanceSoundClip.play();
    }
  }

  /**
   * Start playing the sound clip for the maintining quadrilateral side lengths while also maintaining
   * parallelogram.
   */
  private startPlayingLengthMaintenanceSoundClip(): void {
    assert && assert( this.maintenanceSoundClip, 'maintenanceSoundClip must be constructed to play' );
    const maintenanceSoundClip = this.maintenanceSoundClip!;

    assert && assert( this.lengthMaintenanceSoundClip, 'lengthMaintenanceSoundClip must be constructed to play' );
    const lengthMaintenanceSoundClip = this.lengthMaintenanceSoundClip!;

    assert && assert( this.successSoundClip, 'successSoundClip must be constructed to play' );
    const successSoundClip = this.successSoundClip!;

    assert && assert( this.failureSoundClip, 'failureSoundClip must be constructed to play' );
    const failureSoundClip = this.failureSoundClip!;

    this.lengthMaintenanceSoundClipPlaying = true;
    this.remainingLengthMaintenancePlayTime = 1;

    lengthMaintenanceSoundClip.setOutputLevel( MAX_OUTPUT_LEVEL );

    if (
      !lengthMaintenanceSoundClip.isPlayingProperty.value &&
      this.timeSinceSuccessSound > SUCCESS_MAINTENANCE_SOUND_DELAY &&
      !failureSoundClip.isPlayingProperty.value
    ) {

      // stop playing the "success" sound if we start playing the "maintenance" sound immediately after
      // reaching parallelogram
      successSoundClip.stop();

      // stop playing the "maintenance" sound since we are playing the length maintenance sound instead
      maintenanceSoundClip.stop();

      lengthMaintenanceSoundClip.play();
    }
  }

  /**
   * Stop playing all SoundClips related to maintaining the parallelogram state
   * while changing the quadrilateral.
   */
  private stopPlayingMaintenanceSoundClip(): void {
    assert && assert( this.maintenanceSoundClip, 'maintenanceSoundClip needs to be constructed before stopping play' );
    const maintenanceSoundClip = this.maintenanceSoundClip!;

    this.maintenanceSoundClipPlaying = false;
    this.remainingMaintenancePlayTime = 0;

    maintenanceSoundClip.setOutputLevel( 0, 0.1 );
    maintenanceSoundClip.stop();
  }

  /**
   * Stop playing sounds related to the "length" maintenance with the Maintenance sound design.
   */
  private stopPlayingLengthMaintenanceSoundClip(): void {
    assert && assert( this.lengthMaintenanceSoundClip, 'lengthMaintenanceSoundClip needs to be constructed before stopping play' );
    const lengthMaintenanceSoundClip = this.lengthMaintenanceSoundClip!;

    this.lengthMaintenanceSoundClipPlaying = false;
    this.remainingLengthMaintenancePlayTime = 0;

    lengthMaintenanceSoundClip.setOutputLevel( 0, 0.1 );
    lengthMaintenanceSoundClip.stop();
  }

  /**
   * Reset this SoundView, stopping all sounds and resetting SoundClips.
   */
  public reset(): void {
    this.stopPlayingMaintenanceSoundClip();
    this.stopPlayingLengthMaintenanceSoundClip();
  }

  /**
   * Create new sound clips for the collection of sounds. Not sure which (if any) we will use so to demonstrate
   * to the design team we are creating these options to play with.
   *
   * @param successSoundCollection - See QuadrilateralSoundOptionsModel
   */
  private createSoundClips( successSoundCollection: SuccessSoundCollection ): void {
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

    assert && assert( QuadrilateralSoundOptionsModel.SUCCESS_SOUND_COLLECTION_MAP.get( SuccessSoundFile.FOUR ), 'maintenance sound design assumes that SuccessSoundFile.FOUR is available ' );
    this.lengthMaintenanceSoundClip = new SoundClip( QuadrilateralSoundOptionsModel.SUCCESS_SOUND_COLLECTION_MAP.get( SuccessSoundFile.FOUR )!.maintenanceSound, merge( {}, soundClipOptions, {
      loop: true
    } ) );
    soundManager.addSoundGenerator( this.lengthMaintenanceSoundClip );
  }

  /**
   * Dispose SoundClips and remove hem from the audioManager.
   */
  private disposeSoundClips(): void {
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
    if ( this.lengthMaintenanceSoundClip ) {
      this.lengthMaintenanceSoundClip.dispose();

      this.lengthMaintenanceSoundClip = null;
    }
  }

  /**
   * Required by the usage to implement. Maybe create a supertype with this.
   *
   * @param dt - time step for the animation, in seconds
   */
  public step( dt: number ): void {
    this.remainingDelayForMaintenanceSound -= dt;

    this.timeSinceSuccessSound += dt;

    if ( this.maintenanceSoundClipPlaying ) {
      this.remainingMaintenancePlayTime -= dt;

      if ( this.remainingMaintenancePlayTime <= 0 ) {
        assert && assert( this.maintenanceSoundClip, 'maintenanceSoundClip needs to be created to set output level in step' );
        this.maintenanceSoundClip!.setOutputLevel( 0, 0.1 );
        this.maintenanceSoundClipPlaying = false;
      }
    }
    if ( this.lengthMaintenanceSoundClipPlaying ) {
      this.remainingLengthMaintenancePlayTime -= dt;

      if ( this.remainingLengthMaintenancePlayTime <= 0 ) {
        assert && assert( this.lengthMaintenanceSoundClip, 'lengthMaintenanceSoundClip needs to be created to set output level in step' );
        this.lengthMaintenanceSoundClip!.setOutputLevel( 0, 0.1 );
        this.lengthMaintenanceSoundClipPlaying = false;
      }
    }
  }

  /**
   * Dispose this SoundView, disposing Soundclips and removing them from the soundManager.
   */
  public dispose(): void {
    this.shapeIdentificationSound.dispose();

    this.disposeSuccessSoundView();
    this.disposeSoundClips();
  }
}

quadrilateral.register( 'SuccessSoundView', SuccessSoundView );
export default SuccessSoundView;

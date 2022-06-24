// Copyright 2021-2022, University of Colorado Boulder

/**
 * A class that implements the "Parallels Volume" sound design. In this prototype there are two sounds that
 * can play simultaneously. One sound is played while a pair of sides is parallel. As a pair of sides become
 * out of parallel the sound fades out to silence. A base sound is used to produce sound with a SoundClip and
 * the playback rate is modified so the sounds are off by a fifth to sound pleasing and to distinguish the pairs
 * of parallel sides.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import SoundClipChord from '../../../../tambo/js/sound-generators/SoundClipChord.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralSoundOptionsModel, { SuccessSoundFile } from '../model/QuadrilateralSoundOptionsModel.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';
import ParallelSideChecker from '../model/ParallelSideChecker.js';

// Maps the difference in tilt between pairs of sides to output level. When tilt is equal difference will be zero
// and sound will play at highest output level. Fades out as difference grows, and eventually goes silent.
const PARALLEL_PROXIMITY_TO_OUTPUT_LEVEL = new LinearFunction( 0, Math.PI / 2, 0.5, 0, true );

class ParallelsVolumeSoundView {
  private model: QuadrilateralModel;
  private leftRightSideGenerator: null | SoundClipChord;
  private topBottomSideGenerator: null | SoundClipChord;

  // References to the listeners that will be used to start/stop or change the parameters of SoundClips depending
  // on the state of the model. Saved for dispose.
  private leftRightTiltListener: ( () => void ) | null = null;
  private topBottomTiltListener: ( () => void ) | null = null;

  private leftRightSideOutputLevel: number;
  private topBottomSideOutputLevel: number;
  private isPlaying: boolean;
  private remainingPlayTime: number;
  private readonly disposeParallelsVolumeSoundView: () => void;

  public constructor( model: QuadrilateralModel, soundOptionsModel: QuadrilateralSoundOptionsModel ) {
    this.model = model;

    // SoundGenerators that play sounds for each set of sides.
    this.leftRightSideGenerator = null;
    this.topBottomSideGenerator = null;

    // Ouptut levels (volume) for the sounds associated with each SoundClip.
    this.leftRightSideOutputLevel = 0;
    this.topBottomSideOutputLevel = 0;

    // Are any sounds of this SoundView playing?
    this.isPlaying = true;

    // Remaining time to play sound clips since we will fade out.
    this.remainingPlayTime = 0;

    const createSoundClipsListener = ( soundFile: SuccessSoundFile ) => {
      const audioBuffer = QuadrilateralSoundOptionsModel.AUDIO_BUFFER_MAP.get( soundFile );

      assert && assert( audioBuffer, 'No WrappedAudioBuffer found for soundFile' );
      this.createSoundClips( audioBuffer! );
    };
    soundOptionsModel.baseSoundFileProperty.link( createSoundClipsListener );

    const shapeChangeListener = () => {
      this.isPlaying = true;
      this.remainingPlayTime = 2;

      if ( this.leftRightSideGenerator && this.topBottomSideGenerator ) {
        if ( this.leftRightSideGenerator && !this.leftRightSideGenerator.isPlayingProperty.value ) {

          // the time constant fades in a bit so that it isn't harsh
          this.leftRightSideGenerator.setOutputLevel( this.leftRightSideOutputLevel / 2 );
          this.leftRightSideGenerator.play();
          this.leftRightSideGenerator.setOutputLevel( this.leftRightSideOutputLevel, 0.3 );
        }

        if ( this.topBottomSideGenerator && !this.topBottomSideGenerator.isPlayingProperty.value ) {

          // the time constant fades in a bit so that it isn't harsh
          this.topBottomSideGenerator.setOutputLevel( this.topBottomSideOutputLevel / 2 );
          this.topBottomSideGenerator.play();
          this.topBottomSideGenerator.setOutputLevel( this.topBottomSideOutputLevel, 0.3 );
        }
      }
    };
    this.model.quadrilateralShapeModel.shapeChangedEmitter.addListener( shapeChangeListener );

    // make sure that sounds do not start playing again after the changes detected by reset
    const resetListener = ( resetNotInProgress: boolean ) => {
      if ( resetNotInProgress ) {
        this.stopSounds();
      }
    };
    this.model.resetNotInProgressProperty.link( resetListener );

    this.disposeParallelsVolumeSoundView = () => {
      this.model.quadrilateralShapeModel.shapeChangedEmitter.removeListener( shapeChangeListener );
      soundOptionsModel.baseSoundFileProperty.unlink( createSoundClipsListener );
      this.model.resetNotInProgressProperty.unlink( resetListener );
    };
  }

  /**
   * Dispose the SoundClips, removing them from the soundManager.
   */
  private disposeSoundClips(): void {

    if ( this.leftRightSideGenerator ) {
      assert && assert( this.leftRightTiltListener, 'The multilink must be established before we dispose of it.' );

      soundManager.removeSoundGenerator( this.leftRightSideGenerator );
      this.leftRightSideGenerator.dispose();

      this.model.quadrilateralShapeModel.shapeChangedEmitter.removeListener( this.leftRightTiltListener! );
      this.leftRightTiltListener = null;
    }
    if ( this.topBottomSideGenerator ) {
      assert && assert( this.topBottomTiltListener, 'The multilink must be established before we dispose of it.' );

      soundManager.removeSoundGenerator( this.topBottomSideGenerator );
      this.topBottomSideGenerator.dispose();

      this.model.quadrilateralShapeModel.shapeChangedEmitter.removeListener( this.topBottomTiltListener! );
      this.topBottomTiltListener = null;
    }
  }

  /**
   * Dispose this sound view.
   */
  public dispose(): void {
    this.disposeSoundClips();
    this.disposeParallelsVolumeSoundView();
  }

  /**
   * Immediately stops all playing sounds.
   */
  public stopSounds(): void {
    this.leftRightSideGenerator!.setOutputLevel( 0 );
    this.topBottomSideGenerator!.setOutputLevel( 0 );

    this.isPlaying = false;
    this.remainingPlayTime = 0;
  }

  /**
   * Create new SoundClips for the audioBuffer. Only necessary because we are playing around with different "base"
   * sounds for this prototype.
   */
  private createSoundClips( audioBuffer: WrappedAudioBuffer ): void {

    this.disposeSoundClips();

    this.leftRightSideGenerator = new SoundClipChord( audioBuffer, {
      enableControlProperties: [ this.model.resetNotInProgressProperty ],
      soundClipOptions: {
        loop: true,
        enableControlProperties: [ this.model.resetNotInProgressProperty ]
      },
      chordPlaybackRates: [ 1, 4 ]
    } );
    this.topBottomSideGenerator = new SoundClipChord( audioBuffer, {
      enableControlProperties: [ this.model.resetNotInProgressProperty ],
      chordPlaybackRates: [ Math.pow( 2, 7 / 12 ), Math.pow( 2, 19 / 12 ) ],
      soundClipOptions: {
        loop: true,
        enableControlProperties: [ this.model.resetNotInProgressProperty ]
      }
    } );

    this.leftRightSideGenerator.setOutputLevel( 0 );
    this.topBottomSideGenerator.setOutputLevel( 0 );

    const shapeModel = this.model.quadrilateralShapeModel;

    this.leftRightTiltListener = this.createTiltListener( shapeModel.sideBCSideDAParallelSideChecker, outputLevel => {
      this.leftRightSideOutputLevel = outputLevel;
      this.leftRightSideGenerator!.outputLevel = outputLevel;
    } );
    shapeModel.shapeChangedEmitter.addListener( this.leftRightTiltListener );

    this.topBottomTiltListener = this.createTiltListener( shapeModel.sideABSideCDParallelSideChecker, outputLevel => {
      this.topBottomSideOutputLevel = outputLevel;
      this.topBottomSideGenerator!.outputLevel = outputLevel;
    } );
    shapeModel.shapeChangedEmitter.addListener( this.topBottomTiltListener );

    soundManager.addSoundGenerator( this.leftRightSideGenerator );
    soundManager.addSoundGenerator( this.topBottomSideGenerator );
  }

  /**
   * Step this sound view.
   */
  public step( dt: number ): void {

    if ( this.isPlaying ) {
      this.remainingPlayTime -= dt;

      if ( this.remainingPlayTime <= 0 ) {
        assert && assert( this.leftRightSideGenerator, 'A SoundGenerator for the left/right side is missing in step' );
        assert && assert( this.topBottomSideGenerator, 'A SoundGenerator for the left/right side is missing in step' );

        this.leftRightSideGenerator!.setOutputLevel( 0, 0.1 );
        this.topBottomSideGenerator!.setOutputLevel( 0, 0.1 );

        this.isPlaying = false;
      }
    }
  }

  /**
   * Creates and returns (for disposal) a listener that sets the output level of a SoundGenerator from the proximity
   * to parallel for two sides.
   */
  private createTiltListener( parallelSideChecker: ParallelSideChecker, applyOutputLevel: ( outputLevel: number ) => void ): ( () => void ) {
    return () => {
      let outputLevel = 0;
      if ( !parallelSideChecker.areSidesParallel() ) {
        outputLevel = PARALLEL_PROXIMITY_TO_OUTPUT_LEVEL.evaluate( parallelSideChecker.getProximityToParallelValue() );
      }

      applyOutputLevel( outputLevel );
    };
  }
}

quadrilateral.register( 'ParallelsVolumeSoundView', ParallelsVolumeSoundView );
export default ParallelsVolumeSoundView;

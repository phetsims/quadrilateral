// Copyright 2021, University of Colorado Boulder

/**
 * A class that implements the "Parallels Volume" sound design. In this prototype there are two sounds that
 * can play simultaneously. One sound is played while a pair of sides is parallel. As a pair of sides become
 * out of parallel the sound fades out to silence. A base sound is used to produce sound with a SoundClip and
 * the playback rate is modified so the sounds are off by a fifth to sound pleasing and to distinguish the pairs
 * of parallel sides.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import SoundClipChord from '../../../../tambo/js/sound-generators/SoundClipChord.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';

// Maps the difference in tilt between pairs of sides to output level. When tilt is equal difference will be zero
// and sound will play at highest output level. Fades out as difference grows, and eventually goes silent.
const TILT_DIFFERENCE_TO_OUTPUT_LEVEL = new LinearFunction( 0, 0.5, 0.5, 0, true );

class ParallelsVolumeSoundView {

  /**
   * @param {QuadrilateralModel} model
   * @param {QuadrilateralSoundOptionsModel} soundOptionsModel
   */
  constructor( model, soundOptionsModel ) {

    // @private {QuadrilateralModel}
    this.model = model;

    // @private {SoundGenerator} - SoundGenerators that play sounds for each set of sides.
    this.leftRightSideGenerator = null;
    this.topBottomSideGenerator = null;

    // @private {MultiLink}
    this.leftRightSideMultilink = null;
    this.topBottomSideMultilink = null;

    this.leftRightSideOutputLevel = 0;
    this.topBottomSideOutputLevel = 0;

    this.isPlaying = true;
    this.remainingPlayTime = 0;

    const createSoundClipsListener = soundFile => {
      const audioBuffer = QuadrilateralSoundOptionsModel.AUDIO_BUFFER_MAP.get( soundFile );
      this.createSoundClips( audioBuffer );
    };
    soundOptionsModel.baseSoundFileProperty.link( createSoundClipsListener );

    const shapeChangeListener = () => {
      this.isPlaying = true;
      this.remainingPlayTime = 2;

      if ( this.leftRightSideGenerator && !this.leftRightSideGenerator.isPlayingProperty.value ) {

        // the time constant fades in a bit so that it isn't harsh
        this.leftRightSideGenerator.setOutputLevel( this.leftRightSideOutputLevel / 2 );
        this.leftRightSideGenerator.play();
        this.leftRightSideGenerator.setOutputLevel( this.leftRightSideOutputLevel, 0.3 );
      }

      if ( this.topBottomSideGenerator && !this.topBottomSideGenerator.isPlayingProperty.value ) {

        // the time constant fades in a bit so that it isn't harsh
        this.leftRightSideGenerator.setOutputLevel( this.topBottomSideOutputLevel / 2 );
        this.topBottomSideGenerator.play();
        this.topBottomSideGenerator.setOutputLevel( this.topBottomSideOutputLevel, 0.3 );
      }
    };
    this.model.shapeChangedEmitter.addListener( shapeChangeListener );

    this.disposeParallelsVolumeSoundView = () => {
      this.model.shapeChangedEmitter.removeListener( shapeChangeListener );
      soundOptionsModel.baseSoundFileProperty.unlink( createSoundClipsListener );
    };
  }

  /**
   * Dispose the SoundClips, removing them from the soundManager.
   * @private
   */
  disposeSoundClips() {

    if ( this.leftRightSideGenerator ) {
      soundManager.removeSoundGenerator( this.leftRightSideGenerator );
      this.leftRightSideGenerator.dispose();

      Property.unmultilink( this.leftRightSideMultilink );
    }
    if ( this.topBottomSideGenerator ) {
      soundManager.removeSoundGenerator( this.topBottomSideGenerator );
      this.topBottomSideGenerator.dispose();

      Property.unmultilink( this.topBottomSideMultilink );
    }
  }

  /**
   * Dispose this sound view.
   * @public
   */
  dispose() {
    this.disposeSoundClips();
    this.disposeParallelsVolumeSoundView();
  }

  /**
   * Immediately stops all playing sounds.
   * @public
   */
  stopSounds() {
    this.leftRightSideGenerator.setOutputLevel( 0 );
    this.leftRightSideGenerator.setOutputLevel( 0 );

    this.isPlaying = false;
    this.remainingPlayTime = 0;
  }

  /**
   * Create new SoundClips for the audioBuffer. Only necessary because we are playing around with different "base"
   * sounds for this prototype.
   * @private
   *
   * @param {*} audioBuffer
   */
  createSoundClips( audioBuffer ) {

    this.disposeSoundClips();

    this.leftRightSideGenerator = new SoundClipChord( audioBuffer, {
      soundClipOptions: {
        loop: true
      },
      chordPlaybackRates: [ 1, 4 ]
    } );
    this.topBottomSideGenerator = new SoundClipChord( audioBuffer, {
      chordPlaybackRates: [ Math.pow( 2, 7 / 12 ), Math.pow( 2, 19 / 12 ) ],
      soundClipOptions: {
        loop: true
      }
    } );

    this.leftRightSideGenerator.setOutputLevel( 0 );
    this.topBottomSideGenerator.setOutputLevel( 0 );

    this.leftRightSideMultilink = this.createTiltMultilink( this.model.leftSide, this.model.rightSide, outputLevel => {
      this.leftRightSideOutputLevel = outputLevel;
      this.leftRightSideGenerator.outputLevel = outputLevel;
    } );
    this.topBottomSideMultilink = this.createTiltMultilink( this.model.topSide, this.model.bottomSide, outputLevel => {
      this.topBottomSideOutputLevel = outputLevel;
      this.topBottomSideGenerator.outputLevel = outputLevel;
    } );

    soundManager.addSoundGenerator( this.leftRightSideGenerator );
    soundManager.addSoundGenerator( this.topBottomSideGenerator );
  }

  /**
   * Step this sound view.
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {

    if ( this.isPlaying ) {
      this.remainingPlayTime -= dt;

      if ( this.remainingPlayTime <= 0 ) {
        this.leftRightSideGenerator.setOutputLevel( 0, 0.1 );
        this.topBottomSideGenerator.setOutputLevel( 0, 0.1 );

        this.isPlaying = false;
      }
    }
  }

  /**
   * Creates and returns (for disposal) a multilink that sets the output level of a SoundGenerator from the
   * difference in tilts of two sides.
   * @public
   *
   * @param {Side} sideA
   * @param {Side} sideB
   * @param {function} applyOutputLevel
   * @returns {Multilink}
   */
  createTiltMultilink( sideA, sideB, applyOutputLevel ) {
    return Property.multilink(
      [ sideA.tiltProperty, sideB.tiltProperty ],
      ( leftTilt, rightTilt ) => {

        const outputLevel = TILT_DIFFERENCE_TO_OUTPUT_LEVEL.evaluate( Math.abs( leftTilt - rightTilt ) );
        applyOutputLevel( outputLevel );
      }
    );
  }
}

quadrilateral.register( 'ParallelsVolumeSoundView', ParallelsVolumeSoundView );
export default ParallelsVolumeSoundView;

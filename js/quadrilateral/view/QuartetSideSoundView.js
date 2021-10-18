// Copyright 2021, University of Colorado Boulder

/**
 * The sound view for a Side of the Parallelogram. The sound design implemented by this file is described as follows:
 *
 * Each Side plays a sound representing its length and tilt. All four sides of the Quadrilateral play at the same
 * time to create a sound representing the shape. The generated sound comes from a base SoundClip which changes
 * in playbackRate
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import PiecewiseLinearFunction from '../../../../dot/js/PiecewiseLinearFunction.js';
import Utils from '../../../../dot/js/Utils.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import quadLoop01Sound from '../../../sounds/quad-loop-01_mp3.js';
import quadLoop02Sound from '../../../sounds/quad-loop-02_mp3.js';
import quadLoop03Sound from '../../../sounds/quad-loop-03_mp3.js';
import quadLoop04Sound from '../../../sounds/quad-loop-04_mp3.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';

// constants
// TODO: calculate these from constants, should be based on the limitations of each vertex bounds
const MIN_LENGTH = 0.10;
const MAX_LENGTH_SQUARE = 2;

// Sound clips will be created between these exponentials, using these values in a function to set the playback
// rate for imported sound clips. The playback rate will will be set by Math.pow( 2, i / 12 ), where i is between
// these values, effectively creating a span of 4 octaves with tones along the chromatic scale.
const MAX_SOUND_CLIP_EXPONENTIAL = 24;
const MIN_SOUND_CLIP_EXPONENTIAL = -24;

// The max possible length of a side is the hypotenuse formed when one vertex is in the outer corner of its bounds
// and the other is at the center point between opposite vertices of the shape
//                     * (outer top)
//                   /
//                  /
//                 /
//(center-bottom) *----O (outer bottom)
const MAX_LENGTH = Math.sqrt( MAX_LENGTH_SQUARE * MAX_LENGTH_SQUARE + ( MAX_LENGTH_SQUARE / 2 ) * ( MAX_LENGTH_SQUARE / 2 ) );

// highest octave is loudest at min length and silent beyond half length
const UPPER_OCTAVE_LENGTH_TO_OUTPUT_LEVEL = new LinearFunction( MIN_LENGTH, MAX_LENGTH / 2, 1, 0, true );

// middle octave is loudest at mid length, and silent at the extremes
const MIDDLE_OCTAVE_LENGTH_TO_OUTPUT_LEVEL = new PiecewiseLinearFunction( [ MIN_LENGTH, 0, MAX_LENGTH / 2, 1, MAX_LENGTH / 2, 1, MAX_LENGTH, 0 ] );

// highest octave is loudest at max length and silent lower than half length
const LOWER_OCTAVE_LENGTH_TO_OUTPUT_LEVEL = new LinearFunction( MAX_LENGTH / 2, MAX_LENGTH, 0, 1, true );

// Maps soundFileProperty to the WrappedAudioBuffer for the SoundClip
const AUDIO_BUFFER_MAP = new Map();
AUDIO_BUFFER_MAP.set( QuadrilateralSoundOptionsModel.QuartetSoundFile.ONE, quadLoop01Sound );
AUDIO_BUFFER_MAP.set( QuadrilateralSoundOptionsModel.QuartetSoundFile.TWO, quadLoop02Sound );
AUDIO_BUFFER_MAP.set( QuadrilateralSoundOptionsModel.QuartetSoundFile.THREE, quadLoop03Sound );
AUDIO_BUFFER_MAP.set( QuadrilateralSoundOptionsModel.QuartetSoundFile.FOUR, quadLoop04Sound );

class QuartetSideSoundView {

  /**
   * @param {Side} side
   * @param {EnumerationProperty} quartetSoundFileProperty
   */
  constructor( side, quartetSoundFileProperty ) {
    this.side = side;

    // @private {Map} - A map that goes from playback rate to the created SoundClipCollection.
    this.playbackRateToSoundClipCollection = new Map();

    // Create sound clips for the chosen sound - while still exploring different sounds we will
    quartetSoundFileProperty.link( selectedSound => {
      this.createSoundClips( selectedSound );
    } );

    // A map that goes between tilt to the value used to calculate playback rate for a particular tilt. Initial value
    // for each side is Math.PI / 2. A value of 0 is fully tilted to the "left" while a value of Math.PI is fully
    // tilted to the right.
    this.tiltToPlaybackExponential = new LinearFunction( 0, Math.PI, MIN_SOUND_CLIP_EXPONENTIAL, MAX_SOUND_CLIP_EXPONENTIAL );

    this.activeSoundClipCollection = null;
  }

  /**
   * Create the sound clips used to represent aspects of the Side.
   * @private
   * @param {SoundFile} soundFile - Enumeration value
   */
  createSoundClips( soundFile ) {

    // remove the previous sound generators
    this.playbackRateToSoundClipCollection.forEach( ( soundClipCollection, playbackRate ) => {
      soundManager.removeSoundGenerator( soundClipCollection );
      soundClipCollection.dispose();
    } );
    this.playbackRateToSoundClipCollection.clear();

    const selectedSound = AUDIO_BUFFER_MAP.get( soundFile );

    for ( let i = MIN_SOUND_CLIP_EXPONENTIAL; i <= MAX_SOUND_CLIP_EXPONENTIAL; i++ ) {
      const playbackRate = Math.pow( 2, i / 12 );
      const soundClipCollection = new SoundClipCollection( selectedSound, playbackRate );

      soundClipCollection.connectClips();
      soundManager.addSoundGenerator( soundClipCollection );

      this.playbackRateToSoundClipCollection.set( playbackRate, soundClipCollection );
    }
  }

  /**
   * Start playing sounds. Works by resetting the amount of time that sounds have been playing so that we will try
   * to start playing sounds in the next animation frame.
   * @public
   */
  startPlayingSounds() {

    const exponential = Utils.roundToInterval( this.tiltToPlaybackExponential( this.side.tiltProperty.value ), 1 );
    const playbackRate = Math.pow( 2, exponential / 12 );

    const newCollection = this.playbackRateToSoundClipCollection.get( playbackRate );
    assert && assert( newCollection !== undefined, 'no new soundClipCollection found' );

    if ( newCollection !== this.activeSoundClipCollection ) {

      // fade out all currently playing clips
      // fade out of all playing sounds clip collections before we start the next one
      this.playbackRateToSoundClipCollection.forEach( ( value, key ) => {
        if ( value !== newCollection ) {
          value.fadeOutClips();
        }
      } );

      newCollection.startPlayingSounds();
      this.activeSoundClipCollection = newCollection;
    }
    else {

      // start playing again without any fade in
      if ( newCollection.playing ) {
        newCollection.resetPlayTime();
      }
      else {

        // playing same clips
        newCollection.startPlayingSounds();
      }
    }

    // set all output levels from length
    this.playbackRateToSoundClipCollection.forEach( value => {
      value.setOutputLevels( this.side.lengthProperty.value );
    } );
  }

  /**
   * Start playing the active SoundClipCollection.
   * @public
   */
  playSoundClips() {
    if ( this.activeSoundClipCollection ) {
      this.activeSoundClipCollection.playSoundClips();
    }
  }

  /**
   * Step the sound view, stopping all of the SoundClipCollections.
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {
    this.playbackRateToSoundClipCollection.forEach( value => {
      value.step( dt );
    } );
  }
}

class SoundClipCollection extends SoundGenerator {

  /**
   * @param {WrappedAudioBuffer} wrappedAudioBuffer
   * @param {number} defaultPlaybackRate - The middle octave playbackRate for this collection. The collection will
   *                                       contain clips with playback rates that are one octave above and one octave
   *                                       below this rate.
   * @param {Object} [options]
   */
  constructor( wrappedAudioBuffer, defaultPlaybackRate, options ) {

    super( options );

    // @private {number} - See constructor
    this.defaultPlaybackRate = defaultPlaybackRate;

    // @private {number} - The length of time that SoundClips will take to fade out and in while playing, in seconds
    this.fadeDuration = 0.35;

    // @private {number} - The rate of fadeout, used to modify the output level in step so that it can go up or down
    // when fading in adn out, in 1 / seconds.
    this.fadeRate = 1 / this.fadeDuration;

    // @private {number} - How long clips play for, in seconds.
    this.playDuration = 2.0;

    // @private {number} - The amount of time remaining for this SoundClipCollection to play.
    this.remainingPlayTime = 0;

    this.clipOutputLevel = 0;

    this.playing = false;

    this.fadingIn = false;
    this.fadingOut = false;

    // maps the amount of time played from 0 to fadeDuration to an output level so the sound fades in and out,
    // but is at full volume while outside of fadeDuration
    this.playTimeToFadeInOutputLevel = new LinearFunction( 0, this.fadeDuration, 0, 1, true );
    this.playTimeToFadeOutOutputLevel = new LinearFunction( this.playDuration - this.fadeDuration, this.playDuration, 1, 0, true );

    this.lowerOctaveClip = new SoundClip( wrappedAudioBuffer, {
      initialPlaybackRate: defaultPlaybackRate * 0.5,
      loop: true
    } );
    this.middleOctaveClip = new SoundClip( wrappedAudioBuffer, {
      initialPlaybackRate: defaultPlaybackRate,
      loop: true
    } );
    this.upperOctaveClip = new SoundClip( wrappedAudioBuffer, {
      initialPlaybackRate: defaultPlaybackRate * 2,
      loop: true
    } );

    this.outputLevelGainNode = phetAudioContext.createGain();
    this.outputLevelGainNode.connect( this.masterGainNode );

    this.anyClipsPlayingProperty = DerivedProperty.or( [
      this.lowerOctaveClip.isPlayingProperty,
      this.middleOctaveClip.isPlayingProperty,
      this.upperOctaveClip.isPlayingProperty
    ] );

    this.connected = false;
  }

  // @private
  playSoundClips() {
    this.lowerOctaveClip.play();
    this.middleOctaveClip.play();
    this.upperOctaveClip.play();
  }

  // @private
  stopSoundClips() {
    this.lowerOctaveClip.stop();
    this.middleOctaveClip.stop();
    this.upperOctaveClip.stop();

    this.playing = false;

    this.fadingIn = false;
    this.fadingOut = false;

    this.remainingPlayTime = 0;
  }

  // @private
  startPlayingSounds() {
    this.playing = true;

    this.fadeInClips();
  }

  // @private
  fadeInClips() {
    this.fadingOut = false;
    this.fadingIn = true;

    this.remainingPlayTime = this.playDuration;
  }

  // @private
  fadeOutClips() {
    this.fadingIn = false;
    this.fadingOut = true;

    this.remainingPlayTime = this.fadeDuration;
  }

  // @private
  resetPlayTime() {
    this.remainingPlayTime = this.playDuration;
  }

  // @private
  step( dt ) {

    if ( this.playing ) {
      this.remainingPlayTime -= dt;

      const fadeDelta = this.fadeRate * dt;
      if ( this.fadingIn ) {

        // increment output level until we are at max
        this.clipOutputLevel = Math.min( this.clipOutputLevel + fadeDelta, 1 );

        if ( this.clipOutputLevel === 1 ) {
          this.fadingIn = false;
        }
      }
      else if ( this.fadingOut ) {
        this.clipOutputLevel = Math.max( this.clipOutputLevel - fadeDelta, 0 );

        // we have gone all the way through a fade out, stop playing clips
        if ( this.clipOutputLevel === 0 ) {
          this.fadingOut = false;
          this.remainingPlayTime = 0;
          this.stopSoundClips();
        }
      }
      this.outputLevelGainNode.gain.value = this.clipOutputLevel;

      // we haven't started playing yet, start now
      if ( !this.anyClipsPlayingProperty.value ) {
        this.playSoundClips();
      }

      // it is time to start fading out
      if ( this.remainingPlayTime < this.fadeDuration ) {
        this.fadeOutClips();
      }
    }
    else if ( this.anyClipsPlayingProperty.value ) {
      this.stopSoundClips();
    }
  }

  // @private
  connectClips() {
    assert && assert( !this.connected, 'testing' );

    this.lowerOctaveClip.connect( this.outputLevelGainNode );
    this.middleOctaveClip.connect( this.outputLevelGainNode );
    this.upperOctaveClip.connect( this.outputLevelGainNode );

    this.connected = true;
  }

  // @private
  disconnectClips() {
    if ( this.connected ) {
      this.lowerOctaveClip.disconnect( this.outputLevelGainNode );
      this.middleOctaveClip.disconnect( this.outputLevelGainNode );
      this.upperOctaveClip.disconnect( this.outputLevelGainNode );
    }

    this.connected = false;
  }

  // @private
  setOutputLevels( length ) {
    this.lowerOctaveClip.setOutputLevel( LOWER_OCTAVE_LENGTH_TO_OUTPUT_LEVEL( length ) );
    this.middleOctaveClip.setOutputLevel( MIDDLE_OCTAVE_LENGTH_TO_OUTPUT_LEVEL.evaluate( length ) );
    this.upperOctaveClip.setOutputLevel( UPPER_OCTAVE_LENGTH_TO_OUTPUT_LEVEL( length ) );
  }

  // @private
  dispose() {
    this.disconnectClips();
    this.lowerOctaveClip.dispose();
    this.middleOctaveClip.dispose();
    this.upperOctaveClip.dispose();

    super.dispose();
  }
}

quadrilateral.register( 'QuartetSideSoundView', QuartetSideSoundView );
export default QuartetSideSoundView;

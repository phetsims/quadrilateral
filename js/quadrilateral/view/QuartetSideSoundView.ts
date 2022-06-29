// Copyright 2021-2022, University of Colorado Boulder

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

// @ts-ignore - TODO: Variable 'phetAudioContext' implicitly has type 'any' in some locations where its type cannot be determined.
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import quadLoop01_mp3 from '../../../sounds/quadLoop01_mp3.js';
import quadLoop02_mp3 from '../../../sounds/quadLoop02_mp3.js';
import quadLoop03_mp3 from '../../../sounds/quadLoop03_mp3.js';
import quadLoop04_mp3 from '../../../sounds/quadLoop04_mp3.js';
import quadrilateral from '../../quadrilateral.js';
import { QuartetSoundFile } from '../model/QuadrilateralSoundOptionsModel.js';
import Side from '../model/Side.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';

// constants
// TODO: calculate these from constants, should be based on the limitations of each vertex bounds
const MIN_LENGTH = 0.10;
const MAX_LENGTH_SQUARE = 2;

// Sound clips will be created between these exponentials, using these values in a function to set the playback
// rate for imported sound clips. The playback rate will be set by Math.pow( 2, i / 12 ), where i is between
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

// Maps QuartetSoundFile to the WrappedAudioBuffer for the SoundClip
const AUDIO_BUFFER_MAP = new Map();
AUDIO_BUFFER_MAP.set( QuartetSoundFile.ONE, quadLoop01_mp3 );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.TWO, quadLoop02_mp3 );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.THREE, quadLoop03_mp3 );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.FOUR, quadLoop04_mp3 );

class QuartetSideSoundView {
  private readonly side: Side;
  private playbackRateToSoundClipCollection: Map<number, SoundClipCollection>;
  private readonly tiltToPlaybackExponential: LinearFunction;
  private activeSoundClipCollection: null | SoundClipCollection;
  private readonly disposeQuartetSideSoundView: () => void;
  private readonly resetNotInProgressProperty: BooleanProperty;

  public constructor( side: Side, resetNotInProgressProperty: BooleanProperty, quartetSoundFileProperty: EnumerationProperty<QuartetSoundFile> ) {
    this.side = side;
    this.resetNotInProgressProperty = resetNotInProgressProperty;

    // A map that goes from playback rate to the created SoundClipCollection.
    this.playbackRateToSoundClipCollection = new Map();

    // TODO: selectedSound is one of SoundFile enumeration, how do we do this?
    const createSoundClipsListener = ( selectedSound: QuartetSoundFile ) => {
      this.createSoundClips( selectedSound );
    };

    // Create sound clips for the chosen sound - while still exploring different sounds we will
    quartetSoundFileProperty.link( createSoundClipsListener );

    const resetListener = ( notInProgress: boolean ) => {
      if ( this.activeSoundClipCollection ) {
        this.activeSoundClipCollection!.stopSoundClips();
      }
    };
    this.resetNotInProgressProperty.link( resetListener );

    // A map that goes between tilt to the value used to calculate playback rate for a particular tilt. Initial value
    // for each side is Math.PI / 2. A value of 0 is fully tilted to the "left" while a value of Math.PI is fully
    // tilted to the right.
    this.tiltToPlaybackExponential = new LinearFunction( 0, Math.PI, MIN_SOUND_CLIP_EXPONENTIAL, MAX_SOUND_CLIP_EXPONENTIAL );

    // The SoundClipCollection that is currently active for the given value of the Side tiltProperty.
    this.activeSoundClipCollection = null;

    this.disposeQuartetSideSoundView = () => {
      this.resetNotInProgressProperty.unlink( resetListener );
      quartetSoundFileProperty.unlink( createSoundClipsListener );
    };
  }

  /**
   * Create the sound clips used to represent aspects of the Side.
   */
  private createSoundClips( soundFile: QuartetSoundFile ): void {

    this.disposeSoundClips();

    const selectedSound = AUDIO_BUFFER_MAP.get( soundFile );

    for ( let i = MIN_SOUND_CLIP_EXPONENTIAL; i <= MAX_SOUND_CLIP_EXPONENTIAL; i++ ) {
      const playbackRate = Math.pow( 2, i / 12 );
      const soundClipCollection = new SoundClipCollection( selectedSound, this.resetNotInProgressProperty, playbackRate );

      soundClipCollection.connectClips();
      soundManager.addSoundGenerator( soundClipCollection );

      this.playbackRateToSoundClipCollection.set( playbackRate, soundClipCollection );
    }
  }

  /**
   * Dispose the active sound clips.
   */
  private disposeSoundClips(): void {

    // remove the previous sound generators
    this.playbackRateToSoundClipCollection.forEach( ( soundClipCollection, playbackRate ) => {
      soundManager.removeSoundGenerator( soundClipCollection );
      soundClipCollection.dispose();
    } );

    this.playbackRateToSoundClipCollection.clear();
  }

  /**
   * Dispose the QuartetSideSoundView by removing SoundClipCollections from the soundManager and dispose them.
   */
  public dispose(): void {
    this.disposeSoundClips();
    this.disposeQuartetSideSoundView();
  }

  /**
   * Start playing sounds. Works by resetting the amount of time that sounds have been playing so that we will try
   * to start playing sounds in the next animation frame.
   */
  public startPlayingSounds(): void {
    assert && assert( this.side.tiltProperty.value !== Number.POSITIVE_INFINITY, 'tilts cannot be infinite in sound design' );
    const exponential = Utils.roundToInterval( this.tiltToPlaybackExponential.evaluate( this.side.tiltProperty.value ), 1 );
    const playbackRate = Math.pow( 2, exponential / 12 );

    const newCollection = this.playbackRateToSoundClipCollection.get( playbackRate ) as SoundClipCollection;
    assert && assert( newCollection !== undefined, 'no new soundClipCollection found' );

    if ( newCollection !== this.activeSoundClipCollection ) {

      // fade out all currently playing clips
      // fade out of all playing sounds clip collections before we start the next one
      this.playbackRateToSoundClipCollection.forEach( ( value, key ) => {
        if ( value !== newCollection ) {
          value.fadeOutClips();
        }
      } );

      newCollection!.startPlayingSounds();
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
   */
  public playSoundClips(): void {
    if ( this.activeSoundClipCollection ) {
      this.activeSoundClipCollection.playSoundClips();
    }
  }

  /**
   * Step the sound view, stopping all of the SoundClipCollections.
   */
  public step( dt: number ): void {
    this.playbackRateToSoundClipCollection.forEach( ( value: SoundClipCollection ) => {
      value.step( dt );
    } );
  }
}

class SoundClipCollection extends SoundGenerator {
  private readonly defaultPlaybackRate: number;
  private readonly fadeDuration: number;
  private readonly fadeRate: number;
  private readonly playDuration: number;
  private remainingPlayTime: number;
  private clipOutputLevel: number;
  public playing: boolean;
  private fadingIn: boolean;
  private fadingOut: boolean;
  private readonly playTimeToFadeInOutputLevel: LinearFunction;
  private readonly playTimeToFadeOutOutputLevel: LinearFunction;
  private readonly lowerOctaveClip: SoundClip;
  private readonly middleOctaveClip: SoundClip;
  private readonly upperOctaveClip: SoundClip;
  private readonly outputLevelGainNode: AudioParam;
  private readonly anyClipsPlayingProperty: IReadOnlyProperty<boolean>;
  private connected: boolean;
  private readonly resetNotInProgressProperty: BooleanProperty;

  /**
   * @param wrappedAudioBuffer
   * @param resetNotInProgressProperty
   * @param defaultPlaybackRate - The middle octave playbackRate for this collection. The collection will
   *                                       contain clips with playback rates that are one octave above and one octave
   *                                       below this rate.
   * @param providedOptions
   */
  public constructor( wrappedAudioBuffer: WrappedAudioBuffer, resetNotInProgressProperty: BooleanProperty, defaultPlaybackRate: number, providedOptions?: SoundGeneratorOptions ) {
    super( providedOptions );

    this.defaultPlaybackRate = defaultPlaybackRate;
    this.resetNotInProgressProperty = resetNotInProgressProperty;

    // The length of time that SoundClips will take to fade out and in while playing, in seconds
    this.fadeDuration = 0.35;

    // The rate of fadeout, used to modify the output level in step so that it can go up or down
    // when fading in adn out, in 1 / seconds.
    this.fadeRate = 1 / this.fadeDuration;

    // How long clips play for, in seconds.
    this.playDuration = 2.0;

    // The amount of time remaining for this SoundClipCollection to play.
    this.remainingPlayTime = 0;

    // The output level for the clip, sill change to fade in (to avoid abrupt changes or browser clipping the output)
    // or fad out (to sound smooth)
    this.clipOutputLevel = 0;

    // Whether the sounds for this sound view are currently playing.
    this.playing = false;

    // Whether or not we are fading in or fading out of continuous sound clips.
    this.fadingIn = false;
    this.fadingOut = false;

    // maps the amount of time played from 0 to fadeDuration to an output level so the sound fades in and out,
    // but is at full volume while outside fadeDuration
    this.playTimeToFadeInOutputLevel = new LinearFunction( 0, this.fadeDuration, 0, 1, true );
    this.playTimeToFadeOutOutputLevel = new LinearFunction( this.playDuration - this.fadeDuration, this.playDuration, 1, 0, true );

    // The octaves of the sound clip, whose volumes are changed to create a composition of sounds representing
    // the state of the side.
    this.lowerOctaveClip = new SoundClip( wrappedAudioBuffer, {
      initialPlaybackRate: defaultPlaybackRate * 0.5,
      enableControlProperties: [ this.resetNotInProgressProperty ],
      loop: true
    } );
    this.middleOctaveClip = new SoundClip( wrappedAudioBuffer, {
      initialPlaybackRate: defaultPlaybackRate,
      enableControlProperties: [ this.resetNotInProgressProperty ],
      loop: true
    } );
    this.upperOctaveClip = new SoundClip( wrappedAudioBuffer, {
      initialPlaybackRate: defaultPlaybackRate * 2,
      enableControlProperties: [ this.resetNotInProgressProperty ],
      loop: true
    } );

    // The GainNode that will control the volume for all sounds of this SoundView collectively.
    // @ts-ignore - TODO: How to do phetAudioContext for TypeScript?
    this.outputLevelGainNode = phetAudioContext.createGain();

    // @ts-ignore - TODO: How to do phetAudioContext for TypeScript?
    this.outputLevelGainNode.connect( this.masterGainNode );

    this.anyClipsPlayingProperty = DerivedProperty.or( [
      this.lowerOctaveClip.isPlayingProperty,
      this.middleOctaveClip.isPlayingProperty,
      this.upperOctaveClip.isPlayingProperty
    ] );

    this.connected = false;
  }

  /**
   * Start playing SoundClips for all octaves. Octaves may or may not be heard depending on tilt, but that is
   * controlled by output level.
   */
  public playSoundClips(): void {
    this.lowerOctaveClip.play();
    this.middleOctaveClip.play();
    this.upperOctaveClip.play();
  }

  /**
   * Stop playing all SoundClips immediately.
   */
  public stopSoundClips(): void {
    this.lowerOctaveClip.stop();
    this.middleOctaveClip.stop();
    this.upperOctaveClip.stop();

    this.playing = false;

    this.fadingIn = false;
    this.fadingOut = false;

    this.remainingPlayTime = 0;
  }

  /**
   * Start playing SoundClips, fading them in.
   */
  public startPlayingSounds(): void {
    this.playing = true;

    this.fadeInClips();
  }

  /**
   * Fade in the SoundClips, starting play for full duration.
   */
  public fadeInClips(): void {
    this.fadingOut = false;
    this.fadingIn = true;

    this.remainingPlayTime = this.playDuration;
  }

  /**
   * Fade out the SoundClips, ending their play after the fadeDuration.
   */
  public fadeOutClips(): void {
    this.fadingIn = false;
    this.fadingOut = true;

    this.remainingPlayTime = this.fadeDuration;
  }

  /**
   * Reset the remaining play time such that sound will continue to play for the full duration again.
   */
  public resetPlayTime(): void {
    this.remainingPlayTime = this.playDuration;
  }

  /**
   * Step the SoundView, fading in or fading out of the playing sounds.
   */
  public step( dt: number ): void {

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

      // @ts-ignore - TODO: How to do phetAudioContext, see https://github.com/phetsims/quadrilateral/issues/27
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

  public connectClips(): void {
    assert && assert( !this.connected, 'Cannot connect clips to an audio context if already connected.' );

    this.lowerOctaveClip.connect( this.outputLevelGainNode );
    this.middleOctaveClip.connect( this.outputLevelGainNode );
    this.upperOctaveClip.connect( this.outputLevelGainNode );

    this.connected = true;
  }

  public disconnectClips(): void {
    if ( this.connected ) {
      this.lowerOctaveClip.disconnect( this.outputLevelGainNode );
      this.middleOctaveClip.disconnect( this.outputLevelGainNode );
      this.upperOctaveClip.disconnect( this.outputLevelGainNode );
    }

    this.connected = false;
  }

  /**
   * Set output levels for the various octave SoundCLips
   */
  public setOutputLevels( length: number ): void {

    // outside the bounds of the piecewise functions, just use the lowest octave for long lengths for now
    if ( length > MAX_LENGTH ) {
      this.lowerOctaveClip.setOutputLevel( 1 );
      this.middleOctaveClip.setOutputLevel( 0 );
      this.upperOctaveClip.setOutputLevel( 0 );
    }
    else {
      this.lowerOctaveClip.setOutputLevel( LOWER_OCTAVE_LENGTH_TO_OUTPUT_LEVEL.evaluate( length ) );
      this.middleOctaveClip.setOutputLevel( MIDDLE_OCTAVE_LENGTH_TO_OUTPUT_LEVEL.evaluate( length ) );
      this.upperOctaveClip.setOutputLevel( UPPER_OCTAVE_LENGTH_TO_OUTPUT_LEVEL.evaluate( length ) );
    }
  }

  public override dispose(): void {
    this.disconnectClips();
    this.lowerOctaveClip.dispose();
    this.middleOctaveClip.dispose();
    this.upperOctaveClip.dispose();

    super.dispose();
  }
}

quadrilateral.register( 'QuartetSideSoundView', QuartetSideSoundView );
export default QuartetSideSoundView;

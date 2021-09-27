// Copyright 2021, University of Colorado Boulder

/**
 * The sound view for a Side of the Parallelogram.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import PiecewiseLinearFunction from '../../../../dot/js/PiecewiseLinearFunction.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import quadLoop01Sound from '../../../sounds/quad-loop-01_mp3.js';
import quadLoop02Sound from '../../../sounds/quad-loop-02_mp3.js';
import quadLoop03Sound from '../../../sounds/quad-loop-03_mp3.js';
import quadLoop04Sound from '../../../sounds/quad-loop-04_mp3.js';
import soundFileProperty from '../../common/soundFileProperty.js';
import quadrilateral from '../../quadrilateral.js';

// constants
// TODO: calculate these from constants, should be based on the limitations of each vertex bounds
const MIN_LENGTH = 0.10;
const MAX_LENGTH_SQUARE = 2;

// the max possible length of a side in the hypotenuse formed when one vertex is in the outer corner of its bounds
// and the other is at the center point between oposite vertices of the shape
//                     * (outer top)
//                   /
//                  /
//                 /
//(center-bottom) *----O (outer bottom)
const MAX_LENGTH = Math.sqrt( MAX_LENGTH_SQUARE * MAX_LENGTH_SQUARE + ( MAX_LENGTH_SQUARE / 2 ) * ( MAX_LENGTH_SQUARE / 2 ) );

const SOUND_PLAY_TIME = 2;

const AUDIO_BUFFER_MAP = new Map();
AUDIO_BUFFER_MAP.set( soundFileProperty.enumeration.ONE, quadLoop01Sound );
AUDIO_BUFFER_MAP.set( soundFileProperty.enumeration.TWO, quadLoop02Sound );
AUDIO_BUFFER_MAP.set( soundFileProperty.enumeration.THREE, quadLoop03Sound );
AUDIO_BUFFER_MAP.set( soundFileProperty.enumeration.FOUR, quadLoop04Sound );

class SideSoundView {
  constructor( side, options ) {

    options = merge( {
      firstOctaveAngleToRate: new LinearFunction( Math.PI / 4, Math.PI / 2, 0.5, 1 ),
      secondOctaveAngleToRate: new LinearFunction( Math.PI / 2, 3 * Math.PI / 4, 1, 2 )
    }, options );

    // initialize to max value so sound doesn't start until first change
    this.timePlayingSound = SOUND_PLAY_TIME;

    // Create sound clips for the chosen sound - while still exploring different sounds we will
    soundFileProperty.link( selectedSound => {
      this.createSoundClips( selectedSound );
    } );

    // highest octave is loudest at min length and silent beyond half length
    const highestOctaveToOutputLevel = new LinearFunction( MIN_LENGTH, MAX_LENGTH / 2, 1, 0, true );

    // middle octave is loudest at mid length, and silent at the extremes
    const middleOctaveLengthToOutputLevel = new PiecewiseLinearFunction( [ MIN_LENGTH, 0, MAX_LENGTH / 2, 1, MAX_LENGTH / 2, 1, MAX_LENGTH, 0 ] );

    // highest octave is loudest at max length and silent lower than half length
    const lowestOctaveLengthToOutputLevel = new LinearFunction( MAX_LENGTH / 2, MAX_LENGTH, 0, 1, true );

    // maps the angle of the line relative to the perpendicular line to it in its initial state to a playback rate,
    // one per octave because the range of playback rate increases as we go up in octaves
    const firstOctaveAngleToThePerpendicularToPlaybackRate = new LinearFunction( 0, Math.PI / 2, 0.5, 1 );
    const secondOctaveAngleToThePerpendicularToPlaybackRate = new LinearFunction( Math.PI / 2, Math.PI, 1, 2 );

    Property.lazyMultilink( [ side.lengthProperty, side.tiltProperty ], ( length, angleToThePerpendicular ) => {
      this.lowestOctave.setOutputLevel( lowestOctaveLengthToOutputLevel( length ) );
      this.middleOctave.setOutputLevel( middleOctaveLengthToOutputLevel.evaluate( length ) );
      this.highestOctave.setOutputLevel( highestOctaveToOutputLevel( length ) );

      let angleToRateMap;
      let pitchDelta;
      if ( angleToThePerpendicular < Math.PI / 2 ) {
        angleToRateMap = firstOctaveAngleToThePerpendicularToPlaybackRate;
        pitchDelta = 0.5 / 12;
      }
      else {
        angleToRateMap = secondOctaveAngleToThePerpendicularToPlaybackRate;
        pitchDelta = 1 / 12;
      }

      // use the angle to the horizontal to determine the playback rate
      const angleDeterminedPlaybackRate = angleToRateMap( angleToThePerpendicular );
      const mappedRate = Utils.roundToInterval( angleDeterminedPlaybackRate, pitchDelta );

      this.lowestOctave.setPlaybackRate( mappedRate * 0.5 );
      this.middleOctave.setPlaybackRate( mappedRate );
      this.highestOctave.setPlaybackRate( mappedRate * 2 );
    } );

    this.allSoundClipsPlayingProperty = DerivedProperty.or( [
      this.lowestOctave.isPlayingProperty,
      this.middleOctave.isPlayingProperty,
      this.highestOctave.isPlayingProperty
    ] );
  }

  /**
   * Create the sound clips used to represent aspects of the Side.
   * @private
   * @param {SoundFile} soundFile - Enumeration value
   */
  createSoundClips( soundFile ) {

    // remove the previous sound generators
    soundManager.hasSoundGenerator( this.lowestOctave ) && soundManager.removeSoundGenerator( this.lowestOctave );
    soundManager.hasSoundGenerator( this.middleOctave ) && soundManager.removeSoundGenerator( this.middleOctave );
    soundManager.hasSoundGenerator( this.highestOctave ) && soundManager.removeSoundGenerator( this.highestOctave );

    const selectedSound = AUDIO_BUFFER_MAP.get( soundFile );
    this.lowestOctave = new SoundClip( selectedSound, {
      initialPlaybackRate: 0.5,
      loop: true
    } );
    this.middleOctave = new SoundClip( selectedSound, {
      loop: true
    } );
    this.highestOctave = new SoundClip( selectedSound, {
      initialPlaybackRate: 2,
      loop: true
    } );

    soundManager.addSoundGenerator( this.lowestOctave );
    soundManager.addSoundGenerator( this.middleOctave );
    soundManager.addSoundGenerator( this.highestOctave );
  }

  /**
   * Start playing sounds. Works by resetting the amount of time that sounds have been playing so that we will try
   * to start playing sounds in the next animation frame.
   * @public
   */
  startPlayingSounds() {
    this.timePlayingSound = 0;
  }

  /**
   * Play all sound clips.
   * @private
   */
  playSoundClips() {
    this.lowestOctave.play();
    this.middleOctave.play();
    this.highestOctave.play();
  }

  /**
   * Stop playing all sound clips.
   * @private
   */
  stopSoundClips() {
    this.lowestOctave.stop();
    this.middleOctave.stop();
    this.highestOctave.stop();
  }

  /**
   * Step the sound view, starting/stopping playing depending on how long we have been playing already.
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {
    if ( this.timePlayingSound < SOUND_PLAY_TIME ) {

      // only pflay sound clips again if they are not already playing to prevent some clipping in the output
      if ( !this.allSoundClipsPlayingProperty.value ) {
        this.playSoundClips();
      }
      this.timePlayingSound += dt;
    }
    else {
      this.stopSoundClips();
    }
  }
}

quadrilateral.register( 'SideSoundView', SideSoundView );
export default SideSoundView;

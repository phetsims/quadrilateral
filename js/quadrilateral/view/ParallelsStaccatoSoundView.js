// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import quadrilateral from '../../quadrilateral.js';

const STACCATO_PLAY_INTERVAL = 0.5; // in seconds, how frequently we play the staccato sound

const TILT_DIFFERENCE_TO_PITCHED_POP_COEFFICIENT = new LinearFunction( 0, 1, 1, 6, true );
const TILT_DIFFERENCE_TO_PITCH = new LinearFunction( 0, 0.5, 0.5, 0, true );

class ParallelsStaccatoSoundView {
  constructor( model, soundOptionsModel ) {
    this.model = model;

    this.leftRightSideGenerator = new QuadrilateralPitchedPopGenerator();
    this.topBottomSideGenerator = new QuadrilateralPitchedPopGenerator();

    soundManager.addSoundGenerator( this.leftRightSideGenerator );
    soundManager.addSoundGenerator( this.topBottomSideGenerator );

    this.isPlaying = false;
    this.remainingPlayTime = 0;

    this.timeSinceLeftRightPlay = STACCATO_PLAY_INTERVAL;
    this.timeSinceTopBottomPlay = 0;

    const shapeChangeListener = () => {
      this.isPlaying = true;
      this.remainingPlayTime = 2;
    };
    this.model.shapeChangedEmitter.addListener( shapeChangeListener );

    const leftRightMultilink = Property.multilink(
      [ model.leftSide.tiltProperty, model.rightSide.tiltProperty ],
      ( leftTilt, rightTilt ) => {
        this.leftRightPopCoefficient = TILT_DIFFERENCE_TO_PITCHED_POP_COEFFICIENT( Math.abs( leftTilt - rightTilt ) );
        this.leftRightRelativePitch = TILT_DIFFERENCE_TO_PITCH( Math.abs( leftTilt - rightTilt ) );
      }
    );
    const topBottomMultilink = Property.multilink(
      [ model.topSide.tiltProperty, model.bottomSide.tiltProperty ],
      ( topTilt, bottomTilt ) => {
        this.topBottomPopCoefficient = TILT_DIFFERENCE_TO_PITCHED_POP_COEFFICIENT( Math.abs( topTilt - bottomTilt ) );
        this.topBottomRelativePitch = TILT_DIFFERENCE_TO_PITCH( Math.abs( topTilt - bottomTilt ) );
      }
    );

    // @private {function} - for disposal
    this.disposeParallelsStaccatoSoundView = () => {
      this.model.shapeChangedEmitter.removeListener( shapeChangeListener );

      Property.unmultilink( leftRightMultilink );
      Property.unmultilink( topBottomMultilink );
    };

  }

  /**
   * @public
   * @param {number} dt
   */
  step( dt ) {
    if ( this.isPlaying ) {
      this.remainingPlayTime -= dt;

      this.timeSinceLeftRightPlay += dt;
      this.timeSinceTopBottomPlay += dt;
      if ( this.timeSinceLeftRightPlay > STACCATO_PLAY_INTERVAL ) {
        this.timeSinceLeftRightPlay = 0;
        this.timeSinceTopBottomPlay = 0;
        this.leftRightSideGenerator.playPop( this.leftRightRelativePitch * 0.5, STACCATO_PLAY_INTERVAL / 3, this.leftRightPopCoefficient );
      }
      if ( this.timeSinceTopBottomPlay > STACCATO_PLAY_INTERVAL / 2 ) {
        this.timeSinceTopBottomPlay = -STACCATO_PLAY_INTERVAL / 2;
        this.topBottomSideGenerator.playPop( this.topBottomRelativePitch, STACCATO_PLAY_INTERVAL / 3, this.topBottomPopCoefficient );
      }

      if ( this.remainingPlayTime <= 0 ) {
        this.isPlaying = false;
      }
    }
  }

  /**
   * @public
   */
  dispose() {
    this.disposeParallelsStaccatoSoundView();
  }
}

/**
 * A PitchedPopGenerator with some slight modifications to create the desired effects in Quadrilateral.
 * This is almost a complete copy and past from PitchedPopGenerator with some variables replaced, though
 * I am not sure what the best way to make modifications in common code would be.
 */
class QuadrilateralPitchedPopGenerator extends SoundGenerator {
  constructor( options ) {

    options = merge( {

      // the range of pitches that this pop generator will produce, in Hz
      pitchRange: new Range( 220, 660 ),

      // the number of pop generators to create and pool, use more if generating lots of pops close together, less if not
      numPopGenerators: 8
    }, options );

    super( options );

    // @private {Range} - range of pitches to be produced
    this.pitchRange = options.pitchRange;

    // {DynamicsCompressorNode} - a dynamics compressor node used to limit max output amplitude, otherwise distortion
    // tends to occur when lots of pops are played at once
    const dynamicsCompressorNode = this.audioContext.createDynamicsCompressor();

    // the following values were empirically determined throgh informed experimentation
    const now = this.audioContext.currentTime;
    dynamicsCompressorNode.threshold.setValueAtTime( -3, now );
    dynamicsCompressorNode.knee.setValueAtTime( 0, now ); // hard knee
    dynamicsCompressorNode.ratio.setValueAtTime( 12, now );
    dynamicsCompressorNode.attack.setValueAtTime( 0, now );
    dynamicsCompressorNode.release.setValueAtTime( 0.25, now );
    dynamicsCompressorNode.connect( this.soundSourceDestination );

    // create the sources - several are created so that pops can be played in rapid succession if desired
    // @private {{oscillator:OscillatorNode, gainNode:GainNode}[]} - an array of sound source, several are created so
    // that pops can be played in rapid succession without interfering with one another
    this.soundSources = [];
    _.times( options.numPopGenerators, () => {

      // {OscillatorNode}
      const oscillator = this.audioContext.createOscillator();
      const now = this.audioContext.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime( options.pitchRange.min, now );
      oscillator.start( 0 );

      // {GainNode}
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime( 0, now );
      oscillator.connect( gainNode );
      gainNode.connect( dynamicsCompressorNode );

      this.soundSources.push( {
        oscillator: oscillator,
        gainNode: gainNode
      } );
    } );

    // @private
    this.nextSoundSourceIndex = 0;
  }

  /**
   * play the pop sound
   * {number} relativePitch - a value from 0 to 1 indicating the frequency to play within the pitch range
   * {number} [duration] - the duration of the sound, in seconds
   * @public
   */
  playPop( relativePitch, duration, frequencyCoefficient ) {

    assert && assert( relativePitch >= 0 && relativePitch <= 1, 'relative pitch value out of range' );

    if ( !this.fullyEnabled ) {

      // ignore the request
      return;
    }

    // use either the specified or default duration
    duration = duration || 0.02;

    // determine the frequency value of the pop
    const minFrequency = this.pitchRange.min;
    const maxFrequency = this.pitchRange.max;
    const frequency = minFrequency + relativePitch * ( maxFrequency - minFrequency );

    // get a sound source from the pool, then index to the next one (see above for type info on sound sources)
    const soundSource = this.soundSources[ this.nextSoundSourceIndex ];
    this.nextSoundSourceIndex = ( this.nextSoundSourceIndex + 1 ) % this.soundSources.length;

    // play the pop sound
    const now = this.audioContext.currentTime;
    soundSource.gainNode.gain.cancelScheduledValues( now );
    soundSource.oscillator.frequency.setValueAtTime( frequency / frequencyCoefficient, now );
    soundSource.gainNode.gain.setValueAtTime( 0, now );
    soundSource.oscillator.frequency.linearRampToValueAtTime( frequency * frequencyCoefficient, now + duration );
    soundSource.gainNode.gain.setTargetAtTime( 1, now, 0.005 );
    soundSource.gainNode.gain.setTargetAtTime( 0, now + duration, 0.005 );
  }
}

quadrilateral.register( 'ParallelsStaccatoSoundView', ParallelsStaccatoSoundView );
export default ParallelsStaccatoSoundView;

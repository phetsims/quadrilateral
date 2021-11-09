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
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';

const STACCATO_PLAY_INTERVAL = 0.5; // in seconds, how frequently we play the staccato sound

const TILT_DIFFERENCE_TO_PITCHED_POP_COEFFICIENT = new LinearFunction( 0, 1, 1, 6, true );
const TILT_DIFFERENCE_TO_PITCH = new LinearFunction( 0, 0.5, 0.5, 0, true );

// A type for elements used to create Sound sources with the PitchedPopGenerator.
type OscillatorWithGainNode = {
  oscillator: OscillatorNode,
  gainNode: GainNode
};

class ParallelsStaccatoSoundView {
  private readonly model: QuadrilateralModel;
  private readonly leftRightSideGenerator: QuadrilateralPitchedPopGenerator;
  private readonly topBottomSideGenerator: QuadrilateralPitchedPopGenerator;
  private isPlaying: boolean;
  private remainingPlayTime: number;
  private timeSinceLeftRightPlay: number;
  private timeSinceTopBottomPlay: number;
  private leftRightPopCoefficient: number | null;
  private leftRightRelativePitch: number | null;
  private topBottomPopCoefficient: number | null;
  private topBottomRelativePitch: number | null;
  private readonly disposeParallelsStaccatoSoundView: () => void;


  public constructor( model: QuadrilateralModel, soundOptionsModel: QuadrilateralSoundOptionsModel ) {
    this.model = model;

    this.leftRightSideGenerator = new QuadrilateralPitchedPopGenerator();
    this.topBottomSideGenerator = new QuadrilateralPitchedPopGenerator();
    soundManager.addSoundGenerator( this.leftRightSideGenerator );
    soundManager.addSoundGenerator( this.topBottomSideGenerator );

    // Whether or not this SoundView is currently playing so we know to stop playing after a time interval or
    // fade out.
    this.isPlaying = false;

    // How much longer we should play this SoundView before stopping play after an interaction.
    this.remainingPlayTime = 0;

    // How much time we have played a sound for a particular pair of sides.
    this.timeSinceLeftRightPlay = STACCATO_PLAY_INTERVAL;
    this.timeSinceTopBottomPlay = 0;

    // Coefficients that control the Sound output with the pitched/pop generator, null until first modified
    // in the multilinks attached to the model.
    this.leftRightPopCoefficient = null;
    this.leftRightRelativePitch = null;
    this.topBottomPopCoefficient = null;
    this.topBottomRelativePitch = null;

    const shapeChangeListener = () => {
      this.isPlaying = true;
      this.remainingPlayTime = 2;
    };
    this.model.shapeChangedEmitter.addListener( shapeChangeListener );

    const leftRightMultilink = Property.multilink(
      [ model.leftSide.tiltProperty, model.rightSide.tiltProperty ],
      ( leftTilt: number, rightTilt: number ) => {
        this.leftRightPopCoefficient = TILT_DIFFERENCE_TO_PITCHED_POP_COEFFICIENT.evaluate( Math.abs( leftTilt - rightTilt ) );
        this.leftRightRelativePitch = TILT_DIFFERENCE_TO_PITCH.evaluate( Math.abs( leftTilt - rightTilt ) );
      }
    );
    const topBottomMultilink = Property.multilink(
      [ model.topSide.tiltProperty, model.bottomSide.tiltProperty ],
      ( topTilt: number, bottomTilt: number ) => {
        this.topBottomPopCoefficient = TILT_DIFFERENCE_TO_PITCHED_POP_COEFFICIENT.evaluate( Math.abs( topTilt - bottomTilt ) );
        this.topBottomRelativePitch = TILT_DIFFERENCE_TO_PITCH.evaluate( Math.abs( topTilt - bottomTilt ) );
      }
    );

    // Whenever there is a reset, stop playing all sounds immediately, we should only hear the common reset sound.
    const resetListener = () => {
      this.stopPlayingSounds();
    };
    this.model.resetNotInProgressProperty.link( resetListener );

    // @private {function} - for disposal
    this.disposeParallelsStaccatoSoundView = () => {
      this.model.shapeChangedEmitter.removeListener( shapeChangeListener );
      this.model.resetNotInProgressProperty.unlink( resetListener );

      Property.unmultilink( leftRightMultilink );
      Property.unmultilink( topBottomMultilink );
    };

  }

  /**
   * @param dt - in seconds
   */
  public step( dt: number ): void {
    if ( this.isPlaying ) {
      this.remainingPlayTime -= dt;

      this.timeSinceLeftRightPlay += dt;
      this.timeSinceTopBottomPlay += dt;
      if ( this.timeSinceLeftRightPlay > STACCATO_PLAY_INTERVAL ) {
        this.timeSinceLeftRightPlay = 0;
        this.timeSinceTopBottomPlay = 0;
        this.leftRightSideGenerator.playPop( this.leftRightRelativePitch! * 0.5, STACCATO_PLAY_INTERVAL / 3, this.leftRightPopCoefficient! );
      }
      if ( this.timeSinceTopBottomPlay > STACCATO_PLAY_INTERVAL / 2 ) {
        this.timeSinceTopBottomPlay = -STACCATO_PLAY_INTERVAL / 2;
        this.topBottomSideGenerator.playPop( this.topBottomRelativePitch!, STACCATO_PLAY_INTERVAL / 3, this.topBottomPopCoefficient! );
      }

      if ( this.remainingPlayTime <= 0 ) {
        this.isPlaying = false;
      }
    }
  }

  /**
   * Immediately stop playing all sounds related to this sound design.
   */
  public stopPlayingSounds(): void {
    this.isPlaying = false;
    this.remainingPlayTime = 0;
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
  private pitchRange: Range;
  private readonly soundSources: OscillatorWithGainNode[];
  private nextSoundSourceIndex: number;

  public constructor( options?: any ) {

    options = merge( {

      // the range of pitches that this pop generator will produce, in Hz
      pitchRange: new Range( 220, 660 ),

      // the number of pop generators to create and pool, use more if generating lots of pops close together, less if not
      numPopGenerators: 8
    }, options );

    super( options );

    // @private {Range} - range of pitches to be produced
    this.pitchRange = options.pitchRange;

    // a dynamics compressor node used to limit max output amplitude, otherwise distortion tends to occur when lots of
    // pops are played at once
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
   * Play the Pop sound.
   * @param relativePitch - a value from 0 to 1 indicating the frequency to play within the pitch range
   * @param duration - the duration of the sound, in seconds
   * @param frequencyCoefficient - Coefficient controlling the frequency as we shift pitch, higher values result
   *                               in greater changes in frequency over the duration.
   */
  public playPop( relativePitch: number, duration: number, frequencyCoefficient: number ): void {

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

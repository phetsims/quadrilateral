// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the "Tracks" sound designs. In this design there are a collection of sound clips that will play
 * which represent each named quadrilateral. The sound clips play in the background and loop forever, but their output
 * level will change depending on shape state and user input. By default, sound will only play for a few seconds
 * after input with the quadrilateral.
 *
 * Subclasses of this sound view will provide all the tracks to play and implement how their output level
 * should change with state of the shape.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';

// In seconds, how long all tracks should play after there has been some change in shape.
const ALL_TRACKS_PLAY_TIME = 2;

class TracksSoundView extends SoundGenerator {

  // Controls options for the sound design that may change from the Preferences dialog.
  private readonly soundOptionsModel: QuadrilateralSoundOptionsModel;

  // Array of all SoundGenerators from the provided tracks. They will play and loop forever in the background. Depending
  // on input and state of the quadrilateral shape, their output level will change.
  public readonly soundClips: SoundClip[];

  // How much time sounds should continue to play for after interaction with the quadrilateral. If the user has
  // selected to play sounds forever, this variable is meaningless.
  private remainingPlayTime = 0;

  public constructor( shapeModel: QuadrilateralShapeModel, resetNotInProgressProperty: IReadOnlyProperty<boolean>, soundOptionsModel: QuadrilateralSoundOptionsModel, tracks: WrappedAudioBuffer[] ) {
    super( {

      // don't play sounds while model reset is in progress
      enableControlProperties: [ resetNotInProgressProperty ],

      // No sound from this track set initially
      initialOutputLevel: 0
    } );

    this.soundOptionsModel = soundOptionsModel;

    this.soundClips = tracks.map( track => {

      // Create a looping SoundGenerator for the track and connect it to the gainNode of this parent SoundGenerator.
      // That way the volume of all clips can be controlled through the TracksSoundView. Initially silent until
      // state of the model determines this particular sub-sound should play.
      const generator = new SoundClip( track, {
        loop: true,
        initialOutputLevel: 0,

        // All sub-sound clips need to align perfectly, do not trim any silence
        trimSilence: false
      } );
      generator.connect( this.masterGainNode );

      // immediately start playing all sounds, all control for this design uses output level
      generator.play();

      return generator;
    } );

    soundManager.addSoundGenerator( this );

    shapeModel.shapeChangedEmitter.addListener( () => {
      if ( resetNotInProgressProperty.value ) {
        this.remainingPlayTime = ALL_TRACKS_PLAY_TIME;
        this.setOutputLevel( 1 );
      }
      else {

        // Reset just started, stop any sounds until more manual changes
        this.remainingPlayTime = 0;
      }
    } );
  }

  /**
   * Step the sound view, playing all tracks for a certain amount of time and reducing output level to zero. Since
   * tracks loop forever as we fade in and out of melodies, we set the output level instead of calling stop().
   *
   * @param dt - in seconds
   */
  public step( dt: number ): void {
    if ( !this.soundOptionsModel.tracksPlayForeverProperty.value ) {
      this.remainingPlayTime = Math.max( 0, this.remainingPlayTime - dt );

      if ( this.remainingPlayTime === 0 && this.outputLevel !== 0 ) {
        this.setOutputLevel( 0 );
      }
    }
  }

  /**
   * Remove all SoundGenerators associated with this view so that they stop playing sounds.
   */
  public override dispose(): void {
    this.soundClips.forEach( generator => {
      generator.disconnect( this.masterGainNode );
      generator.dispose();
    } );

    super.dispose();
  }
}

quadrilateral.register( 'TracksSoundView', TracksSoundView );
export default TracksSoundView;
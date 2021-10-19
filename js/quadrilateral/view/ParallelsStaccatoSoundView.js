// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import PitchedPopGenerator from '../../../../tambo/js/sound-generators/PitchedPopGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import quadrilateral from '../../quadrilateral.js';

const STACCATO_PLAY_INTERVAL = 0.5; // in seconds, how frequently we play the staccato sound

const TILT_DIFFERENCE_TO_PITCHED_POP_COEFFICIENT = new LinearFunction( 0, 0.5, 1, 4, true );
const TILT_DIFFERENCE_TO_RELATIVE_PITCH_COEFFICIENT = new LinearFunction( 0, 0.5, 1, 0.1, true );

class ParallelsStaccatoSoundView {
  constructor( model, soundOptionsModel ) {
    this.model = model;

    this.leftRightSideGenerator = new PitchedPopGenerator();
    this.topBottomSideGenerator = new PitchedPopGenerator();

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
        this.leftRightPitchCoefficient = TILT_DIFFERENCE_TO_RELATIVE_PITCH_COEFFICIENT( Math.abs( leftTilt - rightTilt ) );
      }
    );
    const topBottomMultilink = Property.multilink(
      [ model.topSide.tiltProperty, model.bottomSide.tiltProperty ],
      ( topTilt, bottomTilt ) => {
        this.topBottomPopCoefficient = TILT_DIFFERENCE_TO_PITCHED_POP_COEFFICIENT( Math.abs( topTilt - bottomTilt ) );
        this.topBottomPitchCoefficient = TILT_DIFFERENCE_TO_RELATIVE_PITCH_COEFFICIENT( Math.abs( topTilt - bottomTilt ) );
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
        this.leftRightSideGenerator.playPop( 0.25 * this.leftRightPitchCoefficient, STACCATO_PLAY_INTERVAL / 3, this.leftRightPopCoefficient );
      }
      if ( this.timeSinceTopBottomPlay > STACCATO_PLAY_INTERVAL / 2 ) {
        this.timeSinceTopBottomPlay = -STACCATO_PLAY_INTERVAL / 2;
        this.topBottomSideGenerator.playPop( 0.5 * this.topBottomPitchCoefficient, STACCATO_PLAY_INTERVAL / 3, this.topBottomPopCoefficient );
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

quadrilateral.register( 'ParallelsStaccatoSoundView', ParallelsStaccatoSoundView );
export default ParallelsStaccatoSoundView;

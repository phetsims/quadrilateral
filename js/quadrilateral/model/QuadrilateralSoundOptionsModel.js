// Copyright 2021, University of Colorado Boulder

/**
 * A model for the sound designs that are being proposed for Quadrilateral. In active development and we are
 * iterating on all of these. Different sound designs can be tested from the Preferences Dialog in the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import quadIntoParallel001Sound from '../../../sounds/quad-into-parallel-001_mp3.js';
import quadIntoParallel002Sound from '../../../sounds/quad-into-parallel-002_mp3.js';
import quadIntoParallel003Sound from '../../../sounds/quad-into-parallel-003_mp3.js';
import quadIntoParallel004Sound from '../../../sounds/quad-into-parallel-004_mp3.js';
import quadLoop01Sound from '../../../sounds/quad-loop-01_mp3.js';
import quadLoop02Sound from '../../../sounds/quad-loop-02_mp3.js';
import quadLoop03Sound from '../../../sounds/quad-loop-03_mp3.js';
import quadLoop04Sound from '../../../sounds/quad-loop-04_mp3.js';
import quadMovingInParallelSuccessLoop001Sound from '../../../sounds/quad-moving-in-parallel-success-loop-001_mp3.js';
import quadMovingInParallelSuccessLoop002Sound from '../../../sounds/quad-moving-in-parallel-success-loop-002_mp3.js';
import quadMovingInParallelSuccessLoop003Sound from '../../../sounds/quad-moving-in-parallel-success-loop-003_mp3.js';
import quadMovingInParallelSuccessLoop004Sound from '../../../sounds/quad-moving-in-parallel-success-loop-004_mp3.js';
import quadOutOfParallel001Sound from '../../../sounds/quad-out-of-parallel-001_mp3.js';
import quadOutOfParallel002Sound from '../../../sounds/quad-out-of-parallel-002_mp3.js';
import quadOutOfParallel003Sound from '../../../sounds/quad-out-of-parallel-003_mp3.js';
import quadOutOfParallel004Sound from '../../../sounds/quad-out-of-parallel-004_mp3.js';
import quadrilateral from '../../quadrilateral.js';

// constants
// Enumeration for named sound designs, each with their own options and parameters
const SoundDesign = Enumeration.byKeys( [ 'QUARTET', 'PARALLELS_VOLUME', 'PARALLELS_STACCATO', 'SUCCESS_SOUNDS' ] );

const QuartetSoundFile = Enumeration.byKeys( [ 'ONE', 'TWO', 'THREE', 'FOUR' ] );

// There are different options for the 'success' prototype. Each one has a sound for "getting into parallel",
// "getting out of parallel", and "moving in parallel". See SUCCESS_SOUND_COLLECTION_MAP below.
const SuccessSoundFile = Enumeration.byKeys( [ 'ONE', 'TWO', 'THREE', 'FOUR' ] );

// Maps QuartetSoundFile to the WrappedAudioBuffer for the SoundClip
const AUDIO_BUFFER_MAP = new Map();
AUDIO_BUFFER_MAP.set( QuartetSoundFile.ONE, quadLoop01Sound );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.TWO, quadLoop02Sound );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.THREE, quadLoop03Sound );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.FOUR, quadLoop04Sound );

/**
 * An inner class that collects a group of sounds that go together for one of the options of the "Success" prototype.
 * In this prototype there is one sound for success, one sound for failure, and one sound for maintaining success
 * while moving.
 */
class SuccessSoundCollection {

  /**
   * @param {WrappedAudioBuffer} successSound
   * @param {WrappedAudioBuffer} failureSound
   * @param {WrappedAudioBuffer} maintenanceSound
   */
  constructor( successSound, failureSound, maintenanceSound ) {

    // @public (read-only) {WrappedAudioBuffer}
    this.successSound = successSound;
    this.failureSound = failureSound;
    this.maintenanceSound = maintenanceSound;
  }
}

const SUCCESS_SOUND_COLLECTION_MAP = new Map();
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.ONE, new SuccessSoundCollection( quadIntoParallel001Sound, quadOutOfParallel001Sound, quadMovingInParallelSuccessLoop001Sound ) );
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.TWO, new SuccessSoundCollection( quadIntoParallel002Sound, quadOutOfParallel002Sound, quadMovingInParallelSuccessLoop002Sound ) );
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.THREE, new SuccessSoundCollection( quadIntoParallel003Sound, quadOutOfParallel003Sound, quadMovingInParallelSuccessLoop003Sound ) );
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.FOUR, new SuccessSoundCollection( quadIntoParallel004Sound, quadOutOfParallel004Sound, quadMovingInParallelSuccessLoop004Sound ) );

class QuadrilateralSoundOptionsModel {
  constructor() {

    // the fundamental sound design
    this.soundDesignProperty = new EnumerationProperty( SoundDesign, SoundDesign.SUCCESS_SOUNDS );

    // @public {EnumerationProperty} - Property that controls the base sound of the "quartet" design. In the
    // quartet design there is a single sound whose pitch is changed depending on length and tilt of each line.
    this.baseSoundFileProperty = new EnumerationProperty( QuartetSoundFile, QuartetSoundFile.FOUR );

    this.successSoundFileProperty = new EnumerationProperty( SuccessSoundFile, SuccessSoundFile.FOUR );
  }
}

// @public @static
QuadrilateralSoundOptionsModel.SoundDesign = SoundDesign;
QuadrilateralSoundOptionsModel.QuartetSoundFile = QuartetSoundFile;
QuadrilateralSoundOptionsModel.AUDIO_BUFFER_MAP = AUDIO_BUFFER_MAP;
QuadrilateralSoundOptionsModel.SUCCESS_SOUND_COLLECTION_MAP = SUCCESS_SOUND_COLLECTION_MAP;

quadrilateral.register( 'QuadrilateralSoundOptionsModel', QuadrilateralSoundOptionsModel );
export default QuadrilateralSoundOptionsModel;

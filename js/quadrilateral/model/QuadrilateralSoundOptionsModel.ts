// Copyright 2021-2022, University of Colorado Boulder

/**
 * A model for the sound designs that are being proposed for Quadrilateral. In active development and we are
 * iterating on all of these. Different sound designs can be tested from the Preferences Dialog in the sim.
 * Once a single design is decided this will probably be entirely removed.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';
import quadIntoParallel001_mp3 from '../../../sounds/quadIntoParallel001_mp3.js';
import quadIntoParallel002_mp3 from '../../../sounds/quadIntoParallel002_mp3.js';
import quadIntoParallel003_mp3 from '../../../sounds/quadIntoParallel003_mp3.js';
import quadIntoParallel004_mp3 from '../../../sounds/quadIntoParallel004_mp3.js';
import quadLoop01_mp3 from '../../../sounds/quadLoop01_mp3.js';
import quadLoop02_mp3 from '../../../sounds/quadLoop02_mp3.js';
import quadLoop03_mp3 from '../../../sounds/quadLoop03_mp3.js';
import quadLoop04_mp3 from '../../../sounds/quadLoop04_mp3.js';
import quadMovingInParallelSuccessLoop001_wav from '../../../sounds/quadMovingInParallelSuccessLoop001_wav.js';
import quadMovingInParallelSuccessLoop002_mp3 from '../../../sounds/quadMovingInParallelSuccessLoop002_mp3.js';
import quadMovingInParallelSuccessLoop003_mp3 from '../../../sounds/quadMovingInParallelSuccessLoop003_mp3.js';
import quadMovingInParallelSuccessLoop004_mp3 from '../../../sounds/quadMovingInParallelSuccessLoop004_mp3.js';
import quadOutOfParallel001_mp3 from '../../../sounds/quadOutOfParallel001_mp3.js';
import quadOutOfParallel002_mp3 from '../../../sounds/quadOutOfParallel002_mp3.js';
import quadOutOfParallel003_mp3 from '../../../sounds/quadOutOfParallel003_mp3.js';
import quadOutOfParallel004_mp3 from '../../../sounds/quadOutOfParallel004_mp3.js';
import quadrilateral from '../../quadrilateral.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';

// constants
// Enumeration for named sound designs, each with their own options and parameters
class SoundDesign extends EnumerationValue {
  public static QUARTET = new SoundDesign();
  public static PARALLELS_VOLUME = new SoundDesign();
  public static PARALLELS_STACCATO = new SoundDesign();
  public static SUCCESS_SOUNDS = new SoundDesign();
  public static MAINTENANCE_SOUNDS = new SoundDesign();

  // gets a list of keys, values and mapping between them for EnumerationProperty and PhET-iO
  public static enumeration = new Enumeration( SoundDesign );
}


class QuartetSoundFile extends EnumerationValue {
  public static ONE = new QuartetSoundFile();
  public static TWO = new QuartetSoundFile();
  public static THREE = new QuartetSoundFile();
  public static FOUR = new QuartetSoundFile();

  // gets a list of keys, values and mapping between them for EnumerationProperty and PhET-iO
  public static enumeration = new Enumeration( QuartetSoundFile );
}

class SuccessSoundFile extends EnumerationValue {
  public static ONE = new SuccessSoundFile();
  public static TWO = new SuccessSoundFile();
  public static THREE = new SuccessSoundFile();
  public static FOUR = new SuccessSoundFile();

  // gets a list of keys, values and mapping between them for EnumerationProperty and PhET-iO
  public static enumeration = new Enumeration( SuccessSoundFile );
}

// Maps QuartetSoundFile to the WrappedAudioBuffer for the SoundClip
const AUDIO_BUFFER_MAP = new Map<QuartetSoundFile, WrappedAudioBuffer>();
AUDIO_BUFFER_MAP.set( QuartetSoundFile.ONE, quadLoop01_mp3 );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.TWO, quadLoop02_mp3 );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.THREE, quadLoop03_mp3 );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.FOUR, quadLoop04_mp3 );

/**
 * An inner class that collects a group of sounds that go together for one of the options of the "Success" prototype.
 * In this prototype there is one sound for success, one sound for failure, and one sound for maintaining success
 * while moving.
 */
class SuccessSoundCollection {
  public readonly successSound: WrappedAudioBuffer;
  public readonly failureSound: WrappedAudioBuffer;
  public readonly maintenanceSound: WrappedAudioBuffer;

  public constructor( successSound: WrappedAudioBuffer, failureSound: WrappedAudioBuffer, maintenanceSound: WrappedAudioBuffer ) {
    this.successSound = successSound;
    this.failureSound = failureSound;
    this.maintenanceSound = maintenanceSound;
  }
}

const SUCCESS_SOUND_COLLECTION_MAP = new Map<SuccessSoundFile, SuccessSoundCollection>();
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.ONE, new SuccessSoundCollection( quadIntoParallel001_mp3, quadOutOfParallel001_mp3, quadMovingInParallelSuccessLoop001_wav ) );
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.TWO, new SuccessSoundCollection( quadIntoParallel002_mp3, quadOutOfParallel002_mp3, quadMovingInParallelSuccessLoop002_mp3 ) );
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.THREE, new SuccessSoundCollection( quadIntoParallel003_mp3, quadOutOfParallel003_mp3, quadMovingInParallelSuccessLoop003_mp3 ) );
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.FOUR, new SuccessSoundCollection( quadIntoParallel004_mp3, quadOutOfParallel004_mp3, quadMovingInParallelSuccessLoop004_mp3 ) );

class QuadrilateralSoundOptionsModel {

  // The selected sound design, changing this will change the entire design.
  public soundDesignProperty: EnumerationProperty<SoundDesign>;

  // Property that controls the base sound for a few of the prototypes. Some prototypes have a base sound and
  // the state of the sim changes the frequency and layering of the base sound. But there are a few base
  // sounds to choose from.
  public baseSoundFileProperty: EnumerationProperty<QuartetSoundFile>;

  // For the "Success" sound prototype, a sound is played when reaching a parallelogram, leaving a parallelogram,
  // and when the parallelogram is maintained while the shape changes. Within this paradigm there are
  // different sound options for each of these to chose from.
  public successSoundFileProperty: EnumerationProperty<SuccessSoundFile>;

  // For the "Success" sound prototype, when true the "maintenance" sound will only play when the
  // quadrilateral changes shape, remains a parallelogram, AND the lengths remain the same
  // during the interaction.
  public maintenanceSoundRequiresEqualLengthsProperty: BooleanProperty;

  public static SoundDesign: SoundDesign;
  public static QuartetSoundFile: QuartetSoundFile;
  public static SuccessSoundFile: SuccessSoundFile;
  public static AUDIO_BUFFER_MAP = AUDIO_BUFFER_MAP;
  public static SUCCESS_SOUND_COLLECTION_MAP = SUCCESS_SOUND_COLLECTION_MAP;

  public constructor() {
    this.soundDesignProperty = new EnumerationProperty( SoundDesign.SUCCESS_SOUNDS );
    this.baseSoundFileProperty = new EnumerationProperty( QuartetSoundFile.ONE );
    this.successSoundFileProperty = new EnumerationProperty( SuccessSoundFile.ONE );
    this.maintenanceSoundRequiresEqualLengthsProperty = new BooleanProperty( QuadrilateralQueryParameters.equalLengthsForMaintenanceSound );
  }
}

quadrilateral.register( 'QuadrilateralSoundOptionsModel', QuadrilateralSoundOptionsModel );
export { SoundDesign };
export { SuccessSoundFile };
export { QuartetSoundFile };
export { SuccessSoundCollection };
export default QuadrilateralSoundOptionsModel;

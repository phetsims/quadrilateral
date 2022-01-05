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
import quadMovingInParallelSuccessLoop001_mp3 from '../../../sounds/quadMovingInParallelSuccessLoop001_mp3.js';
import quadMovingInParallelSuccessLoop002_mp3 from '../../../sounds/quadMovingInParallelSuccessLoop002_mp3.js';
import quadMovingInParallelSuccessLoop003_mp3 from '../../../sounds/quadMovingInParallelSuccessLoop003_mp3.js';
import quadMovingInParallelSuccessLoop004_mp3 from '../../../sounds/quadMovingInParallelSuccessLoop004_mp3.js';
import quadOutOfParallel001_mp3 from '../../../sounds/quadOutOfParallel001_mp3.js';
import quadOutOfParallel002_mp3 from '../../../sounds/quadOutOfParallel002_mp3.js';
import quadOutOfParallel003_mp3 from '../../../sounds/quadOutOfParallel003_mp3.js';
import quadOutOfParallel004_mp3 from '../../../sounds/quadOutOfParallel004_mp3.js';
import quadrilateral from '../../quadrilateral.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import RichEnumerationProperty from '../../../../axon/js/RichEnumerationProperty.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import RichEnumeration from '../../../../phet-core/js/RichEnumeration.js';

// constants
// Enumeration for named sound designs, each with their own options and parameters
class SoundDesign extends EnumerationValue {
  static QUARTET = new SoundDesign();
  static PARALLELS_VOLUME = new SoundDesign();
  static PARALLELS_STACCATO = new SoundDesign();
  static SUCCESS_SOUNDS = new SoundDesign();

  // gets a list of keys, values and mapping between them for RichEnumerationProperty and PhET-iO
  static enumeration = new RichEnumeration<SoundDesign>( SoundDesign );

  private constructor() { super(); }
}


class QuartetSoundFile extends EnumerationValue {
  static ONE = new QuartetSoundFile();
  static TWO = new QuartetSoundFile();
  static THREE = new QuartetSoundFile();
  static FOUR = new QuartetSoundFile();

  // gets a list of keys, values and mapping between them for RichEnumerationProperty and PhET-iO
  static enumeration = new RichEnumeration<QuartetSoundFile>( QuartetSoundFile );

  private constructor() { super(); }
}

class SuccessSoundFile extends EnumerationValue {
  static ONE = new SuccessSoundFile();
  static TWO = new SuccessSoundFile();
  static THREE = new SuccessSoundFile();
  static FOUR = new SuccessSoundFile();

  // gets a list of keys, values and mapping between them for RichEnumerationProperty and PhET-iO
  static enumeration = new RichEnumeration<SuccessSoundFile>( SuccessSoundFile );

  private constructor() { super(); }
}

// Maps QuartetSoundFile to the WrappedAudioBuffer for the SoundClip
const AUDIO_BUFFER_MAP = new Map();
AUDIO_BUFFER_MAP.set( 'ONE', quadLoop01_mp3 );
AUDIO_BUFFER_MAP.set( 'TWO', quadLoop02_mp3 );
AUDIO_BUFFER_MAP.set( 'THREE', quadLoop03_mp3 );
AUDIO_BUFFER_MAP.set( 'FOUR', quadLoop04_mp3 );

/**
 * An inner class that collects a group of sounds that go together for one of the options of the "Success" prototype.
 * In this prototype there is one sound for success, one sound for failure, and one sound for maintaining success
 * while moving.
 */
class SuccessSoundCollection {
  public readonly successSound: WrappedAudioBuffer;
  public readonly failureSound: WrappedAudioBuffer;
  public readonly maintenanceSound: WrappedAudioBuffer;

  /**
   * @param successSound
   * @param failureSound
   * @param maintenanceSound
   */
  constructor( successSound: WrappedAudioBuffer, failureSound: WrappedAudioBuffer, maintenanceSound: WrappedAudioBuffer ) {

    // @public (read-only) {WrappedAudioBuffer}
    this.successSound = successSound;
    this.failureSound = failureSound;
    this.maintenanceSound = maintenanceSound;
  }
}

// TODO: How to do this? I think it should be
// const SUCCESS_SOUND_COLLECTION_MAP: Map<SuccessSoundFile, SuccessSoundCollection> = new Map();
// But typescript complains:  "TS2749: 'SuccessSoundFile' refers to a value, but is being used as a type here. Did you
// mean 'typeof SuccessSoundFile'?"
// See https://github.com/phetsims/quadrilateral/issues/27
const SUCCESS_SOUND_COLLECTION_MAP = new Map();

// @ts-ignore
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.ONE, new SuccessSoundCollection( quadIntoParallel001_mp3, quadOutOfParallel001_mp3, quadMovingInParallelSuccessLoop001_mp3 ) );

// @ts-ignore
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.TWO, new SuccessSoundCollection( quadIntoParallel002_mp3, quadOutOfParallel002_mp3, quadMovingInParallelSuccessLoop002_mp3 ) );

// @ts-ignore
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.THREE, new SuccessSoundCollection( quadIntoParallel003_mp3, quadOutOfParallel003_mp3, quadMovingInParallelSuccessLoop003_mp3 ) );

// @ts-ignore
SUCCESS_SOUND_COLLECTION_MAP.set( SuccessSoundFile.FOUR, new SuccessSoundCollection( quadIntoParallel004_mp3, quadOutOfParallel004_mp3, quadMovingInParallelSuccessLoop004_mp3 ) );

class QuadrilateralSoundOptionsModel {
  public soundDesignProperty: RichEnumerationProperty<SoundDesign>;
  public baseSoundFileProperty: RichEnumerationProperty<QuartetSoundFile>;
  public successSoundFileProperty: RichEnumerationProperty<SuccessSoundFile>;
  public maintenanceSoundRequiresEqualLengthsProperty: BooleanProperty;

  public static SoundDesign: SoundDesign;
  public static QuartetSoundFile: QuartetSoundFile;
  public static SuccessSoundFile: any;
  public static AUDIO_BUFFER_MAP: any;
  public static SUCCESS_SOUND_COLLECTION_MAP: any;

  constructor() {

    // The selected sound design, changing this will change the entire design.
    this.soundDesignProperty = new RichEnumerationProperty( SoundDesign.SUCCESS_SOUNDS );

    // Property that controls the base sound for a few of the prototypes. Some prototypes have a base sound and
    // the state of the sim changes the frequency and layering of the base sound. But there are a few base
    // sounds to choose frome.
    this.baseSoundFileProperty = new RichEnumerationProperty( QuartetSoundFile.FOUR );

    // For the "Success" sound prototype, a sound is played when reaching a parallelogram, leaving a parallelogram,
    // and when the parallelogram is maintained while the shape changes. Within this paradigm there are
    // different sound options for each of these to chose from.
    this.successSoundFileProperty = new RichEnumerationProperty( SuccessSoundFile.ONE );

    // For the "Success" sound prototype, when true the "maintenance" sound will only play when the
    // quadrilateral changes shape, remains a parallelogram, AND the lengths remain the same
    // during the interaction.
    this.maintenanceSoundRequiresEqualLengthsProperty = new BooleanProperty( false );
  }
}

// @public @static
QuadrilateralSoundOptionsModel.AUDIO_BUFFER_MAP = AUDIO_BUFFER_MAP;
QuadrilateralSoundOptionsModel.SUCCESS_SOUND_COLLECTION_MAP = SUCCESS_SOUND_COLLECTION_MAP;

quadrilateral.register( 'QuadrilateralSoundOptionsModel', QuadrilateralSoundOptionsModel );
export { SoundDesign };
export { SuccessSoundFile };
export { QuartetSoundFile };
export { SuccessSoundCollection };
export default QuadrilateralSoundOptionsModel;

// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetioObject from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import IOType from '../../../tandem/js/types/IOType.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import quadrilateral from '../quadrilateral.js';
import { SoundDesign } from './model/QuadrilateralSoundOptionsModel.js';

const QuadrilateralQueryParameters = QueryStringMachine.getAll( {

  // If provided, a graphic showing the area available for the vertex that is being dragged
  // is drawn on screen for debugging and demonstration purposes.
  showDragAreas: { type: 'flag' },

  // The tolerance interval for the angle calculations which determine when the quadrilateral is a parallelogram.
  // This is in radians, so it is limited between 0 and 2 PI. If maximum value, the quadrilateral will always
  // register as a parallelogram.
  parallelAngleToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.01
  },

  // The default value for the angle tolerance that will be used for single comparisons of one angle against
  // another. Mostly, this is used to determine the quadrilateral shape name. This must be different from
  // the parallelAngleToleranceInterval, which has complex behavior depending on mode of interaction.
  interAngleToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.02
  },

  // A tolerance interval when comparing an angle to a constant of some kind, such as Math.PI or Math.PI / 2 when
  // determining when angles are right or the shape is concave. This needs to be a separate value from
  // interAngleToleranceInterval because that value involves sums of values and errors get compounded.
  staticAngleToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.01
  },

  // A scale factor to apply to all tolerance intervals when the "Fine Input Spacing" checkbox is checked.
  // Should be less than one because we want the tolerance intervals to be smaller when using fine input.
  // See https://github.com/phetsims/quadrilateral/issues/197#issuecomment-1258194919
  fineInputSpacingToleranceIntervalScaleFactor: {
    type: 'number',
    isValidValue: ( value: number ) => value < 1,
    defaultValue: 0.2 // makes tolerances intervals 1/5 of the value when "fine input" enabled
  },

  // A scale factor applied to all tolerances when connected to a tangible device so that it is easier to find and
  // maintain shapes and important shape Properties for the more macroscopic motion inherent to a physical device.
  // Compounds with fineInputSpacingToleranceIntervalScaleFactor.
  connectedToleranceIntervalScaleFactor: {
    type: 'number',
    defaultValue: 5
  },

  // A tolerance interval for comparing lengths for the purposes of shape detection.
  shapeLengthToleranceInterval: {
    type: 'number',
    defaultValue: 0.005
  },

  // If provided, some extra things will be done in the simulation to facilitate communication with the hardware/device.
  deviceConnection: {
    type: 'flag'
  },

  // If provided, the simulation will act as a
  showModelValues: {
    type: 'flag'
  },

  // If provided, include experimental bluetooth features to connect to an external device that will control
  // the simulation with BLE communication.
  bluetooth: {
    type: 'flag'
  },

  // If true, a dialog will be shown at startup that will require the user to touch the screen.  This will allow the
  // haptics and sound to start as soon as the user begins to interact with the shape.  See
  // https://github.com/phetsims/quadrilateral/issues/148 for more information.
  showInitialTouchDialog: {
    type: 'flag'
  },

  // A query parameter to control the deviceGridSpacingProperty - constrains the vertex positions to intervals of this
  // value. Useful when connected to a device with noisy sensors because it requires larger changes in value to
  // update a vertex position.
  deviceGridSpacing: {
    type: 'number',
    defaultValue: 0.025,
    isValidValue: ( value: number ) => value <= 5 * 0.05
  },

  // How many values to save when smoothing vertex positions when connected to a bluetooth device. Note that
  // at this time this has no impact on the OpenCV prototype input. Only Bluetooth/Serial connections.
  smoothingLength: {
    type: 'number',
    defaultValue: 5,
    isValidValue: ( value: number ) => value > 0
  },

  // How frequently to update the sim from values provided with a bluetooth device, in seconds. Increasing this
  // may help reduce noise if random values come quickly into the simulation.
  bluetoothUpdateInterval: {
    type: 'number',
    defaultValue: 0.1,
    isValidValue: ( value: number ) => value > 0
  },

  // If present, a button to open a "sound board" dialog will be available to play sounds and example Voicing
  // strings used in this sim. This may be helpful for interviews if we decide to fake output by playing
  // sounds that match the user input.
  soundBoard: {
    type: 'flag'
  },

  // If present, a button in the Preferences dialog will be present to play a sound and graphical
  // marker to synchronize with any recordings.
  includeClapperButton: {
    type: 'flag'
  },

  // Sets the initial sound design on startup. Values are the enumeration values of
  // QuadrilateralSoundOptionsModel.SoundDesign as a string. See https://github.com/phetsims/quadrilateral/blob/master/js/quadrilateral/model/QuadrilateralSoundOptionsModel.ts#L37-L53
  soundDesign: {
    type: 'string',
    defaultValue: 'TRACKS_BUILD_UP_SIMPLE',
    validValues: SoundDesign.enumeration.keys
  },

  /**
   * Controls the interval that the Vertex will be constrained to
   */
  majorVertexInterval: {
    type: 'number',
    defaultValue: 0.05,
    isValidValue: ( value: number ) => value > 0
  },

  /**
   * Controls the "minor" vertex interval. This acts as the smaller keyboard step size for keyboard input. Note
   * that the default uses the same value as majorVertexInterval.
   */
  minorVertexInterval: {
    type: 'number',
    defaultValue: 0.05,
    isValidValue: ( value: number ) => value > 0
  },

  /**
   * The "major" vertex interval when the "fine" input spacing is selected from Preferences.
   * Value is in model coordinates.
   */
  majorFineVertexInterval: {
    type: 'number',
    defaultValue: 0.05,
    isValidValue: ( value: number ) => value > 0
  },

  /**
   * The "minor" vertex interval when the "fine" input spacing is selected from Preferences.
   * Value is in model coordinates.
   */
  minorFineVertexInterval: {
    type: 'number',
    defaultValue: 0.0125,
    isValidValue: ( value: number ) => value > 0
  },

  /**
   * Adds more to the QuadrilateralGridNode so that you can visualize the majorVertexInterval
   * and the minorVertexInterval, which determine where vertices are constrained to in model space.
   */
  showVertexGrid: {
    type: 'flag'
  }
} );

// Collection of properties that appear in ToleranceDefaults state object.
type ToleranceDefaultsCollection = {
  parallelAngleToleranceInterval: number;
  interAngleToleranceInterval: number;
  shapeLengthToleranceInterval: number;
};

// It was requested that the tolerance defaults are part of the data stream, this inner class accomplishes that. See
// https://github.com/phetsims/quadrilateral/issues/97#issuecomment-1125088255
class ToleranceDefaults extends PhetioObject {
  public constructor() {
    super( {
      tandem: Tandem.GLOBAL_MODEL.createTandem( 'ToleranceDefaults' ),
      phetioType: new IOType( 'ToleranceDefaultsIO', {
        isValidValue: _.stubTrue,

        toStateObject: ( object: ToleranceDefaults ) => object.toStateObject(),
        stateSchema: {
          parallelAngleToleranceInterval: NumberIO,
          interAngleToleranceInterval: NumberIO,
          shapeLengthToleranceInterval: NumberIO
        }
      } ),
      phetioState: true
    } );
  }

  public toStateObject(): ToleranceDefaultsCollection {
    return {
      parallelAngleToleranceInterval: QuadrilateralQueryParameters.parallelAngleToleranceInterval,
      interAngleToleranceInterval: QuadrilateralQueryParameters.interAngleToleranceInterval,
      shapeLengthToleranceInterval: QuadrilateralQueryParameters.shapeLengthToleranceInterval
    };
  }
}

// instantiate so it appears in PhET-iO state
const toleranceDefaults = new ToleranceDefaults(); //eslint-disable-line @typescript-eslint/no-unused-vars

quadrilateral.register( 'QuadrilateralQueryParameters', QuadrilateralQueryParameters );
export default QuadrilateralQueryParameters;

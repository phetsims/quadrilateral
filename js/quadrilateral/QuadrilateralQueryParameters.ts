// Copyright 2021-2023, University of Colorado Boulder

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

  // The tolerance interval for the angle calculations which determine when sides opposite sides are parallel.
  // This is in radians, so it is limited between 0 and 2 PI. If maximum value, the quadrilateral will always
  // be a parallelogram.
  parallelAngleToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.002
  },

  // The default value for the angle tolerance that will be used for single comparisons of one angle against
  // another. Mostly, this is used to determine the quadrilateral shape name. This must be different from
  // the parallelAngleToleranceInterval, which has complex behavior depending on mode of interaction.
  interAngleToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.004
  },

  // A tolerance interval when comparing an angle to a constant of some kind, such as Math.PI or Math.PI / 2 when
  // determining when angles are right or the shape is concave. This needs to be a separate value from
  // interAngleToleranceInterval because that value involves sums of values and errors get compounded.
  staticAngleToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.002
  },

  // When provided, vertices will snap to a much finer grid in the model. This lets you place vertices in many more
  // locations in the model, but it will become much more difficult to find named shapes because vertex locations
  // will be less precise (user has very fine control instead of automatically snapping to a coarse grid).
  reducedStepSize: {
    type: 'flag'
  },

  // A scale factor to apply to all tolerance intervals when the using ?reducedStepSize.
  // Should be less than one because we want the tolerance intervals to be smaller when using "reduced step size".
  // See https://github.com/phetsims/quadrilateral/issues/197#issuecomment-1258194919
  reducedStepSizeToleranceIntervalScaleFactor: {
    type: 'number',
    isValidValue: ( value: number ) => value < 1,
    defaultValue: 0.05 // makes tolerances intervals 5 percent of the value when "reduced step size" enabled
  },

  // A scale factor applied to all tolerances when connected to a tangible device so that it is easier to find and
  // maintain shapes and important shape Properties for the more macroscopic motion inherent to a physical device.
  // Compounds with reducedStepSizeToleranceIntervalScaleFactor.
  connectedToleranceIntervalScaleFactor: {
    type: 'number',
    defaultValue: 5
  },

  // A tolerance interval for comparing the lengths of two sides.
  interLengthToleranceInterval: {
    type: 'number',
    defaultValue: 0.001
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
    defaultValue: 0.25,
    isValidValue: ( value: number ) => value > 0
  },

  /**
   * Controls the "minor" vertex interval. This acts as the smaller keyboard step size for keyboard input. Note
   * that the default uses the same value as majorVertexInterval.
   */
  minorVertexInterval: {
    type: 'number',
    defaultValue: 0.0625,
    isValidValue: ( value: number ) => value > 0
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
      shapeLengthToleranceInterval: QuadrilateralQueryParameters.interLengthToleranceInterval
    };
  }
}

// instantiate so it appears in PhET-iO state
const toleranceDefaults = new ToleranceDefaults(); // eslint-disable-line @typescript-eslint/no-unused-vars

quadrilateral.register( 'QuadrilateralQueryParameters', QuadrilateralQueryParameters );
export default QuadrilateralQueryParameters;

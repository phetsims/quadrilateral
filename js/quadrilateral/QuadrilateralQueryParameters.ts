// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetioObject from '../../../tandem/js/PhetioObject.js';
import Tandem from '../../../tandem/js/Tandem.js';
import IOType from '../../../tandem/js/types/IOType.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';
import quadrilateral from '../quadrilateral.js';

const QuadrilateralQueryParameters = QueryStringMachine.getAll( {

  // If provided, a graphic showing the area available for the vertex that is being dragged
  // is drawn on screen for debugging and demonstration purposes.
  showDragAreas: { type: 'flag' },

  // Add some visual debugging to show the lengths that must be maintained to acheive the "maintain side
  // lengths while keeping a parallelogram" learning goal.
  showLengthAreas: { type: 'flag' },

  // The tolerance interval for the angle calculations which determine when the quadrilateral is a parallelogram.
  // This is in radians, so it is limited between 0 and 2 PI. If maximum value, the quadrilateral will always
  // register as a parallelogram.
  angleToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.01
  },

  // Behaves like angleToleranceInterval, but the default when connected to a tangible
  // controller for the sim. Default is a little larger than angleToleranceInterval
  // since the tangible is harder to control.
  deviceAngleToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.02
  },

  // A scale factor to apply to the tolerance intervals which determines when the quadrilateral is a
  // parallelogram. This is multiplied by the angleToleranceInterval when more than one vertex is dragged so
  // that it is easier to "stay" in parallelogram in that case. It is also used when connected to the tangible.
  // It should be larger than one so that the angleToleranceInterval is larger in these cases. See
  // QuadrilateralShapeModel for usage and more information.
  toleranceIntervalScaleFactor: {
    type: 'number',
    defaultValue: 10,
    isValidValue: ( value: number ) => value >= 1
  },

  // The default value for the angle tolerance that will be used for determining the named shape of the
  // quadrilateral. This must be different from the angleToleranceInterval, which use complex behavior
  // and values depending on how the shape is being interacted with. The angleToleranceInterval
  // can become infinite, which is not appropriate for detecting the shape name.
  shapeAngleToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.01
  },

  // The default value for the angleToleranceInterval when we are connected to the device. Otherwise
  // behaves like angleToleranceInterval.
  deviceShapeAngleToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.02
  },

  // The default value for the shapeLengthToleranceInterval when we are connected to the device. In general
  // the default value should be larger since fine-grained motion is difficult with the device. Otherwise behaves
  // like shapeLengthToleranceInterval.
  deviceShapeLengthToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.02
  },

  // The tolerance interval for the angle of tilt for sides.
  tiltToleranceInterval: {
    type: 'number',
    isValidValue: ( value: number ) => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.2
  },

  // A scale factor for the tolerance interval for comparing lengths in the model, relative to the
  // length of one side. For example, two sides will be considered equal in length when both sides
  // have a same length within ( length * lengthToleranceIntervalScaleFactor).
  lengthToleranceIntervalScaleFactor: {
    type: 'number',
    isValidValue: ( value: number ) => value <= 1 && value >= 0,
    defaultValue: 0.05
  },

  // A tolerance interval for comparing lengths for the purposes of shape detection.
  shapeLengthToleranceInterval: {
    type: 'number',
    defaultValue: 0.01
  },

  // A flag that controls when the "maintenance" sound is played. When provided, the success sound for maintenance
  // will only play when changing the shape, while in parallelogram, while also keeping side lengths the same.
  // Otherwise, it will be played when changing shape and keeping n parallelogram. This can also be enabled/disabled
  // from preferences.
  equalLengthsForMaintenanceSound: {
    type: 'flag'
  },

  // If provided, some extra things will be done in the simulation to facilitate communication with the hardware/device.
  deviceConnection: {
    type: 'flag'
  },

  // If provided, some extra things will be done in the simulation to test connection with a device. The sim will
  // have two screens, one that acts as the "simulation" and the other that acts as the "device". The "device" screen
  // runs in one iframe and the simulation screen runs in another. The two communicat to test calibration/communication.
  calibrationDemo: {
    type: 'flag'
  },

  // If provided, the simulation will act as a "device" to be used in the calibration demo. The model bounds will be
  // adjusted slightly to look more like a physical device.
  calibrationDemoDevice: {
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

  // If true, some additional graphical and auditory feedback will be provided when the quad becomes
  // a named shape like rectangle or kite or trapezoid.
  shapeIdentificationFeedback: {
    type: 'boolean',
    defaultValue: false
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

  // If present, a prototype with mediapipe will be available for use to play with here. Forefiger and thumb on
  // each hand control positions of each vertex.
  mediaPipe: {
    type: 'flag'
  }
} );

// Collection of properties that appear in ToleranceDefaults state object.
type ToleranceDefaultsCollection = {
  angleToleranceInterval: number;
  deviceAngleToleranceInterval: number;
  toleranceIntervalScaleFactor: number;
  shapeAngleToleranceInterval: number;
  deviceShapeAngleToleranceInterval: number;
  deviceShapeLengthToleranceInterval: number;
  lengthToleranceIntervalScaleFactor: number;
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
          angleToleranceInterval: NumberIO,
          deviceAngleToleranceInterval: NumberIO,
          toleranceIntervalScaleFactor: NumberIO,
          shapeAngleToleranceInterval: NumberIO,
          deviceShapeAngleToleranceInterval: NumberIO,
          deviceShapeLengthToleranceInterval: NumberIO,
          lengthToleranceIntervalScaleFactor: NumberIO,
          shapeLengthToleranceInterval: NumberIO
        }
      } ),
      phetioState: true
    } );
  }

  public toStateObject(): ToleranceDefaultsCollection {
    return {
      angleToleranceInterval: QuadrilateralQueryParameters.angleToleranceInterval,
      deviceAngleToleranceInterval: QuadrilateralQueryParameters.deviceAngleToleranceInterval,
      toleranceIntervalScaleFactor: QuadrilateralQueryParameters.toleranceIntervalScaleFactor,
      shapeAngleToleranceInterval: QuadrilateralQueryParameters.shapeAngleToleranceInterval,
      deviceShapeAngleToleranceInterval: QuadrilateralQueryParameters.deviceShapeAngleToleranceInterval,
      deviceShapeLengthToleranceInterval: QuadrilateralQueryParameters.deviceShapeLengthToleranceInterval,
      lengthToleranceIntervalScaleFactor: QuadrilateralQueryParameters.lengthToleranceIntervalScaleFactor,
      shapeLengthToleranceInterval: QuadrilateralQueryParameters.shapeLengthToleranceInterval
    };
  }
}

// instantiate so it appears in PhET-iO state
const toleranceDefaults = new ToleranceDefaults(); //eslint-disable-line @typescript-eslint/no-unused-vars

quadrilateral.register( 'QuadrilateralQueryParameters', QuadrilateralQueryParameters );
export default QuadrilateralQueryParameters;

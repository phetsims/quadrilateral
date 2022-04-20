// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../quadrilateral.js';

const QuadrilateralQueryParameters = QueryStringMachine.getAll( {

  // Testing query parameters to only include one side at a time. You can use each of these in combination.
  // These were added to support development of the sound design. It was difficult to understand what was
  // happening with sound and the ability to isolate each side made it easier.
  rightSide: { type: 'flag' },
  leftSide: { type: 'flag' },
  topSide: { type: 'flag' },
  bottomSide: { type: 'flag' },

  // If provided, a graphic showing the area available for the vertex that is being dragged
  // is drawn on screen for debugging and demonstration purposes.
  showDragAreas: { type: 'flag' },

  showLengthAreas: { type: 'flag' },

  // If provided, a graphic showing the grid to visualize allowable vertex positions is displayed.
  showGrid: { type: 'flag' },

  // The tolerance interval for the angle calculations which determine when the quadrilateral is a parallelogram.
  // This is in radians, so it is limited between 0 and 2 PI. If maximum value, the quadrilateral will always
  // register as a parallelogram.
  angleToleranceInterval: {
    type: 'number',
    isValidValue: value => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.01
  },

  // A scale factor to apply to the angle tolerance interval which determines when the quadrilateral is a
  // parallelogram. This is multiplied by the angleToleranceInterval when more than one vertex is dragged so
  // that it is easier to "stay" in parallelogram in that case. It should be larger than one so that the
  // angleToleranceInterval is larger in these cases. See QuadrilateralShapeModel for usage and more information.
  angleToleranceIntervalScaleFactor: {
    type: 'number',
    defaultValue: 10,
    isValidValue: value => value >= 1
  },

  shapeAngleToleranceInterval: {
    type: 'number',
    isValidValue: value => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.01
  },

  // The tolerance interval for the angle of tilt for sides.
  tiltToleranceInterval: {
    type: 'number',
    isValidValue: value => value <= ( 2 * Math.PI ) && value >= 0,
    defaultValue: 0.2
  },

  // A scale factor for the tolerance interval for comparing lengths in the model, relative to the
  // length of one side. For example, two sides will be considered equal in length when both sides
  // have a same length within ( length * lengthToleranceIntervalScaleFactor).
  lengthToleranceIntervalScaleFactor: {
    type: 'number',
    isValidValue: value => value <= 1 && value >= 0,
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

  // If provided, we will also support marker input. Currently, this will just look for a single
  // marker and apply rotation to the shape.
  markerInput: {
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
  }
} );

quadrilateral.register( 'QuadrilateralQueryParameters', QuadrilateralQueryParameters );
export default QuadrilateralQueryParameters;

// Copyright 2021, University of Colorado Boulder

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

  // If provided, a temporary graphic to indicate vertex locations will be included. There is no graphical
  // design yet and we don't want to create one yet. This lets us test mouse/touch input without showing
  // a detailed graphic that would overly influence design of other modailities.
  showVertices: { type: 'flag' },

  // If provided, a graphic showing the area available for the vertex that is being dragged
  // is drawn on screen for debugging and demonstration purposes.
  showDragAreas: { type: 'flag' },

  // The tolerance interval for the angle calculations which determine when the quadrilateral is a parallelogram.
  // This is in radians, so it is limited between 0 and 2 PI. If maximum value, the quadrilateral will always
  // register as a parallelogram.
  angleToleranceInterval: {
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
    defaultValue: 0.2
  }
} );

quadrilateral.register( 'QuadrilateralQueryParameters', QuadrilateralQueryParameters );
export default QuadrilateralQueryParameters;

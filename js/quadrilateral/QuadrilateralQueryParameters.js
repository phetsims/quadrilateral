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

  // if provided, a second screen is added to support a demo for calibrating the sim to an external device,
  // giving us the information to set the positions of vertices in the sim from length and angle information
  // from a device
  calibrationDemo: { type: 'flag' },

  // If provided, the model will change slightly to act more like a "physical" device. The model coordinates
  // may change from arbitrary model space to example coordinates provided by the device. To be used in combination
  // with calibrationDemo, since one of the screens needs to act more like the device.
  calibrationDemoDevice: { type: 'flag' }
} );

quadrilateral.register( 'QuadrilateralQueryParameters', QuadrilateralQueryParameters );
export default QuadrilateralQueryParameters;

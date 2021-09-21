// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../quadrilateral.js';

const QuadrilateralQueryParameters = QueryStringMachine.getAll( {

  rightSide: { type: 'flag' },
  leftSide: { type: 'flag' },
  topSide: { type: 'flag' },
  bottomSide: { type: 'flag' }
} );

quadrilateral.register( 'QuadrilateralQueryParameters', QuadrilateralQueryParameters );
export default QuadrilateralQueryParameters;

// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../quadrilateral.js';

const QuadrilateralQueryParameters = QueryStringMachine.getAll( {

  rightSide: { type: 'flag' },
  leftSide: { type: 'flag' },
  topSide: { type: 'flag' },
  bottomSide: { type: 'flag' },

  ipAddress: {
    type: 'string',
    defaultValue: '',
    isValidValue: value => {

      // the ipAddress has 10 values and 3 separators
      return value.length === 0 || ( value.length === 13 && !value.includes( '.' ) );
    }
  },
  port: { type: 'string', defaultValue: '' }
} );

quadrilateral.register( 'QuadrilateralQueryParameters', QuadrilateralQueryParameters );
export default QuadrilateralQueryParameters;

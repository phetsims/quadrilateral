// Copyright 2020-2021, University of Colorado Boulder

/**
 * TODO: How will we do strings with TypeScript? See https://github.com/phetsims/quadrilateral/issues/27.
 */

import getStringModule from '../../chipper/js/getStringModule.js';
import quadrilateral from './quadrilateral.js';

const quadrilateralStrings = getStringModule( 'QUADRILATERAL' ) as any;

quadrilateral.register( 'quadrilateralStrings', quadrilateralStrings );

export default quadrilateralStrings;

// Copyright 2021-2022, University of Colorado Boulder

/**
 * Defines the colors for this sim.
 *
 * All simulations should have a Colors.js file, see https://github.com/phetsims/scenery-phet/issues/642.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Edit" mode.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import quadrilateral from '../quadrilateral.js';

const QuadrilateralColors = {

  // Background color that for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( quadrilateral, 'background', {
    default: new Color( 167, 167, 255 )
  } ),

  // Color for vertices and sides of the quadrilateral shape.
  quadrilateralShapeColorProperty: new ProfileColorProperty( quadrilateral, 'quadrilateralShape', {
    default: new Color( 255, 217, 102 )
  } ),

  // Color for strokes of the quadrilateral shape
  quadrilateralShapeStrokeColorProperty: new ProfileColorProperty( quadrilateral, 'quadrilateralShapeStroke', {
    default: 'black'
  } ),

  // Color for the dark segments of the angle guides
  angleGuideDarkColorProperty: new ProfileColorProperty( quadrilateral, 'angleGuideDark', {
    default: new Color( 100, 100, 100 )
  } ),

  // Color for the light segments of the angle guides
  angleGuideLightColorProperty: new ProfileColorProperty( quadrilateral, 'angleGuideLight', {
    default: 'white'
  } ),

  // Color for the stroke around angle guide shapes
  angleGuideStrokeColorProperty: new ProfileColorProperty( quadrilateral, 'angleGuideStroke', {
    default: 'black'
  } )
};

quadrilateral.register( 'QuadrilateralColors', QuadrilateralColors );
export default QuadrilateralColors;
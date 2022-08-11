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

  // Background color for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( quadrilateral, 'background', {
    default: new Color( 133, 133, 255 )
  } ),

  // Color for the grid in the play area
  gridColorProperty: new ProfileColorProperty( quadrilateral, 'grid', {
    default: 'white'
  } ),

  // Color for vertices and sides of the quadrilateral shape.
  quadrilateralShapeColorProperty: new ProfileColorProperty( quadrilateral, 'quadrilateralShape', {
    default: new Color( 255, 217, 102 )
  } ),

  // Color for vertices and sides of the quadrilateral shape when we are a parallelogram.
  quadrilateralParallelogramShapeColorProperty: new ProfileColorProperty( quadrilateral, 'quadrilateralShapeParallelogram', {
    default: new Color( 21, 255, 127 )
  } ),

  // The color for the quadrilateral when you hit a "named" shape but we are still not a parallelogram
  quadrilateralNamedShapeColorProperty: new ProfileColorProperty( quadrilateral, 'quadrilateralNamedShape', {
    default: new Color( 255, 239, 189 )
  } ),

  // Color for strokes of the quadrilateral shape
  quadrilateralShapeStrokeColorProperty: new ProfileColorProperty( quadrilateral, 'quadrilateralShapeStroke', {
    default: 'black'
  } ),

  // Color for the dark segments of the angle guides
  cornerGuideDarkColorProperty: new ProfileColorProperty( quadrilateral, 'cornerGuideDark', {
    default: new Color( 100, 100, 100 )
  } ),

  // Color for the light segments of the angle guides
  cornerGuideLightColorProperty: new ProfileColorProperty( quadrilateral, 'cornerGuideLight', {
    default: 'white'
  } ),

  // Color for the stroke around angle guide shapes
  cornerGuideStrokeColorProperty: new ProfileColorProperty( quadrilateral, 'cornerGuideStroke', {
    default: 'black'
  } ),

  // Color for the stroke around right angle indicator
  rightAngleIndicatorStrokeColorProperty: new ProfileColorProperty( quadrilateral, 'rightAngleIndicatorStroke', {
    default: 'black'
  } ),

  // Color for the stroke for the diagonal guides
  diagonalGuidesStrokeColorProperty: new ProfileColorProperty( quadrilateral, 'diagonalGuideStroke', {
    default: new Color( 64, 64, 64 )
  } ),

  panelFillColorProperty: new ProfileColorProperty( quadrilateral, 'panelFillColor', {
    default: 'white'
  } ),

  panelStrokeColorProperty: new ProfileColorProperty( quadrilateral, 'panelStrokeColor', {
    default: 'black'
  } ),

  playAreaStrokeColorProperty: new ProfileColorProperty( quadrilateral, 'playAreaStrokeColor', {
    default: 'white'
  } ),

  playAreaFillColorProperty: new ProfileColorProperty( quadrilateral, 'playAreaFillColor', {
    default: new Color( 133, 133, 255 )
  } ),

  // Fill color for the "Corner Labels" checkbox icon.
  visibilityIconsColorProperty: new ProfileColorProperty( quadrilateral, 'visibilityIconsColorProperty', {
    default: new Color( 'black' )
  } )
};

quadrilateral.register( 'QuadrilateralColors', QuadrilateralColors );
export default QuadrilateralColors;
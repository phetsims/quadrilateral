// Copyright 2021, University of Colorado Boulder

/**
 * A map that will give us a description of how close two sides are to being in parallel.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../dot/js/Range.js';
import quadrilateral from './quadrilateral.js';
import QuadrilateralStrings from './QuadrilateralStrings.js';

const extremelyFarFromStringString = QuadrilateralStrings.a11y.voicing.transformations.extremelyFarFrom;
const extremelyFarFromString = QuadrilateralStrings.a11y.voicing.transformations.extremelyFarFrom;
const veryFarFromString = QuadrilateralStrings.a11y.voicing.transformations.veryFarFrom;
const farFromString = QuadrilateralStrings.a11y.voicing.transformations.farFrom;
const notSoCloseToString = QuadrilateralStrings.a11y.voicing.transformations.notSoCloseTo;
const somewhatCloseToString = QuadrilateralStrings.a11y.voicing.transformations.somewhatCloseTo;
const veryCloseToString = QuadrilateralStrings.a11y.voicing.transformations.veryCloseTo;
const extremelyCloseToString = QuadrilateralStrings.a11y.voicing.transformations.extremelyCloseTo;

const PARALLEL_PROXIMITY_STRINGS = [
  extremelyCloseToString,
  veryCloseToString,
  somewhatCloseToString,
  notSoCloseToString,
  farFromString,
  veryFarFromString,
  extremelyFarFromString,
  extremelyFarFromStringString
];

const ParallelProximityStringMap = new Map<Range, string>();

const delta = ( Math.PI / 2 ) / PARALLEL_PROXIMITY_STRINGS.length;
PARALLEL_PROXIMITY_STRINGS.forEach( ( proximityString, i ) => {
  ParallelProximityStringMap.set( new Range( i * delta, ( i + 1 ) * delta ), PARALLEL_PROXIMITY_STRINGS[ i ] );
} );

quadrilateral.register( 'ParallelProximityStringMap', ParallelProximityStringMap );
export default ParallelProximityStringMap;

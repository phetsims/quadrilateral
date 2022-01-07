// Copyright 2021-2022, University of Colorado Boulder

/**
 * An enumeration for the kinds of named quadrilaterals that can be detected based on the properties
 * of the quadrilateral shape.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import quadrilateral from '../../quadrilateral.js';

const NamedQuadrilateral = EnumerationDeprecated.byKeys( [
  'SQUARE',
  'RECTANGLE',
  'RHOMBUS',
  'KITE',
  'ISOSCELES_TRAPEZOID',
  'TRAPEZOID',
  'CONCAVE'
] );

quadrilateral.register( 'NamedQuadrilateral', NamedQuadrilateral );
export default NamedQuadrilateral;

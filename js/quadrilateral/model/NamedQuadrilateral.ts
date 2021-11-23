// Copyright 2021, University of Colorado Boulder

/**
 * An enumeration for the kinds of named quadrilaterals that can be detected based on the properties
 * of the quadrilateral shape.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import quadrilateral from '../../quadrilateral.js';

const NamedQuadrilateral = Enumeration.byKeys( [
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

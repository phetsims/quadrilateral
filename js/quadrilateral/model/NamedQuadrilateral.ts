// Copyright 2021-2022, University of Colorado Boulder

/**
 * An enumeration for the kinds of named quadrilaterals that can be detected based on the properties
 * of the quadrilateral shape.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quadrilateral from '../../quadrilateral.js';

class NamedQuadrilateral extends EnumerationValue {
  static SQUARE = new NamedQuadrilateral();
  static RECTANGLE = new NamedQuadrilateral();
  static RHOMBUS = new NamedQuadrilateral();
  static KITE = new NamedQuadrilateral();
  static ISOSCELES_TRAPEZOID = new NamedQuadrilateral();
  static TRAPEZOID = new NamedQuadrilateral();
  static CONCAVE = new NamedQuadrilateral();

  // Gets a list of keys, values and mapping between them.  For use in EnumerationProperty and PhET-iO
  static enumeration = new Enumeration( NamedQuadrilateral, {
    phetioDocumentation: 'Possible named shapes for the quadrilateral.'
  } );
}

quadrilateral.register( 'NamedQuadrilateral', NamedQuadrilateral );
export default NamedQuadrilateral;

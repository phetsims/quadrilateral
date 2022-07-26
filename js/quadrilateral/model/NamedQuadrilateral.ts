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
  public static SQUARE = new NamedQuadrilateral();
  public static RECTANGLE = new NamedQuadrilateral();
  public static RHOMBUS = new NamedQuadrilateral();
  public static KITE = new NamedQuadrilateral();
  public static ISOSCELES_TRAPEZOID = new NamedQuadrilateral();
  public static TRAPEZOID = new NamedQuadrilateral();
  public static CONCAVE_QUADRILATERAL = new NamedQuadrilateral();
  public static CONVEX_QUADRILATERAL = new NamedQuadrilateral();

  // Gets a list of keys, values and mapping between them.  For use in EnumerationProperty and PhET-iO
  public static enumeration = new Enumeration( NamedQuadrilateral, {
    phetioDocumentation: 'Possible named shapes for the quadrilateral.'
  } );
}

quadrilateral.register( 'NamedQuadrilateral', NamedQuadrilateral );
export default NamedQuadrilateral;

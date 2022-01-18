// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quadrilateral from '../../quadrilateral.js';

class VertexLabel extends EnumerationValue {
  static VERTEX1 = new VertexLabel();
  static VERTEX2 = new VertexLabel();
  static VERTEX3 = new VertexLabel();
  static VERTEX4 = new VertexLabel();

  static enumeration = new Enumeration( VertexLabel );
}

quadrilateral.register( 'VertexLabel', VertexLabel );
export default VertexLabel;

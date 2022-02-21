// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quadrilateral from '../../quadrilateral.js';

class VertexLabel extends EnumerationValue {
  static VERTEX_A = new VertexLabel();
  static VERTEX_B = new VertexLabel();
  static VERTEX_C = new VertexLabel();
  static VERTEX_D = new VertexLabel();

  static enumeration = new Enumeration( VertexLabel );
}

quadrilateral.register( 'VertexLabel', VertexLabel );
export default VertexLabel;

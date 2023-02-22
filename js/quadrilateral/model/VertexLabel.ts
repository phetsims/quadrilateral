// Copyright 2022, University of Colorado Boulder

/**
 * It is useful to know the identity of a particular Vertex, so a VertexLabel can be assigned to a particular Vertex.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quadrilateral from '../../quadrilateral.js';

class VertexLabel extends EnumerationValue {
  public static readonly VERTEX_A = new VertexLabel();
  public static readonly VERTEX_B = new VertexLabel();
  public static readonly VERTEX_C = new VertexLabel();
  public static readonly VERTEX_D = new VertexLabel();

  public static readonly enumeration = new Enumeration( VertexLabel );
}

quadrilateral.register( 'VertexLabel', VertexLabel );
export default VertexLabel;

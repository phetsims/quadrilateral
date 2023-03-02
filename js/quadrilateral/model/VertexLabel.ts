// Copyright 2022-2023, University of Colorado Boulder

/**
 * It is useful to know the identity of a particular QuadrilateralVertex, this enumeration supports that.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quadrilateral from '../../quadrilateral.js';

export default class VertexLabel extends EnumerationValue {
  public static readonly VERTEX_A = new VertexLabel();
  public static readonly VERTEX_B = new VertexLabel();
  public static readonly VERTEX_C = new VertexLabel();
  public static readonly VERTEX_D = new VertexLabel();

  public static readonly enumeration = new Enumeration( VertexLabel );
}

quadrilateral.register( 'VertexLabel', VertexLabel );

// Copyright 2022, University of Colorado Boulder

/**
 * A pair of vertices that have some relationship. For example, they could be adjacent or opposite to each other
 * when assembled in the quadrilateral shape.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import Vertex from './Vertex.js';

class VertexPair {
  public readonly vertex1: Vertex;
  public readonly vertex2: Vertex;

  public constructor( vertex1: Vertex, vertex2: Vertex ) {
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
  }

  public includesVertex( side: Vertex ): boolean {
    return this.vertex1 === side || this.vertex2 === side;
  }
}

quadrilateral.register( 'VertexPair', VertexPair );
export default VertexPair;

// Copyright 2022-2023, University of Colorado Boulder

/**
 * A pair of vertices that have some relationship. For example, they could be adjacent or opposite to each other
 * when assembled in the quadrilateral shape.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralVertex from './QuadrilateralVertex.js';

// REVIEW: Should we create UnorderedPair<T> which could be Side or Vertex? - Yes! Ill give it a shot.
export default class VertexPair {
  public readonly vertex1: QuadrilateralVertex;
  public readonly vertex2: QuadrilateralVertex;

  public constructor( vertex1: QuadrilateralVertex, vertex2: QuadrilateralVertex ) {
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
  }

  /**
   * Returns true if the other VertexPair is equal ot this VertexPair (order for vertex1 and vertex2 independent).
   */
  public equals( otherPair: VertexPair ): boolean {
    return ( this.vertex1 === otherPair.vertex1 && this.vertex2 === otherPair.vertex2 ) ||
           ( this.vertex2 === otherPair.vertex1 && this.vertex1 === otherPair.vertex2 );
  }

  /**
   * Returns true if this VertexPair includes the provided QuadrilateralVertex.
   */
  public includesVertex( vertex: QuadrilateralVertex ): boolean {
    return this.vertex1 === vertex || this.vertex2 === vertex;
  }
}

quadrilateral.register( 'VertexPair', VertexPair );

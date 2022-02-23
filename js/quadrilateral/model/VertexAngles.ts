// Copyright 2022, University of Colorado Boulder

/**
 * A class that is a collection of vertex angles at a snapshot in time. Used to compare how the collection
 * of vertex angles have changed over time or between interactions.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';

class VertexAngles {
  public readonly vertexAAngle: number;
  public readonly vertexBAngle: number;
  public readonly vertexCAngle: number;
  public readonly vertexDAngle: number;

  constructor( vertexAAngle: number, vertexBAngle: number, vertexCAngle: number, vertexDAngle: number ) {
    this.vertexAAngle = vertexAAngle;
    this.vertexBAngle = vertexBAngle;
    this.vertexCAngle = vertexCAngle;
    this.vertexDAngle = vertexDAngle;
  }
}

quadrilateral.register( 'VertexAngles', VertexAngles );
export default VertexAngles;

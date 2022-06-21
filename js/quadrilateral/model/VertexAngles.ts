// Copyright 2022, University of Colorado Boulder

/**
 * A class that is a collection of vertex angles at a snapshot in time. Used to compare how the collection
 * of vertex angles have changed over time or between interactions.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';

type numberOrNull = number | null;

class VertexAngles {
  public readonly vertexAAngle: numberOrNull;
  public readonly vertexBAngle: numberOrNull;
  public readonly vertexCAngle: numberOrNull;
  public readonly vertexDAngle: numberOrNull;

  public constructor( vertexAAngle: numberOrNull, vertexBAngle: numberOrNull, vertexCAngle: numberOrNull, vertexDAngle: numberOrNull ) {
    this.vertexAAngle = vertexAAngle;
    this.vertexBAngle = vertexBAngle;
    this.vertexCAngle = vertexCAngle;
    this.vertexDAngle = vertexDAngle;
  }
}

quadrilateral.register( 'VertexAngles', VertexAngles );
export default VertexAngles;

// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import CollisionBody from './CollisionBody.js';

class BoundsCollisionBody extends CollisionBody {
  public constructor( minX: number, minY: number, maxX: number, maxY: number ) {

    const data = new SAT.Polygon(
      new SAT.Vector( 0, 0 ),
      [
        new SAT.Vector( minX, minY ),
        new SAT.Vector( maxX, minY ),
        new SAT.Vector( maxX, maxY ),
        new SAT.Vector( minX, maxY )
      ]
    );

    super( data );
  }
}

quadrilateral.register( 'BoundsCollisionBody', BoundsCollisionBody );
export default BoundsCollisionBody;

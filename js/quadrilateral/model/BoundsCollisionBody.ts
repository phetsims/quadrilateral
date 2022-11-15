// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import CollisionBody from './CollisionBody.js';

class BoundsCollisionBody extends CollisionBody {
  public constructor( x: number, y: number, width: number, height: number ) {

    const data = new SAT.Polygon(
      new SAT.Vector( x, y ),
      [
        new SAT.Vector( 0, 0 ),
        new SAT.Vector( width, 0 ),
        new SAT.Vector( width, height ),
        new SAT.Vector( 0, height )
      ]
    );

    super( data );
  }

  public static createBoundsData( x, y, width, height ) {

  }
}

quadrilateral.register( 'BoundsCollisionBody', BoundsCollisionBody );
export default BoundsCollisionBody;

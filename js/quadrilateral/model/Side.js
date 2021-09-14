// Copyright 2021, University of Colorado Boulder

/**
 * The model for a side of the quadrilateral, between two Vertices.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quadrilateral from '../../quadrilateral.js';

class Side {

  /**
   * @param {Vertex} vertex1
   * @param {Vertex} vertex2
   * @param {Tandem} tandem
   */
  constructor( vertex1, vertex2, tandem ) {

    // @public {Vertex}
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;

    // @private - Has this side been connected to another to form a shape?
    this.isConnected = false;

    // @public {DerivedProperty} - The slope between the vertices in model space.
    this.slopeProperty = new DerivedProperty( [ this.vertex2.positionProperty, this.vertex1.positionProperty ], ( vertex2Position, vertex1Position ) => {
      return ( vertex2Position.y - vertex1Position.y ) / ( vertex2Position.x - vertex1Position.x );
    }, {
      tandem: tandem.createTandem( 'slopeProperty' ),
      phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
    } );

    // @public {DerivedProperty.<number>} - The distance between the two vertices, in model space.
    this.lengthProperty = new DerivedProperty( [ this.vertex2.positionProperty, this.vertex1.positionProperty ], ( vertex2Position, vertex1Position ) => {
      return Vector2.getDistanceBetweenVectors( vertex2Position, vertex1Position );
    }, {
      tandem: tandem.createTandem( 'lengthProperty' ),
      phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
    } );
  }


  /**
   * Connect this side to another to form a shape. Connects this.vertex1 to otherSide.vertex2, illustrated like this.
   * Be aware of this as you use this function to build a shape because it will change how angles are calculated.
   *
   *  otherSide.vertex1---------------otherSide.vertex2
   *                                  thisSide.vertex1
   *                                    |
   *                                    |
   *                                    |
   *                                    |
   *                                  this.vertex2
   *
   * @param {Side} otherSide
   * @public
   */
  connectToSide( otherSide ) {
    assert && assert( !this.isConnected, 'Cannot connect a side that is already connected to another.' );
    assert && assert( otherSide !== this, 'Cannot connect a side to itself.' );

    this.isConnected = true;
    this.vertex1.connectToOthers( otherSide.vertex1, this.vertex2 );
  }
}

quadrilateral.register( 'Side', Side );
export default Side;

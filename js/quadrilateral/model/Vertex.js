// Copyright 2021, University of Colorado Boulder

/**
 * A model component for a Vertex of the Quadrilateral.
 *
 * @author Jesse Greenberg
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quadrilateral from '../../quadrilateral.js';

class Vertex {

  /**
   * @param {Vector2} initialPosition
   * @param {Bounds2} bounds
   * @param {Tandem} tandem
   */
  constructor( initialPosition, bounds, tandem ) {

    // @public {Vector2Property} - the position of this vertex in model space
    this.positionProperty = new Vector2Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' ),
      validBounds: bounds
    } );

    // @public {DerivedProperty.<number>|null} - the angle at this vertex of the quadrilateral, null until
    // this vertex is connected to two others because we need three points to form the angle
    this.angleProperty = null;

    // @private {Tandem}
    this.tandem = tandem;
  }

  /**
   * Reset this vertex.
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }

  /**
   * Connect this vertex to two others to form an angle and sides of the quadrilateral.
   * Uses the law of cosines to calculate the angle, assuming vertex positions like this:
   *
   *        thisVertex
   *          /       \
   *   sideA /         \ sideB
   *        /           \
   *     vertex1 ----- vertex2
   *             sideC
   *
   * See https://en.wikipedia.org/wiki/Law_of_cosines
   * @public
   *
   * @param {Vertex} vertex1
   * @param {Vertex} vertex2
   */
  connectToOthers( vertex1, vertex2 ) {

    this.angleProperty = new DerivedProperty( [ vertex1.positionProperty, this.positionProperty, vertex2.positionProperty ], ( vertex1Position, thisPosition, vertex2Position ) => {
      const sideA = vertex1Position.distance( thisPosition );
      const sideB = vertex2Position.distance( thisPosition );
      const sideC = vertex2Position.distance( vertex1Position );

      return Math.acos( ( ( sideA * sideA ) + ( sideB * sideB ) - ( sideC * sideC ) ) / ( 2 * sideA * sideB ) );
    }, {
      tandem: this.tandem.createTandem( 'angleProperty' ),
      phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
    } );
  }
}

quadrilateral.register( 'Vertex', Vertex );
export default Vertex;
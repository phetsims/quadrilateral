// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import quadrilateral from '../../quadrilateral.js';
import Vertex from './Vertex.js';

class QuadrilateralModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Vertex}
    this.vertex1 = new Vertex( new Vector2( -0.5, 0.5 ), new Bounds2( -1, 0, 0, 1 ), tandem.createTandem( 'vertex1' ) );
    this.vertex2 = new Vertex( new Vector2( 0.5, 0.5 ), new Bounds2( 0, 0, 1, 1 ), tandem.createTandem( 'vertex2' ) );
    this.vertex3 = new Vertex( new Vector2( 0.5, -0.5 ), new Bounds2( 0, -1, 1, 0 ), tandem.createTandem( 'vertex3' ) );
    this.vertex4 = new Vertex( new Vector2( -0.5, -0.5 ), new Bounds2( -1, -1, 0, 0 ), tandem.createTandem( 'vertex4' ) );

    // connect vertices to form the quadrilateral shape and initialize angles
    this.vertex1.connectToOThers( this.vertex4, this.vertex2 );
    this.vertex2.connectToOThers( this.vertex1, this.vertex3 );
    this.vertex3.connectToOThers( this.vertex2, this.vertex4 );
    this.vertex4.connectToOThers( this.vertex3, this.vertex1 );

    // @public {NumberProperty} - A value that controls the threshold for equality when determining
    // if the quadrilateral forms a parallelogram. Without a margin of error it would be exceedingly
    // difficult to create a parallelogram shape. It is unclear whether this need to change, but
    // it seems useful now to be able to easily change this value during development.
    this.angleEqualityEpsilonProperty = new NumberProperty( 0.1, {
      tandem: tandem.createTandem( 'angleEqualityEpsilonProperty' ),
      range: new Range( 0.01, 0.3 )
    } );

    // @public {DerivedProperty.<boolean>} - A value that indicates that the quadrilateral is
    // curently a parallelogram. We assume that the quad is a parallelogram if oposite angles
    // are equal within a margin of error.
    this.isParallelogramProperty = new DerivedProperty( [
      this.vertex1.angleProperty,
      this.vertex2.angleProperty,
      this.vertex3.angleProperty,
      this.vertex4.angleProperty,
      this.angleEqualityEpsilonProperty
    ], ( angle1, angle2, angle3, angle4, epsilon ) => {
      return Utils.equalsEpsilon( angle1, angle3, epsilon ) && Utils.equalsEpsilon( angle2, angle4, epsilon );
    }, {
      tandem: tandem.createTandem( 'isParallelogramProperty' ),
      phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
    } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.vertex1.reset();
    this.vertex2.reset();
    this.vertex3.reset();
    this.vertex4.reset();
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

quadrilateral.register( 'QuadrilateralModel', QuadrilateralModel );
export default QuadrilateralModel;
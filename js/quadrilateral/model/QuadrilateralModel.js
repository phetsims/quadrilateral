// Copyright 2021, University of Colorado Boulder

/**
 * The base model class for Quadrilateral. Assembles all model components and responsible for managing Properties
 * that indicate the state of the whole Quadrilateral shape. Will probably also manage Properties that manage
 * the state of the Sim (UI element visibility and so on).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
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

    // {DerivedProperty.<boolean} - Values that represents the difference of opposing angles, in radians. When both of
    // these values becomes less than this.angleEqualityEpsilonProperty the quad is considered to be a parallelogram.
    // These values are pulled out as Properties from the isParallelogramProperty calculation because it is expected
    // that we will add sounds to represent the differences in these values.
    const angle1DiffAngle3Property = new DerivedProperty( [ this.vertex1.angleProperty, this.vertex2.angleProperty ], ( angle1, angle3 ) => {
      return Math.abs( angle1 - angle3 );
    } );
    const angle2DiffAngle4Property = new DerivedProperty( [ this.vertex2.angleProperty, this.vertex4.angleProperty ], ( angle2, angle4 ) => {
      return Math.abs( angle2 - angle4 );
    } );

    // @public {DerivedProperty.<boolean>} - A value that indicates that the quadrilateral is currently a
    // parallelogram. We assume that the quad is a parallelogram if opposite angles are equal within a margin of error.
    this.isParallelogramProperty = new DerivedProperty( [
      angle1DiffAngle3Property,
      angle2DiffAngle4Property,
      this.angleEqualityEpsilonProperty
    ], ( angle1DiffAngle3, angle2DiffAngle4, epsilon ) => {
      return angle1DiffAngle3 < epsilon && angle2DiffAngle4 < epsilon;
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
    this.angleEqualityEpsilonProperty.reset();
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
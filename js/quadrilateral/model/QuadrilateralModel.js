// Copyright 2021, University of Colorado Boulder

/**
 * The base model class for Quadrilateral. Assembles all model components and responsible for managing Properties
 * that indicate the state of the whole Quadrilateral shape. Will probably also manage Properties that manage
 * the state of the Sim (UI element visibility and so on).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import quadrilateral from '../../quadrilateral.js';
import Side from './Side.js';
import Vertex from './Vertex.js';

class QuadrilateralModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Vertex}
    this.vertex1 = new Vertex( new Vector2( -0.25, 0.25 ), tandem.createTandem( 'vertex1' ) );
    this.vertex2 = new Vertex( new Vector2( 0.25, 0.25 ), tandem.createTandem( 'vertex2' ) );
    this.vertex3 = new Vertex( new Vector2( 0.25, -0.25 ), tandem.createTandem( 'vertex3' ) );
    this.vertex4 = new Vertex( new Vector2( -0.25, -0.25 ), tandem.createTandem( 'vertex4' ) );

    // @public {Side} - create the sides of the shape
    this.topSide = new Side( this.vertex1, this.vertex2, tandem.createTandem( 'topSide' ), {
      offsetVectorForTiltCalculation: new Vector2( 0, 1 )
    } );
    this.rightSide = new Side( this.vertex2, this.vertex3, tandem.createTandem( 'rightSide' ) );
    this.bottomSide = new Side( this.vertex3, this.vertex4, tandem.createTandem( 'bottomSide' ), {
      offsetVectorForTiltCalculation: new Vector2( 0, -1 )
    } );
    this.leftSide = new Side( this.vertex4, this.vertex1, tandem.createTandem( 'leftSide' ), {
      offsetVectorForTiltCalculation: new Vector2( -1, 0 )
    } );

    // Connect the sides, creating the shape and giving vertices the information they need to determine their angles.
    this.rightSide.connectToSide( this.topSide );
    this.bottomSide.connectToSide( this.rightSide );
    this.leftSide.connectToSide( this.bottomSide );
    this.topSide.connectToSide( this.leftSide );

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
    const angle1DiffAngle3Property = new DerivedProperty( [ this.vertex1.angleProperty, this.vertex3.angleProperty ], ( angle1, angle3 ) => {
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

    // @public {Emitter} - Emits an event whenever the shape of the Quadrilateral changes
    this.shapeChangedEmitter = new Emitter();

    Property.multilink( [
        this.vertex1.positionProperty,
        this.vertex2.positionProperty,
        this.vertex3.positionProperty,
        this.vertex4.positionProperty ],
      ( position1, position2, position3, position4 ) => {
        this.shapeChangedEmitter.emit();
      }
    );
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
// Copyright 2021, University of Colorado Boulder

/**
 * The base model class for Quadrilateral. Assembles all model components and responsible for managing Properties
 * that indicate the state of the whole Quadrilateral shape. Will probably also manage Properties that manage
 * the state of the Sim (UI element visibility and so on).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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
    this.angleToleranceIntervalProperty = new NumberProperty( 0.1, {
      tandem: tandem.createTandem( 'angleToleranceIntervalProperty' ),
      range: new Range( 0.01, 0.3 )
    } );

    // @public (read-only) {BooleanProperty} - Whether the quadrilateral is a parallelogram. This Property updates
    // async in the step function! We need to update this Property after all vertex positions and all vertex angles
    // have been updated. When moving more than one vertex at a time, only one vertex position updates synchronously
    // in the code and in those transient states the model may temporarily not be a parallelogram. Updating in step
    // after all Properties and listeners are done with this work resolves the problem.
    this.isParallelogramProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isParallelogramProperty' )
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
   * Returns whether or not the quadrilateral shape is a parallelogram, within the tolerance defined by
   * angleToleranceIntervalProperty.
   * @public
   *
   * @returns {boolean}
   */
  getIsParallelogram() {
    const angle1DiffAngle3 = Math.abs( this.vertex1.angleProperty.value - this.vertex3.angleProperty.value );
    const angle2DiffAngle4 = Math.abs( this.vertex2.angleProperty.value - this.vertex4.angleProperty.value );
    const epsilon = this.angleToleranceIntervalProperty.value;

    return angle1DiffAngle3 < epsilon && angle2DiffAngle4 < epsilon;
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
    this.angleToleranceIntervalProperty.reset();
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {

    // the isParallelogramProperty needs to be set asynchronously, see the documentation for isParallelogramProperty
    this.isParallelogramProperty.set( this.getIsParallelogram() );
  }
}

quadrilateral.register( 'QuadrilateralModel', QuadrilateralModel );
export default QuadrilateralModel;
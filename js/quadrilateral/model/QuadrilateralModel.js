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
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import quadrilateral from '../../quadrilateral.js';
import Side from './Side.js';
import Vertex from './Vertex.js';

// the full bounds of the model, vertices are constrained to these values
const MODEL_BOUNDS = new Bounds2( -1, -1, 1, 1 );

class QuadrilateralModel {

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    options = merge( {

      // {boolean} - if true, some modifications are made to the model to make this quadrilateral look more
      // like a physical device
      calibrationDemoDevice: false
    }, options );

    // @public {Vertex}
    this.vertex1 = new Vertex( new Vector2( -MODEL_BOUNDS.width / 4, MODEL_BOUNDS.height / 4 ), tandem.createTandem( 'vertex1' ) );
    this.vertex2 = new Vertex( new Vector2( MODEL_BOUNDS.width / 4, MODEL_BOUNDS.height / 4 ), tandem.createTandem( 'vertex2' ) );
    this.vertex3 = new Vertex( new Vector2( MODEL_BOUNDS.width / 4, -MODEL_BOUNDS.height / 4 ), tandem.createTandem( 'vertex3' ) );
    this.vertex4 = new Vertex( new Vector2( -MODEL_BOUNDS.width / 4, -MODEL_BOUNDS.height / 4 ), tandem.createTandem( 'vertex4' ) );

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

    window.simModel = this;

    // @public {NumberProperty} - A value that controls the threshold for equality when determining
    // if the quadrilateral forms a parallelogram. Without a margin of error it would be exceedingly
    // difficult to create a parallelogram shape. It is unclear whether this need to change, but
    // it seems useful now to be able to easily change this value during development.
    this.angleEqualityEpsilonProperty = new NumberProperty( 0.1, {
      tandem: tandem.createTandem( 'angleEqualityEpsilonProperty' ),
      range: new Range( 0.01, 0.3 )
    } );

    // @public {NumberProperty} - A value that controls the threshold for determining when two sides are
    // parallel. The slope is calculated and if the slope of two sides is equal within this epsilon, they
    // are considered in parallel.
    this.slopeEqualityEpsilonProperty = new NumberProperty( 0.1, {
      tandem: tandem.createTandem( 'slopeEqualityEpsilonProperty' ),
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

    // @public {DerivedProperty.<boolean>} - true when the left side and right side are parallel
    this.leftSideRightSideParallelProperty = new DerivedProperty(
      [ this.leftSide.slopeProperty, this.rightSide.slopeProperty, this.slopeEqualityEpsilonProperty ],
      ( leftSlope, rightSlope, epsilon ) => {
        return Utils.equalsEpsilon( leftSlope, rightSlope, epsilon );
      }
    );

    // @public {DerivedProperty.<boolean>} - true when the top side and bottom side are in parallel
    this.leftSideRightSideParallelProperty = new DerivedProperty(
      [ this.topSide.slopeProperty, this.bottomSide.slopeProperty, this.slopeEqualityEpsilonProperty ],
      ( topSide, bottomSide, epsilon ) => {
        return Utils.equalsEpsilon( topSide, bottomSide, epsilon );
      }
    );

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
   * Set positions of the Vertices from length and angle data. We get the angles at each vertex and lengths
   * of each side from the hardware. We need to convert that to vertex positions in model space.
   *
   * With angle and length data alone we do not know the orientation or position in space of the shape. So the
   * shape is constructed with the top left vertex (vertex1) and top side (topSide) anchored  while the rest
   * of the vertices are relatively positioned from the angle and length data. Once the shape is constructed it is
   * translated so that the centroid of the shape is in the center of model space (0, 0). The final result is that only
   * the tilt of the top side remains anchored. Perhaps if a gyroscope is added in the future we may be able to rotate
   * the shape correctly without anchoring the top side.
   * @private
   *
   * @param {number} topLength
   * @param {number} rightLength
   * @param {number} bottomLength
   * @param {number} leftLength
   * @param {number} p1Angle
   * @param {number} p2Angle
   * @param {number} p3Angle
   * @param {number} p4Angle
   */
  setPositionsFromLengthAndAngleData( topLength, rightLength, bottomLength, leftLength, p1Angle, p2Angle, p3Angle, p4Angle ) {

    // this function cannot be called until the bounds of movement for each vertex has been established
    assert && assert( this.vertex1.dragBoundsProperty.value );
    assert && assert( this.vertex2.dragBoundsProperty.value );
    assert && assert( this.vertex3.dragBoundsProperty.value );
    assert && assert( this.vertex4.dragBoundsProperty.value );

    // vertex1 and the topLine are anchored, the rest of the shape is relative to this
    const vector1Position = new Vector2( MODEL_BOUNDS.minX, MODEL_BOUNDS.maxX );
    const vector2Position = new Vector2( vector1Position.x + topLength, vector1Position.y );

    const vector4Offset = new Vector2( Math.cos( -p1Angle ), Math.sin( -p1Angle ) ).timesScalar( leftLength );
    const vector4Position = vector1Position.plus( vector4Offset );

    const vector3Offset = new Vector2( Math.cos( Math.PI + p2Angle ), Math.sin( Math.PI + p2Angle ) ).timesScalar( rightLength );
    const vector3Position = vector2Position.plus( vector3Offset );

    // make sure that the proposed positions are within bounds defined in the simulation model
    const shapePosition1 = this.vertex1.dragBoundsProperty.value.closestPointTo( vector1Position );
    const shapePosition2 = this.vertex2.dragBoundsProperty.value.closestPointTo( vector2Position );
    const shapePosition3 = this.vertex3.dragBoundsProperty.value.closestPointTo( vector3Position );
    const shapePosition4 = this.vertex4.dragBoundsProperty.value.closestPointTo( vector4Position );
    const shapePositions = [ shapePosition1, shapePosition2, shapePosition3, shapePosition4 ];

    // we have the vertex positions to recreate the shape, but shift them so that the centroid of the quadrilateral is
    // in the center of the model space
    const centroidPosition = this.getCentroidFromPositions( shapePositions );
    const centroidOffset = centroidPosition.negated();
    const shiftedPositions = _.map( shapePositions, shapePosition => shapePosition.plus( centroidOffset ) );

    this.vertex1.positionProperty.set( shiftedPositions[ 0 ] );
    this.vertex2.positionProperty.set( shiftedPositions[ 1 ] );
    this.vertex3.positionProperty.set( shiftedPositions[ 2 ] );
    this.vertex4.positionProperty.set( shiftedPositions[ 3 ] );
  }

  /**
   * Returns the centroid of a Quadrilateral from an array of potential shape positions.
   * @private
   *
   * @param {Vector2[]} positions
   * @returns {Vector2}
   */
  getCentroidFromPositions( positions ) {
    const centerX = _.sumBy( positions, position => position.x ) / positions.length;
    const centerY = _.sumBy( positions, position => position.y ) / positions.length;

    return new Vector2( centerX, centerY );
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

QuadrilateralModel.MODEL_BOUNDS = MODEL_BOUNDS;

quadrilateral.register( 'QuadrilateralModel', QuadrilateralModel );
export default QuadrilateralModel;
// Copyright 2021-2022, University of Colorado Boulder

/**
 * A model component for a Vertex of the Quadrilateral.
 *
 * @author Jesse Greenberg
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quadrilateral from '../../quadrilateral.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

// in model coordinates, the bounds of the vertex - necessary because we need to calculate vertex/vertex and
// vertex/side collisions
const VERTEX_BOUNDS = new Bounds2( 0, 0, 0.1, 0.1 );
const HALF_WIDTH = VERTEX_BOUNDS.width / 2;
const HALF_HEIGHT = VERTEX_BOUNDS.height / 2;

class Vertex {
  public positionProperty: Property<Vector2>;
  public angleProperty: null | Property<number>;
  public dragBoundsProperty: Property<null | Bounds2>;
  public dragAreaProperty: Property<null | Shape>;
  public isPressedProperty: Property<boolean>;
  public modelBoundsProperty: IReadOnlyProperty<Bounds2>;
  private tandem: Tandem;
  public static VERTEX_BOUNDS: Bounds2;

  /**
   * @param initialPosition - The initial position for the Vertex in model coordinates.
   * @param tandem
   */
  constructor( initialPosition: Vector2, tandem: Tandem ) {

    // The position of the vertex in model coordinates.
    this.positionProperty = new Vector2Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    // The angle at this vertex of the quadrilateral, null until this vertex is connected to two others because we
    // need three points to form the angle.
    this.angleProperty = null;

    // The bounds in model coordinates that define where this vertex can move. NOTE: Likely this
    // is being replaced by dragAreaProperty, see next field.
    this.dragBoundsProperty = new Property<Bounds2 | null>( null );

    // The Shape in model coordinates that defines where this Vertex can move. It can never
    // go outside of this area. The dragAreaProperty is determined by other vertices of the quadrilateral
    // and is calculated such that the quadrilateral can never become complex or concave. It is null until
    // the model bounds are defined and this Vertex is connected to others to form the quadrilateral shape.
    this.dragAreaProperty = new Property<Shape | null>( null );

    // The bounds in model coordinates of this vertex, with dimensions VERTEX_BOUNDS, centered at the value of the
    // positionProperty.
    this.modelBoundsProperty = new DerivedProperty( [ this.positionProperty ], ( position: Vector2 ) => {

      // TODO: possibly reduce allocations?
      return new Bounds2( position.x - HALF_WIDTH, position.y - HALF_HEIGHT, position.x + HALF_WIDTH, position.y + HALF_HEIGHT );
    } );

    // True when this Vertex is "pressed" during user interaction.
    this.isPressedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isPressedProperty' )
    } );

    // Referenced so that we can pass the tandem to Properties as they are dynamically created in the methods below.
    this.tandem = tandem;
  }

  /**
   * Returns true when the provided bounds overlap the modelled bounds of this Vertex.
   */
  public boundsOverlapsVertex( bounds: Bounds2 ): boolean {
    return bounds.intersectsBounds( this.modelBoundsProperty.value );
  }

  /**
   * Returns true if this Vertex intersects another.
   * @param other
   */
  public overlapsOther( other: Vertex ) {
    assert && assert( other !== this, 'You are trying to see if this vertex overlaps self?' );
    return other.modelBoundsProperty.value.intersectsBounds( this.modelBoundsProperty.value );
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
   * Uses atan2 to get the angle at this vertex counter-clockwise between 0 and 2 * Math.PI. See
   * https://math.stackexchange.com/questions/878785/how-to-find-an-angle-in-range0-360-between-2-vectors
   *
   * Assumes the following arrangement of vertices:
   *
   *        thisVertex
   *          /       \
   *   sideA /         \ sideB
   *        /           \
   *     vertex1 ----- vertex2
   *             sideC
   *
   * @public
   *
   * @param {Vertex} vertex1
   * @param {Vertex} vertex2
   */
  connectToOthers( vertex1: Vertex, vertex2: Vertex ) {

    this.angleProperty = new DerivedProperty(
      [ vertex1.positionProperty, this.positionProperty, vertex2.positionProperty ],
      ( vertex1Position: Vector2, thisPosition: Vector2, vertex2Position: Vector2 ) => {

        const vector1 = vertex1.positionProperty.value.minus( this.positionProperty.value );
        const vector2 = vertex2.positionProperty.value.minus( this.positionProperty.value );

        const dot = vector1.x * vector2.x + vector1.y * vector2.y;
        const det = vector1.x * vector2.y - vector2.x * vector1.y;
        let angle = Math.atan2( det, dot );

        // if the angle is less than zero, we have wrapped around Math.PI and formed a concave shape - the actual
        // angle should be greater than PI
        if ( angle < 0 ) {
          angle = angle + 2 * Math.PI;
        }
        return angle;
      }, {
        tandem: this.tandem.createTandem( 'angleProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );
  }

  /**
   * Calculates the angle between three vertices, returning the angle at vertex2. The returned angle will
   * be between -PI and PI.
   *
   * Uses the law of cosines to calculate the angle, assuming vertex positions like this:
   *
   *        vertex2Position
   *          /           \
   *   sideA /             \ sideB
   *        /               \
   * vertex1Position -------- vertex3Position
   *                   sideC
   *
   * See https://en.wikipedia.org/wiki/Law_of_cosines
   * @public
   *
   * @param {Vector2} vertex1Position
   * @param {Vector2} vertex2Position - returns angle at this vertex, between vertex1Position and vertex3Position
   * @param {Vector2} vertex3Position
   */
  static calculateAngle( vertex1Position: Vector2, vertex2Position: Vector2, vertex3Position: Vector2 ) {

    const sideA = vertex1Position.distance( vertex2Position );
    const sideB = vertex3Position.distance( vertex2Position );
    const sideC = vertex3Position.distance( vertex1Position );

    assert && assert( sideA !== 0 && sideB !== 0, 'law of cosines will not work when sides are of zero length' );

    // the absolute value of the arcos argument must be less than one to be defined, but it may have exceeded 1 due
    // to precision errors
    let argument = ( ( sideA * sideA ) + ( sideB * sideB ) - ( sideC * sideC ) ) / ( 2 * sideA * sideB );
    argument = argument > 1 ? 1 :
               argument < -1 ? -1 :
               argument;
    return Math.acos( argument );
  }
}

Vertex.VERTEX_BOUNDS = VERTEX_BOUNDS;

quadrilateral.register( 'Vertex', Vertex );
export default Vertex;
// Copyright 2021, University of Colorado Boulder

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

class Vertex {
  public positionProperty: Property<Vector2>;
  public angleProperty: null | Property<number>;
  public dragBoundsProperty: Property<null | Bounds2>;
  public dragAreaProperty: Property<null | Shape>;
  public isPressedProperty: Property<boolean>;
  private tandem: Tandem;

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
    this.dragBoundsProperty = new Property( null );

    // The Shape in model coordinates that defines where this Vertex can move. It can never
    // go outside of this area. The dragAreaProperty is determined by other vertices of the quadrilateral
    // and is calculated such that the quadrilateral can never become complex or concave. It is null until
    // the model bounds are defined and this Vertex is connected to others to form the quadrilateral shape.
    this.dragAreaProperty = new Property( null );

    // True when this Vertex is "pressed" during user interaction.
    this.isPressedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isPressedProperty' )
    } );

    // Referenced so that we can pass the tandem to Properties as they are dynamically created in the methods below.
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
  connectToOthers( vertex1: Vertex, vertex2: Vertex ) {

    this.angleProperty = new DerivedProperty(
      [ vertex1.positionProperty, this.positionProperty, vertex2.positionProperty ],
      ( vertex1Position: Vector2, thisPosition: Vector2, vertex2Position: Vector2 ) => {
        const sideA = vertex1Position.distance( thisPosition );
        const sideB = vertex2Position.distance( thisPosition );
        const sideC = vertex2Position.distance( vertex1Position );

        assert && assert( sideA !== 0 && sideB !== 0, 'law of cosines will not work when sides are of zero length' );
        return Math.acos( ( ( sideA * sideA ) + ( sideB * sideB ) - ( sideC * sideC ) ) / ( 2 * sideA * sideB ) );
      }, {
        tandem: this.tandem.createTandem( 'angleProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );
  }

  /**
   * Calculates the angle between three vertices, returning the angle at vertex2.
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

quadrilateral.register( 'Vertex', Vertex );
export default Vertex;
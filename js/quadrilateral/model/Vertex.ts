// Copyright 2021-2023, University of Colorado Boulder

/**
 * A model component for a Vertex of the Quadrilateral.
 *
 * @author Jesse Greenberg
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import quadrilateral from '../../quadrilateral.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import VertexLabel from './VertexLabel.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

const VERTEX_BOUNDS = new Bounds2( 0, 0, 0.1, 0.1 );
const HALF_WIDTH = VERTEX_BOUNDS.width / 2;
const HALF_HEIGHT = VERTEX_BOUNDS.height / 2;

class Vertex {

  // The position of the vertex in model coordinates.
  public readonly positionProperty: Property<Vector2>;

  // The angle at this vertex of the quadrilateral, null until this vertex is connected to two others because we
  // need three points to form the angle.
  public readonly angleProperty: Property<number | null>;

  // Identification of this Vertex within the QuadrilateralShape.
  public readonly vertexLabel: VertexLabel;

  // The Shape in model coordinates that defines where this Vertex can move. It can never
  // go outside this area. The dragAreaProperty is determined by other vertices of the quadrilateral
  // and constraints movement so the quadrilateral can never become crossed or "complex". It is null until
  // the model bounds are defined and this Vertex is connected to others to form the quadrilateral shape.
  public readonly dragAreaProperty: Property<null | Shape>;

  // True when this Vertex is "pressed" during user interaction.
  public readonly isPressedProperty: Property<boolean>;

  // The bounds in model coordinates of this vertex, with dimensions VERTEX_BOUNDS, centered at the value of the
  // positionProperty.
  public readonly modelBoundsProperty: TReadOnlyProperty<Bounds2>;

  // Referenced so that we can pass the tandem to Properties as they are dynamically created in the methods below.
  private readonly tandem: Tandem;

  // (Voicing) Indicates that the Vertex has received some input so it is time to trigger a new Voicing response
  // the next time Properties are updated in QuadrilateralShapeModel.
  public voicingObjectResponseDirty = false;

  // Properties tracking when a Vertex becomes blocked by ony of the individual sides of model bounds.
  // So that we can trigger some feedback as a Vertex is blocked by new edges of bounds.
  public readonly leftConstrainedProperty = new BooleanProperty( false );
  public readonly rightConstrainedProperty = new BooleanProperty( false );
  public readonly topConstrainedProperty = new BooleanProperty( false );
  public readonly bottomConstrainedProperty = new BooleanProperty( false );
  public readonly numberOfConstrainingEdgesProperty: TReadOnlyProperty<number>;

  // Property indicating whether the movement of the Vertex was blocked because placement would have
  // resulted in a crossed/overlapping shape.
  public readonly movementBlockedByShapeProperty = new BooleanProperty( false );

  // Property indicating whether the movement of the Vertex was blocked by being constrained in the
  // model bounds
  public readonly movementBlockedByBoundsProperty = new BooleanProperty( false );

  // A reference to vertices connected to this vertex for so we can calculate the angle at this vertex.
  // The orientation of vertex1 and vertex2 for angle calculations are as shown in the following diagram:
  //        thisVertex
  //          /       \
  //   sideA /         \ sideB
  //        /           \
  // vertex1 --------- vertex2
  private vertex1: Vertex | null;
  private vertex2: Vertex | null;

  // Property that controls how many values to include in the "smoothing" of potential positions when being
  // controlled by a prototype tangible. See smoothPosition().
  private readonly smoothingLengthProperty: TReadOnlyProperty<number>;

  // The collection of SMOOTHING_LENGTH number of positions for prototype tangible control. See smoothPosition().
  private readonly positions: Vector2[] = [];

  // in model coordinates, the width of the Vertex
  public static readonly VERTEX_WIDTH = VERTEX_BOUNDS.width;

  /**
   * @param initialPosition - The initial position for the Vertex in model coordinates.
   * @param vertexLabel - A label tagging the vertex, so we can look up the equivalent vertex on another shape model
   * @param smoothingLengthProperty - Controlling how many values to use in the position smoothing when connected to
   *                                  a tangible device (prototype).
   * @param tandem
   */
  public constructor( initialPosition: Vector2, vertexLabel: VertexLabel, smoothingLengthProperty: TReadOnlyProperty<number>, tandem: Tandem ) {
    this.smoothingLengthProperty = smoothingLengthProperty;
    this.positionProperty = new Vector2Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    this.angleProperty = new Property<null | number>( null, {
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );

    // The label for this vertex so we can get the same vertex on another QuadrilateralShapeModel.
    this.vertexLabel = vertexLabel;

    this.vertex1 = null;
    this.vertex2 = null;

    this.dragAreaProperty = new Property<Shape | null>( null );

    this.modelBoundsProperty = new DerivedProperty( [ this.positionProperty ], position => {
      return new Bounds2( position.x - HALF_WIDTH, position.y - HALF_HEIGHT, position.x + HALF_WIDTH, position.y + HALF_HEIGHT );
    } );

    this.isPressedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isPressedProperty' )
    } );

    this.numberOfConstrainingEdgesProperty = new DerivedProperty( [
      this.topConstrainedProperty,
      this.rightConstrainedProperty,
      this.bottomConstrainedProperty,
      this.leftConstrainedProperty
    ], ( topConstrained, rightConstrained, bottomConstrained, leftConstrained ) => {
      const topVal = topConstrained ? 1 : 0;
      const rightVal = rightConstrained ? 1 : 0;
      const bottomVal = bottomConstrained ? 1 : 0;
      const leftVal = leftConstrained ? 1 : 0;
      return topVal + rightVal + bottomVal + leftVal;
    } );

    this.tandem = tandem;
  }

  public getBoundsFromPoint( position: Vector2 ): Bounds2 {
    return new Bounds2( position.x - HALF_WIDTH, position.y - HALF_HEIGHT, position.x + HALF_WIDTH, position.y + HALF_HEIGHT );
  }

  /**
   * Returns true when the provided bounds overlap the modelled bounds of this Vertex.
   */
  public boundsOverlapsVertex( bounds: Bounds2 ): boolean {
    return bounds.intersectsBounds( this.modelBoundsProperty.value );
  }

  /**
   * Returns true if this Vertex intersects another.
   */
  public overlapsOther( other: Vertex ): boolean {
    assert && assert( other !== this, 'You are trying to see if this vertex overlaps self?' );
    return other.modelBoundsProperty.value.intersectsBounds( this.modelBoundsProperty.value );
  }


  /**
   * Set Properties that need to be updated all at once for the quadrilateral shape to a deferred state so that
   * they can be updated together without calling listeners with bad transient states during updates.
   */
  public setPropertiesDeferred( deferred: boolean ): ( () => void ) | null {
    return this.positionProperty.setDeferred( deferred );
  }

  /**
   * Reset this vertex.
   */
  public reset(): void {
    this.positionProperty.reset();
  }

  /**
   * Update the angle at this vertex, when it is time. It is unfortunate that it is up to the client to call this,
   * but we need to be sure that angles are up-to-date ONLY after all vertex positions have been updated. See
   * QuadrilateralShapeModel.updateOrderDependentProperties.
   */
  public updateAngle(): void {
    assert && assert( this.vertex1 && this.vertex2, 'Need connected vertices to determine an angle' );

    const vector1 = this.vertex1!.positionProperty.value.minus( this.positionProperty.value );
    const vector2 = this.vertex2!.positionProperty.value.minus( this.positionProperty.value );

    const dot = vector1.x * vector2.x + vector1.y * vector2.y;
    const det = vector1.x * vector2.y - vector2.x * vector1.y;
    let angle = Math.atan2( det, dot );

    // if the angle is less than zero, we have wrapped around Math.PI and formed a concave shape - the actual
    // angle should be greater than PI
    if ( angle < 0 ) {
      angle = angle + 2 * Math.PI;
    }

    this.angleProperty.value = angle;
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
   * vertex1 --------- vertex2
   */
  public connectToOthers( vertex1: Vertex, vertex2: Vertex ): void {
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
  }

  /**
   * "Smooth" the provided position for the vertex by saving it in a collection of positions of max length
   * and returning the average position.
   */
  public smoothPosition( position: Vector2 ): Vector2 {
    this.positions.push( position );

    while ( this.positions.length > this.smoothingLengthProperty.value ) {
      this.positions.shift();
    }

    return Vector2.average( this.positions );
  }

  /**
   * Calculates the angle between three vertices, returning the angle at vertexB. The returned angle will
   * be between -PI and PI.
   *
   * Uses the law of cosines to calculate the angle, assuming vertex positions like this:
   *
   *        vertexBPosition
   *          /           \
   *   sideA /             \ sideB
   *        /               \
   * vertexAPosition -------- vertexCPosition
   *                   sideC
   *
   * See https://en.wikipedia.org/wiki/Law_of_cosines
   *
   * @param vertex1Position
   * @param vertex2Position - returns angle at this vertex, between vertexAPosition and vertexCPosition
   * @param vertex3Position
   * @param validateShape
   */
  public static calculateAngle( vertex1Position: Vector2, vertex2Position: Vector2, vertex3Position: Vector2, validateShape = true ): number {

    const sideA = vertex1Position.distance( vertex2Position );
    const sideB = vertex3Position.distance( vertex2Position );
    const sideC = vertex3Position.distance( vertex1Position );

    const sidesNonZero = sideA !== 0 && sideB !== 0;
    if ( validateShape ) {
      assert && assert( sidesNonZero, 'law of cosines will not work when sides are of zero length' );
    }

    if ( sidesNonZero ) {

      // the absolute value of the arcos argument must be less than one to be defined, but it may have exceeded 1 due
      // to precision errors
      let argument = ( ( sideA * sideA ) + ( sideB * sideB ) - ( sideC * sideC ) ) / ( 2 * sideA * sideB );
      argument = argument > 1 ? 1 :
                 argument < -1 ? -1 :
                 argument;
      return Math.acos( argument );
    }
    else {

      // fallback case when we need to gracefully signify that a side is of zero length
      return Number.POSITIVE_INFINITY;
    }
  }
}

quadrilateral.register( 'Vertex', Vertex );
export default Vertex;
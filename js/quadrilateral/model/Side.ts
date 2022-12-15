// Copyright 2021-2022, University of Colorado Boulder

/**
 * The model for a side of the quadrilateral, between two Vertices.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quadrilateral from '../../quadrilateral.js';
import Vertex from './Vertex.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Line } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import SideLabel from './SideLabel.js';
import VertexLabel from './VertexLabel.js';

type SideOptions = {

  // Offsets the initial tilt by this Vector so that the tilt values can be the same for each side even
  // if they have different orientations.
  offsetVectorForTiltCalculation?: Vector2;

  // If true, assertions will be made about the state of the side. But you may not always want them because
  // we may be trying to identify if a particular configuration of the quadrilateral is valid and we need to
  // gracefully notify that state is not allowed.
  validateShape?: boolean;
};

class Side {

  // Reference to the vertices that compose this Side.
  public vertex1: Vertex;
  public vertex2: Vertex;

  // Has this side been connected to another to form a shape?
  private isConnected: boolean;

  // Angle of this line against a perpendicular line that would be drawn across it when the vertices are at their
  // initial positions, used to determine the amount of tilt of the line.
  public tiltProperty: TReadOnlyProperty<number>;
  public lengthProperty: NumberProperty;

  // Whether or not this Side is pressed and being interacted with. For now this is useful for debugging.
  public readonly isPressedProperty: BooleanProperty;

  // Allows us to label this Side so we know which one we are working with when that is important for
  // various calculations.
  public readonly sideLabel: SideLabel;

  public voicingObjectResponseDirty = false;

  // The shape of the side, determined by the length and the model width.
  public shapeProperty: TReadOnlyProperty<Shape>;

  // Property indicating whether the movement of the Side was blocked by being constrained in the
  // model bounds
  // TODO: Reduce duplication of these Properties with Vertex, create a superclass?
  public movementBlockedByBoundsProperty = new BooleanProperty( false );

  // Property indicating whether the movement of the Side was blocked because placement would have
  // resulted in a crossed/overlapping shape.
  public movementBlockedByShapeProperty = new BooleanProperty( false );

  // Additional Property indicating movement was blocked for either of the above reasons.
  public movementBlockedProperty = DerivedProperty.or( [ this.movementBlockedByBoundsProperty, this.movementBlockedByShapeProperty ] );

  // In model coordinates, the length of a side segment in model coordinates. The full side is divided into segments of
  // this length with the final segment length being the remainder.
  public static readonly SIDE_SEGMENT_LENGTH = 0.25;

  // in model coordinates, the width of a side - Sides exist in model space to apply rules that vertices and
  // sides can never overlap
  public static readonly SIDE_WIDTH = 0.1;

  /**
   * @param vertex1 - The first vertex of this Side.
   * @param vertex2 - The second vertex of this Side.
   * @param tandem
   * @param [providedOptions]
   */
  public constructor( vertex1: Vertex, vertex2: Vertex, tandem: Tandem, providedOptions?: SideOptions ) {

    const options = optionize<SideOptions, SideOptions>()( {
      offsetVectorForTiltCalculation: new Vector2( 1, 0 ),
      validateShape: true
    }, providedOptions );

    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.isConnected = false;

    this.sideLabel = this.determineSideLabel();

    this.isPressedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isPressedProperty' )
    } );

    this.tiltProperty = new DerivedProperty( [ this.vertex1.positionProperty, this.vertex2.positionProperty ],
      ( vertex1Position, vertex2Position ) => {
        return Vertex.calculateAngle( vertex1Position, vertex2Position, vertex2Position.plus( options.offsetVectorForTiltCalculation ), options.validateShape );
      }, {
        tandem: tandem.createTandem( 'tiltProperty' ),
        phetioValueType: NumberIO
      } );

    // The distance between the two vertices, in model space.
    this.lengthProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'lengthProperty' )
    } );

    this.shapeProperty = new DerivedProperty(
      [ this.vertex1.positionProperty, this.vertex2.positionProperty ],
      ( position1, position2 ) => {

        // TODO: make reusable
        const lineShape = new Line( position1.x, position1.y, position2.x, position2.y, {
          lineWidth: Side.SIDE_WIDTH
        } );

        return lineShape.getStrokedShape();
      } );
  }

  /**
   * Update the length of this Side from vertex positions. It is unfortunate that the client has to call this
   * to update the length, but we must only update the side after all vertex positions have been set. See
   * updateOrderDependentProperties for more information.
   */
  public updateLength(): void {
    this.lengthProperty.value = Vector2.getDistanceBetweenVectors( this.vertex2.positionProperty.value, this.vertex1.positionProperty.value );
  }

  /**
   * Returns the number of segments used for this side. The length is broken up into SIDE_SEGMENT_LENGTH and this
   * is used for many kinds of views.
   */
  public getNumberOfSegments(): number {
    return Math.floor( this.lengthProperty.value / Side.SIDE_SEGMENT_LENGTH );
  }


  /**
   * Get the length of the final segment. The length is divided into segments, this is the remainder for the final
   * segment.
   */
  public getFinalSegmentLength(): number {
    return this.lengthProperty.value % Side.SIDE_SEGMENT_LENGTH;
  }

  /**
   * Returns true if this Side includes the provided Vertex.
   */
  public includesVertex( vertex: Vertex ): boolean {
    return this.vertex1 === vertex || this.vertex2 === vertex;
  }

  /**
   * Returns true when the other side is opposite to this side.
   */
  public isOppositeToOther( other: Side ): boolean {
    return !other.includesVertex( this.vertex1 ) && !other.includesVertex( this.vertex2 );
  }

  /**
   * Returns the position in model coordinates between the two Vertices of this Side.
   */
  public getMidpoint(): Vector2 {
    return this.vertex2.positionProperty.value.average( this.vertex1.positionProperty.value );
  }


  /**
   * Returns the lowest vertex between the two Vertices of this side. If the vertices have the same
   * Y value in the model vertex1 is returned.
   */
  public getLowestVertex(): Vertex {
    return this.vertex1.positionProperty.value.y <= this.vertex2.positionProperty.value.y ?
           this.vertex1 : this.vertex2;
  }

  public getHighestVertex(): Vertex {
    return this.vertex1.positionProperty.value.y >= this.vertex2.positionProperty.value.y ?
           this.vertex1 : this.vertex2;
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
   */
  public connectToSide( otherSide: Side ): void {
    assert && assert( !this.isConnected, 'Cannot connect a side that is already connected to another.' );
    assert && assert( otherSide !== this, 'Cannot connect a side to itself.' );

    this.isConnected = true;
    this.vertex1.connectToOthers( otherSide.vertex1, this.vertex2 );
  }

  /**
   * From the vertices of this side, apply the correct SideLabel. The vertices have enough info to determine
   * this, so it shouldn't be necessary or possible for the client to provide this as a constructor arg.
   */
  private determineSideLabel(): SideLabel {
    return this.vertex1.vertexLabel === VertexLabel.VERTEX_A ? SideLabel.SIDE_AB :
           this.vertex1.vertexLabel === VertexLabel.VERTEX_B ? SideLabel.SIDE_BC :
           this.vertex1.vertexLabel === VertexLabel.VERTEX_C ? SideLabel.SIDE_CD :
           SideLabel.SIDE_DA;
  }
}

quadrilateral.register( 'Side', Side );
export default Side;

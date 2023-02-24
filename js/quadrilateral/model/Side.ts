// Copyright 2021-2023, University of Colorado Boulder

/**
 * The model for a side of the quadrilateral. A Side is defined by the line between two Vertices.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import Vertex from './Vertex.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Line } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import SideLabel from './SideLabel.js';
import QuadrilateralMovable from './QuadrilateralMovable.js';

class Side extends QuadrilateralMovable {

  // Reference to the vertices that compose this Side.
  public readonly vertex1: Vertex;
  public readonly vertex2: Vertex;

  // Indicates that this side has been connected to another to form the shape.
  private isConnected = false;

  // Length of the side in model coordinates.
  public readonly lengthProperty: NumberProperty;

  // Identifies this side within the quadrilateral shape.
  public readonly sideLabel: SideLabel;

  // The shape of the side - A Line determined by the distance between the vertices and model width.
  public readonly shapeProperty: TReadOnlyProperty<Shape>;

  // In model coordinates, the length of a side segment in model coordinates. The full side is divided into segments of
  // this length with the final segment length being the remainder.
  public static readonly SIDE_SEGMENT_LENGTH = 0.25;

  // in model coordinates, the width of a side - Sides exist in model space to apply rules that vertices and
  // sides can never overlap
  public static readonly SIDE_WIDTH = 0.1;

  // Used to calculate the line shape - reused to avoid excessive allocations.
  private readonly scratchLine = new Line( 0, 0, 0, 0, {
    lineWidth: Side.SIDE_WIDTH
  } );

  /**
   * @param vertex1 - The first vertex of this Side.
   * @param vertex2 - The second vertex of this Side.
   * @param sideLabel - To identify this Side within the shape.
   * @param tandem
   */
  public constructor( vertex1: Vertex, vertex2: Vertex, sideLabel: SideLabel, tandem: Tandem ) {
    super( tandem );

    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.sideLabel = sideLabel;

    this.lengthProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'lengthProperty' )
    } );

    // TODO: The length doesn't update until updateDeferredProperties, shouldn't that apply to shape as well?
    this.shapeProperty = new DerivedProperty(
      [ this.vertex1.positionProperty, this.vertex2.positionProperty ],
      ( position1, position2 ) => {

        this.scratchLine.setLine( position1.x, position1.y, position2.x, position2.y );
        return this.scratchLine.getStrokedShape();
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
   * Returns true if this Side includes the provided Vertex.
   */
  public includesVertex( vertex: Vertex ): boolean {
    return this.vertex1 === vertex || this.vertex2 === vertex;
  }

  /**
   * Returns the position in model coordinates between the two Vertices of this Side.
   */
  public getMidpoint(): Vector2 {
    return this.vertex2.positionProperty.value.average( this.vertex1.positionProperty.value );
  }

  /**
   * Connect this side to another to form a shape. Connects this.vertex1 to otherSide.vertex2, illustrated like this.
   * This sets the relationship between sides and determines how angles are calculated.
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
}

quadrilateral.register( 'Side', Side );
export default Side;

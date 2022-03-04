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
import Utils from '../../../../dot/js/Utils.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import { Line } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SideOptions = {
  offsetVectorForTiltCalculation?: Vector2,
  validateShape?: boolean
};

class Side {
  public vertex1: Vertex;
  public vertex2: Vertex;
  private isConnected: boolean;
  public tiltProperty: IReadOnlyProperty<number>;
  public lengthProperty: IReadOnlyProperty<number>;
  public readonly isPressedProperty: BooleanProperty;
  public shapeProperty: IReadOnlyProperty<Shape>;
  public readonly lengthToleranceIntervalProperty: IReadOnlyProperty<number>;

  // In model coordinates, the length of a side segment in model coordinates. The full side is divided into segments of
  // this length with the final segment length being the remainder.
  public static readonly SIDE_SEGMENT_LENGTH = 0.25;

  // in model coordinates, the width of a side - Sides exist in model space to apply rules that vertices and
  // sides can never overlap
  public static readonly SIDE_WIDTH = 0.08;

  /**
   * @param vertex1 - The first vertex of this Side.
   * @param vertex2 - The second vertex of this Side.
   * @param tandem
   * @param [providedOptions]
   */
  constructor( vertex1: Vertex, vertex2: Vertex, tandem: Tandem, providedOptions?: SideOptions ) {

    const options = optionize<SideOptions, SideOptions>( {

      // Offsets the initial tilt by this Vector so that the tilt values can be the same for each side even
      // if they have different orientations.
      offsetVectorForTiltCalculation: new Vector2( 1, 0 ),

      // If true, assertions will be made about the state of the side. But you may not always want them because
      // we may be trying to identify if a particular configuration of the quadrilateral is valid and we need to
      // gracefully notify that state is not allowed.
      validateShape: true
    }, providedOptions );

    this.vertex1 = vertex1;
    this.vertex2 = vertex2;

    // Has this side been connected to another to form a shape?
    this.isConnected = false;

    // Whether or not this Side is pressed and being interacted with. For now this is useful for debugging.
    this.isPressedProperty = new BooleanProperty( false );

    // Angle of this line against a perpendicular line that would be drawn across it when the vertices are at their
    // initial positions, used to determine the amount of tilt of the line.
    this.tiltProperty = new DerivedProperty( [ this.vertex1.positionProperty, this.vertex2.positionProperty ],
      ( vertex1Position: Vector2, vertex2Position: Vector2 ) => {
        return Vertex.calculateAngle( vertex1Position, vertex2Position, vertex2Position.plus( options.offsetVectorForTiltCalculation ), options.validateShape );
      }, {
        tandem: tandem.createTandem( 'tiltProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );

    // The distance between the two vertices, in model space.
    this.lengthProperty = new DerivedProperty( [ this.vertex2.positionProperty, this.vertex1.positionProperty ],
      ( vertex2Position: Vector2, vertex1Position: Vector2 ) => {
        return Vector2.getDistanceBetweenVectors( vertex2Position, vertex1Position );
      }, {
        tandem: tandem.createTandem( 'lengthProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );

    // The shape of the side, determined by the length and the model width.
    this.shapeProperty = new DerivedProperty(
      [ this.vertex1.positionProperty, this.vertex2.positionProperty ],
      ( position1: Vector2, position2: Vector2 ) => {

        // TODO: make reusable
        const lineShape = new Line( position1.x, position1.y, position2.x, position2.y, {
          lineWidth: Side.SIDE_WIDTH
        } );

        return lineShape.getStrokedShape();
      } );

    // The tolerance for this side to determine if it is equal to another. It is a portion of the full length
    // so that when the side is longer it still as easy for two sides to be equal in length. Otherwise the
    // tolerance interval will be relatively much larger when the length is very small.
    this.lengthToleranceIntervalProperty = new DerivedProperty( [ this.lengthProperty ], ( length: number ) => {
      return length * QuadrilateralQueryParameters.lengthToleranceIntervalScaleFactor;
    } );
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
   * Returns true when the length of this Side is equal to the other Side, within length tolerance intervals.
   * The Sides may have different tolerance intervals because the intervals are a function of the length.
   * We always use the larger of the two intervals in this case.
   */
  public isLengthEqualToOther( side: Side ): boolean {

    // for more consistent, always use the larger of the length tolerance intervals (they will be slightly
    // different for sides with different lengths
    const toleranceInterval = Math.max( side.lengthToleranceIntervalProperty.value, this.lengthToleranceIntervalProperty.value );
    return Utils.equalsEpsilon( side.lengthProperty.value, this.lengthProperty.value, toleranceInterval );
  }


  /**
   * Returns true if this Side includes the provided Vertex.
   */
  public includesVertex( vertex: Vertex ): boolean {
    return this.vertex1 === vertex || this.vertex2 === vertex;
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
   * @param {Side} otherSide
   * @public
   */
  connectToSide( otherSide: Side ) {
    assert && assert( !this.isConnected, 'Cannot connect a side that is already connected to another.' );
    assert && assert( otherSide !== this, 'Cannot connect a side to itself.' );

    this.isConnected = true;
    this.vertex1.connectToOthers( otherSide.vertex1, this.vertex2 );
  }
}

quadrilateral.register( 'Side', Side );
export default Side;

// Copyright 2021, University of Colorado Boulder

/**
 * The model for a side of the quadrilateral, between two Vertices.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quadrilateral from '../../quadrilateral.js';
import Vertex from './Vertex.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';

class Side {
  public vertex1: Vertex;
  public vertex2: Vertex;
  private isConnected: boolean;
  public tiltProperty: DerivedProperty<number>;
  public lengthProperty: DerivedProperty<number>;
  public readonly isPressedProperty: BooleanProperty;
  public readonly lengthToleranceIntervalProperty: DerivedProperty<number>;

  /**
   * @param vertex1 - The first vertex of this Side.
   * @param vertex2 - The second vertex of this Side.
   * @param tandem
   * @param [options]
   */
  constructor( vertex1: Vertex, vertex2: Vertex, tandem: Tandem, options?: any ) {

    options = merge( {
      offsetVectorForTiltCalculation: new Vector2( 1, 0 )
    }, options );

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
      return Vertex.calculateAngle( vertex1Position, vertex2Position, vertex2Position.plus( options.offsetVectorForTiltCalculation ) );
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

    // The tolerance for this side to determine if it is equal to another. It is a portion of the full length
    // so that when the side is longer it still as easy for two sides to be equal in length. Otherwise the
    // tolerance interval will be relatively much larger when the length is very small.
    this.lengthToleranceIntervalProperty = new DerivedProperty( [ this.lengthProperty ], length => {
      return length * QuadrilateralQueryParameters.lengthToleranceIntervalScaleFactor;
    } );
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

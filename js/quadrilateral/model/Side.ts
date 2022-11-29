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
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Line } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import QuadrilateralPhysics from './QuadrilateralPhysics.js';
import VertexLabel from './VertexLabel.js';
import SideLabel from './SideLabel.js';

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

  private readonly physicsBody: p2.Body | null = null;

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

  // The tolerance for this side to determine if it is equal to another. It is a portion of the full length
  // so that when the side is longer it still as easy for two sides to be equal in length. Otherwise the
  // tolerance interval will be relatively much larger when the length is very small.
  // TODO: I suspect that the usages of this can be removed now that we are not tracking changes in shape length in real time for learning goals.
  public readonly lengthToleranceIntervalProperty: TReadOnlyProperty<number>;

  // In model coordinates, the length of a side segment in model coordinates. The full side is divided into segments of
  // this length with the final segment length being the remainder.
  public static readonly SIDE_SEGMENT_LENGTH = 0.25;

  // in model coordinates, the width of a side - Sides exist in model space to apply rules that vertices and
  // sides can never overlap
  public static readonly SIDE_WIDTH = 0.1;

  /**
   * @param vertex1 - The first vertex of this Side.
   * @param vertex2 - The second vertex of this Side.
   * @param physicsEngine
   * @param tandem
   * @param [providedOptions]
   */
  public constructor( vertex1: Vertex, vertex2: Vertex, physicsEngine: QuadrilateralPhysics, tandem: Tandem, providedOptions?: SideOptions ) {

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

    this.lengthToleranceIntervalProperty = new DerivedProperty( [ this.lengthProperty ], length => {
      return length * QuadrilateralQueryParameters.lengthToleranceIntervalScaleFactor;
    }, {
      tandem: tandem.createTandem( 'lengthToleranceIntervalProperty' ),
      phetioValueType: NumberIO
    } );

    // if ( false ) {
    //   // const p2Position = QuadrilateralPhysics.vectorToP2Position( vertex2.positionProperty.value.average( vertex1.positionProperty.value ) );
    //
    //   this.physicsBody = new p2.Body( {
    //     // mass: 0.15,
    //     fixedRotation: true,
    //
    //     // needs to be the center of the shape and update dynamically
    //     // position: p2Position,
    //     velocity: [ 0, 0 ],
    //     angularVelocity: 0,
    //
    //     ccdSpeedThreshold: 40
    //   } );
    //
    //   let vertex1Constraint: p2.RevoluteConstraint | null = null;
    //   let vertex2Constraint: p2.RevoluteConstraint | null = null;
    //
    //   physicsEngine.addBody( this.physicsBody );
    //
    //   let physicsShape: p2.Shape | null;
    //   this.shapeProperty.link( modelShape => {
    //     if ( physicsShape ) {
    //       this.physicsBody!.removeShape( physicsShape );
    //     }
    //
    //     const p2Position = QuadrilateralPhysics.vectorToP2Position( vertex2.positionProperty.value.average( vertex1.positionProperty.value ) );
    //     this.physicsBody!.position = p2Position;
    //
    //     assert && assert( modelShape.subpaths.length === 1 );
    //     const p2Path: [ number, number ][] = [];
    //
    //     const subpath = modelShape.subpaths[ 0 ];
    //
    //     // points need to be in CCW order (opposite of subpath segments)
    //     for ( let i = subpath.segments.length - 1; i > -1; i-- ) {
    //       const segment = subpath.segments[ i ];
    //
    //       // create a path around the start point of each segment for the body shape
    //       p2Path.push( QuadrilateralPhysics.vectorToP2Position( segment.start ) );
    //     }
    //
    //     const copyPath = p2Path.slice();
    //     physicsShape = new p2.Convex( {
    //       vertices: p2Path
    //     } );
    //     this.physicsBody!.addShape( physicsShape );
    //
    //     this.physicsBody!.setDensity( 1e6 );
    //
    //     if ( this.vertex1.vertexLabel === vertexLabel.VERTEX_A ) {
    //       console.log( copyPath );
    //     }
    //
    //     if ( vertex1Constraint ) {
    //       physicsEngine.removePhysicsConstraint( vertex1Constraint );
    //       vertex1Constraint = null;
    //     }
    //     if ( vertex2Constraint ) {
    //       physicsEngine.removePhysicsConstraint( vertex2Constraint );
    //       vertex2Constraint = null;
    //     }
    //
    //     const localAOut: [ number, number ] = [ 0, 0 ];
    //     const localBOut: [ number, number ] = [ 0, 0 ];
    //
    //     this.physicsBody!.toLocalFrame( localAOut, QuadrilateralPhysics.vectorToP2Position( vertex1.positionProperty.value ) );
    //     this.physicsBody!.toLocalFrame( localBOut, QuadrilateralPhysics.vectorToP2Position( vertex2.positionProperty.value ) );
    //
    //     // constraint for vertex1
    //     vertex1Constraint = new p2.RevoluteConstraint( this.physicsBody!, vertex1.physicsBody, {
    //       localPivotA: localAOut,
    //       localPivotB: [ 0, 0 ]
    //     } );
    //
    //     vertex2Constraint = new p2.RevoluteConstraint( this.physicsBody!, vertex1.physicsBody, {
    //       localPivotA: localBOut,
    //       localPivotB: [ 0, 0 ]
    //     } );
    //
    //     physicsEngine.addPhysicsConstraint( vertex1Constraint );
    //     physicsEngine.addPhysicsConstraint( vertex2Constraint );
    //   } );
    // }
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

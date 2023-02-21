// Copyright 2021-2023, University of Colorado Boulder

/**
 * A model component for the components of the quadrilateral that define its geometry/shape. This includes components
 * such as vertices, sides, and information about whether it is or is not a parallelogram. There is only one
 * quadrilateral in the Quadrilateral sim. But it may be useful to instantiate more than one so that we can create
 * a quadrilateral shape from vertices and then validate it before setting properties on the "real" quadrilateral model.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import quadrilateral from '../../quadrilateral.js';
import NamedQuadrilateral from './NamedQuadrilateral.js';
import Side from './Side.js';
import Vertex from './Vertex.js';
import Utils from '../../../../dot/js/Utils.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VertexLabel from './VertexLabel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ParallelSideChecker from './ParallelSideChecker.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import QuadrilateralShapeDetector from './QuadrilateralShapeDetector.js';
import SidePair from './SidePair.js';
import VertexPair from './VertexPair.js';
import QuadrilateralUtils from './QuadrilateralUtils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

// Used when verifying that Vertex positions are valid before setting to the model.
export type VertexWithProposedPosition = {
  vertex: Vertex;

  // This may not be available if something goes wrong with the marker detection
  proposedPosition?: Vector2;
};

type QuadrilateralShapeModelOptions = {

  // If true, the shape gets tested to make sure it is valid. This means no overlapping vertices and no crossed
  // sides.
  validateShape?: boolean;
  tandem: Tandem;
};

class QuadrilateralShapeModel {

  // Vertices of the quadrilateral.
  public readonly vertexA: Vertex;
  public readonly vertexB: Vertex;
  public readonly vertexC: Vertex;
  public readonly vertexD: Vertex;
  public readonly vertices: Vertex[];

  // Sides of the quadrilateral.
  public readonly sideAB: Side;
  public readonly sideBC: Side;
  public readonly sideCD: Side;
  public readonly sideDA: Side;
  public readonly sides: Side[];

  // Available space for the Vertices to move.
  private readonly modelBounds: Bounds2;

  // If true, the shape is tested to make sure it is valid (no overlapping vertices or crossed sides).
  private readonly validateShape: boolean;

  // Monitors angles of the shape to determine when pairs of opposite sides are parallel.
  public readonly sideABSideCDParallelSideChecker: ParallelSideChecker;
  public readonly sideBCSideDAParallelSideChecker: ParallelSideChecker;
  public readonly parallelSideCheckers: ParallelSideChecker[];

  // Whether the quadrilateral is a parallelogram. This Property is true when both ParallelSideCheckers report
  // parallel sides.
  public readonly isParallelogramProperty: Property<boolean>;

  // The area of the quadrilateral. Updated in "deferred" Properties, only after positions of all four vertices are
  // determined.
  public readonly areaProperty: TProperty<number>;

  // Uses shape Properties to detect the shape name.
  private readonly shapeDetector: QuadrilateralShapeDetector;

  // The tolerance intervals for angle and length comparisons when comparing two angle/lengths with one another.
  // These values are generally larger than "static" angle tolerance intervals to account for compounding error
  // when comparing angles. For example, we want a bit more flexibility when comparing angles of a trapezoid or else
  // it would be incredibly difficult to find that shape.
  public readonly interAngleToleranceInterval: number;
  public readonly interLengthToleranceInterval: number;

  // The tolerance interval for angle comparisons when comparing a vertex angle with a static value. This
  // tolerance interval will generally be smaller than the "inter" intervals because we don't want much wiggle room
  // when detecting critical angles. For example, the angle needs to be very close to Math.PI / 2 to be considered
  // a "right angle" and make the "right angle indicators" appear.
  public readonly staticAngleToleranceInterval: number;

  // Emits an event whenever the shape of the Quadrilateral changes
  public readonly shapeChangedEmitter: TEmitter;

  // True when all angles of the quadrilateral are right angles within interAngleToleranceInterval.
  public readonly allAnglesRightProperty: Property<boolean>;

  // True when all lengths of the quadrilateral are equal within the lengthToleranceInterval.
  public readonly allLengthsEqualProperty: Property<boolean>;

  // The name of the quadrilateral (like square/rhombus/trapezoid, etc). Will be null if it is a random
  // unnamed shape.
  public readonly shapeNameProperty: EnumerationProperty<NamedQuadrilateral>;

  // Arrays that define the relationship between Sides in the model, either opposite or adjacent once they are
  // assembled to form the Quadrilateral shape.
  // TODO: Remove these in place of the maps below.
  private readonly adjacentSides: SidePair[];
  private readonly oppositeSides: SidePair[];

  // A map that provides the adjacent vertices to the provided Vertex.
  public readonly adjacentVertexMap: Map<Vertex, Vertex[]>;

  // A map that provides the opposite vertex from a give vertex.
  public readonly oppositeVertexMap: Map<Vertex, Vertex[]>;

  // A map that provides the adjacent sides to the provided Side.
  public readonly adjacentSideMap: Map<Side, Side[]>;

  // A map that provides the opposite side from the provided Side.
  public readonly oppositeSideMap: Map<Side, Side>;

  // An array of all the adjacent VertexPairs that currently have equal angles.
  public readonly adjacentEqualVertexPairsProperty: Property<VertexPair[]>;

  // An array of all the opposite VertexPairs that currently have equal angles.
  public readonly oppositeEqualVertexPairsProperty: Property<VertexPair[]>;

  // An array of all the adjacent SidePairs that have equal lengths.
  public readonly adjacentEqualSidePairsProperty: Property<SidePair[]>;

  // An array of all the opposite SidePairs that have equal side lengths.
  public readonly oppositeEqualSidePairsProperty: Property<SidePair[]>;

  // An array of all the (opposite) SidePairs that currently parallel with each other.
  public readonly parallelSidePairsProperty: Property<SidePair[]>;

  // Is the simulation *not* being reset?
  private readonly resetNotInProgressProperty: TProperty<boolean>;

  // True when the Properties of the shape are currently being deferred, preventing listeners from being called and
  // new values from being set.
  private propertiesDeferred: boolean;

  public constructor( modelBounds: Bounds2, resetNotInProgressProperty: TProperty<boolean>, smoothingLengthProperty: TReadOnlyProperty<number>, providedOptions: QuadrilateralShapeModelOptions ) {

    const options = optionize<QuadrilateralShapeModelOptions, QuadrilateralShapeModelOptions>()( {
      validateShape: true
    }, providedOptions );

    this.validateShape = options.validateShape;

    this.vertexA = new Vertex( new Vector2( -0.25, 0.25 ), VertexLabel.VERTEX_A, smoothingLengthProperty, options.tandem.createTandem( 'vertexA' ) );
    this.vertexB = new Vertex( new Vector2( 0.25, 0.25 ), VertexLabel.VERTEX_B, smoothingLengthProperty, options.tandem.createTandem( 'vertexB' ) );
    this.vertexC = new Vertex( new Vector2( 0.25, -0.25 ), VertexLabel.VERTEX_C, smoothingLengthProperty, options.tandem.createTandem( 'vertexC' ) );
    this.vertexD = new Vertex( new Vector2( -0.25, -0.25 ), VertexLabel.VERTEX_D, smoothingLengthProperty, options.tandem.createTandem( 'vertexD' ) );

    // Collection of the vertices which should be easy to iterate over
    this.vertices = [ this.vertexA, this.vertexB, this.vertexC, this.vertexD ];

    this.oppositeVertexMap = new Map( [
      [ this.vertexA, [ this.vertexC ] ],
      [ this.vertexB, [ this.vertexD ] ],
      [ this.vertexC, [ this.vertexA ] ],
      [ this.vertexD, [ this.vertexB ] ]
    ] );

    this.adjacentVertexMap = new Map( [
      [ this.vertexA, [ this.vertexB, this.vertexD ] ],
      [ this.vertexB, [ this.vertexA, this.vertexC ] ],
      [ this.vertexC, [ this.vertexB, this.vertexD ] ],
      [ this.vertexD, [ this.vertexA, this.vertexC ] ]
    ] );

    this.sideAB = new Side( this.vertexA, this.vertexB, options.tandem.createTandem( 'sideAB' ), {
      offsetVectorForTiltCalculation: new Vector2( 0, 1 ),
      validateShape: options.validateShape
    } );
    this.sideBC = new Side( this.vertexB, this.vertexC, options.tandem.createTandem( 'sideBC' ), {
      validateShape: options.validateShape
    } );
    this.sideCD = new Side( this.vertexC, this.vertexD, options.tandem.createTandem( 'sideCD' ), {
      offsetVectorForTiltCalculation: new Vector2( 0, -1 ),
      validateShape: options.validateShape
    } );
    this.sideDA = new Side( this.vertexD, this.vertexA, options.tandem.createTandem( 'sideDA' ), {
      offsetVectorForTiltCalculation: new Vector2( -1, 0 ),
      validateShape: options.validateShape
    } );

    this.sides = [ this.sideAB, this.sideBC, this.sideCD, this.sideDA ];

    this.oppositeSideMap = new Map( [
      [ this.sideAB, this.sideCD ],
      [ this.sideBC, this.sideDA ],
      [ this.sideCD, this.sideAB ],
      [ this.sideDA, this.sideBC ]
    ] );

    this.adjacentSideMap = new Map( [
      [ this.sideAB, [ this.sideDA, this.sideBC ] ],
      [ this.sideBC, [ this.sideAB, this.sideCD ] ],
      [ this.sideCD, [ this.sideBC, this.sideDA ] ],
      [ this.sideDA, [ this.sideCD, this.sideAB ] ]
    ] );

    this.adjacentSides = [
      new SidePair( this.sideAB, this.sideBC ),
      new SidePair( this.sideBC, this.sideCD ),
      new SidePair( this.sideCD, this.sideDA ),
      new SidePair( this.sideDA, this.sideAB )
    ];

    this.oppositeSides = [
      new SidePair( this.sideAB, this.sideCD ),
      new SidePair( this.sideBC, this.sideDA )
    ];

    this.adjacentEqualVertexPairsProperty = new Property<VertexPair[]>( [] );
    this.oppositeEqualVertexPairsProperty = new Property<VertexPair[]>( [] );
    this.adjacentEqualSidePairsProperty = new Property<SidePair[]>( [] );
    this.oppositeEqualSidePairsProperty = new Property<SidePair[]>( [] );
    this.parallelSidePairsProperty = new Property<SidePair[]>( [] );

    // Connect the sides, creating the shape and giving vertices the information they need to determine their angles.
    this.sideBC.connectToSide( this.sideAB );
    this.sideCD.connectToSide( this.sideBC );
    this.sideDA.connectToSide( this.sideCD );
    this.sideAB.connectToSide( this.sideDA );

    this.isParallelogramProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isParallelogramProperty' )
    } );

    this.allAnglesRightProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'allAnglesRightProperty' )
    } );

    this.allLengthsEqualProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'allLengthsEqualProperty' )
    } );

    this.shapeNameProperty = new EnumerationProperty( NamedQuadrilateral.CONVEX_QUADRILATERAL, {
      tandem: options.tandem.createTandem( 'shapeNameProperty' )
    } );

    this.areaProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'areaProperty' )
    } );

    this.shapeChangedEmitter = new Emitter<[]>( {
      tandem: options.tandem.createTandem( 'shapeChangedEmitter' )
    } );

    this.interAngleToleranceInterval = QuadrilateralShapeModel.getWidenedToleranceInterval( QuadrilateralQueryParameters.interAngleToleranceInterval );
    this.staticAngleToleranceInterval = QuadrilateralShapeModel.getWidenedToleranceInterval( QuadrilateralQueryParameters.staticAngleToleranceInterval );
    this.interLengthToleranceInterval = QuadrilateralShapeModel.getWidenedToleranceInterval( QuadrilateralQueryParameters.staticAngleToleranceInterval );

    this.sideABSideCDParallelSideChecker = new ParallelSideChecker(
      new SidePair( this.sideAB, this.sideCD ),
      this.shapeChangedEmitter,
      options.tandem.createTandem( 'sideABSideCDParallelSideChecker' )
    );

    this.sideBCSideDAParallelSideChecker = new ParallelSideChecker(
      new SidePair( this.sideBC, this.sideDA ),
      this.shapeChangedEmitter,
      options.tandem.createTandem( 'sideBCSideDAParallelSideChecker' )
    );

    this.parallelSideCheckers = [
      this.sideABSideCDParallelSideChecker,
      this.sideBCSideDAParallelSideChecker
    ];

    this.modelBounds = modelBounds;
    this.resetNotInProgressProperty = resetNotInProgressProperty;

    this.shapeDetector = new QuadrilateralShapeDetector( this );

    this.propertiesDeferred = false;

    Multilink.multilink( [
        this.vertexA.positionProperty,
        this.vertexB.positionProperty,
        this.vertexC.positionProperty,
        this.vertexD.positionProperty ],
      ( position1, position2, position3, position4 ) => {

        // Update Properties after Vertex positions have changed.
        this.updateOrderDependentProperties();

        this.shapeChangedEmitter.emit();

        // After the shape has changed, update the areas of allowed motion for each Vertex.
        this.setVertexDragAreas();
      }
    );

    // make adjacent sides non-interactive when a Side is pressed to avoid buggy multitouch cases
    // TODO: Move to the view?
    this.makeAdjacentSidesNonInteractiveWhenPressed( this.sideAB, this.sideCD, this.sideDA, this.sideBC );
    this.makeAdjacentSidesNonInteractiveWhenPressed( this.sideDA, this.sideBC, this.sideAB, this.sideCD );

    this.vertices.forEach( vertex => {
      vertex.modelBoundsProperty.link( vertexBounds => {
        vertex.topConstrainedProperty.value = Utils.equalsEpsilon( vertexBounds.maxY, this.modelBounds.maxY, 0.01 );
        vertex.rightConstrainedProperty.value = Utils.equalsEpsilon( vertexBounds.maxX, this.modelBounds.maxX, 0.01 );
        vertex.bottomConstrainedProperty.value = Utils.equalsEpsilon( vertexBounds.minY, this.modelBounds.minY, 0.01 );
        vertex.leftConstrainedProperty.value = Utils.equalsEpsilon( vertexBounds.minX, this.modelBounds.minX, 0.01 );
      } );
    } );
  }

  /**
   * When a side becomes pressed, its adjacent sides become non-interactive so that input to both do not cause jitter.
   * Prevents buggy multitouch cases.
   */
  private makeAdjacentSidesNonInteractiveWhenPressed( firstOppositeSide: Side, secondOppositeSide: Side, firstAdjacentSide: Side, secondAdjacentSide: Side ): void {
    Multilink.multilink( [ firstOppositeSide.isPressedProperty, secondOppositeSide.isPressedProperty ], ( firstOppositeSidePressed, secondOppositeSidePressed ) => {
      const interactive = !firstOppositeSidePressed && !secondOppositeSidePressed;
      firstAdjacentSide.interactiveProperty.value = interactive;
      secondAdjacentSide.interactiveProperty.value = interactive;
    } );
  }

  /**
   * Returns true if the current quadrilateral shape is allowed based on the rules of this model.
   * TODO: Documentation and readability.
   */
  public isQuadrilateralShapeAllowed(): boolean {
    let shapeAllowed = true;

    for ( let i = 0; i < this.vertices.length; i++ ) {
      const testVertex = this.vertices[ i ];

      // The vertex must be completely within model bounds
      shapeAllowed = this.modelBounds.containsBounds( testVertex.modelBoundsProperty.value );

      // Make sure that no vertices overlap any other (only need to do this if  we haven't already found
      // a disallowed case.
      if ( shapeAllowed ) {
        for ( let j = 0; j < this.vertices.length; j++ ) {
          const otherVertex = this.vertices[ j ];

          if ( testVertex !== otherVertex ) {
            shapeAllowed = !testVertex.overlapsOther( otherVertex );

            // Shape is not allowed, no need to keep testing
            if ( !shapeAllowed ) {
              break;
            }
          }
        }
      }

      // Make sure that no vertex bounds overlap any line
      if ( shapeAllowed ) {
        for ( let j = 0; j < this.sides.length; j++ ) {
          const side = this.sides[ j ];
          if ( !side.includesVertex( testVertex ) ) {
            shapeAllowed = !side.shapeProperty.value.intersectsBounds( testVertex.modelBoundsProperty.value );

            if ( !shapeAllowed ) {
              break;
            }
          }
        }
      }

      // If no vertices overlap, make sure that the vertex is within the drag area. No need to do this
      // (potentially expensive) Shape work if the shape is already disallowed.
      if ( shapeAllowed ) {
        assert && assert( testVertex.dragAreaProperty.value, 'Drag area must be defined for the Vertex' );
        shapeAllowed = QuadrilateralUtils.customShapeContainsPoint( testVertex.dragAreaProperty.value!, testVertex.positionProperty.value );
      }

      // Shape is not allowed, no need to keep testing
      if ( !shapeAllowed ) {
        break;
      }
    }

    return shapeAllowed;
  }

  /**
   * Returns true when all angles are right.
   */
  public getAreAllAnglesRight(): boolean {
    return _.every( this.vertices, vertex => this.isRightAngle( vertex.angleProperty.value! ) );
  }

  /**
   * Returns true when all lengths are equal.
   */
  public getAreAllLengthsEqual(): boolean {
    return this.isInterLengthEqualToOther( this.sideAB.lengthProperty.value, this.sideBC.lengthProperty.value ) &&
           this.isInterLengthEqualToOther( this.sideBC.lengthProperty.value, this.sideCD.lengthProperty.value ) &&
           this.isInterLengthEqualToOther( this.sideCD.lengthProperty.value, this.sideDA.lengthProperty.value ) &&
           this.isInterLengthEqualToOther( this.sideDA.lengthProperty.value, this.sideAB.lengthProperty.value );
  }

  /**
   * Returns the area of the quadrilateral. Uses Bretschneider's formula for the area of a general quadrilateral,
   * see https://en.wikipedia.org/wiki/Bretschneider%27s_formula.
   *
   * Dependent on side lengths and angles, must be used in updateOrderDependentProperties.
   */
  private getArea(): number {
    const a = this.sideAB.lengthProperty.value;
    const b = this.sideBC.lengthProperty.value;
    const c = this.sideCD.lengthProperty.value;
    const d = this.sideDA.lengthProperty.value;

    // can be any two opposite angles
    const firstAngle = this.vertexA.angleProperty.value!;
    const secondAngle = this.vertexC.angleProperty.value!;

    // semiperimeter
    const s = ( a + b + c + d ) / 2;

    const cosArg = Math.cos( ( firstAngle + secondAngle ) / 2 );
    const area = Math.sqrt( ( s - a ) * ( s - b ) * ( s - c ) * ( s - d ) - ( a * b * c * d ) * cosArg * cosArg );

    const isAreaNaN = isNaN( area );

    // A vertex might be overlapped with a side or another Vertex in the "test" shape while we are trying to find
    // a good vertex position. Gracefully handle this by returning an area of zero (area is NaN/undefined otherwise).
    if ( this.validateShape ) {
      assert && assert( !isAreaNaN, 'Area is not defined for the quadrilateral shape' );
    }
    return isAreaNaN ? 0 : area;
  }

  /**
   * Returns true if the two angles are equal withing angleToleranceInterval.
   */
  public isInterAngleEqualToOther( angle1: number, angle2: number ): boolean {
    return Utils.equalsEpsilon( angle1, angle2, this.interAngleToleranceInterval );
  }

  /**
   * Returns true if the lengths are equal to each other within interLengthToleranceInterval.
   */
  public isInterLengthEqualToOther( length1: number, length2: number ): boolean {
    return Utils.equalsEpsilon( length1, length2, this.interLengthToleranceInterval );
  }

  public isRightAngle( angle: number ): boolean {
    return Utils.equalsEpsilon( angle, Math.PI / 2, this.staticAngleToleranceInterval );
  }

  /**
   * Returns true if two angles are equal within staticAngleToleranceInterval. See that value for more
   * information.
   */
  public isStaticAngleEqualToOther( angle: number, otherAngle: number ): boolean {
    return Utils.equalsEpsilon( angle, otherAngle, this.staticAngleToleranceInterval );
  }

  /**
   * Returns true if two angles are equal within the provided tolerance interval.
   */
  public static isAngleEqualToOther( angle1: number, angle2: number, toleranceInterval: number ): boolean {
    return Utils.equalsEpsilon( angle1, angle2, toleranceInterval );
  }

  /**
   * Returns true if the angle is equal to PI within staticAngleToleranceInterval.
   */
  public isFlatAngle( angle: number ): boolean {
    return this.isStaticAngleEqualToOther( angle, Math.PI );
  }

  /**
   * Set multiple vertex positions at once, updating each and then calling relevant Property listeners after
   * all are set. This way you can safely set multiple at a time without transient states where the shape is
   * not valid.
   */
  public setVertexPositions( verticesWithProposedPositions: VertexWithProposedPosition[] ): void {

    this.setPropertiesDeferred( true );

    // set all positions
    verticesWithProposedPositions.forEach( vertexWithProposedPosition => {

      // this is a new Vector2 instance so even if x,y values are the same as the old value it will triggere
      // listeners without this check
      const proposedPosition = vertexWithProposedPosition.proposedPosition!;
      assert && assert( proposedPosition, 'proposedPosition must be defined to set positions' );
      if ( !proposedPosition.equals( vertexWithProposedPosition.vertex.positionProperty.value ) ) {
        vertexWithProposedPosition.vertex.positionProperty.set( proposedPosition );
      }
    } );

    // un-defer all so that all Properties and calls callbacks
    this.setPropertiesDeferred( false );
  }

  /**
   * Update Properties that need to be updated only after other model Properties are set. This also controls the order
   * in which Properties are set, which is very important in this sim. Positions need to update, then angles, then
   * parallelogram state, and finally shape name.
   */
  public updateOrderDependentProperties(): void {

    // update angles
    this.vertices.forEach( vertex => {
      vertex.updateAngle();
    } );

    // update lengths
    this.sides.forEach( side => {
      side.updateLength();
    } );

    this.updateParallelSideProperties();

    // update pairs of vertices and sides
    this.updateVertexAngleComparisons();
    this.updateSideLengthComparisons();

    this.areaProperty.set( this.getArea() );

    this.allAnglesRightProperty.set( this.getAreAllAnglesRight() );
    this.allLengthsEqualProperty.set( this.getAreAllLengthsEqual() );

    // getShapeName requires all shape Properties to be calculated, so this is done at the very end
    this.shapeNameProperty.set( this.shapeDetector.getShapeName() );
  }

  /**
   * Update Properties managing Angle comparisons which hold VertexPairs that have equal angles. These VertexPairs
   * will be adjacent vertices or opposite vertices.
   */
  private updateVertexAngleComparisons(): void {
    this.updateEqualVertexPairs( this.adjacentEqualVertexPairsProperty, this.adjacentVertexMap );
    this.updateEqualVertexPairs( this.oppositeEqualVertexPairsProperty, this.oppositeVertexMap );
  }

  /**
   * Update a Property for a list of equal adjacent or opposite angles.
   */
  private updateEqualVertexPairs( equalVertexPairsProperty: Property<VertexPair[]>, vertexMap: Map<Vertex, Vertex[]> ): void {
    const currentVertexPairs = equalVertexPairsProperty.value;
    vertexMap.forEach( ( relatedVertices, keyVertex, map ) => {
      relatedVertices.forEach( relatedVertex => {
        const vertexPair = new VertexPair( keyVertex, relatedVertex );

        const firstAngle = vertexPair.vertex1.angleProperty.value!;
        const secondAngle = vertexPair.vertex2.angleProperty.value!;
        const currentlyIncludesVertexPair = _.some( currentVertexPairs, currentVertexPair => currentVertexPair.equals( vertexPair ) );
        const areAnglesEqual = this.isInterAngleEqualToOther( firstAngle, secondAngle );

        if ( currentlyIncludesVertexPair && !areAnglesEqual ) {

          // the VertexPair needs to be removed because angles are no longer equal
          currentVertexPairs.splice( currentVertexPairs.indexOf( vertexPair ), 1 );
          equalVertexPairsProperty.notifyListenersStatic();
        }
        else if ( !currentlyIncludesVertexPair && areAnglesEqual ) {

          // the VertexPair needs to be added because they just became equal
          currentVertexPairs.push( vertexPair );
          equalVertexPairsProperty.notifyListenersStatic();
        }
      } );
    } );
  }

  /**
   * Update Properties managing side length comparisons. Add or remove SidePairs from adjacentEqualSidePairsProperty
   * and oppositeEqualSidePairsProperty depending on length equalities.
   *
   * TODO: Rename and update docs to make more clear.
   */
  private updateSideLengthComparisons(): void {
    this.updateEqualLengthSidePairs( this.adjacentEqualSidePairsProperty, this.adjacentSides );
    this.updateEqualLengthSidePairs( this.oppositeEqualSidePairsProperty, this.oppositeSides );
  }

  /**
   * Update particular Property that holds collections of SidePairs that are equal in length. Uses
   * shapeLengthToleranceIntervalProperty for comparison tolerances.
   */
  private updateEqualLengthSidePairs( equalSidePairsProperty: Property<SidePair[]>, allSidePairs: SidePair[] ): void {
    const currentSidePairs = equalSidePairsProperty.value;
    for ( let i = 0; i < allSidePairs.length; i++ ) {
      const sidePair = allSidePairs[ i ];

      const firstLength = sidePair.side1.lengthProperty.value;
      const secondLength = sidePair.side2.lengthProperty.value;
      const currentlyIncludesSidePair = currentSidePairs.includes( sidePair );
      const areLengthsEqual = this.isInterLengthEqualToOther( firstLength, secondLength );

      if ( currentlyIncludesSidePair && !areLengthsEqual ) {

        // the VertexPair needs to be removed because angles are no longer equal
        currentSidePairs.splice( currentSidePairs.indexOf( sidePair ), 1 );
        equalSidePairsProperty.notifyListenersStatic();
      }
      else if ( !currentlyIncludesSidePair && areLengthsEqual ) {

        // the VertexPair needs to be added because they just became equal
        currentSidePairs.push( sidePair );
        equalSidePairsProperty.notifyListenersStatic();
      }
    }
  }

  /**
   * Updates Properties related to opposite pairs of parallel sides and the isParallelogramProperty. To be used in
   * updateOrderDependentProperties.
   */
  private updateParallelSideProperties(): void {
    const sideABSideCDParallel = this.sideABSideCDParallelSideChecker.areSidesParallel();
    const sideBCSideDAParallel = this.sideBCSideDAParallelSideChecker.areSidesParallel();
    this.isParallelogramProperty.set( sideABSideCDParallel && sideBCSideDAParallel );

    const previousParallelSidePairs = this.parallelSidePairsProperty.value;
    const currentParallelSidePairs = [];
    if ( sideABSideCDParallel ) {
      currentParallelSidePairs.push( this.sideABSideCDParallelSideChecker.sidePair );
    }
    if ( sideBCSideDAParallel ) {
      currentParallelSidePairs.push( this.sideBCSideDAParallelSideChecker.sidePair );
    }

    if ( !_.isEqual( previousParallelSidePairs, currentParallelSidePairs ) ) {
      this.parallelSidePairsProperty.value = currentParallelSidePairs;
    }
  }

  /**
   * Sets this model to be the same as the provided QuadrilateralShapeModel by setting Vertex positions.
   *
   * TODO: Rename?
   */
  public set( other: QuadrilateralShapeModel ): void {

    // since we are updating many vertices at once we need to defer callbacks while vertices could create a bad
    // shape as we set each one
    this.setPropertiesDeferred( true );

    this.vertexA.positionProperty.set( other.vertexA.positionProperty.value );
    this.vertexB.positionProperty.set( other.vertexB.positionProperty.value );
    this.vertexC.positionProperty.set( other.vertexC.positionProperty.value );
    this.vertexD.positionProperty.set( other.vertexD.positionProperty.value );

    this.setPropertiesDeferred( false );
  }

  /**
   * Get the vertex of this shape model with the provided vertexLabel.
   */
  public getLabelledVertex( vertexLabel: VertexLabel ): Vertex {
    const labelledVertex = _.find( this.vertices, vertex => vertex.vertexLabel === vertexLabel );

    assert && assert( labelledVertex, 'Could not find labelled vertex' );
    return labelledVertex!;
  }

  /**
   * Update the drag areas for all vertices.
   */
  private setVertexDragAreas(): void {

    // TODO: What is this dilation and value??
    const dilatedBounds = this.modelBounds.dilated( 1 );

    this.vertexA.dragAreaProperty.set( QuadrilateralUtils.createVertexArea( dilatedBounds, this.vertexA, this.vertexB, this.vertexC, this.vertexD, this.validateShape ) );
    this.vertexB.dragAreaProperty.set( QuadrilateralUtils.createVertexArea( dilatedBounds, this.vertexB, this.vertexC, this.vertexD, this.vertexA, this.validateShape ) );
    this.vertexC.dragAreaProperty.set( QuadrilateralUtils.createVertexArea( dilatedBounds, this.vertexC, this.vertexD, this.vertexA, this.vertexB, this.validateShape ) );
    this.vertexD.dragAreaProperty.set( QuadrilateralUtils.createVertexArea( dilatedBounds, this.vertexD, this.vertexA, this.vertexB, this.vertexC, this.validateShape ) );
  }

  public setPropertiesDeferred( deferred: boolean ): void {
    assert && assert( deferred !== this.propertiesDeferred, 'deferred state must be changing, you may have not un-deferred Properties' );
    this.propertiesDeferred = deferred;

    // set deferred for all Properties first so that their values are up to date by the time we call listeners
    const deferredVertexListeners = this.vertices.map( vertex => vertex.setPropertiesDeferred( deferred ) );

    // call any deferred callbacks if no longer deferred
    if ( !deferred ) {
      deferredVertexListeners.forEach( deferredListener => deferredListener && deferredListener() );
    }
  }

  /**
   * Reset the shape by resetting vertices. Defer update of Properties so that Properties do not
   * call listeners until all Vertices have been repositioned.
   */
  public reset(): void {

    // set necessary Properties deferred so that we can update everything together
    this.setPropertiesDeferred( true );

    this.vertexA.reset();
    this.vertexB.reset();
    this.vertexC.reset();
    this.vertexD.reset();

    this.setPropertiesDeferred( false );
  }

  /**
   * Reset the shape AND indicate that a reset is in progress (which will disable certain feedback while the
   * reset is in progress). Use this when just resetting the QuadrilateralShapeModel without resetting other
   * aspects of the Model.
   */
  public isolatedReset(): void {
    this.resetNotInProgressProperty.value = false;
    this.reset();
    this.resetNotInProgressProperty.value = true;
  }

  /**
   * Returns the tolerance interval to use for a value. Generally, the default value will be returned. If the sim is
   * running while connected to a device (?deviceConnection) or in a mode where all step sizes are reduced, the
   * value will be further reduced by scale factors provided by query parameter.
   */
  public static getWidenedToleranceInterval( defaultValue: number ): number {
    let interval = defaultValue;

    // Note that both cases are possible and the scale factors compound!
    if ( QuadrilateralQueryParameters.reducedStepSize ) {
      interval = interval * QuadrilateralQueryParameters.reducedStepSizeToleranceIntervalScaleFactor;
    }
    if ( QuadrilateralQueryParameters.deviceConnection ) {
      interval = interval * QuadrilateralQueryParameters.connectedToleranceIntervalScaleFactor;
    }

    return interval;
  }
}

quadrilateral.register( 'QuadrilateralShapeModel', QuadrilateralShapeModel );
export default QuadrilateralShapeModel;

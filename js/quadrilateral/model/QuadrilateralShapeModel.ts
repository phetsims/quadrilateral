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
import { Line, Shape } from '../../../../kite/js/imports.js';
import QuadrilateralModel from './QuadrilateralModel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Ray2 from '../../../../dot/js/Ray2.js';
import SideLengths from './SideLengths.js';
import VertexLabel from './VertexLabel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VertexAngles from './VertexAngles.js';
import ParallelSideChecker from './ParallelSideChecker.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import QuadrilateralShapeDetector from './QuadrilateralShapeDetector.js';
import SidePair from './SidePair.js';
import VertexPair from './VertexPair.js';
import dotRandom from '../../../../dot/js/dotRandom.js';

// A useful type for calculations for the vertex Shapes which define where the Vertex can move depending on
// the positions of the other vertices. Lines are along the bounds of model space and RayIntersections
// are the intersections between rays formed by adjacent vertices and the Line. See createVertexAreas for
// more information.
type LineIntersectionPair = {
  line: Line;
  intersectionPoint: Vector2;
};

export type VertexWithProposedPosition = {
  vertex: Vertex;

  // This may not be available if something goes wrong with the marker detection
  proposedPosition?: Vector2;
};

type QuadrilateralShapeModelOptions = {

  // If true, validation will be done to ensure that the quadrilateral shape is reasonable. But this may be
  // undesirable if you want to use this QuadrilateralShapeModel to determine if the proposed shape is
  // reasonable.
  validateShape?: boolean;
  tandem: Tandem;
};

class QuadrilateralShapeModel {

  // Vertices of the quadrilateral.
  public vertexA: Vertex;
  public vertexB: Vertex;
  public vertexC: Vertex;
  public vertexD: Vertex;

  // Sides of the quadrilateral.
  public topSide: Side;
  public rightSide: Side;
  public bottomSide: Side;
  public leftSide: Side;

  // Monitors angles of the shape to determine when pairs of opposite sides are parallel.
  public readonly sideABSideCDParallelSideChecker: ParallelSideChecker;
  public readonly sideBCSideDAParallelSideChecker: ParallelSideChecker;

  // ParallelSideCheckers are responsible for determining if opposite SidePairs are parallel within their dynamic
  // parallelAngleToleranceIntervalProperty. This is the collection of both checkers, one for each OppositeSidePair.
  public readonly parallelSideCheckers: ParallelSideChecker[];

  // Observables that indicate when the sides become parallel. Updated after all vertex positions have been set
  // so they are consistently up to date.
  public readonly sideABSideCDParallelProperty = new BooleanProperty( false );
  public readonly sideBCSideDAParallelProperty = new BooleanProperty( false );

  // The area of the quadrilateral. Updated in "deferred" Properties, only after positions of all four vertices are
  // determined.
  public readonly areaProperty: TProperty<number>;

  public readonly vertices: Vertex[];
  public readonly sides: Side[];

  private readonly shapeDetector: QuadrilateralShapeDetector;

  // See QuadrilateralShapeModelOptions
  private readonly validateShape: boolean;

  // Reference to the simulation model for other needed state.
  public readonly model: QuadrilateralModel;

  // Whether or not the Properties of the shape are currently being deferred, preventing listeners
  // from being called and new values from being set.
  private propertiesDeferred: boolean;

  // The tolerance interval for angle and length comparisons when detecting shape names. This needs to be different
  // from the parallelAToleranceInterval of the ParallelSideCheckers because those tolerance intervals can change
  // depending on method of input to support learning goals. The shape detection comparisons need a more consistent
  // angle tolerance interval. However, there is some unique behavior when connected to the tangible device.
  public readonly interAngleToleranceIntervalProperty: TReadOnlyProperty<number>;
  public readonly interLengthToleranceIntervalProperty: TReadOnlyProperty<number>;

  // The tolerance interval when values comparing angles against constants. This needs to be a different value
  // than interAngleToleranceIntervalProperty because that tolerance is used for sums of values so there may be
  // compounding error.
  public readonly staticAngleToleranceIntervalProperty: TReadOnlyProperty<number>;

  // Emits an event whenever the shape of the Quadrilateral changes
  public shapeChangedEmitter: TEmitter;

  // Whether the quadrilateral is a parallelogram. This Property updates async in the step function! We need to
  // update this Property after all vertex positions and all vertex angles have been updated. When moving more than
  // one vertex at a time, only one vertex position updates synchronously in the code and in those transient states
  // the model may temporarily not be a parallelogram. Updating in step after all Properties and listeners are done
  // with this work resolves the problem.
  public isParallelogramProperty: Property<boolean>;

  // Whether or not all angles of the quadrilateral are right angles within interAngleToleranceInterval.
  // This is set in step because we need to wait until all vertices are positioned during model
  // updates.
  public allAnglesRightProperty: Property<boolean>;

  // Whether or not all lenghts of the quadrilateral are equal within the lengthToleranceInterval.
  // Updated asychronously because we need to make sure that the positions of vertices have stabilized
  // after model updates.
  public allLengthsEqualProperty: Property<boolean>;

  // The name of the quadrilateral (like square/rhombus/trapezoid, etc). Will be null if it is a random
  // unnamed shape.
  public readonly shapeNameProperty: EnumerationProperty<NamedQuadrilateral>;

  // A collection of the Side lengths at a point in time. Updated whenever an interaction begins with the
  // quadrilateral. Allows us to monitor the change in Side lengths during interaction.
  // TODO: Delete this? Are we still using 'saved' features?
  public savedSideLengths: SideLengths;

  // A collection of the vertex angles at a point in time. Updated whenever the quadrilateral changes.
  // TODO: Delete this? Are we still using 'saved' features?
  private savedVertexAngles: VertexAngles;

  // Arrays that define the relationship between vertices in the model, either opposite or adjacent once they are
  // assembled to form the quadrilateral shape.
  // TODO: Consider removing this, the relationships are duplicated with Sides
  public readonly adjacentVertices: VertexPair[];
  public readonly oppositeVertices: VertexPair[];

  // Arrays that define the relationship between Sides in the model, either opposite or adjacent once they are
  // assembled to form the Quadrilateral shape.
  public readonly adjacentSides: SidePair[];
  public readonly oppositeSides: SidePair[];

  // A map that provides the adjacent vertices to the provided Vertex.
  public readonly adjacentVertexMap: Map<Vertex, Vertex[]>;

  // A map that provides the opposite vertex from a give vertex.
  public readonly oppositeVertexMap: Map<Vertex, Vertex>;

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

  public constructor( model: QuadrilateralModel, providedOptions: QuadrilateralShapeModelOptions ) {

    const options = optionize<QuadrilateralShapeModelOptions, QuadrilateralShapeModelOptions>()( {
      validateShape: true
    }, providedOptions );

    this.validateShape = options.validateShape;

    const smoothingLengthProperty = model.preferencesModel.tangibleOptionsModel.smoothingLengthProperty;
    this.vertexA = new Vertex( new Vector2( -0.25, 0.25 ), VertexLabel.VERTEX_A, smoothingLengthProperty, options.tandem.createTandem( 'vertexA' ) );
    this.vertexB = new Vertex( new Vector2( 0.25, 0.25 ), VertexLabel.VERTEX_B, smoothingLengthProperty, options.tandem.createTandem( 'vertexB' ) );
    this.vertexC = new Vertex( new Vector2( 0.25, -0.25 ), VertexLabel.VERTEX_C, smoothingLengthProperty, options.tandem.createTandem( 'vertexC' ) );
    this.vertexD = new Vertex( new Vector2( -0.25, -0.25 ), VertexLabel.VERTEX_D, smoothingLengthProperty, options.tandem.createTandem( 'vertexD' ) );

    // Collection of the vertices which should be easy to iterate over
    this.vertices = [ this.vertexA, this.vertexB, this.vertexC, this.vertexD ];

    this.adjacentVertices = [
      new VertexPair( this.vertexA, this.vertexB ),
      new VertexPair( this.vertexB, this.vertexC ),
      new VertexPair( this.vertexC, this.vertexD ),
      new VertexPair( this.vertexD, this.vertexA )
    ];

    this.oppositeVertices = [
      new VertexPair( this.vertexA, this.vertexC ),
      new VertexPair( this.vertexB, this.vertexD )
    ];

    this.oppositeVertexMap = new Map( [
      [ this.vertexA, this.vertexC ],
      [ this.vertexB, this.vertexD ],
      [ this.vertexC, this.vertexA ],
      [ this.vertexD, this.vertexB ]
    ] );

    this.adjacentVertexMap = new Map( [
      [ this.vertexA, [ this.vertexB, this.vertexD ] ],
      [ this.vertexB, [ this.vertexA, this.vertexC ] ],
      [ this.vertexC, [ this.vertexB, this.vertexD ] ],
      [ this.vertexD, [ this.vertexA, this.vertexC ] ]
    ] );

    this.topSide = new Side( this.vertexA, this.vertexB, options.tandem.createTandem( 'sideAB' ), {
      offsetVectorForTiltCalculation: new Vector2( 0, 1 ),
      validateShape: options.validateShape
    } );
    this.rightSide = new Side( this.vertexB, this.vertexC, options.tandem.createTandem( 'sideBC' ), {
      validateShape: options.validateShape
    } );
    this.bottomSide = new Side( this.vertexC, this.vertexD, options.tandem.createTandem( 'sideCD' ), {
      offsetVectorForTiltCalculation: new Vector2( 0, -1 ),
      validateShape: options.validateShape
    } );
    this.leftSide = new Side( this.vertexD, this.vertexA, options.tandem.createTandem( 'sideDA' ), {
      offsetVectorForTiltCalculation: new Vector2( -1, 0 ),
      validateShape: options.validateShape
    } );

    this.sides = [ this.topSide, this.rightSide, this.bottomSide, this.leftSide ];

    this.oppositeSideMap = new Map( [
      [ this.topSide, this.bottomSide ],
      [ this.rightSide, this.leftSide ],
      [ this.bottomSide, this.topSide ],
      [ this.leftSide, this.rightSide ]
    ] );

    this.adjacentSideMap = new Map( [
      [ this.topSide, [ this.leftSide, this.rightSide ] ],
      [ this.rightSide, [ this.topSide, this.bottomSide ] ],
      [ this.bottomSide, [ this.rightSide, this.leftSide ] ],
      [ this.leftSide, [ this.bottomSide, this.topSide ] ]
    ] );

    this.adjacentSides = [
      new SidePair( this.topSide, this.rightSide ),
      new SidePair( this.rightSide, this.bottomSide ),
      new SidePair( this.bottomSide, this.leftSide ),
      new SidePair( this.leftSide, this.topSide )
    ];

    this.oppositeSides = [
      new SidePair( this.topSide, this.bottomSide ),
      new SidePair( this.rightSide, this.leftSide )
    ];

    this.adjacentEqualVertexPairsProperty = new Property<VertexPair[]>( [] );
    this.oppositeEqualVertexPairsProperty = new Property<VertexPair[]>( [] );
    this.adjacentEqualSidePairsProperty = new Property<SidePair[]>( [] );
    this.oppositeEqualSidePairsProperty = new Property<SidePair[]>( [] );
    this.parallelSidePairsProperty = new Property<SidePair[]>( [] );

    // Connect the sides, creating the shape and giving vertices the information they need to determine their angles.
    this.rightSide.connectToSide( this.topSide );
    this.bottomSide.connectToSide( this.rightSide );
    this.leftSide.connectToSide( this.bottomSide );
    this.topSide.connectToSide( this.leftSide );

    this.savedSideLengths = this.getSideLengths();
    this.savedVertexAngles = this.getVertexAngles();

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

    this.interAngleToleranceIntervalProperty = new DerivedProperty( [ model.preferencesModel.reducedStepSizeProperty ], reducedStepSize => {
      return QuadrilateralShapeModel.getWidenedToleranceInterval( QuadrilateralQueryParameters.interAngleToleranceInterval, reducedStepSize );
    }, {
      tandem: options.tandem.createTandem( 'interAngleToleranceIntervalProperty' ),
      phetioValueType: NumberIO
    } );

    this.staticAngleToleranceIntervalProperty = new DerivedProperty( [ model.preferencesModel.reducedStepSizeProperty ], reducedStepSize => {
      return QuadrilateralShapeModel.getWidenedToleranceInterval( QuadrilateralQueryParameters.staticAngleToleranceInterval, reducedStepSize );
    }, {
      tandem: options.tandem.createTandem( 'staticAngleToleranceIntervalProperty' ),
      phetioValueType: NumberIO
    } );

    this.interLengthToleranceIntervalProperty = new DerivedProperty( [ model.preferencesModel.reducedStepSizeProperty ], reducedStepSize => {
      return QuadrilateralShapeModel.getWidenedToleranceInterval( QuadrilateralQueryParameters.interLengthToleranceInterval, reducedStepSize );
    }, {
      tandem: options.tandem.createTandem( 'shapeLengthToleranceIntervalProperty' ),
      phetioValueType: NumberIO
    } );

    this.sideABSideCDParallelSideChecker = new ParallelSideChecker(
      new SidePair( this.topSide, this.bottomSide ),
      this.shapeChangedEmitter,
      model.preferencesModel.reducedStepSizeProperty,
      options.tandem.createTandem( 'sideABSideCDParallelSideChecker' )
    );

    this.sideBCSideDAParallelSideChecker = new ParallelSideChecker(
      new SidePair( this.rightSide, this.leftSide ),
      this.shapeChangedEmitter,
      model.preferencesModel.reducedStepSizeProperty,
      options.tandem.createTandem( 'sideBCSideDAParallelSideChecker' )
    );

    this.parallelSideCheckers = [
      this.sideABSideCDParallelSideChecker,
      this.sideBCSideDAParallelSideChecker
    ];

    this.shapeDetector = new QuadrilateralShapeDetector( this );

    this.model = model;
    this.propertiesDeferred = false;

    this.saveSideLengths();

    Multilink.multilink( [
        this.vertexA.positionProperty,
        this.vertexB.positionProperty,
        this.vertexC.positionProperty,
        this.vertexD.positionProperty ],
      ( position1, position2, position3, position4 ) => {

        // Update Properties after Vertex positions have changed. Please note the usage of
        // setDeferred for Vertex position Properties in this sim because it is important
        // that this be called after all Vertex positions have been set when moving several
        // at once.
        this.updateOrderDependentProperties();

        this.shapeChangedEmitter.emit();

        this.setVertexDragAreas();
      }
    );

    // make adjacent sides non-interactive when a Side is pressed to avoid buggy multitouch cases
    this.makeAdjacentSidesNonInteractiveWhenPressed( this.topSide, this.bottomSide, this.leftSide, this.rightSide );
    this.makeAdjacentSidesNonInteractiveWhenPressed( this.leftSide, this.rightSide, this.topSide, this.bottomSide );

    this.vertices.forEach( vertex => {
      vertex.modelBoundsProperty.link( vertexBounds => {
        vertex.topConstrainedProperty.value = Utils.equalsEpsilon( vertexBounds.maxY, model.modelBounds.maxY, 0.01 );
        vertex.rightConstrainedProperty.value = Utils.equalsEpsilon( vertexBounds.maxX, model.modelBounds.maxX, 0.01 );
        vertex.bottomConstrainedProperty.value = Utils.equalsEpsilon( vertexBounds.minY, model.modelBounds.minY, 0.01 );
        vertex.leftConstrainedProperty.value = Utils.equalsEpsilon( vertexBounds.minX, model.modelBounds.minX, 0.01 );
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
   * Get a SideLengths, a collection of all the side lengths at a particular point in time.
   */
  private getSideLengths(): SideLengths {
    return new SideLengths(
      this.topSide.lengthProperty.value,
      this.rightSide.lengthProperty.value,
      this.bottomSide.lengthProperty.value,
      this.leftSide.lengthProperty.value
    );
  }

  /**
   * Save all side lengths for the model, to monitor changes in the length over time.
   */
  public saveSideLengths(): void {
    this.savedSideLengths = this.getSideLengths();
  }

  private getVertexAngles(): VertexAngles {
    if ( assert ) {
      this.vertices.forEach( vertex => assert && assert( vertex.angleProperty, 'angle Properties need to be initialized' ) );
    }

    return new VertexAngles(
      this.vertexA.angleProperty.value,
      this.vertexB.angleProperty.value,
      this.vertexC.angleProperty.value,
      this.vertexD.angleProperty.value
    );
  }

  /**
   * Save the current set of vertex angles to this.savedVertexAngles.
   *
   * TODO: Can this be removed?
   */
  private saveVertexAngles(): void {
    this.savedVertexAngles = this.getVertexAngles();
  }

  /**
   * Shape is a kite if there is at least one set of equal opposite angles and exactly two sets of equal adjacent sides.
   */
  private isKite(): boolean {
    const angleRequirement = this.oppositeEqualVertexPairsProperty.value.length > 0;
    const lengthRequirement = this.adjacentEqualSidePairsProperty.value.length === 2;
    return angleRequirement && lengthRequirement;
  }

  /**
   * Create the drag area for a vertex from the positions of the others. The vertex area
   *
   * @param modelBounds - The bounds containing all vertices (entire model space)
   * @param vertexA - The vertex whose area we are determining
   * @param vertexB - the next vertex from vertexA, moving clockwise
   * @param vertexC - the next vertex from vertexB, moving clockwise
   * @param vertexD - the next vertex from vertexC, moving clockwise
   */
  private createVertexArea( modelBounds: Bounds2, vertexA: Vertex, vertexB: Vertex, vertexC: Vertex, vertexD: Vertex ): Shape {

    const allVerticesInBounds = _.every( [ vertexA, vertexB, vertexC, vertexD ], vertex => modelBounds.containsPoint( vertex.positionProperty.value ) );
    const vertexPositionsUnique = _.uniqBy( [ vertexA, vertexB, vertexC, vertexD ].map( vertex => vertex.positionProperty.value.toString() ), positionString => {
      return positionString;
    } ).length === 4;
    if ( this.validateShape ) {
      assert && assert( allVerticesInBounds, 'A vertex is not contained by modelBounds!' );
      assert && assert( vertexPositionsUnique, 'There are two vertices that overlap! That would create lines of zero length and break this algorithm' );
    }

    if ( !allVerticesInBounds || !vertexPositionsUnique ) {

      // The shape creation algorithm requires that all vertices are in bounds - we may need to handle this gracefully
      // so just return an empty shape in this case
      return new Shape();
    }

    // Lines around the bounds to detect intersections - remember that for Bounds2 top and bottom
    // will be flipped relative to the model because Bounds2 matches scenery +y direction convention.
    const leftLine = new Line( modelBounds.leftTop, modelBounds.leftBottom );
    const topLine = new Line( modelBounds.leftBottom, modelBounds.rightBottom );
    const rightLine = new Line( modelBounds.rightBottom, modelBounds.rightTop );
    const bottomLine = new Line( modelBounds.rightTop, modelBounds.leftTop );

    // the lines collected here in clockwise order, segments have start/end points in clockwise order as well.
    // This way we can use them to update accordingly
    const directedLines: Line[] = [ leftLine, topLine, rightLine, bottomLine ];

    let firstRayDirection: null | Vector2 = null;
    let firstRay: null | Ray2 = null;

    let secondRayDirection: null | Vector2 = null;
    let secondRay: null | Ray2 = null;

    if ( vertexC.angleProperty.value! > Math.PI ) {

      // angle is greater than Math.PI so we have a concave shape and need to use a more constrained shape to
      // prevent crossed quadrilaterals
      firstRayDirection = vertexC.positionProperty.value.minus( vertexB.positionProperty.value ).normalized();
      firstRay = new Ray2( vertexB.positionProperty.value, firstRayDirection );

      secondRayDirection = vertexC.positionProperty.value.minus( vertexD.positionProperty.value ).normalized();
      secondRay = new Ray2( vertexD.positionProperty.value, secondRayDirection );
    }
    else {

      // with an angle less than Math.PI we can walk along rays that form a bisection between vertexB and vertexD
      firstRayDirection = vertexD.positionProperty.value.minus( vertexB.positionProperty.value ).normalized();
      firstRay = new Ray2( vertexD.positionProperty.value, firstRayDirection );

      secondRayDirection = vertexB.positionProperty.value.minus( vertexD.positionProperty.value ).normalized();
      secondRay = new Ray2( vertexB.positionProperty.value, secondRayDirection );
    }

    let firstRayIntersectionLinePair: null | LineIntersectionPair = null;
    let secondRayIntersectionLinePair: null | LineIntersectionPair = null;

    directedLines.forEach( line => {
      const firstLineIntersections = line.intersection( firstRay! );
      const secondLineIntersections = line.intersection( secondRay! );

      if ( firstLineIntersections.length > 0 ) {
        firstRayIntersectionLinePair = {
          line: line,
          intersectionPoint: firstLineIntersections[ 0 ].point
        };
      }
      else {

        // There wasn't an intersection, the ray intersected exactly with a corner of the bounds, which is not
        // a defined intersection according to Kite.
        const intersectionPoint = QuadrilateralShapeModel.getLinePositionAlongRay( firstRay!, line );
        if ( intersectionPoint ) {
          firstRayIntersectionLinePair = {
            line: line,
            intersectionPoint: intersectionPoint
          };
        }
      }

      if ( secondLineIntersections.length > 0 ) {
        secondRayIntersectionLinePair = {
          line: line,
          intersectionPoint: secondLineIntersections[ 0 ].point
        };
      }
      else {

        // There wasn't an intersection, the ray intersected exactly with a corner of the bounds, which is not
        // a defined intersection according to Kite.
        const intersectionPoint = QuadrilateralShapeModel.getLinePositionAlongRay( secondRay!, line );
        if ( intersectionPoint ) {
          secondRayIntersectionLinePair = {
            line: line,
            intersectionPoint: intersectionPoint
          };
        }
      }
    } );
    assert && assert( firstRayIntersectionLinePair && secondRayIntersectionLinePair, 'ray intersections were not found' );

    // An array of points that will create the final shape
    let points = [];

    if ( vertexC.angleProperty.value! > Math.PI ) {

      // angle is greater than Math.PI so we have a concave shape and need to use a more constrained shape to
      // prevent crossed quadrilaterals
      points.push( vertexC.positionProperty.value ); // start at the opposite vertex

      // The rays between vertexB and vertexC and vertexD and vertexC define the shape that will prevent twisted
      // quadrilaterals, so after starting at vertexC we just walk clockwise along the boundary points
      const intersectionAndBoundaryPoints = QuadrilateralShapeModel.getPointsAlongBoundary( directedLines, firstRayIntersectionLinePair!, secondRayIntersectionLinePair! );
      points = points.concat( intersectionAndBoundaryPoints );
    }
    else {

      // We have a convex shape so we can allow a larger area of movement without creating a twisted shape. This shape
      // will walk between all other vertices and then close by walking clockwise around the bounds
      points.push( vertexC.positionProperty.value ); // start at the opposite vertex
      points.push( vertexD.positionProperty.value ); // walk to the next vertex

      const intersectionAndBoundaryPoints = QuadrilateralShapeModel.getPointsAlongBoundary( directedLines, firstRayIntersectionLinePair!, secondRayIntersectionLinePair! );
      points = points.concat( intersectionAndBoundaryPoints );

      points.push( vertexB.positionProperty.value ); // walk back to vertexB
    }

    const shape = new Shape();
    shape.moveToPoint( points[ 0 ] );

    for ( let i = 1; i < points.length; i++ ) {
      shape.lineToPoint( points[ i ] );
    }

    // closing the shape after the last intersection should bring us back to vertexC
    shape.close();

    return shape;
  }

  /**
   * Returns true if a point is on the line. Uses the top voted answer at
   * https://stackoverflow.com/questions/17692922/check-is-a-point-x-y-is-between-two-points-drawn-on-a-straight-line
   * to determine this in a simple way. If the length of the line is equal to the distance between line start and
   * point plus line end and point, the point must be on the line.
   */
  private static isPointOnLine( line: Line, point: Vector2 ): boolean {
    const length = line.start.distance( line.end );
    const lengthA = line.start.distance( point );
    const lengthB = line.end.distance( point );

    // TODO: This check is susceptible to precision errors but this seems fragile, is there another way to do this?
    return Utils.equalsEpsilon( length, lengthA + lengthB, 0.001 );
  }

  /**
   * Returns one of the corner points of the Bounds2 if the provided ray goes exactly through that point. Works
   * around a limitation of Shape.intersects( Ray2 ) where if the ray intersects with a start/end point of a shape
   * segment, the intersection is not defined.
   */
  public static getBoundsCornerPositionAlongRay( ray: Ray2, bounds: Bounds2 ): Vector2 | null {
    return QuadrilateralShapeModel.isPointOnRay( ray, bounds.leftTop ) ? bounds.leftTop :
           QuadrilateralShapeModel.isPointOnRay( ray, bounds.rightTop ) ? bounds.rightTop :
           QuadrilateralShapeModel.isPointOnRay( ray, bounds.rightBottom ) ? bounds.rightBottom :
           QuadrilateralShapeModel.isPointOnRay( ray, bounds.leftBottom ) ? bounds.leftBottom :
           null;
  }

  /**
   * Returns the start or end point of a Line if the ray goes through it. Assists with intersection detection since
   * Kite functions do not have a defined intersection if a ray goes through an endpoint of a line or segment.
   */
  public static getLinePositionAlongRay( ray: Ray2, line: Line ): Vector2 | null {
    return QuadrilateralShapeModel.isPointOnRay( ray, line.start ) ? line.start :
           QuadrilateralShapeModel.isPointOnRay( ray, line.end ) ? line.end :
           null;
  }

  /**
   * Returns true if the provided point lies on the ray.
   */
  private static isPointOnRay( ray: Ray2, point: Vector2 ): boolean {
    const directionToPoint = point.minus( ray.position ).normalized();
    return ray.direction.equalsEpsilon( directionToPoint, 1e-2 );
  }

  /**
   * Returns the tolerance interval to use for a value. Generally, the default value will be returned. If the user
   * has opted into "fine spacing" then the tolerance is multiplied by a scale factor configurable with query
   * parameters. Similar case for when the sim is connected to a device.
   */
  public static getWidenedToleranceInterval( defaultValue: number, useFineSpacing: boolean ): number {
    let interval = defaultValue;

    // Note that both cases are possible and the scale factors compound!
    if ( useFineSpacing ) {
      interval = interval * QuadrilateralQueryParameters.reducedStepSizeToleranceIntervalScaleFactor;
    }
    if ( QuadrilateralQueryParameters.deviceConnection ) {
      interval = interval * QuadrilateralQueryParameters.connectedToleranceIntervalScaleFactor;
    }

    return interval;
  }

  /**
   * To create a bounding shape for a Vertex, walk along the boundary defined by directedLines until we traverse
   * between two points along the boundary. The directed lines are ordered and directed in a clockwise motion around
   * the entire model to assist in the traversal between intersection points. Graphically, what we are accomplishing
   * is this:
   *                        - firstLineIntersectionPair.intersection.point
   *   -------------------A--B
   *  |                      |
   *  |                      |
   *  |                      |
   *  |                      |
   *  |                      |
   *  ----D------------------C
   *       - secondLineIntersectionPair.intersection.point
   *
   * This function will return an array of points [A, B, C, D] to create a shape between the intersections on the lines.
   */
  private static getPointsAlongBoundary( directedLines: Line[], firstLineIntersectionPair: LineIntersectionPair, secondLineIntersectionPair: LineIntersectionPair ): Vector2[] {
    const points = [];

    // walk to the first ray intersection with the bounds
    points.push( firstLineIntersectionPair.intersectionPoint );

    // a safety net to make sure that we don't get stuck in this while loop
    let iterations = 0;

    // walk along the bounds, adding corner points until we reach the same line as the secondLineIntersectionPair
    let nextLine = firstLineIntersectionPair.line;
    while ( nextLine !== secondLineIntersectionPair.line ) {
      points.push( nextLine.end );

      let nextIndex = directedLines.indexOf( nextLine ) + 1;
      nextIndex = nextIndex > ( directedLines.length - 1 ) ? 0 : nextIndex;

      nextLine = directedLines[ nextIndex ];
      assert && assert( nextLine );

      iterations++;
      assert && assert( iterations < 10, 'we should have closed the shape by now! Likely infinite loop' );
    }

    // we have walked to the same line as the second intersection point, finalize by including the second
    // intersection point
    points.push( secondLineIntersectionPair.intersectionPoint );

    return points;
  }

  /**
   * Returns true if the current quadrilateral shape is allowed based on the rules of this model.
   * No vertex can overlap another.
   * All vertices must be within their drag areas.
   * All vertices must be within model bounds.
   * (TODO) No vertex can overlap another side.
   */
  public isQuadrilateralShapeAllowed(): boolean {
    let shapeAllowed = true;

    for ( let i = 0; i < this.vertices.length; i++ ) {
      const testVertex = this.vertices[ i ];

      // The vertex must be completely within model bounds
      shapeAllowed = this.model.modelBounds.containsBounds( testVertex.modelBoundsProperty.value );

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
        shapeAllowed = this.customShapeContainsPoint( testVertex.dragAreaProperty.value!, testVertex.positionProperty.value );
      }

      // Shape is not allowed, no need to keep testing
      if ( !shapeAllowed ) {
        break;
      }
    }

    return shapeAllowed;
  }

  /**
   * A workaround for https://github.com/phetsims/kite/issues/94. Shape.containsPoint implementation does not work
   * if both the provided point and one of the shape segment vertices lie along the test ray used in the
   * winding intersection algorithm. This function looks for a different ray to use in the test if that is the case.
   *
   * This solution has been proposed in https://github.com/phetsims/kite/issues/94. If it is absorbed or fixed a
   * different way in kite this function could be removed and replaced with shape.containsPoint.
   */
  private customShapeContainsPoint( shape: Shape, point: Vector2 ): boolean {
    const rayDirectionVector = new Vector2( 1, 0 ); // unit x Vector, but we may mutate it
    let ray = new Ray2( point, rayDirectionVector );

    // Put a limit on attempts so we don't try forever
    let count = 0;
    while ( count < 5 ) {
      count++;

      // Look for cases where the proposed ray will intersect with one of the vertices of a shape segment - in this case
      // the intersection in windingIntersection is not well-defined and won't be counted so we need a different to
      // use a ray with a different direction
      const rayIntersectsSegmentVertex = _.some( shape.subpaths, subpath => {
        return _.some( subpath.segments, segment => {
          return segment.start.minus( point ).normalize().equals( rayDirectionVector );
        } );
      } );

      if ( rayIntersectsSegmentVertex ) {

        // the proposed ray will not work because it intersects with a segment Vertex - try another one
        rayDirectionVector.rotate( dotRandom.nextDouble() );
      }
      else {

        // Should be safe to use this Ray for windingIntersection
        ray = new Ray2( point, rayDirectionVector );
        break;
      }
    }

    return shape.windingIntersection( ray ) !== 0;
  }

  /**
   * Returns whether or not the quadrilateral shape is a parallelogram, within the tolerance defined by
   * parallelAngleToleranceIntervalProperty. This function uses parallelSidePairsProperty and requires that Property
   * value to be up to date.
   */
  public getIsParallelogram(): boolean {

    // We should have a quadrilateral if the shape has two pairs of parallel sides.
    return this.parallelSidePairsProperty.value.length === 2;
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
    return this.isShapeLengthEqualToOther( this.topSide.lengthProperty.value, this.rightSide.lengthProperty.value ) &&
           this.isShapeLengthEqualToOther( this.rightSide.lengthProperty.value, this.bottomSide.lengthProperty.value ) &&
           this.isShapeLengthEqualToOther( this.bottomSide.lengthProperty.value, this.leftSide.lengthProperty.value ) &&
           this.isShapeLengthEqualToOther( this.leftSide.lengthProperty.value, this.topSide.lengthProperty.value );
  }

  /**
   * Returns the area of the quadrilateral. Uses Bretschneider's formula for the area of a general quadrilateral,
   * see https://en.wikipedia.org/wiki/Bretschneider%27s_formula.
   *
   * Dependent on side lengths and angles, make sure those are up to date before calling this function in
   * updateOrderDependentProperties.
   */
  private getArea(): number {
    const a = this.topSide.lengthProperty.value;
    const b = this.rightSide.lengthProperty.value;
    const c = this.bottomSide.lengthProperty.value;
    const d = this.leftSide.lengthProperty.value;

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
   * Returns true if two angles are close enough together that they should be considered equal. This uses the
   * shapeAngleToleranceProperty, the most strict interval available. The angleToleranceInterval can be very dynamic
   * during various interactions to support sim learning goals. But when detecting shapes we need to be more static so
   * that when the tolerance is very high the shape isn't incorrectly described.
   *
   * TODO: Replace with isInterAngleEqualToOther throughout.
   */
  public isShapeAngleEqualToOther( angle1: number, angle2: number ): boolean {
    return Utils.equalsEpsilon( angle1, angle2, this.interAngleToleranceIntervalProperty.value );
  }

  public static isInterAngleEqualToOther( angle1: number, angle2: number, interAngleToleranceInterval: number ): boolean {
    return Utils.equalsEpsilon( angle1, angle2, interAngleToleranceInterval );
  }

  public isInterAngleEqualToOther( angle1: number, angle2: number ): boolean {
    return Utils.equalsEpsilon( angle1, angle2, this.interAngleToleranceIntervalProperty.value );
  }

  /**
   * Returns true if two sides are close enough in length that they should be considered equal. Uses the
   * shapeLengthAngleToleranceInterval.
   *
   * TODO: Rename to isInterLengthEqualToOTher to match interAngleToleranceInterval.
   */
  public isShapeLengthEqualToOther( length1: number, length2: number ): boolean {
    return Utils.equalsEpsilon( length1, length2, this.interLengthToleranceIntervalProperty.value );
  }

  /**
   * Returns true if the lengths are equal to eachother within interLengthToleranceInterval.
   */
  public static isInterLengthEqualToOther( length1: number, length2: number, interLengthToleranceInterval: number ): boolean {
    return Utils.equalsEpsilon( length1, length2, interLengthToleranceInterval );
  }

  public isRightAngle( angle: number ): boolean {
    return Utils.equalsEpsilon( angle, Math.PI / 2, this.staticAngleToleranceIntervalProperty.value );
  }

  /**
   * Returns true if the angle is equal to PI within staticAngleToleranceInterval.
   */
  public isFlatAngle( angle: number ): boolean {
    return Utils.equalsEpsilon( angle, Math.PI, this.staticAngleToleranceIntervalProperty.value );
  }

  /**
   * Returns true when the angle is convex (greater than 180 degrees).
   */
  public isConvexAngle( angle: number ): boolean {
    return angle > Math.PI;
  }

  /**
   * Returns true if two angles are equal within staticAngleToleranceIntervalProperty. See that value for more
   * information.
   */
  public isStaticAngleEqualToOther( angle: number, otherAngle: number ): boolean {
    return Utils.equalsEpsilon( angle, otherAngle, this.staticAngleToleranceIntervalProperty.value );
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

    // Update pairs of parallel sides before updating whether or not we have a parallelogram, update before
    // calling getIsParallelogram.
    this.updateParallelSidePairs();

    // update pairs of vertices and sides
    this.updateVertexAngleComparisons();
    this.updateSideLengthComparisons();

    this.isParallelogramProperty.set( this.getIsParallelogram() );
    this.sideABSideCDParallelProperty.value = this.sideABSideCDParallelSideChecker.areSidesParallel();
    this.sideBCSideDAParallelProperty.value = this.sideBCSideDAParallelSideChecker.areSidesParallel();

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
    this.updateEqualVertexPairs( this.adjacentEqualVertexPairsProperty, this.adjacentVertices );
    this.updateEqualVertexPairs( this.oppositeEqualVertexPairsProperty, this.oppositeVertices );
  }

  /**
   * Update a particular Property watching for equal vertex angles.
   */
  private updateEqualVertexPairs( equalVertexPairsProperty: Property<VertexPair[]>, allVertexPairs: VertexPair[] ): void {
    const currentVertexPairs = equalVertexPairsProperty.value;
    for ( let i = 0; i < allVertexPairs.length; i++ ) {
      const vertexPair = allVertexPairs[ i ];

      const firstAngle = vertexPair.vertex1.angleProperty.value!;
      const secondAngle = vertexPair.vertex2.angleProperty.value!;
      const currentlyIncludesVertexPair = currentVertexPairs.includes( vertexPair );
      const areAnglesEqual = this.isShapeAngleEqualToOther( firstAngle, secondAngle );

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
    }
  }

  /**
   * Update Properties managing side length comparisons. Add or remove SidePairs from adjacentEqualSidePairsProperty
   * and oppositeEqualSidePairsProperty depending on length equalities.
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
      const areLengthsEqual = this.isShapeLengthEqualToOther( firstLength, secondLength );

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
   * Update the Property monitoring if opposite sides are parallel with eachother.
   */
  private updateParallelSidePairs(): void {
    const currentParallelSides = this.parallelSidePairsProperty.value;

    // only opposite sides can be parallel
    for ( let i = 0; i < this.parallelSideCheckers.length; i++ ) {
      const checker = this.parallelSideCheckers[ i ];
      const oppositeSidePair = checker.sidePair;

      const areSidesParallel = checker.areSidesParallel();
      const hasSidePair = currentParallelSides.includes( oppositeSidePair );

      if ( hasSidePair && !areSidesParallel ) {

        // the VertexPair needs to be removed because angles are no longer equal
        currentParallelSides.splice( currentParallelSides.indexOf( oppositeSidePair ), 1 );
        this.parallelSidePairsProperty.notifyListenersStatic();
      }
      else if ( !hasSidePair && areSidesParallel ) {

        // the VertexPair needs to be removed because angles are no longer equal
        currentParallelSides.push( oppositeSidePair );
        this.parallelSidePairsProperty.notifyListenersStatic();
      }
    }
  }

  /**
   * Sets this model to be the same as the provided QuadrilateralShapeModel by setting Vertex positions.
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
   * Set the positions of vertices directly from a tangible device. A connection to a physical device might use this
   * function to set the positions in model space. If it doesn't have absolute positioning it may need to use
   * setPositionsFromLengthAndAngleData instead.
   *
   * Currently this is being used by the OpenCV prototype and a prototype using MediaPipe.
   */
  public setPositionsFromAbsolutePositionData( proposedPositions: VertexWithProposedPosition[] ): void {
    const tangibleConnectionModel = this.model.tangibleConnectionModel;

    // you must calibrate before setting positions from a physical device
    if ( tangibleConnectionModel.physicalToVirtualTransform !== null && !tangibleConnectionModel.isCalibratingProperty.value ) {

      // scale the physical positions to the simulation virtual model
      const scaledProposedPositions: VertexWithProposedPosition[] = proposedPositions.map( vertexWithProposedPosition => {
        const proposedPosition = vertexWithProposedPosition.proposedPosition;

        let constrainedPosition: Vector2;

        // only try to set a new position if values look reasonable - we want to handle this gracefully, the sim
        // shouldn't crash if data isn't right
        if ( proposedPosition && proposedPosition.isFinite() ) {

          // transform from tangible to virtual coordinates
          const virtualPosition = tangibleConnectionModel.physicalToVirtualTransform.modelToViewPosition( proposedPosition );

          // apply smoothing over a number of values to reduce noise
          constrainedPosition = vertexWithProposedPosition.vertex.smoothPosition( virtualPosition );

          // constrain within model bounds
          constrainedPosition = this.model.modelBounds.closestPointTo( constrainedPosition );
        }
        else {

          // If the value is not reasonable, just fall back to the current position
          constrainedPosition = vertexWithProposedPosition.vertex.positionProperty.value;
        }

        // align with model grid positions
        constrainedPosition = this.model.getClosestGridPosition( constrainedPosition! );

        return {
          vertex: vertexWithProposedPosition.vertex,
          proposedPosition: constrainedPosition
        };
      } );

      // Only set to the model if the shape is allowed and reasonable (no overlaps, no intersections)
      if ( this.isShapeAllowedForTangible( scaledProposedPositions ) ) {
        this.setVertexPositions( scaledProposedPositions );
      }
    }
  }

  /**
   * Apply a series of checks on VertexWithProposedPositions to make sure that the requested shape does not cross
   * and does not have overlap.
   */
  private isShapeAllowedForTangible( vertexWithProposedPositions: VertexWithProposedPosition[] ): boolean {
    let allowed = true;

    let vertexAPosition: Vector2;
    let vertexBPosition: Vector2;
    let vertexCPosition: Vector2;
    let vertexDPosition: Vector2;

    vertexWithProposedPositions.forEach( vertexWithProposedPosition => {
      if ( vertexWithProposedPosition.vertex === this.vertexA ) {
        vertexAPosition = vertexWithProposedPosition.proposedPosition!;
      }
      if ( vertexWithProposedPosition.vertex === this.vertexB ) {
        vertexBPosition = vertexWithProposedPosition.proposedPosition!;
      }
      if ( vertexWithProposedPosition.vertex === this.vertexC ) {
        vertexCPosition = vertexWithProposedPosition.proposedPosition!;
      }
      if ( vertexWithProposedPosition.vertex === this.vertexD ) {
        vertexDPosition = vertexWithProposedPosition.proposedPosition!;
      }
    } );

    // all positions defined
    allowed = !!vertexAPosition! && !!vertexBPosition! && !!vertexCPosition! && !!vertexDPosition!;

    const lineAB = new Line( vertexAPosition!, vertexBPosition! );
    const lineBC = new Line( vertexBPosition!, vertexCPosition! );
    const lineCD = new Line( vertexCPosition!, vertexDPosition! );
    const lineDA = new Line( vertexDPosition!, vertexAPosition! );
    const proposedLines = [ lineAB, lineBC, lineCD, lineDA ];

    // No vertices overlap (0 length)
    if ( allowed ) {
      allowed = _.every( proposedLines, proposedLine => proposedLine.getArcLength() > 0 );
    }

    // No lines intersect
    if ( allowed ) {
      for ( let i = 0; i < proposedLines.length; i++ ) {
        const firstLine = proposedLines[ i ];
        for ( let j = 0; j < proposedLines.length; j++ ) {
          const secondLine = proposedLines[ j ];
          if ( firstLine !== secondLine ) {
            if ( Line.intersectOther( firstLine, secondLine ).length > 0 ) {
              allowed = false;
              break;
            }
          }
        }

        if ( !allowed ) {
          break;
        }
      }
    }

    return allowed;
  }

  /**
   * Set positions of the Vertices from length and angle data. We get the angles at each vertex and lengths
   * of each side from the hardware. We need to convert that to vertex positions in model space.
   *
   * With angle and length data alone we do not know the orientation or position in space of the shape. So the
   * shape is constructed with the top left vertex (vertexA) and top side (topSide) anchored  while the rest
   * of the vertices are relatively positioned from the angle and length data. Once the shape is constructed it is
   * translated so that the centroid of the shape is in the center of model space (0, 0). The final result is that only
   * the tilt of the top side remains anchored. Perhaps if a gyroscope is added in the future we may be able to rotate
   * the shape correctly without anchoring the top side.
   */
  public setPositionsFromLengthAndAngleData( topLength: number, rightLength: number, bottomLength: number, leftLength: number, p1Angle: number, p2Angle: number, p3Angle: number, p4Angle: number ): void {

    // only try to set to sim if values look reasonable - we want to handle this gracefully, the sim shouldn't crash
    // if data isn't right
    const allDataGood = _.every( [
      topLength, rightLength, bottomLength, leftLength, p1Angle, p2Angle, p3Angle, p4Angle
    ], value => {
      return !isNaN( value ) && value >= 0 && value !== null;
    } );
    if ( !allDataGood ) {
      return;
    }

    // this function cannot be called until the bounds of movement for each vertex has been established
    assert && assert( this.vertexA.dragBoundsProperty.value );
    assert && assert( this.vertexB.dragBoundsProperty.value );
    assert && assert( this.vertexC.dragBoundsProperty.value );
    assert && assert( this.vertexD.dragBoundsProperty.value );

    const tangibleConnectionModel = this.model.tangibleConnectionModel;

    // you must calibrate before setting positions from a physical device
    if ( tangibleConnectionModel.physicalModelBoundsProperty.value !== null && !tangibleConnectionModel.isCalibratingProperty.value ) {

      // the physical device lengths can only become half as long as the largest length, so map to the sim model
      // with that constraint as well so that the smallest shape on the physical device doesn't bring vertices
      // all the way to the center of the screen (0, 0).
      const deviceLengthToSimLength = new LinearFunction( 0, tangibleConnectionModel.physicalModelBoundsProperty.value.width, 0, this.model.modelBounds.width / 3 );

      const mappedTopLength = deviceLengthToSimLength.evaluate( topLength );
      const mappedRightLength = deviceLengthToSimLength.evaluate( rightLength );
      const mappedLeftLength = deviceLengthToSimLength.evaluate( leftLength );

      this.setPositionsFromLengthsAndAngles( mappedTopLength, mappedRightLength, mappedLeftLength, p1Angle, p2Angle );
    }
  }

  /**
   * Set positions from the length and angle data provided. Useful when working with a tangible device that is
   * providing length and angle data. When reconstructing the shape we start by making the top side parallel
   * with the top of model bounds. The remaining vertices are positioned acordingly. Finally, if there is some
   * rotation to apply (from the experimental marker input), that rotation is applied.
   *
   * @param topLength
   * @param rightLength
   * @param leftLength
   * @param p1Angle - the left top angle (vertexA)
   * @param p2Angle - the right top angle (vertexB)
   */
  public setPositionsFromLengthsAndAngles( topLength: number, rightLength: number, leftLength: number, p1Angle: number, p2Angle: number ): void {
    const modelBounds = this.model.modelBounds;

    // vertexA and the topLine are anchored, the rest of the shape is relative to this
    const vector1Position = new Vector2( modelBounds.minX, modelBounds.maxX );
    const vector2Position = new Vector2( vector1Position.x + topLength, vector1Position.y );

    const vector4Offset = new Vector2( Math.cos( -p1Angle ), Math.sin( -p1Angle ) ).timesScalar( leftLength );
    const vector4Position = vector1Position.plus( vector4Offset );

    const vector3Offset = new Vector2( Math.cos( Math.PI + p2Angle ), Math.sin( Math.PI + p2Angle ) ).timesScalar( rightLength );
    const vector3Position = vector2Position.plus( vector3Offset );

    // make sure that the proposed positions are within bounds defined in the simulation model
    const proposedPositions = [ vector1Position, vector2Position, vector3Position, vector4Position ];

    // we have the vertex positions to recreate the shape, but shift them so that the centroid of the quadrilateral is
    // in the center of the model space
    const centroidPosition = this.getCentroidFromPositions( proposedPositions );
    const centroidOffset = centroidPosition.negated();
    const shiftedPositions = _.map( proposedPositions, shapePosition => shapePosition.plus( centroidOffset ) );

    // If there is some marker input, rotate positions to match the marker. Negate the rotation value to mirror the
    // rotation of the device.
    const rotationProperty = this.model.tangibleConnectionModel.markerDetectionModel.tangibleRotationProperty;
    const rotatedPositions = _.map( shiftedPositions, shiftedPosition => shiftedPosition.rotated( -rotationProperty.value ) );

    // make sure that all positions are within model bounds
    const constrainedPositions = _.map( rotatedPositions, position => this.model.modelBounds.closestPointTo( position ) );

    // smooth positions to try to reduce noise
    // TODO: Should this go before or after constraining to the grid?
    const smoothedPositions = [
      this.vertexA.smoothPosition( constrainedPositions[ 0 ]! ),
      this.vertexB.smoothPosition( constrainedPositions[ 1 ]! ),
      this.vertexC.smoothPosition( constrainedPositions[ 2 ]! ),
      this.vertexD.smoothPosition( constrainedPositions[ 3 ]! )
    ];

    // Constrain to intervals of deviceGridSpacingProperty.value to try to reduce noise
    const constrainedGridPositions = _.map( smoothedPositions, smoothedPosition => this.model.getClosestGridPosition( smoothedPosition ) );

    const verticesWithProposedPositions = [
      { vertex: this.vertexA, proposedPosition: constrainedGridPositions[ 0 ]! },
      { vertex: this.vertexB, proposedPosition: constrainedGridPositions[ 1 ]! },
      { vertex: this.vertexC, proposedPosition: constrainedGridPositions[ 2 ]! },
      { vertex: this.vertexD, proposedPosition: constrainedGridPositions[ 3 ]! }
    ];

    this.setVertexPositions( verticesWithProposedPositions );
  }

  /**
   * Returns the centroid of a Quadrilateral from an array of potential shape positions.
   */
  private getCentroidFromPositions( positions: Vector2[] ): Vector2 {
    const centerX = _.sumBy( positions, position => position.x ) / positions.length;
    const centerY = _.sumBy( positions, position => position.y ) / positions.length;

    return new Vector2( centerX, centerY );
  }

  /**
   * Update the drag areas for all vertices.
   */
  private setVertexDragAreas(): void {

    // TODO: What is this dilation and value??
    const dilatedBounds = this.model.modelBounds.dilated( 1 );

    this.vertexA.dragAreaProperty.set( this.createVertexArea( dilatedBounds, this.vertexA, this.vertexB, this.vertexC, this.vertexD ) );
    this.vertexB.dragAreaProperty.set( this.createVertexArea( dilatedBounds, this.vertexB, this.vertexC, this.vertexD, this.vertexA ) );
    this.vertexC.dragAreaProperty.set( this.createVertexArea( dilatedBounds, this.vertexC, this.vertexD, this.vertexA, this.vertexB ) );
    this.vertexD.dragAreaProperty.set( this.createVertexArea( dilatedBounds, this.vertexD, this.vertexA, this.vertexB, this.vertexC ) );
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
   * Returns the distance in model space between two vertices.
   */
  public static getDistanceBetweenVertices( vertex1: Vertex, vertex2: Vertex ): number {
    return vertex1.positionProperty.value.distance( vertex2.positionProperty.value );
  }

  /**
   * Returns the average length between two sides. Useful when determining how parallel or adjacent
   * pairs of side lengths change over time.
   */
  public static getAverageSideLength( side1: Side, side2: Side ): number {
    return ( side1.lengthProperty.value + side2.lengthProperty.value ) / 2;
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
    this.model.resetNotInProgressProperty.value = false;
    this.reset();
    this.model.resetNotInProgressProperty.value = true;
  }
}

quadrilateral.register( 'QuadrilateralShapeModel', QuadrilateralShapeModel );
export default QuadrilateralShapeModel;

// Copyright 2021-2022, University of Colorado Boulder

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
import Range from '../../../../dot/js/Range.js';
import Vertex from './Vertex.js';
import Utils from '../../../../dot/js/Utils.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Line from '../../../../kite/js/segments/Line.js';
import QuadrilateralModel from './QuadrilateralModel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Ray2 from '../../../../dot/js/Ray2.js';
import Shape from '../../../../kite/js/Shape.js';
import SideLengths from './SideLengths.js';
import VertexLabel from './VertexLabel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
// Bounds used for calculations, but a single instance to reduce garbage.
const SCRATCH_BOUNDS = new Bounds2( 0, 0, 0, 0 );

// A useful type for calculations for the vertex Shapes which define where the Vertex can move depending on
// the positions of the other vertices. Lines are along the bounds of model space and RayIntersections
// are the intersections between rays formed by adjacent vertices and the Line. See createVertexAreas for
// more information.
type LineIntersectionPair = {
  line: Line;
  intersectionPoint: Vector2
}

type QuadrilateralShapeModelOptions = {
  validateShape?: boolean,
  tandem?: Tandem
};

class QuadrilateralShapeModel {
  public vertexA: Vertex;
  public vertexB: Vertex;
  public vertexC: Vertex;
  public vertexD: Vertex;

  public topSide: Side;
  public rightSide: Side;
  public bottomSide: Side;
  public leftSide: Side;

  public readonly vertices: Vertex[];
  public readonly sides: Side[];

  private readonly validateShape: boolean;

  public readonly lengthsEqualToSavedProperty: BooleanProperty;

  public readonly model: QuadrilateralModel;

  public angleToleranceIntervalProperty: DerivedProperty<number, boolean[]>;
  public tiltToleranceIntervalProperty: Property<number>;
  public shapeAngleToleranceIntervalProperty: Property<number>;

  public shapeChangedEmitter: Emitter<[]>;

  public isParallelogramProperty: Property<boolean>;

  public readonly shapeNameProperty: Property<NamedQuadrilateral | null>;

  public savedSideLengths: SideLengths;

  constructor( model: QuadrilateralModel, providedOptions?: QuadrilateralShapeModelOptions ) {

    const options = optionize<QuadrilateralShapeModelOptions, QuadrilateralShapeModelOptions>( {

      // If true, validation will be done to ensure that the quadrilateral shape is reasonable. But this may be
      // undesireable if you want to use this QuadrilateralShapeModel to determine if the proposed shape is
      // reasonable.
      validateShape: true,

      // phet-io
      tandem: Tandem.REQUIRED
    }, providedOptions );

    this.validateShape = options.validateShape;

    // vertices of the quadrilateral
    this.vertexA = new Vertex( new Vector2( -0.25, 0.25 ), VertexLabel.VERTEX_A, options.tandem.createTandem( 'vertexA' ) );
    this.vertexB = new Vertex( new Vector2( 0.25, 0.25 ), VertexLabel.VERTEX_B, options.tandem.createTandem( 'vertexB' ) );
    this.vertexC = new Vertex( new Vector2( 0.25, -0.25 ), VertexLabel.VERTEX_C, options.tandem.createTandem( 'vertexC' ) );
    this.vertexD = new Vertex( new Vector2( -0.25, -0.25 ), VertexLabel.VERTEX_D, options.tandem.createTandem( 'vertexD' ) );

    // Collection of the vertices which should be easy to iterate over
    this.vertices = [ this.vertexA, this.vertexB, this.vertexC, this.vertexD ];

    // create the sides of the quadrilateral
    this.topSide = new Side( this.vertexA, this.vertexB, options.tandem.createTandem( 'topSide' ), {
      offsetVectorForTiltCalculation: new Vector2( 0, 1 )
    } );
    this.rightSide = new Side( this.vertexB, this.vertexC, options.tandem.createTandem( 'rightSide' ) );
    this.bottomSide = new Side( this.vertexC, this.vertexD, options.tandem.createTandem( 'bottomSide' ), {
      offsetVectorForTiltCalculation: new Vector2( 0, -1 )
    } );
    this.leftSide = new Side( this.vertexD, this.vertexA, options.tandem.createTandem( 'leftSide' ), {
      offsetVectorForTiltCalculation: new Vector2( -1, 0 )
    } );

    // Collection of the Sides of the quadrilateral for easy iteration
    this.sides = [ this.topSide, this.rightSide, this.bottomSide, this.leftSide ];

    // Connect the sides, creating the shape and giving xvertices the information they need to determine their angles.
    this.rightSide.connectToSide( this.topSide );
    this.bottomSide.connectToSide( this.rightSide );
    this.leftSide.connectToSide( this.bottomSide );
    this.topSide.connectToSide( this.leftSide );

    // A value that controls the threshold for equality when determining if the quadrilateral forms a parallelogram.
    // Without a margin of error it would be exceedingly difficult to create a parallelogram shape. The value changes
    // depending on input. Any tolerance interval means isParallelogramProperty will be true when we are not exactly
    // a parallelogram. This means that angles will NOT remain constant will dragging sides or more than one
    // vertex at a time because the properties of a parallelogram will not be present, even though we are telling
    // the user that they are "in parallelogram". As such, we make it more or less difficult to remain in parallelogram
    // depending on the input.
    //
    // If a side is being dragged while in parallelogram, it should be impossible to go "out" of parallelogram.
    // If dragging two or more sides, the tolerance is larger because it should be easier to find and stay in
    // parallelogram with this mode of input.
    // If dragging a single vertex, the tolerance is as small as possible because with this mode of input has the
    // finest control.
    this.angleToleranceIntervalProperty = new DerivedProperty(
      [
        this.vertexA.isPressedProperty, this.vertexB.isPressedProperty, this.vertexC.isPressedProperty, this.vertexD.isPressedProperty,
        this.topSide.isPressedProperty, this.rightSide.isPressedProperty, this.bottomSide.isPressedProperty, this.leftSide.isPressedProperty
      ],
      (
        vertexAPressed, vertexBPressed, vertexCPressed, vertexDPressed,
        topSidePressed, rightSidePressed, bottomSidePressed, leftSidePressed
      ) => {
        const verticesPressedArray = [ vertexAPressed, vertexBPressed, vertexCPressed, vertexDPressed ];
        const sidesPressedArray = [ topSidePressed, rightSidePressed, bottomSidePressed, leftSidePressed ];

        const numberOfVerticesPressed = _.countBy( verticesPressedArray ).true;
        const anySidesPressed = _.some( sidesPressedArray );

        let toleranceInterval;

        if ( QuadrilateralQueryParameters.deviceConnection ) {

          // The simulation is connected to device hardware, so we use a larger tolerance interval because control
          // with the hardware is more erratic and less fine-grained.
          toleranceInterval = QuadrilateralQueryParameters.angleToleranceInterval * QuadrilateralQueryParameters.angleToleranceIntervalScaleFactor;
        }
        else {

          // remaining cases apply to mouse, touch, and keyboard input
          if ( anySidesPressed && this.isParallelogramProperty.value ) {

            // A side has been picked up while the shape is a parallelogram - it should be impossible for the shape
            // to go "out" of parallelogram in this case because none of the angles should be changing.
            toleranceInterval = Number.POSITIVE_INFINITY;
          }
          else if ( anySidesPressed && !this.isParallelogramProperty.value ) {

            // A side as been picked up while the shape is NOT a parallelogram - it should be impossible for the
            // shape to become a parallelogram while it is being dragged.
            toleranceInterval = Number.NEGATIVE_INFINITY;
          }
          else if ( numberOfVerticesPressed >= 2 ) {

            // Two or more vertices pressed at once, increase the tolerance interval by a scale factor so that
            // it is easier to find and remain a parallelogram with this input
            toleranceInterval = QuadrilateralQueryParameters.angleToleranceInterval * QuadrilateralQueryParameters.angleToleranceIntervalScaleFactor;
          }
          else if ( numberOfVerticesPressed === 1 ) {

            // Only one vertex is moving, we can afford to be as precise as possible from this form of input, and
            // so we have the smallest tolerance interval.
            toleranceInterval = QuadrilateralQueryParameters.angleToleranceInterval;
          }
          else {

            // We are dragging a side while out of parallelogram, or we just released all sides and vertices. Do NOT
            // change the angleToleranceInterval because we don't want the quadrilateral to suddenly appear out of
            // parallelogram at the end of the interaction. The ternary handles initialization.
            toleranceInterval = this.angleToleranceIntervalProperty ? this.angleToleranceIntervalProperty.value : QuadrilateralQueryParameters.angleToleranceInterval;
          }
        }

        return toleranceInterval;
      }
    );

    this.shapeAngleToleranceIntervalProperty = new NumberProperty( QuadrilateralQueryParameters.shapeAngleToleranceInterval, {
      tandem: options.tandem.createTandem( 'shapeAngleToleranceIntervalProperty' ),
      range: new Range( 0, 2 * Math.PI )
    } );

    this.tiltToleranceIntervalProperty = new NumberProperty( QuadrilateralQueryParameters.tiltToleranceInterval, {
      tandem: options.tandem.createTandem( 'tiltToleranceIntervalProperty' ),
      range: new Range( 0, 2 * Math.PI )
    } );

    // A collection of the Side lengths at a point in time. Updated whenever an interaction begins with the
    // quadrilateral. Allows us to monitor the change in Side lengths during interaction.
    this.savedSideLengths = this.getSideLengths();

    // Whether the Side lengths have changed relative to the saved side lengths that were stored at the beginning
    // of an interaction. This helps accomplish a learning goal of determining if the quad remains a parallelogram
    // while also keeping side lengths the same. This is set in the step function asynchronously(!!) so that
    // it can be calculated only after all vertex positions have been set by listeners.
    this.lengthsEqualToSavedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'lengthsEqualToSavedProperty' )
    } );

    // Whether the quadrilateral is a parallelogram. This Property updates async in the step function! We need to
    // update this Property after all vertex positions and all vertex angles have been updated. When moving more than
    // one vertex at a time, only one vertex position updates synchronously in the code and in those transient states
    // the model may temporarily not be a parallelogram. Updating in step after all Properties and listeners are done
    // with this work resolves the problem.
    this.isParallelogramProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isParallelogramProperty' )
    } );

    // The name of the quadrilateral (like square/rhombus/trapezoid, etc). Will be null if it is a random
    // unnamed shape.
    this.shapeNameProperty = new Property( this.getShapeName() );

    // The name of the quadrilateral (like square/rhombus/trapezoid, etc). Will be null if it is a random
    // unnamed shape.
    this.shapeNameProperty = new Property( this.getShapeName() );

    // @public {Emitter} - Emits an event whenever the shape of the Quadrilateral changes
    this.shapeChangedEmitter = new Emitter<[]>();

    // referenced for private use in functions
    this.model = model;

    model.modelBoundsProperty.link( modelBounds => {
      if ( modelBounds ) {
        this.setVertexDragAreas();
      }
    } );

    Property.multilink( [
        this.vertexA.positionProperty,
        this.vertexB.positionProperty,
        this.vertexC.positionProperty,
        this.vertexD.positionProperty ],
      ( position1: Vector2, position2: Vector2, position3: Vector2, position4: Vector2 ) => {
        this.shapeChangedEmitter.emit();

        if ( model.modelBoundsProperty.value ) {
          this.setVertexDragAreas();
        }
      }
    );
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

  public getSideLengthsChanged( currentSideLengths: SideLengths ) {
    return Utils.equalsEpsilon( currentSideLengths.topSideLength, this.savedSideLengths.topSideLength, this.topSide.lengthToleranceIntervalProperty.value ) &&
           Utils.equalsEpsilon( currentSideLengths.rightSideLength, this.savedSideLengths.rightSideLength, this.rightSide.lengthToleranceIntervalProperty.value ) &&
           Utils.equalsEpsilon( currentSideLengths.bottomSideLength, this.savedSideLengths.bottomSideLength, this.bottomSide.lengthToleranceIntervalProperty.value ) &&
           Utils.equalsEpsilon( currentSideLengths.leftSideLength, this.savedSideLengths.leftSideLength, this.leftSide.lengthToleranceIntervalProperty.value );
  }

  /**
   * Save all side lengths for the model, to monitor changes in the length over time.
   */
  public saveSideLengths(): void {
    this.savedSideLengths = this.getSideLengths();
  }

  /**
   * Returns the name of the quadrilateral, one of NamedQuadrilateral enumeration. If the quadrilateral is in a shape
   * that is not named, returns null.
   */
  public getShapeName(): NamedQuadrilateral | null {
    let namedQuadrilateral = null;

    const topSideLengthEqualToRightSideLength = this.topSide.isLengthEqualToOther( this.rightSide );

    // equalities for adjacent vertices
    const adjacentVertexAngles = [
      [ this.vertexA.angleProperty!.value, this.vertexB.angleProperty!.value ],
      [ this.vertexB.angleProperty!.value, this.vertexC.angleProperty!.value ],
      [ this.vertexC.angleProperty!.value, this.vertexD.angleProperty!.value ],
      [ this.vertexD.angleProperty!.value, this.vertexA.angleProperty!.value ]
    ];
    const vertexAAngleEqualsVertexBAngle = this.isShapeAngleEqualToOther( this.vertexA.angleProperty!.value, this.vertexB.angleProperty!.value );
    const vertex2AngleEqualsVertex3Angle = this.isShapeAngleEqualToOther( this.vertexB.angleProperty!.value, this.vertexC.angleProperty!.value );

    // If any angles are larger than PI it is a concave shape.
    if ( _.some( this.vertices, vertex => vertex.angleProperty!.value > Math.PI ) ) {
      namedQuadrilateral = NamedQuadrilateral.CONCAVE;
    }
    else if ( this.isParallelogramProperty.value ) {

      // Square, rhombus, rectangle must be a parallelogram. If we assume this then we can simplify some of the other
      // comparisons to detect these shapes because we know that opposite angles must be equal and opposite sides must
      // be the same length.

      // because this is a parallelogram, we only have to check that the adjacent angles are equal, because to be
      // a parallelogram the angles at opposite vertices must also be equal.
      if ( vertexAAngleEqualsVertexBAngle && vertex2AngleEqualsVertex3Angle ) {

        // For a parallelogram, opposite sides are equal in length, so if adjacent sides are equal in length as well
        // it must be a square.
        if ( topSideLengthEqualToRightSideLength ) {
          namedQuadrilateral = NamedQuadrilateral.SQUARE;
        }
        else {

          // Adjacent side lengths are not equal, but opposite side lengths are. All angles are equal - we must be a
          // rectangle.
          namedQuadrilateral = NamedQuadrilateral.RECTANGLE;
        }
      }
      else if ( topSideLengthEqualToRightSideLength ) {

        // Adjacent angles are different for the parallelogram and adjacent sides are equal in length. Since it is
        // a parallelogram, if the top and right sides are equal in length, the bottom and left sides must be equal
        // as well.
        namedQuadrilateral = NamedQuadrilateral.RHOMBUS;
      }
    }
    else {

      // According to https://en.wikipedia.org/wiki/Trapezoid#Characterizations a trapezoid has two adjacent
      // angles that add up to Math.PI.
      const trapezoidRequirement = _.some( adjacentVertexAngles, anglePair => {
        return this.isShapeAngleEqualToOther( anglePair[ 0 ] + anglePair[ 1 ], Math.PI );
      } );

      if ( trapezoidRequirement ) {

        // An isosceles trapezoid will have two pairs of adjacent angles that are equal.
        const isoscelesRequirement = _.countBy( adjacentVertexAngles, anglePair => {
          return this.isShapeAngleEqualToOther( anglePair[ 0 ], anglePair[ 1 ] );
        } ).true === 2;

        // If one of the pairs of sides share the same length, it must be an isosceles trapezoid
        if ( isoscelesRequirement ) {
          namedQuadrilateral = NamedQuadrilateral.ISOSCELES_TRAPEZOID;
        }
        else {
          namedQuadrilateral = NamedQuadrilateral.TRAPEZOID;
        }
      }
      else {

        // TODO: Define in constructor to reduce allocation?
        const adjacentSides = [
          [ this.topSide, this.rightSide ],
          [ this.rightSide, this.bottomSide ],
          [ this.bottomSide, this.leftSide ],
          [ this.leftSide, this.topSide ]
        ];

        const kiteRequirement = _.countBy( adjacentSides, ( sidePair: Side[] ) => {
          return sidePair[ 0 ].isLengthEqualToOther( sidePair[ 1 ] );
        } ).true === 2;

        if ( kiteRequirement ) {
          namedQuadrilateral = NamedQuadrilateral.KITE;
        }
      }
    }

    return namedQuadrilateral;
  }

  /**
   * Create the drag area for a vertex from the positions of the others. The vertex area
   * @private
   *
   * @param modelBounds - The bounds containing all vertices (entire model space)
   * @param vertexA - The vertex whose area we are determining
   * @param vertexB - the next vertex from vertexA, moving clockwise
   * @param vertexC - the next vertex from vertexB, moving clockwise
   * @param vertexD - the next vertex from vertexC, moving clockwise
   */
  createVertexArea( modelBounds: Bounds2, vertexA: Vertex, vertexB: Vertex, vertexC: Vertex, vertexD: Vertex ): Shape {

    const allVerticesInBounds = _.every( [ vertexA, vertexB, vertexC, vertexD ], vertex => modelBounds.containsPoint( vertex.positionProperty.value ) );
    if ( this.validateShape ) {
      assert && assert( allVerticesInBounds, 'A vertex is not contained by modelBounds!' );
    }

    if ( !allVerticesInBounds ) {

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

    if ( vertexC.angleProperty!.value > Math.PI ) {

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
      if ( QuadrilateralShapeModel.isPointOnLine( line, firstRay!.position ) ) {

        // The point is exactly on the line, so there won't be an intersection - but this is still an intersection
        // for our purposes, we want include that point in our vertex area.
        firstRayIntersectionLinePair = {
          line: line,
          intersectionPoint: firstRay!.position
        };
      }

      if ( secondLineIntersections.length > 0 ) {
        secondRayIntersectionLinePair = {
          line: line,
          intersectionPoint: secondLineIntersections[ 0 ].point
        };
      }
      if ( QuadrilateralShapeModel.isPointOnLine( line, secondRay!.position ) ) {

        // The point is exactly on the line, so there won't be an intersection - but this is still an intersection
        // for our purposes, we want include that point in our vertex area.
        secondRayIntersectionLinePair = {
          line: line,
          intersectionPoint: secondRay!.position
        };
      }
    } );

    // An array of points that will create the final shape
    let points = [];

    if ( vertexC.angleProperty!.value > Math.PI ) {

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

    return length === lengthA + lengthB;
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
   *
   * @param directedLines
   * @param firstLineIntersectionPair
   * @param secondLineIntersectionPair
   * @private
   */
  private static getPointsAlongBoundary( directedLines: Line[], firstLineIntersectionPair: LineIntersectionPair, secondLineIntersectionPair: LineIntersectionPair ): Vector2[] {
    const points = [];

    // walk to the first ray intersection with the bounds
    points.push( firstLineIntersectionPair.intersectionPoint );

    // a safety net to make sure that we don't get stuck in this while loop
    let iterations = 0;

    // walk along the bounds, adding corner points until we reach the same line as the secondLineIntersectionPair
    let nextLine = firstLineIntersectionPair!.line;
    while ( nextLine !== secondLineIntersectionPair!.line ) {
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
    points.push( secondLineIntersectionPair!.intersectionPoint );

    return points;
  }


  /**
   * Returns true if the provided Vertex is allowed to exist in the proposed position. The Vertex is not allowed
   * to overlap any other Vertex of the model. It also must be within the drag area that is defined by the positions
   * of other vertices in the model, which prevents the shape from becoming twisted.
   *
   * TODO: Remove this and use the other function everywhere.
   *
   * @param vertex - The vertex in question, so we don't compare it to itself
   * @param proposedPosition
   */
  public isVertexPositionAllowed( vertex: Vertex, proposedPosition: Vector2 ): boolean {
    let positionAllowed = true;

    SCRATCH_BOUNDS.setMinMax(
      proposedPosition.x - Vertex.VERTEX_BOUNDS.width / 2,
      proposedPosition.y - Vertex.VERTEX_BOUNDS.height / 2,
      proposedPosition.x + Vertex.VERTEX_BOUNDS.width / 2,
      proposedPosition.y + Vertex.VERTEX_BOUNDS.height / 2
    );

    // the vertex must be completely within the model bounds - this check is necessary in addition
    // to the dragAreaProperty check below because that only checks the vertex point (not the vertex bounds)
    assert && assert( this.model.modelBoundsProperty.value, 'modelBounds must be defined' );
    positionAllowed = this.model.modelBoundsProperty.value!.containsBounds( SCRATCH_BOUNDS );

    if ( positionAllowed ) {

      // vertex cannot overlap any others
      for ( let i = 0; i < this.vertices.length; i++ ) {
        const otherVertex = this.vertices[ i ];
        if ( vertex !== otherVertex && otherVertex.boundsOverlapsVertex( SCRATCH_BOUNDS ) ) {
          positionAllowed = false;
          break;
        }
      }
    }

    if ( positionAllowed ) {

      // vertex cannot overlap any sides
      for ( let j = 0; j < this.sides.length; j++ ) {
        const side = this.sides[ j ];

        for ( let i = 0; i < this.vertices.length; i++ ) {
          const otherVertex = this.vertices[ i ];

          // Vertices of a Side are allowed to overlap with that side
          if ( !side.includesVertex( otherVertex ) ) {

            // If the vertex is the one we are questioning its new position is being proposed so we need to
            // check sratch bounds - otherwise we can check the current value of bounds for the other vertices
            const boundsToCheck = otherVertex === vertex ? SCRATCH_BOUNDS : otherVertex.modelBoundsProperty.value;
            positionAllowed = !side.shapeProperty.value.intersectsBounds( boundsToCheck );
          }

          if ( !positionAllowed ) {
            break;
          }
        }

        if ( !positionAllowed ) {
          break;
        }
      }
    }

    // if the position is still allowed, check to see if the position is within the valid shape of the
    // vertex
    if ( positionAllowed ) {
      assert && assert( vertex.dragAreaProperty.value, 'Drag area must be defined for the Vertex' );

      // A workaround for https://github.com/phetsims/kite/issues/94 - If the proposed position perfectly aligns
      // with one of the start/end points of a shape segment along the Ray2 used for the winding number calculation,
      // intersection with the ray will be undefined and the point may incorrectly be counted as inside the Shape.
      // For now we make sure that the BOTH the top right and bottom right points of the Vertex bounds are within
      // the Shape. This will work for now because Shape.containsPoint uses a Ray that extends in the +x direction
      // for the winding number. If the two points we are checking are not vertically aligned it is impossible
      // that both points align vertically with a Shape start/end point.
      // When kite #94 is fixed we can replace this with a single check to see if the proposedPosition is within
      // the Vertex dragArea.
      positionAllowed = vertex.dragAreaProperty.value!.containsPoint( SCRATCH_BOUNDS.rightTop ) &&
                        vertex.dragAreaProperty.value!.containsPoint( SCRATCH_BOUNDS.rightBottom );
    }

    return positionAllowed;
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
      assert && assert( this.model.modelBoundsProperty.value, 'Model bounds must be defined.' );
      shapeAllowed = this.model.modelBoundsProperty.value!.containsBounds( testVertex.modelBoundsProperty.value );

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

        // A workaround for https://github.com/phetsims/kite/issues/94 - If the proposed position perfectly aligns
        // with one of the start/end points of a shape segment along the Ray2 used for the winding number calculation,
        // intersection with the ray will be undefined and the point may incorrectly be counted as inside the Shape.
        // For now we make sure that the BOTH the top right and bottom right points of the Vertex bounds are within
        // the Shape. This will work for now because Shape.containsPoint uses a Ray that extends in the +x direction
        // for the winding number. If the two points we are checking are not vertically aligned it is impossible
        // that both points align vertically with a Shape start/end point.
        // When kite #94 is fixed we can replace this with a single check to see if the proposedPosition is within
        // the Vertex dragArea.
        assert && assert( testVertex.dragAreaProperty.value, 'Drag area must be defined for the Vertex' );
        shapeAllowed = testVertex.dragAreaProperty.value!.containsPoint( testVertex.modelBoundsProperty.value.rightTop ) &&
                       testVertex.dragAreaProperty.value!.containsPoint( testVertex.modelBoundsProperty.value.rightBottom );
      }

      // Shape is not allowed, no need to keep testing
      if ( !shapeAllowed ) {
        break;
      }
    }

    return shapeAllowed;
  }

  /**
   * Returns whether or not the quadrilateral shape is a parallelogram, within the tolerance defined by
   * angleToleranceIntervalProperty.
   */
  public getIsParallelogram(): boolean {
    const angle1DiffAngle3 = Math.abs( this.vertexA.angleProperty!.value - this.vertexC.angleProperty!.value );
    const angle2DiffAngle4 = Math.abs( this.vertexB.angleProperty!.value - this.vertexD.angleProperty!.value );
    const epsilon = this.angleToleranceIntervalProperty.value;

    return angle1DiffAngle3 < epsilon && angle2DiffAngle4 < epsilon;
  }

  /**
   * Returns true if two angles are close enough to each other that they should be considered equal. They are close
   * enough if they are within the angleToleranceIntervalProperty.
   */
  public isAngleEqualToOther( angle1: number, angle2: number ): boolean {
    return Utils.equalsEpsilon( angle1, angle2, this.angleToleranceIntervalProperty.value );
  }

  /**
   * Returns true if two angles are close enough together that they should be considered equal. This uses the
   * shapeAngleToleranceProperty, the most strict interval available. The angleToleranceInterval can be set
   * to infinity and is very dynamic to accomplish comparisons required to detect parallelogram state during
   * various interactions. But when detecting shapes we need to be more strict so that when the tolerance is
   * very high the shape isn't incorrectly described.
   */
  public isShapeAngleEqualToOther( angle1: number, angle2: number ): boolean {
    return Utils.equalsEpsilon( angle1, angle2, this.shapeAngleToleranceIntervalProperty.value );
  }

  public isTiltEqualToOther( tilt1: number, tilt2: number ): boolean {
    return Utils.equalsEpsilon( tilt1, tilt2, this.tiltToleranceIntervalProperty.value );
  }

  /**
   * Step the model forward in time.
   * @param dt - in seconds
   */
  public step( dt: number ): void {

    // Update Properties that need to be set only after vertex positions have been updated.
    this.updateDeferredProperties();
  }

  /**
   * Update Properties that need to be updated only after other model Properties are set. For example, we only
   * determine whether the quadrilateral is a parallelogram after all vertex positions have been set.
   */
  updateDeferredProperties() {

    // The isParallelogramProperty needs to be set asynchronously, see the documentation for isParallelogramProperty.
    this.isParallelogramProperty.set( this.getIsParallelogram() );

    // We need to determine if side lengths have changed in the step function because we need to calculate
    // lengths after all positions have been set.
    this.lengthsEqualToSavedProperty.set( this.getSideLengthsChanged( this.getSideLengths() ) );

    if ( !this.lengthsEqualToSavedProperty.value ) {
      this.saveSideLengths();
    }

    // After we have detected whether or not we are a parallelogram, and after all vertices are positioned, calculate
    // the name of the current quadrilateral shape.
    this.shapeNameProperty.set( this.getShapeName() );
  }

  /**
   * Sets this model to be the same as the provided QuadrilateralShapeModel, but setting Vertex positions.
   */
  public set( other: QuadrilateralShapeModel ): void {
    this.vertexA.positionProperty.set( other.vertexA.positionProperty.value );
    this.vertexB.positionProperty.set( other.vertexB.positionProperty.value );
    this.vertexC.positionProperty.set( other.vertexC.positionProperty.value );
    this.vertexD.positionProperty.set( other.vertexD.positionProperty.value );
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
   * Set positions of the Vertices from length and angle data. We get the angles at each vertex and lengths
   * of each side from the hardware. We need to convert that to vertex positions in model space.
   *
   * With angle and length data alone we do not know the orientation or position in space of the shape. So the
   * shape is constructed with the top left vertex (vertexA) and top side (topSide) anchored  while the rest
   * of the vertices are relatively positioned from the angle and length data. Once the shape is constructed it is
   * translated so that the centroid of the shape is in the center of model space (0, 0). The final result is that only
   * the tilt of the top side remains anchored. Perhaps if a gyroscope is added in the future we may be able to rotate
   * the shape correctly without anchoring the top side.
   * @private
   */
  setPositionsFromLengthAndAngleData( topLength: number, rightLength: number, bottomLength: number, leftLength: number, p1Angle: number, p2Angle: number, p3Angle: number, p4Angle: number ) {

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

    // you must calibrate before setting positions from a physical device
    if ( this.model.physicalModelBoundsProperty.value !== null && !this.model.isCalibratingProperty.value && this.model.modelBoundsProperty.value ) {

      // the physical device lengths can only become half as long as the largest length, so map to the sim model
      // with that constraint as well so that the smallest shape on the physical device doesn't bring vertices
      // all the way to the center of the screen (0, 0).
      const deviceLengthToSimLength = new LinearFunction( 0, this.model.physicalModelBoundsProperty.value.width, 0, this.model.modelBoundsProperty.value.width / 3 );

      const mappedTopLength = deviceLengthToSimLength.evaluate( topLength );
      const mappedRightLength = deviceLengthToSimLength.evaluate( rightLength );
      const mappedLeftLength = deviceLengthToSimLength.evaluate( leftLength );

      this.setPositionsFromLengthsAndAngles( mappedTopLength, mappedRightLength, mappedLeftLength, p1Angle, p2Angle, p3Angle, p4Angle );
    }
  }

  /**
   * Set positions from the length and angle data provided. Useful when working with a tangible device that is
   * providing length and angle data. When reconstructing the shape we start by making the top side parallel
   * with the top of model bounds. The remaining vertices are positioned acordingly. Finally, if there is some
   * rotation to apply (from the experimental marker input), that rotation is applied.
   */
  public setPositionsFromLengthsAndAngles( topLength: number, rightLength: number, leftLength: number, p1Angle: number, p2Angle: number, p3Angle: number, p4Angle: number ): void {

    assert && assert( this.model.modelBoundsProperty.value, 'setPositionsFromLengthsAndAngles can only be used when modelBounds are defined' );
    const modelBounds = this.model.modelBoundsProperty.value!;

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
    // rotation of the device
    const rotatedPositions = _.map( shiftedPositions, shiftedPosition => shiftedPosition.rotated( -this.model.markerRotationProperty.value ) );

    // make sure that all positions are within model bounds
    const constrainedPositions = _.map( rotatedPositions, position => this.model.modelBoundsProperty.value?.closestPointTo( position ) );

    // TODO: Validate these positions...
    // FOR NEXT TIME: Start here.
    // 1) Set positions to a scratch model
    // 2) Query the positions and make sure vertices are OK for the quad
    // In model bounds, not overlapping, in respective drag areas
    this.vertexA.positionProperty.set( constrainedPositions[ 0 ]! );
    this.vertexB.positionProperty.set( constrainedPositions[ 1 ]! );
    this.vertexC.positionProperty.set( constrainedPositions[ 2 ]! );
    this.vertexD.positionProperty.set( constrainedPositions[ 3 ]! );
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
   * @private
   */
  setVertexDragAreas() {
    this.vertexA.dragAreaProperty.set( this.createVertexArea( this.model.modelBoundsProperty.value!, this.vertexA, this.vertexB, this.vertexC, this.vertexD ) );
    this.vertexB.dragAreaProperty.set( this.createVertexArea( this.model.modelBoundsProperty.value!, this.vertexB, this.vertexC, this.vertexD, this.vertexA ) );
    this.vertexC.dragAreaProperty.set( this.createVertexArea( this.model.modelBoundsProperty.value!, this.vertexC, this.vertexD, this.vertexA, this.vertexB ) );
    this.vertexD.dragAreaProperty.set( this.createVertexArea( this.model.modelBoundsProperty.value!, this.vertexD, this.vertexA, this.vertexB, this.vertexC ) );
  }

  public reset(): void {
    this.vertexA.reset();
    this.vertexB.reset();
    this.vertexC.reset();
    this.vertexD.reset();
  }
}

quadrilateral.register( 'QuadrilateralShapeModel', QuadrilateralShapeModel );
export default QuadrilateralShapeModel;

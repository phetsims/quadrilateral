// Copyright 2021-2023, University of Colorado Boulder

/**
 * The base model class for Quadrilateral. Assembles all model components and responsible for managing Properties
 * that indicate the state of the whole Quadrilateral shape. Will probably also manage Properties that manage
 * the state of the Sim (UI element visibility and so on).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';
import Vertex from './Vertex.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import QuadrilateralPreferencesModel from './QuadrilateralPreferencesModel.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import TangibleConnectionModel from './prototype/TangibleConnectionModel.js';

class QuadrilateralModel {

  // The bounds of the simulation in model coordinates. Origin (0,0) is at the center. The shape and
  // vertices can be positioned within these bounds.
  public modelBounds = new Bounds2(
    -QuadrilateralConstants.BOUNDS_WIDTH / 2,
    -QuadrilateralConstants.BOUNDS_HEIGHT / 2,
    QuadrilateralConstants.BOUNDS_WIDTH / 2,
    QuadrilateralConstants.BOUNDS_HEIGHT / 2
  );

  // Whether a reset is currently in progress. Added for sound. If the model is actively resetting, SoundManagers
  // are disabled so we don't play sounds for transient model states. Tracks when the reset is NOT in progress
  // because that makes it most convenient to pass to SoundGenerator enableControlProperties.
  public readonly resetNotInProgressProperty: TProperty<boolean>;

  // If true, a panel displaying model values will be added to the view. Only for debugging.
  public readonly showDebugValuesProperty: TProperty<boolean>;

  // Controls runtime preferences for the simulation.
  public readonly preferencesModel: QuadrilateralPreferencesModel;

  // A model that manages Properties used by prototype connections with tangible devices (Serial, OpenCV, BLE).
  public readonly tangibleConnectionModel: TangibleConnectionModel;

  // Whether the angle guide graphics are visible at each vertex.
  public readonly markersVisibleProperty: BooleanProperty;

  // Whether labels on each vertex are visible.
  public readonly vertexLabelsVisibleProperty: BooleanProperty;

  // The available bounds for smooth vertex dragging (the model bounds eroded by the width of a vertex so a vertex
  // can never go ouside of the model bounds.
  public readonly vertexDragBounds = this.modelBounds.eroded( Vertex.VERTEX_WIDTH / 2 );

  // The interval that Vertices are constrained to during interaction. There are many things that control the value:
  //  - A "lock" button in the UI to lock to small intervals.
  //  - A global hotkey that uses small intervals when pressed.
  //  - Using ?reducedStepSize to make all intervals smaller
  //  - Connected to a physical device 
  public readonly vertexIntervalProperty: TReadOnlyProperty<number>;

  // Whether vertices are going to snap to the minor intervals of the model grid. The user can "lock" this setting
  // from the user interface. There is also a global hotkey to toggle this quickly during interaction.
  private readonly useMinorIntervalsProperty: TReadOnlyProperty<boolean>;

  // Whether the vertices will lock to the minor grid intervals during interaction. Toggled from a UI component
  // in the screen. When true, the global hotkey for using minor intervals does nothing.
  public readonly lockToMinorIntervalsProperty: BooleanProperty;

  // Whether the vertices should lock to the minor grid intervals from a specific modifier key. When "locked"
  // to the minor grid intervals, this Property and its global modifier key have no effect. See the above Property.
  public readonly minorIntervalsFromGlobalKeyProperty: TProperty<boolean>;

  // Whether the grid is visible.
  public readonly gridVisibleProperty: BooleanProperty;

  // Whether the diagonal guides are visible.
  public readonly diagonalGuidesVisibleProperty: BooleanProperty;

  // Whether the shape name is displayed to the user.
  public readonly shapeNameVisibleProperty: BooleanProperty;

  // Whether the simulation sound design is enabled to play as the shape changes. For now,
  // this only controls the "Tracks" sound designs in this simulation. When this is false,
  // we will still hear general and common code sounds.
  public readonly shapeSoundEnabledProperty: BooleanProperty;

  // A reference to the "main" shape model for the simulation. Controls vertex positions.
  public quadrilateralShapeModel: QuadrilateralShapeModel;

  // A reference to a "test" model for the simulation. Used to validate and verify that vertex positions are
  // reasonable before setting to the "main" shape model.
  public quadrilateralTestShapeModel: QuadrilateralShapeModel;

  // Emits an event when a full model reset happens (but not when a shape reset happens)
  public readonly resetEmitter = new Emitter();

  // The first model step we will disable all sounds. This simulation updates certain Properties in the animation
  // frame so we wait until after the sim has loaded to start playing any sounds (lazyLink is not sufficient when
  // Properties are updated the following frame).
  private firstModelStep: boolean;

  public constructor( preferencesModel: QuadrilateralPreferencesModel, tandem: Tandem ) {

    this.preferencesModel = preferencesModel;

    this.showDebugValuesProperty = new BooleanProperty( QuadrilateralQueryParameters.showModelValues );

    this.resetNotInProgressProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'resetNotInProgressProperty' )
    } );

    this.quadrilateralShapeModel = new QuadrilateralShapeModel( this, {
      tandem: tandem.createTandem( 'quadrilateralShapeModel' )
    } );

    this.quadrilateralTestShapeModel = new QuadrilateralShapeModel( this, {
      validateShape: false,
      tandem: tandem.createTandem( 'quadrilateralTestShapeModel' )
    } );

    this.tangibleConnectionModel = new TangibleConnectionModel( this.quadrilateralShapeModel, this.preferencesModel.tangibleOptionsModel, this.modelBounds, tandem.createTandem( 'tangibleConnectionModel' ) );

    this.vertexLabelsVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'vertexLabelsVisibleProperty' )
    } );

    this.gridVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'gridVisibleProperty' )
    } );

    this.diagonalGuidesVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'diagonalGuidesVisibleProperty' )
    } );

    this.markersVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'markersVisibleProperty' )
    } );

    this.shapeNameVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'shapeNameVisibleProperty' )
    } );

    this.shapeSoundEnabledProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'shapeSoundEnabledProperty' )
    } );

    this.minorIntervalsFromGlobalKeyProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'minorIntervalsFromGlobalKeyProperty' )
    } );

    this.lockToMinorIntervalsProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'lockToMinorIntervalsProperty' )
    } );

    this.useMinorIntervalsProperty = DerivedProperty.or( [ this.minorIntervalsFromGlobalKeyProperty, this.lockToMinorIntervalsProperty ] );

    // Vertex intervals are controlled whether we are "locked" to smaller steps, whether we are temporarily using
    // smaller steps because of a hotkey, or if running with ?reducedStepSize
    this.vertexIntervalProperty = new DerivedProperty(
      [ this.useMinorIntervalsProperty, this.tangibleConnectionModel.connectedToDeviceProperty, preferencesModel.tangibleOptionsModel.deviceGridSpacingProperty ],
      ( useMinorIntervals, connectedToDevice, deviceGridSpacing ) => {

        let interval: number;
        if ( connectedToDevice ) {
          interval = deviceGridSpacing;
        }
        else if ( QuadrilateralQueryParameters.reducedStepSize ) {
          interval = useMinorIntervals ? QuadrilateralConstants.MINOR_REDUCED_SIZE_VERTEX_INTERVAL : QuadrilateralConstants.MAJOR_REDUCED_SIZE_VERTEX_INTERVAL;
        }
        else {
          interval = useMinorIntervals ? QuadrilateralQueryParameters.minorVertexInterval : QuadrilateralQueryParameters.majorVertexInterval;
        }

        return interval;
      }
    );

    this.firstModelStep = true;

    // Put a reference to the simulation model on the window so that we can access it in wrappers that facilitate
    // communication between device and simulation.
    // @ts-expect-error TODO: TypeScript doesn't allow us to do such hacky things (perhaps for good reason...)
    window.simModel = this;
  }

  /**
   * Returns true if the vertex position is allowed. Sets the proposed vertex position to the test shape
   * and returns true if the scratch QuadrilateralShapeModel reports that it is in a valid position.
   */
  public isVertexPositionAllowed( vertex: Vertex, proposedPosition: Vector2 ): boolean {

    // set the proposed position to the scratch shape
    this.quadrilateralTestShapeModel.set( this.quadrilateralShapeModel );
    this.quadrilateralTestShapeModel.getLabelledVertex( vertex.vertexLabel ).positionProperty.set( proposedPosition );

    return this.quadrilateralTestShapeModel.isQuadrilateralShapeAllowed();
  }

  /**
   * Returns true if the two vertex positions are allowed for the quadrilateral.
   */
  public areVertexPositionsAllowed( vertex1: Vertex, vertex1ProposedPosition: Vector2, vertex2: Vertex, vertex2ProposedPosition: Vector2 ): boolean {

    // Set the test shape to the current value of the actual shape before proposed positions
    this.quadrilateralTestShapeModel.set( this.quadrilateralShapeModel );

    // Setting multiple vertex positions at once, we need to wait to call listeners until all values are ready
    this.quadrilateralTestShapeModel.setPropertiesDeferred( true );

    // set the proposed positions to the test quadrilateral without calling listeners
    const testVertex1 = this.quadrilateralTestShapeModel.getLabelledVertex( vertex1.vertexLabel );
    const testVertex2 = this.quadrilateralTestShapeModel.getLabelledVertex( vertex2.vertexLabel );

    testVertex1.positionProperty.set( vertex1ProposedPosition );
    testVertex2.positionProperty.set( vertex2ProposedPosition );

    // This will un-defer and call listeners for us
    this.quadrilateralTestShapeModel.setPropertiesDeferred( false );

    return this.quadrilateralTestShapeModel.isQuadrilateralShapeAllowed();
  }

  /**
   * Resets the model.
   */
  public reset(): void {

    // reset is in progress (not not in progress)
    this.resetNotInProgressProperty.value = false;

    this.quadrilateralShapeModel.reset();
    this.quadrilateralTestShapeModel.reset();

    // Eagerly update the Properties that are set asynchronously so we don't wait until
    // the next frame for these to be set after a reset.
    this.quadrilateralShapeModel.updateOrderDependentProperties();

    this.lockToMinorIntervalsProperty.reset();

    // reset visibility Properties
    this.markersVisibleProperty.reset();
    this.vertexLabelsVisibleProperty.reset();
    this.gridVisibleProperty.reset();
    this.diagonalGuidesVisibleProperty.reset();
    this.shapeNameVisibleProperty.reset();
    this.shapeSoundEnabledProperty.reset();

    this.resetEmitter.emit();

    // reset is not in progress anymore
    this.resetNotInProgressProperty.value = true;
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {

    // First model step prevent sounds from coming through as we call updateOrderDependentProperties
    // TODO: This may not be necessary anymore since updateOrderDependentPRoperties was moved
    // out of the animation frame.
    if ( this.firstModelStep ) {
      this.resetNotInProgressProperty.value = false;
    }

    if ( this.firstModelStep ) {
      this.firstModelStep = false;
      this.resetNotInProgressProperty.value = true;
    }
  }

  /**
   * Returns the closest position in the model from the point provided that will be constrain the position to align
   * with the model grid. See vertexIntervalProperty for more information about how the intervals of the grid
   * can change.
   */
  public getClosestGridPosition( ProposedPosition: Vector2 ): Vector2 {

    const interval = this.vertexIntervalProperty.value;
    return new Vector2( Utils.roundToInterval( ProposedPosition.x, interval ), Utils.roundToInterval( ProposedPosition.y, interval ) );
  }

  /**
   * Get the closest crid position to the provided position, in the direction of the provided directionVector.
   * Use this when you need to move to the closest grid position in one dimension, instead of moving to the
   * closest grid position in both X and Y.
   */
  public getClosestGridPositionInDirection( currentPosition: Vector2, directionVector: Vector2 ): Vector2 {
    let nextX = currentPosition.x;
    let nextY = currentPosition.y;

    if ( directionVector.x !== 0 ) {
      nextX = this.getNextPositionInDimension( currentPosition.x, directionVector.x > 0 );
    }
    else if ( directionVector.y !== 0 ) {
      nextY = this.getNextPositionInDimension( currentPosition.y, directionVector.y > 0 );
    }

    return new Vector2( nextX, nextY );
  }

  /**
   * Returns a new position in x or y dimensions, used by getClosestGridPositionInDirection.
   * @param currentVal - Current position in x or y dimensions
   * @param gettingLarger - Are you getting larger in that dimension?
   */
  private getNextPositionInDimension( currentVal: number, gettingLarger: boolean ): number {
    const interval = this.vertexIntervalProperty.value;
    let remainder = Math.abs( currentVal ) % interval;
    const onTheInterval = Utils.equalsEpsilon( remainder, 0, 0.01 );

    if ( currentVal < 0 ) {
      remainder = interval - remainder;
    }

    let delta;
    if ( gettingLarger ) {
      delta = onTheInterval ? interval : interval - remainder;
    }
    else {
      delta = onTheInterval ? -interval : -remainder;
    }

    return currentVal + delta;
  }
}

quadrilateral.register( 'QuadrilateralModel', QuadrilateralModel );
export default QuadrilateralModel;
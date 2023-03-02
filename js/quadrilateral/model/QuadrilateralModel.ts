// Copyright 2021-2023, University of Colorado Boulder

/**
 * The base model class for the sim. Assembles all model components and responsible for managing Properties
 * that indicate the state of the Quadrilateral shape. Also includes Properties that manage the state of the Sim (UI
 * element visibility and so on).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';
import QuadrilateralVertex from './QuadrilateralVertex.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import QuadrilateralOptionsModel from './QuadrilateralOptionsModel.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralConstants from '../../QuadrilateralConstants.js';
import TangibleConnectionModel from './prototype/TangibleConnectionModel.js';
import QuadrilateralVisibilityModel from './QuadrilateralVisibilityModel.js';
import TModel from '../../../../joist/js/TModel.js';

export default class QuadrilateralModel implements TModel {

  // Manages visibility of view components
  public readonly visibilityModel: QuadrilateralVisibilityModel;

  // Controls runtime options for the simulation.
  public readonly optionsModel: QuadrilateralOptionsModel;

  // A model that manages Properties used by prototype connections with tangible devices (Serial, OpenCV, BLE).
  public readonly tangibleConnectionModel: TangibleConnectionModel;

  // Whether a reset is currently in progress. Added for sound. If the model is actively resetting, SoundManagers
  // are disabled so we don't play sounds for transient model states. Tracks when the reset is NOT in progress
  // because that makes it most convenient to pass to SoundGenerator enableControlProperties.
  public readonly resetNotInProgressProperty: TProperty<boolean>;

  // The bounds of the simulation in model coordinates. Origin (0,0) is at the center. The shape and
  // vertices can be positioned within these bounds.
  public readonly modelBounds = new Bounds2(
    -QuadrilateralConstants.BOUNDS_WIDTH / 2,
    -QuadrilateralConstants.BOUNDS_HEIGHT / 2,
    QuadrilateralConstants.BOUNDS_WIDTH / 2,
    QuadrilateralConstants.BOUNDS_HEIGHT / 2
  );

  // The available bounds for smooth vertex dragging (the model bounds eroded by the width of a vertex so a vertex
  // can never go out of the model bounds.
  public readonly vertexDragBounds = this.modelBounds.eroded( QuadrilateralVertex.VERTEX_WIDTH / 2 );

  // The interval that Vertices are constrained to during interaction. There are many things that control the value:
  //  - A button in the UI to lock to small intervals (see useMinorIntervalsProperty and lockToMinorIntervalsProperty)
  //  - A global hotkey for small intervals (see useMinorIntervalsProperty and minorIntervalsFromGlobalHotkeyProperty)
  //  - Using ?reducedStepSize to make all intervals smaller (see vertexIntervalProperty derivation)
  //  - Connecting to a prototype tangible device (see vertexIntervalProperty derivation)
  public readonly vertexIntervalProperty: TReadOnlyProperty<number>;

  // Whether vertices are going to snap to the minor intervals of the model grid. The user can "lock" this setting
  // from the user interface. There is also a global hotkey to toggle this quickly during interaction. Derived from
  // lockToMinorIntervalsProperty and minorIntervalsFromGlobalKeyProperty.
  private readonly useMinorIntervalsProperty: TReadOnlyProperty<boolean>;

  // Whether the vertices will lock to the minor grid intervals during interaction. Controlled by a toggle in the UI.
  // When true, the global hotkey for using minor intervals does nothing.
  public readonly lockToMinorIntervalsProperty: BooleanProperty;

  // Whether the vertices should snap to the minor grid intervals because of pressing a hotkey.
  public readonly minorIntervalsFromGlobalKeyProperty: TProperty<boolean>;

  // Whether the simulation sound design is enabled to play as the shape changes. For now,
  // this only controls the "Tracks" sound designs in this simulation. When this is false,
  // we will still hear general and common code sounds.
  public readonly shapeSoundEnabledProperty: BooleanProperty;

  // Model component for the quadrilateral shape.
  public readonly quadrilateralShapeModel: QuadrilateralShapeModel;

  // A reference to a "test" model for the simulation. Used to validate vertex positions before setting them for
  // the "real" quadrilateralShapeModel. See QuadrilateralShapeModel.isQuadrilateralShapeAllowed().
  public readonly quadrilateralTestShapeModel: QuadrilateralShapeModel;

  // Emits an event when a full model reset happens (but not when a shape reset happens)
  public readonly resetEmitter = new Emitter();

  public constructor( optionsModel: QuadrilateralOptionsModel, tandem: Tandem ) {
    this.optionsModel = optionsModel;

    this.resetNotInProgressProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'resetNotInProgressProperty' )
    } );

    const smoothingLengthProperty = optionsModel.tangibleOptionsModel.smoothingLengthProperty;
    this.quadrilateralShapeModel = new QuadrilateralShapeModel( this.modelBounds, this.resetNotInProgressProperty, smoothingLengthProperty, {
      tandem: tandem.createTandem( 'quadrilateralShapeModel' )
    } );
    this.quadrilateralTestShapeModel = new QuadrilateralShapeModel( this.modelBounds, this.resetNotInProgressProperty, smoothingLengthProperty, {
      validateShape: false
    } );

    this.visibilityModel = new QuadrilateralVisibilityModel( tandem.createTandem( 'visibilityModel' ) );
    this.tangibleConnectionModel = new TangibleConnectionModel( this.quadrilateralShapeModel, this.optionsModel.tangibleOptionsModel, this.modelBounds, tandem.createTandem( 'tangibleConnectionModel' ) );

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

    // QuadrilateralVertex intervals are controlled whether we are "locked" to smaller steps, whether we are temporarily using
    // smaller steps because of a hotkey, or if running with ?reducedStepSize
    this.vertexIntervalProperty = new DerivedProperty(
      [ this.useMinorIntervalsProperty, this.tangibleConnectionModel.connectedToDeviceProperty, optionsModel.tangibleOptionsModel.deviceGridSpacingProperty ],
      ( useMinorIntervals, connectedToDevice, deviceGridSpacing ) => {
        return connectedToDevice ? deviceGridSpacing :
               QuadrilateralQueryParameters.reducedStepSize ? ( useMinorIntervals ? QuadrilateralConstants.MINOR_REDUCED_SIZE_VERTEX_INTERVAL : QuadrilateralConstants.MAJOR_REDUCED_SIZE_VERTEX_INTERVAL ) :
               useMinorIntervals ? QuadrilateralQueryParameters.minorVertexInterval : QuadrilateralQueryParameters.majorVertexInterval;
      }
    );
  }

  /**
   * Returns true if the vertex position is allowed. Sets the proposed vertex position to the test shape
   * and returns true if the scratch QuadrilateralShapeModel reports that it is in a valid position.
   */
  public isVertexPositionAllowed( vertex: QuadrilateralVertex, proposedPosition: Vector2 ): boolean {

    // set the proposed position to the scratch shape
    this.quadrilateralTestShapeModel.setFromShape( this.quadrilateralShapeModel );
    this.quadrilateralTestShapeModel.getLabelledVertex( vertex.vertexLabel ).positionProperty.set( proposedPosition );

    return this.quadrilateralTestShapeModel.isQuadrilateralShapeAllowed();
  }

  /**
   * Returns true if the two vertex positions are allowed for the quadrilateral.
   */
  public areVertexPositionsAllowed( vertex1: QuadrilateralVertex, vertex1ProposedPosition: Vector2, vertex2: QuadrilateralVertex, vertex2ProposedPosition: Vector2 ): boolean {

    // Set the test shape to the current value of the actual shape before proposed positions
    this.quadrilateralTestShapeModel.setFromShape( this.quadrilateralShapeModel );

    // Setting multiple vertex positions at once, we need to wait to call listeners until all values are ready
    this.quadrilateralTestShapeModel.setPropertiesDeferred( true );

    // set the proposed positions to the test quadrilateral without calling listeners
    const testVertex1 = this.quadrilateralTestShapeModel.getLabelledVertex( vertex1.vertexLabel );
    const testVertex2 = this.quadrilateralTestShapeModel.getLabelledVertex( vertex2.vertexLabel );

    testVertex1.positionProperty.set( vertex1ProposedPosition );
    testVertex2.positionProperty.set( vertex2ProposedPosition );

    // This will un-defer and call listeners for us
    this.quadrilateralTestShapeModel.setPropertiesDeferred( false );

    // REVIEW: Make isQuadrilateralShapeAllowed static
    return this.quadrilateralTestShapeModel.isQuadrilateralShapeAllowed();
  }

  /**
   * Resets the model.
   */
  public reset(): void {

    // reset is in progress (not-not in progress)
    this.resetNotInProgressProperty.value = false;

    this.visibilityModel.reset();
    this.lockToMinorIntervalsProperty.reset();
    this.shapeSoundEnabledProperty.reset();

    this.quadrilateralShapeModel.reset();
    this.quadrilateralTestShapeModel.reset();

    // Eagerly update the Properties that are set asynchronously, so we don't wait until
    // the next frame for these to be set after a reset.
    this.quadrilateralShapeModel.updateOrderDependentProperties();
    this.quadrilateralTestShapeModel.updateOrderDependentProperties();

    this.resetEmitter.emit();

    // reset is not in progress anymore
    this.resetNotInProgressProperty.value = true;
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

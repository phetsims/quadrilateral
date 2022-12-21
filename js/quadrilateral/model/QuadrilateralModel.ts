// Copyright 2021-2022, University of Colorado Boulder

/**
 * The base model class for Quadrilateral. Assembles all model components and responsible for managing Properties
 * that indicate the state of the whole Quadrilateral shape. Will probably also manage Properties that manage
 * the state of the Sim (UI element visibility and so on).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';
import Vertex from './Vertex.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import QuadrilateralPreferencesModel from './QuadrilateralPreferencesModel.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

class QuadrilateralModel {

  // The bounds in model space. The bounds will change depending on available screen bounds so that
  // on larger screens there is more model space to explore diferent shapes.
  public modelBoundsProperty: Property<Bounds2 | null>;

  // The Bounds provided by the physical model, so we know how to map the physical model bounds to the model space
  public physicalModelBoundsProperty: Property<Bounds2 | null>;

  // A transform that goes from tangible to virtual space. Used to set simulation vertex positions from
  // positions from position data provided by the physical device.
  // TODO: This should likely replace the physicalModelBoundsProperty and its mapping.
  public physicalToVirtualTransform: ModelViewTransform2 = ModelViewTransform2.createIdentity();

  // Whether a reset is currently in progress. Added for sound. If the model is actively resetting,
  // SoundManagers will disable so we don't play sounds for transient model states. It is a value for when
  // the reset is NOT in progress because that is most convenient to pass to SoundGenerator enableControlProperties.
  public resetNotInProgressProperty: TProperty<boolean>;

  // If true, the simulation is "calibrating" to a physical device so we don't set the vertex positions in response
  // to changes from the physical device. Instead we are updating physicalModelBounds.
  public isCalibratingProperty: TProperty<boolean>;

  // If true, a panel displaying model values will be added to the view. Only for debugging.
  public showDebugValuesProperty: TProperty<boolean>;

  // Whether or not a marker is detected for physical device rotation. This is used for OpenCV prototypes and
  // historically was used for prototypes using a marker detection library.
  // TODO: This is a candidate for removal prior to publishing the sim.
  public rotationMarkerDetectedProperty: TProperty<boolean>;

  // True when we are connected to a device in some way, either bluetooth, serial, or
  // opencv. This is mostly for data collection.
  public connectedToDeviceProperty: TProperty<boolean>;

  // Controls runtime preferences for the simulation.
  public readonly preferencesModel: QuadrilateralPreferencesModel;

  public readonly vertexIntervalProperty: TReadOnlyProperty<number>;

  // A Property that indicates that all markers are observed by the camera to control this simulation. Part of
  // a prototype for using OpenCV as an input method for the simulation
  public allVertexMarkersDetectedProperty: TReadOnlyProperty<boolean>;

  // Properties that indicate whether the OpenCV prototype detects an individual vertex. The tool must be able
  // to detect each vertex individually. The tool must be able to detect each marker individually for this to be
  // relevant.
  public vertexAMarkerDetectedProperty: TReadOnlyProperty<boolean>;
  public vertexBMarkerDetectedProperty: TReadOnlyProperty<boolean>;
  public vertexCMarkerDetectedProperty: TReadOnlyProperty<boolean>;
  public vertexDMarkerDetectedProperty: TReadOnlyProperty<boolean>;

  // A Property that controls whether Voicing responses will be enabled for when the OpenCV prototype changes in its
  // ability to see various markers.
  public readonly markerResponsesEnabledProperty: BooleanProperty;

  // The amount of rotation in radians of the tangible shape. This is used in OpenCV prototypes as well as historically
  // in old prototypes using a marker detection library.
  // TODO: Possibly remove this before publishing, this feature is not in use at the moment.
  public tangibleRotationProperty: NumberProperty;

  // Whether the angle guide graphics are visible at each vertex.
  public readonly markersVisibleProperty: BooleanProperty;

  // Whether labels on each vertex are visible.
  public readonly vertexLabelsVisibleProperty: BooleanProperty;

  // The available bounds for smooth vertex dragging (the model bounds eroded by the width of a vertex so a vertex
  // can never go ouside of the model bounds.
  public readonly vertexDragBoundsProperty: TReadOnlyProperty<Bounds2>;

  public readonly useMinorIntervalsProperty: BooleanProperty;

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

    this.connectedToDeviceProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'connectedToDeviceProperty' )
    } );

    this.modelBoundsProperty = new Property<Bounds2 | null>( null, {
      tandem: tandem.createTandem( 'modelBoundsProperty' ),
      phetioValueType: NullableIO( Bounds2.Bounds2IO )
    } );

    this.vertexDragBoundsProperty = new DerivedProperty( [ this.modelBoundsProperty ], ( bounds: Bounds2 | null ) => {
      if ( bounds ) {
        return bounds.eroded( Vertex.VERTEX_WIDTH / 2 );
      }
      else {

        // can drag anywhere until model bounds are initialiized
        return Bounds2.EVERYTHING;
      }
    } );

    this.physicalModelBoundsProperty = new Property<Bounds2 | null>( null, {
      tandem: tandem.createTandem( 'physicalModelBoundsProperty' ),
      phetioValueType: NullableIO( Bounds2.Bounds2IO )
    } );

    this.isCalibratingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isCalibratingProperty' )
    } );

    this.showDebugValuesProperty = new BooleanProperty( QuadrilateralQueryParameters.showModelValues );

    this.resetNotInProgressProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'resetNotInProgressProperty' )
    } );

    this.rotationMarkerDetectedProperty = new BooleanProperty( false );

    this.tangibleRotationProperty = new NumberProperty( 0 );

    this.allVertexMarkersDetectedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'allVertexMarkersDetectedProperty' )
    } );
    this.vertexAMarkerDetectedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'vertexAMarkerDetectedProperty' )
    } );
    this.vertexBMarkerDetectedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'vertexBMarkerDetectedProperty' )
    } );
    this.vertexCMarkerDetectedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'vertexCMarkerDetectedProperty' )
    } );
    this.vertexDMarkerDetectedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'vertexDMarkerDetectedProperty' )
    } );
    this.markerResponsesEnabledProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'markerResponsesEnabledProperty' )
    } );

    this.quadrilateralShapeModel = new QuadrilateralShapeModel( this, {
      tandem: tandem.createTandem( 'quadrilateralShapeModel' )
    } );

    this.quadrilateralTestShapeModel = new QuadrilateralShapeModel( this, {
      validateShape: false,
      tandem: tandem.createTandem( 'quadrilateralTestShapeModel' )
    } );

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

    this.useMinorIntervalsProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'useMinorIntervalsProperty' )
    } );

    // shift key pressed, connected to device, fine input spacing
    this.vertexIntervalProperty = new DerivedProperty(
      [ this.useMinorIntervalsProperty, preferencesModel.fineInputSpacingProperty, this.connectedToDeviceProperty, preferencesModel.deviceGridSpacingProperty ],
      ( useMinorIntervals, fineInputSpacing, connectedToDevice, deviceGridSpacing ) => {

        let interval: number;
        if ( connectedToDevice ) {
          interval = deviceGridSpacing;
        }
        else if ( fineInputSpacing ) {
          interval = useMinorIntervals ? QuadrilateralQueryParameters.minorFineVertexInterval : QuadrilateralQueryParameters.majorFineVertexInterval;
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
   * Set the physical model bounds from the device bounds. For now, we assume that the devices is like
   * one provided by CHROME lab, where sides are created from a socket and arm such that the largest length
   * of one side is when the arm is as far out of the socket as possible and the smallest length is when the
   * arm is fully inserted into the socket. In this case the smallest length will be half of the largest length.
   * When calibrating, we ask for the largest shape possible, so the minimum lengths are just half these
   * provided values. There is also an assumption that the sides are the same and the largest possible shape is a
   * square. We create a Bounds2 defined by these constraints
   *
   * TODO: The assumptions that all sides are the same length could be creating some weird cases.
   */
  public setPhysicalModelBounds( topLength: number, rightLength: number, bottomLength: number, leftLength: number ): void {

    // assuming a square shape for extrema - we may need a mapping function for each individual side if this cannot be assumed
    const maxLength = _.max( [ topLength, rightLength, bottomLength, leftLength ] )!;
    this.physicalModelBoundsProperty.value = new Bounds2( 0, 0, maxLength, maxLength );
  }

  /**
   * Create a transform that will go from tangible to virtual space. The scaling only uses one dimension because
   * we assume scaling should be the same in both x and y. It uses height as the limiting factor for scaling
   * because the simulation bounds are wider than they are tall.
   */
  public setPhysicalToVirtualTransform( width: number, height: number ): void {
    this.physicalToVirtualTransform = ModelViewTransform2.createSinglePointScaleMapping(
      new Vector2( width / 2, height / 2 ), // center of the physical space "model"
      new Vector2( 0, 0 ), // origin of the simulation model
      this.modelBoundsProperty.value!.height / ( height ) // scale from physical model to simulation space
    );
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
  public getClosestGridPosition( position: Vector2 ): Vector2 {

    const interval = this.vertexIntervalProperty.value;
    return new Vector2( Utils.roundToInterval( position.x, interval ), Utils.roundToInterval( position.y, interval ) );
  }
}

quadrilateral.register( 'QuadrilateralModel', QuadrilateralModel );
export default QuadrilateralModel;
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

class QuadrilateralModel {
  public modelBoundsProperty: Property<Bounds2 | null>;
  public physicalModelBoundsProperty: Property<Bounds2 | null>;
  public resetNotInProgressProperty: BooleanProperty;
  public isCalibratingProperty: BooleanProperty;
  public showDebugValuesProperty: BooleanProperty;
  public rotationMarkerDetectedProperty: BooleanProperty;
  public markerRotationProperty: NumberProperty;
  public cornerGuideVisibleProperty: BooleanProperty;
  public vertexLabelsVisibleProperty: BooleanProperty;

  public quadrilateralShapeModel: QuadrilateralShapeModel;
  public quadrilateralTestShapeModel: QuadrilateralShapeModel;

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {

    // The bounds in model space. The bounds will change depending on available screen bounds so that
    // on larger screens there is more model space to explore diferent shapes.
    this.modelBoundsProperty = new Property<Bounds2 | null>( null );

    // The Bounds provided by the physical model, so we know how to map the physical model bounds to the model space
    this.physicalModelBoundsProperty = new Property<Bounds2 | null>( null );

    // If true, the simulation is "calibrating" to a physical device so we don't set the vertex positions in response
    // to changes from the physical device. Instead we are updating physicalModelBounds.
    this.isCalibratingProperty = new BooleanProperty( false );

    // If true, a panel displaying model values will be added to the view. Only for debugging.
    this.showDebugValuesProperty = new BooleanProperty( QuadrilateralQueryParameters.showModelValues );

    // Whether or not a reset is currently in progress. Added for sound. If the model is actively resetting,
    // SoundManagers will disable so we don't play sounds for transient model states. It is a value for when
    // the reset is NOT in progress because that is most convenient to pass to SoundGenerator enableControlProperties.
    this.resetNotInProgressProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'resetNotInProgressProperty' )
    } );

    // Whether or not a marker is detected for physical device rotation. Only useful when used in
    // combination with the ?markerInput query parameter, which enables the experimental marker feature.
    this.rotationMarkerDetectedProperty = new BooleanProperty( false );

    // The amount of rotation in radians of the marker. Only useful when the ?markerInput
    // is used. This is an experimental feature that will support rotating the shape when
    // a marker is attached to the physical device.
    this.markerRotationProperty = new NumberProperty( 0 );

    // This is the centrail quadrilateral shape for the simulation.
    this.quadrilateralShapeModel = new QuadrilateralShapeModel( this, {
      tandem: tandem.createTandem( 'quadrilateralShapeModel' )
    } );

    // This quadrilateral is often used as a "scratch" where we test positions to make
    // sure they are valid before setting to the main quadrilateral.
    this.quadrilateralTestShapeModel = new QuadrilateralShapeModel( this, {
      validateShape: false,
      tandem: tandem.createTandem( 'quadrilateralTestShapeModel' )
    } );

    // Whether labels on each vertex are visible.
    this.vertexLabelsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'vertexLabelsVisibleProperty' )
    } );


    // Whether the angle guide graphics are visible at each vertex.
    this.cornerGuideVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'cornerGuideVisibleProperty' )
    } );

    if ( QuadrilateralQueryParameters.deviceConnection ) {

      // Put a reference to the simulation model on the window so that we can access it in wrappers that facilitate
      // communication between device and simulation.
      // @ts-ignore TODO: TypeScript doesn't allow us to do such hacky things (perhaps for good reason...)
      window.simModel = this;
    }
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
    const maxLength = _.max( [ topLength, rightLength, bottomLength, leftLength ] );
    this.physicalModelBoundsProperty.value = new Bounds2( 0, 0, maxLength!, maxLength! );
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
    this.quadrilateralShapeModel.updateDeferredProperties();

    // reset is not in progress anymore
    this.resetNotInProgressProperty.value = true;
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.quadrilateralShapeModel.step( dt );
  }
}

quadrilateral.register( 'QuadrilateralModel', QuadrilateralModel );
export default QuadrilateralModel;
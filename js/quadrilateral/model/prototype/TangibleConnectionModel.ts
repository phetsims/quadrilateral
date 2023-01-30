// Copyright 2023, University of Colorado Boulder

/**
 * A collection of Properties used for prototypes that connect this simulation to tangible devices.
 * While working on this sim, we collaborated with SLU to develop methods of communication between
 * simulation and several physical/tangible devices.
 *
 * TODO: List issues and references to documentation here.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import Property from '../../../../../axon/js/Property.js';
import TProperty from '../../../../../axon/js/TProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../../tandem/js/types/NullableIO.js';
import quadrilateral from '../../../quadrilateral.js';
import MarkerDetectionModel from './MarkerDetectionModel.js';

class TangibleConnectionModel {

  // True when we are connected to a device in some way, either bluetooth, serial, or OpenCV.
  public connectedToDeviceProperty: TProperty<boolean>;

  // Properties specifically related to marker detection from OpenCV prototypes.
  public markerDetectionModel: MarkerDetectionModel;

  // The Bounds provided by the physical model, so we know how to map the physical model coordinates to
  // simulation model space. Null until device size is known and provided during a calibration step.
  public physicalModelBoundsProperty: TProperty<Bounds2 | null>;

  // A transform that goes from tangible to virtual space. Used to set simulation vertex positions from
  // positions from position data provided by the physical device.
  // TODO: This should likely replace the physicalModelBoundsProperty and its mapping.
  public physicalToVirtualTransform = ModelViewTransform2.createIdentity();

  // If true, the simulation is currently "calibrating" to a physical device. During this phase, we are setting
  // the physicalModelBounds or the physicalToVirtualTransform.
  public isCalibratingProperty: TProperty<boolean>;

  // The bounds of simulation model space. Used to create transforms between physical device units and simulation
  // model space.
  private readonly modelBoundsProperty: TProperty<Bounds2 | null>;

  public constructor( modelBoundsProperty: TProperty<Bounds2 | null>, tandem: Tandem ) {

    this.connectedToDeviceProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'connectedToDeviceProperty' )
    } );

    this.physicalModelBoundsProperty = new Property<Bounds2 | null>( null, {
      tandem: tandem.createTandem( 'physicalModelBoundsProperty' ),
      phetioValueType: NullableIO( Bounds2.Bounds2IO )
    } );

    this.isCalibratingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isCalibratingProperty' )
    } );

    this.markerDetectionModel = new MarkerDetectionModel( tandem.createTandem( 'markerDetectionModel' ) );

    this.modelBoundsProperty = modelBoundsProperty;
  }

  /**
   * Set the physical model bounds from the device dimensions. For now, we assume that the device behaves like
   * one provided by CHROME lab, where sides are created from a socket and arm such that when the arm is fully extended
   * it will be twice as large as when it is fully collapsed. When calibrating, we ask for the largest shape possible,
   * so the minimum lengths are just half the provided values. There is also an assumption that the sides are the same
   * and the largest possible shape is a square.
   *
   * PROTOTYPE: These assumptions are specific to the device that we used to prototype, maybe create a more robust
   * calibration function if more devices are supported.
   */
  public setPhysicalModelBounds( topLength: number, rightLength: number, bottomLength: number, leftLength: number ): void {

    // assuming a square shape for extrema - we may need a mapping function for each individual side if this cannot be assumed
    const maxLength = _.max( [ topLength, rightLength, bottomLength, leftLength ] )!;
    this.physicalModelBoundsProperty.value = new Bounds2( 0, 0, maxLength, maxLength );
  }

  /**
   * Create a transform that can be used to transform between tangible and virtual space. The scaling only uses one
   * dimension because we assume scaling should be the same in both x and y. It uses height as the limiting factor for
   * scaling because the simulation bounds are wider than they are tall.
   *
   * PROTOTYPE: If we commit to this, we would want to look into a better solution that does not count on those
   * assumptions.
   */
  public setPhysicalToVirtualTransform( width: number, height: number ): void {
    this.physicalToVirtualTransform = ModelViewTransform2.createSinglePointScaleMapping(
      new Vector2( width / 2, height / 2 ), // center of the physical space "model"
      new Vector2( 0, 0 ), // origin of the simulation model
      this.modelBoundsProperty.value!.height / ( height ) // scale from physical model to simulation space
    );
  }
}

quadrilateral.register( 'TangibleConnectionModel', TangibleConnectionModel );
export default TangibleConnectionModel;

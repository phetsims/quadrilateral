// Copyright 2023, University of Colorado Boulder

/**
 * A model with Properties that indicate when certain markers are detected. This code is related to an application
 * of OpenCV where we detected colored squares (markers) to control the positions of vertices in this simulation.
 *
 * The prototype worked by creating a wrapper with the sim running in an iframe and using OpenCV (web) to detect
 * markers. The wrapper had access to the model and set these model Properties directly. As such, there are no
 * usages of them in simulation code. Those prototypes and more information can be found at
 * https://github.com/phetsims/quadrilateral/issues/20
 *
 * It is not clear whether this code should be kept since or if those prototypes will be shared publicly.
 * TODO: Are we keeping these? Perhaps we can delete them.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import TProperty from '../../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import quadrilateral from '../../../quadrilateral.js';

class MarkerDetectionModel {

  // Whether or not a marker is detected for physical device rotation. This is used for OpenCV prototypes.
  public rotationMarkerDetectedProperty: TProperty<boolean>;

  // The amount of rotation in radians of the tangible shape.
  public tangibleRotationProperty: TProperty<number>;

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
  // TODO: This in particular can probably be removed?
  public readonly markerResponsesEnabledProperty: TReadOnlyProperty<boolean>;

  public constructor( tandem: Tandem ) {
    this.rotationMarkerDetectedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'rotationMarkerDetectedProperty' )
    } );

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
  }
}

quadrilateral.register( 'MarkerDetectionModel', MarkerDetectionModel );
export default MarkerDetectionModel;

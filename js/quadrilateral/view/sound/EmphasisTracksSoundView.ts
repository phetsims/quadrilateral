// Copyright 2022-2023, University of Colorado Boulder

/**
 * In this design, all tracks play at once. Depending on the shape name, one or more of the tracks will have a higher
 * output level to emphasise a particular geometry.
 *
 * See https://github.com/phetsims/quadrilateral/issues/175#issuecomment-1201643077 for more information about this
 * design.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../../quadrilateral.js';
import TracksSoundView from './TracksSoundView.js';
import quadBeatTracksBuildingBaseRhythm_mp3 from '../../../../sounds/quadBeatTracksBuildingBaseRhythm_mp3.js';
import quadBeatTracksBuildingBuildingTracks000_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks000_mp3.js';
import quadBeatTracksBuildingBuildingTracks002_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks002_mp3.js';
import quadBeatTracksBuildingBuildingTracks003_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks003_mp3.js';
import quadBeatTracksBuildingBuildingTracks004_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks004_mp3.js';
import quadBeatTracksBuildingBuildingTracks005_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks005_mp3.js';
import quadBeatTracksBuildingBuildingTracks006_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks006_mp3.js';
import quadSimpleBuildingTracks004Trapezoid_mp3 from '../../../../sounds/quadSimpleBuildingTracks004Trapezoid_mp3.js';
import quadBaseBeatSimplerConcaveQuadrilateralJustRhythmV2_mp3 from '../../../../sounds/quadBaseBeatSimplerConcaveQuadrilateralJustRhythmV2_mp3.js';
import quadSimpleBuildingTracks006_mp3 from '../../../../sounds/quadSimpleBuildingTracks006_mp3.js';
import QuadrilateralShapeModel from '../../model/QuadrilateralShapeModel.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import NamedQuadrilateral from '../../model/NamedQuadrilateral.js';
import QuadrilateralSoundOptionsModel from '../../model/QuadrilateralSoundOptionsModel.js';
import Multilink from '../../../../../axon/js/Multilink.js';

// default output level for sound clips that are playing in the background behind the louder emphasized sound
const DEFAULT_BACKGROUND_OUTPUT_LEVEL = 0.15;

// All the sounds played in this sound design
const EMPHASIS_TRACKS = [
  quadBeatTracksBuildingBaseRhythm_mp3,
  quadBeatTracksBuildingBuildingTracks000_mp3,
  quadBeatTracksBuildingBuildingTracks005_mp3,
  quadBeatTracksBuildingBuildingTracks002_mp3,
  quadBeatTracksBuildingBuildingTracks003_mp3,
  quadBeatTracksBuildingBuildingTracks004_mp3,
  quadSimpleBuildingTracks004Trapezoid_mp3,
  quadBeatTracksBuildingBuildingTracks006_mp3,
  quadBaseBeatSimplerConcaveQuadrilateralJustRhythmV2_mp3,
  quadSimpleBuildingTracks006_mp3
];

// Each NamedQuadrilateral is assigned zero or more of the above tracks to play at a louder output level when the shape
// is in that state. Values of the map are indices of the sound files above that should play at a higher output level,
// according to the design in https://github.com/phetsims/quadrilateral/issues/175.
const NAMED_QUADRILATERAL_TO_HIGH_VOLUME_TRACKS_MAP = new Map( [
  [ NamedQuadrilateral.CONVEX_QUADRILATERAL, [ 0 ] ],
  [ NamedQuadrilateral.CONCAVE_QUADRILATERAL, [ 8 ] ],
  [ NamedQuadrilateral.TRIANGLE, [] ],
  [ NamedQuadrilateral.DART, [ 9 ] ],
  [ NamedQuadrilateral.KITE, [ 2 ] ],
  [ NamedQuadrilateral.TRAPEZOID, [ 1 ] ],
  [ NamedQuadrilateral.ISOSCELES_TRAPEZOID, [ 3 ] ],
  [ NamedQuadrilateral.PARALLELOGRAM, [ 4 ] ],
  [ NamedQuadrilateral.RHOMBUS, [ 5 ] ],
  [ NamedQuadrilateral.RECTANGLE, [ 6 ] ],
  [ NamedQuadrilateral.SQUARE, [ 7 ] ]
] );

class EmphasisTracksSoundView extends TracksSoundView {
  private readonly disposeEmphasisTracksSoundView: () => void;

  // The requested output levels for each SoundClip as shapes are detected. All of these are playing at once at the
  // provided output level while the "high volume tracks" play louder on top of them. See
  //https://github.com/phetsims/quadrilateral/issues/175#issuecomment-1400645437 for a list of these values.
  private readonly indexToBackgroundOutputLevelMap = new Map<number, number>( [
    [ 0, DEFAULT_BACKGROUND_OUTPUT_LEVEL ],
    [ 1, DEFAULT_BACKGROUND_OUTPUT_LEVEL * 2 ],
    [ 2, DEFAULT_BACKGROUND_OUTPUT_LEVEL ],
    [ 3, DEFAULT_BACKGROUND_OUTPUT_LEVEL ],
    [ 4, DEFAULT_BACKGROUND_OUTPUT_LEVEL ],
    [ 5, DEFAULT_BACKGROUND_OUTPUT_LEVEL ],
    [ 6, DEFAULT_BACKGROUND_OUTPUT_LEVEL / 2 ],
    [ 7, DEFAULT_BACKGROUND_OUTPUT_LEVEL ],
    [ 8, DEFAULT_BACKGROUND_OUTPUT_LEVEL ],
    [ 9, DEFAULT_BACKGROUND_OUTPUT_LEVEL ]
  ] );

  public constructor( shapeModel: QuadrilateralShapeModel, shapeSoundEnabledProperty: TReadOnlyProperty<boolean>, resetNotInProgressProperty: TReadOnlyProperty<boolean>, soundOptionsModel: QuadrilateralSoundOptionsModel ) {
    super( shapeModel, shapeSoundEnabledProperty, resetNotInProgressProperty, soundOptionsModel, EMPHASIS_TRACKS );

    // desired output levels for each sound (as requested by design after manually editing the gain)
    // See https://github.com/phetsims/quadrilateral/issues/175#issuecomment-1400645437
    this.indexToOutputLevelMap.set( 0, 0.75 );
    this.indexToOutputLevelMap.set( 1, 1 );
    this.indexToOutputLevelMap.set( 2, 0.8 );
    this.indexToOutputLevelMap.set( 3, 1 );
    this.indexToOutputLevelMap.set( 4, 1 );
    this.indexToOutputLevelMap.set( 5, 1 );
    this.indexToOutputLevelMap.set( 6, 0.5 );
    this.indexToOutputLevelMap.set( 7, 1 );
    this.indexToOutputLevelMap.set( 8, 1 );
    this.indexToOutputLevelMap.set( 9, 1 );

    const shapeNameListener = ( shapeName: NamedQuadrilateral ) => {

      // First, reduce all the sound clips to their background output level
      this.soundClips.forEach( ( soundClip, index ) => {
        soundClip.setOutputLevel( this.indexToBackgroundOutputLevelMap.get( index )! );
      } );

      // play the emphasized clips at their higher volume
      const tracksToEmphasize = NAMED_QUADRILATERAL_TO_HIGH_VOLUME_TRACKS_MAP.get( shapeName );
      assert && assert( tracksToEmphasize, 'NamedQuadrilateral does not have a EmphasisTracksSoundView design' );
      tracksToEmphasize!.forEach( index => {
        this.soundClips[ index ].setOutputLevel( this.indexToOutputLevelPropertyMap.get( index )!.value );
      } );
    };
    shapeModel.shapeNameProperty.link( shapeNameListener );

    const outputLevelProperties = Array.from( this.indexToOutputLevelPropertyMap.values() );
    const outputLevelMultilink = Multilink.multilinkAny( outputLevelProperties, () => {
      shapeNameListener( shapeModel.shapeNameProperty.value );
    } );

    this.disposeEmphasisTracksSoundView = () => {
      shapeModel.shapeNameProperty.unlink( shapeNameListener );
      outputLevelMultilink.dispose();
    };
  }

  public override dispose(): void {
    this.disposeEmphasisTracksSoundView();
    super.dispose();
  }
}

quadrilateral.register( 'EmphasisTracksSoundView', EmphasisTracksSoundView );
export default EmphasisTracksSoundView;
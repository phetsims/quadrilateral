// Copyright 2022, University of Colorado Boulder

/**
 * One of the "Tracks" sound designs. In this design, each track is assigned to a specific attribute of the shape
 * but builds toward more complex sounds as you reach a square. The square has the most pedagogically interesting
 * attributes of a quadrilateral even though it is the most basic shape, so it has the most complex sound design.
 *
 * See https://github.com/phetsims/quadrilateral/issues/175#issuecomment-1201643077 for more information about this
 * design.
 *
 * TODO: This will be renamed once a name is decided in https://github.com/phetsims/quadrilateral/issues/248
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../../quadrilateral.js';
import TracksSoundView from './TracksSoundView.js';
import quadBeatTracksBuildingBaseRhythm_mp3 from '../../../../sounds/quadBeatTracksBuildingBaseRhythm_mp3.js';
import quadBeatTracksBuildingBuildingTracks000_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks000_mp3.js';
import quadBeatTracksBuildingBuildingTracks001_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks001_mp3.js';
import quadBeatTracksBuildingBuildingTracks002_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks002_mp3.js';
import quadBeatTracksBuildingBuildingTracks003_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks003_mp3.js';
import quadBeatTracksBuildingBuildingTracks004_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks004_mp3.js';
import quadBeatTracksBuildingBuildingTracks005_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks005_mp3.js';
import quadBeatTracksBuildingBuildingTracks006_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks006_mp3.js';
import quadBaseBeatSimpler_mp3 from '../../../../sounds/quadBaseBeatSimpler_mp3.js';
import quadBaseBeatSimplerConcaveQuadrilateralJustRhythmV2_mp3 from '../../../../sounds/quadBaseBeatSimplerConcaveQuadrilateralJustRhythmV2_mp3.js';
import quadSimpleBuildingTracks007_mp3 from '../../../../sounds/quadSimpleBuildingTracks007_mp3.js';
import quadMelodyTracks004_mp3 from '../../../../sounds/quadMelodyTracks004_mp3.js';
import QuadrilateralShapeModel from '../../model/QuadrilateralShapeModel.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import NamedQuadrilateral from '../../model/NamedQuadrilateral.js';
import QuadrilateralSoundOptionsModel from '../../model/QuadrilateralSoundOptionsModel.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import Multilink from '../../../../../axon/js/Multilink.js';

// All the sounds played in this sound design.
const BUILD_UP_TRACKS = [
  quadBeatTracksBuildingBaseRhythm_mp3,
  quadBeatTracksBuildingBuildingTracks000_mp3,
  quadBeatTracksBuildingBuildingTracks001_mp3,
  quadBeatTracksBuildingBuildingTracks002_mp3,
  quadBeatTracksBuildingBuildingTracks003_mp3,
  quadBeatTracksBuildingBuildingTracks004_mp3,
  quadBeatTracksBuildingBuildingTracks005_mp3,
  quadBeatTracksBuildingBuildingTracks006_mp3
];

// All the sounds played in this sound design in the "simple" case.
const BUILD_UP_TRACKS_SIMPLE = [
  quadBaseBeatSimpler_mp3,
  quadBaseBeatSimplerConcaveQuadrilateralJustRhythmV2_mp3,
  quadBeatTracksBuildingBuildingTracks000_mp3,
  quadSimpleBuildingTracks007_mp3,
  quadBeatTracksBuildingBuildingTracks003_mp3,
  quadBeatTracksBuildingBuildingTracks004_mp3,
  quadMelodyTracks004_mp3,
  quadBeatTracksBuildingBuildingTracks005_mp3
];

// Each NamedQuadrilateral is assigned zero or more of the above tracks to play when the sim is in that state.
// Values of the map are indices of the sound files above that should play for each NamedQuadrilateral, according
// to the design in https://github.com/phetsims/quadrilateral/issues/175
const NAMED_QUADRILATERAL_TO_TRACKS_MAP = new Map( [
  [ NamedQuadrilateral.CONVEX_QUADRILATERAL, [ 0 ] ],
  [ NamedQuadrilateral.CONCAVE_QUADRILATERAL, [ 1 ] ],
  [ NamedQuadrilateral.TRIANGLE, [] ],
  [ NamedQuadrilateral.DART, [ 1, 2 ] ],
  [ NamedQuadrilateral.KITE, [ 0, 2 ] ],
  [ NamedQuadrilateral.TRAPEZOID, [ 0, 4 ] ],
  [ NamedQuadrilateral.ISOSCELES_TRAPEZOID, [ 0, 4, 3 ] ],
  [ NamedQuadrilateral.PARALLELOGRAM, [ 0, 5 ] ],
  [ NamedQuadrilateral.RHOMBUS, [ 0, 2, 5, 6 ] ],
  [ NamedQuadrilateral.RECTANGLE, [ 0, 3, 5, 7 ] ],
  [ NamedQuadrilateral.SQUARE, [ 0, 2, 3, 5, 6, 7 ] ]
] );

type TracksBuildUpSoundViewOptions = {

  // If true, use the "simple" tracks instead of the default BUILD_UP_TRACKS
  simple: boolean;
};

class TracksBuildUpSoundView extends TracksSoundView {
  private readonly disposeTracksBuildUpSoundView: () => void;

  public constructor( shapeModel: QuadrilateralShapeModel, shapeSoundEnabledProperty: TReadOnlyProperty<boolean>, resetNotInProgressProperty: TReadOnlyProperty<boolean>, soundOptionsModel: QuadrilateralSoundOptionsModel, providedOptions?: TracksBuildUpSoundViewOptions ) {

    const options = optionize<TracksBuildUpSoundViewOptions>()( {
      simple: false
    }, providedOptions );

    const tracks = options.simple ? BUILD_UP_TRACKS_SIMPLE : BUILD_UP_TRACKS;
    super( shapeModel, shapeSoundEnabledProperty, resetNotInProgressProperty, soundOptionsModel, tracks );

    const shapeNameListener = ( shapeName: NamedQuadrilateral ) => {

      // First set all output levels back to nothing before we start playing new sounds
      this.soundClips.forEach( soundClip => {
        soundClip.setOutputLevel( 0 );
      } );

      const soundIndicesToPlay = NAMED_QUADRILATERAL_TO_TRACKS_MAP.get( shapeName );
      assert && assert( soundIndicesToPlay, 'NamedQuadrilateral does not have a TracksBuildUpSoundView design' );
      soundIndicesToPlay!.forEach( index => {
        this.soundClips[ index ].setOutputLevel( this.indexToOutputLevelPropertyMap.get( index )!.value );
      } );
    };
    shapeModel.shapeNameProperty.link( shapeNameListener );

    const outputLevelProperties = Array.from( this.indexToOutputLevelPropertyMap.values() );
    const outputLevelMultilink = Multilink.multilinkAny( outputLevelProperties, () => {
      shapeNameListener( shapeModel.shapeNameProperty.value );
    } );

    this.disposeTracksBuildUpSoundView = () => {
      shapeModel.shapeNameProperty.unlink( shapeNameListener );
      outputLevelMultilink.dispose();
    };
  }

  public override dispose(): void {
    this.disposeTracksBuildUpSoundView();
    super.dispose();
  }
}

quadrilateral.register( 'TracksBuildUpSoundView', TracksBuildUpSoundView );
export default TracksBuildUpSoundView;
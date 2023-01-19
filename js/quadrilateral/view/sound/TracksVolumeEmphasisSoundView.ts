// Copyright 2022, University of Colorado Boulder

/**
 * One of the "Tracks" sound designs. In this design, each track is always playing. Depending on the named shape
 * of the quadrilateral, one or more of the tracks will have a higher output level. But in this design all sounds
 * will be playing when the sound view is generating soound.
 *
 * See https://github.com/phetsims/quadrilateral/issues/175#issuecomment-1201643077 for more information about this
 * design.
 *
 * TODO: This will be renamed once a name is decided in https://github.com/phetsims/quadrilateral/issues/248
 * TODO: After https://github.com/phetsims/quadrilateral/issues/328, a single sound is played, this is no longer a layer
 * of sound. Rename this design if #328 changes are kept.
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
import quadBaseBeatSimple_mp3 from '../../../../sounds/quadBaseBeatSimple_mp3.js';
import quadMelodyTracks001_mp3 from '../../../../sounds/quadMelodyTracks001_mp3.js';
import quadMelodyTracks004_mp3 from '../../../../sounds/quadMelodyTracks004_mp3.js';
import QuadrilateralShapeModel from '../../model/QuadrilateralShapeModel.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import NamedQuadrilateral from '../../model/NamedQuadrilateral.js';
import QuadrilateralSoundOptionsModel from '../../model/QuadrilateralSoundOptionsModel.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import QuadrilateralConstants from '../../../common/QuadrilateralConstants.js';

// All the sounds played in this sound design
const VOLUME_EMPHASIS_TRACKS = [
  quadBeatTracksBuildingBaseRhythm_mp3,
  quadBeatTracksBuildingBuildingTracks000_mp3,
  quadMelodyTracks004_mp3, // requested for KITE on 8/19/22 instead of buildingTracks001
  quadBeatTracksBuildingBuildingTracks002_mp3,
  quadBeatTracksBuildingBuildingTracks003_mp3,
  quadBeatTracksBuildingBuildingTracks004_mp3,
  quadBeatTracksBuildingBuildingTracks005_mp3,
  quadBeatTracksBuildingBuildingTracks006_mp3,
  quadBaseBeatSimple_mp3,
  quadMelodyTracks001_mp3 // requested for DART on 8/18/22
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

class TracksVolumeEmphasisSoundView extends TracksSoundView {
  private readonly disposeTracksVolumeEmphasisSoundView: () => void;

  public constructor( shapeModel: QuadrilateralShapeModel, shapeSoundEnabledProperty: TReadOnlyProperty<boolean>, resetNotInProgressProperty: TReadOnlyProperty<boolean>, soundOptionsModel: QuadrilateralSoundOptionsModel ) {
    super( shapeModel, shapeSoundEnabledProperty, resetNotInProgressProperty, soundOptionsModel, VOLUME_EMPHASIS_TRACKS );

    // For each SoundClip, set up a Property that will control its output level. To be used by the sim sound board,
    // only for development. TODO This feature should be removed after design is complete.
    this.soundClips.forEach( ( soundClip, i ) => {
      const outputLevelProperty = new NumberProperty( 1, { range: QuadrilateralConstants.OUTPUT_LEVEL_RANGE } );
      this.indexToOutputLevelPropertyMap.set( i, outputLevelProperty );
    } );

    const shapeNameListener = ( shapeName: NamedQuadrilateral ) => {

      // First, reduce all the sound clips output
      this.soundClips.forEach( soundClip => {
        soundClip.setOutputLevel( 0 );
      } );

      const tracksToEmphasize = NAMED_QUADRILATERAL_TO_HIGH_VOLUME_TRACKS_MAP.get( shapeName );
      assert && assert( tracksToEmphasize, 'NamedQuadrilateral does not have a TracksVolumeEmphasisSoundView design' );
      tracksToEmphasize!.forEach( index => {
        this.soundClips[ index ].setOutputLevel( this.indexToOutputLevelPropertyMap.get( index )!.value );
      } );
    };
    shapeModel.shapeNameProperty.link( shapeNameListener );

    const outputLevelProperties = Array.from( this.indexToOutputLevelPropertyMap.values() );
    const outputLevelMultilink = Multilink.multilinkAny( outputLevelProperties, () => {
      shapeNameListener( shapeModel.shapeNameProperty.value );
    } );

    this.disposeTracksVolumeEmphasisSoundView = () => {
      shapeModel.shapeNameProperty.unlink( shapeNameListener );
      outputLevelMultilink.dispose();
    };
  }

  public override dispose(): void {
    this.disposeTracksVolumeEmphasisSoundView();
    super.dispose();
  }
}

quadrilateral.register( 'TracksVolumeEmphasisSoundView', TracksVolumeEmphasisSoundView );
export default TracksVolumeEmphasisSoundView;
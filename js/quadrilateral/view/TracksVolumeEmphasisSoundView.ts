// Copyright 2022, University of Colorado Boulder

/**
 * One of the "Tracks" sound designs. In this design, each track is always playing. Depending on the named shape
 * of the quadrilateral, one or more of the tracks will have a higher output level. But in this design all sounds
 * will be playing when the sound view is generating soound.
 *
 * See https://github.com/phetsims/quadrilateral/issues/175#issuecomment-1201643077 for more information about this
 * design.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import TracksSoundView from './TracksSoundView.js';
import quadBeatTracksBuildingBaseRhythm_mp3 from '../../../sounds/quadBeatTracksBuildingBaseRhythm_mp3.js';
import quadBeatTracksBuildingBuildingTracks000_mp3 from '../../../sounds/quadBeatTracksBuildingBuildingTracks000_mp3.js';
import quadBeatTracksBuildingBuildingTracks001_mp3 from '../../../sounds/quadBeatTracksBuildingBuildingTracks001_mp3.js';
import quadBeatTracksBuildingBuildingTracks002_mp3 from '../../../sounds/quadBeatTracksBuildingBuildingTracks002_mp3.js';
import quadBeatTracksBuildingBuildingTracks003_mp3 from '../../../sounds/quadBeatTracksBuildingBuildingTracks003_mp3.js';
import quadBeatTracksBuildingBuildingTracks004_mp3 from '../../../sounds/quadBeatTracksBuildingBuildingTracks004_mp3.js';
import quadBeatTracksBuildingBuildingTracks005_mp3 from '../../../sounds/quadBeatTracksBuildingBuildingTracks005_mp3.js';
import quadBeatTracksBuildingBuildingTracks006_mp3 from '../../../sounds/quadBeatTracksBuildingBuildingTracks006_mp3.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';

// All the sounds played in this sound design
const VOLUME_EMPHASIS_TRACKS = [
  quadBeatTracksBuildingBaseRhythm_mp3,
  quadBeatTracksBuildingBuildingTracks000_mp3,
  quadBeatTracksBuildingBuildingTracks001_mp3,
  quadBeatTracksBuildingBuildingTracks002_mp3,
  quadBeatTracksBuildingBuildingTracks003_mp3,
  quadBeatTracksBuildingBuildingTracks004_mp3,
  quadBeatTracksBuildingBuildingTracks005_mp3,
  quadBeatTracksBuildingBuildingTracks006_mp3
];

// Each NamedQuadrilateral is assigned zero or more of the above tracks to play at a louder output level when the shape
// is in that state. Values of the map are indices of the sound files above that should play at a higher output level,
// according to the design in https://github.com/phetsims/quadrilateral/issues/175.
const NAMED_QUADRILATERAL_TO_HIGH_VOLUME_TRACKS_MAP = new Map( [
  [ NamedQuadrilateral.CONVEX_QUADRILATERAL, [ 0 ] ],
  [ NamedQuadrilateral.CONCAVE_QUADRILATERAL, [] ], // no emphasis
  [ NamedQuadrilateral.DART, [] ], // no emphasis
  [ NamedQuadrilateral.KITE, [ 1 ] ],
  [ NamedQuadrilateral.TRAPEZOID, [ 2 ] ],
  [ NamedQuadrilateral.ISOSCELES_TRAPEZOID, [ 3 ] ],
  [ NamedQuadrilateral.PARALLELOGRAM, [ 4 ] ],
  [ NamedQuadrilateral.RHOMBUS, [ 5 ] ],
  [ NamedQuadrilateral.RECTANGLE, [ 6 ] ],
  [ NamedQuadrilateral.SQUARE, [ 7 ] ]
] );

class TracksVolumeEmphasisSoundView extends TracksSoundView {
  public constructor( shapeModel: QuadrilateralShapeModel, resetNotInProgressProperty: IReadOnlyProperty<boolean>, soundOptionsModel: QuadrilateralSoundOptionsModel ) {
    super( shapeModel, resetNotInProgressProperty, soundOptionsModel, VOLUME_EMPHASIS_TRACKS );

    const shapeNameListener = ( shapeName: NamedQuadrilateral ) => {

      // First, reduce all the sound clips to a background output level
      this.soundClips.forEach( soundClip => {
        soundClip.setOutputLevel( 0.15 );
      } );

      const tracksToEmphasize = NAMED_QUADRILATERAL_TO_HIGH_VOLUME_TRACKS_MAP.get( shapeName );
      assert && assert( tracksToEmphasize, 'NamedQuadrilateral does not have a TracksVolumeEmphasisSoundView design' );
      tracksToEmphasize!.forEach( index => {
        this.soundClips[ index ].setOutputLevel( 1 );
      } );
    };
    shapeModel.shapeNameProperty.link( shapeNameListener );


  }
}

quadrilateral.register( 'TracksVolumeEmphasisSoundView', TracksVolumeEmphasisSoundView );
export default TracksVolumeEmphasisSoundView;
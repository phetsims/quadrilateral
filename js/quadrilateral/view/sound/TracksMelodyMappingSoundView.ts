// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../../quadrilateral.js';
import TracksSoundView from './TracksSoundView.js';
import QuadrilateralSoundOptionsModel from '../../model/QuadrilateralSoundOptionsModel.js';
import QuadrilateralShapeModel from '../../model/QuadrilateralShapeModel.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import NamedQuadrilateral from '../../model/NamedQuadrilateral.js';
import quadBeatTracksBuildingBuildingTracks000_mp3 from '../../../../sounds/quadBeatTracksBuildingBuildingTracks000_mp3.js';
import quadMelodyTracksBaseMusic_mp3 from '../../../../sounds/quadMelodyTracksBaseMusic_mp3.js';
import quadMelodyTracks000_mp3 from '../../../../sounds/quadMelodyTracks000_mp3.js';
import quadSimplerMelodyTracksBaseMusic_mp3 from '../../../../sounds/quadSimplerMelodyTracksBaseMusic_mp3.js';
import quadSimplerMelodyTracks000_mp3 from '../../../../sounds/quadSimplerMelodyTracks000_mp3.js';
import quadSimplerMelodyTracks001_mp3 from '../../../../sounds/quadSimplerMelodyTracks001_mp3.js';
import quadSimplerMelodyTracks002_mp3 from '../../../../sounds/quadSimplerMelodyTracks002_mp3.js';
import quadSimplerMelodyTracks003_mp3 from '../../../../sounds/quadSimplerMelodyTracks003_mp3.js';
import quadSimplerMelodyTracks004_mp3 from '../../../../sounds/quadSimplerMelodyTracks004_mp3.js';
import quadSimplerMelodyTracks005_mp3 from '../../../../sounds/quadSimplerMelodyTracks005_mp3.js';

// All the sounds played in this sound design
const MELODY_MAPPING_TRACKS = [
  quadBeatTracksBuildingBuildingTracks000_mp3, // 0
  quadMelodyTracksBaseMusic_mp3, // 1
  quadMelodyTracks000_mp3, // 2
  quadSimplerMelodyTracksBaseMusic_mp3, // 3
  quadSimplerMelodyTracks000_mp3, // 4
  quadSimplerMelodyTracks001_mp3, // 5
  quadSimplerMelodyTracks002_mp3, // 6
  quadSimplerMelodyTracks003_mp3, // 7
  quadSimplerMelodyTracks004_mp3, // 8
  quadSimplerMelodyTracks005_mp3 // 9
];

const NAMED_QUADRILATERAL_TO_TRACKS_MAP = new Map( [
  [ NamedQuadrilateral.CONVEX_QUADRILATERAL, [ 3 ] ],
  [ NamedQuadrilateral.CONCAVE_QUADRILATERAL, [ 0 ] ],
  [ NamedQuadrilateral.DART, [ 1, 2 ] ],
  [ NamedQuadrilateral.KITE, [ 3, 4 ] ],
  [ NamedQuadrilateral.TRAPEZOID, [ 3, 9 ] ],
  [ NamedQuadrilateral.ISOSCELES_TRAPEZOID, [ 3, 9 ] ],
  [ NamedQuadrilateral.PARALLELOGRAM, [ 3, 8 ] ],
  [ NamedQuadrilateral.RHOMBUS, [ 3, 7 ] ],
  [ NamedQuadrilateral.RECTANGLE, [ 3, 6 ] ],
  [ NamedQuadrilateral.SQUARE, [ 3, 5 ] ]
] );

class TracksMelodyMappingSoundView extends TracksSoundView {
  private readonly disposeTracksMelodyMappingSoundView: () => void;

  public constructor( shapeModel: QuadrilateralShapeModel, shapeSoundEnabledProperty: TReadOnlyProperty<boolean>, resetNotInProgressProperty: TReadOnlyProperty<boolean>, soundOptionsModel: QuadrilateralSoundOptionsModel ) {
    super( shapeModel, shapeSoundEnabledProperty, resetNotInProgressProperty, soundOptionsModel, MELODY_MAPPING_TRACKS );

    const shapeNameListener = ( shapeName: NamedQuadrilateral ) => {

      // First set all output levels back to nothing before we start playing new sounds
      this.soundClips.forEach( soundClip => {
        soundClip.setOutputLevel( 0 );
      } );

      const soundIndicesToPlay = NAMED_QUADRILATERAL_TO_TRACKS_MAP.get( shapeName );
      assert && assert( soundIndicesToPlay, 'NamedQuadrilateral does not have a TracksMelodySoundView design' );
      soundIndicesToPlay!.forEach( index => {
        this.soundClips[ index ].setOutputLevel( 1 );
      } );
    };
    shapeModel.shapeNameProperty.link( shapeNameListener );

    this.disposeTracksMelodyMappingSoundView = () => {
      shapeModel.shapeNameProperty.unlink( shapeNameListener );
    };
  }

  public override dispose(): void {
    this.disposeTracksMelodyMappingSoundView();
    super.dispose();
  }
}

quadrilateral.register( 'TracksMelodyMappingSoundView', TracksMelodyMappingSoundView );
export default TracksMelodyMappingSoundView;

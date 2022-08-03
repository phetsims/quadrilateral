// Copyright 2022, University of Colorado Boulder

/**
 * One of the "Tracks" sound designs. In this design, each track is assigned to a specific attribute of the shape
 * but builds toward more complex sounds as you reach a square. The square has the most pedagogically interesting
 * attributes of a quadrilateral even though it is the most basic shape, so it has the most complex sound design.
 * A series of sounds is looped that form an arpeggio. An additional note in the arpeggio is played as we get
 * closer to the attributes of a square.
 *
 * See https://github.com/phetsims/quadrilateral/issues/175#issuecomment-1201643077 for more information about this
 * design.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../../quadrilateral.js';
import TracksSoundView from './TracksSoundView.js';
import QuadrilateralShapeModel from '../../model/QuadrilateralShapeModel.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import NamedQuadrilateral from '../../model/NamedQuadrilateral.js';
import QuadrilateralSoundOptionsModel from '../../model/QuadrilateralSoundOptionsModel.js';
import quadBuildingUpArpeggio000_mp3 from '../../../../sounds/quadBuildingUpArpeggio000_mp3.js';
import quadBuildingUpArpeggio001_mp3 from '../../../../sounds/quadBuildingUpArpeggio001_mp3.js';
import quadBuildingUpArpeggio002_mp3 from '../../../../sounds/quadBuildingUpArpeggio002_mp3.js';
import quadBuildingUpArpeggio003_mp3 from '../../../../sounds/quadBuildingUpArpeggio003_mp3.js';
import quadBuildingUpArpeggio004_mp3 from '../../../../sounds/quadBuildingUpArpeggio004_mp3.js';
import quadBuildingUpArpeggio005_mp3 from '../../../../sounds/quadBuildingUpArpeggio005_mp3.js';
import quadBuildingUpArpeggio006_mp3 from '../../../../sounds/quadBuildingUpArpeggio006_mp3.js';
import quadBuildingUpArpeggio007_mp3 from '../../../../sounds/quadBuildingUpArpeggio007_mp3.js';

// All the sounds played in this sound design
// TODO: We are missing "optional" tracks in https://github.com/phetsims/quadrilateral/issues/175#issuecomment-1201643077
const ARPEGGIO_TRACKS = [
  quadBuildingUpArpeggio000_mp3,
  quadBuildingUpArpeggio001_mp3,
  quadBuildingUpArpeggio002_mp3,
  quadBuildingUpArpeggio003_mp3,
  quadBuildingUpArpeggio004_mp3,
  quadBuildingUpArpeggio005_mp3,
  quadBuildingUpArpeggio006_mp3,
  quadBuildingUpArpeggio007_mp3
];

// Each NamedQuadrilateral is assigned zero or more of the above tracks to play when the sim is in that state.
// Values of the map are indices of the sound files above that should play for each NamedQuadrilateral, according
// to the "Arpeggio" design in https://github.com/phetsims/quadrilateral/issues/175
const NAMED_QUADRILATERAL_TO_TRACKS_MAP = new Map( [
  [ NamedQuadrilateral.CONVEX_QUADRILATERAL, [] ],
  [ NamedQuadrilateral.CONCAVE_QUADRILATERAL, [] ],
  [ NamedQuadrilateral.DART, [ 0 ] ],
  [ NamedQuadrilateral.KITE, [ 0, 1 ] ],
  [ NamedQuadrilateral.TRAPEZOID, [ 0, 1, 2 ] ],
  [ NamedQuadrilateral.ISOSCELES_TRAPEZOID, [ 0, 1, 2, 3 ] ],
  [ NamedQuadrilateral.PARALLELOGRAM, [ 0, 1, 2, 3, 4 ] ],
  [ NamedQuadrilateral.RHOMBUS, [ 0, 1, 2, 3, 4, 5 ] ],
  [ NamedQuadrilateral.RECTANGLE, [ 0, 1, 2, 3, 4, 5, 6 ] ],
  [ NamedQuadrilateral.SQUARE, [ 0, 1, 2, 3, 4, 5, 6, 7 ] ]
] );

class TracksArpeggioSoundView extends TracksSoundView {
  private readonly disposeTracksArpeggioSoundView: () => void;

  public constructor( shapeModel: QuadrilateralShapeModel, resetNotInProgressProperty: IReadOnlyProperty<boolean>, soundOptionsModel: QuadrilateralSoundOptionsModel ) {
    super( shapeModel, resetNotInProgressProperty, soundOptionsModel, ARPEGGIO_TRACKS );

    const shapeNameListener = ( shapeName: NamedQuadrilateral ) => {

      // First set all output levels back to nothing before we start playing new sounds
      this.soundClips.forEach( soundClip => {
        soundClip.setOutputLevel( 0 );
      } );

      const soundIndicesToPlay = NAMED_QUADRILATERAL_TO_TRACKS_MAP.get( shapeName );
      assert && assert( soundIndicesToPlay, 'NamedQuadrilateral does not have a TracksArpeggioSoundView design' );
      soundIndicesToPlay!.forEach( index => {
        this.soundClips[ index ].setOutputLevel( 1 );
      } );
    };
    shapeModel.shapeNameProperty.link( shapeNameListener );

    this.disposeTracksArpeggioSoundView = () => {
      shapeModel.shapeNameProperty.unlink( shapeNameListener );
    };
  }

  public override dispose(): void {
    this.disposeTracksArpeggioSoundView();
    super.dispose();
  }
}

quadrilateral.register( 'TracksArpeggioSoundView', TracksArpeggioSoundView );
export default TracksArpeggioSoundView;
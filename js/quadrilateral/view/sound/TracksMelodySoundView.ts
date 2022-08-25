// Copyright 2022, University of Colorado Boulder

/**
 * One of the "Tracks" sound designs. In this design, a "base" melody always plays while an additional melody plays
 * on top of the base track which is from the state of the quadrilateral.
 *
 * See https://github.com/phetsims/quadrilateral/issues/175#issuecomment-1201643077 for more information about this
 * design.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../../quadrilateral.js';
import TracksSoundView from './TracksSoundView.js';
import QuadrilateralShapeModel from '../../model/QuadrilateralShapeModel.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import NamedQuadrilateral from '../../model/NamedQuadrilateral.js';
import QuadrilateralSoundOptionsModel from '../../model/QuadrilateralSoundOptionsModel.js';
import quadMelodyTracks000_mp3 from '../../../../sounds/quadMelodyTracks000_mp3.js';
import quadMelodyTracks001_mp3 from '../../../../sounds/quadMelodyTracks001_mp3.js';
import quadMelodyTracks002_mp3 from '../../../../sounds/quadMelodyTracks002_mp3.js';
import quadMelodyTracks003_mp3 from '../../../../sounds/quadMelodyTracks003_mp3.js';
import quadMelodyTracks004_mp3 from '../../../../sounds/quadMelodyTracks004_mp3.js';
import quadMelodyTracks005_mp3 from '../../../../sounds/quadMelodyTracks005_mp3.js';
import quadMelodyTracksBaseMusic_mp3 from '../../../../sounds/quadMelodyTracksBaseMusic_mp3.js';
import quadSimplerMelodyTracks000_mp3 from '../../../../sounds/quadSimplerMelodyTracks000_mp3.js';
import quadSimplerMelodyTracks001_mp3 from '../../../../sounds/quadSimplerMelodyTracks001_mp3.js';
import quadSimplerMelodyTracks002_mp3 from '../../../../sounds/quadSimplerMelodyTracks002_mp3.js';
import quadSimplerMelodyTracks003_mp3 from '../../../../sounds/quadSimplerMelodyTracks003_mp3.js';
import quadSimplerMelodyTracks004_mp3 from '../../../../sounds/quadSimplerMelodyTracks004_mp3.js';
import quadSimplerMelodyTracks005_mp3 from '../../../../sounds/quadSimplerMelodyTracks005_mp3.js';
import quadSimplerMelodyTracksBaseMusic_mp3 from '../../../../sounds/quadSimplerMelodyTracksBaseMusic_mp3.js';
import optionize from '../../../../../phet-core/js/optionize.js';

// All the sounds played in this sound design
const MELODY_TRACKS = [
  quadMelodyTracksBaseMusic_mp3,
  quadMelodyTracks000_mp3,
  quadMelodyTracks001_mp3,
  quadMelodyTracks002_mp3,
  quadMelodyTracks003_mp3,
  quadMelodyTracks004_mp3,
  quadMelodyTracks005_mp3
];

const SIMPLE_MELODY_TRACKS = [
  quadSimplerMelodyTracksBaseMusic_mp3,
  quadSimplerMelodyTracks000_mp3,
  quadSimplerMelodyTracks001_mp3,
  quadSimplerMelodyTracks002_mp3,
  quadSimplerMelodyTracks003_mp3,
  quadSimplerMelodyTracks004_mp3,
  quadSimplerMelodyTracks005_mp3
];

// Each NamedQuadrilateral is assigned zero or more of the above tracks to play when the shape is that named
// quadrilateral. Values of the map are indices of the sound files above that should play for each NamedQuadrilateral,
// in addition to the base sound according to the design in https://github.com/phetsims/quadrilateral/issues/175
const NAMED_QUADRILATERAL_TO_TRACKS_MAP = new Map( [
  [ NamedQuadrilateral.CONVEX_QUADRILATERAL, [] ],
  [ NamedQuadrilateral.CONCAVE_QUADRILATERAL, [] ],
  [ NamedQuadrilateral.DART, [ 1 ] ],
  [ NamedQuadrilateral.KITE, [ 1 ] ],
  [ NamedQuadrilateral.TRAPEZOID, [ 6 ] ],
  [ NamedQuadrilateral.ISOSCELES_TRAPEZOID, [ 6 ] ],
  [ NamedQuadrilateral.PARALLELOGRAM, [ 5 ] ],
  [ NamedQuadrilateral.RHOMBUS, [ 4 ] ],
  [ NamedQuadrilateral.RECTANGLE, [ 3 ] ],
  [ NamedQuadrilateral.SQUARE, [ 2 ] ]
] );

type TracksMelodySoundViewOptions = {
  simple: boolean;
};

class TracksMelodySoundView extends TracksSoundView {
  private readonly disposeTracksMelodySoundView: () => void;

  public constructor( shapeModel: QuadrilateralShapeModel, simSoundEnabledProperty: TReadOnlyProperty<boolean>, resetNotInProgressProperty: TReadOnlyProperty<boolean>, soundOptionsModel: QuadrilateralSoundOptionsModel, providedOptions?: TracksMelodySoundViewOptions ) {

    const options = optionize<TracksMelodySoundViewOptions>()( {
      simple: false
    }, providedOptions );

    const tracks = options.simple ? SIMPLE_MELODY_TRACKS : MELODY_TRACKS;
    super( shapeModel, simSoundEnabledProperty, resetNotInProgressProperty, soundOptionsModel, tracks );

    const shapeNameListener = ( shapeName: NamedQuadrilateral ) => {

      // First set all output levels back to nothing before we start playing new sounds
      this.soundClips.forEach( soundClip => {
        soundClip.setOutputLevel( 0 );
      } );

      // the base sound always plays in this design, but at a lower volume see
      // https://github.com/phetsims/quadrilateral/issues/175#issuecomment-1212025691
      this.soundClips[ 0 ].setOutputLevel( 0.25 );

      const soundIndicesToPlay = NAMED_QUADRILATERAL_TO_TRACKS_MAP.get( shapeName );
      assert && assert( soundIndicesToPlay, 'NamedQuadrilateral does not have a TracksMelodySoundView design' );
      soundIndicesToPlay!.forEach( index => {
        this.soundClips[ index ].setOutputLevel( 1 );
      } );
    };
    shapeModel.shapeNameProperty.link( shapeNameListener );

    this.disposeTracksMelodySoundView = () => {
      shapeModel.shapeNameProperty.unlink( shapeNameListener );
    };
  }

  public override dispose(): void {
    this.disposeTracksMelodySoundView();
    super.dispose();
  }
}

quadrilateral.register( 'TracksMelodySoundView', TracksMelodySoundView );
export default TracksMelodySoundView;
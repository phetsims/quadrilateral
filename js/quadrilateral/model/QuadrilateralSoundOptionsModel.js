// Copyright 2021, University of Colorado Boulder

/**
 * A model for the sound designs that are being proposed for Quadrilateral. In active development and we are
 * iterating on all of these. Different sound designs can be tested from the Preferences Dialog in the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import quadLoop01Sound from '../../../sounds/quad-loop-01_mp3.js';
import quadLoop02Sound from '../../../sounds/quad-loop-02_mp3.js';
import quadLoop03Sound from '../../../sounds/quad-loop-03_mp3.js';
import quadLoop04Sound from '../../../sounds/quad-loop-04_mp3.js';
import quadrilateral from '../../quadrilateral.js';

// constants
// Enumeration for named sound designs, each with their own options and parameters
const SoundDesign = Enumeration.byKeys( [ 'QUARTET', 'PARALLELS_VOLUME', 'PARALLELS_STACCATO' ] );

const QuartetSoundFile = Enumeration.byKeys( [ 'ONE', 'TWO', 'THREE', 'FOUR' ] );

// Maps soundFileProperty to the WrappedAudioBuffer for the SoundClip
const AUDIO_BUFFER_MAP = new Map();
AUDIO_BUFFER_MAP.set( QuartetSoundFile.ONE, quadLoop01Sound );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.TWO, quadLoop02Sound );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.THREE, quadLoop03Sound );
AUDIO_BUFFER_MAP.set( QuartetSoundFile.FOUR, quadLoop04Sound );

class QuadrilateralSoundOptionsModel {
  constructor() {

    // the fundamental sound design
    this.soundDesignProperty = new EnumerationProperty( SoundDesign, SoundDesign.PARALLELS_STACCATO );

    // @public {EnumerationProperty} - Property that controls the base sound of the "quartet" design. In the
    // quartet design there is a single sound whose pitch is changed depending on length and tilt of each line.
    this.baseSoundFileProperty = new EnumerationProperty( QuartetSoundFile, QuartetSoundFile.FOUR );
  }
}

// @public @static
QuadrilateralSoundOptionsModel.SoundDesign = SoundDesign;
QuadrilateralSoundOptionsModel.QuartetSoundFile = QuartetSoundFile;
QuadrilateralSoundOptionsModel.AUDIO_BUFFER_MAP = AUDIO_BUFFER_MAP;

quadrilateral.register( 'QuadrilateralSoundOptionsModel', QuadrilateralSoundOptionsModel );
export default QuadrilateralSoundOptionsModel;

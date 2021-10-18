// Copyright 2021, University of Colorado Boulder

/**
 * A model for the sound designs that are being proposed for Quadrilateral. In active development and we are
 * iterating on all of these. Different sound designs can be tested from the Preferences Dialog in the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import quadrilateral from '../../quadrilateral.js';

// constants
// Enumeration for named sound designs, each with their own options and parameters
const SoundDesign = Enumeration.byKeys( [ 'QUARTET', 'PARALLELS_VOLUME', 'PARALLELS_STACCATO' ] );

const QuartetSoundFile = Enumeration.byKeys( [ 'ONE', 'TWO', 'THREE', 'FOUR' ] );

class QuadrilateralSoundOptionsModel {
  constructor() {

    // the fundamental sound design
    this.soundDesignProperty = new EnumerationProperty( SoundDesign, SoundDesign.PARALLELS_STACCATO );

    // @public {EnumerationProperty} - Property that controls the base sound of the "quartet" design. In the
    // quartet design there is a single sound whose pitch is changed depending on length and tilt of each line.
    this.quartetSoundFileProperty = new EnumerationProperty( QuartetSoundFile, QuartetSoundFile.TWO );
  }
}

QuadrilateralSoundOptionsModel.SoundDesign = SoundDesign;
QuadrilateralSoundOptionsModel.QuartetSoundFile = QuartetSoundFile;

quadrilateral.register( 'QuadrilateralSoundOptionsModel', QuadrilateralSoundOptionsModel );
export default QuadrilateralSoundOptionsModel;

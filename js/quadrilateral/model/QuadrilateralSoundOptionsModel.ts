// Copyright 2021-2022, University of Colorado Boulder

/**
 * A model for the sound designs that are being proposed for Quadrilateral. In active development and we are
 * iterating on all of these. Different sound designs can be tested from the Preferences Dialog in the sim.
 * Once a single design is decided this will probably be entirely removed.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';

// constants
// Enumeration for named sound designs, each with their own options and parameters
class SoundDesign extends EnumerationValue {
  public static readonly TRACKS_BUILD_UP = new SoundDesign();
  public static readonly TRACKS_VOLUME_EMPHASIS = new SoundDesign();
  public static readonly TRACKS_MELODY = new SoundDesign();
  public static readonly TRACKS_ARPEGGIO = new SoundDesign();
  public static readonly TRACKS_BUILD_UP_SIMPLE = new SoundDesign();
  public static readonly TRACKS_MELODY_SIMPLE = new SoundDesign();
  public static readonly TRACKS_MELODY_MAPPING = new SoundDesign();

  // gets a list of keys, values and mapping between them for EnumerationProperty and PhET-iO
  public static readonly enumeration = new Enumeration( SoundDesign );
}

class QuadrilateralSoundOptionsModel {

  // The selected sound design, changing this will change the entire design.
  public soundDesignProperty: EnumerationProperty<SoundDesign>;

  // For the "Tracks" designs, if this Property is true, the sounds will play forever. This may be desireable for users,
  // but it is also helpful for debugging for now.
  public tracksPlayForeverProperty: BooleanProperty;

  public constructor() {
    this.soundDesignProperty = new EnumerationProperty( SoundDesign.enumeration.getValue( QuadrilateralQueryParameters.soundDesign! ) );
    this.tracksPlayForeverProperty = new BooleanProperty( false );
  }
}

quadrilateral.register( 'QuadrilateralSoundOptionsModel', QuadrilateralSoundOptionsModel );
export { SoundDesign };
export default QuadrilateralSoundOptionsModel;

// Copyright 2021-2022, University of Colorado Boulder

/**
 * A model for the state of sound design options. These values can be changed by the user, and impact how sounds
 * behave.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';

// Enumeration for the different sound designs available to the user.
class SoundDesign extends EnumerationValue {
  public static readonly TRACKS_VOLUME_EMPHASIS = new SoundDesign();
  public static readonly TRACKS_BUILD_UP_SIMPLE = new SoundDesign();

  public static readonly enumeration = new Enumeration( SoundDesign );
}

class QuadrilateralSoundOptionsModel {

  // The selected sound design
  public soundDesignProperty = new EnumerationProperty( SoundDesign.enumeration.getValue( QuadrilateralQueryParameters.soundDesign! ) );

  // If true, the sounds will play forever. Available to the user and helpful for debugging.
  public tracksPlayForeverProperty = new BooleanProperty( false );
}

quadrilateral.register( 'QuadrilateralSoundOptionsModel', QuadrilateralSoundOptionsModel );
export { SoundDesign };
export default QuadrilateralSoundOptionsModel;

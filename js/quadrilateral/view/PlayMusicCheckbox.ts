// Copyright 2022, University of Colorado Boulder

/**
 * The checkbox that controls output of music in this sim. To avoid convusion this component
 * will become disabled when sim sounds are off globally.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import audioManager from '../../../../joist/js/audioManager.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import QuadrilateralIconFactory from './QuadrilateralIconFactory.js';

// constants
const musicControlEnabledContextResponse = QuadrilateralStrings.a11y.voicing.musicControl.enabledContextResponseStringProperty;
const musicControlDisabledContextResponse = QuadrilateralStrings.a11y.voicing.musicControl.disabledContextResponseStringProperty;
const musicControlNameResponse = QuadrilateralStrings.a11y.voicing.musicControl.nameResponse;

class PlayMusicCheckbox extends Checkbox {
  public constructor( simSoundEnabledProperty: Property<boolean>, tandem: Tandem ) {
    super( simSoundEnabledProperty, QuadrilateralIconFactory.createSoundIcon(), {
      voicingNameResponse: musicControlNameResponse,
      checkedContextResponse: musicControlEnabledContextResponse,
      uncheckedContextResponse: musicControlDisabledContextResponse,
      tandem: tandem
    } );

    // To avoid confusion since the checkbox will do nothing when sound or all audio is disabled
    audioManager.audioAndSoundEnabledProperty.link( enabled => {
      this.enabled = enabled;
    } );
  }
}

quadrilateral.register( 'PlayMusicCheckbox', PlayMusicCheckbox );
export default PlayMusicCheckbox;

// Copyright 2022-2023, University of Colorado Boulder

/**
 * The checkbox that controls output of shape sounds in this sim. To avoid confusion, this component
 * will become disabled when sim sounds are off globally. The unique and musical nature of the sound design in this
 * sim warranted an extra control in the ScreenView to turn these sounds off quickly if desired.
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
const shapeSoundControlEnabledContextResponse = QuadrilateralStrings.a11y.voicing.shapeSoundControl.enabledContextResponse;
const shapeSoundControlDisabledContextResponse = QuadrilateralStrings.a11y.voicing.shapeSoundControl.disabledContextResponse;
const shapeSoundControlNameResponse = QuadrilateralStrings.a11y.voicing.shapeSoundControl.nameResponse;
const shapeSoundControlHintResponse = QuadrilateralStrings.a11y.voicing.shapeSoundControl.hintResponse;

export default class ShapeSoundsCheckbox extends Checkbox {
  public constructor( shapeSoundEnabledProperty: Property<boolean>, tandem: Tandem ) {
    super( shapeSoundEnabledProperty, QuadrilateralIconFactory.createSoundIcon(), {
      voicingNameResponse: shapeSoundControlNameResponse,
      checkedContextResponse: shapeSoundControlEnabledContextResponse,
      voicingHintResponse: shapeSoundControlHintResponse,
      uncheckedContextResponse: shapeSoundControlDisabledContextResponse,
      tandem: tandem
    } );

    // To avoid confusion since the checkbox will do nothing when sound or all audio is disabled
    // REVIEW: Pass to super as enabledProperty. - Great!
    // REVIEW: I've seen this a couple of times, check if there are more like it - Great!
    audioManager.audioAndSoundEnabledProperty.link( enabled => {
      this.enabled = enabled;
    } );
  }
}

quadrilateral.register( 'ShapeSoundsCheckbox', ShapeSoundsCheckbox );

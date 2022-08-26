// Copyright 2022, University of Colorado Boulder

/**
 * Controls for the quadrilateral simulation. More related to model behavior or other representations (not visibility,
 * those live in QuadrilateralVisibilityControls).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import { NodeOptions, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import TProperty from '../../../../axon/js/TProperty.js';
import audioManager from '../../../../joist/js/audioManager.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

const musicControlEnabledContextResponse = quadrilateralStrings.a11y.voicing.musicControl.enabledContextResponseProperty;
const musicControlDisabledContextResponse = quadrilateralStrings.a11y.voicing.musicControl.disabledContextResponseProperty;
const musicControlNameResponse = quadrilateralStrings.a11y.voicing.musicControl.nameResponse;

type SelfOptions = EmptySelfOptions;
type QuadrilateralControlsOptions = StrictOmit<VBoxOptions, 'align' | 'children'> & PickRequired<NodeOptions, 'tandem'>;

class QuadrilateralControls extends VBox {
  public constructor( quadrilateralShapeModel: QuadrilateralShapeModel, resetNotInProgressProperty: TProperty<boolean>, simSoundEnabledProperty: Property<boolean>, providedOptions: QuadrilateralControlsOptions ) {

    const options = optionize<QuadrilateralControlsOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: QuadrilateralConstants.CONTROLS_SPACING
    }, providedOptions );

    const resetShapeButton = new TextPushButton( quadrilateralStrings.resetShape, {
      font: QuadrilateralConstants.SCREEN_TEXT_OPTIONS.font,
      cornerRadius: QuadrilateralConstants.CORNER_RADIUS,
      baseColor: QuadrilateralColors.resetShapeButtonColorProperty,
      listener: () => {

        // wrapped in the reset Property so that sounds and feedback don't trigger during this reset call
        resetNotInProgressProperty.value = false;
        quadrilateralShapeModel.reset();
        resetNotInProgressProperty.value = true;
      },

      // So that its dimensions match the ShowShapeName control
      yMargin: 10,

      // i18n
      maxTextWidth: 250,

      tandem: options.tandem.createTandem( 'resetShapeButton' )
    } );

    const playMusicLabel = new Text( quadrilateralStrings.playMusic, QuadrilateralConstants.SCREEN_TEXT_OPTIONS );
    const playMusicCheckbox = new Checkbox( simSoundEnabledProperty, playMusicLabel, {
      voicingNameResponse: musicControlNameResponse,
      checkedContextResponse: musicControlEnabledContextResponse,
      uncheckedContextResponse: musicControlDisabledContextResponse,
      tandem: options.tandem.createTandem( 'playMusicCheckbox' )
    } );

    // To avoid confusion since the checkbox will do nothing when sound or all audio is disabled
    audioManager.audioAndSoundEnabledProperty.link( enabled => {
      playMusicCheckbox.enabled = enabled;
    } );

    options.children = [ resetShapeButton, playMusicCheckbox ];
    super( options );
  }
}

quadrilateral.register( 'QuadrilateralControls', QuadrilateralControls );
export default QuadrilateralControls;

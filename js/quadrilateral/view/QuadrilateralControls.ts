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
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
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

const musicControlEnabledContextResponse = QuadrilateralStrings.a11y.voicing.musicControl.enabledContextResponseStringProperty;
const musicControlDisabledContextResponse = QuadrilateralStrings.a11y.voicing.musicControl.disabledContextResponseStringProperty;
const musicControlNameResponse = QuadrilateralStrings.a11y.voicing.musicControl.nameResponse;
const resetShapeControlShapesShownContextResponse = QuadrilateralStrings.a11y.voicing.resetShapeControl.shapeShownContextResponse;
const resetShapeControlShapesHiddenContextResponse = QuadrilateralStrings.a11y.voicing.resetShapeControl.shapeHiddenContextResponse;

type SelfOptions = EmptySelfOptions;
type QuadrilateralControlsOptions = StrictOmit<VBoxOptions, 'align' | 'children'> & PickRequired<NodeOptions, 'tandem'>;

class QuadrilateralControls extends VBox {
  public constructor( quadrilateralShapeModel: QuadrilateralShapeModel,
                      resetNotInProgressProperty: TProperty<boolean>,
                      simSoundEnabledProperty: Property<boolean>,
                      shapeNameVisibleProperty: Property<boolean>,
                      providedOptions: QuadrilateralControlsOptions ) {

    const options = optionize<QuadrilateralControlsOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: QuadrilateralConstants.CONTROLS_SPACING
    }, providedOptions );

    const resetShapeButton = new TextPushButton( QuadrilateralStrings.resetShape, {
      font: QuadrilateralConstants.SCREEN_TEXT_OPTIONS.font,
      cornerRadius: QuadrilateralConstants.CORNER_RADIUS,
      baseColor: QuadrilateralColors.resetShapeButtonColorProperty,
      listener: () => {

        // wrapped in the reset Property so that sounds and feedback don't trigger during this reset call
        resetNotInProgressProperty.value = false;
        quadrilateralShapeModel.reset();
        resetNotInProgressProperty.value = true;

        resetShapeButton.voicingSpeakFullResponse( {
          contextResponse: shapeNameVisibleProperty.value ?
                           resetShapeControlShapesShownContextResponse : resetShapeControlShapesHiddenContextResponse
        } );
      },

      // So that its dimensions match the ShowShapeName control
      yMargin: 10,

      // i18n
      maxTextWidth: 250,

      // voicing
      voicingNameResponse: QuadrilateralStrings.resetShape,
      voicingContextResponse: 'You pressed me',

      // phet-io
      tandem: options.tandem.createTandem( 'resetShapeButton' )
    } );

    const playMusicLabel = new Text( QuadrilateralStrings.playMusic, QuadrilateralConstants.SCREEN_TEXT_OPTIONS );
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

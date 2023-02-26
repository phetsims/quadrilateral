// Copyright 2021-2023, University of Colorado Boulder

/**
 * Options for the Preferences Dialog that allow us to set the sound design and sub-options.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Node, Text, VoicingText } from '../../../../../scenery/js/imports.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import quadrilateral from '../../../quadrilateral.js';
import QuadrilateralSoundOptionsModel, { SoundDesign } from '../../model/QuadrilateralSoundOptionsModel.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import PreferencesDialog from '../../../../../joist/js/preferences/PreferencesDialog.js';
import AquaRadioButtonGroup from '../../../../../sun/js/AquaRadioButtonGroup.js';
import PreferencesPanelSection from '../../../../../joist/js/preferences/PreferencesPanelSection.js';
import AquaRadioButton from '../../../../../sun/js/AquaRadioButton.js';
import QuadrilateralStrings from '../../../QuadrilateralStrings.js';
import soundManager from '../../../../../tambo/js/soundManager.js';

// constants
const shapeSoundsOptionsString = QuadrilateralStrings.preferencesDialog.shapeSoundOptions;
const shapeSoundsOptionsDescriptionString = QuadrilateralStrings.preferencesDialog.shapeSoundOptionsDescription;
const preferencesDialogLayerSoundDesignDescriptionString = QuadrilateralStrings.preferencesDialog.layerSoundDesignDescription;
const preferencesDialogIndependentSoundDesignDescriptionString = QuadrilateralStrings.preferencesDialog.independentSoundDesignDescription;
const preferencesDialogPlaySoundsForeverString = QuadrilateralStrings.preferencesDialog.playSoundsForever;
const tracksPlayForeverCheckedContextResponseString = QuadrilateralStrings.a11y.preferencesDialog.tracksPlayForeverCheckbox.checkedContextResponse;
const tracksPlayForeverUncheckedContextResponseString = QuadrilateralStrings.a11y.preferencesDialog.tracksPlayForeverCheckbox.uncheckedContextResponse;

class QuadrilateralSoundOptionsNode extends PreferencesPanelSection {

  // Necessary for PhET-iO state and disposal since these components become dynamic when they live in a phetio capsule
  private readonly disposeQuadrilateralSoundOptionsNode: () => void;

  public constructor( model: QuadrilateralSoundOptionsModel, tandem: Tandem ) {

    const soundDesignLabelText = new VoicingText( shapeSoundsOptionsString, PreferencesDialog.PANEL_SECTION_LABEL_OPTIONS );
    const soundDesignDescriptionText = new VoicingText( shapeSoundsOptionsDescriptionString, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS );

    const soundDesignRadioButtonGroup = new AquaRadioButtonGroup( model.soundDesignProperty, [
      {
        value: SoundDesign.TRACKS_LAYER,
        createNode: () => new Text( preferencesDialogLayerSoundDesignDescriptionString, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS ),
        tandemName: `layersTracksSoundView${AquaRadioButton.TANDEM_NAME_SUFFIX}`,
        options: {
          voicingNameResponse: preferencesDialogLayerSoundDesignDescriptionString
        }
      },
      {
        value: SoundDesign.TRACKS_EMPHASIS,
        createNode: () => new Text( preferencesDialogIndependentSoundDesignDescriptionString, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS ),
        tandemName: `emphasisTracksSoundView${AquaRadioButton.TANDEM_NAME_SUFFIX}`,
        options: {
          voicingNameResponse: preferencesDialogIndependentSoundDesignDescriptionString
        }
      }
    ], {
      spacing: 4,
      radioButtonOptions: {
        radius: 9
      },
      tandem: tandem.createTandem( 'soundDesignRadioButtonGroup' )
    } );

    const tracksPlayForeverLabel = new Text( preferencesDialogPlaySoundsForeverString, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS );
    const tracksPlayForeverCheckbox = new Checkbox( model.tracksPlayForeverProperty, tracksPlayForeverLabel, {
      tandem: tandem.createTandem( 'tracksPlayForeverCheckbox' ),

      // voicing
      voicingNameResponse: preferencesDialogPlaySoundsForeverString,
      checkedContextResponse: tracksPlayForeverCheckedContextResponseString,
      uncheckedContextResponse: tracksPlayForeverUncheckedContextResponseString
    } );

    const content = new Node( {
      children: [ soundDesignLabelText, soundDesignDescriptionText, soundDesignRadioButtonGroup, tracksPlayForeverCheckbox ]
    } );

    super( {
      contentNode: content
    } );

    // layout
    soundDesignDescriptionText.leftTop = soundDesignLabelText.leftBottom.plusXY( 0, 5 );
    soundDesignRadioButtonGroup.leftTop = soundDesignDescriptionText.leftBottom.plusXY( PreferencesDialog.CONTENT_INDENTATION_SPACING, 5 );
    tracksPlayForeverCheckbox.left = soundDesignLabelText.left;
    tracksPlayForeverCheckbox.top = soundDesignRadioButtonGroup.bottom + PreferencesDialog.CONTENT_SPACING;

    // The shape sound options should only be available when sounds are enabled. joist disables all audio
    // options when Audio Features are disabled, so we use 'visible' instead of 'enabled' to avoid compounding
    // transparency when both sounds and audio are disabled.
    soundManager.enabledProperty.link( enabled => {
      this.visible = enabled;
    } );

    this.disposeQuadrilateralSoundOptionsNode = () => {
      soundDesignRadioButtonGroup.dispose();
    };
  }

  public override dispose(): void {
    this.disposeQuadrilateralSoundOptionsNode();
    super.dispose();
  }
}

quadrilateral.register( 'QuadrilateralSoundOptionsNode', QuadrilateralSoundOptionsNode );
export default QuadrilateralSoundOptionsNode;

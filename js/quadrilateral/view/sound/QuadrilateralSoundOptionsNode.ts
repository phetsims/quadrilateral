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
import Vector2 from '../../../../../dot/js/Vector2.js';

// constants
const shapeSoundsOptionsStringProperty = QuadrilateralStrings.preferencesDialog.shapeSoundOptionsStringProperty;
const shapeSoundsOptionsDescriptionStringProperty = QuadrilateralStrings.preferencesDialog.shapeSoundOptionsDescriptionStringProperty;
const preferencesDialogLayerSoundDesignDescriptionStringProperty = QuadrilateralStrings.preferencesDialog.layerSoundDesignDescriptionStringProperty;
const preferencesDialogEmphasisSoundDesignDescriptionStringProperty = QuadrilateralStrings.preferencesDialog.emphasisSoundDesignDescriptionStringProperty;
const preferencesDialogSoundsPlayForeverLabelStringProperty = QuadrilateralStrings.preferencesDialog.soundsPlayForeverLabelStringProperty;
const preferencesDialogSoundsPlayForeverDescriptionStringProperty = QuadrilateralStrings.preferencesDialog.soundsPlayForeverDescriptionStringProperty;
const tracksPlayForeverCheckedContextResponseStringProperty = QuadrilateralStrings.a11y.preferencesDialog.tracksPlayForeverCheckbox.checkedContextResponseStringProperty;
const tracksPlayForeverUncheckedContextResponseStringProperty = QuadrilateralStrings.a11y.preferencesDialog.tracksPlayForeverCheckbox.uncheckedContextResponseStringProperty;

export default class QuadrilateralSoundOptionsNode extends PreferencesPanelSection {

  // Necessary for PhET-iO state and disposal since these components become dynamic when they live in a phetio capsule
  private readonly disposeQuadrilateralSoundOptionsNode: () => void;

  public constructor( model: QuadrilateralSoundOptionsModel, tandem: Tandem ) {

    const soundDesignLabelText = new VoicingText( shapeSoundsOptionsStringProperty, PreferencesDialog.PANEL_SECTION_LABEL_OPTIONS );
    const soundDesignDescriptionText = new VoicingText( shapeSoundsOptionsDescriptionStringProperty, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS );

    const soundDesignRadioButtonGroup = new AquaRadioButtonGroup( model.soundDesignProperty, [
      {
        value: SoundDesign.TRACKS_LAYER,
        createNode: () => new Text( preferencesDialogLayerSoundDesignDescriptionStringProperty, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS ),
        tandemName: `layersTracksSoundView${AquaRadioButton.TANDEM_NAME_SUFFIX}`,
        options: {
          voicingNameResponse: preferencesDialogLayerSoundDesignDescriptionStringProperty
        }
      },
      {
        value: SoundDesign.TRACKS_EMPHASIS,
        createNode: () => new Text( preferencesDialogEmphasisSoundDesignDescriptionStringProperty, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS ),
        tandemName: `emphasisTracksSoundView${AquaRadioButton.TANDEM_NAME_SUFFIX}`,
        options: {
          voicingNameResponse: preferencesDialogEmphasisSoundDesignDescriptionStringProperty
        }
      }
    ], {
      spacing: 4,
      radioButtonOptions: {
        radius: 9
      },
      tandem: tandem.createTandem( 'soundDesignRadioButtonGroup' )
    } );

    const tracksPlayForeverDescriptionText = new VoicingText( preferencesDialogSoundsPlayForeverDescriptionStringProperty, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS );

    const tracksPlayForeverLabelText = new Text( preferencesDialogSoundsPlayForeverLabelStringProperty, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS );
    const tracksPlayForeverCheckbox = new Checkbox( model.tracksPlayForeverProperty, tracksPlayForeverLabelText, {
      tandem: tandem.createTandem( 'tracksPlayForeverCheckbox' ),

      // voicing
      voicingNameResponse: preferencesDialogSoundsPlayForeverLabelStringProperty,
      checkedContextResponse: tracksPlayForeverCheckedContextResponseStringProperty,
      uncheckedContextResponse: tracksPlayForeverUncheckedContextResponseStringProperty
    } );

    super( {
      contentNode: new Node( {
        children: [ soundDesignLabelText, soundDesignDescriptionText, soundDesignRadioButtonGroup, tracksPlayForeverDescriptionText, tracksPlayForeverCheckbox ]
      } ),

      // The shape sound options should only be available when sounds are enabled. joist disables all audio
      // options when Audio Features are disabled, so we use 'visible' instead of 'enabled' to avoid compounding
      // transparency when both sounds and audio are disabled.
      visibleProperty: soundManager.enabledProperty
    } );

    // layout
    soundDesignDescriptionText.leftTop = soundDesignLabelText.leftBottom.plusXY( 0, PreferencesDialog.VERTICAL_CONTENT_SPACING );
    soundDesignRadioButtonGroup.leftTop = soundDesignDescriptionText.leftBottom.plusXY( PreferencesDialog.CONTENT_INDENTATION_SPACING, PreferencesDialog.VERTICAL_CONTENT_SPACING );
    tracksPlayForeverDescriptionText.leftTop = new Vector2( soundDesignLabelText.left, soundDesignRadioButtonGroup.bottom + PreferencesDialog.CONTENT_SPACING );
    tracksPlayForeverCheckbox.leftTop = tracksPlayForeverDescriptionText.leftBottom.plusXY( PreferencesDialog.CONTENT_INDENTATION_SPACING, PreferencesDialog.VERTICAL_CONTENT_SPACING );

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

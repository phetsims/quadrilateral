// Copyright 2022, University of Colorado Boulder

/**
 * Simulation specific preferences for this simulation. These controls appear in the Preferences dialog in the
 * "Simulation" tab.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralPreferencesModel from '../model/QuadrilateralPreferencesModel.js';
import { Node, Text, VBox, VoicingRichText, VoicingRichTextOptions } from '../../../../scenery/js/imports.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ClapperboardButton from '../../../../scenery-phet/js/ClapperboardButton.js';
import PreferencesPanelSection from '../../../../joist/js/preferences/PreferencesPanelSection.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ToggleSwitch, { ToggleSwitchOptions } from '../../../../sun/js/ToggleSwitch.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';

class QuadrilateralSimulationPreferencesNode extends PreferencesPanelSection {
  public constructor( preferencesModel: QuadrilateralPreferencesModel, tandem: Tandem ) {

    // A control for vertex spacing.
    const fineInputDescriptionText = new VoicingRichText(
      QuadrilateralStrings.fineInputSpacingDescriptionStringProperty,
      combineOptions<VoicingRichTextOptions>( {}, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS, { lineWrap: 500 } )
    );

    const fineSpacingSwitch = new ToggleSwitch( preferencesModel.fineInputSpacingProperty, false, true, combineOptions<ToggleSwitchOptions>(
      {},
      PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS,
      {
        leftValueContextResponse: QuadrilateralStrings.a11y.fineInputDisabledContextResponse,
        rightValueContextResponse: QuadrilateralStrings.a11y.fineInputEnabledContextResponse,
        tandem: tandem.createTandem( 'fineInputSpacingCheckbox' )
      }
    ) );

    const fineSpacingControl = new PreferencesControl( {
      labelNode: new Text( QuadrilateralStrings.fineInputSpacingStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      descriptionNode: fineInputDescriptionText,
      controlNode: fineSpacingSwitch
    } );

    // An event and other data that may be used to signify when user recording begins. Note it is always constructed
    // regardless of whether it is added because I think that is important for consistent PhET-iO APIs.
    const clapperButton = new ClapperboardButton( { tandem: tandem.createTandem( 'clapperboardButton' ) } );

    const children: Node[] = [ fineSpacingControl ];
    if ( QuadrilateralQueryParameters.includeClapperButton ) {
      children.push( clapperButton );
    }
    const content = new VBox( {
      align: 'left',
      spacing: PreferencesDialog.CONTENT_SPACING,
      children: children
    } );

    super( {
      contentNode: content,
      contentLeftMargin: 0
    } );
  }
}

quadrilateral.register( 'QuadrilateralSimulationPreferencesNode', QuadrilateralSimulationPreferencesNode );
export default QuadrilateralSimulationPreferencesNode;

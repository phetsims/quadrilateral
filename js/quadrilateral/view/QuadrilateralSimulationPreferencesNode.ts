// Copyright 2022, University of Colorado Boulder

/**
 * Simulation specific preferences for this simulation. These controls appear in the Preferences dialog in the
 * "Simulation" tab.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralPreferencesModel from '../model/QuadrilateralPreferencesModel.js';
import { Text, VBox, Node, VoicingText } from '../../../../scenery/js/imports.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ClapperboardButton from '../../../../scenery-phet/js/ClapperboardButton.js';
import PreferencesPanelSection from '../../../../joist/js/preferences/PreferencesPanelSection.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import PreferencesToggleSwitch from '../../../../joist/js/preferences/PreferencesToggleSwitch.js';

class QuadrilateralSimulationPreferencesNode extends PreferencesPanelSection {
  public constructor( preferencesModel: QuadrilateralPreferencesModel, tandem: Tandem ) {

    // A control for vertex spacing.
    const fineInputDescriptionText = new VoicingText( 'Hi Brett! Would you like a description here?', PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS );
    fineInputDescriptionText.fill = 'hotPink';

    const fineSpacingSwitch = new PreferencesToggleSwitch( preferencesModel.fineInputSpacingProperty, false, true, {
      labelNode: new Text( QuadrilateralStrings.fineInputSpacingStringProperty, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS ),
      descriptionNode: fineInputDescriptionText,
      tandem: tandem.createTandem( 'fineInputSpacingCheckbox' )
    } );

    // An event and other data that may be used to signify when user recording begins. Note it is always constructed
    // regardless of whether it is added because I think that is important for consistent PhET-iO APIs.
    const clapperButton = new ClapperboardButton( { tandem: tandem.createTandem( 'clapperboardButton' ) } );

    const children: Node[] = [ fineSpacingSwitch ];
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

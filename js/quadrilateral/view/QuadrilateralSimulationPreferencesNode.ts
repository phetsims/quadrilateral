// Copyright 2022, University of Colorado Boulder

/**
 * Simulation specific preferences for this simulation. These controls appear in the Preferences dialog in the
 * "Simulation" tab.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralPreferencesModel from '../model/QuadrilateralPreferencesModel.js';
import { VBox } from '../../../../scenery/js/imports.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ClapperboardButton from '../../../../scenery-phet/js/ClapperboardButton.js';
import PreferencesPanelSection from '../../../../joist/js/preferences/PreferencesPanelSection.js';

class QuadrilateralSimulationPreferencesNode extends PreferencesPanelSection {
  public constructor( preferencesModel: QuadrilateralPreferencesModel, tandem: Tandem ) {

    // An event and other data that may be used to signify when user recording begins. Note it is always constructed
    // regardless of whether it is added because I think that is important for consistent PhET-iO APIs.
    const clapperButton = new ClapperboardButton( { tandem: tandem.createTandem( 'clapperboardButton' ) } );

    const content = new VBox( {
      align: 'left',
      spacing: PreferencesDialog.CONTENT_SPACING,
      children: [ clapperButton ]
    } );

    super( {
      contentNode: content,
      contentLeftMargin: 0
    } );
  }
}

quadrilateral.register( 'QuadrilateralSimulationPreferencesNode', QuadrilateralSimulationPreferencesNode );
export default QuadrilateralSimulationPreferencesNode;

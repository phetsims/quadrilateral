// Copyright 2021-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import { Color, ColorProperty } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import vibrationManager from '../../tappi/js/vibrationManager.js';
import HapticsInfoDialog from './common/HapticsInfoDialog.js';
import QuadrilateralQueryParameters from './quadrilateral/QuadrilateralQueryParameters.js';
import QuadrilateralScreen from './quadrilateral/QuadrilateralScreen.js';
import quadrilateralStrings from './quadrilateralStrings.js';
import QuadrilateralPreferencesModel from './quadrilateral/model/QuadrilateralPreferencesModel.js';
import QuadrilateralPreferencesNode from './quadrilateral/view/QuadrilateralPreferencesNode.js';

const quadrilateralTitleString = quadrilateralStrings.quadrilateral.title;
const calibrationDemoString = 'Device'; // this will never be translatable, keep out of json file

const preferencesModel = new QuadrilateralPreferencesModel();

const simOptions: SimOptions = {

  //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
  credits: {
    leadDesign: '',
    softwareDevelopment: '',
    team: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
  },

  // preferences configuration with defaults from package.json
  preferencesModel: new PreferencesModel( {
    generalOptions: {
      createSimControls: tandem => new QuadrilateralPreferencesNode( preferencesModel, tandem.createTandem( 'quadrilateralPreferencesNode' ) )
    }
  } )
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {

  // if in the "calibration" demo, use two screens to test communication between them, see
  // https://github.com/phetsims/quadrilateral/issues/18
  const quadrilateralScreen = new QuadrilateralScreen( preferencesModel, {
    name: quadrilateralTitleString,
    tandem: Tandem.ROOT.createTandem( 'quadrilateralScreen' )
  } );
  const calibrationDemoScreen = new QuadrilateralScreen( preferencesModel, {
    name: calibrationDemoString,
    backgroundColorProperty: new ColorProperty( new Color( 'white' ) ),
    tandem: Tandem.ROOT.createTandem( 'calibrationDemoScreen' )
  } );
  const simScreens = QuadrilateralQueryParameters.calibrationDemo ? [ quadrilateralScreen, calibrationDemoScreen ] : [ quadrilateralScreen ];

  const sim = new Sim( quadrilateralTitleString, simScreens, simOptions );
  sim.start();

  // @ts-ignore
  if ( QuadrilateralQueryParameters.showInitialTouchDialog && window.navigator.vibrate ) {

    // Put up a dialog that will essentially force the user to interact with the sim, thus enabling haptics right away.
    const showDialogOnConstructionComplete = ( complete: boolean ) => {
      if ( complete ) {
        const dialog = new HapticsInfoDialog();
        dialog.show();
        sim.isConstructionCompleteProperty.unlink( showDialogOnConstructionComplete );
      }
    };
    sim.isConstructionCompleteProperty.lazyLink( showDialogOnConstructionComplete );
  }

  // Initialize the vibration manager.  This is necessary because the vibration manager needs certain things from the
  // sim object instance to complete its setup.  If the vibration feature becomes widely used, this may be moved into
  // Sim.js, but as of now (May 2022) we don't want Sim.js to have a dependency on this library.
  vibrationManager.initialize( sim.browserTabVisibleProperty, sim.activeProperty );
} );
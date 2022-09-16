// Copyright 2021-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import { Node } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import vibrationManager from '../../tappi/js/vibrationManager.js';
import HapticsInfoDialog from './common/HapticsInfoDialog.js';
import QuadrilateralQueryParameters from './quadrilateral/QuadrilateralQueryParameters.js';
import QuadrilateralScreen from './quadrilateral/QuadrilateralScreen.js';
import QuadrilateralStrings from './QuadrilateralStrings.js';
import QuadrilateralPreferencesModel from './quadrilateral/model/QuadrilateralPreferencesModel.js';
import QuadrilateralAudioPreferencesNode from './quadrilateral/view/QuadrilateralAudioPreferencesNode.js';
import MappedProperty from '../../axon/js/MappedProperty.js';
import QuadrilateralSimulationPreferencesNode from './quadrilateral/view/QuadrilateralSimulationPreferencesNode.js';
import QuadrilateralInputPreferencesNode from './quadrilateral/view/QuadrilateralInputPreferencesNode.js';

const quadrilateralTitleStringProperty = QuadrilateralStrings.quadrilateral.titleStringProperty;

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
    simulationOptions: {
      customPreferences: [ {
        createContent: tandem => new QuadrilateralSimulationPreferencesNode( preferencesModel, tandem.createTandem( 'simPreferences' ) )
      } ]
    },
    inputOptions: {
      customPreferences: [ {
        createContent: tandem => new QuadrilateralInputPreferencesNode( preferencesModel )
      } ]
    },
    audioOptions: {
      customPreferences: [
        {
          createContent: tandem => new Node()
        },
        {
          createContent: tandem => new QuadrilateralAudioPreferencesNode( preferencesModel, tandem.createTandem( 'audioPreferences' ) )
        }
      ]
    }
  } )
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const quadrilateralScreen = new QuadrilateralScreen( preferencesModel, {

    // You cannot pass the same Property instance as a single as the sim and screen name.
    name: new MappedProperty<string, string>( quadrilateralTitleStringProperty, {
      bidirectional: true,
      map: _.identity, inverseMap: _.identity
    } ),
    tandem: Tandem.ROOT.createTandem( 'quadrilateralScreen' )
  } );

  const sim = new Sim( quadrilateralTitleStringProperty, [ quadrilateralScreen ], simOptions );
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
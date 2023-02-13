// Copyright 2021-2023, University of Colorado Boulder

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
import QuadrilateralQueryParameters from './quadrilateral/QuadrilateralQueryParameters.js';
import QuadrilateralScreen from './quadrilateral/QuadrilateralScreen.js';
import QuadrilateralStrings from './QuadrilateralStrings.js';
import QuadrilateralOptionsModel from './quadrilateral/model/QuadrilateralOptionsModel.js';
import QuadrilateralAudioPreferencesNode from './quadrilateral/view/QuadrilateralAudioPreferencesNode.js';
import MappedProperty from '../../axon/js/MappedProperty.js';
import QuadrilateralInputPreferencesNode from './quadrilateral/view/QuadrilateralInputPreferencesNode.js';
import HapticsInfoDialog from './quadrilateral/view/prototype/HapticsInfoDialog.js';

const quadrilateralTitleStringProperty = QuadrilateralStrings.quadrilateral.titleStringProperty;
const optionsModel = new QuadrilateralOptionsModel();

// "Input" options are related to connection to a tangible device, this tab should only be shown when running
// while connected to some external device.
const inputPreferencesOptions = QuadrilateralQueryParameters.deviceConnection ? {
  customPreferences: [ {
    createContent: () => new QuadrilateralInputPreferencesNode( optionsModel.tangibleOptionsModel )
  } ]
} : undefined;

const simOptions: SimOptions = {

  credits: {
    softwareDevelopment: 'Jesse Greenberg',
    team: 'Brett Fiedler, Emily B. Moore, Taliesin Smith',
    contributors: 'Dor Abrahamson, Sofia Tancredi, and the Embodied Design Research Lab (UC Berkeley), ' +
                  'Scott Lambert, Jenna Gorlewicz, and the CHROME Lab (St. Louis University)',
    soundDesign: 'Ashton Morris',

    //TODO fill in credits with QA team
    qualityAssurance: ''
  },

  // preferences configuration with defaults from package.json
  preferencesModel: new PreferencesModel( {
    inputOptions: inputPreferencesOptions,
    localizationOptions: {

      // Dynamic locales are not supported for initial publication of this sim.
      supportsDynamicLocales: false
    },
    audioOptions: {
      customPreferences: [
        {
          createContent: () => new Node()
        },
        {
          createContent: tandem => new QuadrilateralAudioPreferencesNode( optionsModel, tandem.createTandem( 'audioPreferences' ) )
        }
      ]
    }
  } )
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const quadrilateralScreen = new QuadrilateralScreen( optionsModel, {

    // You cannot pass the same Property instance as a single as the sim and screen name.
    name: new MappedProperty<string, string>( quadrilateralTitleStringProperty, {
      bidirectional: true,
      map: _.identity, inverseMap: _.identity
    } ),
    tandem: Tandem.ROOT.createTandem( 'quadrilateralScreen' )
  } );

  const sim = new Sim( quadrilateralTitleStringProperty, [ quadrilateralScreen ], simOptions );
  sim.start();

  // @ts-expect-error - navigator.vibrate isn't available yet in TypeScript's native types (experimental technology)
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
  // Removed for now until we return to this work, see https://github.com/phetsims/quadrilateral/issues/104
  // vibrationManager.initialize( sim.browserTabVisibleProperty, sim.activeProperty );
} );
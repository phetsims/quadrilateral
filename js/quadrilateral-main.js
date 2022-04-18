// Copyright 2021-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PreferencesConfiguration from '../../joist/js/preferences/PreferencesConfiguration.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import { Color, ColorProperty, HBox } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import vibrationManager from '../../tappi/js/vibrationManager.js';
import QuadrilateralSoundOptionsModel from './quadrilateral/model/QuadrilateralSoundOptionsModel.js';
import QuadrilateralQueryParameters from './quadrilateral/QuadrilateralQueryParameters.js';
import QuadrilateralScreen from './quadrilateral/QuadrilateralScreen.js';
import QuadrilateralBluetoothConnectionPanel from './quadrilateral/view/QuadrilateralBluetoothConnectionPanel.js';
import QuadrilateralSoundOptionsNode from './quadrilateral/view/QuadrilateralSoundOptionsNode.js';
import quadrilateralStrings from './quadrilateralStrings.js';

const quadrilateralTitleString = quadrilateralStrings.quadrilateral.title;
const calibrationDemoString = 'Device'; // this will never be translatable, keep out of json file

const soundOptionsModel = new QuadrilateralSoundOptionsModel();

// if requested by query parameter, include experimental bluetooth controls in the sim settings
const controls = [ new QuadrilateralSoundOptionsNode( soundOptionsModel, Tandem.GENERAL_VIEW ) ];
QuadrilateralQueryParameters.bluetooth && controls.push( new QuadrilateralBluetoothConnectionPanel( Tandem.GENERAL_VIEW ) );

const simOptions = {

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
  preferencesConfiguration: new PreferencesConfiguration( {
    generalOptions: {
      simControls: new HBox( { children: controls, spacing: 10, align: 'top' } )
    }
  } )
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {

  // if in the "calibration" demo, use two screens to test communication between them, see
  // https://github.com/phetsims/quadrilateral/issues/18
  const quadrilateralScreen = new QuadrilateralScreen( soundOptionsModel, {
    name: quadrilateralTitleString,
    tandem: Tandem.ROOT.createTandem( 'quadrilateralScreen' )
  } );
  const calibrationDemoScreen = new QuadrilateralScreen( soundOptionsModel, {
    name: calibrationDemoString,
    screenViewOptions: {
      calibrationDemoDevice: true
    },
    backgroundColorProperty: new ColorProperty( new Color( 'white' ) ),
    tandem: Tandem.ROOT.createTandem( 'calibrationDemoScreen' )
  } );
  const simScreens = QuadrilateralQueryParameters.calibrationDemo ? [ quadrilateralScreen, calibrationDemoScreen ] : [ quadrilateralScreen ];

  const sim = new Sim( quadrilateralTitleString, simScreens, simOptions );
  sim.start();

  vibrationManager.initialize( sim.browserTabVisibleProperty, sim.activeProperty );
} );
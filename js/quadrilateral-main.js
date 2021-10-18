// Copyright 2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PreferencesConfiguration from '../../joist/js/preferences/PreferencesConfiguration.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import QuadrilateralSoundOptionsModel from './quadrilateral/model/QuadrilateralSoundOptionsModel.js';
import QuadrilateralScreen from './quadrilateral/QuadrilateralScreen.js';
import QuadrilateralSoundOptionsNode from './quadrilateral/view/QuadrilateralSoundOptionsNode.js';
import quadrilateralStrings from './quadrilateralStrings.js';

const quadrilateralTitleString = quadrilateralStrings.quadrilateral.title;

const soundOptionsModel = new QuadrilateralSoundOptionsModel();

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
      simControls: new QuadrilateralSoundOptionsNode( soundOptionsModel, Tandem.GENERAL_VIEW )
    }
  } )
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( quadrilateralTitleString, [
    new QuadrilateralScreen( soundOptionsModel, Tandem.ROOT.createTandem( 'quadrilateralScreen' ) )
  ], simOptions );
  sim.start();
} );
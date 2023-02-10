// Copyright 2021-2022, University of Colorado Boulder

/**
 * Entry point for the screen of quadrilateral.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import QuadrilateralColors from '../common/QuadrilateralColors.js';
import quadrilateral from '../quadrilateral.js';
import QuadrilateralModel from './model/QuadrilateralModel.js';
import QuadrilateralScreenView from './view/QuadrilateralScreenView.js';
import QuadrilateralOptionsModel from './model/QuadrilateralOptionsModel.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import QuadrilateralKeyboardHelpContent from './view/QuadrilateralKeyboardHelpContent.js';

class QuadrilateralScreen extends Screen<QuadrilateralModel, QuadrilateralScreenView> {
  public constructor( preferencesModel: QuadrilateralOptionsModel, providedOptions: ScreenOptions ) {

    const options = optionize<ScreenOptions, EmptySelfOptions, ScreenOptions>()( {
      backgroundColorProperty: QuadrilateralColors.screenBackgroundColorProperty,
      createKeyboardHelpNode: () => new QuadrilateralKeyboardHelpContent()
    }, providedOptions );

    super(
      () => new QuadrilateralModel( preferencesModel, options.tandem.createTandem( 'model' ) ),
      model => new QuadrilateralScreenView( model, preferencesModel, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

quadrilateral.register( 'QuadrilateralScreen', QuadrilateralScreen );
export default QuadrilateralScreen;
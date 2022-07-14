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
import QuadrilateralPreferencesModel from './model/QuadrilateralPreferencesModel.js';
import optionize from '../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../phet-core/js/types/EmptyObjectType.js';

class QuadrilateralScreen extends Screen<QuadrilateralModel, QuadrilateralScreenView> {
  public constructor( preferencesModel: QuadrilateralPreferencesModel, providedOptions: ScreenOptions ) {

    const options = optionize<ScreenOptions, EmptyObjectType, ScreenOptions>()( {
      backgroundColorProperty: QuadrilateralColors.screenBackgroundColorProperty
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
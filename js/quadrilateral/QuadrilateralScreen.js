// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QuadrilateralColors from '../common/QuadrilateralColors.js';
import quadrilateral from '../quadrilateral.js';
import QuadrilateralModel from './model/QuadrilateralModel.js';
import QuadrilateralScreenView from './view/QuadrilateralScreenView.js';

class QuadrilateralScreen extends Screen {

  /**
   * @param {QuadrilateralPreferencesModel} preferencesModel
   * @param {BooleanProperty} shapeIdentificationFeedbackEnabledProperty
   * @param {Object} [options]
   */
  constructor( preferencesModel, options ) {

    options = merge( {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: QuadrilateralColors.screenBackgroundColorProperty,
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new QuadrilateralModel( preferencesModel, options.tandem.createTandem( 'model' ) ),
      model => new QuadrilateralScreenView( model, preferencesModel, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

quadrilateral.register( 'QuadrilateralScreen', QuadrilateralScreen );
export default QuadrilateralScreen;
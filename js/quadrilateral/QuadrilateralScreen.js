// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import quadrilateralColors from '../common/QuadrilateralColors.js';
import quadrilateral from '../quadrilateral.js';
import QuadrilateralModel from './model/QuadrilateralModel.js';
import QuadrilateralScreenView from './view/QuadrilateralScreenView.js';

class QuadrilateralScreen extends Screen {

  /**
   * @param {QuadrilateralSoundOptionsModel} soundOptionsModel
   * @param {Tandem} tandem
   */
  constructor( soundOptionsModel, tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: quadrilateralColors.screenBackgroundColorProperty,
      tandem: tandem
    };

    super(
      () => new QuadrilateralModel( tandem.createTandem( 'model' ) ),
      model => new QuadrilateralScreenView( model, soundOptionsModel, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

quadrilateral.register( 'QuadrilateralScreen', QuadrilateralScreen );
export default QuadrilateralScreen;
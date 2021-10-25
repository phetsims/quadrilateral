// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import quadrilateralColors from '../common/QuadrilateralColors.js';
import quadrilateral from '../quadrilateral.js';
import QuadrilateralModel from './model/QuadrilateralModel.js';
import QuadrilateralScreenView from './view/QuadrilateralScreenView.js';

class QuadrilateralScreen extends Screen {

  /**
   * @param {QuadrilateralSoundOptionsModel} soundOptionsModel
   * @param {Object} [options]
   */
  constructor( soundOptionsModel, options ) {

    options = merge( {

      // screens may have a name for demonstration purposes, remove when we have a complete sim design
      name: null,

      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: quadrilateralColors.screenBackgroundColorProperty,

      // {Object} - options passed to the QuadrilateralScreenView
      screenViewOptions: {},

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    options.screenViewOptions = merge( {

      // phet-io
      tandem: options.tandem.createTandem( 'view' )
    }, options.screenViewOptions );

    super(
      () => new QuadrilateralModel( options.tandem.createTandem( 'model' ) ),
      model => new QuadrilateralScreenView( model, soundOptionsModel, options.screenViewOptions ),
      options
    );
  }
}

quadrilateral.register( 'QuadrilateralScreen', QuadrilateralScreen );
export default QuadrilateralScreen;
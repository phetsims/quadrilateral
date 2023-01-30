// Copyright 2023, University of Colorado Boulder

import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralSerialMessageController from './QuadrilateralSerialMessageController.js';

/**
 * A button that will send values representing the model to a parent frame for the "p5 serial connection"
 * prototype.
 *
 * TODO: More documentation for this prototype please.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

class QuadrilateralSerialConnectionButton extends TextPushButton {
  public constructor( model: QuadrilateralModel ) {

    const controller = new QuadrilateralSerialMessageController( model.quadrilateralShapeModel );

    super( 'Send Values', {
      textNodeOptions: QuadrilateralConstants.SCREEN_TEXT_OPTIONS,
      baseColor: QuadrilateralColors.screenViewButtonColorProperty
    } );

    this.addListener( () => {
      controller.sendModelValuesString();
    } );
  }
}

quadrilateral.register( 'QuadrilateralSerialConnectionButton', QuadrilateralSerialConnectionButton );
export default QuadrilateralSerialConnectionButton;

// Copyright 2022, University of Colorado Boulder

/**
 * A button that will reset just the quadrilateral shape.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';

class ResetShapeButton extends TextPushButton {
  public constructor( quadrilateralShapeModel: QuadrilateralShapeModel, resetNotInProgressProperty: TProperty<boolean>, shapeNameVisibleProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {
    super( QuadrilateralStrings.resetShape, {

      font: QuadrilateralConstants.SCREEN_TEXT_OPTIONS.font,
      cornerRadius: QuadrilateralConstants.CORNER_RADIUS,
      baseColor: QuadrilateralColors.quadrilateralShapeColorProperty,

      // i18n
      maxTextWidth: 150,

      // voicing
      voicingNameResponse: QuadrilateralStrings.resetShape,
      voicingContextResponse: QuadrilateralStrings.a11y.voicing.resetShapeControl.contextResponse,

      // phet-io
      tandem: tandem,

      listener: () => {

        // wrapped in the reset Property so that sounds and feedback don't trigger during this reset call
        resetNotInProgressProperty.value = false;
        quadrilateralShapeModel.reset();
        resetNotInProgressProperty.value = true;

        this.voicingSpeakFullResponse( {

          // don't repeat the hint content on activation since the button has been pressed
          hintResponse: null
        } );
      }
    } );
  }
}

quadrilateral.register( 'ResetShapeButton', ResetShapeButton );
export default ResetShapeButton;

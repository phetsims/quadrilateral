// Copyright 2022, University of Colorado Boulder

/**
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

// constants
const resetShapeControlShapesShownContextResponse = QuadrilateralStrings.a11y.voicing.resetShapeControl.shapeShownContextResponse;
const resetShapeControlShapesHiddenContextResponse = QuadrilateralStrings.a11y.voicing.resetShapeControl.shapeHiddenContextResponse;

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

      // phet-io
      tandem: tandem,

      listener: () => {

        // wrapped in the reset Property so that sounds and feedback don't trigger during this reset call
        resetNotInProgressProperty.value = false;
        quadrilateralShapeModel.reset();
        resetNotInProgressProperty.value = true;

        this.voicingSpeakFullResponse( {
          contextResponse: shapeNameVisibleProperty.value ?
                           resetShapeControlShapesShownContextResponse : resetShapeControlShapesHiddenContextResponse
        } );
      }
    } );
  }
}

quadrilateral.register( 'ResetShapeButton', ResetShapeButton );
export default ResetShapeButton;

// Copyright 2022-2023, University of Colorado Boulder

/**
 * The UI component that locks into constraining Vertex positions to the minor grid.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import quadrilateral from '../../quadrilateral.js';
import LockNode from '../../../../scenery-phet/js/LockNode.js';
import RectangularToggleButton from '../../../../sun/js/buttons/RectangularToggleButton.js';
import { Text } from '../../../../scenery/js/imports.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';

class MinorIntervalsToggleButton extends RectangularToggleButton<boolean> {
  public constructor( lockToMinorIntervalsProperty: Property<boolean> ) {

    const buttonIcon = new LockNode( lockToMinorIntervalsProperty, { scale: 0.4 } );
    super( lockToMinorIntervalsProperty, false, true, {
      content: buttonIcon,
      baseColor: QuadrilateralColors.lockToSmallStepsButtonColorProperty,

      // voicing
      voicingHintResponse: 'When locked, corners and sides move in small steps.'
    } );

    const labelNode = new Text( 'Small Steps', {
      font: QuadrilateralConstants.SCREEN_TEXT_FONT,
      maxWidth: 250,
      leftCenter: this.rightCenter.plusXY( 10, 0 )
    } );
    this.addChild( labelNode );

    lockToMinorIntervalsProperty.link( lockToMinorIntervals => {
      this.voicingNameResponse = lockToMinorIntervals ? 'Small Steps Locked' : 'Small Steps Unlocked';
      this.voicingContextResponse = lockToMinorIntervals ? 'Corner and side movement locked to small steps.' : 'Shift key needed to make small steps.';

      this.voicingSpeakResponse( {
        nameResponse: this.voicingNameResponse,
        contextResponse: this.voicingContextResponse
      } );
    } );
  }
}

quadrilateral.register( 'MinorIntervalsToggleButton', MinorIntervalsToggleButton );
export default MinorIntervalsToggleButton;
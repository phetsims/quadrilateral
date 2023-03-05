// Copyright 2023, University of Colorado Boulder

/**
 * The UI component that locks motion for the QuadrilateralVertex to be constrained to the minor grid.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import quadrilateral from '../../quadrilateral.js';
import LockNode from '../../../../scenery-phet/js/LockNode.js';
import RectangularToggleButton, { RectangularToggleButtonOptions } from '../../../../sun/js/buttons/RectangularToggleButton.js';
import { Text } from '../../../../scenery/js/imports.js';
import QuadrilateralColors from '../../QuadrilateralColors.js';
import QuadrilateralConstants from '../../QuadrilateralConstants.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';

// constants
const smallStepsString = QuadrilateralStrings.smallSteps;
const hintResponseString = QuadrilateralStrings.a11y.voicing.minorIntervalsToggle.hintResponse;
const lockedNameResponseString = QuadrilateralStrings.a11y.voicing.minorIntervalsToggle.lockedNameResponse;
const unlockedNameResponseString = QuadrilateralStrings.a11y.voicing.minorIntervalsToggle.unlockedNameResponse;
const lockedContextResponseString = QuadrilateralStrings.a11y.voicing.minorIntervalsToggle.lockedContextResponse;
const unlockedContextResponseString = QuadrilateralStrings.a11y.voicing.minorIntervalsToggle.unlockedContextResponse;

type SelfOptions = EmptySelfOptions;
type SmallStepsLockToggleButtonOptions = SelfOptions & StrictOmit<RectangularToggleButtonOptions, 'content'>;

export default class SmallStepsLockToggleButton extends RectangularToggleButton<boolean> {
  public constructor( lockToMinorIntervalsProperty: Property<boolean>, providedOptions?: SmallStepsLockToggleButtonOptions ) {

    const buttonIcon = new LockNode( lockToMinorIntervalsProperty, { scale: 0.4 } );

    const options = optionize<SmallStepsLockToggleButtonOptions, SelfOptions, RectangularToggleButtonOptions>()( {
      content: buttonIcon,
      baseColor: QuadrilateralColors.screenViewButtonColorProperty,

      // voicing
      voicingHintResponse: hintResponseString
    }, providedOptions );

    super( lockToMinorIntervalsProperty, false, true, options );

    const labelNode = new Text( smallStepsString, {
      font: QuadrilateralConstants.SCREEN_TEXT_FONT,
      maxWidth: 100,
      leftCenter: this.rightCenter.plusXY( QuadrilateralConstants.CONTROL_LABEL_SPACING, 0 )
    } );
    this.addChild( labelNode );

    // voicing - update dynamic content and request Voicing when the change is made
    lockToMinorIntervalsProperty.link( lockToMinorIntervals => {

      // REVIEW: Why doesn't the IDE resolve these?  Is it because it's a mixin?
      // REVIEW: Why do these have to get assigned to state? Why can't voicingSpeakResponse assign them?
      this.voicingNameResponse = lockToMinorIntervals ? lockedNameResponseString : unlockedNameResponseString;
      this.voicingContextResponse = lockToMinorIntervals ? lockedContextResponseString : unlockedContextResponseString;

      this.voicingSpeakResponse( {
        nameResponse: this.voicingNameResponse,
        contextResponse: this.voicingContextResponse
      } );
    } );
  }
}

quadrilateral.register( 'SmallStepsLockToggleButton', SmallStepsLockToggleButton );

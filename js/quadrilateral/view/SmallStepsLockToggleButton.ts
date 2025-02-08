// Copyright 2023-2025, University of Colorado Boulder

/**
 * The UI component that locks motion for the QuadrilateralVertex to be constrained to the minor grid.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import LockNode from '../../../../scenery-phet/js/LockNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularToggleButton, { RectangularToggleButtonOptions } from '../../../../sun/js/buttons/RectangularToggleButton.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralColors from '../../QuadrilateralColors.js';
import QuadrilateralConstants from '../../QuadrilateralConstants.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';

// constants
const smallStepsStringProperty = QuadrilateralStrings.smallStepsStringProperty;
const hintResponseStringProperty = QuadrilateralStrings.a11y.voicing.minorIntervalsToggle.hintResponseStringProperty;
const lockedNameResponseStringProperty = QuadrilateralStrings.a11y.voicing.minorIntervalsToggle.lockedNameResponseStringProperty;
const unlockedNameResponseStringProperty = QuadrilateralStrings.a11y.voicing.minorIntervalsToggle.unlockedNameResponseStringProperty;
const lockedContextResponseStringProperty = QuadrilateralStrings.a11y.voicing.minorIntervalsToggle.lockedContextResponseStringProperty;
const unlockedContextResponseStringProperty = QuadrilateralStrings.a11y.voicing.minorIntervalsToggle.unlockedContextResponseStringProperty;

type SelfOptions = EmptySelfOptions;
type SmallStepsLockToggleButtonOptions = SelfOptions & StrictOmit<RectangularToggleButtonOptions, 'content'>;

export default class SmallStepsLockToggleButton extends Node {
  public constructor( lockToMinorIntervalsProperty: Property<boolean>, providedOptions?: SmallStepsLockToggleButtonOptions ) {

    const buttonIcon = new LockNode( lockToMinorIntervalsProperty, { scale: 0.4 } );

    const options = optionize<SmallStepsLockToggleButtonOptions, SelfOptions, RectangularToggleButtonOptions>()( {
      content: buttonIcon,
      baseColor: QuadrilateralColors.screenViewButtonColorProperty,

      // voicing
      voicingHintResponse: hintResponseStringProperty
    }, providedOptions );

    super();

    const button = new RectangularToggleButton( lockToMinorIntervalsProperty, false, true, options );

    const labelNode = new Text( smallStepsStringProperty, {
      font: QuadrilateralConstants.SCREEN_TEXT_FONT,
      maxWidth: 100,

      // so that this label does not interfere with enhanced touch areas below
      pickable: false
    } );

    // voicing - update dynamic content and request Voicing when the change is made
    lockToMinorIntervalsProperty.link( lockToMinorIntervals => {

      button.voicingNameResponse = lockToMinorIntervals ? lockedNameResponseStringProperty : unlockedNameResponseStringProperty;
      button.voicingContextResponse = lockToMinorIntervals ? lockedContextResponseStringProperty : unlockedContextResponseStringProperty;

      button.voicingSpeakResponse( {
        nameResponse: button.voicingNameResponse,
        contextResponse: button.voicingContextResponse
      } );
    } );

    this.children = [ button, labelNode ];

    // layout
    labelNode.leftCenter = button.rightCenter.plusXY( QuadrilateralConstants.CONTROL_LABEL_SPACING, 0 );
  }
}

quadrilateral.register( 'SmallStepsLockToggleButton', SmallStepsLockToggleButton );
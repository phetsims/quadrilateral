// Copyright 2022-2023, University of Colorado Boulder

/**
 * The UI component that locks into constraining Vertex positions to the minor grid.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import quadrilateral from '../../quadrilateral.js';
import LockNode from '../../../../scenery-phet/js/LockNode.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import QuadrilateralIconFactory from './QuadrilateralIconFactory.js';

class MinorIntervalsToggleSwitch extends Checkbox {
  public constructor( lockToMinorIntervalsProperty: Property<boolean> ) {

    const lockIcon = QuadrilateralIconFactory.createLabelledIcon(
      new LockNode( lockToMinorIntervalsProperty, { scale: 0.4 } ),
      'Small Steps'
    );
    super( lockToMinorIntervalsProperty, lockIcon, {
      spacing: 10,

      // TODO: Proposing these options, if design likes them lets refactor and do it right.
      // See https://github.com/phetsims/quadrilateral/issues/298.
      labelTagName: 'label',
      labelContent: 'Small Steps',

      voicingNameResponse: 'Small Steps',
      voicingHintResponse: 'When locked, move corners and sides in small steps with or without visual grid.',

      voicingCheckedObjectResponse: 'Locked',
      voicingUncheckedObjectResponse: 'Unlocked',

      checkedContextResponse: 'Corner and side movement locked to small steps.',
      uncheckedContextResponse: 'Small steps no longer locked. Add Shift key to make small steps.'
    } );

    // TODO: What is the name for this component? See ub.com/phetsims/quadrilateral/issues/298
    // const labelNode = new Text( 'Small Steps', {
    //   leftBottom: this.leftTop.minusXY( 0, 5 ),
    //   font: QuadrilateralConstants.SCREEN_TEXT_FONT,
    //   maxWidth: 250
    // } );
    // this.addChild( labelNode );
  }
}

quadrilateral.register( 'MinorIntervalsToggleSwitch', MinorIntervalsToggleSwitch );
export default MinorIntervalsToggleSwitch;
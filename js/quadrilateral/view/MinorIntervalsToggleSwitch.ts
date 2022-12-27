// Copyright 2022, University of Colorado Boulder

/**
 * The UI component that locks into constraining Vertex positions to the minor grid.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import quadrilateral from '../../quadrilateral.js';
import { Text } from '../../../../scenery/js/imports.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';

class MinorIntervalsToggleSwitch extends ToggleSwitch<boolean> {
  public constructor( lockToMinorIntervalsProperty: Property<boolean> ) {
    super( lockToMinorIntervalsProperty, false, true, {
      size: new Dimension2( 36, 18 )
    } );

    // TODO: What is the name for this component? See ub.com/phetsims/quadrilateral/issues/298
    const labelNode = new Text( 'Lock to small grid', {
      leftBottom: this.leftTop.minusXY( 0, 5 ),
      font: QuadrilateralConstants.SCREEN_TEXT_FONT,
      maxWidth: 250
    } );
    this.addChild( labelNode );
  }
}

quadrilateral.register( 'MinorIntervalsToggleSwitch', MinorIntervalsToggleSwitch );
export default MinorIntervalsToggleSwitch;
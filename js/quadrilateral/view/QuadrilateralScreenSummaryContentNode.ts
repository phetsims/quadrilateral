// Copyright 2022, University of Colorado Boulder

/**
 * Descriptions and PDOM structure for the screen summary of Quadrilateral.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import { Node } from '../../../../scenery/js/imports.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';

// constants
const playAreaDescriptionString = quadrilateralStrings.a11y.screenSummary.playAreaDescription;
const controlAreaDescriptionString = quadrilateralStrings.a11y.screenSummary.controlAreaDescription;

class QuadrilateralScreenSummaryContentNode extends Node {
  constructor() {
    super();

    // A description of what is in the play area
    this.addChild( new Node( {
      tagName: 'p',
      innerContent: playAreaDescriptionString
    } ) );

    // a Description of the control area
    this.addChild( new Node( {
      tagName: 'p',
      innerContent: controlAreaDescriptionString
    } ) );
  }
}

quadrilateral.register( 'QuadrilateralScreenSummaryContentNode', QuadrilateralScreenSummaryContentNode );
export default QuadrilateralScreenSummaryContentNode;

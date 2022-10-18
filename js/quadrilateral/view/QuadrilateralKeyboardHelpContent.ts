// Copyright 2022, University of Colorado Boulder

/**
 * The keyboard help content for the Quadrilateral sim. This has yet to be designed and is just ready for more content.
 * TODO: Finish this in https://github.com/phetsims/quadrilateral/issues/249
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import { Node } from '../../../../scenery/js/imports.js';

class QuadrilateralKeyboardHelpContent extends Node {
  public constructor() {
    const generalContent = new BasicActionsKeyboardHelpSection();
    super( {
      children: [ generalContent ]
    } );
  }
}

quadrilateral.register( 'QuadrilateralKeyboardHelpContent', QuadrilateralKeyboardHelpContent );
export default QuadrilateralKeyboardHelpContent;

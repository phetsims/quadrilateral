// Copyright 2022, University of Colorado Boulder

/**
 * The keyboard help content for the Quadrilateral sim. This has yet to be designed and is just ready for more content.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import MoveShapeHelpSection from './MoveShapeHelpSection.js';
import ShapeShortcutsHelpSection from './ShapeShortcutsHelpSection.js';

class QuadrilateralKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {

    // sim-specific help content about how to interact with the shape
    const moveShapeHelpSection = new MoveShapeHelpSection();
    const shapeShortcutsHelpSection = new ShapeShortcutsHelpSection();
    KeyboardHelpSection.alignHelpSectionIcons( [ moveShapeHelpSection, shapeShortcutsHelpSection ] );
    const leftContent = [ moveShapeHelpSection, shapeShortcutsHelpSection ];

    const rightContent = [ new BasicActionsKeyboardHelpSection() ];

    super( leftContent, rightContent );
  }
}

quadrilateral.register( 'QuadrilateralKeyboardHelpContent', QuadrilateralKeyboardHelpContent );
export default QuadrilateralKeyboardHelpContent;

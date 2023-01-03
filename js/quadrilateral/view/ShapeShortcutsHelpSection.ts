// Copyright 2023, University of Colorado Boulder

/**
 * Help content for the KeyboardHelpDialog, describing how to reset the shape and get information about the shape
 * (when Voicing is enabled).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import LetterKeyNode from '../../../../scenery-phet/js/keyboard/LetterKeyNode.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import { voicingManager } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';

// Voicing is NOT translatable and will never be
const checkShapeWithVoicingString = 'With Voicing enabled Check Current Shape';

class ShapeShortcutsHelpSection extends KeyboardHelpSection {
  public constructor() {

    // command to check current shape with Voicing
    const checkShapeRow = KeyboardHelpSectionRow.labelWithIcon(
      checkShapeWithVoicingString,
      KeyboardHelpIconFactory.altPlusIcon( new LetterKeyNode( 'C' ) ), {
        labelOptions: {
          lineWrap: 175
        }
      }
    );

    // command to reset the shape
    const resetShapeRow = KeyboardHelpSectionRow.labelWithIcon(
      QuadrilateralStrings.keyboardHelpDialog.resetShape,
      KeyboardHelpIconFactory.iconPlusIconRow(
        [
          TextKeyNode.alt(),
          TextKeyNode.shift(),
          new LetterKeyNode( 'R' )
        ]
      )
    );

    const contents = [];
    if ( voicingManager.initialized ) {
      contents.push( checkShapeRow );
    }
    contents.push( resetShapeRow );

    super( QuadrilateralStrings.keyboardHelpDialog.shapeShortcuts, contents );
  }
}

quadrilateral.register( 'ShapeShortcutsHelpSection', ShapeShortcutsHelpSection );
export default ShapeShortcutsHelpSection;

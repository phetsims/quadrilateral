// Copyright 2023, University of Colorado Boulder

/**
 * Help content for the KeyboardHelpDialog describing how to change the shape by moving
 * sides and vertices.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import { Text } from '../../../../scenery/js/imports.js';

class MoveShapeHelpSection extends KeyboardHelpSection {
  public constructor() {

    // basic movement
    const basicMovementRow = KeyboardHelpSectionRow.labelWithIcon(
      QuadrilateralStrings.keyboardHelpDialog.moveASideOrCorner,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon()
    );

    // fine-grained movement
    const fineMovementRow = KeyboardHelpSectionRow.labelWithIconList(
      QuadrilateralStrings.keyboardHelpDialog.moveASideOrCornerInSmallerSteps,
      [
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( new Text( 'Mouse', {
          font: KeyboardHelpSectionRow.LABEL_FONT
        } ) )
      ], {
        labelOptions: {
          lineWrap: 175
        }
      }
    );

    super( QuadrilateralStrings.keyboardHelpDialog.moveSidesOrCorners, [ basicMovementRow, fineMovementRow ] );
  }
}

quadrilateral.register( 'MoveShapeHelpSection', MoveShapeHelpSection );
export default MoveShapeHelpSection;

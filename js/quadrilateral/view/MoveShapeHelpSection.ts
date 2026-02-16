// Copyright 2023-2026, University of Colorado Boulder

/**
 * Help content for the KeyboardHelpDialog describing how to change the shape by moving sides and vertices.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import QuadrilateralKeyboardHelpContent from './QuadrilateralKeyboardHelpContent.js';

// constants - Voicing strings not translatable
const smallerStepsDescriptionStringProperty = QuadrilateralStrings.a11y.keyboardHelpDialog.smallerStepsDescriptionStringProperty;
const moveACornerOrSideStringProperty = QuadrilateralStrings.keyboardHelpDialog.moveCornerOrSideStringProperty;
const moveInSmallerStepsStringProperty = QuadrilateralStrings.keyboardHelpDialog.moveInSmallerStepsStringProperty;
const mouseStringProperty = QuadrilateralStrings.keyboardHelpDialog.mouseStringProperty;
const moveCornersOrSidesStringProperty = QuadrilateralStrings.keyboardHelpDialog.moveCornersOrSidesStringProperty;

export default class MoveShapeHelpSection extends KeyboardHelpSection {
  public constructor() {

    // basic movement
    const basicMovementRow = KeyboardHelpSectionRow.fromHotkeyData( KeyboardDragListener.MOVE_HOTKEY_DATA, {
      labelStringProperty: moveACornerOrSideStringProperty
    } );

    // fine-grained movement - Cannot use fromHotkeyData here because of the very
    // unusual mouse row. I am not building the concept of 'mouse' into HotkeyData
    // at this time.
    const fineMovementRow = KeyboardHelpSectionRow.labelWithIconList(
      moveInSmallerStepsStringProperty,
      [
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( new Text( mouseStringProperty, {
          font: KeyboardHelpSectionRow.LABEL_FONT,
          maxWidth: 100 // by inspection
        } ) )
      ], {
        labelOptions: {
          lineWrap: QuadrilateralKeyboardHelpContent.LABEL_LINE_WRAP
        },
        accessibleRowDescriptionProperty: smallerStepsDescriptionStringProperty
      }
    );

    const rows = [ basicMovementRow, fineMovementRow ];
    super( moveCornersOrSidesStringProperty, rows );
  }
}

quadrilateral.register( 'MoveShapeHelpSection', MoveShapeHelpSection );
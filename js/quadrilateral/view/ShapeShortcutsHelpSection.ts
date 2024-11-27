// Copyright 2023-2024, University of Colorado Boulder

/**
 * Help content for the KeyboardHelpDialog, describing how to reset the shape and get information about the shape
 * (when Voicing is enabled).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import localeProperty from '../../../../joist/js/i18n/localeProperty.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import { voicingManager } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import QuadrilateralKeyboardHelpContent from './QuadrilateralKeyboardHelpContent.js';
import QuadrilateralNode from './QuadrilateralNode.js';

export default class ShapeShortcutsHelpSection extends KeyboardHelpSection {
  public constructor() {

    // command to check current shape with Voicing
    const checkShapeRow = KeyboardHelpSectionRow.fromHotkeyData( QuadrilateralNode.CHECK_SHAPE_HOTKEY_DATA, {
      labelWithIconOptions: {
        labelOptions: {
          lineWrap: QuadrilateralKeyboardHelpContent.LABEL_LINE_WRAP
        }
      }
    } );

    // command to reset the shape
    const resetShapeRow = KeyboardHelpSectionRow.fromHotkeyData( QuadrilateralNode.RESET_SHAPE_HOTKEY_DATA, {
      labelWithIconOptions: {
        labelOptions: {
          lineWrap: QuadrilateralKeyboardHelpContent.LABEL_LINE_WRAP
        }
      }
    } );

    const contents: KeyboardHelpSectionRow[] = [];
    contents.push( checkShapeRow );
    contents.push( resetShapeRow );

    // This content only pertains to the Voicing feature which is only available in English. Hide if running in a
    // different language or if language changes from dynamic locales.
    localeProperty.link( locale => {
      checkShapeRow.setContentsVisible( voicingManager.voicingSupportedForLocale( locale ) );
    } );

    super( QuadrilateralStrings.keyboardHelpDialog.shapeShortcutsStringProperty, contents );
  }
}

quadrilateral.register( 'ShapeShortcutsHelpSection', ShapeShortcutsHelpSection );
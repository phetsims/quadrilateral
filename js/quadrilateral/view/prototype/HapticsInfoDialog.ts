// Copyright 2022, University of Colorado Boulder

/**
 * A dialog that can be shown at sim load time to get the user to touch the screen and thus enable vibrational haptics.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import PhetColorScheme from '../../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { RichText, VBox } from '../../../../../scenery/js/imports.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import Dialog from '../../../../../sun/js/Dialog.js';
import nullSoundPlayer from '../../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import quadrilateral from '../../../quadrilateral.js';
import QuadrilateralStrings from '../../../QuadrilateralStrings.js';

class HapticsInfoDialog extends Dialog {

  public constructor() {

    const text = new RichText( QuadrilateralStrings.hapticsDialogMessage, {
      font: new PhetFont( 16 )
    } );

    const button = new TextPushButton( QuadrilateralStrings.gotIt, {
      font: new PhetFont( 24 ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      soundPlayer: nullSoundPlayer, // the dialog produces sound when dismissed, so no button sound is needed
      listener: () => this.hide()
    } );

    const content = new VBox( {
      children: [ text, button ],
      spacing: 50
    } );

    super( content, {
      xSpacing: 30,
      topMargin: 30,
      bottomMargin: 30,
      leftMargin: 30
    } );
  }
}

quadrilateral.register( 'HapticsInfoDialog', HapticsInfoDialog );
export default HapticsInfoDialog;
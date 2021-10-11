// Copyright 2021, University of Colorado Boulder

/**
 * Options for the Preferences Dialog that allow us to set the base sound file.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import soundFileProperty from '../../common/soundFileProperty.js';
import quadrilateral from '../../quadrilateral.js';

const TEXT_OPTIONS = {
  font: new PhetFont( { size: 16 } )
};

class QuadrilateralSoundOptionsNode extends Panel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const radioButtonItems = [
      {
        node: new Text( 'Sound One', TEXT_OPTIONS ),
        value: soundFileProperty.enumeration.ONE,
        tandemName: 'soundOneRadioButton'
      },
      {
        node: new Text( 'Sound Two', TEXT_OPTIONS ),
        value: soundFileProperty.enumeration.TWO,
        tandemName: 'soundTwoRadioButton'
      },
      {
        node: new Text( 'Sound Three', TEXT_OPTIONS ),
        value: soundFileProperty.enumeration.THREE,
        tandemName: 'soundThreeRadioButton'
      },
      {
        node: new Text( 'Sound Four', TEXT_OPTIONS ),
        value: soundFileProperty.enumeration.FOUR,
        tandemName: 'soundFourRadioButton'
      }
    ];

    const optionsRadioButtonGroup = new VerticalAquaRadioButtonGroup( soundFileProperty, radioButtonItems, {
      tandem: tandem.createTandem( 'optionsRadioButtonGroup' )
    } );
    super( optionsRadioButtonGroup );
  }
}

quadrilateral.register( 'QuadrilateralSoundOptionsNode', QuadrilateralSoundOptionsNode );
export default QuadrilateralSoundOptionsNode;

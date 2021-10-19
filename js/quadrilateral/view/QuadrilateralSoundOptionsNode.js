// Copyright 2021, University of Colorado Boulder

/**
 * Options for the Preferences Dialog that allow us to set the base sound file.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';

const LABEL_TEXT_OPTIONS = {
  font: new PhetFont( { size: 16 } )
};

const TITLE_TEXT_OPTIONS = {
  font: new PhetFont( { size: 16, weight: 'bold' } )
};

const TITLE_SPACING = 15;

class QuadrilateralSoundOptionsNode extends Panel {

  /**
   * @param {QuadrilateralSoundOptionsModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    const soundDesignLabelText = new Text( 'Sound Design', TITLE_TEXT_OPTIONS );

    const optionsParentNode = new Node();
    const designComboBox = new ComboBox( [
      new ComboBoxItem( new Text( 'Quartet', LABEL_TEXT_OPTIONS ), QuadrilateralSoundOptionsModel.SoundDesign.QUARTET ),
      new ComboBoxItem( new Text( 'Parallels Volume', LABEL_TEXT_OPTIONS ), QuadrilateralSoundOptionsModel.SoundDesign.PARALLELS_VOLUME ),
      new ComboBoxItem( new Text( 'Parallels Staccato', LABEL_TEXT_OPTIONS ), QuadrilateralSoundOptionsModel.SoundDesign.PARALLELS_STACCATO )
    ], model.soundDesignProperty, optionsParentNode );

    const labelledComboBox = new HBox( {
      children: [ soundDesignLabelText, designComboBox ],
      spacing: TITLE_SPACING
    } );
    const comboBoxWithParentNode = new Node( {
      children: [ labelledComboBox, optionsParentNode ]
    } );

    const baseSoundLabelText = new Text( 'Base Sound', TITLE_TEXT_OPTIONS );

    const radioButtonItems = [
      {
        node: new Text( 'Sound One', LABEL_TEXT_OPTIONS ),
        value: model.baseSoundFileProperty.enumeration.ONE,
        tandemName: 'soundOneRadioButton'
      },
      {
        node: new Text( 'Sound Two', LABEL_TEXT_OPTIONS ),
        value: model.baseSoundFileProperty.enumeration.TWO,
        tandemName: 'soundTwoRadioButton'
      },
      {
        node: new Text( 'Sound Three', LABEL_TEXT_OPTIONS ),
        value: model.baseSoundFileProperty.enumeration.THREE,
        tandemName: 'soundThreeRadioButton'
      },
      {
        node: new Text( 'Sound Four', LABEL_TEXT_OPTIONS ),
        value: model.baseSoundFileProperty.enumeration.FOUR,
        tandemName: 'soundFourRadioButton'
      }
    ];

    const optionsRadioButtonGroup = new VerticalAquaRadioButtonGroup( model.baseSoundFileProperty, radioButtonItems, {
      tandem: tandem.createTandem( 'optionsRadioButtonGroup' )
    } );

    const labelledRadioButtons = new HBox( {
      children: [ baseSoundLabelText, optionsRadioButtonGroup ],
      spacing: 15
    } );

    const content = new VBox( {
      children: [
        comboBoxWithParentNode,
        labelledRadioButtons
      ],
      align: 'left'
    } );

    super( content, {
      resize: false
    } );

    model.soundDesignProperty.link( design => {
      labelledRadioButtons.visible = design !== QuadrilateralSoundOptionsModel.SoundDesign.PARALLELS_STACCATO;
    } );
  }
}

quadrilateral.register( 'QuadrilateralSoundOptionsNode', QuadrilateralSoundOptionsNode );
export default QuadrilateralSoundOptionsNode;

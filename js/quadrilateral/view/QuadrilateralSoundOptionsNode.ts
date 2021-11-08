// Copyright 2021, University of Colorado Boulder

/**
 * Options for the Preferences Dialog that allow us to set the sound design and sub-options. Sounds are
 * being actively designed while we implement them and we are adding all designs at once. TThe sounds can be selected
 * and controlled by the UI that is provided by this Node.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSoundOptionsModel, { SoundDesign } from '../model/QuadrilateralSoundOptionsModel.js';

const LABEL_TEXT_OPTIONS = {
  font: new PhetFont( { size: 16 } )
};

const TITLE_TEXT_OPTIONS = {
  font: new PhetFont( { size: 16, weight: 'bold' } )
};

// spacing between title for option and the content Node
const TITLE_SPACING = 15;

class QuadrilateralSoundOptionsNode extends Panel {
  public constructor( model: QuadrilateralSoundOptionsModel, tandem: Tandem ) {

    const soundDesignLabelText = new Text( 'Sound Design', TITLE_TEXT_OPTIONS );

    const optionsParentNode = new Node();
    const designComboBox = new ComboBox( [
      new ComboBoxItem( new Text( 'Success Sounds', LABEL_TEXT_OPTIONS ), QuadrilateralSoundOptionsModel.SoundDesign.SUCCESS_SOUNDS, { tandemName: 'successItem' } ),
      new ComboBoxItem( new Text( 'Quartet', LABEL_TEXT_OPTIONS ), QuadrilateralSoundOptionsModel.SoundDesign.QUARTET, { tandemName: 'quartetItem' } ),
      new ComboBoxItem( new Text( 'Parallels Volume', LABEL_TEXT_OPTIONS ), QuadrilateralSoundOptionsModel.SoundDesign.PARALLELS_VOLUME, { tandemName: 'parallelsVolumeItem' } ),
      new ComboBoxItem( new Text( 'Parallels Staccato', LABEL_TEXT_OPTIONS ), QuadrilateralSoundOptionsModel.SoundDesign.PARALLELS_STACCATO, { tandemName: 'parallelsStaccatoItem' } )
    ], model.soundDesignProperty, optionsParentNode, {

      tandem: tandem.createTandem( 'designComboBox' )
    } );

    const labelledComboBox = new HBox( {
      children: [ soundDesignLabelText, designComboBox ],
      spacing: TITLE_SPACING
    } );
    const comboBoxWithParentNode = new Node( {
      children: [ labelledComboBox, optionsParentNode ]
    } );

    const baseSoundRadioButtonItems = [
      {
        node: new Text( 'Sound One', LABEL_TEXT_OPTIONS ),

        // @ts-ignore - TODO: How do we do Enumeration?
        value: model.baseSoundFileProperty.enumeration.ONE,
        tandemName: 'soundOneRadioButton'
      },
      {
        node: new Text( 'Sound Two', LABEL_TEXT_OPTIONS ),

        // @ts-ignore - TODO: How do we do Enumeration?
        value: model.baseSoundFileProperty.enumeration.TWO,
        tandemName: 'soundTwoRadioButton'
      },
      {
        node: new Text( 'Sound Three', LABEL_TEXT_OPTIONS ),

        // @ts-ignore - TODO: How do we do Enumeration?
        value: model.baseSoundFileProperty.enumeration.THREE,
        tandemName: 'soundThreeRadioButton'
      },
      {
        node: new Text( 'Sound Four', LABEL_TEXT_OPTIONS ),

        // @ts-ignore - TODO: How do we do Enumeration?
        value: model.baseSoundFileProperty.enumeration.FOUR,
        tandemName: 'soundFourRadioButton'
      }
    ];

    const labelledBaseSoundRadioButtonGroup = new LabelledRadioButtonGroup( model.baseSoundFileProperty, baseSoundRadioButtonItems, 'Base Sound', tandem.createTandem( 'labelledBaseSoundRadioButtonGroup' ) );

    const successSoundRadioButtonItems = [
      {
        node: new Text( 'Collection One', LABEL_TEXT_OPTIONS ),

        // @ts-ignore - TODO: How do we do Enumeration?
        value: model.successSoundFileProperty.enumeration.ONE,
        tandemName: 'soundCollectionOneRadioButton'
      },
      {
        node: new Text( 'Collection Two', LABEL_TEXT_OPTIONS ),

        // @ts-ignore - TODO: How do we do Enumeration?
        value: model.successSoundFileProperty.enumeration.TWO,
        tandemName: 'soundCollectionTwoRadioButton'
      },
      {
        node: new Text( 'Collection Three', LABEL_TEXT_OPTIONS ),

        // @ts-ignore - TODO: How do we do Enumeration?
        value: model.successSoundFileProperty.enumeration.THREE,
        tandemName: 'soundCollectionThreeRadioButton'
      },
      {
        node: new Text( 'Collection Four', LABEL_TEXT_OPTIONS ),

        // @ts-ignore - TODO: How do we do Enumeration?
        value: model.successSoundFileProperty.enumeration.FOUR,
        tandemName: 'soundCollectionFourRadioButton'
      }
    ];

    const labelledSuccessSoundRadioButtonGroup = new LabelledRadioButtonGroup( model.successSoundFileProperty, successSoundRadioButtonItems, 'Success Sounds', tandem.createTandem( 'labelledSuccessSoundRadioButtonGroup' ) );

    const content = new VBox( {
      children: [
        comboBoxWithParentNode,
        labelledBaseSoundRadioButtonGroup
      ],
      align: 'left'
    } );

    super( content, {
      resize: false
    } );

    // @ts-ignore - TODO: How to we do Enumeration with TypeScript?
    model.soundDesignProperty.link( ( design: SoundDesign ) => {

      // modify children instead of changing visibility for layout purposes
      const children = [ comboBoxWithParentNode ];
      if ( design === QuadrilateralSoundOptionsModel.SoundDesign.QUARTET ||
           design === QuadrilateralSoundOptionsModel.SoundDesign.PARALLELS_VOLUME ) {

        // "Quartet" and "Parallels Volume" use a base sound for all output which can be changed
        children.push( labelledBaseSoundRadioButtonGroup );
      }
      else if ( design === QuadrilateralSoundOptionsModel.SoundDesign.SUCCESS_SOUNDS ) {

        // there are different sets of "success" sounds in this prototype
        children.push( labelledSuccessSoundRadioButtonGroup );
      }

      content.children = children;
    } );
  }
}

/**
 * An inner class for a radio button group that has a visual Text label. These
 * radio buttons are often sub-options under one of the sound design prototypes.
 */
class LabelledRadioButtonGroup extends VBox {

  /**
   * @param property - a Property of QuadrilateralSoundOptionsModel
   * @param items - type `any` until AquaRadioButtonGroup is in TypeScript
   * @param labelString
   * @param tandem
   */
  constructor( property: EnumerationProperty, items: any, labelString: string, tandem: Tandem ) {
    const labelText = new Text( labelString, TITLE_TEXT_OPTIONS );
    const radioButtonGroup = new VerticalAquaRadioButtonGroup( property, items, {
      tandem: tandem.createTandem( 'radioButtonGroup' )
    } );

    super( {
      children: [ labelText, radioButtonGroup ],
      spacing: 15
    } );
  }
}

quadrilateral.register( 'QuadrilateralSoundOptionsNode', QuadrilateralSoundOptionsNode );
export default QuadrilateralSoundOptionsNode;

// Copyright 2021-2022, University of Colorado Boulder

/**
 * Options for the Preferences Dialog that allow us to set the sound design and sub-options. Sounds are
 * being actively designed while we implement them and we are adding all designs at once. TThe sounds can be selected
 * and controlled by the UI that is provided by this Node.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSoundOptionsModel, { QuartetSoundFile, SoundDesign, SuccessSoundFile } from '../model/QuadrilateralSoundOptionsModel.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';

const LABEL_TEXT_OPTIONS = {
  font: new PhetFont( { size: 16 } )
};

const TITLE_TEXT_OPTIONS = {
  font: new PhetFont( { size: 16, weight: 'bold' } )
};

// spacing between title for option and the content Node
const TITLE_SPACING = 15;

class QuadrilateralSoundOptionsNode extends Panel {

  // Necessary for PhET-iO state and disposal since these components become dynamic when they live in a phetio capsule
  private readonly disposeQuadrilateralSoundOptionsNode: () => void;

  public constructor( model: QuadrilateralSoundOptionsModel, tandem: Tandem ) {

    const soundDesignLabelText = new Text( 'Sound Design', TITLE_TEXT_OPTIONS );

    const optionsParentNode = new Node();
    const designComboBox = new ComboBox( model.soundDesignProperty, [
      {
        value: SoundDesign.MAINTENANCE_SOUNDS,
        node: new Text( 'Maintenance Sounds', LABEL_TEXT_OPTIONS ),
        tandemName: `successWithMaintenance${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      },
      {
        value: SoundDesign.SUCCESS_SOUNDS,
        node: new Text( 'Success Sounds', LABEL_TEXT_OPTIONS ),
        tandemName: `success${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      },
      {
        value: SoundDesign.QUARTET,
        node: new Text( 'Quartet', LABEL_TEXT_OPTIONS ),
        tandemName: `quartet${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      },
      {
        value: SoundDesign.PARALLELS_VOLUME,
        node: new Text( 'Parallels Volume', LABEL_TEXT_OPTIONS ),
        tandemName: `parallelsVolume${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      },
      {
        value: SoundDesign.PARALLELS_STACCATO,
        node: new Text( 'Parallels Staccato', LABEL_TEXT_OPTIONS ),
        tandemName: `parallelsStaccato${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      }
    ], optionsParentNode, {

      tandem: tandem.createTandem( 'designComboBox' )
    } );

    const labelledComboBox = new HBox( {
      children: [ soundDesignLabelText, designComboBox ],
      spacing: TITLE_SPACING
    } );

    const baseSoundRadioButtonItems = [
      {
        node: new Text( 'Sound One', LABEL_TEXT_OPTIONS ),

        value: QuartetSoundFile.ONE,
        tandemName: 'soundOneRadioButton'
      },
      {
        node: new Text( 'Sound Two', LABEL_TEXT_OPTIONS ),

        value: QuartetSoundFile.TWO,
        tandemName: 'soundTwoRadioButton'
      },
      {
        node: new Text( 'Sound Three', LABEL_TEXT_OPTIONS ),

        value: QuartetSoundFile.THREE,
        tandemName: 'soundThreeRadioButton'
      },
      {
        node: new Text( 'Sound Four', LABEL_TEXT_OPTIONS ),

        value: QuartetSoundFile.FOUR,
        tandemName: 'soundFourRadioButton'
      }
    ];

    const labelledBaseSoundRadioButtonGroup = new LabelledRadioButtonGroup( model.baseSoundFileProperty, baseSoundRadioButtonItems, 'Base Sound', tandem.createTandem( 'labelledBaseSoundRadioButtonGroup' ) );

    const successSoundRadioButtonItems = [
      {
        node: new Text( 'Collection One', LABEL_TEXT_OPTIONS ),
        value: SuccessSoundFile.ONE,
        tandemName: 'soundCollectionOneRadioButton'
      },
      {
        node: new Text( 'Collection Two', LABEL_TEXT_OPTIONS ),
        value: SuccessSoundFile.TWO,
        tandemName: 'soundCollectionTwoRadioButton'
      },
      {
        node: new Text( 'Collection Three', LABEL_TEXT_OPTIONS ),
        value: SuccessSoundFile.THREE,
        tandemName: 'soundCollectionThreeRadioButton'
      },
      {
        node: new Text( 'Collection Four', LABEL_TEXT_OPTIONS ),
        value: SuccessSoundFile.FOUR,
        tandemName: 'soundCollectionFourRadioButton'
      }
    ];

    const labelledSuccessSoundRadioButtonGroup = new LabelledRadioButtonGroup( model.successSoundFileProperty, successSoundRadioButtonItems, 'Success Sounds', tandem.createTandem( 'labelledSuccessSoundRadioButtonGroup' ) );

    // a checkbox to control the behavior of the maintenance sound
    const maintenanceOptionLabel = new Text( 'Constant lengths for maintenance sound', LABEL_TEXT_OPTIONS );

    const maintenanceSoundCheckbox = new Checkbox( model.maintenanceSoundRequiresEqualLengthsProperty, maintenanceOptionLabel, {
      tandem: tandem.createTandem( 'maintenanceSoundCheckbox' )
    } );

    const content = new VBox( {
      children: [
        labelledComboBox,
        labelledBaseSoundRadioButtonGroup
      ],
      spacing: 15,
      align: 'left'
    } );

    super( content, {
      resize: true
    } );

    this.addChild( optionsParentNode );

    model.soundDesignProperty.link( design => {

      // modify children instead of changing visibility for layout purposes
      const children: Node[] = [ labelledComboBox ];
      if ( design === SoundDesign.QUARTET ||
           design === SoundDesign.PARALLELS_VOLUME ) {

        // "Quartet" and "Parallels Volume" use a base sound for all output which can be changed
        children.push( labelledBaseSoundRadioButtonGroup );
      }
      else if ( design === SoundDesign.SUCCESS_SOUNDS || design === SoundDesign.MAINTENANCE_SOUNDS ) {

        // there are different sets of "success" sounds for these prototypes
        children.push( labelledSuccessSoundRadioButtonGroup );

        // Not available for the "maintenance" design because that design already includes
        // what this checkbox provides by default
        if ( design === SoundDesign.SUCCESS_SOUNDS ) {

          // The "success" design has options for how the maintenance sound behaves
          children.push( maintenanceSoundCheckbox );
        }
      }

      content.children = children;
    } );

    this.disposeQuadrilateralSoundOptionsNode = () => {
      designComboBox.dispose();
      labelledBaseSoundRadioButtonGroup.dispose();
      labelledSuccessSoundRadioButtonGroup.dispose();
      maintenanceSoundCheckbox.dispose();
    };
  }

  public override dispose(): void {
    this.disposeQuadrilateralSoundOptionsNode();
    super.dispose();
  }
}

/**
 * An inner class for a radio button group that has a visual Text label. These
 * radio buttons are often sub-options under one of the sound design prototypes.
 */
class LabelledRadioButtonGroup extends VBox {

  // Necessary for phet-io to clean up tandems
  private readonly disposeLabelledRadioButtonGroup: () => void;

  public constructor( property: EnumerationProperty<QuartetSoundFile | SuccessSoundFile>, items: AquaRadioButtonGroupItem<QuartetSoundFile | SuccessSoundFile>[], labelString: string, tandem: Tandem ) {
    const labelText = new Text( labelString, TITLE_TEXT_OPTIONS );
    const radioButtonGroup = new VerticalAquaRadioButtonGroup( property, items, {
      tandem: tandem.createTandem( 'radioButtonGroup' )
    } );

    super( {
      children: [ labelText, radioButtonGroup ],
      spacing: 15
    } );

    this.disposeLabelledRadioButtonGroup = () => {
      radioButtonGroup.dispose();
    };
  }

  public override dispose(): void {
    this.disposeLabelledRadioButtonGroup();
    super.dispose();
  }
}

quadrilateral.register( 'QuadrilateralSoundOptionsNode', QuadrilateralSoundOptionsNode );
export default QuadrilateralSoundOptionsNode;

// Copyright 2021-2022, University of Colorado Boulder

/**
 * Options for the Preferences Dialog that allow us to set the sound design and sub-options. Sounds are
 * being actively designed while we implement them and we are adding all designs at once. TThe sounds can be selected
 * and controlled by the UI that is provided by this Node.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text, VBox } from '../../../../../scenery/js/imports.js';
import ComboBox from '../../../../../sun/js/ComboBox.js';
import Panel from '../../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import quadrilateral from '../../../quadrilateral.js';
import QuadrilateralSoundOptionsModel, { QuartetSoundFile, SoundDesign, SuccessSoundFile } from '../../model/QuadrilateralSoundOptionsModel.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import { AquaRadioButtonGroupItem } from '../../../../../sun/js/AquaRadioButtonGroup.js';
import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';

const LABEL_TEXT_OPTIONS = {
  font: new PhetFont( { size: 16 } )
};

const TITLE_TEXT_OPTIONS = {
  font: new PhetFont( { size: 16, weight: 'bold' } )
};

// all of the "tracks" sound designs which have special settings
const TRACKS_SOUND_DESIGNS = [
  SoundDesign.TRACKS_ARPEGGIO,
  SoundDesign.TRACKS_BUILD_UP,
  SoundDesign.TRACKS_MELODY,
  SoundDesign.TRACKS_VOLUME_EMPHASIS,
  SoundDesign.TRACKS_BUILD_UP_SIMPLE,
  SoundDesign.TRACKS_MELODY_SIMPLE,
  SoundDesign.TRACKS_MELODY_MAPPING
];

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
        value: SoundDesign.TRACKS_BUILD_UP_SIMPLE,
        node: new Text( 'Building (Default)', LABEL_TEXT_OPTIONS ),
        tandemName: `tracksBuildUpSimple${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      },
      {
        value: SoundDesign.TRACKS_VOLUME_EMPHASIS,
        node: new Text( 'Shape Emphasis', LABEL_TEXT_OPTIONS ),
        tandemName: `tracksVolume${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      }
    ], optionsParentNode, {
      tandem: tandem.createTandem( 'designComboBox' )
    } );

    const labelledComboBox = new HBox( {
      children: [ soundDesignLabelText, designComboBox ],
      align: 'top',
      minContentHeight: 200,
      resize: false,
      spacing: TITLE_SPACING
    } );

    const baseSoundRadioButtonItems: AquaRadioButtonGroupItem<QuartetSoundFile>[] = [
      {
        createNode: tandem => new Text( 'Sound One', LABEL_TEXT_OPTIONS ),

        value: QuartetSoundFile.QUARTET_ONE,
        tandemName: 'soundOneRadioButton'
      },
      {
        createNode: tandem => new Text( 'Sound Two', LABEL_TEXT_OPTIONS ),

        value: QuartetSoundFile.QUARTET_TWO,
        tandemName: 'soundTwoRadioButton'
      },
      {
        createNode: tandem => new Text( 'Sound Three', LABEL_TEXT_OPTIONS ),

        value: QuartetSoundFile.QUARTET_THREE,
        tandemName: 'soundThreeRadioButton'
      },
      {
        createNode: tandem => new Text( 'Sound Four', LABEL_TEXT_OPTIONS ),

        value: QuartetSoundFile.QUARTET_FOUR,
        tandemName: 'soundFourRadioButton'
      }
    ];

    const labelledBaseSoundRadioButtonGroup = new LabelledRadioButtonGroup( model.baseSoundFileProperty, baseSoundRadioButtonItems, 'Base Sound', tandem.createTandem( 'labelledBaseSoundRadioButtonGroup' ) );

    const successSoundRadioButtonItems: AquaRadioButtonGroupItem<SuccessSoundFile>[] = [
      {
        createNode: tandem => new Text( 'Collection One', LABEL_TEXT_OPTIONS ),
        value: SuccessSoundFile.SUCCESS_ONE,
        tandemName: 'soundCollectionOneRadioButton'
      },
      {
        createNode: tandem => new Text( 'Collection Two', LABEL_TEXT_OPTIONS ),
        value: SuccessSoundFile.SUCCESS_TWO,
        tandemName: 'soundCollectionTwoRadioButton'
      },
      {
        createNode: tandem => new Text( 'Collection Three', LABEL_TEXT_OPTIONS ),
        value: SuccessSoundFile.SUCCESS_THREE,
        tandemName: 'soundCollectionThreeRadioButton'
      },
      {
        createNode: tandem => new Text( 'Collection Four', LABEL_TEXT_OPTIONS ),
        value: SuccessSoundFile.SUCCESS_FOUR,
        tandemName: 'soundCollectionFourRadioButton'
      }
    ];

    const labelledSuccessSoundRadioButtonGroup = new LabelledRadioButtonGroup( model.successSoundFileProperty, successSoundRadioButtonItems, 'Success Sounds', tandem.createTandem( 'labelledSuccessSoundRadioButtonGroup' ) );

    // a checkbox to control the behavior of the maintenance sound
    const maintenanceOptionLabel = new Text( 'Constant lengths for maintenance sound', LABEL_TEXT_OPTIONS );
    const maintenanceSoundCheckbox = new Checkbox( model.maintenanceSoundRequiresEqualLengthsProperty, maintenanceOptionLabel, {
      tandem: tandem.createTandem( 'maintenanceSoundCheckbox' )
    } );

    const tracksPlayForeverLabel = new Text( 'Tracks play forever', LABEL_TEXT_OPTIONS );
    const tracksPlayForeverCheckbox = new Checkbox( model.tracksPlayForeverProperty, tracksPlayForeverLabel, {
      tandem: tandem.createTandem( 'tracksPlayForeverCheckbox' )
    } );

    const arpeggioBackgroundLabel = new Text( 'Arpeggio Background Melodies', LABEL_TEXT_OPTIONS );
    const arpeggioBackgroundCheckbox = new Checkbox( model.arpeggioBackgroundProperty, arpeggioBackgroundLabel, {
      tandem: tandem.createTandem( 'arpeggioBackgroundMelodiesCheckbox' )
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
      else if ( TRACKS_SOUND_DESIGNS.includes( design ) ) {
        children.push( tracksPlayForeverCheckbox );

        if ( design === SoundDesign.TRACKS_ARPEGGIO ) {

          // For the arpeggio sound design, include a checkbox that controls background melodies
          children.push( arpeggioBackgroundCheckbox );
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

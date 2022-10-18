// Copyright 2021-2022, University of Colorado Boulder

/**
 * Options for the Preferences Dialog that allow us to set the sound design and sub-options. Sounds are
 * being actively designed while we implement them and we are adding all designs at once. TThe sounds can be selected
 * and controlled by the UI that is provided by this Node.
 *
 * TODO: i18n for this file
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { HBox, Node, Text, VBox } from '../../../../../scenery/js/imports.js';
import ComboBox from '../../../../../sun/js/ComboBox.js';
import Panel from '../../../../../sun/js/Panel.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import quadrilateral from '../../../quadrilateral.js';
import QuadrilateralSoundOptionsModel, { SoundDesign } from '../../model/QuadrilateralSoundOptionsModel.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import PreferencesDialog from '../../../../../joist/js/preferences/PreferencesDialog.js';

// spacing between title for option and the content Node
const TITLE_SPACING = 15;

class QuadrilateralSoundOptionsNode extends Panel {

  // Necessary for PhET-iO state and disposal since these components become dynamic when they live in a phetio capsule
  private readonly disposeQuadrilateralSoundOptionsNode: () => void;

  public constructor( model: QuadrilateralSoundOptionsModel, tandem: Tandem ) {

    const soundDesignLabelText = new Text( 'Sound Design', PreferencesDialog.PANEL_SECTION_LABEL_OPTIONS );

    const optionsParentNode = new Node();
    const designComboBox = new ComboBox( model.soundDesignProperty, [
      {
        value: SoundDesign.TRACKS_BUILD_UP_SIMPLE,
        node: new Text( 'Building (Default)', PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS ),
        tandemName: `tracksBuildUpSimple${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      },
      {
        value: SoundDesign.TRACKS_VOLUME_EMPHASIS,
        node: new Text( 'Shape Emphasis', PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS ),
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

    const tracksPlayForeverLabel = new Text( 'Tracks play forever', PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS );
    const tracksPlayForeverCheckbox = new Checkbox( model.tracksPlayForeverProperty, tracksPlayForeverLabel, {
      tandem: tandem.createTandem( 'tracksPlayForeverCheckbox' )
    } );

    const content = new VBox( {
      children: [
        labelledComboBox, tracksPlayForeverCheckbox
      ],
      spacing: 15,
      align: 'left'
    } );

    super( content );

    // TODO replace ComboBox with something else in https://github.com/phetsims/quadrilateral/issues/248
    this.addChild( optionsParentNode );

    this.disposeQuadrilateralSoundOptionsNode = () => {
      designComboBox.dispose();
    };
  }

  public override dispose(): void {
    this.disposeQuadrilateralSoundOptionsNode();
    super.dispose();
  }
}

quadrilateral.register( 'QuadrilateralSoundOptionsNode', QuadrilateralSoundOptionsNode );
export default QuadrilateralSoundOptionsNode;

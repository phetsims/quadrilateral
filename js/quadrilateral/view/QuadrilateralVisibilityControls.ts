// Copyright 2022, University of Colorado Boulder

/**
 * Visibility controls for this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Text, TextOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';

// constants
const TEXT_OPTIONS = combineOptions<TextOptions>( {

  // i18n (inspection)
  maxWidth: 100
}, QuadrilateralConstants.SCREEN_TEXT_OPTIONS );

type SelfOptions = {
  tandem?: Tandem;
};
type QuadrilateralVisibilityControlsOptions = SelfOptions & StrictOmit<VBoxOptions, 'children'>

class QuadrilateralVisibilityControls extends VBox {
  constructor( cornerLabelsVisibleProperty: BooleanProperty, cornerGuideVisibleProperty: BooleanProperty, symmetryGridVisibleProperty: BooleanProperty, providedOptions?: QuadrilateralVisibilityControlsOptions ) {

    const options = optionize<QuadrilateralVisibilityControlsOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: 15,

      tandem: Tandem.REQUIRED
    }, providedOptions );

    const cornerLabelsText = new Text( quadrilateralStrings.cornerLabels, TEXT_OPTIONS );
    const cornerLabelsCheckbox = new Checkbox( cornerLabelsText, cornerLabelsVisibleProperty, {

      // pdom
      labelTagName: 'label',
      labelContent: quadrilateralStrings.cornerLabels,

      // voicing
      voicingNameResponse: quadrilateralStrings.cornerLabels,
      voicingHintResponse: quadrilateralStrings.a11y.cornerLabelsHintResponse,

      // a11y
      checkedContextResponse: quadrilateralStrings.a11y.cornerLabelsAddedResponse,
      uncheckedContextResponse: quadrilateralStrings.a11y.cornerLabelsRemovedResponse,

      // phet-io
      tandem: options.tandem.createTandem( 'cornerLabelsCheckbox' )
    } );

    const cornerGuideText = new Text( quadrilateralStrings.cornerGuides, TEXT_OPTIONS );
    const cornerGuideCheckbox = new Checkbox( cornerGuideText, cornerGuideVisibleProperty, {

      // pdom
      labelTagName: 'label',
      labelContent: quadrilateralStrings.cornerGuides,

      // voicing
      voicingNameResponse: quadrilateralStrings.cornerGuides,
      voicingHintResponse: quadrilateralStrings.a11y.angleGuidesHintResponse,

      // a11y
      checkedContextResponse: quadrilateralStrings.a11y.angleGuidesAddedResponse,
      uncheckedContextResponse: quadrilateralStrings.a11y.angleGuidesRemovedResponse,

      // phet-io
      tandem: options.tandem.createTandem( 'cornerGuideCheckbox' )
    } );

    const symmetryGridText = new Text( quadrilateralStrings.symmetryGrid, TEXT_OPTIONS );
    const symmetryGridCheckbox = new Checkbox( symmetryGridText, symmetryGridVisibleProperty, {

      // pdom
      labelTagName: 'label',
      labelContent: quadrilateralStrings.symmetryGrid,

      // voicing
      voicingNameResponse: quadrilateralStrings.symmetryGrid,
      voicingHintResponse: quadrilateralStrings.a11y.symmetryLinesHintResponse,

      // a11y
      checkedContextResponse: quadrilateralStrings.a11y.symmetryLinesAddedResponse,
      uncheckedContextResponse: quadrilateralStrings.a11y.symmetryLinesRemovedResponse,

      // phet-io
      tandem: options.tandem.createTandem( 'symmetryGridCheckbox' )
    } );

    options.children = [ cornerLabelsCheckbox, cornerGuideCheckbox, symmetryGridCheckbox ];

    super( options );
  }
}

quadrilateral.register( 'QuadrilateralVisibilityControls', QuadrilateralVisibilityControls );
export default QuadrilateralVisibilityControls;

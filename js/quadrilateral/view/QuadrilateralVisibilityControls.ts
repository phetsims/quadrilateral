// Copyright 2022, University of Colorado Boulder

/**
 * Visibility controls for this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const TEXT_OPTIONS = {
  font: new PhetFont( { size: 14 } ),

  // i18n (inspection)
  maxWidth: 100
};

type QuadrilateralVisibilityControlsSelfOptions = {
  tandem?: Tandem;
};
type QuadrilateralVisibilityControlsOptions = QuadrilateralVisibilityControlsSelfOptions & Omit<VBoxOptions, 'children'>

class QuadrilateralVisibilityControls extends VBox {
  constructor( cornerLabelsVisibleProperty: BooleanProperty, cornerGuideVisibleProperty: BooleanProperty, symmetryGridVisibleProperty: BooleanProperty, providedOptions?: QuadrilateralVisibilityControlsOptions ) {

    const options = optionize<QuadrilateralVisibilityControlsOptions, QuadrilateralVisibilityControlsSelfOptions, VBoxOptions>()( {
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

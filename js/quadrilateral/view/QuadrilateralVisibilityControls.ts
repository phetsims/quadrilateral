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
  font: new PhetFont( { size: 16 } ),

  // i18n (inspection)
  maxWidth: 100
};

type QuadrilateralVisibilityControlsSelfOptions = {
  tandem?: Tandem
};
type QuadrilateralVisibilityControlsOptions = QuadrilateralVisibilityControlsSelfOptions & Omit<VBoxOptions, 'children'>

class QuadrilateralVisibilityControls extends VBox {
  constructor( cornerLabelsVisibleProperty: BooleanProperty, angleGuideVisibleProperty: BooleanProperty, providedOptions?: QuadrilateralVisibilityControlsOptions ) {

    const options = optionize<QuadrilateralVisibilityControlsOptions, QuadrilateralVisibilityControlsSelfOptions, VBoxOptions>( {
      align: 'left',
      spacing: 15,

      tandem: Tandem.REQUIRED
    }, providedOptions );

    const cornerLabelsText = new Text( quadrilateralStrings.cornerLabels, TEXT_OPTIONS );
    const cornerLabelsCheckbox = new Checkbox( cornerLabelsText, cornerLabelsVisibleProperty, {
      tandem: options.tandem.createTandem( 'cornerLabelsCheckbox' )
    } );

    const angleGuideText = new Text( quadrilateralStrings.angleGuide, TEXT_OPTIONS );
    const angleGuideCheckbox = new Checkbox( angleGuideText, angleGuideVisibleProperty, {
      tandem: options.tandem.createTandem( 'angleGuideCheckbox' )
    } );

    options.children = [ cornerLabelsCheckbox, angleGuideCheckbox ];

    super( options );
  }
}

quadrilateral.register( 'QuadrilateralVisibilityControls', QuadrilateralVisibilityControls );
export default QuadrilateralVisibilityControls;

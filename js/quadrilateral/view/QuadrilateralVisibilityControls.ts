// Copyright 2022-2023, University of Colorado Boulder

/**
 * Visibility controls for this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Property from '../../../../axon/js/Property.js';
import QuadrilateralIconFactory from './QuadrilateralIconFactory.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';

type SelfOptions = EmptySelfOptions;
type QuadrilateralVisibilityControlsOptions = SelfOptions & StrictOmit<VBoxOptions, 'children'> & PickRequired<VBoxOptions, 'tandem'>;

class QuadrilateralVisibilityControls extends VBox {
  public constructor( cornerLabelsVisibleProperty: Property<boolean>, markersVisibleProperty: Property<boolean>, gridVisibleProperty: BooleanProperty, diagonalGuidesVisibleProperty: BooleanProperty, providedOptions: QuadrilateralVisibilityControlsOptions ) {

    const options = optionize<QuadrilateralVisibilityControlsOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: QuadrilateralConstants.CONTROLS_SPACING,

      // "stretches" the checkbox icons and their labels so that the icons align
      // as if they are in their own column
      stretch: true
    }, providedOptions );

    const cornerLabelsIcon = QuadrilateralIconFactory.createLabelledIcon(
      QuadrilateralIconFactory.createCornerLabelsIcon(),
      QuadrilateralStrings.labels
    );
    const cornerLabelsCheckbox = new Checkbox( cornerLabelsVisibleProperty, cornerLabelsIcon, {
      spacing: QuadrilateralConstants.CONTROL_LABEL_SPACING,

      // pdom
      labelTagName: 'label',
      labelContent: QuadrilateralStrings.labels,

      // voicing
      voicingNameResponse: QuadrilateralStrings.labels,
      voicingHintResponse: QuadrilateralStrings.a11y.cornerLabelsHintResponse,

      // a11y
      checkedContextResponse: QuadrilateralStrings.a11y.cornerLabelsAddedResponse,
      uncheckedContextResponse: QuadrilateralStrings.a11y.cornerLabelsRemovedResponse,

      // phet-io
      tandem: options.tandem.createTandem( 'cornerLabelsCheckbox' )
    } );

    const markersIcon = QuadrilateralIconFactory.createLabelledIcon(
      QuadrilateralIconFactory.createMarkersIcon(),
      QuadrilateralStrings.markers
    );
    const markersCheckbox = new Checkbox( markersVisibleProperty, markersIcon, {
      spacing: QuadrilateralConstants.CONTROL_LABEL_SPACING,

      // pdom
      labelTagName: 'label',
      labelContent: QuadrilateralStrings.markers,

      // voicing
      voicingNameResponse: QuadrilateralStrings.markers,
      voicingHintResponse: QuadrilateralStrings.a11y.markersHintResponse,

      // a11y
      checkedContextResponse: QuadrilateralStrings.a11y.markersAddedResponse,
      uncheckedContextResponse: QuadrilateralStrings.a11y.markersRemovedResponse,

      // phet-io
      tandem: options.tandem.createTandem( 'markersCheckbox' )
    } );

    const diagonalGuidesIcon = QuadrilateralIconFactory.createLabelledIcon(
      QuadrilateralIconFactory.createDiagonalGuidesIcon(),
      QuadrilateralStrings.diagonals
    );
    const diagonalGuidesCheckbox = new Checkbox( diagonalGuidesVisibleProperty, diagonalGuidesIcon, {
      spacing: QuadrilateralConstants.CONTROL_LABEL_SPACING,

      // pdom
      labelTagName: 'label',
      labelContent: QuadrilateralStrings.diagonals,

      // voicing
      voicingNameResponse: QuadrilateralStrings.diagonals,
      voicingHintResponse: QuadrilateralStrings.a11y.diagonalGuidesHintResponse,

      // a11y
      checkedContextResponse: QuadrilateralStrings.a11y.diagonalGuidesAddedResponse,
      uncheckedContextResponse: QuadrilateralStrings.a11y.diagonalGuidesRemovedResponse,

      // phet-io
      tandem: options.tandem.createTandem( 'diagonalGuidesCheckbox' )
    } );

    const gridIcon = QuadrilateralIconFactory.createLabelledIcon(
      QuadrilateralIconFactory.createGridIcon(),
      QuadrilateralStrings.grid
    );
    const gridCheckbox = new Checkbox( gridVisibleProperty, gridIcon, {
      spacing: QuadrilateralConstants.CONTROL_LABEL_SPACING,

      // pdom
      labelTagName: 'label',
      labelContent: QuadrilateralStrings.grid,

      // voicing
      voicingNameResponse: QuadrilateralStrings.grid,
      voicingHintResponse: QuadrilateralStrings.a11y.gridLinesHintResponse,

      // a11y
      checkedContextResponse: QuadrilateralStrings.a11y.gridLinesAddedResponse,
      uncheckedContextResponse: QuadrilateralStrings.a11y.gridLinesRemovedResponse,

      // phet-io
      tandem: options.tandem.createTandem( 'gridCheckbox' )
    } );

    // Order for checkboxes was requested in https://github.com/phetsims/quadrilateral/issues/213#issuecomment-1282681500
    options.children = [ markersCheckbox, gridCheckbox, diagonalGuidesCheckbox, cornerLabelsCheckbox ];

    super( options );
  }
}

quadrilateral.register( 'QuadrilateralVisibilityControls', QuadrilateralVisibilityControls );
export default QuadrilateralVisibilityControls;

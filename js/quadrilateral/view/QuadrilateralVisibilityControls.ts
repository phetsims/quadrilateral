// Copyright 2022, University of Colorado Boulder

/**
 * Visibility controls for this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import GridCheckbox from '../../../../scenery-phet/js/GridCheckbox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Property from '../../../../axon/js/Property.js';
import QuadrilateralIconFactory from './QuadrilateralIconFactory.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';

const CHECKBOX_ICON_SPACING = 10;

type SelfOptions = EmptySelfOptions;
type QuadrilateralVisibilityControlsOptions = SelfOptions & StrictOmit<VBoxOptions, 'children'> & PickRequired<VBoxOptions, 'tandem'>;

class QuadrilateralVisibilityControls extends VBox {
  public constructor( cornerLabelsVisibleProperty: Property<boolean>, cornerGuideVisibleProperty: Property<boolean>, gridVisibleProperty: BooleanProperty, diagonalGuidesVisibleProperty: BooleanProperty, providedOptions: QuadrilateralVisibilityControlsOptions ) {

    const options = optionize<QuadrilateralVisibilityControlsOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: 15
    }, providedOptions );

    const cornerLabelsIcon = QuadrilateralIconFactory.createCornerLabelsIcon();
    const cornerLabelsCheckbox = new Checkbox( cornerLabelsVisibleProperty, cornerLabelsIcon, {
      spacing: CHECKBOX_ICON_SPACING,

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

    const cornerGuidesIcon = QuadrilateralIconFactory.createCornerGuidesIcon();
    const cornerGuideCheckbox = new Checkbox( cornerGuideVisibleProperty, cornerGuidesIcon, {
      spacing: CHECKBOX_ICON_SPACING,

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

    const diagonalGuidesIcon = QuadrilateralIconFactory.createDiagonalGuidesIcon();
    const diagonalGuidesCheckbox = new Checkbox( diagonalGuidesVisibleProperty, diagonalGuidesIcon, {
      spacing: CHECKBOX_ICON_SPACING,

      // pdom
      labelTagName: 'label',
      labelContent: quadrilateralStrings.diagonalGuides,

      // voicing
      voicingNameResponse: quadrilateralStrings.diagonalGuides,
      voicingHintResponse: quadrilateralStrings.a11y.diagonalGuidesHintResponse,

      // a11y
      checkedContextResponse: quadrilateralStrings.a11y.diagonalGuidesAddedResponse,
      uncheckedContextResponse: quadrilateralStrings.a11y.diagonalGuidesRemovedResponse,

      // phet-io
      tandem: options.tandem.createTandem( 'diagonalGuidesCheckbox' )
    } );

    const gridCheckbox = new GridCheckbox( gridVisibleProperty, {
      spacing: CHECKBOX_ICON_SPACING,

      gridSize: QuadrilateralIconFactory.ICON_HEIGHT,
      gridStroke: QuadrilateralColors.visibilityIconsColorProperty,
      gridLineWidth: QuadrilateralIconFactory.ICON_LINE_WIDTH,

      // pdom
      labelTagName: 'label',
      labelContent: quadrilateralStrings.grid,

      // voicing
      voicingNameResponse: quadrilateralStrings.grid,
      voicingHintResponse: quadrilateralStrings.a11y.gridLinesHintResponse,

      // a11y
      checkedContextResponse: quadrilateralStrings.a11y.gridLinesAddedResponse,
      uncheckedContextResponse: quadrilateralStrings.a11y.gridLinesRemovedResponse,

      // phet-io
      tandem: options.tandem.createTandem( 'gridCheckbox' )
    } );

    options.children = [ cornerLabelsCheckbox, cornerGuideCheckbox, diagonalGuidesCheckbox, gridCheckbox ];

    super( options );
  }
}

quadrilateral.register( 'QuadrilateralVisibilityControls', QuadrilateralVisibilityControls );
export default QuadrilateralVisibilityControls;

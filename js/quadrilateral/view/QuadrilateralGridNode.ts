// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import { Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Range from '../../../../dot/js/Range.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

const GRID_SPACING = QuadrilateralModel.MAJOR_GRID_SPACING * 5;

const GRID_LINE_OPTIONS = {
  stroke: QuadrilateralColors.symmetryGridColorProperty
};

class QuadrilateralGridNode extends Node {
  public constructor( modelBoundsProperty: Property<Bounds2 | null>, visibleProperty: IReadOnlyProperty<boolean>, modelViewTransform: ModelViewTransform2 ) {
    super();

    const chartTransform = new ChartTransform();
    const majorHorizontalLineSet = new GridLineSet( chartTransform, Orientation.HORIZONTAL, GRID_SPACING, GRID_LINE_OPTIONS );
    const majorVerticalLineSet = new GridLineSet( chartTransform, Orientation.VERTICAL, GRID_SPACING, GRID_LINE_OPTIONS );

    this.children = [
      majorHorizontalLineSet,
      majorVerticalLineSet
    ];

    modelBoundsProperty.link( modelBounds => {
      if ( modelBounds ) {

        // update ranges and view dimensions (for transforms) as bounds change
        const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );
        chartTransform.setViewWidth( viewBounds.width );
        chartTransform.setViewHeight( viewBounds.height );

        chartTransform.setModelXRange( new Range( modelBounds.left, modelBounds.right ) );
        chartTransform.setModelYRange( new Range( modelBounds.top, modelBounds.bottom ) );
      }
    } );

    visibleProperty.link( visible => { this.visible = visible; } );
  }
}

quadrilateral.register( 'QuadrilateralGridNode', QuadrilateralGridNode );
export default QuadrilateralGridNode;

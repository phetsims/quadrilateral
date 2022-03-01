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

class QuadrilateralGridNode extends Node {
  constructor( modelBoundsProperty: Property<Bounds2 | null>, modelViewTransform: ModelViewTransform2 ) {
    super();

    const chartTransform = new ChartTransform();
    const majorHorizontalLineSet = new GridLineSet( chartTransform, Orientation.HORIZONTAL, QuadrilateralModel.MAJOR_GRID_SPACING );
    const majorVerticalLineSet = new GridLineSet( chartTransform, Orientation.VERTICAL, QuadrilateralModel.MAJOR_GRID_SPACING );

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
  }
}

quadrilateral.register( 'QuadrilateralGridNode', QuadrilateralGridNode );
export default QuadrilateralGridNode;

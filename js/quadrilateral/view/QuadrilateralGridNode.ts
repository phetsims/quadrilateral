// Copyright 2022, University of Colorado Boulder

/**
 * A grid for the play area, to make it easier to place Vertices in reproducible positions for the play area.
 * 
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import { Path } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Shape } from '../../../../kite/js/imports.js';

const GRID_SPACING = QuadrilateralModel.MAJOR_GRID_SPACING * 5;

const GRID_LINE_OPTIONS = {
  stroke: QuadrilateralColors.gridColorProperty
};

class QuadrilateralGridNode extends Path {
  public constructor( modelBoundsProperty: Property<Bounds2 | null>, visibleProperty: TReadOnlyProperty<boolean>, modelViewTransform: ModelViewTransform2 ) {
    super( null, GRID_LINE_OPTIONS );

    modelBoundsProperty.link( modelBounds => {
      if ( modelBounds ) {
        const lineShape = new Shape();

        const modelLineWidth = modelViewTransform.viewToModelDeltaX( 1 );
        const erodedBounds = modelBounds.eroded( modelLineWidth );

        // Starting at the origin draw horizontal lines up and down the bounds
        let y = 0;
        lineShape.moveTo( -erodedBounds.width / 2, y ).lineTo( erodedBounds.width / 2, y );
        while ( y < erodedBounds.height / 2 ) {
          lineShape.moveTo( -erodedBounds.width / 2, y ).lineTo( erodedBounds.width / 2, y );
          lineShape.moveTo( -erodedBounds.width / 2, -y ).lineTo( erodedBounds.width / 2, -y );
          y = y + GRID_SPACING;
        }

        // Starting at the origin draw vertical lines across the bounds
        let x = 0;
        lineShape.moveTo( x, -erodedBounds.height / 2 ).lineTo( x, erodedBounds.height / 2 );
        while ( x < erodedBounds.width / 2 ) {
          lineShape.moveTo( x, -erodedBounds.height / 2 ).lineTo( x, erodedBounds.height / 2 );
          lineShape.moveTo( -x, -erodedBounds.height / 2 ).lineTo( -x, erodedBounds.height / 2 );
          x = x + GRID_SPACING;
        }
        this.shape = modelViewTransform.modelToViewShape( lineShape );
      }
    } );

    visibleProperty.link( visible => { this.visible = visible; } );
  }
}

quadrilateral.register( 'QuadrilateralGridNode', QuadrilateralGridNode );
export default QuadrilateralGridNode;

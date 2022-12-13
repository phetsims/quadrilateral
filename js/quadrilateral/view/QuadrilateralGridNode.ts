// Copyright 2022, University of Colorado Boulder

/**
 * A grid for the play area, to make it easier to place Vertices in reproducible positions for the play area.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import { Node, Path, Rectangle } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';

// constants
const GRID_LINE_OPTIONS = {
  stroke: QuadrilateralColors.gridColorProperty
};

// Options for the debugging grid that shows major and minor vertex intervals.
const MAJOR_DEBUG_GRID_LINE_OPTIONS = {
  stroke: 'darkred',
  lineWidth: 0.5
};
const MINOR_DEBUG_GRID_LINE_OPTIONS = {
  stroke: 'lightcoral',
  lineWidth: 0.25
};

const BORDER_RECTANGLE_LINE_WIDTH = 2;

class QuadrilateralGridNode extends Node {
  public constructor( modelBoundsProperty: Property<Bounds2 | null>, visibleProperty: TReadOnlyProperty<boolean>, modelViewTransform: ModelViewTransform2 ) {
    super();

    const majorDebuggingPath = new Path( null, MAJOR_DEBUG_GRID_LINE_OPTIONS );
    const minorDebuggingPath = new Path( null, MINOR_DEBUG_GRID_LINE_OPTIONS );

    // Rectangle showing available model bounds
    const boundsRectangle = new Rectangle( 0, 0, 0, 0, 5, 5, {
      stroke: QuadrilateralColors.playAreaStrokeColorProperty,
      fill: QuadrilateralColors.playAreaFillColorProperty,
      lineWidth: BORDER_RECTANGLE_LINE_WIDTH
    } );
    this.addChild( boundsRectangle );

    const gridPath = new Path( null, GRID_LINE_OPTIONS );
    this.addChild( gridPath );

    if ( QuadrilateralQueryParameters.showVertexGrid ) {
      this.addChild( majorDebuggingPath );
      this.addChild( minorDebuggingPath );
    }

    modelBoundsProperty.link( modelBounds => {
      if ( modelBounds ) {
        const lineShape = new Shape();

        // dilate just enough for the quadrilateral shape to never overlap the stroke
        const modelLineWidth = modelViewTransform.viewToModelDeltaX( BORDER_RECTANGLE_LINE_WIDTH );
        const dilatedBounds = modelBounds.dilated( modelLineWidth );

        boundsRectangle.setRectBounds( modelViewTransform.modelToViewBounds( dilatedBounds ) );

        this.drawVerticalLines( lineShape, dilatedBounds, QuadrilateralConstants.GRID_SPACING );
        this.drawHorizontalLines( lineShape, dilatedBounds, QuadrilateralConstants.GRID_SPACING );
        gridPath.shape = modelViewTransform.modelToViewShape( lineShape );

        // Only do this work if necessary
        if ( QuadrilateralQueryParameters.showVertexGrid ) {
          const majorDebugShape = new Shape();
          this.drawVerticalLines( majorDebugShape, dilatedBounds, QuadrilateralQueryParameters.majorVertexInterval );
          this.drawHorizontalLines( majorDebugShape, dilatedBounds, QuadrilateralQueryParameters.majorVertexInterval );
          majorDebuggingPath.shape = modelViewTransform.modelToViewShape( majorDebugShape );

          const minorDebugShape = new Shape();
          this.drawVerticalLines( minorDebugShape, dilatedBounds, QuadrilateralQueryParameters.minorVertexInterval );
          this.drawHorizontalLines( minorDebugShape, dilatedBounds, QuadrilateralQueryParameters.minorVertexInterval );
          minorDebuggingPath.shape = modelViewTransform.modelToViewShape( minorDebugShape );
        }
      }
    } );

    visibleProperty.link( visible => { gridPath.visible = visible; } );
  }

  /**
   * Draw vertical grid lines for this grid.
   * @param shape - lines will be drawn on this shape
   * @param bounds - bounds for the grid lines
   * @param spacing
   */
  public drawVerticalLines( shape: Shape, bounds: Bounds2, spacing: number ): void {

    // Starting at the origin draw horizontal lines up and down the bounds
    let y = 0;
    shape.moveTo( -bounds.width / 2, y ).lineTo( bounds.width / 2, y );
    while ( y < bounds.height / 2 ) {
      shape.moveTo( -bounds.width / 2, y ).lineTo( bounds.width / 2, y );
      shape.moveTo( -bounds.width / 2, -y ).lineTo( bounds.width / 2, -y );
      y = y + spacing;
    }
  }

  /**
   * Draw horizontal grid lines for this grid.
   * @param shape - lines will be drawn on this shape
   * @param bounds - bounds for the grid lines
   * @param spacing
   */
  public drawHorizontalLines( shape: Shape, bounds: Bounds2, spacing: number ): void {

    // Starting at the origin draw vertical lines across the bounds
    let x = 0;
    shape.moveTo( x, -bounds.height / 2 ).lineTo( x, bounds.height / 2 );
    while ( x < bounds.width / 2 ) {
      shape.moveTo( x, -bounds.height / 2 ).lineTo( x, bounds.height / 2 );
      shape.moveTo( -x, -bounds.height / 2 ).lineTo( -x, bounds.height / 2 );
      x = x + spacing;
    }
  }
}

quadrilateral.register( 'QuadrilateralGridNode', QuadrilateralGridNode );
export default QuadrilateralGridNode;

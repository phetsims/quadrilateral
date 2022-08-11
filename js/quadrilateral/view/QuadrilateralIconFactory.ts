// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Circle, Line, Node, Path, Text } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import { Shape } from '../../../../kite/js/imports.js';

const QuadrilateralIconFactory = {

  /**
   * Creates an icon for the "Corner Labels" checkbox that toggles visibility of labels on each Vertex.
   */
  createCornerLabelsIcon(): Node {
    const label = new Text( 'A', QuadrilateralConstants.SCREEN_TEXT_OPTIONS );
    const circle = new Circle( QuadrilateralIconFactory.ICON_HEIGHT / 2, {
      stroke: QuadrilateralColors.visibilityIconsColorProperty,
      lineWidth: QuadrilateralIconFactory.ICON_LINE_WIDTH
    } );

    label.center = circle.center;
    circle.addChild( label );

    return circle;
  },

  /**
   * Create an icon for the "Corner Guides" checkbox that toggles visual indicators of the angle at each vertex.
   */
  createCornerGuidesIcon(): Node {
    const iconHeight = QuadrilateralIconFactory.ICON_HEIGHT;

    // draw the "axes"
    const lineOptions = { stroke: QuadrilateralColors.visibilityIconsColorProperty, lineWidth: QuadrilateralIconFactory.ICON_LINE_WIDTH, lineDash: [ 5, 3 ] };
    const yAxis = new Line( 0, -iconHeight, 0, 0, lineOptions );
    const xAxis = new Line( 0, 0, iconHeight, 0, lineOptions );

    // creates two arcs that look like the perpendicular axis angle split into three 30 degree segments
    const iconRadius = iconHeight * 3 / 4;
    const fullArcShape = Shape.arc( 0, 0, iconRadius, 0, 3 * Math.PI / 2, true );
    const fullArcPath = new Path( fullArcShape, { stroke: QuadrilateralColors.visibilityIconsColorProperty } );

    const partialArcShape = Shape.arc( 0, 0, iconRadius, -Math.PI / 6, -2 * Math.PI / 6, true );
    partialArcShape.lineTo( 0, 0 );
    partialArcShape.close();
    const partialArcPath = new Path( partialArcShape, { fill: QuadrilateralColors.visibilityIconsColorProperty } );

    return new Node( {
      children: [ yAxis, xAxis, fullArcPath, partialArcPath ]
    } );
  },

  createDiagonalGuidesIcon(): Node {
    const iconHeight = QuadrilateralIconFactory.ICON_HEIGHT;
    const lineOptions = { stroke: QuadrilateralColors.visibilityIconsColorProperty, lineWidth: QuadrilateralIconFactory.ICON_LINE_WIDTH, lineDash: [ 5, 3 ] };
    const firstDiagonal = new Line( -iconHeight / 2, -iconHeight / 2, iconHeight / 2, iconHeight / 2, lineOptions );
    const secondDiagonal = new Line( iconHeight / 2, -iconHeight / 2, -iconHeight / 2, iconHeight / 2, lineOptions );

    return new Node( {
      children: [ firstDiagonal, secondDiagonal ]
    } );
  },

  // @readonly
  ICON_HEIGHT: 30,
  ICON_LINE_WIDTH: 1.5
};

quadrilateral.register( 'QuadrilateralIconFactory', QuadrilateralIconFactory );
export default QuadrilateralIconFactory;

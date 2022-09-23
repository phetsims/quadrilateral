// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Circle, FlowBox, HBox, Line, Node, Path, Text } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import musicSolidShape from '../../../../sherpa/js/fontawesome-5/musicSolidShape.js';

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

  createSoundIcon(): Node {
    return new Path( musicSolidShape, {
      maxHeight: QuadrilateralIconFactory.ICON_HEIGHT,
      fill: QuadrilateralColors.visibilityIconsColorProperty
    } );
  },

  createGridIcon(): Node {

    // TODO: Copied from GridCheckbox. Either modify that checkbox to support the layout of this sim or refactor
    // out this drawing code.
    const height = QuadrilateralIconFactory.ICON_HEIGHT;
    const iconShape = new Shape()
      .moveTo( height / 4, 0 )
      .lineTo( height / 4, height )
      .moveTo( height / 2, 0 )
      .lineTo( height / 2, height )
      .moveTo( height * 3 / 4, 0 )
      .lineTo( height * 3 / 4, height )
      .moveTo( 0, height / 4 )
      .lineTo( height, height / 4 )
      .moveTo( 0, height / 2 )
      .lineTo( height, height / 2 )
      .moveTo( 0, height * 3 / 4 )
      .lineTo( height, height * 3 / 4 );

    return new Path( iconShape, {
      stroke: QuadrilateralColors.visibilityIconsColorProperty,
      lineWidth: QuadrilateralIconFactory.ICON_LINE_WIDTH
    } );
  },

  /**
   * Layout a label Text and icon Node, in that order for various UI controls. Returns
   * a flowbox so that 'stretch' can be used to align text and icons in a parent layout
   * container.
   */
  createLabelledIcon( iconNode: Node, labelString: string ): FlowBox {
    const labelText = new Text( labelString, QuadrilateralConstants.SCREEN_TEXT_OPTIONS );

    return new HBox( {
      children: [ labelText, iconNode ],
      spacing: 15
    } );
  },

  // @readonly
  ICON_HEIGHT: 30,
  ICON_LINE_WIDTH: 1.5
};

quadrilateral.register( 'QuadrilateralIconFactory', QuadrilateralIconFactory );
export default QuadrilateralIconFactory;

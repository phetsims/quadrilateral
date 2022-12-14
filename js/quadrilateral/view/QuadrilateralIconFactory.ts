// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Circle, FlowBox, HBox, Line, Node, Path, Text } from '../../../../scenery/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import GridIcon from '../../../../scenery-phet/js/GridIcon.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import musicSolidShape from '../../../../sherpa/js/fontawesome-5/musicSolidShape.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';

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
   * Create an icon for the "Markers" checkbox that toggles visual indicators of the angle at each vertex.
   */
  createMarkersIcon(): Node {

    // The angle between sides in the icon, more than 90 degrees so it has more of a protractor look
    const sideAngle = Utils.toRadians( 100 );
    const sideLength = QuadrilateralIconFactory.ICON_HEIGHT;
    const sideHeight = QuadrilateralIconFactory.ICON_HEIGHT * 0.25; // chosen by inspection

    const bottomSide = Shape.rectangle( 0, 0, sideLength, sideHeight );

    // Effectively rotating the bottom side about its bottom left corner by sideAngle
    const verticalSide = bottomSide.transformed( Matrix3.translationRotation( 0, sideHeight, -sideAngle ) );

    // use CAG to easily combine the sides into a single strokable shape without interior (overlapping) lines
    const sidesShape = bottomSide.shapeUnion( verticalSide );
    const sidesPath = new Path( sidesShape, { stroke: 'black', fill: QuadrilateralColors.screenBackgroundColorProperty, lineWidth: QuadrilateralIconFactory.ICON_LINE_WIDTH } );

    // ticks (along the bottom side)
    const ticksShape = new Shape();
    for ( let i = 0; i < 3; i++ ) {
      const tickX = 5 + i * sideLength / 3; // offset a little from the origin
      ticksShape.moveTo( tickX, sideHeight );
      ticksShape.lineTo( tickX, sideHeight / 2 );
    }
    const bottomTicksPath = new Path( ticksShape, { stroke: 'black' } );

    // Effectively translates the ticksShape to the left and then rotates it clockwise (opposite direction of sideAngle)
    // it lies on the left-most edge of the vertical side
    const verticalTicksShape = ticksShape.transformed( Matrix3.rotationAround( Math.PI - sideAngle, 0, sideHeight ).timesMatrix( Matrix3.translation( -sideLength, 0 ) ) );
    const verticalTicksPath = new Path( verticalTicksShape, { stroke: 'black' } );

    // creates two arcs that look like the perpendicular axis angle split into three 30 degree segments
    const innerIconRadius = sideLength / 1.7; // by inspection
    const innerArcShape = Shape.arc( 0, sideHeight, innerIconRadius, 0, 2 * Math.PI - sideAngle, true );
    const innerArcPath = new Path( innerArcShape, { stroke: QuadrilateralColors.visibilityIconsColorProperty, lineWidth: QuadrilateralIconFactory.ICON_LINE_WIDTH } );

    const outerIconRadius = sideLength;
    const outerArcShape = Shape.arc( 0, sideHeight, outerIconRadius, 0, 2 * Math.PI - sideAngle, true );
    const outerArcPath = new Path( outerArcShape, { stroke: QuadrilateralColors.visibilityIconsColorProperty, lineWidth: QuadrilateralIconFactory.ICON_LINE_WIDTH } );

    // Draws an arc shape (returning a Path) between start and end angle, representing the "angle guides"
    const createAngleArcPath = ( startAngle: number, endAngle: number ) => {
      const angleArcShape = new Shape();

      // the bottom right part of the arc (starting point)
      const innerStartX = Math.cos( startAngle ) * innerIconRadius;
      const innerStartY = -Math.sin( startAngle ) * innerIconRadius + sideHeight;

      // the top right part of the arc (line up to this point)
      const outerLineToX = Math.cos( startAngle ) * outerIconRadius;
      const outerLineToY = -Math.sin( startAngle ) * outerIconRadius + sideHeight;

      // top left part of the arc shape (arc to this point)
      const outerArcToX = Math.cos( endAngle ) * outerIconRadius;
      const outerArcToY = -Math.sin( endAngle ) * outerIconRadius + sideHeight;

      // bottom left point for the arc shape (line down to this point)
      const innerLineToX = Math.cos( endAngle ) * innerIconRadius;
      const innerLineToY = -Math.sin( endAngle ) * innerIconRadius + sideHeight;

      angleArcShape.moveTo( innerStartX, innerStartY );
      angleArcShape.lineTo( outerLineToX, outerLineToY );
      angleArcShape.ellipticalArcTo( outerIconRadius, outerIconRadius, 0, false, false, outerArcToX, outerArcToY );
      angleArcShape.lineTo( innerLineToX, innerLineToY );
      angleArcShape.ellipticalArcTo( innerIconRadius, innerIconRadius, 0, false, true, innerStartX, innerStartY );

      return new Path( angleArcShape, {
        fill: QuadrilateralColors.visibilityIconsColorProperty,
        stroke: 'black'
      } );
    };

    const firstAngleArcPath = createAngleArcPath( 0, Math.PI / 5 );
    const secondAngleArcPath = createAngleArcPath( Math.PI / 2 - Math.PI / 6, Math.PI / 2 );

    return new Node( {
      children: [ innerArcPath, outerArcPath, firstAngleArcPath, secondAngleArcPath, sidesPath, bottomTicksPath, verticalTicksPath ],
      maxWidth: QuadrilateralIconFactory.ICON_HEIGHT
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
    return new GridIcon( {
      size: QuadrilateralIconFactory.ICON_HEIGHT,
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
    const labelText = new Text( labelString, {
      font: QuadrilateralConstants.SCREEN_TEXT_FONT,
      maxWidth: 300
    } );

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

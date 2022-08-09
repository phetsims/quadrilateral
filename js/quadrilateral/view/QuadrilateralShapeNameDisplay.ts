// Copyright 2022, University of Colorado Boulder

/**
 * A display for the current quadrilateral shape name. The name can be conditionally displayed, depending on
 * shapeNameVisibleProperty.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import quadrilateral from '../../quadrilateral.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import Multilink from '../../../../axon/js/Multilink.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const squareString = quadrilateralStrings.shapeNames.square;
const rectangleString = quadrilateralStrings.shapeNames.rectangle;
const rhombusString = quadrilateralStrings.shapeNames.rhombus;
const kiteString = quadrilateralStrings.shapeNames.kite;
const isoscelesTrapezoidString = quadrilateralStrings.shapeNames.isoscelesTrapezoid;
const trapezoidString = quadrilateralStrings.shapeNames.trapezoid;
const concaveQuadrilateralString = quadrilateralStrings.shapeNames.concaveQuadrilateral;
const convexQuadrilateralString = quadrilateralStrings.shapeNames.convexQuadrilateral;
const parallelogramString = quadrilateralStrings.shapeNames.parallelogram;
const dartString = quadrilateralStrings.shapeNames.dart;
const showShapeNameString = quadrilateralStrings.showShapeName;

const SHAPE_NAME_MAP = new Map( [
  [ NamedQuadrilateral.SQUARE, squareString ],
  [ NamedQuadrilateral.RECTANGLE, rectangleString ],
  [ NamedQuadrilateral.RHOMBUS, rhombusString ],
  [ NamedQuadrilateral.KITE, kiteString ],
  [ NamedQuadrilateral.ISOSCELES_TRAPEZOID, isoscelesTrapezoidString ],
  [ NamedQuadrilateral.TRAPEZOID, trapezoidString ],
  [ NamedQuadrilateral.CONCAVE_QUADRILATERAL, concaveQuadrilateralString ],
  [ NamedQuadrilateral.CONVEX_QUADRILATERAL, convexQuadrilateralString ],
  [ NamedQuadrilateral.PARALLELOGRAM, parallelogramString ],
  [ NamedQuadrilateral.DART, dartString ]
] );

// empirically determined
const DISPLAY_WIDTH = 350;
const DISPLAY_HEIGHT = 40;

class QuadrilateralShapeNameDisplay extends Node {
  public constructor( shapeNameVisibleProperty: Property<boolean>, shapeNameProperty: IReadOnlyProperty<NamedQuadrilateral>, tandem: Tandem ) {
    super();

    // display contents
    const expandCollapseButton = new ExpandCollapseButton( shapeNameVisibleProperty, {
      sideLength: 20,
      tandem: tandem.createTandem( 'expandCollapseButton' )
    } );
    const shapeNameText = new Text( '', QuadrilateralConstants.SHAPE_NAME_TEXT_OPTIONS );
    const backgroundRectangle = new Rectangle( 0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, QuadrilateralConstants.CORNER_RADIUS, QuadrilateralConstants.CORNER_RADIUS, {
      fill: QuadrilateralColors.panelFillColorProperty,
      stroke: QuadrilateralColors.panelStrokeColorProperty
    } );
    this.children = [ backgroundRectangle, expandCollapseButton, shapeNameText ];

    // Update display text
    Multilink.multilink( [ shapeNameVisibleProperty, shapeNameProperty ], ( shapeNameVisible, shapeName ) => {
      let text = showShapeNameString;
      if ( shapeNameVisible ) {
        assert && assert( SHAPE_NAME_MAP.has( shapeName ), 'Shape is not named in SHAPE_NAME_MAP' );
        text = SHAPE_NAME_MAP.get( shapeName )!;

        // Text is bold when shape name is visible
        shapeNameText.fontWeight = 'bold';
      }
      else {
        shapeNameText.fontWeight = 'normal';
      }

      shapeNameText.text = text;
      shapeNameText.center = backgroundRectangle.center;
    } );

    // layout
    shapeNameText.center = backgroundRectangle.center;
    expandCollapseButton.leftCenter = backgroundRectangle.leftCenter.plusXY( expandCollapseButton.width / 2, 0 );
  }
}

quadrilateral.register( 'QuadrilateralShapeNameDisplay', QuadrilateralShapeNameDisplay );
export default QuadrilateralShapeNameDisplay;

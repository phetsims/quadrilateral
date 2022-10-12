// Copyright 2022, University of Colorado Boulder

/**
 * A display for the current quadrilateral shape name. The name can be conditionally displayed, depending on
 * shapeNameVisibleProperty.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import { Node, Rectangle, VoicingText, VoicingTextOptions } from '../../../../scenery/js/imports.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import quadrilateral from '../../quadrilateral.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import Multilink from '../../../../axon/js/Multilink.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralDescriber from './QuadrilateralDescriber.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

// constants
const squareString = QuadrilateralStrings.shapeNames.square;
const rectangleString = QuadrilateralStrings.shapeNames.rectangle;
const rhombusString = QuadrilateralStrings.shapeNames.rhombus;
const kiteString = QuadrilateralStrings.shapeNames.kite;
const isoscelesTrapezoidString = QuadrilateralStrings.shapeNames.isoscelesTrapezoid;
const trapezoidString = QuadrilateralStrings.shapeNames.trapezoid;
const concaveQuadrilateralString = QuadrilateralStrings.shapeNames.concaveQuadrilateral;
const convexQuadrilateralString = QuadrilateralStrings.shapeNames.convexQuadrilateral;
const parallelogramString = QuadrilateralStrings.shapeNames.parallelogram;
const dartString = QuadrilateralStrings.shapeNames.dart;
const shapeNameHiddenString = QuadrilateralStrings.shapeNameHidden;
const shapeNameHiddenContextResponseString = QuadrilateralStrings.a11y.voicing.shapeNameHiddenContextResponse;
const shapeNameShownContextResponseString = QuadrilateralStrings.a11y.voicing.shapeNameShownContextResponse;

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
  public constructor( shapeNameVisibleProperty: Property<boolean>, shapeNameProperty: TReadOnlyProperty<NamedQuadrilateral>, quadrilateralDescriber: QuadrilateralDescriber, tandem: Tandem ) {
    super();

    // display contents
    const expandCollapseButton = new ExpandCollapseButton( shapeNameVisibleProperty, {
      sideLength: 20,

      // phet-io
      tandem: tandem.createTandem( 'expandCollapseButton' )
    } );

    const shapeNameText = new VoicingText( '', combineOptions<VoicingTextOptions>( {

      // Remove this component from the traversal order even though it uses Voicing. For alt input + voicing,
      // the expandCollapseButton as an interactive component is sufficient, see
      // https://github.com/phetsims/quadrilateral/issues/238#issuecomment-1276306315 for this request
      readingBlockTagName: null
    }, QuadrilateralConstants.SHAPE_NAME_TEXT_OPTIONS ) );

    const backgroundRectangle = new Rectangle( 0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, QuadrilateralConstants.CORNER_RADIUS, QuadrilateralConstants.CORNER_RADIUS, {
      fill: QuadrilateralColors.panelFillColorProperty,
      stroke: QuadrilateralColors.panelStrokeColorProperty
    } );
    this.children = [ backgroundRectangle, expandCollapseButton, shapeNameText ];

    let wasVisible = shapeNameVisibleProperty.value;

    // Update display text and contents to be spoken from Voicing interactions. See
    // https://github.com/phetsims/quadrilateral/issues/238 for the design requirements of the Voicing responses.
    Multilink.multilink( [ shapeNameVisibleProperty, shapeNameProperty ], ( shapeNameVisible, shapeName ) => {
      let textString;

      if ( shapeNameVisible ) {
        assert && assert( SHAPE_NAME_MAP.has( shapeName ), 'Shape is not named in SHAPE_NAME_MAP' );
        textString = SHAPE_NAME_MAP.get( shapeName )!;

        // Text is bold when shape name is visible
        shapeNameText.fontWeight = 'bold';

        // voicing - when shape name is shown we should include the detected shape in the name response
        expandCollapseButton.voicingNameResponse = quadrilateralDescriber.getYouHaveAShapeDescription();
        expandCollapseButton.voicingContextResponse = shapeNameShownContextResponseString;
        shapeNameText.readingBlockNameResponse = textString;
      }
      else {
        textString = shapeNameHiddenString;
        shapeNameText.fontWeight = 'normal';

        // voicing
        expandCollapseButton.voicingNameResponse = shapeNameHiddenString;
        expandCollapseButton.voicingContextResponse = shapeNameHiddenContextResponseString;
        shapeNameText.readingBlockNameResponse = textString;
      }

      // Only after updating voicing response content, speak the response. We only announce this when visibility
      // changes, not when shapeNameProperty changes. Done in this multilink instead of its own link so that
      // the output is independent of listener order.
      if ( wasVisible !== shapeNameVisibleProperty.value ) {
        expandCollapseButton.voicingSpeakFullResponse();
        wasVisible = shapeNameVisibleProperty.value;
      }

      shapeNameText.text = textString;
      shapeNameText.center = backgroundRectangle.center;
    } );

    // layout
    shapeNameText.center = backgroundRectangle.center;
    expandCollapseButton.leftCenter = backgroundRectangle.leftCenter.plusXY( expandCollapseButton.width / 2, 0 );
  }
}

quadrilateral.register( 'QuadrilateralShapeNameDisplay', QuadrilateralShapeNameDisplay );
export default QuadrilateralShapeNameDisplay;

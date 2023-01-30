// Copyright 2022, University of Colorado Boulder

/**
 * A panel that displays model values for debugging and as a temporary display while
 * we do not have any graphical simulation yet. Shows things like interior angles, side lengths,
 * and whether or not the shape is a parallelogram.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import { Node, NodeOptions, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import Multilink from '../../../../axon/js/Multilink.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const TEXT_OPTIONS = { fontSize: 16 };
const valuePatternString = '{{label}}: {{value}}';
const valueWithDegreesPatternString = '{{label}}: {{value}} ({{degrees}} degrees)';

const CONTENT_PADDING = 10;

class QuadrilateralModelValuePanel extends Node {

  public constructor( model: QuadrilateralModel, providedOptions?: NodeOptions ) {

    // Controlled by a slider at the bottom of the panel to show more or less decimal places in debugging values
    const decimalPlacesProperty = new NumberProperty( 3, {
      range: new Range( 2, 5 )
    } );

    const topSideLengthText = new Text( '', TEXT_OPTIONS );
    const rightSideLengthText = new Text( '', TEXT_OPTIONS );
    const bottomSideLengthText = new Text( '', TEXT_OPTIONS );
    const leftSideLengthText = new Text( '', TEXT_OPTIONS );
    const lengthBox = new VBox( {
      children: [
        topSideLengthText,
        rightSideLengthText,
        bottomSideLengthText,
        leftSideLengthText
      ],
      align: 'left'
    } );

    const leftTopAngleText = new Text( '', TEXT_OPTIONS );
    const rightTopAngleText = new Text( '', TEXT_OPTIONS );
    const rightBottomAngleText = new Text( '', TEXT_OPTIONS );
    const leftBottomAngleText = new Text( '', TEXT_OPTIONS );
    const angleBox = new VBox( {
      children: [
        leftTopAngleText,
        rightTopAngleText,
        rightBottomAngleText,
        leftBottomAngleText
      ],
      align: 'left'
    } );

    const isParallelogramText = new Text( '', TEXT_OPTIONS );
    const sideABCDParallelText = new Text( '', TEXT_OPTIONS );
    const sideBCDAParallelText = new Text( '', TEXT_OPTIONS );
    const parallelogramBox = new VBox( {
      children: [ isParallelogramText, sideABCDParallelText, sideBCDAParallelText ],
      align: 'left'
    } );

    const sideABCDToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const sideBCDAToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const interAngleToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const staticAngleToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const shapeLengthToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const toleranceIntervalBox = new VBox( {
      children: [ sideABCDToleranceIntervalText, sideBCDAToleranceIntervalText, interAngleToleranceIntervalText, staticAngleToleranceIntervalText, shapeLengthToleranceIntervalText ],
      align: 'left'
    } );

    const shapeNameText = new Text( '', TEXT_OPTIONS );

    const rotationMarkerDetectedText = new Text( '', TEXT_OPTIONS );
    const tangibleRotationText = new Text( '', TEXT_OPTIONS );
    const markerBox = new VBox( {
      children: [ rotationMarkerDetectedText, tangibleRotationText ],
      align: 'left'
    } );

    const decimalPlacesControl = new NumberControl( 'Decimal Places', decimalPlacesProperty, decimalPlacesProperty.range, {
      sliderOptions: {
        keyboardStep: 1,
        thumbSize: new Dimension2( 10, 17 )
      },

      // no tandems for debugging
      tandem: Tandem.OPT_OUT
    } );

    const content = new VBox( {
      children: [
        lengthBox,
        angleBox,
        parallelogramBox,
        toleranceIntervalBox,
        shapeNameText,
        markerBox,
        decimalPlacesControl
      ],
      align: 'left',
      spacing: 15
    } );

    const backgroundRectangle = new Rectangle( 0, 0, 400, content.height + CONTENT_PADDING, 5, 5, {
      fill: 'white'
    } );
    content.leftTop = backgroundRectangle.leftTop.plusXY( CONTENT_PADDING / 2, CONTENT_PADDING / 2 );

    super();
    this.children = [ backgroundRectangle, content ];

    // panel is see-through so that the quadrilateral can move and be dragged under it
    this.opacity = 0.7;

    // mutate after defaults (mostly children for bounds) have been set
    this.mutate( providedOptions );

    // Link to the model to print the values
    // length
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.topSide.lengthProperty, topSideLengthText, 'Side AB', decimalPlacesProperty );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.rightSide.lengthProperty, rightSideLengthText, 'Side BC', decimalPlacesProperty );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.bottomSide.lengthProperty, bottomSideLengthText, 'Side CD', decimalPlacesProperty );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.leftSide.lengthProperty, leftSideLengthText, 'Side DA', decimalPlacesProperty );

    // angle
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexA.angleProperty, leftTopAngleText, 'Corner A', decimalPlacesProperty, true );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexB.angleProperty, rightTopAngleText, 'Corner B', decimalPlacesProperty, true );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexC.angleProperty, rightBottomAngleText, 'Corner C', decimalPlacesProperty, true );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexD.angleProperty, leftBottomAngleText, 'Corner D', decimalPlacesProperty, true );

    // parallelogram and paralle sides
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.isParallelogramProperty, isParallelogramText, 'Is parallelogram', decimalPlacesProperty );
    // @ts-expect-error - isParallelProperty is private, but I want to use it here as a special exception for debugging
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 0 ].isParallelProperty, sideABCDParallelText, '(AB, CD) parallel', decimalPlacesProperty );
    // @ts-expect-error - isParallelProperty is private, but I want to use it here as a special exception for debugging
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 1 ].isParallelProperty, sideBCDAParallelText, '(BC, DA) parallel', decimalPlacesProperty );

    // angleToleranceIntervals for each opposite side pair
    // @ts-expect-error - parallelAngleToleranceInterval is private, but I want to use it here for now just for debugging
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 0 ].parallelAngleToleranceIntervalProperty, sideABCDToleranceIntervalText, '(AB, CD) parallelAngleToleranceInterval', decimalPlacesProperty );
    // @ts-expect-error - parallelAngleToleranceInterval is private, but I want to use it here for now just for debugging
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 1 ].parallelAngleToleranceIntervalProperty, sideBCDAToleranceIntervalText, '(BC, DA) parallelAngleToleranceInterval', decimalPlacesProperty );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.interAngleToleranceIntervalProperty, interAngleToleranceIntervalText, 'interAngleToleranceInterval', decimalPlacesProperty );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.staticAngleToleranceIntervalProperty, staticAngleToleranceIntervalText, 'staticAngleToleranceInterval', decimalPlacesProperty );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.interLengthToleranceIntervalProperty, shapeLengthToleranceIntervalText, 'shapeLengthToleranceInterval', decimalPlacesProperty );

    // shape name
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.shapeNameProperty, shapeNameText, 'shape name', decimalPlacesProperty );

    // marker detection
    const markerDetectionModel = model.tangibleConnectionModel.markerDetectionModel;
    QuadrilateralModelValuePanel.addRedrawValueTextListener( markerDetectionModel.rotationMarkerDetectedProperty, rotationMarkerDetectedText, 'Marker detected', decimalPlacesProperty );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( markerDetectionModel.tangibleRotationProperty, tangibleRotationText, 'Tangible rotation', decimalPlacesProperty );
  }

  /**
   * Adds listeners to the Property and decimalPlacesProperty to update debugging text when values change.
   *
   * I could not figure out the typing for the Multilink. Type for property arg is
   * type DebuggableProperty = TReadOnlyProperty<number | null> | TReadOnlyProperty<boolean> | TReadOnlyProperty<NamedQuadrilateral>;
   *
   * After 10 minutes of tinkering with types I decided it wasn't worth figuring out for this debugging code.
   *
   * @param property - the Property whose value you want to watch
   * @param text - Text instance to update
   * @param label - a label for the value we are watching
   * @param decimalPlacesProperty - controls precision of values
   * @param showDegrees - If the value would be helpful to also show in degrees for debugging, set to true
   */
  private static addRedrawValueTextListener( property: TReadOnlyProperty<IntentionalAny>,
                                             text: Text,
                                             label: string,
                                             decimalPlacesProperty: Property<number>,
                                             showDegrees = false ): void {

    Multilink.multilink( [ property, decimalPlacesProperty ], ( value, decimalPlaces ) => {

      let formattedValue = value;

      // if a number, trim so that it is easier to read
      if ( typeof value === 'number' ) {
        formattedValue = Utils.toFixedNumber( value, decimalPlaces );
      }

      if ( showDegrees ) {

        // just show two decimals instead of the number of decimals shown to avoid confusion with tolerance intervals
        // which are in radians
        const formattedDegrees = Utils.toFixedNumber( Utils.toDegrees( value ), 2 );
        text.text = StringUtils.fillIn( valueWithDegreesPatternString, {
          value: formattedValue,
          degrees: formattedDegrees,
          label: label
        } );
      }
      else {
        text.text = StringUtils.fillIn( valuePatternString, {
          value: formattedValue,
          label: label
        } );
      }
    } );
  }
}

quadrilateral.register( 'QuadrilateralModelValuePanel', QuadrilateralModelValuePanel );
export default QuadrilateralModelValuePanel;

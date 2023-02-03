// Copyright 2022-2023, University of Colorado Boulder
/* eslint-disable @typescript-eslint/dot-notation */

/**
 * A panel that displays model values for debugging. For debugging only.
 *
 * Note to access some otherwise private class variables this uses square bracket notation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import { Node, NodeOptions, Rectangle, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
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
import { combineOptions } from '../../../../phet-core/js/optionize.js';

// constants
const TEXT_OPTIONS = { fontSize: 16 };
const VALUE_PATTERN_STRING = '{{label}}: {{value}}';
const VALUE_WITH_DEGREES_PATTERN_STRING = '{{label}}: {{value}} ({{degrees}} degrees)';
const CONTENT_PADDING = 10;
const VBOX_OPTIONS: VBoxOptions = { align: 'left' };

class QuadrilateralDebuggingPanel extends Node {
  public constructor( model: QuadrilateralModel, providedOptions?: NodeOptions ) {

    // Length readouts
    const topSideLengthText = new Text( '', TEXT_OPTIONS );
    const rightSideLengthText = new Text( '', TEXT_OPTIONS );
    const bottomSideLengthText = new Text( '', TEXT_OPTIONS );
    const leftSideLengthText = new Text( '', TEXT_OPTIONS );
    const lengthBox = new VBox( combineOptions<VBoxOptions>( {
      children: [
        topSideLengthText,
        rightSideLengthText,
        bottomSideLengthText,
        leftSideLengthText
      ]
    }, VBOX_OPTIONS ) );

    // Angle readouts
    const cornerAAngleText = new Text( '', TEXT_OPTIONS );
    const cornerBAngleText = new Text( '', TEXT_OPTIONS );
    const cornerCAngleText = new Text( '', TEXT_OPTIONS );
    const cornerDAngleText = new Text( '', TEXT_OPTIONS );
    const angleBox = new VBox( combineOptions<VBoxOptions>( {
      children: [
        cornerAAngleText,
        cornerBAngleText,
        cornerCAngleText,
        cornerDAngleText
      ]
    }, VBOX_OPTIONS ) );

    // parallelogram and parallel sides readout
    const isParallelogramText = new Text( '', TEXT_OPTIONS );
    const sideABCDParallelText = new Text( '', TEXT_OPTIONS );
    const sideBCDAParallelText = new Text( '', TEXT_OPTIONS );
    const parallelogramBox = new VBox( combineOptions<VBoxOptions>( {
      children: [ isParallelogramText, sideABCDParallelText, sideBCDAParallelText ]
    }, VBOX_OPTIONS ) );

    // tolerance intervals readout
    const sideABCDToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const sideBCDAToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const interAngleToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const staticAngleToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const shapeLengthToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const toleranceIntervalBox = new VBox( combineOptions<VBoxOptions>( {
      children: [ sideABCDToleranceIntervalText, sideBCDAToleranceIntervalText, interAngleToleranceIntervalText, staticAngleToleranceIntervalText, shapeLengthToleranceIntervalText ]
    }, VBOX_OPTIONS ) );

    // shape name readout
    const shapeNameText = new Text( '', TEXT_OPTIONS );

    // tangible rotation readout
    // TODO: Can this be deleted? We don't care about rotation anymore, right?
    const rotationMarkerDetectedText = new Text( '', TEXT_OPTIONS );
    const tangibleRotationText = new Text( '', TEXT_OPTIONS );
    const markerBox = new VBox( combineOptions<VBoxOptions>( {
      children: [ rotationMarkerDetectedText, tangibleRotationText ]
    }, VBOX_OPTIONS ) );

    // decimal places readout
    const decimalPlacesProperty = new NumberProperty( 3, { range: new Range( 2, 5 ) } );
    const decimalPlacesControl = new NumberControl( 'Decimal Places', decimalPlacesProperty, decimalPlacesProperty.range, {
      sliderOptions: {
        keyboardStep: 1,
        thumbSize: new Dimension2( 10, 17 )
      },

      // no tandems for debugging
      tandem: Tandem.OPT_OUT
    } );

    const content = new VBox( combineOptions<VBoxOptions>( {
      children: [
        lengthBox,
        angleBox,
        parallelogramBox,
        toleranceIntervalBox,
        shapeNameText,
        markerBox,
        decimalPlacesControl
      ],
      spacing: 15
    }, VBOX_OPTIONS ) );

    const backgroundRectangle = new Rectangle( 0, 0, 400, content.height + CONTENT_PADDING, 5, 5, {
      fill: 'white'
    } );
    content.leftTop = backgroundRectangle.leftTop.plusXY( CONTENT_PADDING / 2, CONTENT_PADDING / 2 );

    super( {
      children: [ backgroundRectangle, content ],

      // panel is see-through so that the shape can move and be dragged under it
      opacity: 0.7
    } );

    // mutate after defaults (mostly children for bounds) have been set
    this.mutate( providedOptions );

    // Link to the model to print the values
    // length
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.topSide.lengthProperty, topSideLengthText, 'Side AB', decimalPlacesProperty );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.rightSide.lengthProperty, rightSideLengthText, 'Side BC', decimalPlacesProperty );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.bottomSide.lengthProperty, bottomSideLengthText, 'Side CD', decimalPlacesProperty );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.leftSide.lengthProperty, leftSideLengthText, 'Side DA', decimalPlacesProperty );

    // angle
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexA.angleProperty, cornerAAngleText, 'Corner A', decimalPlacesProperty, true );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexB.angleProperty, cornerBAngleText, 'Corner B', decimalPlacesProperty, true );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexC.angleProperty, cornerCAngleText, 'Corner C', decimalPlacesProperty, true );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexD.angleProperty, cornerDAngleText, 'Corner D', decimalPlacesProperty, true );

    // parallelogram and paralle sides
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.isParallelogramProperty, isParallelogramText, 'Is parallelogram', decimalPlacesProperty );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 0 ][ 'isParallelProperty' ], sideABCDParallelText, '(AB, CD) parallel', decimalPlacesProperty );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 1 ][ 'isParallelProperty' ], sideBCDAParallelText, '(BC, DA) parallel', decimalPlacesProperty );

    // angleToleranceIntervals for each opposite side pair
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 0 ][ 'parallelAngleToleranceIntervalProperty' ], sideABCDToleranceIntervalText, '(AB, CD) parallelAngleToleranceInterval', decimalPlacesProperty );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 1 ][ 'parallelAngleToleranceIntervalProperty' ], sideBCDAToleranceIntervalText, '(BC, DA) parallelAngleToleranceInterval', decimalPlacesProperty );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.interAngleToleranceIntervalProperty, interAngleToleranceIntervalText, 'interAngleToleranceInterval', decimalPlacesProperty );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.staticAngleToleranceIntervalProperty, staticAngleToleranceIntervalText, 'staticAngleToleranceInterval', decimalPlacesProperty );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.interLengthToleranceIntervalProperty, shapeLengthToleranceIntervalText, 'shapeLengthToleranceInterval', decimalPlacesProperty );

    // shape name
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( model.quadrilateralShapeModel.shapeNameProperty, shapeNameText, 'shape name', decimalPlacesProperty );

    // marker detection
    const markerDetectionModel = model.tangibleConnectionModel.markerDetectionModel;
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( markerDetectionModel.rotationMarkerDetectedProperty, rotationMarkerDetectedText, 'Marker detected', decimalPlacesProperty );
    QuadrilateralDebuggingPanel.addRedrawValueTextListener( markerDetectionModel.tangibleRotationProperty, tangibleRotationText, 'Tangible rotation', decimalPlacesProperty );
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
        text.text = StringUtils.fillIn( VALUE_WITH_DEGREES_PATTERN_STRING, {
          value: formattedValue,
          degrees: formattedDegrees,
          label: label
        } );
      }
      else {
        text.text = StringUtils.fillIn( VALUE_PATTERN_STRING, {
          value: formattedValue,
          label: label
        } );
      }
    } );
  }
}

quadrilateral.register( 'QuadrilateralDebuggingPanel', QuadrilateralDebuggingPanel );
export default QuadrilateralDebuggingPanel;

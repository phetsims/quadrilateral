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
import { Text, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import IProperty from '../../../../axon/js/IProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import Property from '../../../../axon/js/Property.js';

const TEXT_OPTIONS = { fontSize: 16 };
const valuePatternString = '{{label}}: {{value}}';

class QuadrilateralModelValuePanel extends Panel {
  public constructor( model: QuadrilateralModel, providedOptions?: PanelOptions ) {

    const options = optionize<PanelOptions, EmptySelfOptions>()( {

      // looks good for debugging without the panel resizing frequently
      minWidth: 400
    }, providedOptions );

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
    const shapeAngleToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const shapeLengthToleranceIntervalText = new Text( '', TEXT_OPTIONS );
    const toleranceIntervalBox = new VBox( {
      children: [ sideABCDToleranceIntervalText, sideBCDAToleranceIntervalText, shapeAngleToleranceIntervalText, shapeLengthToleranceIntervalText ],
      align: 'left'
    } );

    const shapeNameText = new Text( '', TEXT_OPTIONS );

    const markerDetectedText = new Text( '', TEXT_OPTIONS );
    const markerRotationText = new Text( '', TEXT_OPTIONS );
    const markerBox = new VBox( {
      children: [ markerDetectedText, markerRotationText ],
      align: 'left'
    } );

    const content = new VBox( {
      children: [
        lengthBox,
        angleBox,
        parallelogramBox,
        toleranceIntervalBox,
        shapeNameText,
        markerBox
      ],
      align: 'left',
      spacing: 15
    } );

    super( content, options );

    // Link to the model to print the values
    // length
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.topSide.lengthProperty, topSideLengthText, 'Side AB' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.rightSide.lengthProperty, rightSideLengthText, 'Side BC' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.bottomSide.lengthProperty, bottomSideLengthText, 'Side CD' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.leftSide.lengthProperty, leftSideLengthText, 'Side DA' );

    // angle
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexA.angleProperty, leftTopAngleText, 'Corner A' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexB.angleProperty, rightTopAngleText, 'Corner B' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexC.angleProperty, rightBottomAngleText, 'Corner C' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertexD.angleProperty, leftBottomAngleText, 'Corner D' );

    // parallelogram and paralle sides
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.isParallelogramProperty, isParallelogramText, 'Is parallelogram' );
    // @ts-ignore - isParallelProperty is private, but I want to use it here as a special exception for debugging
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 0 ].isParallelProperty, sideABCDParallelText, '(AB, CD) parallel' );
    // @ts-ignore - isParallelProperty is private, but I want to use it here as a special exception for debugging
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 1 ].isParallelProperty, sideBCDAParallelText, '(BC, DA) parallel' );

    // angleToleranceIntervals for each opposite side pair
    // @ts-ignore - angleToleranceInterval is private, but I want to use it here for now just for debugging
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 0 ].angleToleranceIntervalProperty, sideABCDToleranceIntervalText, '(AB, CD) angleToleranceInterval' );
    // @ts-ignore - angleToleranceInterval is private, but I want to use it here for now just for debugging
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.parallelSideCheckers[ 1 ].angleToleranceIntervalProperty, sideBCDAToleranceIntervalText, '(BC, DA) angleToleranceInterval' );
    // @ts-ignore - shapeAngleToleranceInterval is private, but I want to use it here for now just for debugging
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.shapeAngleToleranceIntervalProperty, shapeAngleToleranceIntervalText, 'shapeAngleToleranceInterval' );
    // @ts-ignore - shapeLengthToleranceInterval is private, but I want to use it here for now just for debugging
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.shapeLengthToleranceIntervalProperty, shapeLengthToleranceIntervalText, 'shapeLengthToleranceInterval' );

    // shape name
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.shapeNameProperty, shapeNameText, 'shape name' );

    // marker detection
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.rotationMarkerDetectedProperty, markerDetectedText, 'Marker detected' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.markerRotationProperty, markerRotationText, 'Marker rotation' );
  }

  private static addRedrawValueTextListener( property: IReadOnlyProperty<number | null> | IProperty<boolean> | Property<NamedQuadrilateral>, text: Text, label: string ): void {
    property.link( value => {

      let formattedValue = value;

      // if a number, trim so that it is easier to read
      if ( typeof value === 'number' ) {
        formattedValue = Utils.toFixedNumber( value, 2 );
      }

      text.text = StringUtils.fillIn( valuePatternString, {
        value: formattedValue,
        label: label
      } );
    } );
  }
}

quadrilateral.register( 'QuadrilateralModelValuePanel', QuadrilateralModelValuePanel );
export default QuadrilateralModelValuePanel;

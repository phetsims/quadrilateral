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
import Panel from '../../../../sun/js/Panel.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import IProperty from '../../../../axon/js/IProperty.js';
import Utils from '../../../../dot/js/Utils.js';

const TEXT_OPTIONS = { fontSize: 16 };
const valuePatternString = '{{label}}: {{value}}';

class QuadrilateralModelValuePanel extends Panel {
  constructor( model: QuadrilateralModel, options?: any ) {

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

    const content = new VBox( {
      children: [
        lengthBox,
        angleBox,
        isParallelogramText
      ],
      align: 'left',
      spacing: 15
    } );

    super( content, options );

    // Link to the model to print the values
    // length
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.topSide.lengthProperty, topSideLengthText, 'Top side' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.rightSide.lengthProperty, rightSideLengthText, 'Right side' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.bottomSide.lengthProperty, bottomSideLengthText, 'Bottom side' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.leftSide.lengthProperty, leftSideLengthText, 'Left side' );

    // angle
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertex1.angleProperty!, leftTopAngleText, 'Left top angle' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertex2.angleProperty!, rightTopAngleText, 'Right top angle' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertex3.angleProperty!, rightBottomAngleText, 'Right bottom angle' );
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.vertex4.angleProperty!, leftBottomAngleText, 'Left bottom angle' );

    // isParallelogramProperty
    QuadrilateralModelValuePanel.addRedrawValueTextListener( model.quadrilateralShapeModel.isParallelogramProperty, isParallelogramText, 'Is parallelogram' );
  }

  private static addRedrawValueTextListener( property: IReadOnlyProperty<number> | IProperty<boolean>, text: Text, label: string ) {
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

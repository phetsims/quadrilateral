// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import quadrilateral from '../../quadrilateral.js';

class CalibrationContentNode extends VBox {
  constructor( model, options ) {

    options = merge( {
      align: 'center'
    }, options );

    const calibrateHintText = new Text( 'Make the device as large as you can, then close the dialog.', {
      font: new PhetFont( 24 )
    } );

    // create a square shape to display the values provided by the quadrilateral model
    const viewBounds = new Bounds2( 0, 0, 300, 300 );
    const calibrationRectangle = new Rectangle( viewBounds, {
      stroke: 'grey'
    } );

    // vertices
    const vertex1Circle = new Circle( 5, {
      center: viewBounds.leftTop
    } );
    const vertex2Circle = new Circle( 5, {
      center: viewBounds.rightTop
    } );
    const vertex3Circle = new Circle( 5, {
      center: viewBounds.rightBottom
    } );
    const vertex4Circle = new Circle( 5, {
      center: viewBounds.leftBottom
    } );
    calibrationRectangle.children = [ vertex1Circle, vertex2Circle, vertex3Circle, vertex4Circle ];

    // display of coordinates
    const dimensionLineOptions = { stroke: 'grey' };
    const heightTickLine = new Line( 0, 0, 0, 300, dimensionLineOptions );
    const bottomTickLine = new Line( 0, 0, 10, 0, dimensionLineOptions );
    const topTickLine = new Line( 0, 0, 10, 0, dimensionLineOptions );
    const leftSideLengthText = new Text( 'null', { font: new PhetFont( { size: 24 } ), rotation: -Math.PI / 2 } );

    bottomTickLine.centerTop = heightTickLine.centerBottom;
    topTickLine.centerBottom = heightTickLine.centerTop;
    heightTickLine.rightCenter = calibrationRectangle.leftCenter.minusXY( 15, 0 );
    leftSideLengthText.rightCenter = heightTickLine.leftCenter;

    heightTickLine.children = [ bottomTickLine, topTickLine, leftSideLengthText ];

    calibrationRectangle.addChild( heightTickLine );

    options.children = [
      calibrateHintText,
      calibrationRectangle
    ];
    super( options );

    model.physicalModelBoundsProperty.link( physicalModelBounds => {
      if ( physicalModelBounds !== null ) {
        leftSideLengthText.text = Utils.toFixed( physicalModelBounds.height, 2 );
      }
    } );
  }
}

quadrilateral.register( 'CalibrationContentNode', CalibrationContentNode );
export default CalibrationContentNode;
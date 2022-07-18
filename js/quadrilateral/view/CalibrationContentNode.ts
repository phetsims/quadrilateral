// Copyright 2021-2022, University of Colorado Boulder

/**
 * The contents of a Dialog that will support calibrating a device to the simulation. The device is feeding
 * physical values measured by sensors. Those need to be mapped to model coordinates in the sim. We calibrate
 * by asking the user to set their device as large as they can make it. From the largest lengths we can
 * create create a linear mapping to model coordinates.
 *
 * TODO: This is a prototype and may not be needed anymore, possibly time to remove.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import { Circle, Line, Rectangle, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';

class CalibrationContentNode extends VBox {
  public constructor( model: QuadrilateralModel, providedOptions?: VBoxOptions ) {

    const options = optionize<VBoxOptions, EmptyObjectType>()( {
      align: 'center'
    }, providedOptions );

    const calibrateHintText = new Text( 'Extend your connected device to the maximum limits and then close this dialog box.', QuadrilateralConstants.PANEL_LABEL_TEXT_OPTIONS );

    // create a square shape to display the values provided by the quadrilateral model
    const viewBounds = new Bounds2( 0, 0, 300, 300 );
    const calibrationRectangle = new Rectangle( viewBounds, {
      stroke: 'grey'
    } );

    // vertices
    const vertexACircle = new Circle( 5, {
      center: viewBounds.leftTop
    } );
    const vertexBCircle = new Circle( 5, {
      center: viewBounds.rightTop
    } );
    const vertexCCircle = new Circle( 5, {
      center: viewBounds.rightBottom
    } );
    const vertexDCircle = new Circle( 5, {
      center: viewBounds.leftBottom
    } );
    calibrationRectangle.children = [ vertexACircle, vertexBCircle, vertexCCircle, vertexDCircle ];

    // display of coordinates
    const dimensionLineOptions = { stroke: 'grey' };
    const heightTickLine = new Line( 0, 0, 0, 300, dimensionLineOptions );
    const bottomTickLine = new Line( 0, 0, 10, 0, dimensionLineOptions );
    const topTickLine = new Line( 0, 0, 10, 0, dimensionLineOptions );
    const leftSideLengthText = new Text( 'null', QuadrilateralConstants.PANEL_LABEL_TEXT_OPTIONS );
    leftSideLengthText.rotation = -Math.PI / 2;

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
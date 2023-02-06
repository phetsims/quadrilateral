// Copyright 2023, University of Colorado Boulder

/**
 * The controls in the ScreenView that are related to connection to prototype tangibles. For example, they will
 * support connection to a bluetooth device, serial connection, or begin calibration with a physical device.
 *
 * These are not shown unless requested with query parameters (different controls shown depending on requested feature,
 * see QuadrilateralQueryParameters).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Text, VBox } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import TangibleConnectionModel from '../model/prototype/TangibleConnectionModel.js';
import CalibrationContentNode from './CalibrationContentNode.js';
import Dialog from '../../../../sun/js/Dialog.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import QuadrilateralBluetoothConnectionButton from './QuadrilateralBluetoothConnectionButton.js';
import QuadrilateralSerialConnectionButton from './QuadrilateralSerialConnectionButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';

class QuadrilateralTangibleControls extends VBox {
  public constructor( tangibleConnectionModel: TangibleConnectionModel, tandem: Tandem ) {

    // Add a Dialog that will calibrate the device to the simulation (mapping physical data to modelled data).
    const calibrationDialog = new Dialog( new CalibrationContentNode( tangibleConnectionModel ), {
      title: new Text( 'External Device Calibration', QuadrilateralConstants.PANEL_TITLE_TEXT_OPTIONS )
    } );

    calibrationDialog.isShowingProperty.link( ( isShowing, wasShowing ) => {
      tangibleConnectionModel.isCalibratingProperty.value = isShowing;

      // When the dialog is closed...
      if ( !isShowing && wasShowing !== null ) {

        // it is possible that the Dialog was closed without getting good values for the bounds
        const physicalModelBounds = tangibleConnectionModel.physicalModelBoundsProperty.value;
        if ( physicalModelBounds && physicalModelBounds.isValid() ) {

          // set reasonable initial positions of vertices
          tangibleConnectionModel.finishCalibration();
        }
      }
    } );

    // final contents depend on query parameters
    const children = [];

    // open the calibration dialog
    const calibrationButton = new TextPushButton( 'Calibrate Device', {
      listener: () => {
        calibrationDialog.show();
      },

      textNodeOptions: QuadrilateralConstants.SCREEN_TEXT_OPTIONS,
      baseColor: QuadrilateralColors.screenViewButtonColorProperty
    } );
    children.push( calibrationButton );

    if ( QuadrilateralQueryParameters.bluetooth ) {

      // request BLE devices
      const bluetoothButton = new QuadrilateralBluetoothConnectionButton( tangibleConnectionModel, tandem.createTandem( 'quadrilateralBluetoothConnectionButton' ) );
      children.push( bluetoothButton );
    }

    if ( QuadrilateralQueryParameters.serial ) {

      // send values to the device with serial connection
      const sendValuesButton = new QuadrilateralSerialConnectionButton( tangibleConnectionModel );
      children.push( sendValuesButton );
    }

    super( {
      align: 'left',
      spacing: QuadrilateralConstants.CONTROLS_SPACING,
      children: children
    } );
  }
}

quadrilateral.register( 'QuadrilateralTangibleControls', QuadrilateralTangibleControls );
export default QuadrilateralTangibleControls;

// Copyright 2022, University of Colorado Boulder

/**
 * To test connecting to a bluetooth device using web bluetooth. Note this uses Promises (as the
 * bluetooth API works with promises) which is very unusual for simulation code.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';

// The bluetooth options for the requestDevice call.
const REQUEST_DEVICE_OPTIONS = {
  filters: [
    { services: [ 'heart_rate' ] }, // TODO: Is this right?
    { services: [ 0x1802, 0x1803 ] },
    { services: [ '19b10010-e8f2-537e-4f6c-d104768a1214' ] },
    { name: 'Arduino' }
  ],
  optionalServices: [ 'battery_service' ] // TODO: Is this right?
};

class QuadrilateralBluetoothConnectionPanel extends Panel {
  constructor( tandem: Tandem ) {

    // TODO: Handle when device does not support bluetooth with bluetooth.getAvailability.
    // TODO: Handle when browser does not support bluetooth, presumablue !navigator.bluetooth

    const titleText = new Text( 'Bluetooth connection', QuadrilateralConstants.PANEL_TITLE_TEXT_OPTIONS );

    const content = new VBox( {
      spacing: 15
    } );

    super( content, {
      minWidth: 200,
      align: 'center'
    } );

    const pairButton = new TextPushButton( 'Search for device', {
      textNodeOptions: QuadrilateralConstants.PANEL_LABEL_TEXT_OPTIONS,
      listener: this.requestQuadDevice.bind( this )
    } );

    content.children = [ titleText, pairButton ];
  }

  private async requestQuadDevice() {
    let device: null | any; // should be type BluetoothDevice, but it is too experimental for native types

    // @ts-ignore - navigator.bluetooth is experimental and does not exist in the typing
    if ( navigator.bluetooth ) {
      // @ts-ignore - navigator.bluetooth is experimental and does not exist in the typing
      device = await navigator.bluetooth.requestDevice( REQUEST_DEVICE_OPTIONS ).catch( err => {
        device = null;
      } );

      if ( device ) {
        console.log( device.name );
        console.log( device.id );

        // attempt to connect to the GATT Server.
        const gattServer = await device.gatt.connect().catch( ( err: DOMException ) => { console.error( err ); } );
        const primaryService = await gattServer.getPrimaryService( '19b10010-e8f2-537e-4f6c-d104768a1214' ).catch( ( err: DOMException ) => { console.error( err ); } );
        const characteristic = await primaryService.getCharacteristic( '19b10010-e8f2-537e-4f6c-d104768a1214' ).catch( ( err: DOMException ) => { console.error( err ); } );
        const notifySuccess = await characteristic.startNotifications().catch( ( err: DOMException ) => { console.error( err ); } );
        notifySuccess.addEventListener( 'characteristicvaluechanged', QuadrilateralBluetoothConnectionPanel.handleCharacteristicValueChanged );

        // At this time we can assume that connections are successful
        console.log( 'connection successful' );
      }
    }
  }

  /**
   * Respond to a characteristicvaluechanged event.
   * TODO: Implement this function. This is the main event we get when we receive new data from the device.
   */
  private static handleCharacteristicValueChanged( event: Event ) {
    if ( event.target ) {

      // @ts-ignore
      console.log( event.target.value.getUint8( 0 ) );
    }
  }
}

quadrilateral.register( 'QuadrilateralBluetoothConnectionPanel', QuadrilateralBluetoothConnectionPanel );
export default QuadrilateralBluetoothConnectionPanel;

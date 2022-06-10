// Copyright 2022, University of Colorado Boulder

/**
 * To test connecting to a bluetooth device using web bluetooth. Note this uses Promises (as the
 * bluetooth API works with promises) which is very unusual for simulation code.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import Emitter from '../../../../axon/js/Emitter.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import stepTimer from '../../../../axon/js/stepTimer.js';

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

class QuadrilateralBluetoothConnectionButton extends TextPushButton {

  private timeSinceUpdatingSim = 0;

  public readonly allDataCollectedEmitter = new Emitter();

  private topLength = 0;
  private rightLength = 0;
  private leftLength = 0;
  private topLeftAngle = 0;
  private topRightAngle = 0;

  constructor( quadrilateralModel: QuadrilateralModel, tandem: Tandem ) {

    // TODO: Handle when device does not support bluetooth with bluetooth.getAvailability.
    // TODO: Handle when browser does not support bluetooth, presumablue !navigator.bluetooth
    super( 'Search for device', {
      textNodeOptions: QuadrilateralConstants.PANEL_LABEL_TEXT_OPTIONS
    } );

    this.addListener( this.requestQuadDevice.bind( this ) );

    this.allDataCollectedEmitter.addListener( () => {
      if ( quadrilateralModel.isCalibratingProperty.value ) {
        quadrilateralModel.setPhysicalModelBounds( this.topLength, this.rightLength, 0, this.leftLength );
      }
      else if ( quadrilateralModel.physicalModelBoundsProperty.value ) {

        // In an attempt to filter out noise, only update the sim at this interval
        if ( this.timeSinceUpdatingSim > quadrilateralModel.preferencesModel.bluetoothUpdateIntervalProperty.value ) {
          quadrilateralModel.quadrilateralShapeModel.setPositionsFromLengthAndAngleData(
            this.topLength,
            this.rightLength,
            5, // unused in setPositionsFromLengthsAndAngles
            this.leftLength,

            Utils.toRadians( this.topLeftAngle ),
            Utils.toRadians( this.topRightAngle ),
            Utils.toRadians( 90 ), // unused in setPositionsFromLengthsAndAngles
            Utils.toRadians( 90 ) // unused in setPositionsFromLengthsAndAngles
          );

          // wait for the update interval before setting positions to the sim again
          this.timeSinceUpdatingSim = 0;
        }
      }
    } );

    stepTimer.addListener( dt => {
      this.timeSinceUpdatingSim += dt;
    } );

    // Browser throws an error durring fuzzing that requires bluetooth connection to happen from
    // user input.
    this.enabled = !phet.chipper.isFuzzEnabled();
  }

  private async requestQuadDevice(): Promise<any> {

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
        notifySuccess.addEventListener( 'characteristicvaluechanged', ( event: Event ) => {
          this.handleCharacteristicValueChanged( event );
        } );
        const characteristic2 = await primaryService.getCharacteristic( '19b10010-e8f2-537e-4f6c-d104768a1215' ).catch( ( err: DOMException ) => { console.error( err ); } );
        const notifySuccess2 = await characteristic2.startNotifications().catch( ( err: DOMException ) => { console.error( err ); } );
        notifySuccess2.addEventListener( 'characteristicvaluechanged', ( event: Event ) => {
          this.handleCharacteristicValue2Changed( event );
        } );
        const characteristic3 = await primaryService.getCharacteristic( '19b10010-e8f2-537e-4f6c-d104768a1216' ).catch( ( err: DOMException ) => { console.error( err ); } );
        const notifySuccess3 = await characteristic3.startNotifications().catch( ( err: DOMException ) => { console.error( err ); } );
        notifySuccess3.addEventListener( 'characteristicvaluechanged', ( event: Event ) => {
          this.handleCharacteristicValue3Changed( event );
        } );
        const characteristic4 = await primaryService.getCharacteristic( '19b10010-e8f2-537e-4f6c-d104768a1217' ).catch( ( err: DOMException ) => { console.error( err ); } );
        const notifySuccess4 = await characteristic4.startNotifications().catch( ( err: DOMException ) => { console.error( err ); } );
        notifySuccess4.addEventListener( 'characteristicvaluechanged', ( event: Event ) => {
          this.handleCharacteristicValue4Changed( event );
        } );
        const characteristic5 = await primaryService.getCharacteristic( '19b10010-e8f2-537e-4f6c-d104768a1218' ).catch( ( err: DOMException ) => { console.error( err ); } );
        const notifySuccess5 = await characteristic5.startNotifications().catch( ( err: DOMException ) => { console.error( err ); } );
        notifySuccess5.addEventListener( 'characteristicvaluechanged', ( event: Event ) => {
          this.handleCharacteristicValue5Changed( event );
        } );
        // At this time we can assume that connections are successful
        console.log( 'connection successful' );
      }
    }
  }

  /**
   * Respond to a characteristicvaluechanged event.
   * TODO: Implement this function. This is the main event we get when we receive new data from the device.
   */
  private handleCharacteristicValueChanged( event: Event ): void {
    if ( event.target ) {
      // @ts-ignore
      // console.log( '1: ', event.target.value.getFloat32( 0, true ) );

      // @ts-ignore
      this.topLength = event.target.value.getFloat32( 0, true );
    }
  }

  private handleCharacteristicValue2Changed( event: Event ): void {
    if ( event.target ) {
      // @ts-ignore
      // console.log( '2: ', event.target.value.getFloat32( 0, true ) );

      // @ts-ignore
      this.rightLength = event.target.value.getFloat32( 0, true );
    }
  }

  private handleCharacteristicValue3Changed( event: Event ): void {
    if ( event.target ) {
      // @ts-ignore
      // console.log( '3: ', event.target.value.getFloat32( 0, true ) );

      // @ts-ignore
      this.leftLength = event.target.value.getFloat32( 0, true );
    }
  }

  private handleCharacteristicValue4Changed( event: Event ): void {
    if ( event.target ) {
      // @ts-ignore
      // console.log( '4: ', event.target.value.getFloat32( 0, true ) );

      // @ts-ignore
      this.topLeftAngle = event.target.value.getFloat32( 0, true );
    }
  }

  private handleCharacteristicValue5Changed( event: Event ): void {
    if ( event.target ) {
      // @ts-ignore
      // console.log( '5: ', event.target.value.getFloat32( 0, true ) );

      // @ts-ignore
      this.topRightAngle = event.target.value.getFloat32( 0, true );

      // signify that it is time to update the simulation
      this.allDataCollectedEmitter.emit();
    }
  }
}

quadrilateral.register( 'QuadrilateralBluetoothConnectionButton', QuadrilateralBluetoothConnectionButton );
export default QuadrilateralBluetoothConnectionButton;

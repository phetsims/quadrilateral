// Copyright 2022-2023, University of Colorado Boulder

/**
 * To test connecting to a bluetooth device using web bluetooth. Note this uses Promises (as the
 * bluetooth API works with promises) which is very unusual for simulation code.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
import quadrilateral from '../../../quadrilateral.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import QuadrilateralConstants from '../../../QuadrilateralConstants.js';
import Utils from '../../../../../dot/js/Utils.js';
import Emitter from '../../../../../axon/js/Emitter.js';
import stepTimer from '../../../../../axon/js/stepTimer.js';
import IntentionalAny from '../../../../../phet-core/js/types/IntentionalAny.js';
import QuadrilateralColors from '../../../QuadrilateralColors.js';
import TangibleConnectionModel from '../../model/prototype/TangibleConnectionModel.js';
import QuadrilateralTangibleController from './QuadrilateralTangibleController.js';

// The bluetooth options for the requestDevice call. There must be at least one entry in filters for the browser
// to make a request! The service ID was provided by Scott Lambert at SLU who built the prototype device.
const REQUEST_DEVICE_OPTIONS = {
  filters: [
    { services: [ '19b10010-e8f2-537e-4f6c-d104768a1214' ] },
    { name: 'Arduino' }
  ]
};

class QuadrilateralBluetoothConnectionButton extends TextPushButton {

  // Amount of time passed in ms since updating the simulation from bluetooth input. We wait at least every
  // QuadrilateralTangibleOptionsModel.bluetoothUpdateIntervalProperty.value in an attempt to filter out noise.
  private timeSinceUpdatingSim = 0;

  public readonly allDataCollectedEmitter = new Emitter();

  private readonly tangibleConnectionModel: TangibleConnectionModel;

  private topLength = 0;
  private rightLength = 0;
  private leftLength = 0;
  private topLeftAngle = 0;
  private topRightAngle = 0;

  public constructor( tangibleConnectionModel: TangibleConnectionModel, tangibleController: QuadrilateralTangibleController ) {

    // TODO: Handle when device does not support bluetooth with bluetooth.getAvailability.
    // TODO: Handle when browser does not support bluetooth, presumably !navigator.bluetooth
    super( 'Pair BLE Device', {
      textNodeOptions: QuadrilateralConstants.SCREEN_TEXT_OPTIONS,
      baseColor: QuadrilateralColors.screenViewButtonColorProperty
    } );

    this.tangibleConnectionModel = tangibleConnectionModel;

    this.addListener( this.requestQuadDevice.bind( this ) );

    this.allDataCollectedEmitter.addListener( () => {
      if ( this.tangibleConnectionModel.isCalibratingProperty.value ) {
        this.tangibleConnectionModel.setPhysicalModelBounds( this.topLength, this.rightLength, 0, this.leftLength );
      }
      else if ( tangibleConnectionModel.physicalModelBoundsProperty.value ) {

        // In an attempt to filter out noise, only update the sim at this interval
        const updateInterval = tangibleConnectionModel.tangibleOptionsModel.bluetoothUpdateIntervalProperty.value;
        if ( this.timeSinceUpdatingSim > updateInterval ) {
          tangibleController.setPositionsFromLengthAndAngleData(
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

  /**
   * Uses web bluetooth API to connect to a particular device.
   *
   * 6/29/22 - JG decided to use IntentionalAny for this prototype code that will likely never see production.
   */
  private async requestQuadDevice(): Promise<IntentionalAny> {

    // should be type BluetoothDevice, but it is too experimental for native types. There is no need to re-implement
    // typing of the bluetooth web API for this prototype code.
    let device: null | IntentionalAny;

    // @ts-expect-error - navigator.bluetooth is experimental and does not exist in the typing
    if ( navigator.bluetooth ) {
      // @ts-expect-error - navigator.bluetooth is experimental and does not exist in the typing
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
        // TODO: Set to false when connection is lost?
        console.log( 'connection successful' );
        this.tangibleConnectionModel.connectedToDeviceProperty.value = true;
      }
    }
  }

  /**
   * Respond to a characteristicvaluechanged event.
   *
   * NOTE: ts-expect-errors are reasonable for this "experimental" web technology. event.target.value is defined for
   * the `characteristicvaluechanged` event of the Web Bluetooth API. I believe the type of target is
   * https://developer.mozilla.org/en-US/docs/Web/API/BluetoothRemoteGATTCharacteristic, but haven't tested in a while.
   */
  private handleCharacteristicValueChanged( event: Event ): void {
    if ( event.target ) {
      // @ts-expect-error - See note at handleCharacteristicValueChanged() about this.
      console.log( '1: ', event.target.value.getFloat32( 0, true ) );

      // @ts-expect-error - See note at handleCharacteristicValueChanged() about this.
      this.topLength = event.target.value.getFloat32( 0, true );
    }
  }

  private handleCharacteristicValue2Changed( event: Event ): void {
    if ( event.target ) {
      // @ts-expect-error - See note at handleCharacteristicValueChanged() about this.
      console.log( '2: ', event.target.value.getFloat32( 0, true ) );

      // @ts-expect-error - See note at handleCharacteristicValueChanged() about this.
      this.rightLength = event.target.value.getFloat32( 0, true );
    }
  }

  private handleCharacteristicValue3Changed( event: Event ): void {
    if ( event.target ) {
      // @ts-expect-error - See note at handleCharacteristicValueChanged() about this.
      console.log( '3: ', event.target.value.getFloat32( 0, true ) );

      // @ts-expect-error - See note at handleCharacteristicValueChanged() about this.
      this.leftLength = event.target.value.getFloat32( 0, true );
    }
  }

  private handleCharacteristicValue4Changed( event: Event ): void {
    if ( event.target ) {
      // @ts-expect-error - See note at handleCharacteristicValueChanged() about this.
      console.log( '4: ', event.target.value.getFloat32( 0, true ) );

      // @ts-expect-error - See note at handleCharacteristicValueChanged() about this.
      this.topLeftAngle = event.target.value.getFloat32( 0, true );
    }
  }

  private handleCharacteristicValue5Changed( event: Event ): void {
    if ( event.target ) {
      // @ts-expect-error - See note at handleCharacteristicValueChanged() about this.
      console.log( '5: ', event.target.value.getFloat32( 0, true ) );

      // @ts-expect-error - See note at handleCharacteristicValueChanged() about this.
      this.topRightAngle = event.target.value.getFloat32( 0, true );

      // signify that it is time to update the simulation
      this.allDataCollectedEmitter.emit();
    }
  }
}

quadrilateral.register( 'QuadrilateralBluetoothConnectionButton', QuadrilateralBluetoothConnectionButton );
export default QuadrilateralBluetoothConnectionButton;

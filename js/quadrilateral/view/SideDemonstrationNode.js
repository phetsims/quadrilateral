// Copyright 2021, University of Colorado Boulder

/**
 * A Node used to test and demonstrate the sound design, allowing one to layer in one side at a time. When all
 * sides are in place it is difficult to hear what is changing. By isolating a single side or pairs at a time
 * it is easier to demonstrate the design, debug, and discuss.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import SideNode from './SideNode.js';
import SideSoundView from './SideSoundView.js';
import VertexNode from './VertexNode.js';

class SideDemonstrationNode extends Node {

  /**
   * @param {QuadrilateralModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( model, modelViewTransform, options ) {
    super( options );

    const vertex1Node = new VertexNode( model.vertex1, modelViewTransform );
    const vertex2Node = new VertexNode( model.vertex2, modelViewTransform );
    const vertex3Node = new VertexNode( model.vertex3, modelViewTransform );
    const vertex4Node = new VertexNode( model.vertex4, modelViewTransform );

    if ( QuadrilateralQueryParameters.rightSide ) {
      const rightSideNode = new SideNode( model.rightSide, modelViewTransform );
      this.addChild( rightSideNode );

      this.rightSideSoundView = new SideSoundView( model.rightSide );
      model.shapeChangedEmitter.addListener( () => {
        this.rightSideSoundView.startPlayingSounds();
      } );

      // for demonstration purposes we will tie the tilt of the right side to the tilt of a phone
      // while both phone and simulation are attached to the websocket server
      if ( QuadrilateralQueryParameters.ipAddress && QuadrilateralQueryParameters.port ) {
        const ipAddress = QuadrilateralQueryParameters.ipAddress.replaceAll( '_', '.' );
        const port = QuadrilateralQueryParameters.port;
        console.log( ipAddress );

        const wsPrefix = 'ws'; // TODO: needs another s for https cases
        const ws = new WebSocket( `${wsPrefix}://${ipAddress}:${port}`, [ 'json' ] );

        const sendJSON = payload => {
          ws.send( JSON.stringify( payload ) );
        };

        const myClientName = 'simulation';
        ws.onopen = () => {
          sendJSON( 'Hello from the client' );

          // specify the client name so that the server registers this websocket
          sendJSON( {
            messageType: 'open',
            clientName: myClientName
          } );
        };

        model.rightSide.tiltProperty.link( tilt => {

        } );

        ws.onmessage = function( evt ) {
          const received_msg = evt.data;
          const jsonObject = ( JSON.parse( received_msg ) );

          if ( jsonObject.value && jsonObject.value.command ) {
            if ( jsonObject.value.command === 'reset' ) {
              window.resetAllButton.pdomClick();
            }
          }
        };

        window.onbeforeunload = function() {

          // TODO: Why can't this be done in browser.onClose?
          sendJSON( {
            messageType: 'close',
            clientName: myClientName
          } );

          // ws.onclose = function() {}; // disable onclose handler first
          ws.close();
        };
      }
    }
    if ( QuadrilateralQueryParameters.leftSide ) {
      const leftSideNode = new SideNode( model.leftSide, modelViewTransform );
      this.addChild( leftSideNode );

      // sound
      this.leftSideSoundView = new SideSoundView( model.leftSide );
      model.shapeChangedEmitter.addListener( () => {
        this.leftSideSoundView.startPlayingSounds();
      } );
    }
    if ( QuadrilateralQueryParameters.topSide ) {
      const topSideNode = new SideNode( model.topSide, modelViewTransform );
      this.addChild( topSideNode );

      // sound
      this.topSideSoundView = new SideSoundView( model.topSide );
      model.shapeChangedEmitter.addListener( () => {
        this.topSideSoundView.startPlayingSounds();
      } );
    }
    if ( QuadrilateralQueryParameters.bottomSide ) {
      const bottomSideNode = new SideNode( model.bottomSide, modelViewTransform );
      this.addChild( bottomSideNode );

      // sound
      this.bottomSideSoundView = new SideSoundView( model.bottomSide );
      model.shapeChangedEmitter.addListener( () => {
        this.bottomSideSoundView.startPlayingSounds();
      } );
    }

    // add vertex children depending on sides requested
    if ( QuadrilateralQueryParameters.leftSide || QuadrilateralQueryParameters.topSide ) {
      this.addChild( vertex1Node );
    }
    if ( QuadrilateralQueryParameters.rightSide || QuadrilateralQueryParameters.topSide ) {
      this.addChild( vertex2Node );
    }
    if ( QuadrilateralQueryParameters.rightSide || QuadrilateralQueryParameters.bottomSide ) {
      this.addChild( vertex3Node );
    }
    if ( QuadrilateralQueryParameters.bottomSide || QuadrilateralQueryParameters.leftSide ) {
      this.addChild( vertex4Node );
    }
  }

  /**
   * Step the sound views.
   * @public
   *
   * @param dt
   */
  step( dt ) {
    this.rightSideSoundView && this.rightSideSoundView.step( dt );
    this.leftSideSoundView && this.leftSideSoundView.step( dt );
    this.topSideSoundView && this.topSideSoundView.step( dt );
    this.bottomSideSoundView && this.bottomSideSoundView.step( dt );
  }
}

quadrilateral.register( 'SideDemonstrationNode', SideDemonstrationNode );
export default SideDemonstrationNode;

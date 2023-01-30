// Copyright 2023, University of Colorado Boulder
import quadrilateral from '../../quadrilateral.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';

/**
 *
 *
 */

class QuadrilateralSerialMessageController {

  public constructor( shapeNameProperty: EnumerationProperty<NamedQuadrilateral> ) {
    window.setTimeout( () => {  // eslint-disable-line bad-sim-text
      const parent = window.parent;
      parent.postMessage( 'some message', '*' );
    }, 2000 );
    shapeNameProperty.link( shapeName => {
      if ( shapeName === NamedQuadrilateral.SQUARE ) {
        parent.postMessage( '1', '*' );
        window.setTimeout( () => { // eslint-disable-line bad-sim-text
          parent.postMessage( '7', '*' );
        }, 2000 );
      }
      if ( shapeName === NamedQuadrilateral.PARALLELOGRAM ) {
        parent.postMessage( '5', '*' );
      }
      if ( shapeName === NamedQuadrilateral.RECTANGLE ) {
        parent.postMessage( '3', '*' );
        window.setTimeout( () => { // eslint-disable-line bad-sim-text
          parent.postMessage( '7', '*' );
        }, 2000 );
      }
      if ( shapeName === NamedQuadrilateral.TRAPEZOID ) {
        parent.postMessage( '4', '*' );
      }
    } );

  }
}

quadrilateral.register( 'QuadrilateralSerialMessageController', QuadrilateralSerialMessageController );
export default QuadrilateralSerialMessageController;
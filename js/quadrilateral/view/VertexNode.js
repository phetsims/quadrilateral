// Copyright 2021, University of Colorado Boulder

/**
 * A view component for one of the vertices of the Quadrilateral.
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import Voicing from '../../../../scenery/js/accessibility/voicing/Voicing.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';

class VertexNode extends Circle {

  /**
   * @mixes Voicing
   * @param {Vertex} vertex
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( vertex, modelViewTransform, options ) {

    options = merge( {

      // pdom
      tagName: 'div',
      focusable: true,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( 25 );
    this.initializeVoicing();

    if ( QuadrilateralQueryParameters.showVertices ) {
      this.addChild( new Path( timesSolidShape, {
        fill: 'red',
        scale: 0.05,
        center: this.center
      } ) );
    }

    vertex.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // A basic keyboard input listener.
    const keyboardDragListener = new KeyboardDragListener( {
      positionProperty: vertex.positionProperty,
      transform: modelViewTransform,
      dragBounds: vertex.dragBoundsProperty.value,
      shiftDragVelocity: 100
    } );
    this.addInputListener( keyboardDragListener );

    // @private {DragListener}
    const dragListener = new DragListener( {
      positionProperty: vertex.positionProperty,
      transform: modelViewTransform,
      dragBoundsProperty: vertex.dragBoundsProperty,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    // notify when this vertex is pressed
    dragListener.isPressedProperty.link( isPressed => vertex.isPressedProperty.set( isPressed ) );

    // TODO: For now we are showing pointer areas instead of a graphical sim. These are used just to indicate
    // where you can press while we discuss multitouch considerations. We don't want something more permanent because
    // we are afraid a graphical design will influence other modalities.
    this.mouseArea = this.localBounds;
    this.touchArea = this.mouseArea;

    vertex.dragBoundsProperty.link( dragBounds => {
      keyboardDragListener.dragBounds = dragBounds;
    } );

    this.mutate( options );
  }
}

Voicing.compose( VertexNode );

quadrilateral.register( 'VertexNode', VertexNode );
export default VertexNode;
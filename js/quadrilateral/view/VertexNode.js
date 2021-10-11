// Copyright 2021, University of Colorado Boulder

/**
 * A view component for one of the vertices of the Quadrilateral.
 *
 * @author Jesse Greenberg
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Voicing from '../../../../scenery/js/accessibility/voicing/Voicing.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';

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

    super( 25, options );
    this.initializeVoicing( options );

    vertex.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // A basic keyboard input listener.
    this.addInputListener( new KeyboardDragListener( {
      positionProperty: vertex.positionProperty,
      transform: modelViewTransform,
      dragBounds: vertex.positionProperty.validBounds,
      shiftDragVelocity: 100
    } ) );

    // add basic mouse/touch input
    this.addInputListener( new DragListener( {
      positionProperty: vertex.positionProperty,
      transform: modelViewTransform,
      dragBoundsProperty: new Property( vertex.positionProperty.validBounds ),
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    // TODO: For now we are showing pointer areas instead of a graphical sim. These are used just to indicate
    // where you can press while we discuss multitouch considerations. We don't want something more permanent because
    // we are afraid a graphical design will influence other modalities.
    this.mouseArea = this.localBounds;
    this.touchArea = this.mouseArea;
  }
}

Voicing.compose( VertexNode );

quadrilateral.register( 'VertexNode', VertexNode );
export default VertexNode;
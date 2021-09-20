// Copyright 2021, University of Colorado Boulder

/**
 * The node for a side of a quadrilateral. No graphical design has been done yet, but creating this node
 * to exercise input and maniuplation of the quad shape. By dragging a side both vertices of the side will
 * extend in the direction of motion of the side.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import FocusHighlightPath from '../../../../scenery/js/accessibility/FocusHighlightPath.js';
import Voicing from '../../../../scenery/js/accessibility/voicing/Voicing.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import quadrilateral from '../../quadrilateral.js';

class SideNode extends Line {

  /**
   * @mixes Voicing
   * @param {Side} side
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( side, modelViewTransform, options ) {

    options = merge( {
      stroke: 'red',
      lineWidth: 5,

      // pdom
      tagName: 'div',
      focusable: true
    }, options );

    super( 0, 0, 0, 0, options );

    // initialize the voicing trait
    this.initializeVoicing( options );

    // pdom - make the focus highlight tightly surround the line so that it is easier to see the shape
    this.focusHighlight = new FocusHighlightPath( null );

    // listeners
    Property.multilink( [ side.vertex1.positionProperty, side.vertex2.positionProperty ], ( vertex1Position, vertex2Position ) => {
      const vertex1ViewPosition = modelViewTransform.modelToViewPosition( vertex1Position );
      const vertex2ViewPosition = modelViewTransform.modelToViewPosition( vertex2Position );
      this.setLine( vertex1ViewPosition.x, vertex1ViewPosition.y, vertex2ViewPosition.x, vertex2ViewPosition.y );

      // set the focus highlight shape
      this.focusHighlight.setShape( this.getStrokedShape() );
    } );

    // supports keyboard dragging, attempts to move both vertices in the direction of motion of the line
    this.addInputListener( new KeyboardDragListener( {
      transform: modelViewTransform,
      drag: vectorDelta => {

        // vectorDelta is in model coordinates already since we provided a transform to the listener
        const proposedVertex1Position = side.vertex1.positionProperty.get().plus( vectorDelta );
        const proposedVertex2Position = side.vertex2.positionProperty.get().plus( vectorDelta );

        if ( side.vertex1.positionProperty.validBounds.containsPoint( proposedVertex1Position ) &&
             side.vertex2.positionProperty.validBounds.containsPoint( proposedVertex2Position ) ) {
          side.vertex1.positionProperty.set( proposedVertex1Position );
          side.vertex2.positionProperty.set( proposedVertex2Position );
        }
      }
    } ) );
  }
}

Voicing.compose( SideNode );

quadrilateral.register( 'SideNode', SideNode );
export default SideNode;

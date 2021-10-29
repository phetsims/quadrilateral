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
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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
      lineWidth: 20,

      // pdom
      tagName: 'div',
      focusable: true,

      // phet-io
      tandem: Tandem.OPTIONAL
    }, options );

    super( 0, 0, 0, 0 );

    // initialize the voicing trait
    this.initializeVoicing();

    // @private {Side}
    this.side = side;

    // pdom - make the focus highlight tightly surround the line so that it is easier to see the shape
    this.focusHighlight = new FocusHighlightPath( null );

    // listeners
    Property.multilink( [ side.vertex1.positionProperty, side.vertex2.positionProperty ], ( vertex1Position, vertex2Position ) => {
      const vertex1ViewPosition = modelViewTransform.modelToViewPosition( vertex1Position );
      const vertex2ViewPosition = modelViewTransform.modelToViewPosition( vertex2Position );
      this.setLine( vertex1ViewPosition.x, vertex1ViewPosition.y, vertex2ViewPosition.x, vertex2ViewPosition.y );

      // set the focus highlight shape
      this.focusHighlight.setShape( this.getStrokedShape() );

      // TODO: For now we are showing pointer areas instead of a graphical sim. These are used just to indicate
      // where you can press while we discuss multitouch considerations. We don't want something more permanent because
      // we are afraid a graphical design will influence other modalities.
      this.mouseArea = this.getStrokedShape();
      this.touchArea = this.mouseArea;
    } );

    // supports keyboard dragging, attempts to move both vertices in the direction of motion of the line
    this.addInputListener( new KeyboardDragListener( {
      transform: modelViewTransform,
      drag: vectorDelta => {
        this.moveVerticesFromModelDelta( vectorDelta );
      }
    } ) );

    this.addInputListener( new DragListener( {
      transform: modelViewTransform,
      drag: ( event, listener ) => {

        const vertex1Pressed = side.vertex1.isPressedProperty.value;
        const vertex2Pressed = side.vertex2.isPressedProperty.value;

        if ( !vertex1Pressed && !vertex2Pressed ) {

          // neither vertex is pressed, move both vertices together as you drag a side
          this.moveVerticesFromModelDelta( listener.modelDelta );
        }
        else if ( vertex1Pressed !== vertex2Pressed ) {

          // only one vertex is pressed, rotate around the pressed vertex
          if ( vertex1Pressed ) {
            this.rotateVertexAroundOther( side.vertex1, side.vertex2, listener.modelDelta );
          }
          else {
            this.rotateVertexAroundOther( side.vertex2, side.vertex1, listener.modelDelta );
          }
        }
      },

      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    this.mutate( options );
  }

  /**
   * Move both vertices of this side from the change in position specified by deltaVector.
   * @private
   *
   * @param {Vector2} deltaVector - change of position in model coordinates
   */
  moveVerticesFromModelDelta( deltaVector ) {

    // vectorDelta is in model coordinates already since we provided a transform to the listener
    const proposedVertex1Position = this.side.vertex1.positionProperty.get().plus( deltaVector );
    const proposedVertex2Position = this.side.vertex2.positionProperty.get().plus( deltaVector );

    if ( this.side.vertex1.dragBoundsProperty.value.containsPoint( proposedVertex1Position ) &&
         this.side.vertex2.dragBoundsProperty.value.containsPoint( proposedVertex2Position ) ) {
      this.side.vertex1.positionProperty.set( proposedVertex1Position );
      this.side.vertex2.positionProperty.set( proposedVertex2Position );
    }
  }

  /**
   * Rotate one vertex around another by moving the "arm" vertex as if it were being directly dragged while keeping the
   * pressed vertex locked in place.
   * @private
   *
   * @param {Vertex} anchorVertex - Anchor vertex we are rotating around.
   * @param {Vertex} armVertex - Vertex being repositioned.
   * @param {Vector2} modelDelta - The amount of movement of the arm drag in model coordinates
   */
  rotateVertexAroundOther( anchorVertex, armVertex, modelDelta ) {
    const proposedPosition = armVertex.positionProperty.get().plus( modelDelta );

    if ( armVertex.dragBoundsProperty.value.containsPoint( proposedPosition ) ) {
      armVertex.positionProperty.value = proposedPosition;
    }
  }
}

Voicing.compose( SideNode );

quadrilateral.register( 'SideNode', SideNode );
export default SideNode;

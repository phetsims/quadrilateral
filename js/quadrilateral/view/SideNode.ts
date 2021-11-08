// Copyright 2021, University of Colorado Boulder

/**
 * The node for a side of a quadrilateral. No graphical design has been done yet, but creating this node
 * to exercise input and manipulation of the quad shape. By dragging a side both vertices of the side will
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
import Side from '../model/Side.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SceneryEvent from '../../../../scenery/js/input/SceneryEvent.js';
import Vertex from '../model/Vertex.js';

class SideNode extends Line {
  private side: Side;

  /**
   * // TODO: How to do Voicing mixin?
   * @mixes Voicing
   */
  public constructor( side: Side, modelViewTransform: ModelViewTransform2, options?: any ) {

    options = merge( {
      lineWidth: 20,

      // pdom
      tagName: 'div',
      focusable: true,

      // phet-io
      tandem: Tandem.OPTIONAL
    }, options );

    super( 0, 0, 0, 0 );

    // A reference to the model component.
    this.side = side;

    // initialize the voicing trait
    // @ts-ignore - TODO: How to do mixin/Trait pattern?
    this.initializeVoicing();

    // pdom - make the focus highlight tightly surround the line so that it is easier to see the shape
    // @ts-ignore - TODO: Setters added by scenery mixins are not available, see https://github.com/phetsims/quadrilateral/issues/27
    this.focusHighlight = new FocusHighlightPath( null );

    // listeners
    Property.multilink( [ side.vertex1.positionProperty, side.vertex2.positionProperty ], ( vertex1Position: Vector2, vertex2Position: Vector2 ) => {
      const vertex1ViewPosition = modelViewTransform.modelToViewPosition( vertex1Position );
      const vertex2ViewPosition = modelViewTransform.modelToViewPosition( vertex2Position );
      this.setLine( vertex1ViewPosition.x, vertex1ViewPosition.y, vertex2ViewPosition.x, vertex2ViewPosition.y );

      // set the focus highlight shape
      // @ts-ignore - TODO: Setters added by scenery mixins are not available, see https://github.com/phetsims/quadrilateral/issues/27
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
      drag: ( vectorDelta: Vector2 ) => {
        this.moveVerticesFromModelDelta( vectorDelta );
      }
    } ) );

    this.addInputListener( new DragListener( {
      transform: modelViewTransform,
      drag: ( event: SceneryEvent, listener: DragListener ) => {

        const vertex1Pressed = side.vertex1.isPressedProperty.value;
        const vertex2Pressed = side.vertex2.isPressedProperty.value;

        if ( !vertex1Pressed && !vertex2Pressed ) {

          // neither vertex is pressed, move both vertices together as you drag a side
          this.moveVerticesFromModelDelta( listener.modelDelta );
        }
        else if ( vertex1Pressed !== vertex2Pressed ) {

          // only one vertex is pressed, rotate around the pressed vertex
          if ( vertex1Pressed ) {
            SideNode.rotateVertexAroundOther( side.vertex1, side.vertex2, listener.modelDelta );
          }
          else {
            SideNode.rotateVertexAroundOther( side.vertex2, side.vertex1, listener.modelDelta );
          }
        }
      },

      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    this.mutate( options );
  }

  /**
   * Move both vertices of this side from the change in position specified by deltaVector.
   *
   * @param deltaVector - change of position in model coordinates
   */
  private moveVerticesFromModelDelta( deltaVector: Vector2 ) {
    assert && assert( this.side.vertex1.dragBoundsProperty.value, 'The dragBoundsProperty must be set on the Vertex to move it in model space' );
    assert && assert( this.side.vertex2.dragBoundsProperty.value, 'The dragBoundsProperty must be set on the Vertex to move it in model space' );
    const vertex1DragBounds = this.side.vertex1.dragBoundsProperty.value!;
    const vertex2DragBounds = this.side.vertex2.dragBoundsProperty.value!;


    // vectorDelta is in model coordinates already since we provided a transform to the listener
    const proposedVertex1Position = this.side.vertex1.positionProperty.get().plus( deltaVector );
    const proposedVertex2Position = this.side.vertex2.positionProperty.get().plus( deltaVector );

    if ( vertex1DragBounds.containsPoint( proposedVertex1Position ) &&
         vertex2DragBounds.containsPoint( proposedVertex2Position ) ) {
      this.side.vertex1.positionProperty.set( proposedVertex1Position );
      this.side.vertex2.positionProperty.set( proposedVertex2Position );
    }
  }

  /**
   * Rotate one vertex around another by moving the "arm" vertex as if it were being directly dragged while keeping the
   * pressed vertex locked in place.
   * @private
   *
   * @param anchorVertex - Anchor vertex we are rotating around.
   * @param armVertex - Vertex being repositioned.
   * @param modelDelta - The amount of movement of the arm drag in model coordinates
   */
  private static rotateVertexAroundOther( anchorVertex: Vertex, armVertex: Vertex, modelDelta: Vector2 ) {
    assert && assert( armVertex.dragBoundsProperty.value, 'Vertex dragBoundsProperty must be set before vertices can be moved in the model' );
    const armVertexDragBounds = armVertex.dragBoundsProperty.value!;

    const proposedPosition = armVertex.positionProperty.get().plus( modelDelta );

    if ( armVertexDragBounds.containsPoint( proposedPosition ) ) {
      armVertex.positionProperty.value = proposedPosition;
    }
  }
}

// @ts-ignore - TODO: How to do mixin/trait with TypeScript?
Voicing.compose( SideNode );

quadrilateral.register( 'SideNode', SideNode );
export default SideNode;

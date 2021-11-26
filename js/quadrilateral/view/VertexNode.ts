// Copyright 2021, University of Colorado Boulder

/**
 * A view component for one of the vertices of the Quadrilateral.
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import { Voicing } from '../../../../scenery/js/imports.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import { KeyboardDragListener } from '../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vertex from '../model/Vertex.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { SceneryEvent } from '../../../../scenery/js/imports.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';

class VertexNode extends Rectangle {
  constructor( vertex: Vertex, quadrilateralModel: QuadrilateralModel, modelViewTransform: ModelViewTransform2, options?: Object ) {
    options = merge( {

      // pdom
      tagName: 'div',
      focusable: true,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const viewBounds = modelViewTransform.modelToViewBounds( vertex.modelBoundsProperty.value );
    super( viewBounds );

    // @ts-ignore - how do we deal with mixin?
    this.initializeVoicing();

    // debugging = to show the positions of the vertices while we don't have a graphical display
    let showVerticesPath: null | Path = null;
    if ( QuadrilateralQueryParameters.showVertices ) {
      showVerticesPath = new Path( timesSolidShape, {
        fill: 'red',
        scale: 0.05,
        center: this.center
      } );
      this.addChild( showVerticesPath );
    }

    vertex.modelBoundsProperty.link( modelBounds => {
      const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );
      this.setRectBounds( viewBounds );

      // Since we are a purely graphical sim for now, these allow us to
      this.mouseArea = viewBounds;
      this.touchArea = this.mouseArea;

      showVerticesPath && showVerticesPath.setCenter( viewBounds.center );
    } );

    // A basic keyboard input listener.
    const viewDragDelta = modelViewTransform.modelToViewDeltaX( QuadrilateralConstants.MOVEMENT_PER_KEY_PRESS );
    const keyboardDragListener = new KeyboardDragListener( {
      transform: modelViewTransform,
      drag: ( modelDelta: Vector2 ) => {
        const proposedPosition = vertex.positionProperty.value.plus( modelDelta );

        if ( quadrilateralModel.isVertexPositionAllowed( vertex, proposedPosition ) ) {
          vertex.positionProperty.value = proposedPosition;
        }
      },

      // velocity defined in view coordinates per second, assuming 60 fps
      dragVelocity: viewDragDelta * 60,
      shiftDragVelocity: ( viewDragDelta / 2 ) * 60,

      downDelta: viewDragDelta,
      shiftDownDelta: viewDragDelta / 2,
      moveOnHoldDelay: 750,
      moveOnHoldInterval: 50
    } );
    this.addInputListener( keyboardDragListener );

    // @private {DragListener}
    const dragListener = new DragListener( {
      transform: modelViewTransform,
      drag: ( event: SceneryEvent, listener: DragListener ) => {
        const pointerPoint = event.pointer.point;
        const parentPoint = this.globalToParentPoint( pointerPoint! );
        const modelPoint = modelViewTransform.viewToModelPosition( parentPoint );

        const proposedPosition = modelPoint;
        if ( quadrilateralModel.isVertexPositionAllowed( vertex, proposedPosition ) ) {
          vertex.positionProperty.value = proposedPosition;
        }
      },

      // @ts-ignore - TODO: Need to come through and do options, see #27
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragListener );

    // notify when this vertex is pressed
    dragListener.isPressedProperty.link( isPressed => vertex.isPressedProperty.set( isPressed ) );

    vertex.dragBoundsProperty.link( dragBounds => {
      keyboardDragListener.dragBounds = dragBounds;
    } );

    if ( QuadrilateralQueryParameters.showDragAreas ) {

      // Updating the isPressedProperty with focus/blur will show the drag areas
      // with those events. I am not sure if the isPressedProperty should be set here
      // anyway, but it may not be necessary. It should probably be set by the
      // KeyboardDragListener on start/end drag, or the KeyboardDRagListener should
      // have its own isPressedProperty to match the API of the DragListener.
      this.addInputListener( {
        focus: () => {
          vertex.isPressedProperty.value = true;
        },
        blur: () => {
          vertex.isPressedProperty.value = false;
        }
      } );
    }

    this.mutate( options );
  }
}

// @ts-ignore - TODO: What to do with trait? See #27
Voicing.compose( VertexNode );

quadrilateral.register( 'VertexNode', VertexNode );
export default VertexNode;
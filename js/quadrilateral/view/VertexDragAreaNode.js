// Copyright 2021, University of Colorado Boulder

/**
 * A Path that draws the drag areas for a particular vertex. Useful for debugging
 * and demonstrating the behavior of drag constraints for a vertex. See
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import quadrilateral from '../../quadrilateral.js';

class VertexDragAreaNode extends Path {

  /**
   * @param {Vertex} vertex
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( vertex, modelViewTransform, options ) {

    options = merge( {
      fill: 'rgba(255,0,0,0.5)'
    }, options );

    super( null, options );

    // update shape when the model shape changes
    vertex.dragAreaProperty.link( dragArea => {
      if ( dragArea ) {
        this.shape = modelViewTransform.modelToViewShape( dragArea );
      }
    } );

    // the shape should only be visible during input, if we show all vertex
    // drag areas at once it is impossible to understand
    vertex.isPressedProperty.link( isPressed => {
      this.visible = isPressed;
    } );
  }
}

quadrilateral.register( 'VertexDragAreaNode', VertexDragAreaNode );
export default VertexDragAreaNode;

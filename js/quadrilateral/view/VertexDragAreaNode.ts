// Copyright 2021, University of Colorado Boulder

/**
 * A Path that draws the drag areas for a particular vertex. Useful for debugging
 * and demonstrating the behavior of drag constraints for a vertex. See
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import quadrilateral from '../../quadrilateral.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vertex from '../model/Vertex.js';
import Shape from '../../../../kite/js/Shape.js';

class VertexDragAreaNode extends Path {

  constructor( vertex: Vertex, modelViewTransform: ModelViewTransform2, options?: any ) {

    options = merge( {
      fill: 'rgba(255,0,0,0.5)'
    }, options );

    super( null, options );

    // update shape when the model shape changes
    vertex.dragAreaProperty.link( ( dragArea: Shape ) => {
      if ( dragArea ) {
        this.shape = modelViewTransform.modelToViewShape( dragArea );
      }
    } );

    // the shape should only be visible during input, if we show all vertex
    // drag areas at once it is impossible to understand
    vertex.isPressedProperty.link( ( isPressed: boolean ) => {
      this.visible = isPressed;
    } );
  }
}

quadrilateral.register( 'VertexDragAreaNode', VertexDragAreaNode );
export default VertexDragAreaNode;

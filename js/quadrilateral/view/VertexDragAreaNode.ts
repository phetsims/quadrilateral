// Copyright 2021, University of Colorado Boulder

/**
 * A Path that draws the drag areas for a particular vertex. Useful for debugging
 * and demonstrating the behavior of drag constraints for a vertex. See
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vertex from '../model/Vertex.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Side from '../model/Side.js';

class VertexDragAreaNode extends Path {

  constructor( vertex: Vertex, sides: Side[], modelViewTransform: ModelViewTransform2, options?: PathOptions ) {

    options = merge( {
      fill: `rgba(${dotRandom.nextInt( 255 )},${dotRandom.nextInt( 255 )},${dotRandom.nextInt( 255 )},0.5)`
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

    // The shape should only be visible during input, for each side connected to this vertex show the drag area
    // when it receives input
    sides.forEach( side => {
      side.isPressedProperty.link( isPressed => {
        this.visible = isPressed;
      } );
    } );
  }
}

quadrilateral.register( 'VertexDragAreaNode', VertexDragAreaNode );
export default VertexDragAreaNode;

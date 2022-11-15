// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import Vertex from './Vertex.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import CollisionBody from './CollisionBody.js';

class VertexCollisionBody extends CollisionBody {
  public readonly vertex: Vertex;

  public constructor( vertex: Vertex ) {

    const vertexPosition = vertex.positionProperty.value;
    super( VertexCollisionBody.createVertexData( vertexPosition.x, vertexPosition.y ) );

    this.vertex = vertex;

    vertex.positionProperty.link( position => {
      this.setBodyPosition( position.x, position.y );
    } );

    vertex.isPressedProperty.link( isPressed => {
      this.dragging = isPressed;
    } );
  }

  public setBodyPosition( x: number, y: number ): void {
    this.data.pos.x = x - Vertex.VERTEX_WIDTH / 2;
    this.data.pos.y = y - Vertex.VERTEX_WIDTH / 2;
  }

  public static createVertexData( translationX: number, translationY: number ): IntentionalAny {
    return new SAT.Polygon(
      new SAT.Vector( translationX, translationY ),

      // path points in a local coordinate frame
      [
        new SAT.Vector( 0, 0 ), // bottom left
        new SAT.Vector( Vertex.VERTEX_WIDTH, 0 ), // bottom right
        new SAT.Vector( Vertex.VERTEX_WIDTH, Vertex.VERTEX_WIDTH ), // top right
        new SAT.Vector( 0, Vertex.VERTEX_WIDTH ) // top left
      ]
    );
  }
}

quadrilateral.register( 'VertexCollisionBody', VertexCollisionBody );
export default VertexCollisionBody;

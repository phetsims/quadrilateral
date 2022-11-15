// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import CollisionBody from './CollisionBody.js';
import Side from './Side.js';
import VertexCollisionBody from './VertexCollisionBody.js';

class SideCollisionBody extends CollisionBody {
  public readonly vertexMultilink: Multilink;

  public readonly side: Side;
  public readonly vertex1Body: VertexCollisionBody;
  public readonly vertex2Body: VertexCollisionBody;


  public constructor( side: Side, vertex1Body: VertexCollisionBody, vertex2Body: VertexCollisionBody ) {

    // translation and polygon points updated after super
    const data = new SAT.Polygon( new SAT.Vector( 0, 0 ), [] );
    super( data );

    this.side = side;
    this.vertex1Body = vertex1Body;
    this.vertex2Body = vertex2Body;

    const lineShape = new Line( new Vector2( 0, 0 ), new Vector2( 0, 0 ) );
    this.vertexMultilink = Multilink.multilink(
      [ side.vertex1.positionProperty, side.vertex2.positionProperty ],
      ( position1, position2 ) => {

        lineShape.setStart( position1 );
        lineShape.setEnd( position2 );

        this.updatePoints( lineShape );
      } );
  }

  // Update the SAT data points for this side. Generally when one of the dependent vertices move.
  public updatePoints( lineShape: Line ): void {

    const rightStroke = lineShape.strokeRight( Side.SIDE_WIDTH )[ 0 ];
    const leftStroke = lineShape.strokeLeft( Side.SIDE_WIDTH * 1000000 )[ 0 ];

    const p1 = rightStroke.end; // {x: -0.21, y: -0.25}  bottom right
    const p2 = leftStroke.start; // {x: -0.29, y: -0.25} // bottom left
    const p3 = leftStroke.end; // {x: -0.29, y: 0.25} // top left
    const p4 = rightStroke.start; // {x: -0.21, y: 0.25} top right

    this.data.setPoints( [
      new SAT.Vector( p1.x, p1.y ),
      new SAT.Vector( p2.x, p2.y ),
      new SAT.Vector( p3.x, p3.y ),
      new SAT.Vector( p4.x, p4.y )
    ] );

    // note that it must go clockwise!! recreate this
    //    // should always work going clockwise
    // const p1 = this.vertex1Body.data.pos.clone().add( this.vertex1Body.firstSidePoints[ 0 ] );
    // const p2 = this.vertex2Body.data.pos.clone().add( this.vertex2Body.secondSidePoints[ 0 ] );
    // const p3 = this.vertex2Body.data.pos.clone().add( this.vertex2Body.secondSidePoints[ 1 ] );
    // const p4 = this.vertex1Body.data.pos.clone().add( this.vertex1Body.firstSidePoints[ 1 ] );
    //
    // this.data.setPoints( [
    //   V( p1.x, p1.y ), V( p2.x, p2.y ), V( p3.x, p3.y ), V( p4.x, p4.y )
    // ] );

  }
}

quadrilateral.register( 'SideCollisionBody', SideCollisionBody );
export default SideCollisionBody;

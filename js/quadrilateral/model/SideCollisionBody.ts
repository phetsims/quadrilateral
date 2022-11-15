// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Line } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import CollisionBody from './CollisionBody.js';
import Side from './Side.js';
import VertexCollisionBody from './VertexCollisionBody.js';

class SideCollisionBody extends CollisionBody {
  public readonly shapeProperty: TReadOnlyProperty<Shape>;

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

    const lineShape = new Line( 0, 0, 0, 0, { lineWidth: Side.SIDE_WIDTH } );
    this.shapeProperty = new DerivedProperty(
      [ side.vertex1.positionProperty, side.vertex2.positionProperty ],
      ( position1, position2 ) => {

        lineShape.setPoint1( position1 );
        lineShape.setPoint2( position2 );

        return lineShape.getStrokedShape();
      } );
  }

  // Update the SAT data points for this side. Generally when one of the dependent vertices move.
  public updatePoints( lineShape: Shape ): void {

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

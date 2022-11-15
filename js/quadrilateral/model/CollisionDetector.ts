// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import CollisionBody from './CollisionBody.js';
import SideCollisionBody from './SideCollisionBody.js';
import BoundsCollisionBody from './BoundsCollisionBody.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';
import VertexCollisionBody from './VertexCollisionBody.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadrilateralPreferencesModel from './QuadrilateralPreferencesModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

class CollisionDetector {

  // An SAT.Response, reused for collision calculations (cleared before each calculation)
  private readonly response: IntentionalAny;

  // Array of the SAT bodies in this CollisionDetector.
  private readonly bodies: CollisionBody[];

  private readonly preferencesModel: QuadrilateralPreferencesModel;

  public constructor( shapeModel: QuadrilateralShapeModel, modelBoundsProperty: TReadOnlyProperty<Bounds2> ) {
    this.response = new SAT.Response();
    this.bodies = [];

    this.preferencesModel = shapeModel.model.preferencesModel;

    // set up the collision detection model from the shape model
    const vertexACollisionBody = new VertexCollisionBody( shapeModel.vertexA );
    const vertexBCollisionBody = new VertexCollisionBody( shapeModel.vertexB );
    const vertexCCollisionBody = new VertexCollisionBody( shapeModel.vertexC );
    const vertexDCollisionBody = new VertexCollisionBody( shapeModel.vertexD );

    const sideABCollisionBody = new SideCollisionBody( shapeModel.topSide, vertexACollisionBody, vertexBCollisionBody );
    const sideBCCollisionBody = new SideCollisionBody( shapeModel.rightSide, vertexBCollisionBody, vertexCCollisionBody );
    const sideCDCollisionBody = new SideCollisionBody( shapeModel.bottomSide, vertexCCollisionBody, vertexDCollisionBody );
    const sideDACollisionBody = new SideCollisionBody( shapeModel.leftSide, vertexDCollisionBody, vertexACollisionBody );

    this.sideABCollisionBody = sideABCollisionBody;
    this.sideBCCollisionBody = sideBCCollisionBody;
    this.sideCDCollisionBody = sideCDCollisionBody;
    this.sideDACollisionBody = sideDACollisionBody;

    const modelBoundsListener = ( modelBounds: Bounds2 ) => {
      if ( modelBounds ) {
        const hugePolygonWorkaroundValue = 1000000;
        const topBoundsCollisionBody = new BoundsCollisionBody( modelBounds.minX - hugePolygonWorkaroundValue, modelBounds.maxY, modelBounds.maxX + hugePolygonWorkaroundValue, modelBounds.maxY + hugePolygonWorkaroundValue );
        const rightBoundsCollisionBody = new BoundsCollisionBody( modelBounds.maxX, modelBounds.minY - hugePolygonWorkaroundValue, modelBounds.maxX + hugePolygonWorkaroundValue, modelBounds.maxY + hugePolygonWorkaroundValue );
        const bottomBoundsCollisionBody = new BoundsCollisionBody( modelBounds.minX - hugePolygonWorkaroundValue, modelBounds.minY - hugePolygonWorkaroundValue, modelBounds.maxX + hugePolygonWorkaroundValue, modelBounds.minY );
        const leftBoundsCollisionBody = new BoundsCollisionBody( modelBounds.minX - hugePolygonWorkaroundValue, modelBounds.minY - hugePolygonWorkaroundValue, modelBounds.minX, modelBounds.maxY + hugePolygonWorkaroundValue );

        this.addBody( topBoundsCollisionBody );
        this.addBody( rightBoundsCollisionBody );
        this.addBody( bottomBoundsCollisionBody );
        this.addBody( leftBoundsCollisionBody );

        // at this time, model bounds do not change, only initiate boundary collision objects once
        modelBoundsProperty.unlink( modelBoundsListener );
      }
    };
    modelBoundsProperty.link( modelBoundsListener );

    this.addBody( vertexACollisionBody );
    this.addBody( vertexBCollisionBody );
    this.addBody( vertexCCollisionBody );
    this.addBody( vertexDCollisionBody );

    this.addBody( sideABCollisionBody );
    this.addBody( sideBCCollisionBody );
    this.addBody( sideDACollisionBody );
    this.addBody( sideCDCollisionBody );
  }

  /**
   * Add a body to the collision detector.
   */
  public addBody( body: IntentionalAny ): void {

    // @ts-ignore IntentionalAny[] doesn't have includes?
    assert && assert( !this.bodies.includes( body ), 'body is already in the detector' );
    this.bodies.push( body );
  }

  public removeBody( body: IntentionalAny ): void {
    const bodyIndex = this.bodies.indexOf( body );
    assert && assert( bodyIndex > -1, 'Body not found in CollisionDetector.' );
    this.bodies.splice( bodyIndex, 1 );
  }

  /**
   * Looks for collisions between all bodies in the detector and tries to correct them by removing any overlap.
   */
  public churn(): void {
    const numberOfBodies = this.bodies.length;

    for ( let i = 0; i < numberOfBodies; i++ ) {
      const bodyA = this.bodies[ i ];
      for ( let j = 0; j < numberOfBodies; j++ ) {
        const bodyB = this.bodies[ j ];

        if ( bodyA === bodyB || // ignore overlaps with self

             // ignore side-side collisions
             bodyA instanceof SideCollisionBody && bodyB instanceof SideCollisionBody ||

             // ignore side-boundary collision
             ( bodyA instanceof BoundsCollisionBody && bodyB instanceof SideCollisionBody ) ||
             ( bodyA instanceof SideCollisionBody && bodyB instanceof BoundsCollisionBody ) ||

             // ignore boundary-boundary collisions
             bodyA instanceof BoundsCollisionBody && bodyB instanceof BoundsCollisionBody ||

             // ignore overlap between sides and their connected Vertices
             ( bodyA instanceof SideCollisionBody && bodyB === bodyA.vertex1Body ) ||
             ( bodyA instanceof SideCollisionBody && bodyB === bodyA.vertex2Body ) ||
             ( bodyB instanceof SideCollisionBody && bodyA === bodyB.vertex1Body ) ||
             ( bodyB instanceof SideCollisionBody && bodyA === bodyB.vertex2Body )
        ) {
          continue;
        }

        const aData = bodyA.data;
        const bData = bodyB.data;

        this.response.clear();

        let collided = SAT.testPolygonPolygon( aData, bData, this.response );
        if ( collided ) {
          this.respondToCollision( bodyA, bodyB );
        }
      }
    }
  }

  private respondToCollision( bodyA: CollisionBody, bodyB: CollisionBody ): void {
    const overlapX = this.response.overlapV.x;
    const overlapY = this.response.overlapV.y;

    if ( bodyA.dragging && bodyB.dragging ) {

      // TODO: How to handle multitouch?
    }
    else if ( bodyA.dragging ) {

      if ( bodyA instanceof SideCollisionBody ) {

        const bodyASide = ( bodyA as unknown as SideCollisionBody ).side;
        if ( bodyASide.isPressedProperty.value ) {

        }
      }
      else if ( bodyA instanceof VertexCollisionBody ) {

        const bodyAVertex = ( bodyA as unknown as VertexCollisionBody ).vertex;

        if ( bodyB instanceof SideCollisionBody ) {
          // vertex-side collision

          // the vertex is overlapping with a side - use the overlapVector that whose normal points toward the
          // vertex
          // NOTE: This may not be necessary, if we are using a workaround where we
          const bestOverlap = _.minBy( this.response.overlaps, overlap => {
            return CollisionDetector.SATVectorToVector2( overlap.axis ).angleBetween( bodyB.side.lineProperty.value.startTangent.getPerpendicular() );
          } );

          if ( bestOverlap ) {
            bodyAVertex.positionProperty.set( bodyAVertex.positionProperty.value.minus( CollisionDetector.SATVectorToVector2( bestOverlap.overlapV ) ) );
          }
        }
        else if ( bodyB instanceof BoundsCollisionBody ) {
          // vertex-bounds collision

          bodyAVertex.positionProperty.set( bodyAVertex.positionProperty.value.minus( CollisionDetector.SATVectorToVector2( this.response.overlapV ) ) );
        }
      }
    }
    else {

      // this.sideABCollisionBody = sideABCollisionBody;
      // this.sideBCCollisionBody = sideBCCollisionBody;
      // this.sideCDCollisionBody = sideCDCollisionBody;
      // this.sideDACollisionBody = sideDACollisionBody;
      const sideBodies = [ this.sideABCollisionBody, this.sideBCCollisionBody, this.sideCDCollisionBody, this.sideDACollisionBody ];
      const pressedBodies = _.filter( sideBodies, sideBody => sideBody.side.isPressedProperty.value );

      // console.log( pressedBodies );
      if ( pressedBodies.length > 0 ) {
        debugger;
      }
      // a collision has been detected without dragging
      for ( let i = 0; i < pressedBodies.length; i++ ) {
        const pressedBody = pressedBodies[ i ];
        if ( pressedBody.side.vertex1 === bodyA.vertex || pressedBody.side.vertex2 === bodyB.vertex ) {
          debugger;
        }
      }
    }
  }

  private static SATVectorToVector2( satVector: SAT.Vector ): Vector2 {
    return new Vector2( satVector.x, satVector.y );
  }
}

quadrilateral.register( 'CollisionDetector', CollisionDetector );
export default CollisionDetector;

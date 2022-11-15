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
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import QuadrilateralPreferencesModel from './QuadrilateralPreferencesModel.js';

class CollisionDetector {

  // An SAT.Response, reused for collision calculations (cleared before each calculation)
  private readonly response: IntentionalAny;

  // Array of the SAT bodies in this CollisionDetector.
  private readonly bodies: CollisionBody[];

  private readonly preferencesModel: QuadrilateralPreferencesModel;

  public constructor( shapeModel: QuadrilateralShapeModel ) {
    this.response = new SAT.Response();
    this.bodies = [];

    this.preferencesModel = shapeModel.model.preferencesModel;

    // set up the collision detection model from the shape model
    const vertexACollisionBody = new VertexCollisionBody( shapeModel.vertexA );
    const vertexBCollisionBody = new VertexCollisionBody( shapeModel.vertexB );

    this.addBody( vertexACollisionBody );
    this.addBody( vertexBCollisionBody );
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
             bodyA instanceof SideCollisionBody && bodyB instanceof SideCollisionBody || // ignore side-side collisions

             // ignore side-boundary collision
             ( bodyA instanceof BoundsCollisionBody && bodyB instanceof SideCollisionBody ) ||
             ( bodyA instanceof SideCollisionBody && bodyB instanceof BoundsCollisionBody ) ||

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
    const overlapVector = new Vector2( this.response.overlapV.x, this.response.overlapV.y );

    const interval = this.preferencesModel.fineInputSpacingProperty.value ? QuadrilateralQueryParameters.minorFineVertexInterval : QuadrilateralQueryParameters.minorVertexInterval;
    const overlapX = Math.max( this.response.overlapV.x, interval );
    const overlapX = Math.max( this.response.overlapV.x, interval );0
    if ( bodyA.dragging && bodyB.dragging ) {

      // TODO: How to handle multitouch?
    }
    else if ( bodyA.dragging ) {

      if ( bodyA instanceof SideCollisionBody ) {

        // move each vertex by the overlap vector so the side does not collide
      }
      else {

        // bodyA is a dragging vertex and should be moved out of the other body
        // update model position Properties from this.response
        const bodyAVertex = ( bodyA as unknown as VertexCollisionBody ).vertex;
        console.log( this.response.overlapV );
        bodyAVertex.positionProperty.set( bodyAVertex.positionProperty.value.minus( overlapVector ) );
      }
    }
  }
}

quadrilateral.register( 'CollisionDetector', CollisionDetector );
export default CollisionDetector;

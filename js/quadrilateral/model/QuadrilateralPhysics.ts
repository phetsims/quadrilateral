// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TinyEmitter from '../../../../axon/js/TinyEmitter.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import quadrilateral from '../../quadrilateral.js';

const barrierMaterial = new p2.Material();
const dynamicMaterial = new p2.Material();

class QuadrilateralPhysics {

  // Maps {number} body.id => {p2.Body}. Contains bodies that are empty, and specifically used for
  // pointer constraints (so they can be positioned to where the pointer is).
  private readonly nullBodyMap: Record<number, p2.Body> = {};

  private readonly pointerConstraintMap: Record<number, p2.RevoluteConstraint> = {};

  private readonly world: p2.World;

  private readonly internalStepEmitter = new TinyEmitter<[ number ]>();

  public constructor() {

    this.world = new p2.World();
    this.world.applyGravity = false;

    // defaults taken from density
    this.world.addContactMaterial( new p2.ContactMaterial( barrierMaterial, dynamicMaterial, {
      restitution: 0,
      stiffness: 1e6,
      relaxation: 4
    } ) );

    this.world.on( 'postStep', () => {
      this.internalStepEmitter.emit( this.world.lastTimeStep );
    } );
  }

  public addBody( body: p2.Body ): void {
    this.world.addBody( body );
  }

  public addPointerConstraint( body: p2.Body, point: Vector2 ): void {
    console.log( 'adding pointer constraint' );

    // Create an empty body used for the constraint (we don't want it intersecting). It will just be used for applying
    // the effects of this constraint.
    const nullBody = new p2.Body( { type: p2.Body.STATIC } );
    this.nullBodyMap[ body.id ] = nullBody;

    const globalPoint = QuadrilateralPhysics.vectorToP2Position( point );
    const localPoint = p2.vec2.create();
    body.toLocalFrame( localPoint, globalPoint );
    this.world.addBody( nullBody );

    body.wakeUp();

    const pointerConstraint = new p2.RevoluteConstraint( nullBody, body, {
      localPivotA: globalPoint,
      localPivotB: localPoint,

      // If this value is too large, the constraint will pull it through other physical objects.
      // This is a relatively small value because model space in this sim is tiny.
      maxForce: 1
    } );

    this.pointerConstraintMap[ body.id ] = pointerConstraint;
    this.world.addConstraint( pointerConstraint );
  }

  public removePointerConstraint( body: p2.Body ): void {
    const nullBody = this.nullBodyMap[ body.id ];
    const pointerConstraint = this.pointerConstraintMap[ body.id ];

    this.world.removeConstraint( pointerConstraint );
    this.world.removeBody( nullBody );

    delete this.nullBodyMap[ body.id ];
    delete this.pointerConstraintMap[ body.id ];
  }

  public addPhysicsConstraint( constraint: p2.RevoluteConstraint ): void {
    this.world.addConstraint( constraint );
  }

  public removePhysicsConstraint( constraint: p2.RevoluteConstraint ): void {
    this.world.removeConstraint( constraint );
  }

  public updatePointerConstraint( body: p2.Body, position: Vector2 ): void {
    const pointerConstraint = this.pointerConstraintMap[ body.id ];

    // @ts-ignore - pivotA should be on type RevoluteConstraint
    p2.vec2.copy( pointerConstraint.pivotA, [ position.x, position.y ] );
  }

  /**
   * Sets the provided matrix to the current transformation matrix of the body (to reduce allocations)
   */
  public bodyGetMatrixTransform( body: p2.Body, matrix: Matrix3 ): Matrix3 {
    return matrix.setToTranslationRotation( body.interpolatedPosition[ 0 ], body.interpolatedPosition[ 1 ], body.interpolatedAngle );
  }

  public createBarrier( vertices: Vector2[] ): p2.Body {
    const body = new p2.Body( {
      type: p2.Body.STATIC,
      mass: 0
    } );

    body.fromPolygon( vertices.map( QuadrilateralPhysics.vectorToP2Position ) );

    // Workaround, since using Convex wasn't working
    // body.shapes.forEach( shape => {
    //   shape.material = barrierMaterial;
    // } );

    return body;
  }

  public stopBodyMotion( body: p2.Body ): void {
    body.velocity = [ 0, 0 ];
    body.setZeroForce();
  }

  public step( dt: number ): void {
    this.world.step( dt );
  }

  /**
   * Returns an array tuple with the x,y position in the format that p2 requires.
   * @param vector
   */
  public static vectorToP2Position( vector: Vector2 ): [ number, number ] {
    return [ vector.x, vector.y ];
  }

  public static p2PositionToVector( position: [ number, number ] ): Vector2 {
    return new Vector2( position[ 0 ], position[ 1 ] );
  }
}


quadrilateral.register( 'QuadrilateralPhysics', QuadrilateralPhysics );
export default QuadrilateralPhysics;

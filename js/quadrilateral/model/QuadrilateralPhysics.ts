// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TinyEmitter from '../../../../axon/js/TinyEmitter.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import quadrilateralPhysics from './QuadrilateralPhysics.js';
import Side from './Side.js';

const barrierMaterial = new p2.Material();
const dynamicMaterial = new p2.Material();

function addSubSub( out, a, b, c, d ) {
  out[ 0 ] = a[ 0 ] + b[ 0 ] - c[ 0 ] - d[ 0 ];
  out[ 1 ] = a[ 1 ] + b[ 1 ] - c[ 1 ] - d[ 1 ];
}

const bodyVertexMap = new Map();

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
      // restitution: 0,
      // stiffness: 1e6,
      // relaxation: 4
    } ) );

    window.world = this.world;

    this.leftSideBody = new p2.Body( {
      mass: 1,
      fixedRotation: true,
      collisionResponse: false
    } );
    this.leftSideShape = new p2.Convex();
    this.world.addBody( this.leftSideBody );

    this.world.on( 'postStep', ( p2Event: IntentionalAny ) => {
      this.internalStepEmitter.emit( this.world.lastTimeStep );

      // console.log( this.world.bodies[ 0 ].position );
      if ( this.world.narrowphase.contactEquations.length > 0 ) {
        // debugger;
      }
    } );

    // all contact equations are cleared here
    this.world.on( 'postSolve', p2Event => {
      if ( p2Event.pairs.length > 0 ) {
        // debugger;
      }
      if ( this.world.narrowphase.contactEquations.length > 0 ) {
        debugger;
      }
    } );

    this.world.on( 'preSolve', p2Event => {
      if ( this.world.narrowphase.contactEquations.length > 0 ) {
        this.world.narrowphase.contactEquations.forEach( equation => {
          // const vec = this.computePenetrationVector( equation );
          //
          // // correct the Vertex and p2Body by the overlap amount
          // const vertex = bodyVertexMap.get( equation.bodyA );
          // const newVector = vertex.positionProperty.value.plusXY( vec[ 0 ], vec[ 1 ] );
          // vertex.positionProperty.value = newVector;
          // equation.bodyA.position = QuadrilateralPhysics.vectorToP2Position( newVector );

          equation.enabled = false;
        } );
      }
    } );
  }

  public addBody( body: p2.Body, vertex ): void {
    this.world.addBody( body );

    bodyVertexMap.set( body, vertex );
  }

  public removeBody( body: p2.Body ): void {
    this.world.removeBody( body );
    bodyVertexMap.delete( body );
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

  private updateSideShapes( vertex1Position, vertex2Position, sideBody, sideShape ): void {

    sideBody.removeShape( sideShape );

    // const p2Position = QuadrilateralPhysics.vectorToP2Position( vertex2Position.average( vertex1Position ) );
    sideBody.position = [ 0, 0 ];

    const fullLine = new Line( vertex1Position, vertex2Position );

    // just a rectangular path along the line with the width of SIDE_WIDTH
    const rightStroke = fullLine.strokeRight( Side.SIDE_WIDTH );
    const leftStroke = fullLine.strokeLeft( Side.SIDE_WIDTH );

    // points need to be in CCW order for p2
    const p2Path: [ number, number ][] = [];
    p2Path.push( QuadrilateralPhysics.vectorToP2Position( leftStroke[ 0 ].end ) );
    p2Path.push( QuadrilateralPhysics.vectorToP2Position( leftStroke[ 0 ].start ) );
    p2Path.push( QuadrilateralPhysics.vectorToP2Position( rightStroke[ 0 ].end ) );
    p2Path.push( QuadrilateralPhysics.vectorToP2Position( rightStroke[ 0 ].start ) );

    // TODO: why slice?
    const copyPath = p2Path.slice();
    sideShape = new p2.Convex( {
      vertices: p2Path
    } );
    sideBody.addShape( sideShape );
  }

  public correctCollisionsAndSet( vertex, constrainedPosition ): void {
    // vertex.positionProperty.value = constrainedPosition;
    // vertex.physicsBody.position = QuadrilateralPhysics.vectorToP2Position( constrainedPosition );

    this.addBody( vertex.physicsBody, vertex );

    // create the world that matches current and proposed positions - just collide with sides
    vertex.physicsBody.position = QuadrilateralPhysics.vectorToP2Position( constrainedPosition );

    this.updateSideShapes(
      window.simModel.quadrilateralShapeModel.vertexD.positionProperty.value,
      window.simModel.quadrilateralShapeModel.vertexA.positionProperty.value,
      this.leftSideBody,
      this.leftSideShape
    );

    // step the world
    this.world.step( 0.017 );

    let newVector = constrainedPosition;

    // after step, look for narrowphase contactEquations and correct for overlap
    this.world.narrowphase.contactEquations.forEach( equation => {
      const firstBody = bodyVertexMap.get( equation.bodyA );
      const secondBody = bodyVertexMap.get( equation.bodyB );

      const pressedVertex = ( firstBody && firstBody.isPressedProperty.value ) ? firstBody :
                            ( secondBody && secondBody.isPressedProperty.value ) ? secondBody : null;

      if ( pressedVertex ) {

        // correct the Vertex and p2Body by the overlap amount
        debugger;
        const vec = this.computePenetrationVector( equation );
        console.log( vec );
        const proposedVector = constrainedPosition.plusXY( vec.x, vec.y );

        // const previousPositionVector = QuadrilateralPhysics.p2PositionToVector( equation.bodyA.previousPosition );

        // const translation = proposedVector.minus( previousPositionVector );
        // console.log( translation.magnitude );
        newVector = proposedVector;
      }
    } );

    vertex.positionProperty.value = newVector;
    vertex.physicsBody.position = QuadrilateralPhysics.vectorToP2Position( newVector );

    this.removeBody( vertex.physicsBody );
  }

  public step( dt: number ): void {
    // this.world.step( dt );
    //
    // this.world.narrowphase.contactEquations.forEach( equation => {
    //   const vertex = bodyVertexMap.get( equation.bodyA );
    //
    //   if ( vertex.isPressedProperty.value ) {
    //
    //     // correct the Vertex and p2Body by the overlap amount
    //     const vec = this.computePenetrationVector( equation );
    //     const newVector = vertex.positionProperty.value.plusXY( vec[ 0 ], vec[ 1 ] );
    //     vertex.positionProperty.value = newVector;
    //     equation.bodyA.position = QuadrilateralPhysics.vectorToP2Position( newVector );
    //
    //     console.log( vec );
    //   }
    // } );
  }

  private computePenetrationVector( contactEquation ): Vector2 {

    var bi = contactEquation.bodyA,
      bj = contactEquation.bodyB,
      ri = contactEquation.contactPointA,
      rj = contactEquation.contactPointB,
      xi = bi.position,
      xj = bj.position;

    // Calculate q = xj+rj -(xi+ri) i.e. the penetration vector
    const penetrationVec = contactEquation.penetrationVec;
    addSubSub( penetrationVec, xj, rj, xi, ri );

    return quadrilateralPhysics.p2PositionToVector( penetrationVec );

    // const Gq = p2.vec2.dot( n, penetrationVec ) + this.offset;
    // const GW = contactEQuation.computeGW();
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

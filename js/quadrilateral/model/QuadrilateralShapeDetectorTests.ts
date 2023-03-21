// Copyright 2023, University of Colorado Boulder

/**
 * QUnit Tests for QuadrilateralShapeDetector.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import QuadrilateralShapeDetector from './QuadrilateralShapeDetector.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';
import NamedQuadrilateral from './NamedQuadrilateral.js';
import Vector2 from '../../../../dot/js/Vector2.js';

QUnit.module( 'BooleanProperty' );
QUnit.test( 'QuadrilateralShapeDetector', assert => {

  // Our test shape, with dummy Properties for the constructor (parts that we don't care about for testing)
  const shapeModel = new QuadrilateralShapeModel( new BooleanProperty( true ), new NumberProperty( 1 ) );

  // Create one of each shape to verify basic detection. Position values found with dev
  // tool window.printVertexPositions() - only available when running with ?dev
  shapeModel.vertexA.positionProperty.value = new Vector2( -0.25, 0.25 );
  shapeModel.vertexB.positionProperty.value = new Vector2( 0.25, 0.25 );
  shapeModel.vertexC.positionProperty.value = new Vector2( 0.25, -0.25 );
  shapeModel.vertexD.positionProperty.value = new Vector2( -0.25, -0.25 );
  assert.ok( QuadrilateralShapeDetector.getShapeName( shapeModel ) === NamedQuadrilateral.SQUARE, 'should be a square' );

  shapeModel.vertexA.positionProperty.value = new Vector2( -0.25, 0.75 );
  shapeModel.vertexB.positionProperty.value = new Vector2( 0.25, 0.75 );
  shapeModel.vertexC.positionProperty.value = new Vector2( 0.25, -0.75 );
  shapeModel.vertexD.positionProperty.value = new Vector2( -0.25, -0.75 );
  assert.ok( QuadrilateralShapeDetector.getShapeName( shapeModel ) === NamedQuadrilateral.RECTANGLE, 'should be a rectangle' );

  shapeModel.vertexA.positionProperty.value = new Vector2( 0, 0.75 );
  shapeModel.vertexB.positionProperty.value = new Vector2( 0.5, 0 );
  shapeModel.vertexC.positionProperty.value = new Vector2( 0, -0.75 );
  shapeModel.vertexD.positionProperty.value = new Vector2( -0.5, 0 );
  assert.ok( QuadrilateralShapeDetector.getShapeName( shapeModel ) === NamedQuadrilateral.RHOMBUS, 'should be a rhombus' );

  shapeModel.vertexA.positionProperty.value = new Vector2( 0, 1 );
  shapeModel.vertexB.positionProperty.value = new Vector2( 1.5, 0 );
  shapeModel.vertexC.positionProperty.value = new Vector2( 0, -1 );
  shapeModel.vertexD.positionProperty.value = new Vector2( -0.5, 0 );
  assert.ok( QuadrilateralShapeDetector.getShapeName( shapeModel ) === NamedQuadrilateral.KITE, 'should be a kite' );

  shapeModel.vertexA.positionProperty.value = new Vector2( -0.5, 0.75 );
  shapeModel.vertexB.positionProperty.value = new Vector2( 0.5, 0.75 );
  shapeModel.vertexC.positionProperty.value = new Vector2( 0.25, -0.25 );
  shapeModel.vertexD.positionProperty.value = new Vector2( -0.25, -0.25 );
  assert.ok( QuadrilateralShapeDetector.getShapeName( shapeModel ) === NamedQuadrilateral.ISOSCELES_TRAPEZOID, 'should be an isoceles trapezoid' );

  shapeModel.vertexA.positionProperty.value = new Vector2( -0.5, 0.75 );
  shapeModel.vertexB.positionProperty.value = new Vector2( 0.25, 0.75 );
  shapeModel.vertexC.positionProperty.value = new Vector2( 0.25, -0.25 );
  shapeModel.vertexD.positionProperty.value = new Vector2( -0.25, -0.25 );
  assert.ok( QuadrilateralShapeDetector.getShapeName( shapeModel ) === NamedQuadrilateral.TRAPEZOID, 'should be a trapezoid' );

  shapeModel.vertexA.positionProperty.value = new Vector2( 0, 1 );
  shapeModel.vertexB.positionProperty.value = new Vector2( 1.5, 0 );
  shapeModel.vertexC.positionProperty.value = new Vector2( 0, -1 );
  shapeModel.vertexD.positionProperty.value = new Vector2( 0.5, 0.5 );
  assert.ok( QuadrilateralShapeDetector.getShapeName( shapeModel ) === NamedQuadrilateral.CONCAVE_QUADRILATERAL, 'should be a concave quadrilateral' );

  shapeModel.vertexA.positionProperty.value = new Vector2( 0, 1 );
  shapeModel.vertexB.positionProperty.value = new Vector2( 1.5, 0 );
  shapeModel.vertexC.positionProperty.value = new Vector2( 0, -1 );
  shapeModel.vertexD.positionProperty.value = new Vector2( -1.25, 1 );
  assert.ok( QuadrilateralShapeDetector.getShapeName( shapeModel ) === NamedQuadrilateral.CONVEX_QUADRILATERAL, 'should be a convex quadrilateral' );

  shapeModel.vertexA.positionProperty.value = new Vector2( -0.25, 0.25 );
  shapeModel.vertexB.positionProperty.value = new Vector2( 0.25, 0.25 );
  shapeModel.vertexC.positionProperty.value = new Vector2( 0.25, -0.25 );
  shapeModel.vertexD.positionProperty.value = new Vector2( 0, 0 );
  assert.ok( QuadrilateralShapeDetector.getShapeName( shapeModel ) === NamedQuadrilateral.TRIANGLE, 'should be a triangle' );

  shapeModel.vertexA.positionProperty.value = new Vector2( -1, 0.75 );
  shapeModel.vertexB.positionProperty.value = new Vector2( -0.5, 0.75 );
  shapeModel.vertexC.positionProperty.value = new Vector2( 0.75, -0.75 );
  shapeModel.vertexD.positionProperty.value = new Vector2( 0.25, -0.75 );
  assert.ok( QuadrilateralShapeDetector.getShapeName( shapeModel ) === NamedQuadrilateral.PARALLELOGRAM, 'should be a parallelogram' );

  shapeModel.vertexA.positionProperty.value = new Vector2( -0.75, 0.75 );
  shapeModel.vertexB.positionProperty.value = new Vector2( 1, 0.75 );
  shapeModel.vertexC.positionProperty.value = new Vector2( 1, -1 );
  shapeModel.vertexD.positionProperty.value = new Vector2( 0.5, 0.25 );
  assert.ok( QuadrilateralShapeDetector.getShapeName( shapeModel ) === NamedQuadrilateral.DART, 'should be a dart' );
} );
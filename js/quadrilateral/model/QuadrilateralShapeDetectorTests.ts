// Copyright 2017-2023, University of Colorado Boulder

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

QUnit.module( 'BooleanProperty' );
QUnit.test( 'QuadrilateralShapeDetector', assert => {

  // Our test shape, with dummy Properties for the constructor (parts that we don't care about for testing)
  const shapeModel = new QuadrilateralShapeModel( new BooleanProperty( true ), new NumberProperty( 1 ) );
  const shapeName = QuadrilateralShapeDetector.getShapeName( shapeModel );

  //

  assert.ok( shapeName === NamedQuadrilateral.SQUARE, 'should be a square' );
} );
// Copyright 2022, University of Colorado Boulder
/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

/* eslint-disable no-bitwise*/

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';
import NamedQuadrilateral from './NamedQuadrilateral.js';

// Set up the bits for each shape condition
const CONCAVE = Math.pow( 2, 0 );
const ONE_PARALLEL_PAIR = Math.pow( 2, 1 );
const TWO_PARALLEL_PAIR = Math.pow( 2, 2 );
const ONE_EQUAL_ADJACENT_ANGLE_PAIR = Math.pow( 2, 3 );
const TWO_EQUAL_ADJACENT_ANGLE_PAIR = Math.pow( 2, 4 );
const ONE_EQUAL_OPPOSITE_ANGLE_PAIR = Math.pow( 2, 5 );
const TWO_EQUAL_OPPOSITE_ANGLE_PAIR = Math.pow( 2, 6 );
const ALL_EQUAL_ANGLE = Math.pow( 2, 7 );
// const ONE_EQUAL_ADJACENT_SIDE_PAIR = Math.pow( 2, 8 );
const TWO_EQUAL_ADJACENT_SIDE_PAIR = Math.pow( 2, 9 );
const ONE_EQUAL_OPPOSITE_SIDE_PAIR = Math.pow( 2, 10 );
const TWO_EQUAL_OPPOSITE_SIDE_PAIR = Math.pow( 2, 11 );
const ALL_EQUAL_SIDE = Math.pow( 2, 12 );

// Set up shape masks
const CONCAVE_MASK = CONCAVE;
const DART_MASK = CONCAVE |
                  ONE_EQUAL_OPPOSITE_ANGLE_PAIR |
                  TWO_EQUAL_ADJACENT_SIDE_PAIR;
const KITE_MASK = ONE_EQUAL_OPPOSITE_ANGLE_PAIR |
                  TWO_EQUAL_ADJACENT_SIDE_PAIR;

const TRAPEZOID_MASK = ONE_PARALLEL_PAIR;

const TEST_TRAPEZOID_MASK = ONE_PARALLEL_PAIR |
                            ONE_EQUAL_OPPOSITE_SIDE_PAIR;
const RIGHT_ANGLE_TRAPEZOID = ONE_EQUAL_ADJACENT_ANGLE_PAIR |
                              ONE_PARALLEL_PAIR;

const TEST_RIGHT_ANGLE_TRAPEZOID = ONE_EQUAL_ADJACENT_ANGLE_PAIR |
                                   ONE_PARALLEL_PAIR |
                                   ONE_PARALLEL_PAIR |
                                   ONE_EQUAL_OPPOSITE_SIDE_PAIR;

const ISOSCELES_TRAPEZOID_MASK = ONE_PARALLEL_PAIR |
                                 TWO_EQUAL_ADJACENT_ANGLE_PAIR |
                                 ONE_EQUAL_OPPOSITE_SIDE_PAIR;

const TEST_ISOSCELES_TRAPEZOID = ONE_PARALLEL_PAIR |
                                 TWO_EQUAL_ADJACENT_ANGLE_PAIR |
                                 ONE_EQUAL_OPPOSITE_SIDE_PAIR |
                                 TWO_EQUAL_ADJACENT_SIDE_PAIR;
const PARALLELOGRAM_MASK = ONE_PARALLEL_PAIR |
                           TWO_PARALLEL_PAIR |
                           ONE_EQUAL_OPPOSITE_ANGLE_PAIR |
                           TWO_EQUAL_OPPOSITE_ANGLE_PAIR |
                           ONE_EQUAL_OPPOSITE_SIDE_PAIR |
                           TWO_EQUAL_OPPOSITE_SIDE_PAIR;
const RECTANGLE_MASK = ONE_PARALLEL_PAIR |
                       TWO_PARALLEL_PAIR |
                       TWO_EQUAL_ADJACENT_ANGLE_PAIR |
                       ONE_EQUAL_OPPOSITE_ANGLE_PAIR |
                       TWO_EQUAL_OPPOSITE_ANGLE_PAIR |
                       ALL_EQUAL_ANGLE | ONE_EQUAL_OPPOSITE_SIDE_PAIR | TWO_EQUAL_OPPOSITE_SIDE_PAIR;
const RHOMBUS_MASK = ONE_PARALLEL_PAIR |
                     TWO_PARALLEL_PAIR |
                     ONE_EQUAL_OPPOSITE_ANGLE_PAIR |
                     TWO_EQUAL_OPPOSITE_ANGLE_PAIR |
                     TWO_EQUAL_ADJACENT_SIDE_PAIR |
                     ONE_EQUAL_OPPOSITE_SIDE_PAIR |
                     TWO_EQUAL_OPPOSITE_SIDE_PAIR |
                     ALL_EQUAL_SIDE;
const SQUARE_MASK = ONE_PARALLEL_PAIR |
                    TWO_PARALLEL_PAIR |
                    TWO_EQUAL_ADJACENT_ANGLE_PAIR |
                    ONE_EQUAL_OPPOSITE_ANGLE_PAIR |
                    TWO_EQUAL_OPPOSITE_ANGLE_PAIR |
                    ALL_EQUAL_ANGLE |
                    TWO_EQUAL_ADJACENT_SIDE_PAIR |
                    ONE_EQUAL_OPPOSITE_SIDE_PAIR |
                    TWO_EQUAL_OPPOSITE_SIDE_PAIR |
                    ALL_EQUAL_SIDE;

class QuadrilateralShapeDetector {
  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;

  public constructor( quadrilateralShapeModel: QuadrilateralShapeModel ) {
    this.quadrilateralShapeModel = quadrilateralShapeModel;
  }

  public getShapeName(): NamedQuadrilateral {
    let currentConditionMask = 0;

    const shapeModel = this.quadrilateralShapeModel;
    if ( _.some( shapeModel.vertices, vertex => vertex.angleProperty.value! > Math.PI ) ) {
      currentConditionMask = currentConditionMask | CONCAVE;
    }
    if ( shapeModel.parallelSidePairsProperty.value.length > 0 ) {
      currentConditionMask = currentConditionMask | ONE_PARALLEL_PAIR;
    }
    if ( shapeModel.parallelSidePairsProperty.value.length > 1 ) {
      currentConditionMask = currentConditionMask | TWO_PARALLEL_PAIR;
    }
    if ( shapeModel.adjacentEqualVertexPairsProperty.value.length > 1 ) {
      currentConditionMask = currentConditionMask | TWO_EQUAL_ADJACENT_ANGLE_PAIR;
    }
    if ( shapeModel.oppositeEqualVertexPairsProperty.value.length > 0 ) {
      currentConditionMask = currentConditionMask | ONE_EQUAL_OPPOSITE_ANGLE_PAIR;
    }
    if ( shapeModel.oppositeEqualVertexPairsProperty.value.length > 1 ) {
      currentConditionMask = currentConditionMask | TWO_EQUAL_OPPOSITE_ANGLE_PAIR;
    }
    if ( shapeModel.allAnglesRightProperty.value ) {
      currentConditionMask = currentConditionMask | ALL_EQUAL_ANGLE;
    }
    if ( shapeModel.adjacentEqualSidePairsProperty.value.length > 1 ) {
      currentConditionMask = currentConditionMask | TWO_EQUAL_ADJACENT_SIDE_PAIR;
    }
    if ( shapeModel.oppositeEqualSidePairsProperty.value.length > 0 ) {
      currentConditionMask = currentConditionMask | ONE_EQUAL_OPPOSITE_SIDE_PAIR;
    }
    if ( shapeModel.oppositeEqualSidePairsProperty.value.length > 1 ) {
      currentConditionMask = currentConditionMask | TWO_EQUAL_OPPOSITE_SIDE_PAIR;
    }
    if ( shapeModel.allLengthsEqualProperty.value ) {
      currentConditionMask = currentConditionMask | ALL_EQUAL_SIDE;
    }

    let quadrilateralName: NamedQuadrilateral;
    if ( currentConditionMask === DART_MASK ) {
      quadrilateralName = NamedQuadrilateral.DART;
    }
    else if ( currentConditionMask === KITE_MASK ) {
      quadrilateralName = NamedQuadrilateral.KITE;
    }
    else if ( currentConditionMask === TRAPEZOID_MASK ) {
      quadrilateralName = NamedQuadrilateral.TRAPEZOID;
    }
    else if ( currentConditionMask === TEST_TRAPEZOID_MASK ) {
      quadrilateralName = NamedQuadrilateral.TRAPEZOID;
    }
    else if ( currentConditionMask === ISOSCELES_TRAPEZOID_MASK ) {
      quadrilateralName = NamedQuadrilateral.ISOSCELES_TRAPEZOID;
    }
    else if ( currentConditionMask === RIGHT_ANGLE_TRAPEZOID || currentConditionMask === TEST_RIGHT_ANGLE_TRAPEZOID || currentConditionMask === TEST_ISOSCELES_TRAPEZOID ) {
      quadrilateralName = NamedQuadrilateral.TRAPEZOID;
    }
    else if ( currentConditionMask === PARALLELOGRAM_MASK ) {
      quadrilateralName = NamedQuadrilateral.PARALLELOGRAM;
    }
    else if ( currentConditionMask === RECTANGLE_MASK ) {
      quadrilateralName = NamedQuadrilateral.RECTANGLE;
    }
    else if ( currentConditionMask === RHOMBUS_MASK ) {
      quadrilateralName = NamedQuadrilateral.RHOMBUS;
    }
    else if ( currentConditionMask === SQUARE_MASK ) {
      quadrilateralName = NamedQuadrilateral.SQUARE;
    }
    else {
      if ( ( currentConditionMask & CONCAVE_MASK ) > 0 ) {
        quadrilateralName = NamedQuadrilateral.CONCAVE_QUADRILATERAL;
      }
      else {

        // fallback case, CONVEX_MAX will match with nothing
        quadrilateralName = NamedQuadrilateral.CONVEX_QUADRILATERAL;
      }
    }

    return quadrilateralName;
  }
}

quadrilateral.register( 'QuadrilateralShapeDetector', QuadrilateralShapeDetector );
export default QuadrilateralShapeDetector;

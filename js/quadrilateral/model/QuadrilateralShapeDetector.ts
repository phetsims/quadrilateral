// Copyright 2022-2023, University of Colorado Boulder

/**
 * Detects the name of the quadrilateral shape from the current geometric properties. Quadrilateral shape names
 * come from "building up" geometric properties. If the shape has at least the required geometric properties for a
 * name, it will be a match. So the final shape name is the one that has the largest number of shape properties.
 *
 * This implementation uses bit masks. Each shape attribute is represented as a bit and a bitwise value is calculated
 * from the current shape properties. A pre-defined mask is created for each named shape. If the bitwise value has
 * at least the bits of a given mask it is a match for the shape.
 *
 * The implementation of shape detection comes from decisions in https://github.com/phetsims/quadrilateral/issues/188.
 * In particular, see https://github.com/phetsims/quadrilateral/issues/188#issuecomment-1226165886 and
 * https://github.com/phetsims/quadrilateral/issues/188#issuecomment-1232237994.
 *
 * Using bit masks for this is inspired by collision filtering in games, see
 * http://www.aurelienribon.com/post/2011-07-box2d-tutorial-collision-filtering
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

/* eslint-disable no-bitwise*/

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';
import NamedQuadrilateral from './NamedQuadrilateral.js';

// Set up the bits for each shape property.
const CONCAVE = Math.pow( 2, 0 );
const ONE_PARALLEL_PAIR = Math.pow( 2, 1 );
const TWO_PARALLEL_PAIR = Math.pow( 2, 2 );
const TWO_EQUAL_ADJACENT_ANGLE_PAIR = Math.pow( 2, 4 );
const ONE_EQUAL_OPPOSITE_ANGLE_PAIR = Math.pow( 2, 5 );
const TWO_EQUAL_OPPOSITE_ANGLE_PAIR = Math.pow( 2, 6 );
const ALL_EQUAL_ANGLE = Math.pow( 2, 7 );
const TWO_EQUAL_ADJACENT_SIDE_PAIR = Math.pow( 2, 9 );
const ONE_EQUAL_OPPOSITE_SIDE_PAIR = Math.pow( 2, 10 );
const TWO_EQUAL_OPPOSITE_SIDE_PAIR = Math.pow( 2, 11 );
const ALL_EQUAL_SIDE = Math.pow( 2, 12 );
const ONE_ANGLE_PIE = Math.pow( 2, 13 );

// Set up shape masks for each shape. The quadrilateral must at least these attributes to be considered a match.
const CONCAVE_MASK = CONCAVE;

const TRIANGLE_MASK = ONE_ANGLE_PIE;

const DART_MASK = CONCAVE |
                  ONE_EQUAL_OPPOSITE_ANGLE_PAIR |
                  TWO_EQUAL_ADJACENT_SIDE_PAIR;

const KITE_MASK = ONE_EQUAL_OPPOSITE_ANGLE_PAIR |
                  TWO_EQUAL_ADJACENT_SIDE_PAIR;

const TRAPEZOID_MASK = ONE_PARALLEL_PAIR;

const ISOSCELES_TRAPEZOID_MASK = ONE_PARALLEL_PAIR |
                                 TWO_EQUAL_ADJACENT_ANGLE_PAIR |
                                 ONE_EQUAL_OPPOSITE_SIDE_PAIR;

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
                       ALL_EQUAL_ANGLE |
                       ONE_EQUAL_OPPOSITE_SIDE_PAIR |
                       TWO_EQUAL_OPPOSITE_SIDE_PAIR;

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

export default class QuadrilateralShapeDetector {
  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;

  public constructor( quadrilateralShapeModel: QuadrilateralShapeModel ) {
    this.quadrilateralShapeModel = quadrilateralShapeModel;
  }

  /**
   * Compute the name of the quadrilateral. Note this must be called AFTER all order dependent Properties are updated
   * because it relies on vertex positions to be stable and all shape attributes to be calculated. See
   * QuadrilateralShapeModel.updateOrderDependentProperties for more information.
   */
  public getShapeName(): NamedQuadrilateral {
    let currentConditionMask = 0;

    // First, assemble a bitwise value representing the attributes of the current shape. Start by looking for
    // a triangle, which is a unique case. If we have a triangle we can stop looking for more properties
    // because it will always be labelled as a triangle. All other shapes have properties that "build-up"
    // to produce the final properties of the shape.
    const shapeModel = this.quadrilateralShapeModel;
    if ( _.some( shapeModel.vertices, vertex => shapeModel.isFlatAngle( vertex.angleProperty.value! ) ) ) {
      currentConditionMask = currentConditionMask | TRIANGLE_MASK;
    }
    else {
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
    }

    // Find matches for the current condition - Order of these checks is very important. conditionMatchesMask
    // returns true if the condition matches the minimum requirements for a shape. But even after there is a match,
    // we will continue to search for the most specific attribute matches.
    let quadrilateralName: NamedQuadrilateral;

    // First look for a triangle - it is unique in that if we have a triangle there are no more shapes "under"
    // it that share attributes - so we can return this right away.
    if ( this.conditionMatchesMask( currentConditionMask, TRIANGLE_MASK ) ) {
      quadrilateralName = NamedQuadrilateral.TRIANGLE;
    }
    else if ( this.conditionMatchesMask( currentConditionMask, CONCAVE_MASK ) ) {

      // if concave, the only attribute that can "build-up" from here is the dart property
      quadrilateralName = NamedQuadrilateral.CONCAVE_QUADRILATERAL;

      if ( this.conditionMatchesMask( currentConditionMask, DART_MASK ) ) {
        quadrilateralName = NamedQuadrilateral.DART;
      }
    }
    else {

      // most general case, shape properties "build-up" from a convex quadrilateral
      quadrilateralName = NamedQuadrilateral.CONVEX_QUADRILATERAL;

      if ( this.conditionMatchesMask( currentConditionMask, TRAPEZOID_MASK ) ) {
        quadrilateralName = NamedQuadrilateral.TRAPEZOID;
      }
      if ( this.conditionMatchesMask( currentConditionMask, ISOSCELES_TRAPEZOID_MASK ) ) {
        quadrilateralName = NamedQuadrilateral.ISOSCELES_TRAPEZOID;
      }
      if ( this.conditionMatchesMask( currentConditionMask, KITE_MASK ) ) {
        quadrilateralName = NamedQuadrilateral.KITE;
      }
      if ( this.conditionMatchesMask( currentConditionMask, PARALLELOGRAM_MASK ) ) {
        quadrilateralName = NamedQuadrilateral.PARALLELOGRAM;
      }
      if ( this.conditionMatchesMask( currentConditionMask, RECTANGLE_MASK ) ) {
        quadrilateralName = NamedQuadrilateral.RECTANGLE;
      }
      if ( this.conditionMatchesMask( currentConditionMask, RHOMBUS_MASK ) ) {
        quadrilateralName = NamedQuadrilateral.RHOMBUS;
      }
      if ( this.conditionMatchesMask( currentConditionMask, SQUARE_MASK ) ) {
        quadrilateralName = NamedQuadrilateral.SQUARE;
      }
    }

    return quadrilateralName;
  }

  /**
   * Returns true when the condition state matches the conditions of the provided mask. Consider two values
   * 10110 (mask)
   * 11110 (condition)
   *
   * The & operation returns 10110 (the original mask) if the condition has at least the bits of the mask. This is
   * useful because each mask lists out the requirements for a particular shape. If the condition has at least those
   * requirements (or more) it will still be considered a match for that shape.
   *
   * @param condition - bits representing the current shape conditions
   * @param mask - bits representing the requirements for a particular shape
   */
  private conditionMatchesMask( condition: number, mask: number ): boolean {
    return ( condition & mask ) === mask;
  }
}

quadrilateral.register( 'QuadrilateralShapeDetector', QuadrilateralShapeDetector );

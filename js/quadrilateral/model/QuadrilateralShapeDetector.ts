// Copyright 2022-2023, University of Colorado Boulder

/**
 * Detects the most specific name of the quadrilateral shape from the current geometric properties.
 *
 * The implementation of shape detection comes from decisions in https://github.com/phetsims/quadrilateral/issues/188.
 * In particular, see https://github.com/phetsims/quadrilateral/issues/188#issuecomment-1226165886 and
 * https://github.com/phetsims/quadrilateral/issues/188#issuecomment-1232237994.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';
import NamedQuadrilateral from './NamedQuadrilateral.js';

// Set up the bits for each shape property.
const CONCAVE_ANGLE = ( shapeModel: QuadrilateralShapeModel ) => _.some( shapeModel.vertices, vertex => vertex.angleProperty.value! > Math.PI );
const ONE_PARALLEL_PAIR = ( shapeModel: QuadrilateralShapeModel ) => shapeModel.parallelSidePairsProperty.value.length > 0;
const TWO_PARALLEL_PAIR = ( shapeModel: QuadrilateralShapeModel ) => shapeModel.parallelSidePairsProperty.value.length > 1;
const TWO_EQUAL_ADJACENT_ANGLE_PAIR = ( shapeModel: QuadrilateralShapeModel ) => shapeModel.adjacentEqualVertexPairsProperty.value.length > 1;
const ONE_EQUAL_OPPOSITE_ANGLE_PAIR = ( shapeModel: QuadrilateralShapeModel ) => shapeModel.oppositeEqualVertexPairsProperty.value.length > 0;
const TWO_EQUAL_OPPOSITE_ANGLE_PAIR = ( shapeModel: QuadrilateralShapeModel ) => shapeModel.oppositeEqualVertexPairsProperty.value.length > 1;
const ALL_EQUAL_ANGLE = ( shapeModel: QuadrilateralShapeModel ) => shapeModel.allAnglesRightProperty.value;
const TWO_EQUAL_ADJACENT_SIDE_PAIR = ( shapeModel: QuadrilateralShapeModel ) => shapeModel.adjacentEqualSidePairsProperty.value.length > 1;
const ONE_EQUAL_OPPOSITE_SIDE_PAIR = ( shapeModel: QuadrilateralShapeModel ) => shapeModel.oppositeEqualSidePairsProperty.value.length > 0;
const TWO_EQUAL_OPPOSITE_SIDE_PAIR = ( shapeModel: QuadrilateralShapeModel ) => shapeModel.oppositeEqualSidePairsProperty.value.length > 1;
const ALL_EQUAL_SIDE = ( shapeModel: QuadrilateralShapeModel ) => shapeModel.allLengthsEqualProperty.value;
const ONE_ANGLE_PIE = ( shapeModel: QuadrilateralShapeModel ) => _.some( shapeModel.vertices, vertex => shapeModel.isFlatAngle( vertex.angleProperty.value! ) );

// Set up conditions for each shape. The quadrilateral must at least these attributes to be considered a match.
const CONCAVE = [ CONCAVE_ANGLE ];

const TRIANGLE = [ ONE_ANGLE_PIE ];

const DART = [
  CONCAVE_ANGLE,
  ONE_EQUAL_OPPOSITE_ANGLE_PAIR,
  TWO_EQUAL_ADJACENT_SIDE_PAIR
];

const KITE = [
  ONE_EQUAL_OPPOSITE_ANGLE_PAIR,
  TWO_EQUAL_ADJACENT_SIDE_PAIR
];

const TRAPEZOID = [
  ONE_PARALLEL_PAIR
];

const ISOSCELES_TRAPEZOID = [
  ...TRAPEZOID,
  TWO_EQUAL_ADJACENT_ANGLE_PAIR,
  ONE_EQUAL_OPPOSITE_SIDE_PAIR
];

const PARALLELOGRAM = [
  ONE_PARALLEL_PAIR,
  TWO_PARALLEL_PAIR,
  ONE_EQUAL_OPPOSITE_ANGLE_PAIR,
  TWO_EQUAL_OPPOSITE_ANGLE_PAIR,
  ONE_EQUAL_OPPOSITE_SIDE_PAIR,
  TWO_EQUAL_OPPOSITE_SIDE_PAIR
];

const RECTANGLE = [
  ...PARALLELOGRAM,

  ALL_EQUAL_ANGLE,
  TWO_EQUAL_ADJACENT_ANGLE_PAIR
];

const RHOMBUS = [
  ...RECTANGLE,

  TWO_EQUAL_ADJACENT_SIDE_PAIR,
  ALL_EQUAL_SIDE
];

const SQUARE = [
  ...RHOMBUS,

  TWO_EQUAL_ADJACENT_ANGLE_PAIR,
  ALL_EQUAL_ANGLE
];

export default class QuadrilateralShapeDetector {
  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;

  public constructor( quadrilateralShapeModel: QuadrilateralShapeModel ) {
    this.quadrilateralShapeModel = quadrilateralShapeModel;
  }

  // REVIEW: This method should be made static, and pass in the QuadrilateralShapeModel as an argument
  // REVIEW: Add some unit tests to make sure this method and the masks are working as expected
  /**
   * Compute the name of the quadrilateral. Note this must be called AFTER all order dependent Properties are updated
   * because it relies on vertex positions to be stable and all shape attributes to be calculated. See
   * QuadrilateralShapeModel.updateOrderDependentProperties for more information.
   */
  public getShapeName(): NamedQuadrilateral {

    const shapeModel = this.quadrilateralShapeModel;

    // First look for a triangle - it is unique in that if we have a triangle there are no more shapes "under"
    // it that share attributes - so we can return this right away.
    if ( this.matches( shapeModel, TRIANGLE ) ) {
      return NamedQuadrilateral.TRIANGLE;
    }
    else if ( this.matches( shapeModel, CONCAVE ) ) {
      return this.matches( shapeModel, DART ) ? NamedQuadrilateral.DART :
             NamedQuadrilateral.CONCAVE_QUADRILATERAL;
    }
    else {
      return this.matches( shapeModel, SQUARE ) ? NamedQuadrilateral.SQUARE :
             this.matches( shapeModel, RHOMBUS ) ? NamedQuadrilateral.RHOMBUS :
             this.matches( shapeModel, RECTANGLE ) ? NamedQuadrilateral.RECTANGLE :
             this.matches( shapeModel, PARALLELOGRAM ) ? NamedQuadrilateral.PARALLELOGRAM :
             this.matches( shapeModel, KITE ) ? NamedQuadrilateral.KITE :
             this.matches( shapeModel, ISOSCELES_TRAPEZOID ) ? NamedQuadrilateral.ISOSCELES_TRAPEZOID :
             this.matches( shapeModel, TRAPEZOID ) ? NamedQuadrilateral.TRAPEZOID :
             NamedQuadrilateral.CONVEX_QUADRILATERAL;
    }
  }

  /**
   * Returns true when the condition state matches the conditions. If the condition has at least those
   * requirements (or more) it will still be considered a match for that shape.
   *
   * @param shapeModel
   * @param requirements - requirements for a particular shape
   */
  private matches( shapeModel: QuadrilateralShapeModel, requirements: Array<( shapeModel: QuadrilateralShapeModel ) => boolean> ): boolean {
    return requirements.every( requirement => requirement( shapeModel ) );
  }
}

quadrilateral.register( 'QuadrilateralShapeDetector', QuadrilateralShapeDetector );

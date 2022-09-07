// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import Side from '../model/Side.js';
import QuadrilateralShapeModel, { SidePair, VertexPair } from '../model/QuadrilateralShapeModel.js';
import Vertex from '../model/Vertex.js';
import VertexLabel from '../model/VertexLabel.js';
import VertexDescriber from './VertexDescriber.js';
import SideDescriber from './SideDescriber.js';

// constants
const firstDetailsStatementPatternString = QuadrilateralStrings.a11y.voicing.firstDetailsStatementPattern;
const aBString = QuadrilateralStrings.a11y.aB;
const bCString = QuadrilateralStrings.a11y.bC;
const cDString = QuadrilateralStrings.a11y.cD;
const dAString = QuadrilateralStrings.a11y.dA;
const topSideString = QuadrilateralStrings.a11y.topSide;
const rightSideString = QuadrilateralStrings.a11y.rightSide;
const bottomSideString = QuadrilateralStrings.a11y.bottomSide;
const leftSideString = QuadrilateralStrings.a11y.leftSide;
const allString = QuadrilateralStrings.a11y.voicing.details.all;
const oppositeString = QuadrilateralStrings.a11y.voicing.details.opposite;
const rightAnglesString = QuadrilateralStrings.a11y.voicing.details.rightAngles;
const equalString = QuadrilateralStrings.a11y.voicing.details.equal;
const pairsOfAdjacentString = QuadrilateralStrings.a11y.voicing.details.pairsOfAdjacent;
const onePairOfAdjacentString = QuadrilateralStrings.a11y.voicing.details.onePairOfAdjacent;
const onePairOfOppositeString = QuadrilateralStrings.a11y.voicing.details.onePairOfOpposite;
const noString = QuadrilateralStrings.a11y.voicing.details.noString;
const cornersPatternString = QuadrilateralStrings.a11y.voicing.details.cornersPattern;
const cornerPointsPatternString = QuadrilateralStrings.a11y.voicing.details.cornerPointsPattern;
const cornerConcavePatternString = QuadrilateralStrings.a11y.voicing.details.cornerConcavePattern;
const sidesPatternString = QuadrilateralStrings.a11y.voicing.details.sidesPattern;
const kiteSidesPatternString = QuadrilateralStrings.a11y.voicing.details.kiteSidesPattern;
const trapezoidSidesPatternString = QuadrilateralStrings.a11y.voicing.details.trapezoidSidesPattern;
const equalSidesPatternString = QuadrilateralStrings.a11y.voicing.details.equalSidesPattern;
const twoStatementPatternString = QuadrilateralStrings.a11y.voicing.details.twoStatementPattern;
const sideConcavePatternString = QuadrilateralStrings.a11y.voicing.details.sideConcavePattern;
const generalSidePatternString = QuadrilateralStrings.a11y.voicing.details.generalSidePattern;
const generalVertexPatternString = QuadrilateralStrings.a11y.voicing.details.generalVertexPattern;
const cornerAnglePatternString = QuadrilateralStrings.a11y.voicing.details.cornerAnglePattern;
const rightAngleCornersPatternString = QuadrilateralStrings.a11y.voicing.details.rightAngleCornersPattern;
const twoEqualVerticesAnglePatternString = QuadrilateralStrings.a11y.voicing.details.twoEqualVerticesAnglePattern;
const generalSideWithOneAdjacentEqualPairPatternString = QuadrilateralStrings.a11y.voicing.details.generalSideWithOneAdjacentEqualPairPattern;
const twoPairsOfEqualVerticesPatternString = QuadrilateralStrings.a11y.voicing.details.twoPairsOfEqualVerticesPattern;
const cornersAnglePatternString = QuadrilateralStrings.a11y.voicing.details.cornersAnglePattern;
const vertexAString = QuadrilateralStrings.vertexA;
const vertexBString = QuadrilateralStrings.vertexB;
const vertexCString = QuadrilateralStrings.vertexC;
const vertexDString = QuadrilateralStrings.vertexD;

const shapeNameMap = new Map<NamedQuadrilateral | null, string>();
shapeNameMap.set( NamedQuadrilateral.SQUARE, QuadrilateralStrings.a11y.voicing.shapeNames.square );
shapeNameMap.set( NamedQuadrilateral.RECTANGLE, QuadrilateralStrings.a11y.voicing.shapeNames.rectangle );
shapeNameMap.set( NamedQuadrilateral.RHOMBUS, QuadrilateralStrings.a11y.voicing.shapeNames.rhombus );
shapeNameMap.set( NamedQuadrilateral.KITE, QuadrilateralStrings.a11y.voicing.shapeNames.kite );
shapeNameMap.set( NamedQuadrilateral.ISOSCELES_TRAPEZOID, QuadrilateralStrings.a11y.voicing.shapeNames.isoscelesTrapezoid );
shapeNameMap.set( NamedQuadrilateral.TRAPEZOID, QuadrilateralStrings.a11y.voicing.shapeNames.trapezoid );
shapeNameMap.set( NamedQuadrilateral.CONCAVE_QUADRILATERAL, QuadrilateralStrings.a11y.voicing.shapeNames.concaveQuadrilateral );
shapeNameMap.set( NamedQuadrilateral.CONVEX_QUADRILATERAL, QuadrilateralStrings.a11y.voicing.shapeNames.convexQuadrilateral );
shapeNameMap.set( NamedQuadrilateral.PARALLELOGRAM, QuadrilateralStrings.a11y.voicing.shapeNames.parallelogram );
shapeNameMap.set( NamedQuadrilateral.DART, QuadrilateralStrings.a11y.voicing.shapeNames.dart );

// A map that goes from VertexLabel -> letter label (like "A")
const vertexLabelMap = new Map<VertexLabel, string>();
vertexLabelMap.set( VertexLabel.VERTEX_A, vertexAString );
vertexLabelMap.set( VertexLabel.VERTEX_B, vertexBString );
vertexLabelMap.set( VertexLabel.VERTEX_C, vertexCString );
vertexLabelMap.set( VertexLabel.VERTEX_D, vertexDString );

class QuadrilateralDescriber {
  private readonly shapeModel: QuadrilateralShapeModel;

  // The tolerance used to determine if a tilt has changed enough to describe it.
  public readonly tiltDifferenceToleranceInterval: number;
  public readonly lengthDifferenceToleranceInterval: number;

  // A map that goes from Side -> letter label (like "AB")
  private readonly sideLabelMap: Map<Side, string>;

  // A map that goes from Side -> full side label (like "Side AB")
  private readonly sideFullLabelMap: Map<Side, string>;

  public constructor( shapeModel: QuadrilateralShapeModel ) {
    this.shapeModel = shapeModel;

    this.sideLabelMap = new Map();
    this.sideLabelMap.set( shapeModel.topSide, aBString );
    this.sideLabelMap.set( shapeModel.rightSide, bCString );
    this.sideLabelMap.set( shapeModel.bottomSide, cDString );
    this.sideLabelMap.set( shapeModel.leftSide, dAString );

    this.sideFullLabelMap = new Map();
    this.sideFullLabelMap.set( shapeModel.topSide, topSideString );
    this.sideFullLabelMap.set( shapeModel.rightSide, rightSideString );
    this.sideFullLabelMap.set( shapeModel.bottomSide, bottomSideString );
    this.sideFullLabelMap.set( shapeModel.leftSide, leftSideString );

    // TODO: Do we need a query parameter for this?
    this.tiltDifferenceToleranceInterval = 0.2;
    this.lengthDifferenceToleranceInterval = 0.05;
  }

  /**
   * Get a description of the quadrilateral shape, just including the shape name. Will return something like
   * "a rectangle" or
   * "a trapezoid" or
   * "a concave quadrilateral"
   */
  public getShapeDescription(): string {

    // of type NamedQuadrilateral enumeration
    const shapeName = this.shapeModel.shapeNameProperty.value;
    return this.getShapeNameDescription( shapeName );
  }

  /**
   * Returns the actual name of the NamedQuadrilateral.
   */
  public getShapeNameDescription( shapeName: NamedQuadrilateral | null ): string {
    const shapeNameDescription = shapeNameMap.get( shapeName );
    assert && assert( shapeNameDescription, 'There must be shape name description for the current shape state.' );
    return shapeNameDescription!;
  }

  /**
   * Returns a string describing the shape that you have in a pattern like
   * "You have a square." or
   * "You have an isosceles trapezoid."
   */
  public getYouHaveAShapeDescription(): string {
    const shapeDescriptionString = this.getShapeDescription();
    return StringUtils.fillIn( QuadrilateralStrings.a11y.voicing.youHaveAShapeHintPattern, {
      shapeDescription: shapeDescriptionString
    } );
  }

  /**
   * Returns the first details statement. Details are broken up into three categorized statements. This one is a
   * summary about equal corner angles and equal side lengths. Will return something like
   * "Right now, opposite corners are equal and opposite sides are equal." or
   * "Right now, on pair of opposite corners are equal and opposite sides are equal" or
   * "Right now, no corners are equal and no sides are equal."
   */
  public getFirstDetailsStatement(): string {

    const adjacentEqualVertexPairs = this.shapeModel.adjacentEqualVertexPairsProperty.value;
    const adjacentEqualSidePairs = this.shapeModel.adjacentEqualSidePairsProperty.value;

    let cornerTypeString;
    let angleEqualityString;
    let sideTypeString;
    if ( this.shapeModel.isParallelogramProperty.value ) {

      // If all adjacent vertices are equal then all are right angles. Otherwise, opposite angles must be equal.
      cornerTypeString = adjacentEqualVertexPairs.length === 4 ? allString : oppositeString;
      angleEqualityString = adjacentEqualVertexPairs.length === 4 ? rightAnglesString : equalString;

      // if all adjacent sides are equal in length, all sides are equal, otherwise only opposite sides are equal
      sideTypeString = adjacentEqualSidePairs.length === 4 ? allString : oppositeString;
    }
    else {
      const oppositeEqualVertexPairs = this.shapeModel.oppositeEqualVertexPairsProperty.value;
      const oppositeEqualSidePairs = this.shapeModel.oppositeEqualSidePairsProperty.value;

      cornerTypeString = adjacentEqualVertexPairs.length === 2 ? pairsOfAdjacentString :
                         adjacentEqualVertexPairs.length === 1 ? onePairOfAdjacentString :
                         oppositeEqualVertexPairs.length === 1 ? onePairOfOppositeString :
                         noString;

      angleEqualityString = adjacentEqualVertexPairs.length === 1 && this.shapeModel.isShapeAngleEqualToOther( adjacentEqualVertexPairs[ 0 ].vertex1.angleProperty.value!, Math.PI / 2 ) ? rightAnglesString :
                            oppositeEqualVertexPairs.length === 1 && this.shapeModel.isShapeAngleEqualToOther( oppositeEqualVertexPairs[ 0 ].vertex1.angleProperty.value!, Math.PI / 2 ) ? rightAnglesString :
                              // if two pairs of adjacent angles exist but we are not parallelogram, all cannot be
                              // right angles. OR, no angles are equal.
                            equalString;

      sideTypeString = adjacentEqualSidePairs.length === 2 ? pairsOfAdjacentString :
                       adjacentEqualSidePairs.length === 1 ? onePairOfAdjacentString :
                       oppositeEqualSidePairs.length === 1 ? onePairOfOppositeString :
                       noString;
    }

    return StringUtils.fillIn( firstDetailsStatementPatternString, {
      cornerType: cornerTypeString,
      angleEquality: angleEqualityString,
      sideType: sideTypeString
    } );
  }

  /**
   * Get the second statement for the details button of the Voicing toolbar. This is a detailed summary
   * of the equal angles and how they compare to other angles in size qualitatively. There is no statement
   * about the corners if all angles are equal (right angles).
   */
  public getSecondDetailsStatement(): string | null {
    let statement = null;

    const adjacentEqualVertexPairs = this.shapeModel.adjacentEqualVertexPairsProperty.value;
    const oppositeEqualVertexPairs = this.shapeModel.oppositeEqualVertexPairsProperty.value;

    const shapeName = this.shapeModel.shapeNameProperty.value;

    // Nothing spoken if all angles are equal.
    if ( adjacentEqualVertexPairs.length !== 4 ) {

      if ( shapeName === NamedQuadrilateral.KITE ) {

        // there will be one pair of equal opposite angles
        assert && assert( oppositeEqualVertexPairs.length === 1, 'A Kite should only have one pair of opposite equal vertex angles' );
        const oppositeEqualVertexPair = oppositeEqualVertexPairs[ 0 ];
        const orderedEqualVertices = this.getVerticesOrderedForDescription( [ oppositeEqualVertexPair.vertex1, oppositeEqualVertexPair.vertex2 ] );

        const firstCornersString = this.getCornersAngleDescription( orderedEqualVertices[ 0 ], orderedEqualVertices[ 1 ] );

        // the vertices that are not equal still need to be described, in the decided order
        const otherVertices = this.getUndescribedVertices( orderedEqualVertices );
        const orderedUnequalVertices = this.getVerticesOrderedForDescription( otherVertices );

        const thirdCornerString = this.getCornerAngleDescription( orderedUnequalVertices[ 0 ] );
        const fourthCornerString = this.getCornerAngleDescription( orderedUnequalVertices[ 1 ] );

        // how the equal vertex angles compare qualitatively to the fist unequal vertex
        const firstComparisonString = VertexDescriber.getAngleComparisonDescription( orderedUnequalVertices[ 0 ], orderedEqualVertices[ 0 ] );

        // how the equal vertex angles compare qualitatively to the second unequal vertex
        const secondComparisonString = VertexDescriber.getAngleComparisonDescription( orderedUnequalVertices[ 1 ], orderedEqualVertices[ 0 ] );

        const patternString = cornersPatternString;
        statement = StringUtils.fillIn( patternString, {
          firstCorners: firstCornersString,
          firstComparison: firstComparisonString,
          thirdCorner: thirdCornerString,
          secondComparison: secondComparisonString,
          fourthCorner: fourthCornerString
        } );
      }
      else if ( shapeName === NamedQuadrilateral.TRAPEZOID ) {

        // if there are two adjacent vertices with equal angles, combine them in the description
        if ( adjacentEqualVertexPairs.length > 0 ) {

          // start with the adjacent corners in the prescribed order
          assert && assert( adjacentEqualVertexPairs.length === 1, 'should only be one adjacent vertex pair for a trapezoid' );
          statement = this.getTwoEqualVerticesAngleDescription( adjacentEqualVertexPairs[ 0 ].vertex1, adjacentEqualVertexPairs[ 0 ].vertex2 );
        }
        else {

          // In the basic case a trapezoid is described like a general quadrilateral
          statement = this.getConvexQuadrilateralVertexDescription();
        }
      }
      else if ( shapeName === NamedQuadrilateral.ISOSCELES_TRAPEZOID ) {
        assert && assert( adjacentEqualVertexPairs.length === 2, 'There should be two pairs of adjacent equal angles for an isosceles trapezoid' );
        statement = this.getTwoPairsOfEqualVerticesAngleDescription( adjacentEqualVertexPairs );
      }
      else if ( this.shapeModel.isParallelogramProperty.value ) {

        // there should be two pairs of equal opposite angles, but we cannot assume this because we may be in a
        // parallelogram state without entries in oppositeEqualVertexPairs because of the behavior of
        // angleToleranceIntervalProperty. But we describe opposite vertex pairs as if they were equal.
        // assert && assert( oppositeEqualVertexPairs.length === 2, 'there should be two pairs of equal opposite angles for a parallelogram' );
        statement = this.getTwoPairsOfEqualVerticesAngleDescription( this.shapeModel.oppositeVertices );
      }
      else if ( shapeName === NamedQuadrilateral.CONCAVE_QUADRILATERAL ) {

        // The concave shape may have a pair of opposite or adjacent vertex pairs with equal angles that should be
        // described.
        let quadrilateralStatementString;
        if ( oppositeEqualVertexPairs.length === 1 ) {
          quadrilateralStatementString = this.getTwoEqualVerticesAngleDescription( oppositeEqualVertexPairs[ 0 ].vertex1, oppositeEqualVertexPairs[ 0 ].vertex2 );
        }
        else if ( adjacentEqualVertexPairs.length === 1 ) {
          quadrilateralStatementString = this.getTwoEqualVerticesAngleDescription( adjacentEqualVertexPairs[ 0 ].vertex1, adjacentEqualVertexPairs[ 0 ].vertex2 );
        }
        else {
          quadrilateralStatementString = this.getConvexQuadrilateralVertexDescription();
        }

        // after the quadrilateral statement describe the vertex whose angle makes this shape concave
        let concaveVertex: null | Vertex = null;
        let otherVertex: null | Vertex = null;
        this.shapeModel.oppositeVertices.forEach( vertexPair => {
          const firstVertexConcave = vertexPair.vertex1.angleProperty.value! > Math.PI;
          const secondVertexConcave = vertexPair.vertex2.angleProperty.value! > Math.PI;
          if ( firstVertexConcave || secondVertexConcave ) {
            concaveVertex = firstVertexConcave ? vertexPair.vertex1 : vertexPair.vertex2;
            otherVertex = firstVertexConcave ? vertexPair.vertex2 : vertexPair.vertex1;
          }
        } );
        assert && assert( otherVertex && concaveVertex, 'A concave shape better have a vertex whose angle is greater than Math.PI' );

        const pointingPatternString = cornerPointsPatternString;
        const pointingStatementString = StringUtils.fillIn( pointingPatternString, {
          firstCorner: this.getCornerAngleDescription( concaveVertex! ),
          secondCorner: this.getCornerAngleDescription( otherVertex! )
        } );

        statement = StringUtils.fillIn( cornerConcavePatternString, {
          quadrilateralStatement: quadrilateralStatementString,
          pointingStatement: pointingStatementString
        } );
      }
      else {

        // fall back to the format for a "general" quadrilateral, see function for the details
        statement = this.getConvexQuadrilateralVertexDescription();
      }
    }

    return statement;
  }

  /**
   * Returns the third statement for the details button of the Voicing toolbar. This statement describes
   * the relative lengths of sides. The statement will take slightly different patterns depending on the current
   * pairs of equal or parallel sides and the shape name. If all side lengths are equal this function
   * returns null.
   */
  public getThirdDetailsStatement(): null | string {
    let statement = null;

    const adjacentEqualSidePairs = this.shapeModel.adjacentEqualSidePairsProperty.value;
    const parallelSidePairs = this.shapeModel.parallelSidePairsProperty.value;

    const shapeName = this.shapeModel.shapeNameProperty.value;

    // no description if all sides are equal in length
    if ( adjacentEqualSidePairs.length < 4 ) {
      if ( this.shapeModel.isParallelogramProperty.value ) {

        // We cannot nececssarily use parallelSidePairsProperty because the angleToleranceInterval can allow for
        // a parallelogram without parallel sides within shapeAngleToleranceInterval. But we should still describe
        // the opposite sides as if they are parallelo
        // assert && assert( parallelSidePairs.length === 2, 'Should be two pairs of parallel sides for a parallelogram' );
        const oppositeSides = this.shapeModel.oppositeSides;

        const patternString = sidesPatternString;
        statement = this.getTwoSidePairsDescription( oppositeSides, patternString );
      }
      else if ( shapeName === NamedQuadrilateral.KITE ) {
        assert && assert( adjacentEqualSidePairs.length === 2, 'There should be two pairs of adjacent sides with with the same length for a kite' );
        const patternString = kiteSidesPatternString;
        statement = this.getTwoSidePairsDescription( adjacentEqualSidePairs, patternString );
      }
      else if ( shapeName === NamedQuadrilateral.TRAPEZOID || shapeName === NamedQuadrilateral.ISOSCELES_TRAPEZOID ) {

        // TODO: We cannot assert this yet because parallel sides use angleToleranceInterval which can break when
        // the shape is not a parallelogram. See https://github.com/phetsims/quadrilateral/issues/108
        // Replace the if statement with this assertion when that issue is resolved.
        // assert && assert( parallelSidePairs.length === 1, 'There should be one pair of parallel sides for a trapezoid' );
        if ( parallelSidePairs.length === 1 ) {
          const orderedParallelSidePairs = this.getSidePairsOrderedForDescription( parallelSidePairs );
          const firstSide = orderedParallelSidePairs[ 0 ].side1;
          const secondSide = orderedParallelSidePairs[ 0 ].side2;

          const otherSides = this.getUndescribedSides( [ firstSide, secondSide ] );
          assert && assert( otherSides.length === 2, 'there should be two remaining sides to describe' );
          const orderedOtherSidePairs = this.getSidePairsOrderedForDescription( [ { side1: otherSides[ 0 ], side2: otherSides[ 1 ] } ] );
          const thirdSide = orderedOtherSidePairs[ 0 ].side1;
          const fourthSide = orderedOtherSidePairs[ 0 ].side2;

          // comparing the length of the first side to the second side, relative to the first side
          const firstComparisonString = SideDescriber.getLengthComparisonDescription( secondSide, firstSide );

          // comparing third and fourth sides, relative to the third side
          const secondComparisonString = SideDescriber.getLengthComparisonDescription( fourthSide, thirdSide );

          const trapezoidPatternString = trapezoidSidesPatternString;
          const parallelSidesStatement = StringUtils.fillIn( trapezoidPatternString, {
            firstSide: this.getSideDescription( firstSide ),
            firstComparison: firstComparisonString,
            secondSide: this.getSideDescription( secondSide ),
            thirdSide: this.getSideDescription( thirdSide ),
            secondComparison: secondComparisonString,
            fourthSide: this.getSideDescription( fourthSide )
          } );

          if ( adjacentEqualSidePairs.length === 1 ) {

            // if there is one pair of adjacent sides with equal lengths, call those out at the end of the statement
            const orderedAdjacentSides = this.getSidePairsOrderedForDescription( adjacentEqualSidePairs );
            const firstSide = orderedAdjacentSides[ 0 ].side1;
            const secondSide = orderedAdjacentSides[ 0 ].side2;

            const equalSidesStatement = StringUtils.fillIn( equalSidesPatternString, {
              firstSide: this.getSideDescription( firstSide ),
              secondSide: this.getSideDescription( secondSide )
            } );

            statement = StringUtils.fillIn( twoStatementPatternString, {
              firstStatement: parallelSidesStatement,
              secondStatement: equalSidesStatement
            } );
          }
          else {
            statement = parallelSidesStatement;
          }
        }
        else {
          statement = 'I cannot describe this trapezoid because of issue 108.';
        }
      }
      else if ( shapeName === NamedQuadrilateral.CONCAVE_QUADRILATERAL ) {
        if ( adjacentEqualSidePairs.length === 2 ) {
          assert && assert( adjacentEqualSidePairs.length === 2, 'There should be two pairs of adjacent sides with with the same length for a kite' );
          const patternString = sideConcavePatternString;
          statement = this.getTwoSidePairsDescription( adjacentEqualSidePairs, patternString );
        }
        else {
          statement = this.getGeneralQuadrilateralSideDescription();
        }
      }
      else {

        // General quadrilateral - if there is one pair of adjacent sides we have this unique pattern that describes
        // the pair of equal sides relative to the others
        if ( adjacentEqualSidePairs.length === 1 ) {
          const sortedAdjacentSidePairs = this.getSidePairsOrderedForDescription( adjacentEqualSidePairs );

          const firstSide = sortedAdjacentSidePairs[ 0 ].side1;
          const secondSide = sortedAdjacentSidePairs[ 0 ].side2;

          const remainingSides = this.getUndescribedSides( [ firstSide, secondSide ] );
          const remainingSidePair = { side1: remainingSides[ 0 ], side2: remainingSides[ 1 ] };
          const orderedRemainingSides = this.getSidePairsOrderedForDescription( [ remainingSidePair ] );
          assert && assert( orderedRemainingSides.length === 1, 'we should have one more side pair to describe for a general quadrilateral with one pair of adjacent equal sides' );

          const thirdSide = orderedRemainingSides[ 0 ].side1;
          const fourthSide = orderedRemainingSides[ 0 ].side2;

          // first comparison is the equal sides against the third side, relative to the first side
          const firstComparisonString = SideDescriber.getLengthComparisonDescription( thirdSide, firstSide );

          // second comparison is the equal sides aginst the fourth side, relative to the first side
          const secondComparisonString = SideDescriber.getLengthComparisonDescription( fourthSide, firstSide );

          // third comparison is the fourth side against the third side, relative to the third side
          const thirdComparisonString = SideDescriber.getLengthComparisonDescription( fourthSide, thirdSide );

          statement = StringUtils.fillIn( generalSideWithOneAdjacentEqualPairPatternString, {
            firstSide: this.getSideDescription( firstSide ),
            secondSide: this.getSideDescription( secondSide ),
            firstComparison: firstComparisonString,
            thirdSide: this.getSideDescription( thirdSide ),
            secondComparison: secondComparisonString,
            fourthSide: this.getSideDescription( fourthSide ),
            thirdComparison: thirdComparisonString
          } );
        }
        else {

          // general case, no interesting Properties about sides
          statement = this.getGeneralQuadrilateralSideDescription();
        }
      }
    }

    return statement;
  }

  /**
   * Returns a description of the relative angles at vertices for a general quadrilateral. This is often
   * used as a fallback case when there aren't particular aspects of equal angles to describe. Will return
   * something like
   *
   * "Corner C is somewhat smaller than corner A and Corner B is a little smaller than Corner D."
   */
  private getConvexQuadrilateralVertexDescription(): string {
    const orderedOppositeVertexPairs = this.getVertexPairsOrderedForDescription( this.shapeModel.oppositeVertices );

    const firstCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 0 ].vertex1 );
    const secondCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 0 ].vertex2 );
    const thirdCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 1 ].vertex1 );
    const fourthCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 1 ].vertex2 );

    const firstComparisonString = VertexDescriber.getAngleComparisonDescription( orderedOppositeVertexPairs[ 0 ].vertex2, orderedOppositeVertexPairs[ 0 ].vertex1 );
    const secondComparisonString = VertexDescriber.getAngleComparisonDescription( orderedOppositeVertexPairs[ 1 ].vertex2, orderedOppositeVertexPairs[ 1 ].vertex1 );

    return StringUtils.fillIn( generalVertexPatternString, {
      firstCorner: firstCornerString,
      firstComparison: firstComparisonString,
      secondCorner: secondCornerString,
      thirdCorner: thirdCornerString,
      secondComparison: secondComparisonString,
      fourthCorner: fourthCornerString
    } );
  }

  /**
   * Returns a "basic" description for a quadrilateral without interesting side Properties. Describes the relative
   * lengths of opposite sides of the quadrilateral. Sides in the descriptions are ordered by the method in
   * getSidePairsOrderedForDescription.
   */
  private getGeneralQuadrilateralSideDescription(): string {

    // general fallback pattern for a quadrilateral without interesting properties, describing relative lengths
    // of opposite sides
    const patternString = generalSidePatternString;
    const sortedOppositeSidePairs = this.getSidePairsOrderedForDescription( this.shapeModel.oppositeSides );

    const firstSide = sortedOppositeSidePairs[ 0 ].side1;
    const secondSide = sortedOppositeSidePairs[ 0 ].side2;
    const thirdSide = sortedOppositeSidePairs[ 1 ].side1;
    const fourthSide = sortedOppositeSidePairs[ 1 ].side2;

    // comparing the lengths of each opposite side pair, relative to the first side in the pair
    const firstComparisonString = SideDescriber.getLengthComparisonDescription( secondSide, firstSide );
    const secondComparisonString = SideDescriber.getLengthComparisonDescription( fourthSide, thirdSide );

    return StringUtils.fillIn( patternString, {
      firstSide: this.getSideDescription( firstSide ),
      firstComparison: firstComparisonString,
      secondSide: this.getSideDescription( secondSide ),
      thirdSide: this.getSideDescription( thirdSide ),
      secondComparison: secondComparisonString,
      fourthSide: this.getSideDescription( fourthSide )
    } );
  }

  private getTwoSidePairsDescription( sidePairs: SidePair[], patternString: string ): string {
    assert && assert( sidePairs.length === 2, 'getTwoSidePairsDescription assumes you are describing two pairs of sides with some interesting property' );

    const orderedSidePairs = this.getSidePairsOrderedForDescription( sidePairs );

    // Compare the lengths of the first two parallel sides against the lengths of the second two parallel sides,
    // relative to the first two parallel sides.
    const comparisonString = SideDescriber.getLengthComparisonDescription( orderedSidePairs[ 1 ].side1, orderedSidePairs[ 0 ].side1 );

    // const patternString = 'Equal Sides {{firstSide}} and {{secondSide}} are {{comparison}} equal Sides {{thirdSide}} and {{fourthSide}}.';
    return StringUtils.fillIn( patternString, {
      firstSide: this.getSideDescription( orderedSidePairs[ 0 ].side1 ),
      secondSide: this.getSideDescription( orderedSidePairs[ 0 ].side2 ),
      comparison: comparisonString,
      thirdSide: this.getSideDescription( orderedSidePairs[ 1 ].side1 ),
      fourthSide: this.getSideDescription( orderedSidePairs[ 1 ].side2 )
    } );
  }

  /**
   * Get a description of all four vertex angles when the two provided vertex angles are equal. Uses a string pattern
   * that will return something like
   *
   * "Equal corners D and A are a little larger than Corner B and much much smaller than Corner C."
   *
   * The order that the vertices are described in the statement is determined by the sorting algorithm in
   * getVerticesOrderedForDescription.
   */
  private getTwoEqualVerticesAngleDescription( vertex1: Vertex, vertex2: Vertex ): string {

    const sortedVertices = this.getVerticesOrderedForDescription( [ vertex1, vertex2 ] );
    const firstVertex = sortedVertices[ 0 ];
    const secondVertex = sortedVertices[ 1 ];

    const patternString = twoEqualVerticesAnglePatternString;
    const firstCornersString = this.getCornersAngleDescription( firstVertex, secondVertex );

    const undescribedVertices = this.getUndescribedVertices( [ firstVertex, secondVertex ] );
    const sortedUndescribedVertices = this.getVerticesOrderedForDescription( undescribedVertices );

    const thirdCornerString = this.getCornerAngleDescription( sortedUndescribedVertices[ 0 ] );
    const fourthCornerString = this.getCornerAngleDescription( sortedUndescribedVertices[ 1 ] );

    // describe the relative size of the equal angles compared to eqch unequal angle
    const firstComparisonString = VertexDescriber.getAngleComparisonDescription( sortedUndescribedVertices[ 0 ], firstVertex );
    const secondComparisonString = VertexDescriber.getAngleComparisonDescription( sortedUndescribedVertices[ 1 ], firstVertex );

    return StringUtils.fillIn( patternString, {
      firstCorners: firstCornersString,
      firstComparison: firstComparisonString,
      thirdCorner: thirdCornerString,
      secondComparison: secondComparisonString,
      fourthCorner: fourthCornerString
    } );
  }

  /**
   * Generates a description of vertex angles when there are two pairs of equal vertex angles in the quadrilateral.
   * Uses a string pattern that will return a string like
   *
   * "Equal corners D and C are much smaller than equal corners A and B."
   *
   * The order in which VertexPairs are described are defined by the algorithm of getVertexPairsOrderedForDescription.
   */
  private getTwoPairsOfEqualVerticesAngleDescription( vertexPairs: VertexPair[] ): string {

    const orderedVertexPairs = this.getVertexPairsOrderedForDescription( vertexPairs );

    const firstCornersString = this.getCornersAngleDescription( orderedVertexPairs[ 0 ].vertex1, orderedVertexPairs[ 0 ].vertex2 );
    const secondCornersString = this.getCornersAngleDescription( orderedVertexPairs[ 1 ].vertex1, orderedVertexPairs[ 1 ].vertex2 );

    // we are comparing the angles of the vertex pairs, relative to the first described pair
    const comparisonString = VertexDescriber.getAngleComparisonDescription( orderedVertexPairs[ 1 ].vertex1, orderedVertexPairs[ 0 ].vertex1 );

    const patternString = twoPairsOfEqualVerticesPatternString;
    return StringUtils.fillIn( patternString, {
      firstCorners: firstCornersString,
      comparison: comparisonString,
      secondCorners: secondCornersString
    } );
  }

  /**
   * If the corner is a right angle will describe that before the vertex label. Otherwise just returns the vertex label.
   * Returns something like
   * "Corner A" or
   * "right angle Corner A"
   */
  private getCornerAngleDescription( vertex: Vertex ): string {

    const labelString = VertexDescriber.VertexCornerLabelMap.get( vertex.vertexLabel );
    assert && assert( labelString, 'vertexLabel not in vertexLabelMap' );

    let descriptionString = labelString;
    assert && assert( vertex.angleProperty, 'Angle required for this description' );
    if ( this.shapeModel.isRightAngle( vertex.angleProperty.value! ) ) {

      // include "right angle"
      descriptionString = StringUtils.fillIn( cornerAnglePatternString, {
        cornerLabel: labelString
      } );
    }

    return descriptionString!;
  }

  /**
   * Get the described label for a Side
   */
  private getSideDescription( side: Side ): string {
    const label = this.sideLabelMap.get( side )!;
    assert && assert( label, 'label not found for side' );
    return label;
  }

  /**
   * Get a description about two angles at once, assuming that they are equal. Returns something like
   * "Corners A and B" or
   * "right angle Corners A and B"
   *
   * Note that two vertex angles may NOT be exactly equal due to the behavior of angleToleranceIntervalProperty,
   * which allows for more lenient equality for parallelogram.
   */
  private getCornersAngleDescription( vertex1: Vertex, vertex2: Vertex ): string {
    const firstLabelString = vertexLabelMap.get( vertex1.vertexLabel );
    const secondLabelString = vertexLabelMap.get( vertex2.vertexLabel );

    const cornersPatternString = cornersAnglePatternString;

    let descriptionString = StringUtils.fillIn( cornersPatternString, {
      firstCorner: firstLabelString,
      secondCorner: secondLabelString
    } );

    assert && assert( vertex1.angleProperty.value !== null, 'angles need to be ready for use in getCornersAngleDescription' );
    const angle1 = vertex1.angleProperty.value!;
    if ( this.shapeModel.isRightAngle( angle1 ) ) {
      descriptionString = StringUtils.fillIn( rightAngleCornersPatternString, {
        cornersString: descriptionString
      } );
    }

    return descriptionString;
  }

  /**
   * For some reason, it was decided that the order that vertices are mentioned in descriptions need to be ordered in a
   * unique way. This function returns the vertices in the order that they should be described in the string
   * creation functions of this Describer.
   */
  private getVerticesOrderedForDescription( vertices: Vertex[] ): Vertex[] {

    const order = vertices.sort( ( a: Vertex, b: Vertex ) => {
      return this.compareVerticesForDescription( a, b );
    } );

    assert && assert( order.length === vertices.length, 'An order for vertices was not identified.' );
    return order;
  }

  private compareVerticesForDescription( vertex1: Vertex, vertex2: Vertex ): number {
    const firstPosition = vertex1.positionProperty.value;
    const secondPosition = vertex2.positionProperty.value;

    let sortReturnValue = 0;

    // if vertically equal, left most vertex is spoken first
    if ( firstPosition.y === secondPosition.y ) {

      // if first position is left of second position, a before b
      sortReturnValue = firstPosition.x < secondPosition.x ? -1 : 1;
    }
    else {

      // if first position is lower than second position, a before b
      sortReturnValue = firstPosition.y < secondPosition.y ? -1 : 1;
    }

    return sortReturnValue;
  }

  private getVertexPairsOrderedForDescription( vertexPairs: VertexPair[] ): VertexPair[] {

    // Order each vertexPair provided first
    const newVertexPairs: VertexPair[] = [];
    vertexPairs.forEach( vertexPair => {
      const orderedVertices = this.getVerticesOrderedForDescription( [ vertexPair.vertex1, vertexPair.vertex2 ] );
      newVertexPairs.push( { vertex1: orderedVertices[ 0 ], vertex2: orderedVertices[ 1 ] } );
    } );

    // Now we can sort the VertexPairs based on the first vertex of each pair, since the vertices in
    // each pair are now sorted
    const orderedVertexPairs = newVertexPairs.sort( ( vertexPair1: VertexPair, vertexPair2: VertexPair ) => {
      return this.compareVerticesForDescription( vertexPair1.vertex1, vertexPair2.vertex1 );
    } );

    assert && assert( vertexPairs.length === orderedVertexPairs.length, 'Did not identify an order for VertexPairs' );
    return orderedVertexPairs;
  }

  /**
   * Given a collection of SidePairs, order the sides so that they are in the order that they should appear in the
   * description. For a reason I don't fully understand, vertices and sides are described bottom to top, and left to
   * right. First, we order each side within the SidePair with that criterion. Then we order the SidePairs for the
   * final returned array.
   */
  private getSidePairsOrderedForDescription( sidePairs: SidePair[] ): SidePair[] {

    // First we order the sides within in each SidePair so that we can find the SidePair with the vertices
    // that should come first
    const orderedSidePairs: SidePair[] = [];
    sidePairs.forEach( sidePair => {
      const side1 = sidePair.side1;
      const side2 = sidePair.side2;

      const sideComparison = this.compareVerticesForDescription( side1.vertex1, side2.vertex1 );

      let firstSide = side1;
      let secondSide = side2;

      if ( sideComparison > 0 ) {

        // comparator says side2 before side1 (0 indicates no change, -1 indicates side1 before side2)
        firstSide = side2;
        secondSide = side1;
      }

      orderedSidePairs.push( { side1: firstSide, side2: secondSide } );
    } );

    // Now that Sides within each pair are ordered, SidePairs can be ordered relative to the first vertex
    // of the first side
    const order = orderedSidePairs.sort( ( sidePairA, sidePairB ) => {
      return this.compareVerticesForDescription( sidePairA.side1.vertex1, sidePairB.side1.vertex1 );
    } );

    assert && assert( sidePairs.length === order.length, 'Order not determined for sidePairs' );
    return order;
  }

  /**
   * From an array of Vertices, all of which have been described, return a new array of Vertices that still
   * need a description. Useful when you have a description for a pair of adjacent/opposite vertices but don't
   * have a reference to the remaining vertices yet.
   */
  private getUndescribedVertices( vertices: Vertex[] ): Vertex[] {
    const unusedVertices: Vertex[] = [];
    this.shapeModel.vertices.forEach( vertex => {
      if ( !vertices.includes( vertex ) ) {
        unusedVertices.push( vertex );
      }
    } );

    return unusedVertices;
  }

  /**
   * From an array of Sides which you know have been described, return a new array of Sides that still need a
   * description. Useful when you are describing two adjacent/opposite sides and don't have a reference yet to the
   * remaining adjacent sides.
   */
  private getUndescribedSides( sides: Side[] ): Side[] {
    const unusedSides: Side[] = [];

    this.shapeModel.sides.forEach( side => {
      if ( !sides.includes( side ) ) {
        unusedSides.push( side );
      }
    } );

    return unusedSides;
  }
}

quadrilateral.register( 'QuadrilateralDescriber', QuadrilateralDescriber );
export default QuadrilateralDescriber;

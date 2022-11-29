// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import Side from '../model/Side.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import Vertex from '../model/Vertex.js';
import VertexLabel from '../model/VertexLabel.js';
import VertexDescriber from './VertexDescriber.js';
import SideDescriber from './SideDescriber.js';
import SideLabel from '../model/SideLabel.js';
import SidePair from '../model/SidePair.js';
import VertexPair from '../model/VertexPair.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';

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
const generalSidePatternString = QuadrilateralStrings.a11y.voicing.details.generalSidePattern;
const generalVertexPatternString = QuadrilateralStrings.a11y.voicing.details.generalVertexPattern;
const cornerAnglePatternString = QuadrilateralStrings.a11y.voicing.details.cornerAnglePattern;
const rightAngleCornersPatternString = QuadrilateralStrings.a11y.voicing.details.rightAngleCornersPattern;
const twoEqualVerticesAnglePatternString = QuadrilateralStrings.a11y.voicing.details.twoEqualVerticesAnglePattern;
const twoPairsOfEqualVerticesPatternString = QuadrilateralStrings.a11y.voicing.details.twoPairsOfEqualVerticesPattern;
const cornersAnglePatternString = QuadrilateralStrings.a11y.voicing.details.cornersAnglePattern;
const vertexAString = QuadrilateralStrings.vertexA;
const vertexBString = QuadrilateralStrings.vertexB;
const vertexCString = QuadrilateralStrings.vertexC;
const vertexDString = QuadrilateralStrings.vertexD;
const youHaveASizedNamedShapePatternString = QuadrilateralStrings.a11y.voicing.youHaveASizedNamedShapePattern;
const youHaveASizedShapePatternString = QuadrilateralStrings.a11y.voicing.youHaveASizedShapePattern;

const isoscelesTrapezoidDetailsPatternString = QuadrilateralStrings.a11y.voicing.isoscelesTrapezoidDetailsPattern;
const allRightAnglesAllSidesEqualString = QuadrilateralStrings.a11y.voicing.allRightAnglesAllSidesEqual;
const oppositeSidesInParallelString = QuadrilateralStrings.a11y.voicing.oppositeSidesInParallel;
const trapezoidDetailsPatternString = QuadrilateralStrings.a11y.voicing.trapezoidDetailsPattern;
const kiteDetailsShortPatternString = QuadrilateralStrings.a11y.voicing.kiteDetailsShortPattern;
const dartDetailsShortPatternString = QuadrilateralStrings.a11y.voicing.dartDetailsShortPattern;
const convexQuadrilateralDetailsString = QuadrilateralStrings.a11y.voicing.convexQuadrilateralDetails;
const concaveQuadrilateralDetailsPatternString = QuadrilateralStrings.a11y.voicing.concaveQuadrilateralDetailsPattern;
const allSidesEqualString = QuadrilateralStrings.a11y.voicing.allSidesEqual;
const allRightAnglesString = QuadrilateralStrings.a11y.voicing.allRightAngles;
const triangleDetailsPatternString = QuadrilateralStrings.a11y.voicing.triangleDetailsPattern;

const sidesDescriptionPatternString = QuadrilateralStrings.a11y.voicing.sidesDescriptionPattern;
const longestSidesDescriptionPatternString = QuadrilateralStrings.a11y.voicing.longestSidesDescriptionPattern;
const longestSideDescriptionPatternString = QuadrilateralStrings.a11y.voicing.longestSideDescriptionPattern;
const shortestSidesDescriptionPatternString = QuadrilateralStrings.a11y.voicing.shortestSidesDescriptionPattern;
const shortestSideDescriptionPatternString = QuadrilateralStrings.a11y.voicing.shortestSideDescriptionPattern;
const sideLengthDescriptionPatternString = QuadrilateralStrings.a11y.voicing.sideLengthDescriptionPattern;

const cornersRightDescriptionString = QuadrilateralStrings.a11y.voicing.cornersRightDescription;
const widestCornersDescriptionPatternString = QuadrilateralStrings.a11y.voicing.widestCornersDescriptionPattern;
const widestCornerDescriptionPatternString = QuadrilateralStrings.a11y.voicing.widestCornerDescriptionPattern;
const smallestCornersDescriptionPatternString = QuadrilateralStrings.a11y.voicing.smallestCornersDescriptionPattern;
const smallestCornerDescriptionPatternString = QuadrilateralStrings.a11y.voicing.smallestCornerDescriptionPattern;
const cornersDescriptionPatternString = QuadrilateralStrings.a11y.voicing.cornersDescriptionPattern;
const numberOfSlicesPatternString = QuadrilateralStrings.a11y.voicing.numberOfSlicesPattern;

const shapeNameWithArticlesMap = new Map<NamedQuadrilateral | null, string>();
shapeNameWithArticlesMap.set( NamedQuadrilateral.SQUARE, QuadrilateralStrings.a11y.voicing.shapeNames.withArticles.square );
shapeNameWithArticlesMap.set( NamedQuadrilateral.RECTANGLE, QuadrilateralStrings.a11y.voicing.shapeNames.withArticles.rectangle );
shapeNameWithArticlesMap.set( NamedQuadrilateral.RHOMBUS, QuadrilateralStrings.a11y.voicing.shapeNames.withArticles.rhombus );
shapeNameWithArticlesMap.set( NamedQuadrilateral.KITE, QuadrilateralStrings.a11y.voicing.shapeNames.withArticles.kite );
shapeNameWithArticlesMap.set( NamedQuadrilateral.ISOSCELES_TRAPEZOID, QuadrilateralStrings.a11y.voicing.shapeNames.withArticles.isoscelesTrapezoid );
shapeNameWithArticlesMap.set( NamedQuadrilateral.TRAPEZOID, QuadrilateralStrings.a11y.voicing.shapeNames.withArticles.trapezoid );
shapeNameWithArticlesMap.set( NamedQuadrilateral.CONCAVE_QUADRILATERAL, QuadrilateralStrings.a11y.voicing.shapeNames.withArticles.concaveQuadrilateral );
shapeNameWithArticlesMap.set( NamedQuadrilateral.CONVEX_QUADRILATERAL, QuadrilateralStrings.a11y.voicing.shapeNames.withArticles.convexQuadrilateral );
shapeNameWithArticlesMap.set( NamedQuadrilateral.PARALLELOGRAM, QuadrilateralStrings.a11y.voicing.shapeNames.withArticles.parallelogram );
shapeNameWithArticlesMap.set( NamedQuadrilateral.DART, QuadrilateralStrings.a11y.voicing.shapeNames.withArticles.dart );
shapeNameWithArticlesMap.set( NamedQuadrilateral.TRIANGLE, QuadrilateralStrings.a11y.voicing.shapeNames.withArticles.triangle );

const shapeNameMap = new Map<NamedQuadrilateral, string>();
shapeNameMap.set( NamedQuadrilateral.SQUARE, QuadrilateralStrings.a11y.voicing.shapeNames.withoutArticles.square );
shapeNameMap.set( NamedQuadrilateral.RECTANGLE, QuadrilateralStrings.a11y.voicing.shapeNames.withoutArticles.rectangle );
shapeNameMap.set( NamedQuadrilateral.RHOMBUS, QuadrilateralStrings.a11y.voicing.shapeNames.withoutArticles.rhombus );
shapeNameMap.set( NamedQuadrilateral.KITE, QuadrilateralStrings.a11y.voicing.shapeNames.withoutArticles.kite );
shapeNameMap.set( NamedQuadrilateral.ISOSCELES_TRAPEZOID, QuadrilateralStrings.a11y.voicing.shapeNames.withoutArticles.isoscelesTrapezoid );
shapeNameMap.set( NamedQuadrilateral.TRAPEZOID, QuadrilateralStrings.a11y.voicing.shapeNames.withoutArticles.trapezoid );
shapeNameMap.set( NamedQuadrilateral.CONCAVE_QUADRILATERAL, QuadrilateralStrings.a11y.voicing.shapeNames.withoutArticles.concaveQuadrilateral );
shapeNameMap.set( NamedQuadrilateral.CONVEX_QUADRILATERAL, QuadrilateralStrings.a11y.voicing.shapeNames.withoutArticles.convexQuadrilateral );
shapeNameMap.set( NamedQuadrilateral.PARALLELOGRAM, QuadrilateralStrings.a11y.voicing.shapeNames.withoutArticles.parallelogram );
shapeNameMap.set( NamedQuadrilateral.DART, QuadrilateralStrings.a11y.voicing.shapeNames.withoutArticles.dart );
shapeNameMap.set( NamedQuadrilateral.TRIANGLE, QuadrilateralStrings.a11y.voicing.shapeNames.withoutArticles.triangle );

// A map that goes from VertexLabel -> letter label (like "A")
const vertexLabelMap = new Map<VertexLabel, string>();
vertexLabelMap.set( VertexLabel.VERTEX_A, vertexAString );
vertexLabelMap.set( VertexLabel.VERTEX_B, vertexBString );
vertexLabelMap.set( VertexLabel.VERTEX_C, vertexCString );
vertexLabelMap.set( VertexLabel.VERTEX_D, vertexDString );

// A map that goes from Side -> full side label (like "Side AB")
const fullSideLabelMap = new Map<SideLabel, string>();
fullSideLabelMap.set( SideLabel.SIDE_AB, topSideString );
fullSideLabelMap.set( SideLabel.SIDE_BC, rightSideString );
fullSideLabelMap.set( SideLabel.SIDE_CD, bottomSideString );
fullSideLabelMap.set( SideLabel.SIDE_DA, leftSideString );

const sideLabelMap = new Map();
sideLabelMap.set( SideLabel.SIDE_AB, aBString );
sideLabelMap.set( SideLabel.SIDE_BC, bCString );
sideLabelMap.set( SideLabel.SIDE_CD, cDString );
sideLabelMap.set( SideLabel.SIDE_DA, dAString );

// Thresholds that are used to describe the size of the current shape. All are relative to the
// displayed grid and the area of a grid cell.
const GRID_CELL_AREA = Math.pow( QuadrilateralConstants.GRID_SPACING, 2 );
const TINY_THRESHOLD = GRID_CELL_AREA;
const VERY_SMALL_THRESHOLD = GRID_CELL_AREA * 4;
const SMALL_THRESHOLD = GRID_CELL_AREA * 24;
const MEDIUM_SIZED_THRESHOLD = GRID_CELL_AREA * 48;

class QuadrilateralDescriber {
  private readonly shapeModel: QuadrilateralShapeModel;
  private readonly shapeNameVisibleProperty: TReadOnlyProperty<boolean>;
  private readonly markersVisibleProperty: TReadOnlyProperty<boolean>;

  // The tolerance used to determine if a tilt has changed enough to describe it.
  public readonly tiltDifferenceToleranceInterval: number;
  public readonly lengthDifferenceToleranceInterval: number;

  public constructor( shapeModel: QuadrilateralShapeModel, shapeNameVisibleProperty: TReadOnlyProperty<boolean>, markersVisibleProperty: TReadOnlyProperty<boolean> ) {
    this.shapeModel = shapeModel;
    this.shapeNameVisibleProperty = shapeNameVisibleProperty;
    this.markersVisibleProperty = markersVisibleProperty;

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
    return QuadrilateralDescriber.getShapeNameWithArticlesDescription( shapeName );
  }

  /**
   * Returns the actual name of the NamedQuadrilateral, with an article before the name for english
   * phrases.
   */
  public static getShapeNameWithArticlesDescription( shapeName: NamedQuadrilateral | null ): string {
    const shapeNameDescription = shapeNameWithArticlesMap.get( shapeName );
    assert && assert( shapeNameDescription, 'There must be shape name description for the current shape state.' );
    return shapeNameDescription!;
  }

  /**
   * Get the shape name in isolation without any articles.
   */
  public static getShapeNameDescription( shapeName: NamedQuadrilateral ): string {
    const shapeNameDescription = shapeNameMap.get( shapeName );
    assert && assert( shapeNameDescription, 'There must be shape name description for the current shape state.' );
    return shapeNameDescription!;
  }

  /**
   * Gets the label string for a side from its SideLabel. Includes the Side title. Something like
   * "Side AB" or
   * "Side DA"
   */
  public static getFullSideLabelString( sideLabel: SideLabel ): string {
    const sideLabelString = fullSideLabelMap.get( sideLabel );
    assert && assert( sideLabelString, 'There must be a side label description.' );
    return sideLabelString!;
  }

  /**
   * Gets the label string for a side from its SideLabel. Just the label without other context like
   * "AB" or
   * "DA"
   */
  public static getSideLabelString( sideLabel: SideLabel ): string {
    const sideLabelString = sideLabelMap.get( sideLabel )!;
    assert && assert( sideLabelString, 'There must be a side label description.' );
    return sideLabelString;
  }

  /**
   * Gets a label string for the provided VertexLabel. Returns something like
   * "A" or
   * "B"
   */
  public static getVertexLabelString( vertexLabel: VertexLabel ): string {
    const vertexLabelString = vertexLabelMap.get( vertexLabel )!;
    assert && assert( vertexLabelString, 'There must be a label for the vertex.' );
    return vertexLabelString;
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
   * Returns a description of the shape size. Something like
   * "tiny" or
   * "small" or
   * "large"
   */
  public getSizeDescription(): string {
    let sizeDescriptionString: string;
    const area = this.shapeModel.areaProperty.value;
    if ( area < TINY_THRESHOLD ) {
      sizeDescriptionString = QuadrilateralStrings.a11y.voicing.sizes.tiny;
    }
    else if ( area < VERY_SMALL_THRESHOLD ) {
      sizeDescriptionString = QuadrilateralStrings.a11y.voicing.sizes.verySmall;
    }
    else if ( area < SMALL_THRESHOLD ) {
      sizeDescriptionString = QuadrilateralStrings.a11y.voicing.sizes.small;
    }
    else if ( area < MEDIUM_SIZED_THRESHOLD ) {
      sizeDescriptionString = QuadrilateralStrings.a11y.voicing.sizes.mediumSized;
    }
    else {
      sizeDescriptionString = QuadrilateralStrings.a11y.voicing.sizes.large;
    }

    return sizeDescriptionString;
  }

  /**
   * Returns the first details statement. Details are broken up into categorized statements. This first one
   * provides the current named shape and its size.
   */
  public getFirstDetailsStatement(): string {
    const sizeDescriptionString = this.getSizeDescription();
    if ( this.shapeNameVisibleProperty.value ) {
      return StringUtils.fillIn( youHaveASizedNamedShapePatternString, {
        size: sizeDescriptionString,
        shapeName: QuadrilateralDescriber.getShapeNameDescription( this.shapeModel.shapeNameProperty.value )
      } );
    }
    else {
      return StringUtils.fillIn( youHaveASizedShapePatternString, {
        size: sizeDescriptionString
      } );
    }
  }

  /**
   * Returns the second "details" statement. Details are broken up into three categorized statements. This one is a
   * summary about equal corner angles and equal side lengths. Will return something like
   * "Right now, opposite corners are equal and opposite sides are equal." or
   * "Right now, on pair of opposite corners are equal and opposite sides are equal" or
   * "Right now, no corners are equal and no sides are equal."
   */
  public getSecondDetailsStatement(): string {

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
   * Returns the third details statement. This is a qualitative description of the current shape, whithout including
   * the shape name.
   */
  public getThirdDetailsStatement(): string | null {
    const shapeName = this.shapeModel.shapeNameProperty.value;

    let description = null;
    if ( shapeName === NamedQuadrilateral.SQUARE ||
         shapeName === NamedQuadrilateral.RHOMBUS ||
         shapeName === NamedQuadrilateral.RECTANGLE ) {

      // these shapes skip the shape details because it is duplicated with other details content
      description = null;
    }
    else if ( shapeName === NamedQuadrilateral.PARALLELOGRAM ) {
      description = this.getParallelogramDetailsString();
    }
    else if ( shapeName === NamedQuadrilateral.ISOSCELES_TRAPEZOID ) {

      assert && assert( this.shapeModel.oppositeEqualSidePairsProperty.value.length === 1,
        'An Isosceles Trapezoid should have one pair of sides equal in length' );
      const oppositeEqualSidePair = this.shapeModel.oppositeEqualSidePairsProperty.value[ 0 ];

      assert && assert( this.shapeModel.parallelSidePairsProperty.value.length === 1,
        'A Trapezoid should have one parallel side pair.' );
      const parallelSidePair = this.shapeModel.parallelSidePairsProperty.value[ 0 ];

      description = this.getIsoscelesTrapezoidDetailsString(
        oppositeEqualSidePair,
        parallelSidePair
      );
    }
    else if ( shapeName === NamedQuadrilateral.TRAPEZOID ) {
      assert && assert( this.shapeModel.parallelSidePairsProperty.value.length === 1, 'A Trapezoid should have one parallel side pair' );
      const parallelSidePair = this.shapeModel.parallelSidePairsProperty.value[ 0 ];
      description = this.getTrapezoidDetailsString( parallelSidePair );
    }
    else if ( shapeName === NamedQuadrilateral.KITE ) {

      assert && assert( this.shapeModel.oppositeEqualVertexPairsProperty.value.length === 1,
        'A kite should have only one pair of opposite equal vertices' );
      const oppositeEqualVertexPair = this.shapeModel.oppositeEqualVertexPairsProperty.value[ 0 ];
      description = this.getKiteDetailsString( oppositeEqualVertexPair );
    }
    else if ( shapeName === NamedQuadrilateral.DART ) {
      description = this.getDartDetailsString();
    }
    else if ( shapeName === NamedQuadrilateral.CONCAVE_QUADRILATERAL ) {
      description = this.getConcaveQuadrilateralDetailsString();
    }
    else if ( shapeName === NamedQuadrilateral.CONVEX_QUADRILATERAL ) {
      description = this.getConvexQuadrilateralDetailsString();
    }
    else if ( shapeName === NamedQuadrilateral.TRIANGLE ) {
      description = this.getTriangleDetailsString();
    }

    return description;
  }

  /**
   * The fourth description of the "details" button in the Voicing toolbar. Returns a description of the longest and
   * shortest sides of the shape. Only returns a string if shape "markers" are displayed - otherwise this more
   * quantitative content is skipped.
   */
  public getFourthDetailsStatement(): null | string {
    let description: null | string = null;

    // This description is only included if markers are visible
    if ( !this.markersVisibleProperty.value ) {
      return description;
    }

    const longestSide = _.maxBy( this.shapeModel.sides, side => side.lengthProperty.value )!;
    const shortestSide = _.minBy( this.shapeModel.sides, side => side.lengthProperty.value )!;

    const longestSideDescription = SideDescriber.getSideUnitsDescription( longestSide.lengthProperty.value, this.shapeModel.shapeLengthToleranceIntervalProperty.value );
    const shortestSideDescription = SideDescriber.getSideUnitsDescription( shortestSide.lengthProperty.value, this.shapeModel.shapeLengthToleranceIntervalProperty.value );

    if ( this.shapeModel.allLengthsEqualProperty.value ) {

      // All sides the same length, combine into a shorter string
      description = StringUtils.fillIn( sidesDescriptionPatternString, {
        description: longestSideDescription
      } );
    }
    else {

      let longestSubString;
      let shortestSubString;
      if ( _.some( this.shapeModel.oppositeEqualSidePairsProperty.value, oppositeEqualSidePair => oppositeEqualSidePair.includesSide( longestSide ) ) ||
           _.some( this.shapeModel.adjacentEqualSidePairsProperty.value, adjacentEqualSidePair => adjacentEqualSidePair.includesSide( longestSide ) ) ) {

        // multiple sides of the same "longest" length, pluralize
        longestSubString = StringUtils.fillIn( longestSidesDescriptionPatternString, {
          description: longestSideDescription
        } );
      }
      else {
        longestSubString = StringUtils.fillIn( longestSideDescriptionPatternString, {
          description: longestSideDescription
        } );
      }

      if ( _.some( this.shapeModel.oppositeEqualSidePairsProperty.value, oppositeEqualSidePair => oppositeEqualSidePair.includesSide( shortestSide ) ) ||
           _.some( this.shapeModel.adjacentEqualSidePairsProperty.value, adjacentEqualSidePair => adjacentEqualSidePair.includesSide( shortestSide ) ) ) {

        // multiple sides of the same "longest" length, pluralize
        shortestSubString = StringUtils.fillIn( shortestSidesDescriptionPatternString, {
          description: shortestSideDescription
        } );
      }
      else {
        shortestSubString = StringUtils.fillIn( shortestSideDescriptionPatternString, {
          description: shortestSideDescription
        } );
      }

      description = StringUtils.fillIn( sideLengthDescriptionPatternString, {
        longest: longestSubString,
        shortest: shortestSubString
      } );
    }

    return description;
  }

  /**
   * For the details button, we are going to describe 'flat' angles as the number of slices as a special case because
   * in english it sounds nicer when combined with other details content.
   */
  private getDetailsSlicesDescription( angle: number ): string {
    let descriptionString;
    if ( this.shapeModel.isFlatAngle( angle ) ) {
      descriptionString = StringUtils.fillIn( numberOfSlicesPatternString, {
        numberOfSlices: 6
      } );
    }
    else {
      descriptionString = VertexDescriber.getSlicesDescription( angle, this.shapeModel );
    }

    return descriptionString;
  }

  /**
   * The fifth statement of the "details" button in the Voicing toolbar. Returns a description of the widest and
   * smallest angles of the shape. Only returns a string if corner guides are displayed - otherwise this more
   * quantitative content is skipped.
   */
  public getFifthDetailsStatement(): string | null {
    let description: null | string = null;

    if ( !this.markersVisibleProperty.value ) {
      return description;
    }
    else {
      const widestVertex = _.maxBy( this.shapeModel.vertices, vertex => vertex.angleProperty.value )!;
      const smallestVertex = _.minBy( this.shapeModel.vertices, vertex => vertex.angleProperty.value )!;

      const widestVertexDescription = this.getDetailsSlicesDescription( widestVertex.angleProperty.value! );
      const smallestVertexDescription = this.getDetailsSlicesDescription( smallestVertex.angleProperty.value! );

      if ( this.shapeModel.allAnglesRightProperty.value ) {

        // All corners the same angle, combine into a shorter string
        description = cornersRightDescriptionString;
      }
      else {

        let longestSubString;
        let shortestSubString;
        if ( _.some( this.shapeModel.oppositeEqualVertexPairsProperty.value, oppositeEQualVertexPair => oppositeEQualVertexPair.includesVertex( widestVertex ) ) ||
             _.some( this.shapeModel.adjacentEqualVertexPairsProperty.value, adjacentEqualVertexPair => adjacentEqualVertexPair.includesVertex( widestVertex ) ) ) {

          // multiple vertices of the same "widest" angle, pluralize
          longestSubString = StringUtils.fillIn( widestCornersDescriptionPatternString, {
            description: widestVertexDescription
          } );
        }
        else {
          longestSubString = StringUtils.fillIn( widestCornerDescriptionPatternString, {
            description: widestVertexDescription
          } );
        }

        if ( _.some( this.shapeModel.oppositeEqualVertexPairsProperty.value, oppositeEqualVertexPair => oppositeEqualVertexPair.includesVertex( smallestVertex ) ) ||
             _.some( this.shapeModel.adjacentEqualVertexPairsProperty.value, adjacentEqualVertexPair => adjacentEqualVertexPair.includesVertex( smallestVertex ) ) ) {

          // multiple sides of the same "longest" length, pluralize
          shortestSubString = StringUtils.fillIn( smallestCornersDescriptionPatternString, {
            description: smallestVertexDescription
          } );
        }
        else {
          shortestSubString = StringUtils.fillIn( smallestCornerDescriptionPatternString, {
            description: smallestVertexDescription
          } );
        }

        description = StringUtils.fillIn( cornersDescriptionPatternString, {
          longest: longestSubString,
          shortest: shortestSubString
        } );
      }

      return description;
    }
  }

  /**
   * Returns a qualitative description for a square.
   */
  public getSquareDetailsString(): string {
    return allRightAnglesAllSidesEqualString;
  }

  /**
   * Returns a qualitative deqcription for a rectangle.
   */
  public getRectangleDetailsString(): string {
    return allRightAnglesString;
  }

  /**
   * Returns a qualitative description for a rhombus.
   */
  public getRhombusDetailsString(): string {
    return allSidesEqualString;
  }

  /**
   * Returns a qualitative description for a parallelogram.
   */
  public getParallelogramDetailsString(): string {
    return oppositeSidesInParallelString;
  }

  /**
   * Returns a qualitative description for a trapezoid.
   */
  public getTrapezoidDetailsString( parallelSidePair: SidePair ): string {

    let firstSideLabel: string;
    let secondSideLabel: string;

    if ( parallelSidePair.includesSide( this.shapeModel.topSide ) ) {
      firstSideLabel = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_AB );
      secondSideLabel = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_CD );
    }
    else {
      firstSideLabel = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_BC );
      secondSideLabel = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_DA );
    }

    return StringUtils.fillIn( trapezoidDetailsPatternString, {
      firstSide: firstSideLabel,
      secondSide: secondSideLabel
    } );
  }

  /**
   * Returns a qualitative description for an isosceles trapezoid. Indicates which opposite/parallel side
   * pairs are equal.
   */
  public getIsoscelesTrapezoidDetailsString( oppositeEqualSidePair: SidePair, parallelSidePair: SidePair ): string {
    let equalFirstSideString: string;
    let equalSecondSideString: string;
    let parallelFirstSideString: string;
    let parallelSecondSideString: string;

    if ( oppositeEqualSidePair.includesSide( this.shapeModel.topSide ) ) {

      // top sides and bottom side are equal in length, left and right sides are parallel
      equalFirstSideString = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_AB );
      equalSecondSideString = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_CD );
      parallelFirstSideString = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_DA );
      parallelSecondSideString = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_BC );
    }
    else {

      // left and right sides are equal in length, top and bottom sides are parallel
      equalFirstSideString = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_DA );
      equalSecondSideString = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_BC );
      parallelFirstSideString = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_AB );
      parallelSecondSideString = QuadrilateralDescriber.getSideLabelString( SideLabel.SIDE_CD );
    }

    return StringUtils.fillIn( isoscelesTrapezoidDetailsPatternString, {
      equalFirstSide: equalFirstSideString,
      equalSecondSide: equalSecondSideString,
      parallelFirstSide: parallelFirstSideString,
      parallelSecondSide: parallelSecondSideString
    } );
  }

  /**
   * Returns a qualitative description for a kite.
   * @param oppositeEqualVertexPair
   * @param patternString - Some contexts need a more verbose description around this pattern. Must include placeholders
   *                        `firstCorner` and `secondCorner`.
   */
  public getKiteDetailsString( oppositeEqualVertexPair: VertexPair, patternString: string = kiteDetailsShortPatternString ): string {
    let firstCornerString: string;
    let secondCornerString: string;
    if ( oppositeEqualVertexPair.includesVertex( this.shapeModel.vertexA ) ) {

      // opposite equal vertices for the kite are A and C
      firstCornerString = QuadrilateralDescriber.getVertexLabelString( VertexLabel.VERTEX_A );
      secondCornerString = QuadrilateralDescriber.getVertexLabelString( VertexLabel.VERTEX_C );
    }
    else {
      firstCornerString = QuadrilateralDescriber.getVertexLabelString( VertexLabel.VERTEX_B );
      secondCornerString = QuadrilateralDescriber.getVertexLabelString( VertexLabel.VERTEX_D );
    }

    return StringUtils.fillIn( patternString, {
      firstCorner: firstCornerString,
      secondCorner: secondCornerString
    } );
  }

  /**
   * Returns a qualitative description for a dart.
   * @param patternString - Some contexts need a more verbose description around this pattern. Must include placeholders
   *                        `firstCorner` and `secondCorner`.
   */
  public getDartDetailsString( patternString: string = dartDetailsShortPatternString ): string {
    const concaveVertex = this.shapeModel.vertices.find( vertex => vertex.angleProperty.value! > Math.PI )!;
    assert && assert( concaveVertex, 'A dart has one vertex with angle greater than Math.PI.' );

    const inwardCornerLabel = concaveVertex.vertexLabel;

    // the vertices with equal angles for a dart will be the ones adjacent to the inward vertex
    let firstCornerLabel: VertexLabel;
    let secondCornerLabel: VertexLabel;
    if ( inwardCornerLabel === VertexLabel.VERTEX_A || inwardCornerLabel === VertexLabel.VERTEX_C ) {
      firstCornerLabel = VertexLabel.VERTEX_B;
      secondCornerLabel = VertexLabel.VERTEX_D;
    }
    else {
      firstCornerLabel = VertexLabel.VERTEX_A;
      secondCornerLabel = VertexLabel.VERTEX_C;
    }

    return StringUtils.fillIn( patternString, {
      inwardCorner: QuadrilateralDescriber.getVertexLabelString( inwardCornerLabel ),
      firstCorner: QuadrilateralDescriber.getVertexLabelString( firstCornerLabel ),
      secondCorner: QuadrilateralDescriber.getVertexLabelString( secondCornerLabel )
    } );
  }

  /**
   * Returns a qualitative description for a concave quadrilateral, describing which vertex is pointing in
   * toward the shape.
   */
  public getConcaveQuadrilateralDetailsString(): string {
    const concaveVertex = this.shapeModel.vertices.find( vertex => vertex.angleProperty.value! > Math.PI )!;
    assert && assert( concaveVertex, 'A convex quad has one vertex with angle greater than Math.PI.' );
    const inwardCornerLabel = concaveVertex.vertexLabel;

    return StringUtils.fillIn( concaveQuadrilateralDetailsPatternString, {
      inwardCorner: QuadrilateralDescriber.getVertexLabelString( inwardCornerLabel )
    } );
  }

  /**
   * Returns a qualitative description of the convex quadrilateral.
   */
  public getConvexQuadrilateralDetailsString(): string {
    return convexQuadrilateralDetailsString;
  }

  /**
   * Returns a qualitative description for a triangle, calling out which vertex looks "flat".
   */
  public getTriangleDetailsString(): string {

    const flatVertex = this.shapeModel.vertices.find(
      vertex => this.shapeModel.isStaticAngleEqualToOther( vertex.angleProperty.value!, Math.PI )
    )!;
    assert && assert( flatVertex, 'A triangle has one vertex with an angle equal to Math.PI.' );

    return StringUtils.fillIn( triangleDetailsPatternString, {
      flatCorner: QuadrilateralDescriber.getVertexLabelString( flatVertex.vertexLabel )
    } );
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

    const interAngleToleranceInterval = this.shapeModel.interAngleToleranceIntervalProperty.value;
    const shapeName = this.shapeModel.shapeNameProperty.value;
    const firstComparisonString = VertexDescriber.getAngleComparisonDescription( orderedOppositeVertexPairs[ 0 ].vertex2, orderedOppositeVertexPairs[ 0 ].vertex1, interAngleToleranceInterval, shapeName );
    const secondComparisonString = VertexDescriber.getAngleComparisonDescription( orderedOppositeVertexPairs[ 1 ].vertex2, orderedOppositeVertexPairs[ 1 ].vertex1, interAngleToleranceInterval, shapeName );

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
    const interLengthToleranceInterval = this.shapeModel.shapeLengthToleranceIntervalProperty.value;
    const firstComparisonString = SideDescriber.getLengthComparisonDescription( secondSide, firstSide, interLengthToleranceInterval );
    const secondComparisonString = SideDescriber.getLengthComparisonDescription( fourthSide, thirdSide, interLengthToleranceInterval );

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
    const toleranceInterval = this.shapeModel.shapeLengthToleranceIntervalProperty.value;
    const comparisonString = SideDescriber.getLengthComparisonDescription( orderedSidePairs[ 1 ].side1, orderedSidePairs[ 0 ].side1, toleranceInterval );

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
    const interAngleToleranceInterval = this.shapeModel.interAngleToleranceIntervalProperty.value;
    const shapeName = this.shapeModel.shapeNameProperty.value;
    const firstComparisonString = VertexDescriber.getAngleComparisonDescription( sortedUndescribedVertices[ 0 ], firstVertex, interAngleToleranceInterval, shapeName );
    const secondComparisonString = VertexDescriber.getAngleComparisonDescription( sortedUndescribedVertices[ 1 ], firstVertex, interAngleToleranceInterval, shapeName );

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
    const interToleranceInterval = this.shapeModel.interAngleToleranceIntervalProperty.value;
    const shapeName = this.shapeModel.shapeNameProperty.value;
    const comparisonString = VertexDescriber.getAngleComparisonDescription( orderedVertexPairs[ 1 ].vertex1, orderedVertexPairs[ 0 ].vertex1, interToleranceInterval, shapeName );

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
    const label = sideLabelMap.get( side.sideLabel )!;
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
      newVertexPairs.push( new VertexPair( orderedVertices[ 0 ], orderedVertices[ 1 ] ) );
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

      orderedSidePairs.push( new SidePair( firstSide, secondSide ) );
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

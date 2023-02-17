// Copyright 2021-2023, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import Vertex from '../model/Vertex.js';
import VertexLabel from '../model/VertexLabel.js';
import VertexDescriber from './VertexDescriber.js';
import SideDescriber from './SideDescriber.js';
import SideLabel from '../model/SideLabel.js';
import SidePair from '../model/SidePair.js';
import VertexPair from '../model/VertexPair.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import QuadrilateralConstants from '../../QuadrilateralConstants.js';
import ResponsePacket from '../../../../utterance-queue/js/ResponsePacket.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

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
const dartDetailsPatternString = QuadrilateralStrings.a11y.voicing.dartDetailsPattern;
const kiteDetailsPatternString = QuadrilateralStrings.a11y.voicing.kiteDetailsPattern;
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
const numberOfWedgesPatternString = QuadrilateralStrings.a11y.voicing.numberOfWedgesPattern;

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
const TINY_THRESHOLD = GRID_CELL_AREA * 4;
const VERY_SMALL_THRESHOLD = GRID_CELL_AREA * 12;
const SMALL_THRESHOLD = GRID_CELL_AREA * 24;
const MEDIUM_SIZED_THRESHOLD = GRID_CELL_AREA * 48;

class QuadrilateralDescriber {
  private readonly shapeModel: QuadrilateralShapeModel;
  private readonly shapeNameVisibleProperty: TReadOnlyProperty<boolean>;
  private readonly markersVisibleProperty: TReadOnlyProperty<boolean>;

  // The tolerance used to determine if a tilt has changed enough to describe it.
  public readonly tiltDifferenceToleranceInterval: number;
  public readonly lengthDifferenceToleranceInterval: number;

  public readonly sideABDescriber: SideDescriber;
  public readonly sideBCDescriber: SideDescriber;
  public readonly sideCDDescriber: SideDescriber;
  public readonly sideDADescriber: SideDescriber;
  private readonly sideDescribers: SideDescriber[];

  public readonly vertexADescriber: VertexDescriber;
  public readonly vertexBDescriber: VertexDescriber;
  public readonly vertexCDescriber: VertexDescriber;
  public readonly vertexDDescriber: VertexDescriber;

  public constructor( shapeModel: QuadrilateralShapeModel, shapeNameVisibleProperty: TReadOnlyProperty<boolean>, markersVisibleProperty: TReadOnlyProperty<boolean>, modelViewTransform: ModelViewTransform2 ) {
    this.shapeModel = shapeModel;
    this.shapeNameVisibleProperty = shapeNameVisibleProperty;
    this.markersVisibleProperty = markersVisibleProperty;

    // TODO: Do we need a query parameter for this?
    // TODO: CAn tilt be removed?
    this.tiltDifferenceToleranceInterval = 0.2;
    this.lengthDifferenceToleranceInterval = 0.05;

    this.sideABDescriber = new SideDescriber( shapeModel.topSide, shapeModel, markersVisibleProperty, modelViewTransform );
    this.sideBCDescriber = new SideDescriber( shapeModel.rightSide, shapeModel, markersVisibleProperty, modelViewTransform );
    this.sideCDDescriber = new SideDescriber( shapeModel.bottomSide, shapeModel, markersVisibleProperty, modelViewTransform );
    this.sideDADescriber = new SideDescriber( shapeModel.leftSide, shapeModel, markersVisibleProperty, modelViewTransform );
    this.sideDescribers = [ this.sideABDescriber, this.sideBCDescriber, this.sideCDDescriber, this.sideDADescriber ];

    this.vertexADescriber = new VertexDescriber( shapeModel.vertexA, shapeModel, markersVisibleProperty );
    this.vertexBDescriber = new VertexDescriber( shapeModel.vertexB, shapeModel, markersVisibleProperty );
    this.vertexCDescriber = new VertexDescriber( shapeModel.vertexC, shapeModel, markersVisibleProperty );
    this.vertexDDescriber = new VertexDescriber( shapeModel.vertexD, shapeModel, markersVisibleProperty );
  }

  /**
   * Return the VertexDescriber that can be used to describe a vertex of the provided VertexLabel.
   */
  public getVertexDescriberForLabel( vertexLabel: VertexLabel ): VertexDescriber {
    return vertexLabel === VertexLabel.VERTEX_A ? this.vertexADescriber :
           vertexLabel === VertexLabel.VERTEX_B ? this.vertexBDescriber :
           vertexLabel === VertexLabel.VERTEX_C ? this.vertexCDescriber :
           this.vertexDDescriber;
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

  public getCheckShapeDescription(): string {
    let description: string;
    if ( this.shapeNameVisibleProperty.value ) {
      description = this.getYouHaveAShapeDescription();
    }
    else {
      description = this.getShapePropertiesDescription();
    }

    return description;
  }

  public getShapePropertiesDescription(): string {
    let shapePropertiesDescription = '';

    const currentShapeName = this.shapeModel.shapeNameProperty.value;
    if ( currentShapeName === NamedQuadrilateral.SQUARE ) {
      shapePropertiesDescription = this.getSquareDetailsString();
    }
    else if ( currentShapeName === NamedQuadrilateral.RECTANGLE ) {
      shapePropertiesDescription = this.getRectangleDetailsString();
    }
    else if ( currentShapeName === NamedQuadrilateral.RHOMBUS ) {
      shapePropertiesDescription = this.getRhombusDetailsString();
    }
    else if ( currentShapeName === NamedQuadrilateral.PARALLELOGRAM ) {
      shapePropertiesDescription = this.getParallelogramDetailsString();
    }
    else if ( currentShapeName === NamedQuadrilateral.TRAPEZOID ) {
      assert && assert( this.shapeModel.parallelSidePairsProperty.value.length === 1, 'A Trapezoid should have one parallel side pair' );
      const parallelSidePair = this.shapeModel.parallelSidePairsProperty.value[ 0 ];
      shapePropertiesDescription = this.getTrapezoidDetailsString( parallelSidePair );
    }
    else if ( currentShapeName === NamedQuadrilateral.ISOSCELES_TRAPEZOID ) {
      assert && assert( this.shapeModel.oppositeEqualSidePairsProperty.value.length === 1,
        'An Isosceles Trapezoid should have one pair of sides equal in length' );
      const oppositeEqualSidePair = this.shapeModel.oppositeEqualSidePairsProperty.value[ 0 ];

      assert && assert( this.shapeModel.parallelSidePairsProperty.value.length === 1,
        'A Trapezoid should have one parallel side pair.' );
      const parallelSidePair = this.shapeModel.parallelSidePairsProperty.value[ 0 ];

      shapePropertiesDescription = this.getIsoscelesTrapezoidDetailsString(
        oppositeEqualSidePair,
        parallelSidePair
      );
    }
    else if ( currentShapeName === NamedQuadrilateral.KITE ) {
      assert && assert( this.shapeModel.oppositeEqualVertexPairsProperty.value.length === 1,
        'A kite should have only one pair of opposite equal vertices' );
      const oppositeEqualVertexPair = this.shapeModel.oppositeEqualVertexPairsProperty.value[ 0 ];
      shapePropertiesDescription = this.getKiteDetailsString( oppositeEqualVertexPair, kiteDetailsPatternString );
    }
    else if ( currentShapeName === NamedQuadrilateral.DART ) {
      shapePropertiesDescription = this.getDartDetailsString( dartDetailsPatternString );
    }
    else if ( currentShapeName === NamedQuadrilateral.CONCAVE_QUADRILATERAL ) {
      shapePropertiesDescription = this.getConcaveQuadrilateralDetailsString();
    }
    else if ( currentShapeName === NamedQuadrilateral.CONVEX_QUADRILATERAL ) {
      shapePropertiesDescription = this.getConvexQuadrilateralDetailsString();
    }
    else if ( currentShapeName === NamedQuadrilateral.TRIANGLE ) {
      shapePropertiesDescription = this.getTriangleDetailsString();
    }

    assert && assert( shapePropertiesDescription !== '', 'Could not find shapePropertiesDescription for shape.' );
    return shapePropertiesDescription;
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

      angleEqualityString = adjacentEqualVertexPairs.length === 1 && this.shapeModel.isInterAngleEqualToOther( adjacentEqualVertexPairs[ 0 ].vertex1.angleProperty.value!, Math.PI / 2 ) ? rightAnglesString :
                            oppositeEqualVertexPairs.length === 1 && this.shapeModel.isInterAngleEqualToOther( oppositeEqualVertexPairs[ 0 ].vertex1.angleProperty.value!, Math.PI / 2 ) ? rightAnglesString :
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

    const longestSideDescriber = _.maxBy( this.sideDescribers, sideDescriber => sideDescriber.side.lengthProperty.value )!;
    const shortestSideDescriber = _.minBy( this.sideDescribers, sideDescriber => sideDescriber.side.lengthProperty.value )!;
    const longestSide = _.maxBy( this.shapeModel.sides, side => side.lengthProperty.value )!;
    const shortestSide = _.minBy( this.shapeModel.sides, side => side.lengthProperty.value )!;

    const longestSideDescription = longestSideDescriber.getSideUnitsDescription();
    const shortestSideDescription = shortestSideDescriber.getSideUnitsDescription();

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
   * For the details button, we are going to describe 'flat' angles as the number of wedges as a special case because
   * in english it sounds nicer when combined with other details content.
   */
  private getDetailsWedgesDescription( angle: number ): string {
    let descriptionString;
    if ( this.shapeModel.isFlatAngle( angle ) ) {
      descriptionString = StringUtils.fillIn( numberOfWedgesPatternString, {
        numberOfWedges: 6
      } );
    }
    else {
      descriptionString = VertexDescriber.getWedgesDescription( angle, this.shapeModel );
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

      const widestVertexDescription = this.getDetailsWedgesDescription( widestVertex.angleProperty.value! );
      const smallestVertexDescription = this.getDetailsWedgesDescription( smallestVertex.angleProperty.value! );

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

  /**
   * Returns a ResponsePacket with the content for responses that should happen when the shape (and only the shape)
   * is reset.
   */
  public static readonly RESET_SHAPE_RESPONSE_PACKET = new ResponsePacket( {
    nameResponse: QuadrilateralStrings.resetShape,
    contextResponse: QuadrilateralStrings.a11y.voicing.resetShape.contextResponse
  } );
}

quadrilateral.register( 'QuadrilateralDescriber', QuadrilateralDescriber );
export default QuadrilateralDescriber;

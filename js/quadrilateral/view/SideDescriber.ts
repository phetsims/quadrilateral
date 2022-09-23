// Copyright 2022, University of Colorado Boulder

/**
 * Responsible for generating descriptions related to Sides.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import Side from '../model/Side.js';
import Range from '../../../../dot/js/Range.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

// constants
const farShorterThanString = QuadrilateralStrings.a11y.voicing.farShorterThan;
const muchMuchShorterThanString = QuadrilateralStrings.a11y.voicing.muchMuchShorterThan;
const aboutHalfAsLongAsString = QuadrilateralStrings.a11y.voicing.aboutHalfAsLongAs;
const muchShorterThanString = QuadrilateralStrings.a11y.voicing.muchShorterThan;
const somewhatShorterThanString = QuadrilateralStrings.a11y.voicing.somewhatShorterThan;
const similarButShorterThanString = QuadrilateralStrings.a11y.voicing.similarButShorterThan;
const similarButLongerThanString = QuadrilateralStrings.a11y.voicing.similarButLongerThan;
const somewhatLongerThanString = QuadrilateralStrings.a11y.voicing.somewhatLongerThan;
const muchLongerThanString = QuadrilateralStrings.a11y.voicing.muchLongerThan;
const aboutTwiceAsLongAsString = QuadrilateralStrings.a11y.voicing.aboutTwiceAsLongAs;
const muchMuchLongerThanString = QuadrilateralStrings.a11y.voicing.muchMuchLongerThan;
const farLongerThanString = QuadrilateralStrings.a11y.voicing.farLongerThan;
const equalToString = QuadrilateralStrings.a11y.voicing.equalTo;
const parallelSideObjectResponsePatternString = QuadrilateralStrings.a11y.voicing.parallelSideObjectResponsePattern;
const sideObjectResponsePatternString = QuadrilateralStrings.a11y.voicing.sideObjectResponsePattern;
const equalToAdjacentSidesString = QuadrilateralStrings.a11y.voicing.equalToAdjacentSides;
const equalToOneAdjacentSideString = QuadrilateralStrings.a11y.voicing.equalToOneAdjacentSide;
const equalAdjacentSidesPatternString = QuadrilateralStrings.a11y.voicing.equalAdjacentSidesPattern;
const equalAdjacentParallelSidesPatternString = QuadrilateralStrings.a11y.voicing.equalAdjacentParallelSidesPattern;
const shorterThanAdjacentSidesString = QuadrilateralStrings.a11y.voicing.shorterThanAdjacentSides;
const longerThanAdjacentSidesString = QuadrilateralStrings.a11y.voicing.longerThanAdjacentSides;
const notEqualToAdjacentSidesString = QuadrilateralStrings.a11y.voicing.notEqualToAdjacentSides;
const shorterThanParallelAdjacentSidesString = QuadrilateralStrings.a11y.voicing.shorterThanParallelAdjacentSides;
const longerThanParallelAdjacentSidesString = QuadrilateralStrings.a11y.voicing.longerThanParallelAdjacentSides;
const notEqualToParallelAdjacentSidesString = QuadrilateralStrings.a11y.voicing.notEqualToParallelAdjacentSides;

// A map that will provide comparison descriptions for side lengths. Range values are the ratio between lengths
// between the sides.
const lengthComparisonDescriptionMap = new Map<Range, string>();
lengthComparisonDescriptionMap.set( new Range( 0, 0.2 ), farShorterThanString );
lengthComparisonDescriptionMap.set( new Range( 0.2, 0.4 ), muchMuchShorterThanString );
lengthComparisonDescriptionMap.set( new Range( 0.4, 0.6 ), aboutHalfAsLongAsString );
lengthComparisonDescriptionMap.set( new Range( 0.6, 0.7 ), muchShorterThanString );
lengthComparisonDescriptionMap.set( new Range( 0.7, 0.9 ), somewhatShorterThanString );
lengthComparisonDescriptionMap.set( new Range( 0.9, 1 ), similarButShorterThanString );
lengthComparisonDescriptionMap.set( new Range( 1, 1.2 ), similarButLongerThanString );
lengthComparisonDescriptionMap.set( new Range( 1.2, 1.5 ), somewhatLongerThanString );
lengthComparisonDescriptionMap.set( new Range( 1.5, 1.8 ), muchLongerThanString );
lengthComparisonDescriptionMap.set( new Range( 1.8, 2.2 ), aboutTwiceAsLongAsString );
lengthComparisonDescriptionMap.set( new Range( 2.2, 2.6 ), muchMuchLongerThanString );
lengthComparisonDescriptionMap.set( new Range( 2.6, Number.POSITIVE_INFINITY ), farLongerThanString );

class SideDescriber {

  // References to model components that will drive the descriptions.
  private side: Side;
  private quadrilateralShapeModel: QuadrilateralShapeModel;
  private modelViewTransform: ModelViewTransform2;

  public constructor( side: Side, quadrilateralShapeModel: QuadrilateralShapeModel, modelViewTransform: ModelViewTransform2 ) {
    this.side = side;
    this.quadrilateralShapeModel = quadrilateralShapeModel;
    this.modelViewTransform = modelViewTransform;
  }

  /**
   * Returns the Object response for the Side for Voicing. Returns something like
   *
   * "equal to opposite side, equal to adjacent sides." or
   * "parallel to and a little longer than opposite, shorter than adjacent sides"
   */
  public getSideObjectResponse(): string {
    let response = '';
    const oppositeSide = this.quadrilateralShapeModel.oppositeSideMap.get( this.side )!;

    const parallelSidePairs = this.quadrilateralShapeModel.parallelSidePairsProperty.value;
    const thisSideIsParallel = _.some( parallelSidePairs, sidePair => sidePair.side1 === this.side || sidePair.side2 === this.side );

    const patternString = thisSideIsParallel ?
                          parallelSideObjectResponsePatternString :
                          sideObjectResponsePatternString;

    // If the quadrilateral is a rhombus or a square, always describe that the opposite side is equal in length to the
    // other. This may not happen naturally by comparing side lengths because a rhombus and square may be detected
    // when sides are not perfectly equal due to the angle tolerance interval.
    const shapeName = this.quadrilateralShapeModel.shapeNameProperty.value;
    const toleranceInterval = this.quadrilateralShapeModel.shapeLengthToleranceIntervalProperty.value;
    const oppositeComparison = shapeName === NamedQuadrilateral.SQUARE || shapeName === NamedQuadrilateral.RHOMBUS ?
                               equalToString : SideDescriber.getLengthComparisonDescription( oppositeSide, this.side, toleranceInterval );

    response = StringUtils.fillIn( patternString, {
      oppositeComparison: oppositeComparison,
      adjacentSideDescription: this.getAdjacentSideDescription()
    } );

    return response;
  }

  /**
   * Get a description of the adjacent sides and how this side compares to them in length. Also includes information
   * about them if they are parallel. Used for the Object response of this vertex. Will return something like
   *
   * "much smaller than adjacent equal sides" or
   * "equal to adjacent sides" or
   * "not equal to parallel adjacent sides"
   */
  private getAdjacentSideDescription(): string {
    let description = '';

    const adjacentSides = this.quadrilateralShapeModel.adjacentSideMap.get( this.side )!;
    const adjacentSidesEqual = this.quadrilateralShapeModel.isShapeLengthEqualToOther(
      adjacentSides[ 0 ].lengthProperty.value,
      adjacentSides[ 1 ].lengthProperty.value
    );

    let numberOfEqualAdjacentSidePairs = 0;
    const adjacentSidePairs = this.quadrilateralShapeModel.adjacentEqualSidePairsProperty.value;
    adjacentSidePairs.forEach( sidePair => {
      if ( sidePair.side1 === this.side || sidePair.side2 === this.side ) {
        numberOfEqualAdjacentSidePairs++;
      }
    } );

    const parallelSideChecker = _.find( this.quadrilateralShapeModel.parallelSideCheckers, checker => {
      return checker.side1 === adjacentSides[ 0 ] || checker.side1 === adjacentSides[ 1 ];
    } );
    assert && assert( parallelSideChecker, 'did not find ParallelSideChecker' );
    const adjacentSidesParallel = parallelSideChecker!.areSidesParallel();

    if ( numberOfEqualAdjacentSidePairs === 2 ) {

      // This side and both adjacent sides are all equal
      if ( adjacentSidesParallel ) {
        description = 'equal to parallel adjacent sides';
      }
      else {
        description = equalToAdjacentSidesString;
      }
    }
    else if ( numberOfEqualAdjacentSidePairs === 1 ) {

      // Just one 'equal' side, that is all we need to describe
      description = equalToOneAdjacentSideString;
    }
    else if ( adjacentSidesEqual ) {

      const patternString = adjacentSidesParallel ? equalAdjacentParallelSidesPatternString : equalAdjacentSidesPatternString;

      // the adjacent sides are equal in length but not equal to this side, describe the length of
      // this side relative to the other sides but we can use either side since they are equal in length
      const toleranceInterval = this.quadrilateralShapeModel.shapeLengthToleranceIntervalProperty.value;
      description = StringUtils.fillIn( patternString, {
        comparison: SideDescriber.getLengthComparisonDescription( adjacentSides[ 0 ], this.side, toleranceInterval )
      } );
    }
    else {

      // None of this side or adjacent sides are equal. Describe how this side is shorter than both, longer
      // than both, or simply equal to neither.
      const sideLength = this.side.lengthProperty.value;
      const firstAdjacentLength = adjacentSides[ 0 ].lengthProperty.value;
      const secondAdjacentLength = adjacentSides[ 1 ].lengthProperty.value;
      if ( firstAdjacentLength > sideLength && secondAdjacentLength > sideLength ) {
        description = adjacentSidesParallel ? shorterThanParallelAdjacentSidesString : shorterThanAdjacentSidesString;
      }
      else if ( firstAdjacentLength < sideLength && secondAdjacentLength < sideLength ) {
        description = adjacentSidesParallel ? longerThanParallelAdjacentSidesString : longerThanAdjacentSidesString;
      }
      else {
        description = adjacentSidesParallel ? notEqualToParallelAdjacentSidesString : notEqualToAdjacentSidesString;
      }
    }

    return description;
  }

  /**
   * Returns a description of comparison between two sides, using entries of lengthComparisonDescriptionMap.
   * Description compares side2 to side1. For example, if side2 is longer than side1 the output will be something
   * like:
   * "SideAB is much longer than sideCD."
   */
  public static getLengthComparisonDescription( side1: Side, side2: Side, interLengthToleranceInterval: number ): string {
    let description: string | null = null;

    const length1 = side1.lengthProperty.value;
    const length2 = side2.lengthProperty.value;

    if ( QuadrilateralShapeModel.isInterLengthEqualToOther( length1, length2, interLengthToleranceInterval ) ) {
      description = equalToString;
    }

    const lengthRatio = length2 / length1;
    if ( description === null ) {
      lengthComparisonDescriptionMap.forEach( ( value, key ) => {
        if ( key.contains( lengthRatio ) ) {
          description = value;
        }
      } );
    }

    assert && assert( description, `Length comparison description not found for length ratio: ${lengthRatio}` );
    return description!;
  }
}

quadrilateral.register( 'SideDescriber', SideDescriber );
export default SideDescriber;

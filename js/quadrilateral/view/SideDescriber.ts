// Copyright 2022-2023, University of Colorado Boulder

/**
 * Responsible for generating descriptions related to Sides.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralSide from '../model/QuadrilateralSide.js';
import Range from '../../../../dot/js/Range.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// constants
const farShorterThanString = QuadrilateralStrings.a11y.voicing.farShorterThan;
const aboutHalfAsLongAsString = QuadrilateralStrings.a11y.voicing.aboutHalfAsLongAs;
const aLittleShorterThanString = QuadrilateralStrings.a11y.voicing.aLittleShorterThan;
const muchShorterThanString = QuadrilateralStrings.a11y.voicing.muchShorterThan;
const similarButShorterThanString = QuadrilateralStrings.a11y.voicing.similarButShorterThan;
const similarButLongerThanString = QuadrilateralStrings.a11y.voicing.similarButLongerThan;
const aLittleLongerThanString = QuadrilateralStrings.a11y.voicing.aLittleLongerThan;
const muchLongerThanString = QuadrilateralStrings.a11y.voicing.muchLongerThan;
const aboutTwiceAsLongAsString = QuadrilateralStrings.a11y.voicing.aboutTwiceAsLongAs;
const farLongerThanString = QuadrilateralStrings.a11y.voicing.farLongerThan;
const equalToString = QuadrilateralStrings.a11y.voicing.equalTo;
const twiceAsLongAsString = QuadrilateralStrings.a11y.voicing.twiceAsLongAs;
const halfAsLongAsString = QuadrilateralStrings.a11y.voicing.halfAsLongAs;
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
const oneUnitString = QuadrilateralStrings.a11y.voicing.oneUnit;
const numberOfUnitsPatternString = QuadrilateralStrings.a11y.voicing.numberOfUnitsPattern;
const numberOfUnitsAndAHalfPatternString = QuadrilateralStrings.a11y.voicing.numberOfUnitsAndAHalfPattern;
const sideUnitsObjectResponsePatternString = QuadrilateralStrings.a11y.voicing.sideUnitsObjectResponsePattern;
const oneQuarterUnitString = QuadrilateralStrings.a11y.voicing.oneQuarterUnit;
const numberAndOneQuarterUnitsPatternString = QuadrilateralStrings.a11y.voicing.numberAndOneQuarterUnitsPattern;
const threeQuarterUnitsString = QuadrilateralStrings.a11y.voicing.threeQuarterUnits;
const numberAndThreeQuarterUnitsPatternString = QuadrilateralStrings.a11y.voicing.numberAndThreeQuarterUnitsPattern;
const aboutOneUnitString = QuadrilateralStrings.a11y.voicing.aboutOneUnit;
const aboutNumberUnitsPatternString = QuadrilateralStrings.a11y.voicing.aboutNumberUnitsPattern;
const aboutOneHalfUnitsString = QuadrilateralStrings.a11y.voicing.aboutOneHalfUnits;
const aboutNumberAndAHalfUnitsPatternString = QuadrilateralStrings.a11y.voicing.aboutNumberAndAHalfUnitsPattern;
const aboutNumberQuarterUnitsPatternString = QuadrilateralStrings.a11y.voicing.aboutNumberQuarterUnitsPattern;
const aboutFullNumberAndNumberQuarterUnitsPatternString = QuadrilateralStrings.a11y.voicing.aboutFullNumberAndNumberQuarterUnitsPattern;
const oneHalfUnitsString = QuadrilateralStrings.a11y.voicing.oneHalfUnits;

// A map that will provide comparison descriptions for side lengths. Range values are the ratio between lengths
// of different sides.
const LENGTH_COMPARISON_DESCRIPTION_MAP = new Map<Range, string>();
LENGTH_COMPARISON_DESCRIPTION_MAP.set( new Range( 0, 0.1 ), farShorterThanString );
LENGTH_COMPARISON_DESCRIPTION_MAP.set( new Range( 0.1, 0.4 ), muchShorterThanString );
LENGTH_COMPARISON_DESCRIPTION_MAP.set( new Range( 0.4, 0.6 ), aboutHalfAsLongAsString );
LENGTH_COMPARISON_DESCRIPTION_MAP.set( new Range( 0.6, 0.8 ), aLittleShorterThanString );
LENGTH_COMPARISON_DESCRIPTION_MAP.set( new Range( 0.8, 1 ), similarButShorterThanString );
LENGTH_COMPARISON_DESCRIPTION_MAP.set( new Range( 1, 1.3 ), similarButLongerThanString );
LENGTH_COMPARISON_DESCRIPTION_MAP.set( new Range( 1.3, 1.6 ), aLittleLongerThanString );
LENGTH_COMPARISON_DESCRIPTION_MAP.set( new Range( 1.6, 1.8 ), muchLongerThanString );
LENGTH_COMPARISON_DESCRIPTION_MAP.set( new Range( 1.8, 2.2 ), aboutTwiceAsLongAsString );
LENGTH_COMPARISON_DESCRIPTION_MAP.set( new Range( 2.2, Number.POSITIVE_INFINITY ), farLongerThanString );

export default class SideDescriber {
  public readonly side: QuadrilateralSide;
  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly markersVisibleProperty: TReadOnlyProperty<boolean>;

  public constructor( side: QuadrilateralSide, quadrilateralShapeModel: QuadrilateralShapeModel, markersVisibleProperty: TReadOnlyProperty<boolean>, modelViewTransform: ModelViewTransform2 ) {
    this.side = side;
    this.quadrilateralShapeModel = quadrilateralShapeModel;
    this.modelViewTransform = modelViewTransform;
    this.markersVisibleProperty = markersVisibleProperty;
  }

  /**
   * Returns the Object response for the QuadrilateralSide for Voicing. Returns something like
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
    const oppositeComparison = shapeName === NamedQuadrilateral.SQUARE || shapeName === NamedQuadrilateral.RHOMBUS ?
                               equalToString : this.getLengthComparisonDescription( oppositeSide );

    response = StringUtils.fillIn( patternString, {
      oppositeComparison: oppositeComparison,
      adjacentSideDescription: this.getAdjacentSideDescription()
    } );

    // if 'markers' are visible describe the side length units by appending that information to the object response
    if ( this.markersVisibleProperty.value ) {
      const unitsDescription = this.getSideUnitsDescription();
      response = StringUtils.fillIn( sideUnitsObjectResponsePatternString, {
        unitsDescription: unitsDescription,
        objectResponse: response
      } );
    }

    return response;
  }

  /**
   * Returns a description of the number of length units for this side. Returns something like
   *
   * "1 unit" or
   * "just over 3 units" or
   * "2 and a half units" or
   * "2 and a quarter units" or
   * "2 and three-quarter units".
   */
  public getSideUnitsDescription(): string {

    // REVIEW: The "multiple returns" idea will help so much here
    let sideDescription: string | null = null;

    const shapeModel = this.quadrilateralShapeModel;
    const sideLength = this.side.lengthProperty.value;

    const numberOfFullUnits = Math.floor( sideLength / QuadrilateralSide.SIDE_SEGMENT_LENGTH );
    const remainder = sideLength % QuadrilateralSide.SIDE_SEGMENT_LENGTH;

    if ( shapeModel.isInterLengthEqualToOther( remainder, 0 ) ) {
      if ( numberOfFullUnits === 1 ) {

        // "one unit"
        sideDescription = oneUnitString;
      }
      else {

        // "3 units"
        sideDescription = StringUtils.fillIn( numberOfUnitsPatternString, {
          numberOfUnits: numberOfFullUnits
        } );
      }
    }
    else if ( shapeModel.isInterLengthEqualToOther( remainder, QuadrilateralSide.SIDE_SEGMENT_LENGTH / 2 ) ) {
      if ( numberOfFullUnits === 0 ) {
        sideDescription = oneHalfUnitsString;
      }
      else {

        // three and a half units
        sideDescription = StringUtils.fillIn( numberOfUnitsAndAHalfPatternString, {
          numberOfUnits: numberOfFullUnits
        } );
      }
    }
    else if ( shapeModel.isInterLengthEqualToOther( remainder, QuadrilateralSide.SIDE_SEGMENT_LENGTH / 4 ) ) {
      if ( numberOfFullUnits === 0 ) {

        // "one quarter units"
        sideDescription = oneQuarterUnitString;
      }
      else {

        // 2 and three-quarter units
        sideDescription = StringUtils.fillIn( numberAndOneQuarterUnitsPatternString, {
          fullNumber: numberOfFullUnits
        } );
      }
    }
    else if ( shapeModel.isInterLengthEqualToOther( remainder, 3 * QuadrilateralSide.SIDE_SEGMENT_LENGTH / 4 ) ) {
      if ( numberOfFullUnits === 0 ) {

        // "one quarter units"
        sideDescription = threeQuarterUnitsString;
      }
      else {

        // 2 and three-quarter units
        sideDescription = StringUtils.fillIn( numberAndThreeQuarterUnitsPatternString, {
          fullNumber: numberOfFullUnits
        } );
      }
    }
    else {

      const numberOfQuarterUnits = Math.ceil( ( sideLength / QuadrilateralSide.SIDE_SEGMENT_LENGTH ) * 4 );
      const numberOfExtraCornerUnits = numberOfQuarterUnits % 4;
      if ( numberOfExtraCornerUnits === 0 ) {
        if ( numberOfFullUnits === 0 ) {
          sideDescription = aboutOneUnitString;
        }
        else {
          // about 3 units (just under, currently)
          sideDescription = StringUtils.fillIn( aboutNumberUnitsPatternString, {
            number: numberOfFullUnits + 1
          } );
        }
      }
      else if ( numberOfExtraCornerUnits === 2 ) {
        if ( numberOfFullUnits === 0 ) {
          // about one-half units
          sideDescription = aboutOneHalfUnitsString;
        }
        else {
          // about 1 and a half units
          sideDescription = StringUtils.fillIn( aboutNumberAndAHalfUnitsPatternString, {
            number: numberOfFullUnits
          } );
        }
      }
      else {

        if ( numberOfFullUnits === 0 ) {

          // about three-quarter units
          // about one-quarter units
          sideDescription = StringUtils.fillIn( aboutNumberQuarterUnitsPatternString, {
            number: numberOfExtraCornerUnits
          } );
        }
        else {

          // about 2 and one quarter units
          // about 3 and three-quarter units
          sideDescription = StringUtils.fillIn( aboutFullNumberAndNumberQuarterUnitsPatternString, {
            fullNumber: numberOfFullUnits,
            number: numberOfExtraCornerUnits
          } );
        }
      }
    }

    return sideDescription;
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
    const adjacentSidesEqual = this.quadrilateralShapeModel.isInterLengthEqualToOther(
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
      description = StringUtils.fillIn( patternString, {
        comparison: this.getLengthComparisonDescription( adjacentSides[ 0 ] )
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
   * Returns a description of comparison between two sides, using entries of LENGTH_COMPARISON_DESCRIPTION_MAP.
   * Description compares this side to otherSide. For example, if this side (SideAB) is longer than (sideCD) the output
   * will be something like:
   * "SideAB is much longer than sideCD."
   */
  private getLengthComparisonDescription( otherSide: QuadrilateralSide ): string {
    let description: string | null = null;

    const shapeModel = this.quadrilateralShapeModel;

    const length1 = this.side.lengthProperty.value;
    const length2 = otherSide.lengthProperty.value;

    if ( shapeModel.isInterLengthEqualToOther( length1, length2 ) ) {
      description = equalToString;
    }
    else if ( shapeModel.isInterLengthEqualToOther( length1, length2 * 2 ) ) {
      description = twiceAsLongAsString;
    }
    else if ( shapeModel.isInterLengthEqualToOther( length1, length2 / 2 ) ) {
      description = halfAsLongAsString;
    }

    const lengthRatio = length1 / length2;
    if ( description === null ) {
      LENGTH_COMPARISON_DESCRIPTION_MAP.forEach( ( value, key ) => {
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

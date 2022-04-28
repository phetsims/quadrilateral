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
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';

// constants
const farLongerThanString = quadrilateralStrings.a11y.voicing.farLongerThan;
const farShorterThanString = quadrilateralStrings.a11y.voicing.farShorterThan;
const muchMuchLongerThanString = quadrilateralStrings.a11y.voicing.muchMuchLongerThan;
const muchMuchShorterThanString = quadrilateralStrings.a11y.voicing.muchMuchShorterThan;
const muchLongerThanString = quadrilateralStrings.a11y.voicing.muchLongerThan;
const muchShorterThanString = quadrilateralStrings.a11y.voicing.muchShorterThan;
const somewhatLongerThanString = quadrilateralStrings.a11y.voicing.somewhatLongerThan;
const somewhatShorterThanString = quadrilateralStrings.a11y.voicing.somewhatShorterThan;
const aLittleLongerThanString = quadrilateralStrings.a11y.voicing.aLittleLongerThan;
const aLittleShorterThanString = quadrilateralStrings.a11y.voicing.aLittleShorterThan;
const comparableToString = quadrilateralStrings.a11y.voicing.comparableTo;
const equalToString = quadrilateralStrings.a11y.voicing.equalTo;
const parallelSideObjectResponsePatternString = quadrilateralStrings.a11y.voicing.parallelSideObjectResponsePattern;
const sideObjectResponsePatternString = quadrilateralStrings.a11y.voicing.sideObjectResponsePattern;
const equalToAdjacentSidesString = quadrilateralStrings.a11y.voicing.equalToAdjacentSides;
const equalToOneAdjacentSideString = quadrilateralStrings.a11y.voicing.equalToOneAdjacentSide;
const equalAdjacentSidesPatternString = quadrilateralStrings.a11y.voicing.equalAdjacentSidesPattern;
const shorterThanAdjacentSidesString = quadrilateralStrings.a11y.voicing.shorterThanAdjacentSides;
const longerThanAdjacentSidesString = quadrilateralStrings.a11y.voicing.longerThanAdjacentSides;
const notEqualToAdjacentSidesString = quadrilateralStrings.a11y.voicing.notEqualToAdjacentSides;

// A map that will provide comparison descriptions for side lengths. Lengths in model units.
const lengthComparisonDescriptionMap = new Map<Range, string>();

// Populate entries of the lengthComparisonDescriptionMap - They are symmetric in that ranges for "longer" strings
// have the same ranges as the "shorter" strings with values inverted. Lengths for this function are provided in the
// number of segments, since that is how it is described in the design doc. That is converted to model units for
// the map.
const createLengthComparisonMapEntry = ( minSegments: number, maxSegments: number, longerString: string, shorterString: string ) => {
  const minLength = minSegments * Side.SIDE_SEGMENT_LENGTH;
  const maxLength = maxSegments * Side.SIDE_SEGMENT_LENGTH;
  lengthComparisonDescriptionMap.set( new Range( minLength, maxLength ), longerString );
  lengthComparisonDescriptionMap.set( new Range( -maxLength, -minLength ), shorterString );
};

createLengthComparisonMapEntry( 6, Number.POSITIVE_INFINITY, farLongerThanString, farShorterThanString );
createLengthComparisonMapEntry( 4.5, 6, muchMuchLongerThanString, muchMuchShorterThanString );
createLengthComparisonMapEntry( 3, 4.5, muchLongerThanString, muchShorterThanString );
createLengthComparisonMapEntry( 1.5, 3, somewhatLongerThanString, somewhatShorterThanString );
createLengthComparisonMapEntry( 0.5, 1.5, aLittleLongerThanString, aLittleShorterThanString );
createLengthComparisonMapEntry( QuadrilateralQueryParameters.shapeLengthToleranceInterval, 0.5, comparableToString, comparableToString );
createLengthComparisonMapEntry( 0, QuadrilateralQueryParameters.shapeLengthToleranceInterval, equalToString, equalToString );

class SideDescriber {

  // References to model components that will drive the descriptions.
  private side: Side;
  private quadrilateralShapeModel: QuadrilateralShapeModel;

  constructor( side: Side, quadrilateralShapeModel: QuadrilateralShapeModel ) {
    this.side = side;
    this.quadrilateralShapeModel = quadrilateralShapeModel;
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

    response = StringUtils.fillIn( patternString, {
      oppositeComparison: SideDescriber.getLengthComparisonDescription( oppositeSide, this.side ),
      adjacentSideDescription: this.getAdjacentSideDescription()
    } );

    return response;
  }

  /**
   * Get a description of the adjacent sides and how this side compares to them in length. Used for the
   * Object response of this vertex. Will return something like
   *
   * "much smaller than adjacent equal sides" or
   * "equal to adjacent sides"
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

    if ( numberOfEqualAdjacentSidePairs === 2 ) {

      // This side and both adjacent sides are all equal
      description = equalToAdjacentSidesString;
    }
    else if ( numberOfEqualAdjacentSidePairs === 1 ) {

      // Just one 'equal' side, that is all we need to describe
      description = equalToOneAdjacentSideString;
    }
    else if ( adjacentSidesEqual ) {

      // the adjacent sides are equal in length but not equal to this side, describe the length of
      // this side relative to the other sides but we can use either side since they are equal in length
      description = StringUtils.fillIn( equalAdjacentSidesPatternString, {
        comparison: SideDescriber.getLengthComparisonDescription( adjacentSides[ 0 ], this.side )
      } );
    }
    else {

      // None of this side or adjacent sides are equal. Describe how this side is shorter than both, longer
      // than both, or simply equal to neither.
      const sideLength = this.side.lengthProperty.value;
      const firstAdjacentLength = adjacentSides[ 0 ].lengthProperty.value;
      const secondAdjacentLength = adjacentSides[ 1 ].lengthProperty.value;
      if ( firstAdjacentLength > sideLength && secondAdjacentLength > sideLength ) {
        description = shorterThanAdjacentSidesString;
      }
      else if ( firstAdjacentLength < sideLength && secondAdjacentLength < sideLength ) {
        description = longerThanAdjacentSidesString;
      }
      else {
        description = notEqualToAdjacentSidesString;
      }
    }

    return description;
  }

  /**
   * Returns a description of comparison between two sides, using entries of lengthComparisonDescriptionMap.
   * Description compares side2 to side1. For example, if side2 is longer than side1 the output will be something
   * like:
   * "Side2 is much longer than side1."
   */
  public static getLengthComparisonDescription( side1: Side, side2: Side ): string {
    let description: string | null = null;

    const length1 = side1.lengthProperty.value;
    const length2 = side2.lengthProperty.value;
    const lengthDifference = length2 - length1;

    lengthComparisonDescriptionMap.forEach( ( value, key ) => {
      if ( key.contains( lengthDifference ) ) {
        description = value;
      }
    } );

    assert && assert( description, 'Length comparison description not found for provided Sides' );
    return description!;
  }
}

quadrilateral.register( 'SideDescriber', SideDescriber );
export default SideDescriber;

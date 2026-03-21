// Copyright 2021-2026, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
import quadrilateral from './quadrilateral.js';

type StringsType = {
  'quadrilateral': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'labelsStringProperty': LocalizedStringProperty;
  'markersStringProperty': LocalizedStringProperty;
  'diagonalsStringProperty': LocalizedStringProperty;
  'gridStringProperty': LocalizedStringProperty;
  'vertexAStringProperty': LocalizedStringProperty;
  'vertexBStringProperty': LocalizedStringProperty;
  'vertexCStringProperty': LocalizedStringProperty;
  'vertexDStringProperty': LocalizedStringProperty;
  'shapeNameHiddenStringProperty': LocalizedStringProperty;
  'resetShapeStringProperty': LocalizedStringProperty;
  'shapeNames': {
    'squareStringProperty': LocalizedStringProperty;
    'rectangleStringProperty': LocalizedStringProperty;
    'rhombusStringProperty': LocalizedStringProperty;
    'kiteStringProperty': LocalizedStringProperty;
    'isoscelesTrapezoidStringProperty': LocalizedStringProperty;
    'trapezoidStringProperty': LocalizedStringProperty;
    'concaveQuadrilateralStringProperty': LocalizedStringProperty;
    'convexQuadrilateralStringProperty': LocalizedStringProperty;
    'parallelogramStringProperty': LocalizedStringProperty;
    'dartStringProperty': LocalizedStringProperty;
    'triangleStringProperty': LocalizedStringProperty;
  };
  'keyboardHelpDialog': {
    'moveCornersOrSidesStringProperty': LocalizedStringProperty;
    'moveCornerOrSideStringProperty': LocalizedStringProperty;
    'moveInSmallerStepsStringProperty': LocalizedStringProperty;
    'mouseStringProperty': LocalizedStringProperty;
    'shapeShortcutsStringProperty': LocalizedStringProperty;
    'resetShapeStringProperty': LocalizedStringProperty;
  };
  'preferencesDialog': {
    'shapeSoundOptionsStringProperty': LocalizedStringProperty;
    'shapeSoundOptionsDescriptionStringProperty': LocalizedStringProperty;
    'layerSoundDesignDescriptionStringProperty': LocalizedStringProperty;
    'uniqueSoundDesignDescriptionStringProperty': LocalizedStringProperty;
    'playShapeSoundsForeverStringProperty': LocalizedStringProperty;
  };
  'smallStepsStringProperty': LocalizedStringProperty;
  'a11y': {
    'cornerLabelsAddedResponseStringProperty': LocalizedStringProperty;
    'cornerLabelsRemovedResponseStringProperty': LocalizedStringProperty;
    'cornerLabelsHintResponseStringProperty': LocalizedStringProperty;
    'markersAddedResponseStringProperty': LocalizedStringProperty;
    'markersRemovedResponseStringProperty': LocalizedStringProperty;
    'markersHintResponseStringProperty': LocalizedStringProperty;
    'gridLinesAddedResponseStringProperty': LocalizedStringProperty;
    'gridLinesRemovedResponseStringProperty': LocalizedStringProperty;
    'diagonalGuidesAddedResponseStringProperty': LocalizedStringProperty;
    'diagonalGuidesRemovedResponseStringProperty': LocalizedStringProperty;
    'diagonalGuidesHintResponseStringProperty': LocalizedStringProperty;
    'gridLinesHintResponseStringProperty': LocalizedStringProperty;
    'cornerAStringProperty': LocalizedStringProperty;
    'cornerBStringProperty': LocalizedStringProperty;
    'cornerCStringProperty': LocalizedStringProperty;
    'cornerDStringProperty': LocalizedStringProperty;
    'sideABStringProperty': LocalizedStringProperty;
    'sideBCStringProperty': LocalizedStringProperty;
    'sideCDStringProperty': LocalizedStringProperty;
    'sideDAStringProperty': LocalizedStringProperty;
    'aBStringProperty': LocalizedStringProperty;
    'bCStringProperty': LocalizedStringProperty;
    'cDStringProperty': LocalizedStringProperty;
    'dAStringProperty': LocalizedStringProperty;
    'voicing': {
      'overviewContentStringProperty': LocalizedStringProperty;
      'hintContentStringProperty': LocalizedStringProperty;
      'youHaveAShapeHintPatternStringProperty': LocalizedStringProperty;
      'youHaveASizedNamedShapePatternStringProperty': LocalizedStringProperty;
      'youHaveASizedShapePatternStringProperty': LocalizedStringProperty;
      'firstDetailsStatementPatternStringProperty': LocalizedStringProperty;
      'vertexHintResponseStringProperty': LocalizedStringProperty;
      'sideHintResponseStringProperty': LocalizedStringProperty;
      'details': {
        'allStringProperty': LocalizedStringProperty;
        'oppositeStringProperty': LocalizedStringProperty;
        'rightAnglesStringProperty': LocalizedStringProperty;
        'equalStringProperty': LocalizedStringProperty;
        'pairsOfAdjacentStringProperty': LocalizedStringProperty;
        'onePairOfAdjacentStringProperty': LocalizedStringProperty;
        'onePairOfOppositeStringProperty': LocalizedStringProperty;
        'noStringStringProperty': LocalizedStringProperty;
      };
      'sidesDescriptionPatternStringProperty': LocalizedStringProperty;
      'longestSidesDescriptionPatternStringProperty': LocalizedStringProperty;
      'longestSideDescriptionPatternStringProperty': LocalizedStringProperty;
      'shortestSidesDescriptionPatternStringProperty': LocalizedStringProperty;
      'shortestSideDescriptionPatternStringProperty': LocalizedStringProperty;
      'sideLengthDescriptionPatternStringProperty': LocalizedStringProperty;
      'cornersRightDescriptionStringProperty': LocalizedStringProperty;
      'widestCornersDescriptionPatternStringProperty': LocalizedStringProperty;
      'widestCornerDescriptionPatternStringProperty': LocalizedStringProperty;
      'smallestCornersDescriptionPatternStringProperty': LocalizedStringProperty;
      'smallestCornerDescriptionPatternStringProperty': LocalizedStringProperty;
      'cornersDescriptionPatternStringProperty': LocalizedStringProperty;
      'oppositeSidesTiltPatternStringProperty': LocalizedStringProperty;
      'oppositeSidesInParallelPatternStringProperty': LocalizedStringProperty;
      'oppositeSidesInParallelAsCornersChangeEquallyPatternStringProperty': LocalizedStringProperty;
      'oppositeSidesTiltAsShapeChangesPatternStringProperty': LocalizedStringProperty;
      'maintainingATrapezoidAsShapeChangesPatternStringProperty': LocalizedStringProperty;
      'adjacentSidesChangeEquallyAsShapeChangesPatternStringProperty': LocalizedStringProperty;
      'oppositeSidesEqualAsShapeChangesPatternStringProperty': LocalizedStringProperty;
      'maintainingAParallelogramAngleResponseStringProperty': LocalizedStringProperty;
      'maintainingAParallelogramLengthResponsePatternStringProperty': LocalizedStringProperty;
      'allRightAnglesAsShapeChangesPatternStringProperty': LocalizedStringProperty;
      'maintainingARhombusStringProperty': LocalizedStringProperty;
      'allSidesEqualAsShapeChangesPatternStringProperty': LocalizedStringProperty;
      'cornerFlatAsShapeChangesPatternStringProperty': LocalizedStringProperty;
      'adjacentSidesInLinePatternStringProperty': LocalizedStringProperty;
      'allSidesTiltAwayFromParallelStringProperty': LocalizedStringProperty;
      'allSidesTiltAwayFromParallelAsShapeChangesPatternStringProperty': LocalizedStringProperty;
      'tiltStringProperty': LocalizedStringProperty;
      'straightenStringProperty': LocalizedStringProperty;
      'biggerStringProperty': LocalizedStringProperty;
      'smallerStringProperty': LocalizedStringProperty;
      'sizes': {
        'tinyStringProperty': LocalizedStringProperty;
        'verySmallStringProperty': LocalizedStringProperty;
        'smallStringProperty': LocalizedStringProperty;
        'mediumSizedStringProperty': LocalizedStringProperty;
        'largeStringProperty': LocalizedStringProperty;
      };
      'shapeNames': {
        'withoutArticles': {
          'squareStringProperty': LocalizedStringProperty;
          'rectangleStringProperty': LocalizedStringProperty;
          'rhombusStringProperty': LocalizedStringProperty;
          'kiteStringProperty': LocalizedStringProperty;
          'isoscelesTrapezoidStringProperty': LocalizedStringProperty;
          'trapezoidStringProperty': LocalizedStringProperty;
          'concaveQuadrilateralStringProperty': LocalizedStringProperty;
          'convexQuadrilateralStringProperty': LocalizedStringProperty;
          'parallelogramStringProperty': LocalizedStringProperty;
          'dartStringProperty': LocalizedStringProperty;
          'triangleStringProperty': LocalizedStringProperty;
        };
        'withArticles': {
          'squareStringProperty': LocalizedStringProperty;
          'rectangleStringProperty': LocalizedStringProperty;
          'rhombusStringProperty': LocalizedStringProperty;
          'kiteStringProperty': LocalizedStringProperty;
          'isoscelesTrapezoidStringProperty': LocalizedStringProperty;
          'trapezoidStringProperty': LocalizedStringProperty;
          'concaveQuadrilateralStringProperty': LocalizedStringProperty;
          'convexQuadrilateralStringProperty': LocalizedStringProperty;
          'parallelogramStringProperty': LocalizedStringProperty;
          'dartStringProperty': LocalizedStringProperty;
          'triangleStringProperty': LocalizedStringProperty;
        }
      };
      'allRightAnglesAllSidesEqualStringProperty': LocalizedStringProperty;
      'allSidesEqualStringProperty': LocalizedStringProperty;
      'allRightAnglesStringProperty': LocalizedStringProperty;
      'oppositeSidesInParallelStringProperty': LocalizedStringProperty;
      'trapezoidDetailsPatternStringProperty': LocalizedStringProperty;
      'isoscelesTrapezoidDetailsPatternStringProperty': LocalizedStringProperty;
      'kiteDetailsPatternStringProperty': LocalizedStringProperty;
      'kiteDetailsShortPatternStringProperty': LocalizedStringProperty;
      'dartDetailsPatternStringProperty': LocalizedStringProperty;
      'dartDetailsShortPatternStringProperty': LocalizedStringProperty;
      'triangleDetailsPatternStringProperty': LocalizedStringProperty;
      'convexQuadrilateralDetailsStringProperty': LocalizedStringProperty;
      'concaveQuadrilateralDetailsPatternStringProperty': LocalizedStringProperty;
      'vertexObjectResponsePatternStringProperty': LocalizedStringProperty;
      'vertexObjectResponseWithWedgesPatternStringProperty': LocalizedStringProperty;
      'rightAngleStringProperty': LocalizedStringProperty;
      'angleFlatStringProperty': LocalizedStringProperty;
      'oneWedgeStringProperty': LocalizedStringProperty;
      'halfOneWedgeStringProperty': LocalizedStringProperty;
      'lessThanHalfOneWedgeStringProperty': LocalizedStringProperty;
      'justUnderOneWedgeStringProperty': LocalizedStringProperty;
      'justOverOneWedgeStringProperty': LocalizedStringProperty;
      'numberOfWedgesPatternStringProperty': LocalizedStringProperty;
      'numberOfWedgesAndAHalfPatternStringProperty': LocalizedStringProperty;
      'justOverNumberOfWedgesPatternStringProperty': LocalizedStringProperty;
      'justUnderNumberOfWedgesPatternStringProperty': LocalizedStringProperty;
      'oneUnitStringProperty': LocalizedStringProperty;
      'numberOfUnitsPatternStringProperty': LocalizedStringProperty;
      'numberOfUnitsAndAHalfPatternStringProperty': LocalizedStringProperty;
      'oneQuarterUnitStringProperty': LocalizedStringProperty;
      'numberAndOneQuarterUnitsPatternStringProperty': LocalizedStringProperty;
      'threeQuarterUnitsStringProperty': LocalizedStringProperty;
      'numberAndThreeQuarterUnitsPatternStringProperty': LocalizedStringProperty;
      'aboutOneUnitStringProperty': LocalizedStringProperty;
      'aboutNumberUnitsPatternStringProperty': LocalizedStringProperty;
      'aboutOneHalfUnitsStringProperty': LocalizedStringProperty;
      'oneHalfUnitsStringProperty': LocalizedStringProperty;
      'aboutNumberAndAHalfUnitsPatternStringProperty': LocalizedStringProperty;
      'aboutNumberQuarterUnitsPatternStringProperty': LocalizedStringProperty;
      'aboutFullNumberAndNumberQuarterUnitsPatternStringProperty': LocalizedStringProperty;
      'vertexDragObjectResponse': {
        'widerStringProperty': LocalizedStringProperty;
        'smallerStringProperty': LocalizedStringProperty;
        'vertexDragObjectResponsePatternStringProperty': LocalizedStringProperty;
      };
      'sideDragObjectResponse': {
        'shorterStringProperty': LocalizedStringProperty;
        'longerStringProperty': LocalizedStringProperty;
        'adjacentSidesChangePatternStringProperty': LocalizedStringProperty;
        'adjacentSidesChangeInLengthStringProperty': LocalizedStringProperty;
        'parallelAdjacentSidesChangePatternStringProperty': LocalizedStringProperty;
        'equalAdjacentSidesChangePatternStringProperty': LocalizedStringProperty;
        'adjacentSidesEqualStringProperty': LocalizedStringProperty;
        'equalToAdjacentSidesStringProperty': LocalizedStringProperty;
        'adjacentSidesParallelStringProperty': LocalizedStringProperty;
        'equalToOneAdjacentSideStringProperty': LocalizedStringProperty;
        'threeSidesEqualStringProperty': LocalizedStringProperty;
        'twoSidesEqualStringProperty': LocalizedStringProperty;
      };
      'farSmallerThanStringProperty': LocalizedStringProperty;
      'aboutHalfAsWideAsStringProperty': LocalizedStringProperty;
      'halfAsWideAsStringProperty': LocalizedStringProperty;
      'aLittleSmallerThanStringProperty': LocalizedStringProperty;
      'muchSmallerThanStringProperty': LocalizedStringProperty;
      'similarButSmallerThanStringProperty': LocalizedStringProperty;
      'equalToStringProperty': LocalizedStringProperty;
      'similarButWiderThanStringProperty': LocalizedStringProperty;
      'aLittleWiderThanStringProperty': LocalizedStringProperty;
      'muchWiderThanStringProperty': LocalizedStringProperty;
      'aboutTwiceAsWideAsStringProperty': LocalizedStringProperty;
      'twiceAsWideAsStringProperty': LocalizedStringProperty;
      'farWiderThanStringProperty': LocalizedStringProperty;
      'equalToAdjacentCornersStringProperty': LocalizedStringProperty;
      'equalToOneAdjacentCornerStringProperty': LocalizedStringProperty;
      'equalAdjacentCornersPatternStringProperty': LocalizedStringProperty;
      'smallerThanAdjacentCornersStringProperty': LocalizedStringProperty;
      'widerThanAdjacentCornersStringProperty': LocalizedStringProperty;
      'notEqualToAdjacentCornersStringProperty': LocalizedStringProperty;
      'farShorterThanStringProperty': LocalizedStringProperty;
      'aboutHalfAsLongAsStringProperty': LocalizedStringProperty;
      'halfAsLongAsStringProperty': LocalizedStringProperty;
      'aLittleShorterThanStringProperty': LocalizedStringProperty;
      'muchShorterThanStringProperty': LocalizedStringProperty;
      'similarButShorterThanStringProperty': LocalizedStringProperty;
      'similarButLongerThanStringProperty': LocalizedStringProperty;
      'aLittleLongerThanStringProperty': LocalizedStringProperty;
      'muchLongerThanStringProperty': LocalizedStringProperty;
      'aboutTwiceAsLongAsStringProperty': LocalizedStringProperty;
      'twiceAsLongAsStringProperty': LocalizedStringProperty;
      'farLongerThanStringProperty': LocalizedStringProperty;
      'parallelEqualSideObjectResponsePatternStringProperty': LocalizedStringProperty;
      'parallelSideObjectResponsePatternStringProperty': LocalizedStringProperty;
      'sideObjectResponsePatternStringProperty': LocalizedStringProperty;
      'sideUnitsObjectResponsePatternStringProperty': LocalizedStringProperty;
      'equalToAdjacentSidesStringProperty': LocalizedStringProperty;
      'equalToOneAdjacentSideStringProperty': LocalizedStringProperty;
      'equalAdjacentSidesPatternStringProperty': LocalizedStringProperty;
      'equalAdjacentParallelSidesPatternStringProperty': LocalizedStringProperty;
      'shorterThanAdjacentSidesStringProperty': LocalizedStringProperty;
      'shorterThanParallelAdjacentSidesStringProperty': LocalizedStringProperty;
      'longerThanAdjacentSidesStringProperty': LocalizedStringProperty;
      'longerThanParallelAdjacentSidesStringProperty': LocalizedStringProperty;
      'notEqualToAdjacentSidesStringProperty': LocalizedStringProperty;
      'notEqualToParallelAdjacentSidesStringProperty': LocalizedStringProperty;
      'backStringProperty': LocalizedStringProperty;
      'goneStringProperty': LocalizedStringProperty;
      'cornersBackStringProperty': LocalizedStringProperty;
      'cornersGoneStringProperty': LocalizedStringProperty;
      'cornerDetectedPatternStringProperty': LocalizedStringProperty;
      'shapeSoundControl': {
        'nameResponseStringProperty': LocalizedStringProperty;
        'enabledContextResponseStringProperty': LocalizedStringProperty;
        'disabledContextResponseStringProperty': LocalizedStringProperty;
        'hintResponseStringProperty': LocalizedStringProperty;
      };
      'resetShape': {
        'contextResponseStringProperty': LocalizedStringProperty;
      };
      'foundShapePatternStringProperty': LocalizedStringProperty;
      'shapeNameHiddenContextResponseStringProperty': LocalizedStringProperty;
      'shapeNameShownContextResponseStringProperty': LocalizedStringProperty;
      'angleComparisonPatternStringProperty': LocalizedStringProperty;
      'equalToOppositeCornerEqualToAdjacentCornersStringProperty': LocalizedStringProperty;
      'oppositeCornerStringProperty': LocalizedStringProperty;
      'adjacentCornersEqualStringProperty': LocalizedStringProperty;
      'adjacentCornersRightAnglesStringProperty': LocalizedStringProperty;
      'progressStatePatternStringProperty': LocalizedStringProperty;
      'blockedByEdgeStringProperty': LocalizedStringProperty;
      'blockedByInnerShapeStringProperty': LocalizedStringProperty;
      'minorIntervalsToggle': {
        'hintResponseStringProperty': LocalizedStringProperty;
        'lockedNameResponseStringProperty': LocalizedStringProperty;
        'unlockedNameResponseStringProperty': LocalizedStringProperty;
        'lockedContextResponseStringProperty': LocalizedStringProperty;
        'unlockedContextResponseStringProperty': LocalizedStringProperty;
      }
    };
    'keyboardHelpDialog': {
      'smallerStepsDescriptionStringProperty': LocalizedStringProperty;
    };
    'preferencesDialog': {
      'tracksPlayForeverToggle': {
        'checkedContextResponseStringProperty': LocalizedStringProperty;
        'uncheckedContextResponseStringProperty': LocalizedStringProperty;
      }
    }
  }
};

const QuadrilateralStrings = getStringModule( 'QUADRILATERAL' ) as StringsType;

quadrilateral.register( 'QuadrilateralStrings', QuadrilateralStrings );

export default QuadrilateralStrings;

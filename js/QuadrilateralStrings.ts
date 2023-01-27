// Copyright 2021-2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import LinkableProperty from '../../axon/js/LinkableProperty.js';
import quadrilateral from './quadrilateral.js';

type StringsType = {
  'quadrilateral': {
    'title': string;
    'titleStringProperty': LinkableProperty<string>;
  };
  'labels': string;
  'labelsStringProperty': LinkableProperty<string>;
  'markers': string;
  'markersStringProperty': LinkableProperty<string>;
  'diagonals': string;
  'diagonalsStringProperty': LinkableProperty<string>;
  'grid': string;
  'gridStringProperty': LinkableProperty<string>;
  'vertexA': string;
  'vertexAStringProperty': LinkableProperty<string>;
  'vertexB': string;
  'vertexBStringProperty': LinkableProperty<string>;
  'vertexC': string;
  'vertexCStringProperty': LinkableProperty<string>;
  'vertexD': string;
  'vertexDStringProperty': LinkableProperty<string>;
  'shapeNameHidden': string;
  'shapeNameHiddenStringProperty': LinkableProperty<string>;
  'resetShape': string;
  'resetShapeStringProperty': LinkableProperty<string>;
  'shapeNames': {
    'square': string;
    'squareStringProperty': LinkableProperty<string>;
    'rectangle': string;
    'rectangleStringProperty': LinkableProperty<string>;
    'rhombus': string;
    'rhombusStringProperty': LinkableProperty<string>;
    'kite': string;
    'kiteStringProperty': LinkableProperty<string>;
    'isoscelesTrapezoid': string;
    'isoscelesTrapezoidStringProperty': LinkableProperty<string>;
    'trapezoid': string;
    'trapezoidStringProperty': LinkableProperty<string>;
    'concaveQuadrilateral': string;
    'concaveQuadrilateralStringProperty': LinkableProperty<string>;
    'convexQuadrilateral': string;
    'convexQuadrilateralStringProperty': LinkableProperty<string>;
    'parallelogram': string;
    'parallelogramStringProperty': LinkableProperty<string>;
    'dart': string;
    'dartStringProperty': LinkableProperty<string>;
    'triangle': string;
    'triangleStringProperty': LinkableProperty<string>;
  };
  'hapticsDialogMessage': string;
  'hapticsDialogMessageStringProperty': LinkableProperty<string>;
  'gotIt': string;
  'gotItStringProperty': LinkableProperty<string>;
  'keyboardHelpDialog': {
    'moveCornersOrSides': string;
    'moveCornersOrSidesStringProperty': LinkableProperty<string>;
    'moveACornerOrSide': string;
    'moveACornerOrSideStringProperty': LinkableProperty<string>;
    'moveInSmallerSteps': string;
    'moveInSmallerStepsStringProperty': LinkableProperty<string>;
    'mouse': string;
    'mouseStringProperty': LinkableProperty<string>;
    'shapeShortcuts': string;
    'shapeShortcutsStringProperty': LinkableProperty<string>;
    'resetShape': string;
    'resetShapeStringProperty': LinkableProperty<string>;
  };
  'preferencesDialog': {
    'shapeSoundOptions': string;
    'shapeSoundOptionsStringProperty': LinkableProperty<string>;
    'shapeSoundOptionsDescription': string;
    'shapeSoundOptionsDescriptionStringProperty': LinkableProperty<string>;
    'layerSoundDesignDescription': string;
    'layerSoundDesignDescriptionStringProperty': LinkableProperty<string>;
    'independentSoundDesignDescription': string;
    'independentSoundDesignDescriptionStringProperty': LinkableProperty<string>;
    'playSoundsForever': string;
    'playSoundsForeverStringProperty': LinkableProperty<string>;
  };
  'smallSteps': string;
  'smallStepsStringProperty': LinkableProperty<string>;
  'a11y': {
    'screenSummary': {
      'playAreaDescription': string;
      'playAreaDescriptionStringProperty': LinkableProperty<string>;
      'controlAreaDescription': string;
      'controlAreaDescriptionStringProperty': LinkableProperty<string>;
    };
    'cornerLabelsAddedResponse': string;
    'cornerLabelsAddedResponseStringProperty': LinkableProperty<string>;
    'cornerLabelsRemovedResponse': string;
    'cornerLabelsRemovedResponseStringProperty': LinkableProperty<string>;
    'cornerLabelsHintResponse': string;
    'cornerLabelsHintResponseStringProperty': LinkableProperty<string>;
    'markersAddedResponse': string;
    'markersAddedResponseStringProperty': LinkableProperty<string>;
    'markersRemovedResponse': string;
    'markersRemovedResponseStringProperty': LinkableProperty<string>;
    'markersHintResponse': string;
    'markersHintResponseStringProperty': LinkableProperty<string>;
    'gridLinesAddedResponse': string;
    'gridLinesAddedResponseStringProperty': LinkableProperty<string>;
    'gridLinesRemovedResponse': string;
    'gridLinesRemovedResponseStringProperty': LinkableProperty<string>;
    'diagonalGuidesAddedResponse': string;
    'diagonalGuidesAddedResponseStringProperty': LinkableProperty<string>;
    'diagonalGuidesRemovedResponse': string;
    'diagonalGuidesRemovedResponseStringProperty': LinkableProperty<string>;
    'diagonalGuidesHintResponse': string;
    'diagonalGuidesHintResponseStringProperty': LinkableProperty<string>;
    'gridLinesHintResponse': string;
    'gridLinesHintResponseStringProperty': LinkableProperty<string>;
    'myShapesCorners': string;
    'myShapesCornersStringProperty': LinkableProperty<string>;
    'myShapesSides': string;
    'myShapesSidesStringProperty': LinkableProperty<string>;
    'cornerA': string;
    'cornerAStringProperty': LinkableProperty<string>;
    'cornerB': string;
    'cornerBStringProperty': LinkableProperty<string>;
    'cornerC': string;
    'cornerCStringProperty': LinkableProperty<string>;
    'cornerD': string;
    'cornerDStringProperty': LinkableProperty<string>;
    'topSide': string;
    'topSideStringProperty': LinkableProperty<string>;
    'rightSide': string;
    'rightSideStringProperty': LinkableProperty<string>;
    'bottomSide': string;
    'bottomSideStringProperty': LinkableProperty<string>;
    'leftSide': string;
    'leftSideStringProperty': LinkableProperty<string>;
    'aB': string;
    'aBStringProperty': LinkableProperty<string>;
    'bC': string;
    'bCStringProperty': LinkableProperty<string>;
    'cD': string;
    'cDStringProperty': LinkableProperty<string>;
    'dA': string;
    'dAStringProperty': LinkableProperty<string>;
    'voicing': {
      'overviewContent': string;
      'overviewContentStringProperty': LinkableProperty<string>;
      'hintContent': string;
      'hintContentStringProperty': LinkableProperty<string>;
      'youHaveAShapeHintPattern': string;
      'youHaveAShapeHintPatternStringProperty': LinkableProperty<string>;
      'youHaveASizedNamedShapePattern': string;
      'youHaveASizedNamedShapePatternStringProperty': LinkableProperty<string>;
      'youHaveASizedShapePattern': string;
      'youHaveASizedShapePatternStringProperty': LinkableProperty<string>;
      'firstDetailsStatementPattern': string;
      'firstDetailsStatementPatternStringProperty': LinkableProperty<string>;
      'details': {
        'all': string;
        'allStringProperty': LinkableProperty<string>;
        'opposite': string;
        'oppositeStringProperty': LinkableProperty<string>;
        'rightAngles': string;
        'rightAnglesStringProperty': LinkableProperty<string>;
        'equal': string;
        'equalStringProperty': LinkableProperty<string>;
        'pairsOfAdjacent': string;
        'pairsOfAdjacentStringProperty': LinkableProperty<string>;
        'onePairOfAdjacent': string;
        'onePairOfAdjacentStringProperty': LinkableProperty<string>;
        'onePairOfOpposite': string;
        'onePairOfOppositeStringProperty': LinkableProperty<string>;
        'noString': string;
        'noStringStringProperty': LinkableProperty<string>;
        'cornersPattern': string;
        'cornersPatternStringProperty': LinkableProperty<string>;
        'cornerPointsPattern': string;
        'cornerPointsPatternStringProperty': LinkableProperty<string>;
        'cornerConcavePattern': string;
        'cornerConcavePatternStringProperty': LinkableProperty<string>;
        'sidesPattern': string;
        'sidesPatternStringProperty': LinkableProperty<string>;
        'kiteSidesPattern': string;
        'kiteSidesPatternStringProperty': LinkableProperty<string>;
        'trapezoidSidesPattern': string;
        'trapezoidSidesPatternStringProperty': LinkableProperty<string>;
        'equalSidesPattern': string;
        'equalSidesPatternStringProperty': LinkableProperty<string>;
        'twoStatementPattern': string;
        'twoStatementPatternStringProperty': LinkableProperty<string>;
        'sideConcavePattern': string;
        'sideConcavePatternStringProperty': LinkableProperty<string>;
        'generalSidePattern': string;
        'generalSidePatternStringProperty': LinkableProperty<string>;
        'generalSideWithOneAdjacentEqualPairPattern': string;
        'generalSideWithOneAdjacentEqualPairPatternStringProperty': LinkableProperty<string>;
        'generalVertexPattern': string;
        'generalVertexPatternStringProperty': LinkableProperty<string>;
        'cornerAnglePattern': string;
        'cornerAnglePatternStringProperty': LinkableProperty<string>;
        'rightAngleCornersPattern': string;
        'rightAngleCornersPatternStringProperty': LinkableProperty<string>;
        'twoEqualVerticesAnglePattern': string;
        'twoEqualVerticesAnglePatternStringProperty': LinkableProperty<string>;
        'twoPairsOfEqualVerticesPattern': string;
        'twoPairsOfEqualVerticesPatternStringProperty': LinkableProperty<string>;
        'cornersAnglePattern': string;
        'cornersAnglePatternStringProperty': LinkableProperty<string>;
      };
      'sidesDescriptionPattern': string;
      'sidesDescriptionPatternStringProperty': LinkableProperty<string>;
      'longestSidesDescriptionPattern': string;
      'longestSidesDescriptionPatternStringProperty': LinkableProperty<string>;
      'longestSideDescriptionPattern': string;
      'longestSideDescriptionPatternStringProperty': LinkableProperty<string>;
      'shortestSidesDescriptionPattern': string;
      'shortestSidesDescriptionPatternStringProperty': LinkableProperty<string>;
      'shortestSideDescriptionPattern': string;
      'shortestSideDescriptionPatternStringProperty': LinkableProperty<string>;
      'sideLengthDescriptionPattern': string;
      'sideLengthDescriptionPatternStringProperty': LinkableProperty<string>;
      'cornersRightDescription': string;
      'cornersRightDescriptionStringProperty': LinkableProperty<string>;
      'widestCornersDescriptionPattern': string;
      'widestCornersDescriptionPatternStringProperty': LinkableProperty<string>;
      'widestCornerDescriptionPattern': string;
      'widestCornerDescriptionPatternStringProperty': LinkableProperty<string>;
      'smallestCornersDescriptionPattern': string;
      'smallestCornersDescriptionPatternStringProperty': LinkableProperty<string>;
      'smallestCornerDescriptionPattern': string;
      'smallestCornerDescriptionPatternStringProperty': LinkableProperty<string>;
      'cornersDescriptionPattern': string;
      'cornersDescriptionPatternStringProperty': LinkableProperty<string>;
      'oppositeSidesTiltPattern': string;
      'oppositeSidesTiltPatternStringProperty': LinkableProperty<string>;
      'oppositeSidesInParallelPattern': string;
      'oppositeSidesInParallelPatternStringProperty': LinkableProperty<string>;
      'oppositeSidesInParallelAsCornersChangeEquallyPattern': string;
      'oppositeSidesInParallelAsCornersChangeEquallyPatternStringProperty': LinkableProperty<string>;
      'oppositeSidesTiltAsShapeChangesPattern': string;
      'oppositeSidesTiltAsShapeChangesPatternStringProperty': LinkableProperty<string>;
      'maintainingATrapezoidAsShapeChangesPattern': string;
      'maintainingATrapezoidAsShapeChangesPatternStringProperty': LinkableProperty<string>;
      'adjacentSidesChangeEquallyAsShapeChangesPattern': string;
      'adjacentSidesChangeEquallyAsShapeChangesPatternStringProperty': LinkableProperty<string>;
      'oppositeSidesEqualAsShapeChangesPattern': string;
      'oppositeSidesEqualAsShapeChangesPatternStringProperty': LinkableProperty<string>;
      'maintainingAParallelogramAngleResponse': string;
      'maintainingAParallelogramAngleResponseStringProperty': LinkableProperty<string>;
      'maintainingAParallelogramLengthResponsePattern': string;
      'maintainingAParallelogramLengthResponsePatternStringProperty': LinkableProperty<string>;
      'allRightAnglesAsShapeChangesPattern': string;
      'allRightAnglesAsShapeChangesPatternStringProperty': LinkableProperty<string>;
      'maintainingARhombus': string;
      'maintainingARhombusStringProperty': LinkableProperty<string>;
      'allSidesEqualAsShapeChangesPattern': string;
      'allSidesEqualAsShapeChangesPatternStringProperty': LinkableProperty<string>;
      'cornerFlatAsShapeChangesPattern': string;
      'cornerFlatAsShapeChangesPatternStringProperty': LinkableProperty<string>;
      'adjacentSidesInLinePattern': string;
      'adjacentSidesInLinePatternStringProperty': LinkableProperty<string>;
      'doesShapeHaveThreeOrFourSidesQuestion': string;
      'doesShapeHaveThreeOrFourSidesQuestionStringProperty': LinkableProperty<string>;
      'allSidesTiltAwayFromParallel': string;
      'allSidesTiltAwayFromParallelStringProperty': LinkableProperty<string>;
      'allSidesTiltAwayFromParallelAsShapeChangesPattern': string;
      'allSidesTiltAwayFromParallelAsShapeChangesPatternStringProperty': LinkableProperty<string>;
      'tilt': string;
      'tiltStringProperty': LinkableProperty<string>;
      'straighten': string;
      'straightenStringProperty': LinkableProperty<string>;
      'bigger': string;
      'biggerStringProperty': LinkableProperty<string>;
      'smaller': string;
      'smallerStringProperty': LinkableProperty<string>;
      'sizes': {
        'tiny': string;
        'tinyStringProperty': LinkableProperty<string>;
        'verySmall': string;
        'verySmallStringProperty': LinkableProperty<string>;
        'small': string;
        'smallStringProperty': LinkableProperty<string>;
        'mediumSized': string;
        'mediumSizedStringProperty': LinkableProperty<string>;
        'large': string;
        'largeStringProperty': LinkableProperty<string>;
      };
      'shapeNames': {
        'withoutArticles': {
          'square': string;
          'squareStringProperty': LinkableProperty<string>;
          'rectangle': string;
          'rectangleStringProperty': LinkableProperty<string>;
          'rhombus': string;
          'rhombusStringProperty': LinkableProperty<string>;
          'kite': string;
          'kiteStringProperty': LinkableProperty<string>;
          'isoscelesTrapezoid': string;
          'isoscelesTrapezoidStringProperty': LinkableProperty<string>;
          'trapezoid': string;
          'trapezoidStringProperty': LinkableProperty<string>;
          'concaveQuadrilateral': string;
          'concaveQuadrilateralStringProperty': LinkableProperty<string>;
          'convexQuadrilateral': string;
          'convexQuadrilateralStringProperty': LinkableProperty<string>;
          'parallelogram': string;
          'parallelogramStringProperty': LinkableProperty<string>;
          'dart': string;
          'dartStringProperty': LinkableProperty<string>;
          'triangle': string;
          'triangleStringProperty': LinkableProperty<string>;
        };
        'withArticles': {
          'square': string;
          'squareStringProperty': LinkableProperty<string>;
          'rectangle': string;
          'rectangleStringProperty': LinkableProperty<string>;
          'rhombus': string;
          'rhombusStringProperty': LinkableProperty<string>;
          'kite': string;
          'kiteStringProperty': LinkableProperty<string>;
          'isoscelesTrapezoid': string;
          'isoscelesTrapezoidStringProperty': LinkableProperty<string>;
          'trapezoid': string;
          'trapezoidStringProperty': LinkableProperty<string>;
          'concaveQuadrilateral': string;
          'concaveQuadrilateralStringProperty': LinkableProperty<string>;
          'convexQuadrilateral': string;
          'convexQuadrilateralStringProperty': LinkableProperty<string>;
          'parallelogram': string;
          'parallelogramStringProperty': LinkableProperty<string>;
          'dart': string;
          'dartStringProperty': LinkableProperty<string>;
          'triangle': string;
          'triangleStringProperty': LinkableProperty<string>;
        }
      };
      'foundAParallelogram': string;
      'foundAParallelogramStringProperty': LinkableProperty<string>;
      'lostYourParallelogram': string;
      'lostYourParallelogramStringProperty': LinkableProperty<string>;
      'allRightAnglesAllSidesEqual': string;
      'allRightAnglesAllSidesEqualStringProperty': LinkableProperty<string>;
      'allSidesEqual': string;
      'allSidesEqualStringProperty': LinkableProperty<string>;
      'allRightAngles': string;
      'allRightAnglesStringProperty': LinkableProperty<string>;
      'oppositeSidesInParallel': string;
      'oppositeSidesInParallelStringProperty': LinkableProperty<string>;
      'trapezoidDetailsPattern': string;
      'trapezoidDetailsPatternStringProperty': LinkableProperty<string>;
      'isoscelesTrapezoidDetailsPattern': string;
      'isoscelesTrapezoidDetailsPatternStringProperty': LinkableProperty<string>;
      'kiteDetailsPattern': string;
      'kiteDetailsPatternStringProperty': LinkableProperty<string>;
      'kiteDetailsShortPattern': string;
      'kiteDetailsShortPatternStringProperty': LinkableProperty<string>;
      'dartDetailsPattern': string;
      'dartDetailsPatternStringProperty': LinkableProperty<string>;
      'dartDetailsShortPattern': string;
      'dartDetailsShortPatternStringProperty': LinkableProperty<string>;
      'triangleDetailsPattern': string;
      'triangleDetailsPatternStringProperty': LinkableProperty<string>;
      'convexQuadrilateralDetails': string;
      'convexQuadrilateralDetailsStringProperty': LinkableProperty<string>;
      'concaveQuadrilateralDetailsPattern': string;
      'concaveQuadrilateralDetailsPatternStringProperty': LinkableProperty<string>;
      'vertexObjectResponsePattern': string;
      'vertexObjectResponsePatternStringProperty': LinkableProperty<string>;
      'rightAngleVertexObjectResponsePattern': string;
      'rightAngleVertexObjectResponsePatternStringProperty': LinkableProperty<string>;
      'vertexObjectResponseWithWedgesPattern': string;
      'vertexObjectResponseWithWedgesPatternStringProperty': LinkableProperty<string>;
      'rightAngle': string;
      'rightAngleStringProperty': LinkableProperty<string>;
      'angleFlat': string;
      'angleFlatStringProperty': LinkableProperty<string>;
      'anglePointingInward': string;
      'anglePointingInwardStringProperty': LinkableProperty<string>;
      'oneWedge': string;
      'oneWedgeStringProperty': LinkableProperty<string>;
      'halfOneWedge': string;
      'halfOneWedgeStringProperty': LinkableProperty<string>;
      'lessThanHalfOneWedge': string;
      'lessThanHalfOneWedgeStringProperty': LinkableProperty<string>;
      'justUnderOneWedge': string;
      'justUnderOneWedgeStringProperty': LinkableProperty<string>;
      'justOverOneWedge': string;
      'justOverOneWedgeStringProperty': LinkableProperty<string>;
      'numberOfWedgesPattern': string;
      'numberOfWedgesPatternStringProperty': LinkableProperty<string>;
      'numberOfWedgesAndAHalfPattern': string;
      'numberOfWedgesAndAHalfPatternStringProperty': LinkableProperty<string>;
      'justOverNumberOfWedgesPattern': string;
      'justOverNumberOfWedgesPatternStringProperty': LinkableProperty<string>;
      'justUnderNumberOfWedgesPattern': string;
      'justUnderNumberOfWedgesPatternStringProperty': LinkableProperty<string>;
      'oneUnit': string;
      'oneUnitStringProperty': LinkableProperty<string>;
      'numberOfUnitsPattern': string;
      'numberOfUnitsPatternStringProperty': LinkableProperty<string>;
      'aboutHalfOneUnit': string;
      'aboutHalfOneUnitStringProperty': LinkableProperty<string>;
      'numberOfUnitsAndAHalfPattern': string;
      'numberOfUnitsAndAHalfPatternStringProperty': LinkableProperty<string>;
      'lessThanHalfOneUnit': string;
      'lessThanHalfOneUnitStringProperty': LinkableProperty<string>;
      'justOverNumberOfUnitsPattern': string;
      'justOverNumberOfUnitsPatternStringProperty': LinkableProperty<string>;
      'justUnderOneUnit': string;
      'justUnderOneUnitStringProperty': LinkableProperty<string>;
      'justUnderNumberOfUnitsPattern': string;
      'justUnderNumberOfUnitsPatternStringProperty': LinkableProperty<string>;
      'oneQuarterUnit': string;
      'oneQuarterUnitStringProperty': LinkableProperty<string>;
      'numberAndOneQuarterUnitsPattern': string;
      'numberAndOneQuarterUnitsPatternStringProperty': LinkableProperty<string>;
      'threeQuarterUnits': string;
      'threeQuarterUnitsStringProperty': LinkableProperty<string>;
      'numberAndThreeQuarterUnitsPattern': string;
      'numberAndThreeQuarterUnitsPatternStringProperty': LinkableProperty<string>;
      'aboutOneUnit': string;
      'aboutOneUnitStringProperty': LinkableProperty<string>;
      'aboutNumberUnitsPattern': string;
      'aboutNumberUnitsPatternStringProperty': LinkableProperty<string>;
      'aboutOneHalfUnits': string;
      'aboutOneHalfUnitsStringProperty': LinkableProperty<string>;
      'oneHalfUnits': string;
      'oneHalfUnitsStringProperty': LinkableProperty<string>;
      'aboutNumberAndAHalfUnitsPattern': string;
      'aboutNumberAndAHalfUnitsPatternStringProperty': LinkableProperty<string>;
      'aboutNumberQuarterUnitsPattern': string;
      'aboutNumberQuarterUnitsPatternStringProperty': LinkableProperty<string>;
      'aboutFullNumberAndNumberQuarterUnitsPattern': string;
      'aboutFullNumberAndNumberQuarterUnitsPatternStringProperty': LinkableProperty<string>;
      'vertexDragObjectResponse': {
        'wider': string;
        'widerStringProperty': LinkableProperty<string>;
        'smaller': string;
        'smallerStringProperty': LinkableProperty<string>;
        'vertexDragObjectResponsePattern': string;
        'vertexDragObjectResponsePatternStringProperty': LinkableProperty<string>;
      };
      'sideDragObjectResponse': {
        'shorter': string;
        'shorterStringProperty': LinkableProperty<string>;
        'longer': string;
        'longerStringProperty': LinkableProperty<string>;
        'adjacentSidesChangePattern': string;
        'adjacentSidesChangePatternStringProperty': LinkableProperty<string>;
        'adjacentSidesChangeUnequally': string;
        'adjacentSidesChangeUnequallyStringProperty': LinkableProperty<string>;
        'adjacentSidesChangeInLength': string;
        'adjacentSidesChangeInLengthStringProperty': LinkableProperty<string>;
        'parallelAdjacentSidesChangePattern': string;
        'parallelAdjacentSidesChangePatternStringProperty': LinkableProperty<string>;
        'equalAdjacentSidesChangePattern': string;
        'equalAdjacentSidesChangePatternStringProperty': LinkableProperty<string>;
        'adjacentSidesEqual': string;
        'adjacentSidesEqualStringProperty': LinkableProperty<string>;
        'equalToAdjacentSides': string;
        'equalToAdjacentSidesStringProperty': LinkableProperty<string>;
        'adjacentSidesParallel': string;
        'adjacentSidesParallelStringProperty': LinkableProperty<string>;
        'equalToOneAdjacentSide': string;
        'equalToOneAdjacentSideStringProperty': LinkableProperty<string>;
        'threeSidesEqual': string;
        'threeSidesEqualStringProperty': LinkableProperty<string>;
        'twoSidesEqual': string;
        'twoSidesEqualStringProperty': LinkableProperty<string>;
      };
      'farSmallerThan': string;
      'farSmallerThanStringProperty': LinkableProperty<string>;
      'muchMuchSmallerThan': string;
      'muchMuchSmallerThanStringProperty': LinkableProperty<string>;
      'aboutHalfAsWideAs': string;
      'aboutHalfAsWideAsStringProperty': LinkableProperty<string>;
      'halfAsWideAs': string;
      'halfAsWideAsStringProperty': LinkableProperty<string>;
      'aLittleSmallerThan': string;
      'aLittleSmallerThanStringProperty': LinkableProperty<string>;
      'muchSmallerThan': string;
      'muchSmallerThanStringProperty': LinkableProperty<string>;
      'somewhatSmallerThan': string;
      'somewhatSmallerThanStringProperty': LinkableProperty<string>;
      'similarButSmallerThan': string;
      'similarButSmallerThanStringProperty': LinkableProperty<string>;
      'equalTo': string;
      'equalToStringProperty': LinkableProperty<string>;
      'similarButWiderThan': string;
      'similarButWiderThanStringProperty': LinkableProperty<string>;
      'aLittleWiderThan': string;
      'aLittleWiderThanStringProperty': LinkableProperty<string>;
      'somewhatWiderThan': string;
      'somewhatWiderThanStringProperty': LinkableProperty<string>;
      'muchWiderThan': string;
      'muchWiderThanStringProperty': LinkableProperty<string>;
      'aboutTwiceAsWideAs': string;
      'aboutTwiceAsWideAsStringProperty': LinkableProperty<string>;
      'twiceAsWideAs': string;
      'twiceAsWideAsStringProperty': LinkableProperty<string>;
      'muchMuchWiderThan': string;
      'muchMuchWiderThanStringProperty': LinkableProperty<string>;
      'farWiderThan': string;
      'farWiderThanStringProperty': LinkableProperty<string>;
      'halfTheSizeOf': string;
      'halfTheSizeOfStringProperty': LinkableProperty<string>;
      'twiceTheSizeOf': string;
      'twiceTheSizeOfStringProperty': LinkableProperty<string>;
      'smallerAndSimilarTo': string;
      'smallerAndSimilarToStringProperty': LinkableProperty<string>;
      'widerAndSimilarTo': string;
      'widerAndSimilarToStringProperty': LinkableProperty<string>;
      'almostEqualTo': string;
      'almostEqualToStringProperty': LinkableProperty<string>;
      'equalToAdjacentCorners': string;
      'equalToAdjacentCornersStringProperty': LinkableProperty<string>;
      'equalToOneAdjacentCorner': string;
      'equalToOneAdjacentCornerStringProperty': LinkableProperty<string>;
      'equalAdjacentCornersPattern': string;
      'equalAdjacentCornersPatternStringProperty': LinkableProperty<string>;
      'smallerThanAdjacentCorners': string;
      'smallerThanAdjacentCornersStringProperty': LinkableProperty<string>;
      'widerThanAdjacentCorners': string;
      'widerThanAdjacentCornersStringProperty': LinkableProperty<string>;
      'notEqualToAdjacentCorners': string;
      'notEqualToAdjacentCornersStringProperty': LinkableProperty<string>;
      'farShorterThan': string;
      'farShorterThanStringProperty': LinkableProperty<string>;
      'muchMuchShorterThan': string;
      'muchMuchShorterThanStringProperty': LinkableProperty<string>;
      'aboutHalfAsLongAs': string;
      'aboutHalfAsLongAsStringProperty': LinkableProperty<string>;
      'halfAsLongAs': string;
      'halfAsLongAsStringProperty': LinkableProperty<string>;
      'aLittleShorterThan': string;
      'aLittleShorterThanStringProperty': LinkableProperty<string>;
      'muchShorterThan': string;
      'muchShorterThanStringProperty': LinkableProperty<string>;
      'somewhatShorterThan': string;
      'somewhatShorterThanStringProperty': LinkableProperty<string>;
      'similarButShorterThan': string;
      'similarButShorterThanStringProperty': LinkableProperty<string>;
      'similarButLongerThan': string;
      'similarButLongerThanStringProperty': LinkableProperty<string>;
      'aLittleLongerThan': string;
      'aLittleLongerThanStringProperty': LinkableProperty<string>;
      'somewhatLongerThan': string;
      'somewhatLongerThanStringProperty': LinkableProperty<string>;
      'muchLongerThan': string;
      'muchLongerThanStringProperty': LinkableProperty<string>;
      'aboutTwiceAsLongAs': string;
      'aboutTwiceAsLongAsStringProperty': LinkableProperty<string>;
      'twiceAsLongAs': string;
      'twiceAsLongAsStringProperty': LinkableProperty<string>;
      'muchMuchLongerThan': string;
      'muchMuchLongerThanStringProperty': LinkableProperty<string>;
      'farLongerThan': string;
      'farLongerThanStringProperty': LinkableProperty<string>;
      'parallelSideObjectResponsePattern': string;
      'parallelSideObjectResponsePatternStringProperty': LinkableProperty<string>;
      'sideObjectResponsePattern': string;
      'sideObjectResponsePatternStringProperty': LinkableProperty<string>;
      'sideUnitsObjectResponsePattern': string;
      'sideUnitsObjectResponsePatternStringProperty': LinkableProperty<string>;
      'equalToAdjacentSides': string;
      'equalToAdjacentSidesStringProperty': LinkableProperty<string>;
      'equalToOneAdjacentSide': string;
      'equalToOneAdjacentSideStringProperty': LinkableProperty<string>;
      'equalAdjacentSidesPattern': string;
      'equalAdjacentSidesPatternStringProperty': LinkableProperty<string>;
      'equalAdjacentParallelSidesPattern': string;
      'equalAdjacentParallelSidesPatternStringProperty': LinkableProperty<string>;
      'shorterThanAdjacentSides': string;
      'shorterThanAdjacentSidesStringProperty': LinkableProperty<string>;
      'shorterThanParallelAdjacentSides': string;
      'shorterThanParallelAdjacentSidesStringProperty': LinkableProperty<string>;
      'longerThanAdjacentSides': string;
      'longerThanAdjacentSidesStringProperty': LinkableProperty<string>;
      'longerThanParallelAdjacentSides': string;
      'longerThanParallelAdjacentSidesStringProperty': LinkableProperty<string>;
      'notEqualToAdjacentSides': string;
      'notEqualToAdjacentSidesStringProperty': LinkableProperty<string>;
      'notEqualToParallelAdjacentSides': string;
      'notEqualToParallelAdjacentSidesStringProperty': LinkableProperty<string>;
      'back': string;
      'backStringProperty': LinkableProperty<string>;
      'gone': string;
      'goneStringProperty': LinkableProperty<string>;
      'cornersBack': string;
      'cornersBackStringProperty': LinkableProperty<string>;
      'cornersGone': string;
      'cornersGoneStringProperty': LinkableProperty<string>;
      'cornerDetectedPattern': string;
      'cornerDetectedPatternStringProperty': LinkableProperty<string>;
      'shapeSoundControl': {
        'nameResponse': string;
        'nameResponseStringProperty': LinkableProperty<string>;
        'enabledContextResponse': string;
        'enabledContextResponseStringProperty': LinkableProperty<string>;
        'disabledContextResponse': string;
        'disabledContextResponseStringProperty': LinkableProperty<string>;
        'hintResponse': string;
        'hintResponseStringProperty': LinkableProperty<string>;
      };
      'resetShape': {
        'contextResponse': string;
        'contextResponseStringProperty': LinkableProperty<string>;
      };
      'foundShapePattern': string;
      'foundShapePatternStringProperty': LinkableProperty<string>;
      'shapeNameHiddenContextResponse': string;
      'shapeNameHiddenContextResponseStringProperty': LinkableProperty<string>;
      'shapeNameShownContextResponse': string;
      'shapeNameShownContextResponseStringProperty': LinkableProperty<string>;
      'resetShapeHintResponse': string;
      'resetShapeHintResponseStringProperty': LinkableProperty<string>;
      'angleComparisonPattern': string;
      'angleComparisonPatternStringProperty': LinkableProperty<string>;
      'equalToOppositeCornerEqualToAdjacentCorners': string;
      'equalToOppositeCornerEqualToAdjacentCornersStringProperty': LinkableProperty<string>;
      'oppositeCorner': string;
      'oppositeCornerStringProperty': LinkableProperty<string>;
      'adjacentCornersEqual': string;
      'adjacentCornersEqualStringProperty': LinkableProperty<string>;
      'adjacentCornersRightAngles': string;
      'adjacentCornersRightAnglesStringProperty': LinkableProperty<string>;
      'allCornersEqual': string;
      'allCornersEqualStringProperty': LinkableProperty<string>;
      'progressStatePattern': string;
      'progressStatePatternStringProperty': LinkableProperty<string>;
      'blockedByEdgeString': string;
      'blockedByEdgeStringStringProperty': LinkableProperty<string>;
      'blockedByInnerShapeString': string;
      'blockedByInnerShapeStringStringProperty': LinkableProperty<string>;
      'minorIntervalsToggle': {
        'hintResponse': string;
        'hintResponseStringProperty': LinkableProperty<string>;
        'lockedNameResponse': string;
        'lockedNameResponseStringProperty': LinkableProperty<string>;
        'unlockedNameResponse': string;
        'unlockedNameResponseStringProperty': LinkableProperty<string>;
        'lockedContextResponse': string;
        'lockedContextResponseStringProperty': LinkableProperty<string>;
        'unlockedContextResponse': string;
        'unlockedContextResponseStringProperty': LinkableProperty<string>;
      }
    };
    'keyboardHelpDialog': {
      'checkShapeDescriptionPattern': string;
      'checkShapeDescriptionPatternStringProperty': LinkableProperty<string>;
      'resetShapeDescriptionPattern': string;
      'resetShapeDescriptionPatternStringProperty': LinkableProperty<string>;
      'moveShapeDescription': string;
      'moveShapeDescriptionStringProperty': LinkableProperty<string>;
      'smallerStepsDescription': string;
      'smallerStepsDescriptionStringProperty': LinkableProperty<string>;
    };
    'preferencesDialog': {
      'soundDesignRadioButtons': {
        'layeredContextResponse': string;
        'layeredContextResponseStringProperty': LinkableProperty<string>;
        'emphasisContextResponse': string;
        'emphasisContextResponseStringProperty': LinkableProperty<string>;
      };
      'tracksPlayForeverCheckbox': {
        'checkedContextResponse': string;
        'checkedContextResponseStringProperty': LinkableProperty<string>;
        'uncheckedContextResponse': string;
        'uncheckedContextResponseStringProperty': LinkableProperty<string>;
      }
    }
  }
};

const QuadrilateralStrings = getStringModule( 'QUADRILATERAL' ) as StringsType;

quadrilateral.register( 'QuadrilateralStrings', QuadrilateralStrings );

export default QuadrilateralStrings;

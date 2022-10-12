// Copyright 2021-2022, University of Colorado Boulder

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
  'angles': string;
  'anglesStringProperty': LinkableProperty<string>;
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
  'fineInputSpacing': string;
  'fineInputSpacingStringProperty': LinkableProperty<string>;
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
  };
  'hapticsDialogMessage': string;
  'hapticsDialogMessageStringProperty': LinkableProperty<string>;
  'gotIt': string;
  'gotItStringProperty': LinkableProperty<string>;
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
    'angleGuidesAddedResponse': string;
    'angleGuidesAddedResponseStringProperty': LinkableProperty<string>;
    'angleGuidesRemovedResponse': string;
    'angleGuidesRemovedResponseStringProperty': LinkableProperty<string>;
    'angleGuidesHintResponse': string;
    'angleGuidesHintResponseStringProperty': LinkableProperty<string>;
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
      'hintContentPattern': string;
      'hintContentPatternStringProperty': LinkableProperty<string>;
      'youHaveAShapeHintPattern': string;
      'youHaveAShapeHintPatternStringProperty': LinkableProperty<string>;
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
      'foundTrapezoidPattern': string;
      'foundTrapezoidPatternStringProperty': LinkableProperty<string>;
      'foundIsoscelesTrapezoidPattern': string;
      'foundIsoscelesTrapezoidPatternStringProperty': LinkableProperty<string>;
      'foundKitePattern': string;
      'foundKitePatternStringProperty': LinkableProperty<string>;
      'foundDartPattern': string;
      'foundDartPatternStringProperty': LinkableProperty<string>;
      'foundConvexQuadrilateral': string;
      'foundConvexQuadrilateralStringProperty': LinkableProperty<string>;
      'foundConcaveQuadrilateralPattern': string;
      'foundConcaveQuadrilateralPatternStringProperty': LinkableProperty<string>;
      'vertexObjectResponsePattern': string;
      'vertexObjectResponsePatternStringProperty': LinkableProperty<string>;
      'rightAngleVertexObjectResponsePattern': string;
      'rightAngleVertexObjectResponsePatternStringProperty': LinkableProperty<string>;
      'vertexObjectResponseWithSlicesPattern': string;
      'vertexObjectResponseWithSlicesPatternStringProperty': LinkableProperty<string>;
      'rightAngle': string;
      'rightAngleStringProperty': LinkableProperty<string>;
      'angleFlat': string;
      'angleFlatStringProperty': LinkableProperty<string>;
      'oneSlice': string;
      'oneSliceStringProperty': LinkableProperty<string>;
      'halfOneSlice': string;
      'halfOneSliceStringProperty': LinkableProperty<string>;
      'lessThanHalfOneSlice': string;
      'lessThanHalfOneSliceStringProperty': LinkableProperty<string>;
      'justUnderOneSlice': string;
      'justUnderOneSliceStringProperty': LinkableProperty<string>;
      'justOverOneSlice': string;
      'justOverOneSliceStringProperty': LinkableProperty<string>;
      'numberOfSlicesPattern': string;
      'numberOfSlicesPatternStringProperty': LinkableProperty<string>;
      'numberOfSlicesAndAHalfPattern': string;
      'numberOfSlicesAndAHalfPatternStringProperty': LinkableProperty<string>;
      'justOverNumberOfSlicesPattern': string;
      'justOverNumberOfSlicesPatternStringProperty': LinkableProperty<string>;
      'justUnderNumberOfSlicesPattern': string;
      'justUnderNumberOfSlicesPatternStringProperty': LinkableProperty<string>;
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
      'resetShapeControl': {
        'shapeShownContextResponse': string;
        'shapeShownContextResponseStringProperty': LinkableProperty<string>;
        'shapeHiddenContextResponse': string;
        'shapeHiddenContextResponseStringProperty': LinkableProperty<string>;
      };
      'foundShapePattern': string;
      'foundShapePatternStringProperty': LinkableProperty<string>;
      'shapeNameHiddenContextResponse': string;
      'shapeNameHiddenContextResponseStringProperty': LinkableProperty<string>;
      'shapeNameShownContextResponse': string;
      'shapeNameShownContextResponseStringProperty': LinkableProperty<string>;
    }
  }
};

const QuadrilateralStrings = getStringModule( 'QUADRILATERAL' ) as StringsType;

quadrilateral.register( 'QuadrilateralStrings', QuadrilateralStrings );

export default QuadrilateralStrings;

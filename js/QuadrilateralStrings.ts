// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import quadrilateral from './quadrilateral.js';

type StringsType = {
  'quadrilateral': {
    'title': string;
    'titleStringProperty': TReadOnlyProperty<string>;
  };
  'cornerLabels': string;
  'cornerLabelsStringProperty': TReadOnlyProperty<string>;
  'labels': string;
  'labelsStringProperty': TReadOnlyProperty<string>;
  'corners': string;
  'cornersStringProperty': TReadOnlyProperty<string>;
  'diagonals': string;
  'diagonalsStringProperty': TReadOnlyProperty<string>;
  'grid': string;
  'gridStringProperty': TReadOnlyProperty<string>;
  'music': string;
  'musicStringProperty': TReadOnlyProperty<string>;
  'cornerGuides': string;
  'cornerGuidesStringProperty': TReadOnlyProperty<string>;
  'diagonalGuides': string;
  'diagonalGuidesStringProperty': TReadOnlyProperty<string>;
  'vertexA': string;
  'vertexAStringProperty': TReadOnlyProperty<string>;
  'vertexB': string;
  'vertexBStringProperty': TReadOnlyProperty<string>;
  'vertexC': string;
  'vertexCStringProperty': TReadOnlyProperty<string>;
  'vertexD': string;
  'vertexDStringProperty': TReadOnlyProperty<string>;
  'showShapeName': string;
  'showShapeNameStringProperty': TReadOnlyProperty<string>;
  'resetShape': string;
  'resetShapeStringProperty': TReadOnlyProperty<string>;
  'playMusic': string;
  'playMusicStringProperty': TReadOnlyProperty<string>;
  'fineInputSpacing': string;
  'fineInputSpacingStringProperty': TReadOnlyProperty<string>;
  'shapeNames': {
    'square': string;
    'squareStringProperty': TReadOnlyProperty<string>;
    'rectangle': string;
    'rectangleStringProperty': TReadOnlyProperty<string>;
    'rhombus': string;
    'rhombusStringProperty': TReadOnlyProperty<string>;
    'kite': string;
    'kiteStringProperty': TReadOnlyProperty<string>;
    'isoscelesTrapezoid': string;
    'isoscelesTrapezoidStringProperty': TReadOnlyProperty<string>;
    'trapezoid': string;
    'trapezoidStringProperty': TReadOnlyProperty<string>;
    'concaveQuadrilateral': string;
    'concaveQuadrilateralStringProperty': TReadOnlyProperty<string>;
    'convexQuadrilateral': string;
    'convexQuadrilateralStringProperty': TReadOnlyProperty<string>;
    'parallelogram': string;
    'parallelogramStringProperty': TReadOnlyProperty<string>;
    'dart': string;
    'dartStringProperty': TReadOnlyProperty<string>;
  };
  'hapticsDialogMessage': string;
  'hapticsDialogMessageStringProperty': TReadOnlyProperty<string>;
  'gotIt': string;
  'gotItStringProperty': TReadOnlyProperty<string>;
  'a11y': {
    'screenSummary': {
      'playAreaDescription': string;
      'playAreaDescriptionStringProperty': TReadOnlyProperty<string>;
      'controlAreaDescription': string;
      'controlAreaDescriptionStringProperty': TReadOnlyProperty<string>;
    };
    'cornerLabelsAddedResponse': string;
    'cornerLabelsAddedResponseStringProperty': TReadOnlyProperty<string>;
    'cornerLabelsRemovedResponse': string;
    'cornerLabelsRemovedResponseStringProperty': TReadOnlyProperty<string>;
    'cornerLabelsHintResponse': string;
    'cornerLabelsHintResponseStringProperty': TReadOnlyProperty<string>;
    'angleGuidesAddedResponse': string;
    'angleGuidesAddedResponseStringProperty': TReadOnlyProperty<string>;
    'angleGuidesRemovedResponse': string;
    'angleGuidesRemovedResponseStringProperty': TReadOnlyProperty<string>;
    'angleGuidesHintResponse': string;
    'angleGuidesHintResponseStringProperty': TReadOnlyProperty<string>;
    'gridLinesAddedResponse': string;
    'gridLinesAddedResponseStringProperty': TReadOnlyProperty<string>;
    'gridLinesRemovedResponse': string;
    'gridLinesRemovedResponseStringProperty': TReadOnlyProperty<string>;
    'diagonalGuidesAddedResponse': string;
    'diagonalGuidesAddedResponseStringProperty': TReadOnlyProperty<string>;
    'diagonalGuidesRemovedResponse': string;
    'diagonalGuidesRemovedResponseStringProperty': TReadOnlyProperty<string>;
    'diagonalGuidesHintResponse': string;
    'diagonalGuidesHintResponseStringProperty': TReadOnlyProperty<string>;
    'gridLinesHintResponse': string;
    'gridLinesHintResponseStringProperty': TReadOnlyProperty<string>;
    'myShapesCorners': string;
    'myShapesCornersStringProperty': TReadOnlyProperty<string>;
    'myShapesSides': string;
    'myShapesSidesStringProperty': TReadOnlyProperty<string>;
    'cornerA': string;
    'cornerAStringProperty': TReadOnlyProperty<string>;
    'cornerB': string;
    'cornerBStringProperty': TReadOnlyProperty<string>;
    'cornerC': string;
    'cornerCStringProperty': TReadOnlyProperty<string>;
    'cornerD': string;
    'cornerDStringProperty': TReadOnlyProperty<string>;
    'topSide': string;
    'topSideStringProperty': TReadOnlyProperty<string>;
    'rightSide': string;
    'rightSideStringProperty': TReadOnlyProperty<string>;
    'bottomSide': string;
    'bottomSideStringProperty': TReadOnlyProperty<string>;
    'leftSide': string;
    'leftSideStringProperty': TReadOnlyProperty<string>;
    'aB': string;
    'aBStringProperty': TReadOnlyProperty<string>;
    'bC': string;
    'bCStringProperty': TReadOnlyProperty<string>;
    'cD': string;
    'cDStringProperty': TReadOnlyProperty<string>;
    'dA': string;
    'dAStringProperty': TReadOnlyProperty<string>;
    'voicing': {
      'overviewContent': string;
      'overviewContentStringProperty': TReadOnlyProperty<string>;
      'hintContentPattern': string;
      'hintContentPatternStringProperty': TReadOnlyProperty<string>;
      'youHaveAShapeHintPattern': string;
      'youHaveAShapeHintPatternStringProperty': TReadOnlyProperty<string>;
      'namedShapeParalleogramHintPattern': string;
      'namedShapeParalleogramHintPatternStringProperty': TReadOnlyProperty<string>;
      'namedShapeNotAParallelogramHintPattern': string;
      'namedShapeNotAParallelogramHintPatternStringProperty': TReadOnlyProperty<string>;
      'detailsPattern': string;
      'detailsPatternStringProperty': TReadOnlyProperty<string>;
      'firstDetailsStatementPattern': string;
      'firstDetailsStatementPatternStringProperty': TReadOnlyProperty<string>;
      'details': {
        'all': string;
        'allStringProperty': TReadOnlyProperty<string>;
        'opposite': string;
        'oppositeStringProperty': TReadOnlyProperty<string>;
        'rightAngles': string;
        'rightAnglesStringProperty': TReadOnlyProperty<string>;
        'equal': string;
        'equalStringProperty': TReadOnlyProperty<string>;
        'pairsOfAdjacent': string;
        'pairsOfAdjacentStringProperty': TReadOnlyProperty<string>;
        'onePairOfAdjacent': string;
        'onePairOfAdjacentStringProperty': TReadOnlyProperty<string>;
        'onePairOfOpposite': string;
        'onePairOfOppositeStringProperty': TReadOnlyProperty<string>;
        'noString': string;
        'noStringStringProperty': TReadOnlyProperty<string>;
        'cornersPattern': string;
        'cornersPatternStringProperty': TReadOnlyProperty<string>;
        'cornerPointsPattern': string;
        'cornerPointsPatternStringProperty': TReadOnlyProperty<string>;
        'cornerConcavePattern': string;
        'cornerConcavePatternStringProperty': TReadOnlyProperty<string>;
        'sidesPattern': string;
        'sidesPatternStringProperty': TReadOnlyProperty<string>;
        'kiteSidesPattern': string;
        'kiteSidesPatternStringProperty': TReadOnlyProperty<string>;
        'trapezoidSidesPattern': string;
        'trapezoidSidesPatternStringProperty': TReadOnlyProperty<string>;
        'equalSidesPattern': string;
        'equalSidesPatternStringProperty': TReadOnlyProperty<string>;
        'twoStatementPattern': string;
        'twoStatementPatternStringProperty': TReadOnlyProperty<string>;
        'sideConcavePattern': string;
        'sideConcavePatternStringProperty': TReadOnlyProperty<string>;
        'generalSidePattern': string;
        'generalSidePatternStringProperty': TReadOnlyProperty<string>;
        'generalSideWithOneAdjacentEqualPairPattern': string;
        'generalSideWithOneAdjacentEqualPairPatternStringProperty': TReadOnlyProperty<string>;
        'generalVertexPattern': string;
        'generalVertexPatternStringProperty': TReadOnlyProperty<string>;
        'cornerAnglePattern': string;
        'cornerAnglePatternStringProperty': TReadOnlyProperty<string>;
        'rightAngleCornersPattern': string;
        'rightAngleCornersPatternStringProperty': TReadOnlyProperty<string>;
        'twoEqualVerticesAnglePattern': string;
        'twoEqualVerticesAnglePatternStringProperty': TReadOnlyProperty<string>;
        'twoPairsOfEqualVerticesPattern': string;
        'twoPairsOfEqualVerticesPatternStringProperty': TReadOnlyProperty<string>;
        'cornersAnglePattern': string;
        'cornersAnglePatternStringProperty': TReadOnlyProperty<string>;
      };
      'oppositeSidesTiltPattern': string;
      'oppositeSidesTiltPatternStringProperty': TReadOnlyProperty<string>;
      'oppositeSidesInParallelPattern': string;
      'oppositeSidesInParallelPatternStringProperty': TReadOnlyProperty<string>;
      'oppositeSidesInParallelAsCornersChangeEquallyPattern': string;
      'oppositeSidesInParallelAsCornersChangeEquallyPatternStringProperty': TReadOnlyProperty<string>;
      'oppositeSidesTiltAsShapeChangesPattern': string;
      'oppositeSidesTiltAsShapeChangesPatternStringProperty': TReadOnlyProperty<string>;
      'allSidesTiltAwayFromParallel': string;
      'allSidesTiltAwayFromParallelStringProperty': TReadOnlyProperty<string>;
      'allSidesTiltAwayFromParallelAsShapeChangesPattern': string;
      'allSidesTiltAwayFromParallelAsShapeChangesPatternStringProperty': TReadOnlyProperty<string>;
      'tilt': string;
      'tiltStringProperty': TReadOnlyProperty<string>;
      'straighten': string;
      'straightenStringProperty': TReadOnlyProperty<string>;
      'bigger': string;
      'biggerStringProperty': TReadOnlyProperty<string>;
      'smaller': string;
      'smallerStringProperty': TReadOnlyProperty<string>;
      'shapeNames': {
        'square': string;
        'squareStringProperty': TReadOnlyProperty<string>;
        'rectangle': string;
        'rectangleStringProperty': TReadOnlyProperty<string>;
        'rhombus': string;
        'rhombusStringProperty': TReadOnlyProperty<string>;
        'kite': string;
        'kiteStringProperty': TReadOnlyProperty<string>;
        'isoscelesTrapezoid': string;
        'isoscelesTrapezoidStringProperty': TReadOnlyProperty<string>;
        'trapezoid': string;
        'trapezoidStringProperty': TReadOnlyProperty<string>;
        'concaveQuadrilateral': string;
        'concaveQuadrilateralStringProperty': TReadOnlyProperty<string>;
        'convexQuadrilateral': string;
        'convexQuadrilateralStringProperty': TReadOnlyProperty<string>;
        'parallelogram': string;
        'parallelogramStringProperty': TReadOnlyProperty<string>;
        'dart': string;
        'dartStringProperty': TReadOnlyProperty<string>;
      };
      'transformations': {
        'tiltingPattern': string;
        'tiltingPatternStringProperty': TReadOnlyProperty<string>;
        'oppositeSides': string;
        'oppositeSidesStringProperty': TReadOnlyProperty<string>;
        'rightSide': string;
        'rightSideStringProperty': TReadOnlyProperty<string>;
        'leftSide': string;
        'leftSideStringProperty': TReadOnlyProperty<string>;
        'upperSide': string;
        'upperSideStringProperty': TReadOnlyProperty<string>;
        'lowerSide': string;
        'lowerSideStringProperty': TReadOnlyProperty<string>;
        'up': string;
        'upStringProperty': TReadOnlyProperty<string>;
        'down': string;
        'downStringProperty': TReadOnlyProperty<string>;
        'left': string;
        'leftStringProperty': TReadOnlyProperty<string>;
        'right': string;
        'rightStringProperty': TReadOnlyProperty<string>;
        'keepingAParallelogram': string;
        'keepingAParallelogramStringProperty': TReadOnlyProperty<string>;
        'youLostYourParallelogramPattern': string;
        'youLostYourParallelogramPatternStringProperty': TReadOnlyProperty<string>;
        'youMadeAParallelogram': string;
        'youMadeAParallelogramStringProperty': TReadOnlyProperty<string>;
        'extremelyFarFrom': string;
        'extremelyFarFromStringProperty': TReadOnlyProperty<string>;
        'veryFarFrom': string;
        'veryFarFromStringProperty': TReadOnlyProperty<string>;
        'farFrom': string;
        'farFromStringProperty': TReadOnlyProperty<string>;
        'notSoCloseTo': string;
        'notSoCloseToStringProperty': TReadOnlyProperty<string>;
        'somewhatCloseTo': string;
        'somewhatCloseToStringProperty': TReadOnlyProperty<string>;
        'veryCloseTo': string;
        'veryCloseToStringProperty': TReadOnlyProperty<string>;
        'extremelyCloseTo': string;
        'extremelyCloseToStringProperty': TReadOnlyProperty<string>;
        'proximityToParallelogramPattern': string;
        'proximityToParallelogramPatternStringProperty': TReadOnlyProperty<string>;
      };
      'foundAParallelogram': string;
      'foundAParallelogramStringProperty': TReadOnlyProperty<string>;
      'lostYourParallelogram': string;
      'lostYourParallelogramStringProperty': TReadOnlyProperty<string>;
      'foundAParallelogramWithAllRightAngles': string;
      'foundAParallelogramWithAllRightAnglesStringProperty': TReadOnlyProperty<string>;
      'foundAParallelogramWithAllSidesEqual': string;
      'foundAParallelogramWithAllSidesEqualStringProperty': TReadOnlyProperty<string>;
      'foundParallelogramWithAnglesAndSidesEqual': string;
      'foundParallelogramWithAnglesAndSidesEqualStringProperty': TReadOnlyProperty<string>;
      'allRightAnglesAndAllSidesEqual': string;
      'allRightAnglesAndAllSidesEqualStringProperty': TReadOnlyProperty<string>;
      'allSidesEqual': string;
      'allSidesEqualStringProperty': TReadOnlyProperty<string>;
      'allRightAngles': string;
      'allRightAnglesStringProperty': TReadOnlyProperty<string>;
      'oppositeSidesInParallel': string;
      'oppositeSidesInParallelStringProperty': TReadOnlyProperty<string>;
      'foundTrapezoidPattern': string;
      'foundTrapezoidPatternStringProperty': TReadOnlyProperty<string>;
      'foundIsoscelesTrapezoidPattern': string;
      'foundIsoscelesTrapezoidPatternStringProperty': TReadOnlyProperty<string>;
      'foundKitePattern': string;
      'foundKitePatternStringProperty': TReadOnlyProperty<string>;
      'foundDartPattern': string;
      'foundDartPatternStringProperty': TReadOnlyProperty<string>;
      'foundConvexQuadrilateral': string;
      'foundConvexQuadrilateralStringProperty': TReadOnlyProperty<string>;
      'foundConcaveQuadrilateralPattern': string;
      'foundConcaveQuadrilateralPatternStringProperty': TReadOnlyProperty<string>;
      'vertexObjectResponsePattern': string;
      'vertexObjectResponsePatternStringProperty': TReadOnlyProperty<string>;
      'rightAngleVertexObjectResponsePattern': string;
      'rightAngleVertexObjectResponsePatternStringProperty': TReadOnlyProperty<string>;
      'vertexDragObjectResponse': {
        'wider': string;
        'widerStringProperty': TReadOnlyProperty<string>;
        'smaller': string;
        'smallerStringProperty': TReadOnlyProperty<string>;
        'fartherFrom': string;
        'fartherFromStringProperty': TReadOnlyProperty<string>;
        'closerTo': string;
        'closerToStringProperty': TReadOnlyProperty<string>;
        'fullVertexDragObjectResponsePattern': string;
        'fullVertexDragObjectResponsePatternStringProperty': TReadOnlyProperty<string>;
        'partialVertexDragObjectResponsePattern': string;
        'partialVertexDragObjectResponsePatternStringProperty': TReadOnlyProperty<string>;
      };
      'sideDragObjectResponse': {
        'shorter': string;
        'shorterStringProperty': TReadOnlyProperty<string>;
        'longer': string;
        'longerStringProperty': TReadOnlyProperty<string>;
        'sideDragObjectResponsePattern': string;
        'sideDragObjectResponsePatternStringProperty': TReadOnlyProperty<string>;
      };
      'farWiderThan': string;
      'farWiderThanStringProperty': TReadOnlyProperty<string>;
      'farSmallerThan': string;
      'farSmallerThanStringProperty': TReadOnlyProperty<string>;
      'muchMuchWiderThan': string;
      'muchMuchWiderThanStringProperty': TReadOnlyProperty<string>;
      'muchMuchSmallerThan': string;
      'muchMuchSmallerThanStringProperty': TReadOnlyProperty<string>;
      'muchWiderThan': string;
      'muchWiderThanStringProperty': TReadOnlyProperty<string>;
      'muchSmallerThan': string;
      'muchSmallerThanStringProperty': TReadOnlyProperty<string>;
      'somewhatWiderThan': string;
      'somewhatWiderThanStringProperty': TReadOnlyProperty<string>;
      'somewhatSmallerThan': string;
      'somewhatSmallerThanStringProperty': TReadOnlyProperty<string>;
      'aLittleWiderThan': string;
      'aLittleWiderThanStringProperty': TReadOnlyProperty<string>;
      'aLittleSmallerThan': string;
      'aLittleSmallerThanStringProperty': TReadOnlyProperty<string>;
      'halfTheSizeOf': string;
      'halfTheSizeOfStringProperty': TReadOnlyProperty<string>;
      'twiceTheSizeOf': string;
      'twiceTheSizeOfStringProperty': TReadOnlyProperty<string>;
      'smallerAndSimilarTo': string;
      'smallerAndSimilarToStringProperty': TReadOnlyProperty<string>;
      'widerAndSimilarTo': string;
      'widerAndSimilarToStringProperty': TReadOnlyProperty<string>;
      'almostEqualTo': string;
      'almostEqualToStringProperty': TReadOnlyProperty<string>;
      'equalTo': string;
      'equalToStringProperty': TReadOnlyProperty<string>;
      'equalToAdjacentCorners': string;
      'equalToAdjacentCornersStringProperty': TReadOnlyProperty<string>;
      'equalToOneAdjacentCorner': string;
      'equalToOneAdjacentCornerStringProperty': TReadOnlyProperty<string>;
      'equalAdjacentCornersPattern': string;
      'equalAdjacentCornersPatternStringProperty': TReadOnlyProperty<string>;
      'smallerThanAdjacentCorners': string;
      'smallerThanAdjacentCornersStringProperty': TReadOnlyProperty<string>;
      'widerThanAdjacentCorners': string;
      'widerThanAdjacentCornersStringProperty': TReadOnlyProperty<string>;
      'notEqualToAdjacentCorners': string;
      'notEqualToAdjacentCornersStringProperty': TReadOnlyProperty<string>;
      'farLongerThan': string;
      'farLongerThanStringProperty': TReadOnlyProperty<string>;
      'farShorterThan': string;
      'farShorterThanStringProperty': TReadOnlyProperty<string>;
      'muchMuchLongerThan': string;
      'muchMuchLongerThanStringProperty': TReadOnlyProperty<string>;
      'muchMuchShorterThan': string;
      'muchMuchShorterThanStringProperty': TReadOnlyProperty<string>;
      'muchLongerThan': string;
      'muchLongerThanStringProperty': TReadOnlyProperty<string>;
      'muchShorterThan': string;
      'muchShorterThanStringProperty': TReadOnlyProperty<string>;
      'somewhatLongerThan': string;
      'somewhatLongerThanStringProperty': TReadOnlyProperty<string>;
      'somewhatShorterThan': string;
      'somewhatShorterThanStringProperty': TReadOnlyProperty<string>;
      'aLittleLongerThan': string;
      'aLittleLongerThanStringProperty': TReadOnlyProperty<string>;
      'aLittleShorterThan': string;
      'aLittleShorterThanStringProperty': TReadOnlyProperty<string>;
      'parallelSideObjectResponsePattern': string;
      'parallelSideObjectResponsePatternStringProperty': TReadOnlyProperty<string>;
      'sideObjectResponsePattern': string;
      'sideObjectResponsePatternStringProperty': TReadOnlyProperty<string>;
      'equalToAdjacentSides': string;
      'equalToAdjacentSidesStringProperty': TReadOnlyProperty<string>;
      'equalToParallelAdjacentSides': string;
      'equalToParallelAdjacentSidesStringProperty': TReadOnlyProperty<string>;
      'equalToOneAdjacentSide': string;
      'equalToOneAdjacentSideStringProperty': TReadOnlyProperty<string>;
      'equalAdjacentSidesPattern': string;
      'equalAdjacentSidesPatternStringProperty': TReadOnlyProperty<string>;
      'equalAdjacentParallelSidesPattern': string;
      'equalAdjacentParallelSidesPatternStringProperty': TReadOnlyProperty<string>;
      'shorterThanAdjacentSides': string;
      'shorterThanAdjacentSidesStringProperty': TReadOnlyProperty<string>;
      'shorterThanParallelAdjacentSides': string;
      'shorterThanParallelAdjacentSidesStringProperty': TReadOnlyProperty<string>;
      'longerThanAdjacentSides': string;
      'longerThanAdjacentSidesStringProperty': TReadOnlyProperty<string>;
      'longerThanParallelAdjacentSides': string;
      'longerThanParallelAdjacentSidesStringProperty': TReadOnlyProperty<string>;
      'notEqualToAdjacentSides': string;
      'notEqualToAdjacentSidesStringProperty': TReadOnlyProperty<string>;
      'notEqualToParallelAdjacentSides': string;
      'notEqualToParallelAdjacentSidesStringProperty': TReadOnlyProperty<string>;
      'back': string;
      'backStringProperty': TReadOnlyProperty<string>;
      'gone': string;
      'goneStringProperty': TReadOnlyProperty<string>;
      'cornersBack': string;
      'cornersBackStringProperty': TReadOnlyProperty<string>;
      'cornersGone': string;
      'cornersGoneStringProperty': TReadOnlyProperty<string>;
      'cornerDetectedPattern': string;
      'cornerDetectedPatternStringProperty': TReadOnlyProperty<string>;
      'musicControl': {
        'nameResponse': string;
        'nameResponseStringProperty': TReadOnlyProperty<string>;
        'enabledContextResponse': string;
        'enabledContextResponseStringProperty': TReadOnlyProperty<string>;
        'disabledContextResponse': string;
        'disabledContextResponseStringProperty': TReadOnlyProperty<string>;
      };
      'resetShapeControl': {
        'shapeShownContextResponse': string;
        'shapeShownContextResponseStringProperty': TReadOnlyProperty<string>;
        'shapeHiddenContextResponse': string;
        'shapeHiddenContextResponseStringProperty': TReadOnlyProperty<string>;
      };
      'foundShapePattern': string;
      'foundShapePatternStringProperty': TReadOnlyProperty<string>;
    }
  }
};

const QuadrilateralStrings = getStringModule( 'QUADRILATERAL' ) as StringsType;

quadrilateral.register( 'QuadrilateralStrings', QuadrilateralStrings );

export default QuadrilateralStrings;

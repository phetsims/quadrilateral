// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import quadrilateral from './quadrilateral.js';

type StringsType = {
  'quadrilateral': {
    'title': string;
  };
  'cornerLabels': string;
  'cornerGuides': string;
  'symmetryGrid': string;
  'vertexA': string;
  'vertexB': string;
  'vertexC': string;
  'vertexD': string;
  'hapticsDialogMessage': string;
  'gotIt': string;
  'a11y': {
    'screenSummary': {
      'playAreaDescription': string;
      'controlAreaDescription': string;
    };
    'cornerLabelsAddedResponse': string;
    'cornerLabelsRemovedResponse': string;
    'cornerLabelsHintResponse': string;
    'angleGuidesAddedResponse': string;
    'angleGuidesRemovedResponse': string;
    'angleGuidesHintResponse': string;
    'symmetryLinesAddedResponse': string;
    'symmetryLinesRemovedResponse': string;
    'symmetryLinesHintResponse': string;
    'myShapesCorners': string;
    'myShapesSides': string;
    'cornerA': string;
    'cornerB': string;
    'cornerC': string;
    'cornerD': string;
    'topSide': string;
    'rightSide': string;
    'bottomSide': string;
    'leftSide': string;
    'aB': string;
    'bC': string;
    'cD': string;
    'dA': string;
    'voicing': {
      'overviewContent': string;
      'hintContentPattern': string;
      'youHaveAShapeHintPattern': string;
      'namedShapeParalleogramHintPattern': string;
      'namedShapeNotAParallelogramHintPattern': string;
      'aParallelogram': string;
      'detailsPattern': string;
      'firstDetailsStatementPattern': string;
      'details': {
        'all': string;
        'opposite': string;
        'rightAngles': string;
        'equal': string;
        'pairsOfAdjacent': string;
        'onePairOfAdjacent': string;
        'onePairOfOpposite': string;
        'noString': string;
        'cornersPattern': string;
        'cornerPointsPattern': string;
        'cornerConcavePattern': string;
        'sidesPattern': string;
        'kiteSidesPattern': string;
        'trapezoidSidesPattern': string;
        'equalSidesPattern': string;
        'twoStatementPattern': string;
        'sideConcavePattern': string;
        'generalSidePattern': string;
        'generalSideWithOneAdjacentEqualPairPattern': string;
        'generalVertexPattern': string;
        'cornerAnglePattern': string;
        'rightAngleCornersPattern': string;
        'twoEqualVerticesAnglePattern': string;
        'twoPairsOfEqualVerticesPattern': string;
        'cornersAnglePattern': string;
      };
      'oppositeSidesTiltPattern': string;
      'oppositeSidesInParallelPattern': string;
      'oppositeSidesInParallelAsCornersChangeEquallyPattern': string;
      'oppositeSidesTiltAsShapeChangesPattern': string;
      'allSidesTiltAwayFromParallel': string;
      'allSidesTiltAwayFromParallelAsShapeChangesPattern': string;
      'tilt': string;
      'straighten': string;
      'bigger': string;
      'smaller': string;
      'shapeNames': {
        'square': string;
        'rectangle': string;
        'rhombus': string;
        'kite': string;
        'isoscelesTrapezoid': string;
        'trapezoid': string;
        'concaveQuadrilateral': string;
        'convexQuadrilateral': string;
        'parallelogram': string;
      };
      'transformations': {
        'tiltingPattern': string;
        'oppositeSides': string;
        'rightSide': string;
        'leftSide': string;
        'upperSide': string;
        'lowerSide': string;
        'up': string;
        'down': string;
        'left': string;
        'right': string;
        'keepingAParallelogram': string;
        'youLostYourParallelogramPattern': string;
        'youMadeAParallelogram': string;
        'extremelyFarFrom': string;
        'veryFarFrom': string;
        'farFrom': string;
        'notSoCloseTo': string;
        'somewhatCloseTo': string;
        'veryCloseTo': string;
        'extremelyCloseTo': string;
        'proximityToParallelogramPattern': string;
      };
      'foundAParallelogram': string;
      'lostYourParallelogram': string;
      'foundAParallelogramWithAllRightAngles': string;
      'foundAParallelogramWithAllSidesEqual': string;
      'foundParallelogramWithAnglesAndSidesEqual': string;
      'allRightAnglesAndSidesEqual': string;
      'allSidesEqual': string;
      'allRightAngles': string;
      'vertexObjectResponsePattern': string;
      'rightAngleVertexObjectResponsePattern': string;
      'farWiderThan': string;
      'farSmallerThan': string;
      'muchMuchWiderThan': string;
      'muchMuchSmallerThan': string;
      'muchWiderThan': string;
      'muchSmallerThan': string;
      'somewhatWiderThan': string;
      'somewhatSmallerThan': string;
      'aLittleWiderThan': string;
      'aLittleSmallerThan': string;
      'comparableTo': string;
      'equalTo': string;
      'equalToAdjacentCorners': string;
      'equalToOneAdjacentCorner': string;
      'equalAdjacentCornersPattern': string;
      'smallerThanAdjacentCorners': string;
      'widerThanAdjacentCorners': string;
      'notEqualToAdjacentCorners': string;
      'farLongerThan': string;
      'farShorterThan': string;
      'muchMuchLongerThan': string;
      'muchMuchShorterThan': string;
      'muchLongerThan': string;
      'muchShorterThan': string;
      'somewhatLongerThan': string;
      'somewhatShorterThan': string;
      'aLittleLongerThan': string;
      'aLittleShorterThan': string;
      'parallelSideObjectResponsePattern': string;
      'sideObjectResponsePattern': string;
      'equalToAdjacentSides': string;
      'equalToParallelAdjacentSides': string;
      'equalToOneAdjacentSide': string;
      'equalAdjacentSidesPattern': string;
      'equalAdjacentParallelSidesPattern': string;
      'shorterThanAdjacentSides': string;
      'shorterThanParallelAdjacentSides': string;
      'longerThanAdjacentSides': string;
      'longerThanParallelAdjacentSides': string;
      'notEqualToAdjacentSides': string;
      'notEqualToParallelAdjacentSides': string;
      'back': string;
      'gone': string;
      'cornersBack': string;
      'cornersGone': string;
      'cornerDetectedPattern': string;
    }
  }
};

const quadrilateralStrings = getStringModule( 'QUADRILATERAL' ) as StringsType;

quadrilateral.register( 'quadrilateralStrings', quadrilateralStrings );

export default quadrilateralStrings;

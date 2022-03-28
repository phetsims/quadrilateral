// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import quadrilateral from './quadrilateral.js';

type StringsType = {
  'quadrilateral': {
    'title': string
  },
  'cornerLabels': string,
  'cornerGuides': string,
  'vertexA': string,
  'vertexB': string,
  'vertexC': string,
  'vertexD': string,
  'a11y': {
    'screenSummary': {
      'playAreaDescription': string,
      'controlAreaDescription': string
    },
    'myShapesCorners': string,
    'myShapesSides': string,
    'cornerA': string,
    'cornerB': string,
    'cornerC': string,
    'cornerD': string,
    'topSide': string,
    'rightSide': string,
    'bottomSide': string,
    'leftSide': string,
    'voicing': {
      'overviewContent': string,
      'hintContentPattern': string,
      'youHaveAShapeHintPattern': string,
      'namedShapeParalleogramHintPattern': string,
      'namedShapeNotAParallelogramHintPattern': string,
      'detailsPattern': string,
      'firstDetailsStatementPattern': string,
      'shapeNames': {
        'square': string,
        'rectangle': string,
        'rhombus': string,
        'kite': string,
        'isoscelesTrapezoid': string,
        'trapezoid': string,
        'concaveQuadrilateral': string,
        'generalQuadrilateral': string
      },
      'transformations': {
        'tiltingPattern': string,
        'oppositeSides': string,
        'rightSide': string,
        'leftSide': string,
        'upperSide': string,
        'lowerSide': string,
        'up': string,
        'down': string,
        'left': string,
        'right': string,
        'keepingAParallelogram': string,
        'youLostYourParallelogramPattern': string,
        'youMadeAParallelogram': string,
        'extremelyFarFrom': string,
        'veryFarFrom': string,
        'farFrom': string,
        'notSoCloseTo': string,
        'somewhatCloseTo': string,
        'veryCloseTo': string,
        'extremelyCloseTo': string,
        'proximityToParallelogramPattern': string
      }
    }
  }
};

const quadrilateralStrings = getStringModule( 'QUADRILATERAL' ) as StringsType;

quadrilateral.register( 'quadrilateralStrings', quadrilateralStrings );

export default quadrilateralStrings;

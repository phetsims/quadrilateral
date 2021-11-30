// Copyright 2021, University of Colorado Boulder

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
  'a11y': {
    'voicing': {
      'vertex1': string,
      'vertex2': string,
      'vertex3': string,
      'vertex4': string,
      'topSide': string,
      'rightSide': string,
      'bottomSide': string,
      'leftSide': string,
      'parallelogramSuccess': string,
      'parallelogramFailure': string,
      'overviewContent': string,
      'hintContent': string,
      'detailsPattern': string,
      'notAParallelogram': string,
      'aParallelogram': string,
      'namedShapePattern': string,
      'shapeNames': {
        'square': string,
        'rectangle': string,
        'rhombus': string,
        'kite': string,
        'isoscelesTrapezoid': string,
        'trapezoid': string,
        'concaveQuadrilateral': string
      },
      'transformations': {
        'tiltingTwoSidesPattern': string,
        'tiltingOneSidePattern': string,
        'oppositeSides': string,
        'rightSide': string,
        'leftSide': string,
        'upperSide': string,
        'lowerSide': string,
        'up': string,
        'down': string,
        'left': string,
        'right': string,
        'inParallel': string,
        'notInParallel': string,
        'keepingAParallelogram': string,
        'youLostYourParallelogram': string,
        'youMadeAParellelogram': string,
        'notYetAParallelogram': string
      }
    }
  }
};

const quadrilateralStrings = getStringModule( 'QUADRILATERAL' ) as StringsType;

quadrilateral.register( 'quadrilateralStrings', quadrilateralStrings );

export default quadrilateralStrings;

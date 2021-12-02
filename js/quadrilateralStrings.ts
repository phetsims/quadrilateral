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
        'inParallel': string,
        'notInParallel': string,
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

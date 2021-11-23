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
      'hintContent': string
    }
  }
};

const quadrilateralStrings = getStringModule( 'QUADRILATERAL' ) as StringsType;

quadrilateral.register( 'quadrilateralStrings', quadrilateralStrings );

export default quadrilateralStrings;

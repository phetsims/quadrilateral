// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';

const shapeNameMap = new Map<unknown, string>();

// @ts-ignore - TODO: How to do enumeration
shapeNameMap.set( NamedQuadrilateral.SQUARE, quadrilateralStrings.a11y.voicing.shapeNames.square );

// @ts-ignore - TODO: How to do enumeration
shapeNameMap.set( NamedQuadrilateral.RECTANGLE, quadrilateralStrings.a11y.voicing.shapeNames.rectangle );

// @ts-ignore - TODO: How to do enumeration
shapeNameMap.set( NamedQuadrilateral.RHOMBUS, quadrilateralStrings.a11y.voicing.shapeNames.rhombus );

// @ts-ignore - TODO: How to do enumeration
shapeNameMap.set( NamedQuadrilateral.KITE, quadrilateralStrings.a11y.voicing.shapeNames.kite );

// @ts-ignore - TODO: How to do enumeration
shapeNameMap.set( NamedQuadrilateral.ISOSCELES_TRAPEZOID, quadrilateralStrings.a11y.voicing.shapeNames.isoscelesTrapezoid );

// @ts-ignore - TODO: How to do enumeration
shapeNameMap.set( NamedQuadrilateral.TRAPEZOID, quadrilateralStrings.a11y.voicing.shapeNames.trapezoid );

// @ts-ignore - TODO: How to do enumeration
shapeNameMap.set( NamedQuadrilateral.CONCAVE, quadrilateralStrings.a11y.voicing.shapeNames.concaveQuadrilateral );


class QuadrilateralDescriber {
  private readonly model: QuadrilateralModel;

  constructor( model: QuadrilateralModel ) {
    this.model = model;
  }

  /**
   * Get a description of the quadrilateral shape, including whether or not it is a parallelogram
   * and the name of the shape if there is one. Will return something like
   * "not a parallelogram" or
   * "a square, and a parallelogram" or
   * "a concave quadrilateral, and not a parallelogram"
   */
  getShapeDescription() {
    let descriptionString = null;

    // of type NamedQuadrilateral enumeration
    const shapeName = this.model.shapeNameProperty.value;

    const parallelogramStateString = this.model.isParallelogramProperty.value ?
                                     quadrilateralStrings.a11y.voicing.aParallelogram : quadrilateralStrings.a11y.voicing.notAParallelogram;

    if ( shapeName ) {
      const nameString = this.getShapeNameDescription( shapeName );
      assert && assert( nameString, `Detected a shape but did not find its description: ${shapeName}` );

      descriptionString = StringUtils.fillIn( quadrilateralStrings.a11y.voicing.namedShapePattern, {
        name: this.getShapeNameDescription( shapeName ),
        parallelogramState: parallelogramStateString
      } );
    }
    else {
      descriptionString = parallelogramStateString;
    }

    return descriptionString;
  }

  getShapeNameDescription( shapeName: unknown ) {
    return shapeNameMap.get( shapeName );
  }
}

quadrilateral.register( 'QuadrilateralDescriber', QuadrilateralDescriber );
export default QuadrilateralDescriber;

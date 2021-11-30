// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import ShapeSnapshot from '../model/ShapeSnapshot.js';

// constants
const oppositeSidesString = quadrilateralStrings.a11y.voicing.transformations.oppositeSides;
const tiltingTwoSidesPatternString = quadrilateralStrings.a11y.voicing.transformations.tiltingTwoSidesPattern;
const tiltingOneSidePatternString = quadrilateralStrings.a11y.voicing.transformations.tiltingOneSidePattern;
const downString = quadrilateralStrings.a11y.voicing.transformations.down;
const upString = quadrilateralStrings.a11y.voicing.transformations.up;
const rightString = quadrilateralStrings.a11y.voicing.transformations.right;
const leftString = quadrilateralStrings.a11y.voicing.transformations.left;
const inParallelString = quadrilateralStrings.a11y.voicing.transformations.inParallel;
const notInParallelString = quadrilateralStrings.a11y.voicing.transformations.notInParallel;
const upperSideString = quadrilateralStrings.a11y.voicing.transformations.upperSide;
const lowerSideString = quadrilateralStrings.a11y.voicing.transformations.lowerSide;
const rightSideString = quadrilateralStrings.a11y.voicing.transformations.rightSide;
const leftSideString = quadrilateralStrings.a11y.voicing.transformations.leftSide;
const keepingAParallelogramString = quadrilateralStrings.a11y.voicing.transformations.keepingAParallelogram;
const youLostYourParallelogramString = quadrilateralStrings.a11y.voicing.transformations.youLostYourParallelogram;
const youMadeAParallelogramString = quadrilateralStrings.a11y.voicing.transformations.youMadeAParellelogram;
const notYetAParallelogramString = quadrilateralStrings.a11y.voicing.transformations.notYetAParallelogram;

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

  // The tolerance used to determine if a tilt has changed enough to describe it.
  public readonly tiltDifferenceToleranceInterval: number;

  constructor( model: QuadrilateralModel ) {
    this.model = model;

    // TODO: Do we need a query parameter for this?
    this.tiltDifferenceToleranceInterval = 0.2;
  }

  public getTiltChangeDescription( newSnapshot: ShapeSnapshot, oldSnapshot: ShapeSnapshot ): string {
    let description = '';

    const rightTiltDifference = newSnapshot.rightSideTilt - oldSnapshot.rightSideTilt;
    const bottomTiltDifference = newSnapshot.bottomSideTilt - oldSnapshot.bottomSideTilt;
    const leftTiltDifference = newSnapshot.leftSideTilt - oldSnapshot.leftSideTilt;
    const topTiltDifference = newSnapshot.topSideTilt - oldSnapshot.topSideTilt;

    const differences = [
      rightTiltDifference,
      bottomTiltDifference,
      leftTiltDifference,
      topTiltDifference
    ];

    let changedSideCount = 0;
    differences.forEach( difference => {
      changedSideCount = Math.abs( difference ) > this.tiltDifferenceToleranceInterval ? ( changedSideCount + 1 ) : changedSideCount;
    } );

    const rightSideChanged = Math.abs( rightTiltDifference ) > this.tiltDifferenceToleranceInterval;
    const bottomSideChanged = Math.abs( bottomTiltDifference ) > this.tiltDifferenceToleranceInterval;
    const leftSideChanged = Math.abs( leftTiltDifference ) > this.tiltDifferenceToleranceInterval;
    const topSideChanged = Math.abs( topTiltDifference ) > this.tiltDifferenceToleranceInterval;

    // if any of the tilts are different enough, then we have changed sufficiently to describe a change in shape
    if ( changedSideCount > 0 ) {
      const parallelString = this.model.isParallelogramProperty.value ? inParallelString : notInParallelString;

      if ( changedSideCount === 2 ) {
        if ( topSideChanged && bottomSideChanged ) {
          if ( topTiltDifference / bottomTiltDifference < 0 ) {

            // The top and bottom sides are both tilting but in different directions.
            description = 'I don\'t know how to describe tilting opposite sides in different directions.';
          }
          else {

            // The top and bottom sides are both tilting in the same directions. They could be tilting together but
            // might be tilting at different rates. Either way the description is the same because we include an
            // accurate description of whether or not sides remain in parallel.
            description = StringUtils.fillIn( tiltingTwoSidesPatternString, {
              sideDescription: oppositeSidesString,
              direction: topTiltDifference < 0 ? downString : upString,
              parallelDescription: parallelString
            } );
          }
        }
        else if ( rightSideChanged && leftSideChanged ) {
          if ( rightTiltDifference / leftTiltDifference < 0 ) {

            // The top and bottom sides are both tilting but in different directions.
            description = 'I don\'t know how to describe tilting opposite sides in different directions.';
          }
          else {

            // The left and right sides are both tilt in the same directions. They could be tilting together or
            // at different rates. Either way the description is the same because we include an accurate description
            // fo whether or not sides remain in parallel.
            description = StringUtils.fillIn( tiltingTwoSidesPatternString, {
              sideDescription: oppositeSidesString,
              direction: rightTiltDifference < 0 ? rightString : leftString,
              parallelDescription: parallelString
            } );
          }
        }
        else {

          // Two sides are changing, but they are adjacent.
          description = 'I don\'t know how to describe adjacent sides changing.';
        }
      }
      else if ( changedSideCount === 1 ) {
        let sideNameString: string = '';
        let directionString: string = '';
        if ( rightSideChanged ) {
          sideNameString = rightSideString;
          directionString = rightTiltDifference < 0 ? rightString : leftString;
        }
        else if ( leftSideChanged ) {
          sideNameString = leftSideString;
          directionString = leftTiltDifference < 0 ? rightString : leftString;
        }
        else if ( topSideChanged ) {
          sideNameString = upperSideString;
          directionString = topTiltDifference > 0 ? upString : downString;
        }
        else if ( bottomSideChanged ) {
          sideNameString = lowerSideString;
          directionString = bottomTiltDifference > 0 ? upString : downString;
        }

        description = StringUtils.fillIn( tiltingOneSidePatternString, {
          sideDescription: sideNameString,
          direction: directionString,
          parallelDescription: parallelString
        } );
      }
      else {

        // More than two sides are changing tilt at the same time.
        description = 'I don\'t know how to describe more than two sides changing tilt.';
      }
    }

    return description;
  }

  getParallelogramDescription( newSnapshot: ShapeSnapshot, oldSnapshot: ShapeSnapshot ): string {
    const isParallelogram = newSnapshot.isParallelogram;
    const wasParallelogram = oldSnapshot.isParallelogram;

    return ( isParallelogram === wasParallelogram && isParallelogram ) ? keepingAParallelogramString :
           ( isParallelogram === wasParallelogram && !isParallelogram ) ? notYetAParallelogramString :
           isParallelogram ? youMadeAParallelogramString :
           youLostYourParallelogramString;
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

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
import ParallelProximityStringMap from '../../ParallelProximityStringMap.js';
import Side from '../model/Side.js';

// constants
const oppositeSidesString = quadrilateralStrings.a11y.voicing.transformations.oppositeSides;
const tiltingPatternString = quadrilateralStrings.a11y.voicing.transformations.tiltingPattern;
const downString = quadrilateralStrings.a11y.voicing.transformations.down;
const upString = quadrilateralStrings.a11y.voicing.transformations.up;
const rightString = quadrilateralStrings.a11y.voicing.transformations.right;
const leftString = quadrilateralStrings.a11y.voicing.transformations.left;
const upperSideString = quadrilateralStrings.a11y.voicing.transformations.upperSide;
const lowerSideString = quadrilateralStrings.a11y.voicing.transformations.lowerSide;
const rightSideString = quadrilateralStrings.a11y.voicing.transformations.rightSide;
const leftSideString = quadrilateralStrings.a11y.voicing.transformations.leftSide;
const keepingAParallelogramString = quadrilateralStrings.a11y.voicing.transformations.keepingAParallelogram;
const youLostYourParallelogramPatternString = quadrilateralStrings.a11y.voicing.transformations.youLostYourParallelogramPattern;
const proximityToParallelPatternString = quadrilateralStrings.a11y.voicing.transformations.proximityToParallelogramPattern;
const youMadeAParallelogramString = quadrilateralStrings.a11y.voicing.transformations.youMadeAParallelogram;

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

    const changedSides = this.getChangedSidesFromSnapshots( newSnapshot, oldSnapshot );
    const changedSideCount = changedSides.length;

    const rightSideChanged = changedSides.includes( this.model.rightSide );
    const bottomSideChanged = changedSides.includes( this.model.bottomSide );
    const leftSideChanged = changedSides.includes( this.model.leftSide );
    const topSideChanged = changedSides.includes( this.model.topSide );

    // if any of the tilts are different enough, then we have changed sufficiently to describe a change in shape
    if ( changedSideCount > 0 ) {
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
            description = StringUtils.fillIn( tiltingPatternString, {
              sideDescription: oppositeSidesString,
              direction: topTiltDifference < 0 ? downString : upString
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
            description = StringUtils.fillIn( tiltingPatternString, {
              sideDescription: oppositeSidesString,
              direction: rightTiltDifference < 0 ? rightString : leftString
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

        description = StringUtils.fillIn( tiltingPatternString, {
          sideDescription: sideNameString,
          direction: directionString
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
    let description = '';
    const isParallelogram = newSnapshot.isParallelogram;
    const wasParallelogram = oldSnapshot.isParallelogram;

    const changedSides = this.getChangedSidesFromSnapshots( newSnapshot, oldSnapshot );

    if ( isParallelogram === wasParallelogram && isParallelogram ) {

      // keeping parallelogram
      description = keepingAParallelogramString;
    }
    else if ( isParallelogram === wasParallelogram && !isParallelogram ) {

      let changeValueToDescribe = 0;

      // moving such that we are still not in parallelogram - describe this and the proximity to parallelogram
      // with respect to the sides that have changed since the last time we described this.
      if ( changedSides.includes( this.model.topSide ) || changedSides.includes( this.model.bottomSide ) ) {
        changeValueToDescribe = Math.abs( oldSnapshot.topSideTilt - oldSnapshot.bottomSideTilt ) - Math.abs( newSnapshot.topSideTilt - newSnapshot.bottomSideTilt );
      }
      else if ( changedSides.includes( this.model.rightSide ) || changedSides.includes( this.model.leftSide ) ) {
        changeValueToDescribe = Math.abs( oldSnapshot.rightSideTilt - oldSnapshot.leftSideTilt ) - Math.abs( newSnapshot.rightSideTilt - newSnapshot.leftSideTilt );
      }

      const changeDescriptionString = changeValueToDescribe < 0 ? 'Farther from a parallelogram' : 'Closer to a parallelogram';

      // still not a parallelogram
      const proximityDescription = this.getProximityToParallelDescription( newSnapshot, oldSnapshot, changedSides );
      description = StringUtils.fillIn( proximityToParallelPatternString, {
        proximityDescription: proximityDescription,
        changeDescription: changeDescriptionString
      } );
    }
    else if ( isParallelogram ) {

      // first time making a parallelogram
      description = youMadeAParallelogramString;
    }
    else {

      // lost the parallelogram

      // which sides have changed?
      const proximityDescription = this.getProximityToParallelDescription( newSnapshot, oldSnapshot, changedSides );

      description = StringUtils.fillIn( youLostYourParallelogramPatternString, {
        proximityDescription: proximityDescription
      } );
    }

    return description;
  }

  getProximityToParallelDescription( newSnapshot: ShapeSnapshot, oldSnapshot: ShapeSnapshot, changedSides: Side[] ): string {

    let oppositeSideTiltDifference = 0;
    if ( changedSides.includes( this.model.rightSide ) || changedSides.includes( this.model.leftSide ) ) {
      oppositeSideTiltDifference = Math.abs( newSnapshot.rightSideTilt - newSnapshot.leftSideTilt );
    }
    else if ( changedSides.includes( this.model.bottomSide ) || changedSides.includes( this.model.topSide ) ) {
      oppositeSideTiltDifference = Math.abs( newSnapshot.bottomSideTilt - newSnapshot.topSideTilt );
    }

    let proximityDescription = '';
    ParallelProximityStringMap.forEach( ( value, key ) => {
      if ( key.contains( oppositeSideTiltDifference ) ) {
        proximityDescription = value;
      }
    } );

    return proximityDescription;
  }

  getChangedSidesFromSnapshots( newSnapshot: ShapeSnapshot, oldSnapshot: ShapeSnapshot ): Side[] {
    const rightTiltDifference = newSnapshot.rightSideTilt - oldSnapshot.rightSideTilt;
    const bottomTiltDifference = newSnapshot.bottomSideTilt - oldSnapshot.bottomSideTilt;
    const leftTiltDifference = newSnapshot.leftSideTilt - oldSnapshot.leftSideTilt;
    const topTiltDifference = newSnapshot.topSideTilt - oldSnapshot.topSideTilt;

    const rightSideChanged = Math.abs( rightTiltDifference ) > this.tiltDifferenceToleranceInterval;
    const bottomSideChanged = Math.abs( bottomTiltDifference ) > this.tiltDifferenceToleranceInterval;
    const leftSideChanged = Math.abs( leftTiltDifference ) > this.tiltDifferenceToleranceInterval;
    const topSideChanged = Math.abs( topTiltDifference ) > this.tiltDifferenceToleranceInterval;

    const changedSides = [];

    rightSideChanged && changedSides.push( this.model.rightSide );
    leftSideChanged && changedSides.push( this.model.leftSide );
    topSideChanged && changedSides.push( this.model.topSide );
    bottomSideChanged && changedSides.push( this.model.bottomSide );

    return changedSides;
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

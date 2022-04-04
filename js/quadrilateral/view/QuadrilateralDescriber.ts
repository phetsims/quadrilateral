// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import ShapeSnapshot from '../model/ShapeSnapshot.js';
import ParallelProximityStringMap from '../../ParallelProximityStringMap.js';
import Side from '../model/Side.js';
import QuadrilateralShapeModel, { SidePair, VertexPair } from '../model/QuadrilateralShapeModel.js';
import Vertex from '../model/Vertex.js';
import VertexLabel from '../model/VertexLabel.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';

// constants
const oppositeSidesString = quadrilateralStrings.a11y.voicing.transformations.oppositeSides;
const tiltingPatternString = quadrilateralStrings.a11y.voicing.transformations.tiltingPattern;
const downString = quadrilateralStrings.a11y.voicing.transformations.down;
const upString = quadrilateralStrings.a11y.voicing.transformations.up;
const rightString = quadrilateralStrings.a11y.voicing.transformations.right;
const leftString = quadrilateralStrings.a11y.voicing.transformations.left;
const upperSideString = quadrilateralStrings.a11y.voicing.transformations.upperSide;
const lowerSideString = quadrilateralStrings.a11y.voicing.transformations.lowerSide;
const transformationsRightSideString = quadrilateralStrings.a11y.voicing.transformations.rightSide;
const transformationsLeftSideString = quadrilateralStrings.a11y.voicing.transformations.leftSide;
const keepingAParallelogramString = quadrilateralStrings.a11y.voicing.transformations.keepingAParallelogram;
const youLostYourParallelogramPatternString = quadrilateralStrings.a11y.voicing.transformations.youLostYourParallelogramPattern;
const proximityToParallelPatternString = quadrilateralStrings.a11y.voicing.transformations.proximityToParallelogramPattern;
const youMadeAParallelogramString = quadrilateralStrings.a11y.voicing.transformations.youMadeAParallelogram;
const namedShapeParalleogramHintPatternString = quadrilateralStrings.a11y.voicing.namedShapeParalleogramHintPattern;
const namedShapeNotAParallelogramHintPatternString = quadrilateralStrings.a11y.voicing.namedShapeNotAParallelogramHintPattern;
const aParallelogramString = quadrilateralStrings.a11y.voicing.aParallelogram;
const firstDetailsStatementPatternString = quadrilateralStrings.a11y.voicing.firstDetailsStatementPattern;
const cornerAString = quadrilateralStrings.a11y.cornerA;
const cornerBString = quadrilateralStrings.a11y.cornerB;
const cornerCString = quadrilateralStrings.a11y.cornerC;
const cornerDString = quadrilateralStrings.a11y.cornerD;
const aBString = quadrilateralStrings.a11y.aB;
const bCString = quadrilateralStrings.a11y.bC;
const cDString = quadrilateralStrings.a11y.cD;
const dAString = quadrilateralStrings.a11y.dA;
const topSideString = quadrilateralStrings.a11y.topSide;
const rightSideString = quadrilateralStrings.a11y.rightSide;
const bottomSideString = quadrilateralStrings.a11y.bottomSide;
const leftSideString = quadrilateralStrings.a11y.leftSide;

const vertexAString = quadrilateralStrings.vertexA;
const vertexBString = quadrilateralStrings.vertexB;
const vertexCString = quadrilateralStrings.vertexC;
const vertexDString = quadrilateralStrings.vertexD;

const shapeNameMap = new Map<NamedQuadrilateral | null, string>();
shapeNameMap.set( NamedQuadrilateral.SQUARE, quadrilateralStrings.a11y.voicing.shapeNames.square );
shapeNameMap.set( NamedQuadrilateral.RECTANGLE, quadrilateralStrings.a11y.voicing.shapeNames.rectangle );
shapeNameMap.set( NamedQuadrilateral.RHOMBUS, quadrilateralStrings.a11y.voicing.shapeNames.rhombus );
shapeNameMap.set( NamedQuadrilateral.KITE, quadrilateralStrings.a11y.voicing.shapeNames.kite );
shapeNameMap.set( NamedQuadrilateral.ISOSCELES_TRAPEZOID, quadrilateralStrings.a11y.voicing.shapeNames.isoscelesTrapezoid );
shapeNameMap.set( NamedQuadrilateral.TRAPEZOID, quadrilateralStrings.a11y.voicing.shapeNames.trapezoid );
shapeNameMap.set( NamedQuadrilateral.CONCAVE, quadrilateralStrings.a11y.voicing.shapeNames.concaveQuadrilateral );
shapeNameMap.set( null, quadrilateralStrings.a11y.voicing.shapeNames.generalQuadrilateral );

// A map that goes from VertexLabel -> corner label (like "Corner A")
const vertexCornerLabelMap = new Map<VertexLabel, string>();
vertexCornerLabelMap.set( VertexLabel.VERTEX_A, cornerAString );
vertexCornerLabelMap.set( VertexLabel.VERTEX_B, cornerBString );
vertexCornerLabelMap.set( VertexLabel.VERTEX_C, cornerCString );
vertexCornerLabelMap.set( VertexLabel.VERTEX_D, cornerDString );

// A map that goes from VertexLabel -> letter label (like "A")
const vertexLabelMap = new Map<VertexLabel, string>();
vertexLabelMap.set( VertexLabel.VERTEX_A, vertexAString );
vertexLabelMap.set( VertexLabel.VERTEX_B, vertexBString );
vertexLabelMap.set( VertexLabel.VERTEX_C, vertexCString );
vertexLabelMap.set( VertexLabel.VERTEX_D, vertexDString );

const angleComparisonDescriptionMap = new Map<Range, string>();

const createAngleComparisonDescriptionMapEntry = ( minAngle: number, maxAngle: number, widerString: string, smallerString: string ) => {
  angleComparisonDescriptionMap.set( new Range( minAngle, maxAngle ), widerString );
  angleComparisonDescriptionMap.set( new Range( -maxAngle, -minAngle ), smallerString );
};

createAngleComparisonDescriptionMapEntry( Math.PI, 2 * Math.PI, 'far wider than', 'far smaller than' );
createAngleComparisonDescriptionMapEntry( Utils.toRadians( 135 ), Math.PI, 'much much wider than', 'much much smaller than' );
createAngleComparisonDescriptionMapEntry( Math.PI / 2, Utils.toRadians( 135 ), 'much wider than', 'much smaller than' );
createAngleComparisonDescriptionMapEntry( Math.PI / 4, Math.PI / 2, 'somewhat wider than', 'somewhat smaller than' );
createAngleComparisonDescriptionMapEntry( Utils.toRadians( 15 ), Math.PI / 4, 'a little wider than', 'a little smaller than' );
createAngleComparisonDescriptionMapEntry( QuadrilateralQueryParameters.shapeAngleToleranceInterval, Utils.toRadians( 15 ), 'comparable to', 'comparable to' );
createAngleComparisonDescriptionMapEntry( 0, QuadrilateralQueryParameters.shapeAngleToleranceInterval, 'equal to', 'equal to' );

// A map that will provide comparison descriptions for side lengths. Lengths in model units.
const lengthComparisonDescriptionMap = new Map<Range, string>();

// Populate entries of the lengthComparisonDescriptionMap - They are symmetric in that ranges for "longer" strings
// have the same ranges as the "shorter" strings with values inverted. Lengths for this function are provided in the
// number of segments, since that is how it is described in the design doc. That is converted to model units for
// the map.
const createLengthComparisonMapEntry = ( minSegments: number, maxSegments: number, longerString: string, shorterString: string ) => {
  const minLength = minSegments * Side.SIDE_SEGMENT_LENGTH;
  const maxLength = maxSegments * Side.SIDE_SEGMENT_LENGTH;
  lengthComparisonDescriptionMap.set( new Range( minLength, maxLength ), longerString );
  lengthComparisonDescriptionMap.set( new Range( -maxLength, -minLength ), shorterString );
};

createLengthComparisonMapEntry( 6, Number.POSITIVE_INFINITY, 'far longer than', 'far shorter than' );
createLengthComparisonMapEntry( 4.5, 6, 'much much longer than', 'much much shorter than' );
createLengthComparisonMapEntry( 3, 4.5, 'much longer than', 'much shorter than' );
createLengthComparisonMapEntry( 1.5, 3, 'somewhat longer than', 'somewhat shorter than' );
createLengthComparisonMapEntry( 0.5, 1.5, 'a little longer than', 'a little shorter than' );
createLengthComparisonMapEntry( QuadrilateralQueryParameters.shapeLengthToleranceInterval, 0.5, 'comparable to', 'comparable to' );
createLengthComparisonMapEntry( 0, QuadrilateralQueryParameters.shapeLengthToleranceInterval, 'equal to', 'equal to' );

class QuadrilateralDescriber {
  private readonly shapeModel: QuadrilateralShapeModel;

  // The tolerance used to determine if a tilt has changed enough to describe it.
  public readonly tiltDifferenceToleranceInterval: number;
  public readonly lengthDifferenceToleranceInterval: number;

  // A map that goes from Side -> letter label (like "AB")
  private readonly sideLabelMap: Map<Side, string>;

  // A map that goes from Side -> full side label (like "Side AB")
  private readonly sideFullLabelMap: Map<Side, string>;

  constructor( shapeModel: QuadrilateralShapeModel ) {
    this.shapeModel = shapeModel;

    this.sideLabelMap = new Map();
    this.sideLabelMap.set( shapeModel.topSide, aBString );
    this.sideLabelMap.set( shapeModel.rightSide, bCString );
    this.sideLabelMap.set( shapeModel.bottomSide, cDString );
    this.sideLabelMap.set( shapeModel.leftSide, dAString );

    this.sideFullLabelMap = new Map();
    this.sideFullLabelMap.set( shapeModel.topSide, topSideString );
    this.sideFullLabelMap.set( shapeModel.rightSide, rightSideString );
    this.sideFullLabelMap.set( shapeModel.bottomSide, bottomSideString );
    this.sideFullLabelMap.set( shapeModel.leftSide, leftSideString );

    // TODO: Do we need a query parameter for this?
    this.tiltDifferenceToleranceInterval = 0.2;

    this.lengthDifferenceToleranceInterval = 0.05;
  }

  public getTiltChangeDescription( newSnapshot: ShapeSnapshot, oldSnapshot: ShapeSnapshot ): string {
    let description = '';

    const rightTiltDifference = newSnapshot.rightSideTilt - oldSnapshot.rightSideTilt;
    const bottomTiltDifference = newSnapshot.bottomSideTilt - oldSnapshot.bottomSideTilt;
    const leftTiltDifference = newSnapshot.leftSideTilt - oldSnapshot.leftSideTilt;
    const topTiltDifference = newSnapshot.topSideTilt - oldSnapshot.topSideTilt;

    const changedSides = this.getChangedSidesFromSnapshots( newSnapshot, oldSnapshot );
    const changedSideCount = changedSides.length;

    const rightSideChanged = changedSides.includes( this.shapeModel.rightSide );
    const bottomSideChanged = changedSides.includes( this.shapeModel.bottomSide );
    const leftSideChanged = changedSides.includes( this.shapeModel.leftSide );
    const topSideChanged = changedSides.includes( this.shapeModel.topSide );

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
          sideNameString = transformationsRightSideString;
          directionString = rightTiltDifference < 0 ? rightString : leftString;
        }
        else if ( leftSideChanged ) {
          sideNameString = transformationsLeftSideString;
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

  getLengthChangeDescription( newSnapshot: ShapeSnapshot, oldSnapshot: ShapeSnapshot ): string {

    const rightLengthDifference = newSnapshot.rightSideLength - oldSnapshot.rightSideLength;
    const topLengthDifference = newSnapshot.topSideLength - oldSnapshot.topSideLength;

    let actionString = '';
    if ( rightLengthDifference > 0 || topLengthDifference > 0 ) {
      actionString = 'pulling opposite sides apart.';
    }
    else {
      actionString = 'pushing opposite sides closer.';
    }
    return actionString;
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
      if ( changedSides.includes( this.shapeModel.topSide ) || changedSides.includes( this.shapeModel.bottomSide ) ) {
        changeValueToDescribe = Math.abs( oldSnapshot.topSideTilt - oldSnapshot.bottomSideTilt ) - Math.abs( newSnapshot.topSideTilt - newSnapshot.bottomSideTilt );
      }
      else if ( changedSides.includes( this.shapeModel.rightSide ) || changedSides.includes( this.shapeModel.leftSide ) ) {
        changeValueToDescribe = Math.abs( oldSnapshot.rightSideTilt - oldSnapshot.leftSideTilt ) - Math.abs( newSnapshot.rightSideTilt - newSnapshot.leftSideTilt );
      }

      const changeDescriptionString = changeValueToDescribe < 0 ? 'Farther from a parallelogram' :
                                      changeValueToDescribe === 0 ? 'Still not a parallelogram' :
                                      'Closer to a parallelogram';

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
    if ( changedSides.includes( this.shapeModel.rightSide ) || changedSides.includes( this.shapeModel.leftSide ) ) {
      oppositeSideTiltDifference = Math.abs( newSnapshot.rightSideTilt - newSnapshot.leftSideTilt );
    }
    else if ( changedSides.includes( this.shapeModel.bottomSide ) || changedSides.includes( this.shapeModel.topSide ) ) {
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

    rightSideChanged && changedSides.push( this.shapeModel.rightSide );
    leftSideChanged && changedSides.push( this.shapeModel.leftSide );
    topSideChanged && changedSides.push( this.shapeModel.topSide );
    bottomSideChanged && changedSides.push( this.shapeModel.bottomSide );

    return changedSides;
  }

  getChangedLengthSidesFromSnapshots( newSnapshot: ShapeSnapshot, oldSnapshot: ShapeSnapshot ): Side[] {
    const rightLengthDifference = newSnapshot.rightSideLength - oldSnapshot.rightSideLength;
    const bottomLengthDifference = newSnapshot.bottomSideLength - oldSnapshot.bottomSideLength;
    const leftLengthDifference = newSnapshot.leftSideLength - oldSnapshot.leftSideLength;
    const topLengthDifference = newSnapshot.topSideLength - oldSnapshot.topSideLength;

    const rightSideChanged = Math.abs( rightLengthDifference ) > this.lengthDifferenceToleranceInterval;
    const bottomSideChanged = Math.abs( bottomLengthDifference ) > this.lengthDifferenceToleranceInterval;
    const leftSideChanged = Math.abs( leftLengthDifference ) > this.lengthDifferenceToleranceInterval;
    const topSideChanged = Math.abs( topLengthDifference ) > this.lengthDifferenceToleranceInterval;

    const changedSides = [];

    rightSideChanged && changedSides.push( this.shapeModel.rightSide );
    leftSideChanged && changedSides.push( this.shapeModel.leftSide );
    topSideChanged && changedSides.push( this.shapeModel.topSide );
    bottomSideChanged && changedSides.push( this.shapeModel.bottomSide );

    return changedSides;
  }

  /**
   * Get a description of the quadrilateral shape, including whether or not it is a parallelogram
   * and the name of the shape if there is one. Will return something like
   * "a parallelogram, and a rectangle" or
   * "a trapezoid and not a parallelogram" or
   * "a concave quadrilateral and not a parallelogram"
   */
  getShapeDescription(): string {
    let description = '';

    // of type NamedQuadrilateral enumeration
    const shapeName = this.shapeModel.shapeNameProperty.value;
    const shapeNameString = this.getShapeNameDescription( shapeName );

    if ( this.shapeModel.isParallelogramProperty.value && shapeName === null ) {

      // parallelogram with no name, don't include "general quadrilateral" just say parallelogram
      description = aParallelogramString;
    }
    else {
      const patternString = this.shapeModel.isParallelogramProperty.value ? namedShapeParalleogramHintPatternString :
                            namedShapeNotAParallelogramHintPatternString;

      description = StringUtils.fillIn( patternString, {
        shapeName: shapeNameString
      } );
    }

    return description;
  }

  /**
   * Returns the actual name of the NamedQuadrilateral.
   */
  public getShapeNameDescription( shapeName: NamedQuadrilateral | null ) {
    return shapeNameMap.get( shapeName );
  }

  /**
   * Returns the first details statement. Details are broken up into three categorized statements. This one is a
   * summary about equal corner angles and equal side lengths. Will return something like
   * "Right now, opposite corners are equal and opposite sides are equal." or
   * "Right now, on pair of opposite corners are equal and opposite sides are equal" or
   * "Right now, no corners are equal and no sides are equal."
   */
  public getFirstDetailsStatement() {

    const adjacentEqualVertexPairs = this.shapeModel.adjacentEqualVertexPairsProperty.value;
    const adjacentEqualSidePairs = this.shapeModel.adjacentEqualSidePairsProperty.value;

    let cornerTypeString;
    let angleEqualityString;
    let sideTypeString;
    if ( this.shapeModel.isParallelogramProperty.value ) {

      // If all adjacent vertices are equal then all are right angles. Otherwise, opposite angles must be equal.
      cornerTypeString = adjacentEqualVertexPairs.length === 4 ? 'all' : 'opposite';
      angleEqualityString = adjacentEqualVertexPairs.length === 4 ? 'right angles' : 'equal';

      // if all adjacent sides are equal in length, all sides are equal, otherwise only opposite sides are equal
      sideTypeString = adjacentEqualSidePairs.length === 4 ? 'all' : 'opposite';
    }
    else {
      const oppositeEqualVertexPairs = this.shapeModel.oppositeEqualVertexPairsProperty.value;
      const oppositeEqualSidePairs = this.shapeModel.oppositeEqualSidePairsProperty.value;

      cornerTypeString = adjacentEqualVertexPairs.length === 2 ? 'pairs of adjacent' :
                         adjacentEqualVertexPairs.length === 1 ? 'one pair of adjacent' :
                         oppositeEqualVertexPairs.length === 1 ? 'one pair of opposite' :
                         'no';

      angleEqualityString = adjacentEqualVertexPairs.length === 1 && this.shapeModel.isShapeAngleEqualToOther( adjacentEqualVertexPairs[ 0 ].vertex1.angleProperty!.value, Math.PI / 2 ) ? 'right angles' :
                            oppositeEqualVertexPairs.length === 1 && this.shapeModel.isShapeAngleEqualToOther( oppositeEqualVertexPairs[ 0 ].vertex1.angleProperty!.value, Math.PI / 2 ) ? 'right angles' :
                              // if two pairs of adjacent angles exist but we are not parallelogram, all cannot be
                              // right angles. OR, no angles are equal.
                            'equal';

      sideTypeString = adjacentEqualSidePairs.length === 2 ? 'pairs of adjacent' :
                       adjacentEqualSidePairs.length === 1 ? 'one pair of adjacent' :
                       oppositeEqualSidePairs.length === 1 ? 'one pair of opposite' :
                       'no';
    }

    return StringUtils.fillIn( firstDetailsStatementPatternString, {
      cornerType: cornerTypeString,
      angleEquality: angleEqualityString,
      sideType: sideTypeString
    } );
  }

  /**
   * Get the second statement for the details button of the Voicing toolbar. This is a detailed summary
   * of the equal angles and how they compare to other angles in size qualitatively. There is no statement
   * about the corners if all angles are equal (right angles).
   */
  getSecondDetailsStatement() {
    let statement = null;

    const adjacentEqualVertexPairs = this.shapeModel.adjacentEqualVertexPairsProperty.value;
    const oppositeEqualVertexPairs = this.shapeModel.oppositeEqualVertexPairsProperty.value;

    const shapeName = this.shapeModel.shapeNameProperty.value;

    // Nothing spoken if all angles are equal.
    if ( adjacentEqualVertexPairs.length !== 4 ) {

      if ( shapeName === NamedQuadrilateral.KITE ) {

        // there will be one pair of equal opposite angles
        assert && assert( oppositeEqualVertexPairs.length === 1, 'A Kite should only have one pair of opposite equal vertex angles' );
        const oppositeEqualVertexPair = oppositeEqualVertexPairs[ 0 ];
        const orderedEqualVertices = this.getVerticesOrderedForDescription( [ oppositeEqualVertexPair.vertex1, oppositeEqualVertexPair.vertex2 ] );

        const firstCornersString = this.getCornersAngleDescription( orderedEqualVertices[ 0 ], orderedEqualVertices[ 1 ] );

        // the vertices that are not equal still need to be described, in the decided order
        const otherVertices = this.getUndescribedVertices( orderedEqualVertices );
        const orderedUnequalVertices = this.getVerticesOrderedForDescription( otherVertices );

        const thirdCornerString = this.getCornerAngleDescription( orderedUnequalVertices[ 0 ] );
        const fourthCornerString = this.getCornerAngleDescription( orderedUnequalVertices[ 1 ] );

        // how the equal vertex angles compare qualitatively to the fist unequal vertex
        const firstComparisonString = this.getAngleComparisonDescription( orderedUnequalVertices[ 0 ], orderedEqualVertices[ 0 ] );

        // how the equal vertex angles compare qualitatively to the second unequal vertex
        const secondComparisonString = this.getAngleComparisonDescription( orderedUnequalVertices[ 1 ], orderedEqualVertices[ 0 ] );

        const patternString = 'Equal {{firstCorners}} are {{firstComparison}} {{thirdCorner}} and {{secondComparison}} {{fourthCorner}}.';
        statement = StringUtils.fillIn( patternString, {
          firstCorners: firstCornersString,
          firstComparison: firstComparisonString,
          thirdCorner: thirdCornerString,
          secondComparison: secondComparisonString,
          fourthCorner: fourthCornerString
        } );
      }
      else if ( shapeName === NamedQuadrilateral.TRAPEZOID ) {

        // if there are two adjacent vertices with equal angles, combine them in the description
        if ( adjacentEqualVertexPairs.length > 0 ) {

          // start with the adjacent corners in the prescribed order
          assert && assert( adjacentEqualVertexPairs.length === 1, 'should only be one adjacent vertex pair for a trapezoid' );
          statement = this.getTwoEqualVerticesAngleDescription( adjacentEqualVertexPairs[ 0 ].vertex1, adjacentEqualVertexPairs[ 0 ].vertex2 );
        }
        else {

          // In the basic case a trapezoid is described like a general quadrilateral
          statement = this.getGeneralQuadrilateralVertexDescription();
        }
      }
      else if ( shapeName === NamedQuadrilateral.ISOSCELES_TRAPEZOID ) {
        assert && assert( adjacentEqualVertexPairs.length === 2, 'There should be two pairs of adjacent equal angles for an isosceles trapezoid' );
        statement = this.getTwoPairsOfEqualVerticesAngleDescription( adjacentEqualVertexPairs );
      }
      else if ( this.shapeModel.isParallelogramProperty.value ) {

        // there should be two pairs of equal opposite angles, but we cannot assume this because we may be in a
        // parallelogram state without entries in oppositeEqualVertexPairs because of the behavior of
        // angleToleranceIntervalProperty. But we describe opposite vertex pairs as if they were equal.
        // assert && assert( oppositeEqualVertexPairs.length === 2, 'there should be two pairs of equal opposite angles for a parallelogram' );
        statement = this.getTwoPairsOfEqualVerticesAngleDescription( this.shapeModel.oppositeVertices );
      }
      else if ( shapeName === NamedQuadrilateral.CONCAVE ) {

        // The concave shape may have a pair of opposite or adjacent vertex pairs with equal angles that should be
        // described.
        let quadrilateralStatementString;
        if ( oppositeEqualVertexPairs.length === 1 ) {
          quadrilateralStatementString = this.getTwoEqualVerticesAngleDescription( oppositeEqualVertexPairs[ 0 ].vertex1, oppositeEqualVertexPairs[ 0 ].vertex2 );
        }
        else if ( adjacentEqualVertexPairs.length === 1 ) {
          quadrilateralStatementString = this.getTwoEqualVerticesAngleDescription( adjacentEqualVertexPairs[ 0 ].vertex1, adjacentEqualVertexPairs[ 0 ].vertex2 );
        }
        else {
          quadrilateralStatementString = this.getGeneralQuadrilateralVertexDescription();
        }

        // after the quadrilateral statement describe the vertex whose angle makes this shape concave
        let concaveVertex: null | Vertex = null;
        let otherVertex: null | Vertex = null;
        this.shapeModel.oppositeVertices.forEach( vertexPair => {
          const firstVertexConcave = vertexPair.vertex1.angleProperty!.value > Math.PI;
          const secondVertexConcave = vertexPair.vertex2.angleProperty!.value > Math.PI;
          if ( firstVertexConcave || secondVertexConcave ) {
            concaveVertex = firstVertexConcave ? vertexPair.vertex1 : vertexPair.vertex2;
            otherVertex = firstVertexConcave ? vertexPair.vertex2 : vertexPair.vertex1;
          }
        } );
        assert && assert( otherVertex && concaveVertex, 'A concave shape better have a vertex whose angle is greater than Math.PI' );

        const pointingPatternString = '{{firstCorner}} points toward {{secondCorner}}.';
        const pointingStatementString = StringUtils.fillIn( pointingPatternString, {
          firstCorner: this.getCornerAngleDescription( concaveVertex! ),
          secondCorner: this.getCornerAngleDescription( otherVertex! )
        } );

        const patternString = '{{quadrilateralStatement}} {{pointingStatement}}';
        statement = StringUtils.fillIn( patternString, {
          quadrilateralStatement: quadrilateralStatementString,
          pointingStatement: pointingStatementString
        } );
      }
      else {

        // fall back to the format for a "general" quadrilateral, see function for the details
        statement = this.getGeneralQuadrilateralVertexDescription();
      }
    }

    return statement;
  }

  /**
   * Returns the third statement for the details button of the Voicing toolbar. This statement describes
   * the relative lengths of sides. The statement will take slightly different patterns depending on the current
   * pairs of equal or parallel sides and the shape name. If all side lengths are equal this function
   * returns null.
   */
  public getThirdDetailsStatement(): null | string {
    let statement = null;

    const adjacentEqualSidePairs = this.shapeModel.adjacentEqualSidePairsProperty.value;
    const parallelSidePairs = this.shapeModel.parallelSidePairsProperty.value;

    const shapeName = this.shapeModel.shapeNameProperty.value;

    // no description if all sides are equal in length
    if ( adjacentEqualSidePairs.length < 4 ) {
      if ( this.shapeModel.isParallelogramProperty.value ) {

        // We cannot nececssarily use parallelSidePairsProperty because the angleToleranceInterval can allow for
        // a parallelogram without parallel sides within shapeAngleToleranceInterval. But we should still describe
        // the opposite sides as if they are parallelo
        // assert && assert( parallelSidePairs.length === 2, 'Should be two pairs of parallel sides for a parallelogram' );
        const oppositeSides = this.shapeModel.oppositeSides;

        const patternString = 'Parallel Sides {{firstSide}} and {{secondSide}} are {{comparison}} parallel Sides {{thirdSide}} and {{fourthSide}}.';
        statement = this.getTwoSidePairsDescription( oppositeSides, patternString );
      }
      else if ( shapeName === NamedQuadrilateral.KITE ) {
        assert && assert( adjacentEqualSidePairs.length === 2, 'There should be two pairs of adjacent sides with with the same length for a kite' );
        const patternString = 'Equal Sides {{firstSide}} and {{secondSide}} are {{comparison}} equal Sides {{thirdSide}} and {{fourthSide}}.';
        statement = this.getTwoSidePairsDescription( adjacentEqualSidePairs, patternString );
      }
      if ( shapeName === NamedQuadrilateral.TRAPEZOID || shapeName === NamedQuadrilateral.ISOSCELES_TRAPEZOID ) {

        // TODO: We cannot assert this yet because parallel sides use angleToleranceInterval which can break when
        // the shape is not a parallelogram. See https://github.com/phetsims/quadrilateral/issues/108
        // Replace the if statement with this assertion when that issue is resolved.
        // assert && assert( parallelSidePairs.length === 1, 'There should be one pair of parallel sides for a trapezoid' );
        if ( parallelSidePairs.length === 1 ) {
          const orderedParallelSidePairs = this.getSidePairsOrderedForDescription( parallelSidePairs );
          const firstSide = orderedParallelSidePairs[ 0 ].side1;
          const secondSide = orderedParallelSidePairs[ 0 ].side2;

          const otherSides = this.getUndescribedSides( [ firstSide, secondSide ] );
          assert && assert( otherSides.length === 2, 'there should be two remaining sides to describe' );
          const orderedOtherSidePairs = this.getSidePairsOrderedForDescription( [ { side1: otherSides[ 0 ], side2: otherSides[ 1 ] } ] );
          const thirdSide = orderedOtherSidePairs[ 0 ].side1;
          const fourthSide = orderedOtherSidePairs[ 0 ].side2;

          // comparing the length of the first side to the second side, relative to the first side
          const firstComparisonString = this.getLengthComparisonDescription( secondSide, firstSide );

          // comparing third and fourth sides, relative to the third side
          const secondComparisonString = this.getLengthComparisonDescription( fourthSide, thirdSide );

          const trapezoidPatternString = 'Side {{firstSide}} is {{firstComparison}} Side {{secondSide}} and parallel. Side {{thirdSide}} is {{secondComparison}} Side {{fourthSide}}.';
          const parallelSidesStatement = StringUtils.fillIn( trapezoidPatternString, {
            firstSide: this.getSideDescription( firstSide ),
            firstComparison: firstComparisonString,
            secondSide: this.getSideDescription( secondSide ),
            thirdSide: this.getSideDescription( thirdSide ),
            secondComparison: secondComparisonString,
            fourthSide: this.getSideDescription( fourthSide )
          } );

          if ( adjacentEqualSidePairs.length === 1 ) {

            // if there is one pair of adjacent sides with equal lengths, call those out at the end of the statement
            const orderedAdjacentSides = this.getSidePairsOrderedForDescription( adjacentEqualSidePairs );
            const firstSide = orderedAdjacentSides[ 0 ].side1;
            const secondSide = orderedAdjacentSides[ 0 ].side2;

            const equalSidesPatternString = 'Sides {{firstSide}} and {{secondSide}} are equal.';
            const equalSidesStatement = StringUtils.fillIn( equalSidesPatternString, {
              firstSide: this.getSideDescription( firstSide ),
              secondSide: this.getSideDescription( secondSide )
            } );

            statement = StringUtils.fillIn( '{{firstStatement}} {{secondStatement}}', {
              firstStatement: parallelSidesStatement,
              secondStatement: equalSidesStatement
            } );
          }
          else {
            statement = parallelSidesStatement;
          }
        }
        else {
          statement = 'I cannot describe this trapezoid because of issue 108.';
        }
      }
      else if ( shapeName === NamedQuadrilateral.CONCAVE ) {
        if ( adjacentEqualSidePairs.length === 2 ) {
          assert && assert( adjacentEqualSidePairs.length === 2, 'There should be two pairs of adjacent sides with with the same length for a kite' );
          const patternString = 'Equal Sides {{firstSide}} and {{secondSide}} are {{comparison}} equal Sides {{thirdSide}} and {{fourthSide}}.';
          statement = this.getTwoSidePairsDescription( adjacentEqualSidePairs, patternString );
        }
        else {
          statement = this.getGeneralQuadrilateralSideDescription();
        }
      }
      else {

        // General quadrilateral - if there is one pair of adjacent sides we have this unique pattern that describes
        // the pair of equal sides relative to the others
        if ( adjacentEqualSidePairs.length === 1 ) {
          const patternString = 'Equal sides {{firstSide}} and {{secondSide}} are {{firstComparison}} Side {{thirdSide}} and {{secondComparison}} {{fourthSide}}. Side {{thirdSide}} is {{thirdComparison}} {{fourthSide}}.';

          const sortedAdjacentSidePairs = this.getSidePairsOrderedForDescription( adjacentEqualSidePairs );

          const firstSide = sortedAdjacentSidePairs[ 0 ].side1;
          const secondSide = sortedAdjacentSidePairs[ 0 ].side2;

          const remainingSides = this.getUndescribedSides( [ firstSide, secondSide ] );
          const remainingSidePair = { side1: remainingSides[ 0 ], side2: remainingSides[ 1 ] };
          const orderedRemainingSides = this.getSidePairsOrderedForDescription( [ remainingSidePair ] );
          assert && assert( orderedRemainingSides.length === 1, 'we should have one more side pair to describe for a general quadrilateral with one pair of adjacent equal sides' );

          const thirdSide = orderedRemainingSides[ 0 ].side1;
          const fourthSide = orderedRemainingSides[ 0 ].side2;

          // first comparison is the equal sides against the third side, relative to the first side
          const firstComparisonString = this.getLengthComparisonDescription( thirdSide, firstSide );

          // second comparison is the equal sides aginst the fourth side, relative to the first side
          const secondComparisonString = this.getLengthComparisonDescription( fourthSide, firstSide );

          // third comparison is the fourth side against the third side, relative to the third side
          const thirdComparisonString = this.getLengthComparisonDescription( fourthSide, thirdSide );

          statement = StringUtils.fillIn( patternString, {
            firstSide: this.getSideDescription( firstSide ),
            secondSide: this.getSideDescription( secondSide ),
            firstComparison: firstComparisonString,
            thirdSide: this.getSideDescription( thirdSide ),
            secondComparison: secondComparisonString,
            fourthSide: this.getSideDescription( fourthSide ),
            thirdComparison: thirdComparisonString
          } );
        }
        else {

          // general case, no interesting Properties about sides
          statement = this.getGeneralQuadrilateralSideDescription();
        }
      }
    }

    return statement;
  }

  /**
   * Returns a description of the relative angles at vertices for a general quadrilateral. This is often
   * used as a fallback case when there aren't particular aspects of equal angles to describe. Will return
   * something like
   *
   * "Corner C is somewhat smaller than corner A and Corner B is a little smaller than Corner D."
   * @private
   */
  private getGeneralQuadrilateralVertexDescription() {
    const orderedOppositeVertexPairs = this.getVertexPairsOrderedForDescription( this.shapeModel.oppositeVertices );

    const firstCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 0 ].vertex1 );
    const secondCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 0 ].vertex2 );
    const thirdCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 1 ].vertex1 );
    const fourthCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 1 ].vertex2 );

    const firstComparisonString = this.getAngleComparisonDescription( orderedOppositeVertexPairs[ 0 ].vertex2, orderedOppositeVertexPairs[ 0 ].vertex1 );
    const secondComparisonString = this.getAngleComparisonDescription( orderedOppositeVertexPairs[ 1 ].vertex2, orderedOppositeVertexPairs[ 1 ].vertex1 );

    const patternString = '{{firstCorner}} is {{firstComparison}} {{secondCorner}}, and {{thirdCorner}} is {{secondComparison}} {{fourthCorner}}.';
    return StringUtils.fillIn( patternString, {
      firstCorner: firstCornerString,
      firstComparison: firstComparisonString,
      secondCorner: secondCornerString,
      thirdCorner: thirdCornerString,
      secondComparison: secondComparisonString,
      fourthCorner: fourthCornerString
    } );
  }

  /**
   * Returns a "basic" description for a quadrilateral without interesting side Properties. Describes the relative
   * lengths of opposite sides of the quadrilateral. Sides in the descriptions are ordered by the method in
   * getSidePairsOrderedForDescription.
   * @private
   */
  private getGeneralQuadrilateralSideDescription(): string {

    // general fallback pattern for a quadrilateral without interesting properties, describing relative lengths
    // of opposite sides
    const patternString = 'Side {{firstSide}} is {{firstComparison}} side {{secondSide}}. Side {{thirdSide}} is {{secondComparison}} Side {{fourthSide}}';
    const sortedOppositeSidePairs = this.getSidePairsOrderedForDescription( this.shapeModel.oppositeSides );

    const firstSide = sortedOppositeSidePairs[ 0 ].side1;
    const secondSide = sortedOppositeSidePairs[ 0 ].side2;
    const thirdSide = sortedOppositeSidePairs[ 1 ].side1;
    const fourthSide = sortedOppositeSidePairs[ 1 ].side2;

    // comparing the lengths of each opposite side pair, relative to the first side in the pair
    const firstComparisonString = this.getLengthComparisonDescription( secondSide, firstSide );
    const secondComparisonString = this.getLengthComparisonDescription( fourthSide, thirdSide );

    return StringUtils.fillIn( patternString, {
      firstSide: this.getSideDescription( firstSide ),
      firstComparison: firstComparisonString,
      secondSide: this.getSideDescription( secondSide ),
      thirdSide: this.getSideDescription( thirdSide ),
      secondComparison: secondComparisonString,
      fourthSide: this.getSideDescription( fourthSide )
    } );
  }

  getTwoSidePairsDescription( sidePairs: SidePair[], patternString: string ): string {
    assert && assert( sidePairs.length === 2, 'getTwoSidePairsDescription assumes you are describing two pairs of sides with some interesting property' );

    const orderedSidePairs = this.getSidePairsOrderedForDescription( sidePairs );

    // Compare the lengths of the first two parallel sides against the lengths of the second two parallel sides,
    // relative to the first two parallel sides.
    const comparisonString = this.getLengthComparisonDescription( orderedSidePairs[ 1 ].side1, orderedSidePairs[ 0 ].side1 );

    // const patternString = 'Equal Sides {{firstSide}} and {{secondSide}} are {{comparison}} equal Sides {{thirdSide}} and {{fourthSide}}.';
    return StringUtils.fillIn( patternString, {
      firstSide: this.getSideDescription( orderedSidePairs[ 0 ].side1 ),
      secondSide: this.getSideDescription( orderedSidePairs[ 0 ].side2 ),
      comparison: comparisonString,
      thirdSide: this.getSideDescription( orderedSidePairs[ 1 ].side1 ),
      fourthSide: this.getSideDescription( orderedSidePairs[ 1 ].side2 )
    } );
  }

  /**
   * Get a description of all four vertex angles when the two provided vertex angles are equal. Uses a string pattern
   * that will return something like
   *
   * "Equal corners D and A are a little larger than Corner B and much much smaller than Corner C."
   *
   * The order that the vertices are described in the statement is determined by the sorting algorithm in
   * getVerticesOrderedForDescription.
   * @private
   */
  private getTwoEqualVerticesAngleDescription( vertex1: Vertex, vertex2: Vertex ) {

    const sortedVertices = this.getVerticesOrderedForDescription( [ vertex1, vertex2 ] );
    const firstVertex = sortedVertices[ 0 ];
    const secondVertex = sortedVertices[ 1 ];

    const patternString = 'Equal {{firstCorners}} are {{firstComparison}} {{thirdCorner}} and {{secondComparison}} {{fourthCorner}}.';
    const firstCornersString = this.getCornersAngleDescription( firstVertex, secondVertex );

    const undescribedVertices = this.getUndescribedVertices( [ firstVertex, secondVertex ] );
    const sortedUndescribedVertices = this.getVerticesOrderedForDescription( undescribedVertices );

    const thirdCornerString = this.getCornerAngleDescription( sortedUndescribedVertices[ 0 ] );
    const fourthCornerString = this.getCornerAngleDescription( sortedUndescribedVertices[ 1 ] );

    // describe the relative size of the equal angles compared to eqch unequal angle
    const firstComparisonString = this.getAngleComparisonDescription( sortedUndescribedVertices[ 0 ], firstVertex );
    const secondComparisonString = this.getAngleComparisonDescription( sortedUndescribedVertices[ 1 ], firstVertex );

    return StringUtils.fillIn( patternString, {
      firstCorners: firstCornersString,
      firstComparison: firstComparisonString,
      thirdCorner: thirdCornerString,
      secondComparison: secondComparisonString,
      fourthCorner: fourthCornerString
    } );
  }

  /**
   * Generates a description of vertex angles when there are two pairs of equal vertex angles in the quadrilateral.
   * Uses a string pattern that will return a string like
   *
   * "Equal corners D and C are much smaller than equal corners A and B."
   *
   * The order in which VertexPairs are described are defined by the algorithm of getVertexPairsOrderedForDescription.
   * @private
   */
  private getTwoPairsOfEqualVerticesAngleDescription( vertexPairs: VertexPair[] ): string {

    const orderedVertexPairs = this.getVertexPairsOrderedForDescription( vertexPairs );

    const firstCornersString = this.getCornersAngleDescription( orderedVertexPairs[ 0 ].vertex1, orderedVertexPairs[ 0 ].vertex2 );
    const secondCornersString = this.getCornersAngleDescription( orderedVertexPairs[ 1 ].vertex1, orderedVertexPairs[ 1 ].vertex2 );

    // we are comparing the angles of the vertex pairs, relative to the first described pair
    const comparisonString = this.getAngleComparisonDescription( orderedVertexPairs[ 1 ].vertex1, orderedVertexPairs[ 0 ].vertex1 );

    const patternString = 'Equal {{firstCorners}} are {{comparison}} equal {{secondCorners}}.';
    return StringUtils.fillIn( patternString, {
      firstCorners: firstCornersString,
      comparison: comparisonString,
      secondCorners: secondCornersString
    } );
  }

  /**
   * If the corner is a right angle will describe that before the vertex label. Otherwise just returns the vertex label.
   * Returns something like
   * "Corner A" or
   * "right angle Corner A"
   */
  private getCornerAngleDescription( vertex: Vertex ): string {

    const labelString = vertexCornerLabelMap.get( vertex.vertexLabel );
    assert && assert( labelString, 'vertexLabel not in vertexLabelMap' );

    let descriptionString = labelString;
    assert && assert( vertex.angleProperty, 'Angle required for this description' );
    if ( this.shapeModel.isRightAngle( vertex.angleProperty!.value ) ) {

      // include "right angle"
      descriptionString = StringUtils.fillIn( 'right angle {{cornerLabel}}', {
        cornerLabel: labelString
      } );
    }

    return descriptionString!;
  }

  /**
   * Get the described label for a Side
   * @param side
   */
  getSideDescription( side: Side ): string {
    const label = this.sideLabelMap.get( side )!;
    assert && assert( label, 'label not found for side' );
    return label;
  }

  /**
   * Get a description about two angles at once, assuming that they are equal. Returns something like
   * "Corners A and B" or
   * "right angle Corners A and B"
   *
   * Note that two vertex angles may NOT be exactly equal due to the behavior of angleToleranceIntervalProperty,
   * which allows for more lenient equality for parallelogram.
   */
  private getCornersAngleDescription( vertex1: Vertex, vertex2: Vertex ): string {
    const firstLabelString = vertexLabelMap.get( vertex1.vertexLabel );
    const secondLabelString = vertexLabelMap.get( vertex2.vertexLabel );

    const cornersPatternString = 'Corners {{firstCorner}} and {{secondCorner}}';

    let descriptionString = StringUtils.fillIn( cornersPatternString, {
      firstCorner: firstLabelString,
      secondCorner: secondLabelString
    } );

    assert && assert( vertex1.angleProperty, 'angles need to be ready for use in getCornersAngleDescription' );
    const angle1 = vertex1.angleProperty!.value;
    if ( this.shapeModel.isRightAngle( angle1 ) ) {
      descriptionString = StringUtils.fillIn( 'right angle {{cornersString}}', {
        cornersString: descriptionString
      } );
    }

    return descriptionString;
  }

  /**
   * Returns the description of comparison between two angles, using the entries of angleComparisonDescriptionMap.
   * Description compares vertex2 to vertex1. So if vertex2 has a larger angle than vertex1 the output will be something
   * like:
   * "much much wider than" or
   * "a little wider than"
   *
   * or if vertex2 angle is smaller than vertex1, we will return something like
   * "much much smaller than" or
   * "a little smaller than"
   */
  private getAngleComparisonDescription( vertex1: Vertex, vertex2: Vertex ): string {
    assert && assert( vertex1.angleProperty, 'angles need to be initialized for descriptions' );
    assert && assert( vertex2.angleProperty, 'angles need to be initialized for descriptions' );

    let description: string | null = null;

    const angle1 = vertex1.angleProperty!.value;
    const angle2 = vertex2.angleProperty!.value;
    const angleDifference = angle2 - angle1;

    angleComparisonDescriptionMap.forEach( ( value, key ) => {
      if ( key.contains( angleDifference ) ) {
        description = value;
      }
    } );

    assert && assert( description, `Description not found for angle difference ${angleDifference}` );
    return description!;
  }

  /**
   * Returns a description of comparison between two sides, using entries of lengthComparisonDescriptionMap.
   * Description compares side2 to side1. For example, if side2 is longer than side1 the output will be something
   * like:
   * "Side2 is much longer than side1."
   */
  private getLengthComparisonDescription( side1: Side, side2: Side ): string {
    let description: string | null = null;

    const length1 = side1.lengthProperty.value;
    const length2 = side2.lengthProperty.value;
    const lengthDifference = length2 - length1;

    lengthComparisonDescriptionMap.forEach( ( value, key ) => {
      if ( key.contains( lengthDifference ) ) {
        description = value;
      }
    } );

    assert && assert( description, 'Length comparison description not found for provided Sides' );
    return description!;
  }

  /**
   * For some reason, it was decided that the order that vertices are mentioned in descriptions need to be ordered in a
   * unique way. This function returns the vertices in the order that they should be described in the string
   * creation functions of this Describer.
   */
  getVerticesOrderedForDescription( vertices: Vertex[] ) {

    const order = vertices.sort( ( a: Vertex, b: Vertex ) => {
      return this.compareVerticesForDescription( a, b );
    } );

    assert && assert( order.length === vertices.length, 'An order for vertices was not identified.' );
    return order;
  }

  compareVerticesForDescription( vertex1: Vertex, vertex2: Vertex ): number {
    const firstPosition = vertex1.positionProperty.value;
    const secondPosition = vertex2.positionProperty.value;

    let sortReturnValue = 0;

    // if vertically equal, left most vertex is spoken first
    if ( firstPosition.y === secondPosition.y ) {

      // if first position is left of second position, a before b
      sortReturnValue = firstPosition.x < secondPosition.x ? -1 : 1;
    }
    else {

      // if first position is lower than second position, a before b
      sortReturnValue = firstPosition.y < secondPosition.y ? -1 : 1;
    }

    return sortReturnValue;
  }

  getVertexPairsOrderedForDescription( vertexPairs: VertexPair[] ): VertexPair[] {

    // Order each vertexPair provided first
    const newVertexPairs: VertexPair[] = [];
    vertexPairs.forEach( vertexPair => {
      const orderedVertices = this.getVerticesOrderedForDescription( [ vertexPair.vertex1, vertexPair.vertex2 ] );
      newVertexPairs.push( { vertex1: orderedVertices[ 0 ], vertex2: orderedVertices[ 1 ] } );
    } );

    // Now we can sort the VertexPairs based on the first vertex of each pair, since the vertices in
    // each pair are now sorted
    const orderedVertexPairs = newVertexPairs.sort( ( vertexPair1: VertexPair, vertexPair2: VertexPair ) => {
      return this.compareVerticesForDescription( vertexPair1.vertex1, vertexPair2.vertex1 );
    } );

    assert && assert( vertexPairs.length === orderedVertexPairs.length, 'Did not identify an order for VertexPairs' );
    return orderedVertexPairs;
  }

  private compareSidesForDescription( side1: Side, side2: Side ) {
    let vertex1ToCompare = this.getVerticesOrderedForDescription( [ side1.vertex1, side1.vertex2 ] )[ 0 ];
    let vertex2ToCompare = this.getVerticesOrderedForDescription( [ side2.vertex1, side2.vertex2 ] )[ 0 ];

    // if the lowest vertices have the same position, we are comparing adjacent sides who share a vertex at the
    // lowest intersection point - compare the other Side vertices instead
    if ( vertex1ToCompare === vertex2ToCompare ) {
      vertex1ToCompare = side1.getHighestVertex();
      vertex2ToCompare = side2.getHighestVertex();
    }

    return this.compareVerticesForDescription( vertex1ToCompare, vertex2ToCompare );
  }

  /**
   * Given a collection of SidePairs, order the sides so that they are in the order that they should appear in the
   * description. For a reason I don't fully understand, vertices and sides are described bottom to top, and left to
   * right. First, we order each side within the SidePair with that criterion. Then we order the SidePairs for the
   * final returned array.
   * @param sidePairs
   */
  getSidePairsOrderedForDescription( sidePairs: SidePair[] ): SidePair[] {

    // First we order the sides in each SidePair so that we can find the SidePair with the vertices
    // that should come first
    const orderedSidePairs: SidePair[] = [];
    sidePairs.forEach( sidePair => {
      const side1 = sidePair.side1;
      const side2 = sidePair.side2;

      const sideComparison = this.compareSidesForDescription( side1, side2 );

      let firstSide = side1;
      let secondSide = side2;

      if ( sideComparison > 0 ) {

        // comparator says side2 before side1 (0 indicates no change, -1 indicates side1 before side2)
        firstSide = side2;
        secondSide = side1;
      }

      orderedSidePairs.push( { side1: firstSide, side2: secondSide } );
    } );

    // the orderedSidePairs now have SidePairs with individual sides in the correct order, so we can sort the pairs
    // by the first side (which should always come first)
    const order = orderedSidePairs.sort( ( sidePairA, sidePairB ) => {
      return this.compareSidesForDescription( sidePairA.side1, sidePairB.side1 );
    } );

    assert && assert( sidePairs.length === order.length, 'Order not determined for sidePairs' );
    return order;
  }

  /**
   * From an array of Vertices, all of which have been described, return a new array of Vertices that still
   * need a description. Useful when you have a description for a pair of adjacent/opposite vertices but don't
   * have a reference to the remaining vertices yet.
   */
  private getUndescribedVertices( vertices: Vertex[] ): Vertex[] {
    const unusedVertices: Vertex[] = [];
    this.shapeModel.vertices.forEach( vertex => {
      if ( !vertices.includes( vertex ) ) {
        unusedVertices.push( vertex );
      }
    } );

    return unusedVertices;
  }

  /**
   * From an array of Sides which you know have been described, return a new array of Sides that still need a
   * description. Useful when you are describing two adjacent/opposite sides and don't have a reference yet to the
   * remaining adjacent sides.
   */
  private getUndescribedSides( sides: Side[] ): Side[] {
    const unusedSides: Side[] = [];

    this.shapeModel.sides.forEach( side => {
      if ( !sides.includes( side ) ) {
        unusedSides.push( side );
      }
    } );

    return unusedSides;
  }
}

quadrilateral.register( 'QuadrilateralDescriber', QuadrilateralDescriber );
export default QuadrilateralDescriber;

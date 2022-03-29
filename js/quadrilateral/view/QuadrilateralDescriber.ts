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
import QuadrilateralShapeModel, { VertexPair } from '../model/QuadrilateralShapeModel.js';
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
const rightSideString = quadrilateralStrings.a11y.voicing.transformations.rightSide;
const leftSideString = quadrilateralStrings.a11y.voicing.transformations.leftSide;
const keepingAParallelogramString = quadrilateralStrings.a11y.voicing.transformations.keepingAParallelogram;
const youLostYourParallelogramPatternString = quadrilateralStrings.a11y.voicing.transformations.youLostYourParallelogramPattern;
const proximityToParallelPatternString = quadrilateralStrings.a11y.voicing.transformations.proximityToParallelogramPattern;
const youMadeAParallelogramString = quadrilateralStrings.a11y.voicing.transformations.youMadeAParallelogram;
const namedShapeParalleogramHintPatternString = quadrilateralStrings.a11y.voicing.namedShapeParalleogramHintPattern;
const namedShapeNotAParallelogramHintPatternString = quadrilateralStrings.a11y.voicing.namedShapeNotAParallelogramHintPattern;
const firstDetailsStatementPatternString = quadrilateralStrings.a11y.voicing.firstDetailsStatementPattern;
const cornerAString = quadrilateralStrings.a11y.cornerA;
const cornerBString = quadrilateralStrings.a11y.cornerB;
const cornerCString = quadrilateralStrings.a11y.cornerC;
const cornerDString = quadrilateralStrings.a11y.cornerD;
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

// A map that goes from VertexLabel -> letter label (like "Corner A")
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

class QuadrilateralDescriber {
  private readonly shapeModel: QuadrilateralShapeModel;

  // The tolerance used to determine if a tilt has changed enough to describe it.
  public readonly tiltDifferenceToleranceInterval: number;
  public readonly lengthDifferenceToleranceInterval: number;

  constructor( shapeModel: QuadrilateralShapeModel ) {
    this.shapeModel = shapeModel;

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

    // of type NamedQuadrilateral enumeration
    const shapeName = this.shapeModel.shapeNameProperty.value;
    const shapeNameString = this.getShapeNameDescription( shapeName );

    const patternString = this.shapeModel.isParallelogramProperty.value ? namedShapeParalleogramHintPatternString :
                          namedShapeNotAParallelogramHintPatternString;

    return StringUtils.fillIn( patternString, {
      shapeName: shapeNameString
    } );
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

        // TODO: Note big similarities here between KITE and TRAPEZOID, consider refactoring

        // if there are two adjacent vertices with equal angles, combine them in the description
        if ( adjacentEqualVertexPairs.length > 0 ) {

          // start with the adjacent corners in the prescribed order
          assert && assert( adjacentEqualVertexPairs.length === 1, 'should only be one adjacent vertex pair for a trapezoid' );
          const orderedEqualVertices = this.getVerticesOrderedForDescription( [ adjacentEqualVertexPairs[ 0 ].vertex1, adjacentEqualVertexPairs[ 0 ].vertex2 ] );

          const patternString = 'Equal {{firstCorners}} are {{firstComparison}} {{thirdCorner}} and {{secondComparison}} {{fourthCorner}}';
          const firstCornersString = this.getCornersAngleDescription( orderedEqualVertices[ 0 ], orderedEqualVertices[ 1 ] );

          const undescribedVertices = this.getUndescribedVertices( orderedEqualVertices );
          const sortedUndescribedVertices = this.getVerticesOrderedForDescription( undescribedVertices );

          const thirdCornerString = this.getCornerAngleDescription( sortedUndescribedVertices[ 0 ] );
          const fourthCornerString = this.getCornerAngleDescription( sortedUndescribedVertices[ 1 ] );

          // describe the relative size of the equal angles compared to eqch unequal angle
          const firstComparisonString = this.getAngleComparisonDescription( sortedUndescribedVertices[ 0 ], orderedEqualVertices[ 0 ] );
          const secondComparisonString = this.getAngleComparisonDescription( sortedUndescribedVertices[ 1 ], orderedEqualVertices[ 0 ] );

          statement = StringUtils.fillIn( patternString, {
            firstCorners: firstCornersString,
            firstComparison: firstComparisonString,
            thirdCorner: thirdCornerString,
            secondComparison: secondComparisonString,
            fourthCorner: fourthCornerString
          } );
        }
        else {

          // For a trapezoid, none of the angles will be equal. Describe opposite pairs of angles and their relative
          // sizes in the prescribed order.
          const orderedOppositeVertexPairs = this.getVertexPairsOrderedForDescription( this.shapeModel.oppositeVertices );

          const firstCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 0 ].vertex1 );
          const secondCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 0 ].vertex2 );
          const thirdCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 1 ].vertex1 );
          const fourthCornerString = this.getCornerAngleDescription( orderedOppositeVertexPairs[ 1 ].vertex2 );

          const firstComparisonString = this.getAngleComparisonDescription( orderedOppositeVertexPairs[ 0 ].vertex2, orderedOppositeVertexPairs[ 0 ].vertex1 );
          const secondComparisonString = this.getAngleComparisonDescription( orderedOppositeVertexPairs[ 1 ].vertex2, orderedOppositeVertexPairs[ 1 ].vertex1 );

          const patternString = '{{firstCorner}} is {{firstComparison}} {{secondCorner}}, and {{thirdCorner}} is {{secondComparison}} {{fourthCorner}}.';
          statement = StringUtils.fillIn( patternString, {
            firstCorner: firstCornerString,
            firstComparison: firstComparisonString,
            secondCorner: secondCornerString,
            thirdCorner: thirdCornerString,
            secondComparison: secondComparisonString,
            fourthCorner: fourthCornerString
          } );
        }
      }
      else if ( shapeName === NamedQuadrilateral.ISOSCELES_TRAPEZOID ) {
        statement = 'please implement details for isosceles trapezoid.';

        assert && assert( adjacentEqualVertexPairs.length === 2, 'There should be two pairs of adjacent equal angles for an isosceles trapezoid' );

        const patternString = 'Equal {{firstCorners}} are {{comparison}} equal {{secondCorners}}.';
        const orderedVertexPairs = this.getVertexPairsOrderedForDescription( adjacentEqualVertexPairs );

        const firstCornersString = this.getCornersAngleDescription( orderedVertexPairs[ 0 ].vertex1, orderedVertexPairs[ 0 ].vertex2 );
        const secondCornersString = this.getCornersAngleDescription( orderedVertexPairs[ 1 ].vertex1, orderedVertexPairs[ 1 ].vertex2 );

        // Comparing angles between first equal pair and second equal pair, relative to the first equal pair
        const comparisonString = this.getAngleComparisonDescription( orderedVertexPairs[ 1 ].vertex1, orderedVertexPairs[ 0 ].vertex1 );

        statement = StringUtils.fillIn( patternString, {
          firstCorners: firstCornersString,
          comparison: comparisonString,
          secondCorners: secondCornersString
        } );
      }
      else if ( this.shapeModel.isParallelogramProperty.value ) {

        // there should be two pairs of equal opposite angles
        assert && assert( oppositeEqualVertexPairs.length === 2, 'there should be two pairs of equal opposite angles for a parallelogram' );

        // order the vertex pairs as they should be described for a parallelogram
        const orderedVertexPairs = this.getVertexPairsOrderedForDescription( oppositeEqualVertexPairs );

        const firstCornersString = this.getCornersAngleDescription( orderedVertexPairs[ 0 ].vertex1, orderedVertexPairs[ 0 ].vertex2 );
        const secondCornersString = this.getCornersAngleDescription( orderedVertexPairs[ 1 ].vertex1, orderedVertexPairs[ 1 ].vertex2 );

        // we are comparing the angles of the vertex pairs, relative to the first described pair
        const comparisonString = this.getAngleComparisonDescription( orderedVertexPairs[ 1 ].vertex1, orderedVertexPairs[ 0 ].vertex1 );

        const patternString = 'Equal {{firstCorners}} are {{comparison}} equal {{secondCorners}}';
        statement = StringUtils.fillIn( patternString, {
          firstCorners: firstCornersString,
          comparison: comparisonString,
          secondCorners: secondCornersString
        } );
      }
      else if ( shapeName === NamedQuadrilateral.CONCAVE ) {

        // might have special format for concave parallelogram, but unsure
        statement = 'Do we need a special details 2 for a concave shape?';
      }
      else {

        // general quadrilateral format
        // insert "right angle" where necessary
        // Corner {{C}} is {{somewhat smaller than}} Corner {{A}}, and Corner {{B}} is {{a little smaller than}} Corner {{D}}.
        statement = 'Please implement details 2 for a general quadrilateral';
      }
    }

    return statement;
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

  private getCornersAngleDescription( vertex1: Vertex, vertex2: Vertex ): string {
    const angle1 = vertex1.angleProperty!.value;
    const angle2 = vertex2.angleProperty!.value;
    assert && assert( this.shapeModel.isShapeAngleEqualToOther( angle1, angle2 ), 'Combining angle description for angles that are not equal.' );

    const firstLabelString = vertexLabelMap.get( vertex1.vertexLabel );
    const secondLabelString = vertexLabelMap.get( vertex2.vertexLabel );

    const cornersPatternString = 'Corners {{firstCorner}} and {{secondCorner}}';

    let descriptionString = StringUtils.fillIn( cornersPatternString, {
      firstCorner: firstLabelString,
      secondCorner: secondLabelString
    } );
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

  /**
   * From an array of Vertices, all of which have been described, return a new array of Vertices that still
   * need a description.
   *
   * TODO: Consider a new model Property that monitors for this instead of this function? Not sure if that
   * is better.
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
}

quadrilateral.register( 'QuadrilateralDescriber', QuadrilateralDescriber );
export default QuadrilateralDescriber;

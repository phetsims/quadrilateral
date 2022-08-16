// Copyright 2021-2022, University of Colorado Boulder

/**
 * Responsible for generating the real-time feedback alerts (mostly context responses) for the simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import Alerter from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import QuadrilateralScreenView from './QuadrilateralScreenView.js';
import { Voicing } from '../../../../scenery/js/imports.js';
import ResponsePacket from '../../../../utterance-queue/js/ResponsePacket.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import ShapeSnapshot from '../model/ShapeSnapshot.js';
import Side from '../model/Side.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MovementAlerter from '../../../../scenery-phet/js/accessibility/describers/MovementAlerter.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vertex from '../model/Vertex.js';
import Utils from '../../../../dot/js/Utils.js';

const foundAParallelogramString = quadrilateralStrings.a11y.voicing.foundAParallelogram;
const lostYourParallelogramString = quadrilateralStrings.a11y.voicing.lostYourParallelogram;
const foundAParallelogramWithAllRightAnglesString = quadrilateralStrings.a11y.voicing.foundAParallelogramWithAllRightAngles;
const foundAParallelogramWithAllSidesEqualString = quadrilateralStrings.a11y.voicing.foundAParallelogramWithAllSidesEqual;
const foundParallelogramWithAnglesAndSidesEqualString = quadrilateralStrings.a11y.voicing.foundParallelogramWithAnglesAndSidesEqual;
const allRightAnglesAndSidesEqualString = quadrilateralStrings.a11y.voicing.allRightAnglesAndSidesEqual;
const allSidesEqualString = quadrilateralStrings.a11y.voicing.allSidesEqual;
const allRightAnglesString = quadrilateralStrings.a11y.voicing.allRightAngles;
const aBString = quadrilateralStrings.a11y.aB;
const bCString = quadrilateralStrings.a11y.bC;
const cDString = quadrilateralStrings.a11y.cD;
const dAString = quadrilateralStrings.a11y.dA;
const oppositeSidesTiltPatternString = quadrilateralStrings.a11y.voicing.oppositeSidesTiltPattern;
const oppositeSidesInParallelPatternString = quadrilateralStrings.a11y.voicing.oppositeSidesInParallelPattern;
const oppositeSidesInParallelAsCornersChangeEquallyPatternString = quadrilateralStrings.a11y.voicing.oppositeSidesInParallelAsCornersChangeEquallyPattern;
const oppositeSidesTiltAsShapeChangesPatternString = quadrilateralStrings.a11y.voicing.oppositeSidesTiltAsShapeChangesPattern;
const allSidesTiltAwayFromParallelString = quadrilateralStrings.a11y.voicing.allSidesTiltAwayFromParallel;
const allSidesTiltAwayFromParallelAsShapeChangesPatternString = quadrilateralStrings.a11y.voicing.allSidesTiltAwayFromParallelAsShapeChangesPattern;
const tiltString = quadrilateralStrings.a11y.voicing.tilt;
const straightenString = quadrilateralStrings.a11y.voicing.straighten;
const biggerString = quadrilateralStrings.a11y.voicing.bigger;
const smallerString = quadrilateralStrings.a11y.voicing.smaller;
const vertexAString = quadrilateralStrings.vertexA;
const vertexBString = quadrilateralStrings.vertexB;
const vertexCString = quadrilateralStrings.vertexC;
const vertexDString = quadrilateralStrings.vertexD;
const backString = quadrilateralStrings.a11y.voicing.back;
const goneString = quadrilateralStrings.a11y.voicing.gone;
const cornersBackString = quadrilateralStrings.a11y.voicing.cornersBack;
const cornersGoneString = quadrilateralStrings.a11y.voicing.cornersGone;
const cornerDetectedPatternString = quadrilateralStrings.a11y.voicing.cornerDetectedPattern;
const shorterString = quadrilateralStrings.a11y.voicing.sideDragObjectResponse.shorter;
const longerString = quadrilateralStrings.a11y.voicing.sideDragObjectResponse.longer;
const widerString = quadrilateralStrings.a11y.voicing.vertexDragObjectResponse.wider;
const vertexDragSmallerString = quadrilateralStrings.a11y.voicing.vertexDragObjectResponse.smaller;
const fartherFromString = quadrilateralStrings.a11y.voicing.vertexDragObjectResponse.fartherFrom;
const closerToString = quadrilateralStrings.a11y.voicing.vertexDragObjectResponse.closerTo;
const fullVertexDragObjectResponsePatternString = quadrilateralStrings.a11y.voicing.vertexDragObjectResponse.fullVertexDragObjectResponsePattern;
const partialVertexDragObjectResponsePatternString = quadrilateralStrings.a11y.voicing.vertexDragObjectResponse.partialVertexDragObjectResponsePattern;

// Constants that control side object responses. See the getSideChangeObjectResponse for more information.
const DESCRIBE_CLOSER_TO_OPPOSITE_SIDE_THRESHOLD = 0.04; // Large, more strict requirement for describing proximity
const DESCRIBE_LONGER_ADJACENT_SIDES_THRESHOLD = 0.002;
const BOTH_ADJACENT_SIDES_CHANGE_THE_SAME_THRESHOLD = 0.001; // Changes should be about equal to be described as such

// A response may trigger because there is a large enough change in angle or length
type ResponseReason = 'angle' | 'length';

class QuadrilateralAlerter extends Alerter {

  private readonly model: QuadrilateralModel;

  // Depending on what combinations of state the shape enters/loses we use different descriptions. We need
  // to track previous values and compare every time Properties change. We cannot use multilink for this because
  // we can only update after all deferred Properties of the model have been set.
  private wasParallelogram: boolean;
  private wereAllLengthsEqual: boolean;
  private wereAllAnglesRight: boolean;
  private wasSideABSideCDParallel: boolean;
  private wasSideBCSideDAParallel: boolean;

  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;

  private readonly modelViewTransform: ModelViewTransform2;

  // Indicates when it is time to announce an angle/length response because that aspect of the quadrilateral shape
  // has changed enough to describe it.
  private angleResponseReady = false;
  private lengthResponseReady = false;

  // A snapshot of state variables when it is time to produce a new response describing the change in angle or length.
  // A new snapshot will be generated when it is time to announce the context response.
  private previousContextResponseShapeSnapshot: ShapeSnapshot;
  private previousObjectResponseShapeSnapshot: ShapeSnapshot;

  public constructor( model: QuadrilateralModel, screenView: QuadrilateralScreenView, modelViewTransform: ModelViewTransform2 ) {
    super();

    this.quadrilateralShapeModel = model.quadrilateralShapeModel;

    this.model = model;
    this.modelViewTransform = modelViewTransform;

    this.previousContextResponseShapeSnapshot = new ShapeSnapshot( this.quadrilateralShapeModel );
    this.previousObjectResponseShapeSnapshot = new ShapeSnapshot( this.quadrilateralShapeModel );

    // The utterance used when the shape state changes, but in ways that are less pedagogically relevant than
    // the important state information. This Utterance is therefore interruptable and lower priority than the
    // importantStateUtterance in the utterance queue.
    // const shapeResponsePacket = new ResponsePacket();
    const lowPriorityUtterance = new Utterance( {
      priority: Utterance.LOW_PRIORITY
    } );

    const mediumPriorityUtterance = new Utterance( {
      priority: Utterance.MEDIUM_PRIORITY
    } );

    const highPriorityUtterance = new Utterance( {

      // for important state changes of the shape, this utterance is used so that it cannot be interrupted
      // by further interaction
      priority: Utterance.HIGH_PRIORITY
    } );

    this.wasParallelogram = model.quadrilateralShapeModel.isParallelogramProperty.value;
    this.wereAllLengthsEqual = model.quadrilateralShapeModel.allLengthsEqualProperty.value;
    this.wereAllAnglesRight = model.quadrilateralShapeModel.allAnglesRightProperty.value;

    this.wasSideABSideCDParallel = model.quadrilateralShapeModel.sideABSideCDParallelSideChecker.areSidesParallel();
    this.wasSideBCSideDAParallel = model.quadrilateralShapeModel.sideBCSideDAParallelSideChecker.areSidesParallel();

    // Upon simulation reset, reset certain state for description so that next descriptions after reset are correct
    model.resetNotInProgressProperty.link( resetNotInProgress => {
      this.previousContextResponseShapeSnapshot = new ShapeSnapshot( this.quadrilateralShapeModel );
      this.previousObjectResponseShapeSnapshot = new ShapeSnapshot( this.quadrilateralShapeModel );
    } );

    model.quadrilateralShapeModel.shapeChangedEmitter.addListener( () => {
      const responsePacket = new ResponsePacket();

      // By default, we use the lower priority Utterance that won't interrupt responses that are currently being
      // announced. If we detect a critical state change, we will use a higher priority Utterance for interruption.
      let utterance = lowPriorityUtterance;

      const previousAAngle = this.previousContextResponseShapeSnapshot.vertexAAngle;
      const previousBAngle = this.previousContextResponseShapeSnapshot.vertexBAngle;
      const previousCAngle = this.previousContextResponseShapeSnapshot.vertexCAngle;
      const previousDAngle = this.previousContextResponseShapeSnapshot.vertexDAngle;

      const aAngleDifference = previousAAngle - this.quadrilateralShapeModel.vertexA.angleProperty.value!;
      const bAngleDifference = previousBAngle - this.quadrilateralShapeModel.vertexB.angleProperty.value!;
      const cAngleDifference = previousCAngle - this.quadrilateralShapeModel.vertexC.angleProperty.value!;
      const dAngleDifference = previousDAngle - this.quadrilateralShapeModel.vertexD.angleProperty.value!;

      const angleDifferences = [ aAngleDifference, bAngleDifference, cAngleDifference, dAngleDifference ];
      this.angleResponseReady = _.some( angleDifferences, angleDifference => Math.abs( angleDifference ) > Math.PI / 12 );

      const previousABLength = this.previousContextResponseShapeSnapshot.topSideLength;
      const previousBCLength = this.previousContextResponseShapeSnapshot.rightSideLength;
      const previousCDLength = this.previousContextResponseShapeSnapshot.bottomSideLength;
      const previousDALength = this.previousContextResponseShapeSnapshot.leftSideLength;

      const abLengthDifference = previousABLength - this.quadrilateralShapeModel.topSide.lengthProperty.value;
      const bcLengthDifference = previousBCLength - this.quadrilateralShapeModel.rightSide.lengthProperty.value;
      const cdLengthDifference = previousCDLength - this.quadrilateralShapeModel.bottomSide.lengthProperty.value;
      const daLengthDifference = previousDALength - this.quadrilateralShapeModel.leftSide.lengthProperty.value;

      const lengthDifferences = [ abLengthDifference, bcLengthDifference, cdLengthDifference, daLengthDifference ];
      const angleDifferencesLarge = _.some( angleDifferences, angleDifference => angleDifference > Math.PI / 24 );

      this.lengthResponseReady = _.some( lengthDifferences, lengthDifference => Math.abs( lengthDifference ) > Side.SIDE_SEGMENT_LENGTH ) && !angleDifferencesLarge;

      const sideABSideCDParallelAfter = this.quadrilateralShapeModel.sideABSideCDParallelSideChecker.areSidesParallel();
      const sideBCSideDAParallelAfter = this.quadrilateralShapeModel.sideBCSideDAParallelSideChecker.areSidesParallel();

      // If we go from zero parallel side pairs to at least one pair, trigger a new context response so that we hear
      // when sides become parallel. This is relative to every change, so state variables are set immediateley instead
      // of using the snapshot.
      const parallelSideResponseReady = ( !this.wasSideABSideCDParallel && !this.wasSideBCSideDAParallel ) && ( sideABSideCDParallelAfter || sideBCSideDAParallelAfter );
      this.wasSideABSideCDParallel = sideABSideCDParallelAfter;
      this.wasSideBCSideDAParallel = sideBCSideDAParallelAfter;

      // prioritize the "important" information change, other content is not spoken if this is ready
      const importantStateResponse = this.getImportantStateChangeResponse();
      if ( importantStateResponse ) {
        responsePacket.contextResponse = importantStateResponse!;
        utterance = highPriorityUtterance;
      }
      else if ( this.angleResponseReady || this.lengthResponseReady || parallelSideResponseReady ) {
        const thisResponseReason = angleDifferencesLarge ? 'angle' : 'length';
        const tiltChangeResponse = this.getShapeChangeResponse( this.quadrilateralShapeModel, this.previousContextResponseShapeSnapshot, thisResponseReason );
        utterance = mediumPriorityUtterance;
        responsePacket.contextResponse = tiltChangeResponse!;
      }

      model.quadrilateralShapeModel.sides.forEach( side => {
        if ( side.voicingObjectResponseDirty ) {
          responsePacket.objectResponse = this.getSideChangeObjectResponse( side );
          side.voicingObjectResponseDirty = false;
        }
      } );

      model.quadrilateralShapeModel.vertices.forEach( vertex => {
        if ( vertex.voicingObjectResponseDirty ) {
          responsePacket.objectResponse = this.getVertexChangeObjectResponse( vertex );
          vertex.voicingObjectResponseDirty = false;
        }
      } );

      // Announce responses if we have generated any content.
      if ( responsePacket.contextResponse || responsePacket.objectResponse ) {
        utterance.alert = responsePacket;
        this.alert( utterance );

        // save snapshots for next shape changes
        if ( responsePacket.contextResponse ) {
          this.previousContextResponseShapeSnapshot = new ShapeSnapshot( this.quadrilateralShapeModel );
        }
        if ( responsePacket.objectResponse ) {
          this.previousObjectResponseShapeSnapshot = new ShapeSnapshot( this.quadrilateralShapeModel );
        }
      }
    } );

    // Responses specific to the OpenCV prototype - letting the user know when markers become obscured from the camera.
    const markerResponsePacket = new ResponsePacket();
    const markerUtterance = new Utterance( {
      alert: markerResponsePacket,
      priority: Utterance.LOW_PRIORITY
    } );

    model.allVertexMarkersDetectedProperty.link( allVertexMarkersDetected => {
      if ( model.markerResponsesEnabledProperty.value ) {
        markerResponsePacket.contextResponse = allVertexMarkersDetected ? cornersBackString : cornersGoneString;
        this.alert( markerUtterance );
      }
    } );

    // Reusable listener that describes when a
    const vertexDetectionResponseListener = ( labelString: string, detected: boolean ) => {
      if ( model.markerResponsesEnabledProperty.value ) {
        const stateString = detected ? backString : goneString;
        markerResponsePacket.contextResponse = StringUtils.fillIn( cornerDetectedPatternString, {
          label: labelString,
          state: stateString
        } );
        this.alert( markerUtterance );
      }
    };

    model.vertexAMarkerDetectedProperty.link( detected => { vertexDetectionResponseListener( vertexAString, detected ); } );
    model.vertexBMarkerDetectedProperty.link( detected => { vertexDetectionResponseListener( vertexBString, detected ); } );
    model.vertexCMarkerDetectedProperty.link( detected => { vertexDetectionResponseListener( vertexCString, detected ); } );
    model.vertexDMarkerDetectedProperty.link( detected => { vertexDetectionResponseListener( vertexDString, detected ); } );

    // So that this content respects voicingVisible.
    Voicing.registerUtteranceToNode( lowPriorityUtterance, screenView );
    Voicing.registerUtteranceToNode( mediumPriorityUtterance, screenView );
    Voicing.registerUtteranceToNode( highPriorityUtterance, screenView );
    Voicing.registerUtteranceToNode( markerUtterance, screenView );
  }

  /**
   * Returns the object response for the side as it changes from user input like dragging. Describes the change in
   * length of adjacent side and possibly proximity of the changing side to its opposite side. Amount of content in
   * the response depends on whether the adjacent sides change the same amount, and how much the length of adjacent
   * sides changed. Will return something like
   *
   * "right" or
   * "left" or
   * "adjacent sides change unequally" or
   * "adjacent sides longer" or
   * "adjacent sides longer, farther from opposite side"
   */
  private getSideChangeObjectResponse( side: Side ): string {
    let response = '';

    const previousAdjacentLengths = this.previousObjectResponseShapeSnapshot.getAdjacentSideLengthsFromSideLabel( side.sideLabel );
    const firstPreviousAdjacentSideLength = previousAdjacentLengths[ 0 ];
    const secondPreviousAdjacentSideLength = previousAdjacentLengths[ 1 ];

    const adjacentSides = this.quadrilateralShapeModel.adjacentSideMap.get( side )!;
    const firstAdjacentSideLength = adjacentSides[ 0 ].lengthProperty.value;
    const secondAdjacentSideLength = adjacentSides[ 1 ].lengthProperty.value;

    const firstAdjacentSideLengthDifference = firstAdjacentSideLength - firstPreviousAdjacentSideLength;
    const secondAdjacentSideLengthDifference = secondAdjacentSideLength - secondPreviousAdjacentSideLength;

    const firstSideAbsoluteDifference = Math.abs( firstAdjacentSideLengthDifference );
    const secondSideAbsoluteDifference = Math.abs( secondAdjacentSideLengthDifference );

    if ( firstSideAbsoluteDifference > DESCRIBE_LONGER_ADJACENT_SIDES_THRESHOLD || secondSideAbsoluteDifference > DESCRIBE_LONGER_ADJACENT_SIDES_THRESHOLD ) {

      // one of the sides has moved by a large enough distance to describe changes in adjacent side length
      let adjacentSideChangeString = '';
      const adjacentSidesLonger = firstAdjacentSideLengthDifference > 0;

      if ( Utils.equalsEpsilon( firstAdjacentSideLengthDifference, secondAdjacentSideLengthDifference, BOTH_ADJACENT_SIDES_CHANGE_THE_SAME_THRESHOLD ) ) {

        // both adjacent sides changed about the same so we can combine a description to say that adjacent sides
        // got shorter or longer
        const changeString = adjacentSidesLonger ? longerString : shorterString;
        adjacentSideChangeString = StringUtils.fillIn( 'adjacent sides {{change}}', {
          change: changeString
        } );
      }
      else {

        // both adjacent sides changed but in very different amounts so we combine the description to say that both
        // sides changed unequally
        adjacentSideChangeString = 'adjacent sides change unequally';
      }

      if ( firstSideAbsoluteDifference > DESCRIBE_CLOSER_TO_OPPOSITE_SIDE_THRESHOLD && secondSideAbsoluteDifference > DESCRIBE_CLOSER_TO_OPPOSITE_SIDE_THRESHOLD ) {

        // both adjacent sides have changed enough to include a description about proximity to the other side
        const proximityString = adjacentSidesLonger ? 'farther from opposite side' : 'closer to opposite side';
        adjacentSideChangeString = StringUtils.fillIn( '{{change}}, {{proximity}}', {
          change: adjacentSideChangeString,
          proximity: proximityString
        } );
      }

      response = adjacentSideChangeString;
    }
    else {

      // adjacent sides did not change enough, just include a direction description
      const currentVertex1Position = side.vertex1.positionProperty.value;
      const previousVertex1Position = this.previousObjectResponseShapeSnapshot.getVertexPositionsFromSideLabel( side.sideLabel )[ 0 ];
      const translationVector = currentVertex1Position.minus( previousVertex1Position );
      const movementAngle = translationVector.angle;
      response = MovementAlerter.getDirectionDescriptionFromAngle( movementAngle, {
        modelViewTransform: this.modelViewTransform
      } );
    }

    return response;
  }

  /**
   * Returns the Object Response that is announced every movement with keyboard dragging. This
   * is unique to keyboard input. With mouse/touch input, the less frequent rate of context responses
   * are sufficient for the Voicing output to describe the changing shape. With keyboard, the user
   * needs a response every key press to know that changes are happening. Will return something like
   *
   * "angle smaller, farther from opposite corner" or
   * "angle smaller, closer to opposite corner" or
   * "angle wider, farther from opposite corner"
   *
   * Note that since this is dependent on angles and not just position Properties, this must be called after
   * shapeChangedEmitter emits when we know that all angle and shape Properties have been updated. See
   * QuadrilateralShapeModel.updateOrderDependentProperties for more information.
   */
  private getVertexChangeObjectResponse( vertex: Vertex ): string {
    let response = '';

    const currentAngle = vertex.angleProperty.value!;
    const previousAngle = this.previousObjectResponseShapeSnapshot.getAngleFromVertexLabel( vertex.vertexLabel );

    const oppositeVertex = this.quadrilateralShapeModel.oppositeVertexMap.get( vertex )!;
    const currentOppositeDistance = QuadrilateralShapeModel.getDistanceBetweenVertices( vertex, oppositeVertex );
    const previousOppositeDistance = this.previousObjectResponseShapeSnapshot.getDistanceBetweenVertices( vertex.vertexLabel, oppositeVertex.vertexLabel );

    const distanceChangeString = currentOppositeDistance > previousOppositeDistance ? fartherFromString : closerToString;

    if ( previousAngle === currentAngle ) {

      // Moving around symmetric shapes, it is possible to move the vertex into a new position where the angle
      // stayed the same. In this case, only describe position relative to the opposite vertex.
      response = StringUtils.fillIn( partialVertexDragObjectResponsePatternString, {
        distanceChange: distanceChangeString
      } );
    }
    else {
      const angleChangeString = currentAngle > previousAngle ? widerString : vertexDragSmallerString;

      response = StringUtils.fillIn( fullVertexDragObjectResponsePatternString, {
        angleChange: angleChangeString,
        distanceChange: distanceChangeString
      } );
    }

    return response;
  }

  /**
   * Get a response description for the shape change from previous state to current. Will describe parallel sides,
   * shape area, and side tilt during changes and interaction. The logic of this function is as described in the
   * design doc, see
   * https://docs.google.com/document/d/1jXayebAWnnNzsT3l6o72YPw4-YtiQaHQNuAi64eiguc/edit#heading=h.ap2d0jqvt5et
   *
   * Will return something like
   * "Opposite sides AB and CD tilt in parallel as shape gets bigger." or
   * "All sides tilt away from parallel as opposite corners change unequally." or
   * "Opposite sides straighten in parallel as opposite corners change equally." or
   *
   * @param shapeModel
   * @param previousShapeSnapshot - Object holding shape fields from the previous time this function was used
   * @param responseReason - This response happens when angles or lengths change enough to trigger a new description,
   *                         the triggering case will determine parts of the response string.
   */
  private getShapeChangeResponse( shapeModel: QuadrilateralShapeModel, previousShapeSnapshot: ShapeSnapshot, responseReason: ResponseReason ): string | null {
    let response: string | null = null;

    const areaDifference = shapeModel.areaProperty.value - previousShapeSnapshot.area;
    const areaChangeString = areaDifference > 0 ? biggerString : smallerString;

    if ( shapeModel.isParallelogramProperty.value && previousShapeSnapshot.isParallelogram ) {

      // remained a parallelogram through changes
      if ( responseReason === 'angle' ) {

        // angle is the dominant response and caused the change, we are describing change in side tilt
        const currentDistancesToRight = [ shapeModel.vertexA.angleProperty.value!, shapeModel.vertexB.angleProperty.value!, shapeModel.vertexC.angleProperty.value!, shapeModel.vertexD.angleProperty.value! ].map( QuadrilateralAlerter.distanceFromRightAngle );
        const previousDistancesToRight = [ previousShapeSnapshot.vertexAAngle, previousShapeSnapshot.vertexBAngle, previousShapeSnapshot.vertexCAngle, previousShapeSnapshot.vertexDAngle ].map( QuadrilateralAlerter.distanceFromRightAngle );

        const differences = [];
        for ( let i = 0; i < currentDistancesToRight.length; i++ ) {
          differences.push( currentDistancesToRight[ i ]! - previousDistancesToRight[ i ] );
        }

        // If the distances to pi for every angle have gotten smaller, we are getting closer to right angles, that is
        // described as "straighten"
        const tiltChangeString = _.every( differences, difference => difference > 0 ) ? tiltString : straightenString;
        const patternString = oppositeSidesTiltPatternString;

        response = StringUtils.fillIn( patternString, {
          tiltChange: tiltChangeString
        } );
      }
      else if ( responseReason === 'length' ) {

        // lengths changed enough while in parallel to describe length without describing tilt
        const patternString = oppositeSidesInParallelPatternString;
        response = StringUtils.fillIn( patternString, {
          areaChange: areaChangeString
        } );
      }
    }
    else {

      const sideABsideCDParallelBefore = previousShapeSnapshot.sideABsideCDParallel;
      const sideBCSideDAParallelBefore = previousShapeSnapshot.sideBCsideDAParallel;

      const sideABSideCDParallelAfter = shapeModel.sideABSideCDParallelSideChecker.areSidesParallel();
      const sideBCSideDAParallelAfter = shapeModel.sideBCSideDAParallelSideChecker.areSidesParallel();

      // for readability, cases are determined by current and change in side parallel state of sides
      const onlyOneParallelAfter = sideABSideCDParallelAfter !== sideBCSideDAParallelAfter;
      const neitherParallelBefore = !sideABsideCDParallelBefore && !sideBCSideDAParallelBefore;
      const neitherParallelAfter = !sideABSideCDParallelAfter && !sideBCSideDAParallelAfter;
      const atLeastOneParallelBefore = sideABsideCDParallelBefore || sideBCSideDAParallelBefore;

      // Any remaining parallel sides are described, determine which opposite sides to use
      let firstSideString;
      let secondSideString;
      if ( sideABSideCDParallelAfter ) {
        firstSideString = aBString;
        secondSideString = cDString;
      }
      else {
        firstSideString = bCString;
        secondSideString = dAString;
      }

      if ( neitherParallelBefore && onlyOneParallelAfter ) {
        const patternString = oppositeSidesInParallelAsCornersChangeEquallyPatternString;

        response = StringUtils.fillIn( patternString, {
          firstSide: firstSideString,
          secondSide: secondSideString
        } );
      }
      else if ( onlyOneParallelAfter ) {

        // if one pair of sides remains in parallel after the change, and it is the same side pair
        const patternString = oppositeSidesTiltAsShapeChangesPatternString;
        response = StringUtils.fillIn( patternString, {
          firstSide: firstSideString,
          secondSide: secondSideString,
          areaChange: areaChangeString
        } );
      }
      else if ( atLeastOneParallelBefore && neitherParallelAfter ) {

        // at least one to zero parallel side pairs
        response = allSidesTiltAwayFromParallelString;
      }
      else if ( neitherParallelBefore && neitherParallelAfter ) {

        // no parallel side pairs before and after
        const patternString = allSidesTiltAwayFromParallelAsShapeChangesPatternString;
        response = StringUtils.fillIn( patternString, {
          areaChange: areaChangeString
        } );
      }
    }

    return response;
  }

  /**
   * Return distance (absolute value) of an angle against a right angle (pi/2).
   */
  private static distanceFromRightAngle( angle: number ): number {
    return Math.abs( Math.PI / 2 - angle );
  }

  /**
   * Get a response that describes the most important state changes (as decided by design/pedagogy), such as when
   * the shape becomes a parallelogram, gets all sides of equal length, or gets all right angles.
   *
   * Note this function has side effects!! When it is time to generate this description we update state variables
   * watching to see if the important shape attributes have changed since the last time this function was used.
   */
  private getImportantStateChangeResponse(): string | null {
    const parallelogram = this.model.quadrilateralShapeModel.isParallelogramProperty.value;
    const allLengthsEqual = this.model.quadrilateralShapeModel.allLengthsEqualProperty.value;
    const allAnglesRight = this.model.quadrilateralShapeModel.allAnglesRightProperty.value;

    // no alerts while resetting - necessary because calculations for parallel state happen in step and
    let contextResponse: string | null = null;

    if ( parallelogram !== this.wasParallelogram ) {
      if ( parallelogram ) {

        // we just became a parallelogram, make sure to include that in the description
        contextResponse = ( allLengthsEqual && allAnglesRight ) ? foundParallelogramWithAnglesAndSidesEqualString :
                          allLengthsEqual ? foundAParallelogramWithAllSidesEqualString :
                          allAnglesRight ? foundAParallelogramWithAllRightAnglesString :
                          foundAParallelogramString;
      }
      else {
        contextResponse = lostYourParallelogramString;
      }
    }
    else {
      const becameAllLengthsEqual = allLengthsEqual && allLengthsEqual !== this.wereAllLengthsEqual;
      const becameAllRightAngles = allAnglesRight && allAnglesRight !== this.wereAllAnglesRight;

      if ( becameAllLengthsEqual && becameAllRightAngles ) {

        // just became a parallelogram, describe the parallelogram and its additional length/angle states
        contextResponse = allRightAnglesAndSidesEqualString;
      }
      else if ( becameAllLengthsEqual ) {

        // only the all lengths equal state changed
        contextResponse = allSidesEqualString;
      }
      else if ( becameAllRightAngles ) {

        // only the all right angles state changed
        contextResponse = allRightAnglesString;
      }
    }

    // update values for comparison next time
    this.wasParallelogram = parallelogram;
    this.wereAllLengthsEqual = allLengthsEqual;
    this.wereAllAnglesRight = allAnglesRight;

    return contextResponse;
  }
}

quadrilateral.register( 'QuadrilateralAlerter', QuadrilateralAlerter );
export default QuadrilateralAlerter;

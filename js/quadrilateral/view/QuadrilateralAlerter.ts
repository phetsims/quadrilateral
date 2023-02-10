// Copyright 2021-2023, University of Colorado Boulder

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
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import ShapeSnapshot from '../model/ShapeSnapshot.js';
import Side from '../model/Side.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MovementAlerter from '../../../../scenery-phet/js/accessibility/describers/MovementAlerter.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vertex from '../model/Vertex.js';
import Utils from '../../../../dot/js/Utils.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import QuadrilateralDescriber from './QuadrilateralDescriber.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import VertexDescriber from './VertexDescriber.js';

const foundShapePatternString = QuadrilateralStrings.a11y.voicing.foundShapePattern;
const aBString = QuadrilateralStrings.a11y.aB;
const bCString = QuadrilateralStrings.a11y.bC;
const cDString = QuadrilateralStrings.a11y.cD;
const dAString = QuadrilateralStrings.a11y.dA;
const oppositeSidesTiltPatternString = QuadrilateralStrings.a11y.voicing.oppositeSidesTiltPattern;
const oppositeSidesInParallelPatternString = QuadrilateralStrings.a11y.voicing.oppositeSidesInParallelPattern;
const oppositeSidesInParallelAsCornersChangeEquallyPatternString = QuadrilateralStrings.a11y.voicing.oppositeSidesInParallelAsCornersChangeEquallyPattern;
const oppositeSidesTiltAsShapeChangesPatternString = QuadrilateralStrings.a11y.voicing.oppositeSidesTiltAsShapeChangesPattern;
const oppositeSidesEqualAsShapeChangesPatternString = QuadrilateralStrings.a11y.voicing.oppositeSidesEqualAsShapeChangesPattern;
const maintainingAParallelogramAngleResponseString = QuadrilateralStrings.a11y.voicing.maintainingAParallelogramAngleResponse;
const maintainingAParallelogramLengthResponsePatternString = QuadrilateralStrings.a11y.voicing.maintainingAParallelogramLengthResponsePattern;
const maintainingATrapezoidAsShapeChangesPatternString = QuadrilateralStrings.a11y.voicing.maintainingATrapezoidAsShapeChangesPattern;
const allRightAnglesAsShapeChangesPatternString = QuadrilateralStrings.a11y.voicing.allRightAnglesAsShapeChangesPattern;
const maintainingARhombusString = QuadrilateralStrings.a11y.voicing.maintainingARhombus;
const allSidesEqualAsShapeChangesPatternString = QuadrilateralStrings.a11y.voicing.allSidesEqualAsShapeChangesPattern;
const cornerFlatAsShapeChangesPatternString = QuadrilateralStrings.a11y.voicing.cornerFlatAsShapeChangesPattern;
const adjacentSidesChangeEquallyAsShapeChangesPatternString = QuadrilateralStrings.a11y.voicing.adjacentSidesChangeEquallyAsShapeChangesPattern;
const allSidesTiltAwayFromParallelString = QuadrilateralStrings.a11y.voicing.allSidesTiltAwayFromParallel;
const allSidesTiltAwayFromParallelAsShapeChangesPatternString = QuadrilateralStrings.a11y.voicing.allSidesTiltAwayFromParallelAsShapeChangesPattern;
const tiltString = QuadrilateralStrings.a11y.voicing.tilt;
const straightenString = QuadrilateralStrings.a11y.voicing.straighten;
const biggerString = QuadrilateralStrings.a11y.voicing.bigger;
const smallerString = QuadrilateralStrings.a11y.voicing.smaller;
const vertexAString = QuadrilateralStrings.vertexA;
const vertexBString = QuadrilateralStrings.vertexB;
const vertexCString = QuadrilateralStrings.vertexC;
const vertexDString = QuadrilateralStrings.vertexD;
const backString = QuadrilateralStrings.a11y.voicing.back;
const goneString = QuadrilateralStrings.a11y.voicing.gone;
const cornersBackString = QuadrilateralStrings.a11y.voicing.cornersBack;
const cornersGoneString = QuadrilateralStrings.a11y.voicing.cornersGone;
const cornerDetectedPatternString = QuadrilateralStrings.a11y.voicing.cornerDetectedPattern;
const shorterString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.shorter;
const longerString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.longer;
const widerString = QuadrilateralStrings.a11y.voicing.vertexDragObjectResponse.wider;
const vertexDragSmallerString = QuadrilateralStrings.a11y.voicing.vertexDragObjectResponse.smaller;
const vertexDragObjectResponsePatternString = QuadrilateralStrings.a11y.voicing.vertexDragObjectResponse.vertexDragObjectResponsePattern;
const adjacentSidesChangePatternString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.adjacentSidesChangePattern;
const rightAngleString = QuadrilateralStrings.a11y.voicing.rightAngle;
const angleFlatString = QuadrilateralStrings.a11y.voicing.angleFlat;
const angleComparisonPatternString = QuadrilateralStrings.a11y.voicing.angleComparisonPattern;
const oppositeCornerString = QuadrilateralStrings.a11y.voicing.oppositeCorner;
const adjacentCornersEqualString = QuadrilateralStrings.a11y.voicing.adjacentCornersEqual;
const adjacentCornersRightAnglesString = QuadrilateralStrings.a11y.voicing.adjacentCornersRightAngles;
const progressStatePatternString = QuadrilateralStrings.a11y.voicing.progressStatePattern;
const equalToOppositeCornerEqualToAdjacentCornersString = QuadrilateralStrings.a11y.voicing.equalToOppositeCornerEqualToAdjacentCorners;
const adjacentSidesInLinePatternString = QuadrilateralStrings.a11y.voicing.adjacentSidesInLinePattern;
const equalToAdjacentCornersString = QuadrilateralStrings.a11y.voicing.equalToAdjacentCorners;
const adjacentSidesChangeInLengthString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.adjacentSidesChangeInLength;
const parallelAdjacentSidesChangePatternString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.parallelAdjacentSidesChangePattern;
const equalAdjacentSidesChangePatternString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.equalAdjacentSidesChangePattern;
const equalToAdjacentSidesString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.equalToAdjacentSides;
const adjacentSidesEqualString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.adjacentSidesEqual;
const adjacentSidesParallelString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.adjacentSidesParallel;
const equalToOneAdjacentSideString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.equalToOneAdjacentSide;
const twoSidesEqualString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.twoSidesEqual;
const threeSidesEqualString = QuadrilateralStrings.a11y.voicing.sideDragObjectResponse.threeSidesEqual;


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

  private readonly describer: QuadrilateralDescriber;

  public constructor( model: QuadrilateralModel, screenView: QuadrilateralScreenView, modelViewTransform: ModelViewTransform2, describer: QuadrilateralDescriber ) {
    super();

    this.quadrilateralShapeModel = model.quadrilateralShapeModel;

    this.model = model;
    this.modelViewTransform = modelViewTransform;

    this.describer = describer;

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

      // Nothing about these should be heard while resetting
      if ( model.resetNotInProgressProperty.value ) {
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
        const importantStateResponse = this.getShapeNameChangeResponse();
        if ( importantStateResponse ) {
          responsePacket.contextResponse = importantStateResponse!;
          utterance = highPriorityUtterance;
        }
        else if ( this.angleResponseReady || this.lengthResponseReady || parallelSideResponseReady ) {
          const thisResponseReason = angleDifferencesLarge ? 'angle' : 'length';

          if ( this.previousContextResponseShapeSnapshot.namedQuadrilateral === this.quadrilateralShapeModel.shapeNameProperty.value ) {

            // the shape has changed enough to provide a context response, but the named quadrilateral has not
            // changed, so we provide a unique alert specific to the shape maintenance
            const shapeMaintenanceResponse = this.getShapeMaintenanceContextResponse( this.quadrilateralShapeModel.shapeNameProperty.value, this.previousContextResponseShapeSnapshot, thisResponseReason );
            responsePacket.contextResponse = shapeMaintenanceResponse;

          }
          else {
            const tiltChangeResponse = this.getShapeChangeResponse( this.quadrilateralShapeModel, this.previousContextResponseShapeSnapshot, thisResponseReason );
            responsePacket.contextResponse = tiltChangeResponse!;
          }

          utterance = mediumPriorityUtterance;
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
      }
    } );

    // Responses specific to the OpenCV prototype - letting the user know when markers become obscured from the camera.
    const markerResponsePacket = new ResponsePacket();
    const markerUtterance = new Utterance( {
      alert: markerResponsePacket,
      priority: Utterance.LOW_PRIORITY
    } );

    // TODO: Can this be removed?
    const markerDetectionModel = model.tangibleConnectionModel.markerDetectionModel;
    markerDetectionModel.allVertexMarkersDetectedProperty.link( allVertexMarkersDetected => {
      if ( markerDetectionModel.markerResponsesEnabledProperty.value ) {
        markerResponsePacket.contextResponse = allVertexMarkersDetected ? cornersBackString : cornersGoneString;
        this.alert( markerUtterance );
      }
    } );

    // Reusable listener that describes when a
    const vertexDetectionResponseListener = ( labelString: string, detected: boolean ) => {
      if ( markerDetectionModel.markerResponsesEnabledProperty.value ) {
        const stateString = detected ? backString : goneString;
        markerResponsePacket.contextResponse = StringUtils.fillIn( cornerDetectedPatternString, {
          label: labelString,
          state: stateString
        } );
        this.alert( markerUtterance );
      }
    };

    // TODO: remove these?
    markerDetectionModel.vertexAMarkerDetectedProperty.link( detected => { vertexDetectionResponseListener( vertexAString, detected ); } );
    markerDetectionModel.vertexBMarkerDetectedProperty.link( detected => { vertexDetectionResponseListener( vertexBString, detected ); } );
    markerDetectionModel.vertexCMarkerDetectedProperty.link( detected => { vertexDetectionResponseListener( vertexCString, detected ); } );
    markerDetectionModel.vertexDMarkerDetectedProperty.link( detected => { vertexDetectionResponseListener( vertexDString, detected ); } );

    // So that this content respects voicingVisible.
    Voicing.registerUtteranceToNode( lowPriorityUtterance, screenView );
    Voicing.registerUtteranceToNode( mediumPriorityUtterance, screenView );
    Voicing.registerUtteranceToNode( highPriorityUtterance, screenView );
    Voicing.registerUtteranceToNode( markerUtterance, screenView );
  }

  /**
   * Returns the object response for the side as it changes from user input like dragging. Describes the change in
   * length of adjacent side. Amount of content in the response depends on whether the adjacent sides change the same
   * amount, and how much the length of adjacent sides changed. Will return something like
   *
   * "adjacent sides equal" or
   * "equal to one adjacent side" or
   * "parallel adjacent sides longer" or
   * "equal adjacent sides shorter" or
   * "adjacent sides longer" or
   * "left" or
   * "up"
   */
  private getSideChangeObjectResponse( side: Side ): string {
    let response = '';

    const lengthTolerance = this.model.quadrilateralShapeModel.interLengthToleranceInterval;
    const shapeModel = this.model.quadrilateralShapeModel;

    const toleranceForDescribingLengthChange = lengthTolerance / 3;

    const currentShapeSnapshot = new ShapeSnapshot( this.model.quadrilateralShapeModel );

    const previousAdjacentLengths = this.previousObjectResponseShapeSnapshot.getAdjacentSideLengthsFromSideLabel( side.sideLabel );
    const firstPreviousAdjacentSideLength = previousAdjacentLengths[ 0 ];
    const secondPreviousAdjacentSideLength = previousAdjacentLengths[ 1 ];
    const previousAdjacentSidesEqual = Utils.equalsEpsilon( firstPreviousAdjacentSideLength, secondPreviousAdjacentSideLength, lengthTolerance );
    const previousAdjacentSidesParallel = this.previousObjectResponseShapeSnapshot.getAdjacentSidesParallelFromSideLabel( side.sideLabel );
    const previousLength = this.previousObjectResponseShapeSnapshot.getLengthFromSideLabel( side.sideLabel );
    const previousEqualToFirstAdjacent = shapeModel.isShapeLengthEqualToOther( previousLength, firstPreviousAdjacentSideLength );
    const previousEqualToSecondAdjacent = shapeModel.isShapeLengthEqualToOther( previousLength, secondPreviousAdjacentSideLength );
    const previousEqualToOneAdjacent = previousEqualToFirstAdjacent !== previousEqualToSecondAdjacent;
    const previousNumberOfEqualSides = this.previousObjectResponseShapeSnapshot.countNumberOfEqualSides( this.quadrilateralShapeModel.interLengthToleranceInterval );

    const adjacentSides = currentShapeSnapshot.getAdjacentSideLengthsFromSideLabel( side.sideLabel );
    const firstAdjacentSideLength = adjacentSides[ 0 ];
    const secondAdjacentSideLength = adjacentSides[ 1 ];
    const adjacentSidesEqual = Utils.equalsEpsilon( firstAdjacentSideLength, secondAdjacentSideLength, lengthTolerance );
    const adjacentSidesParallel = currentShapeSnapshot.getAdjacentSidesParallelFromSideLabel( side.sideLabel );
    const sideLength = currentShapeSnapshot.getLengthFromSideLabel( side.sideLabel );
    const equalToFirstAdjacent = shapeModel.isShapeLengthEqualToOther( sideLength, firstAdjacentSideLength );
    const equalToSecondAdjacent = shapeModel.isShapeLengthEqualToOther( sideLength, secondAdjacentSideLength );
    const equalToOneAdjacent = equalToFirstAdjacent !== equalToSecondAdjacent;
    const numberOfEqualSides = currentShapeSnapshot.countNumberOfEqualSides( this.quadrilateralShapeModel.interLengthToleranceInterval );

    const firstAdjacentSideLengthDifference = firstAdjacentSideLength - firstPreviousAdjacentSideLength;
    const secondAdjacentSideLengthDifference = secondAdjacentSideLength - secondPreviousAdjacentSideLength;

    const firstSideAbsoluteDifference = Math.abs( firstAdjacentSideLengthDifference );
    const secondSideAbsoluteDifference = Math.abs( secondAdjacentSideLengthDifference );

    if ( adjacentSidesEqual && ( ( equalToFirstAdjacent && !previousEqualToFirstAdjacent ) || ( equalToSecondAdjacent && !previousEqualToSecondAdjacent ) ) ) {

      // side just became equal to both adjacent sides
      response = equalToAdjacentSidesString;
    }
    else if ( adjacentSidesEqual && !previousAdjacentSidesEqual ) {

      // adjacent sides just became equal
      response = adjacentSidesEqualString;
    }
    else if ( adjacentSidesParallel && !previousAdjacentSidesParallel ) {

      // adjacent sides just became parallel, describe that next
      response = adjacentSidesParallelString;
    }
    else if ( equalToOneAdjacent && !previousEqualToOneAdjacent ) {

      // the moving side just became equal to ONE of its adjacent sides, call that out
      response = equalToOneAdjacentSideString;
    }
    else if ( numberOfEqualSides === 3 && previousNumberOfEqualSides < 3 ) {

      // we just found a shape with three equal sides (moving from two equal sides)
      response = threeSidesEqualString;
    }
    else if ( numberOfEqualSides === 2 && previousNumberOfEqualSides < 2 ) {

      // we just found a shape with two equal sides (moving from no equal sides)
      response = twoSidesEqualString;
    }
    else if ( firstSideAbsoluteDifference > toleranceForDescribingLengthChange || secondSideAbsoluteDifference > toleranceForDescribingLengthChange ) {
      if ( Math.sign( firstAdjacentSideLengthDifference ) === Math.sign( secondAdjacentSideLengthDifference ) ) {

        const adjacentSidesLonger = firstAdjacentSideLengthDifference > 0;
        const changeString = adjacentSidesLonger ? longerString : shorterString;

        // adjacent sides have changed in the same way as the side moves, this is a class of important things to
        // describe
        if ( adjacentSidesParallel ) {
          response = StringUtils.fillIn( parallelAdjacentSidesChangePatternString, {
            lengthChange: changeString
          } );
        }
        else if ( adjacentSidesEqual ) {
          response = StringUtils.fillIn( equalAdjacentSidesChangePatternString, {
            lengthChange: changeString
          } );
        }
        else {
          response = StringUtils.fillIn( adjacentSidesChangePatternString, {
            lengthChange: changeString
          } );
        }
      }
      else {

        // they are changing by a large amount, but in different ways so describe them generally
        response = adjacentSidesChangeInLengthString;
      }
    }
    else {

      // adjacent sides did not change enough, just include a direction description
      const currentVertex1Position = side.vertex1.positionProperty.value;
      const previousVertex1Position = this.previousObjectResponseShapeSnapshot.getVertexPositionsFromSideLabel( side.sideLabel )[ 0 ];
      response = QuadrilateralAlerter.getDirectionDescription( previousVertex1Position, currentVertex1Position, this.modelViewTransform );
    }

    return response;
  }

  /**
   * Returns the Object Response that is announced every movement with keyboard dragging. This
   * is unique to keyboard input. With mouse/touch input, the less frequent rate of context responses
   * are sufficient for the Voicing output to describe the changing shape. With keyboard, the user
   * needs a response every key press to know that changes are happening.
   *
   * This function is absurdly complicated, see https://github.com/phetsims/quadrilateral/issues/237 for
   * the request.
   *
   * Note that since this is dependent on angles and not just position Properties, this must be called after
   * shapeChangedEmitter emits when we know that all angle and shape Properties have been updated. See
   * QuadrilateralShapeModel.updateOrderDependentProperties for more information.
   */
  private getVertexChangeObjectResponse( vertex: Vertex ): string {
    let response;

    // The phrase like the direction change, how the vertex angle changes, or whether the vertex angle is at
    // a critical value like 90/180 degrees
    let progressResponse: string | null = null;

    // Additional state information about other vertices, or how wide the moving vertex is relative to others in the
    // shape.
    let stateResponse: string | null = null;

    const interAngleToleranceInterval = this.quadrilateralShapeModel.interAngleToleranceInterval;

    const currentAngle = vertex.angleProperty.value!;
    const previousAngle = this.previousObjectResponseShapeSnapshot.getAngleFromVertexLabel( vertex.vertexLabel );

    const oppositeVertex = this.quadrilateralShapeModel.oppositeVertexMap.get( vertex )!;
    const oppositeVertexAngle = oppositeVertex.angleProperty.value!;

    const adjacentVertices = this.quadrilateralShapeModel.adjacentVertexMap.get( vertex )!;
    const firstAdjacentVertex = adjacentVertices[ 0 ];
    const firstAdjacentAngle = firstAdjacentVertex.angleProperty.value!;
    const secondAdjacentVertex = adjacentVertices[ 1 ];
    const secondAdjacentAngle = secondAdjacentVertex.angleProperty.value!;

    // whether the moving vertex angle becomes equal to any of the other vertices (within interAngleToleranceInterval)
    const angleEqualToFirstAdjacent = QuadrilateralShapeModel.isInterAngleEqualToOther( currentAngle, firstAdjacentAngle, interAngleToleranceInterval );
    const angleEqualToSecondAdjacent = QuadrilateralShapeModel.isInterAngleEqualToOther( currentAngle, secondAdjacentAngle, interAngleToleranceInterval );
    const angleEqualToOpposite = QuadrilateralShapeModel.isInterAngleEqualToOther( currentAngle, oppositeVertexAngle, interAngleToleranceInterval );

    // Get the "progress" portion of the object response, describing how this vertex has changed or if it has
    // reached some critical angle. This portion of the description is always included.
    if ( previousAngle === currentAngle ) {

      // Moving around symmetric shapes, it is possible to move the vertex into a new position where the angle
      // stayed the same. In this case, only describe the direction of movement.
      const currentPosition = vertex.positionProperty.value;
      const previousPosition = this.previousObjectResponseShapeSnapshot.getPositionFromVertexLabel( vertex.vertexLabel );
      progressResponse = QuadrilateralAlerter.getDirectionDescription( previousPosition, currentPosition, this.modelViewTransform );
    }
    else if ( this.quadrilateralShapeModel.isRightAngle( currentAngle ) ) {
      progressResponse = rightAngleString;
    }
    else if ( this.quadrilateralShapeModel.isFlatAngle( currentAngle ) ) {
      progressResponse = angleFlatString;
    }
    else if ( !angleEqualToFirstAdjacent && !angleEqualToSecondAdjacent && !angleEqualToOpposite ) {

      // fallback case, just 'angle wider' or 'angle smaller' - but only if the angle is not equal to any other
      // to prevent the alert from getting too long
      const angleChangeString = currentAngle > previousAngle ? widerString : vertexDragSmallerString;
      progressResponse = StringUtils.fillIn( vertexDragObjectResponsePatternString, {
        angleChange: angleChangeString
      } );
    }

    const shapeName = this.quadrilateralShapeModel.shapeNameProperty.value;

    // get the "state" portion of the object response, which describes important state information about the
    // quadrilateral like when a pair of adjacent angles are equal, or when the moving angle is twice/half of another
    // angle in the shape. There may not always be important state information.
    if ( previousAngle !== currentAngle ) {
      if ( this.quadrilateralShapeModel.getAreAllAnglesRight() ) {

        // important state described when a square
        stateResponse = equalToOppositeCornerEqualToAdjacentCornersString;
      }
      else if ( angleEqualToFirstAdjacent && angleEqualToSecondAdjacent ) {

        // the moving angle just became equal to its two adjacent corners
        stateResponse = equalToAdjacentCornersString;
      }
      else if ( angleEqualToFirstAdjacent || angleEqualToOpposite || angleEqualToSecondAdjacent ) {

        // If vertex the angle just became equal to another, that is the most important information and should be
        // described
        const otherVertex = angleEqualToFirstAdjacent ? firstAdjacentVertex :
                            angleEqualToOpposite ? oppositeVertex :
                            secondAdjacentVertex;

        // if equal to the opposite corner, just say "opposite corner" instead of the corner label
        const otherCornerLabelString = angleEqualToOpposite ? oppositeCornerString :
                                       VertexDescriber.VertexCornerLabelMap.get( otherVertex.vertexLabel );

        const comparisonDescription = VertexDescriber.getAngleComparisonDescription( otherVertex, vertex, interAngleToleranceInterval, shapeName );
        stateResponse = StringUtils.fillIn( angleComparisonPatternString, {
          comparison: comparisonDescription,
          cornerLabel: otherCornerLabelString
        } );
      }
      else if ( this.shouldUseAngleComparisonDescription( currentAngle, oppositeVertexAngle ) ) {

        // describe relative size to opposite vertex
        const comparisonDescription = VertexDescriber.getAngleComparisonDescription( oppositeVertex, vertex, interAngleToleranceInterval, shapeName );
        stateResponse = StringUtils.fillIn( angleComparisonPatternString, {
          comparison: comparisonDescription,
          cornerLabel: oppositeCornerString
        } );
      }
      else if ( this.quadrilateralShapeModel.isInterAngleEqualToOther( firstAdjacentAngle, secondAdjacentAngle ) ) {

        // The adjacent angles just became equal to eachother, describe that next (after opposite in priority)
        if ( this.quadrilateralShapeModel.isRightAngle( firstAdjacentAngle ) ) {
          stateResponse = adjacentCornersRightAnglesString;
        }
        else {
          stateResponse = adjacentCornersEqualString;
        }
      }
      else if ( this.shouldUseAngleComparisonDescription( currentAngle, firstAdjacentAngle ) ) {

        // decribe relative size (half or twice as large as) to the first adjacent vertex
        const comparisonDescription = VertexDescriber.getAngleComparisonDescription( firstAdjacentVertex, vertex, interAngleToleranceInterval, shapeName );
        stateResponse = StringUtils.fillIn( angleComparisonPatternString, {
          comparison: comparisonDescription,
          cornerLabel: VertexDescriber.VertexCornerLabelMap.get( firstAdjacentVertex.vertexLabel )
        } );
      }
      else if ( this.shouldUseAngleComparisonDescription( currentAngle, secondAdjacentAngle ) ) {

        // decribe relative size (half or twice as large as) to the second adjacent vertex
        const comparisonDescription = VertexDescriber.getAngleComparisonDescription( secondAdjacentVertex, vertex, interAngleToleranceInterval, shapeName );
        stateResponse = StringUtils.fillIn( angleComparisonPatternString, {
          comparison: comparisonDescription,
          cornerLabel: VertexDescriber.VertexCornerLabelMap.get( secondAdjacentVertex.vertexLabel )
        } );
      }
    }

    assert && assert( progressResponse || stateResponse, 'There needs to be a response, we have a case that is not described.' );
    if ( progressResponse && stateResponse ) {

      response = StringUtils.fillIn( progressStatePatternString, {
        progress: progressResponse,
        state: stateResponse
      } );
    }
    else if ( stateResponse ) {
      response = stateResponse;
    }
    else {
      response = progressResponse;
    }

    return response!;
  }

  /**
   * Returns whether the changing vertex object response should include a description of the angle compared to another.
   * This is only included if the changingVertexAngle is around half, twice, or equal to the other angle. The other
   * angle might be an opposite or adjacent angle.
   */
  private shouldUseAngleComparisonDescription( changingVertexAngle: number, otherVertexAngle: number ): boolean {
    return VertexDescriber.isAngleAboutHalfOther( changingVertexAngle, otherVertexAngle ) ||
           VertexDescriber.isAngleAboutTwiceOther( changingVertexAngle, otherVertexAngle ) ||
           QuadrilateralShapeModel.isInterAngleEqualToOther( changingVertexAngle, otherVertexAngle, this.quadrilateralShapeModel.interAngleToleranceInterval );
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
        const tiltChangeString = this.getTiltOrStraightenDescription( previousShapeSnapshot );
        response = StringUtils.fillIn( oppositeSidesTiltPatternString, {
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
   * Returns a description of the shape for a context response as movements occur that maintain the same
   * name for the quadrilateral. See https://github.com/phetsims/quadrilateral/issues/198 for more information
   * about the design for this function.
   */
  private getShapeMaintenanceContextResponse( shapeName: NamedQuadrilateral, previousShapeSnapshot: ShapeSnapshot, thisResponseReason: ResponseReason ): string | null {
    let response: string | null = null;

    const areaDifference = this.quadrilateralShapeModel.areaProperty.value - previousShapeSnapshot.area;
    const areaChangeString = areaDifference > 0 ? biggerString : smallerString;

    if ( shapeName === NamedQuadrilateral.CONVEX_QUADRILATERAL || shapeName === NamedQuadrilateral.CONCAVE_QUADRILATERAL ) {
      response = StringUtils.fillIn( allSidesTiltAwayFromParallelAsShapeChangesPatternString, {
        areaChange: areaChangeString
      } );
    }
    else if ( shapeName === NamedQuadrilateral.TRIANGLE ) {
      const flatVertex = _.find(
        this.quadrilateralShapeModel.vertices,
        vertex => this.quadrilateralShapeModel.isStaticAngleEqualToOther( vertex.angleProperty.value!, Math.PI )
      );

      // consider small enough values as 'constant area' because the area might change by negligible values within
      // precision error
      if ( areaDifference < 1e-5 ) {

        // We have a triangle one vertex is 180 degrees and the shape is moving such that the area
        // is not changing. Describe the "flat" vertex and how its adjacent sides get longer or shorter
        response = StringUtils.fillIn( cornerFlatAsShapeChangesPatternString, {
          cornerLabel: VertexDescriber.VertexCornerLabelMap.get( flatVertex!.vertexLabel )
        } );
      }
      else {

        // We have a triangle being maintained but the area is changing, so we describe how it the adjacent
        // sides remain in line as the shape gets bigger or smaller

        // find the sides that are connected to the flat vertex
        const flatSides = _.filter( this.quadrilateralShapeModel.sides, side => side.vertex1 === flatVertex || side.vertex2 === flatVertex );
        assert && assert( flatSides.length === 2, 'We should have found two sides connected to the flat vertex' );

        response = StringUtils.fillIn( adjacentSidesInLinePatternString, {
          firstSide: QuadrilateralDescriber.getSideLabelString( flatSides[ 0 ].sideLabel ),
          secondSide: QuadrilateralDescriber.getSideLabelString( flatSides[ 1 ].sideLabel ),
          areaChange: areaChangeString
        } );
      }
    }
    else if ( shapeName === NamedQuadrilateral.DART || shapeName === NamedQuadrilateral.KITE ) {
      response = StringUtils.fillIn( adjacentSidesChangeEquallyAsShapeChangesPatternString, {
        areaChange: areaChangeString
      } );
    }
    else if ( shapeName === NamedQuadrilateral.TRAPEZOID ) {
      const sideABSideCDParallel = previousShapeSnapshot.sideABsideCDParallel;

      let firstSideString;
      let secondSideString;
      if ( sideABSideCDParallel ) {
        firstSideString = aBString;
        secondSideString = cDString;
      }
      else {
        firstSideString = bCString;
        secondSideString = dAString;
      }

      response = StringUtils.fillIn( maintainingATrapezoidAsShapeChangesPatternString, {
        firstSide: firstSideString,
        secondSide: secondSideString,
        areaChange: areaChangeString
      } );
    }
    else if ( shapeName === NamedQuadrilateral.ISOSCELES_TRAPEZOID ) {

      // For an isosceles trapezoid, describe the sides that remain equal in length
      const sideABSideCDParallel = previousShapeSnapshot.sideABsideCDParallel;

      // For an isosceles trapezoid, the non-parallel sides are the equal ones in length - we can use that without
      // searching through model Properties
      let firstSideString;
      let secondSideString;
      if ( sideABSideCDParallel ) {
        firstSideString = bCString;
        secondSideString = dAString;
      }
      else {
        firstSideString = aBString;
        secondSideString = cDString;
      }

      response = StringUtils.fillIn( oppositeSidesEqualAsShapeChangesPatternString, {
        firstSide: firstSideString,
        secondSide: secondSideString,
        areaChange: areaChangeString
      } );
    }
    else if ( shapeName === NamedQuadrilateral.PARALLELOGRAM ) {
      if ( thisResponseReason === 'angle' ) {
        response = StringUtils.fillIn( maintainingAParallelogramAngleResponseString, {
          areaChange: areaChangeString
        } );
      }
      else {
        response = StringUtils.fillIn( maintainingAParallelogramLengthResponsePatternString, {
          areaChange: areaChangeString
        } );
      }
    }
    else if ( shapeName === NamedQuadrilateral.RECTANGLE ) {
      response = StringUtils.fillIn( allRightAnglesAsShapeChangesPatternString, {
        areaChange: areaChangeString
      } );
    }
    else if ( shapeName === NamedQuadrilateral.RHOMBUS ) {
      response = maintainingARhombusString;
    }
    else if ( shapeName === NamedQuadrilateral.SQUARE ) {
      response = StringUtils.fillIn( allSidesEqualAsShapeChangesPatternString, {
        areaChange: areaChangeString
      } );
    }

    return response;
  }

  /**
   * Returns a description about whether the shape is tilting or straightening based on how the angles at each vertex
   * changed from the previous snapshot.
   */
  private getTiltOrStraightenDescription( previousShapeSnapshot: ShapeSnapshot ): string {

    // angle is the dominant response and caused the change, we are describing change in side tilt
    const currentDistancesToRight = [
      this.quadrilateralShapeModel.vertexA.angleProperty.value!,
      this.quadrilateralShapeModel.vertexB.angleProperty.value!,
      this.quadrilateralShapeModel.vertexC.angleProperty.value!,
      this.quadrilateralShapeModel.vertexD.angleProperty.value!
    ].map( QuadrilateralAlerter.distanceFromRightAngle );

    const previousDistancesToRight = [
      previousShapeSnapshot.vertexAAngle,
      previousShapeSnapshot.vertexBAngle,
      previousShapeSnapshot.vertexCAngle,
      previousShapeSnapshot.vertexDAngle
    ].map( QuadrilateralAlerter.distanceFromRightAngle );

    const differences = [];
    for ( let i = 0; i < currentDistancesToRight.length; i++ ) {
      differences.push( currentDistancesToRight[ i ]! - previousDistancesToRight[ i ] );
    }

    // If the distances to pi for every angle have gotten smaller, we are getting closer to right angles, that is
    // described as "straighten"
    return _.every( differences, difference => difference > 0 ) ? tiltString : straightenString;
  }

  /**
   * Return distance (absolute value) of an angle against a right angle (pi/2).
   */
  private static distanceFromRightAngle( angle: number ): number {
    return Math.abs( Math.PI / 2 - angle );
  }

  /**
   * Returns a direction description for the change in position as an object moves from position1 to position2.
   * Positions in model coordinates.
   */
  private static getDirectionDescription( previousPosition: Vector2, currentPosition: Vector2, modelViewTransform: ModelViewTransform2 ): string {
    const translationVector = currentPosition.minus( previousPosition );
    const movementAngle = translationVector.angle;
    return MovementAlerter.getDirectionDescriptionFromAngle( movementAngle, {
      modelViewTransform: modelViewTransform
    } );
  }

  /**
   * Get a response that describes changes to the detected shape name. As decided by design/pedagogy, this is the most
   * important information to describe as things change.
   */
  private getShapeNameChangeResponse(): string | null {
    const currentShapeName = this.model.quadrilateralShapeModel.shapeNameProperty.value;

    let contextResponse: string | null = null;
    if ( currentShapeName !== this.previousContextResponseShapeSnapshot.namedQuadrilateral ) {
      if ( this.model.visibilityModel.shapeNameVisibleProperty.value ) {
        contextResponse = this.getFoundShapeResponse( currentShapeName );
      }
      else {
        contextResponse = this.describer.getShapePropertiesDescription();
      }
    }

    return contextResponse;
  }

  /**
   * Returns a string describing a newly found shape. Returns something like
   * "Found a square." or
   * "Found an isosceles trapezoid."
   */
  private getFoundShapeResponse( namedQuadrilateral: NamedQuadrilateral ): string {
    return StringUtils.fillIn( foundShapePatternString, {
      shapeName: QuadrilateralDescriber.getShapeNameWithArticlesDescription( namedQuadrilateral )
    } );
  }
}

quadrilateral.register( 'QuadrilateralAlerter', QuadrilateralAlerter );
export default QuadrilateralAlerter;

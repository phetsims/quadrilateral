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

const foundAParallelogramString = quadrilateralStrings.a11y.voicing.foundAParallelogram;
const lostYourParallelogramString = quadrilateralStrings.a11y.voicing.lostYourParallelogram;
const foundAParallelogramWithAllRightAnglesString = quadrilateralStrings.a11y.voicing.foundAParallelogramWithAllRightAngles;
const foundAParallelogramWithAllSidesEqualString = quadrilateralStrings.a11y.voicing.foundAParallelogramWithAllSidesEqual;
const foundParallelogramWithAnglesAndSidesEqualString = quadrilateralStrings.a11y.voicing.foundParallelogramWithAnglesAndSidesEqual;
const allRightAnglesAndSidesEqualString = quadrilateralStrings.a11y.voicing.allRightAnglesAndSidesEqual;
const allSidesEqualString = quadrilateralStrings.a11y.voicing.allSidesEqual;
const allRightAnglesString = quadrilateralStrings.a11y.voicing.allRightAngles;

class QuadrilateralAlerter extends Alerter {

  private readonly model: QuadrilateralModel;

  // Depending on what combinations of state the shape enters/loses we use different descriptions. We need
  // to track previous values and compare every time Properties change. We cannot use multilink for this because
  // we can only update after all deferred Properties of the model have been set.
  private wasParallelogram: boolean;
  private wereAllLengthsEqual: boolean;
  private wereAllAnglesRight: boolean;

  // Indicates when it is time to announce an angle/length response because that aspect of the quadrilateral shape
  // has changed enough to describe it.
  private angleResponseReady = false;
  private lengthResponseReady = false;

  // A snapshot of state variables when it is time to produce a new response describing the change in angles. A new
  // snapshot will be generated when the angle response is created.
  private previousShapeSnapshotForAngleResponses: ShapeSnapshot;

  // A snapshot of state variables to indicate when it is time to produce a new response describing changes in side
  // length. A new snapshot will be generated when the response is created, so we are comparing changes between
  // when the
  private previousShapeSnapshotForLengthResponses: ShapeSnapshot;

  constructor( model: QuadrilateralModel, screenView: QuadrilateralScreenView ) {
    super();

    const shapeModel = model.quadrilateralShapeModel;

    this.model = model;
    this.previousShapeSnapshotForAngleResponses = new ShapeSnapshot( shapeModel );
    this.previousShapeSnapshotForLengthResponses = new ShapeSnapshot( shapeModel );

    // The utterance used when important pedagogical state changes like entering/exiting parallelogram, all lengths
    // equal, or all right angles
    const importantAlertResponsePacket = new ResponsePacket();
    const importantStateUtterance = new Utterance( {
      alert: importantAlertResponsePacket,
      announcerOptions: {
        cancelSelf: false
      },
      priority: Utterance.DEFAULT_PRIORITY
    } );

    // The utterance used when the shape state changes, but in ways that are less pedagogically relevant than
    // the important state information. This Utterance is therefore interruptable and lower priority than the
    // importantStateUtterance in the utterance queue.
    const changingStateResponsePacket = new ResponsePacket();
    const changingStateUtterance = new Utterance( {
      alert: changingStateResponsePacket,
      priority: Utterance.LOW_PRIORITY
    } );

    this.wasParallelogram = model.quadrilateralShapeModel.isParallelogramProperty.value;
    this.wereAllLengthsEqual = model.quadrilateralShapeModel.allLengthsEqualProperty.value;
    this.wereAllAnglesRight = model.quadrilateralShapeModel.allAnglesRightProperty.value;

    model.quadrilateralShapeModel.shapeChangedEmitter.addListener( () => {

      const previousAAngle = this.previousShapeSnapshotForAngleResponses.vertexAAngle;
      const previousBAngle = this.previousShapeSnapshotForAngleResponses.vertexBAngle;
      const previousCAngle = this.previousShapeSnapshotForAngleResponses.vertexCAngle;
      const previousDAngle = this.previousShapeSnapshotForAngleResponses.vertexDAngle;

      const aAngleDifference = previousAAngle - shapeModel.vertexA.angleProperty.value!;
      const bAngleDifference = previousBAngle - shapeModel.vertexB.angleProperty.value!;
      const cAngleDifference = previousCAngle - shapeModel.vertexC.angleProperty.value!;
      const dAngleDifference = previousDAngle - shapeModel.vertexD.angleProperty.value!;

      const angleDifferences = [ aAngleDifference, bAngleDifference, cAngleDifference, dAngleDifference ];
      this.angleResponseReady = _.some( angleDifferences, angleDifference => Math.abs( angleDifference ) > Math.PI / 6 );

      const previousABLength = this.previousShapeSnapshotForLengthResponses.topSideLength;
      const previousBCLength = this.previousShapeSnapshotForLengthResponses.rightSideLength;
      const previousCDLength = this.previousShapeSnapshotForLengthResponses.bottomSideLength;
      const previousDALength = this.previousShapeSnapshotForLengthResponses.leftSideLength;

      const abLengthDifference = previousABLength - shapeModel.topSide.lengthProperty.value;
      const bcLengthDifference = previousBCLength - shapeModel.rightSide.lengthProperty.value;
      const cdLengthDifference = previousCDLength - shapeModel.bottomSide.lengthProperty.value;
      const daLengthDifference = previousDALength - shapeModel.leftSide.lengthProperty.value;

      const lengthDifferences = [ abLengthDifference, bcLengthDifference, cdLengthDifference, daLengthDifference ];
      const angleDifferencesLarge = _.some( angleDifferences, angleDifference => angleDifference > Math.PI / 12 );

      this.lengthResponseReady = _.some( lengthDifferences, lengthDifference => Math.abs( lengthDifference ) > Side.SIDE_SEGMENT_LENGTH ) && !angleDifferencesLarge;

      if ( this.angleResponseReady ) {
        console.log( 'time for angle response' );
        const tiltChangeResponse = this.getAngleChangeResponse( shapeModel, this.previousShapeSnapshotForAngleResponses );
        changingStateResponsePacket.contextResponse = tiltChangeResponse;
        this.alert( changingStateUtterance );

        // TODO: Combine and just use one snapshot?
        this.previousShapeSnapshotForAngleResponses = new ShapeSnapshot( shapeModel );
        this.previousShapeSnapshotForLengthResponses = new ShapeSnapshot( shapeModel );
      }
      else if ( this.lengthResponseReady ) {
        console.log( 'time for length response' );
        const lengthChangeResponse = this.getLengthChangeResponse( shapeModel, this.previousShapeSnapshotForLengthResponses );
        changingStateResponsePacket.contextResponse = lengthChangeResponse;
        this.alert( changingStateUtterance );

        this.previousShapeSnapshotForAngleResponses = new ShapeSnapshot( shapeModel );
        this.previousShapeSnapshotForLengthResponses = new ShapeSnapshot( shapeModel );
      }

      const importantStateResponse = this.getImportantStateChangeResponse();
      if ( importantStateResponse ) {
        importantAlertResponsePacket.contextResponse = importantStateResponse!;
        this.alert( importantStateUtterance );
      }
    } );

    // So that this content respects voicingVisible.
    Voicing.registerUtteranceToNode( importantStateUtterance, screenView );
    Voicing.registerUtteranceToNode( changingStateUtterance, screenView );
  }

  private getLengthChangeResponse( shapeModel: QuadrilateralShapeModel, previousShapeSnapshot: ShapeSnapshot ): string | null {
    let response: string | null = null;

    // these are updated between descriptions, is that right?
    // getImportantStateChangeResponse updates every shape change...
    // if was a parallelogram and still is a parallelogram
    // "opposite sides in parallel as shape gets {{bigger/smaller}}

    if ( shapeModel.isParallelogramProperty.value && previousShapeSnapshot.isParallelogram ) {

      // remained a parallelogram between length change responses, describe how the sides are in parallel with
      // an area change
      const areaDifference = shapeModel.areaProperty.value - previousShapeSnapshot.area;

      // TODO: its possible to have a length change when we might expect angles to be changing because the length
      // does change as parallel sides tilt. See https://github.com/phetsims/quadrilateral/issues/154
      // assert && assert( areaDifference !== 0, 'with changing lengths the difference in area should not be zero...' );

      const patternString = 'Opposite sides in parallel as shape gets {{areaChange}}.';
      const areaChangeString = areaDifference > 0 ? 'bigger' : 'smaller';

      response = StringUtils.fillIn( patternString, {
        areaChange: areaChangeString
      } );
    }

    return response;
  }

  private getAngleChangeResponse( shapeModel: QuadrilateralShapeModel, previousShapeSnapshot: ShapeSnapshot ): string | null {
    let response: string | null = null;

    if ( shapeModel.isParallelogramProperty.value && previousShapeSnapshot.isParallelogram ) {

      const currentDistancesToRight = [ shapeModel.vertexA.angleProperty.value!, shapeModel.vertexB.angleProperty.value!, shapeModel.vertexC.angleProperty.value!, shapeModel.vertexD.angleProperty.value! ].map( QuadrilateralAlerter.distanceFromRightAngle );
      const previousDistancesToRight = [ previousShapeSnapshot.vertexAAngle, previousShapeSnapshot.vertexBAngle, previousShapeSnapshot.vertexCAngle, previousShapeSnapshot.vertexDAngle ].map( QuadrilateralAlerter.distanceFromRightAngle );

      const differences = [];
      for ( let i = 0; i < currentDistancesToRight.length; i++ ) {
        differences.push( currentDistancesToRight[ i ]! - previousDistancesToRight[ i ] );
      }

      // If the distances to pi for every angle have gotten smaller, we are getting closer to right angles, that is
      // described as "straighten"
      const tiltChangeString = _.every( differences, difference => difference > 0 ) ? 'tilt' : 'straighten';
      const patternString = 'Opposite sides {{tiltChange}} in parallel as opposite corners change equally.';

      response = StringUtils.fillIn( patternString, {
        tiltChange: tiltChangeString
      } );
    }

    return response;
  }

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

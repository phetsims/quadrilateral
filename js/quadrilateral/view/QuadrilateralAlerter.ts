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

const foundAParallelogramString = quadrilateralStrings.a11y.voicing.foundAParallelogram;
const lostYourParallelogramString = quadrilateralStrings.a11y.voicing.lostYourParallelogram;
const foundAParallelogramWithAllRightAnglesString = quadrilateralStrings.a11y.voicing.foundAParallelogramWithAllRightAngles;
const foundAParallelogramWithAllSidesEqualString = quadrilateralStrings.a11y.voicing.foundAParallelogramWithAllSidesEqual;
const foundParallelogramWithAnglesAndSidesEqualString = quadrilateralStrings.a11y.voicing.foundParallelogramWithAnglesAndSidesEqual;
const allRightAnglesAndSidesEqualString = quadrilateralStrings.a11y.voicing.allRightAnglesAndSidesEqual;
const allSidesEqualString = quadrilateralStrings.a11y.voicing.allSidesEqual;
const allRightAnglesString = quadrilateralStrings.a11y.voicing.allRightAngles;

class QuadrilateralAlerter extends Alerter {

  constructor( model: QuadrilateralModel, screenView: QuadrilateralScreenView ) {
    super();

    const alertResponsePacket = new ResponsePacket();

    const utterance = new Utterance( {
      alert: alertResponsePacket,
      announcerOptions: {
        cancelSelf: false
      }
    } );

    // Depending on what combinations of state the shape enters/loses we use different descriptions. We need
    // to track previous values and compare every time Properties change. We cannot use multilink for this because
    // we need to only update after all deferred Properties of the model have been set.
    let wasParallelogram = model.quadrilateralShapeModel.isParallelogramProperty.value;
    let wereAllLengthsEqual = model.quadrilateralShapeModel.allLengthsEqualProperty.value;
    let wereAllAnglesRight = model.quadrilateralShapeModel.allAnglesRightProperty.value;

    model.quadrilateralShapeModel.shapeChangedEmitter.addListener( () => {
      const parallelogram = model.quadrilateralShapeModel.isParallelogramProperty.value;
      const allLengthsEqual = model.quadrilateralShapeModel.allLengthsEqualProperty.value;
      const allAnglesRight = model.quadrilateralShapeModel.allAnglesRightProperty.value;

      // no alerts while resetting - necessary because calculations for parallel state happen in step and
      let contextResponse: string | null = null;

      if ( parallelogram !== wasParallelogram ) {
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
        const becameAllLengthsEqual = allLengthsEqual && allLengthsEqual !== wereAllLengthsEqual;
        const becameAllRightAngles = allAnglesRight && allAnglesRight !== wereAllAnglesRight;

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

      if ( contextResponse ) {
        alertResponsePacket.contextResponse = contextResponse!;
        this.alert( utterance );
      }

      // update values for comparison next time
      wasParallelogram = parallelogram;
      wereAllLengthsEqual = allLengthsEqual;
      wereAllAnglesRight = allAnglesRight;
    } );

    // So that this content respects voicingVisible.
    Voicing.registerUtteranceToNode( utterance, screenView );
  }
}

quadrilateral.register( 'QuadrilateralAlerter', QuadrilateralAlerter );
export default QuadrilateralAlerter;

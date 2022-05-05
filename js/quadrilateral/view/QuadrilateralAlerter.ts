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

class QuadrilateralAlerter extends Alerter {

  constructor( model: QuadrilateralModel, screenView: QuadrilateralScreenView ) {
    super();

    const alertResponsePacket = new ResponsePacket();

    const utterance = new Utterance( {
      alert: alertResponsePacket
    } );

    // Announce as a context response when we become or leave parallelogram state
    model.quadrilateralShapeModel.isParallelogramProperty.lazyLink( value => {
      if ( model.resetNotInProgressProperty.value ) {
        alertResponsePacket.contextResponse = value ? foundAParallelogramString : lostYourParallelogramString;
        this.alert( utterance );
      }
    } );

    // So that this content respects voicingVisible.
    Voicing.registerUtteranceToNode( utterance, screenView );
  }
}

quadrilateral.register( 'QuadrilateralAlerter', QuadrilateralAlerter );
export default QuadrilateralAlerter;

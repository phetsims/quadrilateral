// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import ShapeSnapshot from '../model/ShapeSnapshot.js';
import QuadrilateralDescriber from './QuadrilateralDescriber.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import ResponsePacket from '../../../../utterance-queue/js/ResponsePacket.js';
import Alerter from '../../../../scenery-phet/js/accessibility/describers/Alerter.js';

class QuadrilateralAlerter extends Alerter {
  private readonly quadrilateralDescriber;
  private shapeSnapshot: ShapeSnapshot;
  private readonly model: QuadrilateralModel;
  private utterance: Utterance;
  private parallelogramChangeUtterance: Utterance;

  constructor( model: QuadrilateralModel, quadrilateralDescriber: QuadrilateralDescriber ) {
    super();

    this.quadrilateralDescriber = quadrilateralDescriber;
    this.model = model;

    this.shapeSnapshot = new ShapeSnapshot( model );

    this.utterance = new Utterance( {
      alert: new ResponsePacket(),
      alertStableDelay: 1000
    } );

    this.parallelogramChangeUtterance = new Utterance( {
      alert: new ResponsePacket(),
      announcerOptions: {
        priority: 2
      }
    } );
  }

  public step( dt: number ): void {
    const nextSnapshot = new ShapeSnapshot( this.model );

    const rightTiltDifference = nextSnapshot.rightSideTilt - this.shapeSnapshot.rightSideTilt;
    const bottomTiltDifference = nextSnapshot.bottomSideTilt - this.shapeSnapshot.bottomSideTilt;
    const leftTiltDifference = nextSnapshot.leftSideTilt - this.shapeSnapshot.leftSideTilt;
    const topTiltDifference = nextSnapshot.topSideTilt - this.shapeSnapshot.topSideTilt;

    const differences = [
      rightTiltDifference,
      bottomTiltDifference,
      leftTiltDifference,
      topTiltDifference
    ];

    let changedSideCount = 0;
    differences.forEach( difference => {
      changedSideCount = Math.abs( difference ) > this.quadrilateralDescriber.tiltDifferenceToleranceInterval ? ( changedSideCount + 1 ) : changedSideCount;
    } );

    // at least one of the tilts have changed sufficiently to describe a change in shape OR we have just shifted
    // into parallelogram.
    if ( changedSideCount > 0 || nextSnapshot.isParallelogram !== this.shapeSnapshot.isParallelogram ) {

      // If the state of parallelogram changed, alert that with higher priority so that it is always heard and never
      // interrupted.
      const utterance = nextSnapshot.isParallelogram === this.shapeSnapshot.isParallelogram ? this.utterance : this.parallelogramChangeUtterance;

      // TODO (TypeScript): Why is this necessary? Docs indicate that it can be a ResponsePacket.
      const alert = utterance.alert as ResponsePacket;

      const tiltDescription = this.quadrilateralDescriber.getTiltChangeDescription( nextSnapshot, this.shapeSnapshot );
      alert.objectResponse = tiltDescription;

      const parallelogramDescription = this.quadrilateralDescriber.getParallelogramDescription( nextSnapshot, this.shapeSnapshot );
      alert.contextResponse = parallelogramDescription;
      console.log( alert.contextResponse );

      this.alert( utterance );

      // only save the next snapshot if we have generated a description, further descriptions will be described
      // relative to this shape
      this.shapeSnapshot = nextSnapshot;

    }
  }
}

quadrilateral.register( 'QuadrilateralAlerter', QuadrilateralAlerter );
export default QuadrilateralAlerter;

// Copyright 2021-2022, University of Colorado Boulder

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
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';

const ALERT_INTERVAL = 1; // in seconds

class QuadrilateralAlerter extends Alerter {
  private readonly quadrilateralDescriber;
  private shapeSnapshot: ShapeSnapshot;
  private readonly model: QuadrilateralModel;
  private utterance: Utterance;
  private parallelogramChangeUtterance: Utterance;
  private alertDirty: boolean;
  private timeSinceLastAlert: number;

  constructor( model: QuadrilateralModel, quadrilateralDescriber: QuadrilateralDescriber ) {
    super();

    this.alertDirty = false;
    this.timeSinceLastAlert = 0;

    this.quadrilateralDescriber = quadrilateralDescriber;
    this.model = model;

    this.shapeSnapshot = new ShapeSnapshot( model.quadrilateralShapeModel );

    this.utterance = new Utterance( {
      alert: new ResponsePacket(),
      alertStableDelay: 500
    } );

    this.parallelogramChangeUtterance = new Utterance( {
      alert: new ResponsePacket(),
      announcerOptions: {
        priority: Utterance.MEDIUM_PRIORITY
      }
    } );

    // If we ever change from being in parallelogram to not in parallelogram, we want to describe that change
    model.quadrilateralShapeModel.isParallelogramProperty.link( () => {
      this.setAlertDirtyOutsideOfReset();
    } );

    model.quadrilateralShapeModel.shapeChangedEmitter.addListener( () => {
      if ( QuadrilateralQueryParameters.deviceConnection ) {

        // When connected to a device, we ONLY want to describe if there is enough movement of the device,
        // the device could send changing values rapidly without any noticable difference and we want to filter
        // this out
        if ( this.vertexPositionsIndicateDirty( new ShapeSnapshot( this.model.quadrilateralShapeModel ) ) ) {
          this.setAlertDirtyOutsideOfReset();
        }
      }
      else {
        this.setAlertDirtyOutsideOfReset();
      }
    } );
  }

  /**
   * Set the alertDirty flag so that we generate a description next frame. We only want to do this if
   * we are not in the middle of a reset. When resetting, we should only hear the generic reset alert
   * and we don't want to describe the change from reset next frame.
   */
  private setAlertDirtyOutsideOfReset(): void {
    if ( this.model.resetNotInProgressProperty.value ) {
      this.alertDirty = true;
    }
  }

  public step( dt: number ): void {

    // Only increment the time since last alert if we are waiting to describe some change so that
    // we dont immediately alert a change if it is been a while since the last time the quadrilateral
    // was manipulated.
    if ( this.alertDirty ) {
      this.timeSinceLastAlert += dt;
    }

    const nextSnapshot = new ShapeSnapshot( this.model.quadrilateralShapeModel );

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
    if ( this.alertDirty && this.timeSinceLastAlert > ALERT_INTERVAL ) {

      // If the state of parallelogram changed, alert that with higher priority so that it is always heard and never
      // interrupted.
      const utterance = nextSnapshot.isParallelogram === this.shapeSnapshot.isParallelogram ? this.utterance : this.parallelogramChangeUtterance;

      // TODO (TypeScript): Why is this necessary? Docs indicate that it can be a ResponsePacket.
      const alert = utterance.alert as unknown as ResponsePacket;

      const sidesWithChangedLengths = this.quadrilateralDescriber.getChangedLengthSidesFromSnapshots( nextSnapshot, this.shapeSnapshot );

      // If none of the sides have tilted and opposite sides are changing in length have changed, then we are
      // expanding/contracting a rectangle, which is what getLengthChangeDescription is designed to describe.
      const oppositeSidesChangingLength = ( sidesWithChangedLengths.includes( this.model.quadrilateralShapeModel.leftSide ) && sidesWithChangedLengths.includes( this.model.quadrilateralShapeModel.rightSide ) ) ||
                                          ( sidesWithChangedLengths.includes( this.model.quadrilateralShapeModel.topSide ) && sidesWithChangedLengths.includes( this.model.quadrilateralShapeModel.bottomSide ) );
      if ( changedSideCount === 0 && oppositeSidesChangingLength ) {
        const lengthChangeDescription = this.quadrilateralDescriber.getLengthChangeDescription( nextSnapshot, this.shapeSnapshot );
        alert.objectResponse = lengthChangeDescription;
      }
      else {
        const tiltDescription = this.quadrilateralDescriber.getTiltChangeDescription( nextSnapshot, this.shapeSnapshot );
        alert.objectResponse = tiltDescription;
      }

      const parallelogramDescription = this.quadrilateralDescriber.getParallelogramDescription( nextSnapshot, this.shapeSnapshot );
      alert.contextResponse = parallelogramDescription;

      this.alert( utterance );

      // only save the next snapshot if we have generated a description, further descriptions will be described
      // relative to this shape
      this.shapeSnapshot = nextSnapshot;

      this.alertDirty = false;
      this.timeSinceLastAlert = 0;
    }
  }

  private vertexPositionsIndicateDirty( snapshot: ShapeSnapshot ): boolean {

    const vertexADistance = Vector2.getDistanceBetweenVectors( snapshot.vertexAPosition, this.shapeSnapshot.vertexAPosition );
    const vertexBDistance = Vector2.getDistanceBetweenVectors( snapshot.vertexBPosition, this.shapeSnapshot.vertexBPosition );
    const vertexCDistance = Vector2.getDistanceBetweenVectors( snapshot.vertexCPosition, this.shapeSnapshot.vertexCPosition );
    const vertexDDistance = Vector2.getDistanceBetweenVectors( snapshot.vertexDPosition, this.shapeSnapshot.vertexDPosition );

    const distances = [ vertexADistance, vertexBDistance, vertexCDistance, vertexDDistance ];
    return _.some( distances, distance => distance > 0.1 );
  }
}

quadrilateral.register( 'QuadrilateralAlerter', QuadrilateralAlerter );
export default QuadrilateralAlerter;

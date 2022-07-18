// Copyright 2021-2022, University of Colorado Boulder

/**
 * A snapshot of the model Properties at a point in time needed to compare against other states to watch
 * how the model is changing over time.
 *
 * TODO: Can this be deleted? "saved states" for audio features are no longer needed for this sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';

class ShapeSnapshot {
  public readonly topSideTilt: number;
  public readonly rightSideTilt: number;
  public readonly bottomSideTilt: number;
  public readonly leftSideTilt: number;

  public readonly isParallelogram: boolean;
  public readonly sideABsideCDParallel: boolean;
  public readonly sideBCsideDAParallel: boolean;

  public readonly vertexAPosition: Vector2;
  public readonly vertexBPosition: Vector2;
  public readonly vertexCPosition: Vector2;
  public readonly vertexDPosition: Vector2;

  public readonly vertexAAngle: number;
  public readonly vertexBAngle: number;
  public readonly vertexCAngle: number;
  public readonly vertexDAngle: number;

  public readonly topSideLength: number;
  public readonly rightSideLength: number;
  public readonly leftSideLength: number;
  public readonly bottomSideLength: number;
  public readonly area: number;

  public constructor( shapeModel: QuadrilateralShapeModel ) {
    this.topSideTilt = shapeModel.topSide.tiltProperty.value;
    this.rightSideTilt = shapeModel.rightSide.tiltProperty.value;
    this.bottomSideTilt = shapeModel.bottomSide.tiltProperty.value;
    this.leftSideTilt = shapeModel.leftSide.tiltProperty.value;

    this.isParallelogram = shapeModel.isParallelogramProperty.value;
    this.sideABsideCDParallel = shapeModel.sideABSideCDParallelSideChecker.areSidesParallel();
    this.sideBCsideDAParallel = shapeModel.sideBCSideDAParallelSideChecker.areSidesParallel();

    this.vertexAPosition = shapeModel.vertexA.positionProperty.value;
    this.vertexBPosition = shapeModel.vertexB.positionProperty.value;
    this.vertexCPosition = shapeModel.vertexC.positionProperty.value;
    this.vertexDPosition = shapeModel.vertexD.positionProperty.value;

    this.vertexAAngle = shapeModel.vertexA.angleProperty.value!;
    this.vertexBAngle = shapeModel.vertexB.angleProperty.value!;
    this.vertexCAngle = shapeModel.vertexC.angleProperty.value!;
    this.vertexDAngle = shapeModel.vertexD.angleProperty.value!;

    this.topSideLength = shapeModel.topSide.lengthProperty.value;
    this.rightSideLength = shapeModel.rightSide.lengthProperty.value;
    this.bottomSideLength = shapeModel.bottomSide.lengthProperty.value;
    this.leftSideLength = shapeModel.leftSide.lengthProperty.value;

    this.area = shapeModel.areaProperty.value;
  }
}

quadrilateral.register( 'ShapeSnapshot', ShapeSnapshot );
export default ShapeSnapshot;

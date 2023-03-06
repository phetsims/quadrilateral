// Copyright 2023, University of Colorado Boulder

/**
 * A general class that updates the sim from tangible device input. In that way it "controls" the simulation model.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import quadrilateral from '../../../quadrilateral.js';
import QuadrilateralModel from '../../model/QuadrilateralModel.js';
import QuadrilateralShapeModel, { VertexWithProposedPosition } from '../../model/QuadrilateralShapeModel.js';
import QuadrilateralUtils from '../../model/QuadrilateralUtils.js';
import TangibleConnectionModel from '../../model/prototype/TangibleConnectionModel.js';
import LinearFunction from '../../../../../dot/js/LinearFunction.js';

export default class QuadrilateralTangibleController {
  private readonly quadrilateralModel: QuadrilateralModel;

  private readonly shapeModel: QuadrilateralShapeModel;
  private readonly modelBounds: Bounds2;
  private readonly tangibleConnectionModel: TangibleConnectionModel;

  public constructor( quadrilateralModel: QuadrilateralModel ) {
    this.quadrilateralModel = quadrilateralModel;

    this.shapeModel = this.quadrilateralModel.quadrilateralShapeModel;
    this.tangibleConnectionModel = this.quadrilateralModel.tangibleConnectionModel;
    this.modelBounds = this.quadrilateralModel.modelBounds;
  }

  /**
   * Sets the quadrilateral shape QuadrilateralVertex positions to good initial values after calibration.
   *
   * During calibration, we request the largest shape that can possibly be made from the device. So when
   * calibration is finished, the tangible is as large as it can be and QuadrilateralVertex positions are positioned
   * based on full width of the device.
   */
  public finishCalibration(): void {
    const physicalModelBounds = this.tangibleConnectionModel.physicalModelBoundsProperty.value!;
    assert && assert( physicalModelBounds && physicalModelBounds.isValid(),
      'Physical dimensions of device need to be set during calibration' );

    this.setPositionsFromLengthAndAngleData(
      physicalModelBounds.width,
      physicalModelBounds.width,
      physicalModelBounds.width,
      Math.PI / 2,
      Math.PI / 2
    );
  }

  /**
   * Set positions of the Vertices from length and angle data. We get the angles at each vertex and lengths
   * of each side from the hardware. We need to convert that to vertex positions in model space.
   *
   * With angle and length data alone we do not know the orientation or position in space of the shape. So the
   * shape is constructed with the top left vertex (vertexA) and top side (sideAB) anchored  while the rest
   * of the vertices are relatively positioned from the angle and length data. Once the shape is constructed it is
   * translated so that the centroid of the shape is in the center of model space (0, 0). The final result is that only
   * the tilt of the top side remains anchored. Perhaps if a gyroscope is added in the future we may be able to rotate
   * the shape correctly without anchoring the top side.
   */
  public setPositionsFromLengthAndAngleData( topLength: number, rightLength: number, leftLength: number, leftTopAngle: number, rightTopAngle: number ): void {

    // only try to set to sim if values look reasonable - we want to handle this gracefully, the sim shouldn't crash
    // if data isn't right
    const allDataGood = _.every( [
      topLength, rightLength, leftLength, leftTopAngle, rightTopAngle
    ], value => {
      return !isNaN( value ) && value >= 0 && value !== null;
    } );
    if ( !allDataGood ) {
      return;
    }

    const tangibleConnectionModel = this.tangibleConnectionModel;

    // you must calibrate before setting positions from a physical device
    if ( tangibleConnectionModel.physicalModelBoundsProperty.value !== null && !tangibleConnectionModel.isCalibratingProperty.value ) {

      // the physical device lengths can only become half as long as the largest length, so map to the sim model
      // with that constraint as well so that the smallest shape on the physical device doesn't bring vertices
      // all the way to the center of the screen (0, 0).
      const deviceLengthToSimLength = new LinearFunction( 0, tangibleConnectionModel.physicalModelBoundsProperty.value.width, 0, this.modelBounds.width / 3 );

      const mappedTopLength = deviceLengthToSimLength.evaluate( topLength );
      const mappedRightLength = deviceLengthToSimLength.evaluate( rightLength );
      const mappedLeftLength = deviceLengthToSimLength.evaluate( leftLength );

      this.setPositionsFromLengthsAndAngles( mappedTopLength, mappedRightLength, mappedLeftLength, leftTopAngle, rightTopAngle );
    }
  }

  /**
   * Set positions from the length and angle data provided. Useful when working with a tangible device that is
   * providing length and angle data. When reconstructing the shape we start by making the top side parallel
   * with the top of model bounds. The remaining vertices are positioned accordingly. Finally, if there is some
   * rotation to apply (from the experimental marker input), that rotation is applied.
   *
   * @param topLength
   * @param rightLength
   * @param leftLength
   * @param p1Angle - the left top angle (vertexA)
   * @param p2Angle - the right top angle (vertexB)
   */
  public setPositionsFromLengthsAndAngles( topLength: number, rightLength: number, leftLength: number, p1Angle: number, p2Angle: number ): void {
    const shapeModel = this.shapeModel;

    // vertexA and the topLine are anchored, the rest of the shape is relative to this
    const vector1Position = new Vector2( this.modelBounds.minX, this.modelBounds.maxX );
    const vector2Position = new Vector2( vector1Position.x + topLength, vector1Position.y );

    const vector4Offset = new Vector2( Math.cos( -p1Angle ), Math.sin( -p1Angle ) ).timesScalar( leftLength );
    const vector4Position = vector1Position.plus( vector4Offset );

    const vector3Offset = new Vector2( Math.cos( Math.PI + p2Angle ), Math.sin( Math.PI + p2Angle ) ).timesScalar( rightLength );
    const vector3Position = vector2Position.plus( vector3Offset );

    // make sure that the proposed positions are within bounds defined in the simulation model
    const proposedPositions = [ vector1Position, vector2Position, vector3Position, vector4Position ];

    // we have the vertex positions to recreate the shape, but shift them so that the centroid of the quadrilateral is
    // in the center of the model space
    const centroidPosition = QuadrilateralUtils.getCentroidFromPositions( proposedPositions );
    const centroidOffset = centroidPosition.negated();
    const shiftedPositions = _.map( proposedPositions, shapePosition => shapePosition.plus( centroidOffset ) );

    // make sure that all positions are within model bounds
    const constrainedPositions = _.map( shiftedPositions, position => this.modelBounds.closestPointTo( position ) );

    // smooth positions to try to reduce noise
    const smoothedPositions = [
      shapeModel.vertexA.smoothPosition( constrainedPositions[ 0 ]! ),
      shapeModel.vertexB.smoothPosition( constrainedPositions[ 1 ]! ),
      shapeModel.vertexC.smoothPosition( constrainedPositions[ 2 ]! ),
      shapeModel.vertexD.smoothPosition( constrainedPositions[ 3 ]! )
    ];

    // Constrain to intervals of deviceGridSpacingProperty.value to try to reduce noise
    const constrainedGridPositions = _.map( smoothedPositions, smoothedPosition => this.quadrilateralModel.getClosestGridPosition( smoothedPosition ) );

    const verticesWithProposedPositions = [
      { vertex: shapeModel.vertexA, proposedPosition: constrainedGridPositions[ 0 ]! },
      { vertex: shapeModel.vertexB, proposedPosition: constrainedGridPositions[ 1 ]! },
      { vertex: shapeModel.vertexC, proposedPosition: constrainedGridPositions[ 2 ]! },
      { vertex: shapeModel.vertexD, proposedPosition: constrainedGridPositions[ 3 ]! }
    ];

    this.shapeModel.setVertexPositions( verticesWithProposedPositions );
  }

  /**
   * Set the positions of vertices directly from a tangible device. A connection to a physical device might use this
   * function to set the positions in model space. If it doesn't have absolute positioning it may need to use
   * setPositionsFromLengthAndAngleData instead.
   *
   * Currently this is being used by the OpenCV prototype and a prototype using MediaPipe.
   */
  public setPositionsFromAbsolutePositionData( proposedPositions: VertexWithProposedPosition[] ): void {
    const tangibleConnectionModel = this.tangibleConnectionModel;

    // you must calibrate before setting positions from a physical device
    if ( tangibleConnectionModel.physicalToModelTransform !== null && !tangibleConnectionModel.isCalibratingProperty.value ) {

      // scale the physical positions to the simulation virtual model
      const scaledProposedPositions: VertexWithProposedPosition[] = proposedPositions.map( vertexWithProposedPosition => {
        const proposedPosition = vertexWithProposedPosition.proposedPosition;

        let constrainedPosition: Vector2;

        // only try to set a new position if values look reasonable - we want to handle this gracefully, the sim
        // shouldn't crash if data isn't right
        if ( proposedPosition && proposedPosition.isFinite() ) {

          // transform from tangible to virtual coordinates
          const virtualPosition = tangibleConnectionModel.physicalToModelTransform.modelToViewPosition( proposedPosition );

          // apply smoothing over a number of values to reduce noise
          constrainedPosition = vertexWithProposedPosition.vertex.smoothPosition( virtualPosition );

          // constrain within model bounds
          constrainedPosition = this.modelBounds.closestPointTo( constrainedPosition );
        }
        else {

          // If the value is not reasonable, just fall back to the current position
          constrainedPosition = vertexWithProposedPosition.vertex.positionProperty.value;
        }

        // align with model grid positions
        constrainedPosition = this.quadrilateralModel.getClosestGridPosition( constrainedPosition! );

        return {
          vertex: vertexWithProposedPosition.vertex,
          proposedPosition: constrainedPosition
        };
      } );

      // Only set to the model if the shape is allowed and reasonable (no overlaps, no intersections)
      if ( tangibleConnectionModel.isShapeAllowedForTangible( scaledProposedPositions ) ) {
        this.shapeModel.setVertexPositions( scaledProposedPositions );
      }
    }
  }
}


quadrilateral.register( 'QuadrilateralTangibleController', QuadrilateralTangibleController );

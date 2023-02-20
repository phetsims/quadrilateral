// Copyright 2021-2023, University of Colorado Boulder

/**
 * A snapshot of the model Properties at a point in time needed to compare against other states to watch
 * how the model is changing over time.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';
import SideLabel from './SideLabel.js';
import VertexLabel from './VertexLabel.js';
import NamedQuadrilateral from './NamedQuadrilateral.js';

class ShapeSnapshot {
  public readonly sideABTilt: number;
  public readonly sideBCTilt: number;
  public readonly sideCDTilt: number;
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

  // TODO: Rename to letter names
  public readonly sideABLength: number;
  public readonly sideBCLength: number;
  public readonly leftSideLength: number;
  public readonly sideCDLength: number;
  public readonly area: number;

  public readonly namedQuadrilateral: NamedQuadrilateral;

  private readonly sideLengths: number[];

  private readonly shapeModel: QuadrilateralShapeModel;

  public constructor( shapeModel: QuadrilateralShapeModel ) {
    this.sideABTilt = shapeModel.sideAB.tiltProperty.value;
    this.sideBCTilt = shapeModel.sideBC.tiltProperty.value;
    this.sideCDTilt = shapeModel.sideCD.tiltProperty.value;
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

    this.sideABLength = shapeModel.sideAB.lengthProperty.value;
    this.sideBCLength = shapeModel.sideBC.lengthProperty.value;
    this.sideCDLength = shapeModel.sideCD.lengthProperty.value;
    this.leftSideLength = shapeModel.leftSide.lengthProperty.value;

    this.area = shapeModel.areaProperty.value;

    this.namedQuadrilateral = shapeModel.shapeNameProperty.value;

    this.sideLengths = [
      this.sideABLength,
      this.sideBCLength,
      this.leftSideLength,
      this.sideCDLength
    ];

    this.shapeModel = shapeModel;
  }

  /**
   * Returns the saved Vertex angle of a particular Vertex given the VertexLabel.
   */
  public getAngleFromVertexLabel( label: VertexLabel ): number {
    return label === VertexLabel.VERTEX_A ? this.vertexAAngle :
           label === VertexLabel.VERTEX_B ? this.vertexBAngle :
           label === VertexLabel.VERTEX_C ? this.vertexCAngle :
           this.vertexDAngle; // VERTEX_D
  }

  public getLengthFromSideLabel( label: SideLabel ): number {
    return label === SideLabel.SIDE_AB ? this.sideABLength :
           label === SideLabel.SIDE_BC ? this.sideBCLength :
           label === SideLabel.SIDE_CD ? this.sideCDLength :
           this.leftSideLength; // SIDE_DA
  }

  /**
   * Returns the saved Vertex position of a particular Vertex given the VertexLabel.
   */
  public getPositionFromVertexLabel( label: VertexLabel ): Vector2 {
    return label === VertexLabel.VERTEX_A ? this.vertexAPosition :
           label === VertexLabel.VERTEX_B ? this.vertexBPosition :
           label === VertexLabel.VERTEX_C ? this.vertexCPosition :
           this.vertexDPosition; // VERTEX_D
  }

  /**
   * Get the distance between two Vertices of this saved snapshot from their VertexLabels.
   */
  public getDistanceBetweenVertices( vertex1Label: VertexLabel, vertex2Label: VertexLabel ): number {
    const p1 = this.getPositionFromVertexLabel( vertex1Label );
    const p2 = this.getPositionFromVertexLabel( vertex2Label );
    return p1.distance( p2 );
  }

  /**
   * Returns the saved vertex positions of a side given the SideLabel. Returns an array with the
   * vertex positions in order like [ side.vertex1, side.vertex2 ].
   */
  public getVertexPositionsFromSideLabel( label: SideLabel ): [ Vector2, Vector2 ] {
    return label === SideLabel.SIDE_AB ? [ this.vertexAPosition, this.vertexBPosition ] :
           label === SideLabel.SIDE_BC ? [ this.vertexBPosition, this.vertexCPosition ] :
           label === SideLabel.SIDE_CD ? [ this.vertexCPosition, this.vertexDPosition ] :
             [ this.vertexDPosition, this.vertexAPosition ]; // SIDE_DA
  }

  /**
   * Returns the saved side lengths of adjacent sides for side defined by the SideLabel. Returns
   * an array of adjacent side lengths in order moving clockwise like this:
   *                sideLabel
   *               ----------
   *              |         |
   * adjacentSide1|         |adjacentSide2
   *              |         |
   *              |         |
   *
   * @returns [adjacentSide1.lengthProperty.value, adjacentSide2.lengthProperty.value]
   */
  public getAdjacentSideLengthsFromSideLabel( label: SideLabel ): [ number, number ] {
    return label === SideLabel.SIDE_AB ? [ this.leftSideLength, this.sideBCLength ] :
           label === SideLabel.SIDE_BC ? [ this.sideABLength, this.sideCDLength ] :
           label === SideLabel.SIDE_CD ? [ this.sideBCLength, this.leftSideLength ] :
             [ this.sideCDLength, this.sideABLength ]; // SIDE_DA
  }

  public getAdjacentSidesParallelFromSideLabel( label: SideLabel ): boolean {
    return label === SideLabel.SIDE_AB ? this.sideBCsideDAParallel :
           label === SideLabel.SIDE_BC ? this.sideABsideCDParallel :
           label === SideLabel.SIDE_CD ? this.sideBCsideDAParallel :
           this.sideABsideCDParallel; // SIDE_DA
  }

  /**
   * Counts the number of sides that have the same length, returning the largest count. If all are the same,
   * returns 4. Otherwise, three, then two, then zero.
   */
  public countNumberOfEqualSides( toleranceInterval: number ): number {
    let numberOfEqualSides = 0;
    for ( let i = 0; i < this.sideLengths.length; i++ ) {
      const currentLength = this.sideLengths[ i ];

      let numberEqualToCurrentLength = 0;
      for ( let j = 0; j < this.sideLengths.length; j++ ) {
        const nextLength = this.sideLengths[ j ];

        if ( this.shapeModel.isInterLengthEqualToOther( currentLength, nextLength ) ) {
          numberEqualToCurrentLength++;
        }
      }

      if ( numberEqualToCurrentLength > numberOfEqualSides ) {
        numberOfEqualSides = numberEqualToCurrentLength;
      }
    }

    return numberOfEqualSides;
  }
}

quadrilateral.register( 'ShapeSnapshot', ShapeSnapshot );
export default ShapeSnapshot;

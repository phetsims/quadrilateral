// Copyright 2021-2022, University of Colorado Boulder

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

  // TODO: Rename to letter names
  public readonly topSideLength: number;
  public readonly rightSideLength: number;
  public readonly leftSideLength: number;
  public readonly bottomSideLength: number;
  public readonly area: number;

  public readonly namedQuadrilateral: NamedQuadrilateral;

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

    this.namedQuadrilateral = shapeModel.shapeNameProperty.value;
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
    return label === SideLabel.SIDE_AB ? this.topSideLength :
           label === SideLabel.SIDE_BC ? this.rightSideLength :
           label === SideLabel.SIDE_CD ? this.bottomSideLength :
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
    return label === SideLabel.SIDE_AB ? [ this.leftSideLength, this.rightSideLength ] :
           label === SideLabel.SIDE_BC ? [ this.topSideLength, this.bottomSideLength ] :
           label === SideLabel.SIDE_CD ? [ this.rightSideLength, this.leftSideLength ] :
             [ this.bottomSideLength, this.topSideLength ]; // SIDE_DA
  }

  public getAdjacentSidesParallelFromSideLabel( label: SideLabel ): boolean {
    return label === SideLabel.SIDE_AB ? this.sideBCsideDAParallel :
           label === SideLabel.SIDE_BC ? this.sideABsideCDParallel :
           label === SideLabel.SIDE_CD ? this.sideBCsideDAParallel :
           this.sideABsideCDParallel; // SIDE_DA
  }
}

quadrilateral.register( 'ShapeSnapshot', ShapeSnapshot );
export default ShapeSnapshot;

// Copyright 2022, University of Colorado Boulder

/**
 * Responsible for keeping two opposite sides of the quadrilateral and managing a tolerance interval so that we
 * can determine if the two sides are considered parallel with each other.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import SidePair from './SidePair.js';
import Side from './Side.js';
import QuadrilateralShapeModel from './QuadrilateralShapeModel.js';

class ParallelSideChecker {

  // A Property that controls the threshold for equality when determining if the opposite sides are parallel.
  // Without a margin of error it would be extremely difficult to create parallel sides.
  private readonly parallelAngleToleranceIntervalProperty: TReadOnlyProperty<number>;

  public readonly side1: Side;
  public readonly side2: Side;
  public readonly sidePair: SidePair;

  // A Property indicating that the provided sides are parallel, ONLY FOR DEBUGGING. You should go through
  // areSidesParallel() to find if sides are parallel. It is unfortunate that the model does not make
  // this Property publicly observable, but we need to control the order that listeners are called in response
  // to changing vertex positions. See QuadrilateralShapeModel.updateOrderDependentProperties() for more
  // information.
  private readonly isParallelProperty: Property<boolean>;

  /**
   * @param oppositeSidePair - The SidePair with opposite sides that we want to inspect for parallelism
   * @param shapeChangedEmitter - Emitter for when the quadrilateral shape changes in some way.
   * @param fineInputSpacingProperty
   * @param tandem
   */
  public constructor(
    oppositeSidePair: SidePair,
    shapeChangedEmitter: TEmitter,
    fineInputSpacingProperty: TReadOnlyProperty<boolean>,
    tandem: Tandem ) {

    this.sidePair = oppositeSidePair;

    this.side1 = oppositeSidePair.side1;
    this.side2 = oppositeSidePair.side2;

    this.isParallelProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isParallelProperty' ),
      phetioReadOnly: true
    } );

    this.parallelAngleToleranceIntervalProperty = new DerivedProperty( [
      fineInputSpacingProperty
    ], fineInputSpacing => {
      return QuadrilateralShapeModel.getWidenedToleranceInterval( QuadrilateralQueryParameters.parallelAngleToleranceInterval, fineInputSpacing );
    }, {
      tandem: tandem.createTandem( 'parallelAngleToleranceIntervalProperty' ),
      phetioValueType: NumberIO
    } );

    // For debugging only. This Property may become true/false as Vertex positionProperties are set one at a time. But
    // that that is a transient state. Wait until vertex positions are stable in
    // QuadrilateralShapeModel.updateOrderDependentProperties before looking at this Property value. Or use
    // QuadrilateralShapeModel.getIsParallelogram()
    shapeChangedEmitter.addListener( () => {
      this.isParallelProperty.value = this.areSidesParallel();
    } );
  }

  /**
   * Returns true if two angles are close enough to each other that they should be considered equal. They are close
   * enough if they are within the parallelAngleToleranceIntervalProperty.
   */
  public isAngleEqualToOther( angle1: number, angle2: number ): boolean {
    return Utils.equalsEpsilon( angle1, angle2, this.parallelAngleToleranceIntervalProperty.value );
  }

  /**
   * Returns whether the two sides are currently parallel within angleToleranceInterval.
   */
  public areSidesParallel(): boolean {
    assert && assert( this.side1.vertex1.angleProperty.value !== null, 'angles need to be available to determine parallel state' );
    assert && assert( this.side2.vertex2.angleProperty.value !== null, 'angles need to be available to determine parallel state' );

    // Two sides are parallel if the vertices of their connecting sides add up to Math.PI. The quadrilateral is
    // constructed such that the Side that connects these two sides vertex1 of side1 and vertex2 of side2
    //         side1
    // vertex1---------------vertex2
    //    |                   |
    //    |                   |
    //    |                   |
    //    |-------------------|
    // vertex2   side2       vertex1
    return this.isAngleEqualToOther( this.side1.vertex1.angleProperty.value! + this.side2.vertex2.angleProperty.value!, Math.PI );
  }
}

quadrilateral.register( 'ParallelSideChecker', ParallelSideChecker );
export default ParallelSideChecker;

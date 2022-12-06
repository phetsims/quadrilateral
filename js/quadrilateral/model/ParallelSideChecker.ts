// Copyright 2022, University of Colorado Boulder

/**
 * Responsible for keeping two opposite sides of the quadrilateral and managing a tolerance interval so that we
 * can determine if the two sides are considered parallel with each other. The angleToleranceInterval changes
 * depending on the method of input to accomplish the learning goals of this sim. See documentation for
 * parallelAngleToleranceIntervalProperty for more information.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import SidePair from './SidePair.js';
import Side from './Side.js';

class ParallelSideChecker {

  // A Property that controls the threshold for equality when determining if the opposite sides are parallel.
  // Without a margin of error it would be extremely difficult to create parallel sides. The value changes
  // depending on input so that it is easier to maintain a parallelogram when controlling with less fine-grained
  // control (like multitouch). See derivation of Property for more details.
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
   * @param otherOppositeSidePair - The state of interaction with the other sides may determine this checker's tolerance
   * @param shapeChangedEmitter - Emitter for when the quadrilateral shape changes in some way.
   * @param resetNotInProgressProperty - Is the model currently not resetting?
   * @param fineInputSpacingProperty
   * @param tandem
   */
  public constructor(
    oppositeSidePair: SidePair,
    otherOppositeSidePair: SidePair,
    shapeChangedEmitter: TEmitter,
    resetNotInProgressProperty: TProperty<boolean>,
    fineInputSpacingProperty: TReadOnlyProperty<boolean>,
    tandem: Tandem ) {

    this.sidePair = oppositeSidePair;

    this.side1 = oppositeSidePair.side1;
    this.side2 = oppositeSidePair.side2;

    const otherSide1 = otherOppositeSidePair.side1;
    const otherSide2 = otherOppositeSidePair.side2;

    this.isParallelProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isParallelProperty' ),
      phetioReadOnly: true
    } );

    this.parallelAngleToleranceIntervalProperty = new DerivedProperty( [
      this.side1.isPressedProperty,
      this.side2.isPressedProperty,
      otherSide1.isPressedProperty,
      otherSide2.isPressedProperty,
      this.side1.vertex1.isPressedProperty, this.side1.vertex2.isPressedProperty,
      this.side2.vertex1.isPressedProperty, this.side2.vertex2.isPressedProperty,
      resetNotInProgressProperty,
      fineInputSpacingProperty
    ], ( side1Pressed, side2Pressed, otherSide1Pressed, otherSide2Pressed, side1Vertex1Pressed, side1Vertex2Pressed, side2Vertex1Pressed, side2Vertex2Pressed, resetNotInProgress, fineInputSpacing ) => {

      // The default value may be modified by user input and device connection. Otherwise the value is reduced when
      // using "Fine Input Spacing".
      const defaultAngleToleranceInterval = fineInputSpacing ? QuadrilateralQueryParameters.parallelAngleToleranceInterval * QuadrilateralQueryParameters.fineInputSpacingToleranceIntervalScaleFactor :
                                            QuadrilateralQueryParameters.parallelAngleToleranceInterval;

      let toleranceInterval;

      if ( QuadrilateralQueryParameters.deviceConnection ) {
        toleranceInterval = defaultAngleToleranceInterval * QuadrilateralQueryParameters.connectedToleranceIntervalScaleFactor;
      }
      else if ( !resetNotInProgress ) {

        // A reset has just begun, set the tolerance interval back to its initial value on load
        toleranceInterval = defaultAngleToleranceInterval;
      }
      else {

        // Only one vertex is moving, we just released all Vertices/sides or we just changed the "Fine Input Spacing"
        // checkbox. We can afford to be as precise as possible in these cases without widening the tolerance interval
        // Only one vertex is moving, we can afford to be as precise as possible from this form of input, and
        // so we have the smallest tolerance interval.
        toleranceInterval = defaultAngleToleranceInterval;
      }

      return toleranceInterval;
    }, {
      tandem: tandem.createTandem( 'parallelAngleToleranceIntervalProperty' ),
      phetioValueType: NumberIO
    } );

    // Primarily for debugging in the QuadrilateralModelValuePanel. We cannot actually use this Property because
    // we can't determine if sides are parallel until all vertices have been placed. See
    // `updateOrderDependentProperties`.
    shapeChangedEmitter.addListener( () => {
      this.isParallelProperty.value = this.areSidesParallel();
    } );
  }

  /**
   * Returns true if two angles are close enough to each other that they should be considered equal. They are close
   * enough if they are within the parallelAngleToleranceIntervalProperty.
   *
   * NOTE: If we need to detect proximity to "parallelness" the smaller absolute values of difference between
   * angle1 and angle2 would be closer to parallel.
   */
  public isAngleEqualToOther( angle1: number, angle2: number ): boolean {
    return Utils.equalsEpsilon( angle1, angle2, this.parallelAngleToleranceIntervalProperty.value );
  }

  /**
   * Returns a value indicating how close the sides are to parallel. 0 indicates perfectly parallel and larger
   * values (up to Math.PI) indicate farther form parallel.
   */
  public getProximityToParallelValue(): number {
    return Math.abs( this.side1.vertex1.angleProperty.value! + this.side2.vertex2.angleProperty.value! - Math.PI );
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

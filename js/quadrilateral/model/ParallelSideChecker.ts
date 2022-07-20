// Copyright 2022, University of Colorado Boulder

/**
 * Responsible for keeping two opposite sides of the quadrilateral and managing a tolerance interval so that we
 * can determine if the two sides are considered parallel with each other. The angleToleranceInterval changes
 * substantially depending on the method of input to accomplish the learning goals of this sim. See documentation
 * for angleToleranceIntervalProperty for more information.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IEmitter from '../../../../axon/js/IEmitter.js';
import IProperty from '../../../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import { SidePair } from './QuadrilateralShapeModel.js';
import Side from './Side.js';

class ParallelSideChecker {

  // A Property that controls the threshold for equality when determining if the opposite sides are parallel.
  // Without a margin of error it would be extremely difficult to create parallel shapes. The value changes
  // depending on input.
  //
  // Adding a tolerance interval means isParallelProperty will be true when we are not exactly
  // in parallel. This means that angles will NOT remain constant while dragging sides that are currently
  // parallel. They are NOT perfectly parallel (even though we are telling the user that they are) so geometric
  // properties of parallelism do not apply. As such, we make it more or less difficult to remain in parallel
  // depending on what is moving. For example, if dragging a side that is parallel with another, the tolerance
  // interval becomes infinite because it should be impossible for two sides to go out of parallel during this
  // interaction. See the derivation for more specific behaviors.
  private readonly angleToleranceIntervalProperty: IReadOnlyProperty<number>;

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
   * @param tandem
   */
  public constructor( oppositeSidePair: SidePair, otherOppositeSidePair: SidePair, shapeChangedEmitter: IEmitter, resetNotInProgressProperty: IProperty<boolean>, tandem: Tandem ) {

    this.sidePair = oppositeSidePair;

    this.side1 = oppositeSidePair.side1;
    this.side2 = oppositeSidePair.side2;

    const otherSide1 = otherOppositeSidePair.side1;
    const otherSide2 = otherOppositeSidePair.side2;

    this.isParallelProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isParallelProperty' ),
      phetioReadOnly: true
    } );

    this.angleToleranceIntervalProperty = new DerivedProperty( [
      this.side1.isPressedProperty,
      this.side2.isPressedProperty,
      otherSide1.isPressedProperty,
      otherSide2.isPressedProperty,
      this.side1.vertex1.isPressedProperty, this.side1.vertex2.isPressedProperty,
      this.side2.vertex1.isPressedProperty, this.side2.vertex2.isPressedProperty,
      resetNotInProgressProperty
    ], ( side1Pressed, side2Pressed, otherSide1Pressed, otherSide2Pressed, side1Vertex1Pressed, side1Vertex2Pressed, side2Vertex1Pressed, side2Vertex2Pressed, resetNotInProgress ) => {

      const verticesPressedArray = [ side1Vertex1Pressed, side1Vertex2Pressed, side2Vertex1Pressed, side2Vertex2Pressed ];
      const numberOfVerticesPressed = _.countBy( verticesPressedArray ).true;
      const anySelfSidesPressed = side1Pressed || side2Pressed;
      const anyOtherSidesPressed = otherSide1Pressed || otherSide2Pressed;

      let toleranceInterval;

      if ( QuadrilateralQueryParameters.deviceConnection ) {

        // The simulation is connected to device hardware, there is some special behavior to make it harder to
        // leave the important learning goal states, see https://github.com/phetsims/quadrilateral/issues/116. Default
        // angleToleranceInterval is also generally larger.
        if ( this.isParallelProperty.value ) {
          toleranceInterval = QuadrilateralQueryParameters.deviceAngleToleranceInterval * QuadrilateralQueryParameters.toleranceIntervalScaleFactor;
        }
        else {
          toleranceInterval = QuadrilateralQueryParameters.deviceAngleToleranceInterval;
        }
      }
      else if ( !resetNotInProgress ) {

        // A reset has just begun, set the tolerance interval back to its initial value on load
        toleranceInterval = QuadrilateralQueryParameters.angleToleranceInterval;
      }
      else {

        // remaining cases apply to mouse, touch, and keyboard input
        if ( anySelfSidesPressed && this.isParallelProperty.value ) {

          // A side has been picked up while the shape is a parallelogram - it should be impossible for the shape
          // to go "out" of parallelogram in this case because none of the angles should be changing.
          toleranceInterval = Number.POSITIVE_INFINITY;
        }
        else if ( anySelfSidesPressed && !this.isParallelProperty.value ) {

          // A side as been picked up while the shape is NOT a parallelogram - it should be impossible for the
          // shape to become a parallelogram while it is being dragged.
          toleranceInterval = Number.NEGATIVE_INFINITY;
        }
        else if ( anyOtherSidesPressed && !this.isParallelProperty.value ) {

          // The other sides are being pressed and my sides are not currently parallel. While dragging a side we
          // do not want the shape to become a parallelogram within a finite angleToleranceInterval so make sure
          // my sides will never become parallel.
          toleranceInterval = QuadrilateralQueryParameters.angleToleranceInterval;
        }
        else if ( anyOtherSidesPressed && this.isParallelProperty.value ) {

          // The other sides are being pressed and my sides are currently parallel. It is possible in this case
          // that my sides go in/out of parallel while they move, so reduce the tolerance interval to a defined value.
          toleranceInterval = QuadrilateralQueryParameters.angleToleranceInterval;
        }
        else if ( numberOfVerticesPressed >= 2 ) {

          // Two or more vertices pressed at once, increase the tolerance interval by a scale factor so that
          // it is easier to find and remain a parallelogram with this input
          toleranceInterval = QuadrilateralQueryParameters.angleToleranceInterval * QuadrilateralQueryParameters.toleranceIntervalScaleFactor;
        }
        else if ( numberOfVerticesPressed === 1 ) {

          // Only one vertex is moving, we can afford to be as precise as possible from this form of input, and
          // so we have the smallest tolerance interval.
          toleranceInterval = QuadrilateralQueryParameters.angleToleranceInterval;
        }
        else {

          // We are dragging a side while out of parallelogram, or we just released all sides and vertices. Do NOT
          // change the angleToleranceInterval because we don't want the quadrilateral to suddenly appear out of
          // parallelogram at the end of the interaction. The ternary handles initialization.
          toleranceInterval = this.angleToleranceIntervalProperty ? this.angleToleranceIntervalProperty.value : QuadrilateralQueryParameters.angleToleranceInterval;
        }
      }

      return toleranceInterval;
    }, {
      tandem: tandem.createTandem( 'angleToleranceIntervalProperty' ),
      phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
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
   * enough if they are within the angleToleranceIntervalProperty.
   *
   * NOTE: If we need to detect proximity to "parallelness" the smaller absolute values of difference between
   * angle1 and angle2 would be closer to parallel.
   */
  public isAngleEqualToOther( angle1: number, angle2: number ): boolean {
    return Utils.equalsEpsilon( angle1, angle2, this.angleToleranceIntervalProperty.value );
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

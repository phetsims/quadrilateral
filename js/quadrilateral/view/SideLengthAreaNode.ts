// Copyright 2022, University of Colorado Boulder

/**
 * A debugging Node that shows how you would have to drag a side to maintain a success case for staying in parallelogram
 * while dragging without changing side lengths.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import Side from '../model/Side.js';
import { Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import QuadrilateralUtils from '../../common/QuadrilateralUtils.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SideLengthAreaNodeSelfOptions = {
  drawRotation?: number;
};

type SideLengthAreaNodeOptions = SideLengthAreaNodeSelfOptions & NodeOptions;

class SideLengthAreaNode extends Node {
  constructor( shapeModel: QuadrilateralShapeModel, dragSide: Side, oppositeSide: Side, lengthSide: Side, modelViewTransform: ModelViewTransform2, providedOptions?: SideLengthAreaNodeOptions ) {

    const options = optionize<SideLengthAreaNodeOptions, SideLengthAreaNodeSelfOptions, NodeOptions>()( {

      // Additional rotation to apply to the arcs so they generally look as expected
      drawRotation: 0
    }, providedOptions );
    super( options );

    const vertex1Path = new Path( null, {
      stroke: 'black'
    } );
    const vertex2Path = new Path( null, {
      stroke: 'black'
    } );

    this.children = [ vertex1Path, vertex2Path ];

    Property.multilink( [
      shapeModel.lengthsEqualToSavedProperty,
      dragSide.isPressedProperty,
      dragSide.vertex1.isPressedProperty,
      dragSide.vertex2.isPressedProperty
    ], ( equalToSaved: boolean, sidePressed: boolean, vertex1Pressed: boolean, vertex2Pressed: boolean ) => {

      const showArc = ( sidePressed || ( vertex1Pressed && vertex2Pressed ) ) && shapeModel.isParallelogramProperty.value;

      // The lengths changed and are no longer equal to the saved set. Redraw shapes and make this clear. Only
      // display if shape is a parallelogram
      if ( ( !equalToSaved && shapeModel.isParallelogramProperty.value ) || showArc ) {
        const length = lengthSide.lengthProperty.value;
        const vertex1Shape = new Shape().arcPoint( oppositeSide.vertex1.positionProperty.value, length, options.drawRotation, Math.PI + options.drawRotation, false );
        const vertex2Shape = new Shape().arcPoint( oppositeSide.vertex2.positionProperty.value, length, options.drawRotation, Math.PI + options.drawRotation, false );

        vertex1Path.shape = modelViewTransform.modelToViewShape( vertex1Shape );
        vertex2Path.shape = modelViewTransform.modelToViewShape( vertex2Shape );

        // multiply by two because the tolerance interval is allowable different in only one dimension (arc is two)
        const lineWidth = modelViewTransform.modelToViewDeltaX( shapeModel.getLargestLengthToleranceInterval() ) * 2;
        vertex1Path.lineWidth = lineWidth;
        vertex2Path.lineWidth = lineWidth;

        const nextColor = QuadrilateralUtils.getRandomColor();
        vertex1Path.stroke = nextColor;
        vertex2Path.stroke = nextColor;
      }

      // only show wile dragging and we are a parallelogram
      this.visible = showArc;
    } );
  }
}

quadrilateral.register( 'SideLengthAreaNode', SideLengthAreaNode );
export default SideLengthAreaNode;

// Copyright 2022, University of Colorado Boulder

/**
 * Draws a Node that intends to let the user know that the quadrilateral shape is interactive.
 * Surrounds each vertex with dashed lines and draws arrows pointing at the sides.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Path } from '../../../../scenery/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import Side from '../model/Side.js';
import { Line, Shape } from '../../../../kite/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import Emitter from '../../../../axon/js/Emitter.js';

const PATH_OPTIONS = {
  stroke: QuadrilateralColors.interactionCueColorProperty,
  lineDash: [ 8, 2 ],
  lineWidth: 2
};

class QuadrilateralInteractionCueNode extends Path {
  public constructor( quadrilateralShapeModel: QuadrilateralShapeModel, resetEmitter: Emitter, modelViewTransform: ModelViewTransform2 ) {
    const nodeShape = new Shape();

    // vertices
    quadrilateralShapeModel.vertices.forEach( vertex => {
      const viewBounds = modelViewTransform.modelToViewBounds( vertex.modelBoundsProperty.value ).dilate( QuadrilateralConstants.POINTER_AREA_DILATION );
      nodeShape.circle( viewBounds.centerX, viewBounds.centerY, viewBounds.width / 2 );

      // so that you don't have to include the start point for the circles
      nodeShape.newSubpath();
    } );

    // sides
    const indicatorViewWidth = modelViewTransform.modelToViewDeltaX( Side.SIDE_WIDTH * 1.5 );
    quadrilateralShapeModel.sides.forEach( side => {

      // model coordinates
      const midLine = new Line( side.vertex1.positionProperty.value, side.vertex2.positionProperty.value );

      // view coordinates
      const tipViewPoint = modelViewTransform.modelToViewPosition( midLine.positionAt( 0.2 ) );
      const tailViewPoint = modelViewTransform.modelToViewPosition( midLine.positionAt( 0.8 ) );
      const reducedMidLine = new Line( tipViewPoint, tailViewPoint );

      const leftStroke = reducedMidLine.strokeLeft( indicatorViewWidth )[ 0 ];
      const rightStroke = reducedMidLine.strokeRight( indicatorViewWidth )[ 0 ];

      // create a rectangle from the strokes along the midLine
      nodeShape.moveToPoint( leftStroke.start );
      nodeShape.lineToPoint( leftStroke.end );
      nodeShape.lineToPoint( rightStroke.start );
      nodeShape.lineToPoint( rightStroke.end );
      nodeShape.close();
    } );

    super( nodeShape, PATH_OPTIONS );

    // any interaction makes this content disappear (until reset)
    quadrilateralShapeModel.vertices.forEach( vertex => {
      vertex.isPressedProperty.lazyLink( () => this.setVisible( false ) );
    } );

    quadrilateralShapeModel.sides.forEach( side => {
      side.isPressedProperty.lazyLink( () => this.setVisible( false ) );
    } );

    resetEmitter.addListener( () => this.setVisible( true ) );
  }
}

quadrilateral.register( 'QuadrilateralInteractionCueNode', QuadrilateralInteractionCueNode );
export default QuadrilateralInteractionCueNode;

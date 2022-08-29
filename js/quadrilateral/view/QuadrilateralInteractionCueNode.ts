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
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import Side from '../model/Side.js';
import { Line, Shape } from '../../../../kite/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import Emitter from '../../../../axon/js/Emitter.js';

// These are in MODEL coordinates to control the length of the arrow guides
const ARROW_DISTANCE_FROM_CENTER = 0.32;
const ARROW_LENGTH = 0.2;

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
      nodeShape.rect( viewBounds.x, viewBounds.y, viewBounds.width, viewBounds.height );
    } );

    // sides
    const tailWidth = modelViewTransform.modelToViewDeltaX( Side.SIDE_WIDTH );
    quadrilateralShapeModel.sides.forEach( side => {
      const midPoint = side.getMidpoint();
      const midLine = new Line( midPoint, side.vertex2.positionProperty.value );
      const tipPoint = midLine.startTangent.perpendicular.times( ARROW_DISTANCE_FROM_CENTER );
      const tailPoint = midLine.startTangent.perpendicular.times( ARROW_DISTANCE_FROM_CENTER + ARROW_LENGTH );

      const viewTipPoint = modelViewTransform.modelToViewPosition( tipPoint );
      const viewTailPoint = modelViewTransform.modelToViewPosition( tailPoint );

      const arrowPoints = ArrowShape.getArrowShapePoints( viewTailPoint.x, viewTailPoint.y, viewTipPoint.x, viewTipPoint.y, [], {
        tailWidth: tailWidth,
        headWidth: tailWidth * 2,
        headHeight: tailWidth
      } );
      nodeShape.polygon( arrowPoints );
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

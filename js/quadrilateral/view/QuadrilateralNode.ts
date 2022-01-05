// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import SideNode from './SideNode.js';
import VertexNode from './VertexNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';

// constants
const vertex1String = quadrilateralStrings.a11y.voicing.vertex1;
const vertex2String = quadrilateralStrings.a11y.voicing.vertex2;
const vertex3String = quadrilateralStrings.a11y.voicing.vertex3;
const vertex4String = quadrilateralStrings.a11y.voicing.vertex4;
const topSideString = quadrilateralStrings.a11y.voicing.topSide;
const rightSideString = quadrilateralStrings.a11y.voicing.rightSide;
const bottomSideString = quadrilateralStrings.a11y.voicing.bottomSide;
const leftSideString = quadrilateralStrings.a11y.voicing.leftSide;

class QuadrilateralNode extends Node {
  private readonly model: QuadrilateralModel;
  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;
  private readonly modelViewTransform: ModelViewTransform2

  public constructor( quadrilateralModel: QuadrilateralModel, modelViewTransform: ModelViewTransform2, layoutBounds: Bounds2, options?: any ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    this.model = quadrilateralModel;
    this.quadrilateralShapeModel = this.model.quadrilateralShapeModel;
    this.modelViewTransform = modelViewTransform;

    const vertexNode1 = new VertexNode( this.quadrilateralShapeModel.vertex1, this.quadrilateralShapeModel, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex1String,

      // phet-io
      tandem: options.tandem.createTandem( 'vertex1Node' )
    } );

    const vertexNode2 = new VertexNode( this.quadrilateralShapeModel.vertex2, this.quadrilateralShapeModel, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex2String,

      // phet-io
      tandem: options.tandem.createTandem( 'vertex2Node' )
    } );

    const vertexNode3 = new VertexNode( this.quadrilateralShapeModel.vertex3, this.quadrilateralShapeModel, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex3String,

      // phet-io
      tandem: options.tandem.createTandem( 'vertex3Node' )
    } );

    const vertexNode4 = new VertexNode( this.quadrilateralShapeModel.vertex4, this.quadrilateralShapeModel, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex4String,

      // phet-io
      tandem: options.tandem.createTandem( 'vertex4Node' )
    } );

    const topSideNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.topSide, this.model.quadrilateralTestShapeModel.topSide, modelViewTransform, {

      // voicing
      voicingNameResponse: topSideString
    } );
    const rightSideNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.rightSide, this.model.quadrilateralTestShapeModel.rightSide, modelViewTransform, {

      // voicing
      voicingNameResponse: rightSideString
    } );
    const bottomSideNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.bottomSide, this.model.quadrilateralTestShapeModel.bottomSide, modelViewTransform, {

      // voicing
      voicingNameResponse: bottomSideString
    } );
    const leftSideNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.leftSide, this.model.quadrilateralTestShapeModel.leftSide, modelViewTransform, {

      // voicing
      voicingNameResponse: leftSideString
    } );

    // add children - sides first because we want vertices to catch all input
    this.addChild( topSideNode );
    this.addChild( rightSideNode );
    this.addChild( bottomSideNode );
    this.addChild( leftSideNode );

    this.addChild( vertexNode1 );
    this.addChild( vertexNode2 );
    this.addChild( vertexNode3 );
    this.addChild( vertexNode4 );

    // @ts-ignore - TODO: How do we do mixin/trait?
    this.pdomOrder = [
      vertexNode1, vertexNode2, vertexNode3, vertexNode4,
      topSideNode, rightSideNode, bottomSideNode, leftSideNode
    ];
  }

  /**
   * When the layout bounds change, update the available drag bounds for each vertex.
   */
  public layout( layoutBounds: Bounds2 ): void {
    // this.model.vertex1.dragBoundsProperty.value = new Bounds2(
    //   this.modelViewTransform.viewToModelX( layoutBounds.minX ), 0.05,
    //   -0.05, this.modelViewTransform.viewToModelY( layoutBounds.minY )
    // );
    //
    // this.model.vertex2.dragBoundsProperty.value = new Bounds2(
    //   0.05, 0.05,
    //   this.modelViewTransform.viewToModelX( layoutBounds.maxX ), this.modelViewTransform.viewToModelY( layoutBounds.minY )
    // );
    //
    // this.model.vertex3.dragBoundsProperty.value = new Bounds2(
    //   0.05, this.modelViewTransform.viewToModelY( layoutBounds.maxY ),
    //   this.modelViewTransform.viewToModelX( layoutBounds.maxX ), -0.05
    // );
    //
    // this.model.vertex4.dragBoundsProperty.value = new Bounds2(
    //   this.modelViewTransform.viewToModelX( layoutBounds.minX ), this.modelViewTransform.viewToModelY( layoutBounds.maxY ),
    //   -0.05, -0.05
    // );

    // For now, the bounds can be anything, until we we have https://github.com/phetsims/quadrilateral/issues/15 done
    this.quadrilateralShapeModel.vertex1.dragBoundsProperty.value = Bounds2.EVERYTHING;
    this.quadrilateralShapeModel.vertex2.dragBoundsProperty.value = Bounds2.EVERYTHING;
    this.quadrilateralShapeModel.vertex3.dragBoundsProperty.value = Bounds2.EVERYTHING;
    this.quadrilateralShapeModel.vertex4.dragBoundsProperty.value = Bounds2.EVERYTHING;
  }
}

quadrilateral.register( 'QuadrilateralNode', QuadrilateralNode );
export default QuadrilateralNode;

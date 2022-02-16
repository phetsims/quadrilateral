// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import SideNode from './SideNode.js';
import VertexNode from './VertexNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import AngleGuideNode from './AngleGuideNode.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';

// constants
const vertex1String = quadrilateralStrings.a11y.voicing.corner1;
const vertex2String = quadrilateralStrings.a11y.voicing.corner2;
const vertex3String = quadrilateralStrings.a11y.voicing.corner3;
const vertex4String = quadrilateralStrings.a11y.voicing.corner4;
const topSideString = quadrilateralStrings.a11y.voicing.topSide;
const rightSideString = quadrilateralStrings.a11y.voicing.rightSide;
const bottomSideString = quadrilateralStrings.a11y.voicing.bottomSide;
const leftSideString = quadrilateralStrings.a11y.voicing.leftSide;

type QuadrilateralNodeSelfOptions = {
  tandem?: Tandem
};

type QuadrilateralNodeOptions = QuadrilateralNodeSelfOptions & NodeOptions;

class QuadrilateralNode extends Node {
  private readonly model: QuadrilateralModel;
  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;
  private readonly scratchShapeModel: QuadrilateralShapeModel;
  private readonly modelViewTransform: ModelViewTransform2

  public constructor( quadrilateralModel: QuadrilateralModel, modelViewTransform: ModelViewTransform2, layoutBounds: Bounds2, providedOptions?: QuadrilateralNodeOptions ) {

    const options = optionize<QuadrilateralNodeOptions, QuadrilateralNodeSelfOptions, NodeOptions>( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    this.model = quadrilateralModel;
    this.quadrilateralShapeModel = this.model.quadrilateralShapeModel;
    this.scratchShapeModel = this.model.quadrilateralTestShapeModel;
    this.modelViewTransform = modelViewTransform;

    const vertexNode1 = new VertexNode( this.quadrilateralShapeModel.vertex1, 'A', quadrilateralModel, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex1String,

      // phet-io
      tandem: options.tandem.createTandem( 'vertex1Node' )
    } );

    const vertexNode2 = new VertexNode( this.quadrilateralShapeModel.vertex2, 'B', quadrilateralModel, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex2String,

      // phet-io
      tandem: options.tandem.createTandem( 'vertex2Node' )
    } );

    const vertexNode3 = new VertexNode( this.quadrilateralShapeModel.vertex3, 'C', quadrilateralModel, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex3String,

      // phet-io
      tandem: options.tandem.createTandem( 'vertex3Node' )
    } );

    const vertexNode4 = new VertexNode( this.quadrilateralShapeModel.vertex4, 'D', quadrilateralModel, modelViewTransform, {

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

    // angle guides, added here so that they can be layered on top of everything
    const vertex1AngleGuideNode = new AngleGuideNode( this.model.quadrilateralShapeModel.vertex1, this.model.quadrilateralShapeModel.vertex2, this.model.angleGuideVisibleProperty, modelViewTransform );
    const vertex2AngleGuideNode = new AngleGuideNode( this.model.quadrilateralShapeModel.vertex2, this.model.quadrilateralShapeModel.vertex3, this.model.angleGuideVisibleProperty, modelViewTransform );
    const vertex3AngleGuideNode = new AngleGuideNode( this.model.quadrilateralShapeModel.vertex3, this.model.quadrilateralShapeModel.vertex4, this.model.angleGuideVisibleProperty, modelViewTransform );
    const vertex4AngleGuideNode = new AngleGuideNode( this.model.quadrilateralShapeModel.vertex4, this.model.quadrilateralShapeModel.vertex1, this.model.angleGuideVisibleProperty, modelViewTransform );

    // add children - sides first because we want vertices to catch all input
    this.addChild( topSideNode );
    this.addChild( rightSideNode );
    this.addChild( bottomSideNode );
    this.addChild( leftSideNode );

    // guide nodes should not be occluded by sides
    this.addChild( vertex1AngleGuideNode );
    this.addChild( vertex2AngleGuideNode );
    this.addChild( vertex3AngleGuideNode );
    this.addChild( vertex4AngleGuideNode );

    this.addChild( vertexNode1 );
    this.addChild( vertexNode2 );
    this.addChild( vertexNode3 );
    this.addChild( vertexNode4 );

    // listeners
    // Change colors when we have become a parallelogram
    const vertexNodes = [ vertexNode1, vertexNode2, vertexNode3, vertexNode4 ];
    const sideNodes = [ topSideNode, rightSideNode, bottomSideNode, leftSideNode ];
    this.quadrilateralShapeModel.isParallelogramProperty.link( isParallelogram => {
      const fillProperty = isParallelogram ? QuadrilateralColors.quadrilateralParallelogramShapeColorProperty : QuadrilateralColors.quadrilateralShapeColorProperty;
      vertexNodes.forEach( vertexNode => { vertexNode.fill = fillProperty; } );
      sideNodes.forEach( sideNode => { sideNode.fill = fillProperty; } );
    } );

    this.pdomOrder = [
      vertexNode1, vertexNode2, vertexNode3, vertexNode4,
      topSideNode, rightSideNode, bottomSideNode, leftSideNode
    ];
  }
}

quadrilateral.register( 'QuadrilateralNode', QuadrilateralNode );
export default QuadrilateralNode;

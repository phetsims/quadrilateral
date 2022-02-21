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
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import RightAngleIndicatorNode from './RightAngleIndicatorNode.js';

// constants
const vertexAString = quadrilateralStrings.a11y.voicing.cornerA;
const vertexBString = quadrilateralStrings.a11y.voicing.cornerB;
const vertexCString = quadrilateralStrings.a11y.voicing.cornerC;
const vertexDString = quadrilateralStrings.a11y.voicing.cornerD;
const topSideString = quadrilateralStrings.a11y.voicing.topSide;
const rightSideString = quadrilateralStrings.a11y.voicing.rightSide;
const bottomSideString = quadrilateralStrings.a11y.voicing.bottomSide;
const leftSideString = quadrilateralStrings.a11y.voicing.leftSide;

const EQUAL_SIDES_SEGMENT_LINE_WIDTH = 2;
const DEFAULT_SIDES_SEGMENT_LINE_WIDTH = 1;

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

    // for readability
    const vertexA = this.quadrilateralShapeModel.vertexA;
    const vertexB = this.quadrilateralShapeModel.vertexB;
    const vertexC = this.quadrilateralShapeModel.vertexC;
    const vertexD = this.quadrilateralShapeModel.vertexD;

    const vertexNode1 = new VertexNode( vertexA, 'A', quadrilateralModel, modelViewTransform, {

      // voicing
      voicingNameResponse: vertexAString,

      // phet-io
      tandem: options.tandem.createTandem( 'vertexANode' )
    } );

    const vertexNode2 = new VertexNode( vertexB, 'B', quadrilateralModel, modelViewTransform, {

      // voicing
      voicingNameResponse: vertexBString,

      // phet-io
      tandem: options.tandem.createTandem( 'vertexBNode' )
    } );

    const vertexNode3 = new VertexNode( vertexC, 'C', quadrilateralModel, modelViewTransform, {

      // voicing
      voicingNameResponse: vertexCString,

      // phet-io
      tandem: options.tandem.createTandem( 'vertexCNode' )
    } );

    const vertexNode4 = new VertexNode( vertexD, 'D', quadrilateralModel, modelViewTransform, {

      // voicing
      voicingNameResponse: vertexDString,

      // phet-io
      tandem: options.tandem.createTandem( 'vertexDNode' )
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

    // angle guides
    const vertexAAngleGuideNode = new AngleGuideNode( vertexA, vertexB, this.model.angleGuideVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexBAngleGuideNode = new AngleGuideNode( vertexB, vertexC, this.model.angleGuideVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexCAngleGuideNode = new AngleGuideNode( vertexC, vertexD, this.model.angleGuideVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexDAngleGuideNode = new AngleGuideNode( vertexD, vertexA, this.model.angleGuideVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );

    // right angle indicators, visible when a vertex has a right angle
    const vertexARightAngleIndicator = new RightAngleIndicatorNode( vertexA, vertexB, vertexD, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexBRightAngleIndicator = new RightAngleIndicatorNode( vertexB, vertexC, vertexA, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexCRightAngleIndicator = new RightAngleIndicatorNode( vertexC, vertexD, vertexB, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexDRightAngleIndicator = new RightAngleIndicatorNode( vertexD, vertexA, vertexC, this.model.quadrilateralShapeModel, modelViewTransform );

    // add children - sides first because we want vertices to catch all input
    this.addChild( topSideNode );
    this.addChild( rightSideNode );
    this.addChild( bottomSideNode );
    this.addChild( leftSideNode );

    // guide nodes should not be occluded by sides
    this.addChild( vertexAAngleGuideNode );
    this.addChild( vertexBAngleGuideNode );
    this.addChild( vertexCAngleGuideNode );
    this.addChild( vertexDAngleGuideNode );

    // angle indicators should not be occluded by sides
    this.addChild( vertexARightAngleIndicator );
    this.addChild( vertexBRightAngleIndicator );
    this.addChild( vertexCRightAngleIndicator );
    this.addChild( vertexDRightAngleIndicator );

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

    // Design request - when all side lengths are equal (which will be true when square or rhombus) increase
    // side segment line width
    this.quadrilateralShapeModel.shapeNameProperty.link( shapeName => {
      const lineWidth = ( shapeName === NamedQuadrilateral.SQUARE || shapeName === NamedQuadrilateral.RHOMBUS ) ? EQUAL_SIDES_SEGMENT_LINE_WIDTH : DEFAULT_SIDES_SEGMENT_LINE_WIDTH;
      sideNodes.forEach( sideNode => { sideNode.lineWidth = lineWidth; } );
    } );

    this.pdomOrder = [
      vertexNode1, vertexNode2, vertexNode3, vertexNode4,
      topSideNode, rightSideNode, bottomSideNode, leftSideNode
    ];
  }
}

quadrilateral.register( 'QuadrilateralNode', QuadrilateralNode );
export default QuadrilateralNode;

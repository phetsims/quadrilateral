// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { IPaint, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import SideNode from './SideNode.js';
import VertexNode from './VertexNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import CornerGuideNode from './CornerGuideNode.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import RightAngleIndicatorNode from './RightAngleIndicatorNode.js';
import Multilink from '../../../../axon/js/Multilink.js';

// constants
const cornerAString = quadrilateralStrings.a11y.cornerA;
const cornerBString = quadrilateralStrings.a11y.cornerB;
const cornerCString = quadrilateralStrings.a11y.cornerC;
const cornerDString = quadrilateralStrings.a11y.cornerD;
const topSideString = quadrilateralStrings.a11y.topSide;
const rightSideString = quadrilateralStrings.a11y.rightSide;
const bottomSideString = quadrilateralStrings.a11y.bottomSide;
const leftSideString = quadrilateralStrings.a11y.leftSide;
const vertexAString = quadrilateralStrings.vertexA;
const vertexBString = quadrilateralStrings.vertexB;
const vertexCString = quadrilateralStrings.vertexC;
const vertexDString = quadrilateralStrings.vertexD;

const EQUAL_SIDES_SEGMENT_LINE_WIDTH = 2;
const DEFAULT_SIDES_SEGMENT_LINE_WIDTH = 1;

// in seconds,
const SHAPE_FILL_TIME = 0.35;

type SelfOptions = {
  tandem?: Tandem;
};

type QuadrilateralNodeOptions = SelfOptions & NodeOptions;

class QuadrilateralNode extends Node {
  private readonly model: QuadrilateralModel;
  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;
  private readonly scratchShapeModel: QuadrilateralShapeModel;
  private readonly modelViewTransform: ModelViewTransform2;

  private readonly vertexNodes: VertexNode[];
  private readonly sideNodes: SideNode[];

  private remainingTimeForShapeChangeFill: number;
  private activeFill: IPaint | null;

  public constructor( quadrilateralModel: QuadrilateralModel, modelViewTransform: ModelViewTransform2, layoutBounds: Bounds2, providedOptions?: QuadrilateralNodeOptions ) {

    const options = optionize<QuadrilateralNodeOptions, SelfOptions, NodeOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( options );

    this.remainingTimeForShapeChangeFill = 0;
    this.activeFill = null;

    this.model = quadrilateralModel;
    this.quadrilateralShapeModel = this.model.quadrilateralShapeModel;
    this.scratchShapeModel = this.model.quadrilateralTestShapeModel;
    this.modelViewTransform = modelViewTransform;

    // for readability
    const vertexA = this.quadrilateralShapeModel.vertexA;
    const vertexB = this.quadrilateralShapeModel.vertexB;
    const vertexC = this.quadrilateralShapeModel.vertexC;
    const vertexD = this.quadrilateralShapeModel.vertexD;

    const vertexNode1 = new VertexNode( vertexA, vertexAString, quadrilateralModel, modelViewTransform, {
      nameResponse: cornerAString,

      // phet-io
      tandem: options.tandem.createTandem( 'vertexANode' )
    } );

    const vertexNode2 = new VertexNode( vertexB, vertexBString, quadrilateralModel, modelViewTransform, {
      nameResponse: cornerBString,

      // phet-io
      tandem: options.tandem.createTandem( 'vertexBNode' )
    } );

    const vertexNode3 = new VertexNode( vertexC, vertexCString, quadrilateralModel, modelViewTransform, {
      nameResponse: cornerCString,

      // phet-io
      tandem: options.tandem.createTandem( 'vertexCNode' )
    } );

    const vertexNode4 = new VertexNode( vertexD, vertexDString, quadrilateralModel, modelViewTransform, {
      nameResponse: cornerDString,

      // phet-io
      tandem: options.tandem.createTandem( 'vertexDNode' )
    } );

    const topSideNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.topSide, this.model.quadrilateralTestShapeModel.topSide, modelViewTransform, {
      nameResponse: topSideString
    } );
    const rightSideNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.rightSide, this.model.quadrilateralTestShapeModel.rightSide, modelViewTransform, {
      nameResponse: rightSideString
    } );
    const bottomSideNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.bottomSide, this.model.quadrilateralTestShapeModel.bottomSide, modelViewTransform, {
      nameResponse: bottomSideString
    } );
    const leftSideNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.leftSide, this.model.quadrilateralTestShapeModel.leftSide, modelViewTransform, {
      nameResponse: leftSideString
    } );

    // angle guides
    const vertexACornerGuideNode = new CornerGuideNode( vertexA, vertexB, this.model.cornerGuideVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexBCornerGuideNode = new CornerGuideNode( vertexB, vertexC, this.model.cornerGuideVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexCCornerGuideNode = new CornerGuideNode( vertexC, vertexD, this.model.cornerGuideVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexDCornerGuideNode = new CornerGuideNode( vertexD, vertexA, this.model.cornerGuideVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );

    // right angle indicators, visible when a vertex has a right angle
    const vertexARightAngleIndicator = new RightAngleIndicatorNode( vertexA, vertexB, vertexD, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexBRightAngleIndicator = new RightAngleIndicatorNode( vertexB, vertexC, vertexA, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexCRightAngleIndicator = new RightAngleIndicatorNode( vertexC, vertexD, vertexB, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexDRightAngleIndicator = new RightAngleIndicatorNode( vertexD, vertexA, vertexC, this.model.quadrilateralShapeModel, modelViewTransform );

    // add children - parents support layering order as well as traversal order in the PDOM
    // sides first because we want vertices to catch all input
    const sideParentNode = new ShapeHeadingNode( quadrilateralStrings.a11y.myShapesSides );
    sideParentNode.addChild( topSideNode );
    sideParentNode.addChild( rightSideNode );
    sideParentNode.addChild( bottomSideNode );
    sideParentNode.addChild( leftSideNode );
    this.addChild( sideParentNode );

    // guide nodes should not be occluded by sides
    this.addChild( vertexACornerGuideNode );
    this.addChild( vertexBCornerGuideNode );
    this.addChild( vertexCCornerGuideNode );
    this.addChild( vertexDCornerGuideNode );

    // angle indicators should not be occluded by sides
    this.addChild( vertexARightAngleIndicator );
    this.addChild( vertexBRightAngleIndicator );
    this.addChild( vertexCRightAngleIndicator );
    this.addChild( vertexDRightAngleIndicator );

    const vertexParentNode = new ShapeHeadingNode( quadrilateralStrings.a11y.myShapesCorners );
    vertexParentNode.addChild( vertexNode1 );
    vertexParentNode.addChild( vertexNode2 );
    vertexParentNode.addChild( vertexNode3 );
    vertexParentNode.addChild( vertexNode4 );
    this.addChild( vertexParentNode );


    // listeners
    // Change colors when we have become a parallelogram
    this.vertexNodes = [ vertexNode1, vertexNode2, vertexNode3, vertexNode4 ];
    this.sideNodes = [ topSideNode, rightSideNode, bottomSideNode, leftSideNode ];

    // only if shape identification feedback is enabled, reset the timer so that we change the color for a short
    // period when we become a named shape
    Multilink.multilink( [ this.quadrilateralShapeModel.isParallelogramProperty, this.quadrilateralShapeModel.shapeNameProperty ], ( isParallelogram, shapeName ) => {
      if ( shapeName !== null && quadrilateralModel.shapeIdentificationFeedbackEnabledProperty.value ) {
        this.remainingTimeForShapeChangeFill = SHAPE_FILL_TIME;
      }
    } );

    // Design request - when all side lengths are equal (which will be true when square or rhombus) increase
    // side segment line width
    this.quadrilateralShapeModel.shapeNameProperty.link( shapeName => {
      const lineWidth = ( shapeName === NamedQuadrilateral.SQUARE || shapeName === NamedQuadrilateral.RHOMBUS ) ? EQUAL_SIDES_SEGMENT_LINE_WIDTH : DEFAULT_SIDES_SEGMENT_LINE_WIDTH;
      this.sideNodes.forEach( sideNode => { sideNode.lineWidth = lineWidth; } );
    } );

    this.pdomOrder = [
      vertexParentNode,
      sideParentNode
    ];
  }

  public step( dt: number ): void {
    const previousActiveFill = this.activeFill;
    if ( this.quadrilateralShapeModel.isParallelogramProperty.value ) {
      this.activeFill = QuadrilateralColors.quadrilateralParallelogramShapeColorProperty;
    }
    else if ( this.remainingTimeForShapeChangeFill > 0 ) {

      // Note this will only happen if "shapeIdentificationFeedback" is enabled.
      this.activeFill = QuadrilateralColors.quadrilateralNamedShapeColorProperty;
    }
    else {
      this.activeFill = QuadrilateralColors.quadrilateralShapeColorProperty;
    }

    this.remainingTimeForShapeChangeFill = Math.max( 0, this.remainingTimeForShapeChangeFill - dt );

    if ( previousActiveFill !== this.activeFill ) {
      this.updateFills();
    }
  }

  private updateFills(): void {
    this.vertexNodes.forEach( vertexNode => { vertexNode.fill = this.activeFill; } );
    this.sideNodes.forEach( sideNode => { sideNode.fill = this.activeFill; } );
  }
}

/**
 * A Node with options that define how a section of content describing the Shape should exist in the PDOM.
 * Components of the quadrilateral shape are organized under a few H3s.
 */
class ShapeHeadingNode extends Node {
  public constructor( labelContent: string ) {
    super( {
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: labelContent
    } );
  }
}

quadrilateral.register( 'QuadrilateralNode', QuadrilateralNode );
export default QuadrilateralNode;

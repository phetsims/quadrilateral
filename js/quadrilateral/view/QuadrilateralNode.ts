// Copyright 2021-2023, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { KeyboardListener, Node, NodeOptions, TPaint, Voicing, VoicingOptions } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import SideNode from './SideNode.js';
import VertexNode from './VertexNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import CornerGuideNode from './CornerGuideNode.js';
import QuadrilateralColors from '../../QuadrilateralColors.js';
import RightAngleIndicatorNode from './RightAngleIndicatorNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import QuadrilateralDescriber from './QuadrilateralDescriber.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

// constants
const cornerAString = QuadrilateralStrings.a11y.cornerA;
const cornerBString = QuadrilateralStrings.a11y.cornerB;
const cornerCString = QuadrilateralStrings.a11y.cornerC;
const cornerDString = QuadrilateralStrings.a11y.cornerD;
const sideABString = QuadrilateralStrings.a11y.sideAB;
const rightSideString = QuadrilateralStrings.a11y.rightSide;
const bottomSideString = QuadrilateralStrings.a11y.bottomSide;
const leftSideString = QuadrilateralStrings.a11y.leftSide;
const vertexAString = QuadrilateralStrings.vertexA;
const vertexBString = QuadrilateralStrings.vertexB;
const vertexCString = QuadrilateralStrings.vertexC;
const vertexDString = QuadrilateralStrings.vertexD;

// in seconds,
const SHAPE_FILL_TIME = 0.35;

type SelfOptions = EmptySelfOptions;
type ParentOptions = NodeOptions & VoicingOptions;
type QuadrilateralNodeOptions = SelfOptions & StrictOmit<ParentOptions, 'interactiveHighlight'> & PickRequired<ParentOptions, 'tandem'>;

class QuadrilateralNode extends Voicing( Node ) {
  private readonly model: QuadrilateralModel;
  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;
  private readonly scratchShapeModel: QuadrilateralShapeModel;
  private readonly modelViewTransform: ModelViewTransform2;

  private readonly vertexNodes: VertexNode[];
  private readonly sideNodes: SideNode[];

  private remainingTimeForShapeChangeFill: number;
  private activeFill: TPaint | null;

  public constructor( quadrilateralModel: QuadrilateralModel, modelViewTransform: ModelViewTransform2, layoutBounds: Bounds2, quadrilateralDescriber: QuadrilateralDescriber, providedOptions: QuadrilateralNodeOptions ) {

    const options = optionize<QuadrilateralNodeOptions, SelfOptions, ParentOptions>()( {

      // This Node is composed with Voicing so that we can call the voicingSpeak* functions through it. But we do not
      // want it to use the default InteractiveHighlight, VertexNode/SideNode are independently interactive.
      interactiveHighlight: 'invisible'
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

    const vertexNode1 = new VertexNode( vertexA, vertexAString, quadrilateralModel, quadrilateralDescriber.vertexADescriber, modelViewTransform, {
      nameResponse: cornerAString,

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'vertexANode' )
    } );

    const vertexNode2 = new VertexNode( vertexB, vertexBString, quadrilateralModel, quadrilateralDescriber.vertexBDescriber, modelViewTransform, {
      nameResponse: cornerBString,

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'vertexBNode' )
    } );

    const vertexNode3 = new VertexNode( vertexC, vertexCString, quadrilateralModel, quadrilateralDescriber.vertexCDescriber, modelViewTransform, {
      nameResponse: cornerCString,

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'vertexCNode' )
    } );

    const vertexNode4 = new VertexNode( vertexD, vertexDString, quadrilateralModel, quadrilateralDescriber.vertexDDescriber, modelViewTransform, {
      nameResponse: cornerDString,

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'vertexDNode' )
    } );

    const sideABNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.sideAB, this.model.quadrilateralTestShapeModel.sideAB, quadrilateralDescriber.sideABDescriber, modelViewTransform, {
      nameResponse: sideABString,
      tandem: providedOptions.tandem.createTandem( 'sideABNode' )
    } );
    const rightSideNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.rightSide, this.model.quadrilateralTestShapeModel.rightSide, quadrilateralDescriber.sideBCDescriber, modelViewTransform, {
      nameResponse: rightSideString,
      tandem: providedOptions.tandem.createTandem( 'rightSideNode' )
    } );
    const bottomSideNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.bottomSide, this.model.quadrilateralTestShapeModel.bottomSide, quadrilateralDescriber.sideCDDescriber, modelViewTransform, {
      nameResponse: bottomSideString,
      tandem: providedOptions.tandem.createTandem( 'bottomSideNode' )
    } );
    const leftSideNode = new SideNode( quadrilateralModel, this.model.quadrilateralShapeModel.leftSide, this.model.quadrilateralTestShapeModel.leftSide, quadrilateralDescriber.sideDADescriber, modelViewTransform, {
      nameResponse: leftSideString,
      tandem: providedOptions.tandem.createTandem( 'leftSideNode' )
    } );

    // angle guides
    const markersVisibleProperty = this.model.visibilityModel.markersVisibleProperty;
    const vertexACornerGuideNode = new CornerGuideNode( vertexA, vertexB, markersVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexBCornerGuideNode = new CornerGuideNode( vertexB, vertexC, markersVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexCCornerGuideNode = new CornerGuideNode( vertexC, vertexD, markersVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexDCornerGuideNode = new CornerGuideNode( vertexD, vertexA, markersVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );

    // right angle indicators, visible when a vertex has a right angle
    const vertexARightAngleIndicator = new RightAngleIndicatorNode( vertexA, vertexB, vertexD, markersVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexBRightAngleIndicator = new RightAngleIndicatorNode( vertexB, vertexC, vertexA, markersVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexCRightAngleIndicator = new RightAngleIndicatorNode( vertexC, vertexD, vertexB, markersVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );
    const vertexDRightAngleIndicator = new RightAngleIndicatorNode( vertexD, vertexA, vertexC, markersVisibleProperty, this.model.quadrilateralShapeModel, modelViewTransform );

    // add children - parents support layering order as well as traversal order in the PDOM
    // sides first because we want vertices to catch all input
    const sideParentNode = new ShapeHeadingNode( QuadrilateralStrings.a11y.myShapesSides );
    sideParentNode.addChild( sideABNode );
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

    const vertexParentNode = new ShapeHeadingNode( QuadrilateralStrings.a11y.myShapesCorners );
    vertexParentNode.addChild( vertexNode1 );
    vertexParentNode.addChild( vertexNode2 );
    vertexParentNode.addChild( vertexNode3 );
    vertexParentNode.addChild( vertexNode4 );
    this.addChild( vertexParentNode );

    // listeners - When the shift key is down, Vertices snap to finer intervals
    this.addInputListener( new KeyboardListener( {
      keys: [ 'shift' ],
      listenerFireTrigger: 'both',
      callback: ( event, listener ) => {
        this.model.minorIntervalsFromGlobalKeyProperty.value = listener.keysDown;
      },
      global: true
    } ) );

    // Global key listeners
    this.addInputListener( new KeyboardListener( {
      keys: [ 'alt+shift+r', 'alt+c' ],
      global: true,
      callback: ( event, listener ) => {
        const keysPressed = listener.keysPressed;

        if ( keysPressed === 'alt+c' ) {

          // command to check shape, Voicing the current shape name or its Properties depending on name visibility
          this.voicingUtterance.alert = quadrilateralDescriber.getCheckShapeDescription();
          Voicing.alertUtterance( this.voicingUtterance );
        }
        else if ( keysPressed === 'alt+shift+r' ) {

          // command to reset shape
          this.quadrilateralShapeModel.isolatedReset();
          this.voicingUtterance.alert = QuadrilateralDescriber.RESET_SHAPE_RESPONSE_PACKET;
          Voicing.alertUtterance( this.voicingUtterance );
        }
      },
      cancel: listener => {

        // no longer pressed locking until next press
        this.model.minorIntervalsFromGlobalKeyProperty.value = false;
      }
    } ) );

    this.vertexNodes = [ vertexNode1, vertexNode2, vertexNode3, vertexNode4 ];
    this.sideNodes = [ sideABNode, rightSideNode, bottomSideNode, leftSideNode ];

    // reset the timer so that we change the color for a short period when we become a named shape
    this.quadrilateralShapeModel.shapeNameProperty.link( shapeName => {
      if ( shapeName !== null ) {
        this.remainingTimeForShapeChangeFill = SHAPE_FILL_TIME;
      }
    } );

    // Traversal order for components requested in https://github.com/phetsims/quadrilateral/issues/289.
    this.pdomOrder = [
      vertexNode1,
      sideABNode,
      vertexNode2,
      rightSideNode,
      vertexNode3,
      bottomSideNode,
      vertexNode4,
      leftSideNode
    ];
  }

  public step( dt: number ): void {
    const previousActiveFill = this.activeFill;
    if ( this.remainingTimeForShapeChangeFill > 0 ) {
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

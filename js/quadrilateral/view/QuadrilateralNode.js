// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import voicingUtteranceQueue from '../../../../scenery/js/accessibility/voicing/voicingUtteranceQueue.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quadrilateral from '../../quadrilateral.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import SideNode from './SideNode.js';
import VertexNode from './VertexNode.js';

// constants
const vertex1String = quadrilateralStrings.a11y.voicing.vertex1;
const vertex2String = quadrilateralStrings.a11y.voicing.vertex2;
const vertex3String = quadrilateralStrings.a11y.voicing.vertex3;
const vertex4String = quadrilateralStrings.a11y.voicing.vertex4;
const topSideString = quadrilateralStrings.a11y.voicing.topSide;
const rightSideString = quadrilateralStrings.a11y.voicing.rightSide;
const bottomSideString = quadrilateralStrings.a11y.voicing.bottomSide;
const leftSideString = quadrilateralStrings.a11y.voicing.leftSide;
const parallelogramSuccessString = quadrilateralStrings.a11y.voicing.parallelogramSuccess;
const parallelogramFailureString = quadrilateralStrings.a11y.voicing.parallelogramFailure;

class QuadrilateralNode extends Node {

  /**
   * @param {QuadrilateralModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   */
  constructor( model, modelViewTransform, layoutBounds, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    this.model = model;
    this.modelViewTransform = modelViewTransform;

    const vertexNode1 = new VertexNode( model.vertex1, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex1String,

      // phet-io
      tandem: options.tandem.createTandem( 'vertex1Node' )
    } );

    const vertexNode2 = new VertexNode( model.vertex2, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex2String,

      // phet-io
      tandem: options.tandem.createTandem( 'vertex2Node' )
    } );

    const vertexNode3 = new VertexNode( model.vertex3, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex3String,

      // phet-io
      tandem: options.tandem.createTandem( 'vertex3Node' )
    } );

    const vertexNode4 = new VertexNode( model.vertex4, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex4String,

      // phet-io
      tandem: options.tandem.createTandem( 'vertex4Node' )
    } );

    const topSideNode = new SideNode( model.topSide, modelViewTransform, {

      // voicing
      voicingNameResponse: topSideString
    } );
    const rightSideNode = new SideNode( model.rightSide, modelViewTransform, {

      // voicing
      voicingNameResponse: rightSideString
    } );
    const bottomSideNode = new SideNode( model.bottomSide, modelViewTransform, {

      // voicing
      voicingNameResponse: bottomSideString
    } );
    const leftSideNode = new SideNode( model.leftSide, modelViewTransform, {

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

    this.pdomOrder = [
      vertexNode1, vertexNode2, vertexNode3, vertexNode4,
      topSideNode, rightSideNode, bottomSideNode, leftSideNode
    ];

    // listeners
    model.isParallelogramProperty.lazyLink( isParallelogram => {
      const alertString = isParallelogram ? parallelogramSuccessString : parallelogramFailureString;
      voicingUtteranceQueue.addToBack( alertString );
    } );
  }

  /**
   * When the layout bounds change, update the available drag bounds for each vertex.
   * @public
   * @param {Bounds2} layoutBounds
   */
  layout( layoutBounds ) {
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

    if ( QuadrilateralQueryParameters.calibrationDemoDevice ) {

      // don't allow the device to go out of model bounds
      this.model.vertex1.dragBoundsProperty.value = QuadrilateralModel.MODEL_BOUNDS;
      this.model.vertex2.dragBoundsProperty.value = QuadrilateralModel.MODEL_BOUNDS;
      this.model.vertex3.dragBoundsProperty.value = QuadrilateralModel.MODEL_BOUNDS;
      this.model.vertex4.dragBoundsProperty.value = QuadrilateralModel.MODEL_BOUNDS;
    }
    else {

      // TODO: For this test we are not constraining the vertex positions in the sim because we want to see how
      // move when attached to a physical model without being bound
      this.model.vertex1.dragBoundsProperty.value = Bounds2.EVERYTHING;
      this.model.vertex2.dragBoundsProperty.value = Bounds2.EVERYTHING;
      this.model.vertex3.dragBoundsProperty.value = Bounds2.EVERYTHING;
      this.model.vertex4.dragBoundsProperty.value = Bounds2.EVERYTHING;
    }
  }
}

quadrilateral.register( 'QuadrilateralNode', QuadrilateralNode );
export default QuadrilateralNode;

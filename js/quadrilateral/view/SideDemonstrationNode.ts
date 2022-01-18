// Copyright 2021-2022, University of Colorado Boulder

/**
 * A Node used to test and demonstrate the sound design, allowing one to layer in one side at a time. When all
 * sides are in place it is difficult to hear what is changing. By isolating a single side or pairs at a time
 * it is easier to demonstrate the design, debug, and discuss.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Node } from '../../../../scenery/js/imports.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import QuartetSideSoundView from './QuartetSideSoundView.js';
import SideNode from './SideNode.js';
import VertexNode from './VertexNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';

class SideDemonstrationNode extends Node {
  private readonly rightSideSoundView: QuartetSideSoundView | null;
  private readonly leftSideSoundView: QuartetSideSoundView | null;
  private readonly bottomSideSoundView: QuartetSideSoundView | null;
  private readonly topSideSoundView: QuartetSideSoundView | null;


  constructor( model: QuadrilateralModel, modelViewTransform: ModelViewTransform2, layoutBounds: Bounds2, soundOptionsModel: QuadrilateralSoundOptionsModel, options?: any ) {
    super( options );

    const shapeModel = model.quadrilateralShapeModel;
    const scratchShapeModel = model.quadrilateralTestShapeModel;

    const vertex1Node = new VertexNode( shapeModel.vertex1, model, modelViewTransform );
    const vertex2Node = new VertexNode( shapeModel.vertex2, model, modelViewTransform );
    const vertex3Node = new VertexNode( shapeModel.vertex3, model, modelViewTransform );
    const vertex4Node = new VertexNode( shapeModel.vertex4, model, modelViewTransform );

    // references to SideViews, only created if requested by query parameter
    this.rightSideSoundView = null;
    this.leftSideSoundView = null;
    this.topSideSoundView = null;
    this.bottomSideSoundView = null;

    if ( QuadrilateralQueryParameters.rightSide ) {
      const rightSideNode = new SideNode( model, shapeModel.rightSide, scratchShapeModel.rightSide, modelViewTransform );
      this.addChild( rightSideNode );

      this.rightSideSoundView = new QuartetSideSoundView( shapeModel.rightSide, model.resetNotInProgressProperty, soundOptionsModel.baseSoundFileProperty );
      shapeModel.shapeChangedEmitter.addListener( () => {
        this.rightSideSoundView!.startPlayingSounds();
      } );
    }
    if ( QuadrilateralQueryParameters.leftSide ) {
      const leftSideNode = new SideNode( model, shapeModel.leftSide, scratchShapeModel.leftSide, modelViewTransform );
      this.addChild( leftSideNode );

      // sound
      this.leftSideSoundView = new QuartetSideSoundView( shapeModel.leftSide, model.resetNotInProgressProperty, soundOptionsModel.baseSoundFileProperty );
      shapeModel.shapeChangedEmitter.addListener( () => {
        this.leftSideSoundView!.startPlayingSounds();
      } );
    }
    if ( QuadrilateralQueryParameters.topSide ) {
      const topSideNode = new SideNode( model, shapeModel.topSide, scratchShapeModel.topSide, modelViewTransform );
      this.addChild( topSideNode );

      // sound
      this.topSideSoundView = new QuartetSideSoundView( shapeModel.topSide, model.resetNotInProgressProperty, soundOptionsModel.baseSoundFileProperty );
      shapeModel.shapeChangedEmitter.addListener( () => {
        this.topSideSoundView!.startPlayingSounds();
      } );
    }
    if ( QuadrilateralQueryParameters.bottomSide ) {
      const bottomSideNode = new SideNode( model, shapeModel.bottomSide, scratchShapeModel.bottomSide, modelViewTransform );
      this.addChild( bottomSideNode );

      // sound
      this.bottomSideSoundView = new QuartetSideSoundView( shapeModel.bottomSide, model.resetNotInProgressProperty, soundOptionsModel.baseSoundFileProperty );
      shapeModel.shapeChangedEmitter.addListener( () => {
        this.bottomSideSoundView!.startPlayingSounds();
      } );
    }

    // add vertex children depending on sides requested
    if ( QuadrilateralQueryParameters.leftSide || QuadrilateralQueryParameters.topSide ) {
      this.addChild( vertex1Node );
    }
    if ( QuadrilateralQueryParameters.rightSide || QuadrilateralQueryParameters.topSide ) {
      this.addChild( vertex2Node );
    }
    if ( QuadrilateralQueryParameters.rightSide || QuadrilateralQueryParameters.bottomSide ) {
      this.addChild( vertex3Node );
    }
    if ( QuadrilateralQueryParameters.bottomSide || QuadrilateralQueryParameters.leftSide ) {
      this.addChild( vertex4Node );
    }
  }

  /**
   * Step the sound views.
   *
   * @param dt
   */
  public step( dt: number ) {
    this.rightSideSoundView && this.rightSideSoundView.step( dt );
    this.leftSideSoundView && this.leftSideSoundView.step( dt );
    this.topSideSoundView && this.topSideSoundView.step( dt );
    this.bottomSideSoundView && this.bottomSideSoundView.step( dt );
  }
}

quadrilateral.register( 'SideDemonstrationNode', SideDemonstrationNode );
export default SideDemonstrationNode;

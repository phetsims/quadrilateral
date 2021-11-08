// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import QuadrilateralNode from './QuadrilateralNode.js';
import QuadrilateralSoundView from './QuadrilateralSoundView.js';
import SideDemonstrationNode from './SideDemonstrationNode.js';
import VertexDragAreaNode from './VertexDragAreaNode.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';

class QuadrilateralScreenView extends ScreenView {
  private readonly model: QuadrilateralModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly quadrilateralNode: QuadrilateralNode | null;
  private readonly demonstrationNode: SideDemonstrationNode | null;
  private readonly quadrilateralSoundView: QuadrilateralSoundView | null;

  public constructor( model: QuadrilateralModel, soundOptionsModel: QuadrilateralSoundOptionsModel, tandem: Tandem ) {
    super( {

      // phet-io
      tandem: tandem
    } );

    const viewHeight = this.layoutBounds.height - 2 * QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN;
    const modelViewTransform = ModelViewTransform.createRectangleInvertedYMapping(
      new Bounds2( -1, -1, 1, 1 ),
      new Bounds2(
        this.layoutBounds.centerX - viewHeight / 2,
        QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN,
        this.layoutBounds.centerX + viewHeight / 2,
        viewHeight
      )
    );

    this.model = model;
    this.modelViewTransform = modelViewTransform;

    // A reference to the QuadrilateralNode. For now, it is not always created while we have the side query parameters
    // for development. But we may want
    this.quadrilateralNode = null;

    // A reference to the SideDemonstrationNode, which will be created if we are using debugging query parameters.
    this.demonstrationNode = null;

    // A reference to the QuadriladteralSoundView, created if we are NOT using debugging query parameters. When the
    // "demonstration" Node is no longer useful this can be created eagerly.
    this.quadrilateralSoundView = null;

    if ( QuadrilateralQueryParameters.rightSide || QuadrilateralQueryParameters.leftSide ||
         QuadrilateralQueryParameters.topSide || QuadrilateralQueryParameters.bottomSide ) {
      this.demonstrationNode = new SideDemonstrationNode( model, modelViewTransform, this.layoutBounds, soundOptionsModel );
      this.addChild( this.demonstrationNode );
    }
    else {
      this.quadrilateralNode = new QuadrilateralNode( model, modelViewTransform, this.layoutBounds, {
        tandem: tandem.createTandem( 'quadrilateralNode' )
      } );
      this.addChild( this.quadrilateralNode );

      this.quadrilateralSoundView = new QuadrilateralSoundView( model, soundOptionsModel );
    }

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - QuadrilateralConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    const testPath = new Path( null, { fill: 'rgba(255,0,0,0.5)' } );
    this.addChild( testPath );

    if ( QuadrilateralQueryParameters.showDragAreas ) {
      this.addChild( new VertexDragAreaNode( model.vertex1, modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( model.vertex2, modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( model.vertex3, modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( model.vertex4, modelViewTransform ) );
    }
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView.
   */
  public getVoicingOverviewContent(): string {
    return 'Please implement getVoicingOverviewContent';
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView.
   */
  public getVoicingDetailsContent(): string {
    return 'Please implement getVoicingDetailsContent';
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView.
   */
  public getVoicingHintContent(): string {
    return 'Please implement getVoicingHintContent';
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( this.quadrilateralSoundView ) {
      this.quadrilateralSoundView.step( dt );
    }
    if ( this.demonstrationNode ) {
      this.demonstrationNode.step( dt );
    }
  }

  public override layout( viewBounds: Bounds2 ): void {
    super.layout( viewBounds );

    this.quadrilateralNode && this.quadrilateralNode.layout( this.layoutBounds );
    this.model.modelBoundsProperty.value = this.modelViewTransform.viewToModelBounds( this.layoutBounds );
  }
}

quadrilateral.register( 'QuadrilateralScreenView', QuadrilateralScreenView );
export default QuadrilateralScreenView;
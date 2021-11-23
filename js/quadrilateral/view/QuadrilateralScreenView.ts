// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
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
import quadrilateralStrings from '../../quadrilateralStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import QuadrilateralDescriber from './QuadrilateralDescriber.js';

class QuadrilateralScreenView extends ScreenView {
  private readonly model: QuadrilateralModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly quadrilateralNode: QuadrilateralNode | null;
  private readonly demonstrationNode: SideDemonstrationNode | null;
  private readonly quadrilateralSoundView: QuadrilateralSoundView | null;
  private readonly quadrilateralDescriber: QuadrilateralDescriber;
  private readonly resetAllButton: ResetAllButton;

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

    // Responsible for generating descriptions of the state of the quadrilateral for accessibility.
    this.quadrilateralDescriber = new QuadrilateralDescriber( model );

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

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - QuadrilateralConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( this.resetAllButton );

    if ( QuadrilateralQueryParameters.showDragAreas ) {
      this.addChild( new VertexDragAreaNode( model.vertex1, [ model.leftSide, model.topSide ], modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( model.vertex2, [ model.topSide, model.rightSide ], modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( model.vertex3, [ model.rightSide, model.bottomSide ], modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( model.vertex4, [ model.bottomSide, model.leftSide ], modelViewTransform ) );
    }
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView.
   */
  public getVoicingOverviewContent(): string {
    return quadrilateralStrings.a11y.voicing.overviewContent;
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView.
   */
  public getVoicingDetailsContent(): string {
    return StringUtils.fillIn( quadrilateralStrings.a11y.voicing.detailsPattern, {
      description: this.quadrilateralDescriber.getShapeDescription()
    } );
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView.
   */
  public getVoicingHintContent(): string {
    return quadrilateralStrings.a11y.voicing.hintContent;
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

  console.log( this.getVoicingDetailsContent() );
  }

  public override layout( viewBounds: Bounds2 ): void {
    super.layout( viewBounds );

    // the model bounds are defined by available view space. Some padding is added around the screen and we make
    // sure that the vertices cannot overlap with simulation controls (at this time, just the ResetAllButton).
    // Otherwise the quadrilateral can move around freely in model space.
    let reducedViewBounds = this.layoutBounds.eroded( QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN );
    reducedViewBounds = reducedViewBounds.withMaxX( reducedViewBounds.maxX - this.resetAllButton.width - QuadrilateralConstants.SCREEN_VIEW_X_MARGIN );

    this.quadrilateralNode && this.quadrilateralNode.layout( reducedViewBounds );
    this.model.modelBoundsProperty.value = this.modelViewTransform.viewToModelBounds( reducedViewBounds );
  }
}

quadrilateral.register( 'QuadrilateralScreenView', QuadrilateralScreenView );
export default QuadrilateralScreenView;
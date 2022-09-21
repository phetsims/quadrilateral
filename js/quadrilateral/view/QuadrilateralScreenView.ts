// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import { Rectangle, Text } from '../../../../scenery/js/imports.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import QuadrilateralNode from './QuadrilateralNode.js';
import QuadrilateralSoundView from './sound/QuadrilateralSoundView.js';
import VertexDragAreaNode from './VertexDragAreaNode.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import QuadrilateralDescriber from './QuadrilateralDescriber.js';
import Dialog from '../../../../sun/js/Dialog.js';
import CalibrationContentNode from './CalibrationContentNode.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import QuadrilateralModelValuePanel from './QuadrilateralModelValuePanel.js';
import SideLengthAreaNode from './SideLengthAreaNode.js';
import QuadrilateralVisibilityControls from './QuadrilateralVisibilityControls.js';
import QuadrilateralGridNode from './QuadrilateralGridNode.js';
import QuadrilateralScreenSummaryContentNode from './QuadrilateralScreenSummaryContentNode.js';
import QuadrilateralAlerter from './QuadrilateralAlerter.js';
import QuadrilateralBluetoothConnectionButton from './QuadrilateralBluetoothConnectionButton.js';
import QuadrilateralPreferencesModel from '../model/QuadrilateralPreferencesModel.js';
import QuadrilateralSoundBoardNode from './sound/QuadrilateralSoundBoardNode.js';
import QuadrilateralMediaPipe from './QuadrilateralMediaPipe.js';
import QuadrilateralDiagonalGuidesNode from './QuadrilateralDiagonalGuidesNode.js';
import QuadrilateralShapeNameDisplay from './QuadrilateralShapeNameDisplay.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import MediaPipeQueryParameters from '../../../../tangible/js/mediaPipe/MediaPipeQueryParameters.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadrilateralInteractionCueNode from './QuadrilateralInteractionCueNode.js';
import ResetShapeButton from './ResetShapeButton.js';
import ShapeSoundCheckbox from './ShapeSoundCheckbox.js';
import Vertex from '../model/Vertex.js';

// Defines the units of model space, a 2x2 grid that quadrilateral vertices can move within. It is dilated by
// half of the vertex width so that model space is large enough for Vertices to perfectly align with the bounds
// limits, requested in https://github.com/phetsims/quadrilateral/issues/220
const MODEL_BOUNDS = new Bounds2( -1, -1, 1, 1 ).dilated( Vertex.VERTEX_WIDTH / 2 );

const BORDER_RECTANGLE_LINE_WIDTH = 2;

class QuadrilateralScreenView extends ScreenView {
  private readonly model: QuadrilateralModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly quadrilateralNode: QuadrilateralNode | null;
  private readonly quadrilateralSoundView: QuadrilateralSoundView | null;
  public readonly quadrilateralDescriber: QuadrilateralDescriber;
  private readonly resetAllButton: ResetAllButton;
  private readonly mediaPipe: QuadrilateralMediaPipe | null = null;

  public constructor( model: QuadrilateralModel, preferencesModel: QuadrilateralPreferencesModel, tandem: Tandem ) {
    super( {

      // phet-io
      tandem: tandem
    } );

    // Responsible for generating descriptions of the state of the quadrilateral for accessibility.
    this.quadrilateralDescriber = new QuadrilateralDescriber( model.quadrilateralShapeModel );

    const visibilityControls = new QuadrilateralVisibilityControls(
      model.vertexLabelsVisibleProperty,
      model.cornerGuideVisibleProperty,
      model.gridVisibleProperty,
      model.diagonalGuidesVisibleProperty,
      {
        rightCenter: this.layoutBounds.rightCenter.minusXY( QuadrilateralConstants.SCREEN_VIEW_X_MARGIN, 0 ),
        tandem: tandem.createTandem( 'visibilityControls' )
      } );
    this.addChild( visibilityControls );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },

      left: visibilityControls.left,
      bottom: this.layoutBounds.maxY - QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( this.resetAllButton );

    const shapeSoundCheckbox = new ShapeSoundCheckbox( model.shapeSoundEnabledProperty, tandem.createTandem( 'shapeSoundCheckbox' ) );
    shapeSoundCheckbox.leftBottom = this.resetAllButton.leftTop.minusXY( 0, 45 );
    this.addChild( shapeSoundCheckbox );

    const shapeNameDisplay = new QuadrilateralShapeNameDisplay( model.shapeNameVisibleProperty, model.quadrilateralShapeModel.shapeNameProperty, this.quadrilateralDescriber, tandem.createTandem( 'quadrilateralShapeNameDisplay' ) );
    this.addChild( shapeNameDisplay );

    const resetShapeButton = new ResetShapeButton(
      model.quadrilateralShapeModel,
      model.resetNotInProgressProperty,
      model.shapeNameVisibleProperty,
      tandem.createTandem( 'resetShapeButton' )
    );
    this.addChild( resetShapeButton );

    // the model bounds are defined by available view space. Some padding is added around the screen and we make
    // sure that the vertices cannot overlap with simulation controls. Otherwise the quadrilateral can move freely in
    // the ScreenView.
    let reducedViewBounds = this.layoutBounds.eroded( QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN );
    reducedViewBounds = reducedViewBounds.withMaxX( this.resetAllButton.left - QuadrilateralConstants.SCREEN_VIEW_X_MARGIN );
    reducedViewBounds = reducedViewBounds.withMinY( shapeNameDisplay.height + 2 * QuadrilateralConstants.VIEW_SPACING );

    // The bounds used for the ModelViewTransform2 are a square set of bounds constrained by the limiting dimension
    // of the reducedViewBounds and centered around the reducedViewBounds. Must be square so that the deltas in x and y
    // directions are the same when moving between model and view coordinates. Produces a square in view space
    // such that -1 is at the top and 1 is at the bottom.
    const largestDimension = reducedViewBounds.height; // layoutBounds are wider than they are tall
    const viewBoundsForTransform = new Bounds2(
      reducedViewBounds.centerX - largestDimension / 2,
      reducedViewBounds.centerY - largestDimension / 2,
      reducedViewBounds.centerX + largestDimension / 2,
      reducedViewBounds.centerY + largestDimension / 2
    );

    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      MODEL_BOUNDS,
      viewBoundsForTransform
    );

    this.model = model;
    this.modelViewTransform = modelViewTransform;

    // The available model bounds are determined by the size of the view
    model.modelBoundsProperty.value = this.modelViewTransform.viewToModelBounds( reducedViewBounds );

    const shapeModel = model.quadrilateralShapeModel;

    // A reference to the QuadriladteralSoundView
    this.quadrilateralSoundView = null;

    // Layered under everything else
    const diagonalGuidesNode = new QuadrilateralDiagonalGuidesNode( model.quadrilateralShapeModel, model.modelBoundsProperty, model.diagonalGuidesVisibleProperty, this.modelViewTransform );

    this.quadrilateralNode = new QuadrilateralNode( model, modelViewTransform, this.layoutBounds, {
      tandem: tandem.createTandem( 'quadrilateralNode' )
    } );

    const interactionCueNode = new QuadrilateralInteractionCueNode( model.quadrilateralShapeModel, model.connectedToDeviceProperty, model.resetEmitter, modelViewTransform );

    this.quadrilateralSoundView = new QuadrilateralSoundView( model, preferencesModel.soundOptionsModel );

    // Rectangle showing available model bounds, requested in https://github.com/phetsims/quadrilateral/issues/49.
    // Rounded corners to look nice, but actual model bounds are pure Bounds2.
    assert && assert( this.model.modelBoundsProperty.value !== null );
    const playAreaViewBounds = modelViewTransform.modelToViewBounds( this.model.modelBoundsProperty.value! );
    const boundsRectangle = new Rectangle( playAreaViewBounds, 5, 5, {
      stroke: QuadrilateralColors.playAreaStrokeColorProperty,
      fill: QuadrilateralColors.playAreaFillColorProperty,
      lineWidth: BORDER_RECTANGLE_LINE_WIDTH
    } );

    if ( QuadrilateralQueryParameters.showDragAreas ) {
      this.addChild( new VertexDragAreaNode( shapeModel.vertexA, [ shapeModel.leftSide, shapeModel.topSide ], modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( shapeModel.vertexB, [ shapeModel.topSide, shapeModel.rightSide ], modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( shapeModel.vertexC, [ shapeModel.rightSide, shapeModel.bottomSide ], modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( shapeModel.vertexD, [ shapeModel.bottomSide, shapeModel.leftSide ], modelViewTransform ) );
    }
    if ( QuadrilateralQueryParameters.showLengthAreas ) {
      this.addChild( new SideLengthAreaNode( shapeModel, shapeModel.topSide, shapeModel.bottomSide, shapeModel.leftSide, modelViewTransform ) );
      this.addChild( new SideLengthAreaNode( shapeModel, shapeModel.rightSide, shapeModel.leftSide, shapeModel.topSide, modelViewTransform, { drawRotation: -Math.PI / 2 } ) );
      this.addChild( new SideLengthAreaNode( shapeModel, shapeModel.bottomSide, shapeModel.topSide, shapeModel.rightSide, modelViewTransform, { drawRotation: Math.PI } ) );
      this.addChild( new SideLengthAreaNode( shapeModel, shapeModel.leftSide, shapeModel.rightSide, shapeModel.bottomSide, modelViewTransform, { drawRotation: Math.PI / 2 } ) );
    }

    const gridNode = new QuadrilateralGridNode( model.modelBoundsProperty, model.gridVisibleProperty, this.modelViewTransform );

    // rendering order - See https://github.com/phetsims/quadrilateral/issues/178
    this.addChild( boundsRectangle );
    this.addChild( diagonalGuidesNode );
    this.addChild( gridNode );
    this.addChild( this.quadrilateralNode );
    this.addChild( interactionCueNode );

    // A panel that displays model values, useful for debugging, useful for debugging
    const debugValuesPanel = new QuadrilateralModelValuePanel( model, {
      leftTop: boundsRectangle.leftTop.plusXY( 5, 5 )
    } );
    model.showDebugValuesProperty.link( showValues => {
      debugValuesPanel.visible = showValues;
    } );
    this.addChild( debugValuesPanel );

    // layout for components that depend on the play area bounds being defined
    shapeNameDisplay.centerBottom = boundsRectangle.centerTop.minusXY( 0, QuadrilateralConstants.VIEW_SPACING );
    resetShapeButton.rightCenter = new Vector2( boundsRectangle.right, shapeNameDisplay.centerY );

    if ( QuadrilateralQueryParameters.soundBoard ) {

      const soundBoardDialog = new Dialog( new QuadrilateralSoundBoardNode(), {
        title: new Text( 'QuadrilateralSoundBoard', QuadrilateralConstants.PANEL_TITLE_TEXT_OPTIONS )
      } );

      // this is the "sim", add a button to start calibration
      const showSoundBoardButton = new TextPushButton( 'Sound Board', {
        listener: () => {
          soundBoardDialog.show();
        },

        textNodeOptions: QuadrilateralConstants.SCREEN_TEXT_OPTIONS,

        // position is relative to the ResetAllButton for now
        leftBottom: visibilityControls.leftTop.minusXY( 0, 15 )
      } );

      this.addChild( showSoundBoardButton );
    }

    if ( QuadrilateralQueryParameters.deviceConnection ) {

      // Add a Dialog that will calibrate the device to the simulation (mapping physical data to modelled data).
      const calibrationDialog = new Dialog( new CalibrationContentNode( model ), {
        title: new Text( 'External Device Calibration', QuadrilateralConstants.PANEL_TITLE_TEXT_OPTIONS )
      } );

      calibrationDialog.isShowingProperty.link( ( isShowing, wasShowing ) => {
        model.isCalibratingProperty.value = isShowing;

        if ( !isShowing && wasShowing !== null ) {
          const physicalModelBounds = model.physicalModelBoundsProperty.value;

          // it is possible that the Dialog was closed without getting good values for the bounds, only set
          // positions if all is well
          if ( physicalModelBounds && physicalModelBounds.isValid() ) {
            shapeModel.setPositionsFromLengthAndAngleData(
              physicalModelBounds.width,
              physicalModelBounds.width,
              physicalModelBounds.width,
              physicalModelBounds.width,
              Math.PI / 2,
              Math.PI / 2,
              Math.PI / 2,
              Math.PI / 2
            );
          }
        }
      } );

      // this is the "sim", add a button to start calibration
      const calibrationButton = new TextPushButton( 'Calibrate Device', {
        listener: () => {
          calibrationDialog.show();
        },

        textNodeOptions: QuadrilateralConstants.SCREEN_TEXT_OPTIONS,
        baseColor: PhetColorScheme.BUTTON_YELLOW,

        // position is relative to the ResetAllButton for now
        leftBottom: this.resetAllButton.leftTop.minusXY( 0, 15 )
      } );

      this.addChild( calibrationButton );

      if ( QuadrilateralQueryParameters.bluetooth ) {
        const connectionPanel = new QuadrilateralBluetoothConnectionButton( model, tandem.createTandem( 'quadrilateralBluetoothConnectionButton' ) );
        connectionPanel.leftBottom = calibrationButton.leftTop.minusXY( 0, 15 );
        this.addChild( connectionPanel );
      }
    }

    if ( MediaPipeQueryParameters.cameraInput === 'hands' ) {
      this.mediaPipe = new QuadrilateralMediaPipe( model );
    }

    // pdom
    this.pdomPlayAreaNode.pdomOrder = [ this.quadrilateralNode, shapeNameDisplay, resetShapeButton ];
    this.pdomControlAreaNode.pdomOrder = [ visibilityControls, shapeSoundCheckbox, this.resetAllButton ];
    this.setScreenSummaryContent( new QuadrilateralScreenSummaryContentNode() );

    // voicing
    // Disabling eslint here because this variable is not used but I am sure that it will be soon.
    // eslint-disable-next-line no-unused-vars
    const quadrilateralAlerter = new QuadrilateralAlerter( model, this, modelViewTransform ); // eslint-disable-line @typescript-eslint/no-unused-vars
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView.
   */
  public override getVoicingOverviewContent(): string {
    return QuadrilateralStrings.a11y.voicing.overviewContent;
  }

  /**
   * Get the details content that is spoken from the Voicing toolbar to describe details about the simulation.
   */
  public override getVoicingDetailsContent(): string {
    const firstStatement = this.quadrilateralDescriber.getFirstDetailsStatement();
    const secondStatement = this.quadrilateralDescriber.getSecondDetailsStatement();
    const thirdStatement = this.quadrilateralDescriber.getThirdDetailsStatement();
    assert && assert( firstStatement, 'there should always be a first statement for details' );

    let contentString = firstStatement;

    let patternString;
    if ( secondStatement && thirdStatement ) {
      patternString = '{{firstStatement}} {{secondStatement}} {{thirdStatement}}';
      contentString = StringUtils.fillIn( patternString, {
        firstStatement: firstStatement,
        secondStatement: secondStatement,
        thirdStatement: thirdStatement
      } );
    }
    else if ( secondStatement ) {
      patternString = '{{firstStatement}} {{secondStatement}}';
      contentString = StringUtils.fillIn( patternString, {
        firstStatement: firstStatement,
        secondStatement: secondStatement
      } );
    }
    else if ( thirdStatement ) {
      patternString = '{{firstStatement}} {{thirdStatement}}';
      contentString = StringUtils.fillIn( patternString, {
        firstStatement: firstStatement,
        thirdStatement: thirdStatement
      } );
    }

    return contentString;
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView. In this sim we use the hint
   * button to describe the parallelogram state and shape name of the quadrilateral.
   */
  public override getVoicingHintContent(): string {

    const shapeDescriptionString = this.quadrilateralDescriber.getShapeDescription();
    const youHaveAShapeString = StringUtils.fillIn( QuadrilateralStrings.a11y.voicing.youHaveAShapeHintPattern, {
      shapeDescription: shapeDescriptionString
    } );

    return StringUtils.fillIn( QuadrilateralStrings.a11y.voicing.hintContentPattern, {
      shapeDescription: youHaveAShapeString
    } );
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
  public override step( dt: number ): void {
    if ( this.quadrilateralSoundView ) {
      this.quadrilateralSoundView.step( dt );
    }

    this.mediaPipe && this.mediaPipe.step( dt );

    this.quadrilateralNode && this.quadrilateralNode.step( dt );

    // Removed for now, see https://github.com/phetsims/quadrilateral/issues/104
    // vibrationManager.step( dt );
  }
}

quadrilateral.register( 'QuadrilateralScreenView', QuadrilateralScreenView );
export default QuadrilateralScreenView;
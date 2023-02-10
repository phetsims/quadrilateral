// Copyright 2021-2023, University of Colorado Boulder

/**
 * The ScreenView for this simulation, containing all view components.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import { VBox } from '../../../../scenery/js/imports.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import QuadrilateralNode from './QuadrilateralNode.js';
import QuadrilateralSoundView from './sound/QuadrilateralSoundView.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import QuadrilateralDescriber from './QuadrilateralDescriber.js';
import QuadrilateralDebuggingPanel from './QuadrilateralDebuggingPanel.js';
import QuadrilateralVisibilityControls from './QuadrilateralVisibilityControls.js';
import QuadrilateralGridNode from './QuadrilateralGridNode.js';
import QuadrilateralScreenSummaryContentNode from './QuadrilateralScreenSummaryContentNode.js';
import QuadrilateralAlerter from './QuadrilateralAlerter.js';
import QuadrilateralPreferencesModel from '../model/QuadrilateralPreferencesModel.js';
import QuadrilateralMediaPipe from './QuadrilateralMediaPipe.js';
import QuadrilateralDiagonalGuidesNode from './QuadrilateralDiagonalGuidesNode.js';
import QuadrilateralShapeNameDisplay from './QuadrilateralShapeNameDisplay.js';
import MediaPipeQueryParameters from '../../../../tangible/js/mediaPipe/MediaPipeQueryParameters.js';
import QuadrilateralInteractionCueNode from './QuadrilateralInteractionCueNode.js';
import ResetShapeButton from './ResetShapeButton.js';
import ShapeSoundsCheckbox from './ShapeSoundsCheckbox.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SmallStepsLockToggleButton from './SmallStepsLockToggleButton.js';
import QuadrilateralTangibleControls from './QuadrilateralTangibleControls.js';
import QuadrilateralModelViewTransform from './QuadrilateralModelViewTransform.js';

class QuadrilateralScreenView extends ScreenView {
  private readonly model: QuadrilateralModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly quadrilateralNode: QuadrilateralNode;
  private readonly quadrilateralSoundView: QuadrilateralSoundView;
  private readonly quadrilateralDescriber: QuadrilateralDescriber;
  private readonly quadrilateralMediaPipe: QuadrilateralMediaPipe | null = null;

  public constructor( model: QuadrilateralModel, preferencesModel: QuadrilateralPreferencesModel, tandem: Tandem ) {
    super( {

      // phet-io
      tandem: tandem
    } );

    //---------------------------------------------------------------------------
    // Create view subcomponents
    //---------------------------------------------------------------------------
    this.quadrilateralDescriber = new QuadrilateralDescriber( model.quadrilateralShapeModel, model.shapeNameVisibleProperty, model.markersVisibleProperty );

    const visibilityControls = new QuadrilateralVisibilityControls(
      model.vertexLabelsVisibleProperty,
      model.markersVisibleProperty,
      model.gridVisibleProperty,
      model.diagonalGuidesVisibleProperty,
      {
        tandem: tandem.createTandem( 'visibilityControls' )
      } );

    const smallStepsLockToggleButton = new SmallStepsLockToggleButton( model.lockToMinorIntervalsProperty, {
      tandem: tandem.createTandem( 'smallStepsLockToggleButton' )
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    const shapeNameDisplay = new QuadrilateralShapeNameDisplay( model.shapeNameVisibleProperty, model.quadrilateralShapeModel.shapeNameProperty, this.quadrilateralDescriber, tandem.createTandem( 'quadrilateralShapeNameDisplay' ) );

    const resetShapeButton = new ResetShapeButton(
      model.quadrilateralShapeModel,
      model.resetNotInProgressProperty,
      model.shapeNameVisibleProperty,
      tandem.createTandem( 'resetShapeButton' )
    );

    const shapeSoundsCheckbox = new ShapeSoundsCheckbox( model.shapeSoundEnabledProperty, tandem.createTandem( 'shapeSoundsCheckbox' ) );

    this.model = model;
    this.modelViewTransform = new QuadrilateralModelViewTransform( model.modelBounds, this.layoutBounds );

    const tangibleConnectionModel = model.tangibleConnectionModel;

    // Layered under everything else
    const diagonalGuidesNode = new QuadrilateralDiagonalGuidesNode( model.quadrilateralShapeModel, model.modelBounds, model.diagonalGuidesVisibleProperty, this.modelViewTransform );

    this.quadrilateralNode = new QuadrilateralNode( model, this.modelViewTransform, this.layoutBounds, this.quadrilateralDescriber, {
      tandem: tandem.createTandem( 'quadrilateralNode' )
    } );

    const interactionCueNode = new QuadrilateralInteractionCueNode( model.quadrilateralShapeModel, tangibleConnectionModel.connectedToDeviceProperty, model.resetEmitter, this.modelViewTransform );

    this.quadrilateralSoundView = new QuadrilateralSoundView( model, preferencesModel.soundOptionsModel );

    const gridNode = new QuadrilateralGridNode( model.modelBounds, model.gridVisibleProperty, this.modelViewTransform );

    const debugValuesPanel = new QuadrilateralDebuggingPanel( model );
    model.showDebugValuesProperty.link( showValues => {
      debugValuesPanel.visible = showValues;
    } );

    // only has children if relevant query parameters are provided, but this parent is always created for easy
    // layout and PDOM ordering
    const deviceConnectionParentNode = new VBox( {
      align: 'left',
      spacing: QuadrilateralConstants.CONTROLS_SPACING
    } );
    if ( QuadrilateralQueryParameters.deviceConnection ) {

      deviceConnectionParentNode.children = [
        new QuadrilateralTangibleControls( model.tangibleConnectionModel, tandem.createTandem( 'connectionControls' ) )
      ];
      deviceConnectionParentNode.top = gridNode.top;
      deviceConnectionParentNode.left = resetAllButton.left;
    }

    // rendering order - See https://github.com/phetsims/quadrilateral/issues/178
    this.children = [

      // shape area
      gridNode,
      diagonalGuidesNode,
      this.quadrilateralNode,
      interactionCueNode,
      debugValuesPanel,

      // controls
      visibilityControls,
      smallStepsLockToggleButton,
      resetAllButton,
      shapeSoundsCheckbox,
      shapeNameDisplay,
      resetShapeButton,
      deviceConnectionParentNode
    ];

    // relative layout
    visibilityControls.rightCenter = this.layoutBounds.rightCenter.minusXY( QuadrilateralConstants.SCREEN_VIEW_X_MARGIN, 0 );
    resetAllButton.leftBottom = new Vector2( visibilityControls.left, this.layoutBounds.maxY - QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN );
    shapeNameDisplay.centerBottom = gridNode.centerTop.minusXY( 0, QuadrilateralConstants.VIEW_SPACING );
    shapeSoundsCheckbox.rightCenter = new Vector2( gridNode.right, shapeNameDisplay.centerY );
    debugValuesPanel.leftTop = gridNode.leftTop.plusXY( 5, 5 );
    smallStepsLockToggleButton.leftBottom = resetAllButton.leftTop.minusXY( 0, 45 );
    resetShapeButton.rightCenter = shapeSoundsCheckbox.leftCenter.minusXY(
      // effectively centers this button between the other name display controls
      ( shapeSoundsCheckbox.left - shapeNameDisplay.right - resetShapeButton.width ) / 2, 0
    );

    if ( MediaPipeQueryParameters.cameraInput === 'hands' ) {
      this.quadrilateralMediaPipe = new QuadrilateralMediaPipe( model );
      tangibleConnectionModel.connectedToDeviceProperty.value = true;
    }

    // pdom
    this.pdomPlayAreaNode.pdomOrder = [ this.quadrilateralNode, shapeNameDisplay, resetShapeButton, shapeSoundsCheckbox ];
    this.pdomControlAreaNode.pdomOrder = [ visibilityControls, smallStepsLockToggleButton, resetAllButton, deviceConnectionParentNode ];
    this.setScreenSummaryContent( new QuadrilateralScreenSummaryContentNode() );

    // voicing
    // Disabling eslint here because this variable is not used but I am sure that it will be soon.
    const quadrilateralAlerter = new QuadrilateralAlerter( model, this, this.modelViewTransform, this.quadrilateralDescriber ); // eslint-disable-line @typescript-eslint/no-unused-vars
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
    const fourthStatement = this.quadrilateralDescriber.getFourthDetailsStatement();
    const fifthStatement = this.quadrilateralDescriber.getFifthDetailsStatement();
    assert && assert( firstStatement, 'there should always be a first statement for details' );

    let contentString = firstStatement;

    // NOTE: Bad for i18n but much easier for now.
    if ( secondStatement ) {
      contentString += ' ' + secondStatement;
    }
    if ( thirdStatement ) {
      contentString += ' ' + thirdStatement;
    }
    if ( fourthStatement ) {
      contentString += ' ' + fourthStatement;
    }
    if ( fifthStatement ) {
      contentString += ' ' + fifthStatement;
    }

    return contentString;
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView. In this sim we use the hint
   * button to describe the parallelogram state and shape name of the quadrilateral.
   */
  public override getVoicingHintContent(): string {
    return QuadrilateralStrings.a11y.voicing.hintContent;
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    if ( this.quadrilateralSoundView ) {
      this.quadrilateralSoundView.step( dt );
    }

    this.quadrilateralMediaPipe && this.quadrilateralMediaPipe.step( dt );

    this.quadrilateralNode && this.quadrilateralNode.step( dt );

    // Removed for now, see https://github.com/phetsims/quadrilateral/issues/104
    // vibrationManager.step( dt );
  }
}

quadrilateral.register( 'QuadrilateralScreenView', QuadrilateralScreenView );
export default QuadrilateralScreenView;
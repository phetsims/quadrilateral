// Copyright 2021-2023, University of Colorado Boulder

/**
 * The ScreenView for this simulation, containing all view components.
 *
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
import { Text, VBox } from '../../../../scenery/js/imports.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import QuadrilateralNode from './QuadrilateralNode.js';
import QuadrilateralSoundView from './sound/QuadrilateralSoundView.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import QuadrilateralDescriber from './QuadrilateralDescriber.js';
import Dialog from '../../../../sun/js/Dialog.js';
import CalibrationContentNode from './CalibrationContentNode.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import QuadrilateralModelValuePanel from './QuadrilateralModelValuePanel.js';
import QuadrilateralVisibilityControls from './QuadrilateralVisibilityControls.js';
import QuadrilateralGridNode from './QuadrilateralGridNode.js';
import QuadrilateralScreenSummaryContentNode from './QuadrilateralScreenSummaryContentNode.js';
import QuadrilateralAlerter from './QuadrilateralAlerter.js';
import QuadrilateralBluetoothConnectionButton from './QuadrilateralBluetoothConnectionButton.js';
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
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import QuadrilateralSerialConnectionButton from './QuadrilateralSerialConnectionButton.js';

class QuadrilateralScreenView extends ScreenView {
  private readonly model: QuadrilateralModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly quadrilateralNode: QuadrilateralNode;
  private readonly quadrilateralSoundView: QuadrilateralSoundView;
  private readonly quadrilateralDescriber: QuadrilateralDescriber;
  private readonly mediaPipe: QuadrilateralMediaPipe | null = null;

  public constructor( model: QuadrilateralModel, preferencesModel: QuadrilateralPreferencesModel, tandem: Tandem ) {
    super( {

      // phet-io
      tandem: tandem
    } );

    // Responsible for generating descriptions of the state of the quadrilateral for accessibility.
    this.quadrilateralDescriber = new QuadrilateralDescriber( model.quadrilateralShapeModel, model.shapeNameVisibleProperty, model.markersVisibleProperty );

    const visibilityControls = new QuadrilateralVisibilityControls(
      model.vertexLabelsVisibleProperty,
      model.markersVisibleProperty,
      model.gridVisibleProperty,
      model.diagonalGuidesVisibleProperty,
      {
        rightCenter: this.layoutBounds.rightCenter.minusXY( QuadrilateralConstants.SCREEN_VIEW_X_MARGIN, 0 ),
        tandem: tandem.createTandem( 'visibilityControls' )
      } );
    this.addChild( visibilityControls );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },

      left: visibilityControls.left,
      bottom: this.layoutBounds.maxY - QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    const shapeSoundsCheckbox = new ShapeSoundsCheckbox( model.shapeSoundEnabledProperty, tandem.createTandem( 'shapeSoundsCheckbox' ) );
    this.addChild( shapeSoundsCheckbox );

    const shapeNameDisplay = new QuadrilateralShapeNameDisplay( model.shapeNameVisibleProperty, model.quadrilateralShapeModel.shapeNameProperty, this.quadrilateralDescriber, tandem.createTandem( 'quadrilateralShapeNameDisplay' ) );
    this.addChild( shapeNameDisplay );

    const resetShapeButton = new ResetShapeButton(
      model.quadrilateralShapeModel,
      model.resetNotInProgressProperty,
      model.shapeNameVisibleProperty,
      tandem.createTandem( 'resetShapeButton' )
    );
    this.addChild( resetShapeButton );

    const smallStepsLockToggleButton = new SmallStepsLockToggleButton( model.lockToMinorIntervalsProperty, {
      tandem: tandem.createTandem( 'smallStepsLockToggleButton' )
    } );
    this.addChild( smallStepsLockToggleButton );
    smallStepsLockToggleButton.leftBottom = resetAllButton.leftTop.minusXY( 0, 45 );

    // the model bounds are defined by available view space. Some padding is added around the screen and we make
    // sure that the vertices cannot overlap with simulation controls. Otherwise the quadrilateral can move freely in
    // the ScreenView.
    let reducedViewBounds = this.layoutBounds.eroded( QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN );
    reducedViewBounds = reducedViewBounds.withMaxX( resetAllButton.left - QuadrilateralConstants.SCREEN_VIEW_X_MARGIN );
    reducedViewBounds = reducedViewBounds.withMinY( shapeNameDisplay.height + 2 * QuadrilateralConstants.VIEW_SPACING );

    // The bounds used for the ModelViewTransform2 are a square set of bounds constrained by the limiting dimension
    // of the reducedViewBounds and centered around the reducedViewBounds. Must be square so that the deltas in x and y
    // directions are the same when moving between model and view coordinates. Produces a square in view space
    // such that -1 is at the top and 1 is at the bottom.
    const largestViewDimension = reducedViewBounds.height; // layoutBounds are wider than they are tall
    const viewBoundsForTransform = new Bounds2(
      reducedViewBounds.centerX - largestViewDimension / 2,
      reducedViewBounds.centerY - largestViewDimension / 2,
      reducedViewBounds.centerX + largestViewDimension / 2,
      reducedViewBounds.centerY + largestViewDimension / 2
    );
    const largestModelDimension = model.modelBounds.height;
    const modelBoundsForTransform = new Bounds2(
      -largestModelDimension / 2, -largestModelDimension / 2, largestModelDimension / 2, largestModelDimension / 2
    );

    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      modelBoundsForTransform,
      viewBoundsForTransform
    );

    this.model = model;
    this.modelViewTransform = modelViewTransform;

    const shapeModel = model.quadrilateralShapeModel;
    const tangibleConnectionModel = model.tangibleConnectionModel;

    // Layered under everything else
    const diagonalGuidesNode = new QuadrilateralDiagonalGuidesNode( model.quadrilateralShapeModel, model.modelBounds, model.diagonalGuidesVisibleProperty, this.modelViewTransform );

    this.quadrilateralNode = new QuadrilateralNode( model, modelViewTransform, this.layoutBounds, this.quadrilateralDescriber, {
      tandem: tandem.createTandem( 'quadrilateralNode' )
    } );

    const interactionCueNode = new QuadrilateralInteractionCueNode( model.quadrilateralShapeModel, tangibleConnectionModel.connectedToDeviceProperty, model.resetEmitter, modelViewTransform );

    this.quadrilateralSoundView = new QuadrilateralSoundView( model, preferencesModel.soundOptionsModel );

    const gridNode = new QuadrilateralGridNode( model.modelBounds, model.gridVisibleProperty, this.modelViewTransform );

    // rendering order - See https://github.com/phetsims/quadrilateral/issues/178
    // this.addChild( boundsRectangle );
    this.addChild( gridNode );
    this.addChild( diagonalGuidesNode );
    this.addChild( this.quadrilateralNode );
    this.addChild( interactionCueNode );

    // A panel that displays model values, useful for debugging, useful for debugging
    const debugValuesPanel = new QuadrilateralModelValuePanel( model, {
      leftTop: gridNode.leftTop.plusXY( 5, 5 )
    } );
    model.showDebugValuesProperty.link( showValues => {
      debugValuesPanel.visible = showValues;
    } );
    this.addChild( debugValuesPanel );

    // layout for components that depend on the play area bounds being defined
    shapeNameDisplay.centerBottom = gridNode.centerTop.minusXY( 0, QuadrilateralConstants.VIEW_SPACING );
    shapeSoundsCheckbox.rightCenter = new Vector2( gridNode.right, shapeNameDisplay.centerY );

    // effectively centers the resetShapeButton between the other two components
    resetShapeButton.rightCenter = shapeSoundsCheckbox.leftCenter.minusXY(
      ( shapeSoundsCheckbox.left - shapeNameDisplay.right - resetShapeButton.width ) / 2,
      0
    );

    const deviceConnectionParentNode = new VBox( {
      align: 'left',
      spacing: QuadrilateralConstants.CONTROLS_SPACING
    } );
    this.addChild( deviceConnectionParentNode );
    if ( QuadrilateralQueryParameters.deviceConnection ) {

      const connectionComponents = [];

      // Add a Dialog that will calibrate the device to the simulation (mapping physical data to modelled data).
      const calibrationDialog = new Dialog( new CalibrationContentNode( model ), {
        title: new Text( 'External Device Calibration', QuadrilateralConstants.PANEL_TITLE_TEXT_OPTIONS )
      } );

      calibrationDialog.isShowingProperty.link( ( isShowing, wasShowing ) => {
        tangibleConnectionModel.isCalibratingProperty.value = isShowing;

        if ( !isShowing && wasShowing !== null ) {
          const physicalModelBounds = tangibleConnectionModel.physicalModelBoundsProperty.value;

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
        baseColor: QuadrilateralColors.screenViewButtonColorProperty
      } );
      connectionComponents.push( calibrationButton );

      if ( QuadrilateralQueryParameters.bluetooth ) {
        const bluetoothButton = new QuadrilateralBluetoothConnectionButton( model, tandem.createTandem( 'quadrilateralBluetoothConnectionButton' ) );
        connectionComponents.push( bluetoothButton );
      }

      if ( QuadrilateralQueryParameters.serial ) {
        const sendValuesButton = new QuadrilateralSerialConnectionButton( model );
        sendValuesButton.leftBottom = gridNode.leftTop;
        connectionComponents.push( sendValuesButton );
      }

      deviceConnectionParentNode.children = connectionComponents;
      deviceConnectionParentNode.top = gridNode.top;
      deviceConnectionParentNode.left = resetAllButton.left;
    }

    if ( MediaPipeQueryParameters.cameraInput === 'hands' ) {
      this.mediaPipe = new QuadrilateralMediaPipe( model );
      tangibleConnectionModel.connectedToDeviceProperty.value = true;
    }

    // pdom
    this.pdomPlayAreaNode.pdomOrder = [ this.quadrilateralNode, shapeNameDisplay, resetShapeButton, shapeSoundsCheckbox ];
    this.pdomControlAreaNode.pdomOrder = [ visibilityControls, smallStepsLockToggleButton, resetAllButton, deviceConnectionParentNode ];
    this.setScreenSummaryContent( new QuadrilateralScreenSummaryContentNode() );

    // voicing
    // Disabling eslint here because this variable is not used but I am sure that it will be soon.
    const quadrilateralAlerter = new QuadrilateralAlerter( model, this, modelViewTransform, this.quadrilateralDescriber ); // eslint-disable-line @typescript-eslint/no-unused-vars
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
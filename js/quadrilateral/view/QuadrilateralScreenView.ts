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
import QuadrilateralSoundView from './QuadrilateralSoundView.js';
import SideDemonstrationNode from './SideDemonstrationNode.js';
import VertexDragAreaNode from './VertexDragAreaNode.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import QuadrilateralDescriber from './QuadrilateralDescriber.js';
import QuadrilateralAlerter from './QuadrilateralAlerter.js';
import Dialog from '../../../../sun/js/Dialog.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CalibrationContentNode from './CalibrationContentNode.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import QuadrilateralModelValuePanel from './QuadrilateralModelValuePanel.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SideLengthAreaNode from './SideLengthAreaNode.js';
import QuadrilateralMarkerInput from './QuadrilateralMarkerInput.js';
import QuadrilateralVisibilityControls from './QuadrilateralVisibilityControls.js';

const MODEL_BOUNDS = QuadrilateralQueryParameters.calibrationDemoDevice ? new Bounds2( -4.5, -4.5, 4.5, 4.5 ) :
                     new Bounds2( -1, -1, 1, 1 );

class QuadrilateralScreenView extends ScreenView {
  private readonly model: QuadrilateralModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly quadrilateralNode: QuadrilateralNode | null;
  private readonly demonstrationNode: SideDemonstrationNode | null;
  private readonly quadrilateralSoundView: QuadrilateralSoundView | null;
  private readonly quadrilateralDescriber: QuadrilateralDescriber;
  private readonly quadrilateralAlerter: QuadrilateralAlerter;
  private readonly resetAllButton: ResetAllButton;
  private readonly quadrilateralMarkerInput: QuadrilateralMarkerInput | null;

  public constructor( model: QuadrilateralModel, soundOptionsModel: QuadrilateralSoundOptionsModel, tandem: Tandem ) {
    super( {

      // phet-io
      tandem: tandem
    } );

    const visibilityControls = new QuadrilateralVisibilityControls( model.cornerLabelsVisibleProperty, model.angleGuideVisibleProperty, {
      rightCenter: this.layoutBounds.rightCenter.minusXY( QuadrilateralConstants.SCREEN_VIEW_X_MARGIN, 0 )
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

    // the model bounds are defined by available view space. Some padding is added around the screen and we make
    // sure that the vertices cannot overlap with simulation controls (at this time, just the ResetAllButton).
    // Otherwise the quadrilateral can move around freely in the play area.
    let reducedViewBounds = this.layoutBounds.eroded( QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN );
    reducedViewBounds = reducedViewBounds.withMaxX( this.resetAllButton.left - QuadrilateralConstants.SCREEN_VIEW_X_MARGIN );

    const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      MODEL_BOUNDS,

      // A square in view space such that -1 is at the top and 1 is at the bottom. View space layout bounds are
      // wider than they are all so available model boundds will have a width GREATER than MODEL_BOUNDS.width
      new Bounds2(
        reducedViewBounds.centerX - reducedViewBounds.height / 2,
        reducedViewBounds.top,
        reducedViewBounds.centerX + reducedViewBounds.height / 2,
        reducedViewBounds.height
      )
    );

    this.model = model;
    this.modelViewTransform = modelViewTransform;

    // The available model bounds are determined by the size of the view
    model.modelBoundsProperty.value = this.modelViewTransform.viewToModelBounds( reducedViewBounds );

    const shapeModel = model.quadrilateralShapeModel;

    // Responsible for generating descriptions of the state of the quadrilateral for accessibility.
    this.quadrilateralDescriber = new QuadrilateralDescriber( model.quadrilateralShapeModel );

    // Responsible for alerting updates about the changing simulation in real-time.
    this.quadrilateralAlerter = new QuadrilateralAlerter( model, this.quadrilateralDescriber );

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

    // Rectangle showing available model bounds, requested in https://github.com/phetsims/quadrilateral/issues/49.
    // Rounded corners to look nice, but actual model bounds are pure Bounds2.
    const playAreaViewBounds = modelViewTransform.modelToViewBounds( this.model.modelBoundsProperty.value );
    const boundsRectangle = new Rectangle( playAreaViewBounds, 5, 5, { stroke: 'white', lineWidth: 2 } );
    this.addChild( boundsRectangle );

    if ( QuadrilateralQueryParameters.showDragAreas ) {
      this.addChild( new VertexDragAreaNode( shapeModel.vertex1, [ shapeModel.leftSide, shapeModel.topSide ], modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( shapeModel.vertex2, [ shapeModel.topSide, shapeModel.rightSide ], modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( shapeModel.vertex3, [ shapeModel.rightSide, shapeModel.bottomSide ], modelViewTransform ) );
      this.addChild( new VertexDragAreaNode( shapeModel.vertex4, [ shapeModel.bottomSide, shapeModel.leftSide ], modelViewTransform ) );
    }
    if ( QuadrilateralQueryParameters.showLengthAreas ) {
      this.addChild( new SideLengthAreaNode( shapeModel, shapeModel.topSide, shapeModel.bottomSide, shapeModel.leftSide, modelViewTransform ) );
      this.addChild( new SideLengthAreaNode( shapeModel, shapeModel.rightSide, shapeModel.leftSide, shapeModel.topSide, modelViewTransform, { drawRotation: -Math.PI / 2 } ) );
      this.addChild( new SideLengthAreaNode( shapeModel, shapeModel.bottomSide, shapeModel.topSide, shapeModel.rightSide, modelViewTransform, { drawRotation: Math.PI } ) );
      this.addChild( new SideLengthAreaNode( shapeModel, shapeModel.leftSide, shapeModel.rightSide, shapeModel.bottomSide, modelViewTransform, { drawRotation: Math.PI / 2 } ) );
    }

    this.quadrilateralMarkerInput = null;
    if ( QuadrilateralQueryParameters.markerInput ) {
      this.quadrilateralMarkerInput = new QuadrilateralMarkerInput( model.rotationMarkerDetectedProperty, model.markerRotationProperty );

      // If we are NOT connected to a device, rotate the quadrilateral shape from the marker rotation.
      // If we are connected to a device the rotation will be applied for us when we set from device data.
      if ( !QuadrilateralQueryParameters.deviceConnection ) {
        model.markerRotationProperty.lazyLink( rotation => {
          model.quadrilateralShapeModel.setPositionsFromLengthsAndAngles(
            model.quadrilateralShapeModel.topSide.lengthProperty.value,
            model.quadrilateralShapeModel.rightSide.lengthProperty.value,
            model.quadrilateralShapeModel.leftSide.lengthProperty.value,
            model.quadrilateralShapeModel.vertex1.angleProperty!.value,
            model.quadrilateralShapeModel.vertex2.angleProperty!.value,
            model.quadrilateralShapeModel.vertex3.angleProperty!.value,
            model.quadrilateralShapeModel.vertex4.angleProperty!.value
          );
        } );
      }
    }

    if ( QuadrilateralQueryParameters.deviceConnection && !QuadrilateralQueryParameters.calibrationDemoDevice ) {

      // Add a Dialog that will calibrate the device to the simulation (mapping physical data to modelled data).
      const calibrationDialog = new Dialog( new CalibrationContentNode( model ), {
        title: new Text( 'Calibrate with device', {
          font: new PhetFont( { size: 36 } )
        } )
      } );

      calibrationDialog.isShowingProperty.link( ( isShowing, wasShowing ) => {
        model.isCalibratingProperty.value = isShowing;

        if ( !isShowing && wasShowing !== null ) {
          const physicalModelBounds = model.physicalModelBoundsProperty.value;

          // it is possible that the Dialog was closed without getting good values for the bounds, only set
          // positions if all is well
          if ( physicalModelBounds && physicalModelBounds.isValid() ) {
            shapeModel.setPositionsFromLengthAndAngleData(
              physicalModelBounds!.width,
              physicalModelBounds!.width,
              physicalModelBounds!.width,
              physicalModelBounds!.width,
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

        textNodeOptions: {
          font: new PhetFont( { size: 36 } )
        },
        baseColor: PhetColorScheme.BUTTON_YELLOW,

        // position is relative to the ResetAllButton for now
        rightBottom: this.resetAllButton.rightTop.minusXY( 0, 15 )
      } );

      this.addChild( calibrationButton );
    }

    // A panel that displays model values, useful for debugging.
    const debugValuesPanel = new QuadrilateralModelValuePanel( model, {
      leftTop: new Vector2( QuadrilateralConstants.SCREEN_VIEW_X_MARGIN, QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN )
    } );
    this.addChild( debugValuesPanel );
    model.showDebugValuesProperty.link( showValues => {
      debugValuesPanel.visible = showValues;
    } );

    if ( QuadrilateralQueryParameters.showModelValues ) {
      this.addChild( new QuadrilateralModelValuePanel( model, {
        leftTop: new Vector2( QuadrilateralConstants.SCREEN_VIEW_X_MARGIN, QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN )
      } ) );
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
    if ( this.quadrilateralMarkerInput ) {
      this.quadrilateralMarkerInput.step( dt );
    }

    this.quadrilateralAlerter.step( dt );
  }
}

quadrilateral.register( 'QuadrilateralScreenView', QuadrilateralScreenView );
export default QuadrilateralScreenView;
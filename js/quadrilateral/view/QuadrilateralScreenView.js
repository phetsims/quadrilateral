// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';
import CalibrationContentNode from './CalibrationContentNode.js';
import QuadrilateralNode from './QuadrilateralNode.js';
import QuadrilateralSoundView from './QuadrilateralSoundView.js';
import SideDemonstrationNode from './SideDemonstrationNode.js';

class QuadrilateralScreenView extends ScreenView {

  /**
   * @param {QuadrilateralModel} model
   * @param {QuadrilateralSoundOptionsModel} soundOptionsModel
   * @param {Object} [options]
   */
  constructor( model, soundOptionsModel, options ) {
    assert && assert( model instanceof QuadrilateralModel, 'invalid model' );

    options = merge( {

      // {boolean} - If true, the Sim (!!) is modified to not look like a PhET sim for demonstration
      // purposes
      calibrationDemoDevice: false,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // the model bounds may or may not be centered (especially when using ?calibrationDemoDevice), but we want
    // the model origin (0, 0) to be in the center of the ScreenView
    const viewHeight = this.layoutBounds.height - 2 * QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN;
    const modelViewTransform = ModelViewTransform.createRectangleInvertedYMapping(
      QuadrilateralModel.MODEL_BOUNDS,
      new Bounds2(
        this.layoutBounds.centerX - viewHeight / 2,
        QuadrilateralConstants.SCREEN_VIEW_Y_MARGIN,
        this.layoutBounds.centerX + viewHeight / 2,
        viewHeight
      )
    );

    this.quadrilateralNode = null;

    if ( QuadrilateralQueryParameters.rightSide || QuadrilateralQueryParameters.leftSide ||
         QuadrilateralQueryParameters.topSide || QuadrilateralQueryParameters.bottomSide ) {
      this.demonstrationNode = new SideDemonstrationNode( model, modelViewTransform, this.layoutBounds, soundOptionsModel );
      this.addChild( this.demonstrationNode );
    }
    else {
      this.quadrilateralNode = new QuadrilateralNode( model, modelViewTransform, this.layoutBounds, {
        tandem: options.tandem.createTandem( 'quadrilateralNode' )
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
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // if in the calibration demo and we are pretending to be a device, make some modifications to the sim
    // so that it doesn't look like a sim and add some additional "device" data to the view
    if ( QuadrilateralQueryParameters.calibrationDemoDevice ) {
      resetAllButton.visible = false;
      phet.joist.sim.navigationBar.visible = false;

      // add text displaying the data provided by the device
      const labelOptions = { font: new PhetFont( { size: 24 } ) };
      const topSideText = new Text( '', labelOptions );
      const rightSideText = new Text( '', labelOptions );
      const bottomSideText = new Text( '', labelOptions );
      const leftSideText = new Text( '', labelOptions );

      const labelsVBox = new VBox( {
        children: [ topSideText, rightSideText, bottomSideText, leftSideText ],
        spacing: 15,
        align: 'left'
      } );
      this.addChild( labelsVBox );

      const formatLengthText = ( label, lengthValue ) => {
        return `${label}: ${Utils.toFixed( lengthValue, 2 )}`;
      };

      model.topSide.lengthProperty.link( length => {
        topSideText.text = formatLengthText( 'Top Side', length );
      } );
      model.rightSide.lengthProperty.link( length => {
        rightSideText.text = formatLengthText( 'Right Side', length );
      } );
      model.bottomSide.lengthProperty.link( length => {
        bottomSideText.text = formatLengthText( 'Bottom Side', length );
      } );
      model.leftSide.lengthProperty.link( length => {
        leftSideText.text = formatLengthText( 'Left Side', length );
      } );
    }
    else {

      const calibrationDialog = new Dialog( new CalibrationContentNode( model ), {
        title: new Text( 'Calibrate with device', {
          font: new PhetFont( { size: 36 } )
        } )
      } );

      calibrationDialog.isShowingProperty.link( ( isShowing, wasShowing ) => {
        model.isCalibratingProperty.value = isShowing;

        if ( !isShowing && wasShowing !== null ) {

          const physicalModelBounds = model.physicalModelBoundsProperty.value;
          model.setPositionsFromLengthAndAngleData(
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
        rightBottom: resetAllButton.rightTop.minusXY( 0, 15 )
      } );

      this.addChild( calibrationButton );
    }
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView.
   * @public
   *
   * @returns {string}
   */
  getVoicingOverviewContent() {
    return 'Please implement getVoicingOverviewContent';
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView.
   * @public
   *
   * @returns {string}
   */
  getVoicingDetailsContent() {
    return 'Please implement getVoicingDetailsContent';
  }

  /**
   * Get the content that is spoken from the Voicing toolbar to describe this ScreenView.
   * @public
   *
   * @returns {string}
   */
  getVoicingHintContent() {
    return 'Please implement getVoicingHintContent';
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    if ( this.quadrilateralSoundView ) {
      this.quadrilateralSoundView.step( dt );
    }
    if ( this.demonstrationNode ) {
      this.demonstrationNode.step( dt );
    }
  }

  /**
   * @public
   * @override
   * @param viewBounds
   */
  layout( viewBounds ) {
    super.layout( viewBounds );

    this.quadrilateralNode && this.quadrilateralNode.layout( this.layoutBounds );
  }
}

quadrilateral.register( 'QuadrilateralScreenView', QuadrilateralScreenView );
export default QuadrilateralScreenView;
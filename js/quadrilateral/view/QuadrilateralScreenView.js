// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Plane from '../../../../scenery/js/nodes/Plane.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralNode from './QuadrilateralNode.js';

class QuadrilateralScreenView extends ScreenView {

  /**
   * @param {QuadrilateralModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof QuadrilateralModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

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

    const quadrilateralNode = new QuadrilateralNode( model, modelViewTransform, {
      tandem: tandem.createTandem( 'quadrilateralNode' )
    } );
    this.addChild( quadrilateralNode );

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

    // We are attempting to develop this simulation without any graphical design at first,
    // this plane will hide everything
    const plane = new Plane( { fill: 'darkblue', pickable: false } );
    this.addChild( plane );
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
    //TODO
  }
}

quadrilateral.register( 'QuadrilateralScreenView', QuadrilateralScreenView );
export default QuadrilateralScreenView;
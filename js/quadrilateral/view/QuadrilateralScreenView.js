// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import voicingUtteranceQueue from '../../../../scenery/js/accessibility/voicing/voicingUtteranceQueue.js';
import Plane from '../../../../scenery/js/nodes/Plane.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import VertexNode from './VertexNode.js';

// constants
const vertex1String = quadrilateralStrings.a11y.voicing.vertex1;
const vertex2String = quadrilateralStrings.a11y.voicing.vertex2;
const vertex3String = quadrilateralStrings.a11y.voicing.vertex3;
const vertex4String = quadrilateralStrings.a11y.voicing.vertex4;

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

    const vertexNode1 = new VertexNode( model.vertex1, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex1String,

      // phet-io
      tandem: tandem.createTandem( 'vertex1Node' )
    } );
    const vertexNode2 = new VertexNode( model.vertex2, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex2String,

      // phet-io
      tandem: tandem.createTandem( 'vertex2Node' )
    } );
    const vertexNode3 = new VertexNode( model.vertex3, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex3String,

      // phet-io
      tandem: tandem.createTandem( 'vertex3Node' )
    } );
    const vertexNode4 = new VertexNode( model.vertex4, modelViewTransform, {

      // voicing
      voicingNameResponse: vertex4String,

      // phet-io
      tandem: tandem.createTandem( 'vertex4Node' )
    } );

    this.addChild( vertexNode1 );
    this.addChild( vertexNode2 );
    this.addChild( vertexNode3 );
    this.addChild( vertexNode4 );

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

    // listeners
    model.isParallelogramProperty.lazyLink( isParallelogram => {
      const alertString = isParallelogram ? 'You made a parallelogram!' : 'Not a parallelogram';
      voicingUtteranceQueue.addToBack( alertString );
    } );
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
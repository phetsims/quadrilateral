// Copyright 2021, University of Colorado Boulder

/**
 * File responsible for the sound view of the quadrilateral.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import SideSoundView from './SideSoundView.js';


// constants

class QuadrilateralSoundView {

  /**
   * @param {QuadrilateralModel} model
   */
  constructor( model ) {

    this.topSideSoundView = new SideSoundView( model.topSide );
    this.rightSideSoundView = new SideSoundView( model.rightSide );
    this.bottomSideSoundView = new SideSoundView( model.bottomSide );
    this.leftSideSoundView = new SideSoundView( model.leftSide );

    model.shapeChangedEmitter.addListener( () => {
      this.topSideSoundView.startPlayingSounds();
      this.rightSideSoundView.startPlayingSounds();
      this.bottomSideSoundView.startPlayingSounds();
      this.leftSideSoundView.startPlayingSounds();
    } );
  }

  /**
   * Step the sound view, playing sounds for their allotted time.
   * @public
   * @param dt
   */
  step( dt ) {
    this.topSideSoundView.step( dt );
    this.rightSideSoundView.step( dt );
    this.bottomSideSoundView.step( dt );
    this.leftSideSoundView.step( dt );
  }
}

quadrilateral.register( 'QuadrilateralSoundView', QuadrilateralSoundView );
export default QuadrilateralSoundView;

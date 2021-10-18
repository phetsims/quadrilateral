// Copyright 2021, University of Colorado Boulder

/**
 * A class that implements the "Quartet" sound design for the quadrilateral. In this design all four sides
 * are playing a sound at the same time that represents their tilt and length. When the quadrilateral is in
 * an interesting shape, the sounds will align and the sound will be pleasing. When the four sides are in
 * random configurations there will be dissonance.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuartetSideSoundView from './QuartetSideSoundView.js';

class QuartetSoundView {

  /**
   * @param {QuadrilateralModel} model
   * @param {QuadrilateralSoundOptionsModel} soundOptionsModel
   */
  constructor( model, soundOptionsModel ) {

    this.topSideSoundView = new QuartetSideSoundView( model.topSide, soundOptionsModel.baseSoundFileProperty );
    this.rightSideSoundView = new QuartetSideSoundView( model.rightSide, soundOptionsModel.baseSoundFileProperty );
    this.bottomSideSoundView = new QuartetSideSoundView( model.bottomSide, soundOptionsModel.baseSoundFileProperty );
    this.leftSideSoundView = new QuartetSideSoundView( model.leftSide, soundOptionsModel.baseSoundFileProperty );

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
   *
   * @param {number} dt - in seconds
   */
  step( dt ) {
    this.topSideSoundView.step( dt );
    this.rightSideSoundView.step( dt );
    this.bottomSideSoundView.step( dt );
    this.leftSideSoundView.step( dt );
  }
}

quadrilateral.register( 'QuartetSoundView', QuartetSoundView );
export default QuartetSoundView;

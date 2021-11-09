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
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import QuadrilateralSoundOptionsModel from '../model/QuadrilateralSoundOptionsModel.js';

class QuartetSoundView {
  private readonly topSideSoundView: QuartetSideSoundView;
  private readonly rightSideSoundView: QuartetSideSoundView;
  private readonly bottomSideSoundView: QuartetSideSoundView;
  private readonly leftSideSoundView: QuartetSideSoundView;
  private readonly disposeQuartetSoundView: () => void;

  public constructor( model: QuadrilateralModel, soundOptionsModel: QuadrilateralSoundOptionsModel ) {

    this.topSideSoundView = new QuartetSideSoundView( model.topSide, model.resetNotInProgressProperty, soundOptionsModel.baseSoundFileProperty );
    this.rightSideSoundView = new QuartetSideSoundView( model.rightSide, model.resetNotInProgressProperty, soundOptionsModel.baseSoundFileProperty );
    this.bottomSideSoundView = new QuartetSideSoundView( model.bottomSide, model.resetNotInProgressProperty, soundOptionsModel.baseSoundFileProperty );
    this.leftSideSoundView = new QuartetSideSoundView( model.leftSide, model.resetNotInProgressProperty, soundOptionsModel.baseSoundFileProperty );

    // starts playing sounds whenever the shape changes - references for removal on dispose
    const shapeChangeListener = () => {
      this.topSideSoundView.startPlayingSounds();
      this.rightSideSoundView.startPlayingSounds();
      this.bottomSideSoundView.startPlayingSounds();
      this.leftSideSoundView.startPlayingSounds();
    };
    model.shapeChangedEmitter.addListener( shapeChangeListener );

    this.disposeQuartetSoundView = () => {
      model.shapeChangedEmitter.removeListener( shapeChangeListener );
    };
  }

  public dispose(): void {
    this.topSideSoundView.dispose();
    this.rightSideSoundView.dispose();
    this.bottomSideSoundView.dispose();
    this.leftSideSoundView.dispose();

    this.disposeQuartetSoundView();
  }

  /**
   * Step the sound view, playing sounds for their allotted time.
   * @public
   */
  public step( dt: number ): void {
    this.topSideSoundView.step( dt );
    this.rightSideSoundView.step( dt );
    this.bottomSideSoundView.step( dt );
    this.leftSideSoundView.step( dt );
  }
}

quadrilateral.register( 'QuartetSoundView', QuartetSoundView );
export default QuartetSoundView;

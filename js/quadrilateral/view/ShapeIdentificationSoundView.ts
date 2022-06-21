// Copyright 2022, University of Colorado Boulder

/**
 * The sound view that plays sounds when the quadrilateral becomes a uniquely named shape
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import quadrilateral from '../../quadrilateral.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import shapeIdentificationWhenNotAParallelogram_mp3 from '../../../sounds/shapeIdentificationWhenNotAParallelogram_mp3.js';
import allAnglesAreRightAngles_mp3 from '../../../sounds/allAnglesAreRightAngles_mp3.js';
import allSideLengthsAreEqual_mp3 from '../../../sounds/allSideLengthsAreEqual_mp3.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import IProperty from '../../../../axon/js/IProperty.js';

class ShapeIdentificationSoundView {
  private readonly shapeSoundClip: SoundClip;
  private readonly allRightAnglesSoundClip: SoundClip;
  private readonly allLengthsEqualSoundClip: SoundClip;

  public constructor( shapeModel: QuadrilateralShapeModel, resetNotInProgressProperty: IReadOnlyProperty<boolean>, shapeIdentificationEnabledProperty: IProperty<boolean> ) {

    const soundClipOptions = {
      // don't play sounds while model reset is in progress
      enableControlProperties: [ resetNotInProgressProperty ]
    };

    this.shapeSoundClip = new SoundClip( shapeIdentificationWhenNotAParallelogram_mp3, soundClipOptions );
    soundManager.addSoundGenerator( this.shapeSoundClip );

    this.allRightAnglesSoundClip = new SoundClip( allAnglesAreRightAngles_mp3, soundClipOptions );
    soundManager.addSoundGenerator( this.allRightAnglesSoundClip );

    this.allLengthsEqualSoundClip = new SoundClip( allSideLengthsAreEqual_mp3, soundClipOptions );
    soundManager.addSoundGenerator( this.allLengthsEqualSoundClip );

    // lazy, don't play on startup
    shapeModel.shapeNameProperty.lazyLink( ( name, oldName ) => {

      // Generic indication that we have achieved a new named shape other some special shapes like square/rhombus.
      // If the shape is a parallelogram prevent sounds, there are other parallelogram sounds that are more important.
      // This feedback is only provided if shape identification is enabled.
      if ( !shapeModel.isParallelogramProperty.value && name && shapeIdentificationEnabledProperty.value ) {

        // Design request that this sound should not play when it is a concave shape. See
        // https://github.com/phetsims/quadrilateral/issues/57
        if ( name !== NamedQuadrilateral.CONCAVE ) {
          this.shapeSoundClip.play();
        }
      }
    } );

    // Unique sound that should play when all angles are right.
    shapeModel.allAnglesRightProperty.lazyLink( allAnglesRight => {
      if ( allAnglesRight ) {
        this.allRightAnglesSoundClip.play();
      }
    } );

    // Unique sound that should play when all lengths are equal.
    shapeModel.allLengthsEqualProperty.lazyLink( allLengthsEqual => {
      if ( allLengthsEqual ) {
        this.allLengthsEqualSoundClip.play();
      }
    } );
  }

  /**
   * Dispose the sound clip so that a new one can be created, and this view stops playing this sound
   */
  public dispose(): void {
    this.shapeSoundClip.dispose();
  }
}

quadrilateral.register( 'ShapeIdentificationSoundView', ShapeIdentificationSoundView );
export default ShapeIdentificationSoundView;

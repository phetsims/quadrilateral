// Copyright 2022, University of Colorado Boulder

/**
 * The sound view that plays sounds when the quadrilateral becomes a uniquely named shape
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import quadrilateral from '../../quadrilateral.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import shapeIdentificationWhenNotAParallelogram_mp3 from '../../../sounds/shapeIdentificationWhenNotAParallelogram_mp3.js';
import allAnglesAreRightAngles_mp3 from '../../../sounds/allAnglesAreRightAngles_mp3.js';
import allSideLengthsAreEqual_mp3 from '../../../sounds/allSideLengthsAreEqual_mp3.js';

class ShapeIdentificationSoundView {
  private readonly shapeSoundClip: SoundClip;
  private readonly allRightAnglesSoundClip: SoundClip;
  private readonly allLengthsEqualSoundClip: SoundClip;

  constructor( isParallelogramProperty: IReadOnlyProperty<boolean>, shapeNameProperty: Property<NamedQuadrilateral | null> ) {

    this.shapeSoundClip = new SoundClip( shapeIdentificationWhenNotAParallelogram_mp3 );
    soundManager.addSoundGenerator( this.shapeSoundClip );

    this.allRightAnglesSoundClip = new SoundClip( allAnglesAreRightAngles_mp3 );
    soundManager.addSoundGenerator( this.allRightAnglesSoundClip );

    this.allLengthsEqualSoundClip = new SoundClip( allSideLengthsAreEqual_mp3 );
    soundManager.addSoundGenerator( this.allLengthsEqualSoundClip );

    shapeNameProperty.link( name => {

      // Generic indication that we have achieved a new named shape other some special shapes like square/rhombus.
      // If the shape is a parallelogram prevent sounds, there are other parallelogram sounds that are more important
      if ( !isParallelogramProperty.value && name ) {

        // Design request that this sound should not play when it is a concave shape. See
        // https://github.com/phetsims/quadrilateral/issues/57
        if ( name !== NamedQuadrilateral.CONCAVE ) {
          this.shapeSoundClip.play();
        }
      }
      else {

        // Unique sounds indicating that all angles ore lengths are equal. We do this when we achieve the appropriate
        // shapes so that these sounds match the shape detection of the model. If we linked this to angle or length
        // values, we may encounter cases where a sound is played indicating that all angles are the same but
        // the model is also not a square/rectangle because of tolerance values in the calculations.
        if ( name === NamedQuadrilateral.RECTANGLE ) {

          // a unique sound indicating that all angles are the same
          this.allRightAnglesSoundClip.play();

        }
        else if ( name === NamedQuadrilateral.RHOMBUS ) {

          // a unique sound indicating all lengths are the same
          this.allLengthsEqualSoundClip.play();
        }
        else if ( name === NamedQuadrilateral.SQUARE ) {

          // both angles and lengths are all the same
          this.allRightAnglesSoundClip.play();
          this.allLengthsEqualSoundClip.play();
        }
      }
    } );
  }

  /**
   * Dispose the sound clip so that a new one can be created, and this view stops playing this sound
   */
  public dispose() {
    this.shapeSoundClip.dispose();
  }
}

quadrilateral.register( 'ShapeIdentificationSoundView', ShapeIdentificationSoundView );
export default ShapeIdentificationSoundView;

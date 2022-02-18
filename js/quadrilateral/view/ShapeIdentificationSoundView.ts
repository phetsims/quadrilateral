// Copyright 2022, University of Colorado Boulder

/**
 * The sound view that plays sounds when the quadrilateral becomes a new named shape, but is
 * not a parallelogram. There are unique sounds when the shape becomes a parallelogram.
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

class ShapeIdentificationSoundView {
  private readonly shapeSoundClip: SoundClip;

  constructor( isParallelogramProperty: IReadOnlyProperty<boolean>, shapeNameProperty: Property<NamedQuadrilateral | null> ) {

    this.shapeSoundClip = new SoundClip( shapeIdentificationWhenNotAParallelogram_mp3 );
    soundManager.addSoundGenerator( this.shapeSoundClip );

    shapeNameProperty.link( name => {
      if ( !isParallelogramProperty.value && name ) {
        this.shapeSoundClip.play();
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

// Copyright 2021, University of Colorado Boulder

/**
 * A singleton for Quadrilateral that controls the base sound file representing state of one of the sides
 * of the quadrilateral. Values of the Enumeration will eventually map to used sound files.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../axon/js/EnumerationProperty.js';
import Enumeration from '../../../phet-core/js/Enumeration.js';
import quadrilateral from '../quadrilateral.js';

const SoundFile = Enumeration.byKeys( [ 'ONE', 'TWO', 'THREE', 'FOUR' ] );

class SoundFileProperty extends EnumerationProperty {

  /**
   * @param {Enumeration} enumeration
   * @param {*}defaultValue - initial value for the enumeration
   */
  constructor( enumeration, defaultValue ) {
    super( enumeration, defaultValue );
  }
}

const soundFileProperty = new SoundFileProperty( SoundFile, SoundFile.TWO );
quadrilateral.register( 'soundFileProperty', soundFileProperty );
export default soundFileProperty;

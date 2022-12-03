// Copyright 2022, University of Colorado Boulder

/**
 * A temporary sound board that will help design the output levels for each audio track.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { VBox } from '../../../../../scenery/js/imports.js';
import quadrilateral from '../../../quadrilateral.js';
import QuadrilateralSoundView from './QuadrilateralSoundView.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import NumberControl from '../../../../../scenery-phet/js/NumberControl.js';
import QuadrilateralConstants from '../../../common/QuadrilateralConstants.js';

class QuadrilateralSoundBoardNode extends VBox {
  public constructor( soundView: QuadrilateralSoundView ) {
    super();

    const numberControls: NumberControl[] = [];

    const soundViewChangeListener = () => {
      numberControls.forEach( numberControl => {
        this.removeChild( numberControl );
        numberControl.dispose();
      } );
      numberControls.length = 0;

      assert && assert( soundView.activeSoundView, 'Need an active sound view for output level Properties' );
      soundView.activeSoundView!.indexToOutputLevelPropertyMap.forEach( ( value, key ) => {
        assert && assert( value.range, 'output level Property needs a defined range' );
        const outputLevelSlider = new NumberControl( `Track ${key}`, value, value.range, {
          layoutFunction: NumberControl.createLayoutFunction4(),
          delta: 0.01,
          titleNodeOptions: QuadrilateralConstants.PANEL_LABEL_TEXT_OPTIONS,
          numberDisplayOptions: {
            decimalPlaces: 2
          },
          tandem: Tandem.OPT_OUT
        } );
        numberControls.push( outputLevelSlider );
      } );

      this.children = numberControls;
    };
    soundView.soundViewChangedEmitter.addListener( soundViewChangeListener );

    // initial setup
    soundViewChangeListener();
  }
}

quadrilateral.register( 'QuadrilateralSoundBoardNode', QuadrilateralSoundBoardNode );
export default QuadrilateralSoundBoardNode;

// Copyright 2023, University of Colorado Boulder

/**
 * A superclass for movable components of the QuadrilateralNode. Namely, VertexNode and SideNode.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import { KeyboardListener, Node, NodeOptions, Voicing, VoicingOptions } from '../../../../scenery/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import QuadrilateralMovable from '../model/QuadrilateralMovable.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';
import soundManager from '../../../../tambo/js/soundManager.js';

type SelfOptions = {

  // a11y - name of this component for both PDOM and Voicing
  nameResponse?: null | string;

  // sound - sound to play when the movable becomes grabbed
  grabbedSound: WrappedAudioBuffer;
  grabbedSoundOutputLevel?: number;
};

type ParentOptions = VoicingOptions & NodeOptions;

// VertexNode sets these properties explicitly from the nameResponse option
export type QuadrilateralMovableNodeOptions = SelfOptions & StrictOmit<ParentOptions, 'voicingNameResponse' | 'innerContent'> & PickRequired<NodeOptions, 'tandem'>;

class QuadrilateralMovableNode extends Voicing( Node ) {
  private readonly model: QuadrilateralMovable;

  public constructor( model: QuadrilateralMovable, providedOptions: QuadrilateralMovableNodeOptions ) {
    const options = optionize<QuadrilateralMovableNodeOptions, SelfOptions, ParentOptions>()( {
      cursor: 'pointer',
      tagName: 'div',
      ariaRole: 'application',
      focusable: true,
      nameResponse: null,
      grabbedSoundOutputLevel: 0.6
    }, providedOptions );

    super( options );
    this.model = model;

    this.voicingNameResponse = options.nameResponse;
    this.innerContent = options.nameResponse;

    this.addInputListener( {
      focus: () => {
        this.model.isPressedProperty.value = true;
      },
      blur: () => {
        this.model.isPressedProperty.value = false;
      }
    } );

    // Voicing - speak all content about this component when you press enter or spacebar
    this.addInputListener( new KeyboardListener( {
      keys: [ 'enter', 'space' ],
      callback: ( event, listener ) => {
        this.voicingSpeakFullResponse();
      }
    } ) );

    // Sound - the grab sound is played on press but there is no release sound for this component since there is
    // no behavioral relevance to the release. The 'release' sound is used instead of 'grab' to distinguish sides
    // from vertices
    const pressedSoundPlayer = new SoundClip( providedOptions.grabbedSound, {
      initialOutputLevel: options.grabbedSoundOutputLevel
    } );
    soundManager.addSoundGenerator( pressedSoundPlayer );
    model.isPressedProperty.lazyLink( isPressed => {
      if ( isPressed ) {
        pressedSoundPlayer.play();
      }
    } );
  }

  /**
   * Update Properties in response to input indicating that the component was blocked from moving for some reason.
   */
  public updateBlockedState( isBlockedByShape: boolean, isBlockedByBounds: boolean ): void {
    this.model.movementBlockedByShapeProperty.value = isBlockedByShape;
    this.model.movementBlockedByBoundsProperty.value = isBlockedByBounds;
  }
}

quadrilateral.register( 'QuadrilateralMovableNode', QuadrilateralMovableNode );
export default QuadrilateralMovableNode;

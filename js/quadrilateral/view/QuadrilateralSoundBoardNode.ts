// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import RectangularMomentaryButton from '../../../../sun/js/buttons/RectangularMomentaryButton.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import { HBox, Node, Path, Text, VBox } from '../../../../scenery/js/imports.js';

import allAnglesAreRightAngles_mp3 from '../../../sounds/allAnglesAreRightAngles_mp3.js';
import allSideLengthsAreEqual_mp3 from '../../../sounds/allSideLengthsAreEqual_mp3.js';
import quadIntoParallel001_mp3 from '../../../sounds/quadIntoParallel001_mp3.js';
import quadOutOfParallel001_mp3 from '../../../sounds/quadOutOfParallel001_mp3.js';
import quadMovingInParallelSuccessLoop001_wav from '../../../sounds/quadMovingInParallelSuccessLoop001_wav.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PlayIconShape from '../../../../scenery-phet/js/PlayIconShape.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';

const allRightAnglesString = quadrilateralStrings.a11y.voicing.allRightAngles;
const allSidesEqualString = quadrilateralStrings.a11y.voicing.allSidesEqual;
const foundAParallelogramString = quadrilateralStrings.a11y.voicing.foundAParallelogram;
const lostYourParallelogramString = quadrilateralStrings.a11y.voicing.lostYourParallelogram;

const BUTTON_SPACING = 5;

// Press and hold vs push buttons for sounds
type ButtonType = 'momentary' | 'push';

class QuadrilateralSoundBoardNode extends Node {
  public constructor() {
    super();

    const maintenanceSoundClip = new SoundClip( quadMovingInParallelSuccessLoop001_wav, { loop: true } );
    soundManager.addSoundGenerator( maintenanceSoundClip );

    const inParallelSoundClip = new SoundClip( quadIntoParallel001_mp3 );
    soundManager.addSoundGenerator( inParallelSoundClip );

    const outOfParallelSoundClip = new SoundClip( quadOutOfParallel001_mp3 );
    soundManager.addSoundGenerator( outOfParallelSoundClip );

    const allRightAnglesSoundClip = new SoundClip( allAnglesAreRightAngles_mp3 );
    soundManager.addSoundGenerator( allRightAnglesSoundClip );

    const allLengthsEqualSoundClip = new SoundClip( allSideLengthsAreEqual_mp3 );
    soundManager.addSoundGenerator( allLengthsEqualSoundClip );

    const soundsLabel = new Text( 'Sounds', QuadrilateralConstants.PANEL_TITLE_TEXT_OPTIONS );

    const maintainParallelogramButton = new PlaySoundButton( 'Maintain (press-and-hold)', maintenanceSoundClip, 'momentary' );
    const foundParallelogramButton = new PlaySoundButton( 'Found Parallelogram', inParallelSoundClip, 'push' );
    const lostParallelogramButton = new PlaySoundButton( 'Lost Parallelogram', outOfParallelSoundClip, 'push' );
    const allRightAnglesButton = new PlaySoundButton( 'Right Angles', allRightAnglesSoundClip, 'push' );
    const sidesEqualAnglesButton = new PlaySoundButton( 'Sides Equal', allLengthsEqualSoundClip, 'push' );


    const voicingLabel = new Text( 'Voicing (enable in Preferences)', QuadrilateralConstants.PANEL_TITLE_TEXT_OPTIONS );

    const foundParallelogramVoicingButton = new PlayVoicingResponseButton( 'Found Parallelogram', foundAParallelogramString );
    const lostParallelogramVoicingButton = new PlayVoicingResponseButton( 'Lost parallelogram', lostYourParallelogramString );
    const allRightAnglesVoicingButton = new PlayVoicingResponseButton( 'Right Angles', allRightAnglesString );
    const sidesEqualVoicingButton = new PlayVoicingResponseButton( 'Sides Equal', allSidesEqualString );
    const inParallelTiltVoicingButton = new PlayVoicingResponseButton( 'In parallel tilting', 'Opposite sides tilt in parallel as opposite corners change equally.' );
    const outOfParallelTiltVoicingButton = new PlayVoicingResponseButton( 'Out of parallel tilting', 'All sides tilt away from parallel as opposite corners change unequally.' );
    const inParallelBiggerVoicingButton = new PlayVoicingResponseButton( 'In parallel bigger', 'Opposite sides in parallel as shape gets bigger.' );
    const inParallelSmallerVoicingButton = new PlayVoicingResponseButton( 'In parallel smaller', 'Opposite sides in parallel as shape gets smaller.' );

    const soundButtons = new VBox( {
      children: [ maintainParallelogramButton, foundParallelogramButton, lostParallelogramButton, allRightAnglesButton, sidesEqualAnglesButton ],
      align: 'right',
      spacing: BUTTON_SPACING
    } );

    const voicingButtons = new VBox( {
      children: [ foundParallelogramVoicingButton, lostParallelogramVoicingButton, allRightAnglesVoicingButton, sidesEqualVoicingButton, inParallelTiltVoicingButton, inParallelBiggerVoicingButton, inParallelSmallerVoicingButton, outOfParallelTiltVoicingButton ],
      align: 'right',
      spacing: BUTTON_SPACING
    } );

    const labelledSoundButtons = new VBox( { children: [ soundsLabel, soundButtons ], spacing: 10 } );
    const labelledVoicingButtons = new VBox( { children: [ voicingLabel, voicingButtons ], spacing: 10 } );

    const content = new HBox( {
      children: [ labelledSoundButtons, labelledVoicingButtons ],
      align: 'top',
      spacing: 15
    } );

    this.addChild( content );
  }
}

class PlayAudioButton extends HBox {
  public constructor( labelString: string, createButton: ( ( iconNode: Node ) => ButtonNode ) ) {
    const labelText = new Text( labelString, QuadrilateralConstants.PANEL_LABEL_TEXT_OPTIONS );


    const contentNode = new Path( new PlayIconShape( 15, 15 ), {
      fill: 'black',
      centerX: 5, // move to right slightly since we don't want it exactly centered
      centerY: 0
    } );

    const buttonNode = createButton( contentNode );

    super( {
      children: [ labelText, buttonNode ],
      spacing: 5
    } );

  }
}

class PlaySoundButton extends PlayAudioButton {
  public constructor( labelString: string, soundClip: SoundClip, buttonType: ButtonType ) {

    const createButtonNode = ( iconNode: Node ) => {
      let buttonNode;

      if ( buttonType === 'push' ) {
        buttonNode = new RectangularPushButton( {
          content: iconNode,
          soundPlayer: {
            play: () => {
              soundClip.play();
            },
            stop: () => {
              soundClip.stop();
            }
          }
        } );
      }
      else {

        const pressedProperty = new BooleanProperty( false );
        buttonNode = new RectangularMomentaryButton( pressedProperty, false, true, {
          content: iconNode
        } );

        pressedProperty.link( pressed => {
          if ( pressed ) {
            soundClip.play();
          }
          else {
            soundClip.stop();
          }
        } );
      }

      return buttonNode;
    };

    super( labelString, createButtonNode );
  }
}

class PlayVoicingResponseButton extends PlayAudioButton {
  public constructor( labelString: string, voicingResponse: string ) {

    const createButton = ( iconNode: Node ) => {
      const button = new RectangularPushButton( {
        content: iconNode,
        voicingObjectResponse: voicingResponse,
        listener: () => {
          button.voicingSpeakObjectResponse();
        }
      } );

      return button;
    };

    super( labelString, createButton );
  }
}

quadrilateral.register( 'QuadrilateralSoundBoardNode', QuadrilateralSoundBoardNode );
export default QuadrilateralSoundBoardNode;

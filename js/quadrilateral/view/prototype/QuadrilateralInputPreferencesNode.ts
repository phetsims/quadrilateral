// Copyright 2022-2023, University of Colorado Boulder

/**
 * Input Preferences specific to this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../../quadrilateral.js';
import NumberControl, { NumberControlOptions, NumberControlSliderOptions } from '../../../../../scenery-phet/js/NumberControl.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import optionize, { combineOptions } from '../../../../../phet-core/js/optionize.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import { Node, Text, VBox, VoicingRichText, VoicingRichTextOptions } from '../../../../../scenery/js/imports.js';
import PreferencesDialog from '../../../../../joist/js/preferences/PreferencesDialog.js';
import QuadrilateralTangibleOptionsModel from '../../model/prototype/QuadrilateralTangibleOptionsModel.js';
import MediaPipe from '../../../../../tangible/js/mediaPipe/MediaPipe.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';

// Strings for the content - this is a prototype so it is not translatable yet.
const mediaPipeFeatureDescriptionString = 'Use custom hand gestures and movements to control objects in the sim. Please see the Teacher Tips for specific gestures, movements, and object mappings.';
const tangibleNumberControlsDescriptionString = 'Use sliders to adjust the mapping and communication parameters between the simulation and BLE-enabled device to reduce noise-related jitter.';
const labelledDescriptionPatternStringProperty = JoistStrings.a11y.preferences.tabs.labelledDescriptionPatternStringProperty;
const deviceInputString = 'Device Input';

// Options reused for text that will NOT be translatable for now.
const NON_TRANSLATABLE_TEXT_OPTIONS = { lineWrap: 550, maxWidth: null };

// Types for options of inner classes
type TangiblePropertyNumberControlSelfOptions = {

  // A function that generates the object response string, in case the pattern is dependent on the value
  createObjectResponsePatternString?: ( value: number ) => string;

  // Voicing and PDOM both use the provided createObjectResponsePatternString option so this cannot be provided
  sliderOptions?: StrictOmit<NumberControlSliderOptions, 'a11yCreateAriaValueText'>;
};

type TangiblePropertyNumberControlOptions = TangiblePropertyNumberControlSelfOptions & NumberControlOptions;

export default class QuadrilateralInputPreferencesNode extends VBox {
  public constructor( tangibleOptionsModel: QuadrilateralTangibleOptionsModel ) {
    assert && assert(
      tangibleOptionsModel.cameraInputHandsConnectedProperty.value || tangibleOptionsModel.deviceConnectedProperty.value,
      'Some prototype connection required for these options'
    );

    // Components and functions that will be tailored to the type of connection controls available.
    let children: Node[];

    if ( tangibleOptionsModel.cameraInputHandsConnectedProperty.value ) {
      const mediaPipeContent = MediaPipe.getMediaPipeOptionsNode( {
        featureDescriptionString: mediaPipeFeatureDescriptionString,
        troubleshootingControlsVisible: false,

        // Disable maxWidth and default lineWrap so this dialog looks good in English (not translatable)
        labelTextOptions: { lineWrap: 550, maxWidth: null }
      } );
      children = [ mediaPipeContent ];
    }
    else {

      // Controls specifically for tangible connection
      const titleNode = new Text( deviceInputString, PreferencesDialog.PANEL_SECTION_LABEL_OPTIONS );
      const descriptionNode = new VoicingRichText( tangibleNumberControlsDescriptionString, combineOptions<VoicingRichTextOptions>(
        {}, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS, NON_TRANSLATABLE_TEXT_OPTIONS, {
          readingBlockNameResponse: StringUtils.fillIn( labelledDescriptionPatternStringProperty, {
            label: deviceInputString,
            description: tangibleNumberControlsDescriptionString
          } )
        } ) );
      const gridSpacingNumberControl = new TangiblePropertyNumberControl(
        'Step Mapping',
        'Adjust amount of input-device movement needed to make a step-change in simulation.',
        tangibleOptionsModel.deviceGridSpacingProperty, {
          numberDisplayOptions: {
            decimalPlaces: 4
          },
          createObjectResponsePatternString: value => '{{value}} model units'
        } );
      const smoothingLengthNumberControl = new TangiblePropertyNumberControl(
        'Smoothing Average',
        'Adjust number of values used to smooth noise in incoming sensor values from input device.',
        tangibleOptionsModel.smoothingLengthProperty, {
          createObjectResponsePatternString: value => value > 1 ? '{{value}} values' : '{{value}} value'
        }
      );
      const updateIntervalNumberControl = new TangiblePropertyNumberControl(
        'Update Interval',
        'Adjust length of time before a new value from input device is accepted and updated in simulation.',
        tangibleOptionsModel.bluetoothUpdateIntervalProperty, {
          numberDisplayOptions: {
            decimalPlaces: 2
          },
          delta: 0.1,
          createObjectResponsePatternString: value => value === 1 ? '{{value}} second' : '{{value}} seconds'
        }
      );

      children = [ titleNode, descriptionNode, gridSpacingNumberControl, smoothingLengthNumberControl, updateIntervalNumberControl ];
    }

    const content = new VBox( {
      children: children,
      align: 'left',
      spacing: PreferencesDialog.CONTENT_SPACING
    } );

    super( {
      children: [ content ],
      spacing: 0
    } );
  }
}

/**
 * Inner class, reusable NumberControl with default options for the purposes of this Preferences dialog content.
 */
class TangiblePropertyNumberControl extends VBox {
  public constructor( label: string, description: string, property: NumberProperty, providedOptions?: TangiblePropertyNumberControlOptions ) {
    const propertyRange = property.range;
    const minorTickSpacing = propertyRange.getLength() / 10;

    const options = optionize<TangiblePropertyNumberControlOptions, TangiblePropertyNumberControlSelfOptions, NumberControlOptions>()( {
      delta: propertyRange.min,
      titleNodeOptions: PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS,
      layoutFunction: NumberControl.createLayoutFunction1( { align: 'left' } ),
      sliderOptions: {
        minorTickSpacing: minorTickSpacing,
        minorTickStroke: 'black',
        majorTicks: [
          {
            value: propertyRange.min,
            label: new Text( propertyRange.min, { font: new PhetFont( 12 ) } )
          },
          {
            value: propertyRange.max,
            label: new Text( propertyRange.max, { font: new PhetFont( 12 ) } )
          }
        ],

        // voicing
        voicingNameResponse: label,
        voicingIgnoreVoicingManagerProperties: true,

        // pdom
        labelTagName: 'label',
        labelContent: label,
        keyboardStep: minorTickSpacing
      },

      // voicing
      createObjectResponsePatternString: value => '{{value}}',

      // opt out of tandems for these preferences because NumberControl requires phet.joist.sim and these
      // controls are created before the sim
      tandem: Tandem.OPT_OUT
    }, providedOptions );

    // Both Voicing and PDOM use the same object response pattern in this case
    options.sliderOptions.a11yCreateAriaValueText = value => StringUtils.fillIn( options.createObjectResponsePatternString( value ), { value: value } );

    const numberControl = new NumberControl( label, property, propertyRange, options );

    // Update descriptions whenever the value changes
    property.link( value => {
      numberControl.slider.voicingObjectResponse = StringUtils.fillIn(
        options.createObjectResponsePatternString( value ), { value: value } );
    } );

    // a text descriptoin for this control
    const descriptionText = new VoicingRichText( description, combineOptions<VoicingRichTextOptions>( {}, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS, NON_TRANSLATABLE_TEXT_OPTIONS ) );

    super( {
      children: [ numberControl, descriptionText ],
      align: 'left',
      spacing: PreferencesDialog.LABEL_CONTENT_SPACING
    } );
  }
}

quadrilateral.register( 'QuadrilateralInputPreferencesNode', QuadrilateralInputPreferencesNode );

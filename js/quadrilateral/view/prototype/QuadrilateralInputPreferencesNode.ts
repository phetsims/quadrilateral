// Copyright 2022-2023, University of Colorado Boulder

/**
 * Input Preferences specific to this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../../quadrilateral.js';
import NumberControl, { NumberControlOptions } from '../../../../../scenery-phet/js/NumberControl.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import { Node, RichText, RichTextOptions, Text, VBox } from '../../../../../scenery/js/imports.js';
import PreferencesDialog from '../../../../../joist/js/preferences/PreferencesDialog.js';
import QuadrilateralTangibleOptionsModel from '../../model/prototype/QuadrilateralTangibleOptionsModel.js';
import MediaPipe from '../../../../../tangible/js/mediaPipe/MediaPipe.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';

// Strings for the media pipe options content - this is a prototype and not available through production yet so
// it is not translatable.
const featureDescriptionString = 'Use custom hand gestures and movements to control objects in the sim. Please see the Teacher Tips for specific gestures, movements, and object mappings.';
const NON_TRANSLATABLE_TEXT_OPTIONS = { lineWrap: 550, maxWidth: null };

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
        featureDescriptionString: featureDescriptionString,
        troubleshootingControlsVisible: false,

        // Disable maxWidth and default lineWrap so this dialog looks good in English (not translatable)
        labelTextOptions: { lineWrap: 550, maxWidth: null }
      } );
      children = [ mediaPipeContent ];
    }
    else {

      // Controls specifically for tangible connection
      const titleNode = new Text( 'Device Input', PreferencesDialog.PANEL_SECTION_LABEL_OPTIONS );
      const descriptionNode = new RichText( 'Use slider controls to adjust the mapping and communication parameters ' +
                                            'between the simulation and BLE-enabled device to reduce noise-related ' +
                                            'jitter.', combineOptions<RichTextOptions>( {}, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS, NON_TRANSLATABLE_TEXT_OPTIONS ) );
      const gridSpacingNumberControl = new TangiblePropertyNumberControl(
        'Step Interval',
        'Adjust minimum distance required by device to step a vertex in the simulation.',
        tangibleOptionsModel.deviceGridSpacingProperty, {
          numberDisplayOptions: {
            decimalPlaces: 4
          }
        } );
      const smoothingLengthNumberControl = new TangiblePropertyNumberControl(
        'Number of Smoothing Values',
        'Adjust number of values used to smooth noise in incoming sensor values from a device.',
        tangibleOptionsModel.smoothingLengthProperty
      );
      const updateIntervalNumberControl = new TangiblePropertyNumberControl(
        'Sim Update Interval',
        'Adjust the time interval for accepting new values from the device in the simulation.',
        tangibleOptionsModel.bluetoothUpdateIntervalProperty, {
          numberDisplayOptions: {
            decimalPlaces: 1
          },
          delta: 0.1
          // margin doesn't make sense for this list of controls
        } );

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
  public constructor( label: string, description: string, property: NumberProperty, providedOptions?: NumberControlOptions ) {
    const propertyRange = property.range;

    const options = optionize<NumberControlOptions, EmptySelfOptions, NumberControlOptions>()( {
      delta: propertyRange.min,
      titleNodeOptions: PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS,
      layoutFunction: NumberControl.createLayoutFunction1( { align: 'left' } ),
      sliderOptions: {
        minorTickSpacing: propertyRange.getLength() / 10,
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
        ]
      },

      // opt out of tandems for these preferences because NumberControl requires phet.joist.sim and these
      // controls are created before the sim
      tandem: Tandem.OPT_OUT
    }, providedOptions );

    const numberControl = new NumberControl( label, property, propertyRange, options );

    // a text descriptoin for this control
    const descriptionText = new RichText( description, combineOptions<RichTextOptions>( {}, PreferencesDialog.PANEL_SECTION_CONTENT_OPTIONS, NON_TRANSLATABLE_TEXT_OPTIONS ) );

    super( {
      children: [ numberControl, descriptionText ],
      align: 'left',
      spacing: PreferencesDialog.LABEL_CONTENT_SPACING
    } );
  }
}

quadrilateral.register( 'QuadrilateralInputPreferencesNode', QuadrilateralInputPreferencesNode );

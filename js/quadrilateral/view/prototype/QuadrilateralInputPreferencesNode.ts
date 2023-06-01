// Copyright 2022-2023, University of Colorado Boulder

/**
 * Input Preferences specific to this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../../quadrilateral.js';
import NumberControl, { NumberControlOptions } from '../../../../../scenery-phet/js/NumberControl.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PreferencesPanelSection from '../../../../../joist/js/preferences/PreferencesPanelSection.js';
import { Node, Text, VBox } from '../../../../../scenery/js/imports.js';
import PreferencesDialog from '../../../../../joist/js/preferences/PreferencesDialog.js';
import QuadrilateralTangibleOptionsModel from '../../model/prototype/QuadrilateralTangibleOptionsModel.js';
import MediaPipe from '../../../../../tangible/js/mediaPipe/MediaPipe.js';

// Strings for the media pipe options content - this is a prototype and not available through production yet so
// it is not translatable.
const featureDescriptionString = 'Use custom hand gestures and movements to control objects in the sim. Please see the Teacher Tips for specific gestures, movements, and object mappings.';
const troubleshootingDescriptionString = 'If needed, use the options below to change the behavior of the sim objects to match your hand movements.';
const flipYAxisDescriptionString = 'Are your hands mapped to the wrong object or group of objects?';
const flipXAxisDescriptionString = 'Are your hands moving the sim objects in what seems like the wrong direction?';

export default class QuadrilateralInputPreferencesNode extends PreferencesPanelSection {
  private readonly disposeQuadrilateralInputPreferencesNode: () => void;

  public constructor( tangibleOptionsModel: QuadrilateralTangibleOptionsModel ) {
    assert && assert(
      tangibleOptionsModel.cameraInputHandsConnectedProperty.value || tangibleOptionsModel.deviceConnectedProperty.value,
      'Some prototype connection required for these options'
    );

    // Components and functions that will be tailored to the type of connection controls available.
    let disposeContents: () => void;
    let children: Node[];
    let titleNode: Node | null = null;

    if ( tangibleOptionsModel.cameraInputHandsConnectedProperty.value ) {
      const mediaPipeContent = MediaPipe.getMediaPipeOptionsNode( {
        featureDescriptionString: featureDescriptionString,
        troubleshootingDescriptionString: troubleshootingDescriptionString,
        flipYAxisDescriptionString: flipYAxisDescriptionString,
        flipXAxisDescriptionString: flipXAxisDescriptionString,

        // Disable maxWidth and default lineWrap so this dialog looks good in English (not translatable)
        labelTextOptions: { lineWrap: 550, maxWidth: null }
      } );
      children = [ mediaPipeContent ];
      disposeContents = () => {
        mediaPipeContent.dispose();
      };
    }
    else {

      // Controls specifically for tangible connection
      titleNode = new Text( 'Tangible Controls', PreferencesDialog.PANEL_SECTION_LABEL_OPTIONS );
      const gridSpacingNumberControl = new TangiblePropertyNumberControl( 'Position interval', tangibleOptionsModel.deviceGridSpacingProperty, {
        numberDisplayOptions: {
          decimalPlaces: 4
        }
      } );
      const smoothingLengthNumberControl = new TangiblePropertyNumberControl( 'Smoothing length', tangibleOptionsModel.smoothingLengthProperty );
      const updateIntervalNumberControl = new TangiblePropertyNumberControl( 'Update interval', tangibleOptionsModel.bluetoothUpdateIntervalProperty, {
        numberDisplayOptions: {
          decimalPlaces: 1
        },
        delta: 0.1
      } );

      children = [ gridSpacingNumberControl, smoothingLengthNumberControl, updateIntervalNumberControl ];
      disposeContents = () => {
        titleNode?.dispose();
        gridSpacingNumberControl.dispose();
        smoothingLengthNumberControl.dispose();
        updateIntervalNumberControl.dispose();
      };
    }

    const content = new VBox( {
      children: children,
      spacing: PreferencesDialog.CONTENT_SPACING
    } );

    super( {
      titleNode: titleNode,
      contentNode: content,

      // margin doesn't make sense for this list of controls
      contentLeftMargin: 0
    } );

    this.disposeQuadrilateralInputPreferencesNode = () => {
      disposeContents();
    };
  }

  public override dispose(): void {
    this.disposeQuadrilateralInputPreferencesNode();
    super.dispose();
  }

}

/**
 * Inner class, reusable NumberControl with default options for the purposes of this Preferences dialog content.
 */
class TangiblePropertyNumberControl extends NumberControl {
  public constructor( label: string, property: NumberProperty, providedOptions?: NumberControlOptions ) {
    const propertyRange = property.range;

    const options = optionize<NumberControlOptions, EmptySelfOptions, NumberControlOptions>()( {
      delta: propertyRange.min,

      // opt out of tandems for these preferences because NumberControl requires phet.joist.sim and these
      // controls are created before the sim
      tandem: Tandem.OPT_OUT
    }, providedOptions );

    super( label, property, propertyRange, options );
  }
}

quadrilateral.register( 'QuadrilateralInputPreferencesNode', QuadrilateralInputPreferencesNode );

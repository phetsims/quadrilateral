// Copyright 2022, University of Colorado Boulder

/**
 * Controls for the simulation. All either to prototype sound designs or for prototype connections between
 * simulation and a tangible device. See https://github.com/phetsims/quadrilateral/issues/168.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralPreferencesModel from '../model/QuadrilateralPreferencesModel.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import QuadrilateralConstants from '../../common/QuadrilateralConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ClapperboardButton from '../../../../scenery-phet/js/ClapperboardButton.js';
import QuadrilateralSoundOptionsNode from './QuadrilateralSoundOptionsNode.js';
import Panel from '../../../../sun/js/Panel.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';

class QuadrilateralPreferencesNode extends Node {
  public constructor( preferencesModel: QuadrilateralPreferencesModel, tandem: Tandem ) {
    super();

    const shapeIdentificationFeedbackCheckbox = new Checkbox( preferencesModel.shapeIdentificationFeedbackEnabledProperty, new Text( 'Shape Identification Feedback', QuadrilateralConstants.PANEL_LABEL_TEXT_OPTIONS ), {
      tandem: tandem.createTandem( 'shapeIdentificationFeedbackCheckbox' )
    } );

    // Controls specifically for tangible connection
    const gridSpacingNumberControl = new TangiblePropertyNumberControl( 'Position interval', preferencesModel.deviceGridSpacingProperty, {
      numberDisplayOptions: {
        decimalPlaces: 3
      }
    } );
    const smoothingLengthNumberControl = new TangiblePropertyNumberControl( 'Smoothing length', preferencesModel.smoothingLengthProperty );
    const updateIntervalNumberControl = new TangiblePropertyNumberControl( 'Update interval', preferencesModel.bluetoothUpdateIntervalProperty, {
      numberDisplayOptions: {
        decimalPlaces: 1
      },
      delta: 0.1
    } );
    const tangibleControls = new Panel( new VBox( {
      children: [ gridSpacingNumberControl, smoothingLengthNumberControl, updateIntervalNumberControl ],
      spacing: 5
    } ) );

    const otherControls = [
      tangibleControls,
      new ClapperboardButton( { tandem: tandem.createTandem( 'clapperboardButton' ) } ),
      shapeIdentificationFeedbackCheckbox
    ];

    const otherControlsBox = new VBox( {
      children: otherControls,
      align: 'left',
      spacing: 15
    } );

    const controls = new HBox( {
      children: [ new QuadrilateralSoundOptionsNode( preferencesModel.soundOptionsModel, tandem.createTandem( 'soundOptionsNode' ) ), otherControlsBox ],
      spacing: 15,
      align: 'top'
    } );

    const preferencesNode = new HBox( {
      children: [ controls ],
      spacing: 10,
      align: 'top'
    } );

    this.addChild( preferencesNode );
  }
}

/**
 * Inner class, reusable NumberControl with default options for the purposes of this Preferences dialog content.
 */
class TangiblePropertyNumberControl extends NumberControl {
  public constructor( label: string, property: NumberProperty, providedOptions?: NumberControlOptions ) {
    const propertyRange = property.range!;
    assert && assert( propertyRange, 'range required for NumberControl' );

    const options = optionize<NumberControlOptions, EmptyObjectType, NumberControlOptions>()( {
      delta: propertyRange.min,

      // opt out of tandems for these preferences because NumberControl requires phet.joist.sim and these
      // controls are created before the sim
      tandem: Tandem.OPT_OUT
    }, providedOptions );

    super( label, property, propertyRange, options );
  }
}

quadrilateral.register( 'QuadrilateralPreferencesNode', QuadrilateralPreferencesNode );
export default QuadrilateralPreferencesNode;

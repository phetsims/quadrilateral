// Copyright 2024, University of Colorado Boulder

/**
 * A set of controls specific to the 2024 user study that has students set a task number, submit an answer, and then
 * save data to a local file on their machine.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { HBox, Text, VBox } from '../../../../../scenery/js/imports.js';
import QuadrilateralConstants from '../../../QuadrilateralConstants.js';
import TextPushButton from '../../../../../sun/js/buttons/TextPushButton.js';
import QuadrilateralColors from '../../../QuadrilateralColors.js';
import TangibleConnectionModel from '../../model/prototype/TangibleConnectionModel.js';
import quadrilateral from '../../../quadrilateral.js';
import NumberPicker from '../../../../../sun/js/NumberPicker.js';

export default class QuadrilateralDataControls extends VBox {
  public constructor( tangibleConnectionModel: TangibleConnectionModel ) {

    // A 'task' spinner that will be used to set the task value for data collection.
    const taskText = new Text( 'Task', QuadrilateralConstants.PANEL_TITLE_TEXT_OPTIONS );
    const numberSpinner = new NumberPicker( tangibleConnectionModel.taskProperty, tangibleConnectionModel.taskProperty.rangeProperty, {
      color: QuadrilateralColors.screenViewButtonColorProperty
    } );
    const spinnerComponent = new HBox( {
      children: [ taskText, numberSpinner ],
      spacing: 10
    } );

    // A 'submit' answer button that will save an answer for this task.
    const submitButton = new TextPushButton( 'Submit Answer', {
      listener: () => {
        tangibleConnectionModel.submitAnswer();
      },

      textNodeOptions: QuadrilateralConstants.SCREEN_TEXT_OPTIONS,
      baseColor: QuadrilateralColors.screenViewButtonColorProperty
    } );

    const saveButton = new TextPushButton( 'Save Data', {
      listener: () => {
        tangibleConnectionModel.saveData();
      },

      textNodeOptions: QuadrilateralConstants.SCREEN_TEXT_OPTIONS,
      baseColor: QuadrilateralColors.screenViewButtonColorProperty
    } );

    super( {
      children: [ spinnerComponent, submitButton, saveButton ],
      spacing: QuadrilateralConstants.CONTROLS_SPACING / 2,
      align: 'right'
    } );
  }
}

quadrilateral.register( 'QuadrilateralDataControls', QuadrilateralDataControls );
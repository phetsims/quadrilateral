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

type SelfOptions = {

  // a11y - name of this component for both PDOM and Voicing
  nameResponse?: null | string;
};

type ParentOptions = VoicingOptions & NodeOptions;

// VertexNode sets these properties explicitly from the nameResponse option
export type QuadrilateralMovableNodeOptions = SelfOptions & StrictOmit<ParentOptions, 'voicingNameResponse' | 'innerContent'> & PickRequired<NodeOptions, 'tandem'>;

class QuadrilateralMovableNode extends Voicing( Node ) {
  private readonly model: QuadrilateralMovable;

  public constructor( model: QuadrilateralMovable, providedOptions?: QuadrilateralMovableNodeOptions ) {
    const options = optionize<QuadrilateralMovableNodeOptions, SelfOptions, ParentOptions>()( {
      cursor: 'pointer',
      tagName: 'div',
      ariaRole: 'application',
      focusable: true,
      nameResponse: null
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

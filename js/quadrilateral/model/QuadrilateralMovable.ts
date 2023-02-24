// Copyright 2023, University of Colorado Boulder

/**
 * A superclass for movable model components of the quadrilateral. Namely, a superclass for Vertex and Side.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import quadrilateral from '../../quadrilateral.js';

class QuadrilateralMovable {

  // Indicates that movement is blocked by model bounds.
  public readonly movementBlockedByBoundsProperty = new BooleanProperty( false );

  // Indicates that movement is blocked by the quadrilateral shape - other sides or vertices.
  public readonly movementBlockedByShapeProperty = new BooleanProperty( false );

  // (Voicing) Indicates that the Side has received some input and it is time to trigger a new Voicing response
  // the next time Properties are updated in QuadrilateralShapeModel.
  public voicingObjectResponseDirty = false;
}

quadrilateral.register( 'QuadrilateralMovable', QuadrilateralMovable );
export default QuadrilateralMovable;

// Copyright 2022, University of Colorado Boulder

/**
 * A body for collision detections with SAT.js. To be used with CollisionDetector.ts.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';

class CollisionBody {
  public readonly data: IntentionalAny;

  public dragging: boolean;

  /**
   * @param data - type is an SAT.Polygon.
   */
  public constructor( data: IntentionalAny ) {
    this.data = data;
    this.dragging = false;
  }
}

quadrilateral.register( 'CollisionBody', CollisionBody );
export default CollisionBody;

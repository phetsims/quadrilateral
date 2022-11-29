// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quadrilateral from '../../quadrilateral.js';

class SideLabel extends EnumerationValue {
  public static SIDE_AB = new SideLabel();
  public static SIDE_BC = new SideLabel();
  public static SIDE_CD = new SideLabel();
  public static SIDE_DA = new SideLabel();

  public static enumeration = new Enumeration( SideLabel );
}

quadrilateral.register( 'SideLabel', SideLabel );
export default SideLabel;

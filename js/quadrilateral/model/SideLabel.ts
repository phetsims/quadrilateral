// Copyright 2022-2023, University of Colorado Boulder

/**
 * A SideLabel is assigned to each QuadrilateralSide so that they can be identified.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quadrilateral from '../../quadrilateral.js';

export default class SideLabel extends EnumerationValue {
  public static readonly SIDE_AB = new SideLabel();
  public static readonly SIDE_BC = new SideLabel();
  public static readonly SIDE_CD = new SideLabel();
  public static readonly SIDE_DA = new SideLabel();

  public static readonly enumeration = new Enumeration( SideLabel );
}

quadrilateral.register( 'SideLabel', SideLabel );

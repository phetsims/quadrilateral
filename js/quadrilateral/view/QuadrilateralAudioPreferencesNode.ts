// Copyright 2022-2023, University of Colorado Boulder

/**
 * Controls for the simulation. All either to prototype sound designs or for prototype connections between
 * simulation and a tangible device. See https://github.com/phetsims/quadrilateral/issues/168.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import QuadrilateralOptionsModel from '../model/QuadrilateralOptionsModel.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuadrilateralSoundOptionsNode from './sound/QuadrilateralSoundOptionsNode.js';

class QuadrilateralAudioPreferencesNode extends Node {

  // Disposal of components and tandems necessary for phet-io state, otherwise they could exist for life of the sim.
  private readonly disposeQuadrilateralPreferencesNode: () => void;

  public constructor( optionsModel: QuadrilateralOptionsModel, tandem: Tandem ) {
    super();

    const soundOptionsNode = new QuadrilateralSoundOptionsNode( optionsModel.soundOptionsModel, tandem.createTandem( 'soundOptionsNode' ) );
    this.addChild( soundOptionsNode );

    this.disposeQuadrilateralPreferencesNode = () => {
      soundOptionsNode.dispose();
    };
  }

  public override dispose(): void {
    this.disposeQuadrilateralPreferencesNode();
    super.dispose();
  }
}

quadrilateral.register( 'QuadrilateralAudioPreferencesNode', QuadrilateralAudioPreferencesNode );
export default QuadrilateralAudioPreferencesNode;

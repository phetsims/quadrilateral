// Copyright 2022, University of Colorado Boulder

/**
 * Manages descriptions related to the Vertex for both Interactive Descriptoin and Voicing features.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import quadrilateral from '../../quadrilateral.js';
import quadrilateralStrings from '../../quadrilateralStrings.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import Vertex from '../model/Vertex.js';
import VertexLabel from '../model/VertexLabel.js';
import Range from '../../../../dot/js/Range.js';
import QuadrilateralQueryParameters from '../QuadrilateralQueryParameters.js';

// constants
const cornerAString = quadrilateralStrings.a11y.cornerA;
const cornerBString = quadrilateralStrings.a11y.cornerB;
const cornerCString = quadrilateralStrings.a11y.cornerC;
const cornerDString = quadrilateralStrings.a11y.cornerD;
const rightAngleVertexObjectResponsePatternString = quadrilateralStrings.a11y.voicing.rightAngleVertexObjectResponsePattern;
const vertexObjectResponsePatternString = quadrilateralStrings.a11y.voicing.vertexObjectResponsePattern;
const farWiderThanString = quadrilateralStrings.a11y.voicing.farWiderThan;
const farSmallerThanString = quadrilateralStrings.a11y.voicing.farSmallerThan;
const muchMuchWiderThanString = quadrilateralStrings.a11y.voicing.muchMuchWiderThan;
const muchMuchSmallerThanString = quadrilateralStrings.a11y.voicing.muchMuchSmallerThan;
const muchWiderThanString = quadrilateralStrings.a11y.voicing.muchWiderThan;
const muchSmallerThanString = quadrilateralStrings.a11y.voicing.muchSmallerThan;
const somewhatWiderThanString = quadrilateralStrings.a11y.voicing.somewhatWiderThan;
const somewhatSmallerThanString = quadrilateralStrings.a11y.voicing.somewhatSmallerThan;
const aLittleWiderThanString = quadrilateralStrings.a11y.voicing.aLittleWiderThan;
const aLittleSmallerThanString = quadrilateralStrings.a11y.voicing.aLittleSmallerThan;
const comparableToString = quadrilateralStrings.a11y.voicing.comparableTo;
const equalToString = quadrilateralStrings.a11y.voicing.equalTo;
const equalToAdjacentCornersString = quadrilateralStrings.a11y.voicing.equalToAdjacentCorners;
const equalToOneAdjacentCornerString = quadrilateralStrings.a11y.voicing.equalToOneAdjacentCorner;
const equalAdjacentCornersPatternString = quadrilateralStrings.a11y.voicing.equalAdjacentCornersPattern;
const smallerThanAdjacentCornersString = quadrilateralStrings.a11y.voicing.smallerThanAdjacentCorners;
const widerThanAdjacentCornersString = quadrilateralStrings.a11y.voicing.widerThanAdjacentCorners;
const notEqualToAdjacentCornersString = quadrilateralStrings.a11y.voicing.notEqualToAdjacentCorners;

// Maps a vertex to its accessible name, like "Corner A".
const VertexCornerLabelMap = new Map<VertexLabel, string>( [
  [ VertexLabel.VERTEX_A, cornerAString ],
  [ VertexLabel.VERTEX_B, cornerBString ],
  [ VertexLabel.VERTEX_C, cornerCString ],
  [ VertexLabel.VERTEX_D, cornerDString ]
] );

// Maps the difference in angles between two vertices to a description string.
const AngleComparisonDescriptionMap = new Map<Range, string>();

const createAngleComparisonDescriptionMapEntry = ( minAngle: number, maxAngle: number, widerString: string, smallerString: string ) => {
  AngleComparisonDescriptionMap.set( new Range( minAngle, maxAngle ), widerString );
  AngleComparisonDescriptionMap.set( new Range( -maxAngle, -minAngle ), smallerString );
};

createAngleComparisonDescriptionMapEntry( Math.PI, 2 * Math.PI, farWiderThanString, farSmallerThanString );
createAngleComparisonDescriptionMapEntry( Utils.toRadians( 135 ), Math.PI, muchMuchWiderThanString, muchMuchSmallerThanString );
createAngleComparisonDescriptionMapEntry( Math.PI / 2, Utils.toRadians( 135 ), muchWiderThanString, muchSmallerThanString );
createAngleComparisonDescriptionMapEntry( Math.PI / 4, Math.PI / 2, somewhatWiderThanString, somewhatSmallerThanString );
createAngleComparisonDescriptionMapEntry( Utils.toRadians( 15 ), Math.PI / 4, aLittleWiderThanString, aLittleSmallerThanString );
createAngleComparisonDescriptionMapEntry( QuadrilateralQueryParameters.shapeAngleToleranceInterval, Utils.toRadians( 15 ), comparableToString, comparableToString );
createAngleComparisonDescriptionMapEntry( 0, QuadrilateralQueryParameters.shapeAngleToleranceInterval, equalToString, equalToString );

class VertexDescriber {

  // A reference to the model components that drive description.
  private vertex: Vertex;
  private quadrilateralShapeModel: QuadrilateralShapeModel;

  // See above documentation.
  public static VertexCornerLabelMap = VertexCornerLabelMap;
  public static AngleComparisonDescriptionMap = AngleComparisonDescriptionMap;

  public constructor( vertex: Vertex, quadrilateralShapeModel: QuadrilateralShapeModel ) {
    this.vertex = vertex;
    this.quadrilateralShapeModel = quadrilateralShapeModel;
  }

  /**
   * Get the full label for this Vertex. Will return something like
   * "Corner A" or
   * "Corner D"
   */
  public getVertexLabel(): string {
    const label = VertexCornerLabelMap.get( this.vertex.vertexLabel )!;
    assert && assert( label, 'Could not find label for vertex' );
    return label;
  }

  /**
   * Returns the Object response for the vertex. Will return something like
   *
   * "right angle, equal to opposite corner, equal to adjacent corners" or
   * "somewhat wider than opposite corner, much smaller than adjacent equal corners."
   */
  public getVertexObjectResponse(): string {
    let response = '';

    const vertexAngle = this.vertex.angleProperty.value!;
    const oppositeVertex = this.quadrilateralShapeModel.oppositeVertexMap.get( this.vertex )!;

    // Prepend "right angle" if this vertex is currently a right angle
    const patternString = this.quadrilateralShapeModel.isRightAngle( vertexAngle ) ?
                          rightAngleVertexObjectResponsePatternString :
                          vertexObjectResponsePatternString;

    response = StringUtils.fillIn( patternString, {
      oppositeComparison: VertexDescriber.getAngleComparisonDescription( oppositeVertex, this.vertex ),
      adjacentVertexDescription: this.getAdjacentVertexObjectDescription()
    } );

    return response;
  }

  /**
   * Get a description of the angle of this vertex and how it compares to its adjacent vertices. Used
   * for the object response of this vertex. Will return something like
   * "much smaller than adjacent equal corners." or
   * "equal to adjacent corners."
   */
  public getAdjacentVertexObjectDescription(): string {
    let description = '';

    const adjacentCorners = this.quadrilateralShapeModel.adjacentVertexMap.get( this.vertex )!;
    const adjacentCornersEqual = this.quadrilateralShapeModel.isShapeAngleEqualToOther(
      adjacentCorners[ 0 ].angleProperty.value!,
      adjacentCorners[ 1 ].angleProperty.value!
    );

    let numberOfEqualAdjacentVertexPairs = 0;
    const adjacentVertexPairs = this.quadrilateralShapeModel.adjacentEqualVertexPairsProperty.value;
    adjacentVertexPairs.forEach( vertexPair => {
      if ( vertexPair.vertex1 === this.vertex || vertexPair.vertex2 === this.vertex ) {
        numberOfEqualAdjacentVertexPairs++;
      }
    } );
    if ( numberOfEqualAdjacentVertexPairs === 2 ) {

      // This vertex and both adjacent angles are all equal
      description = equalToAdjacentCornersString;
    }
    else if ( numberOfEqualAdjacentVertexPairs === 1 ) {

      // just say "equal to one adjacent corner
      description = equalToOneAdjacentCornerString;
    }
    else if ( adjacentCornersEqual ) {

      // the adjacent corners are equal but not equal to provided vertex, combine their description and use either
      // to describe the relative description
      description = StringUtils.fillIn( equalAdjacentCornersPatternString, {
        comparison: VertexDescriber.getAngleComparisonDescription( adjacentCorners[ 0 ], this.vertex )
      } );
    }
    else {

      // None of the vertex angles are equal. Describe how this vertex is smaller than both, larger than both, or
      // simply equal to neither.
      const vertexAngle = this.vertex.angleProperty.value!;
      const firstAdjacentAngle = adjacentCorners[ 0 ].angleProperty.value!;
      const secondAdjacentAngle = adjacentCorners[ 1 ].angleProperty.value!;

      if ( firstAdjacentAngle > vertexAngle && secondAdjacentAngle > vertexAngle ) {
        description = smallerThanAdjacentCornersString;
      }
      else if ( firstAdjacentAngle < vertexAngle && secondAdjacentAngle < vertexAngle ) {
        description = widerThanAdjacentCornersString;
      }
      else {
        description = notEqualToAdjacentCornersString;
      }
    }

    return description;
  }

  /**
   * Returns the description of comparison between two angles, using the entries of AngleComparisonDescriptionMap.
   * Description compares vertex2 to vertex1. So if vertex2 has a larger angle than vertex1 the output will be something
   * like:
   * "much much wider than" or
   * "a little wider than"
   *
   * or if vertex2 angle is smaller than vertex1, we will return something like
   * "much much smaller than" or
   * "a little smaller than"
   */
  public static getAngleComparisonDescription( vertex1: Vertex, vertex2: Vertex ): string {
    assert && assert( vertex1.angleProperty.value !== null, 'angles need to be initialized for descriptions' );
    assert && assert( vertex2.angleProperty.value !== null, 'angles need to be initialized for descriptions' );

    let description: string | null = null;

    const angle1 = vertex1.angleProperty.value!;
    const angle2 = vertex2.angleProperty.value!;
    const angleDifference = angle2 - angle1;

    AngleComparisonDescriptionMap.forEach( ( value, key ) => {
      if ( key.contains( angleDifference ) ) {
        description = value;
      }
    } );

    assert && assert( description, `Description not found for angle difference ${angleDifference}` );
    return description!;
  }
}

quadrilateral.register( 'VertexDescriber', VertexDescriber );
export default VertexDescriber;

// Copyright 2022-2023, University of Colorado Boulder

/**
 * Manages descriptions related to the Vertex for both Interactive Descriptoin and Voicing features.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import quadrilateral from '../../quadrilateral.js';
import QuadrilateralStrings from '../../QuadrilateralStrings.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import Vertex from '../model/Vertex.js';
import VertexLabel from '../model/VertexLabel.js';
import Range from '../../../../dot/js/Range.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CornerGuideNode from './CornerGuideNode.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';

// constants
const cornerAString = QuadrilateralStrings.a11y.cornerA;
const cornerBString = QuadrilateralStrings.a11y.cornerB;
const cornerCString = QuadrilateralStrings.a11y.cornerC;
const cornerDString = QuadrilateralStrings.a11y.cornerD;
const vertexObjectResponsePatternString = QuadrilateralStrings.a11y.voicing.vertexObjectResponsePattern;
const farSmallerThanString = QuadrilateralStrings.a11y.voicing.farSmallerThan;
const aboutHalfAsWideAsString = QuadrilateralStrings.a11y.voicing.aboutHalfAsWideAs;
const halfAsWideAsString = QuadrilateralStrings.a11y.voicing.halfAsWideAs;
const aLittleSmallerThanString = QuadrilateralStrings.a11y.voicing.aLittleSmallerThan;
const muchSmallerThanString = QuadrilateralStrings.a11y.voicing.muchSmallerThan;
const similarButSmallerThanString = QuadrilateralStrings.a11y.voicing.similarButSmallerThan;
const equalToString = QuadrilateralStrings.a11y.voicing.equalTo;
const similarButWiderThanString = QuadrilateralStrings.a11y.voicing.similarButWiderThan;
const muchWiderThanString = QuadrilateralStrings.a11y.voicing.muchWiderThan;
const aboutTwiceAsWideAsString = QuadrilateralStrings.a11y.voicing.aboutTwiceAsWideAs;
const twiceAsWideAsString = QuadrilateralStrings.a11y.voicing.twiceAsWideAs;
const aLittleWiderThanString = QuadrilateralStrings.a11y.voicing.aLittleWiderThan;
const farWiderThanString = QuadrilateralStrings.a11y.voicing.farWiderThan;
const equalToAdjacentCornersString = QuadrilateralStrings.a11y.voicing.equalToAdjacentCorners;
const equalToOneAdjacentCornerString = QuadrilateralStrings.a11y.voicing.equalToOneAdjacentCorner;
const equalAdjacentCornersPatternString = QuadrilateralStrings.a11y.voicing.equalAdjacentCornersPattern;
const smallerThanAdjacentCornersString = QuadrilateralStrings.a11y.voicing.smallerThanAdjacentCorners;
const widerThanAdjacentCornersString = QuadrilateralStrings.a11y.voicing.widerThanAdjacentCorners;
const notEqualToAdjacentCornersString = QuadrilateralStrings.a11y.voicing.notEqualToAdjacentCorners;
const vertexObjectResponseWithWedgesPatternString = QuadrilateralStrings.a11y.voicing.vertexObjectResponseWithWedgesPattern;
const rightAngleString = QuadrilateralStrings.a11y.voicing.rightAngle;
const angleFlatString = QuadrilateralStrings.a11y.voicing.angleFlat;
const oneWedgeString = QuadrilateralStrings.a11y.voicing.oneWedge;
const halfOneWedgeString = QuadrilateralStrings.a11y.voicing.halfOneWedge;
const lessThanHalfOneWedgeString = QuadrilateralStrings.a11y.voicing.lessThanHalfOneWedge;
const justOverOneWedgeString = QuadrilateralStrings.a11y.voicing.justOverOneWedge;
const justUnderOneWedgeString = QuadrilateralStrings.a11y.voicing.justUnderOneWedge;
const numberOfWedgesPatternString = QuadrilateralStrings.a11y.voicing.numberOfWedgesPattern;
const numberOfWedgesAndAHalfPatternString = QuadrilateralStrings.a11y.voicing.numberOfWedgesAndAHalfPattern;
const justOverNumberOfWedgesPatternString = QuadrilateralStrings.a11y.voicing.justOverNumberOfWedgesPattern;
const justUnderNumberOfWedgesPatternString = QuadrilateralStrings.a11y.voicing.justUnderNumberOfWedgesPattern;

// Maps a vertex to its accessible name, like "Corner A".
const vertexCornerLabelMap = new Map<VertexLabel, string>( [
  [ VertexLabel.VERTEX_A, cornerAString ],
  [ VertexLabel.VERTEX_B, cornerBString ],
  [ VertexLabel.VERTEX_C, cornerCString ],
  [ VertexLabel.VERTEX_D, cornerDString ]
] );

// If ratio of an angle to another is within this range it is 'about half as large as the other'.
const ABOUT_HALF_RANGE = new Range( 0.4, 0.6 );

// If ratio of angle to another is within this range it is 'about twice as large as the other'. Note that this
// range is twice as wide as the 'about half' range because the ratios around larger values will have a bigger
// variance. See https://github.com/phetsims/quadrilateral/issues/262.
const ABOUT_TWICE_RANGE = new Range( 1.8, 2.2 );

// Maps the difference in angles between two vertices to a description string.
const angleComparisonDescriptionMap = new Map<Range, string>();
angleComparisonDescriptionMap.set( new Range( 0, 0.1 ), farSmallerThanString );
angleComparisonDescriptionMap.set( new Range( 0.1, 0.4 ), muchSmallerThanString );
angleComparisonDescriptionMap.set( ABOUT_HALF_RANGE, aboutHalfAsWideAsString );
angleComparisonDescriptionMap.set( new Range( 0.6, 0.8 ), aLittleSmallerThanString );
angleComparisonDescriptionMap.set( new Range( 0.8, 1 ), similarButSmallerThanString );
angleComparisonDescriptionMap.set( new Range( 1, 1.3 ), similarButWiderThanString );
angleComparisonDescriptionMap.set( new Range( 1.3, 1.6 ), aLittleWiderThanString );
angleComparisonDescriptionMap.set( new Range( 1.6, 1.8 ), muchWiderThanString );
angleComparisonDescriptionMap.set( ABOUT_TWICE_RANGE, aboutTwiceAsWideAsString );
angleComparisonDescriptionMap.set( new Range( 2.2, Number.POSITIVE_INFINITY ), farWiderThanString );

class VertexDescriber {

  // A reference to the model components that drive description.
  private vertex: Vertex;
  private quadrilateralShapeModel: QuadrilateralShapeModel;
  private markersVisibleProperty: TReadOnlyProperty<boolean>;

  // See above documentation.
  public static readonly VertexCornerLabelMap = vertexCornerLabelMap;

  public constructor( vertex: Vertex, quadrilateralShapeModel: QuadrilateralShapeModel, markersVisibleProperty: TReadOnlyProperty<boolean> ) {
    this.vertex = vertex;
    this.quadrilateralShapeModel = quadrilateralShapeModel;
    this.markersVisibleProperty = markersVisibleProperty;
  }

  /**
   * Get the full label for this Vertex. Will return something like
   * "Corner A" or
   * "Corner D"
   */
  public getVertexLabel(): string {
    const label = vertexCornerLabelMap.get( this.vertex.vertexLabel )!;
    assert && assert( label, 'Could not find label for vertex' );
    return label;
  }

  /**
   * Returns the Object response for the vertex. Will return something like
   *
   * "right angle, equal to opposite corner, equal to adjacent corners" or
   * "somewhat wider than opposite corner, much smaller than adjacent equal corners." or
   * "1 wedge, far smaller than opposite corner, smaller than adjacent corners."
   */
  public getVertexObjectResponse(): string {
    let response = '';

    const oppositeVertex = this.quadrilateralShapeModel.oppositeVertexMap.get( this.vertex )!;

    const shapeName = this.quadrilateralShapeModel.shapeNameProperty.value;
    const oppositeComparisonString = VertexDescriber.getAngleComparisonDescription( oppositeVertex, this.vertex, this.quadrilateralShapeModel.interAngleToleranceIntervalProperty.value, shapeName );
    const adjacentVertexDescriptionString = this.getAdjacentVertexObjectDescription();

    // if corner guides are visible, a description of the number of wedges is included
    if ( this.markersVisibleProperty.value ) {
      response = StringUtils.fillIn( vertexObjectResponseWithWedgesPatternString, {
        wedgeDescription: VertexDescriber.getWedgesDescription( this.vertex.angleProperty.value!, this.quadrilateralShapeModel ),
        oppositeComparison: oppositeComparisonString,
        adjacentVertexDescription: adjacentVertexDescriptionString
      } );
    }
    else {
      response = StringUtils.fillIn( vertexObjectResponsePatternString, {
        oppositeComparison: oppositeComparisonString,
        adjacentVertexDescription: adjacentVertexDescriptionString
      } );
    }

    return response;
  }

  /**
   * Returns a description for the number of wedges, to be used when corner guides are shown. Returns something like
   * "just under 1 wedge" or
   * "just over 3 wedges" or
   * "1 wedge" or
   * "right angle" or
   * "3 and a half wedge" or
   * "half one wedge"
   *
   * For the design request of this feature please see https://github.com/phetsims/quadrilateral/issues/231
   */
  public static getWedgesDescription( vertexAngle: number, shapeModel: QuadrilateralShapeModel ): string {
    let wedgeDescription: string | null = null;

    const numberOfFullWedges = Math.floor( vertexAngle / CornerGuideNode.WEDGE_SIZE_RADIANS );
    const remainder = vertexAngle % CornerGuideNode.WEDGE_SIZE_RADIANS;

    if ( shapeModel.isRightAngle( vertexAngle ) ) {
      wedgeDescription = rightAngleString;
    }
    else if ( shapeModel.isFlatAngle( vertexAngle ) ) {
      wedgeDescription = angleFlatString;
    }
    else if ( shapeModel.isStaticAngleEqualToOther( remainder, 0 ) ) {
      if ( numberOfFullWedges === 1 ) {
        wedgeDescription = oneWedgeString;
      }
      else {
        wedgeDescription = StringUtils.fillIn( numberOfWedgesPatternString, {
          numberOfWedges: numberOfFullWedges
        } );
      }
    }
    else if ( shapeModel.isStaticAngleEqualToOther( remainder, CornerGuideNode.WEDGE_SIZE_RADIANS / 2 ) ) {
      if ( numberOfFullWedges === 0 ) {
        wedgeDescription = halfOneWedgeString;
      }
      else {
        wedgeDescription = StringUtils.fillIn( numberOfWedgesAndAHalfPatternString, {
          numberOfWedges: numberOfFullWedges
        } );
      }
    }
    else if ( remainder < CornerGuideNode.WEDGE_SIZE_RADIANS / 2 ) {
      if ( numberOfFullWedges === 0 ) {
        wedgeDescription = lessThanHalfOneWedgeString;
      }
      else if ( numberOfFullWedges === 1 ) {
        wedgeDescription = justOverOneWedgeString;
      }
      else {
        wedgeDescription = StringUtils.fillIn( justOverNumberOfWedgesPatternString, {
          numberOfWedges: numberOfFullWedges
        } );
      }
    }
    else if ( remainder > CornerGuideNode.WEDGE_SIZE_RADIANS / 2 ) {
      if ( numberOfFullWedges === 0 ) {
        wedgeDescription = justUnderOneWedgeString;
      }
      else {
        wedgeDescription = StringUtils.fillIn( justUnderNumberOfWedgesPatternString, {
          numberOfWedges: numberOfFullWedges + 1
        } );
      }
    }

    assert && assert( wedgeDescription, `did not find a wedge description for the provided angle: ${vertexAngle}` );
    return wedgeDescription!;
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
      const shapeName = this.quadrilateralShapeModel.shapeNameProperty.value;
      description = StringUtils.fillIn( equalAdjacentCornersPatternString, {
        comparison: VertexDescriber.getAngleComparisonDescription( adjacentCorners[ 0 ], this.vertex, this.quadrilateralShapeModel.interAngleToleranceIntervalProperty.value, shapeName )
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
   * Returns the description of comparison between two angles, using the entries of angleComparisonDescriptionMap.
   * Description compares vertex2 to vertex1. So if vertex2 has a larger angle than vertex1 the output will be something
   * like:
   * "much much wider than" or
   * "a little wider than"
   *
   * or if vertex2 angle is smaller than vertex1, we will return something like
   * "much much smaller than" or
   * "a little smaller than"
   */
  public static getAngleComparisonDescription( vertex1: Vertex, vertex2: Vertex, interAngleToleranceInterval: number, shapeName: NamedQuadrilateral ): string {
    assert && assert( vertex1.angleProperty.value !== null, 'angles need to be initialized for descriptions' );
    assert && assert( vertex2.angleProperty.value !== null, 'angles need to be initialized for descriptions' );

    let description: string | null = null;

    const angle1 = vertex1.angleProperty.value!;
    const angle2 = vertex2.angleProperty.value!;

    // If we are a trapezoid, only describe angles as equal when they are EXACTLY equal, otherwise we may run into
    // cases where we move out of isoceles trapezoid while the angles are still described as "equal".
    const usableToleranceInterval = shapeName === NamedQuadrilateral.TRAPEZOID ? 0 : interAngleToleranceInterval;
    if ( QuadrilateralShapeModel.isInterAngleEqualToOther( angle2, angle1, usableToleranceInterval ) ) {
      description = equalToString;
    }
    else if ( QuadrilateralShapeModel.isInterAngleEqualToOther( angle2, angle1 * 2, usableToleranceInterval ) ) {
      description = twiceAsWideAsString;
    }
    else if ( QuadrilateralShapeModel.isInterAngleEqualToOther( angle2, angle1 * 0.5, usableToleranceInterval ) ) {
      description = halfAsWideAsString;
    }

    const angleRatio = angle2 / angle1;
    if ( description === null ) {
      angleComparisonDescriptionMap.forEach( ( value, key ) => {
        if ( key.contains( angleRatio ) ) {
          description = value;
        }
      } );
    }

    assert && assert( description, `Description not found for angle difference ${angleRatio}` );
    return description!;
  }

  /**
   * Returns true if value of angle is equal to half of value of other, within provided tolerance interval.
   */
  public static isAngleHalfOther( angle: number, other: number, interAngleToleranceInterval: number ): boolean {
    return QuadrilateralShapeModel.isInterAngleEqualToOther( angle, other / 2, interAngleToleranceInterval );
  }

  /**
   * Returns true if value of angle is equal to twice value of other, within provided tolerance interval.
   */
  public static isAngleTwiceOther( angle: number, other: number, interAngleToleranceInterval: number ): boolean {
    return QuadrilateralShapeModel.isInterAngleEqualToOther( angle, other * 2, interAngleToleranceInterval );
  }

  /**
   * Returns true if value of angle is "about" half of value of other, within defined ranges.
   */
  public static isAngleAboutHalfOther( angle: number, other: number ): boolean {
    return ABOUT_HALF_RANGE.contains( angle / other );
  }

  /**
   * Returns true if value of angle is "about" twice value of other, within defined ranges.
   */
  public static isAngleAboutTwiceOther( angle: number, other: number ): boolean {
    return ABOUT_TWICE_RANGE.contains( angle / other );
  }
}

quadrilateral.register( 'VertexDescriber', VertexDescriber );
export default VertexDescriber;

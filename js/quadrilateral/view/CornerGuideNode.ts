// Copyright 2022, University of Colorado Boulder

/**
 * A Node that surrounds a Vertex to represent the current angle. The shape looks like a partial annulus that extends
 * between the sides that define the angles at a vertex. The annulus is broken into alternating light and dark
 * slices so that it is easy to see relative angle sizes by counting the number of slices at each guide.
 *
 * The annulus always starts at the same side so that the whole Node rotates with the entire quadrilateral so that the
 * guide always looks the same regardless of quadrilateral rotation.
 *
 * It also includes a set of dashed lines that run through the vertex and along the connected sides to give a
 * visualization of the internal angle (that is displayed by the arcs of the angle guide) and the external angle
 * that is outside of the quadrilateral shape. See https://github.com/phetsims/quadrilateral/issues/73.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import Vertex from '../model/Vertex.js';
import Utils from '../../../../dot/js/Utils.js';
import { Line } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadrilateralColors from '../../common/QuadrilateralColors.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import Property from '../../../../axon/js/Property.js';
import NamedQuadrilateral from '../model/NamedQuadrilateral.js';

// constants
// The size of each slice of the angle guide, in radians
const SLICE_SIZE_RADIANS = Utils.toRadians( 30 );

// in model coordinates, width of the arc (outer radius - inner radius of the annulus)
const SLICE_RADIAL_LENGTH = 0.05;

// The radii of the annulus
const INNER_RADIUS = Vertex.VERTEX_WIDTH / 2;
const OUTER_RADIUS = Vertex.VERTEX_WIDTH / 2 + SLICE_RADIAL_LENGTH;

const EXTERNAL_ANGLE_GUIDE_LENGTH = SLICE_RADIAL_LENGTH * 8;

class CornerGuideNode extends Node {
  constructor( vertex1: Vertex, vertex2: Vertex, visibleProperty: BooleanProperty, shapeModel: QuadrilateralShapeModel, modelViewTransform: ModelViewTransform2 ) {
    super();

    // The guide looks like alternating dark and light slices along the annulus, we accomplish this with two paths
    const darkAnglePath = new Path( null, {
      fill: QuadrilateralColors.cornerGuideDarkColorProperty,
      stroke: QuadrilateralColors.cornerGuideStrokeColorProperty
    } );
    const lightAnglePath = new Path( null, {
      fill: QuadrilateralColors.cornerGuideLightColorProperty,
      stroke: QuadrilateralColors.cornerGuideStrokeColorProperty
    } );

    const crosshairPath = new Path( null, {
      stroke: QuadrilateralColors.cornerGuideStrokeColorProperty,
      lineDash: [ 5, 5 ]
    } );

    assert && assert( vertex1.angleProperty, 'angleProperty needs to be defined to add listeners in CornerGuideNode' );
    Property.multilink( [ vertex1.angleProperty!, vertex1.positionProperty ], ( angle: number, position: Vector2 ) => {
      assert && assert( angle > 0, 'CornerGuideNodes cannot support angles at or less than zero' );
      const vertexCenter = vertex1.positionProperty.value;

      // Line helps us find where we should start drawing the shape, the annulus is "anchored" to one side so that
      // it will look the same regardless of quadrilateral rotation.
      const line = new Line( vertex1.positionProperty.value, vertex2.positionProperty.value );

      // start of the shape, the edge of the vertex along the line parametrically
      const startT = Math.min( ( INNER_RADIUS ) / line.getArcLength(), 1 );
      let firstInnerPoint = line.positionAt( startT );

      // next point of the shape, edge of the vertex plus the size of the annulus parametrically along the line
      const endT = Math.min( ( OUTER_RADIUS ) / line.getArcLength(), 1 );
      let firstOuterPoint = line.positionAt( endT );

      const lightShape = new Shape();
      const darkShape = new Shape();

      const numberOfSlices = Math.floor( angle / SLICE_SIZE_RADIANS );
      for ( let i = 0; i < numberOfSlices; i++ ) {
        const nextShape = i % 2 === 0 ? lightShape : darkShape;

        const nextInnerPoint = firstInnerPoint.rotatedAboutPoint( vertexCenter, -SLICE_SIZE_RADIANS );
        const nextOuterPoint = firstOuterPoint.rotatedAboutPoint( vertexCenter, -SLICE_SIZE_RADIANS );

        CornerGuideNode.drawAngleSegment( nextShape, firstInnerPoint, firstOuterPoint, nextInnerPoint, nextOuterPoint );

        firstInnerPoint = nextInnerPoint;
        firstOuterPoint = nextOuterPoint;
      }

      // now draw the remainder - check to make sure that it is large enough to display because ellipticalArcTo doesn't
      // work with angles that are close to zero.
      const remainingAngle = angle % SLICE_SIZE_RADIANS;
      if ( remainingAngle > 0.0005 ) {

        // slices alternate from light to dark, so we can count on the remaining slice being the alternating color
        const remainderShape = numberOfSlices % 2 === 0 ? lightShape : darkShape;

        const nextInnerPoint = firstInnerPoint.rotatedAboutPoint( vertexCenter, -remainingAngle );
        const nextOuterPoint = firstOuterPoint.rotatedAboutPoint( vertexCenter, -remainingAngle );

        CornerGuideNode.drawAngleSegment( remainderShape, firstInnerPoint, firstOuterPoint, nextInnerPoint, nextOuterPoint );
      }

      darkAnglePath.shape = modelViewTransform.modelToViewShape( lightShape );
      lightAnglePath.shape = modelViewTransform.modelToViewShape( darkShape );

      // now draw the line so that we can update the angle
      // start of the first guiding line, along the line between vertices parametrically
      const innerT = Math.min( ( EXTERNAL_ANGLE_GUIDE_LENGTH / 2 ) / line.getArcLength(), 1 );
      const firstCrosshairPoint = CornerGuideNode.customPositionAt( line, innerT );
      const secondCrosshairPoint = CornerGuideNode.customPositionAt( line, -innerT );

      // for the points on the second crosshair line rotate by the angle around the center of the vertex
      const thirdCrosshairPoint = firstCrosshairPoint.rotatedAboutPoint( vertexCenter, 2 * Math.PI - angle );
      const fourthCrosshairPoint = secondCrosshairPoint.rotatedAboutPoint( vertexCenter, 2 * Math.PI - angle );

      const crosshairShape = new Shape();
      crosshairShape.moveToPoint( firstCrosshairPoint );
      crosshairShape.lineToPoint( secondCrosshairPoint );
      crosshairShape.moveToPoint( thirdCrosshairPoint );
      crosshairShape.lineToPoint( fourthCrosshairPoint );

      crosshairPath.shape = modelViewTransform.modelToViewShape( crosshairShape );
    } );

    this.children = [ darkAnglePath, lightAnglePath, crosshairPath ];

    // listeners - This Node is only visible when "Angle Guides" are visible by the user and the angle is NOT a right
    // angle. In that case, the RightAngleIndicatorNode will display the angle.
    Property.multilink( [ visibleProperty, shapeModel.shapeNameProperty ], ( visible: boolean, shapeName: NamedQuadrilateral | null ) => {
      const currentShape = shapeModel.shapeNameProperty.value;
      this.visible = visible && currentShape !== NamedQuadrilateral.SQUARE && currentShape !== NamedQuadrilateral.RECTANGLE;
    } );
  }

  /**
   * Returns the parametric position along a line at the position t. Modified from Line.positionAt to support
   * positions outside of the range [0, 1] which is necessary for drawing code in this component.
   */
  private static customPositionAt( line: Line, t: number ) {
    return line.start.plus( line.end.minus( line.start ).times( t ) );
  }

  /**
   * Draw a single angle segment of the guide annulus. The provided shape will be manipulated by this function.
   */
  private static drawAngleSegment( shape: Shape, firstInnerPoint: Vector2, firstOuterPoint: Vector2, secondInnerPoint: Vector2, secondOuterPoint: Vector2 ): void {

    shape.moveToPoint( firstInnerPoint );
    shape.lineToPoint( firstOuterPoint );
    shape.ellipticalArcTo( OUTER_RADIUS, OUTER_RADIUS, 0, false, false, secondOuterPoint.x, secondOuterPoint.y );
    shape.lineToPoint( secondInnerPoint );
    shape.ellipticalArcTo( INNER_RADIUS, INNER_RADIUS, 0, false, false, firstInnerPoint.x, firstInnerPoint.y );
    shape.close();
  }
}

quadrilateral.register( 'CornerGuideNode', CornerGuideNode );
export default CornerGuideNode;

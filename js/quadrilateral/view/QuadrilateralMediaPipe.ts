// Copyright 2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import quadrilateral from '../../quadrilateral.js';
import MediaPipe from '../../../../tangible/js/mediaPipe/MediaPipe.js';
import QuadrilateralModel from '../model/QuadrilateralModel.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import QuadrilateralShapeModel from '../model/QuadrilateralShapeModel.js';
import MediaPipeQueryParameters from '../../../../tangible/js/mediaPipe/MediaPipeQueryParameters.js';
import MediaPipeOptions from '../../../../tangible/js/mediaPipe/MediaPipeOptions.js';

const MEDIA_PIPE_ASPECT_RATIO = 1280 / 720;

// indicies of the thumb and index finger from HandLandmarks of mediapipe, according to
// https:f//google.github.io/mediapipe/solutions/hands.html#hand-landmark-model
const THUMB_TIP_INDEX = 4;
const INDEX_TIP_INDEX = 8;

type ThumbAndIndex = {
  thumbPosition: Vector2;
  indexPosition: Vector2;
};

if ( MediaPipeQueryParameters.cameraInput === 'hands' ) {
  MediaPipe.initialize( { mediaPipeOptionsObject: new MediaPipeOptions() } );
}

class QuadrilateralMediaPipe extends MediaPipe {
  private readonly quadrilateralShapeModel: QuadrilateralShapeModel;

  public constructor( model: QuadrilateralModel ) {
    assert && assert( MediaPipeQueryParameters.cameraInput === 'hands', 'MediaPipe can only be used when requested.' );
    super();

    this.quadrilateralShapeModel = model.quadrilateralShapeModel;

    // So that there is a mapping from tangible space to simulation model space
    model.setPhysicalToVirtualTransform( MEDIA_PIPE_ASPECT_RATIO, 1 );
  }

  public step( dt: number ): void {
    const results = MediaPipe.resultsProperty.value;
    if ( results ) {
      const landmarks = results.multiHandLandmarks;

      if ( landmarks.length === 2 ) {
        const firstHand = landmarks[ 0 ];
        const firstThumbHandPoint = firstHand[ THUMB_TIP_INDEX ];
        const firstIndexHandPoint = firstHand[ INDEX_TIP_INDEX ];

        const firstThumbPosition = new Vector2( ( 1 - firstThumbHandPoint.x ) * MEDIA_PIPE_ASPECT_RATIO, ( 1 - firstThumbHandPoint.y ) );
        const firstIndexPosition = new Vector2( ( 1 - firstIndexHandPoint.x ) * MEDIA_PIPE_ASPECT_RATIO, ( 1 - firstIndexHandPoint.y ) );

        const secondHand = landmarks[ 1 ];
        const secondThumbHandPoint = secondHand[ THUMB_TIP_INDEX ];
        const secondIndexHandPoint = secondHand[ INDEX_TIP_INDEX ];

        const secondThumbPosition = new Vector2( ( 1 - secondThumbHandPoint.x ) * MEDIA_PIPE_ASPECT_RATIO, ( 1 - secondThumbHandPoint.y ) );
        const secondIndexPosition = new Vector2( ( 1 - secondIndexHandPoint.x ) * MEDIA_PIPE_ASPECT_RATIO, ( 1 - secondIndexHandPoint.y ) );

        const sortedPositions = this.sortHandedness( [
          {
            thumbPosition: firstThumbPosition,
            indexPosition: firstIndexPosition
          },
          {
            thumbPosition: secondThumbPosition,
            indexPosition: secondIndexPosition
          }
        ] );

        const leftHandPositions = sortedPositions[ 0 ];
        const rightHandPositions = sortedPositions[ 1 ];

        const firstPositionProposal = {
          vertex: this.quadrilateralShapeModel.vertexA,
          proposedPosition: leftHandPositions.indexPosition
        };
        const secondPositionProposal = {
          vertex: this.quadrilateralShapeModel.vertexB,
          proposedPosition: rightHandPositions.indexPosition
        };
        const thirdPositionProposal = {
          vertex: this.quadrilateralShapeModel.vertexC,
          proposedPosition: rightHandPositions.thumbPosition
        };
        const fourthPositionProposal = {
          vertex: this.quadrilateralShapeModel.vertexD,
          proposedPosition: leftHandPositions.thumbPosition
        };

        this.quadrilateralShapeModel.setPositionsFromAbsolutePositionData( [ firstPositionProposal, secondPositionProposal, thirdPositionProposal, fourthPositionProposal ] );
      }
    }
  }

  private sortHandedness( handPositions: ThumbAndIndex[] ): ThumbAndIndex[] {
    assert && assert( handPositions.length === 2, 'must have 2 thumbs' );
    return handPositions[ 0 ].thumbPosition.x <= handPositions[ 1 ].thumbPosition.x ? handPositions : handPositions.reverse();
  }
}

quadrilateral.register( 'QuadrilateralMediaPipe', QuadrilateralMediaPipe );
export default QuadrilateralMediaPipe;

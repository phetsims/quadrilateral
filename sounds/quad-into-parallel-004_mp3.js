/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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Ljk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7MsTqAggQfyLnsKnRG5AjTPOuyqqq2+233+AwAAEmkgU4soqyyhA4SXrBQQMECBwPf/VVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zDE6gMH9H8gZ7DpkTkRos2FosJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLE5oMIOI0cZ6y0kP+N4sz2JVJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxMqDw6Q86aCYYrAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;
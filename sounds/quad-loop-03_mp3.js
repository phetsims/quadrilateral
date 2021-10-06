/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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7e9diUP/+zDEqoMHICsabPMmEM4Eow2e5MIIZrVcxtoYKA8xbIDmUnGddoh0rLaVhaELboGA3I///+32tj0qUhAXA4lABA0VFRzYs5Bxwo8cRAZqIgBjC0wyrCVrVBy0Sl3U0lLcrNkmJX3vXQ9xHrF1kft9KnLd0/5XIPY0tSK0DTykPgmqBACpusgAjZhT0YwByozh1IJWKp2KmeLt9Ov/+zLEt4MG7C8QLXcGENuFYg2eZMLR2pQ6RirmqAoCYKg0PHnDwUA5I6x8afWSCCjoaGWkABNLoLs3MMFnGvzaGfMY2VvKaYxjfVvVP6f/9DGVtSlb//VsrzTGDCnJFXIg08GgaduIVUxBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxMQDx4gzCgzwxsDphiFBzJkQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsTMggc4KQgN5YhA0YShqJwkmlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zDE2QBG9BsHQYXiANIdX3A0iMBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError )
  .catch( e => { console.warn( 'promise rejection caught for audio decode, error = ' + e ); } );
export default wrappedAudioBuffer;
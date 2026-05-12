// Polyfills for APIs that Storybook (and its dependencies) expect but
// React Native's JS engines do not provide.

function SharedArrayBufferPolyfill(byteLength) {
  return new ArrayBuffer(byteLength);
}

function getSharedArrayBufferGrowable() {
  return false;
}

function getSharedArrayBufferMaxByteLength() {
  return this.byteLength;
}

function getSharedArrayBufferByteLength() {
  return 0;
}

function getArrayBufferResizable() {
  return false;
}

function getArrayBufferMaxByteLength() {
  return this.byteLength;
}

function getArrayBufferDetached() {
  return false;
}

function growSharedArrayBuffer() {
  throw new TypeError('SharedArrayBuffer.prototype.grow is not supported');
}

function sliceSharedArrayBuffer(begin, end) {
  return ArrayBuffer.prototype.slice.call(this, begin, end);
}

function defineMissingGetter(prototype, key, get) {
  if (!Object.getOwnPropertyDescriptor(prototype, key)) {
    Object.defineProperty(prototype, key, {
      get,
      configurable: true,
      enumerable: false,
    });
  }
}

defineMissingGetter(ArrayBuffer.prototype, 'resizable', getArrayBufferResizable);
defineMissingGetter(ArrayBuffer.prototype, 'maxByteLength', getArrayBufferMaxByteLength);
defineMissingGetter(ArrayBuffer.prototype, 'detached', getArrayBufferDetached);

if (typeof globalThis.SharedArrayBuffer === 'undefined') {
  SharedArrayBufferPolyfill.prototype = Object.create(ArrayBuffer.prototype);
  SharedArrayBufferPolyfill.prototype.constructor = SharedArrayBufferPolyfill;
  SharedArrayBufferPolyfill.prototype[Symbol.toStringTag] = 'SharedArrayBuffer';
  globalThis.SharedArrayBuffer = SharedArrayBufferPolyfill;
}

const sharedArrayBufferPrototype = globalThis.SharedArrayBuffer.prototype;

defineMissingGetter(sharedArrayBufferPrototype, 'growable', getSharedArrayBufferGrowable);
defineMissingGetter(sharedArrayBufferPrototype, 'byteLength', getSharedArrayBufferByteLength);
defineMissingGetter(
  sharedArrayBufferPrototype,
  'maxByteLength',
  getSharedArrayBufferMaxByteLength
);

if (typeof sharedArrayBufferPrototype.grow !== 'function') {
  sharedArrayBufferPrototype.grow = growSharedArrayBuffer;
}

if (typeof sharedArrayBufferPrototype.slice !== 'function') {
  sharedArrayBufferPrototype.slice = sliceSharedArrayBuffer;
}

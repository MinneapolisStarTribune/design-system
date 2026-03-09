// Polyfills for APIs that Storybook (and its dependencies) expect but
// React Native's JS engines do not provide.

if (typeof globalThis.SharedArrayBuffer === 'undefined') {
  function SharedArrayBuffer(byteLength) {
    return new ArrayBuffer(byteLength);
  }

  SharedArrayBuffer.prototype = Object.create(ArrayBuffer.prototype, {
    growable: {
      get() {
        return false;
      },
      configurable: true,
      enumerable: false,
    },
    maxByteLength: {
      get() {
        return this.byteLength;
      },
      configurable: true,
      enumerable: false,
    },
  });

  SharedArrayBuffer.prototype.constructor = SharedArrayBuffer;
  SharedArrayBuffer.prototype[Symbol.toStringTag] = 'SharedArrayBuffer';

  SharedArrayBuffer.prototype.grow = function () {
    throw new TypeError('SharedArrayBuffer.prototype.grow is not supported');
  };

  SharedArrayBuffer.prototype.slice = function (begin, end) {
    return ArrayBuffer.prototype.slice.call(this, begin, end);
  };

  globalThis.SharedArrayBuffer = SharedArrayBuffer;
}

'use strict';

const utils = require('../src/utils.js');

const {isVal, isObj, isFunc, isPromise, resolveThenable} = utils;

describe('utils', () => {
  describe('isVal', () => {
    test('null is not a val', () => {
      expect(isVal(null)).toBe(false);
    });

    test('undefined is not a val', () => {
      expect(isVal(undefined)).toBe(false);
    });

    test('a number is a val', () => {
      expect(isVal(3)).toBe(true);
    });

    test('0 is a val', () => {
      expect(isVal(0)).toBe(true);
    });

    test('NaN is a val', () => {
      expect(isVal(NaN)).toBe(true);
    });

    test('a string is a val', () => {
      expect(isVal('str')).toBe(true);
    });

    test('the empty string is a val', () => {
      expect(isVal('')).toBe(true);
    });

    test('true is a val', () => {
      expect(isVal(true)).toBe(true);
    });

    test('false is a val', () => {
      expect(isVal(false)).toBe(true);
    });

    test('a symbol is a val', () => {
      expect(isVal(Symbol())).toBe(true);
    });

    test('an object is a val', () => {
      expect(isVal({})).toBe(true);
    });

    test('a function is a val', () => {
      expect(isVal(() => {})).toBe(true);
    });
  });

  describe('isObj', () => {
    test('an object is an obj', () => {
      expect(isObj({})).toBe(true);
    });

    test('an object proxy is an obj', () => {
      expect(isObj(new Proxy({}, {}))).toBe(true);
    });

    test('an array is an obj', () => {
      expect(isObj([])).toBe(true);
    });

    test('null is not an obj', () => {
      expect(isObj(null)).toBe(false);
    });

    test('undefined is not an obj', () => {
      expect(isObj(undefined)).toBe(false);
    });

    test('a number is not an obj', () => {
      expect(isObj(3)).toBe(false);
    });

    test('a string is not an obj', () => {
      expect(isObj('str')).toBe(false);
    });

    test('a boolean is not an obj', () => {
      expect(isObj(true)).toBe(false);
    });

    test('a symbol is not an obj', () => {
      expect(isObj(Symbol())).toBe(false);
    });

    test('a function is not an obj', () => {
      expect(isObj(() => {})).toBe(false);
    });
  });

  describe('isFunc', () => {
    test('a traditional function is a func', () => {
      expect(isFunc(function () {})).toBe(true);
    });

    test('a function proxy is a func', () => {
      expect(isFunc(new Proxy(function () {}, {}))).toBe(true);
    });

    test('an arrow function is a func', () => {
      expect(isFunc(() => {})).toBe(true);
    });

    test('a class is a func', () => {
      expect(isFunc(class {})).toBe(true);
    });

    test('an async function is a func', () => {
      expect(isFunc(async () => {})).toBe(true);
    });

    test('a generator is a func', () => {
      expect(isFunc(function* () {})).toBe(true);
    });

    test('null is not a func', () => {
      expect(isFunc(null)).toBe(false);
    });

    test('undefined is not a func', () => {
      expect(isFunc(undefined)).toBe(false);
    });

    test('a number is not a func', () => {
      expect(isFunc(3)).toBe(false);
    });

    test('a string is not a func', () => {
      expect(isFunc('str')).toBe(false);
    });

    test('a boolean is not a func', () => {
      expect(isFunc(true)).toBe(false);
    });

    test('a symbol is not a func', () => {
      expect(isFunc(Symbol())).toBe(false);
    });

    test('an obj is not a func', () => {
      expect(isFunc({})).toBe(false);
    });
  });

  describe('isPromise', () => {
    test('a promise is a promise', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
    });

    test('a promise proxy is a promise', () => {
      expect(isPromise(new Proxy(Promise.resolve(), {}))).toBe(true);
    });

    test('a Promise subclass instance is a promise', () => {
      expect(isPromise(new class SubPromise extends Promise {}(() => {}))).toBe(true);
    });

    test('a thenable is a promise', () => {
      expect(isPromise({ then() {} })).toBe(true);
    });

    test('null is not a promise', () => {
      expect(isPromise(null)).toBe(false);
    });

    test('undefined is not a promise', () => {
      expect(isPromise(undefined)).toBe(false);
    });

    test('a number is not a promise', () => {
      expect(isPromise(3)).toBe(false);
    });

    test('a string is not a promise', () => {
      expect(isPromise('str')).toBe(false);
    });

    test('a boolean is not a promise', () => {
      expect(isPromise(true)).toBe(false);
    });

    test('a symbol is not a promise', () => {
      expect(isPromise(Symbol())).toBe(false);
    });

    test('an obj is not a promise', () => {
      expect(isPromise({})).toBe(false);
    });

    test('a function is not a promise', () => {
      expect(isPromise(() => {})).toBe(false);
    });
  });

  describe('resolveThenable', () => {
    test('a promise is the same as the result', () => {
      const promise = Promise.resolve();

      expect(resolveThenable(promise)).toBe(promise);
    });

    test('a promise proxy is the same as the result', () => {
      const promiseProxy = new Proxy(Promise.resolve(), {});

      expect(resolveThenable(promiseProxy)).toBe(promiseProxy);
    });

    test('an instance of a Promise subclass is the same as the result', () => {
      const subPromise = new class SubPromise extends Promise {}(() => {});

      expect(resolveThenable(subPromise)).toBe(subPromise);
    });

    test('a thenable is converted to a promise', () => {
      const thenable = { then() {} };
      const resolvedThenable = resolveThenable(thenable);

      expect(isPromise(resolvedThenable)).toBe(true);
      expect(resolvedThenable).not.toBe(thenable);
    });

    test('a thenable\'s conversion resolution is decided by the thenable', () => {
      expect.assertions(1);

      const resolutionValue = 200;

      return resolveThenable({ then(r) { r(resolutionValue); } }).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('null is resolved', () => {
      expect.assertions(1);

      const resolutionValue = null;

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('undefined is resolved', () => {
      expect.assertions(1);

      const resolutionValue = undefined;

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('a number is resolved', () => {
      expect.assertions(1);

      const resolutionValue = 3;

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('a string is resolved', () => {
      expect.assertions(1);

      const resolutionValue = 'str';

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('a boolean is resolved', () => {
      expect.assertions(1);

      const resolutionValue = true;

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('a symbol is resolved', () => {
      expect.assertions(1);

      const resolutionValue = Symbol();

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('an obj is resolved', () => {
      expect.assertions(1);

      const resolutionValue = {};

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });

    test('a function is resolved', () => {
      expect.assertions(1);

      const resolutionValue = () => {};

      return resolveThenable(resolutionValue).then((value) => {
        expect(value).toBe(resolutionValue);
      });
    });
  });
});

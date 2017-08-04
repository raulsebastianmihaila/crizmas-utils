(() => {
  'use strict';

  const isModule = typeof module === 'object' && typeof module.exports === 'object';

  const isVal = (val) => {
    return val !== null && val !== undefined;
  };

  const isObj = (val) => {
    return !!val && typeof val === 'object';
  };

  const isFunc = (val) => {
    return typeof val === 'function';
  };

  const isPromise = (val) => {
    return isObj(val) && isFunc(val.then);
  };

  const resolveThenable = (thenable) => {
    if (thenable instanceof Promise) {
      return thenable;
    }

    return Promise.resolve(thenable);
  };

  const moduleExports = {
    isVal,
    isObj,
    isFunc,
    isPromise,
    resolveThenable
  };

  if (isModule) {
    module.exports = moduleExports;
  } else {
    window.crizmas = window.crizmas || {};
    window.crizmas.utils = moduleExports;
  }
})();

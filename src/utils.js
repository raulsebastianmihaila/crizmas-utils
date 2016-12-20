(() => {
  'use strict';

  const isModule = typeof module === 'object' && typeof module.exports === 'object';

  function isObj(val) {
    return val && typeof val === 'object';
  }

  function isFunc(val) {
    return typeof val === 'function';
  }

  function isPromise(val) {
    return isObj(val) && isFunc(val.then);
  }

  function resolveThenable(thenable) {
    if (thenable instanceof Promise) {
      return thenable;
    }

    return Promise.resolve(thenable);
  }

  const moduleExports = {
    isObj,
    isFunc,
    isPromise,
    resolveThenable
  };

  if (isModule) {
    module.exports = moduleExports;
  } else {
    window.crizmasUtils = moduleExports;
  }
})();

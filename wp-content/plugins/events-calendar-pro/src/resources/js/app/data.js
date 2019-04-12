var tribe = typeof tribe === "object" ? tribe : {}; tribe["events-pro"] = tribe["events-pro"] || {}; tribe["events-pro"]["data"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 516);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) { var throwOnDirectAccess, isValidElement, REACT_ELEMENT_TYPE; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(236)();
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/io.js
var io = __webpack_require__(15);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/sagaHelpers/index.js + 4 modules
var sagaHelpers = __webpack_require__(58);

// CONCATENATED MODULE: ./node_modules/redux-saga/es/internal/io-helpers.js



function takeEvery(patternOrChannel, worker) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return io["f" /* fork */].apply(undefined, [sagaHelpers["a" /* takeEveryHelper */], patternOrChannel, worker].concat(args));
}

function takeLatest(patternOrChannel, worker) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  return io["f" /* fork */].apply(undefined, [sagaHelpers["b" /* takeLatestHelper */], patternOrChannel, worker].concat(args));
}

function throttle(ms, pattern, worker) {
  for (var _len3 = arguments.length, args = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
    args[_key3 - 3] = arguments[_key3];
  }

  return io["f" /* fork */].apply(undefined, [sagaHelpers["c" /* throttleHelper */], ms, pattern, worker].concat(args));
}
// CONCATENATED MODULE: ./node_modules/redux-saga/es/effects.js
/* concated harmony reexport take */__webpack_require__.d(__webpack_exports__, "h", function() { return io["j" /* take */]; });
/* unused concated harmony import takem */
/* concated harmony reexport put */__webpack_require__.d(__webpack_exports__, "e", function() { return io["g" /* put */]; });
/* concated harmony reexport all */__webpack_require__.d(__webpack_exports__, "a", function() { return io["b" /* all */]; });
/* concated harmony reexport race */__webpack_require__.d(__webpack_exports__, "f", function() { return io["h" /* race */]; });
/* concated harmony reexport call */__webpack_require__.d(__webpack_exports__, "b", function() { return io["d" /* call */]; });
/* unused concated harmony import apply */
/* unused concated harmony import cps */
/* concated harmony reexport fork */__webpack_require__.d(__webpack_exports__, "d", function() { return io["f" /* fork */]; });
/* unused concated harmony import spawn */
/* unused concated harmony import join */
/* concated harmony reexport cancel */__webpack_require__.d(__webpack_exports__, "c", function() { return io["e" /* cancel */]; });
/* concated harmony reexport select */__webpack_require__.d(__webpack_exports__, "g", function() { return io["i" /* select */]; });
/* unused concated harmony import actionChannel */
/* unused concated harmony import cancelled */
/* unused concated harmony import flush */
/* unused concated harmony import getContext */
/* unused concated harmony import setContext */
/* concated harmony reexport takeEvery */__webpack_require__.d(__webpack_exports__, "i", function() { return takeEvery; });
/* concated harmony reexport takeLatest */__webpack_require__.d(__webpack_exports__, "j", function() { return takeLatest; });
/* unused concated harmony import throttle */




/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return sym; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return TASK; });
/* unused harmony export HELPER */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MATCH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CANCEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SAGA_ACTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SELF_CANCELLATION; });
/* unused harmony export konst */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return kTrue; });
/* unused harmony export kFalse */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return noop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return ident; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return check; });
/* unused harmony export hasOwn */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return is; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return object; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return remove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return deferred; });
/* unused harmony export arrayOfDeffered */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return delay; });
/* unused harmony export createMockTask */
/* unused harmony export autoInc */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return uid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return makeIterator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return log; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return deprecate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return updateIncentive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return internalErr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return createSetContextWarning; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return wrapSagaDispatch; });
/* unused harmony export cloneableGenerator */
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var sym = function sym(id) {
  return '@@redux-saga/' + id;
};

var TASK = /*#__PURE__*/sym('TASK');
var HELPER = /*#__PURE__*/sym('HELPER');
var MATCH = /*#__PURE__*/sym('MATCH');
var CANCEL = /*#__PURE__*/sym('CANCEL_PROMISE');
var SAGA_ACTION = /*#__PURE__*/sym('SAGA_ACTION');
var SELF_CANCELLATION = /*#__PURE__*/sym('SELF_CANCELLATION');
var konst = function konst(v) {
  return function () {
    return v;
  };
};
var kTrue = /*#__PURE__*/konst(true);
var kFalse = /*#__PURE__*/konst(false);
var noop = function noop() {};
var ident = function ident(v) {
  return v;
};

function check(value, predicate, error) {
  if (!predicate(value)) {
    log('error', 'uncaught at check', error);
    throw new Error(error);
  }
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(object, property) {
  return is.notUndef(object) && hasOwnProperty.call(object, property);
}

var is = {
  undef: function undef(v) {
    return v === null || v === undefined;
  },
  notUndef: function notUndef(v) {
    return v !== null && v !== undefined;
  },
  func: function func(f) {
    return typeof f === 'function';
  },
  number: function number(n) {
    return typeof n === 'number';
  },
  string: function string(s) {
    return typeof s === 'string';
  },
  array: Array.isArray,
  object: function object(obj) {
    return obj && !is.array(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
  },
  promise: function promise(p) {
    return p && is.func(p.then);
  },
  iterator: function iterator(it) {
    return it && is.func(it.next) && is.func(it.throw);
  },
  iterable: function iterable(it) {
    return it && is.func(Symbol) ? is.func(it[Symbol.iterator]) : is.array(it);
  },
  task: function task(t) {
    return t && t[TASK];
  },
  observable: function observable(ob) {
    return ob && is.func(ob.subscribe);
  },
  buffer: function buffer(buf) {
    return buf && is.func(buf.isEmpty) && is.func(buf.take) && is.func(buf.put);
  },
  pattern: function pattern(pat) {
    return pat && (is.string(pat) || (typeof pat === 'undefined' ? 'undefined' : _typeof(pat)) === 'symbol' || is.func(pat) || is.array(pat));
  },
  channel: function channel(ch) {
    return ch && is.func(ch.take) && is.func(ch.close);
  },
  helper: function helper(it) {
    return it && it[HELPER];
  },
  stringableFunc: function stringableFunc(f) {
    return is.func(f) && hasOwn(f, 'toString');
  }
};

var object = {
  assign: function assign(target, source) {
    for (var i in source) {
      if (hasOwn(source, i)) {
        target[i] = source[i];
      }
    }
  }
};

function remove(array, item) {
  var index = array.indexOf(item);
  if (index >= 0) {
    array.splice(index, 1);
  }
}

var array = {
  from: function from(obj) {
    var arr = Array(obj.length);
    for (var i in obj) {
      if (hasOwn(obj, i)) {
        arr[i] = obj[i];
      }
    }
    return arr;
  }
};

function deferred() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var def = _extends({}, props);
  var promise = new Promise(function (resolve, reject) {
    def.resolve = resolve;
    def.reject = reject;
  });
  def.promise = promise;
  return def;
}

function arrayOfDeffered(length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(deferred());
  }
  return arr;
}

function delay(ms) {
  var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var timeoutId = void 0;
  var promise = new Promise(function (resolve) {
    timeoutId = setTimeout(function () {
      return resolve(val);
    }, ms);
  });

  promise[CANCEL] = function () {
    return clearTimeout(timeoutId);
  };

  return promise;
}

function createMockTask() {
  var _ref;

  var running = true;
  var _result = void 0,
      _error = void 0;

  return _ref = {}, _ref[TASK] = true, _ref.isRunning = function isRunning() {
    return running;
  }, _ref.result = function result() {
    return _result;
  }, _ref.error = function error() {
    return _error;
  }, _ref.setRunning = function setRunning(b) {
    return running = b;
  }, _ref.setResult = function setResult(r) {
    return _result = r;
  }, _ref.setError = function setError(e) {
    return _error = e;
  }, _ref;
}

function autoInc() {
  var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  return function () {
    return ++seed;
  };
}

var uid = /*#__PURE__*/autoInc();

var kThrow = function kThrow(err) {
  throw err;
};
var kReturn = function kReturn(value) {
  return { value: value, done: true };
};
function makeIterator(next) {
  var thro = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : kThrow;
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var isHelper = arguments[3];

  var iterator = { name: name, next: next, throw: thro, return: kReturn };

  if (isHelper) {
    iterator[HELPER] = true;
  }
  if (typeof Symbol !== 'undefined') {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }
  return iterator;
}

/**
  Print error in a useful way whether in a browser environment
  (with expandable error stack traces), or in a node.js environment
  (text-only log output)
 **/
function log(level, message) {
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  /*eslint-disable no-console*/
  if (typeof window === 'undefined') {
    console.log('redux-saga ' + level + ': ' + message + '\n' + (error && error.stack || error));
  } else {
    console[level](message, error);
  }
}

function deprecate(fn, deprecationWarning) {
  return function () {
    if (false) {}
    return fn.apply(undefined, arguments);
  };
}

var updateIncentive = function updateIncentive(deprecated, preferred) {
  return deprecated + ' has been deprecated in favor of ' + preferred + ', please update your code';
};

var internalErr = function internalErr(err) {
  return new Error('\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project\'s github repo.\n  Error: ' + err + '\n');
};

var createSetContextWarning = function createSetContextWarning(ctx, props) {
  return (ctx ? ctx + '.' : '') + 'setContext(props): argument ' + props + ' is not a plain object';
};

var wrapSagaDispatch = function wrapSagaDispatch(dispatch) {
  return function (action) {
    return dispatch(Object.defineProperty(action, SAGA_ACTION, { value: true }));
  };
};

var cloneableGenerator = function cloneableGenerator(generatorFunc) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var history = [];
    var gen = generatorFunc.apply(undefined, args);
    return {
      next: function next(arg) {
        history.push(arg);
        return gen.next(arg);
      },
      clone: function clone() {
        var clonedGen = cloneableGenerator(generatorFunc).apply(undefined, args);
        history.forEach(function (arg) {
          return clonedGen.next(arg);
        });
        return clonedGen;
      },
      return: function _return(value) {
        return gen.return(value);
      },
      throw: function _throw(exception) {
        return gen.throw(exception);
      }
    };
  };
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = wp.i18n;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.defaultMemoize = defaultMemoize;
exports.createSelectorCreator = createSelectorCreator;
exports.createStructuredSelector = createStructuredSelector;
function defaultEqualityCheck(a, b) {
  return a === b;
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  var length = prev.length;
  for (var i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

function defaultMemoize(func) {
  var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;

  var lastArgs = null;
  var lastResult = null;
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments);
    }

    lastArgs = arguments;
    return lastResult;
  };
}

function getDependencies(funcs) {
  var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

  if (!dependencies.every(function (dep) {
    return typeof dep === 'function';
  })) {
    var dependencyTypes = dependencies.map(function (dep) {
      return typeof dep;
    }).join(', ');
    throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
  }

  return dependencies;
}

function createSelectorCreator(memoize) {
  for (var _len = arguments.length, memoizeOptions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    memoizeOptions[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      funcs[_key2] = arguments[_key2];
    }

    var recomputations = 0;
    var resultFunc = funcs.pop();
    var dependencies = getDependencies(funcs);

    var memoizedResultFunc = memoize.apply(undefined, [function () {
      recomputations++;
      // apply arguments instead of spreading for performance.
      return resultFunc.apply(null, arguments);
    }].concat(memoizeOptions));

    // If a selector is called with the exact same arguments we don't need to traverse our dependencies again.
    var selector = defaultMemoize(function () {
      var params = [];
      var length = dependencies.length;

      for (var i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments));
      }

      // apply arguments instead of spreading for performance.
      return memoizedResultFunc.apply(null, params);
    });

    selector.resultFunc = resultFunc;
    selector.recomputations = function () {
      return recomputations;
    };
    selector.resetRecomputations = function () {
      return recomputations = 0;
    };
    return selector;
  };
}

var createSelector = exports.createSelector = createSelectorCreator(defaultMemoize);

function createStructuredSelector(selectors) {
  var selectorCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : createSelector;

  if (typeof selectors !== 'object') {
    throw new Error('createStructuredSelector expects first argument to be an object ' + ('where each property is a selector, instead received a ' + typeof selectors));
  }
  var objectKeys = Object.keys(selectors);
  return selectorCreator(objectKeys.map(function (key) {
    return selectors[key];
  }), function () {
    for (var _len3 = arguments.length, values = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      values[_key3] = arguments[_key3];
    }

    return values.reduce(function (composition, value, index) {
      composition[objectKeys[index]] = value;
      return composition;
    }, {});
  });
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAILY", function() { return DAILY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEEKLY", function() { return WEEKLY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONTHLY", function() { return MONTHLY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YEARLY", function() { return YEARLY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SINGLE", function() { return SINGLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAILY_LABEL", function() { return DAILY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEEKLY_LABEL", function() { return WEEKLY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONTHLY_LABEL", function() { return MONTHLY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YEARLY_LABEL", function() { return YEARLY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAILY_LABEL_PLURAL", function() { return DAILY_LABEL_PLURAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEEKLY_LABEL_PLURAL", function() { return WEEKLY_LABEL_PLURAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONTHLY_LABEL_PLURAL", function() { return MONTHLY_LABEL_PLURAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YEARLY_LABEL_PLURAL", function() { return YEARLY_LABEL_PLURAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SINGLE_LABEL", function() { return SINGLE_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECURRENCE_TYPES", function() { return RECURRENCE_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ON", function() { return ON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AFTER", function() { return AFTER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NEVER", function() { return NEVER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ON_LABEL", function() { return ON_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AFTER_LABEL", function() { return AFTER_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NEVER_LABEL", function() { return NEVER_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DATE", function() { return DATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COUNT", function() { return COUNT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUNDAY", function() { return SUNDAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONDAY", function() { return MONDAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TUESDAY", function() { return TUESDAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEDNESDAY", function() { return WEDNESDAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "THURSDAY", function() { return THURSDAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FRIDAY", function() { return FRIDAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SATURDAY", function() { return SATURDAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUNDAY_LABEL", function() { return SUNDAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONDAY_LABEL", function() { return MONDAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TUESDAY_LABEL", function() { return TUESDAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEDNESDAY_LABEL", function() { return WEDNESDAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "THURSDAY_LABEL", function() { return THURSDAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FRIDAY_LABEL", function() { return FRIDAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SATURDAY_LABEL", function() { return SATURDAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUNDAY_ABBR", function() { return SUNDAY_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONDAY_ABBR", function() { return MONDAY_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TUESDAY_ABBR", function() { return TUESDAY_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEDNESDAY_ABBR", function() { return WEDNESDAY_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "THURSDAY_ABBR", function() { return THURSDAY_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FRIDAY_ABBR", function() { return FRIDAY_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SATURDAY_ABBR", function() { return SATURDAY_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUNDAY_CHECKED", function() { return SUNDAY_CHECKED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONDAY_CHECKED", function() { return MONDAY_CHECKED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TUESDAY_CHECKED", function() { return TUESDAY_CHECKED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEDNESDAY_CHECKED", function() { return WEDNESDAY_CHECKED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "THURSDAY_CHECKED", function() { return THURSDAY_CHECKED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FRIDAY_CHECKED", function() { return FRIDAY_CHECKED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SATURDAY_CHECKED", function() { return SATURDAY_CHECKED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAYS_OF_THE_WEEK_PROP_KEYS", function() { return DAYS_OF_THE_WEEK_PROP_KEYS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAYS_OF_THE_WEEK_MAPPING_TO_STATE", function() { return DAYS_OF_THE_WEEK_MAPPING_TO_STATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAYS_OF_THE_WEEK_MAPPING_FROM_STATE", function() { return DAYS_OF_THE_WEEK_MAPPING_FROM_STATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAYS_OF_THE_WEEK_PROP_KEY_MAPPING_FROM_STATE", function() { return DAYS_OF_THE_WEEK_PROP_KEY_MAPPING_FROM_STATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAYS_OF_THE_MONTH", function() { return DAYS_OF_THE_MONTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAY", function() { return DAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAY_LABEL", function() { return DAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIRST", function() { return FIRST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SECOND", function() { return SECOND; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "THIRD", function() { return THIRD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FOURTH", function() { return FOURTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIFTH", function() { return FIFTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LAST", function() { return LAST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIRST_LABEL", function() { return FIRST_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SECOND_LABEL", function() { return SECOND_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "THIRD_LABEL", function() { return THIRD_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FOURTH_LABEL", function() { return FOURTH_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIFTH_LABEL", function() { return FIFTH_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LAST_LABEL", function() { return LAST_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEEKS_OF_THE_MONTH", function() { return WEEKS_OF_THE_MONTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEEK_NUM_MAPPING_TO_WEEKS_OF_THE_MONTH", function() { return WEEK_NUM_MAPPING_TO_WEEKS_OF_THE_MONTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JANUARY", function() { return JANUARY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FEBRUARY", function() { return FEBRUARY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MARCH", function() { return MARCH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APRIL", function() { return APRIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAY", function() { return MAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JUNE", function() { return JUNE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JULY", function() { return JULY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUGUST", function() { return AUGUST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEPTEMBER", function() { return SEPTEMBER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OCTOBER", function() { return OCTOBER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOVEMBER", function() { return NOVEMBER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DECEMBER", function() { return DECEMBER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JANUARY_LABEL", function() { return JANUARY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FEBRUARY_LABEL", function() { return FEBRUARY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MARCH_LABEL", function() { return MARCH_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APRIL_LABEL", function() { return APRIL_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAY_LABEL", function() { return MAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JUNE_LABEL", function() { return JUNE_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JULY_LABEL", function() { return JULY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUGUST_LABEL", function() { return AUGUST_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEPTEMBER_LABEL", function() { return SEPTEMBER_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OCTOBER_LABEL", function() { return OCTOBER_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOVEMBER_LABEL", function() { return NOVEMBER_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DECEMBER_LABEL", function() { return DECEMBER_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JANUARY_ABBR", function() { return JANUARY_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FEBRUARY_ABBR", function() { return FEBRUARY_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MARCH_ABBR", function() { return MARCH_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APRIL_ABBR", function() { return APRIL_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAY_ABBR", function() { return MAY_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JUNE_ABBR", function() { return JUNE_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JULY_ABBR", function() { return JULY_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUGUST_ABBR", function() { return AUGUST_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEPTEMBER_ABBR", function() { return SEPTEMBER_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OCTOBER_ABBR", function() { return OCTOBER_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOVEMBER_ABBR", function() { return NOVEMBER_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DECEMBER_ABBR", function() { return DECEMBER_ABBR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONTHS_OF_THE_YEAR_MAPPING_TO_STATE", function() { return MONTHS_OF_THE_YEAR_MAPPING_TO_STATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONTHS_OF_THE_YEAR_MAPPING_FROM_STATE", function() { return MONTHS_OF_THE_YEAR_MAPPING_FROM_STATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NEXT_DAY", function() { return NEXT_DAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SECOND_DAY", function() { return SECOND_DAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "THIRD_DAY", function() { return THIRD_DAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FOURTH_DAY", function() { return FOURTH_DAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIFTH_DAY", function() { return FIFTH_DAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SIXTH_DAY", function() { return SIXTH_DAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEVENTH_DAY", function() { return SEVENTH_DAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NEXT_DAY_LABEL", function() { return NEXT_DAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SECOND_DAY_LABEL", function() { return SECOND_DAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "THIRD_DAY_LABEL", function() { return THIRD_DAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FOURTH_DAY_LABEL", function() { return FOURTH_DAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIFTH_DAY_LABEL", function() { return FIFTH_DAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SIXTH_DAY_LABEL", function() { return SIXTH_DAY_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEVENTH_DAY_LABEL", function() { return SEVENTH_DAY_LABEL; });
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_invert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(141);
/* harmony import */ var lodash_invert__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_invert__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);

 /**
                                      * External dependencies
                                      */

var _DAYS_OF_THE_WEEK_MAP, _MONTHS_OF_THE_YEAR_M;



//
// ─── RECURRENCE TYPES ───────────────────────────────────────────────────────────
//

var DAILY = 'daily';
var WEEKLY = 'weekly';
var MONTHLY = 'monthly';
var YEARLY = 'yearly';
var SINGLE = 'single';

var DAILY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Day', 'tribe-events-calendar-pro');
var WEEKLY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Week', 'tribe-events-calendar-pro');
var MONTHLY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Month', 'tribe-events-calendar-pro');
var YEARLY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Year', 'tribe-events-calendar-pro');

var DAILY_LABEL_PLURAL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Days', 'tribe-events-calendar-pro');
var WEEKLY_LABEL_PLURAL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Weeks', 'tribe-events-calendar-pro');
var MONTHLY_LABEL_PLURAL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Months', 'tribe-events-calendar-pro');
var YEARLY_LABEL_PLURAL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Years', 'tribe-events-calendar-pro');

var SINGLE_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Single Recurrence', 'tribe-events-calendar-pro');

var RECURRENCE_TYPES = [DAILY, WEEKLY, MONTHLY, YEARLY, SINGLE];

//
// ─── SERIES END TYPES ───────────────────────────────────────────────────────────
//

var ON = 'on';
var AFTER = 'after';
var NEVER = 'never';

var ON_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('On', 'tribe-events-calendar-pro');
var AFTER_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('After', 'tribe-events-calendar-pro');
var NEVER_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Never', 'tribe-events-calendar-pro');

var DATE = 'date';
var COUNT = 'count';

//
// ─── DAYS OF THE WEEK ───────────────────────────────────────────────────────────
//

var SUNDAY = 'sunday';
var MONDAY = 'monday';
var TUESDAY = 'tuesday';
var WEDNESDAY = 'wednesday';
var THURSDAY = 'thursday';
var FRIDAY = 'friday';
var SATURDAY = 'saturday';

var SUNDAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Sunday', 'tribe-events-calendar-pro');
var MONDAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Monday', 'tribe-events-calendar-pro');
var TUESDAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Tuesday', 'tribe-events-calendar-pro');
var WEDNESDAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Wednesday', 'tribe-events-calendar-pro');
var THURSDAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Thursday', 'tribe-events-calendar-pro');
var FRIDAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Friday', 'tribe-events-calendar-pro');
var SATURDAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Saturday', 'tribe-events-calendar-pro');

var SUNDAY_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('S', 'tribe-events-calendar-pro');
var MONDAY_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('M', 'tribe-events-calendar-pro');
var TUESDAY_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('T', 'tribe-events-calendar-pro');
var WEDNESDAY_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('W', 'tribe-events-calendar-pro');
var THURSDAY_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('T', 'tribe-events-calendar-pro');
var FRIDAY_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('F', 'tribe-events-calendar-pro');
var SATURDAY_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('S', 'tribe-events-calendar-pro');

var SUNDAY_CHECKED = 'sundayChecked';
var MONDAY_CHECKED = 'mondayChecked';
var TUESDAY_CHECKED = 'tuesdayChecked';
var WEDNESDAY_CHECKED = 'wednesdayChecked';
var THURSDAY_CHECKED = 'thursdayChecked';
var FRIDAY_CHECKED = 'fridayChecked';
var SATURDAY_CHECKED = 'saturdayChecked';

var DAYS_OF_THE_WEEK_PROP_KEYS = [SUNDAY_CHECKED, MONDAY_CHECKED, TUESDAY_CHECKED, WEDNESDAY_CHECKED, THURSDAY_CHECKED, FRIDAY_CHECKED, SATURDAY_CHECKED];

var DAYS_OF_THE_WEEK_MAPPING_TO_STATE = (_DAYS_OF_THE_WEEK_MAP = {}, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_DAYS_OF_THE_WEEK_MAP, MONDAY, 1), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_DAYS_OF_THE_WEEK_MAP, TUESDAY, 2), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_DAYS_OF_THE_WEEK_MAP, WEDNESDAY, 3), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_DAYS_OF_THE_WEEK_MAP, THURSDAY, 4), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_DAYS_OF_THE_WEEK_MAP, FRIDAY, 5), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_DAYS_OF_THE_WEEK_MAP, SATURDAY, 6), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_DAYS_OF_THE_WEEK_MAP, SUNDAY, 7), _DAYS_OF_THE_WEEK_MAP);

var DAYS_OF_THE_WEEK_MAPPING_FROM_STATE = lodash_invert__WEBPACK_IMPORTED_MODULE_1___default()(DAYS_OF_THE_WEEK_MAPPING_TO_STATE);

var DAYS_OF_THE_WEEK_PROP_KEY_MAPPING_FROM_STATE = {
	1: MONDAY_CHECKED,
	2: TUESDAY_CHECKED,
	3: WEDNESDAY_CHECKED,
	4: THURSDAY_CHECKED,
	5: FRIDAY_CHECKED,
	6: SATURDAY_CHECKED,
	7: SUNDAY_CHECKED
};

//
// ─── DAYS OF THE MONTH ──────────────────────────────────────────────────────────
//

// returns an array from 1 - 31
var DAYS_OF_THE_MONTH = Array(31).fill().map(function (_, index) {
	return index + 1;
});

var DAY = 'day';
var DAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Day', 'tribe-events-calendar-pro');

//
// ─── WEEKS OF THE MONTH ─────────────────────────────────────────────────────────
//

var FIRST = 'first';
var SECOND = 'second';
var THIRD = 'third';
var FOURTH = 'fourth';
var FIFTH = 'fifth';
var LAST = 'last';

var FIRST_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('First', 'tribe-events-calendar-pro');
var SECOND_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Second', 'tribe-events-calendar-pro');
var THIRD_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Third', 'tribe-events-calendar-pro');
var FOURTH_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Fourth', 'tribe-events-calendar-pro');
var FIFTH_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Fifth', 'tribe-events-calendar-pro');
var LAST_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Last', 'tribe-events-calendar-pro');

var WEEKS_OF_THE_MONTH = [FIRST, SECOND, THIRD, FOURTH, FIFTH, LAST];
var WEEK_NUM_MAPPING_TO_WEEKS_OF_THE_MONTH = {
	1: FIRST,
	2: SECOND,
	3: THIRD,
	4: FOURTH,
	5: FIFTH
};

//
// ─── MONTHS OF THE YEAR ─────────────────────────────────────────────────────────
//

var JANUARY = 'january';
var FEBRUARY = 'february';
var MARCH = 'march';
var APRIL = 'april';
var MAY = 'may';
var JUNE = 'june';
var JULY = 'july';
var AUGUST = 'august';
var SEPTEMBER = 'september';
var OCTOBER = 'october';
var NOVEMBER = 'november';
var DECEMBER = 'december';

var JANUARY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('January', 'tribe-events-calendar-pro');
var FEBRUARY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('February', 'tribe-events-calendar-pro');
var MARCH_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('March', 'tribe-events-calendar-pro');
var APRIL_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('April', 'tribe-events-calendar-pro');
var MAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('May', 'tribe-events-calendar-pro');
var JUNE_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('June', 'tribe-events-calendar-pro');
var JULY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('July', 'tribe-events-calendar-pro');
var AUGUST_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('August', 'tribe-events-calendar-pro');
var SEPTEMBER_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('September', 'tribe-events-calendar-pro');
var OCTOBER_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('October', 'tribe-events-calendar-pro');
var NOVEMBER_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('November', 'tribe-events-calendar-pro');
var DECEMBER_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('December', 'tribe-events-calendar-pro');

var JANUARY_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Jan', 'tribe-events-calendar-pro');
var FEBRUARY_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Feb', 'tribe-events-calendar-pro');
var MARCH_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Mar', 'tribe-events-calendar-pro');
var APRIL_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Apr', 'tribe-events-calendar-pro');
var MAY_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('May', 'tribe-events-calendar-pro');
var JUNE_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Jun', 'tribe-events-calendar-pro');
var JULY_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Jul', 'tribe-events-calendar-pro');
var AUGUST_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Aug', 'tribe-events-calendar-pro');
var SEPTEMBER_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Sep', 'tribe-events-calendar-pro');
var OCTOBER_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Oct', 'tribe-events-calendar-pro');
var NOVEMBER_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Nov', 'tribe-events-calendar-pro');
var DECEMBER_ABBR = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Dec', 'tribe-events-calendar-pro');

var MONTHS_OF_THE_YEAR_MAPPING_TO_STATE = (_MONTHS_OF_THE_YEAR_M = {}, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, JANUARY, 1), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, FEBRUARY, 2), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, MARCH, 3), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, APRIL, 4), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, MAY, 5), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, JUNE, 6), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, JULY, 7), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, AUGUST, 8), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, SEPTEMBER, 9), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, OCTOBER, 10), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, NOVEMBER, 11), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_MONTHS_OF_THE_YEAR_M, DECEMBER, 12), _MONTHS_OF_THE_YEAR_M);

var MONTHS_OF_THE_YEAR_MAPPING_FROM_STATE = lodash_invert__WEBPACK_IMPORTED_MODULE_1___default()(MONTHS_OF_THE_YEAR_MAPPING_TO_STATE);

//
// ─── RECURRING MULTI DAY ────────────────────────────────────────────────────────
//

var NEXT_DAY = 'next_day';
var SECOND_DAY = 'second_day';
var THIRD_DAY = 'third_day';
var FOURTH_DAY = 'fourth_day';
var FIFTH_DAY = 'fifth_day';
var SIXTH_DAY = 'sixth_day';
var SEVENTH_DAY = 'seventh_day';

var NEXT_DAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Next day', 'tribe-events-calendar-pro');
var SECOND_DAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('2nd day', 'tribe-events-calendar-pro');
var THIRD_DAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('3rd day', 'tribe-events-calendar-pro');
var FOURTH_DAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('4th day', 'tribe-events-calendar-pro');
var FIFTH_DAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('5th day', 'tribe-events-calendar-pro');
var SIXTH_DAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('6th day', 'tribe-events-calendar-pro');
var SEVENTH_DAY_LABEL = Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('7th day', 'tribe-events-calendar-pro');

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(223);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var actions_namespaceObject = {};
__webpack_require__.r(actions_namespaceObject);
__webpack_require__.d(actions_namespaceObject, "addField", function() { return actions_addField; });
__webpack_require__.d(actions_namespaceObject, "addRule", function() { return actions_addRule; });
__webpack_require__.d(actions_namespaceObject, "removeField", function() { return actions_removeField; });
__webpack_require__.d(actions_namespaceObject, "removeRule", function() { return actions_removeRule; });
__webpack_require__.d(actions_namespaceObject, "editRule", function() { return editRule; });
__webpack_require__.d(actions_namespaceObject, "syncRule", function() { return syncRule; });
__webpack_require__.d(actions_namespaceObject, "syncRulesFromDB", function() { return actions_syncRulesFromDB; });

// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/reducer.js
var reducer = __webpack_require__(97);

// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/types.js
var types = __webpack_require__(25);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/extends.js
var helpers_extends = __webpack_require__(18);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);

// EXTERNAL MODULE: ./node_modules/lodash/fp/curry.js
var curry = __webpack_require__(67);
var curry_default = /*#__PURE__*/__webpack_require__.n(curry);

// CONCATENATED MODULE: ./src/modules/data/blocks/recurring/actions.js

 /**
                                       * External dependencies
                                       */

/**
 * Internal dependencies
 */


var actions_addField = function addField() {
	return {
		type: types["ADD_RULE_FIELD"]
	};
};

var actions_addRule = function addRule(payload) {
	return {
		type: types["ADD_RULE"],
		payload: payload
	};
};

var actions_removeField = function removeField() {
	return {
		type: types["REMOVE_RULE_FIELD"]
	};
};

var actions_removeRule = function removeRule(index) {
	return {
		type: types["REMOVE_RULE"],
		index: index
	};
};

var editRule = curry_default()(function (index, payload) {
	return {
		type: types["EDIT_RULE"],
		index: index,
		payload: payload
	};
});

var syncRule = curry_default()(function (index, payload) {
	return extends_default()({}, editRule(index, payload), {
		sync: true
	});
});

var actions_syncRulesFromDB = function syncRulesFromDB(payload) {
	return {
		type: types["SYNC_RULES_FROM_DB"],
		payload: payload
	};
};
// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/selectors.js
var selectors = __webpack_require__(52);

// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/constants.js
var constants = __webpack_require__(5);

// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/options.js
var options = __webpack_require__(56);

// EXTERNAL MODULE: ./node_modules/babel-runtime/regenerator/index.js
var regenerator = __webpack_require__(11);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./node_modules/lodash/keys.js
var keys = __webpack_require__(40);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/effects.js + 1 modules
var effects = __webpack_require__(1);

// EXTERNAL MODULE: ./src/modules/data/blocks/constants.js
var blocks_constants = __webpack_require__(12);

// EXTERNAL MODULE: ./src/modules/data/ui/index.js + 4 modules
var ui = __webpack_require__(43);

// EXTERNAL MODULE: ./src/modules/data/shared/sagas.js
var sagas = __webpack_require__(34);

// EXTERNAL MODULE: external "tribe.events.data"
var external_tribe_events_data_ = __webpack_require__(27);

// CONCATENATED MODULE: ./src/modules/data/blocks/recurring/sagas.js




var _marked = /*#__PURE__*/regenerator_default.a.mark(handleRuleRemoval),
    _marked2 = /*#__PURE__*/regenerator_default.a.mark(handleRuleEdit),
    _marked3 = /*#__PURE__*/regenerator_default.a.mark(syncRules),
    _marked4 = /*#__PURE__*/regenerator_default.a.mark(watchers);

/**
 * External dependencies
 */



/**
 * Internal dependencies
 */








var sagaArgs = {
	actions: {
		add: actions_addRule,
		sync: syncRule
	},
	selectors: selectors
};

function handleRuleRemoval() {
	var rules;
	return regenerator_default.a.wrap(function handleRuleRemoval$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return Object(effects["g" /* select */])(selectors["getRules"]);

				case 2:
					rules = _context.sent;

					if (rules.length) {
						_context.next = 6;
						break;
					}

					_context.next = 6;
					return Object(effects["e" /* put */])(ui["a" /* actions */].hideRulePanel());

				case 6:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked, this);
}

function handleRuleEdit(action) {
	var fieldKeys, i, fieldKey;
	return regenerator_default.a.wrap(function handleRuleEdit$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					if (!action.sync) {
						_context2.next = 2;
						break;
					}

					return _context2.abrupt('return');

				case 2:
					_context2.next = 4;
					return Object(effects["b" /* call */])(keys_default.a, action.payload);

				case 4:
					fieldKeys = _context2.sent;
					i = 0;

				case 6:
					if (!(i < fieldKeys.length)) {
						_context2.next = 27;
						break;
					}

					fieldKey = fieldKeys[i];
					_context2.t0 = fieldKey;
					_context2.next = _context2.t0 === blocks_constants["KEY_START_TIME"] ? 11 : _context2.t0 === blocks_constants["KEY_END_TIME"] ? 11 : _context2.t0 === blocks_constants["KEY_MULTI_DAY"] ? 14 : _context2.t0 === blocks_constants["KEY_WEEK"] ? 17 : _context2.t0 === blocks_constants["KEY_LIMIT_TYPE"] ? 20 : 23;
					break;

				case 11:
					_context2.next = 13;
					return Object(effects["b" /* call */])(sagas["d" /* handleTimeChange */], sagaArgs, action, fieldKey);

				case 13:
					return _context2.abrupt('break', 24);

				case 14:
					_context2.next = 16;
					return Object(effects["b" /* call */])(sagas["c" /* handleMultiDayChange */], sagaArgs, action, fieldKey);

				case 16:
					return _context2.abrupt('break', 24);

				case 17:
					_context2.next = 19;
					return Object(effects["b" /* call */])(sagas["f" /* handleWeekChange */], sagaArgs, action, fieldKey);

				case 19:
					return _context2.abrupt('break', 24);

				case 20:
					_context2.next = 22;
					return Object(effects["b" /* call */])(sagas["b" /* handleLimitTypeChange */], sagaArgs, action, fieldKey);

				case 22:
					return _context2.abrupt('break', 24);

				case 23:
					return _context2.abrupt('break', 24);

				case 24:
					i++;
					_context2.next = 6;
					break;

				case 27:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked2, this);
}

function syncRules(action) {
	var rules, i, _action;

	return regenerator_default.a.wrap(function syncRules$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					_context3.next = 2;
					return Object(effects["g" /* select */])(selectors["getRules"]);

				case 2:
					rules = _context3.sent;
					i = 0;

				case 4:
					if (!(i < rules.length)) {
						_context3.next = 16;
						break;
					}

					_action = extends_default()({ index: i }, action);
					_context3.t0 = action.type;
					_context3.next = _context3.t0 === external_tribe_events_data_["blocks"].datetime.types.SET_TIME_ZONE ? 9 : 12;
					break;

				case 9:
					_context3.next = 11;
					return Object(effects["b" /* call */])(sagas["e" /* handleTimezoneChange */], sagaArgs, _action, 'timeZone');

				case 11:
					return _context3.abrupt('break', 13);

				case 12:
					return _context3.abrupt('break', 13);

				case 13:
					i++;
					_context3.next = 4;
					break;

				case 16:
				case 'end':
					return _context3.stop();
			}
		}
	}, _marked3, this);
}

function watchers() {
	return regenerator_default.a.wrap(function watchers$(_context4) {
		while (1) {
			switch (_context4.prev = _context4.next) {
				case 0:
					_context4.next = 2;
					return Object(effects["i" /* takeEvery */])([types["REMOVE_RULE"]], handleRuleRemoval);

				case 2:
					_context4.next = 4;
					return Object(effects["i" /* takeEvery */])([types["ADD_RULE_FIELD"]], sagas["a" /* handleAddition */], sagaArgs);

				case 4:
					_context4.next = 6;
					return Object(effects["i" /* takeEvery */])([types["EDIT_RULE"]], handleRuleEdit);

				case 6:
					_context4.next = 8;
					return Object(effects["i" /* takeEvery */])([external_tribe_events_data_["blocks"].datetime.types.SET_TIME_ZONE], syncRules);

				case 8:
				case 'end':
					return _context4.stop();
			}
		}
	}, _marked4, this);
}
// CONCATENATED MODULE: ./src/modules/data/blocks/recurring/index.js
/* concated harmony reexport types */__webpack_require__.d(__webpack_exports__, "types", function() { return types; });
/* concated harmony reexport actions */__webpack_require__.d(__webpack_exports__, "actions", function() { return actions_namespaceObject; });
/* concated harmony reexport selectors */__webpack_require__.d(__webpack_exports__, "selectors", function() { return selectors; });
/* concated harmony reexport options */__webpack_require__.d(__webpack_exports__, "options", function() { return options; });
/* concated harmony reexport constants */__webpack_require__.d(__webpack_exports__, "constants", function() { return constants; });
/* concated harmony reexport sagas */__webpack_require__.d(__webpack_exports__, "sagas", function() { return watchers; });
/**
 * Internal dependencies
 */








/* harmony default export */ var recurring = __webpack_exports__["default"] = (reducer["a" /* default */]);


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/modules/data/blocks/constants.js
var constants = __webpack_require__(12);

// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/index.js + 2 modules
var recurring = __webpack_require__(7);

// EXTERNAL MODULE: ./node_modules/redux/es/redux.js
var redux = __webpack_require__(19);

// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/reducer.js
var reducer = __webpack_require__(97);

// EXTERNAL MODULE: ./src/modules/data/blocks/exception/reducer.js
var exception_reducer = __webpack_require__(98);

// EXTERNAL MODULE: ./src/modules/data/blocks/additional-fields/index.js + 7 modules
var additional_fields = __webpack_require__(13);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/extends.js
var helpers_extends = __webpack_require__(18);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);

// EXTERNAL MODULE: external {"var":"wp.i18n","root":["wp","i18n"]}
var external_var_wp_i18n_root_wp_i18n_ = __webpack_require__(3);

// EXTERNAL MODULE: ./src/modules/data/blocks/related-events/types.js
var types = __webpack_require__(41);

// CONCATENATED MODULE: ./src/modules/data/blocks/related-events/reducer.js

/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */


var DEFAULT_STATE = {
	title: Object(external_var_wp_i18n_root_wp_i18n_["__"])('Related Events', 'tribe-events-calendar-pro'),
	displayImages: true
};

/* harmony default export */ var related_events_reducer = (function () {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
	var action = arguments[1];

	switch (action.type) {
		case types["c" /* SET_RELATED_EVENTS_TITLE */]:
			return extends_default()({}, state, {
				title: action.payload.title
			});
		case types["a" /* SET_RELATED_EVENTS_DISPLAY_IMAGES */]:
			return extends_default()({}, state, {
				displayImages: action.payload.displayImages
			});
		default:
			return state;
	}
});
// EXTERNAL MODULE: ./src/modules/data/blocks/related-events/selectors.js
var selectors = __webpack_require__(137);

// EXTERNAL MODULE: ./src/modules/data/blocks/related-events/actions.js
var actions = __webpack_require__(61);

// EXTERNAL MODULE: ./node_modules/babel-runtime/regenerator/index.js
var regenerator = __webpack_require__(11);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/effects.js + 1 modules
var effects = __webpack_require__(1);

// CONCATENATED MODULE: ./src/modules/data/blocks/related-events/sagas.js


var _marked = /*#__PURE__*/regenerator_default.a.mark(setInitialState),
    _marked2 = /*#__PURE__*/regenerator_default.a.mark(watchers);

/**
 * External Dependencies
 */


/**
 * Internal dependencies
 */




function setInitialState(action) {
	var get;
	return regenerator_default.a.wrap(function setInitialState$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					get = action.payload.get;
					_context.next = 3;
					return Object(effects["a" /* all */])([Object(effects["e" /* put */])(actions["c" /* setTitle */](get('title', DEFAULT_STATE.title))), Object(effects["e" /* put */])(actions["a" /* setDisplayImages */](get('displayImages', DEFAULT_STATE.displayImages)))]);

				case 3:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked, this);
}

function watchers() {
	return regenerator_default.a.wrap(function watchers$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return Object(effects["i" /* takeEvery */])(types["b" /* SET_RELATED_EVENTS_INITIAL_STATE */], setInitialState);

				case 2:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked2, this);
}
// CONCATENATED MODULE: ./src/modules/data/blocks/related-events/index.js
/**
 * Internal dependencies
 */







/* harmony default export */ var related_events = (related_events_reducer);

// CONCATENATED MODULE: ./src/modules/data/blocks/reducer.js
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */





/* harmony default export */ var blocks_reducer = (Object(redux["b" /* combineReducers */])({
  recurring: reducer["a" /* default */],
  exception: exception_reducer["a" /* default */],
  additionalFields: additional_fields["b" /* default */],
  relatedEvents: related_events
}));
// CONCATENATED MODULE: ./src/modules/data/blocks/index.js
/* concated harmony reexport constants */__webpack_require__.d(__webpack_exports__, "constants", function() { return constants; });
/* concated harmony reexport recurring */__webpack_require__.d(__webpack_exports__, "recurring", function() { return recurring; });
/**
 * Internal dependencies
 */




/* harmony default export */ var blocks = __webpack_exports__["default"] = (blocks_reducer);



/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(369);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECURRING", function() { return RECURRING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EXCEPTION", function() { return EXCEPTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLOCK_TYPES", function() { return BLOCK_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_TYPE", function() { return KEY_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_ALL_DAY", function() { return KEY_ALL_DAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_MULTI_DAY", function() { return KEY_MULTI_DAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_MULTI_DAY_SPAN", function() { return KEY_MULTI_DAY_SPAN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_START_TIME", function() { return KEY_START_TIME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_END_TIME", function() { return KEY_END_TIME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_START_TIME_INPUT", function() { return KEY_START_TIME_INPUT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_END_TIME_INPUT", function() { return KEY_END_TIME_INPUT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_START_DATE", function() { return KEY_START_DATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_START_DATE_INPUT", function() { return KEY_START_DATE_INPUT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_START_DATE_OBJ", function() { return KEY_START_DATE_OBJ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_END_DATE", function() { return KEY_END_DATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_END_DATE_INPUT", function() { return KEY_END_DATE_INPUT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_END_DATE_OBJ", function() { return KEY_END_DATE_OBJ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_LIMIT", function() { return KEY_LIMIT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_LIMIT_DATE_INPUT", function() { return KEY_LIMIT_DATE_INPUT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_LIMIT_DATE_OBJ", function() { return KEY_LIMIT_DATE_OBJ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_LIMIT_TYPE", function() { return KEY_LIMIT_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_BETWEEN", function() { return KEY_BETWEEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_DAYS", function() { return KEY_DAYS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_WEEK", function() { return KEY_WEEK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_DAY", function() { return KEY_DAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_MONTH", function() { return KEY_MONTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_TIMEZONE", function() { return KEY_TIMEZONE; });
//
// ─── BLOCK TYPES ────────────────────────────────────────────────────────────────
//

var RECURRING = 'recurring';
var EXCEPTION = 'exception';

var BLOCK_TYPES = [RECURRING, EXCEPTION];

//
// ─── STATE KEYS ─────────────────────────────────────────────────────────────────
//

var KEY_TYPE = 'type';
var KEY_ALL_DAY = 'all_day';
var KEY_MULTI_DAY = 'multi_day';
var KEY_MULTI_DAY_SPAN = 'multi_day_span';
var KEY_START_TIME = 'start_time';
var KEY_END_TIME = 'end_time';
var KEY_START_TIME_INPUT = '_start_time_input';
var KEY_END_TIME_INPUT = '_end_time_input';
var KEY_START_DATE = 'start_date';
var KEY_START_DATE_INPUT = '_start_date_input';
var KEY_START_DATE_OBJ = '_start_date_obj';
var KEY_END_DATE = 'end_date';
var KEY_END_DATE_INPUT = '_end_date_input';
var KEY_END_DATE_OBJ = '_end_date_obj';
var KEY_LIMIT = 'limit';
var KEY_LIMIT_DATE_INPUT = '_limit_date_input';
var KEY_LIMIT_DATE_OBJ = '_limit_date_obj';
var KEY_LIMIT_TYPE = 'limit_type';
var KEY_BETWEEN = 'between';
var KEY_DAYS = 'days';
var KEY_WEEK = 'week';
var KEY_DAY = 'day';
var KEY_MONTH = 'month';
var KEY_TIMEZONE = 'timezone';

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var types_namespaceObject = {};
__webpack_require__.r(types_namespaceObject);
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_INITIAL_STATE", function() { return SET_ADDITIONAL_FIELD_INITIAL_STATE; });
__webpack_require__.d(types_namespaceObject, "ADD_ADDITIONAL_FIELD", function() { return ADD_ADDITIONAL_FIELD; });
__webpack_require__.d(types_namespaceObject, "REMOVE_ADDITIONAL_FIELD", function() { return REMOVE_ADDITIONAL_FIELD; });
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_LABEL", function() { return SET_ADDITIONAL_FIELD_LABEL; });
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_IS_PRISTINE", function() { return SET_ADDITIONAL_FIELD_IS_PRISTINE; });
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_VALUE", function() { return SET_ADDITIONAL_FIELD_VALUE; });
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_TYPE", function() { return SET_ADDITIONAL_FIELD_TYPE; });
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_OPTIONS", function() { return SET_ADDITIONAL_FIELD_OPTIONS; });
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_DIVIDER_LIST", function() { return SET_ADDITIONAL_FIELD_DIVIDER_LIST; });
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_DIVIDER_END", function() { return SET_ADDITIONAL_FIELD_DIVIDER_END; });
__webpack_require__.d(types_namespaceObject, "APPEND_ADDITIONAL_FIELD_VALUE", function() { return APPEND_ADDITIONAL_FIELD_VALUE; });
__webpack_require__.d(types_namespaceObject, "REMOVE_ADDITIONAL_FIELD_VALUE", function() { return REMOVE_ADDITIONAL_FIELD_VALUE; });
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_CHANGE", function() { return SET_ADDITIONAL_FIELD_CHANGE; });
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_META_KEY", function() { return SET_ADDITIONAL_FIELD_META_KEY; });
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_OUTPUT", function() { return SET_ADDITIONAL_FIELD_OUTPUT; });
__webpack_require__.d(types_namespaceObject, "SET_ADDITIONAL_FIELD_BLUR", function() { return SET_ADDITIONAL_FIELD_BLUR; });
var actions_namespaceObject = {};
__webpack_require__.r(actions_namespaceObject);
__webpack_require__.d(actions_namespaceObject, "setInitialState", function() { return actions_setInitialState; });
__webpack_require__.d(actions_namespaceObject, "setFieldChange", function() { return actions_setFieldChange; });
__webpack_require__.d(actions_namespaceObject, "setFieldBlur", function() { return actions_setFieldBlur; });
__webpack_require__.d(actions_namespaceObject, "setFieldBlurWithType", function() { return actions_setFieldBlurWithType; });
__webpack_require__.d(actions_namespaceObject, "addField", function() { return actions_addField; });
__webpack_require__.d(actions_namespaceObject, "removeField", function() { return actions_removeField; });
__webpack_require__.d(actions_namespaceObject, "setFieldLabel", function() { return actions_setFieldLabel; });
__webpack_require__.d(actions_namespaceObject, "setFieldIsPristine", function() { return actions_setFieldIsPristine; });
__webpack_require__.d(actions_namespaceObject, "setFieldValue", function() { return actions_setFieldValue; });
__webpack_require__.d(actions_namespaceObject, "appendFieldValue", function() { return actions_appendFieldValue; });
__webpack_require__.d(actions_namespaceObject, "removeFieldValue", function() { return actions_removeFieldValue; });
__webpack_require__.d(actions_namespaceObject, "setFieldType", function() { return actions_setFieldType; });
__webpack_require__.d(actions_namespaceObject, "setFieldOptions", function() { return actions_setFieldOptions; });
__webpack_require__.d(actions_namespaceObject, "setFieldDividerList", function() { return actions_setFieldDividerList; });
__webpack_require__.d(actions_namespaceObject, "setFieldDividerEnd", function() { return actions_setFieldDividerEnd; });
__webpack_require__.d(actions_namespaceObject, "setFieldMetaKey", function() { return actions_setFieldMetaKey; });
__webpack_require__.d(actions_namespaceObject, "setFieldOutput", function() { return actions_setFieldOutput; });
var selectors_namespaceObject = {};
__webpack_require__.r(selectors_namespaceObject);
__webpack_require__.d(selectors_namespaceObject, "getPlugin", function() { return selectors_getPlugin; });
__webpack_require__.d(selectors_namespaceObject, "getBlocks", function() { return getBlocks; });
__webpack_require__.d(selectors_namespaceObject, "getAdditionalFields", function() { return getAdditionalFields; });
__webpack_require__.d(selectors_namespaceObject, "getFieldName", function() { return getFieldName; });
__webpack_require__.d(selectors_namespaceObject, "getIds", function() { return getIds; });
__webpack_require__.d(selectors_namespaceObject, "getFieldAsObjects", function() { return getFieldAsObjects; });
__webpack_require__.d(selectors_namespaceObject, "getFieldBlock", function() { return getFieldBlock; });
__webpack_require__.d(selectors_namespaceObject, "getFieldDividerList", function() { return getFieldDividerList; });
__webpack_require__.d(selectors_namespaceObject, "getFieldDividerEnd", function() { return getFieldDividerEnd; });
__webpack_require__.d(selectors_namespaceObject, "getFieldOutput", function() { return getFieldOutput; });
__webpack_require__.d(selectors_namespaceObject, "getFieldMetaKey", function() { return getFieldMetaKey; });
__webpack_require__.d(selectors_namespaceObject, "getFieldType", function() { return getFieldType; });
__webpack_require__.d(selectors_namespaceObject, "getFieldLabel", function() { return getFieldLabel; });
__webpack_require__.d(selectors_namespaceObject, "getFieldValue", function() { return getFieldValue; });
__webpack_require__.d(selectors_namespaceObject, "getTextFieldValue", function() { return getTextFieldValue; });
__webpack_require__.d(selectors_namespaceObject, "getTextAreaOutput", function() { return getTextAreaOutput; });
__webpack_require__.d(selectors_namespaceObject, "getFieldIsPristine", function() { return getFieldIsPristine; });
__webpack_require__.d(selectors_namespaceObject, "getFieldOptions", function() { return getFieldOptions; });
__webpack_require__.d(selectors_namespaceObject, "getFieldOptionsWithLabels", function() { return getFieldOptionsWithLabels; });
__webpack_require__.d(selectors_namespaceObject, "getFieldDropdownValue", function() { return getFieldDropdownValue; });
__webpack_require__.d(selectors_namespaceObject, "getFieldDropdownOutput", function() { return getFieldDropdownOutput; });
__webpack_require__.d(selectors_namespaceObject, "getFieldCheckboxValue", function() { return getFieldCheckboxValue; });
__webpack_require__.d(selectors_namespaceObject, "getFieldCheckboxOptions", function() { return getFieldCheckboxOptions; });

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__(26);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/defineProperty.js
var defineProperty = __webpack_require__(6);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/extends.js
var helpers_extends = __webpack_require__(18);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);

// EXTERNAL MODULE: ./node_modules/redux/es/redux.js
var redux = __webpack_require__(19);

// EXTERNAL MODULE: ./node_modules/lodash/omit.js
var omit = __webpack_require__(211);
var omit_default = /*#__PURE__*/__webpack_require__.n(omit);

// EXTERNAL MODULE: ./src/modules/data/prefix.js
var prefix = __webpack_require__(16);

// CONCATENATED MODULE: ./src/modules/data/blocks/additional-fields/types.js
/**
 * Internal dependencies
 */


var SET_ADDITIONAL_FIELD_INITIAL_STATE = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_INITIAL_STATE';
var ADD_ADDITIONAL_FIELD = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/ADD_ADDITIONAL_FIELD';
var REMOVE_ADDITIONAL_FIELD = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/REMOVE_ADDITIONAL_FIELD';

var SET_ADDITIONAL_FIELD_LABEL = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_LABEL';
var SET_ADDITIONAL_FIELD_IS_PRISTINE = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_IS_PRISTINE';
var SET_ADDITIONAL_FIELD_VALUE = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_VALUE';
var SET_ADDITIONAL_FIELD_TYPE = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_TYPE';
var SET_ADDITIONAL_FIELD_OPTIONS = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_OPTIONS';
var SET_ADDITIONAL_FIELD_DIVIDER_LIST = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_DIVIDER_LIST';
var SET_ADDITIONAL_FIELD_DIVIDER_END = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_DIVIDER_END';
var APPEND_ADDITIONAL_FIELD_VALUE = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/APPEND_ADDITIONAL_FIELD_VALUE';
var REMOVE_ADDITIONAL_FIELD_VALUE = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/REMOVE_ADDITIONAL_FIELD_VALUE';
var SET_ADDITIONAL_FIELD_CHANGE = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_CHANGE';
var SET_ADDITIONAL_FIELD_META_KEY = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_META_KEY';
var SET_ADDITIONAL_FIELD_OUTPUT = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_OUTPUT';
var SET_ADDITIONAL_FIELD_BLUR = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_ADDITIONAL_FIELD_BLUR';
// EXTERNAL MODULE: external {"var":"wp.i18n","root":["wp","i18n"]}
var external_var_wp_i18n_root_wp_i18n_ = __webpack_require__(3);

// CONCATENATED MODULE: ./src/modules/data/blocks/additional-fields/reducers/field.js

/**
 * Internal dependencies
 */



var DEFAULT_STATE = {
	isPristine: true,
	value: '',
	type: '',
	options: [],
	dividerList: ', ',
	dividerEnd: Object(external_var_wp_i18n_root_wp_i18n_["__"])(' and ', 'tribe-events-calendar-pro'),
	label: '',
	metaKey: '',
	output: ''
};

/* harmony default export */ var field = (function () {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
	var action = arguments[1];
	var _action$payload = action.payload,
	    payload = _action$payload === undefined ? {} : _action$payload;

	switch (action.type) {
		case types_namespaceObject.SET_ADDITIONAL_FIELD_LABEL:
			return extends_default()({}, state, {
				label: payload.label
			});
		case types_namespaceObject.SET_ADDITIONAL_FIELD_VALUE:
			return extends_default()({}, state, {
				value: payload.value
			});
		case types_namespaceObject.SET_ADDITIONAL_FIELD_TYPE:
			return extends_default()({}, state, {
				type: payload.type
			});
		case types_namespaceObject.SET_ADDITIONAL_FIELD_IS_PRISTINE:
			return extends_default()({}, state, {
				isPristine: payload.isPristine
			});
		case types_namespaceObject.SET_ADDITIONAL_FIELD_OPTIONS:
			return extends_default()({}, state, {
				options: payload.options
			});
		case types_namespaceObject.SET_ADDITIONAL_FIELD_DIVIDER_LIST:
			return extends_default()({}, state, {
				dividerList: payload.dividerList
			});
		case types_namespaceObject.SET_ADDITIONAL_FIELD_DIVIDER_END:
			return extends_default()({}, state, {
				dividerEnd: payload.dividerEnd
			});
		case types_namespaceObject.SET_ADDITIONAL_FIELD_META_KEY:
			return extends_default()({}, state, {
				metaKey: payload.metaKey
			});
		case types_namespaceObject.SET_ADDITIONAL_FIELD_OUTPUT:
			return extends_default()({}, state, {
				output: payload.output
			});
		default:
			return state;
	}
});
// CONCATENATED MODULE: ./src/modules/data/blocks/additional-fields/reducers/fields.js



/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



var fields_fieldsById = function fieldsById() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];
	var _action$payload = action.payload,
	    payload = _action$payload === undefined ? {} : _action$payload;

	switch (action.type) {
		case ADD_ADDITIONAL_FIELD:
		case SET_ADDITIONAL_FIELD_VALUE:
		case SET_ADDITIONAL_FIELD_TYPE:
		case SET_ADDITIONAL_FIELD_OPTIONS:
		case SET_ADDITIONAL_FIELD_IS_PRISTINE:
		case SET_ADDITIONAL_FIELD_DIVIDER_LIST:
		case SET_ADDITIONAL_FIELD_LABEL:
		case SET_ADDITIONAL_FIELD_DIVIDER_END:
		case APPEND_ADDITIONAL_FIELD_VALUE:
		case REMOVE_ADDITIONAL_FIELD_VALUE:
		case SET_ADDITIONAL_FIELD_META_KEY:
		case SET_ADDITIONAL_FIELD_OUTPUT:
			return extends_default()({}, state, defineProperty_default()({}, payload.name, field(state[payload.name], action)));
		case REMOVE_ADDITIONAL_FIELD:
			return omit_default()(state, [payload.name]);
		default:
			return state;
	}
};

var fields_allFields = function allFields() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	var action = arguments[1];

	switch (action.type) {
		case ADD_ADDITIONAL_FIELD:
			return [].concat(toConsumableArray_default()(state), [action.payload.name]);
		case REMOVE_ADDITIONAL_FIELD:
			return state.filter(function (name) {
				return name !== action.payload.name;
			});
		default:
			return state;
	}
};

/* harmony default export */ var fields = (Object(redux["b" /* combineReducers */])({
	byId: fields_fieldsById,
	allIds: fields_allFields
}));
// CONCATENATED MODULE: ./src/modules/data/blocks/additional-fields/reducers/index.js
/**
 * Internal dependencies
 */


/* harmony default export */ var reducers = (fields);
// CONCATENATED MODULE: ./src/modules/data/blocks/additional-fields/actions.js
/**
 * Internal dependencies
 */



var actions_setInitialState = function setInitialState(props) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_INITIAL_STATE,
		payload: props
	};
};

var actions_setFieldChange = function setFieldChange(name) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_CHANGE,
		payload: {
			name: name
		}
	};
};

var actions_setFieldBlur = function setFieldBlur(name) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_BLUR,
		payload: {
			name: name
		}
	};
};

var actions_setFieldBlurWithType = function setFieldBlurWithType(name, type) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_BLUR + '/' + type,
		payload: {
			name: name
		}
	};
};

var actions_addField = function addField(name) {
	return {
		type: types_namespaceObject.ADD_ADDITIONAL_FIELD,
		payload: {
			name: name
		}
	};
};

var actions_removeField = function removeField(name) {
	return {
		type: types_namespaceObject.REMOVE_ADDITIONAL_FIELD,
		payload: {
			name: name
		}
	};
};

var actions_setFieldLabel = function setFieldLabel(name, label) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_LABEL,
		payload: {
			name: name,
			label: label
		}
	};
};

var actions_setFieldIsPristine = function setFieldIsPristine(name, isPristine) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_IS_PRISTINE,
		payload: {
			name: name,
			isPristine: isPristine
		}
	};
};

var actions_setFieldValue = function setFieldValue(name, value) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_VALUE,
		payload: {
			name: name,
			value: value
		}
	};
};

var actions_appendFieldValue = function appendFieldValue(name, value) {
	return {
		type: types_namespaceObject.APPEND_ADDITIONAL_FIELD_VALUE,
		payload: {
			name: name,
			value: value
		}
	};
};

var actions_removeFieldValue = function removeFieldValue(name, value) {
	return {
		type: types_namespaceObject.REMOVE_ADDITIONAL_FIELD_VALUE,
		payload: {
			name: name,
			value: value
		}
	};
};

var actions_setFieldType = function setFieldType(name, type) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_TYPE,
		payload: {
			name: name,
			type: type
		}
	};
};

var actions_setFieldOptions = function setFieldOptions(name, options) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_OPTIONS,
		payload: {
			name: name,
			options: options
		}
	};
};

var actions_setFieldDividerList = function setFieldDividerList(name, dividerList) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_DIVIDER_LIST,
		payload: {
			name: name,
			dividerList: dividerList
		}
	};
};

var actions_setFieldDividerEnd = function setFieldDividerEnd(name, dividerEnd) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_DIVIDER_END,
		payload: {
			name: name,
			dividerEnd: dividerEnd
		}
	};
};

var actions_setFieldMetaKey = function setFieldMetaKey(name, metaKey) {
	return {
		type: types_namespaceObject.SET_ADDITIONAL_FIELD_META_KEY,
		payload: {
			name: name,
			metaKey: metaKey
		}
	};
};

var actions_setFieldOutput = function setFieldOutput(name, output) {
	return {
		type: SET_ADDITIONAL_FIELD_OUTPUT,
		payload: {
			name: name,
			output: output
		}
	};
};
// EXTERNAL MODULE: ./node_modules/reselect/lib/index.js
var lib = __webpack_require__(4);

// EXTERNAL MODULE: ./node_modules/lodash/identity.js
var identity = __webpack_require__(48);
var identity_default = /*#__PURE__*/__webpack_require__.n(identity);

// EXTERNAL MODULE: ./node_modules/lodash/includes.js
var includes = __webpack_require__(73);
var includes_default = /*#__PURE__*/__webpack_require__.n(includes);

// EXTERNAL MODULE: ./node_modules/lodash/uniq.js
var uniq = __webpack_require__(212);
var uniq_default = /*#__PURE__*/__webpack_require__.n(uniq);

// EXTERNAL MODULE: external "tribe.common.data.plugins"
var external_tribe_common_data_plugins_ = __webpack_require__(29);

// CONCATENATED MODULE: ./src/modules/data/blocks/additional-fields/selectors.js

/**
 * External dependencies
 */





/**
 * Internal dependencies
 */


var selectors_getPlugin = function getPlugin(state) {
	return state[external_tribe_common_data_plugins_["constants"].EVENTS_PRO_PLUGIN];
};
var getBlocks = Object(lib["createSelector"])([selectors_getPlugin], function (plugin) {
	return plugin.blocks;
});

var getAdditionalFields = Object(lib["createSelector"])([getBlocks], function (blocks) {
	return blocks.additionalFields;
});

var getFieldName = function getFieldName(state, props) {
	return props.name;
};

var getIds = Object(lib["createSelector"])([getAdditionalFields], function (fields) {
	return fields.allIds;
});

var getFieldAsObjects = Object(lib["createSelector"])([getAdditionalFields], function (fields) {
	return fields.byId;
});

var getFieldBlock = Object(lib["createSelector"])([getFieldAsObjects, getFieldName], function (fields, name) {
	return fields[name] || {};
});

var getFieldDividerList = Object(lib["createSelector"])([getFieldBlock], function (field) {
	return field.dividerList;
});

var getFieldDividerEnd = Object(lib["createSelector"])([getFieldBlock], function (field) {
	return field.dividerEnd;
});

var getFieldOutput = Object(lib["createSelector"])([getFieldBlock], function (field) {
	return field.output;
});

var getFieldMetaKey = Object(lib["createSelector"])([getFieldBlock], function (field) {
	return field.metaKey;
});

var getFieldType = Object(lib["createSelector"])([getFieldBlock], function (field) {
	return field.type;
});

var getFieldLabel = Object(lib["createSelector"])([getFieldBlock], function (field) {
	return field.label || '';
});

var getFieldValue = Object(lib["createSelector"])([getFieldBlock], function (field) {
	return field.value;
});

var getTextFieldValue = Object(lib["createSelector"])([getFieldValue], function (value) {
	return value || '';
});

var getTextAreaOutput = Object(lib["createSelector"])([getFieldOutput], function () {
	var output = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	return output.split('\n').filter(identity_default.a);
});

var getFieldIsPristine = Object(lib["createSelector"])([getFieldBlock], function (field) {
	return field.isPristine;
});

var getFieldOptions = Object(lib["createSelector"])([getFieldBlock], function (field) {
	return field.options || [];
});

var getFieldOptionsWithLabels = Object(lib["createSelector"])([getFieldOptions], function (options) {
	return options.map(function (option) {
		return { value: option, label: option };
	});
});

var getFieldDropdownValue = Object(lib["createSelector"])([getFieldBlock], function (field) {
	return { value: field.value, label: field.value };
});

var getFieldDropdownOutput = Object(lib["createSelector"])([getFieldBlock], function (field) {
	return field.output;
});

var getFieldCheckboxValue = Object(lib["createSelector"])([getTextFieldValue], function (value) {
	return uniq_default()(value.split('|'));
});

var getFieldCheckboxOptions = Object(lib["createSelector"])([getFieldCheckboxValue, getFieldOptionsWithLabels], function (values, optionsWithLabels) {
	return optionsWithLabels.map(function (option) {
		return extends_default()({}, option, {
			isChecked: includes_default()(values, option.value)
		});
	});
});
// EXTERNAL MODULE: ./node_modules/babel-runtime/regenerator/index.js
var regenerator = __webpack_require__(11);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/effects.js + 1 modules
var effects = __webpack_require__(1);

// EXTERNAL MODULE: ./node_modules/lodash/noop.js
var noop = __webpack_require__(72);
var noop_default = /*#__PURE__*/__webpack_require__.n(noop);

// EXTERNAL MODULE: ./node_modules/lodash/isEmpty.js
var isEmpty = __webpack_require__(213);
var isEmpty_default = /*#__PURE__*/__webpack_require__.n(isEmpty);

// EXTERNAL MODULE: ./src/modules/blocks/additional-fields/utils.js + 23 modules
var utils = __webpack_require__(51);

// EXTERNAL MODULE: external "tribe.common.utils"
var external_tribe_common_utils_ = __webpack_require__(17);

// CONCATENATED MODULE: ./src/modules/data/blocks/additional-fields/sagas.js



var _marked = /*#__PURE__*/regenerator_default.a.mark(sagas_setInitialState),
    _marked2 = /*#__PURE__*/regenerator_default.a.mark(setPristineState),
    _marked3 = /*#__PURE__*/regenerator_default.a.mark(sagas_appendFieldValue),
    _marked4 = /*#__PURE__*/regenerator_default.a.mark(sagas_removeFieldValue),
    _marked5 = /*#__PURE__*/regenerator_default.a.mark(onFieldBlur),
    _marked6 = /*#__PURE__*/regenerator_default.a.mark(setTextFieldOutput),
    _marked7 = /*#__PURE__*/regenerator_default.a.mark(setDropdownOutput),
    _marked8 = /*#__PURE__*/regenerator_default.a.mark(setCheckboxOutput),
    _marked9 = /*#__PURE__*/regenerator_default.a.mark(watchers);

/**
 * External dependencies
 */





/**
 * Internal dependencies
 */




function sagas_setInitialState(props) {
	var _props$payload, payload, _payload$name, name, _payload$get, get, initialValues;

	return regenerator_default.a.wrap(function setInitialState$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_props$payload = props.payload, payload = _props$payload === undefined ? {} : _props$payload;
					_payload$name = payload.name, name = _payload$name === undefined ? '' : _payload$name, _payload$get = payload.get, get = _payload$get === undefined ? noop_default.a : _payload$get;
					initialValues = get('initialValues', {});
					_context.next = 5;
					return Object(effects["a" /* all */])([Object(effects["e" /* put */])(actions_namespaceObject.addField(name)), Object(effects["e" /* put */])(actions_namespaceObject.setFieldIsPristine(name, get('isPristine'))), Object(effects["e" /* put */])(actions_namespaceObject.setFieldOutput(name, get('output'))), Object(effects["e" /* put */])(actions_namespaceObject.setFieldType(name, initialValues.type)), Object(effects["e" /* put */])(actions_namespaceObject.setFieldLabel(name, initialValues.label)), Object(effects["e" /* put */])(actions_namespaceObject.setFieldOptions(name, initialValues.options)), Object(effects["e" /* put */])(actions_namespaceObject.setFieldMetaKey(name, initialValues.metaKey)), Object(effects["e" /* put */])(actions_namespaceObject.setFieldValue(name, get('value'))), Object(effects["e" /* put */])(actions_namespaceObject.setFieldChange(name))]);

				case 5:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked, this);
}

function setPristineState(props) {
	var _props$payload2, payload, _payload$name2, name, value, isPristine;

	return regenerator_default.a.wrap(function setPristineState$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_props$payload2 = props.payload, payload = _props$payload2 === undefined ? {} : _props$payload2;
					_payload$name2 = payload.name, name = _payload$name2 === undefined ? '' : _payload$name2;
					_context2.next = 4;
					return Object(effects["g" /* select */])(selectors_namespaceObject.getFieldValue, payload);

				case 4:
					value = _context2.sent;
					isPristine = value === null || '' === value || isEmpty_default()(value);
					_context2.next = 8;
					return Object(effects["e" /* put */])(actions_namespaceObject.setFieldIsPristine(name, isPristine));

				case 8:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked2, this);
}

function sagas_appendFieldValue(props) {
	var _props$payload3, payload, _payload$name3, name, value, current, newValue;

	return regenerator_default.a.wrap(function appendFieldValue$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					_props$payload3 = props.payload, payload = _props$payload3 === undefined ? {} : _props$payload3;
					_payload$name3 = payload.name, name = _payload$name3 === undefined ? '' : _payload$name3, value = payload.value;
					_context3.next = 4;
					return Object(effects["g" /* select */])(selectors_namespaceObject.getFieldCheckboxValue, payload);

				case 4:
					current = _context3.sent;
					newValue = [].concat(toConsumableArray_default()(current), [value]).filter(identity_default.a).join('|');
					_context3.next = 8;
					return Object(effects["e" /* put */])(actions_namespaceObject.setFieldValue(name, newValue));

				case 8:
				case 'end':
					return _context3.stop();
			}
		}
	}, _marked3, this);
}

function sagas_removeFieldValue(props) {
	var _props$payload4, payload, _payload$name4, name, value, current, newValue;

	return regenerator_default.a.wrap(function removeFieldValue$(_context4) {
		while (1) {
			switch (_context4.prev = _context4.next) {
				case 0:
					_props$payload4 = props.payload, payload = _props$payload4 === undefined ? {} : _props$payload4;
					_payload$name4 = payload.name, name = _payload$name4 === undefined ? '' : _payload$name4, value = payload.value;
					_context4.next = 4;
					return Object(effects["g" /* select */])(selectors_namespaceObject.getFieldCheckboxValue, payload);

				case 4:
					current = _context4.sent;
					newValue = current.filter(function (text) {
						return text !== value;
					}).join('|');
					_context4.next = 8;
					return Object(effects["e" /* put */])(actions_namespaceObject.setFieldValue(name, newValue));

				case 8:
				case 'end':
					return _context4.stop();
			}
		}
	}, _marked4, this);
}

function onFieldBlur(props) {
	var _props$payload5, payload, _payload$name5, name, type;

	return regenerator_default.a.wrap(function onFieldBlur$(_context5) {
		while (1) {
			switch (_context5.prev = _context5.next) {
				case 0:
					_props$payload5 = props.payload, payload = _props$payload5 === undefined ? {} : _props$payload5;
					_payload$name5 = payload.name, name = _payload$name5 === undefined ? '' : _payload$name5;
					_context5.next = 4;
					return Object(effects["g" /* select */])(selectors_namespaceObject.getFieldType, payload);

				case 4:
					type = _context5.sent;
					_context5.next = 7;
					return Object(effects["e" /* put */])(actions_namespaceObject.setFieldBlurWithType(name, type));

				case 7:
				case 'end':
					return _context5.stop();
			}
		}
	}, _marked5, this);
}

function setTextFieldOutput(props) {
	var _props$payload6, payload, _payload$name6, name, value;

	return regenerator_default.a.wrap(function setTextFieldOutput$(_context6) {
		while (1) {
			switch (_context6.prev = _context6.next) {
				case 0:
					_props$payload6 = props.payload, payload = _props$payload6 === undefined ? {} : _props$payload6;
					_payload$name6 = payload.name, name = _payload$name6 === undefined ? '' : _payload$name6;
					_context6.next = 4;
					return Object(effects["g" /* select */])(selectors_namespaceObject.getFieldValue, payload);

				case 4:
					value = _context6.sent;
					_context6.next = 7;
					return Object(effects["e" /* put */])(actions_namespaceObject.setFieldOutput(name, value));

				case 7:
				case 'end':
					return _context6.stop();
			}
		}
	}, _marked6, this);
}

function setDropdownOutput(props) {
	var _props$payload7, payload, _payload$name7, name, _ref, _ref$label, label;

	return regenerator_default.a.wrap(function setDropdownOutput$(_context7) {
		while (1) {
			switch (_context7.prev = _context7.next) {
				case 0:
					_props$payload7 = props.payload, payload = _props$payload7 === undefined ? {} : _props$payload7;
					_payload$name7 = payload.name, name = _payload$name7 === undefined ? '' : _payload$name7;
					_context7.next = 4;
					return Object(effects["g" /* select */])(selectors_namespaceObject.getFieldDropdownValue, payload);

				case 4:
					_ref = _context7.sent;
					_ref$label = _ref.label;
					label = _ref$label === undefined ? '' : _ref$label;
					_context7.next = 9;
					return Object(effects["e" /* put */])(actions_namespaceObject.setFieldOutput(name, label));

				case 9:
				case 'end':
					return _context7.stop();
			}
		}
	}, _marked7, this);
}

function setCheckboxOutput(props) {
	var _props$payload8, payload, _payload$name8, name, _ref2, values, listDivider, dividerEnd;

	return regenerator_default.a.wrap(function setCheckboxOutput$(_context8) {
		while (1) {
			switch (_context8.prev = _context8.next) {
				case 0:
					_props$payload8 = props.payload, payload = _props$payload8 === undefined ? {} : _props$payload8;
					_payload$name8 = payload.name, name = _payload$name8 === undefined ? '' : _payload$name8;
					_context8.next = 4;
					return Object(effects["a" /* all */])({
						values: Object(effects["g" /* select */])(selectors_namespaceObject.getFieldCheckboxValue, payload),
						listDivider: Object(effects["g" /* select */])(selectors_namespaceObject.getFieldDividerList, payload),
						dividerEnd: Object(effects["g" /* select */])(selectors_namespaceObject.getFieldDividerEnd, payload)
					});

				case 4:
					_ref2 = _context8.sent;
					values = _ref2.values;
					listDivider = _ref2.listDivider;
					dividerEnd = _ref2.dividerEnd;
					_context8.next = 10;
					return Object(effects["e" /* put */])(actions_namespaceObject.setFieldOutput(name, external_tribe_common_utils_["string"].wordsAsList(values, listDivider, dividerEnd)));

				case 10:
				case 'end':
					return _context8.stop();
			}
		}
	}, _marked8, this);
}

function watchers() {
	return regenerator_default.a.wrap(function watchers$(_context9) {
		while (1) {
			switch (_context9.prev = _context9.next) {
				case 0:
					_context9.next = 2;
					return Object(effects["i" /* takeEvery */])(types_namespaceObject.SET_ADDITIONAL_FIELD_INITIAL_STATE, sagas_setInitialState);

				case 2:
					_context9.next = 4;
					return Object(effects["i" /* takeEvery */])(types_namespaceObject.SET_ADDITIONAL_FIELD_CHANGE, setPristineState);

				case 4:
					_context9.next = 6;
					return Object(effects["i" /* takeEvery */])(types_namespaceObject.APPEND_ADDITIONAL_FIELD_VALUE, sagas_appendFieldValue);

				case 6:
					_context9.next = 8;
					return Object(effects["i" /* takeEvery */])(types_namespaceObject.REMOVE_ADDITIONAL_FIELD_VALUE, sagas_removeFieldValue);

				case 8:
					_context9.next = 10;
					return Object(effects["i" /* takeEvery */])(types_namespaceObject.SET_ADDITIONAL_FIELD_BLUR, onFieldBlur);

				case 10:
					_context9.next = 12;
					return Object(effects["i" /* takeEvery */])([types_namespaceObject.SET_ADDITIONAL_FIELD_BLUR + '/' + utils["a" /* FIELD_TYPES */].text, types_namespaceObject.SET_ADDITIONAL_FIELD_BLUR + '/' + utils["a" /* FIELD_TYPES */].radio, types_namespaceObject.SET_ADDITIONAL_FIELD_BLUR + '/' + utils["a" /* FIELD_TYPES */].url, types_namespaceObject.SET_ADDITIONAL_FIELD_BLUR + '/' + utils["a" /* FIELD_TYPES */].textarea], setTextFieldOutput);

				case 12:
					_context9.next = 14;
					return Object(effects["i" /* takeEvery */])(types_namespaceObject.SET_ADDITIONAL_FIELD_BLUR + '/' + utils["a" /* FIELD_TYPES */].dropdown, setDropdownOutput);

				case 14:
					_context9.next = 16;
					return Object(effects["i" /* takeEvery */])(types_namespaceObject.SET_ADDITIONAL_FIELD_BLUR + '/' + utils["a" /* FIELD_TYPES */].checkbox, setCheckboxOutput);

				case 16:
				case 'end':
					return _context9.stop();
			}
		}
	}, _marked9, this);
}
// CONCATENATED MODULE: ./src/modules/data/blocks/additional-fields/index.js
/* concated harmony reexport types */__webpack_require__.d(__webpack_exports__, "e", function() { return types_namespaceObject; });
/* concated harmony reexport actions */__webpack_require__.d(__webpack_exports__, "a", function() { return actions_namespaceObject; });
/* concated harmony reexport selectors */__webpack_require__.d(__webpack_exports__, "d", function() { return selectors_namespaceObject; });
/* concated harmony reexport sagas */__webpack_require__.d(__webpack_exports__, "c", function() { return watchers; });
/**
 * Internal dependencies
 */






/* harmony default export */ var additional_fields = __webpack_exports__["b"] = (reducers);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getRule */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return getType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getAllDay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return getMultiDay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return getMultiDaySpan; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return getStartDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return getStartDateInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return getStartDateObj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return getStartTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return getStartTimeNoSeconds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return getStartTimeInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getEndDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getEndDateInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return getEndDateObj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return getEndTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return getEndTimeNoSeconds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return getEndTimeInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getBetween; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return getLimitType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return getLimit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return getLimitDateInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return getLimitDateObj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getDays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return getWeek; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getDay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return getMonth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return getTimezone; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* eslint-disable max-len */

/**
 * External dependencies
 */



var getRule = function getRule(rule) {
	return rule;
};

var getType = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_TYPE"]];
});

var getAllDay = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_ALL_DAY"]];
});

var getMultiDay = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_MULTI_DAY"]];
});

var getMultiDaySpan = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_MULTI_DAY_SPAN"]];
});

var getStartDate = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_START_DATE"]];
});

var getStartDateInput = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_START_DATE_INPUT"]];
});

var getStartDateObj = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_START_DATE_OBJ"]];
});

var getStartTime = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_START_TIME"]];
});

var getStartTimeNoSeconds = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getStartTime], function (startTime) {
	return startTime.slice(0, -3);
});

var getStartTimeInput = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_START_TIME_INPUT"]];
});

var getEndDate = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_END_DATE"]];
});

var getEndDateInput = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_END_DATE_INPUT"]];
});

var getEndDateObj = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_END_DATE_OBJ"]];
});

var getEndTime = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_END_TIME"]];
});

var getEndTimeNoSeconds = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getEndTime], function (endTime) {
	return endTime.slice(0, -3);
});

var getEndTimeInput = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_END_TIME_INPUT"]];
});

var getBetween = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_BETWEEN"]];
});

var getLimitType = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_LIMIT_TYPE"]];
});

var getLimit = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_LIMIT"]];
});

var getLimitDateInput = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_LIMIT_DATE_INPUT"]];
});

var getLimitDateObj = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_LIMIT_DATE_OBJ"]];
});

var getDays = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_DAYS"]];
});

var getWeek = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_WEEK"]];
});

var getDay = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_DAY"]];
});

var getMonth = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_MONTH"]];
});

var getTimezone = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRule], function (rule) {
	return rule[_moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_1__["KEY_TIMEZONE"]];
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export detach */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return take; });
/* unused harmony export takem */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return put; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return all; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return race; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return call; });
/* unused harmony export apply */
/* unused harmony export cps */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return fork; });
/* unused harmony export spawn */
/* unused harmony export join */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return cancel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return select; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return actionChannel; });
/* unused harmony export cancelled */
/* unused harmony export flush */
/* unused harmony export getContext */
/* unused harmony export setContext */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return asEffect; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


var IO = /*#__PURE__*/Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* sym */ "u"])('IO');
var TAKE = 'TAKE';
var PUT = 'PUT';
var ALL = 'ALL';
var RACE = 'RACE';
var CALL = 'CALL';
var CPS = 'CPS';
var FORK = 'FORK';
var JOIN = 'JOIN';
var CANCEL = 'CANCEL';
var SELECT = 'SELECT';
var ACTION_CHANNEL = 'ACTION_CHANNEL';
var CANCELLED = 'CANCELLED';
var FLUSH = 'FLUSH';
var GET_CONTEXT = 'GET_CONTEXT';
var SET_CONTEXT = 'SET_CONTEXT';

var TEST_HINT = '\n(HINT: if you are getting this errors in tests, consider using createMockTask from redux-saga/utils)';

var effect = function effect(type, payload) {
  var _ref;

  return _ref = {}, _ref[IO] = true, _ref[type] = payload, _ref;
};

var detach = function detach(eff) {
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(asEffect.fork(eff), _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].object, 'detach(eff): argument must be a fork effect');
  eff[FORK].detached = true;
  return eff;
};

function take() {
  var patternOrChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

  if (arguments.length) {
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(arguments[0], _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
  }
  if (_utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].pattern(patternOrChannel)) {
    return effect(TAKE, { pattern: patternOrChannel });
  }
  if (_utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].channel(patternOrChannel)) {
    return effect(TAKE, { channel: patternOrChannel });
  }
  throw new Error('take(patternOrChannel): argument ' + String(patternOrChannel) + ' is not valid channel or a valid pattern');
}

take.maybe = function () {
  var eff = take.apply(undefined, arguments);
  eff[TAKE].maybe = true;
  return eff;
};

var takem = /*#__PURE__*/Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* deprecate */ "k"])(take.maybe, /*#__PURE__*/Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* updateIncentive */ "w"])('takem', 'take.maybe'));

function put(channel, action) {
  if (arguments.length > 1) {
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(channel, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].notUndef, 'put(channel, action): argument channel is undefined');
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(channel, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].channel, 'put(channel, action): argument ' + channel + ' is not a valid channel');
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(action, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].notUndef, 'put(channel, action): argument action is undefined');
  } else {
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(channel, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].notUndef, 'put(action): argument action is undefined');
    action = channel;
    channel = null;
  }
  return effect(PUT, { channel: channel, action: action });
}

put.resolve = function () {
  var eff = put.apply(undefined, arguments);
  eff[PUT].resolve = true;
  return eff;
};

put.sync = /*#__PURE__*/Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* deprecate */ "k"])(put.resolve, /*#__PURE__*/Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* updateIncentive */ "w"])('put.sync', 'put.resolve'));

function all(effects) {
  return effect(ALL, effects);
}

function race(effects) {
  return effect(RACE, effects);
}

function getFnCallDesc(meth, fn, args) {
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(fn, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].notUndef, meth + ': argument fn is undefined');

  var context = null;
  if (_utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].array(fn)) {
    var _fn = fn;
    context = _fn[0];
    fn = _fn[1];
  } else if (fn.fn) {
    var _fn2 = fn;
    context = _fn2.context;
    fn = _fn2.fn;
  }
  if (context && _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].string(fn) && _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].func(context[fn])) {
    fn = context[fn];
  }
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(fn, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].func, meth + ': argument ' + fn + ' is not a function');

  return { context: context, fn: fn, args: args };
}

function call(fn) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return effect(CALL, getFnCallDesc('call', fn, args));
}

function apply(context, fn) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return effect(CALL, getFnCallDesc('apply', { context: context, fn: fn }, args));
}

function cps(fn) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return effect(CPS, getFnCallDesc('cps', fn, args));
}

function fork(fn) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return effect(FORK, getFnCallDesc('fork', fn, args));
}

function spawn(fn) {
  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  return detach(fork.apply(undefined, [fn].concat(args)));
}

function join() {
  for (var _len5 = arguments.length, tasks = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    tasks[_key5] = arguments[_key5];
  }

  if (tasks.length > 1) {
    return all(tasks.map(function (t) {
      return join(t);
    }));
  }
  var task = tasks[0];
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(task, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].notUndef, 'join(task): argument task is undefined');
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(task, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].task, 'join(task): argument ' + task + ' is not a valid Task object ' + TEST_HINT);
  return effect(JOIN, task);
}

function cancel() {
  for (var _len6 = arguments.length, tasks = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    tasks[_key6] = arguments[_key6];
  }

  if (tasks.length > 1) {
    return all(tasks.map(function (t) {
      return cancel(t);
    }));
  }
  var task = tasks[0];
  if (tasks.length === 1) {
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(task, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].notUndef, 'cancel(task): argument task is undefined');
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(task, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].task, 'cancel(task): argument ' + task + ' is not a valid Task object ' + TEST_HINT);
  }
  return effect(CANCEL, task || _utils__WEBPACK_IMPORTED_MODULE_0__[/* SELF_CANCELLATION */ "d"]);
}

function select(selector) {
  for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    args[_key7 - 1] = arguments[_key7];
  }

  if (arguments.length === 0) {
    selector = _utils__WEBPACK_IMPORTED_MODULE_0__[/* ident */ "l"];
  } else {
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(selector, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].notUndef, 'select(selector,[...]): argument selector is undefined');
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(selector, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].func, 'select(selector,[...]): argument ' + selector + ' is not a function');
  }
  return effect(SELECT, { selector: selector, args: args });
}

/**
  channel(pattern, [buffer])    => creates an event channel for store actions
**/
function actionChannel(pattern, buffer) {
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(pattern, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].notUndef, 'actionChannel(pattern,...): argument pattern is undefined');
  if (arguments.length > 1) {
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(buffer, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].notUndef, 'actionChannel(pattern, buffer): argument buffer is undefined');
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(buffer, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].buffer, 'actionChannel(pattern, buffer): argument ' + buffer + ' is not a valid buffer');
  }
  return effect(ACTION_CHANNEL, { pattern: pattern, buffer: buffer });
}

function cancelled() {
  return effect(CANCELLED, {});
}

function flush(channel) {
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(channel, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].channel, 'flush(channel): argument ' + channel + ' is not valid channel');
  return effect(FLUSH, channel);
}

function getContext(prop) {
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(prop, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].string, 'getContext(prop): argument ' + prop + ' is not a string');
  return effect(GET_CONTEXT, prop);
}

function setContext(props) {
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(props, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].object, Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* createSetContextWarning */ "h"])(null, props));
  return effect(SET_CONTEXT, props);
}

var createAsEffectType = function createAsEffectType(type) {
  return function (effect) {
    return effect && effect[IO] && effect[type];
  };
};

var asEffect = {
  take: /*#__PURE__*/createAsEffectType(TAKE),
  put: /*#__PURE__*/createAsEffectType(PUT),
  all: /*#__PURE__*/createAsEffectType(ALL),
  race: /*#__PURE__*/createAsEffectType(RACE),
  call: /*#__PURE__*/createAsEffectType(CALL),
  cps: /*#__PURE__*/createAsEffectType(CPS),
  fork: /*#__PURE__*/createAsEffectType(FORK),
  join: /*#__PURE__*/createAsEffectType(JOIN),
  cancel: /*#__PURE__*/createAsEffectType(CANCEL),
  select: /*#__PURE__*/createAsEffectType(SELECT),
  actionChannel: /*#__PURE__*/createAsEffectType(ACTION_CHANNEL),
  cancelled: /*#__PURE__*/createAsEffectType(CANCELLED),
  flush: /*#__PURE__*/createAsEffectType(FLUSH),
  getContext: /*#__PURE__*/createAsEffectType(GET_CONTEXT),
  setContext: /*#__PURE__*/createAsEffectType(SET_CONTEXT)
};

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PREFIX_EVENTS_PRO_STORE; });
var PREFIX_EVENTS_PRO_STORE = '@@MT/EVENTS-PRO';

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = tribe.common.utils;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(229);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createStore */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return combineReducers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return bindActionCreators; });
/* unused harmony export applyMiddleware */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return compose; });
/* unused harmony export __DO_NOT_USE__ActionTypes */
/* harmony import */ var symbol_observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(140);


/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[symbol_observable__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[symbol_observable__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (false) {}

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers);
  var unexpectedKeyCache;

  if (false) {}

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (false) { var warningMessage; }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */


function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? 'null' : typeof actionCreators) + ". " + "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?");
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error("Dispatching while constructing your middleware is not allowed. " + "Other middleware would not be applied to this dispatch.");
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */

function isCrushed() {}

if (false) {}




/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = tribe.common.hoc;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = tribe.common.elements;

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/react-redux/node_modules/@babel/runtime/helpers/esm/inheritsLoose.js
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(8);

// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(0);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/PropTypes.js

var subscriptionShape = prop_types_default.a.shape({
  trySubscribe: prop_types_default.a.func.isRequired,
  tryUnsubscribe: prop_types_default.a.func.isRequired,
  notifyNestedSubs: prop_types_default.a.func.isRequired,
  isSubscribed: prop_types_default.a.func.isRequired
});
var storeShape = prop_types_default.a.shape({
  subscribe: prop_types_default.a.func.isRequired,
  dispatch: prop_types_default.a.func.isRequired,
  getState: prop_types_default.a.func.isRequired
});
// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/warning.js
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */

}
// CONCATENATED MODULE: ./node_modules/react-redux/es/components/Provider.js





var didWarnAboutReceivingStore = false;

function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return;
  }

  didWarnAboutReceivingStore = true;
  warning('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/reduxjs/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
}

function createProvider(storeKey) {
  var _Provider$childContex;

  if (storeKey === void 0) {
    storeKey = 'store';
  }

  var subscriptionKey = storeKey + "Subscription";

  var Provider =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(Provider, _Component);

    var _proto = Provider.prototype;

    _proto.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[storeKey] = this[storeKey], _ref[subscriptionKey] = null, _ref;
    };

    function Provider(props, context) {
      var _this;

      _this = _Component.call(this, props, context) || this;
      _this[storeKey] = props.store;
      return _this;
    }

    _proto.render = function render() {
      return external_React_["Children"].only(this.props.children);
    };

    return Provider;
  }(external_React_["Component"]);

  if (false) {}

  Provider.propTypes = {
    store: storeShape.isRequired,
    children: prop_types_default.a.element.isRequired
  };
  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[storeKey] = storeShape.isRequired, _Provider$childContex[subscriptionKey] = subscriptionShape, _Provider$childContex);
  return Provider;
}
/* harmony default export */ var components_Provider = (createProvider());
// CONCATENATED MODULE: ./node_modules/react-redux/node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}
// CONCATENATED MODULE: ./node_modules/react-redux/node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
// CONCATENATED MODULE: ./node_modules/react-redux/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
// EXTERNAL MODULE: ./node_modules/react-redux/node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
var hoist_non_react_statics_cjs = __webpack_require__(209);
var hoist_non_react_statics_cjs_default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics_cjs);

// EXTERNAL MODULE: ./node_modules/invariant/browser.js
var browser = __webpack_require__(100);
var browser_default = /*#__PURE__*/__webpack_require__.n(browser);

// EXTERNAL MODULE: ./node_modules/react-is/index.js
var react_is = __webpack_require__(138);

// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/Subscription.js
// encapsulates the subscription logic for connecting a component to the redux store, as
// well as nesting subscriptions of descendant components, so that we can ensure the
// ancestor components re-render before descendants
var CLEARED = null;
var nullListeners = {
  notify: function notify() {}
};

function createListenerCollection() {
  // the current/next pattern is copied from redux's createStore code.
  // TODO: refactor+expose that code to be reusable here?
  var current = [];
  var next = [];
  return {
    clear: function clear() {
      next = CLEARED;
      current = CLEARED;
    },
    notify: function notify() {
      var listeners = current = next;

      for (var i = 0; i < listeners.length; i++) {
        listeners[i]();
      }
    },
    get: function get() {
      return next;
    },
    subscribe: function subscribe(listener) {
      var isSubscribed = true;
      if (next === current) next = current.slice();
      next.push(listener);
      return function unsubscribe() {
        if (!isSubscribed || current === CLEARED) return;
        isSubscribed = false;
        if (next === current) next = current.slice();
        next.splice(next.indexOf(listener), 1);
      };
    }
  };
}

var Subscription =
/*#__PURE__*/
function () {
  function Subscription(store, parentSub, onStateChange) {
    this.store = store;
    this.parentSub = parentSub;
    this.onStateChange = onStateChange;
    this.unsubscribe = null;
    this.listeners = nullListeners;
  }

  var _proto = Subscription.prototype;

  _proto.addNestedSub = function addNestedSub(listener) {
    this.trySubscribe();
    return this.listeners.subscribe(listener);
  };

  _proto.notifyNestedSubs = function notifyNestedSubs() {
    this.listeners.notify();
  };

  _proto.isSubscribed = function isSubscribed() {
    return Boolean(this.unsubscribe);
  };

  _proto.trySubscribe = function trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.onStateChange) : this.store.subscribe(this.onStateChange);
      this.listeners = createListenerCollection();
    }
  };

  _proto.tryUnsubscribe = function tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      this.listeners.clear();
      this.listeners = nullListeners;
    }
  };

  return Subscription;
}();


// CONCATENATED MODULE: ./node_modules/react-redux/es/components/connectAdvanced.js










var hotReloadingVersion = 0;
var dummyState = {};

function noop() {}

function makeSelectorStateful(sourceSelector, store) {
  // wrap the selector in an object that tracks its results between runs.
  var selector = {
    run: function runComponentSelector(props) {
      try {
        var nextProps = sourceSelector(store.getState(), props);

        if (nextProps !== selector.props || selector.error) {
          selector.shouldComponentUpdate = true;
          selector.props = nextProps;
          selector.error = null;
        }
      } catch (error) {
        selector.shouldComponentUpdate = true;
        selector.error = error;
      }
    }
  };
  return selector;
}

function connectAdvanced(
/*
  selectorFactory is a func that is responsible for returning the selector function used to
  compute new props from state, props, and dispatch. For example:
     export default connectAdvanced((dispatch, options) => (state, props) => ({
      thing: state.things[props.thingId],
      saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
    }))(YourComponent)
   Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
  outside of their selector as an optimization. Options passed to connectAdvanced are passed to
  the selectorFactory, along with displayName and WrappedComponent, as the second argument.
   Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
  props. Do not use connectAdvanced directly without memoizing results between calls to your
  selector, otherwise the Connect component will re-render on every state or props change.
*/
selectorFactory, // options object:
_ref) {
  var _contextTypes, _childContextTypes;

  if (_ref === void 0) {
    _ref = {};
  }

  var _ref2 = _ref,
      _ref2$getDisplayName = _ref2.getDisplayName,
      getDisplayName = _ref2$getDisplayName === void 0 ? function (name) {
    return "ConnectAdvanced(" + name + ")";
  } : _ref2$getDisplayName,
      _ref2$methodName = _ref2.methodName,
      methodName = _ref2$methodName === void 0 ? 'connectAdvanced' : _ref2$methodName,
      _ref2$renderCountProp = _ref2.renderCountProp,
      renderCountProp = _ref2$renderCountProp === void 0 ? undefined : _ref2$renderCountProp,
      _ref2$shouldHandleSta = _ref2.shouldHandleStateChanges,
      shouldHandleStateChanges = _ref2$shouldHandleSta === void 0 ? true : _ref2$shouldHandleSta,
      _ref2$storeKey = _ref2.storeKey,
      storeKey = _ref2$storeKey === void 0 ? 'store' : _ref2$storeKey,
      _ref2$withRef = _ref2.withRef,
      withRef = _ref2$withRef === void 0 ? false : _ref2$withRef,
      connectOptions = _objectWithoutPropertiesLoose(_ref2, ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef"]);

  var subscriptionKey = storeKey + 'Subscription';
  var version = hotReloadingVersion++;
  var contextTypes = (_contextTypes = {}, _contextTypes[storeKey] = storeShape, _contextTypes[subscriptionKey] = subscriptionShape, _contextTypes);
  var childContextTypes = (_childContextTypes = {}, _childContextTypes[subscriptionKey] = subscriptionShape, _childContextTypes);
  return function wrapWithConnect(WrappedComponent) {
    browser_default()(Object(react_is["isValidElementType"])(WrappedComponent), "You must pass a component to the function returned by " + (methodName + ". Instead received " + JSON.stringify(WrappedComponent)));
    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    var displayName = getDisplayName(wrappedComponentName);

    var selectorFactoryOptions = _extends({}, connectOptions, {
      getDisplayName: getDisplayName,
      methodName: methodName,
      renderCountProp: renderCountProp,
      shouldHandleStateChanges: shouldHandleStateChanges,
      storeKey: storeKey,
      withRef: withRef,
      displayName: displayName,
      wrappedComponentName: wrappedComponentName,
      WrappedComponent: WrappedComponent // TODO Actually fix our use of componentWillReceiveProps

      /* eslint-disable react/no-deprecated */

    });

    var Connect =
    /*#__PURE__*/
    function (_Component) {
      _inheritsLoose(Connect, _Component);

      function Connect(props, context) {
        var _this;

        _this = _Component.call(this, props, context) || this;
        _this.version = version;
        _this.state = {};
        _this.renderCount = 0;
        _this.store = props[storeKey] || context[storeKey];
        _this.propsMode = Boolean(props[storeKey]);
        _this.setWrappedInstance = _this.setWrappedInstance.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        browser_default()(_this.store, "Could not find \"" + storeKey + "\" in either the context or props of " + ("\"" + displayName + "\". Either wrap the root component in a <Provider>, ") + ("or explicitly pass \"" + storeKey + "\" as a prop to \"" + displayName + "\"."));

        _this.initSelector();

        _this.initSubscription();

        return _this;
      }

      var _proto = Connect.prototype;

      _proto.getChildContext = function getChildContext() {
        var _ref3;

        // If this component received store from props, its subscription should be transparent
        // to any descendants receiving store+subscription from context; it passes along
        // subscription passed to it. Otherwise, it shadows the parent subscription, which allows
        // Connect to control ordering of notifications to flow top-down.
        var subscription = this.propsMode ? null : this.subscription;
        return _ref3 = {}, _ref3[subscriptionKey] = subscription || this.context[subscriptionKey], _ref3;
      };

      _proto.componentDidMount = function componentDidMount() {
        if (!shouldHandleStateChanges) return; // componentWillMount fires during server side rendering, but componentDidMount and
        // componentWillUnmount do not. Because of this, trySubscribe happens during ...didMount.
        // Otherwise, unsubscription would never take place during SSR, causing a memory leak.
        // To handle the case where a child component may have triggered a state change by
        // dispatching an action in its componentWillMount, we have to re-run the select and maybe
        // re-render.

        this.subscription.trySubscribe();
        this.selector.run(this.props);
        if (this.selector.shouldComponentUpdate) this.forceUpdate();
      };

      _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.selector.run(nextProps);
      };

      _proto.shouldComponentUpdate = function shouldComponentUpdate() {
        return this.selector.shouldComponentUpdate;
      };

      _proto.componentWillUnmount = function componentWillUnmount() {
        if (this.subscription) this.subscription.tryUnsubscribe();
        this.subscription = null;
        this.notifyNestedSubs = noop;
        this.store = null;
        this.selector.run = noop;
        this.selector.shouldComponentUpdate = false;
      };

      _proto.getWrappedInstance = function getWrappedInstance() {
        browser_default()(withRef, "To access the wrapped instance, you need to specify " + ("{ withRef: true } in the options argument of the " + methodName + "() call."));
        return this.wrappedInstance;
      };

      _proto.setWrappedInstance = function setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      };

      _proto.initSelector = function initSelector() {
        var sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions);
        this.selector = makeSelectorStateful(sourceSelector, this.store);
        this.selector.run(this.props);
      };

      _proto.initSubscription = function initSubscription() {
        if (!shouldHandleStateChanges) return; // parentSub's source should match where store came from: props vs. context. A component
        // connected to the store via props shouldn't use subscription from context, or vice versa.

        var parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey];
        this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this)); // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
        // the middle of the notification loop, where `this.subscription` will then be null. An
        // extra null check every change can be avoided by copying the method onto `this` and then
        // replacing it with a no-op on unmount. This can probably be avoided if Subscription's
        // listeners logic is changed to not call listeners that have been unsubscribed in the
        // middle of the notification loop.

        this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription);
      };

      _proto.onStateChange = function onStateChange() {
        this.selector.run(this.props);

        if (!this.selector.shouldComponentUpdate) {
          this.notifyNestedSubs();
        } else {
          this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate;
          this.setState(dummyState);
        }
      };

      _proto.notifyNestedSubsOnComponentDidUpdate = function notifyNestedSubsOnComponentDidUpdate() {
        // `componentDidUpdate` is conditionally implemented when `onStateChange` determines it
        // needs to notify nested subs. Once called, it unimplements itself until further state
        // changes occur. Doing it this way vs having a permanent `componentDidUpdate` that does
        // a boolean check every time avoids an extra method call most of the time, resulting
        // in some perf boost.
        this.componentDidUpdate = undefined;
        this.notifyNestedSubs();
      };

      _proto.isSubscribed = function isSubscribed() {
        return Boolean(this.subscription) && this.subscription.isSubscribed();
      };

      _proto.addExtraProps = function addExtraProps(props) {
        if (!withRef && !renderCountProp && !(this.propsMode && this.subscription)) return props; // make a shallow copy so that fields added don't leak to the original selector.
        // this is especially important for 'ref' since that's a reference back to the component
        // instance. a singleton memoized selector would then be holding a reference to the
        // instance, preventing the instance from being garbage collected, and that would be bad

        var withExtras = _extends({}, props);

        if (withRef) withExtras.ref = this.setWrappedInstance;
        if (renderCountProp) withExtras[renderCountProp] = this.renderCount++;
        if (this.propsMode && this.subscription) withExtras[subscriptionKey] = this.subscription;
        return withExtras;
      };

      _proto.render = function render() {
        var selector = this.selector;
        selector.shouldComponentUpdate = false;

        if (selector.error) {
          throw selector.error;
        } else {
          return Object(external_React_["createElement"])(WrappedComponent, this.addExtraProps(selector.props));
        }
      };

      return Connect;
    }(external_React_["Component"]);
    /* eslint-enable react/no-deprecated */


    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = displayName;
    Connect.childContextTypes = childContextTypes;
    Connect.contextTypes = contextTypes;
    Connect.propTypes = contextTypes;

    if (false) {}

    return hoist_non_react_statics_cjs_default()(Connect, WrappedComponent);
  };
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/shallowEqual.js
var hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}
// EXTERNAL MODULE: ./node_modules/redux/es/redux.js
var redux = __webpack_require__(19);

// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/isPlainObject.js
/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = Object.getPrototypeOf(obj);
  if (proto === null) return true;
  var baseProto = proto;

  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/utils/verifyPlainObject.js


function verifyPlainObject(value, displayName, methodName) {
  if (!isPlainObject(value)) {
    warning(methodName + "() in " + displayName + " must return a plain object. Instead received " + value + ".");
  }
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/wrapMapToProps.js

function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch, options) {
    var constant = getConstant(dispatch, options);

    function constantSelector() {
      return constant;
    }

    constantSelector.dependsOnOwnProps = false;
    return constantSelector;
  };
} // dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
// 
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..

function getDependsOnOwnProps(mapToProps) {
  return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
} // Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
// 
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//    
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//    
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//    

function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;

    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
    }; // allow detectFactoryAndVerify to get ownProps


    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      if (false) {}
      return props;
    };

    return proxy;
  };
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/mapDispatchToProps.js


function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
  return typeof mapDispatchToProps === 'function' ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps') : undefined;
}
function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
  return !mapDispatchToProps ? wrapMapToPropsConstant(function (dispatch) {
    return {
      dispatch: dispatch
    };
  }) : undefined;
}
function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
  return mapDispatchToProps && typeof mapDispatchToProps === 'object' ? wrapMapToPropsConstant(function (dispatch) {
    return Object(redux["a" /* bindActionCreators */])(mapDispatchToProps, dispatch);
  }) : undefined;
}
/* harmony default export */ var connect_mapDispatchToProps = ([whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject]);
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/mapStateToProps.js

function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps') : undefined;
}
function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(function () {
    return {};
  }) : undefined;
}
/* harmony default export */ var connect_mapStateToProps = ([whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing]);
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/mergeProps.js


function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return _extends({}, ownProps, stateProps, dispatchProps);
}
function wrapMergePropsFunc(mergeProps) {
  return function initMergePropsProxy(dispatch, _ref) {
    var displayName = _ref.displayName,
        pure = _ref.pure,
        areMergedPropsEqual = _ref.areMergedPropsEqual;
    var hasRunOnce = false;
    var mergedProps;
    return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
      var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

      if (hasRunOnce) {
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
      } else {
        hasRunOnce = true;
        mergedProps = nextMergedProps;
        if (false) {}
      }

      return mergedProps;
    };
  };
}
function whenMergePropsIsFunction(mergeProps) {
  return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
}
function whenMergePropsIsOmitted(mergeProps) {
  return !mergeProps ? function () {
    return defaultMergeProps;
  } : undefined;
}
/* harmony default export */ var connect_mergeProps = ([whenMergePropsIsFunction, whenMergePropsIsOmitted]);
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/verifySubselectors.js


function verify(selector, methodName, displayName) {
  if (!selector) {
    throw new Error("Unexpected value for " + methodName + " in " + displayName + ".");
  } else if (methodName === 'mapStateToProps' || methodName === 'mapDispatchToProps') {
    if (!selector.hasOwnProperty('dependsOnOwnProps')) {
      warning("The selector for " + methodName + " of " + displayName + " did not specify a value for dependsOnOwnProps.");
    }
  }
}

function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, displayName) {
  verify(mapStateToProps, 'mapStateToProps', displayName);
  verify(mapDispatchToProps, 'mapDispatchToProps', displayName);
  verify(mergeProps, 'mergeProps', displayName);
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/selectorFactory.js


function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
  return function impureFinalPropsSelector(state, ownProps) {
    return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
  };
}
function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
  var areStatesEqual = _ref.areStatesEqual,
      areOwnPropsEqual = _ref.areOwnPropsEqual,
      areStatePropsEqual = _ref.areStatePropsEqual;
  var hasRunAtLeastOnce = false;
  var state;
  var ownProps;
  var stateProps;
  var dispatchProps;
  var mergedProps;

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState;
    ownProps = firstOwnProps;
    stateProps = mapStateToProps(state, ownProps);
    dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps);
    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewState() {
    var nextStateProps = mapStateToProps(state, ownProps);
    var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;
    if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleSubsequentCalls(nextState, nextOwnProps) {
    var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    var stateChanged = !areStatesEqual(nextState, state);
    state = nextState;
    ownProps = nextOwnProps;
    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
    if (propsChanged) return handleNewProps();
    if (stateChanged) return handleNewState();
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
  };
} // TODO: Add more comments
// If pure is true, the selector returned by selectorFactory will memoize its results,
// allowing connectAdvanced's shouldComponentUpdate to return false if final
// props have not changed. If false, the selector will always return a new
// object and shouldComponentUpdate will always return true.

function finalPropsSelectorFactory(dispatch, _ref2) {
  var initMapStateToProps = _ref2.initMapStateToProps,
      initMapDispatchToProps = _ref2.initMapDispatchToProps,
      initMergeProps = _ref2.initMergeProps,
      options = _objectWithoutPropertiesLoose(_ref2, ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"]);

  var mapStateToProps = initMapStateToProps(dispatch, options);
  var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  var mergeProps = initMergeProps(dispatch, options);

  if (false) {}

  var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;
  return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}
// CONCATENATED MODULE: ./node_modules/react-redux/es/connect/connect.js








/*
  connect is a facade over connectAdvanced. It turns its args into a compatible
  selectorFactory, which has the signature:

    (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
  
  connect passes its args to connectAdvanced as options, which will in turn pass them to
  selectorFactory each time a Connect component instance is instantiated or hot reloaded.

  selectorFactory returns a final props selector from its mapStateToProps,
  mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
  mergePropsFactories, and pure args.

  The resulting final props selector is called by the Connect component instance whenever
  it receives new props or store state.
 */

function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i--) {
    var result = factories[i](arg);
    if (result) return result;
  }

  return function (dispatch, options) {
    throw new Error("Invalid value of type " + typeof arg + " for " + name + " argument when connecting component " + options.wrappedComponentName + ".");
  };
}

function strictEqual(a, b) {
  return a === b;
} // createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios


function createConnect(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$connectHOC = _ref.connectHOC,
      connectHOC = _ref$connectHOC === void 0 ? connectAdvanced : _ref$connectHOC,
      _ref$mapStateToPropsF = _ref.mapStateToPropsFactories,
      mapStateToPropsFactories = _ref$mapStateToPropsF === void 0 ? connect_mapStateToProps : _ref$mapStateToPropsF,
      _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories,
      mapDispatchToPropsFactories = _ref$mapDispatchToPro === void 0 ? connect_mapDispatchToProps : _ref$mapDispatchToPro,
      _ref$mergePropsFactor = _ref.mergePropsFactories,
      mergePropsFactories = _ref$mergePropsFactor === void 0 ? connect_mergeProps : _ref$mergePropsFactor,
      _ref$selectorFactory = _ref.selectorFactory,
      selectorFactory = _ref$selectorFactory === void 0 ? finalPropsSelectorFactory : _ref$selectorFactory;

  return function connect(mapStateToProps, mapDispatchToProps, mergeProps, _ref2) {
    if (_ref2 === void 0) {
      _ref2 = {};
    }

    var _ref3 = _ref2,
        _ref3$pure = _ref3.pure,
        pure = _ref3$pure === void 0 ? true : _ref3$pure,
        _ref3$areStatesEqual = _ref3.areStatesEqual,
        areStatesEqual = _ref3$areStatesEqual === void 0 ? strictEqual : _ref3$areStatesEqual,
        _ref3$areOwnPropsEqua = _ref3.areOwnPropsEqual,
        areOwnPropsEqual = _ref3$areOwnPropsEqua === void 0 ? shallowEqual : _ref3$areOwnPropsEqua,
        _ref3$areStatePropsEq = _ref3.areStatePropsEqual,
        areStatePropsEqual = _ref3$areStatePropsEq === void 0 ? shallowEqual : _ref3$areStatePropsEq,
        _ref3$areMergedPropsE = _ref3.areMergedPropsEqual,
        areMergedPropsEqual = _ref3$areMergedPropsE === void 0 ? shallowEqual : _ref3$areMergedPropsE,
        extraOptions = _objectWithoutPropertiesLoose(_ref3, ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"]);

    var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
    return connectHOC(selectorFactory, _extends({
      // used in error messages
      methodName: 'connect',
      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: function getDisplayName(name) {
        return "Connect(" + name + ")";
      },
      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),
      // passed through to selectorFactory
      initMapStateToProps: initMapStateToProps,
      initMapDispatchToProps: initMapDispatchToProps,
      initMergeProps: initMergeProps,
      pure: pure,
      areStatesEqual: areStatesEqual,
      areOwnPropsEqual: areOwnPropsEqual,
      areStatePropsEqual: areStatePropsEqual,
      areMergedPropsEqual: areMergedPropsEqual
    }, extraOptions));
  };
}
/* harmony default export */ var connect_connect = (createConnect());
// CONCATENATED MODULE: ./node_modules/react-redux/es/index.js
/* unused concated harmony import Provider */
/* unused concated harmony import createProvider */
/* unused concated harmony import connectAdvanced */
/* concated harmony reexport connect */__webpack_require__.d(__webpack_exports__, "a", function() { return connect_connect; });





/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var actions_namespaceObject = {};
__webpack_require__.r(actions_namespaceObject);
__webpack_require__.d(actions_namespaceObject, "addField", function() { return actions_addField; });
__webpack_require__.d(actions_namespaceObject, "addException", function() { return actions_addException; });
__webpack_require__.d(actions_namespaceObject, "removeField", function() { return actions_removeField; });
__webpack_require__.d(actions_namespaceObject, "removeException", function() { return actions_removeException; });
__webpack_require__.d(actions_namespaceObject, "editException", function() { return editException; });
__webpack_require__.d(actions_namespaceObject, "syncException", function() { return syncException; });
__webpack_require__.d(actions_namespaceObject, "syncExceptionsFromDB", function() { return actions_syncExceptionsFromDB; });
var options_namespaceObject = {};
__webpack_require__.r(options_namespaceObject);
__webpack_require__.d(options_namespaceObject, "EXCEPTION_OCCURRENCE_OPTIONS", function() { return EXCEPTION_OCCURRENCE_OPTIONS; });
var selectors_namespaceObject = {};
__webpack_require__.r(selectors_namespaceObject);
__webpack_require__.d(selectors_namespaceObject, "getExceptions", function() { return selectors_getExceptions; });
__webpack_require__.d(selectors_namespaceObject, "getRules", function() { return getRules; });
__webpack_require__.d(selectors_namespaceObject, "getExceptionsCount", function() { return getExceptionsCount; });
__webpack_require__.d(selectors_namespaceObject, "hasExceptions", function() { return hasExceptions; });
__webpack_require__.d(selectors_namespaceObject, "getIndex", function() { return getIndex; });
__webpack_require__.d(selectors_namespaceObject, "getRule", function() { return getRule; });
__webpack_require__.d(selectors_namespaceObject, "getType", function() { return getType; });
__webpack_require__.d(selectors_namespaceObject, "getAllDay", function() { return getAllDay; });
__webpack_require__.d(selectors_namespaceObject, "getMultiDay", function() { return getMultiDay; });
__webpack_require__.d(selectors_namespaceObject, "getMultiDaySpan", function() { return getMultiDaySpan; });
__webpack_require__.d(selectors_namespaceObject, "getStartDate", function() { return getStartDate; });
__webpack_require__.d(selectors_namespaceObject, "getStartDateObj", function() { return getStartDateObj; });
__webpack_require__.d(selectors_namespaceObject, "getStartDateInput", function() { return getStartDateInput; });
__webpack_require__.d(selectors_namespaceObject, "getStartTime", function() { return getStartTime; });
__webpack_require__.d(selectors_namespaceObject, "getStartTimeNoSeconds", function() { return getStartTimeNoSeconds; });
__webpack_require__.d(selectors_namespaceObject, "getStartTimeInput", function() { return getStartTimeInput; });
__webpack_require__.d(selectors_namespaceObject, "getEndDate", function() { return getEndDate; });
__webpack_require__.d(selectors_namespaceObject, "getEndDateObj", function() { return getEndDateObj; });
__webpack_require__.d(selectors_namespaceObject, "getEndDateInput", function() { return getEndDateInput; });
__webpack_require__.d(selectors_namespaceObject, "getEndTime", function() { return getEndTime; });
__webpack_require__.d(selectors_namespaceObject, "getEndTimeNoSeconds", function() { return getEndTimeNoSeconds; });
__webpack_require__.d(selectors_namespaceObject, "getEndTimeInput", function() { return getEndTimeInput; });
__webpack_require__.d(selectors_namespaceObject, "getBetween", function() { return getBetween; });
__webpack_require__.d(selectors_namespaceObject, "getLimitType", function() { return getLimitType; });
__webpack_require__.d(selectors_namespaceObject, "getLimit", function() { return getLimit; });
__webpack_require__.d(selectors_namespaceObject, "getLimitDateObj", function() { return getLimitDateObj; });
__webpack_require__.d(selectors_namespaceObject, "getLimitDateInput", function() { return getLimitDateInput; });
__webpack_require__.d(selectors_namespaceObject, "getDays", function() { return getDays; });
__webpack_require__.d(selectors_namespaceObject, "getDay", function() { return getDay; });
__webpack_require__.d(selectors_namespaceObject, "getMonth", function() { return getMonth; });
__webpack_require__.d(selectors_namespaceObject, "getWeek", function() { return getWeek; });
__webpack_require__.d(selectors_namespaceObject, "getTimezone", function() { return getTimezone; });
__webpack_require__.d(selectors_namespaceObject, "getTypeOption", function() { return getTypeOption; });
__webpack_require__.d(selectors_namespaceObject, "getLimitTypeOption", function() { return getLimitTypeOption; });

// EXTERNAL MODULE: ./src/modules/data/blocks/exception/reducer.js
var reducer = __webpack_require__(98);

// EXTERNAL MODULE: ./src/modules/data/blocks/exception/types.js
var types = __webpack_require__(28);

// EXTERNAL MODULE: ./node_modules/lodash/fp/curry.js
var curry = __webpack_require__(67);
var curry_default = /*#__PURE__*/__webpack_require__.n(curry);

// CONCATENATED MODULE: ./src/modules/data/blocks/exception/actions.js
 /**
                                       * External dependencies
                                       */

/**
 * Internal dependencies
 */


var actions_addField = function addField() {
	return {
		type: types["ADD_EXCEPTION_FIELD"]
	};
};

var actions_addException = function addException(payload) {
	return {
		type: types["ADD_EXCEPTION"],
		payload: payload
	};
};

var actions_removeField = function removeField() {
	return {
		type: types["REMOVE_EXCEPTION_FIELD"]
	};
};

var actions_removeException = function removeException(index) {
	return {
		type: types["REMOVE_EXCEPTION"],
		index: index
	};
};

var editException = curry_default()(function (index, payload) {
	return {
		type: types["EDIT_EXCEPTION"],
		index: index,
		payload: payload
	};
});

var syncException = curry_default()(function (index, payload) {
	return {
		type: types["EDIT_EXCEPTION"],
		index: index,
		payload: payload,
		sync: true
	};
});

var actions_syncExceptionsFromDB = function syncExceptionsFromDB(payload) {
	return {
		type: types["SYNC_EXCEPTIONS_FROM_DB"],
		payload: payload
	};
};
// EXTERNAL MODULE: ./node_modules/lodash/find.js
var find = __webpack_require__(39);
var find_default = /*#__PURE__*/__webpack_require__.n(find);

// EXTERNAL MODULE: ./node_modules/reselect/lib/index.js
var lib = __webpack_require__(4);

// EXTERNAL MODULE: external {"var":"wp.i18n","root":["wp","i18n"]}
var external_var_wp_i18n_root_wp_i18n_ = __webpack_require__(3);

// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/constants.js
var constants = __webpack_require__(5);

// CONCATENATED MODULE: ./src/modules/data/blocks/exception/options.js
/**
 * External Dependencies
 */


/**
 * Internal Dependencies
 */


var EXCEPTION_OCCURRENCE_OPTIONS = [{ label: Object(external_var_wp_i18n_root_wp_i18n_["__"])('Daily', 'tribe-events-calendar-pro'), value: constants["DAILY"] }, { label: Object(external_var_wp_i18n_root_wp_i18n_["__"])('Weekly', 'tribe-events-calendar-pro'), value: constants["WEEKLY"] }, { label: Object(external_var_wp_i18n_root_wp_i18n_["__"])('Monthly', 'tribe-events-calendar-pro'), value: constants["MONTHLY"] }, { label: Object(external_var_wp_i18n_root_wp_i18n_["__"])('Yearly', 'tribe-events-calendar-pro'), value: constants["YEARLY"] }, { label: Object(external_var_wp_i18n_root_wp_i18n_["__"])('Single Exception', 'tribe-events-calendar-pro'), value: constants["SINGLE"] }];
// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/options.js
var options = __webpack_require__(56);

// EXTERNAL MODULE: external "tribe.common.data.plugins"
var external_tribe_common_data_plugins_ = __webpack_require__(29);

// EXTERNAL MODULE: ./src/modules/data/shared/selectors.js
var selectors = __webpack_require__(14);

// CONCATENATED MODULE: ./src/modules/data/blocks/exception/selectors.js

/**
 * External dependencies
 */



/**
 * Internal dependencies
 */





var selectors_getExceptions = function getExceptions(state) {
	return state[external_tribe_common_data_plugins_["constants"].EVENTS_PRO_PLUGIN].blocks.exception;
};
var getRules = selectors_getExceptions;
var getExceptionsCount = Object(lib["createSelector"])(selectors_getExceptions, function (exceptions) {
	return exceptions.length;
});
var hasExceptions = Object(lib["createSelector"])(getExceptionsCount, function (count) {
	return !!count;
});
var getIndex = function getIndex(_, props) {
	return props.index;
};

var getRule = Object(lib["createSelector"])([selectors_getExceptions, getIndex], function (exceptions, index) {
	return exceptions[index];
});

var getType = Object(lib["createSelector"])(getRule, selectors["y" /* getType */]);
var getAllDay = Object(lib["createSelector"])(getRule, selectors["a" /* getAllDay */]);
var getMultiDay = Object(lib["createSelector"])(getRule, selectors["p" /* getMultiDay */]);
var getMultiDaySpan = Object(lib["createSelector"])(getRule, selectors["q" /* getMultiDaySpan */]);
var getStartDate = Object(lib["createSelector"])(getRule, selectors["r" /* getStartDate */]);
var getStartDateObj = Object(lib["createSelector"])(getRule, selectors["t" /* getStartDateObj */]);
var getStartDateInput = Object(lib["createSelector"])(getRule, selectors["s" /* getStartDateInput */]);
var getStartTime = Object(lib["createSelector"])(getRule, selectors["u" /* getStartTime */]);
var getStartTimeNoSeconds = Object(lib["createSelector"])(getRule, selectors["w" /* getStartTimeNoSeconds */]);
var getStartTimeInput = Object(lib["createSelector"])(getRule, selectors["v" /* getStartTimeInput */]);
var getEndDate = Object(lib["createSelector"])(getRule, selectors["e" /* getEndDate */]);
var getEndDateObj = Object(lib["createSelector"])(getRule, selectors["g" /* getEndDateObj */]);
var getEndDateInput = Object(lib["createSelector"])(getRule, selectors["f" /* getEndDateInput */]);
var getEndTime = Object(lib["createSelector"])(getRule, selectors["h" /* getEndTime */]);
var getEndTimeNoSeconds = Object(lib["createSelector"])(getRule, selectors["j" /* getEndTimeNoSeconds */]);
var getEndTimeInput = Object(lib["createSelector"])(getRule, selectors["i" /* getEndTimeInput */]);
var getBetween = Object(lib["createSelector"])(getRule, selectors["b" /* getBetween */]);
var getLimitType = Object(lib["createSelector"])(getRule, selectors["n" /* getLimitType */]);
var getLimit = Object(lib["createSelector"])(getRule, selectors["k" /* getLimit */]);
var getLimitDateObj = Object(lib["createSelector"])(getRule, selectors["m" /* getLimitDateObj */]);
var getLimitDateInput = Object(lib["createSelector"])(getRule, selectors["l" /* getLimitDateInput */]);
var getDays = Object(lib["createSelector"])(getRule, selectors["d" /* getDays */]);
var getDay = Object(lib["createSelector"])(getRule, selectors["c" /* getDay */]);
var getMonth = Object(lib["createSelector"])(getRule, selectors["o" /* getMonth */]);
var getWeek = Object(lib["createSelector"])(getRule, selectors["z" /* getWeek */]);
var getTimezone = Object(lib["createSelector"])(getRule, selectors["x" /* getTimezone */]);

var getTypeOption = Object(lib["createSelector"])([getType], function (type) {
	return find_default()(EXCEPTION_OCCURRENCE_OPTIONS, function (option) {
		return option.value === type;
	});
});

var getLimitTypeOption = Object(lib["createSelector"])([getLimitType], function (limitType) {
	return find_default()(options["SERIES_ENDS_OPTIONS"], function (option) {
		return option.value === limitType;
	});
});
// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/extends.js
var helpers_extends = __webpack_require__(18);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);

// EXTERNAL MODULE: ./node_modules/babel-runtime/regenerator/index.js
var regenerator = __webpack_require__(11);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./node_modules/lodash/keys.js
var keys = __webpack_require__(40);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/effects.js + 1 modules
var effects = __webpack_require__(1);

// EXTERNAL MODULE: ./src/modules/data/blocks/index.js + 4 modules
var blocks = __webpack_require__(10);

// EXTERNAL MODULE: ./src/modules/data/shared/sagas.js
var sagas = __webpack_require__(34);

// EXTERNAL MODULE: ./src/modules/data/ui/index.js + 4 modules
var ui = __webpack_require__(43);

// EXTERNAL MODULE: external "tribe.events.data"
var external_tribe_events_data_ = __webpack_require__(27);

// CONCATENATED MODULE: ./src/modules/data/blocks/exception/sagas.js




var _marked = /*#__PURE__*/regenerator_default.a.mark(handleExceptionRemoval),
    _marked2 = /*#__PURE__*/regenerator_default.a.mark(handleExceptionEdit),
    _marked3 = /*#__PURE__*/regenerator_default.a.mark(syncExceptions),
    _marked4 = /*#__PURE__*/regenerator_default.a.mark(watchers);

/**
 * External dependencies
 */



/**
 * Internal dependencies
 */








var sagaArgs = {
	actions: {
		add: actions_addException,
		sync: syncException
	},
	selectors: selectors_namespaceObject
};

function handleExceptionRemoval() {
	var exceptions;
	return regenerator_default.a.wrap(function handleExceptionRemoval$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return Object(effects["g" /* select */])(selectors_getExceptions);

				case 2:
					exceptions = _context.sent;

					if (exceptions.length) {
						_context.next = 6;
						break;
					}

					_context.next = 6;
					return Object(effects["e" /* put */])(ui["a" /* actions */].hideExceptionPanel());

				case 6:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked, this);
}

function handleExceptionEdit(action) {
	var fieldKeys, i, fieldKey;
	return regenerator_default.a.wrap(function handleExceptionEdit$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					if (!action.sync) {
						_context2.next = 2;
						break;
					}

					return _context2.abrupt('return');

				case 2:
					_context2.next = 4;
					return Object(effects["b" /* call */])(keys_default.a, action.payload);

				case 4:
					fieldKeys = _context2.sent;
					i = 0;

				case 6:
					if (!(i < fieldKeys.length)) {
						_context2.next = 27;
						break;
					}

					fieldKey = fieldKeys[i];
					_context2.t0 = fieldKey;
					_context2.next = _context2.t0 === blocks["constants"].KEY_START_TIME ? 11 : _context2.t0 === blocks["constants"].KEY_END_TIME ? 11 : _context2.t0 === blocks["constants"].KEY_MULTI_DAY ? 14 : _context2.t0 === blocks["constants"].KEY_WEEK ? 17 : _context2.t0 === blocks["constants"].KEY_LIMIT_TYPE ? 20 : 23;
					break;

				case 11:
					_context2.next = 13;
					return Object(effects["b" /* call */])(sagas["d" /* handleTimeChange */], sagaArgs, action, fieldKey);

				case 13:
					return _context2.abrupt('break', 24);

				case 14:
					_context2.next = 16;
					return Object(effects["b" /* call */])(sagas["c" /* handleMultiDayChange */], sagaArgs, action, fieldKey);

				case 16:
					return _context2.abrupt('break', 24);

				case 17:
					_context2.next = 19;
					return Object(effects["b" /* call */])(sagas["f" /* handleWeekChange */], sagaArgs, action, fieldKey);

				case 19:
					return _context2.abrupt('break', 24);

				case 20:
					_context2.next = 22;
					return Object(effects["b" /* call */])(sagas["b" /* handleLimitTypeChange */], sagaArgs, action, fieldKey);

				case 22:
					return _context2.abrupt('break', 24);

				case 23:
					return _context2.abrupt('break', 24);

				case 24:
					i++;
					_context2.next = 6;
					break;

				case 27:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked2, this);
}

function syncExceptions(action) {
	var exceptions, i, _action;

	return regenerator_default.a.wrap(function syncExceptions$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					_context3.next = 2;
					return Object(effects["g" /* select */])(selectors_getExceptions);

				case 2:
					exceptions = _context3.sent;
					i = 0;

				case 4:
					if (!(i < exceptions.length)) {
						_context3.next = 16;
						break;
					}

					_action = extends_default()({ index: i }, action);
					_context3.t0 = action.type;
					_context3.next = _context3.t0 === external_tribe_events_data_["blocks"].datetime.types.SET_TIME_ZONE ? 9 : 12;
					break;

				case 9:
					_context3.next = 11;
					return Object(effects["b" /* call */])(sagas["e" /* handleTimezoneChange */], sagaArgs, _action, 'timeZone');

				case 11:
					return _context3.abrupt('break', 13);

				case 12:
					return _context3.abrupt('break', 13);

				case 13:
					i++;
					_context3.next = 4;
					break;

				case 16:
				case 'end':
					return _context3.stop();
			}
		}
	}, _marked3, this);
}

function watchers() {
	return regenerator_default.a.wrap(function watchers$(_context4) {
		while (1) {
			switch (_context4.prev = _context4.next) {
				case 0:
					_context4.next = 2;
					return Object(effects["i" /* takeEvery */])([types["REMOVE_EXCEPTION"]], handleExceptionRemoval);

				case 2:
					_context4.next = 4;
					return Object(effects["i" /* takeEvery */])([types["ADD_EXCEPTION_FIELD"]], sagas["a" /* handleAddition */], sagaArgs);

				case 4:
					_context4.next = 6;
					return Object(effects["i" /* takeEvery */])([types["EDIT_EXCEPTION"]], handleExceptionEdit);

				case 6:
					_context4.next = 8;
					return Object(effects["i" /* takeEvery */])([external_tribe_events_data_["blocks"].datetime.types.SET_TIME_ZONE], syncExceptions);

				case 8:
				case 'end':
					return _context4.stop();
			}
		}
	}, _marked4, this);
}
// CONCATENATED MODULE: ./src/modules/data/blocks/exception/index.js
/* concated harmony reexport types */__webpack_require__.d(__webpack_exports__, "e", function() { return types; });
/* concated harmony reexport actions */__webpack_require__.d(__webpack_exports__, "a", function() { return actions_namespaceObject; });
/* concated harmony reexport selectors */__webpack_require__.d(__webpack_exports__, "d", function() { return selectors_namespaceObject; });
/* concated harmony reexport options */__webpack_require__.d(__webpack_exports__, "b", function() { return options_namespaceObject; });
/* concated harmony reexport sagas */__webpack_require__.d(__webpack_exports__, "c", function() { return watchers; });
/**
 * Internal dependencies
 */







/* harmony default export */ var exception = (reducer["a" /* default */]);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADD_RULE_FIELD", function() { return ADD_RULE_FIELD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADD_RULE", function() { return ADD_RULE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REMOVE_RULE_FIELD", function() { return REMOVE_RULE_FIELD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REMOVE_RULE", function() { return REMOVE_RULE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EDIT_RULE", function() { return EDIT_RULE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SYNC_RULES_FROM_DB", function() { return SYNC_RULES_FROM_DB; });
/* harmony import */ var _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* eslint-disable max-len */
/**
 * Internal dependencies
 */


var ADD_RULE_FIELD = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/ADD_RULE_FIELD';
var ADD_RULE = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/ADD_RULE';
var REMOVE_RULE_FIELD = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/REMOVE_RULE_FIELD';
var REMOVE_RULE = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/REMOVE_RULE';
var EDIT_RULE = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/EDIT_RULE';
var SYNC_RULES_FROM_DB = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/SYNC_RULES_FROM_DB';

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(240);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = tribe.events.data;

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADD_EXCEPTION_FIELD", function() { return ADD_EXCEPTION_FIELD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADD_EXCEPTION", function() { return ADD_EXCEPTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REMOVE_EXCEPTION_FIELD", function() { return REMOVE_EXCEPTION_FIELD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REMOVE_EXCEPTION", function() { return REMOVE_EXCEPTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EDIT_EXCEPTION", function() { return EDIT_EXCEPTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SYNC_EXCEPTIONS_FROM_DB", function() { return SYNC_EXCEPTIONS_FROM_DB; });
/* harmony import */ var _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* eslint-disable max-len */
/**
 * Internal dependencies
 */


var ADD_EXCEPTION_FIELD = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/ADD_EXCEPTION_FIELD';
var ADD_EXCEPTION = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/ADD_EXCEPTION';
var REMOVE_EXCEPTION_FIELD = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/REMOVE_EXCEPTION_FIELD';
var REMOVE_EXCEPTION = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/REMOVE_EXCEPTION';
var EDIT_EXCEPTION = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/EDIT_EXCEPTION';
var SYNC_EXCEPTIONS_FROM_DB = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/SYNC_EXCEPTIONS_FROM_DB';

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = tribe.common.data.plugins;

/***/ }),
/* 30 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 31 */,
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(165);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return END; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isEnd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return emitter; });
/* unused harmony export INVALID_BUFFER */
/* unused harmony export UNDEFINED_INPUT_ERROR */
/* unused harmony export channel */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return eventChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return stdChannel; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _buffers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(50);
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(78);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };





var CHANNEL_END_TYPE = '@@redux-saga/CHANNEL_END';
var END = { type: CHANNEL_END_TYPE };
var isEnd = function isEnd(a) {
  return a && a.type === CHANNEL_END_TYPE;
};

function emitter() {
  var subscribers = [];

  function subscribe(sub) {
    subscribers.push(sub);
    return function () {
      return Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* remove */ "t"])(subscribers, sub);
    };
  }

  function emit(item) {
    var arr = subscribers.slice();
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i](item);
    }
  }

  return {
    subscribe: subscribe,
    emit: emit
  };
}

var INVALID_BUFFER = 'invalid buffer passed to channel factory function';
var UNDEFINED_INPUT_ERROR = 'Saga was provided with an undefined action';

if (false) {}

function channel() {
  var buffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _buffers__WEBPACK_IMPORTED_MODULE_1__[/* buffers */ "a"].fixed();

  var closed = false;
  var takers = [];

  Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(buffer, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].buffer, INVALID_BUFFER);

  function checkForbiddenStates() {
    if (closed && takers.length) {
      throw Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* internalErr */ "m"])('Cannot have a closed channel with pending takers');
    }
    if (takers.length && !buffer.isEmpty()) {
      throw Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* internalErr */ "m"])('Cannot have pending takers with non empty buffer');
    }
  }

  function put(input) {
    checkForbiddenStates();
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(input, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].notUndef, UNDEFINED_INPUT_ERROR);
    if (closed) {
      return;
    }
    if (!takers.length) {
      return buffer.put(input);
    }
    for (var i = 0; i < takers.length; i++) {
      var cb = takers[i];
      if (!cb[_utils__WEBPACK_IMPORTED_MODULE_0__[/* MATCH */ "b"]] || cb[_utils__WEBPACK_IMPORTED_MODULE_0__[/* MATCH */ "b"]](input)) {
        takers.splice(i, 1);
        return cb(input);
      }
    }
  }

  function take(cb) {
    checkForbiddenStates();
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(cb, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].func, "channel.take's callback must be a function");

    if (closed && buffer.isEmpty()) {
      cb(END);
    } else if (!buffer.isEmpty()) {
      cb(buffer.take());
    } else {
      takers.push(cb);
      cb.cancel = function () {
        return Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* remove */ "t"])(takers, cb);
      };
    }
  }

  function flush(cb) {
    checkForbiddenStates(); // TODO: check if some new state should be forbidden now
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(cb, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].func, "channel.flush' callback must be a function");
    if (closed && buffer.isEmpty()) {
      cb(END);
      return;
    }
    cb(buffer.flush());
  }

  function close() {
    checkForbiddenStates();
    if (!closed) {
      closed = true;
      if (takers.length) {
        var arr = takers;
        takers = [];
        for (var i = 0, len = arr.length; i < len; i++) {
          arr[i](END);
        }
      }
    }
  }

  return {
    take: take,
    put: put,
    flush: flush,
    close: close,
    get __takers__() {
      return takers;
    },
    get __closed__() {
      return closed;
    }
  };
}

function eventChannel(subscribe) {
  var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _buffers__WEBPACK_IMPORTED_MODULE_1__[/* buffers */ "a"].none();
  var matcher = arguments[2];

  /**
    should be if(typeof matcher !== undefined) instead?
    see PR #273 for a background discussion
  **/
  if (arguments.length > 2) {
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(matcher, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].func, 'Invalid match function passed to eventChannel');
  }

  var chan = channel(buffer);
  var close = function close() {
    if (!chan.__closed__) {
      if (unsubscribe) {
        unsubscribe();
      }
      chan.close();
    }
  };
  var unsubscribe = subscribe(function (input) {
    if (isEnd(input)) {
      close();
      return;
    }
    if (matcher && !matcher(input)) {
      return;
    }
    chan.put(input);
  });
  if (chan.__closed__) {
    unsubscribe();
  }

  if (!_utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].func(unsubscribe)) {
    throw new Error('in eventChannel: subscribe should return a function to unsubscribe');
  }

  return {
    take: chan.take,
    flush: chan.flush,
    close: close
  };
}

function stdChannel(subscribe) {
  var chan = eventChannel(function (cb) {
    return subscribe(function (input) {
      if (input[_utils__WEBPACK_IMPORTED_MODULE_0__[/* SAGA_ACTION */ "c"]]) {
        cb(input);
        return;
      }
      Object(_scheduler__WEBPACK_IMPORTED_MODULE_2__[/* asap */ "a"])(function () {
        return cb(input);
      });
    });
  });

  return _extends({}, chan, {
    take: function take(cb, matcher) {
      if (arguments.length > 1) {
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* check */ "g"])(matcher, _utils__WEBPACK_IMPORTED_MODULE_0__[/* is */ "n"].func, "channel.take's matcher argument must be a function");
        cb[_utils__WEBPACK_IMPORTED_MODULE_0__[/* MATCH */ "b"]] = matcher;
      }
      chan.take(cb);
    }
  });
}

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return handleAddition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return handleTimeChange; });
/* unused harmony export handleTimeInput */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return handleMultiDayChange; });
/* unused harmony export preventEndTimeBeforeStartTime */
/* unused harmony export preventStartTimeAfterEndTime */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return handleWeekChange; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return handleLimitTypeChange; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return handleTimezoneChange; });
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);
/* harmony import */ var _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
/* harmony import */ var _moderntribe_events_pro_data_blocks_recurring_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
/* harmony import */ var _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(17);
/* harmony import */ var _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _moderntribe_events_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(27);
/* harmony import */ var _moderntribe_events_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_moderntribe_events_data__WEBPACK_IMPORTED_MODULE_6__);



var _marked = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(handleAddition),
    _marked2 = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(handleTimeChange),
    _marked3 = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(handleTimeInput),
    _marked4 = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(handleMultiDayChange),
    _marked5 = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(preventEndTimeBeforeStartTime),
    _marked6 = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(preventStartTimeAfterEndTime),
    _marked7 = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(handleWeekChange),
    _marked8 = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(handleLimitTypeChange),
    _marked9 = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(handleTimezoneChange);

/**
 * External dependencies
 */


/**
 * Internal dependencies
 */





var KEY_TYPE = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_TYPE"],
    KEY_ALL_DAY = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_ALL_DAY"],
    KEY_MULTI_DAY = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_MULTI_DAY"],
    KEY_START_TIME = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_START_TIME"],
    KEY_END_TIME = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_END_TIME"],
    KEY_START_TIME_INPUT = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_START_TIME_INPUT"],
    KEY_END_TIME_INPUT = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_END_TIME_INPUT"],
    KEY_START_DATE = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_START_DATE"],
    KEY_START_DATE_INPUT = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_START_DATE_INPUT"],
    KEY_START_DATE_OBJ = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_START_DATE_OBJ"],
    KEY_END_DATE = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_END_DATE"],
    KEY_END_DATE_INPUT = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_END_DATE_INPUT"],
    KEY_END_DATE_OBJ = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_END_DATE_OBJ"],
    KEY_LIMIT = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_LIMIT"],
    KEY_LIMIT_DATE_INPUT = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_LIMIT_DATE_INPUT"],
    KEY_LIMIT_DATE_OBJ = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_LIMIT_DATE_OBJ"],
    KEY_LIMIT_TYPE = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_LIMIT_TYPE"],
    KEY_BETWEEN = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_BETWEEN"],
    KEY_DAYS = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_DAYS"],
    KEY_WEEK = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_WEEK"],
    KEY_DAY = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_DAY"],
    KEY_MONTH = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_MONTH"],
    KEY_TIMEZONE = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_TIMEZONE"],
    KEY_MULTI_DAY_SPAN = _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_MULTI_DAY_SPAN"];
var toMoment = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["moment"].toMoment,
    toDate = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["moment"].toDate,
    toDatabaseDate = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["moment"].toDatabaseDate,
    toDatabaseTime = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["moment"].toDatabaseTime,
    toTime = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["moment"].toTime,
    TIME_FORMAT = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["moment"].TIME_FORMAT;
var MINUTE_IN_SECONDS = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["time"].MINUTE_IN_SECONDS,
    HALF_HOUR_IN_SECONDS = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["time"].HALF_HOUR_IN_SECONDS,
    HOUR_IN_SECONDS = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["time"].HOUR_IN_SECONDS,
    DAY_IN_SECONDS = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["time"].DAY_IN_SECONDS,
    TIME_FORMAT_HH_MM = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["time"].TIME_FORMAT_HH_MM,
    toSeconds = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["time"].toSeconds,
    fromSeconds = _moderntribe_common_utils__WEBPACK_IMPORTED_MODULE_5__["time"].fromSeconds;


function handleAddition(_ref) {
	var _actions$add;

	var actions = _ref.actions;
	var start, end, allDay, multiDay, timezone, startMoment, endMoment, startMomentDate, startWeekNum, startWeek, startWeekday, startMonth, startDate, startTime, endDate, endTime, startDateInput, startDateObj, endDateInput, endDateObj, startTimeInput, endTimeInput;
	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function handleAddition$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(_moderntribe_events_data__WEBPACK_IMPORTED_MODULE_6__["blocks"].datetime.selectors.getStart);

				case 2:
					start = _context.sent;
					_context.next = 5;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(_moderntribe_events_data__WEBPACK_IMPORTED_MODULE_6__["blocks"].datetime.selectors.getEnd);

				case 5:
					end = _context.sent;
					_context.next = 8;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(_moderntribe_events_data__WEBPACK_IMPORTED_MODULE_6__["blocks"].datetime.selectors.getAllDay);

				case 8:
					allDay = _context.sent;
					_context.next = 11;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(_moderntribe_events_data__WEBPACK_IMPORTED_MODULE_6__["blocks"].datetime.selectors.getMultiDay);

				case 11:
					multiDay = _context.sent;
					_context.next = 14;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(_moderntribe_events_data__WEBPACK_IMPORTED_MODULE_6__["blocks"].datetime.selectors.getTimeZone);

				case 14:
					timezone = _context.sent;
					_context.next = 17;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toMoment, start);

				case 17:
					startMoment = _context.sent;
					_context.next = 20;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toMoment, end);

				case 20:
					endMoment = _context.sent;
					_context.next = 23;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])([startMoment, 'date']);

				case 23:
					startMomentDate = _context.sent;
					_context.next = 26;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])([Math, 'ceil'], startMomentDate / 7);

				case 26:
					startWeekNum = _context.sent;
					startWeek = _moderntribe_events_pro_data_blocks_recurring_constants__WEBPACK_IMPORTED_MODULE_4__["WEEK_NUM_MAPPING_TO_WEEKS_OF_THE_MONTH"][startWeekNum];
					_context.next = 30;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])([startMoment, 'isoWeekday']);

				case 30:
					startWeekday = _context.sent;
					_context.next = 33;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])([startMoment, 'month']);

				case 33:
					startMonth = _context.sent;
					_context.next = 36;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toDatabaseDate, startMoment);

				case 36:
					startDate = _context.sent;
					_context.next = 39;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toDatabaseTime, startMoment);

				case 39:
					startTime = _context.sent;
					_context.next = 42;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toDatabaseDate, endMoment);

				case 42:
					endDate = _context.sent;
					_context.next = 45;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toDatabaseTime, endMoment);

				case 45:
					endTime = _context.sent;
					_context.next = 48;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toDate, startMoment);

				case 48:
					startDateInput = _context.sent;
					startDateObj = new Date(startDateInput);
					_context.next = 52;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toDate, endMoment);

				case 52:
					endDateInput = _context.sent;
					endDateObj = new Date(endDateInput);
					_context.next = 56;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toTime, startMoment);

				case 56:
					startTimeInput = _context.sent;
					_context.next = 59;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toTime, endMoment);

				case 59:
					endTimeInput = _context.sent;
					_context.next = 62;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.add((_actions$add = {}, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_TYPE, _moderntribe_events_pro_data_blocks_recurring_constants__WEBPACK_IMPORTED_MODULE_4__["SINGLE"]), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_ALL_DAY, allDay), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_MULTI_DAY, multiDay), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_START_DATE, startDate), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_START_DATE_INPUT, startDateInput), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_START_DATE_OBJ, startDateObj), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_START_TIME, startTime), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_START_TIME_INPUT, startTimeInput), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_END_DATE, endDate), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_END_DATE_INPUT, endDateInput), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_END_DATE_OBJ, endDateObj), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_END_TIME, endTime), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_END_TIME_INPUT, endTimeInput), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_BETWEEN, 1), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_LIMIT_TYPE, _moderntribe_events_pro_data_blocks_recurring_constants__WEBPACK_IMPORTED_MODULE_4__["COUNT"]), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_LIMIT, 7), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_LIMIT_DATE_INPUT, endDateInput), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_LIMIT_DATE_OBJ, endDateObj), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_DAYS, [startWeekday]), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_WEEK, startWeek), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_DAY, startWeekday), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_MONTH, [startMonth + 1]), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_TIMEZONE, timezone), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$add, KEY_MULTI_DAY_SPAN, _moderntribe_events_pro_data_blocks_recurring_constants__WEBPACK_IMPORTED_MODULE_4__["NEXT_DAY"]), _actions$add)));

				case 62:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked, this);
}

function handleTimeChange(_ref2, action, key) {
	var actions = _ref2.actions,
	    selectors = _ref2.selectors;

	var payloadTime, isAllDay, isMultiDay, _actions$sync, _actions$sync2, isStartTime, isEndTime, startTime, endTime, _actions$sync3;

	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function handleTimeChange$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					payloadTime = action.payload[key];
					isAllDay = payloadTime === 'all-day';
					_context2.next = 4;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(selectors.getMultiDay, action);

				case 4:
					isMultiDay = _context2.sent;

					if (!isAllDay) {
						_context2.next = 10;
						break;
					}

					_context2.next = 8;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.sync(action.index, (_actions$sync = {}, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync, KEY_ALL_DAY, isAllDay), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync, KEY_START_TIME, '00:00:00'), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync, KEY_END_TIME, '23:59:59'), _actions$sync)));

				case 8:
					_context2.next = 42;
					break;

				case 10:
					if (isMultiDay) {
						_context2.next = 40;
						break;
					}

					isStartTime = key === KEY_START_TIME;
					isEndTime = key === KEY_END_TIME;

					if (!isStartTime) {
						_context2.next = 17;
						break;
					}

					_context2.t0 = payloadTime;
					_context2.next = 20;
					break;

				case 17:
					_context2.next = 19;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(selectors.getStartTimeNoSeconds, action);

				case 19:
					_context2.t0 = _context2.sent;

				case 20:
					startTime = _context2.t0;

					if (!isEndTime) {
						_context2.next = 25;
						break;
					}

					_context2.t1 = payloadTime;
					_context2.next = 28;
					break;

				case 25:
					_context2.next = 27;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(selectors.getEndTimeNoSeconds, action);

				case 27:
					_context2.t1 = _context2.sent;

				case 28:
					endTime = _context2.t1;
					_context2.next = 31;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.sync(action.index, (_actions$sync2 = {}, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync2, KEY_ALL_DAY, isAllDay), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync2, key, payloadTime + ':00'), _actions$sync2)));

				case 31:
					if (!isStartTime) {
						_context2.next = 36;
						break;
					}

					_context2.next = 34;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(preventEndTimeBeforeStartTime, { actions: actions }, { startTime: startTime, endTime: endTime }, action);

				case 34:
					_context2.next = 38;
					break;

				case 36:
					_context2.next = 38;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(preventStartTimeAfterEndTime, { actions: actions }, { startTime: startTime, endTime: endTime }, action);

				case 38:
					_context2.next = 42;
					break;

				case 40:
					_context2.next = 42;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.sync(action.index, (_actions$sync3 = {}, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync3, KEY_ALL_DAY, isAllDay), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync3, key, payloadTime + ':00'), _actions$sync3)));

				case 42:
					_context2.next = 44;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(handleTimeInput, { actions: actions, selectors: selectors }, action, key);

				case 44:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked2, this);
}

function handleTimeInput(_ref3, action, key) {
	var actions = _ref3.actions,
	    selectors = _ref3.selectors;

	var _actions$sync4;

	var payloadTime, isAllDay, startTimeMoment, endTimeMoment, startTime, endTime, startTimeInput, endTimeInput;
	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function handleTimeInput$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					payloadTime = action.payload[key];
					isAllDay = payloadTime === 'all-day';
					startTimeMoment = void 0, endTimeMoment = void 0;

					if (!isAllDay) {
						_context3.next = 12;
						break;
					}

					_context3.next = 6;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toMoment, '00:00', TIME_FORMAT, false);

				case 6:
					startTimeMoment = _context3.sent;
					_context3.next = 9;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toMoment, '23:59', TIME_FORMAT, false);

				case 9:
					endTimeMoment = _context3.sent;
					_context3.next = 24;
					break;

				case 12:
					_context3.next = 14;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(selectors.getStartTimeNoSeconds, action);

				case 14:
					startTime = _context3.sent;
					_context3.next = 17;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(selectors.getEndTimeNoSeconds, action);

				case 17:
					endTime = _context3.sent;
					_context3.next = 20;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toMoment, startTime, TIME_FORMAT, false);

				case 20:
					startTimeMoment = _context3.sent;
					_context3.next = 23;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toMoment, endTime, TIME_FORMAT, false);

				case 23:
					endTimeMoment = _context3.sent;

				case 24:
					_context3.next = 26;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toTime, startTimeMoment);

				case 26:
					startTimeInput = _context3.sent;
					_context3.next = 29;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toTime, endTimeMoment);

				case 29:
					endTimeInput = _context3.sent;
					_context3.next = 32;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.sync(action.index, (_actions$sync4 = {}, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync4, KEY_START_TIME_INPUT, startTimeInput), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync4, KEY_END_TIME_INPUT, endTimeInput), _actions$sync4)));

				case 32:
				case 'end':
					return _context3.stop();
			}
		}
	}, _marked3, this);
}

function handleMultiDayChange(_ref4, action, key) {
	var actions = _ref4.actions,
	    selectors = _ref4.selectors;
	var isMultiDay, startTime, endTime;
	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function handleMultiDayChange$(_context4) {
		while (1) {
			switch (_context4.prev = _context4.next) {
				case 0:
					isMultiDay = action.payload[key];

					if (isMultiDay) {
						_context4.next = 12;
						break;
					}

					_context4.next = 4;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(selectors.getStartTimeNoSeconds, action);

				case 4:
					startTime = _context4.sent;
					_context4.next = 7;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(selectors.getEndTimeNoSeconds, action);

				case 7:
					endTime = _context4.sent;
					_context4.next = 10;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(preventEndTimeBeforeStartTime, { actions: actions }, { startTime: startTime, endTime: endTime }, action);

				case 10:
					_context4.next = 12;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(handleTimeInput, { actions: actions, selectors: selectors }, action, key);

				case 12:
				case 'end':
					return _context4.stop();
			}
		}
	}, _marked4, this);
}

/**
 * Prevents end time from being before start time.
 * Should only prevent when not a multi-day event.
 *
 * @export
 * @param {Object} { actions } Actions for syncing
 * @param {Object} { startTime, endTime } Start and end time
 * @param {Object} action Action received
 */
function preventEndTimeBeforeStartTime(_ref5, _ref6, action) {
	var actions = _ref5.actions;
	var startTime = _ref6.startTime,
	    endTime = _ref6.endTime;

	var startTimeSeconds, endTimeSeconds, _actions$sync5, adjustedStartTime, adjustedEndTime;

	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function preventEndTimeBeforeStartTime$(_context5) {
		while (1) {
			switch (_context5.prev = _context5.next) {
				case 0:
					_context5.next = 2;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toSeconds, startTime, TIME_FORMAT_HH_MM);

				case 2:
					startTimeSeconds = _context5.sent;
					_context5.next = 5;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toSeconds, endTime, TIME_FORMAT_HH_MM);

				case 5:
					endTimeSeconds = _context5.sent;

					if (!(endTimeSeconds <= startTimeSeconds)) {
						_context5.next = 17;
						break;
					}

					// If there is less than half an hour left in the day, roll back one hour
					if (startTimeSeconds + HALF_HOUR_IN_SECONDS >= DAY_IN_SECONDS) {
						startTimeSeconds -= HOUR_IN_SECONDS;
					}

					endTimeSeconds = startTimeSeconds + HALF_HOUR_IN_SECONDS;

					_context5.next = 11;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(fromSeconds, startTimeSeconds, TIME_FORMAT_HH_MM);

				case 11:
					adjustedStartTime = _context5.sent;
					_context5.next = 14;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(fromSeconds, endTimeSeconds, TIME_FORMAT_HH_MM);

				case 14:
					adjustedEndTime = _context5.sent;
					_context5.next = 17;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.sync(action.index, (_actions$sync5 = {}, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync5, KEY_START_TIME, adjustedStartTime + ':00'), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync5, KEY_END_TIME, adjustedEndTime + ':00'), _actions$sync5)));

				case 17:
				case 'end':
					return _context5.stop();
			}
		}
	}, _marked5, this);
}

/**
 * Prevents start time from appearing ahead of end time.
 * Should only prevent when not a multi-day event.
 *
 * @export
 * @param {Object} { actions } Actions for syncing
 * @param {Object} { startTime, endTime } Start and end time
 * @param {Object} action Action received
 */
function preventStartTimeAfterEndTime(_ref7, _ref8, action) {
	var actions = _ref7.actions;
	var startTime = _ref8.startTime,
	    endTime = _ref8.endTime;

	var startTimeSeconds, endTimeSeconds, _actions$sync6, adjustedStartTime, adjustedEndTime;

	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function preventStartTimeAfterEndTime$(_context6) {
		while (1) {
			switch (_context6.prev = _context6.next) {
				case 0:
					_context6.next = 2;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toSeconds, startTime, TIME_FORMAT_HH_MM);

				case 2:
					startTimeSeconds = _context6.sent;
					_context6.next = 5;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toSeconds, endTime, TIME_FORMAT_HH_MM);

				case 5:
					endTimeSeconds = _context6.sent;

					if (!(startTimeSeconds >= endTimeSeconds)) {
						_context6.next = 17;
						break;
					}

					startTimeSeconds = Math.max(endTimeSeconds - HALF_HOUR_IN_SECONDS, 0);
					endTimeSeconds = Math.max(startTimeSeconds + MINUTE_IN_SECONDS, endTimeSeconds);

					_context6.next = 11;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(fromSeconds, startTimeSeconds, TIME_FORMAT_HH_MM);

				case 11:
					adjustedStartTime = _context6.sent;
					_context6.next = 14;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(fromSeconds, endTimeSeconds, TIME_FORMAT_HH_MM);

				case 14:
					adjustedEndTime = _context6.sent;
					_context6.next = 17;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.sync(action.index, (_actions$sync6 = {}, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync6, KEY_START_TIME, adjustedStartTime + ':00'), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync6, KEY_END_TIME, adjustedEndTime + ':00'), _actions$sync6)));

				case 17:
				case 'end':
					return _context6.stop();
			}
		}
	}, _marked6, this);
}

function handleWeekChange(_ref9, action, key) {
	var actions = _ref9.actions,
	    selectors = _ref9.selectors;

	var payloadWeek, weekWasNull, _actions$sync7;

	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function handleWeekChange$(_context7) {
		while (1) {
			switch (_context7.prev = _context7.next) {
				case 0:
					payloadWeek = action.payload[key];
					_context7.next = 3;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(selectors.getWeek, action);

				case 3:
					weekWasNull = !_context7.sent;

					if (!(payloadWeek && weekWasNull)) {
						_context7.next = 7;
						break;
					}

					_context7.next = 7;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.sync(action.index, (_actions$sync7 = {}, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync7, key, payloadWeek), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_actions$sync7, KEY_DAY, 1), _actions$sync7)));

				case 7:
				case 'end':
					return _context7.stop();
			}
		}
	}, _marked7, this);
}

function handleLimitTypeChange(_ref10, action, key) {
	var actions = _ref10.actions;
	var value, isDate, isCount, start, startMoment, startDate;
	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function handleLimitTypeChange$(_context8) {
		while (1) {
			switch (_context8.prev = _context8.next) {
				case 0:
					value = action.payload[key];
					isDate = value === _moderntribe_events_pro_data_blocks_recurring_constants__WEBPACK_IMPORTED_MODULE_4__["DATE"];
					isCount = value === _moderntribe_events_pro_data_blocks_recurring_constants__WEBPACK_IMPORTED_MODULE_4__["COUNT"];

					if (!isDate) {
						_context8.next = 17;
						break;
					}

					_context8.next = 6;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(_moderntribe_events_data__WEBPACK_IMPORTED_MODULE_6__["blocks"].datetime.selectors.getStart);

				case 6:
					start = _context8.sent;
					_context8.next = 9;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toMoment, start);

				case 9:
					startMoment = _context8.sent;
					_context8.next = 12;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(toDatabaseDate, startMoment);

				case 12:
					startDate = _context8.sent;
					_context8.next = 15;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.sync(action.index, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_LIMIT"], startDate)));

				case 15:
					_context8.next = 24;
					break;

				case 17:
					if (!isCount) {
						_context8.next = 22;
						break;
					}

					_context8.next = 20;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.sync(action.index, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_LIMIT"], 1)));

				case 20:
					_context8.next = 24;
					break;

				case 22:
					_context8.next = 24;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.sync(action.index, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_LIMIT"], null)));

				case 24:
				case 'end':
					return _context8.stop();
			}
		}
	}, _marked8, this);
}

function handleTimezoneChange(_ref11, action, key) {
	var actions = _ref11.actions;
	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function handleTimezoneChange$(_context9) {
		while (1) {
			switch (_context9.prev = _context9.next) {
				case 0:
					_context9.next = 2;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* put */ "e"])(actions.sync(action.index, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, _moderntribe_events_pro_data_blocks_constants__WEBPACK_IMPORTED_MODULE_3__["KEY_TIMEZONE"], action.payload[key])));

				case 2:
				case 'end':
					return _context9.stop();
			}
		}
	}, _marked9, this);
}

/***/ }),
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var createFind = __webpack_require__(361),
    findIndex = __webpack_require__(362);

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(186),
    baseKeys = __webpack_require__(125),
    isArrayLike = __webpack_require__(60);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SET_RELATED_EVENTS_INITIAL_STATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SET_RELATED_EVENTS_TITLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SET_RELATED_EVENTS_DISPLAY_IMAGES; });
/* harmony import */ var _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/**
 * Internal dependencies
 */


var SET_RELATED_EVENTS_INITIAL_STATE = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/SET_RELATED_EVENTS_INITIAL_STATE';

var SET_RELATED_EVENTS_TITLE = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/SET_RELATED_EVENTS_TITLE';

var SET_RELATED_EVENTS_DISPLAY_IMAGES = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_0__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/SET_RELATED_EVENTS_DISPLAY_IMAGES';

/***/ }),
/* 42 */,
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var actions_namespaceObject = {};
__webpack_require__.r(actions_namespaceObject);
__webpack_require__.d(actions_namespaceObject, "toggleRepeatBlocksVisibility", function() { return actions_toggleRepeatBlocksVisibility; });
__webpack_require__.d(actions_namespaceObject, "toggleRulePanelVisibility", function() { return actions_toggleRulePanelVisibility; });
__webpack_require__.d(actions_namespaceObject, "hideRulePanel", function() { return actions_hideRulePanel; });
__webpack_require__.d(actions_namespaceObject, "toggleExceptionPanelVisibility", function() { return actions_toggleExceptionPanelVisibility; });
__webpack_require__.d(actions_namespaceObject, "toggleRulePanelExpand", function() { return actions_toggleRulePanelExpand; });
__webpack_require__.d(actions_namespaceObject, "expandRulePanel", function() { return actions_expandRulePanel; });
__webpack_require__.d(actions_namespaceObject, "hideExceptionPanel", function() { return actions_hideExceptionPanel; });
__webpack_require__.d(actions_namespaceObject, "expandExceptionPanel", function() { return actions_expandExceptionPanel; });
__webpack_require__.d(actions_namespaceObject, "toggleExceptionPanelExpand", function() { return actions_toggleExceptionPanelExpand; });
var selectors_namespaceObject = {};
__webpack_require__.r(selectors_namespaceObject);
__webpack_require__.d(selectors_namespaceObject, "getUI", function() { return selectors_getUI; });
__webpack_require__.d(selectors_namespaceObject, "isRepeatBlockVisible", function() { return isRepeatBlockVisible; });
__webpack_require__.d(selectors_namespaceObject, "isRulePanelVisible", function() { return isRulePanelVisible; });
__webpack_require__.d(selectors_namespaceObject, "isExceptionPanelVisible", function() { return isExceptionPanelVisible; });
__webpack_require__.d(selectors_namespaceObject, "isRulePanelExpanded", function() { return isRulePanelExpanded; });
__webpack_require__.d(selectors_namespaceObject, "isExceptionPanelExpanded", function() { return isExceptionPanelExpanded; });

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/extends.js
var helpers_extends = __webpack_require__(18);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);

// EXTERNAL MODULE: ./src/modules/data/prefix.js
var prefix = __webpack_require__(16);

// CONCATENATED MODULE: ./src/modules/data/ui/types.js
/* eslint-disable max-len */
/**
 * Internal dependencies
 */


var TOGGLE_REPEAT_EVENTS_BLOCK_VISIBILITY = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/TOGGLE_REPEAT_EVENTS_BLOCK_VISIBILITY';

var TOGGLE_RULE_PANEL_VISIBILITY = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/TOGGLE_RULE_PANEL_VISIBILITY';
var HIDE_RULE_PANEL = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/HIDE_RULE_PANEL';

var TOGGLE_RULE_PANEL_EXPAND = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/TOGGLE_RULE_PANEL_EXPAND';
var EXPAND_RULE_PANEL = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/EXPAND_RULE_PANEL';

var TOGGLE_EXCEPTION_PANEL_VISIBILITY = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/TOGGLE_EXCEPTION_PANEL_VISIBILITY';
var HIDE_EXCEPTION_PANEL = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/HIDE_EXCEPTION_PANEL';

var TOGGLE_EXCEPTION_PANEL_EXPAND = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/TOGGLE_EXCEPTION_PANEL_EXPAND';
var EXPAND_EXCEPTION_PANEL = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/EXPAND_EXCEPTION_PANEL';
// CONCATENATED MODULE: ./src/modules/data/ui/reducer.js

/**
 * Internal dependencies
 */


var DEFAULT_STATE = {
	isRepeatBlockVisible: false,
	isRulePanelVisible: false,
	isExceptionPanelVisible: false,
	isRulePanelExpanded: false,
	isExceptionPanelExpanded: false
};

/* harmony default export */ var reducer = (function () {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
	var action = arguments[1];

	switch (action.type) {
		case TOGGLE_REPEAT_EVENTS_BLOCK_VISIBILITY:
			return extends_default()({}, state, {
				isRepeatBlockVisible: !state.isRepeatBlockVisible
			});
		case TOGGLE_RULE_PANEL_VISIBILITY:
			return extends_default()({}, state, {
				isRulePanelVisible: !state.isRulePanelVisible
			});
		case HIDE_RULE_PANEL:
			return extends_default()({}, state, {
				isRulePanelVisible: false
			});
		case TOGGLE_EXCEPTION_PANEL_VISIBILITY:
			return extends_default()({}, state, {
				isExceptionPanelVisible: !state.isExceptionPanelVisible
			});
		case HIDE_EXCEPTION_PANEL:
			return extends_default()({}, state, {
				isExceptionPanelVisible: false
			});
		case TOGGLE_RULE_PANEL_EXPAND:
			return extends_default()({}, state, {
				isRulePanelExpanded: !state.isRulePanelExpanded
			});
		case EXPAND_RULE_PANEL:
			return extends_default()({}, state, {
				isRulePanelExpanded: true
			});
		case TOGGLE_EXCEPTION_PANEL_EXPAND:
			return extends_default()({}, state, {
				isExceptionPanelExpanded: !state.isExceptionPanelExpanded
			});
		case EXPAND_EXCEPTION_PANEL:
			return extends_default()({}, state, {
				isExceptionPanelExpanded: true
			});
		default:
			return state;
	}
});
// CONCATENATED MODULE: ./src/modules/data/ui/actions.js
/**
 * Internal dependencies
 */


var actions_toggleRepeatBlocksVisibility = function toggleRepeatBlocksVisibility() {
	return {
		type: TOGGLE_REPEAT_EVENTS_BLOCK_VISIBILITY
	};
};

var actions_toggleRulePanelVisibility = function toggleRulePanelVisibility() {
	return {
		type: TOGGLE_RULE_PANEL_VISIBILITY
	};
};

var actions_hideRulePanel = function hideRulePanel() {
	return {
		type: HIDE_RULE_PANEL
	};
};

var actions_toggleExceptionPanelVisibility = function toggleExceptionPanelVisibility() {
	return {
		type: TOGGLE_EXCEPTION_PANEL_VISIBILITY
	};
};

var actions_toggleRulePanelExpand = function toggleRulePanelExpand() {
	return {
		type: TOGGLE_RULE_PANEL_EXPAND
	};
};

var actions_expandRulePanel = function expandRulePanel() {
	return {
		type: EXPAND_RULE_PANEL
	};
};

var actions_hideExceptionPanel = function hideExceptionPanel() {
	return {
		type: HIDE_EXCEPTION_PANEL
	};
};

var actions_expandExceptionPanel = function expandExceptionPanel() {
	return {
		type: EXPAND_EXCEPTION_PANEL
	};
};

var actions_toggleExceptionPanelExpand = function toggleExceptionPanelExpand() {
	return {
		type: TOGGLE_EXCEPTION_PANEL_EXPAND
	};
};
// EXTERNAL MODULE: ./node_modules/reselect/lib/index.js
var lib = __webpack_require__(4);

// EXTERNAL MODULE: external "tribe.common.data.plugins"
var external_tribe_common_data_plugins_ = __webpack_require__(29);

// CONCATENATED MODULE: ./src/modules/data/ui/selectors.js
/**
 * External dependencies
 */



var selectors_getUI = function getUI(state) {
	return state[external_tribe_common_data_plugins_["constants"].EVENTS_PRO_PLUGIN].ui;
};

var isRepeatBlockVisible = Object(lib["createSelector"])([selectors_getUI], function (ui) {
	return ui.isRepeatBlockVisible;
});
var isRulePanelVisible = Object(lib["createSelector"])([selectors_getUI], function (ui) {
	return ui.isRulePanelVisible;
});
var isExceptionPanelVisible = Object(lib["createSelector"])([selectors_getUI], function (ui) {
	return ui.isExceptionPanelVisible;
});
var isRulePanelExpanded = Object(lib["createSelector"])([selectors_getUI], function (ui) {
	return ui.isRulePanelExpanded;
});
var isExceptionPanelExpanded = Object(lib["createSelector"])([selectors_getUI], function (ui) {
	return ui.isExceptionPanelExpanded;
});
// CONCATENATED MODULE: ./src/modules/data/ui/index.js
/* unused concated harmony import types */
/* concated harmony reexport actions */__webpack_require__.d(__webpack_exports__, "a", function() { return actions_namespaceObject; });
/* concated harmony reexport selectors */__webpack_require__.d(__webpack_exports__, "c", function() { return selectors_namespaceObject; });
/**
 * Internal dependencies
 */





/* harmony default export */ var ui = __webpack_exports__["b"] = (reducer);


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(144)('wks');
var uid = __webpack_require__(108);
var Symbol = __webpack_require__(53).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(64),
    getRawTag = __webpack_require__(260),
    objectToString = __webpack_require__(261);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = tribe.common.utils.string;

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export BUFFER_OVERFLOW */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return buffers; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


var BUFFER_OVERFLOW = "Channel's Buffer overflow!";

var ON_OVERFLOW_THROW = 1;
var ON_OVERFLOW_DROP = 2;
var ON_OVERFLOW_SLIDE = 3;
var ON_OVERFLOW_EXPAND = 4;

var zeroBuffer = { isEmpty: _utils__WEBPACK_IMPORTED_MODULE_0__[/* kTrue */ "o"], put: _utils__WEBPACK_IMPORTED_MODULE_0__[/* noop */ "r"], take: _utils__WEBPACK_IMPORTED_MODULE_0__[/* noop */ "r"] };

function ringBuffer() {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var overflowAction = arguments[1];

  var arr = new Array(limit);
  var length = 0;
  var pushIndex = 0;
  var popIndex = 0;

  var push = function push(it) {
    arr[pushIndex] = it;
    pushIndex = (pushIndex + 1) % limit;
    length++;
  };

  var take = function take() {
    if (length != 0) {
      var it = arr[popIndex];
      arr[popIndex] = null;
      length--;
      popIndex = (popIndex + 1) % limit;
      return it;
    }
  };

  var flush = function flush() {
    var items = [];
    while (length) {
      items.push(take());
    }
    return items;
  };

  return {
    isEmpty: function isEmpty() {
      return length == 0;
    },
    put: function put(it) {
      if (length < limit) {
        push(it);
      } else {
        var doubledLimit = void 0;
        switch (overflowAction) {
          case ON_OVERFLOW_THROW:
            throw new Error(BUFFER_OVERFLOW);
          case ON_OVERFLOW_SLIDE:
            arr[pushIndex] = it;
            pushIndex = (pushIndex + 1) % limit;
            popIndex = pushIndex;
            break;
          case ON_OVERFLOW_EXPAND:
            doubledLimit = 2 * limit;

            arr = flush();

            length = arr.length;
            pushIndex = arr.length;
            popIndex = 0;

            arr.length = doubledLimit;
            limit = doubledLimit;

            push(it);
            break;
          default:
          // DROP
        }
      }
    },
    take: take,
    flush: flush
  };
}

var buffers = {
  none: function none() {
    return zeroBuffer;
  },
  fixed: function fixed(limit) {
    return ringBuffer(limit, ON_OVERFLOW_THROW);
  },
  dropping: function dropping(limit) {
    return ringBuffer(limit, ON_OVERFLOW_DROP);
  },
  sliding: function sliding(limit) {
    return ringBuffer(limit, ON_OVERFLOW_SLIDE);
  },
  expanding: function expanding(initialSize) {
    return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
  }
};

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__(26);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);

// EXTERNAL MODULE: external {"var":"wp.i18n","root":["wp","i18n"]}
var external_var_wp_i18n_root_wp_i18n_ = __webpack_require__(3);

// EXTERNAL MODULE: external "tribe.common.utils.string"
var external_tribe_common_utils_string_ = __webpack_require__(49);

// EXTERNAL MODULE: ./node_modules/react-redux/es/index.js + 19 modules
var es = __webpack_require__(22);

// EXTERNAL MODULE: ./node_modules/redux/es/redux.js
var redux = __webpack_require__(19);

// EXTERNAL MODULE: external "tribe.common.hoc"
var external_tribe_common_hoc_ = __webpack_require__(20);

// EXTERNAL MODULE: ./src/modules/data/blocks/additional-fields/index.js + 7 modules
var additional_fields = __webpack_require__(13);

// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/container.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



var container_mapStateToProps = function mapStateToProps(state, ownProps) {
	return {
		isPristine: additional_fields["d" /* selectors */].getFieldIsPristine(state, ownProps),
		value: additional_fields["d" /* selectors */].getFieldValue(state, ownProps),
		list: additional_fields["d" /* selectors */].getFieldCheckboxValue(state, ownProps),
		type: additional_fields["d" /* selectors */].getFieldType(state, ownProps),
		label: additional_fields["d" /* selectors */].getFieldLabel(state, ownProps),
		output: additional_fields["d" /* selectors */].getFieldOutput(state, ownProps),
		metaKey: additional_fields["d" /* selectors */].getFieldMetaKey(state, ownProps)
	};
};

var container_mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	return {
		setInitialState: function setInitialState(props) {
			dispatch(additional_fields["a" /* actions */].setInitialState(props));
		},
		onBlockBlur: function onBlockBlur() {
			var name = ownProps.name;

			dispatch(additional_fields["a" /* actions */].setFieldBlur(name));
		}
	};
};

/* harmony default export */ var container = (Object(redux["c" /* compose */])(Object(external_tribe_common_hoc_["withStore"])(), Object(es["a" /* connect */])(container_mapStateToProps, container_mapDispatchToProps), Object(external_tribe_common_hoc_["withSaveData"])(), Object(external_tribe_common_hoc_["withSelected"])()));
// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(8);

// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(0);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// EXTERNAL MODULE: ./node_modules/sprintf-js/src/sprintf.js
var sprintf = __webpack_require__(99);

// EXTERNAL MODULE: external {"var":"wp.components","root":["wp","components"]}
var external_var_wp_components_root_wp_components_ = __webpack_require__(57);

// EXTERNAL MODULE: external {"var":"wp.editor","root":["wp","editor"]}
var external_var_wp_editor_root_wp_editor_ = __webpack_require__(147);

// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/elements/settings/template.js
/**
 * External dependencies
 */




/**
 * Wordpress dependencies
 */




var template_Settings = function Settings(_ref) {
	var name = _ref.name,
	    before = _ref.before,
	    after = _ref.after,
	    settingsLink = _ref.settingsLink;
	return wp.element.createElement(
		external_var_wp_editor_root_wp_editor_["InspectorControls"],
		{ key: 'inspector' },
		before,
		wp.element.createElement(
			external_var_wp_components_root_wp_components_["PanelBody"],
			{ title: Object(sprintf["sprintf"])(Object(external_var_wp_i18n_root_wp_i18n_["__"])('%1$s Settings', 'tribe-events-calendar-pro'), name) },
			!!settingsLink && wp.element.createElement(
				'span',
				null,
				Object(external_var_wp_i18n_root_wp_i18n_["__"])('Adjust this block’s options under Events → Settings → ', 'tribe-events-calendar-pro'),
				wp.element.createElement(
					'a',
					{ href: settingsLink, target: '_blank', rel: 'noreferrer noopener' },
					Object(external_var_wp_i18n_root_wp_i18n_["__"])('Additional Fields', 'tribe-events-calendar-pro')
				)
			)
		),
		after
	);
};

template_Settings.propTypes = {
	before: prop_types_default.a.node,
	name: prop_types_default.a.string.isRequired,
	settingsLink: prop_types_default.a.string,
	after: prop_types_default.a.node
};

/* harmony default export */ var template = (template_Settings);
// EXTERNAL MODULE: external "tribe.common.utils"
var external_tribe_common_utils_ = __webpack_require__(17);

// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/elements/settings/container.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




/**
 * @todo get data from a selector
 */
var container_getSettingsLink = function getSettingsLink() {
  return external_tribe_common_utils_["globals"].pro().additional_fields_tab || '';
};

var settings_container_mapStateToProps = function mapStateToProps() {
  return {
    settingsLink: container_getSettingsLink()
  };
};

/* harmony default export */ var settings_container = (Object(redux["c" /* compose */])(Object(external_tribe_common_hoc_["withStore"])(), Object(es["a" /* connect */])(settings_container_mapStateToProps))(template));
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(23);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);

// EXTERNAL MODULE: ./node_modules/lodash/isArray.js
var isArray = __webpack_require__(30);
var isArray_default = /*#__PURE__*/__webpack_require__.n(isArray);

// EXTERNAL MODULE: external "tribe.common.elements"
var external_tribe_common_elements_ = __webpack_require__(21);

// EXTERNAL MODULE: ./src/modules/blocks/additional-fields/elements/preview/style.pcss
var style = __webpack_require__(381);

// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/elements/preview/element.js
/**
 * External dependencies
 */





/**
 * Internal dependencies
 */



var element_Preview = function Preview(_ref) {
	var name = _ref.name,
	    children = _ref.children,
	    className = _ref.className;

	/**
  * Pass the control into the caller to decide how to render each child on an array, can be
  * a set of multiple paragraphs and to avoid the need to group a set of paragraphs inside another
  * we leave the control to the caller if is an array.
  */
	var body = isArray_default()(children) ? children : wp.element.createElement(
		external_tribe_common_elements_["Paragraph"],
		null,
		children
	);
	return wp.element.createElement(
		'div',
		{ className: classnames_default()('tribe-editor__additional-fields__preview', className) },
		wp.element.createElement(
			external_tribe_common_elements_["Heading"],
			{ level: 3, className: 'tribe-editor__additional-fields__preview-title' },
			name
		),
		body
	);
};

element_Preview.propTypes = {
	name: prop_types_default.a.string.isRequired,
	children: prop_types_default.a.node.isRequired
};

/* harmony default export */ var preview_element = (element_Preview);
// EXTERNAL MODULE: ./src/modules/blocks/additional-fields/elements/edit-container/style.pcss
var edit_container_style = __webpack_require__(382);

// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/elements/edit-container/element.js
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



var element_EditContainer = function EditContainer(_ref) {
	var name = _ref.name,
	    children = _ref.children,
	    className = _ref.className;
	return wp.element.createElement(
		'div',
		{ className: classnames_default()('tribe-editor__additional-fields__edit', className) },
		wp.element.createElement(
			'div',
			{ className: 'tribe-editor__aditional-fields__content' },
			wp.element.createElement(
				external_tribe_common_elements_["Heading"],
				{ level: 2, className: 'tribe-editor__additional-fields__edit-title' },
				name
			),
			wp.element.createElement(
				external_tribe_common_elements_["Paragraph"],
				null,
				children
			)
		)
	);
};

element_EditContainer.propTypes = {
	name: prop_types_default.a.string.isRequired,
	children: prop_types_default.a.node.isRequired
};

/* harmony default export */ var edit_container_element = (element_EditContainer);
// EXTERNAL MODULE: ./node_modules/lodash/capitalize.js
var capitalize = __webpack_require__(214);
var capitalize_default = /*#__PURE__*/__webpack_require__.n(capitalize);

// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/elements/field-container/template.js
/**
 * External dependencies
 */





/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */




var template_FieldTemplate = function FieldTemplate(_ref) {
	var isPristine = _ref.isPristine,
	    isSelected = _ref.isSelected,
	    label = _ref.label,
	    output = _ref.output,
	    input = _ref.input,
	    settings = _ref.settings;


	if (isSelected) {
		var nameNormalized = Object(external_tribe_common_utils_string_["normalize"])(label);
		return [wp.element.createElement(
			edit_container_element,
			{ key: 'edit-container-' + nameNormalized, name: label },
			input
		), settings ? settings : wp.element.createElement(settings_container, { key: 'settings-' + nameNormalized, name: label })];
	}

	if (isPristine) {
		var placeholderMessage = Object(sprintf["sprintf"])(Object(external_var_wp_i18n_root_wp_i18n_["__"])('Add %1$s', 'tribe-events-calendar-pro'), capitalize_default()(label));
		return wp.element.createElement(
			external_tribe_common_elements_["Placeholder"],
			null,
			placeholderMessage
		);
	} else {
		return wp.element.createElement(
			preview_element,
			{ name: label },
			output
		);
	}
};

template_FieldTemplate.propTypes = {
	id: prop_types_default.a.string.isRequired,
	input: prop_types_default.a.node.isRequired,
	label: prop_types_default.a.string,
	isPristine: prop_types_default.a.bool,
	isSelected: prop_types_default.a.bool,
	settings: prop_types_default.a.node,
	output: prop_types_default.a.node
};

template_FieldTemplate.defaultProps = {
	isPristine: true,
	isSelected: false
};

/* harmony default export */ var field_container_template = (template_FieldTemplate);
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/elements/field-container/container.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




var field_container_container_mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    isPristine: additional_fields["d" /* selectors */].getFieldIsPristine(state, { name: ownProps.id }),
    label: additional_fields["d" /* selectors */].getFieldLabel(state, { name: ownProps.id })
  };
};

/* harmony default export */ var field_container_container = (Object(redux["c" /* compose */])(Object(external_tribe_common_hoc_["withStore"])(), Object(es["a" /* connect */])(field_container_container_mapStateToProps, null))(field_container_template));
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/elements/index.js
/**
 * Internal dependencies
 */




// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/text/template.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



var template_TextField = function TextField(_ref) {
	var isSelected = _ref.isSelected,
	    value = _ref.value,
	    output = _ref.output,
	    onInputChange = _ref.onInputChange,
	    name = _ref.name;
	return wp.element.createElement(field_container_container, {
		id: name,
		input: wp.element.createElement(external_tribe_common_elements_["Input"], { type: 'text', value: value, onChange: onInputChange }),
		output: output,
		isSelected: isSelected
	});
};

template_TextField.propTypes = {
	name: prop_types_default.a.string,
	output: prop_types_default.a.string,
	isSelected: prop_types_default.a.bool,
	onInputChange: prop_types_default.a.func,
	value: prop_types_default.a.string
};

template_TextField.defaultProps = {
	isSelected: false
};

/* harmony default export */ var text_template = (template_TextField);
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/text/container.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




var text_container_mapStateToProps = function mapStateToProps(state, ownProps) {
	return {
		value: additional_fields["d" /* selectors */].getTextFieldValue(state, ownProps),
		output: additional_fields["d" /* selectors */].getFieldOutput(state, ownProps)
	};
};

var text_container_mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	return {
		onInputChange: function onInputChange(e) {
			var name = ownProps.name;

			dispatch(additional_fields["a" /* actions */].setFieldValue(name, e.target.value));
			dispatch(additional_fields["a" /* actions */].setFieldChange(name));
		}
	};
};

/* harmony default export */ var text_container = (Object(redux["c" /* compose */])(Object(external_tribe_common_hoc_["withStore"])(), Object(es["a" /* connect */])(text_container_mapStateToProps, text_container_mapDispatchToProps))(text_template));
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/url/template.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



var template_URLField = function URLField(_ref) {
	var name = _ref.name,
	    value = _ref.value,
	    output = _ref.output,
	    onInputChange = _ref.onInputChange,
	    isSelected = _ref.isSelected;
	return wp.element.createElement(field_container_container, {
		id: name,
		input: wp.element.createElement(external_tribe_common_elements_["UrlInput"], { value: value, onChange: onInputChange }),
		output: output,
		isSelected: isSelected
	});
};

template_URLField.propTypes = {
	name: prop_types_default.a.string,
	output: prop_types_default.a.string,
	isSelected: prop_types_default.a.bool,
	onInputChange: prop_types_default.a.func,
	value: prop_types_default.a.string
};

template_URLField.defaultProps = {
	isSelected: false
};

/* harmony default export */ var url_template = (template_URLField);
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/url/container.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




var url_container_mapStateToProps = function mapStateToProps(state, ownProps) {
	return {
		value: additional_fields["d" /* selectors */].getTextFieldValue(state, ownProps),
		output: additional_fields["d" /* selectors */].getFieldOutput(state, ownProps)
	};
};

var url_container_mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	return {
		onInputChange: function onInputChange(event) {
			var name = ownProps.name;

			dispatch(additional_fields["a" /* actions */].setFieldValue(name, event.target.value));
			dispatch(additional_fields["a" /* actions */].setFieldChange(name));
		}
	};
};

/* harmony default export */ var url_container = (Object(redux["c" /* compose */])(Object(external_tribe_common_hoc_["withStore"])(), Object(es["a" /* connect */])(url_container_mapStateToProps, url_container_mapDispatchToProps))(url_template));
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/text-area/template.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



var template_TextAreaField = function TextAreaField(_ref) {
	var name = _ref.name,
	    value = _ref.value,
	    onInputChange = _ref.onInputChange,
	    output = _ref.output,
	    isSelected = _ref.isSelected;

	var paragraphs = output.map(function (paragraph, index) {
		return wp.element.createElement(
			external_tribe_common_elements_["Paragraph"],
			{ key: 'textarea-' + name + '-' + (index + 1) },
			paragraph
		);
	});
	return wp.element.createElement(field_container_container, {
		id: name,
		input: wp.element.createElement(external_tribe_common_elements_["Textarea"], { rows: '5', wrap: 'hard', value: value, onChange: onInputChange }),
		output: paragraphs,
		isSelected: isSelected
	});
};

template_TextAreaField.propTypes = {
	name: prop_types_default.a.string.isRequired,
	isSelected: prop_types_default.a.bool,
	onInputChange: prop_types_default.a.func,
	value: prop_types_default.a.string,
	output: prop_types_default.a.arrayOf(prop_types_default.a.string)
};

template_TextAreaField.defaultProps = {
	isSelected: false
};

/* harmony default export */ var text_area_template = (template_TextAreaField);
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/text-area/container.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




var text_area_container_mapStateToProps = function mapStateToProps(state, ownProps) {
	return {
		value: additional_fields["d" /* selectors */].getTextFieldValue(state, ownProps),
		output: additional_fields["d" /* selectors */].getTextAreaOutput(state, ownProps)
	};
};

var text_area_container_mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	return {
		onInputChange: function onInputChange(e) {
			var name = ownProps.name;

			dispatch(additional_fields["a" /* actions */].setFieldValue(name, e.target.value));
			dispatch(additional_fields["a" /* actions */].setFieldChange(name));
		}
	};
};

/* harmony default export */ var text_area_container = (Object(redux["c" /* compose */])(Object(external_tribe_common_hoc_["withStore"])(), Object(es["a" /* connect */])(text_area_container_mapStateToProps, text_area_container_mapDispatchToProps))(text_area_template));
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/dropdown/template.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



var template_DropdownField = function DropdownField(_ref) {
	var name = _ref.name,
	    value = _ref.value,
	    options = _ref.options,
	    onInputChange = _ref.onInputChange,
	    isSelected = _ref.isSelected,
	    output = _ref.output;
	return wp.element.createElement(field_container_container, {
		id: name,
		input: wp.element.createElement(external_tribe_common_elements_["Select"], {
			options: options,
			value: value,
			onChange: onInputChange,
			isSearchable: false,
			backspaceRemovesValue: false
		}),
		output: output,
		isSelected: isSelected
	});
};

template_DropdownField.propTypes = {
	name: prop_types_default.a.string.isRequired,
	isSelected: prop_types_default.a.bool,
	onInputChange: prop_types_default.a.func,
	value: prop_types_default.a.object,
	output: prop_types_default.a.string,
	options: prop_types_default.a.arrayOf(prop_types_default.a.shape({
		value: prop_types_default.a.string,
		label: prop_types_default.a.string
	}))
};

template_DropdownField.defaultProps = {
	isSelected: false
};

/* harmony default export */ var dropdown_template = (template_DropdownField);
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/dropdown/container.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




var dropdown_container_mapStateToProps = function mapStateToProps(state, ownProps) {
	return {
		value: additional_fields["d" /* selectors */].getFieldDropdownValue(state, ownProps),
		output: additional_fields["d" /* selectors */].getFieldDropdownOutput(state, ownProps),
		options: additional_fields["d" /* selectors */].getFieldOptionsWithLabels(state, ownProps)
	};
};

var dropdown_container_mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	return {
		onInputChange: function onInputChange(_ref) {
			var value = _ref.value;
			var name = ownProps.name;

			dispatch(additional_fields["a" /* actions */].setFieldValue(name, value));
			dispatch(additional_fields["a" /* actions */].setFieldChange(name));
		}
	};
};

/* harmony default export */ var dropdown_container = (Object(redux["c" /* compose */])(Object(external_tribe_common_hoc_["withStore"])(), Object(es["a" /* connect */])(dropdown_container_mapStateToProps, dropdown_container_mapDispatchToProps))(dropdown_template));
// EXTERNAL MODULE: ./src/modules/blocks/additional-fields/radio/style.pcss
var radio_style = __webpack_require__(389);

// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/radio/template.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */





var template_RadioInput = function RadioInput(_ref) {
	var options = _ref.options,
	    onChange = _ref.onChange,
	    selectedValue = _ref.selectedValue;
	return wp.element.createElement(
		'fieldset',
		{ className: 'tribe-editor__additional-fields__edit--horizontal-fields' },
		options.map(function (option, index) {
			var _option$label = option.label,
			    label = _option$label === undefined ? '' : _option$label,
			    _option$value = option.value,
			    value = _option$value === undefined ? '' : _option$value;

			var isChecked = value === selectedValue;
			return wp.element.createElement(external_tribe_common_elements_["Radio"], {
				checked: isChecked,
				id: 'name-' + (index + 1),
				value: value,
				onChange: onChange,
				name: Object(external_tribe_common_utils_string_["normalize"])(label),
				label: label,
				className: 'tribe-editor__additional-fields__field--radio'
			});
		})
	);
};

var template_RadioField = function RadioField(_ref2) {
	var name = _ref2.name,
	    value = _ref2.value,
	    output = _ref2.output,
	    options = _ref2.options,
	    onInputChange = _ref2.onInputChange,
	    isSelected = _ref2.isSelected;
	return wp.element.createElement(field_container_container, {
		id: name,
		input: wp.element.createElement(template_RadioInput, { selectedValue: value, onChange: onInputChange, options: options }),
		output: output,
		isSelected: isSelected
	});
};

template_RadioField.propTypes = {
	name: prop_types_default.a.string.isRequired,
	isSelected: prop_types_default.a.bool,
	onInputChange: prop_types_default.a.func,
	value: prop_types_default.a.string,
	output: prop_types_default.a.string,
	options: prop_types_default.a.arrayOf(prop_types_default.a.shape({
		value: prop_types_default.a.string,
		label: prop_types_default.a.string
	}))
};

template_RadioField.defaultProps = {
	isSelected: false
};

/* harmony default export */ var radio_template = (template_RadioField);
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/radio/container.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




var radio_container_mapStateToProps = function mapStateToProps(state, ownProps) {
	return {
		value: additional_fields["d" /* selectors */].getTextFieldValue(state, ownProps),
		output: additional_fields["d" /* selectors */].getFieldOutput(state, ownProps),
		options: additional_fields["d" /* selectors */].getFieldOptionsWithLabels(state, ownProps)
	};
};

var radio_container_mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	return {
		onInputChange: function onInputChange(event) {
			var name = ownProps.name;

			dispatch(additional_fields["a" /* actions */].setFieldValue(name, event.target.value));
			dispatch(additional_fields["a" /* actions */].setFieldChange(name));
		}
	};
};

/* harmony default export */ var radio_container = (Object(redux["c" /* compose */])(Object(external_tribe_common_hoc_["withStore"])(), Object(es["a" /* connect */])(radio_container_mapStateToProps, radio_container_mapDispatchToProps))(radio_template));
// EXTERNAL MODULE: ./src/modules/blocks/additional-fields/checkbox/settings/style.pcss
var settings_style = __webpack_require__(390);

// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/checkbox/settings/template.js
/**
 * External dependencies
 */



/**
 * Wordpress dependencies
 */



/**
 * Internal dependencies
 */



var template_CheckboxSettings = function CheckboxSettings(props) {
	var label = props.label,
	    listDividerOnChange = props.listDividerOnChange,
	    listDividerValue = props.listDividerValue,
	    listEnderOnChange = props.listEnderOnChange,
	    listEnderValue = props.listEnderValue;


	var After = function After() {
		return wp.element.createElement(
			external_var_wp_components_root_wp_components_["PanelBody"],
			{ title: Object(external_var_wp_i18n_root_wp_i18n_["__"])('Custom Dividers', 'tribe-events-calendar-pro') },
			wp.element.createElement(external_var_wp_components_root_wp_components_["TextControl"], {
				label: Object(external_var_wp_i18n_root_wp_i18n_["__"])('List divider', 'tribe-events-calendar-pro'),
				value: listDividerValue,
				onChange: listDividerOnChange,
				className: 'tribe-editor__additional-fields__divider-settings'
			}),
			wp.element.createElement(external_var_wp_components_root_wp_components_["TextControl"], {
				label: Object(external_var_wp_i18n_root_wp_i18n_["__"])('List ender', 'tribe-events-calendar-pro'),
				value: listEnderValue,
				onChange: listEnderOnChange,
				className: 'tribe-editor__additional-fields__divider-settings'
			})
		);
	};

	return wp.element.createElement(settings_container, { name: label, after: wp.element.createElement(After, null) });
};

template_CheckboxSettings.propTypes = {
	id: prop_types_default.a.string.isRequired,
	label: prop_types_default.a.string,
	listDividerValue: prop_types_default.a.string,
	listDividerOnChange: prop_types_default.a.func,
	listEnderValue: prop_types_default.a.string,
	listEnderOnChange: prop_types_default.a.func
};

template_CheckboxSettings.defaultProps = {
	listDividerValue: ', ',
	listEnderValue: Object(external_var_wp_i18n_root_wp_i18n_["__"])(' and ', 'tribe-events-calendar-pro')
};

/* harmony default export */ var settings_template = (template_CheckboxSettings);
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/checkbox/settings/container.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




var checkbox_settings_container_mapStateToProps = function mapStateToProps(state, ownProps) {
	return {
		label: additional_fields["d" /* selectors */].getFieldLabel(state, { name: ownProps.id }),
		listDividerValue: additional_fields["d" /* selectors */].getFieldDividerList(state, { name: ownProps.id }),
		listEnderValue: additional_fields["d" /* selectors */].getFieldDividerEnd(state, { name: ownProps.id })
	};
};

var settings_container_mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	return {
		listDividerOnChange: function listDividerOnChange(value) {
			dispatch(additional_fields["a" /* actions */].setFieldDividerList(ownProps.id, value));
		},
		listEnderOnChange: function listEnderOnChange(value) {
			dispatch(additional_fields["a" /* actions */].setFieldDividerEnd(ownProps.id, value));
		}
	};
};

/* harmony default export */ var checkbox_settings_container = (Object(redux["c" /* compose */])(Object(external_tribe_common_hoc_["withStore"])(), Object(es["a" /* connect */])(checkbox_settings_container_mapStateToProps, settings_container_mapDispatchToProps))(settings_template));
// EXTERNAL MODULE: ./src/modules/blocks/additional-fields/checkbox/style.pcss
var checkbox_style = __webpack_require__(391);

// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/checkbox/template.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */






var template_CheckboxInput = function CheckboxInput(_ref) {
	var options = _ref.options,
	    onChange = _ref.onChange;
	return wp.element.createElement(
		'fieldset',
		{ className: 'tribe-editor__additional-fields__edit--horizontal-fields' },
		options.map(function (option, index) {
			var _option$label = option.label,
			    label = _option$label === undefined ? '' : _option$label,
			    _option$value = option.value,
			    value = _option$value === undefined ? '' : _option$value,
			    _option$isChecked = option.isChecked,
			    isChecked = _option$isChecked === undefined ? false : _option$isChecked;

			return wp.element.createElement(external_tribe_common_elements_["Checkbox"], {
				id: 'name-' + (index + 1),
				checked: isChecked,
				onChange: onChange,
				name: Object(external_tribe_common_utils_string_["normalize"])(label),
				value: value,
				label: label,
				className: 'tribe-editor__additional-fields__field--checkbox'
			});
		})
	);
};

var template_CheckboxField = function CheckboxField(_ref2) {
	var name = _ref2.name,
	    output = _ref2.output,
	    options = _ref2.options,
	    onInputChange = _ref2.onInputChange,
	    isSelected = _ref2.isSelected;
	return wp.element.createElement(field_container_container, {
		id: name,
		input: wp.element.createElement(template_CheckboxInput, { onChange: onInputChange, options: options }),
		output: output,
		settings: wp.element.createElement(checkbox_settings_container, { id: name }),
		isSelected: isSelected
	});
};

template_CheckboxField.propTypes = {
	name: prop_types_default.a.string.isRequired,
	output: prop_types_default.a.string,
	isSelected: prop_types_default.a.bool,
	onInputChange: prop_types_default.a.func,
	options: prop_types_default.a.arrayOf(prop_types_default.a.shape({
		value: prop_types_default.a.string,
		label: prop_types_default.a.string,
		isChecked: prop_types_default.a.bool
	}))
};

template_CheckboxField.defaultProps = {
	isSelected: false
};

/* harmony default export */ var checkbox_template = (template_CheckboxField);
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/checkbox/container.js
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




var checkbox_container_mapStateToProps = function mapStateToProps(state, ownProps) {
	return {
		output: additional_fields["d" /* selectors */].getFieldOutput(state, ownProps),
		options: additional_fields["d" /* selectors */].getFieldCheckboxOptions(state, ownProps)
	};
};

var checkbox_container_mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
	return {
		onInputChange: function onInputChange(event) {
			var name = ownProps.name;

			if (event.target.checked) {
				dispatch(additional_fields["a" /* actions */].appendFieldValue(name, event.target.value));
			} else {
				dispatch(additional_fields["a" /* actions */].removeFieldValue(name, event.target.value));
			}
			dispatch(additional_fields["a" /* actions */].setFieldChange(name));
		}
	};
};

/* harmony default export */ var checkbox_container = (Object(redux["c" /* compose */])(Object(external_tribe_common_hoc_["withStore"])(), Object(es["a" /* connect */])(checkbox_container_mapStateToProps, checkbox_container_mapDispatchToProps))(checkbox_template));
// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/index.js






// CONCATENATED MODULE: ./src/modules/blocks/additional-fields/utils.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FIELD_TYPES; });
/* unused harmony export FIELDS_SCHEMA */
/* unused harmony export fieldToBlock */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return utils_addAdditionalFields; });

/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */





var FIELD_TYPES = {
	text: 'text',
	checkbox: 'checkbox',
	dropdown: 'dropdown',
	url: 'url',
	radio: 'radio',
	textarea: 'textarea'
};

var FIELDS_SCHEMA = {
	text: {
		icon: 'editor-textcolor',
		container: text_container,
		type: 'string'
	},
	url: {
		icon: 'admin-links',
		container: url_container,
		type: 'string'
	},
	textarea: {
		icon: 'admin-comments',
		container: text_area_container,
		type: 'string'
	},
	dropdown: {
		icon: 'randomize',
		container: dropdown_container,
		type: 'array'
	},
	checkbox: {
		icon: 'yes',
		container: checkbox_container,
		type: 'array'
	},
	radio: {
		icon: 'editor-ul',
		container: radio_container,
		type: 'array'
	}
};

/**
 * Function used to return the configuration of a new block using the data from an additional field
 *
 * @since 4.5
 *
 * @param {object} field An object with the fields of the field to be created as block
 *
 * @returns {object} Returns an object that represents the block
 */
var utils_fieldToBlock = function fieldToBlock(field) {
	var name = field.name,
	    label = field.label,
	    type = field.type,
	    values = field.values;

	var schema = FIELDS_SCHEMA[type] || FIELDS_SCHEMA.text;
	var block = {
		id: 'field-' + Object(external_tribe_common_utils_string_["toBlockName"])(name),
		title: label,
		description: Object(external_var_wp_i18n_root_wp_i18n_["__"])('Additional Field', 'tribe-events-calendar-pro'),
		icon: schema.icon,
		category: 'tribe-events-pro-additional-fields',
		keywords: ['event', 'events-gutenberg', 'tribe'],

		supports: {
			html: false
		},

		attributes: {
			isPristine: {
				type: 'boolean',
				default: true
			},
			type: {
				type: 'string',
				default: ''
			},
			label: {
				type: 'string',
				default: ''
			},
			options: {
				type: schema.type,
				default: schema.type === 'string' ? '' : []
			},
			metaKey: {
				type: 'string',
				default: ''
			},
			output: {
				type: 'string',
				default: ''
			},
			value: {
				type: 'string',
				source: 'meta',
				meta: name
			},
			initialValues: {
				type: 'object',
				default: {
					metaKey: name,
					options: values,
					type: type,
					label: label
				}
			}
		},
		edit: container(schema.container),
		save: function save() {
			return null;
		}
	};

	if (type === FIELD_TYPES.checkbox) {
		block.attributes.list = {
			type: 'array',
			source: 'meta',
			meta: '_' + name
		};
	}
	return block;
};

/**
 * Extract the additional fields from the localized variable `tribe_js_config` and attempt to extract
 * any additional field and convert into a block.
 *
 * @since 4.5
 *
 * @param {array} blocks An array of blocks where to append more blocks
 *
 * @returns {[]} An array with the merge of blocks an addiitional fields
 */
var utils_addAdditionalFields = function addAdditionalFields(blocks) {
	var additionalFields = external_tribe_common_utils_["globals"].pro().additional_fields || [];
	var fields = additionalFields.map(function (field) {
		return utils_fieldToBlock(field);
	});
	return [].concat(toConsumableArray_default()(blocks), toConsumableArray_default()(fields));
};

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRules", function() { return getRules; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRulesCount", function() { return getRulesCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasRules", function() { return hasRules; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIndex", function() { return getIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRule", function() { return getRule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getType", function() { return getType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAllDay", function() { return getAllDay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMultiDay", function() { return getMultiDay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMultiDaySpan", function() { return getMultiDaySpan; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStartDate", function() { return getStartDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStartDateObj", function() { return getStartDateObj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStartDateInput", function() { return getStartDateInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStartTime", function() { return getStartTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStartTimeNoSeconds", function() { return getStartTimeNoSeconds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStartTimeInput", function() { return getStartTimeInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEndDate", function() { return getEndDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEndDateObj", function() { return getEndDateObj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEndDateInput", function() { return getEndDateInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEndTime", function() { return getEndTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEndTimeNoSeconds", function() { return getEndTimeNoSeconds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEndTimeInput", function() { return getEndTimeInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBetween", function() { return getBetween; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLimitType", function() { return getLimitType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLimit", function() { return getLimit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLimitDateObj", function() { return getLimitDateObj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLimitDateInput", function() { return getLimitDateInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDays", function() { return getDays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDay", function() { return getDay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMonth", function() { return getMonth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWeek", function() { return getWeek; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTimezone", function() { return getTimezone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTypeOption", function() { return getTypeOption; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLimitTypeOption", function() { return getLimitTypeOption; });
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(39);
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_find__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(56);
/* harmony import */ var _moderntribe_common_data_plugins__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(29);
/* harmony import */ var _moderntribe_common_data_plugins__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_moderntribe_common_data_plugins__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(14);

/* eslint-disable max-len */

/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




var getRules = function getRules(state) {
	return state[_moderntribe_common_data_plugins__WEBPACK_IMPORTED_MODULE_3__["constants"].EVENTS_PRO_PLUGIN].blocks.recurring;
};
var getRulesCount = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRules, function (rules) {
	return rules.length;
});
var hasRules = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRulesCount, function (count) {
	return !!count;
});
var getIndex = function getIndex(_, props) {
	return props.index;
};

var getRule = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])([getRules, getIndex], function (rules, index) {
	return rules[index];
});

var getType = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getType */ "y"]);
var getAllDay = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getAllDay */ "a"]);
var getMultiDay = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getMultiDay */ "p"]);
var getMultiDaySpan = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getMultiDaySpan */ "q"]);
var getStartDate = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getStartDate */ "r"]);
var getStartDateObj = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getStartDateObj */ "t"]);
var getStartDateInput = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getStartDateInput */ "s"]);
var getStartTime = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getStartTime */ "u"]);
var getStartTimeNoSeconds = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getStartTimeNoSeconds */ "w"]);
var getStartTimeInput = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getStartTimeInput */ "v"]);
var getEndDate = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getEndDate */ "e"]);
var getEndDateObj = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getEndDateObj */ "g"]);
var getEndDateInput = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getEndDateInput */ "f"]);
var getEndTime = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getEndTime */ "h"]);
var getEndTimeNoSeconds = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getEndTimeNoSeconds */ "j"]);
var getEndTimeInput = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getEndTimeInput */ "i"]);
var getBetween = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getBetween */ "b"]);
var getLimitType = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getLimitType */ "n"]);
var getLimit = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getLimit */ "k"]);
var getLimitDateObj = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getLimitDateObj */ "m"]);
var getLimitDateInput = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getLimitDateInput */ "l"]);
var getDays = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getDays */ "d"]);
var getDay = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getDay */ "c"]);
var getMonth = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getMonth */ "o"]);
var getWeek = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getWeek */ "z"]);
var getTimezone = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(getRule, _moderntribe_events_pro_data_shared_selectors__WEBPACK_IMPORTED_MODULE_4__[/* getTimezone */ "x"]);

var getTypeOption = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])([getType], function (type) {
	return lodash_find__WEBPACK_IMPORTED_MODULE_0___default()(_options__WEBPACK_IMPORTED_MODULE_2__["RECURRENCE_TYPE_RULES_OPTIONS"], function (option) {
		return option.value === type;
	});
});

var getLimitTypeOption = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])([getLimitType], function (limitType) {
	return lodash_find__WEBPACK_IMPORTED_MODULE_0___default()(_options__WEBPACK_IMPORTED_MODULE_2__["SERIES_ENDS_OPTIONS"], function (option) {
		return option.value === limitType;
	});
});

/***/ }),
/* 53 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(71);
var IE8_DOM_DEFINE = __webpack_require__(217);
var toPrimitive = __webpack_require__(150);
var dP = Object.defineProperty;

exports.f = __webpack_require__(59) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(259),
    getValue = __webpack_require__(264);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECURRENCE_TYPE_RULES_OPTIONS", function() { return RECURRENCE_TYPE_RULES_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNumericalOptions", function() { return createNumericalOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAILY_RECURRENCE_FREQUENCY_OPTIONS", function() { return DAILY_RECURRENCE_FREQUENCY_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEEKLY_RECURRENCE_FREQUENCY_OPTIONS", function() { return WEEKLY_RECURRENCE_FREQUENCY_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONTHLY_RECURRENCE_FREQUENCY_OPTIONS", function() { return MONTHLY_RECURRENCE_FREQUENCY_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YEARLY_RECURRENCE_FREQUENCY_OPTIONS", function() { return YEARLY_RECURRENCE_FREQUENCY_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SERIES_ENDS_OPTIONS", function() { return SERIES_ENDS_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAYS_OF_THE_WEEK_OPTIONS", function() { return DAYS_OF_THE_WEEK_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DAYS_OF_THE_MONTH_OPTIONS", function() { return DAYS_OF_THE_MONTH_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEEKS_OF_THE_MONTH_OPTIONS", function() { return WEEKS_OF_THE_MONTH_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONTH_DAYS_OPTIONS", function() { return MONTH_DAYS_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONTHS_OF_THE_YEAR_OPTIONS", function() { return MONTHS_OF_THE_YEAR_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECURRING_MULTI_DAY_OPTIONS", function() { return RECURRING_MULTI_DAY_OPTIONS; });
/* harmony import */ var babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26);
/* harmony import */ var babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);

/**
 * External Dependencies
 */


/**
 * Internal Dependencies
 */


//
// ─── RECURRENCE TYPES OPTIONS ───────────────────────────────────────────────────
//

var RECURRENCE_TYPE_RULES_OPTIONS = [{
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["DAILY_LABEL"],
	label_plural: _constants__WEBPACK_IMPORTED_MODULE_2__["DAILY_LABEL_PLURAL"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["DAILY"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["WEEKLY_LABEL"],
	label_plural: _constants__WEBPACK_IMPORTED_MODULE_2__["WEEKLY_LABEL_PLURAL"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["WEEKLY"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["MONTHLY_LABEL"],
	label_plural: _constants__WEBPACK_IMPORTED_MODULE_2__["MONTHLY_LABEL_PLURAL"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["MONTHLY"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["YEARLY_LABEL"],
	label_plural: _constants__WEBPACK_IMPORTED_MODULE_2__["YEARLY_LABEL_PLURAL"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["YEARLY"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["SINGLE_LABEL"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["SINGLE"]
}];

//
// ─── RECURRENCE FREQUENCY OPTIONS ───────────────────────────────────────────────
//

/**
 * Creates options for select element from 1 to max
 * @param {number} max The last number in the options list
 */
var createNumericalOptions = function createNumericalOptions(max) {
	return Array(max).fill().map(function (_, index) {
		return {
			label: String(index + 1),
			value: index + 1
		};
	});
};

var DAILY_RECURRENCE_FREQUENCY_OPTIONS = createNumericalOptions(6);
var WEEKLY_RECURRENCE_FREQUENCY_OPTIONS = createNumericalOptions(6);
var MONTHLY_RECURRENCE_FREQUENCY_OPTIONS = createNumericalOptions(12);
var YEARLY_RECURRENCE_FREQUENCY_OPTIONS = createNumericalOptions(6);

//
// ─── SERIES ENDS OPTIONS ────────────────────────────────────────────────────────
//

var SERIES_ENDS_OPTIONS = [{ label: _constants__WEBPACK_IMPORTED_MODULE_2__["ON_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["DATE"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["AFTER_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["COUNT"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["NEVER_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["NEVER"] }];

//
// ─── DAYS OF THE WEEK OPTIONS ────────────────────────────────────────
//

var DAYS_OF_THE_WEEK_OPTIONS = [{ label: _constants__WEBPACK_IMPORTED_MODULE_2__["MONDAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["MONDAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["TUESDAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["TUESDAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["WEDNESDAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["WEDNESDAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["THURSDAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["THURSDAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["FRIDAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["FRIDAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["SATURDAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["SATURDAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["SUNDAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["SUNDAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["DAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["DAY"] }];

//
// ─── DAYS AND WEEKS OF THE MONTH OPTIONS ────────────────────────────────────────
//

var DAYS_OF_THE_MONTH_OPTIONS = _constants__WEBPACK_IMPORTED_MODULE_2__["DAYS_OF_THE_MONTH"].map(function (value) {
	return { label: String(value), value: value };
});

var WEEKS_OF_THE_MONTH_OPTIONS = [{ label: _constants__WEBPACK_IMPORTED_MODULE_2__["FIRST_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["FIRST"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["SECOND_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["SECOND"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["THIRD_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["THIRD"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["FOURTH_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["FOURTH"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["FIFTH_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["FIFTH"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["LAST_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["LAST"] }];

var MONTH_DAYS_OPTIONS = [].concat(WEEKS_OF_THE_MONTH_OPTIONS, babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(DAYS_OF_THE_MONTH_OPTIONS));

//
// ─── MONTHS OF THE YEAR OPTIONS ─────────────────────────────────────────────────
//

var MONTHS_OF_THE_YEAR_OPTIONS = [{
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["JANUARY_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["JANUARY_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["JANUARY"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["FEBRUARY_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["FEBRUARY_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["FEBRUARY"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["MARCH_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["MARCH_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["MARCH"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["APRIL_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["APRIL_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["APRIL"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["MAY_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["MAY_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["MAY"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["JUNE_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["JUNE_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["JUNE"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["JULY_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["JULY_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["JULY"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["AUGUST_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["AUGUST_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["AUGUST"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["SEPTEMBER_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["SEPTEMBER_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["SEPTEMBER"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["OCTOBER_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["OCTOBER_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["OCTOBER"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["NOVEMBER_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["NOVEMBER_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["NOVEMBER"]
}, {
	label: _constants__WEBPACK_IMPORTED_MODULE_2__["DECEMBER_LABEL"],
	tag: _constants__WEBPACK_IMPORTED_MODULE_2__["DECEMBER_ABBR"],
	value: _constants__WEBPACK_IMPORTED_MODULE_2__["DECEMBER"]
}];

//
// ─── RECURRING MULTI DAY OPTIONS ────────────────────────────────────────────────
//

var RECURRING_MULTI_DAY_OPTIONS = [{ label: _constants__WEBPACK_IMPORTED_MODULE_2__["NEXT_DAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["NEXT_DAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["SECOND_DAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["SECOND_DAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["THIRD_DAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["THIRD_DAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["FOURTH_DAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["FOURTH_DAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["FIFTH_DAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["FIFTH_DAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["SIXTH_DAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["SIXTH_DAY"] }, { label: _constants__WEBPACK_IMPORTED_MODULE_2__["SEVENTH_DAY_LABEL"], value: _constants__WEBPACK_IMPORTED_MODULE_2__["SEVENTH_DAY"] }];

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = wp.components;

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/utils.js
var utils = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/redux-saga/es/internal/sagaHelpers/fsmIterator.js


var done = { done: true, value: undefined };
var qEnd = {};

function safeName(patternOrChannel) {
  if (utils["n" /* is */].channel(patternOrChannel)) {
    return 'channel';
  } else if (Array.isArray(patternOrChannel)) {
    return String(patternOrChannel.map(function (entry) {
      return String(entry);
    }));
  } else {
    return String(patternOrChannel);
  }
}

function fsmIterator(fsm, q0) {
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iterator';

  var updateState = void 0,
      qNext = q0;

  function next(arg, error) {
    if (qNext === qEnd) {
      return done;
    }

    if (error) {
      qNext = qEnd;
      throw error;
    } else {
      updateState && updateState(arg);

      var _fsm$qNext = fsm[qNext](),
          q = _fsm$qNext[0],
          output = _fsm$qNext[1],
          _updateState = _fsm$qNext[2];

      qNext = q;
      updateState = _updateState;
      return qNext === qEnd ? done : output;
    }
  }

  return Object(utils["q" /* makeIterator */])(next, function (error) {
    return next(null, error);
  }, name, true);
}
// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/io.js
var io = __webpack_require__(15);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/channel.js
var internal_channel = __webpack_require__(33);

// CONCATENATED MODULE: ./node_modules/redux-saga/es/internal/sagaHelpers/takeEvery.js




function takeEvery(patternOrChannel, worker) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var yTake = { done: false, value: Object(io["j" /* take */])(patternOrChannel) };
  var yFork = function yFork(ac) {
    return { done: false, value: io["f" /* fork */].apply(undefined, [worker].concat(args, [ac])) };
  };

  var action = void 0,
      setAction = function setAction(ac) {
    return action = ac;
  };

  return fsmIterator({
    q1: function q1() {
      return ['q2', yTake, setAction];
    },
    q2: function q2() {
      return action === internal_channel["a" /* END */] ? [qEnd] : ['q1', yFork(action)];
    }
  }, 'q1', 'takeEvery(' + safeName(patternOrChannel) + ', ' + worker.name + ')');
}
// CONCATENATED MODULE: ./node_modules/redux-saga/es/internal/sagaHelpers/takeLatest.js




function takeLatest(patternOrChannel, worker) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var yTake = { done: false, value: Object(io["j" /* take */])(patternOrChannel) };
  var yFork = function yFork(ac) {
    return { done: false, value: io["f" /* fork */].apply(undefined, [worker].concat(args, [ac])) };
  };
  var yCancel = function yCancel(task) {
    return { done: false, value: Object(io["e" /* cancel */])(task) };
  };

  var task = void 0,
      action = void 0;
  var setTask = function setTask(t) {
    return task = t;
  };
  var setAction = function setAction(ac) {
    return action = ac;
  };

  return fsmIterator({
    q1: function q1() {
      return ['q2', yTake, setAction];
    },
    q2: function q2() {
      return action === internal_channel["a" /* END */] ? [qEnd] : task ? ['q3', yCancel(task)] : ['q1', yFork(action), setTask];
    },
    q3: function q3() {
      return ['q1', yFork(action), setTask];
    }
  }, 'q1', 'takeLatest(' + safeName(patternOrChannel) + ', ' + worker.name + ')');
}
// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/buffers.js
var buffers = __webpack_require__(50);

// CONCATENATED MODULE: ./node_modules/redux-saga/es/internal/sagaHelpers/throttle.js






function throttle(delayLength, pattern, worker) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var action = void 0,
      channel = void 0;

  var yActionChannel = { done: false, value: Object(io["a" /* actionChannel */])(pattern, buffers["a" /* buffers */].sliding(1)) };
  var yTake = function yTake() {
    return { done: false, value: Object(io["j" /* take */])(channel) };
  };
  var yFork = function yFork(ac) {
    return { done: false, value: io["f" /* fork */].apply(undefined, [worker].concat(args, [ac])) };
  };
  var yDelay = { done: false, value: Object(io["d" /* call */])(utils["j" /* delay */], delayLength) };

  var setAction = function setAction(ac) {
    return action = ac;
  };
  var setChannel = function setChannel(ch) {
    return channel = ch;
  };

  return fsmIterator({
    q1: function q1() {
      return ['q2', yActionChannel, setChannel];
    },
    q2: function q2() {
      return ['q3', yTake(), setAction];
    },
    q3: function q3() {
      return action === internal_channel["a" /* END */] ? [qEnd] : ['q4', yFork(action)];
    },
    q4: function q4() {
      return ['q2', yDelay];
    }
  }, 'q1', 'throttle(' + safeName(pattern) + ', ' + worker.name + ')');
}
// CONCATENATED MODULE: ./node_modules/redux-saga/es/internal/sagaHelpers/index.js
/* unused harmony export takeEvery */
/* unused harmony export takeLatest */
/* unused harmony export throttle */
/* concated harmony reexport takeEveryHelper */__webpack_require__.d(__webpack_exports__, "a", function() { return takeEvery; });
/* concated harmony reexport takeLatestHelper */__webpack_require__.d(__webpack_exports__, "b", function() { return takeLatest; });
/* concated harmony reexport throttleHelper */__webpack_require__.d(__webpack_exports__, "c", function() { return throttle; });






var deprecationWarning = function deprecationWarning(helperName) {
  return 'import { ' + helperName + ' } from \'redux-saga\' has been deprecated in favor of import { ' + helperName + ' } from \'redux-saga/effects\'.\nThe latter will not work with yield*, as helper effects are wrapped automatically for you in fork effect.\nTherefore yield ' + helperName + ' will return task descriptor to your saga and execute next lines of code.';
};

var sagaHelpers_takeEvery = /*#__PURE__*/Object(utils["k" /* deprecate */])(takeEvery, /*#__PURE__*/deprecationWarning('takeEvery'));
var sagaHelpers_takeLatest = /*#__PURE__*/Object(utils["k" /* deprecate */])(takeLatest, /*#__PURE__*/deprecationWarning('takeLatest'));
var sagaHelpers_throttle = /*#__PURE__*/Object(utils["k" /* deprecate */])(throttle, /*#__PURE__*/deprecationWarning('throttle'));



/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(79)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(115),
    isLength = __webpack_require__(122);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return setTitle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return setDisplayImages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return setInitialState; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41);
/**
 * Internal dependencies
 */


var setTitle = function setTitle(title) {
	return {
		type: _types__WEBPACK_IMPORTED_MODULE_0__[/* SET_RELATED_EVENTS_TITLE */ "c"],
		payload: {
			title: title
		}
	};
};

var setDisplayImages = function setDisplayImages(displayImages) {
	return {
		type: _types__WEBPACK_IMPORTED_MODULE_0__[/* SET_RELATED_EVENTS_DISPLAY_IMAGES */ "a"],
		payload: {
			displayImages: displayImages
		}
	};
};

var setInitialState = function setInitialState(payload) {
	return {
		type: _types__WEBPACK_IMPORTED_MODULE_0__[/* SET_RELATED_EVENTS_INITIAL_STATE */ "b"],
		payload: payload
	};
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(53);
var core = __webpack_require__(45);
var ctx = __webpack_require__(142);
var hide = __webpack_require__(70);
var has = __webpack_require__(63);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 63 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(32);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(319),
    Map = __webpack_require__(128),
    Promise = __webpack_require__(320),
    Set = __webpack_require__(194),
    WeakMap = __webpack_require__(164),
    baseGetTag = __webpack_require__(47),
    toSource = __webpack_require__(166);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(75);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var convert = __webpack_require__(254),
    func = convert('curry', __webpack_require__(196));

func.placeholder = __webpack_require__(161);
module.exports = func;


/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = wp.data;

/***/ }),
/* 69 */,
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(54);
var createDesc = __webpack_require__(80);
module.exports = __webpack_require__(59) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(74);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 72 */
/***/ (function(module, exports) {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(180),
    isArrayLike = __webpack_require__(60),
    isString = __webpack_require__(375),
    toInteger = __webpack_require__(86),
    values = __webpack_require__(376);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

module.exports = includes;


/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(47),
    isObjectLike = __webpack_require__(38);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(184),
    baseAssignValue = __webpack_require__(185);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(158);
var defined = __webpack_require__(109);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return asap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return suspend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return flush; });
var queue = [];
/**
  Variable to hold a counting semaphore
  - Incrementing adds a lock and puts the scheduler in a `suspended` state (if it's not
    already suspended)
  - Decrementing releases a lock. Zero locks puts the scheduler in a `released` state. This
    triggers flushing the queued tasks.
**/
var semaphore = 0;

/**
  Executes a task 'atomically'. Tasks scheduled during this execution will be queued
  and flushed after this task has finished (assuming the scheduler endup in a released
  state).
**/
function exec(task) {
  try {
    suspend();
    task();
  } finally {
    release();
  }
}

/**
  Executes or queues a task depending on the state of the scheduler (`suspended` or `released`)
**/
function asap(task) {
  queue.push(task);

  if (!semaphore) {
    suspend();
    flush();
  }
}

/**
  Puts the scheduler in a `suspended` state. Scheduled tasks will be queued until the
  scheduler is released.
**/
function suspend() {
  semaphore++;
}

/**
  Puts the scheduler in a `released` state.
**/
function release() {
  semaphore--;
}

/**
  Releases the current lock. Executes all queued tasks if the scheduler is in the released state.
**/
function flush() {
  release();

  var task = void 0;
  while (!semaphore && (task = queue.shift()) !== undefined) {
    exec(task);
  }
}

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 82 */,
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(84),
    isObject = __webpack_require__(46);

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtor(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors. See
    // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject(result) ? result : thisBinding;
  };
}

module.exports = createCtor;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(46);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),
/* 85 */
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var toFinite = __webpack_require__(282);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(285),
    isObjectLike = __webpack_require__(38);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(32),
    stubFalse = __webpack_require__(286);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(103)(module)))

/***/ }),
/* 89 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(290),
    listCacheDelete = __webpack_require__(291),
    listCacheGet = __webpack_require__(292),
    listCacheHas = __webpack_require__(293),
    listCacheSet = __webpack_require__(294);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(102);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(55);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(308);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(30),
    isKey = __webpack_require__(136),
    stringToPath = __webpack_require__(203),
    toString = __webpack_require__(95);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(348);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),
/* 96 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return recurring; });
/* harmony import */ var babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26);
/* harmony import */ var babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(25);

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */


function edit(state, action) {
	var field = Object.assign({}, state[action.index], action.payload);

	if (state.length === 1) {
		return [field];
	}
	return [].concat(babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(state.slice(0, action.index)), [field], babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(state.slice(action.index + 1)));
}

function recurring() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	var action = arguments[1];

	switch (action.type) {
		case _types__WEBPACK_IMPORTED_MODULE_1__["ADD_RULE"]:
			return [].concat(babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(state), [action.payload]);
		case _types__WEBPACK_IMPORTED_MODULE_1__["EDIT_RULE"]:
			return edit(state, action);
		case _types__WEBPACK_IMPORTED_MODULE_1__["REMOVE_RULE"]:
			return state.filter(function (_, index) {
				return index !== action.index;
			});
		case _types__WEBPACK_IMPORTED_MODULE_1__["SYNC_RULES_FROM_DB"]:
			return JSON.parse(action.payload);
		default:
			return state;
	}
}

/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return exception; });
/* harmony import */ var babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26);
/* harmony import */ var babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28);

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */


function edit(state, action) {
	var field = Object.assign({}, state[action.index], action.payload);

	if (state.length === 1) {
		return [field];
	}
	return [].concat(babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(state.slice(0, action.index)), [field], babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(state.slice(action.index + 1)));
}

function exception() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	var action = arguments[1];

	switch (action.type) {
		case _types__WEBPACK_IMPORTED_MODULE_1__["ADD_EXCEPTION"]:
			return [].concat(babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(state), [action.payload]);
		case _types__WEBPACK_IMPORTED_MODULE_1__["EDIT_EXCEPTION"]:
			return edit(state, action);
		case _types__WEBPACK_IMPORTED_MODULE_1__["REMOVE_EXCEPTION"]:
			return state.filter(function (_, index) {
				return index !== action.index;
			});
		case _types__WEBPACK_IMPORTED_MODULE_1__["SYNC_EXCEPTIONS_FROM_DB"]:
			return JSON.parse(action.payload);
		default:
			return state;
	}
}

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

(function(window) {
    var re = {
        not_string: /[^s]/,
        number: /[diefg]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    }

    function sprintf() {
        var key = arguments[0], cache = sprintf.cache
        if (!(cache[key] && cache.hasOwnProperty(key))) {
            cache[key] = sprintf.parse(key)
        }
        return sprintf.format.call(null, cache[key], arguments)
    }

    sprintf.format = function(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = ""
        for (i = 0; i < tree_length; i++) {
            node_type = get_type(parse_tree[i])
            if (node_type === "string") {
                output[output.length] = parse_tree[i]
            }
            else if (node_type === "array") {
                match = parse_tree[i] // convenience purposes only
                if (match[2]) { // keyword argument
                    arg = argv[cursor]
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]))
                        }
                        arg = arg[match[2][k]]
                    }
                }
                else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]]
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++]
                }

                if (get_type(arg) == "function") {
                    arg = arg()
                }

                if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))
                }

                if (re.number.test(match[8])) {
                    is_positive = arg >= 0
                }

                switch (match[8]) {
                    case "b":
                        arg = arg.toString(2)
                    break
                    case "c":
                        arg = String.fromCharCode(arg)
                    break
                    case "d":
                    case "i":
                        arg = parseInt(arg, 10)
                    break
                    case "j":
                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0)
                    break
                    case "e":
                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()
                    break
                    case "f":
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)
                    break
                    case "g":
                        arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg)
                    break
                    case "o":
                        arg = arg.toString(8)
                    break
                    case "s":
                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)
                    break
                    case "u":
                        arg = arg >>> 0
                    break
                    case "x":
                        arg = arg.toString(16)
                    break
                    case "X":
                        arg = arg.toString(16).toUpperCase()
                    break
                }
                if (re.json.test(match[8])) {
                    output[output.length] = arg
                }
                else {
                    if (re.number.test(match[8]) && (!is_positive || match[3])) {
                        sign = is_positive ? "+" : "-"
                        arg = arg.toString().replace(re.sign, "")
                    }
                    else {
                        sign = ""
                    }
                    pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " "
                    pad_length = match[6] - (sign + arg).length
                    pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : "") : ""
                    output[output.length] = match[5] ? sign + arg + pad : (pad_character === "0" ? sign + pad + arg : pad + sign + arg)
                }
            }
        }
        return output.join("")
    }

    sprintf.cache = {}

    sprintf.parse = function(fmt) {
        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = match[0]
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = "%"
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1
                    var field_list = [], replacement_field = match[2], field_match = []
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list[field_list.length] = field_match[1]
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else {
                                throw new SyntaxError("[sprintf] failed to parse named argument key")
                            }
                        }
                    }
                    else {
                        throw new SyntaxError("[sprintf] failed to parse named argument key")
                    }
                    match[2] = field_list
                }
                else {
                    arg_names |= 2
                }
                if (arg_names === 3) {
                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")
                }
                parse_tree[parse_tree.length] = match
            }
            else {
                throw new SyntaxError("[sprintf] unexpected placeholder")
            }
            _fmt = _fmt.substring(match[0].length)
        }
        return parse_tree
    }

    var vsprintf = function(fmt, argv, _argv) {
        _argv = (argv || []).slice(0)
        _argv.splice(0, 0, fmt)
        return sprintf.apply(null, _argv)
    }

    /**
     * helpers
     */
    function get_type(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
    }

    function str_repeat(input, multiplier) {
        return Array(multiplier + 1).join(input)
    }

    /**
     * export to either browser or node.js
     */
    if (true) {
        exports.sprintf = sprintf
        exports.vsprintf = vsprintf
    }
    else {}
})(typeof window === "undefined" ? this : window);


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {}

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;


/***/ }),
/* 101 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 102 */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var baseMatches = __webpack_require__(335),
    baseMatchesProperty = __webpack_require__(344),
    identity = __webpack_require__(48),
    isArray = __webpack_require__(30),
    property = __webpack_require__(352);

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),
/* 105 */
/***/ (function(module, exports) {

module.exports = tribe.common.store;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(218);
var enumBugKeys = __webpack_require__(145);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 108 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 109 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 110 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(144)('keys');
var uid = __webpack_require__(108);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 112 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(109);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetData = __webpack_require__(162),
    createBind = __webpack_require__(265),
    createCurry = __webpack_require__(266),
    createHybrid = __webpack_require__(167),
    createPartial = __webpack_require__(280),
    getData = __webpack_require__(171),
    mergeData = __webpack_require__(281),
    setData = __webpack_require__(173),
    setWrapToString = __webpack_require__(175),
    toInteger = __webpack_require__(86);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags.
 *    1 - `_.bind`
 *    2 - `_.bindKey`
 *    4 - `_.curry` or `_.curryRight` of a bound function
 *    8 - `_.curry`
 *   16 - `_.curryRight`
 *   32 - `_.partial`
 *   64 - `_.partialRight`
 *  128 - `_.rearg`
 *  256 - `_.ary`
 *  512 - `_.flip`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }
  var data = isBindKey ? undefined : getData(func);

  var newData = [
    func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
    argPos, ary, arity
  ];

  if (data) {
    mergeData(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] === undefined
    ? (isBindKey ? 0 : func.length)
    : nativeMax(newData[9] - length, 0);

  if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
    bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
  }
  if (!bitmask || bitmask == WRAP_BIND_FLAG) {
    var result = createBind(func, bitmask, thisArg);
  } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
    result = createCurry(func, bitmask, arity);
  } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
    result = createPartial(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid.apply(undefined, newData);
  }
  var setter = data ? baseSetData : setData;
  return setWrapToString(setter(result, newData), func, bitmask);
}

module.exports = createWrap;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(47),
    isObject = __webpack_require__(46);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),
/* 116 */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(84),
    baseLodash = __webpack_require__(118);

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
 *
 * @private
 * @constructor
 * @param {*} value The value to wrap.
 */
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}

// Ensure `LazyWrapper` is an instance of `baseLodash`.
LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;

module.exports = LazyWrapper;


/***/ }),
/* 118 */
/***/ (function(module, exports) {

/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

module.exports = baseLodash;


/***/ }),
/* 119 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),
/* 120 */
/***/ (function(module, exports) {

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER;
      result[resIndex++] = index;
    }
  }
  return result;
}

module.exports = replaceHolders;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(287),
    baseUnary = __webpack_require__(123),
    nodeUtil = __webpack_require__(124);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),
/* 122 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 123 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(165);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(103)(module)))

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(89),
    nativeKeys = __webpack_require__(288);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(127),
    arrayEach = __webpack_require__(119),
    assignValue = __webpack_require__(184),
    baseAssign = __webpack_require__(183),
    baseAssignIn = __webpack_require__(312),
    cloneBuffer = __webpack_require__(315),
    copyArray = __webpack_require__(85),
    copySymbols = __webpack_require__(316),
    copySymbolsIn = __webpack_require__(318),
    getAllKeys = __webpack_require__(191),
    getAllKeysIn = __webpack_require__(193),
    getTag = __webpack_require__(65),
    initCloneArray = __webpack_require__(321),
    initCloneByTag = __webpack_require__(322),
    initCloneObject = __webpack_require__(327),
    isArray = __webpack_require__(30),
    isBuffer = __webpack_require__(88),
    isMap = __webpack_require__(328),
    isObject = __webpack_require__(46),
    isSet = __webpack_require__(330),
    keys = __webpack_require__(40);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });

    return result;
  }

  if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });

    return result;
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(90),
    stackClear = __webpack_require__(295),
    stackDelete = __webpack_require__(296),
    stackGet = __webpack_require__(297),
    stackHas = __webpack_require__(298),
    stackSet = __webpack_require__(299);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(55),
    root = __webpack_require__(32);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(300),
    mapCacheDelete = __webpack_require__(307),
    mapCacheGet = __webpack_require__(309),
    mapCacheHas = __webpack_require__(310),
    mapCacheSet = __webpack_require__(311);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(317),
    stubArray = __webpack_require__(189);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),
/* 131 */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(187);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var Uint8Array = __webpack_require__(195);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),
/* 134 */
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(94),
    toKey = __webpack_require__(66);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(30),
    isSymbol = __webpack_require__(75);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),
/* 137 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getRelatedEventsBlock */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getTitle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getDisplayImages; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _moderntribe_common_data_plugins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(29);
/* harmony import */ var _moderntribe_common_data_plugins__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_moderntribe_common_data_plugins__WEBPACK_IMPORTED_MODULE_1__);
/**
 * External dependencies
 */



var getRelatedEventsBlock = function getRelatedEventsBlock(state) {
	return state[_moderntribe_common_data_plugins__WEBPACK_IMPORTED_MODULE_1__["constants"].EVENTS_PRO_PLUGIN].blocks.relatedEvents;
};

var getTitle = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRelatedEventsBlock], function (relatedEvents) {
	return relatedEvents.title;
});

var getDisplayImages = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])([getRelatedEventsBlock], function (relatedEvents) {
	return relatedEvents.displayImages;
});

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(238);
} else {}


/***/ }),
/* 139 */,
/* 140 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {/* harmony import */ var _ponyfill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(210);
/* global window */


var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {}

var result = Object(_ponyfill_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(root);
/* harmony default export */ __webpack_exports__["a"] = (result);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(160), __webpack_require__(239)(module)))

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(177),
    createInverter = __webpack_require__(365),
    identity = __webpack_require__(48);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Creates an object composed of the inverted keys and values of `object`.
 * If `object` contains duplicate values, subsequent values overwrite
 * property assignments of previous values.
 *
 * @static
 * @memberOf _
 * @since 0.7.0
 * @category Object
 * @param {Object} object The object to invert.
 * @returns {Object} Returns the new inverted object.
 * @example
 *
 * var object = { 'a': 1, 'b': 2, 'c': 1 };
 *
 * _.invert(object);
 * // => { '1': 'c', '2': 'b' }
 */
var invert = createInverter(function(result, value, key) {
  if (value != null &&
      typeof value.toString != 'function') {
    value = nativeObjectToString.call(value);
  }

  result[value] = key;
}, constant(identity));

module.exports = invert;


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(232);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 143 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(45);
var global = __webpack_require__(53);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(107) ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 145 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(54).f;
var has = __webpack_require__(63);
var TAG = __webpack_require__(44)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 147 */
/***/ (function(module, exports) {

module.exports = wp.editor;

/***/ }),
/* 148 */,
/* 149 */,
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(74);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 151 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(71);
var dPs = __webpack_require__(244);
var enumBugKeys = __webpack_require__(145);
var IE_PROTO = __webpack_require__(111)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(157)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(245).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(337),
    isObjectLike = __webpack_require__(38);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(74);
var document = __webpack_require__(53).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(143);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(110);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 160 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 161 */
/***/ (function(module, exports) {

/**
 * The default argument placeholder value for methods.
 *
 * @type {Object}
 */
module.exports = {};


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(48),
    metaMap = __webpack_require__(163);

/**
 * The base implementation of `setData` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var baseSetData = !metaMap ? identity : function(func, data) {
  metaMap.set(func, data);
  return func;
};

module.exports = baseSetData;


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var WeakMap = __webpack_require__(164);

/** Used to store function metadata. */
var metaMap = WeakMap && new WeakMap;

module.exports = metaMap;


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(55),
    root = __webpack_require__(32);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(160)))

/***/ }),
/* 166 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

var composeArgs = __webpack_require__(168),
    composeArgsRight = __webpack_require__(169),
    countHolders = __webpack_require__(267),
    createCtor = __webpack_require__(83),
    createRecurry = __webpack_require__(170),
    getHolder = __webpack_require__(182),
    reorder = __webpack_require__(279),
    replaceHolders = __webpack_require__(120),
    root = __webpack_require__(32);

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_ARY_FLAG = 128,
    WRAP_FLIP_FLAG = 512;

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided
 *  to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & WRAP_ARY_FLAG,
      isBind = bitmask & WRAP_BIND_FLAG,
      isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
      isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
      isFlip = bitmask & WRAP_FLIP_FLAG,
      Ctor = isBindKey ? undefined : createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length;

    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder(wrapper),
          holdersCount = countHolders(args, placeholder);
    }
    if (partials) {
      args = composeArgs(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders(args, placeholder);
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, thisArg,
        args, newHolders, argPos, ary, arity - length
      );
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    length = args.length;
    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root && this instanceof wrapper) {
      fn = Ctor || createCtor(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

module.exports = createHybrid;


/***/ }),
/* 168 */
/***/ (function(module, exports) {

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersLength = holders.length,
      leftIndex = -1,
      leftLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(leftLength + rangeLength),
      isUncurried = !isCurried;

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

module.exports = composeArgs;


/***/ }),
/* 169 */
/***/ (function(module, exports) {

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersIndex = -1,
      holdersLength = holders.length,
      rightIndex = -1,
      rightLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(rangeLength + rightLength),
      isUncurried = !isCurried;

  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}

module.exports = composeArgsRight;


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

var isLaziable = __webpack_require__(268),
    setData = __webpack_require__(173),
    setWrapToString = __webpack_require__(175);

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_BOUND_FLAG = 4,
    WRAP_CURRY_FLAG = 8,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64;

/**
 * Creates a function that wraps `func` to continue currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {Function} wrapFunc The function to create the `func` wrapper.
 * @param {*} placeholder The placeholder value.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & WRAP_CURRY_FLAG,
      newHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;

  bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
  bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

  if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
    bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
  }
  var newData = [
    func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
    newHoldersRight, argPos, ary, arity
  ];

  var result = wrapFunc.apply(undefined, newData);
  if (isLaziable(func)) {
    setData(result, newData);
  }
  result.placeholder = placeholder;
  return setWrapToString(result, func, bitmask);
}

module.exports = createRecurry;


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var metaMap = __webpack_require__(163),
    noop = __webpack_require__(72);

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
var getData = !metaMap ? noop : function(func) {
  return metaMap.get(func);
};

module.exports = getData;


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(84),
    baseLodash = __webpack_require__(118);

/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable explicit method chain sequences.
 */
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = undefined;
}

LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;

module.exports = LodashWrapper;


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetData = __webpack_require__(162),
    shortOut = __webpack_require__(174);

/**
 * Sets metadata for `func`.
 *
 * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
 * period of time, it will trip its breaker and transition to an identity
 * function to avoid garbage collection pauses in V8. See
 * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
 * for more details.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var setData = shortOut(baseSetData);

module.exports = setData;


/***/ }),
/* 174 */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var getWrapDetails = __webpack_require__(273),
    insertWrapDetails = __webpack_require__(274),
    setToString = __webpack_require__(176),
    updateWrapDetails = __webpack_require__(276);

/**
 * Sets the `toString` method of `wrapper` to mimic the source of `reference`
 * with wrapper details in a comment at the top of the source body.
 *
 * @private
 * @param {Function} wrapper The function to modify.
 * @param {Function} reference The reference function.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Function} Returns `wrapper`.
 */
function setWrapToString(wrapper, reference, bitmask) {
  var source = (reference + '');
  return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
}

module.exports = setWrapToString;


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(275),
    shortOut = __webpack_require__(174);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),
/* 177 */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(55);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(180);

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(181),
    baseIsNaN = __webpack_require__(277),
    strictIndexOf = __webpack_require__(278);

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;


/***/ }),
/* 181 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),
/* 182 */
/***/ (function(module, exports) {

/**
 * Gets the argument placeholder value for `func`.
 *
 * @private
 * @param {Function} func The function to inspect.
 * @returns {*} Returns the placeholder value.
 */
function getHolder(func) {
  var object = func;
  return object.placeholder;
}

module.exports = getHolder;


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(76),
    keys = __webpack_require__(40);

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(185),
    eq = __webpack_require__(102);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(178);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(284),
    isArguments = __webpack_require__(87),
    isArray = __webpack_require__(30),
    isBuffer = __webpack_require__(88),
    isIndex = __webpack_require__(101),
    isTypedArray = __webpack_require__(121);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),
/* 187 */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(186),
    baseKeysIn = __webpack_require__(313),
    isArrayLike = __webpack_require__(60);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),
/* 189 */
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(131),
    getPrototype = __webpack_require__(132),
    getSymbols = __webpack_require__(130),
    stubArray = __webpack_require__(189);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(192),
    getSymbols = __webpack_require__(130),
    keys = __webpack_require__(40);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(131),
    isArray = __webpack_require__(30);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(192),
    getSymbolsIn = __webpack_require__(190),
    keysIn = __webpack_require__(188);

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(55),
    root = __webpack_require__(32);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(32);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

var createWrap = __webpack_require__(114);

/** Used to compose bitmasks for function metadata. */
var WRAP_CURRY_FLAG = 8;

/**
 * Creates a function that accepts arguments of `func` and either invokes
 * `func` returning its result, if at least `arity` number of arguments have
 * been provided, or returns a function that accepts the remaining `func`
 * arguments, and so on. The arity of `func` may be specified if `func.length`
 * is not sufficient.
 *
 * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for provided arguments.
 *
 * **Note:** This method doesn't set the "length" property of curried functions.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Function
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var abc = function(a, b, c) {
 *   return [a, b, c];
 * };
 *
 * var curried = _.curry(abc);
 *
 * curried(1)(2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // => [1, 2, 3]
 *
 * // Curried with placeholders.
 * curried(1)(_, 3)(2);
 * // => [1, 2, 3]
 */
function curry(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curry.placeholder;
  return result;
}

// Assign default placeholders.
curry.placeholder = {};

module.exports = curry;


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(47),
    getPrototype = __webpack_require__(132),
    isObjectLike = __webpack_require__(38);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(199),
    arraySome = __webpack_require__(222),
    cacheHas = __webpack_require__(200);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(129),
    setCacheAdd = __webpack_require__(338),
    setCacheHas = __webpack_require__(339);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),
/* 200 */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(46);

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),
/* 202 */
/***/ (function(module, exports) {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(346);

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

var flatten = __webpack_require__(356),
    overRest = __webpack_require__(359),
    setToString = __webpack_require__(176);

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;


/***/ }),
/* 205 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),
/* 206 */
/***/ (function(module, exports) {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

module.exports = hasUnicode;


/***/ }),
/* 207 */,
/* 208 */,
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var ReactIs = __webpack_require__(138);
var React = __webpack_require__(8);
var REACT_STATICS = {
    childContextTypes: true,
    contextType: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
};

var FORWARD_REF_STATICS = {
    '$$typeof': true,
    render: true
};

var TYPE_STATICS = {};
TYPE_STATICS[ReactIs.ForwardRef] = FORWARD_REF_STATICS;

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;

function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') {
        // don't hoist over string (html) components

        if (objectPrototype) {
            var inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        var keys = getOwnPropertyNames(sourceComponent);

        if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }

        var targetStatics = TYPE_STATICS[targetComponent['$$typeof']] || REACT_STATICS;
        var sourceStatics = TYPE_STATICS[sourceComponent['$$typeof']] || REACT_STATICS;

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
                var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                try {
                    // Avoid failures from read-only properties
                    defineProperty(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }

        return targetComponent;
    }

    return targetComponent;
}

module.exports = hoistNonReactStatics;


/***/ }),
/* 210 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return symbolObservablePonyfill; });
function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(96),
    baseClone = __webpack_require__(126),
    baseUnset = __webpack_require__(371),
    castPath = __webpack_require__(94),
    copyObject = __webpack_require__(76),
    customOmitClone = __webpack_require__(374),
    flatRest = __webpack_require__(204),
    getAllKeysIn = __webpack_require__(193);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

module.exports = omit;


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

var baseUniq = __webpack_require__(378);

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length) ? baseUniq(array) : [];
}

module.exports = uniq;


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

var baseKeys = __webpack_require__(125),
    getTag = __webpack_require__(65),
    isArguments = __webpack_require__(87),
    isArray = __webpack_require__(30),
    isArrayLike = __webpack_require__(60),
    isBuffer = __webpack_require__(88),
    isPrototype = __webpack_require__(89),
    isTypedArray = __webpack_require__(121);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

module.exports = isEmpty;


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

var toString = __webpack_require__(95),
    upperFirst = __webpack_require__(383);

/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */
function capitalize(string) {
  return upperFirst(toString(string).toLowerCase());
}

module.exports = capitalize;


/***/ }),
/* 215 */,
/* 216 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return INITIALIZE_SYNC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CANCEL_SYNC; });
/* unused harmony export serialize */
/* unused harmony export sync */
/* unused harmony export initialize */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return watchers; });
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);
/* harmony import */ var _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(16);



var _marked = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(serialize),
    _marked2 = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(sync),
    _marked3 = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(initialize),
    _marked4 = /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(watchers);

/**
 * External dependencies
 */



var INITIALIZE_SYNC = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_3__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/INITIALIZE_SYNC';
var CANCEL_SYNC = _moderntribe_events_pro_data_prefix__WEBPACK_IMPORTED_MODULE_3__[/* PREFIX_EVENTS_PRO_STORE */ "a"] + '/CANCEL_SYNC';

function serialize(payload) {
	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function serialize$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])([JSON, 'stringify'], payload);

				case 2:
					return _context.abrupt('return', _context.sent);

				case 3:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked, this);
}

function sync(_ref) {
	var selector = _ref.selector,
	    metaField = _ref.metaField,
	    setAttributes = _ref.setAttributes,
	    current = _ref.current;
	var state, payload;
	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function sync$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* select */ "g"])(selector);

				case 2:
					state = _context2.sent;
					_context2.next = 5;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(serialize, state);

				case 5:
					payload = _context2.sent;

					if (!(current === payload)) {
						_context2.next = 8;
						break;
					}

					return _context2.abrupt('return');

				case 8:
					_context2.next = 10;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* call */ "b"])(setAttributes, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()({}, metaField, payload));

				case 10:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked2, this);
}

function initialize(_ref2) {
	var listeners = _ref2.listeners,
	    selector = _ref2.selector,
	    clientId = _ref2.clientId,
	    metaField = _ref2.metaField,
	    setAttributes = _ref2.setAttributes,
	    current = _ref2.current;
	var syncSaga, action;
	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function initialize$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					_context3.next = 2;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* takeLatest */ "j"])(listeners, sync, { selector: selector, metaField: metaField, setAttributes: setAttributes, current: current });

				case 2:
					syncSaga = _context3.sent;

				case 3:
					if (false) {}

					_context3.next = 6;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* take */ "h"])(CANCEL_SYNC);

				case 6:
					action = _context3.sent;

					if (!(action.clientId === clientId)) {
						_context3.next = 11;
						break;
					}

					_context3.next = 10;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* cancel */ "c"])(syncSaga);

				case 10:
					return _context3.abrupt('break', 13);

				case 11:
					_context3.next = 3;
					break;

				case 13:
				case 'end':
					return _context3.stop();
			}
		}
	}, _marked3, this);
}

function watchers() {
	return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function watchers$(_context4) {
		while (1) {
			switch (_context4.prev = _context4.next) {
				case 0:
					_context4.next = 2;
					return Object(redux_saga_effects__WEBPACK_IMPORTED_MODULE_2__[/* takeEvery */ "i"])(INITIALIZE_SYNC, initialize);

				case 2:
				case 'end':
					return _context4.stop();
			}
		}
	}, _marked4, this);
}

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(59) && !__webpack_require__(79)(function () {
  return Object.defineProperty(__webpack_require__(157)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(63);
var toIObject = __webpack_require__(77);
var arrayIndexOf = __webpack_require__(234)(false);
var IE_PROTO = __webpack_require__(111)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(242)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(220)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(107);
var $export = __webpack_require__(62);
var redefine = __webpack_require__(221);
var hide = __webpack_require__(70);
var Iterators = __webpack_require__(81);
var $iterCreate = __webpack_require__(243);
var setToStringTag = __webpack_require__(146);
var getPrototypeOf = __webpack_require__(246);
var ITERATOR = __webpack_require__(44)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(70);


/***/ }),
/* 222 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(363), __esModule: true };

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

var baseFor = __webpack_require__(367),
    keys = __webpack_require__(40);

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;


/***/ }),
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(230), __esModule: true };

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(231);
module.exports = __webpack_require__(45).Object.assign;


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(62);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(233) });


/***/ }),
/* 232 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(106);
var gOPS = __webpack_require__(151);
var pIE = __webpack_require__(112);
var toObject = __webpack_require__(113);
var IObject = __webpack_require__(158);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(79)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(77);
var toLength = __webpack_require__(159);
var toAbsoluteIndex = __webpack_require__(235);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(110);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(237);

function emptyFunction() {}

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.6.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

Object.defineProperty(exports,"__esModule",{value:!0});
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,r=b?Symbol.for("react.memo"):
60115,t=b?Symbol.for("react.lazy"):60116;function u(a){if("object"===typeof a&&null!==a){var q=a.$$typeof;switch(q){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case h:return a;default:return q}}case d:return q}}}function v(a){return u(a)===m}exports.typeOf=u;exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;
exports.Profiler=g;exports.Portal=d;exports.StrictMode=f;exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n)};exports.isAsyncMode=function(a){return v(a)||u(a)===l};exports.isConcurrentMode=v;exports.isContextConsumer=function(a){return u(a)===k};exports.isContextProvider=function(a){return u(a)===h};
exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return u(a)===n};exports.isFragment=function(a){return u(a)===e};exports.isProfiler=function(a){return u(a)===g};exports.isPortal=function(a){return u(a)===d};exports.isStrictMode=function(a){return u(a)===f};


/***/ }),
/* 239 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(241), __esModule: true };

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(219);
__webpack_require__(247);
module.exports = __webpack_require__(45).Array.from;


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(110);
var defined = __webpack_require__(109);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(152);
var descriptor = __webpack_require__(80);
var setToStringTag = __webpack_require__(146);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(70)(IteratorPrototype, __webpack_require__(44)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(54);
var anObject = __webpack_require__(71);
var getKeys = __webpack_require__(106);

module.exports = __webpack_require__(59) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(53).document;
module.exports = document && document.documentElement;


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(63);
var toObject = __webpack_require__(113);
var IE_PROTO = __webpack_require__(111)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(142);
var $export = __webpack_require__(62);
var toObject = __webpack_require__(113);
var call = __webpack_require__(248);
var isArrayIter = __webpack_require__(249);
var toLength = __webpack_require__(159);
var createProperty = __webpack_require__(250);
var getIterFn = __webpack_require__(251);

$export($export.S + $export.F * !__webpack_require__(253)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(71);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(81);
var ITERATOR = __webpack_require__(44)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(54);
var createDesc = __webpack_require__(80);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(252);
var ITERATOR = __webpack_require__(44)('iterator');
var Iterators = __webpack_require__(81);
module.exports = __webpack_require__(45).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(143);
var TAG = __webpack_require__(44)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(44)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

var baseConvert = __webpack_require__(255),
    util = __webpack_require__(257);

/**
 * Converts `func` of `name` to an immutable auto-curried iteratee-first data-last
 * version with conversion `options` applied. If `name` is an object its methods
 * will be converted.
 *
 * @param {string} name The name of the function to wrap.
 * @param {Function} [func] The function to wrap.
 * @param {Object} [options] The options object. See `baseConvert` for more details.
 * @returns {Function|Object} Returns the converted function or object.
 */
function convert(name, func, options) {
  return baseConvert(util, name, func, options);
}

module.exports = convert;


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

var mapping = __webpack_require__(256),
    fallbackHolder = __webpack_require__(161);

/** Built-in value reference. */
var push = Array.prototype.push;

/**
 * Creates a function, with an arity of `n`, that invokes `func` with the
 * arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} n The arity of the new function.
 * @returns {Function} Returns the new function.
 */
function baseArity(func, n) {
  return n == 2
    ? function(a, b) { return func.apply(undefined, arguments); }
    : function(a) { return func.apply(undefined, arguments); };
}

/**
 * Creates a function that invokes `func`, with up to `n` arguments, ignoring
 * any additional arguments.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @param {number} n The arity cap.
 * @returns {Function} Returns the new function.
 */
function baseAry(func, n) {
  return n == 2
    ? function(a, b) { return func(a, b); }
    : function(a) { return func(a); };
}

/**
 * Creates a clone of `array`.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the cloned array.
 */
function cloneArray(array) {
  var length = array ? array.length : 0,
      result = Array(length);

  while (length--) {
    result[length] = array[length];
  }
  return result;
}

/**
 * Creates a function that clones a given object using the assignment `func`.
 *
 * @private
 * @param {Function} func The assignment function.
 * @returns {Function} Returns the new cloner function.
 */
function createCloner(func) {
  return function(object) {
    return func({}, object);
  };
}

/**
 * A specialized version of `_.spread` which flattens the spread array into
 * the arguments of the invoked `func`.
 *
 * @private
 * @param {Function} func The function to spread arguments over.
 * @param {number} start The start position of the spread.
 * @returns {Function} Returns the new function.
 */
function flatSpread(func, start) {
  return function() {
    var length = arguments.length,
        lastIndex = length - 1,
        args = Array(length);

    while (length--) {
      args[length] = arguments[length];
    }
    var array = args[start],
        otherArgs = args.slice(0, start);

    if (array) {
      push.apply(otherArgs, array);
    }
    if (start != lastIndex) {
      push.apply(otherArgs, args.slice(start + 1));
    }
    return func.apply(this, otherArgs);
  };
}

/**
 * Creates a function that wraps `func` and uses `cloner` to clone the first
 * argument it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} cloner The function to clone arguments.
 * @returns {Function} Returns the new immutable function.
 */
function wrapImmutable(func, cloner) {
  return function() {
    var length = arguments.length;
    if (!length) {
      return;
    }
    var args = Array(length);
    while (length--) {
      args[length] = arguments[length];
    }
    var result = args[0] = cloner.apply(undefined, args);
    func.apply(undefined, args);
    return result;
  };
}

/**
 * The base implementation of `convert` which accepts a `util` object of methods
 * required to perform conversions.
 *
 * @param {Object} util The util object.
 * @param {string} name The name of the function to convert.
 * @param {Function} func The function to convert.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.cap=true] Specify capping iteratee arguments.
 * @param {boolean} [options.curry=true] Specify currying.
 * @param {boolean} [options.fixed=true] Specify fixed arity.
 * @param {boolean} [options.immutable=true] Specify immutable operations.
 * @param {boolean} [options.rearg=true] Specify rearranging arguments.
 * @returns {Function|Object} Returns the converted function or object.
 */
function baseConvert(util, name, func, options) {
  var isLib = typeof name == 'function',
      isObj = name === Object(name);

  if (isObj) {
    options = func;
    func = name;
    name = undefined;
  }
  if (func == null) {
    throw new TypeError;
  }
  options || (options = {});

  var config = {
    'cap': 'cap' in options ? options.cap : true,
    'curry': 'curry' in options ? options.curry : true,
    'fixed': 'fixed' in options ? options.fixed : true,
    'immutable': 'immutable' in options ? options.immutable : true,
    'rearg': 'rearg' in options ? options.rearg : true
  };

  var defaultHolder = isLib ? func : fallbackHolder,
      forceCurry = ('curry' in options) && options.curry,
      forceFixed = ('fixed' in options) && options.fixed,
      forceRearg = ('rearg' in options) && options.rearg,
      pristine = isLib ? func.runInContext() : undefined;

  var helpers = isLib ? func : {
    'ary': util.ary,
    'assign': util.assign,
    'clone': util.clone,
    'curry': util.curry,
    'forEach': util.forEach,
    'isArray': util.isArray,
    'isError': util.isError,
    'isFunction': util.isFunction,
    'isWeakMap': util.isWeakMap,
    'iteratee': util.iteratee,
    'keys': util.keys,
    'rearg': util.rearg,
    'toInteger': util.toInteger,
    'toPath': util.toPath
  };

  var ary = helpers.ary,
      assign = helpers.assign,
      clone = helpers.clone,
      curry = helpers.curry,
      each = helpers.forEach,
      isArray = helpers.isArray,
      isError = helpers.isError,
      isFunction = helpers.isFunction,
      isWeakMap = helpers.isWeakMap,
      keys = helpers.keys,
      rearg = helpers.rearg,
      toInteger = helpers.toInteger,
      toPath = helpers.toPath;

  var aryMethodKeys = keys(mapping.aryMethod);

  var wrappers = {
    'castArray': function(castArray) {
      return function() {
        var value = arguments[0];
        return isArray(value)
          ? castArray(cloneArray(value))
          : castArray.apply(undefined, arguments);
      };
    },
    'iteratee': function(iteratee) {
      return function() {
        var func = arguments[0],
            arity = arguments[1],
            result = iteratee(func, arity),
            length = result.length;

        if (config.cap && typeof arity == 'number') {
          arity = arity > 2 ? (arity - 2) : 1;
          return (length && length <= arity) ? result : baseAry(result, arity);
        }
        return result;
      };
    },
    'mixin': function(mixin) {
      return function(source) {
        var func = this;
        if (!isFunction(func)) {
          return mixin(func, Object(source));
        }
        var pairs = [];
        each(keys(source), function(key) {
          if (isFunction(source[key])) {
            pairs.push([key, func.prototype[key]]);
          }
        });

        mixin(func, Object(source));

        each(pairs, function(pair) {
          var value = pair[1];
          if (isFunction(value)) {
            func.prototype[pair[0]] = value;
          } else {
            delete func.prototype[pair[0]];
          }
        });
        return func;
      };
    },
    'nthArg': function(nthArg) {
      return function(n) {
        var arity = n < 0 ? 1 : (toInteger(n) + 1);
        return curry(nthArg(n), arity);
      };
    },
    'rearg': function(rearg) {
      return function(func, indexes) {
        var arity = indexes ? indexes.length : 0;
        return curry(rearg(func, indexes), arity);
      };
    },
    'runInContext': function(runInContext) {
      return function(context) {
        return baseConvert(util, runInContext(context), options);
      };
    }
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Casts `func` to a function with an arity capped iteratee if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @returns {Function} Returns the cast function.
   */
  function castCap(name, func) {
    if (config.cap) {
      var indexes = mapping.iterateeRearg[name];
      if (indexes) {
        return iterateeRearg(func, indexes);
      }
      var n = !isLib && mapping.iterateeAry[name];
      if (n) {
        return iterateeAry(func, n);
      }
    }
    return func;
  }

  /**
   * Casts `func` to a curried function if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @param {number} n The arity of `func`.
   * @returns {Function} Returns the cast function.
   */
  function castCurry(name, func, n) {
    return (forceCurry || (config.curry && n > 1))
      ? curry(func, n)
      : func;
  }

  /**
   * Casts `func` to a fixed arity function if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @param {number} n The arity cap.
   * @returns {Function} Returns the cast function.
   */
  function castFixed(name, func, n) {
    if (config.fixed && (forceFixed || !mapping.skipFixed[name])) {
      var data = mapping.methodSpread[name],
          start = data && data.start;

      return start  === undefined ? ary(func, n) : flatSpread(func, start);
    }
    return func;
  }

  /**
   * Casts `func` to an rearged function if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @param {number} n The arity of `func`.
   * @returns {Function} Returns the cast function.
   */
  function castRearg(name, func, n) {
    return (config.rearg && n > 1 && (forceRearg || !mapping.skipRearg[name]))
      ? rearg(func, mapping.methodRearg[name] || mapping.aryRearg[n])
      : func;
  }

  /**
   * Creates a clone of `object` by `path`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {Array|string} path The path to clone by.
   * @returns {Object} Returns the cloned object.
   */
  function cloneByPath(object, path) {
    path = toPath(path);

    var index = -1,
        length = path.length,
        lastIndex = length - 1,
        result = clone(Object(object)),
        nested = result;

    while (nested != null && ++index < length) {
      var key = path[index],
          value = nested[key];

      if (value != null &&
          !(isFunction(value) || isError(value) || isWeakMap(value))) {
        nested[key] = clone(index == lastIndex ? value : Object(value));
      }
      nested = nested[key];
    }
    return result;
  }

  /**
   * Converts `lodash` to an immutable auto-curried iteratee-first data-last
   * version with conversion `options` applied.
   *
   * @param {Object} [options] The options object. See `baseConvert` for more details.
   * @returns {Function} Returns the converted `lodash`.
   */
  function convertLib(options) {
    return _.runInContext.convert(options)(undefined);
  }

  /**
   * Create a converter function for `func` of `name`.
   *
   * @param {string} name The name of the function to convert.
   * @param {Function} func The function to convert.
   * @returns {Function} Returns the new converter function.
   */
  function createConverter(name, func) {
    var realName = mapping.aliasToReal[name] || name,
        methodName = mapping.remap[realName] || realName,
        oldOptions = options;

    return function(options) {
      var newUtil = isLib ? pristine : helpers,
          newFunc = isLib ? pristine[methodName] : func,
          newOptions = assign(assign({}, oldOptions), options);

      return baseConvert(newUtil, realName, newFunc, newOptions);
    };
  }

  /**
   * Creates a function that wraps `func` to invoke its iteratee, with up to `n`
   * arguments, ignoring any additional arguments.
   *
   * @private
   * @param {Function} func The function to cap iteratee arguments for.
   * @param {number} n The arity cap.
   * @returns {Function} Returns the new function.
   */
  function iterateeAry(func, n) {
    return overArg(func, function(func) {
      return typeof func == 'function' ? baseAry(func, n) : func;
    });
  }

  /**
   * Creates a function that wraps `func` to invoke its iteratee with arguments
   * arranged according to the specified `indexes` where the argument value at
   * the first index is provided as the first argument, the argument value at
   * the second index is provided as the second argument, and so on.
   *
   * @private
   * @param {Function} func The function to rearrange iteratee arguments for.
   * @param {number[]} indexes The arranged argument indexes.
   * @returns {Function} Returns the new function.
   */
  function iterateeRearg(func, indexes) {
    return overArg(func, function(func) {
      var n = indexes.length;
      return baseArity(rearg(baseAry(func, n), indexes), n);
    });
  }

  /**
   * Creates a function that invokes `func` with its first argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function() {
      var length = arguments.length;
      if (!length) {
        return func();
      }
      var args = Array(length);
      while (length--) {
        args[length] = arguments[length];
      }
      var index = config.rearg ? 0 : (length - 1);
      args[index] = transform(args[index]);
      return func.apply(undefined, args);
    };
  }

  /**
   * Creates a function that wraps `func` and applys the conversions
   * rules by `name`.
   *
   * @private
   * @param {string} name The name of the function to wrap.
   * @param {Function} func The function to wrap.
   * @returns {Function} Returns the converted function.
   */
  function wrap(name, func, placeholder) {
    var result,
        realName = mapping.aliasToReal[name] || name,
        wrapped = func,
        wrapper = wrappers[realName];

    if (wrapper) {
      wrapped = wrapper(func);
    }
    else if (config.immutable) {
      if (mapping.mutate.array[realName]) {
        wrapped = wrapImmutable(func, cloneArray);
      }
      else if (mapping.mutate.object[realName]) {
        wrapped = wrapImmutable(func, createCloner(func));
      }
      else if (mapping.mutate.set[realName]) {
        wrapped = wrapImmutable(func, cloneByPath);
      }
    }
    each(aryMethodKeys, function(aryKey) {
      each(mapping.aryMethod[aryKey], function(otherName) {
        if (realName == otherName) {
          var data = mapping.methodSpread[realName],
              afterRearg = data && data.afterRearg;

          result = afterRearg
            ? castFixed(realName, castRearg(realName, wrapped, aryKey), aryKey)
            : castRearg(realName, castFixed(realName, wrapped, aryKey), aryKey);

          result = castCap(realName, result);
          result = castCurry(realName, result, aryKey);
          return false;
        }
      });
      return !result;
    });

    result || (result = wrapped);
    if (result == func) {
      result = forceCurry ? curry(result, 1) : function() {
        return func.apply(this, arguments);
      };
    }
    result.convert = createConverter(realName, func);
    result.placeholder = func.placeholder = placeholder;

    return result;
  }

  /*--------------------------------------------------------------------------*/

  if (!isObj) {
    return wrap(name, func, defaultHolder);
  }
  var _ = func;

  // Convert methods by ary cap.
  var pairs = [];
  each(aryMethodKeys, function(aryKey) {
    each(mapping.aryMethod[aryKey], function(key) {
      var func = _[mapping.remap[key] || key];
      if (func) {
        pairs.push([key, wrap(key, func, _)]);
      }
    });
  });

  // Convert remaining methods.
  each(keys(_), function(key) {
    var func = _[key];
    if (typeof func == 'function') {
      var length = pairs.length;
      while (length--) {
        if (pairs[length][0] == key) {
          return;
        }
      }
      func.convert = createConverter(key, func);
      pairs.push([key, func]);
    }
  });

  // Assign to `_` leaving `_.prototype` unchanged to allow chaining.
  each(pairs, function(pair) {
    _[pair[0]] = pair[1];
  });

  _.convert = convertLib;
  _.placeholder = _;

  // Assign aliases.
  each(keys(_), function(key) {
    each(mapping.realToAlias[key] || [], function(alias) {
      _[alias] = _[key];
    });
  });

  return _;
}

module.exports = baseConvert;


/***/ }),
/* 256 */
/***/ (function(module, exports) {

/** Used to map aliases to their real names. */
exports.aliasToReal = {

  // Lodash aliases.
  'each': 'forEach',
  'eachRight': 'forEachRight',
  'entries': 'toPairs',
  'entriesIn': 'toPairsIn',
  'extend': 'assignIn',
  'extendAll': 'assignInAll',
  'extendAllWith': 'assignInAllWith',
  'extendWith': 'assignInWith',
  'first': 'head',

  // Methods that are curried variants of others.
  'conforms': 'conformsTo',
  'matches': 'isMatch',
  'property': 'get',

  // Ramda aliases.
  '__': 'placeholder',
  'F': 'stubFalse',
  'T': 'stubTrue',
  'all': 'every',
  'allPass': 'overEvery',
  'always': 'constant',
  'any': 'some',
  'anyPass': 'overSome',
  'apply': 'spread',
  'assoc': 'set',
  'assocPath': 'set',
  'complement': 'negate',
  'compose': 'flowRight',
  'contains': 'includes',
  'dissoc': 'unset',
  'dissocPath': 'unset',
  'dropLast': 'dropRight',
  'dropLastWhile': 'dropRightWhile',
  'equals': 'isEqual',
  'identical': 'eq',
  'indexBy': 'keyBy',
  'init': 'initial',
  'invertObj': 'invert',
  'juxt': 'over',
  'omitAll': 'omit',
  'nAry': 'ary',
  'path': 'get',
  'pathEq': 'matchesProperty',
  'pathOr': 'getOr',
  'paths': 'at',
  'pickAll': 'pick',
  'pipe': 'flow',
  'pluck': 'map',
  'prop': 'get',
  'propEq': 'matchesProperty',
  'propOr': 'getOr',
  'props': 'at',
  'symmetricDifference': 'xor',
  'symmetricDifferenceBy': 'xorBy',
  'symmetricDifferenceWith': 'xorWith',
  'takeLast': 'takeRight',
  'takeLastWhile': 'takeRightWhile',
  'unapply': 'rest',
  'unnest': 'flatten',
  'useWith': 'overArgs',
  'where': 'conformsTo',
  'whereEq': 'isMatch',
  'zipObj': 'zipObject'
};

/** Used to map ary to method names. */
exports.aryMethod = {
  '1': [
    'assignAll', 'assignInAll', 'attempt', 'castArray', 'ceil', 'create',
    'curry', 'curryRight', 'defaultsAll', 'defaultsDeepAll', 'floor', 'flow',
    'flowRight', 'fromPairs', 'invert', 'iteratee', 'memoize', 'method', 'mergeAll',
    'methodOf', 'mixin', 'nthArg', 'over', 'overEvery', 'overSome','rest', 'reverse',
    'round', 'runInContext', 'spread', 'template', 'trim', 'trimEnd', 'trimStart',
    'uniqueId', 'words', 'zipAll'
  ],
  '2': [
    'add', 'after', 'ary', 'assign', 'assignAllWith', 'assignIn', 'assignInAllWith',
    'at', 'before', 'bind', 'bindAll', 'bindKey', 'chunk', 'cloneDeepWith',
    'cloneWith', 'concat', 'conformsTo', 'countBy', 'curryN', 'curryRightN',
    'debounce', 'defaults', 'defaultsDeep', 'defaultTo', 'delay', 'difference',
    'divide', 'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'endsWith', 'eq',
    'every', 'filter', 'find', 'findIndex', 'findKey', 'findLast', 'findLastIndex',
    'findLastKey', 'flatMap', 'flatMapDeep', 'flattenDepth', 'forEach',
    'forEachRight', 'forIn', 'forInRight', 'forOwn', 'forOwnRight', 'get',
    'groupBy', 'gt', 'gte', 'has', 'hasIn', 'includes', 'indexOf', 'intersection',
    'invertBy', 'invoke', 'invokeMap', 'isEqual', 'isMatch', 'join', 'keyBy',
    'lastIndexOf', 'lt', 'lte', 'map', 'mapKeys', 'mapValues', 'matchesProperty',
    'maxBy', 'meanBy', 'merge', 'mergeAllWith', 'minBy', 'multiply', 'nth', 'omit',
    'omitBy', 'overArgs', 'pad', 'padEnd', 'padStart', 'parseInt', 'partial',
    'partialRight', 'partition', 'pick', 'pickBy', 'propertyOf', 'pull', 'pullAll',
    'pullAt', 'random', 'range', 'rangeRight', 'rearg', 'reject', 'remove',
    'repeat', 'restFrom', 'result', 'sampleSize', 'some', 'sortBy', 'sortedIndex',
    'sortedIndexOf', 'sortedLastIndex', 'sortedLastIndexOf', 'sortedUniqBy',
    'split', 'spreadFrom', 'startsWith', 'subtract', 'sumBy', 'take', 'takeRight',
    'takeRightWhile', 'takeWhile', 'tap', 'throttle', 'thru', 'times', 'trimChars',
    'trimCharsEnd', 'trimCharsStart', 'truncate', 'union', 'uniqBy', 'uniqWith',
    'unset', 'unzipWith', 'without', 'wrap', 'xor', 'zip', 'zipObject',
    'zipObjectDeep'
  ],
  '3': [
    'assignInWith', 'assignWith', 'clamp', 'differenceBy', 'differenceWith',
    'findFrom', 'findIndexFrom', 'findLastFrom', 'findLastIndexFrom', 'getOr',
    'includesFrom', 'indexOfFrom', 'inRange', 'intersectionBy', 'intersectionWith',
    'invokeArgs', 'invokeArgsMap', 'isEqualWith', 'isMatchWith', 'flatMapDepth',
    'lastIndexOfFrom', 'mergeWith', 'orderBy', 'padChars', 'padCharsEnd',
    'padCharsStart', 'pullAllBy', 'pullAllWith', 'rangeStep', 'rangeStepRight',
    'reduce', 'reduceRight', 'replace', 'set', 'slice', 'sortedIndexBy',
    'sortedLastIndexBy', 'transform', 'unionBy', 'unionWith', 'update', 'xorBy',
    'xorWith', 'zipWith'
  ],
  '4': [
    'fill', 'setWith', 'updateWith'
  ]
};

/** Used to map ary to rearg configs. */
exports.aryRearg = {
  '2': [1, 0],
  '3': [2, 0, 1],
  '4': [3, 2, 0, 1]
};

/** Used to map method names to their iteratee ary. */
exports.iterateeAry = {
  'dropRightWhile': 1,
  'dropWhile': 1,
  'every': 1,
  'filter': 1,
  'find': 1,
  'findFrom': 1,
  'findIndex': 1,
  'findIndexFrom': 1,
  'findKey': 1,
  'findLast': 1,
  'findLastFrom': 1,
  'findLastIndex': 1,
  'findLastIndexFrom': 1,
  'findLastKey': 1,
  'flatMap': 1,
  'flatMapDeep': 1,
  'flatMapDepth': 1,
  'forEach': 1,
  'forEachRight': 1,
  'forIn': 1,
  'forInRight': 1,
  'forOwn': 1,
  'forOwnRight': 1,
  'map': 1,
  'mapKeys': 1,
  'mapValues': 1,
  'partition': 1,
  'reduce': 2,
  'reduceRight': 2,
  'reject': 1,
  'remove': 1,
  'some': 1,
  'takeRightWhile': 1,
  'takeWhile': 1,
  'times': 1,
  'transform': 2
};

/** Used to map method names to iteratee rearg configs. */
exports.iterateeRearg = {
  'mapKeys': [1],
  'reduceRight': [1, 0]
};

/** Used to map method names to rearg configs. */
exports.methodRearg = {
  'assignInAllWith': [1, 0],
  'assignInWith': [1, 2, 0],
  'assignAllWith': [1, 0],
  'assignWith': [1, 2, 0],
  'differenceBy': [1, 2, 0],
  'differenceWith': [1, 2, 0],
  'getOr': [2, 1, 0],
  'intersectionBy': [1, 2, 0],
  'intersectionWith': [1, 2, 0],
  'isEqualWith': [1, 2, 0],
  'isMatchWith': [2, 1, 0],
  'mergeAllWith': [1, 0],
  'mergeWith': [1, 2, 0],
  'padChars': [2, 1, 0],
  'padCharsEnd': [2, 1, 0],
  'padCharsStart': [2, 1, 0],
  'pullAllBy': [2, 1, 0],
  'pullAllWith': [2, 1, 0],
  'rangeStep': [1, 2, 0],
  'rangeStepRight': [1, 2, 0],
  'setWith': [3, 1, 2, 0],
  'sortedIndexBy': [2, 1, 0],
  'sortedLastIndexBy': [2, 1, 0],
  'unionBy': [1, 2, 0],
  'unionWith': [1, 2, 0],
  'updateWith': [3, 1, 2, 0],
  'xorBy': [1, 2, 0],
  'xorWith': [1, 2, 0],
  'zipWith': [1, 2, 0]
};

/** Used to map method names to spread configs. */
exports.methodSpread = {
  'assignAll': { 'start': 0 },
  'assignAllWith': { 'start': 0 },
  'assignInAll': { 'start': 0 },
  'assignInAllWith': { 'start': 0 },
  'defaultsAll': { 'start': 0 },
  'defaultsDeepAll': { 'start': 0 },
  'invokeArgs': { 'start': 2 },
  'invokeArgsMap': { 'start': 2 },
  'mergeAll': { 'start': 0 },
  'mergeAllWith': { 'start': 0 },
  'partial': { 'start': 1 },
  'partialRight': { 'start': 1 },
  'without': { 'start': 1 },
  'zipAll': { 'start': 0 }
};

/** Used to identify methods which mutate arrays or objects. */
exports.mutate = {
  'array': {
    'fill': true,
    'pull': true,
    'pullAll': true,
    'pullAllBy': true,
    'pullAllWith': true,
    'pullAt': true,
    'remove': true,
    'reverse': true
  },
  'object': {
    'assign': true,
    'assignAll': true,
    'assignAllWith': true,
    'assignIn': true,
    'assignInAll': true,
    'assignInAllWith': true,
    'assignInWith': true,
    'assignWith': true,
    'defaults': true,
    'defaultsAll': true,
    'defaultsDeep': true,
    'defaultsDeepAll': true,
    'merge': true,
    'mergeAll': true,
    'mergeAllWith': true,
    'mergeWith': true,
  },
  'set': {
    'set': true,
    'setWith': true,
    'unset': true,
    'update': true,
    'updateWith': true
  }
};

/** Used to map real names to their aliases. */
exports.realToAlias = (function() {
  var hasOwnProperty = Object.prototype.hasOwnProperty,
      object = exports.aliasToReal,
      result = {};

  for (var key in object) {
    var value = object[key];
    if (hasOwnProperty.call(result, value)) {
      result[value].push(key);
    } else {
      result[value] = [key];
    }
  }
  return result;
}());

/** Used to map method names to other names. */
exports.remap = {
  'assignAll': 'assign',
  'assignAllWith': 'assignWith',
  'assignInAll': 'assignIn',
  'assignInAllWith': 'assignInWith',
  'curryN': 'curry',
  'curryRightN': 'curryRight',
  'defaultsAll': 'defaults',
  'defaultsDeepAll': 'defaultsDeep',
  'findFrom': 'find',
  'findIndexFrom': 'findIndex',
  'findLastFrom': 'findLast',
  'findLastIndexFrom': 'findLastIndex',
  'getOr': 'get',
  'includesFrom': 'includes',
  'indexOfFrom': 'indexOf',
  'invokeArgs': 'invoke',
  'invokeArgsMap': 'invokeMap',
  'lastIndexOfFrom': 'lastIndexOf',
  'mergeAll': 'merge',
  'mergeAllWith': 'mergeWith',
  'padChars': 'pad',
  'padCharsEnd': 'padEnd',
  'padCharsStart': 'padStart',
  'propertyOf': 'get',
  'rangeStep': 'range',
  'rangeStepRight': 'rangeRight',
  'restFrom': 'rest',
  'spreadFrom': 'spread',
  'trimChars': 'trim',
  'trimCharsEnd': 'trimEnd',
  'trimCharsStart': 'trimStart',
  'zipAll': 'zip'
};

/** Used to track methods that skip fixing their arity. */
exports.skipFixed = {
  'castArray': true,
  'flow': true,
  'flowRight': true,
  'iteratee': true,
  'mixin': true,
  'rearg': true,
  'runInContext': true
};

/** Used to track methods that skip rearranging arguments. */
exports.skipRearg = {
  'add': true,
  'assign': true,
  'assignIn': true,
  'bind': true,
  'bindKey': true,
  'concat': true,
  'difference': true,
  'divide': true,
  'eq': true,
  'gt': true,
  'gte': true,
  'isEqual': true,
  'lt': true,
  'lte': true,
  'matchesProperty': true,
  'merge': true,
  'multiply': true,
  'overArgs': true,
  'partial': true,
  'partialRight': true,
  'propertyOf': true,
  'random': true,
  'range': true,
  'rangeRight': true,
  'subtract': true,
  'zip': true,
  'zipObject': true,
  'zipObjectDeep': true
};


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'ary': __webpack_require__(258),
  'assign': __webpack_require__(183),
  'clone': __webpack_require__(289),
  'curry': __webpack_require__(196),
  'forEach': __webpack_require__(119),
  'isArray': __webpack_require__(30),
  'isError': __webpack_require__(332),
  'isFunction': __webpack_require__(115),
  'isWeakMap': __webpack_require__(333),
  'iteratee': __webpack_require__(334),
  'keys': __webpack_require__(125),
  'rearg': __webpack_require__(355),
  'toInteger': __webpack_require__(86),
  'toPath': __webpack_require__(360)
};


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

var createWrap = __webpack_require__(114);

/** Used to compose bitmasks for function metadata. */
var WRAP_ARY_FLAG = 128;

/**
 * Creates a function that invokes `func`, with up to `n` arguments,
 * ignoring any additional arguments.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to cap arguments for.
 * @param {number} [n=func.length] The arity cap.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new capped function.
 * @example
 *
 * _.map(['6', '8', '10'], _.ary(parseInt, 1));
 * // => [6, 8, 10]
 */
function ary(func, n, guard) {
  n = guard ? undefined : n;
  n = (func && n == null) ? func.length : n;
  return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
}

module.exports = ary;


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(115),
    isMasked = __webpack_require__(262),
    isObject = __webpack_require__(46),
    toSource = __webpack_require__(166);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(64);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 261 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(263);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(32);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 264 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

var createCtor = __webpack_require__(83),
    root = __webpack_require__(32);

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG,
      Ctor = createCtor(func);

  function wrapper() {
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

module.exports = createBind;


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(116),
    createCtor = __webpack_require__(83),
    createHybrid = __webpack_require__(167),
    createRecurry = __webpack_require__(170),
    getHolder = __webpack_require__(182),
    replaceHolders = __webpack_require__(120),
    root = __webpack_require__(32);

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurry(func, bitmask, arity) {
  var Ctor = createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length,
        placeholder = getHolder(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return apply(fn, this, args);
  }
  return wrapper;
}

module.exports = createCurry;


/***/ }),
/* 267 */
/***/ (function(module, exports) {

/**
 * Gets the number of `placeholder` occurrences in `array`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} placeholder The placeholder to search for.
 * @returns {number} Returns the placeholder count.
 */
function countHolders(array, placeholder) {
  var length = array.length,
      result = 0;

  while (length--) {
    if (array[length] === placeholder) {
      ++result;
    }
  }
  return result;
}

module.exports = countHolders;


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

var LazyWrapper = __webpack_require__(117),
    getData = __webpack_require__(171),
    getFuncName = __webpack_require__(269),
    lodash = __webpack_require__(271);

/**
 * Checks if `func` has a lazy counterpart.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
 *  else `false`.
 */
function isLaziable(func) {
  var funcName = getFuncName(func),
      other = lodash[funcName];

  if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData(other);
  return !!data && func === data[0];
}

module.exports = isLaziable;


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

var realNames = __webpack_require__(270);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the name of `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {string} Returns the function name.
 */
function getFuncName(func) {
  var result = (func.name + ''),
      array = realNames[result],
      length = hasOwnProperty.call(realNames, result) ? array.length : 0;

  while (length--) {
    var data = array[length],
        otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}

module.exports = getFuncName;


/***/ }),
/* 270 */
/***/ (function(module, exports) {

/** Used to lookup unminified function names. */
var realNames = {};

module.exports = realNames;


/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

var LazyWrapper = __webpack_require__(117),
    LodashWrapper = __webpack_require__(172),
    baseLodash = __webpack_require__(118),
    isArray = __webpack_require__(30),
    isObjectLike = __webpack_require__(38),
    wrapperClone = __webpack_require__(272);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps `value` to enable implicit method
 * chain sequences. Methods that operate on and return arrays, collections,
 * and functions can be chained together. Methods that retrieve a single value
 * or may return a primitive value will automatically end the chain sequence
 * and return the unwrapped value. Otherwise, the value must be unwrapped
 * with `_#value`.
 *
 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
 * enabled using `_.chain`.
 *
 * The execution of chained methods is lazy, that is, it's deferred until
 * `_#value` is implicitly or explicitly called.
 *
 * Lazy evaluation allows several methods to support shortcut fusion.
 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
 * the creation of intermediate arrays and can greatly reduce the number of
 * iteratee executions. Sections of a chain sequence qualify for shortcut
 * fusion if the section is applied to an array and iteratees accept only
 * one argument. The heuristic for whether a section qualifies for shortcut
 * fusion is subject to change.
 *
 * Chaining is supported in custom builds as long as the `_#value` method is
 * directly or indirectly included in the build.
 *
 * In addition to lodash methods, wrappers have `Array` and `String` methods.
 *
 * The wrapper `Array` methods are:
 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
 *
 * The wrapper `String` methods are:
 * `replace` and `split`
 *
 * The wrapper methods that support shortcut fusion are:
 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
 *
 * The chainable wrapper methods are:
 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
 * `zipObject`, `zipObjectDeep`, and `zipWith`
 *
 * The wrapper methods that are **not** chainable by default are:
 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
 * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
 * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
 * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
 * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
 * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
 * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
 * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
 * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
 * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
 * `upperFirst`, `value`, and `words`
 *
 * @name _
 * @constructor
 * @category Seq
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // Returns an unwrapped value.
 * wrapped.reduce(_.add);
 * // => 6
 *
 * // Returns a wrapped value.
 * var squares = wrapped.map(square);
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;

module.exports = lodash;


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

var LazyWrapper = __webpack_require__(117),
    LodashWrapper = __webpack_require__(172),
    copyArray = __webpack_require__(85);

/**
 * Creates a clone of `wrapper`.
 *
 * @private
 * @param {Object} wrapper The wrapper to clone.
 * @returns {Object} Returns the cloned wrapper.
 */
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }
  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__  = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}

module.exports = wrapperClone;


/***/ }),
/* 273 */
/***/ (function(module, exports) {

/** Used to match wrap detail comments. */
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails = /,? & /;

/**
 * Extracts wrapper details from the `source` body comment.
 *
 * @private
 * @param {string} source The source to inspect.
 * @returns {Array} Returns the wrapper details.
 */
function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}

module.exports = getWrapDetails;


/***/ }),
/* 274 */
/***/ (function(module, exports) {

/** Used to match wrap detail comments. */
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;

/**
 * Inserts wrapper `details` in a comment at the top of the `source` body.
 *
 * @private
 * @param {string} source The source to modify.
 * @returns {Array} details The details to insert.
 * @returns {string} Returns the modified source.
 */
function insertWrapDetails(source, details) {
  var length = details.length;
  if (!length) {
    return source;
  }
  var lastIndex = length - 1;
  details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
  details = details.join(length > 2 ? ', ' : ' ');
  return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
}

module.exports = insertWrapDetails;


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(177),
    defineProperty = __webpack_require__(178),
    identity = __webpack_require__(48);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

var arrayEach = __webpack_require__(119),
    arrayIncludes = __webpack_require__(179);

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64,
    WRAP_ARY_FLAG = 128,
    WRAP_REARG_FLAG = 256,
    WRAP_FLIP_FLAG = 512;

/** Used to associate wrap methods with their bit flags. */
var wrapFlags = [
  ['ary', WRAP_ARY_FLAG],
  ['bind', WRAP_BIND_FLAG],
  ['bindKey', WRAP_BIND_KEY_FLAG],
  ['curry', WRAP_CURRY_FLAG],
  ['curryRight', WRAP_CURRY_RIGHT_FLAG],
  ['flip', WRAP_FLIP_FLAG],
  ['partial', WRAP_PARTIAL_FLAG],
  ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
  ['rearg', WRAP_REARG_FLAG]
];

/**
 * Updates wrapper `details` based on `bitmask` flags.
 *
 * @private
 * @returns {Array} details The details to modify.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Array} Returns `details`.
 */
function updateWrapDetails(details, bitmask) {
  arrayEach(wrapFlags, function(pair) {
    var value = '_.' + pair[0];
    if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}

module.exports = updateWrapDetails;


/***/ }),
/* 277 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;


/***/ }),
/* 278 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

var copyArray = __webpack_require__(85),
    isIndex = __webpack_require__(101);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = copyArray(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

module.exports = reorder;


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(116),
    createCtor = __webpack_require__(83),
    root = __webpack_require__(32);

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the `this` binding
 * of `thisArg` and `partials` prepended to the arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to
 *  the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartial(func, bitmask, thisArg, partials) {
  var isBind = bitmask & WRAP_BIND_FLAG,
      Ctor = createCtor(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

module.exports = createPartial;


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

var composeArgs = __webpack_require__(168),
    composeArgsRight = __webpack_require__(169),
    replaceHolders = __webpack_require__(120);

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_BOUND_FLAG = 4,
    WRAP_CURRY_FLAG = 8,
    WRAP_ARY_FLAG = 128,
    WRAP_REARG_FLAG = 256;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Merges the function metadata of `source` into `data`.
 *
 * Merging metadata reduces the number of wrappers used to invoke a function.
 * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
 * may be applied regardless of execution order. Methods like `_.ary` and
 * `_.rearg` modify function arguments, making the order in which they are
 * executed important, preventing the merging of metadata. However, we make
 * an exception for a safe combined case where curried functions have `_.ary`
 * and or `_.rearg` applied.
 *
 * @private
 * @param {Array} data The destination metadata.
 * @param {Array} source The source metadata.
 * @returns {Array} Returns `data`.
 */
function mergeData(data, source) {
  var bitmask = data[1],
      srcBitmask = source[1],
      newBitmask = bitmask | srcBitmask,
      isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

  var isCombo =
    ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
    ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
    ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

  // Exit early if metadata can't be merged.
  if (!(isCommon || isCombo)) {
    return data;
  }
  // Use source `thisArg` if available.
  if (srcBitmask & WRAP_BIND_FLAG) {
    data[2] = source[2];
    // Set when currying a bound function.
    newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
  }
  // Compose partial arguments.
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
  }
  // Compose partial right arguments.
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
  }
  // Use source `argPos` if available.
  value = source[7];
  if (value) {
    data[7] = value;
  }
  // Use source `ary` if it's smaller.
  if (srcBitmask & WRAP_ARY_FLAG) {
    data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
  }
  // Use source `arity` if one is not provided.
  if (data[9] == null) {
    data[9] = source[9];
  }
  // Use source `func` and merge bitmasks.
  data[0] = source[0];
  data[1] = newBitmask;

  return data;
}

module.exports = mergeData;


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(283);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(46),
    isSymbol = __webpack_require__(75);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),
/* 284 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(47),
    isObjectLike = __webpack_require__(38);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 286 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(47),
    isLength = __webpack_require__(122),
    isObjectLike = __webpack_require__(38);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(187);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

var baseClone = __webpack_require__(126);

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

module.exports = clone;


/***/ }),
/* 290 */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(91);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(91);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(91);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(91);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(90);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),
/* 296 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),
/* 297 */
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),
/* 298 */
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(90),
    Map = __webpack_require__(128),
    MapCache = __webpack_require__(129);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(301),
    ListCache = __webpack_require__(90),
    Map = __webpack_require__(128);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(302),
    hashDelete = __webpack_require__(303),
    hashGet = __webpack_require__(304),
    hashHas = __webpack_require__(305),
    hashSet = __webpack_require__(306);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(92);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),
/* 303 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(92);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(92);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(92);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(93);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),
/* 308 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(93);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(93);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(93);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(76),
    keysIn = __webpack_require__(188);

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(46),
    isPrototype = __webpack_require__(89),
    nativeKeysIn = __webpack_require__(314);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),
/* 314 */
/***/ (function(module, exports) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(32);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(103)(module)))

/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(76),
    getSymbols = __webpack_require__(130);

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),
/* 317 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(76),
    getSymbolsIn = __webpack_require__(190);

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(55),
    root = __webpack_require__(32);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(55),
    root = __webpack_require__(32);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),
/* 321 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(133),
    cloneDataView = __webpack_require__(323),
    cloneRegExp = __webpack_require__(324),
    cloneSymbol = __webpack_require__(325),
    cloneTypedArray = __webpack_require__(326);

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(133);

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),
/* 324 */
/***/ (function(module, exports) {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(64);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(133);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(84),
    getPrototype = __webpack_require__(132),
    isPrototype = __webpack_require__(89);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMap = __webpack_require__(329),
    baseUnary = __webpack_require__(123),
    nodeUtil = __webpack_require__(124);

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;


/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

var getTag = __webpack_require__(65),
    isObjectLike = __webpack_require__(38);

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;


/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsSet = __webpack_require__(331),
    baseUnary = __webpack_require__(123),
    nodeUtil = __webpack_require__(124);

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;


/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

var getTag = __webpack_require__(65),
    isObjectLike = __webpack_require__(38);

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;


/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(47),
    isObjectLike = __webpack_require__(38),
    isPlainObject = __webpack_require__(197);

/** `Object#toString` result references. */
var domExcTag = '[object DOMException]',
    errorTag = '[object Error]';

/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */
function isError(value) {
  if (!isObjectLike(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == errorTag || tag == domExcTag ||
    (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
}

module.exports = isError;


/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

var getTag = __webpack_require__(65),
    isObjectLike = __webpack_require__(38);

/** `Object#toString` result references. */
var weakMapTag = '[object WeakMap]';

/**
 * Checks if `value` is classified as a `WeakMap` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
 * @example
 *
 * _.isWeakMap(new WeakMap);
 * // => true
 *
 * _.isWeakMap(new Map);
 * // => false
 */
function isWeakMap(value) {
  return isObjectLike(value) && getTag(value) == weakMapTag;
}

module.exports = isWeakMap;


/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

var baseClone = __webpack_require__(126),
    baseIteratee = __webpack_require__(104);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a function that invokes `func` with the arguments of the created
 * function. If `func` is a property name, the created function returns the
 * property value for a given element. If `func` is an array or object, the
 * created function returns `true` for elements that contain the equivalent
 * source properties, otherwise it returns `false`.
 *
 * @static
 * @since 4.0.0
 * @memberOf _
 * @category Util
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @returns {Function} Returns the callback.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
 * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, _.iteratee(['user', 'fred']));
 * // => [{ 'user': 'fred', 'age': 40 }]
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, _.iteratee('user'));
 * // => ['barney', 'fred']
 *
 * // Create custom iteratee shorthands.
 * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
 *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
 *     return func.test(string);
 *   };
 * });
 *
 * _.filter(['abc', 'def'], /ef/);
 * // => ['def']
 */
function iteratee(func) {
  return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
}

module.exports = iteratee;


/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMatch = __webpack_require__(336),
    getMatchData = __webpack_require__(343),
    matchesStrictComparable = __webpack_require__(202);

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(127),
    baseIsEqual = __webpack_require__(153);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(127),
    equalArrays = __webpack_require__(198),
    equalByTag = __webpack_require__(340),
    equalObjects = __webpack_require__(342),
    getTag = __webpack_require__(65),
    isArray = __webpack_require__(30),
    isBuffer = __webpack_require__(88),
    isTypedArray = __webpack_require__(121);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),
/* 338 */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),
/* 339 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(64),
    Uint8Array = __webpack_require__(195),
    eq = __webpack_require__(102),
    equalArrays = __webpack_require__(198),
    mapToArray = __webpack_require__(341),
    setToArray = __webpack_require__(134);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),
/* 341 */
/***/ (function(module, exports) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),
/* 342 */
/***/ (function(module, exports, __webpack_require__) {

var getAllKeys = __webpack_require__(191);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

var isStrictComparable = __webpack_require__(201),
    keys = __webpack_require__(40);

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(153),
    get = __webpack_require__(345),
    hasIn = __webpack_require__(349),
    isKey = __webpack_require__(136),
    isStrictComparable = __webpack_require__(201),
    matchesStrictComparable = __webpack_require__(202),
    toKey = __webpack_require__(66);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(135);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(347);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),
/* 347 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(129);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(64),
    arrayMap = __webpack_require__(96),
    isArray = __webpack_require__(30),
    isSymbol = __webpack_require__(75);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

var baseHasIn = __webpack_require__(350),
    hasPath = __webpack_require__(351);

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),
/* 350 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),
/* 351 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(94),
    isArguments = __webpack_require__(87),
    isArray = __webpack_require__(30),
    isIndex = __webpack_require__(101),
    isLength = __webpack_require__(122),
    toKey = __webpack_require__(66);

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),
/* 352 */
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(353),
    basePropertyDeep = __webpack_require__(354),
    isKey = __webpack_require__(136),
    toKey = __webpack_require__(66);

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),
/* 353 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(135);

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

var createWrap = __webpack_require__(114),
    flatRest = __webpack_require__(204);

/** Used to compose bitmasks for function metadata. */
var WRAP_REARG_FLAG = 256;

/**
 * Creates a function that invokes `func` with arguments arranged according
 * to the specified `indexes` where the argument value at the first index is
 * provided as the first argument, the argument value at the second index is
 * provided as the second argument, and so on.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to rearrange arguments for.
 * @param {...(number|number[])} indexes The arranged argument indexes.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var rearged = _.rearg(function(a, b, c) {
 *   return [a, b, c];
 * }, [2, 0, 1]);
 *
 * rearged('b', 'c', 'a')
 * // => ['a', 'b', 'c']
 */
var rearg = flatRest(function(func, indexes) {
  return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
});

module.exports = rearg;


/***/ }),
/* 356 */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(357);

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),
/* 357 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(131),
    isFlattenable = __webpack_require__(358);

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),
/* 358 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(64),
    isArguments = __webpack_require__(87),
    isArray = __webpack_require__(30);

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),
/* 359 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(116);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),
/* 360 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(96),
    copyArray = __webpack_require__(85),
    isArray = __webpack_require__(30),
    isSymbol = __webpack_require__(75),
    stringToPath = __webpack_require__(203),
    toKey = __webpack_require__(66),
    toString = __webpack_require__(95);

/**
 * Converts `value` to a property path array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {*} value The value to convert.
 * @returns {Array} Returns the new property path array.
 * @example
 *
 * _.toPath('a.b.c');
 * // => ['a', 'b', 'c']
 *
 * _.toPath('a[0].b.c');
 * // => ['a', '0', 'b', 'c']
 */
function toPath(value) {
  if (isArray(value)) {
    return arrayMap(value, toKey);
  }
  return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
}

module.exports = toPath;


/***/ }),
/* 361 */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(104),
    isArrayLike = __webpack_require__(60),
    keys = __webpack_require__(40);

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;


/***/ }),
/* 362 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(181),
    baseIteratee = __webpack_require__(104),
    toInteger = __webpack_require__(86);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;


/***/ }),
/* 363 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(364);
var $Object = __webpack_require__(45).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 364 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(62);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(59), 'Object', { defineProperty: __webpack_require__(54).f });


/***/ }),
/* 365 */
/***/ (function(module, exports, __webpack_require__) {

var baseInverter = __webpack_require__(366);

/**
 * Creates a function like `_.invertBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} toIteratee The function to resolve iteratees.
 * @returns {Function} Returns the new inverter function.
 */
function createInverter(setter, toIteratee) {
  return function(object, iteratee) {
    return baseInverter(object, setter, toIteratee(iteratee), {});
  };
}

module.exports = createInverter;


/***/ }),
/* 366 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(224);

/**
 * The base implementation of `_.invert` and `_.invertBy` which inverts
 * `object` with values transformed by `iteratee` and set by `setter`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform values.
 * @param {Object} accumulator The initial inverted object.
 * @returns {Function} Returns `accumulator`.
 */
function baseInverter(object, setter, iteratee, accumulator) {
  baseForOwn(object, function(value, key, object) {
    setter(accumulator, iteratee(value), key, object);
  });
  return accumulator;
}

module.exports = baseInverter;


/***/ }),
/* 367 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(368);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),
/* 368 */
/***/ (function(module, exports) {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),
/* 369 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(370);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 370 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),
/* 371 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(94),
    last = __webpack_require__(372),
    parent = __webpack_require__(373),
    toKey = __webpack_require__(66);

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

module.exports = baseUnset;


/***/ }),
/* 372 */
/***/ (function(module, exports) {

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;


/***/ }),
/* 373 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(135),
    baseSlice = __webpack_require__(205);

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;


/***/ }),
/* 374 */
/***/ (function(module, exports, __webpack_require__) {

var isPlainObject = __webpack_require__(197);

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

module.exports = customOmitClone;


/***/ }),
/* 375 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(47),
    isArray = __webpack_require__(30),
    isObjectLike = __webpack_require__(38);

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;


/***/ }),
/* 376 */
/***/ (function(module, exports, __webpack_require__) {

var baseValues = __webpack_require__(377),
    keys = __webpack_require__(40);

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;


/***/ }),
/* 377 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(96);

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;


/***/ }),
/* 378 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(199),
    arrayIncludes = __webpack_require__(179),
    arrayIncludesWith = __webpack_require__(379),
    cacheHas = __webpack_require__(200),
    createSet = __webpack_require__(380),
    setToArray = __webpack_require__(134);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;


/***/ }),
/* 379 */
/***/ (function(module, exports) {

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;


/***/ }),
/* 380 */
/***/ (function(module, exports, __webpack_require__) {

var Set = __webpack_require__(194),
    noop = __webpack_require__(72),
    setToArray = __webpack_require__(134);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;


/***/ }),
/* 381 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 382 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 383 */
/***/ (function(module, exports, __webpack_require__) {

var createCaseFirst = __webpack_require__(384);

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = createCaseFirst('toUpperCase');

module.exports = upperFirst;


/***/ }),
/* 384 */
/***/ (function(module, exports, __webpack_require__) {

var castSlice = __webpack_require__(385),
    hasUnicode = __webpack_require__(206),
    stringToArray = __webpack_require__(386),
    toString = __webpack_require__(95);

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);

    var strSymbols = hasUnicode(string)
      ? stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

module.exports = createCaseFirst;


/***/ }),
/* 385 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(205);

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

module.exports = castSlice;


/***/ }),
/* 386 */
/***/ (function(module, exports, __webpack_require__) {

var asciiToArray = __webpack_require__(387),
    hasUnicode = __webpack_require__(206),
    unicodeToArray = __webpack_require__(388);

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

module.exports = stringToArray;


/***/ }),
/* 387 */
/***/ (function(module, exports) {

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

module.exports = asciiToArray;


/***/ }),
/* 388 */
/***/ (function(module, exports) {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

module.exports = unicodeToArray;


/***/ }),
/* 389 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 390 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 391 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */,
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */,
/* 428 */,
/* 429 */,
/* 430 */,
/* 431 */,
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */,
/* 440 */,
/* 441 */,
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */,
/* 446 */,
/* 447 */,
/* 448 */,
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */,
/* 453 */,
/* 454 */,
/* 455 */,
/* 456 */,
/* 457 */,
/* 458 */,
/* 459 */,
/* 460 */,
/* 461 */,
/* 462 */,
/* 463 */,
/* 464 */,
/* 465 */,
/* 466 */,
/* 467 */,
/* 468 */,
/* 469 */,
/* 470 */,
/* 471 */,
/* 472 */,
/* 473 */,
/* 474 */,
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */,
/* 481 */,
/* 482 */,
/* 483 */,
/* 484 */,
/* 485 */,
/* 486 */,
/* 487 */,
/* 488 */,
/* 489 */,
/* 490 */,
/* 491 */,
/* 492 */,
/* 493 */,
/* 494 */,
/* 495 */,
/* 496 */,
/* 497 */,
/* 498 */,
/* 499 */,
/* 500 */,
/* 501 */,
/* 502 */,
/* 503 */,
/* 504 */,
/* 505 */,
/* 506 */,
/* 507 */,
/* 508 */,
/* 509 */,
/* 510 */,
/* 511 */,
/* 512 */,
/* 513 */,
/* 514 */,
/* 515 */
/***/ (function(module, exports, __webpack_require__) {

var arraySome = __webpack_require__(222),
    baseIteratee = __webpack_require__(104),
    baseSome = __webpack_require__(561),
    isArray = __webpack_require__(30),
    isIterateeCall = __webpack_require__(564);

/**
 * Checks if `predicate` returns truthy for **any** element of `collection`.
 * Iteration is stopped once `predicate` returns truthy. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 * @example
 *
 * _.some([null, 0, 'yes', false], Boolean);
 * // => true
 *
 * var users = [
 *   { 'user': 'barney', 'active': true },
 *   { 'user': 'fred',   'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.some(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.some(users, ['active', false]);
 * // => true
 *
 * // The `_.property` iteratee shorthand.
 * _.some(users, 'active');
 * // => true
 */
function some(collection, predicate, guard) {
  var func = isArray(collection) ? arraySome : baseSome;
  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = some;


/***/ }),
/* 516 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/defineProperty.js
var defineProperty = __webpack_require__(6);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// EXTERNAL MODULE: ./node_modules/redux/es/redux.js
var redux = __webpack_require__(19);

// EXTERNAL MODULE: ./src/modules/data/ui/index.js + 4 modules
var ui = __webpack_require__(43);

// EXTERNAL MODULE: ./src/modules/data/blocks/index.js + 4 modules
var blocks = __webpack_require__(10);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/extends.js
var helpers_extends = __webpack_require__(18);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);

// EXTERNAL MODULE: ./src/modules/data/prefix.js
var prefix = __webpack_require__(16);

// CONCATENATED MODULE: ./src/modules/data/status/types.js
/* eslint-disable max-len */
/**
 * Internal dependencies
 */


var SET_SERIES_QUEUE_STATUS = prefix["a" /* PREFIX_EVENTS_PRO_STORE */] + '/SET_SERIES_QUEUE_STATUS';
// CONCATENATED MODULE: ./src/modules/data/status/reducer.js

/**
 * Internal dependencies
 */


var DEFAULT_STATE = {};

/* harmony default export */ var reducer = (function () {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
	var action = arguments[1];

	switch (action.type) {
		case SET_SERIES_QUEUE_STATUS:
			return extends_default()({}, state, action.payload);
		default:
			return state;
	}
});
// CONCATENATED MODULE: ./src/modules/data/status/actions.js
/**
 * Internal dependencies
 */


var actions_setSeriesQueueStatus = function setSeriesQueueStatus(payload) {
  return {
    type: SET_SERIES_QUEUE_STATUS,
    payload: payload
  };
};
// EXTERNAL MODULE: ./node_modules/reselect/lib/index.js
var lib = __webpack_require__(4);

// EXTERNAL MODULE: external "tribe.common.data.plugins"
var external_tribe_common_data_plugins_ = __webpack_require__(29);

// CONCATENATED MODULE: ./src/modules/data/status/selectors.js
/**
 * External dependencies
 */



var selectors_getStatus = function getStatus(state) {
  return state[external_tribe_common_data_plugins_["constants"].EVENTS_PRO_PLUGIN].status;
};

var selectors_isCompleted = Object(lib["createSelector"])(selectors_getStatus, function (status) {
  return !!status.done;
});
var getProgress = Object(lib["createSelector"])(selectors_getStatus, function (status) {
  return status.progress;
});
// CONCATENATED MODULE: ./src/modules/data/status/index.js
/**
 * Internal dependencies
 */





/* harmony default export */ var data_status = (reducer);

// CONCATENATED MODULE: ./src/modules/data/reducers.js
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */




/* harmony default export */ var reducers = (Object(redux["b" /* combineReducers */])({
  ui: ui["b" /* default */],
  blocks: blocks["default"],
  status: data_status
}));
// EXTERNAL MODULE: external "tribe.common.store"
var external_tribe_common_store_ = __webpack_require__(105);

// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/index.js + 2 modules
var recurring = __webpack_require__(7);

// EXTERNAL MODULE: ./src/modules/data/blocks/exception/index.js + 4 modules
var exception = __webpack_require__(24);

// EXTERNAL MODULE: ./src/modules/data/blocks/additional-fields/index.js + 7 modules
var additional_fields = __webpack_require__(13);

// EXTERNAL MODULE: ./src/modules/data/shared/sync.js
var sync = __webpack_require__(216);

// EXTERNAL MODULE: ./node_modules/babel-runtime/regenerator/index.js
var regenerator = __webpack_require__(11);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./node_modules/lodash/some.js
var some = __webpack_require__(515);
var some_default = /*#__PURE__*/__webpack_require__.n(some);

// EXTERNAL MODULE: external {"var":"wp.i18n","root":["wp","i18n"]}
var external_var_wp_i18n_root_wp_i18n_ = __webpack_require__(3);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/effects.js + 1 modules
var es_effects = __webpack_require__(1);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/utils.js
var utils = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/channel.js
var internal_channel = __webpack_require__(33);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/scheduler.js
var scheduler = __webpack_require__(78);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/io.js
var io = __webpack_require__(15);

// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/buffers.js
var buffers = __webpack_require__(50);

// CONCATENATED MODULE: ./node_modules/redux-saga/es/internal/proc.js
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }







var NOT_ITERATOR_ERROR = 'proc first argument (Saga function result) must be an iterator';

var CHANNEL_END = {
  toString: function toString() {
    return '@@redux-saga/CHANNEL_END';
  }
};
var TASK_CANCEL = {
  toString: function toString() {
    return '@@redux-saga/TASK_CANCEL';
  }
};

var matchers = {
  wildcard: function wildcard() {
    return utils["o" /* kTrue */];
  },
  default: function _default(pattern) {
    return (typeof pattern === 'undefined' ? 'undefined' : _typeof(pattern)) === 'symbol' ? function (input) {
      return input.type === pattern;
    } : function (input) {
      return input.type === String(pattern);
    };
  },
  array: function array(patterns) {
    return function (input) {
      return patterns.some(function (p) {
        return matcher(p)(input);
      });
    };
  },
  predicate: function predicate(_predicate) {
    return function (input) {
      return _predicate(input);
    };
  }
};

function matcher(pattern) {
  // prettier-ignore
  return (pattern === '*' ? matchers.wildcard : utils["n" /* is */].array(pattern) ? matchers.array : utils["n" /* is */].stringableFunc(pattern) ? matchers.default : utils["n" /* is */].func(pattern) ? matchers.predicate : matchers.default)(pattern);
}

/**
  Used to track a parent task and its forks
  In the new fork model, forked tasks are attached by default to their parent
  We model this using the concept of Parent task && main Task
  main task is the main flow of the current Generator, the parent tasks is the
  aggregation of the main tasks + all its forked tasks.
  Thus the whole model represents an execution tree with multiple branches (vs the
  linear execution tree in sequential (non parallel) programming)

  A parent tasks has the following semantics
  - It completes if all its forks either complete or all cancelled
  - If it's cancelled, all forks are cancelled as well
  - It aborts if any uncaught error bubbles up from forks
  - If it completes, the return value is the one returned by the main task
**/
function forkQueue(name, mainTask, cb) {
  var tasks = [],
      result = void 0,
      completed = false;
  addTask(mainTask);

  function abort(err) {
    cancelAll();
    cb(err, true);
  }

  function addTask(task) {
    tasks.push(task);
    task.cont = function (res, isErr) {
      if (completed) {
        return;
      }

      Object(utils["t" /* remove */])(tasks, task);
      task.cont = utils["r" /* noop */];
      if (isErr) {
        abort(res);
      } else {
        if (task === mainTask) {
          result = res;
        }
        if (!tasks.length) {
          completed = true;
          cb(result);
        }
      }
    };
    // task.cont.cancel = task.cancel
  }

  function cancelAll() {
    if (completed) {
      return;
    }
    completed = true;
    tasks.forEach(function (t) {
      t.cont = utils["r" /* noop */];
      t.cancel();
    });
    tasks = [];
  }

  return {
    addTask: addTask,
    cancelAll: cancelAll,
    abort: abort,
    getTasks: function getTasks() {
      return tasks;
    },
    taskNames: function taskNames() {
      return tasks.map(function (t) {
        return t.name;
      });
    }
  };
}

function createTaskIterator(_ref) {
  var context = _ref.context,
      fn = _ref.fn,
      args = _ref.args;

  if (utils["n" /* is */].iterator(fn)) {
    return fn;
  }

  // catch synchronous failures; see #152 and #441
  var result = void 0,
      error = void 0;
  try {
    result = fn.apply(context, args);
  } catch (err) {
    error = err;
  }

  // i.e. a generator function returns an iterator
  if (utils["n" /* is */].iterator(result)) {
    return result;
  }

  // do not bubble up synchronous failures for detached forks
  // instead create a failed task. See #152 and #441
  return error ? Object(utils["q" /* makeIterator */])(function () {
    throw error;
  }) : Object(utils["q" /* makeIterator */])(function () {
    var pc = void 0;
    var eff = { done: false, value: result };
    var ret = function ret(value) {
      return { done: true, value: value };
    };
    return function (arg) {
      if (!pc) {
        pc = true;
        return eff;
      } else {
        return ret(arg);
      }
    };
  }());
}

var wrapHelper = function wrapHelper(helper) {
  return { fn: helper };
};

function proc(iterator) {
  var subscribe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return utils["r" /* noop */];
  };
  var dispatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : utils["r" /* noop */];
  var getState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : utils["r" /* noop */];
  var parentContext = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var parentEffectId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  var name = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'anonymous';
  var cont = arguments[8];

  Object(utils["g" /* check */])(iterator, utils["n" /* is */].iterator, NOT_ITERATOR_ERROR);

  var effectsString = '[...effects]';
  var runParallelEffect = Object(utils["k" /* deprecate */])(runAllEffect, Object(utils["w" /* updateIncentive */])(effectsString, 'all(' + effectsString + ')'));

  var sagaMonitor = options.sagaMonitor,
      logger = options.logger,
      onError = options.onError;

  var log = logger || utils["p" /* log */];
  var logError = function logError(err) {
    var message = err.sagaStack;

    if (!message && err.stack) {
      message = err.stack.split('\n')[0].indexOf(err.message) !== -1 ? err.stack : 'Error: ' + err.message + '\n' + err.stack;
    }

    log('error', 'uncaught at ' + name, message || err.message || err);
  };
  var stdChannel = Object(internal_channel["e" /* stdChannel */])(subscribe);
  var taskContext = Object.create(parentContext);
  /**
    Tracks the current effect cancellation
    Each time the generator progresses. calling runEffect will set a new value
    on it. It allows propagating cancellation to child effects
  **/
  next.cancel = utils["r" /* noop */];

  /**
    Creates a new task descriptor for this generator, We'll also create a main task
    to track the main flow (besides other forked tasks)
  **/
  var task = newTask(parentEffectId, name, iterator, cont);
  var mainTask = { name: name, cancel: cancelMain, isRunning: true };
  var taskQueue = forkQueue(name, mainTask, end);

  /**
    cancellation of the main task. We'll simply resume the Generator with a Cancel
  **/
  function cancelMain() {
    if (mainTask.isRunning && !mainTask.isCancelled) {
      mainTask.isCancelled = true;
      next(TASK_CANCEL);
    }
  }

  /**
    This may be called by a parent generator to trigger/propagate cancellation
    cancel all pending tasks (including the main task), then end the current task.
     Cancellation propagates down to the whole execution tree holded by this Parent task
    It's also propagated to all joiners of this task and their execution tree/joiners
     Cancellation is noop for terminated/Cancelled tasks tasks
  **/
  function cancel() {
    /**
      We need to check both Running and Cancelled status
      Tasks can be Cancelled but still Running
    **/
    if (iterator._isRunning && !iterator._isCancelled) {
      iterator._isCancelled = true;
      taskQueue.cancelAll();
      /**
        Ending with a Never result will propagate the Cancellation to all joiners
      **/
      end(TASK_CANCEL);
    }
  }
  /**
    attaches cancellation logic to this task's continuation
    this will permit cancellation to propagate down the call chain
  **/
  cont && (cont.cancel = cancel);

  // tracks the running status
  iterator._isRunning = true;

  // kicks up the generator
  next();

  // then return the task descriptor to the caller
  return task;

  /**
    This is the generator driver
    It's a recursive async/continuation function which calls itself
    until the generator terminates or throws
  **/
  function next(arg, isErr) {
    // Preventive measure. If we end up here, then there is really something wrong
    if (!mainTask.isRunning) {
      throw new Error('Trying to resume an already finished generator');
    }

    try {
      var result = void 0;
      if (isErr) {
        result = iterator.throw(arg);
      } else if (arg === TASK_CANCEL) {
        /**
          getting TASK_CANCEL automatically cancels the main task
          We can get this value here
           - By cancelling the parent task manually
          - By joining a Cancelled task
        **/
        mainTask.isCancelled = true;
        /**
          Cancels the current effect; this will propagate the cancellation down to any called tasks
        **/
        next.cancel();
        /**
          If this Generator has a `return` method then invokes it
          This will jump to the finally block
        **/
        result = utils["n" /* is */].func(iterator.return) ? iterator.return(TASK_CANCEL) : { done: true, value: TASK_CANCEL };
      } else if (arg === CHANNEL_END) {
        // We get CHANNEL_END by taking from a channel that ended using `take` (and not `takem` used to trap End of channels)
        result = utils["n" /* is */].func(iterator.return) ? iterator.return() : { done: true };
      } else {
        result = iterator.next(arg);
      }

      if (!result.done) {
        runEffect(result.value, parentEffectId, '', next);
      } else {
        /**
          This Generator has ended, terminate the main task and notify the fork queue
        **/
        mainTask.isMainRunning = false;
        mainTask.cont && mainTask.cont(result.value);
      }
    } catch (error) {
      if (mainTask.isCancelled) {
        logError(error);
      }
      mainTask.isMainRunning = false;
      mainTask.cont(error, true);
    }
  }

  function end(result, isErr) {
    iterator._isRunning = false;
    stdChannel.close();
    if (!isErr) {
      iterator._result = result;
      iterator._deferredEnd && iterator._deferredEnd.resolve(result);
    } else {
      if (result instanceof Error) {
        Object.defineProperty(result, 'sagaStack', {
          value: 'at ' + name + ' \n ' + (result.sagaStack || result.stack),
          configurable: true
        });
      }
      if (!task.cont) {
        if (result instanceof Error && onError) {
          onError(result);
        } else {
          logError(result);
        }
      }
      iterator._error = result;
      iterator._isAborted = true;
      iterator._deferredEnd && iterator._deferredEnd.reject(result);
    }
    task.cont && task.cont(result, isErr);
    task.joiners.forEach(function (j) {
      return j.cb(result, isErr);
    });
    task.joiners = null;
  }

  function runEffect(effect, parentEffectId) {
    var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var cb = arguments[3];

    var effectId = Object(utils["v" /* uid */])();
    sagaMonitor && sagaMonitor.effectTriggered({ effectId: effectId, parentEffectId: parentEffectId, label: label, effect: effect });

    /**
      completion callback and cancel callback are mutually exclusive
      We can't cancel an already completed effect
      And We can't complete an already cancelled effectId
    **/
    var effectSettled = void 0;

    // Completion callback passed to the appropriate effect runner
    function currCb(res, isErr) {
      if (effectSettled) {
        return;
      }

      effectSettled = true;
      cb.cancel = utils["r" /* noop */]; // defensive measure
      if (sagaMonitor) {
        isErr ? sagaMonitor.effectRejected(effectId, res) : sagaMonitor.effectResolved(effectId, res);
      }
      cb(res, isErr);
    }
    // tracks down the current cancel
    currCb.cancel = utils["r" /* noop */];

    // setup cancellation logic on the parent cb
    cb.cancel = function () {
      // prevents cancelling an already completed effect
      if (effectSettled) {
        return;
      }

      effectSettled = true;
      /**
        propagates cancel downward
        catch uncaught cancellations errors; since we can no longer call the completion
        callback, log errors raised during cancellations into the console
      **/
      try {
        currCb.cancel();
      } catch (err) {
        logError(err);
      }
      currCb.cancel = utils["r" /* noop */]; // defensive measure

      sagaMonitor && sagaMonitor.effectCancelled(effectId);
    };

    /**
      each effect runner must attach its own logic of cancellation to the provided callback
      it allows this generator to propagate cancellation downward.
       ATTENTION! effect runners must setup the cancel logic by setting cb.cancel = [cancelMethod]
      And the setup must occur before calling the callback
       This is a sort of inversion of control: called async functions are responsible
      for completing the flow by calling the provided continuation; while caller functions
      are responsible for aborting the current flow by calling the attached cancel function
       Library users can attach their own cancellation logic to promises by defining a
      promise[CANCEL] method in their returned promises
      ATTENTION! calling cancel must have no effect on an already completed or cancelled effect
    **/
    var data = void 0;
    // prettier-ignore
    return (
      // Non declarative effect
      utils["n" /* is */].promise(effect) ? resolvePromise(effect, currCb) : utils["n" /* is */].helper(effect) ? runForkEffect(wrapHelper(effect), effectId, currCb) : utils["n" /* is */].iterator(effect) ? resolveIterator(effect, effectId, name, currCb)

      // declarative effects
      : utils["n" /* is */].array(effect) ? runParallelEffect(effect, effectId, currCb) : (data = io["c" /* asEffect */].take(effect)) ? runTakeEffect(data, currCb) : (data = io["c" /* asEffect */].put(effect)) ? runPutEffect(data, currCb) : (data = io["c" /* asEffect */].all(effect)) ? runAllEffect(data, effectId, currCb) : (data = io["c" /* asEffect */].race(effect)) ? runRaceEffect(data, effectId, currCb) : (data = io["c" /* asEffect */].call(effect)) ? runCallEffect(data, effectId, currCb) : (data = io["c" /* asEffect */].cps(effect)) ? runCPSEffect(data, currCb) : (data = io["c" /* asEffect */].fork(effect)) ? runForkEffect(data, effectId, currCb) : (data = io["c" /* asEffect */].join(effect)) ? runJoinEffect(data, currCb) : (data = io["c" /* asEffect */].cancel(effect)) ? runCancelEffect(data, currCb) : (data = io["c" /* asEffect */].select(effect)) ? runSelectEffect(data, currCb) : (data = io["c" /* asEffect */].actionChannel(effect)) ? runChannelEffect(data, currCb) : (data = io["c" /* asEffect */].flush(effect)) ? runFlushEffect(data, currCb) : (data = io["c" /* asEffect */].cancelled(effect)) ? runCancelledEffect(data, currCb) : (data = io["c" /* asEffect */].getContext(effect)) ? runGetContextEffect(data, currCb) : (data = io["c" /* asEffect */].setContext(effect)) ? runSetContextEffect(data, currCb) : /* anything else returned as is */currCb(effect)
    );
  }

  function resolvePromise(promise, cb) {
    var cancelPromise = promise[utils["a" /* CANCEL */]];
    if (utils["n" /* is */].func(cancelPromise)) {
      cb.cancel = cancelPromise;
    } else if (utils["n" /* is */].func(promise.abort)) {
      cb.cancel = function () {
        return promise.abort();
      };
      // TODO: add support for the fetch API, whenever they get around to
      // adding cancel support
    }
    promise.then(cb, function (error) {
      return cb(error, true);
    });
  }

  function resolveIterator(iterator, effectId, name, cb) {
    proc(iterator, subscribe, dispatch, getState, taskContext, options, effectId, name, cb);
  }

  function runTakeEffect(_ref2, cb) {
    var channel = _ref2.channel,
        pattern = _ref2.pattern,
        maybe = _ref2.maybe;

    channel = channel || stdChannel;
    var takeCb = function takeCb(inp) {
      return inp instanceof Error ? cb(inp, true) : Object(internal_channel["d" /* isEnd */])(inp) && !maybe ? cb(CHANNEL_END) : cb(inp);
    };
    try {
      channel.take(takeCb, matcher(pattern));
    } catch (err) {
      return cb(err, true);
    }
    cb.cancel = takeCb.cancel;
  }

  function runPutEffect(_ref3, cb) {
    var channel = _ref3.channel,
        action = _ref3.action,
        resolve = _ref3.resolve;

    /**
      Schedule the put in case another saga is holding a lock.
      The put will be executed atomically. ie nested puts will execute after
      this put has terminated.
    **/
    Object(scheduler["a" /* asap */])(function () {
      var result = void 0;
      try {
        result = (channel ? channel.put : dispatch)(action);
      } catch (error) {
        // If we have a channel or `put.resolve` was used then bubble up the error.
        if (channel || resolve) return cb(error, true);
        logError(error);
      }

      if (resolve && utils["n" /* is */].promise(result)) {
        resolvePromise(result, cb);
      } else {
        return cb(result);
      }
    });
    // Put effects are non cancellables
  }

  function runCallEffect(_ref4, effectId, cb) {
    var context = _ref4.context,
        fn = _ref4.fn,
        args = _ref4.args;

    var result = void 0;
    // catch synchronous failures; see #152
    try {
      result = fn.apply(context, args);
    } catch (error) {
      return cb(error, true);
    }
    return utils["n" /* is */].promise(result) ? resolvePromise(result, cb) : utils["n" /* is */].iterator(result) ? resolveIterator(result, effectId, fn.name, cb) : cb(result);
  }

  function runCPSEffect(_ref5, cb) {
    var context = _ref5.context,
        fn = _ref5.fn,
        args = _ref5.args;

    // CPS (ie node style functions) can define their own cancellation logic
    // by setting cancel field on the cb

    // catch synchronous failures; see #152
    try {
      var cpsCb = function cpsCb(err, res) {
        return utils["n" /* is */].undef(err) ? cb(res) : cb(err, true);
      };
      fn.apply(context, args.concat(cpsCb));
      if (cpsCb.cancel) {
        cb.cancel = function () {
          return cpsCb.cancel();
        };
      }
    } catch (error) {
      return cb(error, true);
    }
  }

  function runForkEffect(_ref6, effectId, cb) {
    var context = _ref6.context,
        fn = _ref6.fn,
        args = _ref6.args,
        detached = _ref6.detached;

    var taskIterator = createTaskIterator({ context: context, fn: fn, args: args });

    try {
      Object(scheduler["c" /* suspend */])();
      var _task = proc(taskIterator, subscribe, dispatch, getState, taskContext, options, effectId, fn.name, detached ? null : utils["r" /* noop */]);

      if (detached) {
        cb(_task);
      } else {
        if (taskIterator._isRunning) {
          taskQueue.addTask(_task);
          cb(_task);
        } else if (taskIterator._error) {
          taskQueue.abort(taskIterator._error);
        } else {
          cb(_task);
        }
      }
    } finally {
      Object(scheduler["b" /* flush */])();
    }
    // Fork effects are non cancellables
  }

  function runJoinEffect(t, cb) {
    if (t.isRunning()) {
      var joiner = { task: task, cb: cb };
      cb.cancel = function () {
        return Object(utils["t" /* remove */])(t.joiners, joiner);
      };
      t.joiners.push(joiner);
    } else {
      t.isAborted() ? cb(t.error(), true) : cb(t.result());
    }
  }

  function runCancelEffect(taskToCancel, cb) {
    if (taskToCancel === utils["d" /* SELF_CANCELLATION */]) {
      taskToCancel = task;
    }
    if (taskToCancel.isRunning()) {
      taskToCancel.cancel();
    }
    cb();
    // cancel effects are non cancellables
  }

  function runAllEffect(effects, effectId, cb) {
    var keys = Object.keys(effects);

    if (!keys.length) {
      return cb(utils["n" /* is */].array(effects) ? [] : {});
    }

    var completedCount = 0;
    var completed = void 0;
    var results = {};
    var childCbs = {};

    function checkEffectEnd() {
      if (completedCount === keys.length) {
        completed = true;
        cb(utils["n" /* is */].array(effects) ? utils["f" /* array */].from(_extends({}, results, { length: keys.length })) : results);
      }
    }

    keys.forEach(function (key) {
      var chCbAtKey = function chCbAtKey(res, isErr) {
        if (completed) {
          return;
        }
        if (isErr || Object(internal_channel["d" /* isEnd */])(res) || res === CHANNEL_END || res === TASK_CANCEL) {
          cb.cancel();
          cb(res, isErr);
        } else {
          results[key] = res;
          completedCount++;
          checkEffectEnd();
        }
      };
      chCbAtKey.cancel = utils["r" /* noop */];
      childCbs[key] = chCbAtKey;
    });

    cb.cancel = function () {
      if (!completed) {
        completed = true;
        keys.forEach(function (key) {
          return childCbs[key].cancel();
        });
      }
    };

    keys.forEach(function (key) {
      return runEffect(effects[key], effectId, key, childCbs[key]);
    });
  }

  function runRaceEffect(effects, effectId, cb) {
    var completed = void 0;
    var keys = Object.keys(effects);
    var childCbs = {};

    keys.forEach(function (key) {
      var chCbAtKey = function chCbAtKey(res, isErr) {
        if (completed) {
          return;
        }

        if (isErr) {
          // Race Auto cancellation
          cb.cancel();
          cb(res, true);
        } else if (!Object(internal_channel["d" /* isEnd */])(res) && res !== CHANNEL_END && res !== TASK_CANCEL) {
          var _response;

          cb.cancel();
          completed = true;
          var response = (_response = {}, _response[key] = res, _response);
          cb(utils["n" /* is */].array(effects) ? [].slice.call(_extends({}, response, { length: keys.length })) : response);
        }
      };
      chCbAtKey.cancel = utils["r" /* noop */];
      childCbs[key] = chCbAtKey;
    });

    cb.cancel = function () {
      // prevents unnecessary cancellation
      if (!completed) {
        completed = true;
        keys.forEach(function (key) {
          return childCbs[key].cancel();
        });
      }
    };
    keys.forEach(function (key) {
      if (completed) {
        return;
      }
      runEffect(effects[key], effectId, key, childCbs[key]);
    });
  }

  function runSelectEffect(_ref7, cb) {
    var selector = _ref7.selector,
        args = _ref7.args;

    try {
      var state = selector.apply(undefined, [getState()].concat(args));
      cb(state);
    } catch (error) {
      cb(error, true);
    }
  }

  function runChannelEffect(_ref8, cb) {
    var pattern = _ref8.pattern,
        buffer = _ref8.buffer;

    var match = matcher(pattern);
    match.pattern = pattern;
    cb(Object(internal_channel["c" /* eventChannel */])(subscribe, buffer || buffers["a" /* buffers */].fixed(), match));
  }

  function runCancelledEffect(data, cb) {
    cb(!!mainTask.isCancelled);
  }

  function runFlushEffect(channel, cb) {
    channel.flush(cb);
  }

  function runGetContextEffect(prop, cb) {
    cb(taskContext[prop]);
  }

  function runSetContextEffect(props, cb) {
    utils["s" /* object */].assign(taskContext, props);
    cb();
  }

  function newTask(id, name, iterator, cont) {
    var _done, _ref9, _mutatorMap;

    iterator._deferredEnd = null;
    return _ref9 = {}, _ref9[utils["e" /* TASK */]] = true, _ref9.id = id, _ref9.name = name, _done = 'done', _mutatorMap = {}, _mutatorMap[_done] = _mutatorMap[_done] || {}, _mutatorMap[_done].get = function () {
      if (iterator._deferredEnd) {
        return iterator._deferredEnd.promise;
      } else {
        var def = Object(utils["i" /* deferred */])();
        iterator._deferredEnd = def;
        if (!iterator._isRunning) {
          iterator._error ? def.reject(iterator._error) : def.resolve(iterator._result);
        }
        return def.promise;
      }
    }, _ref9.cont = cont, _ref9.joiners = [], _ref9.cancel = cancel, _ref9.isRunning = function isRunning() {
      return iterator._isRunning;
    }, _ref9.isCancelled = function isCancelled() {
      return iterator._isCancelled;
    }, _ref9.isAborted = function isAborted() {
      return iterator._isAborted;
    }, _ref9.result = function result() {
      return iterator._result;
    }, _ref9.error = function error() {
      return iterator._error;
    }, _ref9.setContext = function setContext(props) {
      Object(utils["g" /* check */])(props, utils["n" /* is */].object, Object(utils["h" /* createSetContextWarning */])('task', props));
      utils["s" /* object */].assign(taskContext, props);
    }, _defineEnumerableProperties(_ref9, _mutatorMap), _ref9;
  }
}
// CONCATENATED MODULE: ./node_modules/redux-saga/es/internal/runSaga.js



var RUN_SAGA_SIGNATURE = 'runSaga(storeInterface, saga, ...args)';
var NON_GENERATOR_ERR = RUN_SAGA_SIGNATURE + ': saga argument must be a Generator function!';

function runSaga(storeInterface, saga) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var iterator = void 0;

  if (utils["n" /* is */].iterator(storeInterface)) {
    if (false) {}
    iterator = storeInterface;
    storeInterface = saga;
  } else {
    Object(utils["g" /* check */])(saga, utils["n" /* is */].func, NON_GENERATOR_ERR);
    iterator = saga.apply(undefined, args);
    Object(utils["g" /* check */])(iterator, utils["n" /* is */].iterator, NON_GENERATOR_ERR);
  }

  var _storeInterface = storeInterface,
      subscribe = _storeInterface.subscribe,
      dispatch = _storeInterface.dispatch,
      getState = _storeInterface.getState,
      context = _storeInterface.context,
      sagaMonitor = _storeInterface.sagaMonitor,
      logger = _storeInterface.logger,
      onError = _storeInterface.onError;


  var effectId = Object(utils["v" /* uid */])();

  if (sagaMonitor) {
    // monitors are expected to have a certain interface, let's fill-in any missing ones
    sagaMonitor.effectTriggered = sagaMonitor.effectTriggered || utils["r" /* noop */];
    sagaMonitor.effectResolved = sagaMonitor.effectResolved || utils["r" /* noop */];
    sagaMonitor.effectRejected = sagaMonitor.effectRejected || utils["r" /* noop */];
    sagaMonitor.effectCancelled = sagaMonitor.effectCancelled || utils["r" /* noop */];
    sagaMonitor.actionDispatched = sagaMonitor.actionDispatched || utils["r" /* noop */];

    sagaMonitor.effectTriggered({ effectId: effectId, root: true, parentEffectId: 0, effect: { root: true, saga: saga, args: args } });
  }

  var task = proc(iterator, subscribe, Object(utils["x" /* wrapSagaDispatch */])(dispatch), getState, context, { sagaMonitor: sagaMonitor, logger: logger, onError: onError }, effectId, saga.name);

  if (sagaMonitor) {
    sagaMonitor.effectResolved(effectId, task);
  }

  return task;
}
// CONCATENATED MODULE: ./node_modules/redux-saga/es/internal/middleware.js
function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }






function sagaMiddlewareFactory() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref$context = _ref.context,
      context = _ref$context === undefined ? {} : _ref$context,
      options = _objectWithoutProperties(_ref, ['context']);

  var sagaMonitor = options.sagaMonitor,
      logger = options.logger,
      onError = options.onError;


  if (utils["n" /* is */].func(options)) {
    if (true) {
      throw new Error('Saga middleware no longer accept Generator functions. Use sagaMiddleware.run instead');
    } else {}
  }

  if (logger && !utils["n" /* is */].func(logger)) {
    throw new Error('`options.logger` passed to the Saga middleware is not a function!');
  }

  if (false) {}

  if (onError && !utils["n" /* is */].func(onError)) {
    throw new Error('`options.onError` passed to the Saga middleware is not a function!');
  }

  if (options.emitter && !utils["n" /* is */].func(options.emitter)) {
    throw new Error('`options.emitter` passed to the Saga middleware is not a function!');
  }

  function sagaMiddleware(_ref2) {
    var getState = _ref2.getState,
        dispatch = _ref2.dispatch;

    var sagaEmitter = Object(internal_channel["b" /* emitter */])();
    sagaEmitter.emit = (options.emitter || utils["l" /* ident */])(sagaEmitter.emit);

    sagaMiddleware.run = runSaga.bind(null, {
      context: context,
      subscribe: sagaEmitter.subscribe,
      dispatch: dispatch,
      getState: getState,
      sagaMonitor: sagaMonitor,
      logger: logger,
      onError: onError
    });

    return function (next) {
      return function (action) {
        if (sagaMonitor && sagaMonitor.actionDispatched) {
          sagaMonitor.actionDispatched(action);
        }
        var result = next(action); // hit reducers
        sagaEmitter.emit(action);
        return result;
      };
    };
  }

  sagaMiddleware.run = function () {
    throw new Error('Before running a Saga, you must mount the Saga middleware on the Store using applyMiddleware');
  };

  sagaMiddleware.setContext = function (props) {
    Object(utils["g" /* check */])(props, utils["n" /* is */].object, Object(utils["h" /* createSetContextWarning */])('sagaMiddleware', props));
    utils["s" /* object */].assign(context, props);
  };

  return sagaMiddleware;
}
// EXTERNAL MODULE: ./node_modules/redux-saga/es/internal/sagaHelpers/index.js + 4 modules
var sagaHelpers = __webpack_require__(58);

// CONCATENATED MODULE: ./node_modules/redux-saga/es/utils.js



// CONCATENATED MODULE: ./node_modules/redux-saga/es/index.js

/* harmony default export */ var es = (sagaMiddlewareFactory);












// EXTERNAL MODULE: external {"var":"wp.data","root":["wp","data"]}
var external_var_wp_data_root_wp_data_ = __webpack_require__(68);

// EXTERNAL MODULE: ./node_modules/whatwg-fetch/fetch.js
var whatwg_fetch_fetch = __webpack_require__(565);

// EXTERNAL MODULE: external "tribe.events.data"
var external_tribe_events_data_ = __webpack_require__(27);

// EXTERNAL MODULE: external "tribe.common.utils"
var external_tribe_common_utils_ = __webpack_require__(17);

// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/types.js
var types = __webpack_require__(25);

// EXTERNAL MODULE: ./src/modules/data/blocks/recurring/selectors.js
var selectors = __webpack_require__(52);

// CONCATENATED MODULE: ./src/modules/data/status/sagas.js




var _NOTICES;

var _marked = /*#__PURE__*/regenerator_default.a.mark(fetchStatus),
    _marked2 = /*#__PURE__*/regenerator_default.a.mark(pollUntilSeriesCompleted),
    _marked3 = /*#__PURE__*/regenerator_default.a.mark(actionTaker),
    _marked4 = /*#__PURE__*/regenerator_default.a.mark(showEditingAllSeriesPrompt),
    _marked5 = /*#__PURE__*/regenerator_default.a.mark(watchers);

/* eslint-disable max-len, camelcase */
/**
 * External dependencies
 */









/**
 * Internal dependencies
 */





//
// ─── NOTICES ─────────────────────────────────────────────────────────────────────
//
var NOTICE_EDITING_SERIES = 'NOTICE_EDITING_SERIES';
var NOTICE_PROGRESS_ON_SERIES_CREATION_COUNT = 'NOTICE_PROGRESS_ON_SERIES_CREATION_COUNT';
var NOTICE_PROGRESS_ON_SERIES_CREATION = 'NOTICE_PROGRESS_ON_SERIES_CREATION';
var NOTICES = (_NOTICES = {}, defineProperty_default()(_NOTICES, NOTICE_EDITING_SERIES, Object(external_var_wp_i18n_root_wp_i18n_["__"])('You are currently editing all events in a recurring series.', 'tribe-events-calendar-pro')), defineProperty_default()(_NOTICES, NOTICE_PROGRESS_ON_SERIES_CREATION_COUNT, Object(external_var_wp_i18n_root_wp_i18n_["_n"])('%d instance', '%d instances', 1, 'tribe-events-calendar-pro')), defineProperty_default()(_NOTICES, NOTICE_PROGRESS_ON_SERIES_CREATION, Object(external_var_wp_i18n_root_wp_i18n_["__"])('of this event have been created through %s.', 'tribe-events-calendar-pro')), _NOTICES);

/**
 * Fetches current series queue status
 *
 * @export
 * @returns {Object|Boolean} JSON status or false when no series being edited
 */
function fetchStatus() {
	var payload, postId, response;
	return regenerator_default.a.wrap(function fetchStatus$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.prev = 0;
					payload = new FormData();
					postId = Object(external_var_wp_data_root_wp_data_["select"])('core/editor').getCurrentPostId();

					if (postId) {
						_context.next = 5;
						break;
					}

					throw 'No post ID';

				case 5:
					_context.next = 7;
					return Object(es_effects["b" /* call */])([payload, 'append'], 'action', 'gutenberg_events_pro_recurrence_queue');

				case 7:
					_context.next = 9;
					return Object(es_effects["b" /* call */])([payload, 'append'], 'recurrence_queue_status_nonce', external_tribe_common_utils_["globals"].restNonce().queue_status_nonce);

				case 9:
					_context.next = 11;
					return Object(es_effects["b" /* call */])([payload, 'append'], 'post_id', postId);

				case 11:
					_context.next = 13;
					return Object(es_effects["b" /* call */])(fetch, window.ajaxurl, {
						method: 'POST',
						credentials: 'same-origin',
						body: payload
					});

				case 13:
					response = _context.sent;
					_context.next = 16;
					return Object(es_effects["b" /* call */])([response, 'json']);

				case 16:
					return _context.abrupt('return', _context.sent);

				case 19:
					_context.prev = 19;
					_context.t0 = _context['catch'](0);

					// TODO: Better error handling
					console.error(_context.t0);
					return _context.abrupt('return', false);

				case 23:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked, this, [[0, 19]]);
}

/**
 * Polls series status until series is completed
 *
 * @export
 */
function pollUntilSeriesCompleted() {
	var response, isCompleted, payload, items_created, last_created_at, done, percentage, date;
	return regenerator_default.a.wrap(function pollUntilSeriesCompleted$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return Object(es_effects["e" /* put */])(external_tribe_events_data_["blocks"].datetime.actions.disableEdits());

				case 2:
					if (false) {}

					_context2.next = 5;
					return Object(es_effects["b" /* call */])(fetchStatus);

				case 5:
					response = _context2.sent;
					isCompleted = response === false || response.done; // If false, no edits being done

					if (!isCompleted) {
						_context2.next = 18;
						break;
					}

					payload = response === false ? { done: isCompleted } : response;
					_context2.next = 11;
					return Object(es_effects["e" /* put */])(actions_setSeriesQueueStatus(payload));

				case 11:
					items_created = response.items_created, last_created_at = response.last_created_at, done = response.done, percentage = response.percentage;

					// Show progress notice

					if (!(done && 100 === percentage)) {
						_context2.next = 16;
						break;
					}

					date = external_tribe_common_utils_["moment"].toDate(external_tribe_common_utils_["moment"].toMoment(last_created_at));
					_context2.next = 16;
					return Object(es_effects["b" /* call */])([Object(external_var_wp_data_root_wp_data_["dispatch"])('core/notices'), 'createSuccessNotice'], Object(external_var_wp_i18n_root_wp_i18n_["sprintf"])(Object(external_var_wp_i18n_root_wp_i18n_["_n"])('%d instance', '%d instances', items_created, 'events-gutenberg'), items_created) + ' ' + Object(external_var_wp_i18n_root_wp_i18n_["sprintf"])(NOTICES[NOTICE_PROGRESS_ON_SERIES_CREATION], date), { id: NOTICE_PROGRESS_ON_SERIES_CREATION, isDismissible: true });

				case 16:
					_context2.next = 22;
					break;

				case 18:
					_context2.next = 20;
					return Object(es_effects["e" /* put */])(actions_setSeriesQueueStatus(response));

				case 20:
					_context2.next = 22;
					return Object(es_effects["b" /* call */])([Object(external_var_wp_data_root_wp_data_["dispatch"])('core/notices'), 'createSuccessNotice'], Object(external_var_wp_i18n_root_wp_i18n_["__"])('Recurring event instances are still being created...', 'events-gutenberg'), { id: NOTICE_PROGRESS_ON_SERIES_CREATION, isDismissible: true });

				case 22:
					_context2.next = 24;
					return Object(es_effects["g" /* select */])(selectors_isCompleted);

				case 24:
					if (!_context2.sent) {
						_context2.next = 28;
						break;
					}

					_context2.next = 27;
					return Object(es_effects["e" /* put */])(external_tribe_events_data_["blocks"].datetime.actions.allowEdits());

				case 27:
					return _context2.abrupt('break', 32);

				case 28:
					_context2.next = 30;
					return Object(es_effects["b" /* call */])(utils["j" /* delay */], 1000);

				case 30:
					_context2.next = 2;
					break;

				case 32:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked2, this);
}

/**
 * Creates event channel subscribing to WP editor state
 *
 * @returns {Function} Channel
 */
function createWPEditorChannel() {
	return Object(internal_channel["c" /* eventChannel */])(function (emit) {
		var editor = Object(external_var_wp_data_root_wp_data_["select"])('core/editor');

		var predicates = [function () {
			return editor.isSavingPost() && !editor.isAutosavingPost();
		}, editor.isPublishingPost];

		// Returns unsubscribe function
		return Object(external_var_wp_data_root_wp_data_["subscribe"])(function () {
			// Only emit when truthy
			if (some_default()(predicates, function (fn) {
				return fn();
			})) {
				emit(true); // Emitted value is insignificant here, but cannot be left undefined
			}
		});
	});
}

/**
 * Only used to get around redux saga bug when using channels and actions `takes` together
 *
 * @export
 */
function actionTaker() {
	return regenerator_default.a.wrap(function actionTaker$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					_context3.next = 2;
					return Object(es_effects["h" /* take */])([types["SYNC_RULES_FROM_DB"]]);

				case 2:
				case 'end':
					return _context3.stop();
			}
		}
	}, _marked3, this);
}

/**
 * Show edit all prompt
 *
 * @export
 */
function showEditingAllSeriesPrompt() {
	var isRecurring, isEditingAll;
	return regenerator_default.a.wrap(function showEditingAllSeriesPrompt$(_context4) {
		while (1) {
			switch (_context4.prev = _context4.next) {
				case 0:
					_context4.next = 2;
					return Object(es_effects["h" /* take */])([types["SYNC_RULES_FROM_DB"]]);

				case 2:
					_context4.next = 4;
					return Object(es_effects["g" /* select */])(selectors["hasRules"]);

				case 4:
					isRecurring = _context4.sent;
					_context4.next = 7;
					return Object(es_effects["b" /* call */])([/action=edit/, 'test'], window.location.search);

				case 7:
					isEditingAll = _context4.sent;

					if (!(isRecurring && isEditingAll)) {
						_context4.next = 11;
						break;
					}

					_context4.next = 11;
					return Object(es_effects["b" /* call */])([Object(external_var_wp_data_root_wp_data_["dispatch"])('core/notices'), 'createSuccessNotice'], NOTICES[NOTICE_EDITING_SERIES], { id: NOTICE_EDITING_SERIES, isDismissible: false });

				case 11:
				case 'end':
					return _context4.stop();
			}
		}
	}, _marked4, this);
}

/**
 * Poll on actions or channel emit
 *
 * @export
 */
function watchers() {
	var channel;
	return regenerator_default.a.wrap(function watchers$(_context5) {
		while (1) {
			switch (_context5.prev = _context5.next) {
				case 0:
					_context5.next = 2;
					return Object(es_effects["d" /* fork */])(showEditingAllSeriesPrompt);

				case 2:
					_context5.next = 4;
					return Object(es_effects["b" /* call */])(createWPEditorChannel);

				case 4:
					channel = _context5.sent;

				case 5:
					if (false) {}

					_context5.next = 8;
					return Object(es_effects["f" /* race */])([Object(es_effects["h" /* take */])(channel), Object(es_effects["b" /* call */])(actionTaker)]);

				case 8:
					_context5.next = 10;
					return Object(es_effects["b" /* call */])(pollUntilSeriesCompleted);

				case 10:
					_context5.next = 5;
					break;

				case 12:
				case 'end':
					return _context5.stop();
			}
		}
	}, _marked5, this);
}
// CONCATENATED MODULE: ./src/modules/data/sagas.js
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */






/* harmony default export */ var data_sagas = (function () {
	return [sync["c" /* default */], watchers, recurring["sagas"], exception["c" /* sagas */], additional_fields["c" /* sagas */]].forEach(function (sagas) {
		return external_tribe_common_store_["store"].run(sagas);
	});
});
// CONCATENATED MODULE: ./src/modules/data/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initStore", function() { return data_initStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStore", function() { return data_getStore; });
/* concated harmony reexport blocks */__webpack_require__.d(__webpack_exports__, "blocks", function() { return blocks; });

/**
 * External dependencies
 */








var EVENTS_PRO_PLUGIN = external_tribe_common_data_plugins_["constants"].EVENTS_PRO_PLUGIN;


var data_initStore = function initStore() {
	var dispatch = external_tribe_common_store_["store"].dispatch,
	    injectReducers = external_tribe_common_store_["store"].injectReducers;

	data_sagas();

	dispatch(external_tribe_common_data_plugins_["actions"].addPlugin(EVENTS_PRO_PLUGIN));
	injectReducers(defineProperty_default()({}, EVENTS_PRO_PLUGIN, reducers));
};

var data_getStore = function getStore() {
	return external_tribe_common_store_["store"];
};



/***/ }),
/* 517 */,
/* 518 */,
/* 519 */,
/* 520 */,
/* 521 */,
/* 522 */,
/* 523 */,
/* 524 */,
/* 525 */,
/* 526 */,
/* 527 */,
/* 528 */,
/* 529 */,
/* 530 */,
/* 531 */,
/* 532 */,
/* 533 */,
/* 534 */,
/* 535 */,
/* 536 */,
/* 537 */,
/* 538 */,
/* 539 */,
/* 540 */,
/* 541 */,
/* 542 */,
/* 543 */,
/* 544 */,
/* 545 */,
/* 546 */,
/* 547 */,
/* 548 */,
/* 549 */,
/* 550 */,
/* 551 */,
/* 552 */,
/* 553 */,
/* 554 */,
/* 555 */,
/* 556 */,
/* 557 */,
/* 558 */,
/* 559 */,
/* 560 */,
/* 561 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(562);

/**
 * The base implementation of `_.some` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function baseSome(collection, predicate) {
  var result;

  baseEach(collection, function(value, index, collection) {
    result = predicate(value, index, collection);
    return !result;
  });
  return !!result;
}

module.exports = baseSome;


/***/ }),
/* 562 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(224),
    createBaseEach = __webpack_require__(563);

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;


/***/ }),
/* 563 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(60);

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;


/***/ }),
/* 564 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(102),
    isArrayLike = __webpack_require__(60),
    isIndex = __webpack_require__(101),
    isObject = __webpack_require__(46);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),
/* 565 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ })
/******/ ]);
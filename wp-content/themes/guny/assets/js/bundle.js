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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var arrayEach = __webpack_require__(17),
    baseEach = __webpack_require__(18),
    castFunction = __webpack_require__(42),
    isArray = __webpack_require__(9);

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(6),
    getRawTag = __webpack_require__(27),
    objectToString = __webpack_require__(28);

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
/* 3 */
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
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(7);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(5);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
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
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(40),
    isLength = __webpack_require__(11);

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4),
    now = __webpack_require__(49),
    toNumber = __webpack_require__(50);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Utility module to get value of a data attribute
* @param {object} elem - DOM node attribute is retrieved from
* @param {string} attr - Attribute name (do not include the 'data-' part)
* @return {mixed} - Value of element's data attribute
*/
/* harmony default export */ __webpack_exports__["a"] = (function (elem, attr) {
  if (typeof elem.dataset === 'undefined') {
    return elem.getAttribute('data-' + attr);
  }
  return elem.dataset[attr];
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_accordion_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_simpleAccordion_js__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_offcanvas_js__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_overlay_js__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_stickNav_js__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_sectionHighlighter_js__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_staticColumn_js__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__modules_alert_js__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modules_bsdtools_signup_js__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__modules_formEffects_js__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__modules_facets_js__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__modules_owlSettings_js__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__modules_iOS7Hack_js__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__modules_share_form_js__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__modules_captchaResize_js__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__modules_rotatingTextAnimation_js__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__modules_search_js__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__modules_toggleOpen_js__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__modules_toggleMenu_js__ = __webpack_require__(78);

















/* eslint-disable no-unused-vars */


/* eslint-enable no-unused-vars */

function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

function init() {
  Object(__WEBPACK_IMPORTED_MODULE_17__modules_toggleOpen_js__["a" /* default */])('is-open');
  Object(__WEBPACK_IMPORTED_MODULE_7__modules_alert_js__["a" /* default */])('is-open');
  Object(__WEBPACK_IMPORTED_MODULE_2__modules_offcanvas_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_0__modules_accordion_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_1__modules_simpleAccordion_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_3__modules_overlay_js__["a" /* default */])();

  // FacetWP pages
  Object(__WEBPACK_IMPORTED_MODULE_10__modules_facets_js__["a" /* default */])();

  // Homepage
  Object(__WEBPACK_IMPORTED_MODULE_6__modules_staticColumn_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_4__modules_stickNav_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_8__modules_bsdtools_signup_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_9__modules_formEffects_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_11__modules_owlSettings_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_12__modules_iOS7Hack_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_14__modules_captchaResize_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_15__modules_rotatingTextAnimation_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_5__modules_sectionHighlighter_js__["a" /* default */])();

  // Search
  new __WEBPACK_IMPORTED_MODULE_16__modules_search_js__["a" /* default */]().init();
}

ready(init);

// Make certain functions available globally
window.accordion = __WEBPACK_IMPORTED_MODULE_0__modules_accordion_js__["a" /* default */];

(function (window, $) {
  'use strict';
  // Initialize share by email/sms forms.

  $('.' + __WEBPACK_IMPORTED_MODULE_13__modules_share_form_js__["a" /* default */].CssClass.FORM).each(function (i, el) {
    var shareForm = new __WEBPACK_IMPORTED_MODULE_13__modules_share_form_js__["a" /* default */](el);
    shareForm.init();
  });
})(window, jQuery);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_forEach__);
/**
 * Accordion module
 * @module modules/accordion
 */



/* harmony default export */ __webpack_exports__["a"] = (function () {
  /**
   * Convert accordion heading to a button
   * @param {object} $headerElem - jQuery object containing original header
   * @return {object} New heading element
   */
  function convertHeaderToButton($headerElem) {
    if ($headerElem.get(0).nodeName.toLowerCase() === 'button') {
      return $headerElem;
    }
    var headerElem = $headerElem.get(0);
    var newHeaderElem = document.createElement('button');
    __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default()(headerElem.attributes, function (attr) {
      newHeaderElem.setAttribute(attr.nodeName, attr.nodeValue);
    });
    newHeaderElem.setAttribute('type', 'button');
    var $newHeaderElem = $(newHeaderElem);
    $newHeaderElem.html($headerElem.html());
    $newHeaderElem.append('<svg class="o-accordion__caret icon" aria-hidden="true"><use xlink:href="#icon-caret-down"></use></svg>');
    return $newHeaderElem;
  }

  /**
   * Toggle visibility attributes for header
   * @param {object} $headerElem - The accordion header jQuery object
   * @param {boolean} makeVisible - Whether the header's content should be visible
   */
  function toggleHeader($headerElem, makeVisible) {
    $headerElem.attr('aria-expanded', makeVisible);
  }

  /**
   * Add attributes, classes, and event binding to accordion header
   * @param {object} $headerElem - The accordion header jQuery object
   * @param {object} $relatedPanel - The panel the accordion header controls
   */
  function initializeHeader($headerElem, $relatedPanel) {
    $headerElem.attr({
      'aria-selected': false,
      'aria-controls': $relatedPanel.get(0).id,
      'aria-expanded': false,
      'role': 'heading'
    }).addClass('o-accordion__header');

    $headerElem.on('click.accordion', function (event) {
      event.preventDefault();
      $headerElem.trigger('changeState');
    });

    $headerElem.on('mouseleave.accordion', function () {
      $headerElem.blur();
    });
  }

  /**
   * Toggle visibility attributes for panel
   * @param {object} $panelElem - The accordion panel jQuery object
   * @param {boolean} makeVisible - Whether the panel should be visible
   */
  function togglePanel($panelElem, makeVisible) {
    $panelElem.attr('aria-hidden', !makeVisible);
    if (makeVisible) {
      $panelElem.css('height', $panelElem.data('height') + 'px');
      $panelElem.find('a, button, [tabindex]').attr('tabindex', 0);
    } else {
      $panelElem.css('height', '');
      $panelElem.find('a, button, [tabindex]').attr('tabindex', -1);
    }
  }

  /**
   * Add CSS classes to accordion panels
   * @param {object} $panelElem - The accordion panel jQuery object
   * @param {string} labelledby - ID of element (accordion header) that labels panel
   */
  function initializePanel($panelElem, labelledby) {
    $panelElem.addClass('o-accordion__content');
    calculatePanelHeight($panelElem);
    $panelElem.attr({
      'aria-hidden': true,
      'role': 'region',
      'aria-labelledby': labelledby
    });
  }

  /**
   * Set accordion panel height
   * @param {object} $panelElem - The accordion panel jQuery object
   */
  function calculatePanelHeight($panelElem) {
    $panelElem.data('height', $panelElem.height());
  }

  /**
   * Toggle state for accordion children
   * @param {object} $item - The accordion item jQuery object
   * @param {boolean} makeVisible - Whether to make the accordion content visible
   */
  function toggleAccordionItem($item, makeVisible) {
    if (makeVisible) {
      $item.addClass('is-expanded');
      $item.removeClass('is-collapsed');
    } else {
      $item.removeClass('is-expanded');
      $item.addClass('is-collapsed');
    }
  }

  /**
   * Add CSS classes to accordion children
   * @param {object} $item - The accordion child jQuery object
   */
  function initializeAccordionItem($item) {
    var $accordionContent = $item.find('.js-accordion__content');
    var $accordionInitialHeader = $item.find('.js-accordion__header');
    // Clear any previously bound events
    $item.off('toggle.accordion');
    // Clear any existing state classes
    $item.removeClass('is-expanded is-collapsed');
    if ($accordionContent.length && $accordionInitialHeader.length) {
      $item.addClass('o-accordion__item');
      var $accordionHeader = void 0;
      if ($accordionInitialHeader.get(0).tagName.toLowerCase() === 'button') {
        $accordionHeader = $accordionInitialHeader;
        calculatePanelHeight($accordionContent);
      } else {
        $accordionHeader = convertHeaderToButton($accordionInitialHeader);
        $accordionInitialHeader.replaceWith($accordionHeader);
        initializeHeader($accordionHeader, $accordionContent);
        initializePanel($accordionContent, $accordionHeader.get(0).id);
      }

      /**
       * Custom event handler to toggle the accordion item open/closed
       * @function
       * @param {object} event - The event object
       * @param {boolean} makeVisible - Whether to make the accordion content visible
       */
      $item.on('toggle.accordion', function (event, makeVisible) {
        event.preventDefault();
        toggleAccordionItem($item, makeVisible);
        toggleHeader($accordionHeader, makeVisible);
        togglePanel($accordionContent, makeVisible);
      });

      // Collapse panels initially
      $item.trigger('toggle.accordion', [false]);
    }
  }

  /**
   * Add the ARIA attributes and CSS classes to the root accordion elements.
   * @param {object} $accordionElem - The jQuery object containing the root element of the accordion
   * @param {boolean} multiSelectable - Whether multiple accordion drawers can be open at the same time
   */
  function initialize($accordionElem, multiSelectable) {
    $accordionElem.attr({
      'role': 'presentation',
      'aria-multiselectable': multiSelectable
    }).addClass('o-accordion');
    $accordionElem.children().each(function () {
      initializeAccordionItem($(this));
    });
    /**
     * Handle changeState events on accordion headers.
     * Close the open accordion item and open the new one.
     * @function
     * @param {object} event - The event object
     */
    $accordionElem.on('changeState.accordion', '.js-accordion__header', $.proxy(function (event) {
      var $newItem = $(event.target).closest('.o-accordion__item');
      if (multiSelectable) {
        $newItem.trigger('toggle.accordion', [!$newItem.hasClass('is-expanded')]);
      } else {
        var $openItem = $accordionElem.find('.is-expanded');
        $openItem.trigger('toggle.accordion', [false]);
        if ($openItem.get(0) !== $newItem.get(0)) {
          $newItem.trigger('toggle.accordion', [true]);
        }
      }
    }, this));
  }

  /**
   * Reinitialize an accordion after its contents were dynamically updated
   * @param {object} $accordionElem - The jQuery object containing the root element of the accordion
   */
  function reInitialize($accordionElem) {
    if ($accordionElem.hasClass('o-accordion')) {
      $accordionElem.children().each(function () {
        initializeAccordionItem($(this));
      });
    } else {
      var multiSelectable = $accordionElem.data('multiselectable') || false;
      initialize($accordionElem, multiSelectable);
    }
  }
  window.reInitializeAccordion = reInitialize;

  var $accordions = $('.js-accordion').not('.o-accordion');
  if ($accordions.length) {
    $accordions.each(function () {
      var multiSelectable = $(this).data('multiselectable') || false;
      initialize($(this), multiSelectable);

      /**
       * Handle fontsActive events fired once Typekit reports that the fonts are active.
       * @see base.twig for the Typekit.load() function
       * @function
       */
      $(this).on('fontsActive', $.proxy(function () {
        reInitialize($(this));
      }, this));
    });
  }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(19),
    createBaseEach = __webpack_require__(41);

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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var baseFor = __webpack_require__(20),
    keys = __webpack_require__(22);

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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(21);

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
/* 21 */
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(23),
    baseKeys = __webpack_require__(36),
    isArrayLike = __webpack_require__(12);

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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(24),
    isArguments = __webpack_require__(25),
    isArray = __webpack_require__(9),
    isBuffer = __webpack_require__(29),
    isIndex = __webpack_require__(31),
    isTypedArray = __webpack_require__(32);

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
/* 24 */
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(26),
    isObjectLike = __webpack_require__(3);

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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(2),
    isObjectLike = __webpack_require__(3);

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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(6);

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
/* 28 */
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(5),
    stubFalse = __webpack_require__(30);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 30 */
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
/* 31 */
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
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(33),
    baseUnary = __webpack_require__(34),
    nodeUtil = __webpack_require__(35);

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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(2),
    isLength = __webpack_require__(11),
    isObjectLike = __webpack_require__(3);

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
/* 34 */
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(7);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(37),
    nativeKeys = __webpack_require__(38);

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
/* 37 */
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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(39);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 39 */
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
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(2),
    isObject = __webpack_require__(4);

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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(12);

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
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(43);

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;


/***/ }),
/* 43 */
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
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/**
* Simple accordion module
* @module modules/simpleAccordion
* @see https://perishablepress.com/jquery-accordion-menu-tutorial/
*/
/* harmony default export */ __webpack_exports__["a"] = (function () {
  //$('.js-accordion > ul > li:has(ol)').addClass("has-sub");
  $('.js-s-accordion > li > h3.js-s-accordion__header').append('<svg class="o-accordion__caret icon" aria-hidden="true"><use xlink:href="#icon-caret-down"></use></svg>');

  $('.js-s-accordion > li > h3.js-s-accordion__header').click(function () {
    var checkElement = $(this).next();

    $('.js-s-accordion li').removeClass('is-expanded');
    $(this).closest('li').addClass('is-expanded');

    if (checkElement.is('.js-s-accordion__content') && checkElement.is(':visible')) {
      $(this).closest('li').removeClass('is-expanded');
      checkElement.slideUp('normal');
    }

    if (checkElement.is('.js-s-accordion__content') && !checkElement.is(':visible')) {
      $('.js-s-accordion .js-s-accordion__content:visible').slideUp('normal');
      checkElement.slideDown('normal');
    }

    if (checkElement.is('.js-s-accordion__content')) {
      return false;
    }

    return true;
  });
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_forEach__);
/**
 * Offcanvas module
 * @module modules/offcanvas
 * @see modules/toggleOpen
 */



/**
 * Shift keyboard focus when the offcanvas nav is open.
 * The 'changeOpenState' event is fired by modules/toggleOpen
 */
/* harmony default export */ __webpack_exports__["a"] = (function () {
  var offCanvas = document.querySelectorAll('.js-offcanvas');
  if (offCanvas) {
    __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default()(offCanvas, function (offCanvasElem) {
      var offCanvasSide = offCanvasElem.querySelector('.js-offcanvas__side');

      /**
      * Add event listener for 'changeOpenState'.
      * The value of event.detail indicates whether the open state is true
      * (i.e. the offcanvas content is visible).
      * @function
      * @param {object} event - The event object
      */
      offCanvasElem.addEventListener('changeOpenState', function (event) {
        if (event.detail) {
          if (!/^(?:a|select|input|button|textarea)$/i.test(offCanvasSide.tagName)) {
            offCanvasSide.tabIndex = -1;
          }
          offCanvasSide.focus();
        }
      }, false);
    });
  }
});

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_forEach__);
/**
 * Overlay module
 * @module modules/overlay
 */



/**
 * Shift keyboard focus when the search overlay is open.
 * The 'changeOpenState' event is fired by modules/toggleOpen
 */
/* harmony default export */ __webpack_exports__["a"] = (function () {
  var overlay = document.querySelectorAll('.js-overlay');
  if (overlay) {
    __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default()(overlay, function (overlayElem) {
      /**
      * Add event listener for 'changeOpenState'.
      * The value of event.detail indicates whether the open state is true
      * (i.e. the overlay is visible).
      * @function
      * @param {object} event - The event object
      */
      overlayElem.addEventListener('changeOpenState', function (event) {
        if (event.detail) {
          if (!/^(?:a|select|input|button|textarea)$/i.test(overlay.tagName)) {
            overlay.tabIndex = -1;
          }

          if (document.querySelectorAll('.js-overlay input')) {
            document.querySelectorAll('.js-overlay input')[0].focus();
          } else {
            overlay.focus();
          }
        }
      }, false);
    });
  }
});

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_throttle__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_throttle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_throttle__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_debounce__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_debounce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_debounce__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_imagesready_dist_imagesready_js__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_imagesready_dist_imagesready_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_imagesready_dist_imagesready_js__);
/**
* Stick Nav module
* @module modules/stickyNav
*/





/**
* "Stick" content in place as the user scrolls
* @param {object} $elem - jQuery element that should be sticky
* @param {object} $elemContainer - jQuery element for the element's container. Used to set the top and bottom points
* @param {object} $elemArticle - Content next to the sticky nav
*/
function stickyNav($elem, $elemContainer, $elemArticle) {
  // Module settings
  var settings = {
    stickyClass: 'is-sticky',
    absoluteClass: 'is-stuck',
    largeBreakpoint: '1024px',
    articleClass: 'o-article--shift'
  };

  // Globals
  var stickyMode = false; // Flag to tell if sidebar is in "sticky mode"
  var isSticky = false; // Whether the sidebar is sticky at this exact moment in time
  var isAbsolute = false; // Whether the sidebar is absolutely positioned at the bottom
  var switchPoint = 0; // Point at which to switch to sticky mode
  /* eslint-disable no-unused-vars */
  var switchPointBottom = 0; // Point at which to "freeze" the sidebar so it doesn't overlap the footer
  /* eslint-enable no-unused-vars */
  var leftOffset = 0; // Amount sidebar should be set from the left side
  var elemWidth = 0; // Width in pixels of sidebar
  /* eslint-disable no-unused-vars */
  var elemHeight = 0; // Height in pixels of sidebar
  /* eslint-enable no-unused-vars */

  /**
  * Toggle the sticky behavior
  *
  * Turns on if the user has scrolled past the switch point, off if they scroll back up
  * If sticky mode is on, sets the left offset as well
  */
  function toggleSticky() {
    var currentScrollPos = $(window).scrollTop();

    if (currentScrollPos > switchPoint) {
      // Check if the sidebar is already sticky
      if (!isSticky) {
        isSticky = true;
        isAbsolute = false;
        $elem.addClass(settings.stickyClass).removeClass(settings.absoluteClass);
        $elemArticle.addClass(settings.articleClass);
        updateDimensions();
      }

      // Check if the sidebar has reached the bottom switch point
      if ($('.c-footer__reached').isOnScreen()) {
        isSticky = false;
        isAbsolute = true;
        $elem.addClass(settings.absoluteClass);
        updateDimensions();
      }
    } else if (isSticky || isAbsolute) {
      isSticky = false;
      isAbsolute = false;
      $elem.removeClass(settings.stickyClass + ' ' + settings.absoluteClass);
      $elemArticle.removeClass(settings.articleClass);
      updateDimensions();
    }
  }

  /**
  * Update dimensions on sidebar
  *
  * Set to the current values of leftOffset and elemWidth if the element is
  * currently sticky. Otherwise, clear any previously set values
  *
  * @param {boolean} forceClear - Flag to clear set values regardless of sticky status
  */
  function updateDimensions(forceClear) {
    if (isSticky && !forceClear) {
      $elem.css({
        left: leftOffset + 'px',
        width: elemWidth + 'px',
        top: '',
        bottom: ''
      });
    } else if (isAbsolute && !forceClear) {
      $elem.css({
        left: $elemContainer.css('padding-left'),
        width: elemWidth + 'px',
        top: 'auto',
        bottom: $elemContainer.css('padding-bottom')
      });
    } else {
      $elem.css({
        left: '',
        width: '',
        top: '',
        bottom: ''
      });
    }
  }

  /**
  * Set the switchpoint for the element and get its current offsets
  */
  function setOffsetValues() {
    $elem.css('visibility', 'hidden');
    if (isSticky || isAbsolute) {
      $elem.removeClass(settings.stickyClass + ' ' + settings.absoluteClass);
      $elemArticle.removeClass(settings.articleClass);
    }
    updateDimensions(true);

    switchPoint = $elem.offset().top;
    // Bottom switch point is equal to the offset and height of the outer container, minus any padding on the bottom
    switchPointBottom = $elemContainer.offset().top + $elemContainer.outerHeight() - parseInt($elemContainer.css('padding-bottom'), 10);

    leftOffset = $elem.offset().left;
    elemWidth = $elem.outerWidth();
    elemHeight = $elem.outerHeight();

    if (isSticky || isAbsolute) {
      updateDimensions();
      $elem.addClass(settings.stickyClass);
      $elemArticle.addClass(settings.articleClass);
      if (isAbsolute) {
        $elem.addClass(settings.absoluteClass);
      }
    }
    $elem.css('visibility', '');
  }

  /**
  * Turn on "sticky mode"
  *
  * Watch for scroll and fix the sidebar. Watch for sizes changes on #main
  * (which may change if parallax is used) and adjust accordingly.
  */
  function stickyModeOn() {
    stickyMode = true;

    $(window).on('scroll.fixedSidebar', __WEBPACK_IMPORTED_MODULE_0_lodash_throttle___default()(function () {
      toggleSticky();
    }, 100)).trigger('scroll.fixedSidebar');

    $('#main').on('containerSizeChange.fixedSidebar', function (event) {
      switchPoint -= event.originalEvent.detail;
    });
  }

  /**
  * Turn off "sticky mode"
  *
  * Remove the event binding and reset everything
  */
  function stickyModeOff() {
    if (isSticky) {
      updateDimensions(true);
      $elem.removeClass(settings.stickyClass);
    }
    $(window).off('scroll.fixedSidebar');
    $('#main').off('containerSizeChange.fixedSidebar');
    stickyMode = false;
  }

  /**
  * Handle 'resize' event
  *
  * Turn sticky mode on/off depending on whether we're in desktop mode
  * @param {boolean} stickyMode - Whether sidebar should be considered sticky
  */
  function onResize() {
    var largeMode = window.matchMedia('(min-width: ' + settings.largeBreakpoint + ')').matches;
    if (largeMode) {
      setOffsetValues();
      if (!stickyMode) {
        stickyModeOn();
      }
    } else if (stickyMode) {
      stickyModeOff();
    }
  }

  /**
  * Initialize the sticky nav
  * @param {object} elem - DOM element that should be sticky
  * @param {object} options - Options. Will override module defaults when present
  */
  function initialize() {
    $(window).on('resize.fixedSidebar', __WEBPACK_IMPORTED_MODULE_1_lodash_debounce___default()(function () {
      onResize();
    }, 100));

    __WEBPACK_IMPORTED_MODULE_2_imagesready_dist_imagesready_js___default()(document.body).then(function () {
      onResize();
    });
  }

  initialize();

  $.fn.isOnScreen = function () {
    var win = $(window);

    var viewport = {
      top: win.scrollTop(),
      left: win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom);
  };
}

/* harmony default export */ __webpack_exports__["a"] = (function () {
  var $stickyNavs = $('.js-sticky');
  if ($stickyNavs.length) {
    $stickyNavs.each(function () {
      var $outerContainer = $(this).closest('.js-sticky-container');
      var $article = $outerContainer.find('.js-sticky-article');
      stickyNav($(this), $outerContainer, $article);
    });
  }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var debounce = __webpack_require__(13),
    isObject = __webpack_require__(4);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(5);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4),
    isSymbol = __webpack_require__(51);

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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(2),
    isObjectLike = __webpack_require__(3);

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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* imagesready v0.2.2 - 2015-07-04T06:22:14.435Z - https://github.com/r-park/images-ready */
;(function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.imagesReady = factory();
  }
}(this, function() {
"use strict";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
//module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
var BrowserMutationObserver = window.MutationObserver || window.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

'use strict';

//var asap = require('asap/raw');
var asap = rawAsap;

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

//module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('not a function');
  }
  this._41 = 0;
  this._86 = null;
  this._17 = [];
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._1 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
};
function handle(self, deferred) {
  while (self._41 === 3) {
    self = self._86;
  }
  if (self._41 === 0) {
    self._17.push(deferred);
    return;
  }
  asap(function() {
    var cb = self._41 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._41 === 1) {
        resolve(deferred.promise, self._86);
      } else {
        reject(deferred.promise, self._86);
      }
      return;
    }
    var ret = tryCallOne(cb, self._86);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._41 = 3;
      self._86 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._41 = 1;
  self._86 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._41 = 2;
  self._86 = newValue;
  finale(self);
}
function finale(self) {
  for (var i = 0; i < self._17.length; i++) {
    handle(self, self._17[i]);
  }
  self._17 = null;
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  })
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}

'use strict';


/**
 * @name ImagesReady
 * @constructor
 *
 * @param {DocumentFragment|Element|Element[]|jQuery|NodeList|string} elements
 * @param {boolean} jquery
 *
 */
function ImagesReady(elements, jquery) {
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
    if (!elements.length) {
      throw new Error('selector `' + elements + '` yielded 0 elements');
    }
  }

  var deferred = defer(jquery);
  this.result = deferred.promise;

  var images = this.imageElements(
    this.validElements(this.toArray(elements), ImagesReady.VALID_NODE_TYPES)
  );

  var imageCount = images.length;

  if (imageCount) {
    this.verify(images, status(imageCount, function(ready){
      if (ready) {
        deferred.resolve(elements);
      }
      else {
        deferred.reject(elements);
      }
    }));
  }
  else {
    deferred.resolve(elements);
  }
}


ImagesReady.VALID_NODE_TYPES = {
  1  : true, // ELEMENT_NODE
  9  : true, // DOCUMENT_NODE
  11 : true  // DOCUMENT_FRAGMENT_NODE
};


ImagesReady.prototype = {

  /**
   * @param {Element[]} elements
   * @returns {[]|HTMLImageElement[]}
   */
  imageElements : function(elements) {
    var images = [];

    elements.forEach(function(element){
      if (element.nodeName === 'IMG') {
        images.push(element);
      }
      else {
        var imageElements = element.querySelectorAll('img');
        if (imageElements.length) {
          images.push.apply(images, imageElements);
        }
      }
    });

    return images;
  },


  /**
   * @param {Element[]} elements
   * @param {{}} validNodeTypes
   * @returns {[]|Element[]}
   */
  validElements : function(elements, validNodeTypes) {
    return elements.filter(function(element){
      return validNodeTypes[element.nodeType];
    });
  },


  /**
   * @param {HTMLImageElement[]} images
   * @returns {[]|HTMLImageElement[]}
   */
  incompleteImages : function(images) {
    return images.filter(function(image){
      return !(image.complete && image.naturalWidth);
    });
  },


  /**
   * @param {function} onload
   * @param {function} onerror
   * @returns {function(HTMLImageElement)}
   */
  proxyImage : function(onload, onerror) {
    return function(image) {
      var _image = new Image();

      _image.addEventListener('load', onload);
      _image.addEventListener('error', onerror);
      _image.src = image.src;

      return _image;
    };
  },


  /**
   * @param {HTMLImageElement[]} images
   * @param {{failed: function, loaded: function}} status
   */
  verify : function(images, status) {
    var incomplete = this.incompleteImages(images);

    if (images.length > incomplete.length) {
      status.loaded(images.length - incomplete.length);
    }

    if (incomplete.length) {
      incomplete.forEach(this.proxyImage(
        function(){
          status.loaded(1);
        },
        function(){
          status.failed(1);
        }
      ));
    }
  },


  /**
   * @param {DocumentFragment|Element|Element[]|jQuery|NodeList} object
   * @returns {Element[]}
   */
  toArray : function(object) {
    if (Array.isArray(object)) {
      return object;
    }

    if (typeof object.length === 'number') {
      return [].slice.call(object);
    }

    return [object];
  }

};


/**
 * @param jquery
 * @returns deferred
 */
function defer(jquery) {
  var deferred;

  if (jquery) {
    deferred = new $.Deferred();
    deferred.promise = deferred.promise();
  }
  else {
    deferred = {};
    deferred.promise = new Promise(function(resolve, reject){
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
  }

  return deferred;
}


/**
 * @param {number} imageCount
 * @param {function} done
 * @returns {{failed: function, loaded: function}}
 */
function status(imageCount, done) {
  var loaded = 0,
      total = imageCount,
      verified = 0;

  function update() {
    if (total === verified) {
      done(total === loaded);
    }
  }

  return {

    /**
     * @param {number} count
     */
    failed : function(count) {
      verified += count;
      update();
    },

    /**
     * @param {number} count
     */
    loaded : function(count) {
      loaded += count;
      verified += count;
      update();
    }

  };
}



/*=========================================================
  jQuery plugin
=========================================================*/
if (window.jQuery) {
  $.fn.imagesReady = function() {
    var instance = new ImagesReady(this, true);
    return instance.result;
  };
}


/*=========================================================
  Default entry point
=========================================================*/
function imagesReady(elements) { // eslint-disable-line no-unused-vars
  var instance = new ImagesReady(elements);
  return instance.result;
}

return imagesReady;
}));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/**
* Section highlighter module
* @module modules/sectionHighlighter
* @see https://stackoverflow.com/questions/32395988/highlight-menu-item-when-scrolling-down-to-section
*/

/* harmony default export */ __webpack_exports__["a"] = (function () {
  var $navigationLinks = $('.js-section-set > li > a');
  var $sections = $("section");
  var $sectionsReversed = $($("section").get().reverse());
  var sectionIdTonavigationLink = {};
  //var eTop = $('#free-day-trips').offset().top;

  $sections.each(function () {
    sectionIdTonavigationLink[$(this).attr('id')] = $('.js-section-set > li > a[href="#' + $(this).attr('id') + '"]');
  });

  function optimized() {
    var scrollPosition = $(window).scrollTop();

    $sectionsReversed.each(function () {
      var currentSection = $(this);
      var sectionTop = currentSection.offset().top;

      // if(currentSection.is('section:first-child') && sectionTop > scrollPosition){
      //   console.log('scrollPosition', scrollPosition);
      //   console.log('sectionTop', sectionTop);
      // }

      if (scrollPosition >= sectionTop || currentSection.is('section:first-child') && sectionTop > scrollPosition) {
        var id = currentSection.attr('id');
        var $navigationLink = sectionIdTonavigationLink[id];
        if (!$navigationLink.hasClass('is-active') || !$('section').hasClass('o-content-container--compact')) {
          $navigationLinks.removeClass('is-active');
          $navigationLink.addClass('is-active');
        }
        return false;
      }
    });
  }

  optimized();
  $(window).scroll(function () {
    optimized();
  });
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_forEach__);
/**
 * Static column module
 * Similar to the general sticky module but used specifically when one column
 * of a two-column layout is meant to be sticky
 * @module modules/staticColumn
 * @see modules/stickyNav
 */



/* harmony default export */ __webpack_exports__["a"] = (function () {
  var stickyContent = document.querySelectorAll('.js-static');
  var notStickyClass = 'is-not-sticky';
  var bottomClass = 'is-bottom';

  /**
  * Calculates the window position and sets the appropriate class on the element
  * @param {object} stickyContentElem - DOM node that should be stickied
  */
  function calcWindowPos(stickyContentElem) {
    var elemTop = stickyContentElem.parentElement.getBoundingClientRect().top;
    var isPastBottom = window.innerHeight - stickyContentElem.parentElement.clientHeight - stickyContentElem.parentElement.getBoundingClientRect().top > 0;

    // Sets element to position absolute if not scrolled to yet.
    // Absolutely positioning only when necessary and not by default prevents flickering
    // when removing the "is-bottom" class on Chrome
    if (elemTop > 0) {
      stickyContentElem.classList.add(notStickyClass);
    } else {
      stickyContentElem.classList.remove(notStickyClass);
    }
    if (isPastBottom) {
      stickyContentElem.classList.add(bottomClass);
    } else {
      stickyContentElem.classList.remove(bottomClass);
    }
  }

  if (stickyContent) {
    __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default()(stickyContent, function (stickyContentElem) {
      calcWindowPos(stickyContentElem);

      /**
      * Add event listener for 'scroll'.
      * @function
      * @param {object} event - The event object
      */
      window.addEventListener('scroll', function () {
        calcWindowPos(stickyContentElem);
      }, false);

      /**
      * Add event listener for 'resize'.
      * @function
      * @param {object} event - The event object
      */
      window.addEventListener('resize', function () {
        calcWindowPos(stickyContentElem);
      }, false);
    });
  }
});

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_forEach__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__readCookie_js__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dataset_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__createCookie_js__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__getDomain_js__ = __webpack_require__(58);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Alert Banner module
 * @module modules/alert
 * @see modules/toggleOpen
 */







/**
 * Displays an alert banner.
 * @param {string} openClass - The class to toggle on if banner is visible
 */
/* harmony default export */ __webpack_exports__["a"] = (function (openClass) {
  if (!openClass) {
    openClass = 'is-open';
  }

  /**
  * Make an alert visible
  * @param {object} alert - DOM node of the alert to display
  * @param {object} siblingElem - DOM node of alert's closest sibling,
  * which gets some extra padding to make room for the alert
  */
  function displayAlert(alert, siblingElem) {
    alert.classList.add(openClass);
    var alertHeight = alert.offsetHeight;
    var currentPadding = parseInt(window.getComputedStyle(siblingElem).getPropertyValue('padding-bottom'), 10);
    siblingElem.style.paddingBottom = alertHeight + currentPadding + 'px';
  }

  /**
  * Remove extra padding from alert sibling
  * @param {object} siblingElem - DOM node of alert sibling
  */
  function removeAlertPadding(siblingElem) {
    siblingElem.style.paddingBottom = null;
  }

  /**
  * Check alert cookie
  * @param {object} alert - DOM node of the alert
  * @return {boolean} - Whether alert cookie is set
  */
  function checkAlertCookie(alert) {
    var cookieName = Object(__WEBPACK_IMPORTED_MODULE_2__dataset_js__["a" /* default */])(alert, 'cookie');
    if (!cookieName) {
      return false;
    }
    return typeof Object(__WEBPACK_IMPORTED_MODULE_1__readCookie_js__["a" /* default */])(cookieName, document.cookie) !== 'undefined';
  }

  /**
  * Add alert cookie
  * @param {object} alert - DOM node of the alert
  */
  function addAlertCookie(alert) {
    var cookieName = Object(__WEBPACK_IMPORTED_MODULE_2__dataset_js__["a" /* default */])(alert, 'cookie');
    if (cookieName) {
      Object(__WEBPACK_IMPORTED_MODULE_3__createCookie_js__["a" /* default */])(cookieName, 'dismissed', Object(__WEBPACK_IMPORTED_MODULE_4__getDomain_js__["a" /* default */])(window.location, false), 360);
    }
  }

  var alerts = document.querySelectorAll('.js-alert');
  if (alerts.length) {
    __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default()(alerts, function (alert) {
      if (!checkAlertCookie(alert)) {
        var alertSibling = alert.previousElementSibling;
        displayAlert(alert, alertSibling);

        /**
        * Add event listener for 'changeOpenState'.
        * The value of event.detail indicates whether the open state is true
        * (i.e. the alert is visible).
        * @function
        * @param {object} event - The event object
        */
        alert.addEventListener('changeOpenState', function (event) {
          // Because iOS safari inexplicably turns event.detail into an object
          if (typeof event.detail === 'boolean' && !event.detail || _typeof(event.detail) === 'object' && !event.detail.detail) {
            addAlertCookie(alert);
            removeAlertPadding(alertSibling);
          }
        });
      }
    });
  }
});

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Reads a cookie and returns the value
* @param {string} cookieName - Name of the cookie
* @param {string} cookie - Full list of cookies
* @return {string} - Value of cookie; undefined if cookie does not exist
*/
/* harmony default export */ __webpack_exports__["a"] = (function (cookieName, cookie) {
  return (RegExp("(?:^|; )" + cookieName + "=([^;]*)").exec(cookie) || []).pop();
});

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Save a cookie
* @param {string} name - Cookie name
* @param {string} value - Cookie value
* @param {string} domain - Domain on which to set cookie
* @param {integer} days - Number of days before cookie expires
*/
/* harmony default export */ __webpack_exports__["a"] = (function (name, value, domain, days) {
  var expires = days ? "; expires=" + new Date(days * 864E5 + new Date().getTime()).toGMTString() : "";
  document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;
});

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Get the domain from a URL
* @param {string} url - The URL
* @param {boolean} root - Whether to return the root domain rather than a subdomain
* @return {string} - The parsed domain
*/
/* harmony default export */ __webpack_exports__["a"] = (function (url, root) {
  function parseUrl(url) {
    var target = document.createElement('a');
    target.href = url;
    return target;
  }

  if (typeof url === 'string') {
    url = parseUrl(url);
  }
  var domain = url.hostname;
  if (root) {
    var slice = domain.match(/\.uk$/) ? -3 : -2;
    domain = domain.split(".").slice(slice).join(".");
  }
  return domain;
});

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/**
* Validate a form and submit via the signup API
*/
__webpack_require__(60);

/* harmony default export */ __webpack_exports__["a"] = (function () {
  var $signupForms = $('.bsdtools-signup');
  var errorMsg = 'Please enter your email and zip code and select at least one age group.';

  /**
  * Validate form before unpausing
  * @param {object} event - jQuery event object
  * @param {object} formData - Serialized form data
  */
  function handleValidation(event, formData) {
    var noErrors = true;
    var $form = $(this);
    $form.find('.is-error').removeClass('is-error');
    $form.find('.bsdtools-error').html('');
    var $requiredFields = $form.find('[required]');

    /**
    * Validate each field. Required fields must be non-empty and contain the
    * right type of data.
    * @function
    */
    $requiredFields.each(function () {
      var fieldName = $(this).attr('name');
      if (typeof formData[fieldName] === 'undefined') {
        noErrors = false;
        $(this).addClass('is-error');
      } else {
        var fieldType = $(this).attr('type');
        var emregex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$", "i");
        var usregex = new RegExp(/^\d{5}(-\d{4})?$/i);
        if (fieldType === 'text' && formData[fieldName].trim() === '' || fieldType === 'email' && !emregex.test(formData[fieldName]) || fieldName === 'zip' && !usregex.test(formData[fieldName]) || fieldType === 'checkbox' && !formData[fieldName].length) {
          noErrors = false;
          $(this).addClass('is-error');
        }
      }
    });
    if (noErrors) {
      // Tools expects a hidden field for _all_ checkboxes, not just checked ones
      $form.find('[type="checkbox"]').each(function (index) {
        var checkboxValue = $(this).prop('checked') ? $(this).attr('value') : '';
        var checkboxName = $(this).attr('name');
        checkboxName = checkboxName.substring(2, checkboxName.length - 2);
        $form.append('<input type="hidden" name="' + checkboxName + '[' + index + ']" value="' + checkboxValue + '">');
      });
      $form.data('isPaused', false);
      $form.trigger('submit.bsdsignup');
    } else {
      $form.find('.bsdtools-error').html('<p>' + errorMsg + '</p>');
    }
  }

  /**
  * Handle errors returned by the BSD Tools API
  * @param {object} event - jQuery event object
  * @param {object} errorJSON - Original response from the Tools, with a cached
  * jQuery reference to the form field
  */
  function handleErrors(event, errorJSON) {
    var $form = $(this);
    if (errorJSON && errorJSON.field_errors) {
      /**
      * Add error styling to the field with an error
      * @function
      * @param {integer} index - Current position in the set of errors
      * @param {object} error - Error object
      */
      $.each(errorJSON.field_errors, function (index, error) {
        error.$field.addClass('is-error');
        $form.find('.bsdtools-error').html('<p>' + error.message + '</p>');
      });
    } else {
      $form.find('.bsdtools-error').html('<p>Your signup could not be completed.</p>');
    }
  }

  /**
  * Handle success response from the BSD Tools API
  */
  function handleSuccess() {
    $(this).html('<p class="c-signup-form__success">One more step! <br /> Please check your inbox and confirm your email address to start receiving updates. <br />Thanks for signing up!</p>');
  }

  if ($signupForms.length) {
    /* eslint-disable camelcase */
    $signupForms.bsdSignup({
      no_redirect: true,
      startPaused: true
    }).on('bsd-ispaused', $.proxy(handleValidation, this)).on('bsd-error', $.proxy(handleErrors, this)).on('bsd-success', $.proxy(handleSuccess, this));
    /* eslint-enable camelcase */
  }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*lets define our scope*/
(function ($, wlocation, undefined) {

    //let's make it easy to jQuery's form array into a data object
    $.fn.serializeObject = function () {
        var o = {},
            a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var interactiveValidity = 'reportValidity' in $('<form/>').get()[0],
        //check whether the browser supports interactive validation messages
    pluginname = 'bsdSignup',
        //the plugin we plan to create
    gup = function gup(name) {
        var gupregex = new RegExp("[\\?&]" + name.replace(/(\[|\])/g, "\\$1") + "=([^&#]*)"),
            results = gupregex.exec(wlocation.href);
        return results === null ? "" : results[1];
    },
        //allow us to get url parameters
    sourceString = 'source',
        subsourceString = 'subsource',
        urlsource = gup(sourceString) || gup('fb_ref'),
        //any source we can get from the url
    urlsubsource = gup(subsourceString); //any subsource we can get from the url

    function parseURL(url) {
        var p = document.createElement('a'); //create a special DOM node for testing
        p.href = url; //stick a link into it
        //p.pathname = p.pathname.replace(/(^\/?)/,"/");//IE fix
        return p; //return the DOM node's native concept of itself, which will expand any relative links into real ones
    }

    // ideally the api returns informative errors, but in the case of failures, let's try to parse the error json, if any, and then make sure we have a standard response if all else fails
    function errorFilter(e) {
        var msg = 'No response from sever';
        if (e && e.responseJSON) {
            return e.responseJSON;
        } else {
            try {
                return $.parseJSON(e.responseText);
            } catch (error) {
                return { status: 'fail', code: 503, message: msg, error: msg };
            }
        }
    }

    function successFilter(response) {
        return !response || response.status !== "success" ? $.Deferred().rejectWith(this, [response]) : response;
    }

    // allow any changes to a field that was invalid to clear that custom Error value
    function recheckIfThisIsStillInvalid($field, field, badinput) {
        $field.one('change keyup', function () {
            if ($field.val() !== badinput) {
                field.setCustomValidity(''); //we've now cleared the custom error
            }
        });
    }

    function formSuccess(result) {
        //"this" is the jquery wrapped $form
        this.trigger('bsd-success', [result]);
        if (this.data('bsdsignup').no_redirect !== true && result.thanks_url) {
            wlocation.href = result.thanks_url;
        }
    }

    function formFailure(e) {
        //"this" is the jquery wrapped $form
        var $form = this,
            funerror = false,
            config = this.data('bsdsignup'),
            errorsAsObject = {};
        if (e && e.field_errors && e.field_errors.length) {
            $.each(e.field_errors, function (i, err) {
                var $errField = $form.find('[name="' + err.field + '"]'),
                    errField = $errField.get()[0];
                if (err.field === "submit-btn") {
                    e.message = err.message;
                } else if (errField && errField.setCustomValidity && interactiveValidity && !$form[0].noValidate && !config.no_html5validate) {
                    errField.setCustomValidity(err.message); //this sets an additional constraint beyond what the browser validated
                    recheckIfThisIsStillInvalid($errField, errField, err.message); //and since we don't know what it is, we at least check to make sure it's no longer what the server has already rejected
                    funerror = true;
                }
                err.$field = $errField;
                errorsAsObject[err.field] = err.message;
                $errField.trigger('invalid', err.message); //and now let's trigger a real event that someone can use to populatre error classes
            });
            if (funerror && interactiveValidity) {
                //for this to work, triggering the native validation, we'd need to hit the submit button, not just do a $form.submit()
                $form.find('[type="submit"],[type="image"]').eq(0).click();
            }
        }
        $form.trigger('bsd-error', [e, errorsAsObject]);
    }

    //create a replacement for actually submitting the form directly
    function jsapiSubmit($form, action, ops) {
        return function (e) {
            //we're going to use jQuery's ajax to actually check if a request is crossDomain or not, rather than using our own test. Then if it is, and the browser doesn't support that, we'll just cancel the request and let the form submit normally
            var data = $form.serializeObject();
            if ($form.data('isPaused') !== true) {
                //allow a means to prevent submission entirely
                $form.data('isPaused', true);
                var apiaction = action.replace(/\/page\/(signup|s)/, '/page/sapi'),
                    request = $.ajax({
                    url: apiaction, //where to post the form
                    type: 'POST',
                    method: 'POST',
                    dataType: 'json', //no jsonp
                    timeout: ops.timeout || 3e4,
                    context: $form, //set the value of "this" for all deferred functions
                    data: data,
                    beforeSend: function beforeSend(jqxhr, requestsettings) {
                        if (ops.proxyall || requestsettings.crossDomain && !$.support.cors && !($.oldiexdr && parseURL(requestsettings.url).protocol === wlocation.protocol)) {
                            if (ops.oldproxy || ops.proxyall) {
                                requestsettings.url = ops.oldproxy || ops.proxyall;
                                requestsettings.crossDomain = false;
                                requestsettings.data += '&purl=' + apiaction;
                            } else {
                                return false; //request is cors but the browser can't handle that, so let the normal form behavior proceed
                            }
                        }
                        e.preventDefault(); //cancel the native form submit behavior
                    }
                });

                //only add the handlers if the request actually happened
                if (request.statusText !== "canceled") {
                    $form.trigger('bsd-submit', data);
                    request.then(successFilter, errorFilter).always(function () {
                        $form.data('isPaused', false);
                    }).done(formSuccess).fail(formFailure);
                }
            } else {
                e.preventDefault(); //cancel the native form submit behavior
                $form.trigger('bsd-ispaused', data);
            }
        };
    }

    //handle making sure sources in the url end up in the form, like in a native tools signup form
    function normalizeSourceField($form, name, external) {
        var $field = $form.find('[name="' + name + '"]'),
            oldval;
        if (!$field.length) {
            $field = $('<input/>', { 'type': 'hidden', 'name': name }).appendTo($form);
        }
        if (external) {
            oldval = $field.val();
            $field.val((oldval !== "" ? oldval + ',' : '') + external);
        }
    }

    /*create the plugin*/
    $.fn.bsdSignup = function (ops) {
        ops = ops || {};
        return this.each(function () {
            var $form = $(this),
                action = $form.attr('action'); //action or self (self is pretty unlikely here, but bwhatever)
            if (ops === "remove") {
                $form.off('submit.bsdsignup').removeData('bsdsignup isPaused'); //removes the plugin entirely
            } else {
                if ($form.is('form') && action.indexOf('page/s') > -1) {
                    //only bother if key elements are present
                    if ($form.data('bsdsourced') !== true && !ops.nosource) {
                        normalizeSourceField($form, sourceString, urlsource);
                        normalizeSourceField($form, subsourceString, urlsubsource);
                        $form.data('bsdsourced', true);
                    }

                    $form.data('bsdsignup', ops);
                    if (ops.startPaused) {
                        $form.data('isPaused', true);
                    }

                    $form.on('submit.bsdsignup', jsapiSubmit($form, action, ops));
                }
            }
        });
    };
})(jQuery, window.location);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_forEach__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dispatchEvent_js__ = __webpack_require__(62);
/**
* Form Effects module
* @module modules/formEffects
* @see https://github.com/codrops/TextInputEffects/blob/master/index2.html
*/




/**
* Utility function to set an 'is-filled' class on inputs that are focused or
* contain text. Can then be used to add effects to the form, such as moving
* the label.
*/
/* harmony default export */ __webpack_exports__["a"] = (function () {
  /**
  * Add the filled class when input is focused
  * @param {object} event - The event object
  */
  function handleFocus(event) {
    var wrapperElem = event.target.parentNode;
    wrapperElem.classList.add('is-filled');
  }

  /**
  * Remove the filled class when input is blurred if it does not contain text
  * @param {object} event - The event object
  */
  function handleBlur(event) {
    if (event.target.value.trim() === '') {
      var wrapperElem = event.target.parentNode;
      wrapperElem.classList.remove('is-filled');
    }
  }

  var inputs = document.querySelectorAll('.signup-form__field');
  if (inputs.length) {
    __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default()(inputs, function (inputElem) {
      inputElem.addEventListener('focus', handleFocus);
      inputElem.addEventListener('blur', handleBlur);
      Object(__WEBPACK_IMPORTED_MODULE_1__dispatchEvent_js__["a" /* default */])(inputElem, 'blur');
    });
  }
});

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Cross-browser utility to fire events
* @param {object} elem - DOM element to fire event on
* @param {string} eventType - Event type, i.e. 'resize', 'click'
*/
/* harmony default export */ __webpack_exports__["a"] = (function (elem, eventType) {
  var event = void 0;
  if (document.createEvent) {
    event = document.createEvent('HTMLEvents');
    event.initEvent(eventType, true, true);
    elem.dispatchEvent(event);
  } else {
    event = document.createEventObject();
    elem.fireEvent('on' + eventType, event);
  }
});

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/**
* FacetWP Event Handling
* Requires front.js, which is added by the FacetWP plugin
* Also requires jQuery as FacetWP itself requires jQuery
*/

/* harmony default export */ __webpack_exports__["a"] = (function () {
  $(document).on('facetwp-refresh', function () {
    $('body').removeClass('facetwp-is-loaded').addClass('facetwp-is-loading');
    $('html, body').scrollTop(0);
  });

  $(document).on('facetwp-loaded', function () {
    $('body').removeClass('facetwp-is-loading').addClass('facetwp-is-loaded');
  });
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/**
* Owl Settings module
* @module modules/owlSettings
* @see https://owlcarousel2.github.io/OwlCarousel2/index.html
*/

/**
* owl carousel settings and to make the owl carousel work.
*/
/* harmony default export */ __webpack_exports__["a"] = (function () {
  var owl = $('.owl-carousel');
  owl.owlCarousel({
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    items: 1,
    loop: true,
    margin: 0,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true
  });
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/**
* iOS7 iPad Hack
* for hero image flickering issue.
*/

/* harmony default export */ __webpack_exports__["a"] = (function () {
  if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
    $('.c-side-hero').height(window.innerHeight);
    window.scrollTo(0, 0);
  }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_cookie__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_cookie___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_cookie__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vendor_utility_js__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cleave_js_dist_cleave_min__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cleave_js_dist_cleave_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_cleave_js_dist_cleave_min__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_cleave_js_dist_addons_cleave_phone_us__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_cleave_js_dist_addons_cleave_phone_us___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_cleave_js_dist_addons_cleave_phone_us__);
/* eslint-env browser */


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }







/* eslint no-undef: "off" */
var Variables = __webpack_require__(72);

/**
 * This component handles validation and submission for share by email and
 * share by SMS forms.
/**
* Adds functionality to the input in the search results header
*/

var ShareForm = function () {
  /**
   * @param {HTMLElement} el - The html form element for the component.
   * @constructor
   */
  function ShareForm(el) {
    _classCallCheck(this, ShareForm);

    /** @private {HTMLElement} The component element. */
    this._el = el;

    /** @private {boolean} Whether this form is valid. */
    this._isValid = false;

    /** @private {boolean} Whether the form is currently submitting. */
    this._isBusy = false;

    /** @private {boolean} Whether the form is disabled. */
    this._isDisabled = false;

    /** @private {boolean} Whether this component has been initialized. */
    this._initialized = false;

    /** @private {boolean} Whether the google reCAPTCHA widget is required. */
    this._recaptchaRequired = false;

    /** @private {boolean} Whether the google reCAPTCHA widget has passed. */
    this._recaptchaVerified = false;

    /** @private {boolean} Whether the google reCAPTCHA widget is initilaised. */
    this._recaptchainit = false;
  }

  /**
   * If this component has not yet been initialized, attaches event listeners.
   * @method
   * @return {this} ShareForm
   */


  _createClass(ShareForm, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if (this._initialized) {
        return this;
      }

      var selected = this._el.querySelector('input[type="tel"]');

      if (selected) {
        this._maskPhone(selected);
      }

      __WEBPACK_IMPORTED_MODULE_0_jquery___default()('.' + ShareForm.CssClass.SHOW_DISCLAIMER).on('focus', function () {
        _this._disclaimer(true);
      });

      __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this._el).on('submit', function (e) {
        e.preventDefault();
        if (_this._recaptchaRequired) {
          if (_this._recaptchaVerified) {
            _this._validate();
            if (_this._isValid && !_this._isBusy && !_this._isDisabled) {
              _this._submit();
              window.grecaptcha.reset();
              __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this._el).parents('.c-tip-ms__topics').addClass('recaptcha-js');
              _this._recaptchaVerified = false;
            }
          } else {
            __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this._el).find('.' + ShareForm.CssClass.ERROR_MSG).remove();
            _this._showError(ShareForm.Message.RECAPTCHA);
          }
        } else {
          _this._validate();
          if (_this._isValid && !_this._isBusy && !_this._isDisabled) {
            _this._submit();
          }
        }

        // // Determine whether or not to initialize ReCAPTCHA. This should be
        // // initialized only on every 10th view which is determined via an
        // // incrementing cookie.
        var viewCount = __WEBPACK_IMPORTED_MODULE_1_js_cookie___default.a.get('screenerViews') ? parseInt(__WEBPACK_IMPORTED_MODULE_1_js_cookie___default.a.get('screenerViews'), 10) : 1;
        if (viewCount >= 5 && !_this._recaptchainit) {
          __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this._el).parents('.c-tip-ms__topics').addClass('recaptcha-js');
          _this._initRecaptcha();
          _this._recaptchainit = true;
        }
        __WEBPACK_IMPORTED_MODULE_1_js_cookie___default.a.set('screenerViews', ++viewCount, { expires: 2 / 1440 });

        __WEBPACK_IMPORTED_MODULE_0_jquery___default()("#phone").focusout(function () {
          __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this).removeAttr('placeholder');
        });
      });

      // // Determine whether or not to initialize ReCAPTCHA. This should be
      // // initialized only on every 10th view which is determined via an
      // // incrementing cookie.
      var viewCount = __WEBPACK_IMPORTED_MODULE_1_js_cookie___default.a.get('screenerViews') ? parseInt(__WEBPACK_IMPORTED_MODULE_1_js_cookie___default.a.get('screenerViews'), 10) : 1;
      if (viewCount >= 5 && !this._recaptchainit) {
        __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this._el).parents('.c-tip-ms__topics').addClass('recaptcha-js');
        this._initRecaptcha();
        this._recaptchainit = true;
      }
      this._initialized = true;
      return this;
    }

    /**
     * Mask each phone number and properly format it
     * @param  {HTMLElement} input the "tel" input to mask
     * @return {constructor}       the input mask
     */

  }, {
    key: '_maskPhone',
    value: function _maskPhone(input) {
      var cleave = new __WEBPACK_IMPORTED_MODULE_3_cleave_js_dist_cleave_min___default.a(input, {
        phone: true,
        phoneRegionCode: 'us',
        delimiter: '-'
      });
      input.cleave = cleave;
      return input;
    }

    /**
     * Toggles the disclaimer visibility
     * @param  {Boolean} visible - wether the disclaimer should be visible or not
     */

  }, {
    key: '_disclaimer',
    value: function _disclaimer() {
      var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var $el = __WEBPACK_IMPORTED_MODULE_0_jquery___default()('#js-disclaimer');
      var $class = visible ? 'addClass' : 'removeClass';
      $el.attr('aria-hidden', !visible);
      $el.attr(ShareForm.CssClass.HIDDEN, !visible);
      $el[$class](ShareForm.CssClass.ANIMATE_DISCLAIMER);
      // Scroll-to functionality for mobile
      if (window.scrollTo && visible && window.innerWidth < Variables['screen-desktop']) {
        var $target = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(e.target);
        window.scrollTo(0, $target.offset().top - $target.data('scrollOffset'));
      }
    }

    /**
     * Runs validation rules and sets validity of component.
     * @method
     * @return {this} ShareForm
     */

  }, {
    key: '_validate',
    value: function _validate() {
      var validity = true;
      var $tel = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this._el).find('input[type="tel"]');
      // Clear any existing error messages.
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this._el).find('.' + ShareForm.CssClass.ERROR_MSG).remove();

      if ($tel.length) {
        validity = this._validatePhoneNumber($tel[0]);
      }

      this._isValid = validity;
      if (this._isValid) {
        __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this._el).removeClass(ShareForm.CssClass.ERROR);
      }
      return this;
    }

    /**
     * For a given input, checks to see if its value is a valid Phonenumber. If not,
     * displays an error message and sets an error class on the element.
     * @param {HTMLElement} input - The html form element for the component.
     * @return {boolean} - Valid email.
     */

  }, {
    key: '_validatePhoneNumber',
    value: function _validatePhoneNumber(input) {
      var num = this._parsePhoneNumber(input.value); // parse the number
      num = num ? num.join('') : 0; // if num is null, there are no numbers
      if (num.length === 10) {
        return true; // assume it is phone number
      }
      this._showError(ShareForm.Message.PHONE);
      return false;
      // var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
      // var phoneno = (/^\+?[1-9]\d{1,14}$/);
      // if(!input.value.match(phoneno)){
      //   this._showError(ShareForm.Message.PHONE);
      //   return false;
      // }
      // return true;
    }

    /**
     * Get just the phone number of a given value
     * @param  {string} value The string to get numbers from
     * @return {array}       An array with matched blocks
     */

  }, {
    key: '_parsePhoneNumber',
    value: function _parsePhoneNumber(value) {
      return value.match(/\d+/g); // get only digits
    }

    /**
     * For a given input, checks to see if it has a value. If not, displays an
     * error message and sets an error class on the element.
     * @method
     * @param {HTMLElement} input - The html form element for the component.
     * @return {boolean} - Valid required field.
     */

  }, {
    key: '_validateRequired',
    value: function _validateRequired(input) {
      if (__WEBPACK_IMPORTED_MODULE_0_jquery___default()(input).val()) {
        return true;
      }
      this._showError(ShareForm.Message.REQUIRED);
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()(input).one('keyup', function () {
        this._validate();
      });
      return false;
    }

    /**
     * Displays an error message by appending a div to the form.
     * @param {string} msg - Error message to display.
     * @return {this} ShareForm - shareform
     */

  }, {
    key: '_showError',
    value: function _showError(msg) {
      var $elParents = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this._el).parents('.c-tip-ms__topics');
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()('#sms-form-msg').addClass(ShareForm.CssClass.ERROR).text(__WEBPACK_IMPORTED_MODULE_2__vendor_utility_js__["a" /* default */].localize(msg));
      $elParents.removeClass('success-js');
      return this;
    }

    /**
     * Adds a "success" class.
     * @param {string} msg - Error message to display.
     * @return {this} ShareForm
     */

  }, {
    key: '_showSuccess',
    value: function _showSuccess(msg) {
      var $elParents = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this._el).parents('.c-tip-ms__topics');
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()('#phone').attr("placeholder", __WEBPACK_IMPORTED_MODULE_2__vendor_utility_js__["a" /* default */].localize(msg));
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()('#smsbutton').text("Send Another");
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()('#sms-form-msg').addClass(ShareForm.CssClass.SUCCESS).text('');
      $elParents.removeClass('success-js');
      $elParents.addClass('success-js');
      return this;
    }

    /**
     * Submits the form.
     * @return {jqXHR} deferred response object
     */

  }, {
    key: '_submit',
    value: function _submit() {
      var _this2 = this;

      this._isBusy = true;
      var $spinner = this._el.querySelector('.' + ShareForm.CssClass.SPINNER);
      var $submit = this._el.querySelector('button[type="submit"]');
      var payload = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this._el).serialize();
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this._el).find('input').prop('disabled', true);
      if ($spinner) {
        $submit.disabled = true; // hide submit button
        $spinner.style.cssText = ''; // show spinner
      }
      return __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.post(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(this._el).attr('action'), payload).done(function (response) {
        if (response.success) {
          _this2._el.reset();
          _this2._showSuccess(ShareForm.Message.SUCCESS);
          _this2._isDisabled = true;
          __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this2._el).one('keyup', 'input', function () {
            __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this2._el).removeClass(ShareForm.CssClass.SUCCESS);
            _this2._isDisabled = false;
          });
        } else {
          _this2._showError(JSON.stringify(response.message));
        }
      }).fail(function () {
        this._showError(ShareForm.Message.SERVER);
      }).always(function () {
        __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this2._el).find('input').prop('disabled', false);
        if ($spinner) {
          $submit.disabled = false; // show submit button
          $spinner.style.cssText = 'display: none'; // hide spinner;
        }
        _this2._isBusy = false;
      });
    }

    /**
     * Asynchronously loads the Google recaptcha script and sets callbacks for
     * load, success, and expiration.
     * @private
     * @return {this} Screener
     */

  }, {
    key: '_initRecaptcha',
    value: function _initRecaptcha() {
      var _this3 = this;

      var $script = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(document.createElement('script'));
      $script.attr('src', 'https://www.google.com/recaptcha/api.js' + '?onload=screenerCallback&render=explicit').prop({
        async: true,
        defer: true
      });

      window.screenerCallback = function () {
        window.grecaptcha.render(document.getElementById('screener-recaptcha'), {
          'sitekey': '6LekICYUAAAAAOR2uZ0ajyWt9XxDuspHPUAkRzAB',
          //Below is the local host key
          // 'sitekey' : '6LcAACYUAAAAAPmtvQvBwK89imM3QfotJFHfSm8C',
          'callback': 'screenerRecaptcha',
          'expired-callback': 'screenerRecaptchaReset'
        });
        _this3._recaptchaRequired = true;
      };

      window.screenerRecaptcha = function () {
        _this3._recaptchaVerified = true;
        __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this3._el).parents('.c-tip-ms__topics').removeClass('recaptcha-js');
      };

      window.screenerRecaptchaReset = function () {
        _this3._recaptchaVerified = false;
        __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this3._el).parents('.c-tip-ms__topics').addClass('recaptcha-js');
      };

      this._recaptchaRequired = true;
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()('head').append($script);
      return this;
    }
  }]);

  return ShareForm;
}();

/**
 * CSS classes used by this component.
 * @enum {string}
 */


ShareForm.CssClass = {
  ERROR: 'error',
  ERROR_MSG: 'error-message',
  FORM: 'js-share-form',
  SHOW_DISCLAIMER: 'js-show-disclaimer',
  NEEDS_DISCLAIMER: 'js-needs-disclaimer',
  ANIMATE_DISCLAIMER: 'animated fadeInUp',
  HIDDEN: 'hidden',
  SUBMIT_BTN: 'btn-submit',
  SUCCESS: 'success',
  SPINNER: 'js-spinner'
};

/**
 * Localization labels of form messages.
 * @enum {string}
 */
ShareForm.Message = {
  EMAIL: 'ERROR_EMAIL',
  PHONE: 'Invalid Mobile Number',
  REQUIRED: 'ERROR_REQUIRED',
  SERVER: 'ERROR_SERVER',
  SUCCESS: 'Message sent!',
  RECAPTCHA: 'Please fill the reCAPTCHA'
};

/* harmony default export */ __webpack_exports__["a"] = (ShareForm);

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		registeredInModuleLoader = true;
	}
	if (true) {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));


/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_underscore__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_underscore__);
/* eslint-env browser */


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



/**
 * Collection of utility functions.
 */
var Utility = {};

/**
 * Returns the value of a given key in a URL query string. If no URL query
 * string is provided, the current URL location is used.
 * @param {string} name - Key name.
 * @param {?string} queryString - Optional query string to check.
 * @return {?string} Query parameter value.
 */
Utility.getUrlParameter = function (name, queryString) {
  var query = queryString || window.location.search;
  var param = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + param + '=([^&#]*)');
  var results = regex.exec(query);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/**
 * Takes an object and deeply traverses it, returning an array of values for
 * matched properties identified by the key string.
 * @param {object} object to traverse.
 * @param {string} targetProp name to search for.
 * @return {array} property values.
 */
Utility.findValues = function (object, targetProp) {
  var results = [];

  /**
   * Recursive function for iterating over object keys.
   */
  (function traverseObject(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === targetProp) {
          results.push(obj[key]);
        }
        if (_typeof(obj[key]) === 'object') {
          traverseObject(obj[key]);
        }
      }
    }
  })(object);

  return results;
};

/**
 * Takes a string or number value and converts it to a dollar amount
 * as a string with two decimal points of percision.
 * @param {string|number} val - value to convert.
 * @return {string} stringified number to two decimal places.
 */
Utility.toDollarAmount = function (val) {
  return Math.abs(Math.round(parseFloat(val) * 100) / 100).toFixed(2);
};

/**
 * For translating strings, there is a global LOCALIZED_STRINGS array that
 * is defined on the HTML template level so that those strings are exposed to
 * WPML translation. The LOCALIZED_STRINGS array is comosed of objects with a
 * `slug` key whose value is some constant, and a `label` value which is the
 * translated equivalent. This function takes a slug name and returns the
 * label.
 * @param {string} slugName
 * @return {string} localized value
 */
Utility.localize = function (slugName) {
  var text = slugName || '';
  var localizedStrings = window.LOCALIZED_STRINGS || [];
  var match = __WEBPACK_IMPORTED_MODULE_0_underscore___default.a.findWhere(localizedStrings, {
    slug: slugName
  });
  if (match) {
    text = match.label;
  }
  return text;
};

/**
 * Takes a a string and returns whether or not the string is a valid email
 * by using native browser validation if available. Otherwise, does a simple
 * Regex test.
 * @param {string} email
 * @return {boolean}
 */
Utility.isValidEmail = function (email) {
  var input = document.createElement('input');
  input.type = 'email';
  input.value = email;

  return typeof input.checkValidity === 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(email);
};

/**
 * Site constants.
 * @enum {string}
 */
Utility.CONFIG = {
  DEFAULT_LAT: 40.7128,
  DEFAULT_LNG: -74.0059,
  GOOGLE_API: 'AIzaSyBSjc_JN_p0-_VKyBvjCFqVAmAIWt7ClZc',
  GOOGLE_STATIC_API: 'AIzaSyCt0E7DX_YPFcUnlMP6WHv2zqAwyZE4qIw',
  GRECAPTCHA_SITE_KEY: '6LeynBUUAAAAANwskTW2UIcektRiaySqLFFwwk48',
  SCREENER_MAX_HOUSEHOLD: 8,
  URL_PIN_BLUE: '/wp-content/themes/access/assets/img/map-pin-blue.png',
  URL_PIN_BLUE_2X: '/wp-content/themes/access/assets/img/map-pin-blue-2x.png',
  URL_PIN_GREEN: '/wp-content/themes/access/assets/img/map-pin-green.png',
  URL_PIN_GREEN_2X: '/wp-content/themes/access/assets/img/map-pin-green-2x.png'
};

/* harmony default export */ __webpack_exports__["a"] = (Utility);

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}.call(this));


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * cleave.js - 0.7.23
 * https://github.com/nosir/cleave.js
 * Apache License Version 2.0
 *
 * Copyright (C) 2012-2017 Max Huang https://github.com/nosir/
 */
!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Cleave=t():e.Cleave=t()}(this,function(){return function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={exports:{},id:n,loaded:!1};return e[n].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){(function(t){"use strict";var n=function(e,t){var r=this;if("string"==typeof e?r.element=document.querySelector(e):r.element="undefined"!=typeof e.length&&e.length>0?e[0]:e,!r.element)throw new Error("[cleave.js] Please check the element");t.initValue=r.element.value,r.properties=n.DefaultProperties.assign({},t),r.init()};n.prototype={init:function(){var e=this,t=e.properties;(t.numeral||t.phone||t.creditCard||t.date||0!==t.blocksLength||t.prefix)&&(t.maxLength=n.Util.getMaxLength(t.blocks),e.isAndroid=n.Util.isAndroid(),e.lastInputValue="",e.onChangeListener=e.onChange.bind(e),e.onKeyDownListener=e.onKeyDown.bind(e),e.onCutListener=e.onCut.bind(e),e.onCopyListener=e.onCopy.bind(e),e.element.addEventListener("input",e.onChangeListener),e.element.addEventListener("keydown",e.onKeyDownListener),e.element.addEventListener("cut",e.onCutListener),e.element.addEventListener("copy",e.onCopyListener),e.initPhoneFormatter(),e.initDateFormatter(),e.initNumeralFormatter(),e.onInput(t.initValue))},initNumeralFormatter:function(){var e=this,t=e.properties;t.numeral&&(t.numeralFormatter=new n.NumeralFormatter(t.numeralDecimalMark,t.numeralIntegerScale,t.numeralDecimalScale,t.numeralThousandsGroupStyle,t.numeralPositiveOnly,t.delimiter))},initDateFormatter:function(){var e=this,t=e.properties;t.date&&(t.dateFormatter=new n.DateFormatter(t.datePattern),t.blocks=t.dateFormatter.getBlocks(),t.blocksLength=t.blocks.length,t.maxLength=n.Util.getMaxLength(t.blocks))},initPhoneFormatter:function(){var e=this,t=e.properties;if(t.phone)try{t.phoneFormatter=new n.PhoneFormatter(new t.root.Cleave.AsYouTypeFormatter(t.phoneRegionCode),t.delimiter)}catch(r){throw new Error("[cleave.js] Please include phone-type-formatter.{country}.js lib")}},onKeyDown:function(e){var t=this,r=t.properties,i=e.which||e.keyCode,a=n.Util,o=t.element.value;return a.isAndroidBackspaceKeydown(t.lastInputValue,o)&&(i=8),t.lastInputValue=o,8===i&&a.isDelimiter(o.slice(-r.delimiterLength),r.delimiter,r.delimiters)?void(r.backspace=!0):void(r.backspace=!1)},onChange:function(){this.onInput(this.element.value)},onCut:function(e){this.copyClipboardData(e),this.onInput("")},onCopy:function(e){this.copyClipboardData(e)},copyClipboardData:function(e){var t=this,r=t.properties,i=n.Util,a=t.element.value,o="";o=r.copyDelimiter?a:i.stripDelimiters(a,r.delimiter,r.delimiters);try{e.clipboardData?e.clipboardData.setData("Text",o):window.clipboardData.setData("Text",o),e.preventDefault()}catch(l){}},onInput:function(e){var t=this,r=t.properties,i=e,a=n.Util;return r.numeral||!r.backspace||a.isDelimiter(e.slice(-r.delimiterLength),r.delimiter,r.delimiters)||(e=a.headStr(e,e.length-r.delimiterLength)),r.phone?(r.result=r.phoneFormatter.format(e),void t.updateValueState()):r.numeral?(r.result=r.prefix+r.numeralFormatter.format(e),void t.updateValueState()):(r.date&&(e=r.dateFormatter.getValidatedDate(e)),e=a.stripDelimiters(e,r.delimiter,r.delimiters),e=a.getPrefixStrippedValue(e,r.prefix,r.prefixLength),e=r.numericOnly?a.strip(e,/[^\d]/g):e,e=r.uppercase?e.toUpperCase():e,e=r.lowercase?e.toLowerCase():e,r.prefix&&(e=r.prefix+e,0===r.blocksLength)?(r.result=e,void t.updateValueState()):(r.creditCard&&t.updateCreditCardPropsByValue(e),e=a.headStr(e,r.maxLength),r.result=a.getFormattedValue(e,r.blocks,r.blocksLength,r.delimiter,r.delimiters),void(i===r.result&&i!==r.prefix||t.updateValueState())))},updateCreditCardPropsByValue:function(e){var t,r=this,i=r.properties,a=n.Util;a.headStr(i.result,4)!==a.headStr(e,4)&&(t=n.CreditCardDetector.getInfo(e,i.creditCardStrictMode),i.blocks=t.blocks,i.blocksLength=i.blocks.length,i.maxLength=a.getMaxLength(i.blocks),i.creditCardType!==t.type&&(i.creditCardType=t.type,i.onCreditCardTypeChanged.call(r,i.creditCardType)))},updateValueState:function(){var e=this;return e.isAndroid?void window.setTimeout(function(){e.element.value=e.properties.result},1):void(e.element.value=e.properties.result)},setPhoneRegionCode:function(e){var t=this,r=t.properties;r.phoneRegionCode=e,t.initPhoneFormatter(),t.onChange()},setRawValue:function(e){var t=this,r=t.properties;e=void 0!==e&&null!==e?e.toString():"",r.numeral&&(e=e.replace(".",r.numeralDecimalMark)),t.element.value=e,t.onInput(e)},getRawValue:function(){var e=this,t=e.properties,r=n.Util,i=e.element.value;return t.rawValueTrimPrefix&&(i=r.getPrefixStrippedValue(i,t.prefix,t.prefixLength)),i=t.numeral?t.numeralFormatter.getRawValue(i):r.stripDelimiters(i,t.delimiter,t.delimiters)},getFormattedValue:function(){return this.element.value},destroy:function(){var e=this;e.element.removeEventListener("input",e.onChangeListener),e.element.removeEventListener("keydown",e.onKeyDownListener),e.element.removeEventListener("cut",e.onCutListener),e.element.removeEventListener("copy",e.onCopyListener)},toString:function(){return"[Cleave Object]"}},n.NumeralFormatter=r(1),n.DateFormatter=r(2),n.PhoneFormatter=r(3),n.CreditCardDetector=r(4),n.Util=r(5),n.DefaultProperties=r(6),("object"==typeof t&&t?t:window).Cleave=n,e.exports=n}).call(t,function(){return this}())},function(e,t){"use strict";var r=function(e,t,n,i,a,o){var l=this;l.numeralDecimalMark=e||".",l.numeralIntegerScale=t>=0?t:10,l.numeralDecimalScale=n>=0?n:2,l.numeralThousandsGroupStyle=i||r.groupStyle.thousand,l.numeralPositiveOnly=!!a,l.delimiter=o||""===o?o:",",l.delimiterRE=o?new RegExp("\\"+o,"g"):""};r.groupStyle={thousand:"thousand",lakh:"lakh",wan:"wan"},r.prototype={getRawValue:function(e){return e.replace(this.delimiterRE,"").replace(this.numeralDecimalMark,".")},format:function(e){var t,n,i=this,a="";switch(e=e.replace(/[A-Za-z]/g,"").replace(i.numeralDecimalMark,"M").replace(/[^\dM-]/g,"").replace(/^\-/,"N").replace(/\-/g,"").replace("N",i.numeralPositiveOnly?"":"-").replace("M",i.numeralDecimalMark).replace(/^(-)?0+(?=\d)/,"$1"),n=e,e.indexOf(i.numeralDecimalMark)>=0&&(t=e.split(i.numeralDecimalMark),n=t[0],a=i.numeralDecimalMark+t[1].slice(0,i.numeralDecimalScale)),i.numeralIntegerScale>0&&(n=n.slice(0,i.numeralIntegerScale+("-"===e.slice(0,1)?1:0))),i.numeralThousandsGroupStyle){case r.groupStyle.lakh:n=n.replace(/(\d)(?=(\d\d)+\d$)/g,"$1"+i.delimiter);break;case r.groupStyle.wan:n=n.replace(/(\d)(?=(\d{4})+$)/g,"$1"+i.delimiter);break;default:n=n.replace(/(\d)(?=(\d{3})+$)/g,"$1"+i.delimiter)}return n.toString()+(i.numeralDecimalScale>0?a.toString():"")}},e.exports=r},function(e,t){"use strict";var r=function(e){var t=this;t.blocks=[],t.datePattern=e,t.initBlocks()};r.prototype={initBlocks:function(){var e=this;e.datePattern.forEach(function(t){"Y"===t?e.blocks.push(4):e.blocks.push(2)})},getBlocks:function(){return this.blocks},getValidatedDate:function(e){var t=this,r="";return e=e.replace(/[^\d]/g,""),t.blocks.forEach(function(n,i){if(e.length>0){var a=e.slice(0,n),o=a.slice(0,1),l=e.slice(n);switch(t.datePattern[i]){case"d":"00"===a?a="01":parseInt(o,10)>3?a="0"+o:parseInt(a,10)>31&&(a="31");break;case"m":"00"===a?a="01":parseInt(o,10)>1?a="0"+o:parseInt(a,10)>12&&(a="12")}r+=a,e=l}}),r}},e.exports=r},function(e,t){"use strict";var r=function(e,t){var r=this;r.delimiter=t||""===t?t:" ",r.delimiterRE=t?new RegExp("\\"+t,"g"):"",r.formatter=e};r.prototype={setFormatter:function(e){this.formatter=e},format:function(e){var t=this;t.formatter.clear(),e=e.replace(/[^\d+]/g,""),e=e.replace(t.delimiterRE,"");for(var r,n="",i=!1,a=0,o=e.length;o>a;a++)r=t.formatter.inputDigit(e.charAt(a)),/[\s()-]/g.test(r)?(n=r,i=!0):i||(n=r);return n=n.replace(/[()]/g,""),n=n.replace(/[\s-]/g,t.delimiter)}},e.exports=r},function(e,t){"use strict";var r={blocks:{uatp:[4,5,6],amex:[4,6,5],diners:[4,6,4],discover:[4,4,4,4],mastercard:[4,4,4,4],dankort:[4,4,4,4],instapayment:[4,4,4,4],jcb:[4,4,4,4],maestro:[4,4,4,4],visa:[4,4,4,4],general:[4,4,4,4],generalStrict:[4,4,4,7]},re:{uatp:/^(?!1800)1\d{0,14}/,amex:/^3[47]\d{0,13}/,discover:/^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,diners:/^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,mastercard:/^(5[1-5]|2[2-7])\d{0,14}/,dankort:/^(5019|4175|4571)\d{0,12}/,instapayment:/^63[7-9]\d{0,13}/,jcb:/^(?:2131|1800|35\d{0,2})\d{0,12}/,maestro:/^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,visa:/^4\d{0,15}/},getInfo:function(e,t){var n=r.blocks,i=r.re;return t=!!t,i.amex.test(e)?{type:"amex",blocks:n.amex}:i.uatp.test(e)?{type:"uatp",blocks:n.uatp}:i.diners.test(e)?{type:"diners",blocks:n.diners}:i.discover.test(e)?{type:"discover",blocks:t?n.generalStrict:n.discover}:i.mastercard.test(e)?{type:"mastercard",blocks:n.mastercard}:i.dankort.test(e)?{type:"dankort",blocks:n.dankort}:i.instapayment.test(e)?{type:"instapayment",blocks:n.instapayment}:i.jcb.test(e)?{type:"jcb",blocks:n.jcb}:i.maestro.test(e)?{type:"maestro",blocks:t?n.generalStrict:n.maestro}:i.visa.test(e)?{type:"visa",blocks:t?n.generalStrict:n.visa}:{type:"unknown",blocks:t?n.generalStrict:n.general}}};e.exports=r},function(e,t){"use strict";var r={noop:function(){},strip:function(e,t){return e.replace(t,"")},isDelimiter:function(e,t,r){return 0===r.length?e===t:r.some(function(t){return e===t?!0:void 0})},getDelimiterREByDelimiter:function(e){return new RegExp(e.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1"),"g")},stripDelimiters:function(e,t,r){var n=this;if(0===r.length){var i=t?n.getDelimiterREByDelimiter(t):"";return e.replace(i,"")}return r.forEach(function(t){e=e.replace(n.getDelimiterREByDelimiter(t),"")}),e},headStr:function(e,t){return e.slice(0,t)},getMaxLength:function(e){return e.reduce(function(e,t){return e+t},0)},getPrefixStrippedValue:function(e,t,r){if(e.slice(0,r)!==t){var n=this.getFirstDiffIndex(t,e.slice(0,r));e=t+e.slice(n,n+1)+e.slice(r+1)}return e.slice(r)},getFirstDiffIndex:function(e,t){for(var r=0;e.charAt(r)===t.charAt(r);)if(""===e.charAt(r++))return-1;return r},getFormattedValue:function(e,t,r,n,i){var a,o="",l=i.length>0;return 0===r?e:(t.forEach(function(t,s){if(e.length>0){var c=e.slice(0,t),u=e.slice(t);o+=c,a=l?i[s]||a:n,c.length===t&&r-1>s&&(o+=a),e=u}}),o)},isAndroid:function(){return!(!navigator||!/android/i.test(navigator.userAgent))},isAndroidBackspaceKeydown:function(e,t){return this.isAndroid()?t===e.slice(0,-1):!1}};e.exports=r},function(e,t){(function(t){"use strict";var r={assign:function(e,r){return e=e||{},r=r||{},e.creditCard=!!r.creditCard,e.creditCardStrictMode=!!r.creditCardStrictMode,e.creditCardType="",e.onCreditCardTypeChanged=r.onCreditCardTypeChanged||function(){},e.phone=!!r.phone,e.phoneRegionCode=r.phoneRegionCode||"AU",e.phoneFormatter={},e.date=!!r.date,e.datePattern=r.datePattern||["d","m","Y"],e.dateFormatter={},e.numeral=!!r.numeral,e.numeralIntegerScale=r.numeralIntegerScale>=0?r.numeralIntegerScale:10,e.numeralDecimalScale=r.numeralDecimalScale>=0?r.numeralDecimalScale:2,e.numeralDecimalMark=r.numeralDecimalMark||".",e.numeralThousandsGroupStyle=r.numeralThousandsGroupStyle||"thousand",e.numeralPositiveOnly=!!r.numeralPositiveOnly,e.numericOnly=e.creditCard||e.date||!!r.numericOnly,e.uppercase=!!r.uppercase,e.lowercase=!!r.lowercase,e.prefix=e.creditCard||e.phone||e.date?"":r.prefix||"",e.prefixLength=e.prefix.length,e.rawValueTrimPrefix=!!r.rawValueTrimPrefix,e.copyDelimiter=!!r.copyDelimiter,e.initValue=void 0===r.initValue?"":r.initValue.toString(),e.delimiter=r.delimiter||""===r.delimiter?r.delimiter:r.date?"/":r.numeral?",":(r.phone," "),e.delimiterLength=e.delimiter.length,e.delimiters=r.delimiters||[],e.blocks=r.blocks||[],e.blocksLength=e.blocks.length,e.root="object"==typeof t&&t?t:window,e.maxLength=0,e.backspace=!1,e.result="",e}};e.exports=r}).call(t,function(){return this}())}])});

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {!function(){function t(t,n){var e=t.split("."),r=H;e[0]in r||!r.execScript||r.execScript("var "+e[0]);for(var i;e.length&&(i=e.shift());)e.length||void 0===n?r=r[i]?r[i]:r[i]={}:r[i]=n}function n(t,n){function e(){}e.prototype=n.prototype,t.M=n.prototype,t.prototype=new e,t.prototype.constructor=t,t.N=function(t,e,r){for(var i=Array(arguments.length-2),a=2;a<arguments.length;a++)i[a-2]=arguments[a];return n.prototype[e].apply(t,i)}}function e(t,n){null!=t&&this.a.apply(this,arguments)}function r(t){t.b=""}function i(t,n){t.sort(n||a)}function a(t,n){return t>n?1:n>t?-1:0}function l(t){var n,e=[],r=0;for(n in t)e[r++]=t[n];return e}function o(t,n){this.b=t,this.a={};for(var e=0;e<n.length;e++){var r=n[e];this.a[r.b]=r}}function u(t){return t=l(t.a),i(t,function(t,n){return t.b-n.b}),t}function s(t,n){switch(this.b=t,this.g=!!n.G,this.a=n.c,this.j=n.type,this.h=!1,this.a){case q:case J:case L:case O:case k:case Y:case K:this.h=!0}this.f=n.defaultValue}function f(){this.a={},this.f=this.i().a,this.b=this.g=null}function p(t,n){for(var e=u(t.i()),r=0;r<e.length;r++){var i=e[r],a=i.b;if(null!=n.a[a]){t.b&&delete t.b[i.b];var l=11==i.a||10==i.a;if(i.g)for(var i=c(n,a)||[],o=0;o<i.length;o++){var s=t,f=a,h=l?i[o].clone():i[o];s.a[f]||(s.a[f]=[]),s.a[f].push(h),s.b&&delete s.b[f]}else i=c(n,a),l?(l=c(t,a))?p(l,i):m(t,a,i.clone()):m(t,a,i)}}}function c(t,n){var e=t.a[n];if(null==e)return null;if(t.g){if(!(n in t.b)){var r=t.g,i=t.f[n];if(null!=e)if(i.g){for(var a=[],l=0;l<e.length;l++)a[l]=r.b(i,e[l]);e=a}else e=r.b(i,e);return t.b[n]=e}return t.b[n]}return e}function h(t,n,e){var r=c(t,n);return t.f[n].g?r[e||0]:r}function g(t,n){var e;if(null!=t.a[n])e=h(t,n,void 0);else t:{if(e=t.f[n],void 0===e.f){var r=e.j;if(r===Boolean)e.f=!1;else if(r===Number)e.f=0;else{if(r!==String){e=new r;break t}e.f=e.h?"0":""}}e=e.f}return e}function b(t,n){return t.f[n].g?null!=t.a[n]?t.a[n].length:0:null!=t.a[n]?1:0}function m(t,n,e){t.a[n]=e,t.b&&(t.b[n]=e)}function y(t,n){var e,r=[];for(e in n)0!=e&&r.push(new s(e,n[e]));return new o(t,r)}/*

 Protocol Buffer 2 Copyright 2008 Google Inc.
 All other code copyright its respective owners.
 Copyright (C) 2010 The Libphonenumber Authors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
function v(){f.call(this)}function d(){f.call(this)}function _(){f.call(this)}function S(){}function w(){}function A(){}/*

 Copyright (C) 2010 The Libphonenumber Authors.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
function x(){this.a={}}function N(t,n){if(null==n)return null;n=n.toUpperCase();var e=t.a[n];if(null==e){if(e=tt[n],null==e)return null;e=(new A).a(_.i(),e),t.a[n]=e}return e}function j(t){return t=W[t],null==t?"ZZ":t[0]}function $(t){this.H=RegExp(" "),this.B="",this.m=new e,this.v="",this.h=new e,this.u=new e,this.j=!0,this.w=this.o=this.D=!1,this.F=x.b(),this.s=0,this.b=new e,this.A=!1,this.l="",this.a=new e,this.f=[],this.C=t,this.J=this.g=C(this,this.C)}function C(t,n){var e;if(null!=n&&isNaN(n)&&n.toUpperCase()in tt){if(e=N(t.F,n),null==e)throw"Invalid region code: "+n;e=g(e,10)}else e=0;return e=N(t.F,j(e)),null!=e?e:at}function B(t){for(var n=t.f.length,e=0;n>e;++e){var i=t.f[e],a=g(i,1);if(t.v==a)return!1;var l;l=t;var o=i,u=g(o,1);if(-1!=u.indexOf("|"))l=!1;else{u=u.replace(lt,"\\d"),u=u.replace(ot,"\\d"),r(l.m);var s;s=l;var o=g(o,2),f="999999999999999".match(u)[0];f.length<s.a.b.length?s="":(s=f.replace(new RegExp(u,"g"),o),s=s.replace(RegExp("9","g")," ")),0<s.length?(l.m.a(s),l=!0):l=!1}if(l)return t.v=a,t.A=st.test(h(i,4)),t.s=0,!0}return t.j=!1}function E(t,n){for(var e=[],r=n.length-3,i=t.f.length,a=0;i>a;++a){var l=t.f[a];0==b(l,3)?e.push(t.f[a]):(l=h(l,3,Math.min(r,b(l,3)-1)),0==n.search(l)&&e.push(t.f[a]))}t.f=e}function R(t,n){t.h.a(n);var e=n;if(rt.test(e)||1==t.h.b.length&&et.test(e)){var i,e=n;"+"==e?(i=e,t.u.a(e)):(i=nt[e],t.u.a(i),t.a.a(i)),n=i}else t.j=!1,t.D=!0;if(!t.j){if(!t.D)if(V(t)){if(P(t))return D(t)}else if(0<t.l.length&&(e=t.a.toString(),r(t.a),t.a.a(t.l),t.a.a(e),e=t.b.toString(),i=e.lastIndexOf(t.l),r(t.b),t.b.a(e.substring(0,i))),t.l!=U(t))return t.b.a(" "),D(t);return t.h.toString()}switch(t.u.b.length){case 0:case 1:case 2:return t.h.toString();case 3:if(!V(t))return t.l=U(t),F(t);t.w=!0;default:return t.w?(P(t)&&(t.w=!1),t.b.toString()+t.a.toString()):0<t.f.length?(e=T(t,n),i=I(t),0<i.length?i:(E(t,t.a.toString()),B(t)?G(t):t.j?M(t,e):t.h.toString())):F(t)}}function D(t){return t.j=!0,t.w=!1,t.f=[],t.s=0,r(t.m),t.v="",F(t)}function I(t){for(var n=t.a.toString(),e=t.f.length,r=0;e>r;++r){var i=t.f[r],a=g(i,1);if(new RegExp("^(?:"+a+")$").test(n))return t.A=st.test(h(i,4)),n=n.replace(new RegExp(a,"g"),h(i,2)),M(t,n)}return""}function M(t,n){var e=t.b.b.length;return t.A&&e>0&&" "!=t.b.toString().charAt(e-1)?t.b+" "+n:t.b+n}function F(t){var n=t.a.toString();if(3<=n.length){for(var e=t.o&&0<b(t.g,20)?c(t.g,20)||[]:c(t.g,19)||[],r=e.length,i=0;r>i;++i){var a,l=e[i];(a=null==t.g.a[12]||t.o||h(l,6))||(a=g(l,4),a=0==a.length||it.test(a)),a&&ut.test(g(l,2))&&t.f.push(l)}return E(t,n),n=I(t),0<n.length?n:B(t)?G(t):t.h.toString()}return M(t,n)}function G(t){var n=t.a.toString(),e=n.length;if(e>0){for(var r="",i=0;e>i;i++)r=T(t,n.charAt(i));return t.j?M(t,r):t.h.toString()}return t.b.toString()}function U(t){var n,e=t.a.toString(),i=0;return 1!=h(t.g,10)?n=!1:(n=t.a.toString(),n="1"==n.charAt(0)&&"0"!=n.charAt(1)&&"1"!=n.charAt(1)),n?(i=1,t.b.a("1").a(" "),t.o=!0):null!=t.g.a[15]&&(n=new RegExp("^(?:"+h(t.g,15)+")"),n=e.match(n),null!=n&&null!=n[0]&&0<n[0].length&&(t.o=!0,i=n[0].length,t.b.a(e.substring(0,i)))),r(t.a),t.a.a(e.substring(i)),e.substring(0,i)}function V(t){var n=t.u.toString(),e=new RegExp("^(?:\\+|"+h(t.g,11)+")"),e=n.match(e);return null!=e&&null!=e[0]&&0<e[0].length?(t.o=!0,e=e[0].length,r(t.a),t.a.a(n.substring(e)),r(t.b),t.b.a(n.substring(0,e)),"+"!=n.charAt(0)&&t.b.a(" "),!0):!1}function P(t){if(0==t.a.b.length)return!1;var n,i=new e;t:{if(n=t.a.toString(),0!=n.length&&"0"!=n.charAt(0))for(var a,l=n.length,o=1;3>=o&&l>=o;++o)if(a=parseInt(n.substring(0,o),10),a in W){i.a(n.substring(o)),n=a;break t}n=0}return 0==n?!1:(r(t.a),t.a.a(i.toString()),i=j(n),"001"==i?t.g=N(t.F,""+n):i!=t.C&&(t.g=C(t,i)),t.b.a(""+n).a(" "),t.l="",!0)}function T(t,n){var e=t.m.toString();if(0<=e.substring(t.s).search(t.H)){var i=e.search(t.H),e=e.replace(t.H,n);return r(t.m),t.m.a(e),t.s=i,e.substring(0,t.s+1)}return 1==t.f.length&&(t.j=!1),t.v="",t.h.toString()}var H=this;e.prototype.b="",e.prototype.set=function(t){this.b=""+t},e.prototype.a=function(t,n,e){if(this.b+=String(t),null!=n)for(var r=1;r<arguments.length;r++)this.b+=arguments[r];return this},e.prototype.toString=function(){return this.b};var K=1,Y=2,q=3,J=4,L=6,O=16,k=18;f.prototype.set=function(t,n){m(this,t.b,n)},f.prototype.clone=function(){var t=new this.constructor;return t!=this&&(t.a={},t.b&&(t.b={}),p(t,this)),t};var Z;n(v,f);var z;n(d,f);var X;n(_,f),v.prototype.i=function(){return Z||(Z=y(v,{0:{name:"NumberFormat",I:"i18n.phonenumbers.NumberFormat"},1:{name:"pattern",required:!0,c:9,type:String},2:{name:"format",required:!0,c:9,type:String},3:{name:"leading_digits_pattern",G:!0,c:9,type:String},4:{name:"national_prefix_formatting_rule",c:9,type:String},6:{name:"national_prefix_optional_when_formatting",c:8,type:Boolean},5:{name:"domestic_carrier_code_formatting_rule",c:9,type:String}})),Z},v.ctor=v,v.ctor.i=v.prototype.i,d.prototype.i=function(){return z||(z=y(d,{0:{name:"PhoneNumberDesc",I:"i18n.phonenumbers.PhoneNumberDesc"},2:{name:"national_number_pattern",c:9,type:String},3:{name:"possible_number_pattern",c:9,type:String},6:{name:"example_number",c:9,type:String},7:{name:"national_number_matcher_data",c:12,type:String},8:{name:"possible_number_matcher_data",c:12,type:String}})),z},d.ctor=d,d.ctor.i=d.prototype.i,_.prototype.i=function(){return X||(X=y(_,{0:{name:"PhoneMetadata",I:"i18n.phonenumbers.PhoneMetadata"},1:{name:"general_desc",c:11,type:d},2:{name:"fixed_line",c:11,type:d},3:{name:"mobile",c:11,type:d},4:{name:"toll_free",c:11,type:d},5:{name:"premium_rate",c:11,type:d},6:{name:"shared_cost",c:11,type:d},7:{name:"personal_number",c:11,type:d},8:{name:"voip",c:11,type:d},21:{name:"pager",c:11,type:d},25:{name:"uan",c:11,type:d},27:{name:"emergency",c:11,type:d},28:{name:"voicemail",c:11,type:d},24:{name:"no_international_dialling",c:11,type:d},9:{name:"id",required:!0,c:9,type:String},10:{name:"country_code",c:5,type:Number},11:{name:"international_prefix",c:9,type:String},17:{name:"preferred_international_prefix",c:9,type:String},12:{name:"national_prefix",c:9,type:String},13:{name:"preferred_extn_prefix",c:9,type:String},15:{name:"national_prefix_for_parsing",c:9,type:String},16:{name:"national_prefix_transform_rule",c:9,type:String},18:{name:"same_mobile_and_fixed_line_pattern",c:8,defaultValue:!1,type:Boolean},19:{name:"number_format",G:!0,c:11,type:v},20:{name:"intl_number_format",G:!0,c:11,type:v},22:{name:"main_country_for_code",c:8,defaultValue:!1,type:Boolean},23:{name:"leading_digits",c:9,type:String},26:{name:"leading_zero_possible",c:8,defaultValue:!1,type:Boolean}})),X},_.ctor=_,_.ctor.i=_.prototype.i,S.prototype.a=function(t){throw new t.b,Error("Unimplemented")},S.prototype.b=function(t,n){if(11==t.a||10==t.a)return n instanceof f?n:this.a(t.j.prototype.i(),n);if(14==t.a){if("string"==typeof n&&Q.test(n)){var e=Number(n);if(e>0)return e}return n}if(!t.h)return n;if(e=t.j,e===String){if("number"==typeof n)return String(n)}else if(e===Number&&"string"==typeof n&&("Infinity"===n||"-Infinity"===n||"NaN"===n||Q.test(n)))return Number(n);return n};var Q=/^-?[0-9]+$/;n(w,S),w.prototype.a=function(t,n){var e=new t.b;return e.g=this,e.a=n,e.b={},e},n(A,w),A.prototype.b=function(t,n){return 8==t.a?!!n:S.prototype.b.apply(this,arguments)},A.prototype.a=function(t,n){return A.M.a.call(this,t,n)};/*

 Copyright (C) 2010 The Libphonenumber Authors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
var W={1:"US AG AI AS BB BM BS CA DM DO GD GU JM KN KY LC MP MS PR SX TC TT VC VG VI".split(" ")},tt={US:[null,[null,null,"[2-9]\\d{9}","\\d{7}(?:\\d{3})?"],[null,null,"(?:2(?:0[1-35-9]|1[02-9]|2[04589]|3[149]|4[08]|5[1-46]|6[0279]|7[026]|8[13])|3(?:0[1-57-9]|1[02-9]|2[0135]|3[014679]|4[67]|5[12]|6[014]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[0235]|58|69|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-37]|7[013-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[03689]|3[016]|4[16]|5[017]|6[0-279]|78|8[12])|7(?:0[1-46-8]|1[02-9]|2[0457]|3[1247]|4[037]|5[47]|6[02359]|7[02-59]|8[156])|8(?:0[1-68]|1[02-8]|28|3[0-25]|4[3578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[01678]|4[0179]|5[12469]|7[0-3589]|8[0459]))[2-9]\\d{6}","\\d{7}(?:\\d{3})?",null,null,"2015555555"],[null,null,"(?:2(?:0[1-35-9]|1[02-9]|2[04589]|3[149]|4[08]|5[1-46]|6[0279]|7[026]|8[13])|3(?:0[1-57-9]|1[02-9]|2[0135]|3[014679]|4[67]|5[12]|6[014]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[0235]|58|69|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-37]|7[013-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[03689]|3[016]|4[16]|5[017]|6[0-279]|78|8[12])|7(?:0[1-46-8]|1[02-9]|2[0457]|3[1247]|4[037]|5[47]|6[02359]|7[02-59]|8[156])|8(?:0[1-68]|1[02-8]|28|3[0-25]|4[3578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[01678]|4[0179]|5[12469]|7[0-3589]|8[0459]))[2-9]\\d{6}","\\d{7}(?:\\d{3})?",null,null,"2015555555"],[null,null,"8(?:00|44|55|66|77|88)[2-9]\\d{6}","\\d{10}",null,null,"8002345678"],[null,null,"900[2-9]\\d{6}","\\d{10}",null,null,"9002345678"],[null,null,"NA","NA"],[null,null,"5(?:00|33|44|66|77|88)[2-9]\\d{6}","\\d{10}",null,null,"5002345678"],[null,null,"NA","NA"],"US",1,"011","1",null,null,"1",null,null,1,[[null,"(\\d{3})(\\d{4})","$1-$2",null,null,null,1],[null,"(\\d{3})(\\d{3})(\\d{4})","($1) $2-$3",null,null,null,1]],[[null,"(\\d{3})(\\d{3})(\\d{4})","$1-$2-$3"]],[null,null,"NA","NA"],1,null,[null,null,"NA","NA"],[null,null,"NA","NA"],null,null,[null,null,"NA","NA"]]};x.b=function(){return x.a?x.a:x.a=new x};var nt={0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9","０":"0","１":"1","２":"2","３":"3","４":"4","５":"5","６":"6","７":"7","８":"8","９":"9","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9"},et=RegExp("[+＋]+"),rt=RegExp("([0-9０-９٠-٩۰-۹])"),it=/^\(?\$1\)?$/,at=new _;m(at,11,"NA");var lt=/\[([^\[\]])*\]/g,ot=/\d(?=[^,}][^,}])/g,ut=RegExp("^[-x‐-―−ー－-／  ­​⁠　()（）［］.\\[\\]/~⁓∼～]*(\\$\\d[-x‐-―−ー－-／  ­​⁠　()（）［］.\\[\\]/~⁓∼～]*)+$"),st=/[- ]/;$.prototype.K=function(){this.B="",r(this.h),r(this.u),r(this.m),this.s=0,this.v="",r(this.b),this.l="",r(this.a),this.j=!0,this.w=this.o=this.D=!1,this.f=[],this.A=!1,this.g!=this.J&&(this.g=C(this,this.C))},$.prototype.L=function(t){return this.B=R(this,t)},t("Cleave.AsYouTypeFormatter",$),t("Cleave.AsYouTypeFormatter.prototype.inputDigit",$.prototype.L),t("Cleave.AsYouTypeFormatter.prototype.clear",$.prototype.K)}.call("object"==typeof global&&global?global:window);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = {"screen-small":375,"screen-medium":700,"screen-large":1024,"screen-xlarge":1200}

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {// Resize reCAPTCHA to fit width of container
// Since it has a fixed width, we're scaling
// using CSS3 transforms
// ------------------------------------------
// captchaScale = containerWidth / elementWidth

/* harmony default export */ __webpack_exports__["a"] = (function () {
  function scaleCaptcha() {
    // Width of the reCAPTCHA element, in pixels
    var reCaptchaWidth = 304;
    // Get the containing element's width
    var containerWidth = $('.sms-form-wrapper').width();

    // Only scale the reCAPTCHA if it won't fit
    // inside the container
    if (reCaptchaWidth > containerWidth) {
      // Calculate the scale
      var captchaScale = containerWidth / reCaptchaWidth;
      // Apply the transformation
      $('.g-recaptcha').css({
        transform: 'scale(' + captchaScale + ')'
      });
    }
  }

  $(function () {
    // Initialize scaling
    scaleCaptcha();
  });

  $(window).resize(function () {
    // Update scaling on window resize
    // Uses jQuery throttle plugin to limit strain on the browser
    scaleCaptcha();
  });
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/**
* Home Rotating Text Animation
* Referred from Stackoverflow
* @see https://stackoverflow.com/questions/2771789/changing-text-periodically-in-a-span-from-an-array-with-jquery/2772278#2772278
*/

/* harmony default export */ __webpack_exports__["a"] = (function () {
  var terms = [];

  $('.rotating-text__entry').each(function (i, e) {
    if ($(e).text().trim() !== '') {
      terms.push($(e).text());
    }
  });

  function rotateTerm() {
    var ct = $("#rotate").data("term") || 0;
    $("#rotate").data("term", ct === terms.length - 1 ? 0 : ct + 1).text(terms[ct]).fadeIn().delay(2000).fadeOut(200, rotateTerm);
  }
  $(rotateTerm);
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_miss_plete_js__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_miss_plete_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_miss_plete_js__);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Search = function () {
  function Search() {
    _classCallCheck(this, Search);
  }

  /**
   * Initializes the module
   */


  _createClass(Search, [{
    key: 'init',
    value: function init() {
      this._inputs = document.querySelectorAll(Search.selectors.MAIN);

      if (!this._inputs) return;

      for (var i = this._inputs.length - 1; i >= 0; i--) {
        this._suggestions(this._inputs[i]);
      }
    }

    /**
     * Initializes the suggested search term dropdown.
     * @param  {object} input The search input.
     */

  }, {
    key: '_suggestions',
    value: function _suggestions(input) {
      var data = JSON.parse(input.dataset.jsSearchSuggestions);

      input._MissPlete = new __WEBPACK_IMPORTED_MODULE_0_miss_plete_js___default.a({
        input: input,
        options: data,
        className: input.dataset.jsSearchDropdownClass
      });
    }
  }]);

  return Search;
}();

Search.selectors = {
  MAIN: '[data-js*="search"]'
};

/* harmony default export */ __webpack_exports__["a"] = (Search);

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MissPlete"] = factory();
	else
		root["MissPlete"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _jaroWinkler = __webpack_require__(2);
	
	var _jaroWinkler2 = _interopRequireDefault(_jaroWinkler);
	
	var _memoize = __webpack_require__(3);
	
	var _memoize2 = _interopRequireDefault(_memoize);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MissPlete = function () {
	  function MissPlete(_ref) {
	    var _this = this;
	
	    var input = _ref.input,
	        options = _ref.options,
	        className = _ref.className,
	        _ref$scoreFn = _ref.scoreFn,
	        scoreFn = _ref$scoreFn === undefined ? (0, _memoize2.default)(MissPlete.scoreFn) : _ref$scoreFn,
	        _ref$listItemFn = _ref.listItemFn,
	        listItemFn = _ref$listItemFn === undefined ? MissPlete.listItemFn : _ref$listItemFn;
	
	    _classCallCheck(this, MissPlete);
	
	    Object.assign(this, { input: input, options: options, className: className, scoreFn: scoreFn, listItemFn: listItemFn });
	
	    this.scoredOptions = null;
	    this.container = null;
	    this.ul = null;
	    this.highlightedIndex = -1;
	
	    this.input.addEventListener('input', function () {
	      if (_this.input.value.length > 0) {
	        _this.scoredOptions = _this.options.map(function (option) {
	          return scoreFn(_this.input.value, option);
	        }).sort(function (a, b) {
	          return b.score - a.score;
	        });
	      } else {
	        _this.scoredOptions = [];
	      }
	      _this.renderOptions();
	    });
	
	    this.input.addEventListener('keydown', function (event) {
	      if (_this.ul) {
	        // dropdown visible?
	        switch (event.keyCode) {
	          case 13:
	            _this.select();
	            break;
	          case 27:
	            // Esc
	            _this.removeDropdown();
	            break;
	          case 40:
	            // Down arrow
	            // Otherwise up arrow places the cursor at the beginning of the
	            // field, and down arrow at the end
	            event.preventDefault();
	            _this.changeHighlightedOption(_this.highlightedIndex < _this.ul.children.length - 1 ? _this.highlightedIndex + 1 : -1);
	            break;
	          case 38:
	            // Up arrow
	            event.preventDefault();
	            _this.changeHighlightedOption(_this.highlightedIndex > -1 ? _this.highlightedIndex - 1 : _this.ul.children.length - 1);
	            break;
	        }
	      }
	    });
	
	    this.input.addEventListener('blur', function (event) {
	      _this.removeDropdown();
	      _this.highlightedIndex = -1;
	    });
	  } // end constructor
	
	  _createClass(MissPlete, [{
	    key: 'getSiblingIndex',
	    value: function getSiblingIndex(node) {
	      var index = -1;
	      var n = node;
	      do {
	        index++;
	        n = n.previousElementSibling;
	      } while (n);
	      return index;
	    }
	  }, {
	    key: 'renderOptions',
	    value: function renderOptions() {
	      var _this2 = this;
	
	      var documentFragment = document.createDocumentFragment();
	
	      this.scoredOptions.every(function (scoredOption, i) {
	        var listItem = _this2.listItemFn(scoredOption, i);
	        listItem && documentFragment.appendChild(listItem);
	        return !!listItem;
	      });
	
	      this.removeDropdown();
	      this.highlightedIndex = -1;
	
	      if (documentFragment.hasChildNodes()) {
	        var newUl = document.createElement("ul");
	        newUl.addEventListener('mouseover', function (event) {
	          if (event.target.tagName === 'LI') {
	            _this2.changeHighlightedOption(_this2.getSiblingIndex(event.target));
	          }
	        });
	
	        newUl.addEventListener('mouseleave', function () {
	          _this2.changeHighlightedOption(-1);
	        });
	
	        newUl.addEventListener('mousedown', function (event) {
	          return event.preventDefault();
	        });
	
	        newUl.addEventListener('click', function (event) {
	          if (event.target.tagName === 'LI') {
	            _this2.select();
	          }
	        });
	
	        newUl.appendChild(documentFragment);
	
	        // See CSS to understand why the <ul> has to be wrapped in a <div>
	        var newContainer = document.createElement("div");
	        newContainer.className = this.className;
	        newContainer.appendChild(newUl);
	
	        // Inserts the dropdown just after the <input> element
	        this.input.parentNode.insertBefore(newContainer, this.input.nextSibling);
	        this.container = newContainer;
	        this.ul = newUl;
	      }
	    }
	  }, {
	    key: 'changeHighlightedOption',
	    value: function changeHighlightedOption(newHighlightedIndex) {
	      if (newHighlightedIndex >= -1 && newHighlightedIndex < this.ul.children.length) {
	        // If any option already selected, then unselect it
	        if (this.highlightedIndex !== -1) {
	          this.ul.children[this.highlightedIndex].classList.remove("highlight");
	        }
	
	        this.highlightedIndex = newHighlightedIndex;
	
	        if (this.highlightedIndex !== -1) {
	          this.ul.children[this.highlightedIndex].classList.add("highlight");
	        }
	      }
	    }
	  }, {
	    key: 'select',
	    value: function select() {
	      if (this.highlightedIndex !== -1) {
	        this.input.value = this.scoredOptions[this.highlightedIndex].displayValue;
	        this.removeDropdown();
	      }
	    }
	  }, {
	    key: 'removeDropdown',
	    value: function removeDropdown() {
	      this.container && this.container.remove();
	      this.container = null;
	      this.ul = null;
	    }
	  }], [{
	    key: 'scoreFn',
	    value: function scoreFn(inputValue, optionSynonyms) {
	      var closestSynonym = null;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = optionSynonyms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var synonym = _step.value;
	
	          var similarity = (0, _jaroWinkler2.default)(synonym.trim().toLowerCase(), inputValue.trim().toLowerCase());
	          if (closestSynonym === null || similarity > closestSynonym.similarity) {
	            closestSynonym = { similarity: similarity, value: synonym };
	            if (similarity === 1) {
	              break;
	            }
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return {
	        score: closestSynonym.similarity,
	        displayValue: optionSynonyms[0]
	      };
	    }
	  }, {
	    key: 'listItemFn',
	    value: function listItemFn(scoredOption, itemIndex) {
	      var li = itemIndex > MissPlete.MAX_ITEMS ? null : document.createElement("li");
	      li && li.appendChild(document.createTextNode(scoredOption.displayValue));
	      return li;
	    }
	  }, {
	    key: 'MAX_ITEMS',
	    get: function get() {
	      return 8;
	    }
	  }]);
	
	  return MissPlete;
	}();
	
	exports.default = MissPlete;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.default = function (s1, s2) {
	  var prefixScalingFactor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.2;
	
	  var jaroSimilarity = jaro(s1, s2);
	
	  var commonPrefixLength = 0;
	  for (var i = 0; i < s1.length; i++) {
	    if (s1[i] === s2[i]) {
	      commonPrefixLength++;
	    } else {
	      break;
	    }
	  }
	
	  return jaroSimilarity + Math.min(commonPrefixLength, 4) * prefixScalingFactor * (1 - jaroSimilarity);
	};
	
	// https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
	
	function jaro(s1, s2) {
	  var shorter = void 0,
	      longer = void 0;
	
	  var _ref = s1.length > s2.length ? [s1, s2] : [s2, s1];
	
	  var _ref2 = _slicedToArray(_ref, 2);
	
	  longer = _ref2[0];
	  shorter = _ref2[1];
	
	
	  var matchingWindow = Math.floor(longer.length / 2) - 1;
	  var shorterMatches = [];
	  var longerMatches = [];
	
	  for (var i = 0; i < shorter.length; i++) {
	    var ch = shorter[i];
	    var windowStart = Math.max(0, i - matchingWindow);
	    var windowEnd = Math.min(i + matchingWindow + 1, longer.length);
	    for (var j = windowStart; j < windowEnd; j++) {
	      if (longerMatches[j] === undefined && ch === longer[j]) {
	        shorterMatches[i] = longerMatches[j] = ch;
	        break;
	      }
	    }
	  }
	
	  var shorterMatchesString = shorterMatches.join("");
	  var longerMatchesString = longerMatches.join("");
	  var numMatches = shorterMatchesString.length;
	
	  var transpositions = 0;
	  for (var _i = 0; _i < shorterMatchesString.length; _i++) {
	    if (shorterMatchesString[_i] !== longerMatchesString[_i]) {
	      transpositions++;
	    }
	  }
	
	  return numMatches > 0 ? (numMatches / shorter.length + numMatches / longer.length + (numMatches - Math.floor(transpositions / 2)) / numMatches) / 3.0 : 0;
	}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (fn) {
	  var cache = {};
	
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    var key = JSON.stringify(args);
	    return cache[key] || (cache[key] = fn.apply(null, args));
	  };
	};

/***/ })
/******/ ])
});
;
//# sourceMappingURL=bundle.js.map

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_forEach__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dataset_js__ = __webpack_require__(14);
/**
 * ToggleOpen module
 * @module modules/toggleOpen
 */




/**
 * Toggles an element open/closed.
 * @param {string} openClass - The class to toggle on/off
 */
/* harmony default export */ __webpack_exports__["a"] = (function (openClass) {
  if (!openClass) openClass = 'is-open';

  var linkActiveClass = 'is-active';
  var toggleElems = document.querySelectorAll('[data-toggle]');

  if (!toggleElems) return;

  /**
  * For each toggle element, get its target from the data-toggle attribute.
  * Bind an event handler to toggle the openClass on/off on the target element
  * when the toggle element is clicked.
  */
  __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default()(toggleElems, function (toggleElem) {
    var targetElemSelector = Object(__WEBPACK_IMPORTED_MODULE_1__dataset_js__["a" /* default */])(toggleElem, 'toggle');

    if (!targetElemSelector) return;

    var targetElem = document.getElementById(targetElemSelector);

    if (!targetElem) return;

    toggleElem.addEventListener('click', function (event) {
      var toggleEvent = void 0;
      var toggleClass = toggleElem.dataset.toggleClass ? toggleElem.dataset.toggleClass : openClass;

      event.preventDefault();

      // Toggle the element's active class
      toggleElem.classList.toggle(linkActiveClass);

      // Toggle custom class if it is set
      if (toggleClass !== openClass) targetElem.classList.toggle(toggleClass);

      // Toggle the default open class
      targetElem.classList.toggle(openClass);

      // Toggle the appropriate aria hidden attribute
      targetElem.setAttribute('aria-hidden', !targetElem.classList.contains(toggleClass));

      // Fire the custom open state event to trigger open functions
      if (typeof window.CustomEvent === 'function') {
        toggleEvent = new CustomEvent('changeOpenState', {
          detail: targetElem.classList.contains(openClass)
        });
      } else {
        toggleEvent = document.createEvent('CustomEvent');
        toggleEvent.initCustomEvent('changeOpenState', true, true, {
          detail: targetElem.classList.contains(openClass)
        });
      }

      targetElem.dispatchEvent(toggleEvent);
    });
  });
});

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* eslint-env browser */


(function (window, $) {
  'use strict';

  // Attach site-wide event listeners.

  $('body').on('click', '.js-simple-toggle', function (e) {
    // Simple toggle that add/removes "active" and "hidden" classes, as well as
    // applying appropriate aria-hidden value to a specified target.
    // TODO: There are a few simlar toggles on the site that could be
    // refactored to use this class.
    e.preventDefault();
    var $target = $(e.currentTarget).attr('href') ? $($(e.currentTarget).attr('href')) : $($(e.currentTarget).data('target'));
    $(e.currentTarget).toggleClass('active');
    $target.toggleClass('active hidden').prop('aria-hidden', $target.hasClass('hidden'));
  }).on('click', '.js-show-nav', function (e) {
    // Shows the mobile nav by applying "nav-active" cass to the body.
    e.preventDefault();
    $(e.delegateTarget).addClass('nav-active');
    $('.nav-overlay').show();
  }).on('click', '.js-hide-nav', function (e) {
    // Hides the mobile nav.
    e.preventDefault();
    $('.nav-overlay').hide();
    $(e.delegateTarget).removeClass('nav-active');
  });
  // END TODO
})(window, __WEBPACK_IMPORTED_MODULE_0_jquery___default.a);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzQxNmMzM2Y5NjdmZmY0YmQ3MWQiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwialF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mb3JFYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZGF0YXNldC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9hY2NvcmRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlFYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VFYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3JPd24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gva2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJndW1lbnRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuYXJ5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdEZ1bmN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaWRlbnRpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc2ltcGxlQWNjb3JkaW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL29mZmNhbnZhcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9vdmVybGF5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3N0aWNrTmF2LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9ub3cuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b051bWJlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9pbWFnZXNyZWFkeS9kaXN0L2ltYWdlc3JlYWR5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3NlY3Rpb25IaWdobGlnaHRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9zdGF0aWNDb2x1bW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvYWxlcnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvcmVhZENvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9jcmVhdGVDb29raWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZ2V0RG9tYWluLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2JzZHRvb2xzLXNpZ251cC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdmVuZG9yL2JzZC1zaWdudXAtanNhcGktc2ltcGxlLWRldi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9mb3JtRWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9kaXNwYXRjaEV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2ZhY2V0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9vd2xTZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9pT1M3SGFjay5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9zaGFyZS1mb3JtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcy1jb29raWUvc3JjL2pzLmNvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdmVuZG9yL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvdW5kZXJzY29yZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2xlYXZlLmpzL2Rpc3QvY2xlYXZlLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2xlYXZlLmpzL2Rpc3QvYWRkb25zL2NsZWF2ZS1waG9uZS51cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmFyaWFibGVzLmpzb24iLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvY2FwdGNoYVJlc2l6ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9yb3RhdGluZ1RleHRBbmltYXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc2VhcmNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9taXNzLXBsZXRlLWpzL2Rpc3QvYnVuZGxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU9wZW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvdG9nZ2xlTWVudS5qcyJdLCJuYW1lcyI6WyJlbGVtIiwiYXR0ciIsImRhdGFzZXQiLCJnZXRBdHRyaWJ1dGUiLCJyZWFkeSIsImZuIiwiZG9jdW1lbnQiLCJyZWFkeVN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImluaXQiLCJ0b2dnbGVPcGVuIiwiYWxlcnQiLCJvZmZjYW52YXMiLCJhY2NvcmRpb24iLCJzaW1wbGVBY2NvcmRpb24iLCJvdmVybGF5IiwiZmFjZXRzIiwic3RhdGljQ29sdW1uIiwic3RpY2tOYXYiLCJic2R0b29sc1NpZ251cCIsImZvcm1FZmZlY3RzIiwib3dsU2V0dGluZ3MiLCJpT1M3SGFjayIsImNhcHRjaGFSZXNpemUiLCJyb3RhdGluZ1RleHRBbmltYXRpb24iLCJzZWN0aW9uSGlnaGxpZ2h0ZXIiLCJ3aW5kb3ciLCIkIiwiU2hhcmVGb3JtIiwiQ3NzQ2xhc3MiLCJGT1JNIiwiZWFjaCIsImkiLCJlbCIsInNoYXJlRm9ybSIsImpRdWVyeSIsImNvbnZlcnRIZWFkZXJUb0J1dHRvbiIsIiRoZWFkZXJFbGVtIiwiZ2V0Iiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImhlYWRlckVsZW0iLCJuZXdIZWFkZXJFbGVtIiwiY3JlYXRlRWxlbWVudCIsImZvckVhY2giLCJhdHRyaWJ1dGVzIiwic2V0QXR0cmlidXRlIiwibm9kZVZhbHVlIiwiJG5ld0hlYWRlckVsZW0iLCJodG1sIiwiYXBwZW5kIiwidG9nZ2xlSGVhZGVyIiwibWFrZVZpc2libGUiLCJpbml0aWFsaXplSGVhZGVyIiwiJHJlbGF0ZWRQYW5lbCIsImlkIiwiYWRkQ2xhc3MiLCJvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJ0cmlnZ2VyIiwiYmx1ciIsInRvZ2dsZVBhbmVsIiwiJHBhbmVsRWxlbSIsImNzcyIsImRhdGEiLCJmaW5kIiwiaW5pdGlhbGl6ZVBhbmVsIiwibGFiZWxsZWRieSIsImNhbGN1bGF0ZVBhbmVsSGVpZ2h0IiwiaGVpZ2h0IiwidG9nZ2xlQWNjb3JkaW9uSXRlbSIsIiRpdGVtIiwicmVtb3ZlQ2xhc3MiLCJpbml0aWFsaXplQWNjb3JkaW9uSXRlbSIsIiRhY2NvcmRpb25Db250ZW50IiwiJGFjY29yZGlvbkluaXRpYWxIZWFkZXIiLCJvZmYiLCJsZW5ndGgiLCIkYWNjb3JkaW9uSGVhZGVyIiwidGFnTmFtZSIsInJlcGxhY2VXaXRoIiwiaW5pdGlhbGl6ZSIsIiRhY2NvcmRpb25FbGVtIiwibXVsdGlTZWxlY3RhYmxlIiwiY2hpbGRyZW4iLCJwcm94eSIsIiRuZXdJdGVtIiwidGFyZ2V0IiwiY2xvc2VzdCIsImhhc0NsYXNzIiwiJG9wZW5JdGVtIiwicmVJbml0aWFsaXplIiwicmVJbml0aWFsaXplQWNjb3JkaW9uIiwiJGFjY29yZGlvbnMiLCJub3QiLCJjbGljayIsImNoZWNrRWxlbWVudCIsIm5leHQiLCJpcyIsInNsaWRlVXAiLCJzbGlkZURvd24iLCJvZmZDYW52YXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwib2ZmQ2FudmFzRWxlbSIsIm9mZkNhbnZhc1NpZGUiLCJxdWVyeVNlbGVjdG9yIiwiZGV0YWlsIiwidGVzdCIsInRhYkluZGV4IiwiZm9jdXMiLCJvdmVybGF5RWxlbSIsInN0aWNreU5hdiIsIiRlbGVtIiwiJGVsZW1Db250YWluZXIiLCIkZWxlbUFydGljbGUiLCJzZXR0aW5ncyIsInN0aWNreUNsYXNzIiwiYWJzb2x1dGVDbGFzcyIsImxhcmdlQnJlYWtwb2ludCIsImFydGljbGVDbGFzcyIsInN0aWNreU1vZGUiLCJpc1N0aWNreSIsImlzQWJzb2x1dGUiLCJzd2l0Y2hQb2ludCIsInN3aXRjaFBvaW50Qm90dG9tIiwibGVmdE9mZnNldCIsImVsZW1XaWR0aCIsImVsZW1IZWlnaHQiLCJ0b2dnbGVTdGlja3kiLCJjdXJyZW50U2Nyb2xsUG9zIiwic2Nyb2xsVG9wIiwidXBkYXRlRGltZW5zaW9ucyIsImlzT25TY3JlZW4iLCJmb3JjZUNsZWFyIiwibGVmdCIsIndpZHRoIiwidG9wIiwiYm90dG9tIiwic2V0T2Zmc2V0VmFsdWVzIiwib2Zmc2V0Iiwib3V0ZXJIZWlnaHQiLCJwYXJzZUludCIsIm91dGVyV2lkdGgiLCJzdGlja3lNb2RlT24iLCJ0aHJvdHRsZSIsIm9yaWdpbmFsRXZlbnQiLCJzdGlja3lNb2RlT2ZmIiwib25SZXNpemUiLCJsYXJnZU1vZGUiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImRlYm91bmNlIiwiaW1hZ2VzUmVhZHkiLCJib2R5IiwidGhlbiIsIndpbiIsInZpZXdwb3J0Iiwic2Nyb2xsTGVmdCIsInJpZ2h0IiwiYm91bmRzIiwiJHN0aWNreU5hdnMiLCIkb3V0ZXJDb250YWluZXIiLCIkYXJ0aWNsZSIsIiRuYXZpZ2F0aW9uTGlua3MiLCIkc2VjdGlvbnMiLCIkc2VjdGlvbnNSZXZlcnNlZCIsInJldmVyc2UiLCJzZWN0aW9uSWRUb25hdmlnYXRpb25MaW5rIiwib3B0aW1pemVkIiwic2Nyb2xsUG9zaXRpb24iLCJjdXJyZW50U2VjdGlvbiIsInNlY3Rpb25Ub3AiLCIkbmF2aWdhdGlvbkxpbmsiLCJzY3JvbGwiLCJzdGlja3lDb250ZW50Iiwibm90U3RpY2t5Q2xhc3MiLCJib3R0b21DbGFzcyIsImNhbGNXaW5kb3dQb3MiLCJzdGlja3lDb250ZW50RWxlbSIsImVsZW1Ub3AiLCJwYXJlbnRFbGVtZW50IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiaXNQYXN0Qm90dG9tIiwiaW5uZXJIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJvcGVuQ2xhc3MiLCJkaXNwbGF5QWxlcnQiLCJzaWJsaW5nRWxlbSIsImFsZXJ0SGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY3VycmVudFBhZGRpbmciLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInN0eWxlIiwicGFkZGluZ0JvdHRvbSIsInJlbW92ZUFsZXJ0UGFkZGluZyIsImNoZWNrQWxlcnRDb29raWUiLCJjb29raWVOYW1lIiwicmVhZENvb2tpZSIsImNvb2tpZSIsImFkZEFsZXJ0Q29va2llIiwiY3JlYXRlQ29va2llIiwiZ2V0RG9tYWluIiwibG9jYXRpb24iLCJhbGVydHMiLCJhbGVydFNpYmxpbmciLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwiUmVnRXhwIiwiZXhlYyIsInBvcCIsIm5hbWUiLCJ2YWx1ZSIsImRvbWFpbiIsImRheXMiLCJleHBpcmVzIiwiRGF0ZSIsImdldFRpbWUiLCJ0b0dNVFN0cmluZyIsInVybCIsInJvb3QiLCJwYXJzZVVybCIsImhyZWYiLCJob3N0bmFtZSIsInNsaWNlIiwibWF0Y2giLCJzcGxpdCIsImpvaW4iLCJyZXF1aXJlIiwiJHNpZ251cEZvcm1zIiwiZXJyb3JNc2ciLCJoYW5kbGVWYWxpZGF0aW9uIiwiZm9ybURhdGEiLCJub0Vycm9ycyIsIiRmb3JtIiwiJHJlcXVpcmVkRmllbGRzIiwiZmllbGROYW1lIiwiZmllbGRUeXBlIiwiZW1yZWdleCIsInVzcmVnZXgiLCJ0cmltIiwiaW5kZXgiLCJjaGVja2JveFZhbHVlIiwicHJvcCIsImNoZWNrYm94TmFtZSIsInN1YnN0cmluZyIsImhhbmRsZUVycm9ycyIsImVycm9ySlNPTiIsImZpZWxkX2Vycm9ycyIsImVycm9yIiwiJGZpZWxkIiwibWVzc2FnZSIsImhhbmRsZVN1Y2Nlc3MiLCJic2RTaWdudXAiLCJub19yZWRpcmVjdCIsInN0YXJ0UGF1c2VkIiwid2xvY2F0aW9uIiwidW5kZWZpbmVkIiwic2VyaWFsaXplT2JqZWN0IiwibyIsImEiLCJzZXJpYWxpemVBcnJheSIsInB1c2giLCJpbnRlcmFjdGl2ZVZhbGlkaXR5IiwicGx1Z2lubmFtZSIsImd1cCIsImd1cHJlZ2V4IiwicmVwbGFjZSIsInJlc3VsdHMiLCJzb3VyY2VTdHJpbmciLCJzdWJzb3VyY2VTdHJpbmciLCJ1cmxzb3VyY2UiLCJ1cmxzdWJzb3VyY2UiLCJwYXJzZVVSTCIsInAiLCJlcnJvckZpbHRlciIsImUiLCJtc2ciLCJyZXNwb25zZUpTT04iLCJwYXJzZUpTT04iLCJyZXNwb25zZVRleHQiLCJzdGF0dXMiLCJjb2RlIiwic3VjY2Vzc0ZpbHRlciIsInJlc3BvbnNlIiwiRGVmZXJyZWQiLCJyZWplY3RXaXRoIiwicmVjaGVja0lmVGhpc0lzU3RpbGxJbnZhbGlkIiwiZmllbGQiLCJiYWRpbnB1dCIsIm9uZSIsInZhbCIsInNldEN1c3RvbVZhbGlkaXR5IiwiZm9ybVN1Y2Nlc3MiLCJyZXN1bHQiLCJ0aGFua3NfdXJsIiwiZm9ybUZhaWx1cmUiLCJmdW5lcnJvciIsImNvbmZpZyIsImVycm9yc0FzT2JqZWN0IiwiZXJyIiwiJGVyckZpZWxkIiwiZXJyRmllbGQiLCJub1ZhbGlkYXRlIiwibm9faHRtbDV2YWxpZGF0ZSIsImVxIiwianNhcGlTdWJtaXQiLCJhY3Rpb24iLCJvcHMiLCJhcGlhY3Rpb24iLCJyZXF1ZXN0IiwiYWpheCIsInR5cGUiLCJtZXRob2QiLCJkYXRhVHlwZSIsInRpbWVvdXQiLCJjb250ZXh0IiwiYmVmb3JlU2VuZCIsImpxeGhyIiwicmVxdWVzdHNldHRpbmdzIiwicHJveHlhbGwiLCJjcm9zc0RvbWFpbiIsInN1cHBvcnQiLCJjb3JzIiwib2xkaWV4ZHIiLCJwcm90b2NvbCIsIm9sZHByb3h5Iiwic3RhdHVzVGV4dCIsImFsd2F5cyIsImRvbmUiLCJmYWlsIiwibm9ybWFsaXplU291cmNlRmllbGQiLCJleHRlcm5hbCIsIm9sZHZhbCIsImFwcGVuZFRvIiwicmVtb3ZlRGF0YSIsImluZGV4T2YiLCJub3NvdXJjZSIsImhhbmRsZUZvY3VzIiwid3JhcHBlckVsZW0iLCJwYXJlbnROb2RlIiwiaGFuZGxlQmx1ciIsImlucHV0cyIsImlucHV0RWxlbSIsImRpc3BhdGNoRXZlbnQiLCJldmVudFR5cGUiLCJjcmVhdGVFdmVudCIsImluaXRFdmVudCIsImNyZWF0ZUV2ZW50T2JqZWN0IiwiZmlyZUV2ZW50Iiwib3dsIiwib3dsQ2Fyb3VzZWwiLCJhbmltYXRlSW4iLCJhbmltYXRlT3V0IiwiaXRlbXMiLCJsb29wIiwibWFyZ2luIiwiZG90cyIsImF1dG9wbGF5IiwiYXV0b3BsYXlUaW1lb3V0IiwiYXV0b3BsYXlIb3ZlclBhdXNlIiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwic2Nyb2xsVG8iLCJWYXJpYWJsZXMiLCJfZWwiLCJfaXNWYWxpZCIsIl9pc0J1c3kiLCJfaXNEaXNhYmxlZCIsIl9pbml0aWFsaXplZCIsIl9yZWNhcHRjaGFSZXF1aXJlZCIsIl9yZWNhcHRjaGFWZXJpZmllZCIsIl9yZWNhcHRjaGFpbml0Iiwic2VsZWN0ZWQiLCJfbWFza1Bob25lIiwiU0hPV19ESVNDTEFJTUVSIiwiX2Rpc2NsYWltZXIiLCJfdmFsaWRhdGUiLCJfc3VibWl0IiwiZ3JlY2FwdGNoYSIsInJlc2V0IiwicGFyZW50cyIsIkVSUk9SX01TRyIsIl9zaG93RXJyb3IiLCJNZXNzYWdlIiwiUkVDQVBUQ0hBIiwidmlld0NvdW50IiwiQ29va2llcyIsIl9pbml0UmVjYXB0Y2hhIiwic2V0IiwiZm9jdXNvdXQiLCJyZW1vdmVBdHRyIiwiaW5wdXQiLCJjbGVhdmUiLCJwaG9uZSIsInBob25lUmVnaW9uQ29kZSIsImRlbGltaXRlciIsInZpc2libGUiLCIkZWwiLCIkY2xhc3MiLCJISURERU4iLCJBTklNQVRFX0RJU0NMQUlNRVIiLCJpbm5lcldpZHRoIiwiJHRhcmdldCIsInZhbGlkaXR5IiwiJHRlbCIsIl92YWxpZGF0ZVBob25lTnVtYmVyIiwiRVJST1IiLCJudW0iLCJfcGFyc2VQaG9uZU51bWJlciIsIlBIT05FIiwiUkVRVUlSRUQiLCIkZWxQYXJlbnRzIiwidGV4dCIsIlV0aWxpdHkiLCJsb2NhbGl6ZSIsIlNVQ0NFU1MiLCIkc3Bpbm5lciIsIlNQSU5ORVIiLCIkc3VibWl0IiwicGF5bG9hZCIsInNlcmlhbGl6ZSIsImRpc2FibGVkIiwiY3NzVGV4dCIsInBvc3QiLCJzdWNjZXNzIiwiX3Nob3dTdWNjZXNzIiwiSlNPTiIsInN0cmluZ2lmeSIsIlNFUlZFUiIsIiRzY3JpcHQiLCJhc3luYyIsImRlZmVyIiwic2NyZWVuZXJDYWxsYmFjayIsInJlbmRlciIsImdldEVsZW1lbnRCeUlkIiwic2NyZWVuZXJSZWNhcHRjaGEiLCJzY3JlZW5lclJlY2FwdGNoYVJlc2V0IiwiTkVFRFNfRElTQ0xBSU1FUiIsIlNVQk1JVF9CVE4iLCJFTUFJTCIsImdldFVybFBhcmFtZXRlciIsInF1ZXJ5U3RyaW5nIiwicXVlcnkiLCJzZWFyY2giLCJwYXJhbSIsInJlZ2V4IiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZmluZFZhbHVlcyIsIm9iamVjdCIsInRhcmdldFByb3AiLCJ0cmF2ZXJzZU9iamVjdCIsIm9iaiIsImtleSIsImhhc093blByb3BlcnR5IiwidG9Eb2xsYXJBbW91bnQiLCJNYXRoIiwiYWJzIiwicm91bmQiLCJwYXJzZUZsb2F0IiwidG9GaXhlZCIsInNsdWdOYW1lIiwibG9jYWxpemVkU3RyaW5ncyIsIkxPQ0FMSVpFRF9TVFJJTkdTIiwiXyIsImZpbmRXaGVyZSIsInNsdWciLCJsYWJlbCIsImlzVmFsaWRFbWFpbCIsImVtYWlsIiwiY2hlY2tWYWxpZGl0eSIsIkNPTkZJRyIsIkRFRkFVTFRfTEFUIiwiREVGQVVMVF9MTkciLCJHT09HTEVfQVBJIiwiR09PR0xFX1NUQVRJQ19BUEkiLCJHUkVDQVBUQ0hBX1NJVEVfS0VZIiwiU0NSRUVORVJfTUFYX0hPVVNFSE9MRCIsIlVSTF9QSU5fQkxVRSIsIlVSTF9QSU5fQkxVRV8yWCIsIlVSTF9QSU5fR1JFRU4iLCJVUkxfUElOX0dSRUVOXzJYIiwic2NhbGVDYXB0Y2hhIiwicmVDYXB0Y2hhV2lkdGgiLCJjb250YWluZXJXaWR0aCIsImNhcHRjaGFTY2FsZSIsInRyYW5zZm9ybSIsInJlc2l6ZSIsInRlcm1zIiwicm90YXRlVGVybSIsImN0IiwiZmFkZUluIiwiZGVsYXkiLCJmYWRlT3V0IiwiU2VhcmNoIiwiX2lucHV0cyIsInNlbGVjdG9ycyIsIk1BSU4iLCJfc3VnZ2VzdGlvbnMiLCJwYXJzZSIsImpzU2VhcmNoU3VnZ2VzdGlvbnMiLCJfTWlzc1BsZXRlIiwib3B0aW9ucyIsImNsYXNzTmFtZSIsImpzU2VhcmNoRHJvcGRvd25DbGFzcyIsImxpbmtBY3RpdmVDbGFzcyIsInRvZ2dsZUVsZW1zIiwidG9nZ2xlRWxlbSIsInRhcmdldEVsZW1TZWxlY3RvciIsInRhcmdldEVsZW0iLCJ0b2dnbGVFdmVudCIsInRvZ2dsZUNsYXNzIiwidG9nZ2xlIiwiY29udGFpbnMiLCJDdXN0b21FdmVudCIsImluaXRDdXN0b21FdmVudCIsImN1cnJlbnRUYXJnZXQiLCJkZWxlZ2F0ZVRhcmdldCIsInNob3ciLCJoaWRlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REEsd0I7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEIsV0FBVyxTQUFTO0FBQ3BCLGFBQWEsYUFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FB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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3JCQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNqQkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMxQkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG9CQUFvQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFEQUFxRCxjQUFjO0FBQ25FO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixxQkFBcUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVywwREFBMEQ7QUFDckUsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdB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Q0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sZUFBZTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixlQUFlO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSx5QkFBeUIsZ0JBQWdCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixZQUFZO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFlBQVk7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFlBQVk7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLDRDQUE0QyxtQkFBbUI7QUFDL0Q7QUFDQTtBQUNBLHlDQUF5QyxZQUFZO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2RUFBNkU7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1C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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLDBCQUEwQixpR0FBaUc7O0FBRTNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTs7QUFFUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7O0FBRVY7QUFDQTtBQUNBLFVBQVU7O0FBRVY7QUFDQTtBQUNBLFVBQVU7O0FBRVY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOztBQUVWOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1RUFBdUUsZ0VBQWdFO0FBQ3ZJOztBQUVBO0FBQ0E7QUFD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d0IsUUFBeEIsQ0FBRixDQUZKO0FBR0F0QyxNQUFFNFAsRUFBRWdQLGFBQUosRUFBbUJMLFdBQW5CLENBQStCLFFBQS9CO0FBQ0E1RyxZQUFRNEcsV0FBUixDQUFvQixlQUFwQixFQUNLNVEsSUFETCxDQUNVLGFBRFYsRUFDeUJnSyxRQUFRNVQsUUFBUixDQUFpQixRQUFqQixDQUR6QjtBQUVELEdBWkQsRUFZR2pDLEVBWkgsQ0FZTSxPQVpOLEVBWWUsY0FaZixFQVkrQixhQUFLO0FBQ2xDO0FBQ0E4TixNQUFFNU4sY0FBRjtBQUNBaEMsTUFBRTRQLEVBQUVpUCxjQUFKLEVBQW9CaGQsUUFBcEIsQ0FBNkIsWUFBN0I7QUFDQTdCLE1BQUUsY0FBRixFQUFrQjhlLElBQWxCO0FBQ0QsR0FqQkQsRUFpQkdoZCxFQWpCSCxDQWlCTSxPQWpCTixFQWlCZSxjQWpCZixFQWlCK0IsYUFBSztBQUNsQztBQUNBOE4sTUFBRTVOLGNBQUY7QUFDQWhDLE1BQUUsY0FBRixFQUFrQitlLElBQWxCO0FBQ0EvZSxNQUFFNFAsRUFBRWlQLGNBQUosRUFBb0IvYixXQUFwQixDQUFnQyxZQUFoQztBQUNELEdBdEJEO0FBdUJBO0FBRUQsQ0E3QkQsRUE2QkcvQyxNQTdCSCxFQTZCVyw4Q0E3QlgsRSIsImZpbGUiOiI3NDE2YzMzZjk2N2ZmZjRiZDcxZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDE1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3NDE2YzMzZjk2N2ZmZjRiZDcxZCIsIm1vZHVsZS5leHBvcnRzID0galF1ZXJ5O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwialF1ZXJ5XCJcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKSxcbiAgICBjYXN0RnVuY3Rpb24gPSByZXF1aXJlKCcuL19jYXN0RnVuY3Rpb24nKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIlxuICogcHJvcGVydHkgYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIHVzZSBgXy5mb3JJbmBcbiAqIG9yIGBfLmZvck93bmAgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNlZSBfLmZvckVhY2hSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZvckVhY2goWzEsIDJdLCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgYDFgIHRoZW4gYDJgLlxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAqICAgY29uc29sZS5sb2coa2V5KTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyAnYScgdGhlbiAnYicgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCkuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlFYWNoIDogYmFzZUVhY2g7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGNhc3RGdW5jdGlvbihpdGVyYXRlZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgZ2V0UmF3VGFnID0gcmVxdWlyZSgnLi9fZ2V0UmF3VGFnJyksXG4gICAgb2JqZWN0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19vYmplY3RUb1N0cmluZycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0VGFnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZyZWVHbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XHJcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xyXG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblx0XHRpZighbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gbW9kdWxlO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2UuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBub3cgPSByZXF1aXJlKCcuL25vdycpLFxuICAgIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2RlYm91bmNlLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiogVXRpbGl0eSBtb2R1bGUgdG8gZ2V0IHZhbHVlIG9mIGEgZGF0YSBhdHRyaWJ1dGVcbiogQHBhcmFtIHtvYmplY3R9IGVsZW0gLSBET00gbm9kZSBhdHRyaWJ1dGUgaXMgcmV0cmlldmVkIGZyb21cbiogQHBhcmFtIHtzdHJpbmd9IGF0dHIgLSBBdHRyaWJ1dGUgbmFtZSAoZG8gbm90IGluY2x1ZGUgdGhlICdkYXRhLScgcGFydClcbiogQHJldHVybiB7bWl4ZWR9IC0gVmFsdWUgb2YgZWxlbWVudCdzIGRhdGEgYXR0cmlidXRlXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZWxlbSwgYXR0cikge1xuICBpZiAodHlwZW9mIGVsZW0uZGF0YXNldCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGF0dHIpO1xuICB9XG4gIHJldHVybiBlbGVtLmRhdGFzZXRbYXR0cl07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9kYXRhc2V0LmpzIiwiaW1wb3J0IGFjY29yZGlvbiBmcm9tICcuL21vZHVsZXMvYWNjb3JkaW9uLmpzJztcbmltcG9ydCBzaW1wbGVBY2NvcmRpb24gZnJvbSAnLi9tb2R1bGVzL3NpbXBsZUFjY29yZGlvbi5qcyc7XG5pbXBvcnQgb2ZmY2FudmFzIGZyb20gJy4vbW9kdWxlcy9vZmZjYW52YXMuanMnO1xuaW1wb3J0IG92ZXJsYXkgZnJvbSAnLi9tb2R1bGVzL292ZXJsYXkuanMnO1xuaW1wb3J0IHN0aWNrTmF2IGZyb20gJy4vbW9kdWxlcy9zdGlja05hdi5qcyc7XG5pbXBvcnQgc2VjdGlvbkhpZ2hsaWdodGVyIGZyb20gJy4vbW9kdWxlcy9zZWN0aW9uSGlnaGxpZ2h0ZXIuanMnO1xuaW1wb3J0IHN0YXRpY0NvbHVtbiBmcm9tICcuL21vZHVsZXMvc3RhdGljQ29sdW1uLmpzJztcbmltcG9ydCBhbGVydCBmcm9tICcuL21vZHVsZXMvYWxlcnQuanMnO1xuaW1wb3J0IGJzZHRvb2xzU2lnbnVwIGZyb20gJy4vbW9kdWxlcy9ic2R0b29scy1zaWdudXAuanMnO1xuaW1wb3J0IGZvcm1FZmZlY3RzIGZyb20gJy4vbW9kdWxlcy9mb3JtRWZmZWN0cy5qcyc7XG5pbXBvcnQgZmFjZXRzIGZyb20gJy4vbW9kdWxlcy9mYWNldHMuanMnO1xuaW1wb3J0IG93bFNldHRpbmdzIGZyb20gJy4vbW9kdWxlcy9vd2xTZXR0aW5ncy5qcyc7XG5pbXBvcnQgaU9TN0hhY2sgZnJvbSAnLi9tb2R1bGVzL2lPUzdIYWNrLmpzJztcbmltcG9ydCBTaGFyZUZvcm0gZnJvbSAnLi9tb2R1bGVzL3NoYXJlLWZvcm0uanMnO1xuaW1wb3J0IGNhcHRjaGFSZXNpemUgZnJvbSAnLi9tb2R1bGVzL2NhcHRjaGFSZXNpemUuanMnO1xuaW1wb3J0IHJvdGF0aW5nVGV4dEFuaW1hdGlvbiBmcm9tICcuL21vZHVsZXMvcm90YXRpbmdUZXh0QW5pbWF0aW9uLmpzJztcbmltcG9ydCBTZWFyY2ggZnJvbSAnLi9tb2R1bGVzL3NlYXJjaC5qcyc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuaW1wb3J0IHRvZ2dsZU9wZW4gZnJvbSAnLi9tb2R1bGVzL3RvZ2dsZU9wZW4uanMnO1xuaW1wb3J0IHRvZ2dsZU1lbnUgZnJvbSAnLi9tb2R1bGVzL3RvZ2dsZU1lbnUuanMnO1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG5mdW5jdGlvbiByZWFkeShmbikge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfSBlbHNlIHtcbiAgICBmbigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHRvZ2dsZU9wZW4oJ2lzLW9wZW4nKTtcbiAgYWxlcnQoJ2lzLW9wZW4nKTtcbiAgb2ZmY2FudmFzKCk7XG4gIGFjY29yZGlvbigpO1xuICBzaW1wbGVBY2NvcmRpb24oKTtcbiAgb3ZlcmxheSgpO1xuXG4gIC8vIEZhY2V0V1AgcGFnZXNcbiAgZmFjZXRzKCk7XG5cbiAgLy8gSG9tZXBhZ2VcbiAgc3RhdGljQ29sdW1uKCk7XG4gIHN0aWNrTmF2KCk7XG4gIGJzZHRvb2xzU2lnbnVwKCk7XG4gIGZvcm1FZmZlY3RzKCk7XG4gIG93bFNldHRpbmdzKCk7XG4gIGlPUzdIYWNrKCk7XG4gIGNhcHRjaGFSZXNpemUoKTtcbiAgcm90YXRpbmdUZXh0QW5pbWF0aW9uKCk7XG4gIHNlY3Rpb25IaWdobGlnaHRlcigpO1xuXG4gIC8vIFNlYXJjaFxuICBuZXcgU2VhcmNoKCkuaW5pdCgpO1xufVxuXG5yZWFkeShpbml0KTtcblxuLy8gTWFrZSBjZXJ0YWluIGZ1bmN0aW9ucyBhdmFpbGFibGUgZ2xvYmFsbHlcbndpbmRvdy5hY2NvcmRpb24gPSBhY2NvcmRpb247XG5cbihmdW5jdGlvbih3aW5kb3csICQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvLyBJbml0aWFsaXplIHNoYXJlIGJ5IGVtYWlsL3NtcyBmb3Jtcy5cbiAgJChgLiR7U2hhcmVGb3JtLkNzc0NsYXNzLkZPUk19YCkuZWFjaCgoaSwgZWwpID0+IHtcbiAgICBjb25zdCBzaGFyZUZvcm0gPSBuZXcgU2hhcmVGb3JtKGVsKTtcbiAgICBzaGFyZUZvcm0uaW5pdCgpO1xuICB9KTtcbn0pKHdpbmRvdywgalF1ZXJ5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tYWluLmpzIiwiLyoqXG4gKiBBY2NvcmRpb24gbW9kdWxlXG4gKiBAbW9kdWxlIG1vZHVsZXMvYWNjb3JkaW9uXG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgLyoqXG4gICAqIENvbnZlcnQgYWNjb3JkaW9uIGhlYWRpbmcgdG8gYSBidXR0b25cbiAgICogQHBhcmFtIHtvYmplY3R9ICRoZWFkZXJFbGVtIC0galF1ZXJ5IG9iamVjdCBjb250YWluaW5nIG9yaWdpbmFsIGhlYWRlclxuICAgKiBAcmV0dXJuIHtvYmplY3R9IE5ldyBoZWFkaW5nIGVsZW1lbnRcbiAgICovXG4gIGZ1bmN0aW9uIGNvbnZlcnRIZWFkZXJUb0J1dHRvbigkaGVhZGVyRWxlbSkge1xuICAgIGlmICgkaGVhZGVyRWxlbS5nZXQoMCkubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2J1dHRvbicpIHtcbiAgICAgIHJldHVybiAkaGVhZGVyRWxlbTtcbiAgICB9XG4gICAgY29uc3QgaGVhZGVyRWxlbSA9ICRoZWFkZXJFbGVtLmdldCgwKTtcbiAgICBjb25zdCBuZXdIZWFkZXJFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZm9yRWFjaChoZWFkZXJFbGVtLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIG5ld0hlYWRlckVsZW0uc2V0QXR0cmlidXRlKGF0dHIubm9kZU5hbWUsIGF0dHIubm9kZVZhbHVlKTtcbiAgICB9KTtcbiAgICBuZXdIZWFkZXJFbGVtLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgICBjb25zdCAkbmV3SGVhZGVyRWxlbSA9ICQobmV3SGVhZGVyRWxlbSk7XG4gICAgJG5ld0hlYWRlckVsZW0uaHRtbCgkaGVhZGVyRWxlbS5odG1sKCkpO1xuICAgICRuZXdIZWFkZXJFbGVtLmFwcGVuZCgnPHN2ZyBjbGFzcz1cIm8tYWNjb3JkaW9uX19jYXJldCBpY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tY2FyZXQtZG93blwiPjwvdXNlPjwvc3ZnPicpO1xuICAgIHJldHVybiAkbmV3SGVhZGVyRWxlbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdmlzaWJpbGl0eSBhdHRyaWJ1dGVzIGZvciBoZWFkZXJcbiAgICogQHBhcmFtIHtvYmplY3R9ICRoZWFkZXJFbGVtIC0gVGhlIGFjY29yZGlvbiBoZWFkZXIgalF1ZXJ5IG9iamVjdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ha2VWaXNpYmxlIC0gV2hldGhlciB0aGUgaGVhZGVyJ3MgY29udGVudCBzaG91bGQgYmUgdmlzaWJsZVxuICAgKi9cbiAgZnVuY3Rpb24gdG9nZ2xlSGVhZGVyKCRoZWFkZXJFbGVtLCBtYWtlVmlzaWJsZSkge1xuICAgICRoZWFkZXJFbGVtLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBtYWtlVmlzaWJsZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGF0dHJpYnV0ZXMsIGNsYXNzZXMsIGFuZCBldmVudCBiaW5kaW5nIHRvIGFjY29yZGlvbiBoZWFkZXJcbiAgICogQHBhcmFtIHtvYmplY3R9ICRoZWFkZXJFbGVtIC0gVGhlIGFjY29yZGlvbiBoZWFkZXIgalF1ZXJ5IG9iamVjdFxuICAgKiBAcGFyYW0ge29iamVjdH0gJHJlbGF0ZWRQYW5lbCAtIFRoZSBwYW5lbCB0aGUgYWNjb3JkaW9uIGhlYWRlciBjb250cm9sc1xuICAgKi9cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZUhlYWRlcigkaGVhZGVyRWxlbSwgJHJlbGF0ZWRQYW5lbCkge1xuICAgICRoZWFkZXJFbGVtLmF0dHIoe1xuICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiBmYWxzZSxcbiAgICAgICdhcmlhLWNvbnRyb2xzJzogJHJlbGF0ZWRQYW5lbC5nZXQoMCkuaWQsXG4gICAgICAnYXJpYS1leHBhbmRlZCc6IGZhbHNlLFxuICAgICAgJ3JvbGUnOiAnaGVhZGluZydcbiAgICB9KS5hZGRDbGFzcygnby1hY2NvcmRpb25fX2hlYWRlcicpO1xuXG4gICAgJGhlYWRlckVsZW0ub24oJ2NsaWNrLmFjY29yZGlvbicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJGhlYWRlckVsZW0udHJpZ2dlcignY2hhbmdlU3RhdGUnKTtcbiAgICB9KTtcblxuICAgICRoZWFkZXJFbGVtLm9uKCdtb3VzZWxlYXZlLmFjY29yZGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgJGhlYWRlckVsZW0uYmx1cigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB2aXNpYmlsaXR5IGF0dHJpYnV0ZXMgZm9yIHBhbmVsXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkcGFuZWxFbGVtIC0gVGhlIGFjY29yZGlvbiBwYW5lbCBqUXVlcnkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWFrZVZpc2libGUgLSBXaGV0aGVyIHRoZSBwYW5lbCBzaG91bGQgYmUgdmlzaWJsZVxuICAgKi9cbiAgZnVuY3Rpb24gdG9nZ2xlUGFuZWwoJHBhbmVsRWxlbSwgbWFrZVZpc2libGUpIHtcbiAgICAkcGFuZWxFbGVtLmF0dHIoJ2FyaWEtaGlkZGVuJywgIW1ha2VWaXNpYmxlKTtcbiAgICBpZiAobWFrZVZpc2libGUpIHtcbiAgICAgICRwYW5lbEVsZW0uY3NzKCdoZWlnaHQnLCAkcGFuZWxFbGVtLmRhdGEoJ2hlaWdodCcpICsgJ3B4Jyk7XG4gICAgICAkcGFuZWxFbGVtLmZpbmQoJ2EsIGJ1dHRvbiwgW3RhYmluZGV4XScpLmF0dHIoJ3RhYmluZGV4JywgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRwYW5lbEVsZW0uY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICAkcGFuZWxFbGVtLmZpbmQoJ2EsIGJ1dHRvbiwgW3RhYmluZGV4XScpLmF0dHIoJ3RhYmluZGV4JywgLTEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgQ1NTIGNsYXNzZXMgdG8gYWNjb3JkaW9uIHBhbmVsc1xuICAgKiBAcGFyYW0ge29iamVjdH0gJHBhbmVsRWxlbSAtIFRoZSBhY2NvcmRpb24gcGFuZWwgalF1ZXJ5IG9iamVjdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFiZWxsZWRieSAtIElEIG9mIGVsZW1lbnQgKGFjY29yZGlvbiBoZWFkZXIpIHRoYXQgbGFiZWxzIHBhbmVsXG4gICAqL1xuICBmdW5jdGlvbiBpbml0aWFsaXplUGFuZWwoJHBhbmVsRWxlbSwgbGFiZWxsZWRieSkge1xuICAgICRwYW5lbEVsZW0uYWRkQ2xhc3MoJ28tYWNjb3JkaW9uX19jb250ZW50Jyk7XG4gICAgY2FsY3VsYXRlUGFuZWxIZWlnaHQoJHBhbmVsRWxlbSk7XG4gICAgJHBhbmVsRWxlbS5hdHRyKHtcbiAgICAgICdhcmlhLWhpZGRlbic6IHRydWUsXG4gICAgICAncm9sZSc6ICdyZWdpb24nLFxuICAgICAgJ2FyaWEtbGFiZWxsZWRieSc6IGxhYmVsbGVkYnlcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYWNjb3JkaW9uIHBhbmVsIGhlaWdodFxuICAgKiBAcGFyYW0ge29iamVjdH0gJHBhbmVsRWxlbSAtIFRoZSBhY2NvcmRpb24gcGFuZWwgalF1ZXJ5IG9iamVjdFxuICAgKi9cbiAgZnVuY3Rpb24gY2FsY3VsYXRlUGFuZWxIZWlnaHQoJHBhbmVsRWxlbSkge1xuICAgICRwYW5lbEVsZW0uZGF0YSgnaGVpZ2h0JywgJHBhbmVsRWxlbS5oZWlnaHQoKSk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIHN0YXRlIGZvciBhY2NvcmRpb24gY2hpbGRyZW5cbiAgICogQHBhcmFtIHtvYmplY3R9ICRpdGVtIC0gVGhlIGFjY29yZGlvbiBpdGVtIGpRdWVyeSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBtYWtlVmlzaWJsZSAtIFdoZXRoZXIgdG8gbWFrZSB0aGUgYWNjb3JkaW9uIGNvbnRlbnQgdmlzaWJsZVxuICAgKi9cbiAgZnVuY3Rpb24gdG9nZ2xlQWNjb3JkaW9uSXRlbSgkaXRlbSwgbWFrZVZpc2libGUpIHtcbiAgICBpZiAobWFrZVZpc2libGUpIHtcbiAgICAgICRpdGVtLmFkZENsYXNzKCdpcy1leHBhbmRlZCcpO1xuICAgICAgJGl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWNvbGxhcHNlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkaXRlbS5yZW1vdmVDbGFzcygnaXMtZXhwYW5kZWQnKTtcbiAgICAgICRpdGVtLmFkZENsYXNzKCdpcy1jb2xsYXBzZWQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIENTUyBjbGFzc2VzIHRvIGFjY29yZGlvbiBjaGlsZHJlblxuICAgKiBAcGFyYW0ge29iamVjdH0gJGl0ZW0gLSBUaGUgYWNjb3JkaW9uIGNoaWxkIGpRdWVyeSBvYmplY3RcbiAgICovXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVBY2NvcmRpb25JdGVtKCRpdGVtKSB7XG4gICAgY29uc3QgJGFjY29yZGlvbkNvbnRlbnQgPSAkaXRlbS5maW5kKCcuanMtYWNjb3JkaW9uX19jb250ZW50Jyk7XG4gICAgY29uc3QgJGFjY29yZGlvbkluaXRpYWxIZWFkZXIgPSAkaXRlbS5maW5kKCcuanMtYWNjb3JkaW9uX19oZWFkZXInKTtcbiAgICAvLyBDbGVhciBhbnkgcHJldmlvdXNseSBib3VuZCBldmVudHNcbiAgICAkaXRlbS5vZmYoJ3RvZ2dsZS5hY2NvcmRpb24nKTtcbiAgICAvLyBDbGVhciBhbnkgZXhpc3Rpbmcgc3RhdGUgY2xhc3Nlc1xuICAgICRpdGVtLnJlbW92ZUNsYXNzKCdpcy1leHBhbmRlZCBpcy1jb2xsYXBzZWQnKTtcbiAgICBpZiAoJGFjY29yZGlvbkNvbnRlbnQubGVuZ3RoICYmICRhY2NvcmRpb25Jbml0aWFsSGVhZGVyLmxlbmd0aCkge1xuICAgICAgJGl0ZW0uYWRkQ2xhc3MoJ28tYWNjb3JkaW9uX19pdGVtJyk7XG4gICAgICBsZXQgJGFjY29yZGlvbkhlYWRlcjtcbiAgICAgIGlmICgkYWNjb3JkaW9uSW5pdGlhbEhlYWRlci5nZXQoMCkudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYnV0dG9uJykge1xuICAgICAgICAkYWNjb3JkaW9uSGVhZGVyID0gJGFjY29yZGlvbkluaXRpYWxIZWFkZXI7XG4gICAgICAgIGNhbGN1bGF0ZVBhbmVsSGVpZ2h0KCRhY2NvcmRpb25Db250ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRhY2NvcmRpb25IZWFkZXIgPSBjb252ZXJ0SGVhZGVyVG9CdXR0b24oJGFjY29yZGlvbkluaXRpYWxIZWFkZXIpO1xuICAgICAgICAkYWNjb3JkaW9uSW5pdGlhbEhlYWRlci5yZXBsYWNlV2l0aCgkYWNjb3JkaW9uSGVhZGVyKTtcbiAgICAgICAgaW5pdGlhbGl6ZUhlYWRlcigkYWNjb3JkaW9uSGVhZGVyLCAkYWNjb3JkaW9uQ29udGVudCk7XG4gICAgICAgIGluaXRpYWxpemVQYW5lbCgkYWNjb3JkaW9uQ29udGVudCwgJGFjY29yZGlvbkhlYWRlci5nZXQoMCkuaWQpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEN1c3RvbSBldmVudCBoYW5kbGVyIHRvIHRvZ2dsZSB0aGUgYWNjb3JkaW9uIGl0ZW0gb3Blbi9jbG9zZWRcbiAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtYWtlVmlzaWJsZSAtIFdoZXRoZXIgdG8gbWFrZSB0aGUgYWNjb3JkaW9uIGNvbnRlbnQgdmlzaWJsZVxuICAgICAgICovXG4gICAgICAkaXRlbS5vbigndG9nZ2xlLmFjY29yZGlvbicsIGZ1bmN0aW9uKGV2ZW50LCBtYWtlVmlzaWJsZSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0b2dnbGVBY2NvcmRpb25JdGVtKCRpdGVtLCBtYWtlVmlzaWJsZSk7XG4gICAgICAgIHRvZ2dsZUhlYWRlcigkYWNjb3JkaW9uSGVhZGVyLCBtYWtlVmlzaWJsZSk7XG4gICAgICAgIHRvZ2dsZVBhbmVsKCRhY2NvcmRpb25Db250ZW50LCBtYWtlVmlzaWJsZSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ29sbGFwc2UgcGFuZWxzIGluaXRpYWxseVxuICAgICAgJGl0ZW0udHJpZ2dlcigndG9nZ2xlLmFjY29yZGlvbicsIFtmYWxzZV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIEFSSUEgYXR0cmlidXRlcyBhbmQgQ1NTIGNsYXNzZXMgdG8gdGhlIHJvb3QgYWNjb3JkaW9uIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0ge29iamVjdH0gJGFjY29yZGlvbkVsZW0gLSBUaGUgalF1ZXJ5IG9iamVjdCBjb250YWluaW5nIHRoZSByb290IGVsZW1lbnQgb2YgdGhlIGFjY29yZGlvblxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG11bHRpU2VsZWN0YWJsZSAtIFdoZXRoZXIgbXVsdGlwbGUgYWNjb3JkaW9uIGRyYXdlcnMgY2FuIGJlIG9wZW4gYXQgdGhlIHNhbWUgdGltZVxuICAgKi9cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgkYWNjb3JkaW9uRWxlbSwgbXVsdGlTZWxlY3RhYmxlKSB7XG4gICAgJGFjY29yZGlvbkVsZW0uYXR0cih7XG4gICAgICAncm9sZSc6ICdwcmVzZW50YXRpb24nLFxuICAgICAgJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJzogbXVsdGlTZWxlY3RhYmxlXG4gICAgfSkuYWRkQ2xhc3MoJ28tYWNjb3JkaW9uJyk7XG4gICAgJGFjY29yZGlvbkVsZW0uY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgaW5pdGlhbGl6ZUFjY29yZGlvbkl0ZW0oJCh0aGlzKSk7XG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogSGFuZGxlIGNoYW5nZVN0YXRlIGV2ZW50cyBvbiBhY2NvcmRpb24gaGVhZGVycy5cbiAgICAgKiBDbG9zZSB0aGUgb3BlbiBhY2NvcmRpb24gaXRlbSBhbmQgb3BlbiB0aGUgbmV3IG9uZS5cbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICovXG4gICAgJGFjY29yZGlvbkVsZW0ub24oJ2NoYW5nZVN0YXRlLmFjY29yZGlvbicsICcuanMtYWNjb3JkaW9uX19oZWFkZXInLCAkLnByb3h5KGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBjb25zdCAkbmV3SXRlbSA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcuby1hY2NvcmRpb25fX2l0ZW0nKTtcbiAgICAgIGlmIChtdWx0aVNlbGVjdGFibGUpIHtcbiAgICAgICAgJG5ld0l0ZW0udHJpZ2dlcigndG9nZ2xlLmFjY29yZGlvbicsIFshJG5ld0l0ZW0uaGFzQ2xhc3MoJ2lzLWV4cGFuZGVkJyldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0ICRvcGVuSXRlbSA9ICRhY2NvcmRpb25FbGVtLmZpbmQoJy5pcy1leHBhbmRlZCcpO1xuICAgICAgICAkb3Blbkl0ZW0udHJpZ2dlcigndG9nZ2xlLmFjY29yZGlvbicsIFtmYWxzZV0pO1xuICAgICAgICBpZiAoJG9wZW5JdGVtLmdldCgwKSAhPT0gJG5ld0l0ZW0uZ2V0KDApKSB7XG4gICAgICAgICAgJG5ld0l0ZW0udHJpZ2dlcigndG9nZ2xlLmFjY29yZGlvbicsIFt0cnVlXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVpbml0aWFsaXplIGFuIGFjY29yZGlvbiBhZnRlciBpdHMgY29udGVudHMgd2VyZSBkeW5hbWljYWxseSB1cGRhdGVkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkYWNjb3JkaW9uRWxlbSAtIFRoZSBqUXVlcnkgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGUgYWNjb3JkaW9uXG4gICAqL1xuICBmdW5jdGlvbiByZUluaXRpYWxpemUoJGFjY29yZGlvbkVsZW0pIHtcbiAgICBpZiAoJGFjY29yZGlvbkVsZW0uaGFzQ2xhc3MoJ28tYWNjb3JkaW9uJykpIHtcbiAgICAgICRhY2NvcmRpb25FbGVtLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgaW5pdGlhbGl6ZUFjY29yZGlvbkl0ZW0oJCh0aGlzKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbXVsdGlTZWxlY3RhYmxlID0gJGFjY29yZGlvbkVsZW0uZGF0YSgnbXVsdGlzZWxlY3RhYmxlJykgfHwgZmFsc2U7XG4gICAgICBpbml0aWFsaXplKCRhY2NvcmRpb25FbGVtLCBtdWx0aVNlbGVjdGFibGUpO1xuICAgIH1cbiAgfVxuICB3aW5kb3cucmVJbml0aWFsaXplQWNjb3JkaW9uID0gcmVJbml0aWFsaXplO1xuXG4gIGNvbnN0ICRhY2NvcmRpb25zID0gJCgnLmpzLWFjY29yZGlvbicpLm5vdCgnLm8tYWNjb3JkaW9uJyk7XG4gIGlmICgkYWNjb3JkaW9ucy5sZW5ndGgpIHtcbiAgICAkYWNjb3JkaW9ucy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbXVsdGlTZWxlY3RhYmxlID0gJCh0aGlzKS5kYXRhKCdtdWx0aXNlbGVjdGFibGUnKSB8fCBmYWxzZTtcbiAgICAgIGluaXRpYWxpemUoJCh0aGlzKSwgbXVsdGlTZWxlY3RhYmxlKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBIYW5kbGUgZm9udHNBY3RpdmUgZXZlbnRzIGZpcmVkIG9uY2UgVHlwZWtpdCByZXBvcnRzIHRoYXQgdGhlIGZvbnRzIGFyZSBhY3RpdmUuXG4gICAgICAgKiBAc2VlIGJhc2UudHdpZyBmb3IgdGhlIFR5cGVraXQubG9hZCgpIGZ1bmN0aW9uXG4gICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAqL1xuICAgICAgJCh0aGlzKS5vbignZm9udHNBY3RpdmUnLCAkLnByb3h5KGZ1bmN0aW9uKCkge1xuICAgICAgICByZUluaXRpYWxpemUoJCh0aGlzKSk7XG4gICAgICB9LCB0aGlzKSk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2FjY29yZGlvbi5qcyIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5RWFjaC5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VGb3JPd24gPSByZXF1aXJlKCcuL19iYXNlRm9yT3duJyksXG4gICAgY3JlYXRlQmFzZUVhY2ggPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRWFjaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckVhY2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG52YXIgYmFzZUVhY2ggPSBjcmVhdGVCYXNlRWFjaChiYXNlRm9yT3duKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRWFjaDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9fYmFzZUZvcicpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9yT3duKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBiYXNlRm9yKG9iamVjdCwgaXRlcmF0ZWUsIGtleXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JPd247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3JPd24uanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBjcmVhdGVCYXNlRm9yID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUZvcicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9yT3duYCB3aGljaCBpdGVyYXRlcyBvdmVyIGBvYmplY3RgXG4gKiBwcm9wZXJ0aWVzIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvci5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUZvcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUZvci5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGFycmF5TGlrZUtleXMgPSByZXF1aXJlKCcuL19hcnJheUxpa2VLZXlzJyksXG4gICAgYmFzZUtleXMgPSByZXF1aXJlKCcuL19iYXNlS2V5cycpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlMaWtlS2V5cy5qc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVGltZXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qc1xuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJndW1lbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKSxcbiAgICBzdHViRmFsc2UgPSByZXF1aXJlKCcuL3N0dWJGYWxzZScpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNCdWZmZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanNcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViRmFsc2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSAmJlxuICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0luZGV4O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAzMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Jhc2VJc1R5cGVkQXJyYXknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanNcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNUeXBlZEFycmF5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNUeXBlZEFycmF5LmpzXG4vLyBtb2R1bGUgaWQgPSAzM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVVuYXJ5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanNcbi8vIG1vZHVsZSBpZCA9IDM0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzXG4vLyBtb2R1bGUgaWQgPSAzNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanNcbi8vIG1vZHVsZSBpZCA9IDM2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNQcm90b3R5cGUuanNcbi8vIG1vZHVsZSBpZCA9IDM3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qc1xuLy8gbW9kdWxlIGlkID0gMzhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlckFyZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qc1xuLy8gbW9kdWxlIGlkID0gMzlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSA0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VFYWNoLmpzXG4vLyBtb2R1bGUgaWQgPSA0MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBgaWRlbnRpdHlgIGlmIGl0J3Mgbm90IGEgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgY2FzdCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY2FzdEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlIDogaWRlbnRpdHk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdEZ1bmN0aW9uO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0RnVuY3Rpb24uanNcbi8vIG1vZHVsZSBpZCA9IDQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKlxuICogY29uc29sZS5sb2coXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaWRlbnRpdHk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaWRlbnRpdHkuanNcbi8vIG1vZHVsZSBpZCA9IDQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuKiBTaW1wbGUgYWNjb3JkaW9uIG1vZHVsZVxuKiBAbW9kdWxlIG1vZHVsZXMvc2ltcGxlQWNjb3JkaW9uXG4qIEBzZWUgaHR0cHM6Ly9wZXJpc2hhYmxlcHJlc3MuY29tL2pxdWVyeS1hY2NvcmRpb24tbWVudS10dXRvcmlhbC9cbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgLy8kKCcuanMtYWNjb3JkaW9uID4gdWwgPiBsaTpoYXMob2wpJykuYWRkQ2xhc3MoXCJoYXMtc3ViXCIpO1xuICAkKCcuanMtcy1hY2NvcmRpb24gPiBsaSA+IGgzLmpzLXMtYWNjb3JkaW9uX19oZWFkZXInKS5hcHBlbmQoJzxzdmcgY2xhc3M9XCJvLWFjY29yZGlvbl9fY2FyZXQgaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWNhcmV0LWRvd25cIj48L3VzZT48L3N2Zz4nKTtcblxuICAkKCcuanMtcy1hY2NvcmRpb24gPiBsaSA+IGgzLmpzLXMtYWNjb3JkaW9uX19oZWFkZXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICB2YXIgY2hlY2tFbGVtZW50ID0gJCh0aGlzKS5uZXh0KCk7XG5cbiAgICAkKCcuanMtcy1hY2NvcmRpb24gbGknKS5yZW1vdmVDbGFzcygnaXMtZXhwYW5kZWQnKTtcbiAgICAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykuYWRkQ2xhc3MoJ2lzLWV4cGFuZGVkJyk7XG5cblxuICAgIGlmKChjaGVja0VsZW1lbnQuaXMoJy5qcy1zLWFjY29yZGlvbl9fY29udGVudCcpKSAmJiAoY2hlY2tFbGVtZW50LmlzKCc6dmlzaWJsZScpKSkge1xuICAgICAgJCh0aGlzKS5jbG9zZXN0KCdsaScpLnJlbW92ZUNsYXNzKCdpcy1leHBhbmRlZCcpO1xuICAgICAgY2hlY2tFbGVtZW50LnNsaWRlVXAoJ25vcm1hbCcpO1xuICAgIH1cblxuICAgIGlmKChjaGVja0VsZW1lbnQuaXMoJy5qcy1zLWFjY29yZGlvbl9fY29udGVudCcpKSAmJiAoIWNoZWNrRWxlbWVudC5pcygnOnZpc2libGUnKSkpIHtcbiAgICAgICQoJy5qcy1zLWFjY29yZGlvbiAuanMtcy1hY2NvcmRpb25fX2NvbnRlbnQ6dmlzaWJsZScpLnNsaWRlVXAoJ25vcm1hbCcpO1xuICAgICAgY2hlY2tFbGVtZW50LnNsaWRlRG93bignbm9ybWFsJyk7XG4gICAgfVxuXG4gICAgaWYgKGNoZWNrRWxlbWVudC5pcygnLmpzLXMtYWNjb3JkaW9uX19jb250ZW50JykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9zaW1wbGVBY2NvcmRpb24uanMiLCIvKipcbiAqIE9mZmNhbnZhcyBtb2R1bGVcbiAqIEBtb2R1bGUgbW9kdWxlcy9vZmZjYW52YXNcbiAqIEBzZWUgbW9kdWxlcy90b2dnbGVPcGVuXG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuXG4vKipcbiAqIFNoaWZ0IGtleWJvYXJkIGZvY3VzIHdoZW4gdGhlIG9mZmNhbnZhcyBuYXYgaXMgb3Blbi5cbiAqIFRoZSAnY2hhbmdlT3BlblN0YXRlJyBldmVudCBpcyBmaXJlZCBieSBtb2R1bGVzL3RvZ2dsZU9wZW5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IG9mZkNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1vZmZjYW52YXMnKTtcbiAgaWYgKG9mZkNhbnZhcykge1xuICAgIGZvckVhY2gob2ZmQ2FudmFzLCBmdW5jdGlvbihvZmZDYW52YXNFbGVtKSB7XG4gICAgICBjb25zdCBvZmZDYW52YXNTaWRlID0gb2ZmQ2FudmFzRWxlbS5xdWVyeVNlbGVjdG9yKCcuanMtb2ZmY2FudmFzX19zaWRlJyk7XG5cbiAgICAgIC8qKlxuICAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yICdjaGFuZ2VPcGVuU3RhdGUnLlxuICAgICAgKiBUaGUgdmFsdWUgb2YgZXZlbnQuZGV0YWlsIGluZGljYXRlcyB3aGV0aGVyIHRoZSBvcGVuIHN0YXRlIGlzIHRydWVcbiAgICAgICogKGkuZS4gdGhlIG9mZmNhbnZhcyBjb250ZW50IGlzIHZpc2libGUpLlxuICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgKi9cbiAgICAgIG9mZkNhbnZhc0VsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlT3BlblN0YXRlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmRldGFpbCkge1xuICAgICAgICAgIGlmICghKC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaS50ZXN0KG9mZkNhbnZhc1NpZGUudGFnTmFtZSkpKSB7XG4gICAgICAgICAgICBvZmZDYW52YXNTaWRlLnRhYkluZGV4ID0gLTE7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9mZkNhbnZhc1NpZGUuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSwgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9vZmZjYW52YXMuanMiLCIvKipcbiAqIE92ZXJsYXkgbW9kdWxlXG4gKiBAbW9kdWxlIG1vZHVsZXMvb3ZlcmxheVxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcblxuLyoqXG4gKiBTaGlmdCBrZXlib2FyZCBmb2N1cyB3aGVuIHRoZSBzZWFyY2ggb3ZlcmxheSBpcyBvcGVuLlxuICogVGhlICdjaGFuZ2VPcGVuU3RhdGUnIGV2ZW50IGlzIGZpcmVkIGJ5IG1vZHVsZXMvdG9nZ2xlT3BlblxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1vdmVybGF5Jyk7XG4gIGlmIChvdmVybGF5KSB7XG4gICAgZm9yRWFjaChvdmVybGF5LCBmdW5jdGlvbihvdmVybGF5RWxlbSkge1xuICAgICAgLyoqXG4gICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgJ2NoYW5nZU9wZW5TdGF0ZScuXG4gICAgICAqIFRoZSB2YWx1ZSBvZiBldmVudC5kZXRhaWwgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIG9wZW4gc3RhdGUgaXMgdHJ1ZVxuICAgICAgKiAoaS5lLiB0aGUgb3ZlcmxheSBpcyB2aXNpYmxlKS5cbiAgICAgICogQGZ1bmN0aW9uXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICovXG4gICAgICBvdmVybGF5RWxlbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2VPcGVuU3RhdGUnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuZGV0YWlsKSB7XG4gICAgICAgICAgaWYgKCEoL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pLnRlc3Qob3ZlcmxheS50YWdOYW1lKSkpIHtcbiAgICAgICAgICAgIG92ZXJsYXkudGFiSW5kZXggPSAtMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW92ZXJsYXkgaW5wdXQnKSkge1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW92ZXJsYXkgaW5wdXQnKVswXS5mb2N1cygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdmVybGF5LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL292ZXJsYXkuanMiLCIvKipcbiogU3RpY2sgTmF2IG1vZHVsZVxuKiBAbW9kdWxlIG1vZHVsZXMvc3RpY2t5TmF2XG4qL1xuXG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnbG9kYXNoL3Rocm90dGxlJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2gvZGVib3VuY2UnO1xuaW1wb3J0IGltYWdlc1JlYWR5IGZyb20gJ2ltYWdlc3JlYWR5L2Rpc3QvaW1hZ2VzcmVhZHkuanMnO1xuXG4vKipcbiogXCJTdGlja1wiIGNvbnRlbnQgaW4gcGxhY2UgYXMgdGhlIHVzZXIgc2Nyb2xsc1xuKiBAcGFyYW0ge29iamVjdH0gJGVsZW0gLSBqUXVlcnkgZWxlbWVudCB0aGF0IHNob3VsZCBiZSBzdGlja3lcbiogQHBhcmFtIHtvYmplY3R9ICRlbGVtQ29udGFpbmVyIC0galF1ZXJ5IGVsZW1lbnQgZm9yIHRoZSBlbGVtZW50J3MgY29udGFpbmVyLiBVc2VkIHRvIHNldCB0aGUgdG9wIGFuZCBib3R0b20gcG9pbnRzXG4qIEBwYXJhbSB7b2JqZWN0fSAkZWxlbUFydGljbGUgLSBDb250ZW50IG5leHQgdG8gdGhlIHN0aWNreSBuYXZcbiovXG5mdW5jdGlvbiBzdGlja3lOYXYoJGVsZW0sICRlbGVtQ29udGFpbmVyLCAkZWxlbUFydGljbGUpIHtcbiAgLy8gTW9kdWxlIHNldHRpbmdzXG4gIGNvbnN0IHNldHRpbmdzID0ge1xuICAgIHN0aWNreUNsYXNzOiAnaXMtc3RpY2t5JyxcbiAgICBhYnNvbHV0ZUNsYXNzOiAnaXMtc3R1Y2snLFxuICAgIGxhcmdlQnJlYWtwb2ludDogJzEwMjRweCcsXG4gICAgYXJ0aWNsZUNsYXNzOiAnby1hcnRpY2xlLS1zaGlmdCdcbiAgfTtcblxuICAvLyBHbG9iYWxzXG4gIGxldCBzdGlja3lNb2RlID0gZmFsc2U7IC8vIEZsYWcgdG8gdGVsbCBpZiBzaWRlYmFyIGlzIGluIFwic3RpY2t5IG1vZGVcIlxuICBsZXQgaXNTdGlja3kgPSBmYWxzZTsgLy8gV2hldGhlciB0aGUgc2lkZWJhciBpcyBzdGlja3kgYXQgdGhpcyBleGFjdCBtb21lbnQgaW4gdGltZVxuICBsZXQgaXNBYnNvbHV0ZSA9IGZhbHNlOyAvLyBXaGV0aGVyIHRoZSBzaWRlYmFyIGlzIGFic29sdXRlbHkgcG9zaXRpb25lZCBhdCB0aGUgYm90dG9tXG4gIGxldCBzd2l0Y2hQb2ludCA9IDA7IC8vIFBvaW50IGF0IHdoaWNoIHRvIHN3aXRjaCB0byBzdGlja3kgbW9kZVxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBsZXQgc3dpdGNoUG9pbnRCb3R0b20gPSAwOyAvLyBQb2ludCBhdCB3aGljaCB0byBcImZyZWV6ZVwiIHRoZSBzaWRlYmFyIHNvIGl0IGRvZXNuJ3Qgb3ZlcmxhcCB0aGUgZm9vdGVyXG4gIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgbGV0IGxlZnRPZmZzZXQgPSAwOyAvLyBBbW91bnQgc2lkZWJhciBzaG91bGQgYmUgc2V0IGZyb20gdGhlIGxlZnQgc2lkZVxuICBsZXQgZWxlbVdpZHRoID0gMDsgLy8gV2lkdGggaW4gcGl4ZWxzIG9mIHNpZGViYXJcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgbGV0IGVsZW1IZWlnaHQgPSAwOyAvLyBIZWlnaHQgaW4gcGl4ZWxzIG9mIHNpZGViYXJcbiAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG4gIC8qKlxuICAqIFRvZ2dsZSB0aGUgc3RpY2t5IGJlaGF2aW9yXG4gICpcbiAgKiBUdXJucyBvbiBpZiB0aGUgdXNlciBoYXMgc2Nyb2xsZWQgcGFzdCB0aGUgc3dpdGNoIHBvaW50LCBvZmYgaWYgdGhleSBzY3JvbGwgYmFjayB1cFxuICAqIElmIHN0aWNreSBtb2RlIGlzIG9uLCBzZXRzIHRoZSBsZWZ0IG9mZnNldCBhcyB3ZWxsXG4gICovXG4gIGZ1bmN0aW9uIHRvZ2dsZVN0aWNreSgpIHtcbiAgICBjb25zdCBjdXJyZW50U2Nyb2xsUG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgaWYgKGN1cnJlbnRTY3JvbGxQb3MgPiBzd2l0Y2hQb2ludCkge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHNpZGViYXIgaXMgYWxyZWFkeSBzdGlja3lcbiAgICAgIGlmICghaXNTdGlja3kpIHtcbiAgICAgICAgaXNTdGlja3kgPSB0cnVlO1xuICAgICAgICBpc0Fic29sdXRlID0gZmFsc2U7XG4gICAgICAgICRlbGVtLmFkZENsYXNzKHNldHRpbmdzLnN0aWNreUNsYXNzKS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5hYnNvbHV0ZUNsYXNzKTtcbiAgICAgICAgJGVsZW1BcnRpY2xlLmFkZENsYXNzKHNldHRpbmdzLmFydGljbGVDbGFzcyk7XG4gICAgICAgIHVwZGF0ZURpbWVuc2lvbnMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHNpZGViYXIgaGFzIHJlYWNoZWQgdGhlIGJvdHRvbSBzd2l0Y2ggcG9pbnRcbiAgICAgIGlmICgkKCcuYy1mb290ZXJfX3JlYWNoZWQnKS5pc09uU2NyZWVuKCkpIHtcbiAgICAgICAgaXNTdGlja3kgPSBmYWxzZTtcbiAgICAgICAgaXNBYnNvbHV0ZSA9IHRydWU7XG4gICAgICAgICRlbGVtLmFkZENsYXNzKHNldHRpbmdzLmFic29sdXRlQ2xhc3MpO1xuICAgICAgICB1cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgICB9XG5cbiAgICB9IGVsc2UgaWYgKGlzU3RpY2t5IHx8IGlzQWJzb2x1dGUpIHtcbiAgICAgIGlzU3RpY2t5ID0gZmFsc2U7XG4gICAgICBpc0Fic29sdXRlID0gZmFsc2U7XG4gICAgICAkZWxlbS5yZW1vdmVDbGFzcyhgJHtzZXR0aW5ncy5zdGlja3lDbGFzc30gJHtzZXR0aW5ncy5hYnNvbHV0ZUNsYXNzfWApO1xuICAgICAgJGVsZW1BcnRpY2xlLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFydGljbGVDbGFzcyk7XG4gICAgICB1cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogVXBkYXRlIGRpbWVuc2lvbnMgb24gc2lkZWJhclxuICAqXG4gICogU2V0IHRvIHRoZSBjdXJyZW50IHZhbHVlcyBvZiBsZWZ0T2Zmc2V0IGFuZCBlbGVtV2lkdGggaWYgdGhlIGVsZW1lbnQgaXNcbiAgKiBjdXJyZW50bHkgc3RpY2t5LiBPdGhlcndpc2UsIGNsZWFyIGFueSBwcmV2aW91c2x5IHNldCB2YWx1ZXNcbiAgKlxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2VDbGVhciAtIEZsYWcgdG8gY2xlYXIgc2V0IHZhbHVlcyByZWdhcmRsZXNzIG9mIHN0aWNreSBzdGF0dXNcbiAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlRGltZW5zaW9ucyhmb3JjZUNsZWFyKSB7XG4gICAgaWYgKGlzU3RpY2t5ICYmICFmb3JjZUNsZWFyKSB7XG4gICAgICAkZWxlbS5jc3Moe1xuICAgICAgICBsZWZ0OiBsZWZ0T2Zmc2V0ICsgJ3B4JyxcbiAgICAgICAgd2lkdGg6IGVsZW1XaWR0aCArICdweCcsXG4gICAgICAgIHRvcDogJycsXG4gICAgICAgIGJvdHRvbTogJydcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoaXNBYnNvbHV0ZSAmJiAhZm9yY2VDbGVhcikge1xuICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgbGVmdDogJGVsZW1Db250YWluZXIuY3NzKCdwYWRkaW5nLWxlZnQnKSxcbiAgICAgICAgd2lkdGg6IGVsZW1XaWR0aCArICdweCcsXG4gICAgICAgIHRvcDogJ2F1dG8nLFxuICAgICAgICBib3R0b206ICRlbGVtQ29udGFpbmVyLmNzcygncGFkZGluZy1ib3R0b20nKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtLmNzcyh7XG4gICAgICAgIGxlZnQ6ICcnLFxuICAgICAgICB3aWR0aDogJycsXG4gICAgICAgIHRvcDogJycsXG4gICAgICAgIGJvdHRvbTogJydcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIFNldCB0aGUgc3dpdGNocG9pbnQgZm9yIHRoZSBlbGVtZW50IGFuZCBnZXQgaXRzIGN1cnJlbnQgb2Zmc2V0c1xuICAqL1xuICBmdW5jdGlvbiBzZXRPZmZzZXRWYWx1ZXMoKSB7XG4gICAgJGVsZW0uY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgIGlmIChpc1N0aWNreSB8fCBpc0Fic29sdXRlKSB7XG4gICAgICAkZWxlbS5yZW1vdmVDbGFzcyhgJHtzZXR0aW5ncy5zdGlja3lDbGFzc30gJHtzZXR0aW5ncy5hYnNvbHV0ZUNsYXNzfWApO1xuICAgICAgJGVsZW1BcnRpY2xlLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFydGljbGVDbGFzcyk7XG4gICAgfVxuICAgIHVwZGF0ZURpbWVuc2lvbnModHJ1ZSk7XG5cbiAgICBzd2l0Y2hQb2ludCA9ICRlbGVtLm9mZnNldCgpLnRvcDtcbiAgICAvLyBCb3R0b20gc3dpdGNoIHBvaW50IGlzIGVxdWFsIHRvIHRoZSBvZmZzZXQgYW5kIGhlaWdodCBvZiB0aGUgb3V0ZXIgY29udGFpbmVyLCBtaW51cyBhbnkgcGFkZGluZyBvbiB0aGUgYm90dG9tXG4gICAgc3dpdGNoUG9pbnRCb3R0b20gPSAkZWxlbUNvbnRhaW5lci5vZmZzZXQoKS50b3AgKyAkZWxlbUNvbnRhaW5lci5vdXRlckhlaWdodCgpIC1cbiAgICAgIHBhcnNlSW50KCRlbGVtQ29udGFpbmVyLmNzcygncGFkZGluZy1ib3R0b20nKSwgMTApO1xuXG4gICAgbGVmdE9mZnNldCA9ICRlbGVtLm9mZnNldCgpLmxlZnQ7XG4gICAgZWxlbVdpZHRoID0gJGVsZW0ub3V0ZXJXaWR0aCgpO1xuICAgIGVsZW1IZWlnaHQgPSAkZWxlbS5vdXRlckhlaWdodCgpO1xuXG4gICAgaWYgKGlzU3RpY2t5IHx8IGlzQWJzb2x1dGUpIHtcbiAgICAgIHVwZGF0ZURpbWVuc2lvbnMoKTtcbiAgICAgICRlbGVtLmFkZENsYXNzKHNldHRpbmdzLnN0aWNreUNsYXNzKTtcbiAgICAgICRlbGVtQXJ0aWNsZS5hZGRDbGFzcyhzZXR0aW5ncy5hcnRpY2xlQ2xhc3MpO1xuICAgICAgaWYgKGlzQWJzb2x1dGUpIHtcbiAgICAgICAgJGVsZW0uYWRkQ2xhc3Moc2V0dGluZ3MuYWJzb2x1dGVDbGFzcyk7XG4gICAgICB9XG4gICAgfVxuICAgICRlbGVtLmNzcygndmlzaWJpbGl0eScsICcnKTtcbiAgfVxuXG4gIC8qKlxuICAqIFR1cm4gb24gXCJzdGlja3kgbW9kZVwiXG4gICpcbiAgKiBXYXRjaCBmb3Igc2Nyb2xsIGFuZCBmaXggdGhlIHNpZGViYXIuIFdhdGNoIGZvciBzaXplcyBjaGFuZ2VzIG9uICNtYWluXG4gICogKHdoaWNoIG1heSBjaGFuZ2UgaWYgcGFyYWxsYXggaXMgdXNlZCkgYW5kIGFkanVzdCBhY2NvcmRpbmdseS5cbiAgKi9cbiAgZnVuY3Rpb24gc3RpY2t5TW9kZU9uKCkge1xuICAgIHN0aWNreU1vZGUgPSB0cnVlO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwuZml4ZWRTaWRlYmFyJywgdGhyb3R0bGUoZnVuY3Rpb24oKSB7XG4gICAgICB0b2dnbGVTdGlja3koKTtcbiAgICB9LCAxMDApKS50cmlnZ2VyKCdzY3JvbGwuZml4ZWRTaWRlYmFyJyk7XG5cbiAgICAkKCcjbWFpbicpLm9uKCdjb250YWluZXJTaXplQ2hhbmdlLmZpeGVkU2lkZWJhcicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBzd2l0Y2hQb2ludCAtPSBldmVudC5vcmlnaW5hbEV2ZW50LmRldGFpbDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAqIFR1cm4gb2ZmIFwic3RpY2t5IG1vZGVcIlxuICAqXG4gICogUmVtb3ZlIHRoZSBldmVudCBiaW5kaW5nIGFuZCByZXNldCBldmVyeXRoaW5nXG4gICovXG4gIGZ1bmN0aW9uIHN0aWNreU1vZGVPZmYoKSB7XG4gICAgaWYgKGlzU3RpY2t5KSB7XG4gICAgICB1cGRhdGVEaW1lbnNpb25zKHRydWUpO1xuICAgICAgJGVsZW0ucmVtb3ZlQ2xhc3Moc2V0dGluZ3Muc3RpY2t5Q2xhc3MpO1xuICAgIH1cbiAgICAkKHdpbmRvdykub2ZmKCdzY3JvbGwuZml4ZWRTaWRlYmFyJyk7XG4gICAgJCgnI21haW4nKS5vZmYoJ2NvbnRhaW5lclNpemVDaGFuZ2UuZml4ZWRTaWRlYmFyJyk7XG4gICAgc3RpY2t5TW9kZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICogSGFuZGxlICdyZXNpemUnIGV2ZW50XG4gICpcbiAgKiBUdXJuIHN0aWNreSBtb2RlIG9uL29mZiBkZXBlbmRpbmcgb24gd2hldGhlciB3ZSdyZSBpbiBkZXNrdG9wIG1vZGVcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0aWNreU1vZGUgLSBXaGV0aGVyIHNpZGViYXIgc2hvdWxkIGJlIGNvbnNpZGVyZWQgc3RpY2t5XG4gICovXG4gIGZ1bmN0aW9uIG9uUmVzaXplKCkge1xuICAgIGNvbnN0IGxhcmdlTW9kZSA9IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiAnICtcbiAgICAgIHNldHRpbmdzLmxhcmdlQnJlYWtwb2ludCArICcpJykubWF0Y2hlcztcbiAgICBpZiAobGFyZ2VNb2RlKSB7XG4gICAgICBzZXRPZmZzZXRWYWx1ZXMoKTtcbiAgICAgIGlmICghc3RpY2t5TW9kZSkge1xuICAgICAgICBzdGlja3lNb2RlT24oKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN0aWNreU1vZGUpIHtcbiAgICAgIHN0aWNreU1vZGVPZmYoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBJbml0aWFsaXplIHRoZSBzdGlja3kgbmF2XG4gICogQHBhcmFtIHtvYmplY3R9IGVsZW0gLSBET00gZWxlbWVudCB0aGF0IHNob3VsZCBiZSBzdGlja3lcbiAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMuIFdpbGwgb3ZlcnJpZGUgbW9kdWxlIGRlZmF1bHRzIHdoZW4gcHJlc2VudFxuICAqL1xuICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgICQod2luZG93KS5vbigncmVzaXplLmZpeGVkU2lkZWJhcicsIGRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgb25SZXNpemUoKTtcbiAgICB9LCAxMDApKTtcblxuICAgIGltYWdlc1JlYWR5KGRvY3VtZW50LmJvZHkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBvblJlc2l6ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpO1xuXG4gICQuZm4uaXNPblNjcmVlbiA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHdpbiA9ICQod2luZG93KTtcblxuICAgIHZhciB2aWV3cG9ydCA9IHtcbiAgICAgICAgdG9wIDogd2luLnNjcm9sbFRvcCgpLFxuICAgICAgICBsZWZ0IDogd2luLnNjcm9sbExlZnQoKVxuICAgIH07XG4gICAgdmlld3BvcnQucmlnaHQgPSB2aWV3cG9ydC5sZWZ0ICsgd2luLndpZHRoKCk7XG4gICAgdmlld3BvcnQuYm90dG9tID0gdmlld3BvcnQudG9wICsgd2luLmhlaWdodCgpO1xuXG4gICAgdmFyIGJvdW5kcyA9IHRoaXMub2Zmc2V0KCk7XG4gICAgYm91bmRzLnJpZ2h0ID0gYm91bmRzLmxlZnQgKyB0aGlzLm91dGVyV2lkdGgoKTtcbiAgICBib3VuZHMuYm90dG9tID0gYm91bmRzLnRvcCArIHRoaXMub3V0ZXJIZWlnaHQoKTtcblxuICAgIHJldHVybiAoISh2aWV3cG9ydC5yaWdodCA8IGJvdW5kcy5sZWZ0IHx8IHZpZXdwb3J0LmxlZnQgPiBib3VuZHMucmlnaHQgfHwgdmlld3BvcnQuYm90dG9tIDwgYm91bmRzLnRvcCB8fCB2aWV3cG9ydC50b3AgPiBib3VuZHMuYm90dG9tKSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBjb25zdCAkc3RpY2t5TmF2cyA9ICQoJy5qcy1zdGlja3knKTtcbiAgaWYgKCRzdGlja3lOYXZzLmxlbmd0aCkge1xuICAgICRzdGlja3lOYXZzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgJG91dGVyQ29udGFpbmVyID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc3RpY2t5LWNvbnRhaW5lcicpO1xuICAgICAgbGV0ICRhcnRpY2xlID0gJG91dGVyQ29udGFpbmVyLmZpbmQoJy5qcy1zdGlja3ktYXJ0aWNsZScpO1xuICAgICAgc3RpY2t5TmF2KCQodGhpcyksICRvdXRlckNvbnRhaW5lciwgJGFydGljbGUpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9zdGlja05hdi5qcyIsInZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJy4vZGVib3VuY2UnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgdGhyb3R0bGVkIGZ1bmN0aW9uIHRoYXQgb25seSBpbnZva2VzIGBmdW5jYCBhdCBtb3N0IG9uY2UgcGVyXG4gKiBldmVyeSBgd2FpdGAgbWlsbGlzZWNvbmRzLiBUaGUgdGhyb3R0bGVkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYFxuICogbWV0aG9kIHRvIGNhbmNlbCBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0b1xuICogaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgXG4gKiBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGUgbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgXG4gKiB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWQgd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlXG4gKiB0aHJvdHRsZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnQgY2FsbHMgdG8gdGhlIHRocm90dGxlZCBmdW5jdGlvbiByZXR1cm4gdGhlXG4gKiByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8udGhyb3R0bGVgIGFuZCBgXy5kZWJvdW5jZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB0aHJvdHRsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB0aHJvdHRsZSBpbnZvY2F0aW9ucyB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB0aHJvdHRsZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGV4Y2Vzc2l2ZWx5IHVwZGF0aW5nIHRoZSBwb3NpdGlvbiB3aGlsZSBzY3JvbGxpbmcuXG4gKiBqUXVlcnkod2luZG93KS5vbignc2Nyb2xsJywgXy50aHJvdHRsZSh1cGRhdGVQb3NpdGlvbiwgMTAwKSk7XG4gKlxuICogLy8gSW52b2tlIGByZW5ld1Rva2VuYCB3aGVuIHRoZSBjbGljayBldmVudCBpcyBmaXJlZCwgYnV0IG5vdCBtb3JlIHRoYW4gb25jZSBldmVyeSA1IG1pbnV0ZXMuXG4gKiB2YXIgdGhyb3R0bGVkID0gXy50aHJvdHRsZShyZW5ld1Rva2VuLCAzMDAwMDAsIHsgJ3RyYWlsaW5nJzogZmFsc2UgfSk7XG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgdGhyb3R0bGVkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIHRocm90dGxlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgdGhyb3R0bGVkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxlYWRpbmcgPSB0cnVlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAnbGVhZGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy5sZWFkaW5nIDogbGVhZGluZztcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG4gIHJldHVybiBkZWJvdW5jZShmdW5jLCB3YWl0LCB7XG4gICAgJ2xlYWRpbmcnOiBsZWFkaW5nLFxuICAgICdtYXhXYWl0Jzogd2FpdCxcbiAgICAndHJhaWxpbmcnOiB0cmFpbGluZ1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aHJvdHRsZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC90aHJvdHRsZS5qc1xuLy8gbW9kdWxlIGlkID0gNDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbm93O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL25vdy5qc1xuLy8gbW9kdWxlIGlkID0gNDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanNcbi8vIG1vZHVsZSBpZCA9IDUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N5bWJvbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qc1xuLy8gbW9kdWxlIGlkID0gNTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogaW1hZ2VzcmVhZHkgdjAuMi4yIC0gMjAxNS0wNy0wNFQwNjoyMjoxNC40MzVaIC0gaHR0cHM6Ly9naXRodWIuY29tL3ItcGFyay9pbWFnZXMtcmVhZHkgKi9cbjsoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICByb290LmltYWdlc1JlYWR5ID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIFVzZSB0aGUgZmFzdGVzdCBtZWFucyBwb3NzaWJsZSB0byBleGVjdXRlIGEgdGFzayBpbiBpdHMgb3duIHR1cm4sIHdpdGhcbi8vIHByaW9yaXR5IG92ZXIgb3RoZXIgZXZlbnRzIGluY2x1ZGluZyBJTywgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZWRyYXdcbi8vIGV2ZW50cyBpbiBicm93c2Vycy5cbi8vXG4vLyBBbiBleGNlcHRpb24gdGhyb3duIGJ5IGEgdGFzayB3aWxsIHBlcm1hbmVudGx5IGludGVycnVwdCB0aGUgcHJvY2Vzc2luZyBvZlxuLy8gc3Vic2VxdWVudCB0YXNrcy4gVGhlIGhpZ2hlciBsZXZlbCBgYXNhcGAgZnVuY3Rpb24gZW5zdXJlcyB0aGF0IGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duIGJ5IGEgdGFzaywgdGhhdCB0aGUgdGFzayBxdWV1ZSB3aWxsIGNvbnRpbnVlIGZsdXNoaW5nIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLCBidXQgaWYgeW91IHVzZSBgcmF3QXNhcGAgZGlyZWN0bHksIHlvdSBhcmUgcmVzcG9uc2libGUgdG9cbi8vIGVpdGhlciBlbnN1cmUgdGhhdCBubyBleGNlcHRpb25zIGFyZSB0aHJvd24gZnJvbSB5b3VyIHRhc2ssIG9yIHRvIG1hbnVhbGx5XG4vLyBjYWxsIGByYXdBc2FwLnJlcXVlc3RGbHVzaGAgaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93bi5cbi8vbW9kdWxlLmV4cG9ydHMgPSByYXdBc2FwO1xuZnVuY3Rpb24gcmF3QXNhcCh0YXNrKSB7XG4gICAgaWYgKCFxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmVxdWVzdEZsdXNoKCk7XG4gICAgICAgIGZsdXNoaW5nID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gRXF1aXZhbGVudCB0byBwdXNoLCBidXQgYXZvaWRzIGEgZnVuY3Rpb24gY2FsbC5cbiAgICBxdWV1ZVtxdWV1ZS5sZW5ndGhdID0gdGFzaztcbn1cblxudmFyIHF1ZXVlID0gW107XG4vLyBPbmNlIGEgZmx1c2ggaGFzIGJlZW4gcmVxdWVzdGVkLCBubyBmdXJ0aGVyIGNhbGxzIHRvIGByZXF1ZXN0Rmx1c2hgIGFyZVxuLy8gbmVjZXNzYXJ5IHVudGlsIHRoZSBuZXh0IGBmbHVzaGAgY29tcGxldGVzLlxudmFyIGZsdXNoaW5nID0gZmFsc2U7XG4vLyBgcmVxdWVzdEZsdXNoYCBpcyBhbiBpbXBsZW1lbnRhdGlvbi1zcGVjaWZpYyBtZXRob2QgdGhhdCBhdHRlbXB0cyB0byBraWNrXG4vLyBvZmYgYSBgZmx1c2hgIGV2ZW50IGFzIHF1aWNrbHkgYXMgcG9zc2libGUuIGBmbHVzaGAgd2lsbCBhdHRlbXB0IHRvIGV4aGF1c3Rcbi8vIHRoZSBldmVudCBxdWV1ZSBiZWZvcmUgeWllbGRpbmcgdG8gdGhlIGJyb3dzZXIncyBvd24gZXZlbnQgbG9vcC5cbnZhciByZXF1ZXN0Rmx1c2g7XG4vLyBUaGUgcG9zaXRpb24gb2YgdGhlIG5leHQgdGFzayB0byBleGVjdXRlIGluIHRoZSB0YXNrIHF1ZXVlLiBUaGlzIGlzXG4vLyBwcmVzZXJ2ZWQgYmV0d2VlbiBjYWxscyB0byBgZmx1c2hgIHNvIHRoYXQgaXQgY2FuIGJlIHJlc3VtZWQgaWZcbi8vIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLlxudmFyIGluZGV4ID0gMDtcbi8vIElmIGEgdGFzayBzY2hlZHVsZXMgYWRkaXRpb25hbCB0YXNrcyByZWN1cnNpdmVseSwgdGhlIHRhc2sgcXVldWUgY2FuIGdyb3dcbi8vIHVuYm91bmRlZC4gVG8gcHJldmVudCBtZW1vcnkgZXhoYXVzdGlvbiwgdGhlIHRhc2sgcXVldWUgd2lsbCBwZXJpb2RpY2FsbHlcbi8vIHRydW5jYXRlIGFscmVhZHktY29tcGxldGVkIHRhc2tzLlxudmFyIGNhcGFjaXR5ID0gMTAyNDtcblxuLy8gVGhlIGZsdXNoIGZ1bmN0aW9uIHByb2Nlc3NlcyBhbGwgdGFza3MgdGhhdCBoYXZlIGJlZW4gc2NoZWR1bGVkIHdpdGhcbi8vIGByYXdBc2FwYCB1bmxlc3MgYW5kIHVudGlsIG9uZSBvZiB0aG9zZSB0YXNrcyB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuLy8gSWYgYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24sIGBmbHVzaGAgZW5zdXJlcyB0aGF0IGl0cyBzdGF0ZSB3aWxsIHJlbWFpblxuLy8gY29uc2lzdGVudCBhbmQgd2lsbCByZXN1bWUgd2hlcmUgaXQgbGVmdCBvZmYgd2hlbiBjYWxsZWQgYWdhaW4uXG4vLyBIb3dldmVyLCBgZmx1c2hgIGRvZXMgbm90IG1ha2UgYW55IGFycmFuZ2VtZW50cyB0byBiZSBjYWxsZWQgYWdhaW4gaWYgYW5cbi8vIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgICB3aGlsZSAoaW5kZXggPCBxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGluZGV4O1xuICAgICAgICAvLyBBZHZhbmNlIHRoZSBpbmRleCBiZWZvcmUgY2FsbGluZyB0aGUgdGFzay4gVGhpcyBlbnN1cmVzIHRoYXQgd2Ugd2lsbFxuICAgICAgICAvLyBiZWdpbiBmbHVzaGluZyBvbiB0aGUgbmV4dCB0YXNrIHRoZSB0YXNrIHRocm93cyBhbiBlcnJvci5cbiAgICAgICAgaW5kZXggPSBpbmRleCArIDE7XG4gICAgICAgIHF1ZXVlW2N1cnJlbnRJbmRleF0uY2FsbCgpO1xuICAgICAgICAvLyBQcmV2ZW50IGxlYWtpbmcgbWVtb3J5IGZvciBsb25nIGNoYWlucyBvZiByZWN1cnNpdmUgY2FsbHMgdG8gYGFzYXBgLlxuICAgICAgICAvLyBJZiB3ZSBjYWxsIGBhc2FwYCB3aXRoaW4gdGFza3Mgc2NoZWR1bGVkIGJ5IGBhc2FwYCwgdGhlIHF1ZXVlIHdpbGxcbiAgICAgICAgLy8gZ3JvdywgYnV0IHRvIGF2b2lkIGFuIE8obikgd2FsayBmb3IgZXZlcnkgdGFzayB3ZSBleGVjdXRlLCB3ZSBkb24ndFxuICAgICAgICAvLyBzaGlmdCB0YXNrcyBvZmYgdGhlIHF1ZXVlIGFmdGVyIHRoZXkgaGF2ZSBiZWVuIGV4ZWN1dGVkLlxuICAgICAgICAvLyBJbnN0ZWFkLCB3ZSBwZXJpb2RpY2FsbHkgc2hpZnQgMTAyNCB0YXNrcyBvZmYgdGhlIHF1ZXVlLlxuICAgICAgICBpZiAoaW5kZXggPiBjYXBhY2l0eSkge1xuICAgICAgICAgICAgLy8gTWFudWFsbHkgc2hpZnQgYWxsIHZhbHVlcyBzdGFydGluZyBhdCB0aGUgaW5kZXggYmFjayB0byB0aGVcbiAgICAgICAgICAgIC8vIGJlZ2lubmluZyBvZiB0aGUgcXVldWUuXG4gICAgICAgICAgICBmb3IgKHZhciBzY2FuID0gMCwgbmV3TGVuZ3RoID0gcXVldWUubGVuZ3RoIC0gaW5kZXg7IHNjYW4gPCBuZXdMZW5ndGg7IHNjYW4rKykge1xuICAgICAgICAgICAgICAgIHF1ZXVlW3NjYW5dID0gcXVldWVbc2NhbiArIGluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHF1ZXVlLmxlbmd0aCAtPSBpbmRleDtcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5sZW5ndGggPSAwO1xuICAgIGluZGV4ID0gMDtcbiAgICBmbHVzaGluZyA9IGZhbHNlO1xufVxuXG4vLyBgcmVxdWVzdEZsdXNoYCBpcyBpbXBsZW1lbnRlZCB1c2luZyBhIHN0cmF0ZWd5IGJhc2VkIG9uIGRhdGEgY29sbGVjdGVkIGZyb21cbi8vIGV2ZXJ5IGF2YWlsYWJsZSBTYXVjZUxhYnMgU2VsZW5pdW0gd2ViIGRyaXZlciB3b3JrZXIgYXQgdGltZSBvZiB3cml0aW5nLlxuLy8gaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMW1HLTVVWUd1cDVxeEdkRU1Xa2hQNkJXQ3owNTNOVWIyRTFRb1VUVTE2dUEvZWRpdCNnaWQ9NzgzNzI0NTkzXG5cbi8vIFNhZmFyaSA2IGFuZCA2LjEgZm9yIGRlc2t0b3AsIGlQYWQsIGFuZCBpUGhvbmUgYXJlIHRoZSBvbmx5IGJyb3dzZXJzIHRoYXRcbi8vIGhhdmUgV2ViS2l0TXV0YXRpb25PYnNlcnZlciBidXQgbm90IHVuLXByZWZpeGVkIE11dGF0aW9uT2JzZXJ2ZXIuXG4vLyBNdXN0IHVzZSBgZ2xvYmFsYCBpbnN0ZWFkIG9mIGB3aW5kb3dgIHRvIHdvcmsgaW4gYm90aCBmcmFtZXMgYW5kIHdlYlxuLy8gd29ya2Vycy4gYGdsb2JhbGAgaXMgYSBwcm92aXNpb24gb2YgQnJvd3NlcmlmeSwgTXIsIE1ycywgb3IgTW9wLlxudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cbi8vIE11dGF0aW9uT2JzZXJ2ZXJzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGhhdmUgaGlnaCBwcmlvcml0eSBhbmQgd29ya1xuLy8gcmVsaWFibHkgZXZlcnl3aGVyZSB0aGV5IGFyZSBpbXBsZW1lbnRlZC5cbi8vIFRoZXkgYXJlIGltcGxlbWVudGVkIGluIGFsbCBtb2Rlcm4gYnJvd3NlcnMuXG4vL1xuLy8gLSBBbmRyb2lkIDQtNC4zXG4vLyAtIENocm9tZSAyNi0zNFxuLy8gLSBGaXJlZm94IDE0LTI5XG4vLyAtIEludGVybmV0IEV4cGxvcmVyIDExXG4vLyAtIGlQYWQgU2FmYXJpIDYtNy4xXG4vLyAtIGlQaG9uZSBTYWZhcmkgNy03LjFcbi8vIC0gU2FmYXJpIDYtN1xuaWYgKHR5cGVvZiBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuXG4vLyBNZXNzYWdlQ2hhbm5lbHMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgZ2l2ZSBkaXJlY3QgYWNjZXNzIHRvIHRoZSBIVE1MXG4vLyB0YXNrIHF1ZXVlLCBhcmUgaW1wbGVtZW50ZWQgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAsIFNhZmFyaSA1LjAtMSwgYW5kIE9wZXJhXG4vLyAxMS0xMiwgYW5kIGluIHdlYiB3b3JrZXJzIGluIG1hbnkgZW5naW5lcy5cbi8vIEFsdGhvdWdoIG1lc3NhZ2UgY2hhbm5lbHMgeWllbGQgdG8gYW55IHF1ZXVlZCByZW5kZXJpbmcgYW5kIElPIHRhc2tzLCB0aGV5XG4vLyB3b3VsZCBiZSBiZXR0ZXIgdGhhbiBpbXBvc2luZyB0aGUgNG1zIGRlbGF5IG9mIHRpbWVycy5cbi8vIEhvd2V2ZXIsIHRoZXkgZG8gbm90IHdvcmsgcmVsaWFibHkgaW4gSW50ZXJuZXQgRXhwbG9yZXIgb3IgU2FmYXJpLlxuXG4vLyBJbnRlcm5ldCBFeHBsb3JlciAxMCBpcyB0aGUgb25seSBicm93c2VyIHRoYXQgaGFzIHNldEltbWVkaWF0ZSBidXQgZG9lc1xuLy8gbm90IGhhdmUgTXV0YXRpb25PYnNlcnZlcnMuXG4vLyBBbHRob3VnaCBzZXRJbW1lZGlhdGUgeWllbGRzIHRvIHRoZSBicm93c2VyJ3MgcmVuZGVyZXIsIGl0IHdvdWxkIGJlXG4vLyBwcmVmZXJyYWJsZSB0byBmYWxsaW5nIGJhY2sgdG8gc2V0VGltZW91dCBzaW5jZSBpdCBkb2VzIG5vdCBoYXZlXG4vLyB0aGUgbWluaW11bSA0bXMgcGVuYWx0eS5cbi8vIFVuZm9ydHVuYXRlbHkgdGhlcmUgYXBwZWFycyB0byBiZSBhIGJ1ZyBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCBNb2JpbGUgKGFuZFxuLy8gRGVza3RvcCB0byBhIGxlc3NlciBleHRlbnQpIHRoYXQgcmVuZGVycyBib3RoIHNldEltbWVkaWF0ZSBhbmRcbi8vIE1lc3NhZ2VDaGFubmVsIHVzZWxlc3MgZm9yIHRoZSBwdXJwb3NlcyBvZiBBU0FQLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL2lzc3Vlcy8zOTZcblxuLy8gVGltZXJzIGFyZSBpbXBsZW1lbnRlZCB1bml2ZXJzYWxseS5cbi8vIFdlIGZhbGwgYmFjayB0byB0aW1lcnMgaW4gd29ya2VycyBpbiBtb3N0IGVuZ2luZXMsIGFuZCBpbiBmb3JlZ3JvdW5kXG4vLyBjb250ZXh0cyBpbiB0aGUgZm9sbG93aW5nIGJyb3dzZXJzLlxuLy8gSG93ZXZlciwgbm90ZSB0aGF0IGV2ZW4gdGhpcyBzaW1wbGUgY2FzZSByZXF1aXJlcyBudWFuY2VzIHRvIG9wZXJhdGUgaW4gYVxuLy8gYnJvYWQgc3BlY3RydW0gb2YgYnJvd3NlcnMuXG4vL1xuLy8gLSBGaXJlZm94IDMtMTNcbi8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgNi05XG4vLyAtIGlQYWQgU2FmYXJpIDQuM1xuLy8gLSBMeW54IDIuOC43XG59IGVsc2Uge1xuICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihmbHVzaCk7XG59XG5cbi8vIGByZXF1ZXN0Rmx1c2hgIHJlcXVlc3RzIHRoYXQgdGhlIGhpZ2ggcHJpb3JpdHkgZXZlbnQgcXVldWUgYmUgZmx1c2hlZCBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZS5cbi8vIFRoaXMgaXMgdXNlZnVsIHRvIHByZXZlbnQgYW4gZXJyb3IgdGhyb3duIGluIGEgdGFzayBmcm9tIHN0YWxsaW5nIHRoZSBldmVudFxuLy8gcXVldWUgaWYgdGhlIGV4Y2VwdGlvbiBoYW5kbGVkIGJ5IE5vZGUuanPigJlzXG4vLyBgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIpYCBvciBieSBhIGRvbWFpbi5cbnJhd0FzYXAucmVxdWVzdEZsdXNoID0gcmVxdWVzdEZsdXNoO1xuXG4vLyBUbyByZXF1ZXN0IGEgaGlnaCBwcmlvcml0eSBldmVudCwgd2UgaW5kdWNlIGEgbXV0YXRpb24gb2JzZXJ2ZXIgYnkgdG9nZ2xpbmdcbi8vIHRoZSB0ZXh0IG9mIGEgdGV4dCBub2RlIGJldHdlZW4gXCIxXCIgYW5kIFwiLTFcIi5cbmZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRvZ2dsZSA9IDE7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIHRvZ2dsZSA9IC10b2dnbGU7XG4gICAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZTtcbiAgICB9O1xufVxuXG4vLyBUaGUgbWVzc2FnZSBjaGFubmVsIHRlY2huaXF1ZSB3YXMgZGlzY292ZXJlZCBieSBNYWx0ZSBVYmwgYW5kIHdhcyB0aGVcbi8vIG9yaWdpbmFsIGZvdW5kYXRpb24gZm9yIHRoaXMgbGlicmFyeS5cbi8vIGh0dHA6Ly93d3cubm9uYmxvY2tpbmcuaW8vMjAxMS8wNi93aW5kb3duZXh0dGljay5odG1sXG5cbi8vIFNhZmFyaSA2LjAuNSAoYXQgbGVhc3QpIGludGVybWl0dGVudGx5IGZhaWxzIHRvIGNyZWF0ZSBtZXNzYWdlIHBvcnRzIG9uIGFcbi8vIHBhZ2UncyBmaXJzdCBsb2FkLiBUaGFua2Z1bGx5LCB0aGlzIHZlcnNpb24gb2YgU2FmYXJpIHN1cHBvcnRzXG4vLyBNdXRhdGlvbk9ic2VydmVycywgc28gd2UgZG9uJ3QgbmVlZCB0byBmYWxsIGJhY2sgaW4gdGhhdCBjYXNlLlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTWVzc2FnZUNoYW5uZWwoY2FsbGJhY2spIHtcbi8vICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuLy8gICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gY2FsbGJhY2s7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIEZvciByZWFzb25zIGV4cGxhaW5lZCBhYm92ZSwgd2UgYXJlIGFsc28gdW5hYmxlIHRvIHVzZSBgc2V0SW1tZWRpYXRlYFxuLy8gdW5kZXIgYW55IGNpcmN1bXN0YW5jZXMuXG4vLyBFdmVuIGlmIHdlIHdlcmUsIHRoZXJlIGlzIGFub3RoZXIgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwLlxuLy8gSXQgaXMgbm90IHN1ZmZpY2llbnQgdG8gYXNzaWduIGBzZXRJbW1lZGlhdGVgIHRvIGByZXF1ZXN0Rmx1c2hgIGJlY2F1c2Vcbi8vIGBzZXRJbW1lZGlhdGVgIG11c3QgYmUgY2FsbGVkICpieSBuYW1lKiBhbmQgdGhlcmVmb3JlIG11c3QgYmUgd3JhcHBlZCBpbiBhXG4vLyBjbG9zdXJlLlxuLy8gTmV2ZXIgZm9yZ2V0LlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tU2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBzZXRJbW1lZGlhdGUoY2FsbGJhY2spO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIFNhZmFyaSA2LjAgaGFzIGEgcHJvYmxlbSB3aGVyZSB0aW1lcnMgd2lsbCBnZXQgbG9zdCB3aGlsZSB0aGUgdXNlciBpc1xuLy8gc2Nyb2xsaW5nLiBUaGlzIHByb2JsZW0gZG9lcyBub3QgaW1wYWN0IEFTQVAgYmVjYXVzZSBTYWZhcmkgNi4wIHN1cHBvcnRzXG4vLyBtdXRhdGlvbiBvYnNlcnZlcnMsIHNvIHRoYXQgaW1wbGVtZW50YXRpb24gaXMgdXNlZCBpbnN0ZWFkLlxuLy8gSG93ZXZlciwgaWYgd2UgZXZlciBlbGVjdCB0byB1c2UgdGltZXJzIGluIFNhZmFyaSwgdGhlIHByZXZhbGVudCB3b3JrLWFyb3VuZFxuLy8gaXMgdG8gYWRkIGEgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyIHRoYXQgY2FsbHMgZm9yIGEgZmx1c2guXG5cbi8vIGBzZXRUaW1lb3V0YCBkb2VzIG5vdCBjYWxsIHRoZSBwYXNzZWQgY2FsbGJhY2sgaWYgdGhlIGRlbGF5IGlzIGxlc3MgdGhhblxuLy8gYXBwcm94aW1hdGVseSA3IGluIHdlYiB3b3JrZXJzIGluIEZpcmVmb3ggOCB0aHJvdWdoIDE4LCBhbmQgc29tZXRpbWVzIG5vdFxuLy8gZXZlbiB0aGVuLlxuXG5mdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIC8vIFdlIGRpc3BhdGNoIGEgdGltZW91dCB3aXRoIGEgc3BlY2lmaWVkIGRlbGF5IG9mIDAgZm9yIGVuZ2luZXMgdGhhdFxuICAgICAgICAvLyBjYW4gcmVsaWFibHkgYWNjb21tb2RhdGUgdGhhdCByZXF1ZXN0LiBUaGlzIHdpbGwgdXN1YWxseSBiZSBzbmFwcGVkXG4gICAgICAgIC8vIHRvIGEgNCBtaWxpc2Vjb25kIGRlbGF5LCBidXQgb25jZSB3ZSdyZSBmbHVzaGluZywgdGhlcmUncyBubyBkZWxheVxuICAgICAgICAvLyBiZXR3ZWVuIGV2ZW50cy5cbiAgICAgICAgdmFyIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGhhbmRsZVRpbWVyLCAwKTtcbiAgICAgICAgLy8gSG93ZXZlciwgc2luY2UgdGhpcyB0aW1lciBnZXRzIGZyZXF1ZW50bHkgZHJvcHBlZCBpbiBGaXJlZm94XG4gICAgICAgIC8vIHdvcmtlcnMsIHdlIGVubGlzdCBhbiBpbnRlcnZhbCBoYW5kbGUgdGhhdCB3aWxsIHRyeSB0byBmaXJlXG4gICAgICAgIC8vIGFuIGV2ZW50IDIwIHRpbWVzIHBlciBzZWNvbmQgdW50aWwgaXQgc3VjY2VlZHMuXG4gICAgICAgIHZhciBpbnRlcnZhbEhhbmRsZSA9IHNldEludGVydmFsKGhhbmRsZVRpbWVyLCA1MCk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGltZXIoKSB7XG4gICAgICAgICAgICAvLyBXaGljaGV2ZXIgdGltZXIgc3VjY2VlZHMgd2lsbCBjYW5jZWwgYm90aCB0aW1lcnMgYW5kXG4gICAgICAgICAgICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SGFuZGxlKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxIYW5kbGUpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIFRoaXMgaXMgZm9yIGBhc2FwLmpzYCBvbmx5LlxuLy8gSXRzIG5hbWUgd2lsbCBiZSBwZXJpb2RpY2FsbHkgcmFuZG9taXplZCB0byBicmVhayBhbnkgY29kZSB0aGF0IGRlcGVuZHMgb25cbi8vIGl0cyBleGlzdGVuY2UuXG5yYXdBc2FwLm1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lciA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcjtcblxuLy8gQVNBUCB3YXMgb3JpZ2luYWxseSBhIG5leHRUaWNrIHNoaW0gaW5jbHVkZWQgaW4gUS4gVGhpcyB3YXMgZmFjdG9yZWQgb3V0XG4vLyBpbnRvIHRoaXMgQVNBUCBwYWNrYWdlLiBJdCB3YXMgbGF0ZXIgYWRhcHRlZCB0byBSU1ZQIHdoaWNoIG1hZGUgZnVydGhlclxuLy8gYW1lbmRtZW50cy4gVGhlc2UgZGVjaXNpb25zLCBwYXJ0aWN1bGFybHkgdG8gbWFyZ2luYWxpemUgTWVzc2FnZUNoYW5uZWwgYW5kXG4vLyB0byBjYXB0dXJlIHRoZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIGluIGEgY2xvc3VyZSwgd2VyZSBpbnRlZ3JhdGVkXG4vLyBiYWNrIGludG8gQVNBUCBwcm9wZXIuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGlsZGVpby9yc3ZwLmpzL2Jsb2IvY2RkZjcyMzI1NDZhOWNmODU4NTI0Yjc1Y2RlNmY5ZWRmNzI2MjBhNy9saWIvcnN2cC9hc2FwLmpzXG5cbid1c2Ugc3RyaWN0JztcblxuLy92YXIgYXNhcCA9IHJlcXVpcmUoJ2FzYXAvcmF3Jyk7XG52YXIgYXNhcCA9IHJhd0FzYXA7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vLyBTdGF0ZXM6XG4vL1xuLy8gMCAtIHBlbmRpbmdcbi8vIDEgLSBmdWxmaWxsZWQgd2l0aCBfdmFsdWVcbi8vIDIgLSByZWplY3RlZCB3aXRoIF92YWx1ZVxuLy8gMyAtIGFkb3B0ZWQgdGhlIHN0YXRlIG9mIGFub3RoZXIgcHJvbWlzZSwgX3ZhbHVlXG4vL1xuLy8gb25jZSB0aGUgc3RhdGUgaXMgbm8gbG9uZ2VyIHBlbmRpbmcgKDApIGl0IGlzIGltbXV0YWJsZVxuXG4vLyBBbGwgYF9gIHByZWZpeGVkIHByb3BlcnRpZXMgd2lsbCBiZSByZWR1Y2VkIHRvIGBfe3JhbmRvbSBudW1iZXJ9YFxuLy8gYXQgYnVpbGQgdGltZSB0byBvYmZ1c2NhdGUgdGhlbSBhbmQgZGlzY291cmFnZSB0aGVpciB1c2UuXG4vLyBXZSBkb24ndCB1c2Ugc3ltYm9scyBvciBPYmplY3QuZGVmaW5lUHJvcGVydHkgdG8gZnVsbHkgaGlkZSB0aGVtXG4vLyBiZWNhdXNlIHRoZSBwZXJmb3JtYW5jZSBpc24ndCBnb29kIGVub3VnaC5cblxuXG4vLyB0byBhdm9pZCB1c2luZyB0cnkvY2F0Y2ggaW5zaWRlIGNyaXRpY2FsIGZ1bmN0aW9ucywgd2Vcbi8vIGV4dHJhY3QgdGhlbSB0byBoZXJlLlxudmFyIExBU1RfRVJST1IgPSBudWxsO1xudmFyIElTX0VSUk9SID0ge307XG5mdW5jdGlvbiBnZXRUaGVuKG9iaikge1xuICB0cnkge1xuICAgIHJldHVybiBvYmoudGhlbjtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBMQVNUX0VSUk9SID0gZXg7XG4gICAgcmV0dXJuIElTX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyeUNhbGxPbmUoZm4sIGEpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZm4oYSk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgTEFTVF9FUlJPUiA9IGV4O1xuICAgIHJldHVybiBJU19FUlJPUjtcbiAgfVxufVxuZnVuY3Rpb24gdHJ5Q2FsbFR3byhmbiwgYSwgYikge1xuICB0cnkge1xuICAgIGZuKGEsIGIpO1xuICB9IGNhdGNoIChleCkge1xuICAgIExBU1RfRVJST1IgPSBleDtcbiAgICByZXR1cm4gSVNfRVJST1I7XG4gIH1cbn1cblxuLy9tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG5cbmZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgaWYgKHR5cGVvZiB0aGlzICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ldycpO1xuICB9XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xuICB9XG4gIHRoaXMuXzQxID0gMDtcbiAgdGhpcy5fODYgPSBudWxsO1xuICB0aGlzLl8xNyA9IFtdO1xuICBpZiAoZm4gPT09IG5vb3ApIHJldHVybjtcbiAgZG9SZXNvbHZlKGZuLCB0aGlzKTtcbn1cblByb21pc2UuXzEgPSBub29wO1xuXG5Qcm9taXNlLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgaWYgKHRoaXMuY29uc3RydWN0b3IgIT09IFByb21pc2UpIHtcbiAgICByZXR1cm4gc2FmZVRoZW4odGhpcywgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpO1xuICB9XG4gIHZhciByZXMgPSBuZXcgUHJvbWlzZShub29wKTtcbiAgaGFuZGxlKHRoaXMsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCByZXMpKTtcbiAgcmV0dXJuIHJlcztcbn07XG5cbmZ1bmN0aW9uIHNhZmVUaGVuKHNlbGYsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIHJldHVybiBuZXcgc2VsZi5jb25zdHJ1Y3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcyA9IG5ldyBQcm9taXNlKG5vb3ApO1xuICAgIHJlcy50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgaGFuZGxlKHNlbGYsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCByZXMpKTtcbiAgfSk7XG59O1xuZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG4gIHdoaWxlIChzZWxmLl80MSA9PT0gMykge1xuICAgIHNlbGYgPSBzZWxmLl84NjtcbiAgfVxuICBpZiAoc2VsZi5fNDEgPT09IDApIHtcbiAgICBzZWxmLl8xNy5wdXNoKGRlZmVycmVkKTtcbiAgICByZXR1cm47XG4gIH1cbiAgYXNhcChmdW5jdGlvbigpIHtcbiAgICB2YXIgY2IgPSBzZWxmLl80MSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbiAgICBpZiAoY2IgPT09IG51bGwpIHtcbiAgICAgIGlmIChzZWxmLl80MSA9PT0gMSkge1xuICAgICAgICByZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHNlbGYuXzg2KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl84Nik7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXQgPSB0cnlDYWxsT25lKGNiLCBzZWxmLl84Nik7XG4gICAgaWYgKHJldCA9PT0gSVNfRVJST1IpIHtcbiAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBMQVNUX0VSUk9SKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiByZXNvbHZlKHNlbGYsIG5ld1ZhbHVlKSB7XG4gIC8vIFByb21pc2UgUmVzb2x1dGlvbiBQcm9jZWR1cmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9taXNlcy1hcGx1cy9wcm9taXNlcy1zcGVjI3RoZS1wcm9taXNlLXJlc29sdXRpb24tcHJvY2VkdXJlXG4gIGlmIChuZXdWYWx1ZSA9PT0gc2VsZikge1xuICAgIHJldHVybiByZWplY3QoXG4gICAgICBzZWxmLFxuICAgICAgbmV3IFR5cGVFcnJvcignQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi4nKVxuICAgICk7XG4gIH1cbiAgaWYgKFxuICAgIG5ld1ZhbHVlICYmXG4gICAgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG5ld1ZhbHVlID09PSAnZnVuY3Rpb24nKVxuICApIHtcbiAgICB2YXIgdGhlbiA9IGdldFRoZW4obmV3VmFsdWUpO1xuICAgIGlmICh0aGVuID09PSBJU19FUlJPUikge1xuICAgICAgcmV0dXJuIHJlamVjdChzZWxmLCBMQVNUX0VSUk9SKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgdGhlbiA9PT0gc2VsZi50aGVuICYmXG4gICAgICBuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2VcbiAgICApIHtcbiAgICAgIHNlbGYuXzQxID0gMztcbiAgICAgIHNlbGYuXzg2ID0gbmV3VmFsdWU7XG4gICAgICBmaW5hbGUoc2VsZik7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZG9SZXNvbHZlKHRoZW4uYmluZChuZXdWYWx1ZSksIHNlbGYpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBzZWxmLl80MSA9IDE7XG4gIHNlbGYuXzg2ID0gbmV3VmFsdWU7XG4gIGZpbmFsZShzZWxmKTtcbn1cblxuZnVuY3Rpb24gcmVqZWN0KHNlbGYsIG5ld1ZhbHVlKSB7XG4gIHNlbGYuXzQxID0gMjtcbiAgc2VsZi5fODYgPSBuZXdWYWx1ZTtcbiAgZmluYWxlKHNlbGYpO1xufVxuZnVuY3Rpb24gZmluYWxlKHNlbGYpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLl8xNy5sZW5ndGg7IGkrKykge1xuICAgIGhhbmRsZShzZWxmLCBzZWxmLl8xN1tpXSk7XG4gIH1cbiAgc2VsZi5fMTcgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9taXNlKXtcbiAgdGhpcy5vbkZ1bGZpbGxlZCA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogbnVsbDtcbiAgdGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicgPyBvblJlamVjdGVkIDogbnVsbDtcbiAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBUYWtlIGEgcG90ZW50aWFsbHkgbWlzYmVoYXZpbmcgcmVzb2x2ZXIgZnVuY3Rpb24gYW5kIG1ha2Ugc3VyZVxuICogb25GdWxmaWxsZWQgYW5kIG9uUmVqZWN0ZWQgYXJlIG9ubHkgY2FsbGVkIG9uY2UuXG4gKlxuICogTWFrZXMgbm8gZ3VhcmFudGVlcyBhYm91dCBhc3luY2hyb255LlxuICovXG5mdW5jdGlvbiBkb1Jlc29sdmUoZm4sIHByb21pc2UpIHtcbiAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgdmFyIHJlcyA9IHRyeUNhbGxUd28oZm4sIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgIGRvbmUgPSB0cnVlO1xuICAgIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICB9KVxuICBpZiAoIWRvbmUgJiYgcmVzID09PSBJU19FUlJPUikge1xuICAgIGRvbmUgPSB0cnVlO1xuICAgIHJlamVjdChwcm9taXNlLCBMQVNUX0VSUk9SKTtcbiAgfVxufVxuXG4ndXNlIHN0cmljdCc7XG5cblxuLyoqXG4gKiBAbmFtZSBJbWFnZXNSZWFkeVxuICogQGNvbnN0cnVjdG9yXG4gKlxuICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fEVsZW1lbnR8RWxlbWVudFtdfGpRdWVyeXxOb2RlTGlzdHxzdHJpbmd9IGVsZW1lbnRzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGpxdWVyeVxuICpcbiAqL1xuZnVuY3Rpb24gSW1hZ2VzUmVhZHkoZWxlbWVudHMsIGpxdWVyeSkge1xuICBpZiAodHlwZW9mIGVsZW1lbnRzID09PSAnc3RyaW5nJykge1xuICAgIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtZW50cyk7XG4gICAgaWYgKCFlbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2VsZWN0b3IgYCcgKyBlbGVtZW50cyArICdgIHlpZWxkZWQgMCBlbGVtZW50cycpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBkZWZlcnJlZCA9IGRlZmVyKGpxdWVyeSk7XG4gIHRoaXMucmVzdWx0ID0gZGVmZXJyZWQucHJvbWlzZTtcblxuICB2YXIgaW1hZ2VzID0gdGhpcy5pbWFnZUVsZW1lbnRzKFxuICAgIHRoaXMudmFsaWRFbGVtZW50cyh0aGlzLnRvQXJyYXkoZWxlbWVudHMpLCBJbWFnZXNSZWFkeS5WQUxJRF9OT0RFX1RZUEVTKVxuICApO1xuXG4gIHZhciBpbWFnZUNvdW50ID0gaW1hZ2VzLmxlbmd0aDtcblxuICBpZiAoaW1hZ2VDb3VudCkge1xuICAgIHRoaXMudmVyaWZ5KGltYWdlcywgc3RhdHVzKGltYWdlQ291bnQsIGZ1bmN0aW9uKHJlYWR5KXtcbiAgICAgIGlmIChyZWFkeSkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGVsZW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZWxlbWVudHMpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuICBlbHNlIHtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKGVsZW1lbnRzKTtcbiAgfVxufVxuXG5cbkltYWdlc1JlYWR5LlZBTElEX05PREVfVFlQRVMgPSB7XG4gIDEgIDogdHJ1ZSwgLy8gRUxFTUVOVF9OT0RFXG4gIDkgIDogdHJ1ZSwgLy8gRE9DVU1FTlRfTk9ERVxuICAxMSA6IHRydWUgIC8vIERPQ1VNRU5UX0ZSQUdNRU5UX05PREVcbn07XG5cblxuSW1hZ2VzUmVhZHkucHJvdG90eXBlID0ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxlbWVudHNcbiAgICogQHJldHVybnMge1tdfEhUTUxJbWFnZUVsZW1lbnRbXX1cbiAgICovXG4gIGltYWdlRWxlbWVudHMgOiBmdW5jdGlvbihlbGVtZW50cykge1xuICAgIHZhciBpbWFnZXMgPSBbXTtcblxuICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgICBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0lNRycpIHtcbiAgICAgICAgaW1hZ2VzLnB1c2goZWxlbWVudCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIGltYWdlRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpO1xuICAgICAgICBpZiAoaW1hZ2VFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBpbWFnZXMucHVzaC5hcHBseShpbWFnZXMsIGltYWdlRWxlbWVudHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW1hZ2VzO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbGVtZW50c1xuICAgKiBAcGFyYW0ge3t9fSB2YWxpZE5vZGVUeXBlc1xuICAgKiBAcmV0dXJucyB7W118RWxlbWVudFtdfVxuICAgKi9cbiAgdmFsaWRFbGVtZW50cyA6IGZ1bmN0aW9uKGVsZW1lbnRzLCB2YWxpZE5vZGVUeXBlcykge1xuICAgIHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgICByZXR1cm4gdmFsaWROb2RlVHlwZXNbZWxlbWVudC5ub2RlVHlwZV07XG4gICAgfSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50W119IGltYWdlc1xuICAgKiBAcmV0dXJucyB7W118SFRNTEltYWdlRWxlbWVudFtdfVxuICAgKi9cbiAgaW5jb21wbGV0ZUltYWdlcyA6IGZ1bmN0aW9uKGltYWdlcykge1xuICAgIHJldHVybiBpbWFnZXMuZmlsdGVyKGZ1bmN0aW9uKGltYWdlKXtcbiAgICAgIHJldHVybiAhKGltYWdlLmNvbXBsZXRlICYmIGltYWdlLm5hdHVyYWxXaWR0aCk7XG4gICAgfSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb25sb2FkXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uZXJyb3JcbiAgICogQHJldHVybnMge2Z1bmN0aW9uKEhUTUxJbWFnZUVsZW1lbnQpfVxuICAgKi9cbiAgcHJveHlJbWFnZSA6IGZ1bmN0aW9uKG9ubG9hZCwgb25lcnJvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgdmFyIF9pbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICBfaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9ubG9hZCk7XG4gICAgICBfaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICAgIF9pbWFnZS5zcmMgPSBpbWFnZS5zcmM7XG5cbiAgICAgIHJldHVybiBfaW1hZ2U7XG4gICAgfTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnRbXX0gaW1hZ2VzXG4gICAqIEBwYXJhbSB7e2ZhaWxlZDogZnVuY3Rpb24sIGxvYWRlZDogZnVuY3Rpb259fSBzdGF0dXNcbiAgICovXG4gIHZlcmlmeSA6IGZ1bmN0aW9uKGltYWdlcywgc3RhdHVzKSB7XG4gICAgdmFyIGluY29tcGxldGUgPSB0aGlzLmluY29tcGxldGVJbWFnZXMoaW1hZ2VzKTtcblxuICAgIGlmIChpbWFnZXMubGVuZ3RoID4gaW5jb21wbGV0ZS5sZW5ndGgpIHtcbiAgICAgIHN0YXR1cy5sb2FkZWQoaW1hZ2VzLmxlbmd0aCAtIGluY29tcGxldGUubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBpZiAoaW5jb21wbGV0ZS5sZW5ndGgpIHtcbiAgICAgIGluY29tcGxldGUuZm9yRWFjaCh0aGlzLnByb3h5SW1hZ2UoXG4gICAgICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgc3RhdHVzLmxvYWRlZCgxKTtcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKXtcbiAgICAgICAgICBzdGF0dXMuZmFpbGVkKDEpO1xuICAgICAgICB9XG4gICAgICApKTtcbiAgICB9XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fEVsZW1lbnR8RWxlbWVudFtdfGpRdWVyeXxOb2RlTGlzdH0gb2JqZWN0XG4gICAqIEByZXR1cm5zIHtFbGVtZW50W119XG4gICAqL1xuICB0b0FycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9iamVjdC5sZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gW10uc2xpY2UuY2FsbChvYmplY3QpO1xuICAgIH1cblxuICAgIHJldHVybiBbb2JqZWN0XTtcbiAgfVxuXG59O1xuXG5cbi8qKlxuICogQHBhcmFtIGpxdWVyeVxuICogQHJldHVybnMgZGVmZXJyZWRcbiAqL1xuZnVuY3Rpb24gZGVmZXIoanF1ZXJ5KSB7XG4gIHZhciBkZWZlcnJlZDtcblxuICBpZiAoanF1ZXJ5KSB7XG4gICAgZGVmZXJyZWQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuICAgIGRlZmVycmVkLnByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlKCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZGVmZXJyZWQgPSB7fTtcbiAgICBkZWZlcnJlZC5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgZGVmZXJyZWQucmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGRlZmVycmVkO1xufVxuXG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IGltYWdlQ291bnRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGRvbmVcbiAqIEByZXR1cm5zIHt7ZmFpbGVkOiBmdW5jdGlvbiwgbG9hZGVkOiBmdW5jdGlvbn19XG4gKi9cbmZ1bmN0aW9uIHN0YXR1cyhpbWFnZUNvdW50LCBkb25lKSB7XG4gIHZhciBsb2FkZWQgPSAwLFxuICAgICAgdG90YWwgPSBpbWFnZUNvdW50LFxuICAgICAgdmVyaWZpZWQgPSAwO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICBpZiAodG90YWwgPT09IHZlcmlmaWVkKSB7XG4gICAgICBkb25lKHRvdGFsID09PSBsb2FkZWQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKi9cbiAgICBmYWlsZWQgOiBmdW5jdGlvbihjb3VudCkge1xuICAgICAgdmVyaWZpZWQgKz0gY291bnQ7XG4gICAgICB1cGRhdGUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gICAgICovXG4gICAgbG9hZGVkIDogZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIGxvYWRlZCArPSBjb3VudDtcbiAgICAgIHZlcmlmaWVkICs9IGNvdW50O1xuICAgICAgdXBkYXRlKCk7XG4gICAgfVxuXG4gIH07XG59XG5cblxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBqUXVlcnkgcGx1Z2luXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuaWYgKHdpbmRvdy5qUXVlcnkpIHtcbiAgJC5mbi5pbWFnZXNSZWFkeSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBJbWFnZXNSZWFkeSh0aGlzLCB0cnVlKTtcbiAgICByZXR1cm4gaW5zdGFuY2UucmVzdWx0O1xuICB9O1xufVxuXG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIERlZmF1bHQgZW50cnkgcG9pbnRcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBpbWFnZXNSZWFkeShlbGVtZW50cykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBpbnN0YW5jZSA9IG5ldyBJbWFnZXNSZWFkeShlbGVtZW50cyk7XG4gIHJldHVybiBpbnN0YW5jZS5yZXN1bHQ7XG59XG5cbnJldHVybiBpbWFnZXNSZWFkeTtcbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2ltYWdlc3JlYWR5L2Rpc3QvaW1hZ2VzcmVhZHkuanNcbi8vIG1vZHVsZSBpZCA9IDUyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuKiBTZWN0aW9uIGhpZ2hsaWdodGVyIG1vZHVsZVxuKiBAbW9kdWxlIG1vZHVsZXMvc2VjdGlvbkhpZ2hsaWdodGVyXG4qIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzIzOTU5ODgvaGlnaGxpZ2h0LW1lbnUtaXRlbS13aGVuLXNjcm9sbGluZy1kb3duLXRvLXNlY3Rpb25cbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgJG5hdmlnYXRpb25MaW5rcyA9ICQoJy5qcy1zZWN0aW9uLXNldCA+IGxpID4gYScpO1xuICB2YXIgJHNlY3Rpb25zID0gJChcInNlY3Rpb25cIik7XG4gIHZhciAkc2VjdGlvbnNSZXZlcnNlZCA9ICQoJChcInNlY3Rpb25cIikuZ2V0KCkucmV2ZXJzZSgpKTtcbiAgdmFyIHNlY3Rpb25JZFRvbmF2aWdhdGlvbkxpbmsgPSB7fTtcbiAgLy92YXIgZVRvcCA9ICQoJyNmcmVlLWRheS10cmlwcycpLm9mZnNldCgpLnRvcDtcblxuICAkc2VjdGlvbnMuZWFjaChmdW5jdGlvbigpIHtcbiAgICBzZWN0aW9uSWRUb25hdmlnYXRpb25MaW5rWyQodGhpcykuYXR0cignaWQnKV0gPSAkKCcuanMtc2VjdGlvbi1zZXQgPiBsaSA+IGFbaHJlZj1cIiMnICsgJCh0aGlzKS5hdHRyKCdpZCcpICsgJ1wiXScpO1xuICB9KTtcblxuICBmdW5jdGlvbiBvcHRpbWl6ZWQoKSB7XG4gICAgdmFyIHNjcm9sbFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgJHNlY3Rpb25zUmV2ZXJzZWQuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjdXJyZW50U2VjdGlvbiA9ICQodGhpcyk7XG4gICAgICB2YXIgc2VjdGlvblRvcCA9IGN1cnJlbnRTZWN0aW9uLm9mZnNldCgpLnRvcDtcblxuICAgICAgLy8gaWYoY3VycmVudFNlY3Rpb24uaXMoJ3NlY3Rpb246Zmlyc3QtY2hpbGQnKSAmJiBzZWN0aW9uVG9wID4gc2Nyb2xsUG9zaXRpb24pe1xuICAgICAgLy8gICBjb25zb2xlLmxvZygnc2Nyb2xsUG9zaXRpb24nLCBzY3JvbGxQb3NpdGlvbik7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCdzZWN0aW9uVG9wJywgc2VjdGlvblRvcCk7XG4gICAgICAvLyB9XG5cbiAgICAgIGlmIChzY3JvbGxQb3NpdGlvbiA+PSBzZWN0aW9uVG9wIHx8IChjdXJyZW50U2VjdGlvbi5pcygnc2VjdGlvbjpmaXJzdC1jaGlsZCcpICYmIHNlY3Rpb25Ub3AgPiBzY3JvbGxQb3NpdGlvbikpIHtcbiAgICAgICAgdmFyIGlkID0gY3VycmVudFNlY3Rpb24uYXR0cignaWQnKTtcbiAgICAgICAgdmFyICRuYXZpZ2F0aW9uTGluayA9IHNlY3Rpb25JZFRvbmF2aWdhdGlvbkxpbmtbaWRdO1xuICAgICAgICBpZiAoISRuYXZpZ2F0aW9uTGluay5oYXNDbGFzcygnaXMtYWN0aXZlJykgfHwgISQoJ3NlY3Rpb24nKS5oYXNDbGFzcygnby1jb250ZW50LWNvbnRhaW5lci0tY29tcGFjdCcpKSB7XG4gICAgICAgICAgICAkbmF2aWdhdGlvbkxpbmtzLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICRuYXZpZ2F0aW9uTGluay5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb3B0aW1pemVkKCk7XG4gICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgb3B0aW1pemVkKCk7XG4gIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc2VjdGlvbkhpZ2hsaWdodGVyLmpzIiwiLyoqXG4gKiBTdGF0aWMgY29sdW1uIG1vZHVsZVxuICogU2ltaWxhciB0byB0aGUgZ2VuZXJhbCBzdGlja3kgbW9kdWxlIGJ1dCB1c2VkIHNwZWNpZmljYWxseSB3aGVuIG9uZSBjb2x1bW5cbiAqIG9mIGEgdHdvLWNvbHVtbiBsYXlvdXQgaXMgbWVhbnQgdG8gYmUgc3RpY2t5XG4gKiBAbW9kdWxlIG1vZHVsZXMvc3RhdGljQ29sdW1uXG4gKiBAc2VlIG1vZHVsZXMvc3RpY2t5TmF2XG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgY29uc3Qgc3RpY2t5Q29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1zdGF0aWMnKTtcbiAgY29uc3Qgbm90U3RpY2t5Q2xhc3MgPSAnaXMtbm90LXN0aWNreSc7XG4gIGNvbnN0IGJvdHRvbUNsYXNzID0gJ2lzLWJvdHRvbSc7XG5cbiAgLyoqXG4gICogQ2FsY3VsYXRlcyB0aGUgd2luZG93IHBvc2l0aW9uIGFuZCBzZXRzIHRoZSBhcHByb3ByaWF0ZSBjbGFzcyBvbiB0aGUgZWxlbWVudFxuICAqIEBwYXJhbSB7b2JqZWN0fSBzdGlja3lDb250ZW50RWxlbSAtIERPTSBub2RlIHRoYXQgc2hvdWxkIGJlIHN0aWNraWVkXG4gICovXG4gIGZ1bmN0aW9uIGNhbGNXaW5kb3dQb3Moc3RpY2t5Q29udGVudEVsZW0pIHtcbiAgICBsZXQgZWxlbVRvcCA9IHN0aWNreUNvbnRlbnRFbGVtLnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgIGxldCBpc1Bhc3RCb3R0b20gPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBzdGlja3lDb250ZW50RWxlbS5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAtIHN0aWNreUNvbnRlbnRFbGVtLnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wID4gMDtcblxuICAgIC8vIFNldHMgZWxlbWVudCB0byBwb3NpdGlvbiBhYnNvbHV0ZSBpZiBub3Qgc2Nyb2xsZWQgdG8geWV0LlxuICAgIC8vIEFic29sdXRlbHkgcG9zaXRpb25pbmcgb25seSB3aGVuIG5lY2Vzc2FyeSBhbmQgbm90IGJ5IGRlZmF1bHQgcHJldmVudHMgZmxpY2tlcmluZ1xuICAgIC8vIHdoZW4gcmVtb3ZpbmcgdGhlIFwiaXMtYm90dG9tXCIgY2xhc3Mgb24gQ2hyb21lXG4gICAgaWYgKGVsZW1Ub3AgPiAwKSB7XG4gICAgICBzdGlja3lDb250ZW50RWxlbS5jbGFzc0xpc3QuYWRkKG5vdFN0aWNreUNsYXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RpY2t5Q29udGVudEVsZW0uY2xhc3NMaXN0LnJlbW92ZShub3RTdGlja3lDbGFzcyk7XG4gICAgfVxuICAgIGlmIChpc1Bhc3RCb3R0b20pIHtcbiAgICAgIHN0aWNreUNvbnRlbnRFbGVtLmNsYXNzTGlzdC5hZGQoYm90dG9tQ2xhc3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGlja3lDb250ZW50RWxlbS5jbGFzc0xpc3QucmVtb3ZlKGJvdHRvbUNsYXNzKTtcbiAgICB9XG4gIH1cblxuICBpZiAoc3RpY2t5Q29udGVudCkge1xuICAgIGZvckVhY2goc3RpY2t5Q29udGVudCwgZnVuY3Rpb24oc3RpY2t5Q29udGVudEVsZW0pIHtcbiAgICAgIGNhbGNXaW5kb3dQb3Moc3RpY2t5Q29udGVudEVsZW0pO1xuXG4gICAgICAvKipcbiAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAnc2Nyb2xsJy5cbiAgICAgICogQGZ1bmN0aW9uXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICovXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNhbGNXaW5kb3dQb3Moc3RpY2t5Q29udGVudEVsZW0pO1xuICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAvKipcbiAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAncmVzaXplJy5cbiAgICAgICogQGZ1bmN0aW9uXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICovXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNhbGNXaW5kb3dQb3Moc3RpY2t5Q29udGVudEVsZW0pO1xuICAgICAgfSwgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9zdGF0aWNDb2x1bW4uanMiLCIvKipcbiAqIEFsZXJ0IEJhbm5lciBtb2R1bGVcbiAqIEBtb2R1bGUgbW9kdWxlcy9hbGVydFxuICogQHNlZSBtb2R1bGVzL3RvZ2dsZU9wZW5cbiAqL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5pbXBvcnQgcmVhZENvb2tpZSBmcm9tICcuL3JlYWRDb29raWUuanMnO1xuaW1wb3J0IGRhdGFzZXQgZnJvbSAnLi9kYXRhc2V0LmpzJztcbmltcG9ydCBjcmVhdGVDb29raWUgZnJvbSAnLi9jcmVhdGVDb29raWUuanMnO1xuaW1wb3J0IGdldERvbWFpbiBmcm9tICcuL2dldERvbWFpbi5qcyc7XG5cbi8qKlxuICogRGlzcGxheXMgYW4gYWxlcnQgYmFubmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IG9wZW5DbGFzcyAtIFRoZSBjbGFzcyB0byB0b2dnbGUgb24gaWYgYmFubmVyIGlzIHZpc2libGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3BlbkNsYXNzKSB7XG4gIGlmICghb3BlbkNsYXNzKSB7XG4gICAgb3BlbkNsYXNzID0gJ2lzLW9wZW4nO1xuICB9XG5cbiAgLyoqXG4gICogTWFrZSBhbiBhbGVydCB2aXNpYmxlXG4gICogQHBhcmFtIHtvYmplY3R9IGFsZXJ0IC0gRE9NIG5vZGUgb2YgdGhlIGFsZXJ0IHRvIGRpc3BsYXlcbiAgKiBAcGFyYW0ge29iamVjdH0gc2libGluZ0VsZW0gLSBET00gbm9kZSBvZiBhbGVydCdzIGNsb3Nlc3Qgc2libGluZyxcbiAgKiB3aGljaCBnZXRzIHNvbWUgZXh0cmEgcGFkZGluZyB0byBtYWtlIHJvb20gZm9yIHRoZSBhbGVydFxuICAqL1xuICBmdW5jdGlvbiBkaXNwbGF5QWxlcnQoYWxlcnQsIHNpYmxpbmdFbGVtKSB7XG4gICAgYWxlcnQuY2xhc3NMaXN0LmFkZChvcGVuQ2xhc3MpO1xuICAgIGNvbnN0IGFsZXJ0SGVpZ2h0ID0gYWxlcnQub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IGN1cnJlbnRQYWRkaW5nID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoc2libGluZ0VsZW0pLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctYm90dG9tJyksIDEwKTtcbiAgICBzaWJsaW5nRWxlbS5zdHlsZS5wYWRkaW5nQm90dG9tID0gKGFsZXJ0SGVpZ2h0ICsgY3VycmVudFBhZGRpbmcpICsgJ3B4JztcbiAgfVxuXG4gIC8qKlxuICAqIFJlbW92ZSBleHRyYSBwYWRkaW5nIGZyb20gYWxlcnQgc2libGluZ1xuICAqIEBwYXJhbSB7b2JqZWN0fSBzaWJsaW5nRWxlbSAtIERPTSBub2RlIG9mIGFsZXJ0IHNpYmxpbmdcbiAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlQWxlcnRQYWRkaW5nKHNpYmxpbmdFbGVtKSB7XG4gICAgc2libGluZ0VsZW0uc3R5bGUucGFkZGluZ0JvdHRvbSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgKiBDaGVjayBhbGVydCBjb29raWVcbiAgKiBAcGFyYW0ge29iamVjdH0gYWxlcnQgLSBET00gbm9kZSBvZiB0aGUgYWxlcnRcbiAgKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgYWxlcnQgY29va2llIGlzIHNldFxuICAqL1xuICBmdW5jdGlvbiBjaGVja0FsZXJ0Q29va2llKGFsZXJ0KSB7XG4gICAgY29uc3QgY29va2llTmFtZSA9IGRhdGFzZXQoYWxlcnQsICdjb29raWUnKTtcbiAgICBpZiAoIWNvb2tpZU5hbWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiByZWFkQ29va2llKGNvb2tpZU5hbWUsIGRvY3VtZW50LmNvb2tpZSkgIT09ICd1bmRlZmluZWQnO1xuICB9XG5cbiAgLyoqXG4gICogQWRkIGFsZXJ0IGNvb2tpZVxuICAqIEBwYXJhbSB7b2JqZWN0fSBhbGVydCAtIERPTSBub2RlIG9mIHRoZSBhbGVydFxuICAqL1xuICBmdW5jdGlvbiBhZGRBbGVydENvb2tpZShhbGVydCkge1xuICAgIGNvbnN0IGNvb2tpZU5hbWUgPSBkYXRhc2V0KGFsZXJ0LCAnY29va2llJyk7XG4gICAgaWYgKGNvb2tpZU5hbWUpIHtcbiAgICAgIGNyZWF0ZUNvb2tpZShjb29raWVOYW1lLCAnZGlzbWlzc2VkJywgZ2V0RG9tYWluKHdpbmRvdy5sb2NhdGlvbiwgZmFsc2UpLCAzNjApO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFsZXJ0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1hbGVydCcpO1xuICBpZiAoYWxlcnRzLmxlbmd0aCkge1xuICAgIGZvckVhY2goYWxlcnRzLCBmdW5jdGlvbihhbGVydCkge1xuICAgICAgaWYgKCFjaGVja0FsZXJ0Q29va2llKGFsZXJ0KSkge1xuICAgICAgICBjb25zdCBhbGVydFNpYmxpbmcgPSBhbGVydC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICBkaXNwbGF5QWxlcnQoYWxlcnQsIGFsZXJ0U2libGluZyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAnY2hhbmdlT3BlblN0YXRlJy5cbiAgICAgICAgKiBUaGUgdmFsdWUgb2YgZXZlbnQuZGV0YWlsIGluZGljYXRlcyB3aGV0aGVyIHRoZSBvcGVuIHN0YXRlIGlzIHRydWVcbiAgICAgICAgKiAoaS5lLiB0aGUgYWxlcnQgaXMgdmlzaWJsZSkuXG4gICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgICAqL1xuICAgICAgICBhbGVydC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2VPcGVuU3RhdGUnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIC8vIEJlY2F1c2UgaU9TIHNhZmFyaSBpbmV4cGxpY2FibHkgdHVybnMgZXZlbnQuZGV0YWlsIGludG8gYW4gb2JqZWN0XG4gICAgICAgICAgaWYgKCh0eXBlb2YgZXZlbnQuZGV0YWlsID09PSAnYm9vbGVhbicgJiYgIWV2ZW50LmRldGFpbCkgfHxcbiAgICAgICAgICAgICh0eXBlb2YgZXZlbnQuZGV0YWlsID09PSAnb2JqZWN0JyAmJiAhZXZlbnQuZGV0YWlsLmRldGFpbClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGFkZEFsZXJ0Q29va2llKGFsZXJ0KTtcbiAgICAgICAgICAgIHJlbW92ZUFsZXJ0UGFkZGluZyhhbGVydFNpYmxpbmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2FsZXJ0LmpzIiwiLyoqXG4qIFJlYWRzIGEgY29va2llIGFuZCByZXR1cm5zIHRoZSB2YWx1ZVxuKiBAcGFyYW0ge3N0cmluZ30gY29va2llTmFtZSAtIE5hbWUgb2YgdGhlIGNvb2tpZVxuKiBAcGFyYW0ge3N0cmluZ30gY29va2llIC0gRnVsbCBsaXN0IG9mIGNvb2tpZXNcbiogQHJldHVybiB7c3RyaW5nfSAtIFZhbHVlIG9mIGNvb2tpZTsgdW5kZWZpbmVkIGlmIGNvb2tpZSBkb2VzIG5vdCBleGlzdFxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvb2tpZU5hbWUsIGNvb2tpZSkge1xuICByZXR1cm4gKFJlZ0V4cChcIig/Ol58OyApXCIgKyBjb29raWVOYW1lICsgXCI9KFteO10qKVwiKS5leGVjKGNvb2tpZSkgfHwgW10pLnBvcCgpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvcmVhZENvb2tpZS5qcyIsIi8qKlxuKiBTYXZlIGEgY29va2llXG4qIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gQ29va2llIG5hbWVcbiogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gQ29va2llIHZhbHVlXG4qIEBwYXJhbSB7c3RyaW5nfSBkb21haW4gLSBEb21haW4gb24gd2hpY2ggdG8gc2V0IGNvb2tpZVxuKiBAcGFyYW0ge2ludGVnZXJ9IGRheXMgLSBOdW1iZXIgb2YgZGF5cyBiZWZvcmUgY29va2llIGV4cGlyZXNcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgZG9tYWluLCBkYXlzKSB7XG4gIGNvbnN0IGV4cGlyZXMgPSBkYXlzID8gXCI7IGV4cGlyZXM9XCIgKyAobmV3IERhdGUoZGF5cyAqIDg2NEU1ICsgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSkpLnRvR01UU3RyaW5nKCkgOiBcIlwiO1xuICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIGV4cGlyZXMgKyBcIjsgcGF0aD0vOyBkb21haW49XCIgKyBkb21haW47XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9jcmVhdGVDb29raWUuanMiLCIvKipcbiogR2V0IHRoZSBkb21haW4gZnJvbSBhIFVSTFxuKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTFxuKiBAcGFyYW0ge2Jvb2xlYW59IHJvb3QgLSBXaGV0aGVyIHRvIHJldHVybiB0aGUgcm9vdCBkb21haW4gcmF0aGVyIHRoYW4gYSBzdWJkb21haW5cbiogQHJldHVybiB7c3RyaW5nfSAtIFRoZSBwYXJzZWQgZG9tYWluXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odXJsLCByb290KSB7XG4gIGZ1bmN0aW9uIHBhcnNlVXJsKHVybCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICB0YXJnZXQuaHJlZiA9IHVybDtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgaWYgKHR5cGVvZiB1cmwgPT09ICdzdHJpbmcnKSB7XG4gICAgdXJsID0gcGFyc2VVcmwodXJsKTtcbiAgfVxuICBsZXQgZG9tYWluID0gdXJsLmhvc3RuYW1lO1xuICBpZiAocm9vdCkge1xuICAgIGNvbnN0IHNsaWNlID0gZG9tYWluLm1hdGNoKC9cXC51ayQvKSA/IC0zIDogLTI7XG4gICAgZG9tYWluID0gZG9tYWluLnNwbGl0KFwiLlwiKS5zbGljZShzbGljZSkuam9pbihcIi5cIik7XG4gIH1cbiAgcmV0dXJuIGRvbWFpbjtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2dldERvbWFpbi5qcyIsIi8qKlxuKiBWYWxpZGF0ZSBhIGZvcm0gYW5kIHN1Ym1pdCB2aWEgdGhlIHNpZ251cCBBUElcbiovXG5yZXF1aXJlKCcuLi92ZW5kb3IvYnNkLXNpZ251cC1qc2FwaS1zaW1wbGUtZGV2LmpzJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBjb25zdCAkc2lnbnVwRm9ybXMgPSAkKCcuYnNkdG9vbHMtc2lnbnVwJyk7XG4gIGNvbnN0IGVycm9yTXNnID0gJ1BsZWFzZSBlbnRlciB5b3VyIGVtYWlsIGFuZCB6aXAgY29kZSBhbmQgc2VsZWN0IGF0IGxlYXN0IG9uZSBhZ2UgZ3JvdXAuJztcblxuICAvKipcbiAgKiBWYWxpZGF0ZSBmb3JtIGJlZm9yZSB1bnBhdXNpbmdcbiAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBqUXVlcnkgZXZlbnQgb2JqZWN0XG4gICogQHBhcmFtIHtvYmplY3R9IGZvcm1EYXRhIC0gU2VyaWFsaXplZCBmb3JtIGRhdGFcbiAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlVmFsaWRhdGlvbihldmVudCwgZm9ybURhdGEpIHtcbiAgICBsZXQgbm9FcnJvcnMgPSB0cnVlO1xuICAgIGNvbnN0ICRmb3JtID0gJCh0aGlzKTtcbiAgICAkZm9ybS5maW5kKCcuaXMtZXJyb3InKS5yZW1vdmVDbGFzcygnaXMtZXJyb3InKTtcbiAgICAkZm9ybS5maW5kKCcuYnNkdG9vbHMtZXJyb3InKS5odG1sKCcnKTtcbiAgICBjb25zdCAkcmVxdWlyZWRGaWVsZHMgPSAkZm9ybS5maW5kKCdbcmVxdWlyZWRdJyk7XG5cbiAgICAvKipcbiAgICAqIFZhbGlkYXRlIGVhY2ggZmllbGQuIFJlcXVpcmVkIGZpZWxkcyBtdXN0IGJlIG5vbi1lbXB0eSBhbmQgY29udGFpbiB0aGVcbiAgICAqIHJpZ2h0IHR5cGUgb2YgZGF0YS5cbiAgICAqIEBmdW5jdGlvblxuICAgICovXG4gICAgJHJlcXVpcmVkRmllbGRzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBmaWVsZE5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcbiAgICAgIGlmICh0eXBlb2YgZm9ybURhdGFbZmllbGROYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbm9FcnJvcnMgPSBmYWxzZTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtZXJyb3InKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGZpZWxkVHlwZSA9ICQodGhpcykuYXR0cigndHlwZScpO1xuICAgICAgICBjb25zdCBlbXJlZ2V4ID0gbmV3IFJlZ0V4cChcIl5bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzouW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokXCIsIFwiaVwiKTtcbiAgICAgICAgY29uc3QgdXNyZWdleCA9IG5ldyBSZWdFeHAoL15cXGR7NX0oLVxcZHs0fSk/JC9pKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChmaWVsZFR5cGUgPT09ICd0ZXh0JyAmJiBmb3JtRGF0YVtmaWVsZE5hbWVdLnRyaW0oKSA9PT0gJycpIHx8XG4gICAgICAgICAgKGZpZWxkVHlwZSA9PT0gJ2VtYWlsJyAmJiAhZW1yZWdleC50ZXN0KGZvcm1EYXRhW2ZpZWxkTmFtZV0pKSB8fFxuICAgICAgICAgIChmaWVsZE5hbWUgPT09ICd6aXAnICYmICF1c3JlZ2V4LnRlc3QoZm9ybURhdGFbZmllbGROYW1lXSkpIHx8XG4gICAgICAgICAgKGZpZWxkVHlwZSA9PT0gJ2NoZWNrYm94JyAmJiAhZm9ybURhdGFbZmllbGROYW1lXS5sZW5ndGgpXG4gICAgICAgICkge1xuICAgICAgICAgIG5vRXJyb3JzID0gZmFsc2U7XG4gICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChub0Vycm9ycykge1xuICAgICAgLy8gVG9vbHMgZXhwZWN0cyBhIGhpZGRlbiBmaWVsZCBmb3IgX2FsbF8gY2hlY2tib3hlcywgbm90IGp1c3QgY2hlY2tlZCBvbmVzXG4gICAgICAkZm9ybS5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBjb25zdCBjaGVja2JveFZhbHVlID0gJCh0aGlzKS5wcm9wKCdjaGVja2VkJykgPyAkKHRoaXMpLmF0dHIoJ3ZhbHVlJykgOiAnJztcbiAgICAgICAgbGV0IGNoZWNrYm94TmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgICBjaGVja2JveE5hbWUgPSBjaGVja2JveE5hbWUuc3Vic3RyaW5nKDIsIGNoZWNrYm94TmFtZS5sZW5ndGggLSAyKTtcbiAgICAgICAgJGZvcm0uYXBwZW5kKGA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCIke2NoZWNrYm94TmFtZX1bJHtpbmRleH1dXCIgdmFsdWU9XCIke2NoZWNrYm94VmFsdWV9XCI+YCk7XG4gICAgICB9KTtcbiAgICAgICRmb3JtLmRhdGEoJ2lzUGF1c2VkJywgZmFsc2UpO1xuICAgICAgJGZvcm0udHJpZ2dlcignc3VibWl0LmJzZHNpZ251cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZm9ybS5maW5kKCcuYnNkdG9vbHMtZXJyb3InKS5odG1sKGA8cD4ke2Vycm9yTXNnfTwvcD5gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBIYW5kbGUgZXJyb3JzIHJldHVybmVkIGJ5IHRoZSBCU0QgVG9vbHMgQVBJXG4gICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0galF1ZXJ5IGV2ZW50IG9iamVjdFxuICAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvckpTT04gLSBPcmlnaW5hbCByZXNwb25zZSBmcm9tIHRoZSBUb29scywgd2l0aCBhIGNhY2hlZFxuICAqIGpRdWVyeSByZWZlcmVuY2UgdG8gdGhlIGZvcm0gZmllbGRcbiAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlRXJyb3JzKGV2ZW50LCBlcnJvckpTT04pIHtcbiAgICBjb25zdCAkZm9ybSA9ICQodGhpcyk7XG4gICAgaWYgKGVycm9ySlNPTiAmJiBlcnJvckpTT04uZmllbGRfZXJyb3JzKSB7XG4gICAgICAvKipcbiAgICAgICogQWRkIGVycm9yIHN0eWxpbmcgdG8gdGhlIGZpZWxkIHdpdGggYW4gZXJyb3JcbiAgICAgICogQGZ1bmN0aW9uXG4gICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gaW5kZXggLSBDdXJyZW50IHBvc2l0aW9uIGluIHRoZSBzZXQgb2YgZXJyb3JzXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvciAtIEVycm9yIG9iamVjdFxuICAgICAgKi9cbiAgICAgICQuZWFjaChlcnJvckpTT04uZmllbGRfZXJyb3JzLCBmdW5jdGlvbihpbmRleCwgZXJyb3IpIHtcbiAgICAgICAgZXJyb3IuJGZpZWxkLmFkZENsYXNzKCdpcy1lcnJvcicpO1xuICAgICAgICAkZm9ybS5maW5kKCcuYnNkdG9vbHMtZXJyb3InKS5odG1sKGA8cD4ke2Vycm9yLm1lc3NhZ2V9PC9wPmApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRmb3JtLmZpbmQoJy5ic2R0b29scy1lcnJvcicpLmh0bWwoJzxwPllvdXIgc2lnbnVwIGNvdWxkIG5vdCBiZSBjb21wbGV0ZWQuPC9wPicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIEhhbmRsZSBzdWNjZXNzIHJlc3BvbnNlIGZyb20gdGhlIEJTRCBUb29scyBBUElcbiAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlU3VjY2VzcygpIHtcbiAgICAkKHRoaXMpLmh0bWwoJzxwIGNsYXNzPVwiYy1zaWdudXAtZm9ybV9fc3VjY2Vzc1wiPk9uZSBtb3JlIHN0ZXAhIDxiciAvPiBQbGVhc2UgY2hlY2sgeW91ciBpbmJveCBhbmQgY29uZmlybSB5b3VyIGVtYWlsIGFkZHJlc3MgdG8gc3RhcnQgcmVjZWl2aW5nIHVwZGF0ZXMuIDxiciAvPlRoYW5rcyBmb3Igc2lnbmluZyB1cCE8L3A+Jyk7XG4gIH1cblxuICBpZiAoJHNpZ251cEZvcm1zLmxlbmd0aCkge1xuICAgIC8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xuICAgICRzaWdudXBGb3Jtcy5ic2RTaWdudXAoe1xuICAgICAgbm9fcmVkaXJlY3Q6IHRydWUsXG4gICAgICBzdGFydFBhdXNlZDogdHJ1ZVxuICAgIH0pXG4gICAgLm9uKCdic2QtaXNwYXVzZWQnLCAkLnByb3h5KGhhbmRsZVZhbGlkYXRpb24sIHRoaXMpKVxuICAgIC5vbignYnNkLWVycm9yJywgJC5wcm94eShoYW5kbGVFcnJvcnMsIHRoaXMpKVxuICAgIC5vbignYnNkLXN1Y2Nlc3MnLCAkLnByb3h5KGhhbmRsZVN1Y2Nlc3MsIHRoaXMpKTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIGNhbWVsY2FzZSAqL1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9ic2R0b29scy1zaWdudXAuanMiLCIvKmxldHMgZGVmaW5lIG91ciBzY29wZSovXG4oZnVuY3Rpb24oJCwgd2xvY2F0aW9uLCB1bmRlZmluZWQpe1xuXG4gICAvL2xldCdzIG1ha2UgaXQgZWFzeSB0byBqUXVlcnkncyBmb3JtIGFycmF5IGludG8gYSBkYXRhIG9iamVjdFxuICAgJC5mbi5zZXJpYWxpemVPYmplY3QgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbyA9IHt9LFxuICAgICAgICAgICAgYSA9IHRoaXMuc2VyaWFsaXplQXJyYXkoKTtcbiAgICAgICAgJC5lYWNoKGEsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKG9bdGhpcy5uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFvW3RoaXMubmFtZV0ucHVzaCkge1xuICAgICAgICAgICAgICAgICAgICBvW3RoaXMubmFtZV0gPSBbb1t0aGlzLm5hbWVdXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb1t0aGlzLm5hbWVdLnB1c2godGhpcy52YWx1ZSB8fCAnJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9bdGhpcy5uYW1lXSA9IHRoaXMudmFsdWUgfHwgJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbztcbiAgICB9O1xuXG4gICAgdmFyIGludGVyYWN0aXZlVmFsaWRpdHkgPSAncmVwb3J0VmFsaWRpdHknIGluICQoJzxmb3JtLz4nKS5nZXQoKVswXSwvL2NoZWNrIHdoZXRoZXIgdGhlIGJyb3dzZXIgc3VwcG9ydHMgaW50ZXJhY3RpdmUgdmFsaWRhdGlvbiBtZXNzYWdlc1xuICAgICAgICBwbHVnaW5uYW1lID0gJ2JzZFNpZ251cCcsLy90aGUgcGx1Z2luIHdlIHBsYW4gdG8gY3JlYXRlXG4gICAgICAgIGd1cCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgIHZhciBndXByZWdleCA9IG5ldyBSZWdFeHAoXCJbXFxcXD8mXVwiK25hbWUucmVwbGFjZSgvKFxcW3xcXF0pL2csXCJcXFxcJDFcIikrXCI9KFteJiNdKilcIiksXG4gICAgICAgICAgICAgICAgcmVzdWx0cyA9IGd1cHJlZ2V4LmV4ZWMoIHdsb2NhdGlvbi5ocmVmICk7XG4gICAgICAgICAgICByZXR1cm4gKCByZXN1bHRzID09PSBudWxsICk/XCJcIjpyZXN1bHRzWzFdO1xuICAgICAgICB9LC8vYWxsb3cgdXMgdG8gZ2V0IHVybCBwYXJhbWV0ZXJzXG4gICAgICAgIHNvdXJjZVN0cmluZyA9ICdzb3VyY2UnLFxuICAgICAgICBzdWJzb3VyY2VTdHJpbmcgPSAnc3Vic291cmNlJyxcbiAgICAgICAgdXJsc291cmNlID0gZ3VwKHNvdXJjZVN0cmluZyl8fGd1cCgnZmJfcmVmJyksLy9hbnkgc291cmNlIHdlIGNhbiBnZXQgZnJvbSB0aGUgdXJsXG4gICAgICAgIHVybHN1YnNvdXJjZSA9IGd1cChzdWJzb3VyY2VTdHJpbmcpOy8vYW55IHN1YnNvdXJjZSB3ZSBjYW4gZ2V0IGZyb20gdGhlIHVybFxuXG4gICAgZnVuY3Rpb24gcGFyc2VVUkwodXJsKXtcbiAgICAgICAgdmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7Ly9jcmVhdGUgYSBzcGVjaWFsIERPTSBub2RlIGZvciB0ZXN0aW5nXG4gICAgICAgIHAuaHJlZj11cmw7Ly9zdGljayBhIGxpbmsgaW50byBpdFxuICAgICAgICAvL3AucGF0aG5hbWUgPSBwLnBhdGhuYW1lLnJlcGxhY2UoLyheXFwvPykvLFwiL1wiKTsvL0lFIGZpeFxuICAgICAgICByZXR1cm4gcDsvL3JldHVybiB0aGUgRE9NIG5vZGUncyBuYXRpdmUgY29uY2VwdCBvZiBpdHNlbGYsIHdoaWNoIHdpbGwgZXhwYW5kIGFueSByZWxhdGl2ZSBsaW5rcyBpbnRvIHJlYWwgb25lc1xuICAgIH1cblxuICAgIC8vIGlkZWFsbHkgdGhlIGFwaSByZXR1cm5zIGluZm9ybWF0aXZlIGVycm9ycywgYnV0IGluIHRoZSBjYXNlIG9mIGZhaWx1cmVzLCBsZXQncyB0cnkgdG8gcGFyc2UgdGhlIGVycm9yIGpzb24sIGlmIGFueSwgYW5kIHRoZW4gbWFrZSBzdXJlIHdlIGhhdmUgYSBzdGFuZGFyZCByZXNwb25zZSBpZiBhbGwgZWxzZSBmYWlsc1xuICAgIGZ1bmN0aW9uIGVycm9yRmlsdGVyKGUpe1xuICAgICAgICB2YXIgbXNnID0gJ05vIHJlc3BvbnNlIGZyb20gc2V2ZXInO1xuICAgICAgICBpZihlICYmIGUucmVzcG9uc2VKU09OKXtcbiAgICAgICAgICAgIHJldHVybiBlLnJlc3BvbnNlSlNPTjtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgIHJldHVybiAkLnBhcnNlSlNPTihlLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaChlcnJvcil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6J2ZhaWwnLGNvZGU6NTAzLCBtZXNzYWdlOiBtc2csIGVycm9yOm1zZyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VjY2Vzc0ZpbHRlcihyZXNwb25zZSl7XG4gICAgICAgIHJldHVybiAoIXJlc3BvbnNlIHx8IHJlc3BvbnNlLnN0YXR1cyE9PVwic3VjY2Vzc1wiKSA/XG4gICAgICAgICAgICAkLkRlZmVycmVkKCkucmVqZWN0V2l0aCh0aGlzLCBbcmVzcG9uc2VdKSA6XG4gICAgICAgICAgICByZXNwb25zZTtcbiAgICB9XG5cbiAgICAvLyBhbGxvdyBhbnkgY2hhbmdlcyB0byBhIGZpZWxkIHRoYXQgd2FzIGludmFsaWQgdG8gY2xlYXIgdGhhdCBjdXN0b20gRXJyb3IgdmFsdWVcbiAgICBmdW5jdGlvbiByZWNoZWNrSWZUaGlzSXNTdGlsbEludmFsaWQoJGZpZWxkLCBmaWVsZCwgYmFkaW5wdXQpe1xuICAgICAgICAkZmllbGQub25lKCdjaGFuZ2Uga2V5dXAnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZigkZmllbGQudmFsKCkhPT1iYWRpbnB1dCl7XG4gICAgICAgICAgICAgICAgZmllbGQuc2V0Q3VzdG9tVmFsaWRpdHkoJycpOy8vd2UndmUgbm93IGNsZWFyZWQgdGhlIGN1c3RvbSBlcnJvclxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtU3VjY2VzcyhyZXN1bHQpe1xuICAgICAgICAvL1widGhpc1wiIGlzIHRoZSBqcXVlcnkgd3JhcHBlZCAkZm9ybVxuICAgICAgICB0aGlzLnRyaWdnZXIoJ2JzZC1zdWNjZXNzJyxbcmVzdWx0XSk7XG4gICAgICAgIGlmKHRoaXMuZGF0YSgnYnNkc2lnbnVwJykubm9fcmVkaXJlY3QhPT10cnVlICYmIHJlc3VsdC50aGFua3NfdXJsKXtcbiAgICAgICAgICAgIHdsb2NhdGlvbi5ocmVmID0gcmVzdWx0LnRoYW5rc191cmw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtRmFpbHVyZShlKXtcbiAgICAgICAgLy9cInRoaXNcIiBpcyB0aGUganF1ZXJ5IHdyYXBwZWQgJGZvcm1cbiAgICAgICAgdmFyICRmb3JtID0gdGhpcyxcbiAgICAgICAgICAgIGZ1bmVycm9yID0gZmFsc2UsXG4gICAgICAgICAgICBjb25maWcgPSB0aGlzLmRhdGEoJ2JzZHNpZ251cCcpLFxuICAgICAgICAgICAgZXJyb3JzQXNPYmplY3QgPSB7fTtcbiAgICAgICAgaWYoZSAmJiBlLmZpZWxkX2Vycm9ycyAmJiBlLmZpZWxkX2Vycm9ycy5sZW5ndGgpe1xuICAgICAgICAgICAgJC5lYWNoKGUuZmllbGRfZXJyb3JzLGZ1bmN0aW9uKGksZXJyKXtcbiAgICAgICAgICAgICAgICB2YXIgJGVyckZpZWxkID0gJGZvcm0uZmluZCgnW25hbWU9XCInK2Vyci5maWVsZCsnXCJdJyksXG4gICAgICAgICAgICAgICAgICAgIGVyckZpZWxkID0gJGVyckZpZWxkLmdldCgpWzBdO1xuICAgICAgICAgICAgICAgIGlmKGVyci5maWVsZD09PVwic3VibWl0LWJ0blwiKXtcbiAgICAgICAgICAgICAgICAgICAgZS5tZXNzYWdlID0gZXJyLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZXJyRmllbGQgJiYgZXJyRmllbGQuc2V0Q3VzdG9tVmFsaWRpdHkgJiYgaW50ZXJhY3RpdmVWYWxpZGl0eSAmJiAhJGZvcm1bMF0ubm9WYWxpZGF0ZSAmJiAhY29uZmlnLm5vX2h0bWw1dmFsaWRhdGUpe1xuICAgICAgICAgICAgICAgICAgICBlcnJGaWVsZC5zZXRDdXN0b21WYWxpZGl0eShlcnIubWVzc2FnZSk7Ly90aGlzIHNldHMgYW4gYWRkaXRpb25hbCBjb25zdHJhaW50IGJleW9uZCB3aGF0IHRoZSBicm93c2VyIHZhbGlkYXRlZFxuICAgICAgICAgICAgICAgICAgICByZWNoZWNrSWZUaGlzSXNTdGlsbEludmFsaWQoJGVyckZpZWxkLGVyckZpZWxkLGVyci5tZXNzYWdlKTsvL2FuZCBzaW5jZSB3ZSBkb24ndCBrbm93IHdoYXQgaXQgaXMsIHdlIGF0IGxlYXN0IGNoZWNrIHRvIG1ha2Ugc3VyZSBpdCdzIG5vIGxvbmdlciB3aGF0IHRoZSBzZXJ2ZXIgaGFzIGFscmVhZHkgcmVqZWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgZnVuZXJyb3I9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVyci4kZmllbGQgPSAkZXJyRmllbGQ7XG4gICAgICAgICAgICAgICAgZXJyb3JzQXNPYmplY3RbZXJyLmZpZWxkXSA9IGVyci5tZXNzYWdlO1xuICAgICAgICAgICAgICAgICRlcnJGaWVsZC50cmlnZ2VyKCdpbnZhbGlkJywgZXJyLm1lc3NhZ2UpOy8vYW5kIG5vdyBsZXQncyB0cmlnZ2VyIGEgcmVhbCBldmVudCB0aGF0IHNvbWVvbmUgY2FuIHVzZSB0byBwb3B1bGF0cmUgZXJyb3IgY2xhc3Nlc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZihmdW5lcnJvciAmJiBpbnRlcmFjdGl2ZVZhbGlkaXR5KXtcbiAgICAgICAgICAgICAgICAvL2ZvciB0aGlzIHRvIHdvcmssIHRyaWdnZXJpbmcgdGhlIG5hdGl2ZSB2YWxpZGF0aW9uLCB3ZSdkIG5lZWQgdG8gaGl0IHRoZSBzdWJtaXQgYnV0dG9uLCBub3QganVzdCBkbyBhICRmb3JtLnN1Ym1pdCgpXG4gICAgICAgICAgICAgICAgJGZvcm0uZmluZCgnW3R5cGU9XCJzdWJtaXRcIl0sW3R5cGU9XCJpbWFnZVwiXScpLmVxKDApLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgJGZvcm0udHJpZ2dlcignYnNkLWVycm9yJyxbZSwgZXJyb3JzQXNPYmplY3RdKTtcbiAgICB9XG5cbiAgICAvL2NyZWF0ZSBhIHJlcGxhY2VtZW50IGZvciBhY3R1YWxseSBzdWJtaXR0aW5nIHRoZSBmb3JtIGRpcmVjdGx5XG4gICAgZnVuY3Rpb24ganNhcGlTdWJtaXQoJGZvcm0sIGFjdGlvbiwgb3BzKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgLy93ZSdyZSBnb2luZyB0byB1c2UgalF1ZXJ5J3MgYWpheCB0byBhY3R1YWxseSBjaGVjayBpZiBhIHJlcXVlc3QgaXMgY3Jvc3NEb21haW4gb3Igbm90LCByYXRoZXIgdGhhbiB1c2luZyBvdXIgb3duIHRlc3QuIFRoZW4gaWYgaXQgaXMsIGFuZCB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgdGhhdCwgd2UnbGwganVzdCBjYW5jZWwgdGhlIHJlcXVlc3QgYW5kIGxldCB0aGUgZm9ybSBzdWJtaXQgbm9ybWFsbHlcbiAgICAgICAgICAgIHZhciBkYXRhID0gJGZvcm0uc2VyaWFsaXplT2JqZWN0KCk7XG4gICAgICAgICAgICBpZigkZm9ybS5kYXRhKCdpc1BhdXNlZCcpIT09dHJ1ZSl7Ly9hbGxvdyBhIG1lYW5zIHRvIHByZXZlbnQgc3VibWlzc2lvbiBlbnRpcmVseVxuICAgICAgICAgICAgICAgICRmb3JtLmRhdGEoJ2lzUGF1c2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdmFyIGFwaWFjdGlvbiA9IGFjdGlvbi5yZXBsYWNlKC9cXC9wYWdlXFwvKHNpZ251cHxzKS8sJy9wYWdlL3NhcGknKSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdCA9ICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGFwaWFjdGlvbiwvL3doZXJlIHRvIHBvc3QgdGhlIGZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJywvL25vIGpzb25wXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiBvcHMudGltZW91dHx8M2U0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJGZvcm0sLy9zZXQgdGhlIHZhbHVlIG9mIFwidGhpc1wiIGZvciBhbGwgZGVmZXJyZWQgZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oanF4aHIsIHJlcXVlc3RzZXR0aW5ncyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wcy5wcm94eWFsbCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0c2V0dGluZ3MuY3Jvc3NEb21haW4gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICEkLnN1cHBvcnQuY29ycyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgISgkLm9sZGlleGRyICYmIHBhcnNlVVJMKHJlcXVlc3RzZXR0aW5ncy51cmwpLnByb3RvY29sPT09d2xvY2F0aW9uLnByb3RvY29sKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYob3BzLm9sZHByb3h5fHxvcHMucHJveHlhbGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdHNldHRpbmdzLnVybCA9IG9wcy5vbGRwcm94eXx8b3BzLnByb3h5YWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdHNldHRpbmdzLmNyb3NzRG9tYWluID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0c2V0dGluZ3MuZGF0YSArPSAnJnB1cmw9JythcGlhY3Rpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOy8vcmVxdWVzdCBpcyBjb3JzIGJ1dCB0aGUgYnJvd3NlciBjYW4ndCBoYW5kbGUgdGhhdCwgc28gbGV0IHRoZSBub3JtYWwgZm9ybSBiZWhhdmlvciBwcm9jZWVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOy8vY2FuY2VsIHRoZSBuYXRpdmUgZm9ybSBzdWJtaXQgYmVoYXZpb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvL29ubHkgYWRkIHRoZSBoYW5kbGVycyBpZiB0aGUgcmVxdWVzdCBhY3R1YWxseSBoYXBwZW5lZFxuICAgICAgICAgICAgICAgIGlmKHJlcXVlc3Quc3RhdHVzVGV4dCE9PVwiY2FuY2VsZWRcIil7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoJ2JzZC1zdWJtaXQnLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oc3VjY2Vzc0ZpbHRlciwgZXJyb3JGaWx0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uZGF0YSgnaXNQYXVzZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvbmUoZm9ybVN1Y2Nlc3MpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChmb3JtRmFpbHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOy8vY2FuY2VsIHRoZSBuYXRpdmUgZm9ybSBzdWJtaXQgYmVoYXZpb3JcbiAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKCdic2QtaXNwYXVzZWQnLCBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvL2hhbmRsZSBtYWtpbmcgc3VyZSBzb3VyY2VzIGluIHRoZSB1cmwgZW5kIHVwIGluIHRoZSBmb3JtLCBsaWtlIGluIGEgbmF0aXZlIHRvb2xzIHNpZ251cCBmb3JtXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplU291cmNlRmllbGQoJGZvcm0sIG5hbWUsIGV4dGVybmFsKXtcbiAgICAgICAgdmFyICRmaWVsZCA9ICRmb3JtLmZpbmQoJ1tuYW1lPVwiJytuYW1lKydcIl0nKSxcbiAgICAgICAgICAgIG9sZHZhbDtcbiAgICAgICAgaWYoISRmaWVsZC5sZW5ndGgpe1xuICAgICAgICAgICAgJGZpZWxkID0gJCgnPGlucHV0Lz4nLHsndHlwZSc6J2hpZGRlbicsJ25hbWUnOm5hbWV9KS5hcHBlbmRUbygkZm9ybSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoZXh0ZXJuYWwpe1xuICAgICAgICAgICAgb2xkdmFsID0gJGZpZWxkLnZhbCgpO1xuICAgICAgICAgICAgJGZpZWxkLnZhbChcbiAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgIChvbGR2YWwhPT1cIlwiKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAob2xkdmFsKycsJykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICApK2V4dGVybmFsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypjcmVhdGUgdGhlIHBsdWdpbiovXG4gICAgJC5mbi5ic2RTaWdudXAgPSBmdW5jdGlvbihvcHMpe1xuICAgICAgICBvcHMgPSBvcHN8fHt9O1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIGFjdGlvbiA9ICRmb3JtLmF0dHIoJ2FjdGlvbicpOy8vYWN0aW9uIG9yIHNlbGYgKHNlbGYgaXMgcHJldHR5IHVubGlrZWx5IGhlcmUsIGJ1dCBid2hhdGV2ZXIpXG4gICAgICAgICAgICBpZihvcHM9PT1cInJlbW92ZVwiKXtcbiAgICAgICAgICAgICAgICAkZm9ybS5vZmYoJ3N1Ym1pdC5ic2RzaWdudXAnKS5yZW1vdmVEYXRhKCdic2RzaWdudXAgaXNQYXVzZWQnKTsvL3JlbW92ZXMgdGhlIHBsdWdpbiBlbnRpcmVseVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaWYoJGZvcm0uaXMoJ2Zvcm0nKSAmJiBhY3Rpb24uaW5kZXhPZigncGFnZS9zJyk+LTEpey8vb25seSBib3RoZXIgaWYga2V5IGVsZW1lbnRzIGFyZSBwcmVzZW50XG4gICAgICAgICAgICAgICAgICAgIGlmKCRmb3JtLmRhdGEoJ2JzZHNvdXJjZWQnKSE9PXRydWUgJiYgIW9wcy5ub3NvdXJjZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVTb3VyY2VGaWVsZCgkZm9ybSwgc291cmNlU3RyaW5nLCB1cmxzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplU291cmNlRmllbGQoJGZvcm0sIHN1YnNvdXJjZVN0cmluZywgdXJsc3Vic291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmRhdGEoJ2JzZHNvdXJjZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmRhdGEoJ2JzZHNpZ251cCcsb3BzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYob3BzLnN0YXJ0UGF1c2VkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmRhdGEoJ2lzUGF1c2VkJyx0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQuYnNkc2lnbnVwJywganNhcGlTdWJtaXQoJGZvcm0sIGFjdGlvbiwgb3BzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG59KGpRdWVyeSwgd2luZG93LmxvY2F0aW9uKSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvdmVuZG9yL2JzZC1zaWdudXAtanNhcGktc2ltcGxlLWRldi5qcyIsIi8qKlxuKiBGb3JtIEVmZmVjdHMgbW9kdWxlXG4qIEBtb2R1bGUgbW9kdWxlcy9mb3JtRWZmZWN0c1xuKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2Ryb3BzL1RleHRJbnB1dEVmZmVjdHMvYmxvYi9tYXN0ZXIvaW5kZXgyLmh0bWxcbiovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcbmltcG9ydCBkaXNwYXRjaEV2ZW50IGZyb20gJy4vZGlzcGF0Y2hFdmVudC5qcyc7XG5cbi8qKlxuKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIHNldCBhbiAnaXMtZmlsbGVkJyBjbGFzcyBvbiBpbnB1dHMgdGhhdCBhcmUgZm9jdXNlZCBvclxuKiBjb250YWluIHRleHQuIENhbiB0aGVuIGJlIHVzZWQgdG8gYWRkIGVmZmVjdHMgdG8gdGhlIGZvcm0sIHN1Y2ggYXMgbW92aW5nXG4qIHRoZSBsYWJlbC5cbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgLyoqXG4gICogQWRkIHRoZSBmaWxsZWQgY2xhc3Mgd2hlbiBpbnB1dCBpcyBmb2N1c2VkXG4gICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAqL1xuICBmdW5jdGlvbiBoYW5kbGVGb2N1cyhldmVudCkge1xuICAgIGNvbnN0IHdyYXBwZXJFbGVtID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgd3JhcHBlckVsZW0uY2xhc3NMaXN0LmFkZCgnaXMtZmlsbGVkJyk7XG4gIH1cblxuICAvKipcbiAgKiBSZW1vdmUgdGhlIGZpbGxlZCBjbGFzcyB3aGVuIGlucHV0IGlzIGJsdXJyZWQgaWYgaXQgZG9lcyBub3QgY29udGFpbiB0ZXh0XG4gICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAqL1xuICBmdW5jdGlvbiBoYW5kbGVCbHVyKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC52YWx1ZS50cmltKCkgPT09ICcnKSB7XG4gICAgICBjb25zdCB3cmFwcGVyRWxlbSA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgd3JhcHBlckVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaXMtZmlsbGVkJyk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNpZ251cC1mb3JtX19maWVsZCcpO1xuICBpZiAoaW5wdXRzLmxlbmd0aCkge1xuICAgIGZvckVhY2goaW5wdXRzLCBmdW5jdGlvbihpbnB1dEVsZW0pIHtcbiAgICAgIGlucHV0RWxlbS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZUZvY3VzKTtcbiAgICAgIGlucHV0RWxlbS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgaGFuZGxlQmx1cik7XG4gICAgICBkaXNwYXRjaEV2ZW50KGlucHV0RWxlbSwgJ2JsdXInKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvZm9ybUVmZmVjdHMuanMiLCIvKipcbiogQ3Jvc3MtYnJvd3NlciB1dGlsaXR5IHRvIGZpcmUgZXZlbnRzXG4qIEBwYXJhbSB7b2JqZWN0fSBlbGVtIC0gRE9NIGVsZW1lbnQgdG8gZmlyZSBldmVudCBvblxuKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gRXZlbnQgdHlwZSwgaS5lLiAncmVzaXplJywgJ2NsaWNrJ1xuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGVsZW0sIGV2ZW50VHlwZSkge1xuICBsZXQgZXZlbnQ7XG4gIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCkge1xuICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgICBldmVudC5pbml0RXZlbnQoZXZlbnRUeXBlLCB0cnVlLCB0cnVlKTtcbiAgICBlbGVtLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICBlbGVtLmZpcmVFdmVudCgnb24nICsgZXZlbnRUeXBlLCBldmVudCk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2Rpc3BhdGNoRXZlbnQuanMiLCIvKipcbiogRmFjZXRXUCBFdmVudCBIYW5kbGluZ1xuKiBSZXF1aXJlcyBmcm9udC5qcywgd2hpY2ggaXMgYWRkZWQgYnkgdGhlIEZhY2V0V1AgcGx1Z2luXG4qIEFsc28gcmVxdWlyZXMgalF1ZXJ5IGFzIEZhY2V0V1AgaXRzZWxmIHJlcXVpcmVzIGpRdWVyeVxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gICQoZG9jdW1lbnQpLm9uKCdmYWNldHdwLXJlZnJlc2gnLCBmdW5jdGlvbigpIHtcbiAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2ZhY2V0d3AtaXMtbG9hZGVkJykuYWRkQ2xhc3MoJ2ZhY2V0d3AtaXMtbG9hZGluZycpO1xuICAgICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3AoMCk7XG4gIH0pO1xuXG4gICQoZG9jdW1lbnQpLm9uKCdmYWNldHdwLWxvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnZmFjZXR3cC1pcy1sb2FkaW5nJykuYWRkQ2xhc3MoJ2ZhY2V0d3AtaXMtbG9hZGVkJyk7XG4gIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvZmFjZXRzLmpzIiwiLyoqXHJcbiogT3dsIFNldHRpbmdzIG1vZHVsZVxyXG4qIEBtb2R1bGUgbW9kdWxlcy9vd2xTZXR0aW5nc1xyXG4qIEBzZWUgaHR0cHM6Ly9vd2xjYXJvdXNlbDIuZ2l0aHViLmlvL093bENhcm91c2VsMi9pbmRleC5odG1sXHJcbiovXHJcblxyXG4vKipcclxuKiBvd2wgY2Fyb3VzZWwgc2V0dGluZ3MgYW5kIHRvIG1ha2UgdGhlIG93bCBjYXJvdXNlbCB3b3JrLlxyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuICB2YXIgb3dsID0gJCgnLm93bC1jYXJvdXNlbCcpO1xyXG4gIG93bC5vd2xDYXJvdXNlbCh7XHJcbiAgICBhbmltYXRlSW46ICdmYWRlSW4nLFxyXG4gICAgYW5pbWF0ZU91dDogJ2ZhZGVPdXQnLFxyXG4gICAgaXRlbXM6MSxcclxuICAgIGxvb3A6dHJ1ZSxcclxuICAgIG1hcmdpbjowLFxyXG4gICAgZG90czogdHJ1ZSxcclxuICAgIGF1dG9wbGF5OnRydWUsXHJcbiAgICBhdXRvcGxheVRpbWVvdXQ6NTAwMCxcclxuICAgIGF1dG9wbGF5SG92ZXJQYXVzZTp0cnVlXHJcbiAgfSk7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9vd2xTZXR0aW5ncy5qcyIsIi8qKlxuKiBpT1M3IGlQYWQgSGFja1xuKiBmb3IgaGVybyBpbWFnZSBmbGlja2VyaW5nIGlzc3VlLlxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkOy4qQ1BVLipPUyA3X1xcZC9pKSkge1xuICAgICQoJy5jLXNpZGUtaGVybycpLmhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvaU9TN0hhY2suanMiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBDb29raWVzIGZyb20gJ2pzLWNvb2tpZSc7XG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuLi92ZW5kb3IvdXRpbGl0eS5qcyc7XG5pbXBvcnQgQ2xlYXZlIGZyb20gJ2NsZWF2ZS5qcy9kaXN0L2NsZWF2ZS5taW4nO1xuaW1wb3J0ICdjbGVhdmUuanMvZGlzdC9hZGRvbnMvY2xlYXZlLXBob25lLnVzJztcblxuLyogZXNsaW50IG5vLXVuZGVmOiBcIm9mZlwiICovXG5jb25zdCBWYXJpYWJsZXMgPSByZXF1aXJlKCcuLi8uLi92YXJpYWJsZXMuanNvbicpO1xuXG4vKipcbiAqIFRoaXMgY29tcG9uZW50IGhhbmRsZXMgdmFsaWRhdGlvbiBhbmQgc3VibWlzc2lvbiBmb3Igc2hhcmUgYnkgZW1haWwgYW5kXG4gKiBzaGFyZSBieSBTTVMgZm9ybXMuXG4vKipcbiogQWRkcyBmdW5jdGlvbmFsaXR5IHRvIHRoZSBpbnB1dCBpbiB0aGUgc2VhcmNoIHJlc3VsdHMgaGVhZGVyXG4qL1xuXG5jbGFzcyBTaGFyZUZvcm0ge1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgaHRtbCBmb3JtIGVsZW1lbnQgZm9yIHRoZSBjb21wb25lbnQuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICAvKiogQHByaXZhdGUge0hUTUxFbGVtZW50fSBUaGUgY29tcG9uZW50IGVsZW1lbnQuICovXG4gICAgdGhpcy5fZWwgPSBlbDtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGlzIGZvcm0gaXMgdmFsaWQuICovXG4gICAgdGhpcy5faXNWYWxpZCA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoZSBmb3JtIGlzIGN1cnJlbnRseSBzdWJtaXR0aW5nLiAqL1xuICAgIHRoaXMuX2lzQnVzeSA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoZSBmb3JtIGlzIGRpc2FibGVkLiAqL1xuICAgIHRoaXMuX2lzRGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGlzIGNvbXBvbmVudCBoYXMgYmVlbiBpbml0aWFsaXplZC4gKi9cbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoZSBnb29nbGUgcmVDQVBUQ0hBIHdpZGdldCBpcyByZXF1aXJlZC4gKi9cbiAgICB0aGlzLl9yZWNhcHRjaGFSZXF1aXJlZCA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoZSBnb29nbGUgcmVDQVBUQ0hBIHdpZGdldCBoYXMgcGFzc2VkLiAqL1xuICAgIHRoaXMuX3JlY2FwdGNoYVZlcmlmaWVkID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGdvb2dsZSByZUNBUFRDSEEgd2lkZ2V0IGlzIGluaXRpbGFpc2VkLiAqL1xuICAgIHRoaXMuX3JlY2FwdGNoYWluaXQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGlzIGNvbXBvbmVudCBoYXMgbm90IHlldCBiZWVuIGluaXRpYWxpemVkLCBhdHRhY2hlcyBldmVudCBsaXN0ZW5lcnMuXG4gICAqIEBtZXRob2RcbiAgICogQHJldHVybiB7dGhpc30gU2hhcmVGb3JtXG4gICAqL1xuICBpbml0KCkge1xuICAgIGlmICh0aGlzLl9pbml0aWFsaXplZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbGV0IHNlbGVjdGVkID0gdGhpcy5fZWwucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInRlbFwiXScpO1xuXG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9tYXNrUGhvbmUoc2VsZWN0ZWQpO1xuICAgIH1cblxuICAgICQoYC4ke1NoYXJlRm9ybS5Dc3NDbGFzcy5TSE9XX0RJU0NMQUlNRVJ9YClcbiAgICAgIC5vbignZm9jdXMnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2Rpc2NsYWltZXIodHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICQodGhpcy5fZWwpLm9uKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmICh0aGlzLl9yZWNhcHRjaGFSZXF1aXJlZCkge1xuICAgICAgICBpZiAodGhpcy5fcmVjYXB0Y2hhVmVyaWZpZWQpIHtcbiAgICAgICAgICB0aGlzLl92YWxpZGF0ZSgpO1xuICAgICAgICAgIGlmICh0aGlzLl9pc1ZhbGlkICYmICF0aGlzLl9pc0J1c3kgJiYgIXRoaXMuX2lzRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1Ym1pdCgpO1xuICAgICAgICAgICAgd2luZG93LmdyZWNhcHRjaGEucmVzZXQoKTtcbiAgICAgICAgICAgICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJykuYWRkQ2xhc3MoJ3JlY2FwdGNoYS1qcycpO1xuICAgICAgICAgICAgdGhpcy5fcmVjYXB0Y2hhVmVyaWZpZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJCh0aGlzLl9lbCkuZmluZChgLiR7U2hhcmVGb3JtLkNzc0NsYXNzLkVSUk9SX01TR31gKS5yZW1vdmUoKTtcbiAgICAgICAgICB0aGlzLl9zaG93RXJyb3IoU2hhcmVGb3JtLk1lc3NhZ2UuUkVDQVBUQ0hBKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGUoKTtcbiAgICAgICAgaWYgKHRoaXMuX2lzVmFsaWQgJiYgIXRoaXMuX2lzQnVzeSAmJiAhdGhpcy5faXNEaXNhYmxlZCkge1xuICAgICAgICAgIHRoaXMuX3N1Ym1pdCgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIC8vIERldGVybWluZSB3aGV0aGVyIG9yIG5vdCB0byBpbml0aWFsaXplIFJlQ0FQVENIQS4gVGhpcyBzaG91bGQgYmVcbiAgICAgIC8vIC8vIGluaXRpYWxpemVkIG9ubHkgb24gZXZlcnkgMTB0aCB2aWV3IHdoaWNoIGlzIGRldGVybWluZWQgdmlhIGFuXG4gICAgICAvLyAvLyBpbmNyZW1lbnRpbmcgY29va2llLlxuICAgICAgbGV0IHZpZXdDb3VudCA9IENvb2tpZXMuZ2V0KCdzY3JlZW5lclZpZXdzJykgP1xuICAgICAgICBwYXJzZUludChDb29raWVzLmdldCgnc2NyZWVuZXJWaWV3cycpLCAxMCkgOiAxO1xuICAgICAgaWYgKHZpZXdDb3VudCA+PSA1ICYmICF0aGlzLl9yZWNhcHRjaGFpbml0KSB7XG4gICAgICAgICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJykuYWRkQ2xhc3MoJ3JlY2FwdGNoYS1qcycpO1xuICAgICAgICB0aGlzLl9pbml0UmVjYXB0Y2hhKCk7XG4gICAgICAgIHRoaXMuX3JlY2FwdGNoYWluaXQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgQ29va2llcy5zZXQoJ3NjcmVlbmVyVmlld3MnLCArK3ZpZXdDb3VudCwge2V4cGlyZXM6ICgyLzE0NDApfSk7XG5cbiAgICAgICQoXCIjcGhvbmVcIikuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcykucmVtb3ZlQXR0cigncGxhY2Vob2xkZXInKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gLy8gRGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRvIGluaXRpYWxpemUgUmVDQVBUQ0hBLiBUaGlzIHNob3VsZCBiZVxuICAgIC8vIC8vIGluaXRpYWxpemVkIG9ubHkgb24gZXZlcnkgMTB0aCB2aWV3IHdoaWNoIGlzIGRldGVybWluZWQgdmlhIGFuXG4gICAgLy8gLy8gaW5jcmVtZW50aW5nIGNvb2tpZS5cbiAgICBsZXQgdmlld0NvdW50ID0gQ29va2llcy5nZXQoJ3NjcmVlbmVyVmlld3MnKSA/XG4gICAgICBwYXJzZUludChDb29raWVzLmdldCgnc2NyZWVuZXJWaWV3cycpLCAxMCkgOiAxO1xuICAgIGlmICh2aWV3Q291bnQgPj0gNSAmJiAhdGhpcy5fcmVjYXB0Y2hhaW5pdCApIHtcbiAgICAgICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJykuYWRkQ2xhc3MoJ3JlY2FwdGNoYS1qcycpO1xuICAgICAgdGhpcy5faW5pdFJlY2FwdGNoYSgpO1xuICAgICAgdGhpcy5fcmVjYXB0Y2hhaW5pdCA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXNrIGVhY2ggcGhvbmUgbnVtYmVyIGFuZCBwcm9wZXJseSBmb3JtYXQgaXRcbiAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGlucHV0IHRoZSBcInRlbFwiIGlucHV0IHRvIG1hc2tcbiAgICogQHJldHVybiB7Y29uc3RydWN0b3J9ICAgICAgIHRoZSBpbnB1dCBtYXNrXG4gICAqL1xuICBfbWFza1Bob25lKGlucHV0KSB7XG4gICAgbGV0IGNsZWF2ZSA9IG5ldyBDbGVhdmUoaW5wdXQsIHtcbiAgICAgIHBob25lOiB0cnVlLFxuICAgICAgcGhvbmVSZWdpb25Db2RlOiAndXMnLFxuICAgICAgZGVsaW1pdGVyOiAnLSdcbiAgICB9KTtcbiAgICBpbnB1dC5jbGVhdmUgPSBjbGVhdmU7XG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGRpc2NsYWltZXIgdmlzaWJpbGl0eVxuICAgKiBAcGFyYW0gIHtCb29sZWFufSB2aXNpYmxlIC0gd2V0aGVyIHRoZSBkaXNjbGFpbWVyIHNob3VsZCBiZSB2aXNpYmxlIG9yIG5vdFxuICAgKi9cbiAgX2Rpc2NsYWltZXIodmlzaWJsZSA9IHRydWUpIHtcbiAgICBsZXQgJGVsID0gJCgnI2pzLWRpc2NsYWltZXInKTtcbiAgICBsZXQgJGNsYXNzID0gKHZpc2libGUpID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyc7XG4gICAgJGVsLmF0dHIoJ2FyaWEtaGlkZGVuJywgIXZpc2libGUpO1xuICAgICRlbC5hdHRyKFNoYXJlRm9ybS5Dc3NDbGFzcy5ISURERU4sICF2aXNpYmxlKTtcbiAgICAkZWxbJGNsYXNzXShTaGFyZUZvcm0uQ3NzQ2xhc3MuQU5JTUFURV9ESVNDTEFJTUVSKTtcbiAgICAvLyBTY3JvbGwtdG8gZnVuY3Rpb25hbGl0eSBmb3IgbW9iaWxlXG4gICAgaWYgKFxuICAgICAgd2luZG93LnNjcm9sbFRvICYmXG4gICAgICB2aXNpYmxlICYmXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCA8IFZhcmlhYmxlc1snc2NyZWVuLWRlc2t0b3AnXVxuICAgICkge1xuICAgICAgbGV0ICR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcbiAgICAgIHdpbmRvdy5zY3JvbGxUbyhcbiAgICAgICAgMCwgJHRhcmdldC5vZmZzZXQoKS50b3AgLSAkdGFyZ2V0LmRhdGEoJ3Njcm9sbE9mZnNldCcpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIHZhbGlkYXRpb24gcnVsZXMgYW5kIHNldHMgdmFsaWRpdHkgb2YgY29tcG9uZW50LlxuICAgKiBAbWV0aG9kXG4gICAqIEByZXR1cm4ge3RoaXN9IFNoYXJlRm9ybVxuICAgKi9cbiAgX3ZhbGlkYXRlKCkge1xuICAgIGxldCB2YWxpZGl0eSA9IHRydWU7XG4gICAgY29uc3QgJHRlbCA9ICQodGhpcy5fZWwpLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZWxcIl0nKTtcbiAgICAvLyBDbGVhciBhbnkgZXhpc3RpbmcgZXJyb3IgbWVzc2FnZXMuXG4gICAgJCh0aGlzLl9lbCkuZmluZChgLiR7U2hhcmVGb3JtLkNzc0NsYXNzLkVSUk9SX01TR31gKS5yZW1vdmUoKTtcblxuICAgIGlmICgkdGVsLmxlbmd0aCkge1xuICAgICAgdmFsaWRpdHkgPSB0aGlzLl92YWxpZGF0ZVBob25lTnVtYmVyKCR0ZWxbMF0pO1xuICAgIH1cblxuICAgIHRoaXMuX2lzVmFsaWQgPSB2YWxpZGl0eTtcbiAgICBpZiAodGhpcy5faXNWYWxpZCkge1xuICAgICAgJCh0aGlzLl9lbCkucmVtb3ZlQ2xhc3MoU2hhcmVGb3JtLkNzc0NsYXNzLkVSUk9SKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogRm9yIGEgZ2l2ZW4gaW5wdXQsIGNoZWNrcyB0byBzZWUgaWYgaXRzIHZhbHVlIGlzIGEgdmFsaWQgUGhvbmVudW1iZXIuIElmIG5vdCxcbiAgICogZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBhbmQgc2V0cyBhbiBlcnJvciBjbGFzcyBvbiB0aGUgZWxlbWVudC5cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaW5wdXQgLSBUaGUgaHRtbCBmb3JtIGVsZW1lbnQgZm9yIHRoZSBjb21wb25lbnQuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gVmFsaWQgZW1haWwuXG4gICAqL1xuICBfdmFsaWRhdGVQaG9uZU51bWJlcihpbnB1dCl7XG4gICAgbGV0IG51bSA9IHRoaXMuX3BhcnNlUGhvbmVOdW1iZXIoaW5wdXQudmFsdWUpOyAvLyBwYXJzZSB0aGUgbnVtYmVyXG4gICAgbnVtID0gKG51bSkgPyBudW0uam9pbignJykgOiAwOyAvLyBpZiBudW0gaXMgbnVsbCwgdGhlcmUgYXJlIG5vIG51bWJlcnNcbiAgICBpZiAobnVtLmxlbmd0aCA9PT0gMTApIHtcbiAgICAgIHJldHVybiB0cnVlOyAvLyBhc3N1bWUgaXQgaXMgcGhvbmUgbnVtYmVyXG4gICAgfVxuICAgIHRoaXMuX3Nob3dFcnJvcihTaGFyZUZvcm0uTWVzc2FnZS5QSE9ORSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIHZhciBwaG9uZW5vID0gL15cXCs/KFswLTldezJ9KVxcKT9bLS4gXT8oWzAtOV17NH0pWy0uIF0/KFswLTldezR9KSQvO1xuICAgIC8vIHZhciBwaG9uZW5vID0gKC9eXFwrP1sxLTldXFxkezEsMTR9JC8pO1xuICAgIC8vIGlmKCFpbnB1dC52YWx1ZS5tYXRjaChwaG9uZW5vKSl7XG4gICAgLy8gICB0aGlzLl9zaG93RXJyb3IoU2hhcmVGb3JtLk1lc3NhZ2UuUEhPTkUpO1xuICAgIC8vICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIH1cbiAgICAvLyByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQganVzdCB0aGUgcGhvbmUgbnVtYmVyIG9mIGEgZ2l2ZW4gdmFsdWVcbiAgICogQHBhcmFtICB7c3RyaW5nfSB2YWx1ZSBUaGUgc3RyaW5nIHRvIGdldCBudW1iZXJzIGZyb21cbiAgICogQHJldHVybiB7YXJyYXl9ICAgICAgIEFuIGFycmF5IHdpdGggbWF0Y2hlZCBibG9ja3NcbiAgICovXG4gIF9wYXJzZVBob25lTnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9cXGQrL2cpOyAvLyBnZXQgb25seSBkaWdpdHNcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgYSBnaXZlbiBpbnB1dCwgY2hlY2tzIHRvIHNlZSBpZiBpdCBoYXMgYSB2YWx1ZS4gSWYgbm90LCBkaXNwbGF5cyBhblxuICAgKiBlcnJvciBtZXNzYWdlIGFuZCBzZXRzIGFuIGVycm9yIGNsYXNzIG9uIHRoZSBlbGVtZW50LlxuICAgKiBAbWV0aG9kXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGlucHV0IC0gVGhlIGh0bWwgZm9ybSBlbGVtZW50IGZvciB0aGUgY29tcG9uZW50LlxuICAgKiBAcmV0dXJuIHtib29sZWFufSAtIFZhbGlkIHJlcXVpcmVkIGZpZWxkLlxuICAgKi9cbiAgX3ZhbGlkYXRlUmVxdWlyZWQoaW5wdXQpIHtcbiAgICBpZiAoJChpbnB1dCkudmFsKCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB0aGlzLl9zaG93RXJyb3IoU2hhcmVGb3JtLk1lc3NhZ2UuUkVRVUlSRUQpO1xuICAgICQoaW5wdXQpLm9uZSgna2V5dXAnLCBmdW5jdGlvbigpe1xuICAgICAgdGhpcy5fdmFsaWRhdGUoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBieSBhcHBlbmRpbmcgYSBkaXYgdG8gdGhlIGZvcm0uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgLSBFcnJvciBtZXNzYWdlIHRvIGRpc3BsYXkuXG4gICAqIEByZXR1cm4ge3RoaXN9IFNoYXJlRm9ybSAtIHNoYXJlZm9ybVxuICAgKi9cbiAgX3Nob3dFcnJvcihtc2cpIHtcbiAgICBsZXQgJGVsUGFyZW50cyA9ICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJyk7XG4gICAgJCgnI3Ntcy1mb3JtLW1zZycpLmFkZENsYXNzKFNoYXJlRm9ybS5Dc3NDbGFzcy5FUlJPUikudGV4dChVdGlsaXR5LmxvY2FsaXplKG1zZykpO1xuICAgICRlbFBhcmVudHMucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MtanMnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgXCJzdWNjZXNzXCIgY2xhc3MuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgLSBFcnJvciBtZXNzYWdlIHRvIGRpc3BsYXkuXG4gICAqIEByZXR1cm4ge3RoaXN9IFNoYXJlRm9ybVxuICAgKi9cbiAgX3Nob3dTdWNjZXNzKG1zZykge1xuICAgIGxldCAkZWxQYXJlbnRzID0gJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKTtcbiAgICAkKCcjcGhvbmUnKS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgVXRpbGl0eS5sb2NhbGl6ZShtc2cpKTtcbiAgICAkKCcjc21zYnV0dG9uJykudGV4dChcIlNlbmQgQW5vdGhlclwiKTtcbiAgICAkKCcjc21zLWZvcm0tbXNnJykuYWRkQ2xhc3MoU2hhcmVGb3JtLkNzc0NsYXNzLlNVQ0NFU1MpLnRleHQoJycpO1xuICAgICRlbFBhcmVudHMucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MtanMnKTtcbiAgICAkZWxQYXJlbnRzLmFkZENsYXNzKCdzdWNjZXNzLWpzJyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU3VibWl0cyB0aGUgZm9ybS5cbiAgICogQHJldHVybiB7anFYSFJ9IGRlZmVycmVkIHJlc3BvbnNlIG9iamVjdFxuICAgKi9cbiAgX3N1Ym1pdCgpIHtcbiAgICB0aGlzLl9pc0J1c3kgPSB0cnVlO1xuICAgIGxldCAkc3Bpbm5lciA9IHRoaXMuX2VsLnF1ZXJ5U2VsZWN0b3IoYC4ke1NoYXJlRm9ybS5Dc3NDbGFzcy5TUElOTkVSfWApO1xuICAgIGxldCAkc3VibWl0ID0gdGhpcy5fZWwucXVlcnlTZWxlY3RvcignYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0nKTtcbiAgICBjb25zdCBwYXlsb2FkID0gJCh0aGlzLl9lbCkuc2VyaWFsaXplKCk7XG4gICAgJCh0aGlzLl9lbCkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIGlmICgkc3Bpbm5lcikge1xuICAgICAgJHN1Ym1pdC5kaXNhYmxlZCA9IHRydWU7IC8vIGhpZGUgc3VibWl0IGJ1dHRvblxuICAgICAgJHNwaW5uZXIuc3R5bGUuY3NzVGV4dCA9ICcnOyAvLyBzaG93IHNwaW5uZXJcbiAgICB9XG4gICAgcmV0dXJuICQucG9zdCgkKHRoaXMuX2VsKS5hdHRyKCdhY3Rpb24nKSwgcGF5bG9hZCkuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICB0aGlzLl9lbC5yZXNldCgpO1xuICAgICAgICB0aGlzLl9zaG93U3VjY2VzcyhTaGFyZUZvcm0uTWVzc2FnZS5TVUNDRVNTKTtcbiAgICAgICAgdGhpcy5faXNEaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICQodGhpcy5fZWwpLm9uZSgna2V5dXAnLCAnaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgICAgJCh0aGlzLl9lbCkucmVtb3ZlQ2xhc3MoU2hhcmVGb3JtLkNzc0NsYXNzLlNVQ0NFU1MpO1xuICAgICAgICAgIHRoaXMuX2lzRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zaG93RXJyb3IoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UubWVzc2FnZSkpO1xuICAgICAgfVxuICAgIH0pLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9zaG93RXJyb3IoU2hhcmVGb3JtLk1lc3NhZ2UuU0VSVkVSKTtcbiAgICB9KS5hbHdheXMoKCkgPT4ge1xuICAgICAgJCh0aGlzLl9lbCkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgIGlmICgkc3Bpbm5lcikge1xuICAgICAgICAkc3VibWl0LmRpc2FibGVkID0gZmFsc2U7IC8vIHNob3cgc3VibWl0IGJ1dHRvblxuICAgICAgICAkc3Bpbm5lci5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnOyAvLyBoaWRlIHNwaW5uZXI7XG4gICAgICB9XG4gICAgICB0aGlzLl9pc0J1c3kgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3luY2hyb25vdXNseSBsb2FkcyB0aGUgR29vZ2xlIHJlY2FwdGNoYSBzY3JpcHQgYW5kIHNldHMgY2FsbGJhY2tzIGZvclxuICAgKiBsb2FkLCBzdWNjZXNzLCBhbmQgZXhwaXJhdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybiB7dGhpc30gU2NyZWVuZXJcbiAgICovXG4gIF9pbml0UmVjYXB0Y2hhKCkge1xuICAgIGNvbnN0ICRzY3JpcHQgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpKTtcbiAgICAkc2NyaXB0LmF0dHIoJ3NyYycsXG4gICAgICAgICdodHRwczovL3d3dy5nb29nbGUuY29tL3JlY2FwdGNoYS9hcGkuanMnICtcbiAgICAgICAgJz9vbmxvYWQ9c2NyZWVuZXJDYWxsYmFjayZyZW5kZXI9ZXhwbGljaXQnKS5wcm9wKHtcbiAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgZGVmZXI6IHRydWVcbiAgICB9KTtcblxuICAgIHdpbmRvdy5zY3JlZW5lckNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgd2luZG93LmdyZWNhcHRjaGEucmVuZGVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JlZW5lci1yZWNhcHRjaGEnKSwge1xuICAgICAgICAnc2l0ZWtleScgOiAnNkxla0lDWVVBQUFBQU9SMnVaMGFqeVd0OVh4RHVzcEhQVUFrUnpBQicsXG4gICAgICAgIC8vQmVsb3cgaXMgdGhlIGxvY2FsIGhvc3Qga2V5XG4gICAgICAgIC8vICdzaXRla2V5JyA6ICc2TGNBQUNZVUFBQUFBUG10dlF2QndLODlpbU0zUWZvdEpGSGZTbThDJyxcbiAgICAgICAgJ2NhbGxiYWNrJzogJ3NjcmVlbmVyUmVjYXB0Y2hhJyxcbiAgICAgICAgJ2V4cGlyZWQtY2FsbGJhY2snOiAnc2NyZWVuZXJSZWNhcHRjaGFSZXNldCdcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVjYXB0Y2hhUmVxdWlyZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICB3aW5kb3cuc2NyZWVuZXJSZWNhcHRjaGEgPSAoKSA9PiB7XG4gICAgICB0aGlzLl9yZWNhcHRjaGFWZXJpZmllZCA9IHRydWU7XG4gICAgICAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpLnJlbW92ZUNsYXNzKCdyZWNhcHRjaGEtanMnKTtcbiAgICB9O1xuXG4gICAgd2luZG93LnNjcmVlbmVyUmVjYXB0Y2hhUmVzZXQgPSAoKSA9PiB7XG4gICAgICB0aGlzLl9yZWNhcHRjaGFWZXJpZmllZCA9IGZhbHNlO1xuICAgICAgJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKS5hZGRDbGFzcygncmVjYXB0Y2hhLWpzJyk7XG4gICAgfTtcblxuICAgIHRoaXMuX3JlY2FwdGNoYVJlcXVpcmVkID0gdHJ1ZTtcbiAgICAkKCdoZWFkJykuYXBwZW5kKCRzY3JpcHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbi8qKlxuICogQ1NTIGNsYXNzZXMgdXNlZCBieSB0aGlzIGNvbXBvbmVudC5cbiAqIEBlbnVtIHtzdHJpbmd9XG4gKi9cblNoYXJlRm9ybS5Dc3NDbGFzcyA9IHtcbiAgRVJST1I6ICdlcnJvcicsXG4gIEVSUk9SX01TRzogJ2Vycm9yLW1lc3NhZ2UnLFxuICBGT1JNOiAnanMtc2hhcmUtZm9ybScsXG4gIFNIT1dfRElTQ0xBSU1FUjogJ2pzLXNob3ctZGlzY2xhaW1lcicsXG4gIE5FRURTX0RJU0NMQUlNRVI6ICdqcy1uZWVkcy1kaXNjbGFpbWVyJyxcbiAgQU5JTUFURV9ESVNDTEFJTUVSOiAnYW5pbWF0ZWQgZmFkZUluVXAnLFxuICBISURERU46ICdoaWRkZW4nLFxuICBTVUJNSVRfQlROOiAnYnRuLXN1Ym1pdCcsXG4gIFNVQ0NFU1M6ICdzdWNjZXNzJyxcbiAgU1BJTk5FUjogJ2pzLXNwaW5uZXInXG59O1xuXG4vKipcbiAqIExvY2FsaXphdGlvbiBsYWJlbHMgb2YgZm9ybSBtZXNzYWdlcy5cbiAqIEBlbnVtIHtzdHJpbmd9XG4gKi9cblNoYXJlRm9ybS5NZXNzYWdlID0ge1xuICBFTUFJTDogJ0VSUk9SX0VNQUlMJyxcbiAgUEhPTkU6ICdJbnZhbGlkIE1vYmlsZSBOdW1iZXInLFxuICBSRVFVSVJFRDogJ0VSUk9SX1JFUVVJUkVEJyxcbiAgU0VSVkVSOiAnRVJST1JfU0VSVkVSJyxcbiAgU1VDQ0VTUzogJ01lc3NhZ2Ugc2VudCEnLFxuICBSRUNBUFRDSEEgOiAnUGxlYXNlIGZpbGwgdGhlIHJlQ0FQVENIQSdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlRm9ybTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3NoYXJlLWZvcm0uanMiLCIvKiFcbiAqIEphdmFTY3JpcHQgQ29va2llIHYyLjIuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL2pzLWNvb2tpZS9qcy1jb29raWVcbiAqXG4gKiBDb3B5cmlnaHQgMjAwNiwgMjAxNSBLbGF1cyBIYXJ0bCAmIEZhZ25lciBCcmFja1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cbjsoZnVuY3Rpb24gKGZhY3RvcnkpIHtcblx0dmFyIHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IGZhbHNlO1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKCFyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIpIHtcblx0XHR2YXIgT2xkQ29va2llcyA9IHdpbmRvdy5Db29raWVzO1xuXHRcdHZhciBhcGkgPSB3aW5kb3cuQ29va2llcyA9IGZhY3RvcnkoKTtcblx0XHRhcGkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHdpbmRvdy5Db29raWVzID0gT2xkQ29va2llcztcblx0XHRcdHJldHVybiBhcGk7XG5cdFx0fTtcblx0fVxufShmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIGV4dGVuZCAoKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHNbIGkgXTtcblx0XHRcdGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdHJlc3VsdFtrZXldID0gYXR0cmlidXRlc1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCAoY29udmVydGVyKSB7XG5cdFx0ZnVuY3Rpb24gYXBpIChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHR2YXIgcmVzdWx0O1xuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXcml0ZVxuXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0YXR0cmlidXRlcyA9IGV4dGVuZCh7XG5cdFx0XHRcdFx0cGF0aDogJy8nXG5cdFx0XHRcdH0sIGFwaS5kZWZhdWx0cywgYXR0cmlidXRlcyk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBhdHRyaWJ1dGVzLmV4cGlyZXMgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0dmFyIGV4cGlyZXMgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRcdGV4cGlyZXMuc2V0TWlsbGlzZWNvbmRzKGV4cGlyZXMuZ2V0TWlsbGlzZWNvbmRzKCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlKzUpO1xuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGV4cGlyZXM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBXZSdyZSB1c2luZyBcImV4cGlyZXNcIiBiZWNhdXNlIFwibWF4LWFnZVwiIGlzIG5vdCBzdXBwb3J0ZWQgYnkgSUVcblx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzID8gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcblx0XHRcdFx0XHRpZiAoL15bXFx7XFxbXS8udGVzdChyZXN1bHQpKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHJlc3VsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cblx0XHRcdFx0aWYgKCFjb252ZXJ0ZXIud3JpdGUpIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcodmFsdWUpKVxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8M0F8M0N8M0V8M0R8MkZ8M0Z8NDB8NUJ8NUR8NUV8NjB8N0J8N0R8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGtleSkpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1tcXChcXCldL2csIGVzY2FwZSk7XG5cblx0XHRcdFx0dmFyIHN0cmluZ2lmaWVkQXR0cmlidXRlcyA9ICcnO1xuXG5cdFx0XHRcdGZvciAodmFyIGF0dHJpYnV0ZU5hbWUgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRcdGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcblx0XHRcdFx0XHRpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0ga2V5ICsgJz0nICsgdmFsdWUgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZWFkXG5cblx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdHJlc3VsdCA9IHt9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XG5cdFx0XHQvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC4gQWxzbyBwcmV2ZW50cyBvZGQgcmVzdWx0IHdoZW5cblx0XHRcdC8vIGNhbGxpbmcgXCJnZXQoKVwiXG5cdFx0XHR2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuXHRcdFx0dmFyIHJkZWNvZGUgPSAvKCVbMC05QS1aXXsyfSkrL2c7XG5cdFx0XHR2YXIgaSA9IDA7XG5cblx0XHRcdGZvciAoOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XG5cdFx0XHRcdHZhciBjb29raWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XG5cblx0XHRcdFx0aWYgKCF0aGlzLmpzb24gJiYgY29va2llLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvb2tpZS5zbGljZSgxLCAtMSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciBuYW1lID0gcGFydHNbMF0ucmVwbGFjZShyZGVjb2RlLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvbnZlcnRlci5yZWFkID9cblx0XHRcdFx0XHRcdGNvbnZlcnRlci5yZWFkKGNvb2tpZSwgbmFtZSkgOiBjb252ZXJ0ZXIoY29va2llLCBuYW1lKSB8fFxuXHRcdFx0XHRcdFx0Y29va2llLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLmpzb24pIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGNvb2tpZSA9IEpTT04ucGFyc2UoY29va2llKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gbmFtZSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0ID0gY29va2llO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0XHRcdHJlc3VsdFtuYW1lXSA9IGNvb2tpZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0YXBpLnNldCA9IGFwaTtcblx0XHRhcGkuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuIGFwaS5jYWxsKGFwaSwga2V5KTtcblx0XHR9O1xuXHRcdGFwaS5nZXRKU09OID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGFwaS5hcHBseSh7XG5cdFx0XHRcdGpzb246IHRydWVcblx0XHRcdH0sIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG5cdFx0fTtcblx0XHRhcGkuZGVmYXVsdHMgPSB7fTtcblxuXHRcdGFwaS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRhcGkoa2V5LCAnJywgZXh0ZW5kKGF0dHJpYnV0ZXMsIHtcblx0XHRcdFx0ZXhwaXJlczogLTFcblx0XHRcdH0pKTtcblx0XHR9O1xuXG5cdFx0YXBpLndpdGhDb252ZXJ0ZXIgPSBpbml0O1xuXG5cdFx0cmV0dXJuIGFwaTtcblx0fVxuXG5cdHJldHVybiBpbml0KGZ1bmN0aW9uICgpIHt9KTtcbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2pzLWNvb2tpZS9zcmMvanMuY29va2llLmpzXG4vLyBtb2R1bGUgaWQgPSA2N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiB1dGlsaXR5IGZ1bmN0aW9ucy5cbiAqL1xuY29uc3QgVXRpbGl0eSA9IHt9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGEgZ2l2ZW4ga2V5IGluIGEgVVJMIHF1ZXJ5IHN0cmluZy4gSWYgbm8gVVJMIHF1ZXJ5XG4gKiBzdHJpbmcgaXMgcHJvdmlkZWQsIHRoZSBjdXJyZW50IFVSTCBsb2NhdGlvbiBpcyB1c2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBLZXkgbmFtZS5cbiAqIEBwYXJhbSB7P3N0cmluZ30gcXVlcnlTdHJpbmcgLSBPcHRpb25hbCBxdWVyeSBzdHJpbmcgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHs/c3RyaW5nfSBRdWVyeSBwYXJhbWV0ZXIgdmFsdWUuXG4gKi9cblV0aWxpdHkuZ2V0VXJsUGFyYW1ldGVyID0gKG5hbWUsIHF1ZXJ5U3RyaW5nKSA9PiB7XG4gIGNvbnN0IHF1ZXJ5ID0gcXVlcnlTdHJpbmcgfHwgd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcbiAgY29uc3QgcGFyYW0gPSBuYW1lLnJlcGxhY2UoL1tcXFtdLywgJ1xcXFxbJykucmVwbGFjZSgvW1xcXV0vLCAnXFxcXF0nKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKCdbXFxcXD8mXScgKyBwYXJhbSArICc9KFteJiNdKiknKTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlZ2V4LmV4ZWMocXVlcnkpO1xuICByZXR1cm4gcmVzdWx0cyA9PT0gbnVsbCA/ICcnIDpcbiAgICAgIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzFdLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbn07XG5cbi8qKlxuICogVGFrZXMgYW4gb2JqZWN0IGFuZCBkZWVwbHkgdHJhdmVyc2VzIGl0LCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgdmFsdWVzIGZvclxuICogbWF0Y2hlZCBwcm9wZXJ0aWVzIGlkZW50aWZpZWQgYnkgdGhlIGtleSBzdHJpbmcuXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IHRvIHRyYXZlcnNlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldFByb3AgbmFtZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybiB7YXJyYXl9IHByb3BlcnR5IHZhbHVlcy5cbiAqL1xuVXRpbGl0eS5maW5kVmFsdWVzID0gKG9iamVjdCwgdGFyZ2V0UHJvcCkgPT4ge1xuICBjb25zdCByZXN1bHRzID0gW107XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZSBmdW5jdGlvbiBmb3IgaXRlcmF0aW5nIG92ZXIgb2JqZWN0IGtleXMuXG4gICAqL1xuICAoZnVuY3Rpb24gdHJhdmVyc2VPYmplY3Qob2JqKSB7XG4gICAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGlmIChrZXkgPT09IHRhcmdldFByb3ApIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gob2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Yob2JqW2tleV0pID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHRyYXZlcnNlT2JqZWN0KG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSkob2JqZWN0KTtcblxuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbi8qKlxuICogVGFrZXMgYSBzdHJpbmcgb3IgbnVtYmVyIHZhbHVlIGFuZCBjb252ZXJ0cyBpdCB0byBhIGRvbGxhciBhbW91bnRcbiAqIGFzIGEgc3RyaW5nIHdpdGggdHdvIGRlY2ltYWwgcG9pbnRzIG9mIHBlcmNpc2lvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gdmFsIC0gdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm4ge3N0cmluZ30gc3RyaW5naWZpZWQgbnVtYmVyIHRvIHR3byBkZWNpbWFsIHBsYWNlcy5cbiAqL1xuVXRpbGl0eS50b0RvbGxhckFtb3VudCA9ICh2YWwpID0+XG4gICAgKE1hdGguYWJzKE1hdGgucm91bmQocGFyc2VGbG9hdCh2YWwpICogMTAwKSAvIDEwMCkpLnRvRml4ZWQoMik7XG5cbi8qKlxuICogRm9yIHRyYW5zbGF0aW5nIHN0cmluZ3MsIHRoZXJlIGlzIGEgZ2xvYmFsIExPQ0FMSVpFRF9TVFJJTkdTIGFycmF5IHRoYXRcbiAqIGlzIGRlZmluZWQgb24gdGhlIEhUTUwgdGVtcGxhdGUgbGV2ZWwgc28gdGhhdCB0aG9zZSBzdHJpbmdzIGFyZSBleHBvc2VkIHRvXG4gKiBXUE1MIHRyYW5zbGF0aW9uLiBUaGUgTE9DQUxJWkVEX1NUUklOR1MgYXJyYXkgaXMgY29tb3NlZCBvZiBvYmplY3RzIHdpdGggYVxuICogYHNsdWdgIGtleSB3aG9zZSB2YWx1ZSBpcyBzb21lIGNvbnN0YW50LCBhbmQgYSBgbGFiZWxgIHZhbHVlIHdoaWNoIGlzIHRoZVxuICogdHJhbnNsYXRlZCBlcXVpdmFsZW50LiBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgc2x1ZyBuYW1lIGFuZCByZXR1cm5zIHRoZVxuICogbGFiZWwuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2x1Z05hbWVcbiAqIEByZXR1cm4ge3N0cmluZ30gbG9jYWxpemVkIHZhbHVlXG4gKi9cblV0aWxpdHkubG9jYWxpemUgPSBmdW5jdGlvbihzbHVnTmFtZSkge1xuICBsZXQgdGV4dCA9IHNsdWdOYW1lIHx8ICcnO1xuICBjb25zdCBsb2NhbGl6ZWRTdHJpbmdzID0gd2luZG93LkxPQ0FMSVpFRF9TVFJJTkdTIHx8IFtdO1xuICBjb25zdCBtYXRjaCA9IF8uZmluZFdoZXJlKGxvY2FsaXplZFN0cmluZ3MsIHtcbiAgICBzbHVnOiBzbHVnTmFtZVxuICB9KTtcbiAgaWYgKG1hdGNoKSB7XG4gICAgdGV4dCA9IG1hdGNoLmxhYmVsO1xuICB9XG4gIHJldHVybiB0ZXh0O1xufTtcblxuLyoqXG4gKiBUYWtlcyBhIGEgc3RyaW5nIGFuZCByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBzdHJpbmcgaXMgYSB2YWxpZCBlbWFpbFxuICogYnkgdXNpbmcgbmF0aXZlIGJyb3dzZXIgdmFsaWRhdGlvbiBpZiBhdmFpbGFibGUuIE90aGVyd2lzZSwgZG9lcyBhIHNpbXBsZVxuICogUmVnZXggdGVzdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBlbWFpbFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuVXRpbGl0eS5pc1ZhbGlkRW1haWwgPSBmdW5jdGlvbihlbWFpbCkge1xuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGlucHV0LnR5cGUgPSAnZW1haWwnO1xuICBpbnB1dC52YWx1ZSA9IGVtYWlsO1xuXG4gIHJldHVybiB0eXBlb2YgaW5wdXQuY2hlY2tWYWxpZGl0eSA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICBpbnB1dC5jaGVja1ZhbGlkaXR5KCkgOiAvXFxTK0BcXFMrXFwuXFxTKy8udGVzdChlbWFpbCk7XG59O1xuXG4vKipcbiAqIFNpdGUgY29uc3RhbnRzLlxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuVXRpbGl0eS5DT05GSUcgPSB7XG4gIERFRkFVTFRfTEFUOiA0MC43MTI4LFxuICBERUZBVUxUX0xORzogLTc0LjAwNTksXG4gIEdPT0dMRV9BUEk6ICdBSXphU3lCU2pjX0pOX3AwLV9WS3lCdmpDRnFWQW1BSVd0N0NsWmMnLFxuICBHT09HTEVfU1RBVElDX0FQSTogJ0FJemFTeUN0MEU3RFhfWVBGY1VubE1QNldIdjJ6cUF3eVpFNHFJdycsXG4gIEdSRUNBUFRDSEFfU0lURV9LRVk6ICc2TGV5bkJVVUFBQUFBTndza1RXMlVJY2VrdFJpYXlTcUxGRnd3azQ4JyxcbiAgU0NSRUVORVJfTUFYX0hPVVNFSE9MRDogOCxcbiAgVVJMX1BJTl9CTFVFOiAnL3dwLWNvbnRlbnQvdGhlbWVzL2FjY2Vzcy9hc3NldHMvaW1nL21hcC1waW4tYmx1ZS5wbmcnLFxuICBVUkxfUElOX0JMVUVfMlg6ICcvd3AtY29udGVudC90aGVtZXMvYWNjZXNzL2Fzc2V0cy9pbWcvbWFwLXBpbi1ibHVlLTJ4LnBuZycsXG4gIFVSTF9QSU5fR1JFRU46ICcvd3AtY29udGVudC90aGVtZXMvYWNjZXNzL2Fzc2V0cy9pbWcvbWFwLXBpbi1ncmVlbi5wbmcnLFxuICBVUkxfUElOX0dSRUVOXzJYOiAnL3dwLWNvbnRlbnQvdGhlbWVzL2FjY2Vzcy9hc3NldHMvaW1nL21hcC1waW4tZ3JlZW4tMngucG5nJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVXRpbGl0eTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy92ZW5kb3IvdXRpbGl0eS5qcyIsIi8vICAgICBVbmRlcnNjb3JlLmpzIDEuOC4zXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBleHBvcnRzYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQsXG4gICAgbmF0aXZlQ3JlYXRlICAgICAgID0gT2JqZWN0LmNyZWF0ZTtcblxuICAvLyBOYWtlZCBmdW5jdGlvbiByZWZlcmVuY2UgZm9yIHN1cnJvZ2F0ZS1wcm90b3R5cGUtc3dhcHBpbmcuXG4gIHZhciBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdC5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gXztcbiAgICB9XG4gICAgZXhwb3J0cy5fID0gXztcbiAgfSBlbHNlIHtcbiAgICByb290Ll8gPSBfO1xuICB9XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uLlxuICBfLlZFUlNJT04gPSAnMS44LjMnO1xuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlZmZpY2llbnQgKGZvciBjdXJyZW50IGVuZ2luZXMpIHZlcnNpb25cbiAgLy8gb2YgdGhlIHBhc3NlZC1pbiBjYWxsYmFjaywgdG8gYmUgcmVwZWF0ZWRseSBhcHBsaWVkIGluIG90aGVyIFVuZGVyc2NvcmVcbiAgLy8gZnVuY3Rpb25zLlxuICB2YXIgb3B0aW1pemVDYiA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgcmV0dXJuIGZ1bmM7XG4gICAgc3dpdGNoIChhcmdDb3VudCA9PSBudWxsID8gMyA6IGFyZ0NvdW50KSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgb3RoZXIpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEEgbW9zdGx5LWludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGNhbGxiYWNrcyB0aGF0IGNhbiBiZSBhcHBsaWVkXG4gIC8vIHRvIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24sIHJldHVybmluZyB0aGUgZGVzaXJlZCByZXN1bHQg4oCUIGVpdGhlclxuICAvLyBpZGVudGl0eSwgYW4gYXJiaXRyYXJ5IGNhbGxiYWNrLCBhIHByb3BlcnR5IG1hdGNoZXIsIG9yIGEgcHJvcGVydHkgYWNjZXNzb3IuXG4gIHZhciBjYiA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXy5pZGVudGl0eTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIG9wdGltaXplQ2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHJldHVybiBfLm1hdGNoZXIodmFsdWUpO1xuICAgIHJldHVybiBfLnByb3BlcnR5KHZhbHVlKTtcbiAgfTtcbiAgXy5pdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNiKHZhbHVlLCBjb250ZXh0LCBJbmZpbml0eSk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFzc2lnbmVyIGZ1bmN0aW9ucy5cbiAgdmFyIGNyZWF0ZUFzc2lnbmVyID0gZnVuY3Rpb24oa2V5c0Z1bmMsIHVuZGVmaW5lZE9ubHkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggPCAyIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XSxcbiAgICAgICAgICAgIGtleXMgPSBrZXlzRnVuYyhzb3VyY2UpLFxuICAgICAgICAgICAgbCA9IGtleXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmICghdW5kZWZpbmVkT25seSB8fCBvYmpba2V5XSA9PT0gdm9pZCAwKSBvYmpba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgbmV3IG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gYW5vdGhlci5cbiAgdmFyIGJhc2VDcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICBpZiAoIV8uaXNPYmplY3QocHJvdG90eXBlKSkgcmV0dXJuIHt9O1xuICAgIGlmIChuYXRpdmVDcmVhdGUpIHJldHVybiBuYXRpdmVDcmVhdGUocHJvdG90eXBlKTtcbiAgICBDdG9yLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEN0b3I7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdmFyIHByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PSBudWxsID8gdm9pZCAwIDogb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBIZWxwZXIgZm9yIGNvbGxlY3Rpb24gbWV0aG9kcyB0byBkZXRlcm1pbmUgd2hldGhlciBhIGNvbGxlY3Rpb25cbiAgLy8gc2hvdWxkIGJlIGl0ZXJhdGVkIGFzIGFuIGFycmF5IG9yIGFzIGFuIG9iamVjdFxuICAvLyBSZWxhdGVkOiBodHRwOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aFxuICAvLyBBdm9pZHMgYSB2ZXJ5IG5hc3R5IGlPUyA4IEpJVCBidWcgb24gQVJNLTY0LiAjMjA5NFxuICB2YXIgTUFYX0FSUkFZX0lOREVYID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcbiAgdmFyIGdldExlbmd0aCA9IHByb3BlcnR5KCdsZW5ndGgnKTtcbiAgdmFyIGlzQXJyYXlMaWtlID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgfTtcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIHJhdyBvYmplY3RzIGluIGFkZGl0aW9uIHRvIGFycmF5LWxpa2VzLiBUcmVhdHMgYWxsXG4gIC8vIHNwYXJzZSBhcnJheS1saWtlcyBhcyBpZiB0aGV5IHdlcmUgZGVuc2UuXG4gIF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBpLCBsZW5ndGg7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpbaV0sIGksIG9iaik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudC5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdHMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICByZXN1bHRzW2luZGV4XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgcmVkdWNpbmcgZnVuY3Rpb24gaXRlcmF0aW5nIGxlZnQgb3IgcmlnaHQuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlZHVjZShkaXIpIHtcbiAgICAvLyBPcHRpbWl6ZWQgaXRlcmF0b3IgZnVuY3Rpb24gYXMgdXNpbmcgYXJndW1lbnRzLmxlbmd0aFxuICAgIC8vIGluIHRoZSBtYWluIGZ1bmN0aW9uIHdpbGwgZGVvcHRpbWl6ZSB0aGUsIHNlZSAjMTk5MS5cbiAgICBmdW5jdGlvbiBpdGVyYXRvcihvYmosIGl0ZXJhdGVlLCBtZW1vLCBrZXlzLCBpbmRleCwgbGVuZ3RoKSB7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRlZShtZW1vLCBvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgY29udGV4dCkge1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCA0KTtcbiAgICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgICAgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICAvLyBEZXRlcm1pbmUgdGhlIGluaXRpYWwgdmFsdWUgaWYgbm9uZSBpcyBwcm92aWRlZC5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBtZW1vID0gb2JqW2tleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4XTtcbiAgICAgICAgaW5kZXggKz0gZGlyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpO1xuICAgIH07XG4gIH1cblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuXG4gIF8ucmVkdWNlID0gXy5mb2xkbCA9IF8uaW5qZWN0ID0gY3JlYXRlUmVkdWNlKDEpO1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICBfLnJlZHVjZVJpZ2h0ID0gXy5mb2xkciA9IGNyZWF0ZVJlZHVjZSgtMSk7XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIGtleTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAga2V5ID0gXy5maW5kSW5kZXgob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXkgPSBfLmZpbmRLZXkob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAoa2V5ICE9PSB2b2lkIDAgJiYga2V5ICE9PSAtMSkgcmV0dXJuIG9ialtrZXldO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYHNlbGVjdGAuXG4gIF8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBfLnJlamVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5uZWdhdGUoY2IocHJlZGljYXRlKSksIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbGxgLlxuICBfLmV2ZXJ5ID0gXy5hbGwgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmICghcHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiB0aGUgYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gaXRlbSAodXNpbmcgYD09PWApLlxuICAvLyBBbGlhc2VkIGFzIGBpbmNsdWRlc2AgYW5kIGBpbmNsdWRlYC5cbiAgXy5jb250YWlucyA9IF8uaW5jbHVkZXMgPSBfLmluY2x1ZGUgPSBmdW5jdGlvbihvYmosIGl0ZW0sIGZyb21JbmRleCwgZ3VhcmQpIHtcbiAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgaWYgKHR5cGVvZiBmcm9tSW5kZXggIT0gJ251bWJlcicgfHwgZ3VhcmQpIGZyb21JbmRleCA9IDA7XG4gICAgcmV0dXJuIF8uaW5kZXhPZihvYmosIGl0ZW0sIGZyb21JbmRleCkgPj0gMDtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGZ1bmMgPSBpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdO1xuICAgICAgcmV0dXJuIGZ1bmMgPT0gbnVsbCA/IGZ1bmMgOiBmdW5jLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBtYXBgOiBmZXRjaGluZyBhIHByb3BlcnR5LlxuICBfLnBsdWNrID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBfLnByb3BlcnR5KGtleSkpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbHRlcmA6IHNlbGVjdGluZyBvbmx5IG9iamVjdHNcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy53aGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaW5kYDogZ2V0dGluZyB0aGUgZmlyc3Qgb2JqZWN0XG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uZmluZFdoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbmQob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSAtSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA+IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkID4gbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSAtSW5maW5pdHkgJiYgcmVzdWx0ID09PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlIDwgcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IEluZmluaXR5ICYmIHJlc3VsdCA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhIGNvbGxlY3Rpb24sIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGVcbiAgLy8gW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgc2V0ID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IHNldC5sZW5ndGg7XG4gICAgdmFyIHNodWZmbGVkID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIHJhbmQ7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oMCwgaW5kZXgpO1xuICAgICAgaWYgKHJhbmQgIT09IGluZGV4KSBzaHVmZmxlZFtpbmRleF0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gc2V0W2luZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIFNhbXBsZSAqKm4qKiByYW5kb20gdmFsdWVzIGZyb20gYSBjb2xsZWN0aW9uLlxuICAvLyBJZiAqKm4qKiBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm5zIGEgc2luZ2xlIHJhbmRvbSBlbGVtZW50LlxuICAvLyBUaGUgaW50ZXJuYWwgYGd1YXJkYCBhcmd1bWVudCBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBtYXBgLlxuICBfLnNhbXBsZSA9IGZ1bmN0aW9uKG9iaiwgbiwgZ3VhcmQpIHtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgICByZXR1cm4gb2JqW18ucmFuZG9tKG9iai5sZW5ndGggLSAxKV07XG4gICAgfVxuICAgIHJldHVybiBfLnNodWZmbGUob2JqKS5zbGljZSgwLCBNYXRoLm1heCgwLCBuKSk7XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdGVlLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gXy5wbHVjayhfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhOiBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihiZWhhdmlvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICB2YXIga2V5ID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIHZhbHVlLCBrZXkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSk7IGVsc2UgcmVzdWx0W2tleV0gPSBbdmFsdWVdO1xuICB9KTtcblxuICAvLyBJbmRleGVzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24sIHNpbWlsYXIgdG8gYGdyb3VwQnlgLCBidXQgZm9yXG4gIC8vIHdoZW4geW91IGtub3cgdGhhdCB5b3VyIGluZGV4IHZhbHVlcyB3aWxsIGJlIHVuaXF1ZS5cbiAgXy5pbmRleEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldKys7IGVsc2UgcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBTYWZlbHkgY3JlYXRlIGEgcmVhbCwgbGl2ZSBhcnJheSBmcm9tIGFueXRoaW5nIGl0ZXJhYmxlLlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkgcmV0dXJuIF8ubWFwKG9iaiwgXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9iaik7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiBpc0FycmF5TGlrZShvYmopID8gb2JqLmxlbmd0aCA6IF8ua2V5cyhvYmopLmxlbmd0aDtcbiAgfTtcblxuICAvLyBTcGxpdCBhIGNvbGxlY3Rpb24gaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIHBhc3MgPSBbXSwgZmFpbCA9IFtdO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikge1xuICAgICAgKHByZWRpY2F0ZSh2YWx1ZSwga2V5LCBvYmopID8gcGFzcyA6IGZhaWwpLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBbcGFzcywgZmFpbF07XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICByZXR1cm4gXy5pbml0aWFsKGFycmF5LCBhcnJheS5sZW5ndGggLSBuKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIChuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbikpKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gXy5yZXN0KGFycmF5LCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSBuKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBzdHJpY3QsIHN0YXJ0SW5kZXgpIHtcbiAgICB2YXIgb3V0cHV0ID0gW10sIGlkeCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0SW5kZXggfHwgMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGlucHV0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpbnB1dFtpXTtcbiAgICAgIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiYgKF8uaXNBcnJheSh2YWx1ZSkgfHwgXy5pc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgICAgIC8vZmxhdHRlbiBjdXJyZW50IGxldmVsIG9mIGFycmF5IG9yIGFyZ3VtZW50cyBvYmplY3RcbiAgICAgICAgaWYgKCFzaGFsbG93KSB2YWx1ZSA9IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIHN0cmljdCk7XG4gICAgICAgIHZhciBqID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICBvdXRwdXQubGVuZ3RoICs9IGxlbjtcbiAgICAgICAgd2hpbGUgKGogPCBsZW4pIHtcbiAgICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWVbaisrXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghc3RyaWN0KSB7XG4gICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBGbGF0dGVuIG91dCBhbiBhcnJheSwgZWl0aGVyIHJlY3Vyc2l2ZWx5IChieSBkZWZhdWx0KSwgb3IganVzdCBvbmUgbGV2ZWwuXG4gIF8uZmxhdHRlbiA9IGZ1bmN0aW9uKGFycmF5LCBzaGFsbG93KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oYXJyYXksIHNoYWxsb3csIGZhbHNlKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSB2ZXJzaW9uIG9mIHRoZSBhcnJheSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gdGhlIHNwZWNpZmllZCB2YWx1ZShzKS5cbiAgXy53aXRob3V0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGFycmF5LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRlZTtcbiAgICAgIGl0ZXJhdGVlID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXRlcmF0ZWUgIT0gbnVsbCkgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV0sXG4gICAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlLCBpLCBhcnJheSkgOiB2YWx1ZTtcbiAgICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgICBpZiAoIWkgfHwgc2VlbiAhPT0gY29tcHV0ZWQpIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgc2VlbiA9IGNvbXB1dGVkO1xuICAgICAgfSBlbHNlIGlmIChpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoc2VlbiwgY29tcHV0ZWQpKSB7XG4gICAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIV8uY29udGFpbnMocmVzdWx0LCB2YWx1ZSkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgXy51bmlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuaXEoZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gYXJyYXlbaV07XG4gICAgICBpZiAoXy5jb250YWlucyhyZXN1bHQsIGl0ZW0pKSBjb250aW51ZTtcbiAgICAgIGZvciAodmFyIGogPSAxOyBqIDwgYXJnc0xlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhhcmd1bWVudHNbal0sIGl0ZW0pKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChqID09PSBhcmdzTGVuZ3RoKSByZXN1bHQucHVzaChpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSwgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICByZXR1cm4gIV8uY29udGFpbnMocmVzdCwgdmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW56aXAoYXJndW1lbnRzKTtcbiAgfTtcblxuICAvLyBDb21wbGVtZW50IG9mIF8uemlwLiBVbnppcCBhY2NlcHRzIGFuIGFycmF5IG9mIGFycmF5cyBhbmQgZ3JvdXBzXG4gIC8vIGVhY2ggYXJyYXkncyBlbGVtZW50cyBvbiBzaGFyZWQgaW5kaWNlc1xuICBfLnVuemlwID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkgJiYgXy5tYXgoYXJyYXksIGdldExlbmd0aCkubGVuZ3RoIHx8IDA7XG4gICAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gXy5wbHVjayhhcnJheSwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgXy5vYmplY3QgPSBmdW5jdGlvbihsaXN0LCB2YWx1ZXMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChsaXN0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgZmluZEluZGV4IGFuZCBmaW5kTGFzdEluZGV4IGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcihkaXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgdmFyIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBvbiBhbiBhcnJheS1saWtlIHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kSW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigxKTtcbiAgXy5maW5kTGFzdEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoLTEpO1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRlZShvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IE1hdGguZmxvb3IoKGxvdyArIGhpZ2gpIC8gMik7XG4gICAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbbWlkXSkgPCB2YWx1ZSkgbG93ID0gbWlkICsgMTsgZWxzZSBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGluZGV4T2YgYW5kIGxhc3RJbmRleE9mIGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBjcmVhdGVJbmRleEZpbmRlcihkaXIsIHByZWRpY2F0ZUZpbmQsIHNvcnRlZEluZGV4KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpZHgpIHtcbiAgICAgIHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIGlmICh0eXBlb2YgaWR4ID09ICdudW1iZXInKSB7XG4gICAgICAgIGlmIChkaXIgPiAwKSB7XG4gICAgICAgICAgICBpID0gaWR4ID49IDAgPyBpZHggOiBNYXRoLm1heChpZHggKyBsZW5ndGgsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVuZ3RoID0gaWR4ID49IDAgPyBNYXRoLm1pbihpZHggKyAxLCBsZW5ndGgpIDogaWR4ICsgbGVuZ3RoICsgMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzb3J0ZWRJbmRleCAmJiBpZHggJiYgbGVuZ3RoKSB7XG4gICAgICAgIGlkeCA9IHNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2lkeF0gPT09IGl0ZW0gPyBpZHggOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtICE9PSBpdGVtKSB7XG4gICAgICAgIGlkeCA9IHByZWRpY2F0ZUZpbmQoc2xpY2UuY2FsbChhcnJheSwgaSwgbGVuZ3RoKSwgXy5pc05hTik7XG4gICAgICAgIHJldHVybiBpZHggPj0gMCA/IGlkeCArIGkgOiAtMTtcbiAgICAgIH1cbiAgICAgIGZvciAoaWR4ID0gZGlyID4gMCA/IGkgOiBsZW5ndGggLSAxOyBpZHggPj0gMCAmJiBpZHggPCBsZW5ndGg7IGlkeCArPSBkaXIpIHtcbiAgICAgICAgaWYgKGFycmF5W2lkeF0gPT09IGl0ZW0pIHJldHVybiBpZHg7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpbiBhbiBhcnJheSxcbiAgLy8gb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKDEsIF8uZmluZEluZGV4LCBfLnNvcnRlZEluZGV4KTtcbiAgXy5sYXN0SW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKC0xLCBfLmZpbmRMYXN0SW5kZXgpO1xuXG4gIC8vIEdlbmVyYXRlIGFuIGludGVnZXIgQXJyYXkgY29udGFpbmluZyBhbiBhcml0aG1ldGljIHByb2dyZXNzaW9uLiBBIHBvcnQgb2ZcbiAgLy8gdGhlIG5hdGl2ZSBQeXRob24gYHJhbmdlKClgIGZ1bmN0aW9uLiBTZWVcbiAgLy8gW3RoZSBQeXRob24gZG9jdW1lbnRhdGlvbl0oaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgXy5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKHN0b3AgPT0gbnVsbCkge1xuICAgICAgc3RvcCA9IHN0YXJ0IHx8IDA7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHN0ZXAgPSBzdGVwIHx8IDE7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciByYW5nZSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBsZW5ndGg7IGlkeCsrLCBzdGFydCArPSBzdGVwKSB7XG4gICAgICByYW5nZVtpZHhdID0gc3RhcnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGV4ZWN1dGUgYSBmdW5jdGlvbiBhcyBhIGNvbnN0cnVjdG9yXG4gIC8vIG9yIGEgbm9ybWFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50c1xuICB2YXIgZXhlY3V0ZUJvdW5kID0gZnVuY3Rpb24oc291cmNlRnVuYywgYm91bmRGdW5jLCBjb250ZXh0LCBjYWxsaW5nQ29udGV4dCwgYXJncykge1xuICAgIGlmICghKGNhbGxpbmdDb250ZXh0IGluc3RhbmNlb2YgYm91bmRGdW5jKSkgcmV0dXJuIHNvdXJjZUZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgdmFyIHNlbGYgPSBiYXNlQ3JlYXRlKHNvdXJjZUZ1bmMucHJvdG90eXBlKTtcbiAgICB2YXIgcmVzdWx0ID0gc291cmNlRnVuYy5hcHBseShzZWxmLCBhcmdzKTtcbiAgICBpZiAoXy5pc09iamVjdChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIGlmIChuYXRpdmVCaW5kICYmIGZ1bmMuYmluZCA9PT0gbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihmdW5jKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQmluZCBtdXN0IGJlIGNhbGxlZCBvbiBhIGZ1bmN0aW9uJyk7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCBjb250ZXh0LCB0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LiBfIGFjdHNcbiAgLy8gYXMgYSBwbGFjZWhvbGRlciwgYWxsb3dpbmcgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyB0byBiZSBwcmUtZmlsbGVkLlxuICBfLnBhcnRpYWwgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIGJvdW5kQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IDAsIGxlbmd0aCA9IGJvdW5kQXJncy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IEFycmF5KGxlbmd0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFyZ3NbaV0gPSBib3VuZEFyZ3NbaV0gPT09IF8gPyBhcmd1bWVudHNbcG9zaXRpb24rK10gOiBib3VuZEFyZ3NbaV07XG4gICAgICB9XG4gICAgICB3aGlsZSAocG9zaXRpb24gPCBhcmd1bWVudHMubGVuZ3RoKSBhcmdzLnB1c2goYXJndW1lbnRzW3Bvc2l0aW9uKytdKTtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIHRoaXMsIHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9O1xuXG4gIC8vIEJpbmQgYSBudW1iZXIgb2YgYW4gb2JqZWN0J3MgbWV0aG9kcyB0byB0aGF0IG9iamVjdC4gUmVtYWluaW5nIGFyZ3VtZW50c1xuICAvLyBhcmUgdGhlIG1ldGhvZCBuYW1lcyB0byBiZSBib3VuZC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0IGFsbCBjYWxsYmFja3NcbiAgLy8gZGVmaW5lZCBvbiBhbiBvYmplY3QgYmVsb25nIHRvIGl0LlxuICBfLmJpbmRBbGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCwga2V5O1xuICAgIGlmIChsZW5ndGggPD0gMSkgdGhyb3cgbmV3IEVycm9yKCdiaW5kQWxsIG11c3QgYmUgcGFzc2VkIGZ1bmN0aW9uIG5hbWVzJyk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBhcmd1bWVudHNbaV07XG4gICAgICBvYmpba2V5XSA9IF8uYmluZChvYmpba2V5XSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBfLm1lbW9pemUgPSBmdW5jdGlvbihmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtb2l6ZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIGNhY2hlID0gbWVtb2l6ZS5jYWNoZTtcbiAgICAgIHZhciBhZGRyZXNzID0gJycgKyAoaGFzaGVyID8gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBrZXkpO1xuICAgICAgaWYgKCFfLmhhcyhjYWNoZSwgYWRkcmVzcykpIGNhY2hlW2FkZHJlc3NdID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIGNhY2hlW2FkZHJlc3NdO1xuICAgIH07XG4gICAgbWVtb2l6ZS5jYWNoZSA9IHt9O1xuICAgIHJldHVybiBtZW1vaXplO1xuICB9O1xuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICBfLmRlbGF5ID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCB3YWl0KTtcbiAgfTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IF8ucGFydGlhbChfLmRlbGF5LCBfLCAxKTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBfLm5vdygpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm93ID0gXy5ub3coKTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAgLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICAvLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAgLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAgXy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcblxuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxhc3QgPSBfLm5vdygpIC0gdGltZXN0YW1wO1xuXG4gICAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+PSAwKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHRpbWVzdGFtcCA9IF8ubm93KCk7XG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGlmICghdGltZW91dCkgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBfLnBhcnRpYWwod3JhcHBlciwgZnVuYyk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIG5lZ2F0ZWQgdmVyc2lvbiBvZiB0aGUgcGFzc2VkLWluIHByZWRpY2F0ZS5cbiAgXy5uZWdhdGUgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIHN0YXJ0ID0gYXJncy5sZW5ndGggLSAxO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpID0gc3RhcnQ7XG4gICAgICB2YXIgcmVzdWx0ID0gYXJnc1tzdGFydF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHdoaWxlIChpLS0pIHJlc3VsdCA9IGFyZ3NbaV0uY2FsbCh0aGlzLCByZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBvbiBhbmQgYWZ0ZXIgdGhlIE50aCBjYWxsLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCB1cCB0byAoYnV0IG5vdCBpbmNsdWRpbmcpIHRoZSBOdGggY2FsbC5cbiAgXy5iZWZvcmUgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHZhciBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzID4gMCkge1xuICAgICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKHRpbWVzIDw9IDEpIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGF0IG1vc3Qgb25lIHRpbWUsIG5vIG1hdHRlciBob3dcbiAgLy8gb2Z0ZW4geW91IGNhbGwgaXQuIFVzZWZ1bCBmb3IgbGF6eSBpbml0aWFsaXphdGlvbi5cbiAgXy5vbmNlID0gXy5wYXJ0aWFsKF8uYmVmb3JlLCAyKTtcblxuICAvLyBPYmplY3QgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBLZXlzIGluIElFIDwgOSB0aGF0IHdvbid0IGJlIGl0ZXJhdGVkIGJ5IGBmb3Iga2V5IGluIC4uLmAgYW5kIHRodXMgbWlzc2VkLlxuICB2YXIgaGFzRW51bUJ1ZyA9ICF7dG9TdHJpbmc6IG51bGx9LnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xuICB2YXIgbm9uRW51bWVyYWJsZVByb3BzID0gWyd2YWx1ZU9mJywgJ2lzUHJvdG90eXBlT2YnLCAndG9TdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdoYXNPd25Qcm9wZXJ0eScsICd0b0xvY2FsZVN0cmluZyddO1xuXG4gIGZ1bmN0aW9uIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKSB7XG4gICAgdmFyIG5vbkVudW1JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IG9iai5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgcHJvdG8gPSAoXy5pc0Z1bmN0aW9uKGNvbnN0cnVjdG9yKSAmJiBjb25zdHJ1Y3Rvci5wcm90b3R5cGUpIHx8IE9ialByb3RvO1xuXG4gICAgLy8gQ29uc3RydWN0b3IgaXMgYSBzcGVjaWFsIGNhc2UuXG4gICAgdmFyIHByb3AgPSAnY29uc3RydWN0b3InO1xuICAgIGlmIChfLmhhcyhvYmosIHByb3ApICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSBrZXlzLnB1c2gocHJvcCk7XG5cbiAgICB3aGlsZSAobm9uRW51bUlkeC0tKSB7XG4gICAgICBwcm9wID0gbm9uRW51bWVyYWJsZVByb3BzW25vbkVudW1JZHhdO1xuICAgICAgaWYgKHByb3AgaW4gb2JqICYmIG9ialtwcm9wXSAhPT0gcHJvdG9bcHJvcF0gJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIHtcbiAgICAgICAga2V5cy5wdXNoKHByb3ApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYE9iamVjdC5rZXlzYFxuICBfLmtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIGlmIChuYXRpdmVLZXlzKSByZXR1cm4gbmF0aXZlS2V5cyhvYmopO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgYWxsIHRoZSBwcm9wZXJ0eSBuYW1lcyBvZiBhbiBvYmplY3QuXG4gIF8uYWxsS2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHZhbHVlcyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudCBvZiB0aGUgb2JqZWN0XG4gIC8vIEluIGNvbnRyYXN0IHRvIF8ubWFwIGl0IHJldHVybnMgYW4gb2JqZWN0XG4gIF8ubWFwT2JqZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIF8ua2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoLFxuICAgICAgICAgIHJlc3VsdHMgPSB7fSxcbiAgICAgICAgICBjdXJyZW50S2V5O1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjdXJyZW50S2V5ID0ga2V5c1tpbmRleF07XG4gICAgICAgIHJlc3VsdHNbY3VycmVudEtleV0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgXy5wYWlycyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBwYWlycyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcGFpcnNbaV0gPSBba2V5c1tpXSwgb2JqW2tleXNbaV1dXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9O1xuXG4gIC8vIEludmVydCB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIGFuIG9iamVjdC4gVGhlIHZhbHVlcyBtdXN0IGJlIHNlcmlhbGl6YWJsZS5cbiAgXy5pbnZlcnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W29ialtrZXlzW2ldXV0gPSBrZXlzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cyk7XG5cbiAgLy8gQXNzaWducyBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgb3duIHByb3BlcnRpZXMgaW4gdGhlIHBhc3NlZC1pbiBvYmplY3QocylcbiAgLy8gKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ24pXG4gIF8uZXh0ZW5kT3duID0gXy5hc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihfLmtleXMpO1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGtleSBvbiBhbiBvYmplY3QgdGhhdCBwYXNzZXMgYSBwcmVkaWNhdGUgdGVzdFxuICBfLmZpbmRLZXkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKSwga2V5O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpba2V5XSwga2V5LCBvYmopKSByZXR1cm4ga2V5O1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmplY3QsIG9pdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSB7fSwgb2JqID0gb2JqZWN0LCBpdGVyYXRlZSwga2V5cztcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihvaXRlcmF0ZWUpKSB7XG4gICAgICBrZXlzID0gXy5hbGxLZXlzKG9iaik7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2Iob2l0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5cyA9IGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHsgcmV0dXJuIGtleSBpbiBvYmo7IH07XG4gICAgICBvYmogPSBPYmplY3Qob2JqKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gICAgICBpZiAoaXRlcmF0ZWUodmFsdWUsIGtleSwgb2JqKSkgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGl0ZXJhdGVlKSkge1xuICAgICAgaXRlcmF0ZWUgPSBfLm5lZ2F0ZShpdGVyYXRlZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5tYXAoZmxhdHRlbihhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgMSksIFN0cmluZyk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKGtleXMsIGtleSk7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gXy5waWNrKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMsIHRydWUpO1xuXG4gIC8vIENyZWF0ZXMgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGUgZ2l2ZW4gcHJvdG90eXBlIG9iamVjdC5cbiAgLy8gSWYgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGFyZSBwcm92aWRlZCB0aGVuIHRoZXkgd2lsbCBiZSBhZGRlZCB0byB0aGVcbiAgLy8gY3JlYXRlZCBvYmplY3QuXG4gIF8uY3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlLCBwcm9wcykge1xuICAgIHZhciByZXN1bHQgPSBiYXNlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgaWYgKHByb3BzKSBfLmV4dGVuZE93bihyZXN1bHQsIHByb3BzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZiBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5pc01hdGNoID0gZnVuY3Rpb24ob2JqZWN0LCBhdHRycykge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKGF0dHJzKSwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gIWxlbmd0aDtcbiAgICB2YXIgb2JqID0gT2JqZWN0KG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoYXR0cnNba2V5XSAhPT0gb2JqW2tleV0gfHwgIShrZXkgaW4gb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PT0gMSAvIGI7XG4gICAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gYSA9PT0gYjtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXykgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gQ29tcGFyZSBgW1tDbGFzc11dYCBuYW1lcy5cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAoY2xhc3NOYW1lICE9PSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvZXJjZWQgdG8gc3RyaW5ncyBmb3IgY29tcGFyaXNvbiAoTm90ZTogJycgKyAvYS9pID09PSAnL2EvaScpXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiAnJyArIGEgPT09ICcnICsgYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuXG4gICAgICAgIC8vIE9iamVjdChOYU4pIGlzIGVxdWl2YWxlbnQgdG8gTmFOXG4gICAgICAgIGlmICgrYSAhPT0gK2EpIHJldHVybiArYiAhPT0gK2I7XG4gICAgICAgIC8vIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3Igb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgIHJldHVybiArYSA9PT0gMCA/IDEgLyArYSA9PT0gMSAvIGIgOiArYSA9PT0gK2I7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT09ICtiO1xuICAgIH1cblxuICAgIHZhciBhcmVBcnJheXMgPSBjbGFzc05hbWUgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgaWYgKCFhcmVBcnJheXMpIHtcbiAgICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHMgb3IgYEFycmF5YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiBhQ3RvciBpbnN0YW5jZW9mIGFDdG9yICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiBiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBc3N1bWUgZXF1YWxpdHkgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljXG4gICAgLy8gc3RydWN0dXJlcyBpcyBhZGFwdGVkIGZyb20gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AuXG5cbiAgICAvLyBJbml0aWFsaXppbmcgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgLy8gSXQncyBkb25lIGhlcmUgc2luY2Ugd2Ugb25seSBuZWVkIHRoZW0gZm9yIG9iamVjdHMgYW5kIGFycmF5cyBjb21wYXJpc29uLlxuICAgIGFTdGFjayA9IGFTdGFjayB8fCBbXTtcbiAgICBiU3RhY2sgPSBiU3RhY2sgfHwgW107XG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09PSBiO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChhcmVBcnJheXMpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgbGVuZ3RoID0gYS5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoICE9PSBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBpZiAoIWVxKGFbbGVuZ3RoXSwgYltsZW5ndGhdLCBhU3RhY2ssIGJTdGFjaykpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhhKSwga2V5O1xuICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcyBiZWZvcmUgY29tcGFyaW5nIGRlZXAgZXF1YWxpdHkuXG4gICAgICBpZiAoXy5rZXlzKGIpLmxlbmd0aCAhPT0gbGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyXG4gICAgICAgIGtleSA9IGtleXNbbGVuZ3RoXTtcbiAgICAgICAgaWYgKCEoXy5oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBfLmlzRXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopICYmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikgfHwgXy5pc0FyZ3VtZW50cyhvYmopKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gICAgcmV0dXJuIF8ua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIG9iajtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JyAmJiAhIW9iajtcbiAgfTtcblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cCwgaXNFcnJvci5cbiAgXy5lYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnLCAnRXJyb3InXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFIDwgOSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaGFzKG9iaiwgJ2NhbGxlZScpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuIFdvcmsgYXJvdW5kIHNvbWUgdHlwZW9mIGJ1Z3MgaW4gb2xkIHY4LFxuICAvLyBJRSAxMSAoIzE2MjEpLCBhbmQgaW4gU2FmYXJpIDggKCMxOTI5KS5cbiAgaWYgKHR5cGVvZiAvLi8gIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgSW50OEFycmF5ICE9ICdvYmplY3QnKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPT0gK29iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0ZWVzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUHJlZGljYXRlLWdlbmVyYXRpbmcgZnVuY3Rpb25zLiBPZnRlbiB1c2VmdWwgb3V0c2lkZSBvZiBVbmRlcnNjb3JlLlxuICBfLmNvbnN0YW50ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfTtcblxuICBfLm5vb3AgPSBmdW5jdGlvbigpe307XG5cbiAgXy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuXG4gIC8vIEdlbmVyYXRlcyBhIGZ1bmN0aW9uIGZvciBhIGdpdmVuIG9iamVjdCB0aGF0IHJldHVybnMgYSBnaXZlbiBwcm9wZXJ0eS5cbiAgXy5wcm9wZXJ0eU9mID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PSBudWxsID8gZnVuY3Rpb24oKXt9IDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgcHJlZGljYXRlIGZvciBjaGVja2luZyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2ZcbiAgLy8gYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ubWF0Y2hlciA9IF8ubWF0Y2hlcyA9IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgYXR0cnMgPSBfLmV4dGVuZE93bih7fSwgYXR0cnMpO1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmlzTWF0Y2gob2JqLCBhdHRycyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgXy50aW1lcyA9IGZ1bmN0aW9uKG4sIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtID0gQXJyYXkoTWF0aC5tYXgoMCwgbikpO1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0ZWUoaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIEEgKHBvc3NpYmx5IGZhc3Rlcikgd2F5IHRvIGdldCB0aGUgY3VycmVudCB0aW1lc3RhbXAgYXMgYW4gaW50ZWdlci5cbiAgXy5ub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH07XG5cbiAgIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlc2NhcGVNYXAgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgICAnYCc6ICcmI3g2MDsnXG4gIH07XG4gIHZhciB1bmVzY2FwZU1hcCA9IF8uaW52ZXJ0KGVzY2FwZU1hcCk7XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICB2YXIgY3JlYXRlRXNjYXBlciA9IGZ1bmN0aW9uKG1hcCkge1xuICAgIHZhciBlc2NhcGVyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXBbbWF0Y2hdO1xuICAgIH07XG4gICAgLy8gUmVnZXhlcyBmb3IgaWRlbnRpZnlpbmcgYSBrZXkgdGhhdCBuZWVkcyB0byBiZSBlc2NhcGVkXG4gICAgdmFyIHNvdXJjZSA9ICcoPzonICsgXy5rZXlzKG1hcCkuam9pbignfCcpICsgJyknO1xuICAgIHZhciB0ZXN0UmVnZXhwID0gUmVnRXhwKHNvdXJjZSk7XG4gICAgdmFyIHJlcGxhY2VSZWdleHAgPSBSZWdFeHAoc291cmNlLCAnZycpO1xuICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIHN0cmluZyA9IHN0cmluZyA9PSBudWxsID8gJycgOiAnJyArIHN0cmluZztcbiAgICAgIHJldHVybiB0ZXN0UmVnZXhwLnRlc3Qoc3RyaW5nKSA/IHN0cmluZy5yZXBsYWNlKHJlcGxhY2VSZWdleHAsIGVzY2FwZXIpIDogc3RyaW5nO1xuICAgIH07XG4gIH07XG4gIF8uZXNjYXBlID0gY3JlYXRlRXNjYXBlcihlc2NhcGVNYXApO1xuICBfLnVuZXNjYXBlID0gY3JlYXRlRXNjYXBlcih1bmVzY2FwZU1hcCk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBgcHJvcGVydHlgIGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQgd2l0aCB0aGVcbiAgLy8gYG9iamVjdGAgYXMgY29udGV4dDsgb3RoZXJ3aXNlLCByZXR1cm4gaXQuXG4gIF8ucmVzdWx0ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSwgZmFsbGJhY2spIHtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHZvaWQgMCA6IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHZhbHVlID0gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaW50ZWdlciBpZCAodW5pcXVlIHdpdGhpbiB0aGUgZW50aXJlIGNsaWVudCBzZXNzaW9uKS5cbiAgLy8gVXNlZnVsIGZvciB0ZW1wb3JhcnkgRE9NIGlkcy5cbiAgdmFyIGlkQ291bnRlciA9IDA7XG4gIF8udW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGUgICAgICA6IC88JS0oW1xcc1xcU10rPyklPi9nXG4gIH07XG5cbiAgLy8gV2hlbiBjdXN0b21pemluZyBgdGVtcGxhdGVTZXR0aW5nc2AsIGlmIHlvdSBkb24ndCB3YW50IHRvIGRlZmluZSBhblxuICAvLyBpbnRlcnBvbGF0aW9uLCBldmFsdWF0aW9uIG9yIGVzY2FwaW5nIHJlZ2V4LCB3ZSBuZWVkIG9uZSB0aGF0IGlzXG4gIC8vIGd1YXJhbnRlZWQgbm90IHRvIG1hdGNoLlxuICB2YXIgbm9NYXRjaCA9IC8oLileLztcblxuICAvLyBDZXJ0YWluIGNoYXJhY3RlcnMgbmVlZCB0byBiZSBlc2NhcGVkIHNvIHRoYXQgdGhleSBjYW4gYmUgcHV0IGludG8gYVxuICAvLyBzdHJpbmcgbGl0ZXJhbC5cbiAgdmFyIGVzY2FwZXMgPSB7XG4gICAgXCInXCI6ICAgICAgXCInXCIsXG4gICAgJ1xcXFwnOiAgICAgJ1xcXFwnLFxuICAgICdcXHInOiAgICAgJ3InLFxuICAgICdcXG4nOiAgICAgJ24nLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlciA9IC9cXFxcfCd8XFxyfFxcbnxcXHUyMDI4fFxcdTIwMjkvZztcblxuICB2YXIgZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdO1xuICB9O1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIC8vIE5COiBgb2xkU2V0dGluZ3NgIG9ubHkgZXhpc3RzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgXy50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRleHQsIHNldHRpbmdzLCBvbGRTZXR0aW5ncykge1xuICAgIGlmICghc2V0dGluZ3MgJiYgb2xkU2V0dGluZ3MpIHNldHRpbmdzID0gb2xkU2V0dGluZ3M7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gUmVnRXhwKFtcbiAgICAgIChzZXR0aW5ncy5lc2NhcGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmludGVycG9sYXRlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5ldmFsdWF0ZSB8fCBub01hdGNoKS5zb3VyY2VcbiAgICBdLmpvaW4oJ3wnKSArICd8JCcsICdnJyk7XG5cbiAgICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZSBzb3VyY2UsIGVzY2FwaW5nIHN0cmluZyBsaXRlcmFscyBhcHByb3ByaWF0ZWx5LlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNvdXJjZSA9IFwiX19wKz0nXCI7XG4gICAgdGV4dC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGUsIGludGVycG9sYXRlLCBldmFsdWF0ZSwgb2Zmc2V0KSB7XG4gICAgICBzb3VyY2UgKz0gdGV4dC5zbGljZShpbmRleCwgb2Zmc2V0KS5yZXBsYWNlKGVzY2FwZXIsIGVzY2FwZUNoYXIpO1xuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkb2JlIFZNcyBuZWVkIHRoZSBtYXRjaCByZXR1cm5lZCB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IG9mZmVzdC5cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArICdyZXR1cm4gX19wO1xcbic7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIHJlbmRlciA9IG5ldyBGdW5jdGlvbihzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJywgJ18nLCBzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gcmVuZGVyLmNhbGwodGhpcywgZGF0YSwgXyk7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgdGhlIGNvbXBpbGVkIHNvdXJjZSBhcyBhIGNvbnZlbmllbmNlIGZvciBwcmVjb21waWxhdGlvbi5cbiAgICB2YXIgYXJndW1lbnQgPSBzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJztcbiAgICB0ZW1wbGF0ZS5zb3VyY2UgPSAnZnVuY3Rpb24oJyArIGFyZ3VtZW50ICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24uIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5jaGFpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpbnN0YW5jZSA9IF8ob2JqKTtcbiAgICBpbnN0YW5jZS5fY2hhaW4gPSB0cnVlO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfTtcblxuICAvLyBPT1BcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElmIFVuZGVyc2NvcmUgaXMgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGl0IHJldHVybnMgYSB3cmFwcGVkIG9iamVjdCB0aGF0XG4gIC8vIGNhbiBiZSB1c2VkIE9PLXN0eWxlLiBUaGlzIHdyYXBwZXIgaG9sZHMgYWx0ZXJlZCB2ZXJzaW9ucyBvZiBhbGwgdGhlXG4gIC8vIHVuZGVyc2NvcmUgZnVuY3Rpb25zLiBXcmFwcGVkIG9iamVjdHMgbWF5IGJlIGNoYWluZWQuXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24oaW5zdGFuY2UsIG9iaikge1xuICAgIHJldHVybiBpbnN0YW5jZS5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuICBfLm1peGluKF8pO1xuXG4gIC8vIEFkZCBhbGwgbXV0YXRvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PT0gJ3NoaWZ0JyB8fCBuYW1lID09PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgXy5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBQcm92aWRlIHVud3JhcHBpbmcgcHJveHkgZm9yIHNvbWUgbWV0aG9kcyB1c2VkIGluIGVuZ2luZSBvcGVyYXRpb25zXG4gIC8vIHN1Y2ggYXMgYXJpdGhtZXRpYyBhbmQgSlNPTiBzdHJpbmdpZmljYXRpb24uXG4gIF8ucHJvdG90eXBlLnZhbHVlT2YgPSBfLnByb3RvdHlwZS50b0pTT04gPSBfLnByb3RvdHlwZS52YWx1ZTtcblxuICBfLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnJyArIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gQU1EIHJlZ2lzdHJhdGlvbiBoYXBwZW5zIGF0IHRoZSBlbmQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBBTUQgbG9hZGVyc1xuICAvLyB0aGF0IG1heSBub3QgZW5mb3JjZSBuZXh0LXR1cm4gc2VtYW50aWNzIG9uIG1vZHVsZXMuIEV2ZW4gdGhvdWdoIGdlbmVyYWxcbiAgLy8gcHJhY3RpY2UgZm9yIEFNRCByZWdpc3RyYXRpb24gaXMgdG8gYmUgYW5vbnltb3VzLCB1bmRlcnNjb3JlIHJlZ2lzdGVyc1xuICAvLyBhcyBhIG5hbWVkIG1vZHVsZSBiZWNhdXNlLCBsaWtlIGpRdWVyeSwgaXQgaXMgYSBiYXNlIGxpYnJhcnkgdGhhdCBpc1xuICAvLyBwb3B1bGFyIGVub3VnaCB0byBiZSBidW5kbGVkIGluIGEgdGhpcmQgcGFydHkgbGliLCBidXQgbm90IGJlIHBhcnQgb2ZcbiAgLy8gYW4gQU1EIGxvYWQgcmVxdWVzdC4gVGhvc2UgY2FzZXMgY291bGQgZ2VuZXJhdGUgYW4gZXJyb3Igd2hlbiBhblxuICAvLyBhbm9ueW1vdXMgZGVmaW5lKCkgaXMgY2FsbGVkIG91dHNpZGUgb2YgYSBsb2FkZXIgcmVxdWVzdC5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgndW5kZXJzY29yZScsIFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfO1xuICAgIH0pO1xuICB9XG59LmNhbGwodGhpcykpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzXG4vLyBtb2R1bGUgaWQgPSA2OVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiFcbiAqIGNsZWF2ZS5qcyAtIDAuNy4yM1xuICogaHR0cHM6Ly9naXRodWIuY29tL25vc2lyL2NsZWF2ZS5qc1xuICogQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjBcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTItMjAxNyBNYXggSHVhbmcgaHR0cHM6Ly9naXRodWIuY29tL25vc2lyL1xuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLkNsZWF2ZT10KCk6ZS5DbGVhdmU9dCgpfSh0aGlzLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQobil7aWYocltuXSlyZXR1cm4gcltuXS5leHBvcnRzO3ZhciBpPXJbbl09e2V4cG9ydHM6e30saWQ6bixsb2FkZWQ6ITF9O3JldHVybiBlW25dLmNhbGwoaS5leHBvcnRzLGksaS5leHBvcnRzLHQpLGkubG9hZGVkPSEwLGkuZXhwb3J0c312YXIgcj17fTtyZXR1cm4gdC5tPWUsdC5jPXIsdC5wPVwiXCIsdCgwKX0oW2Z1bmN0aW9uKGUsdCxyKXsoZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZnVuY3Rpb24oZSx0KXt2YXIgcj10aGlzO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlP3IuZWxlbWVudD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGUpOnIuZWxlbWVudD1cInVuZGVmaW5lZFwiIT10eXBlb2YgZS5sZW5ndGgmJmUubGVuZ3RoPjA/ZVswXTplLCFyLmVsZW1lbnQpdGhyb3cgbmV3IEVycm9yKFwiW2NsZWF2ZS5qc10gUGxlYXNlIGNoZWNrIHRoZSBlbGVtZW50XCIpO3QuaW5pdFZhbHVlPXIuZWxlbWVudC52YWx1ZSxyLnByb3BlcnRpZXM9bi5EZWZhdWx0UHJvcGVydGllcy5hc3NpZ24oe30sdCksci5pbml0KCl9O24ucHJvdG90eXBlPXtpbml0OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllczsodC5udW1lcmFsfHx0LnBob25lfHx0LmNyZWRpdENhcmR8fHQuZGF0ZXx8MCE9PXQuYmxvY2tzTGVuZ3RofHx0LnByZWZpeCkmJih0Lm1heExlbmd0aD1uLlV0aWwuZ2V0TWF4TGVuZ3RoKHQuYmxvY2tzKSxlLmlzQW5kcm9pZD1uLlV0aWwuaXNBbmRyb2lkKCksZS5sYXN0SW5wdXRWYWx1ZT1cIlwiLGUub25DaGFuZ2VMaXN0ZW5lcj1lLm9uQ2hhbmdlLmJpbmQoZSksZS5vbktleURvd25MaXN0ZW5lcj1lLm9uS2V5RG93bi5iaW5kKGUpLGUub25DdXRMaXN0ZW5lcj1lLm9uQ3V0LmJpbmQoZSksZS5vbkNvcHlMaXN0ZW5lcj1lLm9uQ29weS5iaW5kKGUpLGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixlLm9uQ2hhbmdlTGlzdGVuZXIpLGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLGUub25LZXlEb3duTGlzdGVuZXIpLGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY3V0XCIsZS5vbkN1dExpc3RlbmVyKSxlLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvcHlcIixlLm9uQ29weUxpc3RlbmVyKSxlLmluaXRQaG9uZUZvcm1hdHRlcigpLGUuaW5pdERhdGVGb3JtYXR0ZXIoKSxlLmluaXROdW1lcmFsRm9ybWF0dGVyKCksZS5vbklucHV0KHQuaW5pdFZhbHVlKSl9LGluaXROdW1lcmFsRm9ybWF0dGVyOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllczt0Lm51bWVyYWwmJih0Lm51bWVyYWxGb3JtYXR0ZXI9bmV3IG4uTnVtZXJhbEZvcm1hdHRlcih0Lm51bWVyYWxEZWNpbWFsTWFyayx0Lm51bWVyYWxJbnRlZ2VyU2NhbGUsdC5udW1lcmFsRGVjaW1hbFNjYWxlLHQubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGUsdC5udW1lcmFsUG9zaXRpdmVPbmx5LHQuZGVsaW1pdGVyKSl9LGluaXREYXRlRm9ybWF0dGVyOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllczt0LmRhdGUmJih0LmRhdGVGb3JtYXR0ZXI9bmV3IG4uRGF0ZUZvcm1hdHRlcih0LmRhdGVQYXR0ZXJuKSx0LmJsb2Nrcz10LmRhdGVGb3JtYXR0ZXIuZ2V0QmxvY2tzKCksdC5ibG9ja3NMZW5ndGg9dC5ibG9ja3MubGVuZ3RoLHQubWF4TGVuZ3RoPW4uVXRpbC5nZXRNYXhMZW5ndGgodC5ibG9ja3MpKX0saW5pdFBob25lRm9ybWF0dGVyOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllcztpZih0LnBob25lKXRyeXt0LnBob25lRm9ybWF0dGVyPW5ldyBuLlBob25lRm9ybWF0dGVyKG5ldyB0LnJvb3QuQ2xlYXZlLkFzWW91VHlwZUZvcm1hdHRlcih0LnBob25lUmVnaW9uQ29kZSksdC5kZWxpbWl0ZXIpfWNhdGNoKHIpe3Rocm93IG5ldyBFcnJvcihcIltjbGVhdmUuanNdIFBsZWFzZSBpbmNsdWRlIHBob25lLXR5cGUtZm9ybWF0dGVyLntjb3VudHJ5fS5qcyBsaWJcIil9fSxvbktleURvd246ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPXQucHJvcGVydGllcyxpPWUud2hpY2h8fGUua2V5Q29kZSxhPW4uVXRpbCxvPXQuZWxlbWVudC52YWx1ZTtyZXR1cm4gYS5pc0FuZHJvaWRCYWNrc3BhY2VLZXlkb3duKHQubGFzdElucHV0VmFsdWUsbykmJihpPTgpLHQubGFzdElucHV0VmFsdWU9byw4PT09aSYmYS5pc0RlbGltaXRlcihvLnNsaWNlKC1yLmRlbGltaXRlckxlbmd0aCksci5kZWxpbWl0ZXIsci5kZWxpbWl0ZXJzKT92b2lkKHIuYmFja3NwYWNlPSEwKTp2b2lkKHIuYmFja3NwYWNlPSExKX0sb25DaGFuZ2U6ZnVuY3Rpb24oKXt0aGlzLm9uSW5wdXQodGhpcy5lbGVtZW50LnZhbHVlKX0sb25DdXQ6ZnVuY3Rpb24oZSl7dGhpcy5jb3B5Q2xpcGJvYXJkRGF0YShlKSx0aGlzLm9uSW5wdXQoXCJcIil9LG9uQ29weTpmdW5jdGlvbihlKXt0aGlzLmNvcHlDbGlwYm9hcmREYXRhKGUpfSxjb3B5Q2xpcGJvYXJkRGF0YTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzLGk9bi5VdGlsLGE9dC5lbGVtZW50LnZhbHVlLG89XCJcIjtvPXIuY29weURlbGltaXRlcj9hOmkuc3RyaXBEZWxpbWl0ZXJzKGEsci5kZWxpbWl0ZXIsci5kZWxpbWl0ZXJzKTt0cnl7ZS5jbGlwYm9hcmREYXRhP2UuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwiVGV4dFwiLG8pOndpbmRvdy5jbGlwYm9hcmREYXRhLnNldERhdGEoXCJUZXh0XCIsbyksZS5wcmV2ZW50RGVmYXVsdCgpfWNhdGNoKGwpe319LG9uSW5wdXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPXQucHJvcGVydGllcyxpPWUsYT1uLlV0aWw7cmV0dXJuIHIubnVtZXJhbHx8IXIuYmFja3NwYWNlfHxhLmlzRGVsaW1pdGVyKGUuc2xpY2UoLXIuZGVsaW1pdGVyTGVuZ3RoKSxyLmRlbGltaXRlcixyLmRlbGltaXRlcnMpfHwoZT1hLmhlYWRTdHIoZSxlLmxlbmd0aC1yLmRlbGltaXRlckxlbmd0aCkpLHIucGhvbmU/KHIucmVzdWx0PXIucGhvbmVGb3JtYXR0ZXIuZm9ybWF0KGUpLHZvaWQgdC51cGRhdGVWYWx1ZVN0YXRlKCkpOnIubnVtZXJhbD8oci5yZXN1bHQ9ci5wcmVmaXgrci5udW1lcmFsRm9ybWF0dGVyLmZvcm1hdChlKSx2b2lkIHQudXBkYXRlVmFsdWVTdGF0ZSgpKTooci5kYXRlJiYoZT1yLmRhdGVGb3JtYXR0ZXIuZ2V0VmFsaWRhdGVkRGF0ZShlKSksZT1hLnN0cmlwRGVsaW1pdGVycyhlLHIuZGVsaW1pdGVyLHIuZGVsaW1pdGVycyksZT1hLmdldFByZWZpeFN0cmlwcGVkVmFsdWUoZSxyLnByZWZpeCxyLnByZWZpeExlbmd0aCksZT1yLm51bWVyaWNPbmx5P2Euc3RyaXAoZSwvW15cXGRdL2cpOmUsZT1yLnVwcGVyY2FzZT9lLnRvVXBwZXJDYXNlKCk6ZSxlPXIubG93ZXJjYXNlP2UudG9Mb3dlckNhc2UoKTplLHIucHJlZml4JiYoZT1yLnByZWZpeCtlLDA9PT1yLmJsb2Nrc0xlbmd0aCk/KHIucmVzdWx0PWUsdm9pZCB0LnVwZGF0ZVZhbHVlU3RhdGUoKSk6KHIuY3JlZGl0Q2FyZCYmdC51cGRhdGVDcmVkaXRDYXJkUHJvcHNCeVZhbHVlKGUpLGU9YS5oZWFkU3RyKGUsci5tYXhMZW5ndGgpLHIucmVzdWx0PWEuZ2V0Rm9ybWF0dGVkVmFsdWUoZSxyLmJsb2NrcyxyLmJsb2Nrc0xlbmd0aCxyLmRlbGltaXRlcixyLmRlbGltaXRlcnMpLHZvaWQoaT09PXIucmVzdWx0JiZpIT09ci5wcmVmaXh8fHQudXBkYXRlVmFsdWVTdGF0ZSgpKSkpfSx1cGRhdGVDcmVkaXRDYXJkUHJvcHNCeVZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0LHI9dGhpcyxpPXIucHJvcGVydGllcyxhPW4uVXRpbDthLmhlYWRTdHIoaS5yZXN1bHQsNCkhPT1hLmhlYWRTdHIoZSw0KSYmKHQ9bi5DcmVkaXRDYXJkRGV0ZWN0b3IuZ2V0SW5mbyhlLGkuY3JlZGl0Q2FyZFN0cmljdE1vZGUpLGkuYmxvY2tzPXQuYmxvY2tzLGkuYmxvY2tzTGVuZ3RoPWkuYmxvY2tzLmxlbmd0aCxpLm1heExlbmd0aD1hLmdldE1heExlbmd0aChpLmJsb2NrcyksaS5jcmVkaXRDYXJkVHlwZSE9PXQudHlwZSYmKGkuY3JlZGl0Q2FyZFR5cGU9dC50eXBlLGkub25DcmVkaXRDYXJkVHlwZUNoYW5nZWQuY2FsbChyLGkuY3JlZGl0Q2FyZFR5cGUpKSl9LHVwZGF0ZVZhbHVlU3RhdGU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3JldHVybiBlLmlzQW5kcm9pZD92b2lkIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZS5lbGVtZW50LnZhbHVlPWUucHJvcGVydGllcy5yZXN1bHR9LDEpOnZvaWQoZS5lbGVtZW50LnZhbHVlPWUucHJvcGVydGllcy5yZXN1bHQpfSxzZXRQaG9uZVJlZ2lvbkNvZGU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPXQucHJvcGVydGllcztyLnBob25lUmVnaW9uQ29kZT1lLHQuaW5pdFBob25lRm9ybWF0dGVyKCksdC5vbkNoYW5nZSgpfSxzZXRSYXdWYWx1ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzO2U9dm9pZCAwIT09ZSYmbnVsbCE9PWU/ZS50b1N0cmluZygpOlwiXCIsci5udW1lcmFsJiYoZT1lLnJlcGxhY2UoXCIuXCIsci5udW1lcmFsRGVjaW1hbE1hcmspKSx0LmVsZW1lbnQudmFsdWU9ZSx0Lm9uSW5wdXQoZSl9LGdldFJhd1ZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllcyxyPW4uVXRpbCxpPWUuZWxlbWVudC52YWx1ZTtyZXR1cm4gdC5yYXdWYWx1ZVRyaW1QcmVmaXgmJihpPXIuZ2V0UHJlZml4U3RyaXBwZWRWYWx1ZShpLHQucHJlZml4LHQucHJlZml4TGVuZ3RoKSksaT10Lm51bWVyYWw/dC5udW1lcmFsRm9ybWF0dGVyLmdldFJhd1ZhbHVlKGkpOnIuc3RyaXBEZWxpbWl0ZXJzKGksdC5kZWxpbWl0ZXIsdC5kZWxpbWl0ZXJzKX0sZ2V0Rm9ybWF0dGVkVmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbGVtZW50LnZhbHVlfSxkZXN0cm95OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsZS5vbkNoYW5nZUxpc3RlbmVyKSxlLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIixlLm9uS2V5RG93bkxpc3RlbmVyKSxlLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImN1dFwiLGUub25DdXRMaXN0ZW5lciksZS5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsZS5vbkNvcHlMaXN0ZW5lcil9LHRvU3RyaW5nOmZ1bmN0aW9uKCl7cmV0dXJuXCJbQ2xlYXZlIE9iamVjdF1cIn19LG4uTnVtZXJhbEZvcm1hdHRlcj1yKDEpLG4uRGF0ZUZvcm1hdHRlcj1yKDIpLG4uUGhvbmVGb3JtYXR0ZXI9cigzKSxuLkNyZWRpdENhcmREZXRlY3Rvcj1yKDQpLG4uVXRpbD1yKDUpLG4uRGVmYXVsdFByb3BlcnRpZXM9cig2KSwoXCJvYmplY3RcIj09dHlwZW9mIHQmJnQ/dDp3aW5kb3cpLkNsZWF2ZT1uLGUuZXhwb3J0cz1ufSkuY2FsbCh0LGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO3ZhciByPWZ1bmN0aW9uKGUsdCxuLGksYSxvKXt2YXIgbD10aGlzO2wubnVtZXJhbERlY2ltYWxNYXJrPWV8fFwiLlwiLGwubnVtZXJhbEludGVnZXJTY2FsZT10Pj0wP3Q6MTAsbC5udW1lcmFsRGVjaW1hbFNjYWxlPW4+PTA/bjoyLGwubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGU9aXx8ci5ncm91cFN0eWxlLnRob3VzYW5kLGwubnVtZXJhbFBvc2l0aXZlT25seT0hIWEsbC5kZWxpbWl0ZXI9b3x8XCJcIj09PW8/bzpcIixcIixsLmRlbGltaXRlclJFPW8/bmV3IFJlZ0V4cChcIlxcXFxcIitvLFwiZ1wiKTpcIlwifTtyLmdyb3VwU3R5bGU9e3Rob3VzYW5kOlwidGhvdXNhbmRcIixsYWtoOlwibGFraFwiLHdhbjpcIndhblwifSxyLnByb3RvdHlwZT17Z2V0UmF3VmFsdWU6ZnVuY3Rpb24oZSl7cmV0dXJuIGUucmVwbGFjZSh0aGlzLmRlbGltaXRlclJFLFwiXCIpLnJlcGxhY2UodGhpcy5udW1lcmFsRGVjaW1hbE1hcmssXCIuXCIpfSxmb3JtYXQ6ZnVuY3Rpb24oZSl7dmFyIHQsbixpPXRoaXMsYT1cIlwiO3N3aXRjaChlPWUucmVwbGFjZSgvW0EtWmEtel0vZyxcIlwiKS5yZXBsYWNlKGkubnVtZXJhbERlY2ltYWxNYXJrLFwiTVwiKS5yZXBsYWNlKC9bXlxcZE0tXS9nLFwiXCIpLnJlcGxhY2UoL15cXC0vLFwiTlwiKS5yZXBsYWNlKC9cXC0vZyxcIlwiKS5yZXBsYWNlKFwiTlwiLGkubnVtZXJhbFBvc2l0aXZlT25seT9cIlwiOlwiLVwiKS5yZXBsYWNlKFwiTVwiLGkubnVtZXJhbERlY2ltYWxNYXJrKS5yZXBsYWNlKC9eKC0pPzArKD89XFxkKS8sXCIkMVwiKSxuPWUsZS5pbmRleE9mKGkubnVtZXJhbERlY2ltYWxNYXJrKT49MCYmKHQ9ZS5zcGxpdChpLm51bWVyYWxEZWNpbWFsTWFyayksbj10WzBdLGE9aS5udW1lcmFsRGVjaW1hbE1hcmsrdFsxXS5zbGljZSgwLGkubnVtZXJhbERlY2ltYWxTY2FsZSkpLGkubnVtZXJhbEludGVnZXJTY2FsZT4wJiYobj1uLnNsaWNlKDAsaS5udW1lcmFsSW50ZWdlclNjYWxlKyhcIi1cIj09PWUuc2xpY2UoMCwxKT8xOjApKSksaS5udW1lcmFsVGhvdXNhbmRzR3JvdXBTdHlsZSl7Y2FzZSByLmdyb3VwU3R5bGUubGFraDpuPW4ucmVwbGFjZSgvKFxcZCkoPz0oXFxkXFxkKStcXGQkKS9nLFwiJDFcIitpLmRlbGltaXRlcik7YnJlYWs7Y2FzZSByLmdyb3VwU3R5bGUud2FuOm49bi5yZXBsYWNlKC8oXFxkKSg/PShcXGR7NH0pKyQpL2csXCIkMVwiK2kuZGVsaW1pdGVyKTticmVhaztkZWZhdWx0Om49bi5yZXBsYWNlKC8oXFxkKSg/PShcXGR7M30pKyQpL2csXCIkMVwiK2kuZGVsaW1pdGVyKX1yZXR1cm4gbi50b1N0cmluZygpKyhpLm51bWVyYWxEZWNpbWFsU2NhbGU+MD9hLnRvU3RyaW5nKCk6XCJcIil9fSxlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj1mdW5jdGlvbihlKXt2YXIgdD10aGlzO3QuYmxvY2tzPVtdLHQuZGF0ZVBhdHRlcm49ZSx0LmluaXRCbG9ja3MoKX07ci5wcm90b3R5cGU9e2luaXRCbG9ja3M6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2UuZGF0ZVBhdHRlcm4uZm9yRWFjaChmdW5jdGlvbih0KXtcIllcIj09PXQ/ZS5ibG9ja3MucHVzaCg0KTplLmJsb2Nrcy5wdXNoKDIpfSl9LGdldEJsb2NrczpmdW5jdGlvbigpe3JldHVybiB0aGlzLmJsb2Nrc30sZ2V0VmFsaWRhdGVkRGF0ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9XCJcIjtyZXR1cm4gZT1lLnJlcGxhY2UoL1teXFxkXS9nLFwiXCIpLHQuYmxvY2tzLmZvckVhY2goZnVuY3Rpb24obixpKXtpZihlLmxlbmd0aD4wKXt2YXIgYT1lLnNsaWNlKDAsbiksbz1hLnNsaWNlKDAsMSksbD1lLnNsaWNlKG4pO3N3aXRjaCh0LmRhdGVQYXR0ZXJuW2ldKXtjYXNlXCJkXCI6XCIwMFwiPT09YT9hPVwiMDFcIjpwYXJzZUludChvLDEwKT4zP2E9XCIwXCIrbzpwYXJzZUludChhLDEwKT4zMSYmKGE9XCIzMVwiKTticmVhaztjYXNlXCJtXCI6XCIwMFwiPT09YT9hPVwiMDFcIjpwYXJzZUludChvLDEwKT4xP2E9XCIwXCIrbzpwYXJzZUludChhLDEwKT4xMiYmKGE9XCIxMlwiKX1yKz1hLGU9bH19KSxyfX0sZS5leHBvcnRzPXJ9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZnVuY3Rpb24oZSx0KXt2YXIgcj10aGlzO3IuZGVsaW1pdGVyPXR8fFwiXCI9PT10P3Q6XCIgXCIsci5kZWxpbWl0ZXJSRT10P25ldyBSZWdFeHAoXCJcXFxcXCIrdCxcImdcIik6XCJcIixyLmZvcm1hdHRlcj1lfTtyLnByb3RvdHlwZT17c2V0Rm9ybWF0dGVyOmZ1bmN0aW9uKGUpe3RoaXMuZm9ybWF0dGVyPWV9LGZvcm1hdDpmdW5jdGlvbihlKXt2YXIgdD10aGlzO3QuZm9ybWF0dGVyLmNsZWFyKCksZT1lLnJlcGxhY2UoL1teXFxkK10vZyxcIlwiKSxlPWUucmVwbGFjZSh0LmRlbGltaXRlclJFLFwiXCIpO2Zvcih2YXIgcixuPVwiXCIsaT0hMSxhPTAsbz1lLmxlbmd0aDtvPmE7YSsrKXI9dC5mb3JtYXR0ZXIuaW5wdXREaWdpdChlLmNoYXJBdChhKSksL1tcXHMoKS1dL2cudGVzdChyKT8obj1yLGk9ITApOml8fChuPXIpO3JldHVybiBuPW4ucmVwbGFjZSgvWygpXS9nLFwiXCIpLG49bi5yZXBsYWNlKC9bXFxzLV0vZyx0LmRlbGltaXRlcil9fSxlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj17YmxvY2tzOnt1YXRwOls0LDUsNl0sYW1leDpbNCw2LDVdLGRpbmVyczpbNCw2LDRdLGRpc2NvdmVyOls0LDQsNCw0XSxtYXN0ZXJjYXJkOls0LDQsNCw0XSxkYW5rb3J0Ols0LDQsNCw0XSxpbnN0YXBheW1lbnQ6WzQsNCw0LDRdLGpjYjpbNCw0LDQsNF0sbWFlc3RybzpbNCw0LDQsNF0sdmlzYTpbNCw0LDQsNF0sZ2VuZXJhbDpbNCw0LDQsNF0sZ2VuZXJhbFN0cmljdDpbNCw0LDQsN119LHJlOnt1YXRwOi9eKD8hMTgwMCkxXFxkezAsMTR9LyxhbWV4Oi9eM1s0N11cXGR7MCwxM30vLGRpc2NvdmVyOi9eKD86NjAxMXw2NVxcZHswLDJ9fDY0WzQtOV1cXGQ/KVxcZHswLDEyfS8sZGluZXJzOi9eMyg/OjAoWzAtNV18OSl8WzY4OV1cXGQ/KVxcZHswLDExfS8sbWFzdGVyY2FyZDovXig1WzEtNV18MlsyLTddKVxcZHswLDE0fS8sZGFua29ydDovXig1MDE5fDQxNzV8NDU3MSlcXGR7MCwxMn0vLGluc3RhcGF5bWVudDovXjYzWzctOV1cXGR7MCwxM30vLGpjYjovXig/OjIxMzF8MTgwMHwzNVxcZHswLDJ9KVxcZHswLDEyfS8sbWFlc3RybzovXig/OjVbMDY3OF1cXGR7MCwyfXw2MzA0fDY3XFxkezAsMn0pXFxkezAsMTJ9Lyx2aXNhOi9eNFxcZHswLDE1fS99LGdldEluZm86ZnVuY3Rpb24oZSx0KXt2YXIgbj1yLmJsb2NrcyxpPXIucmU7cmV0dXJuIHQ9ISF0LGkuYW1leC50ZXN0KGUpP3t0eXBlOlwiYW1leFwiLGJsb2NrczpuLmFtZXh9OmkudWF0cC50ZXN0KGUpP3t0eXBlOlwidWF0cFwiLGJsb2NrczpuLnVhdHB9OmkuZGluZXJzLnRlc3QoZSk/e3R5cGU6XCJkaW5lcnNcIixibG9ja3M6bi5kaW5lcnN9OmkuZGlzY292ZXIudGVzdChlKT97dHlwZTpcImRpc2NvdmVyXCIsYmxvY2tzOnQ/bi5nZW5lcmFsU3RyaWN0Om4uZGlzY292ZXJ9OmkubWFzdGVyY2FyZC50ZXN0KGUpP3t0eXBlOlwibWFzdGVyY2FyZFwiLGJsb2NrczpuLm1hc3RlcmNhcmR9OmkuZGFua29ydC50ZXN0KGUpP3t0eXBlOlwiZGFua29ydFwiLGJsb2NrczpuLmRhbmtvcnR9OmkuaW5zdGFwYXltZW50LnRlc3QoZSk/e3R5cGU6XCJpbnN0YXBheW1lbnRcIixibG9ja3M6bi5pbnN0YXBheW1lbnR9OmkuamNiLnRlc3QoZSk/e3R5cGU6XCJqY2JcIixibG9ja3M6bi5qY2J9OmkubWFlc3Ryby50ZXN0KGUpP3t0eXBlOlwibWFlc3Ryb1wiLGJsb2Nrczp0P24uZ2VuZXJhbFN0cmljdDpuLm1hZXN0cm99OmkudmlzYS50ZXN0KGUpP3t0eXBlOlwidmlzYVwiLGJsb2Nrczp0P24uZ2VuZXJhbFN0cmljdDpuLnZpc2F9Ont0eXBlOlwidW5rbm93blwiLGJsb2Nrczp0P24uZ2VuZXJhbFN0cmljdDpuLmdlbmVyYWx9fX07ZS5leHBvcnRzPXJ9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9e25vb3A6ZnVuY3Rpb24oKXt9LHN0cmlwOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUucmVwbGFjZSh0LFwiXCIpfSxpc0RlbGltaXRlcjpmdW5jdGlvbihlLHQscil7cmV0dXJuIDA9PT1yLmxlbmd0aD9lPT09dDpyLnNvbWUoZnVuY3Rpb24odCl7cmV0dXJuIGU9PT10PyEwOnZvaWQgMH0pfSxnZXREZWxpbWl0ZXJSRUJ5RGVsaW1pdGVyOmZ1bmN0aW9uKGUpe3JldHVybiBuZXcgUmVnRXhwKGUucmVwbGFjZSgvKFsuPyorXiRbXFxdXFxcXCgpe318LV0pL2csXCJcXFxcJDFcIiksXCJnXCIpfSxzdHJpcERlbGltaXRlcnM6ZnVuY3Rpb24oZSx0LHIpe3ZhciBuPXRoaXM7aWYoMD09PXIubGVuZ3RoKXt2YXIgaT10P24uZ2V0RGVsaW1pdGVyUkVCeURlbGltaXRlcih0KTpcIlwiO3JldHVybiBlLnJlcGxhY2UoaSxcIlwiKX1yZXR1cm4gci5mb3JFYWNoKGZ1bmN0aW9uKHQpe2U9ZS5yZXBsYWNlKG4uZ2V0RGVsaW1pdGVyUkVCeURlbGltaXRlcih0KSxcIlwiKX0pLGV9LGhlYWRTdHI6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5zbGljZSgwLHQpfSxnZXRNYXhMZW5ndGg6ZnVuY3Rpb24oZSl7cmV0dXJuIGUucmVkdWNlKGZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUrdH0sMCl9LGdldFByZWZpeFN0cmlwcGVkVmFsdWU6ZnVuY3Rpb24oZSx0LHIpe2lmKGUuc2xpY2UoMCxyKSE9PXQpe3ZhciBuPXRoaXMuZ2V0Rmlyc3REaWZmSW5kZXgodCxlLnNsaWNlKDAscikpO2U9dCtlLnNsaWNlKG4sbisxKStlLnNsaWNlKHIrMSl9cmV0dXJuIGUuc2xpY2Uocil9LGdldEZpcnN0RGlmZkluZGV4OmZ1bmN0aW9uKGUsdCl7Zm9yKHZhciByPTA7ZS5jaGFyQXQocik9PT10LmNoYXJBdChyKTspaWYoXCJcIj09PWUuY2hhckF0KHIrKykpcmV0dXJuLTE7cmV0dXJuIHJ9LGdldEZvcm1hdHRlZFZhbHVlOmZ1bmN0aW9uKGUsdCxyLG4saSl7dmFyIGEsbz1cIlwiLGw9aS5sZW5ndGg+MDtyZXR1cm4gMD09PXI/ZToodC5mb3JFYWNoKGZ1bmN0aW9uKHQscyl7aWYoZS5sZW5ndGg+MCl7dmFyIGM9ZS5zbGljZSgwLHQpLHU9ZS5zbGljZSh0KTtvKz1jLGE9bD9pW3NdfHxhOm4sYy5sZW5ndGg9PT10JiZyLTE+cyYmKG8rPWEpLGU9dX19KSxvKX0saXNBbmRyb2lkOmZ1bmN0aW9uKCl7cmV0dXJuISghbmF2aWdhdG9yfHwhL2FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKX0saXNBbmRyb2lkQmFja3NwYWNlS2V5ZG93bjpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmlzQW5kcm9pZCgpP3Q9PT1lLnNsaWNlKDAsLTEpOiExfX07ZS5leHBvcnRzPXJ9LGZ1bmN0aW9uKGUsdCl7KGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciByPXthc3NpZ246ZnVuY3Rpb24oZSxyKXtyZXR1cm4gZT1lfHx7fSxyPXJ8fHt9LGUuY3JlZGl0Q2FyZD0hIXIuY3JlZGl0Q2FyZCxlLmNyZWRpdENhcmRTdHJpY3RNb2RlPSEhci5jcmVkaXRDYXJkU3RyaWN0TW9kZSxlLmNyZWRpdENhcmRUeXBlPVwiXCIsZS5vbkNyZWRpdENhcmRUeXBlQ2hhbmdlZD1yLm9uQ3JlZGl0Q2FyZFR5cGVDaGFuZ2VkfHxmdW5jdGlvbigpe30sZS5waG9uZT0hIXIucGhvbmUsZS5waG9uZVJlZ2lvbkNvZGU9ci5waG9uZVJlZ2lvbkNvZGV8fFwiQVVcIixlLnBob25lRm9ybWF0dGVyPXt9LGUuZGF0ZT0hIXIuZGF0ZSxlLmRhdGVQYXR0ZXJuPXIuZGF0ZVBhdHRlcm58fFtcImRcIixcIm1cIixcIllcIl0sZS5kYXRlRm9ybWF0dGVyPXt9LGUubnVtZXJhbD0hIXIubnVtZXJhbCxlLm51bWVyYWxJbnRlZ2VyU2NhbGU9ci5udW1lcmFsSW50ZWdlclNjYWxlPj0wP3IubnVtZXJhbEludGVnZXJTY2FsZToxMCxlLm51bWVyYWxEZWNpbWFsU2NhbGU9ci5udW1lcmFsRGVjaW1hbFNjYWxlPj0wP3IubnVtZXJhbERlY2ltYWxTY2FsZToyLGUubnVtZXJhbERlY2ltYWxNYXJrPXIubnVtZXJhbERlY2ltYWxNYXJrfHxcIi5cIixlLm51bWVyYWxUaG91c2FuZHNHcm91cFN0eWxlPXIubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGV8fFwidGhvdXNhbmRcIixlLm51bWVyYWxQb3NpdGl2ZU9ubHk9ISFyLm51bWVyYWxQb3NpdGl2ZU9ubHksZS5udW1lcmljT25seT1lLmNyZWRpdENhcmR8fGUuZGF0ZXx8ISFyLm51bWVyaWNPbmx5LGUudXBwZXJjYXNlPSEhci51cHBlcmNhc2UsZS5sb3dlcmNhc2U9ISFyLmxvd2VyY2FzZSxlLnByZWZpeD1lLmNyZWRpdENhcmR8fGUucGhvbmV8fGUuZGF0ZT9cIlwiOnIucHJlZml4fHxcIlwiLGUucHJlZml4TGVuZ3RoPWUucHJlZml4Lmxlbmd0aCxlLnJhd1ZhbHVlVHJpbVByZWZpeD0hIXIucmF3VmFsdWVUcmltUHJlZml4LGUuY29weURlbGltaXRlcj0hIXIuY29weURlbGltaXRlcixlLmluaXRWYWx1ZT12b2lkIDA9PT1yLmluaXRWYWx1ZT9cIlwiOnIuaW5pdFZhbHVlLnRvU3RyaW5nKCksZS5kZWxpbWl0ZXI9ci5kZWxpbWl0ZXJ8fFwiXCI9PT1yLmRlbGltaXRlcj9yLmRlbGltaXRlcjpyLmRhdGU/XCIvXCI6ci5udW1lcmFsP1wiLFwiOihyLnBob25lLFwiIFwiKSxlLmRlbGltaXRlckxlbmd0aD1lLmRlbGltaXRlci5sZW5ndGgsZS5kZWxpbWl0ZXJzPXIuZGVsaW1pdGVyc3x8W10sZS5ibG9ja3M9ci5ibG9ja3N8fFtdLGUuYmxvY2tzTGVuZ3RoPWUuYmxvY2tzLmxlbmd0aCxlLnJvb3Q9XCJvYmplY3RcIj09dHlwZW9mIHQmJnQ/dDp3aW5kb3csZS5tYXhMZW5ndGg9MCxlLmJhY2tzcGFjZT0hMSxlLnJlc3VsdD1cIlwiLGV9fTtlLmV4cG9ydHM9cn0pLmNhbGwodCxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX1dKX0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2NsZWF2ZS5qcy9kaXN0L2NsZWF2ZS5taW4uanNcbi8vIG1vZHVsZSBpZCA9IDcwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIiFmdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxuKXt2YXIgZT10LnNwbGl0KFwiLlwiKSxyPUg7ZVswXWluIHJ8fCFyLmV4ZWNTY3JpcHR8fHIuZXhlY1NjcmlwdChcInZhciBcIitlWzBdKTtmb3IodmFyIGk7ZS5sZW5ndGgmJihpPWUuc2hpZnQoKSk7KWUubGVuZ3RofHx2b2lkIDA9PT1uP3I9cltpXT9yW2ldOnJbaV09e306cltpXT1ufWZ1bmN0aW9uIG4odCxuKXtmdW5jdGlvbiBlKCl7fWUucHJvdG90eXBlPW4ucHJvdG90eXBlLHQuTT1uLnByb3RvdHlwZSx0LnByb3RvdHlwZT1uZXcgZSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10LHQuTj1mdW5jdGlvbih0LGUscil7Zm9yKHZhciBpPUFycmF5KGFyZ3VtZW50cy5sZW5ndGgtMiksYT0yO2E8YXJndW1lbnRzLmxlbmd0aDthKyspaVthLTJdPWFyZ3VtZW50c1thXTtyZXR1cm4gbi5wcm90b3R5cGVbZV0uYXBwbHkodCxpKX19ZnVuY3Rpb24gZSh0LG4pe251bGwhPXQmJnRoaXMuYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gcih0KXt0LmI9XCJcIn1mdW5jdGlvbiBpKHQsbil7dC5zb3J0KG58fGEpfWZ1bmN0aW9uIGEodCxuKXtyZXR1cm4gdD5uPzE6bj50Py0xOjB9ZnVuY3Rpb24gbCh0KXt2YXIgbixlPVtdLHI9MDtmb3IobiBpbiB0KWVbcisrXT10W25dO3JldHVybiBlfWZ1bmN0aW9uIG8odCxuKXt0aGlzLmI9dCx0aGlzLmE9e307Zm9yKHZhciBlPTA7ZTxuLmxlbmd0aDtlKyspe3ZhciByPW5bZV07dGhpcy5hW3IuYl09cn19ZnVuY3Rpb24gdSh0KXtyZXR1cm4gdD1sKHQuYSksaSh0LGZ1bmN0aW9uKHQsbil7cmV0dXJuIHQuYi1uLmJ9KSx0fWZ1bmN0aW9uIHModCxuKXtzd2l0Y2godGhpcy5iPXQsdGhpcy5nPSEhbi5HLHRoaXMuYT1uLmMsdGhpcy5qPW4udHlwZSx0aGlzLmg9ITEsdGhpcy5hKXtjYXNlIHE6Y2FzZSBKOmNhc2UgTDpjYXNlIE86Y2FzZSBrOmNhc2UgWTpjYXNlIEs6dGhpcy5oPSEwfXRoaXMuZj1uLmRlZmF1bHRWYWx1ZX1mdW5jdGlvbiBmKCl7dGhpcy5hPXt9LHRoaXMuZj10aGlzLmkoKS5hLHRoaXMuYj10aGlzLmc9bnVsbH1mdW5jdGlvbiBwKHQsbil7Zm9yKHZhciBlPXUodC5pKCkpLHI9MDtyPGUubGVuZ3RoO3IrKyl7dmFyIGk9ZVtyXSxhPWkuYjtpZihudWxsIT1uLmFbYV0pe3QuYiYmZGVsZXRlIHQuYltpLmJdO3ZhciBsPTExPT1pLmF8fDEwPT1pLmE7aWYoaS5nKWZvcih2YXIgaT1jKG4sYSl8fFtdLG89MDtvPGkubGVuZ3RoO28rKyl7dmFyIHM9dCxmPWEsaD1sP2lbb10uY2xvbmUoKTppW29dO3MuYVtmXXx8KHMuYVtmXT1bXSkscy5hW2ZdLnB1c2goaCkscy5iJiZkZWxldGUgcy5iW2ZdfWVsc2UgaT1jKG4sYSksbD8obD1jKHQsYSkpP3AobCxpKTptKHQsYSxpLmNsb25lKCkpOm0odCxhLGkpfX19ZnVuY3Rpb24gYyh0LG4pe3ZhciBlPXQuYVtuXTtpZihudWxsPT1lKXJldHVybiBudWxsO2lmKHQuZyl7aWYoIShuIGluIHQuYikpe3ZhciByPXQuZyxpPXQuZltuXTtpZihudWxsIT1lKWlmKGkuZyl7Zm9yKHZhciBhPVtdLGw9MDtsPGUubGVuZ3RoO2wrKylhW2xdPXIuYihpLGVbbF0pO2U9YX1lbHNlIGU9ci5iKGksZSk7cmV0dXJuIHQuYltuXT1lfXJldHVybiB0LmJbbl19cmV0dXJuIGV9ZnVuY3Rpb24gaCh0LG4sZSl7dmFyIHI9Yyh0LG4pO3JldHVybiB0LmZbbl0uZz9yW2V8fDBdOnJ9ZnVuY3Rpb24gZyh0LG4pe3ZhciBlO2lmKG51bGwhPXQuYVtuXSllPWgodCxuLHZvaWQgMCk7ZWxzZSB0OntpZihlPXQuZltuXSx2b2lkIDA9PT1lLmYpe3ZhciByPWUuajtpZihyPT09Qm9vbGVhbillLmY9ITE7ZWxzZSBpZihyPT09TnVtYmVyKWUuZj0wO2Vsc2V7aWYociE9PVN0cmluZyl7ZT1uZXcgcjticmVhayB0fWUuZj1lLmg/XCIwXCI6XCJcIn19ZT1lLmZ9cmV0dXJuIGV9ZnVuY3Rpb24gYih0LG4pe3JldHVybiB0LmZbbl0uZz9udWxsIT10LmFbbl0/dC5hW25dLmxlbmd0aDowOm51bGwhPXQuYVtuXT8xOjB9ZnVuY3Rpb24gbSh0LG4sZSl7dC5hW25dPWUsdC5iJiYodC5iW25dPWUpfWZ1bmN0aW9uIHkodCxuKXt2YXIgZSxyPVtdO2ZvcihlIGluIG4pMCE9ZSYmci5wdXNoKG5ldyBzKGUsbltlXSkpO3JldHVybiBuZXcgbyh0LHIpfS8qXG5cbiBQcm90b2NvbCBCdWZmZXIgMiBDb3B5cmlnaHQgMjAwOCBHb29nbGUgSW5jLlxuIEFsbCBvdGhlciBjb2RlIGNvcHlyaWdodCBpdHMgcmVzcGVjdGl2ZSBvd25lcnMuXG4gQ29weXJpZ2h0IChDKSAyMDEwIFRoZSBMaWJwaG9uZW51bWJlciBBdXRob3JzXG5cbiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG4gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuZnVuY3Rpb24gdigpe2YuY2FsbCh0aGlzKX1mdW5jdGlvbiBkKCl7Zi5jYWxsKHRoaXMpfWZ1bmN0aW9uIF8oKXtmLmNhbGwodGhpcyl9ZnVuY3Rpb24gUygpe31mdW5jdGlvbiB3KCl7fWZ1bmN0aW9uIEEoKXt9LypcblxuIENvcHlyaWdodCAoQykgMjAxMCBUaGUgTGlicGhvbmVudW1iZXIgQXV0aG9ycy5cblxuIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5mdW5jdGlvbiB4KCl7dGhpcy5hPXt9fWZ1bmN0aW9uIE4odCxuKXtpZihudWxsPT1uKXJldHVybiBudWxsO249bi50b1VwcGVyQ2FzZSgpO3ZhciBlPXQuYVtuXTtpZihudWxsPT1lKXtpZihlPXR0W25dLG51bGw9PWUpcmV0dXJuIG51bGw7ZT0obmV3IEEpLmEoXy5pKCksZSksdC5hW25dPWV9cmV0dXJuIGV9ZnVuY3Rpb24gaih0KXtyZXR1cm4gdD1XW3RdLG51bGw9PXQ/XCJaWlwiOnRbMF19ZnVuY3Rpb24gJCh0KXt0aGlzLkg9UmVnRXhwKFwi4oCIXCIpLHRoaXMuQj1cIlwiLHRoaXMubT1uZXcgZSx0aGlzLnY9XCJcIix0aGlzLmg9bmV3IGUsdGhpcy51PW5ldyBlLHRoaXMuaj0hMCx0aGlzLnc9dGhpcy5vPXRoaXMuRD0hMSx0aGlzLkY9eC5iKCksdGhpcy5zPTAsdGhpcy5iPW5ldyBlLHRoaXMuQT0hMSx0aGlzLmw9XCJcIix0aGlzLmE9bmV3IGUsdGhpcy5mPVtdLHRoaXMuQz10LHRoaXMuSj10aGlzLmc9Qyh0aGlzLHRoaXMuQyl9ZnVuY3Rpb24gQyh0LG4pe3ZhciBlO2lmKG51bGwhPW4mJmlzTmFOKG4pJiZuLnRvVXBwZXJDYXNlKClpbiB0dCl7aWYoZT1OKHQuRixuKSxudWxsPT1lKXRocm93XCJJbnZhbGlkIHJlZ2lvbiBjb2RlOiBcIituO2U9ZyhlLDEwKX1lbHNlIGU9MDtyZXR1cm4gZT1OKHQuRixqKGUpKSxudWxsIT1lP2U6YXR9ZnVuY3Rpb24gQih0KXtmb3IodmFyIG49dC5mLmxlbmd0aCxlPTA7bj5lOysrZSl7dmFyIGk9dC5mW2VdLGE9ZyhpLDEpO2lmKHQudj09YSlyZXR1cm4hMTt2YXIgbDtsPXQ7dmFyIG89aSx1PWcobywxKTtpZigtMSE9dS5pbmRleE9mKFwifFwiKSlsPSExO2Vsc2V7dT11LnJlcGxhY2UobHQsXCJcXFxcZFwiKSx1PXUucmVwbGFjZShvdCxcIlxcXFxkXCIpLHIobC5tKTt2YXIgcztzPWw7dmFyIG89ZyhvLDIpLGY9XCI5OTk5OTk5OTk5OTk5OTlcIi5tYXRjaCh1KVswXTtmLmxlbmd0aDxzLmEuYi5sZW5ndGg/cz1cIlwiOihzPWYucmVwbGFjZShuZXcgUmVnRXhwKHUsXCJnXCIpLG8pLHM9cy5yZXBsYWNlKFJlZ0V4cChcIjlcIixcImdcIiksXCLigIhcIikpLDA8cy5sZW5ndGg/KGwubS5hKHMpLGw9ITApOmw9ITF9aWYobClyZXR1cm4gdC52PWEsdC5BPXN0LnRlc3QoaChpLDQpKSx0LnM9MCwhMH1yZXR1cm4gdC5qPSExfWZ1bmN0aW9uIEUodCxuKXtmb3IodmFyIGU9W10scj1uLmxlbmd0aC0zLGk9dC5mLmxlbmd0aCxhPTA7aT5hOysrYSl7dmFyIGw9dC5mW2FdOzA9PWIobCwzKT9lLnB1c2godC5mW2FdKToobD1oKGwsMyxNYXRoLm1pbihyLGIobCwzKS0xKSksMD09bi5zZWFyY2gobCkmJmUucHVzaCh0LmZbYV0pKX10LmY9ZX1mdW5jdGlvbiBSKHQsbil7dC5oLmEobik7dmFyIGU9bjtpZihydC50ZXN0KGUpfHwxPT10LmguYi5sZW5ndGgmJmV0LnRlc3QoZSkpe3ZhciBpLGU9bjtcIitcIj09ZT8oaT1lLHQudS5hKGUpKTooaT1udFtlXSx0LnUuYShpKSx0LmEuYShpKSksbj1pfWVsc2UgdC5qPSExLHQuRD0hMDtpZighdC5qKXtpZighdC5EKWlmKFYodCkpe2lmKFAodCkpcmV0dXJuIEQodCl9ZWxzZSBpZigwPHQubC5sZW5ndGgmJihlPXQuYS50b1N0cmluZygpLHIodC5hKSx0LmEuYSh0LmwpLHQuYS5hKGUpLGU9dC5iLnRvU3RyaW5nKCksaT1lLmxhc3RJbmRleE9mKHQubCkscih0LmIpLHQuYi5hKGUuc3Vic3RyaW5nKDAsaSkpKSx0LmwhPVUodCkpcmV0dXJuIHQuYi5hKFwiIFwiKSxEKHQpO3JldHVybiB0LmgudG9TdHJpbmcoKX1zd2l0Y2godC51LmIubGVuZ3RoKXtjYXNlIDA6Y2FzZSAxOmNhc2UgMjpyZXR1cm4gdC5oLnRvU3RyaW5nKCk7Y2FzZSAzOmlmKCFWKHQpKXJldHVybiB0Lmw9VSh0KSxGKHQpO3Qudz0hMDtkZWZhdWx0OnJldHVybiB0Lnc/KFAodCkmJih0Lnc9ITEpLHQuYi50b1N0cmluZygpK3QuYS50b1N0cmluZygpKTowPHQuZi5sZW5ndGg/KGU9VCh0LG4pLGk9SSh0KSwwPGkubGVuZ3RoP2k6KEUodCx0LmEudG9TdHJpbmcoKSksQih0KT9HKHQpOnQuaj9NKHQsZSk6dC5oLnRvU3RyaW5nKCkpKTpGKHQpfX1mdW5jdGlvbiBEKHQpe3JldHVybiB0Lmo9ITAsdC53PSExLHQuZj1bXSx0LnM9MCxyKHQubSksdC52PVwiXCIsRih0KX1mdW5jdGlvbiBJKHQpe2Zvcih2YXIgbj10LmEudG9TdHJpbmcoKSxlPXQuZi5sZW5ndGgscj0wO2U+cjsrK3Ipe3ZhciBpPXQuZltyXSxhPWcoaSwxKTtpZihuZXcgUmVnRXhwKFwiXig/OlwiK2ErXCIpJFwiKS50ZXN0KG4pKXJldHVybiB0LkE9c3QudGVzdChoKGksNCkpLG49bi5yZXBsYWNlKG5ldyBSZWdFeHAoYSxcImdcIiksaChpLDIpKSxNKHQsbil9cmV0dXJuXCJcIn1mdW5jdGlvbiBNKHQsbil7dmFyIGU9dC5iLmIubGVuZ3RoO3JldHVybiB0LkEmJmU+MCYmXCIgXCIhPXQuYi50b1N0cmluZygpLmNoYXJBdChlLTEpP3QuYitcIiBcIituOnQuYitufWZ1bmN0aW9uIEYodCl7dmFyIG49dC5hLnRvU3RyaW5nKCk7aWYoMzw9bi5sZW5ndGgpe2Zvcih2YXIgZT10Lm8mJjA8Yih0LmcsMjApP2ModC5nLDIwKXx8W106Yyh0LmcsMTkpfHxbXSxyPWUubGVuZ3RoLGk9MDtyPmk7KytpKXt2YXIgYSxsPWVbaV07KGE9bnVsbD09dC5nLmFbMTJdfHx0Lm98fGgobCw2KSl8fChhPWcobCw0KSxhPTA9PWEubGVuZ3RofHxpdC50ZXN0KGEpKSxhJiZ1dC50ZXN0KGcobCwyKSkmJnQuZi5wdXNoKGwpfXJldHVybiBFKHQsbiksbj1JKHQpLDA8bi5sZW5ndGg/bjpCKHQpP0codCk6dC5oLnRvU3RyaW5nKCl9cmV0dXJuIE0odCxuKX1mdW5jdGlvbiBHKHQpe3ZhciBuPXQuYS50b1N0cmluZygpLGU9bi5sZW5ndGg7aWYoZT4wKXtmb3IodmFyIHI9XCJcIixpPTA7ZT5pO2krKylyPVQodCxuLmNoYXJBdChpKSk7cmV0dXJuIHQuaj9NKHQscik6dC5oLnRvU3RyaW5nKCl9cmV0dXJuIHQuYi50b1N0cmluZygpfWZ1bmN0aW9uIFUodCl7dmFyIG4sZT10LmEudG9TdHJpbmcoKSxpPTA7cmV0dXJuIDEhPWgodC5nLDEwKT9uPSExOihuPXQuYS50b1N0cmluZygpLG49XCIxXCI9PW4uY2hhckF0KDApJiZcIjBcIiE9bi5jaGFyQXQoMSkmJlwiMVwiIT1uLmNoYXJBdCgxKSksbj8oaT0xLHQuYi5hKFwiMVwiKS5hKFwiIFwiKSx0Lm89ITApOm51bGwhPXQuZy5hWzE1XSYmKG49bmV3IFJlZ0V4cChcIl4oPzpcIitoKHQuZywxNSkrXCIpXCIpLG49ZS5tYXRjaChuKSxudWxsIT1uJiZudWxsIT1uWzBdJiYwPG5bMF0ubGVuZ3RoJiYodC5vPSEwLGk9blswXS5sZW5ndGgsdC5iLmEoZS5zdWJzdHJpbmcoMCxpKSkpKSxyKHQuYSksdC5hLmEoZS5zdWJzdHJpbmcoaSkpLGUuc3Vic3RyaW5nKDAsaSl9ZnVuY3Rpb24gVih0KXt2YXIgbj10LnUudG9TdHJpbmcoKSxlPW5ldyBSZWdFeHAoXCJeKD86XFxcXCt8XCIraCh0LmcsMTEpK1wiKVwiKSxlPW4ubWF0Y2goZSk7cmV0dXJuIG51bGwhPWUmJm51bGwhPWVbMF0mJjA8ZVswXS5sZW5ndGg/KHQubz0hMCxlPWVbMF0ubGVuZ3RoLHIodC5hKSx0LmEuYShuLnN1YnN0cmluZyhlKSkscih0LmIpLHQuYi5hKG4uc3Vic3RyaW5nKDAsZSkpLFwiK1wiIT1uLmNoYXJBdCgwKSYmdC5iLmEoXCIgXCIpLCEwKTohMX1mdW5jdGlvbiBQKHQpe2lmKDA9PXQuYS5iLmxlbmd0aClyZXR1cm4hMTt2YXIgbixpPW5ldyBlO3Q6e2lmKG49dC5hLnRvU3RyaW5nKCksMCE9bi5sZW5ndGgmJlwiMFwiIT1uLmNoYXJBdCgwKSlmb3IodmFyIGEsbD1uLmxlbmd0aCxvPTE7Mz49byYmbD49bzsrK28paWYoYT1wYXJzZUludChuLnN1YnN0cmluZygwLG8pLDEwKSxhIGluIFcpe2kuYShuLnN1YnN0cmluZyhvKSksbj1hO2JyZWFrIHR9bj0wfXJldHVybiAwPT1uPyExOihyKHQuYSksdC5hLmEoaS50b1N0cmluZygpKSxpPWoobiksXCIwMDFcIj09aT90Lmc9Tih0LkYsXCJcIituKTppIT10LkMmJih0Lmc9Qyh0LGkpKSx0LmIuYShcIlwiK24pLmEoXCIgXCIpLHQubD1cIlwiLCEwKX1mdW5jdGlvbiBUKHQsbil7dmFyIGU9dC5tLnRvU3RyaW5nKCk7aWYoMDw9ZS5zdWJzdHJpbmcodC5zKS5zZWFyY2godC5IKSl7dmFyIGk9ZS5zZWFyY2godC5IKSxlPWUucmVwbGFjZSh0Lkgsbik7cmV0dXJuIHIodC5tKSx0Lm0uYShlKSx0LnM9aSxlLnN1YnN0cmluZygwLHQucysxKX1yZXR1cm4gMT09dC5mLmxlbmd0aCYmKHQuaj0hMSksdC52PVwiXCIsdC5oLnRvU3RyaW5nKCl9dmFyIEg9dGhpcztlLnByb3RvdHlwZS5iPVwiXCIsZS5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYj1cIlwiK3R9LGUucHJvdG90eXBlLmE9ZnVuY3Rpb24odCxuLGUpe2lmKHRoaXMuYis9U3RyaW5nKHQpLG51bGwhPW4pZm9yKHZhciByPTE7cjxhcmd1bWVudHMubGVuZ3RoO3IrKyl0aGlzLmIrPWFyZ3VtZW50c1tyXTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ifTt2YXIgSz0xLFk9MixxPTMsSj00LEw9NixPPTE2LGs9MTg7Zi5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKHQsbil7bSh0aGlzLHQuYixuKX0sZi5wcm90b3R5cGUuY2xvbmU9ZnVuY3Rpb24oKXt2YXIgdD1uZXcgdGhpcy5jb25zdHJ1Y3RvcjtyZXR1cm4gdCE9dGhpcyYmKHQuYT17fSx0LmImJih0LmI9e30pLHAodCx0aGlzKSksdH07dmFyIFo7bih2LGYpO3ZhciB6O24oZCxmKTt2YXIgWDtuKF8sZiksdi5wcm90b3R5cGUuaT1mdW5jdGlvbigpe3JldHVybiBafHwoWj15KHYsezA6e25hbWU6XCJOdW1iZXJGb3JtYXRcIixJOlwiaTE4bi5waG9uZW51bWJlcnMuTnVtYmVyRm9ybWF0XCJ9LDE6e25hbWU6XCJwYXR0ZXJuXCIscmVxdWlyZWQ6ITAsYzo5LHR5cGU6U3RyaW5nfSwyOntuYW1lOlwiZm9ybWF0XCIscmVxdWlyZWQ6ITAsYzo5LHR5cGU6U3RyaW5nfSwzOntuYW1lOlwibGVhZGluZ19kaWdpdHNfcGF0dGVyblwiLEc6ITAsYzo5LHR5cGU6U3RyaW5nfSw0OntuYW1lOlwibmF0aW9uYWxfcHJlZml4X2Zvcm1hdHRpbmdfcnVsZVwiLGM6OSx0eXBlOlN0cmluZ30sNjp7bmFtZTpcIm5hdGlvbmFsX3ByZWZpeF9vcHRpb25hbF93aGVuX2Zvcm1hdHRpbmdcIixjOjgsdHlwZTpCb29sZWFufSw1OntuYW1lOlwiZG9tZXN0aWNfY2Fycmllcl9jb2RlX2Zvcm1hdHRpbmdfcnVsZVwiLGM6OSx0eXBlOlN0cmluZ319KSksWn0sdi5jdG9yPXYsdi5jdG9yLmk9di5wcm90b3R5cGUuaSxkLnByb3RvdHlwZS5pPWZ1bmN0aW9uKCl7cmV0dXJuIHp8fCh6PXkoZCx7MDp7bmFtZTpcIlBob25lTnVtYmVyRGVzY1wiLEk6XCJpMThuLnBob25lbnVtYmVycy5QaG9uZU51bWJlckRlc2NcIn0sMjp7bmFtZTpcIm5hdGlvbmFsX251bWJlcl9wYXR0ZXJuXCIsYzo5LHR5cGU6U3RyaW5nfSwzOntuYW1lOlwicG9zc2libGVfbnVtYmVyX3BhdHRlcm5cIixjOjksdHlwZTpTdHJpbmd9LDY6e25hbWU6XCJleGFtcGxlX251bWJlclwiLGM6OSx0eXBlOlN0cmluZ30sNzp7bmFtZTpcIm5hdGlvbmFsX251bWJlcl9tYXRjaGVyX2RhdGFcIixjOjEyLHR5cGU6U3RyaW5nfSw4OntuYW1lOlwicG9zc2libGVfbnVtYmVyX21hdGNoZXJfZGF0YVwiLGM6MTIsdHlwZTpTdHJpbmd9fSkpLHp9LGQuY3Rvcj1kLGQuY3Rvci5pPWQucHJvdG90eXBlLmksXy5wcm90b3R5cGUuaT1mdW5jdGlvbigpe3JldHVybiBYfHwoWD15KF8sezA6e25hbWU6XCJQaG9uZU1ldGFkYXRhXCIsSTpcImkxOG4ucGhvbmVudW1iZXJzLlBob25lTWV0YWRhdGFcIn0sMTp7bmFtZTpcImdlbmVyYWxfZGVzY1wiLGM6MTEsdHlwZTpkfSwyOntuYW1lOlwiZml4ZWRfbGluZVwiLGM6MTEsdHlwZTpkfSwzOntuYW1lOlwibW9iaWxlXCIsYzoxMSx0eXBlOmR9LDQ6e25hbWU6XCJ0b2xsX2ZyZWVcIixjOjExLHR5cGU6ZH0sNTp7bmFtZTpcInByZW1pdW1fcmF0ZVwiLGM6MTEsdHlwZTpkfSw2OntuYW1lOlwic2hhcmVkX2Nvc3RcIixjOjExLHR5cGU6ZH0sNzp7bmFtZTpcInBlcnNvbmFsX251bWJlclwiLGM6MTEsdHlwZTpkfSw4OntuYW1lOlwidm9pcFwiLGM6MTEsdHlwZTpkfSwyMTp7bmFtZTpcInBhZ2VyXCIsYzoxMSx0eXBlOmR9LDI1OntuYW1lOlwidWFuXCIsYzoxMSx0eXBlOmR9LDI3OntuYW1lOlwiZW1lcmdlbmN5XCIsYzoxMSx0eXBlOmR9LDI4OntuYW1lOlwidm9pY2VtYWlsXCIsYzoxMSx0eXBlOmR9LDI0OntuYW1lOlwibm9faW50ZXJuYXRpb25hbF9kaWFsbGluZ1wiLGM6MTEsdHlwZTpkfSw5OntuYW1lOlwiaWRcIixyZXF1aXJlZDohMCxjOjksdHlwZTpTdHJpbmd9LDEwOntuYW1lOlwiY291bnRyeV9jb2RlXCIsYzo1LHR5cGU6TnVtYmVyfSwxMTp7bmFtZTpcImludGVybmF0aW9uYWxfcHJlZml4XCIsYzo5LHR5cGU6U3RyaW5nfSwxNzp7bmFtZTpcInByZWZlcnJlZF9pbnRlcm5hdGlvbmFsX3ByZWZpeFwiLGM6OSx0eXBlOlN0cmluZ30sMTI6e25hbWU6XCJuYXRpb25hbF9wcmVmaXhcIixjOjksdHlwZTpTdHJpbmd9LDEzOntuYW1lOlwicHJlZmVycmVkX2V4dG5fcHJlZml4XCIsYzo5LHR5cGU6U3RyaW5nfSwxNTp7bmFtZTpcIm5hdGlvbmFsX3ByZWZpeF9mb3JfcGFyc2luZ1wiLGM6OSx0eXBlOlN0cmluZ30sMTY6e25hbWU6XCJuYXRpb25hbF9wcmVmaXhfdHJhbnNmb3JtX3J1bGVcIixjOjksdHlwZTpTdHJpbmd9LDE4OntuYW1lOlwic2FtZV9tb2JpbGVfYW5kX2ZpeGVkX2xpbmVfcGF0dGVyblwiLGM6OCxkZWZhdWx0VmFsdWU6ITEsdHlwZTpCb29sZWFufSwxOTp7bmFtZTpcIm51bWJlcl9mb3JtYXRcIixHOiEwLGM6MTEsdHlwZTp2fSwyMDp7bmFtZTpcImludGxfbnVtYmVyX2Zvcm1hdFwiLEc6ITAsYzoxMSx0eXBlOnZ9LDIyOntuYW1lOlwibWFpbl9jb3VudHJ5X2Zvcl9jb2RlXCIsYzo4LGRlZmF1bHRWYWx1ZTohMSx0eXBlOkJvb2xlYW59LDIzOntuYW1lOlwibGVhZGluZ19kaWdpdHNcIixjOjksdHlwZTpTdHJpbmd9LDI2OntuYW1lOlwibGVhZGluZ196ZXJvX3Bvc3NpYmxlXCIsYzo4LGRlZmF1bHRWYWx1ZTohMSx0eXBlOkJvb2xlYW59fSkpLFh9LF8uY3Rvcj1fLF8uY3Rvci5pPV8ucHJvdG90eXBlLmksUy5wcm90b3R5cGUuYT1mdW5jdGlvbih0KXt0aHJvdyBuZXcgdC5iLEVycm9yKFwiVW5pbXBsZW1lbnRlZFwiKX0sUy5wcm90b3R5cGUuYj1mdW5jdGlvbih0LG4pe2lmKDExPT10LmF8fDEwPT10LmEpcmV0dXJuIG4gaW5zdGFuY2VvZiBmP246dGhpcy5hKHQuai5wcm90b3R5cGUuaSgpLG4pO2lmKDE0PT10LmEpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBuJiZRLnRlc3Qobikpe3ZhciBlPU51bWJlcihuKTtpZihlPjApcmV0dXJuIGV9cmV0dXJuIG59aWYoIXQuaClyZXR1cm4gbjtpZihlPXQuaixlPT09U3RyaW5nKXtpZihcIm51bWJlclwiPT10eXBlb2YgbilyZXR1cm4gU3RyaW5nKG4pfWVsc2UgaWYoZT09PU51bWJlciYmXCJzdHJpbmdcIj09dHlwZW9mIG4mJihcIkluZmluaXR5XCI9PT1ufHxcIi1JbmZpbml0eVwiPT09bnx8XCJOYU5cIj09PW58fFEudGVzdChuKSkpcmV0dXJuIE51bWJlcihuKTtyZXR1cm4gbn07dmFyIFE9L14tP1swLTldKyQvO24odyxTKSx3LnByb3RvdHlwZS5hPWZ1bmN0aW9uKHQsbil7dmFyIGU9bmV3IHQuYjtyZXR1cm4gZS5nPXRoaXMsZS5hPW4sZS5iPXt9LGV9LG4oQSx3KSxBLnByb3RvdHlwZS5iPWZ1bmN0aW9uKHQsbil7cmV0dXJuIDg9PXQuYT8hIW46Uy5wcm90b3R5cGUuYi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LEEucHJvdG90eXBlLmE9ZnVuY3Rpb24odCxuKXtyZXR1cm4gQS5NLmEuY2FsbCh0aGlzLHQsbil9Oy8qXG5cbiBDb3B5cmlnaHQgKEMpIDIwMTAgVGhlIExpYnBob25lbnVtYmVyIEF1dGhvcnNcblxuIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG52YXIgVz17MTpcIlVTIEFHIEFJIEFTIEJCIEJNIEJTIENBIERNIERPIEdEIEdVIEpNIEtOIEtZIExDIE1QIE1TIFBSIFNYIFRDIFRUIFZDIFZHIFZJXCIuc3BsaXQoXCIgXCIpfSx0dD17VVM6W251bGwsW251bGwsbnVsbCxcIlsyLTldXFxcXGR7OX1cIixcIlxcXFxkezd9KD86XFxcXGR7M30pP1wiXSxbbnVsbCxudWxsLFwiKD86Mig/OjBbMS0zNS05XXwxWzAyLTldfDJbMDQ1ODldfDNbMTQ5XXw0WzA4XXw1WzEtNDZdfDZbMDI3OV18N1swMjZdfDhbMTNdKXwzKD86MFsxLTU3LTldfDFbMDItOV18MlswMTM1XXwzWzAxNDY3OV18NFs2N118NVsxMl18NlswMTRdfDhbMDU2XSl8NCg/OjBbMTI0LTldfDFbMDItNTc5XXwyWzMtNV18M1swMjQ1XXw0WzAyMzVdfDU4fDY5fDdbMDU4OV18OFswNF0pfDUoPzowWzEtNTctOV18MVswMjM1LThdfDIwfDNbMDE0OV18NFswMV18NVsxOV18NlsxLTM3XXw3WzAxMy01XXw4WzA1Nl0pfDYoPzowWzEtMzUtOV18MVswMjQtOV18MlswMzY4OV18M1swMTZdfDRbMTZdfDVbMDE3XXw2WzAtMjc5XXw3OHw4WzEyXSl8Nyg/OjBbMS00Ni04XXwxWzAyLTldfDJbMDQ1N118M1sxMjQ3XXw0WzAzN118NVs0N118NlswMjM1OV18N1swMi01OV18OFsxNTZdKXw4KD86MFsxLTY4XXwxWzAyLThdfDI4fDNbMC0yNV18NFszNTc4XXw1WzA0Ni05XXw2WzAyLTVdfDdbMDI4XSl8OSg/OjBbMTM0Ni05XXwxWzAyLTldfDJbMDU4OV18M1swMTY3OF18NFswMTc5XXw1WzEyNDY5XXw3WzAtMzU4OV18OFswNDU5XSkpWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7N30oPzpcXFxcZHszfSk/XCIsbnVsbCxudWxsLFwiMjAxNTU1NTU1NVwiXSxbbnVsbCxudWxsLFwiKD86Mig/OjBbMS0zNS05XXwxWzAyLTldfDJbMDQ1ODldfDNbMTQ5XXw0WzA4XXw1WzEtNDZdfDZbMDI3OV18N1swMjZdfDhbMTNdKXwzKD86MFsxLTU3LTldfDFbMDItOV18MlswMTM1XXwzWzAxNDY3OV18NFs2N118NVsxMl18NlswMTRdfDhbMDU2XSl8NCg/OjBbMTI0LTldfDFbMDItNTc5XXwyWzMtNV18M1swMjQ1XXw0WzAyMzVdfDU4fDY5fDdbMDU4OV18OFswNF0pfDUoPzowWzEtNTctOV18MVswMjM1LThdfDIwfDNbMDE0OV18NFswMV18NVsxOV18NlsxLTM3XXw3WzAxMy01XXw4WzA1Nl0pfDYoPzowWzEtMzUtOV18MVswMjQtOV18MlswMzY4OV18M1swMTZdfDRbMTZdfDVbMDE3XXw2WzAtMjc5XXw3OHw4WzEyXSl8Nyg/OjBbMS00Ni04XXwxWzAyLTldfDJbMDQ1N118M1sxMjQ3XXw0WzAzN118NVs0N118NlswMjM1OV18N1swMi01OV18OFsxNTZdKXw4KD86MFsxLTY4XXwxWzAyLThdfDI4fDNbMC0yNV18NFszNTc4XXw1WzA0Ni05XXw2WzAyLTVdfDdbMDI4XSl8OSg/OjBbMTM0Ni05XXwxWzAyLTldfDJbMDU4OV18M1swMTY3OF18NFswMTc5XXw1WzEyNDY5XXw3WzAtMzU4OV18OFswNDU5XSkpWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7N30oPzpcXFxcZHszfSk/XCIsbnVsbCxudWxsLFwiMjAxNTU1NTU1NVwiXSxbbnVsbCxudWxsLFwiOCg/OjAwfDQ0fDU1fDY2fDc3fDg4KVsyLTldXFxcXGR7Nn1cIixcIlxcXFxkezEwfVwiLG51bGwsbnVsbCxcIjgwMDIzNDU2NzhcIl0sW251bGwsbnVsbCxcIjkwMFsyLTldXFxcXGR7Nn1cIixcIlxcXFxkezEwfVwiLG51bGwsbnVsbCxcIjkwMDIzNDU2NzhcIl0sW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXSxbbnVsbCxudWxsLFwiNSg/OjAwfDMzfDQ0fDY2fDc3fDg4KVsyLTldXFxcXGR7Nn1cIixcIlxcXFxkezEwfVwiLG51bGwsbnVsbCxcIjUwMDIzNDU2NzhcIl0sW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXSxcIlVTXCIsMSxcIjAxMVwiLFwiMVwiLG51bGwsbnVsbCxcIjFcIixudWxsLG51bGwsMSxbW251bGwsXCIoXFxcXGR7M30pKFxcXFxkezR9KVwiLFwiJDEtJDJcIixudWxsLG51bGwsbnVsbCwxXSxbbnVsbCxcIihcXFxcZHszfSkoXFxcXGR7M30pKFxcXFxkezR9KVwiLFwiKCQxKSAkMi0kM1wiLG51bGwsbnVsbCxudWxsLDFdXSxbW251bGwsXCIoXFxcXGR7M30pKFxcXFxkezN9KShcXFxcZHs0fSlcIixcIiQxLSQyLSQzXCJdXSxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdLDEsbnVsbCxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl0sbnVsbCxudWxsLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl1dfTt4LmI9ZnVuY3Rpb24oKXtyZXR1cm4geC5hP3guYTp4LmE9bmV3IHh9O3ZhciBudD17MDpcIjBcIiwxOlwiMVwiLDI6XCIyXCIsMzpcIjNcIiw0OlwiNFwiLDU6XCI1XCIsNjpcIjZcIiw3OlwiN1wiLDg6XCI4XCIsOTpcIjlcIixcIu+8kFwiOlwiMFwiLFwi77yRXCI6XCIxXCIsXCLvvJJcIjpcIjJcIixcIu+8k1wiOlwiM1wiLFwi77yUXCI6XCI0XCIsXCLvvJVcIjpcIjVcIixcIu+8llwiOlwiNlwiLFwi77yXXCI6XCI3XCIsXCLvvJhcIjpcIjhcIixcIu+8mVwiOlwiOVwiLFwi2aBcIjpcIjBcIixcItmhXCI6XCIxXCIsXCLZolwiOlwiMlwiLFwi2aNcIjpcIjNcIixcItmkXCI6XCI0XCIsXCLZpVwiOlwiNVwiLFwi2aZcIjpcIjZcIixcItmnXCI6XCI3XCIsXCLZqFwiOlwiOFwiLFwi2alcIjpcIjlcIixcItuwXCI6XCIwXCIsXCLbsVwiOlwiMVwiLFwi27JcIjpcIjJcIixcItuzXCI6XCIzXCIsXCLbtFwiOlwiNFwiLFwi27VcIjpcIjVcIixcItu2XCI6XCI2XCIsXCLbt1wiOlwiN1wiLFwi27hcIjpcIjhcIixcItu5XCI6XCI5XCJ9LGV0PVJlZ0V4cChcIlsr77yLXStcIikscnQ9UmVnRXhwKFwiKFswLTnvvJAt77yZ2aAt2anbsC3buV0pXCIpLGl0PS9eXFwoP1xcJDFcXCk/JC8sYXQ9bmV3IF87bShhdCwxMSxcIk5BXCIpO3ZhciBsdD0vXFxbKFteXFxbXFxdXSkqXFxdL2csb3Q9L1xcZCg/PVteLH1dW14sfV0pL2csdXQ9UmVnRXhwKFwiXlsteOKAkC3igJXiiJLjg7zvvI0t77yPIMKgwq3igIvigaDjgIAoKe+8iO+8ie+8u++8vS5cXFxcW1xcXFxdL37igZPiiLzvvZ5dKihcXFxcJFxcXFxkWy144oCQLeKAleKIkuODvO+8jS3vvI8gwqDCreKAi+KBoOOAgCgp77yI77yJ77y777y9LlxcXFxbXFxcXF0vfuKBk+KIvO+9nl0qKSskXCIpLHN0PS9bLSBdLzskLnByb3RvdHlwZS5LPWZ1bmN0aW9uKCl7dGhpcy5CPVwiXCIscih0aGlzLmgpLHIodGhpcy51KSxyKHRoaXMubSksdGhpcy5zPTAsdGhpcy52PVwiXCIscih0aGlzLmIpLHRoaXMubD1cIlwiLHIodGhpcy5hKSx0aGlzLmo9ITAsdGhpcy53PXRoaXMubz10aGlzLkQ9ITEsdGhpcy5mPVtdLHRoaXMuQT0hMSx0aGlzLmchPXRoaXMuSiYmKHRoaXMuZz1DKHRoaXMsdGhpcy5DKSl9LCQucHJvdG90eXBlLkw9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuQj1SKHRoaXMsdCl9LHQoXCJDbGVhdmUuQXNZb3VUeXBlRm9ybWF0dGVyXCIsJCksdChcIkNsZWF2ZS5Bc1lvdVR5cGVGb3JtYXR0ZXIucHJvdG90eXBlLmlucHV0RGlnaXRcIiwkLnByb3RvdHlwZS5MKSx0KFwiQ2xlYXZlLkFzWW91VHlwZUZvcm1hdHRlci5wcm90b3R5cGUuY2xlYXJcIiwkLnByb3RvdHlwZS5LKX0uY2FsbChcIm9iamVjdFwiPT10eXBlb2YgZ2xvYmFsJiZnbG9iYWw/Z2xvYmFsOndpbmRvdyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY2xlYXZlLmpzL2Rpc3QvYWRkb25zL2NsZWF2ZS1waG9uZS51cy5qc1xuLy8gbW9kdWxlIGlkID0gNzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XCJzY3JlZW4tc21hbGxcIjozNzUsXCJzY3JlZW4tbWVkaXVtXCI6NzAwLFwic2NyZWVuLWxhcmdlXCI6MTAyNCxcInNjcmVlbi14bGFyZ2VcIjoxMjAwfVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3ZhcmlhYmxlcy5qc29uXG4vLyBtb2R1bGUgaWQgPSA3MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBSZXNpemUgcmVDQVBUQ0hBIHRvIGZpdCB3aWR0aCBvZiBjb250YWluZXJcclxuLy8gU2luY2UgaXQgaGFzIGEgZml4ZWQgd2lkdGgsIHdlJ3JlIHNjYWxpbmdcclxuLy8gdXNpbmcgQ1NTMyB0cmFuc2Zvcm1zXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBjYXB0Y2hhU2NhbGUgPSBjb250YWluZXJXaWR0aCAvIGVsZW1lbnRXaWR0aFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcbiAgZnVuY3Rpb24gc2NhbGVDYXB0Y2hhKCkge1xyXG4gICAgLy8gV2lkdGggb2YgdGhlIHJlQ0FQVENIQSBlbGVtZW50LCBpbiBwaXhlbHNcclxuICAgIHZhciByZUNhcHRjaGFXaWR0aCA9IDMwNDtcclxuICAgIC8vIEdldCB0aGUgY29udGFpbmluZyBlbGVtZW50J3Mgd2lkdGhcclxuICAgIHZhciBjb250YWluZXJXaWR0aCA9ICQoJy5zbXMtZm9ybS13cmFwcGVyJykud2lkdGgoKTtcclxuICAgIFxyXG4gICAgLy8gT25seSBzY2FsZSB0aGUgcmVDQVBUQ0hBIGlmIGl0IHdvbid0IGZpdFxyXG4gICAgLy8gaW5zaWRlIHRoZSBjb250YWluZXJcclxuICAgIGlmKHJlQ2FwdGNoYVdpZHRoID4gY29udGFpbmVyV2lkdGgpIHtcclxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBzY2FsZVxyXG4gICAgICB2YXIgY2FwdGNoYVNjYWxlID0gY29udGFpbmVyV2lkdGggLyByZUNhcHRjaGFXaWR0aDtcclxuICAgICAgLy8gQXBwbHkgdGhlIHRyYW5zZm9ybWF0aW9uXHJcbiAgICAgICQoJy5nLXJlY2FwdGNoYScpLmNzcyh7XHJcbiAgICAgICAgdHJhbnNmb3JtOidzY2FsZSgnK2NhcHRjaGFTY2FsZSsnKSdcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAkKGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gSW5pdGlhbGl6ZSBzY2FsaW5nXHJcbiAgICBzY2FsZUNhcHRjaGEoKTtcclxuICB9KTtcclxuXHJcbiAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuICAgIC8vIFVwZGF0ZSBzY2FsaW5nIG9uIHdpbmRvdyByZXNpemVcclxuICAgIC8vIFVzZXMgalF1ZXJ5IHRocm90dGxlIHBsdWdpbiB0byBsaW1pdCBzdHJhaW4gb24gdGhlIGJyb3dzZXJcclxuICAgIHNjYWxlQ2FwdGNoYSgpO1xyXG4gIH0pO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvY2FwdGNoYVJlc2l6ZS5qcyIsIi8qKlxuKiBIb21lIFJvdGF0aW5nIFRleHQgQW5pbWF0aW9uXG4qIFJlZmVycmVkIGZyb20gU3RhY2tvdmVyZmxvd1xuKiBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI3NzE3ODkvY2hhbmdpbmctdGV4dC1wZXJpb2RpY2FsbHktaW4tYS1zcGFuLWZyb20tYW4tYXJyYXktd2l0aC1qcXVlcnkvMjc3MjI3OCMyNzcyMjc4XG4qL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIHRlcm1zID0gW107XG5cbiAgJCgnLnJvdGF0aW5nLXRleHRfX2VudHJ5JykuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xuICAgIGlmICgkKGUpLnRleHQoKS50cmltKCkgIT09ICcnKSB7XG4gICAgICB0ZXJtcy5wdXNoKCQoZSkudGV4dCgpKTtcbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHJvdGF0ZVRlcm0oKSB7XG4gICAgdmFyIGN0ID0gJChcIiNyb3RhdGVcIikuZGF0YShcInRlcm1cIikgfHwgMDtcbiAgICAkKFwiI3JvdGF0ZVwiKS5kYXRhKFwidGVybVwiLCBjdCA9PT0gdGVybXMubGVuZ3RoIC0xID8gMCA6IGN0ICsgMSkudGV4dCh0ZXJtc1tjdF0pLmZhZGVJbigpLmRlbGF5KDIwMDApLmZhZGVPdXQoMjAwLCByb3RhdGVUZXJtKTtcbiAgfVxuICAkKHJvdGF0ZVRlcm0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvcm90YXRpbmdUZXh0QW5pbWF0aW9uLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTWlzc1BsZXRlIGZyb20gJ21pc3MtcGxldGUtanMnO1xuXG5jbGFzcyBTZWFyY2gge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBtb2R1bGVcbiAgICovXG4gIGluaXQoKSB7XG4gICAgdGhpcy5faW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTZWFyY2guc2VsZWN0b3JzLk1BSU4pO1xuXG4gICAgaWYgKCF0aGlzLl9pbnB1dHMpIHJldHVybjtcblxuICAgIGZvciAobGV0IGkgPSB0aGlzLl9pbnB1dHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRoaXMuX3N1Z2dlc3Rpb25zKHRoaXMuX2lucHV0c1tpXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBzdWdnZXN0ZWQgc2VhcmNoIHRlcm0gZHJvcGRvd24uXG4gICAqIEBwYXJhbSAge29iamVjdH0gaW5wdXQgVGhlIHNlYXJjaCBpbnB1dC5cbiAgICovXG4gIF9zdWdnZXN0aW9ucyhpbnB1dCkge1xuICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShpbnB1dC5kYXRhc2V0LmpzU2VhcmNoU3VnZ2VzdGlvbnMpO1xuXG4gICAgaW5wdXQuX01pc3NQbGV0ZSA9IG5ldyBNaXNzUGxldGUoe1xuICAgICAgaW5wdXQ6IGlucHV0LFxuICAgICAgb3B0aW9uczogZGF0YSxcbiAgICAgIGNsYXNzTmFtZTogaW5wdXQuZGF0YXNldC5qc1NlYXJjaERyb3Bkb3duQ2xhc3NcbiAgICB9KTtcbiAgfVxufVxuXG5TZWFyY2guc2VsZWN0b3JzID0ge1xuICBNQUlOOiAnW2RhdGEtanMqPVwic2VhcmNoXCJdJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2VhcmNoO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3NlYXJjaC5qcyIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk1pc3NQbGV0ZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJNaXNzUGxldGVcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cblxuLyoqKi8gfSksXG4vKiAxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXHRcblx0dmFyIF9qYXJvV2lua2xlciA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XG5cdFxuXHR2YXIgX2phcm9XaW5rbGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2phcm9XaW5rbGVyKTtcblx0XG5cdHZhciBfbWVtb2l6ZSA9IF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5cdFxuXHR2YXIgX21lbW9pemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVtb2l6ZSk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblx0XG5cdHZhciBNaXNzUGxldGUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgZnVuY3Rpb24gTWlzc1BsZXRlKF9yZWYpIHtcblx0ICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cdFxuXHQgICAgdmFyIGlucHV0ID0gX3JlZi5pbnB1dCxcblx0ICAgICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuXHQgICAgICAgIGNsYXNzTmFtZSA9IF9yZWYuY2xhc3NOYW1lLFxuXHQgICAgICAgIF9yZWYkc2NvcmVGbiA9IF9yZWYuc2NvcmVGbixcblx0ICAgICAgICBzY29yZUZuID0gX3JlZiRzY29yZUZuID09PSB1bmRlZmluZWQgPyAoMCwgX21lbW9pemUyLmRlZmF1bHQpKE1pc3NQbGV0ZS5zY29yZUZuKSA6IF9yZWYkc2NvcmVGbixcblx0ICAgICAgICBfcmVmJGxpc3RJdGVtRm4gPSBfcmVmLmxpc3RJdGVtRm4sXG5cdCAgICAgICAgbGlzdEl0ZW1GbiA9IF9yZWYkbGlzdEl0ZW1GbiA9PT0gdW5kZWZpbmVkID8gTWlzc1BsZXRlLmxpc3RJdGVtRm4gOiBfcmVmJGxpc3RJdGVtRm47XG5cdFxuXHQgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1pc3NQbGV0ZSk7XG5cdFxuXHQgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7IGlucHV0OiBpbnB1dCwgb3B0aW9uczogb3B0aW9ucywgY2xhc3NOYW1lOiBjbGFzc05hbWUsIHNjb3JlRm46IHNjb3JlRm4sIGxpc3RJdGVtRm46IGxpc3RJdGVtRm4gfSk7XG5cdFxuXHQgICAgdGhpcy5zY29yZWRPcHRpb25zID0gbnVsbDtcblx0ICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcblx0ICAgIHRoaXMudWwgPSBudWxsO1xuXHQgICAgdGhpcy5oaWdobGlnaHRlZEluZGV4ID0gLTE7XG5cdFxuXHQgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKF90aGlzLmlucHV0LnZhbHVlLmxlbmd0aCA+IDApIHtcblx0ICAgICAgICBfdGhpcy5zY29yZWRPcHRpb25zID0gX3RoaXMub3B0aW9ucy5tYXAoZnVuY3Rpb24gKG9wdGlvbikge1xuXHQgICAgICAgICAgcmV0dXJuIHNjb3JlRm4oX3RoaXMuaW5wdXQudmFsdWUsIG9wdGlvbik7XG5cdCAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHQgICAgICAgICAgcmV0dXJuIGIuc2NvcmUgLSBhLnNjb3JlO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIF90aGlzLnNjb3JlZE9wdGlvbnMgPSBbXTtcblx0ICAgICAgfVxuXHQgICAgICBfdGhpcy5yZW5kZXJPcHRpb25zKCk7XG5cdCAgICB9KTtcblx0XG5cdCAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgaWYgKF90aGlzLnVsKSB7XG5cdCAgICAgICAgLy8gZHJvcGRvd24gdmlzaWJsZT9cblx0ICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcblx0ICAgICAgICAgIGNhc2UgMTM6XG5cdCAgICAgICAgICAgIF90aGlzLnNlbGVjdCgpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgMjc6XG5cdCAgICAgICAgICAgIC8vIEVzY1xuXHQgICAgICAgICAgICBfdGhpcy5yZW1vdmVEcm9wZG93bigpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgNDA6XG5cdCAgICAgICAgICAgIC8vIERvd24gYXJyb3dcblx0ICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHVwIGFycm93IHBsYWNlcyB0aGUgY3Vyc29yIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlXG5cdCAgICAgICAgICAgIC8vIGZpZWxkLCBhbmQgZG93biBhcnJvdyBhdCB0aGUgZW5kXG5cdCAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgIF90aGlzLmNoYW5nZUhpZ2hsaWdodGVkT3B0aW9uKF90aGlzLmhpZ2hsaWdodGVkSW5kZXggPCBfdGhpcy51bC5jaGlsZHJlbi5sZW5ndGggLSAxID8gX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCArIDEgOiAtMSk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgY2FzZSAzODpcblx0ICAgICAgICAgICAgLy8gVXAgYXJyb3dcblx0ICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgICAgICAgX3RoaXMuY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24oX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCA+IC0xID8gX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCAtIDEgOiBfdGhpcy51bC5jaGlsZHJlbi5sZW5ndGggLSAxKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9KTtcblx0XG5cdCAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgX3RoaXMucmVtb3ZlRHJvcGRvd24oKTtcblx0ICAgICAgX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCA9IC0xO1xuXHQgICAgfSk7XG5cdCAgfSAvLyBlbmQgY29uc3RydWN0b3Jcblx0XG5cdCAgX2NyZWF0ZUNsYXNzKE1pc3NQbGV0ZSwgW3tcblx0ICAgIGtleTogJ2dldFNpYmxpbmdJbmRleCcsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U2libGluZ0luZGV4KG5vZGUpIHtcblx0ICAgICAgdmFyIGluZGV4ID0gLTE7XG5cdCAgICAgIHZhciBuID0gbm9kZTtcblx0ICAgICAgZG8ge1xuXHQgICAgICAgIGluZGV4Kys7XG5cdCAgICAgICAgbiA9IG4ucHJldmlvdXNFbGVtZW50U2libGluZztcblx0ICAgICAgfSB3aGlsZSAobik7XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH1cblx0ICB9LCB7XG5cdCAgICBrZXk6ICdyZW5kZXJPcHRpb25zJyxcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXJPcHRpb25zKCkge1xuXHQgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblx0XG5cdCAgICAgIHZhciBkb2N1bWVudEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcblx0ICAgICAgdGhpcy5zY29yZWRPcHRpb25zLmV2ZXJ5KGZ1bmN0aW9uIChzY29yZWRPcHRpb24sIGkpIHtcblx0ICAgICAgICB2YXIgbGlzdEl0ZW0gPSBfdGhpczIubGlzdEl0ZW1GbihzY29yZWRPcHRpb24sIGkpO1xuXHQgICAgICAgIGxpc3RJdGVtICYmIGRvY3VtZW50RnJhZ21lbnQuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuXHQgICAgICAgIHJldHVybiAhIWxpc3RJdGVtO1xuXHQgICAgICB9KTtcblx0XG5cdCAgICAgIHRoaXMucmVtb3ZlRHJvcGRvd24oKTtcblx0ICAgICAgdGhpcy5oaWdobGlnaHRlZEluZGV4ID0gLTE7XG5cdFxuXHQgICAgICBpZiAoZG9jdW1lbnRGcmFnbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcblx0ICAgICAgICB2YXIgbmV3VWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG5cdCAgICAgICAgbmV3VWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdCAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09ICdMSScpIHtcblx0ICAgICAgICAgICAgX3RoaXMyLmNoYW5nZUhpZ2hsaWdodGVkT3B0aW9uKF90aGlzMi5nZXRTaWJsaW5nSW5kZXgoZXZlbnQudGFyZ2V0KSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdFxuXHQgICAgICAgIG5ld1VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICBfdGhpczIuY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24oLTEpO1xuXHQgICAgICAgIH0pO1xuXHRcblx0ICAgICAgICBuZXdVbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgICAgIHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgIH0pO1xuXHRcblx0ICAgICAgICBuZXdVbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lID09PSAnTEknKSB7XG5cdCAgICAgICAgICAgIF90aGlzMi5zZWxlY3QoKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0XG5cdCAgICAgICAgbmV3VWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnRGcmFnbWVudCk7XG5cdFxuXHQgICAgICAgIC8vIFNlZSBDU1MgdG8gdW5kZXJzdGFuZCB3aHkgdGhlIDx1bD4gaGFzIHRvIGJlIHdyYXBwZWQgaW4gYSA8ZGl2PlxuXHQgICAgICAgIHZhciBuZXdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHQgICAgICAgIG5ld0NvbnRhaW5lci5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZTtcblx0ICAgICAgICBuZXdDb250YWluZXIuYXBwZW5kQ2hpbGQobmV3VWwpO1xuXHRcblx0ICAgICAgICAvLyBJbnNlcnRzIHRoZSBkcm9wZG93biBqdXN0IGFmdGVyIHRoZSA8aW5wdXQ+IGVsZW1lbnRcblx0ICAgICAgICB0aGlzLmlucHV0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld0NvbnRhaW5lciwgdGhpcy5pbnB1dC5uZXh0U2libGluZyk7XG5cdCAgICAgICAgdGhpcy5jb250YWluZXIgPSBuZXdDb250YWluZXI7XG5cdCAgICAgICAgdGhpcy51bCA9IG5ld1VsO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAnY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZUhpZ2hsaWdodGVkT3B0aW9uKG5ld0hpZ2hsaWdodGVkSW5kZXgpIHtcblx0ICAgICAgaWYgKG5ld0hpZ2hsaWdodGVkSW5kZXggPj0gLTEgJiYgbmV3SGlnaGxpZ2h0ZWRJbmRleCA8IHRoaXMudWwuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdCAgICAgICAgLy8gSWYgYW55IG9wdGlvbiBhbHJlYWR5IHNlbGVjdGVkLCB0aGVuIHVuc2VsZWN0IGl0XG5cdCAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0ZWRJbmRleCAhPT0gLTEpIHtcblx0ICAgICAgICAgIHRoaXMudWwuY2hpbGRyZW5bdGhpcy5oaWdobGlnaHRlZEluZGV4XS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlnaGxpZ2h0XCIpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgdGhpcy5oaWdobGlnaHRlZEluZGV4ID0gbmV3SGlnaGxpZ2h0ZWRJbmRleDtcblx0XG5cdCAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0ZWRJbmRleCAhPT0gLTEpIHtcblx0ICAgICAgICAgIHRoaXMudWwuY2hpbGRyZW5bdGhpcy5oaWdobGlnaHRlZEluZGV4XS5jbGFzc0xpc3QuYWRkKFwiaGlnaGxpZ2h0XCIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ3NlbGVjdCcsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gc2VsZWN0KCkge1xuXHQgICAgICBpZiAodGhpcy5oaWdobGlnaHRlZEluZGV4ICE9PSAtMSkge1xuXHQgICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSB0aGlzLnNjb3JlZE9wdGlvbnNbdGhpcy5oaWdobGlnaHRlZEluZGV4XS5kaXNwbGF5VmFsdWU7XG5cdCAgICAgICAgdGhpcy5yZW1vdmVEcm9wZG93bigpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAncmVtb3ZlRHJvcGRvd24nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZURyb3Bkb3duKCkge1xuXHQgICAgICB0aGlzLmNvbnRhaW5lciAmJiB0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcblx0ICAgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuXHQgICAgICB0aGlzLnVsID0gbnVsbDtcblx0ICAgIH1cblx0ICB9XSwgW3tcblx0ICAgIGtleTogJ3Njb3JlRm4nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIHNjb3JlRm4oaW5wdXRWYWx1ZSwgb3B0aW9uU3lub255bXMpIHtcblx0ICAgICAgdmFyIGNsb3Nlc3RTeW5vbnltID0gbnVsbDtcblx0ICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuXHQgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcblx0ICAgICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuXHRcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBvcHRpb25TeW5vbnltc1tTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcblx0ICAgICAgICAgIHZhciBzeW5vbnltID0gX3N0ZXAudmFsdWU7XG5cdFxuXHQgICAgICAgICAgdmFyIHNpbWlsYXJpdHkgPSAoMCwgX2phcm9XaW5rbGVyMi5kZWZhdWx0KShzeW5vbnltLnRyaW0oKS50b0xvd2VyQ2FzZSgpLCBpbnB1dFZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpKTtcblx0ICAgICAgICAgIGlmIChjbG9zZXN0U3lub255bSA9PT0gbnVsbCB8fCBzaW1pbGFyaXR5ID4gY2xvc2VzdFN5bm9ueW0uc2ltaWxhcml0eSkge1xuXHQgICAgICAgICAgICBjbG9zZXN0U3lub255bSA9IHsgc2ltaWxhcml0eTogc2ltaWxhcml0eSwgdmFsdWU6IHN5bm9ueW0gfTtcblx0ICAgICAgICAgICAgaWYgKHNpbWlsYXJpdHkgPT09IDEpIHtcblx0ICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuXHQgICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuXHQgICAgICB9IGZpbmFsbHkge1xuXHQgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuXHQgICAgICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSBmaW5hbGx5IHtcblx0ICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuXHQgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiB7XG5cdCAgICAgICAgc2NvcmU6IGNsb3Nlc3RTeW5vbnltLnNpbWlsYXJpdHksXG5cdCAgICAgICAgZGlzcGxheVZhbHVlOiBvcHRpb25TeW5vbnltc1swXVxuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ2xpc3RJdGVtRm4nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIGxpc3RJdGVtRm4oc2NvcmVkT3B0aW9uLCBpdGVtSW5kZXgpIHtcblx0ICAgICAgdmFyIGxpID0gaXRlbUluZGV4ID4gTWlzc1BsZXRlLk1BWF9JVEVNUyA/IG51bGwgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG5cdCAgICAgIGxpICYmIGxpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHNjb3JlZE9wdGlvbi5kaXNwbGF5VmFsdWUpKTtcblx0ICAgICAgcmV0dXJuIGxpO1xuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ01BWF9JVEVNUycsXG5cdCAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgICAgcmV0dXJuIDg7XG5cdCAgICB9XG5cdCAgfV0pO1xuXHRcblx0ICByZXR1cm4gTWlzc1BsZXRlO1xuXHR9KCk7XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBNaXNzUGxldGU7XG5cbi8qKiovIH0pLFxuLyogMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX3NsaWNlZFRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIHNsaWNlSXRlcmF0b3IoYXJyLCBpKSB7IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX2UgPSB1bmRlZmluZWQ7IHRyeSB7IGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH0gcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyByZXR1cm4gYXJyOyB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkgeyByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpOyB9IGVsc2UgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTsgfSB9OyB9KCk7XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoczEsIHMyKSB7XG5cdCAgdmFyIHByZWZpeFNjYWxpbmdGYWN0b3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDAuMjtcblx0XG5cdCAgdmFyIGphcm9TaW1pbGFyaXR5ID0gamFybyhzMSwgczIpO1xuXHRcblx0ICB2YXIgY29tbW9uUHJlZml4TGVuZ3RoID0gMDtcblx0ICBmb3IgKHZhciBpID0gMDsgaSA8IHMxLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBpZiAoczFbaV0gPT09IHMyW2ldKSB7XG5cdCAgICAgIGNvbW1vblByZWZpeExlbmd0aCsrO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgYnJlYWs7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gamFyb1NpbWlsYXJpdHkgKyBNYXRoLm1pbihjb21tb25QcmVmaXhMZW5ndGgsIDQpICogcHJlZml4U2NhbGluZ0ZhY3RvciAqICgxIC0gamFyb1NpbWlsYXJpdHkpO1xuXHR9O1xuXHRcblx0Ly8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSmFybyVFMiU4MCU5M1dpbmtsZXJfZGlzdGFuY2Vcblx0XG5cdGZ1bmN0aW9uIGphcm8oczEsIHMyKSB7XG5cdCAgdmFyIHNob3J0ZXIgPSB2b2lkIDAsXG5cdCAgICAgIGxvbmdlciA9IHZvaWQgMDtcblx0XG5cdCAgdmFyIF9yZWYgPSBzMS5sZW5ndGggPiBzMi5sZW5ndGggPyBbczEsIHMyXSA6IFtzMiwgczFdO1xuXHRcblx0ICB2YXIgX3JlZjIgPSBfc2xpY2VkVG9BcnJheShfcmVmLCAyKTtcblx0XG5cdCAgbG9uZ2VyID0gX3JlZjJbMF07XG5cdCAgc2hvcnRlciA9IF9yZWYyWzFdO1xuXHRcblx0XG5cdCAgdmFyIG1hdGNoaW5nV2luZG93ID0gTWF0aC5mbG9vcihsb25nZXIubGVuZ3RoIC8gMikgLSAxO1xuXHQgIHZhciBzaG9ydGVyTWF0Y2hlcyA9IFtdO1xuXHQgIHZhciBsb25nZXJNYXRjaGVzID0gW107XG5cdFxuXHQgIGZvciAodmFyIGkgPSAwOyBpIDwgc2hvcnRlci5sZW5ndGg7IGkrKykge1xuXHQgICAgdmFyIGNoID0gc2hvcnRlcltpXTtcblx0ICAgIHZhciB3aW5kb3dTdGFydCA9IE1hdGgubWF4KDAsIGkgLSBtYXRjaGluZ1dpbmRvdyk7XG5cdCAgICB2YXIgd2luZG93RW5kID0gTWF0aC5taW4oaSArIG1hdGNoaW5nV2luZG93ICsgMSwgbG9uZ2VyLmxlbmd0aCk7XG5cdCAgICBmb3IgKHZhciBqID0gd2luZG93U3RhcnQ7IGogPCB3aW5kb3dFbmQ7IGorKykge1xuXHQgICAgICBpZiAobG9uZ2VyTWF0Y2hlc1tqXSA9PT0gdW5kZWZpbmVkICYmIGNoID09PSBsb25nZXJbal0pIHtcblx0ICAgICAgICBzaG9ydGVyTWF0Y2hlc1tpXSA9IGxvbmdlck1hdGNoZXNbal0gPSBjaDtcblx0ICAgICAgICBicmVhaztcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgdmFyIHNob3J0ZXJNYXRjaGVzU3RyaW5nID0gc2hvcnRlck1hdGNoZXMuam9pbihcIlwiKTtcblx0ICB2YXIgbG9uZ2VyTWF0Y2hlc1N0cmluZyA9IGxvbmdlck1hdGNoZXMuam9pbihcIlwiKTtcblx0ICB2YXIgbnVtTWF0Y2hlcyA9IHNob3J0ZXJNYXRjaGVzU3RyaW5nLmxlbmd0aDtcblx0XG5cdCAgdmFyIHRyYW5zcG9zaXRpb25zID0gMDtcblx0ICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgc2hvcnRlck1hdGNoZXNTdHJpbmcubGVuZ3RoOyBfaSsrKSB7XG5cdCAgICBpZiAoc2hvcnRlck1hdGNoZXNTdHJpbmdbX2ldICE9PSBsb25nZXJNYXRjaGVzU3RyaW5nW19pXSkge1xuXHQgICAgICB0cmFuc3Bvc2l0aW9ucysrO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuIG51bU1hdGNoZXMgPiAwID8gKG51bU1hdGNoZXMgLyBzaG9ydGVyLmxlbmd0aCArIG51bU1hdGNoZXMgLyBsb25nZXIubGVuZ3RoICsgKG51bU1hdGNoZXMgLSBNYXRoLmZsb29yKHRyYW5zcG9zaXRpb25zIC8gMikpIC8gbnVtTWF0Y2hlcykgLyAzLjAgOiAwO1xuXHR9XG5cbi8qKiovIH0pLFxuLyogMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoZm4pIHtcblx0ICB2YXIgY2FjaGUgPSB7fTtcblx0XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIGtleSA9IEpTT04uc3RyaW5naWZ5KGFyZ3MpO1xuXHQgICAgcmV0dXJuIGNhY2hlW2tleV0gfHwgKGNhY2hlW2tleV0gPSBmbi5hcHBseShudWxsLCBhcmdzKSk7XG5cdCAgfTtcblx0fTtcblxuLyoqKi8gfSlcbi8qKioqKiovIF0pXG59KTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bmRsZS5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9taXNzLXBsZXRlLWpzL2Rpc3QvYnVuZGxlLmpzXG4vLyBtb2R1bGUgaWQgPSA3NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRvZ2dsZU9wZW4gbW9kdWxlXG4gKiBAbW9kdWxlIG1vZHVsZXMvdG9nZ2xlT3BlblxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcbmltcG9ydCBkYXRhc2V0IGZyb20gJy4vZGF0YXNldC5qcyc7XG5cbi8qKlxuICogVG9nZ2xlcyBhbiBlbGVtZW50IG9wZW4vY2xvc2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IG9wZW5DbGFzcyAtIFRoZSBjbGFzcyB0byB0b2dnbGUgb24vb2ZmXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wZW5DbGFzcykge1xuICBpZiAoIW9wZW5DbGFzcykgb3BlbkNsYXNzID0gJ2lzLW9wZW4nO1xuXG4gIGNvbnN0IGxpbmtBY3RpdmVDbGFzcyA9ICdpcy1hY3RpdmUnO1xuICBjb25zdCB0b2dnbGVFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRvZ2dsZV0nKTtcblxuICBpZiAoIXRvZ2dsZUVsZW1zKSByZXR1cm47XG5cbiAgLyoqXG4gICogRm9yIGVhY2ggdG9nZ2xlIGVsZW1lbnQsIGdldCBpdHMgdGFyZ2V0IGZyb20gdGhlIGRhdGEtdG9nZ2xlIGF0dHJpYnV0ZS5cbiAgKiBCaW5kIGFuIGV2ZW50IGhhbmRsZXIgdG8gdG9nZ2xlIHRoZSBvcGVuQ2xhc3Mgb24vb2ZmIG9uIHRoZSB0YXJnZXQgZWxlbWVudFxuICAqIHdoZW4gdGhlIHRvZ2dsZSBlbGVtZW50IGlzIGNsaWNrZWQuXG4gICovXG4gIGZvckVhY2godG9nZ2xlRWxlbXMsIGZ1bmN0aW9uKHRvZ2dsZUVsZW0pIHtcbiAgICBjb25zdCB0YXJnZXRFbGVtU2VsZWN0b3IgPSBkYXRhc2V0KHRvZ2dsZUVsZW0sICd0b2dnbGUnKTtcblxuICAgIGlmICghdGFyZ2V0RWxlbVNlbGVjdG9yKSByZXR1cm47XG5cbiAgICBjb25zdCB0YXJnZXRFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0RWxlbVNlbGVjdG9yKTtcblxuICAgIGlmICghdGFyZ2V0RWxlbSkgcmV0dXJuO1xuXG4gICAgdG9nZ2xlRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBsZXQgdG9nZ2xlRXZlbnQ7XG4gICAgICBsZXQgdG9nZ2xlQ2xhc3MgPSAodG9nZ2xlRWxlbS5kYXRhc2V0LnRvZ2dsZUNsYXNzKSA/XG4gICAgICAgIHRvZ2dsZUVsZW0uZGF0YXNldC50b2dnbGVDbGFzcyA6IG9wZW5DbGFzcztcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgLy8gVG9nZ2xlIHRoZSBlbGVtZW50J3MgYWN0aXZlIGNsYXNzXG4gICAgICB0b2dnbGVFbGVtLmNsYXNzTGlzdC50b2dnbGUobGlua0FjdGl2ZUNsYXNzKTtcblxuICAgICAgLy8gVG9nZ2xlIGN1c3RvbSBjbGFzcyBpZiBpdCBpcyBzZXRcbiAgICAgIGlmICh0b2dnbGVDbGFzcyAhPT0gb3BlbkNsYXNzKVxuICAgICAgICB0YXJnZXRFbGVtLmNsYXNzTGlzdC50b2dnbGUodG9nZ2xlQ2xhc3MpO1xuXG4gICAgICAvLyBUb2dnbGUgdGhlIGRlZmF1bHQgb3BlbiBjbGFzc1xuICAgICAgdGFyZ2V0RWxlbS5jbGFzc0xpc3QudG9nZ2xlKG9wZW5DbGFzcyk7XG5cbiAgICAgIC8vIFRvZ2dsZSB0aGUgYXBwcm9wcmlhdGUgYXJpYSBoaWRkZW4gYXR0cmlidXRlXG4gICAgICB0YXJnZXRFbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLFxuICAgICAgICAhKHRhcmdldEVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKHRvZ2dsZUNsYXNzKSlcbiAgICAgICk7XG5cbiAgICAgIC8vIEZpcmUgdGhlIGN1c3RvbSBvcGVuIHN0YXRlIGV2ZW50IHRvIHRyaWdnZXIgb3BlbiBmdW5jdGlvbnNcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRvZ2dsZUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2VPcGVuU3RhdGUnLCB7XG4gICAgICAgICAgZGV0YWlsOiB0YXJnZXRFbGVtLmNsYXNzTGlzdC5jb250YWlucyhvcGVuQ2xhc3MpXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9nZ2xlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgICAgdG9nZ2xlRXZlbnQuaW5pdEN1c3RvbUV2ZW50KCdjaGFuZ2VPcGVuU3RhdGUnLCB0cnVlLCB0cnVlLCB7XG4gICAgICAgICAgZGV0YWlsOiB0YXJnZXRFbGVtLmNsYXNzTGlzdC5jb250YWlucyhvcGVuQ2xhc3MpXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0YXJnZXRFbGVtLmRpc3BhdGNoRXZlbnQodG9nZ2xlRXZlbnQpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU9wZW4uanMiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbmltcG9ydCBqUXVlcnkgZnJvbSAnanF1ZXJ5JztcblxuKGZ1bmN0aW9uKHdpbmRvdywgJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQXR0YWNoIHNpdGUtd2lkZSBldmVudCBsaXN0ZW5lcnMuXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXNpbXBsZS10b2dnbGUnLCBlID0+IHtcbiAgICAvLyBTaW1wbGUgdG9nZ2xlIHRoYXQgYWRkL3JlbW92ZXMgXCJhY3RpdmVcIiBhbmQgXCJoaWRkZW5cIiBjbGFzc2VzLCBhcyB3ZWxsIGFzXG4gICAgLy8gYXBwbHlpbmcgYXBwcm9wcmlhdGUgYXJpYS1oaWRkZW4gdmFsdWUgdG8gYSBzcGVjaWZpZWQgdGFyZ2V0LlxuICAgIC8vIFRPRE86IFRoZXJlIGFyZSBhIGZldyBzaW1sYXIgdG9nZ2xlcyBvbiB0aGUgc2l0ZSB0aGF0IGNvdWxkIGJlXG4gICAgLy8gcmVmYWN0b3JlZCB0byB1c2UgdGhpcyBjbGFzcy5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJykgP1xuICAgICAgICAkKCQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJykpIDpcbiAgICAgICAgJCgkKGUuY3VycmVudFRhcmdldCkuZGF0YSgndGFyZ2V0JykpO1xuICAgICQoZS5jdXJyZW50VGFyZ2V0KS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgJHRhcmdldC50b2dnbGVDbGFzcygnYWN0aXZlIGhpZGRlbicpXG4gICAgICAgIC5wcm9wKCdhcmlhLWhpZGRlbicsICR0YXJnZXQuaGFzQ2xhc3MoJ2hpZGRlbicpKTtcbiAgfSkub24oJ2NsaWNrJywgJy5qcy1zaG93LW5hdicsIGUgPT4ge1xuICAgIC8vIFNob3dzIHRoZSBtb2JpbGUgbmF2IGJ5IGFwcGx5aW5nIFwibmF2LWFjdGl2ZVwiIGNhc3MgdG8gdGhlIGJvZHkuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQoZS5kZWxlZ2F0ZVRhcmdldCkuYWRkQ2xhc3MoJ25hdi1hY3RpdmUnKTtcbiAgICAkKCcubmF2LW92ZXJsYXknKS5zaG93KCk7XG4gIH0pLm9uKCdjbGljaycsICcuanMtaGlkZS1uYXYnLCBlID0+IHtcbiAgICAvLyBIaWRlcyB0aGUgbW9iaWxlIG5hdi5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCgnLm5hdi1vdmVybGF5JykuaGlkZSgpO1xuICAgICQoZS5kZWxlZ2F0ZVRhcmdldCkucmVtb3ZlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcbiAgfSk7XG4gIC8vIEVORCBUT0RPXG5cbn0pKHdpbmRvdywgalF1ZXJ5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU1lbnUuanMiXSwic291cmNlUm9vdCI6IiJ9
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery) {'use strict';

	var _globalSearch = __webpack_require__(26);

	var _globalSearch2 = _interopRequireDefault(_globalSearch);

	var _toggleOpen = __webpack_require__(37);

	var _toggleOpen2 = _interopRequireDefault(_toggleOpen);

	var _accordion = __webpack_require__(17);

	var _accordion2 = _interopRequireDefault(_accordion);

	var _offcanvas = __webpack_require__(28);

	var _offcanvas2 = _interopRequireDefault(_offcanvas);

	var _overlay = __webpack_require__(29);

	var _overlay2 = _interopRequireDefault(_overlay);

	var _stickyNav = __webpack_require__(36);

	var _stickyNav2 = _interopRequireDefault(_stickyNav);

	var _currentSection = __webpack_require__(22);

	var _currentSection2 = _interopRequireDefault(_currentSection);

	var _staticColumn = __webpack_require__(35);

	var _staticColumn2 = _interopRequireDefault(_staticColumn);

	var _searchResultsHeader = __webpack_require__(33);

	var _searchResultsHeader2 = _interopRequireDefault(_searchResultsHeader);

	var _alert = __webpack_require__(18);

	var _alert2 = _interopRequireDefault(_alert);

	var _bsdtoolsSignup = __webpack_require__(19);

	var _bsdtoolsSignup2 = _interopRequireDefault(_bsdtoolsSignup);

	var _formEffects = __webpack_require__(24);

	var _formEffects2 = _interopRequireDefault(_formEffects);

	var _facets = __webpack_require__(23);

	var _facets2 = _interopRequireDefault(_facets);

	var _owlSettings = __webpack_require__(30);

	var _owlSettings2 = _interopRequireDefault(_owlSettings);

	var _iOS7Hack = __webpack_require__(27);

	var _iOS7Hack2 = _interopRequireDefault(_iOS7Hack);

	var _shareForm = __webpack_require__(34);

	var _shareForm2 = _interopRequireDefault(_shareForm);

	var _captchaResize = __webpack_require__(20);

	var _captchaResize2 = _interopRequireDefault(_captchaResize);

	var _rotatingTextAnimation = __webpack_require__(32);

	var _rotatingTextAnimation2 = _interopRequireDefault(_rotatingTextAnimation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function ready(fn) {
	  if (document.readyState === 'loading') {
	    document.addEventListener('DOMContentLoaded', fn);
	  } else {
	    fn();
	  }
	}

	function init() {
	  (0, _globalSearch2.default)();
	  (0, _toggleOpen2.default)('is-open');
	  (0, _alert2.default)('is-open');
	  (0, _offcanvas2.default)();
	  (0, _accordion2.default)();
	  (0, _overlay2.default)();
	  // Search results page
	  (0, _searchResultsHeader2.default)();
	  // FacetWP pages
	  (0, _facets2.default)();
	  // Homepage
	  (0, _staticColumn2.default)();
	  (0, _stickyNav2.default)();
	  (0, _currentSection2.default)();
	  (0, _bsdtoolsSignup2.default)();
	  (0, _formEffects2.default)();
	  (0, _owlSettings2.default)();
	  (0, _iOS7Hack2.default)();
	  (0, _captchaResize2.default)();
	  (0, _rotatingTextAnimation2.default)();
	}

	ready(init);

	// Make certain functions available globally
	window.accordion = _accordion2.default;

	(function (window, $) {
	  'use strict';
	  // Initialize share by email/sms forms.

	  $('.' + _shareForm2.default.CssClass.FORM).each(function (i, el) {
	    var shareForm = new _shareForm2.default(el);
	    shareForm.init();
	  });
	})(window, jQuery);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = jQuery;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayEach = __webpack_require__(42),
	    baseEach = __webpack_require__(44),
	    castFunction = __webpack_require__(52),
	    isArray = __webpack_require__(12);

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(9),
	    getRawTag = __webpack_require__(55),
	    objectToString = __webpack_require__(60);

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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(10);

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	module.exports = root;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (elem, attr) {
	  if (typeof elem.dataset === 'undefined') {
	    return elem.getAttribute('data-' + attr);
	  }
	  return elem.dataset[attr];
	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (elem, eventType) {
	  var event = void 0;
	  if (document.createEvent) {
	    event = document.createEvent('HTMLEvents');
	    event.initEvent(eventType, true, true);
	    elem.dispatchEvent(event);
	  } else {
	    event = document.createEventObject();
	    elem.fireEvent('on' + eventType, event);
	  }
	};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(6);

	/** Built-in value references. */
	var Symbol = root.Symbol;

	module.exports = Symbol;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

	module.exports = freeGlobal;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(4),
	    now = __webpack_require__(69),
	    toNumber = __webpack_require__(71);

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
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(65),
	    isLength = __webpack_require__(14);

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
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var debounce = __webpack_require__(11),
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
/* 16 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
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
	    (0, _forEach2.default)(headerElem.attributes, function (attr) {
	      newHeaderElem.setAttribute(attr.nodeName, attr.nodeValue);
	    });
	    newHeaderElem.setAttribute('type', 'button');
	    var $newHeaderElem = $(newHeaderElem);
	    $newHeaderElem.html($headerElem.html());
	    $newHeaderElem.append('<svg class="o-accordion__caret icon" aria-hidden="true"><use xlink:href="#caret-down"></use></svg>');
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
	      'role': 'tab'
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
	      'role': 'tabpanel',
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
	      'role': 'tablist',
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
	};

	var _forEach = __webpack_require__(2);

	var _forEach2 = _interopRequireDefault(_forEach);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                                               * Alert Banner module
	                                                                                                                                                                                                                                                                               * @module modules/alert
	                                                                                                                                                                                                                                                                               * @see modules/toggleOpen
	                                                                                                                                                                                                                                                                               */

	/**
	 * Displays an alert banner.
	 * @param {string} openClass - The class to toggle on if banner is visible
	 */


	exports.default = function (openClass) {
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
	    var cookieName = (0, _dataset2.default)(alert, 'cookie');
	    if (!cookieName) {
	      return false;
	    }
	    return typeof (0, _readCookie2.default)(cookieName, document.cookie) !== 'undefined';
	  }

	  /**
	  * Add alert cookie
	  * @param {object} alert - DOM node of the alert
	  */
	  function addAlertCookie(alert) {
	    var cookieName = (0, _dataset2.default)(alert, 'cookie');
	    if (cookieName) {
	      (0, _createCookie2.default)(cookieName, 'dismissed', (0, _getDomain2.default)(window.location, false), 360);
	    }
	  }

	  var alerts = document.querySelectorAll('.js-alert');
	  if (alerts.length) {
	    (0, _forEach2.default)(alerts, function (alert) {
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
	};

	var _forEach = __webpack_require__(2);

	var _forEach2 = _interopRequireDefault(_forEach);

	var _readCookie = __webpack_require__(31);

	var _readCookie2 = _interopRequireDefault(_readCookie);

	var _dataset = __webpack_require__(7);

	var _dataset2 = _interopRequireDefault(_dataset);

	var _createCookie = __webpack_require__(21);

	var _createCookie2 = _interopRequireDefault(_createCookie);

	var _getDomain = __webpack_require__(25);

	var _getDomain2 = _interopRequireDefault(_getDomain);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
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
	    $(this).html('<p class="c-signup-form__success">Thank you for signing up.</p>');
	  }

	  if ($signupForms.length) {
	    /* eslint-disable camelcase */
	    $signupForms.bsdSignup({
	      no_redirect: true,
	      startPaused: true
	    }).on('bsd-ispaused', $.proxy(handleValidation, this)).on('bsd-error', $.proxy(handleErrors, this)).on('bsd-success', $.proxy(handleSuccess, this));
	    /* eslint-enable camelcase */
	  }
	};

	/**
	* Validate a form and submit via the signup API
	*/
	__webpack_require__(38);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
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
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (name, value, domain, days) {
	  var expires = days ? "; expires=" + new Date(days * 864E5 + new Date().getTime()).toGMTString() : "";
	  document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  /**
	  * Gets an element's top position
	  * @param {object} elem - The DOM element
	  * @return {integer} - The distance from the top
	  */
	  function getTop(elem) {
	    return elem.getBoundingClientRect().top;
	  }

	  /**
	  * Gets an element's bottom position
	  * @param {object} elem - The DOM element
	  * @return {integer} - The distance from the bottom
	  */
	  function getBottom(elem) {
	    return elem.getBoundingClientRect().bottom;
	  }

	  /**
	  * Compares whether one element has entered the part of the page occupied by the other
	  * Element is considered to have "entered" if its bottom position is equal to or below
	  * the other element's top but not below the other element's bottom
	  * @param {object} marker - The element being compared
	  * @param {object} target - The element marker is being compared to
	  * @return {boolean} - True if marker has entered target
	  */
	  function hasEntered(marker, target) {
	    return getTop(marker) >= getTop(target) && getBottom(marker) <= getBottom(target) - 1;
	  }

	  /**
	  * Adds or removes the current section class
	  * @param {object} marker - The element being compared
	  * @param {object} target - The element marker is being compared to
	  */
	  function toggleIndicator(marker, target) {
	    var currentSectionClass = 'is-active';
	    var hasClass = marker.classList.contains(currentSectionClass);
	    var hasEnteredTarget = hasEntered(marker, target);

	    if (hasEnteredTarget && !hasClass) {
	      marker.classList.add(currentSectionClass);
	    } else if (!hasEnteredTarget && hasClass) {
	      marker.classList.remove(currentSectionClass);
	    }
	  }

	  /**
	  * Initialize the current section behavior
	  * @param {object} marker - DOM node that should mark when a section is active
	  */
	  function initializeMarker(marker) {
	    var targetSelector = void 0;
	    if (typeof marker.dataset === 'undefined') {
	      targetSelector = marker.getAttribute('data-section');
	    } else {
	      targetSelector = marker.dataset.section;
	    }
	    if (!targetSelector) {
	      return;
	    }
	    var target = document.getElementById(targetSelector);
	    if (!target) {
	      return;
	    }
	    window.addEventListener('resize', (0, _throttle2.default)(function () {
	      var scrollListener = void 0;
	      if (window.matchMedia('(min-width: 1024px)').matches) {
	        scrollListener = window.addEventListener('scroll', (0, _throttle2.default)(function () {
	          toggleIndicator(marker, target);
	        }, 100));
	        toggleIndicator(marker, target);
	      } else if (typeof scrollListener !== 'undefined') {
	        window.removeEventListener('scroll', scrollListener);
	      }
	    }, 100));
	    (0, _dispatchEvent2.default)(window, 'resize');
	  }

	  var markers = document.querySelectorAll('.js-section');
	  if (markers.length) {
	    (0, _forEach2.default)(markers, function (marker) {
	      initializeMarker(marker);
	    });
	  }
	};

	var _forEach = __webpack_require__(2);

	var _forEach2 = _interopRequireDefault(_forEach);

	var _throttle = __webpack_require__(15);

	var _throttle2 = _interopRequireDefault(_throttle);

	var _dispatchEvent = __webpack_require__(8);

	var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  $(document).on('facetwp-refresh', function () {
	    $('body').removeClass('facetwp-is-loaded').addClass('facetwp-is-loading');
	    $('html, body').scrollTop(0);
	  });

	  $(document).on('facetwp-loaded', function () {
	    $('body').removeClass('facetwp-is-loading').addClass('facetwp-is-loaded');
	  });
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
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
	    (0, _forEach2.default)(inputs, function (inputElem) {
	      inputElem.addEventListener('focus', handleFocus);
	      inputElem.addEventListener('blur', handleBlur);
	      (0, _dispatchEvent2.default)(inputElem, 'blur');
	    });
	  }
	};

	var _forEach = __webpack_require__(2);

	var _forEach2 = _interopRequireDefault(_forEach);

	var _dispatchEvent = __webpack_require__(8);

	var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (url, root) {
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
	};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  function searchRedirect(searchForm) {
	    var searchField = searchForm.querySelector('[name="s"]');
	    if (searchField) {
	      var searchTerm = searchField.value;
	      searchTerm = searchTerm.replace(/[!'()*]/g, function (c) {
	        return '%' + c.charCodeAt(0).toString(16);
	      });
	      searchTerm = encodeURIComponent(searchTerm);
	      window.location = window.location.origin + '/search?fwp_search=' + searchTerm;
	    }
	  }

	  var allSearchForms = document.querySelectorAll('.js-global-search');
	  if (allSearchForms) {
	    var searchFormLength = allSearchForms.length;

	    var _loop = function _loop(i) {
	      var searchForm = allSearchForms[i];
	      searchForm.addEventListener('submit', function (e) {
	        e.preventDefault();
	        searchRedirect(searchForm);
	      }, false);
	    };

	    for (var i = 0; i < searchFormLength; ++i) {
	      _loop(i);
	    }
	  }
	};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
	    $('.c-side-hero').height(window.innerHeight);
	    window.scrollTo(0, 0);
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var offCanvas = document.querySelectorAll('.js-offcanvas');
	  if (offCanvas) {
	    (0, _forEach2.default)(offCanvas, function (offCanvasElem) {
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
	};

	var _forEach = __webpack_require__(2);

	var _forEach2 = _interopRequireDefault(_forEach);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var overlay = document.querySelectorAll('.js-overlay');
	  if (overlay) {
	    (0, _forEach2.default)(overlay, function (overlayElem) {
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
	};

	var _forEach = __webpack_require__(2);

	var _forEach2 = _interopRequireDefault(_forEach);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var owl = $('.owl-carousel');
	  owl.owlCarousel({
	    animateIn: 'fadeIn',
	    items: 1,
	    loop: true,
	    margin: 0,
	    dots: true,
	    autoplay: true,
	    autoplayTimeout: 5000,
	    autoplayHoverPause: true
	  });
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (cookieName, cookie) {
	  return (RegExp("(?:^|; )" + cookieName + "=([^;]*)").exec(cookie) || []).pop();
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var terms = [];

	  $('.rotating-text__entry').each(function (i, e) {
	    if ($(e).text().trim() != '') {
	      terms.push($(e).text());
	    }
	  });

	  function rotateTerm() {
	    var ct = $("#rotate").data("term") || 0;
	    $("#rotate").data("term", ct == terms.length - 1 ? 0 : ct + 1).text(terms[ct]).fadeIn().delay(2000).fadeOut(200, rotateTerm);
	  }
	  $(rotateTerm);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  if (typeof window.FWP !== 'undefined' && $('body').hasClass('page-template-template-search')) {
	    $('.facetwp-facet-search').on('click', '.facetwp-searchbtn', function (event) {
	      event.preventDefault();
	      window.FWP.autoload();
	    });
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _jsCookie = __webpack_require__(41);

	var _jsCookie2 = _interopRequireDefault(_jsCookie);

	var _utility = __webpack_require__(39);

	var _utility2 = _interopRequireDefault(_utility);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

	      (0, _jquery2.default)(this._el).on('submit', function (e) {
	        e.preventDefault();
	        if (_this._recaptchaRequired) {
	          if (_this._recaptchaVerified) {
	            _this._validate();
	            if (_this._isValid && !_this._isBusy && !_this._isDisabled) {
	              _this._submit();
	              window.grecaptcha.reset();
	              (0, _jquery2.default)(_this._el).parents('.c-tip-ms__topics').addClass('recaptcha-js');
	              _this._recaptchaVerified = false;
	            }
	          } else {
	            (0, _jquery2.default)(_this._el).find('.' + ShareForm.CssClass.ERROR_MSG).remove();
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
	        var viewCount = _jsCookie2.default.get('screenerViews') ? parseInt(_jsCookie2.default.get('screenerViews'), 10) : 1;
	        if (viewCount >= 5 && !_this._recaptchainit) {
	          (0, _jquery2.default)(_this._el).parents('.c-tip-ms__topics').addClass('recaptcha-js');
	          _this._initRecaptcha();
	          _this._recaptchainit = true;
	        }
	        _jsCookie2.default.set('screenerViews', ++viewCount, { expires: 2 / 1440 });

	        (0, _jquery2.default)("#phone").focusout(function () {
	          (0, _jquery2.default)(this).removeAttr('placeholder');
	        });
	      });

	      // // Determine whether or not to initialize ReCAPTCHA. This should be
	      // // initialized only on every 10th view which is determined via an
	      // // incrementing cookie.
	      var viewCount = _jsCookie2.default.get('screenerViews') ? parseInt(_jsCookie2.default.get('screenerViews'), 10) : 1;
	      if (viewCount >= 5 && !this._recaptchainit) {
	        (0, _jquery2.default)(this._el).parents('.c-tip-ms__topics').addClass('recaptcha-js');
	        this._initRecaptcha();
	        this._recaptchainit = true;
	      }
	      this._initialized = true;
	      return this;
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
	      var $tel = (0, _jquery2.default)(this._el).find('input[type="tel"]');
	      // Clear any existing error messages.
	      (0, _jquery2.default)(this._el).find('.' + ShareForm.CssClass.ERROR_MSG).remove();

	      if ($tel.length) {
	        validity = this._validatePhoneNumber($tel[0]);
	      }

	      this._isValid = validity;
	      if (this._isValid) {
	        (0, _jquery2.default)(this._el).removeClass(ShareForm.CssClass.ERROR);
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
	      // var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/; 
	      var phoneno = /^\+?[1-9]\d{1,14}$/;
	      if (!input.value.match(phoneno)) {
	        this._showError(ShareForm.Message.PHONE);
	        return false;
	      }
	      return true;
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
	      if ((0, _jquery2.default)(input).val()) {
	        return true;
	      }
	      this._showError(ShareForm.Message.REQUIRED);
	      (0, _jquery2.default)(input).one('keyup', function () {
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
	      (0, _jquery2.default)('#sms-form-msg').addClass(ShareForm.CssClass.ERROR).text(_utility2.default.localize(msg));
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
	      (0, _jquery2.default)('#phone').attr("placeholder", _utility2.default.localize(msg));
	      (0, _jquery2.default)('#smsbutton').text("Send Another");
	      (0, _jquery2.default)('#sms-form-msg').addClass(ShareForm.CssClass.SUCCESS).text('');
	      (0, _jquery2.default)(this._el).parents('.c-tip-ms__topics').removeClass('success-js');
	      (0, _jquery2.default)(this._el).parents('.c-tip-ms__topics').addClass('success-js');
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
	      var payload = (0, _jquery2.default)(this._el).serialize();
	      (0, _jquery2.default)(this._el).find('input').prop('disabled', true);
	      return _jquery2.default.post((0, _jquery2.default)(this._el).attr('action'), payload).done(function (response) {
	        if (response.success) {
	          _this2._el.reset();
	          _this2._showSuccess(ShareForm.Message.SUCCESS);
	          _this2._isDisabled = true;
	          (0, _jquery2.default)(_this2._el).one('keyup', 'input', function () {
	            (0, _jquery2.default)(_this2._el).removeClass(ShareForm.CssClass.SUCCESS);
	            _this2._isDisabled = false;
	          });
	        } else {
	          _this2._showError(JSON.stringify(response.message));
	        }
	      }).fail(function () {
	        this._showError(ShareForm.Message.SERVER);
	      }).always(function () {
	        (0, _jquery2.default)(_this2._el).find('input').prop('disabled', false);
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

	      var $script = (0, _jquery2.default)(document.createElement('script'));
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
	        (0, _jquery2.default)(_this3._el).parents('.c-tip-ms__topics').removeClass('recaptcha-js');
	      };

	      window.screenerRecaptchaReset = function () {
	        _this3._recaptchaVerified = false;
	        (0, _jquery2.default)(_this3._el).parents('.c-tip-ms__topics').addClass('recaptcha-js');
	      };

	      this._recaptchaRequired = true;
	      (0, _jquery2.default)('head').append($script);
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
	  HIDDEN: 'hidden',
	  SUBMIT_BTN: 'btn-submit',
	  SUCCESS: 'success'
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

	exports.default = ShareForm;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
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
	    (0, _forEach2.default)(stickyContent, function (stickyContentElem) {
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
	};

	var _forEach = __webpack_require__(2);

	var _forEach2 = _interopRequireDefault(_forEach);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var $stickyNavs = $('.js-sticky');
	  if ($stickyNavs.length) {
	    $stickyNavs.each(function () {
	      var $outerContainer = $(this).closest('.js-sticky-container');
	      var $article = $outerContainer.find('.js-sticky-article');
	      stickyNav($(this), $outerContainer, $article);
	    });
	  }
	};

	var _throttle = __webpack_require__(15);

	var _throttle2 = _interopRequireDefault(_throttle);

	var _debounce = __webpack_require__(11);

	var _debounce2 = _interopRequireDefault(_debounce);

	var _imagesready = __webpack_require__(40);

	var _imagesready2 = _interopRequireDefault(_imagesready);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	  var switchPointBottom = 0; // Point at which to "freeze" the sidebar so it doesn't overlap the footer
	  var leftOffset = 0; // Amount sidebar should be set from the left side
	  var elemWidth = 0; // Width in pixels of sidebar
	  var elemHeight = 0; // Height in pixels of sidebar

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
	      if ($elem.offset().top + elemHeight > switchPointBottom) {
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

	    $(window).on('scroll.fixedSidebar', (0, _throttle2.default)(function () {
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
	    $(window).on('resize.fixedSidebar', (0, _debounce2.default)(function () {
	      onResize();
	    }, 100));

	    (0, _imagesready2.default)(document.body).then(function () {
	      onResize();
	    });
	  }

	  initialize();
	} /**
	  * Sticky Nav module
	  * @module modules/stickyNav
	  */
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (openClass) {
	  if (!openClass) {
	    openClass = 'is-open';
	  }
	  var linkActiveClass = 'is-active';
	  var toggleElems = document.querySelectorAll('[data-toggle]');

	  /**
	  * For each toggle element, get its target from the data-toggle attribute.
	  * Bind an event handler to toggle the openClass on/off on the target element
	  * when the toggle element is clicked.
	  */
	  if (toggleElems) {
	    (0, _forEach2.default)(toggleElems, function (toggleElem) {
	      var targetElemSelector = (0, _dataset2.default)(toggleElem, 'toggle');
	      if (targetElemSelector) {
	        var targetElem = document.getElementById(targetElemSelector);
	        if (!targetElem) {
	          return false;
	        }
	        toggleElem.addEventListener('click', function (e) {
	          e.preventDefault();
	          toggleElem.classList.toggle(linkActiveClass);
	          targetElem.classList.toggle(openClass);
	          var toggleEvent = void 0;
	          if (typeof window.CustomEvent === 'function') {
	            toggleEvent = new CustomEvent('changeOpenState', { detail: targetElem.classList.contains(openClass) });
	          } else {
	            toggleEvent = document.createEvent('CustomEvent');
	            toggleEvent.initCustomEvent('changeOpenState', true, true, { detail: targetElem.classList.contains(openClass) });
	          }
	          targetElem.dispatchEvent(toggleEvent);
	        });
	      }
	    });
	  }
	};

	var _forEach = __webpack_require__(2);

	var _forEach2 = _interopRequireDefault(_forEach);

	var _dataset = __webpack_require__(7);

	var _dataset2 = _interopRequireDefault(_dataset);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery) {'use strict';

	/*lets define our scope*/
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _underscore = __webpack_require__(72);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	  var match = _underscore2.default.findWhere(localizedStrings, {
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

	exports.default = Utility;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function($) {/* imagesready v0.2.2 - 2015-07-04T06:22:14.435Z - https://github.com/r-park/images-ready */
	;(function(root, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * JavaScript Cookie v2.1.4
	 * https://github.com/js-cookie/js-cookie
	 *
	 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
	 * Released under the MIT license
	 */
	;(function (factory) {
		var registeredInModuleLoader = false;
		if (true) {
			!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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

					if (cookie.charAt(0) === '"') {
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
/* 42 */
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
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(50),
	    isArguments = __webpack_require__(63),
	    isArray = __webpack_require__(12),
	    isBuffer = __webpack_require__(64),
	    isIndex = __webpack_require__(56),
	    isTypedArray = __webpack_require__(67);

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
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(46),
	    createBaseEach = __webpack_require__(53);

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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(54);

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
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(45),
	    keys = __webpack_require__(68);

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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(3),
	    isObjectLike = __webpack_require__(5);

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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(3),
	    isLength = __webpack_require__(14),
	    isObjectLike = __webpack_require__(5);

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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	var isPrototype = __webpack_require__(57),
	    nativeKeys = __webpack_require__(58);

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
/* 50 */
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
/* 51 */
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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(62);

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
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(13);

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
/* 54 */
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
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(9);

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
/* 56 */
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
/* 57 */
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
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(61);

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = overArg(Object.keys, Object);

	module.exports = nativeKeys;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(10);

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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)(module)))

/***/ }),
/* 60 */
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
/* 61 */
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
/* 62 */
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
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsArguments = __webpack_require__(47),
	    isObjectLike = __webpack_require__(5);

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
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(6),
	    stubFalse = __webpack_require__(70);

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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)(module)))

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(3),
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
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(3),
	    isObjectLike = __webpack_require__(5);

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
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsTypedArray = __webpack_require__(48),
	    baseUnary = __webpack_require__(51),
	    nodeUtil = __webpack_require__(59);

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
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayLikeKeys = __webpack_require__(43),
	    baseKeys = __webpack_require__(49),
	    isArrayLike = __webpack_require__(13);

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
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(6);

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
/* 70 */
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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(4),
	    isSymbol = __webpack_require__(66);

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
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.7.0
	//     http://underscorejs.org
	//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
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
	    concat           = ArrayProto.concat,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind;

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
	  _.VERSION = '1.7.0';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var createCallback = function(func, context, argCount) {
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
	  _.iteratee = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return createCallback(value, context, argCount);
	    if (_.isObject(value)) return _.matches(value);
	    return _.property(value);
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    if (obj == null) return obj;
	    iteratee = createCallback(iteratee, context);
	    var i, length = obj.length;
	    if (length === +length) {
	      for (i = 0; i < length; i++) {
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
	    if (obj == null) return [];
	    iteratee = _.iteratee(iteratee, context);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length),
	        currentKey;
	    for (var index = 0; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  var reduceError = 'Reduce of empty array with no initial value';

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
	    if (obj == null) obj = [];
	    iteratee = createCallback(iteratee, context, 4);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        index = 0, currentKey;
	    if (arguments.length < 3) {
	      if (!length) throw new TypeError(reduceError);
	      memo = obj[keys ? keys[index++] : index++];
	    }
	    for (; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      memo = iteratee(memo, obj[currentKey], currentKey, obj);
	    }
	    return memo;
	  };

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
	    if (obj == null) obj = [];
	    iteratee = createCallback(iteratee, context, 4);
	    var keys = obj.length !== + obj.length && _.keys(obj),
	        index = (keys || obj).length,
	        currentKey;
	    if (arguments.length < 3) {
	      if (!index) throw new TypeError(reduceError);
	      memo = obj[keys ? keys[--index] : --index];
	    }
	    while (index--) {
	      currentKey = keys ? keys[index] : index;
	      memo = iteratee(memo, obj[currentKey], currentKey, obj);
	    }
	    return memo;
	  };

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var result;
	    predicate = _.iteratee(predicate, context);
	    _.some(obj, function(value, index, list) {
	      if (predicate(value, index, list)) {
	        result = value;
	        return true;
	      }
	    });
	    return result;
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    if (obj == null) return results;
	    predicate = _.iteratee(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    if (obj == null) return true;
	    predicate = _.iteratee(predicate, context);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        index, currentKey;
	    for (index = 0; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    if (obj == null) return false;
	    predicate = _.iteratee(predicate, context);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        index, currentKey;
	    for (index = 0; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given value (using `===`).
	  // Aliased as `include`.
	  _.contains = _.include = function(obj, target) {
	    if (obj == null) return false;
	    if (obj.length !== +obj.length) obj = _.values(obj);
	    return _.indexOf(obj, target) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      return (isFunc ? method : value[method]).apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matches(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matches(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = obj.length === +obj.length ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = _.iteratee(iteratee, context);
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
	      obj = obj.length === +obj.length ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = _.iteratee(iteratee, context);
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
	    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
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
	      if (obj.length !== +obj.length) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = _.iteratee(iteratee, context);
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
	      iteratee = _.iteratee(iteratee, context);
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

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = _.iteratee(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = array.length;
	    while (low < high) {
	      var mid = low + high >>> 1;
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (obj.length === +obj.length) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = _.iteratee(predicate, context);
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
	    if (n < 0) return [];
	    return slice.call(array, 0, n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N. The **guard** check allows it to work with
	  // `_.map`.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array. The **guard** check allows it to work with `_.map`.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return slice.call(array, Math.max(array.length - n, 0));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array. The **guard**
	  // check allows it to work with `_.map`.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, output) {
	    if (shallow && _.every(input, _.isArray)) {
	      return concat.apply(output, input);
	    }
	    for (var i = 0, length = input.length; i < length; i++) {
	      var value = input[i];
	      if (!_.isArray(value) && !_.isArguments(value)) {
	        if (!strict) output.push(value);
	      } else if (shallow) {
	        push.apply(output, value);
	      } else {
	        flatten(value, shallow, strict, output);
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false, []);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (array == null) return [];
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = array.length; i < length; i++) {
	      var value = array[i];
	      if (isSorted) {
	        if (!i || seen !== value) result.push(value);
	        seen = value;
	      } else if (iteratee) {
	        var computed = iteratee(value, i, array);
	        if (_.indexOf(seen, computed) < 0) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (_.indexOf(result, value) < 0) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true, []));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    if (array == null) return [];
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = array.length; i < length; i++) {
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
	    var rest = flatten(slice.call(arguments, 1), true, true, []);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function(array) {
	    if (array == null) return [];
	    var length = _.max(arguments, 'length').length;
	    var results = Array(length);
	    for (var i = 0; i < length; i++) {
	      results[i] = _.pluck(arguments, i);
	    }
	    return results;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    if (list == null) return {};
	    var result = {};
	    for (var i = 0, length = list.length; i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = function(array, item, isSorted) {
	    if (array == null) return -1;
	    var i = 0, length = array.length;
	    if (isSorted) {
	      if (typeof isSorted == 'number') {
	        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
	      } else {
	        i = _.sortedIndex(array, item);
	        return array[i] === item ? i : -1;
	      }
	    }
	    for (; i < length; i++) if (array[i] === item) return i;
	    return -1;
	  };

	  _.lastIndexOf = function(array, item, from) {
	    if (array == null) return -1;
	    var idx = array.length;
	    if (typeof from == 'number') {
	      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
	    }
	    while (--idx >= 0) if (array[idx] === item) return idx;
	    return -1;
	  };

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (arguments.length <= 1) {
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

	  // Reusable constructor function for prototype setting.
	  var Ctor = function(){};

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    var args, bound;
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    args = slice.call(arguments, 2);
	    bound = function() {
	      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
	      Ctor.prototype = func.prototype;
	      var self = new Ctor;
	      Ctor.prototype = null;
	      var result = func.apply(self, args.concat(slice.call(arguments)));
	      if (_.isObject(result)) return result;
	      return self;
	    };
	    return bound;
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    return function() {
	      var position = 0;
	      var args = boundArgs.slice();
	      for (var i = 0, length = args.length; i < length; i++) {
	        if (args[i] === _) args[i] = arguments[position++];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return func.apply(this, args);
	    };
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
	      var address = hasher ? hasher.apply(this, arguments) : key;
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
	  _.defer = function(func) {
	    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
	  };

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
	        clearTimeout(timeout);
	        timeout = null;
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

	      if (last < wait && last > 0) {
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

	  // Returns a function that will only be executed after being called N times.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed before being called N times.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      } else {
	        func = null;
	      }
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  // Object Functions
	  // ----------------

	  // Retrieve the names of an object's properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
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
	  _.extend = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    var source, prop;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	      source = arguments[i];
	      for (prop in source) {
	        if (hasOwnProperty.call(source, prop)) {
	            obj[prop] = source[prop];
	        }
	      }
	    }
	    return obj;
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(obj, iteratee, context) {
	    var result = {}, key;
	    if (obj == null) return result;
	    if (_.isFunction(iteratee)) {
	      iteratee = createCallback(iteratee, context);
	      for (key in obj) {
	        var value = obj[key];
	        if (iteratee(value, key, obj)) result[key] = value;
	      }
	    } else {
	      var keys = concat.apply([], slice.call(arguments, 1));
	      obj = new Object(obj);
	      for (var i = 0, length = keys.length; i < length; i++) {
	        key = keys[i];
	        if (key in obj) result[key] = obj[key];
	      }
	    }
	    return result;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };

	  // Fill in a given object with default properties.
	  _.defaults = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	      var source = arguments[i];
	      for (var prop in source) {
	        if (obj[prop] === void 0) obj[prop] = source[prop];
	      }
	    }
	    return obj;
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
	    if (typeof a != 'object' || typeof b != 'object') return false;
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }
	    // Objects with different constructors are not equivalent, but `Object`s
	    // from different frames are.
	    var aCtor = a.constructor, bCtor = b.constructor;
	    if (
	      aCtor !== bCtor &&
	      // Handle Object.create(x) cases
	      'constructor' in a && 'constructor' in b &&
	      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	        _.isFunction(bCtor) && bCtor instanceof bCtor)
	    ) {
	      return false;
	    }
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	    var size, result;
	    // Recursively compare objects and arrays.
	    if (className === '[object Array]') {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      size = a.length;
	      result = size === b.length;
	      if (result) {
	        // Deep compare the contents, ignoring non-numeric properties.
	        while (size--) {
	          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
	        }
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      size = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      result = _.keys(b).length === size;
	      if (result) {
	        while (size--) {
	          // Deep compare each member
	          key = keys[size];
	          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
	        }
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return result;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b, [], []);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
	    for (var key in obj) if (_.has(obj, key)) return false;
	    return true;
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

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
	  if (true) {
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

	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  _.property = function(key) {
	    return function(obj) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
	  _.matches = function(attrs) {
	    var pairs = _.pairs(attrs), length = pairs.length;
	    return function(obj) {
	      if (obj == null) return !length;
	      obj = new Object(obj);
	      for (var i = 0; i < length; i++) {
	        var pair = pairs[i], key = pair[0];
	        if (pair[1] !== obj[key] || !(key in obj)) return false;
	      }
	      return true;
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = createCallback(iteratee, context, 1);
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
	  _.result = function(object, property) {
	    if (object == null) return void 0;
	    var value = object[property];
	    return _.isFunction(value) ? object[property]() : value;
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
	  var result = function(obj) {
	    return this._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result.call(this, func.apply(_, args));
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
	      return result.call(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result.call(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ })
/******/ ]);
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

	var _globalSearch = __webpack_require__(24);

	var _globalSearch2 = _interopRequireDefault(_globalSearch);

	var _toggleOpen = __webpack_require__(38);

	var _toggleOpen2 = _interopRequireDefault(_toggleOpen);

	var _accordion = __webpack_require__(15);

	var _accordion2 = _interopRequireDefault(_accordion);

	var _simpleAccordion = __webpack_require__(34);

	var _simpleAccordion2 = _interopRequireDefault(_simpleAccordion);

	var _offcanvas = __webpack_require__(26);

	var _offcanvas2 = _interopRequireDefault(_offcanvas);

	var _overlay = __webpack_require__(27);

	var _overlay2 = _interopRequireDefault(_overlay);

	var _stickNav = __webpack_require__(36);

	var _stickNav2 = _interopRequireDefault(_stickNav);

	var _sectionHighlighter = __webpack_require__(32);

	var _sectionHighlighter2 = _interopRequireDefault(_sectionHighlighter);

	var _staticColumn = __webpack_require__(35);

	var _staticColumn2 = _interopRequireDefault(_staticColumn);

	var _searchResultsHeader = __webpack_require__(31);

	var _searchResultsHeader2 = _interopRequireDefault(_searchResultsHeader);

	var _alert = __webpack_require__(16);

	var _alert2 = _interopRequireDefault(_alert);

	var _bsdtoolsSignup = __webpack_require__(17);

	var _bsdtoolsSignup2 = _interopRequireDefault(_bsdtoolsSignup);

	var _formEffects = __webpack_require__(22);

	var _formEffects2 = _interopRequireDefault(_formEffects);

	var _facets = __webpack_require__(21);

	var _facets2 = _interopRequireDefault(_facets);

	var _owlSettings = __webpack_require__(28);

	var _owlSettings2 = _interopRequireDefault(_owlSettings);

	var _iOS7Hack = __webpack_require__(25);

	var _iOS7Hack2 = _interopRequireDefault(_iOS7Hack);

	var _shareForm = __webpack_require__(33);

	var _shareForm2 = _interopRequireDefault(_shareForm);

	var _captchaResize = __webpack_require__(18);

	var _captchaResize2 = _interopRequireDefault(_captchaResize);

	var _rotatingTextAnimation = __webpack_require__(30);

	var _rotatingTextAnimation2 = _interopRequireDefault(_rotatingTextAnimation);

	var _toggleMenu = __webpack_require__(37);

	var _toggleMenu2 = _interopRequireDefault(_toggleMenu);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function ready(fn) {
	  if (document.readyState === 'loading') {
	    document.addEventListener('DOMContentLoaded', fn);
	  } else {
	    fn();
	  }
	}
	//import currentSection from './modules/currentSection.js';


	function init() {
	  (0, _globalSearch2.default)();
	  (0, _toggleOpen2.default)('is-open');
	  (0, _alert2.default)('is-open');
	  (0, _offcanvas2.default)();
	  (0, _accordion2.default)();
	  (0, _simpleAccordion2.default)();
	  (0, _overlay2.default)();
	  // Search results page
	  (0, _searchResultsHeader2.default)();
	  // FacetWP pages
	  (0, _facets2.default)();
	  // Homepage
	  (0, _staticColumn2.default)();
	  (0, _stickNav2.default)();
	  //currentSection();
	  (0, _bsdtoolsSignup2.default)();
	  (0, _formEffects2.default)();
	  (0, _owlSettings2.default)();
	  (0, _iOS7Hack2.default)();
	  (0, _captchaResize2.default)();
	  (0, _rotatingTextAnimation2.default)();
	  (0, _sectionHighlighter2.default)();
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

	var arrayEach = __webpack_require__(46),
	    baseEach = __webpack_require__(48),
	    castFunction = __webpack_require__(56),
	    isArray = __webpack_require__(11);

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

	var Symbol = __webpack_require__(8),
	    getRawTag = __webpack_require__(59),
	    objectToString = __webpack_require__(64);

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

	var freeGlobal = __webpack_require__(9);

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
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(6);

	/** Built-in value references. */
	var Symbol = root.Symbol;

	module.exports = Symbol;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

	module.exports = freeGlobal;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(4),
	    now = __webpack_require__(73),
	    toNumber = __webpack_require__(76);

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
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(69),
	    isLength = __webpack_require__(13);

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
/* 14 */
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
/* 15 */
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
/* 16 */
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

	var _readCookie = __webpack_require__(29);

	var _readCookie2 = _interopRequireDefault(_readCookie);

	var _dataset = __webpack_require__(7);

	var _dataset2 = _interopRequireDefault(_dataset);

	var _createCookie = __webpack_require__(19);

	var _createCookie2 = _interopRequireDefault(_createCookie);

	var _getDomain = __webpack_require__(23);

	var _getDomain2 = _interopRequireDefault(_getDomain);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 17 */
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
	};

	/**
	* Validate a form and submit via the signup API
	*/
	__webpack_require__(39);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 18 */
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
/* 19 */
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
/* 20 */
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
/* 21 */
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
/* 22 */
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

	var _dispatchEvent = __webpack_require__(20);

	var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 23 */
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
/* 24 */
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
/* 25 */
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
/* 26 */
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
/* 27 */
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
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
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (cookieName, cookie) {
	  return (RegExp("(?:^|; )" + cookieName + "=([^;]*)").exec(cookie) || []).pop();
	};

/***/ }),
/* 30 */
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
/* 31 */
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
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var $navigationLinks = $('.js-section-set > li > a');
	  var $sections = $("section");
	  var $sectionsReversed = $($("section").get().reverse());
	  var sectionIdTonavigationLink = {};
	  //var eTop = $('#free-day-trips').offset().top;

	  $sections.each(function () {
	    sectionIdTonavigationLink[$(this).attr('id')] = $('.js-section-set > li > a[href="\#' + $(this).attr('id') + '"]');
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
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _jsCookie = __webpack_require__(44);

	var _jsCookie2 = _interopRequireDefault(_jsCookie);

	var _utility = __webpack_require__(40);

	var _utility2 = _interopRequireDefault(_utility);

	var _cleave = __webpack_require__(42);

	var _cleave2 = _interopRequireDefault(_cleave);

	__webpack_require__(41);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/* eslint no-undef: "off" */
	var Variables = __webpack_require__(45);

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
	      if (selected) this._maskPhone(selected);

	      (0, _jquery2.default)('.' + ShareForm.CssClass.SHOW_DISCLAIMER).on('focus', function () {
	        _this._disclaimer(true);
	      });

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
	     * Mask each phone number and properly format it
	     * @param  {HTMLElement} input the "tel" input to mask
	     * @return {constructor}       the input mask
	     */

	  }, {
	    key: '_maskPhone',
	    value: function _maskPhone(input) {
	      var cleave = new _cleave2.default(input, {
	        phone: true,
	        phoneRegionCode: 'us',
	        delimiter: '-'
	      });
	      input.cleave = cleave;
	      return input;
	    }

	    /**
	     * Toggles the disclaimer visibility
	     * @param  {Boolean} active wether the disclaimer should be visible or not
	     */

	  }, {
	    key: '_disclaimer',
	    value: function _disclaimer() {
	      var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	      var $el = (0, _jquery2.default)('#js-disclaimer');
	      var $class = visible ? 'addClass' : 'removeClass';
	      $el.attr('aria-hidden', !visible);
	      $el.attr(ShareForm.CssClass.HIDDEN, !visible);
	      $el[$class](ShareForm.CssClass.ANIMATE_DISCLAIMER);
	      // Scroll-to functionality for mobile
	      if (window.scrollTo && visible && window.innerWidth < Variables['screen-desktop']) {
	        var $target = (0, _jquery2.default)(e.target);
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
	      var $elParents = (0, _jquery2.default)(this._el).parents('.c-tip-ms__topics');
	      (0, _jquery2.default)('#sms-form-msg').addClass(ShareForm.CssClass.ERROR).text(_utility2.default.localize(msg));
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
	      var $elParents = (0, _jquery2.default)(this._el).parents('.c-tip-ms__topics');
	      (0, _jquery2.default)('#phone').attr("placeholder", _utility2.default.localize(msg));
	      (0, _jquery2.default)('#smsbutton').text("Send Another");
	      (0, _jquery2.default)('#sms-form-msg').addClass(ShareForm.CssClass.SUCCESS).text('');
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
	      var payload = (0, _jquery2.default)(this._el).serialize();
	      (0, _jquery2.default)(this._el).find('input').prop('disabled', true);
	      if ($spinner) {
	        $submit.disabled = true; // hide submit button
	        $spinner.style.cssText = ''; // show spinner
	      }
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

	exports.default = ShareForm;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  //$('.js-accordion > ul > li:has(ol)').addClass("has-sub");
	  $('.js-s-accordion > li > h3.js-s-accordion__header').append('<svg class="o-accordion__caret icon" aria-hidden="true"><use xlink:href="#caret-down"></use></svg>');

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
	    } else {
	      return true;
	    }
	  });
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

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

	var _throttle = __webpack_require__(75);

	var _throttle2 = _interopRequireDefault(_throttle);

	var _debounce = __webpack_require__(10);

	var _debounce2 = _interopRequireDefault(_debounce);

	var _imagesready = __webpack_require__(43);

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
	} /**
	  * Stick Nav module
	  * @module modules/stickyNav
	  */
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(function (window, $) {
	  'use strict';

	  // Attach site-wide event listeners.

	  $('body').on('click', '.js-simple-toggle', function (e) {
	    // Simple toggle that add/removes "active" and "hidden" classes, as well as
	    // applying appropriate aria-hidden value to a specified target.
	    // TODO: There are a few siimlar toggles on the site that could be
	    // refactored to use this class.
	    e.preventDefault();
	    var $target = $(e.currentTarget).attr('href') ? $($(e.currentTarget).attr('href')) : $($(e.currentTarget).data('target'));
	    $(e.currentTarget).toggleClass('active');
	    $target.toggleClass('active hidden').prop('aria-hidden', $target.hasClass('hidden'));
	  }).on('click', '.js-show-nav', function (e) {
	    console.log("i've been clicked");
	    // Shows the mobile nav by applying "nav-active" cass to the body.
	    e.preventDefault();
	    $(e.delegateTarget).addClass('nav-active');
	  }).on('click', '.js-hide-nav', function (e) {
	    console.log("i'm closing");
	    // Hides the mobile nav.
	    e.preventDefault();
	    $(e.delegateTarget).removeClass('nav-active');
	  });
	  // END TODO
	})(window, _jquery2.default); /* eslint-env browser */

/***/ }),
/* 38 */
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
/* 39 */
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
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _underscore = __webpack_require__(77);

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
/* 41 */
/***/ (function(module, exports) {

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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 42 */
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
/* 43 */
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
/* 44 */
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
/* 45 */
/***/ (function(module, exports) {

	module.exports = {"screen-small":375,"screen-medium":700,"screen-large":1024,"screen-xlarge":1200}

/***/ }),
/* 46 */
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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(54),
	    isArguments = __webpack_require__(67),
	    isArray = __webpack_require__(11),
	    isBuffer = __webpack_require__(68),
	    isIndex = __webpack_require__(60),
	    isTypedArray = __webpack_require__(71);

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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(50),
	    createBaseEach = __webpack_require__(57);

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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(58);

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
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(49),
	    keys = __webpack_require__(72);

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
/* 51 */
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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(3),
	    isLength = __webpack_require__(13),
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
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var isPrototype = __webpack_require__(61),
	    nativeKeys = __webpack_require__(62);

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
/* 54 */
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
/* 55 */
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
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(66);

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
/* 57 */
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
/* 58 */
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
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(8);

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
/* 60 */
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
/* 61 */
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
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(65);

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = overArg(Object.keys, Object);

	module.exports = nativeKeys;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(9);

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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)(module)))

/***/ }),
/* 64 */
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
/* 65 */
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
/* 66 */
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
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsArguments = __webpack_require__(51),
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
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(6),
	    stubFalse = __webpack_require__(74);

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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)(module)))

/***/ }),
/* 69 */
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
/* 70 */
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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsTypedArray = __webpack_require__(52),
	    baseUnary = __webpack_require__(55),
	    nodeUtil = __webpack_require__(63);

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
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayLikeKeys = __webpack_require__(47),
	    baseKeys = __webpack_require__(53),
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
/* 73 */
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
/* 74 */
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
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	var debounce = __webpack_require__(10),
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
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(4),
	    isSymbol = __webpack_require__(70);

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
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	//     Underscore.js 1.5.2
	//     http://underscorejs.org
	//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Establish the object that gets returned to break out of a loop iteration.
	  var breaker = {};

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
	    nativeForEach      = ArrayProto.forEach,
	    nativeMap          = ArrayProto.map,
	    nativeReduce       = ArrayProto.reduce,
	    nativeReduceRight  = ArrayProto.reduceRight,
	    nativeFilter       = ArrayProto.filter,
	    nativeEvery        = ArrayProto.every,
	    nativeSome         = ArrayProto.some,
	    nativeIndexOf      = ArrayProto.indexOf,
	    nativeLastIndexOf  = ArrayProto.lastIndexOf,
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
	  // the browser, add `_` as a global object via a string identifier,
	  // for Closure Compiler "advanced" mode.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.5.2';

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles objects with the built-in `forEach`, arrays, and raw objects.
	  // Delegates to **ECMAScript 5**'s native `forEach` if available.
	  var each = _.each = _.forEach = function(obj, iterator, context) {
	    if (obj == null) return;
	    if (nativeForEach && obj.forEach === nativeForEach) {
	      obj.forEach(iterator, context);
	    } else if (obj.length === +obj.length) {
	      for (var i = 0, length = obj.length; i < length; i++) {
	        if (iterator.call(context, obj[i], i, obj) === breaker) return;
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (var i = 0, length = keys.length; i < length; i++) {
	        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
	      }
	    }
	  };

	  // Return the results of applying the iterator to each element.
	  // Delegates to **ECMAScript 5**'s native `map` if available.
	  _.map = _.collect = function(obj, iterator, context) {
	    var results = [];
	    if (obj == null) return results;
	    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
	    each(obj, function(value, index, list) {
	      results.push(iterator.call(context, value, index, list));
	    });
	    return results;
	  };

	  var reduceError = 'Reduce of empty array with no initial value';

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
	  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
	    var initial = arguments.length > 2;
	    if (obj == null) obj = [];
	    if (nativeReduce && obj.reduce === nativeReduce) {
	      if (context) iterator = _.bind(iterator, context);
	      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
	    }
	    each(obj, function(value, index, list) {
	      if (!initial) {
	        memo = value;
	        initial = true;
	      } else {
	        memo = iterator.call(context, memo, value, index, list);
	      }
	    });
	    if (!initial) throw new TypeError(reduceError);
	    return memo;
	  };

	  // The right-associative version of reduce, also known as `foldr`.
	  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
	  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
	    var initial = arguments.length > 2;
	    if (obj == null) obj = [];
	    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
	      if (context) iterator = _.bind(iterator, context);
	      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
	    }
	    var length = obj.length;
	    if (length !== +length) {
	      var keys = _.keys(obj);
	      length = keys.length;
	    }
	    each(obj, function(value, index, list) {
	      index = keys ? keys[--length] : --length;
	      if (!initial) {
	        memo = obj[index];
	        initial = true;
	      } else {
	        memo = iterator.call(context, memo, obj[index], index, list);
	      }
	    });
	    if (!initial) throw new TypeError(reduceError);
	    return memo;
	  };

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, iterator, context) {
	    var result;
	    any(obj, function(value, index, list) {
	      if (iterator.call(context, value, index, list)) {
	        result = value;
	        return true;
	      }
	    });
	    return result;
	  };

	  // Return all the elements that pass a truth test.
	  // Delegates to **ECMAScript 5**'s native `filter` if available.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, iterator, context) {
	    var results = [];
	    if (obj == null) return results;
	    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
	    each(obj, function(value, index, list) {
	      if (iterator.call(context, value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, iterator, context) {
	    return _.filter(obj, function(value, index, list) {
	      return !iterator.call(context, value, index, list);
	    }, context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Delegates to **ECMAScript 5**'s native `every` if available.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, iterator, context) {
	    iterator || (iterator = _.identity);
	    var result = true;
	    if (obj == null) return result;
	    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
	    each(obj, function(value, index, list) {
	      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
	    });
	    return !!result;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Delegates to **ECMAScript 5**'s native `some` if available.
	  // Aliased as `any`.
	  var any = _.some = _.any = function(obj, iterator, context) {
	    iterator || (iterator = _.identity);
	    var result = false;
	    if (obj == null) return result;
	    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
	    each(obj, function(value, index, list) {
	      if (result || (result = iterator.call(context, value, index, list))) return breaker;
	    });
	    return !!result;
	  };

	  // Determine if the array or object contains a given value (using `===`).
	  // Aliased as `include`.
	  _.contains = _.include = function(obj, target) {
	    if (obj == null) return false;
	    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
	    return any(obj, function(value) {
	      return value === target;
	    });
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
	    return _.map(obj, function(value){ return value[key]; });
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs, first) {
	    if (_.isEmpty(attrs)) return first ? void 0 : [];
	    return _[first ? 'find' : 'filter'](obj, function(value) {
	      for (var key in attrs) {
	        if (attrs[key] !== value[key]) return false;
	      }
	      return true;
	    });
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.where(obj, attrs, true);
	  };

	  // Return the maximum element or (element-based computation).
	  // Can't optimize arrays of integers longer than 65,535 elements.
	  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
	  _.max = function(obj, iterator, context) {
	    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
	      return Math.max.apply(Math, obj);
	    }
	    if (!iterator && _.isEmpty(obj)) return -Infinity;
	    var result = {computed : -Infinity, value: -Infinity};
	    each(obj, function(value, index, list) {
	      var computed = iterator ? iterator.call(context, value, index, list) : value;
	      computed > result.computed && (result = {value : value, computed : computed});
	    });
	    return result.value;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iterator, context) {
	    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
	      return Math.min.apply(Math, obj);
	    }
	    if (!iterator && _.isEmpty(obj)) return Infinity;
	    var result = {computed : Infinity, value: Infinity};
	    each(obj, function(value, index, list) {
	      var computed = iterator ? iterator.call(context, value, index, list) : value;
	      computed < result.computed && (result = {value : value, computed : computed});
	    });
	    return result.value;
	  };

	  // Shuffle an array, using the modern version of the 
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var rand;
	    var index = 0;
	    var shuffled = [];
	    each(obj, function(value) {
	      rand = _.random(index++);
	      shuffled[index - 1] = shuffled[rand];
	      shuffled[rand] = value;
	    });
	    return shuffled;
	  };

	  // Sample **n** random values from an array.
	  // If **n** is not specified, returns a single random element from the array.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (arguments.length < 2 || guard) {
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // An internal function to generate lookup iterators.
	  var lookupIterator = function(value) {
	    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
	  };

	  // Sort the object's values by a criterion produced by an iterator.
	  _.sortBy = function(obj, value, context) {
	    var iterator = lookupIterator(value);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iterator.call(context, value, index, list)
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
	    return function(obj, value, context) {
	      var result = {};
	      var iterator = value == null ? _.identity : lookupIterator(value);
	      each(obj, function(value, index) {
	        var key = iterator.call(context, value, index, obj);
	        behavior(result, key, value);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, key, value) {
	    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, key, value) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, key) {
	    _.has(result, key) ? result[key]++ : result[key] = 1;
	  });

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iterator, context) {
	    iterator = iterator == null ? _.identity : lookupIterator(iterator);
	    var value = iterator.call(context, obj);
	    var low = 0, high = array.length;
	    while (low < high) {
	      var mid = (low + high) >>> 1;
	      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
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
	    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N. The **guard** check allows it to work with
	  // `_.map`.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array. The **guard** check allows it to work with `_.map`.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if ((n == null) || guard) {
	      return array[array.length - 1];
	    } else {
	      return slice.call(array, Math.max(array.length - n, 0));
	    }
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array. The **guard**
	  // check allows it to work with `_.map`.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, (n == null) || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, output) {
	    if (shallow && _.every(input, _.isArray)) {
	      return concat.apply(output, input);
	    }
	    each(input, function(value) {
	      if (_.isArray(value) || _.isArguments(value)) {
	        shallow ? push.apply(output, value) : flatten(value, shallow, output);
	      } else {
	        output.push(value);
	      }
	    });
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, []);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iterator, context) {
	    if (_.isFunction(isSorted)) {
	      context = iterator;
	      iterator = isSorted;
	      isSorted = false;
	    }
	    var initial = iterator ? _.map(array, iterator, context) : array;
	    var results = [];
	    var seen = [];
	    each(initial, function(value, index) {
	      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
	        seen.push(value);
	        results.push(array[index]);
	      }
	    });
	    return results;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(_.flatten(arguments, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var rest = slice.call(arguments, 1);
	    return _.filter(_.uniq(array), function(item) {
	      return _.every(rest, function(other) {
	        return _.indexOf(other, item) >= 0;
	      });
	    });
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
	    return _.filter(array, function(value){ return !_.contains(rest, value); });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    var length = _.max(_.pluck(arguments, "length").concat(0));
	    var results = new Array(length);
	    for (var i = 0; i < length; i++) {
	      results[i] = _.pluck(arguments, '' + i);
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

	  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
	  // we need this function. Return the position of the first occurrence of an
	  // item in an array, or -1 if the item is not included in the array.
	  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = function(array, item, isSorted) {
	    if (array == null) return -1;
	    var i = 0, length = array.length;
	    if (isSorted) {
	      if (typeof isSorted == 'number') {
	        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
	      } else {
	        i = _.sortedIndex(array, item);
	        return array[i] === item ? i : -1;
	      }
	    }
	    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
	    for (; i < length; i++) if (array[i] === item) return i;
	    return -1;
	  };

	  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
	  _.lastIndexOf = function(array, item, from) {
	    if (array == null) return -1;
	    var hasIndex = from != null;
	    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
	      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
	    }
	    var i = (hasIndex ? from : array.length);
	    while (i--) if (array[i] === item) return i;
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
	    step = arguments[2] || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var idx = 0;
	    var range = new Array(length);

	    while(idx < length) {
	      range[idx++] = start;
	      start += step;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Reusable constructor function for prototype setting.
	  var ctor = function(){};

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    var args, bound;
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError;
	    args = slice.call(arguments, 2);
	    return bound = function() {
	      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
	      ctor.prototype = func.prototype;
	      var self = new ctor;
	      ctor.prototype = null;
	      var result = func.apply(self, args.concat(slice.call(arguments)));
	      if (Object(result) === result) return result;
	      return self;
	    };
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context.
	  _.partial = function(func) {
	    var args = slice.call(arguments, 1);
	    return function() {
	      return func.apply(this, args.concat(slice.call(arguments)));
	    };
	  };

	  // Bind all of an object's methods to that object. Useful for ensuring that
	  // all callbacks defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var funcs = slice.call(arguments, 1);
	    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
	    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memo = {};
	    hasher || (hasher = _.identity);
	    return function() {
	      var key = hasher.apply(this, arguments);
	      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
	    };
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){ return func.apply(null, args); }, wait);
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
	    options || (options = {});
	    var later = function() {
	      previous = options.leading === false ? 0 : new Date;
	      timeout = null;
	      result = func.apply(context, args);
	    };
	    return function() {
	      var now = new Date;
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0) {
	        clearTimeout(timeout);
	        timeout = null;
	        previous = now;
	        result = func.apply(context, args);
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
	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = new Date();
	      var later = function() {
	        var last = (new Date()) - timestamp;
	        if (last < wait) {
	          timeout = setTimeout(later, wait - last);
	        } else {
	          timeout = null;
	          if (!immediate) result = func.apply(context, args);
	        }
	      };
	      var callNow = immediate && !timeout;
	      if (!timeout) {
	        timeout = setTimeout(later, wait);
	      }
	      if (callNow) result = func.apply(context, args);
	      return result;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = function(func) {
	    var ran = false, memo;
	    return function() {
	      if (ran) return memo;
	      ran = true;
	      memo = func.apply(this, arguments);
	      func = null;
	      return memo;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return function() {
	      var args = [func];
	      push.apply(args, arguments);
	      return wrapper.apply(this, args);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var funcs = arguments;
	    return function() {
	      var args = arguments;
	      for (var i = funcs.length - 1; i >= 0; i--) {
	        args = [funcs[i].apply(this, args)];
	      }
	      return args[0];
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

	  // Object Functions
	  // ----------------

	  // Retrieve the names of an object's properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = nativeKeys || function(obj) {
	    if (obj !== Object(obj)) throw new TypeError('Invalid object');
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = new Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = new Array(length);
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
	    each(slice.call(arguments, 1), function(source) {
	      if (source) {
	        for (var prop in source) {
	          obj[prop] = source[prop];
	        }
	      }
	    });
	    return obj;
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(obj) {
	    var copy = {};
	    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
	    each(keys, function(key) {
	      if (key in obj) copy[key] = obj[key];
	    });
	    return copy;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj) {
	    var copy = {};
	    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
	    for (var key in obj) {
	      if (!_.contains(keys, key)) copy[key] = obj[key];
	    }
	    return copy;
	  };

	  // Fill in a given object with default properties.
	  _.defaults = function(obj) {
	    each(slice.call(arguments, 1), function(source) {
	      if (source) {
	        for (var prop in source) {
	          if (obj[prop] === void 0) obj[prop] = source[prop];
	        }
	      }
	    });
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
	    if (a === b) return a !== 0 || 1 / a == 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className != toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, dates, and booleans are compared by value.
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return a == String(b);
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
	        // other numeric values.
	        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a == +b;
	      // RegExps are compared by their source patterns and flags.
	      case '[object RegExp]':
	        return a.source == b.source &&
	               a.global == b.global &&
	               a.multiline == b.multiline &&
	               a.ignoreCase == b.ignoreCase;
	    }
	    if (typeof a != 'object' || typeof b != 'object') return false;
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] == a) return bStack[length] == b;
	    }
	    // Objects with different constructors are not equivalent, but `Object`s
	    // from different frames are.
	    var aCtor = a.constructor, bCtor = b.constructor;
	    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
	                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
	      return false;
	    }
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	    var size = 0, result = true;
	    // Recursively compare objects and arrays.
	    if (className == '[object Array]') {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      size = a.length;
	      result = size == b.length;
	      if (result) {
	        // Deep compare the contents, ignoring non-numeric properties.
	        while (size--) {
	          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
	        }
	      }
	    } else {
	      // Deep compare objects.
	      for (var key in a) {
	        if (_.has(a, key)) {
	          // Count the expected number of properties.
	          size++;
	          // Deep compare each member.
	          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
	        }
	      }
	      // Ensure that both objects contain the same number of properties.
	      if (result) {
	        for (key in b) {
	          if (_.has(b, key) && !(size--)) break;
	        }
	        result = !size;
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
	    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
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
	    return toString.call(obj) == '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    return obj === Object(obj);
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
	  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) == '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return !!(obj && _.has(obj, 'callee'));
	    };
	  }

	  // Optimize `isFunction` if appropriate.
	  if (true) {
	    _.isFunction = function(obj) {
	      return typeof obj === 'function';
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj != +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
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
	    return hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iterators.
	  _.identity = function(value) {
	    return value;
	  };

	  // Run a function **n** times.
	  _.times = function(n, iterator, context) {
	    var accum = Array(Math.max(0, n));
	    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
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

	  // List of HTML entities for escaping.
	  var entityMap = {
	    escape: {
	      '&': '&amp;',
	      '<': '&lt;',
	      '>': '&gt;',
	      '"': '&quot;',
	      "'": '&#x27;'
	    }
	  };
	  entityMap.unescape = _.invert(entityMap.escape);

	  // Regexes containing the keys and values listed immediately above.
	  var entityRegexes = {
	    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
	    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
	  };

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  _.each(['escape', 'unescape'], function(method) {
	    _[method] = function(string) {
	      if (string == null) return '';
	      return ('' + string).replace(entityRegexes[method], function(match) {
	        return entityMap[method][match];
	      });
	    };
	  });

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property) {
	    if (object == null) return void 0;
	    var value = object[property];
	    return _.isFunction(value) ? value.call(object) : value;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result.call(this, func.apply(_, args));
	      };
	    });
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
	    '\t':     't',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  _.template = function(text, data, settings) {
	    var render;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = new RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset)
	        .replace(escaper, function(match) { return '\\' + escapes[match]; });

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      }
	      if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      }
	      if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }
	      index = offset + match.length;
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + "return __p;\n";

	    try {
	      render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    if (data) return render(data, _);
	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled function source as a convenience for precompilation.
	    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function, which will delegate to the wrapper.
	  _.chain = function(obj) {
	    return _(obj).chain();
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

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
	      return result.call(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result.call(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  _.extend(_.prototype, {

	    // Start chaining a wrapped Underscore object.
	    chain: function() {
	      this._chain = true;
	      return this;
	    },

	    // Extracts the result from a wrapped and chained object.
	    value: function() {
	      return this._wrapped;
	    }

	  });

	}).call(this);


/***/ })
/******/ ]);
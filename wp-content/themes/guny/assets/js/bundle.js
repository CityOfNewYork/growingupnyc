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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _globalSearch = __webpack_require__(45);

	var _globalSearch2 = _interopRequireDefault(_globalSearch);

	var _toggleOpen = __webpack_require__(53);

	var _toggleOpen2 = _interopRequireDefault(_toggleOpen);

	var _accordion = __webpack_require__(40);

	var _accordion2 = _interopRequireDefault(_accordion);

	var _offcanvas = __webpack_require__(46);

	var _offcanvas2 = _interopRequireDefault(_offcanvas);

	var _overlay = __webpack_require__(47);

	var _overlay2 = _interopRequireDefault(_overlay);

	var _stickyNav = __webpack_require__(52);

	var _stickyNav2 = _interopRequireDefault(_stickyNav);

	var _currentSection = __webpack_require__(43);

	var _currentSection2 = _interopRequireDefault(_currentSection);

	var _parallax = __webpack_require__(48);

	var _parallax2 = _interopRequireDefault(_parallax);

	var _staticColumn = __webpack_require__(51);

	var _staticColumn2 = _interopRequireDefault(_staticColumn);

	var _searchResultsHeader = __webpack_require__(50);

	var _searchResultsHeader2 = _interopRequireDefault(_searchResultsHeader);

	var _alert = __webpack_require__(41);

	var _alert2 = _interopRequireDefault(_alert);

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
	  // Homepage
	  (0, _staticColumn2.default)();
	  (0, _parallax2.default)();
	  (0, _stickyNav2.default)();
	  (0, _currentSection2.default)();
	}

	ready(init);

	// Make certain functions available globally
	window.accordion = _accordion2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var checkGlobal = __webpack_require__(78);

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = checkGlobal(typeof global == 'object' && global);

	/** Detect free variable `self`. */
	var freeSelf = checkGlobal(typeof self == 'object' && self);

	/** Detect `this` as the global object. */
	var thisGlobal = checkGlobal(typeof this == 'object' && this);

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

	module.exports = root;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @type {Function}
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var arrayEach = __webpack_require__(62),
	    baseEach = __webpack_require__(64),
	    baseIteratee = __webpack_require__(71),
	    isArray = __webpack_require__(2);

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
	 * _([1, 2]).forEach(function(value) {
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
	  return func(collection, baseIteratee(iteratee, 3));
	}

	module.exports = forEach;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
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
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsNative = __webpack_require__(70),
	    getValue = __webpack_require__(88);

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


/***/ },
/* 6 */
/***/ function(module, exports) {

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
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var listCacheClear = __webpack_require__(99),
	    listCacheDelete = __webpack_require__(100),
	    listCacheGet = __webpack_require__(101),
	    listCacheHas = __webpack_require__(102),
	    listCacheSet = __webpack_require__(103);

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(119);

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to search.
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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var isKeyable = __webpack_require__(96);

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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(2),
	    isSymbol = __webpack_require__(14);

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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(5);

	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');

	module.exports = nativeCreate;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var isSymbol = __webpack_require__(14);

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


/***/ },
/* 13 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length,
	 *  else `false`.
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


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(6);

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
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
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}

	module.exports = isSymbol;


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var mapCacheClear = __webpack_require__(104),
	    mapCacheDelete = __webpack_require__(105),
	    mapCacheGet = __webpack_require__(106),
	    mapCacheHas = __webpack_require__(107),
	    mapCacheSet = __webpack_require__(108);

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

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


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(4),
	    now = __webpack_require__(126),
	    toNumber = __webpack_require__(128);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeMin = Math.min;

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide an options object to indicate whether `func` should be invoked on
	 * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent calls
	 * to the debounced function return the result of the last `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	 * on the trailing edge of the timeout only if the debounced function is
	 * invoked more than once during the `wait` timeout.
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


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(84),
	    isFunction = __webpack_require__(19),
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
	  return value != null && isLength(getLength(value)) && !isFunction(value);
	}

	module.exports = isArrayLike;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(4);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	module.exports = isFunction;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var baseHas = __webpack_require__(28),
	    baseKeys = __webpack_require__(72),
	    indexKeys = __webpack_require__(95),
	    isArrayLike = __webpack_require__(18),
	    isIndex = __webpack_require__(34),
	    isPrototype = __webpack_require__(98);

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
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
	  var isProto = isPrototype(object);
	  if (!(isProto || isArrayLike(object))) {
	    return baseKeys(object);
	  }
	  var indexes = indexKeys(object),
	      skipIndexes = !!indexes,
	      result = indexes || [],
	      length = result.length;

	  for (var key in object) {
	    if (baseHas(object, key) &&
	        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
	        !(isProto && key == 'constructor')) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keys;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var debounce = __webpack_require__(17),
	    isObject = __webpack_require__(4);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a throttled function that only invokes `func` at most once per
	 * every `wait` milliseconds. The throttled function comes with a `cancel`
	 * method to cancel delayed `func` invocations and a `flush` method to
	 * immediately invoke them. Provide an options object to indicate whether
	 * `func` should be invoked on the leading and/or trailing edge of the `wait`
	 * timeout. The `func` is invoked with the last arguments provided to the
	 * throttled function. Subsequent calls to the throttled function return the
	 * result of the last `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the throttled function
	 * is invoked more than once during the `wait` timeout.
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


/***/ },
/* 22 */
/***/ function(module, exports) {

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

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (elem, eventType) {
	  var event = void 0;
	  if (document.createEvent) {
	    event = new Event(eventType);
	    elem.dispatchEvent(event);
	  } else {
	    event = document.createEventObject();
	    event.eventType = eventType;
	    elem.fireEvent('on' + eventType, event);
	  }
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(5),
	    root = __webpack_require__(1);

	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map');

	module.exports = Map;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(7),
	    stackClear = __webpack_require__(113),
	    stackDelete = __webpack_require__(114),
	    stackGet = __webpack_require__(115),
	    stackHas = __webpack_require__(116),
	    stackSet = __webpack_require__(117);

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  this.__data__ = new ListCache(entries);
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;

	module.exports = Stack;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(1);

	/** Built-in value references. */
	var Symbol = root.Symbol;

	module.exports = Symbol;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var castPath = __webpack_require__(31),
	    isKey = __webpack_require__(10),
	    toKey = __webpack_require__(12);

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = isKey(path, object) ? [path] : castPath(path);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	module.exports = baseGet;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var getPrototype = __webpack_require__(86);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.has` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHas(object, key) {
	  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
	  // that are composed entirely of index properties, return `false` for
	  // `hasOwnProperty` checks of them.
	  return object != null &&
	    (hasOwnProperty.call(object, key) ||
	      (typeof object == 'object' && key in object && getPrototype(object) === null));
	}

	module.exports = baseHas;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(68),
	    isObject = __webpack_require__(4),
	    isObjectLike = __webpack_require__(6);

	/**
	 * The base implementation of `_.isEqual` which supports partial comparisons
	 * and tracks traversed objects.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {boolean} [bitmask] The bitmask of comparison flags.
	 *  The bitmask may be composed of the following flags:
	 *     1 - Unordered comparison
	 *     2 - Partial comparison
	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, bitmask, stack) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
	}

	module.exports = baseIsEqual;


/***/ },
/* 30 */
/***/ function(module, exports) {

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


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(2),
	    stringToPath = __webpack_require__(118);

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value) {
	  return isArray(value) ? value : stringToPath(value);
	}

	module.exports = castPath;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var SetCache = __webpack_require__(59),
	    arraySome = __webpack_require__(63);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `array` and `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(array);
	  if (stacked) {
	    return stacked == other;
	  }
	  var index = -1,
	      result = true,
	      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

	  stack.set(array, other);

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
	            if (!seen.has(othIndex) &&
	                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
	              return seen.add(othIndex);
	            }
	          })) {
	        result = false;
	        break;
	      }
	    } else if (!(
	          arrValue === othValue ||
	            equalFunc(arrValue, othValue, customizer, bitmask, stack)
	        )) {
	      result = false;
	      break;
	    }
	  }
	  stack['delete'](array);
	  return result;
	}

	module.exports = equalArrays;


/***/ },
/* 33 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	module.exports = isHostObject;


/***/ },
/* 34 */
/***/ function(module, exports) {

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


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(4);

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


/***/ },
/* 36 */
/***/ function(module, exports) {

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


/***/ },
/* 37 */
/***/ function(module, exports) {

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
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


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLikeObject = __webpack_require__(123);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

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
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}

	module.exports = isArguments;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(2),
	    isObjectLike = __webpack_require__(6);

	/** `Object#toString` result references. */
	var stringTag = '[object String]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
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
	    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
	}

	module.exports = isString;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

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
	    } else {
	      $panelElem.css('height', '');
	    }
	  }

	  /**
	   * Add CSS classes to accordion panels
	   * @param {object} $panelElem - The accordion panel jQuery object
	   * @param {string} labelledby - ID of element (accordion header) that labels panel
	   */
	  function initializePanel($panelElem, labelledby) {
	    $panelElem.addClass('o-accordion__content');
	    $panelElem.data('height', $panelElem.height());
	    $panelElem.attr({
	      'aria-hidden': true,
	      'role': 'tabpanel',
	      'aria-labelledby': labelledby
	    });
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
	      (function () {
	        $item.addClass('o-accordion__item');
	        var $accordionHeader = convertHeaderToButton($accordionInitialHeader);
	        $accordionInitialHeader.replaceWith($accordionHeader);
	        initializeHeader($accordionHeader, $accordionContent);
	        initializePanel($accordionContent, $accordionHeader.get(0).id);

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
	      })();
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
	    });
	  }
	};

	var _forEach = __webpack_require__(3);

	var _forEach2 = _interopRequireDefault(_forEach);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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
	        (function () {
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
	            if (!event.detail) {
	              addAlertCookie(alert);
	              removeAlertPadding(alertSibling);
	            }
	          });
	        })();
	      }
	    });
	  }
	};

	var _forEach = __webpack_require__(3);

	var _forEach2 = _interopRequireDefault(_forEach);

	var _readCookie = __webpack_require__(49);

	var _readCookie2 = _interopRequireDefault(_readCookie);

	var _dataset = __webpack_require__(22);

	var _dataset2 = _interopRequireDefault(_dataset);

	var _createCookie = __webpack_require__(42);

	var _createCookie2 = _interopRequireDefault(_createCookie);

	var _getDomain = __webpack_require__(44);

	var _getDomain2 = _interopRequireDefault(_getDomain);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 42 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (name, value, domain, days) {
	  var expires = days ? "; expires=" + new Date(days * 864E5 + new Date().getTime()).toGMTString() : "";
	  document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

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

	var _forEach = __webpack_require__(3);

	var _forEach2 = _interopRequireDefault(_forEach);

	var _throttle = __webpack_require__(21);

	var _throttle2 = _interopRequireDefault(_throttle);

	var _dispatchEvent = __webpack_require__(23);

	var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 44 */
/***/ function(module, exports) {

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

/***/ },
/* 45 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  function searchRedirect(searchForm) {
	    var searchField = searchForm.querySelector('[name="s"]');
	    if (searchField) {
	      var searchTerm = searchField.value;
	      searchTerm = searchTerm.replace(/\s+/g, '%20').toLowerCase();
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

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

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

	var _forEach = __webpack_require__(3);

	var _forEach2 = _interopRequireDefault(_forEach);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

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

	var _forEach = __webpack_require__(3);

	var _forEach2 = _interopRequireDefault(_forEach);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  /**
	  * Get the scroll position
	  * @return {integer} - Amount window has been scrolled
	  */
	  function scrollTop() {
	    var supportPageOffset = window.pageYOffset !== undefined;
	    var isCSS1Compat = (document.compatMode || "") === "CSS1Compat";
	    return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
	  }

	  /**
	  * Initialize parallax container
	  * @param {object} container - DOM node that wraps around the parallaxed elements
	  */
	  function initializeContainer(container) {
	    container.classList.add('o-parallax');
	  }

	  /**
	  * Remove modifications to parallax container
	  * @param {object} container - DOM node that wraps around the parallaxed elements
	  */
	  function teardownContainer(container) {
	    container.classList.remove('o-parallax');
	    container.style.paddingTop = null;
	  }

	  /**
	  * Initialize parallax base
	  * @param {object} base - DOM node for the base parallax element
	  * @param {integer} initialTop - The initial top position to set
	  */
	  function initializeBase(base, initialTop) {
	    base.style.top = initialTop + 'px';
	    base.classList.add('o-parallax__base');
	  }

	  /**
	  * Remove modifications to parallax base
	  * @param {object} base - DOM node for the base parallax element
	  */
	  function teardownBase(base) {
	    base.style.top = null;
	    base.style.height = null;
	    base.classList.remove('o-parallax__base');
	  }

	  /**
	  * Calculate hero offset. Dispatch a custom event when padding changes to alert
	  * other modules that use vertical positioning in their calculations.
	  * @param {object} elem - DOM node for the parallax element
	  * @param {object} container - DOM node for the element's container
	  */
	  function calculateOffset(elem, container) {
	    console.log('calculating offset');
	    var offsetHeight = elem.offsetHeight;
	    var currentPaddingHeight = parseInt(container.style.paddingTop, 10);
	    var sizeChange = isNaN(currentPaddingHeight) ? 0 : currentPaddingHeight - offsetHeight;
	    var sizeEvent = void 0;
	    if (typeof window.CustomEvent === 'function') {
	      sizeEvent = new CustomEvent('containerSizeChange', { detail: sizeChange });
	    } else {
	      sizeEvent = document.createEvent('CustomEvent');
	      sizeEvent.initCustomEvent('containerSizeChange', true, true, { detail: sizeChange });
	    }
	    container.dispatchEvent(sizeEvent);
	    container.style.paddingTop = offsetHeight + 'px';
	  }

	  /**
	  * Adjust the parallaxed element's height and position,
	  * and the opacity of its children (the hero itself)
	  * @param {object} base - The base (parallaxed) element
	  * @param {integer} newHeight - The new height to set for base
	  * @param {integer} newTop - The new top position to set for base
	  */
	  function repaintHero(base, newHeight, newTop) {
	    base.style.height = newHeight + 'px';
	    base.style.top = newTop + 'px';
	  }

	  /**
	  * Adjust the element content's opacity and background position
	  * @param {object} elem - The content element
	  * @param {integer} scrollPos - The current scroll position
	  * @param {float} opacity - The opacity value (between 0 and 1) to set
	  */
	  function repaintHeroContent(elem, scrollPos, opacity) {
	    elem.style.opacity = opacity;
	    if (window.matchMedia('(max-width:1023px)').matches) {
	      var backgroundPosition = 0 - scrollPos;
	      elem.style.backgroundPositionY = backgroundPosition + 'px';
	    }
	  }

	  /**
	  * Remove modifications to hero content
	  * @param {object} elem - The content element
	  */
	  function teardownHeroContent(elem) {
	    elem.style.opacity = null;
	    elem.style.backgroundPositionY = null;
	  }

	  /**
	  * Adjust the text content's top margin so that it appears to scroll upward
	  * @param {object} content - DOM node for the inner content
	  * @param {integer} scrollPos - The current scroll position
	  */
	  function repaintHeroText(content, scrollPos) {
	    var newMargin = 0 - scrollPos;
	    content.style.marginTop = newMargin + 'px';
	  }

	  /**
	  * Remove modifications to hero text
	  * @param {object} content - DOM node for the inner content
	  */
	  function teardownHeroText(content) {
	    content.style.marginTop = null;
	  }

	  /**
	  * Initialize parallax behavior
	  * @param {object} parallaxBase - DOM element for the hero
	  */
	  function initialize(parallaxBase) {
	    var parallaxContainer = parallaxBase.parentElement;
	    var parallaxContent = parallaxBase.querySelector('.js-parallax-content');
	    var parallaxText = parallaxBase.querySelector('.js-parallax-text');
	    var baseHeight = parallaxBase.offsetHeight;
	    var baseTop = parallaxBase.getBoundingClientRect().top;
	    initializeContainer(parallaxContainer);
	    initializeBase(parallaxBase, baseTop);

	    var scrollListener = window.addEventListener('scroll', (0, _throttle2.default)(function () {
	      var scrollPosition = scrollTop();
	      var newHeight = baseHeight - scrollPosition < 0 ? 0 : baseHeight - scrollPosition;
	      var newTop = baseTop - scrollPosition;
	      var opacity = (newHeight + newTop) / (baseHeight + baseTop);
	      opacity = opacity < 0 ? 0 : opacity;
	      repaintHero(parallaxBase, newHeight, newTop);
	      repaintHeroContent(parallaxContent, scrollPosition, opacity);
	      repaintHeroText(parallaxText, scrollPosition);
	      calculateOffset(parallaxBase, parallaxContainer);
	    }, 16));

	    var resizeListener = window.addEventListener('resize', (0, _debounce2.default)(function () {
	      window.removeEventListener('scroll', scrollListener);
	      window.removeEventListener('resize', resizeListener);
	      teardownContainer(parallaxContainer);
	      teardownBase(parallaxBase);
	      teardownHeroContent(parallaxContent);
	      teardownHeroText(parallaxText);
	      initialize(parallaxBase);
	    }, 100));

	    (0, _dispatchEvent2.default)(window, 'scroll');
	  }

	  var parallaxBase = document.querySelector('.js-parallax');
	  if (parallaxBase) {
	    initialize(parallaxBase);
	  }
	};

	var _throttle = __webpack_require__(21);

	var _throttle2 = _interopRequireDefault(_throttle);

	var _debounce = __webpack_require__(17);

	var _debounce2 = _interopRequireDefault(_debounce);

	var _dispatchEvent = __webpack_require__(23);

	var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 49 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (cookieName, cookie) {
	  return (RegExp("(?:^|; )" + cookieName + "=([^;]*)").exec(cookie) || []).pop();
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

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

	var _forEach = __webpack_require__(3);

	var _forEach2 = _interopRequireDefault(_forEach);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

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

	var _throttle = __webpack_require__(21);

	var _throttle2 = _interopRequireDefault(_throttle);

	var _debounce = __webpack_require__(17);

	var _debounce2 = _interopRequireDefault(_debounce);

	var _imagesready = __webpack_require__(54);

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
	    largeBreakpoint: '1024px',
	    articleClass: 'o-article--shift'
	  };

	  // Globals
	  var stickyMode = false; // Flag to tell if sidebar is in "sticky mode"
	  var isSticky = false; // Whether the sidebar is sticky at this exact moment in time
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
	        $elem.addClass(settings.stickyClass);
	        $elemArticle.addClass(settings.articleClass);
	        updateDimensions();
	      }

	      // Check if the sidebar has reached the bottom switch point
	      if ($elem.offset().top + elemHeight > switchPointBottom) {
	        isSticky = false;
	        $elem.removeClass(settings.stickyClass);
	        $elemArticle.removeClass(settings.articleClass);
	        updateDimensions();
	        $elem.css('top', 'auto');
	        $elem.css('bottom', $elemContainer.css('padding-bottom'));
	      }
	    } else if (isSticky) {
	      isSticky = false;
	      $elem.removeClass(settings.stickyClass);
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
	    if (isSticky) {
	      $elem.removeClass(settings.stickyClass);
	    }
	    updateDimensions(true);

	    switchPoint = $elem.offset().top;
	    // Bottom switch point is equal to the offset and height of the outer container, minus any padding on the bottom
	    switchPointBottom = $elemContainer.offset().top + $elemContainer.outerHeight() - parseInt($elemContainer.css('padding-bottom'), 10);

	    leftOffset = $elem.offset().left;
	    elemWidth = $elem.outerWidth();
	    elemHeight = $elem.outerHeight();

	    if (isSticky) {
	      updateDimensions();
	      $elem.addClass(settings.stickyClass);
	      $elemArticle.addClass(settings.articleClass);
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
	    }, 16)).trigger('scroll.fixedSidebar');

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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * ToggleOpen module
	                                                                                                                                                                                                                                                   * @module modules/toggleOpen
	                                                                                                                                                                                                                                                   */

	/**
	 * Toggles an element open/closed.
	 * @param {string} openClass - The class to toggle on/off
	 */


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
	        var _ret = function () {
	          var targetElem = document.getElementById(targetElemSelector);
	          if (!targetElem) {
	            return {
	              v: false
	            };
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
	        }();

	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	      }
	    });
	  }
	};

	var _forEach = __webpack_require__(3);

	var _forEach2 = _interopRequireDefault(_forEach);

	var _dataset = __webpack_require__(22);

	var _dataset2 = _interopRequireDefault(_dataset);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(5),
	    root = __webpack_require__(1);

	/* Built-in method references that are verified to be native. */
	var DataView = getNative(root, 'DataView');

	module.exports = DataView;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var hashClear = __webpack_require__(90),
	    hashDelete = __webpack_require__(91),
	    hashGet = __webpack_require__(92),
	    hashHas = __webpack_require__(93),
	    hashSet = __webpack_require__(94);

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

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


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(5),
	    root = __webpack_require__(1);

	/* Built-in method references that are verified to be native. */
	var Promise = getNative(root, 'Promise');

	module.exports = Promise;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(5),
	    root = __webpack_require__(1);

	/* Built-in method references that are verified to be native. */
	var Set = getNative(root, 'Set');

	module.exports = Set;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(16),
	    setCacheAdd = __webpack_require__(110),
	    setCacheHas = __webpack_require__(111);

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
	      length = values ? values.length : 0;

	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;

	module.exports = SetCache;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(1);

	/** Built-in value references. */
	var Uint8Array = root.Uint8Array;

	module.exports = Uint8Array;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(5),
	    root = __webpack_require__(1);

	/* Built-in method references that are verified to be native. */
	var WeakMap = getNative(root, 'WeakMap');

	module.exports = WeakMap;


/***/ },
/* 62 */
/***/ function(module, exports) {

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
	      length = array ? array.length : 0;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	module.exports = arrayEach;


/***/ },
/* 63 */
/***/ function(module, exports) {

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
	      length = array ? array.length : 0;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	module.exports = arraySome;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(66),
	    createBaseEach = __webpack_require__(80);

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


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(81);

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


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(65),
	    keys = __webpack_require__(20);

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


/***/ },
/* 67 */
/***/ function(module, exports) {

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


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(25),
	    equalArrays = __webpack_require__(32),
	    equalByTag = __webpack_require__(82),
	    equalObjects = __webpack_require__(83),
	    getTag = __webpack_require__(87),
	    isArray = __webpack_require__(2),
	    isHostObject = __webpack_require__(33),
	    isTypedArray = __webpack_require__(124);

	/** Used to compose bitmasks for comparison styles. */
	var PARTIAL_COMPARE_FLAG = 2;

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
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = getTag(object);
	    objTag = objTag == argsTag ? objectTag : objTag;
	  }
	  if (!othIsArr) {
	    othTag = getTag(other);
	    othTag = othTag == argsTag ? objectTag : othTag;
	  }
	  var objIsObj = objTag == objectTag && !isHostObject(object),
	      othIsObj = othTag == objectTag && !isHostObject(other),
	      isSameTag = objTag == othTag;

	  if (isSameTag && !objIsObj) {
	    stack || (stack = new Stack);
	    return (objIsArr || isTypedArray(object))
	      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
	      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
	  }
	  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      var objUnwrapped = objIsWrapped ? object.value() : object,
	          othUnwrapped = othIsWrapped ? other.value() : other;

	      stack || (stack = new Stack);
	      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  stack || (stack = new Stack);
	  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
	}

	module.exports = baseIsEqualDeep;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(25),
	    baseIsEqual = __webpack_require__(29);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

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
	            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
	            : result
	          )) {
	        return false;
	      }
	    }
	  }
	  return true;
	}

	module.exports = baseIsMatch;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(19),
	    isHostObject = __webpack_require__(33),
	    isMasked = __webpack_require__(97),
	    isObject = __webpack_require__(4),
	    toSource = __webpack_require__(37);

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

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
	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	module.exports = baseIsNative;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(73),
	    baseMatchesProperty = __webpack_require__(74),
	    identity = __webpack_require__(122),
	    isArray = __webpack_require__(2),
	    property = __webpack_require__(127);

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


/***/ },
/* 72 */
/***/ function(module, exports) {

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = Object.keys;

	/**
	 * The base implementation of `_.keys` which doesn't skip the constructor
	 * property of prototypes or treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  return nativeKeys(Object(object));
	}

	module.exports = baseKeys;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(69),
	    getMatchData = __webpack_require__(85),
	    matchesStrictComparable = __webpack_require__(36);

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


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(29),
	    get = __webpack_require__(120),
	    hasIn = __webpack_require__(121),
	    isKey = __webpack_require__(10),
	    isStrictComparable = __webpack_require__(35),
	    matchesStrictComparable = __webpack_require__(36),
	    toKey = __webpack_require__(12);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

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
	      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
	  };
	}

	module.exports = baseMatchesProperty;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(27);

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


/***/ },
/* 76 */
/***/ function(module, exports) {

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


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(26),
	    isSymbol = __webpack_require__(14);

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
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	module.exports = baseToString;


/***/ },
/* 78 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a global object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	 */
	function checkGlobal(value) {
	  return (value && value.Object === Object) ? value : null;
	}

	module.exports = checkGlobal;


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(1);

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];

	module.exports = coreJsData;


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(18);

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


/***/ },
/* 81 */
/***/ function(module, exports) {

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


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(26),
	    Uint8Array = __webpack_require__(60),
	    equalArrays = __webpack_require__(32),
	    mapToArray = __webpack_require__(109),
	    setToArray = __webpack_require__(112);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

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
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
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
	      // Coerce dates and booleans to numbers, dates to milliseconds and
	      // booleans to `1` or `0` treating invalid dates coerced to `NaN` as
	      // not equal.
	      return +object == +other;

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object) ? other != +other : object == +other;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings, primitives and objects,
	      // as equal. See http://www.ecma-international.org/ecma-262/6.0/#sec-regexp.prototype.tostring
	      // for more details.
	      return object == (other + '');

	    case mapTag:
	      var convert = mapToArray;

	    case setTag:
	      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
	      convert || (convert = setToArray);

	      if (object.size != other.size && !isPartial) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      bitmask |= UNORDERED_COMPARE_FLAG;
	      stack.set(object, other);

	      // Recursively compare objects (susceptible to call stack limits).
	      return equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);

	    case symbolTag:
	      if (symbolValueOf) {
	        return symbolValueOf.call(object) == symbolValueOf.call(other);
	      }
	  }
	  return false;
	}

	module.exports = equalByTag;


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var baseHas = __webpack_require__(28),
	    keys = __webpack_require__(20);

	/** Used to compose bitmasks for comparison styles. */
	var PARTIAL_COMPARE_FLAG = 2;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isPartial) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isPartial ? key in other : baseHas(other, key))) {
	      return false;
	    }
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(object);
	  if (stacked) {
	    return stacked == other;
	  }
	  var result = true;
	  stack.set(object, other);

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
	          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
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
	  return result;
	}

	module.exports = equalObjects;


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(30);

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a
	 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
	 * Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	module.exports = getLength;


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var isStrictComparable = __webpack_require__(35),
	    keys = __webpack_require__(20);

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


/***/ },
/* 86 */
/***/ function(module, exports) {

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf;

	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}

	module.exports = getPrototype;


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var DataView = __webpack_require__(55),
	    Map = __webpack_require__(24),
	    Promise = __webpack_require__(57),
	    Set = __webpack_require__(58),
	    WeakMap = __webpack_require__(61),
	    toSource = __webpack_require__(37);

	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag = '[object Set]',
	    weakMapTag = '[object WeakMap]';

	var dataViewTag = '[object DataView]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

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
	function getTag(value) {
	  return objectToString.call(value);
	}

	// Fallback for data views, maps, sets, and weak maps in IE 11,
	// for data views in Edge, and promises in Node.js.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = objectToString.call(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : undefined;

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


/***/ },
/* 88 */
/***/ function(module, exports) {

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


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var castPath = __webpack_require__(31),
	    isArguments = __webpack_require__(38),
	    isArray = __webpack_require__(2),
	    isIndex = __webpack_require__(34),
	    isKey = __webpack_require__(10),
	    isLength = __webpack_require__(13),
	    isString = __webpack_require__(39),
	    toKey = __webpack_require__(12);

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
	  path = isKey(path, object) ? [path] : castPath(path);

	  var result,
	      index = -1,
	      length = path.length;

	  while (++index < length) {
	    var key = toKey(path[index]);
	    if (!(result = object != null && hasFunc(object, key))) {
	      break;
	    }
	    object = object[key];
	  }
	  if (result) {
	    return result;
	  }
	  var length = object ? object.length : 0;
	  return !!length && isLength(length) && isIndex(key, length) &&
	    (isArray(object) || isString(object) || isArguments(object));
	}

	module.exports = hasPath;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(11);

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	}

	module.exports = hashClear;


/***/ },
/* 91 */
/***/ function(module, exports) {

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
	  return this.has(key) && delete this.__data__[key];
	}

	module.exports = hashDelete;


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(11);

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


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(11);

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
	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
	}

	module.exports = hashHas;


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(11);

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
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	module.exports = hashSet;


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(76),
	    isArguments = __webpack_require__(38),
	    isArray = __webpack_require__(2),
	    isLength = __webpack_require__(13),
	    isString = __webpack_require__(39);

	/**
	 * Creates an array of index keys for `object` values of arrays,
	 * `arguments` objects, and strings, otherwise `null` is returned.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array|null} Returns index keys, else `null`.
	 */
	function indexKeys(object) {
	  var length = object ? object.length : undefined;
	  if (isLength(length) &&
	      (isArray(object) || isString(object) || isArguments(object))) {
	    return baseTimes(length, String);
	  }
	  return null;
	}

	module.exports = indexKeys;


/***/ },
/* 96 */
/***/ function(module, exports) {

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


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var coreJsData = __webpack_require__(79);

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


/***/ },
/* 98 */
/***/ function(module, exports) {

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


/***/ },
/* 99 */
/***/ function(module, exports) {

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	}

	module.exports = listCacheClear;


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(8);

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
	  return true;
	}

	module.exports = listCacheDelete;


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(8);

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


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(8);

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


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(8);

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
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	module.exports = listCacheSet;


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var Hash = __webpack_require__(56),
	    ListCache = __webpack_require__(7),
	    Map = __webpack_require__(24);

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	module.exports = mapCacheClear;


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(9);

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
	  return getMapData(this, key)['delete'](key);
	}

	module.exports = mapCacheDelete;


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(9);

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


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(9);

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


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(9);

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
	  getMapData(this, key).set(key, value);
	  return this;
	}

	module.exports = mapCacheSet;


/***/ },
/* 109 */
/***/ function(module, exports) {

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


/***/ },
/* 110 */
/***/ function(module, exports) {

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


/***/ },
/* 111 */
/***/ function(module, exports) {

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


/***/ },
/* 112 */
/***/ function(module, exports) {

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


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(7);

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	}

	module.exports = stackClear;


/***/ },
/* 114 */
/***/ function(module, exports) {

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
	  return this.__data__['delete'](key);
	}

	module.exports = stackDelete;


/***/ },
/* 115 */
/***/ function(module, exports) {

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


/***/ },
/* 116 */
/***/ function(module, exports) {

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


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(7),
	    MapCache = __webpack_require__(16);

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
	  var cache = this.__data__;
	  if (cache instanceof ListCache && cache.__data__.length == LARGE_ARRAY_SIZE) {
	    cache = this.__data__ = new MapCache(cache.__data__);
	  }
	  cache.set(key, value);
	  return this;
	}

	module.exports = stackSet;


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	var memoize = __webpack_require__(125),
	    toString = __webpack_require__(129);

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = memoize(function(string) {
	  var result = [];
	  toString(string).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	module.exports = stringToPath;


/***/ },
/* 119 */
/***/ function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
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
	 * var object = { 'user': 'fred' };
	 * var other = { 'user': 'fred' };
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


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(27);

	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is used in its place.
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


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	var baseHasIn = __webpack_require__(67),
	    hasPath = __webpack_require__(89);

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


/***/ },
/* 122 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument given to it.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	module.exports = identity;


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(18),
	    isObjectLike = __webpack_require__(6);

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	module.exports = isArrayLikeObject;


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(13),
	    isObjectLike = __webpack_require__(6);

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

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
	}

	module.exports = isTypedArray;


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(16);

	/** Used as the `TypeError` message for "Functions" methods. */
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
	 * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `delete`, `get`, `has`, and `set`.
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
	  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
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
	    memoized.cache = cache.set(key, result);
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || MapCache);
	  return memoized;
	}

	// Assign cache to `_.memoize`.
	memoize.Cache = MapCache;

	module.exports = memoize;


/***/ },
/* 126 */
/***/ function(module, exports) {

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
	function now() {
	  return Date.now();
	}

	module.exports = now;


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(30),
	    basePropertyDeep = __webpack_require__(75),
	    isKey = __webpack_require__(10),
	    toKey = __webpack_require__(12);

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


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(19),
	    isObject = __webpack_require__(4),
	    isSymbol = __webpack_require__(14);

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
	    var other = isFunction(value.valueOf) ? value.valueOf() : value;
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


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(77);

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
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


/***/ }
/******/ ]);
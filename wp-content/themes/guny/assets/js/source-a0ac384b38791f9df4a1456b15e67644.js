/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());

/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
(function(){
    // Bail out for browsers that have addListener support
    if (window.matchMedia && window.matchMedia('all').addListener) {
        return false;
    }

    var localMatchMedia = window.matchMedia,
        hasMediaQueries = localMatchMedia('only all').matches,
        isListening     = false,
        timeoutID       = 0,    // setTimeout for debouncing 'handleChange'
        queries         = [],   // Contains each 'mql' and associated 'listeners' if 'addListener' is used
        handleChange    = function(evt) {
            // Debounce
            clearTimeout(timeoutID);

            timeoutID = setTimeout(function() {
                for (var i = 0, il = queries.length; i < il; i++) {
                    var mql         = queries[i].mql,
                        listeners   = queries[i].listeners || [],
                        matches     = localMatchMedia(mql.media).matches;

                    // Update mql.matches value and call listeners
                    // Fire listeners only if transitioning to or from matched state
                    if (matches !== mql.matches) {
                        mql.matches = matches;

                        for (var j = 0, jl = listeners.length; j < jl; j++) {
                            listeners[j].call(window, mql);
                        }
                    }
                }
            }, 30);
        };

    window.matchMedia = function(media) {
        var mql         = localMatchMedia(media),
            listeners   = [],
            index       = 0;

        mql.addListener = function(listener) {
            // Changes would not occur to css media type so return now (Affects IE <= 8)
            if (!hasMediaQueries) {
                return;
            }

            // Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
            // There should only ever be 1 resize listener running for performance
            if (!isListening) {
                isListening = true;
                window.addEventListener('resize', handleChange, true);
            }

            // Push object only if it has not been pushed already
            if (index === 0) {
                index = queries.push({
                    mql         : mql,
                    listeners   : listeners
                });
            }

            listeners.push(listener);
        };

        mql.removeListener = function(listener) {
            for (var i = 0, il = listeners.length; i < il; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                }
            }
        };

        return mql;
    };
}());

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20150312
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
// Including IE < Edge missing SVGElement.classList
if (!("classList" in document.createElement("_")) 
	|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}

}


/**
 * skip-link-focus-fix.js
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
( function() {
	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
	    is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
	    is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var id = location.hash.substring( 1 ),
				element;

			if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
				return;
			}

			element = document.getElementById( id );

			if ( element ) {
				if ( ! ( /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
})();

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
    __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default()(toggleElems, function (toggleElem) {
      var targetElemSelector = Object(__WEBPACK_IMPORTED_MODULE_1__dataset_js__["a" /* default */])(toggleElem, 'toggle');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzJiNDJiYjlkYjI0ZTc2Y2E4ODciLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwialF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mb3JFYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZGF0YXNldC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9hY2NvcmRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlFYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VFYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3JPd24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gva2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJndW1lbnRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuYXJ5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdEZ1bmN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaWRlbnRpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc2ltcGxlQWNjb3JkaW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL29mZmNhbnZhcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9vdmVybGF5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3N0aWNrTmF2LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9ub3cuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b051bWJlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9pbWFnZXNyZWFkeS9kaXN0L2ltYWdlc3JlYWR5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3NlY3Rpb25IaWdobGlnaHRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9zdGF0aWNDb2x1bW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvYWxlcnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvcmVhZENvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9jcmVhdGVDb29raWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZ2V0RG9tYWluLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2JzZHRvb2xzLXNpZ251cC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdmVuZG9yL2JzZC1zaWdudXAtanNhcGktc2ltcGxlLWRldi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9mb3JtRWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9kaXNwYXRjaEV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2ZhY2V0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9vd2xTZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9pT1M3SGFjay5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9zaGFyZS1mb3JtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcy1jb29raWUvc3JjL2pzLmNvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdmVuZG9yL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvdW5kZXJzY29yZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2xlYXZlLmpzL2Rpc3QvY2xlYXZlLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2xlYXZlLmpzL2Rpc3QvYWRkb25zL2NsZWF2ZS1waG9uZS51cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmFyaWFibGVzLmpzb24iLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvY2FwdGNoYVJlc2l6ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9yb3RhdGluZ1RleHRBbmltYXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc2VhcmNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9taXNzLXBsZXRlLWpzL2Rpc3QvYnVuZGxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU9wZW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvdG9nZ2xlTWVudS5qcyJdLCJuYW1lcyI6WyJlbGVtIiwiYXR0ciIsImRhdGFzZXQiLCJnZXRBdHRyaWJ1dGUiLCJyZWFkeSIsImZuIiwiZG9jdW1lbnQiLCJyZWFkeVN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImluaXQiLCJ0b2dnbGVPcGVuIiwiYWxlcnQiLCJvZmZjYW52YXMiLCJhY2NvcmRpb24iLCJzaW1wbGVBY2NvcmRpb24iLCJvdmVybGF5IiwiZmFjZXRzIiwic3RhdGljQ29sdW1uIiwic3RpY2tOYXYiLCJic2R0b29sc1NpZ251cCIsImZvcm1FZmZlY3RzIiwib3dsU2V0dGluZ3MiLCJpT1M3SGFjayIsImNhcHRjaGFSZXNpemUiLCJyb3RhdGluZ1RleHRBbmltYXRpb24iLCJzZWN0aW9uSGlnaGxpZ2h0ZXIiLCJ3aW5kb3ciLCIkIiwiU2hhcmVGb3JtIiwiQ3NzQ2xhc3MiLCJGT1JNIiwiZWFjaCIsImkiLCJlbCIsInNoYXJlRm9ybSIsImpRdWVyeSIsImNvbnZlcnRIZWFkZXJUb0J1dHRvbiIsIiRoZWFkZXJFbGVtIiwiZ2V0Iiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImhlYWRlckVsZW0iLCJuZXdIZWFkZXJFbGVtIiwiY3JlYXRlRWxlbWVudCIsImZvckVhY2giLCJhdHRyaWJ1dGVzIiwic2V0QXR0cmlidXRlIiwibm9kZVZhbHVlIiwiJG5ld0hlYWRlckVsZW0iLCJodG1sIiwiYXBwZW5kIiwidG9nZ2xlSGVhZGVyIiwibWFrZVZpc2libGUiLCJpbml0aWFsaXplSGVhZGVyIiwiJHJlbGF0ZWRQYW5lbCIsImlkIiwiYWRkQ2xhc3MiLCJvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJ0cmlnZ2VyIiwiYmx1ciIsInRvZ2dsZVBhbmVsIiwiJHBhbmVsRWxlbSIsImNzcyIsImRhdGEiLCJmaW5kIiwiaW5pdGlhbGl6ZVBhbmVsIiwibGFiZWxsZWRieSIsImNhbGN1bGF0ZVBhbmVsSGVpZ2h0IiwiaGVpZ2h0IiwidG9nZ2xlQWNjb3JkaW9uSXRlbSIsIiRpdGVtIiwicmVtb3ZlQ2xhc3MiLCJpbml0aWFsaXplQWNjb3JkaW9uSXRlbSIsIiRhY2NvcmRpb25Db250ZW50IiwiJGFjY29yZGlvbkluaXRpYWxIZWFkZXIiLCJvZmYiLCJsZW5ndGgiLCIkYWNjb3JkaW9uSGVhZGVyIiwidGFnTmFtZSIsInJlcGxhY2VXaXRoIiwiaW5pdGlhbGl6ZSIsIiRhY2NvcmRpb25FbGVtIiwibXVsdGlTZWxlY3RhYmxlIiwiY2hpbGRyZW4iLCJwcm94eSIsIiRuZXdJdGVtIiwidGFyZ2V0IiwiY2xvc2VzdCIsImhhc0NsYXNzIiwiJG9wZW5JdGVtIiwicmVJbml0aWFsaXplIiwicmVJbml0aWFsaXplQWNjb3JkaW9uIiwiJGFjY29yZGlvbnMiLCJub3QiLCJjbGljayIsImNoZWNrRWxlbWVudCIsIm5leHQiLCJpcyIsInNsaWRlVXAiLCJzbGlkZURvd24iLCJvZmZDYW52YXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwib2ZmQ2FudmFzRWxlbSIsIm9mZkNhbnZhc1NpZGUiLCJxdWVyeVNlbGVjdG9yIiwiZGV0YWlsIiwidGVzdCIsInRhYkluZGV4IiwiZm9jdXMiLCJvdmVybGF5RWxlbSIsInN0aWNreU5hdiIsIiRlbGVtIiwiJGVsZW1Db250YWluZXIiLCIkZWxlbUFydGljbGUiLCJzZXR0aW5ncyIsInN0aWNreUNsYXNzIiwiYWJzb2x1dGVDbGFzcyIsImxhcmdlQnJlYWtwb2ludCIsImFydGljbGVDbGFzcyIsInN0aWNreU1vZGUiLCJpc1N0aWNreSIsImlzQWJzb2x1dGUiLCJzd2l0Y2hQb2ludCIsInN3aXRjaFBvaW50Qm90dG9tIiwibGVmdE9mZnNldCIsImVsZW1XaWR0aCIsImVsZW1IZWlnaHQiLCJ0b2dnbGVTdGlja3kiLCJjdXJyZW50U2Nyb2xsUG9zIiwic2Nyb2xsVG9wIiwidXBkYXRlRGltZW5zaW9ucyIsImlzT25TY3JlZW4iLCJmb3JjZUNsZWFyIiwibGVmdCIsIndpZHRoIiwidG9wIiwiYm90dG9tIiwic2V0T2Zmc2V0VmFsdWVzIiwib2Zmc2V0Iiwib3V0ZXJIZWlnaHQiLCJwYXJzZUludCIsIm91dGVyV2lkdGgiLCJzdGlja3lNb2RlT24iLCJ0aHJvdHRsZSIsIm9yaWdpbmFsRXZlbnQiLCJzdGlja3lNb2RlT2ZmIiwib25SZXNpemUiLCJsYXJnZU1vZGUiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImRlYm91bmNlIiwiaW1hZ2VzUmVhZHkiLCJib2R5IiwidGhlbiIsIndpbiIsInZpZXdwb3J0Iiwic2Nyb2xsTGVmdCIsInJpZ2h0IiwiYm91bmRzIiwiJHN0aWNreU5hdnMiLCIkb3V0ZXJDb250YWluZXIiLCIkYXJ0aWNsZSIsIiRuYXZpZ2F0aW9uTGlua3MiLCIkc2VjdGlvbnMiLCIkc2VjdGlvbnNSZXZlcnNlZCIsInJldmVyc2UiLCJzZWN0aW9uSWRUb25hdmlnYXRpb25MaW5rIiwib3B0aW1pemVkIiwic2Nyb2xsUG9zaXRpb24iLCJjdXJyZW50U2VjdGlvbiIsInNlY3Rpb25Ub3AiLCIkbmF2aWdhdGlvbkxpbmsiLCJzY3JvbGwiLCJzdGlja3lDb250ZW50Iiwibm90U3RpY2t5Q2xhc3MiLCJib3R0b21DbGFzcyIsImNhbGNXaW5kb3dQb3MiLCJzdGlja3lDb250ZW50RWxlbSIsImVsZW1Ub3AiLCJwYXJlbnRFbGVtZW50IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiaXNQYXN0Qm90dG9tIiwiaW5uZXJIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJvcGVuQ2xhc3MiLCJkaXNwbGF5QWxlcnQiLCJzaWJsaW5nRWxlbSIsImFsZXJ0SGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY3VycmVudFBhZGRpbmciLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInN0eWxlIiwicGFkZGluZ0JvdHRvbSIsInJlbW92ZUFsZXJ0UGFkZGluZyIsImNoZWNrQWxlcnRDb29raWUiLCJjb29raWVOYW1lIiwicmVhZENvb2tpZSIsImNvb2tpZSIsImFkZEFsZXJ0Q29va2llIiwiY3JlYXRlQ29va2llIiwiZ2V0RG9tYWluIiwibG9jYXRpb24iLCJhbGVydHMiLCJhbGVydFNpYmxpbmciLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwiUmVnRXhwIiwiZXhlYyIsInBvcCIsIm5hbWUiLCJ2YWx1ZSIsImRvbWFpbiIsImRheXMiLCJleHBpcmVzIiwiRGF0ZSIsImdldFRpbWUiLCJ0b0dNVFN0cmluZyIsInVybCIsInJvb3QiLCJwYXJzZVVybCIsImhyZWYiLCJob3N0bmFtZSIsInNsaWNlIiwibWF0Y2giLCJzcGxpdCIsImpvaW4iLCJyZXF1aXJlIiwiJHNpZ251cEZvcm1zIiwiZXJyb3JNc2ciLCJoYW5kbGVWYWxpZGF0aW9uIiwiZm9ybURhdGEiLCJub0Vycm9ycyIsIiRmb3JtIiwiJHJlcXVpcmVkRmllbGRzIiwiZmllbGROYW1lIiwiZmllbGRUeXBlIiwiZW1yZWdleCIsInVzcmVnZXgiLCJ0cmltIiwiaW5kZXgiLCJjaGVja2JveFZhbHVlIiwicHJvcCIsImNoZWNrYm94TmFtZSIsInN1YnN0cmluZyIsImhhbmRsZUVycm9ycyIsImVycm9ySlNPTiIsImZpZWxkX2Vycm9ycyIsImVycm9yIiwiJGZpZWxkIiwibWVzc2FnZSIsImhhbmRsZVN1Y2Nlc3MiLCJic2RTaWdudXAiLCJub19yZWRpcmVjdCIsInN0YXJ0UGF1c2VkIiwid2xvY2F0aW9uIiwidW5kZWZpbmVkIiwic2VyaWFsaXplT2JqZWN0IiwibyIsImEiLCJzZXJpYWxpemVBcnJheSIsInB1c2giLCJpbnRlcmFjdGl2ZVZhbGlkaXR5IiwicGx1Z2lubmFtZSIsImd1cCIsImd1cHJlZ2V4IiwicmVwbGFjZSIsInJlc3VsdHMiLCJzb3VyY2VTdHJpbmciLCJzdWJzb3VyY2VTdHJpbmciLCJ1cmxzb3VyY2UiLCJ1cmxzdWJzb3VyY2UiLCJwYXJzZVVSTCIsInAiLCJlcnJvckZpbHRlciIsImUiLCJtc2ciLCJyZXNwb25zZUpTT04iLCJwYXJzZUpTT04iLCJyZXNwb25zZVRleHQiLCJzdGF0dXMiLCJjb2RlIiwic3VjY2Vzc0ZpbHRlciIsInJlc3BvbnNlIiwiRGVmZXJyZWQiLCJyZWplY3RXaXRoIiwicmVjaGVja0lmVGhpc0lzU3RpbGxJbnZhbGlkIiwiZmllbGQiLCJiYWRpbnB1dCIsIm9uZSIsInZhbCIsInNldEN1c3RvbVZhbGlkaXR5IiwiZm9ybVN1Y2Nlc3MiLCJyZXN1bHQiLCJ0aGFua3NfdXJsIiwiZm9ybUZhaWx1cmUiLCJmdW5lcnJvciIsImNvbmZpZyIsImVycm9yc0FzT2JqZWN0IiwiZXJyIiwiJGVyckZpZWxkIiwiZXJyRmllbGQiLCJub1ZhbGlkYXRlIiwibm9faHRtbDV2YWxpZGF0ZSIsImVxIiwianNhcGlTdWJtaXQiLCJhY3Rpb24iLCJvcHMiLCJhcGlhY3Rpb24iLCJyZXF1ZXN0IiwiYWpheCIsInR5cGUiLCJtZXRob2QiLCJkYXRhVHlwZSIsInRpbWVvdXQiLCJjb250ZXh0IiwiYmVmb3JlU2VuZCIsImpxeGhyIiwicmVxdWVzdHNldHRpbmdzIiwicHJveHlhbGwiLCJjcm9zc0RvbWFpbiIsInN1cHBvcnQiLCJjb3JzIiwib2xkaWV4ZHIiLCJwcm90b2NvbCIsIm9sZHByb3h5Iiwic3RhdHVzVGV4dCIsImFsd2F5cyIsImRvbmUiLCJmYWlsIiwibm9ybWFsaXplU291cmNlRmllbGQiLCJleHRlcm5hbCIsIm9sZHZhbCIsImFwcGVuZFRvIiwicmVtb3ZlRGF0YSIsImluZGV4T2YiLCJub3NvdXJjZSIsImhhbmRsZUZvY3VzIiwid3JhcHBlckVsZW0iLCJwYXJlbnROb2RlIiwiaGFuZGxlQmx1ciIsImlucHV0cyIsImlucHV0RWxlbSIsImRpc3BhdGNoRXZlbnQiLCJldmVudFR5cGUiLCJjcmVhdGVFdmVudCIsImluaXRFdmVudCIsImNyZWF0ZUV2ZW50T2JqZWN0IiwiZmlyZUV2ZW50Iiwib3dsIiwib3dsQ2Fyb3VzZWwiLCJhbmltYXRlSW4iLCJhbmltYXRlT3V0IiwiaXRlbXMiLCJsb29wIiwibWFyZ2luIiwiZG90cyIsImF1dG9wbGF5IiwiYXV0b3BsYXlUaW1lb3V0IiwiYXV0b3BsYXlIb3ZlclBhdXNlIiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwic2Nyb2xsVG8iLCJWYXJpYWJsZXMiLCJfZWwiLCJfaXNWYWxpZCIsIl9pc0J1c3kiLCJfaXNEaXNhYmxlZCIsIl9pbml0aWFsaXplZCIsIl9yZWNhcHRjaGFSZXF1aXJlZCIsIl9yZWNhcHRjaGFWZXJpZmllZCIsIl9yZWNhcHRjaGFpbml0Iiwic2VsZWN0ZWQiLCJfbWFza1Bob25lIiwiU0hPV19ESVNDTEFJTUVSIiwiX2Rpc2NsYWltZXIiLCJfdmFsaWRhdGUiLCJfc3VibWl0IiwiZ3JlY2FwdGNoYSIsInJlc2V0IiwicGFyZW50cyIsIkVSUk9SX01TRyIsIl9zaG93RXJyb3IiLCJNZXNzYWdlIiwiUkVDQVBUQ0hBIiwidmlld0NvdW50IiwiQ29va2llcyIsIl9pbml0UmVjYXB0Y2hhIiwic2V0IiwiZm9jdXNvdXQiLCJyZW1vdmVBdHRyIiwiaW5wdXQiLCJjbGVhdmUiLCJwaG9uZSIsInBob25lUmVnaW9uQ29kZSIsImRlbGltaXRlciIsInZpc2libGUiLCIkZWwiLCIkY2xhc3MiLCJISURERU4iLCJBTklNQVRFX0RJU0NMQUlNRVIiLCJpbm5lcldpZHRoIiwiJHRhcmdldCIsInZhbGlkaXR5IiwiJHRlbCIsIl92YWxpZGF0ZVBob25lTnVtYmVyIiwiRVJST1IiLCJudW0iLCJfcGFyc2VQaG9uZU51bWJlciIsIlBIT05FIiwiUkVRVUlSRUQiLCIkZWxQYXJlbnRzIiwidGV4dCIsIlV0aWxpdHkiLCJsb2NhbGl6ZSIsIlNVQ0NFU1MiLCIkc3Bpbm5lciIsIlNQSU5ORVIiLCIkc3VibWl0IiwicGF5bG9hZCIsInNlcmlhbGl6ZSIsImRpc2FibGVkIiwiY3NzVGV4dCIsInBvc3QiLCJzdWNjZXNzIiwiX3Nob3dTdWNjZXNzIiwiSlNPTiIsInN0cmluZ2lmeSIsIlNFUlZFUiIsIiRzY3JpcHQiLCJhc3luYyIsImRlZmVyIiwic2NyZWVuZXJDYWxsYmFjayIsInJlbmRlciIsImdldEVsZW1lbnRCeUlkIiwic2NyZWVuZXJSZWNhcHRjaGEiLCJzY3JlZW5lclJlY2FwdGNoYVJlc2V0IiwiTkVFRFNfRElTQ0xBSU1FUiIsIlNVQk1JVF9CVE4iLCJFTUFJTCIsImdldFVybFBhcmFtZXRlciIsInF1ZXJ5U3RyaW5nIiwicXVlcnkiLCJzZWFyY2giLCJwYXJhbSIsInJlZ2V4IiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZmluZFZhbHVlcyIsIm9iamVjdCIsInRhcmdldFByb3AiLCJ0cmF2ZXJzZU9iamVjdCIsIm9iaiIsImtleSIsImhhc093blByb3BlcnR5IiwidG9Eb2xsYXJBbW91bnQiLCJNYXRoIiwiYWJzIiwicm91bmQiLCJwYXJzZUZsb2F0IiwidG9GaXhlZCIsInNsdWdOYW1lIiwibG9jYWxpemVkU3RyaW5ncyIsIkxPQ0FMSVpFRF9TVFJJTkdTIiwiXyIsImZpbmRXaGVyZSIsInNsdWciLCJsYWJlbCIsImlzVmFsaWRFbWFpbCIsImVtYWlsIiwiY2hlY2tWYWxpZGl0eSIsIkNPTkZJRyIsIkRFRkFVTFRfTEFUIiwiREVGQVVMVF9MTkciLCJHT09HTEVfQVBJIiwiR09PR0xFX1NUQVRJQ19BUEkiLCJHUkVDQVBUQ0hBX1NJVEVfS0VZIiwiU0NSRUVORVJfTUFYX0hPVVNFSE9MRCIsIlVSTF9QSU5fQkxVRSIsIlVSTF9QSU5fQkxVRV8yWCIsIlVSTF9QSU5fR1JFRU4iLCJVUkxfUElOX0dSRUVOXzJYIiwic2NhbGVDYXB0Y2hhIiwicmVDYXB0Y2hhV2lkdGgiLCJjb250YWluZXJXaWR0aCIsImNhcHRjaGFTY2FsZSIsInRyYW5zZm9ybSIsInJlc2l6ZSIsInRlcm1zIiwicm90YXRlVGVybSIsImN0IiwiZmFkZUluIiwiZGVsYXkiLCJmYWRlT3V0IiwiU2VhcmNoIiwiX2lucHV0cyIsInNlbGVjdG9ycyIsIk1BSU4iLCJfc3VnZ2VzdGlvbnMiLCJwYXJzZSIsImpzU2VhcmNoU3VnZ2VzdGlvbnMiLCJfTWlzc1BsZXRlIiwib3B0aW9ucyIsImNsYXNzTmFtZSIsImpzU2VhcmNoRHJvcGRvd25DbGFzcyIsImxpbmtBY3RpdmVDbGFzcyIsInRvZ2dsZUVsZW1zIiwidG9nZ2xlRWxlbSIsInRhcmdldEVsZW1TZWxlY3RvciIsInRhcmdldEVsZW0iLCJ0b2dnbGUiLCJ0b2dnbGVFdmVudCIsIkN1c3RvbUV2ZW50IiwiY29udGFpbnMiLCJpbml0Q3VzdG9tRXZlbnQiLCJjdXJyZW50VGFyZ2V0IiwidG9nZ2xlQ2xhc3MiLCJkZWxlZ2F0ZVRhcmdldCIsInNob3ciLCJoaWRlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REEsd0I7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEIsV0FBVyxTQUFTO0FBQ3BCLGFBQWEsYUFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FB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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3JCQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNqQkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMxQkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG9CQUFvQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFEQUFxRCxjQUFjO0FBQ25FO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixxQkFBcUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVywwREFBMEQ7QUFDckUsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdB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Q0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sZUFBZTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixlQUFlO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSx5QkFBeUIsZ0JBQWdCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixZQUFZO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFlBQVk7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFlBQVk7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLDRDQUE0QyxtQkFBbUI7QUFDL0Q7QUFDQTtBQUNBLHlDQUF5QyxZQUFZO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2RUFBNkU7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1C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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLDBCQUEwQixpR0FBaUc7O0FBRTNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTs7QUFFUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7O0FBRVY7QUFDQTtBQUNBLFVBQVU7O0FBRVY7QUFDQTtBQUNBLFVBQVU7O0FBRVY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOztBQUVWOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1RUFBdUUsZ0VBQWdFO0FBQ3ZJOztBQUVBO0FBQ0E7QUFD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b0JoZCxRQUFwQixDQUE2QixZQUE3QjtBQUNBN0IsTUFBRSxjQUFGLEVBQWtCOGUsSUFBbEI7QUFDRCxHQWpCRCxFQWlCR2hkLEVBakJILENBaUJNLE9BakJOLEVBaUJlLGNBakJmLEVBaUIrQixhQUFLO0FBQ2xDO0FBQ0E4TixNQUFFNU4sY0FBRjtBQUNBaEMsTUFBRSxjQUFGLEVBQWtCK2UsSUFBbEI7QUFDQS9lLE1BQUU0UCxFQUFFaVAsY0FBSixFQUFvQi9iLFdBQXBCLENBQWdDLFlBQWhDO0FBQ0QsR0F0QkQ7QUF1QkE7QUFFRCxDQTdCRCxFQTZCRy9DLE1BN0JILEVBNkJXLDhDQTdCWCxFIiwiZmlsZSI6IjMyYjQyYmI5ZGIyNGU3NmNhODg3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDMyYjQyYmI5ZGIyNGU3NmNhODg3IiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJqUXVlcnlcIlxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYmFzZUVhY2ggPSByZXF1aXJlKCcuL19iYXNlRWFjaCcpLFxuICAgIGNhc3RGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2Nhc3RGdW5jdGlvbicpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIGVsZW1lbnQuXG4gKiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqICoqTm90ZToqKiBBcyB3aXRoIG90aGVyIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzLCBvYmplY3RzIHdpdGggYSBcImxlbmd0aFwiXG4gKiBwcm9wZXJ0eSBhcmUgaXRlcmF0ZWQgbGlrZSBhcnJheXMuIFRvIGF2b2lkIHRoaXMgYmVoYXZpb3IgdXNlIGBfLmZvckluYFxuICogb3IgYF8uZm9yT3duYCBmb3Igb2JqZWN0IGl0ZXJhdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAYWxpYXMgZWFjaFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2VlIF8uZm9yRWFjaFJpZ2h0XG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZm9yRWFjaChbMSwgMl0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyBgMWAgdGhlbiBgMmAuXG4gKlxuICogXy5mb3JFYWNoKHsgJ2EnOiAxLCAnYic6IDIgfSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICogICBjb25zb2xlLmxvZyhrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzICdhJyB0aGVuICdiJyAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKS5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheUVhY2ggOiBiYXNlRWFjaDtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgY2FzdEZ1bmN0aW9uKGl0ZXJhdGVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mb3JFYWNoLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3ltYm9sLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0aWYoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcclxuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0bW9kdWxlLnBhdGhzID0gW107XHJcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcclxuXHRcdGlmKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XHJcblx0fVxyXG5cdHJldHVybiBtb2R1bGU7XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIG5vdyA9IHJlcXVpcmUoJy4vbm93JyksXG4gICAgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuKiBVdGlsaXR5IG1vZHVsZSB0byBnZXQgdmFsdWUgb2YgYSBkYXRhIGF0dHJpYnV0ZVxuKiBAcGFyYW0ge29iamVjdH0gZWxlbSAtIERPTSBub2RlIGF0dHJpYnV0ZSBpcyByZXRyaWV2ZWQgZnJvbVxuKiBAcGFyYW0ge3N0cmluZ30gYXR0ciAtIEF0dHJpYnV0ZSBuYW1lIChkbyBub3QgaW5jbHVkZSB0aGUgJ2RhdGEtJyBwYXJ0KVxuKiBAcmV0dXJuIHttaXhlZH0gLSBWYWx1ZSBvZiBlbGVtZW50J3MgZGF0YSBhdHRyaWJ1dGVcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihlbGVtLCBhdHRyKSB7XG4gIGlmICh0eXBlb2YgZWxlbS5kYXRhc2V0ID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS0nICsgYXR0cik7XG4gIH1cbiAgcmV0dXJuIGVsZW0uZGF0YXNldFthdHRyXTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2RhdGFzZXQuanMiLCJpbXBvcnQgYWNjb3JkaW9uIGZyb20gJy4vbW9kdWxlcy9hY2NvcmRpb24uanMnO1xuaW1wb3J0IHNpbXBsZUFjY29yZGlvbiBmcm9tICcuL21vZHVsZXMvc2ltcGxlQWNjb3JkaW9uLmpzJztcbmltcG9ydCBvZmZjYW52YXMgZnJvbSAnLi9tb2R1bGVzL29mZmNhbnZhcy5qcyc7XG5pbXBvcnQgb3ZlcmxheSBmcm9tICcuL21vZHVsZXMvb3ZlcmxheS5qcyc7XG5pbXBvcnQgc3RpY2tOYXYgZnJvbSAnLi9tb2R1bGVzL3N0aWNrTmF2LmpzJztcbmltcG9ydCBzZWN0aW9uSGlnaGxpZ2h0ZXIgZnJvbSAnLi9tb2R1bGVzL3NlY3Rpb25IaWdobGlnaHRlci5qcyc7XG5pbXBvcnQgc3RhdGljQ29sdW1uIGZyb20gJy4vbW9kdWxlcy9zdGF0aWNDb2x1bW4uanMnO1xuaW1wb3J0IGFsZXJ0IGZyb20gJy4vbW9kdWxlcy9hbGVydC5qcyc7XG5pbXBvcnQgYnNkdG9vbHNTaWdudXAgZnJvbSAnLi9tb2R1bGVzL2JzZHRvb2xzLXNpZ251cC5qcyc7XG5pbXBvcnQgZm9ybUVmZmVjdHMgZnJvbSAnLi9tb2R1bGVzL2Zvcm1FZmZlY3RzLmpzJztcbmltcG9ydCBmYWNldHMgZnJvbSAnLi9tb2R1bGVzL2ZhY2V0cy5qcyc7XG5pbXBvcnQgb3dsU2V0dGluZ3MgZnJvbSAnLi9tb2R1bGVzL293bFNldHRpbmdzLmpzJztcbmltcG9ydCBpT1M3SGFjayBmcm9tICcuL21vZHVsZXMvaU9TN0hhY2suanMnO1xuaW1wb3J0IFNoYXJlRm9ybSBmcm9tICcuL21vZHVsZXMvc2hhcmUtZm9ybS5qcyc7XG5pbXBvcnQgY2FwdGNoYVJlc2l6ZSBmcm9tICcuL21vZHVsZXMvY2FwdGNoYVJlc2l6ZS5qcyc7XG5pbXBvcnQgcm90YXRpbmdUZXh0QW5pbWF0aW9uIGZyb20gJy4vbW9kdWxlcy9yb3RhdGluZ1RleHRBbmltYXRpb24uanMnO1xuaW1wb3J0IFNlYXJjaCBmcm9tICcuL21vZHVsZXMvc2VhcmNoLmpzJztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5pbXBvcnQgdG9nZ2xlT3BlbiBmcm9tICcuL21vZHVsZXMvdG9nZ2xlT3Blbi5qcyc7XG5pbXBvcnQgdG9nZ2xlTWVudSBmcm9tICcuL21vZHVsZXMvdG9nZ2xlTWVudS5qcyc7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cbmZ1bmN0aW9uIHJlYWR5KGZuKSB7XG4gIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnbG9hZGluZycpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xuICB9IGVsc2Uge1xuICAgIGZuKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgdG9nZ2xlT3BlbignaXMtb3BlbicpO1xuICBhbGVydCgnaXMtb3BlbicpO1xuICBvZmZjYW52YXMoKTtcbiAgYWNjb3JkaW9uKCk7XG4gIHNpbXBsZUFjY29yZGlvbigpO1xuICBvdmVybGF5KCk7XG5cbiAgLy8gRmFjZXRXUCBwYWdlc1xuICBmYWNldHMoKTtcblxuICAvLyBIb21lcGFnZVxuICBzdGF0aWNDb2x1bW4oKTtcbiAgc3RpY2tOYXYoKTtcbiAgYnNkdG9vbHNTaWdudXAoKTtcbiAgZm9ybUVmZmVjdHMoKTtcbiAgb3dsU2V0dGluZ3MoKTtcbiAgaU9TN0hhY2soKTtcbiAgY2FwdGNoYVJlc2l6ZSgpO1xuICByb3RhdGluZ1RleHRBbmltYXRpb24oKTtcbiAgc2VjdGlvbkhpZ2hsaWdodGVyKCk7XG5cbiAgLy8gU2VhcmNoXG4gIG5ldyBTZWFyY2goKS5pbml0KCk7XG59XG5cbnJlYWR5KGluaXQpO1xuXG4vLyBNYWtlIGNlcnRhaW4gZnVuY3Rpb25zIGF2YWlsYWJsZSBnbG9iYWxseVxud2luZG93LmFjY29yZGlvbiA9IGFjY29yZGlvbjtcblxuKGZ1bmN0aW9uKHdpbmRvdywgJCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8vIEluaXRpYWxpemUgc2hhcmUgYnkgZW1haWwvc21zIGZvcm1zLlxuICAkKGAuJHtTaGFyZUZvcm0uQ3NzQ2xhc3MuRk9STX1gKS5lYWNoKChpLCBlbCkgPT4ge1xuICAgIGNvbnN0IHNoYXJlRm9ybSA9IG5ldyBTaGFyZUZvcm0oZWwpO1xuICAgIHNoYXJlRm9ybS5pbml0KCk7XG4gIH0pO1xufSkod2luZG93LCBqUXVlcnkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21haW4uanMiLCIvKipcbiAqIEFjY29yZGlvbiBtb2R1bGVcbiAqIEBtb2R1bGUgbW9kdWxlcy9hY2NvcmRpb25cbiAqL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICAvKipcbiAgICogQ29udmVydCBhY2NvcmRpb24gaGVhZGluZyB0byBhIGJ1dHRvblxuICAgKiBAcGFyYW0ge29iamVjdH0gJGhlYWRlckVsZW0gLSBqUXVlcnkgb2JqZWN0IGNvbnRhaW5pbmcgb3JpZ2luYWwgaGVhZGVyXG4gICAqIEByZXR1cm4ge29iamVjdH0gTmV3IGhlYWRpbmcgZWxlbWVudFxuICAgKi9cbiAgZnVuY3Rpb24gY29udmVydEhlYWRlclRvQnV0dG9uKCRoZWFkZXJFbGVtKSB7XG4gICAgaWYgKCRoZWFkZXJFbGVtLmdldCgwKS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYnV0dG9uJykge1xuICAgICAgcmV0dXJuICRoZWFkZXJFbGVtO1xuICAgIH1cbiAgICBjb25zdCBoZWFkZXJFbGVtID0gJGhlYWRlckVsZW0uZ2V0KDApO1xuICAgIGNvbnN0IG5ld0hlYWRlckVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBmb3JFYWNoKGhlYWRlckVsZW0uYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cikge1xuICAgICAgbmV3SGVhZGVyRWxlbS5zZXRBdHRyaWJ1dGUoYXR0ci5ub2RlTmFtZSwgYXR0ci5ub2RlVmFsdWUpO1xuICAgIH0pO1xuICAgIG5ld0hlYWRlckVsZW0uc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpO1xuICAgIGNvbnN0ICRuZXdIZWFkZXJFbGVtID0gJChuZXdIZWFkZXJFbGVtKTtcbiAgICAkbmV3SGVhZGVyRWxlbS5odG1sKCRoZWFkZXJFbGVtLmh0bWwoKSk7XG4gICAgJG5ld0hlYWRlckVsZW0uYXBwZW5kKCc8c3ZnIGNsYXNzPVwiby1hY2NvcmRpb25fX2NhcmV0IGljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1jYXJldC1kb3duXCI+PC91c2U+PC9zdmc+Jyk7XG4gICAgcmV0dXJuICRuZXdIZWFkZXJFbGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB2aXNpYmlsaXR5IGF0dHJpYnV0ZXMgZm9yIGhlYWRlclxuICAgKiBAcGFyYW0ge29iamVjdH0gJGhlYWRlckVsZW0gLSBUaGUgYWNjb3JkaW9uIGhlYWRlciBqUXVlcnkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWFrZVZpc2libGUgLSBXaGV0aGVyIHRoZSBoZWFkZXIncyBjb250ZW50IHNob3VsZCBiZSB2aXNpYmxlXG4gICAqL1xuICBmdW5jdGlvbiB0b2dnbGVIZWFkZXIoJGhlYWRlckVsZW0sIG1ha2VWaXNpYmxlKSB7XG4gICAgJGhlYWRlckVsZW0uYXR0cignYXJpYS1leHBhbmRlZCcsIG1ha2VWaXNpYmxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYXR0cmlidXRlcywgY2xhc3NlcywgYW5kIGV2ZW50IGJpbmRpbmcgdG8gYWNjb3JkaW9uIGhlYWRlclxuICAgKiBAcGFyYW0ge29iamVjdH0gJGhlYWRlckVsZW0gLSBUaGUgYWNjb3JkaW9uIGhlYWRlciBqUXVlcnkgb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkcmVsYXRlZFBhbmVsIC0gVGhlIHBhbmVsIHRoZSBhY2NvcmRpb24gaGVhZGVyIGNvbnRyb2xzXG4gICAqL1xuICBmdW5jdGlvbiBpbml0aWFsaXplSGVhZGVyKCRoZWFkZXJFbGVtLCAkcmVsYXRlZFBhbmVsKSB7XG4gICAgJGhlYWRlckVsZW0uYXR0cih7XG4gICAgICAnYXJpYS1zZWxlY3RlZCc6IGZhbHNlLFxuICAgICAgJ2FyaWEtY29udHJvbHMnOiAkcmVsYXRlZFBhbmVsLmdldCgwKS5pZCxcbiAgICAgICdhcmlhLWV4cGFuZGVkJzogZmFsc2UsXG4gICAgICAncm9sZSc6ICdoZWFkaW5nJ1xuICAgIH0pLmFkZENsYXNzKCdvLWFjY29yZGlvbl9faGVhZGVyJyk7XG5cbiAgICAkaGVhZGVyRWxlbS5vbignY2xpY2suYWNjb3JkaW9uJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkaGVhZGVyRWxlbS50cmlnZ2VyKCdjaGFuZ2VTdGF0ZScpO1xuICAgIH0pO1xuXG4gICAgJGhlYWRlckVsZW0ub24oJ21vdXNlbGVhdmUuYWNjb3JkaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAkaGVhZGVyRWxlbS5ibHVyKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIHZpc2liaWxpdHkgYXR0cmlidXRlcyBmb3IgcGFuZWxcbiAgICogQHBhcmFtIHtvYmplY3R9ICRwYW5lbEVsZW0gLSBUaGUgYWNjb3JkaW9uIHBhbmVsIGpRdWVyeSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBtYWtlVmlzaWJsZSAtIFdoZXRoZXIgdGhlIHBhbmVsIHNob3VsZCBiZSB2aXNpYmxlXG4gICAqL1xuICBmdW5jdGlvbiB0b2dnbGVQYW5lbCgkcGFuZWxFbGVtLCBtYWtlVmlzaWJsZSkge1xuICAgICRwYW5lbEVsZW0uYXR0cignYXJpYS1oaWRkZW4nLCAhbWFrZVZpc2libGUpO1xuICAgIGlmIChtYWtlVmlzaWJsZSkge1xuICAgICAgJHBhbmVsRWxlbS5jc3MoJ2hlaWdodCcsICRwYW5lbEVsZW0uZGF0YSgnaGVpZ2h0JykgKyAncHgnKTtcbiAgICAgICRwYW5lbEVsZW0uZmluZCgnYSwgYnV0dG9uLCBbdGFiaW5kZXhdJykuYXR0cigndGFiaW5kZXgnLCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHBhbmVsRWxlbS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICRwYW5lbEVsZW0uZmluZCgnYSwgYnV0dG9uLCBbdGFiaW5kZXhdJykuYXR0cigndGFiaW5kZXgnLCAtMSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBDU1MgY2xhc3NlcyB0byBhY2NvcmRpb24gcGFuZWxzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkcGFuZWxFbGVtIC0gVGhlIGFjY29yZGlvbiBwYW5lbCBqUXVlcnkgb2JqZWN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYWJlbGxlZGJ5IC0gSUQgb2YgZWxlbWVudCAoYWNjb3JkaW9uIGhlYWRlcikgdGhhdCBsYWJlbHMgcGFuZWxcbiAgICovXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVQYW5lbCgkcGFuZWxFbGVtLCBsYWJlbGxlZGJ5KSB7XG4gICAgJHBhbmVsRWxlbS5hZGRDbGFzcygnby1hY2NvcmRpb25fX2NvbnRlbnQnKTtcbiAgICBjYWxjdWxhdGVQYW5lbEhlaWdodCgkcGFuZWxFbGVtKTtcbiAgICAkcGFuZWxFbGVtLmF0dHIoe1xuICAgICAgJ2FyaWEtaGlkZGVuJzogdHJ1ZSxcbiAgICAgICdyb2xlJzogJ3JlZ2lvbicsXG4gICAgICAnYXJpYS1sYWJlbGxlZGJ5JzogbGFiZWxsZWRieVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhY2NvcmRpb24gcGFuZWwgaGVpZ2h0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkcGFuZWxFbGVtIC0gVGhlIGFjY29yZGlvbiBwYW5lbCBqUXVlcnkgb2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiBjYWxjdWxhdGVQYW5lbEhlaWdodCgkcGFuZWxFbGVtKSB7XG4gICAgJHBhbmVsRWxlbS5kYXRhKCdoZWlnaHQnLCAkcGFuZWxFbGVtLmhlaWdodCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgc3RhdGUgZm9yIGFjY29yZGlvbiBjaGlsZHJlblxuICAgKiBAcGFyYW0ge29iamVjdH0gJGl0ZW0gLSBUaGUgYWNjb3JkaW9uIGl0ZW0galF1ZXJ5IG9iamVjdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ha2VWaXNpYmxlIC0gV2hldGhlciB0byBtYWtlIHRoZSBhY2NvcmRpb24gY29udGVudCB2aXNpYmxlXG4gICAqL1xuICBmdW5jdGlvbiB0b2dnbGVBY2NvcmRpb25JdGVtKCRpdGVtLCBtYWtlVmlzaWJsZSkge1xuICAgIGlmIChtYWtlVmlzaWJsZSkge1xuICAgICAgJGl0ZW0uYWRkQ2xhc3MoJ2lzLWV4cGFuZGVkJyk7XG4gICAgICAkaXRlbS5yZW1vdmVDbGFzcygnaXMtY29sbGFwc2VkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRpdGVtLnJlbW92ZUNsYXNzKCdpcy1leHBhbmRlZCcpO1xuICAgICAgJGl0ZW0uYWRkQ2xhc3MoJ2lzLWNvbGxhcHNlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgQ1NTIGNsYXNzZXMgdG8gYWNjb3JkaW9uIGNoaWxkcmVuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkaXRlbSAtIFRoZSBhY2NvcmRpb24gY2hpbGQgalF1ZXJ5IG9iamVjdFxuICAgKi9cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZUFjY29yZGlvbkl0ZW0oJGl0ZW0pIHtcbiAgICBjb25zdCAkYWNjb3JkaW9uQ29udGVudCA9ICRpdGVtLmZpbmQoJy5qcy1hY2NvcmRpb25fX2NvbnRlbnQnKTtcbiAgICBjb25zdCAkYWNjb3JkaW9uSW5pdGlhbEhlYWRlciA9ICRpdGVtLmZpbmQoJy5qcy1hY2NvcmRpb25fX2hlYWRlcicpO1xuICAgIC8vIENsZWFyIGFueSBwcmV2aW91c2x5IGJvdW5kIGV2ZW50c1xuICAgICRpdGVtLm9mZigndG9nZ2xlLmFjY29yZGlvbicpO1xuICAgIC8vIENsZWFyIGFueSBleGlzdGluZyBzdGF0ZSBjbGFzc2VzXG4gICAgJGl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWV4cGFuZGVkIGlzLWNvbGxhcHNlZCcpO1xuICAgIGlmICgkYWNjb3JkaW9uQ29udGVudC5sZW5ndGggJiYgJGFjY29yZGlvbkluaXRpYWxIZWFkZXIubGVuZ3RoKSB7XG4gICAgICAkaXRlbS5hZGRDbGFzcygnby1hY2NvcmRpb25fX2l0ZW0nKTtcbiAgICAgIGxldCAkYWNjb3JkaW9uSGVhZGVyO1xuICAgICAgaWYgKCRhY2NvcmRpb25Jbml0aWFsSGVhZGVyLmdldCgwKS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdidXR0b24nKSB7XG4gICAgICAgICRhY2NvcmRpb25IZWFkZXIgPSAkYWNjb3JkaW9uSW5pdGlhbEhlYWRlcjtcbiAgICAgICAgY2FsY3VsYXRlUGFuZWxIZWlnaHQoJGFjY29yZGlvbkNvbnRlbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGFjY29yZGlvbkhlYWRlciA9IGNvbnZlcnRIZWFkZXJUb0J1dHRvbigkYWNjb3JkaW9uSW5pdGlhbEhlYWRlcik7XG4gICAgICAgICRhY2NvcmRpb25Jbml0aWFsSGVhZGVyLnJlcGxhY2VXaXRoKCRhY2NvcmRpb25IZWFkZXIpO1xuICAgICAgICBpbml0aWFsaXplSGVhZGVyKCRhY2NvcmRpb25IZWFkZXIsICRhY2NvcmRpb25Db250ZW50KTtcbiAgICAgICAgaW5pdGlhbGl6ZVBhbmVsKCRhY2NvcmRpb25Db250ZW50LCAkYWNjb3JkaW9uSGVhZGVyLmdldCgwKS5pZCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ3VzdG9tIGV2ZW50IGhhbmRsZXIgdG8gdG9nZ2xlIHRoZSBhY2NvcmRpb24gaXRlbSBvcGVuL2Nsb3NlZFxuICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ha2VWaXNpYmxlIC0gV2hldGhlciB0byBtYWtlIHRoZSBhY2NvcmRpb24gY29udGVudCB2aXNpYmxlXG4gICAgICAgKi9cbiAgICAgICRpdGVtLm9uKCd0b2dnbGUuYWNjb3JkaW9uJywgZnVuY3Rpb24oZXZlbnQsIG1ha2VWaXNpYmxlKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRvZ2dsZUFjY29yZGlvbkl0ZW0oJGl0ZW0sIG1ha2VWaXNpYmxlKTtcbiAgICAgICAgdG9nZ2xlSGVhZGVyKCRhY2NvcmRpb25IZWFkZXIsIG1ha2VWaXNpYmxlKTtcbiAgICAgICAgdG9nZ2xlUGFuZWwoJGFjY29yZGlvbkNvbnRlbnQsIG1ha2VWaXNpYmxlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDb2xsYXBzZSBwYW5lbHMgaW5pdGlhbGx5XG4gICAgICAkaXRlbS50cmlnZ2VyKCd0b2dnbGUuYWNjb3JkaW9uJywgW2ZhbHNlXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgQVJJQSBhdHRyaWJ1dGVzIGFuZCBDU1MgY2xhc3NlcyB0byB0aGUgcm9vdCBhY2NvcmRpb24gZWxlbWVudHMuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkYWNjb3JkaW9uRWxlbSAtIFRoZSBqUXVlcnkgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGUgYWNjb3JkaW9uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gbXVsdGlTZWxlY3RhYmxlIC0gV2hldGhlciBtdWx0aXBsZSBhY2NvcmRpb24gZHJhd2VycyBjYW4gYmUgb3BlbiBhdCB0aGUgc2FtZSB0aW1lXG4gICAqL1xuICBmdW5jdGlvbiBpbml0aWFsaXplKCRhY2NvcmRpb25FbGVtLCBtdWx0aVNlbGVjdGFibGUpIHtcbiAgICAkYWNjb3JkaW9uRWxlbS5hdHRyKHtcbiAgICAgICdyb2xlJzogJ3ByZXNlbnRhdGlvbicsXG4gICAgICAnYXJpYS1tdWx0aXNlbGVjdGFibGUnOiBtdWx0aVNlbGVjdGFibGVcbiAgICB9KS5hZGRDbGFzcygnby1hY2NvcmRpb24nKTtcbiAgICAkYWNjb3JkaW9uRWxlbS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBpbml0aWFsaXplQWNjb3JkaW9uSXRlbSgkKHRoaXMpKTtcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgY2hhbmdlU3RhdGUgZXZlbnRzIG9uIGFjY29yZGlvbiBoZWFkZXJzLlxuICAgICAqIENsb3NlIHRoZSBvcGVuIGFjY29yZGlvbiBpdGVtIGFuZCBvcGVuIHRoZSBuZXcgb25lLlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgKi9cbiAgICAkYWNjb3JkaW9uRWxlbS5vbignY2hhbmdlU3RhdGUuYWNjb3JkaW9uJywgJy5qcy1hY2NvcmRpb25fX2hlYWRlcicsICQucHJveHkoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGNvbnN0ICRuZXdJdGVtID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5vLWFjY29yZGlvbl9faXRlbScpO1xuICAgICAgaWYgKG11bHRpU2VsZWN0YWJsZSkge1xuICAgICAgICAkbmV3SXRlbS50cmlnZ2VyKCd0b2dnbGUuYWNjb3JkaW9uJywgWyEkbmV3SXRlbS5oYXNDbGFzcygnaXMtZXhwYW5kZWQnKV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgJG9wZW5JdGVtID0gJGFjY29yZGlvbkVsZW0uZmluZCgnLmlzLWV4cGFuZGVkJyk7XG4gICAgICAgICRvcGVuSXRlbS50cmlnZ2VyKCd0b2dnbGUuYWNjb3JkaW9uJywgW2ZhbHNlXSk7XG4gICAgICAgIGlmICgkb3Blbkl0ZW0uZ2V0KDApICE9PSAkbmV3SXRlbS5nZXQoMCkpIHtcbiAgICAgICAgICAkbmV3SXRlbS50cmlnZ2VyKCd0b2dnbGUuYWNjb3JkaW9uJywgW3RydWVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWluaXRpYWxpemUgYW4gYWNjb3JkaW9uIGFmdGVyIGl0cyBjb250ZW50cyB3ZXJlIGR5bmFtaWNhbGx5IHVwZGF0ZWRcbiAgICogQHBhcmFtIHtvYmplY3R9ICRhY2NvcmRpb25FbGVtIC0gVGhlIGpRdWVyeSBvYmplY3QgY29udGFpbmluZyB0aGUgcm9vdCBlbGVtZW50IG9mIHRoZSBhY2NvcmRpb25cbiAgICovXG4gIGZ1bmN0aW9uIHJlSW5pdGlhbGl6ZSgkYWNjb3JkaW9uRWxlbSkge1xuICAgIGlmICgkYWNjb3JkaW9uRWxlbS5oYXNDbGFzcygnby1hY2NvcmRpb24nKSkge1xuICAgICAgJGFjY29yZGlvbkVsZW0uY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBpbml0aWFsaXplQWNjb3JkaW9uSXRlbSgkKHRoaXMpKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtdWx0aVNlbGVjdGFibGUgPSAkYWNjb3JkaW9uRWxlbS5kYXRhKCdtdWx0aXNlbGVjdGFibGUnKSB8fCBmYWxzZTtcbiAgICAgIGluaXRpYWxpemUoJGFjY29yZGlvbkVsZW0sIG11bHRpU2VsZWN0YWJsZSk7XG4gICAgfVxuICB9XG4gIHdpbmRvdy5yZUluaXRpYWxpemVBY2NvcmRpb24gPSByZUluaXRpYWxpemU7XG5cbiAgY29uc3QgJGFjY29yZGlvbnMgPSAkKCcuanMtYWNjb3JkaW9uJykubm90KCcuby1hY2NvcmRpb24nKTtcbiAgaWYgKCRhY2NvcmRpb25zLmxlbmd0aCkge1xuICAgICRhY2NvcmRpb25zLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtdWx0aVNlbGVjdGFibGUgPSAkKHRoaXMpLmRhdGEoJ211bHRpc2VsZWN0YWJsZScpIHx8IGZhbHNlO1xuICAgICAgaW5pdGlhbGl6ZSgkKHRoaXMpLCBtdWx0aVNlbGVjdGFibGUpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEhhbmRsZSBmb250c0FjdGl2ZSBldmVudHMgZmlyZWQgb25jZSBUeXBla2l0IHJlcG9ydHMgdGhhdCB0aGUgZm9udHMgYXJlIGFjdGl2ZS5cbiAgICAgICAqIEBzZWUgYmFzZS50d2lnIGZvciB0aGUgVHlwZWtpdC5sb2FkKCkgZnVuY3Rpb25cbiAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICovXG4gICAgICAkKHRoaXMpLm9uKCdmb250c0FjdGl2ZScsICQucHJveHkoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlSW5pdGlhbGl6ZSgkKHRoaXMpKTtcbiAgICAgIH0sIHRoaXMpKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvYWNjb3JkaW9uLmpzIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlFYWNoLmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vX2Jhc2VGb3JPd24nKSxcbiAgICBjcmVhdGVCYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VFYWNoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yRWFjaGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbnZhciBiYXNlRWFjaCA9IGNyZWF0ZUJhc2VFYWNoKGJhc2VGb3JPd24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VFYWNoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRWFjaC5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VGb3IgPSByZXF1aXJlKCcuL19iYXNlRm9yJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvck93bmAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvck93bjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvck93bi5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGNyZWF0ZUJhc2VGb3IgPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRm9yJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzIG92ZXIgYG9iamVjdGBcbiAqIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIHByb3BlcnR5LlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gva2V5cy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VUaW1lcyA9IHJlcXVpcmUoJy4vX2Jhc2VUaW1lcycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUxpa2VLZXlzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUaW1lcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9fYmFzZUlzQXJndW1lbnRzJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcmd1bWVudHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanNcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzQXJndW1lbnRzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNBcmd1bWVudHMuanNcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJhd1RhZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qc1xuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanNcbi8vIG1vZHVsZSBpZCA9IDMwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDMxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlSXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fYmFzZUlzVHlwZWRBcnJheScpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzVHlwZWRBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gMzJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanNcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5hcnk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qc1xuLy8gbW9kdWxlIGlkID0gMzRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlVXRpbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanNcbi8vIG1vZHVsZSBpZCA9IDM1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5cy5qc1xuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUHJvdG90eXBlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc1Byb3RvdHlwZS5qc1xuLy8gbW9kdWxlIGlkID0gMzdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSAzOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzXG4vLyBtb2R1bGUgaWQgPSAzOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanNcbi8vIG1vZHVsZSBpZCA9IDQwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYGJhc2VFYWNoYCBvciBgYmFzZUVhY2hSaWdodGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRWFjaChlYWNoRnVuYywgZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIGlmIChjb2xsZWN0aW9uID09IG51bGwpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH1cbiAgICBpZiAoIWlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gZWFjaEZ1bmMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRWFjaDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanNcbi8vIG1vZHVsZSBpZCA9IDQxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGBpZGVudGl0eWAgaWYgaXQncyBub3QgYSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBjYXN0IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYXN0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nID8gdmFsdWUgOiBpZGVudGl0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0RnVuY3Rpb247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RGdW5jdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gNDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qc1xuLy8gbW9kdWxlIGlkID0gNDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4qIFNpbXBsZSBhY2NvcmRpb24gbW9kdWxlXG4qIEBtb2R1bGUgbW9kdWxlcy9zaW1wbGVBY2NvcmRpb25cbiogQHNlZSBodHRwczovL3BlcmlzaGFibGVwcmVzcy5jb20vanF1ZXJ5LWFjY29yZGlvbi1tZW51LXR1dG9yaWFsL1xuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICAvLyQoJy5qcy1hY2NvcmRpb24gPiB1bCA+IGxpOmhhcyhvbCknKS5hZGRDbGFzcyhcImhhcy1zdWJcIik7XG4gICQoJy5qcy1zLWFjY29yZGlvbiA+IGxpID4gaDMuanMtcy1hY2NvcmRpb25fX2hlYWRlcicpLmFwcGVuZCgnPHN2ZyBjbGFzcz1cIm8tYWNjb3JkaW9uX19jYXJldCBpY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tY2FyZXQtZG93blwiPjwvdXNlPjwvc3ZnPicpO1xuXG4gICQoJy5qcy1zLWFjY29yZGlvbiA+IGxpID4gaDMuanMtcy1hY2NvcmRpb25fX2hlYWRlcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIHZhciBjaGVja0VsZW1lbnQgPSAkKHRoaXMpLm5leHQoKTtcblxuICAgICQoJy5qcy1zLWFjY29yZGlvbiBsaScpLnJlbW92ZUNsYXNzKCdpcy1leHBhbmRlZCcpO1xuICAgICQodGhpcykuY2xvc2VzdCgnbGknKS5hZGRDbGFzcygnaXMtZXhwYW5kZWQnKTtcblxuXG4gICAgaWYoKGNoZWNrRWxlbWVudC5pcygnLmpzLXMtYWNjb3JkaW9uX19jb250ZW50JykpICYmIChjaGVja0VsZW1lbnQuaXMoJzp2aXNpYmxlJykpKSB7XG4gICAgICAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWV4cGFuZGVkJyk7XG4gICAgICBjaGVja0VsZW1lbnQuc2xpZGVVcCgnbm9ybWFsJyk7XG4gICAgfVxuXG4gICAgaWYoKGNoZWNrRWxlbWVudC5pcygnLmpzLXMtYWNjb3JkaW9uX19jb250ZW50JykpICYmICghY2hlY2tFbGVtZW50LmlzKCc6dmlzaWJsZScpKSkge1xuICAgICAgJCgnLmpzLXMtYWNjb3JkaW9uIC5qcy1zLWFjY29yZGlvbl9fY29udGVudDp2aXNpYmxlJykuc2xpZGVVcCgnbm9ybWFsJyk7XG4gICAgICBjaGVja0VsZW1lbnQuc2xpZGVEb3duKCdub3JtYWwnKTtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tFbGVtZW50LmlzKCcuanMtcy1hY2NvcmRpb25fX2NvbnRlbnQnKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3NpbXBsZUFjY29yZGlvbi5qcyIsIi8qKlxuICogT2ZmY2FudmFzIG1vZHVsZVxuICogQG1vZHVsZSBtb2R1bGVzL29mZmNhbnZhc1xuICogQHNlZSBtb2R1bGVzL3RvZ2dsZU9wZW5cbiAqL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5cbi8qKlxuICogU2hpZnQga2V5Ym9hcmQgZm9jdXMgd2hlbiB0aGUgb2ZmY2FudmFzIG5hdiBpcyBvcGVuLlxuICogVGhlICdjaGFuZ2VPcGVuU3RhdGUnIGV2ZW50IGlzIGZpcmVkIGJ5IG1vZHVsZXMvdG9nZ2xlT3BlblxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgY29uc3Qgb2ZmQ2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW9mZmNhbnZhcycpO1xuICBpZiAob2ZmQ2FudmFzKSB7XG4gICAgZm9yRWFjaChvZmZDYW52YXMsIGZ1bmN0aW9uKG9mZkNhbnZhc0VsZW0pIHtcbiAgICAgIGNvbnN0IG9mZkNhbnZhc1NpZGUgPSBvZmZDYW52YXNFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5qcy1vZmZjYW52YXNfX3NpZGUnKTtcblxuICAgICAgLyoqXG4gICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgJ2NoYW5nZU9wZW5TdGF0ZScuXG4gICAgICAqIFRoZSB2YWx1ZSBvZiBldmVudC5kZXRhaWwgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIG9wZW4gc3RhdGUgaXMgdHJ1ZVxuICAgICAgKiAoaS5lLiB0aGUgb2ZmY2FudmFzIGNvbnRlbnQgaXMgdmlzaWJsZSkuXG4gICAgICAqIEBmdW5jdGlvblxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAqL1xuICAgICAgb2ZmQ2FudmFzRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2VPcGVuU3RhdGUnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuZGV0YWlsKSB7XG4gICAgICAgICAgaWYgKCEoL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pLnRlc3Qob2ZmQ2FudmFzU2lkZS50YWdOYW1lKSkpIHtcbiAgICAgICAgICAgIG9mZkNhbnZhc1NpZGUudGFiSW5kZXggPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb2ZmQ2FudmFzU2lkZS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL29mZmNhbnZhcy5qcyIsIi8qKlxuICogT3ZlcmxheSBtb2R1bGVcbiAqIEBtb2R1bGUgbW9kdWxlcy9vdmVybGF5XG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuXG4vKipcbiAqIFNoaWZ0IGtleWJvYXJkIGZvY3VzIHdoZW4gdGhlIHNlYXJjaCBvdmVybGF5IGlzIG9wZW4uXG4gKiBUaGUgJ2NoYW5nZU9wZW5TdGF0ZScgZXZlbnQgaXMgZmlyZWQgYnkgbW9kdWxlcy90b2dnbGVPcGVuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW92ZXJsYXknKTtcbiAgaWYgKG92ZXJsYXkpIHtcbiAgICBmb3JFYWNoKG92ZXJsYXksIGZ1bmN0aW9uKG92ZXJsYXlFbGVtKSB7XG4gICAgICAvKipcbiAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAnY2hhbmdlT3BlblN0YXRlJy5cbiAgICAgICogVGhlIHZhbHVlIG9mIGV2ZW50LmRldGFpbCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgb3BlbiBzdGF0ZSBpcyB0cnVlXG4gICAgICAqIChpLmUuIHRoZSBvdmVybGF5IGlzIHZpc2libGUpLlxuICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgKi9cbiAgICAgIG92ZXJsYXlFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZU9wZW5TdGF0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5kZXRhaWwpIHtcbiAgICAgICAgICBpZiAoISgvXig/OmF8c2VsZWN0fGlucHV0fGJ1dHRvbnx0ZXh0YXJlYSkkL2kudGVzdChvdmVybGF5LnRhZ05hbWUpKSkge1xuICAgICAgICAgICAgb3ZlcmxheS50YWJJbmRleCA9IC0xO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtb3ZlcmxheSBpbnB1dCcpKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtb3ZlcmxheSBpbnB1dCcpWzBdLmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG92ZXJsYXkuZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvb3ZlcmxheS5qcyIsIi8qKlxuKiBTdGljayBOYXYgbW9kdWxlXG4qIEBtb2R1bGUgbW9kdWxlcy9zdGlja3lOYXZcbiovXG5cbmltcG9ydCB0aHJvdHRsZSBmcm9tICdsb2Rhc2gvdGhyb3R0bGUnO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ2xvZGFzaC9kZWJvdW5jZSc7XG5pbXBvcnQgaW1hZ2VzUmVhZHkgZnJvbSAnaW1hZ2VzcmVhZHkvZGlzdC9pbWFnZXNyZWFkeS5qcyc7XG5cbi8qKlxuKiBcIlN0aWNrXCIgY29udGVudCBpbiBwbGFjZSBhcyB0aGUgdXNlciBzY3JvbGxzXG4qIEBwYXJhbSB7b2JqZWN0fSAkZWxlbSAtIGpRdWVyeSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIHN0aWNreVxuKiBAcGFyYW0ge29iamVjdH0gJGVsZW1Db250YWluZXIgLSBqUXVlcnkgZWxlbWVudCBmb3IgdGhlIGVsZW1lbnQncyBjb250YWluZXIuIFVzZWQgdG8gc2V0IHRoZSB0b3AgYW5kIGJvdHRvbSBwb2ludHNcbiogQHBhcmFtIHtvYmplY3R9ICRlbGVtQXJ0aWNsZSAtIENvbnRlbnQgbmV4dCB0byB0aGUgc3RpY2t5IG5hdlxuKi9cbmZ1bmN0aW9uIHN0aWNreU5hdigkZWxlbSwgJGVsZW1Db250YWluZXIsICRlbGVtQXJ0aWNsZSkge1xuICAvLyBNb2R1bGUgc2V0dGluZ3NcbiAgY29uc3Qgc2V0dGluZ3MgPSB7XG4gICAgc3RpY2t5Q2xhc3M6ICdpcy1zdGlja3knLFxuICAgIGFic29sdXRlQ2xhc3M6ICdpcy1zdHVjaycsXG4gICAgbGFyZ2VCcmVha3BvaW50OiAnMTAyNHB4JyxcbiAgICBhcnRpY2xlQ2xhc3M6ICdvLWFydGljbGUtLXNoaWZ0J1xuICB9O1xuXG4gIC8vIEdsb2JhbHNcbiAgbGV0IHN0aWNreU1vZGUgPSBmYWxzZTsgLy8gRmxhZyB0byB0ZWxsIGlmIHNpZGViYXIgaXMgaW4gXCJzdGlja3kgbW9kZVwiXG4gIGxldCBpc1N0aWNreSA9IGZhbHNlOyAvLyBXaGV0aGVyIHRoZSBzaWRlYmFyIGlzIHN0aWNreSBhdCB0aGlzIGV4YWN0IG1vbWVudCBpbiB0aW1lXG4gIGxldCBpc0Fic29sdXRlID0gZmFsc2U7IC8vIFdoZXRoZXIgdGhlIHNpZGViYXIgaXMgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGF0IHRoZSBib3R0b21cbiAgbGV0IHN3aXRjaFBvaW50ID0gMDsgLy8gUG9pbnQgYXQgd2hpY2ggdG8gc3dpdGNoIHRvIHN0aWNreSBtb2RlXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGxldCBzd2l0Y2hQb2ludEJvdHRvbSA9IDA7IC8vIFBvaW50IGF0IHdoaWNoIHRvIFwiZnJlZXplXCIgdGhlIHNpZGViYXIgc28gaXQgZG9lc24ndCBvdmVybGFwIHRoZSBmb290ZXJcbiAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBsZXQgbGVmdE9mZnNldCA9IDA7IC8vIEFtb3VudCBzaWRlYmFyIHNob3VsZCBiZSBzZXQgZnJvbSB0aGUgbGVmdCBzaWRlXG4gIGxldCBlbGVtV2lkdGggPSAwOyAvLyBXaWR0aCBpbiBwaXhlbHMgb2Ygc2lkZWJhclxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBsZXQgZWxlbUhlaWdodCA9IDA7IC8vIEhlaWdodCBpbiBwaXhlbHMgb2Ygc2lkZWJhclxuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cbiAgLyoqXG4gICogVG9nZ2xlIHRoZSBzdGlja3kgYmVoYXZpb3JcbiAgKlxuICAqIFR1cm5zIG9uIGlmIHRoZSB1c2VyIGhhcyBzY3JvbGxlZCBwYXN0IHRoZSBzd2l0Y2ggcG9pbnQsIG9mZiBpZiB0aGV5IHNjcm9sbCBiYWNrIHVwXG4gICogSWYgc3RpY2t5IG1vZGUgaXMgb24sIHNldHMgdGhlIGxlZnQgb2Zmc2V0IGFzIHdlbGxcbiAgKi9cbiAgZnVuY3Rpb24gdG9nZ2xlU3RpY2t5KCkge1xuICAgIGNvbnN0IGN1cnJlbnRTY3JvbGxQb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICBpZiAoY3VycmVudFNjcm9sbFBvcyA+IHN3aXRjaFBvaW50KSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgc2lkZWJhciBpcyBhbHJlYWR5IHN0aWNreVxuICAgICAgaWYgKCFpc1N0aWNreSkge1xuICAgICAgICBpc1N0aWNreSA9IHRydWU7XG4gICAgICAgIGlzQWJzb2x1dGUgPSBmYWxzZTtcbiAgICAgICAgJGVsZW0uYWRkQ2xhc3Moc2V0dGluZ3Muc3RpY2t5Q2xhc3MpLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFic29sdXRlQ2xhc3MpO1xuICAgICAgICAkZWxlbUFydGljbGUuYWRkQ2xhc3Moc2V0dGluZ3MuYXJ0aWNsZUNsYXNzKTtcbiAgICAgICAgdXBkYXRlRGltZW5zaW9ucygpO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgc2lkZWJhciBoYXMgcmVhY2hlZCB0aGUgYm90dG9tIHN3aXRjaCBwb2ludFxuICAgICAgaWYgKCQoJy5jLWZvb3Rlcl9fcmVhY2hlZCcpLmlzT25TY3JlZW4oKSkge1xuICAgICAgICBpc1N0aWNreSA9IGZhbHNlO1xuICAgICAgICBpc0Fic29sdXRlID0gdHJ1ZTtcbiAgICAgICAgJGVsZW0uYWRkQ2xhc3Moc2V0dGluZ3MuYWJzb2x1dGVDbGFzcyk7XG4gICAgICAgIHVwZGF0ZURpbWVuc2lvbnMoKTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoaXNTdGlja3kgfHwgaXNBYnNvbHV0ZSkge1xuICAgICAgaXNTdGlja3kgPSBmYWxzZTtcbiAgICAgIGlzQWJzb2x1dGUgPSBmYWxzZTtcbiAgICAgICRlbGVtLnJlbW92ZUNsYXNzKGAke3NldHRpbmdzLnN0aWNreUNsYXNzfSAke3NldHRpbmdzLmFic29sdXRlQ2xhc3N9YCk7XG4gICAgICAkZWxlbUFydGljbGUucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYXJ0aWNsZUNsYXNzKTtcbiAgICAgIHVwZGF0ZURpbWVuc2lvbnMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBVcGRhdGUgZGltZW5zaW9ucyBvbiBzaWRlYmFyXG4gICpcbiAgKiBTZXQgdG8gdGhlIGN1cnJlbnQgdmFsdWVzIG9mIGxlZnRPZmZzZXQgYW5kIGVsZW1XaWR0aCBpZiB0aGUgZWxlbWVudCBpc1xuICAqIGN1cnJlbnRseSBzdGlja3kuIE90aGVyd2lzZSwgY2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHZhbHVlc1xuICAqXG4gICogQHBhcmFtIHtib29sZWFufSBmb3JjZUNsZWFyIC0gRmxhZyB0byBjbGVhciBzZXQgdmFsdWVzIHJlZ2FyZGxlc3Mgb2Ygc3RpY2t5IHN0YXR1c1xuICAqL1xuICBmdW5jdGlvbiB1cGRhdGVEaW1lbnNpb25zKGZvcmNlQ2xlYXIpIHtcbiAgICBpZiAoaXNTdGlja3kgJiYgIWZvcmNlQ2xlYXIpIHtcbiAgICAgICRlbGVtLmNzcyh7XG4gICAgICAgIGxlZnQ6IGxlZnRPZmZzZXQgKyAncHgnLFxuICAgICAgICB3aWR0aDogZWxlbVdpZHRoICsgJ3B4JyxcbiAgICAgICAgdG9wOiAnJyxcbiAgICAgICAgYm90dG9tOiAnJ1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChpc0Fic29sdXRlICYmICFmb3JjZUNsZWFyKSB7XG4gICAgICAkZWxlbS5jc3Moe1xuICAgICAgICBsZWZ0OiAkZWxlbUNvbnRhaW5lci5jc3MoJ3BhZGRpbmctbGVmdCcpLFxuICAgICAgICB3aWR0aDogZWxlbVdpZHRoICsgJ3B4JyxcbiAgICAgICAgdG9wOiAnYXV0bycsXG4gICAgICAgIGJvdHRvbTogJGVsZW1Db250YWluZXIuY3NzKCdwYWRkaW5nLWJvdHRvbScpXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgbGVmdDogJycsXG4gICAgICAgIHdpZHRoOiAnJyxcbiAgICAgICAgdG9wOiAnJyxcbiAgICAgICAgYm90dG9tOiAnJ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogU2V0IHRoZSBzd2l0Y2hwb2ludCBmb3IgdGhlIGVsZW1lbnQgYW5kIGdldCBpdHMgY3VycmVudCBvZmZzZXRzXG4gICovXG4gIGZ1bmN0aW9uIHNldE9mZnNldFZhbHVlcygpIHtcbiAgICAkZWxlbS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgaWYgKGlzU3RpY2t5IHx8IGlzQWJzb2x1dGUpIHtcbiAgICAgICRlbGVtLnJlbW92ZUNsYXNzKGAke3NldHRpbmdzLnN0aWNreUNsYXNzfSAke3NldHRpbmdzLmFic29sdXRlQ2xhc3N9YCk7XG4gICAgICAkZWxlbUFydGljbGUucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYXJ0aWNsZUNsYXNzKTtcbiAgICB9XG4gICAgdXBkYXRlRGltZW5zaW9ucyh0cnVlKTtcblxuICAgIHN3aXRjaFBvaW50ID0gJGVsZW0ub2Zmc2V0KCkudG9wO1xuICAgIC8vIEJvdHRvbSBzd2l0Y2ggcG9pbnQgaXMgZXF1YWwgdG8gdGhlIG9mZnNldCBhbmQgaGVpZ2h0IG9mIHRoZSBvdXRlciBjb250YWluZXIsIG1pbnVzIGFueSBwYWRkaW5nIG9uIHRoZSBib3R0b21cbiAgICBzd2l0Y2hQb2ludEJvdHRvbSA9ICRlbGVtQ29udGFpbmVyLm9mZnNldCgpLnRvcCArICRlbGVtQ29udGFpbmVyLm91dGVySGVpZ2h0KCkgLVxuICAgICAgcGFyc2VJbnQoJGVsZW1Db250YWluZXIuY3NzKCdwYWRkaW5nLWJvdHRvbScpLCAxMCk7XG5cbiAgICBsZWZ0T2Zmc2V0ID0gJGVsZW0ub2Zmc2V0KCkubGVmdDtcbiAgICBlbGVtV2lkdGggPSAkZWxlbS5vdXRlcldpZHRoKCk7XG4gICAgZWxlbUhlaWdodCA9ICRlbGVtLm91dGVySGVpZ2h0KCk7XG5cbiAgICBpZiAoaXNTdGlja3kgfHwgaXNBYnNvbHV0ZSkge1xuICAgICAgdXBkYXRlRGltZW5zaW9ucygpO1xuICAgICAgJGVsZW0uYWRkQ2xhc3Moc2V0dGluZ3Muc3RpY2t5Q2xhc3MpO1xuICAgICAgJGVsZW1BcnRpY2xlLmFkZENsYXNzKHNldHRpbmdzLmFydGljbGVDbGFzcyk7XG4gICAgICBpZiAoaXNBYnNvbHV0ZSkge1xuICAgICAgICAkZWxlbS5hZGRDbGFzcyhzZXR0aW5ncy5hYnNvbHV0ZUNsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgJGVsZW0uY3NzKCd2aXNpYmlsaXR5JywgJycpO1xuICB9XG5cbiAgLyoqXG4gICogVHVybiBvbiBcInN0aWNreSBtb2RlXCJcbiAgKlxuICAqIFdhdGNoIGZvciBzY3JvbGwgYW5kIGZpeCB0aGUgc2lkZWJhci4gV2F0Y2ggZm9yIHNpemVzIGNoYW5nZXMgb24gI21haW5cbiAgKiAod2hpY2ggbWF5IGNoYW5nZSBpZiBwYXJhbGxheCBpcyB1c2VkKSBhbmQgYWRqdXN0IGFjY29yZGluZ2x5LlxuICAqL1xuICBmdW5jdGlvbiBzdGlja3lNb2RlT24oKSB7XG4gICAgc3RpY2t5TW9kZSA9IHRydWU7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbC5maXhlZFNpZGViYXInLCB0aHJvdHRsZShmdW5jdGlvbigpIHtcbiAgICAgIHRvZ2dsZVN0aWNreSgpO1xuICAgIH0sIDEwMCkpLnRyaWdnZXIoJ3Njcm9sbC5maXhlZFNpZGViYXInKTtcblxuICAgICQoJyNtYWluJykub24oJ2NvbnRhaW5lclNpemVDaGFuZ2UuZml4ZWRTaWRlYmFyJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHN3aXRjaFBvaW50IC09IGV2ZW50Lm9yaWdpbmFsRXZlbnQuZGV0YWlsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICogVHVybiBvZmYgXCJzdGlja3kgbW9kZVwiXG4gICpcbiAgKiBSZW1vdmUgdGhlIGV2ZW50IGJpbmRpbmcgYW5kIHJlc2V0IGV2ZXJ5dGhpbmdcbiAgKi9cbiAgZnVuY3Rpb24gc3RpY2t5TW9kZU9mZigpIHtcbiAgICBpZiAoaXNTdGlja3kpIHtcbiAgICAgIHVwZGF0ZURpbWVuc2lvbnModHJ1ZSk7XG4gICAgICAkZWxlbS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5zdGlja3lDbGFzcyk7XG4gICAgfVxuICAgICQod2luZG93KS5vZmYoJ3Njcm9sbC5maXhlZFNpZGViYXInKTtcbiAgICAkKCcjbWFpbicpLm9mZignY29udGFpbmVyU2l6ZUNoYW5nZS5maXhlZFNpZGViYXInKTtcbiAgICBzdGlja3lNb2RlID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgKiBIYW5kbGUgJ3Jlc2l6ZScgZXZlbnRcbiAgKlxuICAqIFR1cm4gc3RpY2t5IG1vZGUgb24vb2ZmIGRlcGVuZGluZyBvbiB3aGV0aGVyIHdlJ3JlIGluIGRlc2t0b3AgbW9kZVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RpY2t5TW9kZSAtIFdoZXRoZXIgc2lkZWJhciBzaG91bGQgYmUgY29uc2lkZXJlZCBzdGlja3lcbiAgKi9cbiAgZnVuY3Rpb24gb25SZXNpemUoKSB7XG4gICAgY29uc3QgbGFyZ2VNb2RlID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6ICcgK1xuICAgICAgc2V0dGluZ3MubGFyZ2VCcmVha3BvaW50ICsgJyknKS5tYXRjaGVzO1xuICAgIGlmIChsYXJnZU1vZGUpIHtcbiAgICAgIHNldE9mZnNldFZhbHVlcygpO1xuICAgICAgaWYgKCFzdGlja3lNb2RlKSB7XG4gICAgICAgIHN0aWNreU1vZGVPbigpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3RpY2t5TW9kZSkge1xuICAgICAgc3RpY2t5TW9kZU9mZigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIEluaXRpYWxpemUgdGhlIHN0aWNreSBuYXZcbiAgKiBAcGFyYW0ge29iamVjdH0gZWxlbSAtIERPTSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIHN0aWNreVxuICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucy4gV2lsbCBvdmVycmlkZSBtb2R1bGUgZGVmYXVsdHMgd2hlbiBwcmVzZW50XG4gICovXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuZml4ZWRTaWRlYmFyJywgZGVib3VuY2UoZnVuY3Rpb24oKSB7XG4gICAgICBvblJlc2l6ZSgpO1xuICAgIH0sIDEwMCkpO1xuXG4gICAgaW1hZ2VzUmVhZHkoZG9jdW1lbnQuYm9keSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIG9uUmVzaXplKCk7XG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplKCk7XG5cbiAgJC5mbi5pc09uU2NyZWVuID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgd2luID0gJCh3aW5kb3cpO1xuXG4gICAgdmFyIHZpZXdwb3J0ID0ge1xuICAgICAgICB0b3AgOiB3aW4uc2Nyb2xsVG9wKCksXG4gICAgICAgIGxlZnQgOiB3aW4uc2Nyb2xsTGVmdCgpXG4gICAgfTtcbiAgICB2aWV3cG9ydC5yaWdodCA9IHZpZXdwb3J0LmxlZnQgKyB3aW4ud2lkdGgoKTtcbiAgICB2aWV3cG9ydC5ib3R0b20gPSB2aWV3cG9ydC50b3AgKyB3aW4uaGVpZ2h0KCk7XG5cbiAgICB2YXIgYm91bmRzID0gdGhpcy5vZmZzZXQoKTtcbiAgICBib3VuZHMucmlnaHQgPSBib3VuZHMubGVmdCArIHRoaXMub3V0ZXJXaWR0aCgpO1xuICAgIGJvdW5kcy5ib3R0b20gPSBib3VuZHMudG9wICsgdGhpcy5vdXRlckhlaWdodCgpO1xuXG4gICAgcmV0dXJuICghKHZpZXdwb3J0LnJpZ2h0IDwgYm91bmRzLmxlZnQgfHwgdmlld3BvcnQubGVmdCA+IGJvdW5kcy5yaWdodCB8fCB2aWV3cG9ydC5ib3R0b20gPCBib3VuZHMudG9wIHx8IHZpZXdwb3J0LnRvcCA+IGJvdW5kcy5ib3R0b20pKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0ICRzdGlja3lOYXZzID0gJCgnLmpzLXN0aWNreScpO1xuICBpZiAoJHN0aWNreU5hdnMubGVuZ3RoKSB7XG4gICAgJHN0aWNreU5hdnMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGxldCAkb3V0ZXJDb250YWluZXIgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1zdGlja3ktY29udGFpbmVyJyk7XG4gICAgICBsZXQgJGFydGljbGUgPSAkb3V0ZXJDb250YWluZXIuZmluZCgnLmpzLXN0aWNreS1hcnRpY2xlJyk7XG4gICAgICBzdGlja3lOYXYoJCh0aGlzKSwgJG91dGVyQ29udGFpbmVyLCAkYXJ0aWNsZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3N0aWNrTmF2LmpzIiwidmFyIGRlYm91bmNlID0gcmVxdWlyZSgnLi9kZWJvdW5jZScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCBvbmx5IGludm9rZXMgYGZ1bmNgIGF0IG1vc3Qgb25jZSBwZXJcbiAqIGV2ZXJ5IGB3YWl0YCBtaWxsaXNlY29uZHMuIFRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgXG4gKiBtZXRob2QgdG8gY2FuY2VsIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvXG4gKiBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS4gUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGBcbiAqIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZCB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGVcbiAqIHRocm90dGxlZCBmdW5jdGlvbi4gU3Vic2VxdWVudCBjYWxscyB0byB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHJldHVybiB0aGVcbiAqIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRocm90dGxlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy50aHJvdHRsZWAgYW5kIGBfLmRlYm91bmNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGludm9jYXRpb25zIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZy5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlcy5cbiAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwgeyAndHJhaWxpbmcnOiBmYWxzZSB9KTtcbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCB0aHJvdHRsZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgdGhyb3R0bGVkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCB0aHJvdHRsZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGVhZGluZyA9IHRydWUsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIHtcbiAgICAnbGVhZGluZyc6IGxlYWRpbmcsXG4gICAgJ21heFdhaXQnOiB3YWl0LFxuICAgICd0cmFpbGluZyc6IHRyYWlsaW5nXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL3Rocm90dGxlLmpzXG4vLyBtb2R1bGUgaWQgPSA0OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBub3c7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvbm93LmpzXG4vLyBtb2R1bGUgaWQgPSA0OVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b051bWJlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b051bWJlci5qc1xuLy8gbW9kdWxlIGlkID0gNTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzXG4vLyBtb2R1bGUgaWQgPSA1MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiBpbWFnZXNyZWFkeSB2MC4yLjIgLSAyMDE1LTA3LTA0VDA2OjIyOjE0LjQzNVogLSBodHRwczovL2dpdGh1Yi5jb20vci1wYXJrL2ltYWdlcy1yZWFkeSAqL1xuOyhmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuaW1hZ2VzUmVhZHkgPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG5cInVzZSBzdHJpY3RcIjtcblxuLy8gVXNlIHRoZSBmYXN0ZXN0IG1lYW5zIHBvc3NpYmxlIHRvIGV4ZWN1dGUgYSB0YXNrIGluIGl0cyBvd24gdHVybiwgd2l0aFxuLy8gcHJpb3JpdHkgb3ZlciBvdGhlciBldmVudHMgaW5jbHVkaW5nIElPLCBhbmltYXRpb24sIHJlZmxvdywgYW5kIHJlZHJhd1xuLy8gZXZlbnRzIGluIGJyb3dzZXJzLlxuLy9cbi8vIEFuIGV4Y2VwdGlvbiB0aHJvd24gYnkgYSB0YXNrIHdpbGwgcGVybWFuZW50bHkgaW50ZXJydXB0IHRoZSBwcm9jZXNzaW5nIG9mXG4vLyBzdWJzZXF1ZW50IHRhc2tzLiBUaGUgaGlnaGVyIGxldmVsIGBhc2FwYCBmdW5jdGlvbiBlbnN1cmVzIHRoYXQgaWYgYW5cbi8vIGV4Y2VwdGlvbiBpcyB0aHJvd24gYnkgYSB0YXNrLCB0aGF0IHRoZSB0YXNrIHF1ZXVlIHdpbGwgY29udGludWUgZmx1c2hpbmcgYXNcbi8vIHNvb24gYXMgcG9zc2libGUsIGJ1dCBpZiB5b3UgdXNlIGByYXdBc2FwYCBkaXJlY3RseSwgeW91IGFyZSByZXNwb25zaWJsZSB0b1xuLy8gZWl0aGVyIGVuc3VyZSB0aGF0IG5vIGV4Y2VwdGlvbnMgYXJlIHRocm93biBmcm9tIHlvdXIgdGFzaywgb3IgdG8gbWFudWFsbHlcbi8vIGNhbGwgYHJhd0FzYXAucmVxdWVzdEZsdXNoYCBpZiBhbiBleGNlcHRpb24gaXMgdGhyb3duLlxuLy9tb2R1bGUuZXhwb3J0cyA9IHJhd0FzYXA7XG5mdW5jdGlvbiByYXdBc2FwKHRhc2spIHtcbiAgICBpZiAoIXF1ZXVlLmxlbmd0aCkge1xuICAgICAgICByZXF1ZXN0Rmx1c2goKTtcbiAgICAgICAgZmx1c2hpbmcgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBFcXVpdmFsZW50IHRvIHB1c2gsIGJ1dCBhdm9pZHMgYSBmdW5jdGlvbiBjYWxsLlxuICAgIHF1ZXVlW3F1ZXVlLmxlbmd0aF0gPSB0YXNrO1xufVxuXG52YXIgcXVldWUgPSBbXTtcbi8vIE9uY2UgYSBmbHVzaCBoYXMgYmVlbiByZXF1ZXN0ZWQsIG5vIGZ1cnRoZXIgY2FsbHMgdG8gYHJlcXVlc3RGbHVzaGAgYXJlXG4vLyBuZWNlc3NhcnkgdW50aWwgdGhlIG5leHQgYGZsdXNoYCBjb21wbGV0ZXMuXG52YXIgZmx1c2hpbmcgPSBmYWxzZTtcbi8vIGByZXF1ZXN0Rmx1c2hgIGlzIGFuIGltcGxlbWVudGF0aW9uLXNwZWNpZmljIG1ldGhvZCB0aGF0IGF0dGVtcHRzIHRvIGtpY2tcbi8vIG9mZiBhIGBmbHVzaGAgZXZlbnQgYXMgcXVpY2tseSBhcyBwb3NzaWJsZS4gYGZsdXNoYCB3aWxsIGF0dGVtcHQgdG8gZXhoYXVzdFxuLy8gdGhlIGV2ZW50IHF1ZXVlIGJlZm9yZSB5aWVsZGluZyB0byB0aGUgYnJvd3NlcidzIG93biBldmVudCBsb29wLlxudmFyIHJlcXVlc3RGbHVzaDtcbi8vIFRoZSBwb3NpdGlvbiBvZiB0aGUgbmV4dCB0YXNrIHRvIGV4ZWN1dGUgaW4gdGhlIHRhc2sgcXVldWUuIFRoaXMgaXNcbi8vIHByZXNlcnZlZCBiZXR3ZWVuIGNhbGxzIHRvIGBmbHVzaGAgc28gdGhhdCBpdCBjYW4gYmUgcmVzdW1lZCBpZlxuLy8gYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24uXG52YXIgaW5kZXggPSAwO1xuLy8gSWYgYSB0YXNrIHNjaGVkdWxlcyBhZGRpdGlvbmFsIHRhc2tzIHJlY3Vyc2l2ZWx5LCB0aGUgdGFzayBxdWV1ZSBjYW4gZ3Jvd1xuLy8gdW5ib3VuZGVkLiBUbyBwcmV2ZW50IG1lbW9yeSBleGhhdXN0aW9uLCB0aGUgdGFzayBxdWV1ZSB3aWxsIHBlcmlvZGljYWxseVxuLy8gdHJ1bmNhdGUgYWxyZWFkeS1jb21wbGV0ZWQgdGFza3MuXG52YXIgY2FwYWNpdHkgPSAxMDI0O1xuXG4vLyBUaGUgZmx1c2ggZnVuY3Rpb24gcHJvY2Vzc2VzIGFsbCB0YXNrcyB0aGF0IGhhdmUgYmVlbiBzY2hlZHVsZWQgd2l0aFxuLy8gYHJhd0FzYXBgIHVubGVzcyBhbmQgdW50aWwgb25lIG9mIHRob3NlIHRhc2tzIHRocm93cyBhbiBleGNlcHRpb24uXG4vLyBJZiBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgYGZsdXNoYCBlbnN1cmVzIHRoYXQgaXRzIHN0YXRlIHdpbGwgcmVtYWluXG4vLyBjb25zaXN0ZW50IGFuZCB3aWxsIHJlc3VtZSB3aGVyZSBpdCBsZWZ0IG9mZiB3aGVuIGNhbGxlZCBhZ2Fpbi5cbi8vIEhvd2V2ZXIsIGBmbHVzaGAgZG9lcyBub3QgbWFrZSBhbnkgYXJyYW5nZW1lbnRzIHRvIGJlIGNhbGxlZCBhZ2FpbiBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93bi5cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHdoaWxlIChpbmRleCA8IHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgIC8vIEFkdmFuY2UgdGhlIGluZGV4IGJlZm9yZSBjYWxsaW5nIHRoZSB0YXNrLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSB3aWxsXG4gICAgICAgIC8vIGJlZ2luIGZsdXNoaW5nIG9uIHRoZSBuZXh0IHRhc2sgdGhlIHRhc2sgdGhyb3dzIGFuIGVycm9yLlxuICAgICAgICBpbmRleCA9IGluZGV4ICsgMTtcbiAgICAgICAgcXVldWVbY3VycmVudEluZGV4XS5jYWxsKCk7XG4gICAgICAgIC8vIFByZXZlbnQgbGVha2luZyBtZW1vcnkgZm9yIGxvbmcgY2hhaW5zIG9mIHJlY3Vyc2l2ZSBjYWxscyB0byBgYXNhcGAuXG4gICAgICAgIC8vIElmIHdlIGNhbGwgYGFzYXBgIHdpdGhpbiB0YXNrcyBzY2hlZHVsZWQgYnkgYGFzYXBgLCB0aGUgcXVldWUgd2lsbFxuICAgICAgICAvLyBncm93LCBidXQgdG8gYXZvaWQgYW4gTyhuKSB3YWxrIGZvciBldmVyeSB0YXNrIHdlIGV4ZWN1dGUsIHdlIGRvbid0XG4gICAgICAgIC8vIHNoaWZ0IHRhc2tzIG9mZiB0aGUgcXVldWUgYWZ0ZXIgdGhleSBoYXZlIGJlZW4gZXhlY3V0ZWQuXG4gICAgICAgIC8vIEluc3RlYWQsIHdlIHBlcmlvZGljYWxseSBzaGlmdCAxMDI0IHRhc2tzIG9mZiB0aGUgcXVldWUuXG4gICAgICAgIGlmIChpbmRleCA+IGNhcGFjaXR5KSB7XG4gICAgICAgICAgICAvLyBNYW51YWxseSBzaGlmdCBhbGwgdmFsdWVzIHN0YXJ0aW5nIGF0IHRoZSBpbmRleCBiYWNrIHRvIHRoZVxuICAgICAgICAgICAgLy8gYmVnaW5uaW5nIG9mIHRoZSBxdWV1ZS5cbiAgICAgICAgICAgIGZvciAodmFyIHNjYW4gPSAwLCBuZXdMZW5ndGggPSBxdWV1ZS5sZW5ndGggLSBpbmRleDsgc2NhbiA8IG5ld0xlbmd0aDsgc2NhbisrKSB7XG4gICAgICAgICAgICAgICAgcXVldWVbc2Nhbl0gPSBxdWV1ZVtzY2FuICsgaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcXVldWUubGVuZ3RoIC09IGluZGV4O1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgaW5kZXggPSAwO1xuICAgIGZsdXNoaW5nID0gZmFsc2U7XG59XG5cbi8vIGByZXF1ZXN0Rmx1c2hgIGlzIGltcGxlbWVudGVkIHVzaW5nIGEgc3RyYXRlZ3kgYmFzZWQgb24gZGF0YSBjb2xsZWN0ZWQgZnJvbVxuLy8gZXZlcnkgYXZhaWxhYmxlIFNhdWNlTGFicyBTZWxlbml1bSB3ZWIgZHJpdmVyIHdvcmtlciBhdCB0aW1lIG9mIHdyaXRpbmcuXG4vLyBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xbUctNVVZR3VwNXF4R2RFTVdraFA2QldDejA1M05VYjJFMVFvVVRVMTZ1QS9lZGl0I2dpZD03ODM3MjQ1OTNcblxuLy8gU2FmYXJpIDYgYW5kIDYuMSBmb3IgZGVza3RvcCwgaVBhZCwgYW5kIGlQaG9uZSBhcmUgdGhlIG9ubHkgYnJvd3NlcnMgdGhhdFxuLy8gaGF2ZSBXZWJLaXRNdXRhdGlvbk9ic2VydmVyIGJ1dCBub3QgdW4tcHJlZml4ZWQgTXV0YXRpb25PYnNlcnZlci5cbi8vIE11c3QgdXNlIGBnbG9iYWxgIGluc3RlYWQgb2YgYHdpbmRvd2AgdG8gd29yayBpbiBib3RoIGZyYW1lcyBhbmQgd2ViXG4vLyB3b3JrZXJzLiBgZ2xvYmFsYCBpcyBhIHByb3Zpc2lvbiBvZiBCcm93c2VyaWZ5LCBNciwgTXJzLCBvciBNb3AuXG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlciB8fCB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuLy8gTXV0YXRpb25PYnNlcnZlcnMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgaGF2ZSBoaWdoIHByaW9yaXR5IGFuZCB3b3JrXG4vLyByZWxpYWJseSBldmVyeXdoZXJlIHRoZXkgYXJlIGltcGxlbWVudGVkLlxuLy8gVGhleSBhcmUgaW1wbGVtZW50ZWQgaW4gYWxsIG1vZGVybiBicm93c2Vycy5cbi8vXG4vLyAtIEFuZHJvaWQgNC00LjNcbi8vIC0gQ2hyb21lIDI2LTM0XG4vLyAtIEZpcmVmb3ggMTQtMjlcbi8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgMTFcbi8vIC0gaVBhZCBTYWZhcmkgNi03LjFcbi8vIC0gaVBob25lIFNhZmFyaSA3LTcuMVxuLy8gLSBTYWZhcmkgNi03XG5pZiAodHlwZW9mIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG5cbi8vIE1lc3NhZ2VDaGFubmVscyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBnaXZlIGRpcmVjdCBhY2Nlc3MgdG8gdGhlIEhUTUxcbi8vIHRhc2sgcXVldWUsIGFyZSBpbXBsZW1lbnRlZCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCwgU2FmYXJpIDUuMC0xLCBhbmQgT3BlcmFcbi8vIDExLTEyLCBhbmQgaW4gd2ViIHdvcmtlcnMgaW4gbWFueSBlbmdpbmVzLlxuLy8gQWx0aG91Z2ggbWVzc2FnZSBjaGFubmVscyB5aWVsZCB0byBhbnkgcXVldWVkIHJlbmRlcmluZyBhbmQgSU8gdGFza3MsIHRoZXlcbi8vIHdvdWxkIGJlIGJldHRlciB0aGFuIGltcG9zaW5nIHRoZSA0bXMgZGVsYXkgb2YgdGltZXJzLlxuLy8gSG93ZXZlciwgdGhleSBkbyBub3Qgd29yayByZWxpYWJseSBpbiBJbnRlcm5ldCBFeHBsb3JlciBvciBTYWZhcmkuXG5cbi8vIEludGVybmV0IEV4cGxvcmVyIDEwIGlzIHRoZSBvbmx5IGJyb3dzZXIgdGhhdCBoYXMgc2V0SW1tZWRpYXRlIGJ1dCBkb2VzXG4vLyBub3QgaGF2ZSBNdXRhdGlvbk9ic2VydmVycy5cbi8vIEFsdGhvdWdoIHNldEltbWVkaWF0ZSB5aWVsZHMgdG8gdGhlIGJyb3dzZXIncyByZW5kZXJlciwgaXQgd291bGQgYmVcbi8vIHByZWZlcnJhYmxlIHRvIGZhbGxpbmcgYmFjayB0byBzZXRUaW1lb3V0IHNpbmNlIGl0IGRvZXMgbm90IGhhdmVcbi8vIHRoZSBtaW5pbXVtIDRtcyBwZW5hbHR5LlxuLy8gVW5mb3J0dW5hdGVseSB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwIE1vYmlsZSAoYW5kXG4vLyBEZXNrdG9wIHRvIGEgbGVzc2VyIGV4dGVudCkgdGhhdCByZW5kZXJzIGJvdGggc2V0SW1tZWRpYXRlIGFuZFxuLy8gTWVzc2FnZUNoYW5uZWwgdXNlbGVzcyBmb3IgdGhlIHB1cnBvc2VzIG9mIEFTQVAuXG4vLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL3EvaXNzdWVzLzM5NlxuXG4vLyBUaW1lcnMgYXJlIGltcGxlbWVudGVkIHVuaXZlcnNhbGx5LlxuLy8gV2UgZmFsbCBiYWNrIHRvIHRpbWVycyBpbiB3b3JrZXJzIGluIG1vc3QgZW5naW5lcywgYW5kIGluIGZvcmVncm91bmRcbi8vIGNvbnRleHRzIGluIHRoZSBmb2xsb3dpbmcgYnJvd3NlcnMuXG4vLyBIb3dldmVyLCBub3RlIHRoYXQgZXZlbiB0aGlzIHNpbXBsZSBjYXNlIHJlcXVpcmVzIG51YW5jZXMgdG8gb3BlcmF0ZSBpbiBhXG4vLyBicm9hZCBzcGVjdHJ1bSBvZiBicm93c2Vycy5cbi8vXG4vLyAtIEZpcmVmb3ggMy0xM1xuLy8gLSBJbnRlcm5ldCBFeHBsb3JlciA2LTlcbi8vIC0gaVBhZCBTYWZhcmkgNC4zXG4vLyAtIEx5bnggMi44Ljdcbn0gZWxzZSB7XG4gICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGZsdXNoKTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgcmVxdWVzdHMgdGhhdCB0aGUgaGlnaCBwcmlvcml0eSBldmVudCBxdWV1ZSBiZSBmbHVzaGVkIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLlxuLy8gVGhpcyBpcyB1c2VmdWwgdG8gcHJldmVudCBhbiBlcnJvciB0aHJvd24gaW4gYSB0YXNrIGZyb20gc3RhbGxpbmcgdGhlIGV2ZW50XG4vLyBxdWV1ZSBpZiB0aGUgZXhjZXB0aW9uIGhhbmRsZWQgYnkgTm9kZS5qc+KAmXNcbi8vIGBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIilgIG9yIGJ5IGEgZG9tYWluLlxucmF3QXNhcC5yZXF1ZXN0Rmx1c2ggPSByZXF1ZXN0Rmx1c2g7XG5cbi8vIFRvIHJlcXVlc3QgYSBoaWdoIHByaW9yaXR5IGV2ZW50LCB3ZSBpbmR1Y2UgYSBtdXRhdGlvbiBvYnNlcnZlciBieSB0b2dnbGluZ1xuLy8gdGhlIHRleHQgb2YgYSB0ZXh0IG5vZGUgYmV0d2VlbiBcIjFcIiBhbmQgXCItMVwiLlxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spIHtcbiAgICB2YXIgdG9nZ2xlID0gMTtcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbiAgICAgICAgdG9nZ2xlID0gLXRvZ2dsZTtcbiAgICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlO1xuICAgIH07XG59XG5cbi8vIFRoZSBtZXNzYWdlIGNoYW5uZWwgdGVjaG5pcXVlIHdhcyBkaXNjb3ZlcmVkIGJ5IE1hbHRlIFVibCBhbmQgd2FzIHRoZVxuLy8gb3JpZ2luYWwgZm91bmRhdGlvbiBmb3IgdGhpcyBsaWJyYXJ5LlxuLy8gaHR0cDovL3d3dy5ub25ibG9ja2luZy5pby8yMDExLzA2L3dpbmRvd25leHR0aWNrLmh0bWxcblxuLy8gU2FmYXJpIDYuMC41IChhdCBsZWFzdCkgaW50ZXJtaXR0ZW50bHkgZmFpbHMgdG8gY3JlYXRlIG1lc3NhZ2UgcG9ydHMgb24gYVxuLy8gcGFnZSdzIGZpcnN0IGxvYWQuIFRoYW5rZnVsbHksIHRoaXMgdmVyc2lvbiBvZiBTYWZhcmkgc3VwcG9ydHNcbi8vIE11dGF0aW9uT2JzZXJ2ZXJzLCBzbyB3ZSBkb24ndCBuZWVkIHRvIGZhbGwgYmFjayBpbiB0aGF0IGNhc2UuXG5cbi8vIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NZXNzYWdlQ2hhbm5lbChjYWxsYmFjaykge1xuLy8gICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4vLyAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBjYWxsYmFjaztcbi8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4vLyAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4vLyAgICAgfTtcbi8vIH1cblxuLy8gRm9yIHJlYXNvbnMgZXhwbGFpbmVkIGFib3ZlLCB3ZSBhcmUgYWxzbyB1bmFibGUgdG8gdXNlIGBzZXRJbW1lZGlhdGVgXG4vLyB1bmRlciBhbnkgY2lyY3Vtc3RhbmNlcy5cbi8vIEV2ZW4gaWYgd2Ugd2VyZSwgdGhlcmUgaXMgYW5vdGhlciBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAuXG4vLyBJdCBpcyBub3Qgc3VmZmljaWVudCB0byBhc3NpZ24gYHNldEltbWVkaWF0ZWAgdG8gYHJlcXVlc3RGbHVzaGAgYmVjYXVzZVxuLy8gYHNldEltbWVkaWF0ZWAgbXVzdCBiZSBjYWxsZWQgKmJ5IG5hbWUqIGFuZCB0aGVyZWZvcmUgbXVzdCBiZSB3cmFwcGVkIGluIGFcbi8vIGNsb3N1cmUuXG4vLyBOZXZlciBmb3JnZXQuXG5cbi8vIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21TZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbi8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4vLyAgICAgICAgIHNldEltbWVkaWF0ZShjYWxsYmFjayk7XG4vLyAgICAgfTtcbi8vIH1cblxuLy8gU2FmYXJpIDYuMCBoYXMgYSBwcm9ibGVtIHdoZXJlIHRpbWVycyB3aWxsIGdldCBsb3N0IHdoaWxlIHRoZSB1c2VyIGlzXG4vLyBzY3JvbGxpbmcuIFRoaXMgcHJvYmxlbSBkb2VzIG5vdCBpbXBhY3QgQVNBUCBiZWNhdXNlIFNhZmFyaSA2LjAgc3VwcG9ydHNcbi8vIG11dGF0aW9uIG9ic2VydmVycywgc28gdGhhdCBpbXBsZW1lbnRhdGlvbiBpcyB1c2VkIGluc3RlYWQuXG4vLyBIb3dldmVyLCBpZiB3ZSBldmVyIGVsZWN0IHRvIHVzZSB0aW1lcnMgaW4gU2FmYXJpLCB0aGUgcHJldmFsZW50IHdvcmstYXJvdW5kXG4vLyBpcyB0byBhZGQgYSBzY3JvbGwgZXZlbnQgbGlzdGVuZXIgdGhhdCBjYWxscyBmb3IgYSBmbHVzaC5cblxuLy8gYHNldFRpbWVvdXRgIGRvZXMgbm90IGNhbGwgdGhlIHBhc3NlZCBjYWxsYmFjayBpZiB0aGUgZGVsYXkgaXMgbGVzcyB0aGFuXG4vLyBhcHByb3hpbWF0ZWx5IDcgaW4gd2ViIHdvcmtlcnMgaW4gRmlyZWZveCA4IHRocm91Z2ggMTgsIGFuZCBzb21ldGltZXMgbm90XG4vLyBldmVuIHRoZW4uXG5cbmZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbiAgICAgICAgLy8gV2UgZGlzcGF0Y2ggYSB0aW1lb3V0IHdpdGggYSBzcGVjaWZpZWQgZGVsYXkgb2YgMCBmb3IgZW5naW5lcyB0aGF0XG4gICAgICAgIC8vIGNhbiByZWxpYWJseSBhY2NvbW1vZGF0ZSB0aGF0IHJlcXVlc3QuIFRoaXMgd2lsbCB1c3VhbGx5IGJlIHNuYXBwZWRcbiAgICAgICAgLy8gdG8gYSA0IG1pbGlzZWNvbmQgZGVsYXksIGJ1dCBvbmNlIHdlJ3JlIGZsdXNoaW5nLCB0aGVyZSdzIG5vIGRlbGF5XG4gICAgICAgIC8vIGJldHdlZW4gZXZlbnRzLlxuICAgICAgICB2YXIgdGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoaGFuZGxlVGltZXIsIDApO1xuICAgICAgICAvLyBIb3dldmVyLCBzaW5jZSB0aGlzIHRpbWVyIGdldHMgZnJlcXVlbnRseSBkcm9wcGVkIGluIEZpcmVmb3hcbiAgICAgICAgLy8gd29ya2Vycywgd2UgZW5saXN0IGFuIGludGVydmFsIGhhbmRsZSB0aGF0IHdpbGwgdHJ5IHRvIGZpcmVcbiAgICAgICAgLy8gYW4gZXZlbnQgMjAgdGltZXMgcGVyIHNlY29uZCB1bnRpbCBpdCBzdWNjZWVkcy5cbiAgICAgICAgdmFyIGludGVydmFsSGFuZGxlID0gc2V0SW50ZXJ2YWwoaGFuZGxlVGltZXIsIDUwKTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVUaW1lcigpIHtcbiAgICAgICAgICAgIC8vIFdoaWNoZXZlciB0aW1lciBzdWNjZWVkcyB3aWxsIGNhbmNlbCBib3RoIHRpbWVycyBhbmRcbiAgICAgICAgICAgIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrLlxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRIYW5kbGUpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbEhhbmRsZSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuLy8gVGhpcyBpcyBmb3IgYGFzYXAuanNgIG9ubHkuXG4vLyBJdHMgbmFtZSB3aWxsIGJlIHBlcmlvZGljYWxseSByYW5kb21pemVkIHRvIGJyZWFrIGFueSBjb2RlIHRoYXQgZGVwZW5kcyBvblxuLy8gaXRzIGV4aXN0ZW5jZS5cbnJhd0FzYXAubWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyO1xuXG4vLyBBU0FQIHdhcyBvcmlnaW5hbGx5IGEgbmV4dFRpY2sgc2hpbSBpbmNsdWRlZCBpbiBRLiBUaGlzIHdhcyBmYWN0b3JlZCBvdXRcbi8vIGludG8gdGhpcyBBU0FQIHBhY2thZ2UuIEl0IHdhcyBsYXRlciBhZGFwdGVkIHRvIFJTVlAgd2hpY2ggbWFkZSBmdXJ0aGVyXG4vLyBhbWVuZG1lbnRzLiBUaGVzZSBkZWNpc2lvbnMsIHBhcnRpY3VsYXJseSB0byBtYXJnaW5hbGl6ZSBNZXNzYWdlQ2hhbm5lbCBhbmRcbi8vIHRvIGNhcHR1cmUgdGhlIE11dGF0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24gaW4gYSBjbG9zdXJlLCB3ZXJlIGludGVncmF0ZWRcbi8vIGJhY2sgaW50byBBU0FQIHByb3Blci5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90aWxkZWlvL3JzdnAuanMvYmxvYi9jZGRmNzIzMjU0NmE5Y2Y4NTg1MjRiNzVjZGU2ZjllZGY3MjYyMGE3L2xpYi9yc3ZwL2FzYXAuanNcblxuJ3VzZSBzdHJpY3QnO1xuXG4vL3ZhciBhc2FwID0gcmVxdWlyZSgnYXNhcC9yYXcnKTtcbnZhciBhc2FwID0gcmF3QXNhcDtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8vIFN0YXRlczpcbi8vXG4vLyAwIC0gcGVuZGluZ1xuLy8gMSAtIGZ1bGZpbGxlZCB3aXRoIF92YWx1ZVxuLy8gMiAtIHJlamVjdGVkIHdpdGggX3ZhbHVlXG4vLyAzIC0gYWRvcHRlZCB0aGUgc3RhdGUgb2YgYW5vdGhlciBwcm9taXNlLCBfdmFsdWVcbi8vXG4vLyBvbmNlIHRoZSBzdGF0ZSBpcyBubyBsb25nZXIgcGVuZGluZyAoMCkgaXQgaXMgaW1tdXRhYmxlXG5cbi8vIEFsbCBgX2AgcHJlZml4ZWQgcHJvcGVydGllcyB3aWxsIGJlIHJlZHVjZWQgdG8gYF97cmFuZG9tIG51bWJlcn1gXG4vLyBhdCBidWlsZCB0aW1lIHRvIG9iZnVzY2F0ZSB0aGVtIGFuZCBkaXNjb3VyYWdlIHRoZWlyIHVzZS5cbi8vIFdlIGRvbid0IHVzZSBzeW1ib2xzIG9yIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0byBmdWxseSBoaWRlIHRoZW1cbi8vIGJlY2F1c2UgdGhlIHBlcmZvcm1hbmNlIGlzbid0IGdvb2QgZW5vdWdoLlxuXG5cbi8vIHRvIGF2b2lkIHVzaW5nIHRyeS9jYXRjaCBpbnNpZGUgY3JpdGljYWwgZnVuY3Rpb25zLCB3ZVxuLy8gZXh0cmFjdCB0aGVtIHRvIGhlcmUuXG52YXIgTEFTVF9FUlJPUiA9IG51bGw7XG52YXIgSVNfRVJST1IgPSB7fTtcbmZ1bmN0aW9uIGdldFRoZW4ob2JqKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG9iai50aGVuO1xuICB9IGNhdGNoIChleCkge1xuICAgIExBU1RfRVJST1IgPSBleDtcbiAgICByZXR1cm4gSVNfRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5Q2FsbE9uZShmbiwgYSkge1xuICB0cnkge1xuICAgIHJldHVybiBmbihhKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBMQVNUX0VSUk9SID0gZXg7XG4gICAgcmV0dXJuIElTX0VSUk9SO1xuICB9XG59XG5mdW5jdGlvbiB0cnlDYWxsVHdvKGZuLCBhLCBiKSB7XG4gIHRyeSB7XG4gICAgZm4oYSwgYik7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgTEFTVF9FUlJPUiA9IGV4O1xuICAgIHJldHVybiBJU19FUlJPUjtcbiAgfVxufVxuXG4vL21vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcblxuZnVuY3Rpb24gUHJvbWlzZShmbikge1xuICBpZiAodHlwZW9mIHRoaXMgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3Jyk7XG4gIH1cbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG4gIH1cbiAgdGhpcy5fNDEgPSAwO1xuICB0aGlzLl84NiA9IG51bGw7XG4gIHRoaXMuXzE3ID0gW107XG4gIGlmIChmbiA9PT0gbm9vcCkgcmV0dXJuO1xuICBkb1Jlc29sdmUoZm4sIHRoaXMpO1xufVxuUHJvbWlzZS5fMSA9IG5vb3A7XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICBpZiAodGhpcy5jb25zdHJ1Y3RvciAhPT0gUHJvbWlzZSkge1xuICAgIHJldHVybiBzYWZlVGhlbih0aGlzLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gIH1cbiAgdmFyIHJlcyA9IG5ldyBQcm9taXNlKG5vb3ApO1xuICBoYW5kbGUodGhpcywgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHJlcykpO1xuICByZXR1cm4gcmVzO1xufTtcblxuZnVuY3Rpb24gc2FmZVRoZW4oc2VsZiwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIG5ldyBzZWxmLmNvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVzID0gbmV3IFByb21pc2Uobm9vcCk7XG4gICAgcmVzLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICBoYW5kbGUoc2VsZiwgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHJlcykpO1xuICB9KTtcbn07XG5mdW5jdGlvbiBoYW5kbGUoc2VsZiwgZGVmZXJyZWQpIHtcbiAgd2hpbGUgKHNlbGYuXzQxID09PSAzKSB7XG4gICAgc2VsZiA9IHNlbGYuXzg2O1xuICB9XG4gIGlmIChzZWxmLl80MSA9PT0gMCkge1xuICAgIHNlbGYuXzE3LnB1c2goZGVmZXJyZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICBhc2FwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYiA9IHNlbGYuXzQxID09PSAxID8gZGVmZXJyZWQub25GdWxmaWxsZWQgOiBkZWZlcnJlZC5vblJlamVjdGVkO1xuICAgIGlmIChjYiA9PT0gbnVsbCkge1xuICAgICAgaWYgKHNlbGYuXzQxID09PSAxKSB7XG4gICAgICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fODYpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KGRlZmVycmVkLnByb21pc2UsIHNlbGYuXzg2KTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJldCA9IHRyeUNhbGxPbmUoY2IsIHNlbGYuXzg2KTtcbiAgICBpZiAocmV0ID09PSBJU19FUlJPUikge1xuICAgICAgcmVqZWN0KGRlZmVycmVkLnByb21pc2UsIExBU1RfRVJST1IpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHJldCk7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIHJlc29sdmUoc2VsZiwgbmV3VmFsdWUpIHtcbiAgLy8gUHJvbWlzZSBSZXNvbHV0aW9uIFByb2NlZHVyZTogaHR0cHM6Ly9naXRodWIuY29tL3Byb21pc2VzLWFwbHVzL3Byb21pc2VzLXNwZWMjdGhlLXByb21pc2UtcmVzb2x1dGlvbi1wcm9jZWR1cmVcbiAgaWYgKG5ld1ZhbHVlID09PSBzZWxmKSB7XG4gICAgcmV0dXJuIHJlamVjdChcbiAgICAgIHNlbGYsXG4gICAgICBuZXcgVHlwZUVycm9yKCdBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLicpXG4gICAgKTtcbiAgfVxuICBpZiAoXG4gICAgbmV3VmFsdWUgJiZcbiAgICAodHlwZW9mIG5ld1ZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgbmV3VmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICkge1xuICAgIHZhciB0aGVuID0gZ2V0VGhlbihuZXdWYWx1ZSk7XG4gICAgaWYgKHRoZW4gPT09IElTX0VSUk9SKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KHNlbGYsIExBU1RfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICB0aGVuID09PSBzZWxmLnRoZW4gJiZcbiAgICAgIG5ld1ZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZVxuICAgICkge1xuICAgICAgc2VsZi5fNDEgPSAzO1xuICAgICAgc2VsZi5fODYgPSBuZXdWYWx1ZTtcbiAgICAgIGZpbmFsZShzZWxmKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBkb1Jlc29sdmUodGhlbi5iaW5kKG5ld1ZhbHVlKSwgc2VsZik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHNlbGYuXzQxID0gMTtcbiAgc2VsZi5fODYgPSBuZXdWYWx1ZTtcbiAgZmluYWxlKHNlbGYpO1xufVxuXG5mdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbiAgc2VsZi5fNDEgPSAyO1xuICBzZWxmLl84NiA9IG5ld1ZhbHVlO1xuICBmaW5hbGUoc2VsZik7XG59XG5mdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuXzE3Lmxlbmd0aDsgaSsrKSB7XG4gICAgaGFuZGxlKHNlbGYsIHNlbGYuXzE3W2ldKTtcbiAgfVxuICBzZWxmLl8xNyA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb21pc2Upe1xuICB0aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiBudWxsO1xuICB0aGlzLm9uUmVqZWN0ZWQgPSB0eXBlb2Ygb25SZWplY3RlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uUmVqZWN0ZWQgOiBudWxsO1xuICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xufVxuXG4vKipcbiAqIFRha2UgYSBwb3RlbnRpYWxseSBtaXNiZWhhdmluZyByZXNvbHZlciBmdW5jdGlvbiBhbmQgbWFrZSBzdXJlXG4gKiBvbkZ1bGZpbGxlZCBhbmQgb25SZWplY3RlZCBhcmUgb25seSBjYWxsZWQgb25jZS5cbiAqXG4gKiBNYWtlcyBubyBndWFyYW50ZWVzIGFib3V0IGFzeW5jaHJvbnkuXG4gKi9cbmZ1bmN0aW9uIGRvUmVzb2x2ZShmbiwgcHJvbWlzZSkge1xuICB2YXIgZG9uZSA9IGZhbHNlO1xuICB2YXIgcmVzID0gdHJ5Q2FsbFR3byhmbiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gIH0pXG4gIGlmICghZG9uZSAmJiByZXMgPT09IElTX0VSUk9SKSB7XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVqZWN0KHByb21pc2UsIExBU1RfRVJST1IpO1xuICB9XG59XG5cbid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiAqIEBuYW1lIEltYWdlc1JlYWR5XG4gKiBAY29uc3RydWN0b3JcbiAqXG4gKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR8RWxlbWVudHxFbGVtZW50W118alF1ZXJ5fE5vZGVMaXN0fHN0cmluZ30gZWxlbWVudHNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0ganF1ZXJ5XG4gKlxuICovXG5mdW5jdGlvbiBJbWFnZXNSZWFkeShlbGVtZW50cywganF1ZXJ5KSB7XG4gIGlmICh0eXBlb2YgZWxlbWVudHMgPT09ICdzdHJpbmcnKSB7XG4gICAgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRzKTtcbiAgICBpZiAoIWVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZWxlY3RvciBgJyArIGVsZW1lbnRzICsgJ2AgeWllbGRlZCAwIGVsZW1lbnRzJyk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGRlZmVycmVkID0gZGVmZXIoanF1ZXJ5KTtcbiAgdGhpcy5yZXN1bHQgPSBkZWZlcnJlZC5wcm9taXNlO1xuXG4gIHZhciBpbWFnZXMgPSB0aGlzLmltYWdlRWxlbWVudHMoXG4gICAgdGhpcy52YWxpZEVsZW1lbnRzKHRoaXMudG9BcnJheShlbGVtZW50cyksIEltYWdlc1JlYWR5LlZBTElEX05PREVfVFlQRVMpXG4gICk7XG5cbiAgdmFyIGltYWdlQ291bnQgPSBpbWFnZXMubGVuZ3RoO1xuXG4gIGlmIChpbWFnZUNvdW50KSB7XG4gICAgdGhpcy52ZXJpZnkoaW1hZ2VzLCBzdGF0dXMoaW1hZ2VDb3VudCwgZnVuY3Rpb24ocmVhZHkpe1xuICAgICAgaWYgKHJlYWR5KSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoZWxlbWVudHMpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlbGVtZW50cyk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG4gIGVsc2Uge1xuICAgIGRlZmVycmVkLnJlc29sdmUoZWxlbWVudHMpO1xuICB9XG59XG5cblxuSW1hZ2VzUmVhZHkuVkFMSURfTk9ERV9UWVBFUyA9IHtcbiAgMSAgOiB0cnVlLCAvLyBFTEVNRU5UX05PREVcbiAgOSAgOiB0cnVlLCAvLyBET0NVTUVOVF9OT0RFXG4gIDExIDogdHJ1ZSAgLy8gRE9DVU1FTlRfRlJBR01FTlRfTk9ERVxufTtcblxuXG5JbWFnZXNSZWFkeS5wcm90b3R5cGUgPSB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbGVtZW50c1xuICAgKiBAcmV0dXJucyB7W118SFRNTEltYWdlRWxlbWVudFtdfVxuICAgKi9cbiAgaW1hZ2VFbGVtZW50cyA6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgdmFyIGltYWdlcyA9IFtdO1xuXG4gICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgIGlmIChlbGVtZW50Lm5vZGVOYW1lID09PSAnSU1HJykge1xuICAgICAgICBpbWFnZXMucHVzaChlbGVtZW50KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgaW1hZ2VFbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nJyk7XG4gICAgICAgIGlmIChpbWFnZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIGltYWdlcy5wdXNoLmFwcGx5KGltYWdlcywgaW1hZ2VFbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpbWFnZXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50W119IGVsZW1lbnRzXG4gICAqIEBwYXJhbSB7e319IHZhbGlkTm9kZVR5cGVzXG4gICAqIEByZXR1cm5zIHtbXXxFbGVtZW50W119XG4gICAqL1xuICB2YWxpZEVsZW1lbnRzIDogZnVuY3Rpb24oZWxlbWVudHMsIHZhbGlkTm9kZVR5cGVzKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgIHJldHVybiB2YWxpZE5vZGVUeXBlc1tlbGVtZW50Lm5vZGVUeXBlXTtcbiAgICB9KTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnRbXX0gaW1hZ2VzXG4gICAqIEByZXR1cm5zIHtbXXxIVE1MSW1hZ2VFbGVtZW50W119XG4gICAqL1xuICBpbmNvbXBsZXRlSW1hZ2VzIDogZnVuY3Rpb24oaW1hZ2VzKSB7XG4gICAgcmV0dXJuIGltYWdlcy5maWx0ZXIoZnVuY3Rpb24oaW1hZ2Upe1xuICAgICAgcmV0dXJuICEoaW1hZ2UuY29tcGxldGUgJiYgaW1hZ2UubmF0dXJhbFdpZHRoKTtcbiAgICB9KTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbmxvYWRcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb25lcnJvclxuICAgKiBAcmV0dXJucyB7ZnVuY3Rpb24oSFRNTEltYWdlRWxlbWVudCl9XG4gICAqL1xuICBwcm94eUltYWdlIDogZnVuY3Rpb24ob25sb2FkLCBvbmVycm9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICB2YXIgX2ltYWdlID0gbmV3IEltYWdlKCk7XG5cbiAgICAgIF9pbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25sb2FkKTtcbiAgICAgIF9pbWFnZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuICAgICAgX2ltYWdlLnNyYyA9IGltYWdlLnNyYztcblxuICAgICAgcmV0dXJuIF9pbWFnZTtcbiAgICB9O1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudFtdfSBpbWFnZXNcbiAgICogQHBhcmFtIHt7ZmFpbGVkOiBmdW5jdGlvbiwgbG9hZGVkOiBmdW5jdGlvbn19IHN0YXR1c1xuICAgKi9cbiAgdmVyaWZ5IDogZnVuY3Rpb24oaW1hZ2VzLCBzdGF0dXMpIHtcbiAgICB2YXIgaW5jb21wbGV0ZSA9IHRoaXMuaW5jb21wbGV0ZUltYWdlcyhpbWFnZXMpO1xuXG4gICAgaWYgKGltYWdlcy5sZW5ndGggPiBpbmNvbXBsZXRlLmxlbmd0aCkge1xuICAgICAgc3RhdHVzLmxvYWRlZChpbWFnZXMubGVuZ3RoIC0gaW5jb21wbGV0ZS5sZW5ndGgpO1xuICAgIH1cblxuICAgIGlmIChpbmNvbXBsZXRlLmxlbmd0aCkge1xuICAgICAgaW5jb21wbGV0ZS5mb3JFYWNoKHRoaXMucHJveHlJbWFnZShcbiAgICAgICAgZnVuY3Rpb24oKXtcbiAgICAgICAgICBzdGF0dXMubG9hZGVkKDEpO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpe1xuICAgICAgICAgIHN0YXR1cy5mYWlsZWQoMSk7XG4gICAgICAgIH1cbiAgICAgICkpO1xuICAgIH1cbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR8RWxlbWVudHxFbGVtZW50W118alF1ZXJ5fE5vZGVMaXN0fSBvYmplY3RcbiAgICogQHJldHVybnMge0VsZW1lbnRbXX1cbiAgICovXG4gIHRvQXJyYXkgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb2JqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKG9iamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtvYmplY3RdO1xuICB9XG5cbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ganF1ZXJ5XG4gKiBAcmV0dXJucyBkZWZlcnJlZFxuICovXG5mdW5jdGlvbiBkZWZlcihqcXVlcnkpIHtcbiAgdmFyIGRlZmVycmVkO1xuXG4gIGlmIChqcXVlcnkpIHtcbiAgICBkZWZlcnJlZCA9IG5ldyAkLkRlZmVycmVkKCk7XG4gICAgZGVmZXJyZWQucHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2UoKTtcbiAgfVxuICBlbHNlIHtcbiAgICBkZWZlcnJlZCA9IHt9O1xuICAgIGRlZmVycmVkLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICBkZWZlcnJlZC5yZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZGVmZXJyZWQ7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gaW1hZ2VDb3VudFxuICogQHBhcmFtIHtmdW5jdGlvbn0gZG9uZVxuICogQHJldHVybnMge3tmYWlsZWQ6IGZ1bmN0aW9uLCBsb2FkZWQ6IGZ1bmN0aW9ufX1cbiAqL1xuZnVuY3Rpb24gc3RhdHVzKGltYWdlQ291bnQsIGRvbmUpIHtcbiAgdmFyIGxvYWRlZCA9IDAsXG4gICAgICB0b3RhbCA9IGltYWdlQ291bnQsXG4gICAgICB2ZXJpZmllZCA9IDA7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIGlmICh0b3RhbCA9PT0gdmVyaWZpZWQpIHtcbiAgICAgIGRvbmUodG90YWwgPT09IGxvYWRlZCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudFxuICAgICAqL1xuICAgIGZhaWxlZCA6IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICB2ZXJpZmllZCArPSBjb3VudDtcbiAgICAgIHVwZGF0ZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKi9cbiAgICBsb2FkZWQgOiBmdW5jdGlvbihjb3VudCkge1xuICAgICAgbG9hZGVkICs9IGNvdW50O1xuICAgICAgdmVyaWZpZWQgKz0gY291bnQ7XG4gICAgICB1cGRhdGUoKTtcbiAgICB9XG5cbiAgfTtcbn1cblxuXG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGpRdWVyeSBwbHVnaW5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5pZiAod2luZG93LmpRdWVyeSkge1xuICAkLmZuLmltYWdlc1JlYWR5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IEltYWdlc1JlYWR5KHRoaXMsIHRydWUpO1xuICAgIHJldHVybiBpbnN0YW5jZS5yZXN1bHQ7XG4gIH07XG59XG5cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgRGVmYXVsdCBlbnRyeSBwb2ludFxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIGltYWdlc1JlYWR5KGVsZW1lbnRzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIGluc3RhbmNlID0gbmV3IEltYWdlc1JlYWR5KGVsZW1lbnRzKTtcbiAgcmV0dXJuIGluc3RhbmNlLnJlc3VsdDtcbn1cblxucmV0dXJuIGltYWdlc1JlYWR5O1xufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaW1hZ2VzcmVhZHkvZGlzdC9pbWFnZXNyZWFkeS5qc1xuLy8gbW9kdWxlIGlkID0gNTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4qIFNlY3Rpb24gaGlnaGxpZ2h0ZXIgbW9kdWxlXG4qIEBtb2R1bGUgbW9kdWxlcy9zZWN0aW9uSGlnaGxpZ2h0ZXJcbiogQHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMjM5NTk4OC9oaWdobGlnaHQtbWVudS1pdGVtLXdoZW4tc2Nyb2xsaW5nLWRvd24tdG8tc2VjdGlvblxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciAkbmF2aWdhdGlvbkxpbmtzID0gJCgnLmpzLXNlY3Rpb24tc2V0ID4gbGkgPiBhJyk7XG4gIHZhciAkc2VjdGlvbnMgPSAkKFwic2VjdGlvblwiKTtcbiAgdmFyICRzZWN0aW9uc1JldmVyc2VkID0gJCgkKFwic2VjdGlvblwiKS5nZXQoKS5yZXZlcnNlKCkpO1xuICB2YXIgc2VjdGlvbklkVG9uYXZpZ2F0aW9uTGluayA9IHt9O1xuICAvL3ZhciBlVG9wID0gJCgnI2ZyZWUtZGF5LXRyaXBzJykub2Zmc2V0KCkudG9wO1xuXG4gICRzZWN0aW9ucy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIHNlY3Rpb25JZFRvbmF2aWdhdGlvbkxpbmtbJCh0aGlzKS5hdHRyKCdpZCcpXSA9ICQoJy5qcy1zZWN0aW9uLXNldCA+IGxpID4gYVtocmVmPVwiIycgKyAkKHRoaXMpLmF0dHIoJ2lkJykgKyAnXCJdJyk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIG9wdGltaXplZCgpIHtcbiAgICB2YXIgc2Nyb2xsUG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAkc2VjdGlvbnNSZXZlcnNlZC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGN1cnJlbnRTZWN0aW9uID0gJCh0aGlzKTtcbiAgICAgIHZhciBzZWN0aW9uVG9wID0gY3VycmVudFNlY3Rpb24ub2Zmc2V0KCkudG9wO1xuXG4gICAgICAvLyBpZihjdXJyZW50U2VjdGlvbi5pcygnc2VjdGlvbjpmaXJzdC1jaGlsZCcpICYmIHNlY3Rpb25Ub3AgPiBzY3JvbGxQb3NpdGlvbil7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCdzY3JvbGxQb3NpdGlvbicsIHNjcm9sbFBvc2l0aW9uKTtcbiAgICAgIC8vICAgY29uc29sZS5sb2coJ3NlY3Rpb25Ub3AnLCBzZWN0aW9uVG9wKTtcbiAgICAgIC8vIH1cblxuICAgICAgaWYgKHNjcm9sbFBvc2l0aW9uID49IHNlY3Rpb25Ub3AgfHwgKGN1cnJlbnRTZWN0aW9uLmlzKCdzZWN0aW9uOmZpcnN0LWNoaWxkJykgJiYgc2VjdGlvblRvcCA+IHNjcm9sbFBvc2l0aW9uKSkge1xuICAgICAgICB2YXIgaWQgPSBjdXJyZW50U2VjdGlvbi5hdHRyKCdpZCcpO1xuICAgICAgICB2YXIgJG5hdmlnYXRpb25MaW5rID0gc2VjdGlvbklkVG9uYXZpZ2F0aW9uTGlua1tpZF07XG4gICAgICAgIGlmICghJG5hdmlnYXRpb25MaW5rLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSB8fCAhJCgnc2VjdGlvbicpLmhhc0NsYXNzKCdvLWNvbnRlbnQtY29udGFpbmVyLS1jb21wYWN0JykpIHtcbiAgICAgICAgICAgICRuYXZpZ2F0aW9uTGlua3MucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJG5hdmlnYXRpb25MaW5rLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvcHRpbWl6ZWQoKTtcbiAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICBvcHRpbWl6ZWQoKTtcbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9zZWN0aW9uSGlnaGxpZ2h0ZXIuanMiLCIvKipcbiAqIFN0YXRpYyBjb2x1bW4gbW9kdWxlXG4gKiBTaW1pbGFyIHRvIHRoZSBnZW5lcmFsIHN0aWNreSBtb2R1bGUgYnV0IHVzZWQgc3BlY2lmaWNhbGx5IHdoZW4gb25lIGNvbHVtblxuICogb2YgYSB0d28tY29sdW1uIGxheW91dCBpcyBtZWFudCB0byBiZSBzdGlja3lcbiAqIEBtb2R1bGUgbW9kdWxlcy9zdGF0aWNDb2x1bW5cbiAqIEBzZWUgbW9kdWxlcy9zdGlja3lOYXZcbiAqL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBjb25zdCBzdGlja3lDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXN0YXRpYycpO1xuICBjb25zdCBub3RTdGlja3lDbGFzcyA9ICdpcy1ub3Qtc3RpY2t5JztcbiAgY29uc3QgYm90dG9tQ2xhc3MgPSAnaXMtYm90dG9tJztcblxuICAvKipcbiAgKiBDYWxjdWxhdGVzIHRoZSB3aW5kb3cgcG9zaXRpb24gYW5kIHNldHMgdGhlIGFwcHJvcHJpYXRlIGNsYXNzIG9uIHRoZSBlbGVtZW50XG4gICogQHBhcmFtIHtvYmplY3R9IHN0aWNreUNvbnRlbnRFbGVtIC0gRE9NIG5vZGUgdGhhdCBzaG91bGQgYmUgc3RpY2tpZWRcbiAgKi9cbiAgZnVuY3Rpb24gY2FsY1dpbmRvd1BvcyhzdGlja3lDb250ZW50RWxlbSkge1xuICAgIGxldCBlbGVtVG9wID0gc3RpY2t5Q29udGVudEVsZW0ucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgbGV0IGlzUGFzdEJvdHRvbSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHN0aWNreUNvbnRlbnRFbGVtLnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC0gc3RpY2t5Q29udGVudEVsZW0ucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPiAwO1xuXG4gICAgLy8gU2V0cyBlbGVtZW50IHRvIHBvc2l0aW9uIGFic29sdXRlIGlmIG5vdCBzY3JvbGxlZCB0byB5ZXQuXG4gICAgLy8gQWJzb2x1dGVseSBwb3NpdGlvbmluZyBvbmx5IHdoZW4gbmVjZXNzYXJ5IGFuZCBub3QgYnkgZGVmYXVsdCBwcmV2ZW50cyBmbGlja2VyaW5nXG4gICAgLy8gd2hlbiByZW1vdmluZyB0aGUgXCJpcy1ib3R0b21cIiBjbGFzcyBvbiBDaHJvbWVcbiAgICBpZiAoZWxlbVRvcCA+IDApIHtcbiAgICAgIHN0aWNreUNvbnRlbnRFbGVtLmNsYXNzTGlzdC5hZGQobm90U3RpY2t5Q2xhc3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGlja3lDb250ZW50RWxlbS5jbGFzc0xpc3QucmVtb3ZlKG5vdFN0aWNreUNsYXNzKTtcbiAgICB9XG4gICAgaWYgKGlzUGFzdEJvdHRvbSkge1xuICAgICAgc3RpY2t5Q29udGVudEVsZW0uY2xhc3NMaXN0LmFkZChib3R0b21DbGFzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0aWNreUNvbnRlbnRFbGVtLmNsYXNzTGlzdC5yZW1vdmUoYm90dG9tQ2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGlja3lDb250ZW50KSB7XG4gICAgZm9yRWFjaChzdGlja3lDb250ZW50LCBmdW5jdGlvbihzdGlja3lDb250ZW50RWxlbSkge1xuICAgICAgY2FsY1dpbmRvd1BvcyhzdGlja3lDb250ZW50RWxlbSk7XG5cbiAgICAgIC8qKlxuICAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yICdzY3JvbGwnLlxuICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgKi9cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY2FsY1dpbmRvd1BvcyhzdGlja3lDb250ZW50RWxlbSk7XG4gICAgICB9LCBmYWxzZSk7XG5cbiAgICAgIC8qKlxuICAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yICdyZXNpemUnLlxuICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgKi9cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY2FsY1dpbmRvd1BvcyhzdGlja3lDb250ZW50RWxlbSk7XG4gICAgICB9LCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3N0YXRpY0NvbHVtbi5qcyIsIi8qKlxuICogQWxlcnQgQmFubmVyIG1vZHVsZVxuICogQG1vZHVsZSBtb2R1bGVzL2FsZXJ0XG4gKiBAc2VlIG1vZHVsZXMvdG9nZ2xlT3BlblxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcbmltcG9ydCByZWFkQ29va2llIGZyb20gJy4vcmVhZENvb2tpZS5qcyc7XG5pbXBvcnQgZGF0YXNldCBmcm9tICcuL2RhdGFzZXQuanMnO1xuaW1wb3J0IGNyZWF0ZUNvb2tpZSBmcm9tICcuL2NyZWF0ZUNvb2tpZS5qcyc7XG5pbXBvcnQgZ2V0RG9tYWluIGZyb20gJy4vZ2V0RG9tYWluLmpzJztcblxuLyoqXG4gKiBEaXNwbGF5cyBhbiBhbGVydCBiYW5uZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gb3BlbkNsYXNzIC0gVGhlIGNsYXNzIHRvIHRvZ2dsZSBvbiBpZiBiYW5uZXIgaXMgdmlzaWJsZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcGVuQ2xhc3MpIHtcbiAgaWYgKCFvcGVuQ2xhc3MpIHtcbiAgICBvcGVuQ2xhc3MgPSAnaXMtb3Blbic7XG4gIH1cblxuICAvKipcbiAgKiBNYWtlIGFuIGFsZXJ0IHZpc2libGVcbiAgKiBAcGFyYW0ge29iamVjdH0gYWxlcnQgLSBET00gbm9kZSBvZiB0aGUgYWxlcnQgdG8gZGlzcGxheVxuICAqIEBwYXJhbSB7b2JqZWN0fSBzaWJsaW5nRWxlbSAtIERPTSBub2RlIG9mIGFsZXJ0J3MgY2xvc2VzdCBzaWJsaW5nLFxuICAqIHdoaWNoIGdldHMgc29tZSBleHRyYSBwYWRkaW5nIHRvIG1ha2Ugcm9vbSBmb3IgdGhlIGFsZXJ0XG4gICovXG4gIGZ1bmN0aW9uIGRpc3BsYXlBbGVydChhbGVydCwgc2libGluZ0VsZW0pIHtcbiAgICBhbGVydC5jbGFzc0xpc3QuYWRkKG9wZW5DbGFzcyk7XG4gICAgY29uc3QgYWxlcnRIZWlnaHQgPSBhbGVydC5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3QgY3VycmVudFBhZGRpbmcgPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShzaWJsaW5nRWxlbSkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1ib3R0b20nKSwgMTApO1xuICAgIHNpYmxpbmdFbGVtLnN0eWxlLnBhZGRpbmdCb3R0b20gPSAoYWxlcnRIZWlnaHQgKyBjdXJyZW50UGFkZGluZykgKyAncHgnO1xuICB9XG5cbiAgLyoqXG4gICogUmVtb3ZlIGV4dHJhIHBhZGRpbmcgZnJvbSBhbGVydCBzaWJsaW5nXG4gICogQHBhcmFtIHtvYmplY3R9IHNpYmxpbmdFbGVtIC0gRE9NIG5vZGUgb2YgYWxlcnQgc2libGluZ1xuICAqL1xuICBmdW5jdGlvbiByZW1vdmVBbGVydFBhZGRpbmcoc2libGluZ0VsZW0pIHtcbiAgICBzaWJsaW5nRWxlbS5zdHlsZS5wYWRkaW5nQm90dG9tID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAqIENoZWNrIGFsZXJ0IGNvb2tpZVxuICAqIEBwYXJhbSB7b2JqZWN0fSBhbGVydCAtIERPTSBub2RlIG9mIHRoZSBhbGVydFxuICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciBhbGVydCBjb29raWUgaXMgc2V0XG4gICovXG4gIGZ1bmN0aW9uIGNoZWNrQWxlcnRDb29raWUoYWxlcnQpIHtcbiAgICBjb25zdCBjb29raWVOYW1lID0gZGF0YXNldChhbGVydCwgJ2Nvb2tpZScpO1xuICAgIGlmICghY29va2llTmFtZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIHJlYWRDb29raWUoY29va2llTmFtZSwgZG9jdW1lbnQuY29va2llKSAhPT0gJ3VuZGVmaW5lZCc7XG4gIH1cblxuICAvKipcbiAgKiBBZGQgYWxlcnQgY29va2llXG4gICogQHBhcmFtIHtvYmplY3R9IGFsZXJ0IC0gRE9NIG5vZGUgb2YgdGhlIGFsZXJ0XG4gICovXG4gIGZ1bmN0aW9uIGFkZEFsZXJ0Q29va2llKGFsZXJ0KSB7XG4gICAgY29uc3QgY29va2llTmFtZSA9IGRhdGFzZXQoYWxlcnQsICdjb29raWUnKTtcbiAgICBpZiAoY29va2llTmFtZSkge1xuICAgICAgY3JlYXRlQ29va2llKGNvb2tpZU5hbWUsICdkaXNtaXNzZWQnLCBnZXREb21haW4od2luZG93LmxvY2F0aW9uLCBmYWxzZSksIDM2MCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYWxlcnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWFsZXJ0Jyk7XG4gIGlmIChhbGVydHMubGVuZ3RoKSB7XG4gICAgZm9yRWFjaChhbGVydHMsIGZ1bmN0aW9uKGFsZXJ0KSB7XG4gICAgICBpZiAoIWNoZWNrQWxlcnRDb29raWUoYWxlcnQpKSB7XG4gICAgICAgIGNvbnN0IGFsZXJ0U2libGluZyA9IGFsZXJ0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGRpc3BsYXlBbGVydChhbGVydCwgYWxlcnRTaWJsaW5nKTtcblxuICAgICAgICAvKipcbiAgICAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yICdjaGFuZ2VPcGVuU3RhdGUnLlxuICAgICAgICAqIFRoZSB2YWx1ZSBvZiBldmVudC5kZXRhaWwgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIG9wZW4gc3RhdGUgaXMgdHJ1ZVxuICAgICAgICAqIChpLmUuIHRoZSBhbGVydCBpcyB2aXNpYmxlKS5cbiAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAgICovXG4gICAgICAgIGFsZXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZU9wZW5TdGF0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgLy8gQmVjYXVzZSBpT1Mgc2FmYXJpIGluZXhwbGljYWJseSB0dXJucyBldmVudC5kZXRhaWwgaW50byBhbiBvYmplY3RcbiAgICAgICAgICBpZiAoKHR5cGVvZiBldmVudC5kZXRhaWwgPT09ICdib29sZWFuJyAmJiAhZXZlbnQuZGV0YWlsKSB8fFxuICAgICAgICAgICAgKHR5cGVvZiBldmVudC5kZXRhaWwgPT09ICdvYmplY3QnICYmICFldmVudC5kZXRhaWwuZGV0YWlsKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYWRkQWxlcnRDb29raWUoYWxlcnQpO1xuICAgICAgICAgICAgcmVtb3ZlQWxlcnRQYWRkaW5nKGFsZXJ0U2libGluZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvYWxlcnQuanMiLCIvKipcbiogUmVhZHMgYSBjb29raWUgYW5kIHJldHVybnMgdGhlIHZhbHVlXG4qIEBwYXJhbSB7c3RyaW5nfSBjb29raWVOYW1lIC0gTmFtZSBvZiB0aGUgY29va2llXG4qIEBwYXJhbSB7c3RyaW5nfSBjb29raWUgLSBGdWxsIGxpc3Qgb2YgY29va2llc1xuKiBAcmV0dXJuIHtzdHJpbmd9IC0gVmFsdWUgb2YgY29va2llOyB1bmRlZmluZWQgaWYgY29va2llIGRvZXMgbm90IGV4aXN0XG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29va2llTmFtZSwgY29va2llKSB7XG4gIHJldHVybiAoUmVnRXhwKFwiKD86Xnw7IClcIiArIGNvb2tpZU5hbWUgKyBcIj0oW147XSopXCIpLmV4ZWMoY29va2llKSB8fCBbXSkucG9wKCk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9yZWFkQ29va2llLmpzIiwiLyoqXG4qIFNhdmUgYSBjb29raWVcbiogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBDb29raWUgbmFtZVxuKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBDb29raWUgdmFsdWVcbiogQHBhcmFtIHtzdHJpbmd9IGRvbWFpbiAtIERvbWFpbiBvbiB3aGljaCB0byBzZXQgY29va2llXG4qIEBwYXJhbSB7aW50ZWdlcn0gZGF5cyAtIE51bWJlciBvZiBkYXlzIGJlZm9yZSBjb29raWUgZXhwaXJlc1xuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBkb21haW4sIGRheXMpIHtcbiAgY29uc3QgZXhwaXJlcyA9IGRheXMgPyBcIjsgZXhwaXJlcz1cIiArIChuZXcgRGF0ZShkYXlzICogODY0RTUgKyAobmV3IERhdGUoKSkuZ2V0VGltZSgpKSkudG9HTVRTdHJpbmcoKSA6IFwiXCI7XG4gIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIHZhbHVlICsgZXhwaXJlcyArIFwiOyBwYXRoPS87IGRvbWFpbj1cIiArIGRvbWFpbjtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2NyZWF0ZUNvb2tpZS5qcyIsIi8qKlxuKiBHZXQgdGhlIGRvbWFpbiBmcm9tIGEgVVJMXG4qIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgVVJMXG4qIEBwYXJhbSB7Ym9vbGVhbn0gcm9vdCAtIFdoZXRoZXIgdG8gcmV0dXJuIHRoZSByb290IGRvbWFpbiByYXRoZXIgdGhhbiBhIHN1YmRvbWFpblxuKiBAcmV0dXJuIHtzdHJpbmd9IC0gVGhlIHBhcnNlZCBkb21haW5cbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih1cmwsIHJvb3QpIHtcbiAgZnVuY3Rpb24gcGFyc2VVcmwodXJsKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIHRhcmdldC5ocmVmID0gdXJsO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICBpZiAodHlwZW9mIHVybCA9PT0gJ3N0cmluZycpIHtcbiAgICB1cmwgPSBwYXJzZVVybCh1cmwpO1xuICB9XG4gIGxldCBkb21haW4gPSB1cmwuaG9zdG5hbWU7XG4gIGlmIChyb290KSB7XG4gICAgY29uc3Qgc2xpY2UgPSBkb21haW4ubWF0Y2goL1xcLnVrJC8pID8gLTMgOiAtMjtcbiAgICBkb21haW4gPSBkb21haW4uc3BsaXQoXCIuXCIpLnNsaWNlKHNsaWNlKS5qb2luKFwiLlwiKTtcbiAgfVxuICByZXR1cm4gZG9tYWluO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvZ2V0RG9tYWluLmpzIiwiLyoqXG4qIFZhbGlkYXRlIGEgZm9ybSBhbmQgc3VibWl0IHZpYSB0aGUgc2lnbnVwIEFQSVxuKi9cbnJlcXVpcmUoJy4uL3ZlbmRvci9ic2Qtc2lnbnVwLWpzYXBpLXNpbXBsZS1kZXYuanMnKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0ICRzaWdudXBGb3JtcyA9ICQoJy5ic2R0b29scy1zaWdudXAnKTtcbiAgY29uc3QgZXJyb3JNc2cgPSAnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYW5kIHppcCBjb2RlIGFuZCBzZWxlY3QgYXQgbGVhc3Qgb25lIGFnZSBncm91cC4nO1xuXG4gIC8qKlxuICAqIFZhbGlkYXRlIGZvcm0gYmVmb3JlIHVucGF1c2luZ1xuICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIGpRdWVyeSBldmVudCBvYmplY3RcbiAgKiBAcGFyYW0ge29iamVjdH0gZm9ybURhdGEgLSBTZXJpYWxpemVkIGZvcm0gZGF0YVxuICAqL1xuICBmdW5jdGlvbiBoYW5kbGVWYWxpZGF0aW9uKGV2ZW50LCBmb3JtRGF0YSkge1xuICAgIGxldCBub0Vycm9ycyA9IHRydWU7XG4gICAgY29uc3QgJGZvcm0gPSAkKHRoaXMpO1xuICAgICRmb3JtLmZpbmQoJy5pcy1lcnJvcicpLnJlbW92ZUNsYXNzKCdpcy1lcnJvcicpO1xuICAgICRmb3JtLmZpbmQoJy5ic2R0b29scy1lcnJvcicpLmh0bWwoJycpO1xuICAgIGNvbnN0ICRyZXF1aXJlZEZpZWxkcyA9ICRmb3JtLmZpbmQoJ1tyZXF1aXJlZF0nKTtcblxuICAgIC8qKlxuICAgICogVmFsaWRhdGUgZWFjaCBmaWVsZC4gUmVxdWlyZWQgZmllbGRzIG11c3QgYmUgbm9uLWVtcHR5IGFuZCBjb250YWluIHRoZVxuICAgICogcmlnaHQgdHlwZSBvZiBkYXRhLlxuICAgICogQGZ1bmN0aW9uXG4gICAgKi9cbiAgICAkcmVxdWlyZWRGaWVsZHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGZpZWxkTmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgaWYgKHR5cGVvZiBmb3JtRGF0YVtmaWVsZE5hbWVdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBub0Vycm9ycyA9IGZhbHNlO1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdpcy1lcnJvcicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZmllbGRUeXBlID0gJCh0aGlzKS5hdHRyKCd0eXBlJyk7XG4gICAgICAgIGNvbnN0IGVtcmVnZXggPSBuZXcgUmVnRXhwKFwiXlthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/Oi5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiRcIiwgXCJpXCIpO1xuICAgICAgICBjb25zdCB1c3JlZ2V4ID0gbmV3IFJlZ0V4cCgvXlxcZHs1fSgtXFxkezR9KT8kL2kpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKGZpZWxkVHlwZSA9PT0gJ3RleHQnICYmIGZvcm1EYXRhW2ZpZWxkTmFtZV0udHJpbSgpID09PSAnJykgfHxcbiAgICAgICAgICAoZmllbGRUeXBlID09PSAnZW1haWwnICYmICFlbXJlZ2V4LnRlc3QoZm9ybURhdGFbZmllbGROYW1lXSkpIHx8XG4gICAgICAgICAgKGZpZWxkTmFtZSA9PT0gJ3ppcCcgJiYgIXVzcmVnZXgudGVzdChmb3JtRGF0YVtmaWVsZE5hbWVdKSkgfHxcbiAgICAgICAgICAoZmllbGRUeXBlID09PSAnY2hlY2tib3gnICYmICFmb3JtRGF0YVtmaWVsZE5hbWVdLmxlbmd0aClcbiAgICAgICAgKSB7XG4gICAgICAgICAgbm9FcnJvcnMgPSBmYWxzZTtcbiAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdpcy1lcnJvcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKG5vRXJyb3JzKSB7XG4gICAgICAvLyBUb29scyBleHBlY3RzIGEgaGlkZGVuIGZpZWxkIGZvciBfYWxsXyBjaGVja2JveGVzLCBub3QganVzdCBjaGVja2VkIG9uZXNcbiAgICAgICRmb3JtLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IGNoZWNrYm94VmFsdWUgPSAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSA/ICQodGhpcykuYXR0cigndmFsdWUnKSA6ICcnO1xuICAgICAgICBsZXQgY2hlY2tib3hOYW1lID0gJCh0aGlzKS5hdHRyKCduYW1lJyk7XG4gICAgICAgIGNoZWNrYm94TmFtZSA9IGNoZWNrYm94TmFtZS5zdWJzdHJpbmcoMiwgY2hlY2tib3hOYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgICAkZm9ybS5hcHBlbmQoYDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIiR7Y2hlY2tib3hOYW1lfVske2luZGV4fV1cIiB2YWx1ZT1cIiR7Y2hlY2tib3hWYWx1ZX1cIj5gKTtcbiAgICAgIH0pO1xuICAgICAgJGZvcm0uZGF0YSgnaXNQYXVzZWQnLCBmYWxzZSk7XG4gICAgICAkZm9ybS50cmlnZ2VyKCdzdWJtaXQuYnNkc2lnbnVwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRmb3JtLmZpbmQoJy5ic2R0b29scy1lcnJvcicpLmh0bWwoYDxwPiR7ZXJyb3JNc2d9PC9wPmApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIEhhbmRsZSBlcnJvcnMgcmV0dXJuZWQgYnkgdGhlIEJTRCBUb29scyBBUElcbiAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBqUXVlcnkgZXZlbnQgb2JqZWN0XG4gICogQHBhcmFtIHtvYmplY3R9IGVycm9ySlNPTiAtIE9yaWdpbmFsIHJlc3BvbnNlIGZyb20gdGhlIFRvb2xzLCB3aXRoIGEgY2FjaGVkXG4gICogalF1ZXJ5IHJlZmVyZW5jZSB0byB0aGUgZm9ybSBmaWVsZFxuICAqL1xuICBmdW5jdGlvbiBoYW5kbGVFcnJvcnMoZXZlbnQsIGVycm9ySlNPTikge1xuICAgIGNvbnN0ICRmb3JtID0gJCh0aGlzKTtcbiAgICBpZiAoZXJyb3JKU09OICYmIGVycm9ySlNPTi5maWVsZF9lcnJvcnMpIHtcbiAgICAgIC8qKlxuICAgICAgKiBBZGQgZXJyb3Igc3R5bGluZyB0byB0aGUgZmllbGQgd2l0aCBhbiBlcnJvclxuICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBpbmRleCAtIEN1cnJlbnQgcG9zaXRpb24gaW4gdGhlIHNldCBvZiBlcnJvcnNcbiAgICAgICogQHBhcmFtIHtvYmplY3R9IGVycm9yIC0gRXJyb3Igb2JqZWN0XG4gICAgICAqL1xuICAgICAgJC5lYWNoKGVycm9ySlNPTi5maWVsZF9lcnJvcnMsIGZ1bmN0aW9uKGluZGV4LCBlcnJvcikge1xuICAgICAgICBlcnJvci4kZmllbGQuYWRkQ2xhc3MoJ2lzLWVycm9yJyk7XG4gICAgICAgICRmb3JtLmZpbmQoJy5ic2R0b29scy1lcnJvcicpLmh0bWwoYDxwPiR7ZXJyb3IubWVzc2FnZX08L3A+YCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGZvcm0uZmluZCgnLmJzZHRvb2xzLWVycm9yJykuaHRtbCgnPHA+WW91ciBzaWdudXAgY291bGQgbm90IGJlIGNvbXBsZXRlZC48L3A+Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogSGFuZGxlIHN1Y2Nlc3MgcmVzcG9uc2UgZnJvbSB0aGUgQlNEIFRvb2xzIEFQSVxuICAqL1xuICBmdW5jdGlvbiBoYW5kbGVTdWNjZXNzKCkge1xuICAgICQodGhpcykuaHRtbCgnPHAgY2xhc3M9XCJjLXNpZ251cC1mb3JtX19zdWNjZXNzXCI+T25lIG1vcmUgc3RlcCEgPGJyIC8+IFBsZWFzZSBjaGVjayB5b3VyIGluYm94IGFuZCBjb25maXJtIHlvdXIgZW1haWwgYWRkcmVzcyB0byBzdGFydCByZWNlaXZpbmcgdXBkYXRlcy4gPGJyIC8+VGhhbmtzIGZvciBzaWduaW5nIHVwITwvcD4nKTtcbiAgfVxuXG4gIGlmICgkc2lnbnVwRm9ybXMubGVuZ3RoKSB7XG4gICAgLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG4gICAgJHNpZ251cEZvcm1zLmJzZFNpZ251cCh7XG4gICAgICBub19yZWRpcmVjdDogdHJ1ZSxcbiAgICAgIHN0YXJ0UGF1c2VkOiB0cnVlXG4gICAgfSlcbiAgICAub24oJ2JzZC1pc3BhdXNlZCcsICQucHJveHkoaGFuZGxlVmFsaWRhdGlvbiwgdGhpcykpXG4gICAgLm9uKCdic2QtZXJyb3InLCAkLnByb3h5KGhhbmRsZUVycm9ycywgdGhpcykpXG4gICAgLm9uKCdic2Qtc3VjY2VzcycsICQucHJveHkoaGFuZGxlU3VjY2VzcywgdGhpcykpO1xuICAgIC8qIGVzbGludC1lbmFibGUgY2FtZWxjYXNlICovXG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2JzZHRvb2xzLXNpZ251cC5qcyIsIi8qbGV0cyBkZWZpbmUgb3VyIHNjb3BlKi9cbihmdW5jdGlvbigkLCB3bG9jYXRpb24sIHVuZGVmaW5lZCl7XG5cbiAgIC8vbGV0J3MgbWFrZSBpdCBlYXN5IHRvIGpRdWVyeSdzIGZvcm0gYXJyYXkgaW50byBhIGRhdGEgb2JqZWN0XG4gICAkLmZuLnNlcmlhbGl6ZU9iamVjdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBvID0ge30sXG4gICAgICAgICAgICBhID0gdGhpcy5zZXJpYWxpemVBcnJheSgpO1xuICAgICAgICAkLmVhY2goYSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAob1t0aGlzLm5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9bdGhpcy5uYW1lXS5wdXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIG9bdGhpcy5uYW1lXSA9IFtvW3RoaXMubmFtZV1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvW3RoaXMubmFtZV0ucHVzaCh0aGlzLnZhbHVlIHx8ICcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb1t0aGlzLm5hbWVdID0gdGhpcy52YWx1ZSB8fCAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvO1xuICAgIH07XG5cbiAgICB2YXIgaW50ZXJhY3RpdmVWYWxpZGl0eSA9ICdyZXBvcnRWYWxpZGl0eScgaW4gJCgnPGZvcm0vPicpLmdldCgpWzBdLC8vY2hlY2sgd2hldGhlciB0aGUgYnJvd3NlciBzdXBwb3J0cyBpbnRlcmFjdGl2ZSB2YWxpZGF0aW9uIG1lc3NhZ2VzXG4gICAgICAgIHBsdWdpbm5hbWUgPSAnYnNkU2lnbnVwJywvL3RoZSBwbHVnaW4gd2UgcGxhbiB0byBjcmVhdGVcbiAgICAgICAgZ3VwID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgdmFyIGd1cHJlZ2V4ID0gbmV3IFJlZ0V4cChcIltcXFxcPyZdXCIrbmFtZS5yZXBsYWNlKC8oXFxbfFxcXSkvZyxcIlxcXFwkMVwiKStcIj0oW14mI10qKVwiKSxcbiAgICAgICAgICAgICAgICByZXN1bHRzID0gZ3VwcmVnZXguZXhlYyggd2xvY2F0aW9uLmhyZWYgKTtcbiAgICAgICAgICAgIHJldHVybiAoIHJlc3VsdHMgPT09IG51bGwgKT9cIlwiOnJlc3VsdHNbMV07XG4gICAgICAgIH0sLy9hbGxvdyB1cyB0byBnZXQgdXJsIHBhcmFtZXRlcnNcbiAgICAgICAgc291cmNlU3RyaW5nID0gJ3NvdXJjZScsXG4gICAgICAgIHN1YnNvdXJjZVN0cmluZyA9ICdzdWJzb3VyY2UnLFxuICAgICAgICB1cmxzb3VyY2UgPSBndXAoc291cmNlU3RyaW5nKXx8Z3VwKCdmYl9yZWYnKSwvL2FueSBzb3VyY2Ugd2UgY2FuIGdldCBmcm9tIHRoZSB1cmxcbiAgICAgICAgdXJsc3Vic291cmNlID0gZ3VwKHN1YnNvdXJjZVN0cmluZyk7Ly9hbnkgc3Vic291cmNlIHdlIGNhbiBnZXQgZnJvbSB0aGUgdXJsXG5cbiAgICBmdW5jdGlvbiBwYXJzZVVSTCh1cmwpe1xuICAgICAgICB2YXIgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTsvL2NyZWF0ZSBhIHNwZWNpYWwgRE9NIG5vZGUgZm9yIHRlc3RpbmdcbiAgICAgICAgcC5ocmVmPXVybDsvL3N0aWNrIGEgbGluayBpbnRvIGl0XG4gICAgICAgIC8vcC5wYXRobmFtZSA9IHAucGF0aG5hbWUucmVwbGFjZSgvKF5cXC8/KS8sXCIvXCIpOy8vSUUgZml4XG4gICAgICAgIHJldHVybiBwOy8vcmV0dXJuIHRoZSBET00gbm9kZSdzIG5hdGl2ZSBjb25jZXB0IG9mIGl0c2VsZiwgd2hpY2ggd2lsbCBleHBhbmQgYW55IHJlbGF0aXZlIGxpbmtzIGludG8gcmVhbCBvbmVzXG4gICAgfVxuXG4gICAgLy8gaWRlYWxseSB0aGUgYXBpIHJldHVybnMgaW5mb3JtYXRpdmUgZXJyb3JzLCBidXQgaW4gdGhlIGNhc2Ugb2YgZmFpbHVyZXMsIGxldCdzIHRyeSB0byBwYXJzZSB0aGUgZXJyb3IganNvbiwgaWYgYW55LCBhbmQgdGhlbiBtYWtlIHN1cmUgd2UgaGF2ZSBhIHN0YW5kYXJkIHJlc3BvbnNlIGlmIGFsbCBlbHNlIGZhaWxzXG4gICAgZnVuY3Rpb24gZXJyb3JGaWx0ZXIoZSl7XG4gICAgICAgIHZhciBtc2cgPSAnTm8gcmVzcG9uc2UgZnJvbSBzZXZlcic7XG4gICAgICAgIGlmKGUgJiYgZS5yZXNwb25zZUpTT04pe1xuICAgICAgICAgICAgcmV0dXJuIGUucmVzcG9uc2VKU09OO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQucGFyc2VKU09OKGUucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1czonZmFpbCcsY29kZTo1MDMsIG1lc3NhZ2U6IG1zZywgZXJyb3I6bXNnIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdWNjZXNzRmlsdGVyKHJlc3BvbnNlKXtcbiAgICAgICAgcmV0dXJuICghcmVzcG9uc2UgfHwgcmVzcG9uc2Uuc3RhdHVzIT09XCJzdWNjZXNzXCIpID9cbiAgICAgICAgICAgICQuRGVmZXJyZWQoKS5yZWplY3RXaXRoKHRoaXMsIFtyZXNwb25zZV0pIDpcbiAgICAgICAgICAgIHJlc3BvbnNlO1xuICAgIH1cblxuICAgIC8vIGFsbG93IGFueSBjaGFuZ2VzIHRvIGEgZmllbGQgdGhhdCB3YXMgaW52YWxpZCB0byBjbGVhciB0aGF0IGN1c3RvbSBFcnJvciB2YWx1ZVxuICAgIGZ1bmN0aW9uIHJlY2hlY2tJZlRoaXNJc1N0aWxsSW52YWxpZCgkZmllbGQsIGZpZWxkLCBiYWRpbnB1dCl7XG4gICAgICAgICRmaWVsZC5vbmUoJ2NoYW5nZSBrZXl1cCcsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKCRmaWVsZC52YWwoKSE9PWJhZGlucHV0KXtcbiAgICAgICAgICAgICAgICBmaWVsZC5zZXRDdXN0b21WYWxpZGl0eSgnJyk7Ly93ZSd2ZSBub3cgY2xlYXJlZCB0aGUgY3VzdG9tIGVycm9yXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1TdWNjZXNzKHJlc3VsdCl7XG4gICAgICAgIC8vXCJ0aGlzXCIgaXMgdGhlIGpxdWVyeSB3cmFwcGVkICRmb3JtXG4gICAgICAgIHRoaXMudHJpZ2dlcignYnNkLXN1Y2Nlc3MnLFtyZXN1bHRdKTtcbiAgICAgICAgaWYodGhpcy5kYXRhKCdic2RzaWdudXAnKS5ub19yZWRpcmVjdCE9PXRydWUgJiYgcmVzdWx0LnRoYW5rc191cmwpe1xuICAgICAgICAgICAgd2xvY2F0aW9uLmhyZWYgPSByZXN1bHQudGhhbmtzX3VybDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1GYWlsdXJlKGUpe1xuICAgICAgICAvL1widGhpc1wiIGlzIHRoZSBqcXVlcnkgd3JhcHBlZCAkZm9ybVxuICAgICAgICB2YXIgJGZvcm0gPSB0aGlzLFxuICAgICAgICAgICAgZnVuZXJyb3IgPSBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZyA9IHRoaXMuZGF0YSgnYnNkc2lnbnVwJyksXG4gICAgICAgICAgICBlcnJvcnNBc09iamVjdCA9IHt9O1xuICAgICAgICBpZihlICYmIGUuZmllbGRfZXJyb3JzICYmIGUuZmllbGRfZXJyb3JzLmxlbmd0aCl7XG4gICAgICAgICAgICAkLmVhY2goZS5maWVsZF9lcnJvcnMsZnVuY3Rpb24oaSxlcnIpe1xuICAgICAgICAgICAgICAgIHZhciAkZXJyRmllbGQgPSAkZm9ybS5maW5kKCdbbmFtZT1cIicrZXJyLmZpZWxkKydcIl0nKSxcbiAgICAgICAgICAgICAgICAgICAgZXJyRmllbGQgPSAkZXJyRmllbGQuZ2V0KClbMF07XG4gICAgICAgICAgICAgICAgaWYoZXJyLmZpZWxkPT09XCJzdWJtaXQtYnRuXCIpe1xuICAgICAgICAgICAgICAgICAgICBlLm1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihlcnJGaWVsZCAmJiBlcnJGaWVsZC5zZXRDdXN0b21WYWxpZGl0eSAmJiBpbnRlcmFjdGl2ZVZhbGlkaXR5ICYmICEkZm9ybVswXS5ub1ZhbGlkYXRlICYmICFjb25maWcubm9faHRtbDV2YWxpZGF0ZSl7XG4gICAgICAgICAgICAgICAgICAgIGVyckZpZWxkLnNldEN1c3RvbVZhbGlkaXR5KGVyci5tZXNzYWdlKTsvL3RoaXMgc2V0cyBhbiBhZGRpdGlvbmFsIGNvbnN0cmFpbnQgYmV5b25kIHdoYXQgdGhlIGJyb3dzZXIgdmFsaWRhdGVkXG4gICAgICAgICAgICAgICAgICAgIHJlY2hlY2tJZlRoaXNJc1N0aWxsSW52YWxpZCgkZXJyRmllbGQsZXJyRmllbGQsZXJyLm1lc3NhZ2UpOy8vYW5kIHNpbmNlIHdlIGRvbid0IGtub3cgd2hhdCBpdCBpcywgd2UgYXQgbGVhc3QgY2hlY2sgdG8gbWFrZSBzdXJlIGl0J3Mgbm8gbG9uZ2VyIHdoYXQgdGhlIHNlcnZlciBoYXMgYWxyZWFkeSByZWplY3RlZFxuICAgICAgICAgICAgICAgICAgICBmdW5lcnJvcj0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXJyLiRmaWVsZCA9ICRlcnJGaWVsZDtcbiAgICAgICAgICAgICAgICBlcnJvcnNBc09iamVjdFtlcnIuZmllbGRdID0gZXJyLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgJGVyckZpZWxkLnRyaWdnZXIoJ2ludmFsaWQnLCBlcnIubWVzc2FnZSk7Ly9hbmQgbm93IGxldCdzIHRyaWdnZXIgYSByZWFsIGV2ZW50IHRoYXQgc29tZW9uZSBjYW4gdXNlIHRvIHBvcHVsYXRyZSBlcnJvciBjbGFzc2VzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmKGZ1bmVycm9yICYmIGludGVyYWN0aXZlVmFsaWRpdHkpe1xuICAgICAgICAgICAgICAgIC8vZm9yIHRoaXMgdG8gd29yaywgdHJpZ2dlcmluZyB0aGUgbmF0aXZlIHZhbGlkYXRpb24sIHdlJ2QgbmVlZCB0byBoaXQgdGhlIHN1Ym1pdCBidXR0b24sIG5vdCBqdXN0IGRvIGEgJGZvcm0uc3VibWl0KClcbiAgICAgICAgICAgICAgICAkZm9ybS5maW5kKCdbdHlwZT1cInN1Ym1pdFwiXSxbdHlwZT1cImltYWdlXCJdJykuZXEoMCkuY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAkZm9ybS50cmlnZ2VyKCdic2QtZXJyb3InLFtlLCBlcnJvcnNBc09iamVjdF0pO1xuICAgIH1cblxuICAgIC8vY3JlYXRlIGEgcmVwbGFjZW1lbnQgZm9yIGFjdHVhbGx5IHN1Ym1pdHRpbmcgdGhlIGZvcm0gZGlyZWN0bHlcbiAgICBmdW5jdGlvbiBqc2FwaVN1Ym1pdCgkZm9ybSwgYWN0aW9uLCBvcHMpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAvL3dlJ3JlIGdvaW5nIHRvIHVzZSBqUXVlcnkncyBhamF4IHRvIGFjdHVhbGx5IGNoZWNrIGlmIGEgcmVxdWVzdCBpcyBjcm9zc0RvbWFpbiBvciBub3QsIHJhdGhlciB0aGFuIHVzaW5nIG91ciBvd24gdGVzdC4gVGhlbiBpZiBpdCBpcywgYW5kIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCB0aGF0LCB3ZSdsbCBqdXN0IGNhbmNlbCB0aGUgcmVxdWVzdCBhbmQgbGV0IHRoZSBmb3JtIHN1Ym1pdCBub3JtYWxseVxuICAgICAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5zZXJpYWxpemVPYmplY3QoKTtcbiAgICAgICAgICAgIGlmKCRmb3JtLmRhdGEoJ2lzUGF1c2VkJykhPT10cnVlKXsvL2FsbG93IGEgbWVhbnMgdG8gcHJldmVudCBzdWJtaXNzaW9uIGVudGlyZWx5XG4gICAgICAgICAgICAgICAgJGZvcm0uZGF0YSgnaXNQYXVzZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB2YXIgYXBpYWN0aW9uID0gYWN0aW9uLnJlcGxhY2UoL1xcL3BhZ2VcXC8oc2lnbnVwfHMpLywnL3BhZ2Uvc2FwaScpLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0ID0gJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYXBpYWN0aW9uLC8vd2hlcmUgdG8gcG9zdCB0aGUgZm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLC8vbm8ganNvbnBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IG9wcy50aW1lb3V0fHwzZTQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAkZm9ybSwvL3NldCB0aGUgdmFsdWUgb2YgXCJ0aGlzXCIgZm9yIGFsbCBkZWZlcnJlZCBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbihqcXhociwgcmVxdWVzdHNldHRpbmdzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BzLnByb3h5YWxsIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RzZXR0aW5ncy5jcm9zc0RvbWFpbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgISQuc3VwcG9ydC5jb3JzICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKCQub2xkaWV4ZHIgJiYgcGFyc2VVUkwocmVxdWVzdHNldHRpbmdzLnVybCkucHJvdG9jb2w9PT13bG9jYXRpb24ucHJvdG9jb2wpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihvcHMub2xkcHJveHl8fG9wcy5wcm94eWFsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0c2V0dGluZ3MudXJsID0gb3BzLm9sZHByb3h5fHxvcHMucHJveHlhbGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0c2V0dGluZ3MuY3Jvc3NEb21haW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RzZXR0aW5ncy5kYXRhICs9ICcmcHVybD0nK2FwaWFjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7Ly9yZXF1ZXN0IGlzIGNvcnMgYnV0IHRoZSBicm93c2VyIGNhbid0IGhhbmRsZSB0aGF0LCBzbyBsZXQgdGhlIG5vcm1hbCBmb3JtIGJlaGF2aW9yIHByb2NlZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7Ly9jYW5jZWwgdGhlIG5hdGl2ZSBmb3JtIHN1Ym1pdCBiZWhhdmlvclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vb25seSBhZGQgdGhlIGhhbmRsZXJzIGlmIHRoZSByZXF1ZXN0IGFjdHVhbGx5IGhhcHBlbmVkXG4gICAgICAgICAgICAgICAgaWYocmVxdWVzdC5zdGF0dXNUZXh0IT09XCJjYW5jZWxlZFwiKXtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcignYnNkLXN1Ym1pdCcsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihzdWNjZXNzRmlsdGVyLCBlcnJvckZpbHRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5kYXRhKCdpc1BhdXNlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9uZShmb3JtU3VjY2VzcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mYWlsKGZvcm1GYWlsdXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7Ly9jYW5jZWwgdGhlIG5hdGl2ZSBmb3JtIHN1Ym1pdCBiZWhhdmlvclxuICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoJ2JzZC1pc3BhdXNlZCcsIGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vaGFuZGxlIG1ha2luZyBzdXJlIHNvdXJjZXMgaW4gdGhlIHVybCBlbmQgdXAgaW4gdGhlIGZvcm0sIGxpa2UgaW4gYSBuYXRpdmUgdG9vbHMgc2lnbnVwIGZvcm1cbiAgICBmdW5jdGlvbiBub3JtYWxpemVTb3VyY2VGaWVsZCgkZm9ybSwgbmFtZSwgZXh0ZXJuYWwpe1xuICAgICAgICB2YXIgJGZpZWxkID0gJGZvcm0uZmluZCgnW25hbWU9XCInK25hbWUrJ1wiXScpLFxuICAgICAgICAgICAgb2xkdmFsO1xuICAgICAgICBpZighJGZpZWxkLmxlbmd0aCl7XG4gICAgICAgICAgICAkZmllbGQgPSAkKCc8aW5wdXQvPicseyd0eXBlJzonaGlkZGVuJywnbmFtZSc6bmFtZX0pLmFwcGVuZFRvKCRmb3JtKTtcbiAgICAgICAgfVxuICAgICAgICBpZihleHRlcm5hbCl7XG4gICAgICAgICAgICBvbGR2YWwgPSAkZmllbGQudmFsKCk7XG4gICAgICAgICAgICAkZmllbGQudmFsKFxuICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgKG9sZHZhbCE9PVwiXCIpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIChvbGR2YWwrJywnKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICkrZXh0ZXJuYWxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKmNyZWF0ZSB0aGUgcGx1Z2luKi9cbiAgICAkLmZuLmJzZFNpZ251cCA9IGZ1bmN0aW9uKG9wcyl7XG4gICAgICAgIG9wcyA9IG9wc3x8e307XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gJGZvcm0uYXR0cignYWN0aW9uJyk7Ly9hY3Rpb24gb3Igc2VsZiAoc2VsZiBpcyBwcmV0dHkgdW5saWtlbHkgaGVyZSwgYnV0IGJ3aGF0ZXZlcilcbiAgICAgICAgICAgIGlmKG9wcz09PVwicmVtb3ZlXCIpe1xuICAgICAgICAgICAgICAgICRmb3JtLm9mZignc3VibWl0LmJzZHNpZ251cCcpLnJlbW92ZURhdGEoJ2JzZHNpZ251cCBpc1BhdXNlZCcpOy8vcmVtb3ZlcyB0aGUgcGx1Z2luIGVudGlyZWx5XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBpZigkZm9ybS5pcygnZm9ybScpICYmIGFjdGlvbi5pbmRleE9mKCdwYWdlL3MnKT4tMSl7Ly9vbmx5IGJvdGhlciBpZiBrZXkgZWxlbWVudHMgYXJlIHByZXNlbnRcbiAgICAgICAgICAgICAgICAgICAgaWYoJGZvcm0uZGF0YSgnYnNkc291cmNlZCcpIT09dHJ1ZSAmJiAhb3BzLm5vc291cmNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZVNvdXJjZUZpZWxkKCRmb3JtLCBzb3VyY2VTdHJpbmcsIHVybHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVTb3VyY2VGaWVsZCgkZm9ybSwgc3Vic291cmNlU3RyaW5nLCB1cmxzdWJzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uZGF0YSgnYnNkc291cmNlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uZGF0YSgnYnNkc2lnbnVwJyxvcHMpO1xuICAgICAgICAgICAgICAgICAgICBpZihvcHMuc3RhcnRQYXVzZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uZGF0YSgnaXNQYXVzZWQnLHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJGZvcm0ub24oJ3N1Ym1pdC5ic2RzaWdudXAnLCBqc2FwaVN1Ym1pdCgkZm9ybSwgYWN0aW9uLCBvcHMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0oalF1ZXJ5LCB3aW5kb3cubG9jYXRpb24pKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy92ZW5kb3IvYnNkLXNpZ251cC1qc2FwaS1zaW1wbGUtZGV2LmpzIiwiLyoqXG4qIEZvcm0gRWZmZWN0cyBtb2R1bGVcbiogQG1vZHVsZSBtb2R1bGVzL2Zvcm1FZmZlY3RzXG4qIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2NvZHJvcHMvVGV4dElucHV0RWZmZWN0cy9ibG9iL21hc3Rlci9pbmRleDIuaHRtbFxuKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuaW1wb3J0IGRpc3BhdGNoRXZlbnQgZnJvbSAnLi9kaXNwYXRjaEV2ZW50LmpzJztcblxuLyoqXG4qIFV0aWxpdHkgZnVuY3Rpb24gdG8gc2V0IGFuICdpcy1maWxsZWQnIGNsYXNzIG9uIGlucHV0cyB0aGF0IGFyZSBmb2N1c2VkIG9yXG4qIGNvbnRhaW4gdGV4dC4gQ2FuIHRoZW4gYmUgdXNlZCB0byBhZGQgZWZmZWN0cyB0byB0aGUgZm9ybSwgc3VjaCBhcyBtb3ZpbmdcbiogdGhlIGxhYmVsLlxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICAvKipcbiAgKiBBZGQgdGhlIGZpbGxlZCBjbGFzcyB3aGVuIGlucHV0IGlzIGZvY3VzZWRcbiAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICovXG4gIGZ1bmN0aW9uIGhhbmRsZUZvY3VzKGV2ZW50KSB7XG4gICAgY29uc3Qgd3JhcHBlckVsZW0gPSBldmVudC50YXJnZXQucGFyZW50Tm9kZTtcbiAgICB3cmFwcGVyRWxlbS5jbGFzc0xpc3QuYWRkKCdpcy1maWxsZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJlbW92ZSB0aGUgZmlsbGVkIGNsYXNzIHdoZW4gaW5wdXQgaXMgYmx1cnJlZCBpZiBpdCBkb2VzIG5vdCBjb250YWluIHRleHRcbiAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICovXG4gIGZ1bmN0aW9uIGhhbmRsZUJsdXIoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LnZhbHVlLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgIGNvbnN0IHdyYXBwZXJFbGVtID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICB3cmFwcGVyRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1maWxsZWQnKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2lnbnVwLWZvcm1fX2ZpZWxkJyk7XG4gIGlmIChpbnB1dHMubGVuZ3RoKSB7XG4gICAgZm9yRWFjaChpbnB1dHMsIGZ1bmN0aW9uKGlucHV0RWxlbSkge1xuICAgICAgaW5wdXRFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgaGFuZGxlRm9jdXMpO1xuICAgICAgaW5wdXRFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBoYW5kbGVCbHVyKTtcbiAgICAgIGRpc3BhdGNoRXZlbnQoaW5wdXRFbGVtLCAnYmx1cicpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9mb3JtRWZmZWN0cy5qcyIsIi8qKlxuKiBDcm9zcy1icm93c2VyIHV0aWxpdHkgdG8gZmlyZSBldmVudHNcbiogQHBhcmFtIHtvYmplY3R9IGVsZW0gLSBET00gZWxlbWVudCB0byBmaXJlIGV2ZW50IG9uXG4qIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBFdmVudCB0eXBlLCBpLmUuICdyZXNpemUnLCAnY2xpY2snXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZWxlbSwgZXZlbnRUeXBlKSB7XG4gIGxldCBldmVudDtcbiAgaWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50KSB7XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuICAgIGV2ZW50LmluaXRFdmVudChldmVudFR5cGUsIHRydWUsIHRydWUpO1xuICAgIGVsZW0uZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xuICAgIGVsZW0uZmlyZUV2ZW50KCdvbicgKyBldmVudFR5cGUsIGV2ZW50KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvZGlzcGF0Y2hFdmVudC5qcyIsIi8qKlxuKiBGYWNldFdQIEV2ZW50IEhhbmRsaW5nXG4qIFJlcXVpcmVzIGZyb250LmpzLCB3aGljaCBpcyBhZGRlZCBieSB0aGUgRmFjZXRXUCBwbHVnaW5cbiogQWxzbyByZXF1aXJlcyBqUXVlcnkgYXMgRmFjZXRXUCBpdHNlbGYgcmVxdWlyZXMgalF1ZXJ5XG4qL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgJChkb2N1bWVudCkub24oJ2ZhY2V0d3AtcmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnZmFjZXR3cC1pcy1sb2FkZWQnKS5hZGRDbGFzcygnZmFjZXR3cC1pcy1sb2FkaW5nJyk7XG4gICAgJCgnaHRtbCwgYm9keScpLnNjcm9sbFRvcCgwKTtcbiAgfSk7XG5cbiAgJChkb2N1bWVudCkub24oJ2ZhY2V0d3AtbG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdmYWNldHdwLWlzLWxvYWRpbmcnKS5hZGRDbGFzcygnZmFjZXR3cC1pcy1sb2FkZWQnKTtcbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9mYWNldHMuanMiLCIvKipcclxuKiBPd2wgU2V0dGluZ3MgbW9kdWxlXHJcbiogQG1vZHVsZSBtb2R1bGVzL293bFNldHRpbmdzXHJcbiogQHNlZSBodHRwczovL293bGNhcm91c2VsMi5naXRodWIuaW8vT3dsQ2Fyb3VzZWwyL2luZGV4Lmh0bWxcclxuKi9cclxuXHJcbi8qKlxyXG4qIG93bCBjYXJvdXNlbCBzZXR0aW5ncyBhbmQgdG8gbWFrZSB0aGUgb3dsIGNhcm91c2VsIHdvcmsuXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBvd2wgPSAkKCcub3dsLWNhcm91c2VsJyk7XHJcbiAgb3dsLm93bENhcm91c2VsKHtcclxuICAgIGFuaW1hdGVJbjogJ2ZhZGVJbicsXHJcbiAgICBhbmltYXRlT3V0OiAnZmFkZU91dCcsXHJcbiAgICBpdGVtczoxLFxyXG4gICAgbG9vcDp0cnVlLFxyXG4gICAgbWFyZ2luOjAsXHJcbiAgICBkb3RzOiB0cnVlLFxyXG4gICAgYXV0b3BsYXk6dHJ1ZSxcclxuICAgIGF1dG9wbGF5VGltZW91dDo1MDAwLFxyXG4gICAgYXV0b3BsYXlIb3ZlclBhdXNlOnRydWVcclxuICB9KTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL293bFNldHRpbmdzLmpzIiwiLyoqXG4qIGlPUzcgaVBhZCBIYWNrXG4qIGZvciBoZXJvIGltYWdlIGZsaWNrZXJpbmcgaXNzdWUuXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQYWQ7LipDUFUuKk9TIDdfXFxkL2kpKSB7XG4gICAgJCgnLmMtc2lkZS1oZXJvJykuaGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9pT1M3SGFjay5qcyIsIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IENvb2tpZXMgZnJvbSAnanMtY29va2llJztcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4uL3ZlbmRvci91dGlsaXR5LmpzJztcbmltcG9ydCBDbGVhdmUgZnJvbSAnY2xlYXZlLmpzL2Rpc3QvY2xlYXZlLm1pbic7XG5pbXBvcnQgJ2NsZWF2ZS5qcy9kaXN0L2FkZG9ucy9jbGVhdmUtcGhvbmUudXMnO1xuXG4vKiBlc2xpbnQgbm8tdW5kZWY6IFwib2ZmXCIgKi9cbmNvbnN0IFZhcmlhYmxlcyA9IHJlcXVpcmUoJy4uLy4uL3ZhcmlhYmxlcy5qc29uJyk7XG5cbi8qKlxuICogVGhpcyBjb21wb25lbnQgaGFuZGxlcyB2YWxpZGF0aW9uIGFuZCBzdWJtaXNzaW9uIGZvciBzaGFyZSBieSBlbWFpbCBhbmRcbiAqIHNoYXJlIGJ5IFNNUyBmb3Jtcy5cbi8qKlxuKiBBZGRzIGZ1bmN0aW9uYWxpdHkgdG8gdGhlIGlucHV0IGluIHRoZSBzZWFyY2ggcmVzdWx0cyBoZWFkZXJcbiovXG5cbmNsYXNzIFNoYXJlRm9ybSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBodG1sIGZvcm0gZWxlbWVudCBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbCkge1xuICAgIC8qKiBAcHJpdmF0ZSB7SFRNTEVsZW1lbnR9IFRoZSBjb21wb25lbnQgZWxlbWVudC4gKi9cbiAgICB0aGlzLl9lbCA9IGVsO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoaXMgZm9ybSBpcyB2YWxpZC4gKi9cbiAgICB0aGlzLl9pc1ZhbGlkID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGZvcm0gaXMgY3VycmVudGx5IHN1Ym1pdHRpbmcuICovXG4gICAgdGhpcy5faXNCdXN5ID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGZvcm0gaXMgZGlzYWJsZWQuICovXG4gICAgdGhpcy5faXNEaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoaXMgY29tcG9uZW50IGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICAgIHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGdvb2dsZSByZUNBUFRDSEEgd2lkZ2V0IGlzIHJlcXVpcmVkLiAqL1xuICAgIHRoaXMuX3JlY2FwdGNoYVJlcXVpcmVkID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGdvb2dsZSByZUNBUFRDSEEgd2lkZ2V0IGhhcyBwYXNzZWQuICovXG4gICAgdGhpcy5fcmVjYXB0Y2hhVmVyaWZpZWQgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZ29vZ2xlIHJlQ0FQVENIQSB3aWRnZXQgaXMgaW5pdGlsYWlzZWQuICovXG4gICAgdGhpcy5fcmVjYXB0Y2hhaW5pdCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgY29tcG9uZW50IGhhcyBub3QgeWV0IGJlZW4gaW5pdGlhbGl6ZWQsIGF0dGFjaGVzIGV2ZW50IGxpc3RlbmVycy5cbiAgICogQG1ldGhvZFxuICAgKiBAcmV0dXJuIHt0aGlzfSBTaGFyZUZvcm1cbiAgICovXG4gIGluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2luaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLl9lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwidGVsXCJdJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX21hc2tQaG9uZShzZWxlY3RlZCk7XG4gICAgfVxuXG4gICAgJChgLiR7U2hhcmVGb3JtLkNzc0NsYXNzLlNIT1dfRElTQ0xBSU1FUn1gKVxuICAgICAgLm9uKCdmb2N1cycsICgpID0+IHtcbiAgICAgICAgdGhpcy5fZGlzY2xhaW1lcih0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgJCh0aGlzLl9lbCkub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKHRoaXMuX3JlY2FwdGNoYVJlcXVpcmVkKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZWNhcHRjaGFWZXJpZmllZCkge1xuICAgICAgICAgIHRoaXMuX3ZhbGlkYXRlKCk7XG4gICAgICAgICAgaWYgKHRoaXMuX2lzVmFsaWQgJiYgIXRoaXMuX2lzQnVzeSAmJiAhdGhpcy5faXNEaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5fc3VibWl0KCk7XG4gICAgICAgICAgICB3aW5kb3cuZ3JlY2FwdGNoYS5yZXNldCgpO1xuICAgICAgICAgICAgJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKS5hZGRDbGFzcygncmVjYXB0Y2hhLWpzJyk7XG4gICAgICAgICAgICB0aGlzLl9yZWNhcHRjaGFWZXJpZmllZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKHRoaXMuX2VsKS5maW5kKGAuJHtTaGFyZUZvcm0uQ3NzQ2xhc3MuRVJST1JfTVNHfWApLnJlbW92ZSgpO1xuICAgICAgICAgIHRoaXMuX3Nob3dFcnJvcihTaGFyZUZvcm0uTWVzc2FnZS5SRUNBUFRDSEEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl92YWxpZGF0ZSgpO1xuICAgICAgICBpZiAodGhpcy5faXNWYWxpZCAmJiAhdGhpcy5faXNCdXN5ICYmICF0aGlzLl9pc0Rpc2FibGVkKSB7XG4gICAgICAgICAgdGhpcy5fc3VibWl0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gLy8gRGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRvIGluaXRpYWxpemUgUmVDQVBUQ0hBLiBUaGlzIHNob3VsZCBiZVxuICAgICAgLy8gLy8gaW5pdGlhbGl6ZWQgb25seSBvbiBldmVyeSAxMHRoIHZpZXcgd2hpY2ggaXMgZGV0ZXJtaW5lZCB2aWEgYW5cbiAgICAgIC8vIC8vIGluY3JlbWVudGluZyBjb29raWUuXG4gICAgICBsZXQgdmlld0NvdW50ID0gQ29va2llcy5nZXQoJ3NjcmVlbmVyVmlld3MnKSA/XG4gICAgICAgIHBhcnNlSW50KENvb2tpZXMuZ2V0KCdzY3JlZW5lclZpZXdzJyksIDEwKSA6IDE7XG4gICAgICBpZiAodmlld0NvdW50ID49IDUgJiYgIXRoaXMuX3JlY2FwdGNoYWluaXQpIHtcbiAgICAgICAgJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKS5hZGRDbGFzcygncmVjYXB0Y2hhLWpzJyk7XG4gICAgICAgIHRoaXMuX2luaXRSZWNhcHRjaGEoKTtcbiAgICAgICAgdGhpcy5fcmVjYXB0Y2hhaW5pdCA9IHRydWU7XG4gICAgICB9XG4gICAgICBDb29raWVzLnNldCgnc2NyZWVuZXJWaWV3cycsICsrdmlld0NvdW50LCB7ZXhwaXJlczogKDIvMTQ0MCl9KTtcblxuICAgICAgJChcIiNwaG9uZVwiKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKCdwbGFjZWhvbGRlcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAvLyBEZXRlcm1pbmUgd2hldGhlciBvciBub3QgdG8gaW5pdGlhbGl6ZSBSZUNBUFRDSEEuIFRoaXMgc2hvdWxkIGJlXG4gICAgLy8gLy8gaW5pdGlhbGl6ZWQgb25seSBvbiBldmVyeSAxMHRoIHZpZXcgd2hpY2ggaXMgZGV0ZXJtaW5lZCB2aWEgYW5cbiAgICAvLyAvLyBpbmNyZW1lbnRpbmcgY29va2llLlxuICAgIGxldCB2aWV3Q291bnQgPSBDb29raWVzLmdldCgnc2NyZWVuZXJWaWV3cycpID9cbiAgICAgIHBhcnNlSW50KENvb2tpZXMuZ2V0KCdzY3JlZW5lclZpZXdzJyksIDEwKSA6IDE7XG4gICAgaWYgKHZpZXdDb3VudCA+PSA1ICYmICF0aGlzLl9yZWNhcHRjaGFpbml0ICkge1xuICAgICAgJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKS5hZGRDbGFzcygncmVjYXB0Y2hhLWpzJyk7XG4gICAgICB0aGlzLl9pbml0UmVjYXB0Y2hhKCk7XG4gICAgICB0aGlzLl9yZWNhcHRjaGFpbml0ID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hc2sgZWFjaCBwaG9uZSBudW1iZXIgYW5kIHByb3Blcmx5IGZvcm1hdCBpdFxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gaW5wdXQgdGhlIFwidGVsXCIgaW5wdXQgdG8gbWFza1xuICAgKiBAcmV0dXJuIHtjb25zdHJ1Y3Rvcn0gICAgICAgdGhlIGlucHV0IG1hc2tcbiAgICovXG4gIF9tYXNrUGhvbmUoaW5wdXQpIHtcbiAgICBsZXQgY2xlYXZlID0gbmV3IENsZWF2ZShpbnB1dCwge1xuICAgICAgcGhvbmU6IHRydWUsXG4gICAgICBwaG9uZVJlZ2lvbkNvZGU6ICd1cycsXG4gICAgICBkZWxpbWl0ZXI6ICctJ1xuICAgIH0pO1xuICAgIGlucHV0LmNsZWF2ZSA9IGNsZWF2ZTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgZGlzY2xhaW1lciB2aXNpYmlsaXR5XG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IHZpc2libGUgLSB3ZXRoZXIgdGhlIGRpc2NsYWltZXIgc2hvdWxkIGJlIHZpc2libGUgb3Igbm90XG4gICAqL1xuICBfZGlzY2xhaW1lcih2aXNpYmxlID0gdHJ1ZSkge1xuICAgIGxldCAkZWwgPSAkKCcjanMtZGlzY2xhaW1lcicpO1xuICAgIGxldCAkY2xhc3MgPSAodmlzaWJsZSkgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJztcbiAgICAkZWwuYXR0cignYXJpYS1oaWRkZW4nLCAhdmlzaWJsZSk7XG4gICAgJGVsLmF0dHIoU2hhcmVGb3JtLkNzc0NsYXNzLkhJRERFTiwgIXZpc2libGUpO1xuICAgICRlbFskY2xhc3NdKFNoYXJlRm9ybS5Dc3NDbGFzcy5BTklNQVRFX0RJU0NMQUlNRVIpO1xuICAgIC8vIFNjcm9sbC10byBmdW5jdGlvbmFsaXR5IGZvciBtb2JpbGVcbiAgICBpZiAoXG4gICAgICB3aW5kb3cuc2Nyb2xsVG8gJiZcbiAgICAgIHZpc2libGUgJiZcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIDwgVmFyaWFibGVzWydzY3JlZW4tZGVza3RvcCddXG4gICAgKSB7XG4gICAgICBsZXQgJHRhcmdldCA9ICQoZS50YXJnZXQpO1xuICAgICAgd2luZG93LnNjcm9sbFRvKFxuICAgICAgICAwLCAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtICR0YXJnZXQuZGF0YSgnc2Nyb2xsT2Zmc2V0JylcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1bnMgdmFsaWRhdGlvbiBydWxlcyBhbmQgc2V0cyB2YWxpZGl0eSBvZiBjb21wb25lbnQuXG4gICAqIEBtZXRob2RcbiAgICogQHJldHVybiB7dGhpc30gU2hhcmVGb3JtXG4gICAqL1xuICBfdmFsaWRhdGUoKSB7XG4gICAgbGV0IHZhbGlkaXR5ID0gdHJ1ZTtcbiAgICBjb25zdCAkdGVsID0gJCh0aGlzLl9lbCkuZmluZCgnaW5wdXRbdHlwZT1cInRlbFwiXScpO1xuICAgIC8vIENsZWFyIGFueSBleGlzdGluZyBlcnJvciBtZXNzYWdlcy5cbiAgICAkKHRoaXMuX2VsKS5maW5kKGAuJHtTaGFyZUZvcm0uQ3NzQ2xhc3MuRVJST1JfTVNHfWApLnJlbW92ZSgpO1xuXG4gICAgaWYgKCR0ZWwubGVuZ3RoKSB7XG4gICAgICB2YWxpZGl0eSA9IHRoaXMuX3ZhbGlkYXRlUGhvbmVOdW1iZXIoJHRlbFswXSk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNWYWxpZCA9IHZhbGlkaXR5O1xuICAgIGlmICh0aGlzLl9pc1ZhbGlkKSB7XG4gICAgICAkKHRoaXMuX2VsKS5yZW1vdmVDbGFzcyhTaGFyZUZvcm0uQ3NzQ2xhc3MuRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgYSBnaXZlbiBpbnB1dCwgY2hlY2tzIHRvIHNlZSBpZiBpdHMgdmFsdWUgaXMgYSB2YWxpZCBQaG9uZW51bWJlci4gSWYgbm90LFxuICAgKiBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGFuZCBzZXRzIGFuIGVycm9yIGNsYXNzIG9uIHRoZSBlbGVtZW50LlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpbnB1dCAtIFRoZSBodG1sIGZvcm0gZWxlbWVudCBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gLSBWYWxpZCBlbWFpbC5cbiAgICovXG4gIF92YWxpZGF0ZVBob25lTnVtYmVyKGlucHV0KXtcbiAgICBsZXQgbnVtID0gdGhpcy5fcGFyc2VQaG9uZU51bWJlcihpbnB1dC52YWx1ZSk7IC8vIHBhcnNlIHRoZSBudW1iZXJcbiAgICBudW0gPSAobnVtKSA/IG51bS5qb2luKCcnKSA6IDA7IC8vIGlmIG51bSBpcyBudWxsLCB0aGVyZSBhcmUgbm8gbnVtYmVyc1xuICAgIGlmIChudW0ubGVuZ3RoID09PSAxMCkge1xuICAgICAgcmV0dXJuIHRydWU7IC8vIGFzc3VtZSBpdCBpcyBwaG9uZSBudW1iZXJcbiAgICB9XG4gICAgdGhpcy5fc2hvd0Vycm9yKFNoYXJlRm9ybS5NZXNzYWdlLlBIT05FKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gdmFyIHBob25lbm8gPSAvXlxcKz8oWzAtOV17Mn0pXFwpP1stLiBdPyhbMC05XXs0fSlbLS4gXT8oWzAtOV17NH0pJC87XG4gICAgLy8gdmFyIHBob25lbm8gPSAoL15cXCs/WzEtOV1cXGR7MSwxNH0kLyk7XG4gICAgLy8gaWYoIWlucHV0LnZhbHVlLm1hdGNoKHBob25lbm8pKXtcbiAgICAvLyAgIHRoaXMuX3Nob3dFcnJvcihTaGFyZUZvcm0uTWVzc2FnZS5QSE9ORSk7XG4gICAgLy8gICByZXR1cm4gZmFsc2U7XG4gICAgLy8gfVxuICAgIC8vIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBqdXN0IHRoZSBwaG9uZSBudW1iZXIgb2YgYSBnaXZlbiB2YWx1ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHZhbHVlIFRoZSBzdHJpbmcgdG8gZ2V0IG51bWJlcnMgZnJvbVxuICAgKiBAcmV0dXJuIHthcnJheX0gICAgICAgQW4gYXJyYXkgd2l0aCBtYXRjaGVkIGJsb2Nrc1xuICAgKi9cbiAgX3BhcnNlUGhvbmVOdW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL1xcZCsvZyk7IC8vIGdldCBvbmx5IGRpZ2l0c1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBhIGdpdmVuIGlucHV0LCBjaGVja3MgdG8gc2VlIGlmIGl0IGhhcyBhIHZhbHVlLiBJZiBub3QsIGRpc3BsYXlzIGFuXG4gICAqIGVycm9yIG1lc3NhZ2UgYW5kIHNldHMgYW4gZXJyb3IgY2xhc3Mgb24gdGhlIGVsZW1lbnQuXG4gICAqIEBtZXRob2RcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaW5wdXQgLSBUaGUgaHRtbCBmb3JtIGVsZW1lbnQgZm9yIHRoZSBjb21wb25lbnQuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gVmFsaWQgcmVxdWlyZWQgZmllbGQuXG4gICAqL1xuICBfdmFsaWRhdGVSZXF1aXJlZChpbnB1dCkge1xuICAgIGlmICgkKGlucHV0KS52YWwoKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHRoaXMuX3Nob3dFcnJvcihTaGFyZUZvcm0uTWVzc2FnZS5SRVFVSVJFRCk7XG4gICAgJChpbnB1dCkub25lKCdrZXl1cCcsIGZ1bmN0aW9uKCl7XG4gICAgICB0aGlzLl92YWxpZGF0ZSgpO1xuICAgIH0pO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGJ5IGFwcGVuZGluZyBhIGRpdiB0byB0aGUgZm9ybS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1zZyAtIEVycm9yIG1lc3NhZ2UgdG8gZGlzcGxheS5cbiAgICogQHJldHVybiB7dGhpc30gU2hhcmVGb3JtIC0gc2hhcmVmb3JtXG4gICAqL1xuICBfc2hvd0Vycm9yKG1zZykge1xuICAgIGxldCAkZWxQYXJlbnRzID0gJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKTtcbiAgICAkKCcjc21zLWZvcm0tbXNnJykuYWRkQ2xhc3MoU2hhcmVGb3JtLkNzc0NsYXNzLkVSUk9SKS50ZXh0KFV0aWxpdHkubG9jYWxpemUobXNnKSk7XG4gICAgJGVsUGFyZW50cy5yZW1vdmVDbGFzcygnc3VjY2Vzcy1qcycpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBcInN1Y2Nlc3NcIiBjbGFzcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1zZyAtIEVycm9yIG1lc3NhZ2UgdG8gZGlzcGxheS5cbiAgICogQHJldHVybiB7dGhpc30gU2hhcmVGb3JtXG4gICAqL1xuICBfc2hvd1N1Y2Nlc3MobXNnKSB7XG4gICAgbGV0ICRlbFBhcmVudHMgPSAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpO1xuICAgICQoJyNwaG9uZScpLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBVdGlsaXR5LmxvY2FsaXplKG1zZykpO1xuICAgICQoJyNzbXNidXR0b24nKS50ZXh0KFwiU2VuZCBBbm90aGVyXCIpO1xuICAgICQoJyNzbXMtZm9ybS1tc2cnKS5hZGRDbGFzcyhTaGFyZUZvcm0uQ3NzQ2xhc3MuU1VDQ0VTUykudGV4dCgnJyk7XG4gICAgJGVsUGFyZW50cy5yZW1vdmVDbGFzcygnc3VjY2Vzcy1qcycpO1xuICAgICRlbFBhcmVudHMuYWRkQ2xhc3MoJ3N1Y2Nlc3MtanMnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJtaXRzIHRoZSBmb3JtLlxuICAgKiBAcmV0dXJuIHtqcVhIUn0gZGVmZXJyZWQgcmVzcG9uc2Ugb2JqZWN0XG4gICAqL1xuICBfc3VibWl0KCkge1xuICAgIHRoaXMuX2lzQnVzeSA9IHRydWU7XG4gICAgbGV0ICRzcGlubmVyID0gdGhpcy5fZWwucXVlcnlTZWxlY3RvcihgLiR7U2hhcmVGb3JtLkNzc0NsYXNzLlNQSU5ORVJ9YCk7XG4gICAgbGV0ICRzdWJtaXQgPSB0aGlzLl9lbC5xdWVyeVNlbGVjdG9yKCdidXR0b25bdHlwZT1cInN1Ym1pdFwiXScpO1xuICAgIGNvbnN0IHBheWxvYWQgPSAkKHRoaXMuX2VsKS5zZXJpYWxpemUoKTtcbiAgICAkKHRoaXMuX2VsKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgaWYgKCRzcGlubmVyKSB7XG4gICAgICAkc3VibWl0LmRpc2FibGVkID0gdHJ1ZTsgLy8gaGlkZSBzdWJtaXQgYnV0dG9uXG4gICAgICAkc3Bpbm5lci5zdHlsZS5jc3NUZXh0ID0gJyc7IC8vIHNob3cgc3Bpbm5lclxuICAgIH1cbiAgICByZXR1cm4gJC5wb3N0KCQodGhpcy5fZWwpLmF0dHIoJ2FjdGlvbicpLCBwYXlsb2FkKS5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgIHRoaXMuX2VsLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX3Nob3dTdWNjZXNzKFNoYXJlRm9ybS5NZXNzYWdlLlNVQ0NFU1MpO1xuICAgICAgICB0aGlzLl9pc0Rpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgJCh0aGlzLl9lbCkub25lKCdrZXl1cCcsICdpbnB1dCcsICgpID0+IHtcbiAgICAgICAgICAkKHRoaXMuX2VsKS5yZW1vdmVDbGFzcyhTaGFyZUZvcm0uQ3NzQ2xhc3MuU1VDQ0VTUyk7XG4gICAgICAgICAgdGhpcy5faXNEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Nob3dFcnJvcihKU09OLnN0cmluZ2lmeShyZXNwb25zZS5tZXNzYWdlKSk7XG4gICAgICB9XG4gICAgfSkuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3Nob3dFcnJvcihTaGFyZUZvcm0uTWVzc2FnZS5TRVJWRVIpO1xuICAgIH0pLmFsd2F5cygoKSA9PiB7XG4gICAgICAkKHRoaXMuX2VsKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgaWYgKCRzcGlubmVyKSB7XG4gICAgICAgICRzdWJtaXQuZGlzYWJsZWQgPSBmYWxzZTsgLy8gc2hvdyBzdWJtaXQgYnV0dG9uXG4gICAgICAgICRzcGlubmVyLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7IC8vIGhpZGUgc3Bpbm5lcjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2lzQnVzeSA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzeW5jaHJvbm91c2x5IGxvYWRzIHRoZSBHb29nbGUgcmVjYXB0Y2hhIHNjcmlwdCBhbmQgc2V0cyBjYWxsYmFja3MgZm9yXG4gICAqIGxvYWQsIHN1Y2Nlc3MsIGFuZCBleHBpcmF0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHt0aGlzfSBTY3JlZW5lclxuICAgKi9cbiAgX2luaXRSZWNhcHRjaGEoKSB7XG4gICAgY29uc3QgJHNjcmlwdCA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JykpO1xuICAgICRzY3JpcHQuYXR0cignc3JjJyxcbiAgICAgICAgJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vcmVjYXB0Y2hhL2FwaS5qcycgK1xuICAgICAgICAnP29ubG9hZD1zY3JlZW5lckNhbGxiYWNrJnJlbmRlcj1leHBsaWNpdCcpLnByb3Aoe1xuICAgICAgYXN5bmM6IHRydWUsXG4gICAgICBkZWZlcjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgd2luZG93LnNjcmVlbmVyQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICB3aW5kb3cuZ3JlY2FwdGNoYS5yZW5kZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcmVlbmVyLXJlY2FwdGNoYScpLCB7XG4gICAgICAgICdzaXRla2V5JyA6ICc2TGVrSUNZVUFBQUFBT1IydVowYWp5V3Q5WHhEdXNwSFBVQWtSekFCJyxcbiAgICAgICAgLy9CZWxvdyBpcyB0aGUgbG9jYWwgaG9zdCBrZXlcbiAgICAgICAgLy8gJ3NpdGVrZXknIDogJzZMY0FBQ1lVQUFBQUFQbXR2UXZCd0s4OWltTTNRZm90SkZIZlNtOEMnLFxuICAgICAgICAnY2FsbGJhY2snOiAnc2NyZWVuZXJSZWNhcHRjaGEnLFxuICAgICAgICAnZXhwaXJlZC1jYWxsYmFjayc6ICdzY3JlZW5lclJlY2FwdGNoYVJlc2V0J1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZWNhcHRjaGFSZXF1aXJlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIHdpbmRvdy5zY3JlZW5lclJlY2FwdGNoYSA9ICgpID0+IHtcbiAgICAgIHRoaXMuX3JlY2FwdGNoYVZlcmlmaWVkID0gdHJ1ZTtcbiAgICAgICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJykucmVtb3ZlQ2xhc3MoJ3JlY2FwdGNoYS1qcycpO1xuICAgIH07XG5cbiAgICB3aW5kb3cuc2NyZWVuZXJSZWNhcHRjaGFSZXNldCA9ICgpID0+IHtcbiAgICAgIHRoaXMuX3JlY2FwdGNoYVZlcmlmaWVkID0gZmFsc2U7XG4gICAgICAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpLmFkZENsYXNzKCdyZWNhcHRjaGEtanMnKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fcmVjYXB0Y2hhUmVxdWlyZWQgPSB0cnVlO1xuICAgICQoJ2hlYWQnKS5hcHBlbmQoJHNjcmlwdCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqXG4gKiBDU1MgY2xhc3NlcyB1c2VkIGJ5IHRoaXMgY29tcG9uZW50LlxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuU2hhcmVGb3JtLkNzc0NsYXNzID0ge1xuICBFUlJPUjogJ2Vycm9yJyxcbiAgRVJST1JfTVNHOiAnZXJyb3ItbWVzc2FnZScsXG4gIEZPUk06ICdqcy1zaGFyZS1mb3JtJyxcbiAgU0hPV19ESVNDTEFJTUVSOiAnanMtc2hvdy1kaXNjbGFpbWVyJyxcbiAgTkVFRFNfRElTQ0xBSU1FUjogJ2pzLW5lZWRzLWRpc2NsYWltZXInLFxuICBBTklNQVRFX0RJU0NMQUlNRVI6ICdhbmltYXRlZCBmYWRlSW5VcCcsXG4gIEhJRERFTjogJ2hpZGRlbicsXG4gIFNVQk1JVF9CVE46ICdidG4tc3VibWl0JyxcbiAgU1VDQ0VTUzogJ3N1Y2Nlc3MnLFxuICBTUElOTkVSOiAnanMtc3Bpbm5lcidcbn07XG5cbi8qKlxuICogTG9jYWxpemF0aW9uIGxhYmVscyBvZiBmb3JtIG1lc3NhZ2VzLlxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuU2hhcmVGb3JtLk1lc3NhZ2UgPSB7XG4gIEVNQUlMOiAnRVJST1JfRU1BSUwnLFxuICBQSE9ORTogJ0ludmFsaWQgTW9iaWxlIE51bWJlcicsXG4gIFJFUVVJUkVEOiAnRVJST1JfUkVRVUlSRUQnLFxuICBTRVJWRVI6ICdFUlJPUl9TRVJWRVInLFxuICBTVUNDRVNTOiAnTWVzc2FnZSBzZW50IScsXG4gIFJFQ0FQVENIQSA6ICdQbGVhc2UgZmlsbCB0aGUgcmVDQVBUQ0hBJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVGb3JtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc2hhcmUtZm9ybS5qcyIsIi8qIVxuICogSmF2YVNjcmlwdCBDb29raWUgdjIuMi4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZVxuICpcbiAqIENvcHlyaWdodCAyMDA2LCAyMDE1IEtsYXVzIEhhcnRsICYgRmFnbmVyIEJyYWNrXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuXHR2YXIgcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gZmFsc2U7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoZmFjdG9yeSk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAoIXJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlcikge1xuXHRcdHZhciBPbGRDb29raWVzID0gd2luZG93LkNvb2tpZXM7XG5cdFx0dmFyIGFwaSA9IHdpbmRvdy5Db29raWVzID0gZmFjdG9yeSgpO1xuXHRcdGFwaS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0d2luZG93LkNvb2tpZXMgPSBPbGRDb29raWVzO1xuXHRcdFx0cmV0dXJuIGFwaTtcblx0XHR9O1xuXHR9XG59KGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gZXh0ZW5kICgpIHtcblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdGZvciAoOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IGFyZ3VtZW50c1sgaSBdO1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0cmVzdWx0W2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIpIHtcblx0XHRmdW5jdGlvbiBhcGkgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcblx0XHRcdHZhciByZXN1bHQ7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdyaXRlXG5cblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRhdHRyaWJ1dGVzID0gZXh0ZW5kKHtcblx0XHRcdFx0XHRwYXRoOiAnLydcblx0XHRcdFx0fSwgYXBpLmRlZmF1bHRzLCBhdHRyaWJ1dGVzKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHR2YXIgZXhwaXJlcyA9IG5ldyBEYXRlKCk7XG5cdFx0XHRcdFx0ZXhwaXJlcy5zZXRNaWxsaXNlY29uZHMoZXhwaXJlcy5nZXRNaWxsaXNlY29uZHMoKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGUrNSk7XG5cdFx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gZXhwaXJlcztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFdlJ3JlIHVzaW5nIFwiZXhwaXJlc1wiIGJlY2F1c2UgXCJtYXgtYWdlXCIgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxuXHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMgPyBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXHRcdFx0XHRcdGlmICgvXltcXHtcXFtdLy50ZXN0KHJlc3VsdCkpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gcmVzdWx0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblxuXHRcdFx0XHRpZiAoIWNvbnZlcnRlci53cml0ZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyh2YWx1ZSkpXG5cdFx0XHRcdFx0XHQucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnwzQXwzQ3wzRXwzRHwyRnwzRnw0MHw1Qnw1RHw1RXw2MHw3Qnw3RHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSh2YWx1ZSwga2V5KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGtleSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoa2V5KSk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvW1xcKFxcKV0vZywgZXNjYXBlKTtcblxuXHRcdFx0XHR2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG5cblx0XHRcdFx0Zm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChkb2N1bWVudC5jb29raWUgPSBrZXkgKyAnPScgKyB2YWx1ZSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlYWRcblxuXHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0cmVzdWx0ID0ge307XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLiBBbHNvIHByZXZlbnRzIG9kZCByZXN1bHQgd2hlblxuXHRcdFx0Ly8gY2FsbGluZyBcImdldCgpXCJcblx0XHRcdHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG5cdFx0XHR2YXIgcmRlY29kZSA9IC8oJVswLTlBLVpdezJ9KSsvZztcblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0Zm9yICg7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuXHRcdFx0XHRpZiAoIXRoaXMuanNvbiAmJiBjb29raWUuY2hhckF0KDApID09PSAnXCInKSB7XG5cdFx0XHRcdFx0Y29va2llID0gY29va2llLnNsaWNlKDEsIC0xKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIG5hbWUgPSBwYXJ0c1swXS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdFx0Y29va2llID0gY29udmVydGVyLnJlYWQgP1xuXHRcdFx0XHRcdFx0Y29udmVydGVyLnJlYWQoY29va2llLCBuYW1lKSA6IGNvbnZlcnRlcihjb29raWUsIG5hbWUpIHx8XG5cdFx0XHRcdFx0XHRjb29raWUucmVwbGFjZShyZGVjb2RlLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuanNvbikge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0Y29va2llID0gSlNPTi5wYXJzZShjb29raWUpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoa2V5ID09PSBuYW1lKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBjb29raWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0W25hbWVdID0gY29va2llO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0XHRhcGkuc2V0ID0gYXBpO1xuXHRcdGFwaS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoYXBpLCBrZXkpO1xuXHRcdH07XG5cdFx0YXBpLmdldEpTT04gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gYXBpLmFwcGx5KHtcblx0XHRcdFx0anNvbjogdHJ1ZVxuXHRcdFx0fSwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblx0XHR9O1xuXHRcdGFwaS5kZWZhdWx0cyA9IHt9O1xuXG5cdFx0YXBpLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcblx0XHRcdGFwaShrZXksICcnLCBleHRlbmQoYXR0cmlidXRlcywge1xuXHRcdFx0XHRleHBpcmVzOiAtMVxuXHRcdFx0fSkpO1xuXHRcdH07XG5cblx0XHRhcGkud2l0aENvbnZlcnRlciA9IGluaXQ7XG5cblx0XHRyZXR1cm4gYXBpO1xuXHR9XG5cblx0cmV0dXJuIGluaXQoZnVuY3Rpb24gKCkge30pO1xufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvanMtY29va2llL3NyYy9qcy5jb29raWUuanNcbi8vIG1vZHVsZSBpZCA9IDY3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIHV0aWxpdHkgZnVuY3Rpb25zLlxuICovXG5jb25zdCBVdGlsaXR5ID0ge307XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYSBnaXZlbiBrZXkgaW4gYSBVUkwgcXVlcnkgc3RyaW5nLiBJZiBubyBVUkwgcXVlcnlcbiAqIHN0cmluZyBpcyBwcm92aWRlZCwgdGhlIGN1cnJlbnQgVVJMIGxvY2F0aW9uIGlzIHVzZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIEtleSBuYW1lLlxuICogQHBhcmFtIHs/c3RyaW5nfSBxdWVyeVN0cmluZyAtIE9wdGlvbmFsIHF1ZXJ5IHN0cmluZyB0byBjaGVjay5cbiAqIEByZXR1cm4gez9zdHJpbmd9IFF1ZXJ5IHBhcmFtZXRlciB2YWx1ZS5cbiAqL1xuVXRpbGl0eS5nZXRVcmxQYXJhbWV0ZXIgPSAobmFtZSwgcXVlcnlTdHJpbmcpID0+IHtcbiAgY29uc3QgcXVlcnkgPSBxdWVyeVN0cmluZyB8fCB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuICBjb25zdCBwYXJhbSA9IG5hbWUucmVwbGFjZSgvW1xcW10vLCAnXFxcXFsnKS5yZXBsYWNlKC9bXFxdXS8sICdcXFxcXScpO1xuICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoJ1tcXFxcPyZdJyArIHBhcmFtICsgJz0oW14mI10qKScpO1xuICBjb25zdCByZXN1bHRzID0gcmVnZXguZXhlYyhxdWVyeSk7XG4gIHJldHVybiByZXN1bHRzID09PSBudWxsID8gJycgOlxuICAgICAgZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMV0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xufTtcblxuLyoqXG4gKiBUYWtlcyBhbiBvYmplY3QgYW5kIGRlZXBseSB0cmF2ZXJzZXMgaXQsIHJldHVybmluZyBhbiBhcnJheSBvZiB2YWx1ZXMgZm9yXG4gKiBtYXRjaGVkIHByb3BlcnRpZXMgaWRlbnRpZmllZCBieSB0aGUga2V5IHN0cmluZy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3QgdG8gdHJhdmVyc2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0UHJvcCBuYW1lIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJuIHthcnJheX0gcHJvcGVydHkgdmFsdWVzLlxuICovXG5VdGlsaXR5LmZpbmRWYWx1ZXMgPSAob2JqZWN0LCB0YXJnZXRQcm9wKSA9PiB7XG4gIGNvbnN0IHJlc3VsdHMgPSBbXTtcblxuICAvKipcbiAgICogUmVjdXJzaXZlIGZ1bmN0aW9uIGZvciBpdGVyYXRpbmcgb3ZlciBvYmplY3Qga2V5cy5cbiAgICovXG4gIChmdW5jdGlvbiB0cmF2ZXJzZU9iamVjdChvYmopIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gdGFyZ2V0UHJvcCkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChvYmpba2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZihvYmpba2V5XSkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdHJhdmVyc2VPYmplY3Qob2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KShvYmplY3QpO1xuXG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuLyoqXG4gKiBUYWtlcyBhIHN0cmluZyBvciBudW1iZXIgdmFsdWUgYW5kIGNvbnZlcnRzIGl0IHRvIGEgZG9sbGFyIGFtb3VudFxuICogYXMgYSBzdHJpbmcgd2l0aCB0d28gZGVjaW1hbCBwb2ludHMgb2YgcGVyY2lzaW9uLlxuICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSB2YWwgLSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybiB7c3RyaW5nfSBzdHJpbmdpZmllZCBudW1iZXIgdG8gdHdvIGRlY2ltYWwgcGxhY2VzLlxuICovXG5VdGlsaXR5LnRvRG9sbGFyQW1vdW50ID0gKHZhbCkgPT5cbiAgICAoTWF0aC5hYnMoTWF0aC5yb3VuZChwYXJzZUZsb2F0KHZhbCkgKiAxMDApIC8gMTAwKSkudG9GaXhlZCgyKTtcblxuLyoqXG4gKiBGb3IgdHJhbnNsYXRpbmcgc3RyaW5ncywgdGhlcmUgaXMgYSBnbG9iYWwgTE9DQUxJWkVEX1NUUklOR1MgYXJyYXkgdGhhdFxuICogaXMgZGVmaW5lZCBvbiB0aGUgSFRNTCB0ZW1wbGF0ZSBsZXZlbCBzbyB0aGF0IHRob3NlIHN0cmluZ3MgYXJlIGV4cG9zZWQgdG9cbiAqIFdQTUwgdHJhbnNsYXRpb24uIFRoZSBMT0NBTElaRURfU1RSSU5HUyBhcnJheSBpcyBjb21vc2VkIG9mIG9iamVjdHMgd2l0aCBhXG4gKiBgc2x1Z2Aga2V5IHdob3NlIHZhbHVlIGlzIHNvbWUgY29uc3RhbnQsIGFuZCBhIGBsYWJlbGAgdmFsdWUgd2hpY2ggaXMgdGhlXG4gKiB0cmFuc2xhdGVkIGVxdWl2YWxlbnQuIFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBzbHVnIG5hbWUgYW5kIHJldHVybnMgdGhlXG4gKiBsYWJlbC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzbHVnTmFtZVxuICogQHJldHVybiB7c3RyaW5nfSBsb2NhbGl6ZWQgdmFsdWVcbiAqL1xuVXRpbGl0eS5sb2NhbGl6ZSA9IGZ1bmN0aW9uKHNsdWdOYW1lKSB7XG4gIGxldCB0ZXh0ID0gc2x1Z05hbWUgfHwgJyc7XG4gIGNvbnN0IGxvY2FsaXplZFN0cmluZ3MgPSB3aW5kb3cuTE9DQUxJWkVEX1NUUklOR1MgfHwgW107XG4gIGNvbnN0IG1hdGNoID0gXy5maW5kV2hlcmUobG9jYWxpemVkU3RyaW5ncywge1xuICAgIHNsdWc6IHNsdWdOYW1lXG4gIH0pO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0ZXh0ID0gbWF0Y2gubGFiZWw7XG4gIH1cbiAgcmV0dXJuIHRleHQ7XG59O1xuXG4vKipcbiAqIFRha2VzIGEgYSBzdHJpbmcgYW5kIHJldHVybnMgd2hldGhlciBvciBub3QgdGhlIHN0cmluZyBpcyBhIHZhbGlkIGVtYWlsXG4gKiBieSB1c2luZyBuYXRpdmUgYnJvd3NlciB2YWxpZGF0aW9uIGlmIGF2YWlsYWJsZS4gT3RoZXJ3aXNlLCBkb2VzIGEgc2ltcGxlXG4gKiBSZWdleCB0ZXN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGVtYWlsXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5VdGlsaXR5LmlzVmFsaWRFbWFpbCA9IGZ1bmN0aW9uKGVtYWlsKSB7XG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgaW5wdXQudHlwZSA9ICdlbWFpbCc7XG4gIGlucHV0LnZhbHVlID0gZW1haWw7XG5cbiAgcmV0dXJuIHR5cGVvZiBpbnB1dC5jaGVja1ZhbGlkaXR5ID09PSAnZnVuY3Rpb24nID9cbiAgICAgIGlucHV0LmNoZWNrVmFsaWRpdHkoKSA6IC9cXFMrQFxcUytcXC5cXFMrLy50ZXN0KGVtYWlsKTtcbn07XG5cbi8qKlxuICogU2l0ZSBjb25zdGFudHMuXG4gKiBAZW51bSB7c3RyaW5nfVxuICovXG5VdGlsaXR5LkNPTkZJRyA9IHtcbiAgREVGQVVMVF9MQVQ6IDQwLjcxMjgsXG4gIERFRkFVTFRfTE5HOiAtNzQuMDA1OSxcbiAgR09PR0xFX0FQSTogJ0FJemFTeUJTamNfSk5fcDAtX1ZLeUJ2akNGcVZBbUFJV3Q3Q2xaYycsXG4gIEdPT0dMRV9TVEFUSUNfQVBJOiAnQUl6YVN5Q3QwRTdEWF9ZUEZjVW5sTVA2V0h2MnpxQXd5WkU0cUl3JyxcbiAgR1JFQ0FQVENIQV9TSVRFX0tFWTogJzZMZXluQlVVQUFBQUFOd3NrVFcyVUljZWt0UmlheVNxTEZGd3drNDgnLFxuICBTQ1JFRU5FUl9NQVhfSE9VU0VIT0xEOiA4LFxuICBVUkxfUElOX0JMVUU6ICcvd3AtY29udGVudC90aGVtZXMvYWNjZXNzL2Fzc2V0cy9pbWcvbWFwLXBpbi1ibHVlLnBuZycsXG4gIFVSTF9QSU5fQkxVRV8yWDogJy93cC1jb250ZW50L3RoZW1lcy9hY2Nlc3MvYXNzZXRzL2ltZy9tYXAtcGluLWJsdWUtMngucG5nJyxcbiAgVVJMX1BJTl9HUkVFTjogJy93cC1jb250ZW50L3RoZW1lcy9hY2Nlc3MvYXNzZXRzL2ltZy9tYXAtcGluLWdyZWVuLnBuZycsXG4gIFVSTF9QSU5fR1JFRU5fMlg6ICcvd3AtY29udGVudC90aGVtZXMvYWNjZXNzL2Fzc2V0cy9pbWcvbWFwLXBpbi1ncmVlbi0yeC5wbmcnXG59O1xuXG5leHBvcnQgZGVmYXVsdCBVdGlsaXR5O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL3ZlbmRvci91dGlsaXR5LmpzIiwiLy8gICAgIFVuZGVyc2NvcmUuanMgMS44LjNcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGV4cG9ydHNgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIFNhdmUgYnl0ZXMgaW4gdGhlIG1pbmlmaWVkIChidXQgbm90IGd6aXBwZWQpIHZlcnNpb246XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIEZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuICAvLyBDcmVhdGUgcXVpY2sgcmVmZXJlbmNlIHZhcmlhYmxlcyBmb3Igc3BlZWQgYWNjZXNzIHRvIGNvcmUgcHJvdG90eXBlcy5cbiAgdmFyXG4gICAgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICBzbGljZSAgICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICB0b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZCxcbiAgICBuYXRpdmVDcmVhdGUgICAgICAgPSBPYmplY3QuY3JlYXRlO1xuXG4gIC8vIE5ha2VkIGZ1bmN0aW9uIHJlZmVyZW5jZSBmb3Igc3Vycm9nYXRlLXByb3RvdHlwZS1zd2FwcGluZy5cbiAgdmFyIEN0b3IgPSBmdW5jdGlvbigpe307XG5cbiAgLy8gQ3JlYXRlIGEgc2FmZSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciB1c2UgYmVsb3cuXG4gIHZhciBfID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIF8pIHJldHVybiBvYmo7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF8pKSByZXR1cm4gbmV3IF8ob2JqKTtcbiAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yICoqTm9kZS5qcyoqLCB3aXRoXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciB0aGUgb2xkIGByZXF1aXJlKClgIEFQSS4gSWYgd2UncmUgaW5cbiAgLy8gdGhlIGJyb3dzZXIsIGFkZCBgX2AgYXMgYSBnbG9iYWwgb2JqZWN0LlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjguMyc7XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVmZmljaWVudCAoZm9yIGN1cnJlbnQgZW5naW5lcykgdmVyc2lvblxuICAvLyBvZiB0aGUgcGFzc2VkLWluIGNhbGxiYWNrLCB0byBiZSByZXBlYXRlZGx5IGFwcGxpZWQgaW4gb3RoZXIgVW5kZXJzY29yZVxuICAvLyBmdW5jdGlvbnMuXG4gIHZhciBvcHRpbWl6ZUNiID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAoY29udGV4dCA9PT0gdm9pZCAwKSByZXR1cm4gZnVuYztcbiAgICBzd2l0Y2ggKGFyZ0NvdW50ID09IG51bGwgPyAzIDogYXJnQ291bnQpIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBvdGhlcik7XG4gICAgICB9O1xuICAgICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQSBtb3N0bHktaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgY2FsbGJhY2tzIHRoYXQgY2FuIGJlIGFwcGxpZWRcbiAgLy8gdG8gZWFjaCBlbGVtZW50IGluIGEgY29sbGVjdGlvbiwgcmV0dXJuaW5nIHRoZSBkZXNpcmVkIHJlc3VsdCDigJQgZWl0aGVyXG4gIC8vIGlkZW50aXR5LCBhbiBhcmJpdHJhcnkgY2FsbGJhY2ssIGEgcHJvcGVydHkgbWF0Y2hlciwgb3IgYSBwcm9wZXJ0eSBhY2Nlc3Nvci5cbiAgdmFyIGNiID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBfLmlkZW50aXR5O1xuICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSByZXR1cm4gb3B0aW1pemVDYih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpO1xuICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkgcmV0dXJuIF8ubWF0Y2hlcih2YWx1ZSk7XG4gICAgcmV0dXJuIF8ucHJvcGVydHkodmFsdWUpO1xuICB9O1xuICBfLml0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gY2IodmFsdWUsIGNvbnRleHQsIEluZmluaXR5KTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYXNzaWduZXIgZnVuY3Rpb25zLlxuICB2YXIgY3JlYXRlQXNzaWduZXIgPSBmdW5jdGlvbihrZXlzRnVuYywgdW5kZWZpbmVkT25seSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCA8IDIgfHwgb2JqID09IG51bGwpIHJldHVybiBvYmo7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdLFxuICAgICAgICAgICAga2V5cyA9IGtleXNGdW5jKHNvdXJjZSksXG4gICAgICAgICAgICBsID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKCF1bmRlZmluZWRPbmx5IHx8IG9ialtrZXldID09PSB2b2lkIDApIG9ialtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYSBuZXcgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSBhbm90aGVyLlxuICB2YXIgYmFzZUNyZWF0ZSA9IGZ1bmN0aW9uKHByb3RvdHlwZSkge1xuICAgIGlmICghXy5pc09iamVjdChwcm90b3R5cGUpKSByZXR1cm4ge307XG4gICAgaWYgKG5hdGl2ZUNyZWF0ZSkgcmV0dXJuIG5hdGl2ZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIEN0b3IucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIHZhciByZXN1bHQgPSBuZXcgQ3RvcjtcbiAgICBDdG9yLnByb3RvdHlwZSA9IG51bGw7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgcHJvcGVydHkgPSBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09IG51bGwgPyB2b2lkIDAgOiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEhlbHBlciBmb3IgY29sbGVjdGlvbiBtZXRob2RzIHRvIGRldGVybWluZSB3aGV0aGVyIGEgY29sbGVjdGlvblxuICAvLyBzaG91bGQgYmUgaXRlcmF0ZWQgYXMgYW4gYXJyYXkgb3IgYXMgYW4gb2JqZWN0XG4gIC8vIFJlbGF0ZWQ6IGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoXG4gIC8vIEF2b2lkcyBhIHZlcnkgbmFzdHkgaU9TIDggSklUIGJ1ZyBvbiBBUk0tNjQuICMyMDk0XG4gIHZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuICB2YXIgZ2V0TGVuZ3RoID0gcHJvcGVydHkoJ2xlbmd0aCcpO1xuICB2YXIgaXNBcnJheUxpa2UgPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPj0gMCAmJiBsZW5ndGggPD0gTUFYX0FSUkFZX0lOREVYO1xuICB9O1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgcmF3IG9iamVjdHMgaW4gYWRkaXRpb24gdG8gYXJyYXktbGlrZXMuIFRyZWF0cyBhbGxcbiAgLy8gc3BhcnNlIGFycmF5LWxpa2VzIGFzIGlmIHRoZXkgd2VyZSBkZW5zZS5cbiAgXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGksIGxlbmd0aDtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtpXSwgaSwgb2JqKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50LlxuICBfLm1hcCA9IF8uY29sbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0cyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIHJlc3VsdHNbaW5kZXhdID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDcmVhdGUgYSByZWR1Y2luZyBmdW5jdGlvbiBpdGVyYXRpbmcgbGVmdCBvciByaWdodC5cbiAgZnVuY3Rpb24gY3JlYXRlUmVkdWNlKGRpcikge1xuICAgIC8vIE9wdGltaXplZCBpdGVyYXRvciBmdW5jdGlvbiBhcyB1c2luZyBhcmd1bWVudHMubGVuZ3RoXG4gICAgLy8gaW4gdGhlIG1haW4gZnVuY3Rpb24gd2lsbCBkZW9wdGltaXplIHRoZSwgc2VlICMxOTkxLlxuICAgIGZ1bmN0aW9uIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpIHtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdGVlKG1lbW8sIG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDQpO1xuICAgICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgICBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIC8vIERldGVybWluZSB0aGUgaW5pdGlhbCB2YWx1ZSBpZiBub25lIGlzIHByb3ZpZGVkLlxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIG1lbW8gPSBvYmpba2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBkaXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBjcmVhdGVSZWR1Y2UoMSk7XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gY3JlYXRlUmVkdWNlKC0xKTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIga2V5O1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBrZXkgPSBfLmZpbmRJbmRleChvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IF8uZmluZEtleShvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfVxuICAgIGlmIChrZXkgIT09IHZvaWQgMCAmJiBrZXkgIT09IC0xKSByZXR1cm4gb2JqW2tleV07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIF8ucmVqZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm5lZ2F0ZShjYihwcmVkaWNhdGUpKSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKCFwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiBpdGVtICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVzYCBhbmQgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlcyA9IF8uaW5jbHVkZSA9IGZ1bmN0aW9uKG9iaiwgaXRlbSwgZnJvbUluZGV4LCBndWFyZCkge1xuICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICBpZiAodHlwZW9mIGZyb21JbmRleCAhPSAnbnVtYmVyJyB8fCBndWFyZCkgZnJvbUluZGV4ID0gMDtcbiAgICByZXR1cm4gXy5pbmRleE9mKG9iaiwgaXRlbSwgZnJvbUluZGV4KSA+PSAwO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGlzRnVuYyA9IF8uaXNGdW5jdGlvbihtZXRob2QpO1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgZnVuYyA9IGlzRnVuYyA/IG1ldGhvZCA6IHZhbHVlW21ldGhvZF07XG4gICAgICByZXR1cm4gZnVuYyA9PSBudWxsID8gZnVuYyA6IGZ1bmMuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYG1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIF8ucGx1Y2sgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBfLm1hcChvYmosIF8ucHJvcGVydHkoa2V5KSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmluZChvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlID4gcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IC1JbmZpbml0eSAmJiByZXN1bHQgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWluID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBJbmZpbml0eSwgbGFzdENvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPCByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA8IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gSW5maW5pdHkgJiYgcmVzdWx0ID09PSBJbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGEgY29sbGVjdGlvbiwgdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBzZXQgPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gc2V0Lmxlbmd0aDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgcmFuZDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbSgwLCBpbmRleCk7XG4gICAgICBpZiAocmFuZCAhPT0gaW5kZXgpIHNodWZmbGVkW2luZGV4XSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSBzZXRbaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gU2FtcGxlICoqbioqIHJhbmRvbSB2YWx1ZXMgZnJvbSBhIGNvbGxlY3Rpb24uXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYG1hcGAuXG4gIF8uc2FtcGxlID0gZnVuY3Rpb24ob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICAgIHJldHVybiBvYmpbXy5yYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uc2h1ZmZsZShvYmopLnNsaWNlKDAsIE1hdGgubWF4KDAsIG4pKTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0ZWUuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCAtIHJpZ2h0LmluZGV4O1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKGJlaGF2aW9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBrZXkgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICAgIGJlaGF2aW9yKHJlc3VsdCwgdmFsdWUsIGtleSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBHcm91cHMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbi4gUGFzcyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlXG4gIC8vIHRvIGdyb3VwIGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3JpdGVyaW9uLlxuICBfLmdyb3VwQnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XS5wdXNoKHZhbHVlKTsgZWxzZSByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0rKzsgZWxzZSByZXN1bHRba2V5XSA9IDE7XG4gIH0pO1xuXG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIF8udG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iaikgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIFNwbGl0IGEgY29sbGVjdGlvbiBpbnRvIHR3byBhcnJheXM6IG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgc2F0aXNmeSB0aGUgZ2l2ZW5cbiAgLy8gcHJlZGljYXRlLCBhbmQgb25lIHdob3NlIGVsZW1lbnRzIGFsbCBkbyBub3Qgc2F0aXNmeSB0aGUgcHJlZGljYXRlLlxuICBfLnBhcnRpdGlvbiA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgcGFzcyA9IFtdLCBmYWlsID0gW107XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7XG4gICAgICAocHJlZGljYXRlKHZhbHVlLCBrZXksIG9iaikgPyBwYXNzIDogZmFpbCkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtwYXNzLCBmYWlsXTtcbiAgfTtcblxuICAvLyBBcnJheSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYGhlYWRgIGFuZCBgdGFrZWAuIFRoZSAqKmd1YXJkKiogY2hlY2tcbiAgLy8gYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gXy50YWtlID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIHJldHVybiBfLmluaXRpYWwoYXJyYXksIGFycmF5Lmxlbmd0aCAtIG4pO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gKG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKSkpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBfLnJlc3QoYXJyYXksIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIG4pKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIHN0cmljdCwgc3RhcnRJbmRleCkge1xuICAgIHZhciBvdXRwdXQgPSBbXSwgaWR4ID0gMDtcbiAgICBmb3IgKHZhciBpID0gc3RhcnRJbmRleCB8fCAwLCBsZW5ndGggPSBnZXRMZW5ndGgoaW5wdXQpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGlucHV0W2ldO1xuICAgICAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJiAoXy5pc0FycmF5KHZhbHVlKSB8fCBfLmlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICAgICAgLy9mbGF0dGVuIGN1cnJlbnQgbGV2ZWwgb2YgYXJyYXkgb3IgYXJndW1lbnRzIG9iamVjdFxuICAgICAgICBpZiAoIXNoYWxsb3cpIHZhbHVlID0gZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgc3RyaWN0KTtcbiAgICAgICAgdmFyIGogPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgIG91dHB1dC5sZW5ndGggKz0gbGVuO1xuICAgICAgICB3aGlsZSAoaiA8IGxlbikge1xuICAgICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZVtqKytdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFzdHJpY3QpIHtcbiAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIEZsYXR0ZW4gb3V0IGFuIGFycmF5LCBlaXRoZXIgcmVjdXJzaXZlbHkgKGJ5IGRlZmF1bHQpLCBvciBqdXN0IG9uZSBsZXZlbC5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgZmFsc2UpO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdGVlO1xuICAgICAgaXRlcmF0ZWUgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpdGVyYXRlZSAhPSBudWxsKSBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXSxcbiAgICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUsIGksIGFycmF5KSA6IHZhbHVlO1xuICAgICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICAgIGlmICghaSB8fCBzZWVuICE9PSBjb21wdXRlZCkgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICBzZWVuID0gY29tcHV0ZWQ7XG4gICAgICB9IGVsc2UgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhzZWVuLCBjb21wdXRlZCkpIHtcbiAgICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghXy5jb250YWlucyhyZXN1bHQsIHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGl0ZW0gPSBhcnJheVtpXTtcbiAgICAgIGlmIChfLmNvbnRhaW5zKHJlc3VsdCwgaXRlbSkpIGNvbnRpbnVlO1xuICAgICAgZm9yICh2YXIgaiA9IDE7IGogPCBhcmdzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKGFyZ3VtZW50c1tqXSwgaXRlbSkpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKGogPT09IGFyZ3NMZW5ndGgpIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFRha2UgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBvbmUgYXJyYXkgYW5kIGEgbnVtYmVyIG9mIG90aGVyIGFycmF5cy5cbiAgLy8gT25seSB0aGUgZWxlbWVudHMgcHJlc2VudCBpbiBqdXN0IHRoZSBmaXJzdCBhcnJheSB3aWxsIHJlbWFpbi5cbiAgXy5kaWZmZXJlbmNlID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IGZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bnppcChhcmd1bWVudHMpO1xuICB9O1xuXG4gIC8vIENvbXBsZW1lbnQgb2YgXy56aXAuIFVuemlwIGFjY2VwdHMgYW4gYXJyYXkgb2YgYXJyYXlzIGFuZCBncm91cHNcbiAgLy8gZWFjaCBhcnJheSdzIGVsZW1lbnRzIG9uIHNoYXJlZCBpbmRpY2VzXG4gIF8udW56aXAgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSAmJiBfLm1heChhcnJheSwgZ2V0TGVuZ3RoKS5sZW5ndGggfHwgMDtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBfLnBsdWNrKGFycmF5LCBpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGxpc3QpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBmaW5kSW5kZXggYW5kIGZpbmRMYXN0SW5kZXggZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKGRpcikge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICB2YXIgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSByZXR1cm4gaW5kZXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGluZGV4IG9uIGFuIGFycmF5LWxpa2UgdGhhdCBwYXNzZXMgYSBwcmVkaWNhdGUgdGVzdFxuICBfLmZpbmRJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKDEpO1xuICBfLmZpbmRMYXN0SW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigtMSk7XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdGVlKG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gTWF0aC5mbG9vcigobG93ICsgaGlnaCkgLyAyKTtcbiAgICAgIGlmIChpdGVyYXRlZShhcnJheVttaWRdKSA8IHZhbHVlKSBsb3cgPSBtaWQgKyAxOyBlbHNlIGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgaW5kZXhPZiBhbmQgbGFzdEluZGV4T2YgZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZUluZGV4RmluZGVyKGRpciwgcHJlZGljYXRlRmluZCwgc29ydGVkSW5kZXgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlkeCkge1xuICAgICAgdmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgaWYgKHR5cGVvZiBpZHggPT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKGRpciA+IDApIHtcbiAgICAgICAgICAgIGkgPSBpZHggPj0gMCA/IGlkeCA6IE1hdGgubWF4KGlkeCArIGxlbmd0aCwgaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZW5ndGggPSBpZHggPj0gMCA/IE1hdGgubWluKGlkeCArIDEsIGxlbmd0aCkgOiBpZHggKyBsZW5ndGggKyAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNvcnRlZEluZGV4ICYmIGlkeCAmJiBsZW5ndGgpIHtcbiAgICAgICAgaWR4ID0gc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaWR4XSA9PT0gaXRlbSA/IGlkeCA6IC0xO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0gIT09IGl0ZW0pIHtcbiAgICAgICAgaWR4ID0gcHJlZGljYXRlRmluZChzbGljZS5jYWxsKGFycmF5LCBpLCBsZW5ndGgpLCBfLmlzTmFOKTtcbiAgICAgICAgcmV0dXJuIGlkeCA+PSAwID8gaWR4ICsgaSA6IC0xO1xuICAgICAgfVxuICAgICAgZm9yIChpZHggPSBkaXIgPiAwID8gaSA6IGxlbmd0aCAtIDE7IGlkeCA+PSAwICYmIGlkeCA8IGxlbmd0aDsgaWR4ICs9IGRpcikge1xuICAgICAgICBpZiAoYXJyYXlbaWR4XSA9PT0gaXRlbSkgcmV0dXJuIGlkeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhbiBpdGVtIGluIGFuIGFycmF5LFxuICAvLyBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgXy5pbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoMSwgXy5maW5kSW5kZXgsIF8uc29ydGVkSW5kZXgpO1xuICBfLmxhc3RJbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoLTEsIF8uZmluZExhc3RJbmRleCk7XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoc3RvcCA9PSBudWxsKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IHN0ZXAgfHwgMTtcblxuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIHJhbmdlID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxlbmd0aDsgaWR4KyssIHN0YXJ0ICs9IHN0ZXApIHtcbiAgICAgIHJhbmdlW2lkeF0gPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZXhlY3V0ZSBhIGZ1bmN0aW9uIGFzIGEgY29uc3RydWN0b3JcbiAgLy8gb3IgYSBub3JtYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnRzXG4gIHZhciBleGVjdXRlQm91bmQgPSBmdW5jdGlvbihzb3VyY2VGdW5jLCBib3VuZEZ1bmMsIGNvbnRleHQsIGNhbGxpbmdDb250ZXh0LCBhcmdzKSB7XG4gICAgaWYgKCEoY2FsbGluZ0NvbnRleHQgaW5zdGFuY2VvZiBib3VuZEZ1bmMpKSByZXR1cm4gc291cmNlRnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB2YXIgc2VsZiA9IGJhc2VDcmVhdGUoc291cmNlRnVuYy5wcm90b3R5cGUpO1xuICAgIHZhciByZXN1bHQgPSBzb3VyY2VGdW5jLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIGlmIChfLmlzT2JqZWN0KHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICBfLmJpbmQgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdCaW5kIG11c3QgYmUgY2FsbGVkIG9uIGEgZnVuY3Rpb24nKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIGNvbnRleHQsIHRoaXMsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuIF8gYWN0c1xuICAvLyBhcyBhIHBsYWNlaG9sZGVyLCBhbGxvd2luZyBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzIHRvIGJlIHByZS1maWxsZWQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYm91bmRBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMCwgbGVuZ3RoID0gYm91bmRBcmdzLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkobGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJnc1tpXSA9IGJvdW5kQXJnc1tpXSA9PT0gXyA/IGFyZ3VtZW50c1twb3NpdGlvbisrXSA6IGJvdW5kQXJnc1tpXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgdGhpcywgdGhpcywgYXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gQmluZCBhIG51bWJlciBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBSZW1haW5pbmcgYXJndW1lbnRzXG4gIC8vIGFyZSB0aGUgbWV0aG9kIG5hbWVzIHRvIGJlIGJvdW5kLiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXQgYWxsIGNhbGxiYWNrc1xuICAvLyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIF8uYmluZEFsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLCBrZXk7XG4gICAgaWYgKGxlbmd0aCA8PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXMnKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIG9ialtrZXldID0gXy5iaW5kKG9ialtrZXldLCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vaXplID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgY2FjaGUgPSBtZW1vaXplLmNhY2hlO1xuICAgICAgdmFyIGFkZHJlc3MgPSAnJyArIChoYXNoZXIgPyBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGtleSk7XG4gICAgICBpZiAoIV8uaGFzKGNhY2hlLCBhZGRyZXNzKSkgY2FjaGVbYWRkcmVzc10gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gY2FjaGVbYWRkcmVzc107XG4gICAgfTtcbiAgICBtZW1vaXplLmNhY2hlID0ge307XG4gICAgcmV0dXJuIG1lbW9pemU7XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gXy5wYXJ0aWFsKF8uZGVsYXksIF8sIDEpO1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IF8ubm93KCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBfLm5vdygpO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGFzdCA9IF8ubm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICAgIGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID49IDApIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGltZXN0YW1wID0gXy5ub3coKTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIF8ucGFydGlhbCh3cmFwcGVyLCBmdW5jKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgbmVnYXRlZCB2ZXJzaW9uIG9mIHRoZSBwYXNzZWQtaW4gcHJlZGljYXRlLlxuICBfLm5lZ2F0ZSA9IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBfLmNvbXBvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgc3RhcnQgPSBhcmdzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGkgPSBzdGFydDtcbiAgICAgIHZhciByZXN1bHQgPSBhcmdzW3N0YXJ0XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgd2hpbGUgKGktLSkgcmVzdWx0ID0gYXJnc1tpXS5jYWxsKHRoaXMsIHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIG9uIGFuZCBhZnRlciB0aGUgTnRoIGNhbGwuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIHVwIHRvIChidXQgbm90IGluY2x1ZGluZykgdGhlIE50aCBjYWxsLlxuICBfLmJlZm9yZSA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgdmFyIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPiAwKSB7XG4gICAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICBpZiAodGltZXMgPD0gMSkgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBfLnBhcnRpYWwoXy5iZWZvcmUsIDIpO1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEtleXMgaW4gSUUgPCA5IHRoYXQgd29uJ3QgYmUgaXRlcmF0ZWQgYnkgYGZvciBrZXkgaW4gLi4uYCBhbmQgdGh1cyBtaXNzZWQuXG4gIHZhciBoYXNFbnVtQnVnID0gIXt0b1N0cmluZzogbnVsbH0ucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG4gIHZhciBub25FbnVtZXJhYmxlUHJvcHMgPSBbJ3ZhbHVlT2YnLCAnaXNQcm90b3R5cGVPZicsICd0b1N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJ2hhc093blByb3BlcnR5JywgJ3RvTG9jYWxlU3RyaW5nJ107XG5cbiAgZnVuY3Rpb24gY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpIHtcbiAgICB2YXIgbm9uRW51bUlkeCA9IG5vbkVudW1lcmFibGVQcm9wcy5sZW5ndGg7XG4gICAgdmFyIGNvbnN0cnVjdG9yID0gb2JqLmNvbnN0cnVjdG9yO1xuICAgIHZhciBwcm90byA9IChfLmlzRnVuY3Rpb24oY29uc3RydWN0b3IpICYmIGNvbnN0cnVjdG9yLnByb3RvdHlwZSkgfHwgT2JqUHJvdG87XG5cbiAgICAvLyBDb25zdHJ1Y3RvciBpcyBhIHNwZWNpYWwgY2FzZS5cbiAgICB2YXIgcHJvcCA9ICdjb25zdHJ1Y3Rvcic7XG4gICAgaWYgKF8uaGFzKG9iaiwgcHJvcCkgJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIGtleXMucHVzaChwcm9wKTtcblxuICAgIHdoaWxlIChub25FbnVtSWR4LS0pIHtcbiAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbm9uRW51bUlkeF07XG4gICAgICBpZiAocHJvcCBpbiBvYmogJiYgb2JqW3Byb3BdICE9PSBwcm90b1twcm9wXSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkge1xuICAgICAgICBrZXlzLnB1c2gocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgaWYgKG5hdGl2ZUtleXMpIHJldHVybiBuYXRpdmVLZXlzKG9iaik7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSBhbGwgdGhlIHByb3BlcnR5IG5hbWVzIG9mIGFuIG9iamVjdC5cbiAgXy5hbGxLZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0gPSBvYmpba2V5c1tpXV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50IG9mIHRoZSBvYmplY3RcbiAgLy8gSW4gY29udHJhc3QgdG8gXy5tYXAgaXQgcmV0dXJucyBhbiBvYmplY3RcbiAgXy5tYXBPYmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGgsXG4gICAgICAgICAgcmVzdWx0cyA9IHt9LFxuICAgICAgICAgIGN1cnJlbnRLZXk7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGN1cnJlbnRLZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgICAgcmVzdWx0c1tjdXJyZW50S2V5XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBwYWlyc1tpXSA9IFtrZXlzW2ldLCBvYmpba2V5c1tpXV1dO1xuICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbb2JqW2tleXNbaV1dXSA9IGtleXNbaV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYFxuICBfLmZ1bmN0aW9ucyA9IF8ubWV0aG9kcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBuYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzKTtcblxuICAvLyBBc3NpZ25zIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBvd24gcHJvcGVydGllcyBpbiB0aGUgcGFzc2VkLWluIG9iamVjdChzKVxuICAvLyAoaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnbilcbiAgXy5leHRlbmRPd24gPSBfLmFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKF8ua2V5cyk7XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3Qga2V5IG9uIGFuIG9iamVjdCB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEtleSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopLCBrZXk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtrZXldLCBrZXksIG9iaikpIHJldHVybiBrZXk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iamVjdCwgb2l0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9LCBvYmogPSBvYmplY3QsIGl0ZXJhdGVlLCBrZXlzO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKG9pdGVyYXRlZSkpIHtcbiAgICAgIGtleXMgPSBfLmFsbEtleXMob2JqKTtcbiAgICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihvaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXlzID0gZmxhdHRlbihhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgMSk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikgeyByZXR1cm4ga2V5IGluIG9iajsgfTtcbiAgICAgIG9iaiA9IE9iamVjdChvYmopO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIGlmIChpdGVyYXRlZSh2YWx1ZSwga2V5LCBvYmopKSByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXRlcmF0ZWUpKSB7XG4gICAgICBpdGVyYXRlZSA9IF8ubmVnYXRlKGl0ZXJhdGVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLm1hcChmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKSwgU3RyaW5nKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICByZXR1cm4gIV8uY29udGFpbnMoa2V5cywga2V5KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBfLnBpY2sob2JqLCBpdGVyYXRlZSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cywgdHJ1ZSk7XG5cbiAgLy8gQ3JlYXRlcyBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoZSBnaXZlbiBwcm90b3R5cGUgb2JqZWN0LlxuICAvLyBJZiBhZGRpdGlvbmFsIHByb3BlcnRpZXMgYXJlIHByb3ZpZGVkIHRoZW4gdGhleSB3aWxsIGJlIGFkZGVkIHRvIHRoZVxuICAvLyBjcmVhdGVkIG9iamVjdC5cbiAgXy5jcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUsIHByb3BzKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VDcmVhdGUocHJvdG90eXBlKTtcbiAgICBpZiAocHJvcHMpIF8uZXh0ZW5kT3duKHJlc3VsdCwgcHJvcHMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybnMgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmlzTWF0Y2ggPSBmdW5jdGlvbihvYmplY3QsIGF0dHJzKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMoYXR0cnMpLCBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiAhbGVuZ3RoO1xuICAgIHZhciBvYmogPSBPYmplY3Qob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChhdHRyc1trZXldICE9PSBvYmpba2V5XSB8fCAhKGtleSBpbiBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBpc0VxdWFsYC5cbiAgdmFyIGVxID0gZnVuY3Rpb24oYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXG4gICAgLy8gU2VlIHRoZSBbSGFybW9ueSBgZWdhbGAgcHJvcG9zYWxdKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbCkuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT09IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgLy8gU3RyaW5ncywgbnVtYmVycywgcmVndWxhciBleHByZXNzaW9ucywgZGF0ZXMsIGFuZCBib29sZWFucyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgLy8gUmVnRXhwcyBhcmUgY29lcmNlZCB0byBzdHJpbmdzIGZvciBjb21wYXJpc29uIChOb3RlOiAnJyArIC9hL2kgPT09ICcvYS9pJylcbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuICcnICsgYSA9PT0gJycgKyBiO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS5cbiAgICAgICAgLy8gT2JqZWN0KE5hTikgaXMgZXF1aXZhbGVudCB0byBOYU5cbiAgICAgICAgaWYgKCthICE9PSArYSkgcmV0dXJuICtiICE9PSArYjtcbiAgICAgICAgLy8gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvciBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuICthID09PSAwID8gMSAvICthID09PSAxIC8gYiA6ICthID09PSArYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PT0gK2I7XG4gICAgfVxuXG4gICAgdmFyIGFyZUFycmF5cyA9IGNsYXNzTmFtZSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICBpZiAoIWFyZUFycmF5cykge1xuICAgICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIC8vIE9iamVjdHMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1aXZhbGVudCwgYnV0IGBPYmplY3RgcyBvciBgQXJyYXlgc1xuICAgICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICAgIGlmIChhQ3RvciAhPT0gYkN0b3IgJiYgIShfLmlzRnVuY3Rpb24oYUN0b3IpICYmIGFDdG9yIGluc3RhbmNlb2YgYUN0b3IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmICgnY29uc3RydWN0b3InIGluIGEgJiYgJ2NvbnN0cnVjdG9yJyBpbiBiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cblxuICAgIC8vIEluaXRpYWxpemluZyBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICAvLyBJdCdzIGRvbmUgaGVyZSBzaW5jZSB3ZSBvbmx5IG5lZWQgdGhlbSBmb3Igb2JqZWN0cyBhbmQgYXJyYXlzIGNvbXBhcmlzb24uXG4gICAgYVN0YWNrID0gYVN0YWNrIHx8IFtdO1xuICAgIGJTdGFjayA9IGJTdGFjayB8fCBbXTtcbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT09IGI7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuXG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGFyZUFycmF5cykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmICghZXEoYVtsZW5ndGhdLCBiW2xlbmd0aF0sIGFTdGFjaywgYlN0YWNrKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKGEpLCBrZXk7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzIGJlZm9yZSBjb21wYXJpbmcgZGVlcCBlcXVhbGl0eS5cbiAgICAgIGlmIChfLmtleXMoYikubGVuZ3RoICE9PSBsZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXJcbiAgICAgICAga2V5ID0ga2V5c1tsZW5ndGhdO1xuICAgICAgICBpZiAoIShfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYik7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikgJiYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSB8fCBfLmlzQXJndW1lbnRzKG9iaikpKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICByZXR1cm4gXy5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLCBpc0Vycm9yLlxuICBfLmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCcsICdFcnJvciddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUgPCA5KSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5oYXMob2JqLCAnY2FsbGVlJyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS4gV29yayBhcm91bmQgc29tZSB0eXBlb2YgYnVncyBpbiBvbGQgdjgsXG4gIC8vIElFIDExICgjMTYyMSksIGFuZCBpbiBTYWZhcmkgOCAoIzE5MjkpLlxuICBpZiAodHlwZW9mIC8uLyAhPSAnZnVuY3Rpb24nICYmIHR5cGVvZiBJbnQ4QXJyYXkgIT0gJ29iamVjdCcpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09ICdmdW5jdGlvbicgfHwgZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9PSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5XG4gIC8vIG9uIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuXG4gIF8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH07XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSdW4gVW5kZXJzY29yZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzXG4gIC8vIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5fID0gcHJldmlvdXNVbmRlcnNjb3JlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEtlZXAgdGhlIGlkZW50aXR5IGZ1bmN0aW9uIGFyb3VuZCBmb3IgZGVmYXVsdCBpdGVyYXRlZXMuXG4gIF8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvLyBQcmVkaWNhdGUtZ2VuZXJhdGluZyBmdW5jdGlvbnMuIE9mdGVuIHVzZWZ1bCBvdXRzaWRlIG9mIFVuZGVyc2NvcmUuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9O1xuXG4gIF8ubm9vcCA9IGZ1bmN0aW9uKCl7fTtcblxuICBfLnByb3BlcnR5ID0gcHJvcGVydHk7XG5cbiAgLy8gR2VuZXJhdGVzIGEgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gb2JqZWN0IHRoYXQgcmV0dXJucyBhIGdpdmVuIHByb3BlcnR5LlxuICBfLnByb3BlcnR5T2YgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09IG51bGwgPyBmdW5jdGlvbigpe30gOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBwcmVkaWNhdGUgZm9yIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZlxuICAvLyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5tYXRjaGVyID0gXy5tYXRjaGVzID0gZnVuY3Rpb24oYXR0cnMpIHtcbiAgICBhdHRycyA9IF8uZXh0ZW5kT3duKHt9LCBhdHRycyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaXNNYXRjaChvYmosIGF0dHJzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRlZShpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfTtcblxuICAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVzY2FwZU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICdgJzogJyYjeDYwOydcbiAgfTtcbiAgdmFyIHVuZXNjYXBlTWFwID0gXy5pbnZlcnQoZXNjYXBlTWFwKTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIHZhciBjcmVhdGVFc2NhcGVyID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGVzY2FwZXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hcFttYXRjaF07XG4gICAgfTtcbiAgICAvLyBSZWdleGVzIGZvciBpZGVudGlmeWluZyBhIGtleSB0aGF0IG5lZWRzIHRvIGJlIGVzY2FwZWRcbiAgICB2YXIgc291cmNlID0gJyg/OicgKyBfLmtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgICB2YXIgcmVwbGFjZVJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UsICdnJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XG4gICAgfTtcbiAgfTtcbiAgXy5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKGVzY2FwZU1hcCk7XG4gIF8udW5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKHVuZXNjYXBlTWFwKTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCB3aXRoIHRoZVxuICAvLyBgb2JqZWN0YCBhcyBjb250ZXh0OyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5LCBmYWxsYmFjaykge1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdm9pZCAwIDogb2JqZWN0W3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgdmFsdWUgPSBmYWxsYmFjaztcbiAgICB9XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIHZhciBlc2NhcGVDaGFyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07XG4gIH07XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgLy8gTkI6IGBvbGRTZXR0aW5nc2Agb25seSBleGlzdHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgc2V0dGluZ3MsIG9sZFNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncyAmJiBvbGRTZXR0aW5ncykgc2V0dGluZ3MgPSBvbGRTZXR0aW5ncztcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UoZXNjYXBlciwgZXNjYXBlQ2hhcik7XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRvYmUgVk1zIG5lZWQgdGhlIG1hdGNoIHJldHVybmVkIHRvIHByb2R1Y2UgdGhlIGNvcnJlY3Qgb2ZmZXN0LlxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgJ3JldHVybiBfX3A7XFxuJztcblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHZhciBhcmd1bWVudCA9IHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonO1xuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgYXJndW1lbnQgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbi4gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGluc3RhbmNlID0gXyhvYmopO1xuICAgIGluc3RhbmNlLl9jaGFpbiA9IHRydWU7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihpbnN0YW5jZSwgb2JqKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09PSAnc2hpZnQnIHx8IG5hbWUgPT09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICBfLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIFByb3ZpZGUgdW53cmFwcGluZyBwcm94eSBmb3Igc29tZSBtZXRob2RzIHVzZWQgaW4gZW5naW5lIG9wZXJhdGlvbnNcbiAgLy8gc3VjaCBhcyBhcml0aG1ldGljIGFuZCBKU09OIHN0cmluZ2lmaWNhdGlvbi5cbiAgXy5wcm90b3R5cGUudmFsdWVPZiA9IF8ucHJvdG90eXBlLnRvSlNPTiA9IF8ucHJvdG90eXBlLnZhbHVlO1xuXG4gIF8ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICcnICsgdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBBTUQgcmVnaXN0cmF0aW9uIGhhcHBlbnMgYXQgdGhlIGVuZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsb2FkZXJzXG4gIC8vIHRoYXQgbWF5IG5vdCBlbmZvcmNlIG5leHQtdHVybiBzZW1hbnRpY3Mgb24gbW9kdWxlcy4gRXZlbiB0aG91Z2ggZ2VuZXJhbFxuICAvLyBwcmFjdGljZSBmb3IgQU1EIHJlZ2lzdHJhdGlvbiBpcyB0byBiZSBhbm9ueW1vdXMsIHVuZGVyc2NvcmUgcmVnaXN0ZXJzXG4gIC8vIGFzIGEgbmFtZWQgbW9kdWxlIGJlY2F1c2UsIGxpa2UgalF1ZXJ5LCBpdCBpcyBhIGJhc2UgbGlicmFyeSB0aGF0IGlzXG4gIC8vIHBvcHVsYXIgZW5vdWdoIHRvIGJlIGJ1bmRsZWQgaW4gYSB0aGlyZCBwYXJ0eSBsaWIsIGJ1dCBub3QgYmUgcGFydCBvZlxuICAvLyBhbiBBTUQgbG9hZCByZXF1ZXN0LiBUaG9zZSBjYXNlcyBjb3VsZCBnZW5lcmF0ZSBhbiBlcnJvciB3aGVuIGFuXG4gIC8vIGFub255bW91cyBkZWZpbmUoKSBpcyBjYWxsZWQgb3V0c2lkZSBvZiBhIGxvYWRlciByZXF1ZXN0LlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanNcbi8vIG1vZHVsZSBpZCA9IDY5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICogY2xlYXZlLmpzIC0gMC43LjIzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbm9zaXIvY2xlYXZlLmpzXG4gKiBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMFxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMi0yMDE3IE1heCBIdWFuZyBodHRwczovL2dpdGh1Yi5jb20vbm9zaXIvXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLHQpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMuQ2xlYXZlPXQoKTplLkNsZWF2ZT10KCl9KHRoaXMsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdChuKXtpZihyW25dKXJldHVybiByW25dLmV4cG9ydHM7dmFyIGk9cltuXT17ZXhwb3J0czp7fSxpZDpuLGxvYWRlZDohMX07cmV0dXJuIGVbbl0uY2FsbChpLmV4cG9ydHMsaSxpLmV4cG9ydHMsdCksaS5sb2FkZWQ9ITAsaS5leHBvcnRzfXZhciByPXt9O3JldHVybiB0Lm09ZSx0LmM9cix0LnA9XCJcIix0KDApfShbZnVuY3Rpb24oZSx0LHIpeyhmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgbj1mdW5jdGlvbihlLHQpe3ZhciByPXRoaXM7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGU/ci5lbGVtZW50PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZSk6ci5lbGVtZW50PVwidW5kZWZpbmVkXCIhPXR5cGVvZiBlLmxlbmd0aCYmZS5sZW5ndGg+MD9lWzBdOmUsIXIuZWxlbWVudCl0aHJvdyBuZXcgRXJyb3IoXCJbY2xlYXZlLmpzXSBQbGVhc2UgY2hlY2sgdGhlIGVsZW1lbnRcIik7dC5pbml0VmFsdWU9ci5lbGVtZW50LnZhbHVlLHIucHJvcGVydGllcz1uLkRlZmF1bHRQcm9wZXJ0aWVzLmFzc2lnbih7fSx0KSxyLmluaXQoKX07bi5wcm90b3R5cGU9e2luaXQ6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9ZS5wcm9wZXJ0aWVzOyh0Lm51bWVyYWx8fHQucGhvbmV8fHQuY3JlZGl0Q2FyZHx8dC5kYXRlfHwwIT09dC5ibG9ja3NMZW5ndGh8fHQucHJlZml4KSYmKHQubWF4TGVuZ3RoPW4uVXRpbC5nZXRNYXhMZW5ndGgodC5ibG9ja3MpLGUuaXNBbmRyb2lkPW4uVXRpbC5pc0FuZHJvaWQoKSxlLmxhc3RJbnB1dFZhbHVlPVwiXCIsZS5vbkNoYW5nZUxpc3RlbmVyPWUub25DaGFuZ2UuYmluZChlKSxlLm9uS2V5RG93bkxpc3RlbmVyPWUub25LZXlEb3duLmJpbmQoZSksZS5vbkN1dExpc3RlbmVyPWUub25DdXQuYmluZChlKSxlLm9uQ29weUxpc3RlbmVyPWUub25Db3B5LmJpbmQoZSksZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGUub25DaGFuZ2VMaXN0ZW5lciksZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsZS5vbktleURvd25MaXN0ZW5lciksZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjdXRcIixlLm9uQ3V0TGlzdGVuZXIpLGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29weVwiLGUub25Db3B5TGlzdGVuZXIpLGUuaW5pdFBob25lRm9ybWF0dGVyKCksZS5pbml0RGF0ZUZvcm1hdHRlcigpLGUuaW5pdE51bWVyYWxGb3JtYXR0ZXIoKSxlLm9uSW5wdXQodC5pbml0VmFsdWUpKX0saW5pdE51bWVyYWxGb3JtYXR0ZXI6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9ZS5wcm9wZXJ0aWVzO3QubnVtZXJhbCYmKHQubnVtZXJhbEZvcm1hdHRlcj1uZXcgbi5OdW1lcmFsRm9ybWF0dGVyKHQubnVtZXJhbERlY2ltYWxNYXJrLHQubnVtZXJhbEludGVnZXJTY2FsZSx0Lm51bWVyYWxEZWNpbWFsU2NhbGUsdC5udW1lcmFsVGhvdXNhbmRzR3JvdXBTdHlsZSx0Lm51bWVyYWxQb3NpdGl2ZU9ubHksdC5kZWxpbWl0ZXIpKX0saW5pdERhdGVGb3JtYXR0ZXI6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9ZS5wcm9wZXJ0aWVzO3QuZGF0ZSYmKHQuZGF0ZUZvcm1hdHRlcj1uZXcgbi5EYXRlRm9ybWF0dGVyKHQuZGF0ZVBhdHRlcm4pLHQuYmxvY2tzPXQuZGF0ZUZvcm1hdHRlci5nZXRCbG9ja3MoKSx0LmJsb2Nrc0xlbmd0aD10LmJsb2Nrcy5sZW5ndGgsdC5tYXhMZW5ndGg9bi5VdGlsLmdldE1heExlbmd0aCh0LmJsb2NrcykpfSxpbml0UGhvbmVGb3JtYXR0ZXI6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9ZS5wcm9wZXJ0aWVzO2lmKHQucGhvbmUpdHJ5e3QucGhvbmVGb3JtYXR0ZXI9bmV3IG4uUGhvbmVGb3JtYXR0ZXIobmV3IHQucm9vdC5DbGVhdmUuQXNZb3VUeXBlRm9ybWF0dGVyKHQucGhvbmVSZWdpb25Db2RlKSx0LmRlbGltaXRlcil9Y2F0Y2gocil7dGhyb3cgbmV3IEVycm9yKFwiW2NsZWF2ZS5qc10gUGxlYXNlIGluY2x1ZGUgcGhvbmUtdHlwZS1mb3JtYXR0ZXIue2NvdW50cnl9LmpzIGxpYlwiKX19LG9uS2V5RG93bjpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzLGk9ZS53aGljaHx8ZS5rZXlDb2RlLGE9bi5VdGlsLG89dC5lbGVtZW50LnZhbHVlO3JldHVybiBhLmlzQW5kcm9pZEJhY2tzcGFjZUtleWRvd24odC5sYXN0SW5wdXRWYWx1ZSxvKSYmKGk9OCksdC5sYXN0SW5wdXRWYWx1ZT1vLDg9PT1pJiZhLmlzRGVsaW1pdGVyKG8uc2xpY2UoLXIuZGVsaW1pdGVyTGVuZ3RoKSxyLmRlbGltaXRlcixyLmRlbGltaXRlcnMpP3ZvaWQoci5iYWNrc3BhY2U9ITApOnZvaWQoci5iYWNrc3BhY2U9ITEpfSxvbkNoYW5nZTpmdW5jdGlvbigpe3RoaXMub25JbnB1dCh0aGlzLmVsZW1lbnQudmFsdWUpfSxvbkN1dDpmdW5jdGlvbihlKXt0aGlzLmNvcHlDbGlwYm9hcmREYXRhKGUpLHRoaXMub25JbnB1dChcIlwiKX0sb25Db3B5OmZ1bmN0aW9uKGUpe3RoaXMuY29weUNsaXBib2FyZERhdGEoZSl9LGNvcHlDbGlwYm9hcmREYXRhOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMscj10LnByb3BlcnRpZXMsaT1uLlV0aWwsYT10LmVsZW1lbnQudmFsdWUsbz1cIlwiO289ci5jb3B5RGVsaW1pdGVyP2E6aS5zdHJpcERlbGltaXRlcnMoYSxyLmRlbGltaXRlcixyLmRlbGltaXRlcnMpO3RyeXtlLmNsaXBib2FyZERhdGE/ZS5jbGlwYm9hcmREYXRhLnNldERhdGEoXCJUZXh0XCIsbyk6d2luZG93LmNsaXBib2FyZERhdGEuc2V0RGF0YShcIlRleHRcIixvKSxlLnByZXZlbnREZWZhdWx0KCl9Y2F0Y2gobCl7fX0sb25JbnB1dDpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzLGk9ZSxhPW4uVXRpbDtyZXR1cm4gci5udW1lcmFsfHwhci5iYWNrc3BhY2V8fGEuaXNEZWxpbWl0ZXIoZS5zbGljZSgtci5kZWxpbWl0ZXJMZW5ndGgpLHIuZGVsaW1pdGVyLHIuZGVsaW1pdGVycyl8fChlPWEuaGVhZFN0cihlLGUubGVuZ3RoLXIuZGVsaW1pdGVyTGVuZ3RoKSksci5waG9uZT8oci5yZXN1bHQ9ci5waG9uZUZvcm1hdHRlci5mb3JtYXQoZSksdm9pZCB0LnVwZGF0ZVZhbHVlU3RhdGUoKSk6ci5udW1lcmFsPyhyLnJlc3VsdD1yLnByZWZpeCtyLm51bWVyYWxGb3JtYXR0ZXIuZm9ybWF0KGUpLHZvaWQgdC51cGRhdGVWYWx1ZVN0YXRlKCkpOihyLmRhdGUmJihlPXIuZGF0ZUZvcm1hdHRlci5nZXRWYWxpZGF0ZWREYXRlKGUpKSxlPWEuc3RyaXBEZWxpbWl0ZXJzKGUsci5kZWxpbWl0ZXIsci5kZWxpbWl0ZXJzKSxlPWEuZ2V0UHJlZml4U3RyaXBwZWRWYWx1ZShlLHIucHJlZml4LHIucHJlZml4TGVuZ3RoKSxlPXIubnVtZXJpY09ubHk/YS5zdHJpcChlLC9bXlxcZF0vZyk6ZSxlPXIudXBwZXJjYXNlP2UudG9VcHBlckNhc2UoKTplLGU9ci5sb3dlcmNhc2U/ZS50b0xvd2VyQ2FzZSgpOmUsci5wcmVmaXgmJihlPXIucHJlZml4K2UsMD09PXIuYmxvY2tzTGVuZ3RoKT8oci5yZXN1bHQ9ZSx2b2lkIHQudXBkYXRlVmFsdWVTdGF0ZSgpKTooci5jcmVkaXRDYXJkJiZ0LnVwZGF0ZUNyZWRpdENhcmRQcm9wc0J5VmFsdWUoZSksZT1hLmhlYWRTdHIoZSxyLm1heExlbmd0aCksci5yZXN1bHQ9YS5nZXRGb3JtYXR0ZWRWYWx1ZShlLHIuYmxvY2tzLHIuYmxvY2tzTGVuZ3RoLHIuZGVsaW1pdGVyLHIuZGVsaW1pdGVycyksdm9pZChpPT09ci5yZXN1bHQmJmkhPT1yLnByZWZpeHx8dC51cGRhdGVWYWx1ZVN0YXRlKCkpKSl9LHVwZGF0ZUNyZWRpdENhcmRQcm9wc0J5VmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQscj10aGlzLGk9ci5wcm9wZXJ0aWVzLGE9bi5VdGlsO2EuaGVhZFN0cihpLnJlc3VsdCw0KSE9PWEuaGVhZFN0cihlLDQpJiYodD1uLkNyZWRpdENhcmREZXRlY3Rvci5nZXRJbmZvKGUsaS5jcmVkaXRDYXJkU3RyaWN0TW9kZSksaS5ibG9ja3M9dC5ibG9ja3MsaS5ibG9ja3NMZW5ndGg9aS5ibG9ja3MubGVuZ3RoLGkubWF4TGVuZ3RoPWEuZ2V0TWF4TGVuZ3RoKGkuYmxvY2tzKSxpLmNyZWRpdENhcmRUeXBlIT09dC50eXBlJiYoaS5jcmVkaXRDYXJkVHlwZT10LnR5cGUsaS5vbkNyZWRpdENhcmRUeXBlQ2hhbmdlZC5jYWxsKHIsaS5jcmVkaXRDYXJkVHlwZSkpKX0sdXBkYXRlVmFsdWVTdGF0ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXM7cmV0dXJuIGUuaXNBbmRyb2lkP3ZvaWQgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtlLmVsZW1lbnQudmFsdWU9ZS5wcm9wZXJ0aWVzLnJlc3VsdH0sMSk6dm9pZChlLmVsZW1lbnQudmFsdWU9ZS5wcm9wZXJ0aWVzLnJlc3VsdCl9LHNldFBob25lUmVnaW9uQ29kZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzO3IucGhvbmVSZWdpb25Db2RlPWUsdC5pbml0UGhvbmVGb3JtYXR0ZXIoKSx0Lm9uQ2hhbmdlKCl9LHNldFJhd1ZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMscj10LnByb3BlcnRpZXM7ZT12b2lkIDAhPT1lJiZudWxsIT09ZT9lLnRvU3RyaW5nKCk6XCJcIixyLm51bWVyYWwmJihlPWUucmVwbGFjZShcIi5cIixyLm51bWVyYWxEZWNpbWFsTWFyaykpLHQuZWxlbWVudC52YWx1ZT1lLHQub25JbnB1dChlKX0sZ2V0UmF3VmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9ZS5wcm9wZXJ0aWVzLHI9bi5VdGlsLGk9ZS5lbGVtZW50LnZhbHVlO3JldHVybiB0LnJhd1ZhbHVlVHJpbVByZWZpeCYmKGk9ci5nZXRQcmVmaXhTdHJpcHBlZFZhbHVlKGksdC5wcmVmaXgsdC5wcmVmaXhMZW5ndGgpKSxpPXQubnVtZXJhbD90Lm51bWVyYWxGb3JtYXR0ZXIuZ2V0UmF3VmFsdWUoaSk6ci5zdHJpcERlbGltaXRlcnMoaSx0LmRlbGltaXRlcix0LmRlbGltaXRlcnMpfSxnZXRGb3JtYXR0ZWRWYWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmVsZW1lbnQudmFsdWV9LGRlc3Ryb3k6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2UuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiaW5wdXRcIixlLm9uQ2hhbmdlTGlzdGVuZXIpLGUuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLGUub25LZXlEb3duTGlzdGVuZXIpLGUuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY3V0XCIsZS5vbkN1dExpc3RlbmVyKSxlLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvcHlcIixlLm9uQ29weUxpc3RlbmVyKX0sdG9TdHJpbmc6ZnVuY3Rpb24oKXtyZXR1cm5cIltDbGVhdmUgT2JqZWN0XVwifX0sbi5OdW1lcmFsRm9ybWF0dGVyPXIoMSksbi5EYXRlRm9ybWF0dGVyPXIoMiksbi5QaG9uZUZvcm1hdHRlcj1yKDMpLG4uQ3JlZGl0Q2FyZERldGVjdG9yPXIoNCksbi5VdGlsPXIoNSksbi5EZWZhdWx0UHJvcGVydGllcz1yKDYpLChcIm9iamVjdFwiPT10eXBlb2YgdCYmdD90OndpbmRvdykuQ2xlYXZlPW4sZS5leHBvcnRzPW59KS5jYWxsKHQsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZnVuY3Rpb24oZSx0LG4saSxhLG8pe3ZhciBsPXRoaXM7bC5udW1lcmFsRGVjaW1hbE1hcms9ZXx8XCIuXCIsbC5udW1lcmFsSW50ZWdlclNjYWxlPXQ+PTA/dDoxMCxsLm51bWVyYWxEZWNpbWFsU2NhbGU9bj49MD9uOjIsbC5udW1lcmFsVGhvdXNhbmRzR3JvdXBTdHlsZT1pfHxyLmdyb3VwU3R5bGUudGhvdXNhbmQsbC5udW1lcmFsUG9zaXRpdmVPbmx5PSEhYSxsLmRlbGltaXRlcj1vfHxcIlwiPT09bz9vOlwiLFwiLGwuZGVsaW1pdGVyUkU9bz9uZXcgUmVnRXhwKFwiXFxcXFwiK28sXCJnXCIpOlwiXCJ9O3IuZ3JvdXBTdHlsZT17dGhvdXNhbmQ6XCJ0aG91c2FuZFwiLGxha2g6XCJsYWtoXCIsd2FuOlwid2FuXCJ9LHIucHJvdG90eXBlPXtnZXRSYXdWYWx1ZTpmdW5jdGlvbihlKXtyZXR1cm4gZS5yZXBsYWNlKHRoaXMuZGVsaW1pdGVyUkUsXCJcIikucmVwbGFjZSh0aGlzLm51bWVyYWxEZWNpbWFsTWFyayxcIi5cIil9LGZvcm1hdDpmdW5jdGlvbihlKXt2YXIgdCxuLGk9dGhpcyxhPVwiXCI7c3dpdGNoKGU9ZS5yZXBsYWNlKC9bQS1aYS16XS9nLFwiXCIpLnJlcGxhY2UoaS5udW1lcmFsRGVjaW1hbE1hcmssXCJNXCIpLnJlcGxhY2UoL1teXFxkTS1dL2csXCJcIikucmVwbGFjZSgvXlxcLS8sXCJOXCIpLnJlcGxhY2UoL1xcLS9nLFwiXCIpLnJlcGxhY2UoXCJOXCIsaS5udW1lcmFsUG9zaXRpdmVPbmx5P1wiXCI6XCItXCIpLnJlcGxhY2UoXCJNXCIsaS5udW1lcmFsRGVjaW1hbE1hcmspLnJlcGxhY2UoL14oLSk/MCsoPz1cXGQpLyxcIiQxXCIpLG49ZSxlLmluZGV4T2YoaS5udW1lcmFsRGVjaW1hbE1hcmspPj0wJiYodD1lLnNwbGl0KGkubnVtZXJhbERlY2ltYWxNYXJrKSxuPXRbMF0sYT1pLm51bWVyYWxEZWNpbWFsTWFyayt0WzFdLnNsaWNlKDAsaS5udW1lcmFsRGVjaW1hbFNjYWxlKSksaS5udW1lcmFsSW50ZWdlclNjYWxlPjAmJihuPW4uc2xpY2UoMCxpLm51bWVyYWxJbnRlZ2VyU2NhbGUrKFwiLVwiPT09ZS5zbGljZSgwLDEpPzE6MCkpKSxpLm51bWVyYWxUaG91c2FuZHNHcm91cFN0eWxlKXtjYXNlIHIuZ3JvdXBTdHlsZS5sYWtoOm49bi5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGQpK1xcZCQpL2csXCIkMVwiK2kuZGVsaW1pdGVyKTticmVhaztjYXNlIHIuZ3JvdXBTdHlsZS53YW46bj1uLnJlcGxhY2UoLyhcXGQpKD89KFxcZHs0fSkrJCkvZyxcIiQxXCIraS5kZWxpbWl0ZXIpO2JyZWFrO2RlZmF1bHQ6bj1uLnJlcGxhY2UoLyhcXGQpKD89KFxcZHszfSkrJCkvZyxcIiQxXCIraS5kZWxpbWl0ZXIpfXJldHVybiBuLnRvU3RyaW5nKCkrKGkubnVtZXJhbERlY2ltYWxTY2FsZT4wP2EudG9TdHJpbmcoKTpcIlwiKX19LGUuZXhwb3J0cz1yfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO3ZhciByPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7dC5ibG9ja3M9W10sdC5kYXRlUGF0dGVybj1lLHQuaW5pdEJsb2NrcygpfTtyLnByb3RvdHlwZT17aW5pdEJsb2NrczpmdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS5kYXRlUGF0dGVybi5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiWVwiPT09dD9lLmJsb2Nrcy5wdXNoKDQpOmUuYmxvY2tzLnB1c2goMil9KX0sZ2V0QmxvY2tzOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmxvY2tzfSxnZXRWYWxpZGF0ZWREYXRlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMscj1cIlwiO3JldHVybiBlPWUucmVwbGFjZSgvW15cXGRdL2csXCJcIiksdC5ibG9ja3MuZm9yRWFjaChmdW5jdGlvbihuLGkpe2lmKGUubGVuZ3RoPjApe3ZhciBhPWUuc2xpY2UoMCxuKSxvPWEuc2xpY2UoMCwxKSxsPWUuc2xpY2Uobik7c3dpdGNoKHQuZGF0ZVBhdHRlcm5baV0pe2Nhc2VcImRcIjpcIjAwXCI9PT1hP2E9XCIwMVwiOnBhcnNlSW50KG8sMTApPjM/YT1cIjBcIitvOnBhcnNlSW50KGEsMTApPjMxJiYoYT1cIjMxXCIpO2JyZWFrO2Nhc2VcIm1cIjpcIjAwXCI9PT1hP2E9XCIwMVwiOnBhcnNlSW50KG8sMTApPjE/YT1cIjBcIitvOnBhcnNlSW50KGEsMTApPjEyJiYoYT1cIjEyXCIpfXIrPWEsZT1sfX0pLHJ9fSxlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj1mdW5jdGlvbihlLHQpe3ZhciByPXRoaXM7ci5kZWxpbWl0ZXI9dHx8XCJcIj09PXQ/dDpcIiBcIixyLmRlbGltaXRlclJFPXQ/bmV3IFJlZ0V4cChcIlxcXFxcIit0LFwiZ1wiKTpcIlwiLHIuZm9ybWF0dGVyPWV9O3IucHJvdG90eXBlPXtzZXRGb3JtYXR0ZXI6ZnVuY3Rpb24oZSl7dGhpcy5mb3JtYXR0ZXI9ZX0sZm9ybWF0OmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7dC5mb3JtYXR0ZXIuY2xlYXIoKSxlPWUucmVwbGFjZSgvW15cXGQrXS9nLFwiXCIpLGU9ZS5yZXBsYWNlKHQuZGVsaW1pdGVyUkUsXCJcIik7Zm9yKHZhciByLG49XCJcIixpPSExLGE9MCxvPWUubGVuZ3RoO28+YTthKyspcj10LmZvcm1hdHRlci5pbnB1dERpZ2l0KGUuY2hhckF0KGEpKSwvW1xccygpLV0vZy50ZXN0KHIpPyhuPXIsaT0hMCk6aXx8KG49cik7cmV0dXJuIG49bi5yZXBsYWNlKC9bKCldL2csXCJcIiksbj1uLnJlcGxhY2UoL1tcXHMtXS9nLHQuZGVsaW1pdGVyKX19LGUuZXhwb3J0cz1yfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO3ZhciByPXtibG9ja3M6e3VhdHA6WzQsNSw2XSxhbWV4Ols0LDYsNV0sZGluZXJzOls0LDYsNF0sZGlzY292ZXI6WzQsNCw0LDRdLG1hc3RlcmNhcmQ6WzQsNCw0LDRdLGRhbmtvcnQ6WzQsNCw0LDRdLGluc3RhcGF5bWVudDpbNCw0LDQsNF0samNiOls0LDQsNCw0XSxtYWVzdHJvOls0LDQsNCw0XSx2aXNhOls0LDQsNCw0XSxnZW5lcmFsOls0LDQsNCw0XSxnZW5lcmFsU3RyaWN0Ols0LDQsNCw3XX0scmU6e3VhdHA6L14oPyExODAwKTFcXGR7MCwxNH0vLGFtZXg6L14zWzQ3XVxcZHswLDEzfS8sZGlzY292ZXI6L14oPzo2MDExfDY1XFxkezAsMn18NjRbNC05XVxcZD8pXFxkezAsMTJ9LyxkaW5lcnM6L14zKD86MChbMC01XXw5KXxbNjg5XVxcZD8pXFxkezAsMTF9LyxtYXN0ZXJjYXJkOi9eKDVbMS01XXwyWzItN10pXFxkezAsMTR9LyxkYW5rb3J0Oi9eKDUwMTl8NDE3NXw0NTcxKVxcZHswLDEyfS8saW5zdGFwYXltZW50Oi9eNjNbNy05XVxcZHswLDEzfS8samNiOi9eKD86MjEzMXwxODAwfDM1XFxkezAsMn0pXFxkezAsMTJ9LyxtYWVzdHJvOi9eKD86NVswNjc4XVxcZHswLDJ9fDYzMDR8NjdcXGR7MCwyfSlcXGR7MCwxMn0vLHZpc2E6L140XFxkezAsMTV9L30sZ2V0SW5mbzpmdW5jdGlvbihlLHQpe3ZhciBuPXIuYmxvY2tzLGk9ci5yZTtyZXR1cm4gdD0hIXQsaS5hbWV4LnRlc3QoZSk/e3R5cGU6XCJhbWV4XCIsYmxvY2tzOm4uYW1leH06aS51YXRwLnRlc3QoZSk/e3R5cGU6XCJ1YXRwXCIsYmxvY2tzOm4udWF0cH06aS5kaW5lcnMudGVzdChlKT97dHlwZTpcImRpbmVyc1wiLGJsb2NrczpuLmRpbmVyc306aS5kaXNjb3Zlci50ZXN0KGUpP3t0eXBlOlwiZGlzY292ZXJcIixibG9ja3M6dD9uLmdlbmVyYWxTdHJpY3Q6bi5kaXNjb3Zlcn06aS5tYXN0ZXJjYXJkLnRlc3QoZSk/e3R5cGU6XCJtYXN0ZXJjYXJkXCIsYmxvY2tzOm4ubWFzdGVyY2FyZH06aS5kYW5rb3J0LnRlc3QoZSk/e3R5cGU6XCJkYW5rb3J0XCIsYmxvY2tzOm4uZGFua29ydH06aS5pbnN0YXBheW1lbnQudGVzdChlKT97dHlwZTpcImluc3RhcGF5bWVudFwiLGJsb2NrczpuLmluc3RhcGF5bWVudH06aS5qY2IudGVzdChlKT97dHlwZTpcImpjYlwiLGJsb2NrczpuLmpjYn06aS5tYWVzdHJvLnRlc3QoZSk/e3R5cGU6XCJtYWVzdHJvXCIsYmxvY2tzOnQ/bi5nZW5lcmFsU3RyaWN0Om4ubWFlc3Ryb306aS52aXNhLnRlc3QoZSk/e3R5cGU6XCJ2aXNhXCIsYmxvY2tzOnQ/bi5nZW5lcmFsU3RyaWN0Om4udmlzYX06e3R5cGU6XCJ1bmtub3duXCIsYmxvY2tzOnQ/bi5nZW5lcmFsU3RyaWN0Om4uZ2VuZXJhbH19fTtlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj17bm9vcDpmdW5jdGlvbigpe30sc3RyaXA6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5yZXBsYWNlKHQsXCJcIil9LGlzRGVsaW1pdGVyOmZ1bmN0aW9uKGUsdCxyKXtyZXR1cm4gMD09PXIubGVuZ3RoP2U9PT10OnIuc29tZShmdW5jdGlvbih0KXtyZXR1cm4gZT09PXQ/ITA6dm9pZCAwfSl9LGdldERlbGltaXRlclJFQnlEZWxpbWl0ZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBSZWdFeHAoZS5yZXBsYWNlKC8oWy4/KiteJFtcXF1cXFxcKCl7fXwtXSkvZyxcIlxcXFwkMVwiKSxcImdcIil9LHN0cmlwRGVsaW1pdGVyczpmdW5jdGlvbihlLHQscil7dmFyIG49dGhpcztpZigwPT09ci5sZW5ndGgpe3ZhciBpPXQ/bi5nZXREZWxpbWl0ZXJSRUJ5RGVsaW1pdGVyKHQpOlwiXCI7cmV0dXJuIGUucmVwbGFjZShpLFwiXCIpfXJldHVybiByLmZvckVhY2goZnVuY3Rpb24odCl7ZT1lLnJlcGxhY2Uobi5nZXREZWxpbWl0ZXJSRUJ5RGVsaW1pdGVyKHQpLFwiXCIpfSksZX0saGVhZFN0cjpmdW5jdGlvbihlLHQpe3JldHVybiBlLnNsaWNlKDAsdCl9LGdldE1heExlbmd0aDpmdW5jdGlvbihlKXtyZXR1cm4gZS5yZWR1Y2UoZnVuY3Rpb24oZSx0KXtyZXR1cm4gZSt0fSwwKX0sZ2V0UHJlZml4U3RyaXBwZWRWYWx1ZTpmdW5jdGlvbihlLHQscil7aWYoZS5zbGljZSgwLHIpIT09dCl7dmFyIG49dGhpcy5nZXRGaXJzdERpZmZJbmRleCh0LGUuc2xpY2UoMCxyKSk7ZT10K2Uuc2xpY2UobixuKzEpK2Uuc2xpY2UocisxKX1yZXR1cm4gZS5zbGljZShyKX0sZ2V0Rmlyc3REaWZmSW5kZXg6ZnVuY3Rpb24oZSx0KXtmb3IodmFyIHI9MDtlLmNoYXJBdChyKT09PXQuY2hhckF0KHIpOylpZihcIlwiPT09ZS5jaGFyQXQocisrKSlyZXR1cm4tMTtyZXR1cm4gcn0sZ2V0Rm9ybWF0dGVkVmFsdWU6ZnVuY3Rpb24oZSx0LHIsbixpKXt2YXIgYSxvPVwiXCIsbD1pLmxlbmd0aD4wO3JldHVybiAwPT09cj9lOih0LmZvckVhY2goZnVuY3Rpb24odCxzKXtpZihlLmxlbmd0aD4wKXt2YXIgYz1lLnNsaWNlKDAsdCksdT1lLnNsaWNlKHQpO28rPWMsYT1sP2lbc118fGE6bixjLmxlbmd0aD09PXQmJnItMT5zJiYobys9YSksZT11fX0pLG8pfSxpc0FuZHJvaWQ6ZnVuY3Rpb24oKXtyZXR1cm4hKCFuYXZpZ2F0b3J8fCEvYW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpfSxpc0FuZHJvaWRCYWNrc3BhY2VLZXlkb3duOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuaXNBbmRyb2lkKCk/dD09PWUuc2xpY2UoMCwtMSk6ITF9fTtlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXsoZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9e2Fzc2lnbjpmdW5jdGlvbihlLHIpe3JldHVybiBlPWV8fHt9LHI9cnx8e30sZS5jcmVkaXRDYXJkPSEhci5jcmVkaXRDYXJkLGUuY3JlZGl0Q2FyZFN0cmljdE1vZGU9ISFyLmNyZWRpdENhcmRTdHJpY3RNb2RlLGUuY3JlZGl0Q2FyZFR5cGU9XCJcIixlLm9uQ3JlZGl0Q2FyZFR5cGVDaGFuZ2VkPXIub25DcmVkaXRDYXJkVHlwZUNoYW5nZWR8fGZ1bmN0aW9uKCl7fSxlLnBob25lPSEhci5waG9uZSxlLnBob25lUmVnaW9uQ29kZT1yLnBob25lUmVnaW9uQ29kZXx8XCJBVVwiLGUucGhvbmVGb3JtYXR0ZXI9e30sZS5kYXRlPSEhci5kYXRlLGUuZGF0ZVBhdHRlcm49ci5kYXRlUGF0dGVybnx8W1wiZFwiLFwibVwiLFwiWVwiXSxlLmRhdGVGb3JtYXR0ZXI9e30sZS5udW1lcmFsPSEhci5udW1lcmFsLGUubnVtZXJhbEludGVnZXJTY2FsZT1yLm51bWVyYWxJbnRlZ2VyU2NhbGU+PTA/ci5udW1lcmFsSW50ZWdlclNjYWxlOjEwLGUubnVtZXJhbERlY2ltYWxTY2FsZT1yLm51bWVyYWxEZWNpbWFsU2NhbGU+PTA/ci5udW1lcmFsRGVjaW1hbFNjYWxlOjIsZS5udW1lcmFsRGVjaW1hbE1hcms9ci5udW1lcmFsRGVjaW1hbE1hcmt8fFwiLlwiLGUubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGU9ci5udW1lcmFsVGhvdXNhbmRzR3JvdXBTdHlsZXx8XCJ0aG91c2FuZFwiLGUubnVtZXJhbFBvc2l0aXZlT25seT0hIXIubnVtZXJhbFBvc2l0aXZlT25seSxlLm51bWVyaWNPbmx5PWUuY3JlZGl0Q2FyZHx8ZS5kYXRlfHwhIXIubnVtZXJpY09ubHksZS51cHBlcmNhc2U9ISFyLnVwcGVyY2FzZSxlLmxvd2VyY2FzZT0hIXIubG93ZXJjYXNlLGUucHJlZml4PWUuY3JlZGl0Q2FyZHx8ZS5waG9uZXx8ZS5kYXRlP1wiXCI6ci5wcmVmaXh8fFwiXCIsZS5wcmVmaXhMZW5ndGg9ZS5wcmVmaXgubGVuZ3RoLGUucmF3VmFsdWVUcmltUHJlZml4PSEhci5yYXdWYWx1ZVRyaW1QcmVmaXgsZS5jb3B5RGVsaW1pdGVyPSEhci5jb3B5RGVsaW1pdGVyLGUuaW5pdFZhbHVlPXZvaWQgMD09PXIuaW5pdFZhbHVlP1wiXCI6ci5pbml0VmFsdWUudG9TdHJpbmcoKSxlLmRlbGltaXRlcj1yLmRlbGltaXRlcnx8XCJcIj09PXIuZGVsaW1pdGVyP3IuZGVsaW1pdGVyOnIuZGF0ZT9cIi9cIjpyLm51bWVyYWw/XCIsXCI6KHIucGhvbmUsXCIgXCIpLGUuZGVsaW1pdGVyTGVuZ3RoPWUuZGVsaW1pdGVyLmxlbmd0aCxlLmRlbGltaXRlcnM9ci5kZWxpbWl0ZXJzfHxbXSxlLmJsb2Nrcz1yLmJsb2Nrc3x8W10sZS5ibG9ja3NMZW5ndGg9ZS5ibG9ja3MubGVuZ3RoLGUucm9vdD1cIm9iamVjdFwiPT10eXBlb2YgdCYmdD90OndpbmRvdyxlLm1heExlbmd0aD0wLGUuYmFja3NwYWNlPSExLGUucmVzdWx0PVwiXCIsZX19O2UuZXhwb3J0cz1yfSkuY2FsbCh0LGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfV0pfSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY2xlYXZlLmpzL2Rpc3QvY2xlYXZlLm1pbi5qc1xuLy8gbW9kdWxlIGlkID0gNzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiIWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LG4pe3ZhciBlPXQuc3BsaXQoXCIuXCIpLHI9SDtlWzBdaW4gcnx8IXIuZXhlY1NjcmlwdHx8ci5leGVjU2NyaXB0KFwidmFyIFwiK2VbMF0pO2Zvcih2YXIgaTtlLmxlbmd0aCYmKGk9ZS5zaGlmdCgpKTspZS5sZW5ndGh8fHZvaWQgMD09PW4/cj1yW2ldP3JbaV06cltpXT17fTpyW2ldPW59ZnVuY3Rpb24gbih0LG4pe2Z1bmN0aW9uIGUoKXt9ZS5wcm90b3R5cGU9bi5wcm90b3R5cGUsdC5NPW4ucHJvdG90eXBlLHQucHJvdG90eXBlPW5ldyBlLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQsdC5OPWZ1bmN0aW9uKHQsZSxyKXtmb3IodmFyIGk9QXJyYXkoYXJndW1lbnRzLmxlbmd0aC0yKSxhPTI7YTxhcmd1bWVudHMubGVuZ3RoO2ErKylpW2EtMl09YXJndW1lbnRzW2FdO3JldHVybiBuLnByb3RvdHlwZVtlXS5hcHBseSh0LGkpfX1mdW5jdGlvbiBlKHQsbil7bnVsbCE9dCYmdGhpcy5hLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiByKHQpe3QuYj1cIlwifWZ1bmN0aW9uIGkodCxuKXt0LnNvcnQobnx8YSl9ZnVuY3Rpb24gYSh0LG4pe3JldHVybiB0Pm4/MTpuPnQ/LTE6MH1mdW5jdGlvbiBsKHQpe3ZhciBuLGU9W10scj0wO2ZvcihuIGluIHQpZVtyKytdPXRbbl07cmV0dXJuIGV9ZnVuY3Rpb24gbyh0LG4pe3RoaXMuYj10LHRoaXMuYT17fTtmb3IodmFyIGU9MDtlPG4ubGVuZ3RoO2UrKyl7dmFyIHI9bltlXTt0aGlzLmFbci5iXT1yfX1mdW5jdGlvbiB1KHQpe3JldHVybiB0PWwodC5hKSxpKHQsZnVuY3Rpb24odCxuKXtyZXR1cm4gdC5iLW4uYn0pLHR9ZnVuY3Rpb24gcyh0LG4pe3N3aXRjaCh0aGlzLmI9dCx0aGlzLmc9ISFuLkcsdGhpcy5hPW4uYyx0aGlzLmo9bi50eXBlLHRoaXMuaD0hMSx0aGlzLmEpe2Nhc2UgcTpjYXNlIEo6Y2FzZSBMOmNhc2UgTzpjYXNlIGs6Y2FzZSBZOmNhc2UgSzp0aGlzLmg9ITB9dGhpcy5mPW4uZGVmYXVsdFZhbHVlfWZ1bmN0aW9uIGYoKXt0aGlzLmE9e30sdGhpcy5mPXRoaXMuaSgpLmEsdGhpcy5iPXRoaXMuZz1udWxsfWZ1bmN0aW9uIHAodCxuKXtmb3IodmFyIGU9dSh0LmkoKSkscj0wO3I8ZS5sZW5ndGg7cisrKXt2YXIgaT1lW3JdLGE9aS5iO2lmKG51bGwhPW4uYVthXSl7dC5iJiZkZWxldGUgdC5iW2kuYl07dmFyIGw9MTE9PWkuYXx8MTA9PWkuYTtpZihpLmcpZm9yKHZhciBpPWMobixhKXx8W10sbz0wO288aS5sZW5ndGg7bysrKXt2YXIgcz10LGY9YSxoPWw/aVtvXS5jbG9uZSgpOmlbb107cy5hW2ZdfHwocy5hW2ZdPVtdKSxzLmFbZl0ucHVzaChoKSxzLmImJmRlbGV0ZSBzLmJbZl19ZWxzZSBpPWMobixhKSxsPyhsPWModCxhKSk/cChsLGkpOm0odCxhLGkuY2xvbmUoKSk6bSh0LGEsaSl9fX1mdW5jdGlvbiBjKHQsbil7dmFyIGU9dC5hW25dO2lmKG51bGw9PWUpcmV0dXJuIG51bGw7aWYodC5nKXtpZighKG4gaW4gdC5iKSl7dmFyIHI9dC5nLGk9dC5mW25dO2lmKG51bGwhPWUpaWYoaS5nKXtmb3IodmFyIGE9W10sbD0wO2w8ZS5sZW5ndGg7bCsrKWFbbF09ci5iKGksZVtsXSk7ZT1hfWVsc2UgZT1yLmIoaSxlKTtyZXR1cm4gdC5iW25dPWV9cmV0dXJuIHQuYltuXX1yZXR1cm4gZX1mdW5jdGlvbiBoKHQsbixlKXt2YXIgcj1jKHQsbik7cmV0dXJuIHQuZltuXS5nP3JbZXx8MF06cn1mdW5jdGlvbiBnKHQsbil7dmFyIGU7aWYobnVsbCE9dC5hW25dKWU9aCh0LG4sdm9pZCAwKTtlbHNlIHQ6e2lmKGU9dC5mW25dLHZvaWQgMD09PWUuZil7dmFyIHI9ZS5qO2lmKHI9PT1Cb29sZWFuKWUuZj0hMTtlbHNlIGlmKHI9PT1OdW1iZXIpZS5mPTA7ZWxzZXtpZihyIT09U3RyaW5nKXtlPW5ldyByO2JyZWFrIHR9ZS5mPWUuaD9cIjBcIjpcIlwifX1lPWUuZn1yZXR1cm4gZX1mdW5jdGlvbiBiKHQsbil7cmV0dXJuIHQuZltuXS5nP251bGwhPXQuYVtuXT90LmFbbl0ubGVuZ3RoOjA6bnVsbCE9dC5hW25dPzE6MH1mdW5jdGlvbiBtKHQsbixlKXt0LmFbbl09ZSx0LmImJih0LmJbbl09ZSl9ZnVuY3Rpb24geSh0LG4pe3ZhciBlLHI9W107Zm9yKGUgaW4gbikwIT1lJiZyLnB1c2gobmV3IHMoZSxuW2VdKSk7cmV0dXJuIG5ldyBvKHQscil9LypcblxuIFByb3RvY29sIEJ1ZmZlciAyIENvcHlyaWdodCAyMDA4IEdvb2dsZSBJbmMuXG4gQWxsIG90aGVyIGNvZGUgY29weXJpZ2h0IGl0cyByZXNwZWN0aXZlIG93bmVycy5cbiBDb3B5cmlnaHQgKEMpIDIwMTAgVGhlIExpYnBob25lbnVtYmVyIEF1dGhvcnNcblxuIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5mdW5jdGlvbiB2KCl7Zi5jYWxsKHRoaXMpfWZ1bmN0aW9uIGQoKXtmLmNhbGwodGhpcyl9ZnVuY3Rpb24gXygpe2YuY2FsbCh0aGlzKX1mdW5jdGlvbiBTKCl7fWZ1bmN0aW9uIHcoKXt9ZnVuY3Rpb24gQSgpe30vKlxuXG4gQ29weXJpZ2h0IChDKSAyMDEwIFRoZSBMaWJwaG9uZW51bWJlciBBdXRob3JzLlxuXG4gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cbmZ1bmN0aW9uIHgoKXt0aGlzLmE9e319ZnVuY3Rpb24gTih0LG4pe2lmKG51bGw9PW4pcmV0dXJuIG51bGw7bj1uLnRvVXBwZXJDYXNlKCk7dmFyIGU9dC5hW25dO2lmKG51bGw9PWUpe2lmKGU9dHRbbl0sbnVsbD09ZSlyZXR1cm4gbnVsbDtlPShuZXcgQSkuYShfLmkoKSxlKSx0LmFbbl09ZX1yZXR1cm4gZX1mdW5jdGlvbiBqKHQpe3JldHVybiB0PVdbdF0sbnVsbD09dD9cIlpaXCI6dFswXX1mdW5jdGlvbiAkKHQpe3RoaXMuSD1SZWdFeHAoXCLigIhcIiksdGhpcy5CPVwiXCIsdGhpcy5tPW5ldyBlLHRoaXMudj1cIlwiLHRoaXMuaD1uZXcgZSx0aGlzLnU9bmV3IGUsdGhpcy5qPSEwLHRoaXMudz10aGlzLm89dGhpcy5EPSExLHRoaXMuRj14LmIoKSx0aGlzLnM9MCx0aGlzLmI9bmV3IGUsdGhpcy5BPSExLHRoaXMubD1cIlwiLHRoaXMuYT1uZXcgZSx0aGlzLmY9W10sdGhpcy5DPXQsdGhpcy5KPXRoaXMuZz1DKHRoaXMsdGhpcy5DKX1mdW5jdGlvbiBDKHQsbil7dmFyIGU7aWYobnVsbCE9biYmaXNOYU4obikmJm4udG9VcHBlckNhc2UoKWluIHR0KXtpZihlPU4odC5GLG4pLG51bGw9PWUpdGhyb3dcIkludmFsaWQgcmVnaW9uIGNvZGU6IFwiK247ZT1nKGUsMTApfWVsc2UgZT0wO3JldHVybiBlPU4odC5GLGooZSkpLG51bGwhPWU/ZTphdH1mdW5jdGlvbiBCKHQpe2Zvcih2YXIgbj10LmYubGVuZ3RoLGU9MDtuPmU7KytlKXt2YXIgaT10LmZbZV0sYT1nKGksMSk7aWYodC52PT1hKXJldHVybiExO3ZhciBsO2w9dDt2YXIgbz1pLHU9ZyhvLDEpO2lmKC0xIT11LmluZGV4T2YoXCJ8XCIpKWw9ITE7ZWxzZXt1PXUucmVwbGFjZShsdCxcIlxcXFxkXCIpLHU9dS5yZXBsYWNlKG90LFwiXFxcXGRcIikscihsLm0pO3ZhciBzO3M9bDt2YXIgbz1nKG8sMiksZj1cIjk5OTk5OTk5OTk5OTk5OVwiLm1hdGNoKHUpWzBdO2YubGVuZ3RoPHMuYS5iLmxlbmd0aD9zPVwiXCI6KHM9Zi5yZXBsYWNlKG5ldyBSZWdFeHAodSxcImdcIiksbykscz1zLnJlcGxhY2UoUmVnRXhwKFwiOVwiLFwiZ1wiKSxcIuKAiFwiKSksMDxzLmxlbmd0aD8obC5tLmEocyksbD0hMCk6bD0hMX1pZihsKXJldHVybiB0LnY9YSx0LkE9c3QudGVzdChoKGksNCkpLHQucz0wLCEwfXJldHVybiB0Lmo9ITF9ZnVuY3Rpb24gRSh0LG4pe2Zvcih2YXIgZT1bXSxyPW4ubGVuZ3RoLTMsaT10LmYubGVuZ3RoLGE9MDtpPmE7KythKXt2YXIgbD10LmZbYV07MD09YihsLDMpP2UucHVzaCh0LmZbYV0pOihsPWgobCwzLE1hdGgubWluKHIsYihsLDMpLTEpKSwwPT1uLnNlYXJjaChsKSYmZS5wdXNoKHQuZlthXSkpfXQuZj1lfWZ1bmN0aW9uIFIodCxuKXt0LmguYShuKTt2YXIgZT1uO2lmKHJ0LnRlc3QoZSl8fDE9PXQuaC5iLmxlbmd0aCYmZXQudGVzdChlKSl7dmFyIGksZT1uO1wiK1wiPT1lPyhpPWUsdC51LmEoZSkpOihpPW50W2VdLHQudS5hKGkpLHQuYS5hKGkpKSxuPWl9ZWxzZSB0Lmo9ITEsdC5EPSEwO2lmKCF0Lmope2lmKCF0LkQpaWYoVih0KSl7aWYoUCh0KSlyZXR1cm4gRCh0KX1lbHNlIGlmKDA8dC5sLmxlbmd0aCYmKGU9dC5hLnRvU3RyaW5nKCkscih0LmEpLHQuYS5hKHQubCksdC5hLmEoZSksZT10LmIudG9TdHJpbmcoKSxpPWUubGFzdEluZGV4T2YodC5sKSxyKHQuYiksdC5iLmEoZS5zdWJzdHJpbmcoMCxpKSkpLHQubCE9VSh0KSlyZXR1cm4gdC5iLmEoXCIgXCIpLEQodCk7cmV0dXJuIHQuaC50b1N0cmluZygpfXN3aXRjaCh0LnUuYi5sZW5ndGgpe2Nhc2UgMDpjYXNlIDE6Y2FzZSAyOnJldHVybiB0LmgudG9TdHJpbmcoKTtjYXNlIDM6aWYoIVYodCkpcmV0dXJuIHQubD1VKHQpLEYodCk7dC53PSEwO2RlZmF1bHQ6cmV0dXJuIHQudz8oUCh0KSYmKHQudz0hMSksdC5iLnRvU3RyaW5nKCkrdC5hLnRvU3RyaW5nKCkpOjA8dC5mLmxlbmd0aD8oZT1UKHQsbiksaT1JKHQpLDA8aS5sZW5ndGg/aTooRSh0LHQuYS50b1N0cmluZygpKSxCKHQpP0codCk6dC5qP00odCxlKTp0LmgudG9TdHJpbmcoKSkpOkYodCl9fWZ1bmN0aW9uIEQodCl7cmV0dXJuIHQuaj0hMCx0Lnc9ITEsdC5mPVtdLHQucz0wLHIodC5tKSx0LnY9XCJcIixGKHQpfWZ1bmN0aW9uIEkodCl7Zm9yKHZhciBuPXQuYS50b1N0cmluZygpLGU9dC5mLmxlbmd0aCxyPTA7ZT5yOysrcil7dmFyIGk9dC5mW3JdLGE9ZyhpLDEpO2lmKG5ldyBSZWdFeHAoXCJeKD86XCIrYStcIikkXCIpLnRlc3QobikpcmV0dXJuIHQuQT1zdC50ZXN0KGgoaSw0KSksbj1uLnJlcGxhY2UobmV3IFJlZ0V4cChhLFwiZ1wiKSxoKGksMikpLE0odCxuKX1yZXR1cm5cIlwifWZ1bmN0aW9uIE0odCxuKXt2YXIgZT10LmIuYi5sZW5ndGg7cmV0dXJuIHQuQSYmZT4wJiZcIiBcIiE9dC5iLnRvU3RyaW5nKCkuY2hhckF0KGUtMSk/dC5iK1wiIFwiK246dC5iK259ZnVuY3Rpb24gRih0KXt2YXIgbj10LmEudG9TdHJpbmcoKTtpZigzPD1uLmxlbmd0aCl7Zm9yKHZhciBlPXQubyYmMDxiKHQuZywyMCk/Yyh0LmcsMjApfHxbXTpjKHQuZywxOSl8fFtdLHI9ZS5sZW5ndGgsaT0wO3I+aTsrK2kpe3ZhciBhLGw9ZVtpXTsoYT1udWxsPT10LmcuYVsxMl18fHQub3x8aChsLDYpKXx8KGE9ZyhsLDQpLGE9MD09YS5sZW5ndGh8fGl0LnRlc3QoYSkpLGEmJnV0LnRlc3QoZyhsLDIpKSYmdC5mLnB1c2gobCl9cmV0dXJuIEUodCxuKSxuPUkodCksMDxuLmxlbmd0aD9uOkIodCk/Ryh0KTp0LmgudG9TdHJpbmcoKX1yZXR1cm4gTSh0LG4pfWZ1bmN0aW9uIEcodCl7dmFyIG49dC5hLnRvU3RyaW5nKCksZT1uLmxlbmd0aDtpZihlPjApe2Zvcih2YXIgcj1cIlwiLGk9MDtlPmk7aSsrKXI9VCh0LG4uY2hhckF0KGkpKTtyZXR1cm4gdC5qP00odCxyKTp0LmgudG9TdHJpbmcoKX1yZXR1cm4gdC5iLnRvU3RyaW5nKCl9ZnVuY3Rpb24gVSh0KXt2YXIgbixlPXQuYS50b1N0cmluZygpLGk9MDtyZXR1cm4gMSE9aCh0LmcsMTApP249ITE6KG49dC5hLnRvU3RyaW5nKCksbj1cIjFcIj09bi5jaGFyQXQoMCkmJlwiMFwiIT1uLmNoYXJBdCgxKSYmXCIxXCIhPW4uY2hhckF0KDEpKSxuPyhpPTEsdC5iLmEoXCIxXCIpLmEoXCIgXCIpLHQubz0hMCk6bnVsbCE9dC5nLmFbMTVdJiYobj1uZXcgUmVnRXhwKFwiXig/OlwiK2godC5nLDE1KStcIilcIiksbj1lLm1hdGNoKG4pLG51bGwhPW4mJm51bGwhPW5bMF0mJjA8blswXS5sZW5ndGgmJih0Lm89ITAsaT1uWzBdLmxlbmd0aCx0LmIuYShlLnN1YnN0cmluZygwLGkpKSkpLHIodC5hKSx0LmEuYShlLnN1YnN0cmluZyhpKSksZS5zdWJzdHJpbmcoMCxpKX1mdW5jdGlvbiBWKHQpe3ZhciBuPXQudS50b1N0cmluZygpLGU9bmV3IFJlZ0V4cChcIl4oPzpcXFxcK3xcIitoKHQuZywxMSkrXCIpXCIpLGU9bi5tYXRjaChlKTtyZXR1cm4gbnVsbCE9ZSYmbnVsbCE9ZVswXSYmMDxlWzBdLmxlbmd0aD8odC5vPSEwLGU9ZVswXS5sZW5ndGgscih0LmEpLHQuYS5hKG4uc3Vic3RyaW5nKGUpKSxyKHQuYiksdC5iLmEobi5zdWJzdHJpbmcoMCxlKSksXCIrXCIhPW4uY2hhckF0KDApJiZ0LmIuYShcIiBcIiksITApOiExfWZ1bmN0aW9uIFAodCl7aWYoMD09dC5hLmIubGVuZ3RoKXJldHVybiExO3ZhciBuLGk9bmV3IGU7dDp7aWYobj10LmEudG9TdHJpbmcoKSwwIT1uLmxlbmd0aCYmXCIwXCIhPW4uY2hhckF0KDApKWZvcih2YXIgYSxsPW4ubGVuZ3RoLG89MTszPj1vJiZsPj1vOysrbylpZihhPXBhcnNlSW50KG4uc3Vic3RyaW5nKDAsbyksMTApLGEgaW4gVyl7aS5hKG4uc3Vic3RyaW5nKG8pKSxuPWE7YnJlYWsgdH1uPTB9cmV0dXJuIDA9PW4/ITE6KHIodC5hKSx0LmEuYShpLnRvU3RyaW5nKCkpLGk9aihuKSxcIjAwMVwiPT1pP3QuZz1OKHQuRixcIlwiK24pOmkhPXQuQyYmKHQuZz1DKHQsaSkpLHQuYi5hKFwiXCIrbikuYShcIiBcIiksdC5sPVwiXCIsITApfWZ1bmN0aW9uIFQodCxuKXt2YXIgZT10Lm0udG9TdHJpbmcoKTtpZigwPD1lLnN1YnN0cmluZyh0LnMpLnNlYXJjaCh0LkgpKXt2YXIgaT1lLnNlYXJjaCh0LkgpLGU9ZS5yZXBsYWNlKHQuSCxuKTtyZXR1cm4gcih0Lm0pLHQubS5hKGUpLHQucz1pLGUuc3Vic3RyaW5nKDAsdC5zKzEpfXJldHVybiAxPT10LmYubGVuZ3RoJiYodC5qPSExKSx0LnY9XCJcIix0LmgudG9TdHJpbmcoKX12YXIgSD10aGlzO2UucHJvdG90eXBlLmI9XCJcIixlLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5iPVwiXCIrdH0sZS5wcm90b3R5cGUuYT1mdW5jdGlvbih0LG4sZSl7aWYodGhpcy5iKz1TdHJpbmcodCksbnVsbCE9bilmb3IodmFyIHI9MTtyPGFyZ3VtZW50cy5sZW5ndGg7cisrKXRoaXMuYis9YXJndW1lbnRzW3JdO3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJ9O3ZhciBLPTEsWT0yLHE9MyxKPTQsTD02LE89MTYsaz0xODtmLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24odCxuKXttKHRoaXMsdC5iLG4pfSxmLnByb3RvdHlwZS5jbG9uZT1mdW5jdGlvbigpe3ZhciB0PW5ldyB0aGlzLmNvbnN0cnVjdG9yO3JldHVybiB0IT10aGlzJiYodC5hPXt9LHQuYiYmKHQuYj17fSkscCh0LHRoaXMpKSx0fTt2YXIgWjtuKHYsZik7dmFyIHo7bihkLGYpO3ZhciBYO24oXyxmKSx2LnByb3RvdHlwZS5pPWZ1bmN0aW9uKCl7cmV0dXJuIFp8fChaPXkodix7MDp7bmFtZTpcIk51bWJlckZvcm1hdFwiLEk6XCJpMThuLnBob25lbnVtYmVycy5OdW1iZXJGb3JtYXRcIn0sMTp7bmFtZTpcInBhdHRlcm5cIixyZXF1aXJlZDohMCxjOjksdHlwZTpTdHJpbmd9LDI6e25hbWU6XCJmb3JtYXRcIixyZXF1aXJlZDohMCxjOjksdHlwZTpTdHJpbmd9LDM6e25hbWU6XCJsZWFkaW5nX2RpZ2l0c19wYXR0ZXJuXCIsRzohMCxjOjksdHlwZTpTdHJpbmd9LDQ6e25hbWU6XCJuYXRpb25hbF9wcmVmaXhfZm9ybWF0dGluZ19ydWxlXCIsYzo5LHR5cGU6U3RyaW5nfSw2OntuYW1lOlwibmF0aW9uYWxfcHJlZml4X29wdGlvbmFsX3doZW5fZm9ybWF0dGluZ1wiLGM6OCx0eXBlOkJvb2xlYW59LDU6e25hbWU6XCJkb21lc3RpY19jYXJyaWVyX2NvZGVfZm9ybWF0dGluZ19ydWxlXCIsYzo5LHR5cGU6U3RyaW5nfX0pKSxafSx2LmN0b3I9dix2LmN0b3IuaT12LnByb3RvdHlwZS5pLGQucHJvdG90eXBlLmk9ZnVuY3Rpb24oKXtyZXR1cm4genx8KHo9eShkLHswOntuYW1lOlwiUGhvbmVOdW1iZXJEZXNjXCIsSTpcImkxOG4ucGhvbmVudW1iZXJzLlBob25lTnVtYmVyRGVzY1wifSwyOntuYW1lOlwibmF0aW9uYWxfbnVtYmVyX3BhdHRlcm5cIixjOjksdHlwZTpTdHJpbmd9LDM6e25hbWU6XCJwb3NzaWJsZV9udW1iZXJfcGF0dGVyblwiLGM6OSx0eXBlOlN0cmluZ30sNjp7bmFtZTpcImV4YW1wbGVfbnVtYmVyXCIsYzo5LHR5cGU6U3RyaW5nfSw3OntuYW1lOlwibmF0aW9uYWxfbnVtYmVyX21hdGNoZXJfZGF0YVwiLGM6MTIsdHlwZTpTdHJpbmd9LDg6e25hbWU6XCJwb3NzaWJsZV9udW1iZXJfbWF0Y2hlcl9kYXRhXCIsYzoxMix0eXBlOlN0cmluZ319KSksen0sZC5jdG9yPWQsZC5jdG9yLmk9ZC5wcm90b3R5cGUuaSxfLnByb3RvdHlwZS5pPWZ1bmN0aW9uKCl7cmV0dXJuIFh8fChYPXkoXyx7MDp7bmFtZTpcIlBob25lTWV0YWRhdGFcIixJOlwiaTE4bi5waG9uZW51bWJlcnMuUGhvbmVNZXRhZGF0YVwifSwxOntuYW1lOlwiZ2VuZXJhbF9kZXNjXCIsYzoxMSx0eXBlOmR9LDI6e25hbWU6XCJmaXhlZF9saW5lXCIsYzoxMSx0eXBlOmR9LDM6e25hbWU6XCJtb2JpbGVcIixjOjExLHR5cGU6ZH0sNDp7bmFtZTpcInRvbGxfZnJlZVwiLGM6MTEsdHlwZTpkfSw1OntuYW1lOlwicHJlbWl1bV9yYXRlXCIsYzoxMSx0eXBlOmR9LDY6e25hbWU6XCJzaGFyZWRfY29zdFwiLGM6MTEsdHlwZTpkfSw3OntuYW1lOlwicGVyc29uYWxfbnVtYmVyXCIsYzoxMSx0eXBlOmR9LDg6e25hbWU6XCJ2b2lwXCIsYzoxMSx0eXBlOmR9LDIxOntuYW1lOlwicGFnZXJcIixjOjExLHR5cGU6ZH0sMjU6e25hbWU6XCJ1YW5cIixjOjExLHR5cGU6ZH0sMjc6e25hbWU6XCJlbWVyZ2VuY3lcIixjOjExLHR5cGU6ZH0sMjg6e25hbWU6XCJ2b2ljZW1haWxcIixjOjExLHR5cGU6ZH0sMjQ6e25hbWU6XCJub19pbnRlcm5hdGlvbmFsX2RpYWxsaW5nXCIsYzoxMSx0eXBlOmR9LDk6e25hbWU6XCJpZFwiLHJlcXVpcmVkOiEwLGM6OSx0eXBlOlN0cmluZ30sMTA6e25hbWU6XCJjb3VudHJ5X2NvZGVcIixjOjUsdHlwZTpOdW1iZXJ9LDExOntuYW1lOlwiaW50ZXJuYXRpb25hbF9wcmVmaXhcIixjOjksdHlwZTpTdHJpbmd9LDE3OntuYW1lOlwicHJlZmVycmVkX2ludGVybmF0aW9uYWxfcHJlZml4XCIsYzo5LHR5cGU6U3RyaW5nfSwxMjp7bmFtZTpcIm5hdGlvbmFsX3ByZWZpeFwiLGM6OSx0eXBlOlN0cmluZ30sMTM6e25hbWU6XCJwcmVmZXJyZWRfZXh0bl9wcmVmaXhcIixjOjksdHlwZTpTdHJpbmd9LDE1OntuYW1lOlwibmF0aW9uYWxfcHJlZml4X2Zvcl9wYXJzaW5nXCIsYzo5LHR5cGU6U3RyaW5nfSwxNjp7bmFtZTpcIm5hdGlvbmFsX3ByZWZpeF90cmFuc2Zvcm1fcnVsZVwiLGM6OSx0eXBlOlN0cmluZ30sMTg6e25hbWU6XCJzYW1lX21vYmlsZV9hbmRfZml4ZWRfbGluZV9wYXR0ZXJuXCIsYzo4LGRlZmF1bHRWYWx1ZTohMSx0eXBlOkJvb2xlYW59LDE5OntuYW1lOlwibnVtYmVyX2Zvcm1hdFwiLEc6ITAsYzoxMSx0eXBlOnZ9LDIwOntuYW1lOlwiaW50bF9udW1iZXJfZm9ybWF0XCIsRzohMCxjOjExLHR5cGU6dn0sMjI6e25hbWU6XCJtYWluX2NvdW50cnlfZm9yX2NvZGVcIixjOjgsZGVmYXVsdFZhbHVlOiExLHR5cGU6Qm9vbGVhbn0sMjM6e25hbWU6XCJsZWFkaW5nX2RpZ2l0c1wiLGM6OSx0eXBlOlN0cmluZ30sMjY6e25hbWU6XCJsZWFkaW5nX3plcm9fcG9zc2libGVcIixjOjgsZGVmYXVsdFZhbHVlOiExLHR5cGU6Qm9vbGVhbn19KSksWH0sXy5jdG9yPV8sXy5jdG9yLmk9Xy5wcm90b3R5cGUuaSxTLnByb3RvdHlwZS5hPWZ1bmN0aW9uKHQpe3Rocm93IG5ldyB0LmIsRXJyb3IoXCJVbmltcGxlbWVudGVkXCIpfSxTLnByb3RvdHlwZS5iPWZ1bmN0aW9uKHQsbil7aWYoMTE9PXQuYXx8MTA9PXQuYSlyZXR1cm4gbiBpbnN0YW5jZW9mIGY/bjp0aGlzLmEodC5qLnByb3RvdHlwZS5pKCksbik7aWYoMTQ9PXQuYSl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIG4mJlEudGVzdChuKSl7dmFyIGU9TnVtYmVyKG4pO2lmKGU+MClyZXR1cm4gZX1yZXR1cm4gbn1pZighdC5oKXJldHVybiBuO2lmKGU9dC5qLGU9PT1TdHJpbmcpe2lmKFwibnVtYmVyXCI9PXR5cGVvZiBuKXJldHVybiBTdHJpbmcobil9ZWxzZSBpZihlPT09TnVtYmVyJiZcInN0cmluZ1wiPT10eXBlb2YgbiYmKFwiSW5maW5pdHlcIj09PW58fFwiLUluZmluaXR5XCI9PT1ufHxcIk5hTlwiPT09bnx8US50ZXN0KG4pKSlyZXR1cm4gTnVtYmVyKG4pO3JldHVybiBufTt2YXIgUT0vXi0/WzAtOV0rJC87bih3LFMpLHcucHJvdG90eXBlLmE9ZnVuY3Rpb24odCxuKXt2YXIgZT1uZXcgdC5iO3JldHVybiBlLmc9dGhpcyxlLmE9bixlLmI9e30sZX0sbihBLHcpLEEucHJvdG90eXBlLmI9ZnVuY3Rpb24odCxuKXtyZXR1cm4gOD09dC5hPyEhbjpTLnByb3RvdHlwZS5iLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0sQS5wcm90b3R5cGUuYT1mdW5jdGlvbih0LG4pe3JldHVybiBBLk0uYS5jYWxsKHRoaXMsdCxuKX07LypcblxuIENvcHlyaWdodCAoQykgMjAxMCBUaGUgTGlicGhvbmVudW1iZXIgQXV0aG9yc1xuXG4gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cbnZhciBXPXsxOlwiVVMgQUcgQUkgQVMgQkIgQk0gQlMgQ0EgRE0gRE8gR0QgR1UgSk0gS04gS1kgTEMgTVAgTVMgUFIgU1ggVEMgVFQgVkMgVkcgVklcIi5zcGxpdChcIiBcIil9LHR0PXtVUzpbbnVsbCxbbnVsbCxudWxsLFwiWzItOV1cXFxcZHs5fVwiLFwiXFxcXGR7N30oPzpcXFxcZHszfSk/XCJdLFtudWxsLG51bGwsXCIoPzoyKD86MFsxLTM1LTldfDFbMDItOV18MlswNDU4OV18M1sxNDldfDRbMDhdfDVbMS00Nl18NlswMjc5XXw3WzAyNl18OFsxM10pfDMoPzowWzEtNTctOV18MVswMi05XXwyWzAxMzVdfDNbMDE0Njc5XXw0WzY3XXw1WzEyXXw2WzAxNF18OFswNTZdKXw0KD86MFsxMjQtOV18MVswMi01NzldfDJbMy01XXwzWzAyNDVdfDRbMDIzNV18NTh8Njl8N1swNTg5XXw4WzA0XSl8NSg/OjBbMS01Ny05XXwxWzAyMzUtOF18MjB8M1swMTQ5XXw0WzAxXXw1WzE5XXw2WzEtMzddfDdbMDEzLTVdfDhbMDU2XSl8Nig/OjBbMS0zNS05XXwxWzAyNC05XXwyWzAzNjg5XXwzWzAxNl18NFsxNl18NVswMTddfDZbMC0yNzldfDc4fDhbMTJdKXw3KD86MFsxLTQ2LThdfDFbMDItOV18MlswNDU3XXwzWzEyNDddfDRbMDM3XXw1WzQ3XXw2WzAyMzU5XXw3WzAyLTU5XXw4WzE1Nl0pfDgoPzowWzEtNjhdfDFbMDItOF18Mjh8M1swLTI1XXw0WzM1NzhdfDVbMDQ2LTldfDZbMDItNV18N1swMjhdKXw5KD86MFsxMzQ2LTldfDFbMDItOV18MlswNTg5XXwzWzAxNjc4XXw0WzAxNzldfDVbMTI0NjldfDdbMC0zNTg5XXw4WzA0NTldKSlbMi05XVxcXFxkezZ9XCIsXCJcXFxcZHs3fSg/OlxcXFxkezN9KT9cIixudWxsLG51bGwsXCIyMDE1NTU1NTU1XCJdLFtudWxsLG51bGwsXCIoPzoyKD86MFsxLTM1LTldfDFbMDItOV18MlswNDU4OV18M1sxNDldfDRbMDhdfDVbMS00Nl18NlswMjc5XXw3WzAyNl18OFsxM10pfDMoPzowWzEtNTctOV18MVswMi05XXwyWzAxMzVdfDNbMDE0Njc5XXw0WzY3XXw1WzEyXXw2WzAxNF18OFswNTZdKXw0KD86MFsxMjQtOV18MVswMi01NzldfDJbMy01XXwzWzAyNDVdfDRbMDIzNV18NTh8Njl8N1swNTg5XXw4WzA0XSl8NSg/OjBbMS01Ny05XXwxWzAyMzUtOF18MjB8M1swMTQ5XXw0WzAxXXw1WzE5XXw2WzEtMzddfDdbMDEzLTVdfDhbMDU2XSl8Nig/OjBbMS0zNS05XXwxWzAyNC05XXwyWzAzNjg5XXwzWzAxNl18NFsxNl18NVswMTddfDZbMC0yNzldfDc4fDhbMTJdKXw3KD86MFsxLTQ2LThdfDFbMDItOV18MlswNDU3XXwzWzEyNDddfDRbMDM3XXw1WzQ3XXw2WzAyMzU5XXw3WzAyLTU5XXw4WzE1Nl0pfDgoPzowWzEtNjhdfDFbMDItOF18Mjh8M1swLTI1XXw0WzM1NzhdfDVbMDQ2LTldfDZbMDItNV18N1swMjhdKXw5KD86MFsxMzQ2LTldfDFbMDItOV18MlswNTg5XXwzWzAxNjc4XXw0WzAxNzldfDVbMTI0NjldfDdbMC0zNTg5XXw4WzA0NTldKSlbMi05XVxcXFxkezZ9XCIsXCJcXFxcZHs3fSg/OlxcXFxkezN9KT9cIixudWxsLG51bGwsXCIyMDE1NTU1NTU1XCJdLFtudWxsLG51bGwsXCI4KD86MDB8NDR8NTV8NjZ8Nzd8ODgpWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7MTB9XCIsbnVsbCxudWxsLFwiODAwMjM0NTY3OFwiXSxbbnVsbCxudWxsLFwiOTAwWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7MTB9XCIsbnVsbCxudWxsLFwiOTAwMjM0NTY3OFwiXSxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdLFtudWxsLG51bGwsXCI1KD86MDB8MzN8NDR8NjZ8Nzd8ODgpWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7MTB9XCIsbnVsbCxudWxsLFwiNTAwMjM0NTY3OFwiXSxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdLFwiVVNcIiwxLFwiMDExXCIsXCIxXCIsbnVsbCxudWxsLFwiMVwiLG51bGwsbnVsbCwxLFtbbnVsbCxcIihcXFxcZHszfSkoXFxcXGR7NH0pXCIsXCIkMS0kMlwiLG51bGwsbnVsbCxudWxsLDFdLFtudWxsLFwiKFxcXFxkezN9KShcXFxcZHszfSkoXFxcXGR7NH0pXCIsXCIoJDEpICQyLSQzXCIsbnVsbCxudWxsLG51bGwsMV1dLFtbbnVsbCxcIihcXFxcZHszfSkoXFxcXGR7M30pKFxcXFxkezR9KVwiLFwiJDEtJDItJDNcIl1dLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl0sMSxudWxsLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl0sW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXSxudWxsLG51bGwsW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXV19O3guYj1mdW5jdGlvbigpe3JldHVybiB4LmE/eC5hOnguYT1uZXcgeH07dmFyIG50PXswOlwiMFwiLDE6XCIxXCIsMjpcIjJcIiwzOlwiM1wiLDQ6XCI0XCIsNTpcIjVcIiw2OlwiNlwiLDc6XCI3XCIsODpcIjhcIiw5OlwiOVwiLFwi77yQXCI6XCIwXCIsXCLvvJFcIjpcIjFcIixcIu+8klwiOlwiMlwiLFwi77yTXCI6XCIzXCIsXCLvvJRcIjpcIjRcIixcIu+8lVwiOlwiNVwiLFwi77yWXCI6XCI2XCIsXCLvvJdcIjpcIjdcIixcIu+8mFwiOlwiOFwiLFwi77yZXCI6XCI5XCIsXCLZoFwiOlwiMFwiLFwi2aFcIjpcIjFcIixcItmiXCI6XCIyXCIsXCLZo1wiOlwiM1wiLFwi2aRcIjpcIjRcIixcItmlXCI6XCI1XCIsXCLZplwiOlwiNlwiLFwi2adcIjpcIjdcIixcItmoXCI6XCI4XCIsXCLZqVwiOlwiOVwiLFwi27BcIjpcIjBcIixcItuxXCI6XCIxXCIsXCLbslwiOlwiMlwiLFwi27NcIjpcIjNcIixcItu0XCI6XCI0XCIsXCLbtVwiOlwiNVwiLFwi27ZcIjpcIjZcIixcItu3XCI6XCI3XCIsXCLbuFwiOlwiOFwiLFwi27lcIjpcIjlcIn0sZXQ9UmVnRXhwKFwiWyvvvItdK1wiKSxydD1SZWdFeHAoXCIoWzAtOe+8kC3vvJnZoC3ZqduwLdu5XSlcIiksaXQ9L15cXCg/XFwkMVxcKT8kLyxhdD1uZXcgXzttKGF0LDExLFwiTkFcIik7dmFyIGx0PS9cXFsoW15cXFtcXF1dKSpcXF0vZyxvdD0vXFxkKD89W14sfV1bXix9XSkvZyx1dD1SZWdFeHAoXCJeWy144oCQLeKAleKIkuODvO+8jS3vvI8gwqDCreKAi+KBoOOAgCgp77yI77yJ77y777y9LlxcXFxbXFxcXF0vfuKBk+KIvO+9nl0qKFxcXFwkXFxcXGRbLXjigJAt4oCV4oiS44O877yNLe+8jyDCoMKt4oCL4oGg44CAKCnvvIjvvInvvLvvvL0uXFxcXFtcXFxcXS9+4oGT4oi8772eXSopKyRcIiksc3Q9L1stIF0vOyQucHJvdG90eXBlLks9ZnVuY3Rpb24oKXt0aGlzLkI9XCJcIixyKHRoaXMuaCkscih0aGlzLnUpLHIodGhpcy5tKSx0aGlzLnM9MCx0aGlzLnY9XCJcIixyKHRoaXMuYiksdGhpcy5sPVwiXCIscih0aGlzLmEpLHRoaXMuaj0hMCx0aGlzLnc9dGhpcy5vPXRoaXMuRD0hMSx0aGlzLmY9W10sdGhpcy5BPSExLHRoaXMuZyE9dGhpcy5KJiYodGhpcy5nPUModGhpcyx0aGlzLkMpKX0sJC5wcm90b3R5cGUuTD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5CPVIodGhpcyx0KX0sdChcIkNsZWF2ZS5Bc1lvdVR5cGVGb3JtYXR0ZXJcIiwkKSx0KFwiQ2xlYXZlLkFzWW91VHlwZUZvcm1hdHRlci5wcm90b3R5cGUuaW5wdXREaWdpdFwiLCQucHJvdG90eXBlLkwpLHQoXCJDbGVhdmUuQXNZb3VUeXBlRm9ybWF0dGVyLnByb3RvdHlwZS5jbGVhclwiLCQucHJvdG90eXBlLkspfS5jYWxsKFwib2JqZWN0XCI9PXR5cGVvZiBnbG9iYWwmJmdsb2JhbD9nbG9iYWw6d2luZG93KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jbGVhdmUuanMvZGlzdC9hZGRvbnMvY2xlYXZlLXBob25lLnVzLmpzXG4vLyBtb2R1bGUgaWQgPSA3MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcInNjcmVlbi1zbWFsbFwiOjM3NSxcInNjcmVlbi1tZWRpdW1cIjo3MDAsXCJzY3JlZW4tbGFyZ2VcIjoxMDI0LFwic2NyZWVuLXhsYXJnZVwiOjEyMDB9XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmFyaWFibGVzLmpzb25cbi8vIG1vZHVsZSBpZCA9IDcyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIFJlc2l6ZSByZUNBUFRDSEEgdG8gZml0IHdpZHRoIG9mIGNvbnRhaW5lclxyXG4vLyBTaW5jZSBpdCBoYXMgYSBmaXhlZCB3aWR0aCwgd2UncmUgc2NhbGluZ1xyXG4vLyB1c2luZyBDU1MzIHRyYW5zZm9ybXNcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vIGNhcHRjaGFTY2FsZSA9IGNvbnRhaW5lcldpZHRoIC8gZWxlbWVudFdpZHRoXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuICBmdW5jdGlvbiBzY2FsZUNhcHRjaGEoKSB7XHJcbiAgICAvLyBXaWR0aCBvZiB0aGUgcmVDQVBUQ0hBIGVsZW1lbnQsIGluIHBpeGVsc1xyXG4gICAgdmFyIHJlQ2FwdGNoYVdpZHRoID0gMzA0O1xyXG4gICAgLy8gR2V0IHRoZSBjb250YWluaW5nIGVsZW1lbnQncyB3aWR0aFxyXG4gICAgdmFyIGNvbnRhaW5lcldpZHRoID0gJCgnLnNtcy1mb3JtLXdyYXBwZXInKS53aWR0aCgpO1xyXG4gICAgXHJcbiAgICAvLyBPbmx5IHNjYWxlIHRoZSByZUNBUFRDSEEgaWYgaXQgd29uJ3QgZml0XHJcbiAgICAvLyBpbnNpZGUgdGhlIGNvbnRhaW5lclxyXG4gICAgaWYocmVDYXB0Y2hhV2lkdGggPiBjb250YWluZXJXaWR0aCkge1xyXG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIHNjYWxlXHJcbiAgICAgIHZhciBjYXB0Y2hhU2NhbGUgPSBjb250YWluZXJXaWR0aCAvIHJlQ2FwdGNoYVdpZHRoO1xyXG4gICAgICAvLyBBcHBseSB0aGUgdHJhbnNmb3JtYXRpb25cclxuICAgICAgJCgnLmctcmVjYXB0Y2hhJykuY3NzKHtcclxuICAgICAgICB0cmFuc2Zvcm06J3NjYWxlKCcrY2FwdGNoYVNjYWxlKycpJ1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICQoZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBJbml0aWFsaXplIHNjYWxpbmdcclxuICAgIHNjYWxlQ2FwdGNoYSgpO1xyXG4gIH0pO1xyXG5cclxuICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gVXBkYXRlIHNjYWxpbmcgb24gd2luZG93IHJlc2l6ZVxyXG4gICAgLy8gVXNlcyBqUXVlcnkgdGhyb3R0bGUgcGx1Z2luIHRvIGxpbWl0IHN0cmFpbiBvbiB0aGUgYnJvd3NlclxyXG4gICAgc2NhbGVDYXB0Y2hhKCk7XHJcbiAgfSk7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9jYXB0Y2hhUmVzaXplLmpzIiwiLyoqXG4qIEhvbWUgUm90YXRpbmcgVGV4dCBBbmltYXRpb25cbiogUmVmZXJyZWQgZnJvbSBTdGFja292ZXJmbG93XG4qIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjc3MTc4OS9jaGFuZ2luZy10ZXh0LXBlcmlvZGljYWxseS1pbi1hLXNwYW4tZnJvbS1hbi1hcnJheS13aXRoLWpxdWVyeS8yNzcyMjc4IzI3NzIyNzhcbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgdGVybXMgPSBbXTtcblxuICAkKCcucm90YXRpbmctdGV4dF9fZW50cnknKS5lYWNoKGZ1bmN0aW9uIChpLCBlKSB7XG4gICAgaWYgKCQoZSkudGV4dCgpLnRyaW0oKSAhPT0gJycpIHtcbiAgICAgIHRlcm1zLnB1c2goJChlKS50ZXh0KCkpO1xuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gcm90YXRlVGVybSgpIHtcbiAgICB2YXIgY3QgPSAkKFwiI3JvdGF0ZVwiKS5kYXRhKFwidGVybVwiKSB8fCAwO1xuICAgICQoXCIjcm90YXRlXCIpLmRhdGEoXCJ0ZXJtXCIsIGN0ID09PSB0ZXJtcy5sZW5ndGggLTEgPyAwIDogY3QgKyAxKS50ZXh0KHRlcm1zW2N0XSkuZmFkZUluKCkuZGVsYXkoMjAwMCkuZmFkZU91dCgyMDAsIHJvdGF0ZVRlcm0pO1xuICB9XG4gICQocm90YXRlVGVybSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9yb3RhdGluZ1RleHRBbmltYXRpb24uanMiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBNaXNzUGxldGUgZnJvbSAnbWlzcy1wbGV0ZS1qcyc7XG5cbmNsYXNzIFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIG1vZHVsZVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9pbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNlYXJjaC5zZWxlY3RvcnMuTUFJTik7XG5cbiAgICBpZiAoIXRoaXMuX2lucHV0cykgcmV0dXJuO1xuXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuX2lucHV0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5fc3VnZ2VzdGlvbnModGhpcy5faW5wdXRzW2ldKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIHN1Z2dlc3RlZCBzZWFyY2ggdGVybSBkcm9wZG93bi5cbiAgICogQHBhcmFtICB7b2JqZWN0fSBpbnB1dCBUaGUgc2VhcmNoIGlucHV0LlxuICAgKi9cbiAgX3N1Z2dlc3Rpb25zKGlucHV0KSB7XG4gICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGlucHV0LmRhdGFzZXQuanNTZWFyY2hTdWdnZXN0aW9ucyk7XG5cbiAgICBpbnB1dC5fTWlzc1BsZXRlID0gbmV3IE1pc3NQbGV0ZSh7XG4gICAgICBpbnB1dDogaW5wdXQsXG4gICAgICBvcHRpb25zOiBkYXRhLFxuICAgICAgY2xhc3NOYW1lOiBpbnB1dC5kYXRhc2V0LmpzU2VhcmNoRHJvcGRvd25DbGFzc1xuICAgIH0pO1xuICB9XG59XG5cblNlYXJjaC5zZWxlY3RvcnMgPSB7XG4gIE1BSU46ICdbZGF0YS1qcyo9XCJzZWFyY2hcIl0nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTZWFyY2g7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc2VhcmNoLmpzIiwiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiTWlzc1BsZXRlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk1pc3NQbGV0ZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblxuXG4vKioqLyB9KSxcbi8qIDEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdHZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cdFxuXHR2YXIgX2phcm9XaW5rbGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcblx0XG5cdHZhciBfamFyb1dpbmtsZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfamFyb1dpbmtsZXIpO1xuXHRcblx0dmFyIF9tZW1vaXplID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKTtcblx0XG5cdHZhciBfbWVtb2l6ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW1vaXplKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXHRcblx0dmFyIE1pc3NQbGV0ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICBmdW5jdGlvbiBNaXNzUGxldGUoX3JlZikge1xuXHQgICAgdmFyIF90aGlzID0gdGhpcztcblx0XG5cdCAgICB2YXIgaW5wdXQgPSBfcmVmLmlucHV0LFxuXHQgICAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnMsXG5cdCAgICAgICAgY2xhc3NOYW1lID0gX3JlZi5jbGFzc05hbWUsXG5cdCAgICAgICAgX3JlZiRzY29yZUZuID0gX3JlZi5zY29yZUZuLFxuXHQgICAgICAgIHNjb3JlRm4gPSBfcmVmJHNjb3JlRm4gPT09IHVuZGVmaW5lZCA/ICgwLCBfbWVtb2l6ZTIuZGVmYXVsdCkoTWlzc1BsZXRlLnNjb3JlRm4pIDogX3JlZiRzY29yZUZuLFxuXHQgICAgICAgIF9yZWYkbGlzdEl0ZW1GbiA9IF9yZWYubGlzdEl0ZW1Gbixcblx0ICAgICAgICBsaXN0SXRlbUZuID0gX3JlZiRsaXN0SXRlbUZuID09PSB1bmRlZmluZWQgPyBNaXNzUGxldGUubGlzdEl0ZW1GbiA6IF9yZWYkbGlzdEl0ZW1Gbjtcblx0XG5cdCAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWlzc1BsZXRlKTtcblx0XG5cdCAgICBPYmplY3QuYXNzaWduKHRoaXMsIHsgaW5wdXQ6IGlucHV0LCBvcHRpb25zOiBvcHRpb25zLCBjbGFzc05hbWU6IGNsYXNzTmFtZSwgc2NvcmVGbjogc2NvcmVGbiwgbGlzdEl0ZW1GbjogbGlzdEl0ZW1GbiB9KTtcblx0XG5cdCAgICB0aGlzLnNjb3JlZE9wdGlvbnMgPSBudWxsO1xuXHQgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuXHQgICAgdGhpcy51bCA9IG51bGw7XG5cdCAgICB0aGlzLmhpZ2hsaWdodGVkSW5kZXggPSAtMTtcblx0XG5cdCAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoX3RoaXMuaW5wdXQudmFsdWUubGVuZ3RoID4gMCkge1xuXHQgICAgICAgIF90aGlzLnNjb3JlZE9wdGlvbnMgPSBfdGhpcy5vcHRpb25zLm1hcChmdW5jdGlvbiAob3B0aW9uKSB7XG5cdCAgICAgICAgICByZXR1cm4gc2NvcmVGbihfdGhpcy5pbnB1dC52YWx1ZSwgb3B0aW9uKTtcblx0ICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdCAgICAgICAgICByZXR1cm4gYi5zY29yZSAtIGEuc2NvcmU7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgX3RoaXMuc2NvcmVkT3B0aW9ucyA9IFtdO1xuXHQgICAgICB9XG5cdCAgICAgIF90aGlzLnJlbmRlck9wdGlvbnMoKTtcblx0ICAgIH0pO1xuXHRcblx0ICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICBpZiAoX3RoaXMudWwpIHtcblx0ICAgICAgICAvLyBkcm9wZG93biB2aXNpYmxlP1xuXHQgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuXHQgICAgICAgICAgY2FzZSAxMzpcblx0ICAgICAgICAgICAgX3RoaXMuc2VsZWN0KCk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgY2FzZSAyNzpcblx0ICAgICAgICAgICAgLy8gRXNjXG5cdCAgICAgICAgICAgIF90aGlzLnJlbW92ZURyb3Bkb3duKCk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgY2FzZSA0MDpcblx0ICAgICAgICAgICAgLy8gRG93biBhcnJvd1xuXHQgICAgICAgICAgICAvLyBPdGhlcndpc2UgdXAgYXJyb3cgcGxhY2VzIHRoZSBjdXJzb3IgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGVcblx0ICAgICAgICAgICAgLy8gZmllbGQsIGFuZCBkb3duIGFycm93IGF0IHRoZSBlbmRcblx0ICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgICAgICAgX3RoaXMuY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24oX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCA8IF90aGlzLnVsLmNoaWxkcmVuLmxlbmd0aCAtIDEgPyBfdGhpcy5oaWdobGlnaHRlZEluZGV4ICsgMSA6IC0xKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICBjYXNlIDM4OlxuXHQgICAgICAgICAgICAvLyBVcCBhcnJvd1xuXHQgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgICAgICBfdGhpcy5jaGFuZ2VIaWdobGlnaHRlZE9wdGlvbihfdGhpcy5oaWdobGlnaHRlZEluZGV4ID4gLTEgPyBfdGhpcy5oaWdobGlnaHRlZEluZGV4IC0gMSA6IF90aGlzLnVsLmNoaWxkcmVuLmxlbmd0aCAtIDEpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHRcblx0ICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICBfdGhpcy5yZW1vdmVEcm9wZG93bigpO1xuXHQgICAgICBfdGhpcy5oaWdobGlnaHRlZEluZGV4ID0gLTE7XG5cdCAgICB9KTtcblx0ICB9IC8vIGVuZCBjb25zdHJ1Y3RvclxuXHRcblx0ICBfY3JlYXRlQ2xhc3MoTWlzc1BsZXRlLCBbe1xuXHQgICAga2V5OiAnZ2V0U2libGluZ0luZGV4Jyxcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTaWJsaW5nSW5kZXgobm9kZSkge1xuXHQgICAgICB2YXIgaW5kZXggPSAtMTtcblx0ICAgICAgdmFyIG4gPSBub2RlO1xuXHQgICAgICBkbyB7XG5cdCAgICAgICAgaW5kZXgrKztcblx0ICAgICAgICBuID0gbi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXHQgICAgICB9IHdoaWxlIChuKTtcblx0ICAgICAgcmV0dXJuIGluZGV4O1xuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ3JlbmRlck9wdGlvbnMnLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlck9wdGlvbnMoKSB7XG5cdCAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXHRcblx0ICAgICAgdmFyIGRvY3VtZW50RnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFxuXHQgICAgICB0aGlzLnNjb3JlZE9wdGlvbnMuZXZlcnkoZnVuY3Rpb24gKHNjb3JlZE9wdGlvbiwgaSkge1xuXHQgICAgICAgIHZhciBsaXN0SXRlbSA9IF90aGlzMi5saXN0SXRlbUZuKHNjb3JlZE9wdGlvbiwgaSk7XG5cdCAgICAgICAgbGlzdEl0ZW0gJiYgZG9jdW1lbnRGcmFnbWVudC5hcHBlbmRDaGlsZChsaXN0SXRlbSk7XG5cdCAgICAgICAgcmV0dXJuICEhbGlzdEl0ZW07XG5cdCAgICAgIH0pO1xuXHRcblx0ICAgICAgdGhpcy5yZW1vdmVEcm9wZG93bigpO1xuXHQgICAgICB0aGlzLmhpZ2hsaWdodGVkSW5kZXggPSAtMTtcblx0XG5cdCAgICAgIGlmIChkb2N1bWVudEZyYWdtZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuXHQgICAgICAgIHZhciBuZXdVbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcblx0ICAgICAgICBuZXdVbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgICAgIGlmIChldmVudC50YXJnZXQudGFnTmFtZSA9PT0gJ0xJJykge1xuXHQgICAgICAgICAgICBfdGhpczIuY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24oX3RoaXMyLmdldFNpYmxpbmdJbmRleChldmVudC50YXJnZXQpKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0XG5cdCAgICAgICAgbmV3VWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgIF90aGlzMi5jaGFuZ2VIaWdobGlnaHRlZE9wdGlvbigtMSk7XG5cdCAgICAgICAgfSk7XG5cdFxuXHQgICAgICAgIG5ld1VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICAgICAgcmV0dXJuIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgfSk7XG5cdFxuXHQgICAgICAgIG5ld1VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdCAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09ICdMSScpIHtcblx0ICAgICAgICAgICAgX3RoaXMyLnNlbGVjdCgpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXHRcblx0ICAgICAgICBuZXdVbC5hcHBlbmRDaGlsZChkb2N1bWVudEZyYWdtZW50KTtcblx0XG5cdCAgICAgICAgLy8gU2VlIENTUyB0byB1bmRlcnN0YW5kIHdoeSB0aGUgPHVsPiBoYXMgdG8gYmUgd3JhcHBlZCBpbiBhIDxkaXY+XG5cdCAgICAgICAgdmFyIG5ld0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdCAgICAgICAgbmV3Q29udGFpbmVyLmNsYXNzTmFtZSA9IHRoaXMuY2xhc3NOYW1lO1xuXHQgICAgICAgIG5ld0NvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdVbCk7XG5cdFxuXHQgICAgICAgIC8vIEluc2VydHMgdGhlIGRyb3Bkb3duIGp1c3QgYWZ0ZXIgdGhlIDxpbnB1dD4gZWxlbWVudFxuXHQgICAgICAgIHRoaXMuaW5wdXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Q29udGFpbmVyLCB0aGlzLmlucHV0Lm5leHRTaWJsaW5nKTtcblx0ICAgICAgICB0aGlzLmNvbnRhaW5lciA9IG5ld0NvbnRhaW5lcjtcblx0ICAgICAgICB0aGlzLnVsID0gbmV3VWw7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LCB7XG5cdCAgICBrZXk6ICdjaGFuZ2VIaWdobGlnaHRlZE9wdGlvbicsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24obmV3SGlnaGxpZ2h0ZWRJbmRleCkge1xuXHQgICAgICBpZiAobmV3SGlnaGxpZ2h0ZWRJbmRleCA+PSAtMSAmJiBuZXdIaWdobGlnaHRlZEluZGV4IDwgdGhpcy51bC5jaGlsZHJlbi5sZW5ndGgpIHtcblx0ICAgICAgICAvLyBJZiBhbnkgb3B0aW9uIGFscmVhZHkgc2VsZWN0ZWQsIHRoZW4gdW5zZWxlY3QgaXRcblx0ICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRlZEluZGV4ICE9PSAtMSkge1xuXHQgICAgICAgICAgdGhpcy51bC5jaGlsZHJlblt0aGlzLmhpZ2hsaWdodGVkSW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWdobGlnaHRcIik7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICB0aGlzLmhpZ2hsaWdodGVkSW5kZXggPSBuZXdIaWdobGlnaHRlZEluZGV4O1xuXHRcblx0ICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRlZEluZGV4ICE9PSAtMSkge1xuXHQgICAgICAgICAgdGhpcy51bC5jaGlsZHJlblt0aGlzLmhpZ2hsaWdodGVkSW5kZXhdLmNsYXNzTGlzdC5hZGQoXCJoaWdobGlnaHRcIik7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAnc2VsZWN0Jyxcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiBzZWxlY3QoKSB7XG5cdCAgICAgIGlmICh0aGlzLmhpZ2hsaWdodGVkSW5kZXggIT09IC0xKSB7XG5cdCAgICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9IHRoaXMuc2NvcmVkT3B0aW9uc1t0aGlzLmhpZ2hsaWdodGVkSW5kZXhdLmRpc3BsYXlWYWx1ZTtcblx0ICAgICAgICB0aGlzLnJlbW92ZURyb3Bkb3duKCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LCB7XG5cdCAgICBrZXk6ICdyZW1vdmVEcm9wZG93bicsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRHJvcGRvd24oKSB7XG5cdCAgICAgIHRoaXMuY29udGFpbmVyICYmIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xuXHQgICAgICB0aGlzLmNvbnRhaW5lciA9IG51bGw7XG5cdCAgICAgIHRoaXMudWwgPSBudWxsO1xuXHQgICAgfVxuXHQgIH1dLCBbe1xuXHQgICAga2V5OiAnc2NvcmVGbicsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gc2NvcmVGbihpbnB1dFZhbHVlLCBvcHRpb25TeW5vbnltcykge1xuXHQgICAgICB2YXIgY2xvc2VzdFN5bm9ueW0gPSBudWxsO1xuXHQgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG5cdCAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuXHQgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICB0cnkge1xuXHQgICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IG9wdGlvblN5bm9ueW1zW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IChfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZSkge1xuXHQgICAgICAgICAgdmFyIHN5bm9ueW0gPSBfc3RlcC52YWx1ZTtcblx0XG5cdCAgICAgICAgICB2YXIgc2ltaWxhcml0eSA9ICgwLCBfamFyb1dpbmtsZXIyLmRlZmF1bHQpKHN5bm9ueW0udHJpbSgpLnRvTG93ZXJDYXNlKCksIGlucHV0VmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCkpO1xuXHQgICAgICAgICAgaWYgKGNsb3Nlc3RTeW5vbnltID09PSBudWxsIHx8IHNpbWlsYXJpdHkgPiBjbG9zZXN0U3lub255bS5zaW1pbGFyaXR5KSB7XG5cdCAgICAgICAgICAgIGNsb3Nlc3RTeW5vbnltID0geyBzaW1pbGFyaXR5OiBzaW1pbGFyaXR5LCB2YWx1ZTogc3lub255bSB9O1xuXHQgICAgICAgICAgICBpZiAoc2ltaWxhcml0eSA9PT0gMSkge1xuXHQgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGNhdGNoIChlcnIpIHtcblx0ICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG5cdCAgICAgICAgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG5cdCAgICAgIH0gZmluYWxseSB7XG5cdCAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3IucmV0dXJuKSB7XG5cdCAgICAgICAgICAgIF9pdGVyYXRvci5yZXR1cm4oKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9IGZpbmFsbHkge1xuXHQgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG5cdCAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIHtcblx0ICAgICAgICBzY29yZTogY2xvc2VzdFN5bm9ueW0uc2ltaWxhcml0eSxcblx0ICAgICAgICBkaXNwbGF5VmFsdWU6IG9wdGlvblN5bm9ueW1zWzBdXG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAnbGlzdEl0ZW1GbicsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gbGlzdEl0ZW1GbihzY29yZWRPcHRpb24sIGl0ZW1JbmRleCkge1xuXHQgICAgICB2YXIgbGkgPSBpdGVtSW5kZXggPiBNaXNzUGxldGUuTUFYX0lURU1TID8gbnVsbCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcblx0ICAgICAgbGkgJiYgbGkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc2NvcmVkT3B0aW9uLmRpc3BsYXlWYWx1ZSkpO1xuXHQgICAgICByZXR1cm4gbGk7XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAnTUFYX0lURU1TJyxcblx0ICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgICByZXR1cm4gODtcblx0ICAgIH1cblx0ICB9XSk7XG5cdFxuXHQgIHJldHVybiBNaXNzUGxldGU7XG5cdH0oKTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IE1pc3NQbGV0ZTtcblxuLyoqKi8gfSksXG4vKiAyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdHZhciBfc2xpY2VkVG9BcnJheSA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gc2xpY2VJdGVyYXRvcihhcnIsIGkpIHsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfZSA9IHVuZGVmaW5lZDsgdHJ5IHsgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0pIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfSByZXR1cm4gZnVuY3Rpb24gKGFyciwgaSkgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IHJldHVybiBhcnI7IH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSB7IHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7IH0gZWxzZSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpOyB9IH07IH0oKTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChzMSwgczIpIHtcblx0ICB2YXIgcHJlZml4U2NhbGluZ0ZhY3RvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogMC4yO1xuXHRcblx0ICB2YXIgamFyb1NpbWlsYXJpdHkgPSBqYXJvKHMxLCBzMik7XG5cdFxuXHQgIHZhciBjb21tb25QcmVmaXhMZW5ndGggPSAwO1xuXHQgIGZvciAodmFyIGkgPSAwOyBpIDwgczEubGVuZ3RoOyBpKyspIHtcblx0ICAgIGlmIChzMVtpXSA9PT0gczJbaV0pIHtcblx0ICAgICAgY29tbW9uUHJlZml4TGVuZ3RoKys7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBicmVhaztcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHJldHVybiBqYXJvU2ltaWxhcml0eSArIE1hdGgubWluKGNvbW1vblByZWZpeExlbmd0aCwgNCkgKiBwcmVmaXhTY2FsaW5nRmFjdG9yICogKDEgLSBqYXJvU2ltaWxhcml0eSk7XG5cdH07XG5cdFxuXHQvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9KYXJvJUUyJTgwJTkzV2lua2xlcl9kaXN0YW5jZVxuXHRcblx0ZnVuY3Rpb24gamFybyhzMSwgczIpIHtcblx0ICB2YXIgc2hvcnRlciA9IHZvaWQgMCxcblx0ICAgICAgbG9uZ2VyID0gdm9pZCAwO1xuXHRcblx0ICB2YXIgX3JlZiA9IHMxLmxlbmd0aCA+IHMyLmxlbmd0aCA/IFtzMSwgczJdIDogW3MyLCBzMV07XG5cdFxuXHQgIHZhciBfcmVmMiA9IF9zbGljZWRUb0FycmF5KF9yZWYsIDIpO1xuXHRcblx0ICBsb25nZXIgPSBfcmVmMlswXTtcblx0ICBzaG9ydGVyID0gX3JlZjJbMV07XG5cdFxuXHRcblx0ICB2YXIgbWF0Y2hpbmdXaW5kb3cgPSBNYXRoLmZsb29yKGxvbmdlci5sZW5ndGggLyAyKSAtIDE7XG5cdCAgdmFyIHNob3J0ZXJNYXRjaGVzID0gW107XG5cdCAgdmFyIGxvbmdlck1hdGNoZXMgPSBbXTtcblx0XG5cdCAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaG9ydGVyLmxlbmd0aDsgaSsrKSB7XG5cdCAgICB2YXIgY2ggPSBzaG9ydGVyW2ldO1xuXHQgICAgdmFyIHdpbmRvd1N0YXJ0ID0gTWF0aC5tYXgoMCwgaSAtIG1hdGNoaW5nV2luZG93KTtcblx0ICAgIHZhciB3aW5kb3dFbmQgPSBNYXRoLm1pbihpICsgbWF0Y2hpbmdXaW5kb3cgKyAxLCBsb25nZXIubGVuZ3RoKTtcblx0ICAgIGZvciAodmFyIGogPSB3aW5kb3dTdGFydDsgaiA8IHdpbmRvd0VuZDsgaisrKSB7XG5cdCAgICAgIGlmIChsb25nZXJNYXRjaGVzW2pdID09PSB1bmRlZmluZWQgJiYgY2ggPT09IGxvbmdlcltqXSkge1xuXHQgICAgICAgIHNob3J0ZXJNYXRjaGVzW2ldID0gbG9uZ2VyTWF0Y2hlc1tqXSA9IGNoO1xuXHQgICAgICAgIGJyZWFrO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICB2YXIgc2hvcnRlck1hdGNoZXNTdHJpbmcgPSBzaG9ydGVyTWF0Y2hlcy5qb2luKFwiXCIpO1xuXHQgIHZhciBsb25nZXJNYXRjaGVzU3RyaW5nID0gbG9uZ2VyTWF0Y2hlcy5qb2luKFwiXCIpO1xuXHQgIHZhciBudW1NYXRjaGVzID0gc2hvcnRlck1hdGNoZXNTdHJpbmcubGVuZ3RoO1xuXHRcblx0ICB2YXIgdHJhbnNwb3NpdGlvbnMgPSAwO1xuXHQgIGZvciAodmFyIF9pID0gMDsgX2kgPCBzaG9ydGVyTWF0Y2hlc1N0cmluZy5sZW5ndGg7IF9pKyspIHtcblx0ICAgIGlmIChzaG9ydGVyTWF0Y2hlc1N0cmluZ1tfaV0gIT09IGxvbmdlck1hdGNoZXNTdHJpbmdbX2ldKSB7XG5cdCAgICAgIHRyYW5zcG9zaXRpb25zKys7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gbnVtTWF0Y2hlcyA+IDAgPyAobnVtTWF0Y2hlcyAvIHNob3J0ZXIubGVuZ3RoICsgbnVtTWF0Y2hlcyAvIGxvbmdlci5sZW5ndGggKyAobnVtTWF0Y2hlcyAtIE1hdGguZmxvb3IodHJhbnNwb3NpdGlvbnMgLyAyKSkgLyBudW1NYXRjaGVzKSAvIDMuMCA6IDA7XG5cdH1cblxuLyoqKi8gfSksXG4vKiAzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChmbikge1xuXHQgIHZhciBjYWNoZSA9IHt9O1xuXHRcblx0ICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIga2V5ID0gSlNPTi5zdHJpbmdpZnkoYXJncyk7XG5cdCAgICByZXR1cm4gY2FjaGVba2V5XSB8fCAoY2FjaGVba2V5XSA9IGZuLmFwcGx5KG51bGwsIGFyZ3MpKTtcblx0ICB9O1xuXHR9O1xuXG4vKioqLyB9KVxuLyoqKioqKi8gXSlcbn0pO1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVuZGxlLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL21pc3MtcGxldGUtanMvZGlzdC9idW5kbGUuanNcbi8vIG1vZHVsZSBpZCA9IDc2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVG9nZ2xlT3BlbiBtb2R1bGVcbiAqIEBtb2R1bGUgbW9kdWxlcy90b2dnbGVPcGVuXG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuaW1wb3J0IGRhdGFzZXQgZnJvbSAnLi9kYXRhc2V0LmpzJztcblxuLyoqXG4gKiBUb2dnbGVzIGFuIGVsZW1lbnQgb3Blbi9jbG9zZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gb3BlbkNsYXNzIC0gVGhlIGNsYXNzIHRvIHRvZ2dsZSBvbi9vZmZcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3BlbkNsYXNzKSB7XG4gIGlmICghb3BlbkNsYXNzKSB7XG4gICAgb3BlbkNsYXNzID0gJ2lzLW9wZW4nO1xuICB9XG4gIGNvbnN0IGxpbmtBY3RpdmVDbGFzcyA9ICdpcy1hY3RpdmUnO1xuICBjb25zdCB0b2dnbGVFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRvZ2dsZV0nKTtcblxuICAvKipcbiAgKiBGb3IgZWFjaCB0b2dnbGUgZWxlbWVudCwgZ2V0IGl0cyB0YXJnZXQgZnJvbSB0aGUgZGF0YS10b2dnbGUgYXR0cmlidXRlLlxuICAqIEJpbmQgYW4gZXZlbnQgaGFuZGxlciB0byB0b2dnbGUgdGhlIG9wZW5DbGFzcyBvbi9vZmYgb24gdGhlIHRhcmdldCBlbGVtZW50XG4gICogd2hlbiB0aGUgdG9nZ2xlIGVsZW1lbnQgaXMgY2xpY2tlZC5cbiAgKi9cbiAgaWYgKHRvZ2dsZUVsZW1zKSB7XG4gICAgZm9yRWFjaCh0b2dnbGVFbGVtcywgZnVuY3Rpb24odG9nZ2xlRWxlbSkge1xuICAgICAgY29uc3QgdGFyZ2V0RWxlbVNlbGVjdG9yID0gZGF0YXNldCh0b2dnbGVFbGVtLCAndG9nZ2xlJyk7XG4gICAgICBpZiAodGFyZ2V0RWxlbVNlbGVjdG9yKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRFbGVtU2VsZWN0b3IpO1xuICAgICAgICBpZiAoIXRhcmdldEVsZW0pIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdG9nZ2xlRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdG9nZ2xlRWxlbS5jbGFzc0xpc3QudG9nZ2xlKGxpbmtBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgdGFyZ2V0RWxlbS5jbGFzc0xpc3QudG9nZ2xlKG9wZW5DbGFzcyk7XG4gICAgICAgICAgbGV0IHRvZ2dsZUV2ZW50O1xuICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0b2dnbGVFdmVudCA9IG5ldyBDdXN0b21FdmVudCgnY2hhbmdlT3BlblN0YXRlJywge2RldGFpbDogdGFyZ2V0RWxlbS5jbGFzc0xpc3QuY29udGFpbnMob3BlbkNsYXNzKX0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b2dnbGVFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgICAgICAgdG9nZ2xlRXZlbnQuaW5pdEN1c3RvbUV2ZW50KCdjaGFuZ2VPcGVuU3RhdGUnLCB0cnVlLCB0cnVlLCB7ZGV0YWlsOiB0YXJnZXRFbGVtLmNsYXNzTGlzdC5jb250YWlucyhvcGVuQ2xhc3MpfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhcmdldEVsZW0uZGlzcGF0Y2hFdmVudCh0b2dnbGVFdmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy90b2dnbGVPcGVuLmpzIiwiLyogZXNsaW50LWVudiBicm93c2VyICovXG5pbXBvcnQgalF1ZXJ5IGZyb20gJ2pxdWVyeSc7XG5cbihmdW5jdGlvbih3aW5kb3csICQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEF0dGFjaCBzaXRlLXdpZGUgZXZlbnQgbGlzdGVuZXJzLlxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1zaW1wbGUtdG9nZ2xlJywgZSA9PiB7XG4gICAgLy8gU2ltcGxlIHRvZ2dsZSB0aGF0IGFkZC9yZW1vdmVzIFwiYWN0aXZlXCIgYW5kIFwiaGlkZGVuXCIgY2xhc3NlcywgYXMgd2VsbCBhc1xuICAgIC8vIGFwcGx5aW5nIGFwcHJvcHJpYXRlIGFyaWEtaGlkZGVuIHZhbHVlIHRvIGEgc3BlY2lmaWVkIHRhcmdldC5cbiAgICAvLyBUT0RPOiBUaGVyZSBhcmUgYSBmZXcgc2ltbGFyIHRvZ2dsZXMgb24gdGhlIHNpdGUgdGhhdCBjb3VsZCBiZVxuICAgIC8vIHJlZmFjdG9yZWQgdG8gdXNlIHRoaXMgY2xhc3MuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0ICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpID9cbiAgICAgICAgJCgkKGUuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpKSA6XG4gICAgICAgICQoJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3RhcmdldCcpKTtcbiAgICAkKGUuY3VycmVudFRhcmdldCkudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICR0YXJnZXQudG9nZ2xlQ2xhc3MoJ2FjdGl2ZSBoaWRkZW4nKVxuICAgICAgICAucHJvcCgnYXJpYS1oaWRkZW4nLCAkdGFyZ2V0Lmhhc0NsYXNzKCdoaWRkZW4nKSk7XG4gIH0pLm9uKCdjbGljaycsICcuanMtc2hvdy1uYXYnLCBlID0+IHtcbiAgICAvLyBTaG93cyB0aGUgbW9iaWxlIG5hdiBieSBhcHBseWluZyBcIm5hdi1hY3RpdmVcIiBjYXNzIHRvIHRoZSBib2R5LlxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAkKGUuZGVsZWdhdGVUYXJnZXQpLmFkZENsYXNzKCduYXYtYWN0aXZlJyk7XG4gICAgJCgnLm5hdi1vdmVybGF5Jykuc2hvdygpO1xuICB9KS5vbignY2xpY2snLCAnLmpzLWhpZGUtbmF2JywgZSA9PiB7XG4gICAgLy8gSGlkZXMgdGhlIG1vYmlsZSBuYXYuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQoJy5uYXYtb3ZlcmxheScpLmhpZGUoKTtcbiAgICAkKGUuZGVsZWdhdGVUYXJnZXQpLnJlbW92ZUNsYXNzKCduYXYtYWN0aXZlJyk7XG4gIH0pO1xuICAvLyBFTkQgVE9ET1xuXG59KSh3aW5kb3csIGpRdWVyeSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy90b2dnbGVNZW51LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==
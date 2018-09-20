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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var arrayEach = __webpack_require__(18),
    baseEach = __webpack_require__(19),
    castFunction = __webpack_require__(43),
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
    getRawTag = __webpack_require__(28),
    objectToString = __webpack_require__(29);

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

var isFunction = __webpack_require__(41),
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
    now = __webpack_require__(50),
    toNumber = __webpack_require__(51);

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
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_accordion_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_simpleAccordion_js__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_offcanvas_js__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_overlay_js__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_stickNav_js__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_sectionHighlighter_js__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_staticColumn_js__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__modules_alert_js__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modules_newsletter_signup_js__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__modules_formEffects_js__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__modules_facets_js__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__modules_owlSettings_js__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__modules_iOS7Hack_js__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__modules_share_form_js__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__modules_captchaResize_js__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__modules_rotatingTextAnimation_js__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__modules_search_js__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__modules_toggleOpen_js__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__modules_toggleMenu_js__ = __webpack_require__(79);








// import bsdtoolsSignup from './modules/bsdtools-signup.js';









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
  // bsdtoolsSignup();
  Object(__WEBPACK_IMPORTED_MODULE_8__modules_newsletter_signup_js__["a" /* default */])();
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
/* 17 */
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
/* 18 */
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(20),
    createBaseEach = __webpack_require__(42);

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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var baseFor = __webpack_require__(21),
    keys = __webpack_require__(23);

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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(22);

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
/* 22 */
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(24),
    baseKeys = __webpack_require__(37),
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(25),
    isArguments = __webpack_require__(26),
    isArray = __webpack_require__(9),
    isBuffer = __webpack_require__(30),
    isIndex = __webpack_require__(32),
    isTypedArray = __webpack_require__(33);

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
/* 25 */
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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(27),
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
/* 27 */
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
/* 28 */
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
/* 29 */
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(5),
    stubFalse = __webpack_require__(31);

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
/* 31 */
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
/* 32 */
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(34),
    baseUnary = __webpack_require__(35),
    nodeUtil = __webpack_require__(36);

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
/* 34 */
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
/* 35 */
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
/* 36 */
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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(38),
    nativeKeys = __webpack_require__(39);

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
/* 38 */
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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(40);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 40 */
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
/* 41 */
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
/* 42 */
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
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(44);

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
/* 44 */
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
/* 45 */
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
/* 46 */
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
/* 47 */
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
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_throttle__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_throttle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_throttle__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_debounce__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_debounce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_debounce__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_imagesready_dist_imagesready_js__ = __webpack_require__(53);
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
/* 49 */
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
/* 50 */
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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4),
    isSymbol = __webpack_require__(52);

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
/* 52 */
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
/* 53 */
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
/* 54 */
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
/* 55 */
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
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_forEach__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__readCookie_js__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dataset_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__createCookie_js__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__getDomain_js__ = __webpack_require__(59);
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
/* 57 */
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
/* 58 */
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
/* 59 */
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
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_underscore__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_zipcodes_json__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_zipcodes_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__data_zipcodes_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_form_errors_json__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_form_errors_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__data_form_errors_json__);
/**
* Validate a form and submit via the signup API
*/




/* harmony default export */ __webpack_exports__["a"] = (function () {
  // const $signupForms = $('.guny-signup');
  var errorMsg = 'Please enter your email and zip code and select at least one age group.';

  /**
  * Validate form fields
  * @param {object} formData - form fields
  * @param {object} event - event object
  */
  function validateFields(form, event) {

    event.preventDefault();

    var fields = form.serializeArray().reduce(function (obj, item) {
      return obj[item.name] = item.value, obj;
    }, {});
    var requiredFields = form.find('[required]');
    var emailRegex = new RegExp(/\S+@\S+\.\S+/);
    var zipRegex = new RegExp(/^\d{5}(-\d{4})?$/i);
    var phoneRegex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
    var groupSeleted = Object.keys(fields).find(function (a) {
      return a.includes("group");
    }) ? true : false;
    var hasErrors = false;

    // loop through each required field
    requiredFields.each(function () {
      var fieldName = $(this).attr('name');
      $(this).removeClass('is-error');

      if (typeof fields[fieldName] === 'undefined' && !groupSeleted) {
        hasErrors = true;
        $(this).parents('fieldset').find('.guny-error-detailed').html('<p>Please select from the list below.</p>');;

        $(this).addClass('is-error');
      }

      if (fieldName == 'EMAIL' && !emailRegex.test(fields.EMAIL) || fieldName == 'ZIP' && !zipRegex.test(fields.ZIP) || fieldName == 'PHONENUM' && !phoneRegex.test(fields.PHONENUM) && fields.PHONENUM.length != 0) {
        hasErrors = true;
        $(this).siblings('.guny-error-detailed').html('<p>' + __WEBPACK_IMPORTED_MODULE_2__data_form_errors_json___default.a.find(function (x) {
          return x[fieldName];
        })[fieldName] + '</p>');
        $(this).addClass('is-error');
      }

      // assign the correct borough to good zip
      if (fieldName == 'EMAIL' && emailRegex.test(fields.EMAIL)) {
        fields.BOROUGH = assignBorough(fields.ZIP);
      }

      if (fieldName != 'EMAIL' && fieldName != 'ZIP' && fieldName != 'PHONENUM' && fields[fieldName] === "") {
        hasErrors = true;
        $(this).siblings('.guny-error-detailed').html('<p>' + __WEBPACK_IMPORTED_MODULE_2__data_form_errors_json___default.a.find(function (x) {
          return x[fieldName];
        })[fieldName] + '</p>');
        $(this).addClass('is-error');
      }
    });

    // if there are no errors, submit
    if (hasErrors) {
      form.find('.guny-error').html('<p>' + errorMsg + '</p>');
    } else {
      submitSignup(form, fields);
    }
  }

  /**
  * Assigns the borough based on the zip code
  * @param {string} zip - zip code
  */
  function assignBorough(zip) {
    var borough = '';
    var index = __WEBPACK_IMPORTED_MODULE_1__data_zipcodes_json___default.a.findIndex(function (x) {
      return x.codes.indexOf(parseInt(zip)) > -1;
    });

    if (index === -1) {
      borough = "Manhattan";
    } else {
      borough = __WEBPACK_IMPORTED_MODULE_1__data_zipcodes_json___default.a[index].borough;
    }

    return borough;
  }

  /**
  * Submits the form object to Mailchimp
  * @param {object} formData - form fields
  */
  function submitSignup(form, formData) {
    $.ajax({
      url: form.attr('action'),
      type: form.attr('method'),
      dataType: 'json', //no jsonp
      cache: false,
      data: formData,
      contentType: "application/json; charset=utf-8",
      success: function success(response) {
        if (response.result !== 'success') {
          if (form[0].className.indexOf('contact') > -1) {
            if (response.msg.includes('already subscribed')) {
              form.html('<p class="text-center">You have already reached out to us. We will get back to you as soon as possible!</p>');
            } else {
              form.html('<p class="text-center">Something went wrong. Try again later!</p>');
            }
          } else {
            if (response.msg.includes('too many recent signup requests')) {
              form.find('.guny-error').html('<p class="text-center">There was a problem with your subscription.</p>');
            } else if (response.msg.includes('already subscribed')) {
              form.find('.guny-error').html('<p class="text-center">You are already signed up for updates! Check your email.</p>');
            }
          }
        } else {
          if (form[0].className.indexOf('contact') > -1) {
            form.html('<p class="text-center">Thank you for contacting us! Someone will respond to you shortly.</p>');
          } else {
            form.html('<p class="c-signup-form__success">One more step! <br /> Please check your inbox and confirm your email address to start receiving updates. <br />Thanks for signing up!</p>');
          }
        }
      },
      error: function error(response) {
        form.find('.guny-error').html('<p>There was a problem with your subscription. Check back later.</p>');
      }
    });
  }

  /**
  * Triggers form validation and sends the form data to Mailchimp
  * @param {object} formData - form fields
  */
  $('button[type="submit"]').click(function (event) {
    event.preventDefault();
    var formClass = $(this).parents('form').attr('class');
    var $form = $('.' + formClass);
    validateFields($form, event);
  });

  /**
  * Checking characters against the 255 char limit
  */
  $('.textarea').keyup(function () {
    var charLen = 255 - $(this).val().length;
    $('.char-count').text('Characters left: ' + charLen);
    if (charLen < 0) {
      $('.char-count').css("color", '#d8006d');
      $(this).css("border-color", '#d8006d');
    } else {
      $('.char-count').css("color", '#333');
      $(this).css("border-color", '#2793e0');
    }
  });
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = [{"borough":"Bronx","codes":[10451,10452,10453,10454,10455,10456,10457,10458,10459,10460,10461,10462,10463,10464,10465,10466,10467,10468,10469,10470,10471,10472,10473,10474,10475]},{"borough":"Brooklyn","codes":[11201,11202,11203,11204,11205,11206,11207,11208,11209,11210,11211,11212,11213,11214,11215,11216,11217,11218,11219,11220,11221,11222,11223,11224,11225,11226,11228,11229,11230,11231,11232,11233,11234,11235,11236,11237,11238,11239,11241,11242,11243,11245,11247,11249,11251,11252,11256]},{"borough":"Manhattan","codes":[10001,10002,10003,10004,10005,10006,10007,10008,10009,10010,10011,10012,10013,10014,10016,10017,10018,10019,10020,10021,10022,10023,10024,10025,10027,10028,10029,10030,10031,10032,10033,10034,10035,10036,10037,10038,10039,10040,10041,10045,10055,10081,10087,10101,10103,10104,10105,10106,10107,10108,10109,10110,10111,10112,10113,10114,10115,10116,10118,10119,10120,10121,10122,10123,10128,10150,10151,10152,10153,10154,10155,10156,10158,10159,10162,10165,10166,10167,10168,10169,10170,10171,10172,10173,10174,10175,10176,10177,10178,10185,10199,10212,10249,10256,10259,10261,10268,10270,10271,10276,10278,10279,10280,10281,10282,10286]},{"borough":"Queens","codes":[11101,11102,11103,11104,11106,11109,11120,11351,11352,11354,11355,11356,11357,11358,11359,11360,11361,11362,11363,11364,11365,11366,11367,11368,11369,11370,11371,11372,11373,11374,11375,11377,11378,11379,11380,11381,11385,11386,11405,11411,11413,11414,11415,11416,11417,11418,11419,11420,11421,11422,11423,11424,11425,11426,11427,11428,11429,11430,11431,11432,11433,11434,11435,11436,11439,11451,11690,11691,11692,11693,11694,11695,11697]},{"borough":"Staten Island","codes":[10301,10302,10303,10304,10305,10306,10307,10308,10309,10310,10311,10312,10313,10314]}]

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = [{"EMAIL":"Please enter a valid email."},{"FNAME":"Please enter your first name."},{"LNAME":"Please enter your last name."},{"ZIP":"Please enter a valid US zip code."},{"PHONENUM":"Please enter a valid phone number."},{"MESSAGE":"Please enter a message. Limited to 255 characters."},{"GROUP":"Please select one."}]

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_forEach__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dispatchEvent_js__ = __webpack_require__(64);
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
/* 64 */
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
/* 65 */
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
/* 66 */
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
/* 67 */
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
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_cookie__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_cookie___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_cookie__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vendor_utility_js__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cleave_js_dist_cleave_min__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cleave_js_dist_cleave_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_cleave_js_dist_cleave_min__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_cleave_js_dist_addons_cleave_phone_us__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_cleave_js_dist_addons_cleave_phone_us___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_cleave_js_dist_addons_cleave_phone_us__);
/* eslint-env browser */


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }







/* eslint no-undef: "off" */
var Variables = __webpack_require__(73);

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
/* 69 */
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
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_underscore__ = __webpack_require__(15);
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
/* 71 */
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
/* 72 */
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
/* 73 */
/***/ (function(module, exports) {

module.exports = {"screen-small":375,"screen-medium":700,"screen-large":1024,"screen-xlarge":1200}

/***/ }),
/* 74 */
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
/* 75 */
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
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_miss_plete_js__ = __webpack_require__(77);
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
/* 77 */
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
/* 78 */
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
/* 79 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWU3NjcxMGUxZjc2YzllNDNlNGEiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwialF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mb3JFYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZGF0YXNldC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tYWluLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2FjY29yZGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvck93bi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VGb3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNQcm90b3R5cGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRWFjaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0RnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9zaW1wbGVBY2NvcmRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvb2ZmY2FudmFzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL292ZXJsYXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc3RpY2tOYXYuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90aHJvdHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL25vdy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTeW1ib2wuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ltYWdlc3JlYWR5L2Rpc3QvaW1hZ2VzcmVhZHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc2VjdGlvbkhpZ2hsaWdodGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3N0YXRpY0NvbHVtbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9hbGVydC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9yZWFkQ29va2llLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2NyZWF0ZUNvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9nZXREb21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvbmV3c2xldHRlci1zaWdudXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZGF0YS96aXBjb2Rlcy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2RhdGEvZm9ybS1lcnJvcnMuanNvbiIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9mb3JtRWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9kaXNwYXRjaEV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2ZhY2V0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9vd2xTZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9pT1M3SGFjay5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9zaGFyZS1mb3JtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcy1jb29raWUvc3JjL2pzLmNvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdmVuZG9yL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NsZWF2ZS5qcy9kaXN0L2NsZWF2ZS5taW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NsZWF2ZS5qcy9kaXN0L2FkZG9ucy9jbGVhdmUtcGhvbmUudXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZhcmlhYmxlcy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2NhcHRjaGFSZXNpemUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvcm90YXRpbmdUZXh0QW5pbWF0aW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3NlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWlzcy1wbGV0ZS1qcy9kaXN0L2J1bmRsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy90b2dnbGVPcGVuLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU1lbnUuanMiXSwibmFtZXMiOlsiZWxlbSIsImF0dHIiLCJkYXRhc2V0IiwiZ2V0QXR0cmlidXRlIiwicmVhZHkiLCJmbiIsImRvY3VtZW50IiwicmVhZHlTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJpbml0IiwidG9nZ2xlT3BlbiIsImFsZXJ0Iiwib2ZmY2FudmFzIiwiYWNjb3JkaW9uIiwic2ltcGxlQWNjb3JkaW9uIiwib3ZlcmxheSIsImZhY2V0cyIsInN0YXRpY0NvbHVtbiIsInN0aWNrTmF2IiwiZ3VueVNpZ251cCIsImZvcm1FZmZlY3RzIiwib3dsU2V0dGluZ3MiLCJpT1M3SGFjayIsImNhcHRjaGFSZXNpemUiLCJyb3RhdGluZ1RleHRBbmltYXRpb24iLCJzZWN0aW9uSGlnaGxpZ2h0ZXIiLCJ3aW5kb3ciLCIkIiwiU2hhcmVGb3JtIiwiQ3NzQ2xhc3MiLCJGT1JNIiwiZWFjaCIsImkiLCJlbCIsInNoYXJlRm9ybSIsImpRdWVyeSIsImNvbnZlcnRIZWFkZXJUb0J1dHRvbiIsIiRoZWFkZXJFbGVtIiwiZ2V0Iiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImhlYWRlckVsZW0iLCJuZXdIZWFkZXJFbGVtIiwiY3JlYXRlRWxlbWVudCIsImZvckVhY2giLCJhdHRyaWJ1dGVzIiwic2V0QXR0cmlidXRlIiwibm9kZVZhbHVlIiwiJG5ld0hlYWRlckVsZW0iLCJodG1sIiwiYXBwZW5kIiwidG9nZ2xlSGVhZGVyIiwibWFrZVZpc2libGUiLCJpbml0aWFsaXplSGVhZGVyIiwiJHJlbGF0ZWRQYW5lbCIsImlkIiwiYWRkQ2xhc3MiLCJvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJ0cmlnZ2VyIiwiYmx1ciIsInRvZ2dsZVBhbmVsIiwiJHBhbmVsRWxlbSIsImNzcyIsImRhdGEiLCJmaW5kIiwiaW5pdGlhbGl6ZVBhbmVsIiwibGFiZWxsZWRieSIsImNhbGN1bGF0ZVBhbmVsSGVpZ2h0IiwiaGVpZ2h0IiwidG9nZ2xlQWNjb3JkaW9uSXRlbSIsIiRpdGVtIiwicmVtb3ZlQ2xhc3MiLCJpbml0aWFsaXplQWNjb3JkaW9uSXRlbSIsIiRhY2NvcmRpb25Db250ZW50IiwiJGFjY29yZGlvbkluaXRpYWxIZWFkZXIiLCJvZmYiLCJsZW5ndGgiLCIkYWNjb3JkaW9uSGVhZGVyIiwidGFnTmFtZSIsInJlcGxhY2VXaXRoIiwiaW5pdGlhbGl6ZSIsIiRhY2NvcmRpb25FbGVtIiwibXVsdGlTZWxlY3RhYmxlIiwiY2hpbGRyZW4iLCJwcm94eSIsIiRuZXdJdGVtIiwidGFyZ2V0IiwiY2xvc2VzdCIsImhhc0NsYXNzIiwiJG9wZW5JdGVtIiwicmVJbml0aWFsaXplIiwicmVJbml0aWFsaXplQWNjb3JkaW9uIiwiJGFjY29yZGlvbnMiLCJub3QiLCJjbGljayIsImNoZWNrRWxlbWVudCIsIm5leHQiLCJpcyIsInNsaWRlVXAiLCJzbGlkZURvd24iLCJvZmZDYW52YXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwib2ZmQ2FudmFzRWxlbSIsIm9mZkNhbnZhc1NpZGUiLCJxdWVyeVNlbGVjdG9yIiwiZGV0YWlsIiwidGVzdCIsInRhYkluZGV4IiwiZm9jdXMiLCJvdmVybGF5RWxlbSIsInN0aWNreU5hdiIsIiRlbGVtIiwiJGVsZW1Db250YWluZXIiLCIkZWxlbUFydGljbGUiLCJzZXR0aW5ncyIsInN0aWNreUNsYXNzIiwiYWJzb2x1dGVDbGFzcyIsImxhcmdlQnJlYWtwb2ludCIsImFydGljbGVDbGFzcyIsInN0aWNreU1vZGUiLCJpc1N0aWNreSIsImlzQWJzb2x1dGUiLCJzd2l0Y2hQb2ludCIsInN3aXRjaFBvaW50Qm90dG9tIiwibGVmdE9mZnNldCIsImVsZW1XaWR0aCIsImVsZW1IZWlnaHQiLCJ0b2dnbGVTdGlja3kiLCJjdXJyZW50U2Nyb2xsUG9zIiwic2Nyb2xsVG9wIiwidXBkYXRlRGltZW5zaW9ucyIsImlzT25TY3JlZW4iLCJmb3JjZUNsZWFyIiwibGVmdCIsIndpZHRoIiwidG9wIiwiYm90dG9tIiwic2V0T2Zmc2V0VmFsdWVzIiwib2Zmc2V0Iiwib3V0ZXJIZWlnaHQiLCJwYXJzZUludCIsIm91dGVyV2lkdGgiLCJzdGlja3lNb2RlT24iLCJ0aHJvdHRsZSIsIm9yaWdpbmFsRXZlbnQiLCJzdGlja3lNb2RlT2ZmIiwib25SZXNpemUiLCJsYXJnZU1vZGUiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImRlYm91bmNlIiwiaW1hZ2VzUmVhZHkiLCJib2R5IiwidGhlbiIsIndpbiIsInZpZXdwb3J0Iiwic2Nyb2xsTGVmdCIsInJpZ2h0IiwiYm91bmRzIiwiJHN0aWNreU5hdnMiLCIkb3V0ZXJDb250YWluZXIiLCIkYXJ0aWNsZSIsIiRuYXZpZ2F0aW9uTGlua3MiLCIkc2VjdGlvbnMiLCIkc2VjdGlvbnNSZXZlcnNlZCIsInJldmVyc2UiLCJzZWN0aW9uSWRUb25hdmlnYXRpb25MaW5rIiwib3B0aW1pemVkIiwic2Nyb2xsUG9zaXRpb24iLCJjdXJyZW50U2VjdGlvbiIsInNlY3Rpb25Ub3AiLCIkbmF2aWdhdGlvbkxpbmsiLCJzY3JvbGwiLCJzdGlja3lDb250ZW50Iiwibm90U3RpY2t5Q2xhc3MiLCJib3R0b21DbGFzcyIsImNhbGNXaW5kb3dQb3MiLCJzdGlja3lDb250ZW50RWxlbSIsImVsZW1Ub3AiLCJwYXJlbnRFbGVtZW50IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiaXNQYXN0Qm90dG9tIiwiaW5uZXJIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJvcGVuQ2xhc3MiLCJkaXNwbGF5QWxlcnQiLCJzaWJsaW5nRWxlbSIsImFsZXJ0SGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY3VycmVudFBhZGRpbmciLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInN0eWxlIiwicGFkZGluZ0JvdHRvbSIsInJlbW92ZUFsZXJ0UGFkZGluZyIsImNoZWNrQWxlcnRDb29raWUiLCJjb29raWVOYW1lIiwicmVhZENvb2tpZSIsImNvb2tpZSIsImFkZEFsZXJ0Q29va2llIiwiY3JlYXRlQ29va2llIiwiZ2V0RG9tYWluIiwibG9jYXRpb24iLCJhbGVydHMiLCJhbGVydFNpYmxpbmciLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwiUmVnRXhwIiwiZXhlYyIsInBvcCIsIm5hbWUiLCJ2YWx1ZSIsImRvbWFpbiIsImRheXMiLCJleHBpcmVzIiwiRGF0ZSIsImdldFRpbWUiLCJ0b0dNVFN0cmluZyIsInVybCIsInJvb3QiLCJwYXJzZVVybCIsImhyZWYiLCJob3N0bmFtZSIsInNsaWNlIiwibWF0Y2giLCJzcGxpdCIsImpvaW4iLCJlcnJvck1zZyIsInZhbGlkYXRlRmllbGRzIiwiZm9ybSIsImZpZWxkcyIsInNlcmlhbGl6ZUFycmF5IiwicmVkdWNlIiwib2JqIiwiaXRlbSIsInJlcXVpcmVkRmllbGRzIiwiZW1haWxSZWdleCIsInppcFJlZ2V4IiwicGhvbmVSZWdleCIsImdyb3VwU2VsZXRlZCIsIk9iamVjdCIsImtleXMiLCJhIiwiaW5jbHVkZXMiLCJoYXNFcnJvcnMiLCJmaWVsZE5hbWUiLCJwYXJlbnRzIiwiRU1BSUwiLCJaSVAiLCJQSE9ORU5VTSIsInNpYmxpbmdzIiwiZm9ybUVycm9ycyIsIngiLCJCT1JPVUdIIiwiYXNzaWduQm9yb3VnaCIsInN1Ym1pdFNpZ251cCIsInppcCIsImJvcm91Z2giLCJpbmRleCIsInppcGNvZGVzIiwiZmluZEluZGV4IiwiY29kZXMiLCJpbmRleE9mIiwiZm9ybURhdGEiLCJhamF4IiwidHlwZSIsImRhdGFUeXBlIiwiY2FjaGUiLCJjb250ZW50VHlwZSIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInJlc3VsdCIsImNsYXNzTmFtZSIsIm1zZyIsImVycm9yIiwiZm9ybUNsYXNzIiwiJGZvcm0iLCJrZXl1cCIsImNoYXJMZW4iLCJ2YWwiLCJ0ZXh0IiwiaGFuZGxlRm9jdXMiLCJ3cmFwcGVyRWxlbSIsInBhcmVudE5vZGUiLCJoYW5kbGVCbHVyIiwidHJpbSIsImlucHV0cyIsImlucHV0RWxlbSIsImRpc3BhdGNoRXZlbnQiLCJldmVudFR5cGUiLCJjcmVhdGVFdmVudCIsImluaXRFdmVudCIsImNyZWF0ZUV2ZW50T2JqZWN0IiwiZmlyZUV2ZW50Iiwib3dsIiwib3dsQ2Fyb3VzZWwiLCJhbmltYXRlSW4iLCJhbmltYXRlT3V0IiwiaXRlbXMiLCJsb29wIiwibWFyZ2luIiwiZG90cyIsImF1dG9wbGF5IiwiYXV0b3BsYXlUaW1lb3V0IiwiYXV0b3BsYXlIb3ZlclBhdXNlIiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwic2Nyb2xsVG8iLCJWYXJpYWJsZXMiLCJyZXF1aXJlIiwiX2VsIiwiX2lzVmFsaWQiLCJfaXNCdXN5IiwiX2lzRGlzYWJsZWQiLCJfaW5pdGlhbGl6ZWQiLCJfcmVjYXB0Y2hhUmVxdWlyZWQiLCJfcmVjYXB0Y2hhVmVyaWZpZWQiLCJfcmVjYXB0Y2hhaW5pdCIsInNlbGVjdGVkIiwiX21hc2tQaG9uZSIsIlNIT1dfRElTQ0xBSU1FUiIsIl9kaXNjbGFpbWVyIiwiZSIsIl92YWxpZGF0ZSIsIl9zdWJtaXQiLCJncmVjYXB0Y2hhIiwicmVzZXQiLCJFUlJPUl9NU0ciLCJfc2hvd0Vycm9yIiwiTWVzc2FnZSIsIlJFQ0FQVENIQSIsInZpZXdDb3VudCIsIkNvb2tpZXMiLCJfaW5pdFJlY2FwdGNoYSIsInNldCIsImZvY3Vzb3V0IiwicmVtb3ZlQXR0ciIsImlucHV0IiwiY2xlYXZlIiwicGhvbmUiLCJwaG9uZVJlZ2lvbkNvZGUiLCJkZWxpbWl0ZXIiLCJ2aXNpYmxlIiwiJGVsIiwiJGNsYXNzIiwiSElEREVOIiwiQU5JTUFURV9ESVNDTEFJTUVSIiwiaW5uZXJXaWR0aCIsIiR0YXJnZXQiLCJ2YWxpZGl0eSIsIiR0ZWwiLCJfdmFsaWRhdGVQaG9uZU51bWJlciIsIkVSUk9SIiwibnVtIiwiX3BhcnNlUGhvbmVOdW1iZXIiLCJQSE9ORSIsIlJFUVVJUkVEIiwib25lIiwiJGVsUGFyZW50cyIsIlV0aWxpdHkiLCJsb2NhbGl6ZSIsIlNVQ0NFU1MiLCIkc3Bpbm5lciIsIlNQSU5ORVIiLCIkc3VibWl0IiwicGF5bG9hZCIsInNlcmlhbGl6ZSIsInByb3AiLCJkaXNhYmxlZCIsImNzc1RleHQiLCJwb3N0IiwiZG9uZSIsIl9zaG93U3VjY2VzcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJtZXNzYWdlIiwiZmFpbCIsIlNFUlZFUiIsImFsd2F5cyIsIiRzY3JpcHQiLCJhc3luYyIsImRlZmVyIiwic2NyZWVuZXJDYWxsYmFjayIsInJlbmRlciIsImdldEVsZW1lbnRCeUlkIiwic2NyZWVuZXJSZWNhcHRjaGEiLCJzY3JlZW5lclJlY2FwdGNoYVJlc2V0IiwiTkVFRFNfRElTQ0xBSU1FUiIsIlNVQk1JVF9CVE4iLCJnZXRVcmxQYXJhbWV0ZXIiLCJxdWVyeVN0cmluZyIsInF1ZXJ5Iiwic2VhcmNoIiwicGFyYW0iLCJyZXBsYWNlIiwicmVnZXgiLCJyZXN1bHRzIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZmluZFZhbHVlcyIsIm9iamVjdCIsInRhcmdldFByb3AiLCJ0cmF2ZXJzZU9iamVjdCIsImtleSIsImhhc093blByb3BlcnR5IiwicHVzaCIsInRvRG9sbGFyQW1vdW50IiwiTWF0aCIsImFicyIsInJvdW5kIiwicGFyc2VGbG9hdCIsInRvRml4ZWQiLCJzbHVnTmFtZSIsImxvY2FsaXplZFN0cmluZ3MiLCJMT0NBTElaRURfU1RSSU5HUyIsIl8iLCJmaW5kV2hlcmUiLCJzbHVnIiwibGFiZWwiLCJpc1ZhbGlkRW1haWwiLCJlbWFpbCIsImNoZWNrVmFsaWRpdHkiLCJDT05GSUciLCJERUZBVUxUX0xBVCIsIkRFRkFVTFRfTE5HIiwiR09PR0xFX0FQSSIsIkdPT0dMRV9TVEFUSUNfQVBJIiwiR1JFQ0FQVENIQV9TSVRFX0tFWSIsIlNDUkVFTkVSX01BWF9IT1VTRUhPTEQiLCJVUkxfUElOX0JMVUUiLCJVUkxfUElOX0JMVUVfMlgiLCJVUkxfUElOX0dSRUVOIiwiVVJMX1BJTl9HUkVFTl8yWCIsInNjYWxlQ2FwdGNoYSIsInJlQ2FwdGNoYVdpZHRoIiwiY29udGFpbmVyV2lkdGgiLCJjYXB0Y2hhU2NhbGUiLCJ0cmFuc2Zvcm0iLCJyZXNpemUiLCJ0ZXJtcyIsInJvdGF0ZVRlcm0iLCJjdCIsImZhZGVJbiIsImRlbGF5IiwiZmFkZU91dCIsIlNlYXJjaCIsIl9pbnB1dHMiLCJzZWxlY3RvcnMiLCJNQUlOIiwiX3N1Z2dlc3Rpb25zIiwicGFyc2UiLCJqc1NlYXJjaFN1Z2dlc3Rpb25zIiwiX01pc3NQbGV0ZSIsIm9wdGlvbnMiLCJqc1NlYXJjaERyb3Bkb3duQ2xhc3MiLCJsaW5rQWN0aXZlQ2xhc3MiLCJ0b2dnbGVFbGVtcyIsInRvZ2dsZUVsZW0iLCJ0YXJnZXRFbGVtU2VsZWN0b3IiLCJ0YXJnZXRFbGVtIiwidG9nZ2xlRXZlbnQiLCJ0b2dnbGVDbGFzcyIsInRvZ2dsZSIsImNvbnRhaW5zIiwiQ3VzdG9tRXZlbnQiLCJpbml0Q3VzdG9tRXZlbnQiLCJjdXJyZW50VGFyZ2V0IiwiZGVsZWdhdGVUYXJnZXQiLCJzaG93IiwiaGlkZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtB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Q0EsMENBQTBDLDBCQUEwQjtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxQkFBcUIsY0FBYztBQUNuQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsWUFBWTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVk7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLGVBQWU7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsZUFBZTtBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0EseUJBQXlCLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxZQUFZO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxZQUFZO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSw0Q0FBNEMsbUJBQW1CO0FBQy9EO0FBQ0E7QUFDQSx5Q0FBeUMsWUFBWTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkVBQTZFO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7O0FBRUE7Ozs7Ozs7QUM3Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyQkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDakJBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDMUJBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ2pFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O3lDQzVCQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFLGtCQUFrQjtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvQkFBb0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxREFBcUQsY0FBYztBQUNuRTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIscUJBQXFCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQTBEO0FBQ3JFLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBLGFBQWEsVUFBVTtBQUN2QixlQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7OztBQUdIO0FBQ0EsYUFBYSxVQUFVO0FBQ3ZCLGdCQUFnQjtBQUNoQixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7O0FBR0g7QUFDQSxhQUFhLG1CQUFtQjtBQUNoQyxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7O0FBR0g7QUFDQSxhQUFhLFNBQVM7QUFDdEIsYUFBYSxTQUFTO0FBQ3RCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0EsYUFBYSxtQkFBbUI7QUFDaEMsY0FBYyxvQ0FBb0M7QUFDbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQSxhQUFhLG1EQUFtRDtBQUNoRSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLFNBQVM7QUFDcEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOzs7Ozs7Ozs7QUNwcEJEOzs7Ozs7QUFNQSx5REFBZSxZQUFXO0FBQ3hCLE1BQUlDLG1CQUFtQnpJLEVBQUUsMEJBQUYsQ0FBdkI7QUFDQSxNQUFJMEksWUFBWTFJLEVBQUUsU0FBRixDQUFoQjtBQUNBLE1BQUkySSxvQkFBb0IzSSxFQUFFQSxFQUFFLFNBQUYsRUFBYVcsR0FBYixHQUFtQmlJLE9BQW5CLEVBQUYsQ0FBeEI7QUFDQSxNQUFJQyw0QkFBNEIsRUFBaEM7QUFDQTs7QUFFQUgsWUFBVXRJLElBQVYsQ0FBZSxZQUFXO0FBQ3hCeUksOEJBQTBCN0ksRUFBRSxJQUFGLEVBQVExQixJQUFSLENBQWEsSUFBYixDQUExQixJQUFnRDBCLEVBQUUscUNBQXFDQSxFQUFFLElBQUYsRUFBUTFCLElBQVIsQ0FBYSxJQUFiLENBQXJDLEdBQTBELElBQTVELENBQWhEO0FBQ0QsR0FGRDs7QUFJQSxXQUFTd0ssU0FBVCxHQUFxQjtBQUNuQixRQUFJQyxpQkFBaUIvSSxFQUFFRCxNQUFGLEVBQVV5RyxTQUFWLEVBQXJCOztBQUVBbUMsc0JBQWtCdkksSUFBbEIsQ0FBdUIsWUFBVztBQUNoQyxVQUFJNEksaUJBQWlCaEosRUFBRSxJQUFGLENBQXJCO0FBQ0EsVUFBSWlKLGFBQWFELGVBQWUvQixNQUFmLEdBQXdCSCxHQUF6Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFJaUMsa0JBQWtCRSxVQUFsQixJQUFpQ0QsZUFBZXhFLEVBQWYsQ0FBa0IscUJBQWxCLEtBQTRDeUUsYUFBYUYsY0FBOUYsRUFBK0c7QUFDN0csWUFBSW5ILEtBQUtvSCxlQUFlMUssSUFBZixDQUFvQixJQUFwQixDQUFUO0FBQ0EsWUFBSTRLLGtCQUFrQkwsMEJBQTBCakgsRUFBMUIsQ0FBdEI7QUFDQSxZQUFJLENBQUNzSCxnQkFBZ0JuRixRQUFoQixDQUF5QixXQUF6QixDQUFELElBQTBDLENBQUMvRCxFQUFFLFNBQUYsRUFBYStELFFBQWIsQ0FBc0IsOEJBQXRCLENBQS9DLEVBQXNHO0FBQ2xHMEUsMkJBQWlCM0YsV0FBakIsQ0FBNkIsV0FBN0I7QUFDQW9HLDBCQUFnQnJILFFBQWhCLENBQXlCLFdBQXpCO0FBQ0g7QUFDRCxlQUFPLEtBQVA7QUFDRDtBQUNGLEtBbEJEO0FBbUJEOztBQUVEaUg7QUFDQTlJLElBQUVELE1BQUYsRUFBVW9KLE1BQVYsQ0FBaUIsWUFBVztBQUMxQkw7QUFDRCxHQUZEO0FBR0QsQzs7Ozs7Ozs7QUM3Q0Q7QUFBQTtBQUFBOzs7Ozs7OztBQVFBOztBQUVBLHlEQUFlLFlBQVc7QUFDeEIsTUFBTU0sZ0JBQWdCekssU0FBU2lHLGdCQUFULENBQTBCLFlBQTFCLENBQXRCO0FBQ0EsTUFBTXlFLGlCQUFpQixlQUF2QjtBQUNBLE1BQU1DLGNBQWMsV0FBcEI7O0FBRUE7Ozs7QUFJQSxXQUFTQyxhQUFULENBQXVCQyxpQkFBdkIsRUFBMEM7QUFDeEMsUUFBSUMsVUFBVUQsa0JBQWtCRSxhQUFsQixDQUFnQ0MscUJBQWhDLEdBQXdEN0MsR0FBdEU7QUFDQSxRQUFJOEMsZUFBZTdKLE9BQU84SixXQUFQLEdBQXFCTCxrQkFBa0JFLGFBQWxCLENBQWdDSSxZQUFyRCxHQUFvRU4sa0JBQWtCRSxhQUFsQixDQUFnQ0MscUJBQWhDLEdBQXdEN0MsR0FBNUgsR0FBa0ksQ0FBcko7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBSTJDLFVBQVUsQ0FBZCxFQUFpQjtBQUNmRCx3QkFBa0JPLFNBQWxCLENBQTRCQyxHQUE1QixDQUFnQ1gsY0FBaEM7QUFDRCxLQUZELE1BRU87QUFDTEcsd0JBQWtCTyxTQUFsQixDQUE0QkUsTUFBNUIsQ0FBbUNaLGNBQW5DO0FBQ0Q7QUFDRCxRQUFJTyxZQUFKLEVBQWtCO0FBQ2hCSix3QkFBa0JPLFNBQWxCLENBQTRCQyxHQUE1QixDQUFnQ1YsV0FBaEM7QUFDRCxLQUZELE1BRU87QUFDTEUsd0JBQWtCTyxTQUFsQixDQUE0QkUsTUFBNUIsQ0FBbUNYLFdBQW5DO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJRixhQUFKLEVBQW1CO0FBQ2pCbkksSUFBQSxzREFBQUEsQ0FBUW1JLGFBQVIsRUFBdUIsVUFBU0ksaUJBQVQsRUFBNEI7QUFDakRELG9CQUFjQyxpQkFBZDs7QUFFQTs7Ozs7QUFLQXpKLGFBQU9sQixnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxZQUFXO0FBQzNDMEssc0JBQWNDLGlCQUFkO0FBQ0QsT0FGRCxFQUVHLEtBRkg7O0FBSUE7Ozs7O0FBS0F6SixhQUFPbEIsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBVztBQUMzQzBLLHNCQUFjQyxpQkFBZDtBQUNELE9BRkQsRUFFRyxLQUZIO0FBR0QsS0FwQkQ7QUFxQkQ7QUFDRixDOzs7Ozs7Ozs7Ozs7Ozs7QUM3REQ7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7QUFJQSx5REFBZSxVQUFTVSxTQUFULEVBQW9CO0FBQ2pDLE1BQUksQ0FBQ0EsU0FBTCxFQUFnQjtBQUNkQSxnQkFBWSxTQUFaO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BLFdBQVNDLFlBQVQsQ0FBc0JuTCxLQUF0QixFQUE2Qm9MLFdBQTdCLEVBQTBDO0FBQ3hDcEwsVUFBTStLLFNBQU4sQ0FBZ0JDLEdBQWhCLENBQW9CRSxTQUFwQjtBQUNBLFFBQU1HLGNBQWNyTCxNQUFNc0wsWUFBMUI7QUFDQSxRQUFNQyxpQkFBaUJwRCxTQUFTcEgsT0FBT3lLLGdCQUFQLENBQXdCSixXQUF4QixFQUFxQ0ssZ0JBQXJDLENBQXNELGdCQUF0RCxDQUFULEVBQWtGLEVBQWxGLENBQXZCO0FBQ0FMLGdCQUFZTSxLQUFaLENBQWtCQyxhQUFsQixHQUFtQ04sY0FBY0UsY0FBZixHQUFpQyxJQUFuRTtBQUNEOztBQUVEOzs7O0FBSUEsV0FBU0ssa0JBQVQsQ0FBNEJSLFdBQTVCLEVBQXlDO0FBQ3ZDQSxnQkFBWU0sS0FBWixDQUFrQkMsYUFBbEIsR0FBa0MsSUFBbEM7QUFDRDs7QUFFRDs7Ozs7QUFLQSxXQUFTRSxnQkFBVCxDQUEwQjdMLEtBQTFCLEVBQWlDO0FBQy9CLFFBQU04TCxhQUFhLG9FQUFBdk0sQ0FBUVMsS0FBUixFQUFlLFFBQWYsQ0FBbkI7QUFDQSxRQUFJLENBQUM4TCxVQUFMLEVBQWlCO0FBQ2YsYUFBTyxLQUFQO0FBQ0Q7QUFDRCxXQUFPLE9BQU8sdUVBQUFDLENBQVdELFVBQVgsRUFBdUJuTSxTQUFTcU0sTUFBaEMsQ0FBUCxLQUFtRCxXQUExRDtBQUNEOztBQUVEOzs7O0FBSUEsV0FBU0MsY0FBVCxDQUF3QmpNLEtBQXhCLEVBQStCO0FBQzdCLFFBQU04TCxhQUFhLG9FQUFBdk0sQ0FBUVMsS0FBUixFQUFlLFFBQWYsQ0FBbkI7QUFDQSxRQUFJOEwsVUFBSixFQUFnQjtBQUNkSSxNQUFBLHlFQUFBQSxDQUFhSixVQUFiLEVBQXlCLFdBQXpCLEVBQXNDLHNFQUFBSyxDQUFVcEwsT0FBT3FMLFFBQWpCLEVBQTJCLEtBQTNCLENBQXRDLEVBQXlFLEdBQXpFO0FBQ0Q7QUFDRjs7QUFFRCxNQUFNQyxTQUFTMU0sU0FBU2lHLGdCQUFULENBQTBCLFdBQTFCLENBQWY7QUFDQSxNQUFJeUcsT0FBT2xJLE1BQVgsRUFBbUI7QUFDakJsQyxJQUFBLHNEQUFBQSxDQUFRb0ssTUFBUixFQUFnQixVQUFTck0sS0FBVCxFQUFnQjtBQUM5QixVQUFJLENBQUM2TCxpQkFBaUI3TCxLQUFqQixDQUFMLEVBQThCO0FBQzVCLFlBQU1zTSxlQUFldE0sTUFBTXVNLHNCQUEzQjtBQUNBcEIscUJBQWFuTCxLQUFiLEVBQW9Cc00sWUFBcEI7O0FBRUE7Ozs7Ozs7QUFPQXRNLGNBQU1ILGdCQUFOLENBQXVCLGlCQUF2QixFQUEwQyxVQUFTa0QsS0FBVCxFQUFnQjtBQUN4RDtBQUNBLGNBQUssT0FBT0EsTUFBTWlELE1BQWIsS0FBd0IsU0FBeEIsSUFBcUMsQ0FBQ2pELE1BQU1pRCxNQUE3QyxJQUNELFFBQU9qRCxNQUFNaUQsTUFBYixNQUF3QixRQUF4QixJQUFvQyxDQUFDakQsTUFBTWlELE1BQU4sQ0FBYUEsTUFEckQsRUFFRTtBQUNBaUcsMkJBQWVqTSxLQUFmO0FBQ0E0TCwrQkFBbUJVLFlBQW5CO0FBQ0Q7QUFDRixTQVJEO0FBU0Q7QUFDRixLQXRCRDtBQXVCRDtBQUNGLEM7Ozs7Ozs7QUM1RkQ7Ozs7OztBQU1BLHlEQUFlLFVBQVNSLFVBQVQsRUFBcUJFLE1BQXJCLEVBQTZCO0FBQzFDLFNBQU8sQ0FBQ1EsT0FBTyxhQUFhVixVQUFiLEdBQTBCLFVBQWpDLEVBQTZDVyxJQUE3QyxDQUFrRFQsTUFBbEQsS0FBNkQsRUFBOUQsRUFBa0VVLEdBQWxFLEVBQVA7QUFDRCxDOzs7Ozs7O0FDUkQ7Ozs7Ozs7QUFPQSx5REFBZSxVQUFTQyxJQUFULEVBQWVDLEtBQWYsRUFBc0JDLE1BQXRCLEVBQThCQyxJQUE5QixFQUFvQztBQUNqRCxNQUFNQyxVQUFVRCxPQUFPLGVBQWdCLElBQUlFLElBQUosQ0FBU0YsT0FBTyxLQUFQLEdBQWdCLElBQUlFLElBQUosRUFBRCxDQUFhQyxPQUFiLEVBQXhCLENBQUQsQ0FBa0RDLFdBQWxELEVBQXRCLEdBQXdGLEVBQXhHO0FBQ0F2TixXQUFTcU0sTUFBVCxHQUFrQlcsT0FBTyxHQUFQLEdBQWFDLEtBQWIsR0FBcUJHLE9BQXJCLEdBQStCLG1CQUEvQixHQUFxREYsTUFBdkU7QUFDRCxDOzs7Ozs7O0FDVkQ7Ozs7OztBQU1BLHlEQUFlLFVBQVNNLEdBQVQsRUFBY0MsSUFBZCxFQUFvQjtBQUNqQyxXQUFTQyxRQUFULENBQWtCRixHQUFsQixFQUF1QjtBQUNyQixRQUFNdEksU0FBU2xGLFNBQVNxQyxhQUFULENBQXVCLEdBQXZCLENBQWY7QUFDQTZDLFdBQU95SSxJQUFQLEdBQWNILEdBQWQ7QUFDQSxXQUFPdEksTUFBUDtBQUNEOztBQUVELE1BQUksT0FBT3NJLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUMzQkEsVUFBTUUsU0FBU0YsR0FBVCxDQUFOO0FBQ0Q7QUFDRCxNQUFJTixTQUFTTSxJQUFJSSxRQUFqQjtBQUNBLE1BQUlILElBQUosRUFBVTtBQUNSLFFBQU1JLFFBQVFYLE9BQU9ZLEtBQVAsQ0FBYSxPQUFiLElBQXdCLENBQUMsQ0FBekIsR0FBNkIsQ0FBQyxDQUE1QztBQUNBWixhQUFTQSxPQUFPYSxLQUFQLENBQWEsR0FBYixFQUFrQkYsS0FBbEIsQ0FBd0JBLEtBQXhCLEVBQStCRyxJQUEvQixDQUFvQyxHQUFwQyxDQUFUO0FBQ0Q7QUFDRCxTQUFPZCxNQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7QUN0QkQ7QUFBQTtBQUFBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUEseURBQWUsWUFBVztBQUN4QjtBQUNBLE1BQU1lLFdBQVcseUVBQWpCOztBQUVBOzs7OztBQUtBLFdBQVNDLGNBQVQsQ0FBd0JDLElBQXhCLEVBQThCL0ssS0FBOUIsRUFBcUM7O0FBRW5DQSxVQUFNQyxjQUFOOztBQUVBLFFBQU0rSyxTQUFTRCxLQUFLRSxjQUFMLEdBQXNCQyxNQUF0QixDQUE2QixVQUFDQyxHQUFELEVBQU1DLElBQU47QUFBQSxhQUFnQkQsSUFBSUMsS0FBS3hCLElBQVQsSUFBaUJ3QixLQUFLdkIsS0FBdEIsRUFBNkJzQixHQUE3QztBQUFBLEtBQTdCLEVBQWdGLEVBQWhGLENBQWY7QUFDQSxRQUFNRSxpQkFBaUJOLEtBQUt2SyxJQUFMLENBQVUsWUFBVixDQUF2QjtBQUNBLFFBQU04SyxhQUFhLElBQUk3QixNQUFKLENBQVcsY0FBWCxDQUFuQjtBQUNBLFFBQU04QixXQUFXLElBQUk5QixNQUFKLENBQVcsbUJBQVgsQ0FBakI7QUFDQSxRQUFNK0IsYUFBYSxJQUFJL0IsTUFBSixDQUFXLDZEQUFYLENBQW5CO0FBQ0EsUUFBSWdDLGVBQWVDLE9BQU9DLElBQVAsQ0FBWVgsTUFBWixFQUFvQnhLLElBQXBCLENBQXlCO0FBQUEsYUFBSW9MLEVBQUVDLFFBQUYsQ0FBVyxPQUFYLENBQUo7QUFBQSxLQUF6QixJQUFtRCxJQUFuRCxHQUEwRCxLQUE3RTtBQUNBLFFBQUlDLFlBQVksS0FBaEI7O0FBRUE7QUFDQVQsbUJBQWVoTixJQUFmLENBQW9CLFlBQVc7QUFDN0IsVUFBTTBOLFlBQVk5TixFQUFFLElBQUYsRUFBUTFCLElBQVIsQ0FBYSxNQUFiLENBQWxCO0FBQ0EwQixRQUFFLElBQUYsRUFBUThDLFdBQVIsQ0FBb0IsVUFBcEI7O0FBRUEsVUFBSSxPQUFPaUssT0FBT2UsU0FBUCxDQUFQLEtBQTZCLFdBQTlCLElBQThDLENBQUNOLFlBQWxELEVBQWdFO0FBQzlESyxvQkFBWSxJQUFaO0FBQ0E3TixVQUFFLElBQUYsRUFBUStOLE9BQVIsQ0FBZ0IsVUFBaEIsRUFBNEJ4TCxJQUE1QixDQUFpQyxzQkFBakMsRUFBeURqQixJQUF6RCxDQUE4RCwyQ0FBOUQsRUFBMkc7O0FBRTNHdEIsVUFBRSxJQUFGLEVBQVE2QixRQUFSLENBQWlCLFVBQWpCO0FBQ0Q7O0FBRUQsVUFBSWlNLGFBQWEsT0FBYixJQUF3QixDQUFDVCxXQUFXcEksSUFBWCxDQUFnQjhILE9BQU9pQixLQUF2QixDQUExQixJQUNBRixhQUFhLEtBQWIsSUFBc0IsQ0FBQ1IsU0FBU3JJLElBQVQsQ0FBYzhILE9BQU9rQixHQUFyQixDQUR2QixJQUVBSCxhQUFhLFVBQWIsSUFBMkIsQ0FBQ1AsV0FBV3RJLElBQVgsQ0FBZ0I4SCxPQUFPbUIsUUFBdkIsQ0FBNUIsSUFBZ0VuQixPQUFPbUIsUUFBUCxDQUFnQi9LLE1BQWhCLElBQXlCLENBRjVGLEVBR0U7QUFDQTBLLG9CQUFZLElBQVo7QUFDQTdOLFVBQUUsSUFBRixFQUFRbU8sUUFBUixDQUFpQixzQkFBakIsRUFBeUM3TSxJQUF6QyxDQUE4QyxRQUFRLDhEQUFBOE0sQ0FBVzdMLElBQVgsQ0FBZ0I7QUFBQSxpQkFBSzhMLEVBQUVQLFNBQUYsQ0FBTDtBQUFBLFNBQWhCLEVBQW1DQSxTQUFuQyxDQUFSLEdBQXdELE1BQXRHO0FBQ0E5TixVQUFFLElBQUYsRUFBUTZCLFFBQVIsQ0FBaUIsVUFBakI7QUFDRDs7QUFFRDtBQUNBLFVBQUlpTSxhQUFhLE9BQWIsSUFBd0JULFdBQVdwSSxJQUFYLENBQWdCOEgsT0FBT2lCLEtBQXZCLENBQTVCLEVBQTJEO0FBQ3pEakIsZUFBT3VCLE9BQVAsR0FBaUJDLGNBQWN4QixPQUFPa0IsR0FBckIsQ0FBakI7QUFDRDs7QUFFRCxVQUFJSCxhQUFhLE9BQWQsSUFBMkJBLGFBQWEsS0FBeEMsSUFBbURBLGFBQWEsVUFBaEUsSUFBK0VmLE9BQU9lLFNBQVAsTUFBc0IsRUFBeEcsRUFDRTtBQUNBRCxvQkFBWSxJQUFaO0FBQ0E3TixVQUFFLElBQUYsRUFBUW1PLFFBQVIsQ0FBaUIsc0JBQWpCLEVBQXlDN00sSUFBekMsQ0FBOEMsUUFBUSw4REFBQThNLENBQVc3TCxJQUFYLENBQWdCO0FBQUEsaUJBQUs4TCxFQUFFUCxTQUFGLENBQUw7QUFBQSxTQUFoQixFQUFtQ0EsU0FBbkMsQ0FBUixHQUF3RCxNQUF0RztBQUNBOU4sVUFBRSxJQUFGLEVBQVE2QixRQUFSLENBQWlCLFVBQWpCO0FBQ0Q7QUFFRixLQWhDRDs7QUFrQ0E7QUFDQSxRQUFJZ00sU0FBSixFQUFlO0FBQ2JmLFdBQUt2SyxJQUFMLENBQVUsYUFBVixFQUF5QmpCLElBQXpCLFNBQW9Dc0wsUUFBcEM7QUFDRCxLQUZELE1BRU87QUFDTDRCLG1CQUFhMUIsSUFBYixFQUFtQkMsTUFBbkI7QUFDRDtBQUNGOztBQUVEOzs7O0FBSUEsV0FBU3dCLGFBQVQsQ0FBdUJFLEdBQXZCLEVBQTJCO0FBQ3pCLFFBQUlDLFVBQVUsRUFBZDtBQUNBLFFBQUlDLFFBQVEsMkRBQUFDLENBQVNDLFNBQVQsQ0FBbUI7QUFBQSxhQUFLUixFQUFFUyxLQUFGLENBQVFDLE9BQVIsQ0FBZ0I1SCxTQUFTc0gsR0FBVCxDQUFoQixJQUFpQyxDQUFDLENBQXZDO0FBQUEsS0FBbkIsQ0FBWjs7QUFFQSxRQUFHRSxVQUFVLENBQUMsQ0FBZCxFQUFnQjtBQUNkRCxnQkFBVSxXQUFWO0FBQ0QsS0FGRCxNQUVNO0FBQ0pBLGdCQUFVLDJEQUFBRSxDQUFTRCxLQUFULEVBQWdCRCxPQUExQjtBQUNEOztBQUVELFdBQU9BLE9BQVA7QUFDRDs7QUFFRDs7OztBQUlBLFdBQVNGLFlBQVQsQ0FBc0IxQixJQUF0QixFQUE0QmtDLFFBQTVCLEVBQXFDO0FBQ25DaFAsTUFBRWlQLElBQUYsQ0FBTztBQUNMOUMsV0FBS1csS0FBS3hPLElBQUwsQ0FBVSxRQUFWLENBREE7QUFFTDRRLFlBQU1wQyxLQUFLeE8sSUFBTCxDQUFVLFFBQVYsQ0FGRDtBQUdMNlEsZ0JBQVUsTUFITCxFQUdZO0FBQ2pCQyxhQUFPLEtBSkY7QUFLTDlNLFlBQU0wTSxRQUxEO0FBTUxLLG1CQUFhLGlDQU5SO0FBT0xDLGVBQVMsaUJBQVNDLFFBQVQsRUFBbUI7QUFDMUIsWUFBR0EsU0FBU0MsTUFBVCxLQUFvQixTQUF2QixFQUFpQztBQUMvQixjQUFHMUMsS0FBSyxDQUFMLEVBQVEyQyxTQUFSLENBQWtCVixPQUFsQixDQUEwQixTQUExQixJQUF1QyxDQUFDLENBQTNDLEVBQTZDO0FBQzNDLGdCQUFHUSxTQUFTRyxHQUFULENBQWE5QixRQUFiLENBQXNCLG9CQUF0QixDQUFILEVBQStDO0FBQzdDZCxtQkFBS3hMLElBQUwsQ0FBVSw2R0FBVjtBQUNELGFBRkQsTUFFTTtBQUNKd0wsbUJBQUt4TCxJQUFMLENBQVUsbUVBQVY7QUFDRDtBQUNGLFdBTkQsTUFNTTtBQUNKLGdCQUFHaU8sU0FBU0csR0FBVCxDQUFhOUIsUUFBYixDQUFzQixpQ0FBdEIsQ0FBSCxFQUE0RDtBQUMxRGQsbUJBQUt2SyxJQUFMLENBQVUsYUFBVixFQUF5QmpCLElBQXpCLENBQThCLHdFQUE5QjtBQUNELGFBRkQsTUFFTSxJQUFHaU8sU0FBU0csR0FBVCxDQUFhOUIsUUFBYixDQUFzQixvQkFBdEIsQ0FBSCxFQUErQztBQUNuRGQsbUJBQUt2SyxJQUFMLENBQVUsYUFBVixFQUF5QmpCLElBQXpCLENBQThCLHFGQUE5QjtBQUNEO0FBQ0Y7QUFDRixTQWRELE1BY007QUFDSixjQUFHd0wsS0FBSyxDQUFMLEVBQVEyQyxTQUFSLENBQWtCVixPQUFsQixDQUEwQixTQUExQixJQUF1QyxDQUFDLENBQTNDLEVBQTZDO0FBQzNDakMsaUJBQUt4TCxJQUFMLENBQVUsOEZBQVY7QUFDRCxXQUZELE1BRUs7QUFDSHdMLGlCQUFLeEwsSUFBTCxDQUFVLDZLQUFWO0FBQ0Q7QUFDRjtBQUNGLE9BN0JJO0FBOEJMcU8sYUFBTyxlQUFTSixRQUFULEVBQW1CO0FBQ3hCekMsYUFBS3ZLLElBQUwsQ0FBVSxhQUFWLEVBQXlCakIsSUFBekIsQ0FBOEIsc0VBQTlCO0FBQ0Q7QUFoQ0ksS0FBUDtBQWtDRDs7QUFFRDs7OztBQUlBdEIsSUFBRSx1QkFBRixFQUEyQnFFLEtBQTNCLENBQWlDLFVBQVN0QyxLQUFULEVBQWU7QUFDOUNBLFVBQU1DLGNBQU47QUFDQSxRQUFJNE4sWUFBWTVQLEVBQUUsSUFBRixFQUFRK04sT0FBUixDQUFnQixNQUFoQixFQUF3QnpQLElBQXhCLENBQTZCLE9BQTdCLENBQWhCO0FBQ0EsUUFBSXVSLFFBQVE3UCxFQUFFLE1BQU00UCxTQUFSLENBQVo7QUFDQS9DLG1CQUFlZ0QsS0FBZixFQUFzQjlOLEtBQXRCO0FBQ0QsR0FMRDs7QUFPQTs7O0FBR0EvQixJQUFFLFdBQUYsRUFBZThQLEtBQWYsQ0FBcUIsWUFBVTtBQUM3QixRQUFJQyxVQUFVLE1BQU0vUCxFQUFFLElBQUYsRUFBUWdRLEdBQVIsR0FBYzdNLE1BQWxDO0FBQ0FuRCxNQUFFLGFBQUYsRUFBaUJpUSxJQUFqQixDQUFzQixzQkFBc0JGLE9BQTVDO0FBQ0EsUUFBR0EsVUFBVSxDQUFiLEVBQWU7QUFDYi9QLFFBQUUsYUFBRixFQUFpQnFDLEdBQWpCLENBQXFCLE9BQXJCLEVBQThCLFNBQTlCO0FBQ0FyQyxRQUFFLElBQUYsRUFBUXFDLEdBQVIsQ0FBWSxjQUFaLEVBQTRCLFNBQTVCO0FBQ0QsS0FIRCxNQUdPO0FBQ0xyQyxRQUFFLGFBQUYsRUFBaUJxQyxHQUFqQixDQUFxQixPQUFyQixFQUE4QixNQUE5QjtBQUNBckMsUUFBRSxJQUFGLEVBQVFxQyxHQUFSLENBQVksY0FBWixFQUE0QixTQUE1QjtBQUNEO0FBQ0YsR0FWRDtBQVdELEM7Ozs7Ozs7QUMxSkQsbUJBQW1CLGtMQUFrTCxFQUFFLHlUQUF5VCxFQUFFLDRwQkFBNHBCLEVBQUUsbWRBQW1kLEVBQUUsd0hBQXdILEM7Ozs7OztBQ0E3dUQsbUJBQW1CLHNDQUFzQyxFQUFFLHdDQUF3QyxFQUFFLHVDQUF1QyxFQUFFLDBDQUEwQyxFQUFFLGdEQUFnRCxFQUFFLCtEQUErRCxFQUFFLDZCQUE2QixDOzs7Ozs7Ozs7QUNBMVU7QUFBQTs7Ozs7O0FBTUE7QUFDQTs7QUFFQTs7Ozs7QUFLQSx5REFBZSxZQUFXO0FBQ3hCOzs7O0FBSUEsV0FBUzZOLFdBQVQsQ0FBcUJuTyxLQUFyQixFQUE0QjtBQUMxQixRQUFNb08sY0FBY3BPLE1BQU04QixNQUFOLENBQWF1TSxVQUFqQztBQUNBRCxnQkFBWXBHLFNBQVosQ0FBc0JDLEdBQXRCLENBQTBCLFdBQTFCO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxXQUFTcUcsVUFBVCxDQUFvQnRPLEtBQXBCLEVBQTJCO0FBQ3pCLFFBQUlBLE1BQU04QixNQUFOLENBQWErSCxLQUFiLENBQW1CMEUsSUFBbkIsT0FBOEIsRUFBbEMsRUFBc0M7QUFDcEMsVUFBTUgsY0FBY3BPLE1BQU04QixNQUFOLENBQWF1TSxVQUFqQztBQUNBRCxrQkFBWXBHLFNBQVosQ0FBc0JFLE1BQXRCLENBQTZCLFdBQTdCO0FBQ0Q7QUFDRjs7QUFFRCxNQUFNc0csU0FBUzVSLFNBQVNpRyxnQkFBVCxDQUEwQixxQkFBMUIsQ0FBZjtBQUNBLE1BQUkyTCxPQUFPcE4sTUFBWCxFQUFtQjtBQUNqQmxDLElBQUEsc0RBQUFBLENBQVFzUCxNQUFSLEVBQWdCLFVBQVNDLFNBQVQsRUFBb0I7QUFDbENBLGdCQUFVM1IsZ0JBQVYsQ0FBMkIsT0FBM0IsRUFBb0NxUixXQUFwQztBQUNBTSxnQkFBVTNSLGdCQUFWLENBQTJCLE1BQTNCLEVBQW1Dd1IsVUFBbkM7QUFDQUksTUFBQSwwRUFBQUEsQ0FBY0QsU0FBZCxFQUF5QixNQUF6QjtBQUNELEtBSkQ7QUFLRDtBQUNGLEM7Ozs7Ozs7QUMzQ0Q7Ozs7O0FBS0EseURBQWUsVUFBU25TLElBQVQsRUFBZXFTLFNBQWYsRUFBMEI7QUFDdkMsTUFBSTNPLGNBQUo7QUFDQSxNQUFJcEQsU0FBU2dTLFdBQWIsRUFBMEI7QUFDeEI1TyxZQUFRcEQsU0FBU2dTLFdBQVQsQ0FBcUIsWUFBckIsQ0FBUjtBQUNBNU8sVUFBTTZPLFNBQU4sQ0FBZ0JGLFNBQWhCLEVBQTJCLElBQTNCLEVBQWlDLElBQWpDO0FBQ0FyUyxTQUFLb1MsYUFBTCxDQUFtQjFPLEtBQW5CO0FBQ0QsR0FKRCxNQUlPO0FBQ0xBLFlBQVFwRCxTQUFTa1MsaUJBQVQsRUFBUjtBQUNBeFMsU0FBS3lTLFNBQUwsQ0FBZSxPQUFPSixTQUF0QixFQUFpQzNPLEtBQWpDO0FBQ0Q7QUFDRixDOzs7Ozs7O0FDZkQ7Ozs7OztBQU1BLHlEQUFlLFlBQVc7QUFDeEIvQixJQUFFckIsUUFBRixFQUFZbUQsRUFBWixDQUFlLGlCQUFmLEVBQWtDLFlBQVc7QUFDM0M5QixNQUFFLE1BQUYsRUFBVThDLFdBQVYsQ0FBc0IsbUJBQXRCLEVBQTJDakIsUUFBM0MsQ0FBb0Qsb0JBQXBEO0FBQ0E3QixNQUFFLFlBQUYsRUFBZ0J3RyxTQUFoQixDQUEwQixDQUExQjtBQUNELEdBSEQ7O0FBS0F4RyxJQUFFckIsUUFBRixFQUFZbUQsRUFBWixDQUFlLGdCQUFmLEVBQWlDLFlBQVc7QUFDMUM5QixNQUFFLE1BQUYsRUFBVThDLFdBQVYsQ0FBc0Isb0JBQXRCLEVBQTRDakIsUUFBNUMsQ0FBcUQsbUJBQXJEO0FBQ0QsR0FGRDtBQUdELEM7Ozs7Ozs7O0FDZkQ7Ozs7OztBQU1BOzs7QUFHQSx5REFBZSxZQUFXO0FBQ3hCLE1BQUlrUCxNQUFNL1EsRUFBRSxlQUFGLENBQVY7QUFDQStRLE1BQUlDLFdBQUosQ0FBZ0I7QUFDZEMsZUFBVyxRQURHO0FBRWRDLGdCQUFZLFNBRkU7QUFHZEMsV0FBTSxDQUhRO0FBSWRDLFVBQUssSUFKUztBQUtkQyxZQUFPLENBTE87QUFNZEMsVUFBTSxJQU5RO0FBT2RDLGNBQVMsSUFQSztBQVFkQyxxQkFBZ0IsSUFSRjtBQVNkQyx3QkFBbUI7QUFUTCxHQUFoQjtBQVdELEM7Ozs7Ozs7O0FDdEJEOzs7OztBQUtBLHlEQUFlLFlBQVc7QUFDeEIsTUFBSUMsVUFBVUMsU0FBVixDQUFvQmxGLEtBQXBCLENBQTBCLHNCQUExQixDQUFKLEVBQXVEO0FBQ3JEek0sTUFBRSxjQUFGLEVBQWtCMkMsTUFBbEIsQ0FBeUI1QyxPQUFPOEosV0FBaEM7QUFDQTlKLFdBQU82UixRQUFQLENBQWdCLENBQWhCLEVBQW1CLENBQW5CO0FBQ0Q7QUFDRixDOzs7Ozs7Ozs7Ozs7Ozs7QUNWRDtBQUFBO0FBQUE7QUFDQTs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQU1DLFlBQVksbUJBQUFDLENBQVEsRUFBUixDQUFsQjs7QUFFQTs7Ozs7OztJQU9NN1IsUztBQUNKOzs7O0FBSUEscUJBQVlLLEVBQVosRUFBZ0I7QUFBQTs7QUFDZDtBQUNBLFNBQUt5UixHQUFMLEdBQVd6UixFQUFYOztBQUVBO0FBQ0EsU0FBSzBSLFFBQUwsR0FBZ0IsS0FBaEI7O0FBRUE7QUFDQSxTQUFLQyxPQUFMLEdBQWUsS0FBZjs7QUFFQTtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsS0FBbkI7O0FBRUE7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLEtBQXBCOztBQUVBO0FBQ0EsU0FBS0Msa0JBQUwsR0FBMEIsS0FBMUI7O0FBRUE7QUFDQSxTQUFLQyxrQkFBTCxHQUEwQixLQUExQjs7QUFFQTtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsS0FBdEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OzJCQUtPO0FBQUE7O0FBQ0wsVUFBSSxLQUFLSCxZQUFULEVBQXVCO0FBQ3JCLGVBQU8sSUFBUDtBQUNEOztBQUVELFVBQUlJLFdBQVcsS0FBS1IsR0FBTCxDQUFTaE4sYUFBVCxDQUF1QixtQkFBdkIsQ0FBZjs7QUFFQSxVQUFJd04sUUFBSixFQUFjO0FBQ1osYUFBS0MsVUFBTCxDQUFnQkQsUUFBaEI7QUFDRDs7QUFFRHZTLE1BQUEsOENBQUFBLE9BQU1DLFVBQVVDLFFBQVYsQ0FBbUJ1UyxlQUF6QixFQUNHM1EsRUFESCxDQUNNLE9BRE4sRUFDZSxZQUFNO0FBQ2pCLGNBQUs0USxXQUFMLENBQWlCLElBQWpCO0FBQ0QsT0FISDs7QUFLQTFTLE1BQUEsOENBQUFBLENBQUUsS0FBSytSLEdBQVAsRUFBWWpRLEVBQVosQ0FBZSxRQUFmLEVBQXlCLGFBQUs7QUFDNUI2USxVQUFFM1EsY0FBRjtBQUNBLFlBQUksTUFBS29RLGtCQUFULEVBQTZCO0FBQzNCLGNBQUksTUFBS0Msa0JBQVQsRUFBNkI7QUFDM0Isa0JBQUtPLFNBQUw7QUFDQSxnQkFBSSxNQUFLWixRQUFMLElBQWlCLENBQUMsTUFBS0MsT0FBdkIsSUFBa0MsQ0FBQyxNQUFLQyxXQUE1QyxFQUF5RDtBQUN2RCxvQkFBS1csT0FBTDtBQUNBOVMscUJBQU8rUyxVQUFQLENBQWtCQyxLQUFsQjtBQUNBL1MsY0FBQSw4Q0FBQUEsQ0FBRSxNQUFLK1IsR0FBUCxFQUFZaEUsT0FBWixDQUFvQixtQkFBcEIsRUFBeUNsTSxRQUF6QyxDQUFrRCxjQUFsRDtBQUNBLG9CQUFLd1Esa0JBQUwsR0FBMEIsS0FBMUI7QUFDRDtBQUNGLFdBUkQsTUFRTztBQUNMclMsWUFBQSw4Q0FBQUEsQ0FBRSxNQUFLK1IsR0FBUCxFQUFZeFAsSUFBWixPQUFxQnRDLFVBQVVDLFFBQVYsQ0FBbUI4UyxTQUF4QyxFQUFxRC9JLE1BQXJEO0FBQ0Esa0JBQUtnSixVQUFMLENBQWdCaFQsVUFBVWlULE9BQVYsQ0FBa0JDLFNBQWxDO0FBQ0Q7QUFDRixTQWJELE1BYU87QUFDTCxnQkFBS1AsU0FBTDtBQUNBLGNBQUksTUFBS1osUUFBTCxJQUFpQixDQUFDLE1BQUtDLE9BQXZCLElBQWtDLENBQUMsTUFBS0MsV0FBNUMsRUFBeUQ7QUFDdkQsa0JBQUtXLE9BQUw7QUFDRDtBQUNGOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFlBQUlPLFlBQVksaURBQUFDLENBQVExUyxHQUFSLENBQVksZUFBWixJQUNkd0csU0FBUyxpREFBQWtNLENBQVExUyxHQUFSLENBQVksZUFBWixDQUFULEVBQXVDLEVBQXZDLENBRGMsR0FDK0IsQ0FEL0M7QUFFQSxZQUFJeVMsYUFBYSxDQUFiLElBQWtCLENBQUMsTUFBS2QsY0FBNUIsRUFBNEM7QUFDMUN0UyxVQUFBLDhDQUFBQSxDQUFFLE1BQUsrUixHQUFQLEVBQVloRSxPQUFaLENBQW9CLG1CQUFwQixFQUF5Q2xNLFFBQXpDLENBQWtELGNBQWxEO0FBQ0EsZ0JBQUt5UixjQUFMO0FBQ0EsZ0JBQUtoQixjQUFMLEdBQXNCLElBQXRCO0FBQ0Q7QUFDRGUsUUFBQSxpREFBQUEsQ0FBUUUsR0FBUixDQUFZLGVBQVosRUFBNkIsRUFBRUgsU0FBL0IsRUFBMEMsRUFBQ3JILFNBQVUsSUFBRSxJQUFiLEVBQTFDOztBQUVBL0wsUUFBQSw4Q0FBQUEsQ0FBRSxRQUFGLEVBQVl3VCxRQUFaLENBQXFCLFlBQVc7QUFDOUJ4VCxVQUFBLDhDQUFBQSxDQUFFLElBQUYsRUFBUXlULFVBQVIsQ0FBbUIsYUFBbkI7QUFDRCxTQUZEO0FBR0QsT0FyQ0Q7O0FBdUNBO0FBQ0E7QUFDQTtBQUNBLFVBQUlMLFlBQVksaURBQUFDLENBQVExUyxHQUFSLENBQVksZUFBWixJQUNkd0csU0FBUyxpREFBQWtNLENBQVExUyxHQUFSLENBQVksZUFBWixDQUFULEVBQXVDLEVBQXZDLENBRGMsR0FDK0IsQ0FEL0M7QUFFQSxVQUFJeVMsYUFBYSxDQUFiLElBQWtCLENBQUMsS0FBS2QsY0FBNUIsRUFBNkM7QUFDM0N0UyxRQUFBLDhDQUFBQSxDQUFFLEtBQUsrUixHQUFQLEVBQVloRSxPQUFaLENBQW9CLG1CQUFwQixFQUF5Q2xNLFFBQXpDLENBQWtELGNBQWxEO0FBQ0EsYUFBS3lSLGNBQUw7QUFDQSxhQUFLaEIsY0FBTCxHQUFzQixJQUF0QjtBQUNEO0FBQ0QsV0FBS0gsWUFBTCxHQUFvQixJQUFwQjtBQUNBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7OzsrQkFLV3VCLEssRUFBTztBQUNoQixVQUFJQyxTQUFTLElBQUksaUVBQUosQ0FBV0QsS0FBWCxFQUFrQjtBQUM3QkUsZUFBTyxJQURzQjtBQUU3QkMseUJBQWlCLElBRlk7QUFHN0JDLG1CQUFXO0FBSGtCLE9BQWxCLENBQWI7QUFLQUosWUFBTUMsTUFBTixHQUFlQSxNQUFmO0FBQ0EsYUFBT0QsS0FBUDtBQUNEOztBQUVEOzs7Ozs7O2tDQUk0QjtBQUFBLFVBQWhCSyxPQUFnQix1RUFBTixJQUFNOztBQUMxQixVQUFJQyxNQUFNLDhDQUFBaFUsQ0FBRSxnQkFBRixDQUFWO0FBQ0EsVUFBSWlVLFNBQVVGLE9BQUQsR0FBWSxVQUFaLEdBQXlCLGFBQXRDO0FBQ0FDLFVBQUkxVixJQUFKLENBQVMsYUFBVCxFQUF3QixDQUFDeVYsT0FBekI7QUFDQUMsVUFBSTFWLElBQUosQ0FBUzJCLFVBQVVDLFFBQVYsQ0FBbUJnVSxNQUE1QixFQUFvQyxDQUFDSCxPQUFyQztBQUNBQyxVQUFJQyxNQUFKLEVBQVloVSxVQUFVQyxRQUFWLENBQW1CaVUsa0JBQS9CO0FBQ0E7QUFDQSxVQUNFcFUsT0FBTzZSLFFBQVAsSUFDQW1DLE9BREEsSUFFQWhVLE9BQU9xVSxVQUFQLEdBQW9CdkMsVUFBVSxnQkFBVixDQUh0QixFQUlFO0FBQ0EsWUFBSXdDLFVBQVUsOENBQUFyVSxDQUFFMlMsRUFBRTlPLE1BQUosQ0FBZDtBQUNBOUQsZUFBTzZSLFFBQVAsQ0FDRSxDQURGLEVBQ0t5QyxRQUFRcE4sTUFBUixHQUFpQkgsR0FBakIsR0FBdUJ1TixRQUFRL1IsSUFBUixDQUFhLGNBQWIsQ0FENUI7QUFHRDtBQUNGOztBQUVEOzs7Ozs7OztnQ0FLWTtBQUNWLFVBQUlnUyxXQUFXLElBQWY7QUFDQSxVQUFNQyxPQUFPLDhDQUFBdlUsQ0FBRSxLQUFLK1IsR0FBUCxFQUFZeFAsSUFBWixDQUFpQixtQkFBakIsQ0FBYjtBQUNBO0FBQ0F2QyxNQUFBLDhDQUFBQSxDQUFFLEtBQUsrUixHQUFQLEVBQVl4UCxJQUFaLE9BQXFCdEMsVUFBVUMsUUFBVixDQUFtQjhTLFNBQXhDLEVBQXFEL0ksTUFBckQ7O0FBRUEsVUFBSXNLLEtBQUtwUixNQUFULEVBQWlCO0FBQ2ZtUixtQkFBVyxLQUFLRSxvQkFBTCxDQUEwQkQsS0FBSyxDQUFMLENBQTFCLENBQVg7QUFDRDs7QUFFRCxXQUFLdkMsUUFBTCxHQUFnQnNDLFFBQWhCO0FBQ0EsVUFBSSxLQUFLdEMsUUFBVCxFQUFtQjtBQUNqQmhTLFFBQUEsOENBQUFBLENBQUUsS0FBSytSLEdBQVAsRUFBWWpQLFdBQVosQ0FBd0I3QyxVQUFVQyxRQUFWLENBQW1CdVUsS0FBM0M7QUFDRDtBQUNELGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7eUNBTXFCZixLLEVBQU07QUFDekIsVUFBSWdCLE1BQU0sS0FBS0MsaUJBQUwsQ0FBdUJqQixNQUFNOUgsS0FBN0IsQ0FBVixDQUR5QixDQUNzQjtBQUMvQzhJLFlBQU9BLEdBQUQsR0FBUUEsSUFBSS9ILElBQUosQ0FBUyxFQUFULENBQVIsR0FBdUIsQ0FBN0IsQ0FGeUIsQ0FFTztBQUNoQyxVQUFJK0gsSUFBSXZSLE1BQUosS0FBZSxFQUFuQixFQUF1QjtBQUNyQixlQUFPLElBQVAsQ0FEcUIsQ0FDUjtBQUNkO0FBQ0QsV0FBSzhQLFVBQUwsQ0FBZ0JoVCxVQUFVaVQsT0FBVixDQUFrQjBCLEtBQWxDO0FBQ0EsYUFBTyxLQUFQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7Ozs7c0NBS2tCaEosSyxFQUFPO0FBQ3ZCLGFBQU9BLE1BQU1hLEtBQU4sQ0FBWSxNQUFaLENBQVAsQ0FEdUIsQ0FDSztBQUM3Qjs7QUFFRDs7Ozs7Ozs7OztzQ0FPa0JpSCxLLEVBQU87QUFDdkIsVUFBSSw4Q0FBQTFULENBQUUwVCxLQUFGLEVBQVMxRCxHQUFULEVBQUosRUFBb0I7QUFDbEIsZUFBTyxJQUFQO0FBQ0Q7QUFDRCxXQUFLaUQsVUFBTCxDQUFnQmhULFVBQVVpVCxPQUFWLENBQWtCMkIsUUFBbEM7QUFDQTdVLE1BQUEsOENBQUFBLENBQUUwVCxLQUFGLEVBQVNvQixHQUFULENBQWEsT0FBYixFQUFzQixZQUFVO0FBQzlCLGFBQUtsQyxTQUFMO0FBQ0QsT0FGRDtBQUdBLGFBQU8sS0FBUDtBQUNEOztBQUVEOzs7Ozs7OzsrQkFLV2xELEcsRUFBSztBQUNkLFVBQUlxRixhQUFhLDhDQUFBL1UsQ0FBRSxLQUFLK1IsR0FBUCxFQUFZaEUsT0FBWixDQUFvQixtQkFBcEIsQ0FBakI7QUFDQS9OLE1BQUEsOENBQUFBLENBQUUsZUFBRixFQUFtQjZCLFFBQW5CLENBQTRCNUIsVUFBVUMsUUFBVixDQUFtQnVVLEtBQS9DLEVBQXNEeEUsSUFBdEQsQ0FBMkQsbUVBQUErRSxDQUFRQyxRQUFSLENBQWlCdkYsR0FBakIsQ0FBM0Q7QUFDQXFGLGlCQUFXalMsV0FBWCxDQUF1QixZQUF2QjtBQUNBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7OztpQ0FLYTRNLEcsRUFBSztBQUNoQixVQUFJcUYsYUFBYSw4Q0FBQS9VLENBQUUsS0FBSytSLEdBQVAsRUFBWWhFLE9BQVosQ0FBb0IsbUJBQXBCLENBQWpCO0FBQ0EvTixNQUFBLDhDQUFBQSxDQUFFLFFBQUYsRUFBWTFCLElBQVosQ0FBaUIsYUFBakIsRUFBZ0MsbUVBQUEwVyxDQUFRQyxRQUFSLENBQWlCdkYsR0FBakIsQ0FBaEM7QUFDQTFQLE1BQUEsOENBQUFBLENBQUUsWUFBRixFQUFnQmlRLElBQWhCLENBQXFCLGNBQXJCO0FBQ0FqUSxNQUFBLDhDQUFBQSxDQUFFLGVBQUYsRUFBbUI2QixRQUFuQixDQUE0QjVCLFVBQVVDLFFBQVYsQ0FBbUJnVixPQUEvQyxFQUF3RGpGLElBQXhELENBQTZELEVBQTdEO0FBQ0E4RSxpQkFBV2pTLFdBQVgsQ0FBdUIsWUFBdkI7QUFDQWlTLGlCQUFXbFQsUUFBWCxDQUFvQixZQUFwQjtBQUNBLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7OzhCQUlVO0FBQUE7O0FBQ1IsV0FBS29RLE9BQUwsR0FBZSxJQUFmO0FBQ0EsVUFBSWtELFdBQVcsS0FBS3BELEdBQUwsQ0FBU2hOLGFBQVQsT0FBMkI5RSxVQUFVQyxRQUFWLENBQW1Ca1YsT0FBOUMsQ0FBZjtBQUNBLFVBQUlDLFVBQVUsS0FBS3RELEdBQUwsQ0FBU2hOLGFBQVQsQ0FBdUIsdUJBQXZCLENBQWQ7QUFDQSxVQUFNdVEsVUFBVSw4Q0FBQXRWLENBQUUsS0FBSytSLEdBQVAsRUFBWXdELFNBQVosRUFBaEI7QUFDQXZWLE1BQUEsOENBQUFBLENBQUUsS0FBSytSLEdBQVAsRUFBWXhQLElBQVosQ0FBaUIsT0FBakIsRUFBMEJpVCxJQUExQixDQUErQixVQUEvQixFQUEyQyxJQUEzQztBQUNBLFVBQUlMLFFBQUosRUFBYztBQUNaRSxnQkFBUUksUUFBUixHQUFtQixJQUFuQixDQURZLENBQ2E7QUFDekJOLGlCQUFTekssS0FBVCxDQUFlZ0wsT0FBZixHQUF5QixFQUF6QixDQUZZLENBRWlCO0FBQzlCO0FBQ0QsYUFBTyw4Q0FBQTFWLENBQUUyVixJQUFGLENBQU8sOENBQUEzVixDQUFFLEtBQUsrUixHQUFQLEVBQVl6VCxJQUFaLENBQWlCLFFBQWpCLENBQVAsRUFBbUNnWCxPQUFuQyxFQUE0Q00sSUFBNUMsQ0FBaUQsb0JBQVk7QUFDbEUsWUFBSXJHLFNBQVNELE9BQWIsRUFBc0I7QUFDcEIsaUJBQUt5QyxHQUFMLENBQVNnQixLQUFUO0FBQ0EsaUJBQUs4QyxZQUFMLENBQWtCNVYsVUFBVWlULE9BQVYsQ0FBa0JnQyxPQUFwQztBQUNBLGlCQUFLaEQsV0FBTCxHQUFtQixJQUFuQjtBQUNBbFMsVUFBQSw4Q0FBQUEsQ0FBRSxPQUFLK1IsR0FBUCxFQUFZK0MsR0FBWixDQUFnQixPQUFoQixFQUF5QixPQUF6QixFQUFrQyxZQUFNO0FBQ3RDOVUsWUFBQSw4Q0FBQUEsQ0FBRSxPQUFLK1IsR0FBUCxFQUFZalAsV0FBWixDQUF3QjdDLFVBQVVDLFFBQVYsQ0FBbUJnVixPQUEzQztBQUNBLG1CQUFLaEQsV0FBTCxHQUFtQixLQUFuQjtBQUNELFdBSEQ7QUFJRCxTQVJELE1BUU87QUFDTCxpQkFBS2UsVUFBTCxDQUFnQjZDLEtBQUtDLFNBQUwsQ0FBZXhHLFNBQVN5RyxPQUF4QixDQUFoQjtBQUNEO0FBQ0YsT0FaTSxFQVlKQyxJQVpJLENBWUMsWUFBVztBQUNqQixhQUFLaEQsVUFBTCxDQUFnQmhULFVBQVVpVCxPQUFWLENBQWtCZ0QsTUFBbEM7QUFDRCxPQWRNLEVBY0pDLE1BZEksQ0FjRyxZQUFNO0FBQ2RuVyxRQUFBLDhDQUFBQSxDQUFFLE9BQUsrUixHQUFQLEVBQVl4UCxJQUFaLENBQWlCLE9BQWpCLEVBQTBCaVQsSUFBMUIsQ0FBK0IsVUFBL0IsRUFBMkMsS0FBM0M7QUFDQSxZQUFJTCxRQUFKLEVBQWM7QUFDWkUsa0JBQVFJLFFBQVIsR0FBbUIsS0FBbkIsQ0FEWSxDQUNjO0FBQzFCTixtQkFBU3pLLEtBQVQsQ0FBZWdMLE9BQWYsR0FBeUIsZUFBekIsQ0FGWSxDQUU4QjtBQUMzQztBQUNELGVBQUt6RCxPQUFMLEdBQWUsS0FBZjtBQUNELE9BckJNLENBQVA7QUFzQkQ7O0FBRUQ7Ozs7Ozs7OztxQ0FNaUI7QUFBQTs7QUFDZixVQUFNbUUsVUFBVSw4Q0FBQXBXLENBQUVyQixTQUFTcUMsYUFBVCxDQUF1QixRQUF2QixDQUFGLENBQWhCO0FBQ0FvVixjQUFROVgsSUFBUixDQUFhLEtBQWIsRUFDSSw0Q0FDQSwwQ0FGSixFQUVnRGtYLElBRmhELENBRXFEO0FBQ25EYSxlQUFPLElBRDRDO0FBRW5EQyxlQUFPO0FBRjRDLE9BRnJEOztBQU9BdlcsYUFBT3dXLGdCQUFQLEdBQTBCLFlBQU07QUFDOUJ4VyxlQUFPK1MsVUFBUCxDQUFrQjBELE1BQWxCLENBQXlCN1gsU0FBUzhYLGNBQVQsQ0FBd0Isb0JBQXhCLENBQXpCLEVBQXdFO0FBQ3RFLHFCQUFZLDBDQUQwRDtBQUV0RTtBQUNBO0FBQ0Esc0JBQVksbUJBSjBEO0FBS3RFLDhCQUFvQjtBQUxrRCxTQUF4RTtBQU9BLGVBQUtyRSxrQkFBTCxHQUEwQixJQUExQjtBQUNELE9BVEQ7O0FBV0FyUyxhQUFPMlcsaUJBQVAsR0FBMkIsWUFBTTtBQUMvQixlQUFLckUsa0JBQUwsR0FBMEIsSUFBMUI7QUFDQXJTLFFBQUEsOENBQUFBLENBQUUsT0FBSytSLEdBQVAsRUFBWWhFLE9BQVosQ0FBb0IsbUJBQXBCLEVBQXlDakwsV0FBekMsQ0FBcUQsY0FBckQ7QUFDRCxPQUhEOztBQUtBL0MsYUFBTzRXLHNCQUFQLEdBQWdDLFlBQU07QUFDcEMsZUFBS3RFLGtCQUFMLEdBQTBCLEtBQTFCO0FBQ0FyUyxRQUFBLDhDQUFBQSxDQUFFLE9BQUsrUixHQUFQLEVBQVloRSxPQUFaLENBQW9CLG1CQUFwQixFQUF5Q2xNLFFBQXpDLENBQWtELGNBQWxEO0FBQ0QsT0FIRDs7QUFLQSxXQUFLdVEsa0JBQUwsR0FBMEIsSUFBMUI7QUFDQXBTLE1BQUEsOENBQUFBLENBQUUsTUFBRixFQUFVdUIsTUFBVixDQUFpQjZVLE9BQWpCO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7Ozs7OztBQUdIOzs7Ozs7QUFJQW5XLFVBQVVDLFFBQVYsR0FBcUI7QUFDbkJ1VSxTQUFPLE9BRFk7QUFFbkJ6QixhQUFXLGVBRlE7QUFHbkI3UyxRQUFNLGVBSGE7QUFJbkJzUyxtQkFBaUIsb0JBSkU7QUFLbkJtRSxvQkFBa0IscUJBTEM7QUFNbkJ6QyxzQkFBb0IsbUJBTkQ7QUFPbkJELFVBQVEsUUFQVztBQVFuQjJDLGNBQVksWUFSTztBQVNuQjNCLFdBQVMsU0FUVTtBQVVuQkUsV0FBUztBQVZVLENBQXJCOztBQWFBOzs7O0FBSUFuVixVQUFVaVQsT0FBVixHQUFvQjtBQUNsQmxGLFNBQU8sYUFEVztBQUVsQjRHLFNBQU8sdUJBRlc7QUFHbEJDLFlBQVUsZ0JBSFE7QUFJbEJxQixVQUFRLGNBSlU7QUFLbEJoQixXQUFTLGVBTFM7QUFNbEIvQixhQUFZO0FBTk0sQ0FBcEI7O0FBU0EseURBQWVsVCxTQUFmLEU7Ozs7OztBQ25YQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzQkFBc0I7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0QsNkJBQTZCLEVBQUU7QUFDL0I7O0FBRUEsU0FBUyxvQkFBb0I7QUFDN0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0IsQ0FBQzs7Ozs7Ozs7QUNwS0Q7QUFBQTtBQUFBO0FBQ0E7Ozs7QUFFQTs7QUFFQTs7O0FBR0EsSUFBTStVLFVBQVUsRUFBaEI7O0FBRUE7Ozs7Ozs7QUFPQUEsUUFBUThCLGVBQVIsR0FBMEIsVUFBQ25MLElBQUQsRUFBT29MLFdBQVAsRUFBdUI7QUFDL0MsTUFBTUMsUUFBUUQsZUFBZWhYLE9BQU9xTCxRQUFQLENBQWdCNkwsTUFBN0M7QUFDQSxNQUFNQyxRQUFRdkwsS0FBS3dMLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLEtBQXJCLEVBQTRCQSxPQUE1QixDQUFvQyxNQUFwQyxFQUE0QyxLQUE1QyxDQUFkO0FBQ0EsTUFBTUMsUUFBUSxJQUFJNUwsTUFBSixDQUFXLFdBQVcwTCxLQUFYLEdBQW1CLFdBQTlCLENBQWQ7QUFDQSxNQUFNRyxVQUFVRCxNQUFNM0wsSUFBTixDQUFXdUwsS0FBWCxDQUFoQjtBQUNBLFNBQU9LLFlBQVksSUFBWixHQUFtQixFQUFuQixHQUNIQyxtQkFBbUJELFFBQVEsQ0FBUixFQUFXRixPQUFYLENBQW1CLEtBQW5CLEVBQTBCLEdBQTFCLENBQW5CLENBREo7QUFFRCxDQVBEOztBQVNBOzs7Ozs7O0FBT0FuQyxRQUFRdUMsVUFBUixHQUFxQixVQUFDQyxNQUFELEVBQVNDLFVBQVQsRUFBd0I7QUFDM0MsTUFBTUosVUFBVSxFQUFoQjs7QUFFQTs7O0FBR0EsR0FBQyxTQUFTSyxjQUFULENBQXdCeEssR0FBeEIsRUFBNkI7QUFDNUIsU0FBSyxJQUFJeUssR0FBVCxJQUFnQnpLLEdBQWhCLEVBQXFCO0FBQ25CLFVBQUlBLElBQUkwSyxjQUFKLENBQW1CRCxHQUFuQixDQUFKLEVBQTZCO0FBQzNCLFlBQUlBLFFBQVFGLFVBQVosRUFBd0I7QUFDdEJKLGtCQUFRUSxJQUFSLENBQWEzSyxJQUFJeUssR0FBSixDQUFiO0FBQ0Q7QUFDRCxZQUFJLFFBQU96SyxJQUFJeUssR0FBSixDQUFQLE1BQXFCLFFBQXpCLEVBQW1DO0FBQ2pDRCx5QkFBZXhLLElBQUl5SyxHQUFKLENBQWY7QUFDRDtBQUNGO0FBQ0Y7QUFDRixHQVhELEVBV0dILE1BWEg7O0FBYUEsU0FBT0gsT0FBUDtBQUNELENBcEJEOztBQXNCQTs7Ozs7O0FBTUFyQyxRQUFROEMsY0FBUixHQUF5QixVQUFDOUgsR0FBRDtBQUFBLFNBQ3BCK0gsS0FBS0MsR0FBTCxDQUFTRCxLQUFLRSxLQUFMLENBQVdDLFdBQVdsSSxHQUFYLElBQWtCLEdBQTdCLElBQW9DLEdBQTdDLENBQUQsQ0FBb0RtSSxPQUFwRCxDQUE0RCxDQUE1RCxDQURxQjtBQUFBLENBQXpCOztBQUdBOzs7Ozs7Ozs7O0FBVUFuRCxRQUFRQyxRQUFSLEdBQW1CLFVBQVNtRCxRQUFULEVBQW1CO0FBQ3BDLE1BQUluSSxPQUFPbUksWUFBWSxFQUF2QjtBQUNBLE1BQU1DLG1CQUFtQnRZLE9BQU91WSxpQkFBUCxJQUE0QixFQUFyRDtBQUNBLE1BQU03TCxRQUFRLGtEQUFBOEwsQ0FBRUMsU0FBRixDQUFZSCxnQkFBWixFQUE4QjtBQUMxQ0ksVUFBTUw7QUFEb0MsR0FBOUIsQ0FBZDtBQUdBLE1BQUkzTCxLQUFKLEVBQVc7QUFDVHdELFdBQU94RCxNQUFNaU0sS0FBYjtBQUNEO0FBQ0QsU0FBT3pJLElBQVA7QUFDRCxDQVZEOztBQVlBOzs7Ozs7O0FBT0ErRSxRQUFRMkQsWUFBUixHQUF1QixVQUFTQyxLQUFULEVBQWdCO0FBQ3JDLE1BQU1sRixRQUFRL1UsU0FBU3FDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBZDtBQUNBMFMsUUFBTXhFLElBQU4sR0FBYSxPQUFiO0FBQ0F3RSxRQUFNOUgsS0FBTixHQUFjZ04sS0FBZDs7QUFFQSxTQUFPLE9BQU9sRixNQUFNbUYsYUFBYixLQUErQixVQUEvQixHQUNIbkYsTUFBTW1GLGFBQU4sRUFERyxHQUNxQixlQUFlNVQsSUFBZixDQUFvQjJULEtBQXBCLENBRDVCO0FBRUQsQ0FQRDs7QUFTQTs7OztBQUlBNUQsUUFBUThELE1BQVIsR0FBaUI7QUFDZkMsZUFBYSxPQURFO0FBRWZDLGVBQWEsQ0FBQyxPQUZDO0FBR2ZDLGNBQVkseUNBSEc7QUFJZkMscUJBQW1CLHlDQUpKO0FBS2ZDLHVCQUFxQiwwQ0FMTjtBQU1mQywwQkFBd0IsQ0FOVDtBQU9mQyxnQkFBYyx1REFQQztBQVFmQyxtQkFBaUIsMERBUkY7QUFTZkMsaUJBQWUsd0RBVEE7QUFVZkMsb0JBQWtCO0FBVkgsQ0FBakI7O0FBYUEseURBQWV4RSxPQUFmLEU7Ozs7OztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUscUlBQWlMLGlCQUFpQixtQkFBbUIsY0FBYyw0QkFBNEIsWUFBWSxVQUFVLGlCQUFpQixnRUFBZ0UsU0FBUywrQkFBK0Isa0JBQWtCLGFBQWEsYUFBYSxvQkFBb0IsV0FBVyx1TEFBdUwsc0VBQXNFLGNBQWMsYUFBYSxnQkFBZ0IsMEJBQTBCLDZtQkFBNm1CLGlDQUFpQywwQkFBMEIsd0xBQXdMLDhCQUE4QiwwQkFBMEIsMktBQTJLLCtCQUErQiwwQkFBMEIsZUFBZSwyR0FBMkcsU0FBUyxrRUFBa0UsUUFBUSxXQUFXLHVCQUF1QiwwRUFBMEUsc01BQXNNLHFCQUFxQixpQ0FBaUMsbUJBQW1CLDJDQUEyQyxvQkFBb0IsMEJBQTBCLCtCQUErQiwwREFBMEQsa0VBQWtFLElBQUksNEdBQTRHLFdBQVcscUJBQXFCLHVDQUF1QyxvMUJBQW8xQiwwQ0FBMEMscUNBQXFDLGlTQUFpUyw2QkFBNkIsV0FBVyxxREFBcUQsb0NBQW9DLDhDQUE4QyxnQ0FBZ0MsMEJBQTBCLHdEQUF3RCx5QkFBeUIsMEJBQTBCLHlIQUF5SCx3QkFBd0IscURBQXFELGlMQUFpTCw4QkFBOEIsMEJBQTBCLG9CQUFvQixXQUFXLG1PQUFtTyxxQkFBcUIseUJBQXlCLHlMQUF5TCxvQkFBb0IsWUFBWSxJQUFJLGVBQWUsYUFBYSw0QkFBNEIsV0FBVyxrUEFBa1AsY0FBYywwQ0FBMEMsY0FBYyx3QkFBd0IsMkVBQTJFLG9CQUFvQixvQkFBb0IsNGVBQTRlLDJFQUEyRSxNQUFNLDhDQUE4QyxFQUFFLHlCQUF5QixNQUFNLGdDQUFnQyxFQUFFLHlCQUF5QiwrREFBK0QsYUFBYSxlQUFlLGFBQWEsa0JBQWtCLFdBQVcsNENBQTRDLGFBQWEsc0JBQXNCLFdBQVcsa0NBQWtDLDBDQUEwQyxFQUFFLHNCQUFzQixtQkFBbUIsOEJBQThCLGdCQUFnQiwrREFBK0QsZUFBZSwrQ0FBK0MseUJBQXlCLDZFQUE2RSxNQUFNLDZFQUE2RSxVQUFVLEtBQUssYUFBYSxlQUFlLGFBQWEsb0JBQW9CLFdBQVcscUZBQXFGLGFBQWEseUJBQXlCLGlCQUFpQixvQkFBb0IsV0FBVyw0RUFBNEUsbUNBQW1DLElBQUksaUZBQWlGLGtFQUFrRSxhQUFhLGVBQWUsYUFBYSxPQUFPLFFBQVEsbU5BQW1OLEtBQUssbUJBQW1CLEtBQUssaUJBQWlCLEtBQUssMEJBQTBCLElBQUksZUFBZSxLQUFLLHNDQUFzQyxLQUFLLGlDQUFpQyxLQUFLLCtCQUErQixLQUFLLDJCQUEyQixLQUFLLDBCQUEwQixJQUFJLElBQUksS0FBSyx5QkFBeUIsSUFBSSxXQUFXLElBQUksSUFBSSxLQUFLLGFBQWEsS0FBSyxFQUFFLHVCQUF1QixzQkFBc0IsNkJBQTZCLDBCQUEwQixpQkFBaUIsMEJBQTBCLG1CQUFtQiw4QkFBOEIscUJBQXFCLG9EQUFvRCx1QkFBdUIsc0NBQXNDLG9CQUFvQixnQ0FBZ0MseUJBQXlCLDBDQUEwQyxnQkFBZ0Isd0JBQXdCLG9CQUFvQixrREFBa0QsaUJBQWlCLDRDQUE0QyxFQUFFLHFEQUFxRCxZQUFZLGVBQWUsYUFBYSxPQUFPLGlCQUFpQixxQkFBcUIsdUJBQXVCLDZCQUE2Qiw2Q0FBNkMsdUJBQXVCLEVBQUUsdUNBQXVDLDhDQUE4QyxvQkFBb0IsaUNBQWlDLFdBQVcsaUJBQWlCLDBDQUEwQyx1QkFBdUIsNkJBQTZCLCtDQUErQyxJQUFJLHVCQUF1QixvQkFBb0IsMEJBQTBCLDhCQUE4QixXQUFXLElBQUksd0NBQXdDLHFCQUFxQiw2Q0FBNkMsZ0NBQWdDLGtCQUFrQixpQ0FBaUMsWUFBWSwwQkFBMEIsZ0NBQWdDLFNBQVMsdUNBQXVDLHdCQUF3Qix3Q0FBd0MsZUFBZSxnQ0FBZ0Msb0RBQW9ELEtBQUssc0JBQXNCLDJEQUEyRCx5Q0FBeUMsK0NBQStDLFlBQVksZUFBZSxhQUFhLGFBQWEsT0FBTyxxQkFBcUIsY0FBYyxRQUFRLGtLQUFrSyxnRkFBZ0YsOEVBQThFLHc3QkFBdzdCLFlBQVksb0JBQW9CLFlBQVksSUFBSSxHQUFHLEU7Ozs7OztBQ1A5cFgsMERBQVksZ0JBQWdCLHVCQUF1QixtREFBbUQsVUFBVSx3QkFBd0IseUNBQXlDLFFBQVEsZ0JBQWdCLGNBQWMsd0dBQXdHLHdDQUF3QyxtQkFBbUIsd0JBQXdCLGtDQUFrQyxnQkFBZ0Isc0NBQXNDLGNBQWMsT0FBTyxnQkFBZ0IsYUFBYSxnQkFBZ0Isc0JBQXNCLGNBQWMsZUFBZSx1QkFBdUIsU0FBUyxnQkFBZ0IsbUJBQW1CLFlBQVksV0FBVyxLQUFLLFdBQVcsZUFBZSxjQUFjLGtDQUFrQyxlQUFlLElBQUksZ0JBQWdCLHdFQUF3RSwyREFBMkQsc0JBQXNCLGFBQWEsU0FBUyxzQ0FBc0MsZ0JBQWdCLHVCQUF1QixXQUFXLEtBQUssaUJBQWlCLGlCQUFpQixxQkFBcUIsdUJBQXVCLGdDQUFnQyxXQUFXLEtBQUssa0NBQWtDLHNEQUFzRCw4REFBOEQsZ0JBQWdCLGFBQWEsdUJBQXVCLFFBQVEsZ0JBQWdCLG1CQUFtQixtQkFBbUIsaUJBQWlCLFdBQVcscUJBQXFCLElBQUksZ0JBQWdCLGdCQUFnQixjQUFjLFNBQVMsa0JBQWtCLGFBQWEsMEJBQTBCLGdCQUFnQixNQUFNLGdDQUFnQyxRQUFRLDBCQUEwQixVQUFVLHNCQUFzQix5QkFBeUIsS0FBSyxlQUFlLFFBQVEsUUFBUSxnQkFBZ0IsTUFBTSxTQUFTLGdCQUFnQiw4REFBOEQsa0JBQWtCLHlCQUF5QixnQkFBZ0IsV0FBVyx1Q0FBdUMsa0JBQWtCOztBQUVuZ0U7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxjQUFjLGNBQWMsY0FBYzs7QUFFeEg7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsVUFBVSxnQkFBZ0IsdUJBQXVCLGtCQUFrQixhQUFhLFlBQVksK0JBQStCLDhCQUE4QixTQUFTLGNBQWMsZ0NBQWdDLGNBQWMsb09BQW9PLGdCQUFnQixNQUFNLDRDQUE0QyxxREFBcUQsVUFBVSxTQUFTLGtDQUFrQyxjQUFjLHlCQUF5QixJQUFJLEtBQUssc0JBQXNCLG1CQUFtQixNQUFNLElBQUksaUJBQWlCLDJCQUEyQixLQUFLLG1EQUFtRCxNQUFNLElBQUksNkNBQTZDLCtIQUErSCwrQ0FBK0MsY0FBYyxnQkFBZ0IsMkNBQTJDLElBQUksS0FBSyxhQUFhLHdGQUF3RixNQUFNLGdCQUFnQixTQUFTLFFBQVEsNENBQTRDLFVBQVUsc0RBQXNELG1CQUFtQixTQUFTLGlCQUFpQixvQkFBb0IsMEtBQTBLLHNCQUFzQixxQkFBcUIsMkNBQTJDLHFDQUFxQyxPQUFPLDhLQUE4SyxjQUFjLHFEQUFxRCxjQUFjLDBDQUEwQyxJQUFJLEtBQUssc0JBQXNCLDZHQUE2RyxTQUFTLGdCQUFnQixtQkFBbUIsaUVBQWlFLGNBQWMscUJBQXFCLGdCQUFnQixzRUFBc0UsSUFBSSxLQUFLLGFBQWEsdUdBQXVHLDJEQUEyRCxjQUFjLGNBQWMsZ0NBQWdDLFFBQVEsaUJBQWlCLElBQUksdUJBQXVCLGlDQUFpQyxzQkFBc0IsY0FBYywyQkFBMkIsd1VBQXdVLGNBQWMseUVBQXlFLGdLQUFnSyxjQUFjLDRCQUE0QixjQUFjLEdBQUcsMkVBQTJFLFdBQVcsK0NBQStDLHdCQUF3QixRQUFRLElBQUksOEhBQThILGdCQUFnQixxQkFBcUIsb0NBQW9DLHVDQUF1QyxrREFBa0QscURBQXFELFdBQVcsNkNBQTZDLFlBQVksK0JBQStCLHlDQUF5QyxtQkFBbUIseUJBQXlCLFlBQVksaUNBQWlDLGVBQWUsa0NBQWtDLDhCQUE4QixjQUFjLDhCQUE4QiwyQkFBMkIsdUJBQXVCLGFBQWEsZ0JBQWdCLE1BQU0sT0FBTyxNQUFNLE9BQU8sTUFBTSxnQ0FBZ0Msa0JBQWtCLEdBQUcsdURBQXVELElBQUksMkNBQTJDLElBQUksMENBQTBDLElBQUksbURBQW1ELElBQUksdURBQXVELElBQUksaUVBQWlFLElBQUksOERBQThELEtBQUssMERBQTBELGtCQUFrQixHQUFHLDZEQUE2RCxJQUFJLCtDQUErQyxJQUFJLCtDQUErQyxJQUFJLHNDQUFzQyxJQUFJLHFEQUFxRCxJQUFJLHNEQUFzRCxLQUFLLDBEQUEwRCxrQkFBa0IsR0FBRyx5REFBeUQsSUFBSSxnQ0FBZ0MsSUFBSSw4QkFBOEIsSUFBSSwwQkFBMEIsSUFBSSw2QkFBNkIsSUFBSSxnQ0FBZ0MsSUFBSSwrQkFBK0IsSUFBSSxtQ0FBbUMsSUFBSSx3QkFBd0IsS0FBSyx5QkFBeUIsS0FBSyx1QkFBdUIsS0FBSyw2QkFBNkIsS0FBSyw2QkFBNkIsS0FBSyw2Q0FBNkMsSUFBSSxzQ0FBc0MsS0FBSyxvQ0FBb0MsS0FBSyw0Q0FBNEMsS0FBSyxzREFBc0QsS0FBSyx1Q0FBdUMsS0FBSyw2Q0FBNkMsS0FBSyxtREFBbUQsS0FBSyxzREFBc0QsS0FBSywyRUFBMkUsS0FBSyxzQ0FBc0MsS0FBSywyQ0FBMkMsS0FBSyw4REFBOEQsS0FBSyxzQ0FBc0MsS0FBSywrREFBK0QsS0FBSywyREFBMkQscUNBQXFDLDZCQUE2Qix3RUFBd0UsWUFBWSxrQ0FBa0MsZ0JBQWdCLGdCQUFnQixTQUFTLGlCQUFpQixxQkFBcUIsdUNBQXVDLGlIQUFpSCxVQUFVLG1CQUFtQixtQ0FBbUMsY0FBYyw0QkFBNEIsR0FBRyxvQ0FBb0Msc0RBQXNELDZCQUE2Qiw2QkFBNkI7O0FBRXZyTzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTywwRkFBMEYsS0FBSyw4QkFBOEIsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLG9sQkFBb2xCLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSwybUJBQTJtQixFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsdUVBQXVFLEVBQUUsT0FBTyxHQUFHLGtEQUFrRCxFQUFFLE9BQU8sR0FBRywyRkFBMkYsRUFBRSxPQUFPLEdBQUcsd0dBQXdHLEVBQUUsTUFBTSxFQUFFLHlDQUF5QyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0RBQWdELEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSwySEFBMkgsZUFBZSwwQkFBMEIsUUFBUSw0U0FBNFMsNEVBQTRFLGNBQWMsc0NBQXNDLEtBQUssa0hBQWtILHlCQUF5Qix1TEFBdUwsMkJBQTJCLHdCQUF3QixpS0FBaUsscUQ7Ozs7Ozs7QUNsRHo5RixrQkFBa0IsZ0Y7Ozs7Ozs7QUNBbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5REFBZSxZQUFXO0FBQ3hCLFdBQVN5RSxZQUFULEdBQXdCO0FBQ3RCO0FBQ0EsUUFBSUMsaUJBQWlCLEdBQXJCO0FBQ0E7QUFDQSxRQUFJQyxpQkFBaUIzWixFQUFFLG1CQUFGLEVBQXVCNkcsS0FBdkIsRUFBckI7O0FBRUE7QUFDQTtBQUNBLFFBQUc2UyxpQkFBaUJDLGNBQXBCLEVBQW9DO0FBQ2xDO0FBQ0EsVUFBSUMsZUFBZUQsaUJBQWlCRCxjQUFwQztBQUNBO0FBQ0ExWixRQUFFLGNBQUYsRUFBa0JxQyxHQUFsQixDQUFzQjtBQUNwQndYLG1CQUFVLFdBQVNELFlBQVQsR0FBc0I7QUFEWixPQUF0QjtBQUdEO0FBQ0Y7O0FBRUQ1WixJQUFFLFlBQVc7QUFDWDtBQUNBeVo7QUFDRCxHQUhEOztBQUtBelosSUFBRUQsTUFBRixFQUFVK1osTUFBVixDQUFpQixZQUFXO0FBQzFCO0FBQ0E7QUFDQUw7QUFDRCxHQUpEO0FBS0QsQzs7Ozs7Ozs7QUNuQ0Q7Ozs7OztBQU1BLHlEQUFlLFlBQVc7QUFDeEIsTUFBSU0sUUFBUSxFQUFaOztBQUVBL1osSUFBRSx1QkFBRixFQUEyQkksSUFBM0IsQ0FBZ0MsVUFBVUMsQ0FBVixFQUFhc1MsQ0FBYixFQUFnQjtBQUM5QyxRQUFJM1MsRUFBRTJTLENBQUYsRUFBSzFDLElBQUwsR0FBWUssSUFBWixPQUF1QixFQUEzQixFQUErQjtBQUM3QnlKLFlBQU1sQyxJQUFOLENBQVc3WCxFQUFFMlMsQ0FBRixFQUFLMUMsSUFBTCxFQUFYO0FBQ0Q7QUFDRixHQUpEOztBQU1BLFdBQVMrSixVQUFULEdBQXNCO0FBQ3BCLFFBQUlDLEtBQUtqYSxFQUFFLFNBQUYsRUFBYXNDLElBQWIsQ0FBa0IsTUFBbEIsS0FBNkIsQ0FBdEM7QUFDQXRDLE1BQUUsU0FBRixFQUFhc0MsSUFBYixDQUFrQixNQUFsQixFQUEwQjJYLE9BQU9GLE1BQU01VyxNQUFOLEdBQWMsQ0FBckIsR0FBeUIsQ0FBekIsR0FBNkI4VyxLQUFLLENBQTVELEVBQStEaEssSUFBL0QsQ0FBb0U4SixNQUFNRSxFQUFOLENBQXBFLEVBQStFQyxNQUEvRSxHQUF3RkMsS0FBeEYsQ0FBOEYsSUFBOUYsRUFBb0dDLE9BQXBHLENBQTRHLEdBQTVHLEVBQWlISixVQUFqSDtBQUNEO0FBQ0RoYSxJQUFFZ2EsVUFBRjtBQUNELEM7Ozs7Ozs7Ozs7QUNwQkQ7Ozs7OztBQUVBOztJQUVNSyxNO0FBQ0osb0JBQWM7QUFBQTtBQUFFOztBQUVoQjs7Ozs7OzsyQkFHTztBQUNMLFdBQUtDLE9BQUwsR0FBZTNiLFNBQVNpRyxnQkFBVCxDQUEwQnlWLE9BQU9FLFNBQVAsQ0FBaUJDLElBQTNDLENBQWY7O0FBRUEsVUFBSSxDQUFDLEtBQUtGLE9BQVYsRUFBbUI7O0FBRW5CLFdBQUssSUFBSWphLElBQUksS0FBS2lhLE9BQUwsQ0FBYW5YLE1BQWIsR0FBc0IsQ0FBbkMsRUFBc0M5QyxLQUFLLENBQTNDLEVBQThDQSxHQUE5QyxFQUFtRDtBQUNqRCxhQUFLb2EsWUFBTCxDQUFrQixLQUFLSCxPQUFMLENBQWFqYSxDQUFiLENBQWxCO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7OztpQ0FJYXFULEssRUFBTztBQUNsQixVQUFJcFIsT0FBT3dULEtBQUs0RSxLQUFMLENBQVdoSCxNQUFNblYsT0FBTixDQUFjb2MsbUJBQXpCLENBQVg7O0FBRUFqSCxZQUFNa0gsVUFBTixHQUFtQixJQUFJLHFEQUFKLENBQWM7QUFDL0JsSCxlQUFPQSxLQUR3QjtBQUUvQm1ILGlCQUFTdlksSUFGc0I7QUFHL0JtTixtQkFBV2lFLE1BQU1uVixPQUFOLENBQWN1YztBQUhNLE9BQWQsQ0FBbkI7QUFLRDs7Ozs7O0FBR0hULE9BQU9FLFNBQVAsR0FBbUI7QUFDakJDLFFBQU07QUFEVyxDQUFuQjs7QUFJQSx5REFBZUgsTUFBZixFOzs7Ozs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEVBQUU7O0FBRUYsaUNBQWlDLDJDQUEyQyxnQkFBZ0Isa0JBQWtCLE9BQU8sMkJBQTJCLHdEQUF3RCxnQ0FBZ0MsdURBQXVELDJEQUEyRCxFQUFFLEVBQUUseURBQXlELHFFQUFxRSw2REFBNkQsb0JBQW9CLEdBQUcsRUFBRTs7QUFFbGpCOztBQUVBOztBQUVBOztBQUVBOztBQUVBLHVDQUF1Qyx1Q0FBdUMsZ0JBQWdCOztBQUU5RixrREFBa0QsMENBQTBDLDBEQUEwRCxFQUFFOztBQUV4SjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsMEJBQTBCLGlHQUFpRzs7QUFFM0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1YsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFROztBQUVSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7QUFFVjtBQUNBO0FBQ0EsVUFBVTs7QUFFVjtBQUNBO0FBQ0EsVUFBVTs7QUFFVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7O0FBRVY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVFQUF1RSxnRUFBZ0U7QUFDdkk7O0FBRUE7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQSxFQUFFOztBQUVGOztBQUVBLE9BQU87QUFDUDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxFQUFFOztBQUVGLG1DQUFtQyxpQ0FBaUMsZUFBZSxlQUFlLGdCQUFnQixvQkFBb0IsTUFBTSwwQ0FBMEMsK0JBQStCLGFBQWEscUJBQXFCLG1DQUFtQyxFQUFFLEVBQUUsY0FBYyxXQUFXLFVBQVUsRUFBRSxVQUFVLE1BQU0seUNBQXlDLEVBQUUsVUFBVSxrQkFBa0IsRUFBRSxFQUFFLGFBQWEsRUFBRSwyQkFBMkIsMEJBQTBCLFlBQVksRUFBRSwyQ0FBMkMsOEJBQThCLEVBQUUsT0FBTyw2RUFBNkUsRUFBRSxHQUFHLEVBQUU7O0FBRXRwQjtBQUNBOztBQUVBOztBQUVBO0FBQ0Esa0JBQWtCLGVBQWU7QUFDakM7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixvQkFBb0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGVBQWU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixrQ0FBa0M7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0Esb0VBQW9FLGFBQWE7QUFDakY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxrQzs7Ozs7Ozs7O0FDbFpBO0FBQUE7Ozs7O0FBS0E7QUFDQTs7QUFFQTs7OztBQUlBLHlEQUFlLFVBQVNuUSxTQUFULEVBQW9CO0FBQ2pDLE1BQUksQ0FBQ0EsU0FBTCxFQUFnQkEsWUFBWSxTQUFaOztBQUVoQixNQUFNNlEsa0JBQWtCLFdBQXhCO0FBQ0EsTUFBTUMsY0FBY3JjLFNBQVNpRyxnQkFBVCxDQUEwQixlQUExQixDQUFwQjs7QUFFQSxNQUFJLENBQUNvVyxXQUFMLEVBQWtCOztBQUVsQjs7Ozs7QUFLQS9aLEVBQUEsc0RBQUFBLENBQVErWixXQUFSLEVBQXFCLFVBQVNDLFVBQVQsRUFBcUI7QUFDeEMsUUFBTUMscUJBQXFCLG9FQUFBM2MsQ0FBUTBjLFVBQVIsRUFBb0IsUUFBcEIsQ0FBM0I7O0FBRUEsUUFBSSxDQUFDQyxrQkFBTCxFQUF5Qjs7QUFFekIsUUFBTUMsYUFBYXhjLFNBQVM4WCxjQUFULENBQXdCeUUsa0JBQXhCLENBQW5COztBQUVBLFFBQUksQ0FBQ0MsVUFBTCxFQUFpQjs7QUFFakJGLGVBQVdwYyxnQkFBWCxDQUE0QixPQUE1QixFQUFxQyxVQUFTa0QsS0FBVCxFQUFnQjtBQUNuRCxVQUFJcVosb0JBQUo7QUFDQSxVQUFJQyxjQUFlSixXQUFXMWMsT0FBWCxDQUFtQjhjLFdBQXBCLEdBQ2hCSixXQUFXMWMsT0FBWCxDQUFtQjhjLFdBREgsR0FDaUJuUixTQURuQzs7QUFHQW5JLFlBQU1DLGNBQU47O0FBRUE7QUFDQWlaLGlCQUFXbFIsU0FBWCxDQUFxQnVSLE1BQXJCLENBQTRCUCxlQUE1Qjs7QUFFQTtBQUNBLFVBQUlNLGdCQUFnQm5SLFNBQXBCLEVBQ0VpUixXQUFXcFIsU0FBWCxDQUFxQnVSLE1BQXJCLENBQTRCRCxXQUE1Qjs7QUFFRjtBQUNBRixpQkFBV3BSLFNBQVgsQ0FBcUJ1UixNQUFyQixDQUE0QnBSLFNBQTVCOztBQUVBO0FBQ0FpUixpQkFBV2hhLFlBQVgsQ0FBd0IsYUFBeEIsRUFDRSxDQUFFZ2EsV0FBV3BSLFNBQVgsQ0FBcUJ3UixRQUFyQixDQUE4QkYsV0FBOUIsQ0FESjs7QUFJQTtBQUNBLFVBQUksT0FBT3RiLE9BQU95YixXQUFkLEtBQThCLFVBQWxDLEVBQThDO0FBQzVDSixzQkFBYyxJQUFJSSxXQUFKLENBQWdCLGlCQUFoQixFQUFtQztBQUMvQ3hXLGtCQUFRbVcsV0FBV3BSLFNBQVgsQ0FBcUJ3UixRQUFyQixDQUE4QnJSLFNBQTlCO0FBRHVDLFNBQW5DLENBQWQ7QUFHRCxPQUpELE1BSU87QUFDTGtSLHNCQUFjemMsU0FBU2dTLFdBQVQsQ0FBcUIsYUFBckIsQ0FBZDtBQUNBeUssb0JBQVlLLGVBQVosQ0FBNEIsaUJBQTVCLEVBQStDLElBQS9DLEVBQXFELElBQXJELEVBQTJEO0FBQ3pEelcsa0JBQVFtVyxXQUFXcFIsU0FBWCxDQUFxQndSLFFBQXJCLENBQThCclIsU0FBOUI7QUFEaUQsU0FBM0Q7QUFHRDs7QUFFRGlSLGlCQUFXMUssYUFBWCxDQUF5QjJLLFdBQXpCO0FBQ0QsS0FuQ0Q7QUFvQ0QsR0E3Q0Q7QUE4Q0QsQzs7Ozs7OztBQ3ZFRDtBQUFBO0FBQUE7QUFDQTs7QUFFQSxDQUFDLFVBQVNyYixNQUFULEVBQWlCQyxDQUFqQixFQUFvQjtBQUNuQjs7QUFFQTs7QUFDQUEsSUFBRSxNQUFGLEVBQVU4QixFQUFWLENBQWEsT0FBYixFQUFzQixtQkFBdEIsRUFBMkMsYUFBSztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBNlEsTUFBRTNRLGNBQUY7QUFDQSxRQUFNcVMsVUFBVXJVLEVBQUUyUyxFQUFFK0ksYUFBSixFQUFtQnBkLElBQW5CLENBQXdCLE1BQXhCLElBQ1owQixFQUFFQSxFQUFFMlMsRUFBRStJLGFBQUosRUFBbUJwZCxJQUFuQixDQUF3QixNQUF4QixDQUFGLENBRFksR0FFWjBCLEVBQUVBLEVBQUUyUyxFQUFFK0ksYUFBSixFQUFtQnBaLElBQW5CLENBQXdCLFFBQXhCLENBQUYsQ0FGSjtBQUdBdEMsTUFBRTJTLEVBQUUrSSxhQUFKLEVBQW1CTCxXQUFuQixDQUErQixRQUEvQjtBQUNBaEgsWUFBUWdILFdBQVIsQ0FBb0IsZUFBcEIsRUFDSzdGLElBREwsQ0FDVSxhQURWLEVBQ3lCbkIsUUFBUXRRLFFBQVIsQ0FBaUIsUUFBakIsQ0FEekI7QUFFRCxHQVpELEVBWUdqQyxFQVpILENBWU0sT0FaTixFQVllLGNBWmYsRUFZK0IsYUFBSztBQUNsQztBQUNBNlEsTUFBRTNRLGNBQUY7QUFDQWhDLE1BQUUyUyxFQUFFZ0osY0FBSixFQUFvQjlaLFFBQXBCLENBQTZCLFlBQTdCO0FBQ0E3QixNQUFFLGNBQUYsRUFBa0I0YixJQUFsQjtBQUNELEdBakJELEVBaUJHOVosRUFqQkgsQ0FpQk0sT0FqQk4sRUFpQmUsY0FqQmYsRUFpQitCLGFBQUs7QUFDbEM7QUFDQTZRLE1BQUUzUSxjQUFGO0FBQ0FoQyxNQUFFLGNBQUYsRUFBa0I2YixJQUFsQjtBQUNBN2IsTUFBRTJTLEVBQUVnSixjQUFKLEVBQW9CN1ksV0FBcEIsQ0FBZ0MsWUFBaEM7QUFDRCxHQXRCRDtBQXVCQTtBQUVELENBN0JELEVBNkJHL0MsTUE3QkgsRUE2QlcsOENBN0JYLEUiLCJmaWxlIjoiOWU3NjcxMGUxZjc2YzllNDNlNGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOWU3NjcxMGUxZjc2YzllNDNlNGEiLCJtb2R1bGUuZXhwb3J0cyA9IGpRdWVyeTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImpRdWVyeVwiXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBiYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2Jhc2VFYWNoJyksXG4gICAgY2FzdEZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fY2FzdEZ1bmN0aW9uJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggZWxlbWVudC5cbiAqIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogKipOb3RlOioqIEFzIHdpdGggb3RoZXIgXCJDb2xsZWN0aW9uc1wiIG1ldGhvZHMsIG9iamVjdHMgd2l0aCBhIFwibGVuZ3RoXCJcbiAqIHByb3BlcnR5IGFyZSBpdGVyYXRlZCBsaWtlIGFycmF5cy4gVG8gYXZvaWQgdGhpcyBiZWhhdmlvciB1c2UgYF8uZm9ySW5gXG4gKiBvciBgXy5mb3JPd25gIGZvciBvYmplY3QgaXRlcmF0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBhbGlhcyBlYWNoXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqIEBzZWUgXy5mb3JFYWNoUmlnaHRcbiAqIEBleGFtcGxlXG4gKlxuICogXy5mb3JFYWNoKFsxLCAyXSwgZnVuY3Rpb24odmFsdWUpIHtcbiAqICAgY29uc29sZS5sb2codmFsdWUpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzIGAxYCB0aGVuIGAyYC5cbiAqXG4gKiBfLmZvckVhY2goeyAnYSc6IDEsICdiJzogMiB9LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gKiAgIGNvbnNvbGUubG9nKGtleSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgJ2EnIHRoZW4gJ2InIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpLlxuICovXG5mdW5jdGlvbiBmb3JFYWNoKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciBmdW5jID0gaXNBcnJheShjb2xsZWN0aW9uKSA/IGFycmF5RWFjaCA6IGJhc2VFYWNoO1xuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBjYXN0RnVuY3Rpb24oaXRlcmF0ZWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2ZvckVhY2guanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRpZighbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xyXG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XHJcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcclxuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxyXG5cdFx0aWYoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcclxuXHR9XHJcblx0cmV0dXJuIG1vZHVsZTtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNMZW5ndGguanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgbm93ID0gcmVxdWlyZSgnLi9ub3cnKSxcbiAgICB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHJlc3VsdCA9IHdhaXQgLSB0aW1lU2luY2VMYXN0Q2FsbDtcblxuICAgIHJldHVybiBtYXhpbmcgPyBuYXRpdmVNaW4ocmVzdWx0LCBtYXhXYWl0IC0gdGltZVNpbmNlTGFzdEludm9rZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzaG91bGRJbnZva2UodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWU7XG5cbiAgICAvLyBFaXRoZXIgdGhpcyBpcyB0aGUgZmlyc3QgY2FsbCwgYWN0aXZpdHkgaGFzIHN0b3BwZWQgYW5kIHdlJ3JlIGF0IHRoZVxuICAgIC8vIHRyYWlsaW5nIGVkZ2UsIHRoZSBzeXN0ZW0gdGltZSBoYXMgZ29uZSBiYWNrd2FyZHMgYW5kIHdlJ3JlIHRyZWF0aW5nXG4gICAgLy8gaXQgYXMgdGhlIHRyYWlsaW5nIGVkZ2UsIG9yIHdlJ3ZlIGhpdCB0aGUgYG1heFdhaXRgIGxpbWl0LlxuICAgIHJldHVybiAobGFzdENhbGxUaW1lID09PSB1bmRlZmluZWQgfHwgKHRpbWVTaW5jZUxhc3RDYWxsID49IHdhaXQpIHx8XG4gICAgICAodGltZVNpbmNlTGFzdENhbGwgPCAwKSB8fCAobWF4aW5nICYmIHRpbWVTaW5jZUxhc3RJbnZva2UgPj0gbWF4V2FpdCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGltZXJFeHBpcmVkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCk7XG4gICAgaWYgKHNob3VsZEludm9rZSh0aW1lKSkge1xuICAgICAgcmV0dXJuIHRyYWlsaW5nRWRnZSh0aW1lKTtcbiAgICB9XG4gICAgLy8gUmVzdGFydCB0aGUgdGltZXIuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCByZW1haW5pbmdXYWl0KHRpbWUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYWlsaW5nRWRnZSh0aW1lKSB7XG4gICAgdGltZXJJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8vIE9ubHkgaW52b2tlIGlmIHdlIGhhdmUgYGxhc3RBcmdzYCB3aGljaCBtZWFucyBgZnVuY2AgaGFzIGJlZW5cbiAgICAvLyBkZWJvdW5jZWQgYXQgbGVhc3Qgb25jZS5cbiAgICBpZiAodHJhaWxpbmcgJiYgbGFzdEFyZ3MpIHtcbiAgICAgIHJldHVybiBpbnZva2VGdW5jKHRpbWUpO1xuICAgIH1cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgIH1cbiAgICBsYXN0SW52b2tlVGltZSA9IDA7XG4gICAgbGFzdEFyZ3MgPSBsYXN0Q2FsbFRpbWUgPSBsYXN0VGhpcyA9IHRpbWVySWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICByZXR1cm4gdGltZXJJZCA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdHJhaWxpbmdFZGdlKG5vdygpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpLFxuICAgICAgICBpc0ludm9raW5nID0gc2hvdWxkSW52b2tlKHRpbWUpO1xuXG4gICAgbGFzdEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgbGFzdFRoaXMgPSB0aGlzO1xuICAgIGxhc3RDYWxsVGltZSA9IHRpbWU7XG5cbiAgICBpZiAoaXNJbnZva2luZykge1xuICAgICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbGVhZGluZ0VkZ2UobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhpbmcpIHtcbiAgICAgICAgLy8gSGFuZGxlIGludm9jYXRpb25zIGluIGEgdGlnaHQgbG9vcC5cbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9kZWJvdW5jZS5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4qIFV0aWxpdHkgbW9kdWxlIHRvIGdldCB2YWx1ZSBvZiBhIGRhdGEgYXR0cmlidXRlXG4qIEBwYXJhbSB7b2JqZWN0fSBlbGVtIC0gRE9NIG5vZGUgYXR0cmlidXRlIGlzIHJldHJpZXZlZCBmcm9tXG4qIEBwYXJhbSB7c3RyaW5nfSBhdHRyIC0gQXR0cmlidXRlIG5hbWUgKGRvIG5vdCBpbmNsdWRlIHRoZSAnZGF0YS0nIHBhcnQpXG4qIEByZXR1cm4ge21peGVkfSAtIFZhbHVlIG9mIGVsZW1lbnQncyBkYXRhIGF0dHJpYnV0ZVxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGVsZW0sIGF0dHIpIHtcbiAgaWYgKHR5cGVvZiBlbGVtLmRhdGFzZXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLScgKyBhdHRyKTtcbiAgfVxuICByZXR1cm4gZWxlbS5kYXRhc2V0W2F0dHJdO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvZGF0YXNldC5qcyIsIi8vICAgICBVbmRlcnNjb3JlLmpzIDEuOC4zXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBleHBvcnRzYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQsXG4gICAgbmF0aXZlQ3JlYXRlICAgICAgID0gT2JqZWN0LmNyZWF0ZTtcblxuICAvLyBOYWtlZCBmdW5jdGlvbiByZWZlcmVuY2UgZm9yIHN1cnJvZ2F0ZS1wcm90b3R5cGUtc3dhcHBpbmcuXG4gIHZhciBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdC5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gXztcbiAgICB9XG4gICAgZXhwb3J0cy5fID0gXztcbiAgfSBlbHNlIHtcbiAgICByb290Ll8gPSBfO1xuICB9XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uLlxuICBfLlZFUlNJT04gPSAnMS44LjMnO1xuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlZmZpY2llbnQgKGZvciBjdXJyZW50IGVuZ2luZXMpIHZlcnNpb25cbiAgLy8gb2YgdGhlIHBhc3NlZC1pbiBjYWxsYmFjaywgdG8gYmUgcmVwZWF0ZWRseSBhcHBsaWVkIGluIG90aGVyIFVuZGVyc2NvcmVcbiAgLy8gZnVuY3Rpb25zLlxuICB2YXIgb3B0aW1pemVDYiA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgcmV0dXJuIGZ1bmM7XG4gICAgc3dpdGNoIChhcmdDb3VudCA9PSBudWxsID8gMyA6IGFyZ0NvdW50KSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgb3RoZXIpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEEgbW9zdGx5LWludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGNhbGxiYWNrcyB0aGF0IGNhbiBiZSBhcHBsaWVkXG4gIC8vIHRvIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24sIHJldHVybmluZyB0aGUgZGVzaXJlZCByZXN1bHQg4oCUIGVpdGhlclxuICAvLyBpZGVudGl0eSwgYW4gYXJiaXRyYXJ5IGNhbGxiYWNrLCBhIHByb3BlcnR5IG1hdGNoZXIsIG9yIGEgcHJvcGVydHkgYWNjZXNzb3IuXG4gIHZhciBjYiA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXy5pZGVudGl0eTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIG9wdGltaXplQ2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHJldHVybiBfLm1hdGNoZXIodmFsdWUpO1xuICAgIHJldHVybiBfLnByb3BlcnR5KHZhbHVlKTtcbiAgfTtcbiAgXy5pdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNiKHZhbHVlLCBjb250ZXh0LCBJbmZpbml0eSk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFzc2lnbmVyIGZ1bmN0aW9ucy5cbiAgdmFyIGNyZWF0ZUFzc2lnbmVyID0gZnVuY3Rpb24oa2V5c0Z1bmMsIHVuZGVmaW5lZE9ubHkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggPCAyIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XSxcbiAgICAgICAgICAgIGtleXMgPSBrZXlzRnVuYyhzb3VyY2UpLFxuICAgICAgICAgICAgbCA9IGtleXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmICghdW5kZWZpbmVkT25seSB8fCBvYmpba2V5XSA9PT0gdm9pZCAwKSBvYmpba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgbmV3IG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gYW5vdGhlci5cbiAgdmFyIGJhc2VDcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICBpZiAoIV8uaXNPYmplY3QocHJvdG90eXBlKSkgcmV0dXJuIHt9O1xuICAgIGlmIChuYXRpdmVDcmVhdGUpIHJldHVybiBuYXRpdmVDcmVhdGUocHJvdG90eXBlKTtcbiAgICBDdG9yLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEN0b3I7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdmFyIHByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PSBudWxsID8gdm9pZCAwIDogb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBIZWxwZXIgZm9yIGNvbGxlY3Rpb24gbWV0aG9kcyB0byBkZXRlcm1pbmUgd2hldGhlciBhIGNvbGxlY3Rpb25cbiAgLy8gc2hvdWxkIGJlIGl0ZXJhdGVkIGFzIGFuIGFycmF5IG9yIGFzIGFuIG9iamVjdFxuICAvLyBSZWxhdGVkOiBodHRwOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aFxuICAvLyBBdm9pZHMgYSB2ZXJ5IG5hc3R5IGlPUyA4IEpJVCBidWcgb24gQVJNLTY0LiAjMjA5NFxuICB2YXIgTUFYX0FSUkFZX0lOREVYID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcbiAgdmFyIGdldExlbmd0aCA9IHByb3BlcnR5KCdsZW5ndGgnKTtcbiAgdmFyIGlzQXJyYXlMaWtlID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgfTtcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIHJhdyBvYmplY3RzIGluIGFkZGl0aW9uIHRvIGFycmF5LWxpa2VzLiBUcmVhdHMgYWxsXG4gIC8vIHNwYXJzZSBhcnJheS1saWtlcyBhcyBpZiB0aGV5IHdlcmUgZGVuc2UuXG4gIF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBpLCBsZW5ndGg7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpbaV0sIGksIG9iaik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudC5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdHMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICByZXN1bHRzW2luZGV4XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgcmVkdWNpbmcgZnVuY3Rpb24gaXRlcmF0aW5nIGxlZnQgb3IgcmlnaHQuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlZHVjZShkaXIpIHtcbiAgICAvLyBPcHRpbWl6ZWQgaXRlcmF0b3IgZnVuY3Rpb24gYXMgdXNpbmcgYXJndW1lbnRzLmxlbmd0aFxuICAgIC8vIGluIHRoZSBtYWluIGZ1bmN0aW9uIHdpbGwgZGVvcHRpbWl6ZSB0aGUsIHNlZSAjMTk5MS5cbiAgICBmdW5jdGlvbiBpdGVyYXRvcihvYmosIGl0ZXJhdGVlLCBtZW1vLCBrZXlzLCBpbmRleCwgbGVuZ3RoKSB7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRlZShtZW1vLCBvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgY29udGV4dCkge1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCA0KTtcbiAgICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgICAgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICAvLyBEZXRlcm1pbmUgdGhlIGluaXRpYWwgdmFsdWUgaWYgbm9uZSBpcyBwcm92aWRlZC5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBtZW1vID0gb2JqW2tleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4XTtcbiAgICAgICAgaW5kZXggKz0gZGlyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpO1xuICAgIH07XG4gIH1cblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuXG4gIF8ucmVkdWNlID0gXy5mb2xkbCA9IF8uaW5qZWN0ID0gY3JlYXRlUmVkdWNlKDEpO1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICBfLnJlZHVjZVJpZ2h0ID0gXy5mb2xkciA9IGNyZWF0ZVJlZHVjZSgtMSk7XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIGtleTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAga2V5ID0gXy5maW5kSW5kZXgob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXkgPSBfLmZpbmRLZXkob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAoa2V5ICE9PSB2b2lkIDAgJiYga2V5ICE9PSAtMSkgcmV0dXJuIG9ialtrZXldO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYHNlbGVjdGAuXG4gIF8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBfLnJlamVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5uZWdhdGUoY2IocHJlZGljYXRlKSksIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbGxgLlxuICBfLmV2ZXJ5ID0gXy5hbGwgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmICghcHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiB0aGUgYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gaXRlbSAodXNpbmcgYD09PWApLlxuICAvLyBBbGlhc2VkIGFzIGBpbmNsdWRlc2AgYW5kIGBpbmNsdWRlYC5cbiAgXy5jb250YWlucyA9IF8uaW5jbHVkZXMgPSBfLmluY2x1ZGUgPSBmdW5jdGlvbihvYmosIGl0ZW0sIGZyb21JbmRleCwgZ3VhcmQpIHtcbiAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgaWYgKHR5cGVvZiBmcm9tSW5kZXggIT0gJ251bWJlcicgfHwgZ3VhcmQpIGZyb21JbmRleCA9IDA7XG4gICAgcmV0dXJuIF8uaW5kZXhPZihvYmosIGl0ZW0sIGZyb21JbmRleCkgPj0gMDtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGZ1bmMgPSBpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdO1xuICAgICAgcmV0dXJuIGZ1bmMgPT0gbnVsbCA/IGZ1bmMgOiBmdW5jLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBtYXBgOiBmZXRjaGluZyBhIHByb3BlcnR5LlxuICBfLnBsdWNrID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBfLnByb3BlcnR5KGtleSkpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbHRlcmA6IHNlbGVjdGluZyBvbmx5IG9iamVjdHNcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy53aGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaW5kYDogZ2V0dGluZyB0aGUgZmlyc3Qgb2JqZWN0XG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uZmluZFdoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbmQob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSAtSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA+IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkID4gbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSAtSW5maW5pdHkgJiYgcmVzdWx0ID09PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlIDwgcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IEluZmluaXR5ICYmIHJlc3VsdCA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhIGNvbGxlY3Rpb24sIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGVcbiAgLy8gW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgc2V0ID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IHNldC5sZW5ndGg7XG4gICAgdmFyIHNodWZmbGVkID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIHJhbmQ7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oMCwgaW5kZXgpO1xuICAgICAgaWYgKHJhbmQgIT09IGluZGV4KSBzaHVmZmxlZFtpbmRleF0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gc2V0W2luZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIFNhbXBsZSAqKm4qKiByYW5kb20gdmFsdWVzIGZyb20gYSBjb2xsZWN0aW9uLlxuICAvLyBJZiAqKm4qKiBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm5zIGEgc2luZ2xlIHJhbmRvbSBlbGVtZW50LlxuICAvLyBUaGUgaW50ZXJuYWwgYGd1YXJkYCBhcmd1bWVudCBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBtYXBgLlxuICBfLnNhbXBsZSA9IGZ1bmN0aW9uKG9iaiwgbiwgZ3VhcmQpIHtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgICByZXR1cm4gb2JqW18ucmFuZG9tKG9iai5sZW5ndGggLSAxKV07XG4gICAgfVxuICAgIHJldHVybiBfLnNodWZmbGUob2JqKS5zbGljZSgwLCBNYXRoLm1heCgwLCBuKSk7XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdGVlLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gXy5wbHVjayhfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhOiBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihiZWhhdmlvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICB2YXIga2V5ID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIHZhbHVlLCBrZXkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSk7IGVsc2UgcmVzdWx0W2tleV0gPSBbdmFsdWVdO1xuICB9KTtcblxuICAvLyBJbmRleGVzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24sIHNpbWlsYXIgdG8gYGdyb3VwQnlgLCBidXQgZm9yXG4gIC8vIHdoZW4geW91IGtub3cgdGhhdCB5b3VyIGluZGV4IHZhbHVlcyB3aWxsIGJlIHVuaXF1ZS5cbiAgXy5pbmRleEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldKys7IGVsc2UgcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBTYWZlbHkgY3JlYXRlIGEgcmVhbCwgbGl2ZSBhcnJheSBmcm9tIGFueXRoaW5nIGl0ZXJhYmxlLlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkgcmV0dXJuIF8ubWFwKG9iaiwgXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9iaik7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiBpc0FycmF5TGlrZShvYmopID8gb2JqLmxlbmd0aCA6IF8ua2V5cyhvYmopLmxlbmd0aDtcbiAgfTtcblxuICAvLyBTcGxpdCBhIGNvbGxlY3Rpb24gaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIHBhc3MgPSBbXSwgZmFpbCA9IFtdO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikge1xuICAgICAgKHByZWRpY2F0ZSh2YWx1ZSwga2V5LCBvYmopID8gcGFzcyA6IGZhaWwpLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBbcGFzcywgZmFpbF07XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICByZXR1cm4gXy5pbml0aWFsKGFycmF5LCBhcnJheS5sZW5ndGggLSBuKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIChuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbikpKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gXy5yZXN0KGFycmF5LCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSBuKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBzdHJpY3QsIHN0YXJ0SW5kZXgpIHtcbiAgICB2YXIgb3V0cHV0ID0gW10sIGlkeCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0SW5kZXggfHwgMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGlucHV0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpbnB1dFtpXTtcbiAgICAgIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiYgKF8uaXNBcnJheSh2YWx1ZSkgfHwgXy5pc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgICAgIC8vZmxhdHRlbiBjdXJyZW50IGxldmVsIG9mIGFycmF5IG9yIGFyZ3VtZW50cyBvYmplY3RcbiAgICAgICAgaWYgKCFzaGFsbG93KSB2YWx1ZSA9IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIHN0cmljdCk7XG4gICAgICAgIHZhciBqID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICBvdXRwdXQubGVuZ3RoICs9IGxlbjtcbiAgICAgICAgd2hpbGUgKGogPCBsZW4pIHtcbiAgICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWVbaisrXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghc3RyaWN0KSB7XG4gICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBGbGF0dGVuIG91dCBhbiBhcnJheSwgZWl0aGVyIHJlY3Vyc2l2ZWx5IChieSBkZWZhdWx0KSwgb3IganVzdCBvbmUgbGV2ZWwuXG4gIF8uZmxhdHRlbiA9IGZ1bmN0aW9uKGFycmF5LCBzaGFsbG93KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oYXJyYXksIHNoYWxsb3csIGZhbHNlKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSB2ZXJzaW9uIG9mIHRoZSBhcnJheSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gdGhlIHNwZWNpZmllZCB2YWx1ZShzKS5cbiAgXy53aXRob3V0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGFycmF5LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRlZTtcbiAgICAgIGl0ZXJhdGVlID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXRlcmF0ZWUgIT0gbnVsbCkgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV0sXG4gICAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlLCBpLCBhcnJheSkgOiB2YWx1ZTtcbiAgICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgICBpZiAoIWkgfHwgc2VlbiAhPT0gY29tcHV0ZWQpIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgc2VlbiA9IGNvbXB1dGVkO1xuICAgICAgfSBlbHNlIGlmIChpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoc2VlbiwgY29tcHV0ZWQpKSB7XG4gICAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIV8uY29udGFpbnMocmVzdWx0LCB2YWx1ZSkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgXy51bmlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuaXEoZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gYXJyYXlbaV07XG4gICAgICBpZiAoXy5jb250YWlucyhyZXN1bHQsIGl0ZW0pKSBjb250aW51ZTtcbiAgICAgIGZvciAodmFyIGogPSAxOyBqIDwgYXJnc0xlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhhcmd1bWVudHNbal0sIGl0ZW0pKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChqID09PSBhcmdzTGVuZ3RoKSByZXN1bHQucHVzaChpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSwgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICByZXR1cm4gIV8uY29udGFpbnMocmVzdCwgdmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW56aXAoYXJndW1lbnRzKTtcbiAgfTtcblxuICAvLyBDb21wbGVtZW50IG9mIF8uemlwLiBVbnppcCBhY2NlcHRzIGFuIGFycmF5IG9mIGFycmF5cyBhbmQgZ3JvdXBzXG4gIC8vIGVhY2ggYXJyYXkncyBlbGVtZW50cyBvbiBzaGFyZWQgaW5kaWNlc1xuICBfLnVuemlwID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkgJiYgXy5tYXgoYXJyYXksIGdldExlbmd0aCkubGVuZ3RoIHx8IDA7XG4gICAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gXy5wbHVjayhhcnJheSwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgXy5vYmplY3QgPSBmdW5jdGlvbihsaXN0LCB2YWx1ZXMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChsaXN0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgZmluZEluZGV4IGFuZCBmaW5kTGFzdEluZGV4IGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcihkaXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgdmFyIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBvbiBhbiBhcnJheS1saWtlIHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kSW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigxKTtcbiAgXy5maW5kTGFzdEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoLTEpO1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRlZShvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IE1hdGguZmxvb3IoKGxvdyArIGhpZ2gpIC8gMik7XG4gICAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbbWlkXSkgPCB2YWx1ZSkgbG93ID0gbWlkICsgMTsgZWxzZSBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGluZGV4T2YgYW5kIGxhc3RJbmRleE9mIGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBjcmVhdGVJbmRleEZpbmRlcihkaXIsIHByZWRpY2F0ZUZpbmQsIHNvcnRlZEluZGV4KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpZHgpIHtcbiAgICAgIHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIGlmICh0eXBlb2YgaWR4ID09ICdudW1iZXInKSB7XG4gICAgICAgIGlmIChkaXIgPiAwKSB7XG4gICAgICAgICAgICBpID0gaWR4ID49IDAgPyBpZHggOiBNYXRoLm1heChpZHggKyBsZW5ndGgsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVuZ3RoID0gaWR4ID49IDAgPyBNYXRoLm1pbihpZHggKyAxLCBsZW5ndGgpIDogaWR4ICsgbGVuZ3RoICsgMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzb3J0ZWRJbmRleCAmJiBpZHggJiYgbGVuZ3RoKSB7XG4gICAgICAgIGlkeCA9IHNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2lkeF0gPT09IGl0ZW0gPyBpZHggOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtICE9PSBpdGVtKSB7XG4gICAgICAgIGlkeCA9IHByZWRpY2F0ZUZpbmQoc2xpY2UuY2FsbChhcnJheSwgaSwgbGVuZ3RoKSwgXy5pc05hTik7XG4gICAgICAgIHJldHVybiBpZHggPj0gMCA/IGlkeCArIGkgOiAtMTtcbiAgICAgIH1cbiAgICAgIGZvciAoaWR4ID0gZGlyID4gMCA/IGkgOiBsZW5ndGggLSAxOyBpZHggPj0gMCAmJiBpZHggPCBsZW5ndGg7IGlkeCArPSBkaXIpIHtcbiAgICAgICAgaWYgKGFycmF5W2lkeF0gPT09IGl0ZW0pIHJldHVybiBpZHg7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpbiBhbiBhcnJheSxcbiAgLy8gb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKDEsIF8uZmluZEluZGV4LCBfLnNvcnRlZEluZGV4KTtcbiAgXy5sYXN0SW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKC0xLCBfLmZpbmRMYXN0SW5kZXgpO1xuXG4gIC8vIEdlbmVyYXRlIGFuIGludGVnZXIgQXJyYXkgY29udGFpbmluZyBhbiBhcml0aG1ldGljIHByb2dyZXNzaW9uLiBBIHBvcnQgb2ZcbiAgLy8gdGhlIG5hdGl2ZSBQeXRob24gYHJhbmdlKClgIGZ1bmN0aW9uLiBTZWVcbiAgLy8gW3RoZSBQeXRob24gZG9jdW1lbnRhdGlvbl0oaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgXy5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKHN0b3AgPT0gbnVsbCkge1xuICAgICAgc3RvcCA9IHN0YXJ0IHx8IDA7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHN0ZXAgPSBzdGVwIHx8IDE7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciByYW5nZSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBsZW5ndGg7IGlkeCsrLCBzdGFydCArPSBzdGVwKSB7XG4gICAgICByYW5nZVtpZHhdID0gc3RhcnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGV4ZWN1dGUgYSBmdW5jdGlvbiBhcyBhIGNvbnN0cnVjdG9yXG4gIC8vIG9yIGEgbm9ybWFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50c1xuICB2YXIgZXhlY3V0ZUJvdW5kID0gZnVuY3Rpb24oc291cmNlRnVuYywgYm91bmRGdW5jLCBjb250ZXh0LCBjYWxsaW5nQ29udGV4dCwgYXJncykge1xuICAgIGlmICghKGNhbGxpbmdDb250ZXh0IGluc3RhbmNlb2YgYm91bmRGdW5jKSkgcmV0dXJuIHNvdXJjZUZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgdmFyIHNlbGYgPSBiYXNlQ3JlYXRlKHNvdXJjZUZ1bmMucHJvdG90eXBlKTtcbiAgICB2YXIgcmVzdWx0ID0gc291cmNlRnVuYy5hcHBseShzZWxmLCBhcmdzKTtcbiAgICBpZiAoXy5pc09iamVjdChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIGlmIChuYXRpdmVCaW5kICYmIGZ1bmMuYmluZCA9PT0gbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihmdW5jKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQmluZCBtdXN0IGJlIGNhbGxlZCBvbiBhIGZ1bmN0aW9uJyk7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCBjb250ZXh0LCB0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LiBfIGFjdHNcbiAgLy8gYXMgYSBwbGFjZWhvbGRlciwgYWxsb3dpbmcgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyB0byBiZSBwcmUtZmlsbGVkLlxuICBfLnBhcnRpYWwgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIGJvdW5kQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IDAsIGxlbmd0aCA9IGJvdW5kQXJncy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IEFycmF5KGxlbmd0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFyZ3NbaV0gPSBib3VuZEFyZ3NbaV0gPT09IF8gPyBhcmd1bWVudHNbcG9zaXRpb24rK10gOiBib3VuZEFyZ3NbaV07XG4gICAgICB9XG4gICAgICB3aGlsZSAocG9zaXRpb24gPCBhcmd1bWVudHMubGVuZ3RoKSBhcmdzLnB1c2goYXJndW1lbnRzW3Bvc2l0aW9uKytdKTtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIHRoaXMsIHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9O1xuXG4gIC8vIEJpbmQgYSBudW1iZXIgb2YgYW4gb2JqZWN0J3MgbWV0aG9kcyB0byB0aGF0IG9iamVjdC4gUmVtYWluaW5nIGFyZ3VtZW50c1xuICAvLyBhcmUgdGhlIG1ldGhvZCBuYW1lcyB0byBiZSBib3VuZC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0IGFsbCBjYWxsYmFja3NcbiAgLy8gZGVmaW5lZCBvbiBhbiBvYmplY3QgYmVsb25nIHRvIGl0LlxuICBfLmJpbmRBbGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCwga2V5O1xuICAgIGlmIChsZW5ndGggPD0gMSkgdGhyb3cgbmV3IEVycm9yKCdiaW5kQWxsIG11c3QgYmUgcGFzc2VkIGZ1bmN0aW9uIG5hbWVzJyk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBhcmd1bWVudHNbaV07XG4gICAgICBvYmpba2V5XSA9IF8uYmluZChvYmpba2V5XSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBfLm1lbW9pemUgPSBmdW5jdGlvbihmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtb2l6ZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIGNhY2hlID0gbWVtb2l6ZS5jYWNoZTtcbiAgICAgIHZhciBhZGRyZXNzID0gJycgKyAoaGFzaGVyID8gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBrZXkpO1xuICAgICAgaWYgKCFfLmhhcyhjYWNoZSwgYWRkcmVzcykpIGNhY2hlW2FkZHJlc3NdID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIGNhY2hlW2FkZHJlc3NdO1xuICAgIH07XG4gICAgbWVtb2l6ZS5jYWNoZSA9IHt9O1xuICAgIHJldHVybiBtZW1vaXplO1xuICB9O1xuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICBfLmRlbGF5ID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCB3YWl0KTtcbiAgfTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IF8ucGFydGlhbChfLmRlbGF5LCBfLCAxKTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBfLm5vdygpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm93ID0gXy5ub3coKTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAgLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICAvLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAgLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAgXy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcblxuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxhc3QgPSBfLm5vdygpIC0gdGltZXN0YW1wO1xuXG4gICAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+PSAwKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHRpbWVzdGFtcCA9IF8ubm93KCk7XG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGlmICghdGltZW91dCkgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBfLnBhcnRpYWwod3JhcHBlciwgZnVuYyk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIG5lZ2F0ZWQgdmVyc2lvbiBvZiB0aGUgcGFzc2VkLWluIHByZWRpY2F0ZS5cbiAgXy5uZWdhdGUgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIHN0YXJ0ID0gYXJncy5sZW5ndGggLSAxO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpID0gc3RhcnQ7XG4gICAgICB2YXIgcmVzdWx0ID0gYXJnc1tzdGFydF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHdoaWxlIChpLS0pIHJlc3VsdCA9IGFyZ3NbaV0uY2FsbCh0aGlzLCByZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBvbiBhbmQgYWZ0ZXIgdGhlIE50aCBjYWxsLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCB1cCB0byAoYnV0IG5vdCBpbmNsdWRpbmcpIHRoZSBOdGggY2FsbC5cbiAgXy5iZWZvcmUgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHZhciBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzID4gMCkge1xuICAgICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKHRpbWVzIDw9IDEpIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGF0IG1vc3Qgb25lIHRpbWUsIG5vIG1hdHRlciBob3dcbiAgLy8gb2Z0ZW4geW91IGNhbGwgaXQuIFVzZWZ1bCBmb3IgbGF6eSBpbml0aWFsaXphdGlvbi5cbiAgXy5vbmNlID0gXy5wYXJ0aWFsKF8uYmVmb3JlLCAyKTtcblxuICAvLyBPYmplY3QgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBLZXlzIGluIElFIDwgOSB0aGF0IHdvbid0IGJlIGl0ZXJhdGVkIGJ5IGBmb3Iga2V5IGluIC4uLmAgYW5kIHRodXMgbWlzc2VkLlxuICB2YXIgaGFzRW51bUJ1ZyA9ICF7dG9TdHJpbmc6IG51bGx9LnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xuICB2YXIgbm9uRW51bWVyYWJsZVByb3BzID0gWyd2YWx1ZU9mJywgJ2lzUHJvdG90eXBlT2YnLCAndG9TdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdoYXNPd25Qcm9wZXJ0eScsICd0b0xvY2FsZVN0cmluZyddO1xuXG4gIGZ1bmN0aW9uIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKSB7XG4gICAgdmFyIG5vbkVudW1JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IG9iai5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgcHJvdG8gPSAoXy5pc0Z1bmN0aW9uKGNvbnN0cnVjdG9yKSAmJiBjb25zdHJ1Y3Rvci5wcm90b3R5cGUpIHx8IE9ialByb3RvO1xuXG4gICAgLy8gQ29uc3RydWN0b3IgaXMgYSBzcGVjaWFsIGNhc2UuXG4gICAgdmFyIHByb3AgPSAnY29uc3RydWN0b3InO1xuICAgIGlmIChfLmhhcyhvYmosIHByb3ApICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSBrZXlzLnB1c2gocHJvcCk7XG5cbiAgICB3aGlsZSAobm9uRW51bUlkeC0tKSB7XG4gICAgICBwcm9wID0gbm9uRW51bWVyYWJsZVByb3BzW25vbkVudW1JZHhdO1xuICAgICAgaWYgKHByb3AgaW4gb2JqICYmIG9ialtwcm9wXSAhPT0gcHJvdG9bcHJvcF0gJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIHtcbiAgICAgICAga2V5cy5wdXNoKHByb3ApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYE9iamVjdC5rZXlzYFxuICBfLmtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIGlmIChuYXRpdmVLZXlzKSByZXR1cm4gbmF0aXZlS2V5cyhvYmopO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgYWxsIHRoZSBwcm9wZXJ0eSBuYW1lcyBvZiBhbiBvYmplY3QuXG4gIF8uYWxsS2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHZhbHVlcyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudCBvZiB0aGUgb2JqZWN0XG4gIC8vIEluIGNvbnRyYXN0IHRvIF8ubWFwIGl0IHJldHVybnMgYW4gb2JqZWN0XG4gIF8ubWFwT2JqZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIF8ua2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoLFxuICAgICAgICAgIHJlc3VsdHMgPSB7fSxcbiAgICAgICAgICBjdXJyZW50S2V5O1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjdXJyZW50S2V5ID0ga2V5c1tpbmRleF07XG4gICAgICAgIHJlc3VsdHNbY3VycmVudEtleV0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgXy5wYWlycyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBwYWlycyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcGFpcnNbaV0gPSBba2V5c1tpXSwgb2JqW2tleXNbaV1dXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9O1xuXG4gIC8vIEludmVydCB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIGFuIG9iamVjdC4gVGhlIHZhbHVlcyBtdXN0IGJlIHNlcmlhbGl6YWJsZS5cbiAgXy5pbnZlcnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W29ialtrZXlzW2ldXV0gPSBrZXlzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cyk7XG5cbiAgLy8gQXNzaWducyBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgb3duIHByb3BlcnRpZXMgaW4gdGhlIHBhc3NlZC1pbiBvYmplY3QocylcbiAgLy8gKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ24pXG4gIF8uZXh0ZW5kT3duID0gXy5hc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihfLmtleXMpO1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGtleSBvbiBhbiBvYmplY3QgdGhhdCBwYXNzZXMgYSBwcmVkaWNhdGUgdGVzdFxuICBfLmZpbmRLZXkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKSwga2V5O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpba2V5XSwga2V5LCBvYmopKSByZXR1cm4ga2V5O1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmplY3QsIG9pdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSB7fSwgb2JqID0gb2JqZWN0LCBpdGVyYXRlZSwga2V5cztcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihvaXRlcmF0ZWUpKSB7XG4gICAgICBrZXlzID0gXy5hbGxLZXlzKG9iaik7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2Iob2l0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5cyA9IGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHsgcmV0dXJuIGtleSBpbiBvYmo7IH07XG4gICAgICBvYmogPSBPYmplY3Qob2JqKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gICAgICBpZiAoaXRlcmF0ZWUodmFsdWUsIGtleSwgb2JqKSkgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGl0ZXJhdGVlKSkge1xuICAgICAgaXRlcmF0ZWUgPSBfLm5lZ2F0ZShpdGVyYXRlZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5tYXAoZmxhdHRlbihhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgMSksIFN0cmluZyk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKGtleXMsIGtleSk7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gXy5waWNrKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMsIHRydWUpO1xuXG4gIC8vIENyZWF0ZXMgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGUgZ2l2ZW4gcHJvdG90eXBlIG9iamVjdC5cbiAgLy8gSWYgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGFyZSBwcm92aWRlZCB0aGVuIHRoZXkgd2lsbCBiZSBhZGRlZCB0byB0aGVcbiAgLy8gY3JlYXRlZCBvYmplY3QuXG4gIF8uY3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlLCBwcm9wcykge1xuICAgIHZhciByZXN1bHQgPSBiYXNlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgaWYgKHByb3BzKSBfLmV4dGVuZE93bihyZXN1bHQsIHByb3BzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZiBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5pc01hdGNoID0gZnVuY3Rpb24ob2JqZWN0LCBhdHRycykge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKGF0dHJzKSwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gIWxlbmd0aDtcbiAgICB2YXIgb2JqID0gT2JqZWN0KG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoYXR0cnNba2V5XSAhPT0gb2JqW2tleV0gfHwgIShrZXkgaW4gb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PT0gMSAvIGI7XG4gICAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gYSA9PT0gYjtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXykgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gQ29tcGFyZSBgW1tDbGFzc11dYCBuYW1lcy5cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAoY2xhc3NOYW1lICE9PSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvZXJjZWQgdG8gc3RyaW5ncyBmb3IgY29tcGFyaXNvbiAoTm90ZTogJycgKyAvYS9pID09PSAnL2EvaScpXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiAnJyArIGEgPT09ICcnICsgYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuXG4gICAgICAgIC8vIE9iamVjdChOYU4pIGlzIGVxdWl2YWxlbnQgdG8gTmFOXG4gICAgICAgIGlmICgrYSAhPT0gK2EpIHJldHVybiArYiAhPT0gK2I7XG4gICAgICAgIC8vIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3Igb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgIHJldHVybiArYSA9PT0gMCA/IDEgLyArYSA9PT0gMSAvIGIgOiArYSA9PT0gK2I7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT09ICtiO1xuICAgIH1cblxuICAgIHZhciBhcmVBcnJheXMgPSBjbGFzc05hbWUgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgaWYgKCFhcmVBcnJheXMpIHtcbiAgICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHMgb3IgYEFycmF5YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiBhQ3RvciBpbnN0YW5jZW9mIGFDdG9yICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiBiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBc3N1bWUgZXF1YWxpdHkgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljXG4gICAgLy8gc3RydWN0dXJlcyBpcyBhZGFwdGVkIGZyb20gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AuXG5cbiAgICAvLyBJbml0aWFsaXppbmcgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgLy8gSXQncyBkb25lIGhlcmUgc2luY2Ugd2Ugb25seSBuZWVkIHRoZW0gZm9yIG9iamVjdHMgYW5kIGFycmF5cyBjb21wYXJpc29uLlxuICAgIGFTdGFjayA9IGFTdGFjayB8fCBbXTtcbiAgICBiU3RhY2sgPSBiU3RhY2sgfHwgW107XG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09PSBiO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChhcmVBcnJheXMpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgbGVuZ3RoID0gYS5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoICE9PSBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBpZiAoIWVxKGFbbGVuZ3RoXSwgYltsZW5ndGhdLCBhU3RhY2ssIGJTdGFjaykpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhhKSwga2V5O1xuICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcyBiZWZvcmUgY29tcGFyaW5nIGRlZXAgZXF1YWxpdHkuXG4gICAgICBpZiAoXy5rZXlzKGIpLmxlbmd0aCAhPT0gbGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyXG4gICAgICAgIGtleSA9IGtleXNbbGVuZ3RoXTtcbiAgICAgICAgaWYgKCEoXy5oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBfLmlzRXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopICYmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikgfHwgXy5pc0FyZ3VtZW50cyhvYmopKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gICAgcmV0dXJuIF8ua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIG9iajtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JyAmJiAhIW9iajtcbiAgfTtcblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cCwgaXNFcnJvci5cbiAgXy5lYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnLCAnRXJyb3InXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFIDwgOSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaGFzKG9iaiwgJ2NhbGxlZScpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuIFdvcmsgYXJvdW5kIHNvbWUgdHlwZW9mIGJ1Z3MgaW4gb2xkIHY4LFxuICAvLyBJRSAxMSAoIzE2MjEpLCBhbmQgaW4gU2FmYXJpIDggKCMxOTI5KS5cbiAgaWYgKHR5cGVvZiAvLi8gIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgSW50OEFycmF5ICE9ICdvYmplY3QnKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPT0gK29iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0ZWVzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUHJlZGljYXRlLWdlbmVyYXRpbmcgZnVuY3Rpb25zLiBPZnRlbiB1c2VmdWwgb3V0c2lkZSBvZiBVbmRlcnNjb3JlLlxuICBfLmNvbnN0YW50ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfTtcblxuICBfLm5vb3AgPSBmdW5jdGlvbigpe307XG5cbiAgXy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuXG4gIC8vIEdlbmVyYXRlcyBhIGZ1bmN0aW9uIGZvciBhIGdpdmVuIG9iamVjdCB0aGF0IHJldHVybnMgYSBnaXZlbiBwcm9wZXJ0eS5cbiAgXy5wcm9wZXJ0eU9mID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PSBudWxsID8gZnVuY3Rpb24oKXt9IDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgcHJlZGljYXRlIGZvciBjaGVja2luZyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2ZcbiAgLy8gYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ubWF0Y2hlciA9IF8ubWF0Y2hlcyA9IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgYXR0cnMgPSBfLmV4dGVuZE93bih7fSwgYXR0cnMpO1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmlzTWF0Y2gob2JqLCBhdHRycyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgXy50aW1lcyA9IGZ1bmN0aW9uKG4sIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtID0gQXJyYXkoTWF0aC5tYXgoMCwgbikpO1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0ZWUoaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIEEgKHBvc3NpYmx5IGZhc3Rlcikgd2F5IHRvIGdldCB0aGUgY3VycmVudCB0aW1lc3RhbXAgYXMgYW4gaW50ZWdlci5cbiAgXy5ub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH07XG5cbiAgIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlc2NhcGVNYXAgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgICAnYCc6ICcmI3g2MDsnXG4gIH07XG4gIHZhciB1bmVzY2FwZU1hcCA9IF8uaW52ZXJ0KGVzY2FwZU1hcCk7XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICB2YXIgY3JlYXRlRXNjYXBlciA9IGZ1bmN0aW9uKG1hcCkge1xuICAgIHZhciBlc2NhcGVyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXBbbWF0Y2hdO1xuICAgIH07XG4gICAgLy8gUmVnZXhlcyBmb3IgaWRlbnRpZnlpbmcgYSBrZXkgdGhhdCBuZWVkcyB0byBiZSBlc2NhcGVkXG4gICAgdmFyIHNvdXJjZSA9ICcoPzonICsgXy5rZXlzKG1hcCkuam9pbignfCcpICsgJyknO1xuICAgIHZhciB0ZXN0UmVnZXhwID0gUmVnRXhwKHNvdXJjZSk7XG4gICAgdmFyIHJlcGxhY2VSZWdleHAgPSBSZWdFeHAoc291cmNlLCAnZycpO1xuICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIHN0cmluZyA9IHN0cmluZyA9PSBudWxsID8gJycgOiAnJyArIHN0cmluZztcbiAgICAgIHJldHVybiB0ZXN0UmVnZXhwLnRlc3Qoc3RyaW5nKSA/IHN0cmluZy5yZXBsYWNlKHJlcGxhY2VSZWdleHAsIGVzY2FwZXIpIDogc3RyaW5nO1xuICAgIH07XG4gIH07XG4gIF8uZXNjYXBlID0gY3JlYXRlRXNjYXBlcihlc2NhcGVNYXApO1xuICBfLnVuZXNjYXBlID0gY3JlYXRlRXNjYXBlcih1bmVzY2FwZU1hcCk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBgcHJvcGVydHlgIGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQgd2l0aCB0aGVcbiAgLy8gYG9iamVjdGAgYXMgY29udGV4dDsgb3RoZXJ3aXNlLCByZXR1cm4gaXQuXG4gIF8ucmVzdWx0ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSwgZmFsbGJhY2spIHtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHZvaWQgMCA6IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHZhbHVlID0gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaW50ZWdlciBpZCAodW5pcXVlIHdpdGhpbiB0aGUgZW50aXJlIGNsaWVudCBzZXNzaW9uKS5cbiAgLy8gVXNlZnVsIGZvciB0ZW1wb3JhcnkgRE9NIGlkcy5cbiAgdmFyIGlkQ291bnRlciA9IDA7XG4gIF8udW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGUgICAgICA6IC88JS0oW1xcc1xcU10rPyklPi9nXG4gIH07XG5cbiAgLy8gV2hlbiBjdXN0b21pemluZyBgdGVtcGxhdGVTZXR0aW5nc2AsIGlmIHlvdSBkb24ndCB3YW50IHRvIGRlZmluZSBhblxuICAvLyBpbnRlcnBvbGF0aW9uLCBldmFsdWF0aW9uIG9yIGVzY2FwaW5nIHJlZ2V4LCB3ZSBuZWVkIG9uZSB0aGF0IGlzXG4gIC8vIGd1YXJhbnRlZWQgbm90IHRvIG1hdGNoLlxuICB2YXIgbm9NYXRjaCA9IC8oLileLztcblxuICAvLyBDZXJ0YWluIGNoYXJhY3RlcnMgbmVlZCB0byBiZSBlc2NhcGVkIHNvIHRoYXQgdGhleSBjYW4gYmUgcHV0IGludG8gYVxuICAvLyBzdHJpbmcgbGl0ZXJhbC5cbiAgdmFyIGVzY2FwZXMgPSB7XG4gICAgXCInXCI6ICAgICAgXCInXCIsXG4gICAgJ1xcXFwnOiAgICAgJ1xcXFwnLFxuICAgICdcXHInOiAgICAgJ3InLFxuICAgICdcXG4nOiAgICAgJ24nLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlciA9IC9cXFxcfCd8XFxyfFxcbnxcXHUyMDI4fFxcdTIwMjkvZztcblxuICB2YXIgZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdO1xuICB9O1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIC8vIE5COiBgb2xkU2V0dGluZ3NgIG9ubHkgZXhpc3RzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgXy50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRleHQsIHNldHRpbmdzLCBvbGRTZXR0aW5ncykge1xuICAgIGlmICghc2V0dGluZ3MgJiYgb2xkU2V0dGluZ3MpIHNldHRpbmdzID0gb2xkU2V0dGluZ3M7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gUmVnRXhwKFtcbiAgICAgIChzZXR0aW5ncy5lc2NhcGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmludGVycG9sYXRlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5ldmFsdWF0ZSB8fCBub01hdGNoKS5zb3VyY2VcbiAgICBdLmpvaW4oJ3wnKSArICd8JCcsICdnJyk7XG5cbiAgICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZSBzb3VyY2UsIGVzY2FwaW5nIHN0cmluZyBsaXRlcmFscyBhcHByb3ByaWF0ZWx5LlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNvdXJjZSA9IFwiX19wKz0nXCI7XG4gICAgdGV4dC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGUsIGludGVycG9sYXRlLCBldmFsdWF0ZSwgb2Zmc2V0KSB7XG4gICAgICBzb3VyY2UgKz0gdGV4dC5zbGljZShpbmRleCwgb2Zmc2V0KS5yZXBsYWNlKGVzY2FwZXIsIGVzY2FwZUNoYXIpO1xuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkb2JlIFZNcyBuZWVkIHRoZSBtYXRjaCByZXR1cm5lZCB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IG9mZmVzdC5cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArICdyZXR1cm4gX19wO1xcbic7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIHJlbmRlciA9IG5ldyBGdW5jdGlvbihzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJywgJ18nLCBzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gcmVuZGVyLmNhbGwodGhpcywgZGF0YSwgXyk7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgdGhlIGNvbXBpbGVkIHNvdXJjZSBhcyBhIGNvbnZlbmllbmNlIGZvciBwcmVjb21waWxhdGlvbi5cbiAgICB2YXIgYXJndW1lbnQgPSBzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJztcbiAgICB0ZW1wbGF0ZS5zb3VyY2UgPSAnZnVuY3Rpb24oJyArIGFyZ3VtZW50ICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24uIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5jaGFpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpbnN0YW5jZSA9IF8ob2JqKTtcbiAgICBpbnN0YW5jZS5fY2hhaW4gPSB0cnVlO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfTtcblxuICAvLyBPT1BcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElmIFVuZGVyc2NvcmUgaXMgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGl0IHJldHVybnMgYSB3cmFwcGVkIG9iamVjdCB0aGF0XG4gIC8vIGNhbiBiZSB1c2VkIE9PLXN0eWxlLiBUaGlzIHdyYXBwZXIgaG9sZHMgYWx0ZXJlZCB2ZXJzaW9ucyBvZiBhbGwgdGhlXG4gIC8vIHVuZGVyc2NvcmUgZnVuY3Rpb25zLiBXcmFwcGVkIG9iamVjdHMgbWF5IGJlIGNoYWluZWQuXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24oaW5zdGFuY2UsIG9iaikge1xuICAgIHJldHVybiBpbnN0YW5jZS5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuICBfLm1peGluKF8pO1xuXG4gIC8vIEFkZCBhbGwgbXV0YXRvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PT0gJ3NoaWZ0JyB8fCBuYW1lID09PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgXy5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBQcm92aWRlIHVud3JhcHBpbmcgcHJveHkgZm9yIHNvbWUgbWV0aG9kcyB1c2VkIGluIGVuZ2luZSBvcGVyYXRpb25zXG4gIC8vIHN1Y2ggYXMgYXJpdGhtZXRpYyBhbmQgSlNPTiBzdHJpbmdpZmljYXRpb24uXG4gIF8ucHJvdG90eXBlLnZhbHVlT2YgPSBfLnByb3RvdHlwZS50b0pTT04gPSBfLnByb3RvdHlwZS52YWx1ZTtcblxuICBfLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnJyArIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gQU1EIHJlZ2lzdHJhdGlvbiBoYXBwZW5zIGF0IHRoZSBlbmQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBBTUQgbG9hZGVyc1xuICAvLyB0aGF0IG1heSBub3QgZW5mb3JjZSBuZXh0LXR1cm4gc2VtYW50aWNzIG9uIG1vZHVsZXMuIEV2ZW4gdGhvdWdoIGdlbmVyYWxcbiAgLy8gcHJhY3RpY2UgZm9yIEFNRCByZWdpc3RyYXRpb24gaXMgdG8gYmUgYW5vbnltb3VzLCB1bmRlcnNjb3JlIHJlZ2lzdGVyc1xuICAvLyBhcyBhIG5hbWVkIG1vZHVsZSBiZWNhdXNlLCBsaWtlIGpRdWVyeSwgaXQgaXMgYSBiYXNlIGxpYnJhcnkgdGhhdCBpc1xuICAvLyBwb3B1bGFyIGVub3VnaCB0byBiZSBidW5kbGVkIGluIGEgdGhpcmQgcGFydHkgbGliLCBidXQgbm90IGJlIHBhcnQgb2ZcbiAgLy8gYW4gQU1EIGxvYWQgcmVxdWVzdC4gVGhvc2UgY2FzZXMgY291bGQgZ2VuZXJhdGUgYW4gZXJyb3Igd2hlbiBhblxuICAvLyBhbm9ueW1vdXMgZGVmaW5lKCkgaXMgY2FsbGVkIG91dHNpZGUgb2YgYSBsb2FkZXIgcmVxdWVzdC5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgndW5kZXJzY29yZScsIFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfO1xuICAgIH0pO1xuICB9XG59LmNhbGwodGhpcykpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgYWNjb3JkaW9uIGZyb20gJy4vbW9kdWxlcy9hY2NvcmRpb24uanMnO1xuaW1wb3J0IHNpbXBsZUFjY29yZGlvbiBmcm9tICcuL21vZHVsZXMvc2ltcGxlQWNjb3JkaW9uLmpzJztcbmltcG9ydCBvZmZjYW52YXMgZnJvbSAnLi9tb2R1bGVzL29mZmNhbnZhcy5qcyc7XG5pbXBvcnQgb3ZlcmxheSBmcm9tICcuL21vZHVsZXMvb3ZlcmxheS5qcyc7XG5pbXBvcnQgc3RpY2tOYXYgZnJvbSAnLi9tb2R1bGVzL3N0aWNrTmF2LmpzJztcbmltcG9ydCBzZWN0aW9uSGlnaGxpZ2h0ZXIgZnJvbSAnLi9tb2R1bGVzL3NlY3Rpb25IaWdobGlnaHRlci5qcyc7XG5pbXBvcnQgc3RhdGljQ29sdW1uIGZyb20gJy4vbW9kdWxlcy9zdGF0aWNDb2x1bW4uanMnO1xuaW1wb3J0IGFsZXJ0IGZyb20gJy4vbW9kdWxlcy9hbGVydC5qcyc7XG4vLyBpbXBvcnQgYnNkdG9vbHNTaWdudXAgZnJvbSAnLi9tb2R1bGVzL2JzZHRvb2xzLXNpZ251cC5qcyc7XG5pbXBvcnQgZ3VueVNpZ251cCBmcm9tICcuL21vZHVsZXMvbmV3c2xldHRlci1zaWdudXAuanMnO1xuaW1wb3J0IGZvcm1FZmZlY3RzIGZyb20gJy4vbW9kdWxlcy9mb3JtRWZmZWN0cy5qcyc7XG5pbXBvcnQgZmFjZXRzIGZyb20gJy4vbW9kdWxlcy9mYWNldHMuanMnO1xuaW1wb3J0IG93bFNldHRpbmdzIGZyb20gJy4vbW9kdWxlcy9vd2xTZXR0aW5ncy5qcyc7XG5pbXBvcnQgaU9TN0hhY2sgZnJvbSAnLi9tb2R1bGVzL2lPUzdIYWNrLmpzJztcbmltcG9ydCBTaGFyZUZvcm0gZnJvbSAnLi9tb2R1bGVzL3NoYXJlLWZvcm0uanMnO1xuaW1wb3J0IGNhcHRjaGFSZXNpemUgZnJvbSAnLi9tb2R1bGVzL2NhcHRjaGFSZXNpemUuanMnO1xuaW1wb3J0IHJvdGF0aW5nVGV4dEFuaW1hdGlvbiBmcm9tICcuL21vZHVsZXMvcm90YXRpbmdUZXh0QW5pbWF0aW9uLmpzJztcbmltcG9ydCBTZWFyY2ggZnJvbSAnLi9tb2R1bGVzL3NlYXJjaC5qcyc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuaW1wb3J0IHRvZ2dsZU9wZW4gZnJvbSAnLi9tb2R1bGVzL3RvZ2dsZU9wZW4uanMnO1xuaW1wb3J0IHRvZ2dsZU1lbnUgZnJvbSAnLi9tb2R1bGVzL3RvZ2dsZU1lbnUuanMnO1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG5mdW5jdGlvbiByZWFkeShmbikge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfSBlbHNlIHtcbiAgICBmbigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHRvZ2dsZU9wZW4oJ2lzLW9wZW4nKTtcbiAgYWxlcnQoJ2lzLW9wZW4nKTtcbiAgb2ZmY2FudmFzKCk7XG4gIGFjY29yZGlvbigpO1xuICBzaW1wbGVBY2NvcmRpb24oKTtcbiAgb3ZlcmxheSgpO1xuXG4gIC8vIEZhY2V0V1AgcGFnZXNcbiAgZmFjZXRzKCk7XG5cbiAgLy8gSG9tZXBhZ2VcbiAgc3RhdGljQ29sdW1uKCk7XG4gIHN0aWNrTmF2KCk7XG4gIC8vIGJzZHRvb2xzU2lnbnVwKCk7XG4gIGd1bnlTaWdudXAoKTtcbiAgZm9ybUVmZmVjdHMoKTtcbiAgb3dsU2V0dGluZ3MoKTtcbiAgaU9TN0hhY2soKTtcbiAgY2FwdGNoYVJlc2l6ZSgpO1xuICByb3RhdGluZ1RleHRBbmltYXRpb24oKTtcbiAgc2VjdGlvbkhpZ2hsaWdodGVyKCk7XG5cbiAgLy8gU2VhcmNoXG4gIG5ldyBTZWFyY2goKS5pbml0KCk7XG59XG5cbnJlYWR5KGluaXQpO1xuXG4vLyBNYWtlIGNlcnRhaW4gZnVuY3Rpb25zIGF2YWlsYWJsZSBnbG9iYWxseVxud2luZG93LmFjY29yZGlvbiA9IGFjY29yZGlvbjtcblxuKGZ1bmN0aW9uKHdpbmRvdywgJCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8vIEluaXRpYWxpemUgc2hhcmUgYnkgZW1haWwvc21zIGZvcm1zLlxuICAkKGAuJHtTaGFyZUZvcm0uQ3NzQ2xhc3MuRk9STX1gKS5lYWNoKChpLCBlbCkgPT4ge1xuICAgIGNvbnN0IHNoYXJlRm9ybSA9IG5ldyBTaGFyZUZvcm0oZWwpO1xuICAgIHNoYXJlRm9ybS5pbml0KCk7XG4gIH0pO1xufSkod2luZG93LCBqUXVlcnkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21haW4uanMiLCIvKipcbiAqIEFjY29yZGlvbiBtb2R1bGVcbiAqIEBtb2R1bGUgbW9kdWxlcy9hY2NvcmRpb25cbiAqL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICAvKipcbiAgICogQ29udmVydCBhY2NvcmRpb24gaGVhZGluZyB0byBhIGJ1dHRvblxuICAgKiBAcGFyYW0ge29iamVjdH0gJGhlYWRlckVsZW0gLSBqUXVlcnkgb2JqZWN0IGNvbnRhaW5pbmcgb3JpZ2luYWwgaGVhZGVyXG4gICAqIEByZXR1cm4ge29iamVjdH0gTmV3IGhlYWRpbmcgZWxlbWVudFxuICAgKi9cbiAgZnVuY3Rpb24gY29udmVydEhlYWRlclRvQnV0dG9uKCRoZWFkZXJFbGVtKSB7XG4gICAgaWYgKCRoZWFkZXJFbGVtLmdldCgwKS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYnV0dG9uJykge1xuICAgICAgcmV0dXJuICRoZWFkZXJFbGVtO1xuICAgIH1cbiAgICBjb25zdCBoZWFkZXJFbGVtID0gJGhlYWRlckVsZW0uZ2V0KDApO1xuICAgIGNvbnN0IG5ld0hlYWRlckVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBmb3JFYWNoKGhlYWRlckVsZW0uYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cikge1xuICAgICAgbmV3SGVhZGVyRWxlbS5zZXRBdHRyaWJ1dGUoYXR0ci5ub2RlTmFtZSwgYXR0ci5ub2RlVmFsdWUpO1xuICAgIH0pO1xuICAgIG5ld0hlYWRlckVsZW0uc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpO1xuICAgIGNvbnN0ICRuZXdIZWFkZXJFbGVtID0gJChuZXdIZWFkZXJFbGVtKTtcbiAgICAkbmV3SGVhZGVyRWxlbS5odG1sKCRoZWFkZXJFbGVtLmh0bWwoKSk7XG4gICAgJG5ld0hlYWRlckVsZW0uYXBwZW5kKCc8c3ZnIGNsYXNzPVwiby1hY2NvcmRpb25fX2NhcmV0IGljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1jYXJldC1kb3duXCI+PC91c2U+PC9zdmc+Jyk7XG4gICAgcmV0dXJuICRuZXdIZWFkZXJFbGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB2aXNpYmlsaXR5IGF0dHJpYnV0ZXMgZm9yIGhlYWRlclxuICAgKiBAcGFyYW0ge29iamVjdH0gJGhlYWRlckVsZW0gLSBUaGUgYWNjb3JkaW9uIGhlYWRlciBqUXVlcnkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWFrZVZpc2libGUgLSBXaGV0aGVyIHRoZSBoZWFkZXIncyBjb250ZW50IHNob3VsZCBiZSB2aXNpYmxlXG4gICAqL1xuICBmdW5jdGlvbiB0b2dnbGVIZWFkZXIoJGhlYWRlckVsZW0sIG1ha2VWaXNpYmxlKSB7XG4gICAgJGhlYWRlckVsZW0uYXR0cignYXJpYS1leHBhbmRlZCcsIG1ha2VWaXNpYmxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYXR0cmlidXRlcywgY2xhc3NlcywgYW5kIGV2ZW50IGJpbmRpbmcgdG8gYWNjb3JkaW9uIGhlYWRlclxuICAgKiBAcGFyYW0ge29iamVjdH0gJGhlYWRlckVsZW0gLSBUaGUgYWNjb3JkaW9uIGhlYWRlciBqUXVlcnkgb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkcmVsYXRlZFBhbmVsIC0gVGhlIHBhbmVsIHRoZSBhY2NvcmRpb24gaGVhZGVyIGNvbnRyb2xzXG4gICAqL1xuICBmdW5jdGlvbiBpbml0aWFsaXplSGVhZGVyKCRoZWFkZXJFbGVtLCAkcmVsYXRlZFBhbmVsKSB7XG4gICAgJGhlYWRlckVsZW0uYXR0cih7XG4gICAgICAnYXJpYS1zZWxlY3RlZCc6IGZhbHNlLFxuICAgICAgJ2FyaWEtY29udHJvbHMnOiAkcmVsYXRlZFBhbmVsLmdldCgwKS5pZCxcbiAgICAgICdhcmlhLWV4cGFuZGVkJzogZmFsc2UsXG4gICAgICAncm9sZSc6ICdoZWFkaW5nJ1xuICAgIH0pLmFkZENsYXNzKCdvLWFjY29yZGlvbl9faGVhZGVyJyk7XG5cbiAgICAkaGVhZGVyRWxlbS5vbignY2xpY2suYWNjb3JkaW9uJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkaGVhZGVyRWxlbS50cmlnZ2VyKCdjaGFuZ2VTdGF0ZScpO1xuICAgIH0pO1xuXG4gICAgJGhlYWRlckVsZW0ub24oJ21vdXNlbGVhdmUuYWNjb3JkaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAkaGVhZGVyRWxlbS5ibHVyKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIHZpc2liaWxpdHkgYXR0cmlidXRlcyBmb3IgcGFuZWxcbiAgICogQHBhcmFtIHtvYmplY3R9ICRwYW5lbEVsZW0gLSBUaGUgYWNjb3JkaW9uIHBhbmVsIGpRdWVyeSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBtYWtlVmlzaWJsZSAtIFdoZXRoZXIgdGhlIHBhbmVsIHNob3VsZCBiZSB2aXNpYmxlXG4gICAqL1xuICBmdW5jdGlvbiB0b2dnbGVQYW5lbCgkcGFuZWxFbGVtLCBtYWtlVmlzaWJsZSkge1xuICAgICRwYW5lbEVsZW0uYXR0cignYXJpYS1oaWRkZW4nLCAhbWFrZVZpc2libGUpO1xuICAgIGlmIChtYWtlVmlzaWJsZSkge1xuICAgICAgJHBhbmVsRWxlbS5jc3MoJ2hlaWdodCcsICRwYW5lbEVsZW0uZGF0YSgnaGVpZ2h0JykgKyAncHgnKTtcbiAgICAgICRwYW5lbEVsZW0uZmluZCgnYSwgYnV0dG9uLCBbdGFiaW5kZXhdJykuYXR0cigndGFiaW5kZXgnLCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHBhbmVsRWxlbS5jc3MoJ2hlaWdodCcsICcnKTtcbiAgICAgICRwYW5lbEVsZW0uZmluZCgnYSwgYnV0dG9uLCBbdGFiaW5kZXhdJykuYXR0cigndGFiaW5kZXgnLCAtMSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBDU1MgY2xhc3NlcyB0byBhY2NvcmRpb24gcGFuZWxzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkcGFuZWxFbGVtIC0gVGhlIGFjY29yZGlvbiBwYW5lbCBqUXVlcnkgb2JqZWN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYWJlbGxlZGJ5IC0gSUQgb2YgZWxlbWVudCAoYWNjb3JkaW9uIGhlYWRlcikgdGhhdCBsYWJlbHMgcGFuZWxcbiAgICovXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVQYW5lbCgkcGFuZWxFbGVtLCBsYWJlbGxlZGJ5KSB7XG4gICAgJHBhbmVsRWxlbS5hZGRDbGFzcygnby1hY2NvcmRpb25fX2NvbnRlbnQnKTtcbiAgICBjYWxjdWxhdGVQYW5lbEhlaWdodCgkcGFuZWxFbGVtKTtcbiAgICAkcGFuZWxFbGVtLmF0dHIoe1xuICAgICAgJ2FyaWEtaGlkZGVuJzogdHJ1ZSxcbiAgICAgICdyb2xlJzogJ3JlZ2lvbicsXG4gICAgICAnYXJpYS1sYWJlbGxlZGJ5JzogbGFiZWxsZWRieVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhY2NvcmRpb24gcGFuZWwgaGVpZ2h0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkcGFuZWxFbGVtIC0gVGhlIGFjY29yZGlvbiBwYW5lbCBqUXVlcnkgb2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiBjYWxjdWxhdGVQYW5lbEhlaWdodCgkcGFuZWxFbGVtKSB7XG4gICAgJHBhbmVsRWxlbS5kYXRhKCdoZWlnaHQnLCAkcGFuZWxFbGVtLmhlaWdodCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgc3RhdGUgZm9yIGFjY29yZGlvbiBjaGlsZHJlblxuICAgKiBAcGFyYW0ge29iamVjdH0gJGl0ZW0gLSBUaGUgYWNjb3JkaW9uIGl0ZW0galF1ZXJ5IG9iamVjdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ha2VWaXNpYmxlIC0gV2hldGhlciB0byBtYWtlIHRoZSBhY2NvcmRpb24gY29udGVudCB2aXNpYmxlXG4gICAqL1xuICBmdW5jdGlvbiB0b2dnbGVBY2NvcmRpb25JdGVtKCRpdGVtLCBtYWtlVmlzaWJsZSkge1xuICAgIGlmIChtYWtlVmlzaWJsZSkge1xuICAgICAgJGl0ZW0uYWRkQ2xhc3MoJ2lzLWV4cGFuZGVkJyk7XG4gICAgICAkaXRlbS5yZW1vdmVDbGFzcygnaXMtY29sbGFwc2VkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRpdGVtLnJlbW92ZUNsYXNzKCdpcy1leHBhbmRlZCcpO1xuICAgICAgJGl0ZW0uYWRkQ2xhc3MoJ2lzLWNvbGxhcHNlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgQ1NTIGNsYXNzZXMgdG8gYWNjb3JkaW9uIGNoaWxkcmVuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkaXRlbSAtIFRoZSBhY2NvcmRpb24gY2hpbGQgalF1ZXJ5IG9iamVjdFxuICAgKi9cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZUFjY29yZGlvbkl0ZW0oJGl0ZW0pIHtcbiAgICBjb25zdCAkYWNjb3JkaW9uQ29udGVudCA9ICRpdGVtLmZpbmQoJy5qcy1hY2NvcmRpb25fX2NvbnRlbnQnKTtcbiAgICBjb25zdCAkYWNjb3JkaW9uSW5pdGlhbEhlYWRlciA9ICRpdGVtLmZpbmQoJy5qcy1hY2NvcmRpb25fX2hlYWRlcicpO1xuICAgIC8vIENsZWFyIGFueSBwcmV2aW91c2x5IGJvdW5kIGV2ZW50c1xuICAgICRpdGVtLm9mZigndG9nZ2xlLmFjY29yZGlvbicpO1xuICAgIC8vIENsZWFyIGFueSBleGlzdGluZyBzdGF0ZSBjbGFzc2VzXG4gICAgJGl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWV4cGFuZGVkIGlzLWNvbGxhcHNlZCcpO1xuICAgIGlmICgkYWNjb3JkaW9uQ29udGVudC5sZW5ndGggJiYgJGFjY29yZGlvbkluaXRpYWxIZWFkZXIubGVuZ3RoKSB7XG4gICAgICAkaXRlbS5hZGRDbGFzcygnby1hY2NvcmRpb25fX2l0ZW0nKTtcbiAgICAgIGxldCAkYWNjb3JkaW9uSGVhZGVyO1xuICAgICAgaWYgKCRhY2NvcmRpb25Jbml0aWFsSGVhZGVyLmdldCgwKS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdidXR0b24nKSB7XG4gICAgICAgICRhY2NvcmRpb25IZWFkZXIgPSAkYWNjb3JkaW9uSW5pdGlhbEhlYWRlcjtcbiAgICAgICAgY2FsY3VsYXRlUGFuZWxIZWlnaHQoJGFjY29yZGlvbkNvbnRlbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGFjY29yZGlvbkhlYWRlciA9IGNvbnZlcnRIZWFkZXJUb0J1dHRvbigkYWNjb3JkaW9uSW5pdGlhbEhlYWRlcik7XG4gICAgICAgICRhY2NvcmRpb25Jbml0aWFsSGVhZGVyLnJlcGxhY2VXaXRoKCRhY2NvcmRpb25IZWFkZXIpO1xuICAgICAgICBpbml0aWFsaXplSGVhZGVyKCRhY2NvcmRpb25IZWFkZXIsICRhY2NvcmRpb25Db250ZW50KTtcbiAgICAgICAgaW5pdGlhbGl6ZVBhbmVsKCRhY2NvcmRpb25Db250ZW50LCAkYWNjb3JkaW9uSGVhZGVyLmdldCgwKS5pZCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ3VzdG9tIGV2ZW50IGhhbmRsZXIgdG8gdG9nZ2xlIHRoZSBhY2NvcmRpb24gaXRlbSBvcGVuL2Nsb3NlZFxuICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ha2VWaXNpYmxlIC0gV2hldGhlciB0byBtYWtlIHRoZSBhY2NvcmRpb24gY29udGVudCB2aXNpYmxlXG4gICAgICAgKi9cbiAgICAgICRpdGVtLm9uKCd0b2dnbGUuYWNjb3JkaW9uJywgZnVuY3Rpb24oZXZlbnQsIG1ha2VWaXNpYmxlKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRvZ2dsZUFjY29yZGlvbkl0ZW0oJGl0ZW0sIG1ha2VWaXNpYmxlKTtcbiAgICAgICAgdG9nZ2xlSGVhZGVyKCRhY2NvcmRpb25IZWFkZXIsIG1ha2VWaXNpYmxlKTtcbiAgICAgICAgdG9nZ2xlUGFuZWwoJGFjY29yZGlvbkNvbnRlbnQsIG1ha2VWaXNpYmxlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDb2xsYXBzZSBwYW5lbHMgaW5pdGlhbGx5XG4gICAgICAkaXRlbS50cmlnZ2VyKCd0b2dnbGUuYWNjb3JkaW9uJywgW2ZhbHNlXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgQVJJQSBhdHRyaWJ1dGVzIGFuZCBDU1MgY2xhc3NlcyB0byB0aGUgcm9vdCBhY2NvcmRpb24gZWxlbWVudHMuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkYWNjb3JkaW9uRWxlbSAtIFRoZSBqUXVlcnkgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGUgYWNjb3JkaW9uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gbXVsdGlTZWxlY3RhYmxlIC0gV2hldGhlciBtdWx0aXBsZSBhY2NvcmRpb24gZHJhd2VycyBjYW4gYmUgb3BlbiBhdCB0aGUgc2FtZSB0aW1lXG4gICAqL1xuICBmdW5jdGlvbiBpbml0aWFsaXplKCRhY2NvcmRpb25FbGVtLCBtdWx0aVNlbGVjdGFibGUpIHtcbiAgICAkYWNjb3JkaW9uRWxlbS5hdHRyKHtcbiAgICAgICdyb2xlJzogJ3ByZXNlbnRhdGlvbicsXG4gICAgICAnYXJpYS1tdWx0aXNlbGVjdGFibGUnOiBtdWx0aVNlbGVjdGFibGVcbiAgICB9KS5hZGRDbGFzcygnby1hY2NvcmRpb24nKTtcbiAgICAkYWNjb3JkaW9uRWxlbS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBpbml0aWFsaXplQWNjb3JkaW9uSXRlbSgkKHRoaXMpKTtcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgY2hhbmdlU3RhdGUgZXZlbnRzIG9uIGFjY29yZGlvbiBoZWFkZXJzLlxuICAgICAqIENsb3NlIHRoZSBvcGVuIGFjY29yZGlvbiBpdGVtIGFuZCBvcGVuIHRoZSBuZXcgb25lLlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgKi9cbiAgICAkYWNjb3JkaW9uRWxlbS5vbignY2hhbmdlU3RhdGUuYWNjb3JkaW9uJywgJy5qcy1hY2NvcmRpb25fX2hlYWRlcicsICQucHJveHkoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGNvbnN0ICRuZXdJdGVtID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5vLWFjY29yZGlvbl9faXRlbScpO1xuICAgICAgaWYgKG11bHRpU2VsZWN0YWJsZSkge1xuICAgICAgICAkbmV3SXRlbS50cmlnZ2VyKCd0b2dnbGUuYWNjb3JkaW9uJywgWyEkbmV3SXRlbS5oYXNDbGFzcygnaXMtZXhwYW5kZWQnKV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgJG9wZW5JdGVtID0gJGFjY29yZGlvbkVsZW0uZmluZCgnLmlzLWV4cGFuZGVkJyk7XG4gICAgICAgICRvcGVuSXRlbS50cmlnZ2VyKCd0b2dnbGUuYWNjb3JkaW9uJywgW2ZhbHNlXSk7XG4gICAgICAgIGlmICgkb3Blbkl0ZW0uZ2V0KDApICE9PSAkbmV3SXRlbS5nZXQoMCkpIHtcbiAgICAgICAgICAkbmV3SXRlbS50cmlnZ2VyKCd0b2dnbGUuYWNjb3JkaW9uJywgW3RydWVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWluaXRpYWxpemUgYW4gYWNjb3JkaW9uIGFmdGVyIGl0cyBjb250ZW50cyB3ZXJlIGR5bmFtaWNhbGx5IHVwZGF0ZWRcbiAgICogQHBhcmFtIHtvYmplY3R9ICRhY2NvcmRpb25FbGVtIC0gVGhlIGpRdWVyeSBvYmplY3QgY29udGFpbmluZyB0aGUgcm9vdCBlbGVtZW50IG9mIHRoZSBhY2NvcmRpb25cbiAgICovXG4gIGZ1bmN0aW9uIHJlSW5pdGlhbGl6ZSgkYWNjb3JkaW9uRWxlbSkge1xuICAgIGlmICgkYWNjb3JkaW9uRWxlbS5oYXNDbGFzcygnby1hY2NvcmRpb24nKSkge1xuICAgICAgJGFjY29yZGlvbkVsZW0uY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBpbml0aWFsaXplQWNjb3JkaW9uSXRlbSgkKHRoaXMpKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtdWx0aVNlbGVjdGFibGUgPSAkYWNjb3JkaW9uRWxlbS5kYXRhKCdtdWx0aXNlbGVjdGFibGUnKSB8fCBmYWxzZTtcbiAgICAgIGluaXRpYWxpemUoJGFjY29yZGlvbkVsZW0sIG11bHRpU2VsZWN0YWJsZSk7XG4gICAgfVxuICB9XG4gIHdpbmRvdy5yZUluaXRpYWxpemVBY2NvcmRpb24gPSByZUluaXRpYWxpemU7XG5cbiAgY29uc3QgJGFjY29yZGlvbnMgPSAkKCcuanMtYWNjb3JkaW9uJykubm90KCcuby1hY2NvcmRpb24nKTtcbiAgaWYgKCRhY2NvcmRpb25zLmxlbmd0aCkge1xuICAgICRhY2NvcmRpb25zLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtdWx0aVNlbGVjdGFibGUgPSAkKHRoaXMpLmRhdGEoJ211bHRpc2VsZWN0YWJsZScpIHx8IGZhbHNlO1xuICAgICAgaW5pdGlhbGl6ZSgkKHRoaXMpLCBtdWx0aVNlbGVjdGFibGUpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEhhbmRsZSBmb250c0FjdGl2ZSBldmVudHMgZmlyZWQgb25jZSBUeXBla2l0IHJlcG9ydHMgdGhhdCB0aGUgZm9udHMgYXJlIGFjdGl2ZS5cbiAgICAgICAqIEBzZWUgYmFzZS50d2lnIGZvciB0aGUgVHlwZWtpdC5sb2FkKCkgZnVuY3Rpb25cbiAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICovXG4gICAgICAkKHRoaXMpLm9uKCdmb250c0FjdGl2ZScsICQucHJveHkoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlSW5pdGlhbGl6ZSgkKHRoaXMpKTtcbiAgICAgIH0sIHRoaXMpKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvYWNjb3JkaW9uLmpzIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlFYWNoLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vX2Jhc2VGb3JPd24nKSxcbiAgICBjcmVhdGVCYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VFYWNoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yRWFjaGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbnZhciBiYXNlRWFjaCA9IGNyZWF0ZUJhc2VFYWNoKGJhc2VGb3JPd24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VFYWNoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRWFjaC5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VGb3IgPSByZXF1aXJlKCcuL19iYXNlRm9yJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvck93bmAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvck93bjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvck93bi5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGNyZWF0ZUJhc2VGb3IgPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRm9yJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzIG92ZXIgYG9iamVjdGBcbiAqIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIHByb3BlcnR5LlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gva2V5cy5qc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VUaW1lcyA9IHJlcXVpcmUoJy4vX2Jhc2VUaW1lcycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUxpa2VLZXlzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUaW1lcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9fYmFzZUlzQXJndW1lbnRzJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcmd1bWVudHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanNcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzQXJndW1lbnRzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNBcmd1bWVudHMuanNcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJhd1RhZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qc1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanNcbi8vIG1vZHVsZSBpZCA9IDMxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlSXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fYmFzZUlzVHlwZWRBcnJheScpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzVHlwZWRBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gMzNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanNcbi8vIG1vZHVsZSBpZCA9IDM0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5hcnk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qc1xuLy8gbW9kdWxlIGlkID0gMzVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlVXRpbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanNcbi8vIG1vZHVsZSBpZCA9IDM2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5cy5qc1xuLy8gbW9kdWxlIGlkID0gMzdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUHJvdG90eXBlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc1Byb3RvdHlwZS5qc1xuLy8gbW9kdWxlIGlkID0gMzhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSAzOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzXG4vLyBtb2R1bGUgaWQgPSA0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanNcbi8vIG1vZHVsZSBpZCA9IDQxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYGJhc2VFYWNoYCBvciBgYmFzZUVhY2hSaWdodGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRWFjaChlYWNoRnVuYywgZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIGlmIChjb2xsZWN0aW9uID09IG51bGwpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH1cbiAgICBpZiAoIWlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gZWFjaEZ1bmMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRWFjaDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanNcbi8vIG1vZHVsZSBpZCA9IDQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGBpZGVudGl0eWAgaWYgaXQncyBub3QgYSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBjYXN0IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYXN0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nID8gdmFsdWUgOiBpZGVudGl0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0RnVuY3Rpb247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RGdW5jdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gNDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qc1xuLy8gbW9kdWxlIGlkID0gNDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4qIFNpbXBsZSBhY2NvcmRpb24gbW9kdWxlXG4qIEBtb2R1bGUgbW9kdWxlcy9zaW1wbGVBY2NvcmRpb25cbiogQHNlZSBodHRwczovL3BlcmlzaGFibGVwcmVzcy5jb20vanF1ZXJ5LWFjY29yZGlvbi1tZW51LXR1dG9yaWFsL1xuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICAvLyQoJy5qcy1hY2NvcmRpb24gPiB1bCA+IGxpOmhhcyhvbCknKS5hZGRDbGFzcyhcImhhcy1zdWJcIik7XG4gICQoJy5qcy1zLWFjY29yZGlvbiA+IGxpID4gaDMuanMtcy1hY2NvcmRpb25fX2hlYWRlcicpLmFwcGVuZCgnPHN2ZyBjbGFzcz1cIm8tYWNjb3JkaW9uX19jYXJldCBpY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tY2FyZXQtZG93blwiPjwvdXNlPjwvc3ZnPicpO1xuXG4gICQoJy5qcy1zLWFjY29yZGlvbiA+IGxpID4gaDMuanMtcy1hY2NvcmRpb25fX2hlYWRlcicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIHZhciBjaGVja0VsZW1lbnQgPSAkKHRoaXMpLm5leHQoKTtcblxuICAgICQoJy5qcy1zLWFjY29yZGlvbiBsaScpLnJlbW92ZUNsYXNzKCdpcy1leHBhbmRlZCcpO1xuICAgICQodGhpcykuY2xvc2VzdCgnbGknKS5hZGRDbGFzcygnaXMtZXhwYW5kZWQnKTtcblxuXG4gICAgaWYoKGNoZWNrRWxlbWVudC5pcygnLmpzLXMtYWNjb3JkaW9uX19jb250ZW50JykpICYmIChjaGVja0VsZW1lbnQuaXMoJzp2aXNpYmxlJykpKSB7XG4gICAgICAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykucmVtb3ZlQ2xhc3MoJ2lzLWV4cGFuZGVkJyk7XG4gICAgICBjaGVja0VsZW1lbnQuc2xpZGVVcCgnbm9ybWFsJyk7XG4gICAgfVxuXG4gICAgaWYoKGNoZWNrRWxlbWVudC5pcygnLmpzLXMtYWNjb3JkaW9uX19jb250ZW50JykpICYmICghY2hlY2tFbGVtZW50LmlzKCc6dmlzaWJsZScpKSkge1xuICAgICAgJCgnLmpzLXMtYWNjb3JkaW9uIC5qcy1zLWFjY29yZGlvbl9fY29udGVudDp2aXNpYmxlJykuc2xpZGVVcCgnbm9ybWFsJyk7XG4gICAgICBjaGVja0VsZW1lbnQuc2xpZGVEb3duKCdub3JtYWwnKTtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tFbGVtZW50LmlzKCcuanMtcy1hY2NvcmRpb25fX2NvbnRlbnQnKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3NpbXBsZUFjY29yZGlvbi5qcyIsIi8qKlxuICogT2ZmY2FudmFzIG1vZHVsZVxuICogQG1vZHVsZSBtb2R1bGVzL29mZmNhbnZhc1xuICogQHNlZSBtb2R1bGVzL3RvZ2dsZU9wZW5cbiAqL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5cbi8qKlxuICogU2hpZnQga2V5Ym9hcmQgZm9jdXMgd2hlbiB0aGUgb2ZmY2FudmFzIG5hdiBpcyBvcGVuLlxuICogVGhlICdjaGFuZ2VPcGVuU3RhdGUnIGV2ZW50IGlzIGZpcmVkIGJ5IG1vZHVsZXMvdG9nZ2xlT3BlblxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgY29uc3Qgb2ZmQ2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW9mZmNhbnZhcycpO1xuICBpZiAob2ZmQ2FudmFzKSB7XG4gICAgZm9yRWFjaChvZmZDYW52YXMsIGZ1bmN0aW9uKG9mZkNhbnZhc0VsZW0pIHtcbiAgICAgIGNvbnN0IG9mZkNhbnZhc1NpZGUgPSBvZmZDYW52YXNFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5qcy1vZmZjYW52YXNfX3NpZGUnKTtcblxuICAgICAgLyoqXG4gICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgJ2NoYW5nZU9wZW5TdGF0ZScuXG4gICAgICAqIFRoZSB2YWx1ZSBvZiBldmVudC5kZXRhaWwgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIG9wZW4gc3RhdGUgaXMgdHJ1ZVxuICAgICAgKiAoaS5lLiB0aGUgb2ZmY2FudmFzIGNvbnRlbnQgaXMgdmlzaWJsZSkuXG4gICAgICAqIEBmdW5jdGlvblxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAqL1xuICAgICAgb2ZmQ2FudmFzRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2VPcGVuU3RhdGUnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuZGV0YWlsKSB7XG4gICAgICAgICAgaWYgKCEoL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pLnRlc3Qob2ZmQ2FudmFzU2lkZS50YWdOYW1lKSkpIHtcbiAgICAgICAgICAgIG9mZkNhbnZhc1NpZGUudGFiSW5kZXggPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb2ZmQ2FudmFzU2lkZS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL29mZmNhbnZhcy5qcyIsIi8qKlxuICogT3ZlcmxheSBtb2R1bGVcbiAqIEBtb2R1bGUgbW9kdWxlcy9vdmVybGF5XG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuXG4vKipcbiAqIFNoaWZ0IGtleWJvYXJkIGZvY3VzIHdoZW4gdGhlIHNlYXJjaCBvdmVybGF5IGlzIG9wZW4uXG4gKiBUaGUgJ2NoYW5nZU9wZW5TdGF0ZScgZXZlbnQgaXMgZmlyZWQgYnkgbW9kdWxlcy90b2dnbGVPcGVuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW92ZXJsYXknKTtcbiAgaWYgKG92ZXJsYXkpIHtcbiAgICBmb3JFYWNoKG92ZXJsYXksIGZ1bmN0aW9uKG92ZXJsYXlFbGVtKSB7XG4gICAgICAvKipcbiAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAnY2hhbmdlT3BlblN0YXRlJy5cbiAgICAgICogVGhlIHZhbHVlIG9mIGV2ZW50LmRldGFpbCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgb3BlbiBzdGF0ZSBpcyB0cnVlXG4gICAgICAqIChpLmUuIHRoZSBvdmVybGF5IGlzIHZpc2libGUpLlxuICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgKi9cbiAgICAgIG92ZXJsYXlFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZU9wZW5TdGF0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5kZXRhaWwpIHtcbiAgICAgICAgICBpZiAoISgvXig/OmF8c2VsZWN0fGlucHV0fGJ1dHRvbnx0ZXh0YXJlYSkkL2kudGVzdChvdmVybGF5LnRhZ05hbWUpKSkge1xuICAgICAgICAgICAgb3ZlcmxheS50YWJJbmRleCA9IC0xO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtb3ZlcmxheSBpbnB1dCcpKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtb3ZlcmxheSBpbnB1dCcpWzBdLmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG92ZXJsYXkuZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvb3ZlcmxheS5qcyIsIi8qKlxuKiBTdGljayBOYXYgbW9kdWxlXG4qIEBtb2R1bGUgbW9kdWxlcy9zdGlja3lOYXZcbiovXG5cbmltcG9ydCB0aHJvdHRsZSBmcm9tICdsb2Rhc2gvdGhyb3R0bGUnO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ2xvZGFzaC9kZWJvdW5jZSc7XG5pbXBvcnQgaW1hZ2VzUmVhZHkgZnJvbSAnaW1hZ2VzcmVhZHkvZGlzdC9pbWFnZXNyZWFkeS5qcyc7XG5cbi8qKlxuKiBcIlN0aWNrXCIgY29udGVudCBpbiBwbGFjZSBhcyB0aGUgdXNlciBzY3JvbGxzXG4qIEBwYXJhbSB7b2JqZWN0fSAkZWxlbSAtIGpRdWVyeSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIHN0aWNreVxuKiBAcGFyYW0ge29iamVjdH0gJGVsZW1Db250YWluZXIgLSBqUXVlcnkgZWxlbWVudCBmb3IgdGhlIGVsZW1lbnQncyBjb250YWluZXIuIFVzZWQgdG8gc2V0IHRoZSB0b3AgYW5kIGJvdHRvbSBwb2ludHNcbiogQHBhcmFtIHtvYmplY3R9ICRlbGVtQXJ0aWNsZSAtIENvbnRlbnQgbmV4dCB0byB0aGUgc3RpY2t5IG5hdlxuKi9cbmZ1bmN0aW9uIHN0aWNreU5hdigkZWxlbSwgJGVsZW1Db250YWluZXIsICRlbGVtQXJ0aWNsZSkge1xuICAvLyBNb2R1bGUgc2V0dGluZ3NcbiAgY29uc3Qgc2V0dGluZ3MgPSB7XG4gICAgc3RpY2t5Q2xhc3M6ICdpcy1zdGlja3knLFxuICAgIGFic29sdXRlQ2xhc3M6ICdpcy1zdHVjaycsXG4gICAgbGFyZ2VCcmVha3BvaW50OiAnMTAyNHB4JyxcbiAgICBhcnRpY2xlQ2xhc3M6ICdvLWFydGljbGUtLXNoaWZ0J1xuICB9O1xuXG4gIC8vIEdsb2JhbHNcbiAgbGV0IHN0aWNreU1vZGUgPSBmYWxzZTsgLy8gRmxhZyB0byB0ZWxsIGlmIHNpZGViYXIgaXMgaW4gXCJzdGlja3kgbW9kZVwiXG4gIGxldCBpc1N0aWNreSA9IGZhbHNlOyAvLyBXaGV0aGVyIHRoZSBzaWRlYmFyIGlzIHN0aWNreSBhdCB0aGlzIGV4YWN0IG1vbWVudCBpbiB0aW1lXG4gIGxldCBpc0Fic29sdXRlID0gZmFsc2U7IC8vIFdoZXRoZXIgdGhlIHNpZGViYXIgaXMgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGF0IHRoZSBib3R0b21cbiAgbGV0IHN3aXRjaFBvaW50ID0gMDsgLy8gUG9pbnQgYXQgd2hpY2ggdG8gc3dpdGNoIHRvIHN0aWNreSBtb2RlXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGxldCBzd2l0Y2hQb2ludEJvdHRvbSA9IDA7IC8vIFBvaW50IGF0IHdoaWNoIHRvIFwiZnJlZXplXCIgdGhlIHNpZGViYXIgc28gaXQgZG9lc24ndCBvdmVybGFwIHRoZSBmb290ZXJcbiAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBsZXQgbGVmdE9mZnNldCA9IDA7IC8vIEFtb3VudCBzaWRlYmFyIHNob3VsZCBiZSBzZXQgZnJvbSB0aGUgbGVmdCBzaWRlXG4gIGxldCBlbGVtV2lkdGggPSAwOyAvLyBXaWR0aCBpbiBwaXhlbHMgb2Ygc2lkZWJhclxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBsZXQgZWxlbUhlaWdodCA9IDA7IC8vIEhlaWdodCBpbiBwaXhlbHMgb2Ygc2lkZWJhclxuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cbiAgLyoqXG4gICogVG9nZ2xlIHRoZSBzdGlja3kgYmVoYXZpb3JcbiAgKlxuICAqIFR1cm5zIG9uIGlmIHRoZSB1c2VyIGhhcyBzY3JvbGxlZCBwYXN0IHRoZSBzd2l0Y2ggcG9pbnQsIG9mZiBpZiB0aGV5IHNjcm9sbCBiYWNrIHVwXG4gICogSWYgc3RpY2t5IG1vZGUgaXMgb24sIHNldHMgdGhlIGxlZnQgb2Zmc2V0IGFzIHdlbGxcbiAgKi9cbiAgZnVuY3Rpb24gdG9nZ2xlU3RpY2t5KCkge1xuICAgIGNvbnN0IGN1cnJlbnRTY3JvbGxQb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICBpZiAoY3VycmVudFNjcm9sbFBvcyA+IHN3aXRjaFBvaW50KSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgc2lkZWJhciBpcyBhbHJlYWR5IHN0aWNreVxuICAgICAgaWYgKCFpc1N0aWNreSkge1xuICAgICAgICBpc1N0aWNreSA9IHRydWU7XG4gICAgICAgIGlzQWJzb2x1dGUgPSBmYWxzZTtcbiAgICAgICAgJGVsZW0uYWRkQ2xhc3Moc2V0dGluZ3Muc3RpY2t5Q2xhc3MpLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFic29sdXRlQ2xhc3MpO1xuICAgICAgICAkZWxlbUFydGljbGUuYWRkQ2xhc3Moc2V0dGluZ3MuYXJ0aWNsZUNsYXNzKTtcbiAgICAgICAgdXBkYXRlRGltZW5zaW9ucygpO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgc2lkZWJhciBoYXMgcmVhY2hlZCB0aGUgYm90dG9tIHN3aXRjaCBwb2ludFxuICAgICAgaWYgKCQoJy5jLWZvb3Rlcl9fcmVhY2hlZCcpLmlzT25TY3JlZW4oKSkge1xuICAgICAgICBpc1N0aWNreSA9IGZhbHNlO1xuICAgICAgICBpc0Fic29sdXRlID0gdHJ1ZTtcbiAgICAgICAgJGVsZW0uYWRkQ2xhc3Moc2V0dGluZ3MuYWJzb2x1dGVDbGFzcyk7XG4gICAgICAgIHVwZGF0ZURpbWVuc2lvbnMoKTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoaXNTdGlja3kgfHwgaXNBYnNvbHV0ZSkge1xuICAgICAgaXNTdGlja3kgPSBmYWxzZTtcbiAgICAgIGlzQWJzb2x1dGUgPSBmYWxzZTtcbiAgICAgICRlbGVtLnJlbW92ZUNsYXNzKGAke3NldHRpbmdzLnN0aWNreUNsYXNzfSAke3NldHRpbmdzLmFic29sdXRlQ2xhc3N9YCk7XG4gICAgICAkZWxlbUFydGljbGUucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYXJ0aWNsZUNsYXNzKTtcbiAgICAgIHVwZGF0ZURpbWVuc2lvbnMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBVcGRhdGUgZGltZW5zaW9ucyBvbiBzaWRlYmFyXG4gICpcbiAgKiBTZXQgdG8gdGhlIGN1cnJlbnQgdmFsdWVzIG9mIGxlZnRPZmZzZXQgYW5kIGVsZW1XaWR0aCBpZiB0aGUgZWxlbWVudCBpc1xuICAqIGN1cnJlbnRseSBzdGlja3kuIE90aGVyd2lzZSwgY2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHZhbHVlc1xuICAqXG4gICogQHBhcmFtIHtib29sZWFufSBmb3JjZUNsZWFyIC0gRmxhZyB0byBjbGVhciBzZXQgdmFsdWVzIHJlZ2FyZGxlc3Mgb2Ygc3RpY2t5IHN0YXR1c1xuICAqL1xuICBmdW5jdGlvbiB1cGRhdGVEaW1lbnNpb25zKGZvcmNlQ2xlYXIpIHtcbiAgICBpZiAoaXNTdGlja3kgJiYgIWZvcmNlQ2xlYXIpIHtcbiAgICAgICRlbGVtLmNzcyh7XG4gICAgICAgIGxlZnQ6IGxlZnRPZmZzZXQgKyAncHgnLFxuICAgICAgICB3aWR0aDogZWxlbVdpZHRoICsgJ3B4JyxcbiAgICAgICAgdG9wOiAnJyxcbiAgICAgICAgYm90dG9tOiAnJ1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChpc0Fic29sdXRlICYmICFmb3JjZUNsZWFyKSB7XG4gICAgICAkZWxlbS5jc3Moe1xuICAgICAgICBsZWZ0OiAkZWxlbUNvbnRhaW5lci5jc3MoJ3BhZGRpbmctbGVmdCcpLFxuICAgICAgICB3aWR0aDogZWxlbVdpZHRoICsgJ3B4JyxcbiAgICAgICAgdG9wOiAnYXV0bycsXG4gICAgICAgIGJvdHRvbTogJGVsZW1Db250YWluZXIuY3NzKCdwYWRkaW5nLWJvdHRvbScpXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgbGVmdDogJycsXG4gICAgICAgIHdpZHRoOiAnJyxcbiAgICAgICAgdG9wOiAnJyxcbiAgICAgICAgYm90dG9tOiAnJ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogU2V0IHRoZSBzd2l0Y2hwb2ludCBmb3IgdGhlIGVsZW1lbnQgYW5kIGdldCBpdHMgY3VycmVudCBvZmZzZXRzXG4gICovXG4gIGZ1bmN0aW9uIHNldE9mZnNldFZhbHVlcygpIHtcbiAgICAkZWxlbS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgaWYgKGlzU3RpY2t5IHx8IGlzQWJzb2x1dGUpIHtcbiAgICAgICRlbGVtLnJlbW92ZUNsYXNzKGAke3NldHRpbmdzLnN0aWNreUNsYXNzfSAke3NldHRpbmdzLmFic29sdXRlQ2xhc3N9YCk7XG4gICAgICAkZWxlbUFydGljbGUucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYXJ0aWNsZUNsYXNzKTtcbiAgICB9XG4gICAgdXBkYXRlRGltZW5zaW9ucyh0cnVlKTtcblxuICAgIHN3aXRjaFBvaW50ID0gJGVsZW0ub2Zmc2V0KCkudG9wO1xuICAgIC8vIEJvdHRvbSBzd2l0Y2ggcG9pbnQgaXMgZXF1YWwgdG8gdGhlIG9mZnNldCBhbmQgaGVpZ2h0IG9mIHRoZSBvdXRlciBjb250YWluZXIsIG1pbnVzIGFueSBwYWRkaW5nIG9uIHRoZSBib3R0b21cbiAgICBzd2l0Y2hQb2ludEJvdHRvbSA9ICRlbGVtQ29udGFpbmVyLm9mZnNldCgpLnRvcCArICRlbGVtQ29udGFpbmVyLm91dGVySGVpZ2h0KCkgLVxuICAgICAgcGFyc2VJbnQoJGVsZW1Db250YWluZXIuY3NzKCdwYWRkaW5nLWJvdHRvbScpLCAxMCk7XG5cbiAgICBsZWZ0T2Zmc2V0ID0gJGVsZW0ub2Zmc2V0KCkubGVmdDtcbiAgICBlbGVtV2lkdGggPSAkZWxlbS5vdXRlcldpZHRoKCk7XG4gICAgZWxlbUhlaWdodCA9ICRlbGVtLm91dGVySGVpZ2h0KCk7XG5cbiAgICBpZiAoaXNTdGlja3kgfHwgaXNBYnNvbHV0ZSkge1xuICAgICAgdXBkYXRlRGltZW5zaW9ucygpO1xuICAgICAgJGVsZW0uYWRkQ2xhc3Moc2V0dGluZ3Muc3RpY2t5Q2xhc3MpO1xuICAgICAgJGVsZW1BcnRpY2xlLmFkZENsYXNzKHNldHRpbmdzLmFydGljbGVDbGFzcyk7XG4gICAgICBpZiAoaXNBYnNvbHV0ZSkge1xuICAgICAgICAkZWxlbS5hZGRDbGFzcyhzZXR0aW5ncy5hYnNvbHV0ZUNsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgJGVsZW0uY3NzKCd2aXNpYmlsaXR5JywgJycpO1xuICB9XG5cbiAgLyoqXG4gICogVHVybiBvbiBcInN0aWNreSBtb2RlXCJcbiAgKlxuICAqIFdhdGNoIGZvciBzY3JvbGwgYW5kIGZpeCB0aGUgc2lkZWJhci4gV2F0Y2ggZm9yIHNpemVzIGNoYW5nZXMgb24gI21haW5cbiAgKiAod2hpY2ggbWF5IGNoYW5nZSBpZiBwYXJhbGxheCBpcyB1c2VkKSBhbmQgYWRqdXN0IGFjY29yZGluZ2x5LlxuICAqL1xuICBmdW5jdGlvbiBzdGlja3lNb2RlT24oKSB7XG4gICAgc3RpY2t5TW9kZSA9IHRydWU7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbC5maXhlZFNpZGViYXInLCB0aHJvdHRsZShmdW5jdGlvbigpIHtcbiAgICAgIHRvZ2dsZVN0aWNreSgpO1xuICAgIH0sIDEwMCkpLnRyaWdnZXIoJ3Njcm9sbC5maXhlZFNpZGViYXInKTtcblxuICAgICQoJyNtYWluJykub24oJ2NvbnRhaW5lclNpemVDaGFuZ2UuZml4ZWRTaWRlYmFyJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHN3aXRjaFBvaW50IC09IGV2ZW50Lm9yaWdpbmFsRXZlbnQuZGV0YWlsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICogVHVybiBvZmYgXCJzdGlja3kgbW9kZVwiXG4gICpcbiAgKiBSZW1vdmUgdGhlIGV2ZW50IGJpbmRpbmcgYW5kIHJlc2V0IGV2ZXJ5dGhpbmdcbiAgKi9cbiAgZnVuY3Rpb24gc3RpY2t5TW9kZU9mZigpIHtcbiAgICBpZiAoaXNTdGlja3kpIHtcbiAgICAgIHVwZGF0ZURpbWVuc2lvbnModHJ1ZSk7XG4gICAgICAkZWxlbS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5zdGlja3lDbGFzcyk7XG4gICAgfVxuICAgICQod2luZG93KS5vZmYoJ3Njcm9sbC5maXhlZFNpZGViYXInKTtcbiAgICAkKCcjbWFpbicpLm9mZignY29udGFpbmVyU2l6ZUNoYW5nZS5maXhlZFNpZGViYXInKTtcbiAgICBzdGlja3lNb2RlID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgKiBIYW5kbGUgJ3Jlc2l6ZScgZXZlbnRcbiAgKlxuICAqIFR1cm4gc3RpY2t5IG1vZGUgb24vb2ZmIGRlcGVuZGluZyBvbiB3aGV0aGVyIHdlJ3JlIGluIGRlc2t0b3AgbW9kZVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RpY2t5TW9kZSAtIFdoZXRoZXIgc2lkZWJhciBzaG91bGQgYmUgY29uc2lkZXJlZCBzdGlja3lcbiAgKi9cbiAgZnVuY3Rpb24gb25SZXNpemUoKSB7XG4gICAgY29uc3QgbGFyZ2VNb2RlID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6ICcgK1xuICAgICAgc2V0dGluZ3MubGFyZ2VCcmVha3BvaW50ICsgJyknKS5tYXRjaGVzO1xuICAgIGlmIChsYXJnZU1vZGUpIHtcbiAgICAgIHNldE9mZnNldFZhbHVlcygpO1xuICAgICAgaWYgKCFzdGlja3lNb2RlKSB7XG4gICAgICAgIHN0aWNreU1vZGVPbigpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3RpY2t5TW9kZSkge1xuICAgICAgc3RpY2t5TW9kZU9mZigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIEluaXRpYWxpemUgdGhlIHN0aWNreSBuYXZcbiAgKiBAcGFyYW0ge29iamVjdH0gZWxlbSAtIERPTSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIHN0aWNreVxuICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucy4gV2lsbCBvdmVycmlkZSBtb2R1bGUgZGVmYXVsdHMgd2hlbiBwcmVzZW50XG4gICovXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuZml4ZWRTaWRlYmFyJywgZGVib3VuY2UoZnVuY3Rpb24oKSB7XG4gICAgICBvblJlc2l6ZSgpO1xuICAgIH0sIDEwMCkpO1xuXG4gICAgaW1hZ2VzUmVhZHkoZG9jdW1lbnQuYm9keSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIG9uUmVzaXplKCk7XG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplKCk7XG5cbiAgJC5mbi5pc09uU2NyZWVuID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgd2luID0gJCh3aW5kb3cpO1xuXG4gICAgdmFyIHZpZXdwb3J0ID0ge1xuICAgICAgICB0b3AgOiB3aW4uc2Nyb2xsVG9wKCksXG4gICAgICAgIGxlZnQgOiB3aW4uc2Nyb2xsTGVmdCgpXG4gICAgfTtcbiAgICB2aWV3cG9ydC5yaWdodCA9IHZpZXdwb3J0LmxlZnQgKyB3aW4ud2lkdGgoKTtcbiAgICB2aWV3cG9ydC5ib3R0b20gPSB2aWV3cG9ydC50b3AgKyB3aW4uaGVpZ2h0KCk7XG5cbiAgICB2YXIgYm91bmRzID0gdGhpcy5vZmZzZXQoKTtcbiAgICBib3VuZHMucmlnaHQgPSBib3VuZHMubGVmdCArIHRoaXMub3V0ZXJXaWR0aCgpO1xuICAgIGJvdW5kcy5ib3R0b20gPSBib3VuZHMudG9wICsgdGhpcy5vdXRlckhlaWdodCgpO1xuXG4gICAgcmV0dXJuICghKHZpZXdwb3J0LnJpZ2h0IDwgYm91bmRzLmxlZnQgfHwgdmlld3BvcnQubGVmdCA+IGJvdW5kcy5yaWdodCB8fCB2aWV3cG9ydC5ib3R0b20gPCBib3VuZHMudG9wIHx8IHZpZXdwb3J0LnRvcCA+IGJvdW5kcy5ib3R0b20pKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0ICRzdGlja3lOYXZzID0gJCgnLmpzLXN0aWNreScpO1xuICBpZiAoJHN0aWNreU5hdnMubGVuZ3RoKSB7XG4gICAgJHN0aWNreU5hdnMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGxldCAkb3V0ZXJDb250YWluZXIgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1zdGlja3ktY29udGFpbmVyJyk7XG4gICAgICBsZXQgJGFydGljbGUgPSAkb3V0ZXJDb250YWluZXIuZmluZCgnLmpzLXN0aWNreS1hcnRpY2xlJyk7XG4gICAgICBzdGlja3lOYXYoJCh0aGlzKSwgJG91dGVyQ29udGFpbmVyLCAkYXJ0aWNsZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3N0aWNrTmF2LmpzIiwidmFyIGRlYm91bmNlID0gcmVxdWlyZSgnLi9kZWJvdW5jZScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCBvbmx5IGludm9rZXMgYGZ1bmNgIGF0IG1vc3Qgb25jZSBwZXJcbiAqIGV2ZXJ5IGB3YWl0YCBtaWxsaXNlY29uZHMuIFRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgXG4gKiBtZXRob2QgdG8gY2FuY2VsIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvXG4gKiBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS4gUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGBcbiAqIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZCB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGVcbiAqIHRocm90dGxlZCBmdW5jdGlvbi4gU3Vic2VxdWVudCBjYWxscyB0byB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHJldHVybiB0aGVcbiAqIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRocm90dGxlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy50aHJvdHRsZWAgYW5kIGBfLmRlYm91bmNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGludm9jYXRpb25zIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZy5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlcy5cbiAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwgeyAndHJhaWxpbmcnOiBmYWxzZSB9KTtcbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCB0aHJvdHRsZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgdGhyb3R0bGVkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCB0aHJvdHRsZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGVhZGluZyA9IHRydWUsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIHtcbiAgICAnbGVhZGluZyc6IGxlYWRpbmcsXG4gICAgJ21heFdhaXQnOiB3YWl0LFxuICAgICd0cmFpbGluZyc6IHRyYWlsaW5nXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL3Rocm90dGxlLmpzXG4vLyBtb2R1bGUgaWQgPSA0OVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBub3c7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvbm93LmpzXG4vLyBtb2R1bGUgaWQgPSA1MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b051bWJlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b051bWJlci5qc1xuLy8gbW9kdWxlIGlkID0gNTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzXG4vLyBtb2R1bGUgaWQgPSA1MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiBpbWFnZXNyZWFkeSB2MC4yLjIgLSAyMDE1LTA3LTA0VDA2OjIyOjE0LjQzNVogLSBodHRwczovL2dpdGh1Yi5jb20vci1wYXJrL2ltYWdlcy1yZWFkeSAqL1xuOyhmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuaW1hZ2VzUmVhZHkgPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG5cInVzZSBzdHJpY3RcIjtcblxuLy8gVXNlIHRoZSBmYXN0ZXN0IG1lYW5zIHBvc3NpYmxlIHRvIGV4ZWN1dGUgYSB0YXNrIGluIGl0cyBvd24gdHVybiwgd2l0aFxuLy8gcHJpb3JpdHkgb3ZlciBvdGhlciBldmVudHMgaW5jbHVkaW5nIElPLCBhbmltYXRpb24sIHJlZmxvdywgYW5kIHJlZHJhd1xuLy8gZXZlbnRzIGluIGJyb3dzZXJzLlxuLy9cbi8vIEFuIGV4Y2VwdGlvbiB0aHJvd24gYnkgYSB0YXNrIHdpbGwgcGVybWFuZW50bHkgaW50ZXJydXB0IHRoZSBwcm9jZXNzaW5nIG9mXG4vLyBzdWJzZXF1ZW50IHRhc2tzLiBUaGUgaGlnaGVyIGxldmVsIGBhc2FwYCBmdW5jdGlvbiBlbnN1cmVzIHRoYXQgaWYgYW5cbi8vIGV4Y2VwdGlvbiBpcyB0aHJvd24gYnkgYSB0YXNrLCB0aGF0IHRoZSB0YXNrIHF1ZXVlIHdpbGwgY29udGludWUgZmx1c2hpbmcgYXNcbi8vIHNvb24gYXMgcG9zc2libGUsIGJ1dCBpZiB5b3UgdXNlIGByYXdBc2FwYCBkaXJlY3RseSwgeW91IGFyZSByZXNwb25zaWJsZSB0b1xuLy8gZWl0aGVyIGVuc3VyZSB0aGF0IG5vIGV4Y2VwdGlvbnMgYXJlIHRocm93biBmcm9tIHlvdXIgdGFzaywgb3IgdG8gbWFudWFsbHlcbi8vIGNhbGwgYHJhd0FzYXAucmVxdWVzdEZsdXNoYCBpZiBhbiBleGNlcHRpb24gaXMgdGhyb3duLlxuLy9tb2R1bGUuZXhwb3J0cyA9IHJhd0FzYXA7XG5mdW5jdGlvbiByYXdBc2FwKHRhc2spIHtcbiAgICBpZiAoIXF1ZXVlLmxlbmd0aCkge1xuICAgICAgICByZXF1ZXN0Rmx1c2goKTtcbiAgICAgICAgZmx1c2hpbmcgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBFcXVpdmFsZW50IHRvIHB1c2gsIGJ1dCBhdm9pZHMgYSBmdW5jdGlvbiBjYWxsLlxuICAgIHF1ZXVlW3F1ZXVlLmxlbmd0aF0gPSB0YXNrO1xufVxuXG52YXIgcXVldWUgPSBbXTtcbi8vIE9uY2UgYSBmbHVzaCBoYXMgYmVlbiByZXF1ZXN0ZWQsIG5vIGZ1cnRoZXIgY2FsbHMgdG8gYHJlcXVlc3RGbHVzaGAgYXJlXG4vLyBuZWNlc3NhcnkgdW50aWwgdGhlIG5leHQgYGZsdXNoYCBjb21wbGV0ZXMuXG52YXIgZmx1c2hpbmcgPSBmYWxzZTtcbi8vIGByZXF1ZXN0Rmx1c2hgIGlzIGFuIGltcGxlbWVudGF0aW9uLXNwZWNpZmljIG1ldGhvZCB0aGF0IGF0dGVtcHRzIHRvIGtpY2tcbi8vIG9mZiBhIGBmbHVzaGAgZXZlbnQgYXMgcXVpY2tseSBhcyBwb3NzaWJsZS4gYGZsdXNoYCB3aWxsIGF0dGVtcHQgdG8gZXhoYXVzdFxuLy8gdGhlIGV2ZW50IHF1ZXVlIGJlZm9yZSB5aWVsZGluZyB0byB0aGUgYnJvd3NlcidzIG93biBldmVudCBsb29wLlxudmFyIHJlcXVlc3RGbHVzaDtcbi8vIFRoZSBwb3NpdGlvbiBvZiB0aGUgbmV4dCB0YXNrIHRvIGV4ZWN1dGUgaW4gdGhlIHRhc2sgcXVldWUuIFRoaXMgaXNcbi8vIHByZXNlcnZlZCBiZXR3ZWVuIGNhbGxzIHRvIGBmbHVzaGAgc28gdGhhdCBpdCBjYW4gYmUgcmVzdW1lZCBpZlxuLy8gYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24uXG52YXIgaW5kZXggPSAwO1xuLy8gSWYgYSB0YXNrIHNjaGVkdWxlcyBhZGRpdGlvbmFsIHRhc2tzIHJlY3Vyc2l2ZWx5LCB0aGUgdGFzayBxdWV1ZSBjYW4gZ3Jvd1xuLy8gdW5ib3VuZGVkLiBUbyBwcmV2ZW50IG1lbW9yeSBleGhhdXN0aW9uLCB0aGUgdGFzayBxdWV1ZSB3aWxsIHBlcmlvZGljYWxseVxuLy8gdHJ1bmNhdGUgYWxyZWFkeS1jb21wbGV0ZWQgdGFza3MuXG52YXIgY2FwYWNpdHkgPSAxMDI0O1xuXG4vLyBUaGUgZmx1c2ggZnVuY3Rpb24gcHJvY2Vzc2VzIGFsbCB0YXNrcyB0aGF0IGhhdmUgYmVlbiBzY2hlZHVsZWQgd2l0aFxuLy8gYHJhd0FzYXBgIHVubGVzcyBhbmQgdW50aWwgb25lIG9mIHRob3NlIHRhc2tzIHRocm93cyBhbiBleGNlcHRpb24uXG4vLyBJZiBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgYGZsdXNoYCBlbnN1cmVzIHRoYXQgaXRzIHN0YXRlIHdpbGwgcmVtYWluXG4vLyBjb25zaXN0ZW50IGFuZCB3aWxsIHJlc3VtZSB3aGVyZSBpdCBsZWZ0IG9mZiB3aGVuIGNhbGxlZCBhZ2Fpbi5cbi8vIEhvd2V2ZXIsIGBmbHVzaGAgZG9lcyBub3QgbWFrZSBhbnkgYXJyYW5nZW1lbnRzIHRvIGJlIGNhbGxlZCBhZ2FpbiBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93bi5cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHdoaWxlIChpbmRleCA8IHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgIC8vIEFkdmFuY2UgdGhlIGluZGV4IGJlZm9yZSBjYWxsaW5nIHRoZSB0YXNrLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSB3aWxsXG4gICAgICAgIC8vIGJlZ2luIGZsdXNoaW5nIG9uIHRoZSBuZXh0IHRhc2sgdGhlIHRhc2sgdGhyb3dzIGFuIGVycm9yLlxuICAgICAgICBpbmRleCA9IGluZGV4ICsgMTtcbiAgICAgICAgcXVldWVbY3VycmVudEluZGV4XS5jYWxsKCk7XG4gICAgICAgIC8vIFByZXZlbnQgbGVha2luZyBtZW1vcnkgZm9yIGxvbmcgY2hhaW5zIG9mIHJlY3Vyc2l2ZSBjYWxscyB0byBgYXNhcGAuXG4gICAgICAgIC8vIElmIHdlIGNhbGwgYGFzYXBgIHdpdGhpbiB0YXNrcyBzY2hlZHVsZWQgYnkgYGFzYXBgLCB0aGUgcXVldWUgd2lsbFxuICAgICAgICAvLyBncm93LCBidXQgdG8gYXZvaWQgYW4gTyhuKSB3YWxrIGZvciBldmVyeSB0YXNrIHdlIGV4ZWN1dGUsIHdlIGRvbid0XG4gICAgICAgIC8vIHNoaWZ0IHRhc2tzIG9mZiB0aGUgcXVldWUgYWZ0ZXIgdGhleSBoYXZlIGJlZW4gZXhlY3V0ZWQuXG4gICAgICAgIC8vIEluc3RlYWQsIHdlIHBlcmlvZGljYWxseSBzaGlmdCAxMDI0IHRhc2tzIG9mZiB0aGUgcXVldWUuXG4gICAgICAgIGlmIChpbmRleCA+IGNhcGFjaXR5KSB7XG4gICAgICAgICAgICAvLyBNYW51YWxseSBzaGlmdCBhbGwgdmFsdWVzIHN0YXJ0aW5nIGF0IHRoZSBpbmRleCBiYWNrIHRvIHRoZVxuICAgICAgICAgICAgLy8gYmVnaW5uaW5nIG9mIHRoZSBxdWV1ZS5cbiAgICAgICAgICAgIGZvciAodmFyIHNjYW4gPSAwLCBuZXdMZW5ndGggPSBxdWV1ZS5sZW5ndGggLSBpbmRleDsgc2NhbiA8IG5ld0xlbmd0aDsgc2NhbisrKSB7XG4gICAgICAgICAgICAgICAgcXVldWVbc2Nhbl0gPSBxdWV1ZVtzY2FuICsgaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcXVldWUubGVuZ3RoIC09IGluZGV4O1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgaW5kZXggPSAwO1xuICAgIGZsdXNoaW5nID0gZmFsc2U7XG59XG5cbi8vIGByZXF1ZXN0Rmx1c2hgIGlzIGltcGxlbWVudGVkIHVzaW5nIGEgc3RyYXRlZ3kgYmFzZWQgb24gZGF0YSBjb2xsZWN0ZWQgZnJvbVxuLy8gZXZlcnkgYXZhaWxhYmxlIFNhdWNlTGFicyBTZWxlbml1bSB3ZWIgZHJpdmVyIHdvcmtlciBhdCB0aW1lIG9mIHdyaXRpbmcuXG4vLyBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xbUctNVVZR3VwNXF4R2RFTVdraFA2QldDejA1M05VYjJFMVFvVVRVMTZ1QS9lZGl0I2dpZD03ODM3MjQ1OTNcblxuLy8gU2FmYXJpIDYgYW5kIDYuMSBmb3IgZGVza3RvcCwgaVBhZCwgYW5kIGlQaG9uZSBhcmUgdGhlIG9ubHkgYnJvd3NlcnMgdGhhdFxuLy8gaGF2ZSBXZWJLaXRNdXRhdGlvbk9ic2VydmVyIGJ1dCBub3QgdW4tcHJlZml4ZWQgTXV0YXRpb25PYnNlcnZlci5cbi8vIE11c3QgdXNlIGBnbG9iYWxgIGluc3RlYWQgb2YgYHdpbmRvd2AgdG8gd29yayBpbiBib3RoIGZyYW1lcyBhbmQgd2ViXG4vLyB3b3JrZXJzLiBgZ2xvYmFsYCBpcyBhIHByb3Zpc2lvbiBvZiBCcm93c2VyaWZ5LCBNciwgTXJzLCBvciBNb3AuXG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlciB8fCB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuLy8gTXV0YXRpb25PYnNlcnZlcnMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgaGF2ZSBoaWdoIHByaW9yaXR5IGFuZCB3b3JrXG4vLyByZWxpYWJseSBldmVyeXdoZXJlIHRoZXkgYXJlIGltcGxlbWVudGVkLlxuLy8gVGhleSBhcmUgaW1wbGVtZW50ZWQgaW4gYWxsIG1vZGVybiBicm93c2Vycy5cbi8vXG4vLyAtIEFuZHJvaWQgNC00LjNcbi8vIC0gQ2hyb21lIDI2LTM0XG4vLyAtIEZpcmVmb3ggMTQtMjlcbi8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgMTFcbi8vIC0gaVBhZCBTYWZhcmkgNi03LjFcbi8vIC0gaVBob25lIFNhZmFyaSA3LTcuMVxuLy8gLSBTYWZhcmkgNi03XG5pZiAodHlwZW9mIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG5cbi8vIE1lc3NhZ2VDaGFubmVscyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBnaXZlIGRpcmVjdCBhY2Nlc3MgdG8gdGhlIEhUTUxcbi8vIHRhc2sgcXVldWUsIGFyZSBpbXBsZW1lbnRlZCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCwgU2FmYXJpIDUuMC0xLCBhbmQgT3BlcmFcbi8vIDExLTEyLCBhbmQgaW4gd2ViIHdvcmtlcnMgaW4gbWFueSBlbmdpbmVzLlxuLy8gQWx0aG91Z2ggbWVzc2FnZSBjaGFubmVscyB5aWVsZCB0byBhbnkgcXVldWVkIHJlbmRlcmluZyBhbmQgSU8gdGFza3MsIHRoZXlcbi8vIHdvdWxkIGJlIGJldHRlciB0aGFuIGltcG9zaW5nIHRoZSA0bXMgZGVsYXkgb2YgdGltZXJzLlxuLy8gSG93ZXZlciwgdGhleSBkbyBub3Qgd29yayByZWxpYWJseSBpbiBJbnRlcm5ldCBFeHBsb3JlciBvciBTYWZhcmkuXG5cbi8vIEludGVybmV0IEV4cGxvcmVyIDEwIGlzIHRoZSBvbmx5IGJyb3dzZXIgdGhhdCBoYXMgc2V0SW1tZWRpYXRlIGJ1dCBkb2VzXG4vLyBub3QgaGF2ZSBNdXRhdGlvbk9ic2VydmVycy5cbi8vIEFsdGhvdWdoIHNldEltbWVkaWF0ZSB5aWVsZHMgdG8gdGhlIGJyb3dzZXIncyByZW5kZXJlciwgaXQgd291bGQgYmVcbi8vIHByZWZlcnJhYmxlIHRvIGZhbGxpbmcgYmFjayB0byBzZXRUaW1lb3V0IHNpbmNlIGl0IGRvZXMgbm90IGhhdmVcbi8vIHRoZSBtaW5pbXVtIDRtcyBwZW5hbHR5LlxuLy8gVW5mb3J0dW5hdGVseSB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwIE1vYmlsZSAoYW5kXG4vLyBEZXNrdG9wIHRvIGEgbGVzc2VyIGV4dGVudCkgdGhhdCByZW5kZXJzIGJvdGggc2V0SW1tZWRpYXRlIGFuZFxuLy8gTWVzc2FnZUNoYW5uZWwgdXNlbGVzcyBmb3IgdGhlIHB1cnBvc2VzIG9mIEFTQVAuXG4vLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL3EvaXNzdWVzLzM5NlxuXG4vLyBUaW1lcnMgYXJlIGltcGxlbWVudGVkIHVuaXZlcnNhbGx5LlxuLy8gV2UgZmFsbCBiYWNrIHRvIHRpbWVycyBpbiB3b3JrZXJzIGluIG1vc3QgZW5naW5lcywgYW5kIGluIGZvcmVncm91bmRcbi8vIGNvbnRleHRzIGluIHRoZSBmb2xsb3dpbmcgYnJvd3NlcnMuXG4vLyBIb3dldmVyLCBub3RlIHRoYXQgZXZlbiB0aGlzIHNpbXBsZSBjYXNlIHJlcXVpcmVzIG51YW5jZXMgdG8gb3BlcmF0ZSBpbiBhXG4vLyBicm9hZCBzcGVjdHJ1bSBvZiBicm93c2Vycy5cbi8vXG4vLyAtIEZpcmVmb3ggMy0xM1xuLy8gLSBJbnRlcm5ldCBFeHBsb3JlciA2LTlcbi8vIC0gaVBhZCBTYWZhcmkgNC4zXG4vLyAtIEx5bnggMi44Ljdcbn0gZWxzZSB7XG4gICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGZsdXNoKTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgcmVxdWVzdHMgdGhhdCB0aGUgaGlnaCBwcmlvcml0eSBldmVudCBxdWV1ZSBiZSBmbHVzaGVkIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLlxuLy8gVGhpcyBpcyB1c2VmdWwgdG8gcHJldmVudCBhbiBlcnJvciB0aHJvd24gaW4gYSB0YXNrIGZyb20gc3RhbGxpbmcgdGhlIGV2ZW50XG4vLyBxdWV1ZSBpZiB0aGUgZXhjZXB0aW9uIGhhbmRsZWQgYnkgTm9kZS5qc+KAmXNcbi8vIGBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIilgIG9yIGJ5IGEgZG9tYWluLlxucmF3QXNhcC5yZXF1ZXN0Rmx1c2ggPSByZXF1ZXN0Rmx1c2g7XG5cbi8vIFRvIHJlcXVlc3QgYSBoaWdoIHByaW9yaXR5IGV2ZW50LCB3ZSBpbmR1Y2UgYSBtdXRhdGlvbiBvYnNlcnZlciBieSB0b2dnbGluZ1xuLy8gdGhlIHRleHQgb2YgYSB0ZXh0IG5vZGUgYmV0d2VlbiBcIjFcIiBhbmQgXCItMVwiLlxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spIHtcbiAgICB2YXIgdG9nZ2xlID0gMTtcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbiAgICAgICAgdG9nZ2xlID0gLXRvZ2dsZTtcbiAgICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlO1xuICAgIH07XG59XG5cbi8vIFRoZSBtZXNzYWdlIGNoYW5uZWwgdGVjaG5pcXVlIHdhcyBkaXNjb3ZlcmVkIGJ5IE1hbHRlIFVibCBhbmQgd2FzIHRoZVxuLy8gb3JpZ2luYWwgZm91bmRhdGlvbiBmb3IgdGhpcyBsaWJyYXJ5LlxuLy8gaHR0cDovL3d3dy5ub25ibG9ja2luZy5pby8yMDExLzA2L3dpbmRvd25leHR0aWNrLmh0bWxcblxuLy8gU2FmYXJpIDYuMC41IChhdCBsZWFzdCkgaW50ZXJtaXR0ZW50bHkgZmFpbHMgdG8gY3JlYXRlIG1lc3NhZ2UgcG9ydHMgb24gYVxuLy8gcGFnZSdzIGZpcnN0IGxvYWQuIFRoYW5rZnVsbHksIHRoaXMgdmVyc2lvbiBvZiBTYWZhcmkgc3VwcG9ydHNcbi8vIE11dGF0aW9uT2JzZXJ2ZXJzLCBzbyB3ZSBkb24ndCBuZWVkIHRvIGZhbGwgYmFjayBpbiB0aGF0IGNhc2UuXG5cbi8vIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NZXNzYWdlQ2hhbm5lbChjYWxsYmFjaykge1xuLy8gICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4vLyAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBjYWxsYmFjaztcbi8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4vLyAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4vLyAgICAgfTtcbi8vIH1cblxuLy8gRm9yIHJlYXNvbnMgZXhwbGFpbmVkIGFib3ZlLCB3ZSBhcmUgYWxzbyB1bmFibGUgdG8gdXNlIGBzZXRJbW1lZGlhdGVgXG4vLyB1bmRlciBhbnkgY2lyY3Vtc3RhbmNlcy5cbi8vIEV2ZW4gaWYgd2Ugd2VyZSwgdGhlcmUgaXMgYW5vdGhlciBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAuXG4vLyBJdCBpcyBub3Qgc3VmZmljaWVudCB0byBhc3NpZ24gYHNldEltbWVkaWF0ZWAgdG8gYHJlcXVlc3RGbHVzaGAgYmVjYXVzZVxuLy8gYHNldEltbWVkaWF0ZWAgbXVzdCBiZSBjYWxsZWQgKmJ5IG5hbWUqIGFuZCB0aGVyZWZvcmUgbXVzdCBiZSB3cmFwcGVkIGluIGFcbi8vIGNsb3N1cmUuXG4vLyBOZXZlciBmb3JnZXQuXG5cbi8vIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21TZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbi8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4vLyAgICAgICAgIHNldEltbWVkaWF0ZShjYWxsYmFjayk7XG4vLyAgICAgfTtcbi8vIH1cblxuLy8gU2FmYXJpIDYuMCBoYXMgYSBwcm9ibGVtIHdoZXJlIHRpbWVycyB3aWxsIGdldCBsb3N0IHdoaWxlIHRoZSB1c2VyIGlzXG4vLyBzY3JvbGxpbmcuIFRoaXMgcHJvYmxlbSBkb2VzIG5vdCBpbXBhY3QgQVNBUCBiZWNhdXNlIFNhZmFyaSA2LjAgc3VwcG9ydHNcbi8vIG11dGF0aW9uIG9ic2VydmVycywgc28gdGhhdCBpbXBsZW1lbnRhdGlvbiBpcyB1c2VkIGluc3RlYWQuXG4vLyBIb3dldmVyLCBpZiB3ZSBldmVyIGVsZWN0IHRvIHVzZSB0aW1lcnMgaW4gU2FmYXJpLCB0aGUgcHJldmFsZW50IHdvcmstYXJvdW5kXG4vLyBpcyB0byBhZGQgYSBzY3JvbGwgZXZlbnQgbGlzdGVuZXIgdGhhdCBjYWxscyBmb3IgYSBmbHVzaC5cblxuLy8gYHNldFRpbWVvdXRgIGRvZXMgbm90IGNhbGwgdGhlIHBhc3NlZCBjYWxsYmFjayBpZiB0aGUgZGVsYXkgaXMgbGVzcyB0aGFuXG4vLyBhcHByb3hpbWF0ZWx5IDcgaW4gd2ViIHdvcmtlcnMgaW4gRmlyZWZveCA4IHRocm91Z2ggMTgsIGFuZCBzb21ldGltZXMgbm90XG4vLyBldmVuIHRoZW4uXG5cbmZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbiAgICAgICAgLy8gV2UgZGlzcGF0Y2ggYSB0aW1lb3V0IHdpdGggYSBzcGVjaWZpZWQgZGVsYXkgb2YgMCBmb3IgZW5naW5lcyB0aGF0XG4gICAgICAgIC8vIGNhbiByZWxpYWJseSBhY2NvbW1vZGF0ZSB0aGF0IHJlcXVlc3QuIFRoaXMgd2lsbCB1c3VhbGx5IGJlIHNuYXBwZWRcbiAgICAgICAgLy8gdG8gYSA0IG1pbGlzZWNvbmQgZGVsYXksIGJ1dCBvbmNlIHdlJ3JlIGZsdXNoaW5nLCB0aGVyZSdzIG5vIGRlbGF5XG4gICAgICAgIC8vIGJldHdlZW4gZXZlbnRzLlxuICAgICAgICB2YXIgdGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoaGFuZGxlVGltZXIsIDApO1xuICAgICAgICAvLyBIb3dldmVyLCBzaW5jZSB0aGlzIHRpbWVyIGdldHMgZnJlcXVlbnRseSBkcm9wcGVkIGluIEZpcmVmb3hcbiAgICAgICAgLy8gd29ya2Vycywgd2UgZW5saXN0IGFuIGludGVydmFsIGhhbmRsZSB0aGF0IHdpbGwgdHJ5IHRvIGZpcmVcbiAgICAgICAgLy8gYW4gZXZlbnQgMjAgdGltZXMgcGVyIHNlY29uZCB1bnRpbCBpdCBzdWNjZWVkcy5cbiAgICAgICAgdmFyIGludGVydmFsSGFuZGxlID0gc2V0SW50ZXJ2YWwoaGFuZGxlVGltZXIsIDUwKTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVUaW1lcigpIHtcbiAgICAgICAgICAgIC8vIFdoaWNoZXZlciB0aW1lciBzdWNjZWVkcyB3aWxsIGNhbmNlbCBib3RoIHRpbWVycyBhbmRcbiAgICAgICAgICAgIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrLlxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRIYW5kbGUpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbEhhbmRsZSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuLy8gVGhpcyBpcyBmb3IgYGFzYXAuanNgIG9ubHkuXG4vLyBJdHMgbmFtZSB3aWxsIGJlIHBlcmlvZGljYWxseSByYW5kb21pemVkIHRvIGJyZWFrIGFueSBjb2RlIHRoYXQgZGVwZW5kcyBvblxuLy8gaXRzIGV4aXN0ZW5jZS5cbnJhd0FzYXAubWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyO1xuXG4vLyBBU0FQIHdhcyBvcmlnaW5hbGx5IGEgbmV4dFRpY2sgc2hpbSBpbmNsdWRlZCBpbiBRLiBUaGlzIHdhcyBmYWN0b3JlZCBvdXRcbi8vIGludG8gdGhpcyBBU0FQIHBhY2thZ2UuIEl0IHdhcyBsYXRlciBhZGFwdGVkIHRvIFJTVlAgd2hpY2ggbWFkZSBmdXJ0aGVyXG4vLyBhbWVuZG1lbnRzLiBUaGVzZSBkZWNpc2lvbnMsIHBhcnRpY3VsYXJseSB0byBtYXJnaW5hbGl6ZSBNZXNzYWdlQ2hhbm5lbCBhbmRcbi8vIHRvIGNhcHR1cmUgdGhlIE11dGF0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24gaW4gYSBjbG9zdXJlLCB3ZXJlIGludGVncmF0ZWRcbi8vIGJhY2sgaW50byBBU0FQIHByb3Blci5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90aWxkZWlvL3JzdnAuanMvYmxvYi9jZGRmNzIzMjU0NmE5Y2Y4NTg1MjRiNzVjZGU2ZjllZGY3MjYyMGE3L2xpYi9yc3ZwL2FzYXAuanNcblxuJ3VzZSBzdHJpY3QnO1xuXG4vL3ZhciBhc2FwID0gcmVxdWlyZSgnYXNhcC9yYXcnKTtcbnZhciBhc2FwID0gcmF3QXNhcDtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8vIFN0YXRlczpcbi8vXG4vLyAwIC0gcGVuZGluZ1xuLy8gMSAtIGZ1bGZpbGxlZCB3aXRoIF92YWx1ZVxuLy8gMiAtIHJlamVjdGVkIHdpdGggX3ZhbHVlXG4vLyAzIC0gYWRvcHRlZCB0aGUgc3RhdGUgb2YgYW5vdGhlciBwcm9taXNlLCBfdmFsdWVcbi8vXG4vLyBvbmNlIHRoZSBzdGF0ZSBpcyBubyBsb25nZXIgcGVuZGluZyAoMCkgaXQgaXMgaW1tdXRhYmxlXG5cbi8vIEFsbCBgX2AgcHJlZml4ZWQgcHJvcGVydGllcyB3aWxsIGJlIHJlZHVjZWQgdG8gYF97cmFuZG9tIG51bWJlcn1gXG4vLyBhdCBidWlsZCB0aW1lIHRvIG9iZnVzY2F0ZSB0aGVtIGFuZCBkaXNjb3VyYWdlIHRoZWlyIHVzZS5cbi8vIFdlIGRvbid0IHVzZSBzeW1ib2xzIG9yIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0byBmdWxseSBoaWRlIHRoZW1cbi8vIGJlY2F1c2UgdGhlIHBlcmZvcm1hbmNlIGlzbid0IGdvb2QgZW5vdWdoLlxuXG5cbi8vIHRvIGF2b2lkIHVzaW5nIHRyeS9jYXRjaCBpbnNpZGUgY3JpdGljYWwgZnVuY3Rpb25zLCB3ZVxuLy8gZXh0cmFjdCB0aGVtIHRvIGhlcmUuXG52YXIgTEFTVF9FUlJPUiA9IG51bGw7XG52YXIgSVNfRVJST1IgPSB7fTtcbmZ1bmN0aW9uIGdldFRoZW4ob2JqKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG9iai50aGVuO1xuICB9IGNhdGNoIChleCkge1xuICAgIExBU1RfRVJST1IgPSBleDtcbiAgICByZXR1cm4gSVNfRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5Q2FsbE9uZShmbiwgYSkge1xuICB0cnkge1xuICAgIHJldHVybiBmbihhKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBMQVNUX0VSUk9SID0gZXg7XG4gICAgcmV0dXJuIElTX0VSUk9SO1xuICB9XG59XG5mdW5jdGlvbiB0cnlDYWxsVHdvKGZuLCBhLCBiKSB7XG4gIHRyeSB7XG4gICAgZm4oYSwgYik7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgTEFTVF9FUlJPUiA9IGV4O1xuICAgIHJldHVybiBJU19FUlJPUjtcbiAgfVxufVxuXG4vL21vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcblxuZnVuY3Rpb24gUHJvbWlzZShmbikge1xuICBpZiAodHlwZW9mIHRoaXMgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3Jyk7XG4gIH1cbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG4gIH1cbiAgdGhpcy5fNDEgPSAwO1xuICB0aGlzLl84NiA9IG51bGw7XG4gIHRoaXMuXzE3ID0gW107XG4gIGlmIChmbiA9PT0gbm9vcCkgcmV0dXJuO1xuICBkb1Jlc29sdmUoZm4sIHRoaXMpO1xufVxuUHJvbWlzZS5fMSA9IG5vb3A7XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICBpZiAodGhpcy5jb25zdHJ1Y3RvciAhPT0gUHJvbWlzZSkge1xuICAgIHJldHVybiBzYWZlVGhlbih0aGlzLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gIH1cbiAgdmFyIHJlcyA9IG5ldyBQcm9taXNlKG5vb3ApO1xuICBoYW5kbGUodGhpcywgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHJlcykpO1xuICByZXR1cm4gcmVzO1xufTtcblxuZnVuY3Rpb24gc2FmZVRoZW4oc2VsZiwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIG5ldyBzZWxmLmNvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVzID0gbmV3IFByb21pc2Uobm9vcCk7XG4gICAgcmVzLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICBoYW5kbGUoc2VsZiwgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHJlcykpO1xuICB9KTtcbn07XG5mdW5jdGlvbiBoYW5kbGUoc2VsZiwgZGVmZXJyZWQpIHtcbiAgd2hpbGUgKHNlbGYuXzQxID09PSAzKSB7XG4gICAgc2VsZiA9IHNlbGYuXzg2O1xuICB9XG4gIGlmIChzZWxmLl80MSA9PT0gMCkge1xuICAgIHNlbGYuXzE3LnB1c2goZGVmZXJyZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICBhc2FwKGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYiA9IHNlbGYuXzQxID09PSAxID8gZGVmZXJyZWQub25GdWxmaWxsZWQgOiBkZWZlcnJlZC5vblJlamVjdGVkO1xuICAgIGlmIChjYiA9PT0gbnVsbCkge1xuICAgICAgaWYgKHNlbGYuXzQxID09PSAxKSB7XG4gICAgICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fODYpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KGRlZmVycmVkLnByb21pc2UsIHNlbGYuXzg2KTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJldCA9IHRyeUNhbGxPbmUoY2IsIHNlbGYuXzg2KTtcbiAgICBpZiAocmV0ID09PSBJU19FUlJPUikge1xuICAgICAgcmVqZWN0KGRlZmVycmVkLnByb21pc2UsIExBU1RfRVJST1IpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHJldCk7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIHJlc29sdmUoc2VsZiwgbmV3VmFsdWUpIHtcbiAgLy8gUHJvbWlzZSBSZXNvbHV0aW9uIFByb2NlZHVyZTogaHR0cHM6Ly9naXRodWIuY29tL3Byb21pc2VzLWFwbHVzL3Byb21pc2VzLXNwZWMjdGhlLXByb21pc2UtcmVzb2x1dGlvbi1wcm9jZWR1cmVcbiAgaWYgKG5ld1ZhbHVlID09PSBzZWxmKSB7XG4gICAgcmV0dXJuIHJlamVjdChcbiAgICAgIHNlbGYsXG4gICAgICBuZXcgVHlwZUVycm9yKCdBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLicpXG4gICAgKTtcbiAgfVxuICBpZiAoXG4gICAgbmV3VmFsdWUgJiZcbiAgICAodHlwZW9mIG5ld1ZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgbmV3VmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICkge1xuICAgIHZhciB0aGVuID0gZ2V0VGhlbihuZXdWYWx1ZSk7XG4gICAgaWYgKHRoZW4gPT09IElTX0VSUk9SKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KHNlbGYsIExBU1RfRVJST1IpO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICB0aGVuID09PSBzZWxmLnRoZW4gJiZcbiAgICAgIG5ld1ZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZVxuICAgICkge1xuICAgICAgc2VsZi5fNDEgPSAzO1xuICAgICAgc2VsZi5fODYgPSBuZXdWYWx1ZTtcbiAgICAgIGZpbmFsZShzZWxmKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBkb1Jlc29sdmUodGhlbi5iaW5kKG5ld1ZhbHVlKSwgc2VsZik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHNlbGYuXzQxID0gMTtcbiAgc2VsZi5fODYgPSBuZXdWYWx1ZTtcbiAgZmluYWxlKHNlbGYpO1xufVxuXG5mdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbiAgc2VsZi5fNDEgPSAyO1xuICBzZWxmLl84NiA9IG5ld1ZhbHVlO1xuICBmaW5hbGUoc2VsZik7XG59XG5mdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuXzE3Lmxlbmd0aDsgaSsrKSB7XG4gICAgaGFuZGxlKHNlbGYsIHNlbGYuXzE3W2ldKTtcbiAgfVxuICBzZWxmLl8xNyA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb21pc2Upe1xuICB0aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiBudWxsO1xuICB0aGlzLm9uUmVqZWN0ZWQgPSB0eXBlb2Ygb25SZWplY3RlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uUmVqZWN0ZWQgOiBudWxsO1xuICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xufVxuXG4vKipcbiAqIFRha2UgYSBwb3RlbnRpYWxseSBtaXNiZWhhdmluZyByZXNvbHZlciBmdW5jdGlvbiBhbmQgbWFrZSBzdXJlXG4gKiBvbkZ1bGZpbGxlZCBhbmQgb25SZWplY3RlZCBhcmUgb25seSBjYWxsZWQgb25jZS5cbiAqXG4gKiBNYWtlcyBubyBndWFyYW50ZWVzIGFib3V0IGFzeW5jaHJvbnkuXG4gKi9cbmZ1bmN0aW9uIGRvUmVzb2x2ZShmbiwgcHJvbWlzZSkge1xuICB2YXIgZG9uZSA9IGZhbHNlO1xuICB2YXIgcmVzID0gdHJ5Q2FsbFR3byhmbiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gIH0pXG4gIGlmICghZG9uZSAmJiByZXMgPT09IElTX0VSUk9SKSB7XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVqZWN0KHByb21pc2UsIExBU1RfRVJST1IpO1xuICB9XG59XG5cbid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiAqIEBuYW1lIEltYWdlc1JlYWR5XG4gKiBAY29uc3RydWN0b3JcbiAqXG4gKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR8RWxlbWVudHxFbGVtZW50W118alF1ZXJ5fE5vZGVMaXN0fHN0cmluZ30gZWxlbWVudHNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0ganF1ZXJ5XG4gKlxuICovXG5mdW5jdGlvbiBJbWFnZXNSZWFkeShlbGVtZW50cywganF1ZXJ5KSB7XG4gIGlmICh0eXBlb2YgZWxlbWVudHMgPT09ICdzdHJpbmcnKSB7XG4gICAgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRzKTtcbiAgICBpZiAoIWVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZWxlY3RvciBgJyArIGVsZW1lbnRzICsgJ2AgeWllbGRlZCAwIGVsZW1lbnRzJyk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGRlZmVycmVkID0gZGVmZXIoanF1ZXJ5KTtcbiAgdGhpcy5yZXN1bHQgPSBkZWZlcnJlZC5wcm9taXNlO1xuXG4gIHZhciBpbWFnZXMgPSB0aGlzLmltYWdlRWxlbWVudHMoXG4gICAgdGhpcy52YWxpZEVsZW1lbnRzKHRoaXMudG9BcnJheShlbGVtZW50cyksIEltYWdlc1JlYWR5LlZBTElEX05PREVfVFlQRVMpXG4gICk7XG5cbiAgdmFyIGltYWdlQ291bnQgPSBpbWFnZXMubGVuZ3RoO1xuXG4gIGlmIChpbWFnZUNvdW50KSB7XG4gICAgdGhpcy52ZXJpZnkoaW1hZ2VzLCBzdGF0dXMoaW1hZ2VDb3VudCwgZnVuY3Rpb24ocmVhZHkpe1xuICAgICAgaWYgKHJlYWR5KSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoZWxlbWVudHMpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlbGVtZW50cyk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG4gIGVsc2Uge1xuICAgIGRlZmVycmVkLnJlc29sdmUoZWxlbWVudHMpO1xuICB9XG59XG5cblxuSW1hZ2VzUmVhZHkuVkFMSURfTk9ERV9UWVBFUyA9IHtcbiAgMSAgOiB0cnVlLCAvLyBFTEVNRU5UX05PREVcbiAgOSAgOiB0cnVlLCAvLyBET0NVTUVOVF9OT0RFXG4gIDExIDogdHJ1ZSAgLy8gRE9DVU1FTlRfRlJBR01FTlRfTk9ERVxufTtcblxuXG5JbWFnZXNSZWFkeS5wcm90b3R5cGUgPSB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbGVtZW50c1xuICAgKiBAcmV0dXJucyB7W118SFRNTEltYWdlRWxlbWVudFtdfVxuICAgKi9cbiAgaW1hZ2VFbGVtZW50cyA6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgdmFyIGltYWdlcyA9IFtdO1xuXG4gICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgIGlmIChlbGVtZW50Lm5vZGVOYW1lID09PSAnSU1HJykge1xuICAgICAgICBpbWFnZXMucHVzaChlbGVtZW50KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgaW1hZ2VFbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nJyk7XG4gICAgICAgIGlmIChpbWFnZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIGltYWdlcy5wdXNoLmFwcGx5KGltYWdlcywgaW1hZ2VFbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpbWFnZXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50W119IGVsZW1lbnRzXG4gICAqIEBwYXJhbSB7e319IHZhbGlkTm9kZVR5cGVzXG4gICAqIEByZXR1cm5zIHtbXXxFbGVtZW50W119XG4gICAqL1xuICB2YWxpZEVsZW1lbnRzIDogZnVuY3Rpb24oZWxlbWVudHMsIHZhbGlkTm9kZVR5cGVzKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgIHJldHVybiB2YWxpZE5vZGVUeXBlc1tlbGVtZW50Lm5vZGVUeXBlXTtcbiAgICB9KTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnRbXX0gaW1hZ2VzXG4gICAqIEByZXR1cm5zIHtbXXxIVE1MSW1hZ2VFbGVtZW50W119XG4gICAqL1xuICBpbmNvbXBsZXRlSW1hZ2VzIDogZnVuY3Rpb24oaW1hZ2VzKSB7XG4gICAgcmV0dXJuIGltYWdlcy5maWx0ZXIoZnVuY3Rpb24oaW1hZ2Upe1xuICAgICAgcmV0dXJuICEoaW1hZ2UuY29tcGxldGUgJiYgaW1hZ2UubmF0dXJhbFdpZHRoKTtcbiAgICB9KTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbmxvYWRcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb25lcnJvclxuICAgKiBAcmV0dXJucyB7ZnVuY3Rpb24oSFRNTEltYWdlRWxlbWVudCl9XG4gICAqL1xuICBwcm94eUltYWdlIDogZnVuY3Rpb24ob25sb2FkLCBvbmVycm9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICB2YXIgX2ltYWdlID0gbmV3IEltYWdlKCk7XG5cbiAgICAgIF9pbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25sb2FkKTtcbiAgICAgIF9pbWFnZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuICAgICAgX2ltYWdlLnNyYyA9IGltYWdlLnNyYztcblxuICAgICAgcmV0dXJuIF9pbWFnZTtcbiAgICB9O1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudFtdfSBpbWFnZXNcbiAgICogQHBhcmFtIHt7ZmFpbGVkOiBmdW5jdGlvbiwgbG9hZGVkOiBmdW5jdGlvbn19IHN0YXR1c1xuICAgKi9cbiAgdmVyaWZ5IDogZnVuY3Rpb24oaW1hZ2VzLCBzdGF0dXMpIHtcbiAgICB2YXIgaW5jb21wbGV0ZSA9IHRoaXMuaW5jb21wbGV0ZUltYWdlcyhpbWFnZXMpO1xuXG4gICAgaWYgKGltYWdlcy5sZW5ndGggPiBpbmNvbXBsZXRlLmxlbmd0aCkge1xuICAgICAgc3RhdHVzLmxvYWRlZChpbWFnZXMubGVuZ3RoIC0gaW5jb21wbGV0ZS5sZW5ndGgpO1xuICAgIH1cblxuICAgIGlmIChpbmNvbXBsZXRlLmxlbmd0aCkge1xuICAgICAgaW5jb21wbGV0ZS5mb3JFYWNoKHRoaXMucHJveHlJbWFnZShcbiAgICAgICAgZnVuY3Rpb24oKXtcbiAgICAgICAgICBzdGF0dXMubG9hZGVkKDEpO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpe1xuICAgICAgICAgIHN0YXR1cy5mYWlsZWQoMSk7XG4gICAgICAgIH1cbiAgICAgICkpO1xuICAgIH1cbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR8RWxlbWVudHxFbGVtZW50W118alF1ZXJ5fE5vZGVMaXN0fSBvYmplY3RcbiAgICogQHJldHVybnMge0VsZW1lbnRbXX1cbiAgICovXG4gIHRvQXJyYXkgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb2JqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKG9iamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtvYmplY3RdO1xuICB9XG5cbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ganF1ZXJ5XG4gKiBAcmV0dXJucyBkZWZlcnJlZFxuICovXG5mdW5jdGlvbiBkZWZlcihqcXVlcnkpIHtcbiAgdmFyIGRlZmVycmVkO1xuXG4gIGlmIChqcXVlcnkpIHtcbiAgICBkZWZlcnJlZCA9IG5ldyAkLkRlZmVycmVkKCk7XG4gICAgZGVmZXJyZWQucHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2UoKTtcbiAgfVxuICBlbHNlIHtcbiAgICBkZWZlcnJlZCA9IHt9O1xuICAgIGRlZmVycmVkLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICBkZWZlcnJlZC5yZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZGVmZXJyZWQ7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gaW1hZ2VDb3VudFxuICogQHBhcmFtIHtmdW5jdGlvbn0gZG9uZVxuICogQHJldHVybnMge3tmYWlsZWQ6IGZ1bmN0aW9uLCBsb2FkZWQ6IGZ1bmN0aW9ufX1cbiAqL1xuZnVuY3Rpb24gc3RhdHVzKGltYWdlQ291bnQsIGRvbmUpIHtcbiAgdmFyIGxvYWRlZCA9IDAsXG4gICAgICB0b3RhbCA9IGltYWdlQ291bnQsXG4gICAgICB2ZXJpZmllZCA9IDA7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIGlmICh0b3RhbCA9PT0gdmVyaWZpZWQpIHtcbiAgICAgIGRvbmUodG90YWwgPT09IGxvYWRlZCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudFxuICAgICAqL1xuICAgIGZhaWxlZCA6IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICB2ZXJpZmllZCArPSBjb3VudDtcbiAgICAgIHVwZGF0ZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKi9cbiAgICBsb2FkZWQgOiBmdW5jdGlvbihjb3VudCkge1xuICAgICAgbG9hZGVkICs9IGNvdW50O1xuICAgICAgdmVyaWZpZWQgKz0gY291bnQ7XG4gICAgICB1cGRhdGUoKTtcbiAgICB9XG5cbiAgfTtcbn1cblxuXG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGpRdWVyeSBwbHVnaW5cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5pZiAod2luZG93LmpRdWVyeSkge1xuICAkLmZuLmltYWdlc1JlYWR5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IEltYWdlc1JlYWR5KHRoaXMsIHRydWUpO1xuICAgIHJldHVybiBpbnN0YW5jZS5yZXN1bHQ7XG4gIH07XG59XG5cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgRGVmYXVsdCBlbnRyeSBwb2ludFxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIGltYWdlc1JlYWR5KGVsZW1lbnRzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIGluc3RhbmNlID0gbmV3IEltYWdlc1JlYWR5KGVsZW1lbnRzKTtcbiAgcmV0dXJuIGluc3RhbmNlLnJlc3VsdDtcbn1cblxucmV0dXJuIGltYWdlc1JlYWR5O1xufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaW1hZ2VzcmVhZHkvZGlzdC9pbWFnZXNyZWFkeS5qc1xuLy8gbW9kdWxlIGlkID0gNTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4qIFNlY3Rpb24gaGlnaGxpZ2h0ZXIgbW9kdWxlXG4qIEBtb2R1bGUgbW9kdWxlcy9zZWN0aW9uSGlnaGxpZ2h0ZXJcbiogQHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMjM5NTk4OC9oaWdobGlnaHQtbWVudS1pdGVtLXdoZW4tc2Nyb2xsaW5nLWRvd24tdG8tc2VjdGlvblxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciAkbmF2aWdhdGlvbkxpbmtzID0gJCgnLmpzLXNlY3Rpb24tc2V0ID4gbGkgPiBhJyk7XG4gIHZhciAkc2VjdGlvbnMgPSAkKFwic2VjdGlvblwiKTtcbiAgdmFyICRzZWN0aW9uc1JldmVyc2VkID0gJCgkKFwic2VjdGlvblwiKS5nZXQoKS5yZXZlcnNlKCkpO1xuICB2YXIgc2VjdGlvbklkVG9uYXZpZ2F0aW9uTGluayA9IHt9O1xuICAvL3ZhciBlVG9wID0gJCgnI2ZyZWUtZGF5LXRyaXBzJykub2Zmc2V0KCkudG9wO1xuXG4gICRzZWN0aW9ucy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIHNlY3Rpb25JZFRvbmF2aWdhdGlvbkxpbmtbJCh0aGlzKS5hdHRyKCdpZCcpXSA9ICQoJy5qcy1zZWN0aW9uLXNldCA+IGxpID4gYVtocmVmPVwiIycgKyAkKHRoaXMpLmF0dHIoJ2lkJykgKyAnXCJdJyk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIG9wdGltaXplZCgpIHtcbiAgICB2YXIgc2Nyb2xsUG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAkc2VjdGlvbnNSZXZlcnNlZC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGN1cnJlbnRTZWN0aW9uID0gJCh0aGlzKTtcbiAgICAgIHZhciBzZWN0aW9uVG9wID0gY3VycmVudFNlY3Rpb24ub2Zmc2V0KCkudG9wO1xuXG4gICAgICAvLyBpZihjdXJyZW50U2VjdGlvbi5pcygnc2VjdGlvbjpmaXJzdC1jaGlsZCcpICYmIHNlY3Rpb25Ub3AgPiBzY3JvbGxQb3NpdGlvbil7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCdzY3JvbGxQb3NpdGlvbicsIHNjcm9sbFBvc2l0aW9uKTtcbiAgICAgIC8vICAgY29uc29sZS5sb2coJ3NlY3Rpb25Ub3AnLCBzZWN0aW9uVG9wKTtcbiAgICAgIC8vIH1cblxuICAgICAgaWYgKHNjcm9sbFBvc2l0aW9uID49IHNlY3Rpb25Ub3AgfHwgKGN1cnJlbnRTZWN0aW9uLmlzKCdzZWN0aW9uOmZpcnN0LWNoaWxkJykgJiYgc2VjdGlvblRvcCA+IHNjcm9sbFBvc2l0aW9uKSkge1xuICAgICAgICB2YXIgaWQgPSBjdXJyZW50U2VjdGlvbi5hdHRyKCdpZCcpO1xuICAgICAgICB2YXIgJG5hdmlnYXRpb25MaW5rID0gc2VjdGlvbklkVG9uYXZpZ2F0aW9uTGlua1tpZF07XG4gICAgICAgIGlmICghJG5hdmlnYXRpb25MaW5rLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSB8fCAhJCgnc2VjdGlvbicpLmhhc0NsYXNzKCdvLWNvbnRlbnQtY29udGFpbmVyLS1jb21wYWN0JykpIHtcbiAgICAgICAgICAgICRuYXZpZ2F0aW9uTGlua3MucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJG5hdmlnYXRpb25MaW5rLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvcHRpbWl6ZWQoKTtcbiAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICBvcHRpbWl6ZWQoKTtcbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9zZWN0aW9uSGlnaGxpZ2h0ZXIuanMiLCIvKipcbiAqIFN0YXRpYyBjb2x1bW4gbW9kdWxlXG4gKiBTaW1pbGFyIHRvIHRoZSBnZW5lcmFsIHN0aWNreSBtb2R1bGUgYnV0IHVzZWQgc3BlY2lmaWNhbGx5IHdoZW4gb25lIGNvbHVtblxuICogb2YgYSB0d28tY29sdW1uIGxheW91dCBpcyBtZWFudCB0byBiZSBzdGlja3lcbiAqIEBtb2R1bGUgbW9kdWxlcy9zdGF0aWNDb2x1bW5cbiAqIEBzZWUgbW9kdWxlcy9zdGlja3lOYXZcbiAqL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBjb25zdCBzdGlja3lDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXN0YXRpYycpO1xuICBjb25zdCBub3RTdGlja3lDbGFzcyA9ICdpcy1ub3Qtc3RpY2t5JztcbiAgY29uc3QgYm90dG9tQ2xhc3MgPSAnaXMtYm90dG9tJztcblxuICAvKipcbiAgKiBDYWxjdWxhdGVzIHRoZSB3aW5kb3cgcG9zaXRpb24gYW5kIHNldHMgdGhlIGFwcHJvcHJpYXRlIGNsYXNzIG9uIHRoZSBlbGVtZW50XG4gICogQHBhcmFtIHtvYmplY3R9IHN0aWNreUNvbnRlbnRFbGVtIC0gRE9NIG5vZGUgdGhhdCBzaG91bGQgYmUgc3RpY2tpZWRcbiAgKi9cbiAgZnVuY3Rpb24gY2FsY1dpbmRvd1BvcyhzdGlja3lDb250ZW50RWxlbSkge1xuICAgIGxldCBlbGVtVG9wID0gc3RpY2t5Q29udGVudEVsZW0ucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgbGV0IGlzUGFzdEJvdHRvbSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHN0aWNreUNvbnRlbnRFbGVtLnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC0gc3RpY2t5Q29udGVudEVsZW0ucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPiAwO1xuXG4gICAgLy8gU2V0cyBlbGVtZW50IHRvIHBvc2l0aW9uIGFic29sdXRlIGlmIG5vdCBzY3JvbGxlZCB0byB5ZXQuXG4gICAgLy8gQWJzb2x1dGVseSBwb3NpdGlvbmluZyBvbmx5IHdoZW4gbmVjZXNzYXJ5IGFuZCBub3QgYnkgZGVmYXVsdCBwcmV2ZW50cyBmbGlja2VyaW5nXG4gICAgLy8gd2hlbiByZW1vdmluZyB0aGUgXCJpcy1ib3R0b21cIiBjbGFzcyBvbiBDaHJvbWVcbiAgICBpZiAoZWxlbVRvcCA+IDApIHtcbiAgICAgIHN0aWNreUNvbnRlbnRFbGVtLmNsYXNzTGlzdC5hZGQobm90U3RpY2t5Q2xhc3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGlja3lDb250ZW50RWxlbS5jbGFzc0xpc3QucmVtb3ZlKG5vdFN0aWNreUNsYXNzKTtcbiAgICB9XG4gICAgaWYgKGlzUGFzdEJvdHRvbSkge1xuICAgICAgc3RpY2t5Q29udGVudEVsZW0uY2xhc3NMaXN0LmFkZChib3R0b21DbGFzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0aWNreUNvbnRlbnRFbGVtLmNsYXNzTGlzdC5yZW1vdmUoYm90dG9tQ2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGlja3lDb250ZW50KSB7XG4gICAgZm9yRWFjaChzdGlja3lDb250ZW50LCBmdW5jdGlvbihzdGlja3lDb250ZW50RWxlbSkge1xuICAgICAgY2FsY1dpbmRvd1BvcyhzdGlja3lDb250ZW50RWxlbSk7XG5cbiAgICAgIC8qKlxuICAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yICdzY3JvbGwnLlxuICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgKi9cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY2FsY1dpbmRvd1BvcyhzdGlja3lDb250ZW50RWxlbSk7XG4gICAgICB9LCBmYWxzZSk7XG5cbiAgICAgIC8qKlxuICAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yICdyZXNpemUnLlxuICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgKi9cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY2FsY1dpbmRvd1BvcyhzdGlja3lDb250ZW50RWxlbSk7XG4gICAgICB9LCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3N0YXRpY0NvbHVtbi5qcyIsIi8qKlxuICogQWxlcnQgQmFubmVyIG1vZHVsZVxuICogQG1vZHVsZSBtb2R1bGVzL2FsZXJ0XG4gKiBAc2VlIG1vZHVsZXMvdG9nZ2xlT3BlblxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcbmltcG9ydCByZWFkQ29va2llIGZyb20gJy4vcmVhZENvb2tpZS5qcyc7XG5pbXBvcnQgZGF0YXNldCBmcm9tICcuL2RhdGFzZXQuanMnO1xuaW1wb3J0IGNyZWF0ZUNvb2tpZSBmcm9tICcuL2NyZWF0ZUNvb2tpZS5qcyc7XG5pbXBvcnQgZ2V0RG9tYWluIGZyb20gJy4vZ2V0RG9tYWluLmpzJztcblxuLyoqXG4gKiBEaXNwbGF5cyBhbiBhbGVydCBiYW5uZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gb3BlbkNsYXNzIC0gVGhlIGNsYXNzIHRvIHRvZ2dsZSBvbiBpZiBiYW5uZXIgaXMgdmlzaWJsZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcGVuQ2xhc3MpIHtcbiAgaWYgKCFvcGVuQ2xhc3MpIHtcbiAgICBvcGVuQ2xhc3MgPSAnaXMtb3Blbic7XG4gIH1cblxuICAvKipcbiAgKiBNYWtlIGFuIGFsZXJ0IHZpc2libGVcbiAgKiBAcGFyYW0ge29iamVjdH0gYWxlcnQgLSBET00gbm9kZSBvZiB0aGUgYWxlcnQgdG8gZGlzcGxheVxuICAqIEBwYXJhbSB7b2JqZWN0fSBzaWJsaW5nRWxlbSAtIERPTSBub2RlIG9mIGFsZXJ0J3MgY2xvc2VzdCBzaWJsaW5nLFxuICAqIHdoaWNoIGdldHMgc29tZSBleHRyYSBwYWRkaW5nIHRvIG1ha2Ugcm9vbSBmb3IgdGhlIGFsZXJ0XG4gICovXG4gIGZ1bmN0aW9uIGRpc3BsYXlBbGVydChhbGVydCwgc2libGluZ0VsZW0pIHtcbiAgICBhbGVydC5jbGFzc0xpc3QuYWRkKG9wZW5DbGFzcyk7XG4gICAgY29uc3QgYWxlcnRIZWlnaHQgPSBhbGVydC5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3QgY3VycmVudFBhZGRpbmcgPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShzaWJsaW5nRWxlbSkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1ib3R0b20nKSwgMTApO1xuICAgIHNpYmxpbmdFbGVtLnN0eWxlLnBhZGRpbmdCb3R0b20gPSAoYWxlcnRIZWlnaHQgKyBjdXJyZW50UGFkZGluZykgKyAncHgnO1xuICB9XG5cbiAgLyoqXG4gICogUmVtb3ZlIGV4dHJhIHBhZGRpbmcgZnJvbSBhbGVydCBzaWJsaW5nXG4gICogQHBhcmFtIHtvYmplY3R9IHNpYmxpbmdFbGVtIC0gRE9NIG5vZGUgb2YgYWxlcnQgc2libGluZ1xuICAqL1xuICBmdW5jdGlvbiByZW1vdmVBbGVydFBhZGRpbmcoc2libGluZ0VsZW0pIHtcbiAgICBzaWJsaW5nRWxlbS5zdHlsZS5wYWRkaW5nQm90dG9tID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAqIENoZWNrIGFsZXJ0IGNvb2tpZVxuICAqIEBwYXJhbSB7b2JqZWN0fSBhbGVydCAtIERPTSBub2RlIG9mIHRoZSBhbGVydFxuICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gV2hldGhlciBhbGVydCBjb29raWUgaXMgc2V0XG4gICovXG4gIGZ1bmN0aW9uIGNoZWNrQWxlcnRDb29raWUoYWxlcnQpIHtcbiAgICBjb25zdCBjb29raWVOYW1lID0gZGF0YXNldChhbGVydCwgJ2Nvb2tpZScpO1xuICAgIGlmICghY29va2llTmFtZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIHJlYWRDb29raWUoY29va2llTmFtZSwgZG9jdW1lbnQuY29va2llKSAhPT0gJ3VuZGVmaW5lZCc7XG4gIH1cblxuICAvKipcbiAgKiBBZGQgYWxlcnQgY29va2llXG4gICogQHBhcmFtIHtvYmplY3R9IGFsZXJ0IC0gRE9NIG5vZGUgb2YgdGhlIGFsZXJ0XG4gICovXG4gIGZ1bmN0aW9uIGFkZEFsZXJ0Q29va2llKGFsZXJ0KSB7XG4gICAgY29uc3QgY29va2llTmFtZSA9IGRhdGFzZXQoYWxlcnQsICdjb29raWUnKTtcbiAgICBpZiAoY29va2llTmFtZSkge1xuICAgICAgY3JlYXRlQ29va2llKGNvb2tpZU5hbWUsICdkaXNtaXNzZWQnLCBnZXREb21haW4od2luZG93LmxvY2F0aW9uLCBmYWxzZSksIDM2MCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYWxlcnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWFsZXJ0Jyk7XG4gIGlmIChhbGVydHMubGVuZ3RoKSB7XG4gICAgZm9yRWFjaChhbGVydHMsIGZ1bmN0aW9uKGFsZXJ0KSB7XG4gICAgICBpZiAoIWNoZWNrQWxlcnRDb29raWUoYWxlcnQpKSB7XG4gICAgICAgIGNvbnN0IGFsZXJ0U2libGluZyA9IGFsZXJ0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGRpc3BsYXlBbGVydChhbGVydCwgYWxlcnRTaWJsaW5nKTtcblxuICAgICAgICAvKipcbiAgICAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yICdjaGFuZ2VPcGVuU3RhdGUnLlxuICAgICAgICAqIFRoZSB2YWx1ZSBvZiBldmVudC5kZXRhaWwgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIG9wZW4gc3RhdGUgaXMgdHJ1ZVxuICAgICAgICAqIChpLmUuIHRoZSBhbGVydCBpcyB2aXNpYmxlKS5cbiAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAgICovXG4gICAgICAgIGFsZXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZU9wZW5TdGF0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgLy8gQmVjYXVzZSBpT1Mgc2FmYXJpIGluZXhwbGljYWJseSB0dXJucyBldmVudC5kZXRhaWwgaW50byBhbiBvYmplY3RcbiAgICAgICAgICBpZiAoKHR5cGVvZiBldmVudC5kZXRhaWwgPT09ICdib29sZWFuJyAmJiAhZXZlbnQuZGV0YWlsKSB8fFxuICAgICAgICAgICAgKHR5cGVvZiBldmVudC5kZXRhaWwgPT09ICdvYmplY3QnICYmICFldmVudC5kZXRhaWwuZGV0YWlsKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYWRkQWxlcnRDb29raWUoYWxlcnQpO1xuICAgICAgICAgICAgcmVtb3ZlQWxlcnRQYWRkaW5nKGFsZXJ0U2libGluZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvYWxlcnQuanMiLCIvKipcbiogUmVhZHMgYSBjb29raWUgYW5kIHJldHVybnMgdGhlIHZhbHVlXG4qIEBwYXJhbSB7c3RyaW5nfSBjb29raWVOYW1lIC0gTmFtZSBvZiB0aGUgY29va2llXG4qIEBwYXJhbSB7c3RyaW5nfSBjb29raWUgLSBGdWxsIGxpc3Qgb2YgY29va2llc1xuKiBAcmV0dXJuIHtzdHJpbmd9IC0gVmFsdWUgb2YgY29va2llOyB1bmRlZmluZWQgaWYgY29va2llIGRvZXMgbm90IGV4aXN0XG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29va2llTmFtZSwgY29va2llKSB7XG4gIHJldHVybiAoUmVnRXhwKFwiKD86Xnw7IClcIiArIGNvb2tpZU5hbWUgKyBcIj0oW147XSopXCIpLmV4ZWMoY29va2llKSB8fCBbXSkucG9wKCk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9yZWFkQ29va2llLmpzIiwiLyoqXG4qIFNhdmUgYSBjb29raWVcbiogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBDb29raWUgbmFtZVxuKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBDb29raWUgdmFsdWVcbiogQHBhcmFtIHtzdHJpbmd9IGRvbWFpbiAtIERvbWFpbiBvbiB3aGljaCB0byBzZXQgY29va2llXG4qIEBwYXJhbSB7aW50ZWdlcn0gZGF5cyAtIE51bWJlciBvZiBkYXlzIGJlZm9yZSBjb29raWUgZXhwaXJlc1xuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBkb21haW4sIGRheXMpIHtcbiAgY29uc3QgZXhwaXJlcyA9IGRheXMgPyBcIjsgZXhwaXJlcz1cIiArIChuZXcgRGF0ZShkYXlzICogODY0RTUgKyAobmV3IERhdGUoKSkuZ2V0VGltZSgpKSkudG9HTVRTdHJpbmcoKSA6IFwiXCI7XG4gIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIHZhbHVlICsgZXhwaXJlcyArIFwiOyBwYXRoPS87IGRvbWFpbj1cIiArIGRvbWFpbjtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2NyZWF0ZUNvb2tpZS5qcyIsIi8qKlxuKiBHZXQgdGhlIGRvbWFpbiBmcm9tIGEgVVJMXG4qIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgVVJMXG4qIEBwYXJhbSB7Ym9vbGVhbn0gcm9vdCAtIFdoZXRoZXIgdG8gcmV0dXJuIHRoZSByb290IGRvbWFpbiByYXRoZXIgdGhhbiBhIHN1YmRvbWFpblxuKiBAcmV0dXJuIHtzdHJpbmd9IC0gVGhlIHBhcnNlZCBkb21haW5cbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih1cmwsIHJvb3QpIHtcbiAgZnVuY3Rpb24gcGFyc2VVcmwodXJsKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIHRhcmdldC5ocmVmID0gdXJsO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICBpZiAodHlwZW9mIHVybCA9PT0gJ3N0cmluZycpIHtcbiAgICB1cmwgPSBwYXJzZVVybCh1cmwpO1xuICB9XG4gIGxldCBkb21haW4gPSB1cmwuaG9zdG5hbWU7XG4gIGlmIChyb290KSB7XG4gICAgY29uc3Qgc2xpY2UgPSBkb21haW4ubWF0Y2goL1xcLnVrJC8pID8gLTMgOiAtMjtcbiAgICBkb21haW4gPSBkb21haW4uc3BsaXQoXCIuXCIpLnNsaWNlKHNsaWNlKS5qb2luKFwiLlwiKTtcbiAgfVxuICByZXR1cm4gZG9tYWluO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvZ2V0RG9tYWluLmpzIiwiLyoqXG4qIFZhbGlkYXRlIGEgZm9ybSBhbmQgc3VibWl0IHZpYSB0aGUgc2lnbnVwIEFQSVxuKi9cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHppcGNvZGVzIGZyb20gJy4vZGF0YS96aXBjb2Rlcy5qc29uJ1xuaW1wb3J0IGZvcm1FcnJvcnMgZnJvbSAnLi9kYXRhL2Zvcm0tZXJyb3JzLmpzb24nXG4gIFxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIC8vIGNvbnN0ICRzaWdudXBGb3JtcyA9ICQoJy5ndW55LXNpZ251cCcpO1xuICBjb25zdCBlcnJvck1zZyA9ICdQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCBhbmQgemlwIGNvZGUgYW5kIHNlbGVjdCBhdCBsZWFzdCBvbmUgYWdlIGdyb3VwLic7XG5cbiAgLyoqXG4gICogVmFsaWRhdGUgZm9ybSBmaWVsZHNcbiAgKiBAcGFyYW0ge29iamVjdH0gZm9ybURhdGEgLSBmb3JtIGZpZWxkc1xuICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIGV2ZW50IG9iamVjdFxuICAqL1xuICBmdW5jdGlvbiB2YWxpZGF0ZUZpZWxkcyhmb3JtLCBldmVudCkge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IGZpZWxkcyA9IGZvcm0uc2VyaWFsaXplQXJyYXkoKS5yZWR1Y2UoKG9iaiwgaXRlbSkgPT4gKG9ialtpdGVtLm5hbWVdID0gaXRlbS52YWx1ZSwgb2JqKSAse30pXG4gICAgY29uc3QgcmVxdWlyZWRGaWVsZHMgPSBmb3JtLmZpbmQoJ1tyZXF1aXJlZF0nKTtcbiAgICBjb25zdCBlbWFpbFJlZ2V4ID0gbmV3IFJlZ0V4cCgvXFxTK0BcXFMrXFwuXFxTKy8pO1xuICAgIGNvbnN0IHppcFJlZ2V4ID0gbmV3IFJlZ0V4cCgvXlxcZHs1fSgtXFxkezR9KT8kL2kpO1xuICAgIGNvbnN0IHBob25lUmVnZXggPSBuZXcgUmVnRXhwKC9eW1xcK10/WyhdP1swLTldezN9WyldP1stXFxzXFwuXT9bMC05XXszfVstXFxzXFwuXT9bMC05XXs0LDZ9JC9pbSk7XG4gICAgbGV0IGdyb3VwU2VsZXRlZCA9IE9iamVjdC5rZXlzKGZpZWxkcykuZmluZChhID0+YS5pbmNsdWRlcyhcImdyb3VwXCIpKT8gdHJ1ZSA6IGZhbHNlO1xuICAgIGxldCBoYXNFcnJvcnMgPSBmYWxzZTtcblxuICAgIC8vIGxvb3AgdGhyb3VnaCBlYWNoIHJlcXVpcmVkIGZpZWxkXG4gICAgcmVxdWlyZWRGaWVsZHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGZpZWxkTmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnaXMtZXJyb3InKTtcblxuICAgICAgaWYoKHR5cGVvZiBmaWVsZHNbZmllbGROYW1lXSA9PT0gJ3VuZGVmaW5lZCcpICYmICFncm91cFNlbGV0ZWQpIHtcbiAgICAgICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCdmaWVsZHNldCcpLmZpbmQoJy5ndW55LWVycm9yLWRldGFpbGVkJykuaHRtbCgnPHA+UGxlYXNlIHNlbGVjdCBmcm9tIHRoZSBsaXN0IGJlbG93LjwvcD4nKTs7XG5cbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtZXJyb3InKTtcbiAgICAgIH1cblxuICAgICAgaWYoKGZpZWxkTmFtZSA9PSAnRU1BSUwnICYmICFlbWFpbFJlZ2V4LnRlc3QoZmllbGRzLkVNQUlMKSkgfHwgXG4gICAgICAgIChmaWVsZE5hbWUgPT0gJ1pJUCcgJiYgIXppcFJlZ2V4LnRlc3QoZmllbGRzLlpJUCkpIHx8XG4gICAgICAgIChmaWVsZE5hbWUgPT0gJ1BIT05FTlVNJyAmJiAhcGhvbmVSZWdleC50ZXN0KGZpZWxkcy5QSE9ORU5VTSkgJiYgZmllbGRzLlBIT05FTlVNLmxlbmd0aCAhPTApXG4gICAgICApIHtcbiAgICAgICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmd1bnktZXJyb3ItZGV0YWlsZWQnKS5odG1sKCc8cD4nICsgZm9ybUVycm9ycy5maW5kKHggPT4geFtmaWVsZE5hbWVdKVtmaWVsZE5hbWVdICsgJzwvcD4nKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtZXJyb3InKTtcbiAgICAgIH1cblxuICAgICAgLy8gYXNzaWduIHRoZSBjb3JyZWN0IGJvcm91Z2ggdG8gZ29vZCB6aXBcbiAgICAgIGlmKChmaWVsZE5hbWUgPT0gJ0VNQUlMJyAmJiBlbWFpbFJlZ2V4LnRlc3QoZmllbGRzLkVNQUlMKSkpe1xuICAgICAgICBmaWVsZHMuQk9ST1VHSCA9IGFzc2lnbkJvcm91Z2goZmllbGRzLlpJUCk7XG4gICAgICB9XG5cbiAgICAgIGlmKChmaWVsZE5hbWUgIT0gJ0VNQUlMJykgJiYgKGZpZWxkTmFtZSAhPSAnWklQJykgJiYgKGZpZWxkTmFtZSAhPSAnUEhPTkVOVU0nKSAmJiBmaWVsZHNbZmllbGROYW1lXSA9PT0gXCJcIlxuICAgICAgKSB7XG4gICAgICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgICAgICQodGhpcykuc2libGluZ3MoJy5ndW55LWVycm9yLWRldGFpbGVkJykuaHRtbCgnPHA+JyArIGZvcm1FcnJvcnMuZmluZCh4ID0+IHhbZmllbGROYW1lXSlbZmllbGROYW1lXSArICc8L3A+Jyk7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2lzLWVycm9yJyk7XG4gICAgICB9XG5cbiAgICB9KTtcblxuICAgIC8vIGlmIHRoZXJlIGFyZSBubyBlcnJvcnMsIHN1Ym1pdFxuICAgIGlmIChoYXNFcnJvcnMpIHtcbiAgICAgIGZvcm0uZmluZCgnLmd1bnktZXJyb3InKS5odG1sKGA8cD4ke2Vycm9yTXNnfTwvcD5gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VibWl0U2lnbnVwKGZvcm0sIGZpZWxkcyk7XG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgKiBBc3NpZ25zIHRoZSBib3JvdWdoIGJhc2VkIG9uIHRoZSB6aXAgY29kZVxuICAqIEBwYXJhbSB7c3RyaW5nfSB6aXAgLSB6aXAgY29kZVxuICAqL1xuICBmdW5jdGlvbiBhc3NpZ25Cb3JvdWdoKHppcCl7XG4gICAgbGV0IGJvcm91Z2ggPSAnJztcbiAgICBsZXQgaW5kZXggPSB6aXBjb2Rlcy5maW5kSW5kZXgoeCA9PiB4LmNvZGVzLmluZGV4T2YocGFyc2VJbnQoemlwKSkgPiAtMSk7XG5cbiAgICBpZihpbmRleCA9PT0gLTEpe1xuICAgICAgYm9yb3VnaCA9IFwiTWFuaGF0dGFuXCI7XG4gICAgfWVsc2Uge1xuICAgICAgYm9yb3VnaCA9IHppcGNvZGVzW2luZGV4XS5ib3JvdWdoO1xuICAgIH1cblxuICAgIHJldHVybiBib3JvdWdoO1xuICB9XG5cbiAgLyoqXG4gICogU3VibWl0cyB0aGUgZm9ybSBvYmplY3QgdG8gTWFpbGNoaW1wXG4gICogQHBhcmFtIHtvYmplY3R9IGZvcm1EYXRhIC0gZm9ybSBmaWVsZHNcbiAgKi9cbiAgZnVuY3Rpb24gc3VibWl0U2lnbnVwKGZvcm0sIGZvcm1EYXRhKXtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiBmb3JtLmF0dHIoJ2FjdGlvbicpLFxuICAgICAgdHlwZTogZm9ybS5hdHRyKCdtZXRob2QnKSxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsLy9ubyBqc29ucFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5yZXN1bHQgIT09ICdzdWNjZXNzJyl7XG4gICAgICAgICAgaWYoZm9ybVswXS5jbGFzc05hbWUuaW5kZXhPZignY29udGFjdCcpID4gLTEpe1xuICAgICAgICAgICAgaWYocmVzcG9uc2UubXNnLmluY2x1ZGVzKCdhbHJlYWR5IHN1YnNjcmliZWQnKSl7XG4gICAgICAgICAgICAgIGZvcm0uaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPllvdSBoYXZlIGFscmVhZHkgcmVhY2hlZCBvdXQgdG8gdXMuIFdlIHdpbGwgZ2V0IGJhY2sgdG8geW91IGFzIHNvb24gYXMgcG9zc2libGUhPC9wPicpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICBmb3JtLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1jZW50ZXJcIj5Tb21ldGhpbmcgd2VudCB3cm9uZy4gVHJ5IGFnYWluIGxhdGVyITwvcD4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBpZihyZXNwb25zZS5tc2cuaW5jbHVkZXMoJ3RvbyBtYW55IHJlY2VudCBzaWdudXAgcmVxdWVzdHMnKSl7XG4gICAgICAgICAgICAgIGZvcm0uZmluZCgnLmd1bnktZXJyb3InKS5odG1sKCc8cCBjbGFzcz1cInRleHQtY2VudGVyXCI+VGhlcmUgd2FzIGEgcHJvYmxlbSB3aXRoIHlvdXIgc3Vic2NyaXB0aW9uLjwvcD4nKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlLm1zZy5pbmNsdWRlcygnYWxyZWFkeSBzdWJzY3JpYmVkJykpe1xuICAgICAgICAgICAgICBmb3JtLmZpbmQoJy5ndW55LWVycm9yJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPllvdSBhcmUgYWxyZWFkeSBzaWduZWQgdXAgZm9yIHVwZGF0ZXMhIENoZWNrIHlvdXIgZW1haWwuPC9wPicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgIGlmKGZvcm1bMF0uY2xhc3NOYW1lLmluZGV4T2YoJ2NvbnRhY3QnKSA+IC0xKXtcbiAgICAgICAgICAgIGZvcm0uaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPlRoYW5rIHlvdSBmb3IgY29udGFjdGluZyB1cyEgU29tZW9uZSB3aWxsIHJlc3BvbmQgdG8geW91IHNob3J0bHkuPC9wPicpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZm9ybS5odG1sKCc8cCBjbGFzcz1cImMtc2lnbnVwLWZvcm1fX3N1Y2Nlc3NcIj5PbmUgbW9yZSBzdGVwISA8YnIgLz4gUGxlYXNlIGNoZWNrIHlvdXIgaW5ib3ggYW5kIGNvbmZpcm0geW91ciBlbWFpbCBhZGRyZXNzIHRvIHN0YXJ0IHJlY2VpdmluZyB1cGRhdGVzLiA8YnIgLz5UaGFua3MgZm9yIHNpZ25pbmcgdXAhPC9wPicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBmb3JtLmZpbmQoJy5ndW55LWVycm9yJykuaHRtbCgnPHA+VGhlcmUgd2FzIGEgcHJvYmxlbSB3aXRoIHlvdXIgc3Vic2NyaXB0aW9uLiBDaGVjayBiYWNrIGxhdGVyLjwvcD4nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAqIFRyaWdnZXJzIGZvcm0gdmFsaWRhdGlvbiBhbmQgc2VuZHMgdGhlIGZvcm0gZGF0YSB0byBNYWlsY2hpbXBcbiAgKiBAcGFyYW0ge29iamVjdH0gZm9ybURhdGEgLSBmb3JtIGZpZWxkc1xuICAqL1xuICAkKCdidXR0b25bdHlwZT1cInN1Ym1pdFwiXScpLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCBmb3JtQ2xhc3MgPSAkKHRoaXMpLnBhcmVudHMoJ2Zvcm0nKS5hdHRyKCdjbGFzcycpO1xuICAgIGxldCAkZm9ybSA9ICQoJy4nICsgZm9ybUNsYXNzKTtcbiAgICB2YWxpZGF0ZUZpZWxkcygkZm9ybSwgZXZlbnQpO1xuICB9KTtcblxuICAvKipcbiAgKiBDaGVja2luZyBjaGFyYWN0ZXJzIGFnYWluc3QgdGhlIDI1NSBjaGFyIGxpbWl0XG4gICovXG4gICQoJy50ZXh0YXJlYScpLmtleXVwKGZ1bmN0aW9uKCl7XG4gICAgbGV0IGNoYXJMZW4gPSAyNTUgLSAkKHRoaXMpLnZhbCgpLmxlbmd0aDtcbiAgICAkKCcuY2hhci1jb3VudCcpLnRleHQoJ0NoYXJhY3RlcnMgbGVmdDogJyArIGNoYXJMZW4pO1xuICAgIGlmKGNoYXJMZW4gPCAwKXtcbiAgICAgICQoJy5jaGFyLWNvdW50JykuY3NzKFwiY29sb3JcIiwgJyNkODAwNmQnKTtcbiAgICAgICQodGhpcykuY3NzKFwiYm9yZGVyLWNvbG9yXCIsICcjZDgwMDZkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJy5jaGFyLWNvdW50JykuY3NzKFwiY29sb3JcIiwgJyMzMzMnKTtcbiAgICAgICQodGhpcykuY3NzKFwiYm9yZGVyLWNvbG9yXCIsICcjMjc5M2UwJyk7XG4gICAgfVxuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL25ld3NsZXR0ZXItc2lnbnVwLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBbe1wiYm9yb3VnaFwiOlwiQnJvbnhcIixcImNvZGVzXCI6WzEwNDUxLDEwNDUyLDEwNDUzLDEwNDU0LDEwNDU1LDEwNDU2LDEwNDU3LDEwNDU4LDEwNDU5LDEwNDYwLDEwNDYxLDEwNDYyLDEwNDYzLDEwNDY0LDEwNDY1LDEwNDY2LDEwNDY3LDEwNDY4LDEwNDY5LDEwNDcwLDEwNDcxLDEwNDcyLDEwNDczLDEwNDc0LDEwNDc1XX0se1wiYm9yb3VnaFwiOlwiQnJvb2tseW5cIixcImNvZGVzXCI6WzExMjAxLDExMjAyLDExMjAzLDExMjA0LDExMjA1LDExMjA2LDExMjA3LDExMjA4LDExMjA5LDExMjEwLDExMjExLDExMjEyLDExMjEzLDExMjE0LDExMjE1LDExMjE2LDExMjE3LDExMjE4LDExMjE5LDExMjIwLDExMjIxLDExMjIyLDExMjIzLDExMjI0LDExMjI1LDExMjI2LDExMjI4LDExMjI5LDExMjMwLDExMjMxLDExMjMyLDExMjMzLDExMjM0LDExMjM1LDExMjM2LDExMjM3LDExMjM4LDExMjM5LDExMjQxLDExMjQyLDExMjQzLDExMjQ1LDExMjQ3LDExMjQ5LDExMjUxLDExMjUyLDExMjU2XX0se1wiYm9yb3VnaFwiOlwiTWFuaGF0dGFuXCIsXCJjb2Rlc1wiOlsxMDAwMSwxMDAwMiwxMDAwMywxMDAwNCwxMDAwNSwxMDAwNiwxMDAwNywxMDAwOCwxMDAwOSwxMDAxMCwxMDAxMSwxMDAxMiwxMDAxMywxMDAxNCwxMDAxNiwxMDAxNywxMDAxOCwxMDAxOSwxMDAyMCwxMDAyMSwxMDAyMiwxMDAyMywxMDAyNCwxMDAyNSwxMDAyNywxMDAyOCwxMDAyOSwxMDAzMCwxMDAzMSwxMDAzMiwxMDAzMywxMDAzNCwxMDAzNSwxMDAzNiwxMDAzNywxMDAzOCwxMDAzOSwxMDA0MCwxMDA0MSwxMDA0NSwxMDA1NSwxMDA4MSwxMDA4NywxMDEwMSwxMDEwMywxMDEwNCwxMDEwNSwxMDEwNiwxMDEwNywxMDEwOCwxMDEwOSwxMDExMCwxMDExMSwxMDExMiwxMDExMywxMDExNCwxMDExNSwxMDExNiwxMDExOCwxMDExOSwxMDEyMCwxMDEyMSwxMDEyMiwxMDEyMywxMDEyOCwxMDE1MCwxMDE1MSwxMDE1MiwxMDE1MywxMDE1NCwxMDE1NSwxMDE1NiwxMDE1OCwxMDE1OSwxMDE2MiwxMDE2NSwxMDE2NiwxMDE2NywxMDE2OCwxMDE2OSwxMDE3MCwxMDE3MSwxMDE3MiwxMDE3MywxMDE3NCwxMDE3NSwxMDE3NiwxMDE3NywxMDE3OCwxMDE4NSwxMDE5OSwxMDIxMiwxMDI0OSwxMDI1NiwxMDI1OSwxMDI2MSwxMDI2OCwxMDI3MCwxMDI3MSwxMDI3NiwxMDI3OCwxMDI3OSwxMDI4MCwxMDI4MSwxMDI4MiwxMDI4Nl19LHtcImJvcm91Z2hcIjpcIlF1ZWVuc1wiLFwiY29kZXNcIjpbMTExMDEsMTExMDIsMTExMDMsMTExMDQsMTExMDYsMTExMDksMTExMjAsMTEzNTEsMTEzNTIsMTEzNTQsMTEzNTUsMTEzNTYsMTEzNTcsMTEzNTgsMTEzNTksMTEzNjAsMTEzNjEsMTEzNjIsMTEzNjMsMTEzNjQsMTEzNjUsMTEzNjYsMTEzNjcsMTEzNjgsMTEzNjksMTEzNzAsMTEzNzEsMTEzNzIsMTEzNzMsMTEzNzQsMTEzNzUsMTEzNzcsMTEzNzgsMTEzNzksMTEzODAsMTEzODEsMTEzODUsMTEzODYsMTE0MDUsMTE0MTEsMTE0MTMsMTE0MTQsMTE0MTUsMTE0MTYsMTE0MTcsMTE0MTgsMTE0MTksMTE0MjAsMTE0MjEsMTE0MjIsMTE0MjMsMTE0MjQsMTE0MjUsMTE0MjYsMTE0MjcsMTE0MjgsMTE0MjksMTE0MzAsMTE0MzEsMTE0MzIsMTE0MzMsMTE0MzQsMTE0MzUsMTE0MzYsMTE0MzksMTE0NTEsMTE2OTAsMTE2OTEsMTE2OTIsMTE2OTMsMTE2OTQsMTE2OTUsMTE2OTddfSx7XCJib3JvdWdoXCI6XCJTdGF0ZW4gSXNsYW5kXCIsXCJjb2Rlc1wiOlsxMDMwMSwxMDMwMiwxMDMwMywxMDMwNCwxMDMwNSwxMDMwNiwxMDMwNywxMDMwOCwxMDMwOSwxMDMxMCwxMDMxMSwxMDMxMiwxMDMxMywxMDMxNF19XVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL21vZHVsZXMvZGF0YS96aXBjb2Rlcy5qc29uXG4vLyBtb2R1bGUgaWQgPSA2MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFt7XCJFTUFJTFwiOlwiUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwuXCJ9LHtcIkZOQU1FXCI6XCJQbGVhc2UgZW50ZXIgeW91ciBmaXJzdCBuYW1lLlwifSx7XCJMTkFNRVwiOlwiUGxlYXNlIGVudGVyIHlvdXIgbGFzdCBuYW1lLlwifSx7XCJaSVBcIjpcIlBsZWFzZSBlbnRlciBhIHZhbGlkIFVTIHppcCBjb2RlLlwifSx7XCJQSE9ORU5VTVwiOlwiUGxlYXNlIGVudGVyIGEgdmFsaWQgcGhvbmUgbnVtYmVyLlwifSx7XCJNRVNTQUdFXCI6XCJQbGVhc2UgZW50ZXIgYSBtZXNzYWdlLiBMaW1pdGVkIHRvIDI1NSBjaGFyYWN0ZXJzLlwifSx7XCJHUk9VUFwiOlwiUGxlYXNlIHNlbGVjdCBvbmUuXCJ9XVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL21vZHVsZXMvZGF0YS9mb3JtLWVycm9ycy5qc29uXG4vLyBtb2R1bGUgaWQgPSA2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiogRm9ybSBFZmZlY3RzIG1vZHVsZVxuKiBAbW9kdWxlIG1vZHVsZXMvZm9ybUVmZmVjdHNcbiogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29kcm9wcy9UZXh0SW5wdXRFZmZlY3RzL2Jsb2IvbWFzdGVyL2luZGV4Mi5odG1sXG4qL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5pbXBvcnQgZGlzcGF0Y2hFdmVudCBmcm9tICcuL2Rpc3BhdGNoRXZlbnQuanMnO1xuXG4vKipcbiogVXRpbGl0eSBmdW5jdGlvbiB0byBzZXQgYW4gJ2lzLWZpbGxlZCcgY2xhc3Mgb24gaW5wdXRzIHRoYXQgYXJlIGZvY3VzZWQgb3JcbiogY29udGFpbiB0ZXh0LiBDYW4gdGhlbiBiZSB1c2VkIHRvIGFkZCBlZmZlY3RzIHRvIHRoZSBmb3JtLCBzdWNoIGFzIG1vdmluZ1xuKiB0aGUgbGFiZWwuXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIC8qKlxuICAqIEFkZCB0aGUgZmlsbGVkIGNsYXNzIHdoZW4gaW5wdXQgaXMgZm9jdXNlZFxuICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlRm9jdXMoZXZlbnQpIHtcbiAgICBjb25zdCB3cmFwcGVyRWxlbSA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlO1xuICAgIHdyYXBwZXJFbGVtLmNsYXNzTGlzdC5hZGQoJ2lzLWZpbGxlZCcpO1xuICB9XG5cbiAgLyoqXG4gICogUmVtb3ZlIHRoZSBmaWxsZWQgY2xhc3Mgd2hlbiBpbnB1dCBpcyBibHVycmVkIGlmIGl0IGRvZXMgbm90IGNvbnRhaW4gdGV4dFxuICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlQmx1cihldmVudCkge1xuICAgIGlmIChldmVudC50YXJnZXQudmFsdWUudHJpbSgpID09PSAnJykge1xuICAgICAgY29uc3Qgd3JhcHBlckVsZW0gPSBldmVudC50YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgIHdyYXBwZXJFbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWZpbGxlZCcpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaWdudXAtZm9ybV9fZmllbGQnKTtcbiAgaWYgKGlucHV0cy5sZW5ndGgpIHtcbiAgICBmb3JFYWNoKGlucHV0cywgZnVuY3Rpb24oaW5wdXRFbGVtKSB7XG4gICAgICBpbnB1dEVsZW0uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBoYW5kbGVGb2N1cyk7XG4gICAgICBpbnB1dEVsZW0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGhhbmRsZUJsdXIpO1xuICAgICAgZGlzcGF0Y2hFdmVudChpbnB1dEVsZW0sICdibHVyJyk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2Zvcm1FZmZlY3RzLmpzIiwiLyoqXG4qIENyb3NzLWJyb3dzZXIgdXRpbGl0eSB0byBmaXJlIGV2ZW50c1xuKiBAcGFyYW0ge29iamVjdH0gZWxlbSAtIERPTSBlbGVtZW50IHRvIGZpcmUgZXZlbnQgb25cbiogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIEV2ZW50IHR5cGUsIGkuZS4gJ3Jlc2l6ZScsICdjbGljaydcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihlbGVtLCBldmVudFR5cGUpIHtcbiAgbGV0IGV2ZW50O1xuICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcbiAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG4gICAgZXZlbnQuaW5pdEV2ZW50KGV2ZW50VHlwZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgZWxlbS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfSBlbHNlIHtcbiAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gICAgZWxlbS5maXJlRXZlbnQoJ29uJyArIGV2ZW50VHlwZSwgZXZlbnQpO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9kaXNwYXRjaEV2ZW50LmpzIiwiLyoqXG4qIEZhY2V0V1AgRXZlbnQgSGFuZGxpbmdcbiogUmVxdWlyZXMgZnJvbnQuanMsIHdoaWNoIGlzIGFkZGVkIGJ5IHRoZSBGYWNldFdQIHBsdWdpblxuKiBBbHNvIHJlcXVpcmVzIGpRdWVyeSBhcyBGYWNldFdQIGl0c2VsZiByZXF1aXJlcyBqUXVlcnlcbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICAkKGRvY3VtZW50KS5vbignZmFjZXR3cC1yZWZyZXNoJywgZnVuY3Rpb24oKSB7XG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdmYWNldHdwLWlzLWxvYWRlZCcpLmFkZENsYXNzKCdmYWNldHdwLWlzLWxvYWRpbmcnKTtcbiAgICAkKCdodG1sLCBib2R5Jykuc2Nyb2xsVG9wKDApO1xuICB9KTtcblxuICAkKGRvY3VtZW50KS5vbignZmFjZXR3cC1sb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2ZhY2V0d3AtaXMtbG9hZGluZycpLmFkZENsYXNzKCdmYWNldHdwLWlzLWxvYWRlZCcpO1xuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2ZhY2V0cy5qcyIsIi8qKlxyXG4qIE93bCBTZXR0aW5ncyBtb2R1bGVcclxuKiBAbW9kdWxlIG1vZHVsZXMvb3dsU2V0dGluZ3NcclxuKiBAc2VlIGh0dHBzOi8vb3dsY2Fyb3VzZWwyLmdpdGh1Yi5pby9Pd2xDYXJvdXNlbDIvaW5kZXguaHRtbFxyXG4qL1xyXG5cclxuLyoqXHJcbiogb3dsIGNhcm91c2VsIHNldHRpbmdzIGFuZCB0byBtYWtlIHRoZSBvd2wgY2Fyb3VzZWwgd29yay5cclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcbiAgdmFyIG93bCA9ICQoJy5vd2wtY2Fyb3VzZWwnKTtcclxuICBvd2wub3dsQ2Fyb3VzZWwoe1xyXG4gICAgYW5pbWF0ZUluOiAnZmFkZUluJyxcclxuICAgIGFuaW1hdGVPdXQ6ICdmYWRlT3V0JyxcclxuICAgIGl0ZW1zOjEsXHJcbiAgICBsb29wOnRydWUsXHJcbiAgICBtYXJnaW46MCxcclxuICAgIGRvdHM6IHRydWUsXHJcbiAgICBhdXRvcGxheTp0cnVlLFxyXG4gICAgYXV0b3BsYXlUaW1lb3V0OjUwMDAsXHJcbiAgICBhdXRvcGxheUhvdmVyUGF1c2U6dHJ1ZVxyXG4gIH0pO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvb3dsU2V0dGluZ3MuanMiLCIvKipcbiogaU9TNyBpUGFkIEhhY2tcbiogZm9yIGhlcm8gaW1hZ2UgZmxpY2tlcmluZyBpc3N1ZS5cbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBhZDsuKkNQVS4qT1MgN19cXGQvaSkpIHtcbiAgICAkKCcuYy1zaWRlLWhlcm8nKS5oZWlnaHQod2luZG93LmlubmVySGVpZ2h0KTtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2lPUzdIYWNrLmpzIiwiLyogZXNsaW50LWVudiBicm93c2VyICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgQ29va2llcyBmcm9tICdqcy1jb29raWUnO1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi4vdmVuZG9yL3V0aWxpdHkuanMnO1xuaW1wb3J0IENsZWF2ZSBmcm9tICdjbGVhdmUuanMvZGlzdC9jbGVhdmUubWluJztcbmltcG9ydCAnY2xlYXZlLmpzL2Rpc3QvYWRkb25zL2NsZWF2ZS1waG9uZS51cyc7XG5cbi8qIGVzbGludCBuby11bmRlZjogXCJvZmZcIiAqL1xuY29uc3QgVmFyaWFibGVzID0gcmVxdWlyZSgnLi4vLi4vdmFyaWFibGVzLmpzb24nKTtcblxuLyoqXG4gKiBUaGlzIGNvbXBvbmVudCBoYW5kbGVzIHZhbGlkYXRpb24gYW5kIHN1Ym1pc3Npb24gZm9yIHNoYXJlIGJ5IGVtYWlsIGFuZFxuICogc2hhcmUgYnkgU01TIGZvcm1zLlxuLyoqXG4qIEFkZHMgZnVuY3Rpb25hbGl0eSB0byB0aGUgaW5wdXQgaW4gdGhlIHNlYXJjaCByZXN1bHRzIGhlYWRlclxuKi9cblxuY2xhc3MgU2hhcmVGb3JtIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGh0bWwgZm9ybSBlbGVtZW50IGZvciB0aGUgY29tcG9uZW50LlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsKSB7XG4gICAgLyoqIEBwcml2YXRlIHtIVE1MRWxlbWVudH0gVGhlIGNvbXBvbmVudCBlbGVtZW50LiAqL1xuICAgIHRoaXMuX2VsID0gZWw7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhpcyBmb3JtIGlzIHZhbGlkLiAqL1xuICAgIHRoaXMuX2lzVmFsaWQgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZm9ybSBpcyBjdXJyZW50bHkgc3VibWl0dGluZy4gKi9cbiAgICB0aGlzLl9pc0J1c3kgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZm9ybSBpcyBkaXNhYmxlZC4gKi9cbiAgICB0aGlzLl9pc0Rpc2FibGVkID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhpcyBjb21wb25lbnQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICovXG4gICAgdGhpcy5faW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZ29vZ2xlIHJlQ0FQVENIQSB3aWRnZXQgaXMgcmVxdWlyZWQuICovXG4gICAgdGhpcy5fcmVjYXB0Y2hhUmVxdWlyZWQgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZ29vZ2xlIHJlQ0FQVENIQSB3aWRnZXQgaGFzIHBhc3NlZC4gKi9cbiAgICB0aGlzLl9yZWNhcHRjaGFWZXJpZmllZCA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoZSBnb29nbGUgcmVDQVBUQ0hBIHdpZGdldCBpcyBpbml0aWxhaXNlZC4gKi9cbiAgICB0aGlzLl9yZWNhcHRjaGFpbml0ID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhpcyBjb21wb25lbnQgaGFzIG5vdCB5ZXQgYmVlbiBpbml0aWFsaXplZCwgYXR0YWNoZXMgZXZlbnQgbGlzdGVuZXJzLlxuICAgKiBAbWV0aG9kXG4gICAqIEByZXR1cm4ge3RoaXN9IFNoYXJlRm9ybVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICBpZiAodGhpcy5faW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuX2VsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJ0ZWxcIl0nKTtcblxuICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgdGhpcy5fbWFza1Bob25lKHNlbGVjdGVkKTtcbiAgICB9XG5cbiAgICAkKGAuJHtTaGFyZUZvcm0uQ3NzQ2xhc3MuU0hPV19ESVNDTEFJTUVSfWApXG4gICAgICAub24oJ2ZvY3VzJywgKCkgPT4ge1xuICAgICAgICB0aGlzLl9kaXNjbGFpbWVyKHRydWUpO1xuICAgICAgfSk7XG5cbiAgICAkKHRoaXMuX2VsKS5vbignc3VibWl0JywgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAodGhpcy5fcmVjYXB0Y2hhUmVxdWlyZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlY2FwdGNoYVZlcmlmaWVkKSB7XG4gICAgICAgICAgdGhpcy5fdmFsaWRhdGUoKTtcbiAgICAgICAgICBpZiAodGhpcy5faXNWYWxpZCAmJiAhdGhpcy5faXNCdXN5ICYmICF0aGlzLl9pc0Rpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9zdWJtaXQoKTtcbiAgICAgICAgICAgIHdpbmRvdy5ncmVjYXB0Y2hhLnJlc2V0KCk7XG4gICAgICAgICAgICAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpLmFkZENsYXNzKCdyZWNhcHRjaGEtanMnKTtcbiAgICAgICAgICAgIHRoaXMuX3JlY2FwdGNoYVZlcmlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQodGhpcy5fZWwpLmZpbmQoYC4ke1NoYXJlRm9ybS5Dc3NDbGFzcy5FUlJPUl9NU0d9YCkucmVtb3ZlKCk7XG4gICAgICAgICAgdGhpcy5fc2hvd0Vycm9yKFNoYXJlRm9ybS5NZXNzYWdlLlJFQ0FQVENIQSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlKCk7XG4gICAgICAgIGlmICh0aGlzLl9pc1ZhbGlkICYmICF0aGlzLl9pc0J1c3kgJiYgIXRoaXMuX2lzRGlzYWJsZWQpIHtcbiAgICAgICAgICB0aGlzLl9zdWJtaXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAvLyBEZXRlcm1pbmUgd2hldGhlciBvciBub3QgdG8gaW5pdGlhbGl6ZSBSZUNBUFRDSEEuIFRoaXMgc2hvdWxkIGJlXG4gICAgICAvLyAvLyBpbml0aWFsaXplZCBvbmx5IG9uIGV2ZXJ5IDEwdGggdmlldyB3aGljaCBpcyBkZXRlcm1pbmVkIHZpYSBhblxuICAgICAgLy8gLy8gaW5jcmVtZW50aW5nIGNvb2tpZS5cbiAgICAgIGxldCB2aWV3Q291bnQgPSBDb29raWVzLmdldCgnc2NyZWVuZXJWaWV3cycpID9cbiAgICAgICAgcGFyc2VJbnQoQ29va2llcy5nZXQoJ3NjcmVlbmVyVmlld3MnKSwgMTApIDogMTtcbiAgICAgIGlmICh2aWV3Q291bnQgPj0gNSAmJiAhdGhpcy5fcmVjYXB0Y2hhaW5pdCkge1xuICAgICAgICAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpLmFkZENsYXNzKCdyZWNhcHRjaGEtanMnKTtcbiAgICAgICAgdGhpcy5faW5pdFJlY2FwdGNoYSgpO1xuICAgICAgICB0aGlzLl9yZWNhcHRjaGFpbml0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIENvb2tpZXMuc2V0KCdzY3JlZW5lclZpZXdzJywgKyt2aWV3Q291bnQsIHtleHBpcmVzOiAoMi8xNDQwKX0pO1xuXG4gICAgICAkKFwiI3Bob25lXCIpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoJ3BsYWNlaG9sZGVyJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIC8vIERldGVybWluZSB3aGV0aGVyIG9yIG5vdCB0byBpbml0aWFsaXplIFJlQ0FQVENIQS4gVGhpcyBzaG91bGQgYmVcbiAgICAvLyAvLyBpbml0aWFsaXplZCBvbmx5IG9uIGV2ZXJ5IDEwdGggdmlldyB3aGljaCBpcyBkZXRlcm1pbmVkIHZpYSBhblxuICAgIC8vIC8vIGluY3JlbWVudGluZyBjb29raWUuXG4gICAgbGV0IHZpZXdDb3VudCA9IENvb2tpZXMuZ2V0KCdzY3JlZW5lclZpZXdzJykgP1xuICAgICAgcGFyc2VJbnQoQ29va2llcy5nZXQoJ3NjcmVlbmVyVmlld3MnKSwgMTApIDogMTtcbiAgICBpZiAodmlld0NvdW50ID49IDUgJiYgIXRoaXMuX3JlY2FwdGNoYWluaXQgKSB7XG4gICAgICAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpLmFkZENsYXNzKCdyZWNhcHRjaGEtanMnKTtcbiAgICAgIHRoaXMuX2luaXRSZWNhcHRjaGEoKTtcbiAgICAgIHRoaXMuX3JlY2FwdGNoYWluaXQgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFzayBlYWNoIHBob25lIG51bWJlciBhbmQgcHJvcGVybHkgZm9ybWF0IGl0XG4gICAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBpbnB1dCB0aGUgXCJ0ZWxcIiBpbnB1dCB0byBtYXNrXG4gICAqIEByZXR1cm4ge2NvbnN0cnVjdG9yfSAgICAgICB0aGUgaW5wdXQgbWFza1xuICAgKi9cbiAgX21hc2tQaG9uZShpbnB1dCkge1xuICAgIGxldCBjbGVhdmUgPSBuZXcgQ2xlYXZlKGlucHV0LCB7XG4gICAgICBwaG9uZTogdHJ1ZSxcbiAgICAgIHBob25lUmVnaW9uQ29kZTogJ3VzJyxcbiAgICAgIGRlbGltaXRlcjogJy0nXG4gICAgfSk7XG4gICAgaW5wdXQuY2xlYXZlID0gY2xlYXZlO1xuICAgIHJldHVybiBpbnB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBkaXNjbGFpbWVyIHZpc2liaWxpdHlcbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gdmlzaWJsZSAtIHdldGhlciB0aGUgZGlzY2xhaW1lciBzaG91bGQgYmUgdmlzaWJsZSBvciBub3RcbiAgICovXG4gIF9kaXNjbGFpbWVyKHZpc2libGUgPSB0cnVlKSB7XG4gICAgbGV0ICRlbCA9ICQoJyNqcy1kaXNjbGFpbWVyJyk7XG4gICAgbGV0ICRjbGFzcyA9ICh2aXNpYmxlKSA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnO1xuICAgICRlbC5hdHRyKCdhcmlhLWhpZGRlbicsICF2aXNpYmxlKTtcbiAgICAkZWwuYXR0cihTaGFyZUZvcm0uQ3NzQ2xhc3MuSElEREVOLCAhdmlzaWJsZSk7XG4gICAgJGVsWyRjbGFzc10oU2hhcmVGb3JtLkNzc0NsYXNzLkFOSU1BVEVfRElTQ0xBSU1FUik7XG4gICAgLy8gU2Nyb2xsLXRvIGZ1bmN0aW9uYWxpdHkgZm9yIG1vYmlsZVxuICAgIGlmIChcbiAgICAgIHdpbmRvdy5zY3JvbGxUbyAmJlxuICAgICAgdmlzaWJsZSAmJlxuICAgICAgd2luZG93LmlubmVyV2lkdGggPCBWYXJpYWJsZXNbJ3NjcmVlbi1kZXNrdG9wJ11cbiAgICApIHtcbiAgICAgIGxldCAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oXG4gICAgICAgIDAsICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gJHRhcmdldC5kYXRhKCdzY3JvbGxPZmZzZXQnKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUnVucyB2YWxpZGF0aW9uIHJ1bGVzIGFuZCBzZXRzIHZhbGlkaXR5IG9mIGNvbXBvbmVudC5cbiAgICogQG1ldGhvZFxuICAgKiBAcmV0dXJuIHt0aGlzfSBTaGFyZUZvcm1cbiAgICovXG4gIF92YWxpZGF0ZSgpIHtcbiAgICBsZXQgdmFsaWRpdHkgPSB0cnVlO1xuICAgIGNvbnN0ICR0ZWwgPSAkKHRoaXMuX2VsKS5maW5kKCdpbnB1dFt0eXBlPVwidGVsXCJdJyk7XG4gICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIGVycm9yIG1lc3NhZ2VzLlxuICAgICQodGhpcy5fZWwpLmZpbmQoYC4ke1NoYXJlRm9ybS5Dc3NDbGFzcy5FUlJPUl9NU0d9YCkucmVtb3ZlKCk7XG5cbiAgICBpZiAoJHRlbC5sZW5ndGgpIHtcbiAgICAgIHZhbGlkaXR5ID0gdGhpcy5fdmFsaWRhdGVQaG9uZU51bWJlcigkdGVsWzBdKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1ZhbGlkID0gdmFsaWRpdHk7XG4gICAgaWYgKHRoaXMuX2lzVmFsaWQpIHtcbiAgICAgICQodGhpcy5fZWwpLnJlbW92ZUNsYXNzKFNoYXJlRm9ybS5Dc3NDbGFzcy5FUlJPUik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBhIGdpdmVuIGlucHV0LCBjaGVja3MgdG8gc2VlIGlmIGl0cyB2YWx1ZSBpcyBhIHZhbGlkIFBob25lbnVtYmVyLiBJZiBub3QsXG4gICAqIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgYW5kIHNldHMgYW4gZXJyb3IgY2xhc3Mgb24gdGhlIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGlucHV0IC0gVGhlIGh0bWwgZm9ybSBlbGVtZW50IGZvciB0aGUgY29tcG9uZW50LlxuICAgKiBAcmV0dXJuIHtib29sZWFufSAtIFZhbGlkIGVtYWlsLlxuICAgKi9cbiAgX3ZhbGlkYXRlUGhvbmVOdW1iZXIoaW5wdXQpe1xuICAgIGxldCBudW0gPSB0aGlzLl9wYXJzZVBob25lTnVtYmVyKGlucHV0LnZhbHVlKTsgLy8gcGFyc2UgdGhlIG51bWJlclxuICAgIG51bSA9IChudW0pID8gbnVtLmpvaW4oJycpIDogMDsgLy8gaWYgbnVtIGlzIG51bGwsIHRoZXJlIGFyZSBubyBudW1iZXJzXG4gICAgaWYgKG51bS5sZW5ndGggPT09IDEwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTsgLy8gYXNzdW1lIGl0IGlzIHBob25lIG51bWJlclxuICAgIH1cbiAgICB0aGlzLl9zaG93RXJyb3IoU2hhcmVGb3JtLk1lc3NhZ2UuUEhPTkUpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyB2YXIgcGhvbmVubyA9IC9eXFwrPyhbMC05XXsyfSlcXCk/Wy0uIF0/KFswLTldezR9KVstLiBdPyhbMC05XXs0fSkkLztcbiAgICAvLyB2YXIgcGhvbmVubyA9ICgvXlxcKz9bMS05XVxcZHsxLDE0fSQvKTtcbiAgICAvLyBpZighaW5wdXQudmFsdWUubWF0Y2gocGhvbmVubykpe1xuICAgIC8vICAgdGhpcy5fc2hvd0Vycm9yKFNoYXJlRm9ybS5NZXNzYWdlLlBIT05FKTtcbiAgICAvLyAgIHJldHVybiBmYWxzZTtcbiAgICAvLyB9XG4gICAgLy8gcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGp1c3QgdGhlIHBob25lIG51bWJlciBvZiBhIGdpdmVuIHZhbHVlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdmFsdWUgVGhlIHN0cmluZyB0byBnZXQgbnVtYmVycyBmcm9tXG4gICAqIEByZXR1cm4ge2FycmF5fSAgICAgICBBbiBhcnJheSB3aXRoIG1hdGNoZWQgYmxvY2tzXG4gICAqL1xuICBfcGFyc2VQaG9uZU51bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXRjaCgvXFxkKy9nKTsgLy8gZ2V0IG9ubHkgZGlnaXRzXG4gIH1cblxuICAvKipcbiAgICogRm9yIGEgZ2l2ZW4gaW5wdXQsIGNoZWNrcyB0byBzZWUgaWYgaXQgaGFzIGEgdmFsdWUuIElmIG5vdCwgZGlzcGxheXMgYW5cbiAgICogZXJyb3IgbWVzc2FnZSBhbmQgc2V0cyBhbiBlcnJvciBjbGFzcyBvbiB0aGUgZWxlbWVudC5cbiAgICogQG1ldGhvZFxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpbnB1dCAtIFRoZSBodG1sIGZvcm0gZWxlbWVudCBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gLSBWYWxpZCByZXF1aXJlZCBmaWVsZC5cbiAgICovXG4gIF92YWxpZGF0ZVJlcXVpcmVkKGlucHV0KSB7XG4gICAgaWYgKCQoaW5wdXQpLnZhbCgpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5fc2hvd0Vycm9yKFNoYXJlRm9ybS5NZXNzYWdlLlJFUVVJUkVEKTtcbiAgICAkKGlucHV0KS5vbmUoJ2tleXVwJywgZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgYnkgYXBwZW5kaW5nIGEgZGl2IHRvIHRoZSBmb3JtLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnIC0gRXJyb3IgbWVzc2FnZSB0byBkaXNwbGF5LlxuICAgKiBAcmV0dXJuIHt0aGlzfSBTaGFyZUZvcm0gLSBzaGFyZWZvcm1cbiAgICovXG4gIF9zaG93RXJyb3IobXNnKSB7XG4gICAgbGV0ICRlbFBhcmVudHMgPSAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpO1xuICAgICQoJyNzbXMtZm9ybS1tc2cnKS5hZGRDbGFzcyhTaGFyZUZvcm0uQ3NzQ2xhc3MuRVJST1IpLnRleHQoVXRpbGl0eS5sb2NhbGl6ZShtc2cpKTtcbiAgICAkZWxQYXJlbnRzLnJlbW92ZUNsYXNzKCdzdWNjZXNzLWpzJyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIFwic3VjY2Vzc1wiIGNsYXNzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnIC0gRXJyb3IgbWVzc2FnZSB0byBkaXNwbGF5LlxuICAgKiBAcmV0dXJuIHt0aGlzfSBTaGFyZUZvcm1cbiAgICovXG4gIF9zaG93U3VjY2Vzcyhtc2cpIHtcbiAgICBsZXQgJGVsUGFyZW50cyA9ICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJyk7XG4gICAgJCgnI3Bob25lJykuYXR0cihcInBsYWNlaG9sZGVyXCIsIFV0aWxpdHkubG9jYWxpemUobXNnKSk7XG4gICAgJCgnI3Ntc2J1dHRvbicpLnRleHQoXCJTZW5kIEFub3RoZXJcIik7XG4gICAgJCgnI3Ntcy1mb3JtLW1zZycpLmFkZENsYXNzKFNoYXJlRm9ybS5Dc3NDbGFzcy5TVUNDRVNTKS50ZXh0KCcnKTtcbiAgICAkZWxQYXJlbnRzLnJlbW92ZUNsYXNzKCdzdWNjZXNzLWpzJyk7XG4gICAgJGVsUGFyZW50cy5hZGRDbGFzcygnc3VjY2Vzcy1qcycpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Ym1pdHMgdGhlIGZvcm0uXG4gICAqIEByZXR1cm4ge2pxWEhSfSBkZWZlcnJlZCByZXNwb25zZSBvYmplY3RcbiAgICovXG4gIF9zdWJtaXQoKSB7XG4gICAgdGhpcy5faXNCdXN5ID0gdHJ1ZTtcbiAgICBsZXQgJHNwaW5uZXIgPSB0aGlzLl9lbC5xdWVyeVNlbGVjdG9yKGAuJHtTaGFyZUZvcm0uQ3NzQ2xhc3MuU1BJTk5FUn1gKTtcbiAgICBsZXQgJHN1Ym1pdCA9IHRoaXMuX2VsLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJyk7XG4gICAgY29uc3QgcGF5bG9hZCA9ICQodGhpcy5fZWwpLnNlcmlhbGl6ZSgpO1xuICAgICQodGhpcy5fZWwpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICBpZiAoJHNwaW5uZXIpIHtcbiAgICAgICRzdWJtaXQuZGlzYWJsZWQgPSB0cnVlOyAvLyBoaWRlIHN1Ym1pdCBidXR0b25cbiAgICAgICRzcGlubmVyLnN0eWxlLmNzc1RleHQgPSAnJzsgLy8gc2hvdyBzcGlubmVyXG4gICAgfVxuICAgIHJldHVybiAkLnBvc3QoJCh0aGlzLl9lbCkuYXR0cignYWN0aW9uJyksIHBheWxvYWQpLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy5fZWwucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fc2hvd1N1Y2Nlc3MoU2hhcmVGb3JtLk1lc3NhZ2UuU1VDQ0VTUyk7XG4gICAgICAgIHRoaXMuX2lzRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAkKHRoaXMuX2VsKS5vbmUoJ2tleXVwJywgJ2lucHV0JywgKCkgPT4ge1xuICAgICAgICAgICQodGhpcy5fZWwpLnJlbW92ZUNsYXNzKFNoYXJlRm9ybS5Dc3NDbGFzcy5TVUNDRVNTKTtcbiAgICAgICAgICB0aGlzLl9pc0Rpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2hvd0Vycm9yKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLm1lc3NhZ2UpKTtcbiAgICAgIH1cbiAgICB9KS5mYWlsKGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fc2hvd0Vycm9yKFNoYXJlRm9ybS5NZXNzYWdlLlNFUlZFUik7XG4gICAgfSkuYWx3YXlzKCgpID0+IHtcbiAgICAgICQodGhpcy5fZWwpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICBpZiAoJHNwaW5uZXIpIHtcbiAgICAgICAgJHN1Ym1pdC5kaXNhYmxlZCA9IGZhbHNlOyAvLyBzaG93IHN1Ym1pdCBidXR0b25cbiAgICAgICAgJHNwaW5uZXIuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJzsgLy8gaGlkZSBzcGlubmVyO1xuICAgICAgfVxuICAgICAgdGhpcy5faXNCdXN5ID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXN5bmNocm9ub3VzbHkgbG9hZHMgdGhlIEdvb2dsZSByZWNhcHRjaGEgc2NyaXB0IGFuZCBzZXRzIGNhbGxiYWNrcyBmb3JcbiAgICogbG9hZCwgc3VjY2VzcywgYW5kIGV4cGlyYXRpb24uXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge3RoaXN9IFNjcmVlbmVyXG4gICAqL1xuICBfaW5pdFJlY2FwdGNoYSgpIHtcbiAgICBjb25zdCAkc2NyaXB0ID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKSk7XG4gICAgJHNjcmlwdC5hdHRyKCdzcmMnLFxuICAgICAgICAnaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9yZWNhcHRjaGEvYXBpLmpzJyArXG4gICAgICAgICc/b25sb2FkPXNjcmVlbmVyQ2FsbGJhY2smcmVuZGVyPWV4cGxpY2l0JykucHJvcCh7XG4gICAgICBhc3luYzogdHJ1ZSxcbiAgICAgIGRlZmVyOiB0cnVlXG4gICAgfSk7XG5cbiAgICB3aW5kb3cuc2NyZWVuZXJDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHdpbmRvdy5ncmVjYXB0Y2hhLnJlbmRlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuZXItcmVjYXB0Y2hhJyksIHtcbiAgICAgICAgJ3NpdGVrZXknIDogJzZMZWtJQ1lVQUFBQUFPUjJ1WjBhanlXdDlYeER1c3BIUFVBa1J6QUInLFxuICAgICAgICAvL0JlbG93IGlzIHRoZSBsb2NhbCBob3N0IGtleVxuICAgICAgICAvLyAnc2l0ZWtleScgOiAnNkxjQUFDWVVBQUFBQVBtdHZRdkJ3Szg5aW1NM1Fmb3RKRkhmU204QycsXG4gICAgICAgICdjYWxsYmFjayc6ICdzY3JlZW5lclJlY2FwdGNoYScsXG4gICAgICAgICdleHBpcmVkLWNhbGxiYWNrJzogJ3NjcmVlbmVyUmVjYXB0Y2hhUmVzZXQnXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlY2FwdGNoYVJlcXVpcmVkID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgd2luZG93LnNjcmVlbmVyUmVjYXB0Y2hhID0gKCkgPT4ge1xuICAgICAgdGhpcy5fcmVjYXB0Y2hhVmVyaWZpZWQgPSB0cnVlO1xuICAgICAgJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKS5yZW1vdmVDbGFzcygncmVjYXB0Y2hhLWpzJyk7XG4gICAgfTtcblxuICAgIHdpbmRvdy5zY3JlZW5lclJlY2FwdGNoYVJlc2V0ID0gKCkgPT4ge1xuICAgICAgdGhpcy5fcmVjYXB0Y2hhVmVyaWZpZWQgPSBmYWxzZTtcbiAgICAgICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJykuYWRkQ2xhc3MoJ3JlY2FwdGNoYS1qcycpO1xuICAgIH07XG5cbiAgICB0aGlzLl9yZWNhcHRjaGFSZXF1aXJlZCA9IHRydWU7XG4gICAgJCgnaGVhZCcpLmFwcGVuZCgkc2NyaXB0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKipcbiAqIENTUyBjbGFzc2VzIHVzZWQgYnkgdGhpcyBjb21wb25lbnQuXG4gKiBAZW51bSB7c3RyaW5nfVxuICovXG5TaGFyZUZvcm0uQ3NzQ2xhc3MgPSB7XG4gIEVSUk9SOiAnZXJyb3InLFxuICBFUlJPUl9NU0c6ICdlcnJvci1tZXNzYWdlJyxcbiAgRk9STTogJ2pzLXNoYXJlLWZvcm0nLFxuICBTSE9XX0RJU0NMQUlNRVI6ICdqcy1zaG93LWRpc2NsYWltZXInLFxuICBORUVEU19ESVNDTEFJTUVSOiAnanMtbmVlZHMtZGlzY2xhaW1lcicsXG4gIEFOSU1BVEVfRElTQ0xBSU1FUjogJ2FuaW1hdGVkIGZhZGVJblVwJyxcbiAgSElEREVOOiAnaGlkZGVuJyxcbiAgU1VCTUlUX0JUTjogJ2J0bi1zdWJtaXQnLFxuICBTVUNDRVNTOiAnc3VjY2VzcycsXG4gIFNQSU5ORVI6ICdqcy1zcGlubmVyJ1xufTtcblxuLyoqXG4gKiBMb2NhbGl6YXRpb24gbGFiZWxzIG9mIGZvcm0gbWVzc2FnZXMuXG4gKiBAZW51bSB7c3RyaW5nfVxuICovXG5TaGFyZUZvcm0uTWVzc2FnZSA9IHtcbiAgRU1BSUw6ICdFUlJPUl9FTUFJTCcsXG4gIFBIT05FOiAnSW52YWxpZCBNb2JpbGUgTnVtYmVyJyxcbiAgUkVRVUlSRUQ6ICdFUlJPUl9SRVFVSVJFRCcsXG4gIFNFUlZFUjogJ0VSUk9SX1NFUlZFUicsXG4gIFNVQ0NFU1M6ICdNZXNzYWdlIHNlbnQhJyxcbiAgUkVDQVBUQ0hBIDogJ1BsZWFzZSBmaWxsIHRoZSByZUNBUFRDSEEnXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZUZvcm07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9zaGFyZS1mb3JtLmpzIiwiLyohXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llXG4gKlxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG5cdHZhciByZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSBmYWxzZTtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XG5cdFx0dmFyIE9sZENvb2tpZXMgPSB3aW5kb3cuQ29va2llcztcblx0XHR2YXIgYXBpID0gd2luZG93LkNvb2tpZXMgPSBmYWN0b3J5KCk7XG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR3aW5kb3cuQ29va2llcyA9IE9sZENvb2tpZXM7XG5cdFx0XHRyZXR1cm4gYXBpO1xuXHRcdH07XG5cdH1cbn0oZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gYXJndW1lbnRzWyBpIF07XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xuXHRcdGZ1bmN0aW9uIGFwaSAoa2V5LCB2YWx1ZSwgYXR0cmlidXRlcykge1xuXHRcdFx0dmFyIHJlc3VsdDtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV3JpdGVcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZXMgPSBleHRlbmQoe1xuXHRcdFx0XHRcdHBhdGg6ICcvJ1xuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdHZhciBleHBpcmVzID0gbmV3IERhdGUoKTtcblx0XHRcdFx0XHRleHBpcmVzLnNldE1pbGxpc2Vjb25kcyhleHBpcmVzLmdldE1pbGxpc2Vjb25kcygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBleHBpcmVzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gV2UncmUgdXNpbmcgXCJleHBpcmVzXCIgYmVjYXVzZSBcIm1heC1hZ2VcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSByZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXG5cdFx0XHRcdGlmICghY29udmVydGVyLndyaXRlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHZhbHVlKSlcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlID0gY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0a2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhrZXkpKTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9bXFwoXFwpXS9nLCBlc2NhcGUpO1xuXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcblxuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0XHRpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJz0nICsgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9IGtleSArICc9JyArIHZhbHVlICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVhZFxuXG5cdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRyZXN1bHQgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuXHRcdFx0Ly8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuIEFsc28gcHJldmVudHMgb2RkIHJlc3VsdCB3aGVuXG5cdFx0XHQvLyBjYWxsaW5nIFwiZ2V0KClcIlxuXHRcdFx0dmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcblx0XHRcdHZhciByZGVjb2RlID0gLyglWzAtOUEtWl17Mn0pKy9nO1xuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0XHR2YXIgY29va2llID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5qc29uICYmIGNvb2tpZS5jaGFyQXQoMCkgPT09ICdcIicpIHtcblx0XHRcdFx0XHRjb29raWUgPSBjb29raWUuc2xpY2UoMSwgLTEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgbmFtZSA9IHBhcnRzWzBdLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0XHRjb29raWUgPSBjb252ZXJ0ZXIucmVhZCA/XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXIucmVhZChjb29raWUsIG5hbWUpIDogY29udmVydGVyKGNvb2tpZSwgbmFtZSkgfHxcblx0XHRcdFx0XHRcdGNvb2tpZS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5qc29uKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGNvb2tpZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRbbmFtZV0gPSBjb29raWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGFwaS5zZXQgPSBhcGk7XG5cdFx0YXBpLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBhcGkuY2FsbChhcGksIGtleSk7XG5cdFx0fTtcblx0XHRhcGkuZ2V0SlNPTiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBhcGkuYXBwbHkoe1xuXHRcdFx0XHRqc29uOiB0cnVlXG5cdFx0XHR9LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXHRcdH07XG5cdFx0YXBpLmRlZmF1bHRzID0ge307XG5cblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuXHRcdFx0YXBpKGtleSwgJycsIGV4dGVuZChhdHRyaWJ1dGVzLCB7XG5cdFx0XHRcdGV4cGlyZXM6IC0xXG5cdFx0XHR9KSk7XG5cdFx0fTtcblxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcblxuXHRcdHJldHVybiBhcGk7XG5cdH1cblxuXHRyZXR1cm4gaW5pdChmdW5jdGlvbiAoKSB7fSk7XG59KSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9qcy1jb29raWUvc3JjL2pzLmNvb2tpZS5qc1xuLy8gbW9kdWxlIGlkID0gNjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogZXNsaW50LWVudiBicm93c2VyICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuXG4vKipcbiAqIENvbGxlY3Rpb24gb2YgdXRpbGl0eSBmdW5jdGlvbnMuXG4gKi9cbmNvbnN0IFV0aWxpdHkgPSB7fTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIGdpdmVuIGtleSBpbiBhIFVSTCBxdWVyeSBzdHJpbmcuIElmIG5vIFVSTCBxdWVyeVxuICogc3RyaW5nIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudCBVUkwgbG9jYXRpb24gaXMgdXNlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gS2V5IG5hbWUuXG4gKiBAcGFyYW0gez9zdHJpbmd9IHF1ZXJ5U3RyaW5nIC0gT3B0aW9uYWwgcXVlcnkgc3RyaW5nIHRvIGNoZWNrLlxuICogQHJldHVybiB7P3N0cmluZ30gUXVlcnkgcGFyYW1ldGVyIHZhbHVlLlxuICovXG5VdGlsaXR5LmdldFVybFBhcmFtZXRlciA9IChuYW1lLCBxdWVyeVN0cmluZykgPT4ge1xuICBjb25zdCBxdWVyeSA9IHF1ZXJ5U3RyaW5nIHx8IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XG4gIGNvbnN0IHBhcmFtID0gbmFtZS5yZXBsYWNlKC9bXFxbXS8sICdcXFxcWycpLnJlcGxhY2UoL1tcXF1dLywgJ1xcXFxdJyk7XG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cCgnW1xcXFw/Jl0nICsgcGFyYW0gKyAnPShbXiYjXSopJyk7XG4gIGNvbnN0IHJlc3VsdHMgPSByZWdleC5leGVjKHF1ZXJ5KTtcbiAgcmV0dXJuIHJlc3VsdHMgPT09IG51bGwgPyAnJyA6XG4gICAgICBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG59O1xuXG4vKipcbiAqIFRha2VzIGFuIG9iamVjdCBhbmQgZGVlcGx5IHRyYXZlcnNlcyBpdCwgcmV0dXJuaW5nIGFuIGFycmF5IG9mIHZhbHVlcyBmb3JcbiAqIG1hdGNoZWQgcHJvcGVydGllcyBpZGVudGlmaWVkIGJ5IHRoZSBrZXkgc3RyaW5nLlxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdCB0byB0cmF2ZXJzZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXRQcm9wIG5hbWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm4ge2FycmF5fSBwcm9wZXJ0eSB2YWx1ZXMuXG4gKi9cblV0aWxpdHkuZmluZFZhbHVlcyA9IChvYmplY3QsIHRhcmdldFByb3ApID0+IHtcbiAgY29uc3QgcmVzdWx0cyA9IFtdO1xuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmUgZnVuY3Rpb24gZm9yIGl0ZXJhdGluZyBvdmVyIG9iamVjdCBrZXlzLlxuICAgKi9cbiAgKGZ1bmN0aW9uIHRyYXZlcnNlT2JqZWN0KG9iaikge1xuICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBpZiAoa2V5ID09PSB0YXJnZXRQcm9wKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mKG9ialtrZXldKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0cmF2ZXJzZU9iamVjdChvYmpba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pKG9iamVjdCk7XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG4vKipcbiAqIFRha2VzIGEgc3RyaW5nIG9yIG51bWJlciB2YWx1ZSBhbmQgY29udmVydHMgaXQgdG8gYSBkb2xsYXIgYW1vdW50XG4gKiBhcyBhIHN0cmluZyB3aXRoIHR3byBkZWNpbWFsIHBvaW50cyBvZiBwZXJjaXNpb24uXG4gKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHZhbCAtIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHN0cmluZ2lmaWVkIG51bWJlciB0byB0d28gZGVjaW1hbCBwbGFjZXMuXG4gKi9cblV0aWxpdHkudG9Eb2xsYXJBbW91bnQgPSAodmFsKSA9PlxuICAgIChNYXRoLmFicyhNYXRoLnJvdW5kKHBhcnNlRmxvYXQodmFsKSAqIDEwMCkgLyAxMDApKS50b0ZpeGVkKDIpO1xuXG4vKipcbiAqIEZvciB0cmFuc2xhdGluZyBzdHJpbmdzLCB0aGVyZSBpcyBhIGdsb2JhbCBMT0NBTElaRURfU1RSSU5HUyBhcnJheSB0aGF0XG4gKiBpcyBkZWZpbmVkIG9uIHRoZSBIVE1MIHRlbXBsYXRlIGxldmVsIHNvIHRoYXQgdGhvc2Ugc3RyaW5ncyBhcmUgZXhwb3NlZCB0b1xuICogV1BNTCB0cmFuc2xhdGlvbi4gVGhlIExPQ0FMSVpFRF9TVFJJTkdTIGFycmF5IGlzIGNvbW9zZWQgb2Ygb2JqZWN0cyB3aXRoIGFcbiAqIGBzbHVnYCBrZXkgd2hvc2UgdmFsdWUgaXMgc29tZSBjb25zdGFudCwgYW5kIGEgYGxhYmVsYCB2YWx1ZSB3aGljaCBpcyB0aGVcbiAqIHRyYW5zbGF0ZWQgZXF1aXZhbGVudC4gVGhpcyBmdW5jdGlvbiB0YWtlcyBhIHNsdWcgbmFtZSBhbmQgcmV0dXJucyB0aGVcbiAqIGxhYmVsLlxuICogQHBhcmFtIHtzdHJpbmd9IHNsdWdOYW1lXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGxvY2FsaXplZCB2YWx1ZVxuICovXG5VdGlsaXR5LmxvY2FsaXplID0gZnVuY3Rpb24oc2x1Z05hbWUpIHtcbiAgbGV0IHRleHQgPSBzbHVnTmFtZSB8fCAnJztcbiAgY29uc3QgbG9jYWxpemVkU3RyaW5ncyA9IHdpbmRvdy5MT0NBTElaRURfU1RSSU5HUyB8fCBbXTtcbiAgY29uc3QgbWF0Y2ggPSBfLmZpbmRXaGVyZShsb2NhbGl6ZWRTdHJpbmdzLCB7XG4gICAgc2x1Zzogc2x1Z05hbWVcbiAgfSk7XG4gIGlmIChtYXRjaCkge1xuICAgIHRleHQgPSBtYXRjaC5sYWJlbDtcbiAgfVxuICByZXR1cm4gdGV4dDtcbn07XG5cbi8qKlxuICogVGFrZXMgYSBhIHN0cmluZyBhbmQgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgc3RyaW5nIGlzIGEgdmFsaWQgZW1haWxcbiAqIGJ5IHVzaW5nIG5hdGl2ZSBicm93c2VyIHZhbGlkYXRpb24gaWYgYXZhaWxhYmxlLiBPdGhlcndpc2UsIGRvZXMgYSBzaW1wbGVcbiAqIFJlZ2V4IHRlc3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gZW1haWxcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cblV0aWxpdHkuaXNWYWxpZEVtYWlsID0gZnVuY3Rpb24oZW1haWwpIHtcbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBpbnB1dC50eXBlID0gJ2VtYWlsJztcbiAgaW5wdXQudmFsdWUgPSBlbWFpbDtcblxuICByZXR1cm4gdHlwZW9mIGlucHV0LmNoZWNrVmFsaWRpdHkgPT09ICdmdW5jdGlvbicgP1xuICAgICAgaW5wdXQuY2hlY2tWYWxpZGl0eSgpIDogL1xcUytAXFxTK1xcLlxcUysvLnRlc3QoZW1haWwpO1xufTtcblxuLyoqXG4gKiBTaXRlIGNvbnN0YW50cy5cbiAqIEBlbnVtIHtzdHJpbmd9XG4gKi9cblV0aWxpdHkuQ09ORklHID0ge1xuICBERUZBVUxUX0xBVDogNDAuNzEyOCxcbiAgREVGQVVMVF9MTkc6IC03NC4wMDU5LFxuICBHT09HTEVfQVBJOiAnQUl6YVN5QlNqY19KTl9wMC1fVkt5QnZqQ0ZxVkFtQUlXdDdDbFpjJyxcbiAgR09PR0xFX1NUQVRJQ19BUEk6ICdBSXphU3lDdDBFN0RYX1lQRmNVbmxNUDZXSHYyenFBd3laRTRxSXcnLFxuICBHUkVDQVBUQ0hBX1NJVEVfS0VZOiAnNkxleW5CVVVBQUFBQU53c2tUVzJVSWNla3RSaWF5U3FMRkZ3d2s0OCcsXG4gIFNDUkVFTkVSX01BWF9IT1VTRUhPTEQ6IDgsXG4gIFVSTF9QSU5fQkxVRTogJy93cC1jb250ZW50L3RoZW1lcy9hY2Nlc3MvYXNzZXRzL2ltZy9tYXAtcGluLWJsdWUucG5nJyxcbiAgVVJMX1BJTl9CTFVFXzJYOiAnL3dwLWNvbnRlbnQvdGhlbWVzL2FjY2Vzcy9hc3NldHMvaW1nL21hcC1waW4tYmx1ZS0yeC5wbmcnLFxuICBVUkxfUElOX0dSRUVOOiAnL3dwLWNvbnRlbnQvdGhlbWVzL2FjY2Vzcy9hc3NldHMvaW1nL21hcC1waW4tZ3JlZW4ucG5nJyxcbiAgVVJMX1BJTl9HUkVFTl8yWDogJy93cC1jb250ZW50L3RoZW1lcy9hY2Nlc3MvYXNzZXRzL2ltZy9tYXAtcGluLWdyZWVuLTJ4LnBuZydcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWxpdHk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvdmVuZG9yL3V0aWxpdHkuanMiLCIvKiFcbiAqIGNsZWF2ZS5qcyAtIDAuNy4yM1xuICogaHR0cHM6Ly9naXRodWIuY29tL25vc2lyL2NsZWF2ZS5qc1xuICogQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjBcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTItMjAxNyBNYXggSHVhbmcgaHR0cHM6Ly9naXRodWIuY29tL25vc2lyL1xuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLkNsZWF2ZT10KCk6ZS5DbGVhdmU9dCgpfSh0aGlzLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQobil7aWYocltuXSlyZXR1cm4gcltuXS5leHBvcnRzO3ZhciBpPXJbbl09e2V4cG9ydHM6e30saWQ6bixsb2FkZWQ6ITF9O3JldHVybiBlW25dLmNhbGwoaS5leHBvcnRzLGksaS5leHBvcnRzLHQpLGkubG9hZGVkPSEwLGkuZXhwb3J0c312YXIgcj17fTtyZXR1cm4gdC5tPWUsdC5jPXIsdC5wPVwiXCIsdCgwKX0oW2Z1bmN0aW9uKGUsdCxyKXsoZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZnVuY3Rpb24oZSx0KXt2YXIgcj10aGlzO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlP3IuZWxlbWVudD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGUpOnIuZWxlbWVudD1cInVuZGVmaW5lZFwiIT10eXBlb2YgZS5sZW5ndGgmJmUubGVuZ3RoPjA/ZVswXTplLCFyLmVsZW1lbnQpdGhyb3cgbmV3IEVycm9yKFwiW2NsZWF2ZS5qc10gUGxlYXNlIGNoZWNrIHRoZSBlbGVtZW50XCIpO3QuaW5pdFZhbHVlPXIuZWxlbWVudC52YWx1ZSxyLnByb3BlcnRpZXM9bi5EZWZhdWx0UHJvcGVydGllcy5hc3NpZ24oe30sdCksci5pbml0KCl9O24ucHJvdG90eXBlPXtpbml0OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllczsodC5udW1lcmFsfHx0LnBob25lfHx0LmNyZWRpdENhcmR8fHQuZGF0ZXx8MCE9PXQuYmxvY2tzTGVuZ3RofHx0LnByZWZpeCkmJih0Lm1heExlbmd0aD1uLlV0aWwuZ2V0TWF4TGVuZ3RoKHQuYmxvY2tzKSxlLmlzQW5kcm9pZD1uLlV0aWwuaXNBbmRyb2lkKCksZS5sYXN0SW5wdXRWYWx1ZT1cIlwiLGUub25DaGFuZ2VMaXN0ZW5lcj1lLm9uQ2hhbmdlLmJpbmQoZSksZS5vbktleURvd25MaXN0ZW5lcj1lLm9uS2V5RG93bi5iaW5kKGUpLGUub25DdXRMaXN0ZW5lcj1lLm9uQ3V0LmJpbmQoZSksZS5vbkNvcHlMaXN0ZW5lcj1lLm9uQ29weS5iaW5kKGUpLGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixlLm9uQ2hhbmdlTGlzdGVuZXIpLGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLGUub25LZXlEb3duTGlzdGVuZXIpLGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY3V0XCIsZS5vbkN1dExpc3RlbmVyKSxlLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvcHlcIixlLm9uQ29weUxpc3RlbmVyKSxlLmluaXRQaG9uZUZvcm1hdHRlcigpLGUuaW5pdERhdGVGb3JtYXR0ZXIoKSxlLmluaXROdW1lcmFsRm9ybWF0dGVyKCksZS5vbklucHV0KHQuaW5pdFZhbHVlKSl9LGluaXROdW1lcmFsRm9ybWF0dGVyOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllczt0Lm51bWVyYWwmJih0Lm51bWVyYWxGb3JtYXR0ZXI9bmV3IG4uTnVtZXJhbEZvcm1hdHRlcih0Lm51bWVyYWxEZWNpbWFsTWFyayx0Lm51bWVyYWxJbnRlZ2VyU2NhbGUsdC5udW1lcmFsRGVjaW1hbFNjYWxlLHQubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGUsdC5udW1lcmFsUG9zaXRpdmVPbmx5LHQuZGVsaW1pdGVyKSl9LGluaXREYXRlRm9ybWF0dGVyOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllczt0LmRhdGUmJih0LmRhdGVGb3JtYXR0ZXI9bmV3IG4uRGF0ZUZvcm1hdHRlcih0LmRhdGVQYXR0ZXJuKSx0LmJsb2Nrcz10LmRhdGVGb3JtYXR0ZXIuZ2V0QmxvY2tzKCksdC5ibG9ja3NMZW5ndGg9dC5ibG9ja3MubGVuZ3RoLHQubWF4TGVuZ3RoPW4uVXRpbC5nZXRNYXhMZW5ndGgodC5ibG9ja3MpKX0saW5pdFBob25lRm9ybWF0dGVyOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllcztpZih0LnBob25lKXRyeXt0LnBob25lRm9ybWF0dGVyPW5ldyBuLlBob25lRm9ybWF0dGVyKG5ldyB0LnJvb3QuQ2xlYXZlLkFzWW91VHlwZUZvcm1hdHRlcih0LnBob25lUmVnaW9uQ29kZSksdC5kZWxpbWl0ZXIpfWNhdGNoKHIpe3Rocm93IG5ldyBFcnJvcihcIltjbGVhdmUuanNdIFBsZWFzZSBpbmNsdWRlIHBob25lLXR5cGUtZm9ybWF0dGVyLntjb3VudHJ5fS5qcyBsaWJcIil9fSxvbktleURvd246ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPXQucHJvcGVydGllcyxpPWUud2hpY2h8fGUua2V5Q29kZSxhPW4uVXRpbCxvPXQuZWxlbWVudC52YWx1ZTtyZXR1cm4gYS5pc0FuZHJvaWRCYWNrc3BhY2VLZXlkb3duKHQubGFzdElucHV0VmFsdWUsbykmJihpPTgpLHQubGFzdElucHV0VmFsdWU9byw4PT09aSYmYS5pc0RlbGltaXRlcihvLnNsaWNlKC1yLmRlbGltaXRlckxlbmd0aCksci5kZWxpbWl0ZXIsci5kZWxpbWl0ZXJzKT92b2lkKHIuYmFja3NwYWNlPSEwKTp2b2lkKHIuYmFja3NwYWNlPSExKX0sb25DaGFuZ2U6ZnVuY3Rpb24oKXt0aGlzLm9uSW5wdXQodGhpcy5lbGVtZW50LnZhbHVlKX0sb25DdXQ6ZnVuY3Rpb24oZSl7dGhpcy5jb3B5Q2xpcGJvYXJkRGF0YShlKSx0aGlzLm9uSW5wdXQoXCJcIil9LG9uQ29weTpmdW5jdGlvbihlKXt0aGlzLmNvcHlDbGlwYm9hcmREYXRhKGUpfSxjb3B5Q2xpcGJvYXJkRGF0YTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzLGk9bi5VdGlsLGE9dC5lbGVtZW50LnZhbHVlLG89XCJcIjtvPXIuY29weURlbGltaXRlcj9hOmkuc3RyaXBEZWxpbWl0ZXJzKGEsci5kZWxpbWl0ZXIsci5kZWxpbWl0ZXJzKTt0cnl7ZS5jbGlwYm9hcmREYXRhP2UuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwiVGV4dFwiLG8pOndpbmRvdy5jbGlwYm9hcmREYXRhLnNldERhdGEoXCJUZXh0XCIsbyksZS5wcmV2ZW50RGVmYXVsdCgpfWNhdGNoKGwpe319LG9uSW5wdXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPXQucHJvcGVydGllcyxpPWUsYT1uLlV0aWw7cmV0dXJuIHIubnVtZXJhbHx8IXIuYmFja3NwYWNlfHxhLmlzRGVsaW1pdGVyKGUuc2xpY2UoLXIuZGVsaW1pdGVyTGVuZ3RoKSxyLmRlbGltaXRlcixyLmRlbGltaXRlcnMpfHwoZT1hLmhlYWRTdHIoZSxlLmxlbmd0aC1yLmRlbGltaXRlckxlbmd0aCkpLHIucGhvbmU/KHIucmVzdWx0PXIucGhvbmVGb3JtYXR0ZXIuZm9ybWF0KGUpLHZvaWQgdC51cGRhdGVWYWx1ZVN0YXRlKCkpOnIubnVtZXJhbD8oci5yZXN1bHQ9ci5wcmVmaXgrci5udW1lcmFsRm9ybWF0dGVyLmZvcm1hdChlKSx2b2lkIHQudXBkYXRlVmFsdWVTdGF0ZSgpKTooci5kYXRlJiYoZT1yLmRhdGVGb3JtYXR0ZXIuZ2V0VmFsaWRhdGVkRGF0ZShlKSksZT1hLnN0cmlwRGVsaW1pdGVycyhlLHIuZGVsaW1pdGVyLHIuZGVsaW1pdGVycyksZT1hLmdldFByZWZpeFN0cmlwcGVkVmFsdWUoZSxyLnByZWZpeCxyLnByZWZpeExlbmd0aCksZT1yLm51bWVyaWNPbmx5P2Euc3RyaXAoZSwvW15cXGRdL2cpOmUsZT1yLnVwcGVyY2FzZT9lLnRvVXBwZXJDYXNlKCk6ZSxlPXIubG93ZXJjYXNlP2UudG9Mb3dlckNhc2UoKTplLHIucHJlZml4JiYoZT1yLnByZWZpeCtlLDA9PT1yLmJsb2Nrc0xlbmd0aCk/KHIucmVzdWx0PWUsdm9pZCB0LnVwZGF0ZVZhbHVlU3RhdGUoKSk6KHIuY3JlZGl0Q2FyZCYmdC51cGRhdGVDcmVkaXRDYXJkUHJvcHNCeVZhbHVlKGUpLGU9YS5oZWFkU3RyKGUsci5tYXhMZW5ndGgpLHIucmVzdWx0PWEuZ2V0Rm9ybWF0dGVkVmFsdWUoZSxyLmJsb2NrcyxyLmJsb2Nrc0xlbmd0aCxyLmRlbGltaXRlcixyLmRlbGltaXRlcnMpLHZvaWQoaT09PXIucmVzdWx0JiZpIT09ci5wcmVmaXh8fHQudXBkYXRlVmFsdWVTdGF0ZSgpKSkpfSx1cGRhdGVDcmVkaXRDYXJkUHJvcHNCeVZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0LHI9dGhpcyxpPXIucHJvcGVydGllcyxhPW4uVXRpbDthLmhlYWRTdHIoaS5yZXN1bHQsNCkhPT1hLmhlYWRTdHIoZSw0KSYmKHQ9bi5DcmVkaXRDYXJkRGV0ZWN0b3IuZ2V0SW5mbyhlLGkuY3JlZGl0Q2FyZFN0cmljdE1vZGUpLGkuYmxvY2tzPXQuYmxvY2tzLGkuYmxvY2tzTGVuZ3RoPWkuYmxvY2tzLmxlbmd0aCxpLm1heExlbmd0aD1hLmdldE1heExlbmd0aChpLmJsb2NrcyksaS5jcmVkaXRDYXJkVHlwZSE9PXQudHlwZSYmKGkuY3JlZGl0Q2FyZFR5cGU9dC50eXBlLGkub25DcmVkaXRDYXJkVHlwZUNoYW5nZWQuY2FsbChyLGkuY3JlZGl0Q2FyZFR5cGUpKSl9LHVwZGF0ZVZhbHVlU3RhdGU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3JldHVybiBlLmlzQW5kcm9pZD92b2lkIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZS5lbGVtZW50LnZhbHVlPWUucHJvcGVydGllcy5yZXN1bHR9LDEpOnZvaWQoZS5lbGVtZW50LnZhbHVlPWUucHJvcGVydGllcy5yZXN1bHQpfSxzZXRQaG9uZVJlZ2lvbkNvZGU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPXQucHJvcGVydGllcztyLnBob25lUmVnaW9uQ29kZT1lLHQuaW5pdFBob25lRm9ybWF0dGVyKCksdC5vbkNoYW5nZSgpfSxzZXRSYXdWYWx1ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzO2U9dm9pZCAwIT09ZSYmbnVsbCE9PWU/ZS50b1N0cmluZygpOlwiXCIsci5udW1lcmFsJiYoZT1lLnJlcGxhY2UoXCIuXCIsci5udW1lcmFsRGVjaW1hbE1hcmspKSx0LmVsZW1lbnQudmFsdWU9ZSx0Lm9uSW5wdXQoZSl9LGdldFJhd1ZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllcyxyPW4uVXRpbCxpPWUuZWxlbWVudC52YWx1ZTtyZXR1cm4gdC5yYXdWYWx1ZVRyaW1QcmVmaXgmJihpPXIuZ2V0UHJlZml4U3RyaXBwZWRWYWx1ZShpLHQucHJlZml4LHQucHJlZml4TGVuZ3RoKSksaT10Lm51bWVyYWw/dC5udW1lcmFsRm9ybWF0dGVyLmdldFJhd1ZhbHVlKGkpOnIuc3RyaXBEZWxpbWl0ZXJzKGksdC5kZWxpbWl0ZXIsdC5kZWxpbWl0ZXJzKX0sZ2V0Rm9ybWF0dGVkVmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbGVtZW50LnZhbHVlfSxkZXN0cm95OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsZS5vbkNoYW5nZUxpc3RlbmVyKSxlLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIixlLm9uS2V5RG93bkxpc3RlbmVyKSxlLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImN1dFwiLGUub25DdXRMaXN0ZW5lciksZS5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsZS5vbkNvcHlMaXN0ZW5lcil9LHRvU3RyaW5nOmZ1bmN0aW9uKCl7cmV0dXJuXCJbQ2xlYXZlIE9iamVjdF1cIn19LG4uTnVtZXJhbEZvcm1hdHRlcj1yKDEpLG4uRGF0ZUZvcm1hdHRlcj1yKDIpLG4uUGhvbmVGb3JtYXR0ZXI9cigzKSxuLkNyZWRpdENhcmREZXRlY3Rvcj1yKDQpLG4uVXRpbD1yKDUpLG4uRGVmYXVsdFByb3BlcnRpZXM9cig2KSwoXCJvYmplY3RcIj09dHlwZW9mIHQmJnQ/dDp3aW5kb3cpLkNsZWF2ZT1uLGUuZXhwb3J0cz1ufSkuY2FsbCh0LGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO3ZhciByPWZ1bmN0aW9uKGUsdCxuLGksYSxvKXt2YXIgbD10aGlzO2wubnVtZXJhbERlY2ltYWxNYXJrPWV8fFwiLlwiLGwubnVtZXJhbEludGVnZXJTY2FsZT10Pj0wP3Q6MTAsbC5udW1lcmFsRGVjaW1hbFNjYWxlPW4+PTA/bjoyLGwubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGU9aXx8ci5ncm91cFN0eWxlLnRob3VzYW5kLGwubnVtZXJhbFBvc2l0aXZlT25seT0hIWEsbC5kZWxpbWl0ZXI9b3x8XCJcIj09PW8/bzpcIixcIixsLmRlbGltaXRlclJFPW8/bmV3IFJlZ0V4cChcIlxcXFxcIitvLFwiZ1wiKTpcIlwifTtyLmdyb3VwU3R5bGU9e3Rob3VzYW5kOlwidGhvdXNhbmRcIixsYWtoOlwibGFraFwiLHdhbjpcIndhblwifSxyLnByb3RvdHlwZT17Z2V0UmF3VmFsdWU6ZnVuY3Rpb24oZSl7cmV0dXJuIGUucmVwbGFjZSh0aGlzLmRlbGltaXRlclJFLFwiXCIpLnJlcGxhY2UodGhpcy5udW1lcmFsRGVjaW1hbE1hcmssXCIuXCIpfSxmb3JtYXQ6ZnVuY3Rpb24oZSl7dmFyIHQsbixpPXRoaXMsYT1cIlwiO3N3aXRjaChlPWUucmVwbGFjZSgvW0EtWmEtel0vZyxcIlwiKS5yZXBsYWNlKGkubnVtZXJhbERlY2ltYWxNYXJrLFwiTVwiKS5yZXBsYWNlKC9bXlxcZE0tXS9nLFwiXCIpLnJlcGxhY2UoL15cXC0vLFwiTlwiKS5yZXBsYWNlKC9cXC0vZyxcIlwiKS5yZXBsYWNlKFwiTlwiLGkubnVtZXJhbFBvc2l0aXZlT25seT9cIlwiOlwiLVwiKS5yZXBsYWNlKFwiTVwiLGkubnVtZXJhbERlY2ltYWxNYXJrKS5yZXBsYWNlKC9eKC0pPzArKD89XFxkKS8sXCIkMVwiKSxuPWUsZS5pbmRleE9mKGkubnVtZXJhbERlY2ltYWxNYXJrKT49MCYmKHQ9ZS5zcGxpdChpLm51bWVyYWxEZWNpbWFsTWFyayksbj10WzBdLGE9aS5udW1lcmFsRGVjaW1hbE1hcmsrdFsxXS5zbGljZSgwLGkubnVtZXJhbERlY2ltYWxTY2FsZSkpLGkubnVtZXJhbEludGVnZXJTY2FsZT4wJiYobj1uLnNsaWNlKDAsaS5udW1lcmFsSW50ZWdlclNjYWxlKyhcIi1cIj09PWUuc2xpY2UoMCwxKT8xOjApKSksaS5udW1lcmFsVGhvdXNhbmRzR3JvdXBTdHlsZSl7Y2FzZSByLmdyb3VwU3R5bGUubGFraDpuPW4ucmVwbGFjZSgvKFxcZCkoPz0oXFxkXFxkKStcXGQkKS9nLFwiJDFcIitpLmRlbGltaXRlcik7YnJlYWs7Y2FzZSByLmdyb3VwU3R5bGUud2FuOm49bi5yZXBsYWNlKC8oXFxkKSg/PShcXGR7NH0pKyQpL2csXCIkMVwiK2kuZGVsaW1pdGVyKTticmVhaztkZWZhdWx0Om49bi5yZXBsYWNlKC8oXFxkKSg/PShcXGR7M30pKyQpL2csXCIkMVwiK2kuZGVsaW1pdGVyKX1yZXR1cm4gbi50b1N0cmluZygpKyhpLm51bWVyYWxEZWNpbWFsU2NhbGU+MD9hLnRvU3RyaW5nKCk6XCJcIil9fSxlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj1mdW5jdGlvbihlKXt2YXIgdD10aGlzO3QuYmxvY2tzPVtdLHQuZGF0ZVBhdHRlcm49ZSx0LmluaXRCbG9ja3MoKX07ci5wcm90b3R5cGU9e2luaXRCbG9ja3M6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2UuZGF0ZVBhdHRlcm4uZm9yRWFjaChmdW5jdGlvbih0KXtcIllcIj09PXQ/ZS5ibG9ja3MucHVzaCg0KTplLmJsb2Nrcy5wdXNoKDIpfSl9LGdldEJsb2NrczpmdW5jdGlvbigpe3JldHVybiB0aGlzLmJsb2Nrc30sZ2V0VmFsaWRhdGVkRGF0ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9XCJcIjtyZXR1cm4gZT1lLnJlcGxhY2UoL1teXFxkXS9nLFwiXCIpLHQuYmxvY2tzLmZvckVhY2goZnVuY3Rpb24obixpKXtpZihlLmxlbmd0aD4wKXt2YXIgYT1lLnNsaWNlKDAsbiksbz1hLnNsaWNlKDAsMSksbD1lLnNsaWNlKG4pO3N3aXRjaCh0LmRhdGVQYXR0ZXJuW2ldKXtjYXNlXCJkXCI6XCIwMFwiPT09YT9hPVwiMDFcIjpwYXJzZUludChvLDEwKT4zP2E9XCIwXCIrbzpwYXJzZUludChhLDEwKT4zMSYmKGE9XCIzMVwiKTticmVhaztjYXNlXCJtXCI6XCIwMFwiPT09YT9hPVwiMDFcIjpwYXJzZUludChvLDEwKT4xP2E9XCIwXCIrbzpwYXJzZUludChhLDEwKT4xMiYmKGE9XCIxMlwiKX1yKz1hLGU9bH19KSxyfX0sZS5leHBvcnRzPXJ9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZnVuY3Rpb24oZSx0KXt2YXIgcj10aGlzO3IuZGVsaW1pdGVyPXR8fFwiXCI9PT10P3Q6XCIgXCIsci5kZWxpbWl0ZXJSRT10P25ldyBSZWdFeHAoXCJcXFxcXCIrdCxcImdcIik6XCJcIixyLmZvcm1hdHRlcj1lfTtyLnByb3RvdHlwZT17c2V0Rm9ybWF0dGVyOmZ1bmN0aW9uKGUpe3RoaXMuZm9ybWF0dGVyPWV9LGZvcm1hdDpmdW5jdGlvbihlKXt2YXIgdD10aGlzO3QuZm9ybWF0dGVyLmNsZWFyKCksZT1lLnJlcGxhY2UoL1teXFxkK10vZyxcIlwiKSxlPWUucmVwbGFjZSh0LmRlbGltaXRlclJFLFwiXCIpO2Zvcih2YXIgcixuPVwiXCIsaT0hMSxhPTAsbz1lLmxlbmd0aDtvPmE7YSsrKXI9dC5mb3JtYXR0ZXIuaW5wdXREaWdpdChlLmNoYXJBdChhKSksL1tcXHMoKS1dL2cudGVzdChyKT8obj1yLGk9ITApOml8fChuPXIpO3JldHVybiBuPW4ucmVwbGFjZSgvWygpXS9nLFwiXCIpLG49bi5yZXBsYWNlKC9bXFxzLV0vZyx0LmRlbGltaXRlcil9fSxlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj17YmxvY2tzOnt1YXRwOls0LDUsNl0sYW1leDpbNCw2LDVdLGRpbmVyczpbNCw2LDRdLGRpc2NvdmVyOls0LDQsNCw0XSxtYXN0ZXJjYXJkOls0LDQsNCw0XSxkYW5rb3J0Ols0LDQsNCw0XSxpbnN0YXBheW1lbnQ6WzQsNCw0LDRdLGpjYjpbNCw0LDQsNF0sbWFlc3RybzpbNCw0LDQsNF0sdmlzYTpbNCw0LDQsNF0sZ2VuZXJhbDpbNCw0LDQsNF0sZ2VuZXJhbFN0cmljdDpbNCw0LDQsN119LHJlOnt1YXRwOi9eKD8hMTgwMCkxXFxkezAsMTR9LyxhbWV4Oi9eM1s0N11cXGR7MCwxM30vLGRpc2NvdmVyOi9eKD86NjAxMXw2NVxcZHswLDJ9fDY0WzQtOV1cXGQ/KVxcZHswLDEyfS8sZGluZXJzOi9eMyg/OjAoWzAtNV18OSl8WzY4OV1cXGQ/KVxcZHswLDExfS8sbWFzdGVyY2FyZDovXig1WzEtNV18MlsyLTddKVxcZHswLDE0fS8sZGFua29ydDovXig1MDE5fDQxNzV8NDU3MSlcXGR7MCwxMn0vLGluc3RhcGF5bWVudDovXjYzWzctOV1cXGR7MCwxM30vLGpjYjovXig/OjIxMzF8MTgwMHwzNVxcZHswLDJ9KVxcZHswLDEyfS8sbWFlc3RybzovXig/OjVbMDY3OF1cXGR7MCwyfXw2MzA0fDY3XFxkezAsMn0pXFxkezAsMTJ9Lyx2aXNhOi9eNFxcZHswLDE1fS99LGdldEluZm86ZnVuY3Rpb24oZSx0KXt2YXIgbj1yLmJsb2NrcyxpPXIucmU7cmV0dXJuIHQ9ISF0LGkuYW1leC50ZXN0KGUpP3t0eXBlOlwiYW1leFwiLGJsb2NrczpuLmFtZXh9OmkudWF0cC50ZXN0KGUpP3t0eXBlOlwidWF0cFwiLGJsb2NrczpuLnVhdHB9OmkuZGluZXJzLnRlc3QoZSk/e3R5cGU6XCJkaW5lcnNcIixibG9ja3M6bi5kaW5lcnN9OmkuZGlzY292ZXIudGVzdChlKT97dHlwZTpcImRpc2NvdmVyXCIsYmxvY2tzOnQ/bi5nZW5lcmFsU3RyaWN0Om4uZGlzY292ZXJ9OmkubWFzdGVyY2FyZC50ZXN0KGUpP3t0eXBlOlwibWFzdGVyY2FyZFwiLGJsb2NrczpuLm1hc3RlcmNhcmR9OmkuZGFua29ydC50ZXN0KGUpP3t0eXBlOlwiZGFua29ydFwiLGJsb2NrczpuLmRhbmtvcnR9OmkuaW5zdGFwYXltZW50LnRlc3QoZSk/e3R5cGU6XCJpbnN0YXBheW1lbnRcIixibG9ja3M6bi5pbnN0YXBheW1lbnR9OmkuamNiLnRlc3QoZSk/e3R5cGU6XCJqY2JcIixibG9ja3M6bi5qY2J9OmkubWFlc3Ryby50ZXN0KGUpP3t0eXBlOlwibWFlc3Ryb1wiLGJsb2Nrczp0P24uZ2VuZXJhbFN0cmljdDpuLm1hZXN0cm99OmkudmlzYS50ZXN0KGUpP3t0eXBlOlwidmlzYVwiLGJsb2Nrczp0P24uZ2VuZXJhbFN0cmljdDpuLnZpc2F9Ont0eXBlOlwidW5rbm93blwiLGJsb2Nrczp0P24uZ2VuZXJhbFN0cmljdDpuLmdlbmVyYWx9fX07ZS5leHBvcnRzPXJ9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9e25vb3A6ZnVuY3Rpb24oKXt9LHN0cmlwOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUucmVwbGFjZSh0LFwiXCIpfSxpc0RlbGltaXRlcjpmdW5jdGlvbihlLHQscil7cmV0dXJuIDA9PT1yLmxlbmd0aD9lPT09dDpyLnNvbWUoZnVuY3Rpb24odCl7cmV0dXJuIGU9PT10PyEwOnZvaWQgMH0pfSxnZXREZWxpbWl0ZXJSRUJ5RGVsaW1pdGVyOmZ1bmN0aW9uKGUpe3JldHVybiBuZXcgUmVnRXhwKGUucmVwbGFjZSgvKFsuPyorXiRbXFxdXFxcXCgpe318LV0pL2csXCJcXFxcJDFcIiksXCJnXCIpfSxzdHJpcERlbGltaXRlcnM6ZnVuY3Rpb24oZSx0LHIpe3ZhciBuPXRoaXM7aWYoMD09PXIubGVuZ3RoKXt2YXIgaT10P24uZ2V0RGVsaW1pdGVyUkVCeURlbGltaXRlcih0KTpcIlwiO3JldHVybiBlLnJlcGxhY2UoaSxcIlwiKX1yZXR1cm4gci5mb3JFYWNoKGZ1bmN0aW9uKHQpe2U9ZS5yZXBsYWNlKG4uZ2V0RGVsaW1pdGVyUkVCeURlbGltaXRlcih0KSxcIlwiKX0pLGV9LGhlYWRTdHI6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5zbGljZSgwLHQpfSxnZXRNYXhMZW5ndGg6ZnVuY3Rpb24oZSl7cmV0dXJuIGUucmVkdWNlKGZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUrdH0sMCl9LGdldFByZWZpeFN0cmlwcGVkVmFsdWU6ZnVuY3Rpb24oZSx0LHIpe2lmKGUuc2xpY2UoMCxyKSE9PXQpe3ZhciBuPXRoaXMuZ2V0Rmlyc3REaWZmSW5kZXgodCxlLnNsaWNlKDAscikpO2U9dCtlLnNsaWNlKG4sbisxKStlLnNsaWNlKHIrMSl9cmV0dXJuIGUuc2xpY2Uocil9LGdldEZpcnN0RGlmZkluZGV4OmZ1bmN0aW9uKGUsdCl7Zm9yKHZhciByPTA7ZS5jaGFyQXQocik9PT10LmNoYXJBdChyKTspaWYoXCJcIj09PWUuY2hhckF0KHIrKykpcmV0dXJuLTE7cmV0dXJuIHJ9LGdldEZvcm1hdHRlZFZhbHVlOmZ1bmN0aW9uKGUsdCxyLG4saSl7dmFyIGEsbz1cIlwiLGw9aS5sZW5ndGg+MDtyZXR1cm4gMD09PXI/ZToodC5mb3JFYWNoKGZ1bmN0aW9uKHQscyl7aWYoZS5sZW5ndGg+MCl7dmFyIGM9ZS5zbGljZSgwLHQpLHU9ZS5zbGljZSh0KTtvKz1jLGE9bD9pW3NdfHxhOm4sYy5sZW5ndGg9PT10JiZyLTE+cyYmKG8rPWEpLGU9dX19KSxvKX0saXNBbmRyb2lkOmZ1bmN0aW9uKCl7cmV0dXJuISghbmF2aWdhdG9yfHwhL2FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKX0saXNBbmRyb2lkQmFja3NwYWNlS2V5ZG93bjpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmlzQW5kcm9pZCgpP3Q9PT1lLnNsaWNlKDAsLTEpOiExfX07ZS5leHBvcnRzPXJ9LGZ1bmN0aW9uKGUsdCl7KGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciByPXthc3NpZ246ZnVuY3Rpb24oZSxyKXtyZXR1cm4gZT1lfHx7fSxyPXJ8fHt9LGUuY3JlZGl0Q2FyZD0hIXIuY3JlZGl0Q2FyZCxlLmNyZWRpdENhcmRTdHJpY3RNb2RlPSEhci5jcmVkaXRDYXJkU3RyaWN0TW9kZSxlLmNyZWRpdENhcmRUeXBlPVwiXCIsZS5vbkNyZWRpdENhcmRUeXBlQ2hhbmdlZD1yLm9uQ3JlZGl0Q2FyZFR5cGVDaGFuZ2VkfHxmdW5jdGlvbigpe30sZS5waG9uZT0hIXIucGhvbmUsZS5waG9uZVJlZ2lvbkNvZGU9ci5waG9uZVJlZ2lvbkNvZGV8fFwiQVVcIixlLnBob25lRm9ybWF0dGVyPXt9LGUuZGF0ZT0hIXIuZGF0ZSxlLmRhdGVQYXR0ZXJuPXIuZGF0ZVBhdHRlcm58fFtcImRcIixcIm1cIixcIllcIl0sZS5kYXRlRm9ybWF0dGVyPXt9LGUubnVtZXJhbD0hIXIubnVtZXJhbCxlLm51bWVyYWxJbnRlZ2VyU2NhbGU9ci5udW1lcmFsSW50ZWdlclNjYWxlPj0wP3IubnVtZXJhbEludGVnZXJTY2FsZToxMCxlLm51bWVyYWxEZWNpbWFsU2NhbGU9ci5udW1lcmFsRGVjaW1hbFNjYWxlPj0wP3IubnVtZXJhbERlY2ltYWxTY2FsZToyLGUubnVtZXJhbERlY2ltYWxNYXJrPXIubnVtZXJhbERlY2ltYWxNYXJrfHxcIi5cIixlLm51bWVyYWxUaG91c2FuZHNHcm91cFN0eWxlPXIubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGV8fFwidGhvdXNhbmRcIixlLm51bWVyYWxQb3NpdGl2ZU9ubHk9ISFyLm51bWVyYWxQb3NpdGl2ZU9ubHksZS5udW1lcmljT25seT1lLmNyZWRpdENhcmR8fGUuZGF0ZXx8ISFyLm51bWVyaWNPbmx5LGUudXBwZXJjYXNlPSEhci51cHBlcmNhc2UsZS5sb3dlcmNhc2U9ISFyLmxvd2VyY2FzZSxlLnByZWZpeD1lLmNyZWRpdENhcmR8fGUucGhvbmV8fGUuZGF0ZT9cIlwiOnIucHJlZml4fHxcIlwiLGUucHJlZml4TGVuZ3RoPWUucHJlZml4Lmxlbmd0aCxlLnJhd1ZhbHVlVHJpbVByZWZpeD0hIXIucmF3VmFsdWVUcmltUHJlZml4LGUuY29weURlbGltaXRlcj0hIXIuY29weURlbGltaXRlcixlLmluaXRWYWx1ZT12b2lkIDA9PT1yLmluaXRWYWx1ZT9cIlwiOnIuaW5pdFZhbHVlLnRvU3RyaW5nKCksZS5kZWxpbWl0ZXI9ci5kZWxpbWl0ZXJ8fFwiXCI9PT1yLmRlbGltaXRlcj9yLmRlbGltaXRlcjpyLmRhdGU/XCIvXCI6ci5udW1lcmFsP1wiLFwiOihyLnBob25lLFwiIFwiKSxlLmRlbGltaXRlckxlbmd0aD1lLmRlbGltaXRlci5sZW5ndGgsZS5kZWxpbWl0ZXJzPXIuZGVsaW1pdGVyc3x8W10sZS5ibG9ja3M9ci5ibG9ja3N8fFtdLGUuYmxvY2tzTGVuZ3RoPWUuYmxvY2tzLmxlbmd0aCxlLnJvb3Q9XCJvYmplY3RcIj09dHlwZW9mIHQmJnQ/dDp3aW5kb3csZS5tYXhMZW5ndGg9MCxlLmJhY2tzcGFjZT0hMSxlLnJlc3VsdD1cIlwiLGV9fTtlLmV4cG9ydHM9cn0pLmNhbGwodCxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX1dKX0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2NsZWF2ZS5qcy9kaXN0L2NsZWF2ZS5taW4uanNcbi8vIG1vZHVsZSBpZCA9IDcxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIiFmdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxuKXt2YXIgZT10LnNwbGl0KFwiLlwiKSxyPUg7ZVswXWluIHJ8fCFyLmV4ZWNTY3JpcHR8fHIuZXhlY1NjcmlwdChcInZhciBcIitlWzBdKTtmb3IodmFyIGk7ZS5sZW5ndGgmJihpPWUuc2hpZnQoKSk7KWUubGVuZ3RofHx2b2lkIDA9PT1uP3I9cltpXT9yW2ldOnJbaV09e306cltpXT1ufWZ1bmN0aW9uIG4odCxuKXtmdW5jdGlvbiBlKCl7fWUucHJvdG90eXBlPW4ucHJvdG90eXBlLHQuTT1uLnByb3RvdHlwZSx0LnByb3RvdHlwZT1uZXcgZSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10LHQuTj1mdW5jdGlvbih0LGUscil7Zm9yKHZhciBpPUFycmF5KGFyZ3VtZW50cy5sZW5ndGgtMiksYT0yO2E8YXJndW1lbnRzLmxlbmd0aDthKyspaVthLTJdPWFyZ3VtZW50c1thXTtyZXR1cm4gbi5wcm90b3R5cGVbZV0uYXBwbHkodCxpKX19ZnVuY3Rpb24gZSh0LG4pe251bGwhPXQmJnRoaXMuYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gcih0KXt0LmI9XCJcIn1mdW5jdGlvbiBpKHQsbil7dC5zb3J0KG58fGEpfWZ1bmN0aW9uIGEodCxuKXtyZXR1cm4gdD5uPzE6bj50Py0xOjB9ZnVuY3Rpb24gbCh0KXt2YXIgbixlPVtdLHI9MDtmb3IobiBpbiB0KWVbcisrXT10W25dO3JldHVybiBlfWZ1bmN0aW9uIG8odCxuKXt0aGlzLmI9dCx0aGlzLmE9e307Zm9yKHZhciBlPTA7ZTxuLmxlbmd0aDtlKyspe3ZhciByPW5bZV07dGhpcy5hW3IuYl09cn19ZnVuY3Rpb24gdSh0KXtyZXR1cm4gdD1sKHQuYSksaSh0LGZ1bmN0aW9uKHQsbil7cmV0dXJuIHQuYi1uLmJ9KSx0fWZ1bmN0aW9uIHModCxuKXtzd2l0Y2godGhpcy5iPXQsdGhpcy5nPSEhbi5HLHRoaXMuYT1uLmMsdGhpcy5qPW4udHlwZSx0aGlzLmg9ITEsdGhpcy5hKXtjYXNlIHE6Y2FzZSBKOmNhc2UgTDpjYXNlIE86Y2FzZSBrOmNhc2UgWTpjYXNlIEs6dGhpcy5oPSEwfXRoaXMuZj1uLmRlZmF1bHRWYWx1ZX1mdW5jdGlvbiBmKCl7dGhpcy5hPXt9LHRoaXMuZj10aGlzLmkoKS5hLHRoaXMuYj10aGlzLmc9bnVsbH1mdW5jdGlvbiBwKHQsbil7Zm9yKHZhciBlPXUodC5pKCkpLHI9MDtyPGUubGVuZ3RoO3IrKyl7dmFyIGk9ZVtyXSxhPWkuYjtpZihudWxsIT1uLmFbYV0pe3QuYiYmZGVsZXRlIHQuYltpLmJdO3ZhciBsPTExPT1pLmF8fDEwPT1pLmE7aWYoaS5nKWZvcih2YXIgaT1jKG4sYSl8fFtdLG89MDtvPGkubGVuZ3RoO28rKyl7dmFyIHM9dCxmPWEsaD1sP2lbb10uY2xvbmUoKTppW29dO3MuYVtmXXx8KHMuYVtmXT1bXSkscy5hW2ZdLnB1c2goaCkscy5iJiZkZWxldGUgcy5iW2ZdfWVsc2UgaT1jKG4sYSksbD8obD1jKHQsYSkpP3AobCxpKTptKHQsYSxpLmNsb25lKCkpOm0odCxhLGkpfX19ZnVuY3Rpb24gYyh0LG4pe3ZhciBlPXQuYVtuXTtpZihudWxsPT1lKXJldHVybiBudWxsO2lmKHQuZyl7aWYoIShuIGluIHQuYikpe3ZhciByPXQuZyxpPXQuZltuXTtpZihudWxsIT1lKWlmKGkuZyl7Zm9yKHZhciBhPVtdLGw9MDtsPGUubGVuZ3RoO2wrKylhW2xdPXIuYihpLGVbbF0pO2U9YX1lbHNlIGU9ci5iKGksZSk7cmV0dXJuIHQuYltuXT1lfXJldHVybiB0LmJbbl19cmV0dXJuIGV9ZnVuY3Rpb24gaCh0LG4sZSl7dmFyIHI9Yyh0LG4pO3JldHVybiB0LmZbbl0uZz9yW2V8fDBdOnJ9ZnVuY3Rpb24gZyh0LG4pe3ZhciBlO2lmKG51bGwhPXQuYVtuXSllPWgodCxuLHZvaWQgMCk7ZWxzZSB0OntpZihlPXQuZltuXSx2b2lkIDA9PT1lLmYpe3ZhciByPWUuajtpZihyPT09Qm9vbGVhbillLmY9ITE7ZWxzZSBpZihyPT09TnVtYmVyKWUuZj0wO2Vsc2V7aWYociE9PVN0cmluZyl7ZT1uZXcgcjticmVhayB0fWUuZj1lLmg/XCIwXCI6XCJcIn19ZT1lLmZ9cmV0dXJuIGV9ZnVuY3Rpb24gYih0LG4pe3JldHVybiB0LmZbbl0uZz9udWxsIT10LmFbbl0/dC5hW25dLmxlbmd0aDowOm51bGwhPXQuYVtuXT8xOjB9ZnVuY3Rpb24gbSh0LG4sZSl7dC5hW25dPWUsdC5iJiYodC5iW25dPWUpfWZ1bmN0aW9uIHkodCxuKXt2YXIgZSxyPVtdO2ZvcihlIGluIG4pMCE9ZSYmci5wdXNoKG5ldyBzKGUsbltlXSkpO3JldHVybiBuZXcgbyh0LHIpfS8qXG5cbiBQcm90b2NvbCBCdWZmZXIgMiBDb3B5cmlnaHQgMjAwOCBHb29nbGUgSW5jLlxuIEFsbCBvdGhlciBjb2RlIGNvcHlyaWdodCBpdHMgcmVzcGVjdGl2ZSBvd25lcnMuXG4gQ29weXJpZ2h0IChDKSAyMDEwIFRoZSBMaWJwaG9uZW51bWJlciBBdXRob3JzXG5cbiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG4gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuZnVuY3Rpb24gdigpe2YuY2FsbCh0aGlzKX1mdW5jdGlvbiBkKCl7Zi5jYWxsKHRoaXMpfWZ1bmN0aW9uIF8oKXtmLmNhbGwodGhpcyl9ZnVuY3Rpb24gUygpe31mdW5jdGlvbiB3KCl7fWZ1bmN0aW9uIEEoKXt9LypcblxuIENvcHlyaWdodCAoQykgMjAxMCBUaGUgTGlicGhvbmVudW1iZXIgQXV0aG9ycy5cblxuIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5mdW5jdGlvbiB4KCl7dGhpcy5hPXt9fWZ1bmN0aW9uIE4odCxuKXtpZihudWxsPT1uKXJldHVybiBudWxsO249bi50b1VwcGVyQ2FzZSgpO3ZhciBlPXQuYVtuXTtpZihudWxsPT1lKXtpZihlPXR0W25dLG51bGw9PWUpcmV0dXJuIG51bGw7ZT0obmV3IEEpLmEoXy5pKCksZSksdC5hW25dPWV9cmV0dXJuIGV9ZnVuY3Rpb24gaih0KXtyZXR1cm4gdD1XW3RdLG51bGw9PXQ/XCJaWlwiOnRbMF19ZnVuY3Rpb24gJCh0KXt0aGlzLkg9UmVnRXhwKFwi4oCIXCIpLHRoaXMuQj1cIlwiLHRoaXMubT1uZXcgZSx0aGlzLnY9XCJcIix0aGlzLmg9bmV3IGUsdGhpcy51PW5ldyBlLHRoaXMuaj0hMCx0aGlzLnc9dGhpcy5vPXRoaXMuRD0hMSx0aGlzLkY9eC5iKCksdGhpcy5zPTAsdGhpcy5iPW5ldyBlLHRoaXMuQT0hMSx0aGlzLmw9XCJcIix0aGlzLmE9bmV3IGUsdGhpcy5mPVtdLHRoaXMuQz10LHRoaXMuSj10aGlzLmc9Qyh0aGlzLHRoaXMuQyl9ZnVuY3Rpb24gQyh0LG4pe3ZhciBlO2lmKG51bGwhPW4mJmlzTmFOKG4pJiZuLnRvVXBwZXJDYXNlKClpbiB0dCl7aWYoZT1OKHQuRixuKSxudWxsPT1lKXRocm93XCJJbnZhbGlkIHJlZ2lvbiBjb2RlOiBcIituO2U9ZyhlLDEwKX1lbHNlIGU9MDtyZXR1cm4gZT1OKHQuRixqKGUpKSxudWxsIT1lP2U6YXR9ZnVuY3Rpb24gQih0KXtmb3IodmFyIG49dC5mLmxlbmd0aCxlPTA7bj5lOysrZSl7dmFyIGk9dC5mW2VdLGE9ZyhpLDEpO2lmKHQudj09YSlyZXR1cm4hMTt2YXIgbDtsPXQ7dmFyIG89aSx1PWcobywxKTtpZigtMSE9dS5pbmRleE9mKFwifFwiKSlsPSExO2Vsc2V7dT11LnJlcGxhY2UobHQsXCJcXFxcZFwiKSx1PXUucmVwbGFjZShvdCxcIlxcXFxkXCIpLHIobC5tKTt2YXIgcztzPWw7dmFyIG89ZyhvLDIpLGY9XCI5OTk5OTk5OTk5OTk5OTlcIi5tYXRjaCh1KVswXTtmLmxlbmd0aDxzLmEuYi5sZW5ndGg/cz1cIlwiOihzPWYucmVwbGFjZShuZXcgUmVnRXhwKHUsXCJnXCIpLG8pLHM9cy5yZXBsYWNlKFJlZ0V4cChcIjlcIixcImdcIiksXCLigIhcIikpLDA8cy5sZW5ndGg/KGwubS5hKHMpLGw9ITApOmw9ITF9aWYobClyZXR1cm4gdC52PWEsdC5BPXN0LnRlc3QoaChpLDQpKSx0LnM9MCwhMH1yZXR1cm4gdC5qPSExfWZ1bmN0aW9uIEUodCxuKXtmb3IodmFyIGU9W10scj1uLmxlbmd0aC0zLGk9dC5mLmxlbmd0aCxhPTA7aT5hOysrYSl7dmFyIGw9dC5mW2FdOzA9PWIobCwzKT9lLnB1c2godC5mW2FdKToobD1oKGwsMyxNYXRoLm1pbihyLGIobCwzKS0xKSksMD09bi5zZWFyY2gobCkmJmUucHVzaCh0LmZbYV0pKX10LmY9ZX1mdW5jdGlvbiBSKHQsbil7dC5oLmEobik7dmFyIGU9bjtpZihydC50ZXN0KGUpfHwxPT10LmguYi5sZW5ndGgmJmV0LnRlc3QoZSkpe3ZhciBpLGU9bjtcIitcIj09ZT8oaT1lLHQudS5hKGUpKTooaT1udFtlXSx0LnUuYShpKSx0LmEuYShpKSksbj1pfWVsc2UgdC5qPSExLHQuRD0hMDtpZighdC5qKXtpZighdC5EKWlmKFYodCkpe2lmKFAodCkpcmV0dXJuIEQodCl9ZWxzZSBpZigwPHQubC5sZW5ndGgmJihlPXQuYS50b1N0cmluZygpLHIodC5hKSx0LmEuYSh0LmwpLHQuYS5hKGUpLGU9dC5iLnRvU3RyaW5nKCksaT1lLmxhc3RJbmRleE9mKHQubCkscih0LmIpLHQuYi5hKGUuc3Vic3RyaW5nKDAsaSkpKSx0LmwhPVUodCkpcmV0dXJuIHQuYi5hKFwiIFwiKSxEKHQpO3JldHVybiB0LmgudG9TdHJpbmcoKX1zd2l0Y2godC51LmIubGVuZ3RoKXtjYXNlIDA6Y2FzZSAxOmNhc2UgMjpyZXR1cm4gdC5oLnRvU3RyaW5nKCk7Y2FzZSAzOmlmKCFWKHQpKXJldHVybiB0Lmw9VSh0KSxGKHQpO3Qudz0hMDtkZWZhdWx0OnJldHVybiB0Lnc/KFAodCkmJih0Lnc9ITEpLHQuYi50b1N0cmluZygpK3QuYS50b1N0cmluZygpKTowPHQuZi5sZW5ndGg/KGU9VCh0LG4pLGk9SSh0KSwwPGkubGVuZ3RoP2k6KEUodCx0LmEudG9TdHJpbmcoKSksQih0KT9HKHQpOnQuaj9NKHQsZSk6dC5oLnRvU3RyaW5nKCkpKTpGKHQpfX1mdW5jdGlvbiBEKHQpe3JldHVybiB0Lmo9ITAsdC53PSExLHQuZj1bXSx0LnM9MCxyKHQubSksdC52PVwiXCIsRih0KX1mdW5jdGlvbiBJKHQpe2Zvcih2YXIgbj10LmEudG9TdHJpbmcoKSxlPXQuZi5sZW5ndGgscj0wO2U+cjsrK3Ipe3ZhciBpPXQuZltyXSxhPWcoaSwxKTtpZihuZXcgUmVnRXhwKFwiXig/OlwiK2ErXCIpJFwiKS50ZXN0KG4pKXJldHVybiB0LkE9c3QudGVzdChoKGksNCkpLG49bi5yZXBsYWNlKG5ldyBSZWdFeHAoYSxcImdcIiksaChpLDIpKSxNKHQsbil9cmV0dXJuXCJcIn1mdW5jdGlvbiBNKHQsbil7dmFyIGU9dC5iLmIubGVuZ3RoO3JldHVybiB0LkEmJmU+MCYmXCIgXCIhPXQuYi50b1N0cmluZygpLmNoYXJBdChlLTEpP3QuYitcIiBcIituOnQuYitufWZ1bmN0aW9uIEYodCl7dmFyIG49dC5hLnRvU3RyaW5nKCk7aWYoMzw9bi5sZW5ndGgpe2Zvcih2YXIgZT10Lm8mJjA8Yih0LmcsMjApP2ModC5nLDIwKXx8W106Yyh0LmcsMTkpfHxbXSxyPWUubGVuZ3RoLGk9MDtyPmk7KytpKXt2YXIgYSxsPWVbaV07KGE9bnVsbD09dC5nLmFbMTJdfHx0Lm98fGgobCw2KSl8fChhPWcobCw0KSxhPTA9PWEubGVuZ3RofHxpdC50ZXN0KGEpKSxhJiZ1dC50ZXN0KGcobCwyKSkmJnQuZi5wdXNoKGwpfXJldHVybiBFKHQsbiksbj1JKHQpLDA8bi5sZW5ndGg/bjpCKHQpP0codCk6dC5oLnRvU3RyaW5nKCl9cmV0dXJuIE0odCxuKX1mdW5jdGlvbiBHKHQpe3ZhciBuPXQuYS50b1N0cmluZygpLGU9bi5sZW5ndGg7aWYoZT4wKXtmb3IodmFyIHI9XCJcIixpPTA7ZT5pO2krKylyPVQodCxuLmNoYXJBdChpKSk7cmV0dXJuIHQuaj9NKHQscik6dC5oLnRvU3RyaW5nKCl9cmV0dXJuIHQuYi50b1N0cmluZygpfWZ1bmN0aW9uIFUodCl7dmFyIG4sZT10LmEudG9TdHJpbmcoKSxpPTA7cmV0dXJuIDEhPWgodC5nLDEwKT9uPSExOihuPXQuYS50b1N0cmluZygpLG49XCIxXCI9PW4uY2hhckF0KDApJiZcIjBcIiE9bi5jaGFyQXQoMSkmJlwiMVwiIT1uLmNoYXJBdCgxKSksbj8oaT0xLHQuYi5hKFwiMVwiKS5hKFwiIFwiKSx0Lm89ITApOm51bGwhPXQuZy5hWzE1XSYmKG49bmV3IFJlZ0V4cChcIl4oPzpcIitoKHQuZywxNSkrXCIpXCIpLG49ZS5tYXRjaChuKSxudWxsIT1uJiZudWxsIT1uWzBdJiYwPG5bMF0ubGVuZ3RoJiYodC5vPSEwLGk9blswXS5sZW5ndGgsdC5iLmEoZS5zdWJzdHJpbmcoMCxpKSkpKSxyKHQuYSksdC5hLmEoZS5zdWJzdHJpbmcoaSkpLGUuc3Vic3RyaW5nKDAsaSl9ZnVuY3Rpb24gVih0KXt2YXIgbj10LnUudG9TdHJpbmcoKSxlPW5ldyBSZWdFeHAoXCJeKD86XFxcXCt8XCIraCh0LmcsMTEpK1wiKVwiKSxlPW4ubWF0Y2goZSk7cmV0dXJuIG51bGwhPWUmJm51bGwhPWVbMF0mJjA8ZVswXS5sZW5ndGg/KHQubz0hMCxlPWVbMF0ubGVuZ3RoLHIodC5hKSx0LmEuYShuLnN1YnN0cmluZyhlKSkscih0LmIpLHQuYi5hKG4uc3Vic3RyaW5nKDAsZSkpLFwiK1wiIT1uLmNoYXJBdCgwKSYmdC5iLmEoXCIgXCIpLCEwKTohMX1mdW5jdGlvbiBQKHQpe2lmKDA9PXQuYS5iLmxlbmd0aClyZXR1cm4hMTt2YXIgbixpPW5ldyBlO3Q6e2lmKG49dC5hLnRvU3RyaW5nKCksMCE9bi5sZW5ndGgmJlwiMFwiIT1uLmNoYXJBdCgwKSlmb3IodmFyIGEsbD1uLmxlbmd0aCxvPTE7Mz49byYmbD49bzsrK28paWYoYT1wYXJzZUludChuLnN1YnN0cmluZygwLG8pLDEwKSxhIGluIFcpe2kuYShuLnN1YnN0cmluZyhvKSksbj1hO2JyZWFrIHR9bj0wfXJldHVybiAwPT1uPyExOihyKHQuYSksdC5hLmEoaS50b1N0cmluZygpKSxpPWoobiksXCIwMDFcIj09aT90Lmc9Tih0LkYsXCJcIituKTppIT10LkMmJih0Lmc9Qyh0LGkpKSx0LmIuYShcIlwiK24pLmEoXCIgXCIpLHQubD1cIlwiLCEwKX1mdW5jdGlvbiBUKHQsbil7dmFyIGU9dC5tLnRvU3RyaW5nKCk7aWYoMDw9ZS5zdWJzdHJpbmcodC5zKS5zZWFyY2godC5IKSl7dmFyIGk9ZS5zZWFyY2godC5IKSxlPWUucmVwbGFjZSh0Lkgsbik7cmV0dXJuIHIodC5tKSx0Lm0uYShlKSx0LnM9aSxlLnN1YnN0cmluZygwLHQucysxKX1yZXR1cm4gMT09dC5mLmxlbmd0aCYmKHQuaj0hMSksdC52PVwiXCIsdC5oLnRvU3RyaW5nKCl9dmFyIEg9dGhpcztlLnByb3RvdHlwZS5iPVwiXCIsZS5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYj1cIlwiK3R9LGUucHJvdG90eXBlLmE9ZnVuY3Rpb24odCxuLGUpe2lmKHRoaXMuYis9U3RyaW5nKHQpLG51bGwhPW4pZm9yKHZhciByPTE7cjxhcmd1bWVudHMubGVuZ3RoO3IrKyl0aGlzLmIrPWFyZ3VtZW50c1tyXTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ifTt2YXIgSz0xLFk9MixxPTMsSj00LEw9NixPPTE2LGs9MTg7Zi5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKHQsbil7bSh0aGlzLHQuYixuKX0sZi5wcm90b3R5cGUuY2xvbmU9ZnVuY3Rpb24oKXt2YXIgdD1uZXcgdGhpcy5jb25zdHJ1Y3RvcjtyZXR1cm4gdCE9dGhpcyYmKHQuYT17fSx0LmImJih0LmI9e30pLHAodCx0aGlzKSksdH07dmFyIFo7bih2LGYpO3ZhciB6O24oZCxmKTt2YXIgWDtuKF8sZiksdi5wcm90b3R5cGUuaT1mdW5jdGlvbigpe3JldHVybiBafHwoWj15KHYsezA6e25hbWU6XCJOdW1iZXJGb3JtYXRcIixJOlwiaTE4bi5waG9uZW51bWJlcnMuTnVtYmVyRm9ybWF0XCJ9LDE6e25hbWU6XCJwYXR0ZXJuXCIscmVxdWlyZWQ6ITAsYzo5LHR5cGU6U3RyaW5nfSwyOntuYW1lOlwiZm9ybWF0XCIscmVxdWlyZWQ6ITAsYzo5LHR5cGU6U3RyaW5nfSwzOntuYW1lOlwibGVhZGluZ19kaWdpdHNfcGF0dGVyblwiLEc6ITAsYzo5LHR5cGU6U3RyaW5nfSw0OntuYW1lOlwibmF0aW9uYWxfcHJlZml4X2Zvcm1hdHRpbmdfcnVsZVwiLGM6OSx0eXBlOlN0cmluZ30sNjp7bmFtZTpcIm5hdGlvbmFsX3ByZWZpeF9vcHRpb25hbF93aGVuX2Zvcm1hdHRpbmdcIixjOjgsdHlwZTpCb29sZWFufSw1OntuYW1lOlwiZG9tZXN0aWNfY2Fycmllcl9jb2RlX2Zvcm1hdHRpbmdfcnVsZVwiLGM6OSx0eXBlOlN0cmluZ319KSksWn0sdi5jdG9yPXYsdi5jdG9yLmk9di5wcm90b3R5cGUuaSxkLnByb3RvdHlwZS5pPWZ1bmN0aW9uKCl7cmV0dXJuIHp8fCh6PXkoZCx7MDp7bmFtZTpcIlBob25lTnVtYmVyRGVzY1wiLEk6XCJpMThuLnBob25lbnVtYmVycy5QaG9uZU51bWJlckRlc2NcIn0sMjp7bmFtZTpcIm5hdGlvbmFsX251bWJlcl9wYXR0ZXJuXCIsYzo5LHR5cGU6U3RyaW5nfSwzOntuYW1lOlwicG9zc2libGVfbnVtYmVyX3BhdHRlcm5cIixjOjksdHlwZTpTdHJpbmd9LDY6e25hbWU6XCJleGFtcGxlX251bWJlclwiLGM6OSx0eXBlOlN0cmluZ30sNzp7bmFtZTpcIm5hdGlvbmFsX251bWJlcl9tYXRjaGVyX2RhdGFcIixjOjEyLHR5cGU6U3RyaW5nfSw4OntuYW1lOlwicG9zc2libGVfbnVtYmVyX21hdGNoZXJfZGF0YVwiLGM6MTIsdHlwZTpTdHJpbmd9fSkpLHp9LGQuY3Rvcj1kLGQuY3Rvci5pPWQucHJvdG90eXBlLmksXy5wcm90b3R5cGUuaT1mdW5jdGlvbigpe3JldHVybiBYfHwoWD15KF8sezA6e25hbWU6XCJQaG9uZU1ldGFkYXRhXCIsSTpcImkxOG4ucGhvbmVudW1iZXJzLlBob25lTWV0YWRhdGFcIn0sMTp7bmFtZTpcImdlbmVyYWxfZGVzY1wiLGM6MTEsdHlwZTpkfSwyOntuYW1lOlwiZml4ZWRfbGluZVwiLGM6MTEsdHlwZTpkfSwzOntuYW1lOlwibW9iaWxlXCIsYzoxMSx0eXBlOmR9LDQ6e25hbWU6XCJ0b2xsX2ZyZWVcIixjOjExLHR5cGU6ZH0sNTp7bmFtZTpcInByZW1pdW1fcmF0ZVwiLGM6MTEsdHlwZTpkfSw2OntuYW1lOlwic2hhcmVkX2Nvc3RcIixjOjExLHR5cGU6ZH0sNzp7bmFtZTpcInBlcnNvbmFsX251bWJlclwiLGM6MTEsdHlwZTpkfSw4OntuYW1lOlwidm9pcFwiLGM6MTEsdHlwZTpkfSwyMTp7bmFtZTpcInBhZ2VyXCIsYzoxMSx0eXBlOmR9LDI1OntuYW1lOlwidWFuXCIsYzoxMSx0eXBlOmR9LDI3OntuYW1lOlwiZW1lcmdlbmN5XCIsYzoxMSx0eXBlOmR9LDI4OntuYW1lOlwidm9pY2VtYWlsXCIsYzoxMSx0eXBlOmR9LDI0OntuYW1lOlwibm9faW50ZXJuYXRpb25hbF9kaWFsbGluZ1wiLGM6MTEsdHlwZTpkfSw5OntuYW1lOlwiaWRcIixyZXF1aXJlZDohMCxjOjksdHlwZTpTdHJpbmd9LDEwOntuYW1lOlwiY291bnRyeV9jb2RlXCIsYzo1LHR5cGU6TnVtYmVyfSwxMTp7bmFtZTpcImludGVybmF0aW9uYWxfcHJlZml4XCIsYzo5LHR5cGU6U3RyaW5nfSwxNzp7bmFtZTpcInByZWZlcnJlZF9pbnRlcm5hdGlvbmFsX3ByZWZpeFwiLGM6OSx0eXBlOlN0cmluZ30sMTI6e25hbWU6XCJuYXRpb25hbF9wcmVmaXhcIixjOjksdHlwZTpTdHJpbmd9LDEzOntuYW1lOlwicHJlZmVycmVkX2V4dG5fcHJlZml4XCIsYzo5LHR5cGU6U3RyaW5nfSwxNTp7bmFtZTpcIm5hdGlvbmFsX3ByZWZpeF9mb3JfcGFyc2luZ1wiLGM6OSx0eXBlOlN0cmluZ30sMTY6e25hbWU6XCJuYXRpb25hbF9wcmVmaXhfdHJhbnNmb3JtX3J1bGVcIixjOjksdHlwZTpTdHJpbmd9LDE4OntuYW1lOlwic2FtZV9tb2JpbGVfYW5kX2ZpeGVkX2xpbmVfcGF0dGVyblwiLGM6OCxkZWZhdWx0VmFsdWU6ITEsdHlwZTpCb29sZWFufSwxOTp7bmFtZTpcIm51bWJlcl9mb3JtYXRcIixHOiEwLGM6MTEsdHlwZTp2fSwyMDp7bmFtZTpcImludGxfbnVtYmVyX2Zvcm1hdFwiLEc6ITAsYzoxMSx0eXBlOnZ9LDIyOntuYW1lOlwibWFpbl9jb3VudHJ5X2Zvcl9jb2RlXCIsYzo4LGRlZmF1bHRWYWx1ZTohMSx0eXBlOkJvb2xlYW59LDIzOntuYW1lOlwibGVhZGluZ19kaWdpdHNcIixjOjksdHlwZTpTdHJpbmd9LDI2OntuYW1lOlwibGVhZGluZ196ZXJvX3Bvc3NpYmxlXCIsYzo4LGRlZmF1bHRWYWx1ZTohMSx0eXBlOkJvb2xlYW59fSkpLFh9LF8uY3Rvcj1fLF8uY3Rvci5pPV8ucHJvdG90eXBlLmksUy5wcm90b3R5cGUuYT1mdW5jdGlvbih0KXt0aHJvdyBuZXcgdC5iLEVycm9yKFwiVW5pbXBsZW1lbnRlZFwiKX0sUy5wcm90b3R5cGUuYj1mdW5jdGlvbih0LG4pe2lmKDExPT10LmF8fDEwPT10LmEpcmV0dXJuIG4gaW5zdGFuY2VvZiBmP246dGhpcy5hKHQuai5wcm90b3R5cGUuaSgpLG4pO2lmKDE0PT10LmEpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBuJiZRLnRlc3Qobikpe3ZhciBlPU51bWJlcihuKTtpZihlPjApcmV0dXJuIGV9cmV0dXJuIG59aWYoIXQuaClyZXR1cm4gbjtpZihlPXQuaixlPT09U3RyaW5nKXtpZihcIm51bWJlclwiPT10eXBlb2YgbilyZXR1cm4gU3RyaW5nKG4pfWVsc2UgaWYoZT09PU51bWJlciYmXCJzdHJpbmdcIj09dHlwZW9mIG4mJihcIkluZmluaXR5XCI9PT1ufHxcIi1JbmZpbml0eVwiPT09bnx8XCJOYU5cIj09PW58fFEudGVzdChuKSkpcmV0dXJuIE51bWJlcihuKTtyZXR1cm4gbn07dmFyIFE9L14tP1swLTldKyQvO24odyxTKSx3LnByb3RvdHlwZS5hPWZ1bmN0aW9uKHQsbil7dmFyIGU9bmV3IHQuYjtyZXR1cm4gZS5nPXRoaXMsZS5hPW4sZS5iPXt9LGV9LG4oQSx3KSxBLnByb3RvdHlwZS5iPWZ1bmN0aW9uKHQsbil7cmV0dXJuIDg9PXQuYT8hIW46Uy5wcm90b3R5cGUuYi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LEEucHJvdG90eXBlLmE9ZnVuY3Rpb24odCxuKXtyZXR1cm4gQS5NLmEuY2FsbCh0aGlzLHQsbil9Oy8qXG5cbiBDb3B5cmlnaHQgKEMpIDIwMTAgVGhlIExpYnBob25lbnVtYmVyIEF1dGhvcnNcblxuIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG52YXIgVz17MTpcIlVTIEFHIEFJIEFTIEJCIEJNIEJTIENBIERNIERPIEdEIEdVIEpNIEtOIEtZIExDIE1QIE1TIFBSIFNYIFRDIFRUIFZDIFZHIFZJXCIuc3BsaXQoXCIgXCIpfSx0dD17VVM6W251bGwsW251bGwsbnVsbCxcIlsyLTldXFxcXGR7OX1cIixcIlxcXFxkezd9KD86XFxcXGR7M30pP1wiXSxbbnVsbCxudWxsLFwiKD86Mig/OjBbMS0zNS05XXwxWzAyLTldfDJbMDQ1ODldfDNbMTQ5XXw0WzA4XXw1WzEtNDZdfDZbMDI3OV18N1swMjZdfDhbMTNdKXwzKD86MFsxLTU3LTldfDFbMDItOV18MlswMTM1XXwzWzAxNDY3OV18NFs2N118NVsxMl18NlswMTRdfDhbMDU2XSl8NCg/OjBbMTI0LTldfDFbMDItNTc5XXwyWzMtNV18M1swMjQ1XXw0WzAyMzVdfDU4fDY5fDdbMDU4OV18OFswNF0pfDUoPzowWzEtNTctOV18MVswMjM1LThdfDIwfDNbMDE0OV18NFswMV18NVsxOV18NlsxLTM3XXw3WzAxMy01XXw4WzA1Nl0pfDYoPzowWzEtMzUtOV18MVswMjQtOV18MlswMzY4OV18M1swMTZdfDRbMTZdfDVbMDE3XXw2WzAtMjc5XXw3OHw4WzEyXSl8Nyg/OjBbMS00Ni04XXwxWzAyLTldfDJbMDQ1N118M1sxMjQ3XXw0WzAzN118NVs0N118NlswMjM1OV18N1swMi01OV18OFsxNTZdKXw4KD86MFsxLTY4XXwxWzAyLThdfDI4fDNbMC0yNV18NFszNTc4XXw1WzA0Ni05XXw2WzAyLTVdfDdbMDI4XSl8OSg/OjBbMTM0Ni05XXwxWzAyLTldfDJbMDU4OV18M1swMTY3OF18NFswMTc5XXw1WzEyNDY5XXw3WzAtMzU4OV18OFswNDU5XSkpWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7N30oPzpcXFxcZHszfSk/XCIsbnVsbCxudWxsLFwiMjAxNTU1NTU1NVwiXSxbbnVsbCxudWxsLFwiKD86Mig/OjBbMS0zNS05XXwxWzAyLTldfDJbMDQ1ODldfDNbMTQ5XXw0WzA4XXw1WzEtNDZdfDZbMDI3OV18N1swMjZdfDhbMTNdKXwzKD86MFsxLTU3LTldfDFbMDItOV18MlswMTM1XXwzWzAxNDY3OV18NFs2N118NVsxMl18NlswMTRdfDhbMDU2XSl8NCg/OjBbMTI0LTldfDFbMDItNTc5XXwyWzMtNV18M1swMjQ1XXw0WzAyMzVdfDU4fDY5fDdbMDU4OV18OFswNF0pfDUoPzowWzEtNTctOV18MVswMjM1LThdfDIwfDNbMDE0OV18NFswMV18NVsxOV18NlsxLTM3XXw3WzAxMy01XXw4WzA1Nl0pfDYoPzowWzEtMzUtOV18MVswMjQtOV18MlswMzY4OV18M1swMTZdfDRbMTZdfDVbMDE3XXw2WzAtMjc5XXw3OHw4WzEyXSl8Nyg/OjBbMS00Ni04XXwxWzAyLTldfDJbMDQ1N118M1sxMjQ3XXw0WzAzN118NVs0N118NlswMjM1OV18N1swMi01OV18OFsxNTZdKXw4KD86MFsxLTY4XXwxWzAyLThdfDI4fDNbMC0yNV18NFszNTc4XXw1WzA0Ni05XXw2WzAyLTVdfDdbMDI4XSl8OSg/OjBbMTM0Ni05XXwxWzAyLTldfDJbMDU4OV18M1swMTY3OF18NFswMTc5XXw1WzEyNDY5XXw3WzAtMzU4OV18OFswNDU5XSkpWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7N30oPzpcXFxcZHszfSk/XCIsbnVsbCxudWxsLFwiMjAxNTU1NTU1NVwiXSxbbnVsbCxudWxsLFwiOCg/OjAwfDQ0fDU1fDY2fDc3fDg4KVsyLTldXFxcXGR7Nn1cIixcIlxcXFxkezEwfVwiLG51bGwsbnVsbCxcIjgwMDIzNDU2NzhcIl0sW251bGwsbnVsbCxcIjkwMFsyLTldXFxcXGR7Nn1cIixcIlxcXFxkezEwfVwiLG51bGwsbnVsbCxcIjkwMDIzNDU2NzhcIl0sW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXSxbbnVsbCxudWxsLFwiNSg/OjAwfDMzfDQ0fDY2fDc3fDg4KVsyLTldXFxcXGR7Nn1cIixcIlxcXFxkezEwfVwiLG51bGwsbnVsbCxcIjUwMDIzNDU2NzhcIl0sW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXSxcIlVTXCIsMSxcIjAxMVwiLFwiMVwiLG51bGwsbnVsbCxcIjFcIixudWxsLG51bGwsMSxbW251bGwsXCIoXFxcXGR7M30pKFxcXFxkezR9KVwiLFwiJDEtJDJcIixudWxsLG51bGwsbnVsbCwxXSxbbnVsbCxcIihcXFxcZHszfSkoXFxcXGR7M30pKFxcXFxkezR9KVwiLFwiKCQxKSAkMi0kM1wiLG51bGwsbnVsbCxudWxsLDFdXSxbW251bGwsXCIoXFxcXGR7M30pKFxcXFxkezN9KShcXFxcZHs0fSlcIixcIiQxLSQyLSQzXCJdXSxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdLDEsbnVsbCxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl0sbnVsbCxudWxsLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl1dfTt4LmI9ZnVuY3Rpb24oKXtyZXR1cm4geC5hP3guYTp4LmE9bmV3IHh9O3ZhciBudD17MDpcIjBcIiwxOlwiMVwiLDI6XCIyXCIsMzpcIjNcIiw0OlwiNFwiLDU6XCI1XCIsNjpcIjZcIiw3OlwiN1wiLDg6XCI4XCIsOTpcIjlcIixcIu+8kFwiOlwiMFwiLFwi77yRXCI6XCIxXCIsXCLvvJJcIjpcIjJcIixcIu+8k1wiOlwiM1wiLFwi77yUXCI6XCI0XCIsXCLvvJVcIjpcIjVcIixcIu+8llwiOlwiNlwiLFwi77yXXCI6XCI3XCIsXCLvvJhcIjpcIjhcIixcIu+8mVwiOlwiOVwiLFwi2aBcIjpcIjBcIixcItmhXCI6XCIxXCIsXCLZolwiOlwiMlwiLFwi2aNcIjpcIjNcIixcItmkXCI6XCI0XCIsXCLZpVwiOlwiNVwiLFwi2aZcIjpcIjZcIixcItmnXCI6XCI3XCIsXCLZqFwiOlwiOFwiLFwi2alcIjpcIjlcIixcItuwXCI6XCIwXCIsXCLbsVwiOlwiMVwiLFwi27JcIjpcIjJcIixcItuzXCI6XCIzXCIsXCLbtFwiOlwiNFwiLFwi27VcIjpcIjVcIixcItu2XCI6XCI2XCIsXCLbt1wiOlwiN1wiLFwi27hcIjpcIjhcIixcItu5XCI6XCI5XCJ9LGV0PVJlZ0V4cChcIlsr77yLXStcIikscnQ9UmVnRXhwKFwiKFswLTnvvJAt77yZ2aAt2anbsC3buV0pXCIpLGl0PS9eXFwoP1xcJDFcXCk/JC8sYXQ9bmV3IF87bShhdCwxMSxcIk5BXCIpO3ZhciBsdD0vXFxbKFteXFxbXFxdXSkqXFxdL2csb3Q9L1xcZCg/PVteLH1dW14sfV0pL2csdXQ9UmVnRXhwKFwiXlsteOKAkC3igJXiiJLjg7zvvI0t77yPIMKgwq3igIvigaDjgIAoKe+8iO+8ie+8u++8vS5cXFxcW1xcXFxdL37igZPiiLzvvZ5dKihcXFxcJFxcXFxkWy144oCQLeKAleKIkuODvO+8jS3vvI8gwqDCreKAi+KBoOOAgCgp77yI77yJ77y777y9LlxcXFxbXFxcXF0vfuKBk+KIvO+9nl0qKSskXCIpLHN0PS9bLSBdLzskLnByb3RvdHlwZS5LPWZ1bmN0aW9uKCl7dGhpcy5CPVwiXCIscih0aGlzLmgpLHIodGhpcy51KSxyKHRoaXMubSksdGhpcy5zPTAsdGhpcy52PVwiXCIscih0aGlzLmIpLHRoaXMubD1cIlwiLHIodGhpcy5hKSx0aGlzLmo9ITAsdGhpcy53PXRoaXMubz10aGlzLkQ9ITEsdGhpcy5mPVtdLHRoaXMuQT0hMSx0aGlzLmchPXRoaXMuSiYmKHRoaXMuZz1DKHRoaXMsdGhpcy5DKSl9LCQucHJvdG90eXBlLkw9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuQj1SKHRoaXMsdCl9LHQoXCJDbGVhdmUuQXNZb3VUeXBlRm9ybWF0dGVyXCIsJCksdChcIkNsZWF2ZS5Bc1lvdVR5cGVGb3JtYXR0ZXIucHJvdG90eXBlLmlucHV0RGlnaXRcIiwkLnByb3RvdHlwZS5MKSx0KFwiQ2xlYXZlLkFzWW91VHlwZUZvcm1hdHRlci5wcm90b3R5cGUuY2xlYXJcIiwkLnByb3RvdHlwZS5LKX0uY2FsbChcIm9iamVjdFwiPT10eXBlb2YgZ2xvYmFsJiZnbG9iYWw/Z2xvYmFsOndpbmRvdyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY2xlYXZlLmpzL2Rpc3QvYWRkb25zL2NsZWF2ZS1waG9uZS51cy5qc1xuLy8gbW9kdWxlIGlkID0gNzJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XCJzY3JlZW4tc21hbGxcIjozNzUsXCJzY3JlZW4tbWVkaXVtXCI6NzAwLFwic2NyZWVuLWxhcmdlXCI6MTAyNCxcInNjcmVlbi14bGFyZ2VcIjoxMjAwfVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3ZhcmlhYmxlcy5qc29uXG4vLyBtb2R1bGUgaWQgPSA3M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBSZXNpemUgcmVDQVBUQ0hBIHRvIGZpdCB3aWR0aCBvZiBjb250YWluZXJcclxuLy8gU2luY2UgaXQgaGFzIGEgZml4ZWQgd2lkdGgsIHdlJ3JlIHNjYWxpbmdcclxuLy8gdXNpbmcgQ1NTMyB0cmFuc2Zvcm1zXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBjYXB0Y2hhU2NhbGUgPSBjb250YWluZXJXaWR0aCAvIGVsZW1lbnRXaWR0aFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcbiAgZnVuY3Rpb24gc2NhbGVDYXB0Y2hhKCkge1xyXG4gICAgLy8gV2lkdGggb2YgdGhlIHJlQ0FQVENIQSBlbGVtZW50LCBpbiBwaXhlbHNcclxuICAgIHZhciByZUNhcHRjaGFXaWR0aCA9IDMwNDtcclxuICAgIC8vIEdldCB0aGUgY29udGFpbmluZyBlbGVtZW50J3Mgd2lkdGhcclxuICAgIHZhciBjb250YWluZXJXaWR0aCA9ICQoJy5zbXMtZm9ybS13cmFwcGVyJykud2lkdGgoKTtcclxuICAgIFxyXG4gICAgLy8gT25seSBzY2FsZSB0aGUgcmVDQVBUQ0hBIGlmIGl0IHdvbid0IGZpdFxyXG4gICAgLy8gaW5zaWRlIHRoZSBjb250YWluZXJcclxuICAgIGlmKHJlQ2FwdGNoYVdpZHRoID4gY29udGFpbmVyV2lkdGgpIHtcclxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBzY2FsZVxyXG4gICAgICB2YXIgY2FwdGNoYVNjYWxlID0gY29udGFpbmVyV2lkdGggLyByZUNhcHRjaGFXaWR0aDtcclxuICAgICAgLy8gQXBwbHkgdGhlIHRyYW5zZm9ybWF0aW9uXHJcbiAgICAgICQoJy5nLXJlY2FwdGNoYScpLmNzcyh7XHJcbiAgICAgICAgdHJhbnNmb3JtOidzY2FsZSgnK2NhcHRjaGFTY2FsZSsnKSdcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAkKGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gSW5pdGlhbGl6ZSBzY2FsaW5nXHJcbiAgICBzY2FsZUNhcHRjaGEoKTtcclxuICB9KTtcclxuXHJcbiAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuICAgIC8vIFVwZGF0ZSBzY2FsaW5nIG9uIHdpbmRvdyByZXNpemVcclxuICAgIC8vIFVzZXMgalF1ZXJ5IHRocm90dGxlIHBsdWdpbiB0byBsaW1pdCBzdHJhaW4gb24gdGhlIGJyb3dzZXJcclxuICAgIHNjYWxlQ2FwdGNoYSgpO1xyXG4gIH0pO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvY2FwdGNoYVJlc2l6ZS5qcyIsIi8qKlxuKiBIb21lIFJvdGF0aW5nIFRleHQgQW5pbWF0aW9uXG4qIFJlZmVycmVkIGZyb20gU3RhY2tvdmVyZmxvd1xuKiBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI3NzE3ODkvY2hhbmdpbmctdGV4dC1wZXJpb2RpY2FsbHktaW4tYS1zcGFuLWZyb20tYW4tYXJyYXktd2l0aC1qcXVlcnkvMjc3MjI3OCMyNzcyMjc4XG4qL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIHRlcm1zID0gW107XG5cbiAgJCgnLnJvdGF0aW5nLXRleHRfX2VudHJ5JykuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xuICAgIGlmICgkKGUpLnRleHQoKS50cmltKCkgIT09ICcnKSB7XG4gICAgICB0ZXJtcy5wdXNoKCQoZSkudGV4dCgpKTtcbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHJvdGF0ZVRlcm0oKSB7XG4gICAgdmFyIGN0ID0gJChcIiNyb3RhdGVcIikuZGF0YShcInRlcm1cIikgfHwgMDtcbiAgICAkKFwiI3JvdGF0ZVwiKS5kYXRhKFwidGVybVwiLCBjdCA9PT0gdGVybXMubGVuZ3RoIC0xID8gMCA6IGN0ICsgMSkudGV4dCh0ZXJtc1tjdF0pLmZhZGVJbigpLmRlbGF5KDIwMDApLmZhZGVPdXQoMjAwLCByb3RhdGVUZXJtKTtcbiAgfVxuICAkKHJvdGF0ZVRlcm0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvcm90YXRpbmdUZXh0QW5pbWF0aW9uLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTWlzc1BsZXRlIGZyb20gJ21pc3MtcGxldGUtanMnO1xuXG5jbGFzcyBTZWFyY2gge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBtb2R1bGVcbiAgICovXG4gIGluaXQoKSB7XG4gICAgdGhpcy5faW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTZWFyY2guc2VsZWN0b3JzLk1BSU4pO1xuXG4gICAgaWYgKCF0aGlzLl9pbnB1dHMpIHJldHVybjtcblxuICAgIGZvciAobGV0IGkgPSB0aGlzLl9pbnB1dHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRoaXMuX3N1Z2dlc3Rpb25zKHRoaXMuX2lucHV0c1tpXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBzdWdnZXN0ZWQgc2VhcmNoIHRlcm0gZHJvcGRvd24uXG4gICAqIEBwYXJhbSAge29iamVjdH0gaW5wdXQgVGhlIHNlYXJjaCBpbnB1dC5cbiAgICovXG4gIF9zdWdnZXN0aW9ucyhpbnB1dCkge1xuICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShpbnB1dC5kYXRhc2V0LmpzU2VhcmNoU3VnZ2VzdGlvbnMpO1xuXG4gICAgaW5wdXQuX01pc3NQbGV0ZSA9IG5ldyBNaXNzUGxldGUoe1xuICAgICAgaW5wdXQ6IGlucHV0LFxuICAgICAgb3B0aW9uczogZGF0YSxcbiAgICAgIGNsYXNzTmFtZTogaW5wdXQuZGF0YXNldC5qc1NlYXJjaERyb3Bkb3duQ2xhc3NcbiAgICB9KTtcbiAgfVxufVxuXG5TZWFyY2guc2VsZWN0b3JzID0ge1xuICBNQUlOOiAnW2RhdGEtanMqPVwic2VhcmNoXCJdJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2VhcmNoO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3NlYXJjaC5qcyIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk1pc3NQbGV0ZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJNaXNzUGxldGVcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cblxuLyoqKi8gfSksXG4vKiAxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXHRcblx0dmFyIF9qYXJvV2lua2xlciA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XG5cdFxuXHR2YXIgX2phcm9XaW5rbGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2phcm9XaW5rbGVyKTtcblx0XG5cdHZhciBfbWVtb2l6ZSA9IF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5cdFxuXHR2YXIgX21lbW9pemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVtb2l6ZSk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblx0XG5cdHZhciBNaXNzUGxldGUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgZnVuY3Rpb24gTWlzc1BsZXRlKF9yZWYpIHtcblx0ICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cdFxuXHQgICAgdmFyIGlucHV0ID0gX3JlZi5pbnB1dCxcblx0ICAgICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuXHQgICAgICAgIGNsYXNzTmFtZSA9IF9yZWYuY2xhc3NOYW1lLFxuXHQgICAgICAgIF9yZWYkc2NvcmVGbiA9IF9yZWYuc2NvcmVGbixcblx0ICAgICAgICBzY29yZUZuID0gX3JlZiRzY29yZUZuID09PSB1bmRlZmluZWQgPyAoMCwgX21lbW9pemUyLmRlZmF1bHQpKE1pc3NQbGV0ZS5zY29yZUZuKSA6IF9yZWYkc2NvcmVGbixcblx0ICAgICAgICBfcmVmJGxpc3RJdGVtRm4gPSBfcmVmLmxpc3RJdGVtRm4sXG5cdCAgICAgICAgbGlzdEl0ZW1GbiA9IF9yZWYkbGlzdEl0ZW1GbiA9PT0gdW5kZWZpbmVkID8gTWlzc1BsZXRlLmxpc3RJdGVtRm4gOiBfcmVmJGxpc3RJdGVtRm47XG5cdFxuXHQgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1pc3NQbGV0ZSk7XG5cdFxuXHQgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7IGlucHV0OiBpbnB1dCwgb3B0aW9uczogb3B0aW9ucywgY2xhc3NOYW1lOiBjbGFzc05hbWUsIHNjb3JlRm46IHNjb3JlRm4sIGxpc3RJdGVtRm46IGxpc3RJdGVtRm4gfSk7XG5cdFxuXHQgICAgdGhpcy5zY29yZWRPcHRpb25zID0gbnVsbDtcblx0ICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcblx0ICAgIHRoaXMudWwgPSBudWxsO1xuXHQgICAgdGhpcy5oaWdobGlnaHRlZEluZGV4ID0gLTE7XG5cdFxuXHQgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKF90aGlzLmlucHV0LnZhbHVlLmxlbmd0aCA+IDApIHtcblx0ICAgICAgICBfdGhpcy5zY29yZWRPcHRpb25zID0gX3RoaXMub3B0aW9ucy5tYXAoZnVuY3Rpb24gKG9wdGlvbikge1xuXHQgICAgICAgICAgcmV0dXJuIHNjb3JlRm4oX3RoaXMuaW5wdXQudmFsdWUsIG9wdGlvbik7XG5cdCAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHQgICAgICAgICAgcmV0dXJuIGIuc2NvcmUgLSBhLnNjb3JlO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIF90aGlzLnNjb3JlZE9wdGlvbnMgPSBbXTtcblx0ICAgICAgfVxuXHQgICAgICBfdGhpcy5yZW5kZXJPcHRpb25zKCk7XG5cdCAgICB9KTtcblx0XG5cdCAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgaWYgKF90aGlzLnVsKSB7XG5cdCAgICAgICAgLy8gZHJvcGRvd24gdmlzaWJsZT9cblx0ICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcblx0ICAgICAgICAgIGNhc2UgMTM6XG5cdCAgICAgICAgICAgIF90aGlzLnNlbGVjdCgpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgMjc6XG5cdCAgICAgICAgICAgIC8vIEVzY1xuXHQgICAgICAgICAgICBfdGhpcy5yZW1vdmVEcm9wZG93bigpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgNDA6XG5cdCAgICAgICAgICAgIC8vIERvd24gYXJyb3dcblx0ICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHVwIGFycm93IHBsYWNlcyB0aGUgY3Vyc29yIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlXG5cdCAgICAgICAgICAgIC8vIGZpZWxkLCBhbmQgZG93biBhcnJvdyBhdCB0aGUgZW5kXG5cdCAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgIF90aGlzLmNoYW5nZUhpZ2hsaWdodGVkT3B0aW9uKF90aGlzLmhpZ2hsaWdodGVkSW5kZXggPCBfdGhpcy51bC5jaGlsZHJlbi5sZW5ndGggLSAxID8gX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCArIDEgOiAtMSk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgY2FzZSAzODpcblx0ICAgICAgICAgICAgLy8gVXAgYXJyb3dcblx0ICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgICAgICAgX3RoaXMuY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24oX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCA+IC0xID8gX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCAtIDEgOiBfdGhpcy51bC5jaGlsZHJlbi5sZW5ndGggLSAxKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9KTtcblx0XG5cdCAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgX3RoaXMucmVtb3ZlRHJvcGRvd24oKTtcblx0ICAgICAgX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCA9IC0xO1xuXHQgICAgfSk7XG5cdCAgfSAvLyBlbmQgY29uc3RydWN0b3Jcblx0XG5cdCAgX2NyZWF0ZUNsYXNzKE1pc3NQbGV0ZSwgW3tcblx0ICAgIGtleTogJ2dldFNpYmxpbmdJbmRleCcsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U2libGluZ0luZGV4KG5vZGUpIHtcblx0ICAgICAgdmFyIGluZGV4ID0gLTE7XG5cdCAgICAgIHZhciBuID0gbm9kZTtcblx0ICAgICAgZG8ge1xuXHQgICAgICAgIGluZGV4Kys7XG5cdCAgICAgICAgbiA9IG4ucHJldmlvdXNFbGVtZW50U2libGluZztcblx0ICAgICAgfSB3aGlsZSAobik7XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH1cblx0ICB9LCB7XG5cdCAgICBrZXk6ICdyZW5kZXJPcHRpb25zJyxcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXJPcHRpb25zKCkge1xuXHQgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblx0XG5cdCAgICAgIHZhciBkb2N1bWVudEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcblx0ICAgICAgdGhpcy5zY29yZWRPcHRpb25zLmV2ZXJ5KGZ1bmN0aW9uIChzY29yZWRPcHRpb24sIGkpIHtcblx0ICAgICAgICB2YXIgbGlzdEl0ZW0gPSBfdGhpczIubGlzdEl0ZW1GbihzY29yZWRPcHRpb24sIGkpO1xuXHQgICAgICAgIGxpc3RJdGVtICYmIGRvY3VtZW50RnJhZ21lbnQuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuXHQgICAgICAgIHJldHVybiAhIWxpc3RJdGVtO1xuXHQgICAgICB9KTtcblx0XG5cdCAgICAgIHRoaXMucmVtb3ZlRHJvcGRvd24oKTtcblx0ICAgICAgdGhpcy5oaWdobGlnaHRlZEluZGV4ID0gLTE7XG5cdFxuXHQgICAgICBpZiAoZG9jdW1lbnRGcmFnbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcblx0ICAgICAgICB2YXIgbmV3VWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG5cdCAgICAgICAgbmV3VWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdCAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09ICdMSScpIHtcblx0ICAgICAgICAgICAgX3RoaXMyLmNoYW5nZUhpZ2hsaWdodGVkT3B0aW9uKF90aGlzMi5nZXRTaWJsaW5nSW5kZXgoZXZlbnQudGFyZ2V0KSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdFxuXHQgICAgICAgIG5ld1VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICBfdGhpczIuY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24oLTEpO1xuXHQgICAgICAgIH0pO1xuXHRcblx0ICAgICAgICBuZXdVbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgICAgIHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgIH0pO1xuXHRcblx0ICAgICAgICBuZXdVbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lID09PSAnTEknKSB7XG5cdCAgICAgICAgICAgIF90aGlzMi5zZWxlY3QoKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0XG5cdCAgICAgICAgbmV3VWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnRGcmFnbWVudCk7XG5cdFxuXHQgICAgICAgIC8vIFNlZSBDU1MgdG8gdW5kZXJzdGFuZCB3aHkgdGhlIDx1bD4gaGFzIHRvIGJlIHdyYXBwZWQgaW4gYSA8ZGl2PlxuXHQgICAgICAgIHZhciBuZXdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHQgICAgICAgIG5ld0NvbnRhaW5lci5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZTtcblx0ICAgICAgICBuZXdDb250YWluZXIuYXBwZW5kQ2hpbGQobmV3VWwpO1xuXHRcblx0ICAgICAgICAvLyBJbnNlcnRzIHRoZSBkcm9wZG93biBqdXN0IGFmdGVyIHRoZSA8aW5wdXQ+IGVsZW1lbnRcblx0ICAgICAgICB0aGlzLmlucHV0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld0NvbnRhaW5lciwgdGhpcy5pbnB1dC5uZXh0U2libGluZyk7XG5cdCAgICAgICAgdGhpcy5jb250YWluZXIgPSBuZXdDb250YWluZXI7XG5cdCAgICAgICAgdGhpcy51bCA9IG5ld1VsO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAnY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZUhpZ2hsaWdodGVkT3B0aW9uKG5ld0hpZ2hsaWdodGVkSW5kZXgpIHtcblx0ICAgICAgaWYgKG5ld0hpZ2hsaWdodGVkSW5kZXggPj0gLTEgJiYgbmV3SGlnaGxpZ2h0ZWRJbmRleCA8IHRoaXMudWwuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdCAgICAgICAgLy8gSWYgYW55IG9wdGlvbiBhbHJlYWR5IHNlbGVjdGVkLCB0aGVuIHVuc2VsZWN0IGl0XG5cdCAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0ZWRJbmRleCAhPT0gLTEpIHtcblx0ICAgICAgICAgIHRoaXMudWwuY2hpbGRyZW5bdGhpcy5oaWdobGlnaHRlZEluZGV4XS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlnaGxpZ2h0XCIpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgdGhpcy5oaWdobGlnaHRlZEluZGV4ID0gbmV3SGlnaGxpZ2h0ZWRJbmRleDtcblx0XG5cdCAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0ZWRJbmRleCAhPT0gLTEpIHtcblx0ICAgICAgICAgIHRoaXMudWwuY2hpbGRyZW5bdGhpcy5oaWdobGlnaHRlZEluZGV4XS5jbGFzc0xpc3QuYWRkKFwiaGlnaGxpZ2h0XCIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ3NlbGVjdCcsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gc2VsZWN0KCkge1xuXHQgICAgICBpZiAodGhpcy5oaWdobGlnaHRlZEluZGV4ICE9PSAtMSkge1xuXHQgICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSB0aGlzLnNjb3JlZE9wdGlvbnNbdGhpcy5oaWdobGlnaHRlZEluZGV4XS5kaXNwbGF5VmFsdWU7XG5cdCAgICAgICAgdGhpcy5yZW1vdmVEcm9wZG93bigpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAncmVtb3ZlRHJvcGRvd24nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZURyb3Bkb3duKCkge1xuXHQgICAgICB0aGlzLmNvbnRhaW5lciAmJiB0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcblx0ICAgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuXHQgICAgICB0aGlzLnVsID0gbnVsbDtcblx0ICAgIH1cblx0ICB9XSwgW3tcblx0ICAgIGtleTogJ3Njb3JlRm4nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIHNjb3JlRm4oaW5wdXRWYWx1ZSwgb3B0aW9uU3lub255bXMpIHtcblx0ICAgICAgdmFyIGNsb3Nlc3RTeW5vbnltID0gbnVsbDtcblx0ICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuXHQgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcblx0ICAgICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuXHRcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBvcHRpb25TeW5vbnltc1tTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcblx0ICAgICAgICAgIHZhciBzeW5vbnltID0gX3N0ZXAudmFsdWU7XG5cdFxuXHQgICAgICAgICAgdmFyIHNpbWlsYXJpdHkgPSAoMCwgX2phcm9XaW5rbGVyMi5kZWZhdWx0KShzeW5vbnltLnRyaW0oKS50b0xvd2VyQ2FzZSgpLCBpbnB1dFZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpKTtcblx0ICAgICAgICAgIGlmIChjbG9zZXN0U3lub255bSA9PT0gbnVsbCB8fCBzaW1pbGFyaXR5ID4gY2xvc2VzdFN5bm9ueW0uc2ltaWxhcml0eSkge1xuXHQgICAgICAgICAgICBjbG9zZXN0U3lub255bSA9IHsgc2ltaWxhcml0eTogc2ltaWxhcml0eSwgdmFsdWU6IHN5bm9ueW0gfTtcblx0ICAgICAgICAgICAgaWYgKHNpbWlsYXJpdHkgPT09IDEpIHtcblx0ICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuXHQgICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuXHQgICAgICB9IGZpbmFsbHkge1xuXHQgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuXHQgICAgICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSBmaW5hbGx5IHtcblx0ICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuXHQgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiB7XG5cdCAgICAgICAgc2NvcmU6IGNsb3Nlc3RTeW5vbnltLnNpbWlsYXJpdHksXG5cdCAgICAgICAgZGlzcGxheVZhbHVlOiBvcHRpb25TeW5vbnltc1swXVxuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ2xpc3RJdGVtRm4nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIGxpc3RJdGVtRm4oc2NvcmVkT3B0aW9uLCBpdGVtSW5kZXgpIHtcblx0ICAgICAgdmFyIGxpID0gaXRlbUluZGV4ID4gTWlzc1BsZXRlLk1BWF9JVEVNUyA/IG51bGwgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG5cdCAgICAgIGxpICYmIGxpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHNjb3JlZE9wdGlvbi5kaXNwbGF5VmFsdWUpKTtcblx0ICAgICAgcmV0dXJuIGxpO1xuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ01BWF9JVEVNUycsXG5cdCAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgICAgcmV0dXJuIDg7XG5cdCAgICB9XG5cdCAgfV0pO1xuXHRcblx0ICByZXR1cm4gTWlzc1BsZXRlO1xuXHR9KCk7XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBNaXNzUGxldGU7XG5cbi8qKiovIH0pLFxuLyogMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX3NsaWNlZFRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIHNsaWNlSXRlcmF0b3IoYXJyLCBpKSB7IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX2UgPSB1bmRlZmluZWQ7IHRyeSB7IGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH0gcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyByZXR1cm4gYXJyOyB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkgeyByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpOyB9IGVsc2UgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTsgfSB9OyB9KCk7XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoczEsIHMyKSB7XG5cdCAgdmFyIHByZWZpeFNjYWxpbmdGYWN0b3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDAuMjtcblx0XG5cdCAgdmFyIGphcm9TaW1pbGFyaXR5ID0gamFybyhzMSwgczIpO1xuXHRcblx0ICB2YXIgY29tbW9uUHJlZml4TGVuZ3RoID0gMDtcblx0ICBmb3IgKHZhciBpID0gMDsgaSA8IHMxLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBpZiAoczFbaV0gPT09IHMyW2ldKSB7XG5cdCAgICAgIGNvbW1vblByZWZpeExlbmd0aCsrO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgYnJlYWs7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gamFyb1NpbWlsYXJpdHkgKyBNYXRoLm1pbihjb21tb25QcmVmaXhMZW5ndGgsIDQpICogcHJlZml4U2NhbGluZ0ZhY3RvciAqICgxIC0gamFyb1NpbWlsYXJpdHkpO1xuXHR9O1xuXHRcblx0Ly8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSmFybyVFMiU4MCU5M1dpbmtsZXJfZGlzdGFuY2Vcblx0XG5cdGZ1bmN0aW9uIGphcm8oczEsIHMyKSB7XG5cdCAgdmFyIHNob3J0ZXIgPSB2b2lkIDAsXG5cdCAgICAgIGxvbmdlciA9IHZvaWQgMDtcblx0XG5cdCAgdmFyIF9yZWYgPSBzMS5sZW5ndGggPiBzMi5sZW5ndGggPyBbczEsIHMyXSA6IFtzMiwgczFdO1xuXHRcblx0ICB2YXIgX3JlZjIgPSBfc2xpY2VkVG9BcnJheShfcmVmLCAyKTtcblx0XG5cdCAgbG9uZ2VyID0gX3JlZjJbMF07XG5cdCAgc2hvcnRlciA9IF9yZWYyWzFdO1xuXHRcblx0XG5cdCAgdmFyIG1hdGNoaW5nV2luZG93ID0gTWF0aC5mbG9vcihsb25nZXIubGVuZ3RoIC8gMikgLSAxO1xuXHQgIHZhciBzaG9ydGVyTWF0Y2hlcyA9IFtdO1xuXHQgIHZhciBsb25nZXJNYXRjaGVzID0gW107XG5cdFxuXHQgIGZvciAodmFyIGkgPSAwOyBpIDwgc2hvcnRlci5sZW5ndGg7IGkrKykge1xuXHQgICAgdmFyIGNoID0gc2hvcnRlcltpXTtcblx0ICAgIHZhciB3aW5kb3dTdGFydCA9IE1hdGgubWF4KDAsIGkgLSBtYXRjaGluZ1dpbmRvdyk7XG5cdCAgICB2YXIgd2luZG93RW5kID0gTWF0aC5taW4oaSArIG1hdGNoaW5nV2luZG93ICsgMSwgbG9uZ2VyLmxlbmd0aCk7XG5cdCAgICBmb3IgKHZhciBqID0gd2luZG93U3RhcnQ7IGogPCB3aW5kb3dFbmQ7IGorKykge1xuXHQgICAgICBpZiAobG9uZ2VyTWF0Y2hlc1tqXSA9PT0gdW5kZWZpbmVkICYmIGNoID09PSBsb25nZXJbal0pIHtcblx0ICAgICAgICBzaG9ydGVyTWF0Y2hlc1tpXSA9IGxvbmdlck1hdGNoZXNbal0gPSBjaDtcblx0ICAgICAgICBicmVhaztcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgdmFyIHNob3J0ZXJNYXRjaGVzU3RyaW5nID0gc2hvcnRlck1hdGNoZXMuam9pbihcIlwiKTtcblx0ICB2YXIgbG9uZ2VyTWF0Y2hlc1N0cmluZyA9IGxvbmdlck1hdGNoZXMuam9pbihcIlwiKTtcblx0ICB2YXIgbnVtTWF0Y2hlcyA9IHNob3J0ZXJNYXRjaGVzU3RyaW5nLmxlbmd0aDtcblx0XG5cdCAgdmFyIHRyYW5zcG9zaXRpb25zID0gMDtcblx0ICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgc2hvcnRlck1hdGNoZXNTdHJpbmcubGVuZ3RoOyBfaSsrKSB7XG5cdCAgICBpZiAoc2hvcnRlck1hdGNoZXNTdHJpbmdbX2ldICE9PSBsb25nZXJNYXRjaGVzU3RyaW5nW19pXSkge1xuXHQgICAgICB0cmFuc3Bvc2l0aW9ucysrO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuIG51bU1hdGNoZXMgPiAwID8gKG51bU1hdGNoZXMgLyBzaG9ydGVyLmxlbmd0aCArIG51bU1hdGNoZXMgLyBsb25nZXIubGVuZ3RoICsgKG51bU1hdGNoZXMgLSBNYXRoLmZsb29yKHRyYW5zcG9zaXRpb25zIC8gMikpIC8gbnVtTWF0Y2hlcykgLyAzLjAgOiAwO1xuXHR9XG5cbi8qKiovIH0pLFxuLyogMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoZm4pIHtcblx0ICB2YXIgY2FjaGUgPSB7fTtcblx0XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIGtleSA9IEpTT04uc3RyaW5naWZ5KGFyZ3MpO1xuXHQgICAgcmV0dXJuIGNhY2hlW2tleV0gfHwgKGNhY2hlW2tleV0gPSBmbi5hcHBseShudWxsLCBhcmdzKSk7XG5cdCAgfTtcblx0fTtcblxuLyoqKi8gfSlcbi8qKioqKiovIF0pXG59KTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bmRsZS5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9taXNzLXBsZXRlLWpzL2Rpc3QvYnVuZGxlLmpzXG4vLyBtb2R1bGUgaWQgPSA3N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRvZ2dsZU9wZW4gbW9kdWxlXG4gKiBAbW9kdWxlIG1vZHVsZXMvdG9nZ2xlT3BlblxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcbmltcG9ydCBkYXRhc2V0IGZyb20gJy4vZGF0YXNldC5qcyc7XG5cbi8qKlxuICogVG9nZ2xlcyBhbiBlbGVtZW50IG9wZW4vY2xvc2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IG9wZW5DbGFzcyAtIFRoZSBjbGFzcyB0byB0b2dnbGUgb24vb2ZmXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wZW5DbGFzcykge1xuICBpZiAoIW9wZW5DbGFzcykgb3BlbkNsYXNzID0gJ2lzLW9wZW4nO1xuXG4gIGNvbnN0IGxpbmtBY3RpdmVDbGFzcyA9ICdpcy1hY3RpdmUnO1xuICBjb25zdCB0b2dnbGVFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRvZ2dsZV0nKTtcblxuICBpZiAoIXRvZ2dsZUVsZW1zKSByZXR1cm47XG5cbiAgLyoqXG4gICogRm9yIGVhY2ggdG9nZ2xlIGVsZW1lbnQsIGdldCBpdHMgdGFyZ2V0IGZyb20gdGhlIGRhdGEtdG9nZ2xlIGF0dHJpYnV0ZS5cbiAgKiBCaW5kIGFuIGV2ZW50IGhhbmRsZXIgdG8gdG9nZ2xlIHRoZSBvcGVuQ2xhc3Mgb24vb2ZmIG9uIHRoZSB0YXJnZXQgZWxlbWVudFxuICAqIHdoZW4gdGhlIHRvZ2dsZSBlbGVtZW50IGlzIGNsaWNrZWQuXG4gICovXG4gIGZvckVhY2godG9nZ2xlRWxlbXMsIGZ1bmN0aW9uKHRvZ2dsZUVsZW0pIHtcbiAgICBjb25zdCB0YXJnZXRFbGVtU2VsZWN0b3IgPSBkYXRhc2V0KHRvZ2dsZUVsZW0sICd0b2dnbGUnKTtcblxuICAgIGlmICghdGFyZ2V0RWxlbVNlbGVjdG9yKSByZXR1cm47XG5cbiAgICBjb25zdCB0YXJnZXRFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0RWxlbVNlbGVjdG9yKTtcblxuICAgIGlmICghdGFyZ2V0RWxlbSkgcmV0dXJuO1xuXG4gICAgdG9nZ2xlRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBsZXQgdG9nZ2xlRXZlbnQ7XG4gICAgICBsZXQgdG9nZ2xlQ2xhc3MgPSAodG9nZ2xlRWxlbS5kYXRhc2V0LnRvZ2dsZUNsYXNzKSA/XG4gICAgICAgIHRvZ2dsZUVsZW0uZGF0YXNldC50b2dnbGVDbGFzcyA6IG9wZW5DbGFzcztcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgLy8gVG9nZ2xlIHRoZSBlbGVtZW50J3MgYWN0aXZlIGNsYXNzXG4gICAgICB0b2dnbGVFbGVtLmNsYXNzTGlzdC50b2dnbGUobGlua0FjdGl2ZUNsYXNzKTtcblxuICAgICAgLy8gVG9nZ2xlIGN1c3RvbSBjbGFzcyBpZiBpdCBpcyBzZXRcbiAgICAgIGlmICh0b2dnbGVDbGFzcyAhPT0gb3BlbkNsYXNzKVxuICAgICAgICB0YXJnZXRFbGVtLmNsYXNzTGlzdC50b2dnbGUodG9nZ2xlQ2xhc3MpO1xuXG4gICAgICAvLyBUb2dnbGUgdGhlIGRlZmF1bHQgb3BlbiBjbGFzc1xuICAgICAgdGFyZ2V0RWxlbS5jbGFzc0xpc3QudG9nZ2xlKG9wZW5DbGFzcyk7XG5cbiAgICAgIC8vIFRvZ2dsZSB0aGUgYXBwcm9wcmlhdGUgYXJpYSBoaWRkZW4gYXR0cmlidXRlXG4gICAgICB0YXJnZXRFbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLFxuICAgICAgICAhKHRhcmdldEVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKHRvZ2dsZUNsYXNzKSlcbiAgICAgICk7XG5cbiAgICAgIC8vIEZpcmUgdGhlIGN1c3RvbSBvcGVuIHN0YXRlIGV2ZW50IHRvIHRyaWdnZXIgb3BlbiBmdW5jdGlvbnNcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRvZ2dsZUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2VPcGVuU3RhdGUnLCB7XG4gICAgICAgICAgZGV0YWlsOiB0YXJnZXRFbGVtLmNsYXNzTGlzdC5jb250YWlucyhvcGVuQ2xhc3MpXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9nZ2xlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgICAgdG9nZ2xlRXZlbnQuaW5pdEN1c3RvbUV2ZW50KCdjaGFuZ2VPcGVuU3RhdGUnLCB0cnVlLCB0cnVlLCB7XG4gICAgICAgICAgZGV0YWlsOiB0YXJnZXRFbGVtLmNsYXNzTGlzdC5jb250YWlucyhvcGVuQ2xhc3MpXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0YXJnZXRFbGVtLmRpc3BhdGNoRXZlbnQodG9nZ2xlRXZlbnQpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU9wZW4uanMiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbmltcG9ydCBqUXVlcnkgZnJvbSAnanF1ZXJ5JztcblxuKGZ1bmN0aW9uKHdpbmRvdywgJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQXR0YWNoIHNpdGUtd2lkZSBldmVudCBsaXN0ZW5lcnMuXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXNpbXBsZS10b2dnbGUnLCBlID0+IHtcbiAgICAvLyBTaW1wbGUgdG9nZ2xlIHRoYXQgYWRkL3JlbW92ZXMgXCJhY3RpdmVcIiBhbmQgXCJoaWRkZW5cIiBjbGFzc2VzLCBhcyB3ZWxsIGFzXG4gICAgLy8gYXBwbHlpbmcgYXBwcm9wcmlhdGUgYXJpYS1oaWRkZW4gdmFsdWUgdG8gYSBzcGVjaWZpZWQgdGFyZ2V0LlxuICAgIC8vIFRPRE86IFRoZXJlIGFyZSBhIGZldyBzaW1sYXIgdG9nZ2xlcyBvbiB0aGUgc2l0ZSB0aGF0IGNvdWxkIGJlXG4gICAgLy8gcmVmYWN0b3JlZCB0byB1c2UgdGhpcyBjbGFzcy5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJykgP1xuICAgICAgICAkKCQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJykpIDpcbiAgICAgICAgJCgkKGUuY3VycmVudFRhcmdldCkuZGF0YSgndGFyZ2V0JykpO1xuICAgICQoZS5jdXJyZW50VGFyZ2V0KS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgJHRhcmdldC50b2dnbGVDbGFzcygnYWN0aXZlIGhpZGRlbicpXG4gICAgICAgIC5wcm9wKCdhcmlhLWhpZGRlbicsICR0YXJnZXQuaGFzQ2xhc3MoJ2hpZGRlbicpKTtcbiAgfSkub24oJ2NsaWNrJywgJy5qcy1zaG93LW5hdicsIGUgPT4ge1xuICAgIC8vIFNob3dzIHRoZSBtb2JpbGUgbmF2IGJ5IGFwcGx5aW5nIFwibmF2LWFjdGl2ZVwiIGNhc3MgdG8gdGhlIGJvZHkuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQoZS5kZWxlZ2F0ZVRhcmdldCkuYWRkQ2xhc3MoJ25hdi1hY3RpdmUnKTtcbiAgICAkKCcubmF2LW92ZXJsYXknKS5zaG93KCk7XG4gIH0pLm9uKCdjbGljaycsICcuanMtaGlkZS1uYXYnLCBlID0+IHtcbiAgICAvLyBIaWRlcyB0aGUgbW9iaWxlIG5hdi5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCgnLm5hdi1vdmVybGF5JykuaGlkZSgpO1xuICAgICQoZS5kZWxlZ2F0ZVRhcmdldCkucmVtb3ZlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcbiAgfSk7XG4gIC8vIEVORCBUT0RPXG5cbn0pKHdpbmRvdywgalF1ZXJ5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU1lbnUuanMiXSwic291cmNlUm9vdCI6IiJ9
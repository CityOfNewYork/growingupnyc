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
            if (form[0].className.indexOf('unity') > -1) {
              form.html('<div class="text-center"><p class="u-bottom-spacing-small">Thank you for contacting the NYC Unity Project! Someone will respond to you shortly.</p><a class="button--primary button--primary__curved button--primary__purple" href="https://growingupnyc.cityofnewyork.us/generationnyc/topics/lgbtq">Go back to the Unity Project</a></div>');
            } else if (form[0].className.indexOf('generation') > -1) {
              form.html('<div class="text-center"><p class="u-bottom-spacing-small">Thank you for contacting us! Someone will respond to you shortly.</p><a class="button--primary button--primary__curved button--primary__purple" href="https://growingupnyc.cityofnewyork.us/generationnyc/">Continue exploring Generation NYC</a></div>');
            } else {
              form.html('<div class="text-center"><p class="u-bottom-spacing-small">Thank you for contacting us! Someone will respond to you shortly.</p><a class="button--simple button--simple--alt" href="https://growingupnyc.cityofnewyork.us/">Continue exploring Growing Up NYC</a></div>');
            }
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
  * TO EDIT
  */
  $('#mc-embedded-subscribe:button[type="submit"]').click(function (event) {
    event.preventDefault();
    var formClass = $(this).parents('form').attr('class');
    var $form = $('.' + formClass);
    validateFields($form, event);
  });

  $('#mc-embedded-contact:button[type="submit"]').click(function (event) {
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
      // $('.char-count').addClass('.is-error');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTRiZTRjYmQ5ZGU1Y2UxYTc3OTgiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwialF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mb3JFYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZGF0YXNldC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tYWluLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2FjY29yZGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvck93bi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VGb3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNQcm90b3R5cGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRWFjaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0RnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9zaW1wbGVBY2NvcmRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvb2ZmY2FudmFzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL292ZXJsYXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc3RpY2tOYXYuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90aHJvdHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL25vdy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTeW1ib2wuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ltYWdlc3JlYWR5L2Rpc3QvaW1hZ2VzcmVhZHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc2VjdGlvbkhpZ2hsaWdodGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3N0YXRpY0NvbHVtbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9hbGVydC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9yZWFkQ29va2llLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2NyZWF0ZUNvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9nZXREb21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvbmV3c2xldHRlci1zaWdudXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZGF0YS96aXBjb2Rlcy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2RhdGEvZm9ybS1lcnJvcnMuanNvbiIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9mb3JtRWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9kaXNwYXRjaEV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2ZhY2V0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9vd2xTZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9pT1M3SGFjay5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9zaGFyZS1mb3JtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcy1jb29raWUvc3JjL2pzLmNvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdmVuZG9yL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NsZWF2ZS5qcy9kaXN0L2NsZWF2ZS5taW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NsZWF2ZS5qcy9kaXN0L2FkZG9ucy9jbGVhdmUtcGhvbmUudXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZhcmlhYmxlcy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2NhcHRjaGFSZXNpemUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvcm90YXRpbmdUZXh0QW5pbWF0aW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3NlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWlzcy1wbGV0ZS1qcy9kaXN0L2J1bmRsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy90b2dnbGVPcGVuLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU1lbnUuanMiXSwibmFtZXMiOlsiZWxlbSIsImF0dHIiLCJkYXRhc2V0IiwiZ2V0QXR0cmlidXRlIiwicmVhZHkiLCJmbiIsImRvY3VtZW50IiwicmVhZHlTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJpbml0IiwidG9nZ2xlT3BlbiIsImFsZXJ0Iiwib2ZmY2FudmFzIiwiYWNjb3JkaW9uIiwic2ltcGxlQWNjb3JkaW9uIiwib3ZlcmxheSIsImZhY2V0cyIsInN0YXRpY0NvbHVtbiIsInN0aWNrTmF2IiwiZ3VueVNpZ251cCIsImZvcm1FZmZlY3RzIiwib3dsU2V0dGluZ3MiLCJpT1M3SGFjayIsImNhcHRjaGFSZXNpemUiLCJyb3RhdGluZ1RleHRBbmltYXRpb24iLCJzZWN0aW9uSGlnaGxpZ2h0ZXIiLCJ3aW5kb3ciLCIkIiwiU2hhcmVGb3JtIiwiQ3NzQ2xhc3MiLCJGT1JNIiwiZWFjaCIsImkiLCJlbCIsInNoYXJlRm9ybSIsImpRdWVyeSIsImNvbnZlcnRIZWFkZXJUb0J1dHRvbiIsIiRoZWFkZXJFbGVtIiwiZ2V0Iiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImhlYWRlckVsZW0iLCJuZXdIZWFkZXJFbGVtIiwiY3JlYXRlRWxlbWVudCIsImZvckVhY2giLCJhdHRyaWJ1dGVzIiwic2V0QXR0cmlidXRlIiwibm9kZVZhbHVlIiwiJG5ld0hlYWRlckVsZW0iLCJodG1sIiwiYXBwZW5kIiwidG9nZ2xlSGVhZGVyIiwibWFrZVZpc2libGUiLCJpbml0aWFsaXplSGVhZGVyIiwiJHJlbGF0ZWRQYW5lbCIsImlkIiwiYWRkQ2xhc3MiLCJvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJ0cmlnZ2VyIiwiYmx1ciIsInRvZ2dsZVBhbmVsIiwiJHBhbmVsRWxlbSIsImNzcyIsImRhdGEiLCJmaW5kIiwiaW5pdGlhbGl6ZVBhbmVsIiwibGFiZWxsZWRieSIsImNhbGN1bGF0ZVBhbmVsSGVpZ2h0IiwiaGVpZ2h0IiwidG9nZ2xlQWNjb3JkaW9uSXRlbSIsIiRpdGVtIiwicmVtb3ZlQ2xhc3MiLCJpbml0aWFsaXplQWNjb3JkaW9uSXRlbSIsIiRhY2NvcmRpb25Db250ZW50IiwiJGFjY29yZGlvbkluaXRpYWxIZWFkZXIiLCJvZmYiLCJsZW5ndGgiLCIkYWNjb3JkaW9uSGVhZGVyIiwidGFnTmFtZSIsInJlcGxhY2VXaXRoIiwiaW5pdGlhbGl6ZSIsIiRhY2NvcmRpb25FbGVtIiwibXVsdGlTZWxlY3RhYmxlIiwiY2hpbGRyZW4iLCJwcm94eSIsIiRuZXdJdGVtIiwidGFyZ2V0IiwiY2xvc2VzdCIsImhhc0NsYXNzIiwiJG9wZW5JdGVtIiwicmVJbml0aWFsaXplIiwicmVJbml0aWFsaXplQWNjb3JkaW9uIiwiJGFjY29yZGlvbnMiLCJub3QiLCJjbGljayIsImNoZWNrRWxlbWVudCIsIm5leHQiLCJpcyIsInNsaWRlVXAiLCJzbGlkZURvd24iLCJvZmZDYW52YXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwib2ZmQ2FudmFzRWxlbSIsIm9mZkNhbnZhc1NpZGUiLCJxdWVyeVNlbGVjdG9yIiwiZGV0YWlsIiwidGVzdCIsInRhYkluZGV4IiwiZm9jdXMiLCJvdmVybGF5RWxlbSIsInN0aWNreU5hdiIsIiRlbGVtIiwiJGVsZW1Db250YWluZXIiLCIkZWxlbUFydGljbGUiLCJzZXR0aW5ncyIsInN0aWNreUNsYXNzIiwiYWJzb2x1dGVDbGFzcyIsImxhcmdlQnJlYWtwb2ludCIsImFydGljbGVDbGFzcyIsInN0aWNreU1vZGUiLCJpc1N0aWNreSIsImlzQWJzb2x1dGUiLCJzd2l0Y2hQb2ludCIsInN3aXRjaFBvaW50Qm90dG9tIiwibGVmdE9mZnNldCIsImVsZW1XaWR0aCIsImVsZW1IZWlnaHQiLCJ0b2dnbGVTdGlja3kiLCJjdXJyZW50U2Nyb2xsUG9zIiwic2Nyb2xsVG9wIiwidXBkYXRlRGltZW5zaW9ucyIsImlzT25TY3JlZW4iLCJmb3JjZUNsZWFyIiwibGVmdCIsIndpZHRoIiwidG9wIiwiYm90dG9tIiwic2V0T2Zmc2V0VmFsdWVzIiwib2Zmc2V0Iiwib3V0ZXJIZWlnaHQiLCJwYXJzZUludCIsIm91dGVyV2lkdGgiLCJzdGlja3lNb2RlT24iLCJ0aHJvdHRsZSIsIm9yaWdpbmFsRXZlbnQiLCJzdGlja3lNb2RlT2ZmIiwib25SZXNpemUiLCJsYXJnZU1vZGUiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImRlYm91bmNlIiwiaW1hZ2VzUmVhZHkiLCJib2R5IiwidGhlbiIsIndpbiIsInZpZXdwb3J0Iiwic2Nyb2xsTGVmdCIsInJpZ2h0IiwiYm91bmRzIiwiJHN0aWNreU5hdnMiLCIkb3V0ZXJDb250YWluZXIiLCIkYXJ0aWNsZSIsIiRuYXZpZ2F0aW9uTGlua3MiLCIkc2VjdGlvbnMiLCIkc2VjdGlvbnNSZXZlcnNlZCIsInJldmVyc2UiLCJzZWN0aW9uSWRUb25hdmlnYXRpb25MaW5rIiwib3B0aW1pemVkIiwic2Nyb2xsUG9zaXRpb24iLCJjdXJyZW50U2VjdGlvbiIsInNlY3Rpb25Ub3AiLCIkbmF2aWdhdGlvbkxpbmsiLCJzY3JvbGwiLCJzdGlja3lDb250ZW50Iiwibm90U3RpY2t5Q2xhc3MiLCJib3R0b21DbGFzcyIsImNhbGNXaW5kb3dQb3MiLCJzdGlja3lDb250ZW50RWxlbSIsImVsZW1Ub3AiLCJwYXJlbnRFbGVtZW50IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiaXNQYXN0Qm90dG9tIiwiaW5uZXJIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJvcGVuQ2xhc3MiLCJkaXNwbGF5QWxlcnQiLCJzaWJsaW5nRWxlbSIsImFsZXJ0SGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY3VycmVudFBhZGRpbmciLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInN0eWxlIiwicGFkZGluZ0JvdHRvbSIsInJlbW92ZUFsZXJ0UGFkZGluZyIsImNoZWNrQWxlcnRDb29raWUiLCJjb29raWVOYW1lIiwicmVhZENvb2tpZSIsImNvb2tpZSIsImFkZEFsZXJ0Q29va2llIiwiY3JlYXRlQ29va2llIiwiZ2V0RG9tYWluIiwibG9jYXRpb24iLCJhbGVydHMiLCJhbGVydFNpYmxpbmciLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwiUmVnRXhwIiwiZXhlYyIsInBvcCIsIm5hbWUiLCJ2YWx1ZSIsImRvbWFpbiIsImRheXMiLCJleHBpcmVzIiwiRGF0ZSIsImdldFRpbWUiLCJ0b0dNVFN0cmluZyIsInVybCIsInJvb3QiLCJwYXJzZVVybCIsImhyZWYiLCJob3N0bmFtZSIsInNsaWNlIiwibWF0Y2giLCJzcGxpdCIsImpvaW4iLCJlcnJvck1zZyIsInZhbGlkYXRlRmllbGRzIiwiZm9ybSIsImZpZWxkcyIsInNlcmlhbGl6ZUFycmF5IiwicmVkdWNlIiwib2JqIiwiaXRlbSIsInJlcXVpcmVkRmllbGRzIiwiZW1haWxSZWdleCIsInppcFJlZ2V4IiwicGhvbmVSZWdleCIsImdyb3VwU2VsZXRlZCIsIk9iamVjdCIsImtleXMiLCJhIiwiaW5jbHVkZXMiLCJoYXNFcnJvcnMiLCJmaWVsZE5hbWUiLCJwYXJlbnRzIiwiRU1BSUwiLCJaSVAiLCJQSE9ORU5VTSIsInNpYmxpbmdzIiwiZm9ybUVycm9ycyIsIngiLCJCT1JPVUdIIiwiYXNzaWduQm9yb3VnaCIsInN1Ym1pdFNpZ251cCIsInppcCIsImJvcm91Z2giLCJpbmRleCIsInppcGNvZGVzIiwiZmluZEluZGV4IiwiY29kZXMiLCJpbmRleE9mIiwiZm9ybURhdGEiLCJhamF4IiwidHlwZSIsImRhdGFUeXBlIiwiY2FjaGUiLCJjb250ZW50VHlwZSIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInJlc3VsdCIsImNsYXNzTmFtZSIsIm1zZyIsImVycm9yIiwiZm9ybUNsYXNzIiwiJGZvcm0iLCJrZXl1cCIsImNoYXJMZW4iLCJ2YWwiLCJ0ZXh0IiwiaGFuZGxlRm9jdXMiLCJ3cmFwcGVyRWxlbSIsInBhcmVudE5vZGUiLCJoYW5kbGVCbHVyIiwidHJpbSIsImlucHV0cyIsImlucHV0RWxlbSIsImRpc3BhdGNoRXZlbnQiLCJldmVudFR5cGUiLCJjcmVhdGVFdmVudCIsImluaXRFdmVudCIsImNyZWF0ZUV2ZW50T2JqZWN0IiwiZmlyZUV2ZW50Iiwib3dsIiwib3dsQ2Fyb3VzZWwiLCJhbmltYXRlSW4iLCJhbmltYXRlT3V0IiwiaXRlbXMiLCJsb29wIiwibWFyZ2luIiwiZG90cyIsImF1dG9wbGF5IiwiYXV0b3BsYXlUaW1lb3V0IiwiYXV0b3BsYXlIb3ZlclBhdXNlIiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwic2Nyb2xsVG8iLCJWYXJpYWJsZXMiLCJyZXF1aXJlIiwiX2VsIiwiX2lzVmFsaWQiLCJfaXNCdXN5IiwiX2lzRGlzYWJsZWQiLCJfaW5pdGlhbGl6ZWQiLCJfcmVjYXB0Y2hhUmVxdWlyZWQiLCJfcmVjYXB0Y2hhVmVyaWZpZWQiLCJfcmVjYXB0Y2hhaW5pdCIsInNlbGVjdGVkIiwiX21hc2tQaG9uZSIsIlNIT1dfRElTQ0xBSU1FUiIsIl9kaXNjbGFpbWVyIiwiZSIsIl92YWxpZGF0ZSIsIl9zdWJtaXQiLCJncmVjYXB0Y2hhIiwicmVzZXQiLCJFUlJPUl9NU0ciLCJfc2hvd0Vycm9yIiwiTWVzc2FnZSIsIlJFQ0FQVENIQSIsInZpZXdDb3VudCIsIkNvb2tpZXMiLCJfaW5pdFJlY2FwdGNoYSIsInNldCIsImZvY3Vzb3V0IiwicmVtb3ZlQXR0ciIsImlucHV0IiwiY2xlYXZlIiwicGhvbmUiLCJwaG9uZVJlZ2lvbkNvZGUiLCJkZWxpbWl0ZXIiLCJ2aXNpYmxlIiwiJGVsIiwiJGNsYXNzIiwiSElEREVOIiwiQU5JTUFURV9ESVNDTEFJTUVSIiwiaW5uZXJXaWR0aCIsIiR0YXJnZXQiLCJ2YWxpZGl0eSIsIiR0ZWwiLCJfdmFsaWRhdGVQaG9uZU51bWJlciIsIkVSUk9SIiwibnVtIiwiX3BhcnNlUGhvbmVOdW1iZXIiLCJQSE9ORSIsIlJFUVVJUkVEIiwib25lIiwiJGVsUGFyZW50cyIsIlV0aWxpdHkiLCJsb2NhbGl6ZSIsIlNVQ0NFU1MiLCIkc3Bpbm5lciIsIlNQSU5ORVIiLCIkc3VibWl0IiwicGF5bG9hZCIsInNlcmlhbGl6ZSIsInByb3AiLCJkaXNhYmxlZCIsImNzc1RleHQiLCJwb3N0IiwiZG9uZSIsIl9zaG93U3VjY2VzcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJtZXNzYWdlIiwiZmFpbCIsIlNFUlZFUiIsImFsd2F5cyIsIiRzY3JpcHQiLCJhc3luYyIsImRlZmVyIiwic2NyZWVuZXJDYWxsYmFjayIsInJlbmRlciIsImdldEVsZW1lbnRCeUlkIiwic2NyZWVuZXJSZWNhcHRjaGEiLCJzY3JlZW5lclJlY2FwdGNoYVJlc2V0IiwiTkVFRFNfRElTQ0xBSU1FUiIsIlNVQk1JVF9CVE4iLCJnZXRVcmxQYXJhbWV0ZXIiLCJxdWVyeVN0cmluZyIsInF1ZXJ5Iiwic2VhcmNoIiwicGFyYW0iLCJyZXBsYWNlIiwicmVnZXgiLCJyZXN1bHRzIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZmluZFZhbHVlcyIsIm9iamVjdCIsInRhcmdldFByb3AiLCJ0cmF2ZXJzZU9iamVjdCIsImtleSIsImhhc093blByb3BlcnR5IiwicHVzaCIsInRvRG9sbGFyQW1vdW50IiwiTWF0aCIsImFicyIsInJvdW5kIiwicGFyc2VGbG9hdCIsInRvRml4ZWQiLCJzbHVnTmFtZSIsImxvY2FsaXplZFN0cmluZ3MiLCJMT0NBTElaRURfU1RSSU5HUyIsIl8iLCJmaW5kV2hlcmUiLCJzbHVnIiwibGFiZWwiLCJpc1ZhbGlkRW1haWwiLCJlbWFpbCIsImNoZWNrVmFsaWRpdHkiLCJDT05GSUciLCJERUZBVUxUX0xBVCIsIkRFRkFVTFRfTE5HIiwiR09PR0xFX0FQSSIsIkdPT0dMRV9TVEFUSUNfQVBJIiwiR1JFQ0FQVENIQV9TSVRFX0tFWSIsIlNDUkVFTkVSX01BWF9IT1VTRUhPTEQiLCJVUkxfUElOX0JMVUUiLCJVUkxfUElOX0JMVUVfMlgiLCJVUkxfUElOX0dSRUVOIiwiVVJMX1BJTl9HUkVFTl8yWCIsInNjYWxlQ2FwdGNoYSIsInJlQ2FwdGNoYVdpZHRoIiwiY29udGFpbmVyV2lkdGgiLCJjYXB0Y2hhU2NhbGUiLCJ0cmFuc2Zvcm0iLCJyZXNpemUiLCJ0ZXJtcyIsInJvdGF0ZVRlcm0iLCJjdCIsImZhZGVJbiIsImRlbGF5IiwiZmFkZU91dCIsIlNlYXJjaCIsIl9pbnB1dHMiLCJzZWxlY3RvcnMiLCJNQUlOIiwiX3N1Z2dlc3Rpb25zIiwicGFyc2UiLCJqc1NlYXJjaFN1Z2dlc3Rpb25zIiwiX01pc3NQbGV0ZSIsIm9wdGlvbnMiLCJqc1NlYXJjaERyb3Bkb3duQ2xhc3MiLCJsaW5rQWN0aXZlQ2xhc3MiLCJ0b2dnbGVFbGVtcyIsInRvZ2dsZUVsZW0iLCJ0YXJnZXRFbGVtU2VsZWN0b3IiLCJ0YXJnZXRFbGVtIiwidG9nZ2xlRXZlbnQiLCJ0b2dnbGVDbGFzcyIsInRvZ2dsZSIsImNvbnRhaW5zIiwiQ3VzdG9tRXZlbnQiLCJpbml0Q3VzdG9tRXZlbnQiLCJjdXJyZW50VGFyZ2V0IiwiZGVsZWdhdGVUYXJnZXQiLCJzaG93IiwiaGlkZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtB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Q0EsMENBQTBDLDBCQUEwQjtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxQkFBcUIsY0FBYztBQUNuQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsWUFBWTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVk7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLGVBQWU7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsZUFBZTtBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0EseUJBQXlCLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxZQUFZO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxZQUFZO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSw0Q0FBNEMsbUJBQW1CO0FBQy9EO0FBQ0E7QUFDQSx5Q0FBeUMsWUFBWTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkVBQTZFO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7O0FBRUE7Ozs7Ozs7QUM3Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyQkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDakJBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDMUJBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ2pFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O3lDQzVCQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFLGtCQUFrQjtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvQkFBb0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxREFBcUQsY0FBYztBQUNuRTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIscUJBQXFCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQTBEO0FBQ3JFLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E2USxNQUFFM1EsY0FBRjtBQUNBLFFBQU1xUyxVQUFVclUsRUFBRTJTLEVBQUUrSSxhQUFKLEVBQW1CcGQsSUFBbkIsQ0FBd0IsTUFBeEIsSUFDWjBCLEVBQUVBLEVBQUUyUyxFQUFFK0ksYUFBSixFQUFtQnBkLElBQW5CLENBQXdCLE1BQXhCLENBQUYsQ0FEWSxHQUVaMEIsRUFBRUEsRUFBRTJTLEVBQUUrSSxhQUFKLEVBQW1CcFosSUFBbkIsQ0FBd0IsUUFBeEIsQ0FBRixDQUZKO0FBR0F0QyxNQUFFMlMsRUFBRStJLGFBQUosRUFBbUJMLFdBQW5CLENBQStCLFFBQS9CO0FBQ0FoSCxZQUFRZ0gsV0FBUixDQUFvQixlQUFwQixFQUNLN0YsSUFETCxDQUNVLGFBRFYsRUFDeUJuQixRQUFRdFEsUUFBUixDQUFpQixRQUFqQixDQUR6QjtBQUVELEdBWkQsRUFZR2pDLEVBWkgsQ0FZTSxPQVpOLEVBWWUsY0FaZixFQVkrQixhQUFLO0FBQ2xDO0FBQ0E2USxNQUFFM1EsY0FBRjtBQUNBaEMsTUFBRTJTLEVBQUVnSixjQUFKLEVBQW9COVosUUFBcEIsQ0FBNkIsWUFBN0I7QUFDQTdCLE1BQUUsY0FBRixFQUFrQjRiLElBQWxCO0FBQ0QsR0FqQkQsRUFpQkc5WixFQWpCSCxDQWlCTSxPQWpCTixFQWlCZSxjQWpCZixFQWlCK0IsYUFBSztBQUNsQztBQUNBNlEsTUFBRTNRLGNBQUY7QUFDQWhDLE1BQUUsY0FBRixFQUFrQjZiLElBQWxCO0FBQ0E3YixNQUFFMlMsRUFBRWdKLGNBQUosRUFBb0I3WSxXQUFwQixDQUFnQyxZQUFoQztBQUNELEdBdEJEO0FBdUJBO0FBRUQsQ0E3QkQsRUE2QkcvQyxNQTdCSCxFQTZCVyw4Q0E3QlgsRSIsImZpbGUiOiIxNGJlNGNiZDlkZTVjZTFhNzc5OC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDE2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxNGJlNGNiZDlkZTVjZTFhNzc5OCIsIm1vZHVsZS5leHBvcnRzID0galF1ZXJ5O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwialF1ZXJ5XCJcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKSxcbiAgICBjYXN0RnVuY3Rpb24gPSByZXF1aXJlKCcuL19jYXN0RnVuY3Rpb24nKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIlxuICogcHJvcGVydHkgYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIHVzZSBgXy5mb3JJbmBcbiAqIG9yIGBfLmZvck93bmAgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNlZSBfLmZvckVhY2hSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZvckVhY2goWzEsIDJdLCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgYDFgIHRoZW4gYDJgLlxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAqICAgY29uc29sZS5sb2coa2V5KTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyAnYScgdGhlbiAnYicgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCkuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlFYWNoIDogYmFzZUVhY2g7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGNhc3RGdW5jdGlvbihpdGVyYXRlZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgZ2V0UmF3VGFnID0gcmVxdWlyZSgnLi9fZ2V0UmF3VGFnJyksXG4gICAgb2JqZWN0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19vYmplY3RUb1N0cmluZycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0VGFnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZyZWVHbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XHJcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xyXG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblx0XHRpZighbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gbW9kdWxlO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2UuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBub3cgPSByZXF1aXJlKCcuL25vdycpLFxuICAgIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2RlYm91bmNlLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiogVXRpbGl0eSBtb2R1bGUgdG8gZ2V0IHZhbHVlIG9mIGEgZGF0YSBhdHRyaWJ1dGVcbiogQHBhcmFtIHtvYmplY3R9IGVsZW0gLSBET00gbm9kZSBhdHRyaWJ1dGUgaXMgcmV0cmlldmVkIGZyb21cbiogQHBhcmFtIHtzdHJpbmd9IGF0dHIgLSBBdHRyaWJ1dGUgbmFtZSAoZG8gbm90IGluY2x1ZGUgdGhlICdkYXRhLScgcGFydClcbiogQHJldHVybiB7bWl4ZWR9IC0gVmFsdWUgb2YgZWxlbWVudCdzIGRhdGEgYXR0cmlidXRlXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZWxlbSwgYXR0cikge1xuICBpZiAodHlwZW9mIGVsZW0uZGF0YXNldCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGF0dHIpO1xuICB9XG4gIHJldHVybiBlbGVtLmRhdGFzZXRbYXR0cl07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9kYXRhc2V0LmpzIiwiLy8gICAgIFVuZGVyc2NvcmUuanMgMS44LjNcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGV4cG9ydHNgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIFNhdmUgYnl0ZXMgaW4gdGhlIG1pbmlmaWVkIChidXQgbm90IGd6aXBwZWQpIHZlcnNpb246XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIEZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuICAvLyBDcmVhdGUgcXVpY2sgcmVmZXJlbmNlIHZhcmlhYmxlcyBmb3Igc3BlZWQgYWNjZXNzIHRvIGNvcmUgcHJvdG90eXBlcy5cbiAgdmFyXG4gICAgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICBzbGljZSAgICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICB0b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZCxcbiAgICBuYXRpdmVDcmVhdGUgICAgICAgPSBPYmplY3QuY3JlYXRlO1xuXG4gIC8vIE5ha2VkIGZ1bmN0aW9uIHJlZmVyZW5jZSBmb3Igc3Vycm9nYXRlLXByb3RvdHlwZS1zd2FwcGluZy5cbiAgdmFyIEN0b3IgPSBmdW5jdGlvbigpe307XG5cbiAgLy8gQ3JlYXRlIGEgc2FmZSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciB1c2UgYmVsb3cuXG4gIHZhciBfID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIF8pIHJldHVybiBvYmo7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF8pKSByZXR1cm4gbmV3IF8ob2JqKTtcbiAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yICoqTm9kZS5qcyoqLCB3aXRoXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciB0aGUgb2xkIGByZXF1aXJlKClgIEFQSS4gSWYgd2UncmUgaW5cbiAgLy8gdGhlIGJyb3dzZXIsIGFkZCBgX2AgYXMgYSBnbG9iYWwgb2JqZWN0LlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjguMyc7XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVmZmljaWVudCAoZm9yIGN1cnJlbnQgZW5naW5lcykgdmVyc2lvblxuICAvLyBvZiB0aGUgcGFzc2VkLWluIGNhbGxiYWNrLCB0byBiZSByZXBlYXRlZGx5IGFwcGxpZWQgaW4gb3RoZXIgVW5kZXJzY29yZVxuICAvLyBmdW5jdGlvbnMuXG4gIHZhciBvcHRpbWl6ZUNiID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAoY29udGV4dCA9PT0gdm9pZCAwKSByZXR1cm4gZnVuYztcbiAgICBzd2l0Y2ggKGFyZ0NvdW50ID09IG51bGwgPyAzIDogYXJnQ291bnQpIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBvdGhlcik7XG4gICAgICB9O1xuICAgICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQSBtb3N0bHktaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgY2FsbGJhY2tzIHRoYXQgY2FuIGJlIGFwcGxpZWRcbiAgLy8gdG8gZWFjaCBlbGVtZW50IGluIGEgY29sbGVjdGlvbiwgcmV0dXJuaW5nIHRoZSBkZXNpcmVkIHJlc3VsdCDigJQgZWl0aGVyXG4gIC8vIGlkZW50aXR5LCBhbiBhcmJpdHJhcnkgY2FsbGJhY2ssIGEgcHJvcGVydHkgbWF0Y2hlciwgb3IgYSBwcm9wZXJ0eSBhY2Nlc3Nvci5cbiAgdmFyIGNiID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBfLmlkZW50aXR5O1xuICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSByZXR1cm4gb3B0aW1pemVDYih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpO1xuICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkgcmV0dXJuIF8ubWF0Y2hlcih2YWx1ZSk7XG4gICAgcmV0dXJuIF8ucHJvcGVydHkodmFsdWUpO1xuICB9O1xuICBfLml0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gY2IodmFsdWUsIGNvbnRleHQsIEluZmluaXR5KTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYXNzaWduZXIgZnVuY3Rpb25zLlxuICB2YXIgY3JlYXRlQXNzaWduZXIgPSBmdW5jdGlvbihrZXlzRnVuYywgdW5kZWZpbmVkT25seSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCA8IDIgfHwgb2JqID09IG51bGwpIHJldHVybiBvYmo7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdLFxuICAgICAgICAgICAga2V5cyA9IGtleXNGdW5jKHNvdXJjZSksXG4gICAgICAgICAgICBsID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKCF1bmRlZmluZWRPbmx5IHx8IG9ialtrZXldID09PSB2b2lkIDApIG9ialtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYSBuZXcgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSBhbm90aGVyLlxuICB2YXIgYmFzZUNyZWF0ZSA9IGZ1bmN0aW9uKHByb3RvdHlwZSkge1xuICAgIGlmICghXy5pc09iamVjdChwcm90b3R5cGUpKSByZXR1cm4ge307XG4gICAgaWYgKG5hdGl2ZUNyZWF0ZSkgcmV0dXJuIG5hdGl2ZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIEN0b3IucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIHZhciByZXN1bHQgPSBuZXcgQ3RvcjtcbiAgICBDdG9yLnByb3RvdHlwZSA9IG51bGw7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgcHJvcGVydHkgPSBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09IG51bGwgPyB2b2lkIDAgOiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEhlbHBlciBmb3IgY29sbGVjdGlvbiBtZXRob2RzIHRvIGRldGVybWluZSB3aGV0aGVyIGEgY29sbGVjdGlvblxuICAvLyBzaG91bGQgYmUgaXRlcmF0ZWQgYXMgYW4gYXJyYXkgb3IgYXMgYW4gb2JqZWN0XG4gIC8vIFJlbGF0ZWQ6IGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoXG4gIC8vIEF2b2lkcyBhIHZlcnkgbmFzdHkgaU9TIDggSklUIGJ1ZyBvbiBBUk0tNjQuICMyMDk0XG4gIHZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuICB2YXIgZ2V0TGVuZ3RoID0gcHJvcGVydHkoJ2xlbmd0aCcpO1xuICB2YXIgaXNBcnJheUxpa2UgPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPj0gMCAmJiBsZW5ndGggPD0gTUFYX0FSUkFZX0lOREVYO1xuICB9O1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgcmF3IG9iamVjdHMgaW4gYWRkaXRpb24gdG8gYXJyYXktbGlrZXMuIFRyZWF0cyBhbGxcbiAgLy8gc3BhcnNlIGFycmF5LWxpa2VzIGFzIGlmIHRoZXkgd2VyZSBkZW5zZS5cbiAgXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGksIGxlbmd0aDtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtpXSwgaSwgb2JqKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50LlxuICBfLm1hcCA9IF8uY29sbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0cyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIHJlc3VsdHNbaW5kZXhdID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDcmVhdGUgYSByZWR1Y2luZyBmdW5jdGlvbiBpdGVyYXRpbmcgbGVmdCBvciByaWdodC5cbiAgZnVuY3Rpb24gY3JlYXRlUmVkdWNlKGRpcikge1xuICAgIC8vIE9wdGltaXplZCBpdGVyYXRvciBmdW5jdGlvbiBhcyB1c2luZyBhcmd1bWVudHMubGVuZ3RoXG4gICAgLy8gaW4gdGhlIG1haW4gZnVuY3Rpb24gd2lsbCBkZW9wdGltaXplIHRoZSwgc2VlICMxOTkxLlxuICAgIGZ1bmN0aW9uIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpIHtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdGVlKG1lbW8sIG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDQpO1xuICAgICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgICBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIC8vIERldGVybWluZSB0aGUgaW5pdGlhbCB2YWx1ZSBpZiBub25lIGlzIHByb3ZpZGVkLlxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIG1lbW8gPSBvYmpba2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBkaXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBjcmVhdGVSZWR1Y2UoMSk7XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gY3JlYXRlUmVkdWNlKC0xKTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIga2V5O1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBrZXkgPSBfLmZpbmRJbmRleChvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IF8uZmluZEtleShvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfVxuICAgIGlmIChrZXkgIT09IHZvaWQgMCAmJiBrZXkgIT09IC0xKSByZXR1cm4gb2JqW2tleV07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIF8ucmVqZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm5lZ2F0ZShjYihwcmVkaWNhdGUpKSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKCFwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiBpdGVtICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVzYCBhbmQgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlcyA9IF8uaW5jbHVkZSA9IGZ1bmN0aW9uKG9iaiwgaXRlbSwgZnJvbUluZGV4LCBndWFyZCkge1xuICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICBpZiAodHlwZW9mIGZyb21JbmRleCAhPSAnbnVtYmVyJyB8fCBndWFyZCkgZnJvbUluZGV4ID0gMDtcbiAgICByZXR1cm4gXy5pbmRleE9mKG9iaiwgaXRlbSwgZnJvbUluZGV4KSA+PSAwO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGlzRnVuYyA9IF8uaXNGdW5jdGlvbihtZXRob2QpO1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgZnVuYyA9IGlzRnVuYyA/IG1ldGhvZCA6IHZhbHVlW21ldGhvZF07XG4gICAgICByZXR1cm4gZnVuYyA9PSBudWxsID8gZnVuYyA6IGZ1bmMuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYG1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIF8ucGx1Y2sgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBfLm1hcChvYmosIF8ucHJvcGVydHkoa2V5KSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmluZChvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlID4gcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IC1JbmZpbml0eSAmJiByZXN1bHQgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWluID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBJbmZpbml0eSwgbGFzdENvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPCByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA8IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gSW5maW5pdHkgJiYgcmVzdWx0ID09PSBJbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGEgY29sbGVjdGlvbiwgdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBzZXQgPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gc2V0Lmxlbmd0aDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgcmFuZDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbSgwLCBpbmRleCk7XG4gICAgICBpZiAocmFuZCAhPT0gaW5kZXgpIHNodWZmbGVkW2luZGV4XSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSBzZXRbaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gU2FtcGxlICoqbioqIHJhbmRvbSB2YWx1ZXMgZnJvbSBhIGNvbGxlY3Rpb24uXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYG1hcGAuXG4gIF8uc2FtcGxlID0gZnVuY3Rpb24ob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICAgIHJldHVybiBvYmpbXy5yYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uc2h1ZmZsZShvYmopLnNsaWNlKDAsIE1hdGgubWF4KDAsIG4pKTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0ZWUuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCAtIHJpZ2h0LmluZGV4O1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKGJlaGF2aW9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBrZXkgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICAgIGJlaGF2aW9yKHJlc3VsdCwgdmFsdWUsIGtleSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBHcm91cHMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbi4gUGFzcyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlXG4gIC8vIHRvIGdyb3VwIGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3JpdGVyaW9uLlxuICBfLmdyb3VwQnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XS5wdXNoKHZhbHVlKTsgZWxzZSByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0rKzsgZWxzZSByZXN1bHRba2V5XSA9IDE7XG4gIH0pO1xuXG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIF8udG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iaikgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIFNwbGl0IGEgY29sbGVjdGlvbiBpbnRvIHR3byBhcnJheXM6IG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgc2F0aXNmeSB0aGUgZ2l2ZW5cbiAgLy8gcHJlZGljYXRlLCBhbmQgb25lIHdob3NlIGVsZW1lbnRzIGFsbCBkbyBub3Qgc2F0aXNmeSB0aGUgcHJlZGljYXRlLlxuICBfLnBhcnRpdGlvbiA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgcGFzcyA9IFtdLCBmYWlsID0gW107XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7XG4gICAgICAocHJlZGljYXRlKHZhbHVlLCBrZXksIG9iaikgPyBwYXNzIDogZmFpbCkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtwYXNzLCBmYWlsXTtcbiAgfTtcblxuICAvLyBBcnJheSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYGhlYWRgIGFuZCBgdGFrZWAuIFRoZSAqKmd1YXJkKiogY2hlY2tcbiAgLy8gYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gXy50YWtlID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIHJldHVybiBfLmluaXRpYWwoYXJyYXksIGFycmF5Lmxlbmd0aCAtIG4pO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gKG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKSkpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBfLnJlc3QoYXJyYXksIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIG4pKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIHN0cmljdCwgc3RhcnRJbmRleCkge1xuICAgIHZhciBvdXRwdXQgPSBbXSwgaWR4ID0gMDtcbiAgICBmb3IgKHZhciBpID0gc3RhcnRJbmRleCB8fCAwLCBsZW5ndGggPSBnZXRMZW5ndGgoaW5wdXQpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGlucHV0W2ldO1xuICAgICAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJiAoXy5pc0FycmF5KHZhbHVlKSB8fCBfLmlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICAgICAgLy9mbGF0dGVuIGN1cnJlbnQgbGV2ZWwgb2YgYXJyYXkgb3IgYXJndW1lbnRzIG9iamVjdFxuICAgICAgICBpZiAoIXNoYWxsb3cpIHZhbHVlID0gZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgc3RyaWN0KTtcbiAgICAgICAgdmFyIGogPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgIG91dHB1dC5sZW5ndGggKz0gbGVuO1xuICAgICAgICB3aGlsZSAoaiA8IGxlbikge1xuICAgICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZVtqKytdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFzdHJpY3QpIHtcbiAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIEZsYXR0ZW4gb3V0IGFuIGFycmF5LCBlaXRoZXIgcmVjdXJzaXZlbHkgKGJ5IGRlZmF1bHQpLCBvciBqdXN0IG9uZSBsZXZlbC5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgZmFsc2UpO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdGVlO1xuICAgICAgaXRlcmF0ZWUgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpdGVyYXRlZSAhPSBudWxsKSBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXSxcbiAgICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUsIGksIGFycmF5KSA6IHZhbHVlO1xuICAgICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICAgIGlmICghaSB8fCBzZWVuICE9PSBjb21wdXRlZCkgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICBzZWVuID0gY29tcHV0ZWQ7XG4gICAgICB9IGVsc2UgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhzZWVuLCBjb21wdXRlZCkpIHtcbiAgICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghXy5jb250YWlucyhyZXN1bHQsIHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGl0ZW0gPSBhcnJheVtpXTtcbiAgICAgIGlmIChfLmNvbnRhaW5zKHJlc3VsdCwgaXRlbSkpIGNvbnRpbnVlO1xuICAgICAgZm9yICh2YXIgaiA9IDE7IGogPCBhcmdzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKGFyZ3VtZW50c1tqXSwgaXRlbSkpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKGogPT09IGFyZ3NMZW5ndGgpIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFRha2UgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBvbmUgYXJyYXkgYW5kIGEgbnVtYmVyIG9mIG90aGVyIGFycmF5cy5cbiAgLy8gT25seSB0aGUgZWxlbWVudHMgcHJlc2VudCBpbiBqdXN0IHRoZSBmaXJzdCBhcnJheSB3aWxsIHJlbWFpbi5cbiAgXy5kaWZmZXJlbmNlID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IGZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bnppcChhcmd1bWVudHMpO1xuICB9O1xuXG4gIC8vIENvbXBsZW1lbnQgb2YgXy56aXAuIFVuemlwIGFjY2VwdHMgYW4gYXJyYXkgb2YgYXJyYXlzIGFuZCBncm91cHNcbiAgLy8gZWFjaCBhcnJheSdzIGVsZW1lbnRzIG9uIHNoYXJlZCBpbmRpY2VzXG4gIF8udW56aXAgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSAmJiBfLm1heChhcnJheSwgZ2V0TGVuZ3RoKS5sZW5ndGggfHwgMDtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBfLnBsdWNrKGFycmF5LCBpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGxpc3QpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBmaW5kSW5kZXggYW5kIGZpbmRMYXN0SW5kZXggZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKGRpcikge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICB2YXIgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSByZXR1cm4gaW5kZXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGluZGV4IG9uIGFuIGFycmF5LWxpa2UgdGhhdCBwYXNzZXMgYSBwcmVkaWNhdGUgdGVzdFxuICBfLmZpbmRJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKDEpO1xuICBfLmZpbmRMYXN0SW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigtMSk7XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdGVlKG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gTWF0aC5mbG9vcigobG93ICsgaGlnaCkgLyAyKTtcbiAgICAgIGlmIChpdGVyYXRlZShhcnJheVttaWRdKSA8IHZhbHVlKSBsb3cgPSBtaWQgKyAxOyBlbHNlIGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgaW5kZXhPZiBhbmQgbGFzdEluZGV4T2YgZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZUluZGV4RmluZGVyKGRpciwgcHJlZGljYXRlRmluZCwgc29ydGVkSW5kZXgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlkeCkge1xuICAgICAgdmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgaWYgKHR5cGVvZiBpZHggPT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKGRpciA+IDApIHtcbiAgICAgICAgICAgIGkgPSBpZHggPj0gMCA/IGlkeCA6IE1hdGgubWF4KGlkeCArIGxlbmd0aCwgaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZW5ndGggPSBpZHggPj0gMCA/IE1hdGgubWluKGlkeCArIDEsIGxlbmd0aCkgOiBpZHggKyBsZW5ndGggKyAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNvcnRlZEluZGV4ICYmIGlkeCAmJiBsZW5ndGgpIHtcbiAgICAgICAgaWR4ID0gc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaWR4XSA9PT0gaXRlbSA/IGlkeCA6IC0xO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0gIT09IGl0ZW0pIHtcbiAgICAgICAgaWR4ID0gcHJlZGljYXRlRmluZChzbGljZS5jYWxsKGFycmF5LCBpLCBsZW5ndGgpLCBfLmlzTmFOKTtcbiAgICAgICAgcmV0dXJuIGlkeCA+PSAwID8gaWR4ICsgaSA6IC0xO1xuICAgICAgfVxuICAgICAgZm9yIChpZHggPSBkaXIgPiAwID8gaSA6IGxlbmd0aCAtIDE7IGlkeCA+PSAwICYmIGlkeCA8IGxlbmd0aDsgaWR4ICs9IGRpcikge1xuICAgICAgICBpZiAoYXJyYXlbaWR4XSA9PT0gaXRlbSkgcmV0dXJuIGlkeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhbiBpdGVtIGluIGFuIGFycmF5LFxuICAvLyBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgXy5pbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoMSwgXy5maW5kSW5kZXgsIF8uc29ydGVkSW5kZXgpO1xuICBfLmxhc3RJbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoLTEsIF8uZmluZExhc3RJbmRleCk7XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoc3RvcCA9PSBudWxsKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IHN0ZXAgfHwgMTtcblxuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIHJhbmdlID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxlbmd0aDsgaWR4KyssIHN0YXJ0ICs9IHN0ZXApIHtcbiAgICAgIHJhbmdlW2lkeF0gPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZXhlY3V0ZSBhIGZ1bmN0aW9uIGFzIGEgY29uc3RydWN0b3JcbiAgLy8gb3IgYSBub3JtYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnRzXG4gIHZhciBleGVjdXRlQm91bmQgPSBmdW5jdGlvbihzb3VyY2VGdW5jLCBib3VuZEZ1bmMsIGNvbnRleHQsIGNhbGxpbmdDb250ZXh0LCBhcmdzKSB7XG4gICAgaWYgKCEoY2FsbGluZ0NvbnRleHQgaW5zdGFuY2VvZiBib3VuZEZ1bmMpKSByZXR1cm4gc291cmNlRnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB2YXIgc2VsZiA9IGJhc2VDcmVhdGUoc291cmNlRnVuYy5wcm90b3R5cGUpO1xuICAgIHZhciByZXN1bHQgPSBzb3VyY2VGdW5jLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIGlmIChfLmlzT2JqZWN0KHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICBfLmJpbmQgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdCaW5kIG11c3QgYmUgY2FsbGVkIG9uIGEgZnVuY3Rpb24nKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIGNvbnRleHQsIHRoaXMsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuIF8gYWN0c1xuICAvLyBhcyBhIHBsYWNlaG9sZGVyLCBhbGxvd2luZyBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzIHRvIGJlIHByZS1maWxsZWQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYm91bmRBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMCwgbGVuZ3RoID0gYm91bmRBcmdzLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkobGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJnc1tpXSA9IGJvdW5kQXJnc1tpXSA9PT0gXyA/IGFyZ3VtZW50c1twb3NpdGlvbisrXSA6IGJvdW5kQXJnc1tpXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgdGhpcywgdGhpcywgYXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gQmluZCBhIG51bWJlciBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBSZW1haW5pbmcgYXJndW1lbnRzXG4gIC8vIGFyZSB0aGUgbWV0aG9kIG5hbWVzIHRvIGJlIGJvdW5kLiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXQgYWxsIGNhbGxiYWNrc1xuICAvLyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIF8uYmluZEFsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLCBrZXk7XG4gICAgaWYgKGxlbmd0aCA8PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXMnKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIG9ialtrZXldID0gXy5iaW5kKG9ialtrZXldLCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vaXplID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgY2FjaGUgPSBtZW1vaXplLmNhY2hlO1xuICAgICAgdmFyIGFkZHJlc3MgPSAnJyArIChoYXNoZXIgPyBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGtleSk7XG4gICAgICBpZiAoIV8uaGFzKGNhY2hlLCBhZGRyZXNzKSkgY2FjaGVbYWRkcmVzc10gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gY2FjaGVbYWRkcmVzc107XG4gICAgfTtcbiAgICBtZW1vaXplLmNhY2hlID0ge307XG4gICAgcmV0dXJuIG1lbW9pemU7XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gXy5wYXJ0aWFsKF8uZGVsYXksIF8sIDEpO1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IF8ubm93KCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBfLm5vdygpO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGFzdCA9IF8ubm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICAgIGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID49IDApIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGltZXN0YW1wID0gXy5ub3coKTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIF8ucGFydGlhbCh3cmFwcGVyLCBmdW5jKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgbmVnYXRlZCB2ZXJzaW9uIG9mIHRoZSBwYXNzZWQtaW4gcHJlZGljYXRlLlxuICBfLm5lZ2F0ZSA9IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBfLmNvbXBvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgc3RhcnQgPSBhcmdzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGkgPSBzdGFydDtcbiAgICAgIHZhciByZXN1bHQgPSBhcmdzW3N0YXJ0XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgd2hpbGUgKGktLSkgcmVzdWx0ID0gYXJnc1tpXS5jYWxsKHRoaXMsIHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIG9uIGFuZCBhZnRlciB0aGUgTnRoIGNhbGwuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIHVwIHRvIChidXQgbm90IGluY2x1ZGluZykgdGhlIE50aCBjYWxsLlxuICBfLmJlZm9yZSA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgdmFyIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPiAwKSB7XG4gICAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICBpZiAodGltZXMgPD0gMSkgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBfLnBhcnRpYWwoXy5iZWZvcmUsIDIpO1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEtleXMgaW4gSUUgPCA5IHRoYXQgd29uJ3QgYmUgaXRlcmF0ZWQgYnkgYGZvciBrZXkgaW4gLi4uYCBhbmQgdGh1cyBtaXNzZWQuXG4gIHZhciBoYXNFbnVtQnVnID0gIXt0b1N0cmluZzogbnVsbH0ucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG4gIHZhciBub25FbnVtZXJhYmxlUHJvcHMgPSBbJ3ZhbHVlT2YnLCAnaXNQcm90b3R5cGVPZicsICd0b1N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJ2hhc093blByb3BlcnR5JywgJ3RvTG9jYWxlU3RyaW5nJ107XG5cbiAgZnVuY3Rpb24gY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpIHtcbiAgICB2YXIgbm9uRW51bUlkeCA9IG5vbkVudW1lcmFibGVQcm9wcy5sZW5ndGg7XG4gICAgdmFyIGNvbnN0cnVjdG9yID0gb2JqLmNvbnN0cnVjdG9yO1xuICAgIHZhciBwcm90byA9IChfLmlzRnVuY3Rpb24oY29uc3RydWN0b3IpICYmIGNvbnN0cnVjdG9yLnByb3RvdHlwZSkgfHwgT2JqUHJvdG87XG5cbiAgICAvLyBDb25zdHJ1Y3RvciBpcyBhIHNwZWNpYWwgY2FzZS5cbiAgICB2YXIgcHJvcCA9ICdjb25zdHJ1Y3Rvcic7XG4gICAgaWYgKF8uaGFzKG9iaiwgcHJvcCkgJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIGtleXMucHVzaChwcm9wKTtcblxuICAgIHdoaWxlIChub25FbnVtSWR4LS0pIHtcbiAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbm9uRW51bUlkeF07XG4gICAgICBpZiAocHJvcCBpbiBvYmogJiYgb2JqW3Byb3BdICE9PSBwcm90b1twcm9wXSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkge1xuICAgICAgICBrZXlzLnB1c2gocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgaWYgKG5hdGl2ZUtleXMpIHJldHVybiBuYXRpdmVLZXlzKG9iaik7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSBhbGwgdGhlIHByb3BlcnR5IG5hbWVzIG9mIGFuIG9iamVjdC5cbiAgXy5hbGxLZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0gPSBvYmpba2V5c1tpXV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50IG9mIHRoZSBvYmplY3RcbiAgLy8gSW4gY29udHJhc3QgdG8gXy5tYXAgaXQgcmV0dXJucyBhbiBvYmplY3RcbiAgXy5tYXBPYmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGgsXG4gICAgICAgICAgcmVzdWx0cyA9IHt9LFxuICAgICAgICAgIGN1cnJlbnRLZXk7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGN1cnJlbnRLZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgICAgcmVzdWx0c1tjdXJyZW50S2V5XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBwYWlyc1tpXSA9IFtrZXlzW2ldLCBvYmpba2V5c1tpXV1dO1xuICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbb2JqW2tleXNbaV1dXSA9IGtleXNbaV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYFxuICBfLmZ1bmN0aW9ucyA9IF8ubWV0aG9kcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBuYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzKTtcblxuICAvLyBBc3NpZ25zIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBvd24gcHJvcGVydGllcyBpbiB0aGUgcGFzc2VkLWluIG9iamVjdChzKVxuICAvLyAoaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnbilcbiAgXy5leHRlbmRPd24gPSBfLmFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKF8ua2V5cyk7XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3Qga2V5IG9uIGFuIG9iamVjdCB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEtleSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopLCBrZXk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtrZXldLCBrZXksIG9iaikpIHJldHVybiBrZXk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iamVjdCwgb2l0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9LCBvYmogPSBvYmplY3QsIGl0ZXJhdGVlLCBrZXlzO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKG9pdGVyYXRlZSkpIHtcbiAgICAgIGtleXMgPSBfLmFsbEtleXMob2JqKTtcbiAgICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihvaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXlzID0gZmxhdHRlbihhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgMSk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikgeyByZXR1cm4ga2V5IGluIG9iajsgfTtcbiAgICAgIG9iaiA9IE9iamVjdChvYmopO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIGlmIChpdGVyYXRlZSh2YWx1ZSwga2V5LCBvYmopKSByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXRlcmF0ZWUpKSB7XG4gICAgICBpdGVyYXRlZSA9IF8ubmVnYXRlKGl0ZXJhdGVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLm1hcChmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKSwgU3RyaW5nKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICByZXR1cm4gIV8uY29udGFpbnMoa2V5cywga2V5KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBfLnBpY2sob2JqLCBpdGVyYXRlZSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cywgdHJ1ZSk7XG5cbiAgLy8gQ3JlYXRlcyBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoZSBnaXZlbiBwcm90b3R5cGUgb2JqZWN0LlxuICAvLyBJZiBhZGRpdGlvbmFsIHByb3BlcnRpZXMgYXJlIHByb3ZpZGVkIHRoZW4gdGhleSB3aWxsIGJlIGFkZGVkIHRvIHRoZVxuICAvLyBjcmVhdGVkIG9iamVjdC5cbiAgXy5jcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUsIHByb3BzKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VDcmVhdGUocHJvdG90eXBlKTtcbiAgICBpZiAocHJvcHMpIF8uZXh0ZW5kT3duKHJlc3VsdCwgcHJvcHMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybnMgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmlzTWF0Y2ggPSBmdW5jdGlvbihvYmplY3QsIGF0dHJzKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMoYXR0cnMpLCBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiAhbGVuZ3RoO1xuICAgIHZhciBvYmogPSBPYmplY3Qob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChhdHRyc1trZXldICE9PSBvYmpba2V5XSB8fCAhKGtleSBpbiBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBpc0VxdWFsYC5cbiAgdmFyIGVxID0gZnVuY3Rpb24oYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXG4gICAgLy8gU2VlIHRoZSBbSGFybW9ueSBgZWdhbGAgcHJvcG9zYWxdKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbCkuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT09IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgLy8gU3RyaW5ncywgbnVtYmVycywgcmVndWxhciBleHByZXNzaW9ucywgZGF0ZXMsIGFuZCBib29sZWFucyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgLy8gUmVnRXhwcyBhcmUgY29lcmNlZCB0byBzdHJpbmdzIGZvciBjb21wYXJpc29uIChOb3RlOiAnJyArIC9hL2kgPT09ICcvYS9pJylcbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuICcnICsgYSA9PT0gJycgKyBiO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS5cbiAgICAgICAgLy8gT2JqZWN0KE5hTikgaXMgZXF1aXZhbGVudCB0byBOYU5cbiAgICAgICAgaWYgKCthICE9PSArYSkgcmV0dXJuICtiICE9PSArYjtcbiAgICAgICAgLy8gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvciBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuICthID09PSAwID8gMSAvICthID09PSAxIC8gYiA6ICthID09PSArYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PT0gK2I7XG4gICAgfVxuXG4gICAgdmFyIGFyZUFycmF5cyA9IGNsYXNzTmFtZSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICBpZiAoIWFyZUFycmF5cykge1xuICAgICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIC8vIE9iamVjdHMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1aXZhbGVudCwgYnV0IGBPYmplY3RgcyBvciBgQXJyYXlgc1xuICAgICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICAgIGlmIChhQ3RvciAhPT0gYkN0b3IgJiYgIShfLmlzRnVuY3Rpb24oYUN0b3IpICYmIGFDdG9yIGluc3RhbmNlb2YgYUN0b3IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmICgnY29uc3RydWN0b3InIGluIGEgJiYgJ2NvbnN0cnVjdG9yJyBpbiBiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cblxuICAgIC8vIEluaXRpYWxpemluZyBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICAvLyBJdCdzIGRvbmUgaGVyZSBzaW5jZSB3ZSBvbmx5IG5lZWQgdGhlbSBmb3Igb2JqZWN0cyBhbmQgYXJyYXlzIGNvbXBhcmlzb24uXG4gICAgYVN0YWNrID0gYVN0YWNrIHx8IFtdO1xuICAgIGJTdGFjayA9IGJTdGFjayB8fCBbXTtcbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT09IGI7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuXG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGFyZUFycmF5cykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmICghZXEoYVtsZW5ndGhdLCBiW2xlbmd0aF0sIGFTdGFjaywgYlN0YWNrKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKGEpLCBrZXk7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzIGJlZm9yZSBjb21wYXJpbmcgZGVlcCBlcXVhbGl0eS5cbiAgICAgIGlmIChfLmtleXMoYikubGVuZ3RoICE9PSBsZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXJcbiAgICAgICAga2V5ID0ga2V5c1tsZW5ndGhdO1xuICAgICAgICBpZiAoIShfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYik7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikgJiYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSB8fCBfLmlzQXJndW1lbnRzKG9iaikpKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICByZXR1cm4gXy5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLCBpc0Vycm9yLlxuICBfLmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCcsICdFcnJvciddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUgPCA5KSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5oYXMob2JqLCAnY2FsbGVlJyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS4gV29yayBhcm91bmQgc29tZSB0eXBlb2YgYnVncyBpbiBvbGQgdjgsXG4gIC8vIElFIDExICgjMTYyMSksIGFuZCBpbiBTYWZhcmkgOCAoIzE5MjkpLlxuICBpZiAodHlwZW9mIC8uLyAhPSAnZnVuY3Rpb24nICYmIHR5cGVvZiBJbnQ4QXJyYXkgIT0gJ29iamVjdCcpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09ICdmdW5jdGlvbicgfHwgZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9PSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5XG4gIC8vIG9uIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuXG4gIF8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH07XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSdW4gVW5kZXJzY29yZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzXG4gIC8vIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5fID0gcHJldmlvdXNVbmRlcnNjb3JlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEtlZXAgdGhlIGlkZW50aXR5IGZ1bmN0aW9uIGFyb3VuZCBmb3IgZGVmYXVsdCBpdGVyYXRlZXMuXG4gIF8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvLyBQcmVkaWNhdGUtZ2VuZXJhdGluZyBmdW5jdGlvbnMuIE9mdGVuIHVzZWZ1bCBvdXRzaWRlIG9mIFVuZGVyc2NvcmUuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9O1xuXG4gIF8ubm9vcCA9IGZ1bmN0aW9uKCl7fTtcblxuICBfLnByb3BlcnR5ID0gcHJvcGVydHk7XG5cbiAgLy8gR2VuZXJhdGVzIGEgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gb2JqZWN0IHRoYXQgcmV0dXJucyBhIGdpdmVuIHByb3BlcnR5LlxuICBfLnByb3BlcnR5T2YgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09IG51bGwgPyBmdW5jdGlvbigpe30gOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBwcmVkaWNhdGUgZm9yIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZlxuICAvLyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5tYXRjaGVyID0gXy5tYXRjaGVzID0gZnVuY3Rpb24oYXR0cnMpIHtcbiAgICBhdHRycyA9IF8uZXh0ZW5kT3duKHt9LCBhdHRycyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaXNNYXRjaChvYmosIGF0dHJzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRlZShpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfTtcblxuICAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVzY2FwZU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICdgJzogJyYjeDYwOydcbiAgfTtcbiAgdmFyIHVuZXNjYXBlTWFwID0gXy5pbnZlcnQoZXNjYXBlTWFwKTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIHZhciBjcmVhdGVFc2NhcGVyID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGVzY2FwZXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hcFttYXRjaF07XG4gICAgfTtcbiAgICAvLyBSZWdleGVzIGZvciBpZGVudGlmeWluZyBhIGtleSB0aGF0IG5lZWRzIHRvIGJlIGVzY2FwZWRcbiAgICB2YXIgc291cmNlID0gJyg/OicgKyBfLmtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgICB2YXIgcmVwbGFjZVJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UsICdnJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XG4gICAgfTtcbiAgfTtcbiAgXy5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKGVzY2FwZU1hcCk7XG4gIF8udW5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKHVuZXNjYXBlTWFwKTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCB3aXRoIHRoZVxuICAvLyBgb2JqZWN0YCBhcyBjb250ZXh0OyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5LCBmYWxsYmFjaykge1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdm9pZCAwIDogb2JqZWN0W3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgdmFsdWUgPSBmYWxsYmFjaztcbiAgICB9XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIHZhciBlc2NhcGVDaGFyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07XG4gIH07XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgLy8gTkI6IGBvbGRTZXR0aW5nc2Agb25seSBleGlzdHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgc2V0dGluZ3MsIG9sZFNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncyAmJiBvbGRTZXR0aW5ncykgc2V0dGluZ3MgPSBvbGRTZXR0aW5ncztcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UoZXNjYXBlciwgZXNjYXBlQ2hhcik7XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRvYmUgVk1zIG5lZWQgdGhlIG1hdGNoIHJldHVybmVkIHRvIHByb2R1Y2UgdGhlIGNvcnJlY3Qgb2ZmZXN0LlxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgJ3JldHVybiBfX3A7XFxuJztcblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHZhciBhcmd1bWVudCA9IHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonO1xuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgYXJndW1lbnQgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbi4gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGluc3RhbmNlID0gXyhvYmopO1xuICAgIGluc3RhbmNlLl9jaGFpbiA9IHRydWU7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihpbnN0YW5jZSwgb2JqKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09PSAnc2hpZnQnIHx8IG5hbWUgPT09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICBfLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIFByb3ZpZGUgdW53cmFwcGluZyBwcm94eSBmb3Igc29tZSBtZXRob2RzIHVzZWQgaW4gZW5naW5lIG9wZXJhdGlvbnNcbiAgLy8gc3VjaCBhcyBhcml0aG1ldGljIGFuZCBKU09OIHN0cmluZ2lmaWNhdGlvbi5cbiAgXy5wcm90b3R5cGUudmFsdWVPZiA9IF8ucHJvdG90eXBlLnRvSlNPTiA9IF8ucHJvdG90eXBlLnZhbHVlO1xuXG4gIF8ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICcnICsgdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBBTUQgcmVnaXN0cmF0aW9uIGhhcHBlbnMgYXQgdGhlIGVuZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsb2FkZXJzXG4gIC8vIHRoYXQgbWF5IG5vdCBlbmZvcmNlIG5leHQtdHVybiBzZW1hbnRpY3Mgb24gbW9kdWxlcy4gRXZlbiB0aG91Z2ggZ2VuZXJhbFxuICAvLyBwcmFjdGljZSBmb3IgQU1EIHJlZ2lzdHJhdGlvbiBpcyB0byBiZSBhbm9ueW1vdXMsIHVuZGVyc2NvcmUgcmVnaXN0ZXJzXG4gIC8vIGFzIGEgbmFtZWQgbW9kdWxlIGJlY2F1c2UsIGxpa2UgalF1ZXJ5LCBpdCBpcyBhIGJhc2UgbGlicmFyeSB0aGF0IGlzXG4gIC8vIHBvcHVsYXIgZW5vdWdoIHRvIGJlIGJ1bmRsZWQgaW4gYSB0aGlyZCBwYXJ0eSBsaWIsIGJ1dCBub3QgYmUgcGFydCBvZlxuICAvLyBhbiBBTUQgbG9hZCByZXF1ZXN0LiBUaG9zZSBjYXNlcyBjb3VsZCBnZW5lcmF0ZSBhbiBlcnJvciB3aGVuIGFuXG4gIC8vIGFub255bW91cyBkZWZpbmUoKSBpcyBjYWxsZWQgb3V0c2lkZSBvZiBhIGxvYWRlciByZXF1ZXN0LlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBhY2NvcmRpb24gZnJvbSAnLi9tb2R1bGVzL2FjY29yZGlvbi5qcyc7XG5pbXBvcnQgc2ltcGxlQWNjb3JkaW9uIGZyb20gJy4vbW9kdWxlcy9zaW1wbGVBY2NvcmRpb24uanMnO1xuaW1wb3J0IG9mZmNhbnZhcyBmcm9tICcuL21vZHVsZXMvb2ZmY2FudmFzLmpzJztcbmltcG9ydCBvdmVybGF5IGZyb20gJy4vbW9kdWxlcy9vdmVybGF5LmpzJztcbmltcG9ydCBzdGlja05hdiBmcm9tICcuL21vZHVsZXMvc3RpY2tOYXYuanMnO1xuaW1wb3J0IHNlY3Rpb25IaWdobGlnaHRlciBmcm9tICcuL21vZHVsZXMvc2VjdGlvbkhpZ2hsaWdodGVyLmpzJztcbmltcG9ydCBzdGF0aWNDb2x1bW4gZnJvbSAnLi9tb2R1bGVzL3N0YXRpY0NvbHVtbi5qcyc7XG5pbXBvcnQgYWxlcnQgZnJvbSAnLi9tb2R1bGVzL2FsZXJ0LmpzJztcbi8vIGltcG9ydCBic2R0b29sc1NpZ251cCBmcm9tICcuL21vZHVsZXMvYnNkdG9vbHMtc2lnbnVwLmpzJztcbmltcG9ydCBndW55U2lnbnVwIGZyb20gJy4vbW9kdWxlcy9uZXdzbGV0dGVyLXNpZ251cC5qcyc7XG5pbXBvcnQgZm9ybUVmZmVjdHMgZnJvbSAnLi9tb2R1bGVzL2Zvcm1FZmZlY3RzLmpzJztcbmltcG9ydCBmYWNldHMgZnJvbSAnLi9tb2R1bGVzL2ZhY2V0cy5qcyc7XG5pbXBvcnQgb3dsU2V0dGluZ3MgZnJvbSAnLi9tb2R1bGVzL293bFNldHRpbmdzLmpzJztcbmltcG9ydCBpT1M3SGFjayBmcm9tICcuL21vZHVsZXMvaU9TN0hhY2suanMnO1xuaW1wb3J0IFNoYXJlRm9ybSBmcm9tICcuL21vZHVsZXMvc2hhcmUtZm9ybS5qcyc7XG5pbXBvcnQgY2FwdGNoYVJlc2l6ZSBmcm9tICcuL21vZHVsZXMvY2FwdGNoYVJlc2l6ZS5qcyc7XG5pbXBvcnQgcm90YXRpbmdUZXh0QW5pbWF0aW9uIGZyb20gJy4vbW9kdWxlcy9yb3RhdGluZ1RleHRBbmltYXRpb24uanMnO1xuaW1wb3J0IFNlYXJjaCBmcm9tICcuL21vZHVsZXMvc2VhcmNoLmpzJztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5pbXBvcnQgdG9nZ2xlT3BlbiBmcm9tICcuL21vZHVsZXMvdG9nZ2xlT3Blbi5qcyc7XG5pbXBvcnQgdG9nZ2xlTWVudSBmcm9tICcuL21vZHVsZXMvdG9nZ2xlTWVudS5qcyc7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cbmZ1bmN0aW9uIHJlYWR5KGZuKSB7XG4gIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnbG9hZGluZycpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xuICB9IGVsc2Uge1xuICAgIGZuKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgdG9nZ2xlT3BlbignaXMtb3BlbicpO1xuICBhbGVydCgnaXMtb3BlbicpO1xuICBvZmZjYW52YXMoKTtcbiAgYWNjb3JkaW9uKCk7XG4gIHNpbXBsZUFjY29yZGlvbigpO1xuICBvdmVybGF5KCk7XG5cbiAgLy8gRmFjZXRXUCBwYWdlc1xuICBmYWNldHMoKTtcblxuICAvLyBIb21lcGFnZVxuICBzdGF0aWNDb2x1bW4oKTtcbiAgc3RpY2tOYXYoKTtcbiAgLy8gYnNkdG9vbHNTaWdudXAoKTtcbiAgZ3VueVNpZ251cCgpO1xuICBmb3JtRWZmZWN0cygpO1xuICBvd2xTZXR0aW5ncygpO1xuICBpT1M3SGFjaygpO1xuICBjYXB0Y2hhUmVzaXplKCk7XG4gIHJvdGF0aW5nVGV4dEFuaW1hdGlvbigpO1xuICBzZWN0aW9uSGlnaGxpZ2h0ZXIoKTtcblxuICAvLyBTZWFyY2hcbiAgbmV3IFNlYXJjaCgpLmluaXQoKTtcbn1cblxucmVhZHkoaW5pdCk7XG5cbi8vIE1ha2UgY2VydGFpbiBmdW5jdGlvbnMgYXZhaWxhYmxlIGdsb2JhbGx5XG53aW5kb3cuYWNjb3JkaW9uID0gYWNjb3JkaW9uO1xuXG4oZnVuY3Rpb24od2luZG93LCAkKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLy8gSW5pdGlhbGl6ZSBzaGFyZSBieSBlbWFpbC9zbXMgZm9ybXMuXG4gICQoYC4ke1NoYXJlRm9ybS5Dc3NDbGFzcy5GT1JNfWApLmVhY2goKGksIGVsKSA9PiB7XG4gICAgY29uc3Qgc2hhcmVGb3JtID0gbmV3IFNoYXJlRm9ybShlbCk7XG4gICAgc2hhcmVGb3JtLmluaXQoKTtcbiAgfSk7XG59KSh3aW5kb3csIGpRdWVyeSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbWFpbi5qcyIsIi8qKlxuICogQWNjb3JkaW9uIG1vZHVsZVxuICogQG1vZHVsZSBtb2R1bGVzL2FjY29yZGlvblxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIC8qKlxuICAgKiBDb252ZXJ0IGFjY29yZGlvbiBoZWFkaW5nIHRvIGEgYnV0dG9uXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkaGVhZGVyRWxlbSAtIGpRdWVyeSBvYmplY3QgY29udGFpbmluZyBvcmlnaW5hbCBoZWFkZXJcbiAgICogQHJldHVybiB7b2JqZWN0fSBOZXcgaGVhZGluZyBlbGVtZW50XG4gICAqL1xuICBmdW5jdGlvbiBjb252ZXJ0SGVhZGVyVG9CdXR0b24oJGhlYWRlckVsZW0pIHtcbiAgICBpZiAoJGhlYWRlckVsZW0uZ2V0KDApLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdidXR0b24nKSB7XG4gICAgICByZXR1cm4gJGhlYWRlckVsZW07XG4gICAgfVxuICAgIGNvbnN0IGhlYWRlckVsZW0gPSAkaGVhZGVyRWxlbS5nZXQoMCk7XG4gICAgY29uc3QgbmV3SGVhZGVyRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGZvckVhY2goaGVhZGVyRWxlbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICBuZXdIZWFkZXJFbGVtLnNldEF0dHJpYnV0ZShhdHRyLm5vZGVOYW1lLCBhdHRyLm5vZGVWYWx1ZSk7XG4gICAgfSk7XG4gICAgbmV3SGVhZGVyRWxlbS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJyk7XG4gICAgY29uc3QgJG5ld0hlYWRlckVsZW0gPSAkKG5ld0hlYWRlckVsZW0pO1xuICAgICRuZXdIZWFkZXJFbGVtLmh0bWwoJGhlYWRlckVsZW0uaHRtbCgpKTtcbiAgICAkbmV3SGVhZGVyRWxlbS5hcHBlbmQoJzxzdmcgY2xhc3M9XCJvLWFjY29yZGlvbl9fY2FyZXQgaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWNhcmV0LWRvd25cIj48L3VzZT48L3N2Zz4nKTtcbiAgICByZXR1cm4gJG5ld0hlYWRlckVsZW07XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIHZpc2liaWxpdHkgYXR0cmlidXRlcyBmb3IgaGVhZGVyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkaGVhZGVyRWxlbSAtIFRoZSBhY2NvcmRpb24gaGVhZGVyIGpRdWVyeSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBtYWtlVmlzaWJsZSAtIFdoZXRoZXIgdGhlIGhlYWRlcidzIGNvbnRlbnQgc2hvdWxkIGJlIHZpc2libGVcbiAgICovXG4gIGZ1bmN0aW9uIHRvZ2dsZUhlYWRlcigkaGVhZGVyRWxlbSwgbWFrZVZpc2libGUpIHtcbiAgICAkaGVhZGVyRWxlbS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgbWFrZVZpc2libGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhdHRyaWJ1dGVzLCBjbGFzc2VzLCBhbmQgZXZlbnQgYmluZGluZyB0byBhY2NvcmRpb24gaGVhZGVyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkaGVhZGVyRWxlbSAtIFRoZSBhY2NvcmRpb24gaGVhZGVyIGpRdWVyeSBvYmplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9ICRyZWxhdGVkUGFuZWwgLSBUaGUgcGFuZWwgdGhlIGFjY29yZGlvbiBoZWFkZXIgY29udHJvbHNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVIZWFkZXIoJGhlYWRlckVsZW0sICRyZWxhdGVkUGFuZWwpIHtcbiAgICAkaGVhZGVyRWxlbS5hdHRyKHtcbiAgICAgICdhcmlhLXNlbGVjdGVkJzogZmFsc2UsXG4gICAgICAnYXJpYS1jb250cm9scyc6ICRyZWxhdGVkUGFuZWwuZ2V0KDApLmlkLFxuICAgICAgJ2FyaWEtZXhwYW5kZWQnOiBmYWxzZSxcbiAgICAgICdyb2xlJzogJ2hlYWRpbmcnXG4gICAgfSkuYWRkQ2xhc3MoJ28tYWNjb3JkaW9uX19oZWFkZXInKTtcblxuICAgICRoZWFkZXJFbGVtLm9uKCdjbGljay5hY2NvcmRpb24nLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICRoZWFkZXJFbGVtLnRyaWdnZXIoJ2NoYW5nZVN0YXRlJyk7XG4gICAgfSk7XG5cbiAgICAkaGVhZGVyRWxlbS5vbignbW91c2VsZWF2ZS5hY2NvcmRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICRoZWFkZXJFbGVtLmJsdXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdmlzaWJpbGl0eSBhdHRyaWJ1dGVzIGZvciBwYW5lbFxuICAgKiBAcGFyYW0ge29iamVjdH0gJHBhbmVsRWxlbSAtIFRoZSBhY2NvcmRpb24gcGFuZWwgalF1ZXJ5IG9iamVjdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ha2VWaXNpYmxlIC0gV2hldGhlciB0aGUgcGFuZWwgc2hvdWxkIGJlIHZpc2libGVcbiAgICovXG4gIGZ1bmN0aW9uIHRvZ2dsZVBhbmVsKCRwYW5lbEVsZW0sIG1ha2VWaXNpYmxlKSB7XG4gICAgJHBhbmVsRWxlbS5hdHRyKCdhcmlhLWhpZGRlbicsICFtYWtlVmlzaWJsZSk7XG4gICAgaWYgKG1ha2VWaXNpYmxlKSB7XG4gICAgICAkcGFuZWxFbGVtLmNzcygnaGVpZ2h0JywgJHBhbmVsRWxlbS5kYXRhKCdoZWlnaHQnKSArICdweCcpO1xuICAgICAgJHBhbmVsRWxlbS5maW5kKCdhLCBidXR0b24sIFt0YWJpbmRleF0nKS5hdHRyKCd0YWJpbmRleCcsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAkcGFuZWxFbGVtLmNzcygnaGVpZ2h0JywgJycpO1xuICAgICAgJHBhbmVsRWxlbS5maW5kKCdhLCBidXR0b24sIFt0YWJpbmRleF0nKS5hdHRyKCd0YWJpbmRleCcsIC0xKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIENTUyBjbGFzc2VzIHRvIGFjY29yZGlvbiBwYW5lbHNcbiAgICogQHBhcmFtIHtvYmplY3R9ICRwYW5lbEVsZW0gLSBUaGUgYWNjb3JkaW9uIHBhbmVsIGpRdWVyeSBvYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhYmVsbGVkYnkgLSBJRCBvZiBlbGVtZW50IChhY2NvcmRpb24gaGVhZGVyKSB0aGF0IGxhYmVscyBwYW5lbFxuICAgKi9cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZVBhbmVsKCRwYW5lbEVsZW0sIGxhYmVsbGVkYnkpIHtcbiAgICAkcGFuZWxFbGVtLmFkZENsYXNzKCdvLWFjY29yZGlvbl9fY29udGVudCcpO1xuICAgIGNhbGN1bGF0ZVBhbmVsSGVpZ2h0KCRwYW5lbEVsZW0pO1xuICAgICRwYW5lbEVsZW0uYXR0cih7XG4gICAgICAnYXJpYS1oaWRkZW4nOiB0cnVlLFxuICAgICAgJ3JvbGUnOiAncmVnaW9uJyxcbiAgICAgICdhcmlhLWxhYmVsbGVkYnknOiBsYWJlbGxlZGJ5XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGFjY29yZGlvbiBwYW5lbCBoZWlnaHRcbiAgICogQHBhcmFtIHtvYmplY3R9ICRwYW5lbEVsZW0gLSBUaGUgYWNjb3JkaW9uIHBhbmVsIGpRdWVyeSBvYmplY3RcbiAgICovXG4gIGZ1bmN0aW9uIGNhbGN1bGF0ZVBhbmVsSGVpZ2h0KCRwYW5lbEVsZW0pIHtcbiAgICAkcGFuZWxFbGVtLmRhdGEoJ2hlaWdodCcsICRwYW5lbEVsZW0uaGVpZ2h0KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBzdGF0ZSBmb3IgYWNjb3JkaW9uIGNoaWxkcmVuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkaXRlbSAtIFRoZSBhY2NvcmRpb24gaXRlbSBqUXVlcnkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWFrZVZpc2libGUgLSBXaGV0aGVyIHRvIG1ha2UgdGhlIGFjY29yZGlvbiBjb250ZW50IHZpc2libGVcbiAgICovXG4gIGZ1bmN0aW9uIHRvZ2dsZUFjY29yZGlvbkl0ZW0oJGl0ZW0sIG1ha2VWaXNpYmxlKSB7XG4gICAgaWYgKG1ha2VWaXNpYmxlKSB7XG4gICAgICAkaXRlbS5hZGRDbGFzcygnaXMtZXhwYW5kZWQnKTtcbiAgICAgICRpdGVtLnJlbW92ZUNsYXNzKCdpcy1jb2xsYXBzZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWV4cGFuZGVkJyk7XG4gICAgICAkaXRlbS5hZGRDbGFzcygnaXMtY29sbGFwc2VkJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBDU1MgY2xhc3NlcyB0byBhY2NvcmRpb24gY2hpbGRyZW5cbiAgICogQHBhcmFtIHtvYmplY3R9ICRpdGVtIC0gVGhlIGFjY29yZGlvbiBjaGlsZCBqUXVlcnkgb2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiBpbml0aWFsaXplQWNjb3JkaW9uSXRlbSgkaXRlbSkge1xuICAgIGNvbnN0ICRhY2NvcmRpb25Db250ZW50ID0gJGl0ZW0uZmluZCgnLmpzLWFjY29yZGlvbl9fY29udGVudCcpO1xuICAgIGNvbnN0ICRhY2NvcmRpb25Jbml0aWFsSGVhZGVyID0gJGl0ZW0uZmluZCgnLmpzLWFjY29yZGlvbl9faGVhZGVyJyk7XG4gICAgLy8gQ2xlYXIgYW55IHByZXZpb3VzbHkgYm91bmQgZXZlbnRzXG4gICAgJGl0ZW0ub2ZmKCd0b2dnbGUuYWNjb3JkaW9uJyk7XG4gICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIHN0YXRlIGNsYXNzZXNcbiAgICAkaXRlbS5yZW1vdmVDbGFzcygnaXMtZXhwYW5kZWQgaXMtY29sbGFwc2VkJyk7XG4gICAgaWYgKCRhY2NvcmRpb25Db250ZW50Lmxlbmd0aCAmJiAkYWNjb3JkaW9uSW5pdGlhbEhlYWRlci5sZW5ndGgpIHtcbiAgICAgICRpdGVtLmFkZENsYXNzKCdvLWFjY29yZGlvbl9faXRlbScpO1xuICAgICAgbGV0ICRhY2NvcmRpb25IZWFkZXI7XG4gICAgICBpZiAoJGFjY29yZGlvbkluaXRpYWxIZWFkZXIuZ2V0KDApLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2J1dHRvbicpIHtcbiAgICAgICAgJGFjY29yZGlvbkhlYWRlciA9ICRhY2NvcmRpb25Jbml0aWFsSGVhZGVyO1xuICAgICAgICBjYWxjdWxhdGVQYW5lbEhlaWdodCgkYWNjb3JkaW9uQ29udGVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkYWNjb3JkaW9uSGVhZGVyID0gY29udmVydEhlYWRlclRvQnV0dG9uKCRhY2NvcmRpb25Jbml0aWFsSGVhZGVyKTtcbiAgICAgICAgJGFjY29yZGlvbkluaXRpYWxIZWFkZXIucmVwbGFjZVdpdGgoJGFjY29yZGlvbkhlYWRlcik7XG4gICAgICAgIGluaXRpYWxpemVIZWFkZXIoJGFjY29yZGlvbkhlYWRlciwgJGFjY29yZGlvbkNvbnRlbnQpO1xuICAgICAgICBpbml0aWFsaXplUGFuZWwoJGFjY29yZGlvbkNvbnRlbnQsICRhY2NvcmRpb25IZWFkZXIuZ2V0KDApLmlkKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDdXN0b20gZXZlbnQgaGFuZGxlciB0byB0b2dnbGUgdGhlIGFjY29yZGlvbiBpdGVtIG9wZW4vY2xvc2VkXG4gICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWFrZVZpc2libGUgLSBXaGV0aGVyIHRvIG1ha2UgdGhlIGFjY29yZGlvbiBjb250ZW50IHZpc2libGVcbiAgICAgICAqL1xuICAgICAgJGl0ZW0ub24oJ3RvZ2dsZS5hY2NvcmRpb24nLCBmdW5jdGlvbihldmVudCwgbWFrZVZpc2libGUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdG9nZ2xlQWNjb3JkaW9uSXRlbSgkaXRlbSwgbWFrZVZpc2libGUpO1xuICAgICAgICB0b2dnbGVIZWFkZXIoJGFjY29yZGlvbkhlYWRlciwgbWFrZVZpc2libGUpO1xuICAgICAgICB0b2dnbGVQYW5lbCgkYWNjb3JkaW9uQ29udGVudCwgbWFrZVZpc2libGUpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENvbGxhcHNlIHBhbmVscyBpbml0aWFsbHlcbiAgICAgICRpdGVtLnRyaWdnZXIoJ3RvZ2dsZS5hY2NvcmRpb24nLCBbZmFsc2VdKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBBUklBIGF0dHJpYnV0ZXMgYW5kIENTUyBjbGFzc2VzIHRvIHRoZSByb290IGFjY29yZGlvbiBlbGVtZW50cy5cbiAgICogQHBhcmFtIHtvYmplY3R9ICRhY2NvcmRpb25FbGVtIC0gVGhlIGpRdWVyeSBvYmplY3QgY29udGFpbmluZyB0aGUgcm9vdCBlbGVtZW50IG9mIHRoZSBhY2NvcmRpb25cbiAgICogQHBhcmFtIHtib29sZWFufSBtdWx0aVNlbGVjdGFibGUgLSBXaGV0aGVyIG11bHRpcGxlIGFjY29yZGlvbiBkcmF3ZXJzIGNhbiBiZSBvcGVuIGF0IHRoZSBzYW1lIHRpbWVcbiAgICovXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoJGFjY29yZGlvbkVsZW0sIG11bHRpU2VsZWN0YWJsZSkge1xuICAgICRhY2NvcmRpb25FbGVtLmF0dHIoe1xuICAgICAgJ3JvbGUnOiAncHJlc2VudGF0aW9uJyxcbiAgICAgICdhcmlhLW11bHRpc2VsZWN0YWJsZSc6IG11bHRpU2VsZWN0YWJsZVxuICAgIH0pLmFkZENsYXNzKCdvLWFjY29yZGlvbicpO1xuICAgICRhY2NvcmRpb25FbGVtLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGluaXRpYWxpemVBY2NvcmRpb25JdGVtKCQodGhpcykpO1xuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSBjaGFuZ2VTdGF0ZSBldmVudHMgb24gYWNjb3JkaW9uIGhlYWRlcnMuXG4gICAgICogQ2xvc2UgdGhlIG9wZW4gYWNjb3JkaW9uIGl0ZW0gYW5kIG9wZW4gdGhlIG5ldyBvbmUuXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAqL1xuICAgICRhY2NvcmRpb25FbGVtLm9uKCdjaGFuZ2VTdGF0ZS5hY2NvcmRpb24nLCAnLmpzLWFjY29yZGlvbl9faGVhZGVyJywgJC5wcm94eShmdW5jdGlvbihldmVudCkge1xuICAgICAgY29uc3QgJG5ld0l0ZW0gPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLm8tYWNjb3JkaW9uX19pdGVtJyk7XG4gICAgICBpZiAobXVsdGlTZWxlY3RhYmxlKSB7XG4gICAgICAgICRuZXdJdGVtLnRyaWdnZXIoJ3RvZ2dsZS5hY2NvcmRpb24nLCBbISRuZXdJdGVtLmhhc0NsYXNzKCdpcy1leHBhbmRlZCcpXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCAkb3Blbkl0ZW0gPSAkYWNjb3JkaW9uRWxlbS5maW5kKCcuaXMtZXhwYW5kZWQnKTtcbiAgICAgICAgJG9wZW5JdGVtLnRyaWdnZXIoJ3RvZ2dsZS5hY2NvcmRpb24nLCBbZmFsc2VdKTtcbiAgICAgICAgaWYgKCRvcGVuSXRlbS5nZXQoMCkgIT09ICRuZXdJdGVtLmdldCgwKSkge1xuICAgICAgICAgICRuZXdJdGVtLnRyaWdnZXIoJ3RvZ2dsZS5hY2NvcmRpb24nLCBbdHJ1ZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlaW5pdGlhbGl6ZSBhbiBhY2NvcmRpb24gYWZ0ZXIgaXRzIGNvbnRlbnRzIHdlcmUgZHluYW1pY2FsbHkgdXBkYXRlZFxuICAgKiBAcGFyYW0ge29iamVjdH0gJGFjY29yZGlvbkVsZW0gLSBUaGUgalF1ZXJ5IG9iamVjdCBjb250YWluaW5nIHRoZSByb290IGVsZW1lbnQgb2YgdGhlIGFjY29yZGlvblxuICAgKi9cbiAgZnVuY3Rpb24gcmVJbml0aWFsaXplKCRhY2NvcmRpb25FbGVtKSB7XG4gICAgaWYgKCRhY2NvcmRpb25FbGVtLmhhc0NsYXNzKCdvLWFjY29yZGlvbicpKSB7XG4gICAgICAkYWNjb3JkaW9uRWxlbS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGluaXRpYWxpemVBY2NvcmRpb25JdGVtKCQodGhpcykpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG11bHRpU2VsZWN0YWJsZSA9ICRhY2NvcmRpb25FbGVtLmRhdGEoJ211bHRpc2VsZWN0YWJsZScpIHx8IGZhbHNlO1xuICAgICAgaW5pdGlhbGl6ZSgkYWNjb3JkaW9uRWxlbSwgbXVsdGlTZWxlY3RhYmxlKTtcbiAgICB9XG4gIH1cbiAgd2luZG93LnJlSW5pdGlhbGl6ZUFjY29yZGlvbiA9IHJlSW5pdGlhbGl6ZTtcblxuICBjb25zdCAkYWNjb3JkaW9ucyA9ICQoJy5qcy1hY2NvcmRpb24nKS5ub3QoJy5vLWFjY29yZGlvbicpO1xuICBpZiAoJGFjY29yZGlvbnMubGVuZ3RoKSB7XG4gICAgJGFjY29yZGlvbnMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG11bHRpU2VsZWN0YWJsZSA9ICQodGhpcykuZGF0YSgnbXVsdGlzZWxlY3RhYmxlJykgfHwgZmFsc2U7XG4gICAgICBpbml0aWFsaXplKCQodGhpcyksIG11bHRpU2VsZWN0YWJsZSk7XG5cbiAgICAgIC8qKlxuICAgICAgICogSGFuZGxlIGZvbnRzQWN0aXZlIGV2ZW50cyBmaXJlZCBvbmNlIFR5cGVraXQgcmVwb3J0cyB0aGF0IHRoZSBmb250cyBhcmUgYWN0aXZlLlxuICAgICAgICogQHNlZSBiYXNlLnR3aWcgZm9yIHRoZSBUeXBla2l0LmxvYWQoKSBmdW5jdGlvblxuICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgKi9cbiAgICAgICQodGhpcykub24oJ2ZvbnRzQWN0aXZlJywgJC5wcm94eShmdW5jdGlvbigpIHtcbiAgICAgICAgcmVJbml0aWFsaXplKCQodGhpcykpO1xuICAgICAgfSwgdGhpcykpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9hY2NvcmRpb24uanMiLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5mb3JFYWNoYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlFYWNoKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlFYWNoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9fYmFzZUZvck93bicpLFxuICAgIGNyZWF0ZUJhc2VFYWNoID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xudmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VFYWNoLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZvck93bihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yT3duO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yT3duLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgY3JlYXRlQmFzZUZvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3I7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3IuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ3JlYXRlcyBhIGJhc2UgZnVuY3Rpb24gZm9yIG1ldGhvZHMgbGlrZSBgXy5mb3JJbmAgYW5kIGBfLmZvck93bmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUZvcihmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNGdW5jKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KG9iamVjdCksXG4gICAgICAgIHByb3BzID0ga2V5c0Z1bmMob2JqZWN0KSxcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcHNbZnJvbVJpZ2h0ID8gbGVuZ3RoIDogKytpbmRleF07XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVba2V5XSwga2V5LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VGb3I7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VGb3IuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZVRpbWVzID0gcmVxdWlyZSgnLi9fYmFzZVRpbWVzJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TGlrZUtleXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanNcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVGltZXMuanNcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlSXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL19iYXNlSXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FyZ3VtZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanNcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkZhbHNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qc1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNJbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMzJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzXG4vLyBtb2R1bGUgaWQgPSAzM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzVHlwZWRBcnJheTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gMzRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuYXJ5LmpzXG4vLyBtb2R1bGUgaWQgPSAzNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVVdGlsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19ub2RlVXRpbC5qc1xuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzXG4vLyBtb2R1bGUgaWQgPSAzOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXMuanNcbi8vIG1vZHVsZSBpZCA9IDM5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX292ZXJBcmcuanNcbi8vIG1vZHVsZSBpZCA9IDQwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgYmFzZUVhY2hgIG9yIGBiYXNlRWFjaFJpZ2h0YCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VFYWNoKGVhY2hGdW5jLCBmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gICAgaWYgKGNvbGxlY3Rpb24gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfVxuICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgIHJldHVybiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBpdGVyYXRlZSk7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3QoY29sbGVjdGlvbik7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2luZGV4XSwgaW5kZXgsIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VFYWNoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRWFjaC5qc1xuLy8gbW9kdWxlIGlkID0gNDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYGlkZW50aXR5YCBpZiBpdCdzIG5vdCBhIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGNhc3QgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNhc3RGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicgPyB2YWx1ZSA6IGlkZW50aXR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RGdW5jdGlvbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdEZ1bmN0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSA0M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lkZW50aXR5LmpzXG4vLyBtb2R1bGUgaWQgPSA0NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiogU2ltcGxlIGFjY29yZGlvbiBtb2R1bGVcbiogQG1vZHVsZSBtb2R1bGVzL3NpbXBsZUFjY29yZGlvblxuKiBAc2VlIGh0dHBzOi8vcGVyaXNoYWJsZXByZXNzLmNvbS9qcXVlcnktYWNjb3JkaW9uLW1lbnUtdHV0b3JpYWwvXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIC8vJCgnLmpzLWFjY29yZGlvbiA+IHVsID4gbGk6aGFzKG9sKScpLmFkZENsYXNzKFwiaGFzLXN1YlwiKTtcbiAgJCgnLmpzLXMtYWNjb3JkaW9uID4gbGkgPiBoMy5qcy1zLWFjY29yZGlvbl9faGVhZGVyJykuYXBwZW5kKCc8c3ZnIGNsYXNzPVwiby1hY2NvcmRpb25fX2NhcmV0IGljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1jYXJldC1kb3duXCI+PC91c2U+PC9zdmc+Jyk7XG5cbiAgJCgnLmpzLXMtYWNjb3JkaW9uID4gbGkgPiBoMy5qcy1zLWFjY29yZGlvbl9faGVhZGVyJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNoZWNrRWxlbWVudCA9ICQodGhpcykubmV4dCgpO1xuXG4gICAgJCgnLmpzLXMtYWNjb3JkaW9uIGxpJykucmVtb3ZlQ2xhc3MoJ2lzLWV4cGFuZGVkJyk7XG4gICAgJCh0aGlzKS5jbG9zZXN0KCdsaScpLmFkZENsYXNzKCdpcy1leHBhbmRlZCcpO1xuXG5cbiAgICBpZigoY2hlY2tFbGVtZW50LmlzKCcuanMtcy1hY2NvcmRpb25fX2NvbnRlbnQnKSkgJiYgKGNoZWNrRWxlbWVudC5pcygnOnZpc2libGUnKSkpIHtcbiAgICAgICQodGhpcykuY2xvc2VzdCgnbGknKS5yZW1vdmVDbGFzcygnaXMtZXhwYW5kZWQnKTtcbiAgICAgIGNoZWNrRWxlbWVudC5zbGlkZVVwKCdub3JtYWwnKTtcbiAgICB9XG5cbiAgICBpZigoY2hlY2tFbGVtZW50LmlzKCcuanMtcy1hY2NvcmRpb25fX2NvbnRlbnQnKSkgJiYgKCFjaGVja0VsZW1lbnQuaXMoJzp2aXNpYmxlJykpKSB7XG4gICAgICAkKCcuanMtcy1hY2NvcmRpb24gLmpzLXMtYWNjb3JkaW9uX19jb250ZW50OnZpc2libGUnKS5zbGlkZVVwKCdub3JtYWwnKTtcbiAgICAgIGNoZWNrRWxlbWVudC5zbGlkZURvd24oJ25vcm1hbCcpO1xuICAgIH1cblxuICAgIGlmIChjaGVja0VsZW1lbnQuaXMoJy5qcy1zLWFjY29yZGlvbl9fY29udGVudCcpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc2ltcGxlQWNjb3JkaW9uLmpzIiwiLyoqXG4gKiBPZmZjYW52YXMgbW9kdWxlXG4gKiBAbW9kdWxlIG1vZHVsZXMvb2ZmY2FudmFzXG4gKiBAc2VlIG1vZHVsZXMvdG9nZ2xlT3BlblxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcblxuLyoqXG4gKiBTaGlmdCBrZXlib2FyZCBmb2N1cyB3aGVuIHRoZSBvZmZjYW52YXMgbmF2IGlzIG9wZW4uXG4gKiBUaGUgJ2NoYW5nZU9wZW5TdGF0ZScgZXZlbnQgaXMgZmlyZWQgYnkgbW9kdWxlcy90b2dnbGVPcGVuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBjb25zdCBvZmZDYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtb2ZmY2FudmFzJyk7XG4gIGlmIChvZmZDYW52YXMpIHtcbiAgICBmb3JFYWNoKG9mZkNhbnZhcywgZnVuY3Rpb24ob2ZmQ2FudmFzRWxlbSkge1xuICAgICAgY29uc3Qgb2ZmQ2FudmFzU2lkZSA9IG9mZkNhbnZhc0VsZW0ucXVlcnlTZWxlY3RvcignLmpzLW9mZmNhbnZhc19fc2lkZScpO1xuXG4gICAgICAvKipcbiAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAnY2hhbmdlT3BlblN0YXRlJy5cbiAgICAgICogVGhlIHZhbHVlIG9mIGV2ZW50LmRldGFpbCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgb3BlbiBzdGF0ZSBpcyB0cnVlXG4gICAgICAqIChpLmUuIHRoZSBvZmZjYW52YXMgY29udGVudCBpcyB2aXNpYmxlKS5cbiAgICAgICogQGZ1bmN0aW9uXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICovXG4gICAgICBvZmZDYW52YXNFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZU9wZW5TdGF0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5kZXRhaWwpIHtcbiAgICAgICAgICBpZiAoISgvXig/OmF8c2VsZWN0fGlucHV0fGJ1dHRvbnx0ZXh0YXJlYSkkL2kudGVzdChvZmZDYW52YXNTaWRlLnRhZ05hbWUpKSkge1xuICAgICAgICAgICAgb2ZmQ2FudmFzU2lkZS50YWJJbmRleCA9IC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvZmZDYW52YXNTaWRlLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvb2ZmY2FudmFzLmpzIiwiLyoqXG4gKiBPdmVybGF5IG1vZHVsZVxuICogQG1vZHVsZSBtb2R1bGVzL292ZXJsYXlcbiAqL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5cbi8qKlxuICogU2hpZnQga2V5Ym9hcmQgZm9jdXMgd2hlbiB0aGUgc2VhcmNoIG92ZXJsYXkgaXMgb3Blbi5cbiAqIFRoZSAnY2hhbmdlT3BlblN0YXRlJyBldmVudCBpcyBmaXJlZCBieSBtb2R1bGVzL3RvZ2dsZU9wZW5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtb3ZlcmxheScpO1xuICBpZiAob3ZlcmxheSkge1xuICAgIGZvckVhY2gob3ZlcmxheSwgZnVuY3Rpb24ob3ZlcmxheUVsZW0pIHtcbiAgICAgIC8qKlxuICAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yICdjaGFuZ2VPcGVuU3RhdGUnLlxuICAgICAgKiBUaGUgdmFsdWUgb2YgZXZlbnQuZGV0YWlsIGluZGljYXRlcyB3aGV0aGVyIHRoZSBvcGVuIHN0YXRlIGlzIHRydWVcbiAgICAgICogKGkuZS4gdGhlIG92ZXJsYXkgaXMgdmlzaWJsZSkuXG4gICAgICAqIEBmdW5jdGlvblxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAqL1xuICAgICAgb3ZlcmxheUVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlT3BlblN0YXRlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmRldGFpbCkge1xuICAgICAgICAgIGlmICghKC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaS50ZXN0KG92ZXJsYXkudGFnTmFtZSkpKSB7XG4gICAgICAgICAgICBvdmVybGF5LnRhYkluZGV4ID0gLTE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1vdmVybGF5IGlucHV0JykpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1vdmVybGF5IGlucHV0JylbMF0uZm9jdXMoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3ZlcmxheS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9vdmVybGF5LmpzIiwiLyoqXG4qIFN0aWNrIE5hdiBtb2R1bGVcbiogQG1vZHVsZSBtb2R1bGVzL3N0aWNreU5hdlxuKi9cblxuaW1wb3J0IHRocm90dGxlIGZyb20gJ2xvZGFzaC90aHJvdHRsZSc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoL2RlYm91bmNlJztcbmltcG9ydCBpbWFnZXNSZWFkeSBmcm9tICdpbWFnZXNyZWFkeS9kaXN0L2ltYWdlc3JlYWR5LmpzJztcblxuLyoqXG4qIFwiU3RpY2tcIiBjb250ZW50IGluIHBsYWNlIGFzIHRoZSB1c2VyIHNjcm9sbHNcbiogQHBhcmFtIHtvYmplY3R9ICRlbGVtIC0galF1ZXJ5IGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgc3RpY2t5XG4qIEBwYXJhbSB7b2JqZWN0fSAkZWxlbUNvbnRhaW5lciAtIGpRdWVyeSBlbGVtZW50IGZvciB0aGUgZWxlbWVudCdzIGNvbnRhaW5lci4gVXNlZCB0byBzZXQgdGhlIHRvcCBhbmQgYm90dG9tIHBvaW50c1xuKiBAcGFyYW0ge29iamVjdH0gJGVsZW1BcnRpY2xlIC0gQ29udGVudCBuZXh0IHRvIHRoZSBzdGlja3kgbmF2XG4qL1xuZnVuY3Rpb24gc3RpY2t5TmF2KCRlbGVtLCAkZWxlbUNvbnRhaW5lciwgJGVsZW1BcnRpY2xlKSB7XG4gIC8vIE1vZHVsZSBzZXR0aW5nc1xuICBjb25zdCBzZXR0aW5ncyA9IHtcbiAgICBzdGlja3lDbGFzczogJ2lzLXN0aWNreScsXG4gICAgYWJzb2x1dGVDbGFzczogJ2lzLXN0dWNrJyxcbiAgICBsYXJnZUJyZWFrcG9pbnQ6ICcxMDI0cHgnLFxuICAgIGFydGljbGVDbGFzczogJ28tYXJ0aWNsZS0tc2hpZnQnXG4gIH07XG5cbiAgLy8gR2xvYmFsc1xuICBsZXQgc3RpY2t5TW9kZSA9IGZhbHNlOyAvLyBGbGFnIHRvIHRlbGwgaWYgc2lkZWJhciBpcyBpbiBcInN0aWNreSBtb2RlXCJcbiAgbGV0IGlzU3RpY2t5ID0gZmFsc2U7IC8vIFdoZXRoZXIgdGhlIHNpZGViYXIgaXMgc3RpY2t5IGF0IHRoaXMgZXhhY3QgbW9tZW50IGluIHRpbWVcbiAgbGV0IGlzQWJzb2x1dGUgPSBmYWxzZTsgLy8gV2hldGhlciB0aGUgc2lkZWJhciBpcyBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgYXQgdGhlIGJvdHRvbVxuICBsZXQgc3dpdGNoUG9pbnQgPSAwOyAvLyBQb2ludCBhdCB3aGljaCB0byBzd2l0Y2ggdG8gc3RpY2t5IG1vZGVcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgbGV0IHN3aXRjaFBvaW50Qm90dG9tID0gMDsgLy8gUG9pbnQgYXQgd2hpY2ggdG8gXCJmcmVlemVcIiB0aGUgc2lkZWJhciBzbyBpdCBkb2Vzbid0IG92ZXJsYXAgdGhlIGZvb3RlclxuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGxldCBsZWZ0T2Zmc2V0ID0gMDsgLy8gQW1vdW50IHNpZGViYXIgc2hvdWxkIGJlIHNldCBmcm9tIHRoZSBsZWZ0IHNpZGVcbiAgbGV0IGVsZW1XaWR0aCA9IDA7IC8vIFdpZHRoIGluIHBpeGVscyBvZiBzaWRlYmFyXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGxldCBlbGVtSGVpZ2h0ID0gMDsgLy8gSGVpZ2h0IGluIHBpeGVscyBvZiBzaWRlYmFyXG4gIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuICAvKipcbiAgKiBUb2dnbGUgdGhlIHN0aWNreSBiZWhhdmlvclxuICAqXG4gICogVHVybnMgb24gaWYgdGhlIHVzZXIgaGFzIHNjcm9sbGVkIHBhc3QgdGhlIHN3aXRjaCBwb2ludCwgb2ZmIGlmIHRoZXkgc2Nyb2xsIGJhY2sgdXBcbiAgKiBJZiBzdGlja3kgbW9kZSBpcyBvbiwgc2V0cyB0aGUgbGVmdCBvZmZzZXQgYXMgd2VsbFxuICAqL1xuICBmdW5jdGlvbiB0b2dnbGVTdGlja3koKSB7XG4gICAgY29uc3QgY3VycmVudFNjcm9sbFBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgIGlmIChjdXJyZW50U2Nyb2xsUG9zID4gc3dpdGNoUG9pbnQpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBzaWRlYmFyIGlzIGFscmVhZHkgc3RpY2t5XG4gICAgICBpZiAoIWlzU3RpY2t5KSB7XG4gICAgICAgIGlzU3RpY2t5ID0gdHJ1ZTtcbiAgICAgICAgaXNBYnNvbHV0ZSA9IGZhbHNlO1xuICAgICAgICAkZWxlbS5hZGRDbGFzcyhzZXR0aW5ncy5zdGlja3lDbGFzcykucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWJzb2x1dGVDbGFzcyk7XG4gICAgICAgICRlbGVtQXJ0aWNsZS5hZGRDbGFzcyhzZXR0aW5ncy5hcnRpY2xlQ2xhc3MpO1xuICAgICAgICB1cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBzaWRlYmFyIGhhcyByZWFjaGVkIHRoZSBib3R0b20gc3dpdGNoIHBvaW50XG4gICAgICBpZiAoJCgnLmMtZm9vdGVyX19yZWFjaGVkJykuaXNPblNjcmVlbigpKSB7XG4gICAgICAgIGlzU3RpY2t5ID0gZmFsc2U7XG4gICAgICAgIGlzQWJzb2x1dGUgPSB0cnVlO1xuICAgICAgICAkZWxlbS5hZGRDbGFzcyhzZXR0aW5ncy5hYnNvbHV0ZUNsYXNzKTtcbiAgICAgICAgdXBkYXRlRGltZW5zaW9ucygpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChpc1N0aWNreSB8fCBpc0Fic29sdXRlKSB7XG4gICAgICBpc1N0aWNreSA9IGZhbHNlO1xuICAgICAgaXNBYnNvbHV0ZSA9IGZhbHNlO1xuICAgICAgJGVsZW0ucmVtb3ZlQ2xhc3MoYCR7c2V0dGluZ3Muc3RpY2t5Q2xhc3N9ICR7c2V0dGluZ3MuYWJzb2x1dGVDbGFzc31gKTtcbiAgICAgICRlbGVtQXJ0aWNsZS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5hcnRpY2xlQ2xhc3MpO1xuICAgICAgdXBkYXRlRGltZW5zaW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIFVwZGF0ZSBkaW1lbnNpb25zIG9uIHNpZGViYXJcbiAgKlxuICAqIFNldCB0byB0aGUgY3VycmVudCB2YWx1ZXMgb2YgbGVmdE9mZnNldCBhbmQgZWxlbVdpZHRoIGlmIHRoZSBlbGVtZW50IGlzXG4gICogY3VycmVudGx5IHN0aWNreS4gT3RoZXJ3aXNlLCBjbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdmFsdWVzXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlQ2xlYXIgLSBGbGFnIHRvIGNsZWFyIHNldCB2YWx1ZXMgcmVnYXJkbGVzcyBvZiBzdGlja3kgc3RhdHVzXG4gICovXG4gIGZ1bmN0aW9uIHVwZGF0ZURpbWVuc2lvbnMoZm9yY2VDbGVhcikge1xuICAgIGlmIChpc1N0aWNreSAmJiAhZm9yY2VDbGVhcikge1xuICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgbGVmdDogbGVmdE9mZnNldCArICdweCcsXG4gICAgICAgIHdpZHRoOiBlbGVtV2lkdGggKyAncHgnLFxuICAgICAgICB0b3A6ICcnLFxuICAgICAgICBib3R0b206ICcnXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGlzQWJzb2x1dGUgJiYgIWZvcmNlQ2xlYXIpIHtcbiAgICAgICRlbGVtLmNzcyh7XG4gICAgICAgIGxlZnQ6ICRlbGVtQ29udGFpbmVyLmNzcygncGFkZGluZy1sZWZ0JyksXG4gICAgICAgIHdpZHRoOiBlbGVtV2lkdGggKyAncHgnLFxuICAgICAgICB0b3A6ICdhdXRvJyxcbiAgICAgICAgYm90dG9tOiAkZWxlbUNvbnRhaW5lci5jc3MoJ3BhZGRpbmctYm90dG9tJylcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZWxlbS5jc3Moe1xuICAgICAgICBsZWZ0OiAnJyxcbiAgICAgICAgd2lkdGg6ICcnLFxuICAgICAgICB0b3A6ICcnLFxuICAgICAgICBib3R0b206ICcnXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBTZXQgdGhlIHN3aXRjaHBvaW50IGZvciB0aGUgZWxlbWVudCBhbmQgZ2V0IGl0cyBjdXJyZW50IG9mZnNldHNcbiAgKi9cbiAgZnVuY3Rpb24gc2V0T2Zmc2V0VmFsdWVzKCkge1xuICAgICRlbGVtLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICBpZiAoaXNTdGlja3kgfHwgaXNBYnNvbHV0ZSkge1xuICAgICAgJGVsZW0ucmVtb3ZlQ2xhc3MoYCR7c2V0dGluZ3Muc3RpY2t5Q2xhc3N9ICR7c2V0dGluZ3MuYWJzb2x1dGVDbGFzc31gKTtcbiAgICAgICRlbGVtQXJ0aWNsZS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5hcnRpY2xlQ2xhc3MpO1xuICAgIH1cbiAgICB1cGRhdGVEaW1lbnNpb25zKHRydWUpO1xuXG4gICAgc3dpdGNoUG9pbnQgPSAkZWxlbS5vZmZzZXQoKS50b3A7XG4gICAgLy8gQm90dG9tIHN3aXRjaCBwb2ludCBpcyBlcXVhbCB0byB0aGUgb2Zmc2V0IGFuZCBoZWlnaHQgb2YgdGhlIG91dGVyIGNvbnRhaW5lciwgbWludXMgYW55IHBhZGRpbmcgb24gdGhlIGJvdHRvbVxuICAgIHN3aXRjaFBvaW50Qm90dG9tID0gJGVsZW1Db250YWluZXIub2Zmc2V0KCkudG9wICsgJGVsZW1Db250YWluZXIub3V0ZXJIZWlnaHQoKSAtXG4gICAgICBwYXJzZUludCgkZWxlbUNvbnRhaW5lci5jc3MoJ3BhZGRpbmctYm90dG9tJyksIDEwKTtcblxuICAgIGxlZnRPZmZzZXQgPSAkZWxlbS5vZmZzZXQoKS5sZWZ0O1xuICAgIGVsZW1XaWR0aCA9ICRlbGVtLm91dGVyV2lkdGgoKTtcbiAgICBlbGVtSGVpZ2h0ID0gJGVsZW0ub3V0ZXJIZWlnaHQoKTtcblxuICAgIGlmIChpc1N0aWNreSB8fCBpc0Fic29sdXRlKSB7XG4gICAgICB1cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgICAkZWxlbS5hZGRDbGFzcyhzZXR0aW5ncy5zdGlja3lDbGFzcyk7XG4gICAgICAkZWxlbUFydGljbGUuYWRkQ2xhc3Moc2V0dGluZ3MuYXJ0aWNsZUNsYXNzKTtcbiAgICAgIGlmIChpc0Fic29sdXRlKSB7XG4gICAgICAgICRlbGVtLmFkZENsYXNzKHNldHRpbmdzLmFic29sdXRlQ2xhc3MpO1xuICAgICAgfVxuICAgIH1cbiAgICAkZWxlbS5jc3MoJ3Zpc2liaWxpdHknLCAnJyk7XG4gIH1cblxuICAvKipcbiAgKiBUdXJuIG9uIFwic3RpY2t5IG1vZGVcIlxuICAqXG4gICogV2F0Y2ggZm9yIHNjcm9sbCBhbmQgZml4IHRoZSBzaWRlYmFyLiBXYXRjaCBmb3Igc2l6ZXMgY2hhbmdlcyBvbiAjbWFpblxuICAqICh3aGljaCBtYXkgY2hhbmdlIGlmIHBhcmFsbGF4IGlzIHVzZWQpIGFuZCBhZGp1c3QgYWNjb3JkaW5nbHkuXG4gICovXG4gIGZ1bmN0aW9uIHN0aWNreU1vZGVPbigpIHtcbiAgICBzdGlja3lNb2RlID0gdHJ1ZTtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsLmZpeGVkU2lkZWJhcicsIHRocm90dGxlKGZ1bmN0aW9uKCkge1xuICAgICAgdG9nZ2xlU3RpY2t5KCk7XG4gICAgfSwgMTAwKSkudHJpZ2dlcignc2Nyb2xsLmZpeGVkU2lkZWJhcicpO1xuXG4gICAgJCgnI21haW4nKS5vbignY29udGFpbmVyU2l6ZUNoYW5nZS5maXhlZFNpZGViYXInLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgc3dpdGNoUG9pbnQgLT0gZXZlbnQub3JpZ2luYWxFdmVudC5kZXRhaWw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgKiBUdXJuIG9mZiBcInN0aWNreSBtb2RlXCJcbiAgKlxuICAqIFJlbW92ZSB0aGUgZXZlbnQgYmluZGluZyBhbmQgcmVzZXQgZXZlcnl0aGluZ1xuICAqL1xuICBmdW5jdGlvbiBzdGlja3lNb2RlT2ZmKCkge1xuICAgIGlmIChpc1N0aWNreSkge1xuICAgICAgdXBkYXRlRGltZW5zaW9ucyh0cnVlKTtcbiAgICAgICRlbGVtLnJlbW92ZUNsYXNzKHNldHRpbmdzLnN0aWNreUNsYXNzKTtcbiAgICB9XG4gICAgJCh3aW5kb3cpLm9mZignc2Nyb2xsLmZpeGVkU2lkZWJhcicpO1xuICAgICQoJyNtYWluJykub2ZmKCdjb250YWluZXJTaXplQ2hhbmdlLmZpeGVkU2lkZWJhcicpO1xuICAgIHN0aWNreU1vZGUgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAqIEhhbmRsZSAncmVzaXplJyBldmVudFxuICAqXG4gICogVHVybiBzdGlja3kgbW9kZSBvbi9vZmYgZGVwZW5kaW5nIG9uIHdoZXRoZXIgd2UncmUgaW4gZGVza3RvcCBtb2RlXG4gICogQHBhcmFtIHtib29sZWFufSBzdGlja3lNb2RlIC0gV2hldGhlciBzaWRlYmFyIHNob3VsZCBiZSBjb25zaWRlcmVkIHN0aWNreVxuICAqL1xuICBmdW5jdGlvbiBvblJlc2l6ZSgpIHtcbiAgICBjb25zdCBsYXJnZU1vZGUgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogJyArXG4gICAgICBzZXR0aW5ncy5sYXJnZUJyZWFrcG9pbnQgKyAnKScpLm1hdGNoZXM7XG4gICAgaWYgKGxhcmdlTW9kZSkge1xuICAgICAgc2V0T2Zmc2V0VmFsdWVzKCk7XG4gICAgICBpZiAoIXN0aWNreU1vZGUpIHtcbiAgICAgICAgc3RpY2t5TW9kZU9uKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzdGlja3lNb2RlKSB7XG4gICAgICBzdGlja3lNb2RlT2ZmKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogSW5pdGlhbGl6ZSB0aGUgc3RpY2t5IG5hdlxuICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtIC0gRE9NIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgc3RpY2t5XG4gICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zLiBXaWxsIG92ZXJyaWRlIG1vZHVsZSBkZWZhdWx0cyB3aGVuIHByZXNlbnRcbiAgKi9cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5maXhlZFNpZGViYXInLCBkZWJvdW5jZShmdW5jdGlvbigpIHtcbiAgICAgIG9uUmVzaXplKCk7XG4gICAgfSwgMTAwKSk7XG5cbiAgICBpbWFnZXNSZWFkeShkb2N1bWVudC5ib2R5KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgb25SZXNpemUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTtcblxuICAkLmZuLmlzT25TY3JlZW4gPSBmdW5jdGlvbigpe1xuICAgIHZhciB3aW4gPSAkKHdpbmRvdyk7XG5cbiAgICB2YXIgdmlld3BvcnQgPSB7XG4gICAgICAgIHRvcCA6IHdpbi5zY3JvbGxUb3AoKSxcbiAgICAgICAgbGVmdCA6IHdpbi5zY3JvbGxMZWZ0KClcbiAgICB9O1xuICAgIHZpZXdwb3J0LnJpZ2h0ID0gdmlld3BvcnQubGVmdCArIHdpbi53aWR0aCgpO1xuICAgIHZpZXdwb3J0LmJvdHRvbSA9IHZpZXdwb3J0LnRvcCArIHdpbi5oZWlnaHQoKTtcblxuICAgIHZhciBib3VuZHMgPSB0aGlzLm9mZnNldCgpO1xuICAgIGJvdW5kcy5yaWdodCA9IGJvdW5kcy5sZWZ0ICsgdGhpcy5vdXRlcldpZHRoKCk7XG4gICAgYm91bmRzLmJvdHRvbSA9IGJvdW5kcy50b3AgKyB0aGlzLm91dGVySGVpZ2h0KCk7XG5cbiAgICByZXR1cm4gKCEodmlld3BvcnQucmlnaHQgPCBib3VuZHMubGVmdCB8fCB2aWV3cG9ydC5sZWZ0ID4gYm91bmRzLnJpZ2h0IHx8IHZpZXdwb3J0LmJvdHRvbSA8IGJvdW5kcy50b3AgfHwgdmlld3BvcnQudG9wID4gYm91bmRzLmJvdHRvbSkpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgY29uc3QgJHN0aWNreU5hdnMgPSAkKCcuanMtc3RpY2t5Jyk7XG4gIGlmICgkc3RpY2t5TmF2cy5sZW5ndGgpIHtcbiAgICAkc3RpY2t5TmF2cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgbGV0ICRvdXRlckNvbnRhaW5lciA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXN0aWNreS1jb250YWluZXInKTtcbiAgICAgIGxldCAkYXJ0aWNsZSA9ICRvdXRlckNvbnRhaW5lci5maW5kKCcuanMtc3RpY2t5LWFydGljbGUnKTtcbiAgICAgIHN0aWNreU5hdigkKHRoaXMpLCAkb3V0ZXJDb250YWluZXIsICRhcnRpY2xlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc3RpY2tOYXYuanMiLCJ2YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL2RlYm91bmNlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRocm90dGxlZCBmdW5jdGlvbiB0aGF0IG9ubHkgaW52b2tlcyBgZnVuY2AgYXQgbW9zdCBvbmNlIHBlclxuICogZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gVGhlIHRocm90dGxlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGBcbiAqIG1ldGhvZCB0byBjYW5jZWwgZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG9cbiAqIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYFxuICogc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YFxuICogdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZVxuICogdGhyb3R0bGVkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gcmV0dXJuIHRoZVxuICogcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLnRocm90dGxlYCBhbmQgYF8uZGVib3VuY2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gdGhyb3R0bGUuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhyb3R0bGUgaW52b2NhdGlvbnMgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgdGhyb3R0bGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBleGNlc3NpdmVseSB1cGRhdGluZyB0aGUgcG9zaXRpb24gd2hpbGUgc2Nyb2xsaW5nLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Njcm9sbCcsIF8udGhyb3R0bGUodXBkYXRlUG9zaXRpb24sIDEwMCkpO1xuICpcbiAqIC8vIEludm9rZSBgcmVuZXdUb2tlbmAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGJ1dCBub3QgbW9yZSB0aGFuIG9uY2UgZXZlcnkgNSBtaW51dGVzLlxuICogdmFyIHRocm90dGxlZCA9IF8udGhyb3R0bGUocmVuZXdUb2tlbiwgMzAwMDAwLCB7ICd0cmFpbGluZyc6IGZhbHNlIH0pO1xuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIHRocm90dGxlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyB0aHJvdHRsZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIHRocm90dGxlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gJ2xlYWRpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMubGVhZGluZyA6IGxlYWRpbmc7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuICByZXR1cm4gZGVib3VuY2UoZnVuYywgd2FpdCwge1xuICAgICdsZWFkaW5nJzogbGVhZGluZyxcbiAgICAnbWF4V2FpdCc6IHdhaXQsXG4gICAgJ3RyYWlsaW5nJzogdHJhaWxpbmdcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhyb3R0bGU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvdGhyb3R0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDQ5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vdztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9ub3cuanNcbi8vIG1vZHVsZSBpZCA9IDUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTnVtYmVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzXG4vLyBtb2R1bGUgaWQgPSA1MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTeW1ib2wuanNcbi8vIG1vZHVsZSBpZCA9IDUyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIGltYWdlc3JlYWR5IHYwLjIuMiAtIDIwMTUtMDctMDRUMDY6MjI6MTQuNDM1WiAtIGh0dHBzOi8vZ2l0aHViLmNvbS9yLXBhcmsvaW1hZ2VzLXJlYWR5ICovXG47KGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5pbWFnZXNSZWFkeSA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcblwidXNlIHN0cmljdFwiO1xuXG4vLyBVc2UgdGhlIGZhc3Rlc3QgbWVhbnMgcG9zc2libGUgdG8gZXhlY3V0ZSBhIHRhc2sgaW4gaXRzIG93biB0dXJuLCB3aXRoXG4vLyBwcmlvcml0eSBvdmVyIG90aGVyIGV2ZW50cyBpbmNsdWRpbmcgSU8sIGFuaW1hdGlvbiwgcmVmbG93LCBhbmQgcmVkcmF3XG4vLyBldmVudHMgaW4gYnJvd3NlcnMuXG4vL1xuLy8gQW4gZXhjZXB0aW9uIHRocm93biBieSBhIHRhc2sgd2lsbCBwZXJtYW5lbnRseSBpbnRlcnJ1cHQgdGhlIHByb2Nlc3Npbmcgb2Zcbi8vIHN1YnNlcXVlbnQgdGFza3MuIFRoZSBoaWdoZXIgbGV2ZWwgYGFzYXBgIGZ1bmN0aW9uIGVuc3VyZXMgdGhhdCBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93biBieSBhIHRhc2ssIHRoYXQgdGhlIHRhc2sgcXVldWUgd2lsbCBjb250aW51ZSBmbHVzaGluZyBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZSwgYnV0IGlmIHlvdSB1c2UgYHJhd0FzYXBgIGRpcmVjdGx5LCB5b3UgYXJlIHJlc3BvbnNpYmxlIHRvXG4vLyBlaXRoZXIgZW5zdXJlIHRoYXQgbm8gZXhjZXB0aW9ucyBhcmUgdGhyb3duIGZyb20geW91ciB0YXNrLCBvciB0byBtYW51YWxseVxuLy8gY2FsbCBgcmF3QXNhcC5yZXF1ZXN0Rmx1c2hgIGlmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG4vL21vZHVsZS5leHBvcnRzID0gcmF3QXNhcDtcbmZ1bmN0aW9uIHJhd0FzYXAodGFzaykge1xuICAgIGlmICghcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHJlcXVlc3RGbHVzaCgpO1xuICAgICAgICBmbHVzaGluZyA9IHRydWU7XG4gICAgfVxuICAgIC8vIEVxdWl2YWxlbnQgdG8gcHVzaCwgYnV0IGF2b2lkcyBhIGZ1bmN0aW9uIGNhbGwuXG4gICAgcXVldWVbcXVldWUubGVuZ3RoXSA9IHRhc2s7XG59XG5cbnZhciBxdWV1ZSA9IFtdO1xuLy8gT25jZSBhIGZsdXNoIGhhcyBiZWVuIHJlcXVlc3RlZCwgbm8gZnVydGhlciBjYWxscyB0byBgcmVxdWVzdEZsdXNoYCBhcmVcbi8vIG5lY2Vzc2FyeSB1bnRpbCB0aGUgbmV4dCBgZmx1c2hgIGNvbXBsZXRlcy5cbnZhciBmbHVzaGluZyA9IGZhbHNlO1xuLy8gYHJlcXVlc3RGbHVzaGAgaXMgYW4gaW1wbGVtZW50YXRpb24tc3BlY2lmaWMgbWV0aG9kIHRoYXQgYXR0ZW1wdHMgdG8ga2lja1xuLy8gb2ZmIGEgYGZsdXNoYCBldmVudCBhcyBxdWlja2x5IGFzIHBvc3NpYmxlLiBgZmx1c2hgIHdpbGwgYXR0ZW1wdCB0byBleGhhdXN0XG4vLyB0aGUgZXZlbnQgcXVldWUgYmVmb3JlIHlpZWxkaW5nIHRvIHRoZSBicm93c2VyJ3Mgb3duIGV2ZW50IGxvb3AuXG52YXIgcmVxdWVzdEZsdXNoO1xuLy8gVGhlIHBvc2l0aW9uIG9mIHRoZSBuZXh0IHRhc2sgdG8gZXhlY3V0ZSBpbiB0aGUgdGFzayBxdWV1ZS4gVGhpcyBpc1xuLy8gcHJlc2VydmVkIGJldHdlZW4gY2FsbHMgdG8gYGZsdXNoYCBzbyB0aGF0IGl0IGNhbiBiZSByZXN1bWVkIGlmXG4vLyBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbnZhciBpbmRleCA9IDA7XG4vLyBJZiBhIHRhc2sgc2NoZWR1bGVzIGFkZGl0aW9uYWwgdGFza3MgcmVjdXJzaXZlbHksIHRoZSB0YXNrIHF1ZXVlIGNhbiBncm93XG4vLyB1bmJvdW5kZWQuIFRvIHByZXZlbnQgbWVtb3J5IGV4aGF1c3Rpb24sIHRoZSB0YXNrIHF1ZXVlIHdpbGwgcGVyaW9kaWNhbGx5XG4vLyB0cnVuY2F0ZSBhbHJlYWR5LWNvbXBsZXRlZCB0YXNrcy5cbnZhciBjYXBhY2l0eSA9IDEwMjQ7XG5cbi8vIFRoZSBmbHVzaCBmdW5jdGlvbiBwcm9jZXNzZXMgYWxsIHRhc2tzIHRoYXQgaGF2ZSBiZWVuIHNjaGVkdWxlZCB3aXRoXG4vLyBgcmF3QXNhcGAgdW5sZXNzIGFuZCB1bnRpbCBvbmUgb2YgdGhvc2UgdGFza3MgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbi8vIElmIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLCBgZmx1c2hgIGVuc3VyZXMgdGhhdCBpdHMgc3RhdGUgd2lsbCByZW1haW5cbi8vIGNvbnNpc3RlbnQgYW5kIHdpbGwgcmVzdW1lIHdoZXJlIGl0IGxlZnQgb2ZmIHdoZW4gY2FsbGVkIGFnYWluLlxuLy8gSG93ZXZlciwgYGZsdXNoYCBkb2VzIG5vdCBtYWtlIGFueSBhcnJhbmdlbWVudHMgdG8gYmUgY2FsbGVkIGFnYWluIGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duLlxuZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgd2hpbGUgKGluZGV4IDwgcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgLy8gQWR2YW5jZSB0aGUgaW5kZXggYmVmb3JlIGNhbGxpbmcgdGhlIHRhc2suIFRoaXMgZW5zdXJlcyB0aGF0IHdlIHdpbGxcbiAgICAgICAgLy8gYmVnaW4gZmx1c2hpbmcgb24gdGhlIG5leHQgdGFzayB0aGUgdGFzayB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICAgIGluZGV4ID0gaW5kZXggKyAxO1xuICAgICAgICBxdWV1ZVtjdXJyZW50SW5kZXhdLmNhbGwoKTtcbiAgICAgICAgLy8gUHJldmVudCBsZWFraW5nIG1lbW9yeSBmb3IgbG9uZyBjaGFpbnMgb2YgcmVjdXJzaXZlIGNhbGxzIHRvIGBhc2FwYC5cbiAgICAgICAgLy8gSWYgd2UgY2FsbCBgYXNhcGAgd2l0aGluIHRhc2tzIHNjaGVkdWxlZCBieSBgYXNhcGAsIHRoZSBxdWV1ZSB3aWxsXG4gICAgICAgIC8vIGdyb3csIGJ1dCB0byBhdm9pZCBhbiBPKG4pIHdhbGsgZm9yIGV2ZXJ5IHRhc2sgd2UgZXhlY3V0ZSwgd2UgZG9uJ3RcbiAgICAgICAgLy8gc2hpZnQgdGFza3Mgb2ZmIHRoZSBxdWV1ZSBhZnRlciB0aGV5IGhhdmUgYmVlbiBleGVjdXRlZC5cbiAgICAgICAgLy8gSW5zdGVhZCwgd2UgcGVyaW9kaWNhbGx5IHNoaWZ0IDEwMjQgdGFza3Mgb2ZmIHRoZSBxdWV1ZS5cbiAgICAgICAgaWYgKGluZGV4ID4gY2FwYWNpdHkpIHtcbiAgICAgICAgICAgIC8vIE1hbnVhbGx5IHNoaWZ0IGFsbCB2YWx1ZXMgc3RhcnRpbmcgYXQgdGhlIGluZGV4IGJhY2sgdG8gdGhlXG4gICAgICAgICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIHF1ZXVlLlxuICAgICAgICAgICAgZm9yICh2YXIgc2NhbiA9IDAsIG5ld0xlbmd0aCA9IHF1ZXVlLmxlbmd0aCAtIGluZGV4OyBzY2FuIDwgbmV3TGVuZ3RoOyBzY2FuKyspIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVtzY2FuXSA9IHF1ZXVlW3NjYW4gKyBpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZS5sZW5ndGggLT0gaW5kZXg7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICBpbmRleCA9IDA7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgaXMgaW1wbGVtZW50ZWQgdXNpbmcgYSBzdHJhdGVneSBiYXNlZCBvbiBkYXRhIGNvbGxlY3RlZCBmcm9tXG4vLyBldmVyeSBhdmFpbGFibGUgU2F1Y2VMYWJzIFNlbGVuaXVtIHdlYiBkcml2ZXIgd29ya2VyIGF0IHRpbWUgb2Ygd3JpdGluZy5cbi8vIGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzFtRy01VVlHdXA1cXhHZEVNV2toUDZCV0N6MDUzTlViMkUxUW9VVFUxNnVBL2VkaXQjZ2lkPTc4MzcyNDU5M1xuXG4vLyBTYWZhcmkgNiBhbmQgNi4xIGZvciBkZXNrdG9wLCBpUGFkLCBhbmQgaVBob25lIGFyZSB0aGUgb25seSBicm93c2VycyB0aGF0XG4vLyBoYXZlIFdlYktpdE11dGF0aW9uT2JzZXJ2ZXIgYnV0IG5vdCB1bi1wcmVmaXhlZCBNdXRhdGlvbk9ic2VydmVyLlxuLy8gTXVzdCB1c2UgYGdsb2JhbGAgaW5zdGVhZCBvZiBgd2luZG93YCB0byB3b3JrIGluIGJvdGggZnJhbWVzIGFuZCB3ZWJcbi8vIHdvcmtlcnMuIGBnbG9iYWxgIGlzIGEgcHJvdmlzaW9uIG9mIEJyb3dzZXJpZnksIE1yLCBNcnMsIG9yIE1vcC5cbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8IHdpbmRvdy5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG4vLyBNdXRhdGlvbk9ic2VydmVycyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBoYXZlIGhpZ2ggcHJpb3JpdHkgYW5kIHdvcmtcbi8vIHJlbGlhYmx5IGV2ZXJ5d2hlcmUgdGhleSBhcmUgaW1wbGVtZW50ZWQuXG4vLyBUaGV5IGFyZSBpbXBsZW1lbnRlZCBpbiBhbGwgbW9kZXJuIGJyb3dzZXJzLlxuLy9cbi8vIC0gQW5kcm9pZCA0LTQuM1xuLy8gLSBDaHJvbWUgMjYtMzRcbi8vIC0gRmlyZWZveCAxNC0yOVxuLy8gLSBJbnRlcm5ldCBFeHBsb3JlciAxMVxuLy8gLSBpUGFkIFNhZmFyaSA2LTcuMVxuLy8gLSBpUGhvbmUgU2FmYXJpIDctNy4xXG4vLyAtIFNhZmFyaSA2LTdcbmlmICh0eXBlb2YgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcblxuLy8gTWVzc2FnZUNoYW5uZWxzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGdpdmUgZGlyZWN0IGFjY2VzcyB0byB0aGUgSFRNTFxuLy8gdGFzayBxdWV1ZSwgYXJlIGltcGxlbWVudGVkIGluIEludGVybmV0IEV4cGxvcmVyIDEwLCBTYWZhcmkgNS4wLTEsIGFuZCBPcGVyYVxuLy8gMTEtMTIsIGFuZCBpbiB3ZWIgd29ya2VycyBpbiBtYW55IGVuZ2luZXMuXG4vLyBBbHRob3VnaCBtZXNzYWdlIGNoYW5uZWxzIHlpZWxkIHRvIGFueSBxdWV1ZWQgcmVuZGVyaW5nIGFuZCBJTyB0YXNrcywgdGhleVxuLy8gd291bGQgYmUgYmV0dGVyIHRoYW4gaW1wb3NpbmcgdGhlIDRtcyBkZWxheSBvZiB0aW1lcnMuXG4vLyBIb3dldmVyLCB0aGV5IGRvIG5vdCB3b3JrIHJlbGlhYmx5IGluIEludGVybmV0IEV4cGxvcmVyIG9yIFNhZmFyaS5cblxuLy8gSW50ZXJuZXQgRXhwbG9yZXIgMTAgaXMgdGhlIG9ubHkgYnJvd3NlciB0aGF0IGhhcyBzZXRJbW1lZGlhdGUgYnV0IGRvZXNcbi8vIG5vdCBoYXZlIE11dGF0aW9uT2JzZXJ2ZXJzLlxuLy8gQWx0aG91Z2ggc2V0SW1tZWRpYXRlIHlpZWxkcyB0byB0aGUgYnJvd3NlcidzIHJlbmRlcmVyLCBpdCB3b3VsZCBiZVxuLy8gcHJlZmVycmFibGUgdG8gZmFsbGluZyBiYWNrIHRvIHNldFRpbWVvdXQgc2luY2UgaXQgZG9lcyBub3QgaGF2ZVxuLy8gdGhlIG1pbmltdW0gNG1zIHBlbmFsdHkuXG4vLyBVbmZvcnR1bmF0ZWx5IHRoZXJlIGFwcGVhcnMgdG8gYmUgYSBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAgTW9iaWxlIChhbmRcbi8vIERlc2t0b3AgdG8gYSBsZXNzZXIgZXh0ZW50KSB0aGF0IHJlbmRlcnMgYm90aCBzZXRJbW1lZGlhdGUgYW5kXG4vLyBNZXNzYWdlQ2hhbm5lbCB1c2VsZXNzIGZvciB0aGUgcHVycG9zZXMgb2YgQVNBUC5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS9pc3N1ZXMvMzk2XG5cbi8vIFRpbWVycyBhcmUgaW1wbGVtZW50ZWQgdW5pdmVyc2FsbHkuXG4vLyBXZSBmYWxsIGJhY2sgdG8gdGltZXJzIGluIHdvcmtlcnMgaW4gbW9zdCBlbmdpbmVzLCBhbmQgaW4gZm9yZWdyb3VuZFxuLy8gY29udGV4dHMgaW4gdGhlIGZvbGxvd2luZyBicm93c2Vycy5cbi8vIEhvd2V2ZXIsIG5vdGUgdGhhdCBldmVuIHRoaXMgc2ltcGxlIGNhc2UgcmVxdWlyZXMgbnVhbmNlcyB0byBvcGVyYXRlIGluIGFcbi8vIGJyb2FkIHNwZWN0cnVtIG9mIGJyb3dzZXJzLlxuLy9cbi8vIC0gRmlyZWZveCAzLTEzXG4vLyAtIEludGVybmV0IEV4cGxvcmVyIDYtOVxuLy8gLSBpUGFkIFNhZmFyaSA0LjNcbi8vIC0gTHlueCAyLjguN1xufSBlbHNlIHtcbiAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoZmx1c2gpO1xufVxuXG4vLyBgcmVxdWVzdEZsdXNoYCByZXF1ZXN0cyB0aGF0IHRoZSBoaWdoIHByaW9yaXR5IGV2ZW50IHF1ZXVlIGJlIGZsdXNoZWQgYXNcbi8vIHNvb24gYXMgcG9zc2libGUuXG4vLyBUaGlzIGlzIHVzZWZ1bCB0byBwcmV2ZW50IGFuIGVycm9yIHRocm93biBpbiBhIHRhc2sgZnJvbSBzdGFsbGluZyB0aGUgZXZlbnRcbi8vIHF1ZXVlIGlmIHRoZSBleGNlcHRpb24gaGFuZGxlZCBieSBOb2RlLmpz4oCZc1xuLy8gYHByb2Nlc3Mub24oXCJ1bmNhdWdodEV4Y2VwdGlvblwiKWAgb3IgYnkgYSBkb21haW4uXG5yYXdBc2FwLnJlcXVlc3RGbHVzaCA9IHJlcXVlc3RGbHVzaDtcblxuLy8gVG8gcmVxdWVzdCBhIGhpZ2ggcHJpb3JpdHkgZXZlbnQsIHdlIGluZHVjZSBhIG11dGF0aW9uIG9ic2VydmVyIGJ5IHRvZ2dsaW5nXG4vLyB0aGUgdGV4dCBvZiBhIHRleHQgbm9kZSBiZXR3ZWVuIFwiMVwiIGFuZCBcIi0xXCIuXG5mdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjaykge1xuICAgIHZhciB0b2dnbGUgPSAxO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuICAgICAgICB0b2dnbGUgPSAtdG9nZ2xlO1xuICAgICAgICBub2RlLmRhdGEgPSB0b2dnbGU7XG4gICAgfTtcbn1cblxuLy8gVGhlIG1lc3NhZ2UgY2hhbm5lbCB0ZWNobmlxdWUgd2FzIGRpc2NvdmVyZWQgYnkgTWFsdGUgVWJsIGFuZCB3YXMgdGhlXG4vLyBvcmlnaW5hbCBmb3VuZGF0aW9uIGZvciB0aGlzIGxpYnJhcnkuXG4vLyBodHRwOi8vd3d3Lm5vbmJsb2NraW5nLmlvLzIwMTEvMDYvd2luZG93bmV4dHRpY2suaHRtbFxuXG4vLyBTYWZhcmkgNi4wLjUgKGF0IGxlYXN0KSBpbnRlcm1pdHRlbnRseSBmYWlscyB0byBjcmVhdGUgbWVzc2FnZSBwb3J0cyBvbiBhXG4vLyBwYWdlJ3MgZmlyc3QgbG9hZC4gVGhhbmtmdWxseSwgdGhpcyB2ZXJzaW9uIG9mIFNhZmFyaSBzdXBwb3J0c1xuLy8gTXV0YXRpb25PYnNlcnZlcnMsIHNvIHdlIGRvbid0IG5lZWQgdG8gZmFsbCBiYWNrIGluIHRoYXQgY2FzZS5cblxuLy8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU1lc3NhZ2VDaGFubmVsKGNhbGxiYWNrKSB7XG4vLyAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbi8vICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGNhbGxiYWNrO1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbi8vICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbi8vICAgICB9O1xuLy8gfVxuXG4vLyBGb3IgcmVhc29ucyBleHBsYWluZWQgYWJvdmUsIHdlIGFyZSBhbHNvIHVuYWJsZSB0byB1c2UgYHNldEltbWVkaWF0ZWBcbi8vIHVuZGVyIGFueSBjaXJjdW1zdGFuY2VzLlxuLy8gRXZlbiBpZiB3ZSB3ZXJlLCB0aGVyZSBpcyBhbm90aGVyIGJ1ZyBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMC5cbi8vIEl0IGlzIG5vdCBzdWZmaWNpZW50IHRvIGFzc2lnbiBgc2V0SW1tZWRpYXRlYCB0byBgcmVxdWVzdEZsdXNoYCBiZWNhdXNlXG4vLyBgc2V0SW1tZWRpYXRlYCBtdXN0IGJlIGNhbGxlZCAqYnkgbmFtZSogYW5kIHRoZXJlZm9yZSBtdXN0IGJlIHdyYXBwZWQgaW4gYVxuLy8gY2xvc3VyZS5cbi8vIE5ldmVyIGZvcmdldC5cblxuLy8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbi8vICAgICAgICAgc2V0SW1tZWRpYXRlKGNhbGxiYWNrKTtcbi8vICAgICB9O1xuLy8gfVxuXG4vLyBTYWZhcmkgNi4wIGhhcyBhIHByb2JsZW0gd2hlcmUgdGltZXJzIHdpbGwgZ2V0IGxvc3Qgd2hpbGUgdGhlIHVzZXIgaXNcbi8vIHNjcm9sbGluZy4gVGhpcyBwcm9ibGVtIGRvZXMgbm90IGltcGFjdCBBU0FQIGJlY2F1c2UgU2FmYXJpIDYuMCBzdXBwb3J0c1xuLy8gbXV0YXRpb24gb2JzZXJ2ZXJzLCBzbyB0aGF0IGltcGxlbWVudGF0aW9uIGlzIHVzZWQgaW5zdGVhZC5cbi8vIEhvd2V2ZXIsIGlmIHdlIGV2ZXIgZWxlY3QgdG8gdXNlIHRpbWVycyBpbiBTYWZhcmksIHRoZSBwcmV2YWxlbnQgd29yay1hcm91bmRcbi8vIGlzIHRvIGFkZCBhIHNjcm9sbCBldmVudCBsaXN0ZW5lciB0aGF0IGNhbGxzIGZvciBhIGZsdXNoLlxuXG4vLyBgc2V0VGltZW91dGAgZG9lcyBub3QgY2FsbCB0aGUgcGFzc2VkIGNhbGxiYWNrIGlmIHRoZSBkZWxheSBpcyBsZXNzIHRoYW5cbi8vIGFwcHJveGltYXRlbHkgNyBpbiB3ZWIgd29ya2VycyBpbiBGaXJlZm94IDggdGhyb3VnaCAxOCwgYW5kIHNvbWV0aW1lcyBub3Rcbi8vIGV2ZW4gdGhlbi5cblxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuICAgICAgICAvLyBXZSBkaXNwYXRjaCBhIHRpbWVvdXQgd2l0aCBhIHNwZWNpZmllZCBkZWxheSBvZiAwIGZvciBlbmdpbmVzIHRoYXRcbiAgICAgICAgLy8gY2FuIHJlbGlhYmx5IGFjY29tbW9kYXRlIHRoYXQgcmVxdWVzdC4gVGhpcyB3aWxsIHVzdWFsbHkgYmUgc25hcHBlZFxuICAgICAgICAvLyB0byBhIDQgbWlsaXNlY29uZCBkZWxheSwgYnV0IG9uY2Ugd2UncmUgZmx1c2hpbmcsIHRoZXJlJ3Mgbm8gZGVsYXlcbiAgICAgICAgLy8gYmV0d2VlbiBldmVudHMuXG4gICAgICAgIHZhciB0aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dChoYW5kbGVUaW1lciwgMCk7XG4gICAgICAgIC8vIEhvd2V2ZXIsIHNpbmNlIHRoaXMgdGltZXIgZ2V0cyBmcmVxdWVudGx5IGRyb3BwZWQgaW4gRmlyZWZveFxuICAgICAgICAvLyB3b3JrZXJzLCB3ZSBlbmxpc3QgYW4gaW50ZXJ2YWwgaGFuZGxlIHRoYXQgd2lsbCB0cnkgdG8gZmlyZVxuICAgICAgICAvLyBhbiBldmVudCAyMCB0aW1lcyBwZXIgc2Vjb25kIHVudGlsIGl0IHN1Y2NlZWRzLlxuICAgICAgICB2YXIgaW50ZXJ2YWxIYW5kbGUgPSBzZXRJbnRlcnZhbChoYW5kbGVUaW1lciwgNTApO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRpbWVyKCkge1xuICAgICAgICAgICAgLy8gV2hpY2hldmVyIHRpbWVyIHN1Y2NlZWRzIHdpbGwgY2FuY2VsIGJvdGggdGltZXJzIGFuZFxuICAgICAgICAgICAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2suXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEhhbmRsZSk7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSGFuZGxlKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyBUaGlzIGlzIGZvciBgYXNhcC5qc2Agb25seS5cbi8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdCBkZXBlbmRzIG9uXG4vLyBpdHMgZXhpc3RlbmNlLlxucmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIgPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXI7XG5cbi8vIEFTQVAgd2FzIG9yaWdpbmFsbHkgYSBuZXh0VGljayBzaGltIGluY2x1ZGVkIGluIFEuIFRoaXMgd2FzIGZhY3RvcmVkIG91dFxuLy8gaW50byB0aGlzIEFTQVAgcGFja2FnZS4gSXQgd2FzIGxhdGVyIGFkYXB0ZWQgdG8gUlNWUCB3aGljaCBtYWRlIGZ1cnRoZXJcbi8vIGFtZW5kbWVudHMuIFRoZXNlIGRlY2lzaW9ucywgcGFydGljdWxhcmx5IHRvIG1hcmdpbmFsaXplIE1lc3NhZ2VDaGFubmVsIGFuZFxuLy8gdG8gY2FwdHVyZSB0aGUgTXV0YXRpb25PYnNlcnZlciBpbXBsZW1lbnRhdGlvbiBpbiBhIGNsb3N1cmUsIHdlcmUgaW50ZWdyYXRlZFxuLy8gYmFjayBpbnRvIEFTQVAgcHJvcGVyLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RpbGRlaW8vcnN2cC5qcy9ibG9iL2NkZGY3MjMyNTQ2YTljZjg1ODUyNGI3NWNkZTZmOWVkZjcyNjIwYTcvbGliL3JzdnAvYXNhcC5qc1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vdmFyIGFzYXAgPSByZXF1aXJlKCdhc2FwL3JhdycpO1xudmFyIGFzYXAgPSByYXdBc2FwO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuLy8gU3RhdGVzOlxuLy9cbi8vIDAgLSBwZW5kaW5nXG4vLyAxIC0gZnVsZmlsbGVkIHdpdGggX3ZhbHVlXG4vLyAyIC0gcmVqZWN0ZWQgd2l0aCBfdmFsdWVcbi8vIDMgLSBhZG9wdGVkIHRoZSBzdGF0ZSBvZiBhbm90aGVyIHByb21pc2UsIF92YWx1ZVxuLy9cbi8vIG9uY2UgdGhlIHN0YXRlIGlzIG5vIGxvbmdlciBwZW5kaW5nICgwKSBpdCBpcyBpbW11dGFibGVcblxuLy8gQWxsIGBfYCBwcmVmaXhlZCBwcm9wZXJ0aWVzIHdpbGwgYmUgcmVkdWNlZCB0byBgX3tyYW5kb20gbnVtYmVyfWBcbi8vIGF0IGJ1aWxkIHRpbWUgdG8gb2JmdXNjYXRlIHRoZW0gYW5kIGRpc2NvdXJhZ2UgdGhlaXIgdXNlLlxuLy8gV2UgZG9uJ3QgdXNlIHN5bWJvbHMgb3IgT2JqZWN0LmRlZmluZVByb3BlcnR5IHRvIGZ1bGx5IGhpZGUgdGhlbVxuLy8gYmVjYXVzZSB0aGUgcGVyZm9ybWFuY2UgaXNuJ3QgZ29vZCBlbm91Z2guXG5cblxuLy8gdG8gYXZvaWQgdXNpbmcgdHJ5L2NhdGNoIGluc2lkZSBjcml0aWNhbCBmdW5jdGlvbnMsIHdlXG4vLyBleHRyYWN0IHRoZW0gdG8gaGVyZS5cbnZhciBMQVNUX0VSUk9SID0gbnVsbDtcbnZhciBJU19FUlJPUiA9IHt9O1xuZnVuY3Rpb24gZ2V0VGhlbihvYmopIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gb2JqLnRoZW47XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgTEFTVF9FUlJPUiA9IGV4O1xuICAgIHJldHVybiBJU19FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cnlDYWxsT25lKGZuLCBhKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZuKGEpO1xuICB9IGNhdGNoIChleCkge1xuICAgIExBU1RfRVJST1IgPSBleDtcbiAgICByZXR1cm4gSVNfRVJST1I7XG4gIH1cbn1cbmZ1bmN0aW9uIHRyeUNhbGxUd28oZm4sIGEsIGIpIHtcbiAgdHJ5IHtcbiAgICBmbihhLCBiKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBMQVNUX0VSUk9SID0gZXg7XG4gICAgcmV0dXJuIElTX0VSUk9SO1xuICB9XG59XG5cbi8vbW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuXG5mdW5jdGlvbiBQcm9taXNlKGZuKSB7XG4gIGlmICh0eXBlb2YgdGhpcyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXcnKTtcbiAgfVxuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGEgZnVuY3Rpb24nKTtcbiAgfVxuICB0aGlzLl80MSA9IDA7XG4gIHRoaXMuXzg2ID0gbnVsbDtcbiAgdGhpcy5fMTcgPSBbXTtcbiAgaWYgKGZuID09PSBub29wKSByZXR1cm47XG4gIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG59XG5Qcm9taXNlLl8xID0gbm9vcDtcblxuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIGlmICh0aGlzLmNvbnN0cnVjdG9yICE9PSBQcm9taXNlKSB7XG4gICAgcmV0dXJuIHNhZmVUaGVuKHRoaXMsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKTtcbiAgfVxuICB2YXIgcmVzID0gbmV3IFByb21pc2Uobm9vcCk7XG4gIGhhbmRsZSh0aGlzLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcmVzKSk7XG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBzYWZlVGhlbihzZWxmLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICByZXR1cm4gbmV3IHNlbGYuY29uc3RydWN0b3IoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXMgPSBuZXcgUHJvbWlzZShub29wKTtcbiAgICByZXMudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIGhhbmRsZShzZWxmLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcmVzKSk7XG4gIH0pO1xufTtcbmZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xuICB3aGlsZSAoc2VsZi5fNDEgPT09IDMpIHtcbiAgICBzZWxmID0gc2VsZi5fODY7XG4gIH1cbiAgaWYgKHNlbGYuXzQxID09PSAwKSB7XG4gICAgc2VsZi5fMTcucHVzaChkZWZlcnJlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGFzYXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNiID0gc2VsZi5fNDEgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG4gICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICBpZiAoc2VsZi5fNDEgPT09IDEpIHtcbiAgICAgICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl84Nik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fODYpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmV0ID0gdHJ5Q2FsbE9uZShjYiwgc2VsZi5fODYpO1xuICAgIGlmIChyZXQgPT09IElTX0VSUk9SKSB7XG4gICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgTEFTVF9FUlJPUik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgcmV0KTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICBpZiAobmV3VmFsdWUgPT09IHNlbGYpIHtcbiAgICByZXR1cm4gcmVqZWN0KFxuICAgICAgc2VsZixcbiAgICAgIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJylcbiAgICApO1xuICB9XG4gIGlmIChcbiAgICBuZXdWYWx1ZSAmJlxuICAgICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgKSB7XG4gICAgdmFyIHRoZW4gPSBnZXRUaGVuKG5ld1ZhbHVlKTtcbiAgICBpZiAodGhlbiA9PT0gSVNfRVJST1IpIHtcbiAgICAgIHJldHVybiByZWplY3Qoc2VsZiwgTEFTVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRoZW4gPT09IHNlbGYudGhlbiAmJlxuICAgICAgbmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlXG4gICAgKSB7XG4gICAgICBzZWxmLl80MSA9IDM7XG4gICAgICBzZWxmLl84NiA9IG5ld1ZhbHVlO1xuICAgICAgZmluYWxlKHNlbGYpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRvUmVzb2x2ZSh0aGVuLmJpbmQobmV3VmFsdWUpLCBzZWxmKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgc2VsZi5fNDEgPSAxO1xuICBzZWxmLl84NiA9IG5ld1ZhbHVlO1xuICBmaW5hbGUoc2VsZik7XG59XG5cbmZ1bmN0aW9uIHJlamVjdChzZWxmLCBuZXdWYWx1ZSkge1xuICBzZWxmLl80MSA9IDI7XG4gIHNlbGYuXzg2ID0gbmV3VmFsdWU7XG4gIGZpbmFsZShzZWxmKTtcbn1cbmZ1bmN0aW9uIGZpbmFsZShzZWxmKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5fMTcubGVuZ3RoOyBpKyspIHtcbiAgICBoYW5kbGUoc2VsZiwgc2VsZi5fMTdbaV0pO1xuICB9XG4gIHNlbGYuXzE3ID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSl7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5cbi8qKlxuICogVGFrZSBhIHBvdGVudGlhbGx5IG1pc2JlaGF2aW5nIHJlc29sdmVyIGZ1bmN0aW9uIGFuZCBtYWtlIHN1cmVcbiAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIE1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgYXN5bmNocm9ueS5cbiAqL1xuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBwcm9taXNlKSB7XG4gIHZhciBkb25lID0gZmFsc2U7XG4gIHZhciByZXMgPSB0cnlDYWxsVHdvKGZuLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgIGRvbmUgPSB0cnVlO1xuICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgfSlcbiAgaWYgKCFkb25lICYmIHJlcyA9PT0gSVNfRVJST1IpIHtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3QocHJvbWlzZSwgTEFTVF9FUlJPUik7XG4gIH1cbn1cblxuJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuICogQG5hbWUgSW1hZ2VzUmVhZHlcbiAqIEBjb25zdHJ1Y3RvclxuICpcbiAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudHxFbGVtZW50fEVsZW1lbnRbXXxqUXVlcnl8Tm9kZUxpc3R8c3RyaW5nfSBlbGVtZW50c1xuICogQHBhcmFtIHtib29sZWFufSBqcXVlcnlcbiAqXG4gKi9cbmZ1bmN0aW9uIEltYWdlc1JlYWR5KGVsZW1lbnRzLCBqcXVlcnkpIHtcbiAgaWYgKHR5cGVvZiBlbGVtZW50cyA9PT0gJ3N0cmluZycpIHtcbiAgICBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudHMpO1xuICAgIGlmICghZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlbGVjdG9yIGAnICsgZWxlbWVudHMgKyAnYCB5aWVsZGVkIDAgZWxlbWVudHMnKTtcbiAgICB9XG4gIH1cblxuICB2YXIgZGVmZXJyZWQgPSBkZWZlcihqcXVlcnkpO1xuICB0aGlzLnJlc3VsdCA9IGRlZmVycmVkLnByb21pc2U7XG5cbiAgdmFyIGltYWdlcyA9IHRoaXMuaW1hZ2VFbGVtZW50cyhcbiAgICB0aGlzLnZhbGlkRWxlbWVudHModGhpcy50b0FycmF5KGVsZW1lbnRzKSwgSW1hZ2VzUmVhZHkuVkFMSURfTk9ERV9UWVBFUylcbiAgKTtcblxuICB2YXIgaW1hZ2VDb3VudCA9IGltYWdlcy5sZW5ndGg7XG5cbiAgaWYgKGltYWdlQ291bnQpIHtcbiAgICB0aGlzLnZlcmlmeShpbWFnZXMsIHN0YXR1cyhpbWFnZUNvdW50LCBmdW5jdGlvbihyZWFkeSl7XG4gICAgICBpZiAocmVhZHkpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShlbGVtZW50cyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVsZW1lbnRzKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZShlbGVtZW50cyk7XG4gIH1cbn1cblxuXG5JbWFnZXNSZWFkeS5WQUxJRF9OT0RFX1RZUEVTID0ge1xuICAxICA6IHRydWUsIC8vIEVMRU1FTlRfTk9ERVxuICA5ICA6IHRydWUsIC8vIERPQ1VNRU5UX05PREVcbiAgMTEgOiB0cnVlICAvLyBET0NVTUVOVF9GUkFHTUVOVF9OT0RFXG59O1xuXG5cbkltYWdlc1JlYWR5LnByb3RvdHlwZSA9IHtcblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50W119IGVsZW1lbnRzXG4gICAqIEByZXR1cm5zIHtbXXxIVE1MSW1hZ2VFbGVtZW50W119XG4gICAqL1xuICBpbWFnZUVsZW1lbnRzIDogZnVuY3Rpb24oZWxlbWVudHMpIHtcbiAgICB2YXIgaW1hZ2VzID0gW107XG5cbiAgICBlbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTUcnKSB7XG4gICAgICAgIGltYWdlcy5wdXNoKGVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBpbWFnZUVsZW1lbnRzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWcnKTtcbiAgICAgICAgaWYgKGltYWdlRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgaW1hZ2VzLnB1c2guYXBwbHkoaW1hZ2VzLCBpbWFnZUVsZW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGltYWdlcztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxlbWVudHNcbiAgICogQHBhcmFtIHt7fX0gdmFsaWROb2RlVHlwZXNcbiAgICogQHJldHVybnMge1tdfEVsZW1lbnRbXX1cbiAgICovXG4gIHZhbGlkRWxlbWVudHMgOiBmdW5jdGlvbihlbGVtZW50cywgdmFsaWROb2RlVHlwZXMpIHtcbiAgICByZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgICAgcmV0dXJuIHZhbGlkTm9kZVR5cGVzW2VsZW1lbnQubm9kZVR5cGVdO1xuICAgIH0pO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudFtdfSBpbWFnZXNcbiAgICogQHJldHVybnMge1tdfEhUTUxJbWFnZUVsZW1lbnRbXX1cbiAgICovXG4gIGluY29tcGxldGVJbWFnZXMgOiBmdW5jdGlvbihpbWFnZXMpIHtcbiAgICByZXR1cm4gaW1hZ2VzLmZpbHRlcihmdW5jdGlvbihpbWFnZSl7XG4gICAgICByZXR1cm4gIShpbWFnZS5jb21wbGV0ZSAmJiBpbWFnZS5uYXR1cmFsV2lkdGgpO1xuICAgIH0pO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9ubG9hZFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbmVycm9yXG4gICAqIEByZXR1cm5zIHtmdW5jdGlvbihIVE1MSW1hZ2VFbGVtZW50KX1cbiAgICovXG4gIHByb3h5SW1hZ2UgOiBmdW5jdGlvbihvbmxvYWQsIG9uZXJyb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgIHZhciBfaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgX2ltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbmxvYWQpO1xuICAgICAgX2ltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG4gICAgICBfaW1hZ2Uuc3JjID0gaW1hZ2Uuc3JjO1xuXG4gICAgICByZXR1cm4gX2ltYWdlO1xuICAgIH07XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50W119IGltYWdlc1xuICAgKiBAcGFyYW0ge3tmYWlsZWQ6IGZ1bmN0aW9uLCBsb2FkZWQ6IGZ1bmN0aW9ufX0gc3RhdHVzXG4gICAqL1xuICB2ZXJpZnkgOiBmdW5jdGlvbihpbWFnZXMsIHN0YXR1cykge1xuICAgIHZhciBpbmNvbXBsZXRlID0gdGhpcy5pbmNvbXBsZXRlSW1hZ2VzKGltYWdlcyk7XG5cbiAgICBpZiAoaW1hZ2VzLmxlbmd0aCA+IGluY29tcGxldGUubGVuZ3RoKSB7XG4gICAgICBzdGF0dXMubG9hZGVkKGltYWdlcy5sZW5ndGggLSBpbmNvbXBsZXRlLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgaWYgKGluY29tcGxldGUubGVuZ3RoKSB7XG4gICAgICBpbmNvbXBsZXRlLmZvckVhY2godGhpcy5wcm94eUltYWdlKFxuICAgICAgICBmdW5jdGlvbigpe1xuICAgICAgICAgIHN0YXR1cy5sb2FkZWQoMSk7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgc3RhdHVzLmZhaWxlZCgxKTtcbiAgICAgICAgfVxuICAgICAgKSk7XG4gICAgfVxuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudHxFbGVtZW50fEVsZW1lbnRbXXxqUXVlcnl8Tm9kZUxpc3R9IG9iamVjdFxuICAgKiBAcmV0dXJucyB7RWxlbWVudFtdfVxuICAgKi9cbiAgdG9BcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmplY3QubGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwob2JqZWN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gW29iamVjdF07XG4gIH1cblxufTtcblxuXG4vKipcbiAqIEBwYXJhbSBqcXVlcnlcbiAqIEByZXR1cm5zIGRlZmVycmVkXG4gKi9cbmZ1bmN0aW9uIGRlZmVyKGpxdWVyeSkge1xuICB2YXIgZGVmZXJyZWQ7XG5cbiAgaWYgKGpxdWVyeSkge1xuICAgIGRlZmVycmVkID0gbmV3ICQuRGVmZXJyZWQoKTtcbiAgICBkZWZlcnJlZC5wcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZSgpO1xuICB9XG4gIGVsc2Uge1xuICAgIGRlZmVycmVkID0ge307XG4gICAgZGVmZXJyZWQucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIGRlZmVycmVkLnJlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBkZWZlcnJlZDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbWFnZUNvdW50XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBkb25lXG4gKiBAcmV0dXJucyB7e2ZhaWxlZDogZnVuY3Rpb24sIGxvYWRlZDogZnVuY3Rpb259fVxuICovXG5mdW5jdGlvbiBzdGF0dXMoaW1hZ2VDb3VudCwgZG9uZSkge1xuICB2YXIgbG9hZGVkID0gMCxcbiAgICAgIHRvdGFsID0gaW1hZ2VDb3VudCxcbiAgICAgIHZlcmlmaWVkID0gMDtcblxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgaWYgKHRvdGFsID09PSB2ZXJpZmllZCkge1xuICAgICAgZG9uZSh0b3RhbCA9PT0gbG9hZGVkKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gICAgICovXG4gICAgZmFpbGVkIDogZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIHZlcmlmaWVkICs9IGNvdW50O1xuICAgICAgdXBkYXRlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudFxuICAgICAqL1xuICAgIGxvYWRlZCA6IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICBsb2FkZWQgKz0gY291bnQ7XG4gICAgICB2ZXJpZmllZCArPSBjb3VudDtcbiAgICAgIHVwZGF0ZSgpO1xuICAgIH1cblxuICB9O1xufVxuXG5cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgalF1ZXJ5IHBsdWdpblxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmlmICh3aW5kb3cualF1ZXJ5KSB7XG4gICQuZm4uaW1hZ2VzUmVhZHkgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgSW1hZ2VzUmVhZHkodGhpcywgdHJ1ZSk7XG4gICAgcmV0dXJuIGluc3RhbmNlLnJlc3VsdDtcbiAgfTtcbn1cblxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBEZWZhdWx0IGVudHJ5IHBvaW50XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gaW1hZ2VzUmVhZHkoZWxlbWVudHMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgaW5zdGFuY2UgPSBuZXcgSW1hZ2VzUmVhZHkoZWxlbWVudHMpO1xuICByZXR1cm4gaW5zdGFuY2UucmVzdWx0O1xufVxuXG5yZXR1cm4gaW1hZ2VzUmVhZHk7XG59KSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9pbWFnZXNyZWFkeS9kaXN0L2ltYWdlc3JlYWR5LmpzXG4vLyBtb2R1bGUgaWQgPSA1M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiogU2VjdGlvbiBoaWdobGlnaHRlciBtb2R1bGVcbiogQG1vZHVsZSBtb2R1bGVzL3NlY3Rpb25IaWdobGlnaHRlclxuKiBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMyMzk1OTg4L2hpZ2hsaWdodC1tZW51LWl0ZW0td2hlbi1zY3JvbGxpbmctZG93bi10by1zZWN0aW9uXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyICRuYXZpZ2F0aW9uTGlua3MgPSAkKCcuanMtc2VjdGlvbi1zZXQgPiBsaSA+IGEnKTtcbiAgdmFyICRzZWN0aW9ucyA9ICQoXCJzZWN0aW9uXCIpO1xuICB2YXIgJHNlY3Rpb25zUmV2ZXJzZWQgPSAkKCQoXCJzZWN0aW9uXCIpLmdldCgpLnJldmVyc2UoKSk7XG4gIHZhciBzZWN0aW9uSWRUb25hdmlnYXRpb25MaW5rID0ge307XG4gIC8vdmFyIGVUb3AgPSAkKCcjZnJlZS1kYXktdHJpcHMnKS5vZmZzZXQoKS50b3A7XG5cbiAgJHNlY3Rpb25zLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgc2VjdGlvbklkVG9uYXZpZ2F0aW9uTGlua1skKHRoaXMpLmF0dHIoJ2lkJyldID0gJCgnLmpzLXNlY3Rpb24tc2V0ID4gbGkgPiBhW2hyZWY9XCIjJyArICQodGhpcykuYXR0cignaWQnKSArICdcIl0nKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gb3B0aW1pemVkKCkge1xuICAgIHZhciBzY3JvbGxQb3NpdGlvbiA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgICRzZWN0aW9uc1JldmVyc2VkLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY3VycmVudFNlY3Rpb24gPSAkKHRoaXMpO1xuICAgICAgdmFyIHNlY3Rpb25Ub3AgPSBjdXJyZW50U2VjdGlvbi5vZmZzZXQoKS50b3A7XG5cbiAgICAgIC8vIGlmKGN1cnJlbnRTZWN0aW9uLmlzKCdzZWN0aW9uOmZpcnN0LWNoaWxkJykgJiYgc2VjdGlvblRvcCA+IHNjcm9sbFBvc2l0aW9uKXtcbiAgICAgIC8vICAgY29uc29sZS5sb2coJ3Njcm9sbFBvc2l0aW9uJywgc2Nyb2xsUG9zaXRpb24pO1xuICAgICAgLy8gICBjb25zb2xlLmxvZygnc2VjdGlvblRvcCcsIHNlY3Rpb25Ub3ApO1xuICAgICAgLy8gfVxuXG4gICAgICBpZiAoc2Nyb2xsUG9zaXRpb24gPj0gc2VjdGlvblRvcCB8fCAoY3VycmVudFNlY3Rpb24uaXMoJ3NlY3Rpb246Zmlyc3QtY2hpbGQnKSAmJiBzZWN0aW9uVG9wID4gc2Nyb2xsUG9zaXRpb24pKSB7XG4gICAgICAgIHZhciBpZCA9IGN1cnJlbnRTZWN0aW9uLmF0dHIoJ2lkJyk7XG4gICAgICAgIHZhciAkbmF2aWdhdGlvbkxpbmsgPSBzZWN0aW9uSWRUb25hdmlnYXRpb25MaW5rW2lkXTtcbiAgICAgICAgaWYgKCEkbmF2aWdhdGlvbkxpbmsuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpIHx8ICEkKCdzZWN0aW9uJykuaGFzQ2xhc3MoJ28tY29udGVudC1jb250YWluZXItLWNvbXBhY3QnKSkge1xuICAgICAgICAgICAgJG5hdmlnYXRpb25MaW5rcy5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkbmF2aWdhdGlvbkxpbmsuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9wdGltaXplZCgpO1xuICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgIG9wdGltaXplZCgpO1xuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3NlY3Rpb25IaWdobGlnaHRlci5qcyIsIi8qKlxuICogU3RhdGljIGNvbHVtbiBtb2R1bGVcbiAqIFNpbWlsYXIgdG8gdGhlIGdlbmVyYWwgc3RpY2t5IG1vZHVsZSBidXQgdXNlZCBzcGVjaWZpY2FsbHkgd2hlbiBvbmUgY29sdW1uXG4gKiBvZiBhIHR3by1jb2x1bW4gbGF5b3V0IGlzIG1lYW50IHRvIGJlIHN0aWNreVxuICogQG1vZHVsZSBtb2R1bGVzL3N0YXRpY0NvbHVtblxuICogQHNlZSBtb2R1bGVzL3N0aWNreU5hdlxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IHN0aWNreUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtc3RhdGljJyk7XG4gIGNvbnN0IG5vdFN0aWNreUNsYXNzID0gJ2lzLW5vdC1zdGlja3knO1xuICBjb25zdCBib3R0b21DbGFzcyA9ICdpcy1ib3R0b20nO1xuXG4gIC8qKlxuICAqIENhbGN1bGF0ZXMgdGhlIHdpbmRvdyBwb3NpdGlvbiBhbmQgc2V0cyB0aGUgYXBwcm9wcmlhdGUgY2xhc3Mgb24gdGhlIGVsZW1lbnRcbiAgKiBAcGFyYW0ge29iamVjdH0gc3RpY2t5Q29udGVudEVsZW0gLSBET00gbm9kZSB0aGF0IHNob3VsZCBiZSBzdGlja2llZFxuICAqL1xuICBmdW5jdGlvbiBjYWxjV2luZG93UG9zKHN0aWNreUNvbnRlbnRFbGVtKSB7XG4gICAgbGV0IGVsZW1Ub3AgPSBzdGlja3lDb250ZW50RWxlbS5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgICBsZXQgaXNQYXN0Qm90dG9tID0gd2luZG93LmlubmVySGVpZ2h0IC0gc3RpY2t5Q29udGVudEVsZW0ucGFyZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLSBzdGlja3lDb250ZW50RWxlbS5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCA+IDA7XG5cbiAgICAvLyBTZXRzIGVsZW1lbnQgdG8gcG9zaXRpb24gYWJzb2x1dGUgaWYgbm90IHNjcm9sbGVkIHRvIHlldC5cbiAgICAvLyBBYnNvbHV0ZWx5IHBvc2l0aW9uaW5nIG9ubHkgd2hlbiBuZWNlc3NhcnkgYW5kIG5vdCBieSBkZWZhdWx0IHByZXZlbnRzIGZsaWNrZXJpbmdcbiAgICAvLyB3aGVuIHJlbW92aW5nIHRoZSBcImlzLWJvdHRvbVwiIGNsYXNzIG9uIENocm9tZVxuICAgIGlmIChlbGVtVG9wID4gMCkge1xuICAgICAgc3RpY2t5Q29udGVudEVsZW0uY2xhc3NMaXN0LmFkZChub3RTdGlja3lDbGFzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0aWNreUNvbnRlbnRFbGVtLmNsYXNzTGlzdC5yZW1vdmUobm90U3RpY2t5Q2xhc3MpO1xuICAgIH1cbiAgICBpZiAoaXNQYXN0Qm90dG9tKSB7XG4gICAgICBzdGlja3lDb250ZW50RWxlbS5jbGFzc0xpc3QuYWRkKGJvdHRvbUNsYXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RpY2t5Q29udGVudEVsZW0uY2xhc3NMaXN0LnJlbW92ZShib3R0b21DbGFzcyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0aWNreUNvbnRlbnQpIHtcbiAgICBmb3JFYWNoKHN0aWNreUNvbnRlbnQsIGZ1bmN0aW9uKHN0aWNreUNvbnRlbnRFbGVtKSB7XG4gICAgICBjYWxjV2luZG93UG9zKHN0aWNreUNvbnRlbnRFbGVtKTtcblxuICAgICAgLyoqXG4gICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgJ3Njcm9sbCcuXG4gICAgICAqIEBmdW5jdGlvblxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAqL1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjYWxjV2luZG93UG9zKHN0aWNreUNvbnRlbnRFbGVtKTtcbiAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgLyoqXG4gICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgJ3Jlc2l6ZScuXG4gICAgICAqIEBmdW5jdGlvblxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAqL1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjYWxjV2luZG93UG9zKHN0aWNreUNvbnRlbnRFbGVtKTtcbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc3RhdGljQ29sdW1uLmpzIiwiLyoqXG4gKiBBbGVydCBCYW5uZXIgbW9kdWxlXG4gKiBAbW9kdWxlIG1vZHVsZXMvYWxlcnRcbiAqIEBzZWUgbW9kdWxlcy90b2dnbGVPcGVuXG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuaW1wb3J0IHJlYWRDb29raWUgZnJvbSAnLi9yZWFkQ29va2llLmpzJztcbmltcG9ydCBkYXRhc2V0IGZyb20gJy4vZGF0YXNldC5qcyc7XG5pbXBvcnQgY3JlYXRlQ29va2llIGZyb20gJy4vY3JlYXRlQ29va2llLmpzJztcbmltcG9ydCBnZXREb21haW4gZnJvbSAnLi9nZXREb21haW4uanMnO1xuXG4vKipcbiAqIERpc3BsYXlzIGFuIGFsZXJ0IGJhbm5lci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcGVuQ2xhc3MgLSBUaGUgY2xhc3MgdG8gdG9nZ2xlIG9uIGlmIGJhbm5lciBpcyB2aXNpYmxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wZW5DbGFzcykge1xuICBpZiAoIW9wZW5DbGFzcykge1xuICAgIG9wZW5DbGFzcyA9ICdpcy1vcGVuJztcbiAgfVxuXG4gIC8qKlxuICAqIE1ha2UgYW4gYWxlcnQgdmlzaWJsZVxuICAqIEBwYXJhbSB7b2JqZWN0fSBhbGVydCAtIERPTSBub2RlIG9mIHRoZSBhbGVydCB0byBkaXNwbGF5XG4gICogQHBhcmFtIHtvYmplY3R9IHNpYmxpbmdFbGVtIC0gRE9NIG5vZGUgb2YgYWxlcnQncyBjbG9zZXN0IHNpYmxpbmcsXG4gICogd2hpY2ggZ2V0cyBzb21lIGV4dHJhIHBhZGRpbmcgdG8gbWFrZSByb29tIGZvciB0aGUgYWxlcnRcbiAgKi9cbiAgZnVuY3Rpb24gZGlzcGxheUFsZXJ0KGFsZXJ0LCBzaWJsaW5nRWxlbSkge1xuICAgIGFsZXJ0LmNsYXNzTGlzdC5hZGQob3BlbkNsYXNzKTtcbiAgICBjb25zdCBhbGVydEhlaWdodCA9IGFsZXJ0Lm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBjdXJyZW50UGFkZGluZyA9IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHNpYmxpbmdFbGVtKS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWJvdHRvbScpLCAxMCk7XG4gICAgc2libGluZ0VsZW0uc3R5bGUucGFkZGluZ0JvdHRvbSA9IChhbGVydEhlaWdodCArIGN1cnJlbnRQYWRkaW5nKSArICdweCc7XG4gIH1cblxuICAvKipcbiAgKiBSZW1vdmUgZXh0cmEgcGFkZGluZyBmcm9tIGFsZXJ0IHNpYmxpbmdcbiAgKiBAcGFyYW0ge29iamVjdH0gc2libGluZ0VsZW0gLSBET00gbm9kZSBvZiBhbGVydCBzaWJsaW5nXG4gICovXG4gIGZ1bmN0aW9uIHJlbW92ZUFsZXJ0UGFkZGluZyhzaWJsaW5nRWxlbSkge1xuICAgIHNpYmxpbmdFbGVtLnN0eWxlLnBhZGRpbmdCb3R0b20gPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICogQ2hlY2sgYWxlcnQgY29va2llXG4gICogQHBhcmFtIHtvYmplY3R9IGFsZXJ0IC0gRE9NIG5vZGUgb2YgdGhlIGFsZXJ0XG4gICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIGFsZXJ0IGNvb2tpZSBpcyBzZXRcbiAgKi9cbiAgZnVuY3Rpb24gY2hlY2tBbGVydENvb2tpZShhbGVydCkge1xuICAgIGNvbnN0IGNvb2tpZU5hbWUgPSBkYXRhc2V0KGFsZXJ0LCAnY29va2llJyk7XG4gICAgaWYgKCFjb29raWVOYW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0eXBlb2YgcmVhZENvb2tpZShjb29raWVOYW1lLCBkb2N1bWVudC5jb29raWUpICE9PSAndW5kZWZpbmVkJztcbiAgfVxuXG4gIC8qKlxuICAqIEFkZCBhbGVydCBjb29raWVcbiAgKiBAcGFyYW0ge29iamVjdH0gYWxlcnQgLSBET00gbm9kZSBvZiB0aGUgYWxlcnRcbiAgKi9cbiAgZnVuY3Rpb24gYWRkQWxlcnRDb29raWUoYWxlcnQpIHtcbiAgICBjb25zdCBjb29raWVOYW1lID0gZGF0YXNldChhbGVydCwgJ2Nvb2tpZScpO1xuICAgIGlmIChjb29raWVOYW1lKSB7XG4gICAgICBjcmVhdGVDb29raWUoY29va2llTmFtZSwgJ2Rpc21pc3NlZCcsIGdldERvbWFpbih3aW5kb3cubG9jYXRpb24sIGZhbHNlKSwgMzYwKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBhbGVydHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtYWxlcnQnKTtcbiAgaWYgKGFsZXJ0cy5sZW5ndGgpIHtcbiAgICBmb3JFYWNoKGFsZXJ0cywgZnVuY3Rpb24oYWxlcnQpIHtcbiAgICAgIGlmICghY2hlY2tBbGVydENvb2tpZShhbGVydCkpIHtcbiAgICAgICAgY29uc3QgYWxlcnRTaWJsaW5nID0gYWxlcnQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgZGlzcGxheUFsZXJ0KGFsZXJ0LCBhbGVydFNpYmxpbmcpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgJ2NoYW5nZU9wZW5TdGF0ZScuXG4gICAgICAgICogVGhlIHZhbHVlIG9mIGV2ZW50LmRldGFpbCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgb3BlbiBzdGF0ZSBpcyB0cnVlXG4gICAgICAgICogKGkuZS4gdGhlIGFsZXJ0IGlzIHZpc2libGUpLlxuICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICAgKi9cbiAgICAgICAgYWxlcnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlT3BlblN0YXRlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAvLyBCZWNhdXNlIGlPUyBzYWZhcmkgaW5leHBsaWNhYmx5IHR1cm5zIGV2ZW50LmRldGFpbCBpbnRvIGFuIG9iamVjdFxuICAgICAgICAgIGlmICgodHlwZW9mIGV2ZW50LmRldGFpbCA9PT0gJ2Jvb2xlYW4nICYmICFldmVudC5kZXRhaWwpIHx8XG4gICAgICAgICAgICAodHlwZW9mIGV2ZW50LmRldGFpbCA9PT0gJ29iamVjdCcgJiYgIWV2ZW50LmRldGFpbC5kZXRhaWwpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBhZGRBbGVydENvb2tpZShhbGVydCk7XG4gICAgICAgICAgICByZW1vdmVBbGVydFBhZGRpbmcoYWxlcnRTaWJsaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9hbGVydC5qcyIsIi8qKlxuKiBSZWFkcyBhIGNvb2tpZSBhbmQgcmV0dXJucyB0aGUgdmFsdWVcbiogQHBhcmFtIHtzdHJpbmd9IGNvb2tpZU5hbWUgLSBOYW1lIG9mIHRoZSBjb29raWVcbiogQHBhcmFtIHtzdHJpbmd9IGNvb2tpZSAtIEZ1bGwgbGlzdCBvZiBjb29raWVzXG4qIEByZXR1cm4ge3N0cmluZ30gLSBWYWx1ZSBvZiBjb29raWU7IHVuZGVmaW5lZCBpZiBjb29raWUgZG9lcyBub3QgZXhpc3RcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb29raWVOYW1lLCBjb29raWUpIHtcbiAgcmV0dXJuIChSZWdFeHAoXCIoPzpefDsgKVwiICsgY29va2llTmFtZSArIFwiPShbXjtdKilcIikuZXhlYyhjb29raWUpIHx8IFtdKS5wb3AoKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3JlYWRDb29raWUuanMiLCIvKipcbiogU2F2ZSBhIGNvb2tpZVxuKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIENvb2tpZSBuYW1lXG4qIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIENvb2tpZSB2YWx1ZVxuKiBAcGFyYW0ge3N0cmluZ30gZG9tYWluIC0gRG9tYWluIG9uIHdoaWNoIHRvIHNldCBjb29raWVcbiogQHBhcmFtIHtpbnRlZ2VyfSBkYXlzIC0gTnVtYmVyIG9mIGRheXMgYmVmb3JlIGNvb2tpZSBleHBpcmVzXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUsIGRvbWFpbiwgZGF5cykge1xuICBjb25zdCBleHBpcmVzID0gZGF5cyA/IFwiOyBleHBpcmVzPVwiICsgKG5ldyBEYXRlKGRheXMgKiA4NjRFNSArIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkpKS50b0dNVFN0cmluZygpIDogXCJcIjtcbiAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgdmFsdWUgKyBleHBpcmVzICsgXCI7IHBhdGg9LzsgZG9tYWluPVwiICsgZG9tYWluO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvY3JlYXRlQ29va2llLmpzIiwiLyoqXG4qIEdldCB0aGUgZG9tYWluIGZyb20gYSBVUkxcbiogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkxcbiogQHBhcmFtIHtib29sZWFufSByb290IC0gV2hldGhlciB0byByZXR1cm4gdGhlIHJvb3QgZG9tYWluIHJhdGhlciB0aGFuIGEgc3ViZG9tYWluXG4qIEByZXR1cm4ge3N0cmluZ30gLSBUaGUgcGFyc2VkIGRvbWFpblxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHVybCwgcm9vdCkge1xuICBmdW5jdGlvbiBwYXJzZVVybCh1cmwpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgdGFyZ2V0LmhyZWYgPSB1cmw7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdXJsID09PSAnc3RyaW5nJykge1xuICAgIHVybCA9IHBhcnNlVXJsKHVybCk7XG4gIH1cbiAgbGV0IGRvbWFpbiA9IHVybC5ob3N0bmFtZTtcbiAgaWYgKHJvb3QpIHtcbiAgICBjb25zdCBzbGljZSA9IGRvbWFpbi5tYXRjaCgvXFwudWskLykgPyAtMyA6IC0yO1xuICAgIGRvbWFpbiA9IGRvbWFpbi5zcGxpdChcIi5cIikuc2xpY2Uoc2xpY2UpLmpvaW4oXCIuXCIpO1xuICB9XG4gIHJldHVybiBkb21haW47XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9nZXREb21haW4uanMiLCIvKipcbiogVmFsaWRhdGUgYSBmb3JtIGFuZCBzdWJtaXQgdmlhIHRoZSBzaWdudXAgQVBJXG4qL1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgemlwY29kZXMgZnJvbSAnLi9kYXRhL3ppcGNvZGVzLmpzb24nXG5pbXBvcnQgZm9ybUVycm9ycyBmcm9tICcuL2RhdGEvZm9ybS1lcnJvcnMuanNvbidcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIC8vIGNvbnN0ICRzaWdudXBGb3JtcyA9ICQoJy5ndW55LXNpZ251cCcpO1xuICBjb25zdCBlcnJvck1zZyA9ICdQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCBhbmQgemlwIGNvZGUgYW5kIHNlbGVjdCBhdCBsZWFzdCBvbmUgYWdlIGdyb3VwLic7XG5cbiAgLyoqXG4gICogVmFsaWRhdGUgZm9ybSBmaWVsZHNcbiAgKiBAcGFyYW0ge29iamVjdH0gZm9ybURhdGEgLSBmb3JtIGZpZWxkc1xuICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIGV2ZW50IG9iamVjdFxuICAqL1xuICBmdW5jdGlvbiB2YWxpZGF0ZUZpZWxkcyhmb3JtLCBldmVudCkge1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IGZpZWxkcyA9IGZvcm0uc2VyaWFsaXplQXJyYXkoKS5yZWR1Y2UoKG9iaiwgaXRlbSkgPT4gKG9ialtpdGVtLm5hbWVdID0gaXRlbS52YWx1ZSwgb2JqKSAse30pXG4gICAgY29uc3QgcmVxdWlyZWRGaWVsZHMgPSBmb3JtLmZpbmQoJ1tyZXF1aXJlZF0nKTtcbiAgICBjb25zdCBlbWFpbFJlZ2V4ID0gbmV3IFJlZ0V4cCgvXFxTK0BcXFMrXFwuXFxTKy8pO1xuICAgIGNvbnN0IHppcFJlZ2V4ID0gbmV3IFJlZ0V4cCgvXlxcZHs1fSgtXFxkezR9KT8kL2kpO1xuICAgIGNvbnN0IHBob25lUmVnZXggPSBuZXcgUmVnRXhwKC9eW1xcK10/WyhdP1swLTldezN9WyldP1stXFxzXFwuXT9bMC05XXszfVstXFxzXFwuXT9bMC05XXs0LDZ9JC9pbSk7XG4gICAgbGV0IGdyb3VwU2VsZXRlZCA9IE9iamVjdC5rZXlzKGZpZWxkcykuZmluZChhID0+YS5pbmNsdWRlcyhcImdyb3VwXCIpKT8gdHJ1ZSA6IGZhbHNlO1xuICAgIGxldCBoYXNFcnJvcnMgPSBmYWxzZTtcblxuICAgIC8vIGxvb3AgdGhyb3VnaCBlYWNoIHJlcXVpcmVkIGZpZWxkXG4gICAgcmVxdWlyZWRGaWVsZHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGZpZWxkTmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnaXMtZXJyb3InKTtcblxuICAgICAgaWYoKHR5cGVvZiBmaWVsZHNbZmllbGROYW1lXSA9PT0gJ3VuZGVmaW5lZCcpICYmICFncm91cFNlbGV0ZWQpIHtcbiAgICAgICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCdmaWVsZHNldCcpLmZpbmQoJy5ndW55LWVycm9yLWRldGFpbGVkJykuaHRtbCgnPHA+UGxlYXNlIHNlbGVjdCBmcm9tIHRoZSBsaXN0IGJlbG93LjwvcD4nKTs7XG5cbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtZXJyb3InKTtcbiAgICAgIH1cblxuICAgICAgaWYoKGZpZWxkTmFtZSA9PSAnRU1BSUwnICYmICFlbWFpbFJlZ2V4LnRlc3QoZmllbGRzLkVNQUlMKSkgfHxcbiAgICAgICAgKGZpZWxkTmFtZSA9PSAnWklQJyAmJiAhemlwUmVnZXgudGVzdChmaWVsZHMuWklQKSkgfHxcbiAgICAgICAgKGZpZWxkTmFtZSA9PSAnUEhPTkVOVU0nICYmICFwaG9uZVJlZ2V4LnRlc3QoZmllbGRzLlBIT05FTlVNKSAmJiBmaWVsZHMuUEhPTkVOVU0ubGVuZ3RoICE9MClcbiAgICAgICkge1xuICAgICAgICBoYXNFcnJvcnMgPSB0cnVlO1xuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuZ3VueS1lcnJvci1kZXRhaWxlZCcpLmh0bWwoJzxwPicgKyBmb3JtRXJyb3JzLmZpbmQoeCA9PiB4W2ZpZWxkTmFtZV0pW2ZpZWxkTmFtZV0gKyAnPC9wPicpO1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdpcy1lcnJvcicpO1xuICAgICAgfVxuXG4gICAgICAvLyBhc3NpZ24gdGhlIGNvcnJlY3QgYm9yb3VnaCB0byBnb29kIHppcFxuICAgICAgaWYoKGZpZWxkTmFtZSA9PSAnRU1BSUwnICYmIGVtYWlsUmVnZXgudGVzdChmaWVsZHMuRU1BSUwpKSl7XG4gICAgICAgIGZpZWxkcy5CT1JPVUdIID0gYXNzaWduQm9yb3VnaChmaWVsZHMuWklQKTtcbiAgICAgIH1cblxuICAgICAgaWYoKGZpZWxkTmFtZSAhPSAnRU1BSUwnKSAmJiAoZmllbGROYW1lICE9ICdaSVAnKSAmJiAoZmllbGROYW1lICE9ICdQSE9ORU5VTScpICYmIGZpZWxkc1tmaWVsZE5hbWVdID09PSBcIlwiXG4gICAgICApIHtcbiAgICAgICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmd1bnktZXJyb3ItZGV0YWlsZWQnKS5odG1sKCc8cD4nICsgZm9ybUVycm9ycy5maW5kKHggPT4geFtmaWVsZE5hbWVdKVtmaWVsZE5hbWVdICsgJzwvcD4nKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtZXJyb3InKTtcbiAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgLy8gaWYgdGhlcmUgYXJlIG5vIGVycm9ycywgc3VibWl0XG4gICAgaWYgKGhhc0Vycm9ycykge1xuICAgICAgZm9ybS5maW5kKCcuZ3VueS1lcnJvcicpLmh0bWwoYDxwPiR7ZXJyb3JNc2d9PC9wPmApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWJtaXRTaWdudXAoZm9ybSwgZmllbGRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBBc3NpZ25zIHRoZSBib3JvdWdoIGJhc2VkIG9uIHRoZSB6aXAgY29kZVxuICAqIEBwYXJhbSB7c3RyaW5nfSB6aXAgLSB6aXAgY29kZVxuICAqL1xuICBmdW5jdGlvbiBhc3NpZ25Cb3JvdWdoKHppcCl7XG4gICAgbGV0IGJvcm91Z2ggPSAnJztcbiAgICBsZXQgaW5kZXggPSB6aXBjb2Rlcy5maW5kSW5kZXgoeCA9PiB4LmNvZGVzLmluZGV4T2YocGFyc2VJbnQoemlwKSkgPiAtMSk7XG5cbiAgICBpZihpbmRleCA9PT0gLTEpe1xuICAgICAgYm9yb3VnaCA9IFwiTWFuaGF0dGFuXCI7XG4gICAgfWVsc2Uge1xuICAgICAgYm9yb3VnaCA9IHppcGNvZGVzW2luZGV4XS5ib3JvdWdoO1xuICAgIH1cblxuICAgIHJldHVybiBib3JvdWdoO1xuICB9XG5cbiAgLyoqXG4gICogU3VibWl0cyB0aGUgZm9ybSBvYmplY3QgdG8gTWFpbGNoaW1wXG4gICogQHBhcmFtIHtvYmplY3R9IGZvcm1EYXRhIC0gZm9ybSBmaWVsZHNcbiAgKi9cbiAgZnVuY3Rpb24gc3VibWl0U2lnbnVwKGZvcm0sIGZvcm1EYXRhKXtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiBmb3JtLmF0dHIoJ2FjdGlvbicpLFxuICAgICAgdHlwZTogZm9ybS5hdHRyKCdtZXRob2QnKSxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsLy9ubyBqc29ucFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5yZXN1bHQgIT09ICdzdWNjZXNzJyl7XG4gICAgICAgICAgaWYoZm9ybVswXS5jbGFzc05hbWUuaW5kZXhPZignY29udGFjdCcpID4gLTEpe1xuICAgICAgICAgICAgaWYocmVzcG9uc2UubXNnLmluY2x1ZGVzKCdhbHJlYWR5IHN1YnNjcmliZWQnKSl7XG4gICAgICAgICAgICAgIGZvcm0uaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPllvdSBoYXZlIGFscmVhZHkgcmVhY2hlZCBvdXQgdG8gdXMuIFdlIHdpbGwgZ2V0IGJhY2sgdG8geW91IGFzIHNvb24gYXMgcG9zc2libGUhPC9wPicpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICBmb3JtLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1jZW50ZXJcIj5Tb21ldGhpbmcgd2VudCB3cm9uZy4gVHJ5IGFnYWluIGxhdGVyITwvcD4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBpZihyZXNwb25zZS5tc2cuaW5jbHVkZXMoJ3RvbyBtYW55IHJlY2VudCBzaWdudXAgcmVxdWVzdHMnKSl7XG4gICAgICAgICAgICAgIGZvcm0uZmluZCgnLmd1bnktZXJyb3InKS5odG1sKCc8cCBjbGFzcz1cInRleHQtY2VudGVyXCI+VGhlcmUgd2FzIGEgcHJvYmxlbSB3aXRoIHlvdXIgc3Vic2NyaXB0aW9uLjwvcD4nKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlLm1zZy5pbmNsdWRlcygnYWxyZWFkeSBzdWJzY3JpYmVkJykpe1xuICAgICAgICAgICAgICBmb3JtLmZpbmQoJy5ndW55LWVycm9yJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPllvdSBhcmUgYWxyZWFkeSBzaWduZWQgdXAgZm9yIHVwZGF0ZXMhIENoZWNrIHlvdXIgZW1haWwuPC9wPicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgIGlmKGZvcm1bMF0uY2xhc3NOYW1lLmluZGV4T2YoJ2NvbnRhY3QnKSA+IC0xKXtcbiAgICAgICAgICAgIGlmKGZvcm1bMF0uY2xhc3NOYW1lLmluZGV4T2YoJ3VuaXR5JykgPiAtMSl7XG4gICAgICAgICAgICAgIGZvcm0uaHRtbCgnPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+PHAgY2xhc3M9XCJ1LWJvdHRvbS1zcGFjaW5nLXNtYWxsXCI+VGhhbmsgeW91IGZvciBjb250YWN0aW5nIHRoZSBOWUMgVW5pdHkgUHJvamVjdCEgU29tZW9uZSB3aWxsIHJlc3BvbmQgdG8geW91IHNob3J0bHkuPC9wPjxhIGNsYXNzPVwiYnV0dG9uLS1wcmltYXJ5IGJ1dHRvbi0tcHJpbWFyeV9fY3VydmVkIGJ1dHRvbi0tcHJpbWFyeV9fcHVycGxlXCIgaHJlZj1cImh0dHBzOi8vZ3Jvd2luZ3VwbnljLmNpdHlvZm5ld3lvcmsudXMvZ2VuZXJhdGlvbm55Yy90b3BpY3MvbGdidHFcIj5HbyBiYWNrIHRvIHRoZSBVbml0eSBQcm9qZWN0PC9hPjwvZGl2PicpO1xuICAgICAgICAgICAgfWVsc2UgaWYoZm9ybVswXS5jbGFzc05hbWUuaW5kZXhPZignZ2VuZXJhdGlvbicpID4gLTEpe1xuICAgICAgICAgICAgICBmb3JtLmh0bWwoJzxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPjxwIGNsYXNzPVwidS1ib3R0b20tc3BhY2luZy1zbWFsbFwiPlRoYW5rIHlvdSBmb3IgY29udGFjdGluZyB1cyEgU29tZW9uZSB3aWxsIHJlc3BvbmQgdG8geW91IHNob3J0bHkuPC9wPjxhIGNsYXNzPVwiYnV0dG9uLS1wcmltYXJ5IGJ1dHRvbi0tcHJpbWFyeV9fY3VydmVkIGJ1dHRvbi0tcHJpbWFyeV9fcHVycGxlXCIgaHJlZj1cImh0dHBzOi8vZ3Jvd2luZ3VwbnljLmNpdHlvZm5ld3lvcmsudXMvZ2VuZXJhdGlvbm55Yy9cIj5Db250aW51ZSBleHBsb3JpbmcgR2VuZXJhdGlvbiBOWUM8L2E+PC9kaXY+Jyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgZm9ybS5odG1sKCc8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj48cCBjbGFzcz1cInUtYm90dG9tLXNwYWNpbmctc21hbGxcIj5UaGFuayB5b3UgZm9yIGNvbnRhY3RpbmcgdXMhIFNvbWVvbmUgd2lsbCByZXNwb25kIHRvIHlvdSBzaG9ydGx5LjwvcD48YSBjbGFzcz1cImJ1dHRvbi0tc2ltcGxlIGJ1dHRvbi0tc2ltcGxlLS1hbHRcIiBocmVmPVwiaHR0cHM6Ly9ncm93aW5ndXBueWMuY2l0eW9mbmV3eW9yay51cy9cIj5Db250aW51ZSBleHBsb3JpbmcgR3Jvd2luZyBVcCBOWUM8L2E+PC9kaXY+Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBmb3JtLmh0bWwoJzxwIGNsYXNzPVwiYy1zaWdudXAtZm9ybV9fc3VjY2Vzc1wiPk9uZSBtb3JlIHN0ZXAhIDxiciAvPiBQbGVhc2UgY2hlY2sgeW91ciBpbmJveCBhbmQgY29uZmlybSB5b3VyIGVtYWlsIGFkZHJlc3MgdG8gc3RhcnQgcmVjZWl2aW5nIHVwZGF0ZXMuIDxiciAvPlRoYW5rcyBmb3Igc2lnbmluZyB1cCE8L3A+Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGZvcm0uZmluZCgnLmd1bnktZXJyb3InKS5odG1sKCc8cD5UaGVyZSB3YXMgYSBwcm9ibGVtIHdpdGggeW91ciBzdWJzY3JpcHRpb24uIENoZWNrIGJhY2sgbGF0ZXIuPC9wPicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICogVHJpZ2dlcnMgZm9ybSB2YWxpZGF0aW9uIGFuZCBzZW5kcyB0aGUgZm9ybSBkYXRhIHRvIE1haWxjaGltcFxuICAqIEBwYXJhbSB7b2JqZWN0fSBmb3JtRGF0YSAtIGZvcm0gZmllbGRzXG4gICogVE8gRURJVFxuICAqL1xuICAkKCcjbWMtZW1iZWRkZWQtc3Vic2NyaWJlOmJ1dHRvblt0eXBlPVwic3VibWl0XCJdJykuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IGZvcm1DbGFzcyA9ICQodGhpcykucGFyZW50cygnZm9ybScpLmF0dHIoJ2NsYXNzJyk7XG4gICAgbGV0ICRmb3JtID0gJCgnLicgKyBmb3JtQ2xhc3MpO1xuICAgIHZhbGlkYXRlRmllbGRzKCRmb3JtLCBldmVudCk7XG4gIH0pO1xuXG4gICQoJyNtYy1lbWJlZGRlZC1jb250YWN0OmJ1dHRvblt0eXBlPVwic3VibWl0XCJdJykuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IGZvcm1DbGFzcyA9ICQodGhpcykucGFyZW50cygnZm9ybScpLmF0dHIoJ2NsYXNzJyk7XG4gICAgbGV0ICRmb3JtID0gJCgnLicgKyBmb3JtQ2xhc3MpO1xuICAgIHZhbGlkYXRlRmllbGRzKCRmb3JtLCBldmVudCk7XG4gIH0pO1xuXG4gIC8qKlxuICAqIENoZWNraW5nIGNoYXJhY3RlcnMgYWdhaW5zdCB0aGUgMjU1IGNoYXIgbGltaXRcbiAgKi9cbiAgJCgnLnRleHRhcmVhJykua2V5dXAoZnVuY3Rpb24oKXtcbiAgICBsZXQgY2hhckxlbiA9IDI1NSAtICQodGhpcykudmFsKCkubGVuZ3RoO1xuICAgICQoJy5jaGFyLWNvdW50JykudGV4dCgnQ2hhcmFjdGVycyBsZWZ0OiAnICsgY2hhckxlbik7XG4gICAgaWYoY2hhckxlbiA8IDApe1xuICAgICAgJCgnLmNoYXItY291bnQnKS5jc3MoXCJjb2xvclwiLCAnI2Q4MDA2ZCcpO1xuICAgICAgJCh0aGlzKS5jc3MoXCJib3JkZXItY29sb3JcIiwgJyNkODAwNmQnKTtcbiAgICAgIC8vICQoJy5jaGFyLWNvdW50JykuYWRkQ2xhc3MoJy5pcy1lcnJvcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcuY2hhci1jb3VudCcpLmNzcyhcImNvbG9yXCIsICcjMzMzJyk7XG4gICAgICAkKHRoaXMpLmNzcyhcImJvcmRlci1jb2xvclwiLCAnIzI3OTNlMCcpO1xuICAgIH1cbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9uZXdzbGV0dGVyLXNpZ251cC5qcyIsIm1vZHVsZS5leHBvcnRzID0gW3tcImJvcm91Z2hcIjpcIkJyb254XCIsXCJjb2Rlc1wiOlsxMDQ1MSwxMDQ1MiwxMDQ1MywxMDQ1NCwxMDQ1NSwxMDQ1NiwxMDQ1NywxMDQ1OCwxMDQ1OSwxMDQ2MCwxMDQ2MSwxMDQ2MiwxMDQ2MywxMDQ2NCwxMDQ2NSwxMDQ2NiwxMDQ2NywxMDQ2OCwxMDQ2OSwxMDQ3MCwxMDQ3MSwxMDQ3MiwxMDQ3MywxMDQ3NCwxMDQ3NV19LHtcImJvcm91Z2hcIjpcIkJyb29rbHluXCIsXCJjb2Rlc1wiOlsxMTIwMSwxMTIwMiwxMTIwMywxMTIwNCwxMTIwNSwxMTIwNiwxMTIwNywxMTIwOCwxMTIwOSwxMTIxMCwxMTIxMSwxMTIxMiwxMTIxMywxMTIxNCwxMTIxNSwxMTIxNiwxMTIxNywxMTIxOCwxMTIxOSwxMTIyMCwxMTIyMSwxMTIyMiwxMTIyMywxMTIyNCwxMTIyNSwxMTIyNiwxMTIyOCwxMTIyOSwxMTIzMCwxMTIzMSwxMTIzMiwxMTIzMywxMTIzNCwxMTIzNSwxMTIzNiwxMTIzNywxMTIzOCwxMTIzOSwxMTI0MSwxMTI0MiwxMTI0MywxMTI0NSwxMTI0NywxMTI0OSwxMTI1MSwxMTI1MiwxMTI1Nl19LHtcImJvcm91Z2hcIjpcIk1hbmhhdHRhblwiLFwiY29kZXNcIjpbMTAwMDEsMTAwMDIsMTAwMDMsMTAwMDQsMTAwMDUsMTAwMDYsMTAwMDcsMTAwMDgsMTAwMDksMTAwMTAsMTAwMTEsMTAwMTIsMTAwMTMsMTAwMTQsMTAwMTYsMTAwMTcsMTAwMTgsMTAwMTksMTAwMjAsMTAwMjEsMTAwMjIsMTAwMjMsMTAwMjQsMTAwMjUsMTAwMjcsMTAwMjgsMTAwMjksMTAwMzAsMTAwMzEsMTAwMzIsMTAwMzMsMTAwMzQsMTAwMzUsMTAwMzYsMTAwMzcsMTAwMzgsMTAwMzksMTAwNDAsMTAwNDEsMTAwNDUsMTAwNTUsMTAwODEsMTAwODcsMTAxMDEsMTAxMDMsMTAxMDQsMTAxMDUsMTAxMDYsMTAxMDcsMTAxMDgsMTAxMDksMTAxMTAsMTAxMTEsMTAxMTIsMTAxMTMsMTAxMTQsMTAxMTUsMTAxMTYsMTAxMTgsMTAxMTksMTAxMjAsMTAxMjEsMTAxMjIsMTAxMjMsMTAxMjgsMTAxNTAsMTAxNTEsMTAxNTIsMTAxNTMsMTAxNTQsMTAxNTUsMTAxNTYsMTAxNTgsMTAxNTksMTAxNjIsMTAxNjUsMTAxNjYsMTAxNjcsMTAxNjgsMTAxNjksMTAxNzAsMTAxNzEsMTAxNzIsMTAxNzMsMTAxNzQsMTAxNzUsMTAxNzYsMTAxNzcsMTAxNzgsMTAxODUsMTAxOTksMTAyMTIsMTAyNDksMTAyNTYsMTAyNTksMTAyNjEsMTAyNjgsMTAyNzAsMTAyNzEsMTAyNzYsMTAyNzgsMTAyNzksMTAyODAsMTAyODEsMTAyODIsMTAyODZdfSx7XCJib3JvdWdoXCI6XCJRdWVlbnNcIixcImNvZGVzXCI6WzExMTAxLDExMTAyLDExMTAzLDExMTA0LDExMTA2LDExMTA5LDExMTIwLDExMzUxLDExMzUyLDExMzU0LDExMzU1LDExMzU2LDExMzU3LDExMzU4LDExMzU5LDExMzYwLDExMzYxLDExMzYyLDExMzYzLDExMzY0LDExMzY1LDExMzY2LDExMzY3LDExMzY4LDExMzY5LDExMzcwLDExMzcxLDExMzcyLDExMzczLDExMzc0LDExMzc1LDExMzc3LDExMzc4LDExMzc5LDExMzgwLDExMzgxLDExMzg1LDExMzg2LDExNDA1LDExNDExLDExNDEzLDExNDE0LDExNDE1LDExNDE2LDExNDE3LDExNDE4LDExNDE5LDExNDIwLDExNDIxLDExNDIyLDExNDIzLDExNDI0LDExNDI1LDExNDI2LDExNDI3LDExNDI4LDExNDI5LDExNDMwLDExNDMxLDExNDMyLDExNDMzLDExNDM0LDExNDM1LDExNDM2LDExNDM5LDExNDUxLDExNjkwLDExNjkxLDExNjkyLDExNjkzLDExNjk0LDExNjk1LDExNjk3XX0se1wiYm9yb3VnaFwiOlwiU3RhdGVuIElzbGFuZFwiLFwiY29kZXNcIjpbMTAzMDEsMTAzMDIsMTAzMDMsMTAzMDQsMTAzMDUsMTAzMDYsMTAzMDcsMTAzMDgsMTAzMDksMTAzMTAsMTAzMTEsMTAzMTIsMTAzMTMsMTAzMTRdfV1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2RhdGEvemlwY29kZXMuanNvblxuLy8gbW9kdWxlIGlkID0gNjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBbe1wiRU1BSUxcIjpcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsLlwifSx7XCJGTkFNRVwiOlwiUGxlYXNlIGVudGVyIHlvdXIgZmlyc3QgbmFtZS5cIn0se1wiTE5BTUVcIjpcIlBsZWFzZSBlbnRlciB5b3VyIGxhc3QgbmFtZS5cIn0se1wiWklQXCI6XCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBVUyB6aXAgY29kZS5cIn0se1wiUEhPTkVOVU1cIjpcIlBsZWFzZSBlbnRlciBhIHZhbGlkIHBob25lIG51bWJlci5cIn0se1wiTUVTU0FHRVwiOlwiUGxlYXNlIGVudGVyIGEgbWVzc2FnZS4gTGltaXRlZCB0byAyNTUgY2hhcmFjdGVycy5cIn0se1wiR1JPVVBcIjpcIlBsZWFzZSBzZWxlY3Qgb25lLlwifV1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2RhdGEvZm9ybS1lcnJvcnMuanNvblxuLy8gbW9kdWxlIGlkID0gNjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4qIEZvcm0gRWZmZWN0cyBtb2R1bGVcbiogQG1vZHVsZSBtb2R1bGVzL2Zvcm1FZmZlY3RzXG4qIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2NvZHJvcHMvVGV4dElucHV0RWZmZWN0cy9ibG9iL21hc3Rlci9pbmRleDIuaHRtbFxuKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuaW1wb3J0IGRpc3BhdGNoRXZlbnQgZnJvbSAnLi9kaXNwYXRjaEV2ZW50LmpzJztcblxuLyoqXG4qIFV0aWxpdHkgZnVuY3Rpb24gdG8gc2V0IGFuICdpcy1maWxsZWQnIGNsYXNzIG9uIGlucHV0cyB0aGF0IGFyZSBmb2N1c2VkIG9yXG4qIGNvbnRhaW4gdGV4dC4gQ2FuIHRoZW4gYmUgdXNlZCB0byBhZGQgZWZmZWN0cyB0byB0aGUgZm9ybSwgc3VjaCBhcyBtb3ZpbmdcbiogdGhlIGxhYmVsLlxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICAvKipcbiAgKiBBZGQgdGhlIGZpbGxlZCBjbGFzcyB3aGVuIGlucHV0IGlzIGZvY3VzZWRcbiAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICovXG4gIGZ1bmN0aW9uIGhhbmRsZUZvY3VzKGV2ZW50KSB7XG4gICAgY29uc3Qgd3JhcHBlckVsZW0gPSBldmVudC50YXJnZXQucGFyZW50Tm9kZTtcbiAgICB3cmFwcGVyRWxlbS5jbGFzc0xpc3QuYWRkKCdpcy1maWxsZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJlbW92ZSB0aGUgZmlsbGVkIGNsYXNzIHdoZW4gaW5wdXQgaXMgYmx1cnJlZCBpZiBpdCBkb2VzIG5vdCBjb250YWluIHRleHRcbiAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICovXG4gIGZ1bmN0aW9uIGhhbmRsZUJsdXIoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LnZhbHVlLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgIGNvbnN0IHdyYXBwZXJFbGVtID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICB3cmFwcGVyRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1maWxsZWQnKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2lnbnVwLWZvcm1fX2ZpZWxkJyk7XG4gIGlmIChpbnB1dHMubGVuZ3RoKSB7XG4gICAgZm9yRWFjaChpbnB1dHMsIGZ1bmN0aW9uKGlucHV0RWxlbSkge1xuICAgICAgaW5wdXRFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgaGFuZGxlRm9jdXMpO1xuICAgICAgaW5wdXRFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBoYW5kbGVCbHVyKTtcbiAgICAgIGRpc3BhdGNoRXZlbnQoaW5wdXRFbGVtLCAnYmx1cicpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9mb3JtRWZmZWN0cy5qcyIsIi8qKlxuKiBDcm9zcy1icm93c2VyIHV0aWxpdHkgdG8gZmlyZSBldmVudHNcbiogQHBhcmFtIHtvYmplY3R9IGVsZW0gLSBET00gZWxlbWVudCB0byBmaXJlIGV2ZW50IG9uXG4qIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBFdmVudCB0eXBlLCBpLmUuICdyZXNpemUnLCAnY2xpY2snXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZWxlbSwgZXZlbnRUeXBlKSB7XG4gIGxldCBldmVudDtcbiAgaWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50KSB7XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuICAgIGV2ZW50LmluaXRFdmVudChldmVudFR5cGUsIHRydWUsIHRydWUpO1xuICAgIGVsZW0uZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xuICAgIGVsZW0uZmlyZUV2ZW50KCdvbicgKyBldmVudFR5cGUsIGV2ZW50KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvZGlzcGF0Y2hFdmVudC5qcyIsIi8qKlxuKiBGYWNldFdQIEV2ZW50IEhhbmRsaW5nXG4qIFJlcXVpcmVzIGZyb250LmpzLCB3aGljaCBpcyBhZGRlZCBieSB0aGUgRmFjZXRXUCBwbHVnaW5cbiogQWxzbyByZXF1aXJlcyBqUXVlcnkgYXMgRmFjZXRXUCBpdHNlbGYgcmVxdWlyZXMgalF1ZXJ5XG4qL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgJChkb2N1bWVudCkub24oJ2ZhY2V0d3AtcmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnZmFjZXR3cC1pcy1sb2FkZWQnKS5hZGRDbGFzcygnZmFjZXR3cC1pcy1sb2FkaW5nJyk7XG4gICAgJCgnaHRtbCwgYm9keScpLnNjcm9sbFRvcCgwKTtcbiAgfSk7XG5cbiAgJChkb2N1bWVudCkub24oJ2ZhY2V0d3AtbG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdmYWNldHdwLWlzLWxvYWRpbmcnKS5hZGRDbGFzcygnZmFjZXR3cC1pcy1sb2FkZWQnKTtcbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9mYWNldHMuanMiLCIvKipcclxuKiBPd2wgU2V0dGluZ3MgbW9kdWxlXHJcbiogQG1vZHVsZSBtb2R1bGVzL293bFNldHRpbmdzXHJcbiogQHNlZSBodHRwczovL293bGNhcm91c2VsMi5naXRodWIuaW8vT3dsQ2Fyb3VzZWwyL2luZGV4Lmh0bWxcclxuKi9cclxuXHJcbi8qKlxyXG4qIG93bCBjYXJvdXNlbCBzZXR0aW5ncyBhbmQgdG8gbWFrZSB0aGUgb3dsIGNhcm91c2VsIHdvcmsuXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBvd2wgPSAkKCcub3dsLWNhcm91c2VsJyk7XHJcbiAgb3dsLm93bENhcm91c2VsKHtcclxuICAgIGFuaW1hdGVJbjogJ2ZhZGVJbicsXHJcbiAgICBhbmltYXRlT3V0OiAnZmFkZU91dCcsXHJcbiAgICBpdGVtczoxLFxyXG4gICAgbG9vcDp0cnVlLFxyXG4gICAgbWFyZ2luOjAsXHJcbiAgICBkb3RzOiB0cnVlLFxyXG4gICAgYXV0b3BsYXk6dHJ1ZSxcclxuICAgIGF1dG9wbGF5VGltZW91dDo1MDAwLFxyXG4gICAgYXV0b3BsYXlIb3ZlclBhdXNlOnRydWVcclxuICB9KTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL293bFNldHRpbmdzLmpzIiwiLyoqXG4qIGlPUzcgaVBhZCBIYWNrXG4qIGZvciBoZXJvIGltYWdlIGZsaWNrZXJpbmcgaXNzdWUuXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQYWQ7LipDUFUuKk9TIDdfXFxkL2kpKSB7XG4gICAgJCgnLmMtc2lkZS1oZXJvJykuaGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9pT1M3SGFjay5qcyIsIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IENvb2tpZXMgZnJvbSAnanMtY29va2llJztcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4uL3ZlbmRvci91dGlsaXR5LmpzJztcbmltcG9ydCBDbGVhdmUgZnJvbSAnY2xlYXZlLmpzL2Rpc3QvY2xlYXZlLm1pbic7XG5pbXBvcnQgJ2NsZWF2ZS5qcy9kaXN0L2FkZG9ucy9jbGVhdmUtcGhvbmUudXMnO1xuXG4vKiBlc2xpbnQgbm8tdW5kZWY6IFwib2ZmXCIgKi9cbmNvbnN0IFZhcmlhYmxlcyA9IHJlcXVpcmUoJy4uLy4uL3ZhcmlhYmxlcy5qc29uJyk7XG5cbi8qKlxuICogVGhpcyBjb21wb25lbnQgaGFuZGxlcyB2YWxpZGF0aW9uIGFuZCBzdWJtaXNzaW9uIGZvciBzaGFyZSBieSBlbWFpbCBhbmRcbiAqIHNoYXJlIGJ5IFNNUyBmb3Jtcy5cbi8qKlxuKiBBZGRzIGZ1bmN0aW9uYWxpdHkgdG8gdGhlIGlucHV0IGluIHRoZSBzZWFyY2ggcmVzdWx0cyBoZWFkZXJcbiovXG5cbmNsYXNzIFNoYXJlRm9ybSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBodG1sIGZvcm0gZWxlbWVudCBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbCkge1xuICAgIC8qKiBAcHJpdmF0ZSB7SFRNTEVsZW1lbnR9IFRoZSBjb21wb25lbnQgZWxlbWVudC4gKi9cbiAgICB0aGlzLl9lbCA9IGVsO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoaXMgZm9ybSBpcyB2YWxpZC4gKi9cbiAgICB0aGlzLl9pc1ZhbGlkID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGZvcm0gaXMgY3VycmVudGx5IHN1Ym1pdHRpbmcuICovXG4gICAgdGhpcy5faXNCdXN5ID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGZvcm0gaXMgZGlzYWJsZWQuICovXG4gICAgdGhpcy5faXNEaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoaXMgY29tcG9uZW50IGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICAgIHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGdvb2dsZSByZUNBUFRDSEEgd2lkZ2V0IGlzIHJlcXVpcmVkLiAqL1xuICAgIHRoaXMuX3JlY2FwdGNoYVJlcXVpcmVkID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGdvb2dsZSByZUNBUFRDSEEgd2lkZ2V0IGhhcyBwYXNzZWQuICovXG4gICAgdGhpcy5fcmVjYXB0Y2hhVmVyaWZpZWQgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZ29vZ2xlIHJlQ0FQVENIQSB3aWRnZXQgaXMgaW5pdGlsYWlzZWQuICovXG4gICAgdGhpcy5fcmVjYXB0Y2hhaW5pdCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgY29tcG9uZW50IGhhcyBub3QgeWV0IGJlZW4gaW5pdGlhbGl6ZWQsIGF0dGFjaGVzIGV2ZW50IGxpc3RlbmVycy5cbiAgICogQG1ldGhvZFxuICAgKiBAcmV0dXJuIHt0aGlzfSBTaGFyZUZvcm1cbiAgICovXG4gIGluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2luaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLl9lbC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwidGVsXCJdJyk7XG5cbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX21hc2tQaG9uZShzZWxlY3RlZCk7XG4gICAgfVxuXG4gICAgJChgLiR7U2hhcmVGb3JtLkNzc0NsYXNzLlNIT1dfRElTQ0xBSU1FUn1gKVxuICAgICAgLm9uKCdmb2N1cycsICgpID0+IHtcbiAgICAgICAgdGhpcy5fZGlzY2xhaW1lcih0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgJCh0aGlzLl9lbCkub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKHRoaXMuX3JlY2FwdGNoYVJlcXVpcmVkKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZWNhcHRjaGFWZXJpZmllZCkge1xuICAgICAgICAgIHRoaXMuX3ZhbGlkYXRlKCk7XG4gICAgICAgICAgaWYgKHRoaXMuX2lzVmFsaWQgJiYgIXRoaXMuX2lzQnVzeSAmJiAhdGhpcy5faXNEaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5fc3VibWl0KCk7XG4gICAgICAgICAgICB3aW5kb3cuZ3JlY2FwdGNoYS5yZXNldCgpO1xuICAgICAgICAgICAgJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKS5hZGRDbGFzcygncmVjYXB0Y2hhLWpzJyk7XG4gICAgICAgICAgICB0aGlzLl9yZWNhcHRjaGFWZXJpZmllZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKHRoaXMuX2VsKS5maW5kKGAuJHtTaGFyZUZvcm0uQ3NzQ2xhc3MuRVJST1JfTVNHfWApLnJlbW92ZSgpO1xuICAgICAgICAgIHRoaXMuX3Nob3dFcnJvcihTaGFyZUZvcm0uTWVzc2FnZS5SRUNBUFRDSEEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl92YWxpZGF0ZSgpO1xuICAgICAgICBpZiAodGhpcy5faXNWYWxpZCAmJiAhdGhpcy5faXNCdXN5ICYmICF0aGlzLl9pc0Rpc2FibGVkKSB7XG4gICAgICAgICAgdGhpcy5fc3VibWl0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gLy8gRGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRvIGluaXRpYWxpemUgUmVDQVBUQ0hBLiBUaGlzIHNob3VsZCBiZVxuICAgICAgLy8gLy8gaW5pdGlhbGl6ZWQgb25seSBvbiBldmVyeSAxMHRoIHZpZXcgd2hpY2ggaXMgZGV0ZXJtaW5lZCB2aWEgYW5cbiAgICAgIC8vIC8vIGluY3JlbWVudGluZyBjb29raWUuXG4gICAgICBsZXQgdmlld0NvdW50ID0gQ29va2llcy5nZXQoJ3NjcmVlbmVyVmlld3MnKSA/XG4gICAgICAgIHBhcnNlSW50KENvb2tpZXMuZ2V0KCdzY3JlZW5lclZpZXdzJyksIDEwKSA6IDE7XG4gICAgICBpZiAodmlld0NvdW50ID49IDUgJiYgIXRoaXMuX3JlY2FwdGNoYWluaXQpIHtcbiAgICAgICAgJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKS5hZGRDbGFzcygncmVjYXB0Y2hhLWpzJyk7XG4gICAgICAgIHRoaXMuX2luaXRSZWNhcHRjaGEoKTtcbiAgICAgICAgdGhpcy5fcmVjYXB0Y2hhaW5pdCA9IHRydWU7XG4gICAgICB9XG4gICAgICBDb29raWVzLnNldCgnc2NyZWVuZXJWaWV3cycsICsrdmlld0NvdW50LCB7ZXhwaXJlczogKDIvMTQ0MCl9KTtcblxuICAgICAgJChcIiNwaG9uZVwiKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKCdwbGFjZWhvbGRlcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyAvLyBEZXRlcm1pbmUgd2hldGhlciBvciBub3QgdG8gaW5pdGlhbGl6ZSBSZUNBUFRDSEEuIFRoaXMgc2hvdWxkIGJlXG4gICAgLy8gLy8gaW5pdGlhbGl6ZWQgb25seSBvbiBldmVyeSAxMHRoIHZpZXcgd2hpY2ggaXMgZGV0ZXJtaW5lZCB2aWEgYW5cbiAgICAvLyAvLyBpbmNyZW1lbnRpbmcgY29va2llLlxuICAgIGxldCB2aWV3Q291bnQgPSBDb29raWVzLmdldCgnc2NyZWVuZXJWaWV3cycpID9cbiAgICAgIHBhcnNlSW50KENvb2tpZXMuZ2V0KCdzY3JlZW5lclZpZXdzJyksIDEwKSA6IDE7XG4gICAgaWYgKHZpZXdDb3VudCA+PSA1ICYmICF0aGlzLl9yZWNhcHRjaGFpbml0ICkge1xuICAgICAgJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKS5hZGRDbGFzcygncmVjYXB0Y2hhLWpzJyk7XG4gICAgICB0aGlzLl9pbml0UmVjYXB0Y2hhKCk7XG4gICAgICB0aGlzLl9yZWNhcHRjaGFpbml0ID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hc2sgZWFjaCBwaG9uZSBudW1iZXIgYW5kIHByb3Blcmx5IGZvcm1hdCBpdFxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gaW5wdXQgdGhlIFwidGVsXCIgaW5wdXQgdG8gbWFza1xuICAgKiBAcmV0dXJuIHtjb25zdHJ1Y3Rvcn0gICAgICAgdGhlIGlucHV0IG1hc2tcbiAgICovXG4gIF9tYXNrUGhvbmUoaW5wdXQpIHtcbiAgICBsZXQgY2xlYXZlID0gbmV3IENsZWF2ZShpbnB1dCwge1xuICAgICAgcGhvbmU6IHRydWUsXG4gICAgICBwaG9uZVJlZ2lvbkNvZGU6ICd1cycsXG4gICAgICBkZWxpbWl0ZXI6ICctJ1xuICAgIH0pO1xuICAgIGlucHV0LmNsZWF2ZSA9IGNsZWF2ZTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgZGlzY2xhaW1lciB2aXNpYmlsaXR5XG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IHZpc2libGUgLSB3ZXRoZXIgdGhlIGRpc2NsYWltZXIgc2hvdWxkIGJlIHZpc2libGUgb3Igbm90XG4gICAqL1xuICBfZGlzY2xhaW1lcih2aXNpYmxlID0gdHJ1ZSkge1xuICAgIGxldCAkZWwgPSAkKCcjanMtZGlzY2xhaW1lcicpO1xuICAgIGxldCAkY2xhc3MgPSAodmlzaWJsZSkgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJztcbiAgICAkZWwuYXR0cignYXJpYS1oaWRkZW4nLCAhdmlzaWJsZSk7XG4gICAgJGVsLmF0dHIoU2hhcmVGb3JtLkNzc0NsYXNzLkhJRERFTiwgIXZpc2libGUpO1xuICAgICRlbFskY2xhc3NdKFNoYXJlRm9ybS5Dc3NDbGFzcy5BTklNQVRFX0RJU0NMQUlNRVIpO1xuICAgIC8vIFNjcm9sbC10byBmdW5jdGlvbmFsaXR5IGZvciBtb2JpbGVcbiAgICBpZiAoXG4gICAgICB3aW5kb3cuc2Nyb2xsVG8gJiZcbiAgICAgIHZpc2libGUgJiZcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIDwgVmFyaWFibGVzWydzY3JlZW4tZGVza3RvcCddXG4gICAgKSB7XG4gICAgICBsZXQgJHRhcmdldCA9ICQoZS50YXJnZXQpO1xuICAgICAgd2luZG93LnNjcm9sbFRvKFxuICAgICAgICAwLCAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtICR0YXJnZXQuZGF0YSgnc2Nyb2xsT2Zmc2V0JylcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1bnMgdmFsaWRhdGlvbiBydWxlcyBhbmQgc2V0cyB2YWxpZGl0eSBvZiBjb21wb25lbnQuXG4gICAqIEBtZXRob2RcbiAgICogQHJldHVybiB7dGhpc30gU2hhcmVGb3JtXG4gICAqL1xuICBfdmFsaWRhdGUoKSB7XG4gICAgbGV0IHZhbGlkaXR5ID0gdHJ1ZTtcbiAgICBjb25zdCAkdGVsID0gJCh0aGlzLl9lbCkuZmluZCgnaW5wdXRbdHlwZT1cInRlbFwiXScpO1xuICAgIC8vIENsZWFyIGFueSBleGlzdGluZyBlcnJvciBtZXNzYWdlcy5cbiAgICAkKHRoaXMuX2VsKS5maW5kKGAuJHtTaGFyZUZvcm0uQ3NzQ2xhc3MuRVJST1JfTVNHfWApLnJlbW92ZSgpO1xuXG4gICAgaWYgKCR0ZWwubGVuZ3RoKSB7XG4gICAgICB2YWxpZGl0eSA9IHRoaXMuX3ZhbGlkYXRlUGhvbmVOdW1iZXIoJHRlbFswXSk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNWYWxpZCA9IHZhbGlkaXR5O1xuICAgIGlmICh0aGlzLl9pc1ZhbGlkKSB7XG4gICAgICAkKHRoaXMuX2VsKS5yZW1vdmVDbGFzcyhTaGFyZUZvcm0uQ3NzQ2xhc3MuRVJST1IpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgYSBnaXZlbiBpbnB1dCwgY2hlY2tzIHRvIHNlZSBpZiBpdHMgdmFsdWUgaXMgYSB2YWxpZCBQaG9uZW51bWJlci4gSWYgbm90LFxuICAgKiBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGFuZCBzZXRzIGFuIGVycm9yIGNsYXNzIG9uIHRoZSBlbGVtZW50LlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpbnB1dCAtIFRoZSBodG1sIGZvcm0gZWxlbWVudCBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gLSBWYWxpZCBlbWFpbC5cbiAgICovXG4gIF92YWxpZGF0ZVBob25lTnVtYmVyKGlucHV0KXtcbiAgICBsZXQgbnVtID0gdGhpcy5fcGFyc2VQaG9uZU51bWJlcihpbnB1dC52YWx1ZSk7IC8vIHBhcnNlIHRoZSBudW1iZXJcbiAgICBudW0gPSAobnVtKSA/IG51bS5qb2luKCcnKSA6IDA7IC8vIGlmIG51bSBpcyBudWxsLCB0aGVyZSBhcmUgbm8gbnVtYmVyc1xuICAgIGlmIChudW0ubGVuZ3RoID09PSAxMCkge1xuICAgICAgcmV0dXJuIHRydWU7IC8vIGFzc3VtZSBpdCBpcyBwaG9uZSBudW1iZXJcbiAgICB9XG4gICAgdGhpcy5fc2hvd0Vycm9yKFNoYXJlRm9ybS5NZXNzYWdlLlBIT05FKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gdmFyIHBob25lbm8gPSAvXlxcKz8oWzAtOV17Mn0pXFwpP1stLiBdPyhbMC05XXs0fSlbLS4gXT8oWzAtOV17NH0pJC87XG4gICAgLy8gdmFyIHBob25lbm8gPSAoL15cXCs/WzEtOV1cXGR7MSwxNH0kLyk7XG4gICAgLy8gaWYoIWlucHV0LnZhbHVlLm1hdGNoKHBob25lbm8pKXtcbiAgICAvLyAgIHRoaXMuX3Nob3dFcnJvcihTaGFyZUZvcm0uTWVzc2FnZS5QSE9ORSk7XG4gICAgLy8gICByZXR1cm4gZmFsc2U7XG4gICAgLy8gfVxuICAgIC8vIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBqdXN0IHRoZSBwaG9uZSBudW1iZXIgb2YgYSBnaXZlbiB2YWx1ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHZhbHVlIFRoZSBzdHJpbmcgdG8gZ2V0IG51bWJlcnMgZnJvbVxuICAgKiBAcmV0dXJuIHthcnJheX0gICAgICAgQW4gYXJyYXkgd2l0aCBtYXRjaGVkIGJsb2Nrc1xuICAgKi9cbiAgX3BhcnNlUGhvbmVOdW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL1xcZCsvZyk7IC8vIGdldCBvbmx5IGRpZ2l0c1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBhIGdpdmVuIGlucHV0LCBjaGVja3MgdG8gc2VlIGlmIGl0IGhhcyBhIHZhbHVlLiBJZiBub3QsIGRpc3BsYXlzIGFuXG4gICAqIGVycm9yIG1lc3NhZ2UgYW5kIHNldHMgYW4gZXJyb3IgY2xhc3Mgb24gdGhlIGVsZW1lbnQuXG4gICAqIEBtZXRob2RcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaW5wdXQgLSBUaGUgaHRtbCBmb3JtIGVsZW1lbnQgZm9yIHRoZSBjb21wb25lbnQuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gVmFsaWQgcmVxdWlyZWQgZmllbGQuXG4gICAqL1xuICBfdmFsaWRhdGVSZXF1aXJlZChpbnB1dCkge1xuICAgIGlmICgkKGlucHV0KS52YWwoKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHRoaXMuX3Nob3dFcnJvcihTaGFyZUZvcm0uTWVzc2FnZS5SRVFVSVJFRCk7XG4gICAgJChpbnB1dCkub25lKCdrZXl1cCcsIGZ1bmN0aW9uKCl7XG4gICAgICB0aGlzLl92YWxpZGF0ZSgpO1xuICAgIH0pO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGJ5IGFwcGVuZGluZyBhIGRpdiB0byB0aGUgZm9ybS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1zZyAtIEVycm9yIG1lc3NhZ2UgdG8gZGlzcGxheS5cbiAgICogQHJldHVybiB7dGhpc30gU2hhcmVGb3JtIC0gc2hhcmVmb3JtXG4gICAqL1xuICBfc2hvd0Vycm9yKG1zZykge1xuICAgIGxldCAkZWxQYXJlbnRzID0gJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKTtcbiAgICAkKCcjc21zLWZvcm0tbXNnJykuYWRkQ2xhc3MoU2hhcmVGb3JtLkNzc0NsYXNzLkVSUk9SKS50ZXh0KFV0aWxpdHkubG9jYWxpemUobXNnKSk7XG4gICAgJGVsUGFyZW50cy5yZW1vdmVDbGFzcygnc3VjY2Vzcy1qcycpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBcInN1Y2Nlc3NcIiBjbGFzcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1zZyAtIEVycm9yIG1lc3NhZ2UgdG8gZGlzcGxheS5cbiAgICogQHJldHVybiB7dGhpc30gU2hhcmVGb3JtXG4gICAqL1xuICBfc2hvd1N1Y2Nlc3MobXNnKSB7XG4gICAgbGV0ICRlbFBhcmVudHMgPSAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpO1xuICAgICQoJyNwaG9uZScpLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBVdGlsaXR5LmxvY2FsaXplKG1zZykpO1xuICAgICQoJyNzbXNidXR0b24nKS50ZXh0KFwiU2VuZCBBbm90aGVyXCIpO1xuICAgICQoJyNzbXMtZm9ybS1tc2cnKS5hZGRDbGFzcyhTaGFyZUZvcm0uQ3NzQ2xhc3MuU1VDQ0VTUykudGV4dCgnJyk7XG4gICAgJGVsUGFyZW50cy5yZW1vdmVDbGFzcygnc3VjY2Vzcy1qcycpO1xuICAgICRlbFBhcmVudHMuYWRkQ2xhc3MoJ3N1Y2Nlc3MtanMnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJtaXRzIHRoZSBmb3JtLlxuICAgKiBAcmV0dXJuIHtqcVhIUn0gZGVmZXJyZWQgcmVzcG9uc2Ugb2JqZWN0XG4gICAqL1xuICBfc3VibWl0KCkge1xuICAgIHRoaXMuX2lzQnVzeSA9IHRydWU7XG4gICAgbGV0ICRzcGlubmVyID0gdGhpcy5fZWwucXVlcnlTZWxlY3RvcihgLiR7U2hhcmVGb3JtLkNzc0NsYXNzLlNQSU5ORVJ9YCk7XG4gICAgbGV0ICRzdWJtaXQgPSB0aGlzLl9lbC5xdWVyeVNlbGVjdG9yKCdidXR0b25bdHlwZT1cInN1Ym1pdFwiXScpO1xuICAgIGNvbnN0IHBheWxvYWQgPSAkKHRoaXMuX2VsKS5zZXJpYWxpemUoKTtcbiAgICAkKHRoaXMuX2VsKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgaWYgKCRzcGlubmVyKSB7XG4gICAgICAkc3VibWl0LmRpc2FibGVkID0gdHJ1ZTsgLy8gaGlkZSBzdWJtaXQgYnV0dG9uXG4gICAgICAkc3Bpbm5lci5zdHlsZS5jc3NUZXh0ID0gJyc7IC8vIHNob3cgc3Bpbm5lclxuICAgIH1cbiAgICByZXR1cm4gJC5wb3N0KCQodGhpcy5fZWwpLmF0dHIoJ2FjdGlvbicpLCBwYXlsb2FkKS5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgIHRoaXMuX2VsLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX3Nob3dTdWNjZXNzKFNoYXJlRm9ybS5NZXNzYWdlLlNVQ0NFU1MpO1xuICAgICAgICB0aGlzLl9pc0Rpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgJCh0aGlzLl9lbCkub25lKCdrZXl1cCcsICdpbnB1dCcsICgpID0+IHtcbiAgICAgICAgICAkKHRoaXMuX2VsKS5yZW1vdmVDbGFzcyhTaGFyZUZvcm0uQ3NzQ2xhc3MuU1VDQ0VTUyk7XG4gICAgICAgICAgdGhpcy5faXNEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Nob3dFcnJvcihKU09OLnN0cmluZ2lmeShyZXNwb25zZS5tZXNzYWdlKSk7XG4gICAgICB9XG4gICAgfSkuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3Nob3dFcnJvcihTaGFyZUZvcm0uTWVzc2FnZS5TRVJWRVIpO1xuICAgIH0pLmFsd2F5cygoKSA9PiB7XG4gICAgICAkKHRoaXMuX2VsKS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgaWYgKCRzcGlubmVyKSB7XG4gICAgICAgICRzdWJtaXQuZGlzYWJsZWQgPSBmYWxzZTsgLy8gc2hvdyBzdWJtaXQgYnV0dG9uXG4gICAgICAgICRzcGlubmVyLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7IC8vIGhpZGUgc3Bpbm5lcjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2lzQnVzeSA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzeW5jaHJvbm91c2x5IGxvYWRzIHRoZSBHb29nbGUgcmVjYXB0Y2hhIHNjcmlwdCBhbmQgc2V0cyBjYWxsYmFja3MgZm9yXG4gICAqIGxvYWQsIHN1Y2Nlc3MsIGFuZCBleHBpcmF0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHt0aGlzfSBTY3JlZW5lclxuICAgKi9cbiAgX2luaXRSZWNhcHRjaGEoKSB7XG4gICAgY29uc3QgJHNjcmlwdCA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JykpO1xuICAgICRzY3JpcHQuYXR0cignc3JjJyxcbiAgICAgICAgJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vcmVjYXB0Y2hhL2FwaS5qcycgK1xuICAgICAgICAnP29ubG9hZD1zY3JlZW5lckNhbGxiYWNrJnJlbmRlcj1leHBsaWNpdCcpLnByb3Aoe1xuICAgICAgYXN5bmM6IHRydWUsXG4gICAgICBkZWZlcjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgd2luZG93LnNjcmVlbmVyQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICB3aW5kb3cuZ3JlY2FwdGNoYS5yZW5kZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcmVlbmVyLXJlY2FwdGNoYScpLCB7XG4gICAgICAgICdzaXRla2V5JyA6ICc2TGVrSUNZVUFBQUFBT1IydVowYWp5V3Q5WHhEdXNwSFBVQWtSekFCJyxcbiAgICAgICAgLy9CZWxvdyBpcyB0aGUgbG9jYWwgaG9zdCBrZXlcbiAgICAgICAgLy8gJ3NpdGVrZXknIDogJzZMY0FBQ1lVQUFBQUFQbXR2UXZCd0s4OWltTTNRZm90SkZIZlNtOEMnLFxuICAgICAgICAnY2FsbGJhY2snOiAnc2NyZWVuZXJSZWNhcHRjaGEnLFxuICAgICAgICAnZXhwaXJlZC1jYWxsYmFjayc6ICdzY3JlZW5lclJlY2FwdGNoYVJlc2V0J1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZWNhcHRjaGFSZXF1aXJlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIHdpbmRvdy5zY3JlZW5lclJlY2FwdGNoYSA9ICgpID0+IHtcbiAgICAgIHRoaXMuX3JlY2FwdGNoYVZlcmlmaWVkID0gdHJ1ZTtcbiAgICAgICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJykucmVtb3ZlQ2xhc3MoJ3JlY2FwdGNoYS1qcycpO1xuICAgIH07XG5cbiAgICB3aW5kb3cuc2NyZWVuZXJSZWNhcHRjaGFSZXNldCA9ICgpID0+IHtcbiAgICAgIHRoaXMuX3JlY2FwdGNoYVZlcmlmaWVkID0gZmFsc2U7XG4gICAgICAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpLmFkZENsYXNzKCdyZWNhcHRjaGEtanMnKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fcmVjYXB0Y2hhUmVxdWlyZWQgPSB0cnVlO1xuICAgICQoJ2hlYWQnKS5hcHBlbmQoJHNjcmlwdCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqXG4gKiBDU1MgY2xhc3NlcyB1c2VkIGJ5IHRoaXMgY29tcG9uZW50LlxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuU2hhcmVGb3JtLkNzc0NsYXNzID0ge1xuICBFUlJPUjogJ2Vycm9yJyxcbiAgRVJST1JfTVNHOiAnZXJyb3ItbWVzc2FnZScsXG4gIEZPUk06ICdqcy1zaGFyZS1mb3JtJyxcbiAgU0hPV19ESVNDTEFJTUVSOiAnanMtc2hvdy1kaXNjbGFpbWVyJyxcbiAgTkVFRFNfRElTQ0xBSU1FUjogJ2pzLW5lZWRzLWRpc2NsYWltZXInLFxuICBBTklNQVRFX0RJU0NMQUlNRVI6ICdhbmltYXRlZCBmYWRlSW5VcCcsXG4gIEhJRERFTjogJ2hpZGRlbicsXG4gIFNVQk1JVF9CVE46ICdidG4tc3VibWl0JyxcbiAgU1VDQ0VTUzogJ3N1Y2Nlc3MnLFxuICBTUElOTkVSOiAnanMtc3Bpbm5lcidcbn07XG5cbi8qKlxuICogTG9jYWxpemF0aW9uIGxhYmVscyBvZiBmb3JtIG1lc3NhZ2VzLlxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuU2hhcmVGb3JtLk1lc3NhZ2UgPSB7XG4gIEVNQUlMOiAnRVJST1JfRU1BSUwnLFxuICBQSE9ORTogJ0ludmFsaWQgTW9iaWxlIE51bWJlcicsXG4gIFJFUVVJUkVEOiAnRVJST1JfUkVRVUlSRUQnLFxuICBTRVJWRVI6ICdFUlJPUl9TRVJWRVInLFxuICBTVUNDRVNTOiAnTWVzc2FnZSBzZW50IScsXG4gIFJFQ0FQVENIQSA6ICdQbGVhc2UgZmlsbCB0aGUgcmVDQVBUQ0hBJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVGb3JtO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc2hhcmUtZm9ybS5qcyIsIi8qIVxuICogSmF2YVNjcmlwdCBDb29raWUgdjIuMi4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZVxuICpcbiAqIENvcHlyaWdodCAyMDA2LCAyMDE1IEtsYXVzIEhhcnRsICYgRmFnbmVyIEJyYWNrXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuXHR2YXIgcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gZmFsc2U7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoZmFjdG9yeSk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAoIXJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlcikge1xuXHRcdHZhciBPbGRDb29raWVzID0gd2luZG93LkNvb2tpZXM7XG5cdFx0dmFyIGFwaSA9IHdpbmRvdy5Db29raWVzID0gZmFjdG9yeSgpO1xuXHRcdGFwaS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0d2luZG93LkNvb2tpZXMgPSBPbGRDb29raWVzO1xuXHRcdFx0cmV0dXJuIGFwaTtcblx0XHR9O1xuXHR9XG59KGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gZXh0ZW5kICgpIHtcblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdGZvciAoOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IGFyZ3VtZW50c1sgaSBdO1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0cmVzdWx0W2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIpIHtcblx0XHRmdW5jdGlvbiBhcGkgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcblx0XHRcdHZhciByZXN1bHQ7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdyaXRlXG5cblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRhdHRyaWJ1dGVzID0gZXh0ZW5kKHtcblx0XHRcdFx0XHRwYXRoOiAnLydcblx0XHRcdFx0fSwgYXBpLmRlZmF1bHRzLCBhdHRyaWJ1dGVzKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHR2YXIgZXhwaXJlcyA9IG5ldyBEYXRlKCk7XG5cdFx0XHRcdFx0ZXhwaXJlcy5zZXRNaWxsaXNlY29uZHMoZXhwaXJlcy5nZXRNaWxsaXNlY29uZHMoKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGUrNSk7XG5cdFx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gZXhwaXJlcztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFdlJ3JlIHVzaW5nIFwiZXhwaXJlc1wiIGJlY2F1c2UgXCJtYXgtYWdlXCIgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxuXHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMgPyBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXHRcdFx0XHRcdGlmICgvXltcXHtcXFtdLy50ZXN0KHJlc3VsdCkpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gcmVzdWx0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblxuXHRcdFx0XHRpZiAoIWNvbnZlcnRlci53cml0ZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyh2YWx1ZSkpXG5cdFx0XHRcdFx0XHQucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnwzQXwzQ3wzRXwzRHwyRnwzRnw0MHw1Qnw1RHw1RXw2MHw3Qnw3RHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSh2YWx1ZSwga2V5KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGtleSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoa2V5KSk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvW1xcKFxcKV0vZywgZXNjYXBlKTtcblxuXHRcdFx0XHR2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG5cblx0XHRcdFx0Zm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChkb2N1bWVudC5jb29raWUgPSBrZXkgKyAnPScgKyB2YWx1ZSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlYWRcblxuXHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0cmVzdWx0ID0ge307XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLiBBbHNvIHByZXZlbnRzIG9kZCByZXN1bHQgd2hlblxuXHRcdFx0Ly8gY2FsbGluZyBcImdldCgpXCJcblx0XHRcdHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG5cdFx0XHR2YXIgcmRlY29kZSA9IC8oJVswLTlBLVpdezJ9KSsvZztcblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0Zm9yICg7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuXHRcdFx0XHRpZiAoIXRoaXMuanNvbiAmJiBjb29raWUuY2hhckF0KDApID09PSAnXCInKSB7XG5cdFx0XHRcdFx0Y29va2llID0gY29va2llLnNsaWNlKDEsIC0xKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIG5hbWUgPSBwYXJ0c1swXS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdFx0Y29va2llID0gY29udmVydGVyLnJlYWQgP1xuXHRcdFx0XHRcdFx0Y29udmVydGVyLnJlYWQoY29va2llLCBuYW1lKSA6IGNvbnZlcnRlcihjb29raWUsIG5hbWUpIHx8XG5cdFx0XHRcdFx0XHRjb29raWUucmVwbGFjZShyZGVjb2RlLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuanNvbikge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0Y29va2llID0gSlNPTi5wYXJzZShjb29raWUpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoa2V5ID09PSBuYW1lKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBjb29raWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0W25hbWVdID0gY29va2llO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0XHRhcGkuc2V0ID0gYXBpO1xuXHRcdGFwaS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoYXBpLCBrZXkpO1xuXHRcdH07XG5cdFx0YXBpLmdldEpTT04gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gYXBpLmFwcGx5KHtcblx0XHRcdFx0anNvbjogdHJ1ZVxuXHRcdFx0fSwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblx0XHR9O1xuXHRcdGFwaS5kZWZhdWx0cyA9IHt9O1xuXG5cdFx0YXBpLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcblx0XHRcdGFwaShrZXksICcnLCBleHRlbmQoYXR0cmlidXRlcywge1xuXHRcdFx0XHRleHBpcmVzOiAtMVxuXHRcdFx0fSkpO1xuXHRcdH07XG5cblx0XHRhcGkud2l0aENvbnZlcnRlciA9IGluaXQ7XG5cblx0XHRyZXR1cm4gYXBpO1xuXHR9XG5cblx0cmV0dXJuIGluaXQoZnVuY3Rpb24gKCkge30pO1xufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvanMtY29va2llL3NyYy9qcy5jb29raWUuanNcbi8vIG1vZHVsZSBpZCA9IDY5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIHV0aWxpdHkgZnVuY3Rpb25zLlxuICovXG5jb25zdCBVdGlsaXR5ID0ge307XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYSBnaXZlbiBrZXkgaW4gYSBVUkwgcXVlcnkgc3RyaW5nLiBJZiBubyBVUkwgcXVlcnlcbiAqIHN0cmluZyBpcyBwcm92aWRlZCwgdGhlIGN1cnJlbnQgVVJMIGxvY2F0aW9uIGlzIHVzZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIEtleSBuYW1lLlxuICogQHBhcmFtIHs/c3RyaW5nfSBxdWVyeVN0cmluZyAtIE9wdGlvbmFsIHF1ZXJ5IHN0cmluZyB0byBjaGVjay5cbiAqIEByZXR1cm4gez9zdHJpbmd9IFF1ZXJ5IHBhcmFtZXRlciB2YWx1ZS5cbiAqL1xuVXRpbGl0eS5nZXRVcmxQYXJhbWV0ZXIgPSAobmFtZSwgcXVlcnlTdHJpbmcpID0+IHtcbiAgY29uc3QgcXVlcnkgPSBxdWVyeVN0cmluZyB8fCB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuICBjb25zdCBwYXJhbSA9IG5hbWUucmVwbGFjZSgvW1xcW10vLCAnXFxcXFsnKS5yZXBsYWNlKC9bXFxdXS8sICdcXFxcXScpO1xuICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoJ1tcXFxcPyZdJyArIHBhcmFtICsgJz0oW14mI10qKScpO1xuICBjb25zdCByZXN1bHRzID0gcmVnZXguZXhlYyhxdWVyeSk7XG4gIHJldHVybiByZXN1bHRzID09PSBudWxsID8gJycgOlxuICAgICAgZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMV0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xufTtcblxuLyoqXG4gKiBUYWtlcyBhbiBvYmplY3QgYW5kIGRlZXBseSB0cmF2ZXJzZXMgaXQsIHJldHVybmluZyBhbiBhcnJheSBvZiB2YWx1ZXMgZm9yXG4gKiBtYXRjaGVkIHByb3BlcnRpZXMgaWRlbnRpZmllZCBieSB0aGUga2V5IHN0cmluZy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3QgdG8gdHJhdmVyc2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0UHJvcCBuYW1lIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJuIHthcnJheX0gcHJvcGVydHkgdmFsdWVzLlxuICovXG5VdGlsaXR5LmZpbmRWYWx1ZXMgPSAob2JqZWN0LCB0YXJnZXRQcm9wKSA9PiB7XG4gIGNvbnN0IHJlc3VsdHMgPSBbXTtcblxuICAvKipcbiAgICogUmVjdXJzaXZlIGZ1bmN0aW9uIGZvciBpdGVyYXRpbmcgb3ZlciBvYmplY3Qga2V5cy5cbiAgICovXG4gIChmdW5jdGlvbiB0cmF2ZXJzZU9iamVjdChvYmopIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gdGFyZ2V0UHJvcCkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChvYmpba2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZihvYmpba2V5XSkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdHJhdmVyc2VPYmplY3Qob2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KShvYmplY3QpO1xuXG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuLyoqXG4gKiBUYWtlcyBhIHN0cmluZyBvciBudW1iZXIgdmFsdWUgYW5kIGNvbnZlcnRzIGl0IHRvIGEgZG9sbGFyIGFtb3VudFxuICogYXMgYSBzdHJpbmcgd2l0aCB0d28gZGVjaW1hbCBwb2ludHMgb2YgcGVyY2lzaW9uLlxuICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSB2YWwgLSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybiB7c3RyaW5nfSBzdHJpbmdpZmllZCBudW1iZXIgdG8gdHdvIGRlY2ltYWwgcGxhY2VzLlxuICovXG5VdGlsaXR5LnRvRG9sbGFyQW1vdW50ID0gKHZhbCkgPT5cbiAgICAoTWF0aC5hYnMoTWF0aC5yb3VuZChwYXJzZUZsb2F0KHZhbCkgKiAxMDApIC8gMTAwKSkudG9GaXhlZCgyKTtcblxuLyoqXG4gKiBGb3IgdHJhbnNsYXRpbmcgc3RyaW5ncywgdGhlcmUgaXMgYSBnbG9iYWwgTE9DQUxJWkVEX1NUUklOR1MgYXJyYXkgdGhhdFxuICogaXMgZGVmaW5lZCBvbiB0aGUgSFRNTCB0ZW1wbGF0ZSBsZXZlbCBzbyB0aGF0IHRob3NlIHN0cmluZ3MgYXJlIGV4cG9zZWQgdG9cbiAqIFdQTUwgdHJhbnNsYXRpb24uIFRoZSBMT0NBTElaRURfU1RSSU5HUyBhcnJheSBpcyBjb21vc2VkIG9mIG9iamVjdHMgd2l0aCBhXG4gKiBgc2x1Z2Aga2V5IHdob3NlIHZhbHVlIGlzIHNvbWUgY29uc3RhbnQsIGFuZCBhIGBsYWJlbGAgdmFsdWUgd2hpY2ggaXMgdGhlXG4gKiB0cmFuc2xhdGVkIGVxdWl2YWxlbnQuIFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBzbHVnIG5hbWUgYW5kIHJldHVybnMgdGhlXG4gKiBsYWJlbC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzbHVnTmFtZVxuICogQHJldHVybiB7c3RyaW5nfSBsb2NhbGl6ZWQgdmFsdWVcbiAqL1xuVXRpbGl0eS5sb2NhbGl6ZSA9IGZ1bmN0aW9uKHNsdWdOYW1lKSB7XG4gIGxldCB0ZXh0ID0gc2x1Z05hbWUgfHwgJyc7XG4gIGNvbnN0IGxvY2FsaXplZFN0cmluZ3MgPSB3aW5kb3cuTE9DQUxJWkVEX1NUUklOR1MgfHwgW107XG4gIGNvbnN0IG1hdGNoID0gXy5maW5kV2hlcmUobG9jYWxpemVkU3RyaW5ncywge1xuICAgIHNsdWc6IHNsdWdOYW1lXG4gIH0pO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0ZXh0ID0gbWF0Y2gubGFiZWw7XG4gIH1cbiAgcmV0dXJuIHRleHQ7XG59O1xuXG4vKipcbiAqIFRha2VzIGEgYSBzdHJpbmcgYW5kIHJldHVybnMgd2hldGhlciBvciBub3QgdGhlIHN0cmluZyBpcyBhIHZhbGlkIGVtYWlsXG4gKiBieSB1c2luZyBuYXRpdmUgYnJvd3NlciB2YWxpZGF0aW9uIGlmIGF2YWlsYWJsZS4gT3RoZXJ3aXNlLCBkb2VzIGEgc2ltcGxlXG4gKiBSZWdleCB0ZXN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGVtYWlsXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5VdGlsaXR5LmlzVmFsaWRFbWFpbCA9IGZ1bmN0aW9uKGVtYWlsKSB7XG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgaW5wdXQudHlwZSA9ICdlbWFpbCc7XG4gIGlucHV0LnZhbHVlID0gZW1haWw7XG5cbiAgcmV0dXJuIHR5cGVvZiBpbnB1dC5jaGVja1ZhbGlkaXR5ID09PSAnZnVuY3Rpb24nID9cbiAgICAgIGlucHV0LmNoZWNrVmFsaWRpdHkoKSA6IC9cXFMrQFxcUytcXC5cXFMrLy50ZXN0KGVtYWlsKTtcbn07XG5cbi8qKlxuICogU2l0ZSBjb25zdGFudHMuXG4gKiBAZW51bSB7c3RyaW5nfVxuICovXG5VdGlsaXR5LkNPTkZJRyA9IHtcbiAgREVGQVVMVF9MQVQ6IDQwLjcxMjgsXG4gIERFRkFVTFRfTE5HOiAtNzQuMDA1OSxcbiAgR09PR0xFX0FQSTogJ0FJemFTeUJTamNfSk5fcDAtX1ZLeUJ2akNGcVZBbUFJV3Q3Q2xaYycsXG4gIEdPT0dMRV9TVEFUSUNfQVBJOiAnQUl6YVN5Q3QwRTdEWF9ZUEZjVW5sTVA2V0h2MnpxQXd5WkU0cUl3JyxcbiAgR1JFQ0FQVENIQV9TSVRFX0tFWTogJzZMZXluQlVVQUFBQUFOd3NrVFcyVUljZWt0UmlheVNxTEZGd3drNDgnLFxuICBTQ1JFRU5FUl9NQVhfSE9VU0VIT0xEOiA4LFxuICBVUkxfUElOX0JMVUU6ICcvd3AtY29udGVudC90aGVtZXMvYWNjZXNzL2Fzc2V0cy9pbWcvbWFwLXBpbi1ibHVlLnBuZycsXG4gIFVSTF9QSU5fQkxVRV8yWDogJy93cC1jb250ZW50L3RoZW1lcy9hY2Nlc3MvYXNzZXRzL2ltZy9tYXAtcGluLWJsdWUtMngucG5nJyxcbiAgVVJMX1BJTl9HUkVFTjogJy93cC1jb250ZW50L3RoZW1lcy9hY2Nlc3MvYXNzZXRzL2ltZy9tYXAtcGluLWdyZWVuLnBuZycsXG4gIFVSTF9QSU5fR1JFRU5fMlg6ICcvd3AtY29udGVudC90aGVtZXMvYWNjZXNzL2Fzc2V0cy9pbWcvbWFwLXBpbi1ncmVlbi0yeC5wbmcnXG59O1xuXG5leHBvcnQgZGVmYXVsdCBVdGlsaXR5O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL3ZlbmRvci91dGlsaXR5LmpzIiwiLyohXG4gKiBjbGVhdmUuanMgLSAwLjcuMjNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9ub3Npci9jbGVhdmUuanNcbiAqIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDEyLTIwMTcgTWF4IEh1YW5nIGh0dHBzOi8vZ2l0aHViLmNvbS9ub3Npci9cbiAqL1xuIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9dCgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW10sdCk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/ZXhwb3J0cy5DbGVhdmU9dCgpOmUuQ2xlYXZlPXQoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXtmdW5jdGlvbiB0KG4pe2lmKHJbbl0pcmV0dXJuIHJbbl0uZXhwb3J0czt2YXIgaT1yW25dPXtleHBvcnRzOnt9LGlkOm4sbG9hZGVkOiExfTtyZXR1cm4gZVtuXS5jYWxsKGkuZXhwb3J0cyxpLGkuZXhwb3J0cyx0KSxpLmxvYWRlZD0hMCxpLmV4cG9ydHN9dmFyIHI9e307cmV0dXJuIHQubT1lLHQuYz1yLHQucD1cIlwiLHQoMCl9KFtmdW5jdGlvbihlLHQscil7KGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciBuPWZ1bmN0aW9uKGUsdCl7dmFyIHI9dGhpcztpZihcInN0cmluZ1wiPT10eXBlb2YgZT9yLmVsZW1lbnQ9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlKTpyLmVsZW1lbnQ9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGUubGVuZ3RoJiZlLmxlbmd0aD4wP2VbMF06ZSwhci5lbGVtZW50KXRocm93IG5ldyBFcnJvcihcIltjbGVhdmUuanNdIFBsZWFzZSBjaGVjayB0aGUgZWxlbWVudFwiKTt0LmluaXRWYWx1ZT1yLmVsZW1lbnQudmFsdWUsci5wcm9wZXJ0aWVzPW4uRGVmYXVsdFByb3BlcnRpZXMuYXNzaWduKHt9LHQpLHIuaW5pdCgpfTtuLnByb3RvdHlwZT17aW5pdDpmdW5jdGlvbigpe3ZhciBlPXRoaXMsdD1lLnByb3BlcnRpZXM7KHQubnVtZXJhbHx8dC5waG9uZXx8dC5jcmVkaXRDYXJkfHx0LmRhdGV8fDAhPT10LmJsb2Nrc0xlbmd0aHx8dC5wcmVmaXgpJiYodC5tYXhMZW5ndGg9bi5VdGlsLmdldE1heExlbmd0aCh0LmJsb2NrcyksZS5pc0FuZHJvaWQ9bi5VdGlsLmlzQW5kcm9pZCgpLGUubGFzdElucHV0VmFsdWU9XCJcIixlLm9uQ2hhbmdlTGlzdGVuZXI9ZS5vbkNoYW5nZS5iaW5kKGUpLGUub25LZXlEb3duTGlzdGVuZXI9ZS5vbktleURvd24uYmluZChlKSxlLm9uQ3V0TGlzdGVuZXI9ZS5vbkN1dC5iaW5kKGUpLGUub25Db3B5TGlzdGVuZXI9ZS5vbkNvcHkuYmluZChlKSxlLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsZS5vbkNoYW5nZUxpc3RlbmVyKSxlLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIixlLm9uS2V5RG93bkxpc3RlbmVyKSxlLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImN1dFwiLGUub25DdXRMaXN0ZW5lciksZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsZS5vbkNvcHlMaXN0ZW5lciksZS5pbml0UGhvbmVGb3JtYXR0ZXIoKSxlLmluaXREYXRlRm9ybWF0dGVyKCksZS5pbml0TnVtZXJhbEZvcm1hdHRlcigpLGUub25JbnB1dCh0LmluaXRWYWx1ZSkpfSxpbml0TnVtZXJhbEZvcm1hdHRlcjpmdW5jdGlvbigpe3ZhciBlPXRoaXMsdD1lLnByb3BlcnRpZXM7dC5udW1lcmFsJiYodC5udW1lcmFsRm9ybWF0dGVyPW5ldyBuLk51bWVyYWxGb3JtYXR0ZXIodC5udW1lcmFsRGVjaW1hbE1hcmssdC5udW1lcmFsSW50ZWdlclNjYWxlLHQubnVtZXJhbERlY2ltYWxTY2FsZSx0Lm51bWVyYWxUaG91c2FuZHNHcm91cFN0eWxlLHQubnVtZXJhbFBvc2l0aXZlT25seSx0LmRlbGltaXRlcikpfSxpbml0RGF0ZUZvcm1hdHRlcjpmdW5jdGlvbigpe3ZhciBlPXRoaXMsdD1lLnByb3BlcnRpZXM7dC5kYXRlJiYodC5kYXRlRm9ybWF0dGVyPW5ldyBuLkRhdGVGb3JtYXR0ZXIodC5kYXRlUGF0dGVybiksdC5ibG9ja3M9dC5kYXRlRm9ybWF0dGVyLmdldEJsb2NrcygpLHQuYmxvY2tzTGVuZ3RoPXQuYmxvY2tzLmxlbmd0aCx0Lm1heExlbmd0aD1uLlV0aWwuZ2V0TWF4TGVuZ3RoKHQuYmxvY2tzKSl9LGluaXRQaG9uZUZvcm1hdHRlcjpmdW5jdGlvbigpe3ZhciBlPXRoaXMsdD1lLnByb3BlcnRpZXM7aWYodC5waG9uZSl0cnl7dC5waG9uZUZvcm1hdHRlcj1uZXcgbi5QaG9uZUZvcm1hdHRlcihuZXcgdC5yb290LkNsZWF2ZS5Bc1lvdVR5cGVGb3JtYXR0ZXIodC5waG9uZVJlZ2lvbkNvZGUpLHQuZGVsaW1pdGVyKX1jYXRjaChyKXt0aHJvdyBuZXcgRXJyb3IoXCJbY2xlYXZlLmpzXSBQbGVhc2UgaW5jbHVkZSBwaG9uZS10eXBlLWZvcm1hdHRlci57Y291bnRyeX0uanMgbGliXCIpfX0sb25LZXlEb3duOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMscj10LnByb3BlcnRpZXMsaT1lLndoaWNofHxlLmtleUNvZGUsYT1uLlV0aWwsbz10LmVsZW1lbnQudmFsdWU7cmV0dXJuIGEuaXNBbmRyb2lkQmFja3NwYWNlS2V5ZG93bih0Lmxhc3RJbnB1dFZhbHVlLG8pJiYoaT04KSx0Lmxhc3RJbnB1dFZhbHVlPW8sOD09PWkmJmEuaXNEZWxpbWl0ZXIoby5zbGljZSgtci5kZWxpbWl0ZXJMZW5ndGgpLHIuZGVsaW1pdGVyLHIuZGVsaW1pdGVycyk/dm9pZChyLmJhY2tzcGFjZT0hMCk6dm9pZChyLmJhY2tzcGFjZT0hMSl9LG9uQ2hhbmdlOmZ1bmN0aW9uKCl7dGhpcy5vbklucHV0KHRoaXMuZWxlbWVudC52YWx1ZSl9LG9uQ3V0OmZ1bmN0aW9uKGUpe3RoaXMuY29weUNsaXBib2FyZERhdGEoZSksdGhpcy5vbklucHV0KFwiXCIpfSxvbkNvcHk6ZnVuY3Rpb24oZSl7dGhpcy5jb3B5Q2xpcGJvYXJkRGF0YShlKX0sY29weUNsaXBib2FyZERhdGE6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPXQucHJvcGVydGllcyxpPW4uVXRpbCxhPXQuZWxlbWVudC52YWx1ZSxvPVwiXCI7bz1yLmNvcHlEZWxpbWl0ZXI/YTppLnN0cmlwRGVsaW1pdGVycyhhLHIuZGVsaW1pdGVyLHIuZGVsaW1pdGVycyk7dHJ5e2UuY2xpcGJvYXJkRGF0YT9lLmNsaXBib2FyZERhdGEuc2V0RGF0YShcIlRleHRcIixvKTp3aW5kb3cuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwiVGV4dFwiLG8pLGUucHJldmVudERlZmF1bHQoKX1jYXRjaChsKXt9fSxvbklucHV0OmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMscj10LnByb3BlcnRpZXMsaT1lLGE9bi5VdGlsO3JldHVybiByLm51bWVyYWx8fCFyLmJhY2tzcGFjZXx8YS5pc0RlbGltaXRlcihlLnNsaWNlKC1yLmRlbGltaXRlckxlbmd0aCksci5kZWxpbWl0ZXIsci5kZWxpbWl0ZXJzKXx8KGU9YS5oZWFkU3RyKGUsZS5sZW5ndGgtci5kZWxpbWl0ZXJMZW5ndGgpKSxyLnBob25lPyhyLnJlc3VsdD1yLnBob25lRm9ybWF0dGVyLmZvcm1hdChlKSx2b2lkIHQudXBkYXRlVmFsdWVTdGF0ZSgpKTpyLm51bWVyYWw/KHIucmVzdWx0PXIucHJlZml4K3IubnVtZXJhbEZvcm1hdHRlci5mb3JtYXQoZSksdm9pZCB0LnVwZGF0ZVZhbHVlU3RhdGUoKSk6KHIuZGF0ZSYmKGU9ci5kYXRlRm9ybWF0dGVyLmdldFZhbGlkYXRlZERhdGUoZSkpLGU9YS5zdHJpcERlbGltaXRlcnMoZSxyLmRlbGltaXRlcixyLmRlbGltaXRlcnMpLGU9YS5nZXRQcmVmaXhTdHJpcHBlZFZhbHVlKGUsci5wcmVmaXgsci5wcmVmaXhMZW5ndGgpLGU9ci5udW1lcmljT25seT9hLnN0cmlwKGUsL1teXFxkXS9nKTplLGU9ci51cHBlcmNhc2U/ZS50b1VwcGVyQ2FzZSgpOmUsZT1yLmxvd2VyY2FzZT9lLnRvTG93ZXJDYXNlKCk6ZSxyLnByZWZpeCYmKGU9ci5wcmVmaXgrZSwwPT09ci5ibG9ja3NMZW5ndGgpPyhyLnJlc3VsdD1lLHZvaWQgdC51cGRhdGVWYWx1ZVN0YXRlKCkpOihyLmNyZWRpdENhcmQmJnQudXBkYXRlQ3JlZGl0Q2FyZFByb3BzQnlWYWx1ZShlKSxlPWEuaGVhZFN0cihlLHIubWF4TGVuZ3RoKSxyLnJlc3VsdD1hLmdldEZvcm1hdHRlZFZhbHVlKGUsci5ibG9ja3Msci5ibG9ja3NMZW5ndGgsci5kZWxpbWl0ZXIsci5kZWxpbWl0ZXJzKSx2b2lkKGk9PT1yLnJlc3VsdCYmaSE9PXIucHJlZml4fHx0LnVwZGF0ZVZhbHVlU3RhdGUoKSkpKX0sdXBkYXRlQ3JlZGl0Q2FyZFByb3BzQnlWYWx1ZTpmdW5jdGlvbihlKXt2YXIgdCxyPXRoaXMsaT1yLnByb3BlcnRpZXMsYT1uLlV0aWw7YS5oZWFkU3RyKGkucmVzdWx0LDQpIT09YS5oZWFkU3RyKGUsNCkmJih0PW4uQ3JlZGl0Q2FyZERldGVjdG9yLmdldEluZm8oZSxpLmNyZWRpdENhcmRTdHJpY3RNb2RlKSxpLmJsb2Nrcz10LmJsb2NrcyxpLmJsb2Nrc0xlbmd0aD1pLmJsb2Nrcy5sZW5ndGgsaS5tYXhMZW5ndGg9YS5nZXRNYXhMZW5ndGgoaS5ibG9ja3MpLGkuY3JlZGl0Q2FyZFR5cGUhPT10LnR5cGUmJihpLmNyZWRpdENhcmRUeXBlPXQudHlwZSxpLm9uQ3JlZGl0Q2FyZFR5cGVDaGFuZ2VkLmNhbGwocixpLmNyZWRpdENhcmRUeXBlKSkpfSx1cGRhdGVWYWx1ZVN0YXRlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcztyZXR1cm4gZS5pc0FuZHJvaWQ/dm9pZCB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2UuZWxlbWVudC52YWx1ZT1lLnByb3BlcnRpZXMucmVzdWx0fSwxKTp2b2lkKGUuZWxlbWVudC52YWx1ZT1lLnByb3BlcnRpZXMucmVzdWx0KX0sc2V0UGhvbmVSZWdpb25Db2RlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMscj10LnByb3BlcnRpZXM7ci5waG9uZVJlZ2lvbkNvZGU9ZSx0LmluaXRQaG9uZUZvcm1hdHRlcigpLHQub25DaGFuZ2UoKX0sc2V0UmF3VmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPXQucHJvcGVydGllcztlPXZvaWQgMCE9PWUmJm51bGwhPT1lP2UudG9TdHJpbmcoKTpcIlwiLHIubnVtZXJhbCYmKGU9ZS5yZXBsYWNlKFwiLlwiLHIubnVtZXJhbERlY2ltYWxNYXJrKSksdC5lbGVtZW50LnZhbHVlPWUsdC5vbklucHV0KGUpfSxnZXRSYXdWYWx1ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXMsdD1lLnByb3BlcnRpZXMscj1uLlV0aWwsaT1lLmVsZW1lbnQudmFsdWU7cmV0dXJuIHQucmF3VmFsdWVUcmltUHJlZml4JiYoaT1yLmdldFByZWZpeFN0cmlwcGVkVmFsdWUoaSx0LnByZWZpeCx0LnByZWZpeExlbmd0aCkpLGk9dC5udW1lcmFsP3QubnVtZXJhbEZvcm1hdHRlci5nZXRSYXdWYWx1ZShpKTpyLnN0cmlwRGVsaW1pdGVycyhpLHQuZGVsaW1pdGVyLHQuZGVsaW1pdGVycyl9LGdldEZvcm1hdHRlZFZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZWxlbWVudC52YWx1ZX0sZGVzdHJveTpmdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGUub25DaGFuZ2VMaXN0ZW5lciksZS5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsZS5vbktleURvd25MaXN0ZW5lciksZS5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjdXRcIixlLm9uQ3V0TGlzdGVuZXIpLGUuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29weVwiLGUub25Db3B5TGlzdGVuZXIpfSx0b1N0cmluZzpmdW5jdGlvbigpe3JldHVyblwiW0NsZWF2ZSBPYmplY3RdXCJ9fSxuLk51bWVyYWxGb3JtYXR0ZXI9cigxKSxuLkRhdGVGb3JtYXR0ZXI9cigyKSxuLlBob25lRm9ybWF0dGVyPXIoMyksbi5DcmVkaXRDYXJkRGV0ZWN0b3I9cig0KSxuLlV0aWw9cig1KSxuLkRlZmF1bHRQcm9wZXJ0aWVzPXIoNiksKFwib2JqZWN0XCI9PXR5cGVvZiB0JiZ0P3Q6d2luZG93KS5DbGVhdmU9bixlLmV4cG9ydHM9bn0pLmNhbGwodCxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj1mdW5jdGlvbihlLHQsbixpLGEsbyl7dmFyIGw9dGhpcztsLm51bWVyYWxEZWNpbWFsTWFyaz1lfHxcIi5cIixsLm51bWVyYWxJbnRlZ2VyU2NhbGU9dD49MD90OjEwLGwubnVtZXJhbERlY2ltYWxTY2FsZT1uPj0wP246MixsLm51bWVyYWxUaG91c2FuZHNHcm91cFN0eWxlPWl8fHIuZ3JvdXBTdHlsZS50aG91c2FuZCxsLm51bWVyYWxQb3NpdGl2ZU9ubHk9ISFhLGwuZGVsaW1pdGVyPW98fFwiXCI9PT1vP286XCIsXCIsbC5kZWxpbWl0ZXJSRT1vP25ldyBSZWdFeHAoXCJcXFxcXCIrbyxcImdcIik6XCJcIn07ci5ncm91cFN0eWxlPXt0aG91c2FuZDpcInRob3VzYW5kXCIsbGFraDpcImxha2hcIix3YW46XCJ3YW5cIn0sci5wcm90b3R5cGU9e2dldFJhd1ZhbHVlOmZ1bmN0aW9uKGUpe3JldHVybiBlLnJlcGxhY2UodGhpcy5kZWxpbWl0ZXJSRSxcIlwiKS5yZXBsYWNlKHRoaXMubnVtZXJhbERlY2ltYWxNYXJrLFwiLlwiKX0sZm9ybWF0OmZ1bmN0aW9uKGUpe3ZhciB0LG4saT10aGlzLGE9XCJcIjtzd2l0Y2goZT1lLnJlcGxhY2UoL1tBLVphLXpdL2csXCJcIikucmVwbGFjZShpLm51bWVyYWxEZWNpbWFsTWFyayxcIk1cIikucmVwbGFjZSgvW15cXGRNLV0vZyxcIlwiKS5yZXBsYWNlKC9eXFwtLyxcIk5cIikucmVwbGFjZSgvXFwtL2csXCJcIikucmVwbGFjZShcIk5cIixpLm51bWVyYWxQb3NpdGl2ZU9ubHk/XCJcIjpcIi1cIikucmVwbGFjZShcIk1cIixpLm51bWVyYWxEZWNpbWFsTWFyaykucmVwbGFjZSgvXigtKT8wKyg/PVxcZCkvLFwiJDFcIiksbj1lLGUuaW5kZXhPZihpLm51bWVyYWxEZWNpbWFsTWFyayk+PTAmJih0PWUuc3BsaXQoaS5udW1lcmFsRGVjaW1hbE1hcmspLG49dFswXSxhPWkubnVtZXJhbERlY2ltYWxNYXJrK3RbMV0uc2xpY2UoMCxpLm51bWVyYWxEZWNpbWFsU2NhbGUpKSxpLm51bWVyYWxJbnRlZ2VyU2NhbGU+MCYmKG49bi5zbGljZSgwLGkubnVtZXJhbEludGVnZXJTY2FsZSsoXCItXCI9PT1lLnNsaWNlKDAsMSk/MTowKSkpLGkubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGUpe2Nhc2Ugci5ncm91cFN0eWxlLmxha2g6bj1uLnJlcGxhY2UoLyhcXGQpKD89KFxcZFxcZCkrXFxkJCkvZyxcIiQxXCIraS5kZWxpbWl0ZXIpO2JyZWFrO2Nhc2Ugci5ncm91cFN0eWxlLndhbjpuPW4ucmVwbGFjZSgvKFxcZCkoPz0oXFxkezR9KSskKS9nLFwiJDFcIitpLmRlbGltaXRlcik7YnJlYWs7ZGVmYXVsdDpuPW4ucmVwbGFjZSgvKFxcZCkoPz0oXFxkezN9KSskKS9nLFwiJDFcIitpLmRlbGltaXRlcil9cmV0dXJuIG4udG9TdHJpbmcoKSsoaS5udW1lcmFsRGVjaW1hbFNjYWxlPjA/YS50b1N0cmluZygpOlwiXCIpfX0sZS5leHBvcnRzPXJ9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpczt0LmJsb2Nrcz1bXSx0LmRhdGVQYXR0ZXJuPWUsdC5pbml0QmxvY2tzKCl9O3IucHJvdG90eXBlPXtpbml0QmxvY2tzOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLmRhdGVQYXR0ZXJuLmZvckVhY2goZnVuY3Rpb24odCl7XCJZXCI9PT10P2UuYmxvY2tzLnB1c2goNCk6ZS5ibG9ja3MucHVzaCgyKX0pfSxnZXRCbG9ja3M6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibG9ja3N9LGdldFZhbGlkYXRlZERhdGU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPVwiXCI7cmV0dXJuIGU9ZS5yZXBsYWNlKC9bXlxcZF0vZyxcIlwiKSx0LmJsb2Nrcy5mb3JFYWNoKGZ1bmN0aW9uKG4saSl7aWYoZS5sZW5ndGg+MCl7dmFyIGE9ZS5zbGljZSgwLG4pLG89YS5zbGljZSgwLDEpLGw9ZS5zbGljZShuKTtzd2l0Y2godC5kYXRlUGF0dGVybltpXSl7Y2FzZVwiZFwiOlwiMDBcIj09PWE/YT1cIjAxXCI6cGFyc2VJbnQobywxMCk+Mz9hPVwiMFwiK286cGFyc2VJbnQoYSwxMCk+MzEmJihhPVwiMzFcIik7YnJlYWs7Y2FzZVwibVwiOlwiMDBcIj09PWE/YT1cIjAxXCI6cGFyc2VJbnQobywxMCk+MT9hPVwiMFwiK286cGFyc2VJbnQoYSwxMCk+MTImJihhPVwiMTJcIil9cis9YSxlPWx9fSkscn19LGUuZXhwb3J0cz1yfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO3ZhciByPWZ1bmN0aW9uKGUsdCl7dmFyIHI9dGhpcztyLmRlbGltaXRlcj10fHxcIlwiPT09dD90OlwiIFwiLHIuZGVsaW1pdGVyUkU9dD9uZXcgUmVnRXhwKFwiXFxcXFwiK3QsXCJnXCIpOlwiXCIsci5mb3JtYXR0ZXI9ZX07ci5wcm90b3R5cGU9e3NldEZvcm1hdHRlcjpmdW5jdGlvbihlKXt0aGlzLmZvcm1hdHRlcj1lfSxmb3JtYXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpczt0LmZvcm1hdHRlci5jbGVhcigpLGU9ZS5yZXBsYWNlKC9bXlxcZCtdL2csXCJcIiksZT1lLnJlcGxhY2UodC5kZWxpbWl0ZXJSRSxcIlwiKTtmb3IodmFyIHIsbj1cIlwiLGk9ITEsYT0wLG89ZS5sZW5ndGg7bz5hO2ErKylyPXQuZm9ybWF0dGVyLmlucHV0RGlnaXQoZS5jaGFyQXQoYSkpLC9bXFxzKCktXS9nLnRlc3Qocik/KG49cixpPSEwKTppfHwobj1yKTtyZXR1cm4gbj1uLnJlcGxhY2UoL1soKV0vZyxcIlwiKSxuPW4ucmVwbGFjZSgvW1xccy1dL2csdC5kZWxpbWl0ZXIpfX0sZS5leHBvcnRzPXJ9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9e2Jsb2Nrczp7dWF0cDpbNCw1LDZdLGFtZXg6WzQsNiw1XSxkaW5lcnM6WzQsNiw0XSxkaXNjb3ZlcjpbNCw0LDQsNF0sbWFzdGVyY2FyZDpbNCw0LDQsNF0sZGFua29ydDpbNCw0LDQsNF0saW5zdGFwYXltZW50Ols0LDQsNCw0XSxqY2I6WzQsNCw0LDRdLG1hZXN0cm86WzQsNCw0LDRdLHZpc2E6WzQsNCw0LDRdLGdlbmVyYWw6WzQsNCw0LDRdLGdlbmVyYWxTdHJpY3Q6WzQsNCw0LDddfSxyZTp7dWF0cDovXig/ITE4MDApMVxcZHswLDE0fS8sYW1leDovXjNbNDddXFxkezAsMTN9LyxkaXNjb3ZlcjovXig/OjYwMTF8NjVcXGR7MCwyfXw2NFs0LTldXFxkPylcXGR7MCwxMn0vLGRpbmVyczovXjMoPzowKFswLTVdfDkpfFs2ODldXFxkPylcXGR7MCwxMX0vLG1hc3RlcmNhcmQ6L14oNVsxLTVdfDJbMi03XSlcXGR7MCwxNH0vLGRhbmtvcnQ6L14oNTAxOXw0MTc1fDQ1NzEpXFxkezAsMTJ9LyxpbnN0YXBheW1lbnQ6L142M1s3LTldXFxkezAsMTN9LyxqY2I6L14oPzoyMTMxfDE4MDB8MzVcXGR7MCwyfSlcXGR7MCwxMn0vLG1hZXN0cm86L14oPzo1WzA2NzhdXFxkezAsMn18NjMwNHw2N1xcZHswLDJ9KVxcZHswLDEyfS8sdmlzYTovXjRcXGR7MCwxNX0vfSxnZXRJbmZvOmZ1bmN0aW9uKGUsdCl7dmFyIG49ci5ibG9ja3MsaT1yLnJlO3JldHVybiB0PSEhdCxpLmFtZXgudGVzdChlKT97dHlwZTpcImFtZXhcIixibG9ja3M6bi5hbWV4fTppLnVhdHAudGVzdChlKT97dHlwZTpcInVhdHBcIixibG9ja3M6bi51YXRwfTppLmRpbmVycy50ZXN0KGUpP3t0eXBlOlwiZGluZXJzXCIsYmxvY2tzOm4uZGluZXJzfTppLmRpc2NvdmVyLnRlc3QoZSk/e3R5cGU6XCJkaXNjb3ZlclwiLGJsb2Nrczp0P24uZ2VuZXJhbFN0cmljdDpuLmRpc2NvdmVyfTppLm1hc3RlcmNhcmQudGVzdChlKT97dHlwZTpcIm1hc3RlcmNhcmRcIixibG9ja3M6bi5tYXN0ZXJjYXJkfTppLmRhbmtvcnQudGVzdChlKT97dHlwZTpcImRhbmtvcnRcIixibG9ja3M6bi5kYW5rb3J0fTppLmluc3RhcGF5bWVudC50ZXN0KGUpP3t0eXBlOlwiaW5zdGFwYXltZW50XCIsYmxvY2tzOm4uaW5zdGFwYXltZW50fTppLmpjYi50ZXN0KGUpP3t0eXBlOlwiamNiXCIsYmxvY2tzOm4uamNifTppLm1hZXN0cm8udGVzdChlKT97dHlwZTpcIm1hZXN0cm9cIixibG9ja3M6dD9uLmdlbmVyYWxTdHJpY3Q6bi5tYWVzdHJvfTppLnZpc2EudGVzdChlKT97dHlwZTpcInZpc2FcIixibG9ja3M6dD9uLmdlbmVyYWxTdHJpY3Q6bi52aXNhfTp7dHlwZTpcInVua25vd25cIixibG9ja3M6dD9uLmdlbmVyYWxTdHJpY3Q6bi5nZW5lcmFsfX19O2UuZXhwb3J0cz1yfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO3ZhciByPXtub29wOmZ1bmN0aW9uKCl7fSxzdHJpcDpmdW5jdGlvbihlLHQpe3JldHVybiBlLnJlcGxhY2UodCxcIlwiKX0saXNEZWxpbWl0ZXI6ZnVuY3Rpb24oZSx0LHIpe3JldHVybiAwPT09ci5sZW5ndGg/ZT09PXQ6ci5zb21lKGZ1bmN0aW9uKHQpe3JldHVybiBlPT09dD8hMDp2b2lkIDB9KX0sZ2V0RGVsaW1pdGVyUkVCeURlbGltaXRlcjpmdW5jdGlvbihlKXtyZXR1cm4gbmV3IFJlZ0V4cChlLnJlcGxhY2UoLyhbLj8qK14kW1xcXVxcXFwoKXt9fC1dKS9nLFwiXFxcXCQxXCIpLFwiZ1wiKX0sc3RyaXBEZWxpbWl0ZXJzOmZ1bmN0aW9uKGUsdCxyKXt2YXIgbj10aGlzO2lmKDA9PT1yLmxlbmd0aCl7dmFyIGk9dD9uLmdldERlbGltaXRlclJFQnlEZWxpbWl0ZXIodCk6XCJcIjtyZXR1cm4gZS5yZXBsYWNlKGksXCJcIil9cmV0dXJuIHIuZm9yRWFjaChmdW5jdGlvbih0KXtlPWUucmVwbGFjZShuLmdldERlbGltaXRlclJFQnlEZWxpbWl0ZXIodCksXCJcIil9KSxlfSxoZWFkU3RyOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUuc2xpY2UoMCx0KX0sZ2V0TWF4TGVuZ3RoOmZ1bmN0aW9uKGUpe3JldHVybiBlLnJlZHVjZShmdW5jdGlvbihlLHQpe3JldHVybiBlK3R9LDApfSxnZXRQcmVmaXhTdHJpcHBlZFZhbHVlOmZ1bmN0aW9uKGUsdCxyKXtpZihlLnNsaWNlKDAscikhPT10KXt2YXIgbj10aGlzLmdldEZpcnN0RGlmZkluZGV4KHQsZS5zbGljZSgwLHIpKTtlPXQrZS5zbGljZShuLG4rMSkrZS5zbGljZShyKzEpfXJldHVybiBlLnNsaWNlKHIpfSxnZXRGaXJzdERpZmZJbmRleDpmdW5jdGlvbihlLHQpe2Zvcih2YXIgcj0wO2UuY2hhckF0KHIpPT09dC5jaGFyQXQocik7KWlmKFwiXCI9PT1lLmNoYXJBdChyKyspKXJldHVybi0xO3JldHVybiByfSxnZXRGb3JtYXR0ZWRWYWx1ZTpmdW5jdGlvbihlLHQscixuLGkpe3ZhciBhLG89XCJcIixsPWkubGVuZ3RoPjA7cmV0dXJuIDA9PT1yP2U6KHQuZm9yRWFjaChmdW5jdGlvbih0LHMpe2lmKGUubGVuZ3RoPjApe3ZhciBjPWUuc2xpY2UoMCx0KSx1PWUuc2xpY2UodCk7bys9YyxhPWw/aVtzXXx8YTpuLGMubGVuZ3RoPT09dCYmci0xPnMmJihvKz1hKSxlPXV9fSksbyl9LGlzQW5kcm9pZDpmdW5jdGlvbigpe3JldHVybiEoIW5hdmlnYXRvcnx8IS9hbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSl9LGlzQW5kcm9pZEJhY2tzcGFjZUtleWRvd246ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5pc0FuZHJvaWQoKT90PT09ZS5zbGljZSgwLC0xKTohMX19O2UuZXhwb3J0cz1yfSxmdW5jdGlvbihlLHQpeyhmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj17YXNzaWduOmZ1bmN0aW9uKGUscil7cmV0dXJuIGU9ZXx8e30scj1yfHx7fSxlLmNyZWRpdENhcmQ9ISFyLmNyZWRpdENhcmQsZS5jcmVkaXRDYXJkU3RyaWN0TW9kZT0hIXIuY3JlZGl0Q2FyZFN0cmljdE1vZGUsZS5jcmVkaXRDYXJkVHlwZT1cIlwiLGUub25DcmVkaXRDYXJkVHlwZUNoYW5nZWQ9ci5vbkNyZWRpdENhcmRUeXBlQ2hhbmdlZHx8ZnVuY3Rpb24oKXt9LGUucGhvbmU9ISFyLnBob25lLGUucGhvbmVSZWdpb25Db2RlPXIucGhvbmVSZWdpb25Db2RlfHxcIkFVXCIsZS5waG9uZUZvcm1hdHRlcj17fSxlLmRhdGU9ISFyLmRhdGUsZS5kYXRlUGF0dGVybj1yLmRhdGVQYXR0ZXJufHxbXCJkXCIsXCJtXCIsXCJZXCJdLGUuZGF0ZUZvcm1hdHRlcj17fSxlLm51bWVyYWw9ISFyLm51bWVyYWwsZS5udW1lcmFsSW50ZWdlclNjYWxlPXIubnVtZXJhbEludGVnZXJTY2FsZT49MD9yLm51bWVyYWxJbnRlZ2VyU2NhbGU6MTAsZS5udW1lcmFsRGVjaW1hbFNjYWxlPXIubnVtZXJhbERlY2ltYWxTY2FsZT49MD9yLm51bWVyYWxEZWNpbWFsU2NhbGU6MixlLm51bWVyYWxEZWNpbWFsTWFyaz1yLm51bWVyYWxEZWNpbWFsTWFya3x8XCIuXCIsZS5udW1lcmFsVGhvdXNhbmRzR3JvdXBTdHlsZT1yLm51bWVyYWxUaG91c2FuZHNHcm91cFN0eWxlfHxcInRob3VzYW5kXCIsZS5udW1lcmFsUG9zaXRpdmVPbmx5PSEhci5udW1lcmFsUG9zaXRpdmVPbmx5LGUubnVtZXJpY09ubHk9ZS5jcmVkaXRDYXJkfHxlLmRhdGV8fCEhci5udW1lcmljT25seSxlLnVwcGVyY2FzZT0hIXIudXBwZXJjYXNlLGUubG93ZXJjYXNlPSEhci5sb3dlcmNhc2UsZS5wcmVmaXg9ZS5jcmVkaXRDYXJkfHxlLnBob25lfHxlLmRhdGU/XCJcIjpyLnByZWZpeHx8XCJcIixlLnByZWZpeExlbmd0aD1lLnByZWZpeC5sZW5ndGgsZS5yYXdWYWx1ZVRyaW1QcmVmaXg9ISFyLnJhd1ZhbHVlVHJpbVByZWZpeCxlLmNvcHlEZWxpbWl0ZXI9ISFyLmNvcHlEZWxpbWl0ZXIsZS5pbml0VmFsdWU9dm9pZCAwPT09ci5pbml0VmFsdWU/XCJcIjpyLmluaXRWYWx1ZS50b1N0cmluZygpLGUuZGVsaW1pdGVyPXIuZGVsaW1pdGVyfHxcIlwiPT09ci5kZWxpbWl0ZXI/ci5kZWxpbWl0ZXI6ci5kYXRlP1wiL1wiOnIubnVtZXJhbD9cIixcIjooci5waG9uZSxcIiBcIiksZS5kZWxpbWl0ZXJMZW5ndGg9ZS5kZWxpbWl0ZXIubGVuZ3RoLGUuZGVsaW1pdGVycz1yLmRlbGltaXRlcnN8fFtdLGUuYmxvY2tzPXIuYmxvY2tzfHxbXSxlLmJsb2Nrc0xlbmd0aD1lLmJsb2Nrcy5sZW5ndGgsZS5yb290PVwib2JqZWN0XCI9PXR5cGVvZiB0JiZ0P3Q6d2luZG93LGUubWF4TGVuZ3RoPTAsZS5iYWNrc3BhY2U9ITEsZS5yZXN1bHQ9XCJcIixlfX07ZS5leHBvcnRzPXJ9KS5jYWxsKHQsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9XSl9KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jbGVhdmUuanMvZGlzdC9jbGVhdmUubWluLmpzXG4vLyBtb2R1bGUgaWQgPSA3MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIhZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQsbil7dmFyIGU9dC5zcGxpdChcIi5cIikscj1IO2VbMF1pbiByfHwhci5leGVjU2NyaXB0fHxyLmV4ZWNTY3JpcHQoXCJ2YXIgXCIrZVswXSk7Zm9yKHZhciBpO2UubGVuZ3RoJiYoaT1lLnNoaWZ0KCkpOyllLmxlbmd0aHx8dm9pZCAwPT09bj9yPXJbaV0/cltpXTpyW2ldPXt9OnJbaV09bn1mdW5jdGlvbiBuKHQsbil7ZnVuY3Rpb24gZSgpe31lLnByb3RvdHlwZT1uLnByb3RvdHlwZSx0Lk09bi5wcm90b3R5cGUsdC5wcm90b3R5cGU9bmV3IGUsdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCx0Lk49ZnVuY3Rpb24odCxlLHIpe2Zvcih2YXIgaT1BcnJheShhcmd1bWVudHMubGVuZ3RoLTIpLGE9MjthPGFyZ3VtZW50cy5sZW5ndGg7YSsrKWlbYS0yXT1hcmd1bWVudHNbYV07cmV0dXJuIG4ucHJvdG90eXBlW2VdLmFwcGx5KHQsaSl9fWZ1bmN0aW9uIGUodCxuKXtudWxsIT10JiZ0aGlzLmEuYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIHIodCl7dC5iPVwiXCJ9ZnVuY3Rpb24gaSh0LG4pe3Quc29ydChufHxhKX1mdW5jdGlvbiBhKHQsbil7cmV0dXJuIHQ+bj8xOm4+dD8tMTowfWZ1bmN0aW9uIGwodCl7dmFyIG4sZT1bXSxyPTA7Zm9yKG4gaW4gdCllW3IrK109dFtuXTtyZXR1cm4gZX1mdW5jdGlvbiBvKHQsbil7dGhpcy5iPXQsdGhpcy5hPXt9O2Zvcih2YXIgZT0wO2U8bi5sZW5ndGg7ZSsrKXt2YXIgcj1uW2VdO3RoaXMuYVtyLmJdPXJ9fWZ1bmN0aW9uIHUodCl7cmV0dXJuIHQ9bCh0LmEpLGkodCxmdW5jdGlvbih0LG4pe3JldHVybiB0LmItbi5ifSksdH1mdW5jdGlvbiBzKHQsbil7c3dpdGNoKHRoaXMuYj10LHRoaXMuZz0hIW4uRyx0aGlzLmE9bi5jLHRoaXMuaj1uLnR5cGUsdGhpcy5oPSExLHRoaXMuYSl7Y2FzZSBxOmNhc2UgSjpjYXNlIEw6Y2FzZSBPOmNhc2UgazpjYXNlIFk6Y2FzZSBLOnRoaXMuaD0hMH10aGlzLmY9bi5kZWZhdWx0VmFsdWV9ZnVuY3Rpb24gZigpe3RoaXMuYT17fSx0aGlzLmY9dGhpcy5pKCkuYSx0aGlzLmI9dGhpcy5nPW51bGx9ZnVuY3Rpb24gcCh0LG4pe2Zvcih2YXIgZT11KHQuaSgpKSxyPTA7cjxlLmxlbmd0aDtyKyspe3ZhciBpPWVbcl0sYT1pLmI7aWYobnVsbCE9bi5hW2FdKXt0LmImJmRlbGV0ZSB0LmJbaS5iXTt2YXIgbD0xMT09aS5hfHwxMD09aS5hO2lmKGkuZylmb3IodmFyIGk9YyhuLGEpfHxbXSxvPTA7bzxpLmxlbmd0aDtvKyspe3ZhciBzPXQsZj1hLGg9bD9pW29dLmNsb25lKCk6aVtvXTtzLmFbZl18fChzLmFbZl09W10pLHMuYVtmXS5wdXNoKGgpLHMuYiYmZGVsZXRlIHMuYltmXX1lbHNlIGk9YyhuLGEpLGw/KGw9Yyh0LGEpKT9wKGwsaSk6bSh0LGEsaS5jbG9uZSgpKTptKHQsYSxpKX19fWZ1bmN0aW9uIGModCxuKXt2YXIgZT10LmFbbl07aWYobnVsbD09ZSlyZXR1cm4gbnVsbDtpZih0Lmcpe2lmKCEobiBpbiB0LmIpKXt2YXIgcj10LmcsaT10LmZbbl07aWYobnVsbCE9ZSlpZihpLmcpe2Zvcih2YXIgYT1bXSxsPTA7bDxlLmxlbmd0aDtsKyspYVtsXT1yLmIoaSxlW2xdKTtlPWF9ZWxzZSBlPXIuYihpLGUpO3JldHVybiB0LmJbbl09ZX1yZXR1cm4gdC5iW25dfXJldHVybiBlfWZ1bmN0aW9uIGgodCxuLGUpe3ZhciByPWModCxuKTtyZXR1cm4gdC5mW25dLmc/cltlfHwwXTpyfWZ1bmN0aW9uIGcodCxuKXt2YXIgZTtpZihudWxsIT10LmFbbl0pZT1oKHQsbix2b2lkIDApO2Vsc2UgdDp7aWYoZT10LmZbbl0sdm9pZCAwPT09ZS5mKXt2YXIgcj1lLmo7aWYocj09PUJvb2xlYW4pZS5mPSExO2Vsc2UgaWYocj09PU51bWJlcillLmY9MDtlbHNle2lmKHIhPT1TdHJpbmcpe2U9bmV3IHI7YnJlYWsgdH1lLmY9ZS5oP1wiMFwiOlwiXCJ9fWU9ZS5mfXJldHVybiBlfWZ1bmN0aW9uIGIodCxuKXtyZXR1cm4gdC5mW25dLmc/bnVsbCE9dC5hW25dP3QuYVtuXS5sZW5ndGg6MDpudWxsIT10LmFbbl0/MTowfWZ1bmN0aW9uIG0odCxuLGUpe3QuYVtuXT1lLHQuYiYmKHQuYltuXT1lKX1mdW5jdGlvbiB5KHQsbil7dmFyIGUscj1bXTtmb3IoZSBpbiBuKTAhPWUmJnIucHVzaChuZXcgcyhlLG5bZV0pKTtyZXR1cm4gbmV3IG8odCxyKX0vKlxuXG4gUHJvdG9jb2wgQnVmZmVyIDIgQ29weXJpZ2h0IDIwMDggR29vZ2xlIEluYy5cbiBBbGwgb3RoZXIgY29kZSBjb3B5cmlnaHQgaXRzIHJlc3BlY3RpdmUgb3duZXJzLlxuIENvcHlyaWdodCAoQykgMjAxMCBUaGUgTGlicGhvbmVudW1iZXIgQXV0aG9yc1xuXG4gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cbmZ1bmN0aW9uIHYoKXtmLmNhbGwodGhpcyl9ZnVuY3Rpb24gZCgpe2YuY2FsbCh0aGlzKX1mdW5jdGlvbiBfKCl7Zi5jYWxsKHRoaXMpfWZ1bmN0aW9uIFMoKXt9ZnVuY3Rpb24gdygpe31mdW5jdGlvbiBBKCl7fS8qXG5cbiBDb3B5cmlnaHQgKEMpIDIwMTAgVGhlIExpYnBob25lbnVtYmVyIEF1dGhvcnMuXG5cbiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG4gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuZnVuY3Rpb24geCgpe3RoaXMuYT17fX1mdW5jdGlvbiBOKHQsbil7aWYobnVsbD09bilyZXR1cm4gbnVsbDtuPW4udG9VcHBlckNhc2UoKTt2YXIgZT10LmFbbl07aWYobnVsbD09ZSl7aWYoZT10dFtuXSxudWxsPT1lKXJldHVybiBudWxsO2U9KG5ldyBBKS5hKF8uaSgpLGUpLHQuYVtuXT1lfXJldHVybiBlfWZ1bmN0aW9uIGoodCl7cmV0dXJuIHQ9V1t0XSxudWxsPT10P1wiWlpcIjp0WzBdfWZ1bmN0aW9uICQodCl7dGhpcy5IPVJlZ0V4cChcIuKAiFwiKSx0aGlzLkI9XCJcIix0aGlzLm09bmV3IGUsdGhpcy52PVwiXCIsdGhpcy5oPW5ldyBlLHRoaXMudT1uZXcgZSx0aGlzLmo9ITAsdGhpcy53PXRoaXMubz10aGlzLkQ9ITEsdGhpcy5GPXguYigpLHRoaXMucz0wLHRoaXMuYj1uZXcgZSx0aGlzLkE9ITEsdGhpcy5sPVwiXCIsdGhpcy5hPW5ldyBlLHRoaXMuZj1bXSx0aGlzLkM9dCx0aGlzLko9dGhpcy5nPUModGhpcyx0aGlzLkMpfWZ1bmN0aW9uIEModCxuKXt2YXIgZTtpZihudWxsIT1uJiZpc05hTihuKSYmbi50b1VwcGVyQ2FzZSgpaW4gdHQpe2lmKGU9Tih0LkYsbiksbnVsbD09ZSl0aHJvd1wiSW52YWxpZCByZWdpb24gY29kZTogXCIrbjtlPWcoZSwxMCl9ZWxzZSBlPTA7cmV0dXJuIGU9Tih0LkYsaihlKSksbnVsbCE9ZT9lOmF0fWZ1bmN0aW9uIEIodCl7Zm9yKHZhciBuPXQuZi5sZW5ndGgsZT0wO24+ZTsrK2Upe3ZhciBpPXQuZltlXSxhPWcoaSwxKTtpZih0LnY9PWEpcmV0dXJuITE7dmFyIGw7bD10O3ZhciBvPWksdT1nKG8sMSk7aWYoLTEhPXUuaW5kZXhPZihcInxcIikpbD0hMTtlbHNle3U9dS5yZXBsYWNlKGx0LFwiXFxcXGRcIiksdT11LnJlcGxhY2Uob3QsXCJcXFxcZFwiKSxyKGwubSk7dmFyIHM7cz1sO3ZhciBvPWcobywyKSxmPVwiOTk5OTk5OTk5OTk5OTk5XCIubWF0Y2godSlbMF07Zi5sZW5ndGg8cy5hLmIubGVuZ3RoP3M9XCJcIjoocz1mLnJlcGxhY2UobmV3IFJlZ0V4cCh1LFwiZ1wiKSxvKSxzPXMucmVwbGFjZShSZWdFeHAoXCI5XCIsXCJnXCIpLFwi4oCIXCIpKSwwPHMubGVuZ3RoPyhsLm0uYShzKSxsPSEwKTpsPSExfWlmKGwpcmV0dXJuIHQudj1hLHQuQT1zdC50ZXN0KGgoaSw0KSksdC5zPTAsITB9cmV0dXJuIHQuaj0hMX1mdW5jdGlvbiBFKHQsbil7Zm9yKHZhciBlPVtdLHI9bi5sZW5ndGgtMyxpPXQuZi5sZW5ndGgsYT0wO2k+YTsrK2Epe3ZhciBsPXQuZlthXTswPT1iKGwsMyk/ZS5wdXNoKHQuZlthXSk6KGw9aChsLDMsTWF0aC5taW4ocixiKGwsMyktMSkpLDA9PW4uc2VhcmNoKGwpJiZlLnB1c2godC5mW2FdKSl9dC5mPWV9ZnVuY3Rpb24gUih0LG4pe3QuaC5hKG4pO3ZhciBlPW47aWYocnQudGVzdChlKXx8MT09dC5oLmIubGVuZ3RoJiZldC50ZXN0KGUpKXt2YXIgaSxlPW47XCIrXCI9PWU/KGk9ZSx0LnUuYShlKSk6KGk9bnRbZV0sdC51LmEoaSksdC5hLmEoaSkpLG49aX1lbHNlIHQuaj0hMSx0LkQ9ITA7aWYoIXQuail7aWYoIXQuRClpZihWKHQpKXtpZihQKHQpKXJldHVybiBEKHQpfWVsc2UgaWYoMDx0LmwubGVuZ3RoJiYoZT10LmEudG9TdHJpbmcoKSxyKHQuYSksdC5hLmEodC5sKSx0LmEuYShlKSxlPXQuYi50b1N0cmluZygpLGk9ZS5sYXN0SW5kZXhPZih0LmwpLHIodC5iKSx0LmIuYShlLnN1YnN0cmluZygwLGkpKSksdC5sIT1VKHQpKXJldHVybiB0LmIuYShcIiBcIiksRCh0KTtyZXR1cm4gdC5oLnRvU3RyaW5nKCl9c3dpdGNoKHQudS5iLmxlbmd0aCl7Y2FzZSAwOmNhc2UgMTpjYXNlIDI6cmV0dXJuIHQuaC50b1N0cmluZygpO2Nhc2UgMzppZighVih0KSlyZXR1cm4gdC5sPVUodCksRih0KTt0Lnc9ITA7ZGVmYXVsdDpyZXR1cm4gdC53PyhQKHQpJiYodC53PSExKSx0LmIudG9TdHJpbmcoKSt0LmEudG9TdHJpbmcoKSk6MDx0LmYubGVuZ3RoPyhlPVQodCxuKSxpPUkodCksMDxpLmxlbmd0aD9pOihFKHQsdC5hLnRvU3RyaW5nKCkpLEIodCk/Ryh0KTp0Lmo/TSh0LGUpOnQuaC50b1N0cmluZygpKSk6Rih0KX19ZnVuY3Rpb24gRCh0KXtyZXR1cm4gdC5qPSEwLHQudz0hMSx0LmY9W10sdC5zPTAscih0Lm0pLHQudj1cIlwiLEYodCl9ZnVuY3Rpb24gSSh0KXtmb3IodmFyIG49dC5hLnRvU3RyaW5nKCksZT10LmYubGVuZ3RoLHI9MDtlPnI7KytyKXt2YXIgaT10LmZbcl0sYT1nKGksMSk7aWYobmV3IFJlZ0V4cChcIl4oPzpcIithK1wiKSRcIikudGVzdChuKSlyZXR1cm4gdC5BPXN0LnRlc3QoaChpLDQpKSxuPW4ucmVwbGFjZShuZXcgUmVnRXhwKGEsXCJnXCIpLGgoaSwyKSksTSh0LG4pfXJldHVyblwiXCJ9ZnVuY3Rpb24gTSh0LG4pe3ZhciBlPXQuYi5iLmxlbmd0aDtyZXR1cm4gdC5BJiZlPjAmJlwiIFwiIT10LmIudG9TdHJpbmcoKS5jaGFyQXQoZS0xKT90LmIrXCIgXCIrbjp0LmIrbn1mdW5jdGlvbiBGKHQpe3ZhciBuPXQuYS50b1N0cmluZygpO2lmKDM8PW4ubGVuZ3RoKXtmb3IodmFyIGU9dC5vJiYwPGIodC5nLDIwKT9jKHQuZywyMCl8fFtdOmModC5nLDE5KXx8W10scj1lLmxlbmd0aCxpPTA7cj5pOysraSl7dmFyIGEsbD1lW2ldOyhhPW51bGw9PXQuZy5hWzEyXXx8dC5vfHxoKGwsNikpfHwoYT1nKGwsNCksYT0wPT1hLmxlbmd0aHx8aXQudGVzdChhKSksYSYmdXQudGVzdChnKGwsMikpJiZ0LmYucHVzaChsKX1yZXR1cm4gRSh0LG4pLG49SSh0KSwwPG4ubGVuZ3RoP246Qih0KT9HKHQpOnQuaC50b1N0cmluZygpfXJldHVybiBNKHQsbil9ZnVuY3Rpb24gRyh0KXt2YXIgbj10LmEudG9TdHJpbmcoKSxlPW4ubGVuZ3RoO2lmKGU+MCl7Zm9yKHZhciByPVwiXCIsaT0wO2U+aTtpKyspcj1UKHQsbi5jaGFyQXQoaSkpO3JldHVybiB0Lmo/TSh0LHIpOnQuaC50b1N0cmluZygpfXJldHVybiB0LmIudG9TdHJpbmcoKX1mdW5jdGlvbiBVKHQpe3ZhciBuLGU9dC5hLnRvU3RyaW5nKCksaT0wO3JldHVybiAxIT1oKHQuZywxMCk/bj0hMToobj10LmEudG9TdHJpbmcoKSxuPVwiMVwiPT1uLmNoYXJBdCgwKSYmXCIwXCIhPW4uY2hhckF0KDEpJiZcIjFcIiE9bi5jaGFyQXQoMSkpLG4/KGk9MSx0LmIuYShcIjFcIikuYShcIiBcIiksdC5vPSEwKTpudWxsIT10LmcuYVsxNV0mJihuPW5ldyBSZWdFeHAoXCJeKD86XCIraCh0LmcsMTUpK1wiKVwiKSxuPWUubWF0Y2gobiksbnVsbCE9biYmbnVsbCE9blswXSYmMDxuWzBdLmxlbmd0aCYmKHQubz0hMCxpPW5bMF0ubGVuZ3RoLHQuYi5hKGUuc3Vic3RyaW5nKDAsaSkpKSkscih0LmEpLHQuYS5hKGUuc3Vic3RyaW5nKGkpKSxlLnN1YnN0cmluZygwLGkpfWZ1bmN0aW9uIFYodCl7dmFyIG49dC51LnRvU3RyaW5nKCksZT1uZXcgUmVnRXhwKFwiXig/OlxcXFwrfFwiK2godC5nLDExKStcIilcIiksZT1uLm1hdGNoKGUpO3JldHVybiBudWxsIT1lJiZudWxsIT1lWzBdJiYwPGVbMF0ubGVuZ3RoPyh0Lm89ITAsZT1lWzBdLmxlbmd0aCxyKHQuYSksdC5hLmEobi5zdWJzdHJpbmcoZSkpLHIodC5iKSx0LmIuYShuLnN1YnN0cmluZygwLGUpKSxcIitcIiE9bi5jaGFyQXQoMCkmJnQuYi5hKFwiIFwiKSwhMCk6ITF9ZnVuY3Rpb24gUCh0KXtpZigwPT10LmEuYi5sZW5ndGgpcmV0dXJuITE7dmFyIG4saT1uZXcgZTt0OntpZihuPXQuYS50b1N0cmluZygpLDAhPW4ubGVuZ3RoJiZcIjBcIiE9bi5jaGFyQXQoMCkpZm9yKHZhciBhLGw9bi5sZW5ndGgsbz0xOzM+PW8mJmw+PW87KytvKWlmKGE9cGFyc2VJbnQobi5zdWJzdHJpbmcoMCxvKSwxMCksYSBpbiBXKXtpLmEobi5zdWJzdHJpbmcobykpLG49YTticmVhayB0fW49MH1yZXR1cm4gMD09bj8hMToocih0LmEpLHQuYS5hKGkudG9TdHJpbmcoKSksaT1qKG4pLFwiMDAxXCI9PWk/dC5nPU4odC5GLFwiXCIrbik6aSE9dC5DJiYodC5nPUModCxpKSksdC5iLmEoXCJcIituKS5hKFwiIFwiKSx0Lmw9XCJcIiwhMCl9ZnVuY3Rpb24gVCh0LG4pe3ZhciBlPXQubS50b1N0cmluZygpO2lmKDA8PWUuc3Vic3RyaW5nKHQucykuc2VhcmNoKHQuSCkpe3ZhciBpPWUuc2VhcmNoKHQuSCksZT1lLnJlcGxhY2UodC5ILG4pO3JldHVybiByKHQubSksdC5tLmEoZSksdC5zPWksZS5zdWJzdHJpbmcoMCx0LnMrMSl9cmV0dXJuIDE9PXQuZi5sZW5ndGgmJih0Lmo9ITEpLHQudj1cIlwiLHQuaC50b1N0cmluZygpfXZhciBIPXRoaXM7ZS5wcm90b3R5cGUuYj1cIlwiLGUucHJvdG90eXBlLnNldD1mdW5jdGlvbih0KXt0aGlzLmI9XCJcIit0fSxlLnByb3RvdHlwZS5hPWZ1bmN0aW9uKHQsbixlKXtpZih0aGlzLmIrPVN0cmluZyh0KSxudWxsIT1uKWZvcih2YXIgcj0xO3I8YXJndW1lbnRzLmxlbmd0aDtyKyspdGhpcy5iKz1hcmd1bWVudHNbcl07cmV0dXJuIHRoaXN9LGUucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYn07dmFyIEs9MSxZPTIscT0zLEo9NCxMPTYsTz0xNixrPTE4O2YucHJvdG90eXBlLnNldD1mdW5jdGlvbih0LG4pe20odGhpcyx0LmIsbil9LGYucHJvdG90eXBlLmNsb25lPWZ1bmN0aW9uKCl7dmFyIHQ9bmV3IHRoaXMuY29uc3RydWN0b3I7cmV0dXJuIHQhPXRoaXMmJih0LmE9e30sdC5iJiYodC5iPXt9KSxwKHQsdGhpcykpLHR9O3ZhciBaO24odixmKTt2YXIgejtuKGQsZik7dmFyIFg7bihfLGYpLHYucHJvdG90eXBlLmk9ZnVuY3Rpb24oKXtyZXR1cm4gWnx8KFo9eSh2LHswOntuYW1lOlwiTnVtYmVyRm9ybWF0XCIsSTpcImkxOG4ucGhvbmVudW1iZXJzLk51bWJlckZvcm1hdFwifSwxOntuYW1lOlwicGF0dGVyblwiLHJlcXVpcmVkOiEwLGM6OSx0eXBlOlN0cmluZ30sMjp7bmFtZTpcImZvcm1hdFwiLHJlcXVpcmVkOiEwLGM6OSx0eXBlOlN0cmluZ30sMzp7bmFtZTpcImxlYWRpbmdfZGlnaXRzX3BhdHRlcm5cIixHOiEwLGM6OSx0eXBlOlN0cmluZ30sNDp7bmFtZTpcIm5hdGlvbmFsX3ByZWZpeF9mb3JtYXR0aW5nX3J1bGVcIixjOjksdHlwZTpTdHJpbmd9LDY6e25hbWU6XCJuYXRpb25hbF9wcmVmaXhfb3B0aW9uYWxfd2hlbl9mb3JtYXR0aW5nXCIsYzo4LHR5cGU6Qm9vbGVhbn0sNTp7bmFtZTpcImRvbWVzdGljX2NhcnJpZXJfY29kZV9mb3JtYXR0aW5nX3J1bGVcIixjOjksdHlwZTpTdHJpbmd9fSkpLFp9LHYuY3Rvcj12LHYuY3Rvci5pPXYucHJvdG90eXBlLmksZC5wcm90b3R5cGUuaT1mdW5jdGlvbigpe3JldHVybiB6fHwoej15KGQsezA6e25hbWU6XCJQaG9uZU51bWJlckRlc2NcIixJOlwiaTE4bi5waG9uZW51bWJlcnMuUGhvbmVOdW1iZXJEZXNjXCJ9LDI6e25hbWU6XCJuYXRpb25hbF9udW1iZXJfcGF0dGVyblwiLGM6OSx0eXBlOlN0cmluZ30sMzp7bmFtZTpcInBvc3NpYmxlX251bWJlcl9wYXR0ZXJuXCIsYzo5LHR5cGU6U3RyaW5nfSw2OntuYW1lOlwiZXhhbXBsZV9udW1iZXJcIixjOjksdHlwZTpTdHJpbmd9LDc6e25hbWU6XCJuYXRpb25hbF9udW1iZXJfbWF0Y2hlcl9kYXRhXCIsYzoxMix0eXBlOlN0cmluZ30sODp7bmFtZTpcInBvc3NpYmxlX251bWJlcl9tYXRjaGVyX2RhdGFcIixjOjEyLHR5cGU6U3RyaW5nfX0pKSx6fSxkLmN0b3I9ZCxkLmN0b3IuaT1kLnByb3RvdHlwZS5pLF8ucHJvdG90eXBlLmk9ZnVuY3Rpb24oKXtyZXR1cm4gWHx8KFg9eShfLHswOntuYW1lOlwiUGhvbmVNZXRhZGF0YVwiLEk6XCJpMThuLnBob25lbnVtYmVycy5QaG9uZU1ldGFkYXRhXCJ9LDE6e25hbWU6XCJnZW5lcmFsX2Rlc2NcIixjOjExLHR5cGU6ZH0sMjp7bmFtZTpcImZpeGVkX2xpbmVcIixjOjExLHR5cGU6ZH0sMzp7bmFtZTpcIm1vYmlsZVwiLGM6MTEsdHlwZTpkfSw0OntuYW1lOlwidG9sbF9mcmVlXCIsYzoxMSx0eXBlOmR9LDU6e25hbWU6XCJwcmVtaXVtX3JhdGVcIixjOjExLHR5cGU6ZH0sNjp7bmFtZTpcInNoYXJlZF9jb3N0XCIsYzoxMSx0eXBlOmR9LDc6e25hbWU6XCJwZXJzb25hbF9udW1iZXJcIixjOjExLHR5cGU6ZH0sODp7bmFtZTpcInZvaXBcIixjOjExLHR5cGU6ZH0sMjE6e25hbWU6XCJwYWdlclwiLGM6MTEsdHlwZTpkfSwyNTp7bmFtZTpcInVhblwiLGM6MTEsdHlwZTpkfSwyNzp7bmFtZTpcImVtZXJnZW5jeVwiLGM6MTEsdHlwZTpkfSwyODp7bmFtZTpcInZvaWNlbWFpbFwiLGM6MTEsdHlwZTpkfSwyNDp7bmFtZTpcIm5vX2ludGVybmF0aW9uYWxfZGlhbGxpbmdcIixjOjExLHR5cGU6ZH0sOTp7bmFtZTpcImlkXCIscmVxdWlyZWQ6ITAsYzo5LHR5cGU6U3RyaW5nfSwxMDp7bmFtZTpcImNvdW50cnlfY29kZVwiLGM6NSx0eXBlOk51bWJlcn0sMTE6e25hbWU6XCJpbnRlcm5hdGlvbmFsX3ByZWZpeFwiLGM6OSx0eXBlOlN0cmluZ30sMTc6e25hbWU6XCJwcmVmZXJyZWRfaW50ZXJuYXRpb25hbF9wcmVmaXhcIixjOjksdHlwZTpTdHJpbmd9LDEyOntuYW1lOlwibmF0aW9uYWxfcHJlZml4XCIsYzo5LHR5cGU6U3RyaW5nfSwxMzp7bmFtZTpcInByZWZlcnJlZF9leHRuX3ByZWZpeFwiLGM6OSx0eXBlOlN0cmluZ30sMTU6e25hbWU6XCJuYXRpb25hbF9wcmVmaXhfZm9yX3BhcnNpbmdcIixjOjksdHlwZTpTdHJpbmd9LDE2OntuYW1lOlwibmF0aW9uYWxfcHJlZml4X3RyYW5zZm9ybV9ydWxlXCIsYzo5LHR5cGU6U3RyaW5nfSwxODp7bmFtZTpcInNhbWVfbW9iaWxlX2FuZF9maXhlZF9saW5lX3BhdHRlcm5cIixjOjgsZGVmYXVsdFZhbHVlOiExLHR5cGU6Qm9vbGVhbn0sMTk6e25hbWU6XCJudW1iZXJfZm9ybWF0XCIsRzohMCxjOjExLHR5cGU6dn0sMjA6e25hbWU6XCJpbnRsX251bWJlcl9mb3JtYXRcIixHOiEwLGM6MTEsdHlwZTp2fSwyMjp7bmFtZTpcIm1haW5fY291bnRyeV9mb3JfY29kZVwiLGM6OCxkZWZhdWx0VmFsdWU6ITEsdHlwZTpCb29sZWFufSwyMzp7bmFtZTpcImxlYWRpbmdfZGlnaXRzXCIsYzo5LHR5cGU6U3RyaW5nfSwyNjp7bmFtZTpcImxlYWRpbmdfemVyb19wb3NzaWJsZVwiLGM6OCxkZWZhdWx0VmFsdWU6ITEsdHlwZTpCb29sZWFufX0pKSxYfSxfLmN0b3I9XyxfLmN0b3IuaT1fLnByb3RvdHlwZS5pLFMucHJvdG90eXBlLmE9ZnVuY3Rpb24odCl7dGhyb3cgbmV3IHQuYixFcnJvcihcIlVuaW1wbGVtZW50ZWRcIil9LFMucHJvdG90eXBlLmI9ZnVuY3Rpb24odCxuKXtpZigxMT09dC5hfHwxMD09dC5hKXJldHVybiBuIGluc3RhbmNlb2YgZj9uOnRoaXMuYSh0LmoucHJvdG90eXBlLmkoKSxuKTtpZigxND09dC5hKXtpZihcInN0cmluZ1wiPT10eXBlb2YgbiYmUS50ZXN0KG4pKXt2YXIgZT1OdW1iZXIobik7aWYoZT4wKXJldHVybiBlfXJldHVybiBufWlmKCF0LmgpcmV0dXJuIG47aWYoZT10LmosZT09PVN0cmluZyl7aWYoXCJudW1iZXJcIj09dHlwZW9mIG4pcmV0dXJuIFN0cmluZyhuKX1lbHNlIGlmKGU9PT1OdW1iZXImJlwic3RyaW5nXCI9PXR5cGVvZiBuJiYoXCJJbmZpbml0eVwiPT09bnx8XCItSW5maW5pdHlcIj09PW58fFwiTmFOXCI9PT1ufHxRLnRlc3QobikpKXJldHVybiBOdW1iZXIobik7cmV0dXJuIG59O3ZhciBRPS9eLT9bMC05XSskLztuKHcsUyksdy5wcm90b3R5cGUuYT1mdW5jdGlvbih0LG4pe3ZhciBlPW5ldyB0LmI7cmV0dXJuIGUuZz10aGlzLGUuYT1uLGUuYj17fSxlfSxuKEEsdyksQS5wcm90b3R5cGUuYj1mdW5jdGlvbih0LG4pe3JldHVybiA4PT10LmE/ISFuOlMucHJvdG90eXBlLmIuYXBwbHkodGhpcyxhcmd1bWVudHMpfSxBLnByb3RvdHlwZS5hPWZ1bmN0aW9uKHQsbil7cmV0dXJuIEEuTS5hLmNhbGwodGhpcyx0LG4pfTsvKlxuXG4gQ29weXJpZ2h0IChDKSAyMDEwIFRoZSBMaWJwaG9uZW51bWJlciBBdXRob3JzXG5cbiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG4gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xudmFyIFc9ezE6XCJVUyBBRyBBSSBBUyBCQiBCTSBCUyBDQSBETSBETyBHRCBHVSBKTSBLTiBLWSBMQyBNUCBNUyBQUiBTWCBUQyBUVCBWQyBWRyBWSVwiLnNwbGl0KFwiIFwiKX0sdHQ9e1VTOltudWxsLFtudWxsLG51bGwsXCJbMi05XVxcXFxkezl9XCIsXCJcXFxcZHs3fSg/OlxcXFxkezN9KT9cIl0sW251bGwsbnVsbCxcIig/OjIoPzowWzEtMzUtOV18MVswMi05XXwyWzA0NTg5XXwzWzE0OV18NFswOF18NVsxLTQ2XXw2WzAyNzldfDdbMDI2XXw4WzEzXSl8Myg/OjBbMS01Ny05XXwxWzAyLTldfDJbMDEzNV18M1swMTQ2NzldfDRbNjddfDVbMTJdfDZbMDE0XXw4WzA1Nl0pfDQoPzowWzEyNC05XXwxWzAyLTU3OV18MlszLTVdfDNbMDI0NV18NFswMjM1XXw1OHw2OXw3WzA1ODldfDhbMDRdKXw1KD86MFsxLTU3LTldfDFbMDIzNS04XXwyMHwzWzAxNDldfDRbMDFdfDVbMTldfDZbMS0zN118N1swMTMtNV18OFswNTZdKXw2KD86MFsxLTM1LTldfDFbMDI0LTldfDJbMDM2ODldfDNbMDE2XXw0WzE2XXw1WzAxN118NlswLTI3OV18Nzh8OFsxMl0pfDcoPzowWzEtNDYtOF18MVswMi05XXwyWzA0NTddfDNbMTI0N118NFswMzddfDVbNDddfDZbMDIzNTldfDdbMDItNTldfDhbMTU2XSl8OCg/OjBbMS02OF18MVswMi04XXwyOHwzWzAtMjVdfDRbMzU3OF18NVswNDYtOV18NlswMi01XXw3WzAyOF0pfDkoPzowWzEzNDYtOV18MVswMi05XXwyWzA1ODldfDNbMDE2NzhdfDRbMDE3OV18NVsxMjQ2OV18N1swLTM1ODldfDhbMDQ1OV0pKVsyLTldXFxcXGR7Nn1cIixcIlxcXFxkezd9KD86XFxcXGR7M30pP1wiLG51bGwsbnVsbCxcIjIwMTU1NTU1NTVcIl0sW251bGwsbnVsbCxcIig/OjIoPzowWzEtMzUtOV18MVswMi05XXwyWzA0NTg5XXwzWzE0OV18NFswOF18NVsxLTQ2XXw2WzAyNzldfDdbMDI2XXw4WzEzXSl8Myg/OjBbMS01Ny05XXwxWzAyLTldfDJbMDEzNV18M1swMTQ2NzldfDRbNjddfDVbMTJdfDZbMDE0XXw4WzA1Nl0pfDQoPzowWzEyNC05XXwxWzAyLTU3OV18MlszLTVdfDNbMDI0NV18NFswMjM1XXw1OHw2OXw3WzA1ODldfDhbMDRdKXw1KD86MFsxLTU3LTldfDFbMDIzNS04XXwyMHwzWzAxNDldfDRbMDFdfDVbMTldfDZbMS0zN118N1swMTMtNV18OFswNTZdKXw2KD86MFsxLTM1LTldfDFbMDI0LTldfDJbMDM2ODldfDNbMDE2XXw0WzE2XXw1WzAxN118NlswLTI3OV18Nzh8OFsxMl0pfDcoPzowWzEtNDYtOF18MVswMi05XXwyWzA0NTddfDNbMTI0N118NFswMzddfDVbNDddfDZbMDIzNTldfDdbMDItNTldfDhbMTU2XSl8OCg/OjBbMS02OF18MVswMi04XXwyOHwzWzAtMjVdfDRbMzU3OF18NVswNDYtOV18NlswMi01XXw3WzAyOF0pfDkoPzowWzEzNDYtOV18MVswMi05XXwyWzA1ODldfDNbMDE2NzhdfDRbMDE3OV18NVsxMjQ2OV18N1swLTM1ODldfDhbMDQ1OV0pKVsyLTldXFxcXGR7Nn1cIixcIlxcXFxkezd9KD86XFxcXGR7M30pP1wiLG51bGwsbnVsbCxcIjIwMTU1NTU1NTVcIl0sW251bGwsbnVsbCxcIjgoPzowMHw0NHw1NXw2Nnw3N3w4OClbMi05XVxcXFxkezZ9XCIsXCJcXFxcZHsxMH1cIixudWxsLG51bGwsXCI4MDAyMzQ1Njc4XCJdLFtudWxsLG51bGwsXCI5MDBbMi05XVxcXFxkezZ9XCIsXCJcXFxcZHsxMH1cIixudWxsLG51bGwsXCI5MDAyMzQ1Njc4XCJdLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl0sW251bGwsbnVsbCxcIjUoPzowMHwzM3w0NHw2Nnw3N3w4OClbMi05XVxcXFxkezZ9XCIsXCJcXFxcZHsxMH1cIixudWxsLG51bGwsXCI1MDAyMzQ1Njc4XCJdLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl0sXCJVU1wiLDEsXCIwMTFcIixcIjFcIixudWxsLG51bGwsXCIxXCIsbnVsbCxudWxsLDEsW1tudWxsLFwiKFxcXFxkezN9KShcXFxcZHs0fSlcIixcIiQxLSQyXCIsbnVsbCxudWxsLG51bGwsMV0sW251bGwsXCIoXFxcXGR7M30pKFxcXFxkezN9KShcXFxcZHs0fSlcIixcIigkMSkgJDItJDNcIixudWxsLG51bGwsbnVsbCwxXV0sW1tudWxsLFwiKFxcXFxkezN9KShcXFxcZHszfSkoXFxcXGR7NH0pXCIsXCIkMS0kMi0kM1wiXV0sW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXSwxLG51bGwsW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXSxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdLG51bGwsbnVsbCxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdXX07eC5iPWZ1bmN0aW9uKCl7cmV0dXJuIHguYT94LmE6eC5hPW5ldyB4fTt2YXIgbnQ9ezA6XCIwXCIsMTpcIjFcIiwyOlwiMlwiLDM6XCIzXCIsNDpcIjRcIiw1OlwiNVwiLDY6XCI2XCIsNzpcIjdcIiw4OlwiOFwiLDk6XCI5XCIsXCLvvJBcIjpcIjBcIixcIu+8kVwiOlwiMVwiLFwi77ySXCI6XCIyXCIsXCLvvJNcIjpcIjNcIixcIu+8lFwiOlwiNFwiLFwi77yVXCI6XCI1XCIsXCLvvJZcIjpcIjZcIixcIu+8l1wiOlwiN1wiLFwi77yYXCI6XCI4XCIsXCLvvJlcIjpcIjlcIixcItmgXCI6XCIwXCIsXCLZoVwiOlwiMVwiLFwi2aJcIjpcIjJcIixcItmjXCI6XCIzXCIsXCLZpFwiOlwiNFwiLFwi2aVcIjpcIjVcIixcItmmXCI6XCI2XCIsXCLZp1wiOlwiN1wiLFwi2ahcIjpcIjhcIixcItmpXCI6XCI5XCIsXCLbsFwiOlwiMFwiLFwi27FcIjpcIjFcIixcItuyXCI6XCIyXCIsXCLbs1wiOlwiM1wiLFwi27RcIjpcIjRcIixcItu1XCI6XCI1XCIsXCLbtlwiOlwiNlwiLFwi27dcIjpcIjdcIixcItu4XCI6XCI4XCIsXCLbuVwiOlwiOVwifSxldD1SZWdFeHAoXCJbK++8i10rXCIpLHJ0PVJlZ0V4cChcIihbMC0577yQLe+8mdmgLdmp27At27ldKVwiKSxpdD0vXlxcKD9cXCQxXFwpPyQvLGF0PW5ldyBfO20oYXQsMTEsXCJOQVwiKTt2YXIgbHQ9L1xcWyhbXlxcW1xcXV0pKlxcXS9nLG90PS9cXGQoPz1bXix9XVteLH1dKS9nLHV0PVJlZ0V4cChcIl5bLXjigJAt4oCV4oiS44O877yNLe+8jyDCoMKt4oCL4oGg44CAKCnvvIjvvInvvLvvvL0uXFxcXFtcXFxcXS9+4oGT4oi8772eXSooXFxcXCRcXFxcZFsteOKAkC3igJXiiJLjg7zvvI0t77yPIMKgwq3igIvigaDjgIAoKe+8iO+8ie+8u++8vS5cXFxcW1xcXFxdL37igZPiiLzvvZ5dKikrJFwiKSxzdD0vWy0gXS87JC5wcm90b3R5cGUuSz1mdW5jdGlvbigpe3RoaXMuQj1cIlwiLHIodGhpcy5oKSxyKHRoaXMudSkscih0aGlzLm0pLHRoaXMucz0wLHRoaXMudj1cIlwiLHIodGhpcy5iKSx0aGlzLmw9XCJcIixyKHRoaXMuYSksdGhpcy5qPSEwLHRoaXMudz10aGlzLm89dGhpcy5EPSExLHRoaXMuZj1bXSx0aGlzLkE9ITEsdGhpcy5nIT10aGlzLkomJih0aGlzLmc9Qyh0aGlzLHRoaXMuQykpfSwkLnByb3RvdHlwZS5MPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLkI9Uih0aGlzLHQpfSx0KFwiQ2xlYXZlLkFzWW91VHlwZUZvcm1hdHRlclwiLCQpLHQoXCJDbGVhdmUuQXNZb3VUeXBlRm9ybWF0dGVyLnByb3RvdHlwZS5pbnB1dERpZ2l0XCIsJC5wcm90b3R5cGUuTCksdChcIkNsZWF2ZS5Bc1lvdVR5cGVGb3JtYXR0ZXIucHJvdG90eXBlLmNsZWFyXCIsJC5wcm90b3R5cGUuSyl9LmNhbGwoXCJvYmplY3RcIj09dHlwZW9mIGdsb2JhbCYmZ2xvYmFsP2dsb2JhbDp3aW5kb3cpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2NsZWF2ZS5qcy9kaXN0L2FkZG9ucy9jbGVhdmUtcGhvbmUudXMuanNcbi8vIG1vZHVsZSBpZCA9IDcyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1wic2NyZWVuLXNtYWxsXCI6Mzc1LFwic2NyZWVuLW1lZGl1bVwiOjcwMCxcInNjcmVlbi1sYXJnZVwiOjEwMjQsXCJzY3JlZW4teGxhcmdlXCI6MTIwMH1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92YXJpYWJsZXMuanNvblxuLy8gbW9kdWxlIGlkID0gNzNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gUmVzaXplIHJlQ0FQVENIQSB0byBmaXQgd2lkdGggb2YgY29udGFpbmVyXHJcbi8vIFNpbmNlIGl0IGhhcyBhIGZpeGVkIHdpZHRoLCB3ZSdyZSBzY2FsaW5nXHJcbi8vIHVzaW5nIENTUzMgdHJhbnNmb3Jtc1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gY2FwdGNoYVNjYWxlID0gY29udGFpbmVyV2lkdGggLyBlbGVtZW50V2lkdGhcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG4gIGZ1bmN0aW9uIHNjYWxlQ2FwdGNoYSgpIHtcclxuICAgIC8vIFdpZHRoIG9mIHRoZSByZUNBUFRDSEEgZWxlbWVudCwgaW4gcGl4ZWxzXHJcbiAgICB2YXIgcmVDYXB0Y2hhV2lkdGggPSAzMDQ7XHJcbiAgICAvLyBHZXQgdGhlIGNvbnRhaW5pbmcgZWxlbWVudCdzIHdpZHRoXHJcbiAgICB2YXIgY29udGFpbmVyV2lkdGggPSAkKCcuc21zLWZvcm0td3JhcHBlcicpLndpZHRoKCk7XHJcbiAgICBcclxuICAgIC8vIE9ubHkgc2NhbGUgdGhlIHJlQ0FQVENIQSBpZiBpdCB3b24ndCBmaXRcclxuICAgIC8vIGluc2lkZSB0aGUgY29udGFpbmVyXHJcbiAgICBpZihyZUNhcHRjaGFXaWR0aCA+IGNvbnRhaW5lcldpZHRoKSB7XHJcbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgc2NhbGVcclxuICAgICAgdmFyIGNhcHRjaGFTY2FsZSA9IGNvbnRhaW5lcldpZHRoIC8gcmVDYXB0Y2hhV2lkdGg7XHJcbiAgICAgIC8vIEFwcGx5IHRoZSB0cmFuc2Zvcm1hdGlvblxyXG4gICAgICAkKCcuZy1yZWNhcHRjaGEnKS5jc3Moe1xyXG4gICAgICAgIHRyYW5zZm9ybTonc2NhbGUoJytjYXB0Y2hhU2NhbGUrJyknXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJChmdW5jdGlvbigpIHtcclxuICAgIC8vIEluaXRpYWxpemUgc2NhbGluZ1xyXG4gICAgc2NhbGVDYXB0Y2hhKCk7XHJcbiAgfSk7XHJcblxyXG4gICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBVcGRhdGUgc2NhbGluZyBvbiB3aW5kb3cgcmVzaXplXHJcbiAgICAvLyBVc2VzIGpRdWVyeSB0aHJvdHRsZSBwbHVnaW4gdG8gbGltaXQgc3RyYWluIG9uIHRoZSBicm93c2VyXHJcbiAgICBzY2FsZUNhcHRjaGEoKTtcclxuICB9KTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2NhcHRjaGFSZXNpemUuanMiLCIvKipcbiogSG9tZSBSb3RhdGluZyBUZXh0IEFuaW1hdGlvblxuKiBSZWZlcnJlZCBmcm9tIFN0YWNrb3ZlcmZsb3dcbiogQHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNzcxNzg5L2NoYW5naW5nLXRleHQtcGVyaW9kaWNhbGx5LWluLWEtc3Bhbi1mcm9tLWFuLWFycmF5LXdpdGgtanF1ZXJ5LzI3NzIyNzgjMjc3MjI3OFxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciB0ZXJtcyA9IFtdO1xuXG4gICQoJy5yb3RhdGluZy10ZXh0X19lbnRyeScpLmVhY2goZnVuY3Rpb24gKGksIGUpIHtcbiAgICBpZiAoJChlKS50ZXh0KCkudHJpbSgpICE9PSAnJykge1xuICAgICAgdGVybXMucHVzaCgkKGUpLnRleHQoKSk7XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiByb3RhdGVUZXJtKCkge1xuICAgIHZhciBjdCA9ICQoXCIjcm90YXRlXCIpLmRhdGEoXCJ0ZXJtXCIpIHx8IDA7XG4gICAgJChcIiNyb3RhdGVcIikuZGF0YShcInRlcm1cIiwgY3QgPT09IHRlcm1zLmxlbmd0aCAtMSA/IDAgOiBjdCArIDEpLnRleHQodGVybXNbY3RdKS5mYWRlSW4oKS5kZWxheSgyMDAwKS5mYWRlT3V0KDIwMCwgcm90YXRlVGVybSk7XG4gIH1cbiAgJChyb3RhdGVUZXJtKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3JvdGF0aW5nVGV4dEFuaW1hdGlvbi5qcyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IE1pc3NQbGV0ZSBmcm9tICdtaXNzLXBsZXRlLWpzJztcblxuY2xhc3MgU2VhcmNoIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgbW9kdWxlXG4gICAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuX2lucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU2VhcmNoLnNlbGVjdG9ycy5NQUlOKTtcblxuICAgIGlmICghdGhpcy5faW5wdXRzKSByZXR1cm47XG5cbiAgICBmb3IgKGxldCBpID0gdGhpcy5faW5wdXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0aGlzLl9zdWdnZXN0aW9ucyh0aGlzLl9pbnB1dHNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgc3VnZ2VzdGVkIHNlYXJjaCB0ZXJtIGRyb3Bkb3duLlxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGlucHV0IFRoZSBzZWFyY2ggaW5wdXQuXG4gICAqL1xuICBfc3VnZ2VzdGlvbnMoaW5wdXQpIHtcbiAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoaW5wdXQuZGF0YXNldC5qc1NlYXJjaFN1Z2dlc3Rpb25zKTtcblxuICAgIGlucHV0Ll9NaXNzUGxldGUgPSBuZXcgTWlzc1BsZXRlKHtcbiAgICAgIGlucHV0OiBpbnB1dCxcbiAgICAgIG9wdGlvbnM6IGRhdGEsXG4gICAgICBjbGFzc05hbWU6IGlucHV0LmRhdGFzZXQuanNTZWFyY2hEcm9wZG93bkNsYXNzXG4gICAgfSk7XG4gIH1cbn1cblxuU2VhcmNoLnNlbGVjdG9ycyA9IHtcbiAgTUFJTjogJ1tkYXRhLWpzKj1cInNlYXJjaFwiXSdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNlYXJjaDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9zZWFyY2guanMiLCIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJNaXNzUGxldGVcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTWlzc1BsZXRlXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXG5cbi8qKiovIH0pLFxuLyogMSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0dmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblx0XG5cdHZhciBfamFyb1dpbmtsZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xuXHRcblx0dmFyIF9qYXJvV2lua2xlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9qYXJvV2lua2xlcik7XG5cdFxuXHR2YXIgX21lbW9pemUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpO1xuXHRcblx0dmFyIF9tZW1vaXplMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lbW9pemUpO1xuXHRcblx0ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblx0XG5cdGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cdFxuXHR2YXIgTWlzc1BsZXRlID0gZnVuY3Rpb24gKCkge1xuXHQgIGZ1bmN0aW9uIE1pc3NQbGV0ZShfcmVmKSB7XG5cdCAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXHRcblx0ICAgIHZhciBpbnB1dCA9IF9yZWYuaW5wdXQsXG5cdCAgICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucyxcblx0ICAgICAgICBjbGFzc05hbWUgPSBfcmVmLmNsYXNzTmFtZSxcblx0ICAgICAgICBfcmVmJHNjb3JlRm4gPSBfcmVmLnNjb3JlRm4sXG5cdCAgICAgICAgc2NvcmVGbiA9IF9yZWYkc2NvcmVGbiA9PT0gdW5kZWZpbmVkID8gKDAsIF9tZW1vaXplMi5kZWZhdWx0KShNaXNzUGxldGUuc2NvcmVGbikgOiBfcmVmJHNjb3JlRm4sXG5cdCAgICAgICAgX3JlZiRsaXN0SXRlbUZuID0gX3JlZi5saXN0SXRlbUZuLFxuXHQgICAgICAgIGxpc3RJdGVtRm4gPSBfcmVmJGxpc3RJdGVtRm4gPT09IHVuZGVmaW5lZCA/IE1pc3NQbGV0ZS5saXN0SXRlbUZuIDogX3JlZiRsaXN0SXRlbUZuO1xuXHRcblx0ICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNaXNzUGxldGUpO1xuXHRcblx0ICAgIE9iamVjdC5hc3NpZ24odGhpcywgeyBpbnB1dDogaW5wdXQsIG9wdGlvbnM6IG9wdGlvbnMsIGNsYXNzTmFtZTogY2xhc3NOYW1lLCBzY29yZUZuOiBzY29yZUZuLCBsaXN0SXRlbUZuOiBsaXN0SXRlbUZuIH0pO1xuXHRcblx0ICAgIHRoaXMuc2NvcmVkT3B0aW9ucyA9IG51bGw7XG5cdCAgICB0aGlzLmNvbnRhaW5lciA9IG51bGw7XG5cdCAgICB0aGlzLnVsID0gbnVsbDtcblx0ICAgIHRoaXMuaGlnaGxpZ2h0ZWRJbmRleCA9IC0xO1xuXHRcblx0ICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmIChfdGhpcy5pbnB1dC52YWx1ZS5sZW5ndGggPiAwKSB7XG5cdCAgICAgICAgX3RoaXMuc2NvcmVkT3B0aW9ucyA9IF90aGlzLm9wdGlvbnMubWFwKGZ1bmN0aW9uIChvcHRpb24pIHtcblx0ICAgICAgICAgIHJldHVybiBzY29yZUZuKF90aGlzLmlucHV0LnZhbHVlLCBvcHRpb24pO1xuXHQgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0ICAgICAgICAgIHJldHVybiBiLnNjb3JlIC0gYS5zY29yZTtcblx0ICAgICAgICB9KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBfdGhpcy5zY29yZWRPcHRpb25zID0gW107XG5cdCAgICAgIH1cblx0ICAgICAgX3RoaXMucmVuZGVyT3B0aW9ucygpO1xuXHQgICAgfSk7XG5cdFxuXHQgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdCAgICAgIGlmIChfdGhpcy51bCkge1xuXHQgICAgICAgIC8vIGRyb3Bkb3duIHZpc2libGU/XG5cdCAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG5cdCAgICAgICAgICBjYXNlIDEzOlxuXHQgICAgICAgICAgICBfdGhpcy5zZWxlY3QoKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICBjYXNlIDI3OlxuXHQgICAgICAgICAgICAvLyBFc2Ncblx0ICAgICAgICAgICAgX3RoaXMucmVtb3ZlRHJvcGRvd24oKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICBjYXNlIDQwOlxuXHQgICAgICAgICAgICAvLyBEb3duIGFycm93XG5cdCAgICAgICAgICAgIC8vIE90aGVyd2lzZSB1cCBhcnJvdyBwbGFjZXMgdGhlIGN1cnNvciBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZVxuXHQgICAgICAgICAgICAvLyBmaWVsZCwgYW5kIGRvd24gYXJyb3cgYXQgdGhlIGVuZFxuXHQgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgICAgICBfdGhpcy5jaGFuZ2VIaWdobGlnaHRlZE9wdGlvbihfdGhpcy5oaWdobGlnaHRlZEluZGV4IDwgX3RoaXMudWwuY2hpbGRyZW4ubGVuZ3RoIC0gMSA/IF90aGlzLmhpZ2hsaWdodGVkSW5kZXggKyAxIDogLTEpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgMzg6XG5cdCAgICAgICAgICAgIC8vIFVwIGFycm93XG5cdCAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgIF90aGlzLmNoYW5nZUhpZ2hsaWdodGVkT3B0aW9uKF90aGlzLmhpZ2hsaWdodGVkSW5kZXggPiAtMSA/IF90aGlzLmhpZ2hsaWdodGVkSW5kZXggLSAxIDogX3RoaXMudWwuY2hpbGRyZW4ubGVuZ3RoIC0gMSk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdFxuXHQgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdCAgICAgIF90aGlzLnJlbW92ZURyb3Bkb3duKCk7XG5cdCAgICAgIF90aGlzLmhpZ2hsaWdodGVkSW5kZXggPSAtMTtcblx0ICAgIH0pO1xuXHQgIH0gLy8gZW5kIGNvbnN0cnVjdG9yXG5cdFxuXHQgIF9jcmVhdGVDbGFzcyhNaXNzUGxldGUsIFt7XG5cdCAgICBrZXk6ICdnZXRTaWJsaW5nSW5kZXgnLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFNpYmxpbmdJbmRleChub2RlKSB7XG5cdCAgICAgIHZhciBpbmRleCA9IC0xO1xuXHQgICAgICB2YXIgbiA9IG5vZGU7XG5cdCAgICAgIGRvIHtcblx0ICAgICAgICBpbmRleCsrO1xuXHQgICAgICAgIG4gPSBuLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdCAgICAgIH0gd2hpbGUgKG4pO1xuXHQgICAgICByZXR1cm4gaW5kZXg7XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAncmVuZGVyT3B0aW9ucycsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyT3B0aW9ucygpIHtcblx0ICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cdFxuXHQgICAgICB2YXIgZG9jdW1lbnRGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XG5cdCAgICAgIHRoaXMuc2NvcmVkT3B0aW9ucy5ldmVyeShmdW5jdGlvbiAoc2NvcmVkT3B0aW9uLCBpKSB7XG5cdCAgICAgICAgdmFyIGxpc3RJdGVtID0gX3RoaXMyLmxpc3RJdGVtRm4oc2NvcmVkT3B0aW9uLCBpKTtcblx0ICAgICAgICBsaXN0SXRlbSAmJiBkb2N1bWVudEZyYWdtZW50LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcblx0ICAgICAgICByZXR1cm4gISFsaXN0SXRlbTtcblx0ICAgICAgfSk7XG5cdFxuXHQgICAgICB0aGlzLnJlbW92ZURyb3Bkb3duKCk7XG5cdCAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRJbmRleCA9IC0xO1xuXHRcblx0ICAgICAgaWYgKGRvY3VtZW50RnJhZ21lbnQuaGFzQ2hpbGROb2RlcygpKSB7XG5cdCAgICAgICAgdmFyIG5ld1VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuXHQgICAgICAgIG5ld1VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lID09PSAnTEknKSB7XG5cdCAgICAgICAgICAgIF90aGlzMi5jaGFuZ2VIaWdobGlnaHRlZE9wdGlvbihfdGhpczIuZ2V0U2libGluZ0luZGV4KGV2ZW50LnRhcmdldCkpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXHRcblx0ICAgICAgICBuZXdVbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgX3RoaXMyLmNoYW5nZUhpZ2hsaWdodGVkT3B0aW9uKC0xKTtcblx0ICAgICAgICB9KTtcblx0XG5cdCAgICAgICAgbmV3VWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdCAgICAgICAgICByZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgICB9KTtcblx0XG5cdCAgICAgICAgbmV3VWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgICAgIGlmIChldmVudC50YXJnZXQudGFnTmFtZSA9PT0gJ0xJJykge1xuXHQgICAgICAgICAgICBfdGhpczIuc2VsZWN0KCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdFxuXHQgICAgICAgIG5ld1VsLmFwcGVuZENoaWxkKGRvY3VtZW50RnJhZ21lbnQpO1xuXHRcblx0ICAgICAgICAvLyBTZWUgQ1NTIHRvIHVuZGVyc3RhbmQgd2h5IHRoZSA8dWw+IGhhcyB0byBiZSB3cmFwcGVkIGluIGEgPGRpdj5cblx0ICAgICAgICB2YXIgbmV3Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0ICAgICAgICBuZXdDb250YWluZXIuY2xhc3NOYW1lID0gdGhpcy5jbGFzc05hbWU7XG5cdCAgICAgICAgbmV3Q29udGFpbmVyLmFwcGVuZENoaWxkKG5ld1VsKTtcblx0XG5cdCAgICAgICAgLy8gSW5zZXJ0cyB0aGUgZHJvcGRvd24ganVzdCBhZnRlciB0aGUgPGlucHV0PiBlbGVtZW50XG5cdCAgICAgICAgdGhpcy5pbnB1dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdDb250YWluZXIsIHRoaXMuaW5wdXQubmV4dFNpYmxpbmcpO1xuXHQgICAgICAgIHRoaXMuY29udGFpbmVyID0gbmV3Q29udGFpbmVyO1xuXHQgICAgICAgIHRoaXMudWwgPSBuZXdVbDtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ2NoYW5nZUhpZ2hsaWdodGVkT3B0aW9uJyxcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiBjaGFuZ2VIaWdobGlnaHRlZE9wdGlvbihuZXdIaWdobGlnaHRlZEluZGV4KSB7XG5cdCAgICAgIGlmIChuZXdIaWdobGlnaHRlZEluZGV4ID49IC0xICYmIG5ld0hpZ2hsaWdodGVkSW5kZXggPCB0aGlzLnVsLmNoaWxkcmVuLmxlbmd0aCkge1xuXHQgICAgICAgIC8vIElmIGFueSBvcHRpb24gYWxyZWFkeSBzZWxlY3RlZCwgdGhlbiB1bnNlbGVjdCBpdFxuXHQgICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodGVkSW5kZXggIT09IC0xKSB7XG5cdCAgICAgICAgICB0aGlzLnVsLmNoaWxkcmVuW3RoaXMuaGlnaGxpZ2h0ZWRJbmRleF0uY2xhc3NMaXN0LnJlbW92ZShcImhpZ2hsaWdodFwiKTtcblx0ICAgICAgICB9XG5cdFxuXHQgICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRJbmRleCA9IG5ld0hpZ2hsaWdodGVkSW5kZXg7XG5cdFxuXHQgICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodGVkSW5kZXggIT09IC0xKSB7XG5cdCAgICAgICAgICB0aGlzLnVsLmNoaWxkcmVuW3RoaXMuaGlnaGxpZ2h0ZWRJbmRleF0uY2xhc3NMaXN0LmFkZChcImhpZ2hsaWdodFwiKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LCB7XG5cdCAgICBrZXk6ICdzZWxlY3QnLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIHNlbGVjdCgpIHtcblx0ICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0ZWRJbmRleCAhPT0gLTEpIHtcblx0ICAgICAgICB0aGlzLmlucHV0LnZhbHVlID0gdGhpcy5zY29yZWRPcHRpb25zW3RoaXMuaGlnaGxpZ2h0ZWRJbmRleF0uZGlzcGxheVZhbHVlO1xuXHQgICAgICAgIHRoaXMucmVtb3ZlRHJvcGRvd24oKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ3JlbW92ZURyb3Bkb3duJyxcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVEcm9wZG93bigpIHtcblx0ICAgICAgdGhpcy5jb250YWluZXIgJiYgdGhpcy5jb250YWluZXIucmVtb3ZlKCk7XG5cdCAgICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcblx0ICAgICAgdGhpcy51bCA9IG51bGw7XG5cdCAgICB9XG5cdCAgfV0sIFt7XG5cdCAgICBrZXk6ICdzY29yZUZuJyxcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiBzY29yZUZuKGlucHV0VmFsdWUsIG9wdGlvblN5bm9ueW1zKSB7XG5cdCAgICAgIHZhciBjbG9zZXN0U3lub255bSA9IG51bGw7XG5cdCAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZTtcblx0ICAgICAgdmFyIF9kaWRJdGVyYXRvckVycm9yID0gZmFsc2U7XG5cdCAgICAgIHZhciBfaXRlcmF0b3JFcnJvciA9IHVuZGVmaW5lZDtcblx0XG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gb3B0aW9uU3lub255bXNbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDsgIShfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gKF9zdGVwID0gX2l0ZXJhdG9yLm5leHQoKSkuZG9uZSk7IF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlKSB7XG5cdCAgICAgICAgICB2YXIgc3lub255bSA9IF9zdGVwLnZhbHVlO1xuXHRcblx0ICAgICAgICAgIHZhciBzaW1pbGFyaXR5ID0gKDAsIF9qYXJvV2lua2xlcjIuZGVmYXVsdCkoc3lub255bS50cmltKCkudG9Mb3dlckNhc2UoKSwgaW5wdXRWYWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKSk7XG5cdCAgICAgICAgICBpZiAoY2xvc2VzdFN5bm9ueW0gPT09IG51bGwgfHwgc2ltaWxhcml0eSA+IGNsb3Nlc3RTeW5vbnltLnNpbWlsYXJpdHkpIHtcblx0ICAgICAgICAgICAgY2xvc2VzdFN5bm9ueW0gPSB7IHNpbWlsYXJpdHk6IHNpbWlsYXJpdHksIHZhbHVlOiBzeW5vbnltIH07XG5cdCAgICAgICAgICAgIGlmIChzaW1pbGFyaXR5ID09PSAxKSB7XG5cdCAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH0gY2F0Y2ggKGVycikge1xuXHQgICAgICAgIF9kaWRJdGVyYXRvckVycm9yID0gdHJ1ZTtcblx0ICAgICAgICBfaXRlcmF0b3JFcnJvciA9IGVycjtcblx0ICAgICAgfSBmaW5hbGx5IHtcblx0ICAgICAgICB0cnkge1xuXHQgICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uICYmIF9pdGVyYXRvci5yZXR1cm4pIHtcblx0ICAgICAgICAgICAgX2l0ZXJhdG9yLnJldHVybigpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0gZmluYWxseSB7XG5cdCAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3IpIHtcblx0ICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdFxuXHQgICAgICByZXR1cm4ge1xuXHQgICAgICAgIHNjb3JlOiBjbG9zZXN0U3lub255bS5zaW1pbGFyaXR5LFxuXHQgICAgICAgIGRpc3BsYXlWYWx1ZTogb3B0aW9uU3lub255bXNbMF1cblx0ICAgICAgfTtcblx0ICAgIH1cblx0ICB9LCB7XG5cdCAgICBrZXk6ICdsaXN0SXRlbUZuJyxcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0SXRlbUZuKHNjb3JlZE9wdGlvbiwgaXRlbUluZGV4KSB7XG5cdCAgICAgIHZhciBsaSA9IGl0ZW1JbmRleCA+IE1pc3NQbGV0ZS5NQVhfSVRFTVMgPyBudWxsIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuXHQgICAgICBsaSAmJiBsaS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzY29yZWRPcHRpb24uZGlzcGxheVZhbHVlKSk7XG5cdCAgICAgIHJldHVybiBsaTtcblx0ICAgIH1cblx0ICB9LCB7XG5cdCAgICBrZXk6ICdNQVhfSVRFTVMnLFxuXHQgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdCAgICAgIHJldHVybiA4O1xuXHQgICAgfVxuXHQgIH1dKTtcblx0XG5cdCAgcmV0dXJuIE1pc3NQbGV0ZTtcblx0fSgpO1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gTWlzc1BsZXRlO1xuXG4vKioqLyB9KSxcbi8qIDIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0dmFyIF9zbGljZWRUb0FycmF5ID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9IHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgcmV0dXJuIGFycjsgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpIHsgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTsgfSBlbHNlIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH0gfTsgfSgpO1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHMxLCBzMikge1xuXHQgIHZhciBwcmVmaXhTY2FsaW5nRmFjdG9yID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAwLjI7XG5cdFxuXHQgIHZhciBqYXJvU2ltaWxhcml0eSA9IGphcm8oczEsIHMyKTtcblx0XG5cdCAgdmFyIGNvbW1vblByZWZpeExlbmd0aCA9IDA7XG5cdCAgZm9yICh2YXIgaSA9IDA7IGkgPCBzMS5sZW5ndGg7IGkrKykge1xuXHQgICAgaWYgKHMxW2ldID09PSBzMltpXSkge1xuXHQgICAgICBjb21tb25QcmVmaXhMZW5ndGgrKztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuIGphcm9TaW1pbGFyaXR5ICsgTWF0aC5taW4oY29tbW9uUHJlZml4TGVuZ3RoLCA0KSAqIHByZWZpeFNjYWxpbmdGYWN0b3IgKiAoMSAtIGphcm9TaW1pbGFyaXR5KTtcblx0fTtcblx0XG5cdC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0phcm8lRTIlODAlOTNXaW5rbGVyX2Rpc3RhbmNlXG5cdFxuXHRmdW5jdGlvbiBqYXJvKHMxLCBzMikge1xuXHQgIHZhciBzaG9ydGVyID0gdm9pZCAwLFxuXHQgICAgICBsb25nZXIgPSB2b2lkIDA7XG5cdFxuXHQgIHZhciBfcmVmID0gczEubGVuZ3RoID4gczIubGVuZ3RoID8gW3MxLCBzMl0gOiBbczIsIHMxXTtcblx0XG5cdCAgdmFyIF9yZWYyID0gX3NsaWNlZFRvQXJyYXkoX3JlZiwgMik7XG5cdFxuXHQgIGxvbmdlciA9IF9yZWYyWzBdO1xuXHQgIHNob3J0ZXIgPSBfcmVmMlsxXTtcblx0XG5cdFxuXHQgIHZhciBtYXRjaGluZ1dpbmRvdyA9IE1hdGguZmxvb3IobG9uZ2VyLmxlbmd0aCAvIDIpIC0gMTtcblx0ICB2YXIgc2hvcnRlck1hdGNoZXMgPSBbXTtcblx0ICB2YXIgbG9uZ2VyTWF0Y2hlcyA9IFtdO1xuXHRcblx0ICBmb3IgKHZhciBpID0gMDsgaSA8IHNob3J0ZXIubGVuZ3RoOyBpKyspIHtcblx0ICAgIHZhciBjaCA9IHNob3J0ZXJbaV07XG5cdCAgICB2YXIgd2luZG93U3RhcnQgPSBNYXRoLm1heCgwLCBpIC0gbWF0Y2hpbmdXaW5kb3cpO1xuXHQgICAgdmFyIHdpbmRvd0VuZCA9IE1hdGgubWluKGkgKyBtYXRjaGluZ1dpbmRvdyArIDEsIGxvbmdlci5sZW5ndGgpO1xuXHQgICAgZm9yICh2YXIgaiA9IHdpbmRvd1N0YXJ0OyBqIDwgd2luZG93RW5kOyBqKyspIHtcblx0ICAgICAgaWYgKGxvbmdlck1hdGNoZXNbal0gPT09IHVuZGVmaW5lZCAmJiBjaCA9PT0gbG9uZ2VyW2pdKSB7XG5cdCAgICAgICAgc2hvcnRlck1hdGNoZXNbaV0gPSBsb25nZXJNYXRjaGVzW2pdID0gY2g7XG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHZhciBzaG9ydGVyTWF0Y2hlc1N0cmluZyA9IHNob3J0ZXJNYXRjaGVzLmpvaW4oXCJcIik7XG5cdCAgdmFyIGxvbmdlck1hdGNoZXNTdHJpbmcgPSBsb25nZXJNYXRjaGVzLmpvaW4oXCJcIik7XG5cdCAgdmFyIG51bU1hdGNoZXMgPSBzaG9ydGVyTWF0Y2hlc1N0cmluZy5sZW5ndGg7XG5cdFxuXHQgIHZhciB0cmFuc3Bvc2l0aW9ucyA9IDA7XG5cdCAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHNob3J0ZXJNYXRjaGVzU3RyaW5nLmxlbmd0aDsgX2krKykge1xuXHQgICAgaWYgKHNob3J0ZXJNYXRjaGVzU3RyaW5nW19pXSAhPT0gbG9uZ2VyTWF0Y2hlc1N0cmluZ1tfaV0pIHtcblx0ICAgICAgdHJhbnNwb3NpdGlvbnMrKztcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHJldHVybiBudW1NYXRjaGVzID4gMCA/IChudW1NYXRjaGVzIC8gc2hvcnRlci5sZW5ndGggKyBudW1NYXRjaGVzIC8gbG9uZ2VyLmxlbmd0aCArIChudW1NYXRjaGVzIC0gTWF0aC5mbG9vcih0cmFuc3Bvc2l0aW9ucyAvIDIpKSAvIG51bU1hdGNoZXMpIC8gMy4wIDogMDtcblx0fVxuXG4vKioqLyB9KSxcbi8qIDMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHQgIHZhbHVlOiB0cnVlXG5cdH0pO1xuXHRcblx0ZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGZuKSB7XG5cdCAgdmFyIGNhY2hlID0ge307XG5cdFxuXHQgIHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdCAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuXHQgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHQgICAgfVxuXHRcblx0ICAgIHZhciBrZXkgPSBKU09OLnN0cmluZ2lmeShhcmdzKTtcblx0ICAgIHJldHVybiBjYWNoZVtrZXldIHx8IChjYWNoZVtrZXldID0gZm4uYXBwbHkobnVsbCwgYXJncykpO1xuXHQgIH07XG5cdH07XG5cbi8qKiovIH0pXG4vKioqKioqLyBdKVxufSk7XG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idW5kbGUuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbWlzcy1wbGV0ZS1qcy9kaXN0L2J1bmRsZS5qc1xuLy8gbW9kdWxlIGlkID0gNzdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUb2dnbGVPcGVuIG1vZHVsZVxuICogQG1vZHVsZSBtb2R1bGVzL3RvZ2dsZU9wZW5cbiAqL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5pbXBvcnQgZGF0YXNldCBmcm9tICcuL2RhdGFzZXQuanMnO1xuXG4vKipcbiAqIFRvZ2dsZXMgYW4gZWxlbWVudCBvcGVuL2Nsb3NlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcGVuQ2xhc3MgLSBUaGUgY2xhc3MgdG8gdG9nZ2xlIG9uL29mZlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcGVuQ2xhc3MpIHtcbiAgaWYgKCFvcGVuQ2xhc3MpIG9wZW5DbGFzcyA9ICdpcy1vcGVuJztcblxuICBjb25zdCBsaW5rQWN0aXZlQ2xhc3MgPSAnaXMtYWN0aXZlJztcbiAgY29uc3QgdG9nZ2xlRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10b2dnbGVdJyk7XG5cbiAgaWYgKCF0b2dnbGVFbGVtcykgcmV0dXJuO1xuXG4gIC8qKlxuICAqIEZvciBlYWNoIHRvZ2dsZSBlbGVtZW50LCBnZXQgaXRzIHRhcmdldCBmcm9tIHRoZSBkYXRhLXRvZ2dsZSBhdHRyaWJ1dGUuXG4gICogQmluZCBhbiBldmVudCBoYW5kbGVyIHRvIHRvZ2dsZSB0aGUgb3BlbkNsYXNzIG9uL29mZiBvbiB0aGUgdGFyZ2V0IGVsZW1lbnRcbiAgKiB3aGVuIHRoZSB0b2dnbGUgZWxlbWVudCBpcyBjbGlja2VkLlxuICAqL1xuICBmb3JFYWNoKHRvZ2dsZUVsZW1zLCBmdW5jdGlvbih0b2dnbGVFbGVtKSB7XG4gICAgY29uc3QgdGFyZ2V0RWxlbVNlbGVjdG9yID0gZGF0YXNldCh0b2dnbGVFbGVtLCAndG9nZ2xlJyk7XG5cbiAgICBpZiAoIXRhcmdldEVsZW1TZWxlY3RvcikgcmV0dXJuO1xuXG4gICAgY29uc3QgdGFyZ2V0RWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEVsZW1TZWxlY3Rvcik7XG5cbiAgICBpZiAoIXRhcmdldEVsZW0pIHJldHVybjtcblxuICAgIHRvZ2dsZUVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgbGV0IHRvZ2dsZUV2ZW50O1xuICAgICAgbGV0IHRvZ2dsZUNsYXNzID0gKHRvZ2dsZUVsZW0uZGF0YXNldC50b2dnbGVDbGFzcykgP1xuICAgICAgICB0b2dnbGVFbGVtLmRhdGFzZXQudG9nZ2xlQ2xhc3MgOiBvcGVuQ2xhc3M7XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIC8vIFRvZ2dsZSB0aGUgZWxlbWVudCdzIGFjdGl2ZSBjbGFzc1xuICAgICAgdG9nZ2xlRWxlbS5jbGFzc0xpc3QudG9nZ2xlKGxpbmtBY3RpdmVDbGFzcyk7XG5cbiAgICAgIC8vIFRvZ2dsZSBjdXN0b20gY2xhc3MgaWYgaXQgaXMgc2V0XG4gICAgICBpZiAodG9nZ2xlQ2xhc3MgIT09IG9wZW5DbGFzcylcbiAgICAgICAgdGFyZ2V0RWxlbS5jbGFzc0xpc3QudG9nZ2xlKHRvZ2dsZUNsYXNzKTtcblxuICAgICAgLy8gVG9nZ2xlIHRoZSBkZWZhdWx0IG9wZW4gY2xhc3NcbiAgICAgIHRhcmdldEVsZW0uY2xhc3NMaXN0LnRvZ2dsZShvcGVuQ2xhc3MpO1xuXG4gICAgICAvLyBUb2dnbGUgdGhlIGFwcHJvcHJpYXRlIGFyaWEgaGlkZGVuIGF0dHJpYnV0ZVxuICAgICAgdGFyZ2V0RWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyxcbiAgICAgICAgISh0YXJnZXRFbGVtLmNsYXNzTGlzdC5jb250YWlucyh0b2dnbGVDbGFzcykpXG4gICAgICApO1xuXG4gICAgICAvLyBGaXJlIHRoZSBjdXN0b20gb3BlbiBzdGF0ZSBldmVudCB0byB0cmlnZ2VyIG9wZW4gZnVuY3Rpb25zXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0b2dnbGVFdmVudCA9IG5ldyBDdXN0b21FdmVudCgnY2hhbmdlT3BlblN0YXRlJywge1xuICAgICAgICAgIGRldGFpbDogdGFyZ2V0RWxlbS5jbGFzc0xpc3QuY29udGFpbnMob3BlbkNsYXNzKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvZ2dsZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICAgIHRvZ2dsZUV2ZW50LmluaXRDdXN0b21FdmVudCgnY2hhbmdlT3BlblN0YXRlJywgdHJ1ZSwgdHJ1ZSwge1xuICAgICAgICAgIGRldGFpbDogdGFyZ2V0RWxlbS5jbGFzc0xpc3QuY29udGFpbnMob3BlbkNsYXNzKVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGFyZ2V0RWxlbS5kaXNwYXRjaEV2ZW50KHRvZ2dsZUV2ZW50KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy90b2dnbGVPcGVuLmpzIiwiLyogZXNsaW50LWVudiBicm93c2VyICovXG5pbXBvcnQgalF1ZXJ5IGZyb20gJ2pxdWVyeSc7XG5cbihmdW5jdGlvbih3aW5kb3csICQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEF0dGFjaCBzaXRlLXdpZGUgZXZlbnQgbGlzdGVuZXJzLlxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1zaW1wbGUtdG9nZ2xlJywgZSA9PiB7XG4gICAgLy8gU2ltcGxlIHRvZ2dsZSB0aGF0IGFkZC9yZW1vdmVzIFwiYWN0aXZlXCIgYW5kIFwiaGlkZGVuXCIgY2xhc3NlcywgYXMgd2VsbCBhc1xuICAgIC8vIGFwcGx5aW5nIGFwcHJvcHJpYXRlIGFyaWEtaGlkZGVuIHZhbHVlIHRvIGEgc3BlY2lmaWVkIHRhcmdldC5cbiAgICAvLyBUT0RPOiBUaGVyZSBhcmUgYSBmZXcgc2ltbGFyIHRvZ2dsZXMgb24gdGhlIHNpdGUgdGhhdCBjb3VsZCBiZVxuICAgIC8vIHJlZmFjdG9yZWQgdG8gdXNlIHRoaXMgY2xhc3MuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0ICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpID9cbiAgICAgICAgJCgkKGUuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpKSA6XG4gICAgICAgICQoJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ3RhcmdldCcpKTtcbiAgICAkKGUuY3VycmVudFRhcmdldCkudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICR0YXJnZXQudG9nZ2xlQ2xhc3MoJ2FjdGl2ZSBoaWRkZW4nKVxuICAgICAgICAucHJvcCgnYXJpYS1oaWRkZW4nLCAkdGFyZ2V0Lmhhc0NsYXNzKCdoaWRkZW4nKSk7XG4gIH0pLm9uKCdjbGljaycsICcuanMtc2hvdy1uYXYnLCBlID0+IHtcbiAgICAvLyBTaG93cyB0aGUgbW9iaWxlIG5hdiBieSBhcHBseWluZyBcIm5hdi1hY3RpdmVcIiBjYXNzIHRvIHRoZSBib2R5LlxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAkKGUuZGVsZWdhdGVUYXJnZXQpLmFkZENsYXNzKCduYXYtYWN0aXZlJyk7XG4gICAgJCgnLm5hdi1vdmVybGF5Jykuc2hvdygpO1xuICB9KS5vbignY2xpY2snLCAnLmpzLWhpZGUtbmF2JywgZSA9PiB7XG4gICAgLy8gSGlkZXMgdGhlIG1vYmlsZSBuYXYuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQoJy5uYXYtb3ZlcmxheScpLmhpZGUoKTtcbiAgICAkKGUuZGVsZWdhdGVUYXJnZXQpLnJlbW92ZUNsYXNzKCduYXYtYWN0aXZlJyk7XG4gIH0pO1xuICAvLyBFTkQgVE9ET1xuXG59KSh3aW5kb3csIGpRdWVyeSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy90b2dnbGVNZW51LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==
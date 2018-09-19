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

    var fields = form.find('form').serializeArray().reduce(function (obj, item) {
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
            form.html('<p class="text-center">Something went wrong. Try again later!</p>');
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
    var formClass = $(this).parents('form').parents('div').attr('class');
    var $form = $('.' + formClass.replace(/ /g, '.'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDU3ZGNiMzhlYjk2YjgzYzNiNDgiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwialF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mb3JFYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZGF0YXNldC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tYWluLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2FjY29yZGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvck93bi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VGb3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNQcm90b3R5cGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRWFjaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0RnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9zaW1wbGVBY2NvcmRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvb2ZmY2FudmFzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL292ZXJsYXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc3RpY2tOYXYuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90aHJvdHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL25vdy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTeW1ib2wuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ltYWdlc3JlYWR5L2Rpc3QvaW1hZ2VzcmVhZHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc2VjdGlvbkhpZ2hsaWdodGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3N0YXRpY0NvbHVtbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9hbGVydC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9yZWFkQ29va2llLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2NyZWF0ZUNvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9nZXREb21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvbmV3c2xldHRlci1zaWdudXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZGF0YS96aXBjb2Rlcy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2RhdGEvZm9ybS1lcnJvcnMuanNvbiIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9mb3JtRWZmZWN0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9kaXNwYXRjaEV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2ZhY2V0cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9vd2xTZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9pT1M3SGFjay5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9zaGFyZS1mb3JtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9qcy1jb29raWUvc3JjL2pzLmNvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdmVuZG9yL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NsZWF2ZS5qcy9kaXN0L2NsZWF2ZS5taW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NsZWF2ZS5qcy9kaXN0L2FkZG9ucy9jbGVhdmUtcGhvbmUudXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZhcmlhYmxlcy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2NhcHRjaGFSZXNpemUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvcm90YXRpbmdUZXh0QW5pbWF0aW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3NlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWlzcy1wbGV0ZS1qcy9kaXN0L2J1bmRsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy90b2dnbGVPcGVuLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU1lbnUuanMiXSwibmFtZXMiOlsiZWxlbSIsImF0dHIiLCJkYXRhc2V0IiwiZ2V0QXR0cmlidXRlIiwicmVhZHkiLCJmbiIsImRvY3VtZW50IiwicmVhZHlTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJpbml0IiwidG9nZ2xlT3BlbiIsImFsZXJ0Iiwib2ZmY2FudmFzIiwiYWNjb3JkaW9uIiwic2ltcGxlQWNjb3JkaW9uIiwib3ZlcmxheSIsImZhY2V0cyIsInN0YXRpY0NvbHVtbiIsInN0aWNrTmF2IiwiZ3VueVNpZ251cCIsImZvcm1FZmZlY3RzIiwib3dsU2V0dGluZ3MiLCJpT1M3SGFjayIsImNhcHRjaGFSZXNpemUiLCJyb3RhdGluZ1RleHRBbmltYXRpb24iLCJzZWN0aW9uSGlnaGxpZ2h0ZXIiLCJ3aW5kb3ciLCIkIiwiU2hhcmVGb3JtIiwiQ3NzQ2xhc3MiLCJGT1JNIiwiZWFjaCIsImkiLCJlbCIsInNoYXJlRm9ybSIsImpRdWVyeSIsImNvbnZlcnRIZWFkZXJUb0J1dHRvbiIsIiRoZWFkZXJFbGVtIiwiZ2V0Iiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImhlYWRlckVsZW0iLCJuZXdIZWFkZXJFbGVtIiwiY3JlYXRlRWxlbWVudCIsImZvckVhY2giLCJhdHRyaWJ1dGVzIiwic2V0QXR0cmlidXRlIiwibm9kZVZhbHVlIiwiJG5ld0hlYWRlckVsZW0iLCJodG1sIiwiYXBwZW5kIiwidG9nZ2xlSGVhZGVyIiwibWFrZVZpc2libGUiLCJpbml0aWFsaXplSGVhZGVyIiwiJHJlbGF0ZWRQYW5lbCIsImlkIiwiYWRkQ2xhc3MiLCJvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJ0cmlnZ2VyIiwiYmx1ciIsInRvZ2dsZVBhbmVsIiwiJHBhbmVsRWxlbSIsImNzcyIsImRhdGEiLCJmaW5kIiwiaW5pdGlhbGl6ZVBhbmVsIiwibGFiZWxsZWRieSIsImNhbGN1bGF0ZVBhbmVsSGVpZ2h0IiwiaGVpZ2h0IiwidG9nZ2xlQWNjb3JkaW9uSXRlbSIsIiRpdGVtIiwicmVtb3ZlQ2xhc3MiLCJpbml0aWFsaXplQWNjb3JkaW9uSXRlbSIsIiRhY2NvcmRpb25Db250ZW50IiwiJGFjY29yZGlvbkluaXRpYWxIZWFkZXIiLCJvZmYiLCJsZW5ndGgiLCIkYWNjb3JkaW9uSGVhZGVyIiwidGFnTmFtZSIsInJlcGxhY2VXaXRoIiwiaW5pdGlhbGl6ZSIsIiRhY2NvcmRpb25FbGVtIiwibXVsdGlTZWxlY3RhYmxlIiwiY2hpbGRyZW4iLCJwcm94eSIsIiRuZXdJdGVtIiwidGFyZ2V0IiwiY2xvc2VzdCIsImhhc0NsYXNzIiwiJG9wZW5JdGVtIiwicmVJbml0aWFsaXplIiwicmVJbml0aWFsaXplQWNjb3JkaW9uIiwiJGFjY29yZGlvbnMiLCJub3QiLCJjbGljayIsImNoZWNrRWxlbWVudCIsIm5leHQiLCJpcyIsInNsaWRlVXAiLCJzbGlkZURvd24iLCJvZmZDYW52YXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwib2ZmQ2FudmFzRWxlbSIsIm9mZkNhbnZhc1NpZGUiLCJxdWVyeVNlbGVjdG9yIiwiZGV0YWlsIiwidGVzdCIsInRhYkluZGV4IiwiZm9jdXMiLCJvdmVybGF5RWxlbSIsInN0aWNreU5hdiIsIiRlbGVtIiwiJGVsZW1Db250YWluZXIiLCIkZWxlbUFydGljbGUiLCJzZXR0aW5ncyIsInN0aWNreUNsYXNzIiwiYWJzb2x1dGVDbGFzcyIsImxhcmdlQnJlYWtwb2ludCIsImFydGljbGVDbGFzcyIsInN0aWNreU1vZGUiLCJpc1N0aWNreSIsImlzQWJzb2x1dGUiLCJzd2l0Y2hQb2ludCIsInN3aXRjaFBvaW50Qm90dG9tIiwibGVmdE9mZnNldCIsImVsZW1XaWR0aCIsImVsZW1IZWlnaHQiLCJ0b2dnbGVTdGlja3kiLCJjdXJyZW50U2Nyb2xsUG9zIiwic2Nyb2xsVG9wIiwidXBkYXRlRGltZW5zaW9ucyIsImlzT25TY3JlZW4iLCJmb3JjZUNsZWFyIiwibGVmdCIsIndpZHRoIiwidG9wIiwiYm90dG9tIiwic2V0T2Zmc2V0VmFsdWVzIiwib2Zmc2V0Iiwib3V0ZXJIZWlnaHQiLCJwYXJzZUludCIsIm91dGVyV2lkdGgiLCJzdGlja3lNb2RlT24iLCJ0aHJvdHRsZSIsIm9yaWdpbmFsRXZlbnQiLCJzdGlja3lNb2RlT2ZmIiwib25SZXNpemUiLCJsYXJnZU1vZGUiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImRlYm91bmNlIiwiaW1hZ2VzUmVhZHkiLCJib2R5IiwidGhlbiIsIndpbiIsInZpZXdwb3J0Iiwic2Nyb2xsTGVmdCIsInJpZ2h0IiwiYm91bmRzIiwiJHN0aWNreU5hdnMiLCIkb3V0ZXJDb250YWluZXIiLCIkYXJ0aWNsZSIsIiRuYXZpZ2F0aW9uTGlua3MiLCIkc2VjdGlvbnMiLCIkc2VjdGlvbnNSZXZlcnNlZCIsInJldmVyc2UiLCJzZWN0aW9uSWRUb25hdmlnYXRpb25MaW5rIiwib3B0aW1pemVkIiwic2Nyb2xsUG9zaXRpb24iLCJjdXJyZW50U2VjdGlvbiIsInNlY3Rpb25Ub3AiLCIkbmF2aWdhdGlvbkxpbmsiLCJzY3JvbGwiLCJzdGlja3lDb250ZW50Iiwibm90U3RpY2t5Q2xhc3MiLCJib3R0b21DbGFzcyIsImNhbGNXaW5kb3dQb3MiLCJzdGlja3lDb250ZW50RWxlbSIsImVsZW1Ub3AiLCJwYXJlbnRFbGVtZW50IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiaXNQYXN0Qm90dG9tIiwiaW5uZXJIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJvcGVuQ2xhc3MiLCJkaXNwbGF5QWxlcnQiLCJzaWJsaW5nRWxlbSIsImFsZXJ0SGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiY3VycmVudFBhZGRpbmciLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInN0eWxlIiwicGFkZGluZ0JvdHRvbSIsInJlbW92ZUFsZXJ0UGFkZGluZyIsImNoZWNrQWxlcnRDb29raWUiLCJjb29raWVOYW1lIiwicmVhZENvb2tpZSIsImNvb2tpZSIsImFkZEFsZXJ0Q29va2llIiwiY3JlYXRlQ29va2llIiwiZ2V0RG9tYWluIiwibG9jYXRpb24iLCJhbGVydHMiLCJhbGVydFNpYmxpbmciLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwiUmVnRXhwIiwiZXhlYyIsInBvcCIsIm5hbWUiLCJ2YWx1ZSIsImRvbWFpbiIsImRheXMiLCJleHBpcmVzIiwiRGF0ZSIsImdldFRpbWUiLCJ0b0dNVFN0cmluZyIsInVybCIsInJvb3QiLCJwYXJzZVVybCIsImhyZWYiLCJob3N0bmFtZSIsInNsaWNlIiwibWF0Y2giLCJzcGxpdCIsImpvaW4iLCJlcnJvck1zZyIsInZhbGlkYXRlRmllbGRzIiwiZm9ybSIsImZpZWxkcyIsInNlcmlhbGl6ZUFycmF5IiwicmVkdWNlIiwib2JqIiwiaXRlbSIsInJlcXVpcmVkRmllbGRzIiwiZW1haWxSZWdleCIsInppcFJlZ2V4IiwicGhvbmVSZWdleCIsImdyb3VwU2VsZXRlZCIsIk9iamVjdCIsImtleXMiLCJhIiwiaW5jbHVkZXMiLCJoYXNFcnJvcnMiLCJmaWVsZE5hbWUiLCJwYXJlbnRzIiwiRU1BSUwiLCJaSVAiLCJQSE9ORU5VTSIsInNpYmxpbmdzIiwiZm9ybUVycm9ycyIsIngiLCJCT1JPVUdIIiwiYXNzaWduQm9yb3VnaCIsInN1Ym1pdFNpZ251cCIsInppcCIsImJvcm91Z2giLCJpbmRleCIsInppcGNvZGVzIiwiZmluZEluZGV4IiwiY29kZXMiLCJpbmRleE9mIiwiZm9ybURhdGEiLCJhamF4IiwidHlwZSIsImRhdGFUeXBlIiwiY2FjaGUiLCJjb250ZW50VHlwZSIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInJlc3VsdCIsImNsYXNzTmFtZSIsIm1zZyIsImVycm9yIiwiZm9ybUNsYXNzIiwiJGZvcm0iLCJyZXBsYWNlIiwia2V5dXAiLCJjaGFyTGVuIiwidmFsIiwidGV4dCIsImhhbmRsZUZvY3VzIiwid3JhcHBlckVsZW0iLCJwYXJlbnROb2RlIiwiaGFuZGxlQmx1ciIsInRyaW0iLCJpbnB1dHMiLCJpbnB1dEVsZW0iLCJkaXNwYXRjaEV2ZW50IiwiZXZlbnRUeXBlIiwiY3JlYXRlRXZlbnQiLCJpbml0RXZlbnQiLCJjcmVhdGVFdmVudE9iamVjdCIsImZpcmVFdmVudCIsIm93bCIsIm93bENhcm91c2VsIiwiYW5pbWF0ZUluIiwiYW5pbWF0ZU91dCIsIml0ZW1zIiwibG9vcCIsIm1hcmdpbiIsImRvdHMiLCJhdXRvcGxheSIsImF1dG9wbGF5VGltZW91dCIsImF1dG9wbGF5SG92ZXJQYXVzZSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInNjcm9sbFRvIiwiVmFyaWFibGVzIiwicmVxdWlyZSIsIl9lbCIsIl9pc1ZhbGlkIiwiX2lzQnVzeSIsIl9pc0Rpc2FibGVkIiwiX2luaXRpYWxpemVkIiwiX3JlY2FwdGNoYVJlcXVpcmVkIiwiX3JlY2FwdGNoYVZlcmlmaWVkIiwiX3JlY2FwdGNoYWluaXQiLCJzZWxlY3RlZCIsIl9tYXNrUGhvbmUiLCJTSE9XX0RJU0NMQUlNRVIiLCJfZGlzY2xhaW1lciIsImUiLCJfdmFsaWRhdGUiLCJfc3VibWl0IiwiZ3JlY2FwdGNoYSIsInJlc2V0IiwiRVJST1JfTVNHIiwiX3Nob3dFcnJvciIsIk1lc3NhZ2UiLCJSRUNBUFRDSEEiLCJ2aWV3Q291bnQiLCJDb29raWVzIiwiX2luaXRSZWNhcHRjaGEiLCJzZXQiLCJmb2N1c291dCIsInJlbW92ZUF0dHIiLCJpbnB1dCIsImNsZWF2ZSIsInBob25lIiwicGhvbmVSZWdpb25Db2RlIiwiZGVsaW1pdGVyIiwidmlzaWJsZSIsIiRlbCIsIiRjbGFzcyIsIkhJRERFTiIsIkFOSU1BVEVfRElTQ0xBSU1FUiIsImlubmVyV2lkdGgiLCIkdGFyZ2V0IiwidmFsaWRpdHkiLCIkdGVsIiwiX3ZhbGlkYXRlUGhvbmVOdW1iZXIiLCJFUlJPUiIsIm51bSIsIl9wYXJzZVBob25lTnVtYmVyIiwiUEhPTkUiLCJSRVFVSVJFRCIsIm9uZSIsIiRlbFBhcmVudHMiLCJVdGlsaXR5IiwibG9jYWxpemUiLCJTVUNDRVNTIiwiJHNwaW5uZXIiLCJTUElOTkVSIiwiJHN1Ym1pdCIsInBheWxvYWQiLCJzZXJpYWxpemUiLCJwcm9wIiwiZGlzYWJsZWQiLCJjc3NUZXh0IiwicG9zdCIsImRvbmUiLCJfc2hvd1N1Y2Nlc3MiLCJKU09OIiwic3RyaW5naWZ5IiwibWVzc2FnZSIsImZhaWwiLCJTRVJWRVIiLCJhbHdheXMiLCIkc2NyaXB0IiwiYXN5bmMiLCJkZWZlciIsInNjcmVlbmVyQ2FsbGJhY2siLCJyZW5kZXIiLCJnZXRFbGVtZW50QnlJZCIsInNjcmVlbmVyUmVjYXB0Y2hhIiwic2NyZWVuZXJSZWNhcHRjaGFSZXNldCIsIk5FRURTX0RJU0NMQUlNRVIiLCJTVUJNSVRfQlROIiwiZ2V0VXJsUGFyYW1ldGVyIiwicXVlcnlTdHJpbmciLCJxdWVyeSIsInNlYXJjaCIsInBhcmFtIiwicmVnZXgiLCJyZXN1bHRzIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZmluZFZhbHVlcyIsIm9iamVjdCIsInRhcmdldFByb3AiLCJ0cmF2ZXJzZU9iamVjdCIsImtleSIsImhhc093blByb3BlcnR5IiwicHVzaCIsInRvRG9sbGFyQW1vdW50IiwiTWF0aCIsImFicyIsInJvdW5kIiwicGFyc2VGbG9hdCIsInRvRml4ZWQiLCJzbHVnTmFtZSIsImxvY2FsaXplZFN0cmluZ3MiLCJMT0NBTElaRURfU1RSSU5HUyIsIl8iLCJmaW5kV2hlcmUiLCJzbHVnIiwibGFiZWwiLCJpc1ZhbGlkRW1haWwiLCJlbWFpbCIsImNoZWNrVmFsaWRpdHkiLCJDT05GSUciLCJERUZBVUxUX0xBVCIsIkRFRkFVTFRfTE5HIiwiR09PR0xFX0FQSSIsIkdPT0dMRV9TVEFUSUNfQVBJIiwiR1JFQ0FQVENIQV9TSVRFX0tFWSIsIlNDUkVFTkVSX01BWF9IT1VTRUhPTEQiLCJVUkxfUElOX0JMVUUiLCJVUkxfUElOX0JMVUVfMlgiLCJVUkxfUElOX0dSRUVOIiwiVVJMX1BJTl9HUkVFTl8yWCIsInNjYWxlQ2FwdGNoYSIsInJlQ2FwdGNoYVdpZHRoIiwiY29udGFpbmVyV2lkdGgiLCJjYXB0Y2hhU2NhbGUiLCJ0cmFuc2Zvcm0iLCJyZXNpemUiLCJ0ZXJtcyIsInJvdGF0ZVRlcm0iLCJjdCIsImZhZGVJbiIsImRlbGF5IiwiZmFkZU91dCIsIlNlYXJjaCIsIl9pbnB1dHMiLCJzZWxlY3RvcnMiLCJNQUlOIiwiX3N1Z2dlc3Rpb25zIiwicGFyc2UiLCJqc1NlYXJjaFN1Z2dlc3Rpb25zIiwiX01pc3NQbGV0ZSIsIm9wdGlvbnMiLCJqc1NlYXJjaERyb3Bkb3duQ2xhc3MiLCJsaW5rQWN0aXZlQ2xhc3MiLCJ0b2dnbGVFbGVtcyIsInRvZ2dsZUVsZW0iLCJ0YXJnZXRFbGVtU2VsZWN0b3IiLCJ0YXJnZXRFbGVtIiwidG9nZ2xlRXZlbnQiLCJ0b2dnbGVDbGFzcyIsInRvZ2dsZSIsImNvbnRhaW5zIiwiQ3VzdG9tRXZlbnQiLCJpbml0Q3VzdG9tRXZlbnQiLCJjdXJyZW50VGFyZ2V0IiwiZGVsZWdhdGVUYXJnZXQiLCJzaG93IiwiaGlkZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtB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Q0EsMENBQTBDLDBCQUEwQjtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxQkFBcUIsY0FBYztBQUNuQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsWUFBWTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVk7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLGVBQWU7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsZUFBZTtBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0EseUJBQXlCLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxZQUFZO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxZQUFZO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSw0Q0FBNEMsbUJBQW1CO0FBQy9EO0FBQ0E7QUFDQSx5Q0FBeUMsWUFBWTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkVBQTZFO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7O0FBRUE7Ozs7Ozs7QUM3Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyQkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDakJBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDMUJBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ2pFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O3lDQzVCQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFLGtCQUFrQjtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvQkFBb0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxREFBcUQsY0FBYztBQUNuRTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIscUJBQXFCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQTBEO0FBQ3JFLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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NGIsSUFBbEI7QUFDRCxHQWpCRCxFQWlCRzlaLEVBakJILENBaUJNLE9BakJOLEVBaUJlLGNBakJmLEVBaUIrQixhQUFLO0FBQ2xDO0FBQ0E4USxNQUFFNVEsY0FBRjtBQUNBaEMsTUFBRSxjQUFGLEVBQWtCNmIsSUFBbEI7QUFDQTdiLE1BQUU0UyxFQUFFK0ksY0FBSixFQUFvQjdZLFdBQXBCLENBQWdDLFlBQWhDO0FBQ0QsR0F0QkQ7QUF1QkE7QUFFRCxDQTdCRCxFQTZCRy9DLE1BN0JILEVBNkJXLDhDQTdCWCxFIiwiZmlsZSI6ImQ1N2RjYjM4ZWI5NmI4M2MzYjQ4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQ1N2RjYjM4ZWI5NmI4M2MzYjQ4IiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJqUXVlcnlcIlxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYmFzZUVhY2ggPSByZXF1aXJlKCcuL19iYXNlRWFjaCcpLFxuICAgIGNhc3RGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2Nhc3RGdW5jdGlvbicpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIGVsZW1lbnQuXG4gKiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqICoqTm90ZToqKiBBcyB3aXRoIG90aGVyIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzLCBvYmplY3RzIHdpdGggYSBcImxlbmd0aFwiXG4gKiBwcm9wZXJ0eSBhcmUgaXRlcmF0ZWQgbGlrZSBhcnJheXMuIFRvIGF2b2lkIHRoaXMgYmVoYXZpb3IgdXNlIGBfLmZvckluYFxuICogb3IgYF8uZm9yT3duYCBmb3Igb2JqZWN0IGl0ZXJhdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAYWxpYXMgZWFjaFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2VlIF8uZm9yRWFjaFJpZ2h0XG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZm9yRWFjaChbMSwgMl0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyBgMWAgdGhlbiBgMmAuXG4gKlxuICogXy5mb3JFYWNoKHsgJ2EnOiAxLCAnYic6IDIgfSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICogICBjb25zb2xlLmxvZyhrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzICdhJyB0aGVuICdiJyAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKS5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheUVhY2ggOiBiYXNlRWFjaDtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgY2FzdEZ1bmN0aW9uKGl0ZXJhdGVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mb3JFYWNoLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3ltYm9sLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0aWYoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcclxuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0bW9kdWxlLnBhdGhzID0gW107XHJcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcclxuXHRcdGlmKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XHJcblx0fVxyXG5cdHJldHVybiBtb2R1bGU7XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIG5vdyA9IHJlcXVpcmUoJy4vbm93JyksXG4gICAgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuKiBVdGlsaXR5IG1vZHVsZSB0byBnZXQgdmFsdWUgb2YgYSBkYXRhIGF0dHJpYnV0ZVxuKiBAcGFyYW0ge29iamVjdH0gZWxlbSAtIERPTSBub2RlIGF0dHJpYnV0ZSBpcyByZXRyaWV2ZWQgZnJvbVxuKiBAcGFyYW0ge3N0cmluZ30gYXR0ciAtIEF0dHJpYnV0ZSBuYW1lIChkbyBub3QgaW5jbHVkZSB0aGUgJ2RhdGEtJyBwYXJ0KVxuKiBAcmV0dXJuIHttaXhlZH0gLSBWYWx1ZSBvZiBlbGVtZW50J3MgZGF0YSBhdHRyaWJ1dGVcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihlbGVtLCBhdHRyKSB7XG4gIGlmICh0eXBlb2YgZWxlbS5kYXRhc2V0ID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS0nICsgYXR0cik7XG4gIH1cbiAgcmV0dXJuIGVsZW0uZGF0YXNldFthdHRyXTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2RhdGFzZXQuanMiLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjguM1xuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZXhwb3J0c2Agb24gdGhlIHNlcnZlci5cbiAgdmFyIHJvb3QgPSB0aGlzO1xuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgX2AgdmFyaWFibGUuXG4gIHZhciBwcmV2aW91c1VuZGVyc2NvcmUgPSByb290Ll87XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXJcbiAgICBwdXNoICAgICAgICAgICAgID0gQXJyYXlQcm90by5wdXNoLFxuICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kLFxuICAgIG5hdGl2ZUNyZWF0ZSAgICAgICA9IE9iamVjdC5jcmVhdGU7XG5cbiAgLy8gTmFrZWQgZnVuY3Rpb24gcmVmZXJlbmNlIGZvciBzdXJyb2dhdGUtcHJvdG90eXBlLXN3YXBwaW5nLlxuICB2YXIgQ3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuOC4zJztcblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZWZmaWNpZW50IChmb3IgY3VycmVudCBlbmdpbmVzKSB2ZXJzaW9uXG4gIC8vIG9mIHRoZSBwYXNzZWQtaW4gY2FsbGJhY2ssIHRvIGJlIHJlcGVhdGVkbHkgYXBwbGllZCBpbiBvdGhlciBVbmRlcnNjb3JlXG4gIC8vIGZ1bmN0aW9ucy5cbiAgdmFyIG9wdGltaXplQ2IgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmIChjb250ZXh0ID09PSB2b2lkIDApIHJldHVybiBmdW5jO1xuICAgIHN3aXRjaCAoYXJnQ291bnQgPT0gbnVsbCA/IDMgOiBhcmdDb3VudCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSk7XG4gICAgICB9O1xuICAgICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIG90aGVyKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBBIG1vc3RseS1pbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBjYWxsYmFja3MgdGhhdCBjYW4gYmUgYXBwbGllZFxuICAvLyB0byBlYWNoIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uLCByZXR1cm5pbmcgdGhlIGRlc2lyZWQgcmVzdWx0IOKAlCBlaXRoZXJcbiAgLy8gaWRlbnRpdHksIGFuIGFyYml0cmFyeSBjYWxsYmFjaywgYSBwcm9wZXJ0eSBtYXRjaGVyLCBvciBhIHByb3BlcnR5IGFjY2Vzc29yLlxuICB2YXIgY2IgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIF8uaWRlbnRpdHk7XG4gICAgaWYgKF8uaXNGdW5jdGlvbih2YWx1ZSkpIHJldHVybiBvcHRpbWl6ZUNiKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCk7XG4gICAgaWYgKF8uaXNPYmplY3QodmFsdWUpKSByZXR1cm4gXy5tYXRjaGVyKHZhbHVlKTtcbiAgICByZXR1cm4gXy5wcm9wZXJ0eSh2YWx1ZSk7XG4gIH07XG4gIF8uaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBjYih2YWx1ZSwgY29udGV4dCwgSW5maW5pdHkpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhc3NpZ25lciBmdW5jdGlvbnMuXG4gIHZhciBjcmVhdGVBc3NpZ25lciA9IGZ1bmN0aW9uKGtleXNGdW5jLCB1bmRlZmluZWRPbmx5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoIDwgMiB8fCBvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF0sXG4gICAgICAgICAgICBrZXlzID0ga2V5c0Z1bmMoc291cmNlKSxcbiAgICAgICAgICAgIGwgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBpZiAoIXVuZGVmaW5lZE9ubHkgfHwgb2JqW2tleV0gPT09IHZvaWQgMCkgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIGFub3RoZXIuXG4gIHZhciBiYXNlQ3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KHByb3RvdHlwZSkpIHJldHVybiB7fTtcbiAgICBpZiAobmF0aXZlQ3JlYXRlKSByZXR1cm4gbmF0aXZlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBDdG9yO1xuICAgIEN0b3IucHJvdG90eXBlID0gbnVsbDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHZhciBwcm9wZXJ0eSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT0gbnVsbCA/IHZvaWQgMCA6IG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gSGVscGVyIGZvciBjb2xsZWN0aW9uIG1ldGhvZHMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2xsZWN0aW9uXG4gIC8vIHNob3VsZCBiZSBpdGVyYXRlZCBhcyBhbiBhcnJheSBvciBhcyBhbiBvYmplY3RcbiAgLy8gUmVsYXRlZDogaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGhcbiAgLy8gQXZvaWRzIGEgdmVyeSBuYXN0eSBpT1MgOCBKSVQgYnVnIG9uIEFSTS02NC4gIzIwOTRcbiAgdmFyIE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG4gIHZhciBnZXRMZW5ndGggPSBwcm9wZXJ0eSgnbGVuZ3RoJyk7XG4gIHZhciBpc0FycmF5TGlrZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiB0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIGxlbmd0aCA+PSAwICYmIGxlbmd0aCA8PSBNQVhfQVJSQVlfSU5ERVg7XG4gIH07XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyByYXcgb2JqZWN0cyBpbiBhZGRpdGlvbiB0byBhcnJheS1saWtlcy4gVHJlYXRzIGFsbFxuICAvLyBzcGFyc2UgYXJyYXktbGlrZXMgYXMgaWYgdGhleSB3ZXJlIGRlbnNlLlxuICBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgaSwgbGVuZ3RoO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2ldLCBpLCBvYmopO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpba2V5c1tpXV0sIGtleXNbaV0sIG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICByZXN1bHRzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgcmVzdWx0c1tpbmRleF0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIHJlZHVjaW5nIGZ1bmN0aW9uIGl0ZXJhdGluZyBsZWZ0IG9yIHJpZ2h0LlxuICBmdW5jdGlvbiBjcmVhdGVSZWR1Y2UoZGlyKSB7XG4gICAgLy8gT3B0aW1pemVkIGl0ZXJhdG9yIGZ1bmN0aW9uIGFzIHVzaW5nIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAvLyBpbiB0aGUgbWFpbiBmdW5jdGlvbiB3aWxsIGRlb3B0aW1pemUgdGhlLCBzZWUgIzE5OTEuXG4gICAgZnVuY3Rpb24gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCkge1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgICBtZW1vID0gaXRlcmF0ZWUobWVtbywgb2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGNvbnRleHQpIHtcbiAgICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgNCk7XG4gICAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICAgIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBpbml0aWFsIHZhbHVlIGlmIG5vbmUgaXMgcHJvdmlkZWQuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgbWVtbyA9IG9ialtrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleF07XG4gICAgICAgIGluZGV4ICs9IGRpcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRvcihvYmosIGl0ZXJhdGVlLCBtZW1vLCBrZXlzLCBpbmRleCwgbGVuZ3RoKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGNyZWF0ZVJlZHVjZSgxKTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBjcmVhdGVSZWR1Y2UoLTEpO1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBrZXk7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGtleSA9IF8uZmluZEluZGV4KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5ID0gXy5maW5kS2V5KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9XG4gICAgaWYgKGtleSAhPT0gdm9pZCAwICYmIGtleSAhPT0gLTEpIHJldHVybiBvYmpba2V5XTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubmVnYXRlKGNiKHByZWRpY2F0ZSkpLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAoIXByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIF8uc29tZSA9IF8uYW55ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIGl0ZW0gKHVzaW5nIGA9PT1gKS5cbiAgLy8gQWxpYXNlZCBhcyBgaW5jbHVkZXNgIGFuZCBgaW5jbHVkZWAuXG4gIF8uY29udGFpbnMgPSBfLmluY2x1ZGVzID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCBpdGVtLCBmcm9tSW5kZXgsIGd1YXJkKSB7XG4gICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgIGlmICh0eXBlb2YgZnJvbUluZGV4ICE9ICdudW1iZXInIHx8IGd1YXJkKSBmcm9tSW5kZXggPSAwO1xuICAgIHJldHVybiBfLmluZGV4T2Yob2JqLCBpdGVtLCBmcm9tSW5kZXgpID49IDA7XG4gIH07XG5cbiAgLy8gSW52b2tlIGEgbWV0aG9kICh3aXRoIGFyZ3VtZW50cykgb24gZXZlcnkgaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gIF8uaW52b2tlID0gZnVuY3Rpb24ob2JqLCBtZXRob2QpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaXNGdW5jID0gXy5pc0Z1bmN0aW9uKG1ldGhvZCk7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBmdW5jID0gaXNGdW5jID8gbWV0aG9kIDogdmFsdWVbbWV0aG9kXTtcbiAgICAgIHJldHVybiBmdW5jID09IG51bGwgPyBmdW5jIDogZnVuYy5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgXy5wcm9wZXJ0eShrZXkpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maW5kKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1heCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gLUluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSAtSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPiByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA+IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gLUluZmluaXR5ICYmIHJlc3VsdCA9PT0gLUluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IEluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSBJbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA8IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkIDwgbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSBJbmZpbml0eSAmJiByZXN1bHQgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFNodWZmbGUgYSBjb2xsZWN0aW9uLCB1c2luZyB0aGUgbW9kZXJuIHZlcnNpb24gb2YgdGhlXG4gIC8vIFtGaXNoZXItWWF0ZXMgc2h1ZmZsZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GaXNoZXLigJNZYXRlc19zaHVmZmxlKS5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHNldCA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBzZXQubGVuZ3RoO1xuICAgIHZhciBzaHVmZmxlZCA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwLCByYW5kOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKDAsIGluZGV4KTtcbiAgICAgIGlmIChyYW5kICE9PSBpbmRleCkgc2h1ZmZsZWRbaW5kZXhdID0gc2h1ZmZsZWRbcmFuZF07XG4gICAgICBzaHVmZmxlZFtyYW5kXSA9IHNldFtpbmRleF07XG4gICAgfVxuICAgIHJldHVybiBzaHVmZmxlZDtcbiAgfTtcblxuICAvLyBTYW1wbGUgKipuKiogcmFuZG9tIHZhbHVlcyBmcm9tIGEgY29sbGVjdGlvbi5cbiAgLy8gSWYgKipuKiogaXMgbm90IHNwZWNpZmllZCwgcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZWxlbWVudC5cbiAgLy8gVGhlIGludGVybmFsIGBndWFyZGAgYXJndW1lbnQgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgbWFwYC5cbiAgXy5zYW1wbGUgPSBmdW5jdGlvbihvYmosIG4sIGd1YXJkKSB7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkge1xuICAgICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgICAgcmV0dXJuIG9ialtfLnJhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICByZXR1cm4gXy5zaHVmZmxlKG9iaikuc2xpY2UoMCwgTWF0aC5tYXgoMCwgbikpO1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRlZS5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYTogaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IC0gcmlnaHQuaW5kZXg7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24oYmVoYXZpb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgICAgYmVoYXZpb3IocmVzdWx0LCB2YWx1ZSwga2V5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldLnB1c2godmFsdWUpOyBlbHNlIHJlc3VsdFtrZXldID0gW3ZhbHVlXTtcbiAgfSk7XG5cbiAgLy8gSW5kZXhlcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLCBzaW1pbGFyIHRvIGBncm91cEJ5YCwgYnV0IGZvclxuICAvLyB3aGVuIHlvdSBrbm93IHRoYXQgeW91ciBpbmRleCB2YWx1ZXMgd2lsbCBiZSB1bmlxdWUuXG4gIF8uaW5kZXhCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH0pO1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICBfLmNvdW50QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSsrOyBlbHNlIHJlc3VsdFtrZXldID0gMTtcbiAgfSk7XG5cbiAgLy8gU2FmZWx5IGNyZWF0ZSBhIHJlYWwsIGxpdmUgYXJyYXkgZnJvbSBhbnl0aGluZyBpdGVyYWJsZS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gaXNBcnJheUxpa2Uob2JqKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gU3BsaXQgYSBjb2xsZWN0aW9uIGludG8gdHdvIGFycmF5czogb25lIHdob3NlIGVsZW1lbnRzIGFsbCBzYXRpc2Z5IHRoZSBnaXZlblxuICAvLyBwcmVkaWNhdGUsIGFuZCBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIGRvIG5vdCBzYXRpc2Z5IHRoZSBwcmVkaWNhdGUuXG4gIF8ucGFydGl0aW9uID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBwYXNzID0gW10sIGZhaWwgPSBbXTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHtcbiAgICAgIChwcmVkaWNhdGUodmFsdWUsIGtleSwgb2JqKSA/IHBhc3MgOiBmYWlsKS5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW3Bhc3MsIGZhaWxdO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbMF07XG4gICAgcmV0dXJuIF8uaW5pdGlhbChhcnJheSwgYXJyYXkubGVuZ3RoIC0gbik7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uXG4gIF8uaW5pdGlhbCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSAobiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICBfLmxhc3QgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIF8ucmVzdChhcnJheSwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gbikpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgdGFpbGAgYW5kIGBkcm9wYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKipuKiogd2lsbCByZXR1cm5cbiAgLy8gdGhlIHJlc3QgTiB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICBfLnJlc3QgPSBfLnRhaWwgPSBfLmRyb3AgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgbiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihpbnB1dCwgc2hhbGxvdywgc3RyaWN0LCBzdGFydEluZGV4KSB7XG4gICAgdmFyIG91dHB1dCA9IFtdLCBpZHggPSAwO1xuICAgIGZvciAodmFyIGkgPSBzdGFydEluZGV4IHx8IDAsIGxlbmd0aCA9IGdldExlbmd0aChpbnB1dCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaW5wdXRbaV07XG4gICAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmIChfLmlzQXJyYXkodmFsdWUpIHx8IF8uaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgICAgICAvL2ZsYXR0ZW4gY3VycmVudCBsZXZlbCBvZiBhcnJheSBvciBhcmd1bWVudHMgb2JqZWN0XG4gICAgICAgIGlmICghc2hhbGxvdykgdmFsdWUgPSBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBzdHJpY3QpO1xuICAgICAgICB2YXIgaiA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgb3V0cHV0Lmxlbmd0aCArPSBsZW47XG4gICAgICAgIHdoaWxlIChqIDwgbGVuKSB7XG4gICAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlW2orK107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCkge1xuICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIGp1c3Qgb25lIGxldmVsLlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBmYWxzZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmICghXy5pc0Jvb2xlYW4oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0ZWU7XG4gICAgICBpdGVyYXRlZSA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGl0ZXJhdGVlICE9IG51bGwpIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldLFxuICAgICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSwgaSwgYXJyYXkpIDogdmFsdWU7XG4gICAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgICAgaWYgKCFpIHx8IHNlZW4gIT09IGNvbXB1dGVkKSByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIHNlZW4gPSBjb21wdXRlZDtcbiAgICAgIH0gZWxzZSBpZiAoaXRlcmF0ZWUpIHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHNlZW4sIGNvbXB1dGVkKSkge1xuICAgICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFfLmNvbnRhaW5zKHJlc3VsdCwgdmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8udW5pb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bmlxKGZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGFycmF5W2ldO1xuICAgICAgaWYgKF8uY29udGFpbnMocmVzdWx0LCBpdGVtKSkgY29udGludWU7XG4gICAgICBmb3IgKHZhciBqID0gMTsgaiA8IGFyZ3NMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoYXJndW1lbnRzW2pdLCBpdGVtKSkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaiA9PT0gYXJnc0xlbmd0aCkgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUsIDEpO1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBaaXAgdG9nZXRoZXIgbXVsdGlwbGUgbGlzdHMgaW50byBhIHNpbmdsZSBhcnJheSAtLSBlbGVtZW50cyB0aGF0IHNoYXJlXG4gIC8vIGFuIGluZGV4IGdvIHRvZ2V0aGVyLlxuICBfLnppcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuemlwKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgLy8gQ29tcGxlbWVudCBvZiBfLnppcC4gVW56aXAgYWNjZXB0cyBhbiBhcnJheSBvZiBhcnJheXMgYW5kIGdyb3Vwc1xuICAvLyBlYWNoIGFycmF5J3MgZWxlbWVudHMgb24gc2hhcmVkIGluZGljZXNcbiAgXy51bnppcCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ICYmIF8ubWF4KGFycmF5LCBnZXRMZW5ndGgpLmxlbmd0aCB8fCAwO1xuICAgIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgcmVzdWx0W2luZGV4XSA9IF8ucGx1Y2soYXJyYXksIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgobGlzdCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGZpbmRJbmRleCBhbmQgZmluZExhc3RJbmRleCBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoZGlyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIHZhciBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgaW5kZXggb24gYW4gYXJyYXktbGlrZSB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoMSk7XG4gIF8uZmluZExhc3RJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKC0xKTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0ZWUob2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSBNYXRoLmZsb29yKChsb3cgKyBoaWdoKSAvIDIpO1xuICAgICAgaWYgKGl0ZXJhdGVlKGFycmF5W21pZF0pIDwgdmFsdWUpIGxvdyA9IG1pZCArIDE7IGVsc2UgaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBpbmRleE9mIGFuZCBsYXN0SW5kZXhPZiBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gY3JlYXRlSW5kZXhGaW5kZXIoZGlyLCBwcmVkaWNhdGVGaW5kLCBzb3J0ZWRJbmRleCkge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgaXRlbSwgaWR4KSB7XG4gICAgICB2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICBpZiAodHlwZW9mIGlkeCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoZGlyID4gMCkge1xuICAgICAgICAgICAgaSA9IGlkeCA+PSAwID8gaWR4IDogTWF0aC5tYXgoaWR4ICsgbGVuZ3RoLCBpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IGlkeCA+PSAwID8gTWF0aC5taW4oaWR4ICsgMSwgbGVuZ3RoKSA6IGlkeCArIGxlbmd0aCArIDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc29ydGVkSW5kZXggJiYgaWR4ICYmIGxlbmd0aCkge1xuICAgICAgICBpZHggPSBzb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpZHhdID09PSBpdGVtID8gaWR4IDogLTE7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbSAhPT0gaXRlbSkge1xuICAgICAgICBpZHggPSBwcmVkaWNhdGVGaW5kKHNsaWNlLmNhbGwoYXJyYXksIGksIGxlbmd0aCksIF8uaXNOYU4pO1xuICAgICAgICByZXR1cm4gaWR4ID49IDAgPyBpZHggKyBpIDogLTE7XG4gICAgICB9XG4gICAgICBmb3IgKGlkeCA9IGRpciA+IDAgPyBpIDogbGVuZ3RoIC0gMTsgaWR4ID49IDAgJiYgaWR4IDwgbGVuZ3RoOyBpZHggKz0gZGlyKSB7XG4gICAgICAgIGlmIChhcnJheVtpZHhdID09PSBpdGVtKSByZXR1cm4gaWR4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuIGl0ZW0gaW4gYW4gYXJyYXksXG4gIC8vIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigxLCBfLmZpbmRJbmRleCwgXy5zb3J0ZWRJbmRleCk7XG4gIF8ubGFzdEluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigtMSwgXy5maW5kTGFzdEluZGV4KTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChzdG9wID09IG51bGwpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gc3RlcCB8fCAxO1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgcmFuZ2UgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbGVuZ3RoOyBpZHgrKywgc3RhcnQgKz0gc3RlcCkge1xuICAgICAgcmFuZ2VbaWR4XSA9IHN0YXJ0O1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIERldGVybWluZXMgd2hldGhlciB0byBleGVjdXRlIGEgZnVuY3Rpb24gYXMgYSBjb25zdHJ1Y3RvclxuICAvLyBvciBhIG5vcm1hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHNcbiAgdmFyIGV4ZWN1dGVCb3VuZCA9IGZ1bmN0aW9uKHNvdXJjZUZ1bmMsIGJvdW5kRnVuYywgY29udGV4dCwgY2FsbGluZ0NvbnRleHQsIGFyZ3MpIHtcbiAgICBpZiAoIShjYWxsaW5nQ29udGV4dCBpbnN0YW5jZW9mIGJvdW5kRnVuYykpIHJldHVybiBzb3VyY2VGdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIHZhciBzZWxmID0gYmFzZUNyZWF0ZShzb3VyY2VGdW5jLnByb3RvdHlwZSk7XG4gICAgdmFyIHJlc3VsdCA9IHNvdXJjZUZ1bmMuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgaWYgKF8uaXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICBpZiAobmF0aXZlQmluZCAmJiBmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQpIHJldHVybiBuYXRpdmVCaW5kLmFwcGx5KGZ1bmMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JpbmQgbXVzdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbicpO1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgY29udGV4dCwgdGhpcywgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSAwLCBsZW5ndGggPSBib3VuZEFyZ3MubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2ldID0gYm91bmRBcmdzW2ldID09PSBfID8gYXJndW1lbnRzW3Bvc2l0aW9uKytdIDogYm91bmRBcmdzW2ldO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCB0aGlzLCB0aGlzLCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGksIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsIGtleTtcbiAgICBpZiAobGVuZ3RoIDw9IDEpIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gYXJndW1lbnRzW2ldO1xuICAgICAgb2JqW2tleV0gPSBfLmJpbmQob2JqW2tleV0sIG9iaik7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW9pemUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBjYWNoZSA9IG1lbW9pemUuY2FjaGU7XG4gICAgICB2YXIgYWRkcmVzcyA9ICcnICsgKGhhc2hlciA/IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDoga2V5KTtcbiAgICAgIGlmICghXy5oYXMoY2FjaGUsIGFkZHJlc3MpKSBjYWNoZVthZGRyZXNzXSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBjYWNoZVthZGRyZXNzXTtcbiAgICB9O1xuICAgIG1lbW9pemUuY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gbWVtb2l6ZTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBfLnBhcnRpYWwoXy5kZWxheSwgXywgMSk7XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IF8ubm93KCk7XG4gICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcblxuICAgICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPj0gMCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB0aW1lc3RhbXAgPSBfLm5vdygpO1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gXy5wYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIHBhc3NlZC1pbiBwcmVkaWNhdGUuXG4gIF8ubmVnYXRlID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IHN0YXJ0O1xuICAgICAgdmFyIHJlc3VsdCA9IGFyZ3Nbc3RhcnRdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB3aGlsZSAoaS0tKSByZXN1bHQgPSBhcmdzW2ldLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgb24gYW5kIGFmdGVyIHRoZSBOdGggY2FsbC5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgdXAgdG8gKGJ1dCBub3QgaW5jbHVkaW5nKSB0aGUgTnRoIGNhbGwuXG4gIF8uYmVmb3JlID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICB2YXIgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA+IDApIHtcbiAgICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aW1lcyA8PSAxKSBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IF8ucGFydGlhbChfLmJlZm9yZSwgMik7XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gS2V5cyBpbiBJRSA8IDkgdGhhdCB3b24ndCBiZSBpdGVyYXRlZCBieSBgZm9yIGtleSBpbiAuLi5gIGFuZCB0aHVzIG1pc3NlZC5cbiAgdmFyIGhhc0VudW1CdWcgPSAhe3RvU3RyaW5nOiBudWxsfS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbiAgdmFyIG5vbkVudW1lcmFibGVQcm9wcyA9IFsndmFsdWVPZicsICdpc1Byb3RvdHlwZU9mJywgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnaGFzT3duUHJvcGVydHknLCAndG9Mb2NhbGVTdHJpbmcnXTtcblxuICBmdW5jdGlvbiBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cykge1xuICAgIHZhciBub25FbnVtSWR4ID0gbm9uRW51bWVyYWJsZVByb3BzLmxlbmd0aDtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBvYmouY29uc3RydWN0b3I7XG4gICAgdmFyIHByb3RvID0gKF8uaXNGdW5jdGlvbihjb25zdHJ1Y3RvcikgJiYgY29uc3RydWN0b3IucHJvdG90eXBlKSB8fCBPYmpQcm90bztcblxuICAgIC8vIENvbnN0cnVjdG9yIGlzIGEgc3BlY2lhbCBjYXNlLlxuICAgIHZhciBwcm9wID0gJ2NvbnN0cnVjdG9yJztcbiAgICBpZiAoXy5oYXMob2JqLCBwcm9wKSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkga2V5cy5wdXNoKHByb3ApO1xuXG4gICAgd2hpbGUgKG5vbkVudW1JZHgtLSkge1xuICAgICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tub25FbnVtSWR4XTtcbiAgICAgIGlmIChwcm9wIGluIG9iaiAmJiBvYmpbcHJvcF0gIT09IHByb3RvW3Byb3BdICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSB7XG4gICAgICAgIGtleXMucHVzaChwcm9wKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIGFsbCB0aGUgcHJvcGVydHkgbmFtZXMgb2YgYW4gb2JqZWN0LlxuICBfLmFsbEtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciB2YWx1ZXMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtrZXlzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQgb2YgdGhlIG9iamVjdFxuICAvLyBJbiBjb250cmFzdCB0byBfLm1hcCBpdCByZXR1cm5zIGFuIG9iamVjdFxuICBfLm1hcE9iamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aCxcbiAgICAgICAgICByZXN1bHRzID0ge30sXG4gICAgICAgICAgY3VycmVudEtleTtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY3VycmVudEtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICByZXN1bHRzW2N1cnJlbnRLZXldID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIF8ucGFpcnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgcGFpcnMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW2tleXNbaV0sIG9ialtrZXlzW2ldXV07XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpba2V5c1tpXV1dID0ga2V5c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMpO1xuXG4gIC8vIEFzc2lnbnMgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIG93biBwcm9wZXJ0aWVzIGluIHRoZSBwYXNzZWQtaW4gb2JqZWN0KHMpXG4gIC8vIChodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduKVxuICBfLmV4dGVuZE93biA9IF8uYXNzaWduID0gY3JlYXRlQXNzaWduZXIoXy5rZXlzKTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBrZXkgb24gYW4gb2JqZWN0IHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kS2V5ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaiksIGtleTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2tleV0sIGtleSwgb2JqKSkgcmV0dXJuIGtleTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqZWN0LCBvaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge30sIG9iaiA9IG9iamVjdCwgaXRlcmF0ZWUsIGtleXM7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChfLmlzRnVuY3Rpb24ob2l0ZXJhdGVlKSkge1xuICAgICAga2V5cyA9IF8uYWxsS2V5cyhvYmopO1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKG9pdGVyYXRlZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleXMgPSBmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7IHJldHVybiBrZXkgaW4gb2JqOyB9O1xuICAgICAgb2JqID0gT2JqZWN0KG9iaik7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iaikpIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLm9taXQgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpdGVyYXRlZSkpIHtcbiAgICAgIGl0ZXJhdGVlID0gXy5uZWdhdGUoaXRlcmF0ZWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ubWFwKGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpLCBTdHJpbmcpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJldHVybiAhXy5jb250YWlucyhrZXlzLCBrZXkpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIF8ucGljayhvYmosIGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzLCB0cnVlKTtcblxuICAvLyBDcmVhdGVzIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhlIGdpdmVuIHByb3RvdHlwZSBvYmplY3QuXG4gIC8vIElmIGFkZGl0aW9uYWwgcHJvcGVydGllcyBhcmUgcHJvdmlkZWQgdGhlbiB0aGV5IHdpbGwgYmUgYWRkZWQgdG8gdGhlXG4gIC8vIGNyZWF0ZWQgb2JqZWN0LlxuICBfLmNyZWF0ZSA9IGZ1bmN0aW9uKHByb3RvdHlwZSwgcHJvcHMpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIGlmIChwcm9wcykgXy5leHRlbmRPd24ocmVzdWx0LCBwcm9wcyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2YgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uaXNNYXRjaCA9IGZ1bmN0aW9uKG9iamVjdCwgYXR0cnMpIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhhdHRycyksIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuICFsZW5ndGg7XG4gICAgdmFyIG9iaiA9IE9iamVjdChvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKGF0dHJzW2tleV0gIT09IG9ialtrZXldIHx8ICEoa2V5IGluIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCByZWd1bGFyIGV4cHJlc3Npb25zLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb2VyY2VkIHRvIHN0cmluZ3MgZm9yIGNvbXBhcmlzb24gKE5vdGU6ICcnICsgL2EvaSA9PT0gJy9hL2knKVxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gJycgKyBhID09PSAnJyArIGI7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLlxuICAgICAgICAvLyBPYmplY3QoTmFOKSBpcyBlcXVpdmFsZW50IHRvIE5hTlxuICAgICAgICBpZiAoK2EgIT09ICthKSByZXR1cm4gK2IgIT09ICtiO1xuICAgICAgICAvLyBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gK2EgPT09IDAgPyAxIC8gK2EgPT09IDEgLyBiIDogK2EgPT09ICtiO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09PSArYjtcbiAgICB9XG5cbiAgICB2YXIgYXJlQXJyYXlzID0gY2xhc3NOYW1lID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIGlmICghYXJlQXJyYXlzKSB7XG4gICAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblxuICAgICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzIG9yIGBBcnJheWBzXG4gICAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgYUN0b3IgaW5zdGFuY2VvZiBhQ3RvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKCdjb25zdHJ1Y3RvcicgaW4gYSAmJiAnY29uc3RydWN0b3InIGluIGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuXG4gICAgLy8gSW5pdGlhbGl6aW5nIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIC8vIEl0J3MgZG9uZSBoZXJlIHNpbmNlIHdlIG9ubHkgbmVlZCB0aGVtIGZvciBvYmplY3RzIGFuZCBhcnJheXMgY29tcGFyaXNvbi5cbiAgICBhU3RhY2sgPSBhU3RhY2sgfHwgW107XG4gICAgYlN0YWNrID0gYlN0YWNrIHx8IFtdO1xuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PT0gYjtcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnB1c2goYSk7XG4gICAgYlN0YWNrLnB1c2goYik7XG5cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoYXJlQXJyYXlzKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIGxlbmd0aCA9IGEubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCAhPT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKCFlcShhW2xlbmd0aF0sIGJbbGVuZ3RoXSwgYVN0YWNrLCBiU3RhY2spKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgdmFyIGtleXMgPSBfLmtleXMoYSksIGtleTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMgYmVmb3JlIGNvbXBhcmluZyBkZWVwIGVxdWFsaXR5LlxuICAgICAgaWYgKF8ua2V5cyhiKS5sZW5ndGggIT09IGxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlclxuICAgICAgICBrZXkgPSBrZXlzW2xlbmd0aF07XG4gICAgICAgIGlmICghKF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvYmplY3QgZnJvbSB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnBvcCgpO1xuICAgIGJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSAmJiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopIHx8IF8uaXNBcmd1bWVudHMob2JqKSkpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIHJldHVybiBfLmtleXMob2JqKS5sZW5ndGggPT09IDA7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSBhbiBvYmplY3Q/XG4gIF8uaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAsIGlzRXJyb3IuXG4gIF8uZWFjaChbJ0FyZ3VtZW50cycsICdGdW5jdGlvbicsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0RhdGUnLCAnUmVnRXhwJywgJ0Vycm9yJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBfWydpcycgKyBuYW1lXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSA8IDkpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmhhcyhvYmosICdjYWxsZWUnKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLiBXb3JrIGFyb3VuZCBzb21lIHR5cGVvZiBidWdzIGluIG9sZCB2OCxcbiAgLy8gSUUgMTEgKCMxNjIxKSwgYW5kIGluIFNhZmFyaSA4ICgjMTkyOSkuXG4gIGlmICh0eXBlb2YgLy4vICE9ICdmdW5jdGlvbicgJiYgdHlwZW9mIEludDhBcnJheSAhPSAnb2JqZWN0Jykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiBvYmplY3QgYSBmaW5pdGUgbnVtYmVyP1xuICBfLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH07XG5cbiAgLy8gSXMgdGhlIGdpdmVuIHZhbHVlIGBOYU5gPyAoTmFOIGlzIHRoZSBvbmx5IG51bWJlciB3aGljaCBkb2VzIG5vdCBlcXVhbCBpdHNlbGYpLlxuICBfLmlzTmFOID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT09ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdGVlcy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8vIFByZWRpY2F0ZS1nZW5lcmF0aW5nIGZ1bmN0aW9ucy4gT2Z0ZW4gdXNlZnVsIG91dHNpZGUgb2YgVW5kZXJzY29yZS5cbiAgXy5jb25zdGFudCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH07XG5cbiAgXy5ub29wID0gZnVuY3Rpb24oKXt9O1xuXG4gIF8ucHJvcGVydHkgPSBwcm9wZXJ0eTtcblxuICAvLyBHZW5lcmF0ZXMgYSBmdW5jdGlvbiBmb3IgYSBnaXZlbiBvYmplY3QgdGhhdCByZXR1cm5zIGEgZ2l2ZW4gcHJvcGVydHkuXG4gIF8ucHJvcGVydHlPZiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT0gbnVsbCA/IGZ1bmN0aW9uKCl7fSA6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mXG4gIC8vIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLm1hdGNoZXIgPSBfLm1hdGNoZXMgPSBmdW5jdGlvbihhdHRycykge1xuICAgIGF0dHJzID0gXy5leHRlbmRPd24oe30sIGF0dHJzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5pc01hdGNoKG9iaiwgYXR0cnMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KE1hdGgubWF4KDAsIG4pKTtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdGVlKGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdXNpdmUpLlxuICBfLnJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgfTtcblxuICAvLyBBIChwb3NzaWJseSBmYXN0ZXIpIHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wIGFzIGFuIGludGVnZXIuXG4gIF8ubm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9O1xuXG4gICAvLyBMaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuICB2YXIgZXNjYXBlTWFwID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjeDI3OycsXG4gICAgJ2AnOiAnJiN4NjA7J1xuICB9O1xuICB2YXIgdW5lc2NhcGVNYXAgPSBfLmludmVydChlc2NhcGVNYXApO1xuXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgdmFyIGNyZWF0ZUVzY2FwZXIgPSBmdW5jdGlvbihtYXApIHtcbiAgICB2YXIgZXNjYXBlciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICByZXR1cm4gbWFwW21hdGNoXTtcbiAgICB9O1xuICAgIC8vIFJlZ2V4ZXMgZm9yIGlkZW50aWZ5aW5nIGEga2V5IHRoYXQgbmVlZHMgdG8gYmUgZXNjYXBlZFxuICAgIHZhciBzb3VyY2UgPSAnKD86JyArIF8ua2V5cyhtYXApLmpvaW4oJ3wnKSArICcpJztcbiAgICB2YXIgdGVzdFJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UpO1xuICAgIHZhciByZXBsYWNlUmVnZXhwID0gUmVnRXhwKHNvdXJjZSwgJ2cnKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcgPT0gbnVsbCA/ICcnIDogJycgKyBzdHJpbmc7XG4gICAgICByZXR1cm4gdGVzdFJlZ2V4cC50ZXN0KHN0cmluZykgPyBzdHJpbmcucmVwbGFjZShyZXBsYWNlUmVnZXhwLCBlc2NhcGVyKSA6IHN0cmluZztcbiAgICB9O1xuICB9O1xuICBfLmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIoZXNjYXBlTWFwKTtcbiAgXy51bmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIodW5lc2NhcGVNYXApO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBvZiB0aGUgbmFtZWQgYHByb3BlcnR5YCBpcyBhIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0IHdpdGggdGhlXG4gIC8vIGBvYmplY3RgIGFzIGNvbnRleHQ7IG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHksIGZhbGxiYWNrKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB2b2lkIDAgOiBvYmplY3RbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICB2YWx1ZSA9IGZhbGxiYWNrO1xuICAgIH1cbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlLmNhbGwob2JqZWN0KSA6IHZhbHVlO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgdmFyIGVzY2FwZUNoYXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgIHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTtcbiAgfTtcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICAvLyBOQjogYG9sZFNldHRpbmdzYCBvbmx5IGV4aXN0cyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBzZXR0aW5ncywgb2xkU2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzICYmIG9sZFNldHRpbmdzKSBzZXR0aW5ncyA9IG9sZFNldHRpbmdzO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldCkucmVwbGFjZShlc2NhcGVyLCBlc2NhcGVDaGFyKTtcbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuXG4gICAgICAvLyBBZG9iZSBWTXMgbmVlZCB0aGUgbWF0Y2ggcmV0dXJuZWQgdG8gcHJvZHVjZSB0aGUgY29ycmVjdCBvZmZlc3QuXG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyAncmV0dXJuIF9fcDtcXG4nO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdmFyIGFyZ3VtZW50ID0gc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaic7XG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyBhcmd1bWVudCArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLiBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBfKG9iaik7XG4gICAgaW5zdGFuY2UuX2NoYWluID0gdHJ1ZTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBvYmopIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuX2NoYWluID8gXyhvYmopLmNoYWluKCkgOiBvYmo7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgXy5lYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydwb3AnLCAncHVzaCcsICdyZXZlcnNlJywgJ3NoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIG1ldGhvZC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICBpZiAoKG5hbWUgPT09ICdzaGlmdCcgfHwgbmFtZSA9PT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBtZXRob2QuYXBwbHkodGhpcy5fd3JhcHBlZCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRXh0cmFjdHMgdGhlIHJlc3VsdCBmcm9tIGEgd3JhcHBlZCBhbmQgY2hhaW5lZCBvYmplY3QuXG4gIF8ucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gUHJvdmlkZSB1bndyYXBwaW5nIHByb3h5IGZvciBzb21lIG1ldGhvZHMgdXNlZCBpbiBlbmdpbmUgb3BlcmF0aW9uc1xuICAvLyBzdWNoIGFzIGFyaXRobWV0aWMgYW5kIEpTT04gc3RyaW5naWZpY2F0aW9uLlxuICBfLnByb3RvdHlwZS52YWx1ZU9mID0gXy5wcm90b3R5cGUudG9KU09OID0gXy5wcm90b3R5cGUudmFsdWU7XG5cbiAgXy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJycgKyB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIEFNRCByZWdpc3RyYXRpb24gaGFwcGVucyBhdCB0aGUgZW5kIGZvciBjb21wYXRpYmlsaXR5IHdpdGggQU1EIGxvYWRlcnNcbiAgLy8gdGhhdCBtYXkgbm90IGVuZm9yY2UgbmV4dC10dXJuIHNlbWFudGljcyBvbiBtb2R1bGVzLiBFdmVuIHRob3VnaCBnZW5lcmFsXG4gIC8vIHByYWN0aWNlIGZvciBBTUQgcmVnaXN0cmF0aW9uIGlzIHRvIGJlIGFub255bW91cywgdW5kZXJzY29yZSByZWdpc3RlcnNcbiAgLy8gYXMgYSBuYW1lZCBtb2R1bGUgYmVjYXVzZSwgbGlrZSBqUXVlcnksIGl0IGlzIGEgYmFzZSBsaWJyYXJ5IHRoYXQgaXNcbiAgLy8gcG9wdWxhciBlbm91Z2ggdG8gYmUgYnVuZGxlZCBpbiBhIHRoaXJkIHBhcnR5IGxpYiwgYnV0IG5vdCBiZSBwYXJ0IG9mXG4gIC8vIGFuIEFNRCBsb2FkIHJlcXVlc3QuIFRob3NlIGNhc2VzIGNvdWxkIGdlbmVyYXRlIGFuIGVycm9yIHdoZW4gYW5cbiAgLy8gYW5vbnltb3VzIGRlZmluZSgpIGlzIGNhbGxlZCBvdXRzaWRlIG9mIGEgbG9hZGVyIHJlcXVlc3QuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ3VuZGVyc2NvcmUnLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXztcbiAgICB9KTtcbiAgfVxufS5jYWxsKHRoaXMpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvdW5kZXJzY29yZS5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGFjY29yZGlvbiBmcm9tICcuL21vZHVsZXMvYWNjb3JkaW9uLmpzJztcbmltcG9ydCBzaW1wbGVBY2NvcmRpb24gZnJvbSAnLi9tb2R1bGVzL3NpbXBsZUFjY29yZGlvbi5qcyc7XG5pbXBvcnQgb2ZmY2FudmFzIGZyb20gJy4vbW9kdWxlcy9vZmZjYW52YXMuanMnO1xuaW1wb3J0IG92ZXJsYXkgZnJvbSAnLi9tb2R1bGVzL292ZXJsYXkuanMnO1xuaW1wb3J0IHN0aWNrTmF2IGZyb20gJy4vbW9kdWxlcy9zdGlja05hdi5qcyc7XG5pbXBvcnQgc2VjdGlvbkhpZ2hsaWdodGVyIGZyb20gJy4vbW9kdWxlcy9zZWN0aW9uSGlnaGxpZ2h0ZXIuanMnO1xuaW1wb3J0IHN0YXRpY0NvbHVtbiBmcm9tICcuL21vZHVsZXMvc3RhdGljQ29sdW1uLmpzJztcbmltcG9ydCBhbGVydCBmcm9tICcuL21vZHVsZXMvYWxlcnQuanMnO1xuLy8gaW1wb3J0IGJzZHRvb2xzU2lnbnVwIGZyb20gJy4vbW9kdWxlcy9ic2R0b29scy1zaWdudXAuanMnO1xuaW1wb3J0IGd1bnlTaWdudXAgZnJvbSAnLi9tb2R1bGVzL25ld3NsZXR0ZXItc2lnbnVwLmpzJztcbmltcG9ydCBmb3JtRWZmZWN0cyBmcm9tICcuL21vZHVsZXMvZm9ybUVmZmVjdHMuanMnO1xuaW1wb3J0IGZhY2V0cyBmcm9tICcuL21vZHVsZXMvZmFjZXRzLmpzJztcbmltcG9ydCBvd2xTZXR0aW5ncyBmcm9tICcuL21vZHVsZXMvb3dsU2V0dGluZ3MuanMnO1xuaW1wb3J0IGlPUzdIYWNrIGZyb20gJy4vbW9kdWxlcy9pT1M3SGFjay5qcyc7XG5pbXBvcnQgU2hhcmVGb3JtIGZyb20gJy4vbW9kdWxlcy9zaGFyZS1mb3JtLmpzJztcbmltcG9ydCBjYXB0Y2hhUmVzaXplIGZyb20gJy4vbW9kdWxlcy9jYXB0Y2hhUmVzaXplLmpzJztcbmltcG9ydCByb3RhdGluZ1RleHRBbmltYXRpb24gZnJvbSAnLi9tb2R1bGVzL3JvdGF0aW5nVGV4dEFuaW1hdGlvbi5qcyc7XG5pbXBvcnQgU2VhcmNoIGZyb20gJy4vbW9kdWxlcy9zZWFyY2guanMnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmltcG9ydCB0b2dnbGVPcGVuIGZyb20gJy4vbW9kdWxlcy90b2dnbGVPcGVuLmpzJztcbmltcG9ydCB0b2dnbGVNZW51IGZyb20gJy4vbW9kdWxlcy90b2dnbGVNZW51LmpzJztcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuZnVuY3Rpb24gcmVhZHkoZm4pIHtcbiAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XG4gIH0gZWxzZSB7XG4gICAgZm4oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuICB0b2dnbGVPcGVuKCdpcy1vcGVuJyk7XG4gIGFsZXJ0KCdpcy1vcGVuJyk7XG4gIG9mZmNhbnZhcygpO1xuICBhY2NvcmRpb24oKTtcbiAgc2ltcGxlQWNjb3JkaW9uKCk7XG4gIG92ZXJsYXkoKTtcblxuICAvLyBGYWNldFdQIHBhZ2VzXG4gIGZhY2V0cygpO1xuXG4gIC8vIEhvbWVwYWdlXG4gIHN0YXRpY0NvbHVtbigpO1xuICBzdGlja05hdigpO1xuICAvLyBic2R0b29sc1NpZ251cCgpO1xuICBndW55U2lnbnVwKCk7XG4gIGZvcm1FZmZlY3RzKCk7XG4gIG93bFNldHRpbmdzKCk7XG4gIGlPUzdIYWNrKCk7XG4gIGNhcHRjaGFSZXNpemUoKTtcbiAgcm90YXRpbmdUZXh0QW5pbWF0aW9uKCk7XG4gIHNlY3Rpb25IaWdobGlnaHRlcigpO1xuXG4gIC8vIFNlYXJjaFxuICBuZXcgU2VhcmNoKCkuaW5pdCgpO1xufVxuXG5yZWFkeShpbml0KTtcblxuLy8gTWFrZSBjZXJ0YWluIGZ1bmN0aW9ucyBhdmFpbGFibGUgZ2xvYmFsbHlcbndpbmRvdy5hY2NvcmRpb24gPSBhY2NvcmRpb247XG5cbihmdW5jdGlvbih3aW5kb3csICQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvLyBJbml0aWFsaXplIHNoYXJlIGJ5IGVtYWlsL3NtcyBmb3Jtcy5cbiAgJChgLiR7U2hhcmVGb3JtLkNzc0NsYXNzLkZPUk19YCkuZWFjaCgoaSwgZWwpID0+IHtcbiAgICBjb25zdCBzaGFyZUZvcm0gPSBuZXcgU2hhcmVGb3JtKGVsKTtcbiAgICBzaGFyZUZvcm0uaW5pdCgpO1xuICB9KTtcbn0pKHdpbmRvdywgalF1ZXJ5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tYWluLmpzIiwiLyoqXG4gKiBBY2NvcmRpb24gbW9kdWxlXG4gKiBAbW9kdWxlIG1vZHVsZXMvYWNjb3JkaW9uXG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgLyoqXG4gICAqIENvbnZlcnQgYWNjb3JkaW9uIGhlYWRpbmcgdG8gYSBidXR0b25cbiAgICogQHBhcmFtIHtvYmplY3R9ICRoZWFkZXJFbGVtIC0galF1ZXJ5IG9iamVjdCBjb250YWluaW5nIG9yaWdpbmFsIGhlYWRlclxuICAgKiBAcmV0dXJuIHtvYmplY3R9IE5ldyBoZWFkaW5nIGVsZW1lbnRcbiAgICovXG4gIGZ1bmN0aW9uIGNvbnZlcnRIZWFkZXJUb0J1dHRvbigkaGVhZGVyRWxlbSkge1xuICAgIGlmICgkaGVhZGVyRWxlbS5nZXQoMCkubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2J1dHRvbicpIHtcbiAgICAgIHJldHVybiAkaGVhZGVyRWxlbTtcbiAgICB9XG4gICAgY29uc3QgaGVhZGVyRWxlbSA9ICRoZWFkZXJFbGVtLmdldCgwKTtcbiAgICBjb25zdCBuZXdIZWFkZXJFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZm9yRWFjaChoZWFkZXJFbGVtLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIG5ld0hlYWRlckVsZW0uc2V0QXR0cmlidXRlKGF0dHIubm9kZU5hbWUsIGF0dHIubm9kZVZhbHVlKTtcbiAgICB9KTtcbiAgICBuZXdIZWFkZXJFbGVtLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgICBjb25zdCAkbmV3SGVhZGVyRWxlbSA9ICQobmV3SGVhZGVyRWxlbSk7XG4gICAgJG5ld0hlYWRlckVsZW0uaHRtbCgkaGVhZGVyRWxlbS5odG1sKCkpO1xuICAgICRuZXdIZWFkZXJFbGVtLmFwcGVuZCgnPHN2ZyBjbGFzcz1cIm8tYWNjb3JkaW9uX19jYXJldCBpY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PHVzZSB4bGluazpocmVmPVwiI2ljb24tY2FyZXQtZG93blwiPjwvdXNlPjwvc3ZnPicpO1xuICAgIHJldHVybiAkbmV3SGVhZGVyRWxlbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdmlzaWJpbGl0eSBhdHRyaWJ1dGVzIGZvciBoZWFkZXJcbiAgICogQHBhcmFtIHtvYmplY3R9ICRoZWFkZXJFbGVtIC0gVGhlIGFjY29yZGlvbiBoZWFkZXIgalF1ZXJ5IG9iamVjdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ha2VWaXNpYmxlIC0gV2hldGhlciB0aGUgaGVhZGVyJ3MgY29udGVudCBzaG91bGQgYmUgdmlzaWJsZVxuICAgKi9cbiAgZnVuY3Rpb24gdG9nZ2xlSGVhZGVyKCRoZWFkZXJFbGVtLCBtYWtlVmlzaWJsZSkge1xuICAgICRoZWFkZXJFbGVtLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBtYWtlVmlzaWJsZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGF0dHJpYnV0ZXMsIGNsYXNzZXMsIGFuZCBldmVudCBiaW5kaW5nIHRvIGFjY29yZGlvbiBoZWFkZXJcbiAgICogQHBhcmFtIHtvYmplY3R9ICRoZWFkZXJFbGVtIC0gVGhlIGFjY29yZGlvbiBoZWFkZXIgalF1ZXJ5IG9iamVjdFxuICAgKiBAcGFyYW0ge29iamVjdH0gJHJlbGF0ZWRQYW5lbCAtIFRoZSBwYW5lbCB0aGUgYWNjb3JkaW9uIGhlYWRlciBjb250cm9sc1xuICAgKi9cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZUhlYWRlcigkaGVhZGVyRWxlbSwgJHJlbGF0ZWRQYW5lbCkge1xuICAgICRoZWFkZXJFbGVtLmF0dHIoe1xuICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiBmYWxzZSxcbiAgICAgICdhcmlhLWNvbnRyb2xzJzogJHJlbGF0ZWRQYW5lbC5nZXQoMCkuaWQsXG4gICAgICAnYXJpYS1leHBhbmRlZCc6IGZhbHNlLFxuICAgICAgJ3JvbGUnOiAnaGVhZGluZydcbiAgICB9KS5hZGRDbGFzcygnby1hY2NvcmRpb25fX2hlYWRlcicpO1xuXG4gICAgJGhlYWRlckVsZW0ub24oJ2NsaWNrLmFjY29yZGlvbicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJGhlYWRlckVsZW0udHJpZ2dlcignY2hhbmdlU3RhdGUnKTtcbiAgICB9KTtcblxuICAgICRoZWFkZXJFbGVtLm9uKCdtb3VzZWxlYXZlLmFjY29yZGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgJGhlYWRlckVsZW0uYmx1cigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB2aXNpYmlsaXR5IGF0dHJpYnV0ZXMgZm9yIHBhbmVsXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkcGFuZWxFbGVtIC0gVGhlIGFjY29yZGlvbiBwYW5lbCBqUXVlcnkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWFrZVZpc2libGUgLSBXaGV0aGVyIHRoZSBwYW5lbCBzaG91bGQgYmUgdmlzaWJsZVxuICAgKi9cbiAgZnVuY3Rpb24gdG9nZ2xlUGFuZWwoJHBhbmVsRWxlbSwgbWFrZVZpc2libGUpIHtcbiAgICAkcGFuZWxFbGVtLmF0dHIoJ2FyaWEtaGlkZGVuJywgIW1ha2VWaXNpYmxlKTtcbiAgICBpZiAobWFrZVZpc2libGUpIHtcbiAgICAgICRwYW5lbEVsZW0uY3NzKCdoZWlnaHQnLCAkcGFuZWxFbGVtLmRhdGEoJ2hlaWdodCcpICsgJ3B4Jyk7XG4gICAgICAkcGFuZWxFbGVtLmZpbmQoJ2EsIGJ1dHRvbiwgW3RhYmluZGV4XScpLmF0dHIoJ3RhYmluZGV4JywgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRwYW5lbEVsZW0uY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICAkcGFuZWxFbGVtLmZpbmQoJ2EsIGJ1dHRvbiwgW3RhYmluZGV4XScpLmF0dHIoJ3RhYmluZGV4JywgLTEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgQ1NTIGNsYXNzZXMgdG8gYWNjb3JkaW9uIHBhbmVsc1xuICAgKiBAcGFyYW0ge29iamVjdH0gJHBhbmVsRWxlbSAtIFRoZSBhY2NvcmRpb24gcGFuZWwgalF1ZXJ5IG9iamVjdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFiZWxsZWRieSAtIElEIG9mIGVsZW1lbnQgKGFjY29yZGlvbiBoZWFkZXIpIHRoYXQgbGFiZWxzIHBhbmVsXG4gICAqL1xuICBmdW5jdGlvbiBpbml0aWFsaXplUGFuZWwoJHBhbmVsRWxlbSwgbGFiZWxsZWRieSkge1xuICAgICRwYW5lbEVsZW0uYWRkQ2xhc3MoJ28tYWNjb3JkaW9uX19jb250ZW50Jyk7XG4gICAgY2FsY3VsYXRlUGFuZWxIZWlnaHQoJHBhbmVsRWxlbSk7XG4gICAgJHBhbmVsRWxlbS5hdHRyKHtcbiAgICAgICdhcmlhLWhpZGRlbic6IHRydWUsXG4gICAgICAncm9sZSc6ICdyZWdpb24nLFxuICAgICAgJ2FyaWEtbGFiZWxsZWRieSc6IGxhYmVsbGVkYnlcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYWNjb3JkaW9uIHBhbmVsIGhlaWdodFxuICAgKiBAcGFyYW0ge29iamVjdH0gJHBhbmVsRWxlbSAtIFRoZSBhY2NvcmRpb24gcGFuZWwgalF1ZXJ5IG9iamVjdFxuICAgKi9cbiAgZnVuY3Rpb24gY2FsY3VsYXRlUGFuZWxIZWlnaHQoJHBhbmVsRWxlbSkge1xuICAgICRwYW5lbEVsZW0uZGF0YSgnaGVpZ2h0JywgJHBhbmVsRWxlbS5oZWlnaHQoKSk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIHN0YXRlIGZvciBhY2NvcmRpb24gY2hpbGRyZW5cbiAgICogQHBhcmFtIHtvYmplY3R9ICRpdGVtIC0gVGhlIGFjY29yZGlvbiBpdGVtIGpRdWVyeSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBtYWtlVmlzaWJsZSAtIFdoZXRoZXIgdG8gbWFrZSB0aGUgYWNjb3JkaW9uIGNvbnRlbnQgdmlzaWJsZVxuICAgKi9cbiAgZnVuY3Rpb24gdG9nZ2xlQWNjb3JkaW9uSXRlbSgkaXRlbSwgbWFrZVZpc2libGUpIHtcbiAgICBpZiAobWFrZVZpc2libGUpIHtcbiAgICAgICRpdGVtLmFkZENsYXNzKCdpcy1leHBhbmRlZCcpO1xuICAgICAgJGl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWNvbGxhcHNlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkaXRlbS5yZW1vdmVDbGFzcygnaXMtZXhwYW5kZWQnKTtcbiAgICAgICRpdGVtLmFkZENsYXNzKCdpcy1jb2xsYXBzZWQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIENTUyBjbGFzc2VzIHRvIGFjY29yZGlvbiBjaGlsZHJlblxuICAgKiBAcGFyYW0ge29iamVjdH0gJGl0ZW0gLSBUaGUgYWNjb3JkaW9uIGNoaWxkIGpRdWVyeSBvYmplY3RcbiAgICovXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVBY2NvcmRpb25JdGVtKCRpdGVtKSB7XG4gICAgY29uc3QgJGFjY29yZGlvbkNvbnRlbnQgPSAkaXRlbS5maW5kKCcuanMtYWNjb3JkaW9uX19jb250ZW50Jyk7XG4gICAgY29uc3QgJGFjY29yZGlvbkluaXRpYWxIZWFkZXIgPSAkaXRlbS5maW5kKCcuanMtYWNjb3JkaW9uX19oZWFkZXInKTtcbiAgICAvLyBDbGVhciBhbnkgcHJldmlvdXNseSBib3VuZCBldmVudHNcbiAgICAkaXRlbS5vZmYoJ3RvZ2dsZS5hY2NvcmRpb24nKTtcbiAgICAvLyBDbGVhciBhbnkgZXhpc3Rpbmcgc3RhdGUgY2xhc3Nlc1xuICAgICRpdGVtLnJlbW92ZUNsYXNzKCdpcy1leHBhbmRlZCBpcy1jb2xsYXBzZWQnKTtcbiAgICBpZiAoJGFjY29yZGlvbkNvbnRlbnQubGVuZ3RoICYmICRhY2NvcmRpb25Jbml0aWFsSGVhZGVyLmxlbmd0aCkge1xuICAgICAgJGl0ZW0uYWRkQ2xhc3MoJ28tYWNjb3JkaW9uX19pdGVtJyk7XG4gICAgICBsZXQgJGFjY29yZGlvbkhlYWRlcjtcbiAgICAgIGlmICgkYWNjb3JkaW9uSW5pdGlhbEhlYWRlci5nZXQoMCkudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYnV0dG9uJykge1xuICAgICAgICAkYWNjb3JkaW9uSGVhZGVyID0gJGFjY29yZGlvbkluaXRpYWxIZWFkZXI7XG4gICAgICAgIGNhbGN1bGF0ZVBhbmVsSGVpZ2h0KCRhY2NvcmRpb25Db250ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRhY2NvcmRpb25IZWFkZXIgPSBjb252ZXJ0SGVhZGVyVG9CdXR0b24oJGFjY29yZGlvbkluaXRpYWxIZWFkZXIpO1xuICAgICAgICAkYWNjb3JkaW9uSW5pdGlhbEhlYWRlci5yZXBsYWNlV2l0aCgkYWNjb3JkaW9uSGVhZGVyKTtcbiAgICAgICAgaW5pdGlhbGl6ZUhlYWRlcigkYWNjb3JkaW9uSGVhZGVyLCAkYWNjb3JkaW9uQ29udGVudCk7XG4gICAgICAgIGluaXRpYWxpemVQYW5lbCgkYWNjb3JkaW9uQ29udGVudCwgJGFjY29yZGlvbkhlYWRlci5nZXQoMCkuaWQpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEN1c3RvbSBldmVudCBoYW5kbGVyIHRvIHRvZ2dsZSB0aGUgYWNjb3JkaW9uIGl0ZW0gb3Blbi9jbG9zZWRcbiAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtYWtlVmlzaWJsZSAtIFdoZXRoZXIgdG8gbWFrZSB0aGUgYWNjb3JkaW9uIGNvbnRlbnQgdmlzaWJsZVxuICAgICAgICovXG4gICAgICAkaXRlbS5vbigndG9nZ2xlLmFjY29yZGlvbicsIGZ1bmN0aW9uKGV2ZW50LCBtYWtlVmlzaWJsZSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0b2dnbGVBY2NvcmRpb25JdGVtKCRpdGVtLCBtYWtlVmlzaWJsZSk7XG4gICAgICAgIHRvZ2dsZUhlYWRlcigkYWNjb3JkaW9uSGVhZGVyLCBtYWtlVmlzaWJsZSk7XG4gICAgICAgIHRvZ2dsZVBhbmVsKCRhY2NvcmRpb25Db250ZW50LCBtYWtlVmlzaWJsZSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ29sbGFwc2UgcGFuZWxzIGluaXRpYWxseVxuICAgICAgJGl0ZW0udHJpZ2dlcigndG9nZ2xlLmFjY29yZGlvbicsIFtmYWxzZV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIEFSSUEgYXR0cmlidXRlcyBhbmQgQ1NTIGNsYXNzZXMgdG8gdGhlIHJvb3QgYWNjb3JkaW9uIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0ge29iamVjdH0gJGFjY29yZGlvbkVsZW0gLSBUaGUgalF1ZXJ5IG9iamVjdCBjb250YWluaW5nIHRoZSByb290IGVsZW1lbnQgb2YgdGhlIGFjY29yZGlvblxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG11bHRpU2VsZWN0YWJsZSAtIFdoZXRoZXIgbXVsdGlwbGUgYWNjb3JkaW9uIGRyYXdlcnMgY2FuIGJlIG9wZW4gYXQgdGhlIHNhbWUgdGltZVxuICAgKi9cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgkYWNjb3JkaW9uRWxlbSwgbXVsdGlTZWxlY3RhYmxlKSB7XG4gICAgJGFjY29yZGlvbkVsZW0uYXR0cih7XG4gICAgICAncm9sZSc6ICdwcmVzZW50YXRpb24nLFxuICAgICAgJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJzogbXVsdGlTZWxlY3RhYmxlXG4gICAgfSkuYWRkQ2xhc3MoJ28tYWNjb3JkaW9uJyk7XG4gICAgJGFjY29yZGlvbkVsZW0uY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgaW5pdGlhbGl6ZUFjY29yZGlvbkl0ZW0oJCh0aGlzKSk7XG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogSGFuZGxlIGNoYW5nZVN0YXRlIGV2ZW50cyBvbiBhY2NvcmRpb24gaGVhZGVycy5cbiAgICAgKiBDbG9zZSB0aGUgb3BlbiBhY2NvcmRpb24gaXRlbSBhbmQgb3BlbiB0aGUgbmV3IG9uZS5cbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICovXG4gICAgJGFjY29yZGlvbkVsZW0ub24oJ2NoYW5nZVN0YXRlLmFjY29yZGlvbicsICcuanMtYWNjb3JkaW9uX19oZWFkZXInLCAkLnByb3h5KGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBjb25zdCAkbmV3SXRlbSA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcuby1hY2NvcmRpb25fX2l0ZW0nKTtcbiAgICAgIGlmIChtdWx0aVNlbGVjdGFibGUpIHtcbiAgICAgICAgJG5ld0l0ZW0udHJpZ2dlcigndG9nZ2xlLmFjY29yZGlvbicsIFshJG5ld0l0ZW0uaGFzQ2xhc3MoJ2lzLWV4cGFuZGVkJyldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0ICRvcGVuSXRlbSA9ICRhY2NvcmRpb25FbGVtLmZpbmQoJy5pcy1leHBhbmRlZCcpO1xuICAgICAgICAkb3Blbkl0ZW0udHJpZ2dlcigndG9nZ2xlLmFjY29yZGlvbicsIFtmYWxzZV0pO1xuICAgICAgICBpZiAoJG9wZW5JdGVtLmdldCgwKSAhPT0gJG5ld0l0ZW0uZ2V0KDApKSB7XG4gICAgICAgICAgJG5ld0l0ZW0udHJpZ2dlcigndG9nZ2xlLmFjY29yZGlvbicsIFt0cnVlXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVpbml0aWFsaXplIGFuIGFjY29yZGlvbiBhZnRlciBpdHMgY29udGVudHMgd2VyZSBkeW5hbWljYWxseSB1cGRhdGVkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkYWNjb3JkaW9uRWxlbSAtIFRoZSBqUXVlcnkgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGUgYWNjb3JkaW9uXG4gICAqL1xuICBmdW5jdGlvbiByZUluaXRpYWxpemUoJGFjY29yZGlvbkVsZW0pIHtcbiAgICBpZiAoJGFjY29yZGlvbkVsZW0uaGFzQ2xhc3MoJ28tYWNjb3JkaW9uJykpIHtcbiAgICAgICRhY2NvcmRpb25FbGVtLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgaW5pdGlhbGl6ZUFjY29yZGlvbkl0ZW0oJCh0aGlzKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbXVsdGlTZWxlY3RhYmxlID0gJGFjY29yZGlvbkVsZW0uZGF0YSgnbXVsdGlzZWxlY3RhYmxlJykgfHwgZmFsc2U7XG4gICAgICBpbml0aWFsaXplKCRhY2NvcmRpb25FbGVtLCBtdWx0aVNlbGVjdGFibGUpO1xuICAgIH1cbiAgfVxuICB3aW5kb3cucmVJbml0aWFsaXplQWNjb3JkaW9uID0gcmVJbml0aWFsaXplO1xuXG4gIGNvbnN0ICRhY2NvcmRpb25zID0gJCgnLmpzLWFjY29yZGlvbicpLm5vdCgnLm8tYWNjb3JkaW9uJyk7XG4gIGlmICgkYWNjb3JkaW9ucy5sZW5ndGgpIHtcbiAgICAkYWNjb3JkaW9ucy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbXVsdGlTZWxlY3RhYmxlID0gJCh0aGlzKS5kYXRhKCdtdWx0aXNlbGVjdGFibGUnKSB8fCBmYWxzZTtcbiAgICAgIGluaXRpYWxpemUoJCh0aGlzKSwgbXVsdGlTZWxlY3RhYmxlKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBIYW5kbGUgZm9udHNBY3RpdmUgZXZlbnRzIGZpcmVkIG9uY2UgVHlwZWtpdCByZXBvcnRzIHRoYXQgdGhlIGZvbnRzIGFyZSBhY3RpdmUuXG4gICAgICAgKiBAc2VlIGJhc2UudHdpZyBmb3IgdGhlIFR5cGVraXQubG9hZCgpIGZ1bmN0aW9uXG4gICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAqL1xuICAgICAgJCh0aGlzKS5vbignZm9udHNBY3RpdmUnLCAkLnByb3h5KGZ1bmN0aW9uKCkge1xuICAgICAgICByZUluaXRpYWxpemUoJCh0aGlzKSk7XG4gICAgICB9LCB0aGlzKSk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2FjY29yZGlvbi5qcyIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5RWFjaC5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VGb3JPd24gPSByZXF1aXJlKCcuL19iYXNlRm9yT3duJyksXG4gICAgY3JlYXRlQmFzZUVhY2ggPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRWFjaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckVhY2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG52YXIgYmFzZUVhY2ggPSBjcmVhdGVCYXNlRWFjaChiYXNlRm9yT3duKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRWFjaDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9fYmFzZUZvcicpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9yT3duKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBiYXNlRm9yKG9iamVjdCwgaXRlcmF0ZWUsIGtleXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JPd247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3JPd24uanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBjcmVhdGVCYXNlRm9yID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUZvcicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9yT3duYCB3aGljaCBpdGVyYXRlcyBvdmVyIGBvYmplY3RgXG4gKiBwcm9wZXJ0aWVzIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvci5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUZvcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUZvci5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGFycmF5TGlrZUtleXMgPSByZXF1aXJlKCcuL19hcnJheUxpa2VLZXlzJyksXG4gICAgYmFzZUtleXMgPSByZXF1aXJlKCcuL19iYXNlS2V5cycpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanNcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlMaWtlS2V5cy5qc1xuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVGltZXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qc1xuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJndW1lbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qc1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKSxcbiAgICBzdHViRmFsc2UgPSByZXF1aXJlKCcuL3N0dWJGYWxzZScpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNCdWZmZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanNcbi8vIG1vZHVsZSBpZCA9IDMwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViRmFsc2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzXG4vLyBtb2R1bGUgaWQgPSAzMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSAmJlxuICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0luZGV4O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Jhc2VJc1R5cGVkQXJyYXknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanNcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNUeXBlZEFycmF5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNUeXBlZEFycmF5LmpzXG4vLyBtb2R1bGUgaWQgPSAzNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVVuYXJ5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanNcbi8vIG1vZHVsZSBpZCA9IDM1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzXG4vLyBtb2R1bGUgaWQgPSAzNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanNcbi8vIG1vZHVsZSBpZCA9IDM3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNQcm90b3R5cGUuanNcbi8vIG1vZHVsZSBpZCA9IDM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qc1xuLy8gbW9kdWxlIGlkID0gMzlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlckFyZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qc1xuLy8gbW9kdWxlIGlkID0gNDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSA0MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VFYWNoLmpzXG4vLyBtb2R1bGUgaWQgPSA0MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBgaWRlbnRpdHlgIGlmIGl0J3Mgbm90IGEgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgY2FzdCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY2FzdEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlIDogaWRlbnRpdHk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdEZ1bmN0aW9uO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0RnVuY3Rpb24uanNcbi8vIG1vZHVsZSBpZCA9IDQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKlxuICogY29uc29sZS5sb2coXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaWRlbnRpdHk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaWRlbnRpdHkuanNcbi8vIG1vZHVsZSBpZCA9IDQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuKiBTaW1wbGUgYWNjb3JkaW9uIG1vZHVsZVxuKiBAbW9kdWxlIG1vZHVsZXMvc2ltcGxlQWNjb3JkaW9uXG4qIEBzZWUgaHR0cHM6Ly9wZXJpc2hhYmxlcHJlc3MuY29tL2pxdWVyeS1hY2NvcmRpb24tbWVudS10dXRvcmlhbC9cbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgLy8kKCcuanMtYWNjb3JkaW9uID4gdWwgPiBsaTpoYXMob2wpJykuYWRkQ2xhc3MoXCJoYXMtc3ViXCIpO1xuICAkKCcuanMtcy1hY2NvcmRpb24gPiBsaSA+IGgzLmpzLXMtYWNjb3JkaW9uX19oZWFkZXInKS5hcHBlbmQoJzxzdmcgY2xhc3M9XCJvLWFjY29yZGlvbl9fY2FyZXQgaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWNhcmV0LWRvd25cIj48L3VzZT48L3N2Zz4nKTtcblxuICAkKCcuanMtcy1hY2NvcmRpb24gPiBsaSA+IGgzLmpzLXMtYWNjb3JkaW9uX19oZWFkZXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICB2YXIgY2hlY2tFbGVtZW50ID0gJCh0aGlzKS5uZXh0KCk7XG5cbiAgICAkKCcuanMtcy1hY2NvcmRpb24gbGknKS5yZW1vdmVDbGFzcygnaXMtZXhwYW5kZWQnKTtcbiAgICAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykuYWRkQ2xhc3MoJ2lzLWV4cGFuZGVkJyk7XG5cblxuICAgIGlmKChjaGVja0VsZW1lbnQuaXMoJy5qcy1zLWFjY29yZGlvbl9fY29udGVudCcpKSAmJiAoY2hlY2tFbGVtZW50LmlzKCc6dmlzaWJsZScpKSkge1xuICAgICAgJCh0aGlzKS5jbG9zZXN0KCdsaScpLnJlbW92ZUNsYXNzKCdpcy1leHBhbmRlZCcpO1xuICAgICAgY2hlY2tFbGVtZW50LnNsaWRlVXAoJ25vcm1hbCcpO1xuICAgIH1cblxuICAgIGlmKChjaGVja0VsZW1lbnQuaXMoJy5qcy1zLWFjY29yZGlvbl9fY29udGVudCcpKSAmJiAoIWNoZWNrRWxlbWVudC5pcygnOnZpc2libGUnKSkpIHtcbiAgICAgICQoJy5qcy1zLWFjY29yZGlvbiAuanMtcy1hY2NvcmRpb25fX2NvbnRlbnQ6dmlzaWJsZScpLnNsaWRlVXAoJ25vcm1hbCcpO1xuICAgICAgY2hlY2tFbGVtZW50LnNsaWRlRG93bignbm9ybWFsJyk7XG4gICAgfVxuXG4gICAgaWYgKGNoZWNrRWxlbWVudC5pcygnLmpzLXMtYWNjb3JkaW9uX19jb250ZW50JykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9zaW1wbGVBY2NvcmRpb24uanMiLCIvKipcbiAqIE9mZmNhbnZhcyBtb2R1bGVcbiAqIEBtb2R1bGUgbW9kdWxlcy9vZmZjYW52YXNcbiAqIEBzZWUgbW9kdWxlcy90b2dnbGVPcGVuXG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuXG4vKipcbiAqIFNoaWZ0IGtleWJvYXJkIGZvY3VzIHdoZW4gdGhlIG9mZmNhbnZhcyBuYXYgaXMgb3Blbi5cbiAqIFRoZSAnY2hhbmdlT3BlblN0YXRlJyBldmVudCBpcyBmaXJlZCBieSBtb2R1bGVzL3RvZ2dsZU9wZW5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IG9mZkNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1vZmZjYW52YXMnKTtcbiAgaWYgKG9mZkNhbnZhcykge1xuICAgIGZvckVhY2gob2ZmQ2FudmFzLCBmdW5jdGlvbihvZmZDYW52YXNFbGVtKSB7XG4gICAgICBjb25zdCBvZmZDYW52YXNTaWRlID0gb2ZmQ2FudmFzRWxlbS5xdWVyeVNlbGVjdG9yKCcuanMtb2ZmY2FudmFzX19zaWRlJyk7XG5cbiAgICAgIC8qKlxuICAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yICdjaGFuZ2VPcGVuU3RhdGUnLlxuICAgICAgKiBUaGUgdmFsdWUgb2YgZXZlbnQuZGV0YWlsIGluZGljYXRlcyB3aGV0aGVyIHRoZSBvcGVuIHN0YXRlIGlzIHRydWVcbiAgICAgICogKGkuZS4gdGhlIG9mZmNhbnZhcyBjb250ZW50IGlzIHZpc2libGUpLlxuICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgKi9cbiAgICAgIG9mZkNhbnZhc0VsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlT3BlblN0YXRlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmRldGFpbCkge1xuICAgICAgICAgIGlmICghKC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaS50ZXN0KG9mZkNhbnZhc1NpZGUudGFnTmFtZSkpKSB7XG4gICAgICAgICAgICBvZmZDYW52YXNTaWRlLnRhYkluZGV4ID0gLTE7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9mZkNhbnZhc1NpZGUuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSwgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9vZmZjYW52YXMuanMiLCIvKipcbiAqIE92ZXJsYXkgbW9kdWxlXG4gKiBAbW9kdWxlIG1vZHVsZXMvb3ZlcmxheVxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcblxuLyoqXG4gKiBTaGlmdCBrZXlib2FyZCBmb2N1cyB3aGVuIHRoZSBzZWFyY2ggb3ZlcmxheSBpcyBvcGVuLlxuICogVGhlICdjaGFuZ2VPcGVuU3RhdGUnIGV2ZW50IGlzIGZpcmVkIGJ5IG1vZHVsZXMvdG9nZ2xlT3BlblxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1vdmVybGF5Jyk7XG4gIGlmIChvdmVybGF5KSB7XG4gICAgZm9yRWFjaChvdmVybGF5LCBmdW5jdGlvbihvdmVybGF5RWxlbSkge1xuICAgICAgLyoqXG4gICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgJ2NoYW5nZU9wZW5TdGF0ZScuXG4gICAgICAqIFRoZSB2YWx1ZSBvZiBldmVudC5kZXRhaWwgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIG9wZW4gc3RhdGUgaXMgdHJ1ZVxuICAgICAgKiAoaS5lLiB0aGUgb3ZlcmxheSBpcyB2aXNpYmxlKS5cbiAgICAgICogQGZ1bmN0aW9uXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICovXG4gICAgICBvdmVybGF5RWxlbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2VPcGVuU3RhdGUnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuZGV0YWlsKSB7XG4gICAgICAgICAgaWYgKCEoL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pLnRlc3Qob3ZlcmxheS50YWdOYW1lKSkpIHtcbiAgICAgICAgICAgIG92ZXJsYXkudGFiSW5kZXggPSAtMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW92ZXJsYXkgaW5wdXQnKSkge1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW92ZXJsYXkgaW5wdXQnKVswXS5mb2N1cygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdmVybGF5LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL292ZXJsYXkuanMiLCIvKipcbiogU3RpY2sgTmF2IG1vZHVsZVxuKiBAbW9kdWxlIG1vZHVsZXMvc3RpY2t5TmF2XG4qL1xuXG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnbG9kYXNoL3Rocm90dGxlJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2gvZGVib3VuY2UnO1xuaW1wb3J0IGltYWdlc1JlYWR5IGZyb20gJ2ltYWdlc3JlYWR5L2Rpc3QvaW1hZ2VzcmVhZHkuanMnO1xuXG4vKipcbiogXCJTdGlja1wiIGNvbnRlbnQgaW4gcGxhY2UgYXMgdGhlIHVzZXIgc2Nyb2xsc1xuKiBAcGFyYW0ge29iamVjdH0gJGVsZW0gLSBqUXVlcnkgZWxlbWVudCB0aGF0IHNob3VsZCBiZSBzdGlja3lcbiogQHBhcmFtIHtvYmplY3R9ICRlbGVtQ29udGFpbmVyIC0galF1ZXJ5IGVsZW1lbnQgZm9yIHRoZSBlbGVtZW50J3MgY29udGFpbmVyLiBVc2VkIHRvIHNldCB0aGUgdG9wIGFuZCBib3R0b20gcG9pbnRzXG4qIEBwYXJhbSB7b2JqZWN0fSAkZWxlbUFydGljbGUgLSBDb250ZW50IG5leHQgdG8gdGhlIHN0aWNreSBuYXZcbiovXG5mdW5jdGlvbiBzdGlja3lOYXYoJGVsZW0sICRlbGVtQ29udGFpbmVyLCAkZWxlbUFydGljbGUpIHtcbiAgLy8gTW9kdWxlIHNldHRpbmdzXG4gIGNvbnN0IHNldHRpbmdzID0ge1xuICAgIHN0aWNreUNsYXNzOiAnaXMtc3RpY2t5JyxcbiAgICBhYnNvbHV0ZUNsYXNzOiAnaXMtc3R1Y2snLFxuICAgIGxhcmdlQnJlYWtwb2ludDogJzEwMjRweCcsXG4gICAgYXJ0aWNsZUNsYXNzOiAnby1hcnRpY2xlLS1zaGlmdCdcbiAgfTtcblxuICAvLyBHbG9iYWxzXG4gIGxldCBzdGlja3lNb2RlID0gZmFsc2U7IC8vIEZsYWcgdG8gdGVsbCBpZiBzaWRlYmFyIGlzIGluIFwic3RpY2t5IG1vZGVcIlxuICBsZXQgaXNTdGlja3kgPSBmYWxzZTsgLy8gV2hldGhlciB0aGUgc2lkZWJhciBpcyBzdGlja3kgYXQgdGhpcyBleGFjdCBtb21lbnQgaW4gdGltZVxuICBsZXQgaXNBYnNvbHV0ZSA9IGZhbHNlOyAvLyBXaGV0aGVyIHRoZSBzaWRlYmFyIGlzIGFic29sdXRlbHkgcG9zaXRpb25lZCBhdCB0aGUgYm90dG9tXG4gIGxldCBzd2l0Y2hQb2ludCA9IDA7IC8vIFBvaW50IGF0IHdoaWNoIHRvIHN3aXRjaCB0byBzdGlja3kgbW9kZVxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBsZXQgc3dpdGNoUG9pbnRCb3R0b20gPSAwOyAvLyBQb2ludCBhdCB3aGljaCB0byBcImZyZWV6ZVwiIHRoZSBzaWRlYmFyIHNvIGl0IGRvZXNuJ3Qgb3ZlcmxhcCB0aGUgZm9vdGVyXG4gIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgbGV0IGxlZnRPZmZzZXQgPSAwOyAvLyBBbW91bnQgc2lkZWJhciBzaG91bGQgYmUgc2V0IGZyb20gdGhlIGxlZnQgc2lkZVxuICBsZXQgZWxlbVdpZHRoID0gMDsgLy8gV2lkdGggaW4gcGl4ZWxzIG9mIHNpZGViYXJcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgbGV0IGVsZW1IZWlnaHQgPSAwOyAvLyBIZWlnaHQgaW4gcGl4ZWxzIG9mIHNpZGViYXJcbiAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG4gIC8qKlxuICAqIFRvZ2dsZSB0aGUgc3RpY2t5IGJlaGF2aW9yXG4gICpcbiAgKiBUdXJucyBvbiBpZiB0aGUgdXNlciBoYXMgc2Nyb2xsZWQgcGFzdCB0aGUgc3dpdGNoIHBvaW50LCBvZmYgaWYgdGhleSBzY3JvbGwgYmFjayB1cFxuICAqIElmIHN0aWNreSBtb2RlIGlzIG9uLCBzZXRzIHRoZSBsZWZ0IG9mZnNldCBhcyB3ZWxsXG4gICovXG4gIGZ1bmN0aW9uIHRvZ2dsZVN0aWNreSgpIHtcbiAgICBjb25zdCBjdXJyZW50U2Nyb2xsUG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgaWYgKGN1cnJlbnRTY3JvbGxQb3MgPiBzd2l0Y2hQb2ludCkge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHNpZGViYXIgaXMgYWxyZWFkeSBzdGlja3lcbiAgICAgIGlmICghaXNTdGlja3kpIHtcbiAgICAgICAgaXNTdGlja3kgPSB0cnVlO1xuICAgICAgICBpc0Fic29sdXRlID0gZmFsc2U7XG4gICAgICAgICRlbGVtLmFkZENsYXNzKHNldHRpbmdzLnN0aWNreUNsYXNzKS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5hYnNvbHV0ZUNsYXNzKTtcbiAgICAgICAgJGVsZW1BcnRpY2xlLmFkZENsYXNzKHNldHRpbmdzLmFydGljbGVDbGFzcyk7XG4gICAgICAgIHVwZGF0ZURpbWVuc2lvbnMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHNpZGViYXIgaGFzIHJlYWNoZWQgdGhlIGJvdHRvbSBzd2l0Y2ggcG9pbnRcbiAgICAgIGlmICgkKCcuYy1mb290ZXJfX3JlYWNoZWQnKS5pc09uU2NyZWVuKCkpIHtcbiAgICAgICAgaXNTdGlja3kgPSBmYWxzZTtcbiAgICAgICAgaXNBYnNvbHV0ZSA9IHRydWU7XG4gICAgICAgICRlbGVtLmFkZENsYXNzKHNldHRpbmdzLmFic29sdXRlQ2xhc3MpO1xuICAgICAgICB1cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgICB9XG5cbiAgICB9IGVsc2UgaWYgKGlzU3RpY2t5IHx8IGlzQWJzb2x1dGUpIHtcbiAgICAgIGlzU3RpY2t5ID0gZmFsc2U7XG4gICAgICBpc0Fic29sdXRlID0gZmFsc2U7XG4gICAgICAkZWxlbS5yZW1vdmVDbGFzcyhgJHtzZXR0aW5ncy5zdGlja3lDbGFzc30gJHtzZXR0aW5ncy5hYnNvbHV0ZUNsYXNzfWApO1xuICAgICAgJGVsZW1BcnRpY2xlLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFydGljbGVDbGFzcyk7XG4gICAgICB1cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogVXBkYXRlIGRpbWVuc2lvbnMgb24gc2lkZWJhclxuICAqXG4gICogU2V0IHRvIHRoZSBjdXJyZW50IHZhbHVlcyBvZiBsZWZ0T2Zmc2V0IGFuZCBlbGVtV2lkdGggaWYgdGhlIGVsZW1lbnQgaXNcbiAgKiBjdXJyZW50bHkgc3RpY2t5LiBPdGhlcndpc2UsIGNsZWFyIGFueSBwcmV2aW91c2x5IHNldCB2YWx1ZXNcbiAgKlxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2VDbGVhciAtIEZsYWcgdG8gY2xlYXIgc2V0IHZhbHVlcyByZWdhcmRsZXNzIG9mIHN0aWNreSBzdGF0dXNcbiAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlRGltZW5zaW9ucyhmb3JjZUNsZWFyKSB7XG4gICAgaWYgKGlzU3RpY2t5ICYmICFmb3JjZUNsZWFyKSB7XG4gICAgICAkZWxlbS5jc3Moe1xuICAgICAgICBsZWZ0OiBsZWZ0T2Zmc2V0ICsgJ3B4JyxcbiAgICAgICAgd2lkdGg6IGVsZW1XaWR0aCArICdweCcsXG4gICAgICAgIHRvcDogJycsXG4gICAgICAgIGJvdHRvbTogJydcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoaXNBYnNvbHV0ZSAmJiAhZm9yY2VDbGVhcikge1xuICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgbGVmdDogJGVsZW1Db250YWluZXIuY3NzKCdwYWRkaW5nLWxlZnQnKSxcbiAgICAgICAgd2lkdGg6IGVsZW1XaWR0aCArICdweCcsXG4gICAgICAgIHRvcDogJ2F1dG8nLFxuICAgICAgICBib3R0b206ICRlbGVtQ29udGFpbmVyLmNzcygncGFkZGluZy1ib3R0b20nKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtLmNzcyh7XG4gICAgICAgIGxlZnQ6ICcnLFxuICAgICAgICB3aWR0aDogJycsXG4gICAgICAgIHRvcDogJycsXG4gICAgICAgIGJvdHRvbTogJydcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIFNldCB0aGUgc3dpdGNocG9pbnQgZm9yIHRoZSBlbGVtZW50IGFuZCBnZXQgaXRzIGN1cnJlbnQgb2Zmc2V0c1xuICAqL1xuICBmdW5jdGlvbiBzZXRPZmZzZXRWYWx1ZXMoKSB7XG4gICAgJGVsZW0uY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgIGlmIChpc1N0aWNreSB8fCBpc0Fic29sdXRlKSB7XG4gICAgICAkZWxlbS5yZW1vdmVDbGFzcyhgJHtzZXR0aW5ncy5zdGlja3lDbGFzc30gJHtzZXR0aW5ncy5hYnNvbHV0ZUNsYXNzfWApO1xuICAgICAgJGVsZW1BcnRpY2xlLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFydGljbGVDbGFzcyk7XG4gICAgfVxuICAgIHVwZGF0ZURpbWVuc2lvbnModHJ1ZSk7XG5cbiAgICBzd2l0Y2hQb2ludCA9ICRlbGVtLm9mZnNldCgpLnRvcDtcbiAgICAvLyBCb3R0b20gc3dpdGNoIHBvaW50IGlzIGVxdWFsIHRvIHRoZSBvZmZzZXQgYW5kIGhlaWdodCBvZiB0aGUgb3V0ZXIgY29udGFpbmVyLCBtaW51cyBhbnkgcGFkZGluZyBvbiB0aGUgYm90dG9tXG4gICAgc3dpdGNoUG9pbnRCb3R0b20gPSAkZWxlbUNvbnRhaW5lci5vZmZzZXQoKS50b3AgKyAkZWxlbUNvbnRhaW5lci5vdXRlckhlaWdodCgpIC1cbiAgICAgIHBhcnNlSW50KCRlbGVtQ29udGFpbmVyLmNzcygncGFkZGluZy1ib3R0b20nKSwgMTApO1xuXG4gICAgbGVmdE9mZnNldCA9ICRlbGVtLm9mZnNldCgpLmxlZnQ7XG4gICAgZWxlbVdpZHRoID0gJGVsZW0ub3V0ZXJXaWR0aCgpO1xuICAgIGVsZW1IZWlnaHQgPSAkZWxlbS5vdXRlckhlaWdodCgpO1xuXG4gICAgaWYgKGlzU3RpY2t5IHx8IGlzQWJzb2x1dGUpIHtcbiAgICAgIHVwZGF0ZURpbWVuc2lvbnMoKTtcbiAgICAgICRlbGVtLmFkZENsYXNzKHNldHRpbmdzLnN0aWNreUNsYXNzKTtcbiAgICAgICRlbGVtQXJ0aWNsZS5hZGRDbGFzcyhzZXR0aW5ncy5hcnRpY2xlQ2xhc3MpO1xuICAgICAgaWYgKGlzQWJzb2x1dGUpIHtcbiAgICAgICAgJGVsZW0uYWRkQ2xhc3Moc2V0dGluZ3MuYWJzb2x1dGVDbGFzcyk7XG4gICAgICB9XG4gICAgfVxuICAgICRlbGVtLmNzcygndmlzaWJpbGl0eScsICcnKTtcbiAgfVxuXG4gIC8qKlxuICAqIFR1cm4gb24gXCJzdGlja3kgbW9kZVwiXG4gICpcbiAgKiBXYXRjaCBmb3Igc2Nyb2xsIGFuZCBmaXggdGhlIHNpZGViYXIuIFdhdGNoIGZvciBzaXplcyBjaGFuZ2VzIG9uICNtYWluXG4gICogKHdoaWNoIG1heSBjaGFuZ2UgaWYgcGFyYWxsYXggaXMgdXNlZCkgYW5kIGFkanVzdCBhY2NvcmRpbmdseS5cbiAgKi9cbiAgZnVuY3Rpb24gc3RpY2t5TW9kZU9uKCkge1xuICAgIHN0aWNreU1vZGUgPSB0cnVlO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwuZml4ZWRTaWRlYmFyJywgdGhyb3R0bGUoZnVuY3Rpb24oKSB7XG4gICAgICB0b2dnbGVTdGlja3koKTtcbiAgICB9LCAxMDApKS50cmlnZ2VyKCdzY3JvbGwuZml4ZWRTaWRlYmFyJyk7XG5cbiAgICAkKCcjbWFpbicpLm9uKCdjb250YWluZXJTaXplQ2hhbmdlLmZpeGVkU2lkZWJhcicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBzd2l0Y2hQb2ludCAtPSBldmVudC5vcmlnaW5hbEV2ZW50LmRldGFpbDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAqIFR1cm4gb2ZmIFwic3RpY2t5IG1vZGVcIlxuICAqXG4gICogUmVtb3ZlIHRoZSBldmVudCBiaW5kaW5nIGFuZCByZXNldCBldmVyeXRoaW5nXG4gICovXG4gIGZ1bmN0aW9uIHN0aWNreU1vZGVPZmYoKSB7XG4gICAgaWYgKGlzU3RpY2t5KSB7XG4gICAgICB1cGRhdGVEaW1lbnNpb25zKHRydWUpO1xuICAgICAgJGVsZW0ucmVtb3ZlQ2xhc3Moc2V0dGluZ3Muc3RpY2t5Q2xhc3MpO1xuICAgIH1cbiAgICAkKHdpbmRvdykub2ZmKCdzY3JvbGwuZml4ZWRTaWRlYmFyJyk7XG4gICAgJCgnI21haW4nKS5vZmYoJ2NvbnRhaW5lclNpemVDaGFuZ2UuZml4ZWRTaWRlYmFyJyk7XG4gICAgc3RpY2t5TW9kZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICogSGFuZGxlICdyZXNpemUnIGV2ZW50XG4gICpcbiAgKiBUdXJuIHN0aWNreSBtb2RlIG9uL29mZiBkZXBlbmRpbmcgb24gd2hldGhlciB3ZSdyZSBpbiBkZXNrdG9wIG1vZGVcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0aWNreU1vZGUgLSBXaGV0aGVyIHNpZGViYXIgc2hvdWxkIGJlIGNvbnNpZGVyZWQgc3RpY2t5XG4gICovXG4gIGZ1bmN0aW9uIG9uUmVzaXplKCkge1xuICAgIGNvbnN0IGxhcmdlTW9kZSA9IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiAnICtcbiAgICAgIHNldHRpbmdzLmxhcmdlQnJlYWtwb2ludCArICcpJykubWF0Y2hlcztcbiAgICBpZiAobGFyZ2VNb2RlKSB7XG4gICAgICBzZXRPZmZzZXRWYWx1ZXMoKTtcbiAgICAgIGlmICghc3RpY2t5TW9kZSkge1xuICAgICAgICBzdGlja3lNb2RlT24oKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN0aWNreU1vZGUpIHtcbiAgICAgIHN0aWNreU1vZGVPZmYoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBJbml0aWFsaXplIHRoZSBzdGlja3kgbmF2XG4gICogQHBhcmFtIHtvYmplY3R9IGVsZW0gLSBET00gZWxlbWVudCB0aGF0IHNob3VsZCBiZSBzdGlja3lcbiAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMuIFdpbGwgb3ZlcnJpZGUgbW9kdWxlIGRlZmF1bHRzIHdoZW4gcHJlc2VudFxuICAqL1xuICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgICQod2luZG93KS5vbigncmVzaXplLmZpeGVkU2lkZWJhcicsIGRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgb25SZXNpemUoKTtcbiAgICB9LCAxMDApKTtcblxuICAgIGltYWdlc1JlYWR5KGRvY3VtZW50LmJvZHkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBvblJlc2l6ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpO1xuXG4gICQuZm4uaXNPblNjcmVlbiA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHdpbiA9ICQod2luZG93KTtcblxuICAgIHZhciB2aWV3cG9ydCA9IHtcbiAgICAgICAgdG9wIDogd2luLnNjcm9sbFRvcCgpLFxuICAgICAgICBsZWZ0IDogd2luLnNjcm9sbExlZnQoKVxuICAgIH07XG4gICAgdmlld3BvcnQucmlnaHQgPSB2aWV3cG9ydC5sZWZ0ICsgd2luLndpZHRoKCk7XG4gICAgdmlld3BvcnQuYm90dG9tID0gdmlld3BvcnQudG9wICsgd2luLmhlaWdodCgpO1xuXG4gICAgdmFyIGJvdW5kcyA9IHRoaXMub2Zmc2V0KCk7XG4gICAgYm91bmRzLnJpZ2h0ID0gYm91bmRzLmxlZnQgKyB0aGlzLm91dGVyV2lkdGgoKTtcbiAgICBib3VuZHMuYm90dG9tID0gYm91bmRzLnRvcCArIHRoaXMub3V0ZXJIZWlnaHQoKTtcblxuICAgIHJldHVybiAoISh2aWV3cG9ydC5yaWdodCA8IGJvdW5kcy5sZWZ0IHx8IHZpZXdwb3J0LmxlZnQgPiBib3VuZHMucmlnaHQgfHwgdmlld3BvcnQuYm90dG9tIDwgYm91bmRzLnRvcCB8fCB2aWV3cG9ydC50b3AgPiBib3VuZHMuYm90dG9tKSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBjb25zdCAkc3RpY2t5TmF2cyA9ICQoJy5qcy1zdGlja3knKTtcbiAgaWYgKCRzdGlja3lOYXZzLmxlbmd0aCkge1xuICAgICRzdGlja3lOYXZzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgJG91dGVyQ29udGFpbmVyID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc3RpY2t5LWNvbnRhaW5lcicpO1xuICAgICAgbGV0ICRhcnRpY2xlID0gJG91dGVyQ29udGFpbmVyLmZpbmQoJy5qcy1zdGlja3ktYXJ0aWNsZScpO1xuICAgICAgc3RpY2t5TmF2KCQodGhpcyksICRvdXRlckNvbnRhaW5lciwgJGFydGljbGUpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9zdGlja05hdi5qcyIsInZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJy4vZGVib3VuY2UnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgdGhyb3R0bGVkIGZ1bmN0aW9uIHRoYXQgb25seSBpbnZva2VzIGBmdW5jYCBhdCBtb3N0IG9uY2UgcGVyXG4gKiBldmVyeSBgd2FpdGAgbWlsbGlzZWNvbmRzLiBUaGUgdGhyb3R0bGVkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYFxuICogbWV0aG9kIHRvIGNhbmNlbCBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0b1xuICogaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgXG4gKiBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGUgbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgXG4gKiB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWQgd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlXG4gKiB0aHJvdHRsZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnQgY2FsbHMgdG8gdGhlIHRocm90dGxlZCBmdW5jdGlvbiByZXR1cm4gdGhlXG4gKiByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8udGhyb3R0bGVgIGFuZCBgXy5kZWJvdW5jZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB0aHJvdHRsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB0aHJvdHRsZSBpbnZvY2F0aW9ucyB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB0aHJvdHRsZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGV4Y2Vzc2l2ZWx5IHVwZGF0aW5nIHRoZSBwb3NpdGlvbiB3aGlsZSBzY3JvbGxpbmcuXG4gKiBqUXVlcnkod2luZG93KS5vbignc2Nyb2xsJywgXy50aHJvdHRsZSh1cGRhdGVQb3NpdGlvbiwgMTAwKSk7XG4gKlxuICogLy8gSW52b2tlIGByZW5ld1Rva2VuYCB3aGVuIHRoZSBjbGljayBldmVudCBpcyBmaXJlZCwgYnV0IG5vdCBtb3JlIHRoYW4gb25jZSBldmVyeSA1IG1pbnV0ZXMuXG4gKiB2YXIgdGhyb3R0bGVkID0gXy50aHJvdHRsZShyZW5ld1Rva2VuLCAzMDAwMDAsIHsgJ3RyYWlsaW5nJzogZmFsc2UgfSk7XG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgdGhyb3R0bGVkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIHRocm90dGxlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgdGhyb3R0bGVkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxlYWRpbmcgPSB0cnVlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAnbGVhZGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy5sZWFkaW5nIDogbGVhZGluZztcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG4gIHJldHVybiBkZWJvdW5jZShmdW5jLCB3YWl0LCB7XG4gICAgJ2xlYWRpbmcnOiBsZWFkaW5nLFxuICAgICdtYXhXYWl0Jzogd2FpdCxcbiAgICAndHJhaWxpbmcnOiB0cmFpbGluZ1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aHJvdHRsZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC90aHJvdHRsZS5qc1xuLy8gbW9kdWxlIGlkID0gNDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbm93O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL25vdy5qc1xuLy8gbW9kdWxlIGlkID0gNTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanNcbi8vIG1vZHVsZSBpZCA9IDUxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N5bWJvbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qc1xuLy8gbW9kdWxlIGlkID0gNTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogaW1hZ2VzcmVhZHkgdjAuMi4yIC0gMjAxNS0wNy0wNFQwNjoyMjoxNC40MzVaIC0gaHR0cHM6Ly9naXRodWIuY29tL3ItcGFyay9pbWFnZXMtcmVhZHkgKi9cbjsoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICByb290LmltYWdlc1JlYWR5ID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIFVzZSB0aGUgZmFzdGVzdCBtZWFucyBwb3NzaWJsZSB0byBleGVjdXRlIGEgdGFzayBpbiBpdHMgb3duIHR1cm4sIHdpdGhcbi8vIHByaW9yaXR5IG92ZXIgb3RoZXIgZXZlbnRzIGluY2x1ZGluZyBJTywgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZWRyYXdcbi8vIGV2ZW50cyBpbiBicm93c2Vycy5cbi8vXG4vLyBBbiBleGNlcHRpb24gdGhyb3duIGJ5IGEgdGFzayB3aWxsIHBlcm1hbmVudGx5IGludGVycnVwdCB0aGUgcHJvY2Vzc2luZyBvZlxuLy8gc3Vic2VxdWVudCB0YXNrcy4gVGhlIGhpZ2hlciBsZXZlbCBgYXNhcGAgZnVuY3Rpb24gZW5zdXJlcyB0aGF0IGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duIGJ5IGEgdGFzaywgdGhhdCB0aGUgdGFzayBxdWV1ZSB3aWxsIGNvbnRpbnVlIGZsdXNoaW5nIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLCBidXQgaWYgeW91IHVzZSBgcmF3QXNhcGAgZGlyZWN0bHksIHlvdSBhcmUgcmVzcG9uc2libGUgdG9cbi8vIGVpdGhlciBlbnN1cmUgdGhhdCBubyBleGNlcHRpb25zIGFyZSB0aHJvd24gZnJvbSB5b3VyIHRhc2ssIG9yIHRvIG1hbnVhbGx5XG4vLyBjYWxsIGByYXdBc2FwLnJlcXVlc3RGbHVzaGAgaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93bi5cbi8vbW9kdWxlLmV4cG9ydHMgPSByYXdBc2FwO1xuZnVuY3Rpb24gcmF3QXNhcCh0YXNrKSB7XG4gICAgaWYgKCFxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmVxdWVzdEZsdXNoKCk7XG4gICAgICAgIGZsdXNoaW5nID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gRXF1aXZhbGVudCB0byBwdXNoLCBidXQgYXZvaWRzIGEgZnVuY3Rpb24gY2FsbC5cbiAgICBxdWV1ZVtxdWV1ZS5sZW5ndGhdID0gdGFzaztcbn1cblxudmFyIHF1ZXVlID0gW107XG4vLyBPbmNlIGEgZmx1c2ggaGFzIGJlZW4gcmVxdWVzdGVkLCBubyBmdXJ0aGVyIGNhbGxzIHRvIGByZXF1ZXN0Rmx1c2hgIGFyZVxuLy8gbmVjZXNzYXJ5IHVudGlsIHRoZSBuZXh0IGBmbHVzaGAgY29tcGxldGVzLlxudmFyIGZsdXNoaW5nID0gZmFsc2U7XG4vLyBgcmVxdWVzdEZsdXNoYCBpcyBhbiBpbXBsZW1lbnRhdGlvbi1zcGVjaWZpYyBtZXRob2QgdGhhdCBhdHRlbXB0cyB0byBraWNrXG4vLyBvZmYgYSBgZmx1c2hgIGV2ZW50IGFzIHF1aWNrbHkgYXMgcG9zc2libGUuIGBmbHVzaGAgd2lsbCBhdHRlbXB0IHRvIGV4aGF1c3Rcbi8vIHRoZSBldmVudCBxdWV1ZSBiZWZvcmUgeWllbGRpbmcgdG8gdGhlIGJyb3dzZXIncyBvd24gZXZlbnQgbG9vcC5cbnZhciByZXF1ZXN0Rmx1c2g7XG4vLyBUaGUgcG9zaXRpb24gb2YgdGhlIG5leHQgdGFzayB0byBleGVjdXRlIGluIHRoZSB0YXNrIHF1ZXVlLiBUaGlzIGlzXG4vLyBwcmVzZXJ2ZWQgYmV0d2VlbiBjYWxscyB0byBgZmx1c2hgIHNvIHRoYXQgaXQgY2FuIGJlIHJlc3VtZWQgaWZcbi8vIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLlxudmFyIGluZGV4ID0gMDtcbi8vIElmIGEgdGFzayBzY2hlZHVsZXMgYWRkaXRpb25hbCB0YXNrcyByZWN1cnNpdmVseSwgdGhlIHRhc2sgcXVldWUgY2FuIGdyb3dcbi8vIHVuYm91bmRlZC4gVG8gcHJldmVudCBtZW1vcnkgZXhoYXVzdGlvbiwgdGhlIHRhc2sgcXVldWUgd2lsbCBwZXJpb2RpY2FsbHlcbi8vIHRydW5jYXRlIGFscmVhZHktY29tcGxldGVkIHRhc2tzLlxudmFyIGNhcGFjaXR5ID0gMTAyNDtcblxuLy8gVGhlIGZsdXNoIGZ1bmN0aW9uIHByb2Nlc3NlcyBhbGwgdGFza3MgdGhhdCBoYXZlIGJlZW4gc2NoZWR1bGVkIHdpdGhcbi8vIGByYXdBc2FwYCB1bmxlc3MgYW5kIHVudGlsIG9uZSBvZiB0aG9zZSB0YXNrcyB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuLy8gSWYgYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24sIGBmbHVzaGAgZW5zdXJlcyB0aGF0IGl0cyBzdGF0ZSB3aWxsIHJlbWFpblxuLy8gY29uc2lzdGVudCBhbmQgd2lsbCByZXN1bWUgd2hlcmUgaXQgbGVmdCBvZmYgd2hlbiBjYWxsZWQgYWdhaW4uXG4vLyBIb3dldmVyLCBgZmx1c2hgIGRvZXMgbm90IG1ha2UgYW55IGFycmFuZ2VtZW50cyB0byBiZSBjYWxsZWQgYWdhaW4gaWYgYW5cbi8vIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgICB3aGlsZSAoaW5kZXggPCBxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGluZGV4O1xuICAgICAgICAvLyBBZHZhbmNlIHRoZSBpbmRleCBiZWZvcmUgY2FsbGluZyB0aGUgdGFzay4gVGhpcyBlbnN1cmVzIHRoYXQgd2Ugd2lsbFxuICAgICAgICAvLyBiZWdpbiBmbHVzaGluZyBvbiB0aGUgbmV4dCB0YXNrIHRoZSB0YXNrIHRocm93cyBhbiBlcnJvci5cbiAgICAgICAgaW5kZXggPSBpbmRleCArIDE7XG4gICAgICAgIHF1ZXVlW2N1cnJlbnRJbmRleF0uY2FsbCgpO1xuICAgICAgICAvLyBQcmV2ZW50IGxlYWtpbmcgbWVtb3J5IGZvciBsb25nIGNoYWlucyBvZiByZWN1cnNpdmUgY2FsbHMgdG8gYGFzYXBgLlxuICAgICAgICAvLyBJZiB3ZSBjYWxsIGBhc2FwYCB3aXRoaW4gdGFza3Mgc2NoZWR1bGVkIGJ5IGBhc2FwYCwgdGhlIHF1ZXVlIHdpbGxcbiAgICAgICAgLy8gZ3JvdywgYnV0IHRvIGF2b2lkIGFuIE8obikgd2FsayBmb3IgZXZlcnkgdGFzayB3ZSBleGVjdXRlLCB3ZSBkb24ndFxuICAgICAgICAvLyBzaGlmdCB0YXNrcyBvZmYgdGhlIHF1ZXVlIGFmdGVyIHRoZXkgaGF2ZSBiZWVuIGV4ZWN1dGVkLlxuICAgICAgICAvLyBJbnN0ZWFkLCB3ZSBwZXJpb2RpY2FsbHkgc2hpZnQgMTAyNCB0YXNrcyBvZmYgdGhlIHF1ZXVlLlxuICAgICAgICBpZiAoaW5kZXggPiBjYXBhY2l0eSkge1xuICAgICAgICAgICAgLy8gTWFudWFsbHkgc2hpZnQgYWxsIHZhbHVlcyBzdGFydGluZyBhdCB0aGUgaW5kZXggYmFjayB0byB0aGVcbiAgICAgICAgICAgIC8vIGJlZ2lubmluZyBvZiB0aGUgcXVldWUuXG4gICAgICAgICAgICBmb3IgKHZhciBzY2FuID0gMCwgbmV3TGVuZ3RoID0gcXVldWUubGVuZ3RoIC0gaW5kZXg7IHNjYW4gPCBuZXdMZW5ndGg7IHNjYW4rKykge1xuICAgICAgICAgICAgICAgIHF1ZXVlW3NjYW5dID0gcXVldWVbc2NhbiArIGluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHF1ZXVlLmxlbmd0aCAtPSBpbmRleDtcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5sZW5ndGggPSAwO1xuICAgIGluZGV4ID0gMDtcbiAgICBmbHVzaGluZyA9IGZhbHNlO1xufVxuXG4vLyBgcmVxdWVzdEZsdXNoYCBpcyBpbXBsZW1lbnRlZCB1c2luZyBhIHN0cmF0ZWd5IGJhc2VkIG9uIGRhdGEgY29sbGVjdGVkIGZyb21cbi8vIGV2ZXJ5IGF2YWlsYWJsZSBTYXVjZUxhYnMgU2VsZW5pdW0gd2ViIGRyaXZlciB3b3JrZXIgYXQgdGltZSBvZiB3cml0aW5nLlxuLy8gaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMW1HLTVVWUd1cDVxeEdkRU1Xa2hQNkJXQ3owNTNOVWIyRTFRb1VUVTE2dUEvZWRpdCNnaWQ9NzgzNzI0NTkzXG5cbi8vIFNhZmFyaSA2IGFuZCA2LjEgZm9yIGRlc2t0b3AsIGlQYWQsIGFuZCBpUGhvbmUgYXJlIHRoZSBvbmx5IGJyb3dzZXJzIHRoYXRcbi8vIGhhdmUgV2ViS2l0TXV0YXRpb25PYnNlcnZlciBidXQgbm90IHVuLXByZWZpeGVkIE11dGF0aW9uT2JzZXJ2ZXIuXG4vLyBNdXN0IHVzZSBgZ2xvYmFsYCBpbnN0ZWFkIG9mIGB3aW5kb3dgIHRvIHdvcmsgaW4gYm90aCBmcmFtZXMgYW5kIHdlYlxuLy8gd29ya2Vycy4gYGdsb2JhbGAgaXMgYSBwcm92aXNpb24gb2YgQnJvd3NlcmlmeSwgTXIsIE1ycywgb3IgTW9wLlxudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cbi8vIE11dGF0aW9uT2JzZXJ2ZXJzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGhhdmUgaGlnaCBwcmlvcml0eSBhbmQgd29ya1xuLy8gcmVsaWFibHkgZXZlcnl3aGVyZSB0aGV5IGFyZSBpbXBsZW1lbnRlZC5cbi8vIFRoZXkgYXJlIGltcGxlbWVudGVkIGluIGFsbCBtb2Rlcm4gYnJvd3NlcnMuXG4vL1xuLy8gLSBBbmRyb2lkIDQtNC4zXG4vLyAtIENocm9tZSAyNi0zNFxuLy8gLSBGaXJlZm94IDE0LTI5XG4vLyAtIEludGVybmV0IEV4cGxvcmVyIDExXG4vLyAtIGlQYWQgU2FmYXJpIDYtNy4xXG4vLyAtIGlQaG9uZSBTYWZhcmkgNy03LjFcbi8vIC0gU2FmYXJpIDYtN1xuaWYgKHR5cGVvZiBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuXG4vLyBNZXNzYWdlQ2hhbm5lbHMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgZ2l2ZSBkaXJlY3QgYWNjZXNzIHRvIHRoZSBIVE1MXG4vLyB0YXNrIHF1ZXVlLCBhcmUgaW1wbGVtZW50ZWQgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAsIFNhZmFyaSA1LjAtMSwgYW5kIE9wZXJhXG4vLyAxMS0xMiwgYW5kIGluIHdlYiB3b3JrZXJzIGluIG1hbnkgZW5naW5lcy5cbi8vIEFsdGhvdWdoIG1lc3NhZ2UgY2hhbm5lbHMgeWllbGQgdG8gYW55IHF1ZXVlZCByZW5kZXJpbmcgYW5kIElPIHRhc2tzLCB0aGV5XG4vLyB3b3VsZCBiZSBiZXR0ZXIgdGhhbiBpbXBvc2luZyB0aGUgNG1zIGRlbGF5IG9mIHRpbWVycy5cbi8vIEhvd2V2ZXIsIHRoZXkgZG8gbm90IHdvcmsgcmVsaWFibHkgaW4gSW50ZXJuZXQgRXhwbG9yZXIgb3IgU2FmYXJpLlxuXG4vLyBJbnRlcm5ldCBFeHBsb3JlciAxMCBpcyB0aGUgb25seSBicm93c2VyIHRoYXQgaGFzIHNldEltbWVkaWF0ZSBidXQgZG9lc1xuLy8gbm90IGhhdmUgTXV0YXRpb25PYnNlcnZlcnMuXG4vLyBBbHRob3VnaCBzZXRJbW1lZGlhdGUgeWllbGRzIHRvIHRoZSBicm93c2VyJ3MgcmVuZGVyZXIsIGl0IHdvdWxkIGJlXG4vLyBwcmVmZXJyYWJsZSB0byBmYWxsaW5nIGJhY2sgdG8gc2V0VGltZW91dCBzaW5jZSBpdCBkb2VzIG5vdCBoYXZlXG4vLyB0aGUgbWluaW11bSA0bXMgcGVuYWx0eS5cbi8vIFVuZm9ydHVuYXRlbHkgdGhlcmUgYXBwZWFycyB0byBiZSBhIGJ1ZyBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCBNb2JpbGUgKGFuZFxuLy8gRGVza3RvcCB0byBhIGxlc3NlciBleHRlbnQpIHRoYXQgcmVuZGVycyBib3RoIHNldEltbWVkaWF0ZSBhbmRcbi8vIE1lc3NhZ2VDaGFubmVsIHVzZWxlc3MgZm9yIHRoZSBwdXJwb3NlcyBvZiBBU0FQLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL2lzc3Vlcy8zOTZcblxuLy8gVGltZXJzIGFyZSBpbXBsZW1lbnRlZCB1bml2ZXJzYWxseS5cbi8vIFdlIGZhbGwgYmFjayB0byB0aW1lcnMgaW4gd29ya2VycyBpbiBtb3N0IGVuZ2luZXMsIGFuZCBpbiBmb3JlZ3JvdW5kXG4vLyBjb250ZXh0cyBpbiB0aGUgZm9sbG93aW5nIGJyb3dzZXJzLlxuLy8gSG93ZXZlciwgbm90ZSB0aGF0IGV2ZW4gdGhpcyBzaW1wbGUgY2FzZSByZXF1aXJlcyBudWFuY2VzIHRvIG9wZXJhdGUgaW4gYVxuLy8gYnJvYWQgc3BlY3RydW0gb2YgYnJvd3NlcnMuXG4vL1xuLy8gLSBGaXJlZm94IDMtMTNcbi8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgNi05XG4vLyAtIGlQYWQgU2FmYXJpIDQuM1xuLy8gLSBMeW54IDIuOC43XG59IGVsc2Uge1xuICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihmbHVzaCk7XG59XG5cbi8vIGByZXF1ZXN0Rmx1c2hgIHJlcXVlc3RzIHRoYXQgdGhlIGhpZ2ggcHJpb3JpdHkgZXZlbnQgcXVldWUgYmUgZmx1c2hlZCBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZS5cbi8vIFRoaXMgaXMgdXNlZnVsIHRvIHByZXZlbnQgYW4gZXJyb3IgdGhyb3duIGluIGEgdGFzayBmcm9tIHN0YWxsaW5nIHRoZSBldmVudFxuLy8gcXVldWUgaWYgdGhlIGV4Y2VwdGlvbiBoYW5kbGVkIGJ5IE5vZGUuanPigJlzXG4vLyBgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIpYCBvciBieSBhIGRvbWFpbi5cbnJhd0FzYXAucmVxdWVzdEZsdXNoID0gcmVxdWVzdEZsdXNoO1xuXG4vLyBUbyByZXF1ZXN0IGEgaGlnaCBwcmlvcml0eSBldmVudCwgd2UgaW5kdWNlIGEgbXV0YXRpb24gb2JzZXJ2ZXIgYnkgdG9nZ2xpbmdcbi8vIHRoZSB0ZXh0IG9mIGEgdGV4dCBub2RlIGJldHdlZW4gXCIxXCIgYW5kIFwiLTFcIi5cbmZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRvZ2dsZSA9IDE7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIHRvZ2dsZSA9IC10b2dnbGU7XG4gICAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZTtcbiAgICB9O1xufVxuXG4vLyBUaGUgbWVzc2FnZSBjaGFubmVsIHRlY2huaXF1ZSB3YXMgZGlzY292ZXJlZCBieSBNYWx0ZSBVYmwgYW5kIHdhcyB0aGVcbi8vIG9yaWdpbmFsIGZvdW5kYXRpb24gZm9yIHRoaXMgbGlicmFyeS5cbi8vIGh0dHA6Ly93d3cubm9uYmxvY2tpbmcuaW8vMjAxMS8wNi93aW5kb3duZXh0dGljay5odG1sXG5cbi8vIFNhZmFyaSA2LjAuNSAoYXQgbGVhc3QpIGludGVybWl0dGVudGx5IGZhaWxzIHRvIGNyZWF0ZSBtZXNzYWdlIHBvcnRzIG9uIGFcbi8vIHBhZ2UncyBmaXJzdCBsb2FkLiBUaGFua2Z1bGx5LCB0aGlzIHZlcnNpb24gb2YgU2FmYXJpIHN1cHBvcnRzXG4vLyBNdXRhdGlvbk9ic2VydmVycywgc28gd2UgZG9uJ3QgbmVlZCB0byBmYWxsIGJhY2sgaW4gdGhhdCBjYXNlLlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTWVzc2FnZUNoYW5uZWwoY2FsbGJhY2spIHtcbi8vICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuLy8gICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gY2FsbGJhY2s7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIEZvciByZWFzb25zIGV4cGxhaW5lZCBhYm92ZSwgd2UgYXJlIGFsc28gdW5hYmxlIHRvIHVzZSBgc2V0SW1tZWRpYXRlYFxuLy8gdW5kZXIgYW55IGNpcmN1bXN0YW5jZXMuXG4vLyBFdmVuIGlmIHdlIHdlcmUsIHRoZXJlIGlzIGFub3RoZXIgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwLlxuLy8gSXQgaXMgbm90IHN1ZmZpY2llbnQgdG8gYXNzaWduIGBzZXRJbW1lZGlhdGVgIHRvIGByZXF1ZXN0Rmx1c2hgIGJlY2F1c2Vcbi8vIGBzZXRJbW1lZGlhdGVgIG11c3QgYmUgY2FsbGVkICpieSBuYW1lKiBhbmQgdGhlcmVmb3JlIG11c3QgYmUgd3JhcHBlZCBpbiBhXG4vLyBjbG9zdXJlLlxuLy8gTmV2ZXIgZm9yZ2V0LlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tU2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBzZXRJbW1lZGlhdGUoY2FsbGJhY2spO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIFNhZmFyaSA2LjAgaGFzIGEgcHJvYmxlbSB3aGVyZSB0aW1lcnMgd2lsbCBnZXQgbG9zdCB3aGlsZSB0aGUgdXNlciBpc1xuLy8gc2Nyb2xsaW5nLiBUaGlzIHByb2JsZW0gZG9lcyBub3QgaW1wYWN0IEFTQVAgYmVjYXVzZSBTYWZhcmkgNi4wIHN1cHBvcnRzXG4vLyBtdXRhdGlvbiBvYnNlcnZlcnMsIHNvIHRoYXQgaW1wbGVtZW50YXRpb24gaXMgdXNlZCBpbnN0ZWFkLlxuLy8gSG93ZXZlciwgaWYgd2UgZXZlciBlbGVjdCB0byB1c2UgdGltZXJzIGluIFNhZmFyaSwgdGhlIHByZXZhbGVudCB3b3JrLWFyb3VuZFxuLy8gaXMgdG8gYWRkIGEgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyIHRoYXQgY2FsbHMgZm9yIGEgZmx1c2guXG5cbi8vIGBzZXRUaW1lb3V0YCBkb2VzIG5vdCBjYWxsIHRoZSBwYXNzZWQgY2FsbGJhY2sgaWYgdGhlIGRlbGF5IGlzIGxlc3MgdGhhblxuLy8gYXBwcm94aW1hdGVseSA3IGluIHdlYiB3b3JrZXJzIGluIEZpcmVmb3ggOCB0aHJvdWdoIDE4LCBhbmQgc29tZXRpbWVzIG5vdFxuLy8gZXZlbiB0aGVuLlxuXG5mdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIC8vIFdlIGRpc3BhdGNoIGEgdGltZW91dCB3aXRoIGEgc3BlY2lmaWVkIGRlbGF5IG9mIDAgZm9yIGVuZ2luZXMgdGhhdFxuICAgICAgICAvLyBjYW4gcmVsaWFibHkgYWNjb21tb2RhdGUgdGhhdCByZXF1ZXN0LiBUaGlzIHdpbGwgdXN1YWxseSBiZSBzbmFwcGVkXG4gICAgICAgIC8vIHRvIGEgNCBtaWxpc2Vjb25kIGRlbGF5LCBidXQgb25jZSB3ZSdyZSBmbHVzaGluZywgdGhlcmUncyBubyBkZWxheVxuICAgICAgICAvLyBiZXR3ZWVuIGV2ZW50cy5cbiAgICAgICAgdmFyIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGhhbmRsZVRpbWVyLCAwKTtcbiAgICAgICAgLy8gSG93ZXZlciwgc2luY2UgdGhpcyB0aW1lciBnZXRzIGZyZXF1ZW50bHkgZHJvcHBlZCBpbiBGaXJlZm94XG4gICAgICAgIC8vIHdvcmtlcnMsIHdlIGVubGlzdCBhbiBpbnRlcnZhbCBoYW5kbGUgdGhhdCB3aWxsIHRyeSB0byBmaXJlXG4gICAgICAgIC8vIGFuIGV2ZW50IDIwIHRpbWVzIHBlciBzZWNvbmQgdW50aWwgaXQgc3VjY2VlZHMuXG4gICAgICAgIHZhciBpbnRlcnZhbEhhbmRsZSA9IHNldEludGVydmFsKGhhbmRsZVRpbWVyLCA1MCk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGltZXIoKSB7XG4gICAgICAgICAgICAvLyBXaGljaGV2ZXIgdGltZXIgc3VjY2VlZHMgd2lsbCBjYW5jZWwgYm90aCB0aW1lcnMgYW5kXG4gICAgICAgICAgICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SGFuZGxlKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxIYW5kbGUpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIFRoaXMgaXMgZm9yIGBhc2FwLmpzYCBvbmx5LlxuLy8gSXRzIG5hbWUgd2lsbCBiZSBwZXJpb2RpY2FsbHkgcmFuZG9taXplZCB0byBicmVhayBhbnkgY29kZSB0aGF0IGRlcGVuZHMgb25cbi8vIGl0cyBleGlzdGVuY2UuXG5yYXdBc2FwLm1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lciA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcjtcblxuLy8gQVNBUCB3YXMgb3JpZ2luYWxseSBhIG5leHRUaWNrIHNoaW0gaW5jbHVkZWQgaW4gUS4gVGhpcyB3YXMgZmFjdG9yZWQgb3V0XG4vLyBpbnRvIHRoaXMgQVNBUCBwYWNrYWdlLiBJdCB3YXMgbGF0ZXIgYWRhcHRlZCB0byBSU1ZQIHdoaWNoIG1hZGUgZnVydGhlclxuLy8gYW1lbmRtZW50cy4gVGhlc2UgZGVjaXNpb25zLCBwYXJ0aWN1bGFybHkgdG8gbWFyZ2luYWxpemUgTWVzc2FnZUNoYW5uZWwgYW5kXG4vLyB0byBjYXB0dXJlIHRoZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIGluIGEgY2xvc3VyZSwgd2VyZSBpbnRlZ3JhdGVkXG4vLyBiYWNrIGludG8gQVNBUCBwcm9wZXIuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGlsZGVpby9yc3ZwLmpzL2Jsb2IvY2RkZjcyMzI1NDZhOWNmODU4NTI0Yjc1Y2RlNmY5ZWRmNzI2MjBhNy9saWIvcnN2cC9hc2FwLmpzXG5cbid1c2Ugc3RyaWN0JztcblxuLy92YXIgYXNhcCA9IHJlcXVpcmUoJ2FzYXAvcmF3Jyk7XG52YXIgYXNhcCA9IHJhd0FzYXA7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vLyBTdGF0ZXM6XG4vL1xuLy8gMCAtIHBlbmRpbmdcbi8vIDEgLSBmdWxmaWxsZWQgd2l0aCBfdmFsdWVcbi8vIDIgLSByZWplY3RlZCB3aXRoIF92YWx1ZVxuLy8gMyAtIGFkb3B0ZWQgdGhlIHN0YXRlIG9mIGFub3RoZXIgcHJvbWlzZSwgX3ZhbHVlXG4vL1xuLy8gb25jZSB0aGUgc3RhdGUgaXMgbm8gbG9uZ2VyIHBlbmRpbmcgKDApIGl0IGlzIGltbXV0YWJsZVxuXG4vLyBBbGwgYF9gIHByZWZpeGVkIHByb3BlcnRpZXMgd2lsbCBiZSByZWR1Y2VkIHRvIGBfe3JhbmRvbSBudW1iZXJ9YFxuLy8gYXQgYnVpbGQgdGltZSB0byBvYmZ1c2NhdGUgdGhlbSBhbmQgZGlzY291cmFnZSB0aGVpciB1c2UuXG4vLyBXZSBkb24ndCB1c2Ugc3ltYm9scyBvciBPYmplY3QuZGVmaW5lUHJvcGVydHkgdG8gZnVsbHkgaGlkZSB0aGVtXG4vLyBiZWNhdXNlIHRoZSBwZXJmb3JtYW5jZSBpc24ndCBnb29kIGVub3VnaC5cblxuXG4vLyB0byBhdm9pZCB1c2luZyB0cnkvY2F0Y2ggaW5zaWRlIGNyaXRpY2FsIGZ1bmN0aW9ucywgd2Vcbi8vIGV4dHJhY3QgdGhlbSB0byBoZXJlLlxudmFyIExBU1RfRVJST1IgPSBudWxsO1xudmFyIElTX0VSUk9SID0ge307XG5mdW5jdGlvbiBnZXRUaGVuKG9iaikge1xuICB0cnkge1xuICAgIHJldHVybiBvYmoudGhlbjtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBMQVNUX0VSUk9SID0gZXg7XG4gICAgcmV0dXJuIElTX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyeUNhbGxPbmUoZm4sIGEpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZm4oYSk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgTEFTVF9FUlJPUiA9IGV4O1xuICAgIHJldHVybiBJU19FUlJPUjtcbiAgfVxufVxuZnVuY3Rpb24gdHJ5Q2FsbFR3byhmbiwgYSwgYikge1xuICB0cnkge1xuICAgIGZuKGEsIGIpO1xuICB9IGNhdGNoIChleCkge1xuICAgIExBU1RfRVJST1IgPSBleDtcbiAgICByZXR1cm4gSVNfRVJST1I7XG4gIH1cbn1cblxuLy9tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG5cbmZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgaWYgKHR5cGVvZiB0aGlzICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ldycpO1xuICB9XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xuICB9XG4gIHRoaXMuXzQxID0gMDtcbiAgdGhpcy5fODYgPSBudWxsO1xuICB0aGlzLl8xNyA9IFtdO1xuICBpZiAoZm4gPT09IG5vb3ApIHJldHVybjtcbiAgZG9SZXNvbHZlKGZuLCB0aGlzKTtcbn1cblByb21pc2UuXzEgPSBub29wO1xuXG5Qcm9taXNlLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgaWYgKHRoaXMuY29uc3RydWN0b3IgIT09IFByb21pc2UpIHtcbiAgICByZXR1cm4gc2FmZVRoZW4odGhpcywgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpO1xuICB9XG4gIHZhciByZXMgPSBuZXcgUHJvbWlzZShub29wKTtcbiAgaGFuZGxlKHRoaXMsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCByZXMpKTtcbiAgcmV0dXJuIHJlcztcbn07XG5cbmZ1bmN0aW9uIHNhZmVUaGVuKHNlbGYsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIHJldHVybiBuZXcgc2VsZi5jb25zdHJ1Y3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcyA9IG5ldyBQcm9taXNlKG5vb3ApO1xuICAgIHJlcy50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgaGFuZGxlKHNlbGYsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCByZXMpKTtcbiAgfSk7XG59O1xuZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG4gIHdoaWxlIChzZWxmLl80MSA9PT0gMykge1xuICAgIHNlbGYgPSBzZWxmLl84NjtcbiAgfVxuICBpZiAoc2VsZi5fNDEgPT09IDApIHtcbiAgICBzZWxmLl8xNy5wdXNoKGRlZmVycmVkKTtcbiAgICByZXR1cm47XG4gIH1cbiAgYXNhcChmdW5jdGlvbigpIHtcbiAgICB2YXIgY2IgPSBzZWxmLl80MSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbiAgICBpZiAoY2IgPT09IG51bGwpIHtcbiAgICAgIGlmIChzZWxmLl80MSA9PT0gMSkge1xuICAgICAgICByZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHNlbGYuXzg2KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl84Nik7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXQgPSB0cnlDYWxsT25lKGNiLCBzZWxmLl84Nik7XG4gICAgaWYgKHJldCA9PT0gSVNfRVJST1IpIHtcbiAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBMQVNUX0VSUk9SKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiByZXNvbHZlKHNlbGYsIG5ld1ZhbHVlKSB7XG4gIC8vIFByb21pc2UgUmVzb2x1dGlvbiBQcm9jZWR1cmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9taXNlcy1hcGx1cy9wcm9taXNlcy1zcGVjI3RoZS1wcm9taXNlLXJlc29sdXRpb24tcHJvY2VkdXJlXG4gIGlmIChuZXdWYWx1ZSA9PT0gc2VsZikge1xuICAgIHJldHVybiByZWplY3QoXG4gICAgICBzZWxmLFxuICAgICAgbmV3IFR5cGVFcnJvcignQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi4nKVxuICAgICk7XG4gIH1cbiAgaWYgKFxuICAgIG5ld1ZhbHVlICYmXG4gICAgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG5ld1ZhbHVlID09PSAnZnVuY3Rpb24nKVxuICApIHtcbiAgICB2YXIgdGhlbiA9IGdldFRoZW4obmV3VmFsdWUpO1xuICAgIGlmICh0aGVuID09PSBJU19FUlJPUikge1xuICAgICAgcmV0dXJuIHJlamVjdChzZWxmLCBMQVNUX0VSUk9SKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgdGhlbiA9PT0gc2VsZi50aGVuICYmXG4gICAgICBuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2VcbiAgICApIHtcbiAgICAgIHNlbGYuXzQxID0gMztcbiAgICAgIHNlbGYuXzg2ID0gbmV3VmFsdWU7XG4gICAgICBmaW5hbGUoc2VsZik7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZG9SZXNvbHZlKHRoZW4uYmluZChuZXdWYWx1ZSksIHNlbGYpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBzZWxmLl80MSA9IDE7XG4gIHNlbGYuXzg2ID0gbmV3VmFsdWU7XG4gIGZpbmFsZShzZWxmKTtcbn1cblxuZnVuY3Rpb24gcmVqZWN0KHNlbGYsIG5ld1ZhbHVlKSB7XG4gIHNlbGYuXzQxID0gMjtcbiAgc2VsZi5fODYgPSBuZXdWYWx1ZTtcbiAgZmluYWxlKHNlbGYpO1xufVxuZnVuY3Rpb24gZmluYWxlKHNlbGYpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLl8xNy5sZW5ndGg7IGkrKykge1xuICAgIGhhbmRsZShzZWxmLCBzZWxmLl8xN1tpXSk7XG4gIH1cbiAgc2VsZi5fMTcgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9taXNlKXtcbiAgdGhpcy5vbkZ1bGZpbGxlZCA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogbnVsbDtcbiAgdGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicgPyBvblJlamVjdGVkIDogbnVsbDtcbiAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBUYWtlIGEgcG90ZW50aWFsbHkgbWlzYmVoYXZpbmcgcmVzb2x2ZXIgZnVuY3Rpb24gYW5kIG1ha2Ugc3VyZVxuICogb25GdWxmaWxsZWQgYW5kIG9uUmVqZWN0ZWQgYXJlIG9ubHkgY2FsbGVkIG9uY2UuXG4gKlxuICogTWFrZXMgbm8gZ3VhcmFudGVlcyBhYm91dCBhc3luY2hyb255LlxuICovXG5mdW5jdGlvbiBkb1Jlc29sdmUoZm4sIHByb21pc2UpIHtcbiAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgdmFyIHJlcyA9IHRyeUNhbGxUd28oZm4sIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgZG9uZSA9IHRydWU7XG4gICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgIGRvbmUgPSB0cnVlO1xuICAgIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICB9KVxuICBpZiAoIWRvbmUgJiYgcmVzID09PSBJU19FUlJPUikge1xuICAgIGRvbmUgPSB0cnVlO1xuICAgIHJlamVjdChwcm9taXNlLCBMQVNUX0VSUk9SKTtcbiAgfVxufVxuXG4ndXNlIHN0cmljdCc7XG5cblxuLyoqXG4gKiBAbmFtZSBJbWFnZXNSZWFkeVxuICogQGNvbnN0cnVjdG9yXG4gKlxuICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fEVsZW1lbnR8RWxlbWVudFtdfGpRdWVyeXxOb2RlTGlzdHxzdHJpbmd9IGVsZW1lbnRzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGpxdWVyeVxuICpcbiAqL1xuZnVuY3Rpb24gSW1hZ2VzUmVhZHkoZWxlbWVudHMsIGpxdWVyeSkge1xuICBpZiAodHlwZW9mIGVsZW1lbnRzID09PSAnc3RyaW5nJykge1xuICAgIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtZW50cyk7XG4gICAgaWYgKCFlbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc2VsZWN0b3IgYCcgKyBlbGVtZW50cyArICdgIHlpZWxkZWQgMCBlbGVtZW50cycpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBkZWZlcnJlZCA9IGRlZmVyKGpxdWVyeSk7XG4gIHRoaXMucmVzdWx0ID0gZGVmZXJyZWQucHJvbWlzZTtcblxuICB2YXIgaW1hZ2VzID0gdGhpcy5pbWFnZUVsZW1lbnRzKFxuICAgIHRoaXMudmFsaWRFbGVtZW50cyh0aGlzLnRvQXJyYXkoZWxlbWVudHMpLCBJbWFnZXNSZWFkeS5WQUxJRF9OT0RFX1RZUEVTKVxuICApO1xuXG4gIHZhciBpbWFnZUNvdW50ID0gaW1hZ2VzLmxlbmd0aDtcblxuICBpZiAoaW1hZ2VDb3VudCkge1xuICAgIHRoaXMudmVyaWZ5KGltYWdlcywgc3RhdHVzKGltYWdlQ291bnQsIGZ1bmN0aW9uKHJlYWR5KXtcbiAgICAgIGlmIChyZWFkeSkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGVsZW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZWxlbWVudHMpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuICBlbHNlIHtcbiAgICBkZWZlcnJlZC5yZXNvbHZlKGVsZW1lbnRzKTtcbiAgfVxufVxuXG5cbkltYWdlc1JlYWR5LlZBTElEX05PREVfVFlQRVMgPSB7XG4gIDEgIDogdHJ1ZSwgLy8gRUxFTUVOVF9OT0RFXG4gIDkgIDogdHJ1ZSwgLy8gRE9DVU1FTlRfTk9ERVxuICAxMSA6IHRydWUgIC8vIERPQ1VNRU5UX0ZSQUdNRU5UX05PREVcbn07XG5cblxuSW1hZ2VzUmVhZHkucHJvdG90eXBlID0ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxlbWVudHNcbiAgICogQHJldHVybnMge1tdfEhUTUxJbWFnZUVsZW1lbnRbXX1cbiAgICovXG4gIGltYWdlRWxlbWVudHMgOiBmdW5jdGlvbihlbGVtZW50cykge1xuICAgIHZhciBpbWFnZXMgPSBbXTtcblxuICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgICBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0lNRycpIHtcbiAgICAgICAgaW1hZ2VzLnB1c2goZWxlbWVudCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIGltYWdlRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpO1xuICAgICAgICBpZiAoaW1hZ2VFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBpbWFnZXMucHVzaC5hcHBseShpbWFnZXMsIGltYWdlRWxlbWVudHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW1hZ2VzO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbGVtZW50c1xuICAgKiBAcGFyYW0ge3t9fSB2YWxpZE5vZGVUeXBlc1xuICAgKiBAcmV0dXJucyB7W118RWxlbWVudFtdfVxuICAgKi9cbiAgdmFsaWRFbGVtZW50cyA6IGZ1bmN0aW9uKGVsZW1lbnRzLCB2YWxpZE5vZGVUeXBlcykge1xuICAgIHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgICByZXR1cm4gdmFsaWROb2RlVHlwZXNbZWxlbWVudC5ub2RlVHlwZV07XG4gICAgfSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50W119IGltYWdlc1xuICAgKiBAcmV0dXJucyB7W118SFRNTEltYWdlRWxlbWVudFtdfVxuICAgKi9cbiAgaW5jb21wbGV0ZUltYWdlcyA6IGZ1bmN0aW9uKGltYWdlcykge1xuICAgIHJldHVybiBpbWFnZXMuZmlsdGVyKGZ1bmN0aW9uKGltYWdlKXtcbiAgICAgIHJldHVybiAhKGltYWdlLmNvbXBsZXRlICYmIGltYWdlLm5hdHVyYWxXaWR0aCk7XG4gICAgfSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb25sb2FkXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uZXJyb3JcbiAgICogQHJldHVybnMge2Z1bmN0aW9uKEhUTUxJbWFnZUVsZW1lbnQpfVxuICAgKi9cbiAgcHJveHlJbWFnZSA6IGZ1bmN0aW9uKG9ubG9hZCwgb25lcnJvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgdmFyIF9pbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICBfaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9ubG9hZCk7XG4gICAgICBfaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICAgIF9pbWFnZS5zcmMgPSBpbWFnZS5zcmM7XG5cbiAgICAgIHJldHVybiBfaW1hZ2U7XG4gICAgfTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnRbXX0gaW1hZ2VzXG4gICAqIEBwYXJhbSB7e2ZhaWxlZDogZnVuY3Rpb24sIGxvYWRlZDogZnVuY3Rpb259fSBzdGF0dXNcbiAgICovXG4gIHZlcmlmeSA6IGZ1bmN0aW9uKGltYWdlcywgc3RhdHVzKSB7XG4gICAgdmFyIGluY29tcGxldGUgPSB0aGlzLmluY29tcGxldGVJbWFnZXMoaW1hZ2VzKTtcblxuICAgIGlmIChpbWFnZXMubGVuZ3RoID4gaW5jb21wbGV0ZS5sZW5ndGgpIHtcbiAgICAgIHN0YXR1cy5sb2FkZWQoaW1hZ2VzLmxlbmd0aCAtIGluY29tcGxldGUubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBpZiAoaW5jb21wbGV0ZS5sZW5ndGgpIHtcbiAgICAgIGluY29tcGxldGUuZm9yRWFjaCh0aGlzLnByb3h5SW1hZ2UoXG4gICAgICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgc3RhdHVzLmxvYWRlZCgxKTtcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKXtcbiAgICAgICAgICBzdGF0dXMuZmFpbGVkKDEpO1xuICAgICAgICB9XG4gICAgICApKTtcbiAgICB9XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fEVsZW1lbnR8RWxlbWVudFtdfGpRdWVyeXxOb2RlTGlzdH0gb2JqZWN0XG4gICAqIEByZXR1cm5zIHtFbGVtZW50W119XG4gICAqL1xuICB0b0FycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9iamVjdC5sZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gW10uc2xpY2UuY2FsbChvYmplY3QpO1xuICAgIH1cblxuICAgIHJldHVybiBbb2JqZWN0XTtcbiAgfVxuXG59O1xuXG5cbi8qKlxuICogQHBhcmFtIGpxdWVyeVxuICogQHJldHVybnMgZGVmZXJyZWRcbiAqL1xuZnVuY3Rpb24gZGVmZXIoanF1ZXJ5KSB7XG4gIHZhciBkZWZlcnJlZDtcblxuICBpZiAoanF1ZXJ5KSB7XG4gICAgZGVmZXJyZWQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuICAgIGRlZmVycmVkLnByb21pc2UgPSBkZWZlcnJlZC5wcm9taXNlKCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZGVmZXJyZWQgPSB7fTtcbiAgICBkZWZlcnJlZC5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgZGVmZXJyZWQucmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGRlZmVycmVkO1xufVxuXG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IGltYWdlQ291bnRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGRvbmVcbiAqIEByZXR1cm5zIHt7ZmFpbGVkOiBmdW5jdGlvbiwgbG9hZGVkOiBmdW5jdGlvbn19XG4gKi9cbmZ1bmN0aW9uIHN0YXR1cyhpbWFnZUNvdW50LCBkb25lKSB7XG4gIHZhciBsb2FkZWQgPSAwLFxuICAgICAgdG90YWwgPSBpbWFnZUNvdW50LFxuICAgICAgdmVyaWZpZWQgPSAwO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICBpZiAodG90YWwgPT09IHZlcmlmaWVkKSB7XG4gICAgICBkb25lKHRvdGFsID09PSBsb2FkZWQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKi9cbiAgICBmYWlsZWQgOiBmdW5jdGlvbihjb3VudCkge1xuICAgICAgdmVyaWZpZWQgKz0gY291bnQ7XG4gICAgICB1cGRhdGUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gICAgICovXG4gICAgbG9hZGVkIDogZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIGxvYWRlZCArPSBjb3VudDtcbiAgICAgIHZlcmlmaWVkICs9IGNvdW50O1xuICAgICAgdXBkYXRlKCk7XG4gICAgfVxuXG4gIH07XG59XG5cblxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBqUXVlcnkgcGx1Z2luXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuaWYgKHdpbmRvdy5qUXVlcnkpIHtcbiAgJC5mbi5pbWFnZXNSZWFkeSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBJbWFnZXNSZWFkeSh0aGlzLCB0cnVlKTtcbiAgICByZXR1cm4gaW5zdGFuY2UucmVzdWx0O1xuICB9O1xufVxuXG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIERlZmF1bHQgZW50cnkgcG9pbnRcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBpbWFnZXNSZWFkeShlbGVtZW50cykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBpbnN0YW5jZSA9IG5ldyBJbWFnZXNSZWFkeShlbGVtZW50cyk7XG4gIHJldHVybiBpbnN0YW5jZS5yZXN1bHQ7XG59XG5cbnJldHVybiBpbWFnZXNSZWFkeTtcbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2ltYWdlc3JlYWR5L2Rpc3QvaW1hZ2VzcmVhZHkuanNcbi8vIG1vZHVsZSBpZCA9IDUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuKiBTZWN0aW9uIGhpZ2hsaWdodGVyIG1vZHVsZVxuKiBAbW9kdWxlIG1vZHVsZXMvc2VjdGlvbkhpZ2hsaWdodGVyXG4qIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzIzOTU5ODgvaGlnaGxpZ2h0LW1lbnUtaXRlbS13aGVuLXNjcm9sbGluZy1kb3duLXRvLXNlY3Rpb25cbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgJG5hdmlnYXRpb25MaW5rcyA9ICQoJy5qcy1zZWN0aW9uLXNldCA+IGxpID4gYScpO1xuICB2YXIgJHNlY3Rpb25zID0gJChcInNlY3Rpb25cIik7XG4gIHZhciAkc2VjdGlvbnNSZXZlcnNlZCA9ICQoJChcInNlY3Rpb25cIikuZ2V0KCkucmV2ZXJzZSgpKTtcbiAgdmFyIHNlY3Rpb25JZFRvbmF2aWdhdGlvbkxpbmsgPSB7fTtcbiAgLy92YXIgZVRvcCA9ICQoJyNmcmVlLWRheS10cmlwcycpLm9mZnNldCgpLnRvcDtcblxuICAkc2VjdGlvbnMuZWFjaChmdW5jdGlvbigpIHtcbiAgICBzZWN0aW9uSWRUb25hdmlnYXRpb25MaW5rWyQodGhpcykuYXR0cignaWQnKV0gPSAkKCcuanMtc2VjdGlvbi1zZXQgPiBsaSA+IGFbaHJlZj1cIiMnICsgJCh0aGlzKS5hdHRyKCdpZCcpICsgJ1wiXScpO1xuICB9KTtcblxuICBmdW5jdGlvbiBvcHRpbWl6ZWQoKSB7XG4gICAgdmFyIHNjcm9sbFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgJHNlY3Rpb25zUmV2ZXJzZWQuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjdXJyZW50U2VjdGlvbiA9ICQodGhpcyk7XG4gICAgICB2YXIgc2VjdGlvblRvcCA9IGN1cnJlbnRTZWN0aW9uLm9mZnNldCgpLnRvcDtcblxuICAgICAgLy8gaWYoY3VycmVudFNlY3Rpb24uaXMoJ3NlY3Rpb246Zmlyc3QtY2hpbGQnKSAmJiBzZWN0aW9uVG9wID4gc2Nyb2xsUG9zaXRpb24pe1xuICAgICAgLy8gICBjb25zb2xlLmxvZygnc2Nyb2xsUG9zaXRpb24nLCBzY3JvbGxQb3NpdGlvbik7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCdzZWN0aW9uVG9wJywgc2VjdGlvblRvcCk7XG4gICAgICAvLyB9XG5cbiAgICAgIGlmIChzY3JvbGxQb3NpdGlvbiA+PSBzZWN0aW9uVG9wIHx8IChjdXJyZW50U2VjdGlvbi5pcygnc2VjdGlvbjpmaXJzdC1jaGlsZCcpICYmIHNlY3Rpb25Ub3AgPiBzY3JvbGxQb3NpdGlvbikpIHtcbiAgICAgICAgdmFyIGlkID0gY3VycmVudFNlY3Rpb24uYXR0cignaWQnKTtcbiAgICAgICAgdmFyICRuYXZpZ2F0aW9uTGluayA9IHNlY3Rpb25JZFRvbmF2aWdhdGlvbkxpbmtbaWRdO1xuICAgICAgICBpZiAoISRuYXZpZ2F0aW9uTGluay5oYXNDbGFzcygnaXMtYWN0aXZlJykgfHwgISQoJ3NlY3Rpb24nKS5oYXNDbGFzcygnby1jb250ZW50LWNvbnRhaW5lci0tY29tcGFjdCcpKSB7XG4gICAgICAgICAgICAkbmF2aWdhdGlvbkxpbmtzLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICRuYXZpZ2F0aW9uTGluay5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb3B0aW1pemVkKCk7XG4gICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgb3B0aW1pemVkKCk7XG4gIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc2VjdGlvbkhpZ2hsaWdodGVyLmpzIiwiLyoqXG4gKiBTdGF0aWMgY29sdW1uIG1vZHVsZVxuICogU2ltaWxhciB0byB0aGUgZ2VuZXJhbCBzdGlja3kgbW9kdWxlIGJ1dCB1c2VkIHNwZWNpZmljYWxseSB3aGVuIG9uZSBjb2x1bW5cbiAqIG9mIGEgdHdvLWNvbHVtbiBsYXlvdXQgaXMgbWVhbnQgdG8gYmUgc3RpY2t5XG4gKiBAbW9kdWxlIG1vZHVsZXMvc3RhdGljQ29sdW1uXG4gKiBAc2VlIG1vZHVsZXMvc3RpY2t5TmF2XG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgY29uc3Qgc3RpY2t5Q29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1zdGF0aWMnKTtcbiAgY29uc3Qgbm90U3RpY2t5Q2xhc3MgPSAnaXMtbm90LXN0aWNreSc7XG4gIGNvbnN0IGJvdHRvbUNsYXNzID0gJ2lzLWJvdHRvbSc7XG5cbiAgLyoqXG4gICogQ2FsY3VsYXRlcyB0aGUgd2luZG93IHBvc2l0aW9uIGFuZCBzZXRzIHRoZSBhcHByb3ByaWF0ZSBjbGFzcyBvbiB0aGUgZWxlbWVudFxuICAqIEBwYXJhbSB7b2JqZWN0fSBzdGlja3lDb250ZW50RWxlbSAtIERPTSBub2RlIHRoYXQgc2hvdWxkIGJlIHN0aWNraWVkXG4gICovXG4gIGZ1bmN0aW9uIGNhbGNXaW5kb3dQb3Moc3RpY2t5Q29udGVudEVsZW0pIHtcbiAgICBsZXQgZWxlbVRvcCA9IHN0aWNreUNvbnRlbnRFbGVtLnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgIGxldCBpc1Bhc3RCb3R0b20gPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBzdGlja3lDb250ZW50RWxlbS5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAtIHN0aWNreUNvbnRlbnRFbGVtLnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wID4gMDtcblxuICAgIC8vIFNldHMgZWxlbWVudCB0byBwb3NpdGlvbiBhYnNvbHV0ZSBpZiBub3Qgc2Nyb2xsZWQgdG8geWV0LlxuICAgIC8vIEFic29sdXRlbHkgcG9zaXRpb25pbmcgb25seSB3aGVuIG5lY2Vzc2FyeSBhbmQgbm90IGJ5IGRlZmF1bHQgcHJldmVudHMgZmxpY2tlcmluZ1xuICAgIC8vIHdoZW4gcmVtb3ZpbmcgdGhlIFwiaXMtYm90dG9tXCIgY2xhc3Mgb24gQ2hyb21lXG4gICAgaWYgKGVsZW1Ub3AgPiAwKSB7XG4gICAgICBzdGlja3lDb250ZW50RWxlbS5jbGFzc0xpc3QuYWRkKG5vdFN0aWNreUNsYXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RpY2t5Q29udGVudEVsZW0uY2xhc3NMaXN0LnJlbW92ZShub3RTdGlja3lDbGFzcyk7XG4gICAgfVxuICAgIGlmIChpc1Bhc3RCb3R0b20pIHtcbiAgICAgIHN0aWNreUNvbnRlbnRFbGVtLmNsYXNzTGlzdC5hZGQoYm90dG9tQ2xhc3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGlja3lDb250ZW50RWxlbS5jbGFzc0xpc3QucmVtb3ZlKGJvdHRvbUNsYXNzKTtcbiAgICB9XG4gIH1cblxuICBpZiAoc3RpY2t5Q29udGVudCkge1xuICAgIGZvckVhY2goc3RpY2t5Q29udGVudCwgZnVuY3Rpb24oc3RpY2t5Q29udGVudEVsZW0pIHtcbiAgICAgIGNhbGNXaW5kb3dQb3Moc3RpY2t5Q29udGVudEVsZW0pO1xuXG4gICAgICAvKipcbiAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAnc2Nyb2xsJy5cbiAgICAgICogQGZ1bmN0aW9uXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICovXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNhbGNXaW5kb3dQb3Moc3RpY2t5Q29udGVudEVsZW0pO1xuICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAvKipcbiAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAncmVzaXplJy5cbiAgICAgICogQGZ1bmN0aW9uXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICovXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNhbGNXaW5kb3dQb3Moc3RpY2t5Q29udGVudEVsZW0pO1xuICAgICAgfSwgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9zdGF0aWNDb2x1bW4uanMiLCIvKipcbiAqIEFsZXJ0IEJhbm5lciBtb2R1bGVcbiAqIEBtb2R1bGUgbW9kdWxlcy9hbGVydFxuICogQHNlZSBtb2R1bGVzL3RvZ2dsZU9wZW5cbiAqL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5pbXBvcnQgcmVhZENvb2tpZSBmcm9tICcuL3JlYWRDb29raWUuanMnO1xuaW1wb3J0IGRhdGFzZXQgZnJvbSAnLi9kYXRhc2V0LmpzJztcbmltcG9ydCBjcmVhdGVDb29raWUgZnJvbSAnLi9jcmVhdGVDb29raWUuanMnO1xuaW1wb3J0IGdldERvbWFpbiBmcm9tICcuL2dldERvbWFpbi5qcyc7XG5cbi8qKlxuICogRGlzcGxheXMgYW4gYWxlcnQgYmFubmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IG9wZW5DbGFzcyAtIFRoZSBjbGFzcyB0byB0b2dnbGUgb24gaWYgYmFubmVyIGlzIHZpc2libGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3BlbkNsYXNzKSB7XG4gIGlmICghb3BlbkNsYXNzKSB7XG4gICAgb3BlbkNsYXNzID0gJ2lzLW9wZW4nO1xuICB9XG5cbiAgLyoqXG4gICogTWFrZSBhbiBhbGVydCB2aXNpYmxlXG4gICogQHBhcmFtIHtvYmplY3R9IGFsZXJ0IC0gRE9NIG5vZGUgb2YgdGhlIGFsZXJ0IHRvIGRpc3BsYXlcbiAgKiBAcGFyYW0ge29iamVjdH0gc2libGluZ0VsZW0gLSBET00gbm9kZSBvZiBhbGVydCdzIGNsb3Nlc3Qgc2libGluZyxcbiAgKiB3aGljaCBnZXRzIHNvbWUgZXh0cmEgcGFkZGluZyB0byBtYWtlIHJvb20gZm9yIHRoZSBhbGVydFxuICAqL1xuICBmdW5jdGlvbiBkaXNwbGF5QWxlcnQoYWxlcnQsIHNpYmxpbmdFbGVtKSB7XG4gICAgYWxlcnQuY2xhc3NMaXN0LmFkZChvcGVuQ2xhc3MpO1xuICAgIGNvbnN0IGFsZXJ0SGVpZ2h0ID0gYWxlcnQub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IGN1cnJlbnRQYWRkaW5nID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoc2libGluZ0VsZW0pLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctYm90dG9tJyksIDEwKTtcbiAgICBzaWJsaW5nRWxlbS5zdHlsZS5wYWRkaW5nQm90dG9tID0gKGFsZXJ0SGVpZ2h0ICsgY3VycmVudFBhZGRpbmcpICsgJ3B4JztcbiAgfVxuXG4gIC8qKlxuICAqIFJlbW92ZSBleHRyYSBwYWRkaW5nIGZyb20gYWxlcnQgc2libGluZ1xuICAqIEBwYXJhbSB7b2JqZWN0fSBzaWJsaW5nRWxlbSAtIERPTSBub2RlIG9mIGFsZXJ0IHNpYmxpbmdcbiAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlQWxlcnRQYWRkaW5nKHNpYmxpbmdFbGVtKSB7XG4gICAgc2libGluZ0VsZW0uc3R5bGUucGFkZGluZ0JvdHRvbSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgKiBDaGVjayBhbGVydCBjb29raWVcbiAgKiBAcGFyYW0ge29iamVjdH0gYWxlcnQgLSBET00gbm9kZSBvZiB0aGUgYWxlcnRcbiAgKiBAcmV0dXJuIHtib29sZWFufSAtIFdoZXRoZXIgYWxlcnQgY29va2llIGlzIHNldFxuICAqL1xuICBmdW5jdGlvbiBjaGVja0FsZXJ0Q29va2llKGFsZXJ0KSB7XG4gICAgY29uc3QgY29va2llTmFtZSA9IGRhdGFzZXQoYWxlcnQsICdjb29raWUnKTtcbiAgICBpZiAoIWNvb2tpZU5hbWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiByZWFkQ29va2llKGNvb2tpZU5hbWUsIGRvY3VtZW50LmNvb2tpZSkgIT09ICd1bmRlZmluZWQnO1xuICB9XG5cbiAgLyoqXG4gICogQWRkIGFsZXJ0IGNvb2tpZVxuICAqIEBwYXJhbSB7b2JqZWN0fSBhbGVydCAtIERPTSBub2RlIG9mIHRoZSBhbGVydFxuICAqL1xuICBmdW5jdGlvbiBhZGRBbGVydENvb2tpZShhbGVydCkge1xuICAgIGNvbnN0IGNvb2tpZU5hbWUgPSBkYXRhc2V0KGFsZXJ0LCAnY29va2llJyk7XG4gICAgaWYgKGNvb2tpZU5hbWUpIHtcbiAgICAgIGNyZWF0ZUNvb2tpZShjb29raWVOYW1lLCAnZGlzbWlzc2VkJywgZ2V0RG9tYWluKHdpbmRvdy5sb2NhdGlvbiwgZmFsc2UpLCAzNjApO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFsZXJ0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1hbGVydCcpO1xuICBpZiAoYWxlcnRzLmxlbmd0aCkge1xuICAgIGZvckVhY2goYWxlcnRzLCBmdW5jdGlvbihhbGVydCkge1xuICAgICAgaWYgKCFjaGVja0FsZXJ0Q29va2llKGFsZXJ0KSkge1xuICAgICAgICBjb25zdCBhbGVydFNpYmxpbmcgPSBhbGVydC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICBkaXNwbGF5QWxlcnQoYWxlcnQsIGFsZXJ0U2libGluZyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAnY2hhbmdlT3BlblN0YXRlJy5cbiAgICAgICAgKiBUaGUgdmFsdWUgb2YgZXZlbnQuZGV0YWlsIGluZGljYXRlcyB3aGV0aGVyIHRoZSBvcGVuIHN0YXRlIGlzIHRydWVcbiAgICAgICAgKiAoaS5lLiB0aGUgYWxlcnQgaXMgdmlzaWJsZSkuXG4gICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAgICAqL1xuICAgICAgICBhbGVydC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2VPcGVuU3RhdGUnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIC8vIEJlY2F1c2UgaU9TIHNhZmFyaSBpbmV4cGxpY2FibHkgdHVybnMgZXZlbnQuZGV0YWlsIGludG8gYW4gb2JqZWN0XG4gICAgICAgICAgaWYgKCh0eXBlb2YgZXZlbnQuZGV0YWlsID09PSAnYm9vbGVhbicgJiYgIWV2ZW50LmRldGFpbCkgfHxcbiAgICAgICAgICAgICh0eXBlb2YgZXZlbnQuZGV0YWlsID09PSAnb2JqZWN0JyAmJiAhZXZlbnQuZGV0YWlsLmRldGFpbClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGFkZEFsZXJ0Q29va2llKGFsZXJ0KTtcbiAgICAgICAgICAgIHJlbW92ZUFsZXJ0UGFkZGluZyhhbGVydFNpYmxpbmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2FsZXJ0LmpzIiwiLyoqXG4qIFJlYWRzIGEgY29va2llIGFuZCByZXR1cm5zIHRoZSB2YWx1ZVxuKiBAcGFyYW0ge3N0cmluZ30gY29va2llTmFtZSAtIE5hbWUgb2YgdGhlIGNvb2tpZVxuKiBAcGFyYW0ge3N0cmluZ30gY29va2llIC0gRnVsbCBsaXN0IG9mIGNvb2tpZXNcbiogQHJldHVybiB7c3RyaW5nfSAtIFZhbHVlIG9mIGNvb2tpZTsgdW5kZWZpbmVkIGlmIGNvb2tpZSBkb2VzIG5vdCBleGlzdFxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvb2tpZU5hbWUsIGNvb2tpZSkge1xuICByZXR1cm4gKFJlZ0V4cChcIig/Ol58OyApXCIgKyBjb29raWVOYW1lICsgXCI9KFteO10qKVwiKS5leGVjKGNvb2tpZSkgfHwgW10pLnBvcCgpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvcmVhZENvb2tpZS5qcyIsIi8qKlxuKiBTYXZlIGEgY29va2llXG4qIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gQ29va2llIG5hbWVcbiogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gQ29va2llIHZhbHVlXG4qIEBwYXJhbSB7c3RyaW5nfSBkb21haW4gLSBEb21haW4gb24gd2hpY2ggdG8gc2V0IGNvb2tpZVxuKiBAcGFyYW0ge2ludGVnZXJ9IGRheXMgLSBOdW1iZXIgb2YgZGF5cyBiZWZvcmUgY29va2llIGV4cGlyZXNcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgZG9tYWluLCBkYXlzKSB7XG4gIGNvbnN0IGV4cGlyZXMgPSBkYXlzID8gXCI7IGV4cGlyZXM9XCIgKyAobmV3IERhdGUoZGF5cyAqIDg2NEU1ICsgKG5ldyBEYXRlKCkpLmdldFRpbWUoKSkpLnRvR01UU3RyaW5nKCkgOiBcIlwiO1xuICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIGV4cGlyZXMgKyBcIjsgcGF0aD0vOyBkb21haW49XCIgKyBkb21haW47XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9jcmVhdGVDb29raWUuanMiLCIvKipcbiogR2V0IHRoZSBkb21haW4gZnJvbSBhIFVSTFxuKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTFxuKiBAcGFyYW0ge2Jvb2xlYW59IHJvb3QgLSBXaGV0aGVyIHRvIHJldHVybiB0aGUgcm9vdCBkb21haW4gcmF0aGVyIHRoYW4gYSBzdWJkb21haW5cbiogQHJldHVybiB7c3RyaW5nfSAtIFRoZSBwYXJzZWQgZG9tYWluXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odXJsLCByb290KSB7XG4gIGZ1bmN0aW9uIHBhcnNlVXJsKHVybCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICB0YXJnZXQuaHJlZiA9IHVybDtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgaWYgKHR5cGVvZiB1cmwgPT09ICdzdHJpbmcnKSB7XG4gICAgdXJsID0gcGFyc2VVcmwodXJsKTtcbiAgfVxuICBsZXQgZG9tYWluID0gdXJsLmhvc3RuYW1lO1xuICBpZiAocm9vdCkge1xuICAgIGNvbnN0IHNsaWNlID0gZG9tYWluLm1hdGNoKC9cXC51ayQvKSA/IC0zIDogLTI7XG4gICAgZG9tYWluID0gZG9tYWluLnNwbGl0KFwiLlwiKS5zbGljZShzbGljZSkuam9pbihcIi5cIik7XG4gIH1cbiAgcmV0dXJuIGRvbWFpbjtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2dldERvbWFpbi5qcyIsIi8qKlxuKiBWYWxpZGF0ZSBhIGZvcm0gYW5kIHN1Ym1pdCB2aWEgdGhlIHNpZ251cCBBUElcbiovXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCB6aXBjb2RlcyBmcm9tICcuL2RhdGEvemlwY29kZXMuanNvbidcbmltcG9ydCBmb3JtRXJyb3JzIGZyb20gJy4vZGF0YS9mb3JtLWVycm9ycy5qc29uJ1xuICBcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICAvLyBjb25zdCAkc2lnbnVwRm9ybXMgPSAkKCcuZ3VueS1zaWdudXAnKTtcbiAgY29uc3QgZXJyb3JNc2cgPSAnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYW5kIHppcCBjb2RlIGFuZCBzZWxlY3QgYXQgbGVhc3Qgb25lIGFnZSBncm91cC4nO1xuXG4gIC8qKlxuICAqIFZhbGlkYXRlIGZvcm0gZmllbGRzXG4gICogQHBhcmFtIHtvYmplY3R9IGZvcm1EYXRhIC0gZm9ybSBmaWVsZHNcbiAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBldmVudCBvYmplY3RcbiAgKi9cbiAgZnVuY3Rpb24gdmFsaWRhdGVGaWVsZHMoZm9ybSwgZXZlbnQpIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgXG4gICAgY29uc3QgZmllbGRzID0gZm9ybS5maW5kKCdmb3JtJykuc2VyaWFsaXplQXJyYXkoKS5yZWR1Y2UoKG9iaiwgaXRlbSkgPT4gKG9ialtpdGVtLm5hbWVdID0gaXRlbS52YWx1ZSwgb2JqKSAse30pXG4gICAgY29uc3QgcmVxdWlyZWRGaWVsZHMgPSBmb3JtLmZpbmQoJ1tyZXF1aXJlZF0nKTtcbiAgICBjb25zdCBlbWFpbFJlZ2V4ID0gbmV3IFJlZ0V4cCgvXFxTK0BcXFMrXFwuXFxTKy8pO1xuICAgIGNvbnN0IHppcFJlZ2V4ID0gbmV3IFJlZ0V4cCgvXlxcZHs1fSgtXFxkezR9KT8kL2kpO1xuICAgIGNvbnN0IHBob25lUmVnZXggPSBuZXcgUmVnRXhwKC9eW1xcK10/WyhdP1swLTldezN9WyldP1stXFxzXFwuXT9bMC05XXszfVstXFxzXFwuXT9bMC05XXs0LDZ9JC9pbSk7XG4gICAgbGV0IGdyb3VwU2VsZXRlZCA9IE9iamVjdC5rZXlzKGZpZWxkcykuZmluZChhID0+YS5pbmNsdWRlcyhcImdyb3VwXCIpKT8gdHJ1ZSA6IGZhbHNlO1xuICAgIGxldCBoYXNFcnJvcnMgPSBmYWxzZTtcblxuICAgIC8vIGxvb3AgdGhyb3VnaCBlYWNoIHJlcXVpcmVkIGZpZWxkXG4gICAgcmVxdWlyZWRGaWVsZHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGZpZWxkTmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnaXMtZXJyb3InKTtcblxuICAgICAgaWYoKHR5cGVvZiBmaWVsZHNbZmllbGROYW1lXSA9PT0gJ3VuZGVmaW5lZCcpICYmICFncm91cFNlbGV0ZWQpIHtcbiAgICAgICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCdmaWVsZHNldCcpLmZpbmQoJy5ndW55LWVycm9yLWRldGFpbGVkJykuaHRtbCgnPHA+UGxlYXNlIHNlbGVjdCBmcm9tIHRoZSBsaXN0IGJlbG93LjwvcD4nKTs7XG5cbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtZXJyb3InKTtcbiAgICAgIH1cblxuICAgICAgaWYoKGZpZWxkTmFtZSA9PSAnRU1BSUwnICYmICFlbWFpbFJlZ2V4LnRlc3QoZmllbGRzLkVNQUlMKSkgfHwgXG4gICAgICAgIChmaWVsZE5hbWUgPT0gJ1pJUCcgJiYgIXppcFJlZ2V4LnRlc3QoZmllbGRzLlpJUCkpIHx8XG4gICAgICAgIChmaWVsZE5hbWUgPT0gJ1BIT05FTlVNJyAmJiAhcGhvbmVSZWdleC50ZXN0KGZpZWxkcy5QSE9ORU5VTSkgJiYgZmllbGRzLlBIT05FTlVNLmxlbmd0aCAhPTApXG4gICAgICApIHtcbiAgICAgICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmd1bnktZXJyb3ItZGV0YWlsZWQnKS5odG1sKCc8cD4nICsgZm9ybUVycm9ycy5maW5kKHggPT4geFtmaWVsZE5hbWVdKVtmaWVsZE5hbWVdICsgJzwvcD4nKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtZXJyb3InKTtcbiAgICAgIH1cblxuICAgICAgLy8gYXNzaWduIHRoZSBjb3JyZWN0IGJvcm91Z2ggdG8gZ29vZCB6aXBcbiAgICAgIGlmKChmaWVsZE5hbWUgPT0gJ0VNQUlMJyAmJiBlbWFpbFJlZ2V4LnRlc3QoZmllbGRzLkVNQUlMKSkpe1xuICAgICAgICBmaWVsZHMuQk9ST1VHSCA9IGFzc2lnbkJvcm91Z2goZmllbGRzLlpJUCk7XG4gICAgICB9XG5cbiAgICAgIGlmKChmaWVsZE5hbWUgIT0gJ0VNQUlMJykgJiYgKGZpZWxkTmFtZSAhPSAnWklQJykgJiYgKGZpZWxkTmFtZSAhPSAnUEhPTkVOVU0nKSAmJiBmaWVsZHNbZmllbGROYW1lXSA9PT0gXCJcIlxuICAgICAgKSB7XG4gICAgICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgICAgICQodGhpcykuc2libGluZ3MoJy5ndW55LWVycm9yLWRldGFpbGVkJykuaHRtbCgnPHA+JyArIGZvcm1FcnJvcnMuZmluZCh4ID0+IHhbZmllbGROYW1lXSlbZmllbGROYW1lXSArICc8L3A+Jyk7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2lzLWVycm9yJyk7XG4gICAgICB9XG5cbiAgICB9KTtcblxuICAgIC8vIGlmIHRoZXJlIGFyZSBubyBlcnJvcnMsIHN1Ym1pdFxuICAgIGlmIChoYXNFcnJvcnMpIHtcbiAgICAgIGZvcm0uZmluZCgnLmd1bnktZXJyb3InKS5odG1sKGA8cD4ke2Vycm9yTXNnfTwvcD5gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VibWl0U2lnbnVwKGZvcm0sIGZpZWxkcyk7XG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgKiBBc3NpZ25zIHRoZSBib3JvdWdoIGJhc2VkIG9uIHRoZSB6aXAgY29kZVxuICAqIEBwYXJhbSB7c3RyaW5nfSB6aXAgLSB6aXAgY29kZVxuICAqL1xuICBmdW5jdGlvbiBhc3NpZ25Cb3JvdWdoKHppcCl7XG4gICAgbGV0IGJvcm91Z2ggPSAnJztcbiAgICBsZXQgaW5kZXggPSB6aXBjb2Rlcy5maW5kSW5kZXgoeCA9PiB4LmNvZGVzLmluZGV4T2YocGFyc2VJbnQoemlwKSkgPiAtMSk7XG5cbiAgICBpZihpbmRleCA9PT0gLTEpe1xuICAgICAgYm9yb3VnaCA9IFwiTWFuaGF0dGFuXCI7XG4gICAgfWVsc2Uge1xuICAgICAgYm9yb3VnaCA9IHppcGNvZGVzW2luZGV4XS5ib3JvdWdoO1xuICAgIH1cblxuICAgIHJldHVybiBib3JvdWdoO1xuICB9XG5cbiAgLyoqXG4gICogU3VibWl0cyB0aGUgZm9ybSBvYmplY3QgdG8gTWFpbGNoaW1wXG4gICogQHBhcmFtIHtvYmplY3R9IGZvcm1EYXRhIC0gZm9ybSBmaWVsZHNcbiAgKi9cbiAgZnVuY3Rpb24gc3VibWl0U2lnbnVwKGZvcm0sIGZvcm1EYXRhKXtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiBmb3JtLmF0dHIoJ2FjdGlvbicpLFxuICAgICAgdHlwZTogZm9ybS5hdHRyKCdtZXRob2QnKSxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsLy9ubyBqc29ucFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5yZXN1bHQgIT09ICdzdWNjZXNzJyl7XG4gICAgICAgICAgaWYoZm9ybVswXS5jbGFzc05hbWUuaW5kZXhPZignY29udGFjdCcpID4gLTEpe1xuICAgICAgICAgICAgZm9ybS5odG1sKCc8cCBjbGFzcz1cInRleHQtY2VudGVyXCI+U29tZXRoaW5nIHdlbnQgd3JvbmcuIFRyeSBhZ2FpbiBsYXRlciE8L3A+Jyk7XG4gICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgaWYocmVzcG9uc2UubXNnLmluY2x1ZGVzKCd0b28gbWFueSByZWNlbnQgc2lnbnVwIHJlcXVlc3RzJykpe1xuICAgICAgICAgICAgICBmb3JtLmZpbmQoJy5ndW55LWVycm9yJykuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPlRoZXJlIHdhcyBhIHByb2JsZW0gd2l0aCB5b3VyIHN1YnNjcmlwdGlvbi48L3A+Jyk7XG4gICAgICAgICAgICB9ZWxzZSBpZihyZXNwb25zZS5tc2cuaW5jbHVkZXMoJ2FscmVhZHkgc3Vic2NyaWJlZCcpKXtcbiAgICAgICAgICAgICAgZm9ybS5maW5kKCcuZ3VueS1lcnJvcicpLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1jZW50ZXJcIj5Zb3UgYXJlIGFscmVhZHkgc2lnbmVkIHVwIGZvciB1cGRhdGVzISBDaGVjayB5b3VyIGVtYWlsLjwvcD4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICBpZihmb3JtWzBdLmNsYXNzTmFtZS5pbmRleE9mKCdjb250YWN0JykgPiAtMSl7XG4gICAgICAgICAgICBmb3JtLmh0bWwoJzxwIGNsYXNzPVwidGV4dC1jZW50ZXJcIj5UaGFuayB5b3UgZm9yIGNvbnRhY3RpbmcgdXMhIFNvbWVvbmUgd2lsbCByZXNwb25kIHRvIHlvdSBzaG9ydGx5LjwvcD4nKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGZvcm0uaHRtbCgnPHAgY2xhc3M9XCJjLXNpZ251cC1mb3JtX19zdWNjZXNzXCI+T25lIG1vcmUgc3RlcCEgPGJyIC8+IFBsZWFzZSBjaGVjayB5b3VyIGluYm94IGFuZCBjb25maXJtIHlvdXIgZW1haWwgYWRkcmVzcyB0byBzdGFydCByZWNlaXZpbmcgdXBkYXRlcy4gPGJyIC8+VGhhbmtzIGZvciBzaWduaW5nIHVwITwvcD4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgZm9ybS5maW5kKCcuZ3VueS1lcnJvcicpLmh0bWwoJzxwPlRoZXJlIHdhcyBhIHByb2JsZW0gd2l0aCB5b3VyIHN1YnNjcmlwdGlvbi4gQ2hlY2sgYmFjayBsYXRlci48L3A+Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgKiBUcmlnZ2VycyBmb3JtIHZhbGlkYXRpb24gYW5kIHNlbmRzIHRoZSBmb3JtIGRhdGEgdG8gTWFpbGNoaW1wXG4gICogQHBhcmFtIHtvYmplY3R9IGZvcm1EYXRhIC0gZm9ybSBmaWVsZHNcbiAgKi9cbiAgJCgnYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0nKS5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgZm9ybUNsYXNzID0gJCh0aGlzKS5wYXJlbnRzKCdmb3JtJykucGFyZW50cygnZGl2JykuYXR0cignY2xhc3MnKTtcbiAgICBsZXQgJGZvcm0gPSAkKCcuJyArIGZvcm1DbGFzcy5yZXBsYWNlKC8gL2csICcuJykpO1xuICAgIHZhbGlkYXRlRmllbGRzKCRmb3JtLCBldmVudCk7XG4gIH0pO1xuXG4gIC8qKlxuICAqIENoZWNraW5nIGNoYXJhY3RlcnMgYWdhaW5zdCB0aGUgMjU1IGNoYXIgbGltaXRcbiAgKi9cbiAgJCgnLnRleHRhcmVhJykua2V5dXAoZnVuY3Rpb24oKXtcbiAgICBsZXQgY2hhckxlbiA9IDI1NSAtICQodGhpcykudmFsKCkubGVuZ3RoO1xuICAgICQoJy5jaGFyLWNvdW50JykudGV4dCgnQ2hhcmFjdGVycyBsZWZ0OiAnICsgY2hhckxlbik7XG4gICAgaWYoY2hhckxlbiA8IDApe1xuICAgICAgJCgnLmNoYXItY291bnQnKS5jc3MoXCJjb2xvclwiLCAnI2Q4MDA2ZCcpO1xuICAgICAgJCh0aGlzKS5jc3MoXCJib3JkZXItY29sb3JcIiwgJyNkODAwNmQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnLmNoYXItY291bnQnKS5jc3MoXCJjb2xvclwiLCAnIzMzMycpO1xuICAgICAgJCh0aGlzKS5jc3MoXCJib3JkZXItY29sb3JcIiwgJyMyNzkzZTAnKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvbmV3c2xldHRlci1zaWdudXAuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFt7XCJib3JvdWdoXCI6XCJCcm9ueFwiLFwiY29kZXNcIjpbMTA0NTEsMTA0NTIsMTA0NTMsMTA0NTQsMTA0NTUsMTA0NTYsMTA0NTcsMTA0NTgsMTA0NTksMTA0NjAsMTA0NjEsMTA0NjIsMTA0NjMsMTA0NjQsMTA0NjUsMTA0NjYsMTA0NjcsMTA0NjgsMTA0NjksMTA0NzAsMTA0NzEsMTA0NzIsMTA0NzMsMTA0NzQsMTA0NzVdfSx7XCJib3JvdWdoXCI6XCJCcm9va2x5blwiLFwiY29kZXNcIjpbMTEyMDEsMTEyMDIsMTEyMDMsMTEyMDQsMTEyMDUsMTEyMDYsMTEyMDcsMTEyMDgsMTEyMDksMTEyMTAsMTEyMTEsMTEyMTIsMTEyMTMsMTEyMTQsMTEyMTUsMTEyMTYsMTEyMTcsMTEyMTgsMTEyMTksMTEyMjAsMTEyMjEsMTEyMjIsMTEyMjMsMTEyMjQsMTEyMjUsMTEyMjYsMTEyMjgsMTEyMjksMTEyMzAsMTEyMzEsMTEyMzIsMTEyMzMsMTEyMzQsMTEyMzUsMTEyMzYsMTEyMzcsMTEyMzgsMTEyMzksMTEyNDEsMTEyNDIsMTEyNDMsMTEyNDUsMTEyNDcsMTEyNDksMTEyNTEsMTEyNTIsMTEyNTZdfSx7XCJib3JvdWdoXCI6XCJNYW5oYXR0YW5cIixcImNvZGVzXCI6WzEwMDAxLDEwMDAyLDEwMDAzLDEwMDA0LDEwMDA1LDEwMDA2LDEwMDA3LDEwMDA4LDEwMDA5LDEwMDEwLDEwMDExLDEwMDEyLDEwMDEzLDEwMDE0LDEwMDE2LDEwMDE3LDEwMDE4LDEwMDE5LDEwMDIwLDEwMDIxLDEwMDIyLDEwMDIzLDEwMDI0LDEwMDI1LDEwMDI3LDEwMDI4LDEwMDI5LDEwMDMwLDEwMDMxLDEwMDMyLDEwMDMzLDEwMDM0LDEwMDM1LDEwMDM2LDEwMDM3LDEwMDM4LDEwMDM5LDEwMDQwLDEwMDQxLDEwMDQ1LDEwMDU1LDEwMDgxLDEwMDg3LDEwMTAxLDEwMTAzLDEwMTA0LDEwMTA1LDEwMTA2LDEwMTA3LDEwMTA4LDEwMTA5LDEwMTEwLDEwMTExLDEwMTEyLDEwMTEzLDEwMTE0LDEwMTE1LDEwMTE2LDEwMTE4LDEwMTE5LDEwMTIwLDEwMTIxLDEwMTIyLDEwMTIzLDEwMTI4LDEwMTUwLDEwMTUxLDEwMTUyLDEwMTUzLDEwMTU0LDEwMTU1LDEwMTU2LDEwMTU4LDEwMTU5LDEwMTYyLDEwMTY1LDEwMTY2LDEwMTY3LDEwMTY4LDEwMTY5LDEwMTcwLDEwMTcxLDEwMTcyLDEwMTczLDEwMTc0LDEwMTc1LDEwMTc2LDEwMTc3LDEwMTc4LDEwMTg1LDEwMTk5LDEwMjEyLDEwMjQ5LDEwMjU2LDEwMjU5LDEwMjYxLDEwMjY4LDEwMjcwLDEwMjcxLDEwMjc2LDEwMjc4LDEwMjc5LDEwMjgwLDEwMjgxLDEwMjgyLDEwMjg2XX0se1wiYm9yb3VnaFwiOlwiUXVlZW5zXCIsXCJjb2Rlc1wiOlsxMTEwMSwxMTEwMiwxMTEwMywxMTEwNCwxMTEwNiwxMTEwOSwxMTEyMCwxMTM1MSwxMTM1MiwxMTM1NCwxMTM1NSwxMTM1NiwxMTM1NywxMTM1OCwxMTM1OSwxMTM2MCwxMTM2MSwxMTM2MiwxMTM2MywxMTM2NCwxMTM2NSwxMTM2NiwxMTM2NywxMTM2OCwxMTM2OSwxMTM3MCwxMTM3MSwxMTM3MiwxMTM3MywxMTM3NCwxMTM3NSwxMTM3NywxMTM3OCwxMTM3OSwxMTM4MCwxMTM4MSwxMTM4NSwxMTM4NiwxMTQwNSwxMTQxMSwxMTQxMywxMTQxNCwxMTQxNSwxMTQxNiwxMTQxNywxMTQxOCwxMTQxOSwxMTQyMCwxMTQyMSwxMTQyMiwxMTQyMywxMTQyNCwxMTQyNSwxMTQyNiwxMTQyNywxMTQyOCwxMTQyOSwxMTQzMCwxMTQzMSwxMTQzMiwxMTQzMywxMTQzNCwxMTQzNSwxMTQzNiwxMTQzOSwxMTQ1MSwxMTY5MCwxMTY5MSwxMTY5MiwxMTY5MywxMTY5NCwxMTY5NSwxMTY5N119LHtcImJvcm91Z2hcIjpcIlN0YXRlbiBJc2xhbmRcIixcImNvZGVzXCI6WzEwMzAxLDEwMzAyLDEwMzAzLDEwMzA0LDEwMzA1LDEwMzA2LDEwMzA3LDEwMzA4LDEwMzA5LDEwMzEwLDEwMzExLDEwMzEyLDEwMzEzLDEwMzE0XX1dXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kdWxlcy9kYXRhL3ppcGNvZGVzLmpzb25cbi8vIG1vZHVsZSBpZCA9IDYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gW3tcIkVNQUlMXCI6XCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbC5cIn0se1wiRk5BTUVcIjpcIlBsZWFzZSBlbnRlciB5b3VyIGZpcnN0IG5hbWUuXCJ9LHtcIkxOQU1FXCI6XCJQbGVhc2UgZW50ZXIgeW91ciBsYXN0IG5hbWUuXCJ9LHtcIlpJUFwiOlwiUGxlYXNlIGVudGVyIGEgdmFsaWQgVVMgemlwIGNvZGUuXCJ9LHtcIlBIT05FTlVNXCI6XCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBwaG9uZSBudW1iZXIuXCJ9LHtcIk1FU1NBR0VcIjpcIlBsZWFzZSBlbnRlciBhIG1lc3NhZ2UuIExpbWl0ZWQgdG8gMjU1IGNoYXJhY3RlcnMuXCJ9LHtcIkdST1VQXCI6XCJQbGVhc2Ugc2VsZWN0IG9uZS5cIn1dXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kdWxlcy9kYXRhL2Zvcm0tZXJyb3JzLmpzb25cbi8vIG1vZHVsZSBpZCA9IDYyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuKiBGb3JtIEVmZmVjdHMgbW9kdWxlXG4qIEBtb2R1bGUgbW9kdWxlcy9mb3JtRWZmZWN0c1xuKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2Ryb3BzL1RleHRJbnB1dEVmZmVjdHMvYmxvYi9tYXN0ZXIvaW5kZXgyLmh0bWxcbiovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcbmltcG9ydCBkaXNwYXRjaEV2ZW50IGZyb20gJy4vZGlzcGF0Y2hFdmVudC5qcyc7XG5cbi8qKlxuKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIHNldCBhbiAnaXMtZmlsbGVkJyBjbGFzcyBvbiBpbnB1dHMgdGhhdCBhcmUgZm9jdXNlZCBvclxuKiBjb250YWluIHRleHQuIENhbiB0aGVuIGJlIHVzZWQgdG8gYWRkIGVmZmVjdHMgdG8gdGhlIGZvcm0sIHN1Y2ggYXMgbW92aW5nXG4qIHRoZSBsYWJlbC5cbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgLyoqXG4gICogQWRkIHRoZSBmaWxsZWQgY2xhc3Mgd2hlbiBpbnB1dCBpcyBmb2N1c2VkXG4gICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAqL1xuICBmdW5jdGlvbiBoYW5kbGVGb2N1cyhldmVudCkge1xuICAgIGNvbnN0IHdyYXBwZXJFbGVtID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgd3JhcHBlckVsZW0uY2xhc3NMaXN0LmFkZCgnaXMtZmlsbGVkJyk7XG4gIH1cblxuICAvKipcbiAgKiBSZW1vdmUgdGhlIGZpbGxlZCBjbGFzcyB3aGVuIGlucHV0IGlzIGJsdXJyZWQgaWYgaXQgZG9lcyBub3QgY29udGFpbiB0ZXh0XG4gICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAqL1xuICBmdW5jdGlvbiBoYW5kbGVCbHVyKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC52YWx1ZS50cmltKCkgPT09ICcnKSB7XG4gICAgICBjb25zdCB3cmFwcGVyRWxlbSA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgd3JhcHBlckVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaXMtZmlsbGVkJyk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNpZ251cC1mb3JtX19maWVsZCcpO1xuICBpZiAoaW5wdXRzLmxlbmd0aCkge1xuICAgIGZvckVhY2goaW5wdXRzLCBmdW5jdGlvbihpbnB1dEVsZW0pIHtcbiAgICAgIGlucHV0RWxlbS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZUZvY3VzKTtcbiAgICAgIGlucHV0RWxlbS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgaGFuZGxlQmx1cik7XG4gICAgICBkaXNwYXRjaEV2ZW50KGlucHV0RWxlbSwgJ2JsdXInKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvZm9ybUVmZmVjdHMuanMiLCIvKipcbiogQ3Jvc3MtYnJvd3NlciB1dGlsaXR5IHRvIGZpcmUgZXZlbnRzXG4qIEBwYXJhbSB7b2JqZWN0fSBlbGVtIC0gRE9NIGVsZW1lbnQgdG8gZmlyZSBldmVudCBvblxuKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gRXZlbnQgdHlwZSwgaS5lLiAncmVzaXplJywgJ2NsaWNrJ1xuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGVsZW0sIGV2ZW50VHlwZSkge1xuICBsZXQgZXZlbnQ7XG4gIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCkge1xuICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgICBldmVudC5pbml0RXZlbnQoZXZlbnRUeXBlLCB0cnVlLCB0cnVlKTtcbiAgICBlbGVtLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICBlbGVtLmZpcmVFdmVudCgnb24nICsgZXZlbnRUeXBlLCBldmVudCk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2Rpc3BhdGNoRXZlbnQuanMiLCIvKipcbiogRmFjZXRXUCBFdmVudCBIYW5kbGluZ1xuKiBSZXF1aXJlcyBmcm9udC5qcywgd2hpY2ggaXMgYWRkZWQgYnkgdGhlIEZhY2V0V1AgcGx1Z2luXG4qIEFsc28gcmVxdWlyZXMgalF1ZXJ5IGFzIEZhY2V0V1AgaXRzZWxmIHJlcXVpcmVzIGpRdWVyeVxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gICQoZG9jdW1lbnQpLm9uKCdmYWNldHdwLXJlZnJlc2gnLCBmdW5jdGlvbigpIHtcbiAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2ZhY2V0d3AtaXMtbG9hZGVkJykuYWRkQ2xhc3MoJ2ZhY2V0d3AtaXMtbG9hZGluZycpO1xuICAgICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3AoMCk7XG4gIH0pO1xuXG4gICQoZG9jdW1lbnQpLm9uKCdmYWNldHdwLWxvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnZmFjZXR3cC1pcy1sb2FkaW5nJykuYWRkQ2xhc3MoJ2ZhY2V0d3AtaXMtbG9hZGVkJyk7XG4gIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvZmFjZXRzLmpzIiwiLyoqXHJcbiogT3dsIFNldHRpbmdzIG1vZHVsZVxyXG4qIEBtb2R1bGUgbW9kdWxlcy9vd2xTZXR0aW5nc1xyXG4qIEBzZWUgaHR0cHM6Ly9vd2xjYXJvdXNlbDIuZ2l0aHViLmlvL093bENhcm91c2VsMi9pbmRleC5odG1sXHJcbiovXHJcblxyXG4vKipcclxuKiBvd2wgY2Fyb3VzZWwgc2V0dGluZ3MgYW5kIHRvIG1ha2UgdGhlIG93bCBjYXJvdXNlbCB3b3JrLlxyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuICB2YXIgb3dsID0gJCgnLm93bC1jYXJvdXNlbCcpO1xyXG4gIG93bC5vd2xDYXJvdXNlbCh7XHJcbiAgICBhbmltYXRlSW46ICdmYWRlSW4nLFxyXG4gICAgYW5pbWF0ZU91dDogJ2ZhZGVPdXQnLFxyXG4gICAgaXRlbXM6MSxcclxuICAgIGxvb3A6dHJ1ZSxcclxuICAgIG1hcmdpbjowLFxyXG4gICAgZG90czogdHJ1ZSxcclxuICAgIGF1dG9wbGF5OnRydWUsXHJcbiAgICBhdXRvcGxheVRpbWVvdXQ6NTAwMCxcclxuICAgIGF1dG9wbGF5SG92ZXJQYXVzZTp0cnVlXHJcbiAgfSk7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9vd2xTZXR0aW5ncy5qcyIsIi8qKlxuKiBpT1M3IGlQYWQgSGFja1xuKiBmb3IgaGVybyBpbWFnZSBmbGlja2VyaW5nIGlzc3VlLlxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkOy4qQ1BVLipPUyA3X1xcZC9pKSkge1xuICAgICQoJy5jLXNpZGUtaGVybycpLmhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvaU9TN0hhY2suanMiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBDb29raWVzIGZyb20gJ2pzLWNvb2tpZSc7XG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuLi92ZW5kb3IvdXRpbGl0eS5qcyc7XG5pbXBvcnQgQ2xlYXZlIGZyb20gJ2NsZWF2ZS5qcy9kaXN0L2NsZWF2ZS5taW4nO1xuaW1wb3J0ICdjbGVhdmUuanMvZGlzdC9hZGRvbnMvY2xlYXZlLXBob25lLnVzJztcblxuLyogZXNsaW50IG5vLXVuZGVmOiBcIm9mZlwiICovXG5jb25zdCBWYXJpYWJsZXMgPSByZXF1aXJlKCcuLi8uLi92YXJpYWJsZXMuanNvbicpO1xuXG4vKipcbiAqIFRoaXMgY29tcG9uZW50IGhhbmRsZXMgdmFsaWRhdGlvbiBhbmQgc3VibWlzc2lvbiBmb3Igc2hhcmUgYnkgZW1haWwgYW5kXG4gKiBzaGFyZSBieSBTTVMgZm9ybXMuXG4vKipcbiogQWRkcyBmdW5jdGlvbmFsaXR5IHRvIHRoZSBpbnB1dCBpbiB0aGUgc2VhcmNoIHJlc3VsdHMgaGVhZGVyXG4qL1xuXG5jbGFzcyBTaGFyZUZvcm0ge1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgaHRtbCBmb3JtIGVsZW1lbnQgZm9yIHRoZSBjb21wb25lbnQuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICAvKiogQHByaXZhdGUge0hUTUxFbGVtZW50fSBUaGUgY29tcG9uZW50IGVsZW1lbnQuICovXG4gICAgdGhpcy5fZWwgPSBlbDtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGlzIGZvcm0gaXMgdmFsaWQuICovXG4gICAgdGhpcy5faXNWYWxpZCA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoZSBmb3JtIGlzIGN1cnJlbnRseSBzdWJtaXR0aW5nLiAqL1xuICAgIHRoaXMuX2lzQnVzeSA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoZSBmb3JtIGlzIGRpc2FibGVkLiAqL1xuICAgIHRoaXMuX2lzRGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGlzIGNvbXBvbmVudCBoYXMgYmVlbiBpbml0aWFsaXplZC4gKi9cbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoZSBnb29nbGUgcmVDQVBUQ0hBIHdpZGdldCBpcyByZXF1aXJlZC4gKi9cbiAgICB0aGlzLl9yZWNhcHRjaGFSZXF1aXJlZCA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoZSBnb29nbGUgcmVDQVBUQ0hBIHdpZGdldCBoYXMgcGFzc2VkLiAqL1xuICAgIHRoaXMuX3JlY2FwdGNoYVZlcmlmaWVkID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGdvb2dsZSByZUNBUFRDSEEgd2lkZ2V0IGlzIGluaXRpbGFpc2VkLiAqL1xuICAgIHRoaXMuX3JlY2FwdGNoYWluaXQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGlzIGNvbXBvbmVudCBoYXMgbm90IHlldCBiZWVuIGluaXRpYWxpemVkLCBhdHRhY2hlcyBldmVudCBsaXN0ZW5lcnMuXG4gICAqIEBtZXRob2RcbiAgICogQHJldHVybiB7dGhpc30gU2hhcmVGb3JtXG4gICAqL1xuICBpbml0KCkge1xuICAgIGlmICh0aGlzLl9pbml0aWFsaXplZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbGV0IHNlbGVjdGVkID0gdGhpcy5fZWwucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInRlbFwiXScpO1xuXG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9tYXNrUGhvbmUoc2VsZWN0ZWQpO1xuICAgIH1cblxuICAgICQoYC4ke1NoYXJlRm9ybS5Dc3NDbGFzcy5TSE9XX0RJU0NMQUlNRVJ9YClcbiAgICAgIC5vbignZm9jdXMnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2Rpc2NsYWltZXIodHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICQodGhpcy5fZWwpLm9uKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmICh0aGlzLl9yZWNhcHRjaGFSZXF1aXJlZCkge1xuICAgICAgICBpZiAodGhpcy5fcmVjYXB0Y2hhVmVyaWZpZWQpIHtcbiAgICAgICAgICB0aGlzLl92YWxpZGF0ZSgpO1xuICAgICAgICAgIGlmICh0aGlzLl9pc1ZhbGlkICYmICF0aGlzLl9pc0J1c3kgJiYgIXRoaXMuX2lzRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1Ym1pdCgpO1xuICAgICAgICAgICAgd2luZG93LmdyZWNhcHRjaGEucmVzZXQoKTtcbiAgICAgICAgICAgICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJykuYWRkQ2xhc3MoJ3JlY2FwdGNoYS1qcycpO1xuICAgICAgICAgICAgdGhpcy5fcmVjYXB0Y2hhVmVyaWZpZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJCh0aGlzLl9lbCkuZmluZChgLiR7U2hhcmVGb3JtLkNzc0NsYXNzLkVSUk9SX01TR31gKS5yZW1vdmUoKTtcbiAgICAgICAgICB0aGlzLl9zaG93RXJyb3IoU2hhcmVGb3JtLk1lc3NhZ2UuUkVDQVBUQ0hBKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGUoKTtcbiAgICAgICAgaWYgKHRoaXMuX2lzVmFsaWQgJiYgIXRoaXMuX2lzQnVzeSAmJiAhdGhpcy5faXNEaXNhYmxlZCkge1xuICAgICAgICAgIHRoaXMuX3N1Ym1pdCgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIC8vIERldGVybWluZSB3aGV0aGVyIG9yIG5vdCB0byBpbml0aWFsaXplIFJlQ0FQVENIQS4gVGhpcyBzaG91bGQgYmVcbiAgICAgIC8vIC8vIGluaXRpYWxpemVkIG9ubHkgb24gZXZlcnkgMTB0aCB2aWV3IHdoaWNoIGlzIGRldGVybWluZWQgdmlhIGFuXG4gICAgICAvLyAvLyBpbmNyZW1lbnRpbmcgY29va2llLlxuICAgICAgbGV0IHZpZXdDb3VudCA9IENvb2tpZXMuZ2V0KCdzY3JlZW5lclZpZXdzJykgP1xuICAgICAgICBwYXJzZUludChDb29raWVzLmdldCgnc2NyZWVuZXJWaWV3cycpLCAxMCkgOiAxO1xuICAgICAgaWYgKHZpZXdDb3VudCA+PSA1ICYmICF0aGlzLl9yZWNhcHRjaGFpbml0KSB7XG4gICAgICAgICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJykuYWRkQ2xhc3MoJ3JlY2FwdGNoYS1qcycpO1xuICAgICAgICB0aGlzLl9pbml0UmVjYXB0Y2hhKCk7XG4gICAgICAgIHRoaXMuX3JlY2FwdGNoYWluaXQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgQ29va2llcy5zZXQoJ3NjcmVlbmVyVmlld3MnLCArK3ZpZXdDb3VudCwge2V4cGlyZXM6ICgyLzE0NDApfSk7XG5cbiAgICAgICQoXCIjcGhvbmVcIikuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcykucmVtb3ZlQXR0cigncGxhY2Vob2xkZXInKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gLy8gRGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRvIGluaXRpYWxpemUgUmVDQVBUQ0hBLiBUaGlzIHNob3VsZCBiZVxuICAgIC8vIC8vIGluaXRpYWxpemVkIG9ubHkgb24gZXZlcnkgMTB0aCB2aWV3IHdoaWNoIGlzIGRldGVybWluZWQgdmlhIGFuXG4gICAgLy8gLy8gaW5jcmVtZW50aW5nIGNvb2tpZS5cbiAgICBsZXQgdmlld0NvdW50ID0gQ29va2llcy5nZXQoJ3NjcmVlbmVyVmlld3MnKSA/XG4gICAgICBwYXJzZUludChDb29raWVzLmdldCgnc2NyZWVuZXJWaWV3cycpLCAxMCkgOiAxO1xuICAgIGlmICh2aWV3Q291bnQgPj0gNSAmJiAhdGhpcy5fcmVjYXB0Y2hhaW5pdCApIHtcbiAgICAgICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJykuYWRkQ2xhc3MoJ3JlY2FwdGNoYS1qcycpO1xuICAgICAgdGhpcy5faW5pdFJlY2FwdGNoYSgpO1xuICAgICAgdGhpcy5fcmVjYXB0Y2hhaW5pdCA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXNrIGVhY2ggcGhvbmUgbnVtYmVyIGFuZCBwcm9wZXJseSBmb3JtYXQgaXRcbiAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGlucHV0IHRoZSBcInRlbFwiIGlucHV0IHRvIG1hc2tcbiAgICogQHJldHVybiB7Y29uc3RydWN0b3J9ICAgICAgIHRoZSBpbnB1dCBtYXNrXG4gICAqL1xuICBfbWFza1Bob25lKGlucHV0KSB7XG4gICAgbGV0IGNsZWF2ZSA9IG5ldyBDbGVhdmUoaW5wdXQsIHtcbiAgICAgIHBob25lOiB0cnVlLFxuICAgICAgcGhvbmVSZWdpb25Db2RlOiAndXMnLFxuICAgICAgZGVsaW1pdGVyOiAnLSdcbiAgICB9KTtcbiAgICBpbnB1dC5jbGVhdmUgPSBjbGVhdmU7XG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGRpc2NsYWltZXIgdmlzaWJpbGl0eVxuICAgKiBAcGFyYW0gIHtCb29sZWFufSB2aXNpYmxlIC0gd2V0aGVyIHRoZSBkaXNjbGFpbWVyIHNob3VsZCBiZSB2aXNpYmxlIG9yIG5vdFxuICAgKi9cbiAgX2Rpc2NsYWltZXIodmlzaWJsZSA9IHRydWUpIHtcbiAgICBsZXQgJGVsID0gJCgnI2pzLWRpc2NsYWltZXInKTtcbiAgICBsZXQgJGNsYXNzID0gKHZpc2libGUpID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyc7XG4gICAgJGVsLmF0dHIoJ2FyaWEtaGlkZGVuJywgIXZpc2libGUpO1xuICAgICRlbC5hdHRyKFNoYXJlRm9ybS5Dc3NDbGFzcy5ISURERU4sICF2aXNpYmxlKTtcbiAgICAkZWxbJGNsYXNzXShTaGFyZUZvcm0uQ3NzQ2xhc3MuQU5JTUFURV9ESVNDTEFJTUVSKTtcbiAgICAvLyBTY3JvbGwtdG8gZnVuY3Rpb25hbGl0eSBmb3IgbW9iaWxlXG4gICAgaWYgKFxuICAgICAgd2luZG93LnNjcm9sbFRvICYmXG4gICAgICB2aXNpYmxlICYmXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCA8IFZhcmlhYmxlc1snc2NyZWVuLWRlc2t0b3AnXVxuICAgICkge1xuICAgICAgbGV0ICR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcbiAgICAgIHdpbmRvdy5zY3JvbGxUbyhcbiAgICAgICAgMCwgJHRhcmdldC5vZmZzZXQoKS50b3AgLSAkdGFyZ2V0LmRhdGEoJ3Njcm9sbE9mZnNldCcpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIHZhbGlkYXRpb24gcnVsZXMgYW5kIHNldHMgdmFsaWRpdHkgb2YgY29tcG9uZW50LlxuICAgKiBAbWV0aG9kXG4gICAqIEByZXR1cm4ge3RoaXN9IFNoYXJlRm9ybVxuICAgKi9cbiAgX3ZhbGlkYXRlKCkge1xuICAgIGxldCB2YWxpZGl0eSA9IHRydWU7XG4gICAgY29uc3QgJHRlbCA9ICQodGhpcy5fZWwpLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZWxcIl0nKTtcbiAgICAvLyBDbGVhciBhbnkgZXhpc3RpbmcgZXJyb3IgbWVzc2FnZXMuXG4gICAgJCh0aGlzLl9lbCkuZmluZChgLiR7U2hhcmVGb3JtLkNzc0NsYXNzLkVSUk9SX01TR31gKS5yZW1vdmUoKTtcblxuICAgIGlmICgkdGVsLmxlbmd0aCkge1xuICAgICAgdmFsaWRpdHkgPSB0aGlzLl92YWxpZGF0ZVBob25lTnVtYmVyKCR0ZWxbMF0pO1xuICAgIH1cblxuICAgIHRoaXMuX2lzVmFsaWQgPSB2YWxpZGl0eTtcbiAgICBpZiAodGhpcy5faXNWYWxpZCkge1xuICAgICAgJCh0aGlzLl9lbCkucmVtb3ZlQ2xhc3MoU2hhcmVGb3JtLkNzc0NsYXNzLkVSUk9SKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogRm9yIGEgZ2l2ZW4gaW5wdXQsIGNoZWNrcyB0byBzZWUgaWYgaXRzIHZhbHVlIGlzIGEgdmFsaWQgUGhvbmVudW1iZXIuIElmIG5vdCxcbiAgICogZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBhbmQgc2V0cyBhbiBlcnJvciBjbGFzcyBvbiB0aGUgZWxlbWVudC5cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaW5wdXQgLSBUaGUgaHRtbCBmb3JtIGVsZW1lbnQgZm9yIHRoZSBjb21wb25lbnQuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gVmFsaWQgZW1haWwuXG4gICAqL1xuICBfdmFsaWRhdGVQaG9uZU51bWJlcihpbnB1dCl7XG4gICAgbGV0IG51bSA9IHRoaXMuX3BhcnNlUGhvbmVOdW1iZXIoaW5wdXQudmFsdWUpOyAvLyBwYXJzZSB0aGUgbnVtYmVyXG4gICAgbnVtID0gKG51bSkgPyBudW0uam9pbignJykgOiAwOyAvLyBpZiBudW0gaXMgbnVsbCwgdGhlcmUgYXJlIG5vIG51bWJlcnNcbiAgICBpZiAobnVtLmxlbmd0aCA9PT0gMTApIHtcbiAgICAgIHJldHVybiB0cnVlOyAvLyBhc3N1bWUgaXQgaXMgcGhvbmUgbnVtYmVyXG4gICAgfVxuICAgIHRoaXMuX3Nob3dFcnJvcihTaGFyZUZvcm0uTWVzc2FnZS5QSE9ORSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIHZhciBwaG9uZW5vID0gL15cXCs/KFswLTldezJ9KVxcKT9bLS4gXT8oWzAtOV17NH0pWy0uIF0/KFswLTldezR9KSQvO1xuICAgIC8vIHZhciBwaG9uZW5vID0gKC9eXFwrP1sxLTldXFxkezEsMTR9JC8pO1xuICAgIC8vIGlmKCFpbnB1dC52YWx1ZS5tYXRjaChwaG9uZW5vKSl7XG4gICAgLy8gICB0aGlzLl9zaG93RXJyb3IoU2hhcmVGb3JtLk1lc3NhZ2UuUEhPTkUpO1xuICAgIC8vICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIH1cbiAgICAvLyByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQganVzdCB0aGUgcGhvbmUgbnVtYmVyIG9mIGEgZ2l2ZW4gdmFsdWVcbiAgICogQHBhcmFtICB7c3RyaW5nfSB2YWx1ZSBUaGUgc3RyaW5nIHRvIGdldCBudW1iZXJzIGZyb21cbiAgICogQHJldHVybiB7YXJyYXl9ICAgICAgIEFuIGFycmF5IHdpdGggbWF0Y2hlZCBibG9ja3NcbiAgICovXG4gIF9wYXJzZVBob25lTnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9cXGQrL2cpOyAvLyBnZXQgb25seSBkaWdpdHNcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgYSBnaXZlbiBpbnB1dCwgY2hlY2tzIHRvIHNlZSBpZiBpdCBoYXMgYSB2YWx1ZS4gSWYgbm90LCBkaXNwbGF5cyBhblxuICAgKiBlcnJvciBtZXNzYWdlIGFuZCBzZXRzIGFuIGVycm9yIGNsYXNzIG9uIHRoZSBlbGVtZW50LlxuICAgKiBAbWV0aG9kXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGlucHV0IC0gVGhlIGh0bWwgZm9ybSBlbGVtZW50IGZvciB0aGUgY29tcG9uZW50LlxuICAgKiBAcmV0dXJuIHtib29sZWFufSAtIFZhbGlkIHJlcXVpcmVkIGZpZWxkLlxuICAgKi9cbiAgX3ZhbGlkYXRlUmVxdWlyZWQoaW5wdXQpIHtcbiAgICBpZiAoJChpbnB1dCkudmFsKCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB0aGlzLl9zaG93RXJyb3IoU2hhcmVGb3JtLk1lc3NhZ2UuUkVRVUlSRUQpO1xuICAgICQoaW5wdXQpLm9uZSgna2V5dXAnLCBmdW5jdGlvbigpe1xuICAgICAgdGhpcy5fdmFsaWRhdGUoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBieSBhcHBlbmRpbmcgYSBkaXYgdG8gdGhlIGZvcm0uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgLSBFcnJvciBtZXNzYWdlIHRvIGRpc3BsYXkuXG4gICAqIEByZXR1cm4ge3RoaXN9IFNoYXJlRm9ybSAtIHNoYXJlZm9ybVxuICAgKi9cbiAgX3Nob3dFcnJvcihtc2cpIHtcbiAgICBsZXQgJGVsUGFyZW50cyA9ICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJyk7XG4gICAgJCgnI3Ntcy1mb3JtLW1zZycpLmFkZENsYXNzKFNoYXJlRm9ybS5Dc3NDbGFzcy5FUlJPUikudGV4dChVdGlsaXR5LmxvY2FsaXplKG1zZykpO1xuICAgICRlbFBhcmVudHMucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MtanMnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgXCJzdWNjZXNzXCIgY2xhc3MuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgLSBFcnJvciBtZXNzYWdlIHRvIGRpc3BsYXkuXG4gICAqIEByZXR1cm4ge3RoaXN9IFNoYXJlRm9ybVxuICAgKi9cbiAgX3Nob3dTdWNjZXNzKG1zZykge1xuICAgIGxldCAkZWxQYXJlbnRzID0gJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKTtcbiAgICAkKCcjcGhvbmUnKS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgVXRpbGl0eS5sb2NhbGl6ZShtc2cpKTtcbiAgICAkKCcjc21zYnV0dG9uJykudGV4dChcIlNlbmQgQW5vdGhlclwiKTtcbiAgICAkKCcjc21zLWZvcm0tbXNnJykuYWRkQ2xhc3MoU2hhcmVGb3JtLkNzc0NsYXNzLlNVQ0NFU1MpLnRleHQoJycpO1xuICAgICRlbFBhcmVudHMucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MtanMnKTtcbiAgICAkZWxQYXJlbnRzLmFkZENsYXNzKCdzdWNjZXNzLWpzJyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU3VibWl0cyB0aGUgZm9ybS5cbiAgICogQHJldHVybiB7anFYSFJ9IGRlZmVycmVkIHJlc3BvbnNlIG9iamVjdFxuICAgKi9cbiAgX3N1Ym1pdCgpIHtcbiAgICB0aGlzLl9pc0J1c3kgPSB0cnVlO1xuICAgIGxldCAkc3Bpbm5lciA9IHRoaXMuX2VsLnF1ZXJ5U2VsZWN0b3IoYC4ke1NoYXJlRm9ybS5Dc3NDbGFzcy5TUElOTkVSfWApO1xuICAgIGxldCAkc3VibWl0ID0gdGhpcy5fZWwucXVlcnlTZWxlY3RvcignYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0nKTtcbiAgICBjb25zdCBwYXlsb2FkID0gJCh0aGlzLl9lbCkuc2VyaWFsaXplKCk7XG4gICAgJCh0aGlzLl9lbCkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIGlmICgkc3Bpbm5lcikge1xuICAgICAgJHN1Ym1pdC5kaXNhYmxlZCA9IHRydWU7IC8vIGhpZGUgc3VibWl0IGJ1dHRvblxuICAgICAgJHNwaW5uZXIuc3R5bGUuY3NzVGV4dCA9ICcnOyAvLyBzaG93IHNwaW5uZXJcbiAgICB9XG4gICAgcmV0dXJuICQucG9zdCgkKHRoaXMuX2VsKS5hdHRyKCdhY3Rpb24nKSwgcGF5bG9hZCkuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICB0aGlzLl9lbC5yZXNldCgpO1xuICAgICAgICB0aGlzLl9zaG93U3VjY2VzcyhTaGFyZUZvcm0uTWVzc2FnZS5TVUNDRVNTKTtcbiAgICAgICAgdGhpcy5faXNEaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICQodGhpcy5fZWwpLm9uZSgna2V5dXAnLCAnaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgICAgJCh0aGlzLl9lbCkucmVtb3ZlQ2xhc3MoU2hhcmVGb3JtLkNzc0NsYXNzLlNVQ0NFU1MpO1xuICAgICAgICAgIHRoaXMuX2lzRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zaG93RXJyb3IoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UubWVzc2FnZSkpO1xuICAgICAgfVxuICAgIH0pLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9zaG93RXJyb3IoU2hhcmVGb3JtLk1lc3NhZ2UuU0VSVkVSKTtcbiAgICB9KS5hbHdheXMoKCkgPT4ge1xuICAgICAgJCh0aGlzLl9lbCkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgIGlmICgkc3Bpbm5lcikge1xuICAgICAgICAkc3VibWl0LmRpc2FibGVkID0gZmFsc2U7IC8vIHNob3cgc3VibWl0IGJ1dHRvblxuICAgICAgICAkc3Bpbm5lci5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnOyAvLyBoaWRlIHNwaW5uZXI7XG4gICAgICB9XG4gICAgICB0aGlzLl9pc0J1c3kgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3luY2hyb25vdXNseSBsb2FkcyB0aGUgR29vZ2xlIHJlY2FwdGNoYSBzY3JpcHQgYW5kIHNldHMgY2FsbGJhY2tzIGZvclxuICAgKiBsb2FkLCBzdWNjZXNzLCBhbmQgZXhwaXJhdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybiB7dGhpc30gU2NyZWVuZXJcbiAgICovXG4gIF9pbml0UmVjYXB0Y2hhKCkge1xuICAgIGNvbnN0ICRzY3JpcHQgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpKTtcbiAgICAkc2NyaXB0LmF0dHIoJ3NyYycsXG4gICAgICAgICdodHRwczovL3d3dy5nb29nbGUuY29tL3JlY2FwdGNoYS9hcGkuanMnICtcbiAgICAgICAgJz9vbmxvYWQ9c2NyZWVuZXJDYWxsYmFjayZyZW5kZXI9ZXhwbGljaXQnKS5wcm9wKHtcbiAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgZGVmZXI6IHRydWVcbiAgICB9KTtcblxuICAgIHdpbmRvdy5zY3JlZW5lckNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgd2luZG93LmdyZWNhcHRjaGEucmVuZGVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JlZW5lci1yZWNhcHRjaGEnKSwge1xuICAgICAgICAnc2l0ZWtleScgOiAnNkxla0lDWVVBQUFBQU9SMnVaMGFqeVd0OVh4RHVzcEhQVUFrUnpBQicsXG4gICAgICAgIC8vQmVsb3cgaXMgdGhlIGxvY2FsIGhvc3Qga2V5XG4gICAgICAgIC8vICdzaXRla2V5JyA6ICc2TGNBQUNZVUFBQUFBUG10dlF2QndLODlpbU0zUWZvdEpGSGZTbThDJyxcbiAgICAgICAgJ2NhbGxiYWNrJzogJ3NjcmVlbmVyUmVjYXB0Y2hhJyxcbiAgICAgICAgJ2V4cGlyZWQtY2FsbGJhY2snOiAnc2NyZWVuZXJSZWNhcHRjaGFSZXNldCdcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVjYXB0Y2hhUmVxdWlyZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICB3aW5kb3cuc2NyZWVuZXJSZWNhcHRjaGEgPSAoKSA9PiB7XG4gICAgICB0aGlzLl9yZWNhcHRjaGFWZXJpZmllZCA9IHRydWU7XG4gICAgICAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpLnJlbW92ZUNsYXNzKCdyZWNhcHRjaGEtanMnKTtcbiAgICB9O1xuXG4gICAgd2luZG93LnNjcmVlbmVyUmVjYXB0Y2hhUmVzZXQgPSAoKSA9PiB7XG4gICAgICB0aGlzLl9yZWNhcHRjaGFWZXJpZmllZCA9IGZhbHNlO1xuICAgICAgJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKS5hZGRDbGFzcygncmVjYXB0Y2hhLWpzJyk7XG4gICAgfTtcblxuICAgIHRoaXMuX3JlY2FwdGNoYVJlcXVpcmVkID0gdHJ1ZTtcbiAgICAkKCdoZWFkJykuYXBwZW5kKCRzY3JpcHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbi8qKlxuICogQ1NTIGNsYXNzZXMgdXNlZCBieSB0aGlzIGNvbXBvbmVudC5cbiAqIEBlbnVtIHtzdHJpbmd9XG4gKi9cblNoYXJlRm9ybS5Dc3NDbGFzcyA9IHtcbiAgRVJST1I6ICdlcnJvcicsXG4gIEVSUk9SX01TRzogJ2Vycm9yLW1lc3NhZ2UnLFxuICBGT1JNOiAnanMtc2hhcmUtZm9ybScsXG4gIFNIT1dfRElTQ0xBSU1FUjogJ2pzLXNob3ctZGlzY2xhaW1lcicsXG4gIE5FRURTX0RJU0NMQUlNRVI6ICdqcy1uZWVkcy1kaXNjbGFpbWVyJyxcbiAgQU5JTUFURV9ESVNDTEFJTUVSOiAnYW5pbWF0ZWQgZmFkZUluVXAnLFxuICBISURERU46ICdoaWRkZW4nLFxuICBTVUJNSVRfQlROOiAnYnRuLXN1Ym1pdCcsXG4gIFNVQ0NFU1M6ICdzdWNjZXNzJyxcbiAgU1BJTk5FUjogJ2pzLXNwaW5uZXInXG59O1xuXG4vKipcbiAqIExvY2FsaXphdGlvbiBsYWJlbHMgb2YgZm9ybSBtZXNzYWdlcy5cbiAqIEBlbnVtIHtzdHJpbmd9XG4gKi9cblNoYXJlRm9ybS5NZXNzYWdlID0ge1xuICBFTUFJTDogJ0VSUk9SX0VNQUlMJyxcbiAgUEhPTkU6ICdJbnZhbGlkIE1vYmlsZSBOdW1iZXInLFxuICBSRVFVSVJFRDogJ0VSUk9SX1JFUVVJUkVEJyxcbiAgU0VSVkVSOiAnRVJST1JfU0VSVkVSJyxcbiAgU1VDQ0VTUzogJ01lc3NhZ2Ugc2VudCEnLFxuICBSRUNBUFRDSEEgOiAnUGxlYXNlIGZpbGwgdGhlIHJlQ0FQVENIQSdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlRm9ybTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3NoYXJlLWZvcm0uanMiLCIvKiFcbiAqIEphdmFTY3JpcHQgQ29va2llIHYyLjIuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL2pzLWNvb2tpZS9qcy1jb29raWVcbiAqXG4gKiBDb3B5cmlnaHQgMjAwNiwgMjAxNSBLbGF1cyBIYXJ0bCAmIEZhZ25lciBCcmFja1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cbjsoZnVuY3Rpb24gKGZhY3RvcnkpIHtcblx0dmFyIHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IGZhbHNlO1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKCFyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIpIHtcblx0XHR2YXIgT2xkQ29va2llcyA9IHdpbmRvdy5Db29raWVzO1xuXHRcdHZhciBhcGkgPSB3aW5kb3cuQ29va2llcyA9IGZhY3RvcnkoKTtcblx0XHRhcGkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHdpbmRvdy5Db29raWVzID0gT2xkQ29va2llcztcblx0XHRcdHJldHVybiBhcGk7XG5cdFx0fTtcblx0fVxufShmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIGV4dGVuZCAoKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHNbIGkgXTtcblx0XHRcdGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdHJlc3VsdFtrZXldID0gYXR0cmlidXRlc1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCAoY29udmVydGVyKSB7XG5cdFx0ZnVuY3Rpb24gYXBpIChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHR2YXIgcmVzdWx0O1xuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXcml0ZVxuXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0YXR0cmlidXRlcyA9IGV4dGVuZCh7XG5cdFx0XHRcdFx0cGF0aDogJy8nXG5cdFx0XHRcdH0sIGFwaS5kZWZhdWx0cywgYXR0cmlidXRlcyk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBhdHRyaWJ1dGVzLmV4cGlyZXMgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0dmFyIGV4cGlyZXMgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRcdGV4cGlyZXMuc2V0TWlsbGlzZWNvbmRzKGV4cGlyZXMuZ2V0TWlsbGlzZWNvbmRzKCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlKzUpO1xuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGV4cGlyZXM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBXZSdyZSB1c2luZyBcImV4cGlyZXNcIiBiZWNhdXNlIFwibWF4LWFnZVwiIGlzIG5vdCBzdXBwb3J0ZWQgYnkgSUVcblx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzID8gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcblx0XHRcdFx0XHRpZiAoL15bXFx7XFxbXS8udGVzdChyZXN1bHQpKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHJlc3VsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cblx0XHRcdFx0aWYgKCFjb252ZXJ0ZXIud3JpdGUpIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcodmFsdWUpKVxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8M0F8M0N8M0V8M0R8MkZ8M0Z8NDB8NUJ8NUR8NUV8NjB8N0J8N0R8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGtleSkpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1tcXChcXCldL2csIGVzY2FwZSk7XG5cblx0XHRcdFx0dmFyIHN0cmluZ2lmaWVkQXR0cmlidXRlcyA9ICcnO1xuXG5cdFx0XHRcdGZvciAodmFyIGF0dHJpYnV0ZU5hbWUgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRcdGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcblx0XHRcdFx0XHRpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0ga2V5ICsgJz0nICsgdmFsdWUgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZWFkXG5cblx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdHJlc3VsdCA9IHt9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XG5cdFx0XHQvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC4gQWxzbyBwcmV2ZW50cyBvZGQgcmVzdWx0IHdoZW5cblx0XHRcdC8vIGNhbGxpbmcgXCJnZXQoKVwiXG5cdFx0XHR2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuXHRcdFx0dmFyIHJkZWNvZGUgPSAvKCVbMC05QS1aXXsyfSkrL2c7XG5cdFx0XHR2YXIgaSA9IDA7XG5cblx0XHRcdGZvciAoOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XG5cdFx0XHRcdHZhciBjb29raWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XG5cblx0XHRcdFx0aWYgKCF0aGlzLmpzb24gJiYgY29va2llLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvb2tpZS5zbGljZSgxLCAtMSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciBuYW1lID0gcGFydHNbMF0ucmVwbGFjZShyZGVjb2RlLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvbnZlcnRlci5yZWFkID9cblx0XHRcdFx0XHRcdGNvbnZlcnRlci5yZWFkKGNvb2tpZSwgbmFtZSkgOiBjb252ZXJ0ZXIoY29va2llLCBuYW1lKSB8fFxuXHRcdFx0XHRcdFx0Y29va2llLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLmpzb24pIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGNvb2tpZSA9IEpTT04ucGFyc2UoY29va2llKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gbmFtZSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0ID0gY29va2llO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCFrZXkpIHtcblx0XHRcdFx0XHRcdHJlc3VsdFtuYW1lXSA9IGNvb2tpZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0YXBpLnNldCA9IGFwaTtcblx0XHRhcGkuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuIGFwaS5jYWxsKGFwaSwga2V5KTtcblx0XHR9O1xuXHRcdGFwaS5nZXRKU09OID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGFwaS5hcHBseSh7XG5cdFx0XHRcdGpzb246IHRydWVcblx0XHRcdH0sIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG5cdFx0fTtcblx0XHRhcGkuZGVmYXVsdHMgPSB7fTtcblxuXHRcdGFwaS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRhcGkoa2V5LCAnJywgZXh0ZW5kKGF0dHJpYnV0ZXMsIHtcblx0XHRcdFx0ZXhwaXJlczogLTFcblx0XHRcdH0pKTtcblx0XHR9O1xuXG5cdFx0YXBpLndpdGhDb252ZXJ0ZXIgPSBpbml0O1xuXG5cdFx0cmV0dXJuIGFwaTtcblx0fVxuXG5cdHJldHVybiBpbml0KGZ1bmN0aW9uICgpIHt9KTtcbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2pzLWNvb2tpZS9zcmMvanMuY29va2llLmpzXG4vLyBtb2R1bGUgaWQgPSA2OVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiB1dGlsaXR5IGZ1bmN0aW9ucy5cbiAqL1xuY29uc3QgVXRpbGl0eSA9IHt9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGEgZ2l2ZW4ga2V5IGluIGEgVVJMIHF1ZXJ5IHN0cmluZy4gSWYgbm8gVVJMIHF1ZXJ5XG4gKiBzdHJpbmcgaXMgcHJvdmlkZWQsIHRoZSBjdXJyZW50IFVSTCBsb2NhdGlvbiBpcyB1c2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBLZXkgbmFtZS5cbiAqIEBwYXJhbSB7P3N0cmluZ30gcXVlcnlTdHJpbmcgLSBPcHRpb25hbCBxdWVyeSBzdHJpbmcgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHs/c3RyaW5nfSBRdWVyeSBwYXJhbWV0ZXIgdmFsdWUuXG4gKi9cblV0aWxpdHkuZ2V0VXJsUGFyYW1ldGVyID0gKG5hbWUsIHF1ZXJ5U3RyaW5nKSA9PiB7XG4gIGNvbnN0IHF1ZXJ5ID0gcXVlcnlTdHJpbmcgfHwgd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcbiAgY29uc3QgcGFyYW0gPSBuYW1lLnJlcGxhY2UoL1tcXFtdLywgJ1xcXFxbJykucmVwbGFjZSgvW1xcXV0vLCAnXFxcXF0nKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKCdbXFxcXD8mXScgKyBwYXJhbSArICc9KFteJiNdKiknKTtcbiAgY29uc3QgcmVzdWx0cyA9IHJlZ2V4LmV4ZWMocXVlcnkpO1xuICByZXR1cm4gcmVzdWx0cyA9PT0gbnVsbCA/ICcnIDpcbiAgICAgIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzFdLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbn07XG5cbi8qKlxuICogVGFrZXMgYW4gb2JqZWN0IGFuZCBkZWVwbHkgdHJhdmVyc2VzIGl0LCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgdmFsdWVzIGZvclxuICogbWF0Y2hlZCBwcm9wZXJ0aWVzIGlkZW50aWZpZWQgYnkgdGhlIGtleSBzdHJpbmcuXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IHRvIHRyYXZlcnNlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldFByb3AgbmFtZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybiB7YXJyYXl9IHByb3BlcnR5IHZhbHVlcy5cbiAqL1xuVXRpbGl0eS5maW5kVmFsdWVzID0gKG9iamVjdCwgdGFyZ2V0UHJvcCkgPT4ge1xuICBjb25zdCByZXN1bHRzID0gW107XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZSBmdW5jdGlvbiBmb3IgaXRlcmF0aW5nIG92ZXIgb2JqZWN0IGtleXMuXG4gICAqL1xuICAoZnVuY3Rpb24gdHJhdmVyc2VPYmplY3Qob2JqKSB7XG4gICAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGlmIChrZXkgPT09IHRhcmdldFByb3ApIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gob2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Yob2JqW2tleV0pID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHRyYXZlcnNlT2JqZWN0KG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSkob2JqZWN0KTtcblxuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbi8qKlxuICogVGFrZXMgYSBzdHJpbmcgb3IgbnVtYmVyIHZhbHVlIGFuZCBjb252ZXJ0cyBpdCB0byBhIGRvbGxhciBhbW91bnRcbiAqIGFzIGEgc3RyaW5nIHdpdGggdHdvIGRlY2ltYWwgcG9pbnRzIG9mIHBlcmNpc2lvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gdmFsIC0gdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm4ge3N0cmluZ30gc3RyaW5naWZpZWQgbnVtYmVyIHRvIHR3byBkZWNpbWFsIHBsYWNlcy5cbiAqL1xuVXRpbGl0eS50b0RvbGxhckFtb3VudCA9ICh2YWwpID0+XG4gICAgKE1hdGguYWJzKE1hdGgucm91bmQocGFyc2VGbG9hdCh2YWwpICogMTAwKSAvIDEwMCkpLnRvRml4ZWQoMik7XG5cbi8qKlxuICogRm9yIHRyYW5zbGF0aW5nIHN0cmluZ3MsIHRoZXJlIGlzIGEgZ2xvYmFsIExPQ0FMSVpFRF9TVFJJTkdTIGFycmF5IHRoYXRcbiAqIGlzIGRlZmluZWQgb24gdGhlIEhUTUwgdGVtcGxhdGUgbGV2ZWwgc28gdGhhdCB0aG9zZSBzdHJpbmdzIGFyZSBleHBvc2VkIHRvXG4gKiBXUE1MIHRyYW5zbGF0aW9uLiBUaGUgTE9DQUxJWkVEX1NUUklOR1MgYXJyYXkgaXMgY29tb3NlZCBvZiBvYmplY3RzIHdpdGggYVxuICogYHNsdWdgIGtleSB3aG9zZSB2YWx1ZSBpcyBzb21lIGNvbnN0YW50LCBhbmQgYSBgbGFiZWxgIHZhbHVlIHdoaWNoIGlzIHRoZVxuICogdHJhbnNsYXRlZCBlcXVpdmFsZW50LiBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgc2x1ZyBuYW1lIGFuZCByZXR1cm5zIHRoZVxuICogbGFiZWwuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2x1Z05hbWVcbiAqIEByZXR1cm4ge3N0cmluZ30gbG9jYWxpemVkIHZhbHVlXG4gKi9cblV0aWxpdHkubG9jYWxpemUgPSBmdW5jdGlvbihzbHVnTmFtZSkge1xuICBsZXQgdGV4dCA9IHNsdWdOYW1lIHx8ICcnO1xuICBjb25zdCBsb2NhbGl6ZWRTdHJpbmdzID0gd2luZG93LkxPQ0FMSVpFRF9TVFJJTkdTIHx8IFtdO1xuICBjb25zdCBtYXRjaCA9IF8uZmluZFdoZXJlKGxvY2FsaXplZFN0cmluZ3MsIHtcbiAgICBzbHVnOiBzbHVnTmFtZVxuICB9KTtcbiAgaWYgKG1hdGNoKSB7XG4gICAgdGV4dCA9IG1hdGNoLmxhYmVsO1xuICB9XG4gIHJldHVybiB0ZXh0O1xufTtcblxuLyoqXG4gKiBUYWtlcyBhIGEgc3RyaW5nIGFuZCByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBzdHJpbmcgaXMgYSB2YWxpZCBlbWFpbFxuICogYnkgdXNpbmcgbmF0aXZlIGJyb3dzZXIgdmFsaWRhdGlvbiBpZiBhdmFpbGFibGUuIE90aGVyd2lzZSwgZG9lcyBhIHNpbXBsZVxuICogUmVnZXggdGVzdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBlbWFpbFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuVXRpbGl0eS5pc1ZhbGlkRW1haWwgPSBmdW5jdGlvbihlbWFpbCkge1xuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGlucHV0LnR5cGUgPSAnZW1haWwnO1xuICBpbnB1dC52YWx1ZSA9IGVtYWlsO1xuXG4gIHJldHVybiB0eXBlb2YgaW5wdXQuY2hlY2tWYWxpZGl0eSA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICBpbnB1dC5jaGVja1ZhbGlkaXR5KCkgOiAvXFxTK0BcXFMrXFwuXFxTKy8udGVzdChlbWFpbCk7XG59O1xuXG4vKipcbiAqIFNpdGUgY29uc3RhbnRzLlxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuVXRpbGl0eS5DT05GSUcgPSB7XG4gIERFRkFVTFRfTEFUOiA0MC43MTI4LFxuICBERUZBVUxUX0xORzogLTc0LjAwNTksXG4gIEdPT0dMRV9BUEk6ICdBSXphU3lCU2pjX0pOX3AwLV9WS3lCdmpDRnFWQW1BSVd0N0NsWmMnLFxuICBHT09HTEVfU1RBVElDX0FQSTogJ0FJemFTeUN0MEU3RFhfWVBGY1VubE1QNldIdjJ6cUF3eVpFNHFJdycsXG4gIEdSRUNBUFRDSEFfU0lURV9LRVk6ICc2TGV5bkJVVUFBQUFBTndza1RXMlVJY2VrdFJpYXlTcUxGRnd3azQ4JyxcbiAgU0NSRUVORVJfTUFYX0hPVVNFSE9MRDogOCxcbiAgVVJMX1BJTl9CTFVFOiAnL3dwLWNvbnRlbnQvdGhlbWVzL2FjY2Vzcy9hc3NldHMvaW1nL21hcC1waW4tYmx1ZS5wbmcnLFxuICBVUkxfUElOX0JMVUVfMlg6ICcvd3AtY29udGVudC90aGVtZXMvYWNjZXNzL2Fzc2V0cy9pbWcvbWFwLXBpbi1ibHVlLTJ4LnBuZycsXG4gIFVSTF9QSU5fR1JFRU46ICcvd3AtY29udGVudC90aGVtZXMvYWNjZXNzL2Fzc2V0cy9pbWcvbWFwLXBpbi1ncmVlbi5wbmcnLFxuICBVUkxfUElOX0dSRUVOXzJYOiAnL3dwLWNvbnRlbnQvdGhlbWVzL2FjY2Vzcy9hc3NldHMvaW1nL21hcC1waW4tZ3JlZW4tMngucG5nJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVXRpbGl0eTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy92ZW5kb3IvdXRpbGl0eS5qcyIsIi8qIVxuICogY2xlYXZlLmpzIC0gMC43LjIzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbm9zaXIvY2xlYXZlLmpzXG4gKiBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMFxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMi0yMDE3IE1heCBIdWFuZyBodHRwczovL2dpdGh1Yi5jb20vbm9zaXIvXG4gKi9cbiFmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtdLHQpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMuQ2xlYXZlPXQoKTplLkNsZWF2ZT10KCl9KHRoaXMsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdChuKXtpZihyW25dKXJldHVybiByW25dLmV4cG9ydHM7dmFyIGk9cltuXT17ZXhwb3J0czp7fSxpZDpuLGxvYWRlZDohMX07cmV0dXJuIGVbbl0uY2FsbChpLmV4cG9ydHMsaSxpLmV4cG9ydHMsdCksaS5sb2FkZWQ9ITAsaS5leHBvcnRzfXZhciByPXt9O3JldHVybiB0Lm09ZSx0LmM9cix0LnA9XCJcIix0KDApfShbZnVuY3Rpb24oZSx0LHIpeyhmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgbj1mdW5jdGlvbihlLHQpe3ZhciByPXRoaXM7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGU/ci5lbGVtZW50PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZSk6ci5lbGVtZW50PVwidW5kZWZpbmVkXCIhPXR5cGVvZiBlLmxlbmd0aCYmZS5sZW5ndGg+MD9lWzBdOmUsIXIuZWxlbWVudCl0aHJvdyBuZXcgRXJyb3IoXCJbY2xlYXZlLmpzXSBQbGVhc2UgY2hlY2sgdGhlIGVsZW1lbnRcIik7dC5pbml0VmFsdWU9ci5lbGVtZW50LnZhbHVlLHIucHJvcGVydGllcz1uLkRlZmF1bHRQcm9wZXJ0aWVzLmFzc2lnbih7fSx0KSxyLmluaXQoKX07bi5wcm90b3R5cGU9e2luaXQ6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9ZS5wcm9wZXJ0aWVzOyh0Lm51bWVyYWx8fHQucGhvbmV8fHQuY3JlZGl0Q2FyZHx8dC5kYXRlfHwwIT09dC5ibG9ja3NMZW5ndGh8fHQucHJlZml4KSYmKHQubWF4TGVuZ3RoPW4uVXRpbC5nZXRNYXhMZW5ndGgodC5ibG9ja3MpLGUuaXNBbmRyb2lkPW4uVXRpbC5pc0FuZHJvaWQoKSxlLmxhc3RJbnB1dFZhbHVlPVwiXCIsZS5vbkNoYW5nZUxpc3RlbmVyPWUub25DaGFuZ2UuYmluZChlKSxlLm9uS2V5RG93bkxpc3RlbmVyPWUub25LZXlEb3duLmJpbmQoZSksZS5vbkN1dExpc3RlbmVyPWUub25DdXQuYmluZChlKSxlLm9uQ29weUxpc3RlbmVyPWUub25Db3B5LmJpbmQoZSksZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGUub25DaGFuZ2VMaXN0ZW5lciksZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsZS5vbktleURvd25MaXN0ZW5lciksZS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjdXRcIixlLm9uQ3V0TGlzdGVuZXIpLGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29weVwiLGUub25Db3B5TGlzdGVuZXIpLGUuaW5pdFBob25lRm9ybWF0dGVyKCksZS5pbml0RGF0ZUZvcm1hdHRlcigpLGUuaW5pdE51bWVyYWxGb3JtYXR0ZXIoKSxlLm9uSW5wdXQodC5pbml0VmFsdWUpKX0saW5pdE51bWVyYWxGb3JtYXR0ZXI6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9ZS5wcm9wZXJ0aWVzO3QubnVtZXJhbCYmKHQubnVtZXJhbEZvcm1hdHRlcj1uZXcgbi5OdW1lcmFsRm9ybWF0dGVyKHQubnVtZXJhbERlY2ltYWxNYXJrLHQubnVtZXJhbEludGVnZXJTY2FsZSx0Lm51bWVyYWxEZWNpbWFsU2NhbGUsdC5udW1lcmFsVGhvdXNhbmRzR3JvdXBTdHlsZSx0Lm51bWVyYWxQb3NpdGl2ZU9ubHksdC5kZWxpbWl0ZXIpKX0saW5pdERhdGVGb3JtYXR0ZXI6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9ZS5wcm9wZXJ0aWVzO3QuZGF0ZSYmKHQuZGF0ZUZvcm1hdHRlcj1uZXcgbi5EYXRlRm9ybWF0dGVyKHQuZGF0ZVBhdHRlcm4pLHQuYmxvY2tzPXQuZGF0ZUZvcm1hdHRlci5nZXRCbG9ja3MoKSx0LmJsb2Nrc0xlbmd0aD10LmJsb2Nrcy5sZW5ndGgsdC5tYXhMZW5ndGg9bi5VdGlsLmdldE1heExlbmd0aCh0LmJsb2NrcykpfSxpbml0UGhvbmVGb3JtYXR0ZXI6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9ZS5wcm9wZXJ0aWVzO2lmKHQucGhvbmUpdHJ5e3QucGhvbmVGb3JtYXR0ZXI9bmV3IG4uUGhvbmVGb3JtYXR0ZXIobmV3IHQucm9vdC5DbGVhdmUuQXNZb3VUeXBlRm9ybWF0dGVyKHQucGhvbmVSZWdpb25Db2RlKSx0LmRlbGltaXRlcil9Y2F0Y2gocil7dGhyb3cgbmV3IEVycm9yKFwiW2NsZWF2ZS5qc10gUGxlYXNlIGluY2x1ZGUgcGhvbmUtdHlwZS1mb3JtYXR0ZXIue2NvdW50cnl9LmpzIGxpYlwiKX19LG9uS2V5RG93bjpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzLGk9ZS53aGljaHx8ZS5rZXlDb2RlLGE9bi5VdGlsLG89dC5lbGVtZW50LnZhbHVlO3JldHVybiBhLmlzQW5kcm9pZEJhY2tzcGFjZUtleWRvd24odC5sYXN0SW5wdXRWYWx1ZSxvKSYmKGk9OCksdC5sYXN0SW5wdXRWYWx1ZT1vLDg9PT1pJiZhLmlzRGVsaW1pdGVyKG8uc2xpY2UoLXIuZGVsaW1pdGVyTGVuZ3RoKSxyLmRlbGltaXRlcixyLmRlbGltaXRlcnMpP3ZvaWQoci5iYWNrc3BhY2U9ITApOnZvaWQoci5iYWNrc3BhY2U9ITEpfSxvbkNoYW5nZTpmdW5jdGlvbigpe3RoaXMub25JbnB1dCh0aGlzLmVsZW1lbnQudmFsdWUpfSxvbkN1dDpmdW5jdGlvbihlKXt0aGlzLmNvcHlDbGlwYm9hcmREYXRhKGUpLHRoaXMub25JbnB1dChcIlwiKX0sb25Db3B5OmZ1bmN0aW9uKGUpe3RoaXMuY29weUNsaXBib2FyZERhdGEoZSl9LGNvcHlDbGlwYm9hcmREYXRhOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMscj10LnByb3BlcnRpZXMsaT1uLlV0aWwsYT10LmVsZW1lbnQudmFsdWUsbz1cIlwiO289ci5jb3B5RGVsaW1pdGVyP2E6aS5zdHJpcERlbGltaXRlcnMoYSxyLmRlbGltaXRlcixyLmRlbGltaXRlcnMpO3RyeXtlLmNsaXBib2FyZERhdGE/ZS5jbGlwYm9hcmREYXRhLnNldERhdGEoXCJUZXh0XCIsbyk6d2luZG93LmNsaXBib2FyZERhdGEuc2V0RGF0YShcIlRleHRcIixvKSxlLnByZXZlbnREZWZhdWx0KCl9Y2F0Y2gobCl7fX0sb25JbnB1dDpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzLGk9ZSxhPW4uVXRpbDtyZXR1cm4gci5udW1lcmFsfHwhci5iYWNrc3BhY2V8fGEuaXNEZWxpbWl0ZXIoZS5zbGljZSgtci5kZWxpbWl0ZXJMZW5ndGgpLHIuZGVsaW1pdGVyLHIuZGVsaW1pdGVycyl8fChlPWEuaGVhZFN0cihlLGUubGVuZ3RoLXIuZGVsaW1pdGVyTGVuZ3RoKSksci5waG9uZT8oci5yZXN1bHQ9ci5waG9uZUZvcm1hdHRlci5mb3JtYXQoZSksdm9pZCB0LnVwZGF0ZVZhbHVlU3RhdGUoKSk6ci5udW1lcmFsPyhyLnJlc3VsdD1yLnByZWZpeCtyLm51bWVyYWxGb3JtYXR0ZXIuZm9ybWF0KGUpLHZvaWQgdC51cGRhdGVWYWx1ZVN0YXRlKCkpOihyLmRhdGUmJihlPXIuZGF0ZUZvcm1hdHRlci5nZXRWYWxpZGF0ZWREYXRlKGUpKSxlPWEuc3RyaXBEZWxpbWl0ZXJzKGUsci5kZWxpbWl0ZXIsci5kZWxpbWl0ZXJzKSxlPWEuZ2V0UHJlZml4U3RyaXBwZWRWYWx1ZShlLHIucHJlZml4LHIucHJlZml4TGVuZ3RoKSxlPXIubnVtZXJpY09ubHk/YS5zdHJpcChlLC9bXlxcZF0vZyk6ZSxlPXIudXBwZXJjYXNlP2UudG9VcHBlckNhc2UoKTplLGU9ci5sb3dlcmNhc2U/ZS50b0xvd2VyQ2FzZSgpOmUsci5wcmVmaXgmJihlPXIucHJlZml4K2UsMD09PXIuYmxvY2tzTGVuZ3RoKT8oci5yZXN1bHQ9ZSx2b2lkIHQudXBkYXRlVmFsdWVTdGF0ZSgpKTooci5jcmVkaXRDYXJkJiZ0LnVwZGF0ZUNyZWRpdENhcmRQcm9wc0J5VmFsdWUoZSksZT1hLmhlYWRTdHIoZSxyLm1heExlbmd0aCksci5yZXN1bHQ9YS5nZXRGb3JtYXR0ZWRWYWx1ZShlLHIuYmxvY2tzLHIuYmxvY2tzTGVuZ3RoLHIuZGVsaW1pdGVyLHIuZGVsaW1pdGVycyksdm9pZChpPT09ci5yZXN1bHQmJmkhPT1yLnByZWZpeHx8dC51cGRhdGVWYWx1ZVN0YXRlKCkpKSl9LHVwZGF0ZUNyZWRpdENhcmRQcm9wc0J5VmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQscj10aGlzLGk9ci5wcm9wZXJ0aWVzLGE9bi5VdGlsO2EuaGVhZFN0cihpLnJlc3VsdCw0KSE9PWEuaGVhZFN0cihlLDQpJiYodD1uLkNyZWRpdENhcmREZXRlY3Rvci5nZXRJbmZvKGUsaS5jcmVkaXRDYXJkU3RyaWN0TW9kZSksaS5ibG9ja3M9dC5ibG9ja3MsaS5ibG9ja3NMZW5ndGg9aS5ibG9ja3MubGVuZ3RoLGkubWF4TGVuZ3RoPWEuZ2V0TWF4TGVuZ3RoKGkuYmxvY2tzKSxpLmNyZWRpdENhcmRUeXBlIT09dC50eXBlJiYoaS5jcmVkaXRDYXJkVHlwZT10LnR5cGUsaS5vbkNyZWRpdENhcmRUeXBlQ2hhbmdlZC5jYWxsKHIsaS5jcmVkaXRDYXJkVHlwZSkpKX0sdXBkYXRlVmFsdWVTdGF0ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXM7cmV0dXJuIGUuaXNBbmRyb2lkP3ZvaWQgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtlLmVsZW1lbnQudmFsdWU9ZS5wcm9wZXJ0aWVzLnJlc3VsdH0sMSk6dm9pZChlLmVsZW1lbnQudmFsdWU9ZS5wcm9wZXJ0aWVzLnJlc3VsdCl9LHNldFBob25lUmVnaW9uQ29kZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzO3IucGhvbmVSZWdpb25Db2RlPWUsdC5pbml0UGhvbmVGb3JtYXR0ZXIoKSx0Lm9uQ2hhbmdlKCl9LHNldFJhd1ZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMscj10LnByb3BlcnRpZXM7ZT12b2lkIDAhPT1lJiZudWxsIT09ZT9lLnRvU3RyaW5nKCk6XCJcIixyLm51bWVyYWwmJihlPWUucmVwbGFjZShcIi5cIixyLm51bWVyYWxEZWNpbWFsTWFyaykpLHQuZWxlbWVudC52YWx1ZT1lLHQub25JbnB1dChlKX0sZ2V0UmF3VmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLHQ9ZS5wcm9wZXJ0aWVzLHI9bi5VdGlsLGk9ZS5lbGVtZW50LnZhbHVlO3JldHVybiB0LnJhd1ZhbHVlVHJpbVByZWZpeCYmKGk9ci5nZXRQcmVmaXhTdHJpcHBlZFZhbHVlKGksdC5wcmVmaXgsdC5wcmVmaXhMZW5ndGgpKSxpPXQubnVtZXJhbD90Lm51bWVyYWxGb3JtYXR0ZXIuZ2V0UmF3VmFsdWUoaSk6ci5zdHJpcERlbGltaXRlcnMoaSx0LmRlbGltaXRlcix0LmRlbGltaXRlcnMpfSxnZXRGb3JtYXR0ZWRWYWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmVsZW1lbnQudmFsdWV9LGRlc3Ryb3k6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2UuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiaW5wdXRcIixlLm9uQ2hhbmdlTGlzdGVuZXIpLGUuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLGUub25LZXlEb3duTGlzdGVuZXIpLGUuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY3V0XCIsZS5vbkN1dExpc3RlbmVyKSxlLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvcHlcIixlLm9uQ29weUxpc3RlbmVyKX0sdG9TdHJpbmc6ZnVuY3Rpb24oKXtyZXR1cm5cIltDbGVhdmUgT2JqZWN0XVwifX0sbi5OdW1lcmFsRm9ybWF0dGVyPXIoMSksbi5EYXRlRm9ybWF0dGVyPXIoMiksbi5QaG9uZUZvcm1hdHRlcj1yKDMpLG4uQ3JlZGl0Q2FyZERldGVjdG9yPXIoNCksbi5VdGlsPXIoNSksbi5EZWZhdWx0UHJvcGVydGllcz1yKDYpLChcIm9iamVjdFwiPT10eXBlb2YgdCYmdD90OndpbmRvdykuQ2xlYXZlPW4sZS5leHBvcnRzPW59KS5jYWxsKHQsZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30oKSl9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZnVuY3Rpb24oZSx0LG4saSxhLG8pe3ZhciBsPXRoaXM7bC5udW1lcmFsRGVjaW1hbE1hcms9ZXx8XCIuXCIsbC5udW1lcmFsSW50ZWdlclNjYWxlPXQ+PTA/dDoxMCxsLm51bWVyYWxEZWNpbWFsU2NhbGU9bj49MD9uOjIsbC5udW1lcmFsVGhvdXNhbmRzR3JvdXBTdHlsZT1pfHxyLmdyb3VwU3R5bGUudGhvdXNhbmQsbC5udW1lcmFsUG9zaXRpdmVPbmx5PSEhYSxsLmRlbGltaXRlcj1vfHxcIlwiPT09bz9vOlwiLFwiLGwuZGVsaW1pdGVyUkU9bz9uZXcgUmVnRXhwKFwiXFxcXFwiK28sXCJnXCIpOlwiXCJ9O3IuZ3JvdXBTdHlsZT17dGhvdXNhbmQ6XCJ0aG91c2FuZFwiLGxha2g6XCJsYWtoXCIsd2FuOlwid2FuXCJ9LHIucHJvdG90eXBlPXtnZXRSYXdWYWx1ZTpmdW5jdGlvbihlKXtyZXR1cm4gZS5yZXBsYWNlKHRoaXMuZGVsaW1pdGVyUkUsXCJcIikucmVwbGFjZSh0aGlzLm51bWVyYWxEZWNpbWFsTWFyayxcIi5cIil9LGZvcm1hdDpmdW5jdGlvbihlKXt2YXIgdCxuLGk9dGhpcyxhPVwiXCI7c3dpdGNoKGU9ZS5yZXBsYWNlKC9bQS1aYS16XS9nLFwiXCIpLnJlcGxhY2UoaS5udW1lcmFsRGVjaW1hbE1hcmssXCJNXCIpLnJlcGxhY2UoL1teXFxkTS1dL2csXCJcIikucmVwbGFjZSgvXlxcLS8sXCJOXCIpLnJlcGxhY2UoL1xcLS9nLFwiXCIpLnJlcGxhY2UoXCJOXCIsaS5udW1lcmFsUG9zaXRpdmVPbmx5P1wiXCI6XCItXCIpLnJlcGxhY2UoXCJNXCIsaS5udW1lcmFsRGVjaW1hbE1hcmspLnJlcGxhY2UoL14oLSk/MCsoPz1cXGQpLyxcIiQxXCIpLG49ZSxlLmluZGV4T2YoaS5udW1lcmFsRGVjaW1hbE1hcmspPj0wJiYodD1lLnNwbGl0KGkubnVtZXJhbERlY2ltYWxNYXJrKSxuPXRbMF0sYT1pLm51bWVyYWxEZWNpbWFsTWFyayt0WzFdLnNsaWNlKDAsaS5udW1lcmFsRGVjaW1hbFNjYWxlKSksaS5udW1lcmFsSW50ZWdlclNjYWxlPjAmJihuPW4uc2xpY2UoMCxpLm51bWVyYWxJbnRlZ2VyU2NhbGUrKFwiLVwiPT09ZS5zbGljZSgwLDEpPzE6MCkpKSxpLm51bWVyYWxUaG91c2FuZHNHcm91cFN0eWxlKXtjYXNlIHIuZ3JvdXBTdHlsZS5sYWtoOm49bi5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGQpK1xcZCQpL2csXCIkMVwiK2kuZGVsaW1pdGVyKTticmVhaztjYXNlIHIuZ3JvdXBTdHlsZS53YW46bj1uLnJlcGxhY2UoLyhcXGQpKD89KFxcZHs0fSkrJCkvZyxcIiQxXCIraS5kZWxpbWl0ZXIpO2JyZWFrO2RlZmF1bHQ6bj1uLnJlcGxhY2UoLyhcXGQpKD89KFxcZHszfSkrJCkvZyxcIiQxXCIraS5kZWxpbWl0ZXIpfXJldHVybiBuLnRvU3RyaW5nKCkrKGkubnVtZXJhbERlY2ltYWxTY2FsZT4wP2EudG9TdHJpbmcoKTpcIlwiKX19LGUuZXhwb3J0cz1yfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO3ZhciByPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7dC5ibG9ja3M9W10sdC5kYXRlUGF0dGVybj1lLHQuaW5pdEJsb2NrcygpfTtyLnByb3RvdHlwZT17aW5pdEJsb2NrczpmdW5jdGlvbigpe3ZhciBlPXRoaXM7ZS5kYXRlUGF0dGVybi5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiWVwiPT09dD9lLmJsb2Nrcy5wdXNoKDQpOmUuYmxvY2tzLnB1c2goMil9KX0sZ2V0QmxvY2tzOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmxvY2tzfSxnZXRWYWxpZGF0ZWREYXRlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMscj1cIlwiO3JldHVybiBlPWUucmVwbGFjZSgvW15cXGRdL2csXCJcIiksdC5ibG9ja3MuZm9yRWFjaChmdW5jdGlvbihuLGkpe2lmKGUubGVuZ3RoPjApe3ZhciBhPWUuc2xpY2UoMCxuKSxvPWEuc2xpY2UoMCwxKSxsPWUuc2xpY2Uobik7c3dpdGNoKHQuZGF0ZVBhdHRlcm5baV0pe2Nhc2VcImRcIjpcIjAwXCI9PT1hP2E9XCIwMVwiOnBhcnNlSW50KG8sMTApPjM/YT1cIjBcIitvOnBhcnNlSW50KGEsMTApPjMxJiYoYT1cIjMxXCIpO2JyZWFrO2Nhc2VcIm1cIjpcIjAwXCI9PT1hP2E9XCIwMVwiOnBhcnNlSW50KG8sMTApPjE/YT1cIjBcIitvOnBhcnNlSW50KGEsMTApPjEyJiYoYT1cIjEyXCIpfXIrPWEsZT1sfX0pLHJ9fSxlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj1mdW5jdGlvbihlLHQpe3ZhciByPXRoaXM7ci5kZWxpbWl0ZXI9dHx8XCJcIj09PXQ/dDpcIiBcIixyLmRlbGltaXRlclJFPXQ/bmV3IFJlZ0V4cChcIlxcXFxcIit0LFwiZ1wiKTpcIlwiLHIuZm9ybWF0dGVyPWV9O3IucHJvdG90eXBlPXtzZXRGb3JtYXR0ZXI6ZnVuY3Rpb24oZSl7dGhpcy5mb3JtYXR0ZXI9ZX0sZm9ybWF0OmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7dC5mb3JtYXR0ZXIuY2xlYXIoKSxlPWUucmVwbGFjZSgvW15cXGQrXS9nLFwiXCIpLGU9ZS5yZXBsYWNlKHQuZGVsaW1pdGVyUkUsXCJcIik7Zm9yKHZhciByLG49XCJcIixpPSExLGE9MCxvPWUubGVuZ3RoO28+YTthKyspcj10LmZvcm1hdHRlci5pbnB1dERpZ2l0KGUuY2hhckF0KGEpKSwvW1xccygpLV0vZy50ZXN0KHIpPyhuPXIsaT0hMCk6aXx8KG49cik7cmV0dXJuIG49bi5yZXBsYWNlKC9bKCldL2csXCJcIiksbj1uLnJlcGxhY2UoL1tcXHMtXS9nLHQuZGVsaW1pdGVyKX19LGUuZXhwb3J0cz1yfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO3ZhciByPXtibG9ja3M6e3VhdHA6WzQsNSw2XSxhbWV4Ols0LDYsNV0sZGluZXJzOls0LDYsNF0sZGlzY292ZXI6WzQsNCw0LDRdLG1hc3RlcmNhcmQ6WzQsNCw0LDRdLGRhbmtvcnQ6WzQsNCw0LDRdLGluc3RhcGF5bWVudDpbNCw0LDQsNF0samNiOls0LDQsNCw0XSxtYWVzdHJvOls0LDQsNCw0XSx2aXNhOls0LDQsNCw0XSxnZW5lcmFsOls0LDQsNCw0XSxnZW5lcmFsU3RyaWN0Ols0LDQsNCw3XX0scmU6e3VhdHA6L14oPyExODAwKTFcXGR7MCwxNH0vLGFtZXg6L14zWzQ3XVxcZHswLDEzfS8sZGlzY292ZXI6L14oPzo2MDExfDY1XFxkezAsMn18NjRbNC05XVxcZD8pXFxkezAsMTJ9LyxkaW5lcnM6L14zKD86MChbMC01XXw5KXxbNjg5XVxcZD8pXFxkezAsMTF9LyxtYXN0ZXJjYXJkOi9eKDVbMS01XXwyWzItN10pXFxkezAsMTR9LyxkYW5rb3J0Oi9eKDUwMTl8NDE3NXw0NTcxKVxcZHswLDEyfS8saW5zdGFwYXltZW50Oi9eNjNbNy05XVxcZHswLDEzfS8samNiOi9eKD86MjEzMXwxODAwfDM1XFxkezAsMn0pXFxkezAsMTJ9LyxtYWVzdHJvOi9eKD86NVswNjc4XVxcZHswLDJ9fDYzMDR8NjdcXGR7MCwyfSlcXGR7MCwxMn0vLHZpc2E6L140XFxkezAsMTV9L30sZ2V0SW5mbzpmdW5jdGlvbihlLHQpe3ZhciBuPXIuYmxvY2tzLGk9ci5yZTtyZXR1cm4gdD0hIXQsaS5hbWV4LnRlc3QoZSk/e3R5cGU6XCJhbWV4XCIsYmxvY2tzOm4uYW1leH06aS51YXRwLnRlc3QoZSk/e3R5cGU6XCJ1YXRwXCIsYmxvY2tzOm4udWF0cH06aS5kaW5lcnMudGVzdChlKT97dHlwZTpcImRpbmVyc1wiLGJsb2NrczpuLmRpbmVyc306aS5kaXNjb3Zlci50ZXN0KGUpP3t0eXBlOlwiZGlzY292ZXJcIixibG9ja3M6dD9uLmdlbmVyYWxTdHJpY3Q6bi5kaXNjb3Zlcn06aS5tYXN0ZXJjYXJkLnRlc3QoZSk/e3R5cGU6XCJtYXN0ZXJjYXJkXCIsYmxvY2tzOm4ubWFzdGVyY2FyZH06aS5kYW5rb3J0LnRlc3QoZSk/e3R5cGU6XCJkYW5rb3J0XCIsYmxvY2tzOm4uZGFua29ydH06aS5pbnN0YXBheW1lbnQudGVzdChlKT97dHlwZTpcImluc3RhcGF5bWVudFwiLGJsb2NrczpuLmluc3RhcGF5bWVudH06aS5qY2IudGVzdChlKT97dHlwZTpcImpjYlwiLGJsb2NrczpuLmpjYn06aS5tYWVzdHJvLnRlc3QoZSk/e3R5cGU6XCJtYWVzdHJvXCIsYmxvY2tzOnQ/bi5nZW5lcmFsU3RyaWN0Om4ubWFlc3Ryb306aS52aXNhLnRlc3QoZSk/e3R5cGU6XCJ2aXNhXCIsYmxvY2tzOnQ/bi5nZW5lcmFsU3RyaWN0Om4udmlzYX06e3R5cGU6XCJ1bmtub3duXCIsYmxvY2tzOnQ/bi5nZW5lcmFsU3RyaWN0Om4uZ2VuZXJhbH19fTtlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj17bm9vcDpmdW5jdGlvbigpe30sc3RyaXA6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5yZXBsYWNlKHQsXCJcIil9LGlzRGVsaW1pdGVyOmZ1bmN0aW9uKGUsdCxyKXtyZXR1cm4gMD09PXIubGVuZ3RoP2U9PT10OnIuc29tZShmdW5jdGlvbih0KXtyZXR1cm4gZT09PXQ/ITA6dm9pZCAwfSl9LGdldERlbGltaXRlclJFQnlEZWxpbWl0ZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBSZWdFeHAoZS5yZXBsYWNlKC8oWy4/KiteJFtcXF1cXFxcKCl7fXwtXSkvZyxcIlxcXFwkMVwiKSxcImdcIil9LHN0cmlwRGVsaW1pdGVyczpmdW5jdGlvbihlLHQscil7dmFyIG49dGhpcztpZigwPT09ci5sZW5ndGgpe3ZhciBpPXQ/bi5nZXREZWxpbWl0ZXJSRUJ5RGVsaW1pdGVyKHQpOlwiXCI7cmV0dXJuIGUucmVwbGFjZShpLFwiXCIpfXJldHVybiByLmZvckVhY2goZnVuY3Rpb24odCl7ZT1lLnJlcGxhY2Uobi5nZXREZWxpbWl0ZXJSRUJ5RGVsaW1pdGVyKHQpLFwiXCIpfSksZX0saGVhZFN0cjpmdW5jdGlvbihlLHQpe3JldHVybiBlLnNsaWNlKDAsdCl9LGdldE1heExlbmd0aDpmdW5jdGlvbihlKXtyZXR1cm4gZS5yZWR1Y2UoZnVuY3Rpb24oZSx0KXtyZXR1cm4gZSt0fSwwKX0sZ2V0UHJlZml4U3RyaXBwZWRWYWx1ZTpmdW5jdGlvbihlLHQscil7aWYoZS5zbGljZSgwLHIpIT09dCl7dmFyIG49dGhpcy5nZXRGaXJzdERpZmZJbmRleCh0LGUuc2xpY2UoMCxyKSk7ZT10K2Uuc2xpY2UobixuKzEpK2Uuc2xpY2UocisxKX1yZXR1cm4gZS5zbGljZShyKX0sZ2V0Rmlyc3REaWZmSW5kZXg6ZnVuY3Rpb24oZSx0KXtmb3IodmFyIHI9MDtlLmNoYXJBdChyKT09PXQuY2hhckF0KHIpOylpZihcIlwiPT09ZS5jaGFyQXQocisrKSlyZXR1cm4tMTtyZXR1cm4gcn0sZ2V0Rm9ybWF0dGVkVmFsdWU6ZnVuY3Rpb24oZSx0LHIsbixpKXt2YXIgYSxvPVwiXCIsbD1pLmxlbmd0aD4wO3JldHVybiAwPT09cj9lOih0LmZvckVhY2goZnVuY3Rpb24odCxzKXtpZihlLmxlbmd0aD4wKXt2YXIgYz1lLnNsaWNlKDAsdCksdT1lLnNsaWNlKHQpO28rPWMsYT1sP2lbc118fGE6bixjLmxlbmd0aD09PXQmJnItMT5zJiYobys9YSksZT11fX0pLG8pfSxpc0FuZHJvaWQ6ZnVuY3Rpb24oKXtyZXR1cm4hKCFuYXZpZ2F0b3J8fCEvYW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpfSxpc0FuZHJvaWRCYWNrc3BhY2VLZXlkb3duOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuaXNBbmRyb2lkKCk/dD09PWUuc2xpY2UoMCwtMSk6ITF9fTtlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXsoZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9e2Fzc2lnbjpmdW5jdGlvbihlLHIpe3JldHVybiBlPWV8fHt9LHI9cnx8e30sZS5jcmVkaXRDYXJkPSEhci5jcmVkaXRDYXJkLGUuY3JlZGl0Q2FyZFN0cmljdE1vZGU9ISFyLmNyZWRpdENhcmRTdHJpY3RNb2RlLGUuY3JlZGl0Q2FyZFR5cGU9XCJcIixlLm9uQ3JlZGl0Q2FyZFR5cGVDaGFuZ2VkPXIub25DcmVkaXRDYXJkVHlwZUNoYW5nZWR8fGZ1bmN0aW9uKCl7fSxlLnBob25lPSEhci5waG9uZSxlLnBob25lUmVnaW9uQ29kZT1yLnBob25lUmVnaW9uQ29kZXx8XCJBVVwiLGUucGhvbmVGb3JtYXR0ZXI9e30sZS5kYXRlPSEhci5kYXRlLGUuZGF0ZVBhdHRlcm49ci5kYXRlUGF0dGVybnx8W1wiZFwiLFwibVwiLFwiWVwiXSxlLmRhdGVGb3JtYXR0ZXI9e30sZS5udW1lcmFsPSEhci5udW1lcmFsLGUubnVtZXJhbEludGVnZXJTY2FsZT1yLm51bWVyYWxJbnRlZ2VyU2NhbGU+PTA/ci5udW1lcmFsSW50ZWdlclNjYWxlOjEwLGUubnVtZXJhbERlY2ltYWxTY2FsZT1yLm51bWVyYWxEZWNpbWFsU2NhbGU+PTA/ci5udW1lcmFsRGVjaW1hbFNjYWxlOjIsZS5udW1lcmFsRGVjaW1hbE1hcms9ci5udW1lcmFsRGVjaW1hbE1hcmt8fFwiLlwiLGUubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGU9ci5udW1lcmFsVGhvdXNhbmRzR3JvdXBTdHlsZXx8XCJ0aG91c2FuZFwiLGUubnVtZXJhbFBvc2l0aXZlT25seT0hIXIubnVtZXJhbFBvc2l0aXZlT25seSxlLm51bWVyaWNPbmx5PWUuY3JlZGl0Q2FyZHx8ZS5kYXRlfHwhIXIubnVtZXJpY09ubHksZS51cHBlcmNhc2U9ISFyLnVwcGVyY2FzZSxlLmxvd2VyY2FzZT0hIXIubG93ZXJjYXNlLGUucHJlZml4PWUuY3JlZGl0Q2FyZHx8ZS5waG9uZXx8ZS5kYXRlP1wiXCI6ci5wcmVmaXh8fFwiXCIsZS5wcmVmaXhMZW5ndGg9ZS5wcmVmaXgubGVuZ3RoLGUucmF3VmFsdWVUcmltUHJlZml4PSEhci5yYXdWYWx1ZVRyaW1QcmVmaXgsZS5jb3B5RGVsaW1pdGVyPSEhci5jb3B5RGVsaW1pdGVyLGUuaW5pdFZhbHVlPXZvaWQgMD09PXIuaW5pdFZhbHVlP1wiXCI6ci5pbml0VmFsdWUudG9TdHJpbmcoKSxlLmRlbGltaXRlcj1yLmRlbGltaXRlcnx8XCJcIj09PXIuZGVsaW1pdGVyP3IuZGVsaW1pdGVyOnIuZGF0ZT9cIi9cIjpyLm51bWVyYWw/XCIsXCI6KHIucGhvbmUsXCIgXCIpLGUuZGVsaW1pdGVyTGVuZ3RoPWUuZGVsaW1pdGVyLmxlbmd0aCxlLmRlbGltaXRlcnM9ci5kZWxpbWl0ZXJzfHxbXSxlLmJsb2Nrcz1yLmJsb2Nrc3x8W10sZS5ibG9ja3NMZW5ndGg9ZS5ibG9ja3MubGVuZ3RoLGUucm9vdD1cIm9iamVjdFwiPT10eXBlb2YgdCYmdD90OndpbmRvdyxlLm1heExlbmd0aD0wLGUuYmFja3NwYWNlPSExLGUucmVzdWx0PVwiXCIsZX19O2UuZXhwb3J0cz1yfSkuY2FsbCh0LGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfV0pfSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY2xlYXZlLmpzL2Rpc3QvY2xlYXZlLm1pbi5qc1xuLy8gbW9kdWxlIGlkID0gNzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiIWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LG4pe3ZhciBlPXQuc3BsaXQoXCIuXCIpLHI9SDtlWzBdaW4gcnx8IXIuZXhlY1NjcmlwdHx8ci5leGVjU2NyaXB0KFwidmFyIFwiK2VbMF0pO2Zvcih2YXIgaTtlLmxlbmd0aCYmKGk9ZS5zaGlmdCgpKTspZS5sZW5ndGh8fHZvaWQgMD09PW4/cj1yW2ldP3JbaV06cltpXT17fTpyW2ldPW59ZnVuY3Rpb24gbih0LG4pe2Z1bmN0aW9uIGUoKXt9ZS5wcm90b3R5cGU9bi5wcm90b3R5cGUsdC5NPW4ucHJvdG90eXBlLHQucHJvdG90eXBlPW5ldyBlLHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPXQsdC5OPWZ1bmN0aW9uKHQsZSxyKXtmb3IodmFyIGk9QXJyYXkoYXJndW1lbnRzLmxlbmd0aC0yKSxhPTI7YTxhcmd1bWVudHMubGVuZ3RoO2ErKylpW2EtMl09YXJndW1lbnRzW2FdO3JldHVybiBuLnByb3RvdHlwZVtlXS5hcHBseSh0LGkpfX1mdW5jdGlvbiBlKHQsbil7bnVsbCE9dCYmdGhpcy5hLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiByKHQpe3QuYj1cIlwifWZ1bmN0aW9uIGkodCxuKXt0LnNvcnQobnx8YSl9ZnVuY3Rpb24gYSh0LG4pe3JldHVybiB0Pm4/MTpuPnQ/LTE6MH1mdW5jdGlvbiBsKHQpe3ZhciBuLGU9W10scj0wO2ZvcihuIGluIHQpZVtyKytdPXRbbl07cmV0dXJuIGV9ZnVuY3Rpb24gbyh0LG4pe3RoaXMuYj10LHRoaXMuYT17fTtmb3IodmFyIGU9MDtlPG4ubGVuZ3RoO2UrKyl7dmFyIHI9bltlXTt0aGlzLmFbci5iXT1yfX1mdW5jdGlvbiB1KHQpe3JldHVybiB0PWwodC5hKSxpKHQsZnVuY3Rpb24odCxuKXtyZXR1cm4gdC5iLW4uYn0pLHR9ZnVuY3Rpb24gcyh0LG4pe3N3aXRjaCh0aGlzLmI9dCx0aGlzLmc9ISFuLkcsdGhpcy5hPW4uYyx0aGlzLmo9bi50eXBlLHRoaXMuaD0hMSx0aGlzLmEpe2Nhc2UgcTpjYXNlIEo6Y2FzZSBMOmNhc2UgTzpjYXNlIGs6Y2FzZSBZOmNhc2UgSzp0aGlzLmg9ITB9dGhpcy5mPW4uZGVmYXVsdFZhbHVlfWZ1bmN0aW9uIGYoKXt0aGlzLmE9e30sdGhpcy5mPXRoaXMuaSgpLmEsdGhpcy5iPXRoaXMuZz1udWxsfWZ1bmN0aW9uIHAodCxuKXtmb3IodmFyIGU9dSh0LmkoKSkscj0wO3I8ZS5sZW5ndGg7cisrKXt2YXIgaT1lW3JdLGE9aS5iO2lmKG51bGwhPW4uYVthXSl7dC5iJiZkZWxldGUgdC5iW2kuYl07dmFyIGw9MTE9PWkuYXx8MTA9PWkuYTtpZihpLmcpZm9yKHZhciBpPWMobixhKXx8W10sbz0wO288aS5sZW5ndGg7bysrKXt2YXIgcz10LGY9YSxoPWw/aVtvXS5jbG9uZSgpOmlbb107cy5hW2ZdfHwocy5hW2ZdPVtdKSxzLmFbZl0ucHVzaChoKSxzLmImJmRlbGV0ZSBzLmJbZl19ZWxzZSBpPWMobixhKSxsPyhsPWModCxhKSk/cChsLGkpOm0odCxhLGkuY2xvbmUoKSk6bSh0LGEsaSl9fX1mdW5jdGlvbiBjKHQsbil7dmFyIGU9dC5hW25dO2lmKG51bGw9PWUpcmV0dXJuIG51bGw7aWYodC5nKXtpZighKG4gaW4gdC5iKSl7dmFyIHI9dC5nLGk9dC5mW25dO2lmKG51bGwhPWUpaWYoaS5nKXtmb3IodmFyIGE9W10sbD0wO2w8ZS5sZW5ndGg7bCsrKWFbbF09ci5iKGksZVtsXSk7ZT1hfWVsc2UgZT1yLmIoaSxlKTtyZXR1cm4gdC5iW25dPWV9cmV0dXJuIHQuYltuXX1yZXR1cm4gZX1mdW5jdGlvbiBoKHQsbixlKXt2YXIgcj1jKHQsbik7cmV0dXJuIHQuZltuXS5nP3JbZXx8MF06cn1mdW5jdGlvbiBnKHQsbil7dmFyIGU7aWYobnVsbCE9dC5hW25dKWU9aCh0LG4sdm9pZCAwKTtlbHNlIHQ6e2lmKGU9dC5mW25dLHZvaWQgMD09PWUuZil7dmFyIHI9ZS5qO2lmKHI9PT1Cb29sZWFuKWUuZj0hMTtlbHNlIGlmKHI9PT1OdW1iZXIpZS5mPTA7ZWxzZXtpZihyIT09U3RyaW5nKXtlPW5ldyByO2JyZWFrIHR9ZS5mPWUuaD9cIjBcIjpcIlwifX1lPWUuZn1yZXR1cm4gZX1mdW5jdGlvbiBiKHQsbil7cmV0dXJuIHQuZltuXS5nP251bGwhPXQuYVtuXT90LmFbbl0ubGVuZ3RoOjA6bnVsbCE9dC5hW25dPzE6MH1mdW5jdGlvbiBtKHQsbixlKXt0LmFbbl09ZSx0LmImJih0LmJbbl09ZSl9ZnVuY3Rpb24geSh0LG4pe3ZhciBlLHI9W107Zm9yKGUgaW4gbikwIT1lJiZyLnB1c2gobmV3IHMoZSxuW2VdKSk7cmV0dXJuIG5ldyBvKHQscil9LypcblxuIFByb3RvY29sIEJ1ZmZlciAyIENvcHlyaWdodCAyMDA4IEdvb2dsZSBJbmMuXG4gQWxsIG90aGVyIGNvZGUgY29weXJpZ2h0IGl0cyByZXNwZWN0aXZlIG93bmVycy5cbiBDb3B5cmlnaHQgKEMpIDIwMTAgVGhlIExpYnBob25lbnVtYmVyIEF1dGhvcnNcblxuIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5mdW5jdGlvbiB2KCl7Zi5jYWxsKHRoaXMpfWZ1bmN0aW9uIGQoKXtmLmNhbGwodGhpcyl9ZnVuY3Rpb24gXygpe2YuY2FsbCh0aGlzKX1mdW5jdGlvbiBTKCl7fWZ1bmN0aW9uIHcoKXt9ZnVuY3Rpb24gQSgpe30vKlxuXG4gQ29weXJpZ2h0IChDKSAyMDEwIFRoZSBMaWJwaG9uZW51bWJlciBBdXRob3JzLlxuXG4gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cbmZ1bmN0aW9uIHgoKXt0aGlzLmE9e319ZnVuY3Rpb24gTih0LG4pe2lmKG51bGw9PW4pcmV0dXJuIG51bGw7bj1uLnRvVXBwZXJDYXNlKCk7dmFyIGU9dC5hW25dO2lmKG51bGw9PWUpe2lmKGU9dHRbbl0sbnVsbD09ZSlyZXR1cm4gbnVsbDtlPShuZXcgQSkuYShfLmkoKSxlKSx0LmFbbl09ZX1yZXR1cm4gZX1mdW5jdGlvbiBqKHQpe3JldHVybiB0PVdbdF0sbnVsbD09dD9cIlpaXCI6dFswXX1mdW5jdGlvbiAkKHQpe3RoaXMuSD1SZWdFeHAoXCLigIhcIiksdGhpcy5CPVwiXCIsdGhpcy5tPW5ldyBlLHRoaXMudj1cIlwiLHRoaXMuaD1uZXcgZSx0aGlzLnU9bmV3IGUsdGhpcy5qPSEwLHRoaXMudz10aGlzLm89dGhpcy5EPSExLHRoaXMuRj14LmIoKSx0aGlzLnM9MCx0aGlzLmI9bmV3IGUsdGhpcy5BPSExLHRoaXMubD1cIlwiLHRoaXMuYT1uZXcgZSx0aGlzLmY9W10sdGhpcy5DPXQsdGhpcy5KPXRoaXMuZz1DKHRoaXMsdGhpcy5DKX1mdW5jdGlvbiBDKHQsbil7dmFyIGU7aWYobnVsbCE9biYmaXNOYU4obikmJm4udG9VcHBlckNhc2UoKWluIHR0KXtpZihlPU4odC5GLG4pLG51bGw9PWUpdGhyb3dcIkludmFsaWQgcmVnaW9uIGNvZGU6IFwiK247ZT1nKGUsMTApfWVsc2UgZT0wO3JldHVybiBlPU4odC5GLGooZSkpLG51bGwhPWU/ZTphdH1mdW5jdGlvbiBCKHQpe2Zvcih2YXIgbj10LmYubGVuZ3RoLGU9MDtuPmU7KytlKXt2YXIgaT10LmZbZV0sYT1nKGksMSk7aWYodC52PT1hKXJldHVybiExO3ZhciBsO2w9dDt2YXIgbz1pLHU9ZyhvLDEpO2lmKC0xIT11LmluZGV4T2YoXCJ8XCIpKWw9ITE7ZWxzZXt1PXUucmVwbGFjZShsdCxcIlxcXFxkXCIpLHU9dS5yZXBsYWNlKG90LFwiXFxcXGRcIikscihsLm0pO3ZhciBzO3M9bDt2YXIgbz1nKG8sMiksZj1cIjk5OTk5OTk5OTk5OTk5OVwiLm1hdGNoKHUpWzBdO2YubGVuZ3RoPHMuYS5iLmxlbmd0aD9zPVwiXCI6KHM9Zi5yZXBsYWNlKG5ldyBSZWdFeHAodSxcImdcIiksbykscz1zLnJlcGxhY2UoUmVnRXhwKFwiOVwiLFwiZ1wiKSxcIuKAiFwiKSksMDxzLmxlbmd0aD8obC5tLmEocyksbD0hMCk6bD0hMX1pZihsKXJldHVybiB0LnY9YSx0LkE9c3QudGVzdChoKGksNCkpLHQucz0wLCEwfXJldHVybiB0Lmo9ITF9ZnVuY3Rpb24gRSh0LG4pe2Zvcih2YXIgZT1bXSxyPW4ubGVuZ3RoLTMsaT10LmYubGVuZ3RoLGE9MDtpPmE7KythKXt2YXIgbD10LmZbYV07MD09YihsLDMpP2UucHVzaCh0LmZbYV0pOihsPWgobCwzLE1hdGgubWluKHIsYihsLDMpLTEpKSwwPT1uLnNlYXJjaChsKSYmZS5wdXNoKHQuZlthXSkpfXQuZj1lfWZ1bmN0aW9uIFIodCxuKXt0LmguYShuKTt2YXIgZT1uO2lmKHJ0LnRlc3QoZSl8fDE9PXQuaC5iLmxlbmd0aCYmZXQudGVzdChlKSl7dmFyIGksZT1uO1wiK1wiPT1lPyhpPWUsdC51LmEoZSkpOihpPW50W2VdLHQudS5hKGkpLHQuYS5hKGkpKSxuPWl9ZWxzZSB0Lmo9ITEsdC5EPSEwO2lmKCF0Lmope2lmKCF0LkQpaWYoVih0KSl7aWYoUCh0KSlyZXR1cm4gRCh0KX1lbHNlIGlmKDA8dC5sLmxlbmd0aCYmKGU9dC5hLnRvU3RyaW5nKCkscih0LmEpLHQuYS5hKHQubCksdC5hLmEoZSksZT10LmIudG9TdHJpbmcoKSxpPWUubGFzdEluZGV4T2YodC5sKSxyKHQuYiksdC5iLmEoZS5zdWJzdHJpbmcoMCxpKSkpLHQubCE9VSh0KSlyZXR1cm4gdC5iLmEoXCIgXCIpLEQodCk7cmV0dXJuIHQuaC50b1N0cmluZygpfXN3aXRjaCh0LnUuYi5sZW5ndGgpe2Nhc2UgMDpjYXNlIDE6Y2FzZSAyOnJldHVybiB0LmgudG9TdHJpbmcoKTtjYXNlIDM6aWYoIVYodCkpcmV0dXJuIHQubD1VKHQpLEYodCk7dC53PSEwO2RlZmF1bHQ6cmV0dXJuIHQudz8oUCh0KSYmKHQudz0hMSksdC5iLnRvU3RyaW5nKCkrdC5hLnRvU3RyaW5nKCkpOjA8dC5mLmxlbmd0aD8oZT1UKHQsbiksaT1JKHQpLDA8aS5sZW5ndGg/aTooRSh0LHQuYS50b1N0cmluZygpKSxCKHQpP0codCk6dC5qP00odCxlKTp0LmgudG9TdHJpbmcoKSkpOkYodCl9fWZ1bmN0aW9uIEQodCl7cmV0dXJuIHQuaj0hMCx0Lnc9ITEsdC5mPVtdLHQucz0wLHIodC5tKSx0LnY9XCJcIixGKHQpfWZ1bmN0aW9uIEkodCl7Zm9yKHZhciBuPXQuYS50b1N0cmluZygpLGU9dC5mLmxlbmd0aCxyPTA7ZT5yOysrcil7dmFyIGk9dC5mW3JdLGE9ZyhpLDEpO2lmKG5ldyBSZWdFeHAoXCJeKD86XCIrYStcIikkXCIpLnRlc3QobikpcmV0dXJuIHQuQT1zdC50ZXN0KGgoaSw0KSksbj1uLnJlcGxhY2UobmV3IFJlZ0V4cChhLFwiZ1wiKSxoKGksMikpLE0odCxuKX1yZXR1cm5cIlwifWZ1bmN0aW9uIE0odCxuKXt2YXIgZT10LmIuYi5sZW5ndGg7cmV0dXJuIHQuQSYmZT4wJiZcIiBcIiE9dC5iLnRvU3RyaW5nKCkuY2hhckF0KGUtMSk/dC5iK1wiIFwiK246dC5iK259ZnVuY3Rpb24gRih0KXt2YXIgbj10LmEudG9TdHJpbmcoKTtpZigzPD1uLmxlbmd0aCl7Zm9yKHZhciBlPXQubyYmMDxiKHQuZywyMCk/Yyh0LmcsMjApfHxbXTpjKHQuZywxOSl8fFtdLHI9ZS5sZW5ndGgsaT0wO3I+aTsrK2kpe3ZhciBhLGw9ZVtpXTsoYT1udWxsPT10LmcuYVsxMl18fHQub3x8aChsLDYpKXx8KGE9ZyhsLDQpLGE9MD09YS5sZW5ndGh8fGl0LnRlc3QoYSkpLGEmJnV0LnRlc3QoZyhsLDIpKSYmdC5mLnB1c2gobCl9cmV0dXJuIEUodCxuKSxuPUkodCksMDxuLmxlbmd0aD9uOkIodCk/Ryh0KTp0LmgudG9TdHJpbmcoKX1yZXR1cm4gTSh0LG4pfWZ1bmN0aW9uIEcodCl7dmFyIG49dC5hLnRvU3RyaW5nKCksZT1uLmxlbmd0aDtpZihlPjApe2Zvcih2YXIgcj1cIlwiLGk9MDtlPmk7aSsrKXI9VCh0LG4uY2hhckF0KGkpKTtyZXR1cm4gdC5qP00odCxyKTp0LmgudG9TdHJpbmcoKX1yZXR1cm4gdC5iLnRvU3RyaW5nKCl9ZnVuY3Rpb24gVSh0KXt2YXIgbixlPXQuYS50b1N0cmluZygpLGk9MDtyZXR1cm4gMSE9aCh0LmcsMTApP249ITE6KG49dC5hLnRvU3RyaW5nKCksbj1cIjFcIj09bi5jaGFyQXQoMCkmJlwiMFwiIT1uLmNoYXJBdCgxKSYmXCIxXCIhPW4uY2hhckF0KDEpKSxuPyhpPTEsdC5iLmEoXCIxXCIpLmEoXCIgXCIpLHQubz0hMCk6bnVsbCE9dC5nLmFbMTVdJiYobj1uZXcgUmVnRXhwKFwiXig/OlwiK2godC5nLDE1KStcIilcIiksbj1lLm1hdGNoKG4pLG51bGwhPW4mJm51bGwhPW5bMF0mJjA8blswXS5sZW5ndGgmJih0Lm89ITAsaT1uWzBdLmxlbmd0aCx0LmIuYShlLnN1YnN0cmluZygwLGkpKSkpLHIodC5hKSx0LmEuYShlLnN1YnN0cmluZyhpKSksZS5zdWJzdHJpbmcoMCxpKX1mdW5jdGlvbiBWKHQpe3ZhciBuPXQudS50b1N0cmluZygpLGU9bmV3IFJlZ0V4cChcIl4oPzpcXFxcK3xcIitoKHQuZywxMSkrXCIpXCIpLGU9bi5tYXRjaChlKTtyZXR1cm4gbnVsbCE9ZSYmbnVsbCE9ZVswXSYmMDxlWzBdLmxlbmd0aD8odC5vPSEwLGU9ZVswXS5sZW5ndGgscih0LmEpLHQuYS5hKG4uc3Vic3RyaW5nKGUpKSxyKHQuYiksdC5iLmEobi5zdWJzdHJpbmcoMCxlKSksXCIrXCIhPW4uY2hhckF0KDApJiZ0LmIuYShcIiBcIiksITApOiExfWZ1bmN0aW9uIFAodCl7aWYoMD09dC5hLmIubGVuZ3RoKXJldHVybiExO3ZhciBuLGk9bmV3IGU7dDp7aWYobj10LmEudG9TdHJpbmcoKSwwIT1uLmxlbmd0aCYmXCIwXCIhPW4uY2hhckF0KDApKWZvcih2YXIgYSxsPW4ubGVuZ3RoLG89MTszPj1vJiZsPj1vOysrbylpZihhPXBhcnNlSW50KG4uc3Vic3RyaW5nKDAsbyksMTApLGEgaW4gVyl7aS5hKG4uc3Vic3RyaW5nKG8pKSxuPWE7YnJlYWsgdH1uPTB9cmV0dXJuIDA9PW4/ITE6KHIodC5hKSx0LmEuYShpLnRvU3RyaW5nKCkpLGk9aihuKSxcIjAwMVwiPT1pP3QuZz1OKHQuRixcIlwiK24pOmkhPXQuQyYmKHQuZz1DKHQsaSkpLHQuYi5hKFwiXCIrbikuYShcIiBcIiksdC5sPVwiXCIsITApfWZ1bmN0aW9uIFQodCxuKXt2YXIgZT10Lm0udG9TdHJpbmcoKTtpZigwPD1lLnN1YnN0cmluZyh0LnMpLnNlYXJjaCh0LkgpKXt2YXIgaT1lLnNlYXJjaCh0LkgpLGU9ZS5yZXBsYWNlKHQuSCxuKTtyZXR1cm4gcih0Lm0pLHQubS5hKGUpLHQucz1pLGUuc3Vic3RyaW5nKDAsdC5zKzEpfXJldHVybiAxPT10LmYubGVuZ3RoJiYodC5qPSExKSx0LnY9XCJcIix0LmgudG9TdHJpbmcoKX12YXIgSD10aGlzO2UucHJvdG90eXBlLmI9XCJcIixlLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5iPVwiXCIrdH0sZS5wcm90b3R5cGUuYT1mdW5jdGlvbih0LG4sZSl7aWYodGhpcy5iKz1TdHJpbmcodCksbnVsbCE9bilmb3IodmFyIHI9MTtyPGFyZ3VtZW50cy5sZW5ndGg7cisrKXRoaXMuYis9YXJndW1lbnRzW3JdO3JldHVybiB0aGlzfSxlLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJ9O3ZhciBLPTEsWT0yLHE9MyxKPTQsTD02LE89MTYsaz0xODtmLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24odCxuKXttKHRoaXMsdC5iLG4pfSxmLnByb3RvdHlwZS5jbG9uZT1mdW5jdGlvbigpe3ZhciB0PW5ldyB0aGlzLmNvbnN0cnVjdG9yO3JldHVybiB0IT10aGlzJiYodC5hPXt9LHQuYiYmKHQuYj17fSkscCh0LHRoaXMpKSx0fTt2YXIgWjtuKHYsZik7dmFyIHo7bihkLGYpO3ZhciBYO24oXyxmKSx2LnByb3RvdHlwZS5pPWZ1bmN0aW9uKCl7cmV0dXJuIFp8fChaPXkodix7MDp7bmFtZTpcIk51bWJlckZvcm1hdFwiLEk6XCJpMThuLnBob25lbnVtYmVycy5OdW1iZXJGb3JtYXRcIn0sMTp7bmFtZTpcInBhdHRlcm5cIixyZXF1aXJlZDohMCxjOjksdHlwZTpTdHJpbmd9LDI6e25hbWU6XCJmb3JtYXRcIixyZXF1aXJlZDohMCxjOjksdHlwZTpTdHJpbmd9LDM6e25hbWU6XCJsZWFkaW5nX2RpZ2l0c19wYXR0ZXJuXCIsRzohMCxjOjksdHlwZTpTdHJpbmd9LDQ6e25hbWU6XCJuYXRpb25hbF9wcmVmaXhfZm9ybWF0dGluZ19ydWxlXCIsYzo5LHR5cGU6U3RyaW5nfSw2OntuYW1lOlwibmF0aW9uYWxfcHJlZml4X29wdGlvbmFsX3doZW5fZm9ybWF0dGluZ1wiLGM6OCx0eXBlOkJvb2xlYW59LDU6e25hbWU6XCJkb21lc3RpY19jYXJyaWVyX2NvZGVfZm9ybWF0dGluZ19ydWxlXCIsYzo5LHR5cGU6U3RyaW5nfX0pKSxafSx2LmN0b3I9dix2LmN0b3IuaT12LnByb3RvdHlwZS5pLGQucHJvdG90eXBlLmk9ZnVuY3Rpb24oKXtyZXR1cm4genx8KHo9eShkLHswOntuYW1lOlwiUGhvbmVOdW1iZXJEZXNjXCIsSTpcImkxOG4ucGhvbmVudW1iZXJzLlBob25lTnVtYmVyRGVzY1wifSwyOntuYW1lOlwibmF0aW9uYWxfbnVtYmVyX3BhdHRlcm5cIixjOjksdHlwZTpTdHJpbmd9LDM6e25hbWU6XCJwb3NzaWJsZV9udW1iZXJfcGF0dGVyblwiLGM6OSx0eXBlOlN0cmluZ30sNjp7bmFtZTpcImV4YW1wbGVfbnVtYmVyXCIsYzo5LHR5cGU6U3RyaW5nfSw3OntuYW1lOlwibmF0aW9uYWxfbnVtYmVyX21hdGNoZXJfZGF0YVwiLGM6MTIsdHlwZTpTdHJpbmd9LDg6e25hbWU6XCJwb3NzaWJsZV9udW1iZXJfbWF0Y2hlcl9kYXRhXCIsYzoxMix0eXBlOlN0cmluZ319KSksen0sZC5jdG9yPWQsZC5jdG9yLmk9ZC5wcm90b3R5cGUuaSxfLnByb3RvdHlwZS5pPWZ1bmN0aW9uKCl7cmV0dXJuIFh8fChYPXkoXyx7MDp7bmFtZTpcIlBob25lTWV0YWRhdGFcIixJOlwiaTE4bi5waG9uZW51bWJlcnMuUGhvbmVNZXRhZGF0YVwifSwxOntuYW1lOlwiZ2VuZXJhbF9kZXNjXCIsYzoxMSx0eXBlOmR9LDI6e25hbWU6XCJmaXhlZF9saW5lXCIsYzoxMSx0eXBlOmR9LDM6e25hbWU6XCJtb2JpbGVcIixjOjExLHR5cGU6ZH0sNDp7bmFtZTpcInRvbGxfZnJlZVwiLGM6MTEsdHlwZTpkfSw1OntuYW1lOlwicHJlbWl1bV9yYXRlXCIsYzoxMSx0eXBlOmR9LDY6e25hbWU6XCJzaGFyZWRfY29zdFwiLGM6MTEsdHlwZTpkfSw3OntuYW1lOlwicGVyc29uYWxfbnVtYmVyXCIsYzoxMSx0eXBlOmR9LDg6e25hbWU6XCJ2b2lwXCIsYzoxMSx0eXBlOmR9LDIxOntuYW1lOlwicGFnZXJcIixjOjExLHR5cGU6ZH0sMjU6e25hbWU6XCJ1YW5cIixjOjExLHR5cGU6ZH0sMjc6e25hbWU6XCJlbWVyZ2VuY3lcIixjOjExLHR5cGU6ZH0sMjg6e25hbWU6XCJ2b2ljZW1haWxcIixjOjExLHR5cGU6ZH0sMjQ6e25hbWU6XCJub19pbnRlcm5hdGlvbmFsX2RpYWxsaW5nXCIsYzoxMSx0eXBlOmR9LDk6e25hbWU6XCJpZFwiLHJlcXVpcmVkOiEwLGM6OSx0eXBlOlN0cmluZ30sMTA6e25hbWU6XCJjb3VudHJ5X2NvZGVcIixjOjUsdHlwZTpOdW1iZXJ9LDExOntuYW1lOlwiaW50ZXJuYXRpb25hbF9wcmVmaXhcIixjOjksdHlwZTpTdHJpbmd9LDE3OntuYW1lOlwicHJlZmVycmVkX2ludGVybmF0aW9uYWxfcHJlZml4XCIsYzo5LHR5cGU6U3RyaW5nfSwxMjp7bmFtZTpcIm5hdGlvbmFsX3ByZWZpeFwiLGM6OSx0eXBlOlN0cmluZ30sMTM6e25hbWU6XCJwcmVmZXJyZWRfZXh0bl9wcmVmaXhcIixjOjksdHlwZTpTdHJpbmd9LDE1OntuYW1lOlwibmF0aW9uYWxfcHJlZml4X2Zvcl9wYXJzaW5nXCIsYzo5LHR5cGU6U3RyaW5nfSwxNjp7bmFtZTpcIm5hdGlvbmFsX3ByZWZpeF90cmFuc2Zvcm1fcnVsZVwiLGM6OSx0eXBlOlN0cmluZ30sMTg6e25hbWU6XCJzYW1lX21vYmlsZV9hbmRfZml4ZWRfbGluZV9wYXR0ZXJuXCIsYzo4LGRlZmF1bHRWYWx1ZTohMSx0eXBlOkJvb2xlYW59LDE5OntuYW1lOlwibnVtYmVyX2Zvcm1hdFwiLEc6ITAsYzoxMSx0eXBlOnZ9LDIwOntuYW1lOlwiaW50bF9udW1iZXJfZm9ybWF0XCIsRzohMCxjOjExLHR5cGU6dn0sMjI6e25hbWU6XCJtYWluX2NvdW50cnlfZm9yX2NvZGVcIixjOjgsZGVmYXVsdFZhbHVlOiExLHR5cGU6Qm9vbGVhbn0sMjM6e25hbWU6XCJsZWFkaW5nX2RpZ2l0c1wiLGM6OSx0eXBlOlN0cmluZ30sMjY6e25hbWU6XCJsZWFkaW5nX3plcm9fcG9zc2libGVcIixjOjgsZGVmYXVsdFZhbHVlOiExLHR5cGU6Qm9vbGVhbn19KSksWH0sXy5jdG9yPV8sXy5jdG9yLmk9Xy5wcm90b3R5cGUuaSxTLnByb3RvdHlwZS5hPWZ1bmN0aW9uKHQpe3Rocm93IG5ldyB0LmIsRXJyb3IoXCJVbmltcGxlbWVudGVkXCIpfSxTLnByb3RvdHlwZS5iPWZ1bmN0aW9uKHQsbil7aWYoMTE9PXQuYXx8MTA9PXQuYSlyZXR1cm4gbiBpbnN0YW5jZW9mIGY/bjp0aGlzLmEodC5qLnByb3RvdHlwZS5pKCksbik7aWYoMTQ9PXQuYSl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIG4mJlEudGVzdChuKSl7dmFyIGU9TnVtYmVyKG4pO2lmKGU+MClyZXR1cm4gZX1yZXR1cm4gbn1pZighdC5oKXJldHVybiBuO2lmKGU9dC5qLGU9PT1TdHJpbmcpe2lmKFwibnVtYmVyXCI9PXR5cGVvZiBuKXJldHVybiBTdHJpbmcobil9ZWxzZSBpZihlPT09TnVtYmVyJiZcInN0cmluZ1wiPT10eXBlb2YgbiYmKFwiSW5maW5pdHlcIj09PW58fFwiLUluZmluaXR5XCI9PT1ufHxcIk5hTlwiPT09bnx8US50ZXN0KG4pKSlyZXR1cm4gTnVtYmVyKG4pO3JldHVybiBufTt2YXIgUT0vXi0/WzAtOV0rJC87bih3LFMpLHcucHJvdG90eXBlLmE9ZnVuY3Rpb24odCxuKXt2YXIgZT1uZXcgdC5iO3JldHVybiBlLmc9dGhpcyxlLmE9bixlLmI9e30sZX0sbihBLHcpLEEucHJvdG90eXBlLmI9ZnVuY3Rpb24odCxuKXtyZXR1cm4gOD09dC5hPyEhbjpTLnByb3RvdHlwZS5iLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0sQS5wcm90b3R5cGUuYT1mdW5jdGlvbih0LG4pe3JldHVybiBBLk0uYS5jYWxsKHRoaXMsdCxuKX07LypcblxuIENvcHlyaWdodCAoQykgMjAxMCBUaGUgTGlicGhvbmVudW1iZXIgQXV0aG9yc1xuXG4gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cbnZhciBXPXsxOlwiVVMgQUcgQUkgQVMgQkIgQk0gQlMgQ0EgRE0gRE8gR0QgR1UgSk0gS04gS1kgTEMgTVAgTVMgUFIgU1ggVEMgVFQgVkMgVkcgVklcIi5zcGxpdChcIiBcIil9LHR0PXtVUzpbbnVsbCxbbnVsbCxudWxsLFwiWzItOV1cXFxcZHs5fVwiLFwiXFxcXGR7N30oPzpcXFxcZHszfSk/XCJdLFtudWxsLG51bGwsXCIoPzoyKD86MFsxLTM1LTldfDFbMDItOV18MlswNDU4OV18M1sxNDldfDRbMDhdfDVbMS00Nl18NlswMjc5XXw3WzAyNl18OFsxM10pfDMoPzowWzEtNTctOV18MVswMi05XXwyWzAxMzVdfDNbMDE0Njc5XXw0WzY3XXw1WzEyXXw2WzAxNF18OFswNTZdKXw0KD86MFsxMjQtOV18MVswMi01NzldfDJbMy01XXwzWzAyNDVdfDRbMDIzNV18NTh8Njl8N1swNTg5XXw4WzA0XSl8NSg/OjBbMS01Ny05XXwxWzAyMzUtOF18MjB8M1swMTQ5XXw0WzAxXXw1WzE5XXw2WzEtMzddfDdbMDEzLTVdfDhbMDU2XSl8Nig/OjBbMS0zNS05XXwxWzAyNC05XXwyWzAzNjg5XXwzWzAxNl18NFsxNl18NVswMTddfDZbMC0yNzldfDc4fDhbMTJdKXw3KD86MFsxLTQ2LThdfDFbMDItOV18MlswNDU3XXwzWzEyNDddfDRbMDM3XXw1WzQ3XXw2WzAyMzU5XXw3WzAyLTU5XXw4WzE1Nl0pfDgoPzowWzEtNjhdfDFbMDItOF18Mjh8M1swLTI1XXw0WzM1NzhdfDVbMDQ2LTldfDZbMDItNV18N1swMjhdKXw5KD86MFsxMzQ2LTldfDFbMDItOV18MlswNTg5XXwzWzAxNjc4XXw0WzAxNzldfDVbMTI0NjldfDdbMC0zNTg5XXw4WzA0NTldKSlbMi05XVxcXFxkezZ9XCIsXCJcXFxcZHs3fSg/OlxcXFxkezN9KT9cIixudWxsLG51bGwsXCIyMDE1NTU1NTU1XCJdLFtudWxsLG51bGwsXCIoPzoyKD86MFsxLTM1LTldfDFbMDItOV18MlswNDU4OV18M1sxNDldfDRbMDhdfDVbMS00Nl18NlswMjc5XXw3WzAyNl18OFsxM10pfDMoPzowWzEtNTctOV18MVswMi05XXwyWzAxMzVdfDNbMDE0Njc5XXw0WzY3XXw1WzEyXXw2WzAxNF18OFswNTZdKXw0KD86MFsxMjQtOV18MVswMi01NzldfDJbMy01XXwzWzAyNDVdfDRbMDIzNV18NTh8Njl8N1swNTg5XXw4WzA0XSl8NSg/OjBbMS01Ny05XXwxWzAyMzUtOF18MjB8M1swMTQ5XXw0WzAxXXw1WzE5XXw2WzEtMzddfDdbMDEzLTVdfDhbMDU2XSl8Nig/OjBbMS0zNS05XXwxWzAyNC05XXwyWzAzNjg5XXwzWzAxNl18NFsxNl18NVswMTddfDZbMC0yNzldfDc4fDhbMTJdKXw3KD86MFsxLTQ2LThdfDFbMDItOV18MlswNDU3XXwzWzEyNDddfDRbMDM3XXw1WzQ3XXw2WzAyMzU5XXw3WzAyLTU5XXw4WzE1Nl0pfDgoPzowWzEtNjhdfDFbMDItOF18Mjh8M1swLTI1XXw0WzM1NzhdfDVbMDQ2LTldfDZbMDItNV18N1swMjhdKXw5KD86MFsxMzQ2LTldfDFbMDItOV18MlswNTg5XXwzWzAxNjc4XXw0WzAxNzldfDVbMTI0NjldfDdbMC0zNTg5XXw4WzA0NTldKSlbMi05XVxcXFxkezZ9XCIsXCJcXFxcZHs3fSg/OlxcXFxkezN9KT9cIixudWxsLG51bGwsXCIyMDE1NTU1NTU1XCJdLFtudWxsLG51bGwsXCI4KD86MDB8NDR8NTV8NjZ8Nzd8ODgpWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7MTB9XCIsbnVsbCxudWxsLFwiODAwMjM0NTY3OFwiXSxbbnVsbCxudWxsLFwiOTAwWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7MTB9XCIsbnVsbCxudWxsLFwiOTAwMjM0NTY3OFwiXSxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdLFtudWxsLG51bGwsXCI1KD86MDB8MzN8NDR8NjZ8Nzd8ODgpWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7MTB9XCIsbnVsbCxudWxsLFwiNTAwMjM0NTY3OFwiXSxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdLFwiVVNcIiwxLFwiMDExXCIsXCIxXCIsbnVsbCxudWxsLFwiMVwiLG51bGwsbnVsbCwxLFtbbnVsbCxcIihcXFxcZHszfSkoXFxcXGR7NH0pXCIsXCIkMS0kMlwiLG51bGwsbnVsbCxudWxsLDFdLFtudWxsLFwiKFxcXFxkezN9KShcXFxcZHszfSkoXFxcXGR7NH0pXCIsXCIoJDEpICQyLSQzXCIsbnVsbCxudWxsLG51bGwsMV1dLFtbbnVsbCxcIihcXFxcZHszfSkoXFxcXGR7M30pKFxcXFxkezR9KVwiLFwiJDEtJDItJDNcIl1dLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl0sMSxudWxsLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl0sW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXSxudWxsLG51bGwsW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXV19O3guYj1mdW5jdGlvbigpe3JldHVybiB4LmE/eC5hOnguYT1uZXcgeH07dmFyIG50PXswOlwiMFwiLDE6XCIxXCIsMjpcIjJcIiwzOlwiM1wiLDQ6XCI0XCIsNTpcIjVcIiw2OlwiNlwiLDc6XCI3XCIsODpcIjhcIiw5OlwiOVwiLFwi77yQXCI6XCIwXCIsXCLvvJFcIjpcIjFcIixcIu+8klwiOlwiMlwiLFwi77yTXCI6XCIzXCIsXCLvvJRcIjpcIjRcIixcIu+8lVwiOlwiNVwiLFwi77yWXCI6XCI2XCIsXCLvvJdcIjpcIjdcIixcIu+8mFwiOlwiOFwiLFwi77yZXCI6XCI5XCIsXCLZoFwiOlwiMFwiLFwi2aFcIjpcIjFcIixcItmiXCI6XCIyXCIsXCLZo1wiOlwiM1wiLFwi2aRcIjpcIjRcIixcItmlXCI6XCI1XCIsXCLZplwiOlwiNlwiLFwi2adcIjpcIjdcIixcItmoXCI6XCI4XCIsXCLZqVwiOlwiOVwiLFwi27BcIjpcIjBcIixcItuxXCI6XCIxXCIsXCLbslwiOlwiMlwiLFwi27NcIjpcIjNcIixcItu0XCI6XCI0XCIsXCLbtVwiOlwiNVwiLFwi27ZcIjpcIjZcIixcItu3XCI6XCI3XCIsXCLbuFwiOlwiOFwiLFwi27lcIjpcIjlcIn0sZXQ9UmVnRXhwKFwiWyvvvItdK1wiKSxydD1SZWdFeHAoXCIoWzAtOe+8kC3vvJnZoC3ZqduwLdu5XSlcIiksaXQ9L15cXCg/XFwkMVxcKT8kLyxhdD1uZXcgXzttKGF0LDExLFwiTkFcIik7dmFyIGx0PS9cXFsoW15cXFtcXF1dKSpcXF0vZyxvdD0vXFxkKD89W14sfV1bXix9XSkvZyx1dD1SZWdFeHAoXCJeWy144oCQLeKAleKIkuODvO+8jS3vvI8gwqDCreKAi+KBoOOAgCgp77yI77yJ77y777y9LlxcXFxbXFxcXF0vfuKBk+KIvO+9nl0qKFxcXFwkXFxcXGRbLXjigJAt4oCV4oiS44O877yNLe+8jyDCoMKt4oCL4oGg44CAKCnvvIjvvInvvLvvvL0uXFxcXFtcXFxcXS9+4oGT4oi8772eXSopKyRcIiksc3Q9L1stIF0vOyQucHJvdG90eXBlLks9ZnVuY3Rpb24oKXt0aGlzLkI9XCJcIixyKHRoaXMuaCkscih0aGlzLnUpLHIodGhpcy5tKSx0aGlzLnM9MCx0aGlzLnY9XCJcIixyKHRoaXMuYiksdGhpcy5sPVwiXCIscih0aGlzLmEpLHRoaXMuaj0hMCx0aGlzLnc9dGhpcy5vPXRoaXMuRD0hMSx0aGlzLmY9W10sdGhpcy5BPSExLHRoaXMuZyE9dGhpcy5KJiYodGhpcy5nPUModGhpcyx0aGlzLkMpKX0sJC5wcm90b3R5cGUuTD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5CPVIodGhpcyx0KX0sdChcIkNsZWF2ZS5Bc1lvdVR5cGVGb3JtYXR0ZXJcIiwkKSx0KFwiQ2xlYXZlLkFzWW91VHlwZUZvcm1hdHRlci5wcm90b3R5cGUuaW5wdXREaWdpdFwiLCQucHJvdG90eXBlLkwpLHQoXCJDbGVhdmUuQXNZb3VUeXBlRm9ybWF0dGVyLnByb3RvdHlwZS5jbGVhclwiLCQucHJvdG90eXBlLkspfS5jYWxsKFwib2JqZWN0XCI9PXR5cGVvZiBnbG9iYWwmJmdsb2JhbD9nbG9iYWw6d2luZG93KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jbGVhdmUuanMvZGlzdC9hZGRvbnMvY2xlYXZlLXBob25lLnVzLmpzXG4vLyBtb2R1bGUgaWQgPSA3MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcInNjcmVlbi1zbWFsbFwiOjM3NSxcInNjcmVlbi1tZWRpdW1cIjo3MDAsXCJzY3JlZW4tbGFyZ2VcIjoxMDI0LFwic2NyZWVuLXhsYXJnZVwiOjEyMDB9XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmFyaWFibGVzLmpzb25cbi8vIG1vZHVsZSBpZCA9IDczXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIFJlc2l6ZSByZUNBUFRDSEEgdG8gZml0IHdpZHRoIG9mIGNvbnRhaW5lclxyXG4vLyBTaW5jZSBpdCBoYXMgYSBmaXhlZCB3aWR0aCwgd2UncmUgc2NhbGluZ1xyXG4vLyB1c2luZyBDU1MzIHRyYW5zZm9ybXNcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vIGNhcHRjaGFTY2FsZSA9IGNvbnRhaW5lcldpZHRoIC8gZWxlbWVudFdpZHRoXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcclxuICBmdW5jdGlvbiBzY2FsZUNhcHRjaGEoKSB7XHJcbiAgICAvLyBXaWR0aCBvZiB0aGUgcmVDQVBUQ0hBIGVsZW1lbnQsIGluIHBpeGVsc1xyXG4gICAgdmFyIHJlQ2FwdGNoYVdpZHRoID0gMzA0O1xyXG4gICAgLy8gR2V0IHRoZSBjb250YWluaW5nIGVsZW1lbnQncyB3aWR0aFxyXG4gICAgdmFyIGNvbnRhaW5lcldpZHRoID0gJCgnLnNtcy1mb3JtLXdyYXBwZXInKS53aWR0aCgpO1xyXG4gICAgXHJcbiAgICAvLyBPbmx5IHNjYWxlIHRoZSByZUNBUFRDSEEgaWYgaXQgd29uJ3QgZml0XHJcbiAgICAvLyBpbnNpZGUgdGhlIGNvbnRhaW5lclxyXG4gICAgaWYocmVDYXB0Y2hhV2lkdGggPiBjb250YWluZXJXaWR0aCkge1xyXG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIHNjYWxlXHJcbiAgICAgIHZhciBjYXB0Y2hhU2NhbGUgPSBjb250YWluZXJXaWR0aCAvIHJlQ2FwdGNoYVdpZHRoO1xyXG4gICAgICAvLyBBcHBseSB0aGUgdHJhbnNmb3JtYXRpb25cclxuICAgICAgJCgnLmctcmVjYXB0Y2hhJykuY3NzKHtcclxuICAgICAgICB0cmFuc2Zvcm06J3NjYWxlKCcrY2FwdGNoYVNjYWxlKycpJ1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICQoZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBJbml0aWFsaXplIHNjYWxpbmdcclxuICAgIHNjYWxlQ2FwdGNoYSgpO1xyXG4gIH0pO1xyXG5cclxuICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gVXBkYXRlIHNjYWxpbmcgb24gd2luZG93IHJlc2l6ZVxyXG4gICAgLy8gVXNlcyBqUXVlcnkgdGhyb3R0bGUgcGx1Z2luIHRvIGxpbWl0IHN0cmFpbiBvbiB0aGUgYnJvd3NlclxyXG4gICAgc2NhbGVDYXB0Y2hhKCk7XHJcbiAgfSk7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9jYXB0Y2hhUmVzaXplLmpzIiwiLyoqXG4qIEhvbWUgUm90YXRpbmcgVGV4dCBBbmltYXRpb25cbiogUmVmZXJyZWQgZnJvbSBTdGFja292ZXJmbG93XG4qIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjc3MTc4OS9jaGFuZ2luZy10ZXh0LXBlcmlvZGljYWxseS1pbi1hLXNwYW4tZnJvbS1hbi1hcnJheS13aXRoLWpxdWVyeS8yNzcyMjc4IzI3NzIyNzhcbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgdGVybXMgPSBbXTtcblxuICAkKCcucm90YXRpbmctdGV4dF9fZW50cnknKS5lYWNoKGZ1bmN0aW9uIChpLCBlKSB7XG4gICAgaWYgKCQoZSkudGV4dCgpLnRyaW0oKSAhPT0gJycpIHtcbiAgICAgIHRlcm1zLnB1c2goJChlKS50ZXh0KCkpO1xuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gcm90YXRlVGVybSgpIHtcbiAgICB2YXIgY3QgPSAkKFwiI3JvdGF0ZVwiKS5kYXRhKFwidGVybVwiKSB8fCAwO1xuICAgICQoXCIjcm90YXRlXCIpLmRhdGEoXCJ0ZXJtXCIsIGN0ID09PSB0ZXJtcy5sZW5ndGggLTEgPyAwIDogY3QgKyAxKS50ZXh0KHRlcm1zW2N0XSkuZmFkZUluKCkuZGVsYXkoMjAwMCkuZmFkZU91dCgyMDAsIHJvdGF0ZVRlcm0pO1xuICB9XG4gICQocm90YXRlVGVybSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9yb3RhdGluZ1RleHRBbmltYXRpb24uanMiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBNaXNzUGxldGUgZnJvbSAnbWlzcy1wbGV0ZS1qcyc7XG5cbmNsYXNzIFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIG1vZHVsZVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9pbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNlYXJjaC5zZWxlY3RvcnMuTUFJTik7XG5cbiAgICBpZiAoIXRoaXMuX2lucHV0cykgcmV0dXJuO1xuXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuX2lucHV0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5fc3VnZ2VzdGlvbnModGhpcy5faW5wdXRzW2ldKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIHN1Z2dlc3RlZCBzZWFyY2ggdGVybSBkcm9wZG93bi5cbiAgICogQHBhcmFtICB7b2JqZWN0fSBpbnB1dCBUaGUgc2VhcmNoIGlucHV0LlxuICAgKi9cbiAgX3N1Z2dlc3Rpb25zKGlucHV0KSB7XG4gICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGlucHV0LmRhdGFzZXQuanNTZWFyY2hTdWdnZXN0aW9ucyk7XG5cbiAgICBpbnB1dC5fTWlzc1BsZXRlID0gbmV3IE1pc3NQbGV0ZSh7XG4gICAgICBpbnB1dDogaW5wdXQsXG4gICAgICBvcHRpb25zOiBkYXRhLFxuICAgICAgY2xhc3NOYW1lOiBpbnB1dC5kYXRhc2V0LmpzU2VhcmNoRHJvcGRvd25DbGFzc1xuICAgIH0pO1xuICB9XG59XG5cblNlYXJjaC5zZWxlY3RvcnMgPSB7XG4gIE1BSU46ICdbZGF0YS1qcyo9XCJzZWFyY2hcIl0nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTZWFyY2g7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc2VhcmNoLmpzIiwiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiTWlzc1BsZXRlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk1pc3NQbGV0ZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblxuXG4vKioqLyB9KSxcbi8qIDEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdHZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cdFxuXHR2YXIgX2phcm9XaW5rbGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcblx0XG5cdHZhciBfamFyb1dpbmtsZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfamFyb1dpbmtsZXIpO1xuXHRcblx0dmFyIF9tZW1vaXplID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKTtcblx0XG5cdHZhciBfbWVtb2l6ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW1vaXplKTtcblx0XG5cdGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cdFxuXHRmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXHRcblx0dmFyIE1pc3NQbGV0ZSA9IGZ1bmN0aW9uICgpIHtcblx0ICBmdW5jdGlvbiBNaXNzUGxldGUoX3JlZikge1xuXHQgICAgdmFyIF90aGlzID0gdGhpcztcblx0XG5cdCAgICB2YXIgaW5wdXQgPSBfcmVmLmlucHV0LFxuXHQgICAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnMsXG5cdCAgICAgICAgY2xhc3NOYW1lID0gX3JlZi5jbGFzc05hbWUsXG5cdCAgICAgICAgX3JlZiRzY29yZUZuID0gX3JlZi5zY29yZUZuLFxuXHQgICAgICAgIHNjb3JlRm4gPSBfcmVmJHNjb3JlRm4gPT09IHVuZGVmaW5lZCA/ICgwLCBfbWVtb2l6ZTIuZGVmYXVsdCkoTWlzc1BsZXRlLnNjb3JlRm4pIDogX3JlZiRzY29yZUZuLFxuXHQgICAgICAgIF9yZWYkbGlzdEl0ZW1GbiA9IF9yZWYubGlzdEl0ZW1Gbixcblx0ICAgICAgICBsaXN0SXRlbUZuID0gX3JlZiRsaXN0SXRlbUZuID09PSB1bmRlZmluZWQgPyBNaXNzUGxldGUubGlzdEl0ZW1GbiA6IF9yZWYkbGlzdEl0ZW1Gbjtcblx0XG5cdCAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWlzc1BsZXRlKTtcblx0XG5cdCAgICBPYmplY3QuYXNzaWduKHRoaXMsIHsgaW5wdXQ6IGlucHV0LCBvcHRpb25zOiBvcHRpb25zLCBjbGFzc05hbWU6IGNsYXNzTmFtZSwgc2NvcmVGbjogc2NvcmVGbiwgbGlzdEl0ZW1GbjogbGlzdEl0ZW1GbiB9KTtcblx0XG5cdCAgICB0aGlzLnNjb3JlZE9wdGlvbnMgPSBudWxsO1xuXHQgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuXHQgICAgdGhpcy51bCA9IG51bGw7XG5cdCAgICB0aGlzLmhpZ2hsaWdodGVkSW5kZXggPSAtMTtcblx0XG5cdCAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoX3RoaXMuaW5wdXQudmFsdWUubGVuZ3RoID4gMCkge1xuXHQgICAgICAgIF90aGlzLnNjb3JlZE9wdGlvbnMgPSBfdGhpcy5vcHRpb25zLm1hcChmdW5jdGlvbiAob3B0aW9uKSB7XG5cdCAgICAgICAgICByZXR1cm4gc2NvcmVGbihfdGhpcy5pbnB1dC52YWx1ZSwgb3B0aW9uKTtcblx0ICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdCAgICAgICAgICByZXR1cm4gYi5zY29yZSAtIGEuc2NvcmU7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgX3RoaXMuc2NvcmVkT3B0aW9ucyA9IFtdO1xuXHQgICAgICB9XG5cdCAgICAgIF90aGlzLnJlbmRlck9wdGlvbnMoKTtcblx0ICAgIH0pO1xuXHRcblx0ICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICBpZiAoX3RoaXMudWwpIHtcblx0ICAgICAgICAvLyBkcm9wZG93biB2aXNpYmxlP1xuXHQgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuXHQgICAgICAgICAgY2FzZSAxMzpcblx0ICAgICAgICAgICAgX3RoaXMuc2VsZWN0KCk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgY2FzZSAyNzpcblx0ICAgICAgICAgICAgLy8gRXNjXG5cdCAgICAgICAgICAgIF90aGlzLnJlbW92ZURyb3Bkb3duKCk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgY2FzZSA0MDpcblx0ICAgICAgICAgICAgLy8gRG93biBhcnJvd1xuXHQgICAgICAgICAgICAvLyBPdGhlcndpc2UgdXAgYXJyb3cgcGxhY2VzIHRoZSBjdXJzb3IgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGVcblx0ICAgICAgICAgICAgLy8gZmllbGQsIGFuZCBkb3duIGFycm93IGF0IHRoZSBlbmRcblx0ICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgICAgICAgX3RoaXMuY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24oX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCA8IF90aGlzLnVsLmNoaWxkcmVuLmxlbmd0aCAtIDEgPyBfdGhpcy5oaWdobGlnaHRlZEluZGV4ICsgMSA6IC0xKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICBjYXNlIDM4OlxuXHQgICAgICAgICAgICAvLyBVcCBhcnJvd1xuXHQgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgICAgICBfdGhpcy5jaGFuZ2VIaWdobGlnaHRlZE9wdGlvbihfdGhpcy5oaWdobGlnaHRlZEluZGV4ID4gLTEgPyBfdGhpcy5oaWdobGlnaHRlZEluZGV4IC0gMSA6IF90aGlzLnVsLmNoaWxkcmVuLmxlbmd0aCAtIDEpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHRcblx0ICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICBfdGhpcy5yZW1vdmVEcm9wZG93bigpO1xuXHQgICAgICBfdGhpcy5oaWdobGlnaHRlZEluZGV4ID0gLTE7XG5cdCAgICB9KTtcblx0ICB9IC8vIGVuZCBjb25zdHJ1Y3RvclxuXHRcblx0ICBfY3JlYXRlQ2xhc3MoTWlzc1BsZXRlLCBbe1xuXHQgICAga2V5OiAnZ2V0U2libGluZ0luZGV4Jyxcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTaWJsaW5nSW5kZXgobm9kZSkge1xuXHQgICAgICB2YXIgaW5kZXggPSAtMTtcblx0ICAgICAgdmFyIG4gPSBub2RlO1xuXHQgICAgICBkbyB7XG5cdCAgICAgICAgaW5kZXgrKztcblx0ICAgICAgICBuID0gbi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXHQgICAgICB9IHdoaWxlIChuKTtcblx0ICAgICAgcmV0dXJuIGluZGV4O1xuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ3JlbmRlck9wdGlvbnMnLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlck9wdGlvbnMoKSB7XG5cdCAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXHRcblx0ICAgICAgdmFyIGRvY3VtZW50RnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFxuXHQgICAgICB0aGlzLnNjb3JlZE9wdGlvbnMuZXZlcnkoZnVuY3Rpb24gKHNjb3JlZE9wdGlvbiwgaSkge1xuXHQgICAgICAgIHZhciBsaXN0SXRlbSA9IF90aGlzMi5saXN0SXRlbUZuKHNjb3JlZE9wdGlvbiwgaSk7XG5cdCAgICAgICAgbGlzdEl0ZW0gJiYgZG9jdW1lbnRGcmFnbWVudC5hcHBlbmRDaGlsZChsaXN0SXRlbSk7XG5cdCAgICAgICAgcmV0dXJuICEhbGlzdEl0ZW07XG5cdCAgICAgIH0pO1xuXHRcblx0ICAgICAgdGhpcy5yZW1vdmVEcm9wZG93bigpO1xuXHQgICAgICB0aGlzLmhpZ2hsaWdodGVkSW5kZXggPSAtMTtcblx0XG5cdCAgICAgIGlmIChkb2N1bWVudEZyYWdtZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuXHQgICAgICAgIHZhciBuZXdVbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcblx0ICAgICAgICBuZXdVbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgICAgIGlmIChldmVudC50YXJnZXQudGFnTmFtZSA9PT0gJ0xJJykge1xuXHQgICAgICAgICAgICBfdGhpczIuY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24oX3RoaXMyLmdldFNpYmxpbmdJbmRleChldmVudC50YXJnZXQpKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0XG5cdCAgICAgICAgbmV3VWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgIF90aGlzMi5jaGFuZ2VIaWdobGlnaHRlZE9wdGlvbigtMSk7XG5cdCAgICAgICAgfSk7XG5cdFxuXHQgICAgICAgIG5ld1VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICAgICAgcmV0dXJuIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgfSk7XG5cdFxuXHQgICAgICAgIG5ld1VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdCAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09ICdMSScpIHtcblx0ICAgICAgICAgICAgX3RoaXMyLnNlbGVjdCgpO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXHRcblx0ICAgICAgICBuZXdVbC5hcHBlbmRDaGlsZChkb2N1bWVudEZyYWdtZW50KTtcblx0XG5cdCAgICAgICAgLy8gU2VlIENTUyB0byB1bmRlcnN0YW5kIHdoeSB0aGUgPHVsPiBoYXMgdG8gYmUgd3JhcHBlZCBpbiBhIDxkaXY+XG5cdCAgICAgICAgdmFyIG5ld0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdCAgICAgICAgbmV3Q29udGFpbmVyLmNsYXNzTmFtZSA9IHRoaXMuY2xhc3NOYW1lO1xuXHQgICAgICAgIG5ld0NvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdVbCk7XG5cdFxuXHQgICAgICAgIC8vIEluc2VydHMgdGhlIGRyb3Bkb3duIGp1c3QgYWZ0ZXIgdGhlIDxpbnB1dD4gZWxlbWVudFxuXHQgICAgICAgIHRoaXMuaW5wdXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Q29udGFpbmVyLCB0aGlzLmlucHV0Lm5leHRTaWJsaW5nKTtcblx0ICAgICAgICB0aGlzLmNvbnRhaW5lciA9IG5ld0NvbnRhaW5lcjtcblx0ICAgICAgICB0aGlzLnVsID0gbmV3VWw7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LCB7XG5cdCAgICBrZXk6ICdjaGFuZ2VIaWdobGlnaHRlZE9wdGlvbicsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24obmV3SGlnaGxpZ2h0ZWRJbmRleCkge1xuXHQgICAgICBpZiAobmV3SGlnaGxpZ2h0ZWRJbmRleCA+PSAtMSAmJiBuZXdIaWdobGlnaHRlZEluZGV4IDwgdGhpcy51bC5jaGlsZHJlbi5sZW5ndGgpIHtcblx0ICAgICAgICAvLyBJZiBhbnkgb3B0aW9uIGFscmVhZHkgc2VsZWN0ZWQsIHRoZW4gdW5zZWxlY3QgaXRcblx0ICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRlZEluZGV4ICE9PSAtMSkge1xuXHQgICAgICAgICAgdGhpcy51bC5jaGlsZHJlblt0aGlzLmhpZ2hsaWdodGVkSW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWdobGlnaHRcIik7XG5cdCAgICAgICAgfVxuXHRcblx0ICAgICAgICB0aGlzLmhpZ2hsaWdodGVkSW5kZXggPSBuZXdIaWdobGlnaHRlZEluZGV4O1xuXHRcblx0ICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRlZEluZGV4ICE9PSAtMSkge1xuXHQgICAgICAgICAgdGhpcy51bC5jaGlsZHJlblt0aGlzLmhpZ2hsaWdodGVkSW5kZXhdLmNsYXNzTGlzdC5hZGQoXCJoaWdobGlnaHRcIik7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAnc2VsZWN0Jyxcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiBzZWxlY3QoKSB7XG5cdCAgICAgIGlmICh0aGlzLmhpZ2hsaWdodGVkSW5kZXggIT09IC0xKSB7XG5cdCAgICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9IHRoaXMuc2NvcmVkT3B0aW9uc1t0aGlzLmhpZ2hsaWdodGVkSW5kZXhdLmRpc3BsYXlWYWx1ZTtcblx0ICAgICAgICB0aGlzLnJlbW92ZURyb3Bkb3duKCk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9LCB7XG5cdCAgICBrZXk6ICdyZW1vdmVEcm9wZG93bicsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRHJvcGRvd24oKSB7XG5cdCAgICAgIHRoaXMuY29udGFpbmVyICYmIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xuXHQgICAgICB0aGlzLmNvbnRhaW5lciA9IG51bGw7XG5cdCAgICAgIHRoaXMudWwgPSBudWxsO1xuXHQgICAgfVxuXHQgIH1dLCBbe1xuXHQgICAga2V5OiAnc2NvcmVGbicsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gc2NvcmVGbihpbnB1dFZhbHVlLCBvcHRpb25TeW5vbnltcykge1xuXHQgICAgICB2YXIgY2xvc2VzdFN5bm9ueW0gPSBudWxsO1xuXHQgICAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWU7XG5cdCAgICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuXHQgICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IgPSB1bmRlZmluZWQ7XG5cdFxuXHQgICAgICB0cnkge1xuXHQgICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IG9wdGlvblN5bm9ueW1zW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IChfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZSkge1xuXHQgICAgICAgICAgdmFyIHN5bm9ueW0gPSBfc3RlcC52YWx1ZTtcblx0XG5cdCAgICAgICAgICB2YXIgc2ltaWxhcml0eSA9ICgwLCBfamFyb1dpbmtsZXIyLmRlZmF1bHQpKHN5bm9ueW0udHJpbSgpLnRvTG93ZXJDYXNlKCksIGlucHV0VmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCkpO1xuXHQgICAgICAgICAgaWYgKGNsb3Nlc3RTeW5vbnltID09PSBudWxsIHx8IHNpbWlsYXJpdHkgPiBjbG9zZXN0U3lub255bS5zaW1pbGFyaXR5KSB7XG5cdCAgICAgICAgICAgIGNsb3Nlc3RTeW5vbnltID0geyBzaW1pbGFyaXR5OiBzaW1pbGFyaXR5LCB2YWx1ZTogc3lub255bSB9O1xuXHQgICAgICAgICAgICBpZiAoc2ltaWxhcml0eSA9PT0gMSkge1xuXHQgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGNhdGNoIChlcnIpIHtcblx0ICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG5cdCAgICAgICAgX2l0ZXJhdG9yRXJyb3IgPSBlcnI7XG5cdCAgICAgIH0gZmluYWxseSB7XG5cdCAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiAmJiBfaXRlcmF0b3IucmV0dXJuKSB7XG5cdCAgICAgICAgICAgIF9pdGVyYXRvci5yZXR1cm4oKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9IGZpbmFsbHkge1xuXHQgICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG5cdCAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHRcblx0ICAgICAgcmV0dXJuIHtcblx0ICAgICAgICBzY29yZTogY2xvc2VzdFN5bm9ueW0uc2ltaWxhcml0eSxcblx0ICAgICAgICBkaXNwbGF5VmFsdWU6IG9wdGlvblN5bm9ueW1zWzBdXG5cdCAgICAgIH07XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAnbGlzdEl0ZW1GbicsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gbGlzdEl0ZW1GbihzY29yZWRPcHRpb24sIGl0ZW1JbmRleCkge1xuXHQgICAgICB2YXIgbGkgPSBpdGVtSW5kZXggPiBNaXNzUGxldGUuTUFYX0lURU1TID8gbnVsbCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcblx0ICAgICAgbGkgJiYgbGkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc2NvcmVkT3B0aW9uLmRpc3BsYXlWYWx1ZSkpO1xuXHQgICAgICByZXR1cm4gbGk7XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAnTUFYX0lURU1TJyxcblx0ICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgICByZXR1cm4gODtcblx0ICAgIH1cblx0ICB9XSk7XG5cdFxuXHQgIHJldHVybiBNaXNzUGxldGU7XG5cdH0oKTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IE1pc3NQbGV0ZTtcblxuLyoqKi8gfSksXG4vKiAyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdHZhciBfc2xpY2VkVG9BcnJheSA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gc2xpY2VJdGVyYXRvcihhcnIsIGkpIHsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfZSA9IHVuZGVmaW5lZDsgdHJ5IHsgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0pIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfSByZXR1cm4gZnVuY3Rpb24gKGFyciwgaSkgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IHJldHVybiBhcnI7IH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSB7IHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7IH0gZWxzZSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpOyB9IH07IH0oKTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChzMSwgczIpIHtcblx0ICB2YXIgcHJlZml4U2NhbGluZ0ZhY3RvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogMC4yO1xuXHRcblx0ICB2YXIgamFyb1NpbWlsYXJpdHkgPSBqYXJvKHMxLCBzMik7XG5cdFxuXHQgIHZhciBjb21tb25QcmVmaXhMZW5ndGggPSAwO1xuXHQgIGZvciAodmFyIGkgPSAwOyBpIDwgczEubGVuZ3RoOyBpKyspIHtcblx0ICAgIGlmIChzMVtpXSA9PT0gczJbaV0pIHtcblx0ICAgICAgY29tbW9uUHJlZml4TGVuZ3RoKys7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBicmVhaztcblx0ICAgIH1cblx0ICB9XG5cdFxuXHQgIHJldHVybiBqYXJvU2ltaWxhcml0eSArIE1hdGgubWluKGNvbW1vblByZWZpeExlbmd0aCwgNCkgKiBwcmVmaXhTY2FsaW5nRmFjdG9yICogKDEgLSBqYXJvU2ltaWxhcml0eSk7XG5cdH07XG5cdFxuXHQvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9KYXJvJUUyJTgwJTkzV2lua2xlcl9kaXN0YW5jZVxuXHRcblx0ZnVuY3Rpb24gamFybyhzMSwgczIpIHtcblx0ICB2YXIgc2hvcnRlciA9IHZvaWQgMCxcblx0ICAgICAgbG9uZ2VyID0gdm9pZCAwO1xuXHRcblx0ICB2YXIgX3JlZiA9IHMxLmxlbmd0aCA+IHMyLmxlbmd0aCA/IFtzMSwgczJdIDogW3MyLCBzMV07XG5cdFxuXHQgIHZhciBfcmVmMiA9IF9zbGljZWRUb0FycmF5KF9yZWYsIDIpO1xuXHRcblx0ICBsb25nZXIgPSBfcmVmMlswXTtcblx0ICBzaG9ydGVyID0gX3JlZjJbMV07XG5cdFxuXHRcblx0ICB2YXIgbWF0Y2hpbmdXaW5kb3cgPSBNYXRoLmZsb29yKGxvbmdlci5sZW5ndGggLyAyKSAtIDE7XG5cdCAgdmFyIHNob3J0ZXJNYXRjaGVzID0gW107XG5cdCAgdmFyIGxvbmdlck1hdGNoZXMgPSBbXTtcblx0XG5cdCAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaG9ydGVyLmxlbmd0aDsgaSsrKSB7XG5cdCAgICB2YXIgY2ggPSBzaG9ydGVyW2ldO1xuXHQgICAgdmFyIHdpbmRvd1N0YXJ0ID0gTWF0aC5tYXgoMCwgaSAtIG1hdGNoaW5nV2luZG93KTtcblx0ICAgIHZhciB3aW5kb3dFbmQgPSBNYXRoLm1pbihpICsgbWF0Y2hpbmdXaW5kb3cgKyAxLCBsb25nZXIubGVuZ3RoKTtcblx0ICAgIGZvciAodmFyIGogPSB3aW5kb3dTdGFydDsgaiA8IHdpbmRvd0VuZDsgaisrKSB7XG5cdCAgICAgIGlmIChsb25nZXJNYXRjaGVzW2pdID09PSB1bmRlZmluZWQgJiYgY2ggPT09IGxvbmdlcltqXSkge1xuXHQgICAgICAgIHNob3J0ZXJNYXRjaGVzW2ldID0gbG9uZ2VyTWF0Y2hlc1tqXSA9IGNoO1xuXHQgICAgICAgIGJyZWFrO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICB2YXIgc2hvcnRlck1hdGNoZXNTdHJpbmcgPSBzaG9ydGVyTWF0Y2hlcy5qb2luKFwiXCIpO1xuXHQgIHZhciBsb25nZXJNYXRjaGVzU3RyaW5nID0gbG9uZ2VyTWF0Y2hlcy5qb2luKFwiXCIpO1xuXHQgIHZhciBudW1NYXRjaGVzID0gc2hvcnRlck1hdGNoZXNTdHJpbmcubGVuZ3RoO1xuXHRcblx0ICB2YXIgdHJhbnNwb3NpdGlvbnMgPSAwO1xuXHQgIGZvciAodmFyIF9pID0gMDsgX2kgPCBzaG9ydGVyTWF0Y2hlc1N0cmluZy5sZW5ndGg7IF9pKyspIHtcblx0ICAgIGlmIChzaG9ydGVyTWF0Y2hlc1N0cmluZ1tfaV0gIT09IGxvbmdlck1hdGNoZXNTdHJpbmdbX2ldKSB7XG5cdCAgICAgIHRyYW5zcG9zaXRpb25zKys7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gbnVtTWF0Y2hlcyA+IDAgPyAobnVtTWF0Y2hlcyAvIHNob3J0ZXIubGVuZ3RoICsgbnVtTWF0Y2hlcyAvIGxvbmdlci5sZW5ndGggKyAobnVtTWF0Y2hlcyAtIE1hdGguZmxvb3IodHJhbnNwb3NpdGlvbnMgLyAyKSkgLyBudW1NYXRjaGVzKSAvIDMuMCA6IDA7XG5cdH1cblxuLyoqKi8gfSksXG4vKiAzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0ICB2YWx1ZTogdHJ1ZVxuXHR9KTtcblx0XG5cdGV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChmbikge1xuXHQgIHZhciBjYWNoZSA9IHt9O1xuXHRcblx0ICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0ICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICAgIH1cblx0XG5cdCAgICB2YXIga2V5ID0gSlNPTi5zdHJpbmdpZnkoYXJncyk7XG5cdCAgICByZXR1cm4gY2FjaGVba2V5XSB8fCAoY2FjaGVba2V5XSA9IGZuLmFwcGx5KG51bGwsIGFyZ3MpKTtcblx0ICB9O1xuXHR9O1xuXG4vKioqLyB9KVxuLyoqKioqKi8gXSlcbn0pO1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVuZGxlLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL21pc3MtcGxldGUtanMvZGlzdC9idW5kbGUuanNcbi8vIG1vZHVsZSBpZCA9IDc3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVG9nZ2xlT3BlbiBtb2R1bGVcbiAqIEBtb2R1bGUgbW9kdWxlcy90b2dnbGVPcGVuXG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuaW1wb3J0IGRhdGFzZXQgZnJvbSAnLi9kYXRhc2V0LmpzJztcblxuLyoqXG4gKiBUb2dnbGVzIGFuIGVsZW1lbnQgb3Blbi9jbG9zZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gb3BlbkNsYXNzIC0gVGhlIGNsYXNzIHRvIHRvZ2dsZSBvbi9vZmZcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3BlbkNsYXNzKSB7XG4gIGlmICghb3BlbkNsYXNzKSBvcGVuQ2xhc3MgPSAnaXMtb3Blbic7XG5cbiAgY29uc3QgbGlua0FjdGl2ZUNsYXNzID0gJ2lzLWFjdGl2ZSc7XG4gIGNvbnN0IHRvZ2dsZUVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdG9nZ2xlXScpO1xuXG4gIGlmICghdG9nZ2xlRWxlbXMpIHJldHVybjtcblxuICAvKipcbiAgKiBGb3IgZWFjaCB0b2dnbGUgZWxlbWVudCwgZ2V0IGl0cyB0YXJnZXQgZnJvbSB0aGUgZGF0YS10b2dnbGUgYXR0cmlidXRlLlxuICAqIEJpbmQgYW4gZXZlbnQgaGFuZGxlciB0byB0b2dnbGUgdGhlIG9wZW5DbGFzcyBvbi9vZmYgb24gdGhlIHRhcmdldCBlbGVtZW50XG4gICogd2hlbiB0aGUgdG9nZ2xlIGVsZW1lbnQgaXMgY2xpY2tlZC5cbiAgKi9cbiAgZm9yRWFjaCh0b2dnbGVFbGVtcywgZnVuY3Rpb24odG9nZ2xlRWxlbSkge1xuICAgIGNvbnN0IHRhcmdldEVsZW1TZWxlY3RvciA9IGRhdGFzZXQodG9nZ2xlRWxlbSwgJ3RvZ2dsZScpO1xuXG4gICAgaWYgKCF0YXJnZXRFbGVtU2VsZWN0b3IpIHJldHVybjtcblxuICAgIGNvbnN0IHRhcmdldEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRFbGVtU2VsZWN0b3IpO1xuXG4gICAgaWYgKCF0YXJnZXRFbGVtKSByZXR1cm47XG5cbiAgICB0b2dnbGVFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGxldCB0b2dnbGVFdmVudDtcbiAgICAgIGxldCB0b2dnbGVDbGFzcyA9ICh0b2dnbGVFbGVtLmRhdGFzZXQudG9nZ2xlQ2xhc3MpID9cbiAgICAgICAgdG9nZ2xlRWxlbS5kYXRhc2V0LnRvZ2dsZUNsYXNzIDogb3BlbkNsYXNzO1xuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAvLyBUb2dnbGUgdGhlIGVsZW1lbnQncyBhY3RpdmUgY2xhc3NcbiAgICAgIHRvZ2dsZUVsZW0uY2xhc3NMaXN0LnRvZ2dsZShsaW5rQWN0aXZlQ2xhc3MpO1xuXG4gICAgICAvLyBUb2dnbGUgY3VzdG9tIGNsYXNzIGlmIGl0IGlzIHNldFxuICAgICAgaWYgKHRvZ2dsZUNsYXNzICE9PSBvcGVuQ2xhc3MpXG4gICAgICAgIHRhcmdldEVsZW0uY2xhc3NMaXN0LnRvZ2dsZSh0b2dnbGVDbGFzcyk7XG5cbiAgICAgIC8vIFRvZ2dsZSB0aGUgZGVmYXVsdCBvcGVuIGNsYXNzXG4gICAgICB0YXJnZXRFbGVtLmNsYXNzTGlzdC50b2dnbGUob3BlbkNsYXNzKTtcblxuICAgICAgLy8gVG9nZ2xlIHRoZSBhcHByb3ByaWF0ZSBhcmlhIGhpZGRlbiBhdHRyaWJ1dGVcbiAgICAgIHRhcmdldEVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsXG4gICAgICAgICEodGFyZ2V0RWxlbS5jbGFzc0xpc3QuY29udGFpbnModG9nZ2xlQ2xhc3MpKVxuICAgICAgKTtcblxuICAgICAgLy8gRmlyZSB0aGUgY3VzdG9tIG9wZW4gc3RhdGUgZXZlbnQgdG8gdHJpZ2dlciBvcGVuIGZ1bmN0aW9uc1xuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdG9nZ2xlRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZU9wZW5TdGF0ZScsIHtcbiAgICAgICAgICBkZXRhaWw6IHRhcmdldEVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKG9wZW5DbGFzcylcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b2dnbGVFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgICB0b2dnbGVFdmVudC5pbml0Q3VzdG9tRXZlbnQoJ2NoYW5nZU9wZW5TdGF0ZScsIHRydWUsIHRydWUsIHtcbiAgICAgICAgICBkZXRhaWw6IHRhcmdldEVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKG9wZW5DbGFzcylcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRhcmdldEVsZW0uZGlzcGF0Y2hFdmVudCh0b2dnbGVFdmVudCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvdG9nZ2xlT3Blbi5qcyIsIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuaW1wb3J0IGpRdWVyeSBmcm9tICdqcXVlcnknO1xuXG4oZnVuY3Rpb24od2luZG93LCAkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBdHRhY2ggc2l0ZS13aWRlIGV2ZW50IGxpc3RlbmVycy5cbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtc2ltcGxlLXRvZ2dsZScsIGUgPT4ge1xuICAgIC8vIFNpbXBsZSB0b2dnbGUgdGhhdCBhZGQvcmVtb3ZlcyBcImFjdGl2ZVwiIGFuZCBcImhpZGRlblwiIGNsYXNzZXMsIGFzIHdlbGwgYXNcbiAgICAvLyBhcHBseWluZyBhcHByb3ByaWF0ZSBhcmlhLWhpZGRlbiB2YWx1ZSB0byBhIHNwZWNpZmllZCB0YXJnZXQuXG4gICAgLy8gVE9ETzogVGhlcmUgYXJlIGEgZmV3IHNpbWxhciB0b2dnbGVzIG9uIHRoZSBzaXRlIHRoYXQgY291bGQgYmVcbiAgICAvLyByZWZhY3RvcmVkIHRvIHVzZSB0aGlzIGNsYXNzLlxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2hyZWYnKSA/XG4gICAgICAgICQoJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2hyZWYnKSkgOlxuICAgICAgICAkKCQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCd0YXJnZXQnKSk7XG4gICAgJChlLmN1cnJlbnRUYXJnZXQpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkdGFyZ2V0LnRvZ2dsZUNsYXNzKCdhY3RpdmUgaGlkZGVuJylcbiAgICAgICAgLnByb3AoJ2FyaWEtaGlkZGVuJywgJHRhcmdldC5oYXNDbGFzcygnaGlkZGVuJykpO1xuICB9KS5vbignY2xpY2snLCAnLmpzLXNob3ctbmF2JywgZSA9PiB7XG4gICAgLy8gU2hvd3MgdGhlIG1vYmlsZSBuYXYgYnkgYXBwbHlpbmcgXCJuYXYtYWN0aXZlXCIgY2FzcyB0byB0aGUgYm9keS5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJChlLmRlbGVnYXRlVGFyZ2V0KS5hZGRDbGFzcygnbmF2LWFjdGl2ZScpO1xuICAgICQoJy5uYXYtb3ZlcmxheScpLnNob3coKTtcbiAgfSkub24oJ2NsaWNrJywgJy5qcy1oaWRlLW5hdicsIGUgPT4ge1xuICAgIC8vIEhpZGVzIHRoZSBtb2JpbGUgbmF2LlxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAkKCcubmF2LW92ZXJsYXknKS5oaWRlKCk7XG4gICAgJChlLmRlbGVnYXRlVGFyZ2V0KS5yZW1vdmVDbGFzcygnbmF2LWFjdGl2ZScpO1xuICB9KTtcbiAgLy8gRU5EIFRPRE9cblxufSkod2luZG93LCBqUXVlcnkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvdG9nZ2xlTWVudS5qcyJdLCJzb3VyY2VSb290IjoiIn0=
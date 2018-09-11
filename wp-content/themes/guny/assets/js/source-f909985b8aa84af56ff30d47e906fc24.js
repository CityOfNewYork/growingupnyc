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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__modules_formEffects_js__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__modules_facets_js__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__modules_owlSettings_js__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__modules_iOS7Hack_js__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__modules_share_form_js__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__modules_captchaResize_js__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__modules_rotatingTextAnimation_js__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__modules_search_js__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__modules_toggleOpen_js__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__modules_toggleMenu_js__ = __webpack_require__(78);








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
/**
* Validate a form and submit via the signup API
*/



/* harmony default export */ __webpack_exports__["a"] = (function () {
  var $signupForms = $('.guny-signup');
  var errorMsg = 'Please enter your email and zip code and select at least one age group.';

  /**
  * Validate form fields
  * @param {object} formData - form fields
  * @param {object} event - event object
  */
  function validateFields(formData, event) {

    event.preventDefault();

    var fields = formData.serializeArray().reduce(function (obj, item) {
      return obj[item.name] = item.value, obj;
    }, {});
    var requiredFields = formData.find('[required]');
    var emailRegex = new RegExp(/\S+@\S+\.\S+/);
    var zipRegex = new RegExp(/^\d{5}(-\d{4})?$/i);
    var ageSelected = Object.keys(fields).find(function (a) {
      return a.includes("group");
    }) ? true : false;
    var hasErrors = false;

    // loop through each required field
    requiredFields.each(function () {
      var fieldName = $(this).attr('name');
      $(this).removeClass('is-error');

      if (typeof fields[fieldName] === 'undefined' && !ageSelected) {
        hasErrors = true;
        $(this).addClass('is-error');
      }

      if (fieldName == "EMAIL" && !emailRegex.test(fields.EMAIL) || fieldName == "ZIP" && !zipRegex.test(fields.ZIP)) {
        hasErrors = true;
        $(this).addClass('is-error');
      }

      // assign the correct borough to good zip
      if (fieldName == "EMAIL" && emailRegex.test(fields.EMAIL)) {
        fields.BOROUGH = assignBorough(fields.ZIP);
      }
    });

    // if there are no errors, submit
    if (hasErrors) {
      formData.find('.guny-error').html('<p>' + errorMsg + '</p>');
    } else {
      event.preventDefault();
      submitSignup(fields);
    }
  }

  /**
  * Assigns the borough based on the zip code
  * @param {string} zip - zip code
  */
  function assignBorough(zip) {
    var borough = "";
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
  function submitSignup(formData) {
    $.ajax({
      url: $signupForms.attr('action'),
      type: $signupForms.attr('method'),
      dataType: 'json', //no jsonp
      cache: false,
      data: formData,
      contentType: "application/json; charset=utf-8",
      success: function success(response) {
        if (response.result !== 'success') {
          if (response.msg.includes('too many recent signup requests')) {
            $signupForms.find('.guny-error').html('<p>There was a problem with your subscription.</p>');
          } else if (response.msg.includes('already subscribed')) {
            $signupForms.find('.guny-error').html('<p>You are already signed up for updates! Check your email.</p>');
          }
        } else {
          $signupForms.html('<p class="c-signup-form__success">One more step! <br /> Please check your inbox and confirm your email address to start receiving updates. <br />Thanks for signing up!</p>');
        }
      },
      error: function error(response) {
        $signupForms.find('.guny-error').html('<p>There was a problem with your subscription. Check back later.</p>');
      }
    });
  }

  /**
  * Triggers form validation and sends the form data to Mailchimp
  * @param {object} formData - form fields
  */
  if ($signupForms.length) {
    $signupForms.find('[type="submit"]').click(function (event) {
      validateFields($signupForms, event);
    });
  }
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = [{"borough":"Bronx","codes":[10451,10452,10453,10454,10455,10456,10457,10458,10459,10460,10461,10462,10463,10464,10465,10466,10467,10468,10469,10470,10471,10472,10473,10474,10475]},{"borough":"Brooklyn","codes":[11201,11202,11203,11204,11205,11206,11207,11208,11209,11210,11211,11212,11213,11214,11215,11216,11217,11218,11219,11220,11221,11222,11223,11224,11225,11226,11228,11229,11230,11231,11232,11233,11234,11235,11236,11237,11238,11239,11241,11242,11243,11245,11247,11249,11251,11252,11256]},{"borough":"Manhattan","codes":[10001,10002,10003,10004,10005,10006,10007,10008,10009,10010,10011,10012,10013,10014,10016,10017,10018,10019,10020,10021,10022,10023,10024,10025,10027,10028,10029,10030,10031,10032,10033,10034,10035,10036,10037,10038,10039,10040,10041,10045,10055,10081,10087,10101,10103,10104,10105,10106,10107,10108,10109,10110,10111,10112,10113,10114,10115,10116,10118,10119,10120,10121,10122,10123,10128,10150,10151,10152,10153,10154,10155,10156,10158,10159,10162,10165,10166,10167,10168,10169,10170,10171,10172,10173,10174,10175,10176,10177,10178,10185,10199,10212,10249,10256,10259,10261,10268,10270,10271,10276,10278,10279,10280,10281,10282,10286]},{"borough":"Queens","codes":[11101,11102,11103,11104,11106,11109,11120,11351,11352,11354,11355,11356,11357,11358,11359,11360,11361,11362,11363,11364,11365,11366,11367,11368,11369,11370,11371,11372,11373,11374,11375,11377,11378,11379,11380,11381,11385,11386,11405,11411,11413,11414,11415,11416,11417,11418,11419,11420,11421,11422,11423,11424,11425,11426,11427,11428,11429,11430,11431,11432,11433,11434,11435,11436,11439,11451,11690,11691,11692,11693,11694,11695,11697]},{"borough":"Staten Island","codes":[10301,10302,10303,10304,10305,10306,10307,10308,10309,10310,10311,10312,10313,10314]}]

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_forEach__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dispatchEvent_js__ = __webpack_require__(63);
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
/* 63 */
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
/* 64 */
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
/* 65 */
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
/* 66 */
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
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_cookie__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_cookie___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_cookie__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vendor_utility_js__ = __webpack_require__(69);
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
/* 68 */
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
/* 69 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDg5Nzg5MmFhZDYzN2E2ZmY1MDkiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwialF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mb3JFYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZGF0YXNldC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tYWluLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2FjY29yZGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvck93bi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VGb3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNQcm90b3R5cGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRWFjaC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0RnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9zaW1wbGVBY2NvcmRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvb2ZmY2FudmFzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL292ZXJsYXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc3RpY2tOYXYuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90aHJvdHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL25vdy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTeW1ib2wuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ltYWdlc3JlYWR5L2Rpc3QvaW1hZ2VzcmVhZHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc2VjdGlvbkhpZ2hsaWdodGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3N0YXRpY0NvbHVtbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9hbGVydC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9yZWFkQ29va2llLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2NyZWF0ZUNvb2tpZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9nZXREb21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvbmV3c2xldHRlci1zaWdudXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZGF0YS96aXBjb2Rlcy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2Zvcm1FZmZlY3RzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2Rpc3BhdGNoRXZlbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvZmFjZXRzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL293bFNldHRpbmdzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL2lPUzdIYWNrLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3NoYXJlLWZvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2pzLWNvb2tpZS9zcmMvanMuY29va2llLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy92ZW5kb3IvdXRpbGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2xlYXZlLmpzL2Rpc3QvY2xlYXZlLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY2xlYXZlLmpzL2Rpc3QvYWRkb25zL2NsZWF2ZS1waG9uZS51cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmFyaWFibGVzLmpzb24iLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvY2FwdGNoYVJlc2l6ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy9yb3RhdGluZ1RleHRBbmltYXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvc2VhcmNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9taXNzLXBsZXRlLWpzL2Rpc3QvYnVuZGxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU9wZW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvdG9nZ2xlTWVudS5qcyJdLCJuYW1lcyI6WyJlbGVtIiwiYXR0ciIsImRhdGFzZXQiLCJnZXRBdHRyaWJ1dGUiLCJyZWFkeSIsImZuIiwiZG9jdW1lbnQiLCJyZWFkeVN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImluaXQiLCJ0b2dnbGVPcGVuIiwiYWxlcnQiLCJvZmZjYW52YXMiLCJhY2NvcmRpb24iLCJzaW1wbGVBY2NvcmRpb24iLCJvdmVybGF5IiwiZmFjZXRzIiwic3RhdGljQ29sdW1uIiwic3RpY2tOYXYiLCJndW55U2lnbnVwIiwiZm9ybUVmZmVjdHMiLCJvd2xTZXR0aW5ncyIsImlPUzdIYWNrIiwiY2FwdGNoYVJlc2l6ZSIsInJvdGF0aW5nVGV4dEFuaW1hdGlvbiIsInNlY3Rpb25IaWdobGlnaHRlciIsIndpbmRvdyIsIiQiLCJTaGFyZUZvcm0iLCJDc3NDbGFzcyIsIkZPUk0iLCJlYWNoIiwiaSIsImVsIiwic2hhcmVGb3JtIiwialF1ZXJ5IiwiY29udmVydEhlYWRlclRvQnV0dG9uIiwiJGhlYWRlckVsZW0iLCJnZXQiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiaGVhZGVyRWxlbSIsIm5ld0hlYWRlckVsZW0iLCJjcmVhdGVFbGVtZW50IiwiZm9yRWFjaCIsImF0dHJpYnV0ZXMiLCJzZXRBdHRyaWJ1dGUiLCJub2RlVmFsdWUiLCIkbmV3SGVhZGVyRWxlbSIsImh0bWwiLCJhcHBlbmQiLCJ0b2dnbGVIZWFkZXIiLCJtYWtlVmlzaWJsZSIsImluaXRpYWxpemVIZWFkZXIiLCIkcmVsYXRlZFBhbmVsIiwiaWQiLCJhZGRDbGFzcyIsIm9uIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInRyaWdnZXIiLCJibHVyIiwidG9nZ2xlUGFuZWwiLCIkcGFuZWxFbGVtIiwiY3NzIiwiZGF0YSIsImZpbmQiLCJpbml0aWFsaXplUGFuZWwiLCJsYWJlbGxlZGJ5IiwiY2FsY3VsYXRlUGFuZWxIZWlnaHQiLCJoZWlnaHQiLCJ0b2dnbGVBY2NvcmRpb25JdGVtIiwiJGl0ZW0iLCJyZW1vdmVDbGFzcyIsImluaXRpYWxpemVBY2NvcmRpb25JdGVtIiwiJGFjY29yZGlvbkNvbnRlbnQiLCIkYWNjb3JkaW9uSW5pdGlhbEhlYWRlciIsIm9mZiIsImxlbmd0aCIsIiRhY2NvcmRpb25IZWFkZXIiLCJ0YWdOYW1lIiwicmVwbGFjZVdpdGgiLCJpbml0aWFsaXplIiwiJGFjY29yZGlvbkVsZW0iLCJtdWx0aVNlbGVjdGFibGUiLCJjaGlsZHJlbiIsInByb3h5IiwiJG5ld0l0ZW0iLCJ0YXJnZXQiLCJjbG9zZXN0IiwiaGFzQ2xhc3MiLCIkb3Blbkl0ZW0iLCJyZUluaXRpYWxpemUiLCJyZUluaXRpYWxpemVBY2NvcmRpb24iLCIkYWNjb3JkaW9ucyIsIm5vdCIsImNsaWNrIiwiY2hlY2tFbGVtZW50IiwibmV4dCIsImlzIiwic2xpZGVVcCIsInNsaWRlRG93biIsIm9mZkNhbnZhcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvZmZDYW52YXNFbGVtIiwib2ZmQ2FudmFzU2lkZSIsInF1ZXJ5U2VsZWN0b3IiLCJkZXRhaWwiLCJ0ZXN0IiwidGFiSW5kZXgiLCJmb2N1cyIsIm92ZXJsYXlFbGVtIiwic3RpY2t5TmF2IiwiJGVsZW0iLCIkZWxlbUNvbnRhaW5lciIsIiRlbGVtQXJ0aWNsZSIsInNldHRpbmdzIiwic3RpY2t5Q2xhc3MiLCJhYnNvbHV0ZUNsYXNzIiwibGFyZ2VCcmVha3BvaW50IiwiYXJ0aWNsZUNsYXNzIiwic3RpY2t5TW9kZSIsImlzU3RpY2t5IiwiaXNBYnNvbHV0ZSIsInN3aXRjaFBvaW50Iiwic3dpdGNoUG9pbnRCb3R0b20iLCJsZWZ0T2Zmc2V0IiwiZWxlbVdpZHRoIiwiZWxlbUhlaWdodCIsInRvZ2dsZVN0aWNreSIsImN1cnJlbnRTY3JvbGxQb3MiLCJzY3JvbGxUb3AiLCJ1cGRhdGVEaW1lbnNpb25zIiwiaXNPblNjcmVlbiIsImZvcmNlQ2xlYXIiLCJsZWZ0Iiwid2lkdGgiLCJ0b3AiLCJib3R0b20iLCJzZXRPZmZzZXRWYWx1ZXMiLCJvZmZzZXQiLCJvdXRlckhlaWdodCIsInBhcnNlSW50Iiwib3V0ZXJXaWR0aCIsInN0aWNreU1vZGVPbiIsInRocm90dGxlIiwib3JpZ2luYWxFdmVudCIsInN0aWNreU1vZGVPZmYiLCJvblJlc2l6ZSIsImxhcmdlTW9kZSIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwiZGVib3VuY2UiLCJpbWFnZXNSZWFkeSIsImJvZHkiLCJ0aGVuIiwid2luIiwidmlld3BvcnQiLCJzY3JvbGxMZWZ0IiwicmlnaHQiLCJib3VuZHMiLCIkc3RpY2t5TmF2cyIsIiRvdXRlckNvbnRhaW5lciIsIiRhcnRpY2xlIiwiJG5hdmlnYXRpb25MaW5rcyIsIiRzZWN0aW9ucyIsIiRzZWN0aW9uc1JldmVyc2VkIiwicmV2ZXJzZSIsInNlY3Rpb25JZFRvbmF2aWdhdGlvbkxpbmsiLCJvcHRpbWl6ZWQiLCJzY3JvbGxQb3NpdGlvbiIsImN1cnJlbnRTZWN0aW9uIiwic2VjdGlvblRvcCIsIiRuYXZpZ2F0aW9uTGluayIsInNjcm9sbCIsInN0aWNreUNvbnRlbnQiLCJub3RTdGlja3lDbGFzcyIsImJvdHRvbUNsYXNzIiwiY2FsY1dpbmRvd1BvcyIsInN0aWNreUNvbnRlbnRFbGVtIiwiZWxlbVRvcCIsInBhcmVudEVsZW1lbnQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJpc1Bhc3RCb3R0b20iLCJpbm5lckhlaWdodCIsImNsaWVudEhlaWdodCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsIm9wZW5DbGFzcyIsImRpc3BsYXlBbGVydCIsInNpYmxpbmdFbGVtIiwiYWxlcnRIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJjdXJyZW50UGFkZGluZyIsImdldENvbXB1dGVkU3R5bGUiLCJnZXRQcm9wZXJ0eVZhbHVlIiwic3R5bGUiLCJwYWRkaW5nQm90dG9tIiwicmVtb3ZlQWxlcnRQYWRkaW5nIiwiY2hlY2tBbGVydENvb2tpZSIsImNvb2tpZU5hbWUiLCJyZWFkQ29va2llIiwiY29va2llIiwiYWRkQWxlcnRDb29raWUiLCJjcmVhdGVDb29raWUiLCJnZXREb21haW4iLCJsb2NhdGlvbiIsImFsZXJ0cyIsImFsZXJ0U2libGluZyIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJSZWdFeHAiLCJleGVjIiwicG9wIiwibmFtZSIsInZhbHVlIiwiZG9tYWluIiwiZGF5cyIsImV4cGlyZXMiLCJEYXRlIiwiZ2V0VGltZSIsInRvR01UU3RyaW5nIiwidXJsIiwicm9vdCIsInBhcnNlVXJsIiwiaHJlZiIsImhvc3RuYW1lIiwic2xpY2UiLCJtYXRjaCIsInNwbGl0Iiwiam9pbiIsIiRzaWdudXBGb3JtcyIsImVycm9yTXNnIiwidmFsaWRhdGVGaWVsZHMiLCJmb3JtRGF0YSIsImZpZWxkcyIsInNlcmlhbGl6ZUFycmF5IiwicmVkdWNlIiwib2JqIiwiaXRlbSIsInJlcXVpcmVkRmllbGRzIiwiZW1haWxSZWdleCIsInppcFJlZ2V4IiwiYWdlU2VsZWN0ZWQiLCJPYmplY3QiLCJrZXlzIiwiYSIsImluY2x1ZGVzIiwiaGFzRXJyb3JzIiwiZmllbGROYW1lIiwiRU1BSUwiLCJaSVAiLCJCT1JPVUdIIiwiYXNzaWduQm9yb3VnaCIsInN1Ym1pdFNpZ251cCIsInppcCIsImJvcm91Z2giLCJpbmRleCIsInppcGNvZGVzIiwiZmluZEluZGV4IiwieCIsImNvZGVzIiwiaW5kZXhPZiIsImFqYXgiLCJ0eXBlIiwiZGF0YVR5cGUiLCJjYWNoZSIsImNvbnRlbnRUeXBlIiwic3VjY2VzcyIsInJlc3BvbnNlIiwicmVzdWx0IiwibXNnIiwiZXJyb3IiLCJoYW5kbGVGb2N1cyIsIndyYXBwZXJFbGVtIiwicGFyZW50Tm9kZSIsImhhbmRsZUJsdXIiLCJ0cmltIiwiaW5wdXRzIiwiaW5wdXRFbGVtIiwiZGlzcGF0Y2hFdmVudCIsImV2ZW50VHlwZSIsImNyZWF0ZUV2ZW50IiwiaW5pdEV2ZW50IiwiY3JlYXRlRXZlbnRPYmplY3QiLCJmaXJlRXZlbnQiLCJvd2wiLCJvd2xDYXJvdXNlbCIsImFuaW1hdGVJbiIsImFuaW1hdGVPdXQiLCJpdGVtcyIsImxvb3AiLCJtYXJnaW4iLCJkb3RzIiwiYXV0b3BsYXkiLCJhdXRvcGxheVRpbWVvdXQiLCJhdXRvcGxheUhvdmVyUGF1c2UiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJzY3JvbGxUbyIsIlZhcmlhYmxlcyIsInJlcXVpcmUiLCJfZWwiLCJfaXNWYWxpZCIsIl9pc0J1c3kiLCJfaXNEaXNhYmxlZCIsIl9pbml0aWFsaXplZCIsIl9yZWNhcHRjaGFSZXF1aXJlZCIsIl9yZWNhcHRjaGFWZXJpZmllZCIsIl9yZWNhcHRjaGFpbml0Iiwic2VsZWN0ZWQiLCJfbWFza1Bob25lIiwiU0hPV19ESVNDTEFJTUVSIiwiX2Rpc2NsYWltZXIiLCJlIiwiX3ZhbGlkYXRlIiwiX3N1Ym1pdCIsImdyZWNhcHRjaGEiLCJyZXNldCIsInBhcmVudHMiLCJFUlJPUl9NU0ciLCJfc2hvd0Vycm9yIiwiTWVzc2FnZSIsIlJFQ0FQVENIQSIsInZpZXdDb3VudCIsIkNvb2tpZXMiLCJfaW5pdFJlY2FwdGNoYSIsInNldCIsImZvY3Vzb3V0IiwicmVtb3ZlQXR0ciIsImlucHV0IiwiY2xlYXZlIiwicGhvbmUiLCJwaG9uZVJlZ2lvbkNvZGUiLCJkZWxpbWl0ZXIiLCJ2aXNpYmxlIiwiJGVsIiwiJGNsYXNzIiwiSElEREVOIiwiQU5JTUFURV9ESVNDTEFJTUVSIiwiaW5uZXJXaWR0aCIsIiR0YXJnZXQiLCJ2YWxpZGl0eSIsIiR0ZWwiLCJfdmFsaWRhdGVQaG9uZU51bWJlciIsIkVSUk9SIiwibnVtIiwiX3BhcnNlUGhvbmVOdW1iZXIiLCJQSE9ORSIsInZhbCIsIlJFUVVJUkVEIiwib25lIiwiJGVsUGFyZW50cyIsInRleHQiLCJVdGlsaXR5IiwibG9jYWxpemUiLCJTVUNDRVNTIiwiJHNwaW5uZXIiLCJTUElOTkVSIiwiJHN1Ym1pdCIsInBheWxvYWQiLCJzZXJpYWxpemUiLCJwcm9wIiwiZGlzYWJsZWQiLCJjc3NUZXh0IiwicG9zdCIsImRvbmUiLCJfc2hvd1N1Y2Nlc3MiLCJKU09OIiwic3RyaW5naWZ5IiwibWVzc2FnZSIsImZhaWwiLCJTRVJWRVIiLCJhbHdheXMiLCIkc2NyaXB0IiwiYXN5bmMiLCJkZWZlciIsInNjcmVlbmVyQ2FsbGJhY2siLCJyZW5kZXIiLCJnZXRFbGVtZW50QnlJZCIsInNjcmVlbmVyUmVjYXB0Y2hhIiwic2NyZWVuZXJSZWNhcHRjaGFSZXNldCIsIk5FRURTX0RJU0NMQUlNRVIiLCJTVUJNSVRfQlROIiwiZ2V0VXJsUGFyYW1ldGVyIiwicXVlcnlTdHJpbmciLCJxdWVyeSIsInNlYXJjaCIsInBhcmFtIiwicmVwbGFjZSIsInJlZ2V4IiwicmVzdWx0cyIsImRlY29kZVVSSUNvbXBvbmVudCIsImZpbmRWYWx1ZXMiLCJvYmplY3QiLCJ0YXJnZXRQcm9wIiwidHJhdmVyc2VPYmplY3QiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsInB1c2giLCJ0b0RvbGxhckFtb3VudCIsIk1hdGgiLCJhYnMiLCJyb3VuZCIsInBhcnNlRmxvYXQiLCJ0b0ZpeGVkIiwic2x1Z05hbWUiLCJsb2NhbGl6ZWRTdHJpbmdzIiwiTE9DQUxJWkVEX1NUUklOR1MiLCJfIiwiZmluZFdoZXJlIiwic2x1ZyIsImxhYmVsIiwiaXNWYWxpZEVtYWlsIiwiZW1haWwiLCJjaGVja1ZhbGlkaXR5IiwiQ09ORklHIiwiREVGQVVMVF9MQVQiLCJERUZBVUxUX0xORyIsIkdPT0dMRV9BUEkiLCJHT09HTEVfU1RBVElDX0FQSSIsIkdSRUNBUFRDSEFfU0lURV9LRVkiLCJTQ1JFRU5FUl9NQVhfSE9VU0VIT0xEIiwiVVJMX1BJTl9CTFVFIiwiVVJMX1BJTl9CTFVFXzJYIiwiVVJMX1BJTl9HUkVFTiIsIlVSTF9QSU5fR1JFRU5fMlgiLCJzY2FsZUNhcHRjaGEiLCJyZUNhcHRjaGFXaWR0aCIsImNvbnRhaW5lcldpZHRoIiwiY2FwdGNoYVNjYWxlIiwidHJhbnNmb3JtIiwicmVzaXplIiwidGVybXMiLCJyb3RhdGVUZXJtIiwiY3QiLCJmYWRlSW4iLCJkZWxheSIsImZhZGVPdXQiLCJTZWFyY2giLCJfaW5wdXRzIiwic2VsZWN0b3JzIiwiTUFJTiIsIl9zdWdnZXN0aW9ucyIsInBhcnNlIiwianNTZWFyY2hTdWdnZXN0aW9ucyIsIl9NaXNzUGxldGUiLCJvcHRpb25zIiwiY2xhc3NOYW1lIiwianNTZWFyY2hEcm9wZG93bkNsYXNzIiwibGlua0FjdGl2ZUNsYXNzIiwidG9nZ2xlRWxlbXMiLCJ0b2dnbGVFbGVtIiwidGFyZ2V0RWxlbVNlbGVjdG9yIiwidGFyZ2V0RWxlbSIsInRvZ2dsZUV2ZW50IiwidG9nZ2xlQ2xhc3MiLCJ0b2dnbGUiLCJjb250YWlucyIsIkN1c3RvbUV2ZW50IiwiaW5pdEN1c3RvbUV2ZW50IiwiY3VycmVudFRhcmdldCIsImRlbGVnYXRlVGFyZ2V0Iiwic2hvdyIsImhpZGUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQSx3Qjs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLDhCQUE4QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsZ0JBQWdCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGdCQUFnQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsWUFBWTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsWUFBWTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsZ0JBQWdCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BELEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCxZQUFZO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxZQUFZO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsWUFBWTtBQUMxRDtBQUNBO0FBQ0EscUJBQXFCLGdCQUFnQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsZ0JBQWdCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsWUFBWTtBQUN6RDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSw4QkFBOEI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQywwQkFBMEI7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEscUJBQXFCLGNBQWM7QUFDbkM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFlBQVk7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxZQUFZO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxlQUFlO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLGVBQWU7QUFDcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixZQUFZO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBLHlCQUF5QixnQkFBZ0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsWUFBWTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsWUFBWTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsNENBQTRDLG1CQUFtQjtBQUMvRDtBQUNBO0FBQ0EseUNBQXlDLFlBQVk7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixZQUFZO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZFQUE2RTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtB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OztBQUVBOzs7Ozs7O0FDckJBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ2pCQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDckJBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzFCQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNqRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozt5Q0M1QkE7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRSxrQkFBa0I7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsb0JBQW9CO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscURBQXFELGNBQWM7QUFDbkU7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFD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WixFQWpCSCxDQWlCTSxPQWpCTixFQWlCZSxjQWpCZixFQWlCK0IsYUFBSztBQUNsQztBQUNBaVEsTUFBRS9QLGNBQUY7QUFDQWhDLE1BQUUsY0FBRixFQUFrQnFiLElBQWxCO0FBQ0FyYixNQUFFK1IsRUFBRW9KLGNBQUosRUFBb0JyWSxXQUFwQixDQUFnQyxZQUFoQztBQUNELEdBdEJEO0FBdUJBO0FBRUQsQ0E3QkQsRUE2QkcvQyxNQTdCSCxFQTZCVyw4Q0E3QlgsRSIsImZpbGUiOiIwODk3ODkyYWFkNjM3YTZmZjUwOS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDE2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwODk3ODkyYWFkNjM3YTZmZjUwOSIsIm1vZHVsZS5leHBvcnRzID0galF1ZXJ5O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwialF1ZXJ5XCJcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKSxcbiAgICBjYXN0RnVuY3Rpb24gPSByZXF1aXJlKCcuL19jYXN0RnVuY3Rpb24nKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIlxuICogcHJvcGVydHkgYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIHVzZSBgXy5mb3JJbmBcbiAqIG9yIGBfLmZvck93bmAgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNlZSBfLmZvckVhY2hSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZvckVhY2goWzEsIDJdLCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgYDFgIHRoZW4gYDJgLlxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAqICAgY29uc29sZS5sb2coa2V5KTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyAnYScgdGhlbiAnYicgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCkuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlFYWNoIDogYmFzZUVhY2g7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGNhc3RGdW5jdGlvbihpdGVyYXRlZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgZ2V0UmF3VGFnID0gcmVxdWlyZSgnLi9fZ2V0UmF3VGFnJyksXG4gICAgb2JqZWN0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19vYmplY3RUb1N0cmluZycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0VGFnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZyZWVHbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XHJcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xyXG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblx0XHRpZighbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gbW9kdWxlO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2UuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBub3cgPSByZXF1aXJlKCcuL25vdycpLFxuICAgIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2RlYm91bmNlLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiogVXRpbGl0eSBtb2R1bGUgdG8gZ2V0IHZhbHVlIG9mIGEgZGF0YSBhdHRyaWJ1dGVcbiogQHBhcmFtIHtvYmplY3R9IGVsZW0gLSBET00gbm9kZSBhdHRyaWJ1dGUgaXMgcmV0cmlldmVkIGZyb21cbiogQHBhcmFtIHtzdHJpbmd9IGF0dHIgLSBBdHRyaWJ1dGUgbmFtZSAoZG8gbm90IGluY2x1ZGUgdGhlICdkYXRhLScgcGFydClcbiogQHJldHVybiB7bWl4ZWR9IC0gVmFsdWUgb2YgZWxlbWVudCdzIGRhdGEgYXR0cmlidXRlXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZWxlbSwgYXR0cikge1xuICBpZiAodHlwZW9mIGVsZW0uZGF0YXNldCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGF0dHIpO1xuICB9XG4gIHJldHVybiBlbGVtLmRhdGFzZXRbYXR0cl07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9kYXRhc2V0LmpzIiwiLy8gICAgIFVuZGVyc2NvcmUuanMgMS44LjNcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGV4cG9ydHNgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIFNhdmUgYnl0ZXMgaW4gdGhlIG1pbmlmaWVkIChidXQgbm90IGd6aXBwZWQpIHZlcnNpb246XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIEZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuICAvLyBDcmVhdGUgcXVpY2sgcmVmZXJlbmNlIHZhcmlhYmxlcyBmb3Igc3BlZWQgYWNjZXNzIHRvIGNvcmUgcHJvdG90eXBlcy5cbiAgdmFyXG4gICAgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICBzbGljZSAgICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICB0b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZCxcbiAgICBuYXRpdmVDcmVhdGUgICAgICAgPSBPYmplY3QuY3JlYXRlO1xuXG4gIC8vIE5ha2VkIGZ1bmN0aW9uIHJlZmVyZW5jZSBmb3Igc3Vycm9nYXRlLXByb3RvdHlwZS1zd2FwcGluZy5cbiAgdmFyIEN0b3IgPSBmdW5jdGlvbigpe307XG5cbiAgLy8gQ3JlYXRlIGEgc2FmZSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciB1c2UgYmVsb3cuXG4gIHZhciBfID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIF8pIHJldHVybiBvYmo7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF8pKSByZXR1cm4gbmV3IF8ob2JqKTtcbiAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yICoqTm9kZS5qcyoqLCB3aXRoXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciB0aGUgb2xkIGByZXF1aXJlKClgIEFQSS4gSWYgd2UncmUgaW5cbiAgLy8gdGhlIGJyb3dzZXIsIGFkZCBgX2AgYXMgYSBnbG9iYWwgb2JqZWN0LlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjguMyc7XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVmZmljaWVudCAoZm9yIGN1cnJlbnQgZW5naW5lcykgdmVyc2lvblxuICAvLyBvZiB0aGUgcGFzc2VkLWluIGNhbGxiYWNrLCB0byBiZSByZXBlYXRlZGx5IGFwcGxpZWQgaW4gb3RoZXIgVW5kZXJzY29yZVxuICAvLyBmdW5jdGlvbnMuXG4gIHZhciBvcHRpbWl6ZUNiID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAoY29udGV4dCA9PT0gdm9pZCAwKSByZXR1cm4gZnVuYztcbiAgICBzd2l0Y2ggKGFyZ0NvdW50ID09IG51bGwgPyAzIDogYXJnQ291bnQpIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBvdGhlcik7XG4gICAgICB9O1xuICAgICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQSBtb3N0bHktaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgY2FsbGJhY2tzIHRoYXQgY2FuIGJlIGFwcGxpZWRcbiAgLy8gdG8gZWFjaCBlbGVtZW50IGluIGEgY29sbGVjdGlvbiwgcmV0dXJuaW5nIHRoZSBkZXNpcmVkIHJlc3VsdCDigJQgZWl0aGVyXG4gIC8vIGlkZW50aXR5LCBhbiBhcmJpdHJhcnkgY2FsbGJhY2ssIGEgcHJvcGVydHkgbWF0Y2hlciwgb3IgYSBwcm9wZXJ0eSBhY2Nlc3Nvci5cbiAgdmFyIGNiID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBfLmlkZW50aXR5O1xuICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSByZXR1cm4gb3B0aW1pemVDYih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpO1xuICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkgcmV0dXJuIF8ubWF0Y2hlcih2YWx1ZSk7XG4gICAgcmV0dXJuIF8ucHJvcGVydHkodmFsdWUpO1xuICB9O1xuICBfLml0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gY2IodmFsdWUsIGNvbnRleHQsIEluZmluaXR5KTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYXNzaWduZXIgZnVuY3Rpb25zLlxuICB2YXIgY3JlYXRlQXNzaWduZXIgPSBmdW5jdGlvbihrZXlzRnVuYywgdW5kZWZpbmVkT25seSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCA8IDIgfHwgb2JqID09IG51bGwpIHJldHVybiBvYmo7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdLFxuICAgICAgICAgICAga2V5cyA9IGtleXNGdW5jKHNvdXJjZSksXG4gICAgICAgICAgICBsID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKCF1bmRlZmluZWRPbmx5IHx8IG9ialtrZXldID09PSB2b2lkIDApIG9ialtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYSBuZXcgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSBhbm90aGVyLlxuICB2YXIgYmFzZUNyZWF0ZSA9IGZ1bmN0aW9uKHByb3RvdHlwZSkge1xuICAgIGlmICghXy5pc09iamVjdChwcm90b3R5cGUpKSByZXR1cm4ge307XG4gICAgaWYgKG5hdGl2ZUNyZWF0ZSkgcmV0dXJuIG5hdGl2ZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIEN0b3IucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIHZhciByZXN1bHQgPSBuZXcgQ3RvcjtcbiAgICBDdG9yLnByb3RvdHlwZSA9IG51bGw7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgcHJvcGVydHkgPSBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqID09IG51bGwgPyB2b2lkIDAgOiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEhlbHBlciBmb3IgY29sbGVjdGlvbiBtZXRob2RzIHRvIGRldGVybWluZSB3aGV0aGVyIGEgY29sbGVjdGlvblxuICAvLyBzaG91bGQgYmUgaXRlcmF0ZWQgYXMgYW4gYXJyYXkgb3IgYXMgYW4gb2JqZWN0XG4gIC8vIFJlbGF0ZWQ6IGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoXG4gIC8vIEF2b2lkcyBhIHZlcnkgbmFzdHkgaU9TIDggSklUIGJ1ZyBvbiBBUk0tNjQuICMyMDk0XG4gIHZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuICB2YXIgZ2V0TGVuZ3RoID0gcHJvcGVydHkoJ2xlbmd0aCcpO1xuICB2YXIgaXNBcnJheUxpa2UgPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPj0gMCAmJiBsZW5ndGggPD0gTUFYX0FSUkFZX0lOREVYO1xuICB9O1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgcmF3IG9iamVjdHMgaW4gYWRkaXRpb24gdG8gYXJyYXktbGlrZXMuIFRyZWF0cyBhbGxcbiAgLy8gc3BhcnNlIGFycmF5LWxpa2VzIGFzIGlmIHRoZXkgd2VyZSBkZW5zZS5cbiAgXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGksIGxlbmd0aDtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtpXSwgaSwgb2JqKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50LlxuICBfLm1hcCA9IF8uY29sbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0cyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIHJlc3VsdHNbaW5kZXhdID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDcmVhdGUgYSByZWR1Y2luZyBmdW5jdGlvbiBpdGVyYXRpbmcgbGVmdCBvciByaWdodC5cbiAgZnVuY3Rpb24gY3JlYXRlUmVkdWNlKGRpcikge1xuICAgIC8vIE9wdGltaXplZCBpdGVyYXRvciBmdW5jdGlvbiBhcyB1c2luZyBhcmd1bWVudHMubGVuZ3RoXG4gICAgLy8gaW4gdGhlIG1haW4gZnVuY3Rpb24gd2lsbCBkZW9wdGltaXplIHRoZSwgc2VlICMxOTkxLlxuICAgIGZ1bmN0aW9uIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpIHtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdGVlKG1lbW8sIG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDQpO1xuICAgICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgICBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIC8vIERldGVybWluZSB0aGUgaW5pdGlhbCB2YWx1ZSBpZiBub25lIGlzIHByb3ZpZGVkLlxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIG1lbW8gPSBvYmpba2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBkaXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBjcmVhdGVSZWR1Y2UoMSk7XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gY3JlYXRlUmVkdWNlKC0xKTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIga2V5O1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBrZXkgPSBfLmZpbmRJbmRleChvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IF8uZmluZEtleShvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfVxuICAgIGlmIChrZXkgIT09IHZvaWQgMCAmJiBrZXkgIT09IC0xKSByZXR1cm4gb2JqW2tleV07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIF8ucmVqZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm5lZ2F0ZShjYihwcmVkaWNhdGUpKSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKCFwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiBpdGVtICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVzYCBhbmQgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlcyA9IF8uaW5jbHVkZSA9IGZ1bmN0aW9uKG9iaiwgaXRlbSwgZnJvbUluZGV4LCBndWFyZCkge1xuICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICBpZiAodHlwZW9mIGZyb21JbmRleCAhPSAnbnVtYmVyJyB8fCBndWFyZCkgZnJvbUluZGV4ID0gMDtcbiAgICByZXR1cm4gXy5pbmRleE9mKG9iaiwgaXRlbSwgZnJvbUluZGV4KSA+PSAwO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGlzRnVuYyA9IF8uaXNGdW5jdGlvbihtZXRob2QpO1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgZnVuYyA9IGlzRnVuYyA/IG1ldGhvZCA6IHZhbHVlW21ldGhvZF07XG4gICAgICByZXR1cm4gZnVuYyA9PSBudWxsID8gZnVuYyA6IGZ1bmMuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYG1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIF8ucGx1Y2sgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBfLm1hcChvYmosIF8ucHJvcGVydHkoa2V5KSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmluZChvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlID4gcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IC1JbmZpbml0eSAmJiByZXN1bHQgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWluID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBJbmZpbml0eSwgbGFzdENvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPCByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA8IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gSW5maW5pdHkgJiYgcmVzdWx0ID09PSBJbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGEgY29sbGVjdGlvbiwgdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBzZXQgPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gc2V0Lmxlbmd0aDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgcmFuZDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbSgwLCBpbmRleCk7XG4gICAgICBpZiAocmFuZCAhPT0gaW5kZXgpIHNodWZmbGVkW2luZGV4XSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSBzZXRbaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gU2FtcGxlICoqbioqIHJhbmRvbSB2YWx1ZXMgZnJvbSBhIGNvbGxlY3Rpb24uXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYG1hcGAuXG4gIF8uc2FtcGxlID0gZnVuY3Rpb24ob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICAgIHJldHVybiBvYmpbXy5yYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uc2h1ZmZsZShvYmopLnNsaWNlKDAsIE1hdGgubWF4KDAsIG4pKTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0ZWUuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCAtIHJpZ2h0LmluZGV4O1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKGJlaGF2aW9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBrZXkgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICAgIGJlaGF2aW9yKHJlc3VsdCwgdmFsdWUsIGtleSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBHcm91cHMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbi4gUGFzcyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlXG4gIC8vIHRvIGdyb3VwIGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3JpdGVyaW9uLlxuICBfLmdyb3VwQnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XS5wdXNoKHZhbHVlKTsgZWxzZSByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0rKzsgZWxzZSByZXN1bHRba2V5XSA9IDE7XG4gIH0pO1xuXG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIF8udG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iaikgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIFNwbGl0IGEgY29sbGVjdGlvbiBpbnRvIHR3byBhcnJheXM6IG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgc2F0aXNmeSB0aGUgZ2l2ZW5cbiAgLy8gcHJlZGljYXRlLCBhbmQgb25lIHdob3NlIGVsZW1lbnRzIGFsbCBkbyBub3Qgc2F0aXNmeSB0aGUgcHJlZGljYXRlLlxuICBfLnBhcnRpdGlvbiA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgcGFzcyA9IFtdLCBmYWlsID0gW107XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7XG4gICAgICAocHJlZGljYXRlKHZhbHVlLCBrZXksIG9iaikgPyBwYXNzIDogZmFpbCkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtwYXNzLCBmYWlsXTtcbiAgfTtcblxuICAvLyBBcnJheSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYGhlYWRgIGFuZCBgdGFrZWAuIFRoZSAqKmd1YXJkKiogY2hlY2tcbiAgLy8gYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gXy50YWtlID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIHJldHVybiBfLmluaXRpYWwoYXJyYXksIGFycmF5Lmxlbmd0aCAtIG4pO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gKG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKSkpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBfLnJlc3QoYXJyYXksIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIG4pKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIHN0cmljdCwgc3RhcnRJbmRleCkge1xuICAgIHZhciBvdXRwdXQgPSBbXSwgaWR4ID0gMDtcbiAgICBmb3IgKHZhciBpID0gc3RhcnRJbmRleCB8fCAwLCBsZW5ndGggPSBnZXRMZW5ndGgoaW5wdXQpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGlucHV0W2ldO1xuICAgICAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJiAoXy5pc0FycmF5KHZhbHVlKSB8fCBfLmlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICAgICAgLy9mbGF0dGVuIGN1cnJlbnQgbGV2ZWwgb2YgYXJyYXkgb3IgYXJndW1lbnRzIG9iamVjdFxuICAgICAgICBpZiAoIXNoYWxsb3cpIHZhbHVlID0gZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgc3RyaWN0KTtcbiAgICAgICAgdmFyIGogPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgIG91dHB1dC5sZW5ndGggKz0gbGVuO1xuICAgICAgICB3aGlsZSAoaiA8IGxlbikge1xuICAgICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZVtqKytdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFzdHJpY3QpIHtcbiAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIEZsYXR0ZW4gb3V0IGFuIGFycmF5LCBlaXRoZXIgcmVjdXJzaXZlbHkgKGJ5IGRlZmF1bHQpLCBvciBqdXN0IG9uZSBsZXZlbC5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgZmFsc2UpO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoIV8uaXNCb29sZWFuKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdGVlO1xuICAgICAgaXRlcmF0ZWUgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpdGVyYXRlZSAhPSBudWxsKSBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXSxcbiAgICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUsIGksIGFycmF5KSA6IHZhbHVlO1xuICAgICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICAgIGlmICghaSB8fCBzZWVuICE9PSBjb21wdXRlZCkgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICBzZWVuID0gY29tcHV0ZWQ7XG4gICAgICB9IGVsc2UgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhzZWVuLCBjb21wdXRlZCkpIHtcbiAgICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghXy5jb250YWlucyhyZXN1bHQsIHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGl0ZW0gPSBhcnJheVtpXTtcbiAgICAgIGlmIChfLmNvbnRhaW5zKHJlc3VsdCwgaXRlbSkpIGNvbnRpbnVlO1xuICAgICAgZm9yICh2YXIgaiA9IDE7IGogPCBhcmdzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKGFyZ3VtZW50c1tqXSwgaXRlbSkpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKGogPT09IGFyZ3NMZW5ndGgpIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFRha2UgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBvbmUgYXJyYXkgYW5kIGEgbnVtYmVyIG9mIG90aGVyIGFycmF5cy5cbiAgLy8gT25seSB0aGUgZWxlbWVudHMgcHJlc2VudCBpbiBqdXN0IHRoZSBmaXJzdCBhcnJheSB3aWxsIHJlbWFpbi5cbiAgXy5kaWZmZXJlbmNlID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IGZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bnppcChhcmd1bWVudHMpO1xuICB9O1xuXG4gIC8vIENvbXBsZW1lbnQgb2YgXy56aXAuIFVuemlwIGFjY2VwdHMgYW4gYXJyYXkgb2YgYXJyYXlzIGFuZCBncm91cHNcbiAgLy8gZWFjaCBhcnJheSdzIGVsZW1lbnRzIG9uIHNoYXJlZCBpbmRpY2VzXG4gIF8udW56aXAgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSAmJiBfLm1heChhcnJheSwgZ2V0TGVuZ3RoKS5sZW5ndGggfHwgMDtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBfLnBsdWNrKGFycmF5LCBpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGxpc3QpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBmaW5kSW5kZXggYW5kIGZpbmRMYXN0SW5kZXggZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKGRpcikge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgdmFyIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICB2YXIgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSByZXR1cm4gaW5kZXg7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGluZGV4IG9uIGFuIGFycmF5LWxpa2UgdGhhdCBwYXNzZXMgYSBwcmVkaWNhdGUgdGVzdFxuICBfLmZpbmRJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKDEpO1xuICBfLmZpbmRMYXN0SW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigtMSk7XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdGVlKG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gTWF0aC5mbG9vcigobG93ICsgaGlnaCkgLyAyKTtcbiAgICAgIGlmIChpdGVyYXRlZShhcnJheVttaWRdKSA8IHZhbHVlKSBsb3cgPSBtaWQgKyAxOyBlbHNlIGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgaW5kZXhPZiBhbmQgbGFzdEluZGV4T2YgZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZUluZGV4RmluZGVyKGRpciwgcHJlZGljYXRlRmluZCwgc29ydGVkSW5kZXgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlkeCkge1xuICAgICAgdmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgaWYgKHR5cGVvZiBpZHggPT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKGRpciA+IDApIHtcbiAgICAgICAgICAgIGkgPSBpZHggPj0gMCA/IGlkeCA6IE1hdGgubWF4KGlkeCArIGxlbmd0aCwgaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZW5ndGggPSBpZHggPj0gMCA/IE1hdGgubWluKGlkeCArIDEsIGxlbmd0aCkgOiBpZHggKyBsZW5ndGggKyAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNvcnRlZEluZGV4ICYmIGlkeCAmJiBsZW5ndGgpIHtcbiAgICAgICAgaWR4ID0gc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaWR4XSA9PT0gaXRlbSA/IGlkeCA6IC0xO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0gIT09IGl0ZW0pIHtcbiAgICAgICAgaWR4ID0gcHJlZGljYXRlRmluZChzbGljZS5jYWxsKGFycmF5LCBpLCBsZW5ndGgpLCBfLmlzTmFOKTtcbiAgICAgICAgcmV0dXJuIGlkeCA+PSAwID8gaWR4ICsgaSA6IC0xO1xuICAgICAgfVxuICAgICAgZm9yIChpZHggPSBkaXIgPiAwID8gaSA6IGxlbmd0aCAtIDE7IGlkeCA+PSAwICYmIGlkeCA8IGxlbmd0aDsgaWR4ICs9IGRpcikge1xuICAgICAgICBpZiAoYXJyYXlbaWR4XSA9PT0gaXRlbSkgcmV0dXJuIGlkeDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhbiBpdGVtIGluIGFuIGFycmF5LFxuICAvLyBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgXy5pbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoMSwgXy5maW5kSW5kZXgsIF8uc29ydGVkSW5kZXgpO1xuICBfLmxhc3RJbmRleE9mID0gY3JlYXRlSW5kZXhGaW5kZXIoLTEsIF8uZmluZExhc3RJbmRleCk7XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoc3RvcCA9PSBudWxsKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IHN0ZXAgfHwgMTtcblxuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIHJhbmdlID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxlbmd0aDsgaWR4KyssIHN0YXJ0ICs9IHN0ZXApIHtcbiAgICAgIHJhbmdlW2lkeF0gPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZXhlY3V0ZSBhIGZ1bmN0aW9uIGFzIGEgY29uc3RydWN0b3JcbiAgLy8gb3IgYSBub3JtYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnRzXG4gIHZhciBleGVjdXRlQm91bmQgPSBmdW5jdGlvbihzb3VyY2VGdW5jLCBib3VuZEZ1bmMsIGNvbnRleHQsIGNhbGxpbmdDb250ZXh0LCBhcmdzKSB7XG4gICAgaWYgKCEoY2FsbGluZ0NvbnRleHQgaW5zdGFuY2VvZiBib3VuZEZ1bmMpKSByZXR1cm4gc291cmNlRnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB2YXIgc2VsZiA9IGJhc2VDcmVhdGUoc291cmNlRnVuYy5wcm90b3R5cGUpO1xuICAgIHZhciByZXN1bHQgPSBzb3VyY2VGdW5jLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIGlmIChfLmlzT2JqZWN0KHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICBfLmJpbmQgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdCaW5kIG11c3QgYmUgY2FsbGVkIG9uIGEgZnVuY3Rpb24nKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIGNvbnRleHQsIHRoaXMsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuIF8gYWN0c1xuICAvLyBhcyBhIHBsYWNlaG9sZGVyLCBhbGxvd2luZyBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzIHRvIGJlIHByZS1maWxsZWQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYm91bmRBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMCwgbGVuZ3RoID0gYm91bmRBcmdzLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkobGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJnc1tpXSA9IGJvdW5kQXJnc1tpXSA9PT0gXyA/IGFyZ3VtZW50c1twb3NpdGlvbisrXSA6IGJvdW5kQXJnc1tpXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgdGhpcywgdGhpcywgYXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gQmluZCBhIG51bWJlciBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBSZW1haW5pbmcgYXJndW1lbnRzXG4gIC8vIGFyZSB0aGUgbWV0aG9kIG5hbWVzIHRvIGJlIGJvdW5kLiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXQgYWxsIGNhbGxiYWNrc1xuICAvLyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIF8uYmluZEFsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLCBrZXk7XG4gICAgaWYgKGxlbmd0aCA8PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXMnKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIG9ialtrZXldID0gXy5iaW5kKG9ialtrZXldLCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vaXplID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgY2FjaGUgPSBtZW1vaXplLmNhY2hlO1xuICAgICAgdmFyIGFkZHJlc3MgPSAnJyArIChoYXNoZXIgPyBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGtleSk7XG4gICAgICBpZiAoIV8uaGFzKGNhY2hlLCBhZGRyZXNzKSkgY2FjaGVbYWRkcmVzc10gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gY2FjaGVbYWRkcmVzc107XG4gICAgfTtcbiAgICBtZW1vaXplLmNhY2hlID0ge307XG4gICAgcmV0dXJuIG1lbW9pemU7XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gXy5wYXJ0aWFsKF8uZGVsYXksIF8sIDEpO1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IF8ubm93KCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBfLm5vdygpO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGFzdCA9IF8ubm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICAgIGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID49IDApIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGltZXN0YW1wID0gXy5ub3coKTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIF8ucGFydGlhbCh3cmFwcGVyLCBmdW5jKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgbmVnYXRlZCB2ZXJzaW9uIG9mIHRoZSBwYXNzZWQtaW4gcHJlZGljYXRlLlxuICBfLm5lZ2F0ZSA9IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBfLmNvbXBvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgc3RhcnQgPSBhcmdzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGkgPSBzdGFydDtcbiAgICAgIHZhciByZXN1bHQgPSBhcmdzW3N0YXJ0XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgd2hpbGUgKGktLSkgcmVzdWx0ID0gYXJnc1tpXS5jYWxsKHRoaXMsIHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIG9uIGFuZCBhZnRlciB0aGUgTnRoIGNhbGwuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIHVwIHRvIChidXQgbm90IGluY2x1ZGluZykgdGhlIE50aCBjYWxsLlxuICBfLmJlZm9yZSA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgdmFyIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPiAwKSB7XG4gICAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICBpZiAodGltZXMgPD0gMSkgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBfLnBhcnRpYWwoXy5iZWZvcmUsIDIpO1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEtleXMgaW4gSUUgPCA5IHRoYXQgd29uJ3QgYmUgaXRlcmF0ZWQgYnkgYGZvciBrZXkgaW4gLi4uYCBhbmQgdGh1cyBtaXNzZWQuXG4gIHZhciBoYXNFbnVtQnVnID0gIXt0b1N0cmluZzogbnVsbH0ucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG4gIHZhciBub25FbnVtZXJhYmxlUHJvcHMgPSBbJ3ZhbHVlT2YnLCAnaXNQcm90b3R5cGVPZicsICd0b1N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJ2hhc093blByb3BlcnR5JywgJ3RvTG9jYWxlU3RyaW5nJ107XG5cbiAgZnVuY3Rpb24gY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpIHtcbiAgICB2YXIgbm9uRW51bUlkeCA9IG5vbkVudW1lcmFibGVQcm9wcy5sZW5ndGg7XG4gICAgdmFyIGNvbnN0cnVjdG9yID0gb2JqLmNvbnN0cnVjdG9yO1xuICAgIHZhciBwcm90byA9IChfLmlzRnVuY3Rpb24oY29uc3RydWN0b3IpICYmIGNvbnN0cnVjdG9yLnByb3RvdHlwZSkgfHwgT2JqUHJvdG87XG5cbiAgICAvLyBDb25zdHJ1Y3RvciBpcyBhIHNwZWNpYWwgY2FzZS5cbiAgICB2YXIgcHJvcCA9ICdjb25zdHJ1Y3Rvcic7XG4gICAgaWYgKF8uaGFzKG9iaiwgcHJvcCkgJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIGtleXMucHVzaChwcm9wKTtcblxuICAgIHdoaWxlIChub25FbnVtSWR4LS0pIHtcbiAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbm9uRW51bUlkeF07XG4gICAgICBpZiAocHJvcCBpbiBvYmogJiYgb2JqW3Byb3BdICE9PSBwcm90b1twcm9wXSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkge1xuICAgICAgICBrZXlzLnB1c2gocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgaWYgKG5hdGl2ZUtleXMpIHJldHVybiBuYXRpdmVLZXlzKG9iaik7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSBhbGwgdGhlIHByb3BlcnR5IG5hbWVzIG9mIGFuIG9iamVjdC5cbiAgXy5hbGxLZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0gPSBvYmpba2V5c1tpXV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50IG9mIHRoZSBvYmplY3RcbiAgLy8gSW4gY29udHJhc3QgdG8gXy5tYXAgaXQgcmV0dXJucyBhbiBvYmplY3RcbiAgXy5tYXBPYmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGgsXG4gICAgICAgICAgcmVzdWx0cyA9IHt9LFxuICAgICAgICAgIGN1cnJlbnRLZXk7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGN1cnJlbnRLZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgICAgcmVzdWx0c1tjdXJyZW50S2V5XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBwYWlyc1tpXSA9IFtrZXlzW2ldLCBvYmpba2V5c1tpXV1dO1xuICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbb2JqW2tleXNbaV1dXSA9IGtleXNbaV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYFxuICBfLmZ1bmN0aW9ucyA9IF8ubWV0aG9kcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBuYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzKTtcblxuICAvLyBBc3NpZ25zIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBvd24gcHJvcGVydGllcyBpbiB0aGUgcGFzc2VkLWluIG9iamVjdChzKVxuICAvLyAoaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnbilcbiAgXy5leHRlbmRPd24gPSBfLmFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKF8ua2V5cyk7XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3Qga2V5IG9uIGFuIG9iamVjdCB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEtleSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopLCBrZXk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtrZXldLCBrZXksIG9iaikpIHJldHVybiBrZXk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iamVjdCwgb2l0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9LCBvYmogPSBvYmplY3QsIGl0ZXJhdGVlLCBrZXlzO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKG9pdGVyYXRlZSkpIHtcbiAgICAgIGtleXMgPSBfLmFsbEtleXMob2JqKTtcbiAgICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihvaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXlzID0gZmxhdHRlbihhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgMSk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikgeyByZXR1cm4ga2V5IGluIG9iajsgfTtcbiAgICAgIG9iaiA9IE9iamVjdChvYmopO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIGlmIChpdGVyYXRlZSh2YWx1ZSwga2V5LCBvYmopKSByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXRlcmF0ZWUpKSB7XG4gICAgICBpdGVyYXRlZSA9IF8ubmVnYXRlKGl0ZXJhdGVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLm1hcChmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKSwgU3RyaW5nKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICByZXR1cm4gIV8uY29udGFpbnMoa2V5cywga2V5KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBfLnBpY2sob2JqLCBpdGVyYXRlZSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cywgdHJ1ZSk7XG5cbiAgLy8gQ3JlYXRlcyBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoZSBnaXZlbiBwcm90b3R5cGUgb2JqZWN0LlxuICAvLyBJZiBhZGRpdGlvbmFsIHByb3BlcnRpZXMgYXJlIHByb3ZpZGVkIHRoZW4gdGhleSB3aWxsIGJlIGFkZGVkIHRvIHRoZVxuICAvLyBjcmVhdGVkIG9iamVjdC5cbiAgXy5jcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUsIHByb3BzKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VDcmVhdGUocHJvdG90eXBlKTtcbiAgICBpZiAocHJvcHMpIF8uZXh0ZW5kT3duKHJlc3VsdCwgcHJvcHMpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybnMgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmlzTWF0Y2ggPSBmdW5jdGlvbihvYmplY3QsIGF0dHJzKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMoYXR0cnMpLCBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiAhbGVuZ3RoO1xuICAgIHZhciBvYmogPSBPYmplY3Qob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChhdHRyc1trZXldICE9PSBvYmpba2V5XSB8fCAhKGtleSBpbiBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBpc0VxdWFsYC5cbiAgdmFyIGVxID0gZnVuY3Rpb24oYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXG4gICAgLy8gU2VlIHRoZSBbSGFybW9ueSBgZWdhbGAgcHJvcG9zYWxdKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbCkuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT09IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgLy8gU3RyaW5ncywgbnVtYmVycywgcmVndWxhciBleHByZXNzaW9ucywgZGF0ZXMsIGFuZCBib29sZWFucyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgLy8gUmVnRXhwcyBhcmUgY29lcmNlZCB0byBzdHJpbmdzIGZvciBjb21wYXJpc29uIChOb3RlOiAnJyArIC9hL2kgPT09ICcvYS9pJylcbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuICcnICsgYSA9PT0gJycgKyBiO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS5cbiAgICAgICAgLy8gT2JqZWN0KE5hTikgaXMgZXF1aXZhbGVudCB0byBOYU5cbiAgICAgICAgaWYgKCthICE9PSArYSkgcmV0dXJuICtiICE9PSArYjtcbiAgICAgICAgLy8gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvciBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuICthID09PSAwID8gMSAvICthID09PSAxIC8gYiA6ICthID09PSArYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PT0gK2I7XG4gICAgfVxuXG4gICAgdmFyIGFyZUFycmF5cyA9IGNsYXNzTmFtZSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICBpZiAoIWFyZUFycmF5cykge1xuICAgICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIC8vIE9iamVjdHMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1aXZhbGVudCwgYnV0IGBPYmplY3RgcyBvciBgQXJyYXlgc1xuICAgICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICAgIGlmIChhQ3RvciAhPT0gYkN0b3IgJiYgIShfLmlzRnVuY3Rpb24oYUN0b3IpICYmIGFDdG9yIGluc3RhbmNlb2YgYUN0b3IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmICgnY29uc3RydWN0b3InIGluIGEgJiYgJ2NvbnN0cnVjdG9yJyBpbiBiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cblxuICAgIC8vIEluaXRpYWxpemluZyBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICAvLyBJdCdzIGRvbmUgaGVyZSBzaW5jZSB3ZSBvbmx5IG5lZWQgdGhlbSBmb3Igb2JqZWN0cyBhbmQgYXJyYXlzIGNvbXBhcmlzb24uXG4gICAgYVN0YWNrID0gYVN0YWNrIHx8IFtdO1xuICAgIGJTdGFjayA9IGJTdGFjayB8fCBbXTtcbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT09IGI7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuXG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGFyZUFycmF5cykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmICghZXEoYVtsZW5ndGhdLCBiW2xlbmd0aF0sIGFTdGFjaywgYlN0YWNrKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKGEpLCBrZXk7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzIGJlZm9yZSBjb21wYXJpbmcgZGVlcCBlcXVhbGl0eS5cbiAgICAgIGlmIChfLmtleXMoYikubGVuZ3RoICE9PSBsZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXJcbiAgICAgICAga2V5ID0ga2V5c1tsZW5ndGhdO1xuICAgICAgICBpZiAoIShfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYik7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikgJiYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSB8fCBfLmlzQXJndW1lbnRzKG9iaikpKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICByZXR1cm4gXy5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLCBpc0Vycm9yLlxuICBfLmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCcsICdFcnJvciddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUgPCA5KSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5oYXMob2JqLCAnY2FsbGVlJyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS4gV29yayBhcm91bmQgc29tZSB0eXBlb2YgYnVncyBpbiBvbGQgdjgsXG4gIC8vIElFIDExICgjMTYyMSksIGFuZCBpbiBTYWZhcmkgOCAoIzE5MjkpLlxuICBpZiAodHlwZW9mIC8uLyAhPSAnZnVuY3Rpb24nICYmIHR5cGVvZiBJbnQ4QXJyYXkgIT0gJ29iamVjdCcpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09ICdmdW5jdGlvbicgfHwgZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9PSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5XG4gIC8vIG9uIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuXG4gIF8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH07XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSdW4gVW5kZXJzY29yZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzXG4gIC8vIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5fID0gcHJldmlvdXNVbmRlcnNjb3JlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEtlZXAgdGhlIGlkZW50aXR5IGZ1bmN0aW9uIGFyb3VuZCBmb3IgZGVmYXVsdCBpdGVyYXRlZXMuXG4gIF8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvLyBQcmVkaWNhdGUtZ2VuZXJhdGluZyBmdW5jdGlvbnMuIE9mdGVuIHVzZWZ1bCBvdXRzaWRlIG9mIFVuZGVyc2NvcmUuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9O1xuXG4gIF8ubm9vcCA9IGZ1bmN0aW9uKCl7fTtcblxuICBfLnByb3BlcnR5ID0gcHJvcGVydHk7XG5cbiAgLy8gR2VuZXJhdGVzIGEgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gb2JqZWN0IHRoYXQgcmV0dXJucyBhIGdpdmVuIHByb3BlcnR5LlxuICBfLnByb3BlcnR5T2YgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09IG51bGwgPyBmdW5jdGlvbigpe30gOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBwcmVkaWNhdGUgZm9yIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZlxuICAvLyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5tYXRjaGVyID0gXy5tYXRjaGVzID0gZnVuY3Rpb24oYXR0cnMpIHtcbiAgICBhdHRycyA9IF8uZXh0ZW5kT3duKHt9LCBhdHRycyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaXNNYXRjaChvYmosIGF0dHJzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRlZShpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfTtcblxuICAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVzY2FwZU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICdgJzogJyYjeDYwOydcbiAgfTtcbiAgdmFyIHVuZXNjYXBlTWFwID0gXy5pbnZlcnQoZXNjYXBlTWFwKTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIHZhciBjcmVhdGVFc2NhcGVyID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGVzY2FwZXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hcFttYXRjaF07XG4gICAgfTtcbiAgICAvLyBSZWdleGVzIGZvciBpZGVudGlmeWluZyBhIGtleSB0aGF0IG5lZWRzIHRvIGJlIGVzY2FwZWRcbiAgICB2YXIgc291cmNlID0gJyg/OicgKyBfLmtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgICB2YXIgcmVwbGFjZVJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UsICdnJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XG4gICAgfTtcbiAgfTtcbiAgXy5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKGVzY2FwZU1hcCk7XG4gIF8udW5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKHVuZXNjYXBlTWFwKTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCB3aXRoIHRoZVxuICAvLyBgb2JqZWN0YCBhcyBjb250ZXh0OyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5LCBmYWxsYmFjaykge1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdm9pZCAwIDogb2JqZWN0W3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgdmFsdWUgPSBmYWxsYmFjaztcbiAgICB9XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIHZhciBlc2NhcGVDaGFyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07XG4gIH07XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgLy8gTkI6IGBvbGRTZXR0aW5nc2Agb25seSBleGlzdHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgc2V0dGluZ3MsIG9sZFNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncyAmJiBvbGRTZXR0aW5ncykgc2V0dGluZ3MgPSBvbGRTZXR0aW5ncztcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UoZXNjYXBlciwgZXNjYXBlQ2hhcik7XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRvYmUgVk1zIG5lZWQgdGhlIG1hdGNoIHJldHVybmVkIHRvIHByb2R1Y2UgdGhlIGNvcnJlY3Qgb2ZmZXN0LlxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgJ3JldHVybiBfX3A7XFxuJztcblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHZhciBhcmd1bWVudCA9IHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonO1xuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgYXJndW1lbnQgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbi4gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGluc3RhbmNlID0gXyhvYmopO1xuICAgIGluc3RhbmNlLl9jaGFpbiA9IHRydWU7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihpbnN0YW5jZSwgb2JqKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09PSAnc2hpZnQnIHx8IG5hbWUgPT09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICBfLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIFByb3ZpZGUgdW53cmFwcGluZyBwcm94eSBmb3Igc29tZSBtZXRob2RzIHVzZWQgaW4gZW5naW5lIG9wZXJhdGlvbnNcbiAgLy8gc3VjaCBhcyBhcml0aG1ldGljIGFuZCBKU09OIHN0cmluZ2lmaWNhdGlvbi5cbiAgXy5wcm90b3R5cGUudmFsdWVPZiA9IF8ucHJvdG90eXBlLnRvSlNPTiA9IF8ucHJvdG90eXBlLnZhbHVlO1xuXG4gIF8ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICcnICsgdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBBTUQgcmVnaXN0cmF0aW9uIGhhcHBlbnMgYXQgdGhlIGVuZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsb2FkZXJzXG4gIC8vIHRoYXQgbWF5IG5vdCBlbmZvcmNlIG5leHQtdHVybiBzZW1hbnRpY3Mgb24gbW9kdWxlcy4gRXZlbiB0aG91Z2ggZ2VuZXJhbFxuICAvLyBwcmFjdGljZSBmb3IgQU1EIHJlZ2lzdHJhdGlvbiBpcyB0byBiZSBhbm9ueW1vdXMsIHVuZGVyc2NvcmUgcmVnaXN0ZXJzXG4gIC8vIGFzIGEgbmFtZWQgbW9kdWxlIGJlY2F1c2UsIGxpa2UgalF1ZXJ5LCBpdCBpcyBhIGJhc2UgbGlicmFyeSB0aGF0IGlzXG4gIC8vIHBvcHVsYXIgZW5vdWdoIHRvIGJlIGJ1bmRsZWQgaW4gYSB0aGlyZCBwYXJ0eSBsaWIsIGJ1dCBub3QgYmUgcGFydCBvZlxuICAvLyBhbiBBTUQgbG9hZCByZXF1ZXN0LiBUaG9zZSBjYXNlcyBjb3VsZCBnZW5lcmF0ZSBhbiBlcnJvciB3aGVuIGFuXG4gIC8vIGFub255bW91cyBkZWZpbmUoKSBpcyBjYWxsZWQgb3V0c2lkZSBvZiBhIGxvYWRlciByZXF1ZXN0LlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBhY2NvcmRpb24gZnJvbSAnLi9tb2R1bGVzL2FjY29yZGlvbi5qcyc7XG5pbXBvcnQgc2ltcGxlQWNjb3JkaW9uIGZyb20gJy4vbW9kdWxlcy9zaW1wbGVBY2NvcmRpb24uanMnO1xuaW1wb3J0IG9mZmNhbnZhcyBmcm9tICcuL21vZHVsZXMvb2ZmY2FudmFzLmpzJztcbmltcG9ydCBvdmVybGF5IGZyb20gJy4vbW9kdWxlcy9vdmVybGF5LmpzJztcbmltcG9ydCBzdGlja05hdiBmcm9tICcuL21vZHVsZXMvc3RpY2tOYXYuanMnO1xuaW1wb3J0IHNlY3Rpb25IaWdobGlnaHRlciBmcm9tICcuL21vZHVsZXMvc2VjdGlvbkhpZ2hsaWdodGVyLmpzJztcbmltcG9ydCBzdGF0aWNDb2x1bW4gZnJvbSAnLi9tb2R1bGVzL3N0YXRpY0NvbHVtbi5qcyc7XG5pbXBvcnQgYWxlcnQgZnJvbSAnLi9tb2R1bGVzL2FsZXJ0LmpzJztcbi8vIGltcG9ydCBic2R0b29sc1NpZ251cCBmcm9tICcuL21vZHVsZXMvYnNkdG9vbHMtc2lnbnVwLmpzJztcbmltcG9ydCBndW55U2lnbnVwIGZyb20gJy4vbW9kdWxlcy9uZXdzbGV0dGVyLXNpZ251cC5qcyc7XG5pbXBvcnQgZm9ybUVmZmVjdHMgZnJvbSAnLi9tb2R1bGVzL2Zvcm1FZmZlY3RzLmpzJztcbmltcG9ydCBmYWNldHMgZnJvbSAnLi9tb2R1bGVzL2ZhY2V0cy5qcyc7XG5pbXBvcnQgb3dsU2V0dGluZ3MgZnJvbSAnLi9tb2R1bGVzL293bFNldHRpbmdzLmpzJztcbmltcG9ydCBpT1M3SGFjayBmcm9tICcuL21vZHVsZXMvaU9TN0hhY2suanMnO1xuaW1wb3J0IFNoYXJlRm9ybSBmcm9tICcuL21vZHVsZXMvc2hhcmUtZm9ybS5qcyc7XG5pbXBvcnQgY2FwdGNoYVJlc2l6ZSBmcm9tICcuL21vZHVsZXMvY2FwdGNoYVJlc2l6ZS5qcyc7XG5pbXBvcnQgcm90YXRpbmdUZXh0QW5pbWF0aW9uIGZyb20gJy4vbW9kdWxlcy9yb3RhdGluZ1RleHRBbmltYXRpb24uanMnO1xuaW1wb3J0IFNlYXJjaCBmcm9tICcuL21vZHVsZXMvc2VhcmNoLmpzJztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5pbXBvcnQgdG9nZ2xlT3BlbiBmcm9tICcuL21vZHVsZXMvdG9nZ2xlT3Blbi5qcyc7XG5pbXBvcnQgdG9nZ2xlTWVudSBmcm9tICcuL21vZHVsZXMvdG9nZ2xlTWVudS5qcyc7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cbmZ1bmN0aW9uIHJlYWR5KGZuKSB7XG4gIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnbG9hZGluZycpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xuICB9IGVsc2Uge1xuICAgIGZuKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgdG9nZ2xlT3BlbignaXMtb3BlbicpO1xuICBhbGVydCgnaXMtb3BlbicpO1xuICBvZmZjYW52YXMoKTtcbiAgYWNjb3JkaW9uKCk7XG4gIHNpbXBsZUFjY29yZGlvbigpO1xuICBvdmVybGF5KCk7XG5cbiAgLy8gRmFjZXRXUCBwYWdlc1xuICBmYWNldHMoKTtcblxuICAvLyBIb21lcGFnZVxuICBzdGF0aWNDb2x1bW4oKTtcbiAgc3RpY2tOYXYoKTtcbiAgLy8gYnNkdG9vbHNTaWdudXAoKTtcbiAgZ3VueVNpZ251cCgpO1xuICBmb3JtRWZmZWN0cygpO1xuICBvd2xTZXR0aW5ncygpO1xuICBpT1M3SGFjaygpO1xuICBjYXB0Y2hhUmVzaXplKCk7XG4gIHJvdGF0aW5nVGV4dEFuaW1hdGlvbigpO1xuICBzZWN0aW9uSGlnaGxpZ2h0ZXIoKTtcblxuICAvLyBTZWFyY2hcbiAgbmV3IFNlYXJjaCgpLmluaXQoKTtcbn1cblxucmVhZHkoaW5pdCk7XG5cbi8vIE1ha2UgY2VydGFpbiBmdW5jdGlvbnMgYXZhaWxhYmxlIGdsb2JhbGx5XG53aW5kb3cuYWNjb3JkaW9uID0gYWNjb3JkaW9uO1xuXG4oZnVuY3Rpb24od2luZG93LCAkKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLy8gSW5pdGlhbGl6ZSBzaGFyZSBieSBlbWFpbC9zbXMgZm9ybXMuXG4gICQoYC4ke1NoYXJlRm9ybS5Dc3NDbGFzcy5GT1JNfWApLmVhY2goKGksIGVsKSA9PiB7XG4gICAgY29uc3Qgc2hhcmVGb3JtID0gbmV3IFNoYXJlRm9ybShlbCk7XG4gICAgc2hhcmVGb3JtLmluaXQoKTtcbiAgfSk7XG59KSh3aW5kb3csIGpRdWVyeSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbWFpbi5qcyIsIi8qKlxuICogQWNjb3JkaW9uIG1vZHVsZVxuICogQG1vZHVsZSBtb2R1bGVzL2FjY29yZGlvblxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIC8qKlxuICAgKiBDb252ZXJ0IGFjY29yZGlvbiBoZWFkaW5nIHRvIGEgYnV0dG9uXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkaGVhZGVyRWxlbSAtIGpRdWVyeSBvYmplY3QgY29udGFpbmluZyBvcmlnaW5hbCBoZWFkZXJcbiAgICogQHJldHVybiB7b2JqZWN0fSBOZXcgaGVhZGluZyBlbGVtZW50XG4gICAqL1xuICBmdW5jdGlvbiBjb252ZXJ0SGVhZGVyVG9CdXR0b24oJGhlYWRlckVsZW0pIHtcbiAgICBpZiAoJGhlYWRlckVsZW0uZ2V0KDApLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdidXR0b24nKSB7XG4gICAgICByZXR1cm4gJGhlYWRlckVsZW07XG4gICAgfVxuICAgIGNvbnN0IGhlYWRlckVsZW0gPSAkaGVhZGVyRWxlbS5nZXQoMCk7XG4gICAgY29uc3QgbmV3SGVhZGVyRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGZvckVhY2goaGVhZGVyRWxlbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICBuZXdIZWFkZXJFbGVtLnNldEF0dHJpYnV0ZShhdHRyLm5vZGVOYW1lLCBhdHRyLm5vZGVWYWx1ZSk7XG4gICAgfSk7XG4gICAgbmV3SGVhZGVyRWxlbS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJyk7XG4gICAgY29uc3QgJG5ld0hlYWRlckVsZW0gPSAkKG5ld0hlYWRlckVsZW0pO1xuICAgICRuZXdIZWFkZXJFbGVtLmh0bWwoJGhlYWRlckVsZW0uaHRtbCgpKTtcbiAgICAkbmV3SGVhZGVyRWxlbS5hcHBlbmQoJzxzdmcgY2xhc3M9XCJvLWFjY29yZGlvbl9fY2FyZXQgaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjx1c2UgeGxpbms6aHJlZj1cIiNpY29uLWNhcmV0LWRvd25cIj48L3VzZT48L3N2Zz4nKTtcbiAgICByZXR1cm4gJG5ld0hlYWRlckVsZW07XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIHZpc2liaWxpdHkgYXR0cmlidXRlcyBmb3IgaGVhZGVyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkaGVhZGVyRWxlbSAtIFRoZSBhY2NvcmRpb24gaGVhZGVyIGpRdWVyeSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBtYWtlVmlzaWJsZSAtIFdoZXRoZXIgdGhlIGhlYWRlcidzIGNvbnRlbnQgc2hvdWxkIGJlIHZpc2libGVcbiAgICovXG4gIGZ1bmN0aW9uIHRvZ2dsZUhlYWRlcigkaGVhZGVyRWxlbSwgbWFrZVZpc2libGUpIHtcbiAgICAkaGVhZGVyRWxlbS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgbWFrZVZpc2libGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhdHRyaWJ1dGVzLCBjbGFzc2VzLCBhbmQgZXZlbnQgYmluZGluZyB0byBhY2NvcmRpb24gaGVhZGVyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkaGVhZGVyRWxlbSAtIFRoZSBhY2NvcmRpb24gaGVhZGVyIGpRdWVyeSBvYmplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9ICRyZWxhdGVkUGFuZWwgLSBUaGUgcGFuZWwgdGhlIGFjY29yZGlvbiBoZWFkZXIgY29udHJvbHNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVIZWFkZXIoJGhlYWRlckVsZW0sICRyZWxhdGVkUGFuZWwpIHtcbiAgICAkaGVhZGVyRWxlbS5hdHRyKHtcbiAgICAgICdhcmlhLXNlbGVjdGVkJzogZmFsc2UsXG4gICAgICAnYXJpYS1jb250cm9scyc6ICRyZWxhdGVkUGFuZWwuZ2V0KDApLmlkLFxuICAgICAgJ2FyaWEtZXhwYW5kZWQnOiBmYWxzZSxcbiAgICAgICdyb2xlJzogJ2hlYWRpbmcnXG4gICAgfSkuYWRkQ2xhc3MoJ28tYWNjb3JkaW9uX19oZWFkZXInKTtcblxuICAgICRoZWFkZXJFbGVtLm9uKCdjbGljay5hY2NvcmRpb24nLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICRoZWFkZXJFbGVtLnRyaWdnZXIoJ2NoYW5nZVN0YXRlJyk7XG4gICAgfSk7XG5cbiAgICAkaGVhZGVyRWxlbS5vbignbW91c2VsZWF2ZS5hY2NvcmRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICRoZWFkZXJFbGVtLmJsdXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdmlzaWJpbGl0eSBhdHRyaWJ1dGVzIGZvciBwYW5lbFxuICAgKiBAcGFyYW0ge29iamVjdH0gJHBhbmVsRWxlbSAtIFRoZSBhY2NvcmRpb24gcGFuZWwgalF1ZXJ5IG9iamVjdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ha2VWaXNpYmxlIC0gV2hldGhlciB0aGUgcGFuZWwgc2hvdWxkIGJlIHZpc2libGVcbiAgICovXG4gIGZ1bmN0aW9uIHRvZ2dsZVBhbmVsKCRwYW5lbEVsZW0sIG1ha2VWaXNpYmxlKSB7XG4gICAgJHBhbmVsRWxlbS5hdHRyKCdhcmlhLWhpZGRlbicsICFtYWtlVmlzaWJsZSk7XG4gICAgaWYgKG1ha2VWaXNpYmxlKSB7XG4gICAgICAkcGFuZWxFbGVtLmNzcygnaGVpZ2h0JywgJHBhbmVsRWxlbS5kYXRhKCdoZWlnaHQnKSArICdweCcpO1xuICAgICAgJHBhbmVsRWxlbS5maW5kKCdhLCBidXR0b24sIFt0YWJpbmRleF0nKS5hdHRyKCd0YWJpbmRleCcsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAkcGFuZWxFbGVtLmNzcygnaGVpZ2h0JywgJycpO1xuICAgICAgJHBhbmVsRWxlbS5maW5kKCdhLCBidXR0b24sIFt0YWJpbmRleF0nKS5hdHRyKCd0YWJpbmRleCcsIC0xKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIENTUyBjbGFzc2VzIHRvIGFjY29yZGlvbiBwYW5lbHNcbiAgICogQHBhcmFtIHtvYmplY3R9ICRwYW5lbEVsZW0gLSBUaGUgYWNjb3JkaW9uIHBhbmVsIGpRdWVyeSBvYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhYmVsbGVkYnkgLSBJRCBvZiBlbGVtZW50IChhY2NvcmRpb24gaGVhZGVyKSB0aGF0IGxhYmVscyBwYW5lbFxuICAgKi9cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZVBhbmVsKCRwYW5lbEVsZW0sIGxhYmVsbGVkYnkpIHtcbiAgICAkcGFuZWxFbGVtLmFkZENsYXNzKCdvLWFjY29yZGlvbl9fY29udGVudCcpO1xuICAgIGNhbGN1bGF0ZVBhbmVsSGVpZ2h0KCRwYW5lbEVsZW0pO1xuICAgICRwYW5lbEVsZW0uYXR0cih7XG4gICAgICAnYXJpYS1oaWRkZW4nOiB0cnVlLFxuICAgICAgJ3JvbGUnOiAncmVnaW9uJyxcbiAgICAgICdhcmlhLWxhYmVsbGVkYnknOiBsYWJlbGxlZGJ5XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGFjY29yZGlvbiBwYW5lbCBoZWlnaHRcbiAgICogQHBhcmFtIHtvYmplY3R9ICRwYW5lbEVsZW0gLSBUaGUgYWNjb3JkaW9uIHBhbmVsIGpRdWVyeSBvYmplY3RcbiAgICovXG4gIGZ1bmN0aW9uIGNhbGN1bGF0ZVBhbmVsSGVpZ2h0KCRwYW5lbEVsZW0pIHtcbiAgICAkcGFuZWxFbGVtLmRhdGEoJ2hlaWdodCcsICRwYW5lbEVsZW0uaGVpZ2h0KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBzdGF0ZSBmb3IgYWNjb3JkaW9uIGNoaWxkcmVuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAkaXRlbSAtIFRoZSBhY2NvcmRpb24gaXRlbSBqUXVlcnkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWFrZVZpc2libGUgLSBXaGV0aGVyIHRvIG1ha2UgdGhlIGFjY29yZGlvbiBjb250ZW50IHZpc2libGVcbiAgICovXG4gIGZ1bmN0aW9uIHRvZ2dsZUFjY29yZGlvbkl0ZW0oJGl0ZW0sIG1ha2VWaXNpYmxlKSB7XG4gICAgaWYgKG1ha2VWaXNpYmxlKSB7XG4gICAgICAkaXRlbS5hZGRDbGFzcygnaXMtZXhwYW5kZWQnKTtcbiAgICAgICRpdGVtLnJlbW92ZUNsYXNzKCdpcy1jb2xsYXBzZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWV4cGFuZGVkJyk7XG4gICAgICAkaXRlbS5hZGRDbGFzcygnaXMtY29sbGFwc2VkJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBDU1MgY2xhc3NlcyB0byBhY2NvcmRpb24gY2hpbGRyZW5cbiAgICogQHBhcmFtIHtvYmplY3R9ICRpdGVtIC0gVGhlIGFjY29yZGlvbiBjaGlsZCBqUXVlcnkgb2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiBpbml0aWFsaXplQWNjb3JkaW9uSXRlbSgkaXRlbSkge1xuICAgIGNvbnN0ICRhY2NvcmRpb25Db250ZW50ID0gJGl0ZW0uZmluZCgnLmpzLWFjY29yZGlvbl9fY29udGVudCcpO1xuICAgIGNvbnN0ICRhY2NvcmRpb25Jbml0aWFsSGVhZGVyID0gJGl0ZW0uZmluZCgnLmpzLWFjY29yZGlvbl9faGVhZGVyJyk7XG4gICAgLy8gQ2xlYXIgYW55IHByZXZpb3VzbHkgYm91bmQgZXZlbnRzXG4gICAgJGl0ZW0ub2ZmKCd0b2dnbGUuYWNjb3JkaW9uJyk7XG4gICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIHN0YXRlIGNsYXNzZXNcbiAgICAkaXRlbS5yZW1vdmVDbGFzcygnaXMtZXhwYW5kZWQgaXMtY29sbGFwc2VkJyk7XG4gICAgaWYgKCRhY2NvcmRpb25Db250ZW50Lmxlbmd0aCAmJiAkYWNjb3JkaW9uSW5pdGlhbEhlYWRlci5sZW5ndGgpIHtcbiAgICAgICRpdGVtLmFkZENsYXNzKCdvLWFjY29yZGlvbl9faXRlbScpO1xuICAgICAgbGV0ICRhY2NvcmRpb25IZWFkZXI7XG4gICAgICBpZiAoJGFjY29yZGlvbkluaXRpYWxIZWFkZXIuZ2V0KDApLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2J1dHRvbicpIHtcbiAgICAgICAgJGFjY29yZGlvbkhlYWRlciA9ICRhY2NvcmRpb25Jbml0aWFsSGVhZGVyO1xuICAgICAgICBjYWxjdWxhdGVQYW5lbEhlaWdodCgkYWNjb3JkaW9uQ29udGVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkYWNjb3JkaW9uSGVhZGVyID0gY29udmVydEhlYWRlclRvQnV0dG9uKCRhY2NvcmRpb25Jbml0aWFsSGVhZGVyKTtcbiAgICAgICAgJGFjY29yZGlvbkluaXRpYWxIZWFkZXIucmVwbGFjZVdpdGgoJGFjY29yZGlvbkhlYWRlcik7XG4gICAgICAgIGluaXRpYWxpemVIZWFkZXIoJGFjY29yZGlvbkhlYWRlciwgJGFjY29yZGlvbkNvbnRlbnQpO1xuICAgICAgICBpbml0aWFsaXplUGFuZWwoJGFjY29yZGlvbkNvbnRlbnQsICRhY2NvcmRpb25IZWFkZXIuZ2V0KDApLmlkKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDdXN0b20gZXZlbnQgaGFuZGxlciB0byB0b2dnbGUgdGhlIGFjY29yZGlvbiBpdGVtIG9wZW4vY2xvc2VkXG4gICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWFrZVZpc2libGUgLSBXaGV0aGVyIHRvIG1ha2UgdGhlIGFjY29yZGlvbiBjb250ZW50IHZpc2libGVcbiAgICAgICAqL1xuICAgICAgJGl0ZW0ub24oJ3RvZ2dsZS5hY2NvcmRpb24nLCBmdW5jdGlvbihldmVudCwgbWFrZVZpc2libGUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdG9nZ2xlQWNjb3JkaW9uSXRlbSgkaXRlbSwgbWFrZVZpc2libGUpO1xuICAgICAgICB0b2dnbGVIZWFkZXIoJGFjY29yZGlvbkhlYWRlciwgbWFrZVZpc2libGUpO1xuICAgICAgICB0b2dnbGVQYW5lbCgkYWNjb3JkaW9uQ29udGVudCwgbWFrZVZpc2libGUpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENvbGxhcHNlIHBhbmVscyBpbml0aWFsbHlcbiAgICAgICRpdGVtLnRyaWdnZXIoJ3RvZ2dsZS5hY2NvcmRpb24nLCBbZmFsc2VdKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBBUklBIGF0dHJpYnV0ZXMgYW5kIENTUyBjbGFzc2VzIHRvIHRoZSByb290IGFjY29yZGlvbiBlbGVtZW50cy5cbiAgICogQHBhcmFtIHtvYmplY3R9ICRhY2NvcmRpb25FbGVtIC0gVGhlIGpRdWVyeSBvYmplY3QgY29udGFpbmluZyB0aGUgcm9vdCBlbGVtZW50IG9mIHRoZSBhY2NvcmRpb25cbiAgICogQHBhcmFtIHtib29sZWFufSBtdWx0aVNlbGVjdGFibGUgLSBXaGV0aGVyIG11bHRpcGxlIGFjY29yZGlvbiBkcmF3ZXJzIGNhbiBiZSBvcGVuIGF0IHRoZSBzYW1lIHRpbWVcbiAgICovXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoJGFjY29yZGlvbkVsZW0sIG11bHRpU2VsZWN0YWJsZSkge1xuICAgICRhY2NvcmRpb25FbGVtLmF0dHIoe1xuICAgICAgJ3JvbGUnOiAncHJlc2VudGF0aW9uJyxcbiAgICAgICdhcmlhLW11bHRpc2VsZWN0YWJsZSc6IG11bHRpU2VsZWN0YWJsZVxuICAgIH0pLmFkZENsYXNzKCdvLWFjY29yZGlvbicpO1xuICAgICRhY2NvcmRpb25FbGVtLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGluaXRpYWxpemVBY2NvcmRpb25JdGVtKCQodGhpcykpO1xuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSBjaGFuZ2VTdGF0ZSBldmVudHMgb24gYWNjb3JkaW9uIGhlYWRlcnMuXG4gICAgICogQ2xvc2UgdGhlIG9wZW4gYWNjb3JkaW9uIGl0ZW0gYW5kIG9wZW4gdGhlIG5ldyBvbmUuXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdFxuICAgICAqL1xuICAgICRhY2NvcmRpb25FbGVtLm9uKCdjaGFuZ2VTdGF0ZS5hY2NvcmRpb24nLCAnLmpzLWFjY29yZGlvbl9faGVhZGVyJywgJC5wcm94eShmdW5jdGlvbihldmVudCkge1xuICAgICAgY29uc3QgJG5ld0l0ZW0gPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLm8tYWNjb3JkaW9uX19pdGVtJyk7XG4gICAgICBpZiAobXVsdGlTZWxlY3RhYmxlKSB7XG4gICAgICAgICRuZXdJdGVtLnRyaWdnZXIoJ3RvZ2dsZS5hY2NvcmRpb24nLCBbISRuZXdJdGVtLmhhc0NsYXNzKCdpcy1leHBhbmRlZCcpXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCAkb3Blbkl0ZW0gPSAkYWNjb3JkaW9uRWxlbS5maW5kKCcuaXMtZXhwYW5kZWQnKTtcbiAgICAgICAgJG9wZW5JdGVtLnRyaWdnZXIoJ3RvZ2dsZS5hY2NvcmRpb24nLCBbZmFsc2VdKTtcbiAgICAgICAgaWYgKCRvcGVuSXRlbS5nZXQoMCkgIT09ICRuZXdJdGVtLmdldCgwKSkge1xuICAgICAgICAgICRuZXdJdGVtLnRyaWdnZXIoJ3RvZ2dsZS5hY2NvcmRpb24nLCBbdHJ1ZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlaW5pdGlhbGl6ZSBhbiBhY2NvcmRpb24gYWZ0ZXIgaXRzIGNvbnRlbnRzIHdlcmUgZHluYW1pY2FsbHkgdXBkYXRlZFxuICAgKiBAcGFyYW0ge29iamVjdH0gJGFjY29yZGlvbkVsZW0gLSBUaGUgalF1ZXJ5IG9iamVjdCBjb250YWluaW5nIHRoZSByb290IGVsZW1lbnQgb2YgdGhlIGFjY29yZGlvblxuICAgKi9cbiAgZnVuY3Rpb24gcmVJbml0aWFsaXplKCRhY2NvcmRpb25FbGVtKSB7XG4gICAgaWYgKCRhY2NvcmRpb25FbGVtLmhhc0NsYXNzKCdvLWFjY29yZGlvbicpKSB7XG4gICAgICAkYWNjb3JkaW9uRWxlbS5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGluaXRpYWxpemVBY2NvcmRpb25JdGVtKCQodGhpcykpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG11bHRpU2VsZWN0YWJsZSA9ICRhY2NvcmRpb25FbGVtLmRhdGEoJ211bHRpc2VsZWN0YWJsZScpIHx8IGZhbHNlO1xuICAgICAgaW5pdGlhbGl6ZSgkYWNjb3JkaW9uRWxlbSwgbXVsdGlTZWxlY3RhYmxlKTtcbiAgICB9XG4gIH1cbiAgd2luZG93LnJlSW5pdGlhbGl6ZUFjY29yZGlvbiA9IHJlSW5pdGlhbGl6ZTtcblxuICBjb25zdCAkYWNjb3JkaW9ucyA9ICQoJy5qcy1hY2NvcmRpb24nKS5ub3QoJy5vLWFjY29yZGlvbicpO1xuICBpZiAoJGFjY29yZGlvbnMubGVuZ3RoKSB7XG4gICAgJGFjY29yZGlvbnMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG11bHRpU2VsZWN0YWJsZSA9ICQodGhpcykuZGF0YSgnbXVsdGlzZWxlY3RhYmxlJykgfHwgZmFsc2U7XG4gICAgICBpbml0aWFsaXplKCQodGhpcyksIG11bHRpU2VsZWN0YWJsZSk7XG5cbiAgICAgIC8qKlxuICAgICAgICogSGFuZGxlIGZvbnRzQWN0aXZlIGV2ZW50cyBmaXJlZCBvbmNlIFR5cGVraXQgcmVwb3J0cyB0aGF0IHRoZSBmb250cyBhcmUgYWN0aXZlLlxuICAgICAgICogQHNlZSBiYXNlLnR3aWcgZm9yIHRoZSBUeXBla2l0LmxvYWQoKSBmdW5jdGlvblxuICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgKi9cbiAgICAgICQodGhpcykub24oJ2ZvbnRzQWN0aXZlJywgJC5wcm94eShmdW5jdGlvbigpIHtcbiAgICAgICAgcmVJbml0aWFsaXplKCQodGhpcykpO1xuICAgICAgfSwgdGhpcykpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9hY2NvcmRpb24uanMiLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5mb3JFYWNoYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlFYWNoKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlFYWNoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9fYmFzZUZvck93bicpLFxuICAgIGNyZWF0ZUJhc2VFYWNoID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xudmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VFYWNoLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZvck93bihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yT3duO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yT3duLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgY3JlYXRlQmFzZUZvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3I7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3IuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ3JlYXRlcyBhIGJhc2UgZnVuY3Rpb24gZm9yIG1ldGhvZHMgbGlrZSBgXy5mb3JJbmAgYW5kIGBfLmZvck93bmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUZvcihmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNGdW5jKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KG9iamVjdCksXG4gICAgICAgIHByb3BzID0ga2V5c0Z1bmMob2JqZWN0KSxcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcHNbZnJvbVJpZ2h0ID8gbGVuZ3RoIDogKytpbmRleF07XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVba2V5XSwga2V5LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VGb3I7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VGb3IuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZVRpbWVzID0gcmVxdWlyZSgnLi9fYmFzZVRpbWVzJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TGlrZUtleXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanNcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVGltZXMuanNcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlSXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL19iYXNlSXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FyZ3VtZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanNcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkZhbHNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qc1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNJbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMzJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzXG4vLyBtb2R1bGUgaWQgPSAzM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzVHlwZWRBcnJheTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qc1xuLy8gbW9kdWxlIGlkID0gMzRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuYXJ5LmpzXG4vLyBtb2R1bGUgaWQgPSAzNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVVdGlsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19ub2RlVXRpbC5qc1xuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzXG4vLyBtb2R1bGUgaWQgPSAzOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXMuanNcbi8vIG1vZHVsZSBpZCA9IDM5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX292ZXJBcmcuanNcbi8vIG1vZHVsZSBpZCA9IDQwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgYmFzZUVhY2hgIG9yIGBiYXNlRWFjaFJpZ2h0YCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VFYWNoKGVhY2hGdW5jLCBmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gICAgaWYgKGNvbGxlY3Rpb24gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfVxuICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgIHJldHVybiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBpdGVyYXRlZSk7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3QoY29sbGVjdGlvbik7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2luZGV4XSwgaW5kZXgsIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VFYWNoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRWFjaC5qc1xuLy8gbW9kdWxlIGlkID0gNDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYGlkZW50aXR5YCBpZiBpdCdzIG5vdCBhIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGNhc3QgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNhc3RGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicgPyB2YWx1ZSA6IGlkZW50aXR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RGdW5jdGlvbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdEZ1bmN0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSA0M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lkZW50aXR5LmpzXG4vLyBtb2R1bGUgaWQgPSA0NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiogU2ltcGxlIGFjY29yZGlvbiBtb2R1bGVcbiogQG1vZHVsZSBtb2R1bGVzL3NpbXBsZUFjY29yZGlvblxuKiBAc2VlIGh0dHBzOi8vcGVyaXNoYWJsZXByZXNzLmNvbS9qcXVlcnktYWNjb3JkaW9uLW1lbnUtdHV0b3JpYWwvXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIC8vJCgnLmpzLWFjY29yZGlvbiA+IHVsID4gbGk6aGFzKG9sKScpLmFkZENsYXNzKFwiaGFzLXN1YlwiKTtcbiAgJCgnLmpzLXMtYWNjb3JkaW9uID4gbGkgPiBoMy5qcy1zLWFjY29yZGlvbl9faGVhZGVyJykuYXBwZW5kKCc8c3ZnIGNsYXNzPVwiby1hY2NvcmRpb25fX2NhcmV0IGljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1jYXJldC1kb3duXCI+PC91c2U+PC9zdmc+Jyk7XG5cbiAgJCgnLmpzLXMtYWNjb3JkaW9uID4gbGkgPiBoMy5qcy1zLWFjY29yZGlvbl9faGVhZGVyJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNoZWNrRWxlbWVudCA9ICQodGhpcykubmV4dCgpO1xuXG4gICAgJCgnLmpzLXMtYWNjb3JkaW9uIGxpJykucmVtb3ZlQ2xhc3MoJ2lzLWV4cGFuZGVkJyk7XG4gICAgJCh0aGlzKS5jbG9zZXN0KCdsaScpLmFkZENsYXNzKCdpcy1leHBhbmRlZCcpO1xuXG5cbiAgICBpZigoY2hlY2tFbGVtZW50LmlzKCcuanMtcy1hY2NvcmRpb25fX2NvbnRlbnQnKSkgJiYgKGNoZWNrRWxlbWVudC5pcygnOnZpc2libGUnKSkpIHtcbiAgICAgICQodGhpcykuY2xvc2VzdCgnbGknKS5yZW1vdmVDbGFzcygnaXMtZXhwYW5kZWQnKTtcbiAgICAgIGNoZWNrRWxlbWVudC5zbGlkZVVwKCdub3JtYWwnKTtcbiAgICB9XG5cbiAgICBpZigoY2hlY2tFbGVtZW50LmlzKCcuanMtcy1hY2NvcmRpb25fX2NvbnRlbnQnKSkgJiYgKCFjaGVja0VsZW1lbnQuaXMoJzp2aXNpYmxlJykpKSB7XG4gICAgICAkKCcuanMtcy1hY2NvcmRpb24gLmpzLXMtYWNjb3JkaW9uX19jb250ZW50OnZpc2libGUnKS5zbGlkZVVwKCdub3JtYWwnKTtcbiAgICAgIGNoZWNrRWxlbWVudC5zbGlkZURvd24oJ25vcm1hbCcpO1xuICAgIH1cblxuICAgIGlmIChjaGVja0VsZW1lbnQuaXMoJy5qcy1zLWFjY29yZGlvbl9fY29udGVudCcpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc2ltcGxlQWNjb3JkaW9uLmpzIiwiLyoqXG4gKiBPZmZjYW52YXMgbW9kdWxlXG4gKiBAbW9kdWxlIG1vZHVsZXMvb2ZmY2FudmFzXG4gKiBAc2VlIG1vZHVsZXMvdG9nZ2xlT3BlblxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcblxuLyoqXG4gKiBTaGlmdCBrZXlib2FyZCBmb2N1cyB3aGVuIHRoZSBvZmZjYW52YXMgbmF2IGlzIG9wZW4uXG4gKiBUaGUgJ2NoYW5nZU9wZW5TdGF0ZScgZXZlbnQgaXMgZmlyZWQgYnkgbW9kdWxlcy90b2dnbGVPcGVuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBjb25zdCBvZmZDYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtb2ZmY2FudmFzJyk7XG4gIGlmIChvZmZDYW52YXMpIHtcbiAgICBmb3JFYWNoKG9mZkNhbnZhcywgZnVuY3Rpb24ob2ZmQ2FudmFzRWxlbSkge1xuICAgICAgY29uc3Qgb2ZmQ2FudmFzU2lkZSA9IG9mZkNhbnZhc0VsZW0ucXVlcnlTZWxlY3RvcignLmpzLW9mZmNhbnZhc19fc2lkZScpO1xuXG4gICAgICAvKipcbiAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAnY2hhbmdlT3BlblN0YXRlJy5cbiAgICAgICogVGhlIHZhbHVlIG9mIGV2ZW50LmRldGFpbCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgb3BlbiBzdGF0ZSBpcyB0cnVlXG4gICAgICAqIChpLmUuIHRoZSBvZmZjYW52YXMgY29udGVudCBpcyB2aXNpYmxlKS5cbiAgICAgICogQGZ1bmN0aW9uXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICovXG4gICAgICBvZmZDYW52YXNFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZU9wZW5TdGF0ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5kZXRhaWwpIHtcbiAgICAgICAgICBpZiAoISgvXig/OmF8c2VsZWN0fGlucHV0fGJ1dHRvbnx0ZXh0YXJlYSkkL2kudGVzdChvZmZDYW52YXNTaWRlLnRhZ05hbWUpKSkge1xuICAgICAgICAgICAgb2ZmQ2FudmFzU2lkZS50YWJJbmRleCA9IC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvZmZDYW52YXNTaWRlLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvb2ZmY2FudmFzLmpzIiwiLyoqXG4gKiBPdmVybGF5IG1vZHVsZVxuICogQG1vZHVsZSBtb2R1bGVzL292ZXJsYXlcbiAqL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5cbi8qKlxuICogU2hpZnQga2V5Ym9hcmQgZm9jdXMgd2hlbiB0aGUgc2VhcmNoIG92ZXJsYXkgaXMgb3Blbi5cbiAqIFRoZSAnY2hhbmdlT3BlblN0YXRlJyBldmVudCBpcyBmaXJlZCBieSBtb2R1bGVzL3RvZ2dsZU9wZW5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtb3ZlcmxheScpO1xuICBpZiAob3ZlcmxheSkge1xuICAgIGZvckVhY2gob3ZlcmxheSwgZnVuY3Rpb24ob3ZlcmxheUVsZW0pIHtcbiAgICAgIC8qKlxuICAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yICdjaGFuZ2VPcGVuU3RhdGUnLlxuICAgICAgKiBUaGUgdmFsdWUgb2YgZXZlbnQuZGV0YWlsIGluZGljYXRlcyB3aGV0aGVyIHRoZSBvcGVuIHN0YXRlIGlzIHRydWVcbiAgICAgICogKGkuZS4gdGhlIG92ZXJsYXkgaXMgdmlzaWJsZSkuXG4gICAgICAqIEBmdW5jdGlvblxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAqL1xuICAgICAgb3ZlcmxheUVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlT3BlblN0YXRlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmRldGFpbCkge1xuICAgICAgICAgIGlmICghKC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaS50ZXN0KG92ZXJsYXkudGFnTmFtZSkpKSB7XG4gICAgICAgICAgICBvdmVybGF5LnRhYkluZGV4ID0gLTE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1vdmVybGF5IGlucHV0JykpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1vdmVybGF5IGlucHV0JylbMF0uZm9jdXMoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3ZlcmxheS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9vdmVybGF5LmpzIiwiLyoqXG4qIFN0aWNrIE5hdiBtb2R1bGVcbiogQG1vZHVsZSBtb2R1bGVzL3N0aWNreU5hdlxuKi9cblxuaW1wb3J0IHRocm90dGxlIGZyb20gJ2xvZGFzaC90aHJvdHRsZSc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoL2RlYm91bmNlJztcbmltcG9ydCBpbWFnZXNSZWFkeSBmcm9tICdpbWFnZXNyZWFkeS9kaXN0L2ltYWdlc3JlYWR5LmpzJztcblxuLyoqXG4qIFwiU3RpY2tcIiBjb250ZW50IGluIHBsYWNlIGFzIHRoZSB1c2VyIHNjcm9sbHNcbiogQHBhcmFtIHtvYmplY3R9ICRlbGVtIC0galF1ZXJ5IGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgc3RpY2t5XG4qIEBwYXJhbSB7b2JqZWN0fSAkZWxlbUNvbnRhaW5lciAtIGpRdWVyeSBlbGVtZW50IGZvciB0aGUgZWxlbWVudCdzIGNvbnRhaW5lci4gVXNlZCB0byBzZXQgdGhlIHRvcCBhbmQgYm90dG9tIHBvaW50c1xuKiBAcGFyYW0ge29iamVjdH0gJGVsZW1BcnRpY2xlIC0gQ29udGVudCBuZXh0IHRvIHRoZSBzdGlja3kgbmF2XG4qL1xuZnVuY3Rpb24gc3RpY2t5TmF2KCRlbGVtLCAkZWxlbUNvbnRhaW5lciwgJGVsZW1BcnRpY2xlKSB7XG4gIC8vIE1vZHVsZSBzZXR0aW5nc1xuICBjb25zdCBzZXR0aW5ncyA9IHtcbiAgICBzdGlja3lDbGFzczogJ2lzLXN0aWNreScsXG4gICAgYWJzb2x1dGVDbGFzczogJ2lzLXN0dWNrJyxcbiAgICBsYXJnZUJyZWFrcG9pbnQ6ICcxMDI0cHgnLFxuICAgIGFydGljbGVDbGFzczogJ28tYXJ0aWNsZS0tc2hpZnQnXG4gIH07XG5cbiAgLy8gR2xvYmFsc1xuICBsZXQgc3RpY2t5TW9kZSA9IGZhbHNlOyAvLyBGbGFnIHRvIHRlbGwgaWYgc2lkZWJhciBpcyBpbiBcInN0aWNreSBtb2RlXCJcbiAgbGV0IGlzU3RpY2t5ID0gZmFsc2U7IC8vIFdoZXRoZXIgdGhlIHNpZGViYXIgaXMgc3RpY2t5IGF0IHRoaXMgZXhhY3QgbW9tZW50IGluIHRpbWVcbiAgbGV0IGlzQWJzb2x1dGUgPSBmYWxzZTsgLy8gV2hldGhlciB0aGUgc2lkZWJhciBpcyBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgYXQgdGhlIGJvdHRvbVxuICBsZXQgc3dpdGNoUG9pbnQgPSAwOyAvLyBQb2ludCBhdCB3aGljaCB0byBzd2l0Y2ggdG8gc3RpY2t5IG1vZGVcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgbGV0IHN3aXRjaFBvaW50Qm90dG9tID0gMDsgLy8gUG9pbnQgYXQgd2hpY2ggdG8gXCJmcmVlemVcIiB0aGUgc2lkZWJhciBzbyBpdCBkb2Vzbid0IG92ZXJsYXAgdGhlIGZvb3RlclxuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGxldCBsZWZ0T2Zmc2V0ID0gMDsgLy8gQW1vdW50IHNpZGViYXIgc2hvdWxkIGJlIHNldCBmcm9tIHRoZSBsZWZ0IHNpZGVcbiAgbGV0IGVsZW1XaWR0aCA9IDA7IC8vIFdpZHRoIGluIHBpeGVscyBvZiBzaWRlYmFyXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGxldCBlbGVtSGVpZ2h0ID0gMDsgLy8gSGVpZ2h0IGluIHBpeGVscyBvZiBzaWRlYmFyXG4gIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuICAvKipcbiAgKiBUb2dnbGUgdGhlIHN0aWNreSBiZWhhdmlvclxuICAqXG4gICogVHVybnMgb24gaWYgdGhlIHVzZXIgaGFzIHNjcm9sbGVkIHBhc3QgdGhlIHN3aXRjaCBwb2ludCwgb2ZmIGlmIHRoZXkgc2Nyb2xsIGJhY2sgdXBcbiAgKiBJZiBzdGlja3kgbW9kZSBpcyBvbiwgc2V0cyB0aGUgbGVmdCBvZmZzZXQgYXMgd2VsbFxuICAqL1xuICBmdW5jdGlvbiB0b2dnbGVTdGlja3koKSB7XG4gICAgY29uc3QgY3VycmVudFNjcm9sbFBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgIGlmIChjdXJyZW50U2Nyb2xsUG9zID4gc3dpdGNoUG9pbnQpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBzaWRlYmFyIGlzIGFscmVhZHkgc3RpY2t5XG4gICAgICBpZiAoIWlzU3RpY2t5KSB7XG4gICAgICAgIGlzU3RpY2t5ID0gdHJ1ZTtcbiAgICAgICAgaXNBYnNvbHV0ZSA9IGZhbHNlO1xuICAgICAgICAkZWxlbS5hZGRDbGFzcyhzZXR0aW5ncy5zdGlja3lDbGFzcykucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWJzb2x1dGVDbGFzcyk7XG4gICAgICAgICRlbGVtQXJ0aWNsZS5hZGRDbGFzcyhzZXR0aW5ncy5hcnRpY2xlQ2xhc3MpO1xuICAgICAgICB1cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBzaWRlYmFyIGhhcyByZWFjaGVkIHRoZSBib3R0b20gc3dpdGNoIHBvaW50XG4gICAgICBpZiAoJCgnLmMtZm9vdGVyX19yZWFjaGVkJykuaXNPblNjcmVlbigpKSB7XG4gICAgICAgIGlzU3RpY2t5ID0gZmFsc2U7XG4gICAgICAgIGlzQWJzb2x1dGUgPSB0cnVlO1xuICAgICAgICAkZWxlbS5hZGRDbGFzcyhzZXR0aW5ncy5hYnNvbHV0ZUNsYXNzKTtcbiAgICAgICAgdXBkYXRlRGltZW5zaW9ucygpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChpc1N0aWNreSB8fCBpc0Fic29sdXRlKSB7XG4gICAgICBpc1N0aWNreSA9IGZhbHNlO1xuICAgICAgaXNBYnNvbHV0ZSA9IGZhbHNlO1xuICAgICAgJGVsZW0ucmVtb3ZlQ2xhc3MoYCR7c2V0dGluZ3Muc3RpY2t5Q2xhc3N9ICR7c2V0dGluZ3MuYWJzb2x1dGVDbGFzc31gKTtcbiAgICAgICRlbGVtQXJ0aWNsZS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5hcnRpY2xlQ2xhc3MpO1xuICAgICAgdXBkYXRlRGltZW5zaW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIFVwZGF0ZSBkaW1lbnNpb25zIG9uIHNpZGViYXJcbiAgKlxuICAqIFNldCB0byB0aGUgY3VycmVudCB2YWx1ZXMgb2YgbGVmdE9mZnNldCBhbmQgZWxlbVdpZHRoIGlmIHRoZSBlbGVtZW50IGlzXG4gICogY3VycmVudGx5IHN0aWNreS4gT3RoZXJ3aXNlLCBjbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdmFsdWVzXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlQ2xlYXIgLSBGbGFnIHRvIGNsZWFyIHNldCB2YWx1ZXMgcmVnYXJkbGVzcyBvZiBzdGlja3kgc3RhdHVzXG4gICovXG4gIGZ1bmN0aW9uIHVwZGF0ZURpbWVuc2lvbnMoZm9yY2VDbGVhcikge1xuICAgIGlmIChpc1N0aWNreSAmJiAhZm9yY2VDbGVhcikge1xuICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgbGVmdDogbGVmdE9mZnNldCArICdweCcsXG4gICAgICAgIHdpZHRoOiBlbGVtV2lkdGggKyAncHgnLFxuICAgICAgICB0b3A6ICcnLFxuICAgICAgICBib3R0b206ICcnXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGlzQWJzb2x1dGUgJiYgIWZvcmNlQ2xlYXIpIHtcbiAgICAgICRlbGVtLmNzcyh7XG4gICAgICAgIGxlZnQ6ICRlbGVtQ29udGFpbmVyLmNzcygncGFkZGluZy1sZWZ0JyksXG4gICAgICAgIHdpZHRoOiBlbGVtV2lkdGggKyAncHgnLFxuICAgICAgICB0b3A6ICdhdXRvJyxcbiAgICAgICAgYm90dG9tOiAkZWxlbUNvbnRhaW5lci5jc3MoJ3BhZGRpbmctYm90dG9tJylcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZWxlbS5jc3Moe1xuICAgICAgICBsZWZ0OiAnJyxcbiAgICAgICAgd2lkdGg6ICcnLFxuICAgICAgICB0b3A6ICcnLFxuICAgICAgICBib3R0b206ICcnXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBTZXQgdGhlIHN3aXRjaHBvaW50IGZvciB0aGUgZWxlbWVudCBhbmQgZ2V0IGl0cyBjdXJyZW50IG9mZnNldHNcbiAgKi9cbiAgZnVuY3Rpb24gc2V0T2Zmc2V0VmFsdWVzKCkge1xuICAgICRlbGVtLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICBpZiAoaXNTdGlja3kgfHwgaXNBYnNvbHV0ZSkge1xuICAgICAgJGVsZW0ucmVtb3ZlQ2xhc3MoYCR7c2V0dGluZ3Muc3RpY2t5Q2xhc3N9ICR7c2V0dGluZ3MuYWJzb2x1dGVDbGFzc31gKTtcbiAgICAgICRlbGVtQXJ0aWNsZS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5hcnRpY2xlQ2xhc3MpO1xuICAgIH1cbiAgICB1cGRhdGVEaW1lbnNpb25zKHRydWUpO1xuXG4gICAgc3dpdGNoUG9pbnQgPSAkZWxlbS5vZmZzZXQoKS50b3A7XG4gICAgLy8gQm90dG9tIHN3aXRjaCBwb2ludCBpcyBlcXVhbCB0byB0aGUgb2Zmc2V0IGFuZCBoZWlnaHQgb2YgdGhlIG91dGVyIGNvbnRhaW5lciwgbWludXMgYW55IHBhZGRpbmcgb24gdGhlIGJvdHRvbVxuICAgIHN3aXRjaFBvaW50Qm90dG9tID0gJGVsZW1Db250YWluZXIub2Zmc2V0KCkudG9wICsgJGVsZW1Db250YWluZXIub3V0ZXJIZWlnaHQoKSAtXG4gICAgICBwYXJzZUludCgkZWxlbUNvbnRhaW5lci5jc3MoJ3BhZGRpbmctYm90dG9tJyksIDEwKTtcblxuICAgIGxlZnRPZmZzZXQgPSAkZWxlbS5vZmZzZXQoKS5sZWZ0O1xuICAgIGVsZW1XaWR0aCA9ICRlbGVtLm91dGVyV2lkdGgoKTtcbiAgICBlbGVtSGVpZ2h0ID0gJGVsZW0ub3V0ZXJIZWlnaHQoKTtcblxuICAgIGlmIChpc1N0aWNreSB8fCBpc0Fic29sdXRlKSB7XG4gICAgICB1cGRhdGVEaW1lbnNpb25zKCk7XG4gICAgICAkZWxlbS5hZGRDbGFzcyhzZXR0aW5ncy5zdGlja3lDbGFzcyk7XG4gICAgICAkZWxlbUFydGljbGUuYWRkQ2xhc3Moc2V0dGluZ3MuYXJ0aWNsZUNsYXNzKTtcbiAgICAgIGlmIChpc0Fic29sdXRlKSB7XG4gICAgICAgICRlbGVtLmFkZENsYXNzKHNldHRpbmdzLmFic29sdXRlQ2xhc3MpO1xuICAgICAgfVxuICAgIH1cbiAgICAkZWxlbS5jc3MoJ3Zpc2liaWxpdHknLCAnJyk7XG4gIH1cblxuICAvKipcbiAgKiBUdXJuIG9uIFwic3RpY2t5IG1vZGVcIlxuICAqXG4gICogV2F0Y2ggZm9yIHNjcm9sbCBhbmQgZml4IHRoZSBzaWRlYmFyLiBXYXRjaCBmb3Igc2l6ZXMgY2hhbmdlcyBvbiAjbWFpblxuICAqICh3aGljaCBtYXkgY2hhbmdlIGlmIHBhcmFsbGF4IGlzIHVzZWQpIGFuZCBhZGp1c3QgYWNjb3JkaW5nbHkuXG4gICovXG4gIGZ1bmN0aW9uIHN0aWNreU1vZGVPbigpIHtcbiAgICBzdGlja3lNb2RlID0gdHJ1ZTtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsLmZpeGVkU2lkZWJhcicsIHRocm90dGxlKGZ1bmN0aW9uKCkge1xuICAgICAgdG9nZ2xlU3RpY2t5KCk7XG4gICAgfSwgMTAwKSkudHJpZ2dlcignc2Nyb2xsLmZpeGVkU2lkZWJhcicpO1xuXG4gICAgJCgnI21haW4nKS5vbignY29udGFpbmVyU2l6ZUNoYW5nZS5maXhlZFNpZGViYXInLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgc3dpdGNoUG9pbnQgLT0gZXZlbnQub3JpZ2luYWxFdmVudC5kZXRhaWw7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgKiBUdXJuIG9mZiBcInN0aWNreSBtb2RlXCJcbiAgKlxuICAqIFJlbW92ZSB0aGUgZXZlbnQgYmluZGluZyBhbmQgcmVzZXQgZXZlcnl0aGluZ1xuICAqL1xuICBmdW5jdGlvbiBzdGlja3lNb2RlT2ZmKCkge1xuICAgIGlmIChpc1N0aWNreSkge1xuICAgICAgdXBkYXRlRGltZW5zaW9ucyh0cnVlKTtcbiAgICAgICRlbGVtLnJlbW92ZUNsYXNzKHNldHRpbmdzLnN0aWNreUNsYXNzKTtcbiAgICB9XG4gICAgJCh3aW5kb3cpLm9mZignc2Nyb2xsLmZpeGVkU2lkZWJhcicpO1xuICAgICQoJyNtYWluJykub2ZmKCdjb250YWluZXJTaXplQ2hhbmdlLmZpeGVkU2lkZWJhcicpO1xuICAgIHN0aWNreU1vZGUgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAqIEhhbmRsZSAncmVzaXplJyBldmVudFxuICAqXG4gICogVHVybiBzdGlja3kgbW9kZSBvbi9vZmYgZGVwZW5kaW5nIG9uIHdoZXRoZXIgd2UncmUgaW4gZGVza3RvcCBtb2RlXG4gICogQHBhcmFtIHtib29sZWFufSBzdGlja3lNb2RlIC0gV2hldGhlciBzaWRlYmFyIHNob3VsZCBiZSBjb25zaWRlcmVkIHN0aWNreVxuICAqL1xuICBmdW5jdGlvbiBvblJlc2l6ZSgpIHtcbiAgICBjb25zdCBsYXJnZU1vZGUgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogJyArXG4gICAgICBzZXR0aW5ncy5sYXJnZUJyZWFrcG9pbnQgKyAnKScpLm1hdGNoZXM7XG4gICAgaWYgKGxhcmdlTW9kZSkge1xuICAgICAgc2V0T2Zmc2V0VmFsdWVzKCk7XG4gICAgICBpZiAoIXN0aWNreU1vZGUpIHtcbiAgICAgICAgc3RpY2t5TW9kZU9uKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzdGlja3lNb2RlKSB7XG4gICAgICBzdGlja3lNb2RlT2ZmKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogSW5pdGlhbGl6ZSB0aGUgc3RpY2t5IG5hdlxuICAqIEBwYXJhbSB7b2JqZWN0fSBlbGVtIC0gRE9NIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgc3RpY2t5XG4gICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zLiBXaWxsIG92ZXJyaWRlIG1vZHVsZSBkZWZhdWx0cyB3aGVuIHByZXNlbnRcbiAgKi9cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5maXhlZFNpZGViYXInLCBkZWJvdW5jZShmdW5jdGlvbigpIHtcbiAgICAgIG9uUmVzaXplKCk7XG4gICAgfSwgMTAwKSk7XG5cbiAgICBpbWFnZXNSZWFkeShkb2N1bWVudC5ib2R5KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgb25SZXNpemUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTtcblxuICAkLmZuLmlzT25TY3JlZW4gPSBmdW5jdGlvbigpe1xuICAgIHZhciB3aW4gPSAkKHdpbmRvdyk7XG5cbiAgICB2YXIgdmlld3BvcnQgPSB7XG4gICAgICAgIHRvcCA6IHdpbi5zY3JvbGxUb3AoKSxcbiAgICAgICAgbGVmdCA6IHdpbi5zY3JvbGxMZWZ0KClcbiAgICB9O1xuICAgIHZpZXdwb3J0LnJpZ2h0ID0gdmlld3BvcnQubGVmdCArIHdpbi53aWR0aCgpO1xuICAgIHZpZXdwb3J0LmJvdHRvbSA9IHZpZXdwb3J0LnRvcCArIHdpbi5oZWlnaHQoKTtcblxuICAgIHZhciBib3VuZHMgPSB0aGlzLm9mZnNldCgpO1xuICAgIGJvdW5kcy5yaWdodCA9IGJvdW5kcy5sZWZ0ICsgdGhpcy5vdXRlcldpZHRoKCk7XG4gICAgYm91bmRzLmJvdHRvbSA9IGJvdW5kcy50b3AgKyB0aGlzLm91dGVySGVpZ2h0KCk7XG5cbiAgICByZXR1cm4gKCEodmlld3BvcnQucmlnaHQgPCBib3VuZHMubGVmdCB8fCB2aWV3cG9ydC5sZWZ0ID4gYm91bmRzLnJpZ2h0IHx8IHZpZXdwb3J0LmJvdHRvbSA8IGJvdW5kcy50b3AgfHwgdmlld3BvcnQudG9wID4gYm91bmRzLmJvdHRvbSkpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgY29uc3QgJHN0aWNreU5hdnMgPSAkKCcuanMtc3RpY2t5Jyk7XG4gIGlmICgkc3RpY2t5TmF2cy5sZW5ndGgpIHtcbiAgICAkc3RpY2t5TmF2cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgbGV0ICRvdXRlckNvbnRhaW5lciA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXN0aWNreS1jb250YWluZXInKTtcbiAgICAgIGxldCAkYXJ0aWNsZSA9ICRvdXRlckNvbnRhaW5lci5maW5kKCcuanMtc3RpY2t5LWFydGljbGUnKTtcbiAgICAgIHN0aWNreU5hdigkKHRoaXMpLCAkb3V0ZXJDb250YWluZXIsICRhcnRpY2xlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc3RpY2tOYXYuanMiLCJ2YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL2RlYm91bmNlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRocm90dGxlZCBmdW5jdGlvbiB0aGF0IG9ubHkgaW52b2tlcyBgZnVuY2AgYXQgbW9zdCBvbmNlIHBlclxuICogZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gVGhlIHRocm90dGxlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGBcbiAqIG1ldGhvZCB0byBjYW5jZWwgZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG9cbiAqIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYFxuICogc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YFxuICogdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZVxuICogdGhyb3R0bGVkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gcmV0dXJuIHRoZVxuICogcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLnRocm90dGxlYCBhbmQgYF8uZGVib3VuY2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gdGhyb3R0bGUuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhyb3R0bGUgaW52b2NhdGlvbnMgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgdGhyb3R0bGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBleGNlc3NpdmVseSB1cGRhdGluZyB0aGUgcG9zaXRpb24gd2hpbGUgc2Nyb2xsaW5nLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Njcm9sbCcsIF8udGhyb3R0bGUodXBkYXRlUG9zaXRpb24sIDEwMCkpO1xuICpcbiAqIC8vIEludm9rZSBgcmVuZXdUb2tlbmAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGJ1dCBub3QgbW9yZSB0aGFuIG9uY2UgZXZlcnkgNSBtaW51dGVzLlxuICogdmFyIHRocm90dGxlZCA9IF8udGhyb3R0bGUocmVuZXdUb2tlbiwgMzAwMDAwLCB7ICd0cmFpbGluZyc6IGZhbHNlIH0pO1xuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIHRocm90dGxlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyB0aHJvdHRsZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIHRocm90dGxlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gJ2xlYWRpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMubGVhZGluZyA6IGxlYWRpbmc7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuICByZXR1cm4gZGVib3VuY2UoZnVuYywgd2FpdCwge1xuICAgICdsZWFkaW5nJzogbGVhZGluZyxcbiAgICAnbWF4V2FpdCc6IHdhaXQsXG4gICAgJ3RyYWlsaW5nJzogdHJhaWxpbmdcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhyb3R0bGU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvdGhyb3R0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDQ5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vdztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9ub3cuanNcbi8vIG1vZHVsZSBpZCA9IDUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTnVtYmVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzXG4vLyBtb2R1bGUgaWQgPSA1MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTeW1ib2wuanNcbi8vIG1vZHVsZSBpZCA9IDUyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIGltYWdlc3JlYWR5IHYwLjIuMiAtIDIwMTUtMDctMDRUMDY6MjI6MTQuNDM1WiAtIGh0dHBzOi8vZ2l0aHViLmNvbS9yLXBhcmsvaW1hZ2VzLXJlYWR5ICovXG47KGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5pbWFnZXNSZWFkeSA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcblwidXNlIHN0cmljdFwiO1xuXG4vLyBVc2UgdGhlIGZhc3Rlc3QgbWVhbnMgcG9zc2libGUgdG8gZXhlY3V0ZSBhIHRhc2sgaW4gaXRzIG93biB0dXJuLCB3aXRoXG4vLyBwcmlvcml0eSBvdmVyIG90aGVyIGV2ZW50cyBpbmNsdWRpbmcgSU8sIGFuaW1hdGlvbiwgcmVmbG93LCBhbmQgcmVkcmF3XG4vLyBldmVudHMgaW4gYnJvd3NlcnMuXG4vL1xuLy8gQW4gZXhjZXB0aW9uIHRocm93biBieSBhIHRhc2sgd2lsbCBwZXJtYW5lbnRseSBpbnRlcnJ1cHQgdGhlIHByb2Nlc3Npbmcgb2Zcbi8vIHN1YnNlcXVlbnQgdGFza3MuIFRoZSBoaWdoZXIgbGV2ZWwgYGFzYXBgIGZ1bmN0aW9uIGVuc3VyZXMgdGhhdCBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93biBieSBhIHRhc2ssIHRoYXQgdGhlIHRhc2sgcXVldWUgd2lsbCBjb250aW51ZSBmbHVzaGluZyBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZSwgYnV0IGlmIHlvdSB1c2UgYHJhd0FzYXBgIGRpcmVjdGx5LCB5b3UgYXJlIHJlc3BvbnNpYmxlIHRvXG4vLyBlaXRoZXIgZW5zdXJlIHRoYXQgbm8gZXhjZXB0aW9ucyBhcmUgdGhyb3duIGZyb20geW91ciB0YXNrLCBvciB0byBtYW51YWxseVxuLy8gY2FsbCBgcmF3QXNhcC5yZXF1ZXN0Rmx1c2hgIGlmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG4vL21vZHVsZS5leHBvcnRzID0gcmF3QXNhcDtcbmZ1bmN0aW9uIHJhd0FzYXAodGFzaykge1xuICAgIGlmICghcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHJlcXVlc3RGbHVzaCgpO1xuICAgICAgICBmbHVzaGluZyA9IHRydWU7XG4gICAgfVxuICAgIC8vIEVxdWl2YWxlbnQgdG8gcHVzaCwgYnV0IGF2b2lkcyBhIGZ1bmN0aW9uIGNhbGwuXG4gICAgcXVldWVbcXVldWUubGVuZ3RoXSA9IHRhc2s7XG59XG5cbnZhciBxdWV1ZSA9IFtdO1xuLy8gT25jZSBhIGZsdXNoIGhhcyBiZWVuIHJlcXVlc3RlZCwgbm8gZnVydGhlciBjYWxscyB0byBgcmVxdWVzdEZsdXNoYCBhcmVcbi8vIG5lY2Vzc2FyeSB1bnRpbCB0aGUgbmV4dCBgZmx1c2hgIGNvbXBsZXRlcy5cbnZhciBmbHVzaGluZyA9IGZhbHNlO1xuLy8gYHJlcXVlc3RGbHVzaGAgaXMgYW4gaW1wbGVtZW50YXRpb24tc3BlY2lmaWMgbWV0aG9kIHRoYXQgYXR0ZW1wdHMgdG8ga2lja1xuLy8gb2ZmIGEgYGZsdXNoYCBldmVudCBhcyBxdWlja2x5IGFzIHBvc3NpYmxlLiBgZmx1c2hgIHdpbGwgYXR0ZW1wdCB0byBleGhhdXN0XG4vLyB0aGUgZXZlbnQgcXVldWUgYmVmb3JlIHlpZWxkaW5nIHRvIHRoZSBicm93c2VyJ3Mgb3duIGV2ZW50IGxvb3AuXG52YXIgcmVxdWVzdEZsdXNoO1xuLy8gVGhlIHBvc2l0aW9uIG9mIHRoZSBuZXh0IHRhc2sgdG8gZXhlY3V0ZSBpbiB0aGUgdGFzayBxdWV1ZS4gVGhpcyBpc1xuLy8gcHJlc2VydmVkIGJldHdlZW4gY2FsbHMgdG8gYGZsdXNoYCBzbyB0aGF0IGl0IGNhbiBiZSByZXN1bWVkIGlmXG4vLyBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbnZhciBpbmRleCA9IDA7XG4vLyBJZiBhIHRhc2sgc2NoZWR1bGVzIGFkZGl0aW9uYWwgdGFza3MgcmVjdXJzaXZlbHksIHRoZSB0YXNrIHF1ZXVlIGNhbiBncm93XG4vLyB1bmJvdW5kZWQuIFRvIHByZXZlbnQgbWVtb3J5IGV4aGF1c3Rpb24sIHRoZSB0YXNrIHF1ZXVlIHdpbGwgcGVyaW9kaWNhbGx5XG4vLyB0cnVuY2F0ZSBhbHJlYWR5LWNvbXBsZXRlZCB0YXNrcy5cbnZhciBjYXBhY2l0eSA9IDEwMjQ7XG5cbi8vIFRoZSBmbHVzaCBmdW5jdGlvbiBwcm9jZXNzZXMgYWxsIHRhc2tzIHRoYXQgaGF2ZSBiZWVuIHNjaGVkdWxlZCB3aXRoXG4vLyBgcmF3QXNhcGAgdW5sZXNzIGFuZCB1bnRpbCBvbmUgb2YgdGhvc2UgdGFza3MgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbi8vIElmIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLCBgZmx1c2hgIGVuc3VyZXMgdGhhdCBpdHMgc3RhdGUgd2lsbCByZW1haW5cbi8vIGNvbnNpc3RlbnQgYW5kIHdpbGwgcmVzdW1lIHdoZXJlIGl0IGxlZnQgb2ZmIHdoZW4gY2FsbGVkIGFnYWluLlxuLy8gSG93ZXZlciwgYGZsdXNoYCBkb2VzIG5vdCBtYWtlIGFueSBhcnJhbmdlbWVudHMgdG8gYmUgY2FsbGVkIGFnYWluIGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duLlxuZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgd2hpbGUgKGluZGV4IDwgcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgLy8gQWR2YW5jZSB0aGUgaW5kZXggYmVmb3JlIGNhbGxpbmcgdGhlIHRhc2suIFRoaXMgZW5zdXJlcyB0aGF0IHdlIHdpbGxcbiAgICAgICAgLy8gYmVnaW4gZmx1c2hpbmcgb24gdGhlIG5leHQgdGFzayB0aGUgdGFzayB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICAgIGluZGV4ID0gaW5kZXggKyAxO1xuICAgICAgICBxdWV1ZVtjdXJyZW50SW5kZXhdLmNhbGwoKTtcbiAgICAgICAgLy8gUHJldmVudCBsZWFraW5nIG1lbW9yeSBmb3IgbG9uZyBjaGFpbnMgb2YgcmVjdXJzaXZlIGNhbGxzIHRvIGBhc2FwYC5cbiAgICAgICAgLy8gSWYgd2UgY2FsbCBgYXNhcGAgd2l0aGluIHRhc2tzIHNjaGVkdWxlZCBieSBgYXNhcGAsIHRoZSBxdWV1ZSB3aWxsXG4gICAgICAgIC8vIGdyb3csIGJ1dCB0byBhdm9pZCBhbiBPKG4pIHdhbGsgZm9yIGV2ZXJ5IHRhc2sgd2UgZXhlY3V0ZSwgd2UgZG9uJ3RcbiAgICAgICAgLy8gc2hpZnQgdGFza3Mgb2ZmIHRoZSBxdWV1ZSBhZnRlciB0aGV5IGhhdmUgYmVlbiBleGVjdXRlZC5cbiAgICAgICAgLy8gSW5zdGVhZCwgd2UgcGVyaW9kaWNhbGx5IHNoaWZ0IDEwMjQgdGFza3Mgb2ZmIHRoZSBxdWV1ZS5cbiAgICAgICAgaWYgKGluZGV4ID4gY2FwYWNpdHkpIHtcbiAgICAgICAgICAgIC8vIE1hbnVhbGx5IHNoaWZ0IGFsbCB2YWx1ZXMgc3RhcnRpbmcgYXQgdGhlIGluZGV4IGJhY2sgdG8gdGhlXG4gICAgICAgICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIHF1ZXVlLlxuICAgICAgICAgICAgZm9yICh2YXIgc2NhbiA9IDAsIG5ld0xlbmd0aCA9IHF1ZXVlLmxlbmd0aCAtIGluZGV4OyBzY2FuIDwgbmV3TGVuZ3RoOyBzY2FuKyspIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVtzY2FuXSA9IHF1ZXVlW3NjYW4gKyBpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZS5sZW5ndGggLT0gaW5kZXg7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICBpbmRleCA9IDA7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgaXMgaW1wbGVtZW50ZWQgdXNpbmcgYSBzdHJhdGVneSBiYXNlZCBvbiBkYXRhIGNvbGxlY3RlZCBmcm9tXG4vLyBldmVyeSBhdmFpbGFibGUgU2F1Y2VMYWJzIFNlbGVuaXVtIHdlYiBkcml2ZXIgd29ya2VyIGF0IHRpbWUgb2Ygd3JpdGluZy5cbi8vIGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzFtRy01VVlHdXA1cXhHZEVNV2toUDZCV0N6MDUzTlViMkUxUW9VVFUxNnVBL2VkaXQjZ2lkPTc4MzcyNDU5M1xuXG4vLyBTYWZhcmkgNiBhbmQgNi4xIGZvciBkZXNrdG9wLCBpUGFkLCBhbmQgaVBob25lIGFyZSB0aGUgb25seSBicm93c2VycyB0aGF0XG4vLyBoYXZlIFdlYktpdE11dGF0aW9uT2JzZXJ2ZXIgYnV0IG5vdCB1bi1wcmVmaXhlZCBNdXRhdGlvbk9ic2VydmVyLlxuLy8gTXVzdCB1c2UgYGdsb2JhbGAgaW5zdGVhZCBvZiBgd2luZG93YCB0byB3b3JrIGluIGJvdGggZnJhbWVzIGFuZCB3ZWJcbi8vIHdvcmtlcnMuIGBnbG9iYWxgIGlzIGEgcHJvdmlzaW9uIG9mIEJyb3dzZXJpZnksIE1yLCBNcnMsIG9yIE1vcC5cbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8IHdpbmRvdy5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG4vLyBNdXRhdGlvbk9ic2VydmVycyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBoYXZlIGhpZ2ggcHJpb3JpdHkgYW5kIHdvcmtcbi8vIHJlbGlhYmx5IGV2ZXJ5d2hlcmUgdGhleSBhcmUgaW1wbGVtZW50ZWQuXG4vLyBUaGV5IGFyZSBpbXBsZW1lbnRlZCBpbiBhbGwgbW9kZXJuIGJyb3dzZXJzLlxuLy9cbi8vIC0gQW5kcm9pZCA0LTQuM1xuLy8gLSBDaHJvbWUgMjYtMzRcbi8vIC0gRmlyZWZveCAxNC0yOVxuLy8gLSBJbnRlcm5ldCBFeHBsb3JlciAxMVxuLy8gLSBpUGFkIFNhZmFyaSA2LTcuMVxuLy8gLSBpUGhvbmUgU2FmYXJpIDctNy4xXG4vLyAtIFNhZmFyaSA2LTdcbmlmICh0eXBlb2YgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcblxuLy8gTWVzc2FnZUNoYW5uZWxzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGdpdmUgZGlyZWN0IGFjY2VzcyB0byB0aGUgSFRNTFxuLy8gdGFzayBxdWV1ZSwgYXJlIGltcGxlbWVudGVkIGluIEludGVybmV0IEV4cGxvcmVyIDEwLCBTYWZhcmkgNS4wLTEsIGFuZCBPcGVyYVxuLy8gMTEtMTIsIGFuZCBpbiB3ZWIgd29ya2VycyBpbiBtYW55IGVuZ2luZXMuXG4vLyBBbHRob3VnaCBtZXNzYWdlIGNoYW5uZWxzIHlpZWxkIHRvIGFueSBxdWV1ZWQgcmVuZGVyaW5nIGFuZCBJTyB0YXNrcywgdGhleVxuLy8gd291bGQgYmUgYmV0dGVyIHRoYW4gaW1wb3NpbmcgdGhlIDRtcyBkZWxheSBvZiB0aW1lcnMuXG4vLyBIb3dldmVyLCB0aGV5IGRvIG5vdCB3b3JrIHJlbGlhYmx5IGluIEludGVybmV0IEV4cGxvcmVyIG9yIFNhZmFyaS5cblxuLy8gSW50ZXJuZXQgRXhwbG9yZXIgMTAgaXMgdGhlIG9ubHkgYnJvd3NlciB0aGF0IGhhcyBzZXRJbW1lZGlhdGUgYnV0IGRvZXNcbi8vIG5vdCBoYXZlIE11dGF0aW9uT2JzZXJ2ZXJzLlxuLy8gQWx0aG91Z2ggc2V0SW1tZWRpYXRlIHlpZWxkcyB0byB0aGUgYnJvd3NlcidzIHJlbmRlcmVyLCBpdCB3b3VsZCBiZVxuLy8gcHJlZmVycmFibGUgdG8gZmFsbGluZyBiYWNrIHRvIHNldFRpbWVvdXQgc2luY2UgaXQgZG9lcyBub3QgaGF2ZVxuLy8gdGhlIG1pbmltdW0gNG1zIHBlbmFsdHkuXG4vLyBVbmZvcnR1bmF0ZWx5IHRoZXJlIGFwcGVhcnMgdG8gYmUgYSBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAgTW9iaWxlIChhbmRcbi8vIERlc2t0b3AgdG8gYSBsZXNzZXIgZXh0ZW50KSB0aGF0IHJlbmRlcnMgYm90aCBzZXRJbW1lZGlhdGUgYW5kXG4vLyBNZXNzYWdlQ2hhbm5lbCB1c2VsZXNzIGZvciB0aGUgcHVycG9zZXMgb2YgQVNBUC5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS9pc3N1ZXMvMzk2XG5cbi8vIFRpbWVycyBhcmUgaW1wbGVtZW50ZWQgdW5pdmVyc2FsbHkuXG4vLyBXZSBmYWxsIGJhY2sgdG8gdGltZXJzIGluIHdvcmtlcnMgaW4gbW9zdCBlbmdpbmVzLCBhbmQgaW4gZm9yZWdyb3VuZFxuLy8gY29udGV4dHMgaW4gdGhlIGZvbGxvd2luZyBicm93c2Vycy5cbi8vIEhvd2V2ZXIsIG5vdGUgdGhhdCBldmVuIHRoaXMgc2ltcGxlIGNhc2UgcmVxdWlyZXMgbnVhbmNlcyB0byBvcGVyYXRlIGluIGFcbi8vIGJyb2FkIHNwZWN0cnVtIG9mIGJyb3dzZXJzLlxuLy9cbi8vIC0gRmlyZWZveCAzLTEzXG4vLyAtIEludGVybmV0IEV4cGxvcmVyIDYtOVxuLy8gLSBpUGFkIFNhZmFyaSA0LjNcbi8vIC0gTHlueCAyLjguN1xufSBlbHNlIHtcbiAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoZmx1c2gpO1xufVxuXG4vLyBgcmVxdWVzdEZsdXNoYCByZXF1ZXN0cyB0aGF0IHRoZSBoaWdoIHByaW9yaXR5IGV2ZW50IHF1ZXVlIGJlIGZsdXNoZWQgYXNcbi8vIHNvb24gYXMgcG9zc2libGUuXG4vLyBUaGlzIGlzIHVzZWZ1bCB0byBwcmV2ZW50IGFuIGVycm9yIHRocm93biBpbiBhIHRhc2sgZnJvbSBzdGFsbGluZyB0aGUgZXZlbnRcbi8vIHF1ZXVlIGlmIHRoZSBleGNlcHRpb24gaGFuZGxlZCBieSBOb2RlLmpz4oCZc1xuLy8gYHByb2Nlc3Mub24oXCJ1bmNhdWdodEV4Y2VwdGlvblwiKWAgb3IgYnkgYSBkb21haW4uXG5yYXdBc2FwLnJlcXVlc3RGbHVzaCA9IHJlcXVlc3RGbHVzaDtcblxuLy8gVG8gcmVxdWVzdCBhIGhpZ2ggcHJpb3JpdHkgZXZlbnQsIHdlIGluZHVjZSBhIG11dGF0aW9uIG9ic2VydmVyIGJ5IHRvZ2dsaW5nXG4vLyB0aGUgdGV4dCBvZiBhIHRleHQgbm9kZSBiZXR3ZWVuIFwiMVwiIGFuZCBcIi0xXCIuXG5mdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjaykge1xuICAgIHZhciB0b2dnbGUgPSAxO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuICAgICAgICB0b2dnbGUgPSAtdG9nZ2xlO1xuICAgICAgICBub2RlLmRhdGEgPSB0b2dnbGU7XG4gICAgfTtcbn1cblxuLy8gVGhlIG1lc3NhZ2UgY2hhbm5lbCB0ZWNobmlxdWUgd2FzIGRpc2NvdmVyZWQgYnkgTWFsdGUgVWJsIGFuZCB3YXMgdGhlXG4vLyBvcmlnaW5hbCBmb3VuZGF0aW9uIGZvciB0aGlzIGxpYnJhcnkuXG4vLyBodHRwOi8vd3d3Lm5vbmJsb2NraW5nLmlvLzIwMTEvMDYvd2luZG93bmV4dHRpY2suaHRtbFxuXG4vLyBTYWZhcmkgNi4wLjUgKGF0IGxlYXN0KSBpbnRlcm1pdHRlbnRseSBmYWlscyB0byBjcmVhdGUgbWVzc2FnZSBwb3J0cyBvbiBhXG4vLyBwYWdlJ3MgZmlyc3QgbG9hZC4gVGhhbmtmdWxseSwgdGhpcyB2ZXJzaW9uIG9mIFNhZmFyaSBzdXBwb3J0c1xuLy8gTXV0YXRpb25PYnNlcnZlcnMsIHNvIHdlIGRvbid0IG5lZWQgdG8gZmFsbCBiYWNrIGluIHRoYXQgY2FzZS5cblxuLy8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU1lc3NhZ2VDaGFubmVsKGNhbGxiYWNrKSB7XG4vLyAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbi8vICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGNhbGxiYWNrO1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbi8vICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbi8vICAgICB9O1xuLy8gfVxuXG4vLyBGb3IgcmVhc29ucyBleHBsYWluZWQgYWJvdmUsIHdlIGFyZSBhbHNvIHVuYWJsZSB0byB1c2UgYHNldEltbWVkaWF0ZWBcbi8vIHVuZGVyIGFueSBjaXJjdW1zdGFuY2VzLlxuLy8gRXZlbiBpZiB3ZSB3ZXJlLCB0aGVyZSBpcyBhbm90aGVyIGJ1ZyBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMC5cbi8vIEl0IGlzIG5vdCBzdWZmaWNpZW50IHRvIGFzc2lnbiBgc2V0SW1tZWRpYXRlYCB0byBgcmVxdWVzdEZsdXNoYCBiZWNhdXNlXG4vLyBgc2V0SW1tZWRpYXRlYCBtdXN0IGJlIGNhbGxlZCAqYnkgbmFtZSogYW5kIHRoZXJlZm9yZSBtdXN0IGJlIHdyYXBwZWQgaW4gYVxuLy8gY2xvc3VyZS5cbi8vIE5ldmVyIGZvcmdldC5cblxuLy8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbi8vICAgICAgICAgc2V0SW1tZWRpYXRlKGNhbGxiYWNrKTtcbi8vICAgICB9O1xuLy8gfVxuXG4vLyBTYWZhcmkgNi4wIGhhcyBhIHByb2JsZW0gd2hlcmUgdGltZXJzIHdpbGwgZ2V0IGxvc3Qgd2hpbGUgdGhlIHVzZXIgaXNcbi8vIHNjcm9sbGluZy4gVGhpcyBwcm9ibGVtIGRvZXMgbm90IGltcGFjdCBBU0FQIGJlY2F1c2UgU2FmYXJpIDYuMCBzdXBwb3J0c1xuLy8gbXV0YXRpb24gb2JzZXJ2ZXJzLCBzbyB0aGF0IGltcGxlbWVudGF0aW9uIGlzIHVzZWQgaW5zdGVhZC5cbi8vIEhvd2V2ZXIsIGlmIHdlIGV2ZXIgZWxlY3QgdG8gdXNlIHRpbWVycyBpbiBTYWZhcmksIHRoZSBwcmV2YWxlbnQgd29yay1hcm91bmRcbi8vIGlzIHRvIGFkZCBhIHNjcm9sbCBldmVudCBsaXN0ZW5lciB0aGF0IGNhbGxzIGZvciBhIGZsdXNoLlxuXG4vLyBgc2V0VGltZW91dGAgZG9lcyBub3QgY2FsbCB0aGUgcGFzc2VkIGNhbGxiYWNrIGlmIHRoZSBkZWxheSBpcyBsZXNzIHRoYW5cbi8vIGFwcHJveGltYXRlbHkgNyBpbiB3ZWIgd29ya2VycyBpbiBGaXJlZm94IDggdGhyb3VnaCAxOCwgYW5kIHNvbWV0aW1lcyBub3Rcbi8vIGV2ZW4gdGhlbi5cblxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuICAgICAgICAvLyBXZSBkaXNwYXRjaCBhIHRpbWVvdXQgd2l0aCBhIHNwZWNpZmllZCBkZWxheSBvZiAwIGZvciBlbmdpbmVzIHRoYXRcbiAgICAgICAgLy8gY2FuIHJlbGlhYmx5IGFjY29tbW9kYXRlIHRoYXQgcmVxdWVzdC4gVGhpcyB3aWxsIHVzdWFsbHkgYmUgc25hcHBlZFxuICAgICAgICAvLyB0byBhIDQgbWlsaXNlY29uZCBkZWxheSwgYnV0IG9uY2Ugd2UncmUgZmx1c2hpbmcsIHRoZXJlJ3Mgbm8gZGVsYXlcbiAgICAgICAgLy8gYmV0d2VlbiBldmVudHMuXG4gICAgICAgIHZhciB0aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dChoYW5kbGVUaW1lciwgMCk7XG4gICAgICAgIC8vIEhvd2V2ZXIsIHNpbmNlIHRoaXMgdGltZXIgZ2V0cyBmcmVxdWVudGx5IGRyb3BwZWQgaW4gRmlyZWZveFxuICAgICAgICAvLyB3b3JrZXJzLCB3ZSBlbmxpc3QgYW4gaW50ZXJ2YWwgaGFuZGxlIHRoYXQgd2lsbCB0cnkgdG8gZmlyZVxuICAgICAgICAvLyBhbiBldmVudCAyMCB0aW1lcyBwZXIgc2Vjb25kIHVudGlsIGl0IHN1Y2NlZWRzLlxuICAgICAgICB2YXIgaW50ZXJ2YWxIYW5kbGUgPSBzZXRJbnRlcnZhbChoYW5kbGVUaW1lciwgNTApO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRpbWVyKCkge1xuICAgICAgICAgICAgLy8gV2hpY2hldmVyIHRpbWVyIHN1Y2NlZWRzIHdpbGwgY2FuY2VsIGJvdGggdGltZXJzIGFuZFxuICAgICAgICAgICAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2suXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEhhbmRsZSk7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSGFuZGxlKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyBUaGlzIGlzIGZvciBgYXNhcC5qc2Agb25seS5cbi8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdCBkZXBlbmRzIG9uXG4vLyBpdHMgZXhpc3RlbmNlLlxucmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIgPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXI7XG5cbi8vIEFTQVAgd2FzIG9yaWdpbmFsbHkgYSBuZXh0VGljayBzaGltIGluY2x1ZGVkIGluIFEuIFRoaXMgd2FzIGZhY3RvcmVkIG91dFxuLy8gaW50byB0aGlzIEFTQVAgcGFja2FnZS4gSXQgd2FzIGxhdGVyIGFkYXB0ZWQgdG8gUlNWUCB3aGljaCBtYWRlIGZ1cnRoZXJcbi8vIGFtZW5kbWVudHMuIFRoZXNlIGRlY2lzaW9ucywgcGFydGljdWxhcmx5IHRvIG1hcmdpbmFsaXplIE1lc3NhZ2VDaGFubmVsIGFuZFxuLy8gdG8gY2FwdHVyZSB0aGUgTXV0YXRpb25PYnNlcnZlciBpbXBsZW1lbnRhdGlvbiBpbiBhIGNsb3N1cmUsIHdlcmUgaW50ZWdyYXRlZFxuLy8gYmFjayBpbnRvIEFTQVAgcHJvcGVyLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RpbGRlaW8vcnN2cC5qcy9ibG9iL2NkZGY3MjMyNTQ2YTljZjg1ODUyNGI3NWNkZTZmOWVkZjcyNjIwYTcvbGliL3JzdnAvYXNhcC5qc1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vdmFyIGFzYXAgPSByZXF1aXJlKCdhc2FwL3JhdycpO1xudmFyIGFzYXAgPSByYXdBc2FwO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuLy8gU3RhdGVzOlxuLy9cbi8vIDAgLSBwZW5kaW5nXG4vLyAxIC0gZnVsZmlsbGVkIHdpdGggX3ZhbHVlXG4vLyAyIC0gcmVqZWN0ZWQgd2l0aCBfdmFsdWVcbi8vIDMgLSBhZG9wdGVkIHRoZSBzdGF0ZSBvZiBhbm90aGVyIHByb21pc2UsIF92YWx1ZVxuLy9cbi8vIG9uY2UgdGhlIHN0YXRlIGlzIG5vIGxvbmdlciBwZW5kaW5nICgwKSBpdCBpcyBpbW11dGFibGVcblxuLy8gQWxsIGBfYCBwcmVmaXhlZCBwcm9wZXJ0aWVzIHdpbGwgYmUgcmVkdWNlZCB0byBgX3tyYW5kb20gbnVtYmVyfWBcbi8vIGF0IGJ1aWxkIHRpbWUgdG8gb2JmdXNjYXRlIHRoZW0gYW5kIGRpc2NvdXJhZ2UgdGhlaXIgdXNlLlxuLy8gV2UgZG9uJ3QgdXNlIHN5bWJvbHMgb3IgT2JqZWN0LmRlZmluZVByb3BlcnR5IHRvIGZ1bGx5IGhpZGUgdGhlbVxuLy8gYmVjYXVzZSB0aGUgcGVyZm9ybWFuY2UgaXNuJ3QgZ29vZCBlbm91Z2guXG5cblxuLy8gdG8gYXZvaWQgdXNpbmcgdHJ5L2NhdGNoIGluc2lkZSBjcml0aWNhbCBmdW5jdGlvbnMsIHdlXG4vLyBleHRyYWN0IHRoZW0gdG8gaGVyZS5cbnZhciBMQVNUX0VSUk9SID0gbnVsbDtcbnZhciBJU19FUlJPUiA9IHt9O1xuZnVuY3Rpb24gZ2V0VGhlbihvYmopIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gb2JqLnRoZW47XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgTEFTVF9FUlJPUiA9IGV4O1xuICAgIHJldHVybiBJU19FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cnlDYWxsT25lKGZuLCBhKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZuKGEpO1xuICB9IGNhdGNoIChleCkge1xuICAgIExBU1RfRVJST1IgPSBleDtcbiAgICByZXR1cm4gSVNfRVJST1I7XG4gIH1cbn1cbmZ1bmN0aW9uIHRyeUNhbGxUd28oZm4sIGEsIGIpIHtcbiAgdHJ5IHtcbiAgICBmbihhLCBiKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBMQVNUX0VSUk9SID0gZXg7XG4gICAgcmV0dXJuIElTX0VSUk9SO1xuICB9XG59XG5cbi8vbW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuXG5mdW5jdGlvbiBQcm9taXNlKGZuKSB7XG4gIGlmICh0eXBlb2YgdGhpcyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXcnKTtcbiAgfVxuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGEgZnVuY3Rpb24nKTtcbiAgfVxuICB0aGlzLl80MSA9IDA7XG4gIHRoaXMuXzg2ID0gbnVsbDtcbiAgdGhpcy5fMTcgPSBbXTtcbiAgaWYgKGZuID09PSBub29wKSByZXR1cm47XG4gIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG59XG5Qcm9taXNlLl8xID0gbm9vcDtcblxuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIGlmICh0aGlzLmNvbnN0cnVjdG9yICE9PSBQcm9taXNlKSB7XG4gICAgcmV0dXJuIHNhZmVUaGVuKHRoaXMsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKTtcbiAgfVxuICB2YXIgcmVzID0gbmV3IFByb21pc2Uobm9vcCk7XG4gIGhhbmRsZSh0aGlzLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcmVzKSk7XG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBzYWZlVGhlbihzZWxmLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICByZXR1cm4gbmV3IHNlbGYuY29uc3RydWN0b3IoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXMgPSBuZXcgUHJvbWlzZShub29wKTtcbiAgICByZXMudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIGhhbmRsZShzZWxmLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcmVzKSk7XG4gIH0pO1xufTtcbmZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xuICB3aGlsZSAoc2VsZi5fNDEgPT09IDMpIHtcbiAgICBzZWxmID0gc2VsZi5fODY7XG4gIH1cbiAgaWYgKHNlbGYuXzQxID09PSAwKSB7XG4gICAgc2VsZi5fMTcucHVzaChkZWZlcnJlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGFzYXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNiID0gc2VsZi5fNDEgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG4gICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICBpZiAoc2VsZi5fNDEgPT09IDEpIHtcbiAgICAgICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl84Nik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fODYpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmV0ID0gdHJ5Q2FsbE9uZShjYiwgc2VsZi5fODYpO1xuICAgIGlmIChyZXQgPT09IElTX0VSUk9SKSB7XG4gICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgTEFTVF9FUlJPUik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgcmV0KTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICBpZiAobmV3VmFsdWUgPT09IHNlbGYpIHtcbiAgICByZXR1cm4gcmVqZWN0KFxuICAgICAgc2VsZixcbiAgICAgIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJylcbiAgICApO1xuICB9XG4gIGlmIChcbiAgICBuZXdWYWx1ZSAmJlxuICAgICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgKSB7XG4gICAgdmFyIHRoZW4gPSBnZXRUaGVuKG5ld1ZhbHVlKTtcbiAgICBpZiAodGhlbiA9PT0gSVNfRVJST1IpIHtcbiAgICAgIHJldHVybiByZWplY3Qoc2VsZiwgTEFTVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRoZW4gPT09IHNlbGYudGhlbiAmJlxuICAgICAgbmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlXG4gICAgKSB7XG4gICAgICBzZWxmLl80MSA9IDM7XG4gICAgICBzZWxmLl84NiA9IG5ld1ZhbHVlO1xuICAgICAgZmluYWxlKHNlbGYpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRvUmVzb2x2ZSh0aGVuLmJpbmQobmV3VmFsdWUpLCBzZWxmKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgc2VsZi5fNDEgPSAxO1xuICBzZWxmLl84NiA9IG5ld1ZhbHVlO1xuICBmaW5hbGUoc2VsZik7XG59XG5cbmZ1bmN0aW9uIHJlamVjdChzZWxmLCBuZXdWYWx1ZSkge1xuICBzZWxmLl80MSA9IDI7XG4gIHNlbGYuXzg2ID0gbmV3VmFsdWU7XG4gIGZpbmFsZShzZWxmKTtcbn1cbmZ1bmN0aW9uIGZpbmFsZShzZWxmKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5fMTcubGVuZ3RoOyBpKyspIHtcbiAgICBoYW5kbGUoc2VsZiwgc2VsZi5fMTdbaV0pO1xuICB9XG4gIHNlbGYuXzE3ID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSl7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5cbi8qKlxuICogVGFrZSBhIHBvdGVudGlhbGx5IG1pc2JlaGF2aW5nIHJlc29sdmVyIGZ1bmN0aW9uIGFuZCBtYWtlIHN1cmVcbiAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIE1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgYXN5bmNocm9ueS5cbiAqL1xuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBwcm9taXNlKSB7XG4gIHZhciBkb25lID0gZmFsc2U7XG4gIHZhciByZXMgPSB0cnlDYWxsVHdvKGZuLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgIGRvbmUgPSB0cnVlO1xuICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgfSlcbiAgaWYgKCFkb25lICYmIHJlcyA9PT0gSVNfRVJST1IpIHtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3QocHJvbWlzZSwgTEFTVF9FUlJPUik7XG4gIH1cbn1cblxuJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuICogQG5hbWUgSW1hZ2VzUmVhZHlcbiAqIEBjb25zdHJ1Y3RvclxuICpcbiAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudHxFbGVtZW50fEVsZW1lbnRbXXxqUXVlcnl8Tm9kZUxpc3R8c3RyaW5nfSBlbGVtZW50c1xuICogQHBhcmFtIHtib29sZWFufSBqcXVlcnlcbiAqXG4gKi9cbmZ1bmN0aW9uIEltYWdlc1JlYWR5KGVsZW1lbnRzLCBqcXVlcnkpIHtcbiAgaWYgKHR5cGVvZiBlbGVtZW50cyA9PT0gJ3N0cmluZycpIHtcbiAgICBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudHMpO1xuICAgIGlmICghZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlbGVjdG9yIGAnICsgZWxlbWVudHMgKyAnYCB5aWVsZGVkIDAgZWxlbWVudHMnKTtcbiAgICB9XG4gIH1cblxuICB2YXIgZGVmZXJyZWQgPSBkZWZlcihqcXVlcnkpO1xuICB0aGlzLnJlc3VsdCA9IGRlZmVycmVkLnByb21pc2U7XG5cbiAgdmFyIGltYWdlcyA9IHRoaXMuaW1hZ2VFbGVtZW50cyhcbiAgICB0aGlzLnZhbGlkRWxlbWVudHModGhpcy50b0FycmF5KGVsZW1lbnRzKSwgSW1hZ2VzUmVhZHkuVkFMSURfTk9ERV9UWVBFUylcbiAgKTtcblxuICB2YXIgaW1hZ2VDb3VudCA9IGltYWdlcy5sZW5ndGg7XG5cbiAgaWYgKGltYWdlQ291bnQpIHtcbiAgICB0aGlzLnZlcmlmeShpbWFnZXMsIHN0YXR1cyhpbWFnZUNvdW50LCBmdW5jdGlvbihyZWFkeSl7XG4gICAgICBpZiAocmVhZHkpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShlbGVtZW50cyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVsZW1lbnRzKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZGVmZXJyZWQucmVzb2x2ZShlbGVtZW50cyk7XG4gIH1cbn1cblxuXG5JbWFnZXNSZWFkeS5WQUxJRF9OT0RFX1RZUEVTID0ge1xuICAxICA6IHRydWUsIC8vIEVMRU1FTlRfTk9ERVxuICA5ICA6IHRydWUsIC8vIERPQ1VNRU5UX05PREVcbiAgMTEgOiB0cnVlICAvLyBET0NVTUVOVF9GUkFHTUVOVF9OT0RFXG59O1xuXG5cbkltYWdlc1JlYWR5LnByb3RvdHlwZSA9IHtcblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50W119IGVsZW1lbnRzXG4gICAqIEByZXR1cm5zIHtbXXxIVE1MSW1hZ2VFbGVtZW50W119XG4gICAqL1xuICBpbWFnZUVsZW1lbnRzIDogZnVuY3Rpb24oZWxlbWVudHMpIHtcbiAgICB2YXIgaW1hZ2VzID0gW107XG5cbiAgICBlbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTUcnKSB7XG4gICAgICAgIGltYWdlcy5wdXNoKGVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBpbWFnZUVsZW1lbnRzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWcnKTtcbiAgICAgICAgaWYgKGltYWdlRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgaW1hZ2VzLnB1c2guYXBwbHkoaW1hZ2VzLCBpbWFnZUVsZW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGltYWdlcztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxlbWVudHNcbiAgICogQHBhcmFtIHt7fX0gdmFsaWROb2RlVHlwZXNcbiAgICogQHJldHVybnMge1tdfEVsZW1lbnRbXX1cbiAgICovXG4gIHZhbGlkRWxlbWVudHMgOiBmdW5jdGlvbihlbGVtZW50cywgdmFsaWROb2RlVHlwZXMpIHtcbiAgICByZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgICAgcmV0dXJuIHZhbGlkTm9kZVR5cGVzW2VsZW1lbnQubm9kZVR5cGVdO1xuICAgIH0pO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudFtdfSBpbWFnZXNcbiAgICogQHJldHVybnMge1tdfEhUTUxJbWFnZUVsZW1lbnRbXX1cbiAgICovXG4gIGluY29tcGxldGVJbWFnZXMgOiBmdW5jdGlvbihpbWFnZXMpIHtcbiAgICByZXR1cm4gaW1hZ2VzLmZpbHRlcihmdW5jdGlvbihpbWFnZSl7XG4gICAgICByZXR1cm4gIShpbWFnZS5jb21wbGV0ZSAmJiBpbWFnZS5uYXR1cmFsV2lkdGgpO1xuICAgIH0pO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9ubG9hZFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbmVycm9yXG4gICAqIEByZXR1cm5zIHtmdW5jdGlvbihIVE1MSW1hZ2VFbGVtZW50KX1cbiAgICovXG4gIHByb3h5SW1hZ2UgOiBmdW5jdGlvbihvbmxvYWQsIG9uZXJyb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgIHZhciBfaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgX2ltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbmxvYWQpO1xuICAgICAgX2ltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG4gICAgICBfaW1hZ2Uuc3JjID0gaW1hZ2Uuc3JjO1xuXG4gICAgICByZXR1cm4gX2ltYWdlO1xuICAgIH07XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50W119IGltYWdlc1xuICAgKiBAcGFyYW0ge3tmYWlsZWQ6IGZ1bmN0aW9uLCBsb2FkZWQ6IGZ1bmN0aW9ufX0gc3RhdHVzXG4gICAqL1xuICB2ZXJpZnkgOiBmdW5jdGlvbihpbWFnZXMsIHN0YXR1cykge1xuICAgIHZhciBpbmNvbXBsZXRlID0gdGhpcy5pbmNvbXBsZXRlSW1hZ2VzKGltYWdlcyk7XG5cbiAgICBpZiAoaW1hZ2VzLmxlbmd0aCA+IGluY29tcGxldGUubGVuZ3RoKSB7XG4gICAgICBzdGF0dXMubG9hZGVkKGltYWdlcy5sZW5ndGggLSBpbmNvbXBsZXRlLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgaWYgKGluY29tcGxldGUubGVuZ3RoKSB7XG4gICAgICBpbmNvbXBsZXRlLmZvckVhY2godGhpcy5wcm94eUltYWdlKFxuICAgICAgICBmdW5jdGlvbigpe1xuICAgICAgICAgIHN0YXR1cy5sb2FkZWQoMSk7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgc3RhdHVzLmZhaWxlZCgxKTtcbiAgICAgICAgfVxuICAgICAgKSk7XG4gICAgfVxuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudHxFbGVtZW50fEVsZW1lbnRbXXxqUXVlcnl8Tm9kZUxpc3R9IG9iamVjdFxuICAgKiBAcmV0dXJucyB7RWxlbWVudFtdfVxuICAgKi9cbiAgdG9BcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmplY3QubGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwob2JqZWN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gW29iamVjdF07XG4gIH1cblxufTtcblxuXG4vKipcbiAqIEBwYXJhbSBqcXVlcnlcbiAqIEByZXR1cm5zIGRlZmVycmVkXG4gKi9cbmZ1bmN0aW9uIGRlZmVyKGpxdWVyeSkge1xuICB2YXIgZGVmZXJyZWQ7XG5cbiAgaWYgKGpxdWVyeSkge1xuICAgIGRlZmVycmVkID0gbmV3ICQuRGVmZXJyZWQoKTtcbiAgICBkZWZlcnJlZC5wcm9taXNlID0gZGVmZXJyZWQucHJvbWlzZSgpO1xuICB9XG4gIGVsc2Uge1xuICAgIGRlZmVycmVkID0ge307XG4gICAgZGVmZXJyZWQucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIGRlZmVycmVkLnJlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBkZWZlcnJlZDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbWFnZUNvdW50XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBkb25lXG4gKiBAcmV0dXJucyB7e2ZhaWxlZDogZnVuY3Rpb24sIGxvYWRlZDogZnVuY3Rpb259fVxuICovXG5mdW5jdGlvbiBzdGF0dXMoaW1hZ2VDb3VudCwgZG9uZSkge1xuICB2YXIgbG9hZGVkID0gMCxcbiAgICAgIHRvdGFsID0gaW1hZ2VDb3VudCxcbiAgICAgIHZlcmlmaWVkID0gMDtcblxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgaWYgKHRvdGFsID09PSB2ZXJpZmllZCkge1xuICAgICAgZG9uZSh0b3RhbCA9PT0gbG9hZGVkKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gICAgICovXG4gICAgZmFpbGVkIDogZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIHZlcmlmaWVkICs9IGNvdW50O1xuICAgICAgdXBkYXRlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudFxuICAgICAqL1xuICAgIGxvYWRlZCA6IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICBsb2FkZWQgKz0gY291bnQ7XG4gICAgICB2ZXJpZmllZCArPSBjb3VudDtcbiAgICAgIHVwZGF0ZSgpO1xuICAgIH1cblxuICB9O1xufVxuXG5cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgalF1ZXJ5IHBsdWdpblxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmlmICh3aW5kb3cualF1ZXJ5KSB7XG4gICQuZm4uaW1hZ2VzUmVhZHkgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgSW1hZ2VzUmVhZHkodGhpcywgdHJ1ZSk7XG4gICAgcmV0dXJuIGluc3RhbmNlLnJlc3VsdDtcbiAgfTtcbn1cblxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBEZWZhdWx0IGVudHJ5IHBvaW50XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gaW1hZ2VzUmVhZHkoZWxlbWVudHMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgaW5zdGFuY2UgPSBuZXcgSW1hZ2VzUmVhZHkoZWxlbWVudHMpO1xuICByZXR1cm4gaW5zdGFuY2UucmVzdWx0O1xufVxuXG5yZXR1cm4gaW1hZ2VzUmVhZHk7XG59KSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9pbWFnZXNyZWFkeS9kaXN0L2ltYWdlc3JlYWR5LmpzXG4vLyBtb2R1bGUgaWQgPSA1M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiogU2VjdGlvbiBoaWdobGlnaHRlciBtb2R1bGVcbiogQG1vZHVsZSBtb2R1bGVzL3NlY3Rpb25IaWdobGlnaHRlclxuKiBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMyMzk1OTg4L2hpZ2hsaWdodC1tZW51LWl0ZW0td2hlbi1zY3JvbGxpbmctZG93bi10by1zZWN0aW9uXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyICRuYXZpZ2F0aW9uTGlua3MgPSAkKCcuanMtc2VjdGlvbi1zZXQgPiBsaSA+IGEnKTtcbiAgdmFyICRzZWN0aW9ucyA9ICQoXCJzZWN0aW9uXCIpO1xuICB2YXIgJHNlY3Rpb25zUmV2ZXJzZWQgPSAkKCQoXCJzZWN0aW9uXCIpLmdldCgpLnJldmVyc2UoKSk7XG4gIHZhciBzZWN0aW9uSWRUb25hdmlnYXRpb25MaW5rID0ge307XG4gIC8vdmFyIGVUb3AgPSAkKCcjZnJlZS1kYXktdHJpcHMnKS5vZmZzZXQoKS50b3A7XG5cbiAgJHNlY3Rpb25zLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgc2VjdGlvbklkVG9uYXZpZ2F0aW9uTGlua1skKHRoaXMpLmF0dHIoJ2lkJyldID0gJCgnLmpzLXNlY3Rpb24tc2V0ID4gbGkgPiBhW2hyZWY9XCIjJyArICQodGhpcykuYXR0cignaWQnKSArICdcIl0nKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gb3B0aW1pemVkKCkge1xuICAgIHZhciBzY3JvbGxQb3NpdGlvbiA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgICRzZWN0aW9uc1JldmVyc2VkLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY3VycmVudFNlY3Rpb24gPSAkKHRoaXMpO1xuICAgICAgdmFyIHNlY3Rpb25Ub3AgPSBjdXJyZW50U2VjdGlvbi5vZmZzZXQoKS50b3A7XG5cbiAgICAgIC8vIGlmKGN1cnJlbnRTZWN0aW9uLmlzKCdzZWN0aW9uOmZpcnN0LWNoaWxkJykgJiYgc2VjdGlvblRvcCA+IHNjcm9sbFBvc2l0aW9uKXtcbiAgICAgIC8vICAgY29uc29sZS5sb2coJ3Njcm9sbFBvc2l0aW9uJywgc2Nyb2xsUG9zaXRpb24pO1xuICAgICAgLy8gICBjb25zb2xlLmxvZygnc2VjdGlvblRvcCcsIHNlY3Rpb25Ub3ApO1xuICAgICAgLy8gfVxuXG4gICAgICBpZiAoc2Nyb2xsUG9zaXRpb24gPj0gc2VjdGlvblRvcCB8fCAoY3VycmVudFNlY3Rpb24uaXMoJ3NlY3Rpb246Zmlyc3QtY2hpbGQnKSAmJiBzZWN0aW9uVG9wID4gc2Nyb2xsUG9zaXRpb24pKSB7XG4gICAgICAgIHZhciBpZCA9IGN1cnJlbnRTZWN0aW9uLmF0dHIoJ2lkJyk7XG4gICAgICAgIHZhciAkbmF2aWdhdGlvbkxpbmsgPSBzZWN0aW9uSWRUb25hdmlnYXRpb25MaW5rW2lkXTtcbiAgICAgICAgaWYgKCEkbmF2aWdhdGlvbkxpbmsuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpIHx8ICEkKCdzZWN0aW9uJykuaGFzQ2xhc3MoJ28tY29udGVudC1jb250YWluZXItLWNvbXBhY3QnKSkge1xuICAgICAgICAgICAgJG5hdmlnYXRpb25MaW5rcy5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkbmF2aWdhdGlvbkxpbmsuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9wdGltaXplZCgpO1xuICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgIG9wdGltaXplZCgpO1xuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3NlY3Rpb25IaWdobGlnaHRlci5qcyIsIi8qKlxuICogU3RhdGljIGNvbHVtbiBtb2R1bGVcbiAqIFNpbWlsYXIgdG8gdGhlIGdlbmVyYWwgc3RpY2t5IG1vZHVsZSBidXQgdXNlZCBzcGVjaWZpY2FsbHkgd2hlbiBvbmUgY29sdW1uXG4gKiBvZiBhIHR3by1jb2x1bW4gbGF5b3V0IGlzIG1lYW50IHRvIGJlIHN0aWNreVxuICogQG1vZHVsZSBtb2R1bGVzL3N0YXRpY0NvbHVtblxuICogQHNlZSBtb2R1bGVzL3N0aWNreU5hdlxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IHN0aWNreUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtc3RhdGljJyk7XG4gIGNvbnN0IG5vdFN0aWNreUNsYXNzID0gJ2lzLW5vdC1zdGlja3knO1xuICBjb25zdCBib3R0b21DbGFzcyA9ICdpcy1ib3R0b20nO1xuXG4gIC8qKlxuICAqIENhbGN1bGF0ZXMgdGhlIHdpbmRvdyBwb3NpdGlvbiBhbmQgc2V0cyB0aGUgYXBwcm9wcmlhdGUgY2xhc3Mgb24gdGhlIGVsZW1lbnRcbiAgKiBAcGFyYW0ge29iamVjdH0gc3RpY2t5Q29udGVudEVsZW0gLSBET00gbm9kZSB0aGF0IHNob3VsZCBiZSBzdGlja2llZFxuICAqL1xuICBmdW5jdGlvbiBjYWxjV2luZG93UG9zKHN0aWNreUNvbnRlbnRFbGVtKSB7XG4gICAgbGV0IGVsZW1Ub3AgPSBzdGlja3lDb250ZW50RWxlbS5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgICBsZXQgaXNQYXN0Qm90dG9tID0gd2luZG93LmlubmVySGVpZ2h0IC0gc3RpY2t5Q29udGVudEVsZW0ucGFyZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLSBzdGlja3lDb250ZW50RWxlbS5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCA+IDA7XG5cbiAgICAvLyBTZXRzIGVsZW1lbnQgdG8gcG9zaXRpb24gYWJzb2x1dGUgaWYgbm90IHNjcm9sbGVkIHRvIHlldC5cbiAgICAvLyBBYnNvbHV0ZWx5IHBvc2l0aW9uaW5nIG9ubHkgd2hlbiBuZWNlc3NhcnkgYW5kIG5vdCBieSBkZWZhdWx0IHByZXZlbnRzIGZsaWNrZXJpbmdcbiAgICAvLyB3aGVuIHJlbW92aW5nIHRoZSBcImlzLWJvdHRvbVwiIGNsYXNzIG9uIENocm9tZVxuICAgIGlmIChlbGVtVG9wID4gMCkge1xuICAgICAgc3RpY2t5Q29udGVudEVsZW0uY2xhc3NMaXN0LmFkZChub3RTdGlja3lDbGFzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0aWNreUNvbnRlbnRFbGVtLmNsYXNzTGlzdC5yZW1vdmUobm90U3RpY2t5Q2xhc3MpO1xuICAgIH1cbiAgICBpZiAoaXNQYXN0Qm90dG9tKSB7XG4gICAgICBzdGlja3lDb250ZW50RWxlbS5jbGFzc0xpc3QuYWRkKGJvdHRvbUNsYXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RpY2t5Q29udGVudEVsZW0uY2xhc3NMaXN0LnJlbW92ZShib3R0b21DbGFzcyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0aWNreUNvbnRlbnQpIHtcbiAgICBmb3JFYWNoKHN0aWNreUNvbnRlbnQsIGZ1bmN0aW9uKHN0aWNreUNvbnRlbnRFbGVtKSB7XG4gICAgICBjYWxjV2luZG93UG9zKHN0aWNreUNvbnRlbnRFbGVtKTtcblxuICAgICAgLyoqXG4gICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgJ3Njcm9sbCcuXG4gICAgICAqIEBmdW5jdGlvblxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAqL1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjYWxjV2luZG93UG9zKHN0aWNreUNvbnRlbnRFbGVtKTtcbiAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgLyoqXG4gICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgJ3Jlc2l6ZScuXG4gICAgICAqIEBmdW5jdGlvblxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0XG4gICAgICAqL1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjYWxjV2luZG93UG9zKHN0aWNreUNvbnRlbnRFbGVtKTtcbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvc3RhdGljQ29sdW1uLmpzIiwiLyoqXG4gKiBBbGVydCBCYW5uZXIgbW9kdWxlXG4gKiBAbW9kdWxlIG1vZHVsZXMvYWxlcnRcbiAqIEBzZWUgbW9kdWxlcy90b2dnbGVPcGVuXG4gKi9cblxuaW1wb3J0IGZvckVhY2ggZnJvbSAnbG9kYXNoL2ZvckVhY2gnO1xuaW1wb3J0IHJlYWRDb29raWUgZnJvbSAnLi9yZWFkQ29va2llLmpzJztcbmltcG9ydCBkYXRhc2V0IGZyb20gJy4vZGF0YXNldC5qcyc7XG5pbXBvcnQgY3JlYXRlQ29va2llIGZyb20gJy4vY3JlYXRlQ29va2llLmpzJztcbmltcG9ydCBnZXREb21haW4gZnJvbSAnLi9nZXREb21haW4uanMnO1xuXG4vKipcbiAqIERpc3BsYXlzIGFuIGFsZXJ0IGJhbm5lci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcGVuQ2xhc3MgLSBUaGUgY2xhc3MgdG8gdG9nZ2xlIG9uIGlmIGJhbm5lciBpcyB2aXNpYmxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wZW5DbGFzcykge1xuICBpZiAoIW9wZW5DbGFzcykge1xuICAgIG9wZW5DbGFzcyA9ICdpcy1vcGVuJztcbiAgfVxuXG4gIC8qKlxuICAqIE1ha2UgYW4gYWxlcnQgdmlzaWJsZVxuICAqIEBwYXJhbSB7b2JqZWN0fSBhbGVydCAtIERPTSBub2RlIG9mIHRoZSBhbGVydCB0byBkaXNwbGF5XG4gICogQHBhcmFtIHtvYmplY3R9IHNpYmxpbmdFbGVtIC0gRE9NIG5vZGUgb2YgYWxlcnQncyBjbG9zZXN0IHNpYmxpbmcsXG4gICogd2hpY2ggZ2V0cyBzb21lIGV4dHJhIHBhZGRpbmcgdG8gbWFrZSByb29tIGZvciB0aGUgYWxlcnRcbiAgKi9cbiAgZnVuY3Rpb24gZGlzcGxheUFsZXJ0KGFsZXJ0LCBzaWJsaW5nRWxlbSkge1xuICAgIGFsZXJ0LmNsYXNzTGlzdC5hZGQob3BlbkNsYXNzKTtcbiAgICBjb25zdCBhbGVydEhlaWdodCA9IGFsZXJ0Lm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBjdXJyZW50UGFkZGluZyA9IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHNpYmxpbmdFbGVtKS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWJvdHRvbScpLCAxMCk7XG4gICAgc2libGluZ0VsZW0uc3R5bGUucGFkZGluZ0JvdHRvbSA9IChhbGVydEhlaWdodCArIGN1cnJlbnRQYWRkaW5nKSArICdweCc7XG4gIH1cblxuICAvKipcbiAgKiBSZW1vdmUgZXh0cmEgcGFkZGluZyBmcm9tIGFsZXJ0IHNpYmxpbmdcbiAgKiBAcGFyYW0ge29iamVjdH0gc2libGluZ0VsZW0gLSBET00gbm9kZSBvZiBhbGVydCBzaWJsaW5nXG4gICovXG4gIGZ1bmN0aW9uIHJlbW92ZUFsZXJ0UGFkZGluZyhzaWJsaW5nRWxlbSkge1xuICAgIHNpYmxpbmdFbGVtLnN0eWxlLnBhZGRpbmdCb3R0b20gPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICogQ2hlY2sgYWxlcnQgY29va2llXG4gICogQHBhcmFtIHtvYmplY3R9IGFsZXJ0IC0gRE9NIG5vZGUgb2YgdGhlIGFsZXJ0XG4gICogQHJldHVybiB7Ym9vbGVhbn0gLSBXaGV0aGVyIGFsZXJ0IGNvb2tpZSBpcyBzZXRcbiAgKi9cbiAgZnVuY3Rpb24gY2hlY2tBbGVydENvb2tpZShhbGVydCkge1xuICAgIGNvbnN0IGNvb2tpZU5hbWUgPSBkYXRhc2V0KGFsZXJ0LCAnY29va2llJyk7XG4gICAgaWYgKCFjb29raWVOYW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0eXBlb2YgcmVhZENvb2tpZShjb29raWVOYW1lLCBkb2N1bWVudC5jb29raWUpICE9PSAndW5kZWZpbmVkJztcbiAgfVxuXG4gIC8qKlxuICAqIEFkZCBhbGVydCBjb29raWVcbiAgKiBAcGFyYW0ge29iamVjdH0gYWxlcnQgLSBET00gbm9kZSBvZiB0aGUgYWxlcnRcbiAgKi9cbiAgZnVuY3Rpb24gYWRkQWxlcnRDb29raWUoYWxlcnQpIHtcbiAgICBjb25zdCBjb29raWVOYW1lID0gZGF0YXNldChhbGVydCwgJ2Nvb2tpZScpO1xuICAgIGlmIChjb29raWVOYW1lKSB7XG4gICAgICBjcmVhdGVDb29raWUoY29va2llTmFtZSwgJ2Rpc21pc3NlZCcsIGdldERvbWFpbih3aW5kb3cubG9jYXRpb24sIGZhbHNlKSwgMzYwKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBhbGVydHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtYWxlcnQnKTtcbiAgaWYgKGFsZXJ0cy5sZW5ndGgpIHtcbiAgICBmb3JFYWNoKGFsZXJ0cywgZnVuY3Rpb24oYWxlcnQpIHtcbiAgICAgIGlmICghY2hlY2tBbGVydENvb2tpZShhbGVydCkpIHtcbiAgICAgICAgY29uc3QgYWxlcnRTaWJsaW5nID0gYWxlcnQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgZGlzcGxheUFsZXJ0KGFsZXJ0LCBhbGVydFNpYmxpbmcpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgJ2NoYW5nZU9wZW5TdGF0ZScuXG4gICAgICAgICogVGhlIHZhbHVlIG9mIGV2ZW50LmRldGFpbCBpbmRpY2F0ZXMgd2hldGhlciB0aGUgb3BlbiBzdGF0ZSBpcyB0cnVlXG4gICAgICAgICogKGkuZS4gdGhlIGFsZXJ0IGlzIHZpc2libGUpLlxuICAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICAgKi9cbiAgICAgICAgYWxlcnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlT3BlblN0YXRlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAvLyBCZWNhdXNlIGlPUyBzYWZhcmkgaW5leHBsaWNhYmx5IHR1cm5zIGV2ZW50LmRldGFpbCBpbnRvIGFuIG9iamVjdFxuICAgICAgICAgIGlmICgodHlwZW9mIGV2ZW50LmRldGFpbCA9PT0gJ2Jvb2xlYW4nICYmICFldmVudC5kZXRhaWwpIHx8XG4gICAgICAgICAgICAodHlwZW9mIGV2ZW50LmRldGFpbCA9PT0gJ29iamVjdCcgJiYgIWV2ZW50LmRldGFpbC5kZXRhaWwpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBhZGRBbGVydENvb2tpZShhbGVydCk7XG4gICAgICAgICAgICByZW1vdmVBbGVydFBhZGRpbmcoYWxlcnRTaWJsaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9hbGVydC5qcyIsIi8qKlxuKiBSZWFkcyBhIGNvb2tpZSBhbmQgcmV0dXJucyB0aGUgdmFsdWVcbiogQHBhcmFtIHtzdHJpbmd9IGNvb2tpZU5hbWUgLSBOYW1lIG9mIHRoZSBjb29raWVcbiogQHBhcmFtIHtzdHJpbmd9IGNvb2tpZSAtIEZ1bGwgbGlzdCBvZiBjb29raWVzXG4qIEByZXR1cm4ge3N0cmluZ30gLSBWYWx1ZSBvZiBjb29raWU7IHVuZGVmaW5lZCBpZiBjb29raWUgZG9lcyBub3QgZXhpc3RcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb29raWVOYW1lLCBjb29raWUpIHtcbiAgcmV0dXJuIChSZWdFeHAoXCIoPzpefDsgKVwiICsgY29va2llTmFtZSArIFwiPShbXjtdKilcIikuZXhlYyhjb29raWUpIHx8IFtdKS5wb3AoKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3JlYWRDb29raWUuanMiLCIvKipcbiogU2F2ZSBhIGNvb2tpZVxuKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIENvb2tpZSBuYW1lXG4qIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIENvb2tpZSB2YWx1ZVxuKiBAcGFyYW0ge3N0cmluZ30gZG9tYWluIC0gRG9tYWluIG9uIHdoaWNoIHRvIHNldCBjb29raWVcbiogQHBhcmFtIHtpbnRlZ2VyfSBkYXlzIC0gTnVtYmVyIG9mIGRheXMgYmVmb3JlIGNvb2tpZSBleHBpcmVzXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUsIGRvbWFpbiwgZGF5cykge1xuICBjb25zdCBleHBpcmVzID0gZGF5cyA/IFwiOyBleHBpcmVzPVwiICsgKG5ldyBEYXRlKGRheXMgKiA4NjRFNSArIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkpKS50b0dNVFN0cmluZygpIDogXCJcIjtcbiAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgdmFsdWUgKyBleHBpcmVzICsgXCI7IHBhdGg9LzsgZG9tYWluPVwiICsgZG9tYWluO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvY3JlYXRlQ29va2llLmpzIiwiLyoqXG4qIEdldCB0aGUgZG9tYWluIGZyb20gYSBVUkxcbiogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkxcbiogQHBhcmFtIHtib29sZWFufSByb290IC0gV2hldGhlciB0byByZXR1cm4gdGhlIHJvb3QgZG9tYWluIHJhdGhlciB0aGFuIGEgc3ViZG9tYWluXG4qIEByZXR1cm4ge3N0cmluZ30gLSBUaGUgcGFyc2VkIGRvbWFpblxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHVybCwgcm9vdCkge1xuICBmdW5jdGlvbiBwYXJzZVVybCh1cmwpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgdGFyZ2V0LmhyZWYgPSB1cmw7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdXJsID09PSAnc3RyaW5nJykge1xuICAgIHVybCA9IHBhcnNlVXJsKHVybCk7XG4gIH1cbiAgbGV0IGRvbWFpbiA9IHVybC5ob3N0bmFtZTtcbiAgaWYgKHJvb3QpIHtcbiAgICBjb25zdCBzbGljZSA9IGRvbWFpbi5tYXRjaCgvXFwudWskLykgPyAtMyA6IC0yO1xuICAgIGRvbWFpbiA9IGRvbWFpbi5zcGxpdChcIi5cIikuc2xpY2Uoc2xpY2UpLmpvaW4oXCIuXCIpO1xuICB9XG4gIHJldHVybiBkb21haW47XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9nZXREb21haW4uanMiLCIvKipcbiogVmFsaWRhdGUgYSBmb3JtIGFuZCBzdWJtaXQgdmlhIHRoZSBzaWdudXAgQVBJXG4qL1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgemlwY29kZXMgZnJvbSAnLi9kYXRhL3ppcGNvZGVzLmpzb24nXG4gIFxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0ICRzaWdudXBGb3JtcyA9ICQoJy5ndW55LXNpZ251cCcpO1xuICBjb25zdCBlcnJvck1zZyA9ICdQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCBhbmQgemlwIGNvZGUgYW5kIHNlbGVjdCBhdCBsZWFzdCBvbmUgYWdlIGdyb3VwLic7XG5cbiAgLyoqXG4gICogVmFsaWRhdGUgZm9ybSBmaWVsZHNcbiAgKiBAcGFyYW0ge29iamVjdH0gZm9ybURhdGEgLSBmb3JtIGZpZWxkc1xuICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIGV2ZW50IG9iamVjdFxuICAqL1xuICBmdW5jdGlvbiB2YWxpZGF0ZUZpZWxkcyhmb3JtRGF0YSwgZXZlbnQpIHtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBmaWVsZHMgPSBmb3JtRGF0YS5zZXJpYWxpemVBcnJheSgpLnJlZHVjZSgob2JqLCBpdGVtKSA9PiAob2JqW2l0ZW0ubmFtZV0gPSBpdGVtLnZhbHVlLCBvYmopICx7fSlcbiAgICBjb25zdCByZXF1aXJlZEZpZWxkcyA9IGZvcm1EYXRhLmZpbmQoJ1tyZXF1aXJlZF0nKTtcbiAgICBjb25zdCBlbWFpbFJlZ2V4ID0gbmV3IFJlZ0V4cCgvXFxTK0BcXFMrXFwuXFxTKy8pO1xuICAgIGNvbnN0IHppcFJlZ2V4ID0gbmV3IFJlZ0V4cCgvXlxcZHs1fSgtXFxkezR9KT8kL2kpO1xuICAgIGxldCBhZ2VTZWxlY3RlZCA9IE9iamVjdC5rZXlzKGZpZWxkcykuZmluZChhID0+YS5pbmNsdWRlcyhcImdyb3VwXCIpKT8gdHJ1ZSA6IGZhbHNlO1xuICAgIGxldCBoYXNFcnJvcnMgPSBmYWxzZTtcblxuICAgIC8vIGxvb3AgdGhyb3VnaCBlYWNoIHJlcXVpcmVkIGZpZWxkXG4gICAgcmVxdWlyZWRGaWVsZHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGZpZWxkTmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnaXMtZXJyb3InKTtcblxuICAgICAgaWYoKHR5cGVvZiBmaWVsZHNbZmllbGROYW1lXSA9PT0gJ3VuZGVmaW5lZCcpICYmICFhZ2VTZWxlY3RlZCkge1xuICAgICAgICBoYXNFcnJvcnMgPSB0cnVlO1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdpcy1lcnJvcicpO1xuICAgICAgfVxuXG4gICAgICBpZigoZmllbGROYW1lID09IFwiRU1BSUxcIiAmJiAhZW1haWxSZWdleC50ZXN0KGZpZWxkcy5FTUFJTCkpIHx8IFxuICAgICAgICAoZmllbGROYW1lID09IFwiWklQXCIgJiYgIXppcFJlZ2V4LnRlc3QoZmllbGRzLlpJUCkpIFxuICAgICAgKSB7XG4gICAgICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2lzLWVycm9yJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGFzc2lnbiB0aGUgY29ycmVjdCBib3JvdWdoIHRvIGdvb2QgemlwXG4gICAgICBpZigoZmllbGROYW1lID09IFwiRU1BSUxcIiAmJiBlbWFpbFJlZ2V4LnRlc3QoZmllbGRzLkVNQUlMKSkpe1xuICAgICAgICBmaWVsZHMuQk9ST1VHSCA9IGFzc2lnbkJvcm91Z2goZmllbGRzLlpJUCk7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8vIGlmIHRoZXJlIGFyZSBubyBlcnJvcnMsIHN1Ym1pdFxuICAgIGlmIChoYXNFcnJvcnMpIHtcbiAgICAgIGZvcm1EYXRhLmZpbmQoJy5ndW55LWVycm9yJykuaHRtbChgPHA+JHtlcnJvck1zZ308L3A+YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzdWJtaXRTaWdudXAoZmllbGRzKTtcblxuICAgIH1cbiAgfVxuICBcbiAgLyoqXG4gICogQXNzaWducyB0aGUgYm9yb3VnaCBiYXNlZCBvbiB0aGUgemlwIGNvZGVcbiAgKiBAcGFyYW0ge3N0cmluZ30gemlwIC0gemlwIGNvZGVcbiAgKi9cbiAgZnVuY3Rpb24gYXNzaWduQm9yb3VnaCh6aXApe1xuICAgIGxldCBib3JvdWdoID0gXCJcIjtcbiAgICBsZXQgaW5kZXggPSB6aXBjb2Rlcy5maW5kSW5kZXgoeCA9PiB4LmNvZGVzLmluZGV4T2YocGFyc2VJbnQoemlwKSkgPiAtMSk7XG5cbiAgICBpZihpbmRleCA9PT0gLTEpe1xuICAgICAgYm9yb3VnaCA9IFwiTWFuaGF0dGFuXCI7XG4gICAgfWVsc2Uge1xuICAgICAgYm9yb3VnaCA9IHppcGNvZGVzW2luZGV4XS5ib3JvdWdoO1xuICAgIH1cblxuICAgIHJldHVybiBib3JvdWdoO1xuICB9XG5cbiAgLyoqXG4gICogU3VibWl0cyB0aGUgZm9ybSBvYmplY3QgdG8gTWFpbGNoaW1wXG4gICogQHBhcmFtIHtvYmplY3R9IGZvcm1EYXRhIC0gZm9ybSBmaWVsZHNcbiAgKi9cbiAgZnVuY3Rpb24gc3VibWl0U2lnbnVwKGZvcm1EYXRhKXtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiAkc2lnbnVwRm9ybXMuYXR0cignYWN0aW9uJyksXG4gICAgICB0eXBlOiAkc2lnbnVwRm9ybXMuYXR0cignbWV0aG9kJyksXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLC8vbm8ganNvbnBcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UucmVzdWx0ICE9PSAnc3VjY2Vzcycpe1xuICAgICAgICAgIGlmKHJlc3BvbnNlLm1zZy5pbmNsdWRlcygndG9vIG1hbnkgcmVjZW50IHNpZ251cCByZXF1ZXN0cycpKXtcbiAgICAgICAgICAgICRzaWdudXBGb3Jtcy5maW5kKCcuZ3VueS1lcnJvcicpLmh0bWwoJzxwPlRoZXJlIHdhcyBhIHByb2JsZW0gd2l0aCB5b3VyIHN1YnNjcmlwdGlvbi48L3A+Jyk7XG4gICAgICAgICAgfWVsc2UgaWYocmVzcG9uc2UubXNnLmluY2x1ZGVzKCdhbHJlYWR5IHN1YnNjcmliZWQnKSl7XG4gICAgICAgICAgICAkc2lnbnVwRm9ybXMuZmluZCgnLmd1bnktZXJyb3InKS5odG1sKCc8cD5Zb3UgYXJlIGFscmVhZHkgc2lnbmVkIHVwIGZvciB1cGRhdGVzISBDaGVjayB5b3VyIGVtYWlsLjwvcD4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAkc2lnbnVwRm9ybXMuaHRtbCgnPHAgY2xhc3M9XCJjLXNpZ251cC1mb3JtX19zdWNjZXNzXCI+T25lIG1vcmUgc3RlcCEgPGJyIC8+IFBsZWFzZSBjaGVjayB5b3VyIGluYm94IGFuZCBjb25maXJtIHlvdXIgZW1haWwgYWRkcmVzcyB0byBzdGFydCByZWNlaXZpbmcgdXBkYXRlcy4gPGJyIC8+VGhhbmtzIGZvciBzaWduaW5nIHVwITwvcD4nKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2lnbnVwRm9ybXMuZmluZCgnLmd1bnktZXJyb3InKS5odG1sKCc8cD5UaGVyZSB3YXMgYSBwcm9ibGVtIHdpdGggeW91ciBzdWJzY3JpcHRpb24uIENoZWNrIGJhY2sgbGF0ZXIuPC9wPicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIFxuICAvKipcbiAgKiBUcmlnZ2VycyBmb3JtIHZhbGlkYXRpb24gYW5kIHNlbmRzIHRoZSBmb3JtIGRhdGEgdG8gTWFpbGNoaW1wXG4gICogQHBhcmFtIHtvYmplY3R9IGZvcm1EYXRhIC0gZm9ybSBmaWVsZHNcbiAgKi9cbiAgaWYgKCRzaWdudXBGb3Jtcy5sZW5ndGgpIHtcbiAgICAkc2lnbnVwRm9ybXMuZmluZCgnW3R5cGU9XCJzdWJtaXRcIl0nKS5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICB2YWxpZGF0ZUZpZWxkcygkc2lnbnVwRm9ybXMsIGV2ZW50KTtcbiAgICB9KVxuXG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL25ld3NsZXR0ZXItc2lnbnVwLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBbe1wiYm9yb3VnaFwiOlwiQnJvbnhcIixcImNvZGVzXCI6WzEwNDUxLDEwNDUyLDEwNDUzLDEwNDU0LDEwNDU1LDEwNDU2LDEwNDU3LDEwNDU4LDEwNDU5LDEwNDYwLDEwNDYxLDEwNDYyLDEwNDYzLDEwNDY0LDEwNDY1LDEwNDY2LDEwNDY3LDEwNDY4LDEwNDY5LDEwNDcwLDEwNDcxLDEwNDcyLDEwNDczLDEwNDc0LDEwNDc1XX0se1wiYm9yb3VnaFwiOlwiQnJvb2tseW5cIixcImNvZGVzXCI6WzExMjAxLDExMjAyLDExMjAzLDExMjA0LDExMjA1LDExMjA2LDExMjA3LDExMjA4LDExMjA5LDExMjEwLDExMjExLDExMjEyLDExMjEzLDExMjE0LDExMjE1LDExMjE2LDExMjE3LDExMjE4LDExMjE5LDExMjIwLDExMjIxLDExMjIyLDExMjIzLDExMjI0LDExMjI1LDExMjI2LDExMjI4LDExMjI5LDExMjMwLDExMjMxLDExMjMyLDExMjMzLDExMjM0LDExMjM1LDExMjM2LDExMjM3LDExMjM4LDExMjM5LDExMjQxLDExMjQyLDExMjQzLDExMjQ1LDExMjQ3LDExMjQ5LDExMjUxLDExMjUyLDExMjU2XX0se1wiYm9yb3VnaFwiOlwiTWFuaGF0dGFuXCIsXCJjb2Rlc1wiOlsxMDAwMSwxMDAwMiwxMDAwMywxMDAwNCwxMDAwNSwxMDAwNiwxMDAwNywxMDAwOCwxMDAwOSwxMDAxMCwxMDAxMSwxMDAxMiwxMDAxMywxMDAxNCwxMDAxNiwxMDAxNywxMDAxOCwxMDAxOSwxMDAyMCwxMDAyMSwxMDAyMiwxMDAyMywxMDAyNCwxMDAyNSwxMDAyNywxMDAyOCwxMDAyOSwxMDAzMCwxMDAzMSwxMDAzMiwxMDAzMywxMDAzNCwxMDAzNSwxMDAzNiwxMDAzNywxMDAzOCwxMDAzOSwxMDA0MCwxMDA0MSwxMDA0NSwxMDA1NSwxMDA4MSwxMDA4NywxMDEwMSwxMDEwMywxMDEwNCwxMDEwNSwxMDEwNiwxMDEwNywxMDEwOCwxMDEwOSwxMDExMCwxMDExMSwxMDExMiwxMDExMywxMDExNCwxMDExNSwxMDExNiwxMDExOCwxMDExOSwxMDEyMCwxMDEyMSwxMDEyMiwxMDEyMywxMDEyOCwxMDE1MCwxMDE1MSwxMDE1MiwxMDE1MywxMDE1NCwxMDE1NSwxMDE1NiwxMDE1OCwxMDE1OSwxMDE2MiwxMDE2NSwxMDE2NiwxMDE2NywxMDE2OCwxMDE2OSwxMDE3MCwxMDE3MSwxMDE3MiwxMDE3MywxMDE3NCwxMDE3NSwxMDE3NiwxMDE3NywxMDE3OCwxMDE4NSwxMDE5OSwxMDIxMiwxMDI0OSwxMDI1NiwxMDI1OSwxMDI2MSwxMDI2OCwxMDI3MCwxMDI3MSwxMDI3NiwxMDI3OCwxMDI3OSwxMDI4MCwxMDI4MSwxMDI4MiwxMDI4Nl19LHtcImJvcm91Z2hcIjpcIlF1ZWVuc1wiLFwiY29kZXNcIjpbMTExMDEsMTExMDIsMTExMDMsMTExMDQsMTExMDYsMTExMDksMTExMjAsMTEzNTEsMTEzNTIsMTEzNTQsMTEzNTUsMTEzNTYsMTEzNTcsMTEzNTgsMTEzNTksMTEzNjAsMTEzNjEsMTEzNjIsMTEzNjMsMTEzNjQsMTEzNjUsMTEzNjYsMTEzNjcsMTEzNjgsMTEzNjksMTEzNzAsMTEzNzEsMTEzNzIsMTEzNzMsMTEzNzQsMTEzNzUsMTEzNzcsMTEzNzgsMTEzNzksMTEzODAsMTEzODEsMTEzODUsMTEzODYsMTE0MDUsMTE0MTEsMTE0MTMsMTE0MTQsMTE0MTUsMTE0MTYsMTE0MTcsMTE0MTgsMTE0MTksMTE0MjAsMTE0MjEsMTE0MjIsMTE0MjMsMTE0MjQsMTE0MjUsMTE0MjYsMTE0MjcsMTE0MjgsMTE0MjksMTE0MzAsMTE0MzEsMTE0MzIsMTE0MzMsMTE0MzQsMTE0MzUsMTE0MzYsMTE0MzksMTE0NTEsMTE2OTAsMTE2OTEsMTE2OTIsMTE2OTMsMTE2OTQsMTE2OTUsMTE2OTddfSx7XCJib3JvdWdoXCI6XCJTdGF0ZW4gSXNsYW5kXCIsXCJjb2Rlc1wiOlsxMDMwMSwxMDMwMiwxMDMwMywxMDMwNCwxMDMwNSwxMDMwNiwxMDMwNywxMDMwOCwxMDMwOSwxMDMxMCwxMDMxMSwxMDMxMiwxMDMxMywxMDMxNF19XVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL21vZHVsZXMvZGF0YS96aXBjb2Rlcy5qc29uXG4vLyBtb2R1bGUgaWQgPSA2MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiogRm9ybSBFZmZlY3RzIG1vZHVsZVxuKiBAbW9kdWxlIG1vZHVsZXMvZm9ybUVmZmVjdHNcbiogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29kcm9wcy9UZXh0SW5wdXRFZmZlY3RzL2Jsb2IvbWFzdGVyL2luZGV4Mi5odG1sXG4qL1xuXG5pbXBvcnQgZm9yRWFjaCBmcm9tICdsb2Rhc2gvZm9yRWFjaCc7XG5pbXBvcnQgZGlzcGF0Y2hFdmVudCBmcm9tICcuL2Rpc3BhdGNoRXZlbnQuanMnO1xuXG4vKipcbiogVXRpbGl0eSBmdW5jdGlvbiB0byBzZXQgYW4gJ2lzLWZpbGxlZCcgY2xhc3Mgb24gaW5wdXRzIHRoYXQgYXJlIGZvY3VzZWQgb3JcbiogY29udGFpbiB0ZXh0LiBDYW4gdGhlbiBiZSB1c2VkIHRvIGFkZCBlZmZlY3RzIHRvIHRoZSBmb3JtLCBzdWNoIGFzIG1vdmluZ1xuKiB0aGUgbGFiZWwuXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIC8qKlxuICAqIEFkZCB0aGUgZmlsbGVkIGNsYXNzIHdoZW4gaW5wdXQgaXMgZm9jdXNlZFxuICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlRm9jdXMoZXZlbnQpIHtcbiAgICBjb25zdCB3cmFwcGVyRWxlbSA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlO1xuICAgIHdyYXBwZXJFbGVtLmNsYXNzTGlzdC5hZGQoJ2lzLWZpbGxlZCcpO1xuICB9XG5cbiAgLyoqXG4gICogUmVtb3ZlIHRoZSBmaWxsZWQgY2xhc3Mgd2hlbiBpbnB1dCBpcyBibHVycmVkIGlmIGl0IGRvZXMgbm90IGNvbnRhaW4gdGV4dFxuICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlQmx1cihldmVudCkge1xuICAgIGlmIChldmVudC50YXJnZXQudmFsdWUudHJpbSgpID09PSAnJykge1xuICAgICAgY29uc3Qgd3JhcHBlckVsZW0gPSBldmVudC50YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgIHdyYXBwZXJFbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWZpbGxlZCcpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaWdudXAtZm9ybV9fZmllbGQnKTtcbiAgaWYgKGlucHV0cy5sZW5ndGgpIHtcbiAgICBmb3JFYWNoKGlucHV0cywgZnVuY3Rpb24oaW5wdXRFbGVtKSB7XG4gICAgICBpbnB1dEVsZW0uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBoYW5kbGVGb2N1cyk7XG4gICAgICBpbnB1dEVsZW0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGhhbmRsZUJsdXIpO1xuICAgICAgZGlzcGF0Y2hFdmVudChpbnB1dEVsZW0sICdibHVyJyk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2Zvcm1FZmZlY3RzLmpzIiwiLyoqXG4qIENyb3NzLWJyb3dzZXIgdXRpbGl0eSB0byBmaXJlIGV2ZW50c1xuKiBAcGFyYW0ge29iamVjdH0gZWxlbSAtIERPTSBlbGVtZW50IHRvIGZpcmUgZXZlbnQgb25cbiogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIEV2ZW50IHR5cGUsIGkuZS4gJ3Jlc2l6ZScsICdjbGljaydcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihlbGVtLCBldmVudFR5cGUpIHtcbiAgbGV0IGV2ZW50O1xuICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcbiAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG4gICAgZXZlbnQuaW5pdEV2ZW50KGV2ZW50VHlwZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgZWxlbS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfSBlbHNlIHtcbiAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gICAgZWxlbS5maXJlRXZlbnQoJ29uJyArIGV2ZW50VHlwZSwgZXZlbnQpO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9kaXNwYXRjaEV2ZW50LmpzIiwiLyoqXG4qIEZhY2V0V1AgRXZlbnQgSGFuZGxpbmdcbiogUmVxdWlyZXMgZnJvbnQuanMsIHdoaWNoIGlzIGFkZGVkIGJ5IHRoZSBGYWNldFdQIHBsdWdpblxuKiBBbHNvIHJlcXVpcmVzIGpRdWVyeSBhcyBGYWNldFdQIGl0c2VsZiByZXF1aXJlcyBqUXVlcnlcbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICAkKGRvY3VtZW50KS5vbignZmFjZXR3cC1yZWZyZXNoJywgZnVuY3Rpb24oKSB7XG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdmYWNldHdwLWlzLWxvYWRlZCcpLmFkZENsYXNzKCdmYWNldHdwLWlzLWxvYWRpbmcnKTtcbiAgICAkKCdodG1sLCBib2R5Jykuc2Nyb2xsVG9wKDApO1xuICB9KTtcblxuICAkKGRvY3VtZW50KS5vbignZmFjZXR3cC1sb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2ZhY2V0d3AtaXMtbG9hZGluZycpLmFkZENsYXNzKCdmYWNldHdwLWlzLWxvYWRlZCcpO1xuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2ZhY2V0cy5qcyIsIi8qKlxyXG4qIE93bCBTZXR0aW5ncyBtb2R1bGVcclxuKiBAbW9kdWxlIG1vZHVsZXMvb3dsU2V0dGluZ3NcclxuKiBAc2VlIGh0dHBzOi8vb3dsY2Fyb3VzZWwyLmdpdGh1Yi5pby9Pd2xDYXJvdXNlbDIvaW5kZXguaHRtbFxyXG4qL1xyXG5cclxuLyoqXHJcbiogb3dsIGNhcm91c2VsIHNldHRpbmdzIGFuZCB0byBtYWtlIHRoZSBvd2wgY2Fyb3VzZWwgd29yay5cclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcbiAgdmFyIG93bCA9ICQoJy5vd2wtY2Fyb3VzZWwnKTtcclxuICBvd2wub3dsQ2Fyb3VzZWwoe1xyXG4gICAgYW5pbWF0ZUluOiAnZmFkZUluJyxcclxuICAgIGFuaW1hdGVPdXQ6ICdmYWRlT3V0JyxcclxuICAgIGl0ZW1zOjEsXHJcbiAgICBsb29wOnRydWUsXHJcbiAgICBtYXJnaW46MCxcclxuICAgIGRvdHM6IHRydWUsXHJcbiAgICBhdXRvcGxheTp0cnVlLFxyXG4gICAgYXV0b3BsYXlUaW1lb3V0OjUwMDAsXHJcbiAgICBhdXRvcGxheUhvdmVyUGF1c2U6dHJ1ZVxyXG4gIH0pO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvb3dsU2V0dGluZ3MuanMiLCIvKipcbiogaU9TNyBpUGFkIEhhY2tcbiogZm9yIGhlcm8gaW1hZ2UgZmxpY2tlcmluZyBpc3N1ZS5cbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBhZDsuKkNQVS4qT1MgN19cXGQvaSkpIHtcbiAgICAkKCcuYy1zaWRlLWhlcm8nKS5oZWlnaHQod2luZG93LmlubmVySGVpZ2h0KTtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL2lPUzdIYWNrLmpzIiwiLyogZXNsaW50LWVudiBicm93c2VyICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgQ29va2llcyBmcm9tICdqcy1jb29raWUnO1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi4vdmVuZG9yL3V0aWxpdHkuanMnO1xuaW1wb3J0IENsZWF2ZSBmcm9tICdjbGVhdmUuanMvZGlzdC9jbGVhdmUubWluJztcbmltcG9ydCAnY2xlYXZlLmpzL2Rpc3QvYWRkb25zL2NsZWF2ZS1waG9uZS51cyc7XG5cbi8qIGVzbGludCBuby11bmRlZjogXCJvZmZcIiAqL1xuY29uc3QgVmFyaWFibGVzID0gcmVxdWlyZSgnLi4vLi4vdmFyaWFibGVzLmpzb24nKTtcblxuLyoqXG4gKiBUaGlzIGNvbXBvbmVudCBoYW5kbGVzIHZhbGlkYXRpb24gYW5kIHN1Ym1pc3Npb24gZm9yIHNoYXJlIGJ5IGVtYWlsIGFuZFxuICogc2hhcmUgYnkgU01TIGZvcm1zLlxuLyoqXG4qIEFkZHMgZnVuY3Rpb25hbGl0eSB0byB0aGUgaW5wdXQgaW4gdGhlIHNlYXJjaCByZXN1bHRzIGhlYWRlclxuKi9cblxuY2xhc3MgU2hhcmVGb3JtIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGh0bWwgZm9ybSBlbGVtZW50IGZvciB0aGUgY29tcG9uZW50LlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsKSB7XG4gICAgLyoqIEBwcml2YXRlIHtIVE1MRWxlbWVudH0gVGhlIGNvbXBvbmVudCBlbGVtZW50LiAqL1xuICAgIHRoaXMuX2VsID0gZWw7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhpcyBmb3JtIGlzIHZhbGlkLiAqL1xuICAgIHRoaXMuX2lzVmFsaWQgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZm9ybSBpcyBjdXJyZW50bHkgc3VibWl0dGluZy4gKi9cbiAgICB0aGlzLl9pc0J1c3kgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZm9ybSBpcyBkaXNhYmxlZC4gKi9cbiAgICB0aGlzLl9pc0Rpc2FibGVkID0gZmFsc2U7XG5cbiAgICAvKiogQHByaXZhdGUge2Jvb2xlYW59IFdoZXRoZXIgdGhpcyBjb21wb25lbnQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICovXG4gICAgdGhpcy5faW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZ29vZ2xlIHJlQ0FQVENIQSB3aWRnZXQgaXMgcmVxdWlyZWQuICovXG4gICAgdGhpcy5fcmVjYXB0Y2hhUmVxdWlyZWQgPSBmYWxzZTtcblxuICAgIC8qKiBAcHJpdmF0ZSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZ29vZ2xlIHJlQ0FQVENIQSB3aWRnZXQgaGFzIHBhc3NlZC4gKi9cbiAgICB0aGlzLl9yZWNhcHRjaGFWZXJpZmllZCA9IGZhbHNlO1xuXG4gICAgLyoqIEBwcml2YXRlIHtib29sZWFufSBXaGV0aGVyIHRoZSBnb29nbGUgcmVDQVBUQ0hBIHdpZGdldCBpcyBpbml0aWxhaXNlZC4gKi9cbiAgICB0aGlzLl9yZWNhcHRjaGFpbml0ID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhpcyBjb21wb25lbnQgaGFzIG5vdCB5ZXQgYmVlbiBpbml0aWFsaXplZCwgYXR0YWNoZXMgZXZlbnQgbGlzdGVuZXJzLlxuICAgKiBAbWV0aG9kXG4gICAqIEByZXR1cm4ge3RoaXN9IFNoYXJlRm9ybVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICBpZiAodGhpcy5faW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuX2VsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJ0ZWxcIl0nKTtcblxuICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgdGhpcy5fbWFza1Bob25lKHNlbGVjdGVkKTtcbiAgICB9XG5cbiAgICAkKGAuJHtTaGFyZUZvcm0uQ3NzQ2xhc3MuU0hPV19ESVNDTEFJTUVSfWApXG4gICAgICAub24oJ2ZvY3VzJywgKCkgPT4ge1xuICAgICAgICB0aGlzLl9kaXNjbGFpbWVyKHRydWUpO1xuICAgICAgfSk7XG5cbiAgICAkKHRoaXMuX2VsKS5vbignc3VibWl0JywgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAodGhpcy5fcmVjYXB0Y2hhUmVxdWlyZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlY2FwdGNoYVZlcmlmaWVkKSB7XG4gICAgICAgICAgdGhpcy5fdmFsaWRhdGUoKTtcbiAgICAgICAgICBpZiAodGhpcy5faXNWYWxpZCAmJiAhdGhpcy5faXNCdXN5ICYmICF0aGlzLl9pc0Rpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9zdWJtaXQoKTtcbiAgICAgICAgICAgIHdpbmRvdy5ncmVjYXB0Y2hhLnJlc2V0KCk7XG4gICAgICAgICAgICAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpLmFkZENsYXNzKCdyZWNhcHRjaGEtanMnKTtcbiAgICAgICAgICAgIHRoaXMuX3JlY2FwdGNoYVZlcmlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQodGhpcy5fZWwpLmZpbmQoYC4ke1NoYXJlRm9ybS5Dc3NDbGFzcy5FUlJPUl9NU0d9YCkucmVtb3ZlKCk7XG4gICAgICAgICAgdGhpcy5fc2hvd0Vycm9yKFNoYXJlRm9ybS5NZXNzYWdlLlJFQ0FQVENIQSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlKCk7XG4gICAgICAgIGlmICh0aGlzLl9pc1ZhbGlkICYmICF0aGlzLl9pc0J1c3kgJiYgIXRoaXMuX2lzRGlzYWJsZWQpIHtcbiAgICAgICAgICB0aGlzLl9zdWJtaXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAvLyBEZXRlcm1pbmUgd2hldGhlciBvciBub3QgdG8gaW5pdGlhbGl6ZSBSZUNBUFRDSEEuIFRoaXMgc2hvdWxkIGJlXG4gICAgICAvLyAvLyBpbml0aWFsaXplZCBvbmx5IG9uIGV2ZXJ5IDEwdGggdmlldyB3aGljaCBpcyBkZXRlcm1pbmVkIHZpYSBhblxuICAgICAgLy8gLy8gaW5jcmVtZW50aW5nIGNvb2tpZS5cbiAgICAgIGxldCB2aWV3Q291bnQgPSBDb29raWVzLmdldCgnc2NyZWVuZXJWaWV3cycpID9cbiAgICAgICAgcGFyc2VJbnQoQ29va2llcy5nZXQoJ3NjcmVlbmVyVmlld3MnKSwgMTApIDogMTtcbiAgICAgIGlmICh2aWV3Q291bnQgPj0gNSAmJiAhdGhpcy5fcmVjYXB0Y2hhaW5pdCkge1xuICAgICAgICAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpLmFkZENsYXNzKCdyZWNhcHRjaGEtanMnKTtcbiAgICAgICAgdGhpcy5faW5pdFJlY2FwdGNoYSgpO1xuICAgICAgICB0aGlzLl9yZWNhcHRjaGFpbml0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIENvb2tpZXMuc2V0KCdzY3JlZW5lclZpZXdzJywgKyt2aWV3Q291bnQsIHtleHBpcmVzOiAoMi8xNDQwKX0pO1xuXG4gICAgICAkKFwiI3Bob25lXCIpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoJ3BsYWNlaG9sZGVyJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIC8vIERldGVybWluZSB3aGV0aGVyIG9yIG5vdCB0byBpbml0aWFsaXplIFJlQ0FQVENIQS4gVGhpcyBzaG91bGQgYmVcbiAgICAvLyAvLyBpbml0aWFsaXplZCBvbmx5IG9uIGV2ZXJ5IDEwdGggdmlldyB3aGljaCBpcyBkZXRlcm1pbmVkIHZpYSBhblxuICAgIC8vIC8vIGluY3JlbWVudGluZyBjb29raWUuXG4gICAgbGV0IHZpZXdDb3VudCA9IENvb2tpZXMuZ2V0KCdzY3JlZW5lclZpZXdzJykgP1xuICAgICAgcGFyc2VJbnQoQ29va2llcy5nZXQoJ3NjcmVlbmVyVmlld3MnKSwgMTApIDogMTtcbiAgICBpZiAodmlld0NvdW50ID49IDUgJiYgIXRoaXMuX3JlY2FwdGNoYWluaXQgKSB7XG4gICAgICAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpLmFkZENsYXNzKCdyZWNhcHRjaGEtanMnKTtcbiAgICAgIHRoaXMuX2luaXRSZWNhcHRjaGEoKTtcbiAgICAgIHRoaXMuX3JlY2FwdGNoYWluaXQgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFzayBlYWNoIHBob25lIG51bWJlciBhbmQgcHJvcGVybHkgZm9ybWF0IGl0XG4gICAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBpbnB1dCB0aGUgXCJ0ZWxcIiBpbnB1dCB0byBtYXNrXG4gICAqIEByZXR1cm4ge2NvbnN0cnVjdG9yfSAgICAgICB0aGUgaW5wdXQgbWFza1xuICAgKi9cbiAgX21hc2tQaG9uZShpbnB1dCkge1xuICAgIGxldCBjbGVhdmUgPSBuZXcgQ2xlYXZlKGlucHV0LCB7XG4gICAgICBwaG9uZTogdHJ1ZSxcbiAgICAgIHBob25lUmVnaW9uQ29kZTogJ3VzJyxcbiAgICAgIGRlbGltaXRlcjogJy0nXG4gICAgfSk7XG4gICAgaW5wdXQuY2xlYXZlID0gY2xlYXZlO1xuICAgIHJldHVybiBpbnB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBkaXNjbGFpbWVyIHZpc2liaWxpdHlcbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gdmlzaWJsZSAtIHdldGhlciB0aGUgZGlzY2xhaW1lciBzaG91bGQgYmUgdmlzaWJsZSBvciBub3RcbiAgICovXG4gIF9kaXNjbGFpbWVyKHZpc2libGUgPSB0cnVlKSB7XG4gICAgbGV0ICRlbCA9ICQoJyNqcy1kaXNjbGFpbWVyJyk7XG4gICAgbGV0ICRjbGFzcyA9ICh2aXNpYmxlKSA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnO1xuICAgICRlbC5hdHRyKCdhcmlhLWhpZGRlbicsICF2aXNpYmxlKTtcbiAgICAkZWwuYXR0cihTaGFyZUZvcm0uQ3NzQ2xhc3MuSElEREVOLCAhdmlzaWJsZSk7XG4gICAgJGVsWyRjbGFzc10oU2hhcmVGb3JtLkNzc0NsYXNzLkFOSU1BVEVfRElTQ0xBSU1FUik7XG4gICAgLy8gU2Nyb2xsLXRvIGZ1bmN0aW9uYWxpdHkgZm9yIG1vYmlsZVxuICAgIGlmIChcbiAgICAgIHdpbmRvdy5zY3JvbGxUbyAmJlxuICAgICAgdmlzaWJsZSAmJlxuICAgICAgd2luZG93LmlubmVyV2lkdGggPCBWYXJpYWJsZXNbJ3NjcmVlbi1kZXNrdG9wJ11cbiAgICApIHtcbiAgICAgIGxldCAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oXG4gICAgICAgIDAsICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gJHRhcmdldC5kYXRhKCdzY3JvbGxPZmZzZXQnKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUnVucyB2YWxpZGF0aW9uIHJ1bGVzIGFuZCBzZXRzIHZhbGlkaXR5IG9mIGNvbXBvbmVudC5cbiAgICogQG1ldGhvZFxuICAgKiBAcmV0dXJuIHt0aGlzfSBTaGFyZUZvcm1cbiAgICovXG4gIF92YWxpZGF0ZSgpIHtcbiAgICBsZXQgdmFsaWRpdHkgPSB0cnVlO1xuICAgIGNvbnN0ICR0ZWwgPSAkKHRoaXMuX2VsKS5maW5kKCdpbnB1dFt0eXBlPVwidGVsXCJdJyk7XG4gICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIGVycm9yIG1lc3NhZ2VzLlxuICAgICQodGhpcy5fZWwpLmZpbmQoYC4ke1NoYXJlRm9ybS5Dc3NDbGFzcy5FUlJPUl9NU0d9YCkucmVtb3ZlKCk7XG5cbiAgICBpZiAoJHRlbC5sZW5ndGgpIHtcbiAgICAgIHZhbGlkaXR5ID0gdGhpcy5fdmFsaWRhdGVQaG9uZU51bWJlcigkdGVsWzBdKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1ZhbGlkID0gdmFsaWRpdHk7XG4gICAgaWYgKHRoaXMuX2lzVmFsaWQpIHtcbiAgICAgICQodGhpcy5fZWwpLnJlbW92ZUNsYXNzKFNoYXJlRm9ybS5Dc3NDbGFzcy5FUlJPUik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBhIGdpdmVuIGlucHV0LCBjaGVja3MgdG8gc2VlIGlmIGl0cyB2YWx1ZSBpcyBhIHZhbGlkIFBob25lbnVtYmVyLiBJZiBub3QsXG4gICAqIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgYW5kIHNldHMgYW4gZXJyb3IgY2xhc3Mgb24gdGhlIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGlucHV0IC0gVGhlIGh0bWwgZm9ybSBlbGVtZW50IGZvciB0aGUgY29tcG9uZW50LlxuICAgKiBAcmV0dXJuIHtib29sZWFufSAtIFZhbGlkIGVtYWlsLlxuICAgKi9cbiAgX3ZhbGlkYXRlUGhvbmVOdW1iZXIoaW5wdXQpe1xuICAgIGxldCBudW0gPSB0aGlzLl9wYXJzZVBob25lTnVtYmVyKGlucHV0LnZhbHVlKTsgLy8gcGFyc2UgdGhlIG51bWJlclxuICAgIG51bSA9IChudW0pID8gbnVtLmpvaW4oJycpIDogMDsgLy8gaWYgbnVtIGlzIG51bGwsIHRoZXJlIGFyZSBubyBudW1iZXJzXG4gICAgaWYgKG51bS5sZW5ndGggPT09IDEwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTsgLy8gYXNzdW1lIGl0IGlzIHBob25lIG51bWJlclxuICAgIH1cbiAgICB0aGlzLl9zaG93RXJyb3IoU2hhcmVGb3JtLk1lc3NhZ2UuUEhPTkUpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyB2YXIgcGhvbmVubyA9IC9eXFwrPyhbMC05XXsyfSlcXCk/Wy0uIF0/KFswLTldezR9KVstLiBdPyhbMC05XXs0fSkkLztcbiAgICAvLyB2YXIgcGhvbmVubyA9ICgvXlxcKz9bMS05XVxcZHsxLDE0fSQvKTtcbiAgICAvLyBpZighaW5wdXQudmFsdWUubWF0Y2gocGhvbmVubykpe1xuICAgIC8vICAgdGhpcy5fc2hvd0Vycm9yKFNoYXJlRm9ybS5NZXNzYWdlLlBIT05FKTtcbiAgICAvLyAgIHJldHVybiBmYWxzZTtcbiAgICAvLyB9XG4gICAgLy8gcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGp1c3QgdGhlIHBob25lIG51bWJlciBvZiBhIGdpdmVuIHZhbHVlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdmFsdWUgVGhlIHN0cmluZyB0byBnZXQgbnVtYmVycyBmcm9tXG4gICAqIEByZXR1cm4ge2FycmF5fSAgICAgICBBbiBhcnJheSB3aXRoIG1hdGNoZWQgYmxvY2tzXG4gICAqL1xuICBfcGFyc2VQaG9uZU51bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXRjaCgvXFxkKy9nKTsgLy8gZ2V0IG9ubHkgZGlnaXRzXG4gIH1cblxuICAvKipcbiAgICogRm9yIGEgZ2l2ZW4gaW5wdXQsIGNoZWNrcyB0byBzZWUgaWYgaXQgaGFzIGEgdmFsdWUuIElmIG5vdCwgZGlzcGxheXMgYW5cbiAgICogZXJyb3IgbWVzc2FnZSBhbmQgc2V0cyBhbiBlcnJvciBjbGFzcyBvbiB0aGUgZWxlbWVudC5cbiAgICogQG1ldGhvZFxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpbnB1dCAtIFRoZSBodG1sIGZvcm0gZWxlbWVudCBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gLSBWYWxpZCByZXF1aXJlZCBmaWVsZC5cbiAgICovXG4gIF92YWxpZGF0ZVJlcXVpcmVkKGlucHV0KSB7XG4gICAgaWYgKCQoaW5wdXQpLnZhbCgpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5fc2hvd0Vycm9yKFNoYXJlRm9ybS5NZXNzYWdlLlJFUVVJUkVEKTtcbiAgICAkKGlucHV0KS5vbmUoJ2tleXVwJywgZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgYnkgYXBwZW5kaW5nIGEgZGl2IHRvIHRoZSBmb3JtLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnIC0gRXJyb3IgbWVzc2FnZSB0byBkaXNwbGF5LlxuICAgKiBAcmV0dXJuIHt0aGlzfSBTaGFyZUZvcm0gLSBzaGFyZWZvcm1cbiAgICovXG4gIF9zaG93RXJyb3IobXNnKSB7XG4gICAgbGV0ICRlbFBhcmVudHMgPSAkKHRoaXMuX2VsKS5wYXJlbnRzKCcuYy10aXAtbXNfX3RvcGljcycpO1xuICAgICQoJyNzbXMtZm9ybS1tc2cnKS5hZGRDbGFzcyhTaGFyZUZvcm0uQ3NzQ2xhc3MuRVJST1IpLnRleHQoVXRpbGl0eS5sb2NhbGl6ZShtc2cpKTtcbiAgICAkZWxQYXJlbnRzLnJlbW92ZUNsYXNzKCdzdWNjZXNzLWpzJyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIFwic3VjY2Vzc1wiIGNsYXNzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnIC0gRXJyb3IgbWVzc2FnZSB0byBkaXNwbGF5LlxuICAgKiBAcmV0dXJuIHt0aGlzfSBTaGFyZUZvcm1cbiAgICovXG4gIF9zaG93U3VjY2Vzcyhtc2cpIHtcbiAgICBsZXQgJGVsUGFyZW50cyA9ICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJyk7XG4gICAgJCgnI3Bob25lJykuYXR0cihcInBsYWNlaG9sZGVyXCIsIFV0aWxpdHkubG9jYWxpemUobXNnKSk7XG4gICAgJCgnI3Ntc2J1dHRvbicpLnRleHQoXCJTZW5kIEFub3RoZXJcIik7XG4gICAgJCgnI3Ntcy1mb3JtLW1zZycpLmFkZENsYXNzKFNoYXJlRm9ybS5Dc3NDbGFzcy5TVUNDRVNTKS50ZXh0KCcnKTtcbiAgICAkZWxQYXJlbnRzLnJlbW92ZUNsYXNzKCdzdWNjZXNzLWpzJyk7XG4gICAgJGVsUGFyZW50cy5hZGRDbGFzcygnc3VjY2Vzcy1qcycpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1Ym1pdHMgdGhlIGZvcm0uXG4gICAqIEByZXR1cm4ge2pxWEhSfSBkZWZlcnJlZCByZXNwb25zZSBvYmplY3RcbiAgICovXG4gIF9zdWJtaXQoKSB7XG4gICAgdGhpcy5faXNCdXN5ID0gdHJ1ZTtcbiAgICBsZXQgJHNwaW5uZXIgPSB0aGlzLl9lbC5xdWVyeVNlbGVjdG9yKGAuJHtTaGFyZUZvcm0uQ3NzQ2xhc3MuU1BJTk5FUn1gKTtcbiAgICBsZXQgJHN1Ym1pdCA9IHRoaXMuX2VsLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJyk7XG4gICAgY29uc3QgcGF5bG9hZCA9ICQodGhpcy5fZWwpLnNlcmlhbGl6ZSgpO1xuICAgICQodGhpcy5fZWwpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICBpZiAoJHNwaW5uZXIpIHtcbiAgICAgICRzdWJtaXQuZGlzYWJsZWQgPSB0cnVlOyAvLyBoaWRlIHN1Ym1pdCBidXR0b25cbiAgICAgICRzcGlubmVyLnN0eWxlLmNzc1RleHQgPSAnJzsgLy8gc2hvdyBzcGlubmVyXG4gICAgfVxuICAgIHJldHVybiAkLnBvc3QoJCh0aGlzLl9lbCkuYXR0cignYWN0aW9uJyksIHBheWxvYWQpLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy5fZWwucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fc2hvd1N1Y2Nlc3MoU2hhcmVGb3JtLk1lc3NhZ2UuU1VDQ0VTUyk7XG4gICAgICAgIHRoaXMuX2lzRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAkKHRoaXMuX2VsKS5vbmUoJ2tleXVwJywgJ2lucHV0JywgKCkgPT4ge1xuICAgICAgICAgICQodGhpcy5fZWwpLnJlbW92ZUNsYXNzKFNoYXJlRm9ybS5Dc3NDbGFzcy5TVUNDRVNTKTtcbiAgICAgICAgICB0aGlzLl9pc0Rpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2hvd0Vycm9yKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLm1lc3NhZ2UpKTtcbiAgICAgIH1cbiAgICB9KS5mYWlsKGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fc2hvd0Vycm9yKFNoYXJlRm9ybS5NZXNzYWdlLlNFUlZFUik7XG4gICAgfSkuYWx3YXlzKCgpID0+IHtcbiAgICAgICQodGhpcy5fZWwpLmZpbmQoJ2lucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICBpZiAoJHNwaW5uZXIpIHtcbiAgICAgICAgJHN1Ym1pdC5kaXNhYmxlZCA9IGZhbHNlOyAvLyBzaG93IHN1Ym1pdCBidXR0b25cbiAgICAgICAgJHNwaW5uZXIuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJzsgLy8gaGlkZSBzcGlubmVyO1xuICAgICAgfVxuICAgICAgdGhpcy5faXNCdXN5ID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXN5bmNocm9ub3VzbHkgbG9hZHMgdGhlIEdvb2dsZSByZWNhcHRjaGEgc2NyaXB0IGFuZCBzZXRzIGNhbGxiYWNrcyBmb3JcbiAgICogbG9hZCwgc3VjY2VzcywgYW5kIGV4cGlyYXRpb24uXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge3RoaXN9IFNjcmVlbmVyXG4gICAqL1xuICBfaW5pdFJlY2FwdGNoYSgpIHtcbiAgICBjb25zdCAkc2NyaXB0ID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKSk7XG4gICAgJHNjcmlwdC5hdHRyKCdzcmMnLFxuICAgICAgICAnaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9yZWNhcHRjaGEvYXBpLmpzJyArXG4gICAgICAgICc/b25sb2FkPXNjcmVlbmVyQ2FsbGJhY2smcmVuZGVyPWV4cGxpY2l0JykucHJvcCh7XG4gICAgICBhc3luYzogdHJ1ZSxcbiAgICAgIGRlZmVyOiB0cnVlXG4gICAgfSk7XG5cbiAgICB3aW5kb3cuc2NyZWVuZXJDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHdpbmRvdy5ncmVjYXB0Y2hhLnJlbmRlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuZXItcmVjYXB0Y2hhJyksIHtcbiAgICAgICAgJ3NpdGVrZXknIDogJzZMZWtJQ1lVQUFBQUFPUjJ1WjBhanlXdDlYeER1c3BIUFVBa1J6QUInLFxuICAgICAgICAvL0JlbG93IGlzIHRoZSBsb2NhbCBob3N0IGtleVxuICAgICAgICAvLyAnc2l0ZWtleScgOiAnNkxjQUFDWVVBQUFBQVBtdHZRdkJ3Szg5aW1NM1Fmb3RKRkhmU204QycsXG4gICAgICAgICdjYWxsYmFjayc6ICdzY3JlZW5lclJlY2FwdGNoYScsXG4gICAgICAgICdleHBpcmVkLWNhbGxiYWNrJzogJ3NjcmVlbmVyUmVjYXB0Y2hhUmVzZXQnXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlY2FwdGNoYVJlcXVpcmVkID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgd2luZG93LnNjcmVlbmVyUmVjYXB0Y2hhID0gKCkgPT4ge1xuICAgICAgdGhpcy5fcmVjYXB0Y2hhVmVyaWZpZWQgPSB0cnVlO1xuICAgICAgJCh0aGlzLl9lbCkucGFyZW50cygnLmMtdGlwLW1zX190b3BpY3MnKS5yZW1vdmVDbGFzcygncmVjYXB0Y2hhLWpzJyk7XG4gICAgfTtcblxuICAgIHdpbmRvdy5zY3JlZW5lclJlY2FwdGNoYVJlc2V0ID0gKCkgPT4ge1xuICAgICAgdGhpcy5fcmVjYXB0Y2hhVmVyaWZpZWQgPSBmYWxzZTtcbiAgICAgICQodGhpcy5fZWwpLnBhcmVudHMoJy5jLXRpcC1tc19fdG9waWNzJykuYWRkQ2xhc3MoJ3JlY2FwdGNoYS1qcycpO1xuICAgIH07XG5cbiAgICB0aGlzLl9yZWNhcHRjaGFSZXF1aXJlZCA9IHRydWU7XG4gICAgJCgnaGVhZCcpLmFwcGVuZCgkc2NyaXB0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKipcbiAqIENTUyBjbGFzc2VzIHVzZWQgYnkgdGhpcyBjb21wb25lbnQuXG4gKiBAZW51bSB7c3RyaW5nfVxuICovXG5TaGFyZUZvcm0uQ3NzQ2xhc3MgPSB7XG4gIEVSUk9SOiAnZXJyb3InLFxuICBFUlJPUl9NU0c6ICdlcnJvci1tZXNzYWdlJyxcbiAgRk9STTogJ2pzLXNoYXJlLWZvcm0nLFxuICBTSE9XX0RJU0NMQUlNRVI6ICdqcy1zaG93LWRpc2NsYWltZXInLFxuICBORUVEU19ESVNDTEFJTUVSOiAnanMtbmVlZHMtZGlzY2xhaW1lcicsXG4gIEFOSU1BVEVfRElTQ0xBSU1FUjogJ2FuaW1hdGVkIGZhZGVJblVwJyxcbiAgSElEREVOOiAnaGlkZGVuJyxcbiAgU1VCTUlUX0JUTjogJ2J0bi1zdWJtaXQnLFxuICBTVUNDRVNTOiAnc3VjY2VzcycsXG4gIFNQSU5ORVI6ICdqcy1zcGlubmVyJ1xufTtcblxuLyoqXG4gKiBMb2NhbGl6YXRpb24gbGFiZWxzIG9mIGZvcm0gbWVzc2FnZXMuXG4gKiBAZW51bSB7c3RyaW5nfVxuICovXG5TaGFyZUZvcm0uTWVzc2FnZSA9IHtcbiAgRU1BSUw6ICdFUlJPUl9FTUFJTCcsXG4gIFBIT05FOiAnSW52YWxpZCBNb2JpbGUgTnVtYmVyJyxcbiAgUkVRVUlSRUQ6ICdFUlJPUl9SRVFVSVJFRCcsXG4gIFNFUlZFUjogJ0VSUk9SX1NFUlZFUicsXG4gIFNVQ0NFU1M6ICdNZXNzYWdlIHNlbnQhJyxcbiAgUkVDQVBUQ0hBIDogJ1BsZWFzZSBmaWxsIHRoZSByZUNBUFRDSEEnXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZUZvcm07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9zaGFyZS1mb3JtLmpzIiwiLyohXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llXG4gKlxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG5cdHZhciByZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSBmYWxzZTtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XG5cdFx0dmFyIE9sZENvb2tpZXMgPSB3aW5kb3cuQ29va2llcztcblx0XHR2YXIgYXBpID0gd2luZG93LkNvb2tpZXMgPSBmYWN0b3J5KCk7XG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR3aW5kb3cuQ29va2llcyA9IE9sZENvb2tpZXM7XG5cdFx0XHRyZXR1cm4gYXBpO1xuXHRcdH07XG5cdH1cbn0oZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gYXJndW1lbnRzWyBpIF07XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xuXHRcdGZ1bmN0aW9uIGFwaSAoa2V5LCB2YWx1ZSwgYXR0cmlidXRlcykge1xuXHRcdFx0dmFyIHJlc3VsdDtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV3JpdGVcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZXMgPSBleHRlbmQoe1xuXHRcdFx0XHRcdHBhdGg6ICcvJ1xuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdHZhciBleHBpcmVzID0gbmV3IERhdGUoKTtcblx0XHRcdFx0XHRleHBpcmVzLnNldE1pbGxpc2Vjb25kcyhleHBpcmVzLmdldE1pbGxpc2Vjb25kcygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBleHBpcmVzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gV2UncmUgdXNpbmcgXCJleHBpcmVzXCIgYmVjYXVzZSBcIm1heC1hZ2VcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSByZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXG5cdFx0XHRcdGlmICghY29udmVydGVyLndyaXRlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHZhbHVlKSlcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlID0gY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0a2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhrZXkpKTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9bXFwoXFwpXS9nLCBlc2NhcGUpO1xuXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcblxuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0XHRpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJz0nICsgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9IGtleSArICc9JyArIHZhbHVlICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVhZFxuXG5cdFx0XHRpZiAoIWtleSkge1xuXHRcdFx0XHRyZXN1bHQgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuXHRcdFx0Ly8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuIEFsc28gcHJldmVudHMgb2RkIHJlc3VsdCB3aGVuXG5cdFx0XHQvLyBjYWxsaW5nIFwiZ2V0KClcIlxuXHRcdFx0dmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcblx0XHRcdHZhciByZGVjb2RlID0gLyglWzAtOUEtWl17Mn0pKy9nO1xuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0XHR2YXIgY29va2llID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5qc29uICYmIGNvb2tpZS5jaGFyQXQoMCkgPT09ICdcIicpIHtcblx0XHRcdFx0XHRjb29raWUgPSBjb29raWUuc2xpY2UoMSwgLTEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgbmFtZSA9IHBhcnRzWzBdLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0XHRjb29raWUgPSBjb252ZXJ0ZXIucmVhZCA/XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXIucmVhZChjb29raWUsIG5hbWUpIDogY29udmVydGVyKGNvb2tpZSwgbmFtZSkgfHxcblx0XHRcdFx0XHRcdGNvb2tpZS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5qc29uKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGNvb2tpZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRbbmFtZV0gPSBjb29raWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGFwaS5zZXQgPSBhcGk7XG5cdFx0YXBpLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBhcGkuY2FsbChhcGksIGtleSk7XG5cdFx0fTtcblx0XHRhcGkuZ2V0SlNPTiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBhcGkuYXBwbHkoe1xuXHRcdFx0XHRqc29uOiB0cnVlXG5cdFx0XHR9LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXHRcdH07XG5cdFx0YXBpLmRlZmF1bHRzID0ge307XG5cblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuXHRcdFx0YXBpKGtleSwgJycsIGV4dGVuZChhdHRyaWJ1dGVzLCB7XG5cdFx0XHRcdGV4cGlyZXM6IC0xXG5cdFx0XHR9KSk7XG5cdFx0fTtcblxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcblxuXHRcdHJldHVybiBhcGk7XG5cdH1cblxuXHRyZXR1cm4gaW5pdChmdW5jdGlvbiAoKSB7fSk7XG59KSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9qcy1jb29raWUvc3JjL2pzLmNvb2tpZS5qc1xuLy8gbW9kdWxlIGlkID0gNjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogZXNsaW50LWVudiBicm93c2VyICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuXG4vKipcbiAqIENvbGxlY3Rpb24gb2YgdXRpbGl0eSBmdW5jdGlvbnMuXG4gKi9cbmNvbnN0IFV0aWxpdHkgPSB7fTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIGdpdmVuIGtleSBpbiBhIFVSTCBxdWVyeSBzdHJpbmcuIElmIG5vIFVSTCBxdWVyeVxuICogc3RyaW5nIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudCBVUkwgbG9jYXRpb24gaXMgdXNlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gS2V5IG5hbWUuXG4gKiBAcGFyYW0gez9zdHJpbmd9IHF1ZXJ5U3RyaW5nIC0gT3B0aW9uYWwgcXVlcnkgc3RyaW5nIHRvIGNoZWNrLlxuICogQHJldHVybiB7P3N0cmluZ30gUXVlcnkgcGFyYW1ldGVyIHZhbHVlLlxuICovXG5VdGlsaXR5LmdldFVybFBhcmFtZXRlciA9IChuYW1lLCBxdWVyeVN0cmluZykgPT4ge1xuICBjb25zdCBxdWVyeSA9IHF1ZXJ5U3RyaW5nIHx8IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XG4gIGNvbnN0IHBhcmFtID0gbmFtZS5yZXBsYWNlKC9bXFxbXS8sICdcXFxcWycpLnJlcGxhY2UoL1tcXF1dLywgJ1xcXFxdJyk7XG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cCgnW1xcXFw/Jl0nICsgcGFyYW0gKyAnPShbXiYjXSopJyk7XG4gIGNvbnN0IHJlc3VsdHMgPSByZWdleC5leGVjKHF1ZXJ5KTtcbiAgcmV0dXJuIHJlc3VsdHMgPT09IG51bGwgPyAnJyA6XG4gICAgICBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG59O1xuXG4vKipcbiAqIFRha2VzIGFuIG9iamVjdCBhbmQgZGVlcGx5IHRyYXZlcnNlcyBpdCwgcmV0dXJuaW5nIGFuIGFycmF5IG9mIHZhbHVlcyBmb3JcbiAqIG1hdGNoZWQgcHJvcGVydGllcyBpZGVudGlmaWVkIGJ5IHRoZSBrZXkgc3RyaW5nLlxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdCB0byB0cmF2ZXJzZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXRQcm9wIG5hbWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm4ge2FycmF5fSBwcm9wZXJ0eSB2YWx1ZXMuXG4gKi9cblV0aWxpdHkuZmluZFZhbHVlcyA9IChvYmplY3QsIHRhcmdldFByb3ApID0+IHtcbiAgY29uc3QgcmVzdWx0cyA9IFtdO1xuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmUgZnVuY3Rpb24gZm9yIGl0ZXJhdGluZyBvdmVyIG9iamVjdCBrZXlzLlxuICAgKi9cbiAgKGZ1bmN0aW9uIHRyYXZlcnNlT2JqZWN0KG9iaikge1xuICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBpZiAoa2V5ID09PSB0YXJnZXRQcm9wKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mKG9ialtrZXldKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0cmF2ZXJzZU9iamVjdChvYmpba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pKG9iamVjdCk7XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG4vKipcbiAqIFRha2VzIGEgc3RyaW5nIG9yIG51bWJlciB2YWx1ZSBhbmQgY29udmVydHMgaXQgdG8gYSBkb2xsYXIgYW1vdW50XG4gKiBhcyBhIHN0cmluZyB3aXRoIHR3byBkZWNpbWFsIHBvaW50cyBvZiBwZXJjaXNpb24uXG4gKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHZhbCAtIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHN0cmluZ2lmaWVkIG51bWJlciB0byB0d28gZGVjaW1hbCBwbGFjZXMuXG4gKi9cblV0aWxpdHkudG9Eb2xsYXJBbW91bnQgPSAodmFsKSA9PlxuICAgIChNYXRoLmFicyhNYXRoLnJvdW5kKHBhcnNlRmxvYXQodmFsKSAqIDEwMCkgLyAxMDApKS50b0ZpeGVkKDIpO1xuXG4vKipcbiAqIEZvciB0cmFuc2xhdGluZyBzdHJpbmdzLCB0aGVyZSBpcyBhIGdsb2JhbCBMT0NBTElaRURfU1RSSU5HUyBhcnJheSB0aGF0XG4gKiBpcyBkZWZpbmVkIG9uIHRoZSBIVE1MIHRlbXBsYXRlIGxldmVsIHNvIHRoYXQgdGhvc2Ugc3RyaW5ncyBhcmUgZXhwb3NlZCB0b1xuICogV1BNTCB0cmFuc2xhdGlvbi4gVGhlIExPQ0FMSVpFRF9TVFJJTkdTIGFycmF5IGlzIGNvbW9zZWQgb2Ygb2JqZWN0cyB3aXRoIGFcbiAqIGBzbHVnYCBrZXkgd2hvc2UgdmFsdWUgaXMgc29tZSBjb25zdGFudCwgYW5kIGEgYGxhYmVsYCB2YWx1ZSB3aGljaCBpcyB0aGVcbiAqIHRyYW5zbGF0ZWQgZXF1aXZhbGVudC4gVGhpcyBmdW5jdGlvbiB0YWtlcyBhIHNsdWcgbmFtZSBhbmQgcmV0dXJucyB0aGVcbiAqIGxhYmVsLlxuICogQHBhcmFtIHtzdHJpbmd9IHNsdWdOYW1lXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGxvY2FsaXplZCB2YWx1ZVxuICovXG5VdGlsaXR5LmxvY2FsaXplID0gZnVuY3Rpb24oc2x1Z05hbWUpIHtcbiAgbGV0IHRleHQgPSBzbHVnTmFtZSB8fCAnJztcbiAgY29uc3QgbG9jYWxpemVkU3RyaW5ncyA9IHdpbmRvdy5MT0NBTElaRURfU1RSSU5HUyB8fCBbXTtcbiAgY29uc3QgbWF0Y2ggPSBfLmZpbmRXaGVyZShsb2NhbGl6ZWRTdHJpbmdzLCB7XG4gICAgc2x1Zzogc2x1Z05hbWVcbiAgfSk7XG4gIGlmIChtYXRjaCkge1xuICAgIHRleHQgPSBtYXRjaC5sYWJlbDtcbiAgfVxuICByZXR1cm4gdGV4dDtcbn07XG5cbi8qKlxuICogVGFrZXMgYSBhIHN0cmluZyBhbmQgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgc3RyaW5nIGlzIGEgdmFsaWQgZW1haWxcbiAqIGJ5IHVzaW5nIG5hdGl2ZSBicm93c2VyIHZhbGlkYXRpb24gaWYgYXZhaWxhYmxlLiBPdGhlcndpc2UsIGRvZXMgYSBzaW1wbGVcbiAqIFJlZ2V4IHRlc3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gZW1haWxcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cblV0aWxpdHkuaXNWYWxpZEVtYWlsID0gZnVuY3Rpb24oZW1haWwpIHtcbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBpbnB1dC50eXBlID0gJ2VtYWlsJztcbiAgaW5wdXQudmFsdWUgPSBlbWFpbDtcblxuICByZXR1cm4gdHlwZW9mIGlucHV0LmNoZWNrVmFsaWRpdHkgPT09ICdmdW5jdGlvbicgP1xuICAgICAgaW5wdXQuY2hlY2tWYWxpZGl0eSgpIDogL1xcUytAXFxTK1xcLlxcUysvLnRlc3QoZW1haWwpO1xufTtcblxuLyoqXG4gKiBTaXRlIGNvbnN0YW50cy5cbiAqIEBlbnVtIHtzdHJpbmd9XG4gKi9cblV0aWxpdHkuQ09ORklHID0ge1xuICBERUZBVUxUX0xBVDogNDAuNzEyOCxcbiAgREVGQVVMVF9MTkc6IC03NC4wMDU5LFxuICBHT09HTEVfQVBJOiAnQUl6YVN5QlNqY19KTl9wMC1fVkt5QnZqQ0ZxVkFtQUlXdDdDbFpjJyxcbiAgR09PR0xFX1NUQVRJQ19BUEk6ICdBSXphU3lDdDBFN0RYX1lQRmNVbmxNUDZXSHYyenFBd3laRTRxSXcnLFxuICBHUkVDQVBUQ0hBX1NJVEVfS0VZOiAnNkxleW5CVVVBQUFBQU53c2tUVzJVSWNla3RSaWF5U3FMRkZ3d2s0OCcsXG4gIFNDUkVFTkVSX01BWF9IT1VTRUhPTEQ6IDgsXG4gIFVSTF9QSU5fQkxVRTogJy93cC1jb250ZW50L3RoZW1lcy9hY2Nlc3MvYXNzZXRzL2ltZy9tYXAtcGluLWJsdWUucG5nJyxcbiAgVVJMX1BJTl9CTFVFXzJYOiAnL3dwLWNvbnRlbnQvdGhlbWVzL2FjY2Vzcy9hc3NldHMvaW1nL21hcC1waW4tYmx1ZS0yeC5wbmcnLFxuICBVUkxfUElOX0dSRUVOOiAnL3dwLWNvbnRlbnQvdGhlbWVzL2FjY2Vzcy9hc3NldHMvaW1nL21hcC1waW4tZ3JlZW4ucG5nJyxcbiAgVVJMX1BJTl9HUkVFTl8yWDogJy93cC1jb250ZW50L3RoZW1lcy9hY2Nlc3MvYXNzZXRzL2ltZy9tYXAtcGluLWdyZWVuLTJ4LnBuZydcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWxpdHk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvdmVuZG9yL3V0aWxpdHkuanMiLCIvKiFcbiAqIGNsZWF2ZS5qcyAtIDAuNy4yM1xuICogaHR0cHM6Ly9naXRodWIuY29tL25vc2lyL2NsZWF2ZS5qc1xuICogQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjBcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTItMjAxNyBNYXggSHVhbmcgaHR0cHM6Ly9naXRodWIuY29tL25vc2lyL1xuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSx0KTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLkNsZWF2ZT10KCk6ZS5DbGVhdmU9dCgpfSh0aGlzLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQobil7aWYocltuXSlyZXR1cm4gcltuXS5leHBvcnRzO3ZhciBpPXJbbl09e2V4cG9ydHM6e30saWQ6bixsb2FkZWQ6ITF9O3JldHVybiBlW25dLmNhbGwoaS5leHBvcnRzLGksaS5leHBvcnRzLHQpLGkubG9hZGVkPSEwLGkuZXhwb3J0c312YXIgcj17fTtyZXR1cm4gdC5tPWUsdC5jPXIsdC5wPVwiXCIsdCgwKX0oW2Z1bmN0aW9uKGUsdCxyKXsoZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZnVuY3Rpb24oZSx0KXt2YXIgcj10aGlzO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlP3IuZWxlbWVudD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGUpOnIuZWxlbWVudD1cInVuZGVmaW5lZFwiIT10eXBlb2YgZS5sZW5ndGgmJmUubGVuZ3RoPjA/ZVswXTplLCFyLmVsZW1lbnQpdGhyb3cgbmV3IEVycm9yKFwiW2NsZWF2ZS5qc10gUGxlYXNlIGNoZWNrIHRoZSBlbGVtZW50XCIpO3QuaW5pdFZhbHVlPXIuZWxlbWVudC52YWx1ZSxyLnByb3BlcnRpZXM9bi5EZWZhdWx0UHJvcGVydGllcy5hc3NpZ24oe30sdCksci5pbml0KCl9O24ucHJvdG90eXBlPXtpbml0OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllczsodC5udW1lcmFsfHx0LnBob25lfHx0LmNyZWRpdENhcmR8fHQuZGF0ZXx8MCE9PXQuYmxvY2tzTGVuZ3RofHx0LnByZWZpeCkmJih0Lm1heExlbmd0aD1uLlV0aWwuZ2V0TWF4TGVuZ3RoKHQuYmxvY2tzKSxlLmlzQW5kcm9pZD1uLlV0aWwuaXNBbmRyb2lkKCksZS5sYXN0SW5wdXRWYWx1ZT1cIlwiLGUub25DaGFuZ2VMaXN0ZW5lcj1lLm9uQ2hhbmdlLmJpbmQoZSksZS5vbktleURvd25MaXN0ZW5lcj1lLm9uS2V5RG93bi5iaW5kKGUpLGUub25DdXRMaXN0ZW5lcj1lLm9uQ3V0LmJpbmQoZSksZS5vbkNvcHlMaXN0ZW5lcj1lLm9uQ29weS5iaW5kKGUpLGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixlLm9uQ2hhbmdlTGlzdGVuZXIpLGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLGUub25LZXlEb3duTGlzdGVuZXIpLGUuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY3V0XCIsZS5vbkN1dExpc3RlbmVyKSxlLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvcHlcIixlLm9uQ29weUxpc3RlbmVyKSxlLmluaXRQaG9uZUZvcm1hdHRlcigpLGUuaW5pdERhdGVGb3JtYXR0ZXIoKSxlLmluaXROdW1lcmFsRm9ybWF0dGVyKCksZS5vbklucHV0KHQuaW5pdFZhbHVlKSl9LGluaXROdW1lcmFsRm9ybWF0dGVyOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllczt0Lm51bWVyYWwmJih0Lm51bWVyYWxGb3JtYXR0ZXI9bmV3IG4uTnVtZXJhbEZvcm1hdHRlcih0Lm51bWVyYWxEZWNpbWFsTWFyayx0Lm51bWVyYWxJbnRlZ2VyU2NhbGUsdC5udW1lcmFsRGVjaW1hbFNjYWxlLHQubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGUsdC5udW1lcmFsUG9zaXRpdmVPbmx5LHQuZGVsaW1pdGVyKSl9LGluaXREYXRlRm9ybWF0dGVyOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllczt0LmRhdGUmJih0LmRhdGVGb3JtYXR0ZXI9bmV3IG4uRGF0ZUZvcm1hdHRlcih0LmRhdGVQYXR0ZXJuKSx0LmJsb2Nrcz10LmRhdGVGb3JtYXR0ZXIuZ2V0QmxvY2tzKCksdC5ibG9ja3NMZW5ndGg9dC5ibG9ja3MubGVuZ3RoLHQubWF4TGVuZ3RoPW4uVXRpbC5nZXRNYXhMZW5ndGgodC5ibG9ja3MpKX0saW5pdFBob25lRm9ybWF0dGVyOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllcztpZih0LnBob25lKXRyeXt0LnBob25lRm9ybWF0dGVyPW5ldyBuLlBob25lRm9ybWF0dGVyKG5ldyB0LnJvb3QuQ2xlYXZlLkFzWW91VHlwZUZvcm1hdHRlcih0LnBob25lUmVnaW9uQ29kZSksdC5kZWxpbWl0ZXIpfWNhdGNoKHIpe3Rocm93IG5ldyBFcnJvcihcIltjbGVhdmUuanNdIFBsZWFzZSBpbmNsdWRlIHBob25lLXR5cGUtZm9ybWF0dGVyLntjb3VudHJ5fS5qcyBsaWJcIil9fSxvbktleURvd246ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPXQucHJvcGVydGllcyxpPWUud2hpY2h8fGUua2V5Q29kZSxhPW4uVXRpbCxvPXQuZWxlbWVudC52YWx1ZTtyZXR1cm4gYS5pc0FuZHJvaWRCYWNrc3BhY2VLZXlkb3duKHQubGFzdElucHV0VmFsdWUsbykmJihpPTgpLHQubGFzdElucHV0VmFsdWU9byw4PT09aSYmYS5pc0RlbGltaXRlcihvLnNsaWNlKC1yLmRlbGltaXRlckxlbmd0aCksci5kZWxpbWl0ZXIsci5kZWxpbWl0ZXJzKT92b2lkKHIuYmFja3NwYWNlPSEwKTp2b2lkKHIuYmFja3NwYWNlPSExKX0sb25DaGFuZ2U6ZnVuY3Rpb24oKXt0aGlzLm9uSW5wdXQodGhpcy5lbGVtZW50LnZhbHVlKX0sb25DdXQ6ZnVuY3Rpb24oZSl7dGhpcy5jb3B5Q2xpcGJvYXJkRGF0YShlKSx0aGlzLm9uSW5wdXQoXCJcIil9LG9uQ29weTpmdW5jdGlvbihlKXt0aGlzLmNvcHlDbGlwYm9hcmREYXRhKGUpfSxjb3B5Q2xpcGJvYXJkRGF0YTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzLGk9bi5VdGlsLGE9dC5lbGVtZW50LnZhbHVlLG89XCJcIjtvPXIuY29weURlbGltaXRlcj9hOmkuc3RyaXBEZWxpbWl0ZXJzKGEsci5kZWxpbWl0ZXIsci5kZWxpbWl0ZXJzKTt0cnl7ZS5jbGlwYm9hcmREYXRhP2UuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwiVGV4dFwiLG8pOndpbmRvdy5jbGlwYm9hcmREYXRhLnNldERhdGEoXCJUZXh0XCIsbyksZS5wcmV2ZW50RGVmYXVsdCgpfWNhdGNoKGwpe319LG9uSW5wdXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPXQucHJvcGVydGllcyxpPWUsYT1uLlV0aWw7cmV0dXJuIHIubnVtZXJhbHx8IXIuYmFja3NwYWNlfHxhLmlzRGVsaW1pdGVyKGUuc2xpY2UoLXIuZGVsaW1pdGVyTGVuZ3RoKSxyLmRlbGltaXRlcixyLmRlbGltaXRlcnMpfHwoZT1hLmhlYWRTdHIoZSxlLmxlbmd0aC1yLmRlbGltaXRlckxlbmd0aCkpLHIucGhvbmU/KHIucmVzdWx0PXIucGhvbmVGb3JtYXR0ZXIuZm9ybWF0KGUpLHZvaWQgdC51cGRhdGVWYWx1ZVN0YXRlKCkpOnIubnVtZXJhbD8oci5yZXN1bHQ9ci5wcmVmaXgrci5udW1lcmFsRm9ybWF0dGVyLmZvcm1hdChlKSx2b2lkIHQudXBkYXRlVmFsdWVTdGF0ZSgpKTooci5kYXRlJiYoZT1yLmRhdGVGb3JtYXR0ZXIuZ2V0VmFsaWRhdGVkRGF0ZShlKSksZT1hLnN0cmlwRGVsaW1pdGVycyhlLHIuZGVsaW1pdGVyLHIuZGVsaW1pdGVycyksZT1hLmdldFByZWZpeFN0cmlwcGVkVmFsdWUoZSxyLnByZWZpeCxyLnByZWZpeExlbmd0aCksZT1yLm51bWVyaWNPbmx5P2Euc3RyaXAoZSwvW15cXGRdL2cpOmUsZT1yLnVwcGVyY2FzZT9lLnRvVXBwZXJDYXNlKCk6ZSxlPXIubG93ZXJjYXNlP2UudG9Mb3dlckNhc2UoKTplLHIucHJlZml4JiYoZT1yLnByZWZpeCtlLDA9PT1yLmJsb2Nrc0xlbmd0aCk/KHIucmVzdWx0PWUsdm9pZCB0LnVwZGF0ZVZhbHVlU3RhdGUoKSk6KHIuY3JlZGl0Q2FyZCYmdC51cGRhdGVDcmVkaXRDYXJkUHJvcHNCeVZhbHVlKGUpLGU9YS5oZWFkU3RyKGUsci5tYXhMZW5ndGgpLHIucmVzdWx0PWEuZ2V0Rm9ybWF0dGVkVmFsdWUoZSxyLmJsb2NrcyxyLmJsb2Nrc0xlbmd0aCxyLmRlbGltaXRlcixyLmRlbGltaXRlcnMpLHZvaWQoaT09PXIucmVzdWx0JiZpIT09ci5wcmVmaXh8fHQudXBkYXRlVmFsdWVTdGF0ZSgpKSkpfSx1cGRhdGVDcmVkaXRDYXJkUHJvcHNCeVZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0LHI9dGhpcyxpPXIucHJvcGVydGllcyxhPW4uVXRpbDthLmhlYWRTdHIoaS5yZXN1bHQsNCkhPT1hLmhlYWRTdHIoZSw0KSYmKHQ9bi5DcmVkaXRDYXJkRGV0ZWN0b3IuZ2V0SW5mbyhlLGkuY3JlZGl0Q2FyZFN0cmljdE1vZGUpLGkuYmxvY2tzPXQuYmxvY2tzLGkuYmxvY2tzTGVuZ3RoPWkuYmxvY2tzLmxlbmd0aCxpLm1heExlbmd0aD1hLmdldE1heExlbmd0aChpLmJsb2NrcyksaS5jcmVkaXRDYXJkVHlwZSE9PXQudHlwZSYmKGkuY3JlZGl0Q2FyZFR5cGU9dC50eXBlLGkub25DcmVkaXRDYXJkVHlwZUNoYW5nZWQuY2FsbChyLGkuY3JlZGl0Q2FyZFR5cGUpKSl9LHVwZGF0ZVZhbHVlU3RhdGU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3JldHVybiBlLmlzQW5kcm9pZD92b2lkIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZS5lbGVtZW50LnZhbHVlPWUucHJvcGVydGllcy5yZXN1bHR9LDEpOnZvaWQoZS5lbGVtZW50LnZhbHVlPWUucHJvcGVydGllcy5yZXN1bHQpfSxzZXRQaG9uZVJlZ2lvbkNvZGU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPXQucHJvcGVydGllcztyLnBob25lUmVnaW9uQ29kZT1lLHQuaW5pdFBob25lRm9ybWF0dGVyKCksdC5vbkNoYW5nZSgpfSxzZXRSYXdWYWx1ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9dC5wcm9wZXJ0aWVzO2U9dm9pZCAwIT09ZSYmbnVsbCE9PWU/ZS50b1N0cmluZygpOlwiXCIsci5udW1lcmFsJiYoZT1lLnJlcGxhY2UoXCIuXCIsci5udW1lcmFsRGVjaW1hbE1hcmspKSx0LmVsZW1lbnQudmFsdWU9ZSx0Lm9uSW5wdXQoZSl9LGdldFJhd1ZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PWUucHJvcGVydGllcyxyPW4uVXRpbCxpPWUuZWxlbWVudC52YWx1ZTtyZXR1cm4gdC5yYXdWYWx1ZVRyaW1QcmVmaXgmJihpPXIuZ2V0UHJlZml4U3RyaXBwZWRWYWx1ZShpLHQucHJlZml4LHQucHJlZml4TGVuZ3RoKSksaT10Lm51bWVyYWw/dC5udW1lcmFsRm9ybWF0dGVyLmdldFJhd1ZhbHVlKGkpOnIuc3RyaXBEZWxpbWl0ZXJzKGksdC5kZWxpbWl0ZXIsdC5kZWxpbWl0ZXJzKX0sZ2V0Rm9ybWF0dGVkVmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbGVtZW50LnZhbHVlfSxkZXN0cm95OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcztlLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsZS5vbkNoYW5nZUxpc3RlbmVyKSxlLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIixlLm9uS2V5RG93bkxpc3RlbmVyKSxlLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImN1dFwiLGUub25DdXRMaXN0ZW5lciksZS5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb3B5XCIsZS5vbkNvcHlMaXN0ZW5lcil9LHRvU3RyaW5nOmZ1bmN0aW9uKCl7cmV0dXJuXCJbQ2xlYXZlIE9iamVjdF1cIn19LG4uTnVtZXJhbEZvcm1hdHRlcj1yKDEpLG4uRGF0ZUZvcm1hdHRlcj1yKDIpLG4uUGhvbmVGb3JtYXR0ZXI9cigzKSxuLkNyZWRpdENhcmREZXRlY3Rvcj1yKDQpLG4uVXRpbD1yKDUpLG4uRGVmYXVsdFByb3BlcnRpZXM9cig2KSwoXCJvYmplY3RcIj09dHlwZW9mIHQmJnQ/dDp3aW5kb3cpLkNsZWF2ZT1uLGUuZXhwb3J0cz1ufSkuY2FsbCh0LGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO3ZhciByPWZ1bmN0aW9uKGUsdCxuLGksYSxvKXt2YXIgbD10aGlzO2wubnVtZXJhbERlY2ltYWxNYXJrPWV8fFwiLlwiLGwubnVtZXJhbEludGVnZXJTY2FsZT10Pj0wP3Q6MTAsbC5udW1lcmFsRGVjaW1hbFNjYWxlPW4+PTA/bjoyLGwubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGU9aXx8ci5ncm91cFN0eWxlLnRob3VzYW5kLGwubnVtZXJhbFBvc2l0aXZlT25seT0hIWEsbC5kZWxpbWl0ZXI9b3x8XCJcIj09PW8/bzpcIixcIixsLmRlbGltaXRlclJFPW8/bmV3IFJlZ0V4cChcIlxcXFxcIitvLFwiZ1wiKTpcIlwifTtyLmdyb3VwU3R5bGU9e3Rob3VzYW5kOlwidGhvdXNhbmRcIixsYWtoOlwibGFraFwiLHdhbjpcIndhblwifSxyLnByb3RvdHlwZT17Z2V0UmF3VmFsdWU6ZnVuY3Rpb24oZSl7cmV0dXJuIGUucmVwbGFjZSh0aGlzLmRlbGltaXRlclJFLFwiXCIpLnJlcGxhY2UodGhpcy5udW1lcmFsRGVjaW1hbE1hcmssXCIuXCIpfSxmb3JtYXQ6ZnVuY3Rpb24oZSl7dmFyIHQsbixpPXRoaXMsYT1cIlwiO3N3aXRjaChlPWUucmVwbGFjZSgvW0EtWmEtel0vZyxcIlwiKS5yZXBsYWNlKGkubnVtZXJhbERlY2ltYWxNYXJrLFwiTVwiKS5yZXBsYWNlKC9bXlxcZE0tXS9nLFwiXCIpLnJlcGxhY2UoL15cXC0vLFwiTlwiKS5yZXBsYWNlKC9cXC0vZyxcIlwiKS5yZXBsYWNlKFwiTlwiLGkubnVtZXJhbFBvc2l0aXZlT25seT9cIlwiOlwiLVwiKS5yZXBsYWNlKFwiTVwiLGkubnVtZXJhbERlY2ltYWxNYXJrKS5yZXBsYWNlKC9eKC0pPzArKD89XFxkKS8sXCIkMVwiKSxuPWUsZS5pbmRleE9mKGkubnVtZXJhbERlY2ltYWxNYXJrKT49MCYmKHQ9ZS5zcGxpdChpLm51bWVyYWxEZWNpbWFsTWFyayksbj10WzBdLGE9aS5udW1lcmFsRGVjaW1hbE1hcmsrdFsxXS5zbGljZSgwLGkubnVtZXJhbERlY2ltYWxTY2FsZSkpLGkubnVtZXJhbEludGVnZXJTY2FsZT4wJiYobj1uLnNsaWNlKDAsaS5udW1lcmFsSW50ZWdlclNjYWxlKyhcIi1cIj09PWUuc2xpY2UoMCwxKT8xOjApKSksaS5udW1lcmFsVGhvdXNhbmRzR3JvdXBTdHlsZSl7Y2FzZSByLmdyb3VwU3R5bGUubGFraDpuPW4ucmVwbGFjZSgvKFxcZCkoPz0oXFxkXFxkKStcXGQkKS9nLFwiJDFcIitpLmRlbGltaXRlcik7YnJlYWs7Y2FzZSByLmdyb3VwU3R5bGUud2FuOm49bi5yZXBsYWNlKC8oXFxkKSg/PShcXGR7NH0pKyQpL2csXCIkMVwiK2kuZGVsaW1pdGVyKTticmVhaztkZWZhdWx0Om49bi5yZXBsYWNlKC8oXFxkKSg/PShcXGR7M30pKyQpL2csXCIkMVwiK2kuZGVsaW1pdGVyKX1yZXR1cm4gbi50b1N0cmluZygpKyhpLm51bWVyYWxEZWNpbWFsU2NhbGU+MD9hLnRvU3RyaW5nKCk6XCJcIil9fSxlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj1mdW5jdGlvbihlKXt2YXIgdD10aGlzO3QuYmxvY2tzPVtdLHQuZGF0ZVBhdHRlcm49ZSx0LmluaXRCbG9ja3MoKX07ci5wcm90b3R5cGU9e2luaXRCbG9ja3M6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2UuZGF0ZVBhdHRlcm4uZm9yRWFjaChmdW5jdGlvbih0KXtcIllcIj09PXQ/ZS5ibG9ja3MucHVzaCg0KTplLmJsb2Nrcy5wdXNoKDIpfSl9LGdldEJsb2NrczpmdW5jdGlvbigpe3JldHVybiB0aGlzLmJsb2Nrc30sZ2V0VmFsaWRhdGVkRGF0ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9XCJcIjtyZXR1cm4gZT1lLnJlcGxhY2UoL1teXFxkXS9nLFwiXCIpLHQuYmxvY2tzLmZvckVhY2goZnVuY3Rpb24obixpKXtpZihlLmxlbmd0aD4wKXt2YXIgYT1lLnNsaWNlKDAsbiksbz1hLnNsaWNlKDAsMSksbD1lLnNsaWNlKG4pO3N3aXRjaCh0LmRhdGVQYXR0ZXJuW2ldKXtjYXNlXCJkXCI6XCIwMFwiPT09YT9hPVwiMDFcIjpwYXJzZUludChvLDEwKT4zP2E9XCIwXCIrbzpwYXJzZUludChhLDEwKT4zMSYmKGE9XCIzMVwiKTticmVhaztjYXNlXCJtXCI6XCIwMFwiPT09YT9hPVwiMDFcIjpwYXJzZUludChvLDEwKT4xP2E9XCIwXCIrbzpwYXJzZUludChhLDEwKT4xMiYmKGE9XCIxMlwiKX1yKz1hLGU9bH19KSxyfX0sZS5leHBvcnRzPXJ9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZnVuY3Rpb24oZSx0KXt2YXIgcj10aGlzO3IuZGVsaW1pdGVyPXR8fFwiXCI9PT10P3Q6XCIgXCIsci5kZWxpbWl0ZXJSRT10P25ldyBSZWdFeHAoXCJcXFxcXCIrdCxcImdcIik6XCJcIixyLmZvcm1hdHRlcj1lfTtyLnByb3RvdHlwZT17c2V0Rm9ybWF0dGVyOmZ1bmN0aW9uKGUpe3RoaXMuZm9ybWF0dGVyPWV9LGZvcm1hdDpmdW5jdGlvbihlKXt2YXIgdD10aGlzO3QuZm9ybWF0dGVyLmNsZWFyKCksZT1lLnJlcGxhY2UoL1teXFxkK10vZyxcIlwiKSxlPWUucmVwbGFjZSh0LmRlbGltaXRlclJFLFwiXCIpO2Zvcih2YXIgcixuPVwiXCIsaT0hMSxhPTAsbz1lLmxlbmd0aDtvPmE7YSsrKXI9dC5mb3JtYXR0ZXIuaW5wdXREaWdpdChlLmNoYXJBdChhKSksL1tcXHMoKS1dL2cudGVzdChyKT8obj1yLGk9ITApOml8fChuPXIpO3JldHVybiBuPW4ucmVwbGFjZSgvWygpXS9nLFwiXCIpLG49bi5yZXBsYWNlKC9bXFxzLV0vZyx0LmRlbGltaXRlcil9fSxlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0KXtcInVzZSBzdHJpY3RcIjt2YXIgcj17YmxvY2tzOnt1YXRwOls0LDUsNl0sYW1leDpbNCw2LDVdLGRpbmVyczpbNCw2LDRdLGRpc2NvdmVyOls0LDQsNCw0XSxtYXN0ZXJjYXJkOls0LDQsNCw0XSxkYW5rb3J0Ols0LDQsNCw0XSxpbnN0YXBheW1lbnQ6WzQsNCw0LDRdLGpjYjpbNCw0LDQsNF0sbWFlc3RybzpbNCw0LDQsNF0sdmlzYTpbNCw0LDQsNF0sZ2VuZXJhbDpbNCw0LDQsNF0sZ2VuZXJhbFN0cmljdDpbNCw0LDQsN119LHJlOnt1YXRwOi9eKD8hMTgwMCkxXFxkezAsMTR9LyxhbWV4Oi9eM1s0N11cXGR7MCwxM30vLGRpc2NvdmVyOi9eKD86NjAxMXw2NVxcZHswLDJ9fDY0WzQtOV1cXGQ/KVxcZHswLDEyfS8sZGluZXJzOi9eMyg/OjAoWzAtNV18OSl8WzY4OV1cXGQ/KVxcZHswLDExfS8sbWFzdGVyY2FyZDovXig1WzEtNV18MlsyLTddKVxcZHswLDE0fS8sZGFua29ydDovXig1MDE5fDQxNzV8NDU3MSlcXGR7MCwxMn0vLGluc3RhcGF5bWVudDovXjYzWzctOV1cXGR7MCwxM30vLGpjYjovXig/OjIxMzF8MTgwMHwzNVxcZHswLDJ9KVxcZHswLDEyfS8sbWFlc3RybzovXig/OjVbMDY3OF1cXGR7MCwyfXw2MzA0fDY3XFxkezAsMn0pXFxkezAsMTJ9Lyx2aXNhOi9eNFxcZHswLDE1fS99LGdldEluZm86ZnVuY3Rpb24oZSx0KXt2YXIgbj1yLmJsb2NrcyxpPXIucmU7cmV0dXJuIHQ9ISF0LGkuYW1leC50ZXN0KGUpP3t0eXBlOlwiYW1leFwiLGJsb2NrczpuLmFtZXh9OmkudWF0cC50ZXN0KGUpP3t0eXBlOlwidWF0cFwiLGJsb2NrczpuLnVhdHB9OmkuZGluZXJzLnRlc3QoZSk/e3R5cGU6XCJkaW5lcnNcIixibG9ja3M6bi5kaW5lcnN9OmkuZGlzY292ZXIudGVzdChlKT97dHlwZTpcImRpc2NvdmVyXCIsYmxvY2tzOnQ/bi5nZW5lcmFsU3RyaWN0Om4uZGlzY292ZXJ9OmkubWFzdGVyY2FyZC50ZXN0KGUpP3t0eXBlOlwibWFzdGVyY2FyZFwiLGJsb2NrczpuLm1hc3RlcmNhcmR9OmkuZGFua29ydC50ZXN0KGUpP3t0eXBlOlwiZGFua29ydFwiLGJsb2NrczpuLmRhbmtvcnR9OmkuaW5zdGFwYXltZW50LnRlc3QoZSk/e3R5cGU6XCJpbnN0YXBheW1lbnRcIixibG9ja3M6bi5pbnN0YXBheW1lbnR9OmkuamNiLnRlc3QoZSk/e3R5cGU6XCJqY2JcIixibG9ja3M6bi5qY2J9OmkubWFlc3Ryby50ZXN0KGUpP3t0eXBlOlwibWFlc3Ryb1wiLGJsb2Nrczp0P24uZ2VuZXJhbFN0cmljdDpuLm1hZXN0cm99OmkudmlzYS50ZXN0KGUpP3t0eXBlOlwidmlzYVwiLGJsb2Nrczp0P24uZ2VuZXJhbFN0cmljdDpuLnZpc2F9Ont0eXBlOlwidW5rbm93blwiLGJsb2Nrczp0P24uZ2VuZXJhbFN0cmljdDpuLmdlbmVyYWx9fX07ZS5leHBvcnRzPXJ9LGZ1bmN0aW9uKGUsdCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9e25vb3A6ZnVuY3Rpb24oKXt9LHN0cmlwOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUucmVwbGFjZSh0LFwiXCIpfSxpc0RlbGltaXRlcjpmdW5jdGlvbihlLHQscil7cmV0dXJuIDA9PT1yLmxlbmd0aD9lPT09dDpyLnNvbWUoZnVuY3Rpb24odCl7cmV0dXJuIGU9PT10PyEwOnZvaWQgMH0pfSxnZXREZWxpbWl0ZXJSRUJ5RGVsaW1pdGVyOmZ1bmN0aW9uKGUpe3JldHVybiBuZXcgUmVnRXhwKGUucmVwbGFjZSgvKFsuPyorXiRbXFxdXFxcXCgpe318LV0pL2csXCJcXFxcJDFcIiksXCJnXCIpfSxzdHJpcERlbGltaXRlcnM6ZnVuY3Rpb24oZSx0LHIpe3ZhciBuPXRoaXM7aWYoMD09PXIubGVuZ3RoKXt2YXIgaT10P24uZ2V0RGVsaW1pdGVyUkVCeURlbGltaXRlcih0KTpcIlwiO3JldHVybiBlLnJlcGxhY2UoaSxcIlwiKX1yZXR1cm4gci5mb3JFYWNoKGZ1bmN0aW9uKHQpe2U9ZS5yZXBsYWNlKG4uZ2V0RGVsaW1pdGVyUkVCeURlbGltaXRlcih0KSxcIlwiKX0pLGV9LGhlYWRTdHI6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5zbGljZSgwLHQpfSxnZXRNYXhMZW5ndGg6ZnVuY3Rpb24oZSl7cmV0dXJuIGUucmVkdWNlKGZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUrdH0sMCl9LGdldFByZWZpeFN0cmlwcGVkVmFsdWU6ZnVuY3Rpb24oZSx0LHIpe2lmKGUuc2xpY2UoMCxyKSE9PXQpe3ZhciBuPXRoaXMuZ2V0Rmlyc3REaWZmSW5kZXgodCxlLnNsaWNlKDAscikpO2U9dCtlLnNsaWNlKG4sbisxKStlLnNsaWNlKHIrMSl9cmV0dXJuIGUuc2xpY2Uocil9LGdldEZpcnN0RGlmZkluZGV4OmZ1bmN0aW9uKGUsdCl7Zm9yKHZhciByPTA7ZS5jaGFyQXQocik9PT10LmNoYXJBdChyKTspaWYoXCJcIj09PWUuY2hhckF0KHIrKykpcmV0dXJuLTE7cmV0dXJuIHJ9LGdldEZvcm1hdHRlZFZhbHVlOmZ1bmN0aW9uKGUsdCxyLG4saSl7dmFyIGEsbz1cIlwiLGw9aS5sZW5ndGg+MDtyZXR1cm4gMD09PXI/ZToodC5mb3JFYWNoKGZ1bmN0aW9uKHQscyl7aWYoZS5sZW5ndGg+MCl7dmFyIGM9ZS5zbGljZSgwLHQpLHU9ZS5zbGljZSh0KTtvKz1jLGE9bD9pW3NdfHxhOm4sYy5sZW5ndGg9PT10JiZyLTE+cyYmKG8rPWEpLGU9dX19KSxvKX0saXNBbmRyb2lkOmZ1bmN0aW9uKCl7cmV0dXJuISghbmF2aWdhdG9yfHwhL2FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKX0saXNBbmRyb2lkQmFja3NwYWNlS2V5ZG93bjpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmlzQW5kcm9pZCgpP3Q9PT1lLnNsaWNlKDAsLTEpOiExfX07ZS5leHBvcnRzPXJ9LGZ1bmN0aW9uKGUsdCl7KGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciByPXthc3NpZ246ZnVuY3Rpb24oZSxyKXtyZXR1cm4gZT1lfHx7fSxyPXJ8fHt9LGUuY3JlZGl0Q2FyZD0hIXIuY3JlZGl0Q2FyZCxlLmNyZWRpdENhcmRTdHJpY3RNb2RlPSEhci5jcmVkaXRDYXJkU3RyaWN0TW9kZSxlLmNyZWRpdENhcmRUeXBlPVwiXCIsZS5vbkNyZWRpdENhcmRUeXBlQ2hhbmdlZD1yLm9uQ3JlZGl0Q2FyZFR5cGVDaGFuZ2VkfHxmdW5jdGlvbigpe30sZS5waG9uZT0hIXIucGhvbmUsZS5waG9uZVJlZ2lvbkNvZGU9ci5waG9uZVJlZ2lvbkNvZGV8fFwiQVVcIixlLnBob25lRm9ybWF0dGVyPXt9LGUuZGF0ZT0hIXIuZGF0ZSxlLmRhdGVQYXR0ZXJuPXIuZGF0ZVBhdHRlcm58fFtcImRcIixcIm1cIixcIllcIl0sZS5kYXRlRm9ybWF0dGVyPXt9LGUubnVtZXJhbD0hIXIubnVtZXJhbCxlLm51bWVyYWxJbnRlZ2VyU2NhbGU9ci5udW1lcmFsSW50ZWdlclNjYWxlPj0wP3IubnVtZXJhbEludGVnZXJTY2FsZToxMCxlLm51bWVyYWxEZWNpbWFsU2NhbGU9ci5udW1lcmFsRGVjaW1hbFNjYWxlPj0wP3IubnVtZXJhbERlY2ltYWxTY2FsZToyLGUubnVtZXJhbERlY2ltYWxNYXJrPXIubnVtZXJhbERlY2ltYWxNYXJrfHxcIi5cIixlLm51bWVyYWxUaG91c2FuZHNHcm91cFN0eWxlPXIubnVtZXJhbFRob3VzYW5kc0dyb3VwU3R5bGV8fFwidGhvdXNhbmRcIixlLm51bWVyYWxQb3NpdGl2ZU9ubHk9ISFyLm51bWVyYWxQb3NpdGl2ZU9ubHksZS5udW1lcmljT25seT1lLmNyZWRpdENhcmR8fGUuZGF0ZXx8ISFyLm51bWVyaWNPbmx5LGUudXBwZXJjYXNlPSEhci51cHBlcmNhc2UsZS5sb3dlcmNhc2U9ISFyLmxvd2VyY2FzZSxlLnByZWZpeD1lLmNyZWRpdENhcmR8fGUucGhvbmV8fGUuZGF0ZT9cIlwiOnIucHJlZml4fHxcIlwiLGUucHJlZml4TGVuZ3RoPWUucHJlZml4Lmxlbmd0aCxlLnJhd1ZhbHVlVHJpbVByZWZpeD0hIXIucmF3VmFsdWVUcmltUHJlZml4LGUuY29weURlbGltaXRlcj0hIXIuY29weURlbGltaXRlcixlLmluaXRWYWx1ZT12b2lkIDA9PT1yLmluaXRWYWx1ZT9cIlwiOnIuaW5pdFZhbHVlLnRvU3RyaW5nKCksZS5kZWxpbWl0ZXI9ci5kZWxpbWl0ZXJ8fFwiXCI9PT1yLmRlbGltaXRlcj9yLmRlbGltaXRlcjpyLmRhdGU/XCIvXCI6ci5udW1lcmFsP1wiLFwiOihyLnBob25lLFwiIFwiKSxlLmRlbGltaXRlckxlbmd0aD1lLmRlbGltaXRlci5sZW5ndGgsZS5kZWxpbWl0ZXJzPXIuZGVsaW1pdGVyc3x8W10sZS5ibG9ja3M9ci5ibG9ja3N8fFtdLGUuYmxvY2tzTGVuZ3RoPWUuYmxvY2tzLmxlbmd0aCxlLnJvb3Q9XCJvYmplY3RcIj09dHlwZW9mIHQmJnQ/dDp3aW5kb3csZS5tYXhMZW5ndGg9MCxlLmJhY2tzcGFjZT0hMSxlLnJlc3VsdD1cIlwiLGV9fTtlLmV4cG9ydHM9cn0pLmNhbGwodCxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpKX1dKX0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2NsZWF2ZS5qcy9kaXN0L2NsZWF2ZS5taW4uanNcbi8vIG1vZHVsZSBpZCA9IDcwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIiFmdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxuKXt2YXIgZT10LnNwbGl0KFwiLlwiKSxyPUg7ZVswXWluIHJ8fCFyLmV4ZWNTY3JpcHR8fHIuZXhlY1NjcmlwdChcInZhciBcIitlWzBdKTtmb3IodmFyIGk7ZS5sZW5ndGgmJihpPWUuc2hpZnQoKSk7KWUubGVuZ3RofHx2b2lkIDA9PT1uP3I9cltpXT9yW2ldOnJbaV09e306cltpXT1ufWZ1bmN0aW9uIG4odCxuKXtmdW5jdGlvbiBlKCl7fWUucHJvdG90eXBlPW4ucHJvdG90eXBlLHQuTT1uLnByb3RvdHlwZSx0LnByb3RvdHlwZT1uZXcgZSx0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj10LHQuTj1mdW5jdGlvbih0LGUscil7Zm9yKHZhciBpPUFycmF5KGFyZ3VtZW50cy5sZW5ndGgtMiksYT0yO2E8YXJndW1lbnRzLmxlbmd0aDthKyspaVthLTJdPWFyZ3VtZW50c1thXTtyZXR1cm4gbi5wcm90b3R5cGVbZV0uYXBwbHkodCxpKX19ZnVuY3Rpb24gZSh0LG4pe251bGwhPXQmJnRoaXMuYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gcih0KXt0LmI9XCJcIn1mdW5jdGlvbiBpKHQsbil7dC5zb3J0KG58fGEpfWZ1bmN0aW9uIGEodCxuKXtyZXR1cm4gdD5uPzE6bj50Py0xOjB9ZnVuY3Rpb24gbCh0KXt2YXIgbixlPVtdLHI9MDtmb3IobiBpbiB0KWVbcisrXT10W25dO3JldHVybiBlfWZ1bmN0aW9uIG8odCxuKXt0aGlzLmI9dCx0aGlzLmE9e307Zm9yKHZhciBlPTA7ZTxuLmxlbmd0aDtlKyspe3ZhciByPW5bZV07dGhpcy5hW3IuYl09cn19ZnVuY3Rpb24gdSh0KXtyZXR1cm4gdD1sKHQuYSksaSh0LGZ1bmN0aW9uKHQsbil7cmV0dXJuIHQuYi1uLmJ9KSx0fWZ1bmN0aW9uIHModCxuKXtzd2l0Y2godGhpcy5iPXQsdGhpcy5nPSEhbi5HLHRoaXMuYT1uLmMsdGhpcy5qPW4udHlwZSx0aGlzLmg9ITEsdGhpcy5hKXtjYXNlIHE6Y2FzZSBKOmNhc2UgTDpjYXNlIE86Y2FzZSBrOmNhc2UgWTpjYXNlIEs6dGhpcy5oPSEwfXRoaXMuZj1uLmRlZmF1bHRWYWx1ZX1mdW5jdGlvbiBmKCl7dGhpcy5hPXt9LHRoaXMuZj10aGlzLmkoKS5hLHRoaXMuYj10aGlzLmc9bnVsbH1mdW5jdGlvbiBwKHQsbil7Zm9yKHZhciBlPXUodC5pKCkpLHI9MDtyPGUubGVuZ3RoO3IrKyl7dmFyIGk9ZVtyXSxhPWkuYjtpZihudWxsIT1uLmFbYV0pe3QuYiYmZGVsZXRlIHQuYltpLmJdO3ZhciBsPTExPT1pLmF8fDEwPT1pLmE7aWYoaS5nKWZvcih2YXIgaT1jKG4sYSl8fFtdLG89MDtvPGkubGVuZ3RoO28rKyl7dmFyIHM9dCxmPWEsaD1sP2lbb10uY2xvbmUoKTppW29dO3MuYVtmXXx8KHMuYVtmXT1bXSkscy5hW2ZdLnB1c2goaCkscy5iJiZkZWxldGUgcy5iW2ZdfWVsc2UgaT1jKG4sYSksbD8obD1jKHQsYSkpP3AobCxpKTptKHQsYSxpLmNsb25lKCkpOm0odCxhLGkpfX19ZnVuY3Rpb24gYyh0LG4pe3ZhciBlPXQuYVtuXTtpZihudWxsPT1lKXJldHVybiBudWxsO2lmKHQuZyl7aWYoIShuIGluIHQuYikpe3ZhciByPXQuZyxpPXQuZltuXTtpZihudWxsIT1lKWlmKGkuZyl7Zm9yKHZhciBhPVtdLGw9MDtsPGUubGVuZ3RoO2wrKylhW2xdPXIuYihpLGVbbF0pO2U9YX1lbHNlIGU9ci5iKGksZSk7cmV0dXJuIHQuYltuXT1lfXJldHVybiB0LmJbbl19cmV0dXJuIGV9ZnVuY3Rpb24gaCh0LG4sZSl7dmFyIHI9Yyh0LG4pO3JldHVybiB0LmZbbl0uZz9yW2V8fDBdOnJ9ZnVuY3Rpb24gZyh0LG4pe3ZhciBlO2lmKG51bGwhPXQuYVtuXSllPWgodCxuLHZvaWQgMCk7ZWxzZSB0OntpZihlPXQuZltuXSx2b2lkIDA9PT1lLmYpe3ZhciByPWUuajtpZihyPT09Qm9vbGVhbillLmY9ITE7ZWxzZSBpZihyPT09TnVtYmVyKWUuZj0wO2Vsc2V7aWYociE9PVN0cmluZyl7ZT1uZXcgcjticmVhayB0fWUuZj1lLmg/XCIwXCI6XCJcIn19ZT1lLmZ9cmV0dXJuIGV9ZnVuY3Rpb24gYih0LG4pe3JldHVybiB0LmZbbl0uZz9udWxsIT10LmFbbl0/dC5hW25dLmxlbmd0aDowOm51bGwhPXQuYVtuXT8xOjB9ZnVuY3Rpb24gbSh0LG4sZSl7dC5hW25dPWUsdC5iJiYodC5iW25dPWUpfWZ1bmN0aW9uIHkodCxuKXt2YXIgZSxyPVtdO2ZvcihlIGluIG4pMCE9ZSYmci5wdXNoKG5ldyBzKGUsbltlXSkpO3JldHVybiBuZXcgbyh0LHIpfS8qXG5cbiBQcm90b2NvbCBCdWZmZXIgMiBDb3B5cmlnaHQgMjAwOCBHb29nbGUgSW5jLlxuIEFsbCBvdGhlciBjb2RlIGNvcHlyaWdodCBpdHMgcmVzcGVjdGl2ZSBvd25lcnMuXG4gQ29weXJpZ2h0IChDKSAyMDEwIFRoZSBMaWJwaG9uZW51bWJlciBBdXRob3JzXG5cbiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG4gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuZnVuY3Rpb24gdigpe2YuY2FsbCh0aGlzKX1mdW5jdGlvbiBkKCl7Zi5jYWxsKHRoaXMpfWZ1bmN0aW9uIF8oKXtmLmNhbGwodGhpcyl9ZnVuY3Rpb24gUygpe31mdW5jdGlvbiB3KCl7fWZ1bmN0aW9uIEEoKXt9LypcblxuIENvcHlyaWdodCAoQykgMjAxMCBUaGUgTGlicGhvbmVudW1iZXIgQXV0aG9ycy5cblxuIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5mdW5jdGlvbiB4KCl7dGhpcy5hPXt9fWZ1bmN0aW9uIE4odCxuKXtpZihudWxsPT1uKXJldHVybiBudWxsO249bi50b1VwcGVyQ2FzZSgpO3ZhciBlPXQuYVtuXTtpZihudWxsPT1lKXtpZihlPXR0W25dLG51bGw9PWUpcmV0dXJuIG51bGw7ZT0obmV3IEEpLmEoXy5pKCksZSksdC5hW25dPWV9cmV0dXJuIGV9ZnVuY3Rpb24gaih0KXtyZXR1cm4gdD1XW3RdLG51bGw9PXQ/XCJaWlwiOnRbMF19ZnVuY3Rpb24gJCh0KXt0aGlzLkg9UmVnRXhwKFwi4oCIXCIpLHRoaXMuQj1cIlwiLHRoaXMubT1uZXcgZSx0aGlzLnY9XCJcIix0aGlzLmg9bmV3IGUsdGhpcy51PW5ldyBlLHRoaXMuaj0hMCx0aGlzLnc9dGhpcy5vPXRoaXMuRD0hMSx0aGlzLkY9eC5iKCksdGhpcy5zPTAsdGhpcy5iPW5ldyBlLHRoaXMuQT0hMSx0aGlzLmw9XCJcIix0aGlzLmE9bmV3IGUsdGhpcy5mPVtdLHRoaXMuQz10LHRoaXMuSj10aGlzLmc9Qyh0aGlzLHRoaXMuQyl9ZnVuY3Rpb24gQyh0LG4pe3ZhciBlO2lmKG51bGwhPW4mJmlzTmFOKG4pJiZuLnRvVXBwZXJDYXNlKClpbiB0dCl7aWYoZT1OKHQuRixuKSxudWxsPT1lKXRocm93XCJJbnZhbGlkIHJlZ2lvbiBjb2RlOiBcIituO2U9ZyhlLDEwKX1lbHNlIGU9MDtyZXR1cm4gZT1OKHQuRixqKGUpKSxudWxsIT1lP2U6YXR9ZnVuY3Rpb24gQih0KXtmb3IodmFyIG49dC5mLmxlbmd0aCxlPTA7bj5lOysrZSl7dmFyIGk9dC5mW2VdLGE9ZyhpLDEpO2lmKHQudj09YSlyZXR1cm4hMTt2YXIgbDtsPXQ7dmFyIG89aSx1PWcobywxKTtpZigtMSE9dS5pbmRleE9mKFwifFwiKSlsPSExO2Vsc2V7dT11LnJlcGxhY2UobHQsXCJcXFxcZFwiKSx1PXUucmVwbGFjZShvdCxcIlxcXFxkXCIpLHIobC5tKTt2YXIgcztzPWw7dmFyIG89ZyhvLDIpLGY9XCI5OTk5OTk5OTk5OTk5OTlcIi5tYXRjaCh1KVswXTtmLmxlbmd0aDxzLmEuYi5sZW5ndGg/cz1cIlwiOihzPWYucmVwbGFjZShuZXcgUmVnRXhwKHUsXCJnXCIpLG8pLHM9cy5yZXBsYWNlKFJlZ0V4cChcIjlcIixcImdcIiksXCLigIhcIikpLDA8cy5sZW5ndGg/KGwubS5hKHMpLGw9ITApOmw9ITF9aWYobClyZXR1cm4gdC52PWEsdC5BPXN0LnRlc3QoaChpLDQpKSx0LnM9MCwhMH1yZXR1cm4gdC5qPSExfWZ1bmN0aW9uIEUodCxuKXtmb3IodmFyIGU9W10scj1uLmxlbmd0aC0zLGk9dC5mLmxlbmd0aCxhPTA7aT5hOysrYSl7dmFyIGw9dC5mW2FdOzA9PWIobCwzKT9lLnB1c2godC5mW2FdKToobD1oKGwsMyxNYXRoLm1pbihyLGIobCwzKS0xKSksMD09bi5zZWFyY2gobCkmJmUucHVzaCh0LmZbYV0pKX10LmY9ZX1mdW5jdGlvbiBSKHQsbil7dC5oLmEobik7dmFyIGU9bjtpZihydC50ZXN0KGUpfHwxPT10LmguYi5sZW5ndGgmJmV0LnRlc3QoZSkpe3ZhciBpLGU9bjtcIitcIj09ZT8oaT1lLHQudS5hKGUpKTooaT1udFtlXSx0LnUuYShpKSx0LmEuYShpKSksbj1pfWVsc2UgdC5qPSExLHQuRD0hMDtpZighdC5qKXtpZighdC5EKWlmKFYodCkpe2lmKFAodCkpcmV0dXJuIEQodCl9ZWxzZSBpZigwPHQubC5sZW5ndGgmJihlPXQuYS50b1N0cmluZygpLHIodC5hKSx0LmEuYSh0LmwpLHQuYS5hKGUpLGU9dC5iLnRvU3RyaW5nKCksaT1lLmxhc3RJbmRleE9mKHQubCkscih0LmIpLHQuYi5hKGUuc3Vic3RyaW5nKDAsaSkpKSx0LmwhPVUodCkpcmV0dXJuIHQuYi5hKFwiIFwiKSxEKHQpO3JldHVybiB0LmgudG9TdHJpbmcoKX1zd2l0Y2godC51LmIubGVuZ3RoKXtjYXNlIDA6Y2FzZSAxOmNhc2UgMjpyZXR1cm4gdC5oLnRvU3RyaW5nKCk7Y2FzZSAzOmlmKCFWKHQpKXJldHVybiB0Lmw9VSh0KSxGKHQpO3Qudz0hMDtkZWZhdWx0OnJldHVybiB0Lnc/KFAodCkmJih0Lnc9ITEpLHQuYi50b1N0cmluZygpK3QuYS50b1N0cmluZygpKTowPHQuZi5sZW5ndGg/KGU9VCh0LG4pLGk9SSh0KSwwPGkubGVuZ3RoP2k6KEUodCx0LmEudG9TdHJpbmcoKSksQih0KT9HKHQpOnQuaj9NKHQsZSk6dC5oLnRvU3RyaW5nKCkpKTpGKHQpfX1mdW5jdGlvbiBEKHQpe3JldHVybiB0Lmo9ITAsdC53PSExLHQuZj1bXSx0LnM9MCxyKHQubSksdC52PVwiXCIsRih0KX1mdW5jdGlvbiBJKHQpe2Zvcih2YXIgbj10LmEudG9TdHJpbmcoKSxlPXQuZi5sZW5ndGgscj0wO2U+cjsrK3Ipe3ZhciBpPXQuZltyXSxhPWcoaSwxKTtpZihuZXcgUmVnRXhwKFwiXig/OlwiK2ErXCIpJFwiKS50ZXN0KG4pKXJldHVybiB0LkE9c3QudGVzdChoKGksNCkpLG49bi5yZXBsYWNlKG5ldyBSZWdFeHAoYSxcImdcIiksaChpLDIpKSxNKHQsbil9cmV0dXJuXCJcIn1mdW5jdGlvbiBNKHQsbil7dmFyIGU9dC5iLmIubGVuZ3RoO3JldHVybiB0LkEmJmU+MCYmXCIgXCIhPXQuYi50b1N0cmluZygpLmNoYXJBdChlLTEpP3QuYitcIiBcIituOnQuYitufWZ1bmN0aW9uIEYodCl7dmFyIG49dC5hLnRvU3RyaW5nKCk7aWYoMzw9bi5sZW5ndGgpe2Zvcih2YXIgZT10Lm8mJjA8Yih0LmcsMjApP2ModC5nLDIwKXx8W106Yyh0LmcsMTkpfHxbXSxyPWUubGVuZ3RoLGk9MDtyPmk7KytpKXt2YXIgYSxsPWVbaV07KGE9bnVsbD09dC5nLmFbMTJdfHx0Lm98fGgobCw2KSl8fChhPWcobCw0KSxhPTA9PWEubGVuZ3RofHxpdC50ZXN0KGEpKSxhJiZ1dC50ZXN0KGcobCwyKSkmJnQuZi5wdXNoKGwpfXJldHVybiBFKHQsbiksbj1JKHQpLDA8bi5sZW5ndGg/bjpCKHQpP0codCk6dC5oLnRvU3RyaW5nKCl9cmV0dXJuIE0odCxuKX1mdW5jdGlvbiBHKHQpe3ZhciBuPXQuYS50b1N0cmluZygpLGU9bi5sZW5ndGg7aWYoZT4wKXtmb3IodmFyIHI9XCJcIixpPTA7ZT5pO2krKylyPVQodCxuLmNoYXJBdChpKSk7cmV0dXJuIHQuaj9NKHQscik6dC5oLnRvU3RyaW5nKCl9cmV0dXJuIHQuYi50b1N0cmluZygpfWZ1bmN0aW9uIFUodCl7dmFyIG4sZT10LmEudG9TdHJpbmcoKSxpPTA7cmV0dXJuIDEhPWgodC5nLDEwKT9uPSExOihuPXQuYS50b1N0cmluZygpLG49XCIxXCI9PW4uY2hhckF0KDApJiZcIjBcIiE9bi5jaGFyQXQoMSkmJlwiMVwiIT1uLmNoYXJBdCgxKSksbj8oaT0xLHQuYi5hKFwiMVwiKS5hKFwiIFwiKSx0Lm89ITApOm51bGwhPXQuZy5hWzE1XSYmKG49bmV3IFJlZ0V4cChcIl4oPzpcIitoKHQuZywxNSkrXCIpXCIpLG49ZS5tYXRjaChuKSxudWxsIT1uJiZudWxsIT1uWzBdJiYwPG5bMF0ubGVuZ3RoJiYodC5vPSEwLGk9blswXS5sZW5ndGgsdC5iLmEoZS5zdWJzdHJpbmcoMCxpKSkpKSxyKHQuYSksdC5hLmEoZS5zdWJzdHJpbmcoaSkpLGUuc3Vic3RyaW5nKDAsaSl9ZnVuY3Rpb24gVih0KXt2YXIgbj10LnUudG9TdHJpbmcoKSxlPW5ldyBSZWdFeHAoXCJeKD86XFxcXCt8XCIraCh0LmcsMTEpK1wiKVwiKSxlPW4ubWF0Y2goZSk7cmV0dXJuIG51bGwhPWUmJm51bGwhPWVbMF0mJjA8ZVswXS5sZW5ndGg/KHQubz0hMCxlPWVbMF0ubGVuZ3RoLHIodC5hKSx0LmEuYShuLnN1YnN0cmluZyhlKSkscih0LmIpLHQuYi5hKG4uc3Vic3RyaW5nKDAsZSkpLFwiK1wiIT1uLmNoYXJBdCgwKSYmdC5iLmEoXCIgXCIpLCEwKTohMX1mdW5jdGlvbiBQKHQpe2lmKDA9PXQuYS5iLmxlbmd0aClyZXR1cm4hMTt2YXIgbixpPW5ldyBlO3Q6e2lmKG49dC5hLnRvU3RyaW5nKCksMCE9bi5sZW5ndGgmJlwiMFwiIT1uLmNoYXJBdCgwKSlmb3IodmFyIGEsbD1uLmxlbmd0aCxvPTE7Mz49byYmbD49bzsrK28paWYoYT1wYXJzZUludChuLnN1YnN0cmluZygwLG8pLDEwKSxhIGluIFcpe2kuYShuLnN1YnN0cmluZyhvKSksbj1hO2JyZWFrIHR9bj0wfXJldHVybiAwPT1uPyExOihyKHQuYSksdC5hLmEoaS50b1N0cmluZygpKSxpPWoobiksXCIwMDFcIj09aT90Lmc9Tih0LkYsXCJcIituKTppIT10LkMmJih0Lmc9Qyh0LGkpKSx0LmIuYShcIlwiK24pLmEoXCIgXCIpLHQubD1cIlwiLCEwKX1mdW5jdGlvbiBUKHQsbil7dmFyIGU9dC5tLnRvU3RyaW5nKCk7aWYoMDw9ZS5zdWJzdHJpbmcodC5zKS5zZWFyY2godC5IKSl7dmFyIGk9ZS5zZWFyY2godC5IKSxlPWUucmVwbGFjZSh0Lkgsbik7cmV0dXJuIHIodC5tKSx0Lm0uYShlKSx0LnM9aSxlLnN1YnN0cmluZygwLHQucysxKX1yZXR1cm4gMT09dC5mLmxlbmd0aCYmKHQuaj0hMSksdC52PVwiXCIsdC5oLnRvU3RyaW5nKCl9dmFyIEg9dGhpcztlLnByb3RvdHlwZS5iPVwiXCIsZS5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYj1cIlwiK3R9LGUucHJvdG90eXBlLmE9ZnVuY3Rpb24odCxuLGUpe2lmKHRoaXMuYis9U3RyaW5nKHQpLG51bGwhPW4pZm9yKHZhciByPTE7cjxhcmd1bWVudHMubGVuZ3RoO3IrKyl0aGlzLmIrPWFyZ3VtZW50c1tyXTtyZXR1cm4gdGhpc30sZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ifTt2YXIgSz0xLFk9MixxPTMsSj00LEw9NixPPTE2LGs9MTg7Zi5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKHQsbil7bSh0aGlzLHQuYixuKX0sZi5wcm90b3R5cGUuY2xvbmU9ZnVuY3Rpb24oKXt2YXIgdD1uZXcgdGhpcy5jb25zdHJ1Y3RvcjtyZXR1cm4gdCE9dGhpcyYmKHQuYT17fSx0LmImJih0LmI9e30pLHAodCx0aGlzKSksdH07dmFyIFo7bih2LGYpO3ZhciB6O24oZCxmKTt2YXIgWDtuKF8sZiksdi5wcm90b3R5cGUuaT1mdW5jdGlvbigpe3JldHVybiBafHwoWj15KHYsezA6e25hbWU6XCJOdW1iZXJGb3JtYXRcIixJOlwiaTE4bi5waG9uZW51bWJlcnMuTnVtYmVyRm9ybWF0XCJ9LDE6e25hbWU6XCJwYXR0ZXJuXCIscmVxdWlyZWQ6ITAsYzo5LHR5cGU6U3RyaW5nfSwyOntuYW1lOlwiZm9ybWF0XCIscmVxdWlyZWQ6ITAsYzo5LHR5cGU6U3RyaW5nfSwzOntuYW1lOlwibGVhZGluZ19kaWdpdHNfcGF0dGVyblwiLEc6ITAsYzo5LHR5cGU6U3RyaW5nfSw0OntuYW1lOlwibmF0aW9uYWxfcHJlZml4X2Zvcm1hdHRpbmdfcnVsZVwiLGM6OSx0eXBlOlN0cmluZ30sNjp7bmFtZTpcIm5hdGlvbmFsX3ByZWZpeF9vcHRpb25hbF93aGVuX2Zvcm1hdHRpbmdcIixjOjgsdHlwZTpCb29sZWFufSw1OntuYW1lOlwiZG9tZXN0aWNfY2Fycmllcl9jb2RlX2Zvcm1hdHRpbmdfcnVsZVwiLGM6OSx0eXBlOlN0cmluZ319KSksWn0sdi5jdG9yPXYsdi5jdG9yLmk9di5wcm90b3R5cGUuaSxkLnByb3RvdHlwZS5pPWZ1bmN0aW9uKCl7cmV0dXJuIHp8fCh6PXkoZCx7MDp7bmFtZTpcIlBob25lTnVtYmVyRGVzY1wiLEk6XCJpMThuLnBob25lbnVtYmVycy5QaG9uZU51bWJlckRlc2NcIn0sMjp7bmFtZTpcIm5hdGlvbmFsX251bWJlcl9wYXR0ZXJuXCIsYzo5LHR5cGU6U3RyaW5nfSwzOntuYW1lOlwicG9zc2libGVfbnVtYmVyX3BhdHRlcm5cIixjOjksdHlwZTpTdHJpbmd9LDY6e25hbWU6XCJleGFtcGxlX251bWJlclwiLGM6OSx0eXBlOlN0cmluZ30sNzp7bmFtZTpcIm5hdGlvbmFsX251bWJlcl9tYXRjaGVyX2RhdGFcIixjOjEyLHR5cGU6U3RyaW5nfSw4OntuYW1lOlwicG9zc2libGVfbnVtYmVyX21hdGNoZXJfZGF0YVwiLGM6MTIsdHlwZTpTdHJpbmd9fSkpLHp9LGQuY3Rvcj1kLGQuY3Rvci5pPWQucHJvdG90eXBlLmksXy5wcm90b3R5cGUuaT1mdW5jdGlvbigpe3JldHVybiBYfHwoWD15KF8sezA6e25hbWU6XCJQaG9uZU1ldGFkYXRhXCIsSTpcImkxOG4ucGhvbmVudW1iZXJzLlBob25lTWV0YWRhdGFcIn0sMTp7bmFtZTpcImdlbmVyYWxfZGVzY1wiLGM6MTEsdHlwZTpkfSwyOntuYW1lOlwiZml4ZWRfbGluZVwiLGM6MTEsdHlwZTpkfSwzOntuYW1lOlwibW9iaWxlXCIsYzoxMSx0eXBlOmR9LDQ6e25hbWU6XCJ0b2xsX2ZyZWVcIixjOjExLHR5cGU6ZH0sNTp7bmFtZTpcInByZW1pdW1fcmF0ZVwiLGM6MTEsdHlwZTpkfSw2OntuYW1lOlwic2hhcmVkX2Nvc3RcIixjOjExLHR5cGU6ZH0sNzp7bmFtZTpcInBlcnNvbmFsX251bWJlclwiLGM6MTEsdHlwZTpkfSw4OntuYW1lOlwidm9pcFwiLGM6MTEsdHlwZTpkfSwyMTp7bmFtZTpcInBhZ2VyXCIsYzoxMSx0eXBlOmR9LDI1OntuYW1lOlwidWFuXCIsYzoxMSx0eXBlOmR9LDI3OntuYW1lOlwiZW1lcmdlbmN5XCIsYzoxMSx0eXBlOmR9LDI4OntuYW1lOlwidm9pY2VtYWlsXCIsYzoxMSx0eXBlOmR9LDI0OntuYW1lOlwibm9faW50ZXJuYXRpb25hbF9kaWFsbGluZ1wiLGM6MTEsdHlwZTpkfSw5OntuYW1lOlwiaWRcIixyZXF1aXJlZDohMCxjOjksdHlwZTpTdHJpbmd9LDEwOntuYW1lOlwiY291bnRyeV9jb2RlXCIsYzo1LHR5cGU6TnVtYmVyfSwxMTp7bmFtZTpcImludGVybmF0aW9uYWxfcHJlZml4XCIsYzo5LHR5cGU6U3RyaW5nfSwxNzp7bmFtZTpcInByZWZlcnJlZF9pbnRlcm5hdGlvbmFsX3ByZWZpeFwiLGM6OSx0eXBlOlN0cmluZ30sMTI6e25hbWU6XCJuYXRpb25hbF9wcmVmaXhcIixjOjksdHlwZTpTdHJpbmd9LDEzOntuYW1lOlwicHJlZmVycmVkX2V4dG5fcHJlZml4XCIsYzo5LHR5cGU6U3RyaW5nfSwxNTp7bmFtZTpcIm5hdGlvbmFsX3ByZWZpeF9mb3JfcGFyc2luZ1wiLGM6OSx0eXBlOlN0cmluZ30sMTY6e25hbWU6XCJuYXRpb25hbF9wcmVmaXhfdHJhbnNmb3JtX3J1bGVcIixjOjksdHlwZTpTdHJpbmd9LDE4OntuYW1lOlwic2FtZV9tb2JpbGVfYW5kX2ZpeGVkX2xpbmVfcGF0dGVyblwiLGM6OCxkZWZhdWx0VmFsdWU6ITEsdHlwZTpCb29sZWFufSwxOTp7bmFtZTpcIm51bWJlcl9mb3JtYXRcIixHOiEwLGM6MTEsdHlwZTp2fSwyMDp7bmFtZTpcImludGxfbnVtYmVyX2Zvcm1hdFwiLEc6ITAsYzoxMSx0eXBlOnZ9LDIyOntuYW1lOlwibWFpbl9jb3VudHJ5X2Zvcl9jb2RlXCIsYzo4LGRlZmF1bHRWYWx1ZTohMSx0eXBlOkJvb2xlYW59LDIzOntuYW1lOlwibGVhZGluZ19kaWdpdHNcIixjOjksdHlwZTpTdHJpbmd9LDI2OntuYW1lOlwibGVhZGluZ196ZXJvX3Bvc3NpYmxlXCIsYzo4LGRlZmF1bHRWYWx1ZTohMSx0eXBlOkJvb2xlYW59fSkpLFh9LF8uY3Rvcj1fLF8uY3Rvci5pPV8ucHJvdG90eXBlLmksUy5wcm90b3R5cGUuYT1mdW5jdGlvbih0KXt0aHJvdyBuZXcgdC5iLEVycm9yKFwiVW5pbXBsZW1lbnRlZFwiKX0sUy5wcm90b3R5cGUuYj1mdW5jdGlvbih0LG4pe2lmKDExPT10LmF8fDEwPT10LmEpcmV0dXJuIG4gaW5zdGFuY2VvZiBmP246dGhpcy5hKHQuai5wcm90b3R5cGUuaSgpLG4pO2lmKDE0PT10LmEpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBuJiZRLnRlc3Qobikpe3ZhciBlPU51bWJlcihuKTtpZihlPjApcmV0dXJuIGV9cmV0dXJuIG59aWYoIXQuaClyZXR1cm4gbjtpZihlPXQuaixlPT09U3RyaW5nKXtpZihcIm51bWJlclwiPT10eXBlb2YgbilyZXR1cm4gU3RyaW5nKG4pfWVsc2UgaWYoZT09PU51bWJlciYmXCJzdHJpbmdcIj09dHlwZW9mIG4mJihcIkluZmluaXR5XCI9PT1ufHxcIi1JbmZpbml0eVwiPT09bnx8XCJOYU5cIj09PW58fFEudGVzdChuKSkpcmV0dXJuIE51bWJlcihuKTtyZXR1cm4gbn07dmFyIFE9L14tP1swLTldKyQvO24odyxTKSx3LnByb3RvdHlwZS5hPWZ1bmN0aW9uKHQsbil7dmFyIGU9bmV3IHQuYjtyZXR1cm4gZS5nPXRoaXMsZS5hPW4sZS5iPXt9LGV9LG4oQSx3KSxBLnByb3RvdHlwZS5iPWZ1bmN0aW9uKHQsbil7cmV0dXJuIDg9PXQuYT8hIW46Uy5wcm90b3R5cGUuYi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LEEucHJvdG90eXBlLmE9ZnVuY3Rpb24odCxuKXtyZXR1cm4gQS5NLmEuY2FsbCh0aGlzLHQsbil9Oy8qXG5cbiBDb3B5cmlnaHQgKEMpIDIwMTAgVGhlIExpYnBob25lbnVtYmVyIEF1dGhvcnNcblxuIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG52YXIgVz17MTpcIlVTIEFHIEFJIEFTIEJCIEJNIEJTIENBIERNIERPIEdEIEdVIEpNIEtOIEtZIExDIE1QIE1TIFBSIFNYIFRDIFRUIFZDIFZHIFZJXCIuc3BsaXQoXCIgXCIpfSx0dD17VVM6W251bGwsW251bGwsbnVsbCxcIlsyLTldXFxcXGR7OX1cIixcIlxcXFxkezd9KD86XFxcXGR7M30pP1wiXSxbbnVsbCxudWxsLFwiKD86Mig/OjBbMS0zNS05XXwxWzAyLTldfDJbMDQ1ODldfDNbMTQ5XXw0WzA4XXw1WzEtNDZdfDZbMDI3OV18N1swMjZdfDhbMTNdKXwzKD86MFsxLTU3LTldfDFbMDItOV18MlswMTM1XXwzWzAxNDY3OV18NFs2N118NVsxMl18NlswMTRdfDhbMDU2XSl8NCg/OjBbMTI0LTldfDFbMDItNTc5XXwyWzMtNV18M1swMjQ1XXw0WzAyMzVdfDU4fDY5fDdbMDU4OV18OFswNF0pfDUoPzowWzEtNTctOV18MVswMjM1LThdfDIwfDNbMDE0OV18NFswMV18NVsxOV18NlsxLTM3XXw3WzAxMy01XXw4WzA1Nl0pfDYoPzowWzEtMzUtOV18MVswMjQtOV18MlswMzY4OV18M1swMTZdfDRbMTZdfDVbMDE3XXw2WzAtMjc5XXw3OHw4WzEyXSl8Nyg/OjBbMS00Ni04XXwxWzAyLTldfDJbMDQ1N118M1sxMjQ3XXw0WzAzN118NVs0N118NlswMjM1OV18N1swMi01OV18OFsxNTZdKXw4KD86MFsxLTY4XXwxWzAyLThdfDI4fDNbMC0yNV18NFszNTc4XXw1WzA0Ni05XXw2WzAyLTVdfDdbMDI4XSl8OSg/OjBbMTM0Ni05XXwxWzAyLTldfDJbMDU4OV18M1swMTY3OF18NFswMTc5XXw1WzEyNDY5XXw3WzAtMzU4OV18OFswNDU5XSkpWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7N30oPzpcXFxcZHszfSk/XCIsbnVsbCxudWxsLFwiMjAxNTU1NTU1NVwiXSxbbnVsbCxudWxsLFwiKD86Mig/OjBbMS0zNS05XXwxWzAyLTldfDJbMDQ1ODldfDNbMTQ5XXw0WzA4XXw1WzEtNDZdfDZbMDI3OV18N1swMjZdfDhbMTNdKXwzKD86MFsxLTU3LTldfDFbMDItOV18MlswMTM1XXwzWzAxNDY3OV18NFs2N118NVsxMl18NlswMTRdfDhbMDU2XSl8NCg/OjBbMTI0LTldfDFbMDItNTc5XXwyWzMtNV18M1swMjQ1XXw0WzAyMzVdfDU4fDY5fDdbMDU4OV18OFswNF0pfDUoPzowWzEtNTctOV18MVswMjM1LThdfDIwfDNbMDE0OV18NFswMV18NVsxOV18NlsxLTM3XXw3WzAxMy01XXw4WzA1Nl0pfDYoPzowWzEtMzUtOV18MVswMjQtOV18MlswMzY4OV18M1swMTZdfDRbMTZdfDVbMDE3XXw2WzAtMjc5XXw3OHw4WzEyXSl8Nyg/OjBbMS00Ni04XXwxWzAyLTldfDJbMDQ1N118M1sxMjQ3XXw0WzAzN118NVs0N118NlswMjM1OV18N1swMi01OV18OFsxNTZdKXw4KD86MFsxLTY4XXwxWzAyLThdfDI4fDNbMC0yNV18NFszNTc4XXw1WzA0Ni05XXw2WzAyLTVdfDdbMDI4XSl8OSg/OjBbMTM0Ni05XXwxWzAyLTldfDJbMDU4OV18M1swMTY3OF18NFswMTc5XXw1WzEyNDY5XXw3WzAtMzU4OV18OFswNDU5XSkpWzItOV1cXFxcZHs2fVwiLFwiXFxcXGR7N30oPzpcXFxcZHszfSk/XCIsbnVsbCxudWxsLFwiMjAxNTU1NTU1NVwiXSxbbnVsbCxudWxsLFwiOCg/OjAwfDQ0fDU1fDY2fDc3fDg4KVsyLTldXFxcXGR7Nn1cIixcIlxcXFxkezEwfVwiLG51bGwsbnVsbCxcIjgwMDIzNDU2NzhcIl0sW251bGwsbnVsbCxcIjkwMFsyLTldXFxcXGR7Nn1cIixcIlxcXFxkezEwfVwiLG51bGwsbnVsbCxcIjkwMDIzNDU2NzhcIl0sW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXSxbbnVsbCxudWxsLFwiNSg/OjAwfDMzfDQ0fDY2fDc3fDg4KVsyLTldXFxcXGR7Nn1cIixcIlxcXFxkezEwfVwiLG51bGwsbnVsbCxcIjUwMDIzNDU2NzhcIl0sW251bGwsbnVsbCxcIk5BXCIsXCJOQVwiXSxcIlVTXCIsMSxcIjAxMVwiLFwiMVwiLG51bGwsbnVsbCxcIjFcIixudWxsLG51bGwsMSxbW251bGwsXCIoXFxcXGR7M30pKFxcXFxkezR9KVwiLFwiJDEtJDJcIixudWxsLG51bGwsbnVsbCwxXSxbbnVsbCxcIihcXFxcZHszfSkoXFxcXGR7M30pKFxcXFxkezR9KVwiLFwiKCQxKSAkMi0kM1wiLG51bGwsbnVsbCxudWxsLDFdXSxbW251bGwsXCIoXFxcXGR7M30pKFxcXFxkezN9KShcXFxcZHs0fSlcIixcIiQxLSQyLSQzXCJdXSxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdLDEsbnVsbCxbbnVsbCxudWxsLFwiTkFcIixcIk5BXCJdLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl0sbnVsbCxudWxsLFtudWxsLG51bGwsXCJOQVwiLFwiTkFcIl1dfTt4LmI9ZnVuY3Rpb24oKXtyZXR1cm4geC5hP3guYTp4LmE9bmV3IHh9O3ZhciBudD17MDpcIjBcIiwxOlwiMVwiLDI6XCIyXCIsMzpcIjNcIiw0OlwiNFwiLDU6XCI1XCIsNjpcIjZcIiw3OlwiN1wiLDg6XCI4XCIsOTpcIjlcIixcIu+8kFwiOlwiMFwiLFwi77yRXCI6XCIxXCIsXCLvvJJcIjpcIjJcIixcIu+8k1wiOlwiM1wiLFwi77yUXCI6XCI0XCIsXCLvvJVcIjpcIjVcIixcIu+8llwiOlwiNlwiLFwi77yXXCI6XCI3XCIsXCLvvJhcIjpcIjhcIixcIu+8mVwiOlwiOVwiLFwi2aBcIjpcIjBcIixcItmhXCI6XCIxXCIsXCLZolwiOlwiMlwiLFwi2aNcIjpcIjNcIixcItmkXCI6XCI0XCIsXCLZpVwiOlwiNVwiLFwi2aZcIjpcIjZcIixcItmnXCI6XCI3XCIsXCLZqFwiOlwiOFwiLFwi2alcIjpcIjlcIixcItuwXCI6XCIwXCIsXCLbsVwiOlwiMVwiLFwi27JcIjpcIjJcIixcItuzXCI6XCIzXCIsXCLbtFwiOlwiNFwiLFwi27VcIjpcIjVcIixcItu2XCI6XCI2XCIsXCLbt1wiOlwiN1wiLFwi27hcIjpcIjhcIixcItu5XCI6XCI5XCJ9LGV0PVJlZ0V4cChcIlsr77yLXStcIikscnQ9UmVnRXhwKFwiKFswLTnvvJAt77yZ2aAt2anbsC3buV0pXCIpLGl0PS9eXFwoP1xcJDFcXCk/JC8sYXQ9bmV3IF87bShhdCwxMSxcIk5BXCIpO3ZhciBsdD0vXFxbKFteXFxbXFxdXSkqXFxdL2csb3Q9L1xcZCg/PVteLH1dW14sfV0pL2csdXQ9UmVnRXhwKFwiXlsteOKAkC3igJXiiJLjg7zvvI0t77yPIMKgwq3igIvigaDjgIAoKe+8iO+8ie+8u++8vS5cXFxcW1xcXFxdL37igZPiiLzvvZ5dKihcXFxcJFxcXFxkWy144oCQLeKAleKIkuODvO+8jS3vvI8gwqDCreKAi+KBoOOAgCgp77yI77yJ77y777y9LlxcXFxbXFxcXF0vfuKBk+KIvO+9nl0qKSskXCIpLHN0PS9bLSBdLzskLnByb3RvdHlwZS5LPWZ1bmN0aW9uKCl7dGhpcy5CPVwiXCIscih0aGlzLmgpLHIodGhpcy51KSxyKHRoaXMubSksdGhpcy5zPTAsdGhpcy52PVwiXCIscih0aGlzLmIpLHRoaXMubD1cIlwiLHIodGhpcy5hKSx0aGlzLmo9ITAsdGhpcy53PXRoaXMubz10aGlzLkQ9ITEsdGhpcy5mPVtdLHRoaXMuQT0hMSx0aGlzLmchPXRoaXMuSiYmKHRoaXMuZz1DKHRoaXMsdGhpcy5DKSl9LCQucHJvdG90eXBlLkw9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuQj1SKHRoaXMsdCl9LHQoXCJDbGVhdmUuQXNZb3VUeXBlRm9ybWF0dGVyXCIsJCksdChcIkNsZWF2ZS5Bc1lvdVR5cGVGb3JtYXR0ZXIucHJvdG90eXBlLmlucHV0RGlnaXRcIiwkLnByb3RvdHlwZS5MKSx0KFwiQ2xlYXZlLkFzWW91VHlwZUZvcm1hdHRlci5wcm90b3R5cGUuY2xlYXJcIiwkLnByb3RvdHlwZS5LKX0uY2FsbChcIm9iamVjdFwiPT10eXBlb2YgZ2xvYmFsJiZnbG9iYWw/Z2xvYmFsOndpbmRvdyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY2xlYXZlLmpzL2Rpc3QvYWRkb25zL2NsZWF2ZS1waG9uZS51cy5qc1xuLy8gbW9kdWxlIGlkID0gNzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XCJzY3JlZW4tc21hbGxcIjozNzUsXCJzY3JlZW4tbWVkaXVtXCI6NzAwLFwic2NyZWVuLWxhcmdlXCI6MTAyNCxcInNjcmVlbi14bGFyZ2VcIjoxMjAwfVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3ZhcmlhYmxlcy5qc29uXG4vLyBtb2R1bGUgaWQgPSA3MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBSZXNpemUgcmVDQVBUQ0hBIHRvIGZpdCB3aWR0aCBvZiBjb250YWluZXJcclxuLy8gU2luY2UgaXQgaGFzIGEgZml4ZWQgd2lkdGgsIHdlJ3JlIHNjYWxpbmdcclxuLy8gdXNpbmcgQ1NTMyB0cmFuc2Zvcm1zXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBjYXB0Y2hhU2NhbGUgPSBjb250YWluZXJXaWR0aCAvIGVsZW1lbnRXaWR0aFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XHJcbiAgZnVuY3Rpb24gc2NhbGVDYXB0Y2hhKCkge1xyXG4gICAgLy8gV2lkdGggb2YgdGhlIHJlQ0FQVENIQSBlbGVtZW50LCBpbiBwaXhlbHNcclxuICAgIHZhciByZUNhcHRjaGFXaWR0aCA9IDMwNDtcclxuICAgIC8vIEdldCB0aGUgY29udGFpbmluZyBlbGVtZW50J3Mgd2lkdGhcclxuICAgIHZhciBjb250YWluZXJXaWR0aCA9ICQoJy5zbXMtZm9ybS13cmFwcGVyJykud2lkdGgoKTtcclxuICAgIFxyXG4gICAgLy8gT25seSBzY2FsZSB0aGUgcmVDQVBUQ0hBIGlmIGl0IHdvbid0IGZpdFxyXG4gICAgLy8gaW5zaWRlIHRoZSBjb250YWluZXJcclxuICAgIGlmKHJlQ2FwdGNoYVdpZHRoID4gY29udGFpbmVyV2lkdGgpIHtcclxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBzY2FsZVxyXG4gICAgICB2YXIgY2FwdGNoYVNjYWxlID0gY29udGFpbmVyV2lkdGggLyByZUNhcHRjaGFXaWR0aDtcclxuICAgICAgLy8gQXBwbHkgdGhlIHRyYW5zZm9ybWF0aW9uXHJcbiAgICAgICQoJy5nLXJlY2FwdGNoYScpLmNzcyh7XHJcbiAgICAgICAgdHJhbnNmb3JtOidzY2FsZSgnK2NhcHRjaGFTY2FsZSsnKSdcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAkKGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gSW5pdGlhbGl6ZSBzY2FsaW5nXHJcbiAgICBzY2FsZUNhcHRjaGEoKTtcclxuICB9KTtcclxuXHJcbiAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuICAgIC8vIFVwZGF0ZSBzY2FsaW5nIG9uIHdpbmRvdyByZXNpemVcclxuICAgIC8vIFVzZXMgalF1ZXJ5IHRocm90dGxlIHBsdWdpbiB0byBsaW1pdCBzdHJhaW4gb24gdGhlIGJyb3dzZXJcclxuICAgIHNjYWxlQ2FwdGNoYSgpO1xyXG4gIH0pO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvY2FwdGNoYVJlc2l6ZS5qcyIsIi8qKlxuKiBIb21lIFJvdGF0aW5nIFRleHQgQW5pbWF0aW9uXG4qIFJlZmVycmVkIGZyb20gU3RhY2tvdmVyZmxvd1xuKiBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI3NzE3ODkvY2hhbmdpbmctdGV4dC1wZXJpb2RpY2FsbHktaW4tYS1zcGFuLWZyb20tYW4tYXJyYXktd2l0aC1qcXVlcnkvMjc3MjI3OCMyNzcyMjc4XG4qL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIHRlcm1zID0gW107XG5cbiAgJCgnLnJvdGF0aW5nLXRleHRfX2VudHJ5JykuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xuICAgIGlmICgkKGUpLnRleHQoKS50cmltKCkgIT09ICcnKSB7XG4gICAgICB0ZXJtcy5wdXNoKCQoZSkudGV4dCgpKTtcbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHJvdGF0ZVRlcm0oKSB7XG4gICAgdmFyIGN0ID0gJChcIiNyb3RhdGVcIikuZGF0YShcInRlcm1cIikgfHwgMDtcbiAgICAkKFwiI3JvdGF0ZVwiKS5kYXRhKFwidGVybVwiLCBjdCA9PT0gdGVybXMubGVuZ3RoIC0xID8gMCA6IGN0ICsgMSkudGV4dCh0ZXJtc1tjdF0pLmZhZGVJbigpLmRlbGF5KDIwMDApLmZhZGVPdXQoMjAwLCByb3RhdGVUZXJtKTtcbiAgfVxuICAkKHJvdGF0ZVRlcm0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvcm90YXRpbmdUZXh0QW5pbWF0aW9uLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTWlzc1BsZXRlIGZyb20gJ21pc3MtcGxldGUtanMnO1xuXG5jbGFzcyBTZWFyY2gge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBtb2R1bGVcbiAgICovXG4gIGluaXQoKSB7XG4gICAgdGhpcy5faW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChTZWFyY2guc2VsZWN0b3JzLk1BSU4pO1xuXG4gICAgaWYgKCF0aGlzLl9pbnB1dHMpIHJldHVybjtcblxuICAgIGZvciAobGV0IGkgPSB0aGlzLl9pbnB1dHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRoaXMuX3N1Z2dlc3Rpb25zKHRoaXMuX2lucHV0c1tpXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBzdWdnZXN0ZWQgc2VhcmNoIHRlcm0gZHJvcGRvd24uXG4gICAqIEBwYXJhbSAge29iamVjdH0gaW5wdXQgVGhlIHNlYXJjaCBpbnB1dC5cbiAgICovXG4gIF9zdWdnZXN0aW9ucyhpbnB1dCkge1xuICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShpbnB1dC5kYXRhc2V0LmpzU2VhcmNoU3VnZ2VzdGlvbnMpO1xuXG4gICAgaW5wdXQuX01pc3NQbGV0ZSA9IG5ldyBNaXNzUGxldGUoe1xuICAgICAgaW5wdXQ6IGlucHV0LFxuICAgICAgb3B0aW9uczogZGF0YSxcbiAgICAgIGNsYXNzTmFtZTogaW5wdXQuZGF0YXNldC5qc1NlYXJjaERyb3Bkb3duQ2xhc3NcbiAgICB9KTtcbiAgfVxufVxuXG5TZWFyY2guc2VsZWN0b3JzID0ge1xuICBNQUlOOiAnW2RhdGEtanMqPVwic2VhcmNoXCJdJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2VhcmNoO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3NlYXJjaC5qcyIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk1pc3NQbGV0ZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJNaXNzUGxldGVcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cblxuLyoqKi8gfSksXG4vKiAxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXHRcblx0dmFyIF9qYXJvV2lua2xlciA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XG5cdFxuXHR2YXIgX2phcm9XaW5rbGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2phcm9XaW5rbGVyKTtcblx0XG5cdHZhciBfbWVtb2l6ZSA9IF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5cdFxuXHR2YXIgX21lbW9pemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVtb2l6ZSk7XG5cdFxuXHRmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXHRcblx0ZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblx0XG5cdHZhciBNaXNzUGxldGUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgZnVuY3Rpb24gTWlzc1BsZXRlKF9yZWYpIHtcblx0ICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cdFxuXHQgICAgdmFyIGlucHV0ID0gX3JlZi5pbnB1dCxcblx0ICAgICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuXHQgICAgICAgIGNsYXNzTmFtZSA9IF9yZWYuY2xhc3NOYW1lLFxuXHQgICAgICAgIF9yZWYkc2NvcmVGbiA9IF9yZWYuc2NvcmVGbixcblx0ICAgICAgICBzY29yZUZuID0gX3JlZiRzY29yZUZuID09PSB1bmRlZmluZWQgPyAoMCwgX21lbW9pemUyLmRlZmF1bHQpKE1pc3NQbGV0ZS5zY29yZUZuKSA6IF9yZWYkc2NvcmVGbixcblx0ICAgICAgICBfcmVmJGxpc3RJdGVtRm4gPSBfcmVmLmxpc3RJdGVtRm4sXG5cdCAgICAgICAgbGlzdEl0ZW1GbiA9IF9yZWYkbGlzdEl0ZW1GbiA9PT0gdW5kZWZpbmVkID8gTWlzc1BsZXRlLmxpc3RJdGVtRm4gOiBfcmVmJGxpc3RJdGVtRm47XG5cdFxuXHQgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1pc3NQbGV0ZSk7XG5cdFxuXHQgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7IGlucHV0OiBpbnB1dCwgb3B0aW9uczogb3B0aW9ucywgY2xhc3NOYW1lOiBjbGFzc05hbWUsIHNjb3JlRm46IHNjb3JlRm4sIGxpc3RJdGVtRm46IGxpc3RJdGVtRm4gfSk7XG5cdFxuXHQgICAgdGhpcy5zY29yZWRPcHRpb25zID0gbnVsbDtcblx0ICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcblx0ICAgIHRoaXMudWwgPSBudWxsO1xuXHQgICAgdGhpcy5oaWdobGlnaHRlZEluZGV4ID0gLTE7XG5cdFxuXHQgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKF90aGlzLmlucHV0LnZhbHVlLmxlbmd0aCA+IDApIHtcblx0ICAgICAgICBfdGhpcy5zY29yZWRPcHRpb25zID0gX3RoaXMub3B0aW9ucy5tYXAoZnVuY3Rpb24gKG9wdGlvbikge1xuXHQgICAgICAgICAgcmV0dXJuIHNjb3JlRm4oX3RoaXMuaW5wdXQudmFsdWUsIG9wdGlvbik7XG5cdCAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHQgICAgICAgICAgcmV0dXJuIGIuc2NvcmUgLSBhLnNjb3JlO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIF90aGlzLnNjb3JlZE9wdGlvbnMgPSBbXTtcblx0ICAgICAgfVxuXHQgICAgICBfdGhpcy5yZW5kZXJPcHRpb25zKCk7XG5cdCAgICB9KTtcblx0XG5cdCAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgaWYgKF90aGlzLnVsKSB7XG5cdCAgICAgICAgLy8gZHJvcGRvd24gdmlzaWJsZT9cblx0ICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcblx0ICAgICAgICAgIGNhc2UgMTM6XG5cdCAgICAgICAgICAgIF90aGlzLnNlbGVjdCgpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgMjc6XG5cdCAgICAgICAgICAgIC8vIEVzY1xuXHQgICAgICAgICAgICBfdGhpcy5yZW1vdmVEcm9wZG93bigpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgIGNhc2UgNDA6XG5cdCAgICAgICAgICAgIC8vIERvd24gYXJyb3dcblx0ICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHVwIGFycm93IHBsYWNlcyB0aGUgY3Vyc29yIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlXG5cdCAgICAgICAgICAgIC8vIGZpZWxkLCBhbmQgZG93biBhcnJvdyBhdCB0aGUgZW5kXG5cdCAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgIF90aGlzLmNoYW5nZUhpZ2hsaWdodGVkT3B0aW9uKF90aGlzLmhpZ2hsaWdodGVkSW5kZXggPCBfdGhpcy51bC5jaGlsZHJlbi5sZW5ndGggLSAxID8gX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCArIDEgOiAtMSk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgY2FzZSAzODpcblx0ICAgICAgICAgICAgLy8gVXAgYXJyb3dcblx0ICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgICAgICAgX3RoaXMuY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24oX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCA+IC0xID8gX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCAtIDEgOiBfdGhpcy51bC5jaGlsZHJlbi5sZW5ndGggLSAxKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9KTtcblx0XG5cdCAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgX3RoaXMucmVtb3ZlRHJvcGRvd24oKTtcblx0ICAgICAgX3RoaXMuaGlnaGxpZ2h0ZWRJbmRleCA9IC0xO1xuXHQgICAgfSk7XG5cdCAgfSAvLyBlbmQgY29uc3RydWN0b3Jcblx0XG5cdCAgX2NyZWF0ZUNsYXNzKE1pc3NQbGV0ZSwgW3tcblx0ICAgIGtleTogJ2dldFNpYmxpbmdJbmRleCcsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U2libGluZ0luZGV4KG5vZGUpIHtcblx0ICAgICAgdmFyIGluZGV4ID0gLTE7XG5cdCAgICAgIHZhciBuID0gbm9kZTtcblx0ICAgICAgZG8ge1xuXHQgICAgICAgIGluZGV4Kys7XG5cdCAgICAgICAgbiA9IG4ucHJldmlvdXNFbGVtZW50U2libGluZztcblx0ICAgICAgfSB3aGlsZSAobik7XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH1cblx0ICB9LCB7XG5cdCAgICBrZXk6ICdyZW5kZXJPcHRpb25zJyxcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXJPcHRpb25zKCkge1xuXHQgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblx0XG5cdCAgICAgIHZhciBkb2N1bWVudEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcblx0ICAgICAgdGhpcy5zY29yZWRPcHRpb25zLmV2ZXJ5KGZ1bmN0aW9uIChzY29yZWRPcHRpb24sIGkpIHtcblx0ICAgICAgICB2YXIgbGlzdEl0ZW0gPSBfdGhpczIubGlzdEl0ZW1GbihzY29yZWRPcHRpb24sIGkpO1xuXHQgICAgICAgIGxpc3RJdGVtICYmIGRvY3VtZW50RnJhZ21lbnQuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuXHQgICAgICAgIHJldHVybiAhIWxpc3RJdGVtO1xuXHQgICAgICB9KTtcblx0XG5cdCAgICAgIHRoaXMucmVtb3ZlRHJvcGRvd24oKTtcblx0ICAgICAgdGhpcy5oaWdobGlnaHRlZEluZGV4ID0gLTE7XG5cdFxuXHQgICAgICBpZiAoZG9jdW1lbnRGcmFnbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcblx0ICAgICAgICB2YXIgbmV3VWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG5cdCAgICAgICAgbmV3VWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdCAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09ICdMSScpIHtcblx0ICAgICAgICAgICAgX3RoaXMyLmNoYW5nZUhpZ2hsaWdodGVkT3B0aW9uKF90aGlzMi5nZXRTaWJsaW5nSW5kZXgoZXZlbnQudGFyZ2V0KSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdFxuXHQgICAgICAgIG5ld1VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICBfdGhpczIuY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24oLTEpO1xuXHQgICAgICAgIH0pO1xuXHRcblx0ICAgICAgICBuZXdVbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgICAgIHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgIH0pO1xuXHRcblx0ICAgICAgICBuZXdVbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lID09PSAnTEknKSB7XG5cdCAgICAgICAgICAgIF90aGlzMi5zZWxlY3QoKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0XG5cdCAgICAgICAgbmV3VWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnRGcmFnbWVudCk7XG5cdFxuXHQgICAgICAgIC8vIFNlZSBDU1MgdG8gdW5kZXJzdGFuZCB3aHkgdGhlIDx1bD4gaGFzIHRvIGJlIHdyYXBwZWQgaW4gYSA8ZGl2PlxuXHQgICAgICAgIHZhciBuZXdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHQgICAgICAgIG5ld0NvbnRhaW5lci5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZTtcblx0ICAgICAgICBuZXdDb250YWluZXIuYXBwZW5kQ2hpbGQobmV3VWwpO1xuXHRcblx0ICAgICAgICAvLyBJbnNlcnRzIHRoZSBkcm9wZG93biBqdXN0IGFmdGVyIHRoZSA8aW5wdXQ+IGVsZW1lbnRcblx0ICAgICAgICB0aGlzLmlucHV0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld0NvbnRhaW5lciwgdGhpcy5pbnB1dC5uZXh0U2libGluZyk7XG5cdCAgICAgICAgdGhpcy5jb250YWluZXIgPSBuZXdDb250YWluZXI7XG5cdCAgICAgICAgdGhpcy51bCA9IG5ld1VsO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAnY2hhbmdlSGlnaGxpZ2h0ZWRPcHRpb24nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZUhpZ2hsaWdodGVkT3B0aW9uKG5ld0hpZ2hsaWdodGVkSW5kZXgpIHtcblx0ICAgICAgaWYgKG5ld0hpZ2hsaWdodGVkSW5kZXggPj0gLTEgJiYgbmV3SGlnaGxpZ2h0ZWRJbmRleCA8IHRoaXMudWwuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdCAgICAgICAgLy8gSWYgYW55IG9wdGlvbiBhbHJlYWR5IHNlbGVjdGVkLCB0aGVuIHVuc2VsZWN0IGl0XG5cdCAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0ZWRJbmRleCAhPT0gLTEpIHtcblx0ICAgICAgICAgIHRoaXMudWwuY2hpbGRyZW5bdGhpcy5oaWdobGlnaHRlZEluZGV4XS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlnaGxpZ2h0XCIpO1xuXHQgICAgICAgIH1cblx0XG5cdCAgICAgICAgdGhpcy5oaWdobGlnaHRlZEluZGV4ID0gbmV3SGlnaGxpZ2h0ZWRJbmRleDtcblx0XG5cdCAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0ZWRJbmRleCAhPT0gLTEpIHtcblx0ICAgICAgICAgIHRoaXMudWwuY2hpbGRyZW5bdGhpcy5oaWdobGlnaHRlZEluZGV4XS5jbGFzc0xpc3QuYWRkKFwiaGlnaGxpZ2h0XCIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ3NlbGVjdCcsXG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gc2VsZWN0KCkge1xuXHQgICAgICBpZiAodGhpcy5oaWdobGlnaHRlZEluZGV4ICE9PSAtMSkge1xuXHQgICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSB0aGlzLnNjb3JlZE9wdGlvbnNbdGhpcy5oaWdobGlnaHRlZEluZGV4XS5kaXNwbGF5VmFsdWU7XG5cdCAgICAgICAgdGhpcy5yZW1vdmVEcm9wZG93bigpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfSwge1xuXHQgICAga2V5OiAncmVtb3ZlRHJvcGRvd24nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZURyb3Bkb3duKCkge1xuXHQgICAgICB0aGlzLmNvbnRhaW5lciAmJiB0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcblx0ICAgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuXHQgICAgICB0aGlzLnVsID0gbnVsbDtcblx0ICAgIH1cblx0ICB9XSwgW3tcblx0ICAgIGtleTogJ3Njb3JlRm4nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIHNjb3JlRm4oaW5wdXRWYWx1ZSwgb3B0aW9uU3lub255bXMpIHtcblx0ICAgICAgdmFyIGNsb3Nlc3RTeW5vbnltID0gbnVsbDtcblx0ICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuXHQgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IgPSBmYWxzZTtcblx0ICAgICAgdmFyIF9pdGVyYXRvckVycm9yID0gdW5kZWZpbmVkO1xuXHRcblx0ICAgICAgdHJ5IHtcblx0ICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBvcHRpb25TeW5vbnltc1tTeW1ib2wuaXRlcmF0b3JdKCksIF9zdGVwOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSAoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IHRydWUpIHtcblx0ICAgICAgICAgIHZhciBzeW5vbnltID0gX3N0ZXAudmFsdWU7XG5cdFxuXHQgICAgICAgICAgdmFyIHNpbWlsYXJpdHkgPSAoMCwgX2phcm9XaW5rbGVyMi5kZWZhdWx0KShzeW5vbnltLnRyaW0oKS50b0xvd2VyQ2FzZSgpLCBpbnB1dFZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpKTtcblx0ICAgICAgICAgIGlmIChjbG9zZXN0U3lub255bSA9PT0gbnVsbCB8fCBzaW1pbGFyaXR5ID4gY2xvc2VzdFN5bm9ueW0uc2ltaWxhcml0eSkge1xuXHQgICAgICAgICAgICBjbG9zZXN0U3lub255bSA9IHsgc2ltaWxhcml0eTogc2ltaWxhcml0eSwgdmFsdWU6IHN5bm9ueW0gfTtcblx0ICAgICAgICAgICAgaWYgKHNpbWlsYXJpdHkgPT09IDEpIHtcblx0ICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfSBjYXRjaCAoZXJyKSB7XG5cdCAgICAgICAgX2RpZEl0ZXJhdG9yRXJyb3IgPSB0cnVlO1xuXHQgICAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuXHQgICAgICB9IGZpbmFsbHkge1xuXHQgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuXHQgICAgICAgICAgICBfaXRlcmF0b3IucmV0dXJuKCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSBmaW5hbGx5IHtcblx0ICAgICAgICAgIGlmIChfZGlkSXRlcmF0b3JFcnJvcikge1xuXHQgICAgICAgICAgICB0aHJvdyBfaXRlcmF0b3JFcnJvcjtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0XG5cdCAgICAgIHJldHVybiB7XG5cdCAgICAgICAgc2NvcmU6IGNsb3Nlc3RTeW5vbnltLnNpbWlsYXJpdHksXG5cdCAgICAgICAgZGlzcGxheVZhbHVlOiBvcHRpb25TeW5vbnltc1swXVxuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ2xpc3RJdGVtRm4nLFxuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIGxpc3RJdGVtRm4oc2NvcmVkT3B0aW9uLCBpdGVtSW5kZXgpIHtcblx0ICAgICAgdmFyIGxpID0gaXRlbUluZGV4ID4gTWlzc1BsZXRlLk1BWF9JVEVNUyA/IG51bGwgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG5cdCAgICAgIGxpICYmIGxpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHNjb3JlZE9wdGlvbi5kaXNwbGF5VmFsdWUpKTtcblx0ICAgICAgcmV0dXJuIGxpO1xuXHQgICAgfVxuXHQgIH0sIHtcblx0ICAgIGtleTogJ01BWF9JVEVNUycsXG5cdCAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0ICAgICAgcmV0dXJuIDg7XG5cdCAgICB9XG5cdCAgfV0pO1xuXHRcblx0ICByZXR1cm4gTWlzc1BsZXRlO1xuXHR9KCk7XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBNaXNzUGxldGU7XG5cbi8qKiovIH0pLFxuLyogMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHR2YXIgX3NsaWNlZFRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIHNsaWNlSXRlcmF0b3IoYXJyLCBpKSB7IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX2UgPSB1bmRlZmluZWQ7IHRyeSB7IGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH0gcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyByZXR1cm4gYXJyOyB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkgeyByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpOyB9IGVsc2UgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTsgfSB9OyB9KCk7XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoczEsIHMyKSB7XG5cdCAgdmFyIHByZWZpeFNjYWxpbmdGYWN0b3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDAuMjtcblx0XG5cdCAgdmFyIGphcm9TaW1pbGFyaXR5ID0gamFybyhzMSwgczIpO1xuXHRcblx0ICB2YXIgY29tbW9uUHJlZml4TGVuZ3RoID0gMDtcblx0ICBmb3IgKHZhciBpID0gMDsgaSA8IHMxLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBpZiAoczFbaV0gPT09IHMyW2ldKSB7XG5cdCAgICAgIGNvbW1vblByZWZpeExlbmd0aCsrO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgYnJlYWs7XG5cdCAgICB9XG5cdCAgfVxuXHRcblx0ICByZXR1cm4gamFyb1NpbWlsYXJpdHkgKyBNYXRoLm1pbihjb21tb25QcmVmaXhMZW5ndGgsIDQpICogcHJlZml4U2NhbGluZ0ZhY3RvciAqICgxIC0gamFyb1NpbWlsYXJpdHkpO1xuXHR9O1xuXHRcblx0Ly8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSmFybyVFMiU4MCU5M1dpbmtsZXJfZGlzdGFuY2Vcblx0XG5cdGZ1bmN0aW9uIGphcm8oczEsIHMyKSB7XG5cdCAgdmFyIHNob3J0ZXIgPSB2b2lkIDAsXG5cdCAgICAgIGxvbmdlciA9IHZvaWQgMDtcblx0XG5cdCAgdmFyIF9yZWYgPSBzMS5sZW5ndGggPiBzMi5sZW5ndGggPyBbczEsIHMyXSA6IFtzMiwgczFdO1xuXHRcblx0ICB2YXIgX3JlZjIgPSBfc2xpY2VkVG9BcnJheShfcmVmLCAyKTtcblx0XG5cdCAgbG9uZ2VyID0gX3JlZjJbMF07XG5cdCAgc2hvcnRlciA9IF9yZWYyWzFdO1xuXHRcblx0XG5cdCAgdmFyIG1hdGNoaW5nV2luZG93ID0gTWF0aC5mbG9vcihsb25nZXIubGVuZ3RoIC8gMikgLSAxO1xuXHQgIHZhciBzaG9ydGVyTWF0Y2hlcyA9IFtdO1xuXHQgIHZhciBsb25nZXJNYXRjaGVzID0gW107XG5cdFxuXHQgIGZvciAodmFyIGkgPSAwOyBpIDwgc2hvcnRlci5sZW5ndGg7IGkrKykge1xuXHQgICAgdmFyIGNoID0gc2hvcnRlcltpXTtcblx0ICAgIHZhciB3aW5kb3dTdGFydCA9IE1hdGgubWF4KDAsIGkgLSBtYXRjaGluZ1dpbmRvdyk7XG5cdCAgICB2YXIgd2luZG93RW5kID0gTWF0aC5taW4oaSArIG1hdGNoaW5nV2luZG93ICsgMSwgbG9uZ2VyLmxlbmd0aCk7XG5cdCAgICBmb3IgKHZhciBqID0gd2luZG93U3RhcnQ7IGogPCB3aW5kb3dFbmQ7IGorKykge1xuXHQgICAgICBpZiAobG9uZ2VyTWF0Y2hlc1tqXSA9PT0gdW5kZWZpbmVkICYmIGNoID09PSBsb25nZXJbal0pIHtcblx0ICAgICAgICBzaG9ydGVyTWF0Y2hlc1tpXSA9IGxvbmdlck1hdGNoZXNbal0gPSBjaDtcblx0ICAgICAgICBicmVhaztcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgdmFyIHNob3J0ZXJNYXRjaGVzU3RyaW5nID0gc2hvcnRlck1hdGNoZXMuam9pbihcIlwiKTtcblx0ICB2YXIgbG9uZ2VyTWF0Y2hlc1N0cmluZyA9IGxvbmdlck1hdGNoZXMuam9pbihcIlwiKTtcblx0ICB2YXIgbnVtTWF0Y2hlcyA9IHNob3J0ZXJNYXRjaGVzU3RyaW5nLmxlbmd0aDtcblx0XG5cdCAgdmFyIHRyYW5zcG9zaXRpb25zID0gMDtcblx0ICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgc2hvcnRlck1hdGNoZXNTdHJpbmcubGVuZ3RoOyBfaSsrKSB7XG5cdCAgICBpZiAoc2hvcnRlck1hdGNoZXNTdHJpbmdbX2ldICE9PSBsb25nZXJNYXRjaGVzU3RyaW5nW19pXSkge1xuXHQgICAgICB0cmFuc3Bvc2l0aW9ucysrO1xuXHQgICAgfVxuXHQgIH1cblx0XG5cdCAgcmV0dXJuIG51bU1hdGNoZXMgPiAwID8gKG51bU1hdGNoZXMgLyBzaG9ydGVyLmxlbmd0aCArIG51bU1hdGNoZXMgLyBsb25nZXIubGVuZ3RoICsgKG51bU1hdGNoZXMgLSBNYXRoLmZsb29yKHRyYW5zcG9zaXRpb25zIC8gMikpIC8gbnVtTWF0Y2hlcykgLyAzLjAgOiAwO1xuXHR9XG5cbi8qKiovIH0pLFxuLyogMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXHRcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdCAgdmFsdWU6IHRydWVcblx0fSk7XG5cdFxuXHRleHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoZm4pIHtcblx0ICB2YXIgY2FjaGUgPSB7fTtcblx0XG5cdCAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG5cdCAgICB9XG5cdFxuXHQgICAgdmFyIGtleSA9IEpTT04uc3RyaW5naWZ5KGFyZ3MpO1xuXHQgICAgcmV0dXJuIGNhY2hlW2tleV0gfHwgKGNhY2hlW2tleV0gPSBmbi5hcHBseShudWxsLCBhcmdzKSk7XG5cdCAgfTtcblx0fTtcblxuLyoqKi8gfSlcbi8qKioqKiovIF0pXG59KTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bmRsZS5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9taXNzLXBsZXRlLWpzL2Rpc3QvYnVuZGxlLmpzXG4vLyBtb2R1bGUgaWQgPSA3NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRvZ2dsZU9wZW4gbW9kdWxlXG4gKiBAbW9kdWxlIG1vZHVsZXMvdG9nZ2xlT3BlblxuICovXG5cbmltcG9ydCBmb3JFYWNoIGZyb20gJ2xvZGFzaC9mb3JFYWNoJztcbmltcG9ydCBkYXRhc2V0IGZyb20gJy4vZGF0YXNldC5qcyc7XG5cbi8qKlxuICogVG9nZ2xlcyBhbiBlbGVtZW50IG9wZW4vY2xvc2VkLlxuICogQHBhcmFtIHtzdHJpbmd9IG9wZW5DbGFzcyAtIFRoZSBjbGFzcyB0byB0b2dnbGUgb24vb2ZmXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wZW5DbGFzcykge1xuICBpZiAoIW9wZW5DbGFzcykgb3BlbkNsYXNzID0gJ2lzLW9wZW4nO1xuXG4gIGNvbnN0IGxpbmtBY3RpdmVDbGFzcyA9ICdpcy1hY3RpdmUnO1xuICBjb25zdCB0b2dnbGVFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRvZ2dsZV0nKTtcblxuICBpZiAoIXRvZ2dsZUVsZW1zKSByZXR1cm47XG5cbiAgLyoqXG4gICogRm9yIGVhY2ggdG9nZ2xlIGVsZW1lbnQsIGdldCBpdHMgdGFyZ2V0IGZyb20gdGhlIGRhdGEtdG9nZ2xlIGF0dHJpYnV0ZS5cbiAgKiBCaW5kIGFuIGV2ZW50IGhhbmRsZXIgdG8gdG9nZ2xlIHRoZSBvcGVuQ2xhc3Mgb24vb2ZmIG9uIHRoZSB0YXJnZXQgZWxlbWVudFxuICAqIHdoZW4gdGhlIHRvZ2dsZSBlbGVtZW50IGlzIGNsaWNrZWQuXG4gICovXG4gIGZvckVhY2godG9nZ2xlRWxlbXMsIGZ1bmN0aW9uKHRvZ2dsZUVsZW0pIHtcbiAgICBjb25zdCB0YXJnZXRFbGVtU2VsZWN0b3IgPSBkYXRhc2V0KHRvZ2dsZUVsZW0sICd0b2dnbGUnKTtcblxuICAgIGlmICghdGFyZ2V0RWxlbVNlbGVjdG9yKSByZXR1cm47XG5cbiAgICBjb25zdCB0YXJnZXRFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0RWxlbVNlbGVjdG9yKTtcblxuICAgIGlmICghdGFyZ2V0RWxlbSkgcmV0dXJuO1xuXG4gICAgdG9nZ2xlRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBsZXQgdG9nZ2xlRXZlbnQ7XG4gICAgICBsZXQgdG9nZ2xlQ2xhc3MgPSAodG9nZ2xlRWxlbS5kYXRhc2V0LnRvZ2dsZUNsYXNzKSA/XG4gICAgICAgIHRvZ2dsZUVsZW0uZGF0YXNldC50b2dnbGVDbGFzcyA6IG9wZW5DbGFzcztcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgLy8gVG9nZ2xlIHRoZSBlbGVtZW50J3MgYWN0aXZlIGNsYXNzXG4gICAgICB0b2dnbGVFbGVtLmNsYXNzTGlzdC50b2dnbGUobGlua0FjdGl2ZUNsYXNzKTtcblxuICAgICAgLy8gVG9nZ2xlIGN1c3RvbSBjbGFzcyBpZiBpdCBpcyBzZXRcbiAgICAgIGlmICh0b2dnbGVDbGFzcyAhPT0gb3BlbkNsYXNzKVxuICAgICAgICB0YXJnZXRFbGVtLmNsYXNzTGlzdC50b2dnbGUodG9nZ2xlQ2xhc3MpO1xuXG4gICAgICAvLyBUb2dnbGUgdGhlIGRlZmF1bHQgb3BlbiBjbGFzc1xuICAgICAgdGFyZ2V0RWxlbS5jbGFzc0xpc3QudG9nZ2xlKG9wZW5DbGFzcyk7XG5cbiAgICAgIC8vIFRvZ2dsZSB0aGUgYXBwcm9wcmlhdGUgYXJpYSBoaWRkZW4gYXR0cmlidXRlXG4gICAgICB0YXJnZXRFbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLFxuICAgICAgICAhKHRhcmdldEVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKHRvZ2dsZUNsYXNzKSlcbiAgICAgICk7XG5cbiAgICAgIC8vIEZpcmUgdGhlIGN1c3RvbSBvcGVuIHN0YXRlIGV2ZW50IHRvIHRyaWdnZXIgb3BlbiBmdW5jdGlvbnNcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRvZ2dsZUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2VPcGVuU3RhdGUnLCB7XG4gICAgICAgICAgZGV0YWlsOiB0YXJnZXRFbGVtLmNsYXNzTGlzdC5jb250YWlucyhvcGVuQ2xhc3MpXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9nZ2xlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgICAgdG9nZ2xlRXZlbnQuaW5pdEN1c3RvbUV2ZW50KCdjaGFuZ2VPcGVuU3RhdGUnLCB0cnVlLCB0cnVlLCB7XG4gICAgICAgICAgZGV0YWlsOiB0YXJnZXRFbGVtLmNsYXNzTGlzdC5jb250YWlucyhvcGVuQ2xhc3MpXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0YXJnZXRFbGVtLmRpc3BhdGNoRXZlbnQodG9nZ2xlRXZlbnQpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU9wZW4uanMiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbmltcG9ydCBqUXVlcnkgZnJvbSAnanF1ZXJ5JztcblxuKGZ1bmN0aW9uKHdpbmRvdywgJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQXR0YWNoIHNpdGUtd2lkZSBldmVudCBsaXN0ZW5lcnMuXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXNpbXBsZS10b2dnbGUnLCBlID0+IHtcbiAgICAvLyBTaW1wbGUgdG9nZ2xlIHRoYXQgYWRkL3JlbW92ZXMgXCJhY3RpdmVcIiBhbmQgXCJoaWRkZW5cIiBjbGFzc2VzLCBhcyB3ZWxsIGFzXG4gICAgLy8gYXBwbHlpbmcgYXBwcm9wcmlhdGUgYXJpYS1oaWRkZW4gdmFsdWUgdG8gYSBzcGVjaWZpZWQgdGFyZ2V0LlxuICAgIC8vIFRPRE86IFRoZXJlIGFyZSBhIGZldyBzaW1sYXIgdG9nZ2xlcyBvbiB0aGUgc2l0ZSB0aGF0IGNvdWxkIGJlXG4gICAgLy8gcmVmYWN0b3JlZCB0byB1c2UgdGhpcyBjbGFzcy5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgJHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJykgP1xuICAgICAgICAkKCQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJykpIDpcbiAgICAgICAgJCgkKGUuY3VycmVudFRhcmdldCkuZGF0YSgndGFyZ2V0JykpO1xuICAgICQoZS5jdXJyZW50VGFyZ2V0KS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgJHRhcmdldC50b2dnbGVDbGFzcygnYWN0aXZlIGhpZGRlbicpXG4gICAgICAgIC5wcm9wKCdhcmlhLWhpZGRlbicsICR0YXJnZXQuaGFzQ2xhc3MoJ2hpZGRlbicpKTtcbiAgfSkub24oJ2NsaWNrJywgJy5qcy1zaG93LW5hdicsIGUgPT4ge1xuICAgIC8vIFNob3dzIHRoZSBtb2JpbGUgbmF2IGJ5IGFwcGx5aW5nIFwibmF2LWFjdGl2ZVwiIGNhc3MgdG8gdGhlIGJvZHkuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQoZS5kZWxlZ2F0ZVRhcmdldCkuYWRkQ2xhc3MoJ25hdi1hY3RpdmUnKTtcbiAgICAkKCcubmF2LW92ZXJsYXknKS5zaG93KCk7XG4gIH0pLm9uKCdjbGljaycsICcuanMtaGlkZS1uYXYnLCBlID0+IHtcbiAgICAvLyBIaWRlcyB0aGUgbW9iaWxlIG5hdi5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCgnLm5hdi1vdmVybGF5JykuaGlkZSgpO1xuICAgICQoZS5kZWxlZ2F0ZVRhcmdldCkucmVtb3ZlQ2xhc3MoJ25hdi1hY3RpdmUnKTtcbiAgfSk7XG4gIC8vIEVORCBUT0RPXG5cbn0pKHdpbmRvdywgalF1ZXJ5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3RvZ2dsZU1lbnUuanMiXSwic291cmNlUm9vdCI6IiJ9
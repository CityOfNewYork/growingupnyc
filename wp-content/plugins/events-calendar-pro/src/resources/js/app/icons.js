var tribe = typeof tribe === "object" ? tribe : {}; tribe["events-pro"] = tribe["events-pro"] || {}; tribe["events-pro"]["icons"] =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 102);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(10);
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_);

// CONCATENATED MODULE: ./src/modules/icons/arrow.svg
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

function _objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}


/* harmony default export */ var arrow = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === undefined ? {} : _ref$styles,
      props = _objectWithoutProperties(_ref, ["styles"]);

  return external_React_default.a.createElement("svg", _extends({ xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", width: "13", height: "7" }, props), external_React_default.a.createElement("defs", null, external_React_default.a.createElement("path", { id: "a", d: "M838 653.05l6.5 5.95 6.5-5.95-1.15-1.05-5.35 4.9-5.35-4.9" })), external_React_default.a.createElement("use", { fill: "#12181e", xlinkHref: "#a", transform: "translate(-838 -652)" }));
});
// CONCATENATED MODULE: ./src/modules/icons/trash.svg
var trash_extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

function trash_objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}


/* harmony default export */ var trash = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === undefined ? {} : _ref$styles,
      props = trash_objectWithoutProperties(_ref, ["styles"]);

  return external_React_default.a.createElement("svg", trash_extends({ width: "11", height: "15", xmlns: "http://www.w3.org/2000/svg" }, props), external_React_default.a.createElement("path", { d: "M3.93 1.58h3.14v.79H3.93v-.79zm4.71.79v-.8C8.64.71 7.94 0 7.07 0H3.93c-.87 0-1.57.7-1.57 1.58v.79H0v1.58h11V2.37H8.64zM1.48 13.52c.05.83.74 1.48 1.57 1.48h4.9c.84 0 1.53-.65 1.58-1.48l.55-8.78H.93l.55 8.78z", fill: "#8D949B" }));
});
// CONCATENATED MODULE: ./src/modules/icons/recurrence.svg
var recurrence_extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

function recurrence_objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}


/* harmony default export */ var recurrence = (function (_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === undefined ? {} : _ref$styles,
      props = recurrence_objectWithoutProperties(_ref, ["styles"]);

  return external_React_default.a.createElement("svg", recurrence_extends({ xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 12.66 16.52" }, props), external_React_default.a.createElement("path", { d: "M1.69 4.12h6.45L6.76 5.45 8 6.61l3.43-3.3L8 0 6.76 1.16l1.38 1.32H1.57A1.55 1.55 0 0 0 0 4v7.7a.44.44 0 0 0 .76.3l.94-.88zm10.77.34a.51.51 0 0 0-.67.15l-.79.82v7H4.46l1.38-1.33-1.2-1.19-3.43 3.3 3.43 3.3 1.2-1.16L4.46 14h6.62a1.55 1.55 0 0 0 1.57-1.52V4.89a.42.42 0 0 0-.19-.43z" }));
});
// CONCATENATED MODULE: ./src/modules/icons/index.js
/* concated harmony reexport Arrow */__webpack_require__.d(__webpack_exports__, "Arrow", function() { return arrow; });
/* concated harmony reexport Trash */__webpack_require__.d(__webpack_exports__, "Trash", function() { return trash; });
/* concated harmony reexport Recurrence */__webpack_require__.d(__webpack_exports__, "Recurrence", function() { return recurrence; });




/***/ })

/******/ });
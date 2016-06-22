import 'babel-polyfill';
import globalSearch from './modules/globalSearch.js';

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function init() {
  globalSearch();
}

ready(init);
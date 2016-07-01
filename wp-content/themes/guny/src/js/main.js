import 'babel-polyfill';
import globalSearch from './modules/globalSearch.js';
import toggleOpen from './modules/toggleOpen.js';

function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

function init() {
  globalSearch();
  toggleOpen();
}

ready(init);

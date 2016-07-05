import 'babel-polyfill';
import globalSearch from './modules/globalSearch.js';
import toggleOpen from './modules/toggleOpen.js';
import accordion from './modules/accordion.js';

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
  accordion();
}

ready(init);

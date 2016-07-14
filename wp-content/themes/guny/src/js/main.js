import 'babel-polyfill';
import globalSearch from './modules/globalSearch.js';
import toggleOpen from './modules/toggleOpen.js';
import accordion from './modules/accordion.js';
import offcanvas from './modules/offcanvas.js';
import overlay from './modules/overlay.js';

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
  offcanvas();
  accordion();
  overlay();
}

ready(init);

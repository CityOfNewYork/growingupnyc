import globalSearch from './modules/globalSearch.js';
import toggleOpen from './modules/toggleOpen.js';
import accordion from './modules/accordion.js';
import offcanvas from './modules/offcanvas.js';
import overlay from './modules/overlay.js';
import stickyNav from './modules/stickyNav.js';
import staticColumn from './modules/staticColumn.js';
import searchResultsHeader from './modules/searchResultsHeader.js';

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
  stickyNav();

  // Homepage
  staticColumn();

  // Search results page
  searchResultsHeader();
}

ready(init);

// Make certain functions available globally
window.accordion = accordion;

import globalSearch from './modules/globalSearch.js';
import toggleOpen from './modules/toggleOpen.js';
import accordion from './modules/accordion.js';
import offcanvas from './modules/offcanvas.js';
import overlay from './modules/overlay.js';
import stickyNav from './modules/stickyNav.js';
import currentSection from './modules/currentSection.js';
import parallax from './modules/parallax.js';
import staticColumn from './modules/staticColumn.js';
import searchResultsHeader from './modules/searchResultsHeader.js';
import alert from './modules/alert.js';
import bsdtoolsSignup from './modules/bsdtools-signup.js';
import formEffects from './modules/formEffects.js';

function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

function init() {
  globalSearch();
  toggleOpen('is-open');
  alert('is-open');
  offcanvas();
  accordion();
  overlay();
  // Search results page
  searchResultsHeader();
  // Homepage
  staticColumn();
  parallax();
  stickyNav();
  currentSection();
  bsdtoolsSignup();
  formEffects();
}

ready(init);

// Make certain functions available globally
window.accordion = accordion;

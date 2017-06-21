import globalSearch from './modules/globalSearch.js';
import toggleOpen from './modules/toggleOpen.js';
import accordion from './modules/accordion.js';
import offcanvas from './modules/offcanvas.js';
import overlay from './modules/overlay.js';
import stickyNav from './modules/stickyNav.js';
import currentSection from './modules/currentSection.js';
import staticColumn from './modules/staticColumn.js';
import searchResultsHeader from './modules/searchResultsHeader.js';
import alert from './modules/alert.js';
import bsdtoolsSignup from './modules/bsdtools-signup.js';
import formEffects from './modules/formEffects.js';
import facets from './modules/facets.js';
import owlSettings from './modules/owlSettings.js';
import iOS7Hack from './modules/iOS7Hack.js';
import ShareForm from './modules/share-form.js';
import captchaResize from './modules/captchaResize.js';

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
  // FacetWP pages
  facets();
  // Homepage
  staticColumn();
  stickyNav();
  currentSection();
  bsdtoolsSignup();
  formEffects();
  owlSettings();
  iOS7Hack();
  captchaResize();
}

ready(init);

// Make certain functions available globally
window.accordion = accordion;

(function(window, $) {
  'use strict';
  // Initialize share by email/sms forms.
  $(`.${ShareForm.CssClass.FORM}`).each((i, el) => {
    const shareForm = new ShareForm(el);
    shareForm.init();
  });
})(window, jQuery);

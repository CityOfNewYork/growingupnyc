import accordion from './modules/accordion.js';
import simpleAccordion from './modules/simpleAccordion.js';
import offcanvas from './modules/offcanvas.js';
import overlay from './modules/overlay.js';
import stickNav from './modules/stickNav.js';
import sectionHighlighter from './modules/sectionHighlighter.js';
import staticColumn from './modules/staticColumn.js';
import alert from './modules/alert.js';
import bsdtoolsSignup from './modules/bsdtools-signup.js';
import formEffects from './modules/formEffects.js';
import facets from './modules/facets.js';
import owlSettings from './modules/owlSettings.js';
import iOS7Hack from './modules/iOS7Hack.js';
import ShareForm from './modules/share-form.js';
import captchaResize from './modules/captchaResize.js';
import rotatingTextAnimation from './modules/rotatingTextAnimation.js';
/* eslint-disable no-unused-vars */
import toggleOpen from './modules/toggleOpen.js';
import toggleMenu from './modules/toggleMenu.js';
/* eslint-enable no-unused-vars */

function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

function init() {
  toggleOpen('is-open');
  alert('is-open');
  offcanvas();
  accordion();
  simpleAccordion();
  overlay();

  // FacetWP pages
  facets();

  // Homepage
  staticColumn();
  stickNav();
  bsdtoolsSignup();
  formEffects();
  owlSettings();
  iOS7Hack();
  captchaResize();
  rotatingTextAnimation();
  sectionHighlighter();
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

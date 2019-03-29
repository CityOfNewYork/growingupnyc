import accordion from './modules/accordion.js';
import simpleAccordion from './modules/simpleAccordion.js';
import offcanvas from './modules/offcanvas.js';
import overlay from './modules/overlay.js';
import stickNav from './modules/stickNav.js';
import sectionHighlighter from './modules/sectionHighlighter.js';
import staticColumn from './modules/staticColumn.js';
import alert from './modules/alert.js';
// import bsdtoolsSignup from './modules/bsdtools-signup.js';
import gunySignup from './modules/newsletter-signup.js';
import formEffects from './modules/formEffects.js';
import facets from './modules/facets.js';
import owlSettings from './modules/owlSettings.js';
import iOS7Hack from './modules/iOS7Hack.js';
import ShareForm from './modules/share-form.js';
import captchaResize from './modules/captchaResize.js';
import rotatingTextAnimation from './modules/rotatingTextAnimation.js';
import Search from './modules/search.js';
// import EventsList from './modules/events.js';
import ProgramsList from './modules/multi-filter.js';
/* eslint-disable no-unused-vars */
import toggleOpen from './modules/toggleOpen.js';
/* eslint-enable no-unused-vars */

function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

// intialize modules
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
  // bsdtoolsSignup();
  gunySignup();
  formEffects();
  owlSettings();
  iOS7Hack();
  captchaResize();
  rotatingTextAnimation();
  sectionHighlighter();

  // Search
  new Search().init();
}

ready(init);

// Make certain functions available globally
window.accordion = accordion;

(function(window, $) {
  'use strict';

  var post_path = window.location.pathname.split('/');
  var arr_types = ['programs', 'afterschool', 'summer'];

  if(($.inArray(post_path[1], arr_types) > -1) && post_path[2] == ""){
    new ProgramsList().init();
  }

  // if (window.location.pathname.indexOf('events') >= 0) {
  //   new EventsList().init();
  // }
  
  // Initialize share by email/sms forms.
  $(`.${ShareForm.CssClass.FORM}`).each((i, el) => {
    const shareForm = new ShareForm(el);
    shareForm.init();
  });
})(window, jQuery);

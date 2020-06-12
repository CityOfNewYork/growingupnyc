import accordion from './modules/accordion.js';
import simpleAccordion from './modules/simpleAccordion.js';
import offcanvas from './modules/offcanvas.js';
import ContentShow from './modules/contentShow.js';
import overlay from './modules/overlay.js';
import stickyNav from './modules/stickyNav.js';
import sectionHighlighter from './modules/sectionHighlighter.js';
import staticColumn from './modules/staticColumn.js';
import alert from './modules/alert.js';
import gunySignup from './modules/newsletter-signup.js';
import formEffects from './modules/formEffects.js';
import facets from './modules/facets.js';
import owlSettings from './modules/owlSettings.js';
import iOS7Hack from './modules/iOS7Hack.js';
import ShareForm from './modules/share-form.js';
import captchaResize from './modules/captchaResize.js';
import rotatingTextAnimation from './modules/rotatingTextAnimation.js';
import Search from './modules/search.js';
import EventsList from './modules/events.js';

import Programs from './modules/programs.js';
import Afterschool from './modules/afterschool.js';
import Summer from './modules/summer.js';
import BrainBuilding from './modules/brainbuilding.js';
// import InstagramFeed from './modules/instagramFeed.js';

/* eslint-disable no-unused-vars */
import toggleOpen from './modules/toggleOpen.js';
/* eslint-enable no-unused-vars */

// Growing Up NYC Patterns
import Offcanvas from 'utilities/offcanvas/Offcanvas.common';

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
  stickyNav();
  gunySignup();
  formEffects();
  owlSettings();
  iOS7Hack();
  captchaResize();
  rotatingTextAnimation();
  sectionHighlighter();

  // new InstagramFeed().init()
  // Search
  new Search().init();
}

ready(init);

// Make certain functions available globally
window.accordion = accordion;

(function(window, $) {
  'use strict';

  new ContentShow();

  /**
   * Landing Pages with filters
   */

  let vueId = $('div').find('[id^=vue]').attr('id');
  if (vueId != undefined){
    if (vueId.indexOf('events') >= 0) {
      new EventsList().init();
    }
    if (vueId.indexOf('summer') >= 0) {
      new Summer().init();
    }
    if (vueId.indexOf('afterschool') >= 0) {
      new Afterschool().init();
    }
    if (vueId.indexOf('program') >= 0) {
      new Programs().init();
    }
    if (vueId.indexOf('brain-building') >= 0) {
      new BrainBuilding().init();
    }
  }

  // Initialize OffCanvas based on html direction
  if (['ar', 'ur'].includes(document.documentElement.lang)){
    new Offcanvas({ sideSelector: 'left' });
  } else {
    new Offcanvas({ sideSelector: 'right' });
  }
  
  // hide languages until ready for production
  const wpmlClasses = document.querySelectorAll('.wpml-ls-item');
  wpmlClasses.forEach(function (elem) {

    const regex = /wpml-ls-item-([^ ]+).*/g;
    const found = $(elem).attr('class').match(regex);
    const languages = ['-ar', '-bn', '-fr', '-ht', '-ko', '-pl', '-ru', '-ur', '-zh-hant'];
    if (languages.some(s => found[0].includes(s))) {
      $(elem).hide();
    }
  });

  // Initialize share by email/sms forms.
  $(`.${ShareForm.CssClass.FORM}`).each((i, el) => {
    const shareForm = new ShareForm(el);
    shareForm.init();
  });
})(window, jQuery);

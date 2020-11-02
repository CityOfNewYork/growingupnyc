import owlSettings from './modules/owlSettings.js';
import alert from './modules/alert.js';
import formEffects from './modules/formEffects.js';
import stickyNav from './modules/stickyNav.js';
import sectionHighlighter from './modules/sectionHighlighter.js';
import staticColumn from './modules/staticColumn.js';
import rotatingTextAnimation from './modules/rotatingTextAnimation.js';
import simpleAccordion from './modules/simpleAccordion.js';
import ContentShow from './modules/contentShow.js';
import iOS7Hack from './modules/iOS7Hack.js';
import ShareForm from './modules/share-form.js';
import captchaResize from './modules/captchaResize.js';
import EventsList from './modules/events.js';
import Programs from './modules/programs.js';
import Afterschool from './modules/afterschool.js';
import Summer from './modules/summer.js';
import BrainBuilding from './modules/brainbuilding.js';

/* eslint-disable no-unused-vars */
import toggleOpen from './modules/toggleOpen.js';
/* eslint-enable no-unused-vars */

/**
 * Components
 */
import LanguageSwitcher from 'components/language-switcher/LanguageSwitcher.common';
import Scroll from 'components/side-navigation/Scroll.common';
import BackToTop from 'components/back-to-top/BackToTop.common';

/**
 * Objects
 */
import StaticColumn from 'objects/static-column/StaticColumn.common';
import Accordion from 'objects/accordion/Accordion.common';
import AlertBanner from 'objects/alert-banner/AlertBanner.common';
import Overlay from 'objects/overlay/Overlay.common';
import Newsletter from 'objects/newsletter/Newsletter.common';
import Search from 'objects/search/Search.common';

/**
 * Utilities
 */
import Animations from 'utilities/animations/Animations.common';
import Offcanvas from 'utilities/offcanvas/Offcanvas.common';
import FormEffects from 'utilities/form-effects/FormEffects.common';
import Sticky from 'utilities/sticky/Sticky.common';
import SectionHighlighter from 'utilities/section-highlighter/SectionHighlighter.common';

(function (window, $) {
  'use strict';

  window.addEventListener('DOMContentLoaded', function() {
    new Accordion();
  });

  toggleOpen('is-open');
  simpleAccordion();
  iOS7Hack();
  captchaResize();

  // Initialize OffCanvas based on html direction
  if (['ar', 'ur'].includes(document.documentElement.lang)) {
    new Offcanvas({ sideSelector: 'left' });
  } else {
    new Offcanvas({ sideSelector: 'right' });
  }

  /**
   * Landing Pages with filters
   */
  let vueId = $('div').find('[id^=vue]').attr('id');
  if (vueId != undefined) {
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

  /**
   * Instantiating Generation and Growing Up modules
   */
  if (window.location.pathname.indexOf('generationnyc') >= 0) {
    staticColumn();
    owlSettings();
    stickyNav();
    formEffects();
    rotatingTextAnimation();
    sectionHighlighter();
    alert('is-open');
  } else {

    new AlertBanner();
    if (document.querySelector('[data-js*="rotate-text"]') != undefined) {
      new Animations("rotating-text__entry", 2000, 200);
    }

    new ContentShow();
    new FormEffects();
    new LanguageSwitcher();

    new BackToTop();

    new Newsletter();
    new Overlay();

    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (!isIE) {
      new Scroll();
    }

    new Search();
    new SectionHighlighter()
    new StaticColumn();

    if (document.querySelector('.js-sticky') != undefined) {
      new Sticky();
    }

    /**
     * Google Translate
     */
    window.onload = function () {
      if ((window.location.pathname.indexOf('events') >= 0 && document.documentElement.lang != 'en')||
        (document.querySelector('[machine-translate="Yes"]') != null)) {
        googleTranslateElementInit()
      }
    }
  }

  // Initialize share by email/sms forms.
  $(`.${ShareForm.CssClass.FORM}`).each((i, el) => {
    const shareForm = new ShareForm(el);
    shareForm.init();
  });

})(window, jQuery);
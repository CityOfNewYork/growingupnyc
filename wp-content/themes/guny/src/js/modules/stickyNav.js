/**
* Sticky Nav module
* @module modules/stickyNav
*/

import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import imagesReady from 'imagesready/dist/imagesready.js';

/**
* "Stick" content in place as the user scrolls
* @param {object} $elem - jQuery element that should be sticky
* @param {object} $elemContainer - jQuery element for the element's container. Used to set the top and bottom points
* @param {object} $elemArticle - Content next to the sticky nav
*/
function stickyNav($elem, $elemContainer, $elemArticle) {
  // Module settings
  const settings = {
    stickyClass: 'is-sticky',
    largeBreakpoint: '1024px',
    articleClass: 'o-article--shift'
  };

  // Globals
  let stickyMode = false; // Flag to tell if sidebar is in "sticky mode"
  let isSticky = false; // Whether the sidebar is sticky at this exact moment in time
  let switchPoint = 0; // Point at which to switch to sticky mode
  let switchPointBottom = 0; // Point at which to "freeze" the sidebar so it doesn't overlap the footer
  let leftOffset = 0; // Amount sidebar should be set from the left side
  let elemWidth = 0; // Width in pixels of sidebar
  let elemHeight = 0; // Height in pixels of sidebar

  /**
  * Toggle the sticky behavior
  *
  * Turns on if the user has scrolled past the switch point, off if they scroll back up
  * If sticky mode is on, sets the left offset as well
  */
  function toggleSticky() {
    const currentScrollPos = $(window).scrollTop();

    if (currentScrollPos > switchPoint) {
      // Check if the sidebar is already sticky
      if (!isSticky) {
        isSticky = true;
        $elem.addClass(settings.stickyClass);
        $elemArticle.addClass(settings.articleClass);
        updateDimensions();
      }

      // Check if the sidebar has reached the bottom switch point
      if ($elem.offset().top + elemHeight > switchPointBottom) {
        isSticky = false;
        $elem.removeClass(settings.stickyClass);
        $elemArticle.removeClass(settings.articleClass);
        updateDimensions();
        $elem.css('top', 'auto');
        $elem.css('bottom', $elemContainer.css('padding-bottom'));
      }
    } else if (isSticky) {
      isSticky = false;
      $elem.removeClass(settings.stickyClass);
      $elemArticle.removeClass(settings.articleClass);
      updateDimensions();
    }
  }

  /**
  * Update dimensions on sidebar
  *
  * Set to the current values of leftOffset and elemWidth if the element is
  * currently sticky. Otherwise, clear any previously set values
  *
  * @param {boolean} forceClear - Flag to clear set values regardless of sticky status
  */
  function updateDimensions(forceClear) {
    if (isSticky && !forceClear) {
      $elem.css({
        left: leftOffset + 'px',
        width: elemWidth + 'px',
        top: '',
        bottom: ''
      });
    } else {
      $elem.css({
        left: '',
        width: '',
        top: '',
        bottom: ''
      });
    }
  }

  /**
  * Set the switchpoint for the element and get its current offsets
  */
  function setOffsetValues() {
    $elem.css('visibility', 'hidden');
    if (isSticky) {
      $elem.removeClass(settings.stickyClass);
    }
    updateDimensions(true);

    switchPoint = $elem.offset().top;
    // Bottom switch point is equal to the offset and height of the outer container, minus any padding on the bottom
    switchPointBottom = $elemContainer.offset().top + $elemContainer.outerHeight() -
      parseInt($elemContainer.css('padding-bottom'), 10);

    leftOffset = $elem.offset().left;
    elemWidth = $elem.outerWidth();
    elemHeight = $elem.outerHeight();

    if (isSticky) {
      updateDimensions();
      $elem.addClass(settings.stickyClass);
      $elemArticle.addClass(settings.articleClass);
    }
    $elem.css('visibility', '');
  }

  /**
  * Turn on "sticky mode"
  *
  * Watch for scroll and fix the sidebar. Watch for sizes changes on #main
  * (which may change if parallax is used) and adjust accordingly.
  */
  function stickyModeOn() {
    stickyMode = true;

    $(window).on('scroll.fixedSidebar', throttle(function() {
      toggleSticky();
    }, 16)).trigger('scroll.fixedSidebar');

    $('#main').on('containerSizeChange.fixedSidebar', function(event) {
      switchPoint -= event.originalEvent.detail;
    });
  }

  /**
  * Turn off "sticky mode"
  *
  * Remove the event binding and reset everything
  */
  function stickyModeOff() {
    if (isSticky) {
      updateDimensions(true);
      $elem.removeClass(settings.stickyClass);
    }
    $(window).off('scroll.fixedSidebar');
    $('#main').off('containerSizeChange.fixedSidebar');
    stickyMode = false;
  }

  /**
  * Handle 'resize' event
  *
  * Turn sticky mode on/off depending on whether we're in desktop mode
  * @param {boolean} stickyMode - Whether sidebar should be considered sticky
  */
  function onResize() {
    const largeMode = window.matchMedia('(min-width: ' +
      settings.largeBreakpoint + ')').matches;
    if (largeMode) {
      setOffsetValues();
      if (!stickyMode) {
        stickyModeOn();
      }
    } else if (stickyMode) {
      stickyModeOff();
    }
  }

  /**
  * Initialize the sticky nav
  * @param {object} elem - DOM element that should be sticky
  * @param {object} options - Options. Will override module defaults when present
  */
  function initialize() {
    $(window).on('resize.fixedSidebar', debounce(function() {
      onResize();
    }, 100));

    imagesReady(document.body).then(function() {
      onResize();
    });
  }

  initialize();
}

export default function() {
  const $stickyNavs = $('.js-sticky');
  if ($stickyNavs.length) {
    $stickyNavs.each(function() {
      let $outerContainer = $(this).closest('.js-sticky-container');
      let $article = $outerContainer.find('.js-sticky-article');
      stickyNav($(this), $outerContainer, $article);
    });
  }
}

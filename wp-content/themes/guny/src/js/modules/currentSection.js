/**
* Current Section module
* @module modules/currentSection
*/
import forEach from 'lodash/forEach';
import throttle from 'lodash/throttle';

export default function() {
  /**
  * Gets an element's top position
  * @param {object} elem - The DOM element
  * @return {integer} - The distance from the top
  */
  function getTop(elem) {
    return elem.getBoundingClientRect().top;
  }

  /**
  * Gets an element's bottom position
  * @param {object} elem - The DOM element
  * @return {integer} - The distance from the bottom
  */
  function getBottom(elem) {
    return elem.getBoundingClientRect().bottom;
  }

  /**
  * Compares whether one element has entered the part of the page occupied by the other
  * Element is considered to have "entered" if its bottom position is equal to or below
  * the other element's top but not below the other element's bottom
  * @param {object} marker - The element being compared
  * @param {object} target - The element marker is being compared to
  * @return {boolean} - True if marker has entered target
  */
  function hasEntered(marker, target) {
    return (getTop(marker) >= getTop(target)) &&
      (getBottom(marker) <= getBottom(target) - 1);
  }

  /**
  * Adds or removes the current section class
  * @param {object} marker - The element being compared
  * @param {object} target - The element marker is being compared to
  */
  function toggleIndicator(marker, target) {
    const currentSectionClass = 'is-active';
    const hasClass = marker.classList.contains(currentSectionClass);
    const hasEnteredTarget = hasEntered(marker, target);

    if (hasEnteredTarget && !hasClass) {
      marker.classList.add(currentSectionClass);
    } else if (!hasEnteredTarget && hasClass) {
      marker.classList.remove(currentSectionClass);
    }
  }

  /**
  * Initialize the current section behavior
  * @param {object} marker - DOM node that should mark when a section is active
  */
  function initializeMarker(marker) {
    let targetSelector;
    if (typeof marker.dataset === 'undefined') {
      targetSelector = marker.getAttribute('data-section');
    } else {
      targetSelector = marker.dataset.section;
    }
    if (!targetSelector) {
      return;
    }
    const target = document.getElementById(targetSelector);
    if (!target) {
      return;
    }
    window.addEventListener('resize', throttle(function() {
      let scrollListener;
      if (window.matchMedia('(min-width: 1024px)').matches) {
        scrollListener = window.addEventListener('scroll', throttle(function() {
          toggleIndicator(marker, target);
        }, 100));
        toggleIndicator(marker, target);
      } else if (typeof scrollListener !== 'undefined') {
        window.removeEventListener('scroll', scrollListener);
      }
    }, 100));
    let event;
    if (document.createEvent) {
      event = new Event('resize');
      window.dispatchEvent(event);
    } else {
      event = document.createEventObject();
      event.eventType = "resize";
      window.fireEvent("onresize", event);
    }
  }

  const markers = document.querySelectorAll('.js-section');
  if (markers.length) {
    forEach(markers, function(marker) {
      initializeMarker(marker);
    });
  }
}

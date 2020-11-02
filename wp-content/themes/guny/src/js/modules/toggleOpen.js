/**
 * ToggleOpen module
 * @module modules/toggleOpen
 */

import forEach from 'lodash/forEach';
import dataset from './dataset.js';

/**
 * Toggles an element open/closed.
 * @param {string} openClass - The class to toggle on/off
 */
export default function(openClass) {
  if (!openClass) openClass = 'is-open';

  const linkActiveClass = 'is-active';
  const toggleElems = document.querySelectorAll('[data-toggle]');
  const closeSearchIcon = document.querySelector('.search-toggle-icon')

  if (!toggleElems) return;

  /**
  * For each toggle element, get its target from the data-toggle attribute.
  * Bind an event handler to toggle the openClass on/off on the target element
  * when the toggle element is clicked.
  */
  forEach(toggleElems, function(toggleElem) {
    const targetElemSelector = dataset(toggleElem, 'toggle');

    if (!targetElemSelector) return;

    const targetElem = document.getElementById(targetElemSelector);

    if (!targetElem) return;

    toggleElem.addEventListener('click', function(event) {
      let toggleEvent;
      let toggleClass = (toggleElem.dataset.toggleClass) ?
      toggleElem.dataset.toggleClass : openClass;

      event.preventDefault();

      /*
       keybord only trigered button to close the search panel for accessibility
       reasons is toggeling  the active class of the main search panel toggle button
      */
      if (toggleElem.classList.contains('keybord_search_close')) {
        closeSearchIcon.classList.toggle(linkActiveClass)
      }

      // Toggle the element's active class
      toggleElem.classList.toggle(linkActiveClass);

      // Toggle custom class if it is set
      if (toggleClass !== openClass)
        targetElem.classList.toggle(toggleClass);

      // Toggle the default open class
      targetElem.classList.toggle(openClass);

      // Toggle the appropriate aria hidden attribute
      targetElem.setAttribute('aria-hidden',
        !(targetElem.classList.contains(toggleClass))
      );

      // Fire the custom open state event to trigger open functions
      if (typeof window.CustomEvent === 'function') {
        toggleEvent = new CustomEvent('changeOpenState', {
          detail: targetElem.classList.contains(openClass)
        });
      } else {
        toggleEvent = document.createEvent('CustomEvent');
        toggleEvent.initCustomEvent('changeOpenState', true, true, {
          detail: targetElem.classList.contains(openClass)
        });
      }

      targetElem.dispatchEvent(toggleEvent);
    });
  });
}

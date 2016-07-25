/**
 * ToggleOpen module
 * @module modules/toggleOpen
 */

import forEach from 'lodash/forEach';

/**
 * Toggles an element open/closed.
 * @param {string} openClass - The class to toggle on/off
 */
export default function(openClass) {
  if (!openClass) {
    openClass = 'is-open';
  }
  const linkActiveClass = 'is-active';
  const toggleElems = document.querySelectorAll('[data-toggle]');

  /**
  * For each toggle element, get its target from the data-toggle attribute.
  * Bind an event handler to toggle the openClass on/off on the target element
  * when the toggle element is clicked.
  */
  if (toggleElems) {
    forEach(toggleElems, function(toggleElem) {
      let targetElemSelector;
      if (typeof toggleElem.dataset === 'undefined') {
        targetElemSelector = toggleElem.getAttribute('data-toggle');
      } else {
        targetElemSelector = toggleElem.dataset.toggle;
      }
      if (targetElemSelector) {
        const targetElem = document.getElementById(targetElemSelector);
        if (!targetElem) {
          return false;
        }
        toggleElem.addEventListener('click', function(e) {
          e.preventDefault();
          toggleElem.classList.toggle(linkActiveClass);
          targetElem.classList.toggle(openClass);
          let toggleEvent;
          if (typeof window.CustomEvent === 'function') {
            toggleEvent = new CustomEvent('changeOpenState', {detail: targetElem.classList.contains(openClass)});
          } else {
            toggleEvent = document.createEvent('CustomEvent');
            toggleEvent.initCustomEvent('changeOpenState', true, true, {detail: targetElem.classList.contains(openClass)});
          }
          targetElem.dispatchEvent(toggleEvent);
        });
      }
    });
  }
}

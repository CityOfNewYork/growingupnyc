/**
 * Overlay module
 * @module modules/overlay
 */

import forEach from 'lodash/forEach';

/**
 * Shift keyboard focus when the search overlay is open.
 * The 'changeOpenState' event is fired by modules/toggleOpen
 */
export default function() {
  const overlay = document.querySelectorAll('.js-overlay');
  if (overlay) {
    forEach(overlay, function(overlayElem) {
      /**
      * Add event listener for 'changeOpenState'.
      * The value of event.detail indicates whether the open state is true
      * (i.e. the overlay is visible).
      * @function
      * @param {object} event - The event object
      */
      overlayElem.addEventListener('changeOpenState', function(event) {
        if (event.detail) {
          if (!(/^(?:a|select|input|button|textarea)$/i.test(overlay.tagName))) {
            overlay.tabIndex = -1;
          }

          if (document.querySelectorAll('.js-overlay input')) {
            document.querySelectorAll('.js-overlay input')[0].focus();
          } else {
            overlay.focus();
          }
        }
      }, false);
    });
  }
}

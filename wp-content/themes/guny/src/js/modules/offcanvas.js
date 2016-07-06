/**
 * Offcanvas module
 * @module modules/offcanvas
 * @see modules/toggleOpen
 */

import forEach from 'lodash/forEach';

/**
 * Shift keyboard focus when the offcanvas nav is open.
 * The 'changeOpenState' event is fired by modules/toggleOpen
 */
export default function() {
  const offCanvas = document.querySelectorAll('.js-offcanvas');
  if (offCanvas) {
    forEach(offCanvas, function(offCanvasElem) {
      const offCanvasSide = offCanvasElem.querySelector('.js-offcanvas__side');

      /**
      * Add event listener for 'changeOpenState'.
      * The value of event.detail indicates whether the open state is true
      * (i.e. the offcanvas content is visible).
      * @function
      * @param {object} event - The event object
      */
      offCanvasElem.addEventListener('changeOpenState', function(event) {
        if (event.detail) {
          if (!(/^(?:a|select|input|button|textarea)$/i.test(offCanvasSide.tagName))) {
            offCanvasSide.tabIndex = -1;
          }
          offCanvasSide.focus();
        }
      }, false);
    });
  }
}

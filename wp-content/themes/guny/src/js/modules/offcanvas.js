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

  /**
  * Keyboard Customization:
  * "Resources by Age" menu
  * (a) store reference to link which triggered menu to open
  * (b) when menu is closed draw focus to trigger link allowing user to continue from initial point
  */
  let triggerLink = null;
  $('.c-banner__nav [data-toggle="offcanvas-ages"]').on('keydown', function (e) {
    if (e.which === 13) {
      triggerLink = $(this)[0];
    }
  });

  $('nav#ages [data-toggle="offcanvas-ages"]').on('click', function (e) {
    if (triggerLink !== null) {
      $(triggerLink).focus();
    }
  });

  $('nav#generationnyc-menu [data-toggle="offcanvas-generationnyc"]').on('click', function (e) {
    if (triggerLink !== null) {
      $(triggerLink).focus();
    }
  });
}

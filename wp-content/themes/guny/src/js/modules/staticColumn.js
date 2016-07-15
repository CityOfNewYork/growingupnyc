/**
 * Offcanvas module
 * @module modules/staticColumn
 */

import forEach from 'lodash/forEach';

/**
 * Shift keyboard focus when the search overlay is open.
 * The 'changeOpenState' event is fired by modules/toggleOpen
 */
export default function() {
  const staticColumn = document.querySelectorAll('.js-static-column');
  const notStickyClass = 'is-not-sticky';
  const bottomClass = 'is-bottom';

  if (staticColumn) {
    forEach(staticColumn, function(staticColumnElem) {
      let elemTop = staticColumnElem.parentElement.getBoundingClientRect().top;
         
      if (elemTop > 0) {
        staticColumnElem.classList.add(notStickyClass);
      } else {
        staticColumnElem.classList.remove(notStickyClass);
      }

      /**
      * Add event listener for 'scroll'.
      * @function
      * @param {object} event - The event object
      */
      window.addEventListener('scroll', function(event) {
        let elemTop = staticColumnElem.parentElement.getBoundingClientRect().top;
        let isPastBottom = window.innerHeight - staticColumnElem.parentElement.clientHeight - staticColumnElem.parentElement.getBoundingClientRect().top > 0;
        
        if (elemTop > 0) {
          staticColumnElem.classList.add(notStickyClass);
        } else {
          staticColumnElem.classList.remove(notStickyClass);
        }
        if (isPastBottom) {
          staticColumnElem.classList.add(bottomClass);
        } else {
          staticColumnElem.classList.remove(bottomClass);
        }
      }, false);
    });
  }
}

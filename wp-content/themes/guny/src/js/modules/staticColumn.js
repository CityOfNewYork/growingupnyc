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

      function calcWindowPos() {
        let elemTop = staticColumnElem.parentElement.getBoundingClientRect().top;
        let isPastBottom = window.innerHeight - staticColumnElem.parentElement.clientHeight - staticColumnElem.parentElement.getBoundingClientRect().top > 0;
        
        // Sets element to position absolute if not scrolled to yet.
        // Absolutely positioning only when necessary and not by default prevents flickering 
        // when removing the "is-bottom" class on Chrome
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
      }

      calcWindowPos();

      /**
      * Add event listener for 'scroll'.
      * @function
      * @param {object} event - The event object
      */
      window.addEventListener('scroll', function(event) {
        calcWindowPos()
      }, false);

      /**
      * Add event listener for 'resize'.
      * @function
      * @param {object} event - The event object
      */
      window.addEventListener('resize', function(event) {
        calcWindowPos()
      }, false);
    });
  }
}

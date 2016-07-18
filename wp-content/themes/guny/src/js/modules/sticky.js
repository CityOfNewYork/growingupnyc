/**
 * Offcanvas module
 * @module modules/sticky
 */

import forEach from 'lodash/forEach';

export default function() {
  const stickyContent = document.querySelectorAll('.js-sticky');
  const notStickyClass = 'is-not-sticky';
  const bottomClass = 'is-bottom';

  if (stickyContent) {
    forEach(stickyContent, function(stickyContentElem) {

      function calcWindowPos() {
        let elemTop = stickyContentElem.parentElement.getBoundingClientRect().top;
        let isPastBottom = window.innerHeight - stickyContentElem.parentElement.clientHeight - stickyContentElem.parentElement.getBoundingClientRect().top > 0;
        
        // Sets element to position absolute if not scrolled to yet.
        // Absolutely positioning only when necessary and not by default prevents flickering 
        // when removing the "is-bottom" class on Chrome
        if (elemTop > 0) {
          stickyContentElem.classList.add(notStickyClass);
        } else {
          stickyContentElem.classList.remove(notStickyClass);
        }
        if (isPastBottom) {
          stickyContentElem.classList.add(bottomClass);
        } else {
          stickyContentElem.classList.remove(bottomClass);
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

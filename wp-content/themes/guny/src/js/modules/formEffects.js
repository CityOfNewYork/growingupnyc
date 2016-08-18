/**
* Form Effects module
* @module modules/formEffects
* @see https://github.com/codrops/TextInputEffects/blob/master/index2.html
*/

import forEach from 'lodash/forEach';
import dispatchEvent from './dispatchEvent.js';

/**
* Utility function to set an 'is-filled' class on inputs that are focused or
* contain text. Can then be used to add effects to the form, such as moving
* the label.
*/
export default function() {
  /**
  * Add the filled class when input is focused
  * @param {object} event - The event object
  */
  function handleFocus(event) {
    const wrapperElem = event.target.parentNode;
    wrapperElem.classList.add('is-filled');
  }

  /**
  * Remove the filled class when input is blurred if it does not contain text
  * @param {object} event - The event object
  */
  function handleBlur(event) {
    if (event.target.value.trim() === '') {
      const wrapperElem = event.target.parentNode;
      wrapperElem.classList.remove('is-filled');
    }
  }

  const inputs = document.querySelectorAll('.signup-form__field');
  if (inputs.length) {
    forEach(inputs, function(inputElem) {
      inputElem.addEventListener('focus', handleFocus);
      inputElem.addEventListener('blur', handleBlur);
      dispatchEvent(inputElem, 'blur');
    });
  }
}

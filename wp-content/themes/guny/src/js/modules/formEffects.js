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

  /**
  * Remove the text from search field when clear is triggered
  * @param {object} event - The event object
  */
  function handleClear(event) {
    event.preventDefault()
    const searchFields = document.querySelectorAll('input[type=search]');
    if (searchFields.length) {
      forEach(searchFields, function(search) {
        search.value = '';
      });
    }
  }

  /**
  * Toggle checked attribute on key enter for checkboxes
  * @param {object} event - The event object
  */
  function handleKeyDown(event) {
    if (event.keyCode == 13) {
      $(event.target).prop('checked') ? $(event.target).prop('checked', false) : $(event.target).prop('checked', true);
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

  const searchInput = document.querySelectorAll('.search-clear');
  if (searchInput.length) {
    forEach(searchInput, function(inputElem) {
      inputElem.addEventListener('click', handleClear);
    });
  }

  const inputCheckbox = document.querySelectorAll('input[type=checkbox]');
  if (inputCheckbox.length) {
    forEach(inputCheckbox, function (inputElem) {
      inputElem.addEventListener('keydown', handleKeyDown);
    });
  }

  // Formstack overrides
  const formstackEmbed = $('.fsBody.fsEmbed');
  if (formstackEmbed.length) {
    formstackEmbed.closest('.o-article').css({
      'width': '100%',
      'margin-left': 'auto',
      'margin-right': 'auto',
    });
    formstackEmbed.closest('.s-wysiwyg').css({
      'width': '100%',
      'padding-top': '0',
      'padding-bottom': '0',
    });
    formstackEmbed.show();
    $('.spinner').hide();
  }
}

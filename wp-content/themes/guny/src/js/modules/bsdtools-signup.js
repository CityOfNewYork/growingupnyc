/**
* Validate a form and submit via the signup API
*/
require('../vendor/bsd-signup-jsapi-simple-dev.js');

export default function() {
  const $signupForms = $('.bsdtools-signup');
  const errorMsg = 'Please enter your email and zip code and select at least one age group.';

  /**
  * Validate form before unpausing
  * @param {object} event - jQuery event object
  * @param {object} formData - Serialized form data
  */
  function handleValidation(event, formData) {
    let noErrors = true;
    const $form = $(this);
    $form.find('.is-error').removeClass('is-error');
    $form.find('.bsdtools-error').html('');
    const $requiredFields = $form.find('[required]');

    /**
    * Validate each field. Required fields must be non-empty and contain the
    * right type of data.
    * @function
    */
    $requiredFields.each(function() {
      const fieldName = $(this).attr('name');
      if (typeof formData[fieldName] === 'undefined') {
        noErrors = false;
        $(this).addClass('is-error');
      } else {
        const fieldType = $(this).attr('type');
        const emregex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$", "i");
        const usregex = new RegExp(/^\d{5}(-\d{4})?$/i);
        if (
          (fieldType === 'text' && formData[fieldName].trim() === '') ||
          (fieldType === 'email' && !emregex.test(formData[fieldName])) ||
          (fieldName === 'zip' && !usregex.test(formData[fieldName])) ||
          (fieldType === 'checkbox' && !formData[fieldName].length)
        ) {
          noErrors = false;
          $(this).addClass('is-error');
        }
      }
    });
    if (noErrors) {
      // Tools expects a hidden field for _all_ checkboxes, not just checked ones
      $form.find('[type="checkbox"]').each(function(index) {
        const checkboxValue = $(this).prop('checked') ? $(this).attr('value') : '';
        let checkboxName = $(this).attr('name');
        checkboxName = checkboxName.substring(2, checkboxName.length - 2);
        $form.append(`<input type="hidden" name="${checkboxName}[${index}]" value="${checkboxValue}">`);
      });
      $form.data('isPaused', false);
      $form.trigger('submit.bsdsignup');
    } else {
      $form.find('.bsdtools-error').html(`<p>${errorMsg}</p>`);
    }
  }

  /**
  * Handle errors returned by the BSD Tools API
  * @param {object} event - jQuery event object
  * @param {object} errorJSON - Original response from the Tools, with a cached
  * jQuery reference to the form field
  */
  function handleErrors(event, errorJSON) {
    const $form = $(this);
    if (errorJSON && errorJSON.field_errors) {
      /**
      * Add error styling to the field with an error
      * @function
      * @param {integer} index - Current position in the set of errors
      * @param {object} error - Error object
      */
      $.each(errorJSON.field_errors, function(index, error) {
        error.$field.addClass('is-error');
        $form.find('.bsdtools-error').html(`<p>${error.message}</p>`);
      });
    } else {
      $form.find('.bsdtools-error').html('<p>Your signup could not be completed.</p>');
    }
  }

  /**
  * Handle success response from the BSD Tools API
  */
  function handleSuccess() {
    $(this).html('<p class="c-signup-form__success">One more step! <br /> Please check your inbox and confirm your email address to start receiving updates. <br />Thanks for signing up!</p>');
  }

  if ($signupForms.length) {
    /* eslint-disable camelcase */
    $signupForms.bsdSignup({
      no_redirect: true,
      startPaused: true
    })
    .on('bsd-ispaused', $.proxy(handleValidation, this))
    .on('bsd-error', $.proxy(handleErrors, this))
    .on('bsd-success', $.proxy(handleSuccess, this));
    /* eslint-enable camelcase */
  }
}

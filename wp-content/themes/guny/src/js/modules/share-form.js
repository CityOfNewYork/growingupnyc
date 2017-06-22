/* eslint-env browser */
'use strict';

import $ from 'jquery';
import Cookies from 'js-cookie';
import Utility from '../vendor/utility.js';

/**
 * This component handles validation and submission for share by email and
 * share by SMS forms.
/**
* Adds functionality to the input in the search results header
*/

class ShareForm {
  /**
   * @param {HTMLElement} el - The html form element for the component.
   * @constructor
   */
  constructor(el) {
    /** @private {HTMLElement} The component element. */
    this._el = el;

    /** @private {boolean} Whether this form is valid. */
    this._isValid = false;

    /** @private {boolean} Whether the form is currently submitting. */
    this._isBusy = false;

    /** @private {boolean} Whether the form is disabled. */
    this._isDisabled = false;

    /** @private {boolean} Whether this component has been initialized. */
    this._initialized = false;

    /** @private {boolean} Whether the google reCAPTCHA widget is required. */
    this._recaptchaRequired = false;

    /** @private {boolean} Whether the google reCAPTCHA widget has passed. */
    this._recaptchaVerified = false;

    /** @private {boolean} Whether the google reCAPTCHA widget is initilaised. */
    this._recaptchainit = false;
  }

  /**
   * If this component has not yet been initialized, attaches event listeners.
   * @method
   * @return {this} ShareForm
   */
  init() {
    if (this._initialized) {
      return this;
    }

    $(this._el).on('submit', e => {
      e.preventDefault();
      if (this._recaptchaRequired) {
        if (this._recaptchaVerified) {
          this._validate();
          if (this._isValid && !this._isBusy && !this._isDisabled) {
            this._submit();
            window.grecaptcha.reset();
            this._recaptchaVerified = false;
          }
        } else {
          $(this._el).find(`.${ShareForm.CssClass.ERROR_MSG}`).remove();
          this._showError(ShareForm.Message.RECAPTCHA);
        }
      } else {
        this._validate();
        if (this._isValid && !this._isBusy && !this._isDisabled) {
          this._submit();
        }
      }

      // // Determine whether or not to initialize ReCAPTCHA. This should be
      // // initialized only on every 10th view which is determined via an
      // // incrementing cookie.
      let viewCount = Cookies.get('screenerViews') ?
        parseInt(Cookies.get('screenerViews'), 10) : 1;
      if (viewCount >= 5 && !this._recaptchainit) {
        $(this._el).parents('.c-tip-ms__topics').addClass('recaptcha-js');
        this._initRecaptcha();
        this._recaptchainit = true;
      }
      Cookies.set('screenerViews', ++viewCount, {expires: (2/1440)});
      
    });

    // // Determine whether or not to initialize ReCAPTCHA. This should be
    // // initialized only on every 10th view which is determined via an
    // // incrementing cookie.
    let viewCount = Cookies.get('screenerViews') ?
      parseInt(Cookies.get('screenerViews'), 10) : 1;
    if (viewCount >= 5 && !this._recaptchainit ) {
      $(this._el).parents('.c-tip-ms__topics').addClass('recaptcha-js');
      this._initRecaptcha();
      this._recaptchainit = true;
    }
    this._initialized = true;
    return this;
  }

  /**
   * Runs validation rules and sets validity of component.
   * @method
   * @return {this} ShareForm
   */
  _validate() {
    let validity = true;
    const $tel = $(this._el).find('input[type="tel"]');
    // Clear any existing error messages.
    $(this._el).find(`.${ShareForm.CssClass.ERROR_MSG}`).remove();

    if ($tel.length) {
      validity = this._validatePhoneNumber($tel[0]);
    }

    this._isValid = validity;
    if (this._isValid) {
      $(this._el).removeClass(ShareForm.CssClass.ERROR);
    }
    return this;
  }

  /**
   * For a given input, checks to see if its value is a valid Phonenumber. If not,
   * displays an error message and sets an error class on the element.
   * @param {HTMLElement} input - The html form element for the component.
   * @return {boolean} - Valid email.
   */
  _validatePhoneNumber(input){  
    // var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/; 
    var phoneno = (/^\+?[1-9]\d{1,14}$/);
    if(!input.value.match(phoneno)){ 
      this._showError(ShareForm.Message.PHONE); 
      return false;  
    }  
    return true;  
  }

  /**
   * For a given input, checks to see if it has a value. If not, displays an
   * error message and sets an error class on the element.
   * @method
   * @param {HTMLElement} input - The html form element for the component.
   * @return {boolean} - Valid required field.
   */
  _validateRequired(input) {
    if ($(input).val()) {
      return true;
    } 
    this._showError(ShareForm.Message.REQUIRED);
    $(input).one('keyup', function(){
      this._validate();
    });
    return false;
  }

  /**
   * Displays an error message by appending a div to the form.
   * @param {string} msg - Error message to display.
   * @return {this} ShareForm - shareform
   */
  _showError(msg) {
    $('#sms-form-msg').addClass(ShareForm.CssClass.ERROR).text(Utility.localize(msg));
    return this;
  }

  /**
   * Adds a "success" class.
   * @param {string} msg - Error message to display.
   * @return {this} ShareForm
   */
  _showSuccess(msg) {
    $('#phone').attr("placeholder", Utility.localize(msg));
    $('#smsbutton').text("Send Another");
    $('#sms-form-msg').addClass(ShareForm.CssClass.SUCCESS).text('');
    $(this._el).parents('.c-tip-ms__topics').removeClass('success-js');
    $(this._el).parents('.c-tip-ms__topics').addClass('success-js');
    return this;
  }

  /**
   * Submits the form.
   * @return {jqXHR} deferred response object
   */
  _submit() {
    this._isBusy = true;
    const payload = $(this._el).serialize();
    $(this._el).find('input').prop('disabled', true);
    return $.post($(this._el).attr('action'), payload).done(response => {
      if (response.success) {
        this._el.reset();
        this._showSuccess(ShareForm.Message.SUCCESS);
        this._isDisabled = true;
        $(this._el).one('keyup', 'input', () => {
          $(this._el).removeClass(ShareForm.CssClass.SUCCESS);
          this._isDisabled = false;
        });
      } else {
        this._showError(JSON.stringify(response.message));
      }
    }).fail(function() {
      this._showError(ShareForm.Message.SERVER);
    }).always(() => {
      $(this._el).find('input').prop('disabled', false);
      this._isBusy = false;
    });
  }

  /**
   * Asynchronously loads the Google recaptcha script and sets callbacks for
   * load, success, and expiration.
   * @private
   * @return {this} Screener
   */
  _initRecaptcha() {
    const $script = $(document.createElement('script'));
    $script.attr('src',
        'https://www.google.com/recaptcha/api.js' +
        '?onload=screenerCallback&render=explicit').prop({
      async: true,
      defer: true
    });

    window.screenerCallback = () => {
      window.grecaptcha.render(document.getElementById('screener-recaptcha'), {
        'sitekey' : '6LekICYUAAAAAOR2uZ0ajyWt9XxDuspHPUAkRzAB',
        //Below is the local host key
        // 'sitekey' : '6LcAACYUAAAAAPmtvQvBwK89imM3QfotJFHfSm8C',
        'callback': 'screenerRecaptcha',
        'expired-callback': 'screenerRecaptchaReset'
      });
      this._recaptchaRequired = true;
    };

    window.screenerRecaptcha = () => {
      this._recaptchaVerified = true;
    };

    window.screenerRecaptchaReset = () => {
      this._recaptchaVerified = false;
    };

    this._recaptchaRequired = true;
    $('head').append($script);
    return this;
  }
}

/**
 * CSS classes used by this component.
 * @enum {string}
 */
ShareForm.CssClass = {
  ERROR: 'error',
  ERROR_MSG: 'error-message',
  FORM: 'js-share-form',
  HIDDEN: 'hidden',
  SUBMIT_BTN: 'btn-submit',
  SUCCESS: 'success'
};

/**
 * Localization labels of form messages.
 * @enum {string}
 */
ShareForm.Message = {
  EMAIL: 'ERROR_EMAIL',
  PHONE: 'Invalid Mobile Number',
  REQUIRED: 'ERROR_REQUIRED',
  SERVER: 'ERROR_SERVER',
  SUCCESS: 'Message sent!',
  RECAPTCHA : 'Please fill the reCAPTCHA'
};

export default ShareForm;
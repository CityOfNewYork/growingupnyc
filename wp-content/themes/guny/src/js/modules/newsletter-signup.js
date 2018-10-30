/**
* Validate a form and submit via the signup API
*/
import _ from 'underscore';
import zipcodes from './data/zipcodes.json'
import formErrors from './data/form-errors.json'

export default function() {
  // const $signupForms = $('.guny-signup');
  const errorMsg = 'Please enter your email and zip code and select at least one age group.';

  /**
  * Validate form fields
  * @param {object} formData - form fields
  * @param {object} event - event object
  */
  function validateFields(form, event) {

    event.preventDefault();

    const fields = form.serializeArray().reduce((obj, item) => (obj[item.name] = item.value, obj) ,{})
    const requiredFields = form.find('[required]');
    const emailRegex = new RegExp(/\S+@\S+\.\S+/);
    const zipRegex = new RegExp(/^\d{5}(-\d{4})?$/i);
    const phoneRegex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
    let groupSeleted = Object.keys(fields).find(a =>a.includes("group"))? true : false;
    let hasErrors = false;

    // loop through each required field
    requiredFields.each(function() {
      const fieldName = $(this).attr('name');
      $(this).removeClass('is-error');

      if((typeof fields[fieldName] === 'undefined') && !groupSeleted) {
        hasErrors = true;
        $(this).parents('fieldset').find('.guny-error-detailed').html('<p>Please select from the list below.</p>');;

        $(this).addClass('is-error');
      }

      if((fieldName == 'EMAIL' && !emailRegex.test(fields.EMAIL)) ||
        (fieldName == 'ZIP' && !zipRegex.test(fields.ZIP)) ||
        (fieldName == 'PHONENUM' && !phoneRegex.test(fields.PHONENUM) && fields.PHONENUM.length !=0)
      ) {
        hasErrors = true;
        $(this).siblings('.guny-error-detailed').html('<p>' + formErrors.find(x => x[fieldName])[fieldName] + '</p>');
        $(this).addClass('is-error');
      }

      // assign the correct borough to good zip
      if((fieldName == 'EMAIL' && emailRegex.test(fields.EMAIL))){
        fields.BOROUGH = assignBorough(fields.ZIP);
      }

      if((fieldName != 'EMAIL') && (fieldName != 'ZIP') && (fieldName != 'PHONENUM') && fields[fieldName] === ""
      ) {
        hasErrors = true;
        $(this).siblings('.guny-error-detailed').html('<p>' + formErrors.find(x => x[fieldName])[fieldName] + '</p>');
        $(this).addClass('is-error');
      }

    });

    // if there are no errors, submit
    if (hasErrors) {
      form.find('.guny-error').html(`<p>${errorMsg}</p>`);
    } else {
      submitSignup(form, fields);
    }
  }

  /**
  * Assigns the borough based on the zip code
  * @param {string} zip - zip code
  */
  function assignBorough(zip){
    let borough = '';
    let index = zipcodes.findIndex(x => x.codes.indexOf(parseInt(zip)) > -1);

    if(index === -1){
      borough = "Manhattan";
    }else {
      borough = zipcodes[index].borough;
    }

    return borough;
  }

  /**
  * Submits the form object to Mailchimp
  * @param {object} formData - form fields
  */
  function submitSignup(form, formData){
    $.ajax({
      url: form.attr('action'),
      type: form.attr('method'),
      dataType: 'json',//no jsonp
      cache: false,
      data: formData,
      contentType: "application/json; charset=utf-8",
      success: function(response) {
        if(response.result !== 'success'){
          if(form[0].className.indexOf('contact') > -1){
            if(response.msg.includes('already subscribed')){
              form.html('<p class="text-center">You have already reached out to us. We will get back to you as soon as possible!</p>');
            }else {
              form.html('<p class="text-center">Something went wrong. Try again later!</p>');
            }
          }else {
            if(response.msg.includes('too many recent signup requests')){
              form.find('.guny-error').html('<p class="text-center">There was a problem with your subscription.</p>');
            }else if(response.msg.includes('already subscribed')){
              form.find('.guny-error').html('<p class="text-center">You are already signed up for updates! Check your email.</p>');
            }
          }
        }else {
          if(form[0].className.indexOf('contact') > -1){
            if(form[0].className.indexOf('unity') > -1){
              form.html('<div class="text-center"><p class="u-bottom-spacing-small">Thank you for contacting the NYC Unity Project! Someone will respond to you shortly.</p><a class="button--primary button--primary__curved button--primary__purple" href="https://growingupnyc.cityofnewyork.us/generationnyc/topics/lgbtq">Go back to the Unity Project</a></div>');
            }else if(form[0].className.indexOf('generation') > -1){
              form.html('<div class="text-center"><p class="u-bottom-spacing-small">Thank you for contacting us! Someone will respond to you shortly.</p><a class="button--primary button--primary__curved button--primary__purple" href="https://growingupnyc.cityofnewyork.us/generationnyc/">Continue exploring Generation NYC</a></div>');
            }else{
              form.html('<div class="text-center"><p class="u-bottom-spacing-small">Thank you for contacting us! Someone will respond to you shortly.</p><a class="button--simple button--simple--alt" href="https://growingupnyc.cityofnewyork.us/">Continue exploring Growing Up NYC</a></div>');
            }
          }else{
            form.html('<p class="c-signup-form__success">One more step! <br /> Please check your inbox and confirm your email address to start receiving updates. <br />Thanks for signing up!</p>');
          }
        }
      },
      error: function(response) {
        form.find('.guny-error').html('<p>There was a problem with your subscription. Check back later.</p>');
      }
    });
  }

  /**
  * Triggers form validation and sends the form data to Mailchimp
  * @param {object} formData - form fields
  * TO EDIT
  */
  $('#mc-embedded-subscribe:button[type="submit"]').click(function(event){
    event.preventDefault();
    let formClass = $(this).parents('form').attr('class');
    let $form = $('.' + formClass);
    validateFields($form, event);
  });

  $('#mc-embedded-contact:button[type="submit"]').click(function(event){
    event.preventDefault();
    let formClass = $(this).parents('form').attr('class');
    let $form = $('.' + formClass);
    validateFields($form, event);
  });

  /**
  * Checking characters against the 255 char limit
  */
  $('.textarea').keyup(function(){
    let charLen = 255 - $(this).val().length;
    $('.char-count').text('Characters left: ' + charLen);
    if(charLen < 0){
      $('.char-count').css("color", '#d8006d');
      $(this).css("border-color", '#d8006d');
      // $('.char-count').addClass('.is-error');
    } else {
      $('.char-count').css("color", '#333');
      $(this).css("border-color", '#2793e0');
    }
  });
}

/**
* Validate a form and submit via the signup API
*/
import _ from 'underscore';
  
export default function() {
  const $signupForms = $('.guny-signup');
  const errorMsg = 'Please enter your email and zip code and select at least one age group.';

  /**
  * Validate form fields
  * @param {object} formData - form fields
  * @param {object} event - event object
  */
  function validateFields(formData, event) {
    const fields = formData.serializeArray().reduce((obj, item) => (obj[item.name] = item.value, obj) ,{})
    const requiredFields = formData.find('[required]');
    const emailRegex = new RegExp(/\S+@\S+\.\S+/);
    const zipRegex = new RegExp(/^\d{5}(-\d{4})?$/i);
    let ageSelected = Object.keys(fields).find(a =>a.includes("group"))? true : false;
    let hasErrors = false;

    // loop through each required field
    requiredFields.each(function() {
      const fieldName = $(this).attr('name');
      $(this).removeClass('is-error');

      if((typeof fields[fieldName] === 'undefined') && !ageSelected) {
        hasErrors = true;
        $(this).addClass('is-error');
      }

      if((fieldName == "EMAIL" && !emailRegex.test(fields.EMAIL)) || 
        (fieldName == "ZIP" && !zipRegex.test(fields.ZIP)) 
      ) {
        hasErrors = true;
        $(this).addClass('is-error');
      } 
    });

    if (hasErrors) {
      event.preventDefault();
      formData.find('.guny-error').html(`<p>${errorMsg}</p>`);
    } else {
      event.preventDefault();
      submitSignup(fields)
    }
  }
  
  /**
  * Submits the form object to Mailchimp
  * @param {object} formData - form fields
  */
  function submitSignup(formData){
    $.ajax({
      url: $signupForms.attr('action'),
      type: $signupForms.attr('method'),
      dataType: 'json',//no jsonp
      cache: false,
      data: formData,
      contentType: "application/json; charset=utf-8",
      success: function(response) {
        if(response.result !== 'success'){
          if(response.msg.includes('too many recent signup requests')){
            $signupForms.find('.guny-error').html('<p>There was a problem with your subscription.</p>');
          }else if(response.msg.includes('already subscribed')){
            $signupForms.find('.guny-error').html('<p>You are already signed up for updates! Check your email.</p>');
          }
        }else {
          $signupForms.html('<p class="c-signup-form__success">One more step! <br /> Please check your inbox and confirm your email address to start receiving updates. <br />Thanks for signing up!</p>');
        }
      },
      error: function(response) {
        $signupForms.find('.guny-error').html('<p>There was a problem with your subscription. Check back later.</p>');
      }
    });
  }
  
  /**
  * Triggers form validation and sends the form data to Mailchimp
  * @param {object} formData - form fields
  */
  if ($signupForms.length) {
    $signupForms.find('[type="submit"]').click(function(event){
      validateFields($signupForms, event);
    })

  }
}

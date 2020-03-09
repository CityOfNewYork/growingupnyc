/**
* Validate a form and submit via the signup API
*/

export default function() {
  // const $signupForms = $('.guny-signup');

  var formErrors = [
    {
      "EMAIL": "Please enter a valid email."
    },
    {
      "FNAME": "Please enter your first name."
    },
    {
      "LNAME": "Please enter your last name."
    },
    {
      "ZIP": "Please enter a valid US zip code."
    },
    {
      "PHONENUM": "Please enter a valid phone number."
    },
    {
      "MESSAGE": "Please enter a message. Limited to 255 characters."
    },
    {
      "GROUP": "Please select one."
    }
  ];

  var zipcodes = [
    {
      "borough": "Bronx",
      "codes": [10451, 10452, 10453, 10454, 10455, 10456, 10457, 10458, 10459, 10460, 10461, 10462, 10463, 10464, 10465, 10466, 10467, 10468, 10469, 10470, 10471, 10472, 10473, 10474, 10475]
    },
    {
      "borough": "Brooklyn",
      "codes": [11201, 11202, 11203, 11204, 11205, 11206, 11207, 11208, 11209, 11210, 11211, 11212, 11213, 11214, 11215, 11216, 11217, 11218, 11219, 11220, 11221, 11222, 11223, 11224, 11225, 11226, 11228, 11229, 11230, 11231, 11232, 11233, 11234, 11235, 11236, 11237, 11238, 11239, 11241, 11242, 11243, 11245, 11247, 11249, 11251, 11252, 11256]
    },
    {
      "borough": "Manhattan",
      "codes": [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011, 10012, 10013, 10014, 10016, 10017, 10018, 10019, 10020, 10021, 10022, 10023, 10024, 10025, 10027, 10028, 10029, 10030, 10031, 10032, 10033, 10034, 10035, 10036, 10037, 10038, 10039, 10040, 10041, 10045, 10055, 10081, 10087, 10101, 10103, 10104, 10105, 10106, 10107, 10108, 10109, 10110, 10111, 10112, 10113, 10114, 10115, 10116, 10118, 10119, 10120, 10121, 10122, 10123, 10128, 10150, 10151, 10152, 10153, 10154, 10155, 10156, 10158, 10159, 10162, 10165, 10166, 10167, 10168, 10169, 10170, 10171, 10172, 10173, 10174, 10175, 10176, 10177, 10178, 10185, 10199, 10212, 10249, 10256, 10259, 10261, 10268, 10270, 10271, 10276, 10278, 10279, 10280, 10281, 10282, 10286]
    },
    {
      "borough": "Queens",
      "codes": [11101, 11102, 11103, 11104, 11106, 11109, 11120, 11351, 11352, 11354, 11355, 11356, 11357, 11358, 11359, 11360, 11361, 11362, 11363, 11364, 11365, 11366, 11367, 11368, 11369, 11370, 11371, 11372, 11373, 11374, 11375, 11377, 11378, 11379, 11380, 11381, 11385, 11386, 11405, 11411, 11413, 11414, 11415, 11416, 11417, 11418, 11419, 11420, 11421, 11422, 11423, 11424, 11425, 11426, 11427, 11428, 11429, 11430, 11431, 11432, 11433, 11434, 11435, 11436, 11439, 11451, 11690, 11691, 11692, 11693, 11694, 11695, 11697]
    },
    {
      "borough": "Staten Island",
      "codes": [10301, 10302, 10303, 10304, 10305, 10306, 10307, 10308, 10309, 10310, 10311, 10312, 10313, 10314]
    }
  ];

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
      form.find('.guny-error').toggleClass();
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
    let response = $('.c-signup-form__response')
    form.html(response);
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
              $('.c-signup-form__response > .error').show();
            }else if(response.msg.includes('already subscribed')){
              $('.c-signup-form__response > .already-subscribed').show();
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
            $('.c-signup-form__response > .success').show();
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
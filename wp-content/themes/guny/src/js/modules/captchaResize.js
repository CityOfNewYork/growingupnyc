// Resize reCAPTCHA to fit width of container
// Since it has a fixed width, we're scaling
// using CSS3 transforms
// ------------------------------------------
// captchaScale = containerWidth / elementWidth

export default function() {
  function scaleCaptcha() {
    // Width of the reCAPTCHA element, in pixels
    var reCaptchaWidth = 304;
    // Get the containing element's width
    var containerWidth = $('.sms-form-wrapper').width();
    
    // Only scale the reCAPTCHA if it won't fit
    // inside the container
    if(reCaptchaWidth > containerWidth) {
      // Calculate the scale
      var captchaScale = containerWidth / reCaptchaWidth;
      // Apply the transformation
      $('.g-recaptcha').css({
        transform:'scale('+captchaScale+')'
      });
    }
  }

  $(function() {
    // Initialize scaling
    scaleCaptcha();
  });

  $(window).resize(function() {
    // Update scaling on window resize
    // Uses jQuery throttle plugin to limit strain on the browser
    scaleCaptcha();
  });
}
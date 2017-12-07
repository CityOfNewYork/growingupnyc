/* eslint-env browser */
import jQuery from 'jquery';

(function(window, $) {
  'use strict';

  // Attach site-wide event listeners.
  $('body').on('click', '.js-simple-toggle', e => {
    // Simple toggle that add/removes "active" and "hidden" classes, as well as
    // applying appropriate aria-hidden value to a specified target.
    // TODO: There are a few simlar toggles on the site that could be
    // refactored to use this class.
    e.preventDefault();
    const $target = $(e.currentTarget).attr('href') ?
        $($(e.currentTarget).attr('href')) :
        $($(e.currentTarget).data('target'));
    $(e.currentTarget).toggleClass('active');
    $target.toggleClass('active hidden')
        .prop('aria-hidden', $target.hasClass('hidden'));
  }).on('click', '.js-show-nav', e => {
    // Shows the mobile nav by applying "nav-active" cass to the body.
    e.preventDefault();
    $(e.delegateTarget).addClass('nav-active');
    $('.nav-overlay').show();
  }).on('click', '.js-hide-nav', e => {
    // Hides the mobile nav.
    e.preventDefault();
    $('.nav-overlay').hide();
    $(e.delegateTarget).removeClass('nav-active');
  });
  // END TODO

})(window, jQuery);

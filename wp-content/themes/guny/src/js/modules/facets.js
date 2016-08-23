/**
* FacetWP Event Handling
* Requires front.js, which is added by the FacetWP plugin
* Also requires jQuery as FacetWP itself requires jQuery
*/

export default function() {
  $(document).on('facetwp-refresh', function() {
    $('body').removeClass('facetwp-is-loaded').addClass('facetwp-is-loading');
    $('html, body').scrollTop(0);
  });

  $(document).on('facetwp-loaded', function() {
    $('body').removeClass('facetwp-is-loading').addClass('facetwp-is-loaded');
  });
}

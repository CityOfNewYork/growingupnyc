/**
* Owl Settings module
* @module modules/owlSettings
* @see https://owlcarousel2.github.io/OwlCarousel2/index.html
*/

/**
* owl carousel settings and to make the owl carousel work.
*/
export default function() {
  $(document).ready(function() {

    var $navigationLinks = $('.js-section-set > li > a');
    var $sections = $("section");
    var $sectionsReversed = $($("section").get().reverse());
    var sectionIdTonavigationLink = {};

    $sections.each(function() {
      sectionIdTonavigationLink[$(this).attr('id')] = $('.js-section-set > li > a[href=\\#' + $(this).attr('id') + ']');
    });

    function optimized() {
      var scrollPosition = $(window).scrollTop();

      $sectionsReversed.each(function() {
          var currentSection = $(this);
          var sectionTop = currentSection.offset().top;

          if (scrollPosition >= sectionTop) {
              var id = currentSection.attr('id');
              var $navigationLink = sectionIdTonavigationLink[id];
              if (!$navigationLink.hasClass('is-active')) {
                  $navigationLinks.removeClass('is-active');
                  $navigationLink.addClass('is-active');
              }
              return false;
          }
      });
    }

    optimized();
    $(window).scroll(function() {
      //test[$("input[name='test']:checked").val()].measureTime();
      optimized();
    });

  });
}
/**
* Section highlighter module
* @module modules/sectionHighlighter
* @see https://stackoverflow.com/questions/32395988/highlight-menu-item-when-scrolling-down-to-section
*/

export default function() {
	var $navigationLinks = $('.js-section-set > li > a');
  var $sections = $("section");
  var $sectionsReversed = $($("section").get().reverse());
  var sectionIdTonavigationLink = {};
  //var eTop = $('#free-day-trips').offset().top;

  $sections.each(function() {
		var section = $(this);

    // fallback for acf_fc_layout sections
    if (!section.attr('data-id') && section.attr('id')) {
			section.attr('data-id', section.attr('id'));
      section.removeAttr('id');
    }

    section.children(':first').attr('id', section.attr('data-id'));

    sectionIdTonavigationLink[section.attr('data-id')] = $('.js-section-set > li > a[href="#' + section.attr('data-id') + '"]');
  });

  function optimized() {
		var scrollPosition = $(window).scrollTop();

    $sectionsReversed.each(function() {
			var currentSection = $(this);
			// console.log(currentSection)
      var sectionTop = currentSection.offset().top;

      // if(currentSection.is('section:first-child') && sectionTop > scrollPosition){
				//   console.log('scrollPosition', scrollPosition);
				//   console.log('sectionTop', sectionTop);
				// }

				if (scrollPosition >= sectionTop || (currentSection.is('section:first-child') && sectionTop > scrollPosition)) {
					var id = currentSection.attr('data-id');
					var $navigationLink = sectionIdTonavigationLink[id];
        if (!$navigationLink.hasClass('is-active') || !$('section').hasClass('o-content-container--compact')) {
            $navigationLinks.removeClass('is-active');
            $navigationLink.addClass('is-active');
        }
        return false;
      }
    });
  }

  optimized();
  $(window).scroll(function() {
    optimized();
  });
}

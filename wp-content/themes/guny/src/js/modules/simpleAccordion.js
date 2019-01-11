/**
* Simple accordion module
* @module modules/simpleAccordion
* @see https://perishablepress.com/jquery-accordion-menu-tutorial/
*/
export default function() {
  //$('.js-accordion > ul > li:has(ol)').addClass("has-sub");
  $('.js-s-accordion > li > h3.js-s-accordion__header').append('<svg class="o-accordion__caret icon" aria-hidden="true"><use xlink:href="#icon-caret-down"></use></svg>');

  $('.js-s-accordion > li > h3.js-s-accordion__header').on('click', function (e) {
    const thisRef = $(this);
    const elem = thisRef.next();

    return accordionActions(elem, thisRef);
  });

  // Register "Enter" keypress on header elements
  $('.js-s-accordion > li > h3.js-s-accordion__header').on('keypress', function (e) {
    if (e.which === 13) {
      const thisRef = $(this);
      const elem = thisRef.next();

      return accordionActions(elem, thisRef);
    }
  });

  function accordionActions(elem, thisRef) {
    const checkElement = elem;
    const ref = thisRef;

    $('.js-s-accordion li').removeClass('is-expanded');
    ref.closest('li').addClass('is-expanded');

    if((checkElement.is('.js-s-accordion__content')) && (checkElement.is(':visible'))) {
      ref.closest('li').removeClass('is-expanded');
      checkElement.slideUp('normal');
    }

    if((checkElement.is('.js-s-accordion__content')) && (!checkElement.is(':visible'))) {
      $('.js-s-accordion .js-s-accordion__content:visible').slideUp('normal');
      checkElement.slideDown('normal');
    }

    if (checkElement.is('.js-s-accordion__content')) {
      return false;
    }

    return true;
  }
}

/**
* Simple accordion module
* @module modules/simpleAccordion
* @see https://perishablepress.com/jquery-accordion-menu-tutorial/
*/
export default function() {
  //$('.js-accordion > ul > li:has(ol)').addClass("has-sub");
  $('.js-s-accordion > li > h3.js-s-accordion__header').append('<svg class="o-accordion__caret icon" aria-hidden="true"><use xlink:href="#caret-down"></use></svg>');

  $('.js-s-accordion > li > h3.js-s-accordion__header').click(function() {
    var checkElement = $(this).next();
    
    $('.js-s-accordion li').removeClass('is-expanded');
    $(this).closest('li').addClass('is-expanded'); 
    
    
    if((checkElement.is('.js-s-accordion__content')) && (checkElement.is(':visible'))) {
      $(this).closest('li').removeClass('is-expanded');
      checkElement.slideUp('normal');
    }
    
    if((checkElement.is('.js-s-accordion__content')) && (!checkElement.is(':visible'))) {
      $('.js-s-accordion .js-s-accordion__content:visible').slideUp('normal');
      checkElement.slideDown('normal');
    }
    
    if (checkElement.is('.js-s-accordion__content')) {
      return false;
    } else {
      return true;  
    }   
  });
}
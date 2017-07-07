/**
* Owl Settings module
* @module modules/owlSettings
* @see https://owlcarousel2.github.io/OwlCarousel2/index.html
*/

/**
* owl carousel settings and to make the owl carousel work.
*/
export default function() {
  var owl = $('.owl-carousel');
  owl.owlCarousel({
      items:1,
      loop:true,
      margin:0,
      dots: true,
      autoplay:true,
      autoplayTimeout:5000,
      autoplayHoverPause:true
  });
}
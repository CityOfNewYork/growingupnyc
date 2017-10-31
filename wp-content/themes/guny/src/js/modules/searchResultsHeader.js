/**
* Adds functionality to the input in the search results header
*/

export default function() { 
  if (typeof window.FWP !== 'undefined' && $('body').hasClass('page-template-template-search')) {
    $('.facetwp-facet-search').on('click', '.facetwp-searchbtn', function(event) {
      event.preventDefault();
      window.FWP.autoload();
    });
  }
}

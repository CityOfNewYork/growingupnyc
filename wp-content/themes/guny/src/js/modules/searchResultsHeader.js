/**
* Adds functionality to the input in the search results header
*/

export default function() {
  function getURLParameter (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

  if (typeof window.FWP !== 'undefined' && $('body').hasClass('page-template-template-search')) {
    $('.facetwp-facet-search').on('click', '.facetwp-searchbtn', function(event) {
      event.preventDefault();
      window.FWP.autoload();
    });
  
    $( document ).ajaxComplete(function() {
      if(getURLParameter("exactsearch")){
        var searchvalue = getURLParameter("fwp_search");
        $('.facetwp-search').val('"'+searchvalue+'"');
        window.history.pushState('object or string', 'Title', '/search/?fwp_search="'+searchvalue+'"' );
      }				
    });
  }
}

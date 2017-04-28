/**
* Global site search
*
* Intercepts default WP search and sends users to the custom faceted search
*/

export default function() {
  function searchRedirect(searchForm) {
    const searchField = searchForm.querySelector('[name="s"]');
    if (searchField) {
      let searchTerm = searchField.value;
      searchTerm = encodeURIComponent(searchTerm).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
      });
      if (searchTerm.indexOf('%22') > -1 || searchTerm.indexOf('"') > -1) {
        searchTerm = searchTerm.replace(/%22|"/g, '');
        searchTerm += '&exactsearch=true';
      }
      searchTerm = encodeURIComponent(searchTerm);
      window.location = window.location.origin + '/search?fwp_search=' + searchTerm;    
    }
  }

  const allSearchForms = document.querySelectorAll('.js-global-search');
  if (allSearchForms) {
    const searchFormLength = allSearchForms.length;
    for (let i = 0; i < searchFormLength; ++i) {
      let searchForm = allSearchForms[i];
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        searchRedirect(searchForm);
      }, false);
    }
  }
}

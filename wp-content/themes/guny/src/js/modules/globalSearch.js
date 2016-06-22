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
      searchTerm = searchTerm.replace(/\s+/g, '%20').toLowerCase();
      window.location = window.location.origin + '/search?fwp_search=' + searchTerm;
    }
  }

  const allSearchForms = document.querySelectorAll('.js-global-search');
  if (allSearchForms) {
    const searchFormLength = allSearchForms.length;
    for (let i = 0; i < searchFormLength; ++i) {
      let searchForm = allSearchForms[i];
      searchForm.addEventListener('submit', function(e){e.preventDefault();searchRedirect(searchForm);}, false);
    }
  }
}
/**
* Global site search
*
* Intercepts default WP search and sends users to the custom faceted search
*/

export default function() {

  const allSearchForms = document.querySelectorAll('.js-global-search');
  if (allSearchForms) {
    const searchFormLength = searchForm.length;
    for (let i = 0; i < searchFormLength; ++i) {
      let searchForm = allSearchForms[i];
      searchForm.addEventListener('submit');
    }
  }
}
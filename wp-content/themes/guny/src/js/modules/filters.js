/**
 * Filter module
 * @module modules/filters
 */

import forEach from 'lodash/forEach';

/**
 * Filter page contents when a filter is selected
 * Similar to behavior of Facet WP, for instances
 * where that plugin cannot be used (namely events)
 */
module.exports = function() {
  const filterForm = document.querySelectorAll('.js-filters');

  if (filterForm) {
    const inputs = document.querySelectorAll('.filter__form select');

    forEach(inputs, function(inputElem) {
      inputElem.addEventListener('change', function() {
        return this.form.submit();
      });
    });
  }
};

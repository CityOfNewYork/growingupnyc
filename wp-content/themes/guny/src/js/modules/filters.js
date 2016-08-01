/**
 * Filter module
 * @module modules/filters
 */

import forEach from 'lodash/forEach';

module.exports = function() {
  const filterForm = document.querySelectorAll('.filter__form');

  if (filterForm) {
    const inputs = document.querySelectorAll('.filter__form select');

    forEach(inputs, function(inputElem) {
      inputElem.addEventListener('change', function() {
        return this.form.submit();
      });
    });
  }
};

'use strict';

import MissPlete from 'miss-plete-js';

class Search {
  constructor() {}

  /**
   * Initializes the module
   */
  init() {
    this._inputs = document.querySelectorAll(Search.selectors.MAIN);

    if (!this._inputs) return;

    for (let i = this._inputs.length - 1; i >= 0; i--) {
      this._suggestions(this._inputs[i]);
    }
  }

  /**
   * Initializes the suggested search term dropdown.
   * @param  {object} input The search input.
   */
  _suggestions(input) {
    let data = JSON.parse(input.dataset.jsSearchSuggestions);

    input._MissPlete = new MissPlete({
      input: input,
      options: data,
      className: input.dataset.jsSearchDropdownClass
    });
  }
}

Search.selectors = {
  MAIN: '[data-js*="search"]'
};

export default Search;
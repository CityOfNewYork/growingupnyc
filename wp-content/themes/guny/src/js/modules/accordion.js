/**
 * Accordion module
 * @module modules/accordion
 */

import forEach from 'lodash/forEach';

export default function() {
  /**
   * Convert accordion heading to a button
   * @param {object} $headerElem - jQuery object containing original header
   * @return {object} New heading element
   */
  function convertHeaderToButton($headerElem) {
    if ($headerElem.get(0).nodeName.toLowerCase() === 'button') {
      return $headerElem;
    }
    const headerElem = $headerElem.get(0);
    const newHeaderElem = document.createElement('button');
    forEach(headerElem.attributes, function(attr) {
      newHeaderElem.setAttribute(attr.nodeName, attr.nodeValue);
    });
    newHeaderElem.setAttribute('type', 'button');
    const $newHeaderElem = $(newHeaderElem);
    $newHeaderElem.html($headerElem.html());
    $newHeaderElem.append('<svg class="o-accordion__caret icon" aria-hidden="true"><use xlink:href="#caret-down"></use></svg>');
    return $newHeaderElem;
  }

  /**
   * Toggle visibility attributes for header
   * @param {object} $headerElem - The accordion header jQuery object
   * @param {boolean} makeVisible - Whether the header's content should be visible
   */
  function toggleHeader($headerElem, makeVisible) {
    $headerElem.attr('aria-expanded', makeVisible);
  }

  /**
   * Add attributes, classes, and event binding to accordion header
   * @param {object} $headerElem - The accordion header jQuery object
   * @param {object} $relatedPanel - The panel the accordion header controls
   */
  function initializeHeader($headerElem, $relatedPanel) {
    $headerElem.attr({
      'aria-selected': false,
      'aria-controls': $relatedPanel.get(0).id,
      'aria-expanded': false,
      'role': 'tab'
    }).addClass('o-accordion__header');

    $headerElem.on('click.accordion', function(event) {
      event.preventDefault();
      $headerElem.trigger('changeState');
    });
  }

  /**
   * Toggle visibility attributes for panel
   * @param {object} $panelElem - The accordion panel jQuery object
   * @param {boolean} makeVisible - Whether the panel should be visible
   */
  function togglePanel($panelElem, makeVisible) {
    $panelElem.attr('aria-hidden', !makeVisible);
    if (makeVisible) {
      $panelElem.css('height', $panelElem.data('height') + 'px');
    } else {
      $panelElem.css('height', '');
    }
  }

  /**
   * Add CSS classes to accordion panels
   * @param {object} $panelElem - The accordion panel jQuery object
   * @param {string} labelledby - ID of element (accordion header) that labels panel
   */
  function initializePanel($panelElem, labelledby) {
    $panelElem.addClass('o-accordion__content');
    $panelElem.data('height', $panelElem.height());
    $panelElem.attr({
      'aria-hidden': true,
      'role': 'tabpanel',
      'aria-labelledby': labelledby
    });
  }

  /**
   * Toggle state for accordion children
   * @param {object} $item - The accordion item jQuery object
   * @param {boolean} makeVisible - Whether to make the accordion content visible
   */
  function toggleAccordionItem($item, makeVisible) {
    if (makeVisible) {
      $item.addClass('is-expanded');
      $item.removeClass('is-collapsed');
    } else {
      $item.removeClass('is-expanded');
      $item.addClass('is-collapsed');
    }
  }

  /**
   * Add CSS classes to accordion children
   * @param {object} $item - The accordion child jQuery object
   */
  function initializeAccordionItem($item) {
    $item.addClass('o-accordion__item');
    const $accordionContent = $item.find('.js-accordion__content');
    const $accordionInitialHeader = $item.find('.js-accordion__header');
    if ($accordionContent && $accordionInitialHeader) {
      const $accordionHeader = convertHeaderToButton($accordionInitialHeader);
      $accordionInitialHeader.replaceWith($accordionHeader);
      initializeHeader($accordionHeader, $accordionContent);
      initializePanel($accordionContent, $accordionHeader.get(0).id);

      /**
       * Custom event handler to toggle the accordion item open/closed
       * @function
       * @param {object} event - The event object
       * @param {boolean} makeVisible - Whether to make the accordion content visible
       */
      $item.on('toggle.accordion', function(event, makeVisible) {
        event.preventDefault();
        toggleAccordionItem($item, makeVisible);
        toggleHeader($accordionHeader, makeVisible);
        togglePanel($accordionContent, makeVisible);
      });

      // Collapse panels initially
      $item.trigger('toggle.accordion', [false]);
    }
  }

  /**
   * Add the ARIA attributes and CSS classes to the root accordion elements.
   * @param {object} $accordionElem - The jQuery object containing the root element of the accordion
   * @param {boolean} multiSelectable - Whether multiple accordion drawers can be open at the same time
   */
  function initialize($accordionElem, multiSelectable) {
    $accordionElem.attr({
      'role': 'tablist',
      'aria-multiselectable': multiSelectable
    }).addClass('o-accordion');
    $accordionElem.children().each(function() {
      initializeAccordionItem($(this));
    });
  }

  const $accordions = $('.js-accordion');
  if ($accordions.length) {
    $accordions.each(function() {
      const multiSelectable = $(this).data('multiselectable') || false;
      initialize($(this), multiSelectable);
      /**
       * Handle changeState events on accordion headers.
       * Close the open accordion item and open the new one.
       * @function
       * @param {object} event - The event object
       */
      $(this).on('changeState.accordion', '.js-accordion__header', $.proxy(function(event) {
        const $newItem = $(event.target).parent();
        if (multiSelectable) {
          $newItem.trigger('toggle.accordion', [!$newItem.hasClass('is-expanded')]);
        } else {
          const $openItem = $(this).find('.is-expanded');
          $openItem.trigger('toggle.accordion', [false]);
          if ($openItem.get(0) !== $newItem.get(0)) {
            $newItem.trigger('toggle.accordion', [true]);
          }
        }
      }, this));
    });
  }
}

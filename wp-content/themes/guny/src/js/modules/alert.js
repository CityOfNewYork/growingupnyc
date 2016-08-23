/**
 * Alert Banner module
 * @module modules/alert
 * @see modules/toggleOpen
 */

import forEach from 'lodash/forEach';
import readCookie from './readCookie.js';
import dataset from './dataset.js';
import createCookie from './createCookie.js';
import getDomain from './getDomain.js';

/**
 * Displays an alert banner.
 * @param {string} openClass - The class to toggle on if banner is visible
 */
export default function(openClass) {
  if (!openClass) {
    openClass = 'is-open';
  }

  /**
  * Make an alert visible
  * @param {object} alert - DOM node of the alert to display
  * @param {object} siblingElem - DOM node of alert's closest sibling,
  * which gets some extra padding to make room for the alert
  */
  function displayAlert(alert, siblingElem) {
    alert.classList.add(openClass);
    const alertHeight = alert.offsetHeight;
    const currentPadding = parseInt(window.getComputedStyle(siblingElem).getPropertyValue('padding-bottom'), 10);
    siblingElem.style.paddingBottom = (alertHeight + currentPadding) + 'px';
  }

  /**
  * Remove extra padding from alert sibling
  * @param {object} siblingElem - DOM node of alert sibling
  */
  function removeAlertPadding(siblingElem) {
    siblingElem.style.paddingBottom = null;
  }

  /**
  * Check alert cookie
  * @param {object} alert - DOM node of the alert
  * @return {boolean} - Whether alert cookie is set
  */
  function checkAlertCookie(alert) {
    const cookieName = dataset(alert, 'cookie');
    if (!cookieName) {
      return false;
    }
    return typeof readCookie(cookieName, document.cookie) !== 'undefined';
  }

  /**
  * Add alert cookie
  * @param {object} alert - DOM node of the alert
  */
  function addAlertCookie(alert) {
    const cookieName = dataset(alert, 'cookie');
    if (cookieName) {
      createCookie(cookieName, 'dismissed', getDomain(window.location, false), 360);
    }
  }

  const alerts = document.querySelectorAll('.js-alert');
  if (alerts.length) {
    forEach(alerts, function(alert) {
      if (!checkAlertCookie(alert)) {
        const alertSibling = alert.previousElementSibling;
        displayAlert(alert, alertSibling);

        /**
        * Add event listener for 'changeOpenState'.
        * The value of event.detail indicates whether the open state is true
        * (i.e. the alert is visible).
        * @function
        * @param {object} event - The event object
        */
        alert.addEventListener('changeOpenState', function(event) {
          // Because iOS safari inexplicably turns event.detail into an object
          if ((typeof event.detail === 'boolean' && !event.detail) ||
            (typeof event.detail === 'object' && !event.detail.detail)
          ) {
            addAlertCookie(alert);
            removeAlertPadding(alertSibling);
          }
        });
      }
    });
  }
}

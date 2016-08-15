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
  */
  function displayAlert(alert) {
    alert.classList.add(openClass);
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
        displayAlert(alert);

        /**
        * Add event listener for 'changeOpenState'.
        * The value of event.detail indicates whether the open state is true
        * (i.e. the alert is visible).
        * @function
        * @param {object} event - The event object
        */
        alert.addEventListener('changeOpenState', function(event) {
          if (!event.detail) {
            addAlertCookie(alert);
          }
        });
      }
    });
  }
}

'use strict';

(function() {
  window.addEventListener('load', init);

  /**
   * Initializes the event listeners for the activity sign-up buttons.
   */
  function init() {
    let buttons = qsa('.activity-card button');
    buttons.forEach(button => {
      button.addEventListener('click', signUpForActivity);
    });
  }

  /**
   * Handles the form submission to sign up for an activity.
   * @param {Event} event - The submit event triggered by the form.
   */
  function signUpForActivity(event) {
    event.preventDefault();
    let data = new FormData();
    data.append('username', window.localStorage.getItem('username'));
    data.append('activity', event.currentTarget.getAttribute('data-activity'));
    console.log(data);
    fetch('/signup-activity', {
      method: 'POST',
      body: data
    })
      .then(statusCheck)
      .then(response => response.text())
      .then(message => {
        displayMessage(message, false);
      })
      .catch(handleError);
  }

  /**
   * Checks the status of the fetch response.
   * @param {Response} response - The fetch response object.
   * @returns {Response} - The valid response object if the status is OK.
   * @throws {Error} - An error if the response status is not OK.
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * Handles errors by displaying the error message in the error message element.
   * @param {Error} err - The error object.
   */
  function handleError(err) {
    displayMessage('Error: ' + err.message, true);
  }

  /**
 * Hides error messages.
 */
  function hideMessage() {
    /**
     * clear error message.
     */
    function clearMessage() {
      qs('.error').textContent = '';
      qs('body').removeEventListener('click', clearMessage);
    }
    qs('body').addEventListener('click', clearMessage);
  }

  /**
   * Displays a message in the error message element.
   * @param {string} message - The message to display.
   * @param {boolean} isError - Whether the message is an error message.
   */
  function displayMessage(message, isError) {
    const errorMessageElement = qs('.error');
    errorMessageElement.textContent = message;
    if (isError) {
      errorMessageElement.style.color = 'red';
    } else {
      errorMessageElement.style.color = 'green';
    }
    const time = 100;
    setTimeout(hideMessage, time);
  }

  /**
   * Returns the first element that matches the selector.
   * @param {string} selector - The CSS selector.
   * @return {HTMLElement} - The DOM element.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Selects all elements that match the given CSS selector.
   * @param {string} selector - The CSS selector.
   * @return {NodeList} - A NodeList of matching elements.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();

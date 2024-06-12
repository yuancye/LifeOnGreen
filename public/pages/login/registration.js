/**
 * Name: Hung-Yun Liu | Yuanchao Ye
 * Date: 05-04-2024
 * Section: AG/Marina Wooden | AA/Kevin Wu
 *
 * Registration.js is used to register new users. It will send the
 * user information that was input in this page to the server.
 */

'use strict';

(function() {

  window.addEventListener('load', init);

  /**
   * init function.
   */
  function init() {
    id('register-btn').addEventListener('click', register);
  }

  /**
   * Register new user and send user information to server.
   */
  function register() {
    let data = new FormData(id('registration-form'));
    if (isSamePassword()) {
      fetch('/registration', {
        method: 'POST',
        body: data
      })
        .then(statusCheck)
        .then(res => res.text())
        .then(displayMessage)
        .catch(handleError);
    } else {
      let message = "Password and Confirmed password does not match";
      displayMessage(message);
    }
  }

  /**
   * Checks if the password and confirmed password fields have the same value.
   * @returns {boolean} True if the passwords match, false otherwise.
   */
  function isSamePassword() {
    const password = qs('input[name="password"]').value;
    const confirmPassword = qs('input[name="password-confirmation"]').value;
    return password === confirmPassword;
  }

  /**
   * Displays a message to the user and hides it after 0.1s.
   * @param {string} message - The message to display.
   */
  function displayMessage(message) {
    qs('.error').textContent = message;
    const time = 100;
    setTimeout(hideMessage, time);
  }

  /**
   * Hides message when the body is clicked.
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
   * Handles errors by displaying the error message.
   * @param {Error} err - The error object.
   */
  function handleError(err) {
    qs('.error').textContent = err.message;
    const time = 100;
    setTimeout(hideMessage, time);
  }

  /**
   * Helper function to return the response's result text if
   * successful, otherwise returns the rejected Promise result
   * with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful,
   * otherwise rejected Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the element that has the matches the selector passed.
   * @param {string} selector - selector for element
   * @return {object} DOM object associated with selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();
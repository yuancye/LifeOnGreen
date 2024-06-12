/**
 * Name: Hung-Yun Liu | Yuanchao Ye
 * Date: 05-04-2024
 * Section: AG/Marina Wooden | AA/Kevin Wu
 *
 * login.js is uesed to authorize the registered user to log in to
 * the Life on Green web app so they logged in user could buy and
 * sale products.
 */

'use strict';

(function() {

  window.addEventListener('load', init);

  /**
   * init function, save the last username in the username input
   * area if there was a logging history and log in the user.
   */
  function init() {
    let savedUserName = window.localStorage.getItem('username');
    if (savedUserName) {
      id('username').value = savedUserName;
    }
    qs('form').addEventListener('submit', login);
  }

  /**
   * Log in to Life on Green if the username exists and its
   * corresponding password is correct.
   * @param {Event} evt - The form submission event.
   */
  function login(evt) {
    evt.preventDefault();
    let data = new FormData(qs('form'));
    fetch('/login', {
      method: 'POST',
      body: data
    })
      .then(statusCheck)
      .then(res => res.text())
      .then(() => navigateToUserMenu())
      .catch(handleError);
  }

  /**
   * Navigates to the products page upon successful login,
   * saving username.
   * @param {string} res - The response text from the server.
   */
  function navigateToUserMenu() {
    let username = id('username').value;
    window.localStorage.setItem('username', username);
    window.location.href = '../products.html';
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
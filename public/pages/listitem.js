/**
 * Name: Hung-Yun Liu | Yuanchao Ye
 * Date: 05-04-2024
 * Section: AG/Marina Wooden | AA/Kevin Wu
 *
 * listitem.js is used to handle the item listed by the
 * user. It will check the user input and once validate
 * the input, send request to save the listed item in
 * the server.
 */

'use strict';

(function() {
  let isSubmitting = false;
  window.addEventListener('load', init);

  /**
   * init function.
   */
  function init() {
    id('price').addEventListener('input', (event) => {
      limitDecimalPlaces(event);
    });
    fetchCategory();
    qs('form').addEventListener('submit', listItem);
  }

  /**
   * Retrieve the list of categories from the server.
   */
  function fetchCategory() {
    fetch('/category')
      .then(statusCheck)
      .then(res => res.json())
      .then(displayCategory)
      .catch(handleError);
  }

  /**
   * Populates the category dropdown with the retrived category data.
   * @param {Array} data - An array of category objects.
   */
  function displayCategory(data) {
    let categoryDropdown = id('category');
    categoryDropdown.innerHTML = '';

    data.forEach(category => {
      let option = gen('option');
      option.value = category.name;
      option.textContent = category.name;
      categoryDropdown.appendChild(option);
    });
  }

  /**
   * Handles the form submission for listing an item.
   * @param {Event} evt - The event object.
   */
  function listItem(evt) {
    evt.preventDefault();
    let data = new FormData(qs('form'));
    if (!isSubmitting) {
      isSubmitting = true;
      fetch('/list-item', {
        method: 'POST',
        body: data
      })
        .then(statusCheck)
        .then(res => res.text())
        .then(displayMessage)
        .catch(handleError)
        .finally(() => {
          isSubmitting = false;
        });
    }
  }

  /**
   * Limits the decimal places in the price field to two.
   * @param {Event} evt - The event object.
   */
  function limitDecimalPlaces(evt) {
    if (evt.target.value.indexOf('.') !== -1) {
      if ((evt.target.value.length - evt.target.value.indexOf('.')) > 2) {
        evt.target.value = parseFloat(evt.target.value).toFixed(2);
      }
    }
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
   * Returns the element that has the ID attribute with the
   * specified value.
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

  /**
   * Wrapper function for createElement.
   * Generates a new DOM element with the specified tag name.
   * @param {string} tagName - The tag name of the element to be created.
   * @return {Element} - The newly created DOM element.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();
/**
 * Name: Hung-Yun Liu | Yuanchao Ye
 * Date: 05-04-2024
 * Section: AG/Marina Wooden | AA/Kevin Wu
 *
 * Generate the items that listed by the current login user.
 */

'use strict';

(function() {

  window.addEventListener('load', init);

  /**
   * Init function to display the items for the login user.
   */
  function init() {
    if (!isUserLoggedIn()) {
      window.location.href = './login/login.html';
    } else {
      fetchListedItems();
    }
  }

  /**
   * Retrieve the items that the user has listed.
   */
  function fetchListedItems() {
    fetch('/get-listed-items')
      .then(statusCheck)
      .then(res => res.json())
      .then(displayListedItems)
      .catch(handleError);
  }

  /**
   * Display the items for the login user
   * @param {Object} items the items that retrieved from derver.
   */
  function displayListedItems(items) {
    let listedItemsContainer = document.getElementById('listed-items');
    listedItemsContainer.innerHTML = '';

    if (items.length === 0) {
      let noItemsMessage = document.createElement('p');
      noItemsMessage.textContent = 'You have no items listed for sale.';
      listedItemsContainer.appendChild(noItemsMessage);
      return;
    }

    items.forEach(item => {
      let itemElem = document.createElement('div');
      itemElem.classList.add('item');

      let itemImg = document.createElement('img');
      itemImg.src = `/imgs/uploads/${item.img_path.split('/').pop()}`;
      itemImg.alt = item.item_name;
      itemElem.appendChild(itemImg);

      let itemName = document.createElement('p');
      itemName.textContent = `Name: ${item.item_name}`;
      itemElem.appendChild(itemName);

      let itemQuantity = document.createElement('p');
      itemQuantity.textContent = `Quantity: ${item.available_quantity}`;
      itemElem.appendChild(itemQuantity);

      let itemPrice = document.createElement('p');
      itemPrice.textContent = `Price: $${formatPrice(item.price)}`;
      itemElem.appendChild(itemPrice);

      listedItemsContainer.appendChild(itemElem);
    });
  }

  /**
   * Checks the response status and returns the result text if successful,
   * otherwise returns a rejected Promise with an error status and text.
   * @param {object} res - The response to check.
   * @return {object} - The valid response or a rejected Promise result.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
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
   * Handles errors by displaying an error message.
   * @param {Error} err - The error to handle.
   */
  function handleError(err) {
    qs('.error').textContent = err.message;
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
   * Formats the price to keep two decimal places.
   * @param {string} price - The item price.
   * @return {string} - The formatted price.
   */
  function formatPrice(price) {
    return price ? `${Number(price).toFixed(2)}` : '0.00';
  }

  /**
   * Check if there is an user logged in the web app.
   * @return {boolean}True if there is one, false otherwize.
   */
  function isUserLoggedIn() {
    return window.localStorage.getItem('username') !== null;
  }
})();

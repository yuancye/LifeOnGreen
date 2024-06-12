/**
 * Name: Hung-Yun Liu | Yuanchao Ye
 * Date: 05-04-2024
 * Section: AG/Marina Wooden | AA/Kevin Wu
 *
 * generate all the transactions for the current user.
 */

'use strict';

(function() {

  window.addEventListener('load', init);

  /**
   * init function to display transactions for the logged in user.
   */
  function init() {
    if (!isUserLoggedIn()) {
      window.location.href = './login/login.html';
    } else {
      fetchTransactions();
    }
  }

  /**
   * Retrieve transactions for the given usernmae from server
   */
  function fetchTransactions() {
    fetch('/get-transactions')
      .then(statusCheck)
      .then(res => res.json())
      .then(displayTransactions)
      .catch(handleError);
  }

  /**
   * Display current user's transaction history.
   * @param {Object} transactions: User transaction hisotory.
   */
  function displayTransactions(transactions) {
    let transactionsList = id('transactions-list');
    transactionsList.innerHTML = '';
    if (Object.keys(transactions).length === 0) {
      handleError(new Error('You have no transactions.'));
    } else {
      for (let [transactionId, transaction] of Object.entries(transactions)) {
        let transactionItem = gen('div');
        transactionItem.classList.add('transaction-item');

        let transactionHeader = genTransactionHeader(transactionId, transaction);

        transactionItem.appendChild(transactionHeader);

        let itemsContainer = generateItemContainer(transaction);

        transactionItem.appendChild(itemsContainer);
        transactionsList.appendChild(transactionItem);
      }
    }
  }

  /**
   * Generates a HTML elements for each item in a transaction.
   * @param {Object} transaction - The transaction object containing item details.
   * @returns {HTMLElement} The container element with item details.
   *
   */
  function generateItemContainer(transaction) {
    let itemsContainer = gen('div');
    itemsContainer.classList.add('items-container');
    transaction.items.forEach(item => {
      let itemElem = gen('div');
      itemElem.classList.add('item');
      let itemImg = gen('img');
      itemImg.src = `/imgs/uploads/${item.imgPath.split('/').pop()}`;
      itemImg.alt = item.itemName;
      itemElem.appendChild(itemImg);
      let itemName = gen('p');
      itemName.textContent = item.itemName;
      itemElem.appendChild(itemName);
      let itemPrice = gen('p');
      itemPrice.textContent = `Price: $${formatPrice(item.price)}`;
      itemElem.appendChild(itemPrice);
      itemsContainer.appendChild(itemElem);
    });
    return itemsContainer;
  }

  /**
   * Display transaction information.
   * @param {string} transactionId - The ID of the transaction.
   * @param {Object} transaction - The transaction object containing date and amount details.
   * @returns {HTMLElement} The header element with transaction details.
   */
  function genTransactionHeader(transactionId, transaction) {
    let transactionHeader = gen('div');
    transactionHeader.classList.add('transaction-header');
    let transactionIdElem = gen('p');
    transactionIdElem.textContent = `Transaction ID: ${transactionId}`;
    transactionHeader.appendChild(transactionIdElem);
    let transactionDate = gen('p');
    transactionDate.textContent = `Date: ${new Date(transaction.date).toLocaleDateString()}`;
    transactionHeader.appendChild(transactionDate);
    let transactionAmount = gen('p');
    transactionAmount.textContent = `Total Amount: $${formatPrice(transaction.amount)}`;
    transactionHeader.appendChild(transactionAmount);
    return transactionHeader;
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
   * Check if there is an user logged in the web app.
   * @return {boolean}True if there is one, false otherwize.
   */
  function isUserLoggedIn() {
    return window.localStorage.getItem('username') !== null;
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
   * Returns the element with the specified ID.
   * @param {string} id - The element ID.
   * @return {HTMLElement} - The DOM element.
   */
  function id(id) {
    return document.getElementById(id);
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
   * Creates a new DOM element with the specified tag name.
   * @param {string} tagName - The tag name of the element to create.
   * @return {HTMLElement} - The newly created DOM element.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();

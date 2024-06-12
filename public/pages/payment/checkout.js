/**
 * Name: Hung-Yun Liu | Yuanchao Ye
 * Date: 05-04-2024
 * Section: AG/Marina Wooden | AA/Kevin Wu
 *
 * Checkout.js is specifically used to control the checkout
 * behavior. It will save the payment information, as well as
 * the transacation information.
 */

'use strict';

(function() {
  window.addEventListener('load', init);
  let username = window.localStorage.getItem('username');
  let buysNow = window.localStorage.getItem('buys-now');
  let totalPrice = window.localStorage.getItem('total-price');

  /**
   * Init the function
   */
  function init() {
    initBtnStatus();
    id('mailing-address1').addEventListener('change', fetchAddress);
    id('billing-address1').addEventListener('change', autofillBillingAddress);
    qs('form').addEventListener('submit', placeOrder);
  }

  /**
   * Initializes the button status for navigation based on whether
   * the user is buying now or from the cart.
   */
  function initBtnStatus() {
    if (buysNow === 'true') {
      qs('.back-to-cart').classList.add('hidden');
      qs('.back-to-products').classList.remove('hidden');
      qs('.back-to-products').addEventListener('click', () => {
        window.location.href = '../products.html';
        buysNow = false;
        window.localStorage.setItem('buys-now', buysNow);
      });
    } else {
      qs('.back-to-products').classList.add('hidden');
      qs('.back-to-cart').classList.remove('hidden');
      qs('.back-to-cart').addEventListener('click', () => {
        window.location.href = 'cart.html';
      });
    }
  }

  /**
   * Fetches the address for the user if the mailing address checkbox is checked.
   * @param {Event} event - The event object
   */
  function fetchAddress(event) {
    if (event.currentTarget.checked) {
      fetch(`/get-address/${username}`)
        .then(statusCheck)
        .then(res => res.json())
        .then(autofillMailingAddress)
        .catch(handleError);
    } else {
      clearMailingAddress();
    }
  }

  /**
   * Autofills the mailing address form with the fetched address data.
   * @param {Object} res - The response object containing address data
   */
  function autofillMailingAddress(res) {
    id('street').value = res.street;
    id('state').value = res.state;
    id('zip').value = res.zip;
  }

  /**
   * Clears the mailing address form.
   */
  function clearMailingAddress() {
    id('street').value = '';
    id('state').value = '';
    id('zip').value = '';
  }

  /**
   * Autofills the billing address form with the same values as
   * the mailing address if the checkbox is checked.
   * @param {Event} event - The event object
   */
  function autofillBillingAddress(event) {
    if (event.currentTarget.checked) {
      id('street1').value = id('street').value;
      id('state1').value = id('state').value;
      id('zip1').value = id('zip').value;
    } else {
      clearBillingAddress();
    }
  }

  /**
   * Clears the billing address form.
   */
  function clearBillingAddress() {
    id('street1').value = '';
    id('state1').value = '';
    id('zip1').value = '';
  }

  /**
   * Places the order by submitting the form data to the server.
   * @param {Event} event - The event object
   */
  function placeOrder(event) {
    event.preventDefault();
    let data = new FormData(qs('form'));
    data.append('username', username);
    data.append('total-price', totalPrice);
    fetch('/payment', {
      method: 'POST',
      body: data
    })
      .then(statusCheck)
      .then(res => res.json())
      .then(saveTransaction)
      .catch(handleError);
  }

  /**
   * Saves the transaction details to the database.
   * @param {Object} res - The response object containing the transaction ID
   */
  function saveTransaction(res) {
    let data = new FormData();
    let itemIds;
    if (buysNow === 'true') {
      itemIds = window.sessionStorage.getItem('buys-now');
    } else {
      itemIds = window.localStorage.getItem('cart-items');
    }
    data.append('buys-now', buysNow);
    data.append('item-ids', itemIds);
    data.append('total-price', totalPrice);
    data.append('username', username);
    data.append('transaction-id', res);
    fetch('/save-transaction', {
      method: 'POST',
      body: data
    })
      .then(statusCheck)
      .then(result => result.json())
      .then(displayTransactionId)
      .catch(handleError);
  }

  /**
   * Displays the transaction ID and clears the local and session storage.
   * @param {Object} res - The response object containing the transaction details
   */
  function displayTransactionId(res) {
    id('checkout-form').classList.add('hidden');
    qs('.error').textContent = `Your order has been placed, Transaction ID is ${res}`;
    qs('body').addEventListener('click', () => {
      clearMessage();
      id('checkout-form').classList.remove('hidden');
    });
    if (buysNow === 'true') {
      window.sessionStorage.removeItem('buys-now');
    } else {
      window.localStorage.removeItem('cart-items');
      window.localStorage.removeItem('total-price');
    }
  }

  /**
   * Clears the error message displayed on the page.
   */
  function clearMessage() {
    qs('.error').textContent = '';
  }

  /**
   * Handles any errors that occur during the fetch operations.
   * @param {Error} err - The error object
   */
  function handleError(err) {
    qs('.error').textContent = err.message;
    const time = 2000;
    setTimeout(clearMessage, time);
  }

  /**
   * Helper function to return the response's result text if successful,
   * otherwise returns the rejected Promise result with an error status and corresponding text.
   * @param {Response} res - The response to check for success/error
   * @return {Response} - Valid response if the response was
   * successful, otherwise rejected Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - Element ID
   * @return {HTMLElement} - DOM object associated with the ID
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the element that matches the selector passed.
   * @param {string} selector - Selector for the element
   * @return {HTMLElement} - DOM object associated with the selector
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();

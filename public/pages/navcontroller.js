/**
 * Name: Hung-Yun Liu | Yuanchao Ye
 * Date: 05-04-2024
 * Section: AG/Marina Wooden | AA/Kevin Wu
 *
 * Display usermenu for User who has logged in.
 */

'use strict';

(function() {

  window.addEventListener('load', init);

  /**
   * init function to control the nav bar.
   */
  function init() {
    let usermenu = qsa('.usermenu');

    updateCartCount();
    qs('body').addEventListener('click', updateCartCount);

    id('cart-icon').addEventListener('click', () => {
      window.localStorage.setItem('buys-now', false);
    });

    let username = window.localStorage.getItem('username');
    if (username) {
      id('login-link').textContent = username;
      for (let i = 0; i < usermenu.length; i++) {
        usermenu[i].classList.remove('hidden');
      }
    } else {
      id('login-link').textContent = 'Login';
      for (let i = 0; i < usermenu.length; i++) {
        usermenu[i].classList.add('hidden');
      }
    }
  }

  /**
   * Update the cart item counts.
   */
  function updateCartCount() {
    let cartItems = window.localStorage.getItem('cart-items');
    if (cartItems) {
      cartItems = JSON.parse(cartItems);
      let cartCount = Object.keys(cartItems).length;
      id('cart-count').textContent = cartCount;
    } else {
      id('cart-count').textContent = 0;
    }
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
   * Returns the first element that matches the selector.
   * @param {string} selector - The CSS selector.
   * @return {HTMLElement} - The DOM element.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Wrapper function for querySelectorAll.
   * Selects all elements in the DOM that match the given CSS
   * selector.
   * @param {string} selector: The CSS selector.
   * @return {NodeList | []} - A NodeList containing all
   * elements that match the selector or [] if no such
   * element exists
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();
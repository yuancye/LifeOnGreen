/**
 * Name: Hung-Yun Liu | Yuanchao Ye
 * Date: 05-04-2024
 * Section: AG/Marina Wooden | AA/Kevin Wu
 *
 * cart.js is allowed user to browse items they have added to the
 * cart, also allow user to change the quality of the item they
 * have put in the cart.
 */

'use strict';

(function() {
  window.addEventListener('load', init);
  let cartItems;
  let userName = window.localStorage.getItem('username');

  /**
   * Init function for cart
   */
  function init() {
    let errorTag = qs('.error');
    errorTag.classList.add('hidden');
    cartItems = JSON.parse(window.localStorage.getItem('cart-items'));
    if (cartItems && userName !== null) {
      fetchCartItems();
      id('check-out').disabled = false;
    } else {
      errorTag.textContent = 'Cart is Empty or not Logged in yet!';
      id('check-out').disabled = true;
      errorTag.classList.remove('hidden');
      const time = 2000;
      setTimeout(navigateToProducts, time);
    }
    qs('.back-to-products').addEventListener('click', () => {
      window.location.href = '../products.html';
    });

    id('check-out').addEventListener('click', () => {
      window.location.href = 'checkout.html';
      window.localStorage.setItem('buys-now', false);
    });
  }

  /**
   * Navigates to the products page.
   */
  function navigateToProducts() {
    window.location.href = '../products.html';
  }

  /**
   * Retrieve cart items from the server based on item IDs in local storage.
   */
  function fetchCartItems() {
    const fetchPromises = [];
    for (let cartItem in cartItems) {
      fetchPromises.push(
        fetch(`/get-items/${cartItem}`)
          .then(statusCheck)
          .then(res => res.json())
          .then(appendCartItems)
          .catch(handleError)
      );
    }
    Promise.all(fetchPromises)
      .then(() => {
        calculateTotalPrice();
      });
  }

  /**
   * Appends cart items to the page.
   * @param {Object} res - The response object containing item data.
   * @returns {HTMLElement} The parent element containing all cart items.
   */
  function appendCartItems(res) {
    let parent = id('cart-contents');
    let child = gen('article');
    child.id = res.item_id;
    let firstDiv = generateFirstDiv(res.img_path, res.item_name);
    let secDiv = generateSecDiv(res.item_id, res.price, res.available_quantity);
    child.append(firstDiv);
    child.append(secDiv);
    parent.append(child);
    return parent;
  }

  /**
   * Generates the first div that contains item image and name.
   * @param {string} imgPath - The path to the item's image.
   * @param {string} itemName - The name of the item.
   * @returns {HTMLElement} The div element containing the image and name.
   */
  function generateFirstDiv(imgPath, itemName) {
    let divTag = gen('div');
    let img = gen('img');
    let pTag = gen('p');
    img.src = '/imgs/uploads/' + imgPath.split('/').pop();
    img.alt = imgPath.split('/').pop();
    pTag.textContent = itemName;
    divTag.appendChild(img);
    divTag.appendChild(pTag);
    return divTag;
  }

  /**
   * Generates the second div containing item quantity input, price, and availability.
   * @param {string} itemId - The ID of the item.
   * @param {number} price - The price of the item.
   * @param {number} availability - The available quantity of the item.
   * @returns {HTMLElement} The div element containing the quantity input, price, and availability.
   */
  function generateSecDiv(itemId, price, availability) {
    let divTag = gen('div');
    let input = gen('input');
    input.type = 'number';
    input.min = 0;
    input.max = availability + cartItems[itemId.toString()];
    input.step = 1;
    input.value = cartItems[itemId.toString()];
    let pTag = gen('p');
    pTag.appendChild(input);
    pTag.appendChild(document.createTextNode(` x $${formatPrice(price)}`));

    let availabilityTag = gen('p');
    availabilityTag.textContent = `Only ${availability} left!`;

    let priceTag = gen('p');
    priceTag.textContent = `Price: $${formatPrice(parseInt(input.value) * price)}`;
    priceTag.classList.add('price');
    divTag.appendChild(pTag);
    divTag.appendChild(availabilityTag);
    divTag.appendChild(priceTag);
    input.addEventListener('change', async () => {
      let curAvail = await fetchAvailability(itemId);
      handleInput(input, itemId, price, curAvail);
    });
    return divTag;
  }

  /**
   * Retrieve the current availability of an item from the server.
   * @param {string} itemId - The ID of the item.
   * @returns {Promise<number>} A promise that resolves to the available
   * quantity of the item.
   */
  async function fetchAvailability(itemId) {
    try {
      let res = await fetch(`/get-items/${itemId}`);
      res = await statusCheck(res);
      let data = await res.json();
      return data.available_quantity;
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Handles changes to the item quantity input, updating the
   * cart, total cost and inventory as necessary.
   * @param {HTMLInputElement} input - The input element for item quantity.
   * @param {string} itemId - The ID of the item.
   * @param {number} price - The price of the item.
   * @param {number} availability - The available quantity of the item.
   */
  function handleInput(input, itemId, price, availability) {
    let oldVal = parseInt(cartItems[itemId.toString()]);
    let newValue = parseInt(input.value);
    if (newValue < 0) {
      input.value = oldVal;
      handleError(new Error('Cannot be negative.'));
    } else {
      let diff = newValue - oldVal;
      if (diff > availability) {
        handleError(new Error('Not enough Inventory.'));
      } else {
        availability = availability - diff;
        let newPrice = formatPrice(newValue * price);
        let priceTag = input.parentElement.nextElementSibling.nextElementSibling;
        priceTag.textContent = `Cost: $${newPrice}`;
        updateDBAvailability(itemId, diff);
        updateLocalStorage(input, itemId, availability);
        calculateTotalPrice();
      }
    }

    if (newValue === 0) {
      delete cartItems[itemId];
      window.localStorage.setItem('cart-items', JSON.stringify(cartItems));
      removeCartItemFromUI(itemId);
      calculateTotalPrice();
    }
  }

  /**
   * Calculates the total price of the items in the cart or through buysNow and updates the UI.
   */
  function calculateTotalPrice() {
    let totalPrice = 0;
    let prices = qsa('.price');
    for (let i = 0; i < prices.length; i++) {
      let price = prices[i].textContent.split('$')[1];
      totalPrice += parseFloat(price);
    }
    if (totalPrice === 0) {
      qs('#cart-contents ~ p').classList.add('hidden');
      handleError(new Error('Cart is empty!'));
    } else {
      qs('#cart-contents ~ p').classList.remove('hidden');
      totalPrice = formatPrice(totalPrice);
      qs('#cart-contents ~ p').textContent = `Total Cost: $${totalPrice}`;
      window.localStorage.setItem('total-price', totalPrice);
    }
  }

  /**
   * Removes an item from the cart UI.
   * @param {string} itemId - The ID of the item to be removed.
   */
  function removeCartItemFromUI(itemId) {
    let itemElement = id(itemId);
    if (itemElement) {
      itemElement.remove();
    }
  }

  /**
   * Updates the availability of an item in the database.
   * @param {string} id - The ID of the item.
   * @param {number} diff - The difference in quantity to update.
   */
  function updateDBAvailability(id, diff) {
    let data = new FormData();
    data.append('id', id);
    data.append('diff', diff);
    fetch('/update-inventory', {
      method: 'POST',
      body: data
    })
      .then(statusCheck)
      .catch(handleError);
  }

  /**
   * Updates the local storage with the current cart item quantity.
   * @param {HTMLInputElement} curTag - The input element for item quantity.
   * @param {string} id - The ID of the item.
   * @param {number} availability - The available quantity of the item.
   */
  function updateLocalStorage(curTag, id, availability) {
    cartItems[id.toString()] = parseInt(curTag.value);
    window.localStorage.setItem('cart-items', JSON.stringify(cartItems));
    curTag.parentElement.nextElementSibling.textContent = `Only ${parseInt(availability)} left!`;
  }

  /**
   * Clears the error message.
   */
  function clearMessage() {
    qs('.error').textContent = '';
  }

  /**
   * Handles errors by displaying the error message.
   * @param {Error} err - The error object.
   */
  function handleError(err) {
    qs('.error').textContent = err.message;
    const time = 2000;
    setTimeout(clearMessage, time);
  }

  /**
   * function used to force format the price to keep 2 decimal.
   * @param {string} price - item price.
   * @return {string} reformatted price.
   */
  function formatPrice(price) {
    return price ? `${Number(price).toFixed(2)}` : '0.00';
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
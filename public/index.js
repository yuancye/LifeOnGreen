/**
 * Name: Hung-Yun Liu | Yuanchao Ye
 * Date: 05-04-2024
 * Section: AG/Marina Wooden | AA/Kevin Wu
 *
 * Generate all the products in the database when click on the
 * products navigation bar on the top of index.html.
 */

'use strict';

(function() {

  window.addEventListener('load', init);
  let curId;
  let storedUserName = window.localStorage.getItem('username');

  /**
   * Initializes the application, sets up event listeners, and fetches initial data.
   */
  function init() {
    id('products-list').innerHTML = '';
    showSearchBtn();
    fetchCategory();
    getAllItems();
    id('search-btn').addEventListener('click', search);
    qs('form').addEventListener('submit', (event) => {
      filter(event);
    });
    if (storedUserName !== null) {
      id('buys-now').disabled = false;
      id('add-to-cart').disabled = false;
      id('buys-now').addEventListener('click', navigateToCheckOut);
      id('add-to-cart').addEventListener('click', addToCart);
    } else {
      id('buys-now').disabled = true;
      id('add-to-cart').disabled = true;
    }
    qs('.back-to-products').addEventListener('click', () => {
      window.location.href = 'products.html';
    });

    id('price').addEventListener('input', updateFilterPrice);
  }

  /**
   * display the search and filter button in products page.
   */
  function showSearchBtn() {
    id('products-list').classList.remove('hidden');
    // id('list-view-btn').classList.remove('hidden');
    // id('grid-view-btn').classList.remove('hidden');
    id('single-item').classList.add('hidden');
  }

  /**
   * display the selected filter price.
   */
  function updateFilterPrice() {
    id('price').nextElementSibling.value = id('price').value;
  }

  /**
   * Filter the products based on user-selected criteria.
   * @param {Event} event - The event object associated with the form submission.
   */
  function filter(event) {
    event.preventDefault();
    let data = new FormData(qs('form'));
    let category = data.get('category');
    let price = data.get('price');
    fetch(`/get-items/filter/?category=${category}&price=${price}`)
      .then(statusCheck)
      .then(res => res.json())
      .then(showSearchResults)
      .catch(handleError);
  }

  /**
   * retrieve all products from the server.
   */
  function getAllItems() {
    fetch('/get-items')
      .then(statusCheck)
      .then(res => res.json())
      .then(data => {
        displayItems(data);
      })
      .catch(handleError);
  }

  /**
   * Displays all items on the page.
   * @param {Array} products - The array of product data to display.
   */
  function displayItems(products) {
    if (products && products.length > 0) {
      let parent = qs('#products-list');
      parent.innerHTML = '';
      products.forEach(item => {
        let section = gen('section');
        section.id = item.item_id;
        let img = generateImg(item);
        let itemName = gen('p');
        let price = gen('p');
        let userName = gen('p');
        const maxStar = 6;
        let star = generateStar(Math.floor(Math.random() * (maxStar)));
        itemName.textContent = item.item_name;
        price.textContent = `$${formatPrice(item.price)}`;
        userName.textContent = `Seller: ${item.seller_name}`;
        section.appendChild(img);
        section.appendChild(itemName);
        section.appendChild(star);
        section.appendChild(price);
        section.appendChild(userName);
        parent.appendChild(section);
        [img, itemName].forEach(el => el.addEventListener(
          'click',
          () => fetchItemDetails(item.item_id)
        ));
      });
    }
  }

  /**
   * Generates an image element for a given item.
   * @param {Object} item - The item object containing image information.
   * @return {HTMLImageElement} - The generated image element.
   */
  function generateImg(item) {
    let img = gen('img');
    img.src = '/imgs/uploads/' + item.img_path.split('/').pop();
    img.alt = item.img_path.split('/').pop();
    return img;
  }

  /**
   * Fetches details of a single item from the server.
   * @param {number} itemId - The ID of the item to fetch details for.
   */
  function fetchItemDetails(itemId) {
    fetch(`/get-items/${itemId}`)
      .then(statusCheck)
      .then(res => res.json())
      .then(displayItemDetails)
      .catch(handleError);
  }

  /**
   * Displays details of a single item on the page.
   * @param {Object} res - The item details to display.
   */
  function displayItemDetails(res) {
    id('products-list').classList.add('hidden');
    // id('list-view-btn').classList.add('hidden');
    // id('grid-view-btn').classList.add('hidden');
    id('single-item').classList.remove('hidden');
    curId = res.item_id;
    let pAbout = qs('#seller ~ p');
    const maxStar = 6;
    let avgStar = Math.floor(Math.random() * (maxStar));
    let star = generateStar(avgStar);
    pAbout.parentNode.insertBefore(star, pAbout);
    let img = qs('#img-price img');
    img.src = '/imgs/uploads/' + res.img_path.split('/').pop();
    img.alt = res.img_path.split('/').pop();
    qs('#img-price p').textContent = `$${formatPrice(res.price)}`;
    qs('#details #item-name').textContent = res.item_name;
    qs('#details #seller').textContent = `Seller: ${res.seller_name}`;
    qs('#details #description').textContent = res.description;
    checkAvailability(res.available_quantity);
  }

  /**
   * Fetches product categories from the server.
   */
  function fetchCategory() {
    fetch('/category')
      .then(statusCheck)
      .then(res => res.json())
      .then(displayCategory)
      .catch(handleError);
  }

  /**
   * Displays product categories in the dropdown.
   * @param {Array} data - The array of categories to display.
   */
  function displayCategory(data) {
    let categoryDropdown = id('product-category');
    categoryDropdown.innerHTML = '';
    let option = gen('option');
    option.value = '';
    option.textContent = 'Select Category';
    categoryDropdown.appendChild(option);
    data.forEach(category => {
      let optionTemp = gen('option');
      optionTemp.value = category.name;
      optionTemp.textContent = category.name;
      categoryDropdown.appendChild(optionTemp);
    });
  }

  /**
   * Adds the current item to the cart.
   */
  function addToCart() {
    if (storedUserName) {
      let cartItemsMap = JSON.parse(window.localStorage.getItem('cart-items')) || {};
      if (curId in cartItemsMap) {
        cartItemsMap[curId]++;
      } else {
        cartItemsMap[curId] = 1;
      }
      window.localStorage.setItem('cart-items', JSON.stringify(cartItemsMap));
      let data = new FormData();
      data.append('id', curId);
      data.append('diff', 1);
      fetch('/update-inventory', {
        method: 'POST',
        body: data
      })
        .then(statusCheck)
        .then(res => res.json())
        .then((res) => checkAvailability(res))
        .then(displayMessage)
        .catch(handleError);
    } else {
      handleError(new Error('Login First!'));
    }
  }

  /**
   * Checks the availability of the current item.
   * @param {number} counts - The number of items available.
   * @return {String} success will be returned to signal the next step.
   */
  function checkAvailability(counts) {
    if (counts > 0 && storedUserName !== null) {
      id('add-to-cart').disabled = false;
      id('buys-now').disabled = false;
      id('add-to-cart').textContent = 'Add to Cart';
    } else {
      id('add-to-cart').disabled = true;
      id('buys-now').disabled = true;
      if (counts <= 0) {
        id('add-to-cart').textContent = 'Sold Out';
      }
    }
    return 'Success';
  }

  /**
   * Display Successful Message to user that the item has been added to the cart.
   * @param {Object} res The response object received from the previous .then in the promise chain.
   */
  function displayMessage(res) {
    if (res) {
      qs('.error').textContent = 'Item has been added to Cart.';
      hideMessage();
    }
  }

  /**
   * Navigates to the checkout page.
   */
  function navigateToCheckOut() {
    if (storedUserName !== null) {
      window.sessionStorage.setItem('buys-now', JSON.stringify({[curId.toString()]: 1}));
      window.localStorage.setItem('buys-now', true);
      window.location.href = 'payment/checkout.html';
    } else {
      handleError(new Error('Login First!'));
    }
  }

  /**
   * Generates a star rating element.
   * @param {number} starAvg - The average star rating.
   * @return {HTMLElement} - The star rating element.
   */
  function generateStar(starAvg) {
    let star = gen('label');
    let starIcon = gen('span');
    let divStarsOuter = gen('div');
    let divStarsInner = gen('div');
    const five = 5;
    const ten = 10;
    const hundred = 100;
    const starPercentage = (starAvg / five) * hundred;
    const starPercentageRounded = `${Math.round(starPercentage / ten) * ten}%`;
    divStarsInner.style.width = starPercentageRounded;
    divStarsOuter.classList.add('stars-outer');
    divStarsInner.classList.add('stars-inner');
    divStarsOuter.appendChild(divStarsInner);
    starIcon.appendChild(divStarsOuter);
    star.style.display = 'inline-block';
    starIcon.style.display = 'inline-block';
    star.textContent = `${starAvg}`;
    star.appendChild(starIcon);
    return star;
  }

  /**
   * Searches for products based on the search input.
   */
  function search() {
    let inputContent = id('search-input').value.trim();
    fetch('/get-items?search=' + inputContent)
      .then(statusCheck)
      .then(res => res.json())
      .then(showSearchResults)
      .catch(handleError);
  }

  /**
   * Displays search results on the page.
   * @param {Array} res - The array of search results.
   */
  function showSearchResults(res) {
    let itemSections = qsa('#products-list section');
    // id('list-view-btn').classList.add('hidden');
    // id('grid-view-btn').classList.add('hidden');
    const idList = res.map(item => item.item_id);
    itemSections.forEach(section => {
      let sectionId = parseInt(section.id);
      if (!idList.includes(sectionId)) {
        section.classList.add('hidden');
      } else {
        section.classList.remove('hidden');
      }
    });
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
   * Selects all elements that match the given CSS selector.
   * @param {string} selector - The CSS selector.
   * @return {NodeList} - A NodeList of matching elements.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
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

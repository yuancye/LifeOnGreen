'use strict';

const express = require('express');
const multer = require('multer');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

/**
 * https://www.npmjs.com/package/multer
 * https://medium.com/swlh/how-to-upload-image-using-multer-in-node-js-f3aeffb90657
 * Configure Multer storage
 */
const storage = multer.diskStorage({
  /**
   * Specifies the destination directory for uploaded files.
   * @param {Object} req - The HTTP request object.
   * @param {Object} file - The file object that is being uploaded.
   * @param {Function} cb - A callback function to specify the destination directory.
   */
  destination: function(req, file, cb) {
    cb(null, 'public/imgs/uploads');
  },

  /**
   * Specifies the filename for uploaded files with a timestamp.
   * @param {Object} req - The HTTP request object.
   * @param {Object} file - The file object that is being uploaded.
   * @param {Function} cb - A callback function to specify the filename.
   */
  filename: function(req, file, cb) {
    const timestampedFilename = `${Date.now()}-${file.originalname}`;
    cb(null, timestampedFilename);
  }
});

let upload = multer({storage: storage});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const FOUR_HUNDRED = 400;
const FIVE_HUNDRED = 500;

/**
 * API end point definitions
 */
app.post('/registration', multer().none(), register);
app.post('/login', multer().none(), login);
app.post('/list-item', upload.single('image'), listItem);
app.post('/update-inventory', multer().none(), updateInventory);
app.post('/payment', multer().none(), savePayment);
app.post('/save-transaction', multer().none(), saveTransaction);
app.post('/signup-activity', multer().none(), signupActivity);
app.get('/category', fetchCategory);
app.get('/get-items', getItems);
app.get('/get-items/filter', filterItems);
app.get('/get-items/:id', getSingleItem);
app.get('/get-address/:username', getAddress);
app.get('/get-transactions', getTransactions);
app.get('/get-listed-items', getListedItems);

/**
 * POST endpoint to sign up the logged in user for an activity.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function signupActivity(req, res) {
  if (req.cookies.username) {
    let {username, activity} = req.body;
    if (username && activity) {
      let query = `INSERT INTO ActivitySignUp (username, activity_name) VALUES (?, ?)`;
      let db;
      try {
        db = await getDBConnection();
        await db.run(query, [username, activity]);
        res.type('text').send(`Successfully signed up for ${activity}!`);
      } catch (err) {
        res.type('text').status(FIVE_HUNDRED)
          .send('Server error: ' + err.message);
      } finally {
        if (db) {
          await db.close();
        }
      }
    } else {
      res.type('text').status(FOUR_HUNDRED)
        .send('Please provide both username and activity.');
    }
  } else {
    res.type('text').status(FOUR_HUNDRED)
      .send('Please log in first.');
  }
}

/**
 * POST endpoint to get the listed items by the logged in user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getListedItems(req, res) {
  let username = req.cookies.username;
  if (username) {
    let query = `SELECT item_name, img_path, available_quantity,
    price FROM Item WHERE seller_name = ?`;
    let db;
    try {
      db = await getDBConnection();
      let results = await db.all(query, [username]);
      if (results && results.length > 0) {
        res.json(results);
      } else {
        res.type('text').status(FOUR_HUNDRED)
          .send('No items found.');
      }
    } catch (err) {
      res.type('text').status(FIVE_HUNDRED)
        .send('Server error: ' + err.message);
    } finally {
      if (db) {
        await db.close();
      }
    }
  } else {
    res.type('text').status(FOUR_HUNDRED)
      .send('Please log in first.');
  }
}

/**
 * Handles the request to get transactions for the logged in user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getTransactions(req, res) {
  let username = req.cookies.username;
  if (username) {
    let query = queryGenerator();
    let db;
    try {
      db = await getDBConnection();
      let results = await db.all(query, [username]);
      if (results && results.length > 0) {
        let transactions = formatTransactions(results);
        res.json(transactions);
      } else {
        res.type('text').status(FOUR_HUNDRED)
          .send('No transactions found.');
      }
    } catch (err) {
      res.type('text').status(FIVE_HUNDRED)
        .send('Server error: ' + err.message);
    } finally {
      if (db) {
        await db.close();
      }
    }
  } else {
    res.type('text').status(FOUR_HUNDRED)
      .send('Please log in first.');
  }
}

/**
 * Query for the transactions.
 * @returns {string} The SQL query string.
 */
function queryGenerator() {
  return `
      SELECT T.transaction_id, T.buy_timestamp AS date, T.total_cost AS amount,
             I.item_name, I.img_path, I.price
      FROM Transactions T
      JOIN Purchasement P ON T.transaction_id = P.transaction_id
      JOIN Item I ON P.item_id = I.item_id
      WHERE T.buyer_name = ?
      ORDER BY T.transaction_id, I.item_name
    `;
}

/**
 * Formats the transaction results into JSON format.
 * @param {Object[]} results - The transaction results.
 * @returns {Object} The formatted transactions.
 */
function formatTransactions(results) {
  let transactions = {};
  results.forEach(row => {
    if (!transactions[row['transaction_id']]) {
      transactions[row['transaction_id']] = {
        date: row.date,
        amount: row.amount,
        items: []
      };
    }
    transactions[row['transaction_id']].items.push({
      itemName: row['item_name'],
      imgPath: row['img_path'],
      price: row.price
    });
  });
  return transactions;
}

/**
 * POST endpoint to handle the user registration process.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function register(req, res) {
  let data = req.body;
  res.type('text');
  let db;
  try {
    let usernameExists = await isUserNameExists(data.username);
    if (usernameExists) {
      res.status(FOUR_HUNDRED).send('Username already exists.');
    } else if (data.password === data['password-confirmation']) {
      db = await getDBConnection();
      let query = `INSERT INTO User (username, password, first_name,
        last_name, email, street, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      let params = [data.username, data.password, data['first-name'],
      data['last-name'], data.email, data.street, data.state, data.zip];
      try {
        await db.run(query, params);
        res.send(`User registered for + ${data.username}`);
      } catch (err) {
        res.status(FOUR_HUNDRED).send('This email has already linked to a username.');
      }
    } else {
      res.status(FOUR_HUNDRED).send('Password does not match.');
    }
  } catch (err) {
    res.status(FIVE_HUNDRED).send(`Server error: ${err.message}`);
  } finally {
    if (db) {
      await db.close();
    }
  }
}

/**
 * POST endpoint to handles the user login process.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function login(req, res) {
  let input = req.body;
  res.type('text');
  let db;
  try {
    let usernameExists = await isUserNameExists(input.username);
    if (usernameExists) {
      db = await getDBConnection();
      let query = `SELECT COUNT(*) as count FROM User WHERE username = ? and password = ?`;
      let row = await db.get(query, [input.username, input.password]);
      if (row && row.count === 1) {
        let expiryDate = new Date();
        const expireLength = 30;
        expiryDate.setDate(expiryDate.getDate() + expireLength);
        res.cookie('username', input.username, {expires: expiryDate});
        res.send('Success');
      } else {
        res.status(FOUR_HUNDRED).send('Username and password do not match.');
      }
    } else {
      res.status(FOUR_HUNDRED).send('Username does not exist.');
    }
  } catch (error) {
    res.status(FIVE_HUNDRED).send('Server error: ' + error.message);
  } finally {
    if (db) {
      await db.close();
    }
  }
}

/**
 * POST endpoint to handles the process of listing an item for sale for the loggedin user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function listItem(req, res) {
  let username = req.cookies.username;
  res.type('text');
  if (username) {
    let {itemName, description, price, availability, category} = req.body;
    let imagePath = req.file ? req.file.path : '';
    let query = `INSERT INTO Item(item_name, img_path, description, price, available_quantity,
    list_timestamp, category_name, seller_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const end = 19;
    let timestamp = new Date(Date.now()).toISOString()
      .slice(0, end)
      .replace('T', ' ');
    let params = [itemName, imagePath, description, price,
      availability, timestamp, category, username];
    let db;
    try {
      db = await getDBConnection();
      await db.run(query, params);
      res.send('Item listed successfully!');
    } catch (err) {
      res.status(FIVE_HUNDRED)
        .send('Server error: ' + err.message);
    } finally {
      if (db) {
        await db.close();
      }
    }
  } else {
    res.status(FOUR_HUNDRED)
      .send('Please log in first.');
  }
}

/**
 * POST endpoint to update the inventory for a specific item.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function updateInventory(req, res) {
  let username = req.cookies.username;
  if (username) {
    let id = parseInt(req.body.id);
    let diff = parseInt(req.body.diff);
    let selectQuery = `SELECT available_quantity FROM Item WHERE item_id = ?`;
    let updateQuery = `UPDATE Item SET available_quantity = ? WHERE item_id = ?`;
    let db;
    try {
      db = await getDBConnection();
      let result = await db.get(selectQuery, [id]);
      if (result && (result.available_quantity - diff) >= 0) {
        result['available_quantity'] -= diff;
        await db.run(updateQuery, [result['available_quantity'], id]);
        res.json(result['available_quantity']);
      } else {
        res.type('text').status(FOUR_HUNDRED)
          .send('Not Enough Inventory.');
      }
    } catch (err) {
      res.type('text').status(FIVE_HUNDRED)
        .send('Server error: ' + err.message);
    } finally {
      if (db) {
        await db.close();
      }
    }
  } else {
    res.type('text').status(FOUR_HUNDRED)
      .send('Please log in first.');
  }
}

/**
 * POST endpoint to save information during checkout.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function savePayment(req, res) {
  let input = req.body;
  if (req.cookies.username === input['username']) {
    let db;
    try {
      db = await getDBConnection();
      let transactionId = await generateTransactionId(db);
      await handleBillingAddress(input, db, transactionId);
      await handleShippingAddress(input, db, transactionId);
      await handlePaymentInfo(input, db, transactionId);
      res.json(transactionId);
    } catch (error) {
      res.type('text').status(FIVE_HUNDRED)
        .send('Server error: ' + error.message);
    } finally {
      if (db) {
        await db.close();
      }
    }
  } else {
    res.type('text').status(FOUR_HUNDRED)
      .send('Pleasae login first!');
  }
}

/**
 * Handles saving payment information during checkout.
 * @param {Object} input - The input data.
 * @param {Object} db - The database object.
 * @param {string} transactionId - The transaction ID.
 */
async function handlePaymentInfo(input, db, transactionId) {
  let query = `INSERT INTO Payments (username, transaction_id,
    payment_method, card_num, expiration_date, card_holder_name) VALUES (?, ?, ?, ?, ?, ?)`;
  await db.run(
    query,
    [input['username'],
    transactionId,
    input['payment-method'],
    input['card-number'],
    input['expiration-date'],
    input['card-holder-name']]
  );
}

/**
 * Handles saving shipping information during checkout.
 * @param {Object} input - The input data.
 * @param {Object} db - The database object.
 * @param {string} transactionId - The transaction ID.
 */
async function handleShippingAddress(input, db, transactionId) {
  if (!('mailing-address' in input)) {
    let query = `INSERT INTO BillingAddress (transaction_id,
      state, street, zip) VALUES (?, ?, ?, ?)`;
    await saveAddress(
      db,
      query,
      transactionId,
      input['street'][0],
      input['state'][0],
      input['zip'][0]
    );
  }
}

/**
 * Handles saving billing information during checkout.
 * @param {Object} input - The input data.
 * @param {Object} db - The database object.
 * @param {string} transactionId - The transaction ID.
 */
async function handleBillingAddress(input, db, transactionId) {
  if (!('billing-address' in input)) {
    let query = `INSERT INTO ShipingAddress (transaction_id,
      state, street, zip) VALUES (?, ?, ?, ?)`;
    await saveAddress(
      db,
      query,
      transactionId,
      input['street'][1],
      input['state'][1],
      input['zip'][1]
    );
  }
}

/**
 * Handles saving transaction details to server.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function saveTransaction(req, res) {
  let input = req.body;
  let db;
  if (req.cookies.username === input['username']) {
    try {
      db = await getDBConnection();
      await saveToPurchasement(db, input['transaction-id'], JSON.parse(input['item-ids']));
      let totalPrice = input['total-price'];
      if (input['buys-now'] === 'true') {
        totalPrice = await fetchPrice(db, JSON.parse(input['item-ids']));
      }
      await saveToTransaction(db, input['transaction-id'], input['username'], totalPrice);
      if (input['buys-now'] === 'true') {
        await decrementInventory(db, JSON.parse(input['item-ids']));
      }
      res.json(input['transaction-id']);
    } catch (error) {
      res.type('text').status(FIVE_HUNDRED)
        .send('Server error: ' + error.message);
    } finally {
      if (db) {
        await db.close();
      }
    }
  } else {
    res.type('text').status(FOUR_HUNDRED)
      .send('Pleasae login first!');
  }
}

/**
 * GET endpoint to retrieve the list of categories from server.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function fetchCategory(req, res) {
  let query = "SELECT DISTINCT name FROM Category";
  let db;
  try {
    db = await getDBConnection();
    let results = await db.all(query);
    if (results && results.length > 0) {
      res.json(results);
    } else {
      res.type('text').status(FOUR_HUNDRED)
        .send('No category exists.');
    }
  } catch (err) {
    res.type('text').status(FIVE_HUNDRED)
      .send('Server error: ' + err.message);
  } finally {
    if (db) {
      await db.close();
    }
  }
}

/**
 * GET endpoint to retrieve the list of items from server based on search criteria.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getItems(req, res) {
  let search = req.query.search;
  let query;
  let params = [];
  if (search) {
    query = `SELECT item_id FROM Item WHERE LOWER(item_name) LIKE ?
    OR LOWER(description) LIKE ? ORDER BY item_id`;
    params.push(`%${search.toLowerCase()}%`);
    params.push(`%${search.toLowerCase()}%`);
  } else {
    query = "SELECT item_id, item_name, img_path, available_quantity, price, seller_name FROM Item";
  }
  let db;
  try {
    db = await getDBConnection();
    let results = await db.all(query, params);
    if (results && results.length > 0) {
      res.json(results);
    } else {
      res.type('text').status(FOUR_HUNDRED)
        .send('All sold out.');
    }
  } catch (err) {
    res.type('text').status(FIVE_HUNDRED)
      .send('Server error: ' + err.message);
  } finally {
    if (db) {
      await db.close();
    }
  }
}

/**
 * GET endpoint to retrieve the list of items from server based on filter criteria.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function filterItems(req, res) {
  let category = req.query.category;
  let price = req.query.price;
  let query = generateFilterQuery(category, price);
  let db;
  try {
    db = await getDBConnection();
    let results = await db.all(query);
    if (results && results.length > 0) {
      res.json(results);
    } else {
      res.type('text').status(FOUR_HUNDRED)
        .send('No matching items.');
    }
  } catch (err) {
    res.type('text').status(FIVE_HUNDRED)
      .send('Server error: ' + err.message);
  } finally {
    if (db) {
      await db.close();
    }
  }
}

/**
 * SQL query for filtering items based on category and price.
 * @param {string} category - The category to filter by.
 * @param {string} price - The price to filter by.
 * @returns {string} The SQL query string.
 */
function generateFilterQuery(category, price) {
  let query = `SELECT item_id FROM Item`;
  let conditions = [];
  if (category) {
    conditions.push(`Item.category_name = '${category}'`);
  }
  if (price) {
    conditions.push(`Item.price <= ${price}`);
  }
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  return query;
}

/**
 * GET endopoint to retrieve a single item from server based on item ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getSingleItem(req, res) {
  let id = req.params.id;
  if (id) {
    let query = `SELECT item_id, item_name, img_path, description,
    price, available_quantity, seller_name FROM Item WHERE item_id = ?`;
    let db;
    try {
      db = await getDBConnection();
      let results = await db.get(query, [id]);
      if (results) {
        res.json(results);
      } else {
        res.type('text').status(FOUR_HUNDRED)
          .send('All items are sold out.');
      }
    } catch (err) {
      res.type('text').status(FIVE_HUNDRED)
        .send('Server error: ' + err.message);
    } finally {
      if (db) {
        await db.close();
      }
    }
  } else {
    res.type('text').status(FOUR_HUNDRED)
      .send('Item does not exist.');
  }
}

/**
 * GET endpoint to retrieve the address of a user based on their username.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getAddress(req, res) {
  let username = req.params.username;
  let query = `SELECT street, state, zip FROM User WHERE username = ?`;
  let db;
  try {
    db = await getDBConnection();
    let result = await db.get(query, [username]);
    if (result) {
      res.json(result);
    } else {
      res.type('text').status(FOUR_HUNDRED)
        .send('Login first!');
    }
  } catch (err) {
    res.type('text').status(FIVE_HUNDRED)
      .send('Server error: ' + err.message);
  } finally {
    if (db) {
      await db.close();
    }
  }
}

/**
 * Checks if a username already exists in the server.
 * @param {string} username - The username to check.
 * @returns {Promise<boolean>} True if the username exists, otherwise false.
 * @throws {Error} If there is a database error.
 */
async function isUserNameExists(username) {
  try {
    let db = await getDBConnection();
    let query = 'SELECT COUNT(*) as count FROM User WHERE username = ?';
    let row = await db.get(query, [username]);
    await db.close();
    return row.count > 0;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Saves an address to server.
 * @param {Object} db - The database object.
 * @param {string} query - The SQL query string.
 * @param {string} transactionId - The transaction ID.
 * @param {string} street - The street address.
 * @param {string} state - The state address.
 * @param {string} zip - The zip code.
 * @throws {Error} If there is a database error.
 */
async function saveAddress(db, query, transactionId, street, state, zip) {
  try {
    await db.run(query, [transactionId, street, state, zip]);
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Generates a random ID.
 * @returns {string} The generated ID.
 */
function generateRandomID() {
  const stringBase = 36;
  const end = 10;
  let timestamp = Date.now().toString(stringBase);
  let randomString = Math.random().toString(stringBase)
    .substring(2, end);
  let confirmationNumber = timestamp + randomString;
  return confirmationNumber;
}

/**
 * Generates a unique transaction ID.
 * @param {Object} db - The database object.
 * @returns {String} The generated transaction ID.
 * @throws {Error} If there is a database error.
 */
async function generateTransactionId(db) {
  let isUnique = false;
  let transactionID;
  while (!isUnique) {
    transactionID = generateRandomID();
    let query = `SELECT COUNT(*) AS count FROM Transactions WHERE transaction_id = ?`;
    try {
      let result = await db.get(query, [transactionID]);
      if (result.count === 0) {
        isUnique = true;
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  return transactionID;
}

/**
 * Saves the purchasement details to the database.
 * @param {Object} db - The database object.
 * @param {string} transactionId - The transaction ID.
 * @param {Object} itemIds - The item IDs and their quantities.
 * @throws {Error} If there is a database error.
 */
async function saveToPurchasement(db, transactionId, itemIds) {
  let query = `INSERT INTO Purchasement (transaction_id, item_id, quality) VALUES (?, ?, ?)`;
  for (let [item, quantity] of Object.entries(itemIds)) {
    try {
      await db.run(query, [transactionId, parseInt(item), parseInt(quantity)]);
    } catch (err) {
      throw new Error(err);
    }
  }
}

/**
 * Saves the transaction details to the database.
 * @param {Object} db - The database object.
 * @param {string} transactionId - The transaction ID.
 * @param {string} name - The buyer's name.
 * @param {number} totalPrice - The total price of the transaction.
 * @throws {Error} If there is a database error.
 */
async function saveToTransaction(db, transactionId, name, totalPrice) {
  let query = `INSERT INTO Transactions (transaction_id,
    buyer_name, buy_timestamp, total_cost) VALUES (?, ?, ?, ?)`;
  try {
    const end = 19;
    let timestamp = new Date(Date.now()).toISOString()
      .slice(0, end)
      .replace('T', ' ');
    await db.run(query, [transactionId, name, timestamp, totalPrice]);
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Decrements the inventory for the purchased items.
 * @param {Object} db - The database object.
 * @param {Object} itemIds - The item IDs and their quantities.
 * @throws {Error} If there is a database error.
 */
async function decrementInventory(db, itemIds) {
  let selectQuery = `SELECT available_quantity FROM Item WHERE item_id = ?`;
  let updateQuery = `UPDATE Item SET available_quantity = ? WHERE item_id = ?`;
  for (let item in itemIds) {
    try {
      let result = await db.get(selectQuery, [parseInt(item)]);
      result['available_quantity'] -= 1;
      await db.run(updateQuery, [result['available_quantity'], parseInt(item)]);
    } catch (err) {
      throw new Error(err);
    }
  }
}

/**
 * Retrieve the price of the purchased items.
 * @param {Object} db - The database object.
 * @param {Object} itemIds - The item IDs and their quantities.
 * @returns {Promise<number>} The total price of the items.
 * @throws {Error} If there is a database error.
 */
async function fetchPrice(db, itemIds) {
  let selectQuery = `SELECT price FROM Item WHERE item_id = ?`;
  for (let item in itemIds) {
    try {
      let result = await db.get(selectQuery, [parseInt(item)]);
      return result.price;
    } catch (err) {
      throw new Error(err);
    }
  }
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'fp.db',
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));

const PORT_NUM = 8000;
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);
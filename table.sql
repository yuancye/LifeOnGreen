CREATE TABLE IF NOT EXISTS User (
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  street TEXT,
  state TEXT,
  zip TEXT,
  PRIMARY KEY(username)
);

CREATE TABLE IF NOT EXISTS Category (
  name TEXT NOT NULL,
  PRIMARY KEY(name)
);

CREATE TABLE IF NOT EXISTS Item (
  item_id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_name TEXT NOT NULL,
  img_path TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  available_quantity INTEGER NOT NULL,
  list_timestamp DATETIME NOT NULL,
  category_name TEXT,
  seller_name TEXT NOT NULL,
  FOREIGN KEY (seller_name) REFERENCES User(username) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (category_name) REFERENCES Category(name) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Transactions (
  transaction_id TEXT PRIMARY KEY,
  buyer_name TEXT NOT NULL,
  buy_timestamp DATETIME NOT NULL,
  total_cost REAL NOT NULL,
  FOREIGN KEY (buyer_name) REFERENCES User(username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Purchasement (
  transaction_id TEXT NOT NULL,
  item_id INT NOT NULL,
  quality INT NOT NULL DEFAULT 1,
  PRIMARY KEY(transaction_id, item_id),
  FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (item_id) REFERENCES Item(item_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Payments (
  username TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  card_num INT NOT NULL,
  expiration_date TEXT NOT NULL,
  card_holder_name TEXT NOT NULL,
  PRIMARY KEY(transaction_id, username),
  FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (username) REFERENCES User(username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS ShipingAddress (
  transaction_id TEXT NOT NULL,
  street TEXT,
  state TEXT,
  zip TEXT,
  PRIMARY KEY(transaction_id),
  FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS BillingAddress (
  transaction_id TEXT NOT NULL,
  street TEXT,
  state TEXT,
  zip TEXT,
  PRIMARY KEY(transaction_id),
  FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS ActivitySignUp (
  username TEXT NOT NULL,
  activity_name NOT NULL,
  PRIMARY KEY (username, activity_name),
  FOREIGN KEY (username) REFERENCES User (username) ON DELETE CASCADE ON UPDATE CASCADE
);
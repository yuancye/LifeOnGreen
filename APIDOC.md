# *Life On Green* API Documentation
The Life On Green API provides a set of endpoints to manage user accounts, items, categories, and transactions within the Life On Green platform. The API handles user registration, login, item listing, deletion, fetching items and categories, and managing user carts and transactions. Below are the detailed specifications for each endpoint, including request formats, example requests and responses, and error handling.

# General Information
All requests will return an HTTP error code of 400 (Invalid request) or 500 (Server Error) if there is something wrong with the data processing. Error messages will be returned as plain text.

# Endpoints

## *registration*
**Request Format:** */registration*

**Request Type:** *POST*

**Returned Data Format**: Plain Text

**Description:** *Create a new user.*

**Example Request:** *http://localhost:8000/registration*

**Example Response:**

```
"User registered for ' + `${username}`"
```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 400: "Password does not match.",
2. 500: "Username already exists.".
        "This email has already liked to a username."
        "Server error: ' + `${err.message}".
```

## *login*
**Request Format:** */login*

**Request Type:** *POST*

**Returned Data Format**: Plain Text

**Description:** *Log in an existing user to Life On Green.*

**Example Request:** *http://localhost:8000/login*

**Example Response:**

```
Upon success log in. User will be redirected to the user page where user can list product, buy product.
```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 400: "Username and password do not match.",
        "Username does not exist.".
2. 500: "Server error: ' + `${err.message}".
```

## *list item*
**Request Format:** */list-item*

**Request Type:** *POST*

**Returned Data Format**: Plain Text

**Description:** *List item for a loggin user to Life On Green.*

**Example Request:** *http://localhost:8000/list-item*

**Example Response:**

```
"Item listed successfully!"
```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 500: "Server error: ' + `${err.message}".
```




## *update inventory*
**Request Format:** */update-inventory*

**Request Type:** *POST*

**Returned Data Format**: JSON

**Description:** *update a specific item inventory.*

**Example Request:** *http://localhost:8000/update-inventory*

**Example Response:**

```
{
  120
}
```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 400 : "Not Enough Inventory".
          "Please log in first.".
2. 500: "Server error: ' + `${err.message}".
```

## *save payment information during checkout*
**Request Format:** */payment*

**Request Type:** *POST*

**Returned Data Format**: JSON

**Description:** *save the payment information to the database once success.*

**Example Request:** *http://localhost:8000//payment*

**Example Response:**

```
{
  lwu8z4vimbuapde1
}
```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 400 : "Please log in first.".
2. 500: "Server error: ' + `${err.message}".
```

## *save successsful transaction*
**Request Format:** */save-transaction*

**Request Type:** *POST*

**Returned Data Format**: JSON

**Description:** *save transaction detailed information to the database.*

**Example Request:** *http://localhost:8000//payment*

**Example Response:**

```
{
  lwu8z4vimbuapde1
}
```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 400 : "Please log in first.".
2. 500: "Server error: ' + `${err.message}".
```

## *fetch category*
**Request Format:** */category*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *fetch the category from the category table to display the category option for the user.*

**Example Request:** *http://localhost:8000/categoery*

**Example Response:**

```
category : [
  { name: 'Art' },
  { name: 'Books' },
  { name: 'Electronics' },
  { name: 'Home & Garden' },
  { name: 'Other' },
  { name: 'Sporting Goods' },
  { name: 'Toys' }
]
```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 500: "Server error: ' + `${err.message}".
```

## *get all products or products matching the search criteria *
**Request Format:** */get-items*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description 1:** *fetch all the products in the Item table to display in the products page.*

**Example Request 1:** *http://localhost:8000/get-items*

**Example Response 1:**

```
{items : [
  {
    item_id: 7,
    item_name: 'Happy Hollow',
    img_path: 'public/imgs/uploads/1716009445043-happy-hollow.png',
    price: 5,
    seller_name: 'yuanchaoye'
  },
  {
    item_id: 8,
    item_name: 'Loofah Sponge',
    img_path: 'public/imgs/uploads/1716010313876-loofah-sponge.png',
    price: 5.63,
    seller_name: 'yuanchaoye'
  },
  {
    item_id: 9,
    item_name: 'Reusable Paper Towels ',
    img_path: 'public/imgs/uploads/1716011546291-reusable-paper-towels.png',
    price: 5,
    seller_name: 'yuanchaoye'
  }
]
}
```

**Description 2:** *If the search condition is included in the request, only item_id that matches the search condition will be returned *

**Example Request 2:** *http://localhost:8000/get-items/?search=happy*

**Example Response 2:**

```
[
  {
    "item_id": 1
  },
  {
    "item_id": 7
  }
]
```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 400: "All sold out." if no product in the Item table.
2. 500: "Server error: ' + `${err.message}".
```

## *get single product desctiption*
**Request Format:** */get-items/:id*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *fetch all the information about the given item_id from Item table to display in the itemdetails page.*

**Example Request:** *http://localhost:8000/get-items/7*

**Example Response:**

```
{
  "item_id": 7,
  "item_name": "Happy Hollow",
  "img_path": "public/imgs/uploads/1716968274874-happy-hollow.png",
  "description": "this is an art that is made with recycle materials.",
  "price": 5,
  "available_quantity": 10,
  "seller_name": "yuanchaoye"
}
```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 400: "Item does not exist.".
        "All items are sold out".
2. 500: "Server error: ' + `${err.message}".
```

## *filter products based on the filter cretieria*
**Request Format:** */get-items/filter*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *fetch all the products from Item table that satisfies the filter conditions and display filter results.*

**Example Request:** *http://localhost:8000/get-items/filter/?category=Art&price=10*

**Example Response:**

```
[
  {
    "item_id": 5
  },
  {
    "item_id": 7
  },
  {
    "item_id": 11
  }
]

```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 400: "No matching items."
2. 500: "Server error: ' + `${err.message}".
```



## *get a specific user's address*
**Request Format:** */get-address/:username*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *fetch user's address from User table.*

**Example Request:** *http://localhost:8000/get-address/yuanchaoye*

**Example Response:**

```
{
  "street": "somewhere in the earch",
  "state": "wa",
  "zip": "98109"
}
```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 400: "Login first!"
2. 500: "Server error: ' + `${err.message}".
```

## *save the transaction upon successful payment*
**Request Format:** */get-transactions*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *save transaction.*

**Example Request:** *http://localhost:8000/get-transactions*

**Example Response:**

```
{
  "lwu8z4vimbuapde1": {
    "date": "2024-05-31 05:32:22",
    "amount": 60,
    "items": [
      {
        "itemName": "Refillable Unscented Vegan Shampoo + Conditioner 16oz",
        "imgPath": "public/imgs/uploads/unscented-shampoo-cond.png",
        "price": 60
      }
    ]
  },
  "lwu91xev44ea325d": {
    "date": "2024-05-31 05:34:32",
    "amount": 196.23,
    "items": [
      {
        "itemName": "Moroccan Shopping Basket",
        "imgPath": "public/imgs/uploads/shopping-basket.png",
        "price": 48.75
      },
      {
        "itemName": "Refillable Glass Cleaning Spray Bottle",
        "imgPath": "public/imgs/uploads/spray-bottle.png",
        "price": 9.99
      },
      {
        "itemName": "White Eco Dryer Balls",
        "imgPath": "public/imgs/uploads/white-eco-dryer-balls.png",
        "price": 30
      }
    ]
  },
  "lwvr3khi863i7zrp": {
    "date": "2024-06-01 06:47:28",
    "amount": 146.25,
    "items": [
      {
        "itemName": "Moroccan Shopping Basket",
        "imgPath": "public/imgs/uploads/shopping-basket.png",
        "price": 48.75
      }
    ]
  },
  "lwx1kesihqhuyjh4": {
    "date": "2024-06-02",
    "amount": 46.17,
    "items": [
      {
        "itemName": "Bamboo Toothbrush - Adult",
        "imgPath": "public/imgs/uploads/bamboo-toothbrush.png",
        "price": 4.89
      },
      {
        "itemName": "Fluoride Free Peppermint Toothpaste",
        "imgPath": "public/imgs/uploads/davids_peppermint.png",
        "price": 10.5
      }
    ]
  },
  "lwx1otqx2vt5h6r0": {
    "date": "2024-06-02",
    "amount": 35.99,
    "items": [
      {
        "itemName": "Plastic-Free Toilet Brush",
        "imgPath": "public/imgs/uploads/toilet-brush.png",
        "price": 35.99
      }
    ]
  }
}
```

**Error Handling:**
*Error message will be returned as a plain text*
```
1. 400: "Please log in first."
        "No transactions found."
2. 500: "Server error: ' + `${err.message}".
```


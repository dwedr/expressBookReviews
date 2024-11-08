const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username) {
        if(password)
        {
        // Check if the user does not already exist
            if (!isValid(username)) {
                // Add the new user to the users array
                users.push({"username": username, "password": password});
                return res.status(200).json({message: "User successfully registered. Now you can login"});
            } else {
                return res.status(404).json({message: "User already exists!"});
            }
        }  
        return res.status(404).json({message: "User password not provided."});
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "User name not provided."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(users, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const result = [];
    for(var key in books)
    {
        if(books[key]["author"] == author)
        result.push(books[key]);
    }
    return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const result = [];
    for(var key in books)
    {
        if(books[key]["title"] == title)
        result.push(books[key]);
    }
    return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn]["reviews"]);
});

module.exports.general = public_users;

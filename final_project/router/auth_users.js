const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const book_reviews = books[req.params.isbn]["reviews"];
    if(req.session.authorization.username in book_reviews)
    {
        book_reviews[req.session.authorization.username] = req.query.review;
        return res.status(200).send("Successfully changed your review!");
    }
    book_reviews[req.session.authorization.username] = req.query.review;
    return res.status(200).send("Successfully added a review!");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const book_reviews = books[req.params.isbn]["reviews"];
    if(!(req.session.authorization.username in book_reviews))
    {
        return res.status(404).json({ message: "You haven't posted a review yet!" });
    }
    delete book_reviews[req.session.authorization.username];
    return res.status(200).send("Successfully deleted your review!");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

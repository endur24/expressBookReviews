const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
	return user.username === username
  });
  if(userswithsamename.length > 0){
	return true;
  } else {
	return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
	if (!doesExist(username)) { 
	  users.push({"username":username,"password":password});
	  return res.status(200).json({message: "User successfully registred. Now you can login"});
	} else {
	  return res.status(404).json({message: "User already exists!"});    
	}
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  const getBooks = new Promise((resolve,reject)=>{
	  try {
		resolve(JSON.stringify(books, null, 4));
	  } catch(err) {
		reject(err)
	  }
  });

  getBooks.then(
	(data) => {
	  console.log(data)
	  return res.status(300).json({message: data});
	},
	(err) => {
	  return res.status(500).json({message: "An error occured"});
	}
  )

  //return res.status(300).json({message: JSON.stringify(books, null, 4)});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  // const details = books[isbn]
  // return res.status(300).json({message: details});

  const getBook = new Promise((resolve,reject)=>{
	  try {
		resolve(books[isbn]);
	  } catch(err) {
		reject(err)
	  }
  });

  getBook.then(
	(data) => {
	  console.log(data)
	  return res.status(300).json({message: data});
	},
	(err) => {
	  return res.status(500).json({message: "An error occured"});
	}
  )


 });



// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author

  const getBook = new Promise((resolve,reject)=>{
	try {

	  var details = {}
	  for (var key in books) {
		if (books[key]['author'] === author) {
		  details = books[key]
		  return res.status(300).json({message: details});

		}

	  }

	  resolve(details);
	} catch(err) {
	  reject(err)
	}
  });

  getBook.then(
	(data) => {
	  console.log(data)
	  return res.status(300).json({message: data});
	},
	(err) => {
	  return res.status(500).json({message: "An error occured"});
	}
  )

  // return res.status(400).json({message: "Author not found"});

});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  
  const title = req.params.title

  const getBook = new Promise((resolve,reject)=>{
	try {

		var details = {}
		for (var key in books) {
		  if (books[key]['title'] === title) {
			details = books[key]
			return res.status(200).json({message: details});
	  
		  }
	  
		}

	  resolve(details);
	} catch(err) {
	  reject(err)
	}
  });

  getBook.then(
	(data) => {
	  console.log(data)
	  return res.status(300).json({message: data});
	},
	(err) => {
	  return res.status(500).json({message: "An error occured"});
	}
  )

  //return res.status(400).json({message: "Title not found"});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	//Write your code here
	const isbn = req.params.isbn
	const reviews = books[isbn]['reviews']
	return res.status(300).json({message: reviews});
});

module.exports.general = public_users;

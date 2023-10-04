// Import required modules
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const routes = require('./router/friends.js')

// Initialize an empty array to store user data
let users = []

// Function to check if a user exists
const doesExist = (username)=>{
  // Initialize an empty list to store users with the same username
  let userswithsamename = users.filter((user)=>{
    // Loop through each user in the users array
    // The loop iterates over each user in the array to compare usernames
    return user.username === username
  });

  // Check if there are any users in the userswithsamename array
  if(userswithsamename.length > 0){
    return true; // If there are users with the same name, return true
  }
  
  else {
    return false; // If no users with the same name, return false
  }
}

// Function to check if a user is authenticated
const authenticatedUser = (username, password)=>{
  
  let validusers = users.filter((user)=>{ // Loop through each user in the users array
    // Add the user to the validUsers list
    // Check if the current user's username and password match the provided values
    return (user.username === username && user.password === password) 
  });

  // Check if there are any valid users in the validUsers list
  if(validusers.length > 0){
    // A valid user with the provided username and password exists
    return true;
  } 
  else {
    // No valid user with the provided username and password exists
    return false;
  }
}

// Create an instance of the Express application
const app = express();

// Configure session middleware
app.use(session({secret:"fingerpint"}, resave=true, saveUninitialized=true));

// Use JSON parsing for incoming requests
app.use(express.json());

// Middleware to handle authentication for friends routes
app.use("/friends", function auth(req,res,next){
  // Check if the authorization session exists in the request
  if(req.session.authorization) {
    // Retrieve the access token from the session
    token = req.session.authorization['accessToken'];

    // Verify the JWT token
    jwt.verify(token, "access",(err,user)=>{
      // If verification is successful, set the user in the request
      if(!err){
        req.user = user;
        // Continue to the next middleware or route handler
        next();
      }
        else{
        // If verification fails, return a 403 Forbidden response
        return res.status(403).json({message: "User not authenticated"})
      }
    });
  } 
    
  else {
    // If no authorization session exists, return a 403 Forbidden response
    return res.status(403).json({message: "User not logged in"})
  }
});

// Use the defined routes for "/friends" path
app.use("/friends", routes);

// Route to handle user login
app.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
    
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  }

  else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Route to handle user registration
app.post("/register", (req,res) => {
  // Extract username and password from the request body
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided in the request
  if (username && password) {
    // Check if the user already exists using a function doesExist()
    if (!doesExist(username)) { 
      // If user doesn't exist, add them to the 'users' array
      users.push({"username":username,"password":password});
      // Respond with a success message and status code 200
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } 
    else {
      // If user already exists, respond with an error message and status code 404
      return res.status(404).json({message: "User already exists!"});    
    }
  } 

  // If either username or password is missing, respond with an error message and status code 404
  return res.status(404).json({message: "Unable to register user."});
});

// Set the port for the server to listen on
const PORT = 5000;

// Start the Express server
app.listen(PORT,()=>console.log("Server is running"));
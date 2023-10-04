// Import required modules
const express = require('express');
const routes = require('./routes/users.js');
const jwt = require('jsonwebtoken');
const session = require('express-session')

// Create an instance of the express application
const app = express();
// Set the port number for the server
const PORT = 5000;

// Use sessions for storing user authentication data
app.use(session({secret:"fingerpint",resave: true, saveUninitialized: true}))

// Use JSON parsing middleware
app.use(express.json());

// Middleware to check if the user is authenticated
app.use("/user", (req,res,next)=>{
    // Check if the user's session contains authorization data
    if(req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token
        
        // Verify the access token using JWT
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.user = user; // Store user data in the request
                next(); // Proceed to the next middleware or route
            }
            // If verification fails, user is not authenticated
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
            });
        // If no authorization data in session, user is not logged in
        } else {
            return res.status(403).json({message: "User not logged in"})
        }
});

// Use the user routes for "/user" endpoints
app.use("/user", routes);

// Handle user login
app.post("/login", (req,res) => {
    // Get user data from the request body
    const user = req.body.user;
    if (!user) {
        // If no user data provided, respond with an error
        return res.status(404).json({message: "Body Empty"});
    }

    // Create an access token using JWT and the "access" secret
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });

      // Store the access token in the user's session for future authentication
      req.session.authorization = {
        accessToken
    }

    // Respond with a success message
    return res.status(200).send("User successfully logged in");
});

// Start the server and log a message when it's running
app.listen(PORT,()=>console.log("Server is running at port "+PORT));
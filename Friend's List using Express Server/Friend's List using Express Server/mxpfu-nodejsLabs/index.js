// Import the required express module and user routes module
const express = require('express');
const routes = require('./routes/users.js');

// Create an instance of the express application
const app = express();

// Set the port number for the server
const PORT=5000;

// Use JSON parsing middleware
app.use(express.json());
// Use the user routes for the "/user" endpoint
app.use("/user", routes);

// Start the server and log a message when it's running
app.listen(PORT,()=>console.log("Server is running at port "+PORT));
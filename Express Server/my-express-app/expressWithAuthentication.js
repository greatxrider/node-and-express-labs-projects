const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const PORT = 5000;
const cors = require('cors'); 

let users = [];

// Function to check if the user exists
const doesExist = (username) => {
  return users.some((user) => {
    return user.username === username;
  });
};

// Function to check if the user is authenticated
const authenticatedUser = (username, password) => {
  return users.some((user) => {
    return user.username === username && user.password === password;
  });
};

const app = express();

app.use(cors());

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5000',  // Replace with your front-end's domain
    methods: 'GET,POST',
    credentials: true  // Allow sending cookies and headers
  }));

app.use(
  session({
    secret: "fingerpint",
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/register", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (doesExist(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

app.post("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid login credentials" });
  }
});

app.use("/auth", function auth(req, res, next) {
    // Check if the user is authenticated
    if (req.session.authorization && req.session.authorization.accessToken) {
      const token = req.session.authorization.accessToken;
      jwt.verify(token, "access", (err, user) => {
        if (!err) {
          req.user = user; // Set the authenticated user's information in the req object
          next(); // Continue to the next middleware or route handler
        } else {
          return res.status(403).json({ message: "User not authenticated" });
        }
      });
    } else {
      return res.status(403).json({ message: "User not logged in" });
    }
  });

app.get("/auth/get_message", (req, res) => {
  return res.status(200).json({ message: "Hello, You are an authenticated user. Congratulations!" });
});

app.listen(PORT, () => console.log("Server is running on port", PORT));

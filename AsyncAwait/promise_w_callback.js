// Import the axios library for making HTTP requests
const axios = require('axios');

const connectToURL = (url)=>{ // Define a function to connect to a given URL
// Make a GET request to the provided URL using axios
  const req = axios.get(url);
// Log the request object
  console.log(req);

// Use a promise to handle the response data
  req.then(resp => {
    // Extract the list of entries from the response data
      let listOfEntries = resp.data.entries;

      // Loop through each entry in the list
      listOfEntries.forEach((entry)=>{
        // Log the Category of the entry
        console.log(entry.Category);
      });
    })

  .catch(err => {
    // If an error occurs, log the error message
      console.log(err.toString())
  });
}
// Log a message before calling the connectToURL function
console.log("Before connect URL")

// Call the connectToURL function with the provided URL
connectToURL('https://api.publicapis.org/entries');

// Log a message after calling the connectToURL function
console.log("After connect URL")
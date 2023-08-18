// Import the axios library for making HTTP requests
const axios = require('axios');

// Define an asynchronous function to connect to a given URL
const connectToURL = async(url)=>{
    // Make a GET request to the provided URL using axios
    const outcome = axios.get(url);

    // Wait for the outcome of the request and extract the list of entries from the response data
    let listOfEntries = (await outcome).data.entries;

    // Loop through each entry in the list
    listOfEntries.forEach((entry)=>{
        
      // Log the Category of the entry
      console.log(entry.Category);
    });
}

// Log a message before calling the connectToURL function
console.log("Before connect URL")

// Call the asynchronous connectToURL function with the provided URL
connectToURL('https://api.publicapis.org/entries');

// Log a message after calling the connectToURL function
console.log("After connect URL")
// Import the axios library for making HTTP requests
const axios = require('axios');

// Define a function to connect to a given URL
const connectToURL = (url)=>{
    // Make a GET request to the provided URL using axios
    const req = axios.get(url);

    // Use promises to handle the response data
    req.then(resp => {
        // Extract the list of entries from the response data
        let listOfEntries = resp.data.entries;

        // Create a list of categories by mapping the Category property of each entry
        return listOfEntries.map((entry)=>{
            return entry.Category
        })

        // Remove duplicates from the list of categories
        }).then((categories)=>{
        let Categories = categories.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })

            // Loop through each unique category
            Categories.forEach((category)=>{
                const req = axios.get("https://api.publicapis.org/entries?Category="+category);

                // Handle the response data for the category request
                req.then(resp=>{

                    // Log the category and the count of entries in that category
                    console.log(category+" - "+resp.data.count);

                // Handle any errors that occur while fetching category-specific data
                }).catch(err => {
                    
                })
            });
        })

    // Handle any errors that occur while fetching initial data
    .catch(err => {
        console.log(err.toString())
    });
}

// Call the connectToURL function with the provided URL
connectToURL('https://api.publicapis.org/entries');
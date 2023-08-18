// Import the axios library for making HTTP requests
const axios = require("axios");

// Define an asynchronous function to connect to a given URL
async function connectToURL(url) {
  // Use await to make a GET request to the provided URL using axios
  const resp = await axios.get(url);

  // Extract the list of entries from the response data
  let listOfEntries = resp.data.entries;

  // Create a list of categories by mapping the Category property of each entry
  let Categories = listOfEntries.map((entry) => {
    return entry.Category;
  });

  // Remove duplicates from the list of categories
  Categories = [...new Set(Categories)];

  // Loop through each category in the unique list of categories
  Categories.forEach(async (Category) => {
    // Check if the category starts with "A"
    if (Category.startsWith("A")) {
      // Use await to make a GET request for entries in the current category
      try {
        const resp = await axios({
          method: "get",
          url: "https://api.publicapis.org/entries?Category=" + Category,
          responseType: "json",
        });

        // Log the category and the count of entries in that category
        console.log(Category + "   " + resp.data.count);
      } catch (e) {
        // Log any errors that occur while fetching category-specific data
        console.log(e);
      }
    }
  });
}

// Call the asynchronous connectToURL function with the provided URL
connectToURL("https://api.publicapis.org/entries").catch((err) => {
  console.log(err.toString());
});

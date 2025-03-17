# How to Run the Website

This website needs to be run through a web server to properly load CSV data and other resources. The error "Failed to load projects data: Failed to fetch" appears when you open the HTML files directly in your browser without using a server.

## Option 1: Using the included Node.js server (Recommended)

1. Make sure you have [Node.js](https://nodejs.org/) installed on your computer
2. Open a command prompt or terminal
3. Navigate to the website folder:
   ```
   cd "c:\Users\bibas\2025-03-16\pro website with data _ 2\Sample website"
   ```
4. Run the server:
   ```
   node server.js
   ```
5. Open your web browser and go to:
   ```
   http://localhost:3000
   ```

## Option 2: Using the local HTML files (Limited functionality)

If you cannot or don't want to run the server, use the "-local" HTML files which have hardcoded data:

- Open `index-local.html` instead of `index.html`
- Open `projects-local.html` instead of `projects.html`

Note: These versions will not display dynamic data from the CSV files.

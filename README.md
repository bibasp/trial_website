# Nepal Infrastructure Projects Website

## Running Locally

If you're experiencing issues loading the CSV data when opening the HTML files directly in a browser, it's likely due to CORS (Cross-Origin Resource Sharing) restrictions that browsers enforce for security.

### Quickest Solution: Run start-server.bat

The easiest way to start the server is to double-click the `start-server.bat` file included with this website. It will automatically:

1. Check if you have Node.js installed and use it if available
2. If Node.js is not found, check for Python and use it instead
3. Provide instructions if neither is available

### Manual Server Options

If the batch file doesn't work, here are the manual server options:

#### Option 1: Using Python

If you have Python installed:

1. Open a command prompt or terminal
2. Navigate to the website folder:
   ```
   cd path\to\Sample website
   ```
3. Run one of these commands:
   - Python 3: `python -m http.server 8000`
   - Python 2: `python -m SimpleHTTPServer 8000`
4. Open your browser and go to `http://localhost:8000`

#### Option 2: Using Node.js

If you have Node.js installed:

1. Install the `http-server` package globally:
   ```
   npm install -g http-server
   ```
2. Navigate to the website folder and run:
   ```
   http-server
   ```
3. Open your browser and go to the displayed URL (usually `http://localhost:8080`)

#### Option 3: Using Visual Studio Code

If you use VS Code:

1. Install the "Live Server" extension
2. Right-click on index.html and select "Open with Live Server"

## Folder Structure

- `/css` - Stylesheets and JavaScript files
- `/data` - CSV and Markdown data files
- `/js` - Main JavaScript files
- `/images` - Image assets

## Troubleshooting

If you're still having issues loading the CSV data:

1. Check that the file exists at `data/nepal_projects.csv`
2. Ensure the file has the correct permissions
3. Check the browser console for specific error messages

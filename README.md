# Portfolio

## How to run this locally

Since this project consists of static HTML, CSS, and JS files, you can run it locally without any complex build steps.

### Method 1: Using VS Code Live Server
1. Open the project folder in Visual Studio Code.
2. Install the "Live Server" extension by Ritwick Dey.
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. The site will automatically open in your default browser.

### Method 2: Open directly in browser
The simplest way to view the site is to just double-click the `index.html` file in your file explorer, which will open it in your default web browser. Note that some advanced JavaScript features might be restricted by CORS policy when using the `file://` protocol.

### Method 3: Using Python HTTP Server (Command Line)
If you have Python installed, you can start a simple local web server:
1. Open a terminal and navigate to the project directory.
2. Run the command: `python3 -m http.server 8000` (or `python -m SimpleHTTPServer 8000` for Python 2).
3. Open your browser and go to `http://localhost:8000`.
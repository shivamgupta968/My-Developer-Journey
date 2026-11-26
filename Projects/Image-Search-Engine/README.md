# Image Search Engine

A responsive image discovery app built with HTML, CSS, and vanilla JavaScript. Features live Unsplash API search, debounced input, responsive masonry-style gallery, lightbox navigation, download link, loading/empty/error states, and a demo gallery when no API key is configured.

## Run in VS Code

### Quick start (recommended)
1. Extract the ZIP.
2. Open the `Image-Search-Engine` folder in VS Code.
3. Install the **Live Server** extension.
4. Right-click `index.html` → **Open with Live Server**.

### From Windows PowerShell
```powershell
cd "$HOME\Downloads\Image-Search-Engine"
code .
```
Then in VS Code, right-click `index.html` and choose **Open with Live Server**.

You can also launch the file directly:
```powershell
Start-Process "$HOME\Downloads\Image-Search-Engine\index.html"
```

## Enable live image search (Unsplash)
1. Create an Unsplash developer account and register an application at https://unsplash.com/developers.
2. Copy your **Access Key**.
3. Open `script.js`, replace:
   ```js
   const ACCESS_KEY = '';
   ```
   with your key:
   ```js
   const ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';
   ```
4. Save, then refresh the page through Live Server.

**Security note:** This frontend demo stores the key in browser-delivered JavaScript. For a public production deployment, proxy API requests through a backend and keep the key server-side.

## Features
- Keyword search and quick search chips
- Debounced search (550ms)
- Unsplash REST API using `fetch` and async/await
- Dynamic gallery and lazy-loaded images
- Lightbox with previous/next keyboard navigation
- Download/open image link
- Responsive layout
- Loading state, empty result state, and readable API errors
- Demo gallery without an API key

## Project structure
- `index.html` — semantic page structure
- `style.css` — responsive dark theme and gallery layout
- `script.js` — API, debounce, rendering, modal and error handling

## Technologies
HTML5 · CSS3 · JavaScript ES6+ · Fetch API · REST API · Unsplash

## Submission notes
Repository URL: add your GitHub repository after uploading this folder.
Live Demo: deploy using GitHub Pages (Settings → Pages → Deploy from branch → `main` → `/root`) or Netlify/Vercel.

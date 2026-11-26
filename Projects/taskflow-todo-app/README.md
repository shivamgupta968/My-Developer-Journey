# TaskFlow — To-Do List App

A responsive task management app built with **HTML, CSS, and vanilla JavaScript**. It supports Create, Read, Update, Delete (CRUD), completion status, filters, search, theme switching, and browser LocalStorage persistence.

## 1. Environment setup

Install:
- [Visual Studio Code](https://code.visualstudio.com/)
- [Google Chrome](https://www.google.com/chrome/)
- [Git](https://git-scm.com/downloads)

Node.js is **not required** because this project uses plain HTML, CSS, and JavaScript (no build tools or packages).

Verify Git in the VS Code terminal:

```powershell
git --version
```

Optional: install the **Live Server** extension in VS Code for a local development server.

## 2. Create/open the project

Open PowerShell terminal in VS Code (`Terminal > New Terminal`) and run:

```powershell
cd $HOME\Desktop
mkdir todo-list-app
cd todo-list-app
code .
```

If you are using this downloaded ZIP, extract it first and open the extracted `todo-list-app` folder in VS Code. The project files are:
- `index.html` — page structure
- `style.css` — layout, colors, responsive styles and animations
- `script.js` — CRUD logic, event handling, filters, search and LocalStorage

## 3. Run locally

No install or build command is needed.

**Option A — Live Server**
1. Install the Live Server extension.
2. Open `index.html`.
3. Right-click and choose **Open with Live Server**.

**Option B — Browser**
Open `index.html` directly in Chrome. LocalStorage works for this simple static app, but Live Server is recommended while developing.

## 4. Feature walkthrough

1. **Create:** enter a task and press Enter or click Add task.
2. **Read:** tasks are rendered in the list and the counters update.
3. **Update:** click the pencil icon, edit the task, and save.
4. **Complete:** select the checkbox to toggle complete/active.
5. **Delete:** click × and confirm.
6. **Filter:** choose All, Active, or Completed.
7. **Search:** type into Search tasks.
8. **Persistence:** refresh the page; tasks remain because they are stored in `localStorage`.
9. **Theme:** use the sun/moon button to switch between dark and light themes.
10. **Clear completed:** remove all completed tasks after confirmation.

## 5. Manual testing checklist

- [ ] Add a task with text.
- [ ] Try adding whitespace only (it should not add a task).
- [ ] Add several tasks.
- [ ] Edit a task and save the change.
- [ ] Cancel editing and confirm the original text remains.
- [ ] Mark a task completed and mark it active again.
- [ ] Check All, Active, and Completed filters.
- [ ] Search for a task by part of its text.
- [ ] Delete a task and cancel a deletion once.
- [ ] Clear completed tasks.
- [ ] Refresh the page and confirm tasks persist.
- [ ] Switch themes, refresh, and confirm the selected theme persists.
- [ ] Test at a narrow/mobile browser width.

## 6. GitHub upload (PowerShell commands)

Create a **new empty repository** on GitHub named `todo-list-app`. Do not add a README there because this folder already contains one.

In the VS Code terminal, from inside the project folder:

```powershell
git init
git add .
git commit -m "Build TaskFlow to-do list app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/todo-list-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. If Git asks you to identify yourself, configure your name/email:

```powershell
git config --global user.name "Your Name"
git config --global user.email "YOUR_EMAIL"
```

If you make changes later:

```powershell
git add .
git commit -m "Improve task list app"
git push
```

## 7. Deploy with Vercel

1. Push the project to GitHub first.
2. Sign in at [Vercel](https://vercel.com/) using GitHub.
3. Select **Add New → Project** and import `todo-list-app`.
4. Framework preset: **Other**.
5. Build command: leave empty.
6. Output directory: leave empty (the project root contains `index.html`).
7. Click **Deploy**.
8. Copy the generated production URL and open it to test the live app.

Alternative: GitHub Pages can also host this static site. In the repository, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.

## 8. Internship submission

Fill the portal fields with your real URLs:

- **Repository URL:** `https://github.com/YOUR_USERNAME/todo-list-app`
- **Live Demo URL:** the actual URL Vercel gives you (optional field)
- **Attachment:** optionally upload this project ZIP (under the portal's 10 MB limit)
- **Notes / Implementation Remarks:** use the sample below only after testing the listed features.

Suggested implementation remarks:

> Implemented a responsive To-Do List Web Application using HTML5, CSS3, and vanilla JavaScript. Features include adding, viewing, editing, deleting, and completing tasks; filtering by All, Active, and Completed; task search; dark/light theme switching; and persistent task/theme storage using browser LocalStorage. Tested CRUD operations, validation, filters, and persistence across page refreshes.

## 9. Important concepts to explain

- **DOM manipulation:** selecting, creating, updating and removing page elements.
- **Event handling:** form submit, button clicks, checkbox changes and input events.
- **CRUD:** Create, Read, Update, Delete.
- **Array methods:** `map`, `filter`, `find`, `unshift`.
- **LocalStorage:** `setItem`, `getItem`, `JSON.stringify`, `JSON.parse`.
- **Responsive CSS:** media queries and flexible layouts.

## Project structure

```text
todo-list-app/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Notes

- Tasks are stored only in the current browser/device profile. They do not sync across devices or users.
- Clearing browser site data can remove saved tasks.
- No backend or account system is included; those are outside the supplied task requirements.

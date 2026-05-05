# 🎓 Our Engineering Journey — College Memories Web App

A premium digital memory book for your college batch. Built with pure HTML, CSS, and JavaScript.

## 📁 File Structure

```
college-memories/
├── index.html      → Main HTML shell
├── style.css       → All styling (dark theme, animations)
├── script.js       → Dynamic rendering, modal, music, scroll effects
├── data.json       → ✏️  YOUR CONTENT GOES HERE
└── README.md
```

## ✏️ Customizing Your Memories

Open `data.json` and edit:

1. **`meta`** — College name, branch, batch years, and the personal message
2. **`years[]`** — Each year block has:
   - `label`, `period`, `emoji`, `color`, `theme`, `description`
   - `memories[]` — Array of photo/video items

### Adding a Photo
```json
{
  "id": "unique-id",
  "type": "image",
  "src": "https://your-image-url.jpg",
  "caption": "Your caption here.",
  "date": "Month Year",
  "tags": ["tag1", "tag2"]
}
```

### Adding a Video
```json
{
  "id": "unique-id",
  "type": "video",
  "src": "https://www.youtube.com/embed/VIDEO_ID",
  "caption": "Your video caption.",
  "date": "Month Year",
  "tags": ["video", "tag"]
}
```

### Using Local Images
Put images in an `images/` folder and reference them as:
```json
"src": "images/photo1.jpg"
```

## 🚀 Deployment (GitHub Pages)

1. Create a new GitHub repository
2. Upload all files to the repo root
3. Go to **Settings → Pages → Source → main branch**
4. Your site will be live at `https://yourusername.github.io/repo-name/`

## 🖥️ Running Locally

You need a local server (not `file://`) for `fetch('data.json')` to work:

```bash
# Option 1: Python
python3 -m http.server 8080

# Option 2: Node.js
npx serve .

# Option 3: VS Code
Install "Live Server" extension → Right-click index.html → Open with Live Server
```

Then open `http://localhost:8080`

## 🎵 Background Music

The music toggle uses an external MP3 URL. To use your own:
1. Upload an `.mp3` file to your repo (e.g., `music/memories.mp3`)
2. In `index.html`, update the `<source src="...">` inside `<audio id="bg-music">`

## 🎨 Customization Tips

- **Change accent color**: Edit `--accent` in `style.css` `:root`
- **Change year colors**: Edit `"color"` field in each year in `data.json`
- **Adjust animation speed**: Edit transition durations in `style.css`

---

Made with ❤️ for an unforgettable batch.

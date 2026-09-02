# 💕 Romantic Apology & Date Website

A beautiful, interactive romantic website built with HTML, CSS & vanilla JavaScript.
Deployable directly to **GitHub Pages** — no backend required.

---

## 📁 Project Structure

```
Love project/
├── index.html          ← Main entry point
├── style.css           ← All styling & animations
├── script.js           ← All interactivity & logic
├── assets/
│   ├── photos/         ← PUT YOUR PHOTOS HERE
│   │   ├── photo1.jpg  ← Page 1 (Apology) background
│   │   ├── photo2.jpg  ← Page 2 (Date Question) background
│   │   ├── photo3.jpg  ← Page 3 (Date Choice) background
│   │   ├── photo4.jpg  ← Page 4 (Final "I Love You") background
│   │   └── photo5.jpg  ← Extra (optional)
│   └── audio/
│       └── music.mp3   ← Optional background music
└── README.md
```

---

## 🖼️ Adding Your Photos

1. Place your photos inside `assets/photos/`
2. Name them `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `photo4.jpg` (and optionally `photo5.jpg`)
3. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
4. If your filenames are different, edit the `CONFIG.photos` array in `script.js`

---

## 🎵 Adding Music (Optional)

1. Place a romantic `.mp3` file at `assets/audio/music.mp3`
2. The music toggle button (🎵) appears in the top-right corner
3. Music does NOT autoplay (browser policy) — she must click the button
4. The site works perfectly without music

---

## 🚀 Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `love-website`)
2. Push this entire folder to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit 💕"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/love-website.git
   git push -u origin main
   ```
3. Go to **Settings → Pages** in your GitHub repository
4. Under **Source**, select `main` branch and `/ (root)` folder
5. Click **Save**
6. Your site will be live at: `https://YOUR_USERNAME.github.io/love-website/`

---

## ⚙️ Customization (script.js CONFIG)

Open `script.js` and edit the `CONFIG` object at the top:

| Setting | Description |
|---|---|
| `photos` | Array of photo filenames |
| `yesGrowthPerClick` | How fast the "Yes" button grows per "No" click |
| `noMessages` | Playful messages shown when "No" is clicked |
| `steakMessages` | Extra Bengali toast sub-messages |
| `toastDuration` | How long the Bengali toast stays visible (ms) |

---

## 💖 Flow

```
Apology Page → Forgiveness → Date Question → Date Choice → "I Love You" 🎉
```

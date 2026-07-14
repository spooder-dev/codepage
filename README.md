# 🌸 Birthday Surprise — Kish

A pixel-RPG style "enter your birthday" unlock page that redirects to your Canva surprise:
`https://suprisejustbecause.my.canva.site/page-2`

## How it works
1. The chibi character types out a greeting, letter by letter.
2. Kish taps digits (MMDD) on the pixel keypad — each digit fills a heart.
3. Correct code (**0319**) → celebration burst, "Let's go..." unlock sequence, fade to white, redirect to the Canva site.
4. Wrong code → dialogue box shakes, character reacts, hearts reset.

## Files
```
birthday-surprise/
├── index.html      ← page structure
├── style.css       ← pixel/cherry-blossom theme, all colors & animations
├── script.js       ← game logic (typing, keypad, unlock sequence)
├── images/         ← drop your assets in here (see below)
└── audio/
    └── click.mp3   ← optional keypad click sound
```

## Adding your images
Drop files into `images/` using these exact names and everything will pick them up automatically:

| File | Used for |
|---|---|
| `background.png` | Full scene background |
| `chibi.gif` | Animated character beside the dialogue box |
| `dialogue-box.png` | Optional texture behind the textbox (page already looks complete without it) |

No image? No problem — the page has a built-in CSS "fallback" scene (gradient sky, pixel trees, hearts/petals/sparkles) so it works and looks finished even before you add assets.

## Changing things later
Everything you'll want to tweak lives at the very top of **`script.js`**, in the `CONFIG` object:

```js
const CONFIG = {
  BIRTHDAY_CODE: "0319",   // change the unlock code here
  CANVA_URL: "https://suprisejustbecause.my.canva.site/page-2", // change destination here
  ...
  DIALOGUE: { ... }        // edit any of the greeting/wrong/correct lines here
};
```

Colors live at the top of **`style.css`** under `:root`, so re-theming is just editing 6 hex values.

## Deploying to GitHub Pages
1. Create a new GitHub repo and upload this whole `birthday-surprise/` folder (or push it via git).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save — GitHub will give you a URL like `https://yourusername.github.io/birthday-surprise/`.
5. Send that link to Kish 💖

No build step, no dependencies — it's plain HTML/CSS/JS, so it'll just work.

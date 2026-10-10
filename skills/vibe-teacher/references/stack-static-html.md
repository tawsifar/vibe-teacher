# Stack pack: plain HTML, CSS and JavaScript (static sites)

## What it is (5 lines)

> A **static site** is a set of files the browser downloads and shows as-is, with no server code.
> **HTML** is the structure (headings, buttons), **CSS** the style, **JavaScript** the behaviour (clicks).
> The browser itself is the **runtime**: it runs your JavaScript.
> There's no backend, so nothing secret can be kept safe in these files: everyone can read them.
> You can host it free on GitHub Pages, Netlify, Vercel or Cloudflare Pages.

## Typical layout

| Path | Job |
|---|---|
| `index.html` | The home page and front door |
| `about.html`, `contact.html` | Other pages |
| `css/style.css` / `style.css` | Colours, fonts, layout |
| `js/script.js` / `script.js` / `app.js` | Clicks, animations, fetching data |
| `images/` / `assets/` | Pictures, icons, fonts |

## How it works

```
Browser --GET /index.html--> host sends the file
        --GET style.css, script.js, images--> host sends them too
        script.js runs in the browser: reacts to clicks, maybe fetch()es a public API
```

Forms on static sites need an outside service (Formspree, Netlify Forms) or they go nowhere.

## Common beginner mistakes

| Mistake | Why it hurts | Fix idea |
|---|---|---|
| API key inside `script.js` | Every visitor can copy it | Use a serverless function (Netlify/Vercel) to hold the key |
| `innerHTML` with user or API text | XSS risk | Use `textContent` or create elements |
| Huge uncompressed images | Slow site, data costs on phones | Resize + compress (WebP), add `loading="lazy"` |
| No `<meta name="viewport">` | Tiny text on phones | Add the viewport meta tag |
| Fixed pixel widths | Breaks on mobile | Flexbox/grid + media queries |
| Missing `alt` on images | Screen readers can't describe them; worse SEO | Add short `alt` text |
| Copy-pasted header on every page | Edits must be repeated everywhere | A small JS include or a static site generator later |
| Inline `onclick="..."` everywhere | Hard to maintain | `addEventListener` in the JS file |

## Scoring notes

Static sites have no server, so skip backend security items (validation, auth, SQL).
Focus on: exposed keys, XSS, accessibility, performance (images), readability and docs.
Testing expectations are low; a tiny prototype gets the size-scaling discount.

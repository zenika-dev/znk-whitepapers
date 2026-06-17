# znk-whitepapers

Static landing page for Zenika's technical whitepapers. No build step — plain HTML, CSS, and vanilla JS.

## Where is it

Deployed to [whitepaper.zenika.sg](https://whitepaper.zenika.sg) subdomain. any PRs merged to main will automatically deploy to this subdomain.

## What it does

- Renders a card grid of whitepapers from a JS catalogue (`whitepapers.js`)
- EN / FR language toggle (Bootstrap dropdown + flag-icons)
- Download modal: collects name, company, email, and consent, posts to a Google Apps Script endpoint, then opens the PDF from Google Drive
- Cookie consent banner

## Stack

| Layer | Tech |
|---|---|
| UI | Bootstrap 5.3, Inter (Google Fonts), flag-icons |
| i18n | Custom `t()` / `data-i18n` mini-system (`i18n.js`, `translations.js`) |
| Backend | Google Apps Script (logs leads to a Sheet) |
| Hosting | Static — serve `public/` from any CDN or host |

## Project structure

```
public/
  index.html
  assets/
    css/style.css
    js/
      translations.js   # EN + FR string maps
      i18n.js           # t() helper, applyTranslations(), setLanguage()
      whitepapers.js    # Whitepaper catalogue + locale data
      main.js           # Modal logic, form submit, Google Drive download
    images/
```

## Adding a whitepaper

In [whitepapers.js](public/assets/js/whitepapers.js), add an entry to `WHITEPAPERS`:

```js
{
  id: 'my-whitepaper',        // used as a CSS/i18n key
  locales: {
    en: { title: '…', topic: '…', summary: '…', fileId: '<Google Drive file ID>' },
    fr: { title: '…', topic: '…', summary: '…', fileId: '<Google Drive file ID>' },
  },
}
```

The card renders automatically; no other changes needed.

## Adding a translation string

Add the key/value to both `en` and `fr` objects in [translations.js](public/assets/js/translations.js), then reference it with `data-i18n="your.key"` in HTML or `t('your.key')` in JS.

## Backend (Google Apps Script)

The form POSTs to the URL in `APPS_SCRIPT_URL` ([main.js:2](public/assets/js/main.js#L2)). The script should accept `firstName`, `lastName`, `company`, `email`, and `consent` fields and append them to a Sheet. After a successful POST the page opens `https://docs.google.com/uc?export=download&id=<fileId>` in a new tab.

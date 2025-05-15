# chatgpt-favourites-bookmarklet

A bookmarklet that lets you save ChatGPT messages as favourites.

## Features

- ⭐ Instantly mark or unmark any ChatGPT assistant message as a favourite, right inside the chat.
- 📑 View all your favourites in a grouped, searchable panel—messages are grouped by conversation for easy browsing.
- ⬇️ Export your favourites as a `.json` backup file at any time.
- ⬆️ Import favourites from a backup or another device (intelligent merge, so nothing is overwritten or lost).
- 🔎 One-click jump: Instantly scrolls and highlights your favourite message in the original conversation.
- 🖥️ All data is stored on your device (browser localStorage). No server, no account, totally private and portable.

## Why?
OpenAI's ChatGPT doesn’t (yet) let users bookmark or “star” important messages. If you reference great AI answers, research, or code often—or just want to keep the gold without sifting through endless chats—this tool is for you.

## Installation

1. **Copy the code:**
   - Get the latest version of the bookmarklet code from [`bookmarklet.js`](bookmarklet.js) in this repository.

2. **Add to your bookmarks bar:**
   - Create a new bookmark (right-click bookmarks bar → Add page).
   - Name it `ChatGPT Favourites` (or whatever you like).
   - Paste the full code from [`bookmarklet.js`](bookmarklet.js) into the URL/location field (starting with `javascript:`).

3. **Usage:**
   - Open a ChatGPT conversation.
   - Click the bookmarklet. Stars will appear next to every assistant message.  
   - Click any star to favourite or unfavourite a message.
   - Click the floating ⭐ **Favourites** button (top right) to open your panel, jump to, export, or import favourites.

## Export/Import

- **Export:** Click the ⬇️ Export button in the Favourites panel to download all favourites as a JSON file.
- **Import:** Click ⬆️ Import, select a previously exported file. Imported messages will be merged with your existing favourites (the newest version of each is kept; no duplicates).

## Navigating to Favourites

- When you use the jump-to feature on a favourite **within the same conversation page**, the message will scroll into view and be highlighted immediately.
- **If you navigate to a favourite conversation from the panel (or via a bookmark):**
  - You must click the bookmarklet again on the newly loaded page to activate it.
  - Then, open the favourites panel and click the favourite message again to scroll and highlight it.
- *This is a limitation of bookmarklets—they only act on the currently loaded page and do not persist across navigation automatically.*

## Limitations & Notes

- **Data is stored per-browser.** For full sync across devices, use the export/import feature.
- **Privacy:** All data is stored locally. No servers, no data leaves your device.
- **Resilience:** If OpenAI changes ChatGPT’s internal HTML, this tool may require a selector update.
- **Bookmarklet, not Extension:** This is a zero-install “run anywhere” solution. If you want cloud sync or more features, consider porting to a browser extension.

## Contributing

PRs welcome! Feature requests, bug reports, and UI ideas are appreciated—just open an issue or pull request.

## License

MIT

## Credits

Created by Francis Szakacs.

---

## Bookmarklet Code

You can always find the latest code in [`bookmarklet.js`](bookmarklet.js) in this repository.

Paste the contents of that file (all one line, starting with `javascript:`) into a new bookmark’s URL field.

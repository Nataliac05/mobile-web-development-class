# Assignment 7 — Behind the Curtain

A React + Daisy UI web app. Press the button under the red curtains and your recorded
phrase plays through a [Tuna](https://github.com/Theodeus/tuna) **Tremolo** effect. When the
recording ends, the curtains part to reveal your edited newspaper photo and the computer
says "It is done" in the voice you chose.

- **Pages:** Home, Settings, About, Help (hash routes: `#/settings`, `#/about`, `#/help`)
- **Themes:** Dark, Light, The Hunger Games, Twilight (`src/themes.css`, listed in `data/settings.json`). The two film themes use a background picture from `assets/images/themes/`.
- **Fonts:** Bungee Shade for the page title and Big Shoulders Display for everything else (`assets/fonts/`, SIL Open Font License)
- **Languages:** English and Spanish (`data/textEnglish.json`, `data/textSpanish.json`)
- **Settings page:** theme, language, computer voice (with a test button), and tremolo intensity / rate / stereo phase. Choices are remembered in the browser.

## Media

- `assets/audio/enigma.mp3` - the recorded phrase (`audio.soundFile` in `data/settings.json`)
- `assets/images/newspaper.jpg` - the edited newspaper photo shown behind the curtains (`audio.revealImage`)

## Layout

```
assets/   audio/, images/, video/, fonts/
data/     settings.json, textEnglish.json, textSpanish.json
deploy/   production build (generated; upload this to Firebase)
docs/     person.js (coding exercise), untracked/ (git-ignored)
lib/      react, react-dom, tuna, daisyui (vendored copies)
scripts/  build.mjs, dev.mjs
src/      React source (JSX), styles and themes
```

## Commands

```bash
npm install        # installs esbuild (the only dev dependency)
npm run dev        # http://localhost:8000 with live rebuilds
npm run build      # compile + minify into deploy/, stamps buildMode/appVersion
npm run preview    # serve deploy/ locally to check the production build
npm run deploy     # build, then firebase deploy (needs `firebase login` and `firebase use <project>`)
```

The build bundles and minifies `src/` with esbuild, minifies the Daisy UI stylesheet, copies
`lib/`, `assets/` and `data/`, and in the deployed `settings.json` sets `buildMode` to
`release` and stamps `appVersion` with the build time.

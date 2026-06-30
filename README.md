# Rain Networks site

A single-page static marketing site for Rain Networks. It runs on Railway as
its own tiny Node service. The Claude CMS is only used later, when you want to
edit copy or images, it does not host this site.

## What is in here

- `index.html` ........ the whole site (one comprehensive page, anchor nav)
- `server.js` ......... zero-dependency static server (serves this folder)
- `package.json` ...... `npm start` -> `node server.js`
- `Rain.jpg`, `RainNetworksVideo.mp4`, `ai_*.jpg`, etc. ... all assets, local

All asset paths are relative and the assets sit beside `index.html`, so the
folder works as one self-contained unit.

## Run it locally

    npm start
    # open http://localhost:3000

(No dependencies to install. Needs Node 18+.)

## Deploy to Railway

1. Push this folder to GitHub.
2. In Railway: New Project -> Deploy from GitHub repo -> pick this repo.
3. Railway auto-detects Node, runs `npm start`, and injects `PORT`.
   `server.js` reads `process.env.PORT`, so no config is needed.
4. Railway gives you a public URL. That is the live site.

That is all it takes to "work on Railway", it is a normal Node web service.

## Editing later in the Claude CMS

This site does not live in the CMS. When you want to edit it:

1. In the CMS dashboard: Add a website -> paste the live Railway URL
   (ingest BY URL, not by pasting raw HTML). The ingester rewrites every
   relative asset path into an absolute URL against your Railway host, so
   images and the video resolve correctly inside the CMS.
2. Because it is a single page, ONE ingest makes the entire site editable
   (click any text or image, or use the chat). A multi-page version would
   only let the CMS ingest the home page, this avoids that limitation.
3. Edit, publish, and copy the result back if you want it in this repo.

## The hero video

The hero is a real `<video>` (`RainNetworksVideo.mp4`) so it plays on the live
site. To swap it later, replace the file, or switch the hero to a
YouTube/Vimeo embed (add `data-cms-embed` to the iframe to make the embed URL
editable in the CMS). The poster image (`hero_city_storm.jpg`) is the
CMS-editable image slot.

## Section anchors (top nav)

#solutions, #why-rain, #vendors, #contact . These work because the site is
served from a domain root. (If this HTML were ever published THROUGH the CMS
at /live/<name>/, the CMS injects <base href="/"> and anchors would need the
/live/<name> prefix, but that is not how you are hosting this.)
# ws-rain-networks-v2

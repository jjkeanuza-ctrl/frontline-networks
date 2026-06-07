# Frontline Networks — Website

Official website for Frontline Networks gaming community.

## Structure

```
frontline-networks/
├── index.html              ← Homepage
├── pages/
│   ├── about.html          ← About page
│   ├── servers.html        ← Servers + live status + categories
│   ├── store.html          ← Store packages
│   └── community.html      ← Community hub + forums preview
├── assets/
│   ├── css/
│   │   └── style.css       ← Shared stylesheet (all pages)
│   ├── js/
│   │   └── main.js         ← Shared scripts + server status checker
│   └── images/             ← Logos, favicons, etc.
└── README.md
```

## Adding Your Game Server

When your GMOD server is ready, open `assets/js/main.js` and update:

```js
const SERVER_CONFIG = {
  ip: 'YOUR_SERVER_IP',    // ← paste your server IP here
  port: 27015,              // ← your port (default 27015)
  workerUrl: null           // ← paste your Cloudflare Worker URL here
};
```

You will also need a Cloudflare Worker to act as a middleman between the site and your game server. Ask for that code when your server is ready.

## Deployment

Hosted via Cloudflare Pages — auto-deploys on every push to main branch.

**Build settings in Cloudflare:**
- Framework preset: None
- Build command: (blank)
- Build output directory: (blank)

## Discord

https://discord.gg/7fahT24btF

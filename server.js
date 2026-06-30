// Minimal zero-dependency static file server for Railway.
// Serves this folder at the port Railway provides (process.env.PORT).
// No npm dependencies, so deploys instantly.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

// Security headers on every response (fixes the audit's "zero security headers" / grade F).
// CSP is scoped to what this site actually loads: Google Fonts, the ChatDesk live-chat widget,
// the ElevenLabs voice SDK (jsdelivr + livekit/elevenlabs sockets), and YouTube embeds.
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' https://drix-chatdesk.up.railway.app https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  "media-src 'self'",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://*.elevenlabs.io",
  "connect-src 'self' https://drix-chatdesk.up.railway.app https://*.elevenlabs.io wss://*.elevenlabs.io https://*.livekit.cloud wss://*.livekit.cloud",
  "worker-src 'self' blob:",
  "form-action 'self' https://drix-chatdesk.up.railway.app",
  "upgrade-insecure-requests",
].join('; ');

function applySecurity(res) {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Content-Security-Policy', CSP);
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'microphone=(self), camera=(), geolocation=(), browsing-topics=()');
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  try {
    applySecurity(res);
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
    // Resolve safely inside ROOT (block path traversal).
    const filePath = path.join(ROOT, path.normalize(urlPath).replace(/^(\.\.[/\\])+/, ''));
    if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        // SPA-style fallback to the single page.
        return fs.readFile(path.join(ROOT, 'index.html'), (e, buf) => {
          if (e) { res.writeHead(404); return res.end('Not found'); }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(buf);
        });
      }
      const type = TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'public, max-age=3600' });
      fs.createReadStream(filePath).pipe(res);
    });
  } catch (_e) {
    res.writeHead(500); res.end('Server error');
  }
});

server.listen(PORT, () => console.log(`Rain Networks site serving on port ${PORT}`));

/**
 * Lightweight, zero-dependency local development server.
 * Fast, reliable, and works offline without downloading any npm packages.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function startServer(port) {
  const server = http.createServer((req, res) => {
    // Only accept GET and HEAD
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
      return;
    }

    // Clean URL query and hash
    let safePath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    if (safePath === '/' || safePath === '') {
      safePath = '/index.html';
    }

    // Normalize and prevent directory traversal
    const normalizedPath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(ROOT, normalizedPath);

    // If directory requested, look for index.html inside
    try {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
    } catch (_) {
      // If path doesn't exist directly, try adding .html
      if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      }
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // If resource not found, serve friendly 404 or index.html for SPA
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>404 Not Found</h2><p>Cannot find ${safePath}</p><p><a href="/">Return to Home</a></p></body></html>`);
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Server Error: ${err.code}`);
        }
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });

      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(content);
      }
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[WARN] Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[ERROR] Server failed to start:', err.message);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log('\n======================================================');
    console.log(`  🚀 Portfolio local server running!`);
    console.log(`  👉 Local:   http://localhost:${port}`);
    console.log(`  👉 Network: http://127.0.0.1:${port}`);
    console.log('======================================================\n');
  });
}

startServer(PORT);


const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 30002;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  const ext      = path.extname(filePath).toLowerCase();
  const mime     = MIME[ext] || 'application/octet-stream';

  // Range requests for video streaming
  const stat = (() => { try { return fs.statSync(filePath); } catch { return null; } })();
  if (!stat) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  if (ext === '.mp4' || ext === '.webm') {
    const range = req.headers.range;
    if (range) {
      const parts  = range.replace(/bytes=/, '').split('-');
      const start  = parseInt(parts[0], 10);
      const end    = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunk  = end - start + 1;
      const stream = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range':  `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges':  'bytes',
        'Content-Length': chunk,
        'Content-Type':   mime,
      });
      return stream.pipe(res);
    }
    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type':   mime,
      'Accept-Ranges':  'bytes',
    });
    return fs.createReadStream(filePath).pipe(res);
  }

  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n  305INJURED dev server running\n  → http://localhost:${PORT}\n`);
  console.log(`  Drop miami.mp4 into ./assets/ for the hero background video.\n`);
});

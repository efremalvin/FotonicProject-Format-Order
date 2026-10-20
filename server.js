// Local Static Server for Fotonic Web Format Order
// Node.js native server (zero external dependencies)

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  // Parse URL
  const urlPath = req.url.split('?')[0];

  // Routing rewrites (mirroring vercel.json)
  let filePath;
  if (urlPath === '/' || urlPath === '') {
    filePath = path.join(BASE_DIR, 'rental-kamera', 'index.html');
  } else if (urlPath === '/rental' || urlPath === '/rental-kamera' || urlPath === '/rental-kamera/') {
    filePath = path.join(BASE_DIR, 'rental-kamera', 'index.html');
  } else if (urlPath === '/booking' || urlPath === '/booking-foto' || urlPath === '/booking-wisuda' || urlPath === '/booking-wisuda/') {
    filePath = path.join(BASE_DIR, 'booking-wisuda', 'index.html');
  } else {
    // Normal static file resolution
    filePath = path.join(BASE_DIR, decodeURIComponent(urlPath));
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="id">
        <head><meta charset="UTF-8"><title>404 - Halaman Tidak Ditemukan</title></head>
        <body style="background:#0b0f19;color:#e2e8f0;font-family:sans-serif;padding:40px;text-align:center;">
          <h1 style="color:#ef4444;">404 - Halaman Tidak Ditemukan</h1>
          <p>Halaman yang Anda tuju tidak tersedia.</p>
          <p><a href="/rental-kamera/" style="color:#10b981;text-decoration:none;margin-right:20px;">📷 Rental Kamera</a>
             <a href="/booking-wisuda/" style="color:#a855f7;text-decoration:none;">🎓 Booking Wisuda</a></p>
        </body>
        </html>
      `);
      return;
    }

    // If directory, check for index.html
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 - Internal Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log('========================================================');
  console.log('       FOTONIC WEB FORMAT ORDER - STATIC SERVER');
  console.log('========================================================');
  console.log(`> Server aktif di  : http://localhost:${PORT}`);
  console.log(`> Rental Kamera    : http://localhost:${PORT}/rental-kamera/`);
  console.log(`> Booking Wisuda   : http://localhost:${PORT}/booking-wisuda/`);
  console.log('========================================================');
  console.log('Tekan Ctrl + C untuk menghentikan server.');
});

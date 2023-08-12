// Create web server application
// 1. Create a web server object
// 2. Create a callback function that will be called when the server is ready to handle requests
// 3. Start the web server on port 3000

// 1. Create a web server object
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const comments = require('./comments.json');

const server = http.createServer((req, res) => {
  // 2. Create a callback function that will be called when the server is ready to handle requests
  // 3. Start the web server on port 3000
  const urlObj = url.parse(req.url, true);
  const urlPathName = urlObj.pathname;
  const method = req.method;

  if (urlPathName === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
  } else if (urlPathName === '/api/comments' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comments));
  } else if (urlPathName === '/api/comments' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const comment = qs.parse(body);
      comment.id = Date.now();
      comments.push(comment);
      fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), (err) => {
        if (err) {
          console.log(err);
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(comments));
        }
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(__dirname, '404.html')).pipe(res);
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
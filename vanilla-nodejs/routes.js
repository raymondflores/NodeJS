const fs = require('fs');

const requestHandler = (req, res) => {
  const { url, method } = req;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write('<body><form action="/message" method="POST">');
    res.write('<input type="text" name="message"/> <button type="submit">Send</button>');
    res.write('</form></body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', chunk => {
      body.push(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('./vanilla-nodejs/message.txt', message, err => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My App</title></head>');
  res.write('<body><h1>Hello World</h1></body>');
  res.write('</html>');
};

module.exports = requestHandler;

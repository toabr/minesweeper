const express = require('express');
const path = require('path');

const PORT = 8080;
const HOST = '0.0.0.0';
const dir = path.join(__dirname)

const app = express();
app.use(express.static(dir + "/dist"));

app.get('/', (req, res) => {
  console.log('### reload...')
  res.sendFile(dir + '/index.html');
});


app.listen(PORT, HOST);

console.log(`Running on my http://${HOST}:${PORT}`);

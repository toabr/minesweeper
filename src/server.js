const express = require('express');
const path = require('path');

console.log('### environment:', process.env.NODE_ENV)

const PORT = 8080;
const HOST = '0.0.0.0';
let distFolder = path.join(__dirname, '..', 'dist')

// docker moves the index.js in production
if(process.env.NODE_ENV == 'production') {
    distFolder = path.join(__dirname, 'dist')
}

const app = express();
app.use(express.static(distFolder));

// all files are served from static after build

// app.get('/', (req, res) => {
//   console.log('### reload ...... ')
//   res.sendFile(distFolder + '/index.html');
// });


app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);

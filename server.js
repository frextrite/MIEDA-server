const express = require('express');
const fs = require('fs');
const app = express()
const port = 3000;

app.get('/', (req, res) => res.send('Hello, World!'))

function convertToImage(base64String) {
  fs.writeFile('image.jpg', base64String, {encoding: 'base64'}, (error) => {
    console.log(error);
  })
}

function getFileName() {
  let datetime = new Date();
  let filename = `IMG_${datetime.toISOString().replace('T', ' ').substr(0, 19)}`;
  console.log(filename);
  return filename;
}

app.listen(port, () => console.log(`Listening on port ${port}\n`))
const express = require('express');
const moment = require('moment');
const fs = require('fs');
const app = express()
const port = 3000;

app.get('/', (req, res) => res.send('Hello, World!'))

function convertToImage(base64String) {
  let filename = getFileName();
  fs.writeFile(filename, base64String, {encoding: 'base64'}, (error) => {
    console.log(error);
  })
}

function getFileName() {
  let datetime = moment().format('YYYYMMDD_HHmmss');
  let filename = `IMG_${datetime}.jpg`;
  console.log(filename);
  return filename;
}

app.listen(port, () => console.log(`Listening on port ${port}\n`))
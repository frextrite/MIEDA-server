const express = require('express');
const moment = require('moment');
const fs = require('fs');
const app = express()
const port = 3000;

// Face API Configuration
const subscriptionKey = process.env.faceAPISubscriptionKey;

const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

const params = {
  returnFaceId: true,
  returnFaceLandmarks: false,
  returnFaceAttributes: 'age, gender, smile, emotion'
};

const options = {
  uri: uriBase,
  qs: params,
  headers: {
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key' : subscriptionKey
  }
}

app.get('/', (req, res) => res.send('Hello, World!'))

function convertToImage(base64String) {
  let filename = getFileName();
  fs.writeFile(filename, base64String, {encoding: 'base64'}, (error) => {
    console.log(error);
  })
  return filename;
}

function getFileName() {
  let datetime = moment().format('YYYYMMDD_HHmmss');
  let filename = `IMG_${datetime}.jpg`;
  console.log(filename);
  return filename;
}

app.listen(port, () => console.log(`Listening on port ${port}\n`))
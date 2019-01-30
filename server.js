const express = require('express');
const moment = require('moment');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express()
const port = 3000;

app.use(bodyParser.json());

// Face API Configuration
const subscriptionKey = process.env.FACEAPISUBSCRIPTIONKEY;

const apiURL = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect';

const params = {
  returnFaceId: true,
  returnFaceLandmarks: false,
  returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,' +
                        'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};

const options = {
  params: params,
  headers: {
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key' : subscriptionKey
  }
}

app.get('/', (req, res) => res.send('Hello, World!'))
app.get('/analyze', (req, res) => {
  getEmotionData('1.jpg');
  res.send('gg');
})

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

function getEmotionData(filename) {
  // create image stream
  let image = fs.createReadStream(filename);

  // send POST request to face API
  axios.post(apiURL, image, options)
    .then((response) => {
      // response.data is an array of detected faces
      console.log(response.data[0]);
      return response;
    })
    .catch((error) => {
      console.log('Caught error', error);
    }
  );
}

app.listen(port, () => console.log(`Listening on port ${port}\n`))
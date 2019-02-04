const express = require('express');
const moment = require('moment');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');


// Init the app
const app = express()


// Configure express app
app.use(bodyParser.json());

const port = process.env.PORT;
const subscriptionKey = process.env.FACEAPISUBSCRIPTIONKEY;


// Face API Configuration
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


// Define app routes
app.get('/', (req, res) => res.send('Hello, World!'))
app.get('/analyze', (req, res) => {
  getEmotionData('1.jpg');
  res.send('gg');
})
app.post('/analyze', analyze)


// create a buffer from base64 string
function createImageBuffer(base64String) {
  let imageBuffer = new Buffer(base64String, 'base64');
  return imageBuffer;
}


// Get emotion data of the image
function getEmotionData(imageBuffer) {
  // call API and process the results
  return fetchDataFromAPI(imageBuffer).then((response) => {
    let processedResult = processResults(response);
    return processedResult;
  })
}


// Fetch data from face API
function fetchDataFromAPI(readStream) {
  // send POST request to face API
  return axios.post(apiURL, readStream, options).then((response) => {
    return response.data;
  });
}


// Process the fetched response
function processResults(someJSON) {
  console.log('I got some JSON', someJSON);
  return someJSON;
}


// '/analyze' endpoint function
function analyze(req, res) {
  /** req - [POST]
  *   body = {
  *     imageBase64: 'a base64 string of an image'
  *     source: 'web/android/ios'
  *   }
  *
  *   res - [JSON]
  *   body = {
  *     emotion: 'string indicating the emotion of the person'
  *   }
  */

  // get base64 string from the request body
  let base64String = req.body.imgBase64;

  // convert the base64 string into a buffer
  let imageBuffer = createImageBuffer(base64String);

  // get emotion data and return the response
  getEmotionData(imageBuffer).then((response) => {
    res.json(response);
  });
}


// Run the express app
app.listen(port, () => console.log(`Listening on port ${port}\n`))
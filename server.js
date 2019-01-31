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


// Convert base64 string to an Image and save it on disk
function convertToImage(base64String) {
  // get unique filename to create a temporary image
  let filename = getFileName();
  // Synchronously write image data to disk
  fs.writeFileSync(filename, base64String, {encoding: 'base64'}, (error) => {
    console.log("Error in converting base64 to an image.");
  })
  return filename;
}


// Get a unique filename based on current date and time
function getFileName() {
  // get current date/time in required format
  let datetime = moment().format('YYYYMMDD_HHmmss');
  // create a unique filename
  let filename = `IMG_${datetime}.jpg`;
  return filename;
}


// Get emotion data of the image
function getEmotionData(filename) {
  // create image stream
  let image = fs.createReadStream(filename);

  // call API and process the results
  return fetchDataFromAPI(image).then((response) => {
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
  //  req - [POST]
  //  body = {
  //    imageBase64: 'a base64 string of an image'
  //    source: 'web/android/ios'
  //  }
  //  res - JSON
  //  body = {
  //    emotion: 'string indicating the emotion of the person'
  //  }

  // get base64 string from the request body
  let base64String = req.body.imgBase64;

  // convert the base64 string into an image and get the image name
  let filename = convertToImage(base64String);

  // get emotion data and return the response
  getEmotionData(filename).then((response) => {
    res.json(response);
  });
}


// Run the express app
app.listen(port, () => console.log(`Listening on port ${port}\n`))
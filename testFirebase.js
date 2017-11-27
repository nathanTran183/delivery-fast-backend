/**
 * Created by phuct on 11/21/2017.
 */
var admin = require("firebase-admin");
var serviceAccount = require("./delivery-fast-firebase-firebase-adminsdk-2x077-6d389e6e8f.json");

var initialize = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://delivery-fast-firebase.firebaseio.com"
});
var defaultAuth = admin.auth();
var defaultDatabase = admin.database();

// var registrationToken = "f7NgmTPv4Os:APA91bFM8e4jjombV3dLctTCVfrQGgM6__tfPM1Ft0oVwMbWimlNVve3gheGh_lzU9IXHqK-58nEb5cb8wkg0WSYnj4iuiWpj6nDo8H9977YbKrdoK6B2XedBwfcqW5OG58dwoFcoHTw";
var registrationToken = "f7g8nN-dDq8:APA91bEEIEiqkWfNl4mOf6WZXy8Eie3KQvqwBq5-NV06xG-xk4SAkRWAs9D5u1QFD6eH9AUgn_ljwJmnf3MDew6z-kyUREnp5IKJTtAvhozI4TC-ts22U0eIkDmnKw2doACn1YsX48E81";
// See the "Defining the message payload" section below for details
// on how to define a message payload.
var payload = {
    notification: {
        title: "nathan tran",
        body: "$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day."
    }
};

var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().sendToDevice(registrationToken, payload, options)
    .then(function(response) {
        console.log("Successfully sent message:");
        console.log(response.results);
        return;
    })
    .catch(function(error) {
        console.log("Error sending message:", error);
    });
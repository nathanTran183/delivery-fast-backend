"use strict";

/**
 * Created by phuct on 11/25/2017.
 */
var admin = require("firebase-admin");
var serviceAccount = require("../../delivery-fast-firebase-firebase-adminsdk-2x077-6d389e6e8f.json");

var initialize = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://delivery-fast-firebase.firebaseio.com"
});

var userRegistrationToken = "f7g8nN-dDq8:APA91bEEIEiqkWfNl4mOf6WZXy8Eie3KQvqwBq5-NV06xG-xk4SAkRWAs9D5u1QFD6eH9AUgn_ljwJmnf3MDew6z-kyUREnp5IKJTtAvhozI4TC-ts22U0eIkDmnKw2doACn1YsX48E8";
var deliManRegistrationToken = "f7RnFZcsv1Q:APA91bEM9lyi286FdHcl0k03sj6jBDr7MX_wKAWOWxlvrMOOvd110XvVE9Kf_7OBi5SNFxV0b-s56rzJfddR1R786r5KwugdV5m2BmP0dRlTZkw0oRqJUhysRyhvRgmdHywl9XGAaBSS";
var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};
//noti content example
var payload = {
    notification: {
        title: "nathan tran",
        body: "$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day."
    }
};

module.exports = {
    pushNotification: function pushNotification(notiPayload, boolean) {
        var token = boolean ? userRegistrationToken : deliManRegistrationToken;
        return new Promise(function (resolve, reject) {
            admin.messaging().sendToDevice(token, notiPayload, options).then(function (response) {
                if (response.results[0].messageId) resolve("Send success! MessageId: " + response.results[0].messageId);else reject("Send message fail! Error: " + response.results[0].error);
            }).catch(function (error) {
                console.log("Error sending message:", error);
                throw error;
            });
        });
    }
};
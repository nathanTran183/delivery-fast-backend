'use strict';

/**
 * Created by nathan on 28/10/2017.
 */
var validator = require('validator');
module.exports = {
    isDate: function isDate(date) {
        return !isNaN(Date.parse(date));
    },
    isPhoneNumber: function isPhoneNumber(phone) {
        var phoneRe = new RegExp("^\\+?[0-9\\-\\()\\s]+$", 'g');
        return phoneRe.test(phone);
    },
    isLetter: function isLetter(string) {
        var strRe = new RegExp(/^[A-Za-z\s]+$/);
        return strRe.test(string);
    },
    isSpecialLetter: function isSpecialLetter(string) {
        var strRe = new RegExp(/^[A-Za-z0-9\,\.\-\'\s]+$/);
        return strRe.test(string);
    },
    isLetterNumber: function isLetterNumber(string) {
        var strRe = new RegExp(/^[0-9a-zA-Z\s]+$/);
        return strRe.test(string);
    },
    addErrorAssert: function addErrorAssert(string, errors) {
        if (errors.length > 0) {
            errors.push({ msg: string });
        } else {
            errors = [{ msg: string }];
        }
        return errors;
    }
};
/**
 * Created by nathan on 28/10/2017.
 */
const validator = require('validator');
module.exports = {
    isDate(date) {
        return !isNaN(Date.parse(date));
    },

    isPhoneNumber(phone) {
        var phoneRe = new RegExp("^\\+?[0-9\\-\\()\\s]+$", 'g');
        return phoneRe.test(phone);
    },

    isLetter(string) {
        var strRe = new RegExp(/^[A-Za-z\s]+$/);
        return strRe.test(string);
    },

    isSpecialLetter(string) {
        var strRe = new RegExp(/^[A-Za-z0-9\,\.\-\'\s]+$/);
        return strRe.test(string);
    },

    isLetterNumber(string) {
        var strRe = new RegExp(/^[0-9a-zA-Z\s]+$/);
        return strRe.test(string);
    },

    addErrorAssert(string, errors) {
        if(errors.length > 0) {
            errors.push({msg: string})
        } else {
            errors = [{msg: string}]
        }
        return errors;
    },

    // isTime(string) {
    //     var strRe = new RegExp('/^[0-9a-zA-Z]+$/');
    //     if(!strRe.test(string)){
    //         return false;
    //     } else return true;
    // }

}
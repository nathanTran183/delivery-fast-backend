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

        if (!phoneRe.test(phone)) {
            return false;
        } else return true;
    },

    isLetter(string) {
        var strRe = new RegExp('/^[A-Za-z\d\s]+$/');
        if(!strRe.test(string)){
            return false;
        } else return true;
    },

    isLetterPhone(string) {
        var strRe = new RegExp('/^[0-9a-zA-Z]+$/');
        if(!strRe.test(string)){
            return false;
        } else return true;
    },

    addErrorAssert(string, errors) {
        if(errors.length > 0) {
            errors.push({msg: string})
        } else {
            errors = [{msg: string}]
        }
    }
}
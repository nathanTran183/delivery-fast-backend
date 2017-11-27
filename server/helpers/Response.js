module.exports = {

    returnSuccess(message, data) {
        return {
            status: true,
            message: message,
            data: data
        };
    },

    returnError(message, code) {
        return {
            status: false,
            message: message,
            error: {
                code: code
            }
        };
    }

};
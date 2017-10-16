
module.exports = {
    async isAdmin(req, res, next) {
        if (req.user.role === 'Admin') {
            next();
        } else {
            return res.send(Response.returnError(HTTPStatus[HTTPStatus.UNAUTHORIZED], HTTPStatus.UNAUTHORIZED));
        }
    },

    async isUser(req, res, next) {
        if (req.user.role === 'User') {
            next();
        } else {
            return res.send(Response.returnError(HTTPStatus[HTTPStatus.UNAUTHORIZED], HTTPStatus.UNAUTHORIZED));
        }
    },

    async notUser(req, res, next) {
        if (req.user.role !== 'User') {
            next();
        } else {
            return res.send(Response.returnError(HTTPStatus[HTTPStatus.UNAUTHORIZED], HTTPStatus.UNAUTHORIZED));
        }
    }
};
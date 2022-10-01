module.exports = function (router) {
    router.get('/comic/:id', require('./index'));
};

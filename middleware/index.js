const auth = require('./auth');
const authorization = require('./authorization');
const validation = require('./validation');

module.exports = {
    ...auth,
    ...authorization,
    ...validation
};

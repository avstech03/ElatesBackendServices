const uuid = require('uuid');
const ModelCodes = require('../config/models.json');

module.exports = (modelName) => {
    let id = uuid.v1();
    return `${ModelCodes[modelName]}-${id}`;
};
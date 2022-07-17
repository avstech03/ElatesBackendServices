const ModelFactory = require("../Model/ModelFactory");
const Promise      = require("bluebird");

class HomeScreenTemplate {
    constructor() {
        this.model = ModelFactory.homescreentemplate();
    }

    createOrUpdateTemplate(template) {
        if(!template) return Promise.reject("MISSING_RESOURCE");
        return this.model.createOrUpdateTemplate(template);
    }

    getTemplate() {
        return this.model.getTemplate();
    } 
}

module.exports = {
    getInst: () => new HomeScreenTemplate(),
};
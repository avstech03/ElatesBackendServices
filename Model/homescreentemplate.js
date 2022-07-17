const BaseModel = require("./BaseModel");

class HomeScreenModel extends BaseModel {
    constructor() {
        super();
    }

    createOrUpdateTemplate(data) {
        let template = {};
        if(data.template) template.template = data.template;
        if(!data._id) {
            return this.create(template);
        } else {
            return this.findOneAndUpdate({_id: data._id}, template);
        }
    }

    getTemplate(data) {
        return this.find({})
        .then(res => res[0]);
    }
}

module.exports = {
    getInst: () => new HomeScreenModel(),
};
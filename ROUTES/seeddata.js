const config = require("../config/serverconfig.json");
const ModelFactory = require("../Model/ModelFactory");
const seeddatamodel = ModelFactory.seeddata();

const getSeedData = (req, res) => {
    return seeddatamodel.getSeedData()
    .then(response => {
        res.send(response);
    });
};

const updateSeedData = (req, res) => {
    let data = req.body;
    data._id = 'elates';
    return seeddatamodel.createdOrUpdateSeedData(data)
    .then(response => {
        res.send(response);
    });
};

module.exports = app => {
    /* ADMIN APIS */
    app.get(`${config.api.admin}/seeddata`, (req, res) => getSeedData(req, res));
    app.post(`${config.api.admin}/seeddata`, (req, res) => updateSeedData(req, res));

    /* USER APIS */
    app.get(`${config.api.user}/seeddata`, (req, res) => getSeedData(req, res));
    app.post(`${config.api.user}/seeddata`, (req, res) => updateSeedData(req, res));
}
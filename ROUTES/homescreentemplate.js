const serviceHandler = require("../Services/servicehandler").serviceHandler;
const BuilderService = require("../Service/BuilderService");
const Promise = require("bluebird");
const config = require("../config/serverconfig.json");

const createTemplate = (req, res) => {
  const serviceInst = BuilderService["homescreentemplateService"];
  let body = req.body;
  return serviceHandler(req, res, serviceInst.createOrUpdateTemplate(body));
};

const getTemplate = (req, res) => {
  const serviceInst = BuilderService["homescreentemplateService"];
  return serviceHandler(req, res, serviceInst.getTemplate());
};

module.exports = (app) => {
  /* ADMIN APIS */
  app.post(`${config.api.admin}/homescreentemplate`, (req, res) =>
    createTemplate(req, res)
  );
  app.get(`${config.api.admin}/homescreentemplate`, (req, res) =>
    getTemplate(req, res)
  );

  /* USER APIS */
  app.get(`${config.api.user}/homescreentemplate`, (req, res) =>
    getTemplate(req, res)
  );
};

const serviceHandler = require("../Services/servicehandler").serviceHandler;
const BuilderService = require("../Service/BuilderService");
const Promise = require("bluebird");
const _ = require("lodash");
const codes = require("../config/codes.json");
const config = require("../config/serverconfig.json");

const createOffer = (req, res) => {
  const serviceInst = BuilderService["offerService"];
  let body = req.body;
  req.ApiId = "createoffer";
  return serviceHandler(req, res, serviceInst.createOffer(body));
};

const udpateOffer = (req, res) => {
  const serviceInst = BuilderService["offerService"];
  let body = req.body;
  const offerId = req.params.offerId;
  if (!offerId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
  return serviceHandler(req, res, serviceInst.udpateOffer(offerId, body));
};

const getOffers = (req, res) => {
  const serviceInst = BuilderService["offerService"];
  return serviceHandler(req, res, serviceInst.getOffers());
};

const deleteOffer = (req, res) => {
  const serviceInst = BuilderService["offerService"];
  const offerId = req.params.offerId;
  if (!offerId) return Promise.reject("MISSING_REQ_FIELDS_IN_QUERY_PARAMS");
  return serviceHandler(req, res, serviceInst.deleteOffer(offerId));
};

module.exports = (app) => {
  /* ADMIN APIS */
  app.post(`${config.api.admin}/offers`, (req, res) => createOffer(req, res));
  app.get(`${config.api.admin}/offers`, (req, res) => getOffers(req, res));
  app.put(`${config.api.admin}/offers/:offerId`, (req, res) =>
    udpateOffer(req, res)
  );
  app.delete(`${config.api.admin}/offers/:offerId`, (req, res) =>
    deleteOffer(req, res)
  );

  /* USER APIS */
  app.get(`${config.api.user}/offers`, (req, res) => getOffers(req, res));
};

const jwt           = require("jsonwebtoken");
const ModelFactory  = require("../Model/ModelFactory");
const config        = require("../config/serverconfig.json");

const authorizeUser = (req, res, next) => {
    const userId = req.params.userId;
    const model  = ModelFactory.user();
    return model.getUserById(userId)
    .then(user => {
        let token = req.headers.authorization;
        if(!user || user.type !== "admin" || !token) {
            res.status(401);
            res.send("InValidAccess");
        }
        jwt.verify(token, config.appserver.privateKey, (err, data) => {
            if(err || !data || data.userId !== userId || data.type !== "admin") {
                res.status(403);
                res.send("InValidAccess");
            }
        });
        next();
    })
}

module.exports = app => {
    app.use("/elates/api/admin/:userId", (req, res, next) => authorizeUser(req, res, next));
}
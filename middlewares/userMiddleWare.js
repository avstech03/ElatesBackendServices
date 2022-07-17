const jwt           = require("jsonwebtoken");
const config        = require("../config/serverconfig.json");
const ModelFactory  = require("../Model/ModelFactory");

const authorizeUser = (req, res, next) => {
    const userId = req.params.userId;
    const model  = ModelFactory.user(); 
    return model.getUserById(userId)
    .then(user => {
        let token = req.headers.authorization;
        if(!user || user.type !== "enduser" || !token) {
            res.status(403);
            res.send("InValidAccess");
        }
        jwt.verify(token, config.appserver.privateKey, (err, data) => {
            if(err || !data || data.userId !== userId || data.type !== "enduser") {
                res.status(403);
                res.send("InValidAccess");
            }
        });
        next();
    })
}

module.exports = app => {
    app.use("/elates/api/users/:userId", (req, res, next) => authorizeUser(req, res, next));
}
const mongoose      = require("mongoose");
const config        = require("./config/serverconfig.json");
const Routes        = require("./ROUTES");
const MiddleWares   = require("./middlewares");
const middlewares = require("./middlewares");

module.exports = (app, port) => {
    // Connecting to Mongo Server.
    mongoose.connect(`${config.mongo.host}:${config.mongo.port}/${config.mongo.dbname}`, { useNewUrlParser: true, useUnifiedTopology: true});

    // MiddleWares
    MiddleWares.forEach(middleware => middleware(app));

    // Route Listeners
    Routes.forEach(route => route(app));
    
    // HTTP SERVER.
    app.listen(port, () => {
        console.log(` === APP SERVER started on port ${port} === `);
    });
};
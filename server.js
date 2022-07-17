const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const config = require("./config/serverconfig.json");

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

config.appserver.port.forEach((port => {
    require("./init")(app, port);
}));



const Promise        = require("bluebird");
const _              = require("lodash");
const codes          = require("../config/codes.json");
const config         = require("../config/serverconfig.json");
const multer         = require("multer");
const AWS            = require("aws-sdk");
const uuid           = require('uuid');
const s3             = new AWS.S3({
    accessKeyId: config.aws.accessKey,
    secretAccessKey: config.aws.secretKey
});

module.exports = app => {
    const storage = multer.memoryStorage({
        destination: (req, file, callback) => {
            callback(null, '');
        }
    });

    const upload = multer({storage}).single('image');

    app.post(`${config.api.admin}/upload`, upload, (req, res) => {
        let file = req.file.originalname.split(".");
        const fileType = file[file.length - 1];
        const params = {
            Bucket: config.aws.s3.bucketName,
            Key: `${uuid.v4()}.${fileType}`,
            Body: req.file.buffer
        };

        s3.upload(params, (error, data) => {
            if(error) {
                res.status(500).send(error);
            }
            res.status(200)
            res.send(data);
        })
    })
}
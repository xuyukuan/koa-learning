const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://localhost:27017";


module.exports = function (app) {
    MongoClient.connect(MONGO_URL)
        .then((client) => {
            console.log("Connected successfully to server");
            const db = client.db("koa-example");
            app.people = db.collection("people");
        })
        .catch((err) => console.error(err))
};
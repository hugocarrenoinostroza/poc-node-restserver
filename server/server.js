require("./config/config");

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const path = require("path");


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// public folder
app.use(express.static(path.resolve(__dirname, "../public")))

//routes config
app.use(require("./routes/index"));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;

    console.log("*** DB Online ***");
});

app.listen(process.env.PORT, () => {
    console.log("Listening on port: ", process.env.PORT);
})
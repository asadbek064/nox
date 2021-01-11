const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config(path.join(__dirname + ".env"));
const compression = require('compression');

app.use(compression());

app.use(cors());

app.use(express.static('/www/*'));

app.all('*', function (req, res) {
  res.status(200).sendFile(__dirname + '/www/index.html');
});

app.listen(process.env.PORT || 4200, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

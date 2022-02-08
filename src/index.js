const express = require("express");
const settings = require("./settings/server.js");

const app = settings(express());

app.listen(app.get('port'), () => {
    
});
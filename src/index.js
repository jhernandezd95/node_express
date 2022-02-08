const express = require("express");
const settings = require("./settings/server");
const {createLog} = require("./helpers/winston");

const app = settings(express());

app.listen(app.get('port'), () => {
    createLog('info', `Server listening on ${app.get('port')}`, undefined);
});
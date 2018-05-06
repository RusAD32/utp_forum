'use strict';

const fs = require('fs');

const handler = (reqest, responce, data) => {
    let users = JSON.parse(fs.readFileSync("./data/users.json", "UTF-8"));
    let username = "";
    let password = "";
    try {
        username = data.split(" ")[0];
        password = data.split(" ")[1];
    } catch (e) {
        responce.writeHead(401, {"content-type": "text/plain"});
        responce.write("Authorization error. Your request was malformed");
        responce.end();
        console.log("Auth err, " + data);
        return;
    }
    if (users[username] === password) {
        responce.writeHead(200, {"content-type": "text/plain"});
        responce.write("/forum");
        responce.end();
    } else {
        responce.writeHead(401, {"content-type": "text/plain"});
        responce.write("Authorization error. Invalid username or password. ");
        responce.end();
    }
};

module.exports.handler = handler;
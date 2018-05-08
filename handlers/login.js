'use strict';

const fs = require('fs');
const crypto = require('crypto');

const handler = (reqest, responce, data, cookies) => {
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
    let hash = crypto.createHash("sha256", "kharnin").update(password).digest("hex");
    if (users[username] === hash) {
        let cookie = username + new Date().getTime();
        cookies[cookie] = username;
        responce.writeHead(200, {"content-type": "text/plain", "Set-cookie": "forum_session=" + cookie});
        responce.write("/forum");
        responce.end();
    } else {
        responce.writeHead(401, {"content-type": "text/plain"});
        responce.write("Authorization error. Invalid username or password. ");
        responce.end();
    }
    console.log(cookies);
    return cookies;
};

module.exports.handler = handler;
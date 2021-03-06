'use strict';

const fs = require('fs');
const crypto = require('crypto');

const handler = (reqest, responce, data, state) => {
    let users = JSON.parse(fs.readFileSync("./data/users.json", "UTF-8"));
    let username = "";
    let password = "";
    let json_data = {};
    try {
        json_data = JSON.parse(data);
        username = json_data["username"];
        password = json_data["password"];
    } catch (e) {
        responce.writeHead(400, {"content-type": "text/plain"});
        responce.write("Authorization error. Your request was malformed");
        responce.end();
        console.log("Auth err, " + data);
        return;
    }
    let hash = crypto.createHash("sha256", "kharnin").update(password).digest("hex");
    if (users[username] === hash) {
        let cookie = encodeURIComponent(username + new Date().getTime());
        let expires = "";
        if (json_data["remember"]) {
            let d = new Date();
            d.setMonth(d.getMonth()+12);
            expires = "; Expires=" +d.toUTCString();
        }
        state.cookies[cookie] = username;
        responce.writeHead(200, {"content-type": "text/plain", "Set-cookie": "forum_session=" + cookie + expires});
        responce.write("/forum");
        responce.end();
    } else {
        responce.writeHead(400, {"content-type": "text/plain"});
        responce.write("Authorization error. Invalid username or password. ");
        responce.end();
    }
};

module.exports.handler = handler;

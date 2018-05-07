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
        responce.write("Registration error. Your request was malformed");
        responce.end();
        console.log("Registration err, " + data);
        return;
    }
    let verification = verify(username, password);
    if (verification) {
        responce.writeHead(401, {"content-type": "text/plain"});
        responce.write(verification);
        responce.end();
        return
    }
    if (users[username] !== undefined) {
        responce.writeHead(401, {"content-type": "text/plain"});
        responce.write("User already exists!");
        responce.end();
    } else {
        users[username] = crypto.createHash("sha256", "kharnin").update(password).digest("hex");
        fs.writeFileSync("./data/users.json", JSON.stringify(users), "UTF-8");
        let cookie = username + cookies.size + new Date().getTime();
        cookies.set(cookie, username);
        responce.writeHead(200, {"content-type": "text/plain"});
        responce.write(cookie);
        responce.end();
    }
};

function verify(username, password) {
    let str = '';
    if (username.length < 3) {
        str += "Username too short\n";
    }
    if (username.length > 64) {
        str += "Username too long, 64 symbols maximum!\n";
    }
    if (password.length < 6) {
        str += "Password too short, 6 symbols minimum!\n";
        return;
    }
    if (password.length > 64) {
        str += "Password too long, 64 symbols maximum!\n";
    }
    let regex = /[^a-zA-Zа-яА-Я0-9\-_.]+/;
    if (username.match(regex) !== null) {
        str += 'Username should contain only letters, numbers and symbols . - or _\n';
    }
    let regex2 = /\s/;
    if (password.match(regex) !== null) {
        str += 'Password shouldn\'t contain whitespaces!\n';
    }
    return str;

}

module.exports.handler = handler;
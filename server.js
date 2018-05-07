'use strict';

const http = require('http');
const fs = require('fs');
const login_handler = require("./handlers/login").handler;
const reg_handler = require("./handlers/register").handler;
const forum_handler = require("./forum/list_topics").handler;
const topic_handler = require("./forum/view_thread").handler;
const url = require('url');

let cookies = new Map();

const handler = (request, responce) => {
    let total_url = url.parse(request.url);
    let url_path = total_url.pathname;
    if (request.method === "POST") {
        if (url_path === "/auth") {
            post_handler(request, responce, login_handler)
        } else if (url_path === "/reg") {
            post_handler(request, responce, reg_handler);
        }
    } else if (url_path === '/' || url_path === '') {
        let cookie = total_url.search.substr(1).split("=");
        if (cookie.length === 2 && cookie[0] === "forum_session" && cookies.has(cookie[1])) {
            responce.writeHead(301, {"location": "/forum"});
            responce.cookie=cookie[0] + "=" + cookie[1];
            responce.end();
        } else {
            responce.writeHead(301, {"location": "/login"});
            responce.end();
        }
    } else if (url_path === '/login') {
        responce.writeHead(200, {"content-type": "text/html"});
        responce.write(fs.readFileSync("./pages/login.html", "UTF-8"));
        responce.end();
    } else if (url_path === '/register') {
        responce.writeHead(200, {"content-type": "text/html"});
        responce.write(fs.readFileSync("./pages/register.html", "UTF-8"));
        responce.end();
    } else if (url_path === "/forum") {
        forum_handler(request, responce)
    } else if(url_path.startsWith("/forum")) {
        topic_handler(request, responce)
    } else {
        responce.writeHead(404, {"content-type" : "text/plain"});
        responce.write("Page you are requesting can not be found");
        responce.end();
    }
};

function post_handler(request, responce, handler) {
    let req_data = '';
    request.on("data", (data) => {
        req_data += data;
        if (data.length >= 10 * 1024) {
            responce.writeHead(413, {"content-type": "text/plain"});
            responce.write("request too long");
            responce.end();
            request.connection.destroy();
        }
    });
    request.on("end", () => {
        handler(request, responce, req_data, cookies)
    });
}

http.createServer(handler).listen(8191);
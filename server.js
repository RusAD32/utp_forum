'use strict';

const http = require('http');
const fs = require('fs');
const login_handler = require("./handlers/login").handler;
const reg_handler = require("./handlers/register").handler;
const forum_handler = require("./handlers/list_topics").handler;
const topic_handler = require("./handlers/view_thread").handler;
const check_cookie = require("./utils/cookie_manager").check_cookie;
const url = require('url');


let cookies = {};

const handler = (request, responce) => {
    let total_url = url.parse(request.url);
    let req_url = total_url.pathname;
    let cookie = request.headers.cookie ? request.headers.cookie : "";
    if (request.method === "POST") {
        if (req_url === "/auth") {
            post_handler(request, responce, login_handler)
        } else if (req_url === "/reg") {
            post_handler(request, responce, reg_handler);
        }
    } else if (!(check_cookie(cookie, cookies) || req_url === "/login" || req_url === "/register")) {
        responce.writeHead(301, {"location": "/login"});
        responce.end();
    } else if (req_url === "/") {
        responce.writeHead(301, {"location": "/forum"});
        responce.end()
    }
    else if (req_url === '/login') {
        responce.writeHead(200, {"content-type": "text/html"});
        responce.write(fs.readFileSync("./pages/login.html", "UTF-8"));
        responce.end();
    } else if (req_url === '/register') {
        responce.writeHead(200, {"content-type": "text/html"});
        responce.write(fs.readFileSync("./pages/register.html", "UTF-8"));
        responce.end();
    } else if (req_url === "/forum") {
        forum_handler(request, responce, cookies)
    } else if(req_url.startsWith("/forum")) {
        topic_handler(request, responce, cookies)
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
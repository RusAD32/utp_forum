'use strict';

const http = require('http');
const fs = require('fs');
const login_handler = require("./handlers/login").handler;
const reg_handler = require("./handlers/register").handler;
const forum_handler = require("./forum/list_topics").handler;

const handler = (request, responce) => {
    if (request.method === "POST") {
        if (request.url === "/auth") {
            post_handler(request, responce, login_handler)
        } else if (request.url === "/reg") {
            post_handler(request, responce, reg_handler);
        }
    } else if (request.url === '/' || request.url === '' || request.url === '/login') {
        responce.writeHead(200, {"content-type": "text/html"});
        responce.write(fs.readFileSync("./pages/login.html", "UTF-8"));
        responce.end();
    } else if (request.url === '/register') {
        responce.writeHead(200, {"content-type": "text/html"});
        responce.write(fs.readFileSync("./pages/register.html", "UTF-8"));
        responce.end();
    } else if(request.url.startsWith("/forum")) {
        forum_handler(request, responce)
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
        handler(request, responce, req_data)
    });
}

http.createServer(handler).listen(8191);
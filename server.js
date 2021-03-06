'use strict';

const http = require('http');
const fs = require('fs');
const login_handler = require("./handlers/login").handler;
const reg_handler = require("./handlers/register").handler;
const forum_handler = require("./handlers/list_topics").handler;
const topic_handler = require("./handlers/view_thread").handler;
const cookie_mgr = require("./utils/cookie_manager");
const new_comment_handler = require("./handlers/new_comment").handler;
const delete_comment_handler = require("./handlers/delete_comment").handler;
const edit_comment_handler = require("./handlers/edit_comment").handler;
const rename_thread_handler = require("./handlers/rename_thread").handler;
const delete_thread_handler = require("./handlers/delete_thread").handler;
const add_thread_handler = require("./handlers/new_thread").handler;
const url = require('url');

let savedstate = {};
if (!fs.existsSync("./data/data.json")) {
    savedstate = { 
        "total_comments": 0,
        "total_topics": 0,
        "cookies": {}
    }
} else {
    savedstate = JSON.parse(fs.readFileSync("./data/data.json"));
}

const handler = (request, responce) => {
    let total_url = url.parse(request.url);
    let req_url = total_url.pathname;
    let cookie = request.headers.cookie ? request.headers.cookie : "";
    if (request.method === "POST") {
        if (req_url === "/auth") {
            post_handler(request, responce, login_handler)
        } else if (req_url === "/reg" || req_url === "/reg/") {
            post_handler(request, responce, reg_handler);
        } else if (req_url === "/addcom" || req_url === "/addcom/" ) {
            post_handler(request, responce, new_comment_handler);
        } else if (req_url === "/delcom" || req_url === "/delcom/") {
            post_handler(request, responce, delete_comment_handler);
        } else if (req_url === "/editcom" || req_url === "/editcom/") {
            post_handler(request, responce, edit_comment_handler);
        } else if (req_url === "/renamethr" || req_url === "/renamethr/") {
            post_handler(request, responce, rename_thread_handler);
        } else if (req_url === "/delthr" || req_url === "/delthr/") {
            post_handler(request, responce, delete_thread_handler);
        }else if (req_url === "/addthr" || req_url === "/addthr/") {
            post_handler(request, responce, add_thread_handler);
        } else {
            responce.writeHead(404, {"content-type" : "text/plain"});
            responce.write("Page you are requesting can not be found");
            responce.end();
        }
    } else if (!(cookie_mgr.check_cookie(cookie, savedstate["cookies"]) ||
            req_url === "/login" || req_url === "/register" ||
            req_url === "/login/" || req_url === "/register/")) {
        responce.writeHead(302, {"location": "/login"});
        responce.end();
    } else if (req_url === "/") {
        responce.writeHead(302, {"location": "/forum"});
        responce.end();
    }
    else if (req_url === '/login' || req_url === '/login/') {
        responce.writeHead(200, {"content-type": "text/html"});
        responce.write(fs.readFileSync("./pages/login.html", "UTF-8"));
        responce.end();
    } else if (req_url === '/register' || req_url === '/register/') {
        responce.writeHead(200, {"content-type": "text/html"});
        responce.write(fs.readFileSync("./pages/register.html", "UTF-8"));
        responce.end();
    } else if (req_url === "/forum" || req_url === "/forum/") {
        forum_handler(request, responce, savedstate)
    } else if(req_url.startsWith("/forum/")) {
        topic_handler(request, responce, savedstate)
    } else if (req_url === "/logout" || req_url === "/logout") {
        let old_cookie = cookie_mgr.get_cookie(cookie, "forum_session");
        delete savedstate.cookies[old_cookie];
        responce.writeHead(200, {
            "content-type": "text/plain",
            "Set-cookie" : "forum_session=" + old_cookie + "; max-age=-999"
        });
        responce.end()
    } else {
        responce.writeHead(404, {"content-type" : "text/plain"});
        responce.write("Page you are requesting can not be found");
        responce.end();
    }
    fs.writeFileSync("./data/data.json", JSON.stringify(savedstate));
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
        handler(request, responce, req_data, savedstate)
    });
}

http.createServer(handler).listen(8191);

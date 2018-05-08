'use strict';
const get_cookie = require("../utils/cookie_manager").get_cookie;

const handler = (request, responce) => {
    responce.writeHead(200, {"content-type" : "text/plain"});
    responce.write("Currently under development\nYour cookie: " + get_cookie(request.headers.cookie, "forum_session"));
    responce.end()
};

module.exports.handler = handler;
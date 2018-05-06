'use strict';

const handler = (request, responce) => {
    responce.writeHead(200, {"content-type" : "text/plain"});
    responce.write("Currently under development");
    responce.end()
};

module.exports.handler = handler;
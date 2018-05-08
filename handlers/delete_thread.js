const fs = require("fs");
const get_cookie = require("../utils/cookie_manager").get_cookie;

const handler = (request, responce, data, state) => {
    let cookies = state.cookies;
    let data_struct = {};
    try {
        data_struct = JSON.parse(data);
    } catch (e) {
        responce.writeHead(400, {"content-type": "text/plain"});
        responce.write("Deleting thread error. Your request was malformed");
        responce.end();
        console.log("Thread delete err, " + data); //TODO исправить подобные
        return;
    }
    let cookie = get_cookie(request.headers.cookie, "forum_session");
    let user = cookies[cookie];
    let filename = "./forum/topics/" + data_struct["name"] + ".json";
    if (!fs.existsSync(filename)) {
        responce.writeHead(404);
        responce.write("Comment not found");
        responce.end();
        return
    }
    let topic = JSON.parse(fs.readFileSync(filename));
    if (topic["author"] === user) {
        fs.unlink(filename, (e) => { if (e) console.log(e)});
        responce.writeHead(200);
        responce.end();
    } else {
        responce.writeHead(403, {"content-type":"text/plain"});
        responce.write("You are trying to delete a thread that isn't yours");
        responce.end();
    }
};

module.exports.handler = handler;
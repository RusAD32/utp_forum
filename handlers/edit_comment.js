const fs = require("fs");
const get_cookie = require("../utils/cookie_manager").get_cookie;

const handler = (request, responce, data, state) => {
    let cookies = state.cookies;
    let data_struct = {};
    try {
        data_struct = JSON.parse(data);
    } catch (e) {
        responce.writeHead(400, {"content-type": "text/plain"});
        responce.write("Deleting comment error. Your request was malformed");
        responce.end();
        console.log("Comment add err, " + data);
        return;
    }
    let cookie = get_cookie(request.headers.cookie, "forum_session");
    let user = cookies[cookie];
    let filename = "./forum/topics/" + data_struct["topic_name"].replace(/\s/g, "_") + ".json";
    let topic = JSON.parse(fs.readFileSync(filename));
    for (let i = 0; i < topic["comments"].length; i++) {
        if (topic["comments"][i].id === data_struct.id) {
            if (topic["comments"][i].author === user || topic.author === user) {
                topic["comments"][i]["text"] = data_struct["comment_text"];
                fs.writeFileSync(filename, JSON.stringify(topic));
                responce.writeHead(200);
                responce.end();
                return;
            } else {
                responce.writeHead(403, {"content-type":"text/plain"});
                responce.write("You are trying to edit a comment that isn't yours");
                responce.end();
                return;
            }
        }
    }
    responce.writeHead(404);
    responce.write("Comment not found");
    responce.end();
};

module.exports.handler = handler;
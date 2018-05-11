const fs = require("fs");
const get_cookie = require("../utils/cookie_manager").get_cookie;

const handler = (request, responce, data, state) => {
    let cookies = state.cookies;
    let data_struct = {};
    try {
        data_struct = JSON.parse(data);
    } catch (e) {
        responce.writeHead(401, {"content-type": "text/plain"});
        responce.write("Authorization error. Your request was malformed");
        responce.end();
        console.log("Comment add err, " + data);
        return;
    }
    let cookie = get_cookie(request.headers.cookie, "forum_session");
    let user = cookies[cookie];
    let filename = "./forum/topics/" + data_struct["topic_name"] + ".json";
    let topic = JSON.parse(fs.readFileSync(filename));
    topic["comments"].push({
        author: user,
        date: new Date().getTime(),
        id: ++state["total_comments"],
        text: data_struct["comment_text"]
    });
    fs.writeFileSync(filename, JSON.stringify(topic));
    responce.writeHead(200);
    responce.end();
    state["total_comments"]++;
};

module.exports.handler = handler;

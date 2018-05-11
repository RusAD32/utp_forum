const fs = require("fs");
const get_cookie = require("../utils/cookie_manager").get_cookie;

const handler = (request, responce, data, state) => {
    let cookies = state.cookies;
    let data_struct = {};
    try {
        data_struct = JSON.parse(data);
    } catch (e) {
        responce.writeHead(400, {"content-type": "text/plain"});
        responce.write("New thread error. Your request was malformed");
        responce.end();
        console.log("Comment add err, " + data);
        return;
    }
    let cookie = get_cookie(request.headers.cookie, "forum_session");
    let user = cookies[cookie];
    let filename = "./forum/topics/" + ++state["total_topics"] + ".json";
    if (fs.existsSync(filename)) {
        responce.writeHead(400, {"content-type": "text/plain"});
        responce.write("Topic with the same name already exists, please choose another one");
        responce.end();
        return;
    }
    let time = new Date().getTime();
    let comment = {
        "author": user,
        "date": time,
        "id": ++state["total_comments"],
        "text": data_struct["text"]
    };
    let topic = {
        "author": user,
        "date": time,
        "name": data_struct["name"],
        "comments": [
            comment
        ]
    };
    fs.writeFileSync(filename, JSON.stringify(topic));
    responce.writeHead(200);
    responce.end();
};

module.exports.handler = handler;

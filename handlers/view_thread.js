'use strict';

const fs = require('fs');
const get_cookie = require("../utils/cookie_manager").get_cookie;

const handler = (request, responce, state) => {
    let cookies = state.cookies;
    let url = request.url.split("/");
    let topic_name = url[url.length-1];
    if (!fs.existsSync("topics/" + topic_name + ".json")) {
        responce.writeHead(404, {"content-type": "text/plain"};
        responce.write("Thread not found");
        responce.end();
        return;
    }
    let topic = JSON.parse(read("topics/" + topic_name + ".json"));
    let cookie = get_cookie(request.headers.cookie, "forum_session");
    let user = cookies[cookie];
    let html = read("html_templates/head.html")
        .replace('{{TITLE}}', topic_name.replace(/_/g, " "))
        .replace('{{USER}}', user);
    html += read("html_templates/scripts_comments.html");
    for (let i = 0; i < topic["comments"].length; i++) {
        let comment = topic["comments"][i];
        if (comment["author"] === user || topic["author"] === user) {
            html += update_template('html_templates/comment_box_owner.html', comment);
        } else {
            html += update_template('html_templates/comment_box.html', comment);
        }
    }
    html += read("html_templates/new_comment.html");
    html += "</body>\n";
    html += "</html>";
    responce.writeHead(200, {"content-type" : "text/html"});
    responce.write(html);
    responce.end()
};

function update_template(filename, comment) {
    return read(filename)
        .replace(/{{COMMENTID}}/g, comment["id"])
        .replace(/{{USERNAME}}/g, comment["author"])
        .replace(/{{DATE}}/g, comment["date"])
        .replace(/{{COMMENT_TEXT}}/g, comment["text"]);
}

function read(path) {
    return fs.readFileSync('./forum/' + path, "UTF-8");
}

module.exports.handler = handler;

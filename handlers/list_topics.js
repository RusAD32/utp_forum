'use strict';
const get_cookie = require("../utils/cookie_manager").get_cookie;
const fs = require("fs");

const handler = (request, responce, state) => {
    let cookies = state.cookies;
    let html = read("html_templates/head.html").replace('{{TITLE}}', "Forum");
    let topics = fs.readdirSync("./forum/topics");
    let cookie = get_cookie(request.headers.cookie, "forum_session");
    let user = cookies[cookie];
    html += "\n<body>\n<div align='right'>Приветствую, " + user + "!</div>";
    html += read("html_templates/scripts_threads.html");
    html += read("html_templates/topiclist_new.html");
    html += "<table align='center' border='2px'>";
    for (let i = 0; i < topics.length; i++) {
        let topic_name = topics[i].substring(0, topics[i].length-5);
        let topic = JSON.parse(read("topics/" + topics[i]));
        if (topic["author"] === user) {
            html += update_template("html_templates/topiclist_item_owner.html", topic_name, topic)
        } else {
            html += update_template("html_templates/topiclist_item.html", topic_name, topic)
        }
    }
    html += "</table>\n";
    html += "</body>\n</html>";
    responce.writeHead(200, {"content-type" : "text/html"});
    responce.write(html);
    responce.end()
};

function read(path) {
    return fs.readFileSync('./forum/' + path, "UTF-8");
}

function update_template(filename, topic_name, topic) {
    return read(filename)
        .replace(/{{TOPIC_NAME}}/g, topic_name)
        .replace(/{{TOPIC NAME}}/g, topic_name.replace(/_/g, " "))
        .replace(/{{AUTHOR}}/g, topic["author"])
        .replace(/{{DATE}}/g, topic["date"]);
}

module.exports.handler = handler;
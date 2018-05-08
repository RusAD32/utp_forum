'use strict';
const get_cookie = require("../utils/cookie_manager").get_cookie;
const fs = require("fs");
const time_formatter = require("../utils/date_formatter").time_formatter;

const handler = (request, responce, state) => {
    let cookies = state.cookies;
    let html = read("html_templates/head.html").replace('{{TITLE}}', "Forum");
    let topics = fs.readdirSync("./forum/topics");
    let cookie = get_cookie(request.headers.cookie, "forum_session");
    let user = cookies[cookie];
    html += "\n<body>\n<div align='right'>Приветствую, " + user + "!</div>";
    html += "<table align='center' border='2px'>";
    for (let i = 0; i < topics.length; i++) {
        let topic_name = topics[i].substring(0, topics[i].length-5);
        let topic = JSON.parse(read("topics/" + topics[i]));
        html += read("html_templates/topiclist_item.html")
            .replace(/{{TOPIC_NAME}}/g, topic_name)
            .replace(/{{TOPIC NAME}}/g, topic_name.replace(/_/g, " "))
            .replace(/{{AUTHOR}}/g, topic["author"])
            .replace(/{{DATE}}/g, time_formatter(topic["date"]));
    }
    html += "</table>\n</body>\n</html>";
    responce.writeHead(200, {"content-type" : "text/html"});
    responce.write(html);
    responce.end()
};

function read(path) {
    return fs.readFileSync('./forum/' + path, "UTF-8");
}

module.exports.handler = handler;
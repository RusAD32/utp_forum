'use strict';
const get_cookie = require("../utils/cookie_manager").get_cookie;
const fs = require("fs");

const handler = (request, responce, cookies) => {
    let html = read("html_templates/head.html").replace('{{TITLE}}', "Forum");
    let topics = fs.readdirSync("./forum/topics");
    let cookie = get_cookie(request.headers.cookie, "forum_session");
    let user = cookies[cookie];
    html += "\n<body>\n<div align='right'>Приветствую, " + user + "!</div>\n";
    html += "<table align='center' border='2px'>";
    for (let i = 0; i < topics.length; i++) {
        let topic_name = topics[i].substring(0, topics[i].length-5);
        let topic = JSON.parse(read("topics/" + topics[i]));
        html += read("html_templates/topiclist_item.html")
            .replace(/{{TOPIC_NAME}}/g, topic_name)
            .replace(/{{TOPIC NAME}}/g, topic_name.replace(/_/g, " "))
            .replace(/{{AUTHOR}}/g, topic["author"])
            .replace(/{{DATE}}/g, topic["date"])
    }
    html += "</table>\n</body>\n</html>";
    responce.writeHead(200, {"content-type" : "text/html"});
    responce.write(html);
   // responce.write("Currently under development\nYour cookie: " + get_cookie(request.headers.cookie, "forum_session"));
    responce.end()
};

function read(path) {
    return fs.readFileSync('./forum/' + path, "UTF-8");
}

module.exports.handler = handler;
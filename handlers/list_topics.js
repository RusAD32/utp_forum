'use strict';
const get_cookie = require("../utils/cookie_manager").get_cookie;
const fs = require("fs");

const handler = (request, responce, state) => {
    let cookies = state.cookies;
    let topics = fs.readdirSync("./forum/topics")
        .map(function (fileName) {
        return {
            name: fileName,
            time: fs.statSync("./forum/topics/" + fileName).mtime.getTime()
        };
    })
        .sort(function (a, b) {
            return b.time - a.time; })
        .map(function (v) {
            return v.name; });
    let cookie = get_cookie(request.headers.cookie, "forum_session");
    let user = cookies[cookie];
    let html = read("html_templates/head.html")
        .replace('{{TITLE}}', "Forum")
        .replace('{{USER}}', user);
    html += read("html_templates/scripts_threads.html");
    html += read("html_templates/topiclist_new.html");
    html += "<table align='center' border='2px'>";
    for (let i = 0; i < topics.length; i++) {
        let topic_name = topics[i].substring(0, topics[i].length-5).replace(/\\/g, "/");
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
        .replace(/{{DATE}}/g, topic["date"])
        .replace(/{{MES_COUNT}}/g, topic["comments"].length)
        .replace(/{{LAST_NAME}}/g, topic["comments"][topic["comments"].length - 1]["author"]);
}

module.exports.handler = handler;
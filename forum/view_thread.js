'use strict';

const fs = require('fs');

const handler = (request, responce) => {
    let url = request.url.split("/");
    let topic_name = url[url.length-1];
    let html = read("html_templates/head.html").replace('{{TITLE}}', topic_name.replace("_", " "));
    let topic = JSON.parse(read("topics/" + topic_name + ".json"));
    html += "\n<body>";
    for (let i = 0; i < topic["comments"].length; i++) {
        let comment = topic["comments"][i];
        html += read('html_templates/comment_box.html')
            .replace(/{{COMMENTID}}/g, i)
            .replace(/{{USERNAME}}/g, comment["author"])
            .replace(/{{DATE}}/g, comment["date"])
            .replace(/{{COMMENT_TEXT}}/g, comment["text"]);
    }
    html += read("html_templates/new_comment.html");
    html += read("html_templates/scripts.html");
    html += "</body>\n";
    html += "</html>";
    responce.writeHead(200, {"content-type" : "text/html"});
    responce.write(html);
    responce.end()
};

function read(path) {
    return fs.readFileSync('./forum/' + path, "UTF-8");
}

module.exports.handler = handler;

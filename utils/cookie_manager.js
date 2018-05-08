const get_cookie = (cookie_str, cookie_name) => {
    let result = {};
    cookie_str.split(';').map((v) => {
        v=v.trim().split('=');
        result[v[0]]=v.splice(1).join('=');
    });
    return result[cookie_name];
};


const check_cookie = (cookie_str, cookies) => {
    let found_cookie = get_cookie(cookie_str, "forum_session");
    console.log(found_cookie + "  ");
    return cookies[found_cookie] !== undefined;
};

module.exports.get_cookie = get_cookie;
module.exports.check_cookie = check_cookie;
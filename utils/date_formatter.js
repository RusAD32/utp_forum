const time_formatter = (time) => {
    let dt = new Date(+time);
    return (dt.getDay() < 10 ? '0' + dt.getDay() : dt.getDay()) +
        "." + (dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1)) +
        "." + dt.getFullYear() + " " + dt.getHours() + ":" +
        (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()) + ":" +
        (dt.getSeconds() < 10 ? '0' + dt.getSeconds() : dt.getSeconds());
};

module.exports.time_formatter = time_formatter;
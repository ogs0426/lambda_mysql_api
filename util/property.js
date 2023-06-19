exports.UNIX_TIMESTAMP = (t, numOfHours) => {
    var date = new Date(t * 1000);
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    var year = date.getFullYear();
    var month = "0" + (date.getMonth()+1);
    var day = "0" + date.getDate();
    var hour = "0" + date.getHours();
    var minute = "0" + date.getMinutes();
    var second = "0" + date.getSeconds();
    return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
}

exports.replaceAll = (str, searchStr, replaceStr) => {
  return str.split(searchStr).join(replaceStr);
}

exports.UNIX_TIMESTAMP_NOW = () => {
    return (new Date().getTime() / 1000);
}

exports.isEmpty = (value) => {
    if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) )
        return true;
    
    return false;
};

exports.btoa = (text) => {
    return Buffer.from(text, 'binary').toString('base64');
};

exports.atob = (base64) => {
    return Buffer.from(base64, 'base64').toString('binary');
};

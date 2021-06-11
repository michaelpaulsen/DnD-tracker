// QUERY SELECTOR GETER
// © Michael Paulsen 2019 - 2021
exports.Query = function(str) {
    let obj = {}; 
    obj.querys = str.substring(1,str.length).split('&');
    for (let x = 0; x < obj.querys.length; x++) {
        let param = obj.querys[x].split('='); 
        let name = param[0];
        let value = param[1];
        if (value == "true") {
            obj[name] = true;
            continue;
        } else if (value == 'false') {
            obj[name] = false;
            continue;
        } else if (!isNaN(parseInt(value))) {
            obj[name] = parseInt(value);
            continue;
        }
        obj[name] = value;
    }
    return obj;
}
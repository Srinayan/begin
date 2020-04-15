var XmlParser = function(filepath){
    var fs = require('fs');
    var parse = require('xml-parser');
    var inspect = require('util').inspect;
    var returnObj;
    try{
        var fileStat = fs.statSync(filepath);
        var xml = fs.readFileSync(filepath, 'utf8');
        var obj = parse(xml);
        json = inspect(obj, {
            colors: true,
            depth: Infinity
        })
        returnObj = json
        return returnObj;
    }
    catch(err){
        return String(err);
    }
}

module.exports = XmlParser;
const fs = require('fs');
const request = require('request');

const download = function(url, filepath){
    const file = fs.createWriteStream(filepath);
    const reqUrl = request.get(url);

    reqUrl.on('response', function (response) {
        if (response.statusCode !== 200) {
            console.log("Succesfull response");
        }
        reqUrl.pipe(file);
    });

    reqUrl.on('error', function (err) {
        fs.unlink(filepath);
        console.log(err.message);
    });

    file.on('finish',function(){
        file.close()
    });

    file.on('error', function(err){
        fs.unlink(filepath);
        console.log(err.message);
    });
};

download("https://www.google.co.in/", "file.html");
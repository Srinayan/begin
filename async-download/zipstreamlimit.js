const fs = require('fs');
const request = require('request');
const zlib = require('zlib');
const async = require('async');


urlList = [
    "http://www.pngall.com/wp-content/uploads/2016/06/Pokemon-PNG.png",
    "http://www.pngall.com/wp-content/uploads/2016/06/Pokemon.png",
    "http://www.pngall.com/wp-content/uploads/2016/06/Pokemon-Download-PNG.png",
    "http://www.pngall.com/wp-content/uploads/4/Rick-And-Morty-PNG-Image.png",
    "http://www.pngall.com/wp-content/uploads/4/Rick-And-Morty-PNG-Download-Image.png",
    "http://www.pngall.com/wp-content/uploads/4/Rick-And-Morty.png"
]
var zipstream = function (url, filepath) {
    var gzip = zlib.createGzip();
    request(url).pipe(gzip).pipe(fs.createWriteStream(filepath));
}

async.forEach(urlList, function (url) {
    if (!fs.existsSync(__dirname + "/imagesFolder" + Math.floor(urlList.indexOf(url) / 5 + 1))) {
        fs.mkdirSync(__dirname + "/imagesFolder" + Math.floor(urlList.indexOf(url) / 5 + 1));
    }
    var foldername = __dirname + "/imagesFolder" + Math.floor(urlList.indexOf(url) / 5 + 1);
    filepath = foldername + "/" + urlList.indexOf(url) + ".png.gz";
    zipstream(url, filepath);
});
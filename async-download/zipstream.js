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

fs.mkdirSync(__dirname + "/imagesFolder");

async.forEach(urlList,async function(url){
    console.log(urlList.indexOf(url));
    filepath = __dirname + "/imagesFolder" + "/"+urlList.indexOf(url)+ ".png.gz";
    zipstream(url, filepath);
});
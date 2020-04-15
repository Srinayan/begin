const fs = require('fs');
const request = require('request');
const zlib = require('zlib');


var stream = function(url,filepath){
    request(url).pipe(fs.createWriteStream(filepath));
}

stream("http://www.pngall.com/wp-content/uploads/4/Rick-And-Morty-PNG-Image.png", "stream.png");
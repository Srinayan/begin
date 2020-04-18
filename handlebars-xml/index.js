const Handlebars = require('handlebars');
const fs = require('fs');

var data = fs.readFileSync('input.json');
var jsonInput = JSON.parse(data);

var template  = Handlebars.compile(fs.readFileSync("template.handlebars").toString());

var xml = template({input:jsonInput});
console.log(xml);
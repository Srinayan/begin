var request = require('request');
var fs = require('fs');
const { resolve } = require('path');
class copyDocs{
    constructor(folderPath){
        this.folderPath = folderPath;
        this.mappingDictionary = new Map();
        this.integrationId ="No integration created";
    }
    postMethod(path,json){
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: 'https://api.integrator.io/v1' + path,
                headers: {
                    'Authorization': 'Bearer f668bbf09c0e4feca53633ae6d7050e8'
                },
                json: json
            }, function (error, response, body) {
                if (!error && response.statusCode == 201) {
                    resolve(body);
                }
                else{
                    console.log(path+":"+response.statusCode);
                    console.log(body);
                }
            })
        });
    }
    createIntegration(cb){
        const integrationPath = "/integrations";
        const integrationJson = JSON.parse(fs.readFileSync(this.folderPath + "/integration.json"));
        var method = this.postMethod(integrationPath, integrationJson);
        this.mappingDictionary.set("_integrationId", method);
        cb(method);
    }
    createConnections(){
        const connectionPath = "/connections";
        var foldername = this.folderPath;
        var dict = this.mappingDictionary
        var postMethod = this.postMethod;
        fs.readdir(foldername + connectionPath, function (err, files) {
            if(err){
                console.error(err);
                process.exit(1);
            }
            files.forEach(function(file,index){
                var connectionJson = JSON.parse(fs.readFileSync(foldername+connectionPath+"/"+file));
                var id = connectionJson._id;
                dict.set(id,postMethod(connectionPath,connectionJson));
            })
        });
    }
    createExports(cb) {
        const exportsPath = "/exports";
        var foldername = this.folderPath
        var dict  = this.mappingDictionary
        var postMethod = this.postMethod;
        fs.readdir(foldername + exportsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index) {
                var exportsJson = JSON.parse(fs.readFileSync(foldername+exportsPath+"/"+ file));
                var res = await dict.get(exportsJson._connectionId);
                exportsJson._connectionId = res._id;
                var method = postMethod(exportsPath, exportsJson);
                dict.set(exportsJson._id, method);
                cb(method);
            })
        });
    }
    createImports(cb){
        const importsPath = "/imports";
        var foldername = this.folderPath
        var dict = this.mappingDictionary
        var postMethod = this.postMethod;
        fs.readdir(foldername + importsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index) {
                var importsJson = JSON.parse(fs.readFileSync(foldername+importsPath+"/"+file));
                var res = await dict.get(importsJson._connectionId);
                importsJson._connectionId = res._id;
                var method = postMethod(importsPath, importsJson);
                dict.set(importsJson._id, method);
                cb(method);
            })
        });
    }
    createFlows(cb){
        const flowsPath = "/flows";
        var foldername = this.folderPath;
        var dict = this.mappingDictionary;
        var postMethod = this.postMethod;
        fs.readdir(foldername + flowsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index) {
                var flowsJson = JSON.parse(fs.readFileSync(foldername+flowsPath+"/"+file));
                try {
                    var integrationResponse = await dict.get("_integrationId");
                    flowsJson._integrationId = integrationResponse._id;
                } catch (error) {
                    console.log("Integration not processed");
                }
                try {
                    var exportResponse = await dict.get(flowsJson.pageGenerators[0]._exportId);
                    // console.log(flowsJson.pageGenerators[0]._exportId);
                    console.log(exportResponse)
                    flowsJson.pageGenerators[0]._exportId = exportResponse._id;
                } catch (error) {
                    console.log(error)
                    console.log("Export not processed");
                }
                try {
                    console.log(dict);
                    var importResponse = await dict.get(flowsJson.pageProcessors[0]._importId);
                    // console.log(flowsJson.pageProcessors[0]._importId);
                    console.log(importResponse)
                    flowsJson.pageProcessors[0]._importId = importResponse._id;
                } catch (error) {
                    console.log(error)
                    console.log("Import not processed");
                }
                // console.log(flowsJson);
                var method = postMethod(flowsPath, flowsJson);
                cb(method);
            })
        });
    }
    doesNothingCB() {
        //callback is only used for mocha testing
    }
    setup() {
        this.createIntegration(this.doesNothingCB);
        this.createConnections();
        this.createExports(this.doesNothingCB);
        this.createImports(this.doesNothingCB);
        this.createFlows(this.doesNothingCB);
    }
}
integration = new copyDocs("/Users/Srinayan/Documents/Celigo/copyDocs/5f133c557edd4f1c8bf9d664");
integration.setup();

module.exports={
    copyDocs
}
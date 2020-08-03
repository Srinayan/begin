var request = require('request');
var fs = require('fs');
const { resolve } = require('path');
class copyDocs{
    constructor(folderPath){
        this.folderPath = folderPath;
        this.mappingDictionary = new Map();
        this.integrationId ="No integration created";
        this.exportIds = []; 
        this.importIds = [];
        this.flowsIds = [];
    }
    postMethod(path,json){
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: 'https://api.integrator.io/v1' + path,
                headers: {
                    'Authorization': 'Bearer a7759096ade44327b38924460d229127'
                },
                json: json
            }, function (error, response, body) {
                if (!error && response.statusCode == 201) {
                    resolve(body._id);
                }
                else{
                    console.log(path+":"+response.statusCode);
                    console.log(error);
                }
            })
        });
    }
    createIntegration(){
        const integrationPath = "/integrations";
        const integrationJson = JSON.parse(fs.readFileSync(this.folderPath + "/integration.json"));
        this.integrationId = this.postMethod(integrationPath, integrationJson);
        return this.integrationId;
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
                const connectionJson = JSON.parse(fs.readFileSync(foldername+connectionPath+"/"+file));
                var id = connectionJson._id;
                dict.set(id,postMethod(connectionPath,connectionJson));
            })
        });
    }
    createExports() {
        const exportsPath = "/exports";
        var foldername = this.folderPath
        var dict  = this.mappingDictionary
        var postMethod = this.postMethod;
        var exportIds = this.exportIds;
        fs.readdir(foldername + exportsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index) {
                const exportsJson = JSON.parse(fs.readFileSync(foldername+exportsPath+"/"+ file));
                // exportsJson._connectionId = await dict.get(exportsJson._connectionId);
                var id = exportsJson._id;
                var exportId = postMethod(exportsPath, exportsJson);
                dict.set(id, exportId);
                exportIds.push(exportId);
            })
        });
    }
    createImports(){
        const importsPath = "/imports";
        var foldername = this.folderPath
        var dict = this.mappingDictionary
        var postMethod = this.postMethod;
        var importIds = this.importIds;
        fs.readdir(foldername + importsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index) {
                const importsJson = JSON.parse(fs.readFileSync(foldername+importsPath+"/"+file));
                // importsJson._connectionId = await dict.get(importsJson._connectionId);
                var id = importsJson._id;
                var importID = postMethod(importsPath, importsJson)
                dict.set(id, importID);
                importIds.push(importID);
            })
        });
    }
    createFlows(){
        const flowsPath = "/flows";
        var foldername = this.folderPath;
        var dict = this.mappingDictionary;
        var postMethod = this.postMethod;
        var integrationId = this.integrationId;
        var flowsId = this.flowsIds
        fs.readdir(foldername + flowsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index) {
                const flowsJson = JSON.parse(fs.readFileSync(foldername+flowsPath+"/"+file));
                flowsJson.pageProcessors[0]._importId = await dict.get(flowsJson.pageProcessors[0]._importId);
                flowsJson.pageGenerators[0]._exportId = await dict.get(flowsJson.pageGenerators[0]._exportId);
                flowsJson._integrationId = await integrationId;
                var flow = postMethod(flowsPath, flowsJson);
                flowsId.push(flow);
            })
        });
    }
    setup() {
        this.createIntegration();
        // this.createConnections();
        this.createExports();
        this.createImports();
        this.createFlows();
    }
}
// integration = new copyDocs("/Users/Srinayan/Documents/Celigo/copyDocs/5f133c557edd4f1c8bf9d664");
// integration.setup();

module.exports={
    copyDocs
}
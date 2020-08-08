var request = require('request');
var fs = require('fs');
const {
    resolve
} = require('path');
class Integration {
    constructor(folderPath) {
        this.folderPath = folderPath;
        this.dict = new Map();
        this.integrationID = "No integration created";
    }
    postMethod(path, json) {
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: 'https://api.integrator.io/v1' + path,
                headers: {
                    'Authorization': 'Bearer token'
                },
                json: json
            }, function (error, response, body) {
                if (!error && response.statusCode == 201) {
                    resolve(body);
                }
                else {
                    console.log(path + ":" + response.statusCode);
                    console.log(error);
                }
            })
        });
    }
    setupIntegration(cb) {
        const integrationPath = "/integrations";
        const integrationJson = JSON.parse(fs.readFileSync(this.folderPath + "/integration.json"));
        var response = this.postMethod(integrationPath, integrationJson);
        this.dict.set("integration.json", response);
        cb(response);
    }
    setupConnections(cb) {
        const connectionPath = "/connections";
        var foldername = this.folderPath;
        var dict = this.dict
        var postMethod = this.postMethod;
        
        fs.readdir(foldername + connectionPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            var responseCount = 0;
            files.forEach( function(file, index,array) {
                const connectionJson = JSON.parse(fs.readFileSync(foldername + connectionPath + "/" + file));
                var response =  postMethod(connectionPath, connectionJson);
                dict.set(file, response);
                responseCount++;
                if(responseCount==array.length){
                    cb(responseCount);
                }
            })
        });
    }
    setupExports(cb) {
        const exportsPath = "/exports";
        var foldername = this.folderPath;
        var dict = this.dict
        var postMethod = this.postMethod;
        fs.readdir(foldername + exportsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index,array) {
                const exportJson = JSON.parse(fs.readFileSync(foldername + exportsPath + "/" + file));
                try {
                    var connectionResponse = await dict.get(exportJson._connectionId);
                    exportJson._connectionId = connectionResponse._id;
                } catch (err) {
                    console.log(err);
                }
                var response = await postMethod(exportsPath, exportJson);
                dict.set(file, response);
                cb(response);
            })
        });
    }
    setupImports(cb) {
        const importsPath = "/imports";
        var foldername = this.folderPath;
        var dict = this.dict
        var postMethod = this.postMethod;
        fs.readdir(foldername + importsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index, array) {
                const importJson = JSON.parse(fs.readFileSync(foldername + importsPath + "/" + file));
                try {
                    var connectionResponse = await dict.get(importJson._connectionId);
                    importJson._connectionId = connectionResponse._id;
                } catch (err) {
                    console.log(err);
                }
                var response = await postMethod(importsPath, importJson);
                dict.set(file, response);
                cb(response);
            })
        });
    }
    setupFlows(cb) {
        const flowsPath = "/flows";
        var foldername = this.folderPath;
        var dict = this.dict;
        var postMethod = this.postMethod;
        fs.readdir(foldername + flowsPath, function (err, files) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach(async function (file, index) {
                const flowsJson = JSON.parse(fs.readFileSync(foldername + flowsPath + "/" + file));
                try {
                    var integrationResponse = await dict.get(flowsJson._integrationId);
                    flowsJson._integrationId = integrationResponse._id;
                } catch (error) {
                    console.log(error)
                }
                try {
                    var exportResponse = await dict.get(flowsJson.pageGenerators[0]._exportId);
                    flowsJson.pageGenerators[0]._exportId = exportResponse._id;
                } catch (error) {
                    console.log(error)
                }
                try {
                    var importResponse = await dict.get(flowsJson.pageProcessors[0]._importId);
                    flowsJson.pageProcessors[0]._importId = importResponse._id;
                } catch (error) {
                    console.log(error)
                }
                console.log(dict);
                var response = await postMethod(flowsPath, flowsJson);
                cb(response)
            })
        });
    }
    doesNothingCB(){
        //callback is only used for mocha testing
    }
    setup() {
        this.setupIntegration(this.doesNothingCB);
        this.setupConnections(this.doesNothingCB);
        this.setupExports(this.doesNothingCB);
        this.setupImports(this.doesNothingCB);
        this.setupFlows(this.doesNothingCB);
    }
}
integration = new Integration("/Users/Srinayan/Documents/Celigo/setupIntegration/Integration");
integration.setup();
// module.exports = {
//     Integration
// }

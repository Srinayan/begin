var request = require('request');
var fs =  require('fs');
const { resolve } = require('path');
class setupIntegration{
    constructor(folderPath){
        this.folderPath = folderPath;
        this.importConnectionID = "No import connection created";
        this.exportConnectionID = "No export connection created";
        this.importID = "No import created";
        this.exportID = "No export created";
        this.flowID = "No flow created";
        this.integrationID = "No integration created";
    }
    postMethod(path,json){
        return new Promise((resolve, reject) =>{request({
            method: 'POST',
            url: 'https://api.integrator.io/v1'+path,
            headers: {
                'Authorization': 'Bearer {api_token}'
            },
            json: json
            }, function (error, response, body){
                if (!error && response.statusCode == 201) {
                    resolve(body._id);
                }
            })
        });
    }
    createIntegration() {
        const integrationPath = "/integrations";
        const integrationJson = JSON.parse(fs.readFileSync(this.folderPath + "/integration.json"));
        this.integrationID = this.postMethod(integrationPath, integrationJson);
    }
    setupConnections(){
        const connectionsPath = "/connections";
        const importConnectionJson = JSON.parse(fs.readFileSync(this.folderPath + connectionsPath + "/importConnection.json"));
        this.postMethod(connectionsPath, importConnectionJson).then(function (result) {
            this.importConnectionID = result;
        });
        const exportConnectionJson = JSON.parse(fs.readFileSync(this.folderPath + connectionsPath + "/exportConnection.json"));
        this.postMethod(connectionsPath, exportConnectionJson).then(function (result) {
            this.exportConnectionID = result;
        })
    }
    setupExports(){
        const exportsPath = "/exports";
        const exportJson = JSON.parse(fs.readFileSync(this.folderPath + exportsPath + "/shopify_export.json"));
        this.exportID = this.postMethod(exportsPath, exportJson);
    }
    setupImports(){
        const importsPath = "/imports";
        const importJson = JSON.parse(fs.readFileSync(this.folderPath + importsPath + "/salesforce_import.json"));
        this.importID = this.postMethod(importsPath, importJson);
    }
    async setupFlows(){
        const flowsPath = "/flows";
        const flowsJson = JSON.parse(fs.readFileSync(this.folderPath + flowsPath + "/shopify_salesforce.json"));
        flowsJson.pageProcessors[0]._importId = await this.importID;
        flowsJson.pageGenerators[0]._exportId = await this.exportID;
        flowsJson._integrationId = await this.integrationID;
        this.postMethod(flowsPath, flowsJson);
        console.log("Integration setup completed");
    }
    setup(){
        this.createIntegration();
        this.setupExports();
        this.setupImports();
        this.setupFlows();
    }
}
integration = new setupIntegration("/Users/Srinayan/Documents/Celigo/setupIntegration/Integration");
integration.setup();
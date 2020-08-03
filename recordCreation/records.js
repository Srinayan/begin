var topologicalSort = require("/Users/Srinayan/Documents/Celigo/recordCreation/sortDependencies").topologicalSort;
var request = require('request');
var fs = require('fs');

function postMethod(path, json) {
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
            } else {
                console.log(path + ":" + response.statusCode);
                console.log(error);
            }
        })
    });
}

async function setUpIntegration(folderPath, executionOrder) {
    var connectionsPath = "/connections";
    var flowsPath = "/flows";
    var exportsPath = "/exports";
    var importsPath = "/imports";
    var dict = new Map();
    var dependencyGraph = JSON.parse(fs.readFileSync(folderPath + "/" + "dependencyGraph.json"));
    for (var i = 0; i < executionOrder.length; i++) {
        //integrations;
        console.log(executionOrder[i]);
        try{
            fs.accessSync(folderPath + "/" + executionOrder[i], fs.constants.F_OK);
            const Json = JSON.parse(fs.readFileSync(folderPath + "/" + executionOrder[i]));
            dict.set(executionOrder[i], postMethod('/integrations', Json));
        }
        catch(err){
             ;
            //pass;
        }
        //connections;
        // try {
        //     fs.accessSync(folderPath + connectionsPath + "/" + executionOrder[i], fs.constants.F_OK);
        //     const Json = JSON.parse(fs.readFileSync(folderPath + connectionsPath + "/" + executionOrder[i]));
        //     dict.set(executionOrder[i], postMethod(connectionsPath, Json));
        // } catch (err) {
        //    pass;
        // }
        //exports
        try {
            fs.accessSync(folderPath + exportsPath + "/" + executionOrder[i], fs.constants.F_OK);
            const Json = JSON.parse(fs.readFileSync(folderPath + exportsPath + "/" + executionOrder[i]));
            // Json._connectionId = await dict.get(dependencyGraph[executionOrder[i]]["hasDependencyOn"][0]);
            dict.set(executionOrder[i], postMethod(exportsPath, Json));
        } catch (err) {
            //pass;
        }
        //imports
        try {
            fs.accessSync(folderPath + importsPath + "/" + executionOrder[i], fs.constants.F_OK);
            const Json = JSON.parse(fs.readFileSync(folderPath + importsPath + "/" + executionOrder[i]));
            // Json._connectionId = await dict.get(dependencyGraph[executionOrder[i]]["hasDependencyOn"][0]);
            dict.set(executionOrder[i], postMethod(importsPath, Json));
        } catch (err) {
            //pass;
        }
        //flows
        try {
            fs.accessSync(folderPath + flowsPath + "/" + executionOrder[i], fs.constants.F_OK);
            const Json = JSON.parse(fs.readFileSync(folderPath + flowsPath + "/" + executionOrder[i]));
            for (var j = 0; j < dependencyGraph[executionOrder[i]]["hasDependencyOn"].length; j++) {
                try{
                    fs.accessSync(folderPath + importsPath + "/" + dependencyGraph[executionOrder[i]]["hasDependencyOn"][j], fs.constants.F_OK);
                    Json.pageProcessors[0]._importId = await dict.get(dependencyGraph[executionOrder[i]]["hasDependencyOn"][j]);
                }
                catch(err){
                    //pass
                }
                try {
                    fs.accessSync(folderPath + exportsPath + "/" + dependencyGraph[executionOrder[i]]["hasDependencyOn"][j], fs.constants.F_OK);
                    Json.pageGenerators[0]._exportId = await dict.get(dependencyGraph[executionOrder[i]]["hasDependencyOn"][j]);                
                } 
                catch(err) {
                    //pass
                }
                try {
                    fs.accessSync(folderPath + "/" + dependencyGraph[executionOrder[i]]["hasDependencyOn"][j], fs.constants.F_OK);
                    Json._integrationId = await dict.get(dependencyGraph[executionOrder[i]]["hasDependencyOn"][j]);
                } catch(err) {
                    //pass
                }
            }
            postMethod(flowsPath, Json)
        } catch (err) {
            //pass;
        }
    }
}
var executionOrder = topologicalSort("/Users/Srinayan/Documents/Celigo/recordCreation/integration/dependencyGraph.json")
console.log(executionOrder);
setUpIntegration("/Users/Srinayan/Documents/Celigo/recordCreation/integration", executionOrder);
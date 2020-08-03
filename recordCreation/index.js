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

function setUpIntegration(folderPath,executionOrder){
    var connectionsPath = "/connections";
    var flowsPath = "/flows";
    var exportsPath = "/exports";
    var importsPath = "/imports";
    var dict = new Map();
    var dependencyGraph = JSON.parse(fs.readFileSync(folderPath + "/" + "dependencyGraph.json"));
    for (var i = 0; i < executionOrder.length; i++) {
        //integrations;
        console.log(executionOrder[i]);
        fs.access(folderPath+"/"+executionOrder[i],fs.constants.F_OK,(err)=>{
            if(err){
                //pass;
                console.log(err);
                console.log(executionOrder[i]);
            }
            else{
                const Json = JSON.parse(fs.readFileSync(folderPath + "/" + executionOrder[i]));
                dict.set(executionOrder[i], postMethod('/integrations', Json));
            }
        })
        //connections;
        // fs.access(folderPath+connectionsPath+"/"+executionOrder[i],fs.constants.F_OK,(err)=>{
        //     if(err){
        //         //pass;         
        //     }
        //     else{
        //         const Json = JSON.parse(fs.readFileSync(folderPath + connectionsPath + "/" + executionOrder[i]));
        //         dict.set(executionOrder[i], postMethod(connectionsPath, Json));
        //     }
        // });
        //exports
        fs.access(folderPath + exportsPath + "/" + executionOrder[i], fs.constants.F_OK, (err) => {
            if (err) {
                //pass;         
            } 
            else {
                console.log("exports:"+executionOrder[i]);
                const Json = JSON.parse(fs.readFileSync(folderPath + exportsPath + "/" + executionOrder[i]));
                // Json._connectionId = dict.get(dependencyGraph[executionOrder[i]]["hasDependencyOn"][0]);
                dict.set(executionOrder[i], postMethod(exportsPath, Json));
            }
        });
        //imports
        fs.access(folderPath + importsPath + "/" + executionOrder[i], fs.constants.F_OK, (err) => {
            if (err) {
                //pass;         
            } 
            else {
                console.log("imports:"+executionOrder[i]);
                const Json = JSON.parse(fs.readFileSync(folderPath + importsPath + "/" + executionOrder[i]));
                // Json._connectionId = dict.get(dependencyGraph[executionOrder[i]]["hasDependencyOn"][0]);
                dict.set(executionOrder[i], postMethod(importsPath, Json));
            }
        });
        //flows
        fs.access(folderPath + flowsPath + "/" + executionOrder[i], fs.constants.F_OK, (err) => {
            if (err) {
                //pass;         
            } else {
                console.log("flows:" + executionOrder[i]);
                const Json = JSON.parse(fs.readFileSync(folderPath + flowsPath + "/" + executionOrder[i]));
                for (var j = 0; j<dependencyGraph[executionOrder[i]]["hasDependencyOn"].length;j++){
                    fs.access(folderPath + importsPath + "/" + dependencyGraph[executionOrder[i]]["hasDependencyOn"][j], fs.constants.F_OK, (err) => {
                        if (err) {
                            //pass;         
                        } 
                        else {
                            Json.pageProcessors[0]._importId = await dict.get(dependencyGraph[executionOrder[i]]["hasDependencyOn"][j]);
                        }
                    });
                    fs.access(folderPath + exportsPath + "/" + dependencyGraph[executionOrder[i]]["hasDependencyOn"][j], fs.constants.F_OK, (err) => {
                        if (err) {
                            //pass;         
                        } else {
                            Json.pageGenerators[0]._exportId = await dict.get(dependencyGraph[executionOrder[i]]["hasDependencyOn"][j]);
                        }
                    });
                    fs.access(folderPath + "/" + dependencyGraph[executionOrder[i]]["hasDependencyOn"][j], fs.constants.F_OK, (err) => {
                        if (err) {
                            //pass;         
                        } else {
                            Json._integrationId= await dict.get(dependencyGraph[executionOrder[i]]["hasDependencyOn"][j]);
                        }
                    });
                }
            }
        });
    }
}
var executionOrder = topologicalSort("/Users/Srinayan/Documents/Celigo/recordCreation/integration/dependencyGraph.json")
console.log(executionOrder);
setUpIntegration("/Users/Srinayan/Documents/Celigo/recordCreation/integration",executionOrder);
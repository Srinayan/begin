var request = require("request");

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        const info = JSON.parse(body);
        console.log(info)
    } else if (!error && response.statusCode == 201) {
        console.log(body);
    }
}
const getOptions = {
        method: 'GET',
        url: 'https://api.integrator.io/v1/imports',
        headers: {
            'Authorization': 'Bearer {api_token}'
        }
}
const postOptions = {
    method: 'POST',
    url: 'https://api.integrator.io/v1/imports',
    headers: {
        'Authorization': 'Bearer {api_token}'
    },
    json: {
        "name": "Salesforce Node Import",
        "_connectionId": "5f133df2fa0cad3b21d93eef",
        "ignoreExisting": true,
        "mapping": {
            "fields": [{
                    "extract": "id",
                    "generate": "ProductCode"
                },
                {
                    "extract": "title",
                    "generate": "Name"
                },
                {
                    "generate": "IsActive",
                    "hardCodedValue": "true"
                }
            ]
        },
        "salesforce": {
            "operation": "insert",
            "sObjectType": "Product2",
            "api": "soap",
            "idLookup": {
                "whereClause": "(ProductCode = {{{string id}}})"
            },
            "removeNonSubmittableFields": false
        },
        "adaptorType": "SalesforceImport"
    }
}


request(getOptions, callback);
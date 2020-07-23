var request = require("request");

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        const info = JSON.parse(body);
        console.log(info)
    } 
    else if (!error && response.statusCode == 201) {
        console.log(body);
    }
}

const getOptions = {
    method: 'GET',
    url: 'https://api.integrator.io/v1/flows',
    headers: {
        'Authorization': 'Bearer {api_token}'
    }
}

const postOptions = {
    method: 'POST',
    url: 'https://api.integrator.io/v1/flows',
    headers: {
        'Authorization': 'Bearer {api_token}'
    },
    json: {
        "name": "SS Node flow",
        "disabled": false,
        "_integrationId": "5f15bf50545ecc2a3245d6c4",
        "skipRetries": false,
        "pageProcessors": [{
            "responseMapping": {
                "fields": [],
                "lists": []
            },
            "type": "import",
            "_importId": "5f16979f64d2131f6645de43"
        }],
        "pageGenerators": [{
            "_exportId": "5f1694b426b1152832ec7a14"
        }]
    }
}



request(postOptions, callback);
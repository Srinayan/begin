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
    json: JSON.parse(fs.readFileSync("/Users/Srinayan/Documents/Celigo/Integrator API Calls/integration/import.json"))
}


request(getOptions, callback);
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
    url: 'https://api.integrator.io/v1/exports',
    headers: {
        'Authorization': 'Bearer {api_token}'
    }
}
const postOptions = {
    method: 'POST',
    url: 'https://api.integrator.io/v1/exports',
    headers: {
        'Authorization': 'Bearer {api_token}'
    },
    json: {
        name: "Shopify Node Export",
        description: "Exporting Products from shopify",
        _connectionId: "5f133d273dea9f68d8e28dd2",
        asynchronous: true,
        assistant: "shopify",
        http: {
            relativeURI: "/admin/products.json{{#compare export.http.paging.page \"!=\" \"1\"}}?page={{{export.http.paging.page}}}{{/compare}}",
            method: "GET",
            headers: [{
                name: "X-Shopify-Api-Features",
                value: "include-presentment-prices"
            }],
            successMediaType: "json",
            errorMediaType: "json",
            paging: {
                method: "page",
                page: 1,
                relativeURI: "/admin/products.json{{#compare export.http.paging.page \"!=\" \"1\"}}?page={{{export.http.paging.page}}}{{/compare}}",
                lastPageStatusCode: 404
            },
            response: {
                resourcePath: "products"
            }
        }
    }
}



request(getOptions, callback);
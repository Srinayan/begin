const {
    assert
} = require('chai');
var expect = require('chai').expect;
var nock = require('nock');


var setUp = require('/Users/Srinayan/Documents/Celigo/setupIntegration/integration.js').Integration;

var integration = new setUp("/Users/Srinayan/Documents/Celigo/setupIntegration/Integration");
var integratorApi = nock('https://api.integrator.io/v1/');
describe('Positive testing setupIntegration Class', function () {
    it('setupIntegrations() should return a string', function (done) {
        integratorApi
            .post('/integrations')
            .reply(201, {
                body: "Integration Id is returned"
            });
        var result = "Integration Id is returned";

        integration.setupIntegration(async function (response) {
            var r = await response
            assert.equal(r.body, result);
            done();
        })
    })
    it('setupConnections() should return an array of strings', function (done) {
        var result = "Connection Id is returned";
        integratorApi
            .post('/connections')
            .reply(201, {
                body: result
            });
        integratorApi
            .post('/connections')
            .reply(201, {
                body: result
            });
        integration.setupConnections(function (response) {
            assert.equal(response, 2);
            done();
        });
    })
    it('setupExports() should return an array of strings', function (done) {
        var result = "Export Id is returned";
        integratorApi
            .post('/exports')
            .reply(201, {
                body: result
            });
        integration.setupExports(function (response) {
            assert.equal(response.body, result);
            done();
        });
    })

    it('createImports() should return an array of strings', function (done) {
        var result = "Import Id is returned";
        integratorApi
            .post('/imports')
            .reply(201, {
                body: result
            });
        integration.setupImports(function (response) {
            assert.equal(response.body, result);
            done();
        });
    })

    it('createFlows() should return an array of strings', function (done) {
        var result = "Flow Id is returned";
        integratorApi
            .post('/flows')
            .reply(201, {
                body: result
            });
        integration.setupFlows(function (response) {
            assert.equal(response.body, result);
            done();
        });
    })
})
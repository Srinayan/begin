const { assert } = require('chai');
var expect = require('chai').expect;
var nock = require('nock');
var fs = require('fs');
const { doesNotMatch } = require('assert');
const { runInNewContext } = require('vm');


var copyDocs = require('/Users/Srinayan/Documents/Celigo/copyDocs/copyIntegrationDocs').copyDocs;

var integration = new copyDocs("/Users/Srinayan/Documents/Celigo/copyDocs/5f133c557edd4f1c8bf9d664");
var integratorApi = nock('https://api.integrator.io/v1/');
describe('Positive testing copyDocs Class',function(){
    it('createIntegration() should return a string', function (done) {
        integratorApi
        .post('/integrations')
        .reply(201, {body:"Integration Id is returned"});
        var result = "Integration Id is returned";

        integration.createIntegration(function (response) {
            assert.equal(response.body,result);
            done();
        })
    })
    it('createExports() should return an array of strings', function(done){
        var result = "Export Id is returned";
        integratorApi
            .post('/exports')
            .reply(201, {
                body: result
            });
        integration.createExports(function (response) {
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
        integration.createImports(function (response) {
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
        integration.createFlows(function (response) {
            assert.equal(response.body, result);
            done();
        });
    })
})
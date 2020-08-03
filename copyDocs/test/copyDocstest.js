const { assert } = require('chai');

var expect = require('chai').expect;
var copyDocs = require('/Users/Srinayan/Documents/Celigo/copyDocs/copyIntegrationDocs').copyDocs;

integration = new copyDocs("/Users/Srinayan/Documents/Celigo/copyDocs/5f133c557edd4f1c8bf9d664");
describe('Positive testing copyDocs Class',function(){
    it('createIntegration() should return a string', async function () {
        var result = await integration.createIntegration();
        assert.typeOf(result,'string','we have an integration id');
    })
    it('createExports() should return an array of strings', function(){
        integration.createExports();
        console.log(integration.exportIds);
        var arrayResult = integration.exportIds;
        assert.typeOf(arrayResult,'object');
        for (result in arrayResult) {
            assert.typeOf(result,'string','we have created an export');
        }
    })
    it('createImports() should return an array of strings', function () {
        integration.createImports();
        var arrayResult = integration.importIds;
        assert.typeOf(arrayResult, 'object');
        for (result in arrayResult) {
            assert.typeOf(result, 'string', 'we have created an import');
        }
    })

    it('createFlows() should return an array of strings', function () {
        integration.createFlows();
        var arrayResult = integration.flowsIds;
        assert.typeOf(arrayResult, 'object');
        for (result in arrayResult) {
            assert.typeOf(result, 'string', 'we have created an import');
        }
    })

})
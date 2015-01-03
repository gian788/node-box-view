var nodeBoxView = require('../lib'),
	should = require('should'),
	assert = require('assert'),
	pdfDocPath = './test/docs/test.pdf',
	pdfUrl = 'https://github.com/gian788/node-box-view/blob/master/test/doc/test.pdf';

var apiKey = process.env.APIKEY || process.argv[2];

var boxView = new nodeBoxView(apiKey || process.env.APIKEY);

describe('Testing upload', function () {
	it('upload file from disk', function (done) {
		this.timeout(10000)
		boxView.uploadFile(pdfDocPath, {}, function(err, boxFile){
		    if(err) return done(err);
		    
		    boxFile.should.be.instanceof(Object);
		    boxFile.type.should.be.equal('document');
		    done();	    
		});
	});

	it('upload file from url', function (done) {
		this.timeout(10000)
		boxView.uploadFromUrl(pdfUrl, {}, function(err, boxFile){
		    if(err) return done(err);

		    boxFile.should.be.instanceof(Object);
		    boxFile.type.should.be.equal('document');
		    done();	    
		});
	});
});


describe('Testing get', function () {
});
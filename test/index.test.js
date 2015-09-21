var nodeBoxView = require('../lib'),
	should = require('should'),
	assert = require('assert'),
	fs = require('fs'),
	pdfDocPath = './test/docs/test.pdf',
	pdfUrl = 'https://github.com/gian788/node-box-view/blob/master/test/doc/test.pdf';

var apiKey = process.env.APIKEY || process.argv[2];
apiKey = 'ulcwwj60olhu4knjowy8nz47s77r7ath'

var boxView = new nodeBoxView(apiKey || process.env.APIKEY);

var boxDocument;

describe('Testing upload', function () {
	it('uploadFile', function (done) {
		this.timeout(10000)
		boxView.uploadFile(pdfDocPath, {}, function(err, boxFile){
		    if(err) return done(err);

		    boxFile.should.be.instanceof(Object);
		    boxFile.type.should.be.equal('document');
		    done();	    
		    boxDocument = boxFile;
		});
	});

	it('uploadFromUrl', function (done) {
		this.timeout(10000)
		boxView.uploadFromUrl(pdfUrl, {}, function(err, boxFile){
		    if(err) return done(err);

		    boxFile.should.be.instanceof(Object);
		    boxFile.type.should.be.equal('document');
		    done();	    
		});
	});
});

var tempFile = './t.png';

describe('Testing get', function () {
	it('getDocuemnt', function (done) {
		boxView.getDocument(boxDocument.id, {}, function(err, boxFile){
		    if(err) return done(err);

		    boxFile.should.be.instanceof(Object);
		    boxFile.type.should.be.equal('document');
		    done();	    
		});
	});

	it('getDocumentThumbnail', function (done) {
		boxDocument.id = 'eb292edadeeb45af901d41bedb34ff5a';
		//boxDocument.id = 'eb292edadeeb45af901d41bdsad09809';
		boxView.getDocumentThumbnail(boxDocument.id, 50, 50, tempFile, function(err){
		    if(err) return done(err);

		    fs.statSync(tempFile).size.should.be.above(0);
		    fs.unlinkSync(tempFile);
		    done();	    
		});
	});	
});
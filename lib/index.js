var http = require('https'),
	fs 	 = require('fs'),
	request = require('request');
	
var documentUploadUrl = 'https://upload.view-api.box.com/1/documents',
	documentUrl = 'https://view-api.box.com/1/documents',
	sessionUrl = 'https://view-api.box.com/1/sessions';

/**
Allowed file type and relative MIME type

FILE TYPE	MIME TYPE
.pdf	application/pdf
.doc	application/msword
.docx	application/vnd.openxmlformats-officedocument.wordprocessingml.document
.ppt	application/vnd.ms-powerpoint
.pptx	application/vnd.openxmlformats-officedocument.presentationml.presentation
.xls	application/vnd.ms-excel
.xlsx	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
.txt	text/plain
.py	application/x-python
.py	text/x-python
.py	text/x-script.python
.js	text/javascript
.js	application/x-javascript
.js	application/javascript
.xml	text/xml
.xml	application/xml
.html	text/html
.css	text/css
.md	text/x-markdown
.pl	text/x-script.perl
.c	text/x-c
.m	text/x-m
.json	application/json
*/

module.exports = BoxViewer;

function BoxViewer (apiKey){
	this.apiKey = apiKey;

	this.request = function(url, data, method, callback){
		var options = {
	    	url: url,
	    	headers: { 
	    		'Authorization': 'Token ' + this.apiKey,
	    		//'Content-Type': 'application/json'
	    	},
	   }
	   if(data){
	   	if(method == 'get')
	   		options.data = data;
	   	else
	   		options.body = JSON.stringify(data);
	   }
	   //console.log(options)
		return request[method](options, callback);
	}
}

BoxViewer.prototype.fileTypes = ['pdf', 'doc', 'docx', 'ppt','pptx', 'xls', 'xlsx', 'txt', 'py', 
								 'js', '.xml', '.html', '.css', '.md', '.pl', '.c', '.m', '.json'];
   
/**
 * Return the list of uploaded documents
 * @param params 		object 		api params
 * @param callback	function 	callback function
 */
BoxViewer.prototype.getList = function(params, callback){
	var paramsStr = '?';
	for(var i in params)
		if(i == 'limit' || i == 'created_before' || i == 'created_after')
			paramsStr += i + '=' + params[i] + '&';
	req = request.get({
	    	url: documentUrl + paramsStr,
	    	headers: {
	    	'Authorization': 'Token ' + this.apiKey
	    	},
	    	data: params
	   }, function(err, res, body){    	
	  		if(err)
	  			return callback(err);
	  		//console.log('STATUS: ' + res.statusCode);
		   if(res.statusCode == 400)
		    	return callback(JSON.parse(body));	    
		   callback(null, JSON.parse(body));			    	
	   });
}

/**
 * Upload file from disk
 * @param file 		string 		file path
 * @param options	object 		options object
 * @param callback	function 	callback function
 */
BoxViewer.prototype.uploadFile = function(filePath, options, callback){
	var reqOptions = {
		url: documentUploadUrl, 
		formData: {
			name: options.fileName,
			file: fs.createReadStream(filePath)
		}, 
		headers: {
			'Authorization': 'Token ' + this.apiKey
		}
	};

	if(!options.fileName){
		var temp = filePath.split('/')
		reqOptions.formData.name = temp[temp.length - 1];
	}	
	if(options.non_svg)
		reqOptions.formData.non_svg = true;
	if(options.thumbnails)
		reqOptions.formData.thumbnails = options.thumbnails;

	request.post(reqOptions, function(err, res, body){    	
  		if(err) return callback(err);  		
	   	if(res.statusCode == 400) return callback(body);

	   	callback(null, JSON.parse(body));			    	
	});
}
   
/**
 * Upload file from url
 * @param file 		string 		file path
 * @param options	object 		options object
 * @param callback	function 	callback function
 */
BoxViewer.prototype.uploadFromUrl = function(url, options, callback){
	var reqOptions = {
		url: documentUrl, 
		body: {
			name: options.fileName,
			url: url
		}, 
		headers: {
			'Authorization': 'Token ' + this.apiKey,
			'Content-Type': 'application/json'
		}
	};

	if(!options.fileName){
		var temp = url.split('/')
		reqOptions.body.name = temp[temp.length - 1];
	}	
	if(options.non_svg)
		reqOptions.body.non_svg = true;
	if(options.thumbnails)
		reqOptions.body.thumbnails = options.thumbnails;

	reqOptions.body = JSON.stringify(reqOptions.body);

	request.post(reqOptions, function(err, res, body){
  		if(err) return callback(err);  		
	   	if(res.statusCode == 400) return callback(body);	    

	   	callback(null, JSON.parse(body));
 	});
}

/**
 * Get document meta
 * @param id 		Number 		document id
 * @param fields	Array 		list of fields to return
 * @param callback	Function 	callback function
 */
BoxViewer.prototype.getDocument = function(id, fields, callback){	
	var req = request.get({
	    	url: documentUrl + '/' + id,
	    	headers: {
	    	'Authorization': 'Token ' + this.apiKey
	    	},
	    	data: fields
	   }, function(err, res, body){    	
	  		if(err)
	  			return callback(err);
	  		//console.log('STATUS: ' + res.statusCode);
		   if(res.statusCode == 400)
		    	return callback(JSON.parse(body));	    
		   callback(null, body);			    	
	   });
}


/**
 * Get document content zip o pdf
 * @param id 			Number 		document id
 * @param zip 			Boolean	 	tru if the returned document will be a zip archive otherwise will be a pdf
 * @param callback	Function 	callback function
 */
BoxViewer.prototype.getDocumentContent = function(id, destPath, zip, callback){	
	var req = request.get({
	    	url: documentUrl + '/' + id + '/content.' + (zip ? 'zip' : 'pdf'),
	    	headers: {
	    	'Authorization': 'Token ' + this.apiKey
	    	},
	   }, function(err, res, body){    	
	  		if(err)
	  			return callback(err);
	  		//console.log('STATUS: ' + res.statusCode);
		   if(res.statusCode == 400)
		    	return callback(JSON.parse(body));
		   fs.writeFile(destPath, body, function(err) {
			   if(err)
			      return callback(err);
				callback();
			}); 
	   });
}

/**
 * Get document thumbnail
 * @param id 			Number 		document id
 * @param width 		Number 		thumbnail width(px)
 * @param heigth 		Number 		thumbanil heigth(px)
 * @param callback	Function 	callback function
 */
BoxViewer.prototype.getDocumentThumbnail = function(id, width, height, destPath, callback){
	if(width < 16 || width > 1024)
		return callback('Invalid thumbnail width. Width must be between 16 and 1024 px');
	if(height < 16 || height > 768)
		return callback('Invalid thumbnail height. Height must be between 16 and 768 px');
	
	var req = request.get({
	    	url: documentUrl + '/' + id + '/thumbnail?width=' + width + '&height=' + height,
	    	headers: {
	    	'Authorization': 'Token ' + this.apiKey
	    	}
	   }, function(err, res, body){    	
	  		if(err)
	  			return callback(err);
	  		//console.log('STATUS: ' + res.statusCode);
		   if(res.statusCode == 400)
		    	return callback(body);	    
		   fs.writeFile(destPath, body, function(err) {
			   if(err)
			      return callback(err);
				callback();
			});
	   });
}

/**
 * Update document meta
 * @param id 			Number 		document id  
 * @param data			Object 		document meta    	 
 * @param callback	Function 	callback function
 */
BoxViewer.prototype.updateDocument = function(id, data, callback){
	if(!data.name)
		return callback('Invalid arguments: name required.');
	var req = request.put({
	    	url: documentUrl + '/' + id,
	    	headers: {
	    		'Authorization': 'Token ' + this.apiKey,
 				'Content-Type': 'application/json'
	    	},
	    	body: JSON.stringify({name: data.name})
	   }, function(err, res, body){    	
	  		if(err)
	  			return callback(err);
	  		//console.log('STATUS: ' + res.statusCode);
		   if(res.statusCode == 400)
		    	return callback(JSON.parse(body));	    
		   callback(null, body);			    	
	   });
}

/**
 * Delete document
 * @param id 			Number 		document id    	 
 * @param callback	Function 	callback function
 */
BoxViewer.prototype.deleteDocument = function(id, callback){
	var req = request.del({
	    	url: documentUrl + '/' + id,
	    	headers: {
	    		'Authorization': 'Token ' + this.apiKey
	    	}
	   }, function(err, res, body){    	
	  		if(err)
	  			return callback(err);
	  		//console.log('STATUS: ' + res.statusCode);
		   if(res.statusCode == 400)
		    	return callback(JSON.parse(body));	    
		   callback(null, id);			    	
	   });	
}

/**
 * Get document session
 * @param id 			Number 		document id    	 
 * @param callback	Function 	callback function
 */
BoxViewer.prototype.getDocumentSession = function(id, callback){
	var req = request.post({
	    	url: sessionUrl,
	    	headers: {
	    		'Authorization': 'Token ' + this.apiKey,
	    		'Content-Type': 'application/json'
	    	},
	    	body: JSON.stringify({document_id: id})
	   }, function(err, res, body){
	  		if(err)
	  			return callback(err);
	  		
		   if(res.statusCode == 400)
		    	return callback(body);
		   if(res.statusCode == 202)
		   	return callback(null, {retryAfter: res.headers['Retry-After']});   
		   callback(null, JSON.parse(body));			    	
	   });
}



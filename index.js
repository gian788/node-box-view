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
*/

module.exports = BoxViewer;

function BoxViewer (apiKey){
	this.apiKey = apiKey;

	this.request = function(url, data, method, callback){
		var options = {
	    	url: url,
	    	headers: { 
	    		'Authorization': 'Token ' + this.apiKey,
	    		'Content-Type': 'application/json'
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

BoxViewer.prototype.fileTypes = ['doc','docx','pdf','ppt','pptx'];
   
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
 * @param callback	function 	callback function
 */
BoxViewer.prototype.uploadFile = function(filePath, options, callback){
	var _this = this;

	if(!options.fileName){
		var temp = filePath.split('/')
		options.fileName = temp[temp.length - 1];
	}	

	fs.readFile(filePath, function(err, doc){
		if(err)
			return callback(err);
		var req = _this.request(documentUploadUrl, {}, 'post', function(err, res, body){    	
	  		if(err)
	  			return callback(err);
	  		//console.log('STATUS: ' + res.statusCode);
		   if(res.statusCode == 400)
		    	return callback(body);	    
		   callback(null, JSON.parse(body));			    	
    	});

		var form = req.form();
		form.append('file', new Buffer(doc), {filename: options.fileName});
		form.append('parent_id', 0);
	});	
}
   
/**
 * Upload file from url
 * @param file 		string 		file path
 * @param callback	function 	callback function
 */
BoxViewer.prototype.uploadFromUrl = function(url, callback){
	request.post({
			url: documentUrl,
			headers: { 
	    		'Authorization': 'Token ' + this.apiKey,
	    		'Content-Type': 'application/json'
	    	},
	    	body: JSON.stringify({url: url})
		},
		function(err, res, body){
	  		if(err)
	  			return callback(err);
	  		//console.log('STATUS: ' + res.statusCode);
		   if(res.statusCode == 400)
		    	return callback(body);	    
		   callback(null, JSON.parse(body));
	 	});
}

/**
 * Get document meta
 * @param id 			Number 		document id
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



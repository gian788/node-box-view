# Node-box-view

[Node.js](http://nodejs.org) client library for [Box View API](https://developers.box.com/view/).

```
npm install node-box-view
```

## Quick Example

```js
var boxViewLib = require('node-box-view'),
	boxView = new boxViewLib(YOUR_API_KEY);

```

# Documentation
For general API documentaion, please review the [Box View API Documentation](https://developers.box.com/view).

Fetches a list of all documents uploaded
```js
boxView.getList({}, function(err, res){
	/* Example Response 
	{
		"document_collection": {
			"total_count": 1,
				"entries": [
					{
						"type": "document",
						"id": "e460608a44c84c02b70a020e7f516de3",
						"status": "done",
						"name": "",
						"created_at": "2013-09-12T19:01:34Z"
					}
				]
			}
	}
	*/
});
```
Retrieves the metadata for a single document.
```js
boxView.getDocument(DOCUMENT_ID, {}, function(err, res){
	/* Example Response
	{
		"type": "document",
		"id": DOCUMENT_ID,
		"status": "done",
		"name": "Leaves of Grass",
		"created_at": "2013-08-30T00:17:37Z"
	}
	*/
});
```
Uploading a document from url.
```js
boxView.uploadFile('./test.pdf', {}, function(err, res){
	/* Example Response
	{
		"type": "document",
		"id": "2da6cf9261824fb0a4fe532f94d14625",
		"status": "processing",
		"name": "",
		"created_at": "2013-08-30T00:17:37Z"
	}
	*/
});
```
Uploading a document from file.
```js
boxView.uploadFromUrl('https://bitcoin.org/bitcoin.pdf', function(err, res){
	/* Example Response
	{
		"type": "document",
		"id": "2da6cf9261824fb0a4fe532f94d14625",
		"status": "done",
		"name": "",
		"created_at": "2013-08-30T00:17:37Z"
	}
	*/
});
```
Retrieve a thumbnail image of the first page of a document. 
Thumbnails can have a width between 16 and 1024 pixels and a height between 16 and 768 pixels.
```js
boxView.getDocumentThumbnail(DOCUMENT_ID, 1024, 768, './thumb.jpg', function(err, res){
	// Do something
});
```
Updates the metadata of a specific document.
```js
boxView.updateDocument(DOCUMENT_ID, {name: 'NEW NAME'}, function(err, res){
	// Do something
});
```
Removes a document completely from the View API servers.
```js
boxView.deleteDocument(DOCUMENT_ID, function(err, res){
	// Do something
});
```
Create a session to view the document.
```js
boxView.getDocumentSession(DOCUMENT_ID, function(err, res){
	// Do something
});
```
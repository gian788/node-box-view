# Node-box-view
=========

[Node.js](http://nodejs.org) client library for [Box View API](https://developers.box.com/view/).

## Quick Example

```javascript
var boxViewLib = require('node-box-view'),
	boxView = new boxViewLib(YOUR_API_KEY);

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

boxView.getDocumentThumbnail(DOCUMENT_ID, 1024, 768, './thumb.jpg', function(err, res){
	// Do something
});

boxView.updateDocument(DOCUMENT_ID, {name: 'NEW NAME'}, function(err, res){
	// Do something
});

boxView.deleteDocument(DOCUMENT_ID, function(err, res){
	// Do something
});

boxView.getDocumentSession(DOCUMENT_ID, function(err, res){
	// Do something
});
```
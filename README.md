# Node-box-view

[Node.js](http://nodejs.org) client library for [Box View API](https://box-view.readme.io/reference).

[![Build Status](https://travis-ci.org/gian788/node-box-view.png?branch=master)](https://travis-ci.org/gian788/node-box-view)

### Installation
```
npm install node-box-view
```

## Usage

```js
var boxViewLib = require('node-box-view'),
	boxView = new boxViewLib(YOUR_API_KEY);
```
For general API documentaion, please review the [Box View API Documentation](https://box-view.readme.io/reference).

### getList(options, callback)
Fetches a list of all documents uploaded using this API Key.

* `options (object)`:
	- `limit (int)` - The number of documents to return (default=10, max=50)
	- `created_before (Date)` - An upper limit on the creation timestamps of documents returned (default=now)
	- `created_after (Date)` - A lower limit on the creation timestamps of documents returned
* `callback (function)` - A callback with the following arguments:
	- an error object or `null`
	- JSON-parsed response data

Response example:
```json
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
```

### getDocument(documentId, fields, callback)
Retrieves the metadata for a single document.

* `documentId` - Document ID
* `fields` ()- Array of fields to return (id and type are always) 
* `callback (function)` - A callback with the following arguments:
	- an error object or `null`
	- JSON-parsed response data

Response example:
```json
	{
		"type": "document",
		"id": "documentId",
		"status": "done",
		"name": "Leaves of Grass",
		"created_at": "2013-08-30T00:17:37Z"
	}
```

### uploadFile(file_path, options, callback)
Uploading a document from url.

* `file_path (string)` - A path to a file to read
* `options (object)`:
	- `fileName (string)` - The name of the file. If options.params.name is not set, it will be inferred from the file path.
	- `thumnails(string)` - Comma-separated list of thumbnail dimensions of the format {width}x{height} (e.g. '128×128,256×256') – width can be between 16 and 1024, height between 16 and 768
	- `non_svg (boolean)` - Whether to also create the non-svg version of the document, default=false. [read more here](https://developers.box.com/view/#non-svg)
* `callback (function)` - A callback with the following arguments:
	- an error object or `null`
	- JSON-parsed response data

Response example:
```json
	{
		"type": "document",
		"id": "2da6cf9261824fb0a4fe532f94d14625",
		"status": "processing",
		"name": "",
		"created_at": "2013-08-30T00:17:37Z"
	}
```

### uploadFromUrl(url, callback)
Uploading a document from file.

* `url (string)` - The URL of the ocument to be converted.
* `options (object)`:
	- `fileName (string)` - The name of the file. If options.params.name is not set, it will be inferred from the file path.
	- `thumnails(string)` - Comma-separated list of thumbnail dimensions of the format {width}x{height} (e.g. '128×128,256×256') – width can be between 16 and 1024, height between 16 and 768
	- `non_svg (boolean)` - Whether to also create the non-svg version of the document, default=false. [read more here](https://developers.box.com/view/#non-svg)
* `callback (function)` - A callback with the following arguments:
	- an error object or `null`
	- JSON-parsed response data

Response example:
```json
	{
		"type": "document",
		"id": "2da6cf9261824fb0a4fe532f94d14625",
		"status": "done",
		"name": "",
		"created_at": "2013-08-30T00:17:37Z"
	}
```

### getDocumentThumbnail(documentId, width, height, file, callback)
Retrieve a thumbnail image of the first page of a document. 
Thumbnails can have a width between 16 and 1024 pixels and a height between 16 and 768 pixels.

* `documentId (string)` - Document ID.
* `width (int)` - The width of the thumbnail in pixels, between 16 and 1024
* `heigth (int)` - The height of the thumbnail in pixels, between 16 and 768
* `file (string)` - PNG thumbnail destination file path (include file name and extention)
* `callback (function)` - A callback with the following arguments:
	- an error object or `null`
	- JSON-parsed response data

### updateDocument(documentId, options, callback)
Updates the metadata of a specific document.

* `documentId (string)` - Document ID
* `options (object)`:
	- `name (string)` - The name of the document
* `callback (function)` - A callback with the following arguments:
	- an error object or `null`
	- JSON-parsed response data

### deleteDocument(documentId, callback)
Removes a document completely from the View API servers.

* `documentId (string)` - Document ID.
* `callback (function)` - A callback with the following arguments:
	- an error object or `null`
	- JSON-parsed response data

### getDocumentSession(documentId, callback)
Create a session to view the document.

* `documentId (string)` - Document ID.
* `callback (function)` - A callback with the following arguments:
	- an error object or `null`
	- JSON-parsed response data

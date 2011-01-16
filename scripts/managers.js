// this contains the brand new, shiny and beautifully working and reliable download and upload managers

function DownloadManager(obj) {

  this.parent = obj;
  this.targetFolder = new air.File();
  this.queue = [];
  this.tempName = "";
  this.tempData = "";
  this.tempId = 0;
  this.connection = new Data(this);
  this.isDownloadingFolder = false;
  
  this.transfer = function(type, id) {
  
	this.isDownloadingFolder = false;
  
    if ((type == "folder") || (type == "Folder")) {

		this.isDownloadingFolder = true;
	
		this.connection.get("folder", id, this);
	
    } else if (type == "selection") {
	
      for (x in id) {
      
        this.add(id[x]);
      
      }

      this.targetFolder.addEventListener(air.Event.SELECT, window.huddle.transfer.manager.download);
      this.targetFolder.addEventListener(air.Event.CANCEL, window.huddle.transfer.destroy);
      this.targetFolder.browseForDirectory("Where would you like to put these files?");
    
    } else if ((type == "file") || (type == "File")) {
    
      this.add(id);

      this.targetFolder.addEventListener(air.Event.SELECT, window.huddle.transfer.manager.download);
      this.targetFolder.addEventListener(air.Event.CANCEL, window.huddle.transfer.destroy);
      this.targetFolder.browseForDirectory("Where would you like to put this file?");
    
    } else {
  
      window.huddle.window.messages.go("<b>Oops!</b><br><br>Looks like Clustr Desktop had an issue initialising your download (code 02-01).<br><br>Attempting to load Dashboard...", window.huddle.window.page.newDashboard, 3000);
      
      this.parent.destroy();
    
    }
  
  }
  
  this.add = function(fileId) {
  
    this.queue.push(fileId);

  }
  
  this.download = function() {
  // doesnt use (this) to bring everything back in scope
  
    if (window.huddle.transfer.manager.queue.length > 0) {
    
      window.huddle.transfer.manager.downloadFile(window.huddle.transfer.manager.queue.pop());
    
    } else {
    
      window.huddle.transfer.destroy();
    
    }
  
  }
  
  this.downloadFile = function(id) {
  
    this.connection.get("file", id, this);
    
    this.tempId = id;

  }
  
  this.process = function(data) {

	if (this.isDownloadingFolder) {
	
		for(d in data.Data) {
			var obj = data.Data[d];
			if (obj.Type == "File") {
				this.add(obj.Id);
			}
		}
		
		this.isDownloadingFolder = false;
		
		this.targetFolder.addEventListener(air.Event.SELECT, window.huddle.transfer.manager.download);
		this.targetFolder.addEventListener(air.Event.CANCEL, window.huddle.transfer.destroy);
		this.targetFolder.browseForDirectory("Where would you like to put the files in this folder?");
	
	} else {
  
		this.tempName = data.Data.FileName;
    
		this.doDownload(this.tempId);
	
	}
  
  }
  
  this.doDownload = function(id) {

    // request forming
    var airRequest = new air.URLRequest("https://my.huddle.net/files/" + id);

    airRequest.method = air.URLRequestMethod.GET;
	
	airRequest.requestHeaders[0] = new air.URLRequestHeader("Authorization","Basic " + Base64.encode(window.huddle.getUsername() + ":" + window.huddle.getPassword()));
    
    loader = new air.URLLoader();
    
    loader.dataFormat = air.URLLoaderDataFormat.BINARY;

    // event listener waiting for file to be downloaded
    loader.addEventListener(air.Event.COMPLETE, function(event) {
      window.huddle.transfer.manager.completeDownload(event.target.data);
    });
	
	loader.addEventListener(air.HTTPStatusEvent.HTTP_STATUS, function(event) {
		if (event.status != 200) {
			
			window.huddle.window.messages.overwrite("<b>Oops!</b><br><br>Looks like there was trouble doing the download (code 02-02).<br><br>Please wait...", window.huddle.window.page.newFile, 5000);
			this.parent.destroy();
			
		}
	});

    loader.load(airRequest);
	
  }
  
  this.completeDownload = function(data) {
    
    theFile = this.targetFolder.resolvePath(this.tempName);
    
    // writes the file downloaded to the hard drive
    var fileStream = new air.FileStream();
    fileStream.open(theFile, air.FileMode.WRITE);
    fileStream.writeBytes(data);
    fileStream.close();  
    
    this.tempName = "";
    this.tempData = "";
    this.tempId = 0;
    
    this.download();
  
  }

}

function UploadManager(obj) {

  this.parent = obj;
  this.queue = [];
  this.total = 0;
  this.target = 0;
  this.errors = 0;

  this.transfer = function(data, id) {

    this.queue = data;
    this.total = data.length;
    this.target = id;
    
    if (this.total > 0) {
 
      window.huddle.window.messages.show("<BR><span id='remaining'>" + this.total + "</span> files of " + this.total + " remaining<BR><span id='errors'>0</span> errors encountered<BR><BR><span id='percentage'></span>", 800);
    
      this.upload();
      
    } else {
    
      this.parent.destroy();
    
    }
  
  }
  
  this.upload = function() {
  
    if (this.queue.length > 0) {

      this.uploadFile(this.queue.pop(), this.target);
    
    } else {
    
      if (this.errors > 0) {
      
        window.huddle.window.messages.show("Apologies, an error occured (code 02-03).", 0);
      
        setTimeout(window.huddle.transfer.destroy, 3000);
      
      } else {
      
        this.parent.destroy();
        
      }
    
    }
  
  }
  
  this.uploadFile = function(file, target) {

    // set credentials - only works ONCE each session
    air.URLRequestDefaults.setLoginCredentialsForHost("huddle.net", window.huddle.getUsername(), window.huddle.getPassword());

    // form request
    var airRequest = new air.URLRequest("https://api.huddle.net/v1/json/files/upload");
     
    var variables = new air.URLVariables();
    variables.folderid = target;
    airRequest.data = variables; // add folder id to request

    airRequest.method = air.URLRequestMethod.POST;

    var fileUpload = new air.File(file.nativePath);

    airRequest.contentType = 'multipart/form-data';

    // event listeners to handle upload completed
    fileUpload.addEventListener(air.Event.COMPLETE, function() {
      length = window.huddle.transfer.manager.queue.length;
      if (length == null) { length = 0; }
      window.huddle.window.messages.change("remaining", length);
      window.huddle.transfer.manager.upload();
    });
    
    // error listener
    fileUpload.addEventListener(air.IOErrorEvent.IO_ERROR, function() {
      window.huddle.transfer.manager.errors = window.huddle.transfer.manager.errors + 1;
      window.huddle.window.messages.change("errors", window.huddle.transfer.manager.errors);
      window.huddle.transfer.manager.upload();
    });
    
    // listener which is fired periodically / sporadically during upload to gauge amount complete
    fileUpload.addEventListener(air.ProgressEvent.PROGRESS, function(event) { 
      loaded = event.bytesLoaded; 
      total = event.bytesTotal;
      percentage = Math.ceil( (loaded / total) * 100 ); // calculate total complete so far
      window.huddle.window.messages.change("percentage", percentage + "% complete");
      if(percentage == 100) {
        window.huddle.window.messages.change("percentage", percentage + "% complete <img src='/imgs/tick.png' id='tick'>");
      }
    });
    
    // do the upload
    fileUpload.upload(airRequest, 'file', false); 

  }

}
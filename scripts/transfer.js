/*

this is a helper class for the download and upload managers - makes it supremely stable and much more able to 
handle errors in transfer

*/

function Transfer(isDownload) {

  this.isDownload = isDownload;
  this.manager = null;
  this.sourceType = "";
  this.sourceID = "";
  
  this.init = function(sourceType, sourceID) {

    this.sourceType = sourceType;
    this.sourceID = sourceID;
  
    if (this.isDownload) {
      
      window.huddle.window.messages.go("<b>Downloading</b>");
      
      this.manager = new DownloadManager(window.huddle.transfer);
    
    } else {
    
      window.huddle.window.messages.go("<b>Uploading</b>");
    
      this.manager = new UploadManager(window.huddle.transfer);
    
    }
  
  }
  
  this.download = function(type, id) {
  
    if (this.isDownload) {
    
      this.manager.transfer(type, id);
    
    } else {
    
      window.huddle.window.messages.go("<b>Oops!</b><br><br>Looks like Clustr Desktop had an internal error dealing with your upload or download (code 03-01).<BR><BR>Returning to Dashboard...", window.huddle.window.page.newDashboard, 3000);
      
      this.destroy();
    
    }
  
  }
  
  this.upload = function(data, id) {
  
    if (!this.isDownload) {
    
      this.manager.transfer(data, id);
    
    } else {
    
      window.huddle.window.messages.go("<b>Oops!</b><br><br>Looks like Huddle Desktop had an internal error dealing with your download or upload (code 03-02).<BR><BR>Returning to Dashboard...", window.huddle.window.page.newDashboard, 3000);
      
      this.destroy();
    
    }
  
  }
  
  this.destroy = function() {
  
    window.systray.notify();
  
    window.huddle.window.messages.stop();

    window.huddle.window.page.change(window.huddle.transfer.sourceType, window.huddle.transfer.sourceID);
  
    window.huddle.transfer = null;
  
  }

}
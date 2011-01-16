/*

handles checking for updates online, what to do when there is one found etc

*/

function Update() {

  this.connection = new Data(this);
  this.response;
  this.isUpdate = false;
  this.isRequired = false;
  this.string;
    
  this.update = function() {
  
    this.connection.get("update", 0, this);
  
  }
  
  this.process = function(response) {

    window.huddle.updater.response = response.Data;

    if ((window.huddle.release < window.huddle.updater.response[0].Release) || ((window.huddle.release == window.huddle.updater.response[0].Release) && (window.huddle.version < window.huddle.updater.response[0].Version)) || ((window.huddle.release == window.huddle.updater.response[0].Release) && (window.huddle.version == window.huddle.updater.response[0].Version) && (window.huddle.minor < window.huddle.updater.response[0].Minor))) {
    
      window.huddle.updater.isUpdate = true;
      
      window.huddle.updater.string = "A recommended update is available for download. Would you like to install it now?<BR /><BR /><span id='link'>Yes</span> | <span id='dashboard'>No</span>";
      
      if ((window.huddle.updater.response[0].Required == "true") || (((window.huddle.release < window.huddle.updater.response[0].LastRequired.Release) || ((window.huddle.release == window.huddle.updater.response[0].LastRequired.Release) && (window.huddle.version < window.huddle.updater.response[0].LastRequired.Version)) || ((window.huddle.release == window.huddle.updater.response[0].LastRequired.Release) && (window.huddle.version == window.huddle.updater.response[0].LastRequired.Version) && (window.huddle.minor < window.huddle.updater.response[0].LastRequired.Minor))))) {
      
        window.huddle.updater.string = "A required update is available for download. You must install the new version to proceed.<BR /><BR /><span id='link'>Download Now</span>";
      
        window.huddle.updater.isRequired = true;
      
      }
    
    }

  }
  
  this.listeners = function() {
    
    $("#link").click(function() {
      air.navigateToURL(new air.URLRequest(window.huddle.updater.response[0].Url));
      setTimeout(window.huddle.window.closeApp, 500);
    });
    
    if (!this.isRequired) {
    
      $("#dashboard").click(function() {window.huddle.window.page.newDashboard();});
    
    }
  
  }

}
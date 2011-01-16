function Data(inObj) { // handles all json api calls
  
  this.parent = inObj;
  
  // makes a json request, calls callback function passed
  this.get = function(type, id, obj) {

    this.parent = obj;
    window.object = obj;

    switch(type) {
    
      case "login":
        obj.process("<div id='login'>Welcome to Clustr Desktop. Please sign in below:<form>Huddle Username<input type='text' id='userin' disabled='disabled' value='" + window.huddle.keystore.getUsername() + "'>Huddle Password<input type='password' id='passin' disabled='disabled' value='" + window.huddle.keystore.getPassword() + "'><input id='checkbox' type='checkbox' class='checkbox' " + window.huddle.keystore.getChecked() + "><button type='button' id='submit' disabled='disabled'>...</button><span>Remember Me</span></form><p><a href='http://clustr.me.uk'>What is Clustr?</a> | <a href='http://g.chris-alexander.co.uk/?id=1274X516320&url=http%3A%2F%2Fwww.jdoqocy.com%2Fclick-3731164-10712079'>What is Huddle?</a> | <a href='http://g.chris-alexander.co.uk/?id=1274X516320&url=http%3A%2F%2Fwww.jdoqocy.com%2Fclick-3731164-10712079'>Register</a></p></div>");
        break;
    
      case "dashboard":
        $.ajax({type: "GET", url: "https://api.huddle.net/v1/json/workspaces/", dataType: "json", username: window.huddle.getUsername(), password: window.huddle.getPassword(), success: window.object.connection.process, complete: window.object.connection.check});
        break;
    
      case "workspace":
        $.ajax({type: "GET", url: "https://api.huddle.net/v1/json/workspaces/" + id + "/items", dataType: "json", username: window.huddle.getUsername(), password: window.huddle.getPassword(), success: window.object.connection.process, complete: window.object.connection.check});
        break;
        
      case "folder":
        $.ajax({type: "GET", url: "https://api.huddle.net/v1/json/folders/" + id + "/items", dataType: "json", username: window.huddle.getUsername(), password: window.huddle.getPassword(), success: window.object.connection.process, complete: window.object.connection.check});
        break;
        
      case "file":
        $.ajax({type: "GET", url: "https://api.huddle.net/v1/json/files/" + id + "", dataType: "json", username: window.huddle.getUsername(), password: window.huddle.getPassword(), success: window.object.connection.process, complete: window.object.connection.check});
        break;
        
      case "whatsnewdashboard":
        $.ajax({type: "GET", url: "https://api.huddle.net/v1/json/whats-new?count=20", dataType: "json", username: window.huddle.getUsername(), password: window.huddle.getPassword(), success: window.object.connection.process, complete: window.object.connection.check});
        break;
        
      case "whatsnew":
        $.ajax({type: "GET", url: "https://api.huddle.net/v1/json/workspaces/" + id + "/whats-new?count=20", dataType: "json", username: window.huddle.getUsername(), password: window.huddle.getPassword(), success: window.object.connection.process, complete: window.object.connection.check});
        break;
        
      case "update":
        $.ajax({type: "GET", url: "http://clustr.me.uk/update/update.json", dataType: "json", success: window.huddle.updater.process});
        break;
    
      default: // catch any errors in variables passed
        window.huddle.window.messages.go("<b>Oops!</b><BR>Sorry, looks like Clustr Desktop had an internal error fetching your page (code 05-03).<BR><BR>Attempting to load Dashboard...", window.huddle.window.page.newDashboard, 3000);
        break;
    
    }

  }
  
  // processes the request so that subsequent functions are back in scope
  this.process = function(response) {

    window.object.process(response);
    
    window.object = null;
  
  }
  
  // performs checks on the status of the request, displaying nice error messages if required
  this.check = function(request, textStatus, errorThrown) {

      if (textStatus == "error") {
      
        error = request.status;
        
        if (error == 401) {
      
          window.huddle.window.messages.go("<b>Oops!</b><BR>Sorry, looks like there was an authentication error (code 05-01).<BR><BR>Now proceeding to login...", window.huddle.window.page.newLoginPage, 3000);
          
        } else if (error == 400) {
        
          window.huddle.window.messages.go("<b>Oops!</b><BR>Sorry, looks like there was a problem with the request (code 05-02).<BR><BR>Attempting to load Dashboard...", window.huddle.window.page.newDashboard, 3000);
        
        } else {
        
          window.huddle.window.messages.go("<b>Oops!</b><BR>Sorry, looks like there was an unknown error with the request (code 05-03-" + error + ").<BR><BR>Attempting to load Dashboard...", window.huddle.window.page.newDashboard, 3000);
        
        }
      
      } else {
      
        if (window.huddle.window.firstRequest) { // this is a handshake to get over a little quirk where auth details aren't sent first time even though they're required

          /* begin handshake */
          air.URLRequestDefaults.setLoginCredentialsForHost("huddle.net", window.huddle.getUsername(), window.huddle.getPassword());
          loader = new air.URLLoader();
          request = new air.URLRequest("https://api.huddle.net/v1/json/workspaces");
          try {loader.load(request); } catch (e) {}
          /* end handshake */
          
          window.huddle.window.firstRequest = false;
        
        }
      
      }
  
  }

}
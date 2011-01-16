/*  handles the rendering of each page

change from previous version - used to have one page object which switched out content and faded it back
in. this time, the window object performs most of these functions, with this page object creating a new page
object every time to replace itself before being destroyed - this allows page changes to be infinitely more
reliable and clean, providing possibly the biggest reliability gain across the app.

*/

function Page(inType, inId) {

  if ((inType == "") || (inId == "") || (inType == null) || (inId == null)) {
  
    this.load = function() {
    
    }
  
  }

  this.type = inType;
  this.id = inId;
  this.content = "";
  this.response = null;
  this.connection = new Data(this);
  this.renderer = new Renderer(this);
  this.drag = new Drag(this);
  
  this.nextType = "";
  this.nextId = "";
  
  this.load = function() { // just a wrapper function should any extra loading stuff need to be added
  
    this.data();
  
  }
  
  this.data = function() {

    this.connection.get(this.type, this.id, this);
  
  }
  
  this.process = function(response) { // processes the response from data request
  // brought back in scope by data object doing some tomfoolery with window variables etc
  
    if (this.type == "login") {
    
      this.response = response;
    
    } else {
    
      this.response = response.Data;
      
      if (this.type == "dashboard") {
      
        this.populateDropdown();
        window.huddle.window.breadcrumbs.hide();
      
      }
      
      if ((this.type == "workspace") || (this.type == "whatsnew") || (this.type == "whatsnewdashboard")) {
      
        window.huddle.window.breadcrumbs.hide();
      
      }
      
    }
    
    this.renderer.render(this.type);
    
    $("a:not(.breadcrumb)").click(function(e) {e.preventDefault(); air.navigateToURL(new air.URLRequest($(this).attr('href'))); });
    
    if (this.type == "login") {
  
      setTimeout(function() {
      document.getElementById('userin').disabled = false;
      document.getElementById('passin').disabled = false;
      document.getElementById('submit').disabled = false;
      document.getElementById('submit').innerHTML = "Submit";
      document.getElementById('userin').focus();
      }, window.huddle.window.speed);

      //$("a").click(function(e) {e.preventDefault(); air.navigateToURL(new air.URLRequest($(this).attr('href'))); });

      document.getElementById('submit').addEventListener("click", function() { 
      
        window.huddle.window.page.processLogin();
      
      });
      
      $("#userin, #passin, #submit").keypress(function(e) {
        if (event.keyCode == 13) {
        
          e.preventDefault();

          window.huddle.window.page.processLogin();
        
          return false;
        
        } else {
        
          return true;
        
        }
      } );
    
    }
    
    if (this.type=="folder") {
    
      this.drag.set("huddle", 1);
    
    }
    
    $("#huddle>div>div *").hide().fadeIn(window.huddle.window.speed);
     
    window.huddle.window.end();
    
  }
  
  this.processLogin = function() { // process a login request (special page change)
  
    window.huddle.setAuthentication(document.getElementById('userin').value, document.getElementById('passin').value);
    
    if (document.getElementById("checkbox").checked) {
    
      window.huddle.keystore.save(document.getElementById('userin').value, document.getElementById('passin').value);
    
    } else {
    
      window.huddle.keystore.dontSave();
    
    }
  
    if (window.huddle.updater.isUpdate) {
    
      window.huddle.window.messages.go(window.huddle.updater.string, window.huddle.updater.listeners, 1000);
    
    } else {
            
      window.huddle.window.page.change("dashboard", 1);
      
    }
  
  }
  
  this.change = function(type, id) { // change to the type/id page specified
  
    this.drag.unlisten();
  
    if ((type == "") || (id == "")) {
    
      window.huddle.window.messages.go("<b>Oops!</b><BR>Sorry, looks like Clustr Desktop got a bit lost (code 06-01).<BR><BR>Attempting to load Dashboard...", window.huddle.window.page.newDashboard, 3000);
      
      return 0;
    
    }
  
    window.huddle.window.start();
    
    this.nextType = type;
    this.nextId = id;
    
    $("#huddle>div>div *").fadeOut(window.huddle.window.speed);
    
    setTimeout(this.newPage, window.huddle.window.speed);
  
  }
  
  this.reload = function() { // helper to reload the page
  
    this.change(this.type, this.id);
  
  }
  
  this.newPage = function() {
    
    $("#huddle>div>div").empty();
    
    window.huddle.window.selector = new Selector();
    
    window.huddle.window.page = new Page(window.huddle.window.page.nextType, window.huddle.window.page.nextId);
    
    window.huddle.window.page.load();
  
  }
  
  // series of helpers for situations where passing arguments with functions is restricted by AIR security
  
  this.newFile = function() {
  
    window.huddle.window.page.change("file", window.currentFileId);
  
  }
  
  this.newLoginPage = function() {
  
    window.huddle.window.page.change("login",1);

  }
  
  this.newDashboard = function() {
  
    window.huddle.window.page.change("dashboard",1);
  
  }
  
  this.populateDropdown = function() {
  
    window.huddle.window.dropdown.clear();
  
    for (x in this.response) {

      window.huddle.window.dropdown.push(this.response[x].Title, this.response[x].Id);
    
    }
    
    window.huddle.window.dropdown.get();
  
  }
  
  this.switchList = function() { // switching list view

    if (window.huddle.window.isList) {
    
      window.huddle.window.isList = false;
      
      window.huddle.keystore.setList(false);
    
    } else {
    
      window.huddle.window.isList = true;
      
      window.huddle.keystore.setList(true);

    }

    this.reload();
  
  }
  
  this.changeWorkspace = function() {
  
    workspace = window.huddle.window.dropdown.getCurrentWorkspaceId();
    
    if (workspace == "dashboard") {
    
      window.huddle.window.page.change("dashboard", 1);
    
    } else {
  
      window.huddle.window.page.change("workspace", workspace);
      
    }
  
  }

}
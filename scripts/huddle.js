function Huddle () {

  // holds user/pass for use in each API request, set by login and not changed unless login screen displayed again
  this.username = "null";
  this.password = "null";
  
  this.defaultWidth = 380;
  this.defaultHeight = 320;
  
  this.minWidth = 380;
  this.minHeight = 320;
  
  // versioning information
  this.release = 2;
  this.version = 0;
  this.minor = 1;
  
  // functions to set user/pass variables from login
  this.setUsername = function(user) { this.username = user;};
  this.setPassword = function(pass) { this.password = pass;};
  this.setAuthentication = function(user,pass) {
  
    this.username = user;
    this.password = pass;
    
    if (user == "") {
    
      this.username = "null";
    
    }
    
    if (pass == "") {
    
      this.password = "null";
    
    }
    
  };
  
  // returns user/pass on request
  this.getUsername = function() { return encodeURIComponent(this.username); };
  this.getPassword = function() { return encodeURIComponent(this.password); };
  
  // wipes credentials
  this.wipe = function() {
  
    this.username = "null";
    this.password = "null";
    
  };   
  
  // returns whether or not authenticated
  this.isAuth = function() { 

    if ((this.username!="") && (this.password!="")) {
    
      return 1;
      
    } else {
    
      return 0;
      
    }

  };
 
  // holds objects for reference at this level and below
  this.window = new Window();
  this.transfer = null;
  this.keystore = new Keystore();
  this.updater = new Update();
 
  this.load = function() { // called by <body> onLoad
  
    window.huddle.updater.update();
  
    /* generic page instanciation stuff */
  
    window.htmlLoader.paintsDefaultBackground = false; // handles making the background transparent for nice corners, shadow etc

    // initialises system tray
    window.systray = new Systray;
    window.systray.init();

    // set min window size initially
    pt = new air.Point;
    pt.y = huddle.minHeight;
    pt.x = huddle.minWidth;
    window.nativeWindow.minSize = pt; // just to initialise this so there's no resizing bugs
    
    window.huddle.keystore.setDimensions();

    /* handles rendering the initial window */

    // header
    $("#header>div").append("<h1><a href='http://clustr.me.uk'>Clustr</a></h1><span></span><ul><li class='min'>Minimise</li><li class='close'>Close</li></ul>");
    $("#header").show("drop", {direction: "down"}, this.window.speed);
    
    // footer
    $("#footer>div").append("<p></p><h1><a href='http://clustr.me.uk'>Clustr</a></h1>");
    $("#footer").show("drop", {direction: "up"}, this.window.speed);

    /* load the next section */

    this.window.load();
  
  }

}
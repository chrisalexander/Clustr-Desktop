function Window() { // brand new window class taking more responsibility away from page class for stability

  this.canMove = true;
  this.isShiftDown = 0;
  this.speed = 600;
  this.loading = true;
  this.page = null;
  this.isList = false;
  this.firstRequest = true;

  // objects required at this level and below
  this.selector = new Selector();
  this.breadcrumbs = new Breadcrumbs();
  this.dropdown = new Dropdown();
  this.messages = new Messages();

  this.load = function() {

    // huddle link click handlers
    $("#header h1 a, #footer h1 a").click(function(e) {
      e.preventDefault(); // stop it actually opening the link
      air.navigateToURL(new air.URLRequest($(this).attr('href'))); // open link in default browser
    }).mouseover(function() {
      window.huddle.window.canMove = false;
    }).mouseout(function() {
      window.huddle.window.canMove = true;
    });

    // minimise and close button functionality
    $("#header ul .min").click(function() {
      window.systray.toggle(); // toggles show/hide of window
    });
    
    $("#header ul .close").click(function() {
      window.huddle.window.closeApp(); // calls function to gently exit app
    });
    
    // minimise and close button move preventer
    $("#header ul .min, #header ul .close").mouseover(function() {
      window.huddle.window.canMove = false;
    }).mouseout(function() {
      window.huddle.window.canMove = true;
    });
    
    // handles moving window
    $("#header").mousedown(function() { window.huddle.window.move(); }, false);
    
    // handles resizing window
    $("#footer span.resize-handle").mousedown(function() {nativeWindow.startResize(air.NativeWindowResize.BOTTOM_RIGHT);});

    // listeners for shift key for select process
    window.addEventListener("keydown", function(event) {
    
      if(event.keyCode == 16) {
        window.huddle.window.isShiftDown = 1;
        window.huddle.selector = new Selector();
      }
    
    } );
    
    window.addEventListener("keyup", function(event) {
    
      if(event.keyCode == 16) {
        window.huddle.window.isShiftDown = 0;
      }
    
    } );

    // resize functionality to keep it above min size etc
    window.addEventListener("resize", function (event) {

      newWindowHeight = window.nativeWindow.height;
      newWindowWidth = window.nativeWindow.width;
      
      $("#header,#footer").width(window.nativeWindow.width); // workaround due to setting width on startup from keystore
            
      if ((newWindowHeight <= huddle.minHeight) && (newWindowWidth <= huddle.minWidth)) { // if its too small, resize it back out again
      
          /*
            this bit is in due to a weird quirk in Air,
            which sometimes causes problems if suddenly
            both the width and height go below minimum
          */
      
          pt = new air.Point;
          pt.y = huddle.minHeight;
          pt.x = huddle.minWidth;
          window.nativeWindow.minSize = pt;
          newWindowHeight = huddle.minHeight;
          newWindowWidth = huddle.minWidth;
      
      } else {
      
        if (newWindowHeight < huddle.minHeight) { // minimum height
        
          pt = new air.Point; // make a new air point
          pt.y = huddle.minHeight; // set y
          window.nativeWindow.minSize = pt; // force it onto the window
          newWindowHeight = huddle.minHeight; // change variable for later
        
        }
        
        if (newWindowWidth < huddle.minWidth) { // minimum width

          pt = new air.Point;
          pt.x = huddle.minWidth;
          window.nativeWindow.minSize = pt;
          newWindowWidth = huddle.minWidth;

        }
        
      }

      newHeight = newWindowHeight - 122; // works out how high middle section should be
    
      document.getElementById("huddle").firstChild.firstChild.style.height = newHeight + "px"; // sets height of mid section on resize
    
    });
    
    this.isList = window.huddle.keystore.isList();
    
    this.page = new Page("login", 1);
    
    this.page.load();
    
  }

  // close the application gently
  this.closeApp = function() {
  
    window.huddle.keystore.saveDimensions();
  
    var closing = new air.Event(air.Event.CLOSING, true, true);
    
    window.nativeWindow.dispatchEvent(closing); // dispach closing event
    
    if(!closing.isDefaultPrevented()) { // when nothing else wants to complete closing events
    
        nativeWindow.close(); // close window
    
    } else {
    
      window.huddle.window.messages.go("<b>Oops!</b><BR><BR>Looks like Clustr Desktop wasn't too keen on exiting just yet (code 11-01).<BR><BR>Attempting to load Dashboard...", window.huddle.window.page.newDashboard, 3000);
    
    }
  
  }
  
  // handles moving of the window
  this.move = function() {
  
    if (window.huddle.window.canMove) { // checks its allowed to move
    
      window.nativeWindow.startMove();
    
    }
    
  }
  
  this.start = function() {
  
    if (!this.loading) {
    
      $("#loading").hide().fadeIn();
    
      this.loading = true;
    
    }
  
  }

  this.end = function() {
  
    if (this.loading) {
    
      $("#loading").fadeOut()
    
      this.loading = false;
    
    }
  
  }

}
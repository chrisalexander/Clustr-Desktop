/*
  this class handles the system tray icon
  largely modified from Adobe's Air documentation
*/
function Systray () {

  this.iconMenu = "";

  // initialise and display the systray on load
  this.init = function() {

    // menu icon loader
    var iconLoad = new air.Loader();

    // menu for system tray
    this.iconMenu = new air.NativeMenu();

    // elements of menu
    if (window.nativeWindow.visible) {
    
      var showhideCommand = this.iconMenu.addItem(new air.NativeMenuItem("Hide"));

    } else {

      var showhideCommand = this.iconMenu.addItem(new air.NativeMenuItem("Show"));    
    
    }

    var exitCommand = this.iconMenu.addItem(new air.NativeMenuItem("Exit"));

    // events for menu elements
    showhideCommand.addEventListener(air.Event.SELECT,systray.toggle);

    exitCommand.addEventListener(air.Event.SELECT,function(event){

      air.NativeApplication.nativeApplication.icon.bitmaps = [];

      air.NativeApplication.nativeApplication.exit();
      
    });

    // displays icon for different OS'
    if (air.NativeApplication.supportsSystemTrayIcon) { // WINDOWS

      iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE,systray.iconLoadComplete);

      iconLoad.load(new air.URLRequest("imgs/icon16x16.png"));

      air.NativeApplication.nativeApplication.icon.tooltip = "Clustr Desktop";

      air.NativeApplication.nativeApplication.icon.menu = this.iconMenu;
      
      air.NativeApplication.nativeApplication.icon.addEventListener('click',systray.toggle); // add click event listener

    }
    
    if (air.NativeApplication.supportsDockIcon) { // MAC
    
      iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE,systray.iconLoadComplete);

      iconLoad.load(new air.URLRequest("imgs/icon128x128.png"));

      air.NativeApplication.nativeApplication.icon.menu = this.iconMenu;

      air.NativeApplication.nativeApplication.icon.addEventListener('click',systray.toggle); // click event listener

    }

  } // end init function

  // toggle show and hide of the main window. Also handles changing the menu in the systray
  this.toggle = function() {

    if (window.nativeWindow.visible) { // if its visible then hide it
    
      window.nativeWindow.visible = false;
      
      systray.iconMenu.removeItemAt(0);
      
      showhideCommand = systray.iconMenu.addItemAt(new air.NativeMenuItem("Show"),0);
      
      showhideCommand.addEventListener(air.Event.SELECT,systray.toggle);
    
    } else { // if its hidden, set it to visible
    
      window.nativeWindow.visible = true;
      
      window.nativeWindow.activate();
      window.nativeWindow.orderToFront();
      window.nativeWindow.restore();
      
      systray.iconMenu.removeItemAt(0);
      
      showhideCommand = systray.iconMenu.addItemAt(new air.NativeMenuItem("Hide"),0);
      
      showhideCommand.addEventListener(air.Event.SELECT,systray.toggle);
    
    }

  }

  // displays icon in systray/doc when icon is loaded
  this.iconLoadComplete = function(event) {

    air.NativeApplication.nativeApplication.icon.bitmaps = new runtime.Array(event.target.content.bitmapData);

  }
  
  this.notify = function() {
  
    if (air.NativeApplication.supportsDockIcon) {
    
      air.NativeApplication.nativeApplication.icon.bounce(air.NotificationType.INFORMATIONAL);
    
    } else if ((air.NativeApplication.supportsSystemTrayIcon) && (air.NativeWindow.supportsNotification)) {
    
      nativeWindow.notifyUser(air.NotificationType.INFORMATIONAL);
    
    } else {
    
      alert("Complete");
    
    }
  
  }
  
}
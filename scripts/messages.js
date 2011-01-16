function Messages() { // brand new messaging handler

  this.isActive = false;

  this.go = function(value, func, timeout) {

    if (!this.isActive) {
    
      this.isActive = true;
  
      $("#huddle>div>div *").fadeOut(window.huddle.window.speed);
    
      setTimeout(window.huddle.window.messages.display, window.huddle.window.speed);
      
      if (value != "") {
      
        this.show(value, (window.huddle.window.speed+100), func, timeout);
      
      }
      
    } else {

      this.show(value, 0, func, timeout);
    
    }
  
  }
  
  this.display = function() {

    $("#huddle>div>div").append("<div id='msg'><div></div></div>");
    
    $("#msg").hide().fadeIn();
  
  }
  
  this.show = function(value, timeout, func, funcTimeout) {

    if (value != "") {

      if (!this.isActive) {
      
        this.go(value);
      
      } else {

        setTimeout(function() {$("#msg > div").append(value);}, timeout);
        
        if (func != null) {

          setTimeout(func, funcTimeout);
          
          setTimeout(this.deactivate, funcTimeout);

        }
        
        window.huddle.window.end();
      
      }
    
    }
  
  }
    
  this.deactivate = function() {

    window.huddle.window.messages.isActive = false;

  }
  
  this.overwrite = function(value, func, funcTimeout) {
  
    if (!this.isActive) {
    
      this.go(value, func, funcTimeout);
    
    } else {
    
      $("#msg > div").empty();
    
      this.show(value, 0, func, funcTimeout);
      
    }
  
  }
  
  this.change = function(target, value) {

    $("#msg > div #" + target).empty().append(value);
  
  }
    
  this.stop = function() {
  
    if (this.isActive) {
    
      this.isActive = false;
  
      $("#huddle>div>div *").fadeOut(window.huddle.window.speed);
    
      setTimeout(window.huddle.window.messages.reset, window.huddle.window.speed);
      
    }
  
  }
  
  this.reset = function() {
  
    $("#huddle>div>div *").remove("#msg").fadeIn(window.huddle.window.speed);
  
  }

}
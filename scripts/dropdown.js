function Dropdown () { // class to handle workspace dropdown at top of page

  this.titles = []; // array of workspace titles, indexed by workspace id - titles[workspaceID] = workspacename
  
  // add a new workspace to dropdown
  this.push = function(title,id) {
  
    this.titles[id] = title;
  
  }
  
  // erase all
  this.clear = function() {
  
    this.titles = "";
    this.titles = [];
  
  }
  
  // hide from view
  this.hide = function () {
  
    $("#header>div>span").hide().empty();
    
    this.clear();
  
  }
  
  // write the dropdown to window
  this.get = function() {

    $("#header>div>span").hide().empty(); // empty previous items
  
    workspaces = this.titles;
  
    if (workspaces.length > 0) { // check that workspaces exist
    
      string = "<select name='workspaces' id='workspaces'><option value='dashboard'>My Dashboard</option>";
    
      for (x in workspaces) {
      
        // add option for each workspace      
        string = string + "<option value='" + x + "'>" + workspaces[x] + "</option>";
        
      }
      
      string = string + "</select>";
      
      $("#header>div>span").append(string).fadeIn(); // add it in
      
      // add listener for when its changed, and for dealing with moving the window
      $("#workspaces").change(
        window.huddle.window.page.changeWorkspace
      ).mouseover(function() {
        window.huddle.window.canMove = false;
      }).mouseout(function() {
        window.huddle.window.canMove = true;
      });
    
    } else {
    
      $("#header>div>span").append("You do not have any workspaces"); // just in case it happens
    
    }
  
  }
  
  // changes the selected workspace
  this.selected = function(id) {

    document.getElementById("workspaces").value = id;
   
  }
  
  // gets the current workspace
  this.getCurrentWorkspaceId = function() {
  
    return document.getElementById("workspaces").value;
  
  }
  
}
function Breadcrumbs() { // class for handling the breadcrumbs at the top of the page

  // array of crumbs [0] = name, [1] = folder target
  this.array = [];
  this.clicked = false;
  
  // add a crumb to the array
  this.addCrumb = function (name, target) {
  
    temp = [];
    temp[0] = name;
    temp[1] = target;
    this.array.push(temp);
 
  }
  
  // called when a breadcrumb is clicked
  this.jump = function (crumb) {
  
    if (crumb == "dashboard") {
    
      window.huddle.window.page.newDashboard();
    
    } else if (crumb != "breadcrumbOverview") {
  
      if (this.array.length > crumb) {
      
        window.huddle.window.page.change("folder", this.array[crumb][1]);
      
      }
      
      this.array.length = crumb+1;
      
    } else {
    
      // behaviour for when first dropdown is clicked
    
      window.huddle.window.page.change("workspace", window.huddle.window.dropdown.getCurrentWorkspaceId());
      
      this.hide();
    
    }
  
  }
  
  // writes the breadcrumbs into window
  this.write = function() {
  
    items = this.array;
  
    string = "";
  
    string = string + "<a href='dashboard' class='breadcrumb'>Dashboard</a>&raquo;<a href='breadcrumbOverview' class='breadcrumb'>" + window.huddle.window.dropdown.titles[window.huddle.window.dropdown.getCurrentWorkspaceId()] + "</a>";
  
    for (x in items) {
    
      string = string + "&raquo;<a href='" + x + "' class='breadcrumb'>" + items[x][0] + "</a>";
    
    }
    
    // write the generated string into the <p>
    $("#breadcrumbs").empty().append(string);

    // click handlers for each crumb
    $("#breadcrumbs a").click(function(e) {
      if (!this.clicked) {
        e.preventDefault;
        window.huddle.window.breadcrumbs.jump($(this).attr('href'));
        this.clicked = true;
      }
    });
  
  }
  
  // hides and resets the breadcrumbs
  this.hide = function() {
    
    this.array = "";
    this.array = [];
  
  }

}
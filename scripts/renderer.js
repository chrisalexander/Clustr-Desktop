/*

some of this may be familiar from the previous version. Cell / table class used for grid of icons, renderer
selects either these or other methods to display content depending on the type, e.g. displaying a single
document or in a list

*/

function Renderer(inObj) { // renders the contents of a page

  this.parent = inObj;
  this.table = new Table(this);
  this.isTable = false;
  this.isRendered = false;
  
  this.render = function(type) {
  
    if ((type == "dashboard") || (type == "workspace") || (type == "folder")) {

      this.isTable = true;

      this.tabulate(true);
    
    } else if ((type == "whatsnew") || (type == "whatsnewdashboard")) {

      this.whatsnew();
    
    } else if (type == "file") {
    
      this.file();
    
    } else if (type == "login") {
    
      $("#huddle>div>div").append(this.parent.response);
    
    }
  
  }
  
  this.tabulate = function() {

    this.table.addItems(this.parent.response);

    this.table.code();
    
    this.write();

  }
  
  this.renderLinks = function() {
  
    string = "";
    
    mode = 0;
    
    if ((this.parent.type == "dashboard") || (this.parent.type == "workspace")) {
      mode = 1;
    }
    if ((this.parent.type == "whatsnew") || (this.parent.type == "whatsnewdashboard")) {
      mode = 2;
    }
    
    if (mode == 2) {
    
      string = string + "<div class='first'><img src='imgs/icons/grid.png'> Grid View</div><div class='second'><img src='imgs/icons/list.png'> List View</div><div class='last selected'><img src='imgs/icons/whatsnew.png'> What's New</div>";
    
    } else if (window.huddle.window.isList) {
    
      if (mode) {
      
        string = string + "<div class='first'><img src='imgs/icons/grid.png'> Grid View</div><div class='selected'><img src='imgs/icons/list.png'> List View</div>";
        
      } else {
        
        string = string + "<div class='first'><img src='imgs/icons/grid.png'> Grid View</div><div class='selected last'><img src='imgs/icons/list.png'> List View</div>";
        
      }
    
    } else {
    
      if (mode) {
      
        string = string + "<div class='first selected'><img src='imgs/icons/grid.png'> Grid View</div><div class='second'><img src='imgs/icons/list.png'> List View</div>";
        
      } else {
      
        string = string + "<div class='first selected'><img src='imgs/icons/grid.png'> Grid View</div><div class='second last'><img src='imgs/icons/list.png'> List View</div>";
        
      }
    
    }
    
    if (mode == 1) {
    
      string = string + "<div class='last'><img src='imgs/icons/whatsnew.png'> What's New</div>";
    
    }
  
    $("#huddle-app #footer > div span").empty().append(string);
  
    // do it all again to get the right listeners
  
    if (mode == 2) {
    
      if (window.huddle.window.isList) {
      
        $("#huddle-app #footer > div span div.first").click(function() {

          window.huddle.window.isList = false;
      
          window.huddle.keystore.setList(false);
          
          if (window.huddle.window.page.id == 1) {
          
            window.huddle.window.page.newDashboard();
          
          } else {
          
            window.huddle.window.page.change("workspace", window.huddle.window.page.id);
          
          }
    
        });
        
        $("#huddle-app #footer > div span div.second").click(function() {

          if (window.huddle.window.page.id == 1) {
          
            window.huddle.window.page.newDashboard();
          
          } else {
          
            window.huddle.window.page.change("workspace", window.huddle.window.page.id);
          
          }
    
        });
      
      } else {
      
        $("#huddle-app #footer > div span div.first").click(function() {

          if (window.huddle.window.page.id == 1) {
          
            window.huddle.window.page.newDashboard();
          
          } else {
          
            window.huddle.window.page.change("workspace", window.huddle.window.page.id);
          
          }
    
        });
        
        $("#huddle-app #footer > div span div.second").click(function() {

          window.huddle.window.isList = true;
      
          window.huddle.keystore.setList(true);
          
          if (window.huddle.window.page.id == 1) {
          
            window.huddle.window.page.newDashboard();
          
          } else {
          
            window.huddle.window.page.change("workspace", window.huddle.window.page.id);
          
          }
    
        });
      
      }
    
    } else if (window.huddle.window.isList) {

      $("#huddle-app #footer > div span div.first").click(function() {

        window.huddle.window.page.switchList();
  
      });
    
    } else {
    
      $("#huddle-app #footer > div span div.second").click(function() {

        window.huddle.window.page.switchList();
    
      });
    
    }
    
    if (mode == 1) {
    
      if (this.parent.type == "workspace") {

        $("#huddle-app #footer > div span div.last").click(function() {
        
          window.huddle.window.page.change("whatsnew", window.huddle.window.page.id);
        
        });
      
      }
      
      if (this.parent.type == "dashboard") {

        $("#huddle-app #footer > div span div.last").click(function() {
        
          window.huddle.window.page.change("whatsnewdashboard", window.huddle.window.page.id);
        
        });
      
      }
    
    }
  
  }
  
  this.write = function(data) {
  
    if (!this.isRendered) {
    
      this.renderLinks();    
    
      if (this.isTable) {
   
        this.table.write();
        
        this.isRendered = true;
      
      } else if (((this.parent.type == "file") || (this.parent.type == "whatsnew") || (this.parent.type == "whatsnewdashboard")) && (data != "")) {
      
        $("#huddle>div>div").append(data);
      
      }
      
    }
  
  }
  
  this.whatsnew = function() {
  
    feed = this.parent.response;

    output = "<ul class='whatsnew'>";
    
    for (x in feed) {

      if (feed[x].TargetType == "DiscussionPost") {
      
        type = "newpost";

        title = "<b>New post</b> was added to discussion <a href='https://my.huddle.net/huddleworkspace/discussionposts.aspx?workspaceid=" + feed[x].WorkspaceId + "&DiscussionID=" + feed[x].TargetId + "'>" + feed[x].TargetText + "</a> in the workspace <a href='https://my.huddle.net/huddleworkspace/?workspaceid=" + feed[x].WorkspaceId + "'>" + feed[x].WorkspaceTitle + "</a> by <a href='https://my.huddle.net/myhuddle/user.aspx?userid=" + feed[x].UserId + "'>" + feed[x].DisplayName + "</a>";
      
      } else if (feed[x].TargetType == "User") {
      
        type = "newuser";
        
        title = "<b>New user</b> <a href='https://my.huddle.net/myhuddle/user.aspx?userid=" + feed[x].TargetId + "'>" + feed[x].TargetText + "</a> was added to the workspace <a href='https://my.huddle.net/huddleworkspace/?workspaceid=" + feed[x].WorkspaceId + "'>" + feed[x].WorkspaceTitle + "</a>";
      
      } else if (feed[x].TargetType == "Whiteboard") {
      
        type = "newwhiteboard";
        
        title = "<b>New whiteboard</b> <a href='https://my.huddle.net/huddleworkspace/whiteboard.aspx?workspaceid=" + feed[x].WorkspaceId + "&whiteboardid=" + feed[x].TargetId + "'>" + feed[x].TargetText + "</a> (version " + feed[x].VersionNumber + ") was added to the workspace <a href='https://my.huddle.net/huddleworkspace/?workspaceid=" + feed[x].WorkspaceId + "'>" + feed[x].WorkspaceTitle + "</a> by <a href='https://my.huddle.net/myhuddle/user.aspx?userid=" + feed[x].UserId + "'>" + feed[x].DisplayName + "</a>";
        
      } else if (feed[x].TargetType == "Task") {
      
        type = "newtask";
        
        title = "<b>New task</b> <a href='https://my.huddle.net/huddleworkspace/task.aspx?workspaceid=" + feed[x].WorkspaceId + "&taskid=" + feed[x].TargetId + "'>" + feed[x].TargetText + "</a> was added to the workspace <a href='https://my.huddle.net/huddleworkspace/?workspaceid=" + feed[x].WorkspaceId + "'>" + feed[x].WorkspaceTitle + "</a> by <a href='https://my.huddle.net/myhuddle/user.aspx?userid=" + feed[x].UserId + "'>" + feed[x].DisplayName + "</a>";
        
      } else if (feed[x].TargetType == "Document") {
      
        type = "newfile";
        
        title = "<B>New file</b> <a href='https://my.huddle.net/workspace/document/" + feed[x].TargetId + "?workspaceid=" + feed[x].WorkspaceId + "'>" + feed[x].TargetText + "</a> (version " + feed[x].VersionNumber + ") was added to the workspace <a href='https://my.huddle.net/huddleworkspace/?workspaceid=" + feed[x].WorkspaceId + "'>" + feed[x].WorkspaceTitle + "</a> by <a href='https://my.huddle.net/myhuddle/user.aspx?userid=" + feed[x].UserId + "'>" + feed[x].DisplayName + "</a>";
        
      } else if (feed[x].TargetType == "Discussion") {
      
        type = "newdiscussion";
        
        title = "<b>New discussion</b> <a href='https://my.huddle.net/huddleworkspace/discussionposts.aspx?workspaceid=" + feed[x].WorkspaceId + "&discussionid=" + feed[x].TargetId + "'>" + feed[x].TargetText + "</a> was added to the workspace <a href='https://my.huddle.net/huddleworkspace/?workspaceid=" + feed[x].WorkspaceId + "'>" + feed[x].WorkspaceTitle + "</a> by <a href='https://my.huddle.net/myhuddle/user.aspx?userid=" + feed[x].UserId + "'>" + feed[x].DisplayName + "</a>";
        
      } else if (feed[x].TargetType == "Comment") {
      
        type = "newcomment";
        
        title = "<b>New comment</b> was added to " + feed[x].TargetText + " (version " + feed[x].VersionNumber + ") in the workspace <a href='https://my.huddle.net/huddleworkspace/?workspaceid=" + feed[x].WorkspaceId + "'>" + feed[x].WorkspaceTitle + "</a> by <a href='https://my.huddle.net/myhuddle/user.aspx?userid=" + feed[x].UserId + "'>" + feed[x].DisplayName + "</a>";

      }
      
      if (feed[x].Description == null) {
      
        feed[x].Description = "";
        
      }
      
      if (feed[x].DateAdded.Minute < 10) {
      
        feed[x].DateAdded.Minute = "0" + feed[x].DateAdded.Minute;
      
      }

      output = output + "<li><div class='whatsnewitem'><div class='whatsnewheader'><span>&nbsp;</span><div><img src='imgs/icons/" + type + ".png'> " + title + "</div></div><div class='whatsnew'><div><div>" + feed[x].Description + "</div></div></div><div class='whatsnewfooter'><div><b>Date Added:</b> " + feed[x].DateAdded.Day + "/" + feed[x].DateAdded.Month + "/" + feed[x].DateAdded.Year + "; " + feed[x].DateAdded.Hour + ":" + feed[x].DateAdded.Minute + "<span>&nbsp;</span></div></div></li>";
    
    }
    
    output = output + "</ul>";
    
    this.write(output);
  
  }
  
  this.file = function() {
  
    file = this.parent.response;

    icon = this.getIcon(file.FileName); // get the icon

    output = "<span id='file'><img src='imgs/icons/" + icon + "-50.png' class='elementimg'>";
    
    output = output + "<p><span>Title:</span> " + file.Title + "</p>";
    output = output + "<p><span>File name:</span> " + file.FileName + "</p>";
    
    if (file.Description) { // check description exists before writing
    
      output = output + "<p><span>Description:</span> " + file.Description + "</p>";
      
    }
    
    output = output + "<p><span>Created:</span> " + file.Created.Day + "/" + file.Created.Month + "/" + file.Created.Year + " by <i>" + file.CreatedByUserDisplayName + "</i></p>";
    output = output + "<p><span>Last edited:</span> " + file.LastUpdated.Day + "/" + file.LastUpdated.Month + "/" + file.LastUpdated.Year + " by <i>" + file.LastEditedByUserDisplayName + "</i></p>";
    output = output + "<p><span>File size:</span> " + file.Size + " bytes</p>";
    output = output + "<p><span>Version:</span> " + file.Version + "</p>";

    output = output + "<span id='downloadLink'>Download</span></span>";
    
    window.currentFileId = file.Id; // set current file for download link

    this.write("<p id='breadcrumbs'></p>" + output);
    
    // listener for click to download link
    $("#downloadLink").click(function() {
      if (window.huddle.transfer == null) {
      
        window.huddle.transfer = new Transfer(true);
        
        window.huddle.transfer.init(window.huddle.window.page.type, window.huddle.window.page.id);
        
        window.huddle.transfer.download("file", window.currentFileId);
      
      } else {
      
        window.huddle.window.messages.show("<b>Oops!</b><br><br>Looks like there's a download already in progress. Please wait (error 04-01).", window.huddle.window.page.newFile, 3000);
      
      }
    });
    
    window.huddle.window.breadcrumbs.write();
  
  }
  
  this.getIcon = function(type) {

    icon = "unknown";
	type2 = "";

    if (type.lastIndexOf("/") != -1) {
    
      pos = type.lastIndexOf("/");
      
	  type2 = type.substr(pos+1);
      type = type.substr(0,pos);
    
    }

    switch(type) {
    
      // workspace
		case "workspace":
			icon = "workspace";
			break;
    
      // folder
		case "Folder":
			icon = "folder";
			break;
      
      // applications
		case "application":
			switch (type2) {
				case "msword":
				case "vnd.openxmlformats-officedocument.wordprocessingml.document":
				case "vnd.oasis.opendocument.spreadsheet":
				case "vnd.oasis.opendocument.text":
					icon = "doc";
					break;
				case "excel":
				case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
					icon = "xls";
					break;
				case "vnd.ms-powerpoint":
				case "vnd.openxmlformats-officedocument.presentationml.presentation":
					icon = "ppt";
					break;
				case "pdf":
					icon = "pdf";
					break;
				case "x-javascript":
				case "x-shockwave-flash":
					icon = "web";
					break;
				case "illustrator":
				case "photoshop":
					icon = "img";
					break;
			}
			break;
        
      // image
		case "image":
			icon = "img";
			break;
      
      // text
		case "text":
			icon = "doc";
			switch (type2) {
				case "html":
				case "xml":
				case "css":
					icon = "web";
					break;
			}
			break;
        
      // video
		case "video":
			icon = "video";
			break;
		
		case "audio":
			icon = "sound";
			break;
    
    }

    return icon;

  }
  
  this.countletters = function(letter, string) {

    count = 0;
    
    var i = 0;
    
    for (i = 0; i < string.length; i++) {
    
      if (string.charAt(i) == letter) {
      
        count = count + 1;
        
      }
    
    }

    return count;

  }
  
}

// class for each element (or <li>) of the display list
function Cell(inTable) {

  // initialise properties for the cell
  this.id = "";
  this.objectId = "";
  this.imageId = "";
  this.titleId = "";
  this.formattedName = "";
  this.name = "";
  this.type = "";
  this.image = "";
  this.clicked = false;
  this.table = inTable;
  
  // called to set the variables for the cell
  this.init = function(input) {
  
    this.id = input.Id;
  
    if (input.Type==undefined) {
    
      this.type = "workspace";
    
    } else {
    
      this.type = input.Type;
    
    }
    
    this.type = this.type.toLowerCase();
    
    this.objectId = this.type + ":" + this.id;
    
    this.imageId = "img:" + this.id;
	
    if (input.FileName) {
    
      this.image = this.table.renderer.getIcon(input.FileName);
    
	} else if (input.Type == "File") {
	
		this.image = this.table.renderer.getIcon(input.MimeType);
	
    } else if (input.Type) {
    
      this.image = this.table.renderer.getIcon(input.Type);
    
    } else {
    
      this.image = this.table.renderer.getIcon("workspace");
      
    }
    
    this.name = input.Title;
    
    //this.formattedName = this.table.renderer.makeTitle(input.Title);
    // these two lines computed the line breaks when displaying names, but Andy decided it looked better without
    //this.formattedName = this.formattedName[0]; // gets rid of any arrays
    this.formattedName = this.name;
  
  }
  
  // returns the code for this cell using its properties
  this.code = function() {
   
    if (window.huddle.window.isList) {
    
      classes = " class='list'";
      
      name = this.name;
    
    } else {
    
      classes = "";
      
      name = this.formattedName;
      
    }
   
    return "<li id='" + this.objectId + "'" + classes + "><span><img src='imgs/icons/" + this.image + "-50.png' class='elementimg' id='" + this.imageId + "'></span><p>" + name + "</p></li>";
  
  }
  
  // adds appropriate listeners to the cell when called
  this.listeners = function(object) {

    /*
      the object passed is actually this instanciation of the class
      but it is required as inside addEventListener "this" doesn't
      point to the correct element and causes quite a few problems
    */
  
    // sets drag and drop properties if its the right type
    if (object.type == "folder") {
    
      window.huddle.window.page.drag.set(object.objectId);
    
    } else if (object.type == "file") {
    
      window.huddle.window.page.drag.set(object.objectId, -1);
    
    }
  
    // click
    document.getElementById(object.objectId).addEventListener("click", function() { 
    
      if ((window.huddle.window.isShiftDown) && (object.type == "file")) {

        window.huddle.window.selector.toggle(object.id);
      
      } else if (!object.clicked) {
      
        if (object.type == "workspace") {
          window.huddle.window.dropdown.selected(object.id);
        } else if (object.type == "folder") {
          window.huddle.window.breadcrumbs.addCrumb(object.name,object.id);
        }
        
        window.huddle.window.page.change(object.type, object.id);
        
        object.unlisten(object);
        
      }
      
    } , false);
      
    // mouseover
    document.getElementById(object.objectId).addEventListener("mouseover", function(event) { 
    
      if (!window.huddle.window.isList) {
      
        if (window.huddle.window.selector.is(object.id)) {
          colour = "#5b5b5b";
        } else {
          colour = "#d4d4d4";
        }
        document.getElementById(object.imageId).style.borderColor = colour;
       
        // this section displays the full title and formats correctly on mouse over
        document.getElementById(object.objectId).getElementsByTagName("p")[0].style.margin = "0px 0px 0px 3px";
        document.getElementById(object.objectId).getElementsByTagName("p")[0].style.margin = "0px 2px";
        document.getElementById(object.objectId).getElementsByTagName("p")[0].innerHTML = object.name;
        document.getElementById(object.objectId).getElementsByTagName("p")[0].style.position = "relative";
        document.getElementById(object.objectId).getElementsByTagName("p")[0].style.backgroundImage = "url(../imgs/bg/mouseover.png)"; 
        
      }
    
    }, false);
    
    // mouse move
    document.getElementById(object.objectId).addEventListener("mousemove", function(event) {

      if (!window.huddle.window.isList) {

        if (window.huddle.window.selector.is(object.id)) {
          colour = "#5b5b5b";
        } else {
          colour = "#d4d4d4";
        }
        document.getElementById(object.imageId).style.borderColor = colour;
        // needed to stop the expanded element collapsing
        document.getElementById(object.objectId).getElementsByTagName("p")[0].style.width = "66px";
        
      }
      
    }, false);
    
    // mouseout
    document.getElementById(object.objectId).addEventListener("mouseout", function() { 
      
      if (!window.huddle.window.isList) {
        
        if (window.huddle.window.selector.is(object.id)) {
          colour = "#5b5b5b";
        } else {
          colour = "#c7c7c7";
        }
        
        if(document.getElementById(object.imageId)) { // this stops a few little bugs when the element can't be found for some reason
          document.getElementById(object.imageId).style.borderColor = colour;
          // resets the extended title back to normal
          document.getElementById(object.objectId).getElementsByTagName("p")[0].innerHTML = object.formattedName;
          document.getElementById(object.objectId).getElementsByTagName("p")[0].style.width = "";
          document.getElementById(object.objectId).getElementsByTagName("p")[0].style.position = "";
          document.getElementById(object.objectId).getElementsByTagName("p")[0].style.margin = "0px";
          document.getElementById(object.objectId).getElementsByTagName("p")[0].style.padding = "0px";
          document.getElementById(object.objectId).getElementsByTagName("p")[0].style.backgroundImage = "none";
        }
        
      }
      
    }, false);
  
  }
  
  // easily remove all listeners
  // also called after its been clicked to stop problems with double click
  this.unlisten = function(object) {

    object.clicked = true;

  }

}

// class to handle the grid as a whole
function Table(inRenderer) {

  // array of Cell objects representing grid
  this.array = [];
  this.isDashboard = false; // just so we can tell if its the dashboard or not
  this.code = null;
  this.renderer = inRenderer
  
  // adds listeners to all the cells in the array
  this.listeners = function() {
  
    for (i = 0; i < this.array.length; i++) {
    
      this.array[i].listeners(this.array[i]);
    
    }
  
  }
  
  this.switchNames = function() {
  
    for (i = 0; i < this.array.length; i++) {
    
      this.array[i].switchName(this.array[i]);
    
    }
  
  }
  
  // returns code for the entire grid into the "target" element
  this.code = function(write) {

    code = "";
  
    if (!this.isDashboard) { // add breadcrumbs if its not the dashboard
    
      code = code + "<p id='breadcrumbs'></p>";
      
    }

    if (window.huddle.window.isList) {
    
      classes = " list";
    
    } else {
    
      classes = "";
      
    }
    
    code = code + "<ul class='thumbnails" + classes + "'>";
  
    for (i = 0; i < this.array.length; i++) { // write in all the elements
    
      code = code + this.array[i].code();
    
    }
    
    code = code + "</ul>";
    
    this.code = code;
  
  }
  
  // function to easily add new Cell
  this.add = function(item) {
      
    cell = new Cell(this);
    cell.init(item);
    
    if (item.Type == undefined) {
    
      this.isDashboard = true; // set dashboard if a workspace is detected
    
    }
    
    this.array.push(cell);
  
  }
  
  // add an array of items to the table
  this.addItems = function(items) {
  
    for (i = 0; i < items.length; i++) {
    
      this.add(items[i]);

    }
  
  }
  
  this.write = function(target) {

    $("#huddle>div>div").append(code); // write the whole lot into the page
    
    if (!this.isDashboard) { // write in breadcrumbs if its not the dashboard
  
      window.huddle.window.breadcrumbs.write();
  
    }
  
    this.listeners(); // add all the listeners AFTER the code has been written to the page
  
  }
  
  // easily wipe all the listeners in the table
  this.destroy = function() {
  
    for (x in this.array) {
    
      array[x].unlisten(array[x]);
    
    }
  
  }

}
// setting drag image (currently non-functional)
var dragImage = new Image();
dragImage.src = "app:/imgs/cursor.png";
    
function Drag(obj) {

  // points to parent element
  this.page = obj;
  this.elements = [];
  
  this.is = false;
  this.id = 0;
  
  this.set = function(element, way) { // sets listeners for an element on the page
  
    proceed = true;
  
    for (x in this.elements) {
    
      if (this.elements[x] == element) {
      
        proceed = false;
      
      }
    
    }
    
    if (proceed) {
    
      this.elements.push(element);
  
      if (element == "huddle") {
      
        element = document.getElementById("huddle").firstChild.firstChild;
      
      } else {

        element = document.getElementById(element);
        
      }
      
      if (way==1) { // object can be dragged on to but not dragged out
      
        element.addEventListener("dragenter", window.huddle.window.page.drag.dragin);
        element.addEventListener("dragover", window.huddle.window.page.drag.dragin);
        element.addEventListener("drop", function(event) { window.huddle.window.page.drag.drop(event, this.id); });
        
      } else if (way==-1) { // object can be dragged out but not dragged on to
      
        element.addEventListener("dragstart", function(event) { window.huddle.window.page.drag.start(event, this.id);});
        element.addEventListener("dragend", window.huddle.window.page.drag.end);
      
      } else { // object can be dragged in and out
      
        element.addEventListener("dragenter", window.huddle.window.page.drag.dragin);
        element.addEventListener("dragover", window.huddle.window.page.drag.dragin);
        element.addEventListener("drop", function(event) { window.huddle.window.page.drag.drop(event, this.id); });
        element.addEventListener("dragstart", function(event) { window.huddle.window.page.drag.start(event, this.id);});
        element.addEventListener("dragend", window.huddle.window.page.drag.end);
      
      }
      
    }
  
  }
  
  this.unlisten = function() { // removes listeners for cleanup
    
    for (x in this.elements) {
    
      elementID = this.elements[x];
    
      if (elementID == "huddle") {
      
        element = document.getElementById("huddle").firstChild.firstChild;
      
      } else {

        element = document.getElementById(elementID);
        
      }

      element.removeEventListener("dragenter", window.huddle.window.page.drag.dragin);
      element.removeEventListener("dragover", window.huddle.window.page.drag.dragin);
      element.removeEventListener("drop", function(event) { window.huddle.window.page.drag.drop(event, this.id); });
      element.removeEventListener("dragstart", function(event) { window.huddle.window.page.drag.start(event, this.id); });
      element.removeEventListener("dragend", window.huddle.window.page.drag.end);
     
    }
  
  }
  
  // functions to handle drag events mentioned above
  
  this.dragin = function(event) {

    // stops anything from happening
    event.preventDefault();

  }
  
  this.start = function(event, id) {
     
    this.is = true;
    
    this.id = id;
    
    // gives the operating system something to "drop"
    event.dataTransfer.setData("text/plain"," ");
    event.dataTransfer.effectsAllowed = "none";

  }
  
  this.end = function(event) { // starts file download stuff

    window.huddle.window.page.drag.is = 0;

    event.preventDefault();

    temp = window.huddle.window.page.drag.id.split(":");
    
    type = temp[0];
    id = temp[1];
    
    if(window.huddle.window.selector.is(id)) { // if the object is selected

      window.huddle.transfer = new Transfer(true);
        
      window.huddle.transfer.init(window.huddle.window.page.type, window.huddle.window.page.id);
        
      window.huddle.transfer.download("selection", window.huddle.window.selector.selectedObjects);
    
    } else {

      window.huddle.transfer = new Transfer(true);
        
      window.huddle.transfer.init(window.huddle.window.page.type, window.huddle.window.page.id);
        
      window.huddle.transfer.download(type, id);
      
    }
    
  }
  
  this.drop = function(event, id) { // does file upload stuff

    if (id == "") {
    
      id = window.huddle.window.page.id;
    
    } else {
  
      temp = id.split(":");
      id = temp[1];
      
    }

    if (!this.is) {
    
      this.is = true;
    
      var fileList = event.dataTransfer.getData("application/x-vnd.adobe.air.file-list");
      
      count = fileList.length;
      
      window.huddle.transfer = new Transfer(false);
        
      window.huddle.transfer.init(window.huddle.window.page.type, window.huddle.window.page.id);

      var files = [];

      for(file in fileList){

        if (fileList[file].isDirectory) {
        
          // if its a directory, add all the files from the directory
          fileArray = fileList[file].getDirectoryListing();
        
          for (var directoryfile in fileArray) {
          
            if (!fileArray[directoryfile].isDirectory) {
            
              files.push(fileArray[directoryfile]);
              
            }
          
          }
        
        } else {
        
          files.push(fileList[file]);
          
        }
      
      }
      
      window.huddle.transfer.upload(files, id);
    
    }
  
  }

}
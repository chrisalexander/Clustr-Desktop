function Selector () { // this class handles selecting multiple files (shift-click) for download

  // array of object IDs that have been selected
  this.selectedObjects = [];

  // toggles whether or not an object is selected
  this.toggle = function(id) {

    if (this.is(id)) { // if it is already selected
    
      this.selectedObjects[this.is(id)] = undefined; // remove it from the array
      
      document.getElementById("img:" + id).style.borderColor = "#666"; // restore its border colour to normal
    
      return 0;
    
    } else { // if it isn't selected
    
      this.selectedObjects.push(id); // add it to the array
      
      document.getElementById("img:" + id).style.borderColor = "#5b5b5b"; // set its border colour so you can tell its selected
     
      return 1;
      
    }

  }

  /*
    this method is called by the download handler when it finds
    a selected file has been dragged out of the window, so asks
    for all the files that have been selected (as you would expect
    it to behave)
  */
  this.download = function() {

    //download.startDownload(this.selectedObjects); // start the download with the array of selected items
    
    this.wipe(); // unselect everything if someone wants to select some more stuff

  }

  // method for determining if an object is already selected
  this.is = function(id) {

    selected = 0;
    
    for (var element in this.selectedObjects) { // looks at all elements
    
      if (this.selectedObjects[element] == id) { // if it's the element we're looking for, return the index of the element in the array
      
        selected = element;
      
      }
    
    }
    
    return selected; // if its found, return the index of the element in the array

  }

  // erase the selected objects
  this.wipe = function() {

    this.selectedObjects = [];

  }
  
}
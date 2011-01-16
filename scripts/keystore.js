function Keystore() { // used for persisting data between sessions - screen size, credentials, list view etc

  this.isNull = true;

  this.save = function(user,pass) { // quick way to write user/pass
  
    bytes1 = new air.ByteArray();
    bytes1.writeUTFBytes(user);
    air.EncryptedLocalStore.setItem("username", bytes1);
    
    bytes2 = new air.ByteArray();
    bytes2.writeUTFBytes(pass);
    air.EncryptedLocalStore.setItem("password", bytes2);
  
  }
  
  this.getUsername = function() {
  
    data = air.EncryptedLocalStore.getItem("username");
    
    if (data != null) {
    
      this.isNull = false;
    
      return data.readUTFBytes(data.length);
    
    } else {
    
      return "";
    
    }
  
  }
  
  this.getPassword = function() {
  
    data = air.EncryptedLocalStore.getItem("password");
    
    if (data != null) {
    
      this.isNull = false;
    
      return data.readUTFBytes(data.length);
    
    } else {
    
      return "";
    
    }
  
  }
  
  this.getChecked = function() { // respond if checkbox is checked or not - this is dumped straight into the tag in the form
  
    if (!this.isNull) {
    
      return "checked='checked'";
    
    } else {
    
      return "";
    
    }
  
  }
  
  this.isList = function() { // figures out if list from last session
  
    data = air.EncryptedLocalStore.getItem("list");
    
    if (data != null) {
    
      isList = data.readUTFBytes(data.length);
      
      if (isList == "true") {
      
        return true;
        
      } else {
      
        return false;
      
      }
    
    } else {
    
      bytes = new air.ByteArray();
      bytes.writeUTFBytes("false");
      air.EncryptedLocalStore.setItem("list", bytes);
    
      return false;
    
    }
  
  }
  
  this.setList = function(isList) { // sets whether or not list
  
    if (isList) {
    
      bytes = new air.ByteArray();
      bytes.writeUTFBytes("true");
      air.EncryptedLocalStore.setItem("list", bytes);
    
    } else {
    
      bytes = new air.ByteArray();
      bytes.writeUTFBytes("false");
      air.EncryptedLocalStore.setItem("list", bytes);
    
    }
  
  }
  
  this.dontSave = function() { // removes stuff if checkbox removed
  
    air.EncryptedLocalStore.removeItem("username");
    air.EncryptedLocalStore.removeItem("password");
  
  }
  
  this.saveDimensions = function() { // handles dimension saving
  
    bytes1 = new air.ByteArray();
    bytes1.writeUTFBytes(window.nativeWindow.width);
    air.EncryptedLocalStore.setItem("width", bytes1);
    
    bytes2 = new air.ByteArray();
    bytes2.writeUTFBytes(window.nativeWindow.height);
    air.EncryptedLocalStore.setItem("height", bytes2);
  
  }
  
  this.setDimensions = function() { // retrieves dimensions
  
    width = air.EncryptedLocalStore.getItem("width");
    
    if (width != null) {
    
      wid = width.readUTFBytes(width.length);
    
      window.nativeWindow.width = wid;
      $("#header,#footer").width(wid);

    }
    
    height = air.EncryptedLocalStore.getItem("height");
    
    if (height != null) {
    
      window.nativeWindow.height = height.readUTFBytes(height.length);

    }
  
  }

}
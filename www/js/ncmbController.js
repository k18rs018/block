// This is a JavaScript file

// ncmbController.js

var ncmbController = {
  APPLICATION_KEY: "134968afb07163a8af4430c2bc7b3057a5213e2039043ed5d6dd321783017f61",
  CLIENT_KEY: "7e5dbee9cfb18fefc4b94e6765a377e2b0277482af1b561e23007a5ad4fdf549",

  ncmb: null,
  currentUser: null,
  screenSize: null,

  init: function(screenSize) {
    var self = this;
    self.ncmb = new NCMB(self.APPLICATION_KEY,self.CLIENT_KEY);
    self.screenSize = screenSize;
  }
}
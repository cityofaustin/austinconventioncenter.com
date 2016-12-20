//= require uswds/dist/js/uswds.min.js
//= require photoswipe

var delegate = require("dom-delegate"), // https://github.com/ftlabs/ftdomdelegate
    folders = require("components/folders"),
    sidenav = require("components/sidenav");

document.addEventListener("DOMContentLoaded", function() {
  var mainDelegate = delegate(document);

  folders.init(mainDelegate);
  sidenav.init(mainDelegate);
});

//= require uswds/dist/js/uswds.min.js
//= require photoswipe

var delegate = require("dom-delegate"), // https://github.com/ftlabs/ftdomdelegate
    folders = require("components/folders"),
    nav = require("components/nav"),
    sidenav = require("components/sidenav");

document.addEventListener("DOMContentLoaded", function() {
  var mainDelegate = delegate(document);

  folders.init(mainDelegate);
  nav.init(mainDelegate);
  sidenav.init(mainDelegate);
});

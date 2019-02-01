
//= require photoswipe
//= require click_tracking

var delegate = require("dom-delegate"), // https://github.com/ftlabs/ftdomdelegate
    folders = require("components/folders"),
    nav = require("components/nav"),
  sidenav = require("components/sidenav"),
accordion = require("components/accordion");

document.addEventListener("DOMContentLoaded", function() {
  var mainDelegate = delegate(document);

  folders.init(mainDelegate);
  nav.init(mainDelegate);
  sidenav.init(mainDelegate);
  accordion.init(mainDelegate);
});

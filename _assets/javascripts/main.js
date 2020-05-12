
//= require photoswipe
//= require click_tracking
//= require meet_the_team

var delegate = require("dom-delegate"), // https://github.com/ftlabs/ftdomdelegate
    folders = require("components/folders"),
    nav = require("components/nav"),
    sidenav = require("components/sidenav"),
    accordion = require("components/accordion"),
    filter = require("components/gallery-filter");

document.addEventListener("DOMContentLoaded", function () {
  var mainDelegate = delegate(document);

  folders.init(mainDelegate);
  nav.init(mainDelegate);
  sidenav.init(mainDelegate);
  accordion.init(mainDelegate);
  filter.init(mainDelegate);
});

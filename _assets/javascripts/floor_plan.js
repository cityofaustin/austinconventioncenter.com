//= require element-closest/element-closest.js
//= require tether/dist/js/tether.js
//= require tether-drop/dist/js/drop.js
//= require tether-tooltip/dist/js/tooltip.js

(function() {

  function createTooltip (target, text) {
    var verticalPosition = target.id.match(/Level/) ? "middle" : "top";

    return new Tooltip({
      target: target,
      position: verticalPosition + " center",
      content: text,
      hoverCloseDelay: 0,
      classes: "tooltip-theme-twipsy acc-floor-plan-map-tooltip"
    });
  }

  // By default, IE <= 11 renders the map SVG as ~150px tall regardless of its width.
  function setHeight(parent, svg) {
    var bbox = svg.getBBox();

    // Heuristic comparison to target IE's problem w/o affecting other browsers; expects the SVG's
    // viewBox to exceed IE's default height.
    if (parent.offsetHeight < bbox.height) {
      svg.style.height = ((bbox.height / bbox.width) * parent.offsetWidth) + "px";
    }
  }

  function initClickableFloorPlan () {
    var map = document.getElementById("acc-floor-plan-map"),
        svg = map.getElementsByTagName("svg")[0],
        nav = document.getElementById("acc-floor-plan-nav"),
        navItems = {};

    if (!svg || !nav) return;

    setHeight(map, svg); // IE fix

    var elements = svg.querySelectorAll("[id^='clickable-']");

    Array.prototype.forEach.call(elements, function (element) {
      var name = element.id.substr(10).split("_").join(" "),
          slug = name.split(" ").join("-").toLowerCase();

      var tooltip = createTooltip(element, name); // Default tooltip to layer name

      var navItem = nav.querySelector("a[data-slug='" + slug + "']");

      if (navItem) {
        tooltip.content = navItem.title; // Update tooltip to match nav, if found

        element.classList.add("acc-floor-plan-map-clickable");

        if (location.pathname == navItem.getAttribute("href")) {
          element.classList.add("acc-floor-plan-map-current");
        }

        navItems[element.id] = navItem; // Cache for the click handler
      }
    });

    svg.addEventListener("click", function (event) {
      var clickable = event.target.closest("[id^='clickable']");
      if (clickable) {
        var navItem = navItems[clickable.id];
        if (navItem) { location.assign(navItem.href); }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    initClickableFloorPlan();
  });

})();

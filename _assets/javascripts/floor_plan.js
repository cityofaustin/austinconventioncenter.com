//= require element-closest/element-closest.js
//= require tether-tooltip/node_modules/tether/dist/js/tether.js
//= require tether-tooltip/node_modules/tether-drop/dist/js/drop.js
//= require tether-tooltip/dist/js/tooltip.js

(function() {

  function createTooltip (target, text) {
    return new Tooltip({
      target: target,
      position: "top center",
      content: text,
      hoverOpenDelay: 50,
      classes: "tooltip-theme-twipsy acc-floor-plan-map-tooltip"
    });
  }

  function initClickableFloorPlan () {
    var svg = document.querySelector("#acc-floor-plan-map > svg"),
        nav = document.getElementById("acc-floor-plan-nav"),
        navItems = {},
        clickableRegex = /^clickable-/;

    if (!svg || !nav) return;

    Array.prototype.forEach.call(svg.children, function (element) {
      if (clickableRegex.test(element.id)) {
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
      } else {
        // Prevent mouseover on room names from hiding tooltips
        element.style.pointerEvents = "none";
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

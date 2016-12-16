function toggleSidenav (event) {
  var toggleElements = document.querySelectorAll(".acc-sidenav, .acc-overlay"),
      closeButton = document.querySelector(".acc-sidenav-close");

  Array.prototype.forEach.call(toggleElements, function (element) {
    element.classList.toggle("is-visible");
  });

  closeButton.focus();
  event.preventDefault();
}

function sidenavInit (delegate) {
  delegate.on("click", ".acc-sidenav-button, .acc-sidenav-close, .acc-overlay", toggleSidenav)
}

module.exports.init = sidenavInit;

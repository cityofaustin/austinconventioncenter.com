function toggleNav (event) {
  document.querySelector(".acc-nav-button").classList.toggle("is-active");
  document.querySelector(".acc-nav").classList.toggle("is-visible");
  event.preventDefault();
}

function navInit (delegate) {
  delegate.on("click", ".acc-nav-button", toggleNav);
}

module.exports.init = navInit;

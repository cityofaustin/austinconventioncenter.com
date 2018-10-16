function toggleNav (event) {
  document.querySelector(".acc-nav-button").classList.toggle("is-active");
  document.querySelector(".acc-nav").classList.toggle("is-visible");
  event.preventDefault();
}

function navInit (delegate) {
  delegate.on("click", ".acc-nav-button", toggleNav);
}

module.exports.init = navInit;

$(document).ready(function() {
  $('.acc-nav-close-button').click(function() {
    event.preventDefault();
    $(this).parent('div').attr('aria-hidden', 'true');
    $(this).parent('div').prev('button').attr('aria-expanded', 'false');
  });
});

function toggleNav (event) {
  document.querySelector(".acc-nav-button").classList.toggle("is-active");
  document.querySelector(".acc-nav").classList.toggle("is-visible"); // main menu
  event.preventDefault();
}

function navInit (delegate) {
  delegate.on("click", ".acc-nav-button", toggleNav); // hamburger
}

$(document).ready(function () {
  $('.acc-nav-close-button').click(function () {
    console.log('CLICK');
    event.preventDefault();
    $(this).closest('.acc-nav-section').attr('aria-hidden', 'true');
    $(this).closest('.acc-nav-section').prev('button').attr('aria-expanded', 'false');
  });
});

module.exports.init = navInit;

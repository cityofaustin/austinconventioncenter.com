$(document).ready(function () {
  $('.acc-bio-toggle-button').click(function() {
    $(this).next('.acc-employee-bio').show();
  });
  $('.acc-employee-bio').click(function() {
    $(this).hide();
  })
});

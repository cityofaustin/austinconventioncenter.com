$(document).ready(function() {

  // Send to Google Analytics
  function reportEvent(category, action, label) {
    ga('send', 'event', {
      eventCategory: category,
      eventAction: action,
      eventLabel: label
    });
  };

  function reportFormSubmisson(event) {
    ga('send', 'event', {
      eventCategory: 'Form Submission',
      eventAction: 'Form Submitted',
      eventLabel: 'Request a Proposal',
      transport: 'beacon'
    });
  }

/*
  Photo Carousel
*/
  // When the Previous button is clicked
  $('.jcarousel-control-prev').click(function() {
    reportEvent('Photo Carousel', 'Previous Button Click', window.location.pathname);
  });

  // When the Next button is clicked
  $('.jcarousel-control-next').click(function() {
    reportEvent('Photo Carousel', 'Next Button Click', window.location.pathname);
  });

  // When the thumbnail is clicked to render the full-screen photo
  $('.carousel-image-link').click(function() {
    reportEvent('Photo Carousel', 'Photo Click', window.location.pathname);
  });

  // When one of the pagination dots is clicked
  $('.jcarousel-pagination a').click(function() {
    reportEvent('Photo Carousel', 'Pagination Click', window.location.pathname);
  });

  // When the carousel slides to a new photo
  $('.jcarousel').on('jcarousel:scrollend', function(event, carousel) {
    reportEvent('Photo Carousel', 'Photo Scroll', window.location.pathname);
  });

  // When the carousel is loaded
  $('.jcarousel').on('jcarousel:create', function(event, carousel) {
    reportEvent('Photo Carousel', 'Carousel Loaded', window.location.pathname);
  });

/*
  Homepage Hero Button(s)
*/
  $('.acc-hero .acc-button').click(function() {
    reportEvent('Hero Button Click', $(this).text()), window.location.pathname;
  });

/*
  RFP Link
*/
  // When the external RFP link is clicked
  $('.acc-rfp-link').click(function() {
    reportEvent('RFP External Link Click', $(this).text(), window.location.pathname);
  });

/*
  External Links
*/
  // When a sidebar PDF button is clicked
  $('.acc-button-pdf').click(function() {
    var buttonText = $(this).text().replace('Download ', '');
    reportEvent('PDF Button Click', buttonText + ' PDF', window.location.pathname);
  });

  // When a sidebar external link button is clicked
  $('.acc-external-link').click(function() {
    reportEvent('Sidebar External Link Click', $(this).children('span:first').text(), window.location.pathname);
  });

  // When a text link within a content block is clicked
  // NOTE: the .acc-inline-external-link class must be applied via markdown in the Contentful Content Item
  $('.acc-inline-external-link').click(function() {
    reportEvent('Inline Link Click', $(this).text() + ' (Text link)', window.location.pathname);
  });

});

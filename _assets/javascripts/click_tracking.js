$(document).ready(function() {

  // Send to Google Analytics
  function reportEvent(category, action, label) {
    ga('send', 'event', {
      eventCategory: category,
      eventAction: action,
      eventLabel: label
    });
  };  

/*
  Page Banner Button(s)
*/
  $('.acc-page-banner .acc-button').click(function() {
    reportEvent('Page Banner Button Click', $(this).text()), window.location.pathname;
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
  // When a PDF button is clicked
  $('.acc-button-pdf').click(function() {
    var buttonText = $(this).text().replace('Download ', '');
    reportEvent('PDF Button Click', buttonText + ' PDF', window.location.pathname);
  });

  // When an external link button is clicked
  $('.acc-external-link').click(function() {
    reportEvent('External Link Click', $(this).children('span:first').text(), window.location.pathname);
  });

  // When a text link within a content block is clicked
  // NOTE: the .acc-inline-external-link class must be applied via markdown in the Contentful Content Item
  $('.acc-inline-external-link').click(function() {
    reportEvent('External Link Click', $(this).text() + ' (Text link)', window.location.pathname);
  });

});

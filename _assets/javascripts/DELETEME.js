$( document ).ready(function() {
  console.log( "jquery ready!" );

  $.urlParam = function(name){
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      if (results==null){
         return null;
      }
      else{
        console.log("in the Else statement");
         return decodeURI(results[1]) || 0;
      }
  };

  $overlay = $('.acc-hero-overlay');

  if ($.urlParam('bgcolor') == 'black'){
    $bgcolor = "0,0,0,";
  }

  else if ($.urlParam('bgcolor') == 'white'){
    $bgcolor = "255,255,255,";
  }

  else {
    $bgcolor = "152,31,205,";
  }

  if ($.urlParam('bgalpha')) {
    $bgrgba = $bgcolor + '.' + $.urlParam('bgalpha')
  }

  else {
    $bgrgba = $bgcolor + '0';
  }

  if ($.urlParam('bgimg')) {
    $bgimg = $.urlParam('bgimg');
  }
  else {
    $bgimg = 'cubes.png';
  }

  $overlay.css({
    "background-color": "rgba(" + $bgrgba + ")",
    "background-image": "url(https://www.transparenttextures.com/patterns/" + $bgimg + ".png)"
  });

});

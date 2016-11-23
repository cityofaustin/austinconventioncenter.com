//= require photoswipe/dist/photoswipe.js
//= require photoswipe/dist/photoswipe-ui-default.js

(function() {

  function handleThumbnailClick(event) {
    event.preventDefault();

    if (event.target !== event.currentTarget) {
      var item = event.target;

      while (item.tagName && item.tagName.toLowerCase() !== "figure") {
        item = item.parentNode;
      }

      if (item.getAttribute) {
        var index = parseInt(item.getAttribute("data-index"), 10);
        openPhotoSwipe(event.currentTarget, index);
      }
    }
  }

  function parseItems(gallery) {
      var items = [];

      Array.prototype.forEach.call(gallery.children, function(figure, i) {
        var a = figure.getElementsByTagName("a")[0],
            caption = figure.getElementsByTagName("figcaption")[0];

        var srcWidth = parseInt(a.getAttribute("data-width"), 10);
        var srcHeight = parseInt(a.getAttribute("data-height"), 10);

        var item = {
          url: a.getAttribute("data-url"),
          width: srcWidth,
          height: srcHeight,
          parent: figure,
          pid: figure.getAttribute("data-pid")
        };

        if (caption) { item.title = caption.innerHTML; }

        items.push(item);
      });

      return items;
  }

  function openPhotoSwipe(gallery, index) {
    var pswpElement = document.querySelector(".pswp");

    var items = parseItems(gallery);

    var options = {
      index: index,
      galleryUID: gallery.getAttribute("data-gid"),
      galleryPIDs: true,
      getThumbBoundsFn: false,
      shareEl: false,
      showHideOpacity: true
    };

    var photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

    photoswipe.listen("gettingData", function(index, item) {
      setData(photoswipe, item);
    });

    photoswipe.init();
  }

  function setData(photoswipe, item) {
    var realViewportWidth = photoswipe.viewportSize.x * window.devicePixelRatio,
        maxWidth;

    if (realViewportWidth > 1900) { // Desktops and retina laptops
      maxWidth = 2700;
    } else if (realViewportWidth > 1350) { // Non-retina laptops
      maxWidth = 1800;
    } else if (realViewportWidth > 700) { // Newer phones
      maxWidth = 1200;
    } else { // Older phones
      maxWidth = 600;
    }

    var fit = calculateAspectRatioFit(item.width, item.height, maxWidth, maxWidth);

    item.src = item.url + "?w=" + Math.round(fit.width).toString();
    item.w = fit.width;
    item.h = fit.height;
  }

  function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }

  function initPhotoSwipeFromDOM() {
    var galleryElements = document.querySelectorAll(".acc-gallery");

    Array.prototype.forEach.call(galleryElements, function (gallery, i) {
      gallery.addEventListener("click", handleThumbnailClick);
    });
  }

  function parseHash() {
    var hash = location.hash.substring(1),
        params = {},
        regex = /([gp]id)=([^&]+)/;

    Array.prototype.forEach.call(hash.split("&"), function(param, i) {
      var match = param.match(regex);
      if (match) { params[match[1]] = match[2]; }
    });

    return params;
  }

  function openPhotoSwipeFromHash() {
    var params = parseHash();

    if (params.gid) {
      var gallery = document.querySelector("div[data-gid='" + params.gid + "']");

      if (gallery) {
        var figure = params.pid ? gallery.querySelector("figure[data-pid='" + params.pid + "']") : null;
        openPhotoSwipe(gallery, figure ? parseInt(figure.getAttribute("data-index"), 10) : 0);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    initPhotoSwipeFromDOM();
    openPhotoSwipeFromHash();
  });

})();

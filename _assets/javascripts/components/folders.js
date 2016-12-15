(function () {

  function toggleFolder (event) {
    var folder = event.currentTarget;
    folder.getAttribute("aria-expanded") === "true" ? hideFolder(folder) : showFolder(folder);
  }

  function showFolder (folder) {
    var content = document.getElementById(folder.getAttribute("aria-controls"));

    folder.setAttribute("aria-expanded", true);
    content.setAttribute("aria-hidden", false);
  }

  function hideFolder (folder) {
    var content = document.getElementById(folder.getAttribute("aria-controls"));

    folder.setAttribute("aria-expanded", false);
    content.setAttribute("aria-hidden", true);
  }

  function setupFolders () {
    var folders = document.querySelectorAll('.acc-folder-control');

    Array.prototype.forEach.call(folders, function (folder) {
      folder.addEventListener("click", toggleFolder);

      if (folder.getAttribute("aria-expanded") === "true") {
        showFolder(folder);
      } else {
        hideFolder(folder);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    setupFolders();
  });

})();

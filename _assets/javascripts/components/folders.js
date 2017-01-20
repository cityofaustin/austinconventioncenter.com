function toggleFolder (event) {
  var folder = event.target;
  folder.getAttribute("aria-expanded") === "true" ? hideFolder(folder) : showFolder(folder);
  event.preventDefault();
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

function initFolders (delegate) {
  var folders = document.querySelectorAll('.acc-folder-control');

  Array.prototype.forEach.call(folders, function (folder) {
    if (folder.getAttribute("aria-expanded") === "true") {
      showFolder(folder);
    } else {
      hideFolder(folder);
    }
  });

  delegate.on("click", ".acc-folder-control", toggleFolder);
}

module.exports.init = initFolders;

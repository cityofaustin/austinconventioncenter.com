
function select(selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector));
};

function dashify(word) {
  // convert "My Label" -> "my-label"
  return word.replace(/\s/g, '-').toLowerCase();
}

function createCheckbox(label) { 
  var id = 'uid-' + dashify(label);
  var li = document.createElement('li');

  var input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('value', label);
  input.id = id;

  var div = document.createElement('div');
  div.classList.add('check-container');

  var span = document.createElement('span');
  var i = document.createElement('i');
  i.classList.add('fas');
  i.classList.add('fa-check');
  span.appendChild(i);
  
  div.appendChild(input);
  div.appendChild(span);

  var labelNode = document.createElement('label');
  labelNode.setAttribute('for', id);
  labelNode.innerHTML = label;
  
  li.appendChild(div);
  li.appendChild(labelNode);
  return li;
}

function galleryInit() { 
  var ALL = 'Select All';
  var node = document.getElementById('gallery-filter-content');
  var noImages = document.getElementById('no-gallery-images');
  if (!node) {
    // not on gallery page
    return;
  }
  
  // Filters are based off of image tags (data-tag)
  // If tags are added to contentful, tags will 
  // automatically appear in the list.
  // Therefore, there won't be a tag that does not 
  // match an image.
  //
  var images = select('img[data-tag]');
  var tags = images.map(function (img) { 
    return img.getAttribute('data-tag');
  }).filter(function (tag, i, tags) { 
    return tags.indexOf(tag) === i;
  });
  tags.unshift(ALL);

  var list = document.createElement('ul');
  var lis = tags.map(createCheckbox);
  var checks = [];
  lis.forEach(function (li) {
    list.appendChild(li);
    checks.push(li.querySelector('input'));
  });
  node.appendChild(list);
  
  function setChecks(checked) {
    // set all checks checked or not checked
    checks.forEach(function (check) {
      check.checked = checked;
    });
  }

  function setImages() {
    // get array of selected tags
    var checked = checks.filter(function (check) {
      return check.checked;
    }).map(function (check) { 
      return check.value;
    });

    // hide/show images based on selected tags
    var hasMatch = false;
    images.forEach(function (img) { 
      var tag = img.getAttribute('data-tag');
      var display = checked.indexOf(tag) > -1 ? '' : 'none';
      img.parentNode.parentNode.style.display = display;
      if (display === '') {
        hasMatch = true;
      }
    });
    noImages.style.display = hasMatch ? '' : 'block';
  }

  node.addEventListener('click', function (e) {
    // clicked on something besides a checkbox (like a li)
    if (e.target.localName !== 'input') {
      return;
    }
    const value = e.target.value;
    if (value === ALL) {
      // Select All (or none)
      setChecks(e.target.checked);
    }
    setImages();
  });

  // initialize
  setChecks(true);
}

module.exports.init = galleryInit;

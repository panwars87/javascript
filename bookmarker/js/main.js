//@author = Shashant Panwar
//console.log('App loaded');

document.getElementById('myForm').addEventListener('submit', saveBookmark);

//Event functions
function saveBookmark(e) {
  var siteName = document.getElementById('siteName').value;
  var siteURL = document.getElementById('siteURL').value;

  if (!validateForm(siteName, siteURL)) {
    return false;
  }

  var bookmark = {
      name: siteName,
      url: siteURL
    }

  persistData(bookmark);
  fetchBookMarks();
  //clear form
  document.getElementById('myForm').reset();

  e.preventDefault();
}

//Event functions
function fetchBookMarks() {
  var bookmarkResults = document.getElementById('bookmarkResults');
  console.log(JSON.stringify(getStorageData()));
  var bookmark = getStorageData();
  var list = '<div>';

  for (var i = 0; i < bookmark.length; i++) {
    list += '<div class="well">' +
            '<h3>' + bookmark[i].name +
            ' <a target="_blank" href="' + bookmark[i].url + '" class="btn btn-primary">Visit</a>' +
            ' <a onClick="deleteBookMark(\'' + bookmark[i].url + '\')" href="#" class="btn btn-danger">Delete</a>' +
            '</h3></div>';
  }

  list += '</div>';

  bookmarkResults.innerHTML = list;
}

//Helper functions
//persist new bookmark in localstorage. This calls set & get localStorage.
function deleteBookMark(url) {
  var bookmarksArr = getStorageData();
  checkURLAlreadyExists(url, true);
  setStorageData(bookmarksArr);
  fetchBookMarks();
}

function persistData(bookmark) {
  console.log('Bookmark : ' + JSON.stringify(bookmark));
  var bookmarksArr = getStorageData();
  bookmarksArr.push(bookmark);
  setStorageData(bookmarksArr);
}

//get data from localStorage. Do not call this method directly.
function getStorageData() {
  if (localStorage.getItem('bookmarksArr') === null) {
    return bookmarksArr = [];
  } else {
    return bookmarksArr = JSON.parse(localStorage.getItem('bookmarksArr'));
  }
}

//set updated bookmarksArr to localStorage. Do not call this method directly.
function setStorageData(bookmarksArr) {
  localStorage.setItem('bookmarksArr', JSON.stringify(bookmarksArr));
}

function validateForm(siteName, siteURL) {
  var status = true;
  if ((!siteName) || (!siteURL)) {
    errorCall('fieldError');
    status = false;
  } else if (!checkURL(siteURL)) {
    errorCall('urlError');
    status = false;
  } else if (checkURLAlreadyExists(siteURL, false)) {
    errorCall('urlAlreadyExistsError');
    status = false;
  }

  return status;
}

function errorCall(errorType) {
  if (errorType === 'fieldError') {
    alert('Site name & URL is mandatory!!!');
  } else if (errorType === 'urlError') {
    alert('URL should be in proper format. Eg: http://www.google.com');
  } else if (errorType === 'urlAlreadyExistsError') {
    alert('URL already exists!!!');
  }

  return false;
}

function checkURL(url) {
  var expression = /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;
  var regex = new RegExp(expression);
  return regex.test(url);
}

function checkURLAlreadyExists(url, deleteFlag) {
  for (var i = 0; i < bookmarksArr.length; i++) {
    if (bookmarksArr[i].url === url) {
      if (deleteFlag) {
        bookmarksArr.splice(i, 1);
      } else {
        return true;
      }
    }
  }
}
